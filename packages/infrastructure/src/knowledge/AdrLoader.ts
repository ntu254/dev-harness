import * as fs from 'node:fs';
import * as path from 'node:path';
import type { ContextProvenance } from '@dev-harness/spec';
import { DirectoryLayout } from '../run-store/DirectoryLayout.js';

export interface DecisionRecord {
  id: string;
  title: string;
  status: string;
  path: string;
}

export class AdrLoader {
  private readonly decisionsDir: string;

  constructor(workspaceRoot: string) {
    this.decisionsDir = DirectoryLayout.getDecisionsDir(workspaceRoot);
  }

  public loadDecisions(): { decisions: DecisionRecord[]; provenance: ContextProvenance[] } {
    if (!fs.existsSync(this.decisionsDir)) {
      return { decisions: [], provenance: [] };
    }

    const files = fs.readdirSync(this.decisionsDir).filter(f => f.endsWith('.md'));
    const decisions: DecisionRecord[] = [];
    const provenance: ContextProvenance[] = [];

    for (const file of files) {
      const fullPath = path.join(this.decisionsDir, file);
      const content = fs.readFileSync(fullPath, 'utf8');

      // Extract ADR ID and Title (e.g. # ADR-001: Use PostgreSQL)
      const titleMatch = content.match(/^#\s+(ADR-\d+:\s*.+)/m) || content.match(/^#\s*(.+)/m);
      const title = titleMatch ? titleMatch[1].trim() : file.replace(/\.md$/, '');
      const idMatch = file.match(/^(ADR-\d+)/i);
      const id = idMatch ? idMatch[1].toUpperCase() : file.replace(/\.md$/, '');

      // Extract Status if available (e.g. Status: Accepted)
      const statusMatch = content.match(/\*\*Status:\*\*\s*([A-Za-z]+)/i) || content.match(/Status:\s*([A-Za-z]+)/i);
      const status = statusMatch ? statusMatch[1].trim() : 'Accepted';

      const decision: DecisionRecord = {
        id,
        title,
        status,
        path: path.posix.join('.harness', 'knowledge', 'decisions', file),
      };

      decisions.push(decision);
      provenance.push({
        sourceId: id,
        sourceType: 'adr',
        extractedAt: new Date().toISOString(),
      });
    }

    return { decisions, provenance };
  }
}
