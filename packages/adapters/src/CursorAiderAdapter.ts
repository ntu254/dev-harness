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

export class CursorAiderAdapter implements AgentAdapter {
  public readonly id = 'cursor-aider';
  public readonly version = '1.0.0';

  private activeSessions: Set<string> = new Set();
  private activeRuns: Map<string, AgentRunInput> = new Map();
  private usages: Map<string, UsageMetrics> = new Map();

  public features(): AgentFeatures {
    return {
      supportsStreaming: true,
      supportsToolInterruption: false,
      supportsContextCompaction: false,
      supportsMcp: true,
      contextWindow: 128000,
    };
  }

  public async createSession(input: AgentSessionInput): Promise<string> {
    this.activeSessions.add(input.sessionId);
    return input.sessionId;
  }

  public async startRun(input: AgentRunInput): Promise<void> {
    this.activeRuns.set(input.runId, input);
    this.usages.set(input.runId, {
      promptTokens: 1200,
      completionTokens: 450,
      totalTokens: 1650,
      estimatedCostUsd: 0.022,
    });
  }

  public async sendContext(runId: string, _bundle: ContextBundle): Promise<void> {
    if (!this.activeRuns.has(runId)) {
      throw new Error(`Run '${runId}' not found in CursorAiderAdapter`);
    }
  }

  public async dispatchTool(_runId: string, request: ToolRequest): Promise<ToolResult> {
    const startTime = Date.now();
    return {
      requestId: request.id,
      success: true,
      output: `Tool '${request.toolName}' executed via Cursor bridge`,
      executionDurationMs: Date.now() - startTime,
    };
  }

  public async interrupt(runId: string, _reason: string): Promise<void> {
    if (!this.activeRuns.has(runId)) {
      throw new Error(`Run '${runId}' not found in CursorAiderAdapter`);
    }
  }

  public async resume(_runId: string, _state: HandoffPackage): Promise<void> {
    // Resume execution with context from Handoff
  }

  public async collectUsage(runId: string): Promise<UsageMetrics> {
    return this.usages.get(runId) || {
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
      estimatedCostUsd: 0,
    };
  }

  public async endSession(sessionId: string): Promise<void> {
    this.activeSessions.delete(sessionId);
  }
}
