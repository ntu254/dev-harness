import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { FileRunStore } from '../src/run-store/FileRunStore.js';
import { Run, EventStore, StateMachine, SecretRedactor } from '@dev-harness/kernel';
import type { ContextBundle, RunRecord } from '@dev-harness/spec';

describe('Phase 2 Infrastructure: FileRunStore Durability & Replay (Gates 2, 3, 4)', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'harness-runstore-test-'));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('Gate 2 & 3: Creates directory layout and appends events to events.jsonl on disk', () => {
    const runStore = new FileRunStore(tempDir);
    runStore.initRunDirectory('RUN-001', 'Implement JWT Auth');

    const runDir = path.join(tempDir, '.harness', 'runtime', 'runs', 'RUN-001');
    expect(fs.existsSync(runDir)).toBe(true);
    expect(fs.existsSync(path.join(runDir, 'intent.md'))).toBe(true);
    expect(fs.readFileSync(path.join(runDir, 'intent.md'), 'utf8')).toBe('Implement JWT Auth');

    // Append events
    runStore.appendEvent('RUN-001', {
      eventId: 'evt-1',
      runId: 'RUN-001',
      sessionId: 'SES-001',
      type: 'RUN_INITIALIZED',
      timestamp: new Date().toISOString(),
      payload: { intent: 'Implement JWT Auth with secret-token sk-12345678901234567890' },
    });

    const readEvents = runStore.readEvents('RUN-001');
    expect(readEvents.length).toBe(1);
    expect(readEvents[0].type).toBe('RUN_INITIALIZED');
    // Secret redaction
    expect(JSON.stringify(readEvents[0])).toContain('[REDACTED_SECRET]');
  });

  it('Gate 4: Multi-process crash recovery & event replay test (Process A -> Disk -> Process B)', () => {
    const dummyContextBundle: ContextBundle = {
      runId: 'RUN-42',
      budget: { maxTokens: 50000, allocatedTokens: 1000 },
      project: { id: 'proj-1', rootPath: tempDir },
      files: [],
      symbols: [],
      graphNeighborhood: { focalSymbols: [], edges: [] },
      memories: [],
      decisions: [],
      failures: [],
      gitContext: { branch: 'main', headCommit: 'head-1', recentDiffSummary: '' },
      provenance: [],
    };

    // ==========================================
    // 1. SIMULATE PROCESS A: Executing Run
    // ==========================================
    const redactorA = new SecretRedactor();
    const eventStoreA = new EventStore(redactorA);
    const runStoreA = new FileRunStore(tempDir, redactorA);

    const runA = new Run({
      runId: 'RUN-42',
      sessionId: 'SES-99',
      projectId: 'proj-1',
      intent: 'Build critical payment flow',
      acceptanceCriteria: ['Pass integration tests'],
      contextBundle: dummyContextBundle,
      effectiveCapabilities: ['filesystem.read', 'filesystem.write'],
      eventStore: eventStoreA,
    });

    // Advance State Machine
    runA.stateMachine.transition('PLANNED');
    runA.setPlan([{ taskId: 't-1', title: 'Scaffold module', acceptanceCriteria: ['OK'], dependencies: [] }]);
    runA.stateMachine.transition('AUTHORIZED');
    runA.stateMachine.transition('EXECUTING');
    runA.stateMachine.transition('VERIFYING');
    runA.setVerification({
      level: 'harness-executed',
      passedGates: ['payment_test'],
      failedGates: [],
      rawEvidence: { exitCode: 0 },
      timestamp: new Date().toISOString(),
    });
    runA.setCheckpoint('CP-042');
    runA.stateMachine.transition('COMPLETED');
    runA.completedAt = new Date().toISOString();

    // Persist all events and final RunRecord to disk
    for (const evt of eventStoreA.getEvents('RUN-42')) {
      runStoreA.appendEvent('RUN-42', evt);
    }
    runStoreA.saveRunRecord(runA.toRecord());

    const finalStateA = runA.getState();
    expect(finalStateA).toBe('COMPLETED');

    // ==========================================
    // 2. SIMULATE PROCESS TERMINATION (DESTROY MEMORY)
    // ==========================================
    // Both runA, eventStoreA, and stateMachine in Process A are discarded.

    // ==========================================
    // 3. SIMULATE PROCESS B: Cold Boot from Disk
    // ==========================================
    const runStoreB = new FileRunStore(tempDir);
    const eventsFromDisk = runStoreB.readEvents('RUN-42');
    expect(eventsFromDisk.length).toBe(9);

    const freshEventStoreB = new EventStore();
    const reconstructedStateMachineB = StateMachine.replay('RUN-42', 'SES-99', eventsFromDisk, freshEventStoreB);

    // Assert that Process B state exactly matches Process A state!
    const finalStateB = reconstructedStateMachineB.getState();
    expect(finalStateB).toBe(finalStateA);
    expect(finalStateB).toBe('COMPLETED');
  });
});
