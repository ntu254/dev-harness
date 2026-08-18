import type {
  RunState,
  RunRecord,
  ContextBundle,
  TaskPlan,
  VerificationProof,
  UsageMetrics,
  Capability,
} from '@dev-harness/spec';
import { StateMachine } from '../state-machine/StateMachine.js';
import type { EventStore } from '../events/EventStore.js';
import { DomainEventFactory } from '../events/DomainEvent.js';

export interface RunInitParams {
  runId: string;
  sessionId: string;
  projectId: string;
  intent: string;
  acceptanceCriteria: string[];
  contextBundle: ContextBundle;
  effectiveCapabilities: Capability[];
  eventStore: EventStore;
}

export class Run {
  public readonly runId: string;
  public readonly sessionId: string;
  public readonly projectId: string;
  public readonly intent: string;
  public readonly acceptanceCriteria: string[];
  public readonly contextBundle: ContextBundle;
  public readonly effectiveCapabilities: Capability[];
  
  public readonly stateMachine: StateMachine;
  private readonly eventStore: EventStore;

  public plan: TaskPlan[] = [];
  public verification: VerificationProof | null = null;
  public checkpointId: string | null = null;
  public usage: UsageMetrics = {
    promptTokens: 0,
    completionTokens: 0,
    totalTokens: 0,
    estimatedCostUsd: 0,
  };
  public readonly createdAt: string;
  public completedAt: string | null = null;

  constructor(params: RunInitParams) {
    this.runId = params.runId;
    this.sessionId = params.sessionId;
    this.projectId = params.projectId;
    this.intent = params.intent;
    this.acceptanceCriteria = params.acceptanceCriteria;
    this.contextBundle = params.contextBundle;
    this.effectiveCapabilities = params.effectiveCapabilities;
    this.eventStore = params.eventStore;
    this.createdAt = new Date().toISOString();

    this.stateMachine = new StateMachine(this.runId, this.sessionId, this.eventStore, 'RECEIVED');

    // Emit Run Created Event
    this.eventStore.append(DomainEventFactory.create({
      runId: this.runId,
      sessionId: this.sessionId,
      type: 'RUN_INITIALIZED',
      payload: {
        intent: this.intent,
        acceptanceCriteria: this.acceptanceCriteria,
        effectiveCapabilities: this.effectiveCapabilities,
      },
    }));
  }

  public getState(): RunState {
    return this.stateMachine.getState();
  }

  public setPlan(plan: TaskPlan[]): void {
    this.plan = plan;
    this.eventStore.append(DomainEventFactory.create({
      runId: this.runId,
      sessionId: this.sessionId,
      type: 'PLAN_ESTABLISHED',
      payload: { plan },
    }));
  }

  public setVerification(verification: VerificationProof): void {
    this.verification = verification;
    this.eventStore.append(DomainEventFactory.create({
      runId: this.runId,
      sessionId: this.sessionId,
      type: 'VERIFICATION_RECORDED',
      payload: { verification },
    }));
  }

  public setCheckpoint(checkpointId: string): void {
    this.checkpointId = checkpointId;
    this.eventStore.append(DomainEventFactory.create({
      runId: this.runId,
      sessionId: this.sessionId,
      type: 'CHECKPOINT_ATTACHED',
      payload: { checkpointId },
    }));
  }

  public addUsage(metrics: Partial<UsageMetrics>): void {
    this.usage.promptTokens += metrics.promptTokens || 0;
    this.usage.completionTokens += metrics.completionTokens || 0;
    this.usage.totalTokens += metrics.totalTokens || 0;
    this.usage.estimatedCostUsd += metrics.estimatedCostUsd || 0;
  }

  public toRecord(): RunRecord {
    return {
      runId: this.runId,
      sessionId: this.sessionId,
      projectId: this.projectId,
      state: this.getState(),
      intent: this.intent,
      plan: this.plan,
      contextBundle: this.contextBundle,
      events: [...this.eventStore.getEvents(this.runId)],
      verification: this.verification,
      checkpointId: this.checkpointId,
      usage: { ...this.usage },
      createdAt: this.createdAt,
      completedAt: this.completedAt,
    };
  }
}
