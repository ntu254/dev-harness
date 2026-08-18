import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { HandoffManager } from '../src/handoff/HandoffManager.js';
import { HandoffValidator } from '../src/handoff/HandoffValidator.js';
import { CheckpointManager } from '../src/handoff/CheckpointManager.js';
import type { ContextBundle, VerificationProof } from '@dev-harness/spec';

describe('Phase 4: Checkpoint & Cross-Agent Handoff Manager (Gates 1, 2, 3, 4, 5)', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'harness-handoff-test-'));

    // Create workspace initial files
    fs.mkdirSync(path.join(tempDir, 'src'), { recursive: true });
    fs.writeFileSync(path.join(tempDir, 'package.json'), '{"name":"app"}');
    fs.writeFileSync(path.join(tempDir, 'src', 'auth.ts'), 'export const auth = true;');
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('Gate 1: CheckpointManager creates and persists checkpoint metadata', () => {
    const cpManager = new CheckpointManager(tempDir);
    const cp = cpManager.createCheckpoint('RUN-01', 'SES-01', 'CP-001', 'Auth module scaffolded');

    expect(cp.checkpointId).toBe('CP-001');
    expect(cp.treeFingerprint).toHaveLength(64);

    const loaded = cpManager.getCheckpoint('CP-001');
    expect(loaded?.checkpointId).toBe('CP-001');
    expect(loaded?.treeFingerprint).toBe(cp.treeFingerprint);
  });

  it('Gates 2 & 3: HandoffManager computes 3 canonical fingerprints and generates handoff artifacts', () => {
    const handoffManager = new HandoffManager(tempDir);

    const contextBundle: ContextBundle = {
      runId: 'RUN-01',
      budget: { maxTokens: 50000, allocatedTokens: 1000 },
      project: { id: 'proj-1', rootPath: tempDir },
      files: [{ path: 'src/auth.ts', content: 'export const auth = true;', hash: 'hash1' }],
      symbols: [],
      graphNeighborhood: { focalSymbols: [], edges: [] },
      memories: [],
      decisions: [],
      failures: [],
      gitContext: { branch: 'main', headCommit: 'head-1', recentDiffSummary: '' },
      provenance: [],
    };

    const verificationProof: VerificationProof = {
      level: 'harness-executed',
      passedGates: ['test_suite_execution'],
      failedGates: [],
      rawEvidence: { exitCode: 0 },
      timestamp: new Date().toISOString(),
    };

    const handoff = handoffManager.createHandoff({
      handoffId: 'HANDOFF-042',
      sourceRunId: 'RUN-01',
      sourceSessionId: 'SES-01',
      sourceCheckpointId: 'CP-001',
      contextBundle,
      verificationProof,
      summary: 'Authentication JWT scaffolded with Vitest tests passing',
      currentState: 'COMPLETED',
      changedFiles: [{ path: 'src/auth.ts', status: 'added' }],
      nextRecommendedActions: [
        'Implement refresh token rotation',
        'Add Redis distributed lock for session persistence',
      ],
    });

    expect(handoff.handoffId).toBe('HANDOFF-042');
    expect(handoff.fingerprints.workspaceFingerprint).toHaveLength(64);
    expect(handoff.fingerprints.contextFingerprint).toHaveLength(64);
    expect(handoff.fingerprints.verificationFingerprint).toHaveLength(64);

    // Verify persisted directory files
    const handoffDir = path.join(tempDir, '.harness', 'runtime', 'handoffs', 'HANDOFF-042');
    expect(fs.existsSync(path.join(handoffDir, 'handoff.json'))).toBe(true);
    expect(fs.existsSync(path.join(handoffDir, 'summary.md'))).toBe(true);
    expect(fs.existsSync(path.join(handoffDir, 'changed-files.json'))).toBe(true);
    expect(fs.existsSync(path.join(handoffDir, 'next-recommended-actions.json'))).toBe(true);

    const loaded = handoffManager.getHandoff('HANDOFF-042');
    expect(loaded?.handoffId).toBe('HANDOFF-042');
    expect(loaded?.summary).toBe(handoff.summary);
  });

  it('Gate 4 & 5: HandoffValidator detects HANDOFF_VALID vs HANDOFF_STALE on external file mutations', () => {
    const handoffManager = new HandoffManager(tempDir);
    const validator = new HandoffValidator(tempDir);

    const contextBundle: ContextBundle = {
      runId: 'RUN-01',
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

    const verificationProof: VerificationProof = {
      level: 'harness-executed',
      passedGates: ['tests'],
      failedGates: [],
      rawEvidence: { exitCode: 0 },
      timestamp: new Date().toISOString(),
    };

    const handoff = handoffManager.createHandoff({
      handoffId: 'HANDOFF-099',
      sourceRunId: 'RUN-01',
      sourceSessionId: 'SES-01',
      sourceCheckpointId: 'CP-001',
      contextBundle,
      verificationProof,
      summary: 'Work done by Agent 1',
      currentState: 'COMPLETED',
      changedFiles: [{ path: 'src/auth.ts', status: 'modified' }],
      nextRecommendedActions: ['Continue by Agent 2'],
    });

    // 1. Initial validation: Valid
    const validResult = validator.validate(handoff);
    expect(validResult.isValid).toBe(true);
    expect(validResult.status).toBe('HANDOFF_VALID');

    // 2. External mutation occurs (User or external tool edits code without Harness)
    fs.writeFileSync(path.join(tempDir, 'src', 'auth.ts'), 'export const auth = "TAMPERED_EXTERNALLY";');

    // 3. Re-validation: Stale detected
    const staleResult = validator.validate(handoff);
    expect(staleResult.isValid).toBe(false);
    expect(staleResult.status).toBe('HANDOFF_STALE');
    expect(staleResult.mismatchReason).toBeDefined();
    expect(staleResult.actualWorkspaceFingerprint).not.toBe(staleResult.expectedWorkspaceFingerprint);
  });
});
