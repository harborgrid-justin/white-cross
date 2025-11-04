/**
 * Composite Search and Filter Hook
 *
 * Combines search, filtering, sorting, and saved search functionality
 * into a comprehensive student search interface.
 *
 * @module hooks/students/searchAndFilter/useStudentSearchAndFilter
 * @author White Cross Healthcare Platform
 * @version 2.0.0
 */

import { useMemo, useCallback } from 'react';
import { useStudentSearch } from './useStudentSearch';
import { useAdvancedFilters } from './useStudentFilter';
import { useStudentSorting } from './useStudentSort';
import { useSavedSearches } from './useSavedSearches';
import type {
  SavedSearch,
  SearchAndFilterOptions
} from './searchFilterTypes';

/**
 * Composite hook that combines search, filtering, and sorting
 *
 * @param options - Combined options for all features
 * @returns Comprehensive search interface
 *
 * @example
 * ```tsx
 * const {
 *   query,
 *   setQuery,
 *   filters,
 *   updateFilter,
 *   sortBy,
 *   updateSort,
 *   results,
 *   isLoading,
 *   savedSearches,
 *   saveCurrentSearch
 * } = useStudentSearchAndFilter({
 *   initialQuery: '',
 *   initialFilters: { isActive: true },
 *   autoApply: true
 * });
 * ```
 */
export const useStudentSearchAndFilter = (
  options?: SearchAndFilterOptions
) => {
  const {
    initialQuery = '',
    initialFilters = {},
    initialSort,
    autoApply = true,
    enableSuggestions = true,
  } = options || {};

  // Individual hooks
  const searchHook = useStudentSearch(initialQuery, { enableSuggestions });
  const filterHook = useAdvancedFilters(initialFilters, { autoApply });
  const savedSearchHook = useSavedSearches();

  // Combine search and filter results
  const combinedResults = useMemo(() => {
    if (searchHook.hasQuery) {
      return searchHook.results;
    }
    return filterHook.results;
  }, [searchHook.hasQuery, searchHook.results, filterHook.results]);

  // Apply sorting to combined results
  const sortingHook = useStudentSorting(combinedResults, initialSort);

  // Combined loading state
  const isLoading = searchHook.isLoading || filterHook.isLoading;
  const isFetching = searchHook.isFetching || filterHook.isFiltering;

  // Save current search function
  const saveCurrentSearch = useCallback((name: string, isDefault = false) => {
    return savedSearchHook.saveSearch(
      name,
      {
        search: searchHook.query,
        ...filterHook.appliedFilters,
      },
      sortingHook.sortBy,
      isDefault
    );
  }, [
    savedSearchHook.saveSearch,
    searchHook.query,
    filterHook.appliedFilters,
    sortingHook.sortBy,
  ]);

  // Load search function
  const loadSearch = useCallback((search: SavedSearch) => {
    const { search: queryText, ...filters } = search.filters;

    if (queryText) {
      searchHook.setQuery(queryText);
    } else {
      searchHook.clearSearch();
    }

    filterHook.updateFilters(filters);

    if (search.sortBy) {
      sortingHook.updateSort(search.sortBy);
    }

    return savedSearchHook.loadSearch(search);
  }, [
    searchHook.setQuery,
    searchHook.clearSearch,
    filterHook.updateFilters,
    sortingHook.updateSort,
    savedSearchHook.loadSearch,
  ]);

  // Clear all function
  const clearAll = useCallback(() => {
    searchHook.clearSearch();
    filterHook.clearFilters();
    savedSearchHook.setCurrentSearch(null);
  }, [
    searchHook.clearSearch,
    filterHook.clearFilters,
    savedSearchHook.setCurrentSearch,
  ]);

  return {
    // Search
    query: searchHook.query,
    setQuery: searchHook.setQuery,
    clearSearch: searchHook.clearSearch,
    suggestions: searchHook.suggestions,
    selectSuggestion: searchHook.selectSuggestion,
    recentSearches: searchHook.recentSearches,

    // Filters
    filters: filterHook.filters,
    appliedFilters: filterHook.appliedFilters,
    updateFilter: filterHook.updateFilter,
    updateFilters: filterHook.updateFilters,
    clearFilters: filterHook.clearFilters,
    applyFilters: filterHook.applyFilters,
    hasFilterChanges: filterHook.hasChanges,
    activeFilterCount: filterHook.activeFilterCount,

    // Sorting
    sortBy: sortingHook.sortBy,
    updateSort: sortingHook.updateSort,
    toggleSortDirection: sortingHook.toggleDirection,
    sortOptions: sortingHook.sortOptions,

    // Results
    results: sortingHook.sortedStudents,
    pagination: filterHook.pagination,
    resultCount: sortingHook.sortedStudents.length,

    // Status
    isLoading,
    isFetching,
    hasQuery: searchHook.hasQuery,
    hasResults: sortingHook.sortedStudents.length > 0,
    error: searchHook.error || filterHook.error,

    // Saved searches
    savedSearches: savedSearchHook.savedSearches,
    currentSearch: savedSearchHook.currentSearch,
    saveCurrentSearch,
    loadSearch,
    deleteSearch: savedSearchHook.deleteSearch,
    getDefaultSearch: savedSearchHook.getDefaultSearch,

    // Combined actions
    clearAll,
    refetch: () => {
      searchHook.refetch();
      filterHook.refetch();
    },
  };
};
