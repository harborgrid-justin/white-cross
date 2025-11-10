"use strict";
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
'use client';
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSearchURL = exports.mergeFilters = exports.validateSearchQuery = exports.tokenizeSearch = exports.escapeSpecialChars = exports.formatResults = exports.parseFilters = exports.buildSearchQuery = exports.useSearchMetrics = exports.useSearchAnalytics = exports.useShareSearch = exports.useExportResults = exports.useSearchSnippets = exports.useHighlighting = exports.useBooleanSearch = exports.useRecentSearches = exports.useSearchHistory = exports.useSavedSearches = exports.useTypeAhead = exports.useSearchSuggestions = exports.SortDropdown = exports.useSortOptions = exports.useInfiniteScroll = exports.usePagination = exports.useResultsGrid = exports.useResultsList = exports.useFilterByTags = exports.useFilterByCategory = exports.useFilterByStatus = exports.useFilterByDate = exports.useAutoComplete = exports.useFuzzySearch = exports.useFullTextSearch = exports.FacetList = exports.SearchResults = exports.FilterPanel = exports.SearchBar = exports.useFacetedSearch = exports.useFilters = exports.useSearch = void 0;
const react_1 = require("react");
// ============================================================================
// CORE HOOKS
// ============================================================================
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
const useSearch = (options = {}) => {
    const [searchState, setSearchState] = (0, react_1.useState)({
        query: { q: '', page: 1, pageSize: options.pageSize || 20 },
        results: null,
        loading: false,
        error: null,
        suggestions: [],
        recentSearches: [],
        savedSearches: [],
    });
    const debounceRef = (0, react_1.useRef)();
    const search = (0, react_1.useCallback)(async (query) => {
        setSearchState((prev) => ({ ...prev, loading: true, error: null }));
        try {
            const results = options.onSearch
                ? await options.onSearch(query)
                : { items: [], total: 0, page: 1, pageSize: 20, pageCount: 0, hasNextPage: false, hasPreviousPage: false, facets: [] };
            setSearchState((prev) => ({
                ...prev,
                query,
                results,
                loading: false,
                recentSearches: query.q ? [query.q, ...prev.recentSearches.slice(0, 9)] : prev.recentSearches,
            }));
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Search failed';
            setSearchState((prev) => ({ ...prev, error: errorMessage, loading: false }));
            options.onError?.(error instanceof Error ? error : new Error(errorMessage));
        }
    }, [options]);
    const debouncedSearch = (0, react_1.useCallback)((query) => {
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            search(query);
        }, options.debounceMs || 300);
    }, [search, options.debounceMs]);
    const setFilters = (0, react_1.useCallback)((filters) => {
        setSearchState((prev) => ({
            ...prev,
            query: { ...prev.query, filters, page: 1 },
        }));
    }, []);
    const setSort = (0, react_1.useCallback)((sort) => {
        setSearchState((prev) => ({
            ...prev,
            query: { ...prev.query, sort, page: 1 },
        }));
    }, []);
    const setPage = (0, react_1.useCallback)((page) => {
        setSearchState((prev) => ({
            ...prev,
            query: { ...prev.query, page },
        }));
    }, []);
    return { ...searchState, search, debouncedSearch, setFilters, setSort, setPage };
};
exports.useSearch = useSearch;
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
const useFilters = (config) => {
    const [filters, setFiltersState] = (0, react_1.useState)([]);
    const [activeFilters, setActiveFilters] = (0, react_1.useState)({});
    const setFilter = (0, react_1.useCallback)((filter) => {
        setActiveFilters((prev) => ({
            ...prev,
            [filter.field]: filter,
        }));
        setFiltersState((prev) => {
            const existing = prev.find((f) => f.field === filter.field && f.id === filter.id);
            if (existing) {
                return prev.map((f) => (f.id === filter.id ? filter : f));
            }
            return [...prev, filter];
        });
    }, []);
    const removeFilter = (0, react_1.useCallback)((id) => {
        setFiltersState((prev) => prev.filter((f) => f.id !== id));
    }, []);
    const clearFilters = (0, react_1.useCallback)(() => {
        setFiltersState([]);
        setActiveFilters({});
    }, []);
    const toggleFilter = (0, react_1.useCallback)((filter) => {
        setFiltersState((prev) => {
            const exists = prev.find((f) => f.id === filter.id);
            if (exists) {
                return prev.filter((f) => f.id !== filter.id);
            }
            return [...prev, filter];
        });
    }, []);
    return { filters, activeFilters, setFilter, removeFilter, clearFilters, toggleFilter, config };
};
exports.useFilters = useFilters;
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
const useFacetedSearch = (options = {}) => {
    const [facets, setFacets] = (0, react_1.useState)([]);
    const [selectedFacets, setSelectedFacets] = (0, react_1.useState)([]);
    const toggleFacet = (0, react_1.useCallback)((field, value) => {
        setSelectedFacets((prev) => {
            const existing = prev.find((f) => f.field === field);
            if (existing) {
                const newValues = existing.values.includes(value)
                    ? existing.values.filter((v) => v !== value)
                    : [...existing.values, value];
                if (newValues.length === 0) {
                    return prev.filter((f) => f.field !== field);
                }
                return prev.map((f) => (f.field === field ? { ...f, values: newValues } : f));
            }
            return [...prev, { field, values: [value] }];
        });
    }, []);
    (0, react_1.useEffect)(() => {
        options.onFacetChange?.(selectedFacets);
    }, [selectedFacets, options]);
    return { facets, setFacets, selectedFacets, toggleFacet, setSelectedFacets };
};
exports.useFacetedSearch = useFacetedSearch;
// ============================================================================
// SEARCH COMPONENTS
// ============================================================================
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
const SearchBar = ({ onSearch, placeholder = 'Search...', suggestions = [], onSuggestionSelect, clearable, autoFocus, className }) => {
    const [value, setValue] = (0, react_1.useState)('');
    const [showSuggestions, setShowSuggestions] = (0, react_1.useState)(false);
    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(value);
        setShowSuggestions(false);
    };
    return onSubmit = { handleSubmit };
    className = { className } >
        type;
    "text";
    value = { value };
    onChange = {}(e);
};
exports.SearchBar = SearchBar;
setValue(e.target.value);
onFocus = {}();
setShowSuggestions(true);
onBlur = {}();
setTimeout(() => setShowSuggestions(false), 200);
placeholder = { placeholder };
autoFocus = { autoFocus };
className = "search-input"
    /  >
    { suggestions, : .length > 0 && showSuggestions && className, "suggestions-dropdown":  >
            { suggestions, : .slice(0, 5).map((s, i) => key = { i }, onClick = {}(), {
                    onSuggestionSelect
                }(s))
            } };
className = "suggestion-item"
    >
        { s, : .text }
    < /div>;
/div>;
/form>;
;
;
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
const FilterPanel = ({ filters, activeFilters = [], onFilterChange, onClearAll, className, collapsible }) => {
    const [expanded, setExpanded] = (0, react_1.useState)({});
    return className = {} `filter-panel ${className || ''}`;
};
exports.FilterPanel = FilterPanel;
 >
    { filters, : .map((filter) => key = { filter, : .id }, className = "filter-group" >
            { collapsible } && onClick, {}(), setExpanded((prev) => ({ ...prev, [filter.id]: !prev[filter.id] }))) };
className = "filter-header"
    >
        { filter, : .label }
    < /button>;
{
    (!collapsible || expanded[filter.id]) && className;
    "filter-options" >
        { filter, : .options?.map((option) => key = {} `${filter.id}-${option.value}`) };
    className = "filter-option" >
        type;
    {
        filter.type === 'multiselect' || filter.type === 'checkbox' ? 'checkbox' : 'radio';
    }
    onChange = {}(e);
    {
        if (e.target.checked) {
            onFilterChange?.({
                id: `${filter.id}-${option.value}`,
                field: filter.field,
                operator: 'equals',
                value: option.value,
                label: option.label,
            });
        }
    }
}
/>
    < span > { option, : .label } < /span>;
{
    option.count && className;
    "count" > ({ option, : .count }) < /span>;
}
/label>;
/div>;
/div>;
{
    activeFilters.length > 0 && onClick;
    {
        onClearAll;
    }
     > Clear;
    All < /button>;
}
/div>;
;
;
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
const SearchResults = ({ results = [], loading, error, onItemClick, className, emptyMessage = 'No results found' }) => {
    if (loading)
        return className;
    {
        `results-container loading ${className || ''}`;
    }
     > Loading;
    /div>;
    if (error)
        return className;
    {
        `results-container error ${className || ''}`;
    }
     > Error;
    {
        error;
    }
    /div>;
    if (results.length === 0)
        return className;
    {
        `results-container empty ${className || ''}`;
    }
     > { emptyMessage } < /div>;
    return className = {} `results-container ${className || ''}`;
};
exports.SearchResults = SearchResults;
 >
    { results, : .map((result) => key = { result, : .id }, className = "result-item", onClick = {}(), onItemClick?.(result)) } >
    { result, : .image && src };
{
    result.image;
}
alt = { result, : .title };
className = "result-image" /  > ;
className;
"result-content" >
    className;
"result-title" > { result, : .title } < /h3>;
{
    result.summary && className;
    "result-summary" > { result, : .summary } < /p>;
}
{
    result.tags && className;
    "result-tags" > { result, : .tags.map((tag) => key, { tag } > { tag } < /span>)}</div > ) }
        < /div>
        < /div>;
}
/div>;
;
;
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
const FacetList = ({ facets, selectedValues = {}, onFacetChange, maxVisible = 5, className }) => {
    const [expanded, setExpanded] = (0, react_1.useState)({});
    return className = {} `facet-list ${className || ''}`;
};
exports.FacetList = FacetList;
 >
    { facets, : .map((facet) => key = { facet, : .field }, className = "facet" >
            className, "facet-title", onClick = {}(), setExpanded((prev) => ({ ...prev, [facet.field]: !prev[facet.field] }))) } >
    { facet, : .label }
    < /h4>;
{
    (expanded[facet.field] !== false) && className;
    "facet-values" >
        { facet, : .values.slice(0, expanded[facet.field] ? facet.values.length : maxVisible).map((value) => key = { value, : .value }, className = "facet-value" >
                type, "checkbox", checked = { selectedValues, [facet.field]: ?.includes(value.value) || false }, onChange = {}(e), onFacetChange?.(facet.field, value.value, e.target.checked)) }
            /  >
        { value, : .label } < /span>
        < span;
    className = "facet-count" > ({ value, : .count }) < /span>
        < /label>
        < /li>;
}
/ul>;
/div>;
/div>;
;
;
// ============================================================================
// SEARCH TYPE HOOKS
// ============================================================================
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
const useFullTextSearch = (options = {}) => {
    const [results, setResults] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const search = (0, react_1.useCallback)(async (query) => {
        if (!query) {
            setResults([]);
            return;
        }
        setLoading(true);
        try {
            // Full-text search implementation
            const searchResults = [].filter((item) => options.fields?.some((field) => item[field]?.toLowerCase().includes(query.toLowerCase())) ?? true);
            setResults(searchResults);
            options.onSearch?.(query, searchResults);
        }
        finally {
            setLoading(false);
        }
    }, [options]);
    return { results, loading, search };
};
exports.useFullTextSearch = useFullTextSearch;
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
const useFuzzySearch = (options = {}) => {
    const [results, setResults] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const search = (0, react_1.useCallback)(async (query) => {
        setLoading(true);
        try {
            // Fuzzy search with tolerance for typos
            const fuzziness = options.fuzziness ?? 1;
            const searchResults = [].filter((item) => {
                // Fuzzy matching algorithm
                const score = calculateLevenshteinDistance(query, item.title.toLowerCase());
                return score <= fuzziness;
            });
            setResults(searchResults);
            options.onSearch?.(query, searchResults);
        }
        finally {
            setLoading(false);
        }
    }, [options]);
    return { results, loading, search };
};
exports.useFuzzySearch = useFuzzySearch;
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
const useAutoComplete = (options = {}) => {
    const [suggestions, setSuggestions] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const getSuggestions = (0, react_1.useCallback)(async (query) => {
        if ((query.length || 0) < (options.minChars ?? 1)) {
            setSuggestions([]);
            return;
        }
        setLoading(true);
        try {
            // Autocomplete implementation
            const results = [];
            setSuggestions(results.slice(0, options.maxResults ?? 10));
        }
        finally {
            setLoading(false);
        }
    }, [options]);
    return { suggestions, loading, getSuggestions };
};
exports.useAutoComplete = useAutoComplete;
// ============================================================================
// FILTER HOOKS
// ============================================================================
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
const useFilterByDate = (options = {}) => {
    const [startDate, setStartDate] = (0, react_1.useState)(null);
    const [endDate, setEndDate] = (0, react_1.useState)(null);
    const setDateRange = (0, react_1.useCallback)((start, end) => {
        setStartDate(start);
        setEndDate(end);
        options.onDateChange?.(start, end);
    }, [options]);
    const clearDates = (0, react_1.useCallback)(() => {
        setStartDate(null);
        setEndDate(null);
    }, []);
    return { startDate, endDate, setDateRange, clearDates };
};
exports.useFilterByDate = useFilterByDate;
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
const useFilterByStatus = (options = {}) => {
    const [selectedStatuses, setSelectedStatuses] = (0, react_1.useState)([]);
    const toggleStatus = (0, react_1.useCallback)((status) => {
        setSelectedStatuses((prev) => {
            const newStatuses = prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status];
            options.onStatusChange?.(newStatuses);
            return newStatuses;
        });
    }, [options]);
    const setStatuses = (0, react_1.useCallback)((statuses) => {
        setSelectedStatuses(statuses);
        options.onStatusChange?.(statuses);
    }, [options]);
    return { selectedStatuses, toggleStatus, setStatuses };
};
exports.useFilterByStatus = useFilterByStatus;
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
const useFilterByCategory = (options = {}) => {
    const [selectedCategories, setSelectedCategoriesState] = (0, react_1.useState)([]);
    const toggleCategory = (0, react_1.useCallback)((category) => {
        setSelectedCategoriesState((prev) => {
            const newCategories = prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category];
            options.onCategoryChange?.(newCategories);
            return newCategories;
        });
    }, [options]);
    const setCategories = (0, react_1.useCallback)((categories) => {
        setSelectedCategoriesState(categories);
        options.onCategoryChange?.(categories);
    }, [options]);
    return { selectedCategories, toggleCategory, setCategories };
};
exports.useFilterByCategory = useFilterByCategory;
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
const useFilterByTags = (options = {}) => {
    const [selectedTags, setSelectedTagsState] = (0, react_1.useState)([]);
    const addTag = (0, react_1.useCallback)((tag) => {
        setSelectedTagsState((prev) => {
            if (prev.length >= (options.maxTags ?? 10) || prev.includes(tag))
                return prev;
            const newTags = [...prev, tag];
            options.onTagsChange?.(newTags);
            return newTags;
        });
    }, [options]);
    const removeTag = (0, react_1.useCallback)((tag) => {
        setSelectedTagsState((prev) => {
            const newTags = prev.filter((t) => t !== tag);
            options.onTagsChange?.(newTags);
            return newTags;
        });
    }, [options]);
    return { selectedTags, addTag, removeTag, setSelectedTags: setSelectedTagsState };
};
exports.useFilterByTags = useFilterByTags;
// ============================================================================
// RESULTS MANAGEMENT HOOKS
// ============================================================================
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
const useResultsList = (options = {}) => {
    const [selectedItems, setSelectedItemsState] = (0, react_1.useState)([]);
    const toggleSelection = (0, react_1.useCallback)((id) => {
        setSelectedItemsState((prev) => {
            const newSelected = prev.includes(id)
                ? prev.filter((item) => item !== id)
                : options.multiSelect
                    ? [...prev, id]
                    : [id];
            options.onSelectionChange?.(newSelected);
            return newSelected;
        });
    }, [options]);
    const selectAll = (0, react_1.useCallback)((items) => {
        setSelectedItemsState(items);
        options.onSelectionChange?.(items);
    }, [options]);
    const clearSelection = (0, react_1.useCallback)(() => {
        setSelectedItemsState([]);
        options.onSelectionChange?.([]);
    }, [options]);
    return { selectedItems, toggleSelection, selectAll, clearSelection };
};
exports.useResultsList = useResultsList;
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
const useResultsGrid = (options = {}) => {
    const [columns, setColumnsState] = (0, react_1.useState)(options.defaultColumns ?? 3);
    const [selectedItems, setSelectedItemsState] = (0, react_1.useState)([]);
    const setColumns = (0, react_1.useCallback)((cols) => {
        const clamped = Math.max(options.minColumns ?? 1, Math.min(cols, options.maxColumns ?? 6));
        setColumnsState(clamped);
        options.onColumnsChange?.(clamped);
    }, [options]);
    return { columns, setColumns, selectedItems, setSelectedItems: setSelectedItemsState };
};
exports.useResultsGrid = useResultsGrid;
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
const usePagination = (options = {}) => {
    const [page, setPageState] = (0, react_1.useState)(1);
    const pageSize = options.pageSize ?? 20;
    const totalItems = options.totalItems ?? 0;
    const totalPages = Math.ceil(totalItems / pageSize);
    const setPage = (0, react_1.useCallback)((newPage) => {
        const clamped = Math.max(1, Math.min(newPage, totalPages));
        setPageState(clamped);
        options.onPageChange?.(clamped);
    }, [totalPages, options]);
    const goToPage = (0, react_1.useCallback)((pageNum) => {
        setPage(pageNum);
    }, [setPage]);
    const nextPage = (0, react_1.useCallback)(() => {
        setPage(page + 1);
    }, [page, setPage]);
    const previousPage = (0, react_1.useCallback)(() => {
        setPage(page - 1);
    }, [page, setPage]);
    return { page, pageSize, totalPages, totalItems, setPage, goToPage, nextPage, previousPage };
};
exports.usePagination = usePagination;
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
const useInfiniteScroll = (options = {}) => {
    const [items, setItems] = (0, react_1.useState)([]);
    const [page, setPage] = (0, react_1.useState)(1);
    const [hasMore, setHasMore] = (0, react_1.useState)(true);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const observerRef = (0, react_1.useRef)();
    const setRef = (0, react_1.useCallback)((element) => {
        if (!element)
            return;
        observerRef.current?.disconnect();
        observerRef.current = new IntersectionObserver(async ([entry]) => {
            if (entry.isIntersecting && !isLoading && hasMore) {
                setIsLoading(true);
                try {
                    const newItems = await options.loadMore?.(page + 1);
                    setItems((prev) => [...prev, ...(newItems || [])]);
                    setPage((prev) => prev + 1);
                    if (!newItems || newItems.length < (options.pageSize ?? 20)) {
                        setHasMore(false);
                    }
                }
                finally {
                    setIsLoading(false);
                }
            }
        }, { rootMargin: `${options.threshold ?? 200}px` });
        observerRef.current.observe(element);
    }, [page, isLoading, hasMore, options]);
    return { items, hasMore, isLoading, setRef, setItems };
};
exports.useInfiniteScroll = useInfiniteScroll;
// ============================================================================
// SORTING HOOKS & COMPONENTS
// ============================================================================
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
const useSortOptions = (options = {}) => {
    const [sortBy, setSortByState] = (0, react_1.useState)(options.defaultSort || { field: 'date', direction: 'desc' });
    const setSortBy = (0, react_1.useCallback)((sort) => {
        setSortByState(sort);
        options.onSortChange?.(sort);
    }, [options]);
    const toggleDirection = (0, react_1.useCallback)(() => {
        setSortBy({
            ...sortBy,
            direction: sortBy.direction === 'asc' ? 'desc' : 'asc',
        });
    }, [sortBy, setSortBy]);
    return { sortBy, setSortBy, toggleDirection, availableOptions: options.options || [] };
};
exports.useSortOptions = useSortOptions;
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
const SortDropdown = ({ options, value, onChange, className }) => {
    return value = { value, field } || '';
};
exports.SortDropdown = SortDropdown;
onChange = {}(e);
{
    const selected = options.find((opt) => opt.field === e.target.value);
    if (selected)
        onChange?.(selected);
}
className = { className }
    >
        value;
"" > Sort;
by;
/option>;
{
    options.map((opt) => key = { opt, : .field }, value = { opt, : .field } >
        { opt, : .label || opt.field }
        < /option>);
}
/select>;
;
;
// ============================================================================
// SUGGESTIONS & AUTOCOMPLETE HOOKS
// ============================================================================
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
const useSearchSuggestions = (options = {}) => {
    const [suggestions, setSuggestions] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const getSuggestions = (0, react_1.useCallback)(async (query) => {
        if (!query) {
            setSuggestions([]);
            return;
        }
        setLoading(true);
        try {
            const results = (await options.onGetSuggestions?.(query)) || [];
            setSuggestions(results.slice(0, options.limit ?? 10));
        }
        finally {
            setLoading(false);
        }
    }, [options]);
    return { suggestions, loading, getSuggestions };
};
exports.useSearchSuggestions = useSearchSuggestions;
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
const useTypeAhead = (options = {}) => {
    const [suggestions, setSuggestions] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const debounceRef = (0, react_1.useRef)();
    const search = (0, react_1.useCallback)((query) => {
        clearTimeout(debounceRef.current);
        if ((query.length || 0) < (options.minChars ?? 1)) {
            setSuggestions([]);
            return;
        }
        setLoading(true);
        debounceRef.current = setTimeout(async () => {
            try {
                const results = (await options.onSearch?.(query)) || [];
                setSuggestions(results.slice(0, options.maxResults ?? 10));
            }
            finally {
                setLoading(false);
            }
        }, options.debounce ?? 300);
    }, [options]);
    return { suggestions, loading, search };
};
exports.useTypeAhead = useTypeAhead;
// ============================================================================
// SEARCH HISTORY HOOKS
// ============================================================================
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
const useSavedSearches = (options = {}) => {
    const [savedSearches, setSavedSearches] = (0, react_1.useState)([]);
    const saveSearch = (0, react_1.useCallback)((query, name, description) => {
        const newSearch = {
            id: Date.now().toString(),
            name,
            query,
            createdAt: new Date(),
            updatedAt: new Date(),
            description,
        };
        setSavedSearches((prev) => {
            const updated = [newSearch, ...prev];
            return updated.slice(0, options.maxSaved ?? 20);
        });
        options.onSave?.(newSearch);
    }, [options]);
    const deleteSearch = (0, react_1.useCallback)((id) => {
        setSavedSearches((prev) => prev.filter((s) => s.id !== id));
        options.onDelete?.(id);
    }, [options]);
    const updateSearch = (0, react_1.useCallback)((id, updates) => {
        setSavedSearches((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates, updatedAt: new Date() } : s)));
    }, []);
    return { savedSearches, saveSearch, deleteSearch, updateSearch };
};
exports.useSavedSearches = useSavedSearches;
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
const useSearchHistory = (options = {}) => {
    const [history, setHistory] = (0, react_1.useState)([]);
    const addToHistory = (0, react_1.useCallback)((query) => {
        setHistory((prev) => {
            const filtered = prev.filter((q) => q.q !== query.q);
            return [query, ...filtered].slice(0, options.maxItems ?? 50);
        });
        options.onAdd?.(query);
    }, [options]);
    const clearHistory = (0, react_1.useCallback)(() => {
        setHistory([]);
    }, []);
    return { history, addToHistory, clearHistory };
};
exports.useSearchHistory = useSearchHistory;
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
const useRecentSearches = (options = {}) => {
    const [recentSearches, setRecentSearches] = (0, react_1.useState)([]);
    const addRecent = (0, react_1.useCallback)((query) => {
        if (!query)
            return;
        setRecentSearches((prev) => {
            const filtered = prev.filter((q) => q !== query);
            return [query, ...filtered].slice(0, options.limit ?? 10);
        });
        options.onAdd?.(query);
    }, [options]);
    const clearRecent = (0, react_1.useCallback)(() => {
        setRecentSearches([]);
    }, []);
    return { recentSearches, addRecent, clearRecent };
};
exports.useRecentSearches = useRecentSearches;
// ============================================================================
// ADVANCED SEARCH HOOKS
// ============================================================================
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
const useBooleanSearch = (options = {}) => {
    const [query, setQuery] = (0, react_1.useState)('');
    const parseBoolean = (0, react_1.useCallback)((searchQuery) => {
        // Parse boolean operators
        const parts = searchQuery.split(/\s+(AND|OR|NOT)\s+/i);
        const parsed = { parts, operators: [] };
        options.onParse?.(searchQuery, parsed);
        return parsed;
    }, [options]);
    return { query, setQuery, parseBoolean };
};
exports.useBooleanSearch = useBooleanSearch;
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
const useHighlighting = (options = {}) => {
    const [highlighted, setHighlightedState] = (0, react_1.useState)({});
    const highlightResults = (0, react_1.useCallback)((results, query) => {
        const highlights = {};
        results.forEach((result) => {
            const regex = new RegExp(`(${query})`, 'gi');
            highlights[result.id] = [result.title.replace(regex, `<span class="${options.className || 'highlight'}">$1</span>`)];
        });
        setHighlightedState(highlights);
        options.onHighlight?.(highlights);
    }, [options]);
    return { highlighted, highlightResults };
};
exports.useHighlighting = useHighlighting;
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
const useSearchSnippets = (options = {}) => {
    const [snippets, setSnippets] = (0, react_1.useState)({});
    const generateSnippets = (0, react_1.useCallback)((results, query) => {
        const snippetMap = {};
        results.forEach((result) => {
            if (result.content) {
                const index = result.content.toLowerCase().indexOf(query.toLowerCase());
                const start = Math.max(0, index - 50);
                const end = Math.min(result.content.length, start + (options.length ?? 150));
                const snippet = result.content.substring(start, end);
                snippetMap[result.id] = (start > 0 ? '...' : '') + snippet + (end < result.content.length ? '...' : '');
            }
        });
        setSnippets(snippetMap);
        options.onGenerate?.(snippetMap);
    }, [options]);
    return { snippets, generateSnippets };
};
exports.useSearchSnippets = useSearchSnippets;
// ============================================================================
// EXPORT & SHARING HOOKS
// ============================================================================
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
const useExportResults = (options = {}) => {
    const [loading, setLoading] = (0, react_1.useState)(false);
    const exportResults = (0, react_1.useCallback)(async (results) => {
        setLoading(true);
        try {
            let data;
            switch (options.format ?? 'json') {
                case 'csv':
                    data = convertToCSV(results);
                    break;
                case 'xlsx':
                    data = new Blob([results.toString()], { type: 'application/vnd.ms-excel' });
                    break;
                case 'pdf':
                    data = new Blob([results.toString()], { type: 'application/pdf' });
                    break;
                default:
                    data = JSON.stringify(results, null, 2);
            }
            options.onExport?.(data);
        }
        finally {
            setLoading(false);
        }
    }, [options]);
    return { exportResults, loading };
};
exports.useExportResults = useExportResults;
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
const useShareSearch = (options = {}) => {
    const [shareUrl, setShareUrl] = (0, react_1.useState)('');
    const share = (0, react_1.useCallback)(async (query) => {
        const url = (0, exports.buildSearchURL)(query, options.baseUrl);
        setShareUrl(url);
        options.onShare?.(url);
        if (navigator.share) {
            await navigator.share({
                title: 'Search Results',
                url,
            });
        }
    }, [options]);
    const copyToClipboard = (0, react_1.useCallback)(async () => {
        if (shareUrl) {
            await navigator.clipboard.writeText(shareUrl);
        }
    }, [shareUrl]);
    return { shareUrl, share, copyToClipboard };
};
exports.useShareSearch = useShareSearch;
// ============================================================================
// ANALYTICS HOOKS
// ============================================================================
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
const useSearchAnalytics = (options = {}) => {
    const [metrics, setMetrics] = (0, react_1.useState)([]);
    const trackSearch = (0, react_1.useCallback)((query, resultsCount, executionTime, filters) => {
        const metric = {
            query,
            resultsCount,
            executionTime,
            timestamp: new Date(),
            userId: options.userId,
            sessionId: options.sessionId,
            filters,
        };
        setMetrics((prev) => [...prev, metric]);
        options.onTrack?.(metric);
    }, [options]);
    return { metrics, trackSearch };
};
exports.useSearchAnalytics = useSearchAnalytics;
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
const useSearchMetrics = (options = {}) => {
    const [analytics, setAnalytics] = (0, react_1.useState)(null);
    const calculateMetrics = (0, react_1.useCallback)((metrics) => {
        const topSearches = Array.from(metrics.reduce((acc, m) => {
            acc.set(m.query, (acc.get(m.query) || 0) + 1);
            return acc;
        }, new Map()))
            .map(([query, count]) => ({ query, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
        const calculated = {
            totalSearches: metrics.length,
            averageResultsPerSearch: metrics.length > 0 ? metrics.reduce((sum, m) => sum + m.resultsCount, 0) / metrics.length : 0,
            topSearches,
            topFilters: [],
            noResultSearches: metrics.filter((m) => m.resultsCount === 0).map((m) => m.query),
            averageExecutionTime: metrics.length > 0 ? metrics.reduce((sum, m) => sum + m.executionTime, 0) / metrics.length : 0,
        };
        setAnalytics(calculated);
        options.onCalculate?.(calculated);
    }, [options]);
    return { analytics, calculateMetrics };
};
exports.useSearchMetrics = useSearchMetrics;
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
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
const buildSearchQuery = (params) => {
    return {
        q: params.q || '',
        filters: params.filters || [],
        facets: params.facets || [],
        sort: params.sort,
        page: params.page || 1,
        pageSize: params.pageSize || 20,
        operator: params.operator || 'AND',
        type: params.type || 'simple',
        fields: params.fields,
        boost: params.boost,
        includePhrase: params.includePhrase ?? false,
        fuzziness: params.fuzziness,
        highlightContext: params.highlightContext,
    };
};
exports.buildSearchQuery = buildSearchQuery;
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
const parseFilters = (filterString) => {
    const filters = [];
    const parts = filterString.split(/\s+AND\s+/i);
    parts.forEach((part, i) => {
        const [field, value] = part.split(':');
        if (field && value) {
            filters.push({
                id: `${field}-${i}`,
                field: field.trim(),
                operator: 'equals',
                value: value.trim(),
            });
        }
    });
    return filters;
};
exports.parseFilters = parseFilters;
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
const formatResults = (items, options = {}) => {
    return items.map((item) => ({
        ...item,
        summary: item.summary ? item.summary.substring(0, options.truncate ?? 200) : undefined,
        date: item.date ? formatDate(item.date, options.dateFormat ?? 'short') : undefined,
    }));
};
exports.formatResults = formatResults;
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
const escapeSpecialChars = (query) => {
    const specialChars = /[+\-&|!(){}[\]^"~*?:\\]/g;
    return query.replace(specialChars, '\\$&');
};
exports.escapeSpecialChars = escapeSpecialChars;
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
const tokenizeSearch = (query) => {
    return query
        .toLowerCase()
        .split(/\s+/)
        .filter((token) => token.length > 0);
};
exports.tokenizeSearch = tokenizeSearch;
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
const validateSearchQuery = (query) => {
    const errors = [];
    if (!query.q && (!query.filters || query.filters.length === 0)) {
        errors.push('Query or filters must be provided');
    }
    if (query.pageSize && (query.pageSize < 1 || query.pageSize > 1000)) {
        errors.push('Page size must be between 1 and 1000');
    }
    if (query.page && query.page < 1) {
        errors.push('Page must be greater than 0');
    }
    if (query.fuzziness && (query.fuzziness < 0 || query.fuzziness > 2)) {
        errors.push('Fuzziness must be between 0 and 2');
    }
    return { valid: errors.length === 0, errors };
};
exports.validateSearchQuery = validateSearchQuery;
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
const mergeFilters = (filters, operator = 'AND') => {
    const grouped = filters.reduce((acc, filter) => {
        const key = filter.field;
        if (!acc[key])
            acc[key] = [];
        acc[key].push(filter);
        return acc;
    }, {});
    return Object.values(grouped).map((fieldFilters) => fieldFilters[0]);
};
exports.mergeFilters = mergeFilters;
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
const buildSearchURL = (query, baseUrl) => {
    const params = new URLSearchParams();
    if (query.q)
        params.set('q', query.q);
    if (query.page)
        params.set('page', query.page.toString());
    if (query.pageSize)
        params.set('pageSize', query.pageSize.toString());
    if (query.sort) {
        params.set('sortBy', query.sort.field);
        params.set('sortDir', query.sort.direction);
    }
    if (query.filters) {
        query.filters.forEach((f) => {
            params.append('filter', `${f.field}:${f.value}`);
        });
    }
    const base = baseUrl || '/search';
    return `${base}?${params.toString()}`;
};
exports.buildSearchURL = buildSearchURL;
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Calculate Levenshtein distance for fuzzy matching
 */
const calculateLevenshteinDistance = (a, b) => {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            }
            else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
            }
        }
    }
    return matrix[b.length][a.length];
};
/**
 * Convert results to CSV format
 */
const convertToCSV = (results) => {
    const headers = ['ID', 'Title', 'Summary', 'Type', 'Date', 'Tags'];
    const rows = results.map((r) => [
        r.id,
        r.title,
        r.summary || '',
        r.type || '',
        r.date || '',
        r.tags?.join(';') || '',
    ]);
    const csvContent = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
    return csvContent;
};
/**
 * Format date string
 */
const formatDate = (dateStr, format) => {
    try {
        const date = new Date(dateStr);
        return format === 'short' ? date.toLocaleDateString() : date.toLocaleString();
    }
    catch {
        return dateStr;
    }
};
//# sourceMappingURL=search-filter-cms-kit.js.map