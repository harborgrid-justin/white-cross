# Agent Specifications Directory

This folder contains domain‑specific agent definition files used to guide automated or semi‑automated expertise for the White Cross platform.

## Purpose
Each `*-architect.md` file describes:
- Domain responsibilities & expertise scope
- Operational workflow (planning → execution → validation → completion)
- Required tracking artifacts in `.temp/`
- Quality standards, review process, and edge cases

## Canonical Orchestration Reference
All agents MUST follow the coordination model in `_standard-orchestration.md`.

**CRITICAL REQUIREMENT**: After any significant action you MUST batch‑update all four core tracking documents: `task-status-*.json`, `progress-*.md`, `checklist-*.md`, and `plan-*.md`. Never update only one. See `_standard-orchestration.md` for triggers, completion protocol, and anti‑patterns.

## Creating a New Agent
1. Copy an existing agent file as a starting point (closest domain fit).
2. Add or refine domain-specific sections (responsibilities, patterns, examples).
3. Insert an "Orchestration Capabilities & Mandatory Document Synchronization" section if not present, including a reference to `_standard-orchestration.md`.
4. Ensure the **CRITICAL REQUIREMENT** sentence is verbatim:
   > **CRITICAL REQUIREMENT**: Update ALL relevant documents simultaneously after every significant action. Never update just one file. Canonical orchestration reference: `_standard-orchestration.md`.
5. Commit the new agent along with any initial tracking artifacts (if starting a multi‑phase initiative).

## When to Use Full vs Lightweight Tracking
| Scenario | Mode | Required Files |
|----------|------|----------------|
| Large refactor / multi-domain initiative | Full | task-status, plan, checklist, progress, architecture-notes |
| Single component/style fix | Lightweight | progress, checklist |
| Performance campaign (multi metrics) | Full | All tracking files |
| One migration tweak | Lightweight | progress, checklist |
| Schema evolution / association redesign | Full | All tracking files |

Escalate to Full mode immediately if task scope expands or cross‑agent dependencies emerge.

## Linting & Compliance
A script (`scripts/lint-agent-orchestration.js`) can be run to detect missing template references or absent CRITICAL REQUIREMENT phrasing. Non‑compliant files should be patched promptly.

## Common Quality Standards Across Agents
- Security, privacy, and HIPAA compliance baked in for healthcare domains.
- Performance awareness (avoid regressions; measure before optimize).
- Documentation clarity (examples + rationale, not just rules).
- Consistent synchronization of tracking artifacts.
- Explicit decision logging (timestamp + rationale + referenced work).

## Anti‑Patterns
| Anti‑Pattern | Risk | Fix |
|--------------|------|-----|
| Updating only checklist | Divergent state | Batch update all docs |
| Missing `_standard-orchestration.md` link | Inconsistent coordination | Add reference in orchestration section |
| No decision rationale | Poor audit trail | Include `rationale` field in decision log |
| Orphaned cross-agent reference | Confusion / stale dependency | Remove or update path |
| Skipping completion summary | Loss of historical context | Create `completion-summary-*.md` pre‑archive |

## Completion Flow Reminder
1. Validate all checklist items.
2. Final metrics / deltas recorded in `progress-*.md`.
3. Create `completion-summary-*.md` citing all decisions & artifacts.
4. Move all initiative files to `.temp/completed/`.
5. Confirm no active agent depends on archived paths.

---
Maintaining rigorous, uniform agent specs ensures predictable automation, high auditability, and reduced coordination friction across the White Cross platform.
