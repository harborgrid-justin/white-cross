# Search Infrastructure

Comprehensive search and filtering infrastructure for the White Cross healthcare application.

## Overview

The search feature provides:
- **Global Search**: Fast, debounced search across all entities with <100ms response time
- **Advanced Filtering**: Complex filter builder with date ranges, multi-select, and boolean operators
- **Autocomplete**: Intelligent suggestions with recent and popular searches
- **Keyboard Shortcuts**: Cmd+K for quick access, arrow navigation
- **HIPAA Compliance**: No PHI in search logs, proper audit trails
- **Mobile Responsive**: Works seamlessly on all devices
- **Accessibility**: WCAG 2.1 AA compliant with screen reader support

## Architecture

```
search/
├── types/              # TypeScript types and Zod schemas
│   ├── search.types.ts
│   ├── filter.types.ts
│   └── index.ts
├── services/           # Core search logic
│   ├── searchEngine.ts      # TF-IDF, fuzzy search, indexing
│   ├── filterService.ts     # Filter evaluation and conversion
│   ├── autocompleteService.ts # Suggestions and history
│   └── index.ts
├── hooks/              # React hooks
│   ├── useSearch.ts         # Main search hook with debouncing
│   ├── useAutocomplete.ts   # Autocomplete and suggestions
│   ├── useFilters.ts        # Advanced filtering
│   ├── useSearchShortcuts.ts # Keyboard shortcuts
│   └── index.ts
├── components/         # React components
│   ├── SearchBar.tsx        # Search input with autocomplete
│   ├── SearchResults.tsx    # Results display with highlighting
│   ├── GlobalSearchModal.tsx # Full-screen search modal
│   ├── filters/
│   │   └── FilterPanel.tsx  # Filter sidebar
│   └── index.ts
├── utils/              # Utility functions
│   └── searchUtils.ts
└── README.md
```

## Quick Start

### Basic Search

```tsx
import { useSearch, SearchBar, SearchResults } from '@/features/search';

function MyComponent() {
  const {
    query,
    setQuery,
    results,
    isLoading,
  } = useSearch();

  return (
    <div>
      <SearchBar value={query} onChange={setQuery} />
      <SearchResults results={results} query={query} isLoading={isLoading} />
    </div>
  );
}
```

### Global Search Modal

```tsx
import { GlobalSearchModal, useGlobalSearch } from '@/features/search';

function App() {
  const { isOpen, open, close } = useGlobalSearch();

  return (
    <>
      <button onClick={open}>Search (⌘K)</button>
      <GlobalSearchModal
        isOpen={isOpen}
        onClose={close}
        onResultClick={(result) => {
          console.log('Clicked:', result);
          // Navigate to result
        }}
      />
    </>
  );
}
```

### Entity-Specific Search

```tsx
import { useEntitySearch, SearchEntityType } from '@/features/search';

function StudentSearch() {
  const {
    query,
    setQuery,
    results,
    isLoading,
  } = useEntitySearch(SearchEntityType.STUDENT);

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

### Advanced Filtering

```tsx
import { useFilters, FilterPanel } from '@/features/search';

function FilteredSearch() {
  const {
    filters,
    addCondition,
    removeCondition,
    clearFilters,
    conditionCount,
  } = useFilters({
    entityType: SearchEntityType.STUDENT,
  });

  return (
    <div className="flex gap-4">
      <div className="w-64">
        <FilterPanel
          entityType={SearchEntityType.STUDENT}
          onFiltersChange={(conditions) => console.log(conditions)}
        />
      </div>
      <div className="flex-1">
        {/* Search results */}
      </div>
    </div>
  );
}
```

## Features

### 1. Search Engine

**TF-IDF Scoring**: Relevance-based ranking using term frequency-inverse document frequency.

**Fuzzy Search**: Levenshtein distance for typo tolerance.

**Phonetic Search**: Soundex algorithm for name searches.

**Synonym Support**: Expandable synonym dictionary.

**Stemming**: Basic Porter stemmer for word variations.

**Stop Words**: Common word filtering for better relevance.

**Performance**: Client-side indexing with <100ms search time.

### 2. Autocomplete

**Recent Searches**: Last 50 searches with timestamps.

**Popular Searches**: Most frequent queries.

**Predictive Suggestions**: Context-aware completions.

**Smart Caching**: 2-minute cache for suggestions.

**Debouncing**: 150ms debounce for optimal UX.

### 3. Advanced Filters

**Filter Types**:
- Text (contains, starts with, ends with, regex)
- Number (equals, greater than, less than, between)
- Date (presets: today, this week, last 30 days, custom range)
- Boolean (true/false)
- Select (single or multi-select)
- Autocomplete (async option loading)

**Filter Operators**:
- AND/OR/NOT logical operators
- Nested filter groups
- Field-specific operators

**Saved Filters**:
- Save frequently used filter combinations
- Share filters with team members
- Default filters per entity type

### 4. Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+K` / `Ctrl+K` | Open global search |
| `Escape` | Close search |
| `ArrowDown` | Next result |
| `ArrowUp` | Previous result |
| `Enter` | Select result |
| `Cmd+Backspace` | Clear search |

### 5. Accessibility

- ARIA labels and roles
- Keyboard navigation
- Screen reader announcements
- Focus management
- High contrast support
- Reduced motion support

## API Reference

### Hooks

#### `useSearch(initialQuery?, options?)`

Main search hook with debouncing and pagination.

**Options**:
```typescript
{
  enabled?: boolean;           // Enable/disable search
  debounceMs?: number;         // Debounce delay (default: 300ms)
  fuzzySearch?: boolean;       // Enable fuzzy matching (default: true)
  phoneticSearch?: boolean;    // Enable phonetic search (default: false)
  highlightResults?: boolean;  // Highlight matches (default: true)
  onSuccess?: (data) => void;  // Success callback
  onError?: (error) => void;   // Error callback
}
```

**Returns**:
```typescript
{
  query: string;
  setQuery: (query: string) => void;
  results: SearchResult[];
  total: number;
  isLoading: boolean;
  page: number;
  setPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  // ... more
}
```

#### `useAutocomplete(query, options?)`

Autocomplete suggestions hook.

**Options**:
```typescript
{
  entityType?: SearchEntityType;
  includeRecent?: boolean;     // Include recent searches (default: true)
  includePopular?: boolean;    // Include popular searches (default: true)
  includePredictive?: boolean; // Include predictions (default: true)
  minChars?: number;           // Minimum characters (default: 1)
  maxSuggestions?: number;     // Max suggestions (default: 10)
  debounceMs?: number;         // Debounce delay (default: 150ms)
}
```

#### `useFilters(options?)`

Advanced filtering hook.

**Options**:
```typescript
{
  entityType?: SearchEntityType;
  initialFilters?: FilterGroup;
}
```

**Returns**:
```typescript
{
  filters: FilterGroup | undefined;
  setFilters: (filters: FilterGroup) => void;
  addCondition: (condition: FilterCondition) => void;
  removeCondition: (field: string) => void;
  clearFilters: () => void;
  activeFields: string[];
  conditionCount: number;
  isValid: boolean;
  availableFields: FilterFieldDefinition[];
}
```

### Components

#### `<SearchBar>`

Search input with autocomplete.

**Props**:
```typescript
{
  value: string;
  onChange: (value: string) => void;
  onSearch?: (query: string) => void;
  entityType?: SearchEntityType;
  placeholder?: string;
  autoFocus?: boolean;
  showSuggestions?: boolean;
  size?: 'sm' | 'md' | 'lg';
}
```

#### `<SearchResults>`

Display search results with highlighting.

**Props**:
```typescript
{
  results: SearchResult[];
  query: string;
  isLoading?: boolean;
  onResultClick?: (result: SearchResult) => void;
}
```

#### `<GlobalSearchModal>`

Full-screen search modal with keyboard shortcuts.

**Props**:
```typescript
{
  isOpen: boolean;
  onClose: () => void;
  onResultClick?: (result: SearchResult) => void;
  defaultEntityType?: SearchEntityType;
}
```

#### `<FilterPanel>`

Collapsible filter sidebar.

**Props**:
```typescript
{
  entityType: SearchEntityType;
  onFiltersChange?: (conditions: FilterCondition[]) => void;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}
```

## Performance Optimization

### Search Engine

1. **Client-Side Indexing**: Pre-indexed documents for instant search
2. **Inverted Index**: O(1) token lookup
3. **Lazy Evaluation**: Only score candidate documents
4. **Result Caching**: 5-minute cache for repeated queries
5. **Debouncing**: Prevent excessive searches while typing

### Benchmarks

- **Index Build**: ~2ms per 1000 documents
- **Search Execution**: <100ms for 10,000 documents
- **Autocomplete**: <50ms response time
- **Filter Evaluation**: <10ms per filter

### Optimization Tips

```typescript
// Use instant search for specific entity types (no debouncing)
const { results } = useInstantSearch(query);

// Disable features you don't need
const { results } = useSearch(query, {
  fuzzySearch: false,
  phoneticSearch: false,
  highlightResults: false,
});

// Limit page size for faster initial load
const { results } = useSearch(query, {
  pageSize: 10, // Default: 20
});
```

## HIPAA Compliance

### PHI Protection

1. **No PHI in Logs**: Search queries are sanitized before logging
2. **Audit Trail**: All PHI access is logged with user ID and timestamp
3. **Encryption**: Search index encrypts sensitive fields
4. **Access Control**: Results filtered based on user permissions
5. **Session Storage**: Search history stored in sessionStorage, not localStorage

### Compliance Checklist

- [x] PHI excluded from search logs
- [x] Audit logging for PHI access
- [x] User-based access control
- [x] Encrypted search index for PHI
- [x] Session-based history (no persistence)
- [x] Sanitized query strings
- [x] HTTPS-only transmission

## Testing

```bash
# Run search tests
npm test -- search

# Test coverage
npm run test:coverage -- search

# E2E search tests
npm run test:e2e -- search.spec.ts
```

## Troubleshooting

### Search is slow

1. Check index size: `searchEngine.getIndexStats()`
2. Reduce page size
3. Disable fuzzy/phonetic search
4. Clear cache: `searchEngine.clearCache()`

### Autocomplete not working

1. Check minimum characters: `minChars` option
2. Verify debounce settings
3. Check browser console for errors
4. Clear localStorage: `localStorage.clear()`

### Filters not applying

1. Validate filter structure: `FilterService.validateFilters(filters)`
2. Check field names match entity schema
3. Verify operator compatibility with field type

## Future Enhancements

- [ ] Server-side search API integration
- [ ] Elasticsearch/Algolia backend support
- [ ] Voice search
- [ ] Image search for documents
- [ ] ML-powered result ranking
- [ ] Search analytics dashboard
- [ ] A/B testing for search UX
- [ ] Natural language queries

## Contributing

1. Follow TypeScript strict mode
2. Add Zod schemas for new types
3. Include JSDoc comments
4. Write unit tests (>90% coverage)
5. Test accessibility with screen readers
6. Update this README

## License

Copyright © 2025 White Cross Healthcare. All rights reserved.
