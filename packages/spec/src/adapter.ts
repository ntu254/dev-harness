import type { ContextBundle } from './context.js';
import type { HandoffPackage } from './handoff.js';

export interface AgentFeatures {
  supportsStreaming: boolean;
  supportsToolInterruption: boolean;
  supportsContextCompaction: boolean;
  supportsMcp: boolean;
  contextWindow: number;
}

export type Capability =
  | 'filesystem.read'
  | 'filesystem.write'
  | 'terminal.exec'
  | 'git.read'
  | 'git.write'
  | 'browser.open'
  | 'browser.interact'
  | 'network.http';

export interface AgentSessionInput {
  sessionId: string;
  projectId: string;
  features: AgentFeatures;
}

export interface AgentRunInput {
  runId: string;
  sessionId: string;
  intent: string;
  acceptanceCriteria: string[];
  contextBundle: ContextBundle;
  effectiveCapabilities: Capability[];
}

export interface ToolRequest {
  id: string;
  capability: Capability;
  toolName: string;
  arguments: Record<string, unknown>;
}

export interface ToolResult {
  requestId: string;
  success: boolean;
  output: unknown;
  error?: string;
  executionDurationMs: number;
}

export interface UsageMetrics {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
}

export interface AgentAdapter {
  id: string;
  version: string;
  features(): AgentFeatures;
  
  createSession(input: AgentSessionInput): Promise<string>;
  startRun(input: AgentRunInput): Promise<void>;
  sendContext(runId: string, bundle: ContextBundle): Promise<void>;
  dispatchTool(runId: string, request: ToolRequest): Promise<ToolResult>;
  interrupt(runId: string, reason: string): Promise<void>;
  resume(runId: string, state: HandoffPackage): Promise<void>;
  collectUsage(runId: string): Promise<UsageMetrics>;
  endSession(sessionId: string): Promise<void>;
}
