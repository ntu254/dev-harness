import { describe, it, expect } from 'vitest';
import { ClaudeCodeAdapter } from '../src/ClaudeCodeAdapter.js';
import { CursorAiderAdapter } from '../src/CursorAiderAdapter.js';
import { ProgrammaticMockAdapter } from '../src/ProgrammaticMockAdapter.js';
import type { AgentRunInput, ContextBundle } from '@dev-harness/spec';

describe('Phase 5 Adapters: Claude Code, Cursor & Mock Adapters', () => {
  it('Complies with AgentAdapter lifecycle (createSession -> startRun -> collectUsage -> endSession)', async () => {
    const claudeAdapter = new ClaudeCodeAdapter();
    const features = claudeAdapter.features();
    expect(features.supportsMcp).toBe(true);
    expect(features.contextWindow).toBe(200000);

    const sessionId = await claudeAdapter.createSession({
      sessionId: 'ses-claude-1',
      projectId: 'proj-ecommerce',
      features,
    });
    expect(sessionId).toBe('ses-claude-1');

    const dummyContext: ContextBundle = {
      runId: 'run-1',
      budget: { maxTokens: 100000, allocatedTokens: 1000 },
      project: { id: 'proj-ecommerce', rootPath: '/tmp' },
      files: [],
      symbols: [],
      graphNeighborhood: { focalSymbols: [], edges: [] },
      memories: [],
      decisions: [],
      failures: [],
      gitContext: { branch: 'main', headCommit: 'h1', recentDiffSummary: '' },
      provenance: [],
    };

    const runInput: AgentRunInput = {
      runId: 'run-1',
      sessionId: 'ses-claude-1',
      intent: 'Build auth module',
      acceptanceCriteria: ['Pass test'],
      contextBundle: dummyContext,
      effectiveCapabilities: ['filesystem.read', 'filesystem.write', 'terminal.exec'],
    };

    await claudeAdapter.startRun(runInput);
    const usage = await claudeAdapter.collectUsage('run-1');
    expect(usage.totalTokens).toBeGreaterThan(0);
    expect(usage.estimatedCostUsd).toBeGreaterThan(0);

    await claudeAdapter.endSession(sessionId);
  });

  it('CursorAiderAdapter initializes and reports usage correctly', async () => {
    const cursorAdapter = new CursorAiderAdapter();
    expect(cursorAdapter.id).toBe('cursor-aider');

    const sessionId = await cursorAdapter.createSession({
      sessionId: 'ses-cursor-1',
      projectId: 'proj-ecommerce',
      features: cursorAdapter.features(),
    });
    expect(sessionId).toBe('ses-cursor-1');
  });

  it('ProgrammaticMockAdapter records received contexts accurately', async () => {
    const mockAdapter = new ProgrammaticMockAdapter('agent-test');
    await mockAdapter.createSession({
      sessionId: 'ses-mock',
      projectId: 'proj-1',
      features: mockAdapter.features(),
    });

    const dummyContext: ContextBundle = {
      runId: 'run-mock',
      budget: { maxTokens: 50000, allocatedTokens: 500 },
      project: { id: 'proj-1', rootPath: '/tmp' },
      files: [],
      symbols: [],
      graphNeighborhood: { focalSymbols: [], edges: [] },
      memories: [],
      decisions: [],
      failures: [],
      gitContext: { branch: 'main', headCommit: 'h1', recentDiffSummary: '' },
      provenance: [],
    };

    await mockAdapter.sendContext('run-mock', dummyContext);
    expect(mockAdapter.receivedContexts.get('run-mock')).toEqual(dummyContext);
  });
});
