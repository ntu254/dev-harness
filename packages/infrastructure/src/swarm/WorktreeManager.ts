import * as fs from 'node:fs';
import * as path from 'node:path';

export interface WorktreeInfo {
  id: string;
  workerId: string;
  path: string;
  createdAt: string;
}

export class WorktreeManager {
  private readonly workspaceRoot: string;
  private readonly worktreesDir: string;

  constructor(workspaceRoot: string) {
    this.workspaceRoot = path.resolve(workspaceRoot);
    this.worktreesDir = path.join(this.workspaceRoot, '.harness', 'runtime', 'worktrees');
  }

  public createWorktree(workerId: string): WorktreeInfo {
    const worktreeId = `WT-${workerId}-${Date.now().toString().slice(-4)}`;
    const targetPath = path.join(this.worktreesDir, worktreeId);

    if (!fs.existsSync(this.worktreesDir)) {
      fs.mkdirSync(this.worktreesDir, { recursive: true });
    }

    // Copy source workspace files into isolated worktree (excluding node_modules, .git, .harness/runtime)
    this.copyDirectoryRecursive(this.workspaceRoot, targetPath, ['node_modules', '.git', '.harness/runtime']);

    return {
      id: worktreeId,
      workerId,
      path: targetPath,
      createdAt: new Date().toISOString(),
    };
  }

  public cleanupWorktree(worktreeId: string): void {
    const targetPath = path.join(this.worktreesDir, worktreeId);
    if (fs.existsSync(targetPath)) {
      fs.rmSync(targetPath, { recursive: true, force: true });
    }
  }

  private copyDirectoryRecursive(src: string, dest: string, ignores: string[]): void {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      const relPath = path.relative(this.workspaceRoot, srcPath).replace(/\\/g, '/');
      if (ignores.some(ig => relPath === ig || relPath.startsWith(ig + '/'))) {
        continue;
      }

      if (entry.isDirectory()) {
        this.copyDirectoryRecursive(srcPath, destPath, ignores);
      } else if (entry.isFile()) {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
}
