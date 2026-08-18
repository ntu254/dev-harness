import * as fs from 'node:fs';
import * as path from 'node:path';
import { GitWorkspace } from '../git/GitWorkspace.js';
import type { CheckpointRef } from '../git/types.js';

export interface CheckpointMetadata {
  checkpointId: string;
  runId: string;
  sessionId: string;
  treeFingerprint: string;
  timestamp: string;
  description: string;
}

export class CheckpointManager {
  private readonly workspaceRoot: string;
  private readonly gitWorkspace: GitWorkspace;
  private readonly checkpointsDir: string;

  constructor(workspaceRoot: string) {
    this.workspaceRoot = path.resolve(workspaceRoot);
    this.gitWorkspace = new GitWorkspace(this.workspaceRoot);
    this.checkpointsDir = path.join(this.workspaceRoot, '.harness', 'runtime', 'checkpoints');
  }

  public createCheckpoint(runId: string, sessionId: string, checkpointId: string, description: string = ''): CheckpointMetadata {
    const gitCheckpoint: CheckpointRef = this.gitWorkspace.createCheckpoint(checkpointId, description);
    
    const metadata: CheckpointMetadata = {
      checkpointId,
      runId,
      sessionId,
      treeFingerprint: gitCheckpoint.treeFingerprint,
      timestamp: gitCheckpoint.timestamp,
      description: description || `Checkpoint for ${runId}`,
    };

    if (!fs.existsSync(this.checkpointsDir)) {
      fs.mkdirSync(this.checkpointsDir, { recursive: true });
    }

    const filePath = path.join(this.checkpointsDir, `${checkpointId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(metadata, null, 2), 'utf8');

    return metadata;
  }

  public getCheckpoint(checkpointId: string): CheckpointMetadata | null {
    const filePath = path.join(this.checkpointsDir, `${checkpointId}.json`);
    if (!fs.existsSync(filePath)) {
      return null;
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as CheckpointMetadata;
  }
}
