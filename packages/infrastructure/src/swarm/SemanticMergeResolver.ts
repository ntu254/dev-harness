import * as fs from 'node:fs';
import * as path from 'node:path';

export interface MergeChange {
  relativePath: string;
  workerId: string;
  content: string;
}

export interface MergeResult {
  success: boolean;
  mergedFiles: string[];
  conflicts: Array<{
    relativePath: string;
    conflictingWorkers: string[];
    reason: string;
  }>;
}

export class SemanticMergeResolver {
  public static resolveAndApply(
    targetWorkspaceRoot: string,
    workerChanges: Map<string, Array<{ relativePath: string; content: string }>>
  ): MergeResult {
    const fileModifications: Map<string, Array<{ workerId: string; content: string }>> = new Map();

    // Group modifications by file
    for (const [workerId, changes] of workerChanges.entries()) {
      for (const change of changes) {
        if (!fileModifications.has(change.relativePath)) {
          fileModifications.set(change.relativePath, []);
        }
        fileModifications.get(change.relativePath)!.push({ workerId, content: change.content });
      }
    }

    const mergedFiles: string[] = [];
    const conflicts: Array<{ relativePath: string; conflictingWorkers: string[]; reason: string }> = [];

    for (const [relPath, mods] of fileModifications.entries()) {
      const fullTargetPath = path.join(targetWorkspaceRoot, relPath);

      if (mods.length === 1) {
        // Single worker modified this file -> Clean merge
        const dir = path.dirname(fullTargetPath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(fullTargetPath, mods[0].content, 'utf8');
        mergedFiles.push(relPath);
      } else {
        // Multiple workers modified the same file -> Check for AST or content equality
        const firstContent = mods[0].content;
        const allIdentical = mods.every(m => m.content === firstContent);

        if (allIdentical) {
          const dir = path.dirname(fullTargetPath);
          if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
          fs.writeFileSync(fullTargetPath, firstContent, 'utf8');
          mergedFiles.push(relPath);
        } else {
          // If both workers added non-overlapping exports, perform naive concatenation or flag conflict
          conflicts.push({
            relativePath: relPath,
            conflictingWorkers: mods.map(m => m.workerId),
            reason: `Conflicting changes in file '${relPath}' across workers ${mods.map(m => m.workerId).join(', ')}`,
          });
        }
      }
    }

    return {
      success: conflicts.length === 0,
      mergedFiles,
      conflicts,
    };
  }
}
