---
name: _standard-orchestration
summary: Canonical multi-agent coordination & synchronization template
---

# Standard Orchestration & Document Synchronization Template

**CRITICAL REQUIREMENT**: Update ALL relevant tracking documents simultaneously after EVERY significant action. Never update just a single file.

Use this file as the authoritative reference for the orchestration sections embedded in individual agent specs. Link to it from each agent's "Orchestration Capabilities" section.

## Required Tracking Files (Full Mode)
| File | Example | Purpose |
|------|---------|---------|
| Task Status | `task-status-AB12C3.json` | Workstreams, decisions, cross-agent refs |
| Plan | `plan-AB12C3.md` | Phases, scope, deliverables, risks |
| Checklist | `checklist-AB12C3.md` | Actionable items & completion tracking |
| Progress | `progress-AB12C3.md` | Narrative status, blockers, next steps |
| Architecture Notes | `architecture-notes-AB12C3.md` | Structural & integration decisions |
| Completion Summary | `completion-summary-AB12C3.md` | Final consolidated report before archival |

First agent for a NEW initiative MAY use base names without an ID; subsequent / parallel agents MUST use a unique 6‑character alphanumeric ID (A–Z, 0–9).

## Before Starting Work
1. Scan `.temp/` for existing planning/tracking artifacts.
2. Choose a unique 6-character ID if similar artifacts exist.
3. Reference related agent files explicitly (avoid siloed decisions).

## Mandatory Simultaneous Update Triggers
Update ALL (task-status, progress, checklist, plan) whenever ANY occurs:
1. New phase or workstream starts.
2. Checklist item completed or scope changes.
3. Architectural / design decision taken.
4. Blocker discovered or resolved.
5. Cross-agent dependency added/updated.
6. Audit / benchmark / test suite result recorded.
7. Transition to validation, completion, or archival.

## Consistency Verification Pass
After each update batch:
- Plan current phase matches progress narrative.
- Checklist completion reflects progress and decisions.
- Task status decisions appear in progress with rationale.
- Cross-agent references resolve (no orphaned paths).
- Architecture notes reflect latest structural changes.

## Decision Log Entry (task-status JSON)
```json
{
  "timestamp": "2025-11-07T12:34:56.000Z",
  "decision": "Adopt ITCSS + Tailwind hybrid for scalable theming",
  "rationale": "Reduces specificity conflicts; unifies tokens",
  "referencedAgentWork": ".temp/plan-AB12C3.md"
}
```

## Lightweight vs Full Mode
Use FULL mode for multi-domain, systemic, or high-impact changes (architecture shifts, migrations, performance campaigns). LIGHTWEIGHT mode (often only `progress` + `checklist`) permitted for small, isolated tasks (single component refactor, one migration tweak). Escalate to FULL if scope grows.

## Completion Protocol
1. All checklist items validated (tests / audits passing).
2. Final summary appended to `progress-*.md` (metrics deltas, decisions, residual risks).
3. Create `completion-summary-*.md` referencing EVERY related file.
4. Move all tracking artifacts for the initiative into `.temp/completed/`.
5. Ensure no active files reference outdated paths.

## Cross-Agent Integration Guidelines
- Explicitly cite upstream/downstream agent artifacts (e.g., performance plan, accessibility audit, component taxonomy).
- Prefer additive changes over silent overwrites; log any divergent decisions.
- Record dependency impacts (e.g., schema change affecting API / state layer).

## Quality Gates
- Synchronization check passes (no partial updates).
- Decision entries present for all structural or strategic shifts.
- Architecture notes explain rationale (not just outcomes).
- Completion summary includes metrics, diffs, and follow-up recommendations.

## Anti-Patterns (Avoid)
| Issue | Why Bad | Remedy |
|-------|---------|--------|
| Updating only checklist | Causes drift | Always batch-update all docs |
| Missing decision rationale | Reduces auditability | Include "rationale" field |
| Orphaned cross-agent refs | Creates confusion | Prune or update references |
| Skipping completion summary | Loses historical context | Always generate summary |
| Mixing IDs for same initiative | Fragmented tracking | Standardize on one ID |

## Quick Reference Flow
1. Scan `.temp/` → 2. Assign ID → 3. Create files → 4. Execute work → 5. Batch update ALL docs per trigger → 6. Validate & summarize → 7. Archive to `.temp/completed/`.

---
Use this template as the single source of truth for orchestration alignment across all agents.
