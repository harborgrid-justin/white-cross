# Implementation Plan - Fix TS7006 Errors

**Agent ID**: F9P2X6
**Task**: Fix all 389 TS7006 errors (Parameter implicitly has 'any' type)
**Started**: 2025-11-01
**References**: Previous TypeScript error work in `.temp/typescript-errors-T5E8R2.txt`

## Overview
Fix all instances where function parameters implicitly have 'any' type by adding explicit type annotations. Critical constraint: ONLY add code - DO NOT delete any existing code.

## Phases

### Phase 1: Error Analysis (15 min)
- Parse all 389 errors from type-check output
- Categorize by file type and error pattern
- Identify common callback patterns (map, filter, forEach, etc.)
- Create type definition strategy

### Phase 2: Component Fixes (45 min)
**Files**: Dashboard, incidents, communications, inventory components
- Add types to event handlers
- Add types to map/filter/reduce callbacks
- Add types to component prop callbacks
- Create helper types for common patterns

### Phase 3: Server Action Fixes (30 min)
**Files**: inventory/actions.ts, transactions/actions.ts
- Add types to array method callbacks
- Add types to reduce accumulators
- Add types to sorting functions

### Phase 4: Config & UI Fixes (30 min)
**Files**: queryClient.ts, charts, modals, forms
- Add types to query client callbacks
- Add types to chart render functions
- Add types to form handlers

### Phase 5: Verification (15 min)
- Run type-check to verify all errors resolved
- Document any remaining issues
- Create completion summary

## Timeline
**Total Estimated Time**: 2.5 hours
**Completion Target**: 2025-11-01 08:10 UTC

## Success Criteria
- All 389 TS7006 errors resolved
- No code deletion, only additions
- Type-check runs without TS7006 errors
- Type safety improved across codebase
