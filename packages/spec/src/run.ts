import type { ContextBundle } from './context.js';
import type { UsageMetrics } from './adapter.js';

export type RunState =
  | 'RECEIVED'
  | 'PLANNED'
  | 'AUTHORIZED'
  | 'EXECUTING'
  | 'VERIFYING'
  | 'PAUSED'
  | 'INTERRUPTED'
  | 'EXPIRED'
  | 'CANCELLED'
  | 'RECOVER'
  | 'BLOCKED'
  | 'COMPLETED';

export type TrustLevel = 'agent-reported' | 'harness-executed' | 'external-attested';

export interface VerificationProof {
  level: TrustLevel;
  passedGates: string[];
  failedGates: string[];
  rawEvidence: Record<string, unknown>;
  timestamp: string;
}

export interface TaskPlan {
  taskId: string;
  title: string;
  acceptanceCriteria: string[];
  dependencies: string[];
}

export interface DomainEvent<T = unknown> {
  eventId: string;
  runId: string;
  sessionId: string;
  type: string;
  timestamp: string;
  payload: T;
}

export interface RunRecord {
  runId: string;
  sessionId: string;
  projectId: string;
  state: RunState;
  intent: string;
  plan: TaskPlan[];
  contextBundle: ContextBundle;
  events: DomainEvent[];
  verification: VerificationProof | null;
  checkpointId: string | null;
  usage: UsageMetrics;
  createdAt: string;
  completedAt: string | null;
}
