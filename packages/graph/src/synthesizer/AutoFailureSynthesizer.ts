import * as fs from 'node:fs';
import * as path from 'node:path';
import type { FailureEvidence } from '@dev-harness/spec';
import { StackTraceParser } from './StackTraceParser.js';

export interface SynthesizeOptions {
  runId: string;
  taskTitle: string;
  rawOutput: string;
  domain?: string;
  failedHypothesis?: string;
  workspaceRoot: string;
}

export class AutoFailureSynthesizer {
  public static synthesizeAndSave(options: SynthesizeOptions): FailureEvidence {
    const parsed = StackTraceParser.parse(options.rawOutput);
    const failureId = `FAIL-${Date.now().toString().slice(-4)}`;

    const failureEvidence: FailureEvidence = {
      id: failureId,
      timestamp: new Date().toISOString(),
      task: options.taskTitle,
      evidenceStrength: 'high',
      verifiedAt: new Date().toISOString(),
      supersededBy: null,
      evidence: {
        runId: options.runId,
        failingTests: parsed.failingTests.length > 0 ? parsed.failingTests : ['unknown_test'],
        observedSymptom: parsed.errorMessage,
      },
      scope: {
        domain: options.domain || 'general',
      },
      failedHypothesis: options.failedHypothesis || `Initial implementation failed verification: ${parsed.errorMessage}`,
      rootCause: `Assertion failed in ${parsed.failingFile || 'test suite'}: ${parsed.errorMessage}`,
      lesson: `Avoid pattern that caused '${parsed.errorMessage}'. Verify assumptions with isolated unit test before modifying code.`,
      doNotRepeatWhen: [options.domain || 'general', 'regression_risk'],
    };

    // Persist to .harness/knowledge/failures/FAIL-XXX.json
    const failuresDir = path.join(options.workspaceRoot, '.harness', 'knowledge', 'failures');
    if (!fs.existsSync(failuresDir)) {
      fs.mkdirSync(failuresDir, { recursive: true });
    }

    const filePath = path.join(failuresDir, `${failureId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(failureEvidence, null, 2), 'utf8');

    return failureEvidence;
  }
}
