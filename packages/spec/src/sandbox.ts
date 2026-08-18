export interface SecretRef {
  id: string;
  envVarName: string;
  scope: string[]; // e.g. ["registry.npmjs.org", "api.github.com"]
}

export interface SandboxEnv {
  values: Record<string, string>; // Non-sensitive values only
  secretRefs: SecretRef[];        // Managed via Secret Broker
}

export interface SandboxSpec {
  baseImage: string;
  workspaceMountPath: string;
  readOnlyPaths: string[];
  writablePaths: string[];
  environment: SandboxEnv;
  networkAllowlist: string[];
  resourceLimits: {
    cpuCores: number;
    memoryMb: number;
    timeoutSeconds: number;
  };
}

export interface ExecResult {
  exitCode: number;
  stdout: string;
  stderr: string;
  durationMs: number;
}

export interface SandboxProvider {
  create(spec: SandboxSpec): Promise<string>; // Returns sandboxId
  exec(sandboxId: string, command: string, args: string[]): Promise<ExecResult>;
  snapshot(sandboxId: string): Promise<string>; // Returns snapshotId
  restore(sandboxId: string, snapshotId: string): Promise<void>;
  destroy(sandboxId: string): Promise<void>;
}
