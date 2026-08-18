import type { RunState } from '@dev-harness/spec';

export const VALID_TRANSITIONS: Readonly<Record<RunState, readonly RunState[]>> = {
  RECEIVED: ['PLANNED', 'CANCELLED'],
  PLANNED: ['AUTHORIZED', 'CANCELLED'],
  AUTHORIZED: ['EXECUTING', 'CANCELLED'],
  EXECUTING: ['VERIFYING', 'PAUSED', 'INTERRUPTED', 'EXPIRED', 'CANCELLED'],
  VERIFYING: ['COMPLETED', 'RECOVER', 'BLOCKED', 'CANCELLED'],
  PAUSED: ['EXECUTING', 'CANCELLED'],
  INTERRUPTED: ['EXECUTING', 'CANCELLED'],
  RECOVER: ['EXECUTING', 'BLOCKED', 'CANCELLED'],
  BLOCKED: [],
  COMPLETED: [],
  CANCELLED: [],
  EXPIRED: [],
};

export function canTransition(from: RunState, to: RunState): boolean {
  const allowed = VALID_TRANSITIONS[from];
  return allowed ? allowed.includes(to) : false;
}
