import * as fs from 'node:fs';
import * as path from 'node:path';
import type { RunRecord, DomainEvent } from '@dev-harness/spec';
import { SecretRedactor } from '@dev-harness/kernel';
import { DirectoryLayout } from './DirectoryLayout.js';

export class FileRunStore {
  private readonly workspaceRoot: string;
  private readonly redactor: SecretRedactor;

  constructor(workspaceRoot: string, redactor?: SecretRedactor) {
    this.workspaceRoot = path.resolve(workspaceRoot);
    this.redactor = redactor || new SecretRedactor();
  }

  public initRunDirectory(runId: string, intent: string): string {
    const runDir = DirectoryLayout.getRunDir(this.workspaceRoot, runId);
    const patchesDir = DirectoryLayout.getPatchesDir(this.workspaceRoot, runId);
    const artifactsDir = DirectoryLayout.getArtifactsDir(this.workspaceRoot, runId);

    if (!fs.existsSync(runDir)) {
      fs.mkdirSync(runDir, { recursive: true });
    }
    if (!fs.existsSync(patchesDir)) {
      fs.mkdirSync(patchesDir, { recursive: true });
    }
    if (!fs.existsSync(artifactsDir)) {
      fs.mkdirSync(artifactsDir, { recursive: true });
    }

    // Write intent.md
    const intentPath = path.join(runDir, 'intent.md');
    fs.writeFileSync(intentPath, intent, 'utf8');

    return runDir;
  }

  /**
   * Append an event to events.jsonl on disk with automatic secret redaction.
   */
  public appendEvent<T = unknown>(runId: string, event: DomainEvent<T>): void {
    const runDir = this.initRunDirectory(runId, '');
    const eventsFile = path.join(runDir, 'events.jsonl');

    const sanitizedPayload = this.redactor.redact(event.payload);
    const sanitizedEvent: DomainEvent<T> = {
      ...event,
      payload: sanitizedPayload,
    };

    const line = JSON.stringify(sanitizedEvent) + '\n';
    fs.appendFileSync(eventsFile, line, 'utf8');
  }

  /**
   * Read all events for a given run from disk.
   */
  public readEvents(runId: string): DomainEvent[] {
    const runDir = DirectoryLayout.getRunDir(this.workspaceRoot, runId);
    const eventsFile = path.join(runDir, 'events.jsonl');

    if (!fs.existsSync(eventsFile)) {
      return [];
    }

    const content = fs.readFileSync(eventsFile, 'utf8');
    const lines = content.split('\n').filter(line => line.trim().length > 0);
    return lines.map(line => JSON.parse(line) as DomainEvent);
  }

  /**
   * Persists the complete RunRecord artifacts to disk.
   */
  public saveRunRecord(record: RunRecord): void {
    const runDir = this.initRunDirectory(record.runId, record.intent);

    // 1. plan.json
    fs.writeFileSync(
      path.join(runDir, 'plan.json'),
      JSON.stringify(record.plan, null, 2),
      'utf8'
    );

    // 2. context.json
    fs.writeFileSync(
      path.join(runDir, 'context.json'),
      JSON.stringify(record.contextBundle, null, 2),
      'utf8'
    );

    // 3. verification.json
    if (record.verification) {
      fs.writeFileSync(
        path.join(runDir, 'verification.json'),
        JSON.stringify(record.verification, null, 2),
        'utf8'
      );
    }

    // 4. checkpoint.json
    if (record.checkpointId) {
      fs.writeFileSync(
        path.join(runDir, 'checkpoint.json'),
        JSON.stringify({ checkpointId: record.checkpointId }, null, 2),
        'utf8'
      );
    }

    // 5. result.json
    const result = {
      runId: record.runId,
      sessionId: record.sessionId,
      state: record.state,
      usage: record.usage,
      createdAt: record.createdAt,
      completedAt: record.completedAt,
    };
    fs.writeFileSync(
      path.join(runDir, 'result.json'),
      JSON.stringify(result, null, 2),
      'utf8'
    );
  }
}
