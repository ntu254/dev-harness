import { Run, type RunInitParams } from './Run.js';
import type { EventStore } from '../events/EventStore.js';

export class RunManager {
  private runs: Map<string, Run> = new Map();
  private readonly eventStore: EventStore;

  constructor(eventStore: EventStore) {
    this.eventStore = eventStore;
  }

  public createRun(params: Omit<RunInitParams, 'eventStore'>): Run {
    if (this.runs.has(params.runId)) {
      throw new Error(`Run '${params.runId}' already exists`);
    }
    const run = new Run({
      ...params,
      eventStore: this.eventStore,
    });
    this.runs.set(params.runId, run);
    return run;
  }

  public getRun(runId: string): Run | undefined {
    return this.runs.get(runId);
  }

  public listRuns(): readonly Run[] {
    return Array.from(this.runs.values());
  }
}
