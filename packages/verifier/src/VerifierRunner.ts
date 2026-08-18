import type { SandboxProvider, VerificationProof, VerificationStrategy } from '@dev-harness/spec';
import { GateEvaluator } from './GateEvaluator.js';

export interface VerifyOptions {
  sandboxId: string;
  testCommand: string;
  testArgs?: string[];
  strategy: VerificationStrategy;
  initialTestExitCode?: number;
}

export class VerifierRunner {
  private readonly sandbox: SandboxProvider;

  constructor(sandbox: SandboxProvider) {
    this.sandbox = sandbox;
  }

  public async verify(options: VerifyOptions): Promise<VerificationProof> {
    const args = options.testArgs || [];
    const execResult = await this.sandbox.exec(options.sandboxId, options.testCommand, args);

    const isExitSuccess = execResult.exitCode === 0;
    const passedGates: string[] = [];
    const failedGates: string[] = [];

    if (isExitSuccess) {
      passedGates.push('test_suite_execution');
    } else {
      failedGates.push('test_suite_execution');
    }

    const gateResult = GateEvaluator.evaluate({
      strategy: options.strategy,
      initialTestExitCode: options.initialTestExitCode,
      finalTestExitCode: execResult.exitCode,
      passedGateNames: passedGates,
      failedGateNames: failedGates,
    });

    if (gateResult.passed) {
      passedGates.push(`strategy_${options.strategy}`);
    } else {
      failedGates.push(`strategy_${options.strategy}`);
    }

    return {
      level: 'harness-executed',
      passedGates,
      failedGates,
      rawEvidence: {
        command: `${options.testCommand} ${args.join(' ')}`.trim(),
        exitCode: execResult.exitCode,
        stdout: execResult.stdout,
        stderr: execResult.stderr,
        durationMs: execResult.durationMs,
        evaluationReasons: gateResult.reasons,
      },
      timestamp: new Date().toISOString(),
    };
  }
}
