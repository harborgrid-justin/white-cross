# TypeScript Health Records Fix Plan - D7K4M2

## Agent Context
- **Agent ID**: typescript-architect
- **Task ID**: fix-health-records-typescript-errors
- **Related Work**: References A1B2C3 (previous type fixes), X7Y3Z9 (WCAG work)
- **Start Time**: 2025-10-31

## Identified Issues

### 1. Audit Log Type Compatibility (Priority: CRITICAL)
- **File**: `src/lib/audit.ts`
- **Issue**: `userId?: string` doesn't accept `string | null`
- **Impact**: 15+ errors in health-records.actions.ts
- **Fix**: Change to `userId?: string | null`

### 2. ZodError Property Access (Priority: HIGH)
- **Files**: All three health record files
- **Issue**: `error.errors` should be `error.issues`
- **Impact**: 9 errors across files
- **Fix**: Replace all `error.errors` with `error.issues`

### 3. ActionResult Interface (Priority: MEDIUM)
- **File**: `src/actions/health-records.actions.ts`
- **Issue**: `_form?: string[]` conflicts with index signature
- **Impact**: 1 error at line 71
- **Fix**: Properly type the errors object with Record type

### 4. Implicit Any Types (Priority: MEDIUM)
- **Files**: All three health record files
- **Issue**: Parameter `err` in forEach callbacks lacks type
- **Impact**: 9 errors
- **Fix**: Add explicit `ZodIssue` type to parameters

### 5. Missing Service Methods (Priority: LOW)
- **File**: `src/services/modules/healthRecordsApi.ts`
- **Issue**: Hook calls non-existent API methods
- **Impact**: ~40 errors in useHealthRecords.ts
- **Fix**: Verify and add proper method signatures

## Implementation Phases

### Phase 1: Fix Core Types (15 min)
1. Update AuditLogEntry interface
2. Fix ActionResult interface
3. Add proper type imports

### Phase 2: Fix ZodError Usage (10 min)
1. Replace all `error.errors` with `error.issues`
2. Add ZodIssue type annotations
3. Verify error handling logic

### Phase 3: Fix API Service Methods (20 min)
1. Audit healthRecordsApi for missing methods
2. Add method stubs or fix hook calls
3. Ensure type compatibility

### Phase 4: Validation (10 min)
1. Run type-check on all three files
2. Verify no new errors introduced
3. Confirm error count reduction

## Expected Outcomes
- health-records.actions.ts: 45 → 0 errors
- healthRecordsApi.ts: 48 → 0 errors
- useHealthRecords.ts: 102 → <10 errors (some may be dependent on other files)

## Risk Assessment
- **Low Risk**: Type changes are non-breaking
- **No Code Removal**: All fixes are additive type annotations
- **HIPAA Compliance**: No changes to audit logging behavior
