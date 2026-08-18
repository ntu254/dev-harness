import type { AgentFeatures } from '@dev-harness/spec';

export interface SessionConfig {
  sessionId: string;
  projectId: string;
  agentId: string;
  features: AgentFeatures;
  createdAt: string;
}

export class Session {
  public readonly sessionId: string;
  public readonly projectId: string;
  public readonly agentId: string;
  public readonly features: AgentFeatures;
  public readonly createdAt: string;
  private activeRunIds: string[] = [];

  constructor(config: SessionConfig) {
    this.sessionId = config.sessionId;
    this.projectId = config.projectId;
    this.agentId = config.agentId;
    this.features = config.features;
    this.createdAt = config.createdAt;
  }

  public registerRun(runId: string): void {
    if (!this.activeRunIds.includes(runId)) {
      this.activeRunIds.push(runId);
    }
  }

  public getRunIds(): readonly string[] {
    return [...this.activeRunIds];
  }
}
