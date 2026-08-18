import type { ModelTier } from '../router/types.js';

export interface TierCostRate {
  costPer1kTokensUsd: number;
}

export class CostBudgetOptimizer {
  private static readonly TIER_RATES: Record<ModelTier, TierCostRate> = {
    TIER_FAST_CHEAP: { costPer1kTokensUsd: 0.001 },      // e.g. Haiku / Local Ollama (0.00) / DeepSeek-V3
    TIER_STANDARD: { costPer1kTokensUsd: 0.015 },        // e.g. Claude 3.5 Sonnet / GPT-4o
    TIER_DEEP_REASONING: { costPer1kTokensUsd: 0.060 },  // e.g. Claude 3.7 Sonnet Thinking / o3-mini
  };

  private totalSpentUsd: number = 0;
  private totalTokensRouted: number = 0;
  private baselineCostUsd: number = 0; // If 100% was routed to TIER_DEEP_REASONING

  public recordUsage(tier: ModelTier, totalTokens: number): { costUsd: number; savingsUsd: number } {
    const rate = CostBudgetOptimizer.TIER_RATES[tier].costPer1kTokensUsd;
    const costUsd = (totalTokens / 1000) * rate;
    const baselineCost = (totalTokens / 1000) * CostBudgetOptimizer.TIER_RATES.TIER_DEEP_REASONING.costPer1kTokensUsd;

    this.totalSpentUsd += costUsd;
    this.totalTokensRouted += totalTokens;
    this.baselineCostUsd += baselineCost;

    return {
      costUsd,
      savingsUsd: baselineCost - costUsd,
    };
  }

  public getSummary(): {
    totalSpentUsd: number;
    baselineCostUsd: number;
    savedUsd: number;
    savingsPercent: number;
  } {
    const savedUsd = this.baselineCostUsd - this.totalSpentUsd;
    const savingsPercent = this.baselineCostUsd > 0 ? (savedUsd / this.baselineCostUsd) * 100 : 0;

    return {
      totalSpentUsd: Math.round(this.totalSpentUsd * 1000) / 1000,
      baselineCostUsd: Math.round(this.baselineCostUsd * 1000) / 1000,
      savedUsd: Math.round(savedUsd * 1000) / 1000,
      savingsPercent: Math.round(savingsPercent * 10) / 10,
    };
  }
}
