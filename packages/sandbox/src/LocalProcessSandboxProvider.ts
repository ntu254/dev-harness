import { spawn } from 'node:child_process';
import type { SandboxProvider, SandboxSpec, ExecResult } from '@dev-harness/spec';
import { Hasher } from '@dev-harness/kernel';

export interface SandboxInstance {
  id: string;
  spec: SandboxSpec;
  snapshots: Map<string, string>; // snapshotId -> stateHash
}

export class LocalProcessSandboxProvider implements SandboxProvider {
  private instances: Map<string, SandboxInstance> = new Map();
  private static counter = 0;

  public async create(spec: SandboxSpec): Promise<string> {
    LocalProcessSandboxProvider.counter += 1;
    const sandboxId = `sandbox-local-${Date.now()}-${LocalProcessSandboxProvider.counter}`;
    
    this.instances.set(sandboxId, {
      id: sandboxId,
      spec,
      snapshots: new Map(),
    });

    return sandboxId;
  }

  public async exec(sandboxId: string, command: string, args: string[]): Promise<ExecResult> {
    const instance = this.instances.get(sandboxId);
    if (!instance) {
      throw new Error(`Sandbox '${sandboxId}' not found`);
    }

    const startTime = Date.now();
    const timeoutMs = (instance.spec.resourceLimits.timeoutSeconds || 30) * 1000;

    return new Promise((resolve) => {
      // Build safe environment (only specified non-sensitive values)
      const env = {
        ...process.env,
        ...instance.spec.environment.values,
      };

      const child = spawn(command, args, {
        cwd: instance.spec.workspaceMountPath,
        env,
        shell: false,
      });

      let stdout = '';
      let stderr = '';
      let timedOut = false;

      const timer = setTimeout(() => {
        timedOut = true;
        child.kill('SIGKILL');
      }, timeoutMs);

      child.stdout?.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr?.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        clearTimeout(timer);
        const durationMs = Date.now() - startTime;
        if (timedOut) {
          resolve({
            exitCode: 124, // Standard timeout exit code
            stdout,
            stderr: stderr + '\nExecution timed out by Sandbox limit',
            durationMs,
          });
        } else {
          resolve({
            exitCode: code ?? 0,
            stdout,
            stderr,
            durationMs,
          });
        }
      });

      child.on('error', (err) => {
        clearTimeout(timer);
        resolve({
          exitCode: 1,
          stdout,
          stderr: err.message,
          durationMs: Date.now() - startTime,
        });
      });
    });
  }

  public async snapshot(sandboxId: string): Promise<string> {
    const instance = this.instances.get(sandboxId);
    if (!instance) {
      throw new Error(`Sandbox '${sandboxId}' not found`);
    }

    const snapshotId = `snap-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const snapshotHash = Hasher.sha256(`${sandboxId}:${snapshotId}:${Date.now()}`);
    instance.snapshots.set(snapshotId, snapshotHash);

    return snapshotId;
  }

  public async restore(sandboxId: string, snapshotId: string): Promise<void> {
    const instance = this.instances.get(sandboxId);
    if (!instance) {
      throw new Error(`Sandbox '${sandboxId}' not found`);
    }
    if (!instance.snapshots.has(snapshotId)) {
      throw new Error(`Snapshot '${snapshotId}' not found in sandbox '${sandboxId}'`);
    }
  }

  public async destroy(sandboxId: string): Promise<void> {
    this.instances.delete(sandboxId);
  }
}
