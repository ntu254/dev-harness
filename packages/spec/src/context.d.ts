export interface FailureEvidence {
    id: string;
    timestamp: string;
    task: string;
    evidenceStrength: 'low' | 'medium' | 'high';
    verifiedAt: string;
    supersededBy: string | null;
    evidence: {
        runId: string;
        failingTests: string[];
        observedSymptom: string;
    };
    scope: {
        framework?: string;
        database?: string;
        domain?: string;
    };
    failedHypothesis: string;
    rootCause: string;
    lesson: string;
    doNotRepeatWhen: string[];
}
export interface ContextProvenance {
    sourceId: string;
    sourceType: 'adr' | 'failure_evidence' | 'code_graph' | 'git_commit' | 'user_intent';
    extractedAt: string;
}
export interface ContextFile {
    path: string;
    content: string;
    hash: string;
}
export interface ContextSymbol {
    name: string;
    kind: string;
    file: string;
    lineRange: [number, number];
}
export interface GraphEdge {
    from: string;
    to: string;
    relation: 'calls' | 'imports' | 'implements';
}
export interface ContextBundle {
    runId: string;
    budget: {
        maxTokens: number;
        allocatedTokens: number;
    };
    project: {
        id: string;
        rootPath: string;
    };
    files: ContextFile[];
    symbols: ContextSymbol[];
    graphNeighborhood: {
        focalSymbols: string[];
        edges: GraphEdge[];
    };
    memories: Array<{
        id: string;
        content: string;
        strength: 'low' | 'medium' | 'high';
    }>;
    decisions: Array<{
        id: string;
        title: string;
        status: string;
        path: string;
    }>;
    failures: FailureEvidence[];
    gitContext: {
        branch: string;
        headCommit: string;
        recentDiffSummary: string;
    };
    provenance: ContextProvenance[];
}
//# sourceMappingURL=context.d.ts.map