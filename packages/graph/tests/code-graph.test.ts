import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { CodeGraphParser } from '../src/parser/CodeGraphParser.js';
import { SymbolGraph } from '../src/graph/SymbolGraph.js';
import { GraphNeighborhood } from '../src/graph/GraphNeighborhood.js';

describe('v2.0 Graph: AST Parser & Symbol Graph Neighborhood', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'harness-graph-test-'));

    // Create realistic TypeScript files
    fs.mkdirSync(path.join(tempDir, 'src'), { recursive: true });
    
    fs.writeFileSync(
      path.join(tempDir, 'src', 'db.ts'),
      `
export interface DbConnection {
  connect(): Promise<void>;
}

export class PostgresClient implements DbConnection {
  public async connect(): Promise<void> {}
}
`
    );

    fs.writeFileSync(
      path.join(tempDir, 'src', 'auth.ts'),
      `
import { PostgresClient } from './db.js';

export function loginUser(email: string, pass: string): boolean {
  const db = new PostgresClient();
  db.connect();
  return true;
}

export const verifyToken = (token: string) => {
  return token.length > 0;
};
`
    );
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('Gate 1: Extracts AST symbols, interfaces, classes, functions, and import edges', () => {
    const parser = new CodeGraphParser(tempDir);
    const { symbols, edges } = parser.parseWorkspace();

    expect(symbols.some(s => s.name === 'DbConnection' && s.kind === 'interface')).toBe(true);
    expect(symbols.some(s => s.name === 'PostgresClient' && s.kind === 'class')).toBe(true);
    expect(symbols.some(s => s.name === 'loginUser' && s.kind === 'function')).toBe(true);
    expect(symbols.some(s => s.name === 'verifyToken' && s.kind === 'function')).toBe(true);

    expect(edges.some(e => e.relation === 'imports' && e.to === './db.js')).toBe(true);
  });

  it('Gate 2: GraphNeighborhood extracts N-hop subgraph for focal symbols', () => {
    const parser = new CodeGraphParser(tempDir);
    const { symbols, edges } = parser.parseWorkspace();
    const graph = new SymbolGraph(symbols, edges);

    const neighborhood = GraphNeighborhood.extract(graph, ['loginUser'], 1);
    expect(neighborhood.focalSymbols).toContain('loginUser');
    expect(neighborhood.edges.length).toBeGreaterThan(0);
  });
});
