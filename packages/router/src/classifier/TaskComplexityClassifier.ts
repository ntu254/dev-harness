import type { ModelTier } from '../router/types.js';

export class TaskComplexityClassifier {
  private static readonly DEEP_REASONING_KEYWORDS = [
    'concurrency',
    'deadlock',
    'race condition',
    'distributed',
    'memory leak',
    'crypto',
    'security vulnerability',
    'atomic',
    'mutex',
    'advisory lock',
    'performance bottleneck',
    'state machine',
    'compiler',
    'ast parser',
  ];

  private static readonly FAST_CHEAP_KEYWORDS = [
    'typo',
    'formatting',
    'boilerplate',
    'readme',
    'docs',
    'documentation',
    'rename',
    'lint',
    'comment',
    'package.json',
    'export',
  ];

  public static classify(intent: string, fileCount: number = 1): { tier: ModelTier; reason: string } {
    const lower = intent.toLowerCase();

    // 1. Check for deep reasoning keywords
    for (const kw of this.DEEP_REASONING_KEYWORDS) {
      if (lower.includes(kw)) {
        return {
          tier: 'TIER_DEEP_REASONING',
          reason: `Task involves critical keyword '${kw}', requiring deep reasoning and invariant verification`,
        };
      }
    }

    // 2. Check for simple fast/cheap keywords
    if (fileCount <= 1) {
      for (const kw of this.FAST_CHEAP_KEYWORDS) {
        if (lower.includes(kw)) {
          return {
            tier: 'TIER_FAST_CHEAP',
            reason: `Task is simple documentation or mechanical change ('${kw}'), suitable for fast & cost-efficient model`,
          };
        }
      }
    }

    // 3. Multi-file complex task
    if (fileCount > 5) {
      return {
        tier: 'TIER_DEEP_REASONING',
        reason: `Large cross-cutting change spanning ${fileCount} files, requiring deep reasoning tier`,
      };
    }

    // 4. Default standard coding tier
    return {
      tier: 'TIER_STANDARD',
      reason: 'Standard software engineering task with normal verification requirements',
    };
  }
}
