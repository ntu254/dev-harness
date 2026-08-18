import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { ContextEngine } from '../src/context/ContextEngine.js';

describe('Phase 2 Infrastructure: Context Engine & Provenance (Gates 5, 6, 7)', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'harness-context-test-'));

    // Create ADR Directory
    const adrDir = path.join(tempDir, '.harness', 'knowledge', 'decisions');
    fs.mkdirSync(adrDir, { recursive: true });
    fs.writeFileSync(
      path.join(adrDir, 'ADR-001-postgresql.md'),
      '# ADR-001: Use PostgreSQL for Orders\n\n**Status:** Accepted\n\nWe choose PostgreSQL.'
    );

    // Create Failure Directory
    const failureDir = path.join(tempDir, '.harness', 'knowledge', 'failures');
    fs.mkdirSync(failureDir, { recursive: true });
    fs.writeFileSync(
      path.join(failureDir, 'FAIL-001.json'),
      JSON.stringify({
        id: 'FAIL-001',
        timestamp: '2026-08-18T20:00:00Z',
        task: 'auth token race condition',
        evidenceStrength: 'high',
        verifiedAt: '2026-08-18T20:00:00Z',
        supersededBy: null,
        evidence: { runId: 'RUN-01', failingTests: [], observedSymptom: '401' },
        scope: { framework: 'express', domain: 'auth' },
        failedHypothesis: 'In-memory refresh token array',
        rootCause: 'Race condition on multi-pod cluster',
        lesson: 'Use atomic Redis token rotation',
        doNotRepeatWhen: ['multi_pod_token_rotation'],
      })
    );

    // Create source files
    fs.mkdirSync(path.join(tempDir, 'src'), { recursive: true });
    fs.writeFileSync(path.join(tempDir, 'src', 'auth.ts'), 'export function login() { return true; }');
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('Gates 5 & 6: Assembles ContextBundle with 100% Provenance tracking', () => {
    const engine = new ContextEngine(tempDir);
    const bundle = engine.assemble({
      runId: 'RUN-100',
      projectId: 'proj-ecommerce',
      relevantFilePaths: ['src/auth.ts'],
      scopeQuery: { framework: 'express', domain: 'auth' },
      maxTokens: 50000,
    });

    expect(bundle.runId).toBe('RUN-100');
    expect(bundle.decisions.length).toBe(1);
    expect(bundle.decisions[0].id).toBe('ADR-001');

    expect(bundle.failures.length).toBe(1);
    expect(bundle.failures[0].id).toBe('FAIL-001');

    expect(bundle.files.length).toBe(1);
    expect(bundle.files[0].path).toBe('src/auth.ts');
    expect(bundle.files[0].hash).toHaveLength(64);

    // Provenance verification: Every single item has provenance
    expect(bundle.provenance.length).toBe(3); // 1 ADR + 1 Failure + 1 File
    const sources = bundle.provenance.map(p => p.sourceId);
    expect(sources).toContain('ADR-001');
    expect(sources).toContain('FAIL-001');
    expect(sources).toContain('file:src/auth.ts');

    for (const prov of bundle.provenance) {
      expect(prov.extractedAt).toBeDefined();
      expect(prov.sourceType).toBeDefined();
    }
  });

  it('Gate 7: Strictly enforces maxTokens budget and omits files that would overflow budget', () => {
    // Write a huge file (~20,000 characters => ~5,000 tokens)
    const largeContent = 'a'.repeat(20000);
    fs.writeFileSync(path.join(tempDir, 'src', 'large.ts'), largeContent);

    const engine = new ContextEngine(tempDir);
    const tightBundle = engine.assemble({
      runId: 'RUN-200',
      projectId: 'proj-ecommerce',
      relevantFilePaths: ['src/large.ts'],
      maxTokens: 500, // Budget is far too small for 5,000 token file
    });

    // The large file is omitted because it would exceed budget
    expect(tightBundle.files.length).toBe(0);
    expect(tightBundle.budget.allocatedTokens).toBeLessThanOrEqual(500);
  });
});
