import type { CodeSymbol, CodeEdge } from '../parser/types.js';

export class SymbolGraph {
  private symbols: Map<string, CodeSymbol> = new Map();
  private edges: CodeEdge[] = [];
  private adjacency: Map<string, Array<{ to: string; relation: string }>> = new Map();

  constructor(symbols: CodeSymbol[] = [], edges: CodeEdge[] = []) {
    for (const s of symbols) {
      this.addSymbol(s);
    }
    for (const e of edges) {
      this.addEdge(e);
    }
  }

  public addSymbol(symbol: CodeSymbol): void {
    this.symbols.set(symbol.id, symbol);
    if (!this.adjacency.has(symbol.id)) {
      this.adjacency.set(symbol.id, []);
    }
  }

  public addEdge(edge: CodeEdge): void {
    this.edges.push(edge);
    if (!this.adjacency.has(edge.from)) {
      this.adjacency.set(edge.from, []);
    }
    this.adjacency.get(edge.from)!.push({ to: edge.to, relation: edge.relation });
  }

  public getSymbol(id: string): CodeSymbol | undefined {
    return this.symbols.get(id);
  }

  public findSymbolsByName(name: string): CodeSymbol[] {
    return Array.from(this.symbols.values()).filter(s => s.name === name);
  }

  public getAllSymbols(): CodeSymbol[] {
    return Array.from(this.symbols.values());
  }

  public getAllEdges(): CodeEdge[] {
    return [...this.edges];
  }

  public getOutgoingEdges(nodeId: string): Array<{ to: string; relation: string }> {
    return this.adjacency.get(nodeId) || [];
  }
}
