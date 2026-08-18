export class TokenBudgeter {
  /**
   * Fast rule-of-thumb token estimation (~4 characters per token).
   */
  public static estimateTokens(text: string): number {
    if (!text) return 0;
    return Math.ceil(text.length / 4);
  }

  public static estimateObjectTokens(obj: unknown): number {
    const json = JSON.stringify(obj);
    return this.estimateTokens(json);
  }
}
