import type { SecretRef } from '@dev-harness/spec';

export interface StoredSecret {
  id: string;
  rawValue: string;
  allowedScopes: string[]; // e.g. ["registry.npmjs.org", "api.github.com"]
}

export class SecretBroker {
  private secrets: Map<string, StoredSecret> = new Map();

  public registerSecret(id: string, rawValue: string, allowedScopes: string[]): void {
    this.secrets.set(id, {
      id,
      rawValue,
      allowedScopes,
    });
  }

  /**
   * Resolves a SecretRef into raw value ONLY IF the target destination scope matches allowedScopes.
   */
  public resolveSecret(ref: SecretRef, targetScope: string): string | null {
    const stored = this.secrets.get(ref.id);
    if (!stored) {
      return null;
    }

    const isScopeAllowed = stored.allowedScopes.some(
      s => s.toLowerCase() === targetScope.toLowerCase() || s === '*'
    );

    if (!isScopeAllowed) {
      return null; // Deny access: scope mismatch
    }

    return stored.rawValue;
  }

  public hasSecret(id: string): boolean {
    return this.secrets.has(id);
  }
}
