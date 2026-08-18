import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { LocalProcessSandboxProvider } from '../src/LocalProcessSandboxProvider.js';
import { DockerSandboxProvider } from '../src/DockerSandboxProvider.js';
import type { SandboxSpec } from '@dev-harness/spec';

describe('Phase 3 Sandbox: LocalProcess & Docker Sandbox Providers (Gates 1, 2, 3)', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'harness-sandbox-test-'));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('Gate 1: Executes commands safely and captures stdout, stderr, exitCode, durationMs', async () => {
    const sandbox = new LocalProcessSandboxProvider();
    const spec: SandboxSpec = {
      baseImage: 'node:20-alpine',
      workspaceMountPath: tempDir,
      readOnlyPaths: [],
      writablePaths: [tempDir],
      environment: { values: { FOO: 'BAR' }, secretRefs: [] },
      networkAllowlist: ['registry.npmjs.org'],
      resourceLimits: { cpuCores: 2, memoryMb: 1024, timeoutSeconds: 5 },
    };

    const sandboxId = await sandbox.create(spec);
    expect(sandboxId).toBeDefined();

    // Run simple node script printing env var
    const result = await sandbox.exec(sandboxId, 'node', ['-e', 'console.log(process.env.FOO)']);
    expect(result.exitCode).toBe(0);
    expect(result.stdout.trim()).toBe('BAR');
    expect(result.durationMs).toBeGreaterThanOrEqual(0);

    await sandbox.destroy(sandboxId);
  });

  it('Gate 2: Enforces timeout and kills runaway processes', async () => {
    const sandbox = new LocalProcessSandboxProvider();
    const spec: SandboxSpec = {
      baseImage: 'node:20-alpine',
      workspaceMountPath: tempDir,
      readOnlyPaths: [],
      writablePaths: [tempDir],
      environment: { values: {}, secretRefs: [] },
      networkAllowlist: [],
      resourceLimits: { cpuCores: 1, memoryMb: 512, timeoutSeconds: 1 }, // 1 second timeout
    };

    const sandboxId = await sandbox.create(spec);

    // Sleep for 5 seconds (will be terminated by 1s timeout)
    const result = await sandbox.exec(sandboxId, 'node', ['-e', 'setTimeout(() => {}, 5000)']);
    expect(result.exitCode).toBe(124); // Timeout exit code
    expect(result.stderr).toContain('timed out');

    await sandbox.destroy(sandboxId);
  });

  it('Gate 3: DockerSandboxProvider builds defense-in-depth CLI arguments', () => {
    const dockerSandbox = new DockerSandboxProvider();
    const spec: SandboxSpec = {
      baseImage: 'node:20-slim',
      workspaceMountPath: '/app',
      readOnlyPaths: ['/etc/ssl'],
      writablePaths: ['/app/dist'],
      environment: { values: { NODE_ENV: 'test' }, secretRefs: [] },
      networkAllowlist: [],
      resourceLimits: { cpuCores: 2, memoryMb: 2048, timeoutSeconds: 30 },
    };

    const args = dockerSandbox.buildDockerRunArgs(spec, 'npm', ['test']);
    expect(args).toContain('--security-opt=no-new-privileges');
    expect(args).toContain('--memory=2048m');
    expect(args).toContain('--cpus=2');
    expect(args).toContain('-v=/etc/ssl:/etc/ssl:ro');
    expect(args).toContain('-v=/app/dist:/app/dist:rw');
    expect(args).toContain('-e=NODE_ENV=test');
    expect(args).toContain('node:20-slim');
    expect(args).toContain('npm');
    expect(args).toContain('test');
  });
});
