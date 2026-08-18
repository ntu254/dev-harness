# 🏛️ DEV-HARNESS

> **The Portable Runtime & Workspace Specification for AI Software Agents**  
> *"One workspace. Any agent. Reproducible software development."*

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/ntu254/dev-harness)
[![Tests](https://img.shields.io/badge/tests-37%20passed-success.svg)](https://github.com/ntu254/dev-harness)
[![Specification](https://img.shields.io/badge/spec-v1.0.0--spec-blue.svg)](./DEV_HARNESS_SPEC_v1.0.md)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)

---

## 💡 What is DEV-HARNESS?

**DEV-HARNESS** is not another AI coding model, IDE, or closed SaaS wrapper. It is the **foundational execution runtime and portable workspace specification** that sits between arbitrary AI software agents (Claude Code, Cursor, Aider, OpenCode, local LLMs) and project codebases.

DEV-HARNESS guarantees that any AI agent entering a repository executes within strict security boundaries, retrieves auditable context with 100% provenance, proves code changes via independent sandboxed verification, and leaves behind cryptographic handoff packages so another agent can resume work with **zero state loss**.

```
                   ┌─────────────────────────────────────────┐
                   │               AI AGENTS                 │
                   │                                         │
                   │  Claude Code │ Cursor │ Aider │ OpenCode│
                   └────────────────────┬────────────────────┘
                                        │
                                        ▼
                   ┌─────────────────────────────────────────┐
                   │              AGENT ADAPTER              │
                   └────────────────────┬────────────────────┘
                                        │
                                        ▼
                   ┌─────────────────────────────────────────┐
                   │             HARNESS KERNEL              │
                   │                                         │
                   │  • Sole Commit Authority (Append-Only)  │
                   │  • 12-State Finite State Machine        │
                   │  • Monotonic Capability Resolver        │
                   │  • Scoped Policy Engine (Deny Rules)    │
                   │  • Secret Broker & Redaction Layer      │
                   │  • Checkpoint & Cross-Agent Handoff     │
                   └────────────────────┬────────────────────┘
                                        │
             ┌──────────────────────────┼──────────────────────────┐
             ▼                          ▼                          ▼
   ┌───────────────────┐      ┌───────────────────┐      ┌───────────────────┐
   │ KNOWLEDGE SYSTEM  │      │ EXECUTION SYSTEM  │      │  VERIFIER SYSTEM  │
   │                   │      │                   │      │                   │
   │ ContextBundle     │      │ SandboxProvider   │      │ HarnessExecuted   │
   │ 100% Provenance   │      │ Local & Docker    │      │ TDD Red-Green Gate│
   │ Failure Evidence  │      │ Read-Only Mounts  │      │ Regression Gates  │
   │ ADR Decisions     │      │ Timeout Enforcer  │      │ Trust Hierarchy   │
   └─────────┬─────────┘      └─────────┬─────────┘      └─────────┬─────────┘
             │                          │                          │
             └──────────────────────────┼──────────────────────────┘
                                        ▼
                                 PROJECT CODEBASE
```

---

## ✨ The 6 Core Primitives

DEV-HARNESS standardizes agent development around **6 first-class primitives**:

```
                       ┌────────────────────────┐
                       │          RUN           │  (Atomic Task Unit)
                       └───────────┬────────────┘
                                   │
        ┌──────────────────────────┼──────────────────────────┐
        ▼                          ▼                          ▼
 ┌─────────────┐            ┌─────────────┐            ┌─────────────┐
 │   CONTEXT   │            │   POLICY    │            │  EXECUTION  │
 │ (100%       │            │ (Scoped     │            │ (Sandboxed  │
 │  Provenance)│            │  Hard Gates)│            │  Isolation) │
 └──────┬──────┘            └──────┬──────┘            └──────┬──────┘
        │                          │                          │
        └──────────────────────────┼──────────────────────────┘
                                   ▼
                            ┌─────────────┐
                            │  RESOURCE   │  (Budgets, Egress, Secrets)
                            └──────┬──────┘
                                   │
                                   ▼
                            ┌─────────────┐
                            │    PROOF    │  (Attested Verification)
                            └──────┬──────┘
                                   │
                                   ▼
                            ┌─────────────┐
                            │   HANDOFF   │  (Canonical Fingerprints)
                            └─────────────┘
```

---

## 🛡️ 5 Architectural Invariants

1. **Monotonic Capability Restriction:** $\text{EffectiveCapabilities} = \text{Agent} \cap \text{Task} \cap \text{Policy} \cap \text{Sandbox}$. Capabilities only ever narrow down; no downstream tool can expand permissions.
2. **Append-Only Event Sourcing:** All state changes are committed as immutable events in `events.jsonl`. In-place state mutations are prohibited.
3. **Kernel as Sole Commit Authority:** Subsystems provide evidence, requests, and observations; only the Kernel has authority to transition states.
4. **Canonical 3-Fingerprint Signatures:** Every handoff is cryptographically sealed with SHA-256 hashes of the Git tree, ContextBundle, and VerificationProof.
5. **Hierarchy of Trust:**
   * `agent-reported` $\rightarrow$ **Untrusted**
   * `harness-executed` $\rightarrow$ **Trusted within Harness**
   * `external-attested` $\rightarrow$ **Independently Attested**

---

## 📁 Portable vs. Ephemeral Workspace Specification

```
.harness/
├── spec/                           # [PORTABLE - COMMIT TO GIT]
│   ├── manifest.json               # Specification version and engine requirements
│   ├── environment.json            # Base container image, toolchains, resource limits
│   └── policies/                   # Scoped enforcement rules (TDD, architectural boundaries)
│
├── knowledge/                      # [PORTABLE - COMMIT TO GIT]
│   ├── decisions/                  # Architecture Decision Records (ADR-001.md)
│   └── failures/                   # Structured Empirical Failure Memory (FAIL-001.json)
│
└── runtime/                        # [EPHEMERAL - GITIGNORED]
    ├── runs/                       # Detailed audit records for every run (RUN-XXX/)
    ├── handoffs/                   # Sealed cross-agent handoff packages (HANDOFF-XXX/)
    └── checkpoints/                # Snapshot metadata for rollbacks and diffs (CP-XXX/)
```

---

## 📦 Monorepo Packages

| Package | Path | Description |
| :--- | :--- | :--- |
| **`@dev-harness/spec`** | `packages/spec` | Standard TypeScript contracts & type definitions. |
| **`@dev-harness/kernel`** | `packages/kernel` | Pure Domain Core: 12-state FSM, Capability Resolver, Policy Evaluator, Hasher, EventStore. |
| **`@dev-harness/infrastructure`** | `packages/infrastructure` | FileRunStore, Shadow Git Workspace, ContextEngine (100% Provenance), FailureMemoryLoader, HandoffManager. |
| **`@dev-harness/sandbox`** | `packages/sandbox` | `LocalProcessSandboxProvider` & `DockerSandboxProvider` (Defense-in-depth security flags). |
| **`@dev-harness/security`** | `packages/security` | `SecretBroker` (Scoped credential resolution) & `NetworkPolicyEvaluator` (Egress whitelist). |
| **`@dev-harness/verifier`** | `packages/verifier` | `VerifierRunner` (Sandboxed test runner) & `GateEvaluator` (TDD Red-Green evaluation). |
| **`@dev-harness/adapters`** | `packages/adapters` | Adapters for `ClaudeCodeAdapter`, `CursorAiderAdapter`, and `ProgrammaticMockAdapter`. |
| **`dev-harness`** | `packages/cli` | Production CLI binary tool (`dev-harness init`, `run`, `status`). |

---

## 🚀 Quickstart

### Prerequisites
* Node.js $\ge 20.0.0$
* npm $\ge 10.0.0$

### 1. Install & Build
```bash
git clone https://github.com/ntu254/dev-harness.git
cd dev-harness
npm install
npm run build
```

### 2. Run Test Suite
Execute the entire test suite across all 7 packages (including Invariant Tests and E2E Conformance Tests):
```bash
npm test
```

### 3. Initialize a Repository with DEV-HARNESS
```bash
node packages/cli/bin/dev-harness.js init
```

### 4. Execute a Task with an AI Agent
```bash
node packages/cli/bin/dev-harness.js run "Scaffold JWT authentication module" --agent claude-code
```

### 5. Check Workspace & Handoff Status
```bash
node packages/cli/bin/dev-harness.js status
```

---

## 🤝 Cross-Agent Handoff in Action

```
                    STEP 1: CLAUDE CODE EXECUTES RUN-001
  $ dev-harness run "Implement login feature" --agent claude-code
                                   │
                                   ▼
                     Outputs: HANDOFF-001 (CP-001)
     • Tree Fingerprint: c21554eb56bde126...
     • Verification Proof: harness-executed (100% tests passed)
     • Next Recommended Action: "Implement refresh token rotation"
                                   │
                                   ▼
                    STEP 2: CURSOR RESUMES RUN-002
  $ dev-harness run "Implement refresh token rotation" --agent cursor-aider
                                   │
                                   ▼
     • Cursor validates HANDOFF-001 -> Status: [HANDOFF_VALID]
     • Cursor implements rotation feature -> Verifier tests pass
     • Cursor outputs: HANDOFF-002 (CP-002)
```

> [!NOTE]
> If any files are modified outside of DEV-HARNESS between handoffs, the `HandoffValidator` automatically flags `HANDOFF_STALE`, preventing the next agent from blindly operating on drifted code!

---

## 📖 Complete Technical Specification

For the in-depth system architecture, formal schemas, and design invariants, read the [DEV-HARNESS v1.0 Technical Specification](./DEV_HARNESS_SPEC_v1.0.md).

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
