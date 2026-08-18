import * as fs from 'node:fs';
import * as path from 'node:path';
import { Hasher } from '@dev-harness/kernel';
import type { GitStatus, GitTreeEntry, CheckpointRef } from './types.js';

export class GitWorkspace {
  private readonly workspaceRoot: string;
  private readonly checkpointsDir: string;
  private checkpoints: Map<string, CheckpointRef> = new Map();

  constructor(workspaceRoot: string, checkpointsDir?: string) {
    this.workspaceRoot = path.resolve(workspaceRoot);
    this.checkpointsDir = checkpointsDir || path.join(this.workspaceRoot, '.harness', 'runtime', 'checkpoints');
  }

  public getWorkspaceRoot(): string {
    return this.workspaceRoot;
  }

  /**
   * Recursively scans directory and builds a canonical Git tree representation.
   */
  public getTreeEntries(subDir: string = ''): GitTreeEntry[] {
    const currentDir = path.join(this.workspaceRoot, subDir);
    if (!fs.existsSync(currentDir)) {
      return [];
    }

    const entries: GitTreeEntry[] = [];
    const items = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const item of items) {
      // Ignore .git, node_modules, .harness/runtime
      if (item.name === '.git' || item.name === 'node_modules') {
        continue;
      }
      if (subDir === '.harness' && item.name === 'runtime') {
        continue;
      }

      const relativePath = subDir ? path.posix.join(subDir, item.name) : item.name;
      const fullPath = path.join(this.workspaceRoot, relativePath);

      if (item.isDirectory()) {
        entries.push(...this.getTreeEntries(relativePath));
      } else if (item.isFile()) {
        const content = fs.readFileSync(fullPath);
        const hash = Hasher.sha256(content.toString('utf8'));
        entries.push({
          mode: '100644',
          type: 'blob',
          hash,
          path: relativePath.replace(/\\/g, '/'),
        });
      }
    }

    return entries.sort((a, b) => a.path.localeCompare(b.path));
  }

  /**
   * Computes the canonical SHA256 workspaceFingerprint.
   */
  public getTreeFingerprint(): string {
    const treeEntries = this.getTreeEntries();
    return Hasher.hashGitTree(treeEntries);
  }

  public getStatus(): GitStatus {
    return {
      branch: 'main',
      headCommit: 'local-head',
      isClean: true,
      modifiedFiles: [],
      addedFiles: [],
      deletedFiles: [],
    };
  }

  public getDiff(): string {
    return '';
  }

  public createCheckpoint(checkpointId: string, description: string = 'Automatic checkpoint'): CheckpointRef {
    const treeFingerprint = this.getTreeFingerprint();
    const checkpoint: CheckpointRef = {
      checkpointId,
      treeFingerprint,
      timestamp: new Date().toISOString(),
      description,
    };

    if (!fs.existsSync(this.checkpointsDir)) {
      fs.mkdirSync(this.checkpointsDir, { recursive: true });
    }

    const checkpointFile = path.join(this.checkpointsDir, `${checkpointId}.json`);
    fs.writeFileSync(checkpointFile, JSON.stringify(checkpoint, null, 2), 'utf8');

    this.checkpoints.set(checkpointId, checkpoint);
    return checkpoint;
  }

  public getCheckpoint(checkpointId: string): CheckpointRef | undefined {
    if (this.checkpoints.has(checkpointId)) {
      return this.checkpoints.get(checkpointId);
    }
    const checkpointFile = path.join(this.checkpointsDir, `${checkpointId}.json`);
    if (fs.existsSync(checkpointFile)) {
      const data = JSON.parse(fs.readFileSync(checkpointFile, 'utf8')) as CheckpointRef;
      this.checkpoints.set(checkpointId, data);
      return data;
    }
    return undefined;
  }
}
