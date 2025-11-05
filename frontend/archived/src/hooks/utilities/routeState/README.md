# Route State Management Module

This directory contains the refactored route state management system, split from the original 1202-line `useRouteState.ts` file into smaller, more maintainable modules.

## Migration Information

**Original File**: `hooks/utilities/useRouteState.ts` (1202 lines)
**Refactored Into**: 9 files, each under 300 lines
**Total Lines**: ~1,806 lines (including documentation and headers)

## Module Structure

### Core Files

#### `types.ts` (254 lines)
- **Purpose**: Centralized type definitions
- **Exports**: All TypeScript interfaces and types
- **Key Types**:
  - `RouteStateOptions`, `UseRouteStateReturn`
  - `FilterConfig`, `UsePersistedFiltersReturn`
  - `NavigationState`, `UseNavigationStateReturn`
  - `PaginationState`, `PaginationConfig`, `UsePageStateReturn`
  - `SortState`, `SortConfig`, `UseSortStateReturn`

#### `serialization.ts` (140 lines)
- **Purpose**: Serialization and deserialization utilities
- **Exports**:
  - `defaultSerialize` - Convert values to URL-safe strings
  - `defaultDeserialize` - Parse strings back to typed values
  - `safeJsonParse` - Safe JSON parsing with fallback

#### `urlStorage.ts` (200 lines)
- **Purpose**: URL manipulation and localStorage utilities
- **Exports**:
  - URL utilities: `buildQueryString`, `updateUrlParam`, `updateUrlParams`
  - Storage utilities: `getStorageItem`, `setStorageItem`, `removeStorageItem`

### Hook Files

#### `useRouteStateCore.ts` (203 lines)
- **Purpose**: Core route state hook
- **Exports**: `useRouteState`
- **Features**:
  - URL query parameter synchronization
  - Custom serialization support
  - Validation with error handling
  - Replace vs push navigation

#### `usePersistedFilters.ts` (257 lines)
- **Purpose**: Filter state with localStorage persistence
- **Exports**: `usePersistedFilters`
- **Features**:
  - localStorage persistence with debouncing
  - Optional URL synchronization
  - Single and batch filter updates
  - Validation support

#### `useNavigationState.ts` (177 lines)
- **Purpose**: Navigation history tracking
- **Exports**: `useNavigationState`
- **Features**:
  - Navigation history tracking (last 10 entries)
  - Scroll position preservation
  - Navigate back with state restoration
  - Current scroll position tracking

#### `usePageState.ts` (222 lines)
- **Purpose**: Pagination state management
- **Exports**: `usePageState`
- **Features**:
  - URL synchronization
  - Per-route page memory
  - Configurable page size options
  - Auto-reset on filter changes

#### `useSortState.ts` (256 lines)
- **Purpose**: Sort state management
- **Exports**: `useSortState`
- **Features**:
  - URL synchronization
  - Column validation
  - Optional localStorage persistence
  - Toggle sorting (asc → desc → clear)
  - Sort indicator helpers

### Entry Points

#### `index.ts` (97 lines)
- **Purpose**: Barrel export for all modules
- **Exports**: All types, utilities, and hooks
- **Default Export**: `useRouteState`

## Usage

### Importing

```typescript
// Recommended: Import from the module
import { useRouteState, usePersistedFilters } from '@/hooks/utilities/routeState';

// Or import specific hooks
import { usePageState } from '@/hooks/utilities/routeState/usePageState';
import { useSortState } from '@/hooks/utilities/routeState/useSortState';

// Backward compatibility (deprecated)
import { useRouteState } from '@/hooks/utilities/useRouteState';
```

### Examples

#### Basic Route State

```typescript
const [search, setSearch] = useRouteState({
  paramName: 'search',
  defaultValue: ''
});
```

#### Persisted Filters

```typescript
const { filters, updateFilter, clearFilters } = usePersistedFilters({
  storageKey: 'student-filters',
  defaultFilters: { grade: '', status: 'active' },
  syncWithUrl: true
});
```

#### Pagination

```typescript
const { page, pageSize, setPage, setPageSize } = usePageState({
  defaultPage: 1,
  defaultPageSize: 20,
  resetOnFilterChange: true
});
```

#### Sorting

```typescript
const { column, direction, toggleSort, getSortIndicator } = useSortState({
  validColumns: ['name', 'date', 'status'],
  defaultColumn: 'name',
  defaultDirection: 'asc'
});
```

## File Size Summary

| File | Lines | Purpose |
|------|-------|---------|
| `types.ts` | 254 | Type definitions |
| `serialization.ts` | 140 | Serialization utilities |
| `urlStorage.ts` | 200 | URL and storage utilities |
| `useRouteStateCore.ts` | 203 | Core route state hook |
| `usePersistedFilters.ts` | 257 | Filter persistence hook |
| `useNavigationState.ts` | 177 | Navigation history hook |
| `usePageState.ts` | 222 | Pagination hook |
| `useSortState.ts` | 256 | Sort state hook |
| `index.ts` | 97 | Barrel exports |
| **Total** | **1,806** | All modules |

## Benefits of Refactoring

1. **Maintainability**: Each file has a single, clear purpose
2. **Readability**: Files are small enough to understand at a glance
3. **Testability**: Individual modules can be tested in isolation
4. **Tree-shaking**: Import only what you need
5. **Discoverability**: Clear module structure makes features easy to find
6. **Backward Compatibility**: Existing code continues to work

## Migration Guide

### For New Code

Use the new modular imports:

```typescript
import { useRouteState, usePageState } from '@/hooks/utilities/routeState';
```

### For Existing Code

No changes required! The backward compatibility wrapper ensures all existing imports continue to work:

```typescript
// Still works!
import { useRouteState } from '@/hooks/utilities/useRouteState';
```

### Recommended Migration Path

1. Update imports to use the new module structure
2. Test thoroughly
3. Remove old `useRouteState.ts` file when all code is migrated

## Related Files

- **Original**: `hooks/utilities/useRouteState.ts` (deprecated, can be removed after migration)
- **Compatibility**: `hooks/utilities/useRouteState-new.ts` (backward compatibility wrapper)
- **Examples**: `hooks/utilities/useRouteState.examples.tsx` (usage examples)

## Contributing

When modifying these modules:

1. Keep each file under 300 lines
2. Update type definitions in `types.ts` first
3. Maintain backward compatibility through `index.ts`
4. Add JSDoc comments for all exports
5. Include usage examples in documentation
6. Run tests before committing

## Questions?

For questions or issues, please contact the White Cross Healthcare Platform team.
