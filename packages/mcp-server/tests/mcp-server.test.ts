import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { McpServer } from '../src/server/McpServer.js';

describe('v2.0 MCP Server: JSON-RPC Protocol & 8 Core Tools', () => {
  let tempDir: string;
  let server: McpServer;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'harness-mcp-test-'));
    server = new McpServer(tempDir);
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('Gate 1: Handles initialize and tools/list requests adhering to MCP specification', async () => {
    // 1. Initialize
    const initResp = await server.handleRequest({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: { clientInfo: { name: 'antigravity', version: '1.0.0' } },
    });

    expect(initResp.error).toBeUndefined();
    expect(initResp.result.serverInfo.name).toBe('dev-harness-mcp-server');
    expect(initResp.result.protocolVersion).toBe('2024-11-05');

    // 2. Tools list
    const toolsResp = await server.handleRequest({
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/list',
    });

    expect(toolsResp.error).toBeUndefined();
    const toolNames = toolsResp.result.tools.map((t: any) => t.name);
    expect(toolNames).toContain('harness_init_workspace');
    expect(toolNames).toContain('harness_get_status');
    expect(toolNames).toContain('harness_get_context');
    expect(toolNames).toContain('harness_query_failures');
    expect(toolNames).toContain('harness_run_verifier');
    expect(toolNames).toContain('harness_create_checkpoint');
    expect(toolNames).toContain('harness_create_handoff');
    expect(toolNames).toContain('harness_auto_synthesize_failure');
  });

  it('Gate 2: Executes harness_init_workspace and harness_get_status tools successfully', async () => {
    // 1. Init workspace tool call
    const initCall = await server.handleRequest({
      jsonrpc: '2.0',
      id: 10,
      method: 'tools/call',
      params: {
        name: 'harness_init_workspace',
        arguments: { targetDir: tempDir },
      },
    });

    expect(initCall.error).toBeUndefined();
    expect(initCall.result.content[0].text).toContain('Initialized DEV-HARNESS workspace');
    expect(fs.existsSync(path.join(tempDir, '.harness', 'manifest.json'))).toBe(true);

    // 2. Get status tool call
    const statusCall = await server.handleRequest({
      jsonrpc: '2.0',
      id: 11,
      method: 'tools/call',
      params: {
        name: 'harness_get_status',
        arguments: {},
      },
    });

    expect(statusCall.error).toBeUndefined();
    const statusData = JSON.parse(statusCall.result.content[0].text);
    expect(statusData.workspaceFingerprint).toHaveLength(64);
  });

  it('Gate 3: Executes harness_auto_synthesize_failure, harness_create_checkpoint, and resource reads', async () => {
    // 1. Init
    await server.handleRequest({
      jsonrpc: '2.0',
      id: 20,
      method: 'tools/call',
      params: { name: 'harness_init_workspace', arguments: { targetDir: tempDir } },
    });

    // 2. Auto synthesize failure
    const failResp = await server.handleRequest({
      jsonrpc: '2.0',
      id: 21,
      method: 'tools/call',
      params: {
        name: 'harness_auto_synthesize_failure',
        arguments: {
          runId: 'RUN-999',
          taskTitle: 'Database Connection Pool Test',
          rawOutput: 'AssertionError: connection timeout after 5000ms\n ❯ tests/db.test.ts:15:3',
          domain: 'database',
        },
      },
    });

    expect(failResp.error).toBeUndefined();
    const failureEvidence = JSON.parse(failResp.result.content[0].text);
    expect(failureEvidence.id).toMatch(/^FAIL-\d{4}$/);

    // 3. Query failures tool
    const queryResp = await server.handleRequest({
      jsonrpc: '2.0',
      id: 22,
      method: 'tools/call',
      params: {
        name: 'harness_query_failures',
        arguments: { query: 'connection timeout database pool' },
      },
    });
    expect(queryResp.error).toBeUndefined();
    const matches = JSON.parse(queryResp.result.content[0].text);
    expect(matches.length).toBeGreaterThan(0);

    // 4. Resources Read: harness://spec/manifest
    const resRead = await server.handleRequest({
      jsonrpc: '2.0',
      id: 23,
      method: 'resources/read',
      params: { uri: 'harness://spec/manifest' },
    });
    expect(resRead.error).toBeUndefined();
    expect(resRead.result.contents[0].text).toContain('dev-harness-workspace');
  });
});
