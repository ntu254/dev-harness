import * as fs from 'node:fs';
import * as path from 'node:path';
import type { FailureEvidence, ContextProvenance } from '@dev-harness/spec';
import { DirectoryLayout } from '../run-store/DirectoryLayout.js';

export interface ScopeQuery {
  framework?: string;
  database?: string;
  domain?: string;
  taskKeywords?: string[];
}

export class FailureMemoryLoader {
  private readonly failuresDir: string;

  constructor(workspaceRoot: string) {
    this.failuresDir = DirectoryLayout.getFailuresDir(workspaceRoot);
  }

  public loadAllFailures(): FailureEvidence[] {
    if (!fs.existsSync(this.failuresDir)) {
      return [];
    }

    const files = fs.readdirSync(this.failuresDir).filter(f => f.endsWith('.json'));
    const failures: FailureEvidence[] = [];

    for (const file of files) {
      const fullPath = path.join(this.failuresDir, file);
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        const parsed = JSON.parse(content) as FailureEvidence;
        
        // Basic schema validation
        if (parsed.id && parsed.task && parsed.lesson) {
          failures.push(parsed);
        }
      } catch {
        // Skip invalid JSON files
      }
    }

    return failures;
  }

  /**
   * Query failure memories based on scope, excluding superseded failures by default.
   */
  public query(query: ScopeQuery, includeSuperseded: boolean = false): { failures: FailureEvidence[]; provenance: ContextProvenance[] } {
    const all = this.loadAllFailures();
    
    // 1. Filter supersededBy
    const active = includeSuperseded ? all : all.filter(f => !f.supersededBy);

    // 2. Scope Matching
    const matched = active.filter(f => {
      if (query.framework && f.scope?.framework && f.scope.framework.toLowerCase() !== query.framework.toLowerCase()) {
        return false;
      }
      if (query.database && f.scope?.database && f.scope.database.toLowerCase() !== query.database.toLowerCase()) {
        return false;
      }
      if (query.domain && f.scope?.domain && f.scope.domain.toLowerCase() !== query.domain.toLowerCase()) {
        return false;
      }
      if (query.taskKeywords && query.taskKeywords.length > 0) {
        const taskLower = f.task.toLowerCase();
        const matchesKeyword = query.taskKeywords.some(kw => taskLower.includes(kw.toLowerCase()));
        if (!matchesKeyword) return false;
      }
      return true;
    });

    // 3. Confidence Ranking (high > medium > low)
    const strengthRank = { high: 3, medium: 2, low: 1 };
    matched.sort((a, b) => {
      const rankA = strengthRank[a.evidenceStrength || 'medium'];
      const rankB = strengthRank[b.evidenceStrength || 'medium'];
      return rankB - rankA;
    });

    // 4. Build Provenance
    const provenance: ContextProvenance[] = matched.map(f => ({
      sourceId: f.id,
      sourceType: 'failure_evidence',
      extractedAt: new Date().toISOString(),
    }));

    return { failures: matched, provenance };
  }
}
