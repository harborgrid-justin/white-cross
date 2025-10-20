# Route-Level State Persistence Hooks

Enterprise-grade React hooks for managing and persisting route-level state across navigation, page reloads, and browser history. Built for the White Cross Healthcare Platform with HIPAA compliance, type safety, and production-ready error handling.

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Core Hooks](#core-hooks)
  - [useRouteState](#useroutestate)
  - [usePersistedFilters](#usepersistedfilters)
  - [useNavigationState](#usenavigationstate)
  - [usePageState](#usepagestate)
  - [useSortState](#usesortstate)
- [API Reference](#api-reference)
- [Best Practices](#best-practices)
- [Healthcare Compliance](#healthcare-compliance)
- [Performance Considerations](#performance-considerations)
- [Troubleshooting](#troubleshooting)

## Overview

These hooks provide a consistent, type-safe way to manage state that needs to persist across:

- **Route changes** - State survives navigation within the application
- **Page reloads** - State persists through browser refresh
- **Browser history** - Proper handling of back/forward navigation
- **URL sharing** - Shareable URLs with state encoded in query parameters

### Key Features

- **Type-safe** - Full TypeScript support with generics
- **Flexible serialization** - Custom serialization for complex types
- **Validation** - Built-in validation with error handling
- **Performance optimized** - Debouncing, memoization, and efficient updates
- **URL synchronization** - Automatic URL parameter management
- **localStorage integration** - Optional persistent storage
- **Error handling** - Graceful degradation with comprehensive error handling
- **Healthcare compliant** - No PHI stored in URL or localStorage

## Installation

These hooks are already included in the White Cross frontend. Import them from:

```typescript
import {
  useRouteState,
  usePersistedFilters,
  useNavigationState,
  usePageState,
  useSortState,
} from '@/hooks/useRouteState';
```

## Core Hooks

### useRouteState

Persist state in URL query parameters with type safety and custom serialization.

#### Basic Usage

```typescript
// Simple string state
const [search, setSearch, clearSearch] = useRouteState({
  paramName: 'search',
  defaultValue: '',
});

// Update state
setSearch('John Doe');

// Clear state
clearSearch();
```

#### Advanced Usage

```typescript
// Array state with custom serialization
const [selectedIds, setSelectedIds] = useRouteState({
  paramName: 'selected',
  defaultValue: [] as string[],
  serialize: (ids) => ids.join(','),
  deserialize: (str) => str ? str.split(',') : [],
});

// Object state with validation
interface FilterState {
  grade: string;
  status: 'active' | 'inactive';
}

const [filters, setFilters] = useRouteState<FilterState>({
  paramName: 'filters',
  defaultValue: { grade: '', status: 'active' },
  validate: (val): val is FilterState => {
    return typeof val === 'object' &&
           'grade' in val &&
           ['active', 'inactive'].includes(val.status);
  },
  onValidationError: (error) => {
    console.error('Invalid filters:', error);
    toast.error('Invalid filter parameters in URL');
  },
});
```

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `paramName` | `string` | *required* | URL query parameter name |
| `defaultValue` | `T` | *required* | Default value when parameter is missing |
| `serialize` | `(value: T) => string` | Auto-detect | Custom serialization function |
| `deserialize` | `(value: string) => T` | Auto-detect | Custom deserialization function |
| `validate` | `(value: any) => value is T` | None | Type guard for validation |
| `onValidationError` | `(error: Error) => void` | None | Error callback |
| `replace` | `boolean` | `false` | Replace history instead of push |

#### Return Value

```typescript
[
  value: T,                          // Current value
  setValue: (value: T | ((prev: T) => T)) => void,  // Setter
  clearValue: () => void             // Clear to default
]
```

---

### usePersistedFilters

Persist filter state to localStorage with debouncing and optional URL sync.

#### Basic Usage

```typescript
interface StudentFilters {
  search: string;
  grade: string;
  status: string;
}

const {
  filters,
  setFilters,
  updateFilter,
  clearFilters,
  isRestored,
} = usePersistedFilters<StudentFilters>({
  storageKey: 'student-filters',
  defaultFilters: {
    search: '',
    grade: '',
    status: 'active',
  },
  debounceMs: 500,
  syncWithUrl: true,
});

// Update single filter
updateFilter('grade', '5');

// Update multiple filters
setFilters({ ...filters, grade: '5', status: 'inactive' });

// Clear all filters
clearFilters();

// Wait for restoration before querying
const { data } = useQuery({
  queryKey: ['students', filters],
  queryFn: () => fetchStudents(filters),
  enabled: isRestored, // Wait for localStorage restoration
});
```

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `storageKey` | `string` | *required* | localStorage key |
| `defaultFilters` | `T` | *required* | Default filter values |
| `debounceMs` | `number` | `300` | Debounce delay for localStorage writes |
| `syncWithUrl` | `boolean` | `false` | Also sync with URL parameters |
| `validate` | `(filters: T) => boolean` | None | Filter validation function |

#### Return Value

```typescript
{
  filters: T,                        // Current filter state
  setFilters: (filters: T | ((prev: T) => T)) => void,
  updateFilter: <K extends keyof T>(key: K, value: T[K]) => void,
  clearFilters: () => void,
  isRestored: boolean,               // True after initial restoration
}
```

---

### useNavigationState

Track navigation history with state and scroll position preservation.

#### Basic Usage

```typescript
const {
  previousPath,
  previousState,
  navigateBack,
  navigateWithState,
  currentScroll,
} = useNavigationState();

// Navigate with custom state
const handleViewStudent = (id: string) => {
  navigateWithState(`/students/${id}`, {
    from: 'list',
    filters: currentFilters,
  });
};

// Navigate back with state restoration
const handleBack = () => {
  navigateBack('/students'); // Falls back to /students if no history
};

// Access previous navigation info
console.log('Previous path:', previousPath);
console.log('Previous state:', previousState);
console.log('Current scroll:', currentScroll);
```

#### Return Value

```typescript
{
  previousPath: string | null,       // Previous route path
  previousState: any,                // State from previous route
  navigateWithState: (path: string, state?: any) => void,
  navigateBack: (fallbackPath?: string) => void,
  getScrollPosition: (path?: string) => { x: number; y: number } | null,
  currentScroll: { x: number; y: number },
}
```

---

### usePageState

Manage pagination state with URL sync and per-route memory.

#### Basic Usage

```typescript
const {
  page,
  pageSize,
  pageSizeOptions,
  setPage,
  setPageSize,
  resetPage,
} = usePageState({
  defaultPage: 1,
  defaultPageSize: 20,
  pageSizeOptions: [10, 20, 50, 100],
  resetOnFilterChange: true,
});

// Use in API calls
const { data } = useQuery({
  queryKey: ['students', page, pageSize],
  queryFn: () => fetchStudents({ page, pageSize }),
});

// Update page
setPage(2);
setPage((prev) => prev + 1); // Functional update

// Update page size (resets to page 1)
setPageSize(50);

// Reset to first page
resetPage();
```

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `defaultPage` | `number` | `1` | Default page number |
| `defaultPageSize` | `number` | `10` | Default items per page |
| `pageSizeOptions` | `number[]` | `[10, 20, 50, 100]` | Valid page size options |
| `pageParam` | `string` | `'page'` | URL parameter for page |
| `pageSizeParam` | `string` | `'pageSize'` | URL parameter for page size |
| `resetOnFilterChange` | `boolean` | `true` | Reset to page 1 when filters change |

#### Return Value

```typescript
{
  page: number,                      // Current page number (1-indexed)
  pageSize: number,                  // Current page size
  pageSizeOptions: number[],         // Available page sizes
  setPage: (page: number | ((prev: number) => number)) => void,
  setPageSize: (size: number) => void,
  resetPage: () => void,
  state: PaginationState,            // Full state object
}
```

---

### useSortState

Manage sort state with validation, persistence, and URL sync.

#### Basic Usage

```typescript
type StudentColumn = 'lastName' | 'firstName' | 'grade' | 'dateOfBirth';

const {
  column,
  direction,
  sortBy,
  toggleSort,
  clearSort,
  getSortIndicator,
  getSortClass,
} = useSortState<StudentColumn>({
  validColumns: ['lastName', 'firstName', 'grade', 'dateOfBirth'],
  defaultColumn: 'lastName',
  defaultDirection: 'asc',
  persistPreference: true,
  storageKey: 'student-sort',
});

// Sort by column
sortBy('grade', 'desc');

// Toggle sort (cycles: asc -> desc -> default)
<th onClick={() => toggleSort('lastName')}>
  Last Name {getSortIndicator('lastName')}
</th>

// Use in API calls
const { data } = useQuery({
  queryKey: ['students', column, direction],
  queryFn: () => fetchStudents({ sortBy: column, sortDir: direction }),
});

// Clear sort
clearSort();
```

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `validColumns` | `T[]` | *required* | Valid column names |
| `defaultColumn` | `T \| null` | `null` | Default sort column |
| `defaultDirection` | `'asc' \| 'desc'` | `'asc'` | Default sort direction |
| `columnParam` | `string` | `'sortBy'` | URL parameter for column |
| `directionParam` | `string` | `'sortDir'` | URL parameter for direction |
| `persistPreference` | `boolean` | `false` | Save preference to localStorage |
| `storageKey` | `string` | `'sort-preference'` | localStorage key |

#### Return Value

```typescript
{
  column: T | null,                  // Current sort column
  direction: 'asc' | 'desc',         // Current sort direction
  sortBy: (column: T, direction?: 'asc' | 'desc') => void,
  toggleSort: (column: T) => void,
  clearSort: () => void,
  getSortIndicator: (column: T) => '↑' | '↓' | '',
  getSortClass: (column: T) => string,
  state: SortState<T>,               // Full state object
}
```

## Best Practices

### 1. Type Safety

Always use TypeScript types for state:

```typescript
// Good
interface Filters {
  grade: string;
  status: 'active' | 'inactive';
}
const { filters } = usePersistedFilters<Filters>({ ... });

// Bad
const { filters } = usePersistedFilters({ ... }); // any type
```

### 2. Validation

Always validate user-controlled data:

```typescript
const [filters, setFilters] = useRouteState({
  paramName: 'filters',
  defaultValue: defaultFilters,
  validate: (val): val is FilterType => {
    return typeof val === 'object' && isValidFilter(val);
  },
  onValidationError: (error) => {
    toast.error('Invalid filters in URL');
  },
});
```

### 3. Debouncing

Use appropriate debounce delays for localStorage writes:

```typescript
// Fast-changing values (search input)
debounceMs: 500

// Slow-changing values (select boxes)
debounceMs: 300

// Bulk operations
debounceMs: 1000
```

### 4. Query Integration

Wait for state restoration before querying:

```typescript
const { filters, isRestored } = usePersistedFilters({ ... });

const { data } = useQuery({
  queryKey: ['students', filters],
  queryFn: () => fetchStudents(filters),
  enabled: isRestored, // Critical!
});
```

### 5. Pagination Reset

Reset pagination when filters change:

```typescript
const { resetPage } = usePageState({
  resetOnFilterChange: true, // Automatic reset
});

// Or manual reset
useEffect(() => {
  resetPage();
}, [filters.grade, filters.status]);
```

## Healthcare Compliance

### HIPAA Considerations

**IMPORTANT:** These hooks are designed for non-PHI state management only.

#### ✅ Safe to Persist

- Filter selections (grade, status)
- Pagination state (page, pageSize)
- Sort preferences (column, direction)
- UI state (expanded panels, view modes)

#### ❌ Never Persist

- Patient names or identifiers
- Medical record numbers
- Diagnosis information
- Treatment data
- Any Protected Health Information (PHI)

#### Example: Safe Implementation

```typescript
// ✅ GOOD - No PHI
const { filters } = usePersistedFilters({
  storageKey: 'student-filters',
  defaultFilters: {
    grade: '',
    hasAllergies: false, // Boolean flag, not specific allergy data
    status: 'active',
  },
});

// ❌ BAD - Contains PHI
const { filters } = usePersistedFilters({
  storageKey: 'student-filters',
  defaultFilters: {
    studentName: '',        // PHI!
    diagnosis: '',          // PHI!
    medicationName: '',     // PHI!
  },
});
```

### Audit Logging

For healthcare compliance, audit when state affects data access:

```typescript
const handleViewStudent = (id: string) => {
  // Log PHI access
  auditLog.log({
    action: 'VIEW_STUDENT',
    resourceId: id,
    timestamp: new Date(),
  });

  navigateWithState(`/students/${id}`, {
    from: 'list',
  });
};
```

## Performance Considerations

### 1. Serialization Performance

For large objects, use efficient serialization:

```typescript
// For large arrays
serialize: (arr) => arr.join(','),
deserialize: (str) => str.split(','),

// For complex objects
serialize: (obj) => JSON.stringify(obj),
deserialize: (str) => JSON.parse(str),
```

### 2. Debounce Configuration

Balance responsiveness vs. performance:

```typescript
// High-frequency updates (typing)
debounceMs: 500

// Low-frequency updates (selections)
debounceMs: 100
```

### 3. Query Key Management

Include all state in query keys:

```typescript
const { data } = useQuery({
  queryKey: ['students', filters, page, pageSize, column, direction],
  queryFn: () => fetchStudents({ ...filters, page, pageSize, sortBy: column }),
});
```

### 4. Memory Management

Hooks automatically clean up on unmount. For long-running apps, pagination memory is limited to last 10 routes.

## Troubleshooting

### State Not Persisting

**Problem:** State resets on page reload.

**Solution:**
- Check `syncWithUrl: true` for usePersistedFilters
- Verify localStorage is enabled
- Check browser privacy settings

### URL Not Updating

**Problem:** URL doesn't reflect state changes.

**Solution:**
```typescript
// Ensure you're not using replace: true
const [value, setValue] = useRouteState({
  paramName: 'search',
  defaultValue: '',
  replace: false, // Use push, not replace
});
```

### Validation Errors

**Problem:** State keeps resetting to default.

**Solution:**
```typescript
// Check validation logic
validate: (val): val is T => {
  console.log('Validating:', val); // Debug
  return isValid(val);
},
onValidationError: (error) => {
  console.error('Validation failed:', error); // Debug
}
```

### Performance Issues

**Problem:** Excessive re-renders or localStorage writes.

**Solution:**
- Increase debounce delay
- Use memoization for computed values
- Check React DevTools for render frequency

### localStorage Quota Exceeded

**Problem:** localStorage quota exceeded error.

**Solution:**
- Reduce stored data size
- Clear old filters periodically
- Use compression for large objects

## Examples

See `useRouteState.examples.tsx` for comprehensive usage examples including:

1. Basic search with URL sync
2. Multi-select with array state
3. Date range with validation
4. Student list with persisted filters
5. Navigation with state preservation
6. Pagination with URL sync
7. Sortable table with persistence
8. Complete integration example

## Support

For issues or questions:

1. Check existing usage in `frontend/src/pages/`
2. Review examples in `useRouteState.examples.tsx`
3. Check tests in `useRouteState.test.ts`
4. Contact the frontend architecture team

## License

Copyright © 2024 White Cross Healthcare Platform. All rights reserved.
