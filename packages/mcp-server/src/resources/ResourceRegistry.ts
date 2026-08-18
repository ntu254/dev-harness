import * as fs from 'node:fs';
import * as path from 'node:path';
import type { McpResource, McpResourceContent } from '../protocol/McpTypes.js';

export class ResourceRegistry {
  private readonly workspaceRoot: string;

  constructor(workspaceRoot: string = process.cwd()) {
    this.workspaceRoot = path.resolve(workspaceRoot);
  }

  public listResources(): McpResource[] {
    return [
      {
        uri: 'harness://spec/manifest',
        name: 'Workspace Manifest',
        description: 'Read the DEV-HARNESS manifest configuration and specifications',
        mimeType: 'application/json',
      },
      {
        uri: 'harness://runtime/handoffs/latest',
        name: 'Latest Handoff Package',
        description: 'Read the most recent cross-agent handoff package in the workspace',
        mimeType: 'application/json',
      },
      {
        uri: 'harness://knowledge/failures',
        name: 'Failure Memories Index',
        description: 'List of active empirical failure memories in the workspace',
        mimeType: 'application/json',
      },
    ];
  }

  public readResource(uri: string): McpResourceContent | null {
    if (uri === 'harness://spec/manifest') {
      const manifestPath = path.join(this.workspaceRoot, '.harness', 'manifest.json');
      if (fs.existsSync(manifestPath)) {
        return {
          uri,
          mimeType: 'application/json',
          text: fs.readFileSync(manifestPath, 'utf8'),
        };
      }
    }

    if (uri === 'harness://runtime/handoffs/latest') {
      const handoffsDir = path.join(this.workspaceRoot, '.harness', 'runtime', 'handoffs');
      if (fs.existsSync(handoffsDir)) {
        const dirs = fs.readdirSync(handoffsDir).sort().reverse();
        if (dirs.length > 0) {
          const latestFile = path.join(handoffsDir, dirs[0], 'handoff.json');
          if (fs.existsSync(latestFile)) {
            return {
              uri,
              mimeType: 'application/json',
              text: fs.readFileSync(latestFile, 'utf8'),
            };
          }
        }
      }
    }

    return null;
  }
}
