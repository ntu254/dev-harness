import type { DomainEvent as IDomainEvent } from '@dev-harness/spec';

export interface CreateEventParams<T = unknown> {
  eventId?: string;
  runId: string;
  sessionId: string;
  type: string;
  timestamp?: string;
  payload: T;
}

export class DomainEventFactory {
  private static counter = 0;

  public static create<T = unknown>(params: CreateEventParams<T>): IDomainEvent<T> {
    DomainEventFactory.counter += 1;
    return {
      eventId: params.eventId || `evt-${Date.now()}-${DomainEventFactory.counter}`,
      runId: params.runId,
      sessionId: params.sessionId,
      type: params.type,
      timestamp: params.timestamp || new Date().toISOString(),
      payload: params.payload,
    };
  }
}
