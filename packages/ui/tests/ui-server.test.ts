import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { ApiRouter } from '../src/server/ApiRouter.js';
import { HttpServer } from '../src/server/HttpServer.js';

describe('v2.0 UI: Real-Time Observer Dashboard & REST APIs', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'harness-ui-test-'));

    // Create sample repo structure
    fs.mkdirSync(path.join(tempDir, 'src'), { recursive: true });
    fs.writeFileSync(path.join(tempDir, 'package.json'), '{"name":"ui-app"}');
    fs.writeFileSync(path.join(tempDir, 'src', 'app.ts'), 'export function start() { return true; }');

    // Create sample failure
    const failDir = path.join(tempDir, '.harness', 'knowledge', 'failures');
    fs.mkdirSync(failDir, { recursive: true });
    fs.writeFileSync(
      path.join(failDir, 'FAIL-101.json'),
      JSON.stringify({
        id: 'FAIL-101',
        task: 'UI render crash',
        lesson: 'Wrap component in ErrorBoundary',
        scope: { domain: 'frontend' },
      })
    );
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('Gate 1 & 2: ApiRouter serves Dashboard SPA HTML and JSON REST APIs', () => {
    const router = new ApiRouter(tempDir);

    // 1. Root HTML
    const htmlResp = router.handleRequest('/');
    expect(htmlResp.status).toBe(200);
    expect(htmlResp.contentType).toContain('text/html');
    expect(htmlResp.body).toContain('DEV-HARNESS v2.0');

    // 2. Status API
    const statusResp = router.handleRequest('/api/status');
    expect(statusResp.status).toBe(200);
    const statusData = JSON.parse(statusResp.body);
    expect(statusData.workspaceFingerprint).toHaveLength(64);

    // 3. Graph API
    const graphResp = router.handleRequest('/api/graph');
    expect(graphResp.status).toBe(200);
    const graphData = JSON.parse(graphResp.body);
    expect(graphData.symbols.some((s: any) => s.name === 'start')).toBe(true);

    // 4. Failures API
    const failResp = router.handleRequest('/api/failures');
    expect(failResp.status).toBe(200);
    const failData = JSON.parse(failResp.body);
    expect(failData.length).toBe(1);
    expect(failData[0].id).toBe('FAIL-101');
  });

  it('Gate 3 & 4: HttpServer starts and stops cleanly on custom port', async () => {
    const server = new HttpServer({ port: 4899, workspaceRoot: tempDir });
    const url = await server.start();
    expect(url).toBe('http://localhost:4899');
    await server.stop();
  });
});
