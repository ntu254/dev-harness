export type VerificationStrategy =
  | 'tdd_red_green'
  | 'regression_first'
  | 'visual_regression'
  | 'behavioral_invariance'
  | 'dry_run_validation';

export interface PolicyScope {
  paths?: string[];          // e.g. ["src/ui/**", "src/components/**"]
  taskTypes?: string[];      // e.g. ["feature", "refactor", "bugfix"]
  environments?: string[];   // e.g. ["local_docker", "ci"]
  agentIds?: string[];       // e.g. ["claude-code", "cursor"]
}

export interface AgentAction {
  type: 'file_edit' | 'file_create' | 'file_delete' | 'terminal_exec' | 'tool_call';
  targetPath?: string;
  command?: string;
  payload?: unknown;
}

export interface ActionObservation {
  action: AgentAction;
  success: boolean;
  result?: unknown;
  changedFiles?: string[];
  error?: string;
}

export interface PolicyDecision {
  allowed: boolean;
  reason?: string;
  violations?: string[];
  requiredActions?: string[];
}

export interface PolicyRule {
  id: string;
  description: string;
  scope: PolicyScope;
  denyImports?: string[];    // e.g. ["prisma", "pg"] in UI scope
  enforcedStrategy?: VerificationStrategy;
  requiredGates?: string[];
}

export interface PolicyEngine {
  evaluatePreAction(action: AgentAction, scope: PolicyScope): PolicyDecision;
  evaluatePostAction(observation: ActionObservation, scope: PolicyScope): PolicyDecision;
  resolveVerificationStrategy(taskType: string): VerificationStrategy;
}
