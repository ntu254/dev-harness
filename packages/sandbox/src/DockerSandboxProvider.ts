import type { SandboxProvider, SandboxSpec, ExecResult } from '@dev-harness/spec';
import { LocalProcessSandboxProvider } from './LocalProcessSandboxProvider.js';

export class DockerSandboxProvider implements SandboxProvider {
  private fallbackProvider: LocalProcessSandboxProvider = new LocalProcessSandboxProvider();

  public buildDockerRunArgs(spec: SandboxSpec, command: string, args: string[]): string[] {
    const dockerArgs: string[] = [
      'run',
      '--rm',
      '--security-opt=no-new-privileges',
      `--memory=${spec.resourceLimits.memoryMb}m`,
      `--cpus=${spec.resourceLimits.cpuCores}`,
      `-w=${spec.workspaceMountPath}`,
      `-v=${spec.workspaceMountPath}:${spec.workspaceMountPath}:rw`,
    ];

    // Read-only path mounts
    for (const roPath of spec.readOnlyPaths) {
      dockerArgs.push(`-v=${roPath}:${roPath}:ro`);
    }

    // Writable path mounts
    for (const rwPath of spec.writablePaths) {
      if (rwPath !== spec.workspaceMountPath) {
        dockerArgs.push(`-v=${rwPath}:${rwPath}:rw`);
      }
    }

    // Environment variables
    for (const [key, value] of Object.entries(spec.environment.values)) {
      dockerArgs.push(`-e=${key}=${value}`);
    }

    // Base image and command
    dockerArgs.push(spec.baseImage);
    dockerArgs.push(command);
    dockerArgs.push(...args);

    return dockerArgs;
  }

  public async create(spec: SandboxSpec): Promise<string> {
    return this.fallbackProvider.create(spec);
  }

  public async exec(sandboxId: string, command: string, args: string[]): Promise<ExecResult> {
    return this.fallbackProvider.exec(sandboxId, command, args);
  }

  public async snapshot(sandboxId: string): Promise<string> {
    return this.fallbackProvider.snapshot(sandboxId);
  }

  public async restore(sandboxId: string, snapshotId: string): Promise<void> {
    return this.fallbackProvider.restore(sandboxId, snapshotId);
  }

  public async destroy(sandboxId: string): Promise<void> {
    return this.fallbackProvider.destroy(sandboxId);
  }
}
