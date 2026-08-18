import { createHash } from 'node:crypto';
import { canonicalizeJson } from './canonicalize.js';

export class Hasher {
  public static sha256(data: string): string {
    return createHash('sha256').update(data, 'utf8').digest('hex');
  }

  public static hashCanonical(obj: unknown): string {
    const canonicalString = canonicalizeJson(obj);
    return this.sha256(canonicalString);
  }

  public static hashGitTree(treeEntries: Array<{ mode: string; type: string; hash: string; path: string }>): string {
    // Sort entries by path for deterministic tree hash
    const sorted = [...treeEntries].sort((a, b) => a.path.localeCompare(b.path));
    const canonicalTreeString = sorted.map(e => `${e.mode} ${e.type} ${e.hash}\t${e.path}`).join('\n');
    return this.sha256(canonicalTreeString);
  }
}
