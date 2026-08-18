import { describe, it, expect, beforeEach } from 'vitest';
import { StateMachine, InvalidStateTransitionError } from '../../src/domain/state-machine/StateMachine.js';
import { EventStore } from '../../src/domain/events/EventStore.js';
import { VALID_TRANSITIONS, canTransition } from '../../src/domain/state-machine/transitions.js';
import type { RunState } from '@dev-harness/spec';

describe('Invariant Tests: State Machine & Event Sourcing (Gates 2, 3, 4, 9)', () => {
  let eventStore: EventStore;
  let sm: StateMachine;

  beforeEach(() => {
    eventStore = new EventStore();
    sm = new StateMachine('run-001', 'ses-001', eventStore, 'RECEIVED');
  });

  it('Gate 2: Rejects invalid state transitions strictly', () => {
    expect(sm.getState()).toBe('RECEIVED');

    // Invalid: RECEIVED -> EXECUTING (must go through PLANNED -> AUTHORIZED)
    expect(() => sm.transition('EXECUTING')).toThrow(InvalidStateTransitionError);
    expect(sm.getState()).toBe('RECEIVED'); // State unchanged

    // Invalid: RECEIVED -> COMPLETED
    expect(() => sm.transition('COMPLETED')).toThrow(InvalidStateTransitionError);
  });

  it('Gate 3: Valid transition produces append-only event in EventStore', () => {
    expect(eventStore.getEvents('run-001').length).toBe(0);

    const result = sm.transition('PLANNED', 'Plan established');
    expect(result.previousState).toBe('RECEIVED');
    expect(result.newState).toBe('PLANNED');
    expect(sm.getState()).toBe('PLANNED');

    const events = eventStore.getEvents('run-001');
    expect(events.length).toBe(1);
    expect(events[0].type).toBe('KERNEL_STATE_TRANSITION');
    expect((events[0].payload as { from: RunState; to: RunState }).from).toBe('RECEIVED');
    expect((events[0].payload as { from: RunState; to: RunState }).to).toBe('PLANNED');
  });

  it('Gate 4: Kernel StateMachine is sole authority; transitions follow valid state graph', () => {
    // Normal happy path
    sm.transition('PLANNED');
    sm.transition('AUTHORIZED');
    sm.transition('EXECUTING');
    sm.transition('VERIFYING');
    sm.transition('COMPLETED');

    expect(sm.getState()).toBe('COMPLETED');
    expect(eventStore.getEvents('run-001').length).toBe(5);

    // Terminal state cannot transition to anything
    expect(() => sm.transition('RECEIVED')).toThrow(InvalidStateTransitionError);
    expect(() => sm.transition('EXECUTING')).toThrow(InvalidStateTransitionError);
  });

  it('Gate 9: Event stream can completely reconstruct exact StateMachine state via replay', () => {
    sm.transition('PLANNED');
    sm.transition('AUTHORIZED');
    sm.transition('EXECUTING');
    sm.transition('VERIFYING');
    sm.transition('RECOVER', 'Tests failed, retrying');
    sm.transition('EXECUTING', 'Retry attempt 2');
    sm.transition('VERIFYING');
    sm.transition('COMPLETED', 'All gates passed');

    const allEvents = eventStore.getEvents('run-001');
    expect(allEvents.length).toBe(8);

    // Replay on fresh instance
    const freshEventStore = new EventStore();
    const reconstructed = StateMachine.replay('run-001', 'ses-001', allEvents, freshEventStore);

    expect(reconstructed.getState()).toBe('COMPLETED');
    expect(reconstructed.getRunId()).toBe('run-001');
  });
});
