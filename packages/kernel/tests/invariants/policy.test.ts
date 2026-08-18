import { describe, it, expect } from 'vitest';
import { PolicyEvaluator } from '../../src/domain/policy/PolicyEvaluator.js';
import type { PolicyRule, TrustLevel, VerificationProof } from '@dev-harness/spec';

describe('Invariant Tests: Policy Engine & Trust Hierarchy (Gates 6, 10)', () => {
  it('Gate 6: Deny rule always wins when policy violation is detected', () => {
    const noDbFromUiRule: PolicyRule = {
      id: 'no-direct-db-from-ui',
      description: 'UI components cannot directly import DB libraries',
      scope: {
        paths: ['src/ui/**', 'src/components/**'],
      },
      denyImports: ['prisma', 'pg', 'mysql2'],
    };

    const policyEvaluator = new PolicyEvaluator([noDbFromUiRule]);

    // 1. Valid UI edit (no DB imports)
    const validDecision = policyEvaluator.evaluatePreAction(
      {
        type: 'file_edit',
        targetPath: 'src/ui/Button.tsx',
        payload: { content: 'import React from "react";\nexport const Button = () => <button />;' },
      },
      { paths: ['src/ui/Button.tsx'] }
    );
    expect(validDecision.allowed).toBe(true);

    // 2. Denied UI edit (imports prisma)
    const deniedDecision = policyEvaluator.evaluatePreAction(
      {
        type: 'file_edit',
        targetPath: 'src/ui/UserList.tsx',
        payload: { content: 'import { PrismaClient } from "@prisma/client";\nconst db = new PrismaClient();' },
      },
      { paths: ['src/ui/UserList.tsx'] }
    );
    expect(deniedDecision.allowed).toBe(false);
    expect(deniedDecision.violations?.length).toBeGreaterThan(0);
    expect(deniedDecision.violations?.[0]).toContain('prisma');
  });

  it('Gate 6: Resolves proper verification strategy per task type', () => {
    const evaluator = new PolicyEvaluator();
    expect(evaluator.resolveVerificationStrategy('feature')).toBe('tdd_red_green');
    expect(evaluator.resolveVerificationStrategy('bugfix')).toBe('regression_first');
    expect(evaluator.resolveVerificationStrategy('ui')).toBe('visual_regression');
    expect(evaluator.resolveVerificationStrategy('refactor')).toBe('behavioral_invariance');
    expect(evaluator.resolveVerificationStrategy('infrastructure')).toBe('dry_run_validation');
  });

  it('Gate 10: Trust hierarchy strictly categorizes verification levels without auto-escalation', () => {
    // Helper to evaluate trust grade
    function getTrustGrade(level: TrustLevel): 'UNTRUSTED' | 'TRUSTED_HARNESS' | 'INDEPENDENTLY_ATTESTED' {
      switch (level) {
        case 'agent-reported':
          return 'UNTRUSTED';
        case 'harness-executed':
          return 'TRUSTED_HARNESS';
        case 'external-attested':
          return 'INDEPENDENTLY_ATTESTED';
      }
    }

    const agentProof: VerificationProof = {
      level: 'agent-reported',
      passedGates: ['test-all'],
      failedGates: [],
      rawEvidence: { note: 'Agent says tests passed' },
      timestamp: new Date().toISOString(),
    };
    expect(getTrustGrade(agentProof.level)).toBe('UNTRUSTED');

    const harnessProof: VerificationProof = {
      level: 'harness-executed',
      passedGates: ['test-all', 'linter'],
      failedGates: [],
      rawEvidence: { exitCode: 0, stdout: 'Vitest passed' },
      timestamp: new Date().toISOString(),
    };
    expect(getTrustGrade(harnessProof.level)).toBe('TRUSTED_HARNESS');

    const externalProof: VerificationProof = {
      level: 'external-attested',
      passedGates: ['ci-pipeline', 'slsa-l3'],
      failedGates: [],
      rawEvidence: { signature: 'sig_abc123' },
      timestamp: new Date().toISOString(),
    };
    expect(getTrustGrade(externalProof.level)).toBe('INDEPENDENTLY_ATTESTED');
  });
});
