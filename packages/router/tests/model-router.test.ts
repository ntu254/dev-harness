import { describe, it, expect } from 'vitest';
import { TaskComplexityClassifier } from '../src/classifier/TaskComplexityClassifier.js';
import { CostBudgetOptimizer } from '../src/optimizer/CostBudgetOptimizer.js';
import { ModelRouter } from '../src/router/ModelRouter.js';
import { OllamaLocalAdapter } from '@dev-harness/adapters';

describe('v2.0 Router: Task Complexity Classifier, Cost Optimizer & Model Routing', () => {
  it('Gate 1: Accurately classifies task complexity tiers', () => {
    // 1. Fast & Cheap tier
    const cheap = TaskComplexityClassifier.classify('Fix typo in documentation README.md', 1);
    expect(cheap.tier).toBe('TIER_FAST_CHEAP');
    expect(cheap.reason).toContain('simple documentation');

    // 2. Standard coding tier
    const std = TaskComplexityClassifier.classify('Add user profile page and endpoint', 2);
    expect(std.tier).toBe('TIER_STANDARD');

    // 3. Deep Reasoning tier
    const deep = TaskComplexityClassifier.classify('Fix deadlock and race condition in concurrent checkout transactions', 3);
    expect(deep.tier).toBe('TIER_DEEP_REASONING');
    expect(deep.reason).toContain('deadlock');
  });

  it('Gate 2: ModelRouter routes tasks to appropriate adapters dynamically', () => {
    const router = new ModelRouter();

    const decisionCheap = router.route('RUN-101', 'Update package.json and fix typo in comments');
    expect(decisionCheap.selectedTier).toBe('TIER_FAST_CHEAP');
    expect(decisionCheap.adapter.id).toBe('ollama-local');

    const decisionDeep = router.route('RUN-102', 'Resolve distributed memory leak and deadlock');
    expect(decisionDeep.selectedTier).toBe('TIER_DEEP_REASONING');
    expect(decisionDeep.adapter.id).toBe('deepseek-reasoning');
  });

  it('Gate 3: OllamaLocalAdapter runs local offline execution with zero API cost', async () => {
    const ollama = new OllamaLocalAdapter('qwen2.5-coder:14b');
    const sid = await ollama.createSession({
      sessionId: 'ses-ollama-1',
      projectId: 'local-proj',
      features: ollama.features(),
    });

    const usage = await ollama.collectUsage('run-1');
    expect(usage.estimatedCostUsd).toBe(0.0);
    await ollama.endSession(sid);
  });

  it('Gate 4: CostBudgetOptimizer calculates significant savings over 100% frontier routing', () => {
    const optimizer = new CostBudgetOptimizer();

    // 5 simple tasks routed to cheap tier (800 tokens each)
    for (let i = 0; i < 5; i++) {
      optimizer.recordUsage('TIER_FAST_CHEAP', 800);
    }

    // 3 standard tasks (1500 tokens each)
    for (let i = 0; i < 3; i++) {
      optimizer.recordUsage('TIER_STANDARD', 1500);
    }

    // 1 deep reasoning task (3500 tokens)
    optimizer.recordUsage('TIER_DEEP_REASONING', 3500);

    const summary = optimizer.getSummary();
    expect(summary.totalSpentUsd).toBeLessThan(summary.baselineCostUsd);
    expect(summary.savingsPercent).toBeGreaterThan(50); // Saved >50% token cost!
  });
});
