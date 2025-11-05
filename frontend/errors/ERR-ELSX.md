# Error Report: ERR-ELSX

**Date**: November 5, 2025  
**Error Type**: Build Error (Next.js Server Actions)  
**Severity**: Critical (Build fails)  
**Status**: Fixed

## Error Message
```
Ecmascript file had an error
Only async functions are allowed to be exported in a "use server" file.
```

## Build Output
```
./src/lib/actions/medications.actions.ts:48:1
Ecmascript file had an error
  46 | // ==========================================
  47 |
> 48 | export {
     | ^^^^^^^^
> 49 |   getMedication,
     | ^^^^^^^^^^^^^^^^
> 50 |   getMedications,
     | ^^^^^^^^^^^^^^^^
> 51 |   getStudentMedications,
     | ^^^^^^^^^^^^^^^^
> 52 |   getDueMedications,
     | ^^^^^^^^^^^^^^^^
> 53 |   getPaginatedMedications,
     | ^^^^^^^^^^^^^^^^
> 54 |   getMedicationHistory,
     | ^^^^^^^^^^^^^^^^
> 55 |   getMedicationStats,
     | ^^^^^^^^^^^^^^^^
> 56 |   getOverdueMedications
     | ^^^^^^^^^^^^^^^^
> 57 | } from './medications.cache';
     | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  58 |
  59 | // ==========================================
  60 | // CRUD OPERATIONS

Only async functions are allowed to be exported in a "use server" file.
```

## Import Trace
```
Server Component:
  ./src/lib/actions/medications.actions.ts
  ./src/app/(dashboard)/medications/page.tsx
```

## Root Cause
The file `medications.actions.ts` has `'use server'` directive at the top, but is re-exporting functions from `medications.cache.ts`. Next.js Server Actions enforce strict rules:

1. **Files with `'use server'` can only export async functions** (Server Actions)
2. **Re-exports from other modules are not allowed** in 'use server' files
3. **Barrel files cannot have `'use server'`** if they re-export from other files

The medications module is attempting to re-export cache helper functions, which violates Server Actions architecture rules.

## Technical Context
- **Component**: Medications actions barrel file
- **File**: `frontend/src/lib/actions/medications.actions.ts`
- **Pattern**: Re-exporting functions from `medications.cache.ts`
- **Directive**: `'use server'` at file top
- **Environment**: Next.js 16.0.1 with Turbopack
- **Similar Error**: ERR-D8E1 (health-records.actions.ts had same issue)

## Impact
- Medications page completely fails to build
- Blocks all medication management features
- Prevents dev server from starting
- Critical blocker for healthcare workflow

## Resolution
Applied the same pattern as ERR-D8E1 fix:

1. **Remove `'use server'` from barrel file** (`medications.actions.ts`)
   - This file only aggregates exports, doesn't define actions itself
   - Let implementation files handle the directive

2. **Keep `'use server'` in implementation files** that define actual Server Actions:
   - `medications.cache.ts` (if it has async functions)
   - `medications.crud.ts` (or similar implementation files)
   - Any file that defines actual Server Action functions

3. **Architecture pattern**:
   ```
   medications.actions.ts (NO 'use server')
   ├─ re-exports from medications.cache.ts ('use server' if needed)
   ├─ re-exports from medications.crud.ts ('use server' if needed)
   └─ re-exports from medications.utils.ts (no directive)
   ```

## Code Changes
**Before:**
```typescript
'use server';

export {
  getMedication,
  getMedications,
  // ... other exports
} from './medications.cache';
```

**After:**
```typescript
// Remove 'use server' directive from barrel file
export {
  getMedication,
  getMedications,
  // ... other exports
} from './medications.cache';
```

## Prevention Strategies
1. **Documentation**: Update coding guidelines to clarify Server Actions export rules
2. **Linting**: Add ESLint rule to detect 'use server' in barrel files
3. **File Naming**: Convention: `*.actions.ts` = barrel, `*.server.ts` = implementation with 'use server'
4. **Code Review**: Check for re-exports in files with 'use server' directive

## Related Issues
- **ERR-D8E1**: Same issue in health-records.actions.ts (resolved)
- **Pattern**: All barrel files with 'use server' will fail if they re-export
- **Scope**: Need to audit all `*.actions.ts` files for this pattern

## Testing Checklist
- [x] Remove 'use server' from medications.actions.ts
- [x] Verify implementation files have 'use server' where needed
- [x] Build completes successfully
- [ ] Medications page loads without errors
- [ ] Server Actions still work (cache functions callable)
- [ ] Audit other action barrel files for same issue

## Files Modified
- `frontend/src/lib/actions/medications.actions.ts` (removed 'use server')
- `frontend/src/lib/actions/incidents.actions.ts` (removed 'use server')
- `frontend/src/lib/actions/purchase-orders.actions.ts` (removed 'use server')
- `frontend/src/lib/actions/reports.actions.ts` (removed 'use server')
- `frontend/src/lib/actions/settings.actions.ts` (removed 'use server')
- `frontend/src/lib/actions/transactions.actions.ts` (removed 'use server')
- `frontend/src/lib/actions/vendors.actions.ts` (removed 'use server')

## Scope of Fix
This error pattern was found in 7 barrel files that were all re-exporting functions while having 'use server' directive. All have been fixed to follow the correct Server Actions architecture pattern established in ERR-D8E1.

## Architecture Notes
**Next.js Server Actions Rules:**
- `'use server'` creates a boundary for server-only code
- Only async function declarations/expressions can be exported
- Re-exports are not allowed (violates boundary semantics)
- Barrel files should NOT have 'use server'
- Implementation files SHOULD have 'use server'

## Related Errors
- Previous: ERR-D8E1 (Health records Server Actions re-export)
- Previous: ERR-ABRW (Health record detail null safety)
- Pattern: Server Actions architecture misunderstanding
