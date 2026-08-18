import { describe, it, expect } from 'vitest';
import { SecretBroker } from '../src/SecretBroker.js';
import { NetworkPolicyEvaluator } from '../src/NetworkPolicyEvaluator.js';
import type { SecretRef } from '@dev-harness/spec';

describe('Phase 3 Security: Secret Broker & Network Policy (Gate 4)', () => {
  it('Gate 4: SecretBroker only resolves secrets when target scope matches allowed scopes', () => {
    const broker = new SecretBroker();
    broker.registerSecret('npm-token', 'npm_secret_xyz123', ['registry.npmjs.org']);

    const ref: SecretRef = {
      id: 'npm-token',
      envVarName: 'NPM_TOKEN',
      scope: ['registry.npmjs.org'],
    };

    // Allowed scope
    const resolved = broker.resolveSecret(ref, 'registry.npmjs.org');
    expect(resolved).toBe('npm_secret_xyz123');

    // Denied scope (mismatch)
    const denied = broker.resolveSecret(ref, 'api.untrusted.com');
    expect(denied).toBeNull();
  });

  it('Gate 4: NetworkPolicyEvaluator evaluates host allowlists strictly', () => {
    const evaluator = new NetworkPolicyEvaluator(['registry.npmjs.org', '*.github.com'], 'deny');

    expect(evaluator.isEgressAllowed('registry.npmjs.org')).toBe(true);
    expect(evaluator.isEgressAllowed('api.github.com')).toBe(true);
    expect(evaluator.isEgressAllowed('raw.github.com')).toBe(true);
    expect(evaluator.isEgressAllowed('malicious-site.com')).toBe(false);
  });
});
