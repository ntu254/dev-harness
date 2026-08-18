import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { GitWorkspace } from '../src/git/GitWorkspace.js';
import { Hasher } from '@dev-harness/kernel';

describe('Phase 2 Infrastructure: Shadow Git Workspace (Gate 1)', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'harness-git-test-'));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('Gate 1: Computes deterministic workspaceFingerprint for file tree', () => {
    fs.writeFileSync(path.join(tempDir, 'package.json'), '{"name":"test-app"}');
    fs.mkdirSync(path.join(tempDir, 'src'), { recursive: true });
    fs.writeFileSync(path.join(tempDir, 'src', 'index.ts'), 'export const a = 1;');

    const gitWorkspace = new GitWorkspace(tempDir);
    const fingerprint1 = gitWorkspace.getTreeFingerprint();
    const fingerprint2 = gitWorkspace.getTreeFingerprint();

    expect(fingerprint1).toHaveLength(64);
    expect(fingerprint1).toBe(fingerprint2);

    // Modifying a file changes fingerprint
    fs.writeFileSync(path.join(tempDir, 'src', 'index.ts'), 'export const a = 2;');
    const fingerprint3 = gitWorkspace.getTreeFingerprint();
    expect(fingerprint3).not.toBe(fingerprint1);
  });

  it('Gate 1: Creates and retrieves checkpoint snapshots correctly', () => {
    fs.writeFileSync(path.join(tempDir, 'app.js'), 'console.log("v1");');
    const gitWorkspace = new GitWorkspace(tempDir);

    const cp = gitWorkspace.createCheckpoint('CP-001', 'Initial commit');
    expect(cp.checkpointId).toBe('CP-001');
    expect(cp.treeFingerprint).toHaveLength(64);

    const loaded = gitWorkspace.getCheckpoint('CP-001');
    expect(loaded?.checkpointId).toBe('CP-001');
    expect(loaded?.treeFingerprint).toBe(cp.treeFingerprint);
  });
});
