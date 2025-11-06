# ERR-D8E1: Next.js Server Actions Re-Export Error

**Error ID:** ERR-D8E1  
**Date Reported:** 2025-11-05  
**Severity:** Critical  
**Status:** Resolved  
**Component:** Server Actions / Module Architecture  

## Summary

Next.js 16 build failed with "Only async functions are allowed to be exported in a 'use server' file" error when attempting to re-export server actions from child modules in a parent module that also had the `'use server'` directive.

## Symptoms

- Build fails with Turbopack/Next.js compilation error
- Error message: "Only async functions are allowed to be exported in a 'use server' file"
- Error occurs at re-export statements (`export { ... } from './module'`)
- Components importing from parent module report "The module has no exports at all"
- Application fails to load affected pages (500 Internal Server Error)

## Error Message

```
⨯ ./src/lib/actions/health-records.actions.ts:49:1
Ecmascript file had an error

> 49 | export {
     | ^^^^^^^^
> 50 |   createHealthRecordAction,
     | ^^^^^^^^^^^^^^^^^^^^^^^^^^^
> 51 |   getHealthRecordsAction,
     | ^^^^^^^^^^^^^^^^^^^^^^^^^^^
> 52 |   updateHealthRecordAction,
     | ^^^^^^^^^^^^^^^^^^^^^^^^^^^
> 53 |   deleteHealthRecordAction
     | ^^^^^^^^^^^^^^^^^^^^^^^^^^^
> 54 | } from './health-records.crud';
     | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Only async functions are allowed to be exported in a "use server" file.
```

## Root Cause

Next.js enforces strict rules for `'use server'` files:
1. Files with `'use server'` can **only export async functions** (Server Actions)
2. They cannot export constants, non-async functions, or re-exports from other modules
3. Re-exporting from a `'use server'` file to another `'use server'` file is not allowed

The error occurred because:
- **Parent module** (`health-records.actions.ts`) had `'use server'` directive
- **Parent module** attempted to re-export server actions from child modules
- **Child modules** also had `'use server'` directive (correct)
- Next.js interpreted the re-export statement as an invalid export in a server file

### File Structure (Before Fix)

```
health-records.actions.ts
├─ 'use server'  ❌ PROBLEM: Can't re-export with this directive
├─ export { ... } from './health-records.crud'
├─ export { ... } from './health-records.immunizations'
└─ export { ... } from './health-records.stats'

health-records.crud.ts
├─ 'use server'  ✅ Correct
└─ export async function createHealthRecordAction() { ... }

health-records.immunizations.ts
├─ 'use server'  ✅ Correct
└─ export async function createImmunizationAction() { ... }
```

## Technical Details

### Before Fix

```typescript
// health-records.actions.ts
'use server';  // ❌ Problem: This file shouldn't have 'use server'

export type { ActionResult } from './health-records.types';

// ❌ Error: Can't re-export from 'use server' file
export {
  createHealthRecordAction,
  getHealthRecordsAction,
  updateHealthRecordAction,
  deleteHealthRecordAction
} from './health-records.crud';

export {
  createImmunizationAction
} from './health-records.immunizations';
```

### After Fix

```typescript
// health-records.actions.ts
// ✅ No 'use server' directive - this file only re-exports

export type { ActionResult } from './health-records.types';

// ✅ Now works: Re-exporting without 'use server'
export {
  createHealthRecordAction,
  getHealthRecordsAction,
  updateHealthRecordAction,
  deleteHealthRecordAction
} from './health-records.crud';

export {
  createImmunizationAction
} from './health-records.immunizations';
```

### Child Module (Unchanged - Already Correct)

```typescript
// health-records.crud.ts
'use server';  // ✅ Correct: Implementation file has 'use server'

import { revalidatePath } from 'next/cache';

export async function createHealthRecordAction(formData: FormData) {
  // Server action implementation
}

export async function getHealthRecordsAction() {
  // Server action implementation
}
```

## Resolution Steps

1. Removed `'use server'` directive from parent module (`health-records.actions.ts`)
2. Added documentation explaining the architectural pattern
3. Left `'use server'` in child modules (implementation files) unchanged
4. Verified all re-exports work correctly
5. Cleared Next.js cache (`.next` directory) and rebuilt

## Files Modified

- `frontend/src/lib/actions/health-records.actions.ts`
  - Removed: `'use server';` directive
  - Added: Documentation about re-export pattern

## Next.js Server Actions Architecture Pattern

### ✅ Correct Pattern

```
Index/Barrel File (NO 'use server')
├─ Re-exports from implementation modules
└─ Provides single import point for consumers

Implementation Modules (WITH 'use server')
├─ Define actual server actions
├─ Include 'use server' directive
└─ Export async functions only
```

### ❌ Incorrect Pattern

```
Index/Barrel File (WITH 'use server')  ❌ Don't do this
├─ Tries to re-export
└─ Causes build error

Implementation Modules (WITH 'use server')
└─ Server actions
```

## Prevention Guidelines

### File Organization Rules

1. **Implementation Files** (actual server actions):
   - ✅ **DO** use `'use server'` directive
   - ✅ **DO** export only async functions
   - ✅ **DO** implement actual server action logic
   - ❌ **DON'T** re-export from other modules

2. **Index/Barrel Files** (re-export aggregators):
   - ❌ **DON'T** use `'use server'` directive
   - ✅ **DO** re-export from implementation files
   - ✅ **DO** export type definitions
   - ✅ **DO** provide centralized import point

3. **Utility Files** (shared helpers):
   - ❌ **DON'T** use `'use server'` directive
   - ✅ **DO** export constants, utilities, types
   - ✅ **CAN** export async helper functions (without 'use server')
   - ✅ **CAN** be imported by server action files

### Code Review Checklist

- [ ] Verify `'use server'` is only in implementation files
- [ ] Check that barrel/index files don't have `'use server'`
- [ ] Confirm all exports from `'use server'` files are async functions
- [ ] Ensure no constants or non-async functions in `'use server'` files
- [ ] Validate that re-exports work without `'use server'`

## Testing

### Verification Steps

1. Clear Next.js cache: `Remove-Item -Recurse -Force .next`
2. Start development server: `npm run dev`
3. Navigate to affected route (e.g., `/health-records`)
4. Verify page loads without errors
5. Check that server actions can be imported and used
6. Confirm no "The module has no exports" errors

### Build Test

```bash
# Clean build test
npm run build

# Should complete without errors:
# ✓ Compiled successfully
# ✓ Collecting page data
# ✓ Generating static pages
```

## Related Patterns

### Similar Error Scenarios

1. **Exporting constants from 'use server' file**:
   ```typescript
   'use server';
   export const API_URL = 'http://...';  // ❌ Error
   export async function fetchData() {}  // ✅ OK
   ```

2. **Exporting non-async functions from 'use server' file**:
   ```typescript
   'use server';
   export function helper() {}  // ❌ Error (not async)
   export async function action() {}  // ✅ OK
   ```

3. **Re-exporting types** (This is allowed):
   ```typescript
   'use server';
   export type { MyType } from './types';  // ✅ OK (types only)
   export async function action() {}  // ✅ OK
   ```

## Impact Assessment

- **Severity**: Critical - Complete build failure
- **Scope**: All pages importing from affected module
- **Users Affected**: All users accessing health records features
- **Data Loss**: None - build-time error
- **Recovery Time**: Immediate after fix applied

## References

- [Next.js Server Actions Documentation](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Next.js App Router Patterns](https://nextjs.org/docs/app/building-your-application/routing)
- Next.js GitHub Issues: Similar re-export errors
- Related: ERR-A7B9 (Cookie prefix issue), ERR-C4F2 (Token extraction issue)

## Additional Notes

### Why This Pattern Exists

Next.js enforces the `'use server'` restriction to:
1. Ensure server actions are clearly identified
2. Prevent accidental client-side execution of server code
3. Enable proper bundling and code splitting
4. Maintain clear boundaries between server and client code

### Best Practice: Barrel Pattern

The correct architectural pattern is:

```
actions/
├─ index.ts              # Barrel file (no 'use server')
├─ module-a.actions.ts   # Implementation ('use server')
├─ module-b.actions.ts   # Implementation ('use server')
└─ shared.utils.ts       # Utilities (no 'use server')
```

This pattern:
- ✅ Provides single import point for consumers
- ✅ Keeps server actions properly marked
- ✅ Allows utilities to be shared
- ✅ Maintains clear module boundaries
- ✅ Avoids re-export errors

### Migration Guide

If you have this error in your codebase:

1. **Identify**: Find files with both `'use server'` and re-export statements
2. **Remove**: Delete `'use server'` from barrel/index files
3. **Document**: Add comments explaining the pattern
4. **Verify**: Check that child modules still have `'use server'`
5. **Test**: Clear cache and rebuild

### Performance Considerations

This pattern has no performance impact:
- Re-exports are resolved at build time
- No runtime overhead
- Tree shaking works correctly
- Code splitting remains optimal
