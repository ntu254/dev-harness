import * as path from 'node:path';
import { WorktreeManager, type WorktreeInfo } from './WorktreeManager.js';
import { SemanticMergeResolver, type MergeResult } from './SemanticMergeResolver.js';
import { PeerReviewConsensus, type ReviewEvaluation } from './PeerReviewConsensus.js';

export interface SwarmWorkerTask {
  workerId: string;
  intent: string;
  execute: (worktreePath: string) => Promise<Array<{ relativePath: string; content: string }>>;
}

export interface SwarmExecutionResult {
  sessionId: string;
  success: boolean;
  activeWorktrees: WorktreeInfo[];
  peerReview: ReviewEvaluation;
  mergeResult: MergeResult;
  completedWorkers: string[];
}

export class SwarmCoordinator {
  private readonly workspaceRoot: string;
  private readonly worktreeManager: WorktreeManager;

  constructor(workspaceRoot: string) {
    this.workspaceRoot = path.resolve(workspaceRoot);
    this.worktreeManager = new WorktreeManager(this.workspaceRoot);
  }

  public async coordinateSwarm(
    sessionId: string,
    tasks: SwarmWorkerTask[],
    reviewerId: string = 'reviewer-agent'
  ): Promise<SwarmExecutionResult> {
    const activeWorktrees: WorktreeInfo[] = [];
    const workerChanges: Map<string, Array<{ relativePath: string; content: string }>> = new Map();
    const completedWorkers: string[] = [];

    // 1. Launch all workers concurrently in isolated worktrees
    const workerPromises = tasks.map(async (task) => {
      const worktree = this.worktreeManager.createWorktree(task.workerId);
      activeWorktrees.push(worktree);

      try {
        const changes = await task.execute(worktree.path);
        workerChanges.set(task.workerId, changes);
        completedWorkers.push(task.workerId);
      } finally {
        this.worktreeManager.cleanupWorktree(worktree.id);
      }
    });

    await Promise.all(workerPromises);

    // 2. Aggregate all changes for Peer Review
    const allChanges: Array<{ relativePath: string; content: string }> = [];
    for (const changes of workerChanges.values()) {
      allChanges.push(...changes);
    }

    // 3. Peer-Review Consensus Gate
    const peerReview = PeerReviewConsensus.evaluate(reviewerId, allChanges);

    // 4. If peer review approved, perform 3-way semantic merge into target workspace
    let mergeResult: MergeResult = { success: false, mergedFiles: [], conflicts: [] };
    if (peerReview.verdict === 'APPROVED') {
      mergeResult = SemanticMergeResolver.resolveAndApply(this.workspaceRoot, workerChanges);
    }

    return {
      sessionId,
      success: peerReview.verdict === 'APPROVED' && mergeResult.success,
      activeWorktrees,
      peerReview,
      mergeResult,
      completedWorkers,
    };
  }
}
