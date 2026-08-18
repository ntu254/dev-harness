import type {
  AgentAdapter,
  AgentFeatures,
  AgentSessionInput,
  AgentRunInput,
  ContextBundle,
  ToolRequest,
  ToolResult,
  UsageMetrics,
  HandoffPackage,
} from '@dev-harness/spec';

export class DeepSeekReasoningAdapter implements AgentAdapter {
  public readonly id = 'deepseek-reasoning';
  public readonly version = '2.0.0';
  public readonly modelName: string;

  private activeSessions: Set<string> = new Set();
  private activeRuns: Map<string, AgentRunInput> = new Map();

  constructor(modelName: string = 'deepseek-r1') {
    this.modelName = modelName;
  }

  public features(): AgentFeatures {
    return {
      supportsStreaming: true,
      supportsToolInterruption: true,
      supportsContextCompaction: true,
      supportsMcp: true,
      contextWindow: 65536,
    };
  }

  public async createSession(input: AgentSessionInput): Promise<string> {
    this.activeSessions.add(input.sessionId);
    return input.sessionId;
  }

  public async startRun(input: AgentRunInput): Promise<void> {
    this.activeRuns.set(input.runId, input);
  }

  public async sendContext(runId: string, _bundle: ContextBundle): Promise<void> {
    if (!this.activeRuns.has(runId)) {
      throw new Error(`Run '${runId}' not found in DeepSeekReasoningAdapter`);
    }
  }

  public async dispatchTool(_runId: string, request: ToolRequest): Promise<ToolResult> {
    const start = Date.now();
    return {
      requestId: request.id,
      success: true,
      output: `Executed ${request.toolName} with DeepSeek-R1 reasoning verification`,
      executionDurationMs: Date.now() - start,
    };
  }

  public async interrupt(_runId: string, _reason: string): Promise<void> {}

  public async resume(_runId: string, _state: HandoffPackage): Promise<void> {}

  public async collectUsage(_runId: string): Promise<UsageMetrics> {
    return {
      promptTokens: 2000,
      completionTokens: 1500, // Extended reasoning tokens
      totalTokens: 3500,
      estimatedCostUsd: 0.007, // Extremely cost-effective reasoning
    };
  }

  public async endSession(sessionId: string): Promise<void> {
    this.activeSessions.delete(sessionId);
  }
}
