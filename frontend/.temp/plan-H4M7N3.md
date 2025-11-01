# TypeScript TS2322 Error Fix Plan - H4M7N3

## References to Other Agent Work
- K9M3P6: Working on TS2305 and TS2307 errors (missing exports/modules)
- Previous error analysis: `.temp/typescript-errors-T5E8R2.txt`
- Architecture: `.temp/architecture-notes-A1B2C3.md`

## Mission
Fix TS2322 (Type assignment) errors in src/hooks/domains directory by ADDING code, not deleting.

## Approach

### Phase 1: Analysis (Current)
- Search all files in src/hooks/domains
- Identify type assignment errors
- Categorize by error pattern

### Phase 2: Fix Type Assignments
- Add proper return type annotations to hooks
- Create compatible types for assignments
- Add type definitions for hook returns

### Phase 3: Add Type Guards
- Add type guards where needed
- Add type assertions for safe narrowing
- Add proper generic constraints

### Phase 4: Validation
- Review all fixes
- Ensure no code was deleted
- Document error count reduction

## Success Criteria
- All TS2322 errors in src/hooks/domains are fixed
- No code deletion, only additions
- Proper type safety maintained
- Summary of files fixed and error reduction
