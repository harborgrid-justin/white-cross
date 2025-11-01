# TypeScript Error Fix Plan - TS2551/TS2554 in src/components
**Agent ID**: typescript-architect (Agent 7)
**Task ID**: W7T3X9
**Started**: 2025-11-01

## Referenced Agent Work
- Agent F2T9K5: Working on global TS2554 errors (not started yet)
- Agent K9M3P6: Working on TS2305/TS2307 errors
- Error logs: `.temp/typescript-errors-T5E8R2.txt`, `.temp/typescript-errors-K9M3P6.txt`

## Overview
Fix TS2551 (property spelling) and TS2554 (argument count) errors specifically in src/components directory.

**Critical Constraint**: ONLY ADD CODE - NO DELETIONS

## Error Analysis

### Current Status
Based on error log analysis:
- TS2551 errors in src/components: 0 (all in src/app)
- TS2554 errors in src/components: 0 in latest log

However, manual code inspection revealed potential unreported errors:

### Found Issues in Manual Inspection

1. **DataTable.tsx** - getRowId signature mismatch
   - Interface declares: `getRowId?: (row: T) => string | number` (1 param)
   - Default implementation: `(row: T, index: number) => index` (2 params)
   - All usages call with 2 arguments
   - **Fix**: Update interface to accept optional second parameter

## Implementation Phases

### Phase 1: Manual Code Inspection
- Inspect component files for potential TS2554/TS2551 errors
- Focus on function signatures and property access
- Check for:
  - Function calls with wrong argument count
  - Property name typos
  - Optional parameter mismatches

### Phase 2: Fix DataTable Component
- Update getRowId interface signature to accept optional index parameter
- Ensure type safety maintained

### Phase 3: Scan Other Components
- Check other shared components for similar issues
- Focus on generic/reusable components with complex signatures

### Phase 4: Validation
- Document all fixes
- Update tracking files

## Timeline
- Phase 1: 10 minutes
- Phase 2: 5 minutes
- Phase 3: 15 minutes
- Phase 4: 5 minutes

**Total Estimated Time**: 35 minutes
