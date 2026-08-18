import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { WorktreeManager } from '../src/swarm/WorktreeManager.js';
import { SemanticMergeResolver } from '../src/swarm/SemanticMergeResolver.js';
import { PeerReviewConsensus } from '../src/swarm/PeerReviewConsensus.js';
import { SwarmCoordinator, type SwarmWorkerTask } from '../src/swarm/SwarmCoordinator.js';

describe('v2.0 Swarm: Multi-Agent Concurrency, Git Worktrees & 3-Way Merge', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'harness-swarm-test-'));

    // Base repo setup
    fs.mkdirSync(path.join(tempDir, 'src'), { recursive: true });
    fs.writeFileSync(path.join(tempDir, 'package.json'), '{"name":"swarm-app"}');
    fs.writeFileSync(path.join(tempDir, 'src', 'index.ts'), 'export const version = "2.0";');
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('Gate 1: WorktreeManager isolates workspace and cleans up properly', () => {
    const wtManager = new WorktreeManager(tempDir);
    const wt = wtManager.createWorktree('coder-1');

    expect(fs.existsSync(wt.path)).toBe(true);
    expect(fs.existsSync(path.join(wt.path, 'package.json'))).toBe(true);

    wtManager.cleanupWorktree(wt.id);
    expect(fs.existsSync(wt.path)).toBe(false);
  });

  it('Gate 2 & 3: SemanticMergeResolver merges non-conflicting multi-worker changes and detects conflicts', () => {
    // 1. Non-conflicting changes
    const workerChanges = new Map<string, Array<{ relativePath: string; content: string }>>();
    workerChanges.set('frontend-worker', [{ relativePath: 'src/ui.ts', content: 'export const Button = () => null;' }]);
    workerChanges.set('backend-worker', [{ relativePath: 'src/api.ts', content: 'export const getOrders = () => [];' }]);

    const cleanResult = SemanticMergeResolver.resolveAndApply(tempDir, workerChanges);
    expect(cleanResult.success).toBe(true);
    expect(cleanResult.mergedFiles).toContain('src/ui.ts');
    expect(cleanResult.mergedFiles).toContain('src/api.ts');
    expect(fs.existsSync(path.join(tempDir, 'src', 'ui.ts'))).toBe(true);
    expect(fs.existsSync(path.join(tempDir, 'src', 'api.ts'))).toBe(true);

    // 2. Conflicting changes on same file
    const conflictingChanges = new Map<string, Array<{ relativePath: string; content: string }>>();
    conflictingChanges.set('worker-a', [{ relativePath: 'src/config.ts', content: 'export const port = 3000;' }]);
    conflictingChanges.set('worker-b', [{ relativePath: 'src/config.ts', content: 'export const port = 8080;' }]);

    const conflictResult = SemanticMergeResolver.resolveAndApply(tempDir, conflictingChanges);
    expect(conflictResult.success).toBe(false);
    expect(conflictResult.conflicts.length).toBe(1);
  });

  it('Gate 4: PeerReviewConsensus rejects dangerous forbidden patterns', () => {
    const safeChanges = [{ relativePath: 'src/helper.ts', content: 'export function add(a, b) { return a + b; }' }];
    const safeReview = PeerReviewConsensus.evaluate('reviewer-1', safeChanges);
    expect(safeReview.verdict).toBe('APPROVED');

    const dangerousChanges = [{ relativePath: 'src/bad.ts', content: 'eval("maliciousCode()");' }];
    const badReview = PeerReviewConsensus.evaluate('reviewer-1', dangerousChanges);
    expect(badReview.verdict).toBe('REJECTED');
    expect(badReview.feedback[0]).toContain('forbidden pattern');
  });

  it('Gate 5: SwarmCoordinator executes 2 workers in parallel and merges into target workspace', async () => {
    const coordinator = new SwarmCoordinator(tempDir);

    const tasks: SwarmWorkerTask[] = [
      {
        workerId: 'worker-auth',
        intent: 'Build auth module',
        execute: async (worktreePath) => {
          const authFile = path.join(worktreePath, 'src', 'auth.ts');
          const content = 'export const authenticate = () => true;';
          fs.writeFileSync(authFile, content);
          return [{ relativePath: 'src/auth.ts', content }];
        },
      },
      {
        workerId: 'worker-payment',
        intent: 'Build payment module',
        execute: async (worktreePath) => {
          const paymentFile = path.join(worktreePath, 'src', 'payment.ts');
          const content = 'export const chargeCard = () => ({ status: "paid" });';
          fs.writeFileSync(paymentFile, content);
          return [{ relativePath: 'src/payment.ts', content }];
        },
      },
    ];

    const result = await coordinator.coordinateSwarm('SES-SWARM-01', tasks, 'architect-reviewer');

    expect(result.success).toBe(true);
    expect(result.completedWorkers).toContain('worker-auth');
    expect(result.completedWorkers).toContain('worker-payment');
    expect(result.peerReview.verdict).toBe('APPROVED');
    expect(fs.existsSync(path.join(tempDir, 'src', 'auth.ts'))).toBe(true);
    expect(fs.existsSync(path.join(tempDir, 'src', 'payment.ts'))).toBe(true);
  });
});
