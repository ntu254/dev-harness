import type { SymbolGraph } from './SymbolGraph.js';

export interface GraphNeighborhoodResult {
  focalSymbols: string[];
  edges: Array<{ from: string; to: string; relation: 'calls' | 'imports' | 'implements' }>;
}

export class GraphNeighborhood {
  public static extract(
    graph: SymbolGraph,
    focalSymbolNames: string[],
    maxHops: number = 1
  ): GraphNeighborhoodResult {
    const visited = new Set<string>();
    const focalSymbolIds: string[] = [];
    const collectedEdges: Array<{ from: string; to: string; relation: 'calls' | 'imports' | 'implements' }> = [];

    // 1. Locate focal symbols
    for (const name of focalSymbolNames) {
      const symbols = graph.findSymbolsByName(name);
      for (const s of symbols) {
        focalSymbolIds.push(s.id);
        visited.add(s.id);
      }
    }

    // 2. Perform BFS up to maxHops
    let currentLevel = [...focalSymbolIds];
    for (let hop = 0; hop < maxHops; hop++) {
      const nextLevel: string[] = [];
      for (const nodeId of currentLevel) {
        const outgoing = graph.getOutgoingEdges(nodeId);
        for (const edge of outgoing) {
          const relation = (['calls', 'imports', 'implements'].includes(edge.relation)
            ? edge.relation
            : 'calls') as 'calls' | 'imports' | 'implements';

          collectedEdges.push({
            from: nodeId,
            to: edge.to,
            relation,
          });

          if (!visited.has(edge.to)) {
            visited.add(edge.to);
            nextLevel.push(edge.to);
          }
        }
      }
      currentLevel = nextLevel;
      if (currentLevel.length === 0) break;
    }

    return {
      focalSymbols: focalSymbolNames,
      edges: collectedEdges,
    };
  }
}
