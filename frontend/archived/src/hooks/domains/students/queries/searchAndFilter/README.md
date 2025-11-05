# Student Search and Filter Module

This module provides comprehensive search, filtering, and sorting functionality for student data. The original 777-line monolithic file has been refactored into smaller, maintainable modules.

## Module Structure

```
searchAndFilter/
├── README.md                          # This file
├── index.ts                           # Main export point
├── defaultExport.ts                   # Default export for backward compatibility
├── searchFilterTypes.ts               # Type definitions and constants (117 LOC)
├── useStudentSearch.ts                # Search functionality (206 LOC)
├── useStudentFilter.ts                # Filter functionality (152 LOC)
├── useStudentSort.ts                  # Sorting functionality (106 LOC)
├── useSavedSearches.ts                # Saved search management (156 LOC)
└── useStudentSearchAndFilter.ts       # Composite hook (185 LOC)
```

## Files Overview

### searchFilterTypes.ts
Exports all type definitions and constants:
- `ApiError`: Enhanced error type for API responses
- `SearchSuggestion`: Search suggestion interface
- `AdvancedFilters`: Extended filter options
- `SortOption`: Sort configuration interface
- `SavedSearch`: Saved search configuration
- `SORT_OPTIONS`: Predefined sort options array
- Configuration types for all hooks

### useStudentSearch.ts
Real-time search with debouncing and autocomplete:
- Debounced search input
- Search suggestions (recent searches, grade patterns)
- Configurable minimum query length
- Recent search tracking
- Full control over search state

### useStudentFilter.ts
Advanced filtering with multiple criteria:
- Multi-field filtering
- Auto-apply with debouncing
- Manual apply mode
- Active filter counting
- Filter change detection

### useStudentSort.ts
Client-side sorting functionality:
- Multiple sort criteria
- Support for computed fields (fullName, enrollmentDate)
- Null/undefined handling
- Direction toggling
- Memoized sorting for performance

### useSavedSearches.ts
Saved search configuration management:
- localStorage persistence
- Save/load/delete/update operations
- Default search support
- Last used tracking
- Search naming and organization

### useStudentSearchAndFilter.ts
Composite hook combining all features:
- Unified interface for search + filter + sort
- Combined result management
- Saved search integration
- Single source of truth for student data
- Optimized loading states

## Usage Examples

### Basic Search

```tsx
import { useStudentSearch } from '@/hooks/domains/students/queries/searchAndFilter';

function StudentSearchBar() {
  const {
    query,
    setQuery,
    results,
    suggestions,
    isSearching,
    clearSearch
  } = useStudentSearch('', {
    debounceMs: 300,
    enableSuggestions: true,
    minQueryLength: 2
  });

  return (
    <SearchInput
      value={query}
      onChange={setQuery}
      suggestions={suggestions}
      loading={isSearching}
      onClear={clearSearch}
      results={results}
    />
  );
}
```

### Advanced Filtering

```tsx
import { useAdvancedFilters } from '@/hooks/domains/students/queries/searchAndFilter';

function StudentFilterPanel() {
  const {
    filters,
    updateFilter,
    clearFilters,
    results,
    activeFilterCount
  } = useAdvancedFilters({
    isActive: true
  }, {
    autoApply: true,
    debounceMs: 500
  });

  return (
    <FilterPanel
      filters={filters}
      onFilterChange={updateFilter}
      onClear={clearFilters}
      resultCount={results.length}
      activeCount={activeFilterCount}
    />
  );
}
```

### Sorting

```tsx
import { useStudentSorting, SORT_OPTIONS } from '@/hooks/domains/students/queries/searchAndFilter';

function StudentList({ students }) {
  const {
    sortedStudents,
    sortBy,
    updateSort,
    toggleDirection
  } = useStudentSorting(students);

  return (
    <div>
      <SortSelector
        options={SORT_OPTIONS}
        current={sortBy}
        onChange={updateSort}
      />
      <StudentTable students={sortedStudents} />
    </div>
  );
}
```

### Complete Search Interface

```tsx
import { useStudentSearchAndFilter } from '@/hooks/domains/students/queries/searchAndFilter';

function StudentManagementPage() {
  const {
    // Search
    query,
    setQuery,
    suggestions,

    // Filters
    filters,
    updateFilter,
    clearFilters,
    activeFilterCount,

    // Sorting
    sortBy,
    updateSort,

    // Results
    results,
    isLoading,

    // Saved searches
    savedSearches,
    saveCurrentSearch,
    loadSearch,

    // Actions
    clearAll
  } = useStudentSearchAndFilter({
    initialQuery: '',
    initialFilters: { isActive: true },
    autoApply: true,
    enableSuggestions: true
  });

  return (
    <div>
      <SearchBar value={query} onChange={setQuery} />
      <FilterPanel filters={filters} onChange={updateFilter} />
      <SavedSearches
        searches={savedSearches}
        onSave={saveCurrentSearch}
        onLoad={loadSearch}
      />
      <StudentTable
        students={results}
        sortBy={sortBy}
        onSort={updateSort}
        loading={isLoading}
      />
    </div>
  );
}
```

## Backward Compatibility

All exports maintain the exact same API as the original implementation. Existing imports will continue to work:

```tsx
// All of these import styles continue to work
import { useStudentSearch } from '@/hooks/domains/students/queries/searchAndFilter';
import { useAdvancedFilters } from '@/hooks/domains/students/searchAndFilter';
import { SORT_OPTIONS } from './searchAndFilter';

// Default import also works
import searchAndFilter from '@/hooks/domains/students/queries/searchAndFilter';
searchAndFilter.useStudentSearch();
```

## Type Safety

All hooks are fully typed with TypeScript:
- Generic type support for filter updates
- Strict type checking for sort fields
- Error types for API responses
- Comprehensive prop interfaces

## Performance Optimizations

- Debounced search input (configurable delay)
- Debounced filter application (configurable delay)
- Memoized sorting to prevent unnecessary recalculations
- Optimized re-renders with useCallback and useMemo
- Query result caching via React Query
- Recent search deduplication

## Testing Considerations

When testing components using these hooks:
- Mock `@tanstack/react-query` for query hooks
- Mock localStorage for saved searches
- Use fake timers for debouncing tests
- Test filter application edge cases
- Verify sort stability for equal values

## Migration Notes

The original `searchAndFilter.ts` file (777 lines) has been preserved as `searchAndFilter.ts.backup` and can be removed after confirming the refactored version works correctly.

No code changes are required in files that import from this module - the new structure maintains complete backward compatibility through the index.ts re-export file.

## Future Improvements

Potential enhancements:
- Server-side pagination support
- Advanced query builder UI
- Filter presets/templates
- Export search results
- Search analytics tracking
- Multi-language search support
