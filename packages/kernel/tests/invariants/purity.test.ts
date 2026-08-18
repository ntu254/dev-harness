import { describe, it, expect } from 'vitest';
import { RunManager } from '../../src/domain/run/RunManager.js';
import { SessionManager } from '../../src/domain/session/SessionManager.js';
import { EventStore } from '../../src/domain/events/EventStore.js';
import { SecretRedactor } from '../../src/domain/events/SecretRedactor.js';
import type { ContextBundle, AgentFeatures } from '@dev-harness/spec';

describe('Invariant Tests: Domain Core Purity & Secret Redaction (Gate 11)', () => {
  it('Gate 11: Runs complete Session -> Run -> Event lifecycle purely in-memory with zero I/O', () => {
    const secretRedactor = new SecretRedactor();
    secretRedactor.registerSecret('sk-secret-token-12345');

    const eventStore = new EventStore(secretRedactor);
    const sessionManager = new SessionManager();
    const runManager = new RunManager(eventStore);

    const features: AgentFeatures = {
      supportsStreaming: true,
      supportsToolInterruption: true,
      supportsContextCompaction: false,
      supportsMcp: true,
      contextWindow: 128000,
    };

    // 1. Create Session
    const session = sessionManager.createSession({
      sessionId: 'ses-100',
      projectId: 'proj-ecommerce',
      agentId: 'claude-code',
      features,
      createdAt: new Date().toISOString(),
    });
    expect(session.sessionId).toBe('ses-100');

    // 2. Create ContextBundle
    const contextBundle: ContextBundle = {
      runId: 'run-100',
      budget: { maxTokens: 50000, allocatedTokens: 10000 },
      project: { id: 'proj-ecommerce', rootPath: '/workspace' },
      files: [{ path: 'package.json', content: '{"name":"app"}', hash: 'abc1' }],
      symbols: [],
      graphNeighborhood: { focalSymbols: [], edges: [] },
      memories: [],
      decisions: [],
      failures: [],
      gitContext: { branch: 'main', headCommit: 'commit-1', recentDiffSummary: '' },
      provenance: [],
    };

    // 3. Create Run
    const run = runManager.createRun({
      runId: 'run-100',
      sessionId: 'ses-100',
      projectId: 'proj-ecommerce',
      intent: 'Authenticate user with sk-secret-token-12345', // Contains secret
      acceptanceCriteria: ['Return 200 OK'],
      contextBundle,
      effectiveCapabilities: ['filesystem.read', 'filesystem.write'],
    });

    expect(run.getState()).toBe('RECEIVED');

    // Verify secret was redacted in committed event
    const events = eventStore.getEvents('run-100');
    expect(events.length).toBe(1);
    expect(JSON.stringify(events[0])).not.toContain('sk-secret-token-12345');
    expect(JSON.stringify(events[0])).toContain('[REDACTED_SECRET]');

    // 4. Progress State Machine
    run.stateMachine.transition('PLANNED');
    run.setPlan([{ taskId: 'task-1', title: 'Add auth handler', acceptanceCriteria: ['200 OK'], dependencies: [] }]);

    run.stateMachine.transition('AUTHORIZED');
    run.stateMachine.transition('EXECUTING');
    run.stateMachine.transition('VERIFYING');

    // 5. Attach Verification & Checkpoint
    run.setVerification({
      level: 'harness-executed',
      passedGates: ['vitest_auth_spec'],
      failedGates: [],
      rawEvidence: { exitCode: 0 },
      timestamp: new Date().toISOString(),
    });
    run.setCheckpoint('cp-snapshot-001');

    run.stateMachine.transition('COMPLETED');
    run.completedAt = new Date().toISOString();

    const record = run.toRecord();
    expect(record.state).toBe('COMPLETED');
    expect(record.checkpointId).toBe('cp-snapshot-001');
    expect(record.verification?.level).toBe('harness-executed');
    expect(record.events.length).toBe(9); // INIT + 5 Transitions + Plan + Verification + Checkpoint
  });
});
