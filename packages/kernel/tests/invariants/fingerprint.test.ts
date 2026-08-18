import { describe, it, expect } from 'vitest';
import { Hasher } from '../../src/domain/fingerprint/Hasher.js';
import { canonicalizeJson } from '../../src/domain/fingerprint/canonicalize.js';

describe('Invariant Tests: Canonical Fingerprinting (Gates 7, 8)', () => {
  it('Gate 7: Canonical JSON is deterministic regardless of key ordering', () => {
    const objA = {
      b: 2,
      a: 1,
      nested: { y: 'world', x: 'hello' },
      list: [1, 2, 3],
    };

    const objB = {
      nested: { x: 'hello', y: 'world' },
      list: [1, 2, 3],
      a: 1,
      b: 2,
    };

    const canonicalA = canonicalizeJson(objA);
    const canonicalB = canonicalizeJson(objB);

    expect(canonicalA).toBe(canonicalB);
    expect(canonicalA).toBe('{"a":1,"b":2,"list":[1,2,3],"nested":{"x":"hello","y":"world"}}');

    const hashA = Hasher.hashCanonical(objA);
    const hashB = Hasher.hashCanonical(objB);

    expect(hashA).toBe(hashB);
    expect(hashA).toHaveLength(64); // SHA-256 hex string
  });

  it('Gate 8: Any byte mutation changes the resulting canonical hash completely', () => {
    const original = {
      runId: 'RUN-001',
      intent: 'Implement JWT Auth',
      acceptanceCriteria: ['Login returns 200', 'Refresh rotates token'],
    };

    const mutated = {
      runId: 'RUN-001',
      intent: 'Implement JWT Auth',
      acceptanceCriteria: ['Login returns 200', 'Refresh rotates token.'], // Extra dot
    };

    const hashOriginal = Hasher.hashCanonical(original);
    const hashMutated = Hasher.hashCanonical(mutated);

    expect(hashOriginal).not.toBe(hashMutated);
  });

  it('Gate 7 & 8: Git Tree hash is deterministic and sensitive to file order and content hashes', () => {
    const treeA = [
      { mode: '100644', type: 'blob', hash: 'abc1234', path: 'src/index.ts' },
      { mode: '100644', type: 'blob', hash: 'def5678', path: 'package.json' },
    ];

    const treeB = [
      { mode: '100644', type: 'blob', hash: 'def5678', path: 'package.json' },
      { mode: '100644', type: 'blob', hash: 'abc1234', path: 'src/index.ts' },
    ];

    const hashTreeA = Hasher.hashGitTree(treeA);
    const hashTreeB = Hasher.hashGitTree(treeB);

    // Identical despite array insertion order
    expect(hashTreeA).toBe(hashTreeB);

    // Mutated hash in entry changes tree hash
    const treeMutated = [
      { mode: '100644', type: 'blob', hash: 'abc9999', path: 'src/index.ts' },
      { mode: '100644', type: 'blob', hash: 'def5678', path: 'package.json' },
    ];
    expect(Hasher.hashGitTree(treeMutated)).not.toBe(hashTreeA);
  });
});
