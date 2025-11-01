/**
 * useMessageSearch Hook
 *
 * React Query hook for searching messages with debouncing
 */

import { useQuery } from '@tanstack/react-query';
import { messageApi } from '@/services/messaging';
import type { MessageSearchParams } from '@/services/messaging';
import { useState, useEffect } from 'react';

export const searchKeys = {
  all: ['message-search'] as const,
  search: (params: MessageSearchParams) => [...searchKeys.all, params] as const,
};

interface UseMessageSearchOptions extends Omit<MessageSearchParams, 'query'> {
  debounceMs?: number;
  enabled?: boolean;
  minQueryLength?: number;
}

export function useMessageSearch(
  query: string,
  options: UseMessageSearchOptions = {}
) {
  const {
    debounceMs = 300,
    enabled = true,
    minQueryLength = 2,
    ...searchParams
  } = options;

  const [debouncedQuery, setDebouncedQuery] = useState(query);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  const searchQuery = useQuery({
    queryKey: searchKeys.search({ query: debouncedQuery, ...searchParams }),
    queryFn: async () => {
      return await messageApi.searchMessages({
        query: debouncedQuery,
        ...searchParams,
      });
    },
    enabled: enabled && debouncedQuery.length >= minQueryLength,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });

  return {
    ...searchQuery,
    messages: searchQuery.data?.messages || [],
    total: searchQuery.data?.total || 0,
    isSearching: searchQuery.isFetching,
    hasQuery: debouncedQuery.length >= minQueryLength,
  };
}
