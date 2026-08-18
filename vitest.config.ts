import { defineConfig } from 'vitest/config';
import * as path from 'node:path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['packages/*/tests/**/*.test.ts', 'tests/**/*.test.ts'],
    alias: {
      '@dev-harness/spec': path.resolve(__dirname, './packages/spec/src/index.ts'),
      '@dev-harness/kernel': path.resolve(__dirname, './packages/kernel/src/index.ts'),
      '@dev-harness/infrastructure': path.resolve(__dirname, './packages/infrastructure/src/index.ts'),
      '@dev-harness/sandbox': path.resolve(__dirname, './packages/sandbox/src/index.ts'),
      '@dev-harness/security': path.resolve(__dirname, './packages/security/src/index.ts'),
      '@dev-harness/verifier': path.resolve(__dirname, './packages/verifier/src/index.ts'),
      '@dev-harness/adapters': path.resolve(__dirname, './packages/adapters/src/index.ts'),
      '@dev-harness/graph': path.resolve(__dirname, './packages/graph/src/index.ts'),
      '@dev-harness/mcp-server': path.resolve(__dirname, './packages/mcp-server/src/index.ts'),
      '@dev-harness/router': path.resolve(__dirname, './packages/router/src/index.ts'),
      '@dev-harness/ui': path.resolve(__dirname, './packages/ui/src/index.ts'),
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
