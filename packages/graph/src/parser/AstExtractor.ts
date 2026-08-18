import type { CodeSymbol, FileAstSummary } from './types.js';

export class AstExtractor {
  public static parseTypeScriptOrJs(filePath: string, content: string): FileAstSummary {
    const lines = content.split('\n');
    const symbols: CodeSymbol[] = [];
    const imports: Array<{ source: string; specifiers: string[] }> = [];
    const calls: Array<{ callerSymbol: string; calledName: string; line: number }> = [];

    let currentSymbolName = 'root';

    for (let i = 0; i < lines.length; i++) {
      const lineNum = i + 1;
      const line = lines[i].trim();

      // 1. Imports
      const importMatch = line.match(/^import\s+(?:\{([^}]+)\}|(\w+)|\*\s+as\s+(\w+))\s+from\s+['"]([^'"]+)['"]/);
      if (importMatch) {
        const specifiersStr = importMatch[1] || importMatch[2] || importMatch[3] || '';
        const source = importMatch[4];
        const specifiers = specifiersStr.split(',').map(s => s.trim().split(/\s+as\s+/)[0]).filter(Boolean);
        imports.push({ source, specifiers });
        continue;
      }

      // 2. Exported / Non-exported Functions
      const funcMatch = line.match(/^(?:export\s+)?(?:async\s+)?function\s+(\w+)\s*\(([^)]*)\)/);
      if (funcMatch) {
        const name = funcMatch[1];
        const exported = line.startsWith('export');
        symbols.push({
          id: `${filePath}#${name}`,
          name,
          kind: 'function',
          file: filePath,
          lineRange: [lineNum, lineNum],
          signature: `function ${name}(${funcMatch[2]})`,
          exported,
        });
        currentSymbolName = name;
        continue;
      }

      // 3. Arrow function / Function variable
      const arrowMatch = line.match(/^(?:export\s+)?(?:const|let)\s+(\w+)\s*=\s*(?:async\s*)?\(([^)]*)\)\s*=>/);
      if (arrowMatch) {
        const name = arrowMatch[1];
        const exported = line.startsWith('export');
        symbols.push({
          id: `${filePath}#${name}`,
          name,
          kind: 'function',
          file: filePath,
          lineRange: [lineNum, lineNum],
          signature: `const ${name} = (${arrowMatch[2]}) =>`,
          exported,
        });
        currentSymbolName = name;
        continue;
      }

      // 4. Classes
      const classMatch = line.match(/^(?:export\s+)?class\s+(\w+)(?:\s+extends\s+(\w+))?(?:\s+implements\s+([^\{]+))?/);
      if (classMatch) {
        const name = classMatch[1];
        const exported = line.startsWith('export');
        symbols.push({
          id: `${filePath}#${name}`,
          name,
          kind: 'class',
          file: filePath,
          lineRange: [lineNum, lineNum],
          signature: line.replace(/\{.*/, '').trim(),
          exported,
        });
        currentSymbolName = name;
        continue;
      }

      // 5. Interfaces / Types
      const ifaceMatch = line.match(/^(?:export\s+)?(?:interface|type)\s+(\w+)/);
      if (ifaceMatch) {
        const name = ifaceMatch[1];
        const exported = line.startsWith('export');
        symbols.push({
          id: `${filePath}#${name}`,
          name,
          kind: line.includes('interface') ? 'interface' : 'type',
          file: filePath,
          lineRange: [lineNum, lineNum],
          signature: line.replace(/\{.*/, '').trim(),
          exported,
        });
        continue;
      }

      // 6. Function calls
      const callMatch = line.match(/(\w+)\s*\(/);
      if (callMatch) {
        const calledName = callMatch[1];
        if (!['if', 'for', 'while', 'switch', 'catch', 'function', 'import', 'return'].includes(calledName)) {
          calls.push({ callerSymbol: currentSymbolName, calledName, line: lineNum });
        }
      }
    }

    return { filePath, symbols, imports, calls };
  }
}
