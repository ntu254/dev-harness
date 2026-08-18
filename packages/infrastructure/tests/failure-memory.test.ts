import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { FailureMemoryLoader } from '../src/knowledge/FailureMemoryLoader.js';
import type { FailureEvidence } from '@dev-harness/spec';

describe('Phase 2 Infrastructure: Failure Memory Loader (Gate 8)', () => {
  let tempDir: string;
  let failuresDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'harness-failure-test-'));
    failuresDir = path.join(tempDir, '.harness', 'knowledge', 'failures');
    fs.mkdirSync(failuresDir, { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('Gate 8: Loads and validates failure memory JSON records', () => {
    const fail1: FailureEvidence = {
      id: 'FAIL-001',
      timestamp: '2026-08-18T20:00:00Z',
      task: 'checkout deadlock',
      evidenceStrength: 'high',
      verifiedAt: '2026-08-18T20:00:00Z',
      supersededBy: null,
      evidence: { runId: 'RUN-01', failingTests: ['test_deadlock.py'], observedSymptom: 'Deadlock' },
      scope: { framework: 'fastapi', database: 'postgresql', domain: 'checkout' },
      failedHypothesis: 'Retries with exponential backoff',
      rootCause: 'Connection starvation',
      lesson: 'Use redis distributed locks instead of retry loop',
      doNotRepeatWhen: ['concurrent_checkout'],
    };

    fs.writeFileSync(path.join(failuresDir, 'FAIL-001.json'), JSON.stringify(fail1, null, 2));

    const loader = new FailureMemoryLoader(tempDir);
    const all = loader.loadAllFailures();
    expect(all.length).toBe(1);
    expect(all[0].id).toBe('FAIL-001');
  });

  it('Gate 8: Excludes superseded failures and sorts by confidence strength', () => {
    const failActiveHigh: FailureEvidence = {
      id: 'FAIL-001',
      timestamp: '2026-08-18T20:00:00Z',
      task: 'checkout deadlock',
      evidenceStrength: 'high',
      verifiedAt: '2026-08-18T20:00:00Z',
      supersededBy: null,
      evidence: { runId: 'RUN-01', failingTests: [], observedSymptom: '500' },
      scope: { framework: 'fastapi', database: 'postgresql', domain: 'checkout' },
      failedHypothesis: 'A',
      rootCause: 'A',
      lesson: 'Lesson 1',
      doNotRepeatWhen: [],
    };

    const failActiveMedium: FailureEvidence = {
      id: 'FAIL-002',
      timestamp: '2026-08-18T20:00:00Z',
      task: 'checkout latency',
      evidenceStrength: 'medium',
      verifiedAt: '2026-08-18T20:00:00Z',
      supersededBy: null,
      evidence: { runId: 'RUN-02', failingTests: [], observedSymptom: 'Slow' },
      scope: { framework: 'fastapi', database: 'postgresql', domain: 'checkout' },
      failedHypothesis: 'B',
      rootCause: 'B',
      lesson: 'Lesson 2',
      doNotRepeatWhen: [],
    };

    const failSuperseded: FailureEvidence = {
      id: 'FAIL-003',
      timestamp: '2026-08-18T20:00:00Z',
      task: 'checkout old lock',
      evidenceStrength: 'high',
      verifiedAt: '2026-08-18T20:00:00Z',
      supersededBy: 'ADR-008', // Superseded
      evidence: { runId: 'RUN-03', failingTests: [], observedSymptom: 'Old' },
      scope: { framework: 'fastapi', database: 'postgresql', domain: 'checkout' },
      failedHypothesis: 'C',
      rootCause: 'C',
      lesson: 'Lesson 3',
      doNotRepeatWhen: [],
    };

    fs.writeFileSync(path.join(failuresDir, 'FAIL-001.json'), JSON.stringify(failActiveHigh));
    fs.writeFileSync(path.join(failuresDir, 'FAIL-002.json'), JSON.stringify(failActiveMedium));
    fs.writeFileSync(path.join(failuresDir, 'FAIL-003.json'), JSON.stringify(failSuperseded));

    const loader = new FailureMemoryLoader(tempDir);
    const { failures, provenance } = loader.query({ framework: 'fastapi', domain: 'checkout' });

    expect(failures.length).toBe(2);
    // Excluded superseded FAIL-003
    expect(failures.map(f => f.id)).not.toContain('FAIL-003');
    // Sorted by confidence: FAIL-001 (high) before FAIL-002 (medium)
    expect(failures[0].id).toBe('FAIL-001');
    expect(failures[1].id).toBe('FAIL-002');

    // Provenance attached
    expect(provenance.length).toBe(2);
    expect(provenance[0].sourceId).toBe('FAIL-001');
    expect(provenance[0].sourceType).toBe('failure_evidence');
  });
});
