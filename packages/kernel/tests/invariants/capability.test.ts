import { describe, it, expect } from 'vitest';
import { CapabilityResolver } from '../../src/domain/capability/CapabilityResolver.js';
import type { Capability } from '@dev-harness/spec';

describe('Invariant Tests: Monotonic Capability Restriction (Gate 5)', () => {
  it('Gate 5: Resolves effective capabilities as strict intersection of 4 sets', () => {
    const agentProvided: Capability[] = ['filesystem.read', 'filesystem.write', 'terminal.exec', 'browser.open'];
    const taskRequested: Capability[] = ['filesystem.read', 'filesystem.write', 'terminal.exec'];
    const policyAllowed: Capability[] = ['filesystem.read', 'filesystem.write', 'git.read'];
    const sandboxGranted: Capability[] = ['filesystem.read', 'filesystem.write', 'network.http'];

    const effective = CapabilityResolver.resolve({
      agentProvided,
      taskRequested,
      policyAllowed,
      sandboxGranted,
    });

    // Only 'filesystem.read' and 'filesystem.write' are in ALL 4 sets
    expect(effective).toEqual(['filesystem.read', 'filesystem.write']);
  });

  it('Gate 5: Subsystem cannot expand effective capabilities beyond intersection', () => {
    const agentProvided: Capability[] = ['filesystem.read', 'terminal.exec'];
    const taskRequested: Capability[] = ['filesystem.read', 'terminal.exec'];
    const policyAllowed: Capability[] = ['filesystem.read']; // Policy denies terminal.exec
    const sandboxGranted: Capability[] = ['filesystem.read', 'terminal.exec'];

    const effective = CapabilityResolver.resolve({
      agentProvided,
      taskRequested,
      policyAllowed,
      sandboxGranted,
    });

    expect(effective).toEqual(['filesystem.read']);
    expect(CapabilityResolver.isPermitted('terminal.exec', effective)).toBe(false);
    expect(CapabilityResolver.isPermitted('filesystem.read', effective)).toBe(true);
  });

  it('Gate 5: Returns empty set if any of the sets has zero overlap', () => {
    const effective = CapabilityResolver.resolve({
      agentProvided: ['browser.open'],
      taskRequested: ['terminal.exec'],
      policyAllowed: ['terminal.exec'],
      sandboxGranted: ['terminal.exec'],
    });

    expect(effective).toEqual([]);
  });
});
