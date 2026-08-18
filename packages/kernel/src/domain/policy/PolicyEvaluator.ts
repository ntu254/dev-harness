import type {
  AgentAction,
  ActionObservation,
  PolicyDecision,
  PolicyEngine,
  PolicyRule,
  PolicyScope,
  VerificationStrategy,
} from '@dev-harness/spec';

export class PolicyEvaluator implements PolicyEngine {
  private rules: PolicyRule[] = [];

  constructor(rules: PolicyRule[] = []) {
    this.rules = rules;
  }

  public addRule(rule: PolicyRule): void {
    this.rules.push(rule);
  }

  /**
   * Matches a path against glob patterns (simple wildcard * and ** support).
   */
  private matchPath(pattern: string, targetPath: string): boolean {
    const normalizedTarget = targetPath.replace(/\\/g, '/');
    const regexPattern = pattern
      .replace(/\\/g, '/')
      .replace(/\*\*/g, '.*')
      .replace(/(?<!\.)\*/g, '[^/]*');
    return new RegExp(`^${regexPattern}$`).test(normalizedTarget);
  }

  private isScopeMatching(ruleScope: PolicyScope, targetScope: PolicyScope): boolean {
    // 1. Match task types
    if (ruleScope.taskTypes && targetScope.taskTypes) {
      const hasMatchingTask = ruleScope.taskTypes.some(t => targetScope.taskTypes?.includes(t));
      if (!hasMatchingTask) return false;
    }

    // 2. Match environments
    if (ruleScope.environments && targetScope.environments) {
      const hasMatchingEnv = ruleScope.environments.some(e => targetScope.environments?.includes(e));
      if (!hasMatchingEnv) return false;
    }

    // 3. Match agent IDs
    if (ruleScope.agentIds && targetScope.agentIds) {
      const hasMatchingAgent = ruleScope.agentIds.some(a => targetScope.agentIds?.includes(a));
      if (!hasMatchingAgent) return false;
    }

    return true;
  }

  public evaluatePreAction(action: AgentAction, scope: PolicyScope): PolicyDecision {
    const violations: string[] = [];

    for (const rule of this.rules) {
      if (!this.isScopeMatching(rule.scope, scope)) {
        continue;
      }

      // Check path restrictions if action targets a path
      if (action.targetPath && rule.scope.paths) {
        const isPathInScope = rule.scope.paths.some(p => this.matchPath(p, action.targetPath!));
        if (isPathInScope) {
          // Check denied imports in file_edit / file_create
          if (rule.denyImports && action.payload && typeof action.payload === 'object') {
            const content = (action.payload as { content?: string }).content || '';
            for (const deniedImport of rule.denyImports) {
              const importRegex = new RegExp(`(import|require|from)\\s+['"].*${deniedImport}.*['"]`, 'i');
              if (importRegex.test(content)) {
                violations.push(`Denied import '${deniedImport}' detected in scoped path '${action.targetPath}' by rule '${rule.id}'`);
              }
            }
          }
        }
      }
    }

    // Invariant: Deny always wins
    if (violations.length > 0) {
      return {
        allowed: false,
        reason: 'Policy violations detected (Deny Precedence)',
        violations,
      };
    }

    return {
      allowed: true,
    };
  }

  public evaluatePostAction(observation: ActionObservation, _scope: PolicyScope): PolicyDecision {
    if (!observation.success) {
      return {
        allowed: false,
        reason: observation.error || 'Action execution failed',
      };
    }
    return { allowed: true };
  }

  public resolveVerificationStrategy(taskType: string): VerificationStrategy {
    switch (taskType.toLowerCase()) {
      case 'bugfix':
      case 'bug':
        return 'regression_first';
      case 'ui':
      case 'styling':
      case 'css':
        return 'visual_regression';
      case 'refactor':
      case 'cleanup':
        return 'behavioral_invariance';
      case 'infra':
      case 'infrastructure':
      case 'config':
        return 'dry_run_validation';
      case 'feature':
      default:
        return 'tdd_red_green';
    }
  }
}
