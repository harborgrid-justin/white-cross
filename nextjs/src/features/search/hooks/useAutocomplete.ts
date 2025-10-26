/**
 * useAutocomplete Hook
 *
 * Search autocomplete and suggestions with history
 */

'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  SearchSuggestion,
  SearchEntityType,
  SearchHistoryEntry,
} from '../types';
import { AutocompleteService } from '../services/autocompleteService';

export interface UseAutocompleteOptions {
  entityType?: SearchEntityType;
  includeRecent?: boolean;
  includePopular?: boolean;
  includePredictive?: boolean;
  minChars?: number;
  maxSuggestions?: number;
  debounceMs?: number;
  enabled?: boolean;
}

export interface UseAutocompleteReturn {
  suggestions: SearchSuggestion[];
  isLoading: boolean;
  getSuggestions: (query: string) => Promise<void>;
  clearSuggestions: () => void;
  addToHistory: (entry: SearchHistoryEntry) => void;
  clearHistory: () => void;
  getHistory: (limit?: number) => SearchHistoryEntry[];
}

// Create singleton service
let autocompleteService: AutocompleteService | null = null;

const getAutocompleteService = (maxSuggestions: number = 10) => {
  if (!autocompleteService) {
    autocompleteService = new AutocompleteService(maxSuggestions);
  }
  return autocompleteService;
};

/**
 * Main autocomplete hook
 */
export function useAutocomplete(
  query: string,
  options: UseAutocompleteOptions = {}
): UseAutocompleteReturn {
  const {
    entityType,
    includeRecent = true,
    includePopular = true,
    includePredictive = true,
    minChars = 1,
    maxSuggestions = 10,
    debounceMs = 150,
    enabled = true,
  } = options;

  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const debounceTimerRef = useRef<NodeJS.Timeout>();

  const service = useMemo(() => getAutocompleteService(maxSuggestions), [maxSuggestions]);

  // Debounce query
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query, debounceMs]);

  // Fetch suggestions
  const { data: suggestions = [], isLoading } = useQuery({
    queryKey: ['autocomplete', debouncedQuery, entityType, includeRecent, includePopular, includePredictive],
    queryFn: async () => {
      if (!enabled || debouncedQuery.length < minChars) {
        return [];
      }

      return await service.getSuggestions(debouncedQuery, entityType, {
        includeRecent,
        includePopular,
        includePredictive,
      });
    },
    enabled: enabled && debouncedQuery.length >= minChars,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const getSuggestions = useCallback(
    async (searchQuery: string) => {
      return await service.getSuggestions(searchQuery, entityType, {
        includeRecent,
        includePopular,
        includePredictive,
      });
    },
    [service, entityType, includeRecent, includePopular, includePredictive]
  );

  const clearSuggestions = useCallback(() => {
    service.clearCache();
  }, [service]);

  const addToHistory = useCallback(
    (entry: SearchHistoryEntry) => {
      service.addToHistory(entry);
    },
    [service]
  );

  const clearHistory = useCallback(() => {
    service.clearHistory();
  }, [service]);

  const getHistory = useCallback(
    (limit?: number) => {
      return service.getHistory(limit);
    },
    [service]
  );

  return {
    suggestions,
    isLoading,
    getSuggestions,
    clearSuggestions,
    addToHistory,
    clearHistory,
    getHistory,
  };
}

/**
 * Hook for search history management
 */
export function useSearchHistory() {
  const service = useMemo(() => getAutocompleteService(), []);
  const [history, setHistory] = useState<SearchHistoryEntry[]>([]);

  useEffect(() => {
    // Load history from localStorage on mount
    const loadHistory = () => {
      try {
        const stored = localStorage.getItem('search-history');
        if (stored) {
          const parsed: SearchHistoryEntry[] = JSON.parse(stored);
          // Convert date strings back to Date objects
          const historyWithDates = parsed.map(entry => ({
            ...entry,
            timestamp: new Date(entry.timestamp),
          }));
          service.loadHistory(historyWithDates);
          setHistory(historyWithDates);
        }
      } catch (error) {
        console.error('Failed to load search history:', error);
      }
    };

    loadHistory();
  }, [service]);

  const addToHistory = useCallback(
    (entry: SearchHistoryEntry) => {
      service.addToHistory(entry);
      const updatedHistory = service.getHistory();
      setHistory(updatedHistory);

      // Persist to localStorage (excluding PHI)
      try {
        localStorage.setItem('search-history', JSON.stringify(updatedHistory));
      } catch (error) {
        console.error('Failed to save search history:', error);
      }
    },
    [service]
  );

  const clearHistory = useCallback(() => {
    service.clearHistory();
    setHistory([]);
    try {
      localStorage.removeItem('search-history');
    } catch (error) {
      console.error('Failed to clear search history:', error);
    }
  }, [service]);

  const getHistory = useCallback(
    (limit?: number) => {
      return service.getHistory(limit);
    },
    [service]
  );

  return {
    history,
    addToHistory,
    clearHistory,
    getHistory,
  };
}

/**
 * Hook for recent searches
 */
export function useRecentSearches(limit: number = 5) {
  const { history, addToHistory, clearHistory } = useSearchHistory();

  const recentSearches = useMemo(() => {
    return history.slice(0, limit);
  }, [history, limit]);

  return {
    recentSearches,
    addToHistory,
    clearHistory,
  };
}

/**
 * Hook for popular searches
 */
export function usePopularSearches(limit: number = 5) {
  const { history } = useSearchHistory();

  const popularSearches = useMemo(() => {
    // Count occurrences
    const counts = new Map<string, number>();
    history.forEach(entry => {
      const count = counts.get(entry.query) || 0;
      counts.set(entry.query, count + 1);
    });

    // Sort by count and return top N
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([query]) => query);
  }, [history, limit]);

  return {
    popularSearches,
  };
}
