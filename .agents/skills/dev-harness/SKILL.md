---
name: dev-harness
description: >-
  Executes, verifies, and manages tasks using the DEV-HARNESS runtime specification.
  Use when initializing a repository, adhering to .harness/ policies, loading empirical
  failure memories (FAIL-XXX), creating checkpoint snapshots, and generating cross-agent
  handoff packages (HANDOFF-XXX).
---

# DEV-HARNESS Agent Skill for Antigravity

This skill enables Antigravity to seamlessly integrate with and execute tasks under the **DEV-HARNESS v1.0** portable execution runtime.

---

## 1. When to Activate This Skill

Activate this skill whenever:
- The user asks to initialize or manage a project with DEV-HARNESS.
- Working inside a repository that contains a `.harness/` directory.
- Running tasks with independent verification, TDD enforcement, or creating/validating cross-agent handoffs (`HANDOFF-XXX`).
- Consulting past failure memories (`.harness/knowledge/failures/`) or architectural decisions (`.harness/knowledge/decisions/`).

---

## 2. Core Workflow for Antigravity

When executing a task inside a DEV-HARNESS workspace:

```
                  ┌─────────────────────────────────────────┐
                  │ 1. CHECK CONTEXT & KNOWLEDGE            │
                  │    • Read .harness/knowledge/decisions/ │
                  │    • Query .harness/knowledge/failures/ │
                  └────────────────────┬────────────────────┘
                                       │
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │ 2. VALIDATE PREVIOUS HANDOFF (IF ANY)   │
                  │    • Check .harness/runtime/handoffs/   │
                  │    • Detect if code drifted (STALE)     │
                  └────────────────────┬────────────────────┘
                                       │
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │ 3. EXECUTE WITHIN POLICY BOUNDARIES     │
                  │    • Respect scoped policies in         │
                  │      .harness/spec/policies/            │
                  │    • Enforce TDD Red -> Green           │
                  └────────────────────┬────────────────────┘
                                       │
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │ 4. INDEPENDENT VERIFICATION & HANDOFF   │
                  │    • Run tests in sandbox               │
                  │    • Output VerificationProof           │
                  │    • Create Checkpoint & HANDOFF-XXX    │
                  └─────────────────────────────────────────┘
```

---

## 3. CLI Commands Reference

You can execute DEV-HARNESS commands via terminal:

```bash
# Check repository status and handoff validity
node packages/cli/bin/dev-harness.js status

# Initialize DEV-HARNESS in a new project
node packages/cli/bin/dev-harness.js init

# Execute a task under Harness Kernel control
node packages/cli/bin/dev-harness.js run "<task intent>" --agent claude-code
```

---

## 4. Key Rules to Always Follow

1. **Failure Memory Respect:** If a relevant `FAIL-XXX.json` exists in `.harness/knowledge/failures/`, do NOT attempt the failed hypothesis described unless explicitly superseded.
2. **Provenance Accountability:** All context, decisions, and evidence must be traced back to their source ID.
3. **Proof Over Claims:** Never claim a task is complete without running the verifier suite (`harness-executed`).
