import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';

// Phase 1 - Pure Domain
import {
  SessionManager,
  RunManager,
  EventStore,
  CapabilityResolver,
  PolicyEvaluator,
  SecretRedactor,
} from '@dev-harness/kernel';
import type { Capability, PolicyRule, SandboxSpec } from '@dev-harness/spec';

// Phase 2 - Infrastructure & Context
import {
  FileRunStore,
  ContextEngine,
} from '@dev-harness/infrastructure';

// Phase 3 - Sandbox & Verifier
import { LocalProcessSandboxProvider } from '@dev-harness/sandbox';
import { VerifierRunner } from '@dev-harness/verifier';

// Phase 4 - Checkpoint & Handoff
import {
  CheckpointManager,
  HandoffManager,
  HandoffValidator,
} from '@dev-harness/infrastructure';

// Phase 5 - Adapters
import { ClaudeCodeAdapter, CursorAiderAdapter } from '@dev-harness/adapters';

describe('Phase 6: End-to-End Conformance Test Suite (Cross-Agent Handoff)', () => {
  let workspaceRoot: string;

  beforeEach(() => {
    workspaceRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'dev-harness-e2e-'));

    // 1. Scaffold project files
    fs.mkdirSync(path.join(workspaceRoot, 'src'), { recursive: true });
    fs.mkdirSync(path.join(workspaceRoot, 'tests'), { recursive: true });
    fs.writeFileSync(path.join(workspaceRoot, 'package.json'), JSON.stringify({ name: 'payment-service', version: '1.0.0' }, null, 2));

    // 2. Scaffold ADRs in .harness/knowledge/decisions
    const adrDir = path.join(workspaceRoot, '.harness', 'knowledge', 'decisions');
    fs.mkdirSync(adrDir, { recursive: true });
    fs.writeFileSync(
      path.join(adrDir, 'ADR-001-jwt-auth.md'),
      '# ADR-001: Use JWT with Refresh Token\n\n**Status:** Accepted\n\nMust implement standard HMAC SHA256 tokens.'
    );

    // 3. Scaffold Failures in .harness/knowledge/failures
    const failDir = path.join(workspaceRoot, '.harness', 'knowledge', 'failures');
    fs.mkdirSync(failDir, { recursive: true });
    fs.writeFileSync(
      path.join(failDir, 'FAIL-001.json'),
      JSON.stringify({
        id: 'FAIL-001',
        timestamp: '2026-08-18T20:00:00Z',
        task: 'auth token race',
        evidenceStrength: 'high',
        verifiedAt: '2026-08-18T20:00:00Z',
        supersededBy: null,
        evidence: { runId: 'OLD-01', failingTests: [], observedSymptom: '401' },
        scope: { domain: 'auth' },
        failedHypothesis: 'In-memory array token storage',
        rootCause: 'Race condition on multi-pod deployment',
        lesson: 'Use atomic Redis or distributed lock for token rotation',
        doNotRepeatWhen: ['token_rotation'],
      })
    );
  });

  afterEach(() => {
    fs.rmSync(workspaceRoot, { recursive: true, force: true });
  });

  it('Gate 2 & 3: Complete E2E Lifecycle: Claude Code executes RUN-001 -> HANDOFF-001 -> Cursor resumes RUN-002', async () => {
    // =========================================================================
    // INITIALIZE HARNESS KERNEL & INFRASTRUCTURE SUBSYSTEMS
    // =========================================================================
    const redactor = new SecretRedactor();
    const eventStore = new EventStore(redactor);
    const sessionManager = new SessionManager();
    const runManager = new RunManager(eventStore);
    const runStore = new FileRunStore(workspaceRoot, redactor);
    const contextEngine = new ContextEngine(workspaceRoot);
    const sandboxProvider = new LocalProcessSandboxProvider();
    const verifierRunner = new VerifierRunner(sandboxProvider);
    const checkpointManager = new CheckpointManager(workspaceRoot);
    const handoffManager = new HandoffManager(workspaceRoot);
    const handoffValidator = new HandoffValidator(workspaceRoot);

    // Setup Policy Engine with Security & TDD Rules
    const policyRules: PolicyRule[] = [
      {
        id: 'no-direct-db-from-ui',
        description: 'UI components cannot directly import db drivers',
        scope: { paths: ['src/ui/**'] },
        denyImports: ['prisma', 'pg'],
      },
    ];
    const policyEvaluator = new PolicyEvaluator(policyRules);

    // =========================================================================
    // STEP 1: AGENT 1 (CLAUDE CODE) EXECUTES RUN-001
    // =========================================================================
    const claudeAdapter = new ClaudeCodeAdapter();
    const claudeSession = sessionManager.createSession({
      sessionId: 'SES-CLAUDE-001',
      projectId: 'payment-service',
      agentId: claudeAdapter.id,
      features: claudeAdapter.features(),
      createdAt: new Date().toISOString(),
    });
    await claudeAdapter.createSession({
      sessionId: claudeSession.sessionId,
      projectId: claudeSession.projectId,
      features: claudeSession.features,
    });

    // 1.1 Context Retrieval with 100% Provenance
    const context1 = contextEngine.assemble({
      runId: 'RUN-001',
      projectId: 'payment-service',
      scopeQuery: { domain: 'auth' },
      maxTokens: 50000,
    });
    expect(context1.decisions.length).toBe(1);
    expect(context1.failures.length).toBe(1);
    expect(context1.provenance.length).toBeGreaterThanOrEqual(2);

    // 1.2 Capability Resolution (Monotonic Intersection)
    const allowedCapabilities: Capability[] = ['filesystem.read', 'filesystem.write', 'terminal.exec'];
    const effectiveCaps1 = CapabilityResolver.resolve({
      agentProvided: ['filesystem.read', 'filesystem.write', 'terminal.exec', 'browser.open'],
      taskRequested: allowedCapabilities,
      policyAllowed: allowedCapabilities,
      sandboxGranted: allowedCapabilities,
    });
    expect(effectiveCaps1).toEqual(allowedCapabilities);

    // 1.3 Create Run 1 in Kernel
    const run1 = runManager.createRun({
      runId: 'RUN-001',
      sessionId: claudeSession.sessionId,
      projectId: 'payment-service',
      intent: 'Scaffold authentication token module',
      acceptanceCriteria: ['Login returns valid token object', 'All unit tests pass'],
      contextBundle: context1,
      effectiveCapabilities: effectiveCaps1,
    });
    claudeSession.registerRun(run1.runId);

    // 1.4 State Machine: RECEIVED -> PLANNED -> AUTHORIZED -> EXECUTING
    run1.stateMachine.transition('PLANNED');
    run1.setPlan([
      { taskId: 't1', title: 'Write auth module', acceptanceCriteria: ['login() implemented'], dependencies: [] },
      { taskId: 't2', title: 'Write test suite', acceptanceCriteria: ['Unit test passes'], dependencies: ['t1'] },
    ]);
    run1.stateMachine.transition('AUTHORIZED');
    run1.stateMachine.transition('EXECUTING');

    // 1.5 Claude Agent Action: Write implementation and test files
    const authCode = `
export function login(username, password) {
  if (username === 'admin' && password === 'secret123') {
    return { token: 'jwt_token_valid_123', userId: 'u-01' };
  }
  return null;
}
`;
    fs.writeFileSync(path.join(workspaceRoot, 'src', 'auth.js'), authCode);

    const testCode = `
import { login } from '../src/auth.js';
const res = login('admin', 'secret123');
if (!res || res.token !== 'jwt_token_valid_123') {
  console.error('Test Failed');
  process.exit(1);
}
console.log('Test Passed');
process.exit(0);
`;
    fs.writeFileSync(path.join(workspaceRoot, 'tests', 'auth.test.js'), testCode);

    // 1.6 Verification in Sandbox (Harness-Executed)
    const sandboxSpec: SandboxSpec = {
      baseImage: 'node:20-alpine',
      workspaceMountPath: workspaceRoot,
      readOnlyPaths: [],
      writablePaths: [workspaceRoot],
      environment: { values: {}, secretRefs: [] },
      networkAllowlist: ['registry.npmjs.org'],
      resourceLimits: { cpuCores: 2, memoryMb: 1024, timeoutSeconds: 15 },
    };
    const sandboxId = await sandboxProvider.create(sandboxSpec);

    run1.stateMachine.transition('VERIFYING');
    const verificationProof1 = await verifierRunner.verify({
      sandboxId,
      testCommand: 'node',
      testArgs: ['tests/auth.test.js'],
      strategy: 'regression_first',
    });

    expect(verificationProof1.level).toBe('harness-executed');
    expect(verificationProof1.passedGates).toContain('test_suite_execution');
    expect(verificationProof1.failedGates.length).toBe(0);
    run1.setVerification(verificationProof1);

    // 1.7 Checkpoint & Handoff Creation
    const cp1 = checkpointManager.createCheckpoint(run1.runId, claudeSession.sessionId, 'CP-001', 'Auth token module scaffolded');
    run1.setCheckpoint(cp1.checkpointId);

    run1.stateMachine.transition('COMPLETED');
    run1.completedAt = new Date().toISOString();

    const handoff1 = handoffManager.createHandoff({
      handoffId: 'HANDOFF-001',
      sourceRunId: run1.runId,
      sourceSessionId: claudeSession.sessionId,
      sourceCheckpointId: cp1.checkpointId,
      contextBundle: context1,
      verificationProof: verificationProof1,
      summary: 'JWT Authentication scaffolded and verified with 100% tests passing',
      currentState: 'COMPLETED',
      changedFiles: [
        { path: 'src/auth.js', status: 'added' },
        { path: 'tests/auth.test.js', status: 'added' },
      ],
      nextRecommendedActions: [
        'Add refreshToken function with rotation to src/auth.js',
        'Add refreshToken test cases to tests/auth.test.js',
      ],
    });

    expect(handoff1.handoffId).toBe('HANDOFF-001');
    expect(handoff1.fingerprints.workspaceFingerprint).toHaveLength(64);

    // Persist Run 1 Record to disk
    runStore.saveRunRecord(run1.toRecord());
    await claudeAdapter.endSession(claudeSession.sessionId);

    // =========================================================================
    // STEP 2: AGENT 2 (CURSOR) TAKES OVER VIA HANDOFF-001 AND EXECUTES RUN-002
    // =========================================================================
    const cursorAdapter = new CursorAiderAdapter();
    const cursorSession = sessionManager.createSession({
      sessionId: 'SES-CURSOR-002',
      projectId: 'payment-service',
      agentId: cursorAdapter.id,
      features: cursorAdapter.features(),
      createdAt: new Date().toISOString(),
    });
    await cursorAdapter.createSession({
      sessionId: cursorSession.sessionId,
      projectId: cursorSession.projectId,
      features: cursorSession.features,
    });

    // 2.1 Validate Handoff Integrity
    const loadedHandoff = handoffManager.getHandoff('HANDOFF-001');
    expect(loadedHandoff).not.toBeNull();

    const validationResult = handoffValidator.validate(loadedHandoff!);
    expect(validationResult.isValid).toBe(true);
    expect(validationResult.status).toBe('HANDOFF_VALID');

    // 2.2 Cursor receives Next Recommended Action
    const nextIntent = loadedHandoff!.nextRecommendedActions[0];
    expect(nextIntent).toContain('Add refreshToken function');

    // 2.3 Context for Run 2 (Includes updated files from Run 1)
    const context2 = contextEngine.assemble({
      runId: 'RUN-002',
      projectId: 'payment-service',
      relevantFilePaths: ['src/auth.js', 'tests/auth.test.js'],
      scopeQuery: { domain: 'auth' },
      maxTokens: 50000,
    });
    expect(context2.files.length).toBe(2);

    // 2.4 Create Run 2 in Kernel
    const run2 = runManager.createRun({
      runId: 'RUN-002',
      sessionId: cursorSession.sessionId,
      projectId: 'payment-service',
      intent: nextIntent,
      acceptanceCriteria: ['refreshToken rotates token successfully', 'All tests pass'],
      contextBundle: context2,
      effectiveCapabilities: allowedCapabilities,
    });
    cursorSession.registerRun(run2.runId);

    // 2.5 State Machine: RECEIVED -> PLANNED -> AUTHORIZED -> EXECUTING
    run2.stateMachine.transition('PLANNED');
    run2.setPlan([
      { taskId: 't3', title: 'Implement refreshToken rotation', acceptanceCriteria: ['refreshToken() works'], dependencies: [] },
    ]);
    run2.stateMachine.transition('AUTHORIZED');
    run2.stateMachine.transition('EXECUTING');

    // 2.6 Cursor Agent Action: Update code with refreshToken
    const updatedAuthCode = `
export function login(username, password) {
  if (username === 'admin' && password === 'secret123') {
    return { token: 'jwt_token_valid_123', refreshToken: 'ref_initial_01', userId: 'u-01' };
  }
  return null;
}

export function refreshToken(oldToken) {
  if (oldToken === 'ref_initial_01') {
    return { token: 'jwt_token_renewed_456', refreshToken: 'ref_rotated_02' };
  }
  return null;
}
`;
    fs.writeFileSync(path.join(workspaceRoot, 'src', 'auth.js'), updatedAuthCode);

    const updatedTestCode = `
import { login, refreshToken } from '../src/auth.js';

// Test Login
const res1 = login('admin', 'secret123');
if (!res1 || res1.token !== 'jwt_token_valid_123' || res1.refreshToken !== 'ref_initial_01') {
  console.error('Login Test Failed');
  process.exit(1);
}

// Test Refresh Token Rotation
const res2 = refreshToken(res1.refreshToken);
if (!res2 || res2.token !== 'jwt_token_renewed_456' || res2.refreshToken !== 'ref_rotated_02') {
  console.error('Refresh Token Rotation Failed');
  process.exit(1);
}

console.log('All E2E Tests Passed');
process.exit(0);
`;
    fs.writeFileSync(path.join(workspaceRoot, 'tests', 'auth.test.js'), updatedTestCode);

    // 2.7 Verification in Sandbox
    run2.stateMachine.transition('VERIFYING');
    const verificationProof2 = await verifierRunner.verify({
      sandboxId,
      testCommand: 'node',
      testArgs: ['tests/auth.test.js'],
      strategy: 'regression_first',
    });

    expect(verificationProof2.level).toBe('harness-executed');
    expect(verificationProof2.passedGates).toContain('test_suite_execution');
    expect(verificationProof2.failedGates.length).toBe(0);
    run2.setVerification(verificationProof2);

    // 2.8 Checkpoint & Final Handoff
    const cp2 = checkpointManager.createCheckpoint(run2.runId, cursorSession.sessionId, 'CP-002', 'Refresh token rotation completed');
    run2.setCheckpoint(cp2.checkpointId);

    run2.stateMachine.transition('COMPLETED');
    run2.completedAt = new Date().toISOString();

    const handoff2 = handoffManager.createHandoff({
      handoffId: 'HANDOFF-002',
      sourceRunId: run2.runId,
      sourceSessionId: cursorSession.sessionId,
      sourceCheckpointId: cp2.checkpointId,
      contextBundle: context2,
      verificationProof: verificationProof2,
      summary: 'Refresh token rotation completed by Cursor; 100% integration tests verified',
      currentState: 'COMPLETED',
      changedFiles: [
        { path: 'src/auth.js', status: 'modified' },
        { path: 'tests/auth.test.js', status: 'modified' },
      ],
      nextRecommendedActions: ['Ready for production deployment'],
    });

    expect(handoff2.handoffId).toBe('HANDOFF-002');
    expect(handoff2.fingerprints.workspaceFingerprint).not.toBe(handoff1.fingerprints.workspaceFingerprint);

    // Persist Run 2 Record to disk
    runStore.saveRunRecord(run2.toRecord());
    await cursorAdapter.endSession(cursorSession.sessionId);
    await sandboxProvider.destroy(sandboxId);

    // =========================================================================
    // STEP 3: AUDIT EVIDENCE & PERSISTENCE INTEGRITY VERIFICATION
    // =========================================================================
    expect(fs.existsSync(path.join(workspaceRoot, '.harness', 'runtime', 'runs', 'RUN-001', 'result.json'))).toBe(true);
    expect(fs.existsSync(path.join(workspaceRoot, '.harness', 'runtime', 'runs', 'RUN-002', 'result.json'))).toBe(true);
    expect(fs.existsSync(path.join(workspaceRoot, '.harness', 'runtime', 'handoffs', 'HANDOFF-001', 'handoff.json'))).toBe(true);
    expect(fs.existsSync(path.join(workspaceRoot, '.harness', 'runtime', 'handoffs', 'HANDOFF-002', 'handoff.json'))).toBe(true);
  });
});
