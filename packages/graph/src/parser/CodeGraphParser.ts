import * as fs from 'node:fs';
import * as path from 'node:path';
import { AstExtractor } from './AstExtractor.js';
import type { FileAstSummary, CodeSymbol, CodeEdge } from './types.js';

export class CodeGraphParser {
  private readonly workspaceRoot: string;

  constructor(workspaceRoot: string) {
    this.workspaceRoot = path.resolve(workspaceRoot);
  }

  public parseFile(relativePath: string): FileAstSummary {
    const fullPath = path.join(this.workspaceRoot, relativePath);
    if (!fs.existsSync(fullPath)) {
      return { filePath: relativePath, symbols: [], imports: [], calls: [] };
    }
    const content = fs.readFileSync(fullPath, 'utf8');
    return AstExtractor.parseTypeScriptOrJs(relativePath.replace(/\\/g, '/'), content);
  }

  public parseWorkspace(extensions: string[] = ['.ts', '.js', '.tsx', '.jsx']): {
    symbols: CodeSymbol[];
    edges: CodeEdge[];
    fileSummaries: FileAstSummary[];
  } {
    const files = this.collectSourceFiles(this.workspaceRoot, extensions);
    const fileSummaries: FileAstSummary[] = [];
    const allSymbols: CodeSymbol[] = [];
    const allEdges: CodeEdge[] = [];

    for (const file of files) {
      const relPath = path.relative(this.workspaceRoot, file).replace(/\\/g, '/');
      const summary = this.parseFile(relPath);
      fileSummaries.push(summary);
      allSymbols.push(...summary.symbols);

      // Add import edges
      for (const imp of summary.imports) {
        allEdges.push({
          from: relPath,
          to: imp.source,
          relation: 'imports',
        });
      }

      // Add call edges
      for (const call of summary.calls) {
        allEdges.push({
          from: `${relPath}#${call.callerSymbol}`,
          to: call.calledName,
          relation: 'calls',
        });
      }
    }

    return {
      symbols: allSymbols,
      edges: allEdges,
      fileSummaries,
    };
  }

  private collectSourceFiles(dir: string, extensions: string[]): string[] {
    const results: string[] = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!['node_modules', '.git', 'dist', '.harness'].includes(entry.name)) {
          results.push(...this.collectSourceFiles(fullPath, extensions));
        }
      } else if (entry.isFile() && extensions.some(ext => entry.name.endsWith(ext))) {
        results.push(fullPath);
      }
    }

    return results;
  }
}
