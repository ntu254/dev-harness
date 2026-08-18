import type { HandoffPackage } from '@dev-harness/spec';
import { GitWorkspace } from '../git/GitWorkspace.js';

export interface HandoffValidationResult {
  isValid: boolean;
  status: 'HANDOFF_VALID' | 'HANDOFF_STALE';
  expectedWorkspaceFingerprint: string;
  actualWorkspaceFingerprint: string;
  mismatchReason?: string;
}

export class HandoffValidator {
  private readonly gitWorkspace: GitWorkspace;

  constructor(workspaceRoot: string) {
    this.gitWorkspace = new GitWorkspace(workspaceRoot);
  }

  public validate(handoff: HandoffPackage): HandoffValidationResult {
    const currentWorkspaceFingerprint = this.gitWorkspace.getTreeFingerprint();
    const expectedWorkspaceFingerprint = handoff.fingerprints.workspaceFingerprint;

    if (currentWorkspaceFingerprint !== expectedWorkspaceFingerprint) {
      return {
        isValid: false,
        status: 'HANDOFF_STALE',
        expectedWorkspaceFingerprint,
        actualWorkspaceFingerprint: currentWorkspaceFingerprint,
        mismatchReason: 'Workspace files were modified outside of Harness after Handoff creation',
      };
    }

    return {
      isValid: true,
      status: 'HANDOFF_VALID',
      expectedWorkspaceFingerprint,
      actualWorkspaceFingerprint: currentWorkspaceFingerprint,
    };
  }
}
