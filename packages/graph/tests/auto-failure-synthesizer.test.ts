import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { AutoFailureSynthesizer } from '../src/synthesizer/AutoFailureSynthesizer.js';
import { StackTraceParser } from '../src/synthesizer/StackTraceParser.js';

describe('v2.0 Graph: Auto Failure Synthesizer & Stack Trace Parser', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'harness-auto-fail-test-'));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('Parses realistic Vitest / Node test failure output', () => {
    const rawErrorOutput = `
FAIL  tests/payment.test.ts > processPayment > should handle concurrency
AssertionError: expected 'FAILED_DEADLOCK' to be 'SUCCESS'
 ❯ tests/payment.test.ts:42:15
    40|   const res = await processPayment(orderId);
    41|   expect(res.status).toBe('SUCCESS');
`;

    const parsed = StackTraceParser.parse(rawErrorOutput);
    expect(parsed.failingTests.length).toBeGreaterThan(0);
    expect(parsed.failingFile).toContain('tests/payment.test.ts');
    expect(parsed.errorMessage).toContain('AssertionError');
  });

  it('Gate 4: Auto-synthesizes and persists valid FAIL-XXX.json on test failure', () => {
    const rawErrorOutput = `
FAIL  tests/payment.test.ts > processPayment > should handle concurrency
AssertionError: expected 'FAILED_DEADLOCK' to be 'SUCCESS'
 ❯ tests/payment.test.ts:42:15
`;

    const synthesized = AutoFailureSynthesizer.synthesizeAndSave({
      runId: 'RUN-500',
      taskTitle: 'Implement payment concurrency advisory lock',
      rawOutput: rawErrorOutput,
      domain: 'payment',
      failedHypothesis: 'In-memory mutex lock across distributed pods',
      workspaceRoot: tempDir,
    });

    expect(synthesized.id).toMatch(/^FAIL-\d{4}$/);
    expect(synthesized.evidence.observedSymptom).toContain('AssertionError');
    expect(synthesized.scope.domain).toBe('payment');

    // Check disk persistence in .harness/knowledge/failures/FAIL-XXX.json
    const failureFile = path.join(tempDir, '.harness', 'knowledge', 'failures', `${synthesized.id}.json`);
    expect(fs.existsSync(failureFile)).toBe(true);

    const content = JSON.parse(fs.readFileSync(failureFile, 'utf8'));
    expect(content.id).toBe(synthesized.id);
    expect(content.lesson).toBeDefined();
  });
});
