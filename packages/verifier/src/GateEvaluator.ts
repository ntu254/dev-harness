import type { VerificationStrategy } from '@dev-harness/spec';

export interface GateEvaluationInput {
  strategy: VerificationStrategy;
  initialTestExitCode?: number; // E.g., for TDD Red state (should be != 0)
  finalTestExitCode: number;    // Final test execution (should be 0)
  passedGateNames: string[];
  failedGateNames: string[];
}

export interface GateEvaluationResult {
  passed: boolean;
  strategy: VerificationStrategy;
  reasons: string[];
}

export class GateEvaluator {
  public static evaluate(input: GateEvaluationInput): GateEvaluationResult {
    const reasons: string[] = [];

    switch (input.strategy) {
      case 'tdd_red_green':
        // TDD requires initial failure (Red) and final success (Green)
        if (input.initialTestExitCode === undefined || input.initialTestExitCode === 0) {
          reasons.push('TDD Violation: No failing test (RED state) was witnessed prior to implementation');
        }
        if (input.finalTestExitCode !== 0) {
          reasons.push(`TDD Violation: Final test suite failed with exit code ${input.finalTestExitCode}`);
        }
        break;

      case 'regression_first':
      case 'behavioral_invariance':
      case 'dry_run_validation':
      case 'visual_regression':
      default:
        if (input.finalTestExitCode !== 0) {
          reasons.push(`Verification gate failed with exit code ${input.finalTestExitCode}`);
        }
        break;
    }

    if (input.failedGateNames.length > 0) {
      reasons.push(`Failed explicit gates: ${input.failedGateNames.join(', ')}`);
    }

    return {
      passed: reasons.length === 0,
      strategy: input.strategy,
      reasons,
    };
  }
}
