/**
 * Student Search and Filter Hooks
 * 
 * Advanced search, filtering, and sorting functionality for student data
 * with debouncing, autocomplete, and saved search capabilities.
 * 
 * @module hooks/students/searchAndFilter
 * @author White Cross Healthcare Platform
 * @version 2.0.0
 */

import {
  useQuery,
  useQueries,
  useQueryClient,
  type UseQueryResult,
} from '@tanstack/react-query';
import { useMemo, useCallback, useState, useEffect, useRef } from 'react';
import { studentQueryKeys, type StudentFilters } from './queryKeys';
import { cacheConfig } from './cacheConfig';
import { studentsApi } from '@/services/modules/studentsApi';
import type { Student } from '@/types/student.types';

/**
 * Enhanced API error type
 */
interface ApiError extends Error {
  status?: number;
  response?: any;
}

/**
 * Search suggestion types
 */
export interface SearchSuggestion {
  type: 'student' | 'grade' | 'nurse' | 'recent';
  value: string;
  label: string;
  metadata?: {
    studentId?: string;
    grade?: string;
    count?: number;
  };
}

/**
 * Advanced filter options
 */
export interface AdvancedFilters extends StudentFilters {
  enrollmentDateFrom?: string;
  enrollmentDateTo?: string;
  ageMin?: number;
  ageMax?: number;
  hasAllergies?: boolean;
  hasMedications?: boolean;
  hasIncidents?: boolean;
  lastVisitFrom?: string;
  lastVisitTo?: string;
  tags?: string[];
  nurseIds?: string[];
  schools?: string[];
}

/**
 * Sort options
 */
export interface SortOption {
  field: keyof Student | 'fullName' | 'lastVisit' | 'enrollmentDate';
  direction: 'asc' | 'desc';
  label: string;
}

export const SORT_OPTIONS: SortOption[] = [
  { field: 'lastName', direction: 'asc', label: 'Last Name (A-Z)' },
  { field: 'lastName', direction: 'desc', label: 'Last Name (Z-A)' },
  { field: 'firstName', direction: 'asc', label: 'First Name (A-Z)' },
  { field: 'firstName', direction: 'desc', label: 'First Name (Z-A)' },
  { field: 'grade', direction: 'asc', label: 'Grade (Low to High)' },
  { field: 'grade', direction: 'desc', label: 'Grade (High to Low)' },
  { field: 'enrollmentDate', direction: 'desc', label: 'Recently Enrolled' },
  { field: 'enrollmentDate', direction: 'asc', label: 'Longest Enrolled' },
  { field: 'studentNumber', direction: 'asc', label: 'Student Number' },
];

/**
 * Saved search interface
 */
export interface SavedSearch {
  id: string;
  name: string;
  filters: AdvancedFilters;
  sortBy?: SortOption;
  createdAt: string;
  lastUsed?: string;
  isDefault?: boolean;
}

/**
 * Hook for real-time student search with debouncing and autocomplete
 * 
 * @param initialQuery - Initial search query
 * @param options - Search options
 * @returns Search results and control functions
 * 
 * @example
 * ```tsx
 * const {
 *   query,
 *   setQuery,
 *   results,
 *   suggestions,
 *   isSearching,
 *   clearSearch
 * } = useStudentSearch('', {
 *   debounceMs: 300,
 *   enableSuggestions: true,
 *   minQueryLength: 2
 * });
 * 
 * return (
 *   <SearchInput
 *     value={query}
 *     onChange={setQuery}
 *     suggestions={suggestions}
 *     loading={isSearching}
 *     onClear={clearSearch}
 *   />
 * );
 * ```
 */
export const useStudentSearch = (
  initialQuery: string = '',
  options?: {
    debounceMs?: number;
    enableSuggestions?: boolean;
    minQueryLength?: number;
    maxResults?: number;
    searchFields?: ('firstName' | 'lastName' | 'studentNumber' | 'medicalRecordNum')[];
  }
) => {
  const queryClient = useQueryClient();
  const config = cacheConfig.searches;
  
  const {
    debounceMs = 300,
    enableSuggestions = true,
    minQueryLength = 2,
    maxResults = 50,
    searchFields = ['firstName', 'lastName', 'studentNumber'],
  } = options || {};

  // Search state
  const [query, setQueryState] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  // Debounce search query
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    debounceTimer.current = setTimeout(() => {
      setDebouncedQuery(query.trim());
      
      // Add to recent searches if long enough and not already there
      if (query.trim().length >= minQueryLength && !recentSearches.includes(query.trim())) {
        setRecentSearches(prev => [query.trim(), ...prev.slice(0, 9)]);
      }
    }, debounceMs);
    
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query, debounceMs, minQueryLength, recentSearches]);

  // Main search query
  const searchQuery = useQuery({
    queryKey: studentQueryKeys.searches.byQuery(debouncedQuery),
    queryFn: async () => {
      if (debouncedQuery.length < minQueryLength) {
        return [];
      }
      
      // For now, use the existing API with search parameter
      const response = await studentsApi.getAll({ 
        search: debouncedQuery,
        limit: maxResults,
      });
      
      return response.students;
    },
    enabled: debouncedQuery.length >= minQueryLength,
    staleTime: config.staleTime,
    gcTime: config.gcTime,
    retry: config.retry,
    retryDelay: config.retryDelay,
  });

  // Search suggestions query
  const suggestionsQuery = useQuery({
    queryKey: studentQueryKeys.searches.suggestions(query),
    queryFn: async (): Promise<SearchSuggestion[]> => {
      if (!enableSuggestions || query.length < 1) {
        return [];
      }

      const suggestions: SearchSuggestion[] = [];
      
      // Add recent searches
      recentSearches
        .filter(search => search.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 3)
        .forEach(search => {
          suggestions.push({
            type: 'recent',
            value: search,
            label: `Recent: ${search}`,
          });
        });

      // Add grade suggestions if query looks like a grade
      const gradePattern = /^[KTk]?\d{0,2}$/i;
      if (gradePattern.test(query)) {
        const possibleGrades = ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
        possibleGrades
          .filter(grade => grade.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 5)
          .forEach(grade => {
            suggestions.push({
              type: 'grade',
              value: grade,
              label: `Grade ${grade}`,
              metadata: { grade },
            });
          });
      }

      return suggestions.slice(0, 10);
    },
    enabled: enableSuggestions && query.length > 0,
    staleTime: 30000, // 30 seconds for suggestions
    gcTime: 60000,
  });

  // Control functions
  const setQuery = useCallback((newQuery: string) => {
    setQueryState(newQuery);
  }, []);

  const clearSearch = useCallback(() => {
    setQueryState('');
    setDebouncedQuery('');
  }, []);

  const selectSuggestion = useCallback((suggestion: SearchSuggestion) => {
    setQuery(suggestion.value);
  }, [setQuery]);

  return {
    // Search state
    query,
    debouncedQuery,
    isSearching: searchQuery.isFetching,
    hasQuery: debouncedQuery.length >= minQueryLength,
    
    // Results
    results: searchQuery.data || [],
    suggestions: suggestionsQuery.data || [],
    recentSearches,
    
    // Status
    isLoading: searchQuery.isLoading,
    isFetching: searchQuery.isFetching,
    error: searchQuery.error as ApiError | null,
    
    // Controls
    setQuery,
    clearSearch,
    selectSuggestion,
    refetch: searchQuery.refetch,
  };
};

/**
 * Hook for advanced filtering with multiple criteria
 * 
 * @param initialFilters - Initial filter values
 * @param options - Filter options
 * @returns Filter state and control functions
 * 
 * @example
 * ```tsx
 * const {
 *   filters,
 *   updateFilter,
 *   clearFilters,
 *   applyFilters,
 *   results,
 *   isFiltering
 * } = useAdvancedFilters({
 *   grade: '5',
 *   isActive: true
 * });
 * ```
 */
export const useAdvancedFilters = (
  initialFilters: Partial<AdvancedFilters> = {},
  options?: {
    autoApply?: boolean;
    debounceMs?: number;
  }
) => {
  const { autoApply = true, debounceMs = 500 } = options || {};
  const config = cacheConfig.lists;
  
  const [filters, setFilters] = useState<AdvancedFilters>(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState<AdvancedFilters>(initialFilters);
  
  // Debounce filter application
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    if (!autoApply) return;
    
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    debounceTimer.current = setTimeout(() => {
      setAppliedFilters(filters);
    }, debounceMs);
    
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [filters, autoApply, debounceMs]);

  // Filtered results query
  const filteredQuery = useQuery({
    queryKey: studentQueryKeys.lists.filtered(appliedFilters),
    queryFn: async () => {
      const response = await studentsApi.getAll(appliedFilters);
      return response;
    },
    enabled: Object.keys(appliedFilters).length > 0,
    staleTime: config.staleTime,
    gcTime: config.gcTime,
    retry: config.retry,
    retryDelay: config.retryDelay,
  });

  // Filter control functions
  const updateFilter = useCallback(<K extends keyof AdvancedFilters>(
    key: K,
    value: AdvancedFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateFilters = useCallback((newFilters: Partial<AdvancedFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setAppliedFilters({});
  }, []);

  const applyFilters = useCallback(() => {
    setAppliedFilters(filters);
  }, [filters]);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
  }, [initialFilters]);

  // Check if filters have changed
  const hasChanges = useMemo(() => {
    return JSON.stringify(filters) !== JSON.stringify(appliedFilters);
  }, [filters, appliedFilters]);

  // Active filter count
  const activeFilterCount = useMemo(() => {
    return Object.values(appliedFilters).filter(value => 
      value !== undefined && value !== null && value !== ''
    ).length;
  }, [appliedFilters]);

  return {
    // Filter state
    filters,
    appliedFilters,
    hasChanges,
    activeFilterCount,
    
    // Results
    results: filteredQuery.data?.students || [],
    pagination: filteredQuery.data?.pagination,
    
    // Status
    isFiltering: filteredQuery.isFetching,
    isLoading: filteredQuery.isLoading,
    error: filteredQuery.error as ApiError | null,
    
    // Controls
    updateFilter,
    updateFilters,
    clearFilters,
    applyFilters,
    resetFilters,
    refetch: filteredQuery.refetch,
  };
};

/**
 * Hook for sorting students with multiple criteria
 * 
 * @param students - Array of students to sort
 * @param initialSort - Initial sort option
 * @returns Sorted students and sort controls
 */
export const useStudentSorting = (
  students: Student[],
  initialSort?: SortOption
) => {
  const [sortBy, setSortBy] = useState<SortOption>(
    initialSort || SORT_OPTIONS[0]
  );

  const sortedStudents = useMemo(() => {
    if (!students.length) return [];

    return [...students].sort((a, b) => {
      const { field, direction } = sortBy;
      let aValue: any;
      let bValue: any;

      // Handle special computed fields
      switch (field) {
        case 'fullName':
          aValue = `${a.lastName}, ${a.firstName}`;
          bValue = `${b.lastName}, ${b.firstName}`;
          break;
        case 'enrollmentDate':
          aValue = a.enrollmentDate ? new Date(a.enrollmentDate) : new Date(0);
          bValue = b.enrollmentDate ? new Date(b.enrollmentDate) : new Date(0);
          break;
        default:
          aValue = a[field as keyof Student];
          bValue = b[field as keyof Student];
      }

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return direction === 'asc' ? 1 : -1;
      if (bValue == null) return direction === 'asc' ? -1 : 1;

      // Convert to strings for comparison if needed
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      let comparison = 0;
      if (aValue < bValue) comparison = -1;
      else if (aValue > bValue) comparison = 1;

      return direction === 'desc' ? -comparison : comparison;
    });
  }, [students, sortBy]);

  const updateSort = useCallback((newSort: SortOption) => {
    setSortBy(newSort);
  }, []);

  const toggleDirection = useCallback(() => {
    setSortBy(prev => ({
      ...prev,
      direction: prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  return {
    sortedStudents,
    sortBy,
    updateSort,
    toggleDirection,
    sortOptions: SORT_OPTIONS,
  };
};

/**
 * Hook for managing saved searches
 * 
 * @returns Saved search management functions
 */
export const useSavedSearches = () => {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [currentSearch, setCurrentSearch] = useState<SavedSearch | null>(null);

  // Load saved searches from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('student-saved-searches');
      if (saved) {
        setSavedSearches(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load saved searches:', error);
    }
  }, []);

  // Save to localStorage whenever saved searches change
  useEffect(() => {
    try {
      localStorage.setItem('student-saved-searches', JSON.stringify(savedSearches));
    } catch (error) {
      console.error('Failed to save searches:', error);
    }
  }, [savedSearches]);

  const saveSearch = useCallback((
    name: string,
    filters: AdvancedFilters,
    sortBy?: SortOption,
    isDefault = false
  ) => {
    const newSearch: SavedSearch = {
      id: `search-${Date.now()}`,
      name,
      filters,
      sortBy,
      createdAt: new Date().toISOString(),
      isDefault,
    };

    setSavedSearches(prev => {
      // Remove default flag from other searches if this one is default
      const updated = isDefault 
        ? prev.map(search => ({ ...search, isDefault: false }))
        : prev;
      
      return [...updated, newSearch];
    });

    return newSearch;
  }, []);

  const deleteSearch = useCallback((searchId: string) => {
    setSavedSearches(prev => prev.filter(search => search.id !== searchId));
    
    if (currentSearch?.id === searchId) {
      setCurrentSearch(null);
    }
  }, [currentSearch]);

  const loadSearch = useCallback((search: SavedSearch) => {
    setCurrentSearch({
      ...search,
      lastUsed: new Date().toISOString(),
    });

    // Update last used timestamp
    setSavedSearches(prev =>
      prev.map(s => s.id === search.id ? { ...s, lastUsed: new Date().toISOString() } : s)
    );

    return search;
  }, []);

  const updateSearch = useCallback((searchId: string, updates: Partial<SavedSearch>) => {
    setSavedSearches(prev =>
      prev.map(search => search.id === searchId ? { ...search, ...updates } : search)
    );
  }, []);

  const getDefaultSearch = useCallback(() => {
    return savedSearches.find(search => search.isDefault);
  }, [savedSearches]);

  return {
    savedSearches,
    currentSearch,
    saveSearch,
    deleteSearch,
    loadSearch,
    updateSearch,
    setCurrentSearch,
    getDefaultSearch,
  };
};

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
 * } = useStudentSearchAndFilter();
 * ```
 */
export const useStudentSearchAndFilter = (
  options?: {
    initialQuery?: string;
    initialFilters?: Partial<AdvancedFilters>;
    initialSort?: SortOption;
    autoApply?: boolean;
    enableSuggestions?: boolean;
  }
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

/**
 * Export all search and filter hooks
 */
export default {
  useStudentSearch,
  useAdvancedFilters,
  useStudentSorting,
  useSavedSearches,
  useStudentSearchAndFilter,
};