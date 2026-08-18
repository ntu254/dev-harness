import * as fs from 'node:fs';
import * as path from 'node:path';
import type { HandoffPackage, ContextBundle, VerificationProof, CanonicalFingerprints } from '@dev-harness/spec';
import { Hasher } from '@dev-harness/kernel';
import { GitWorkspace } from '../git/GitWorkspace.js';

export interface CreateHandoffOptions {
  handoffId: string;
  sourceRunId: string;
  sourceSessionId: string;
  sourceCheckpointId: string;
  contextBundle: ContextBundle;
  verificationProof: VerificationProof;
  summary: string;
  currentState: string;
  changedFiles: Array<{ path: string; status: 'modified' | 'added' | 'deleted' }>;
  knownIssues?: string[];
  unresolvedItems?: string[];
  relevantMemoryIds?: string[];
  nextRecommendedActions: string[];
}

export class HandoffManager {
  private readonly workspaceRoot: string;
  private readonly gitWorkspace: GitWorkspace;
  private readonly handoffsDir: string;

  constructor(workspaceRoot: string) {
    this.workspaceRoot = path.resolve(workspaceRoot);
    this.gitWorkspace = new GitWorkspace(this.workspaceRoot);
    this.handoffsDir = path.join(this.workspaceRoot, '.harness', 'runtime', 'handoffs');
  }

  public computeFingerprints(contextBundle: ContextBundle, verificationProof: VerificationProof): CanonicalFingerprints {
    const workspaceFingerprint = this.gitWorkspace.getTreeFingerprint();
    const contextFingerprint = Hasher.hashCanonical(contextBundle);
    const verificationFingerprint = Hasher.hashCanonical(verificationProof);

    return {
      workspaceFingerprint,
      contextFingerprint,
      verificationFingerprint,
    };
  }

  public createHandoff(options: CreateHandoffOptions): HandoffPackage {
    const fingerprints = this.computeFingerprints(options.contextBundle, options.verificationProof);

    const handoffPackage: HandoffPackage = {
      handoffId: options.handoffId,
      sourceRunId: options.sourceRunId,
      sourceSessionId: options.sourceSessionId,
      sourceCheckpointId: options.sourceCheckpointId,
      generatedAt: new Date().toISOString(),
      fingerprints,
      summary: options.summary,
      currentState: options.currentState,
      changedFiles: options.changedFiles,
      knownIssues: options.knownIssues || [],
      unresolvedItems: options.unresolvedItems || [],
      relevantMemoryIds: options.relevantMemoryIds || [],
      verificationProof: options.verificationProof,
      nextRecommendedActions: options.nextRecommendedActions,
    };

    // Persist Handoff Artifacts
    const handoffDir = path.join(this.handoffsDir, options.handoffId);
    if (!fs.existsSync(handoffDir)) {
      fs.mkdirSync(handoffDir, { recursive: true });
    }

    // 1. handoff.json
    fs.writeFileSync(
      path.join(handoffDir, 'handoff.json'),
      JSON.stringify(handoffPackage, null, 2),
      'utf8'
    );

    // 2. summary.md
    fs.writeFileSync(
      path.join(handoffDir, 'summary.md'),
      `# Handoff Package: ${options.handoffId}\n\n**Source Run:** ${options.sourceRunId}\n**Current State:** ${options.currentState}\n\n## Summary\n${options.summary}\n\n## Next Recommended Actions\n${options.nextRecommendedActions.map((a, i) => `${i + 1}. ${a}`).join('\n')}\n`,
      'utf8'
    );

    // 3. changed-files.json
    fs.writeFileSync(
      path.join(handoffDir, 'changed-files.json'),
      JSON.stringify(options.changedFiles, null, 2),
      'utf8'
    );

    // 4. next-recommended-actions.json
    fs.writeFileSync(
      path.join(handoffDir, 'next-recommended-actions.json'),
      JSON.stringify(options.nextRecommendedActions, null, 2),
      'utf8'
    );

    return handoffPackage;
  }

  public getHandoff(handoffId: string): HandoffPackage | null {
    const handoffFile = path.join(this.handoffsDir, handoffId, 'handoff.json');
    if (!fs.existsSync(handoffFile)) {
      return null;
    }
    return JSON.parse(fs.readFileSync(handoffFile, 'utf8')) as HandoffPackage;
  }
}
