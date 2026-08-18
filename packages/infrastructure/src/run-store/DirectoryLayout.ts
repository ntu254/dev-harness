import * as path from 'node:path';

export class DirectoryLayout {
  public static getHarnessRoot(workspaceRoot: string): string {
    return path.join(workspaceRoot, '.harness');
  }

  public static getRunsDir(workspaceRoot: string): string {
    return path.join(workspaceRoot, '.harness', 'runtime', 'runs');
  }

  public static getRunDir(workspaceRoot: string, runId: string): string {
    return path.join(this.getRunsDir(workspaceRoot), runId);
  }

  public static getPatchesDir(workspaceRoot: string, runId: string): string {
    return path.join(this.getRunDir(workspaceRoot, runId), 'patches');
  }

  public static getArtifactsDir(workspaceRoot: string, runId: string): string {
    return path.join(this.getRunDir(workspaceRoot, runId), 'artifacts');
  }

  public static getKnowledgeDir(workspaceRoot: string): string {
    return path.join(workspaceRoot, '.harness', 'knowledge');
  }

  public static getFailuresDir(workspaceRoot: string): string {
    return path.join(this.getKnowledgeDir(workspaceRoot), 'failures');
  }

  public static getDecisionsDir(workspaceRoot: string): string {
    return path.join(this.getKnowledgeDir(workspaceRoot), 'decisions');
  }
}
