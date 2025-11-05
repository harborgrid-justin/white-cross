# Migration Guide: Route State Hooks Refactoring

## Quick Start

**Good news!** Your existing code will continue to work without any changes. This refactoring maintains full backward compatibility.

## What Changed?

The `useRouteState.ts` file (1,202 lines) has been split into a modular structure with 9 files, each under 300 lines.

### Before (Old Structure)
```typescript
// Single large file
import { useRouteState, usePageState, useSortState } from '@/hooks/utilities/useRouteState';
```

### After (New Structure)
```typescript
// Modular structure (recommended)
import { useRouteState, usePageState, useSortState } from '@/hooks/utilities/routeState';

// Or import specific modules
import { usePageState } from '@/hooks/utilities/routeState/usePageState';
import { useSortState } from '@/hooks/utilities/routeState/useSortState';
```

## Do I Need to Change My Code?

### Short Answer: **No!**

A backward compatibility wrapper (`useRouteState-new.ts`) ensures all existing imports continue to work.

### Recommended: **Yes, gradually migrate to the new structure**

Benefits of migrating:
- Better tree-shaking (smaller bundles)
- Clearer import statements
- Improved IDE support
- Future-proof code

## Migration Steps

### Step 1: Identify Current Usage

Search your codebase for imports:

```bash
# Find all imports of useRouteState
grep -r "from '@/hooks/utilities/useRouteState'" --include="*.ts" --include="*.tsx"
```

### Step 2: Update Imports (No Breaking Changes)

Replace old imports with new ones:

#### Option A: Update to Module Import (Recommended)

```typescript
// Before
import { useRouteState, usePageState } from '@/hooks/utilities/useRouteState';

// After
import { useRouteState, usePageState } from '@/hooks/utilities/routeState';
```

#### Option B: Import Specific Hooks

```typescript
// Before
import { usePageState } from '@/hooks/utilities/useRouteState';

// After
import { usePageState } from '@/hooks/utilities/routeState/usePageState';
```

### Step 3: Test Your Changes

1. Run TypeScript compilation: `npm run type-check`
2. Run unit tests: `npm test`
3. Test in development: `npm run dev`
4. Verify functionality in the browser

### Step 4: Commit and Deploy

```bash
git add .
git commit -m "chore: migrate to modular route state hooks"
```

## Import Mapping

| Old Import | New Import (Recommended) | Alternative |
|------------|--------------------------|-------------|
| `useRouteState` | `@/hooks/utilities/routeState` | `@/hooks/utilities/routeState/useRouteStateCore` |
| `usePersistedFilters` | `@/hooks/utilities/routeState` | `@/hooks/utilities/routeState/usePersistedFilters` |
| `useNavigationState` | `@/hooks/utilities/routeState` | `@/hooks/utilities/routeState/useNavigationState` |
| `usePageState` | `@/hooks/utilities/routeState` | `@/hooks/utilities/routeState/usePageState` |
| `useSortState` | `@/hooks/utilities/routeState` | `@/hooks/utilities/routeState/useSortState` |
| Types | `@/hooks/utilities/routeState` | `@/hooks/utilities/routeState/types` |

## Common Patterns

### Pattern 1: Multiple Hooks

```typescript
// Before
import {
  useRouteState,
  usePageState,
  useSortState,
  type PaginationConfig,
  type SortConfig
} from '@/hooks/utilities/useRouteState';

// After
import {
  useRouteState,
  usePageState,
  useSortState,
  type PaginationConfig,
  type SortConfig
} from '@/hooks/utilities/routeState';
```

### Pattern 2: Type-Only Imports

```typescript
// Before
import type { RouteStateOptions, PaginationState } from '@/hooks/utilities/useRouteState';

// After
import type { RouteStateOptions, PaginationState } from '@/hooks/utilities/routeState';
// Or
import type { RouteStateOptions, PaginationState } from '@/hooks/utilities/routeState/types';
```

### Pattern 3: Utilities Only

```typescript
// Before
import { defaultSerialize, buildQueryString } from '@/hooks/utilities/useRouteState';

// After
import { defaultSerialize, buildQueryString } from '@/hooks/utilities/routeState';
// Or
import { defaultSerialize } from '@/hooks/utilities/routeState/serialization';
import { buildQueryString } from '@/hooks/utilities/routeState/urlStorage';
```

## Code Examples

### Example 1: Simple Migration

**Before:**
```typescript
import { useRouteState } from '@/hooks/utilities/useRouteState';

export function SearchFilter() {
  const [search, setSearch] = useRouteState({
    paramName: 'search',
    defaultValue: ''
  });

  return <input value={search} onChange={(e) => setSearch(e.target.value)} />;
}
```

**After:**
```typescript
import { useRouteState } from '@/hooks/utilities/routeState';

export function SearchFilter() {
  const [search, setSearch] = useRouteState({
    paramName: 'search',
    defaultValue: ''
  });

  return <input value={search} onChange={(e) => setSearch(e.target.value)} />;
}
```

### Example 2: Complex Migration

**Before:**
```typescript
import {
  usePageState,
  useSortState,
  usePersistedFilters,
  type PaginationConfig,
  type SortConfig,
  type FilterConfig
} from '@/hooks/utilities/useRouteState';

export function StudentList() {
  const { page, pageSize, setPage } = usePageState({
    defaultPageSize: 20
  } as PaginationConfig);

  const { column, direction, toggleSort } = useSortState<'name' | 'date'>({
    validColumns: ['name', 'date'],
    defaultColumn: 'name'
  } as SortConfig<'name' | 'date'>);

  const { filters, updateFilter } = usePersistedFilters({
    storageKey: 'student-filters',
    defaultFilters: { status: 'active' }
  } as FilterConfig<{ status: string }>);

  // Component logic...
}
```

**After:**
```typescript
import {
  usePageState,
  useSortState,
  usePersistedFilters,
  type PaginationConfig,
  type SortConfig,
  type FilterConfig
} from '@/hooks/utilities/routeState';

export function StudentList() {
  const { page, pageSize, setPage } = usePageState({
    defaultPageSize: 20
  } as PaginationConfig);

  const { column, direction, toggleSort } = useSortState<'name' | 'date'>({
    validColumns: ['name', 'date'],
    defaultColumn: 'name'
  } as SortConfig<'name' | 'date'>);

  const { filters, updateFilter } = usePersistedFilters({
    storageKey: 'student-filters',
    defaultFilters: { status: 'active' }
  } as FilterConfig<{ status: string }>);

  // Component logic...
}
```

## Troubleshooting

### Issue: TypeScript Errors After Migration

**Solution**: Clear TypeScript cache and restart your IDE

```bash
# Clear Next.js cache
rm -rf .next

# Restart TypeScript server in VS Code
# Command Palette (Ctrl+Shift+P) -> "TypeScript: Restart TS Server"
```

### Issue: Module Not Found

**Error**: `Cannot find module '@/hooks/utilities/routeState'`

**Solution**: Ensure the `routeState` directory exists and contains `index.ts`

```bash
ls -la src/hooks/utilities/routeState/
```

### Issue: Import Errors

**Error**: `Module has no exported member 'useRouteState'`

**Solution**: Check that you're importing from the correct path

```typescript
// Correct
import { useRouteState } from '@/hooks/utilities/routeState';

// Incorrect
import { useRouteState } from '@/hooks/utilities/routeState/types';
```

## FAQ

### Q: Do I need to update my code immediately?

**A:** No, the backward compatibility wrapper ensures your existing code continues to work.

### Q: What's the benefit of migrating?

**A:** Better tree-shaking, smaller bundles, clearer code organization, and improved maintainability.

### Q: Can I mix old and new imports?

**A:** Yes, but it's not recommended. Choose one pattern and stick with it for consistency.

### Q: Will this affect bundle size?

**A:** The new structure may slightly reduce bundle size due to better tree-shaking, especially if you only use specific hooks.

### Q: What if I find a bug?

**A:** Report it immediately! The refactoring should not introduce any behavioral changes.

### Q: When should I migrate?

**A:** Migrate gradually as you work on related code. There's no rush, but new code should use the new imports.

### Q: Can I still use the old file?

**A:** The old `useRouteState.ts` file can be removed after all code is migrated. The backward compatibility wrapper will remain.

## Testing Recommendations

### Before Migration
```bash
# Save current bundle size
npm run build
# Note the bundle size for comparison
```

### After Migration
```bash
# Check TypeScript compilation
npm run type-check

# Run tests
npm test

# Build and compare bundle size
npm run build

# Test in development
npm run dev
```

### Test Cases

1. **Functionality Test**: Verify all hooks work as expected
2. **Type Safety Test**: Check TypeScript IntelliSense and errors
3. **Bundle Size Test**: Compare bundle sizes before/after
4. **Performance Test**: Ensure no performance regression
5. **Integration Test**: Test with real components

## Rollout Strategy

### Phase 1: Low-Risk Migration (Week 1)
- Migrate test files
- Migrate utility functions
- Migrate new features

### Phase 2: Component Migration (Week 2-3)
- Migrate leaf components (no dependencies)
- Migrate feature components
- Update documentation

### Phase 3: Core Migration (Week 4)
- Migrate core features
- Update shared components
- Final testing

### Phase 4: Cleanup (Week 5)
- Remove backward compatibility wrapper
- Remove old file
- Update all documentation

## Support

If you encounter issues during migration:

1. Check this guide
2. Review the README.md in `routeState/`
3. Check REFACTORING_SUMMARY.md for technical details
4. Ask the team in the development channel
5. Create an issue in the project tracker

## Conclusion

This migration is **optional but recommended**. Your existing code will continue to work without changes, but migrating to the new structure will provide better organization, maintainability, and future-proofing.

**Happy coding!** 🚀

---

**Last Updated**: 2025-11-04
**Status**: Backward compatible, no breaking changes
**Urgency**: Low - Migrate at your convenience
