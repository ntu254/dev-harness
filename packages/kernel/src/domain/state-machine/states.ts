import type { RunState } from '@dev-harness/spec';

export const ALL_RUN_STATES: readonly RunState[] = [
  'RECEIVED',
  'PLANNED',
  'AUTHORIZED',
  'EXECUTING',
  'VERIFYING',
  'PAUSED',
  'INTERRUPTED',
  'EXPIRED',
  'CANCELLED',
  'RECOVER',
  'BLOCKED',
  'COMPLETED',
] as const;

export const TERMINAL_STATES: readonly RunState[] = [
  'COMPLETED',
  'BLOCKED',
  'CANCELLED',
  'EXPIRED',
] as const;
