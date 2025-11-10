/**
 * @fileoverview Search & Filter CMS Kit - Enterprise content search and filtering system
 *
 * Comprehensive toolkit for CMS search, filtering, faceted search, sorting, and result management
 * with full-text search, fuzzy matching, autocomplete, saved searches, and analytics.
 *
 * @module reuse/frontend/search-filter-cms-kit
 * @version 1.0.0
 *
 * @example
 * ```tsx
 * import { useSearch, FilterPanel, SearchResults } from '@/reuse/frontend/search-filter-cms-kit';
 *
 * function ContentSearch() {
 *   const { results, loading, search } = useSearch({
 *     onSearch: (query) => console.log('Searching:', query),
 *   });
 *
 *   return (
 *     <>
 *       <SearchBar onSearch={search} />
 *       <FilterPanel />
 *       <SearchResults results={results} loading={loading} />
 *     </>
 *   );
 * }
 * ```
 */
import React, { ReactNode } from 'react';
/**
 * Search query configuration
 */
export interface SearchQuery {
    q?: string;
    filters?: FilterCondition[];
    facets?: FacetSelection[];
    sort?: SortOption;
    page?: number;
    pageSize?: number;
    operator?: 'AND' | 'OR';
    type?: 'simple' | 'advanced' | 'boolean';
    fields?: string[];
    boost?: Record<string, number>;
    includePhrase?: boolean;
    fuzziness?: number;
    highlightContext?: number;
}
/**
 * Filter condition for search
 */
export interface FilterCondition {
    id: string;
    field: string;
    operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'gt' | 'gte' | 'lt' | 'lte' | 'between' | 'in' | 'nin';
    value: any;
    label?: string;
    type?: 'text' | 'number' | 'date' | 'select' | 'range' | 'tag';
}
/**
 * Filter configuration
 */
export interface FilterConfig {
    id: string;
    label: string;
    field: string;
    type: 'text' | 'number' | 'date' | 'daterange' | 'select' | 'multiselect' | 'range' | 'checkbox' | 'tag';
    options?: FilterOption[];
    operators?: string[];
    defaultValue?: any;
    placeholder?: string;
    min?: number;
    max?: number;
    step?: number;
    dateFormat?: string;
    multiple?: boolean;
    searchable?: boolean;
    collapsible?: boolean;
    defaultCollapsed?: boolean;
    sortOptions?: boolean;
    helpText?: string;
}
/**
 * Filter option
 */
export interface FilterOption {
    label: string;
    value: string | number | boolean;
    count?: number;
    disabled?: boolean;
    icon?: ReactNode;
    color?: string;
}
/**
 * Facet selection
 */
export interface FacetSelection {
    field: string;
    values: (string | number)[];
}
/**
 * Facet data for faceted search
 */
export interface FacetData {
    field: string;
    label: string;
    type: 'terms' | 'numeric' | 'date';
    values: FacetValue[];
    missing?: number;
    total?: number;
}
/**
 * Facet value
 */
export interface FacetValue {
    label: string;
    value: string | number;
    count: number;
    selected?: boolean;
}
/**
 * Search result item
 */
export interface SearchResultItem {
    id: string;
    title: string;
    summary?: string;
    content?: string;
    url?: string;
    image?: string;
    type?: string;
    author?: string;
    date?: string;
    tags?: string[];
    score?: number;
    highlight?: SearchHighlight;
    metadata?: Record<string, any>;
}
/**
 * Search highlighting
 */
export interface SearchHighlight {
    [field: string]: string[];
}
/**
 * Search results with pagination
 */
export interface SearchResults {
    items: SearchResultItem[];
    total: number;
    page: number;
    pageSize: number;
    pageCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    facets: FacetData[];
    appliedFilters: FilterCondition[];
    suggestions?: SearchSuggestion[];
}
/**
 * Search suggestion
 */
export interface SearchSuggestion {
    text: string;
    type: 'search' | 'filter' | 'related';
    priority?: number;
    count?: number;
}
/**
 * Sort option
 */
export interface SortOption {
    field: string;
    direction: 'asc' | 'desc';
    label?: string;
    type?: 'string' | 'number' | 'date';
}
/**
 * Search state
 */
export interface SearchState {
    query: SearchQuery;
    results: SearchResults | null;
    loading: boolean;
    error: string | null;
    suggestions: SearchSuggestion[];
    recentSearches: string[];
    savedSearches: SavedSearch[];
}
/**
 * Saved search
 */
export interface SavedSearch {
    id: string;
    name: string;
    query: SearchQuery;
    createdAt: Date;
    updatedAt: Date;
    description?: string;
    tags?: string[];
}
/**
 * Search metrics
 */
export interface SearchMetrics {
    query: string;
    resultsCount: number;
    executionTime: number;
    timestamp: Date;
    userId?: string;
    sessionId?: string;
    filters?: FilterCondition[];
    facetsUsed?: string[];
}
/**
 * Search analytics
 */
export interface SearchAnalytics {
    totalSearches: number;
    averageResultsPerSearch: number;
    topSearches: Array<{
        query: string;
        count: number;
    }>;
    topFilters: Array<{
        field: string;
        count: number;
    }>;
    noResultSearches: string[];
    averageExecutionTime: number;
    clickThroughRate?: number;
}
/**
 * Main search hook for handling search queries and results
 *
 * @param {Object} options - Configuration options
 * @returns {Object} Search state and methods
 *
 * @example
 * ```tsx
 * const { results, loading, search, setFilters } = useSearch({
 *   pageSize: 20,
 *   onSearch: (query) => fetchResults(query),
 * });
 * ```
 */
export declare const useSearch: (options?: {
    pageSize?: number;
    onSearch?: (query: SearchQuery) => Promise<SearchResults>;
    onError?: (error: Error) => void;
    debounceMs?: number;
}) => any;
/**
 * Hook for managing search filters
 *
 * @param {FilterConfig[]} config - Filter configurations
 * @returns {Object} Filter state and methods
 *
 * @example
 * ```tsx
 * const { filters, setFilter, clearFilters } = useFilters(filterConfigs);
 * ```
 */
export declare const useFilters: (config: FilterConfig[]) => {
    filters: any;
    activeFilters: any;
    setFilter: any;
    removeFilter: any;
    clearFilters: any;
    toggleFilter: any;
    config: FilterConfig[];
};
/**
 * Hook for faceted search with aggregation
 *
 * @param {Object} options - Configuration options
 * @returns {Object} Faceted search state and methods
 *
 * @example
 * ```tsx
 * const { facets, toggleFacet, selectedFacets } = useFacetedSearch({
 *   onFacetChange: (facets) => performSearch(facets),
 * });
 * ```
 */
export declare const useFacetedSearch: (options?: {
    onFacetChange?: (facets: FacetSelection[]) => void;
    maxFacetValues?: number;
}) => {
    facets: any;
    setFacets: any;
    selectedFacets: any;
    toggleFacet: any;
    setSelectedFacets: any;
};
/**
 * SearchBar component for entering search queries
 *
 * @param {Object} props - Component props
 * @returns {ReactNode} Rendered component
 *
 * @example
 * ```tsx
 * <SearchBar
 *   onSearch={(query) => handleSearch(query)}
 *   placeholder="Search content..."
 *   suggestions={suggestions}
 * />
 * ```
 */
export declare const SearchBar: React.FC<{
    onSearch: (query: string) => void;
    placeholder?: string;
    suggestions?: SearchSuggestion[];
    onSuggestionSelect?: (suggestion: SearchSuggestion) => void;
    clearable?: boolean;
    autoFocus?: boolean;
    className?: string;
}>;
/**
 * FilterPanel component for managing filters
 *
 * @param {Object} props - Component props
 * @returns {ReactNode} Rendered component
 *
 * @example
 * ```tsx
 * <FilterPanel
 *   filters={filterConfigs}
 *   activeFilters={activeFilters}
 *   onFilterChange={handleFilterChange}
 * />
 * ```
 */
export declare const FilterPanel: React.FC<{
    filters: FilterConfig[];
    activeFilters?: FilterCondition[];
    onFilterChange?: (filter: FilterCondition) => void;
    onClearAll?: () => void;
    className?: string;
    collapsible?: boolean;
}>;
/**
 * SearchResults component for displaying search results
 *
 * @param {Object} props - Component props
 * @returns {ReactNode} Rendered component
 *
 * @example
 * ```tsx
 * <SearchResults
 *   results={searchResults}
 *   loading={isLoading}
 *   onItemClick={handleItemClick}
 * />
 * ```
 */
export declare const SearchResults: React.FC<{
    results?: SearchResultItem[];
    loading?: boolean;
    error?: string;
    onItemClick?: (item: SearchResultItem) => void;
    className?: string;
    emptyMessage?: string;
}>;
/**
 * FacetList component for displaying faceted search options
 *
 * @param {Object} props - Component props
 * @returns {ReactNode} Rendered component
 *
 * @example
 * ```tsx
 * <FacetList
 *   facets={facetData}
 *   selectedValues={selectedFacets}
 *   onFacetChange={handleFacetChange}
 * />
 * ```
 */
export declare const FacetList: React.FC<{
    facets: FacetData[];
    selectedValues?: Record<string, (string | number)[]>;
    onFacetChange?: (field: string, value: string | number, selected: boolean) => void;
    maxVisible?: number;
    className?: string;
}>;
/**
 * Hook for full-text search with relevance scoring
 *
 * @param {Object} options - Configuration options
 * @returns {Object} Full-text search state and methods
 *
 * @example
 * ```tsx
 * const { results, search } = useFullTextSearch({
 *   fields: ['title', 'content'],
 *   boost: { title: 2, content: 1 },
 * });
 * ```
 */
export declare const useFullTextSearch: (options?: {
    fields?: string[];
    boost?: Record<string, number>;
    minScore?: number;
    onSearch?: (query: string, results: SearchResultItem[]) => void;
}) => {
    results: any;
    loading: any;
    search: any;
};
/**
 * Hook for fuzzy search with typo tolerance
 *
 * @param {Object} options - Configuration options
 * @returns {Object} Fuzzy search state and methods
 *
 * @example
 * ```tsx
 * const { results, search } = useFuzzySearch({
 *   fuzziness: 1,
 *   prefixLength: 0,
 * });
 * ```
 */
export declare const useFuzzySearch: (options?: {
    fuzziness?: number;
    prefixLength?: number;
    maxExpansions?: number;
    onSearch?: (query: string, results: SearchResultItem[]) => void;
}) => {
    results: any;
    loading: any;
    search: any;
};
/**
 * Hook for autocomplete suggestions
 *
 * @param {Object} options - Configuration options
 * @returns {Object} Autocomplete state and methods
 *
 * @example
 * ```tsx
 * const { suggestions, getSuggestions } = useAutoComplete({
 *   source: 'api',
 *   minChars: 2,
 *   maxResults: 10,
 * });
 * ```
 */
export declare const useAutoComplete: (options?: {
    source?: "local" | "api" | "hybrid";
    minChars?: number;
    maxResults?: number;
    onSelect?: (suggestion: SearchSuggestion) => void;
}) => {
    suggestions: any;
    loading: any;
    getSuggestions: any;
};
/**
 * Hook for date range filtering
 *
 * @param {Object} options - Configuration options
 * @returns {Object} Date filter state and methods
 *
 * @example
 * ```tsx
 * const { startDate, endDate, setDateRange } = useFilterByDate({
 *   format: 'yyyy-MM-dd',
 * });
 * ```
 */
export declare const useFilterByDate: (options?: {
    format?: string;
    timezone?: string;
    onDateChange?: (startDate: Date, endDate: Date) => void;
}) => {
    startDate: any;
    endDate: any;
    setDateRange: any;
    clearDates: any;
};
/**
 * Hook for status-based filtering
 *
 * @param {Object} options - Configuration options
 * @returns {Object} Status filter state and methods
 *
 * @example
 * ```tsx
 * const { selectedStatuses, toggleStatus } = useFilterByStatus({
 *   statuses: ['published', 'draft', 'archived'],
 * });
 * ```
 */
export declare const useFilterByStatus: (options?: {
    statuses?: string[];
    onStatusChange?: (statuses: string[]) => void;
}) => {
    selectedStatuses: any;
    toggleStatus: any;
    setStatuses: any;
};
/**
 * Hook for category-based filtering
 *
 * @param {Object} options - Configuration options
 * @returns {Object} Category filter state and methods
 *
 * @example
 * ```tsx
 * const { selectedCategories, toggleCategory } = useFilterByCategory({
 *   hierarchical: true,
 * });
 * ```
 */
export declare const useFilterByCategory: (options?: {
    hierarchical?: boolean;
    onCategoryChange?: (categories: string[]) => void;
}) => {
    selectedCategories: any;
    toggleCategory: any;
    setCategories: any;
};
/**
 * Hook for tag-based filtering
 *
 * @param {Object} options - Configuration options
 * @returns {Object} Tag filter state and methods
 *
 * @example
 * ```tsx
 * const { selectedTags, addTag, removeTag } = useFilterByTags({
 *   maxTags: 10,
 * });
 * ```
 */
export declare const useFilterByTags: (options?: {
    maxTags?: number;
    onTagsChange?: (tags: string[]) => void;
}) => {
    selectedTags: any;
    addTag: any;
    removeTag: any;
    setSelectedTags: any;
};
/**
 * Hook for list-style results display
 *
 * @param {Object} options - Configuration options
 * @returns {Object} Results list state and methods
 *
 * @example
 * ```tsx
 * const { displayResults, toggleSelection, selectedItems } = useResultsList({
 *   selectable: true,
 * });
 * ```
 */
export declare const useResultsList: (options?: {
    selectable?: boolean;
    multiSelect?: boolean;
    onSelectionChange?: (selected: string[]) => void;
}) => {
    selectedItems: any;
    toggleSelection: any;
    selectAll: any;
    clearSelection: any;
};
/**
 * Hook for grid-style results display
 *
 * @param {Object} options - Configuration options
 * @returns {Object} Results grid state and methods
 *
 * @example
 * ```tsx
 * const { columns, setColumns, selectedItems } = useResultsGrid({
 *   defaultColumns: 3,
 *   minColumns: 1,
 *   maxColumns: 6,
 * });
 * ```
 */
export declare const useResultsGrid: (options?: {
    defaultColumns?: number;
    minColumns?: number;
    maxColumns?: number;
    onColumnsChange?: (columns: number) => void;
}) => {
    columns: any;
    setColumns: any;
    selectedItems: any;
    setSelectedItems: any;
};
/**
 * Hook for pagination
 *
 * @param {Object} options - Configuration options
 * @returns {Object} Pagination state and methods
 *
 * @example
 * ```tsx
 * const { page, pageSize, setPage, goToPage } = usePagination({
 *   totalItems: 100,
 *   pageSize: 20,
 * });
 * ```
 */
export declare const usePagination: (options?: {
    totalItems?: number;
    pageSize?: number;
    maxPages?: number;
    onPageChange?: (page: number) => void;
}) => {
    page: any;
    pageSize: number;
    totalPages: number;
    totalItems: number;
    setPage: any;
    goToPage: any;
    nextPage: any;
    previousPage: any;
};
/**
 * Hook for infinite scroll
 *
 * @param {Object} options - Configuration options
 * @returns {Object} Infinite scroll state and methods
 *
 * @example
 * ```tsx
 * const { items, hasMore, isLoading, setRef } = useInfiniteScroll({
 *   loadMore: async (page) => fetchResults(page),
 *   threshold: 200,
 * });
 * ```
 */
export declare const useInfiniteScroll: (options?: {
    loadMore?: (page: number) => Promise<SearchResultItem[]>;
    threshold?: number;
    pageSize?: number;
}) => {
    items: any;
    hasMore: any;
    isLoading: any;
    setRef: any;
    setItems: any;
};
/**
 * Hook for managing sort options
 *
 * @param {Object} options - Configuration options
 * @returns {Object} Sort state and methods
 *
 * @example
 * ```tsx
 * const { sortBy, setSortBy, toggleDirection } = useSortOptions({
 *   options: [
 *     { field: 'date', direction: 'desc', label: 'Newest' },
 *     { field: 'title', direction: 'asc', label: 'A-Z' },
 *   ],
 * });
 * ```
 */
export declare const useSortOptions: (options?: {
    options?: SortOption[];
    defaultSort?: SortOption;
    onSortChange?: (sort: SortOption) => void;
}) => {
    sortBy: any;
    setSortBy: any;
    toggleDirection: any;
    availableOptions: SortOption[];
};
/**
 * SortDropdown component for sort selection
 *
 * @param {Object} props - Component props
 * @returns {ReactNode} Rendered component
 *
 * @example
 * ```tsx
 * <SortDropdown
 *   options={sortOptions}
 *   value={currentSort}
 *   onChange={handleSortChange}
 * />
 * ```
 */
export declare const SortDropdown: React.FC<{
    options: SortOption[];
    value?: SortOption;
    onChange?: (sort: SortOption) => void;
    className?: string;
}>;
/**
 * Hook for search suggestions
 *
 * @param {Object} options - Configuration options
 * @returns {Object} Suggestions state and methods
 *
 * @example
 * ```tsx
 * const { suggestions, getSuggestions } = useSearchSuggestions({
 *   types: ['search', 'filter', 'related'],
 *   limit: 10,
 * });
 * ```
 */
export declare const useSearchSuggestions: (options?: {
    types?: Array<"search" | "filter" | "related">;
    limit?: number;
    onGetSuggestions?: (query: string) => Promise<SearchSuggestion[]>;
}) => {
    suggestions: any;
    loading: any;
    getSuggestions: any;
};
/**
 * Hook for typeahead search
 *
 * @param {Object} options - Configuration options
 * @returns {Object} Typeahead state and methods
 *
 * @example
 * ```tsx
 * const { suggestions, search } = useTypeAhead({
 *   minChars: 2,
 *   debounce: 300,
 * });
 * ```
 */
export declare const useTypeAhead: (options?: {
    minChars?: number;
    debounce?: number;
    onSearch?: (query: string) => Promise<SearchSuggestion[]>;
    maxResults?: number;
}) => {
    suggestions: any;
    loading: any;
    search: any;
};
/**
 * Hook for managing saved searches
 *
 * @param {Object} options - Configuration options
 * @returns {Object} Saved searches state and methods
 *
 * @example
 * ```tsx
 * const { savedSearches, saveSearch, deleteSearch } = useSavedSearches({
 *   maxSaved: 20,
 * });
 * ```
 */
export declare const useSavedSearches: (options?: {
    maxSaved?: number;
    onSave?: (search: SavedSearch) => void;
    onDelete?: (id: string) => void;
}) => {
    savedSearches: any;
    saveSearch: any;
    deleteSearch: any;
    updateSearch: any;
};
/**
 * Hook for search history tracking
 *
 * @param {Object} options - Configuration options
 * @returns {Object} Search history state and methods
 *
 * @example
 * ```tsx
 * const { history, addToHistory, clearHistory } = useSearchHistory({
 *   maxItems: 50,
 * });
 * ```
 */
export declare const useSearchHistory: (options?: {
    maxItems?: number;
    onAdd?: (query: SearchQuery) => void;
}) => {
    history: any;
    addToHistory: any;
    clearHistory: any;
};
/**
 * Hook for recent searches
 *
 * @param {Object} options - Configuration options
 * @returns {Object} Recent searches state and methods
 *
 * @example
 * ```tsx
 * const { recentSearches, addRecent, clearRecent } = useRecentSearches({
 *   limit: 10,
 * });
 * ```
 */
export declare const useRecentSearches: (options?: {
    limit?: number;
    onAdd?: (query: string) => void;
}) => {
    recentSearches: any;
    addRecent: any;
    clearRecent: any;
};
/**
 * Hook for boolean search (AND, OR, NOT operators)
 *
 * @param {Object} options - Configuration options
 * @returns {Object} Boolean search state and methods
 *
 * @example
 * ```tsx
 * const { query, setQuery, parseBoolean } = useBooleanSearch({
 *   allowWildcards: true,
 * });
 * ```
 */
export declare const useBooleanSearch: (options?: {
    allowWildcards?: boolean;
    allowQuotes?: boolean;
    onParse?: (query: string, parsed: any) => void;
}) => {
    query: any;
    setQuery: any;
    parseBoolean: any;
};
/**
 * Hook for search result highlighting
 *
 * @param {Object} options - Configuration options
 * @returns {Object} Highlighting state and methods
 *
 * @example
 * ```tsx
 * const { highlighted, highlightResults } = useHighlighting({
 *   className: 'highlight',
 *   contextWords: 5,
 * });
 * ```
 */
export declare const useHighlighting: (options?: {
    className?: string;
    contextWords?: number;
    fragmentSize?: number;
    onHighlight?: (highlighted: SearchHighlight) => void;
}) => {
    highlighted: any;
    highlightResults: any;
};
/**
 * Hook for search result snippets
 *
 * @param {Object} options - Configuration options
 * @returns {Object} Snippets state and methods
 *
 * @example
 * ```tsx
 * const { snippets, generateSnippets } = useSearchSnippets({
 *   length: 150,
 *   contextWords: 3,
 * });
 * ```
 */
export declare const useSearchSnippets: (options?: {
    length?: number;
    contextWords?: number;
    ellipsis?: string;
    onGenerate?: (snippets: Record<string, string>) => void;
}) => {
    snippets: any;
    generateSnippets: any;
};
/**
 * Hook for exporting search results
 *
 * @param {Object} options - Configuration options
 * @returns {Object} Export state and methods
 *
 * @example
 * ```tsx
 * const { exportResults, loading } = useExportResults({
 *   format: 'json',
 *   onExport: (data) => downloadFile(data),
 * });
 * ```
 */
export declare const useExportResults: (options?: {
    format?: "json" | "csv" | "xlsx" | "pdf";
    onExport?: (data: string | Blob) => void;
}) => {
    exportResults: any;
    loading: any;
};
/**
 * Hook for sharing search results
 *
 * @param {Object} options - Configuration options
 * @returns {Object} Share state and methods
 *
 * @example
 * ```tsx
 * const { share, shareUrl } = useShareSearch({
 *   baseUrl: 'https://example.com',
 * });
 * ```
 */
export declare const useShareSearch: (options?: {
    baseUrl?: string;
    onShare?: (url: string) => void;
}) => {
    shareUrl: any;
    share: any;
    copyToClipboard: any;
};
/**
 * Hook for search analytics tracking
 *
 * @param {Object} options - Configuration options
 * @returns {Object} Analytics state and methods
 *
 * @example
 * ```tsx
 * const { trackSearch, getAnalytics } = useSearchAnalytics({
 *   onTrack: (metrics) => sendToAnalytics(metrics),
 * });
 * ```
 */
export declare const useSearchAnalytics: (options?: {
    userId?: string;
    sessionId?: string;
    onTrack?: (metrics: SearchMetrics) => void;
}) => {
    metrics: any;
    trackSearch: any;
};
/**
 * Hook for comprehensive search metrics
 *
 * @param {Object} options - Configuration options
 * @returns {Object} Metrics state and methods
 *
 * @example
 * ```tsx
 * const { analytics, calculateMetrics } = useSearchMetrics({
 *   period: '7d',
 * });
 * ```
 */
export declare const useSearchMetrics: (options?: {
    period?: "1d" | "7d" | "30d" | "all";
    onCalculate?: (analytics: SearchAnalytics) => void;
}) => {
    analytics: any;
    calculateMetrics: any;
};
/**
 * Build search query from parameters
 *
 * @param {Partial<SearchQuery>} params - Query parameters
 * @returns {SearchQuery} Complete search query
 *
 * @example
 * ```tsx
 * const query = buildSearchQuery({
 *   q: 'typescript',
 *   filters: [{ field: 'type', operator: 'equals', value: 'article' }],
 * });
 * ```
 */
export declare const buildSearchQuery: (params: Partial<SearchQuery>) => SearchQuery;
/**
 * Parse filter string into FilterCondition array
 *
 * @param {string} filterString - Filter string like "status:published AND type:article"
 * @returns {FilterCondition[]} Parsed filter conditions
 *
 * @example
 * ```tsx
 * const filters = parseFilters('status:published AND category:tech');
 * ```
 */
export declare const parseFilters: (filterString: string) => FilterCondition[];
/**
 * Format results for display
 *
 * @param {SearchResultItem[]} items - Raw search results
 * @param {Object} options - Formatting options
 * @returns {SearchResultItem[]} Formatted results
 *
 * @example
 * ```tsx
 * const formatted = formatResults(results, { truncate: 200, dateFormat: 'short' });
 * ```
 */
export declare const formatResults: (items: SearchResultItem[], options?: {
    truncate?: number;
    dateFormat?: "short" | "long";
    removeHtml?: boolean;
}) => SearchResultItem[];
/**
 * Escape special characters in search query
 *
 * @param {string} query - Search query
 * @returns {string} Escaped query
 *
 * @example
 * ```tsx
 * const safe = escapeSpecialChars('c++ programming');
 * ```
 */
export declare const escapeSpecialChars: (query: string) => string;
/**
 * Tokenize search query into words
 *
 * @param {string} query - Search query
 * @returns {string[]} Token array
 *
 * @example
 * ```tsx
 * const tokens = tokenizeSearch('typescript react hooks');
 * ```
 */
export declare const tokenizeSearch: (query: string) => string[];
/**
 * Validate search query
 *
 * @param {SearchQuery} query - Query to validate
 * @returns {Object} Validation result
 *
 * @example
 * ```tsx
 * const result = validateSearchQuery(query);
 * if (result.valid) performSearch(query);
 * ```
 */
export declare const validateSearchQuery: (query: SearchQuery) => {
    valid: boolean;
    errors: string[];
};
/**
 * Merge multiple filter conditions
 *
 * @param {FilterCondition[]} filters - Filters to merge
 * @param {string} operator - Merge operator (AND/OR)
 * @returns {FilterCondition[]} Merged filters
 *
 * @example
 * ```tsx
 * const merged = mergeFilters(filters, 'AND');
 * ```
 */
export declare const mergeFilters: (filters: FilterCondition[], operator?: "AND" | "OR") => FilterCondition[];
/**
 * Build search URL with query parameters
 *
 * @param {SearchQuery} query - Search query
 * @param {string} baseUrl - Base URL
 * @returns {string} Complete URL
 *
 * @example
 * ```tsx
 * const url = buildSearchURL(query, 'https://example.com/search');
 * ```
 */
export declare const buildSearchURL: (query: SearchQuery, baseUrl?: string) => string;
//# sourceMappingURL=search-filter-cms-kit.d.ts.map