import type { AgentAdapter } from '@dev-harness/spec';
import { TaskComplexityClassifier } from '../classifier/TaskComplexityClassifier.js';
import { CostBudgetOptimizer } from '../optimizer/CostBudgetOptimizer.js';
import type { ModelTier, RoutingDecision } from './types.js';
import {
  ClaudeCodeAdapter,
  CursorAiderAdapter,
  OllamaLocalAdapter,
  DeepSeekReasoningAdapter,
} from '@dev-harness/adapters';

export interface ModelRouterOptions {
  tierAdapters?: Partial<Record<ModelTier, AgentAdapter>>;
}

export class ModelRouter {
  private readonly tierAdapters: Record<ModelTier, AgentAdapter>;
  public readonly optimizer: CostBudgetOptimizer;

  constructor(options: ModelRouterOptions = {}) {
    this.optimizer = new CostBudgetOptimizer();

    this.tierAdapters = {
      TIER_FAST_CHEAP: options.tierAdapters?.TIER_FAST_CHEAP || new OllamaLocalAdapter(),
      TIER_STANDARD: options.tierAdapters?.TIER_STANDARD || new CursorAiderAdapter(),
      TIER_DEEP_REASONING: options.tierAdapters?.TIER_DEEP_REASONING || new DeepSeekReasoningAdapter(),
    };
  }

  public route(runId: string, intent: string, fileCount: number = 1): RoutingDecision {
    const classification = TaskComplexityClassifier.classify(intent, fileCount);
    const selectedTier = classification.tier;
    const adapter = this.tierAdapters[selectedTier] || new ClaudeCodeAdapter();

    const estimatedTokens = selectedTier === 'TIER_DEEP_REASONING' ? 3500 : selectedTier === 'TIER_STANDARD' ? 1500 : 800;
    const usage = this.optimizer.recordUsage(selectedTier, estimatedTokens);

    return {
      runId,
      selectedTier,
      selectedAdapterId: adapter.id,
      adapter,
      reason: classification.reason,
      estimatedCostUsd: usage.costUsd,
    };
  }

  public getAdapterForTier(tier: ModelTier): AgentAdapter {
    return this.tierAdapters[tier];
  }
}
