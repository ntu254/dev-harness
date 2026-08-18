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

export interface ActionPlan {
  planTitle: string;
  filesToCreateOrModify: Array<{ path: string; content: string }>;
}

export class ProgrammaticMockAdapter implements AgentAdapter {
  public readonly id: string;
  public readonly version = '1.0.0';
  private actionPlan?: ActionPlan;

  public activeSessions: Set<string> = new Set();
  public activeRuns: Map<string, AgentRunInput> = new Map();
  public receivedContexts: Map<string, ContextBundle> = new Map();

  constructor(id: string = 'mock-agent', actionPlan?: ActionPlan) {
    this.id = id;
    this.actionPlan = actionPlan;
  }

  public features(): AgentFeatures {
    return {
      supportsStreaming: true,
      supportsToolInterruption: true,
      supportsContextCompaction: true,
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
  }

  public async sendContext(runId: string, bundle: ContextBundle): Promise<void> {
    this.receivedContexts.set(runId, bundle);
  }

  public async dispatchTool(_runId: string, request: ToolRequest): Promise<ToolResult> {
    return {
      requestId: request.id,
      success: true,
      output: { executed: request.toolName, args: request.arguments },
      executionDurationMs: 5,
    };
  }

  public async interrupt(_runId: string, _reason: string): Promise<void> {
    // Interrupted
  }

  public async resume(_runId: string, _state: HandoffPackage): Promise<void> {
    // Resumed from state
  }

  public async collectUsage(_runId: string): Promise<UsageMetrics> {
    return {
      promptTokens: 1000,
      completionTokens: 300,
      totalTokens: 1300,
      estimatedCostUsd: 0.015,
    };
  }

  public async endSession(sessionId: string): Promise<void> {
    this.activeSessions.delete(sessionId);
  }

  public getActionPlan(): ActionPlan | undefined {
    return this.actionPlan;
  }
}
