import type { RunState, DomainEvent } from '@dev-harness/spec';
import { canTransition } from './transitions.js';
import { DomainEventFactory } from '../events/DomainEvent.js';
import type { EventStore } from '../events/EventStore.js';

export interface StateTransitionResult {
  previousState: RunState;
  newState: RunState;
  event: DomainEvent;
}

export class InvalidStateTransitionError extends Error {
  constructor(public readonly from: RunState, public readonly to: RunState, message?: string) {
    super(message || `Invalid state transition from '${from}' to '${to}'`);
    this.name = 'InvalidStateTransitionError';
  }
}

export class StateMachine {
  private currentState: RunState;
  private readonly runId: string;
  private readonly sessionId: string;
  private readonly eventStore: EventStore;

  constructor(runId: string, sessionId: string, eventStore: EventStore, initialState: RunState = 'RECEIVED') {
    this.runId = runId;
    this.sessionId = sessionId;
    this.eventStore = eventStore;
    this.currentState = initialState;
  }

  public getState(): RunState {
    return this.currentState;
  }

  public getRunId(): string {
    return this.runId;
  }

  public getSessionId(): string {
    return this.sessionId;
  }

  /**
   * Sole commit authority for state transitions.
   * Emits an append-only domain event on valid transition.
   */
  public transition(to: RunState, reason?: string, metadata?: Record<string, unknown>): StateTransitionResult {
    if (!canTransition(this.currentState, to)) {
      throw new InvalidStateTransitionError(
        this.currentState,
        to,
        `Transition from ${this.currentState} to ${to} is rejected by Kernel State Machine`
      );
    }

    const previousState = this.currentState;
    this.currentState = to;

    const event = DomainEventFactory.create({
      runId: this.runId,
      sessionId: this.sessionId,
      type: 'KERNEL_STATE_TRANSITION',
      payload: {
        from: previousState,
        to,
        reason: reason || 'Normal execution transition',
        metadata: metadata || {},
      },
    });

    this.eventStore.append(event);

    return {
      previousState,
      newState: to,
      event,
    };
  }

  /**
   * Replays an event stream to reconstruct the exact StateMachine state.
   */
  public static replay(runId: string, sessionId: string, events: readonly DomainEvent[], eventStore: EventStore): StateMachine {
    const sm = new StateMachine(runId, sessionId, eventStore, 'RECEIVED');
    for (const evt of events) {
      if (evt.type === 'KERNEL_STATE_TRANSITION' && evt.payload && typeof evt.payload === 'object') {
        const payload = evt.payload as { from: RunState; to: RunState };
        if (payload.to) {
          sm.currentState = payload.to;
        }
      }
    }
    return sm;
  }
}
