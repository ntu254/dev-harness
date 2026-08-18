export interface SecretRef {
    id: string;
    envVarName: string;
    scope: string[];
}
export interface SandboxEnv {
    values: Record<string, string>;
    secretRefs: SecretRef[];
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
    create(spec: SandboxSpec): Promise<string>;
    exec(sandboxId: string, command: string, args: string[]): Promise<ExecResult>;
    snapshot(sandboxId: string): Promise<string>;
    restore(sandboxId: string, snapshotId: string): Promise<void>;
    destroy(sandboxId: string): Promise<void>;
}
//# sourceMappingURL=sandbox.d.ts.map