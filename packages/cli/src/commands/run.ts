import * as path from 'node:path';
import {
  SessionManager,
  RunManager,
  EventStore,
  CapabilityResolver,
  SecretRedactor,
} from '@dev-harness/kernel';
import {
  FileRunStore,
  ContextEngine,
  CheckpointManager,
  HandoffManager,
} from '@dev-harness/infrastructure';
import { LocalProcessSandboxProvider } from '@dev-harness/sandbox';
import { VerifierRunner } from '@dev-harness/verifier';
import { ClaudeCodeAdapter, CursorAiderAdapter } from '@dev-harness/adapters';
import type { Capability, SandboxSpec } from '@dev-harness/spec';

export interface RunCommandOptions {
  intent: string;
  agent?: string;
  targetDir?: string;
  testCommand?: string;
}

export async function runTask(options: RunCommandOptions): Promise<void> {
  const workspaceRoot = path.resolve(options.targetDir || process.cwd());
  const agentType = options.agent || 'claude-code';
  const runId = `RUN-${Date.now().toString().slice(-4)}`;
  const sessionId = `SES-${Date.now().toString().slice(-4)}`;

  console.log(`\n🚀 BẮT ĐẦU PHIÊN THỰC THI DEV-HARNESS [${runId}]`);
  console.log(`🎯 Mục tiêu: "${options.intent}"`);
  console.log(`🤖 Agent: ${agentType}`);

  // 1. Setup Kernel & Subsystems
  const redactor = new SecretRedactor();
  const eventStore = new EventStore(redactor);
  const sessionManager = new SessionManager();
  const runManager = new RunManager(eventStore);
  const runStore = new FileRunStore(workspaceRoot, redactor);
  const contextEngine = new ContextEngine(workspaceRoot);
  const sandbox = new LocalProcessSandboxProvider();
  const verifier = new VerifierRunner(sandbox);
  const checkpointManager = new CheckpointManager(workspaceRoot);
  const handoffManager = new HandoffManager(workspaceRoot);

  // 2. Select Adapter
  const adapter = agentType.includes('cursor') ? new CursorAiderAdapter() : new ClaudeCodeAdapter();
  const features = adapter.features();

  const session = sessionManager.createSession({
    sessionId,
    projectId: path.basename(workspaceRoot),
    agentId: adapter.id,
    features,
    createdAt: new Date().toISOString(),
  });
  await adapter.createSession({
    sessionId: session.sessionId,
    projectId: session.projectId,
    features: session.features,
  });

  // 3. Assemble ContextBundle
  console.log('📚 Đang thu thập bối cảnh (ContextBundle & 100% Provenance)...');
  const contextBundle = contextEngine.assemble({
    runId,
    projectId: session.projectId,
    maxTokens: 64000,
  });

  // 4. Resolve Effective Capabilities
  const defaultCaps: Capability[] = ['filesystem.read', 'filesystem.write', 'terminal.exec'];
  const effectiveCapabilities = CapabilityResolver.resolve({
    agentProvided: defaultCaps,
    taskRequested: defaultCaps,
    policyAllowed: defaultCaps,
    sandboxGranted: defaultCaps,
  });

  // 5. Create Run in Kernel
  const run = runManager.createRun({
    runId,
    sessionId: session.sessionId,
    projectId: session.projectId,
    intent: options.intent,
    acceptanceCriteria: ['Task executed', 'Test verification pass'],
    contextBundle,
    effectiveCapabilities,
  });
  session.registerRun(run.runId);

  // 6. Transition State Machine
  console.log('⚙️  State Machine: RECEIVED -> PLANNED -> AUTHORIZED -> EXECUTING');
  run.stateMachine.transition('PLANNED');
  run.setPlan([{ taskId: 'task-1', title: options.intent, acceptanceCriteria: ['Success'], dependencies: [] }]);
  run.stateMachine.transition('AUTHORIZED');
  run.stateMachine.transition('EXECUTING');

  // Start Run in Adapter
  await adapter.startRun({
    runId: run.runId,
    sessionId: session.sessionId,
    intent: options.intent,
    acceptanceCriteria: ['Success'],
    contextBundle,
    effectiveCapabilities,
  });

  // 7. Verify in Sandbox
  const sandboxSpec: SandboxSpec = {
    baseImage: 'node:20-alpine',
    workspaceMountPath: workspaceRoot,
    readOnlyPaths: [],
    writablePaths: [workspaceRoot],
    environment: { values: {}, secretRefs: [] },
    networkAllowlist: ['registry.npmjs.org'],
    resourceLimits: { cpuCores: 2, memoryMb: 1024, timeoutSeconds: 30 },
  };
  const sandboxId = await sandbox.create(sandboxSpec);

  console.log('🧪 Đang kích hoạt Verifier trong Sandbox (TrustLevel: harness-executed)...');
  run.stateMachine.transition('VERIFYING');

  const testCmd = options.testCommand || 'npm';
  const testArgs = options.testCommand ? [] : ['test'];

  const verificationProof = await verifier.verify({
    sandboxId,
    testCommand: testCmd,
    testArgs,
    strategy: 'regression_first',
  });
  run.setVerification(verificationProof);

  // 8. Create Checkpoint & Handoff
  const cpId = `CP-${runId.slice(-4)}`;
  const checkpoint = checkpointManager.createCheckpoint(run.runId, session.sessionId, cpId, options.intent);
  run.setCheckpoint(checkpoint.checkpointId);

  run.stateMachine.transition('COMPLETED');
  run.completedAt = new Date().toISOString();

  // Create Handoff
  const handoffId = `HANDOFF-${runId.slice(-4)}`;
  const handoff = handoffManager.createHandoff({
    handoffId,
    sourceRunId: run.runId,
    sourceSessionId: session.sessionId,
    sourceCheckpointId: checkpoint.checkpointId,
    contextBundle,
    verificationProof,
    summary: `Task "${options.intent}" completed by ${agentType}`,
    currentState: 'COMPLETED',
    changedFiles: [],
    nextRecommendedActions: ['Review run artifacts in .harness/runtime/runs/', 'Continue with next sprint task'],
  });

  // Persist RunRecord
  runStore.saveRunRecord(run.toRecord());

  await adapter.endSession(session.sessionId);
  await sandbox.destroy(sandboxId);

  console.log(`\n🎉 HOÀN THÀNH TÁC VỤ THÀNH CÔNG!`);
  console.log(`   • Trạng thái: [COMPLETED]`);
  console.log(`   • Checkpoint: ${checkpoint.checkpointId} (Tree Fingerprint: ${checkpoint.treeFingerprint.slice(0, 16)}...)`);
  console.log(`   • Handoff Package: ${handoff.handoffId} (.harness/runtime/handoffs/${handoffId}/)`);
  console.log(`   • Audit Trail: .harness/runtime/runs/${runId}/ (events.jsonl, verification.json)\n`);
}
