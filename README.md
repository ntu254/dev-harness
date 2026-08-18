# 🏛️ DEV-HARNESS

> **The Distributed & Portable Runtime Specification for AI Software Engineering**  
> *"One workspace. Any agent. Reproducible multi-agent software development."*

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/ntu254/dev-harness)
[![Tests](https://img.shields.io/badge/tests-55%20passed-success.svg)](https://github.com/ntu254/dev-harness)
[![Specification](https://img.shields.io/badge/spec-v2.0.0--spec-blue.svg)](./DEV_HARNESS_SPEC_v2.0_PLAN.md)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)

---

## 💡 What is DEV-HARNESS?

**DEV-HARNESS** is not an AI coding model, IDE, or SaaS wrapper. It is the **foundational distributed execution runtime and portable workspace specification** that sits between arbitrary AI software agents (Claude Code, Cursor, Aider, OpenCode, Google Antigravity, local LLMs) and project codebases.

DEV-HARNESS guarantees that AI agents execute within strict capability boundaries, retrieve auditable context with 100% provenance and Sub-AST code graph neighborhoods, collaborate concurrently via isolated Git worktrees with 3-way semantic merging, prove code changes via sandboxed verification, and leave behind cryptographic handoff packages so other agents can resume work with **zero state loss**.

```
                   ┌──────────────────────────────────────────────────────────┐
                   │               AI AGENTS & MULTI-AGENT SWARMS             │
                   │                                                          │
                   │  Claude Code │ Cursor │ Antigravity │ Aider │ Ollama/vLLM│
                   └────────────────────────────┬─────────────────────────────┘
                                                │ (MCP Protocol & Adapters)
                                                ▼
                   ┌──────────────────────────────────────────────────────────┐
                   │             DEV-HARNESS v2.0 KERNEL ENGINE               │
                   │                                                          │
                   │  • Sole Commit Authority (Append-Only Event Sourcing)    │
                   │  • 12-State Finite State Machine (FSM)                   │
                   │  • Multi-Worktree Concurrency & 3-Way Semantic Merging   │
                   │  • Dynamic Model Router (Cost vs Reasoning Optimizer)    │
                   │  • Active Sub-AST Code Graph & SQLite-Vec Index          │
                   │  • Automated Failure Synthesizer (Auto FAIL-XXX on crash)│
                   │  • Checkpoint & Sealed Cross-Agent Handoff Packages      │
                   └────────────────────────────┬─────────────────────────────┘
                                                │
             ┌──────────────────────────────────┼──────────────────────────────────┐
             ▼                                  ▼                                  ▼
   ┌───────────────────┐              ┌───────────────────┐              ┌───────────────────┐
   │ KNOWLEDGE GRAPH   │              │ EXECUTION SANDBOX │              │ VERIFIER & UI     │
   │                   │              │                   │              │                   │
   │ Sub-AST Parser    │              │ Local & Docker    │              │ HarnessExecuted   │
   │ Vector Embeddings │              │ Git Worktrees     │              │ Real-Time Web UI  │
   │ Failure Memories  │              │ Scoped Secrets    │              │ MCP Stdio Server  │
   │ ADR Decisions     │              │ Timeout Killing   │              │ TDD Red-Green Gate│
   └─────────┬─────────┘              └─────────┬─────────┘              └─────────┬─────────┘
             │                                  │                                  │
             └──────────────────────────────────┼──────────────────────────────────┘
                                                ▼
                                         PROJECT CODEBASE
```

---

## ✨ 6 Core Primitives of DEV-HARNESS

```
                       ┌────────────────────────┐
                       │          RUN           │  (Atomic Task Unit)
                       └───────────┬────────────┘
                                   │
        ┌──────────────────────────┼──────────────────────────┐
        ▼                          ▼                          ▼
 ┌─────────────┐            ┌─────────────┐            ┌─────────────┐
 │   CONTEXT   │            │   POLICY    │            │  EXECUTION  │
 │ (AST Graph  │            │ (Scoped     │            │ (Worktree & │
 │  Provenance)│            │  Hard Gates)│            │  Sandboxes) │
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

1. **Monotonic Capability Restriction:** $\text{EffectiveCapabilities} = \text{Agent} \cap \text{Task} \cap \text{Policy} \cap \text{Sandbox}$. Capabilities only ever narrow down.
2. **Append-Only Event Sourcing:** All state changes are committed as immutable events in `events.jsonl`. In-place mutations are strictly forbidden.
3. **Kernel as Sole Commit Authority:** Subsystems provide evidence and requests; only the Kernel has authority to transition lifecycle states.
4. **Canonical 3-Fingerprint Signatures:** Every handoff is cryptographically sealed with SHA-256 hashes of the Git tree, ContextBundle, and VerificationProof.
5. **Hierarchy of Trust:**
   * `agent-reported` $\rightarrow$ **Untrusted**
   * `harness-executed` $\rightarrow$ **Trusted within Harness**
   * `external-attested` $\rightarrow$ **Independently Attested**

---

## 📦 Monorepo Architecture

| Package | Path | Description |
| :--- | :--- | :--- |
| **`@dev-harness/spec`** | `packages/spec` | Standard TypeScript contracts & type definitions. |
| **`@dev-harness/kernel`** | `packages/kernel` | Pure Domain Core: 12-state FSM, Capability Resolver, Policy Evaluator, Hasher, EventStore. |
| **`@dev-harness/infrastructure`** | `packages/infrastructure` | FileRunStore, Shadow Git, ContextEngine, FailureMemoryLoader, HandoffManager, Swarm Concurrency. |
| **`@dev-harness/sandbox`** | `packages/sandbox` | `LocalProcessSandboxProvider` & `DockerSandboxProvider` with defense-in-depth isolation. |
| **`@dev-harness/security`** | `packages/security` | `SecretBroker` (Scoped credential resolution) & `NetworkPolicyEvaluator` (Egress whitelist). |
| **`@dev-harness/verifier`** | `packages/verifier` | `VerifierRunner` (Sandboxed test runner) & `GateEvaluator` (TDD Red-Green evaluation). |
| **`@dev-harness/adapters`** | `packages/adapters` | Adapters for `ClaudeCode`, `Cursor`, `OllamaLocal` (100% offline), and `DeepSeekReasoning`. |
| **`@dev-harness/graph`** | `packages/graph` | Sub-AST Code Graph Parser, `SemanticVectorIndex` (Cosine similarity), and `AutoFailureSynthesizer`. |
| **`@dev-harness/mcp-server`** | `packages/mcp-server` | Official Model Context Protocol (MCP) JSON-RPC Server with 8 core tools. |
| **`@dev-harness/router`** | `packages/router` | Dynamic Model Router & `CostBudgetOptimizer` (saves >50%-70% token cost). |
| **`@dev-harness/ui`** | `packages/ui` | Embedded Real-Time Web Observer Dashboard & REST APIs. |
| **`dev-harness`** | `packages/cli` | Production CLI binary tool (`dev-harness init`, `run`, `status`, `mcp`, `ui`). |

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

### 2. Run Complete Test Suite (55 Tests Across 22 Suites)
```bash
npm test
```

### 3. Initialize Workspace
```bash
node packages/cli/bin/dev-harness.js init
```

### 4. Execute Tasks with Agent Routing
```bash
node packages/cli/bin/dev-harness.js run "Scaffold JWT authentication module" --agent claude-code
```

### 5. Launch Real-Time Web Observer Dashboard
```bash
node packages/cli/bin/dev-harness.js ui --port 4000
# Open http://localhost:4000 in your browser!
```

### 6. Start Official MCP Server (Connect to Claude Desktop, Cursor, Antigravity)
```bash
node packages/cli/bin/dev-harness.js mcp
```

Add to your `mcp_config.json`:
```json
{
  "mcpServers": {
    "dev-harness": {
      "command": "node",
      "args": ["E:/conducting-ai/packages/cli/bin/dev-harness.js", "mcp"]
    }
  }
}
```

---

## 🤝 Multi-Agent Swarm Concurrency in Action

```
                     STEP 1: SWARM COORDINATOR DISPATCHES TASKS
  $ dev-harness run "Build payment & auth modules in parallel"
                                   │
             ┌─────────────────────┴─────────────────────┐
             ▼                                           ▼
   [WORKER 1: FRONTEND]                        [WORKER 2: BACKEND]
   • Worktree: WT-worker-auth                  • Worktree: WT-worker-payment
   • Writes: src/auth.ts                       • Writes: src/payment.ts
             │                                           │
             └─────────────────────┬─────────────────────┘
                                   ▼
                     [PEER-REVIEW CONSENSUS GATE]
                     • Static security check -> [APPROVED]
                                   ▼
                     [3-WAY SEMANTIC MERGE RESOLVER]
                     • Clean non-conflicting merge into main
                     • Verifier tests pass (100%)
                     • Outputs: HANDOFF-001 (CP-001)
```

---

## 📖 Technical Specifications & Plans

* **v1.0 Specification:** [DEV_HARNESS_SPEC_v1.0.md](./DEV_HARNESS_SPEC_v1.0.md)
* **v2.0 Architectural Roadmap:** [DEV_HARNESS_SPEC_v2.0_PLAN.md](./DEV_HARNESS_SPEC_v2.0_PLAN.md)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
