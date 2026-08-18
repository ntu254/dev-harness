export type VerificationStrategy = 'tdd_red_green' | 'regression_first' | 'visual_regression' | 'behavioral_invariance' | 'dry_run_validation';
export interface PolicyScope {
    paths?: string[];
    taskTypes?: string[];
    environments?: string[];
    agentIds?: string[];
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
    denyImports?: string[];
    enforcedStrategy?: VerificationStrategy;
    requiredGates?: string[];
}
export interface PolicyEngine {
    evaluatePreAction(action: AgentAction, scope: PolicyScope): PolicyDecision;
    evaluatePostAction(observation: ActionObservation, scope: PolicyScope): PolicyDecision;
    resolveVerificationStrategy(taskType: string): VerificationStrategy;
}
//# sourceMappingURL=policy.d.ts.map