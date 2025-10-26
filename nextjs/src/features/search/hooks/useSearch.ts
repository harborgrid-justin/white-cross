/**
 * useSearch Hook
 *
 * Main search hook with debouncing, caching, and state management
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  SearchQuery,
  SearchResponse,
  SearchResult,
  SearchEntityType,
  SearchSortOrder,
  FilterGroup,
  SearchOptions,
} from '../types';
import { getSearchEngine } from '../services/searchEngine';

export interface UseSearchOptions extends SearchOptions {
  enabled?: boolean;
  debounceMs?: number;
  keepPreviousData?: boolean;
  onSuccess?: (data: SearchResponse) => void;
  onError?: (error: Error) => void;
}

export interface UseSearchReturn {
  // Results
  results: SearchResult[];
  total: number;
  totalPages: number;
  executionTimeMs: number;
  suggestions: string[];

  // State
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: Error | null;

  // Query management
  query: string;
  setQuery: (query: string) => void;
  entityType: SearchEntityType;
  setEntityType: (type: SearchEntityType) => void;
  filters: FilterGroup | undefined;
  setFilters: (filters: FilterGroup | undefined) => void;
  sortBy: SearchSortOrder;
  setSortBy: (sortBy: SearchSortOrder) => void;

  // Pagination
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;

  // Actions
  search: () => void;
  clearSearch: () => void;
  refetch: () => void;
}

/**
 * Main search hook
 */
export function useSearch(
  initialQuery: string = '',
  initialOptions: UseSearchOptions = {}
): UseSearchReturn {
  const queryClient = useQueryClient();

  // State
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [entityType, setEntityType] = useState<SearchEntityType>(
    SearchEntityType.ALL
  );
  const [filters, setFilters] = useState<FilterGroup | undefined>();
  const [sortBy, setSortBy] = useState<SearchSortOrder>(
    SearchSortOrder.RELEVANCE
  );
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Debouncing
  const debounceMs = initialOptions.debounceMs ?? 300;
  const debounceTimerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedQuery(query);
      setPage(1); // Reset to first page on new search
    }, debounceMs);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query, debounceMs]);

  // Build search query
  const searchQuery: SearchQuery = {
    query: debouncedQuery,
    entityType,
    filters,
    sortBy,
    page,
    pageSize,
    fuzzySearch: initialOptions.fuzzySearch ?? true,
    phoneticSearch: initialOptions.phoneticSearch ?? false,
    highlightResults: initialOptions.highlightResults ?? true,
    includeMetadata: initialOptions.includeMetadata ?? false,
  };

  // Search query
  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['search', searchQuery],
    queryFn: async () => {
      const searchEngine = getSearchEngine(initialOptions);
      return await searchEngine.search(searchQuery, initialOptions);
    },
    enabled: initialOptions.enabled !== false && debouncedQuery.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Callbacks
  const search = useCallback(() => {
    setDebouncedQuery(query);
    refetch();
  }, [query, refetch]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
    setFilters(undefined);
    setPage(1);
  }, []);

  const nextPage = useCallback(() => {
    if (data && page < data.totalPages) {
      setPage(p => p + 1);
    }
  }, [data, page]);

  const previousPage = useCallback(() => {
    if (page > 1) {
      setPage(p => p - 1);
    }
  }, [page]);

  // Success/error callbacks
  useEffect(() => {
    if (data && initialOptions.onSuccess) {
      initialOptions.onSuccess(data);
    }
  }, [data, initialOptions]);

  useEffect(() => {
    if (error && initialOptions.onError) {
      initialOptions.onError(error as Error);
    }
  }, [error, initialOptions]);

  return {
    // Results
    results: data?.results || [],
    total: data?.total || 0,
    totalPages: data?.totalPages || 0,
    executionTimeMs: data?.executionTimeMs || 0,
    suggestions: data?.suggestions || [],

    // State
    isLoading,
    isFetching,
    isError,
    error: error as Error | null,

    // Query management
    query,
    setQuery,
    entityType,
    setEntityType,
    filters,
    setFilters,
    sortBy,
    setSortBy,

    // Pagination
    page,
    pageSize,
    setPage,
    setPageSize,
    nextPage,
    previousPage,
    hasNextPage: data ? page < data.totalPages : false,
    hasPreviousPage: page > 1,

    // Actions
    search,
    clearSearch,
    refetch,
  };
}

/**
 * Hook for searching with instant results (no debouncing)
 */
export function useInstantSearch(
  initialQuery: string = '',
  options: UseSearchOptions = {}
): UseSearchReturn {
  return useSearch(initialQuery, { ...options, debounceMs: 0 });
}

/**
 * Hook for searching specific entity type
 */
export function useEntitySearch(
  entityType: SearchEntityType,
  initialQuery: string = '',
  options: UseSearchOptions = {}
): Omit<UseSearchReturn, 'entityType' | 'setEntityType'> {
  const searchResult = useSearch(initialQuery, options);

  useEffect(() => {
    searchResult.setEntityType(entityType);
  }, [entityType, searchResult]);

  const { setEntityType: _setEntityType, ...rest } = searchResult;
  return rest;
}
