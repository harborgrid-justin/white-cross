# Search Feature - Quick Start Guide

## Installation

The search feature is already integrated. No additional packages required.

## Basic Usage

### 1. Simple Search

```tsx
import { useSearch, SearchBar, SearchResults } from '@/features/search';

export default function SearchPage() {
  const { query, setQuery, results, isLoading } = useSearch();

  return (
    <div>
      <SearchBar value={query} onChange={setQuery} />
      <SearchResults results={results} query={query} isLoading={isLoading} />
    </div>
  );
}
```

### 2. Global Search Modal (Recommended)

```tsx
import { GlobalSearchModal, useGlobalSearch } from '@/features/search';

export default function Layout() {
  const { isOpen, open, close } = useGlobalSearch();

  return (
    <>
      <button onClick={open}>Search (⌘K)</button>

      <GlobalSearchModal
        isOpen={isOpen}
        onClose={close}
        onResultClick={(result) => {
          // Navigate to result
          router.push(`/${result.entityType}/${result.id}`);
        }}
      />
    </>
  );
}
```

### 3. Entity-Specific Search

```tsx
import { useEntitySearch, SearchEntityType } from '@/features/search';

export default function StudentSearch() {
  const { query, setQuery, results, isLoading } = useEntitySearch(
    SearchEntityType.STUDENT
  );

  return (
    <div>
      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search students..."
      />
      <SearchResults results={results} query={query} isLoading={isLoading} />
    </div>
  );
}
```

### 4. Search with Filters

```tsx
import { useSearch, useFilters, FilterPanel } from '@/features/search';

export default function FilteredSearch() {
  const { filters } = useFilters({
    entityType: SearchEntityType.STUDENT,
  });

  const { query, setQuery, results } = useSearch('', {
    filters, // Pass filters to search
  });

  return (
    <div className="flex gap-4">
      <FilterPanel entityType={SearchEntityType.STUDENT} />
      <div className="flex-1">
        <SearchBar value={query} onChange={setQuery} />
        <SearchResults results={results} query={query} />
      </div>
    </div>
  );
}
```

## Component Reference

### SearchBar

```tsx
<SearchBar
  value={query}
  onChange={setQuery}
  onSearch={(query) => console.log('Searched:', query)}
  placeholder="Search..."
  autoFocus
  showSuggestions
  size="md" // 'sm' | 'md' | 'lg'
/>
```

### SearchResults

```tsx
<SearchResults
  results={results}
  query={query}
  isLoading={isLoading}
  onResultClick={(result) => {
    router.push(getResultUrl(result));
  }}
/>
```

### GlobalSearchModal

```tsx
<GlobalSearchModal
  isOpen={isOpen}
  onClose={close}
  onResultClick={(result) => {
    router.push(getResultUrl(result));
  }}
  defaultEntityType={SearchEntityType.ALL}
/>
```

### FilterPanel

```tsx
<FilterPanel
  entityType={SearchEntityType.STUDENT}
  onFiltersChange={(conditions) => {
    console.log('Filters changed:', conditions);
  }}
  collapsible
  defaultExpanded
/>
```

## Hook Reference

### useSearch

```tsx
const {
  // Query
  query,
  setQuery,

  // Results
  results,
  total,
  isLoading,
  error,

  // Pagination
  page,
  setPage,
  nextPage,
  previousPage,
  hasNextPage,
  hasPreviousPage,

  // Entity & Sort
  entityType,
  setEntityType,
  sortBy,
  setSortBy,

  // Filters
  filters,
  setFilters,

  // Actions
  search,
  clearSearch,
  refetch,
} = useSearch(initialQuery, options);
```

### useFilters

```tsx
const {
  // Current filters
  filters,
  setFilters,
  clearFilters,

  // Condition management
  addCondition,
  removeCondition,
  updateCondition,

  // Metadata
  activeFields,
  conditionCount,
  isValid,
  validationErrors,

  // Field definitions
  availableFields,
  getFieldDefinition,
} = useFilters({ entityType });
```

### useAutocomplete

```tsx
const {
  suggestions,
  isLoading,
  getSuggestions,
  clearSuggestions,
  addToHistory,
  clearHistory,
  getHistory,
} = useAutocomplete(query, {
  entityType,
  includeRecent: true,
  includePopular: true,
  includePredictive: true,
  maxSuggestions: 10,
});
```

## Entity Types

```typescript
enum SearchEntityType {
  ALL = 'all',
  STUDENT = 'student',
  MEDICATION = 'medication',
  HEALTH_RECORD = 'health_record',
  DOCUMENT = 'document',
  APPOINTMENT = 'appointment',
  INCIDENT = 'incident',
  EMERGENCY_CONTACT = 'emergency_contact',
  INVENTORY_ITEM = 'inventory_item',
  USER = 'user',
}
```

## Filter Examples

### Text Filter

```typescript
{
  field: 'name',
  operator: FilterOperator.CONTAINS,
  value: 'John'
}
```

### Date Range Filter

```typescript
{
  field: 'enrollmentDate',
  operator: FilterOperator.BETWEEN,
  value: [new Date('2024-01-01'), new Date('2024-12-31')]
}
```

### Multi-Select Filter

```typescript
{
  field: 'grade',
  operator: FilterOperator.IN,
  value: ['9', '10', '11', '12']
}
```

### Complex Filter (AND/OR)

```typescript
{
  operator: SearchOperator.AND,
  conditions: [
    {
      field: 'isActive',
      operator: FilterOperator.EQUALS,
      value: true
    },
    {
      operator: SearchOperator.OR,
      conditions: [
        { field: 'grade', operator: FilterOperator.EQUALS, value: '10' },
        { field: 'grade', operator: FilterOperator.EQUALS, value: '11' }
      ]
    }
  ]
}
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + K` | Open global search |
| `Escape` | Close search |
| `ArrowDown` | Next result |
| `ArrowUp` | Previous result |
| `Enter` | Select result |
| `Cmd/Ctrl + Backspace` | Clear search |

## Performance Tips

### 1. Disable Unused Features

```tsx
const { results } = useSearch(query, {
  fuzzySearch: false,      // Disable if not needed
  phoneticSearch: false,   // Disable for better performance
  highlightResults: false, // Disable highlighting
});
```

### 2. Adjust Debounce Time

```tsx
const { results } = useSearch(query, {
  debounceMs: 500, // Increase for slower typing
});
```

### 3. Limit Page Size

```tsx
const { results } = useSearch(query, {
  pageSize: 10, // Reduce for faster initial load
});
```

### 4. Use Instant Search Sparingly

```tsx
// Only for specific entity searches
const { results } = useInstantSearch(query);
```

## Common Patterns

### Search with Router Integration

```tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useSearch } from '@/features/search';
import { useEffect } from 'react';

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const { query, setQuery, results } = useSearch(initialQuery);

  // Update URL on query change
  useEffect(() => {
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  }, [query, router]);

  return (
    <div>
      <SearchBar value={query} onChange={setQuery} />
      <SearchResults results={results} query={query} />
    </div>
  );
}
```

### Search with Loading State

```tsx
export default function SearchWithLoading() {
  const { query, setQuery, results, isLoading, isFetching } = useSearch();

  return (
    <div>
      <SearchBar value={query} onChange={setQuery} />

      {isLoading ? (
        <div>Loading initial results...</div>
      ) : isFetching ? (
        <div>Updating results...</div>
      ) : (
        <SearchResults results={results} query={query} />
      )}
    </div>
  );
}
```

### Search with Error Handling

```tsx
export default function SearchWithErrorHandling() {
  const { query, setQuery, results, error, refetch } = useSearch(query, {
    onError: (error) => {
      console.error('Search failed:', error);
      toast.error('Search failed. Please try again.');
    },
  });

  if (error) {
    return (
      <div>
        <p>Search failed: {error.message}</p>
        <button onClick={() => refetch()}>Retry</button>
      </div>
    );
  }

  return <SearchResults results={results} query={query} />;
}
```

## Troubleshooting

### Issue: Search is slow

**Solution**: Reduce page size or disable fuzzy search:
```tsx
const { results } = useSearch(query, {
  pageSize: 10,
  fuzzySearch: false,
});
```

### Issue: Autocomplete not showing

**Solution**: Check minimum characters and enable flag:
```tsx
const { suggestions } = useAutocomplete(query, {
  minChars: 1,  // Lower minimum
  enabled: true, // Ensure enabled
});
```

### Issue: Filters not working

**Solution**: Verify filter structure:
```tsx
const { filters, isValid, validationErrors } = useFilters({ entityType });

console.log('Filters valid:', isValid);
console.log('Errors:', validationErrors);
```

## Best Practices

1. **Use Global Search**: Prefer `GlobalSearchModal` for main search UI
2. **Debounce Properly**: Default 300ms is good for most cases
3. **Handle Errors**: Always provide error handling
4. **Respect HIPAA**: Don't log PHI in search queries
5. **Test Accessibility**: Verify keyboard navigation works
6. **Monitor Performance**: Track search execution time

## Need Help?

- 📖 Full Documentation: `/src/features/search/README.md`
- 📊 Implementation Report: `/SEARCH_IMPLEMENTATION_REPORT.md`
- 🐛 Report Issues: Create GitHub issue
- 💬 Questions: Ask in team Slack channel

## Examples

Full working examples available in:
- `/src/features/search/examples/` (coming soon)
- `/src/app/search/page.tsx` (search page)
- `/src/components/layout/Header.tsx` (global search)
