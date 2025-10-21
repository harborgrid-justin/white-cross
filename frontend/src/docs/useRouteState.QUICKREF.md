# Route State Hooks - Quick Reference Card

## Import Statement

```typescript
import {
  useRouteState,
  usePersistedFilters,
  useNavigationState,
  usePageState,
  useSortState,
} from '@/hooks/useRouteState';
```

---

## 1. useRouteState

**Purpose:** Persist any state in URL query parameters

### Basic Example
```typescript
const [search, setSearch, clearSearch] = useRouteState({
  paramName: 'search',
  defaultValue: '',
});
```

### Array Example
```typescript
const [ids, setIds] = useRouteState({
  paramName: 'selected',
  defaultValue: [] as string[],
  serialize: (arr) => arr.join(','),
  deserialize: (str) => str ? str.split(',') : [],
});
```

### Object Example
```typescript
const [filters, setFilters] = useRouteState<FilterType>({
  paramName: 'filters',
  defaultValue: { grade: '', status: 'active' },
  validate: (val): val is FilterType => isValid(val),
});
```

---

## 2. usePersistedFilters

**Purpose:** Persist filter state with localStorage + optional URL sync

### Basic Example
```typescript
const {
  filters,          // Current filter state
  updateFilter,     // Update single filter
  setFilters,       // Update all filters
  clearFilters,     // Reset to defaults
  isRestored,       // True after localStorage load
} = usePersistedFilters<MyFilters>({
  storageKey: 'my-filters',
  defaultFilters: { search: '', grade: '' },
  debounceMs: 500,
  syncWithUrl: true,
});
```

### Usage with Query
```typescript
const { data } = useQuery({
  queryKey: ['items', filters],
  queryFn: () => fetchItems(filters),
  enabled: isRestored, // Important!
});
```

---

## 3. useNavigationState

**Purpose:** Track navigation history with state preservation

### Basic Example
```typescript
const {
  previousPath,     // Path of previous route
  previousState,    // State from previous route
  navigateWithState,// Navigate with state
  navigateBack,     // Back with state restore
  currentScroll,    // Current scroll position
} = useNavigationState();
```

### Navigate with State
```typescript
const handleView = (id: string) => {
  navigateWithState(`/students/${id}`, {
    from: 'list',
    filters: currentFilters,
  });
};
```

### Navigate Back
```typescript
const handleBack = () => {
  navigateBack('/students'); // Restores scroll position
};
```

---

## 4. usePageState

**Purpose:** Pagination state with URL sync

### Basic Example
```typescript
const {
  page,             // Current page number
  pageSize,         // Current page size
  setPage,          // Set page number
  setPageSize,      // Set page size (resets to page 1)
  resetPage,        // Reset to page 1
} = usePageState({
  defaultPage: 1,
  defaultPageSize: 20,
  pageSizeOptions: [10, 20, 50, 100],
  resetOnFilterChange: true,
});
```

### Usage
```typescript
// Set page
setPage(2);
setPage(prev => prev + 1);

// Set page size
setPageSize(50);

// Reset
resetPage();
```

---

## 5. useSortState

**Purpose:** Sortable columns with persistence

### Basic Example
```typescript
type Columns = 'name' | 'date' | 'status';

const {
  column,           // Current sort column
  direction,        // Current direction ('asc' | 'desc')
  sortBy,           // Sort by specific column
  toggleSort,       // Toggle sort (asc → desc → default)
  clearSort,        // Clear to default
  getSortIndicator, // Get arrow indicator
  getSortClass,     // Get CSS class
} = useSortState<Columns>({
  validColumns: ['name', 'date', 'status'],
  defaultColumn: 'name',
  defaultDirection: 'asc',
  persistPreference: true,
  storageKey: 'my-sort',
});
```

### Table Header Example
```typescript
<th
  onClick={() => toggleSort('name')}
  className={`sortable ${getSortClass('name')}`}
>
  Name {getSortIndicator('name')}
</th>
```

---

## Common Patterns

### Pattern 1: Complete List Page
```typescript
function MyListPage() {
  // Filters
  const { filters, updateFilter, clearFilters, isRestored } =
    usePersistedFilters<MyFilters>({
      storageKey: 'my-filters',
      defaultFilters: { search: '', status: 'active' },
      syncWithUrl: true,
    });

  // Pagination
  const { page, pageSize, setPage, setPageSize } = usePageState({
    resetOnFilterChange: true,
  });

  // Sorting
  const { column, direction, toggleSort } = useSortState<MyColumns>({
    validColumns: ['name', 'date'],
    persistPreference: true,
  });

  // Query
  const { data, isLoading } = useQuery({
    queryKey: ['items', filters, page, pageSize, column, direction],
    queryFn: () => fetchItems({ ...filters, page, pageSize, sortBy: column, sortDir: direction }),
    enabled: isRestored,
  });

  return (
    <div>
      {/* Filters */}
      <input
        value={filters.search}
        onChange={(e) => updateFilter('search', e.target.value)}
      />

      {/* Table */}
      <table>
        <thead>
          <tr>
            <th onClick={() => toggleSort('name')}>Name</th>
            <th onClick={() => toggleSort('date')}>Date</th>
          </tr>
        </thead>
        <tbody>
          {data?.items.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.date}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div>
        <button onClick={() => setPage(p => p - 1)} disabled={page === 1}>
          Previous
        </button>
        <span>Page {page}</span>
        <button onClick={() => setPage(p => p + 1)}>Next</button>
      </div>
    </div>
  );
}
```

### Pattern 2: Master-Detail Navigation
```typescript
// List Page
function ListPage() {
  const { filters } = usePersistedFilters({ ... });
  const { page } = usePageState();
  const { navigateWithState } = useNavigationState();

  const handleView = (id: string) => {
    navigateWithState(`/items/${id}`, { filters, page });
  };

  return <ItemList onViewItem={handleView} />;
}

// Detail Page
function DetailPage() {
  const { previousState, navigateBack } = useNavigationState();

  const handleBack = () => {
    navigateBack('/items'); // Restores filters and page
  };

  return (
    <div>
      <button onClick={handleBack}>Back</button>
      {/* Item details */}
    </div>
  );
}
```

### Pattern 3: Quick Filters
```typescript
const { updateFilter, setFilters } = usePersistedFilters({ ... });

// Single filter
<button onClick={() => updateFilter('status', 'active')}>
  Show Active
</button>

// Multiple filters
<button onClick={() => setFilters({ status: 'active', hasAllergies: true })}>
  Active with Allergies
</button>
```

---

## Type Definitions Template

```typescript
// Define your filter type
interface MyFilters {
  search: string;
  status: string;
  category: string;
}

// Define your sortable columns
type MyColumns = 'name' | 'date' | 'status' | 'category';

// Use in hooks
const { filters } = usePersistedFilters<MyFilters>({ ... });
const { column } = useSortState<MyColumns>({ ... });
```

---

## Healthcare Compliance Checklist

✅ **Safe to Persist:**
- Filter selections (grade, status, type)
- Pagination (page, pageSize)
- Sort preferences (column, direction)
- UI state (view mode, collapsed panels)

❌ **Never Persist:**
- Patient names
- Medical record numbers
- Diagnosis information
- Treatment details
- Any PHI (Protected Health Information)

---

## Common Options

### useRouteState Options
```typescript
{
  paramName: string;              // Required
  defaultValue: T;                // Required
  serialize?: (value: T) => string;
  deserialize?: (value: string) => T;
  validate?: (value: any) => value is T;
  onValidationError?: (error: Error) => void;
  replace?: boolean;              // Default: false
}
```

### usePersistedFilters Options
```typescript
{
  storageKey: string;             // Required
  defaultFilters: T;              // Required
  debounceMs?: number;            // Default: 300
  syncWithUrl?: boolean;          // Default: false
  validate?: (filters: T) => boolean;
}
```

### usePageState Options
```typescript
{
  defaultPage?: number;           // Default: 1
  defaultPageSize?: number;       // Default: 10
  pageSizeOptions?: number[];     // Default: [10, 20, 50, 100]
  pageParam?: string;             // Default: 'page'
  pageSizeParam?: string;         // Default: 'pageSize'
  resetOnFilterChange?: boolean;  // Default: true
}
```

### useSortState Options
```typescript
{
  validColumns: T[];              // Required
  defaultColumn?: T | null;       // Default: null
  defaultDirection?: 'asc' | 'desc'; // Default: 'asc'
  columnParam?: string;           // Default: 'sortBy'
  directionParam?: string;        // Default: 'sortDir'
  persistPreference?: boolean;    // Default: false
  storageKey?: string;            // Default: 'sort-preference'
}
```

---

## Troubleshooting Quick Fixes

### Problem: State not restoring
```typescript
// Add isRestored check
const { filters, isRestored } = usePersistedFilters({ ... });
const { data } = useQuery({
  enabled: isRestored, // Add this!
});
```

### Problem: Too many renders
```typescript
// Increase debounce
const { filters } = usePersistedFilters({
  debounceMs: 500, // Increase this
});
```

### Problem: URL too long
```typescript
// Don't sync with URL
const { filters } = usePersistedFilters({
  syncWithUrl: false, // Only localStorage
});
```

### Problem: Validation failing
```typescript
// Add error handler
const [value] = useRouteState({
  validate: (val) => isValid(val),
  onValidationError: (error) => {
    console.error('Validation error:', error);
    toast.error('Invalid URL parameters');
  },
});
```

---

## Testing with Cypress

```typescript
// Test filter persistence
cy.visit('/students');
cy.get('[data-testid="grade-filter"]').select('5');
cy.url().should('include', 'grade=5');
cy.reload();
cy.get('[data-testid="grade-filter"]').should('have.value', '5');

// Test pagination
cy.visit('/students');
cy.contains('Next').click();
cy.url().should('include', 'page=2');
cy.reload();
cy.url().should('include', 'page=2');

// Test sort
cy.visit('/students');
cy.contains('th', 'Name').click();
cy.url().should('include', 'sortBy=name');
```

---

## Resources

- **Full Documentation:** `useRouteState.README.md`
- **Usage Examples:** `useRouteState.examples.tsx`
- **Integration Guide:** `useRouteState.integration.md`
- **Test Examples:** `useRouteState.test.ts`
- **Summary:** `useRouteState.SUMMARY.md`

---

**Print this page for quick reference while coding!**
