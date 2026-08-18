import * as fs from 'node:fs';
import * as path from 'node:path';
import type { ContextBundle, ContextFile, ContextProvenance } from '@dev-harness/spec';
import { Hasher } from '@dev-harness/kernel';
import { GitWorkspace } from '../git/GitWorkspace.js';
import { FailureMemoryLoader, type ScopeQuery } from '../knowledge/FailureMemoryLoader.js';
import { AdrLoader } from '../knowledge/AdrLoader.js';
import { TokenBudgeter } from './TokenBudgeter.js';

export interface AssembleContextOptions {
  runId: string;
  projectId: string;
  maxTokens?: number;
  scopeQuery?: ScopeQuery;
  relevantFilePaths?: string[];
}

export class ContextEngine {
  private readonly workspaceRoot: string;
  private readonly gitWorkspace: GitWorkspace;
  private readonly failureLoader: FailureMemoryLoader;
  private readonly adrLoader: AdrLoader;

  constructor(workspaceRoot: string) {
    this.workspaceRoot = path.resolve(workspaceRoot);
    this.gitWorkspace = new GitWorkspace(this.workspaceRoot);
    this.failureLoader = new FailureMemoryLoader(this.workspaceRoot);
    this.adrLoader = new AdrLoader(this.workspaceRoot);
  }

  public assemble(options: AssembleContextOptions): ContextBundle {
    const maxTokens = options.maxTokens || 64000;
    const provenance: ContextProvenance[] = [];
    let allocatedTokens = 0;

    // 1. Git Context
    const gitStatus = this.gitWorkspace.getStatus();
    const gitContext = {
      branch: gitStatus.branch,
      headCommit: gitStatus.headCommit,
      recentDiffSummary: this.gitWorkspace.getDiff(),
    };
    allocatedTokens += TokenBudgeter.estimateObjectTokens(gitContext);

    // 2. ADR Decisions
    const { decisions, provenance: adrProvenance } = this.adrLoader.loadDecisions();
    provenance.push(...adrProvenance);
    allocatedTokens += TokenBudgeter.estimateObjectTokens(decisions);

    // 3. Failure Memories
    const { failures, provenance: failureProvenance } = this.failureLoader.query(options.scopeQuery || {});
    provenance.push(...failureProvenance);
    allocatedTokens += TokenBudgeter.estimateObjectTokens(failures);

    // 4. Relevant Files (Budget-aware)
    const contextFiles: ContextFile[] = [];
    const targetFiles = options.relevantFilePaths || [];

    for (const relPath of targetFiles) {
      const fullPath = path.join(this.workspaceRoot, relPath);
      if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
        const content = fs.readFileSync(fullPath, 'utf8');
        const fileTokens = TokenBudgeter.estimateTokens(content);

        // Enforce token budget strictly
        if (allocatedTokens + fileTokens <= maxTokens) {
          const hash = Hasher.sha256(content);
          contextFiles.push({
            path: relPath.replace(/\\/g, '/'),
            content,
            hash,
          });
          allocatedTokens += fileTokens;

          provenance.push({
            sourceId: `file:${relPath.replace(/\\/g, '/')}`,
            sourceType: 'code_graph',
            extractedAt: new Date().toISOString(),
          });
        }
      }
    }

    return {
      runId: options.runId,
      budget: {
        maxTokens,
        allocatedTokens,
      },
      project: {
        id: options.projectId,
        rootPath: this.workspaceRoot,
      },
      files: contextFiles,
      symbols: [],
      graphNeighborhood: {
        focalSymbols: [],
        edges: [],
      },
      memories: [],
      decisions,
      failures,
      gitContext,
      provenance,
    };
  }
}
