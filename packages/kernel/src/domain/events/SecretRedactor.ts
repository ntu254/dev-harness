export class SecretRedactor {
  private knownSecrets: Set<string> = new Set();
  private secretPatterns: RegExp[] = [
    /Bearer\s+[A-Za-z0-9\-_=]+\.[A-Za-z0-9\-_=]+\.?[A-Za-z0-9\-_.+/=]*/gi, // JWT
    /sk-[a-zA-Z0-9]{20,}/gi, // Generic API key sk-...
    /sk-ant-[a-zA-Z0-9\-_]{20,}/gi, // Anthropic API key
    /ghp_[a-zA-Z0-9]{20,}/gi, // GitHub token
    /-----BEGIN [A-Z ]+ PRIVATE KEY-----[\s\S]*?-----END [A-Z ]+ PRIVATE KEY-----/gi, // Private Key
  ];

  public registerSecret(secret: string): void {
    if (secret && secret.length >= 4) {
      this.knownSecrets.add(secret);
    }
  }

  public registerSecrets(secrets: string[]): void {
    for (const secret of secrets) {
      this.registerSecret(secret);
    }
  }

  public redactString(input: string): string {
    let result = input;

    // 1. Redact known exact secrets
    for (const secret of this.knownSecrets) {
      result = result.split(secret).join('[REDACTED_SECRET]');
    }

    // 2. Redact regex patterns
    for (const pattern of this.secretPatterns) {
      result = result.replace(pattern, '[REDACTED_SECRET]');
    }

    return result;
  }

  public redact<T>(input: T): T {
    if (input === null || input === undefined) {
      return input;
    }

    if (typeof input === 'string') {
      return this.redactString(input) as unknown as T;
    }

    if (Array.isArray(input)) {
      return input.map(item => this.redact(item)) as unknown as T;
    }

    if (typeof input === 'object') {
      const result: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
        // Redact values under sensitive keys
        if (/password|secret|token|authorization|apikey|api_key/i.test(key) && typeof value === 'string') {
          result[key] = '[REDACTED_SECRET]';
        } else {
          result[key] = this.redact(value);
        }
      }
      return result as unknown as T;
    }

    return input;
  }
}
