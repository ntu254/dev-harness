export class NetworkPolicyEvaluator {
  private readonly defaultAction: 'allow' | 'deny';
  private readonly allowlist: string[];

  constructor(allowlist: string[] = [], defaultAction: 'allow' | 'deny' = 'deny') {
    this.allowlist = allowlist.map(h => h.toLowerCase());
    this.defaultAction = defaultAction;
  }

  public isEgressAllowed(targetHost: string): boolean {
    const hostLower = targetHost.toLowerCase();
    
    // Check allowlist
    const matched = this.allowlist.some(allowed => {
      if (allowed === '*' || allowed === hostLower) return true;
      if (allowed.startsWith('*.') && hostLower.endsWith(allowed.slice(2))) return true;
      return false;
    });

    if (matched) {
      return true;
    }

    return this.defaultAction === 'allow';
  }
}
