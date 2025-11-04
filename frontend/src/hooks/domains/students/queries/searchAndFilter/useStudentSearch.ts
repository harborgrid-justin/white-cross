/**
 * Student Search Hook
 *
 * Real-time student search with debouncing, autocomplete, and search suggestions.
 * Provides optimized search functionality with recent search tracking.
 *
 * @module hooks/students/searchAndFilter/useStudentSearch
 * @author White Cross Healthcare Platform
 * @version 2.0.0
 */

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useCallback, useState, useEffect, useRef } from 'react';
import { studentQueryKeys } from '../queryKeys';
import { cacheConfig } from '../cacheConfig';
import { apiActions } from '@/lib/api';
import type {
  SearchSuggestion,
  ApiError,
  SearchOptions
} from './searchFilterTypes';

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
  options?: SearchOptions
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
      const response = await apiActions.students.getAll({
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
