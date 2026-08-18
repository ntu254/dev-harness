# DEV-HARNESS Rules for Antigravity

This repository uses **DEV-HARNESS v1.0** (The Portable Runtime & Workspace Specification for AI Software Agents).

---

## 🏛️ Autonomous Agent Guidelines

When operating in this workspace:

1. **Check Failure Memories First:**
   * Before fixing a bug or implementing a critical feature, inspect `.harness/knowledge/failures/` to avoid repeating previously failed hypotheses.
   
2. **Adhere to Architecture Decisions (ADRs):**
   * Consult `.harness/knowledge/decisions/` before modifying database access patterns, API architectures, or core infrastructure.

3. **Enforce Verification Before Claiming Done:**
   * Always verify code changes with the test runner (`npm test` or sandbox verifier).
   * Ensure any new feature follows the scoped verification policy (e.g. TDD Red $\rightarrow$ Green).

4. **Preserve Cross-Agent Continuity:**
   * When concluding significant milestones, ensure a Checkpoint snapshot (`CP-XXX`) and Handoff package (`HANDOFF-XXX`) are created in `.harness/runtime/` so subsequent agents can seamlessly resume.
