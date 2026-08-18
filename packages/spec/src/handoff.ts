import type { VerificationProof } from './run.js';

export interface CanonicalFingerprints {
  contextFingerprint: string;       // SHA256 of Canonical ContextBundle
  workspaceFingerprint: string;     // SHA256 of Canonical Git Tree
  verificationFingerprint: string;  // SHA256 of Canonical Verification Artifact
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
  changedFiles: Array<{ path: string; status: 'modified' | 'added' | 'deleted' }>;
  knownIssues: string[];
  unresolvedItems: string[];
  relevantMemoryIds: string[];
  verificationProof: VerificationProof;
  nextRecommendedActions: string[];
}
