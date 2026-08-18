import type { DomainEvent } from '@dev-harness/spec';
import { SecretRedactor } from './SecretRedactor.js';

export class EventStore {
  private events: DomainEvent[] = [];
  private redactor: SecretRedactor;

  constructor(redactor?: SecretRedactor) {
    this.redactor = redactor || new SecretRedactor();
  }

  public getRedactor(): SecretRedactor {
    return this.redactor;
  }

  /**
   * Append-only commit. Automatically applies secret redaction to payload.
   */
  public append<T = unknown>(event: DomainEvent<T>): DomainEvent<T> {
    const redactedPayload = this.redactor.redact(event.payload);
    const sanitizedEvent: DomainEvent<T> = {
      ...event,
      payload: redactedPayload,
    };
    
    // Freeze event object to prevent in-place mutation
    Object.freeze(sanitizedEvent);
    this.events.push(sanitizedEvent as DomainEvent);
    return sanitizedEvent;
  }

  public getEvents(runId?: string): readonly DomainEvent[] {
    if (!runId) {
      return [...this.events];
    }
    return this.events.filter(e => e.runId === runId);
  }

  public getEventsBySession(sessionId: string): readonly DomainEvent[] {
    return this.events.filter(e => e.sessionId === sessionId);
  }

  public clear(): void {
    this.events = [];
  }
}
