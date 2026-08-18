import type { Capability } from '@dev-harness/spec';

export interface CapabilityResolutionInput {
  agentProvided: Capability[];
  taskRequested: Capability[];
  policyAllowed: Capability[];
  sandboxGranted: Capability[];
}

export class CapabilityResolver {
  /**
   * Resolves effective capabilities through strict monotonic intersection:
   * Effective = AgentProvided ∩ TaskRequested ∩ PolicyAllowed ∩ SandboxGranted
   *
   * Invariant: Result is strictly monotonically decreasing (a subset of all 4 inputs).
   */
  public static resolve(input: CapabilityResolutionInput): Capability[] {
    const taskSet = new Set(input.taskRequested);
    const policySet = new Set(input.policyAllowed);
    const sandboxSet = new Set(input.sandboxGranted);

    // Find intersection of all four sets
    const effective: Capability[] = input.agentProvided.filter(cap => 
      taskSet.has(cap) &&
      policySet.has(cap) &&
      sandboxSet.has(cap)
    );

    // Return unique sorted array
    return Array.from(new Set(effective)).sort();
  }

  /**
   * Verifies that a sub-capability set is strictly valid within effective capabilities.
   */
  public static isPermitted(required: Capability, effective: Capability[]): boolean {
    return effective.includes(required);
  }
}
