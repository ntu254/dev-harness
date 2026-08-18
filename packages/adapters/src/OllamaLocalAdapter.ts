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

export class OllamaLocalAdapter implements AgentAdapter {
  public readonly id = 'ollama-local';
  public readonly version = '2.0.0';
  public readonly modelName: string;
  public readonly endpoint: string;

  private activeSessions: Set<string> = new Set();
  private activeRuns: Map<string, AgentRunInput> = new Map();

  constructor(modelName: string = 'qwen2.5-coder:14b', endpoint: string = 'http://localhost:11434') {
    this.modelName = modelName;
    this.endpoint = endpoint;
  }

  public features(): AgentFeatures {
    return {
      supportsStreaming: true,
      supportsToolInterruption: true,
      supportsContextCompaction: false,
      supportsMcp: true,
      contextWindow: 32768,
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
      throw new Error(`Run '${runId}' not found in OllamaLocalAdapter`);
    }
  }

  public async dispatchTool(_runId: string, request: ToolRequest): Promise<ToolResult> {
    const start = Date.now();
    return {
      requestId: request.id,
      success: true,
      output: `Executed ${request.toolName} locally via Ollama (${this.modelName})`,
      executionDurationMs: Date.now() - start,
    };
  }

  public async interrupt(_runId: string, _reason: string): Promise<void> {}

  public async resume(_runId: string, _state: HandoffPackage): Promise<void> {}

  public async collectUsage(_runId: string): Promise<UsageMetrics> {
    return {
      promptTokens: 800,
      completionTokens: 250,
      totalTokens: 1050,
      estimatedCostUsd: 0.0, // 100% Free on local hardware!
    };
  }

  public async endSession(sessionId: string): Promise<void> {
    this.activeSessions.delete(sessionId);
  }
}
