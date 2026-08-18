import * as fs from 'node:fs';
import * as path from 'node:path';
import { GitWorkspace, HandoffValidator, FailureMemoryLoader } from '@dev-harness/infrastructure';
import { CodeGraphParser } from '@dev-harness/graph';
import { getDashboardHtml } from '../client/DashboardHtml.js';

export class ApiRouter {
  private readonly workspaceRoot: string;

  constructor(workspaceRoot: string = process.cwd()) {
    this.workspaceRoot = path.resolve(workspaceRoot);
  }

  public handleRequest(url: string): { status: number; contentType: string; body: string } {
    const cleanUrl = url.split('?')[0];

    // 1. Web SPA
    if (cleanUrl === '/' || cleanUrl === '/index.html') {
      return {
        status: 200,
        contentType: 'text/html; charset=utf-8',
        body: getDashboardHtml(),
      };
    }

    // 2. Status API
    if (cleanUrl === '/api/status') {
      const gitWorkspace = new GitWorkspace(this.workspaceRoot);
      const fingerprint = gitWorkspace.getTreeFingerprint();
      const runsDir = path.join(this.workspaceRoot, '.harness', 'runtime', 'runs');
      const runs = fs.existsSync(runsDir) ? fs.readdirSync(runsDir) : [];

      return {
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          workspaceRoot: this.workspaceRoot,
          workspaceFingerprint: fingerprint,
          runs,
        }),
      };
    }

    // 3. Code Graph API
    if (cleanUrl === '/api/graph') {
      const parser = new CodeGraphParser(this.workspaceRoot);
      const graphData = parser.parseWorkspace();
      return {
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(graphData),
      };
    }

    // 4. Failure Memories API
    if (cleanUrl === '/api/failures') {
      const loader = new FailureMemoryLoader(this.workspaceRoot);
      const failures = loader.loadAllFailures();
      return {
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(failures),
      };
    }

    // 5. Handoffs API
    if (cleanUrl === '/api/handoffs') {
      const handoffsDir = path.join(this.workspaceRoot, '.harness', 'runtime', 'handoffs');
      const validator = new HandoffValidator(this.workspaceRoot);
      const results: any[] = [];

      if (fs.existsSync(handoffsDir)) {
        const dirs = fs.readdirSync(handoffsDir);
        for (const d of dirs) {
          const hFile = path.join(handoffsDir, d, 'handoff.json');
          if (fs.existsSync(hFile)) {
            const parsed = JSON.parse(fs.readFileSync(hFile, 'utf8'));
            const val = validator.validate(parsed);
            results.push({ ...parsed, status: val.status, isValid: val.isValid });
          }
        }
      }

      return {
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(results),
      };
    }

    return {
      status: 404,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Endpoint not found' }),
    };
  }
}
