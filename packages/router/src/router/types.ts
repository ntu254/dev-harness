import type { AgentAdapter } from '@dev-harness/spec';

export type ModelTier = 'TIER_FAST_CHEAP' | 'TIER_STANDARD' | 'TIER_DEEP_REASONING';

export interface ModelTierConfig {
  tier: ModelTier;
  targetAdapterId: string;
  maxTokenBudget: number;
  costPer1kTokensUsd: number;
  description: string;
}

export interface RoutingDecision {
  runId: string;
  selectedTier: ModelTier;
  selectedAdapterId: string;
  adapter: AgentAdapter;
  reason: string;
  estimatedCostUsd: number;
}
