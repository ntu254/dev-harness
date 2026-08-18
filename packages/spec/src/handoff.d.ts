import type { VerificationProof } from './run.js';
export interface CanonicalFingerprints {
    contextFingerprint: string;
    workspaceFingerprint: string;
    verificationFingerprint: string;
}
export interface HandoffPackage {
    handoffId: string;
    sourceRunId: string;
    sourceSessionId: string;
    sourceCheckpointId: string;
    generatedAt: string;
    fingerprints: CanonicalFingerprints;
    summary: string;
    currentState: string;
    changedFiles: Array<{
        path: string;
        status: 'modified' | 'added' | 'deleted';
    }>;
    knownIssues: string[];
    unresolvedItems: string[];
    relevantMemoryIds: string[];
    verificationProof: VerificationProof;
    nextRecommendedActions: string[];
}
//# sourceMappingURL=handoff.d.ts.map