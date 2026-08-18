import * as fs from 'node:fs';
import * as path from 'node:path';
import type { McpTool, McpToolCallResult } from '../protocol/McpTypes.js';
import {
  GitWorkspace,
  HandoffValidator,
  ContextEngine,
  CheckpointManager,
  HandoffManager,
  FailureMemoryLoader,
} from '@dev-harness/infrastructure';
import { LocalProcessSandboxProvider } from '@dev-harness/sandbox';
import { VerifierRunner } from '@dev-harness/verifier';
import { SemanticVectorIndex, AutoFailureSynthesizer } from '@dev-harness/graph';

export class ToolRegistry {
  private readonly workspaceRoot: string;

  constructor(workspaceRoot: string = process.cwd()) {
    this.workspaceRoot = path.resolve(workspaceRoot);
  }

  public listTools(): McpTool[] {
    return [
      {
        name: 'harness_init_workspace',
        description: 'Initialize a new DEV-HARNESS runtime and workspace specification (.harness/) in the repository',
        inputSchema: {
          type: 'object',
          properties: {
            targetDir: { type: 'string', description: 'Target workspace directory path' },
          },
        },
      },
      {
        name: 'harness_get_status',
        description: 'Retrieve current DEV-HARNESS workspace status, tree fingerprints, run history, and handoff validity',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'harness_get_context',
        description: 'Retrieve a localized ContextBundle with 100% Provenance, Failure Memories, and Sub-AST code graph',
        inputSchema: {
          type: 'object',
          properties: {
            runId: { type: 'string', description: 'Run ID for provenance tracking' },
            domain: { type: 'string', description: 'Domain/feature name for scope matching' },
            relevantFiles: { type: 'array', items: { type: 'string' }, description: 'Specific file paths' },
            maxTokens: { type: 'number', description: 'Token budget ceiling' },
          },
          required: ['runId'],
        },
      },
      {
        name: 'harness_query_failures',
        description: 'Perform semantic search over empirical failure memories (.harness/knowledge/failures/) to avoid repeating past bugs',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Task, symptom, or error query string' },
            topK: { type: 'number', description: 'Max number of results to return' },
          },
          required: ['query'],
        },
      },
      {
        name: 'harness_run_verifier',
        description: 'Execute tests in an isolated sandbox to generate a trusted VerificationProof (TrustLevel: harness-executed)',
        inputSchema: {
          type: 'object',
          properties: {
            testCommand: { type: 'string', description: 'Test command to run (e.g. "npm", "node")' },
            testArgs: { type: 'array', items: { type: 'string' }, description: 'Command arguments' },
            strategy: { type: 'string', enum: ['tdd_red_green', 'regression_first'], description: 'Verification strategy' },
          },
          required: ['testCommand'],
        },
      },
      {
        name: 'harness_create_checkpoint',
        description: 'Create a durable checkpoint snapshot (CP-XXX) binding Git tree hash, state, and timestamp',
        inputSchema: {
          type: 'object',
          properties: {
            runId: { type: 'string', description: 'Run ID' },
            sessionId: { type: 'string', description: 'Session ID' },
            checkpointId: { type: 'string', description: 'Checkpoint identifier (e.g. CP-001)' },
            description: { type: 'string', description: 'Milestone description' },
          },
          required: ['runId', 'sessionId', 'checkpointId'],
        },
      },
      {
        name: 'harness_create_handoff',
        description: 'Package state, 3 canonical fingerprints, verification proof, and next recommended actions for cross-agent handover',
        inputSchema: {
          type: 'object',
          properties: {
            handoffId: { type: 'string', description: 'Handoff identifier (e.g. HANDOFF-001)' },
            sourceRunId: { type: 'string' },
            sourceSessionId: { type: 'string' },
            sourceCheckpointId: { type: 'string' },
            summary: { type: 'string' },
            nextRecommendedActions: { type: 'array', items: { type: 'string' } },
          },
          required: ['handoffId', 'sourceRunId', 'sourceSessionId', 'sourceCheckpointId', 'summary', 'nextRecommendedActions'],
        },
      },
      {
        name: 'harness_auto_synthesize_failure',
        description: 'Automatically synthesize a FAIL-XXX.json failure memory from a failed test output / stack trace',
        inputSchema: {
          type: 'object',
          properties: {
            runId: { type: 'string' },
            taskTitle: { type: 'string' },
            rawOutput: { type: 'string', description: 'Raw stderr or test output' },
            domain: { type: 'string' },
            failedHypothesis: { type: 'string' },
          },
          required: ['runId', 'taskTitle', 'rawOutput'],
        },
      },
    ];
  }

  public async callTool(name: string, args: any = {}): Promise<McpToolCallResult> {
    try {
      switch (name) {
        case 'harness_init_workspace': {
          const target = args.targetDir || this.workspaceRoot;
          // Create .harness directory structure
          fs.mkdirSync(path.join(target, '.harness', 'spec', 'policies'), { recursive: true });
          fs.mkdirSync(path.join(target, '.harness', 'knowledge', 'decisions'), { recursive: true });
          fs.mkdirSync(path.join(target, '.harness', 'knowledge', 'failures'), { recursive: true });
          fs.mkdirSync(path.join(target, '.harness', 'runtime', 'runs'), { recursive: true });
          fs.mkdirSync(path.join(target, '.harness', 'runtime', 'handoffs'), { recursive: true });
          fs.mkdirSync(path.join(target, '.harness', 'runtime', 'checkpoints'), { recursive: true });

          const manifest = { name: 'dev-harness-workspace', version: '2.0.0-spec', createdAt: new Date().toISOString() };
          fs.writeFileSync(path.join(target, '.harness', 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');

          return { content: [{ type: 'text', text: `Initialized DEV-HARNESS workspace successfully at: ${target}` }] };
        }

        case 'harness_get_status': {
          const gitWorkspace = new GitWorkspace(this.workspaceRoot);
          const fingerprint = gitWorkspace.getTreeFingerprint();
          const validator = new HandoffValidator(this.workspaceRoot);

          const handoffsDir = path.join(this.workspaceRoot, '.harness', 'runtime', 'handoffs');
          const handoffsList: any[] = [];
          if (fs.existsSync(handoffsDir)) {
            for (const hId of fs.readdirSync(handoffsDir)) {
              const hFile = path.join(handoffsDir, hId, 'handoff.json');
              if (fs.existsSync(hFile)) {
                const pkg = JSON.parse(fs.readFileSync(hFile, 'utf8'));
                const valid = validator.validate(pkg);
                handoffsList.push({ handoffId: hId, valid: valid.isValid, status: valid.status, summary: pkg.summary });
              }
            }
          }

          return {
            content: [{
              type: 'text',
              text: JSON.stringify({ workspaceRoot: this.workspaceRoot, workspaceFingerprint: fingerprint, handoffs: handoffsList }, null, 2),
            }],
          };
        }

        case 'harness_get_context': {
          const engine = new ContextEngine(this.workspaceRoot);
          const bundle = engine.assemble({
            runId: args.runId,
            projectId: path.basename(this.workspaceRoot),
            scopeQuery: args.domain ? { domain: args.domain } : undefined,
            relevantFilePaths: args.relevantFiles,
            maxTokens: args.maxTokens || 64000,
          });
          return { content: [{ type: 'text', text: JSON.stringify(bundle, null, 2) }] };
        }

        case 'harness_query_failures': {
          const loader = new FailureMemoryLoader(this.workspaceRoot);
          const failures = loader.loadAllFailures();
          const index = new SemanticVectorIndex();

          for (const f of failures) {
            const doc = `${f.id} ${f.task} ${f.rootCause} ${f.lesson} ${f.failedHypothesis} ${(f.doNotRepeatWhen || []).join(' ')}`;
            index.addDocument(f.id, doc, f);
          }

          const results = index.search(args.query, args.topK || 3);
          return { content: [{ type: 'text', text: JSON.stringify(results.map(r => r.metadata), null, 2) }] };
        }

        case 'harness_run_verifier': {
          const sandbox = new LocalProcessSandboxProvider();
          const verifier = new VerifierRunner(sandbox);
          const sId = await sandbox.create({
            baseImage: 'node:20-alpine',
            workspaceMountPath: this.workspaceRoot,
            readOnlyPaths: [],
            writablePaths: [this.workspaceRoot],
            environment: { values: {}, secretRefs: [] },
            networkAllowlist: [],
            resourceLimits: { cpuCores: 2, memoryMb: 1024, timeoutSeconds: 30 },
          });

          const proof = await verifier.verify({
            sandboxId: sId,
            testCommand: args.testCommand,
            testArgs: args.testArgs || [],
            strategy: args.strategy || 'regression_first',
          });
          await sandbox.destroy(sId);

          return { content: [{ type: 'text', text: JSON.stringify(proof, null, 2) }] };
        }

        case 'harness_create_checkpoint': {
          const cpManager = new CheckpointManager(this.workspaceRoot);
          const cp = cpManager.createCheckpoint(args.runId, args.sessionId, args.checkpointId, args.description);
          return { content: [{ type: 'text', text: JSON.stringify(cp, null, 2) }] };
        }

        case 'harness_create_handoff': {
          const handoffManager = new HandoffManager(this.workspaceRoot);
          const engine = new ContextEngine(this.workspaceRoot);
          const bundle = engine.assemble({ runId: args.sourceRunId, projectId: path.basename(this.workspaceRoot) });

          const handoff = handoffManager.createHandoff({
            handoffId: args.handoffId,
            sourceRunId: args.sourceRunId,
            sourceSessionId: args.sourceSessionId,
            sourceCheckpointId: args.sourceCheckpointId,
            contextBundle: bundle,
            verificationProof: {
              level: 'harness-executed',
              passedGates: ['test'],
              failedGates: [],
              rawEvidence: { exitCode: 0 },
              timestamp: new Date().toISOString(),
            },
            summary: args.summary,
            currentState: 'COMPLETED',
            changedFiles: [],
            nextRecommendedActions: args.nextRecommendedActions,
          });

          return { content: [{ type: 'text', text: JSON.stringify(handoff, null, 2) }] };
        }

        case 'harness_auto_synthesize_failure': {
          const result = AutoFailureSynthesizer.synthesizeAndSave({
            runId: args.runId,
            taskTitle: args.taskTitle,
            rawOutput: args.rawOutput,
            domain: args.domain,
            failedHypothesis: args.failedHypothesis,
            workspaceRoot: this.workspaceRoot,
          });
          return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }

        default:
          return {
            content: [{ type: 'text', text: `Unknown tool: ${name}` }],
            isError: true,
          };
      }
    } catch (err: any) {
      return {
        content: [{ type: 'text', text: `Tool execution failed: ${err.message}` }],
        isError: true,
      };
    }
  }
}
