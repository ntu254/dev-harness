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

export class ClaudeCodeAdapter implements AgentAdapter {
  public readonly id = 'claude-code';
  public readonly version = '1.0.0';

  private activeSessions: Set<string> = new Set();
  private activeRuns: Map<string, AgentRunInput> = new Map();
  private usages: Map<string, UsageMetrics> = new Map();

  public features(): AgentFeatures {
    return {
      supportsStreaming: true,
      supportsToolInterruption: true,
      supportsContextCompaction: true,
      supportsMcp: true,
      contextWindow: 200000,
    };
  }

  public async createSession(input: AgentSessionInput): Promise<string> {
    this.activeSessions.add(input.sessionId);
    return input.sessionId;
  }

  public async startRun(input: AgentRunInput): Promise<void> {
    this.activeRuns.set(input.runId, input);
    this.usages.set(input.runId, {
      promptTokens: 1500,
      completionTokens: 600,
      totalTokens: 2100,
      estimatedCostUsd: 0.035,
    });
  }

  public async sendContext(runId: string, _bundle: ContextBundle): Promise<void> {
    if (!this.activeRuns.has(runId)) {
      throw new Error(`Run '${runId}' not found in ClaudeCodeAdapter`);
    }
  }

  public async dispatchTool(_runId: string, request: ToolRequest): Promise<ToolResult> {
    const startTime = Date.now();
    return {
      requestId: request.id,
      success: true,
      output: `Tool '${request.toolName}' executed via Claude Code bridge`,
      executionDurationMs: Date.now() - startTime,
    };
  }

  public async interrupt(runId: string, _reason: string): Promise<void> {
    if (!this.activeRuns.has(runId)) {
      throw new Error(`Run '${runId}' not found in ClaudeCodeAdapter`);
    }
  }

  public async resume(_runId: string, _state: HandoffPackage): Promise<void> {
    // Resume execution from Handoff state
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
