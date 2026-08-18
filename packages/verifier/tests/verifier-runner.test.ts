import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { VerifierRunner } from '../src/VerifierRunner.js';
import { LocalProcessSandboxProvider } from '@dev-harness/sandbox';
import type { SandboxSpec } from '@dev-harness/spec';

describe('Phase 3 Verifier: Independent Verification Subsystem (Gates 5, 6)', () => {
  let tempDir: string;
  let sandbox: LocalProcessSandboxProvider;
  let sandboxId: string;

  beforeEach(async () => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'harness-verifier-test-'));
    sandbox = new LocalProcessSandboxProvider();

    const spec: SandboxSpec = {
      baseImage: 'node:20-alpine',
      workspaceMountPath: tempDir,
      readOnlyPaths: [],
      writablePaths: [tempDir],
      environment: { values: {}, secretRefs: [] },
      networkAllowlist: [],
      resourceLimits: { cpuCores: 1, memoryMb: 512, timeoutSeconds: 10 },
    };

    sandboxId = await sandbox.create(spec);
  });

  afterEach(async () => {
    await sandbox.destroy(sandboxId);
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('Gate 5 & 6: Successfully verifies TDD Red -> Green strategy with TrustLevel: harness-executed', async () => {
    const verifier = new VerifierRunner(sandbox);

    // 1. Passing test script (exit code 0)
    const proof = await verifier.verify({
      sandboxId,
      testCommand: 'node',
      testArgs: ['-e', 'console.log("Tests passed"); process.exit(0)'],
      strategy: 'tdd_red_green',
      initialTestExitCode: 1, // Red state witnessed earlier
    });

    expect(proof.level).toBe('harness-executed');
    expect(proof.passedGates).toContain('test_suite_execution');
    expect(proof.passedGates).toContain('strategy_tdd_red_green');
    expect(proof.failedGates.length).toBe(0);
    expect(proof.rawEvidence.exitCode).toBe(0);
  });

  it('Gate 6: Fails TDD strategy if no initial failure (Red state) was witnessed', async () => {
    const verifier = new VerifierRunner(sandbox);

    const proof = await verifier.verify({
      sandboxId,
      testCommand: 'node',
      testArgs: ['-e', 'process.exit(0)'],
      strategy: 'tdd_red_green',
      initialTestExitCode: 0, // No Red state witnessed!
    });

    expect(proof.level).toBe('harness-executed');
    expect(proof.failedGates).toContain('strategy_tdd_red_green');
  });

  it('Gate 5 & 6: Fails verification if test execution fails (exit code != 0)', async () => {
    const verifier = new VerifierRunner(sandbox);

    const proof = await verifier.verify({
      sandboxId,
      testCommand: 'node',
      testArgs: ['-e', 'console.error("1 test failed"); process.exit(1)'],
      strategy: 'regression_first',
    });

    expect(proof.level).toBe('harness-executed');
    expect(proof.failedGates).toContain('test_suite_execution');
    expect(proof.rawEvidence.exitCode).toBe(1);
  });
});
