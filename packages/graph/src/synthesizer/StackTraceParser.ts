export interface ParsedFailure {
  failingTests: string[];
  errorMessage: string;
  failingFile?: string;
  lineNumber?: number;
  stackSnippet?: string;
}

export class StackTraceParser {
  public static parse(output: string): ParsedFailure {
    const failingTests: string[] = [];
    let errorMessage = 'Test assertion or runtime execution failed';
    let failingFile: string | undefined;
    let lineNumber: number | undefined;

    const lines = output.split('\n');

    for (const line of lines) {
      // 1. Vitest / Jest test failure pattern (e.g. ❯ tests/auth.test.ts:12:5)
      const testFailMatch = line.match(/(?:✕|FAIL|failed|❯)\s+([^\s:]+)(?::(\d+):(\d+))?/);
      if (testFailMatch) {
        const testPath = testFailMatch[1];
        if (!failingTests.includes(testPath)) {
          failingTests.push(testPath);
        }
        if (!failingFile && testPath.includes('.')) {
          failingFile = testPath;
          lineNumber = testFailMatch[2] ? parseInt(testFailMatch[2], 10) : undefined;
        }
      }

      // 2. Error message line (e.g. AssertionError, Error: ..., TypeError: ...)
      const errMatch = line.match(/((?:Error|AssertionError|TypeError|ReferenceError):\s*.+)/);
      if (errMatch && errorMessage === 'Test assertion or runtime execution failed') {
        errorMessage = errMatch[1].trim();
      }
    }

    return {
      failingTests,
      errorMessage,
      failingFile,
      lineNumber,
      stackSnippet: lines.slice(0, 10).join('\n'),
    };
  }
}
