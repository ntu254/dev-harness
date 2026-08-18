# 🏛️ DEV-HARNESS: PORTABLE RUNTIME & WORKSPACE SPECIFICATION
**Version:** 1.0.0-spec (Finalized & Fully Implemented)  
**Status:** Approved Architecture & Reference Implementation Standard  
**Document Type:** Technical Specification & Runtime Standard  

> **Core Definition:**  
> **DEV-HARNESS** is a standardized, portable project runtime and workspace specification for AI software agents. It sits between arbitrary agent runtimes (Claude Code, Cursor, Aider, OpenCode, local models) and project codebases, providing deterministic execution sandboxes, multi-dimensional localized context retrieval, empirical failure memory, policy enforcement gates, verifiable proofs, and structured cross-agent handoffs.

---

## 1. HỆ HÌNH CỐT LÕI (THE CORE PRIMITIVE)

DEV-HARNESS chuẩn hóa vòng đời phát triển phần mềm của AI Agent xoay quanh **6 thực thể cấp một (First-Class Primitives)**:

```
                            ┌────────────────────────┐
                            │          RUN           │
                            │ (Task Execution Unit)  │
                            └───────────┬────────────┘
                                        │
             ┌──────────────────────────┼──────────────────────────┐
             ▼                          ▼                          ▼
      ┌─────────────┐            ┌─────────────┐            ┌─────────────┐
      │   CONTEXT   │            │   POLICY    │            │  EXECUTION  │
      │ (Retrieval  │            │ (Scoped     │            │  (Sandbox   │
      │  Provenance)│            │  Gates)     │            │   Engine)   │
      └──────┬──────┘            └──────┬──────┘            └──────┬──────┘
             │                          │                          │
             └──────────────────────────┼──────────────────────────┘
                                        ▼
                                 ┌─────────────┐
                                 │  RESOURCE   │
                                 │ (Budget,    │
                                 │  Network,   │
                                 │  Secrets)   │
                                 └──────┬──────┘
                                        │
                                        ▼
                                 ┌─────────────┐
                                 │    PROOF    │
                                 │ (Attested   │
                                 │  Evidence)  │
                                 └──────┬──────┘
                                        │
                                        ▼
                                 ┌─────────────┐
                                 │   HANDOFF   │
                                 │ (State &    │
                                 │ Fingerprint)│
                                 └─────────────┘
```

---

## 2. NĂM BẤT BIẾN KỸ THUẬT NỀN TẢNG (EXPLICIT INVARIANTS)

Để đảm bảo Reference Implementation không bị diễn giải sai lệch, hệ thống đặt ra **5 Bất biến Kỹ thuật Cốt lõi**:

### Invariant 1: Thu Hẹp Quyền Hạn Đơn Điệu (Monotonic Capability Restriction)
Tập quyền hạn thực tế $\text{EffectiveCapabilities}$ chỉ có thể **thu hẹp dần**, tuyệt đối không bao giờ được phép mở rộng bởi bất kỳ adapter hay subsystem nào phía sau:
$$\text{EffectiveCapabilities} = \text{AgentProvided} \cap \text{TaskRequested} \cap \text{PolicyAllowed} \cap \text{SandboxGranted}$$
$$\text{EffectiveCapabilities} \subseteq \text{PolicyAllowed} \subseteq \text{SandboxGranted}$$

### Invariant 2: Chuyển Trạng Thái Chỉ Ghi Thêm (Append-Only Event Sourcing)
Mọi sự thay đổi trạng thái của State Machine (`RECEIVED -> PLANNED -> AUTHORIZED -> EXECUTING -> VERIFYING -> COMPLETED`) bắt buộc phải được sinh ra dưới dạng sự kiện mới ghi thêm vào `RunRecord/events.jsonl`. **Tuyệt đối cấm sửa đổi trạng thái tại chỗ (In-place Mutation)**.

### Invariant 3: Kernel Là Thẩm Quyền Cam Kết Duy Nhất (Kernel as Sole Commit Authority)
Các Subsystems (**Adapter**, **Knowledge**, **Execution**, **Verifier**) chỉ có quyền cung cấp *evidence*, *observations* hoặc *requests*. **Duy nhất Kernel mới có thẩm quyền kiểm tra policy, giải quyết quyền hạn, xác thực chuyển trạng thái và commit event vào `events.jsonl`**:
```
Adapter   ──(Tool Request)───────► ┐
Verifier  ──(Test Observation)───► ├─► [ HARNESS KERNEL ] ──(Commit Event)──► events.jsonl
Sandbox   ──(Exec Evidence)──────► ┘
```
* Cấm tuyệt đối Adapter/Verifier/Sandbox ghi trực tiếp vào `events.jsonl` hoặc tự ý thay đổi lifecycle state.

### Invariant 4: Chuẩn Hóa Băm Trạng Thái Tuyệt Đối (Canonical Fingerprinting)
Mọi chữ ký băm trạng thái phải sử dụng thuật toán chuẩn hóa (Canonicalization - sắp xếp khóa JSON theo từ điển và chuẩn hóa ngắt dòng Git):
* $\text{workspaceFingerprint} = \text{SHA256}(\text{Canonical Git Tree Object})$
* $\text{contextFingerprint} = \text{SHA256}(\text{Canonicalized JSON}(\text{ContextBundle}))$
* $\text{verificationFingerprint} = \text{SHA256}(\text{Canonicalized JSON}(\text{VerificationArtifact}))$

### Invariant 5: Phân Cấp Mức Độ Tin Cậy Của Chứng Cứ (Hierarchy of Trust)
* **`agent-reported`:** Do chính agent tự khai báo $\rightarrow$ **Untrusted (Không tin cậy)**.
* **`harness-executed`:** Do Harness Kernel tự kích hoạt và bắt log trong Sandbox $\rightarrow$ **Trusted within Harness (Tin cậy trong phạm vi Harness)**.
* **`external-attested`:** Do hệ thống CI/CD bên ngoài hoặc bên thứ ba ký số chứng thực $\rightarrow$ **Independently Attested (Chứng thực Độc lập)**.

---

## 3. SƠ ĐỒ ĐIỀU KHIỂN & VÒNG ĐỜI PHIÊN (TOPOLOGY & LIFECYCLE)

### 3.1. Kernel-Centric Topology
Harness Kernel là trung tâm điều phối trạng thái duy nhất. Các subsystem (**Knowledge**, **Execution**, **Verifier**) hoạt động như các dịch vụ dưới quyền của Kernel:

```
                      AI AGENT (Claude, Cursor, Aider, OpenCode)
                                          │
                                          ▼
                                    AGENT ADAPTER
                                          │
                                          ▼
                            ┌───────────────────────────┐
                            │      HARNESS KERNEL       │
                            │                           │
                            │ • Session & Run Manager   │
                            │ • State Machine Engine    │
                            │ • Scoped Policy Engine    │
                            │ • Capability Resolver     │
                            │ • Resource & Secret Broker│
                            │ • Checkpoint & Handoff    │
                            └─────────────┬─────────────┘
                                          │
            ┌─────────────────────────────┼─────────────────────────────┐
            ▼                             ▼                             ▼
   ┌─────────────────┐           ┌─────────────────┐           ┌─────────────────┐
   │    KNOWLEDGE    │           │    EXECUTION    │           │    VERIFIER     │
   │                 │           │                 │           │                 │
   │ ContextBundle   │           │ SandboxProvider │           │ HarnessExecuted │
   │ FailureEvidence │           │ Tool Registry   │           │ ExternalAttested│
   │ Sub-AST Graph   │           │ Secret Broker   │           │ Visual Diffs    │
   │ ADR Decisions   │           │ Shadow Git FS   │           │ Security Scans  │
   └────────┬────────┘           └────────┬────────┘           └────────┬────────┘
            │                             │                             │
            └─────────────────────────────┼─────────────────────────────┘
                                          ▼
                                   PROJECT CODEBASE
```

### 3.2. Phân Tầng Vòng Đời: Session vs. Run vs. Sandbox
Tách bạch ranh giới sở hữu vòng đời:

```
[Agent Lifecycle]     Claude Code CLI Session (Tồn tại suốt phiên làm việc của user)
                             │
[Harness Sessions]           ├── Session SES-01: Feature Authentication
                             │     ├── RUN-001 (Intent: Scaffold JWT) ────► Snapshot CP-001
                             │     ├── RUN-002 (Intent: Refresh Token) ───► Snapshot CP-002 ──► HANDOFF-001
                             │
[Sandbox Lifecycle]          └── Docker Sandbox (Sống qua nhiều Runs để giữ Cache/Dependencies)
```

---

## 4. KHÓA 6 HỢP ĐỒNG KỸ THUẬT LÕI (THE 6 LOCKED CONTRACTS)

### CONTRACT 1: `AgentAdapter` & Capability System

Tách biệt hoàn toàn giữa **Agent Features** (Đặc tính kỹ thuật của model) và **Execution Capabilities** (Quyền hạn thực thi):

```typescript
export interface AgentFeatures {
  supportsStreaming: boolean;
  supportsToolInterruption: boolean;
  supportsContextCompaction: boolean;
  supportsMcp: boolean;
  contextWindow: number;
}

export type Capability =
  | "filesystem.read"
  | "filesystem.write"
  | "terminal.exec"
  | "git.read"
  | "git.write"
  | "browser.open"
  | "browser.interact"
  | "network.http";

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
```

---

### CONTRACT 2: `SandboxProvider` & Secret Brokerage

Trừu tượng hóa môi trường thực thi; loại bỏ việc truyền raw secret qua environment:

```typescript
export interface SecretRef {
  id: string;
  envVarName: string;
  scope: string[]; // e.g. ["registry.npmjs.org"]
}

export interface SandboxEnv {
  values: Record<string, string>; // Non-sensitive values only
  secretRefs: SecretRef[];        // Managed via Secret Broker
}

export interface SandboxSpec {
  baseImage: string;
  workspaceMountPath: string;
  readOnlyPaths: string[];
  writablePaths: string[];
  environment: SandboxEnv;
  networkAllowlist: string[];
  resourceLimits: {
    cpuCores: number;
    memoryMb: number;
    timeoutSeconds: number;
  };
}

export interface SandboxProvider {
  create(spec: SandboxSpec): Promise<string>; // Returns sandboxId
  exec(sandboxId: string, command: string, args: string[]): Promise<ExecResult>;
  snapshot(sandboxId: string): Promise<string>; // Returns snapshotId
  restore(sandboxId: string, snapshotId: string): Promise<void>;
  destroy(sandboxId: string): Promise<void>;
}
```

---

### CONTRACT 3: `ContextBundle` & Provenance Schema

Cấu trúc ngữ cảnh kèm theo nguồn gốc định danh (Provenance) phục vụ kiểm toán:

```typescript
export interface ContextProvenance {
  sourceId: string;   // e.g. "ADR-008", "FAIL-042", "git:abc1234"
  sourceType: "adr" | "failure_evidence" | "code_graph" | "git_commit" | "user_intent";
  extractedAt: string;
}

export interface ContextBundle {
  runId: string;
  budget: {
    maxTokens: number;
    allocatedTokens: number;
  };
  project: {
    id: string;
    rootPath: string;
  };
  files: Array<{ path: string; content: string; hash: string }>;
  symbols: Array<{ name: string; kind: string; file: string; lineRange: [number, number] }>;
  graphNeighborhood: {
    focalSymbols: string[];
    edges: Array<{ from: string; to: string; relation: "calls" | "imports" | "implements" }>;
  };
  memories: Array<{ id: string; content: string; strength: "low" | "medium" | "high" }>;
  decisions: Array<{ id: string; title: string; status: string; path: string }>;
  failures: FailureEvidence[];
  gitContext: {
    branch: string;
    headCommit: string;
    recentDiffSummary: string;
  };
  provenance: ContextProvenance[];
}
```

---

### CONTRACT 4: `PolicyEngine` & Scoped Constraints

Ràng buộc cứng theo phạm vi (Scopes) và kịch bản kiểm chứng theo loại nhiệm vụ:

```typescript
export type VerificationStrategy = 
  | "tdd_red_green" 
  | "regression_first" 
  | "visual_regression" 
  | "behavioral_invariance" 
  | "dry_run_validation";

export interface PolicyScope {
  paths?: string[];          // e.g. ["src/ui/**", "src/components/**"]
  taskTypes?: string[];      // e.g. ["feature", "refactor"]
  environments?: string[];   // e.g. ["local_docker", "ci"]
  agentIds?: string[];       // e.g. ["claude-code", "cursor"]
}

export interface PolicyRule {
  id: string;
  scope: PolicyScope;
  denyImports?: string[];    // e.g. ["prisma", "pg"] in UI scope
  enforcedStrategy?: VerificationStrategy;
  requiredGates?: string[];
}

export interface PolicyEngine {
  evaluatePreAction(action: AgentAction, scope: PolicyScope): PolicyDecision;
  evaluatePostAction(observation: ActionObservation, scope: PolicyScope): PolicyDecision;
  resolveVerificationStrategy(taskType: string): VerificationStrategy;
}
```

---

### CONTRACT 5: `RunRecord` & Secret Redaction Layer

Mọi hành động và output đều được lọc qua **Secret Redaction Layer** trước khi lưu vào `RunRecord`:

```
.harness/runtime/runs/RUN-042/
├── intent.md                  # Đề bài và mục tiêu
├── plan.json                  # DAG + Acceptance Criteria
├── agent.json                 # Model, Adapter ID, Usage metrics
├── environment.json           # Container digest, Tool versions
├── context.json               # ContextBundle + Provenance
├── events.jsonl               # State Machine events (Append-only, Redacted)
├── tool-calls.jsonl           # In/Out của tool execution (Redacted)
├── patches/
│   └── changes.patch          # Unified Diff
├── verification.json          # Chứng cứ kiểm thử độc lập
├── checkpoint.json            # Snapshot Reference (CP-042)
└── result.json                # Status, Metrics, Duration
```

---

### CONTRACT 6: `HandoffPackage` & Canonical Fingerprinting

Gói bàn giao có chữ ký băm chuẩn hóa để phát hiện trạng thái lỗi thời (Stale Handoff):

```typescript
export interface HandoffPackage {
  handoffId: string;
  sourceRunId: string;
  sourceSessionId: string;
  sourceCheckpointId: string;
  generatedAt: string;
  
  // Canonical Fingerprints để phát hiện Repo bị sửa đổi ngoài Harness
  fingerprints: {
    contextFingerprint: string;       // SHA256 of Canonical ContextBundle
    workspaceFingerprint: string;     // SHA256 of Canonical Git Tree
    verificationFingerprint: string;  // SHA256 of Canonical Verification Artifact
  };

  summary: string;
  currentState: string;
  changedFiles: Array<{ path: string; status: "modified" | "added" | "deleted" }>;
  knownIssues: string[];
  unresolvedItems: string[];
  relevantMemoryIds: string[];
  verificationProof: {
    level: "harness-executed" | "external-attested";
    passedGates: string[];
    timestamp: string;
  };
  nextRecommendedActions: string[];
}
```

---

## 5. KHO TRI THỨC: BẰNG CHỨNG THỰC NGHIỆM (EMPIRICAL FAILURE MEMORY)

File `.harness/knowledge/failures/FAIL-042.json` tích hợp vòng đời tri thức (`supersededBy`):

```json
{
  "id": "FAIL-042",
  "timestamp": "2026-08-18T20:35:00Z",
  "task": "checkout-concurrency-handling",
  "evidenceStrength": "high",
  "verifiedAt": "2026-08-18T20:34:20Z",
  "supersededBy": null,
  "evidence": {
    "runId": "RUN-041",
    "failingTests": ["tests/concurrency/test_double_charge.py"],
    "observedSymptom": "Postgres Deadlock under concurrent load"
  },
  "scope": {
    "framework": "fastapi",
    "database": "postgresql",
    "domain": "checkout"
  },
  "failedHypothesis": "Application-level retry with exponential backoff",
  "rootCause": "Cascading retries exhausted connection pool in async loop",
  "lesson": "Consider database-level advisory locks or Redis Redlock for checkout critical sections.",
  "doNotRepeatWhen": [
    "high_concurrency_checkout",
    "atomic_wallet_deduction"
  ]
}
```

---

## 6. HARNESS KERNEL STATE MACHINE (12 TRẠNG THÁI HOÀN CHỈNH)

```
                            ┌─────────────┐
                            │  RECEIVED   │
                            └──────┬──────┘
                                   │
                                   ▼
                            ┌─────────────┐
                            │   PLANNED   │
                            └──────┬──────┘
                                   │
                                   ▼
                            ┌─────────────┐
                            │ AUTHORIZED  │
                            └──────┬──────┘
                                   │
              ┌────────────────────┼────────────────────┐
              │                    ▼                    │
              │             ┌─────────────┐             │
              │             │  EXECUTING  │◄────────────┼────────────┐
              │             └──────┬──────┘             │            │
              │                    │                    │            │
              │                    ▼                    │            │
              │             ┌─────────────┐             │            │
              │             │  VERIFYING  │             │            │
              │             └──────┬──────┘             │            │
              │                    │                    │            │
              │        ┌───────────┴───────────┐        │            │
              │        ▼                       ▼        │            │
              │   [PASS PROOF]            [FAIL PROOF]  │            │
              │        │                       │        │            │
              │        │                       ▼        │            │
              │        │                ┌─────────────┐ │            │
              │        │                │   RECOVER   │─┘ (Retry < N)│
              │        │                └──────┬──────┘              │
              │        │                       │ (Exceeded)          │
              │        │                       ▼                     │
              │        │                ┌─────────────┐              │
              │        │                │   BLOCKED   │              │
              │        │                └─────────────┘              │
              ▼        ▼                                             │
         [User Stop] [Timeout]                                       │
              │        │                                             │
              ▼        ▼                                             │
      ┌──────────┐ ┌─────────┐                                       │
      │CANCELLED │ │ EXPIRED │                                       │
      └──────────┘ └─────────┘                                       │
              │        │                                             │
              ▼        ▼                                             │
         ┌───────────┐ ┌─────────────┐                               │
         │  PAUSED   │ │ INTERRUPTED │───────────────────────────────┘
         └───────────┘ └─────────────┘ (Resume with Checkpoint)
                               │
                               ▼
                        ┌─────────────┐
                        │  COMPLETED  │ (Artifact: CP-XXX, HANDOFF-XXX)
                        └─────────────┘
```

---

## 7. MA TRẬN PHÂN CHIA THƯ MỤC `.harness/`

| Đường dẫn thư mục | Bản chất (Nature) | Hành vi Git (Git Behavior) | Mô tả mục đích |
| :--- | :--- | :--- | :--- |
| `.harness/spec/` | **Portable** | **Commit 100%** | Manifest, Environment specs, Capabilities, Policies, Skills, Verifiers. |
| `.harness/knowledge/` | **Portable** | **Commit 100%** | ADR Decisions, Failure Evidence JSONs, Segmented Code Graph Index. |
| `.harness/runtime/` | **Ephemeral / Local** | **Gitignored** | Runs (`RUN-XXX`), Handoffs (`HANDOFF-XXX`), Snapshots, Logs, Local Providers. |

---

## 8. KẾ HOẠCH TRIỂN KHAI 6 PHA (STATUS: 100% COMPLETED)

```
[PHA 1: PURE DOMAIN CORE] ──────────► [COMPLETED 100%] (14/14 tests pass)
  ├── @dev-harness/spec: 6 Locked Contracts
  └── @dev-harness/kernel: StateMachine, CapabilityResolver, PolicyEvaluator, Hasher, EventStore

[PHA 2: LOCAL INFRASTRUCTURE & CONTEXT] ► [COMPLETED 100%] (22/22 tests pass)
  └── @dev-harness/infrastructure: FileRunStore, Shadow Git, ContextEngine (100% Provenance), FailureMemoryLoader

[PHA 3: SANDBOX & VERIFIER] ────────► [COMPLETED 100%] (30/30 tests pass)
  ├── @dev-harness/sandbox: LocalProcessSandboxProvider, DockerSandboxProvider
  ├── @dev-harness/security: SecretBroker (Scoped tokens), NetworkPolicyEvaluator
  └── @dev-harness/verifier: VerifierRunner (harness-executed trust level), GateEvaluator

[PHA 4: CHECKPOINT & HANDOFF] ──────► [COMPLETED 100%] (33/33 tests pass)
  └── @dev-harness/infrastructure/handoff: CheckpointManager, HandoffManager (3 Fingerprints), HandoffValidator

[PHA 5: PRODUCTION AGENT ADAPTERS] ─► [COMPLETED 100%] (36/36 tests pass)
  └── @dev-harness/adapters: ClaudeCodeAdapter, CursorAiderAdapter, ProgrammaticMockAdapter

[PHA 6: E2E CONFORMANCE TEST SUITE] ─► [COMPLETED 100%] (37/37 tests pass)
  └── tests/conformance/cross-agent-handoff.e2e.test.ts:
      Claude (RUN-001) ──► HANDOFF-001 ──► Cursor (RUN-002) Verified 100%!
```
