# TypeScript Error Fix Plan - TS2554 Arguments Mismatch
**Agent ID**: typescript-architect
**Task ID**: F2T9K5
**Started**: 2025-11-01

## Referenced Agent Work
- Multiple agent tracking files exist in .temp/
- Architecture notes: A1B2C3, X7Y3Z9
- Previous error fixing work: T5E8R2

## Overview
Fix all 184 TS2554 "Expected X arguments, but got Y" errors across the codebase.

**Critical Constraint**: ONLY ADD CODE - NO DELETIONS

## Error Categories Identified

### 1. NextResponse.json() Calls (49 errors)
**Pattern**: `NextResponse.json(data)` → expects 2 arguments
**Files**:
- API routes in appointments, auth, communications, health-records, incidents, medications, students
- inventory/actions.ts

**Solution**: Add second parameter (empty options object) to NextResponse.json calls

### 2. Zod Schema .refine() Calls (71 errors)
**Pattern**: `z.refine(fn)` → expects 2-3 arguments
**Files**: Multiple schema files (admin, compliance, documents, inventory, role, settings, user, transaction, notifications, reports, health)

**Solution**: Add second parameter with error message object to all .refine() calls

### 3. Query Hook Mutations (24 errors)
**Pattern**: Functions called with 3 args expecting 2 args
**Files**: QueryHooksFactory.ts, useAppointments, useMedications, useStudents

**Solution**: Adjust function signatures to accept optional third parameter

### 4. DataTable Function Calls (5 errors)
**Pattern**: Functions called with 2 args expecting 1 arg
**File**: components/features/shared/DataTable.tsx

**Solution**: Make second parameter optional in function signatures

### 5. Hook Function Calls (35 errors)
**Pattern**: Various mismatches in hooks
**Files**: useAutocomplete, useSearch, useDashboardComposites, useHealthRecords, useInventoryManagement, useMedicationQueries, useStudentMutations, useAudit, useStudentsRoute, etc.

**Solution**: Add optional parameters or default values to function signatures

## Implementation Phases

### Phase 1: NextResponse.json() Fixes
- Fix all API route files
- Fix inventory/actions.ts
- Estimated: 49 fixes

### Phase 2: Zod Schema .refine() Fixes
- Fix all schema files with .refine() calls
- Add appropriate error messages
- Estimated: 71 fixes

### Phase 3: Query Hook Mutation Fixes
- Fix QueryHooksFactory.ts function signatures
- Fix useAppointments, useMedications, useStudents
- Estimated: 24 fixes

### Phase 4: Component & Hook Fixes
- Fix DataTable component
- Fix Tooltip component
- Fix AuthContext
- Fix all remaining hooks
- Estimated: 40 fixes

### Phase 5: Validation
- Run type-check to verify all fixes
- Ensure no new errors introduced
- Document all changes

## Timeline
- Phase 1: 10-15 minutes
- Phase 2: 15-20 minutes
- Phase 3: 10 minutes
- Phase 4: 15 minutes
- Phase 5: 5 minutes

**Total Estimated Time**: 55-65 minutes
