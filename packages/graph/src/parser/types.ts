export type SymbolKind = 'function' | 'class' | 'interface' | 'type' | 'variable' | 'method';

export interface CodeSymbol {
  id: string;
  name: string;
  kind: SymbolKind;
  file: string;
  lineRange: [number, number];
  signature?: string;
  exported: boolean;
}

export type RelationType = 'calls' | 'imports' | 'implements' | 'extends' | 'instantiates';

export interface CodeEdge {
  from: string; // Symbol ID or File path
  to: string;   // Symbol ID or File path
  relation: RelationType;
}

export interface FileAstSummary {
  filePath: string;
  symbols: CodeSymbol[];
  imports: Array<{ source: string; specifiers: string[] }>;
  calls: Array<{ callerSymbol: string; calledName: string; line: number }>;
}
