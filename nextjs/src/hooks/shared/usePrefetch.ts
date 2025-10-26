/**
 * Smart Prefetch Hook
 *
 * Advanced prefetching strategies including:
 * - Prefetch on hover with configurable delay
 * - Prefetch next page
 * - Predictive prefetching based on navigation patterns
 * - Smart prefetching (only when network idle)
 * - Priority-based prefetching
 */

import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useCallback, useState } from 'react';
import type { PrefetchOptions, NavigationPattern } from '@/services/cache/types';
import { getPersistenceManager } from '@/services/cache/persistence';

/**
 * Network Idle Detection Hook
 */
function useNetworkIdle(threshold = 2): boolean {
  const [isIdle, setIsIdle] = useState(false);
  const activeRequestsRef = useRef(0);

  useEffect(() => {
    // Monitor network requests using Performance API
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();

      for (const entry of entries) {
        if (entry.entryType === 'resource') {
          const resourceEntry = entry as PerformanceResourceTiming;

          // Check if request is complete
          if (resourceEntry.responseEnd > 0) {
            activeRequestsRef.current = Math.max(
              0,
              activeRequestsRef.current - 1
            );
          } else {
            activeRequestsRef.current++;
          }
        }
      }

      // Update idle state
      setIsIdle(activeRequestsRef.current < threshold);
    });

    observer.observe({ entryTypes: ['resource'] });

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  return isIdle;
}

/**
 * Prefetch Hook Options
 */
interface UsePrefetchOptions extends PrefetchOptions {
  /** Query key to prefetch */
  queryKey?: unknown[];
  /** Query function to execute */
  queryFn?: () => Promise<unknown>;
  /** Enable prefetching */
  enabled?: boolean;
}

/**
 * Prefetch Hook
 *
 * @param options - Prefetch options
 * @returns Prefetch handlers and state
 */
export function usePrefetch(options: UsePrefetchOptions = {}) {
  const {
    queryKey,
    queryFn,
    enabled = true,
    onHover = false,
    hoverDelay = 100,
    onlyWhenIdle = false,
    priority = 5
  } = options;

  const queryClient = useQueryClient();
  const isNetworkIdle = useNetworkIdle();
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isPrefetching, setIsPrefetching] = useState(false);

  /**
   * Execute Prefetch
   */
  const executePrefetch = useCallback(async () => {
    if (!enabled || !queryKey || !queryFn) return;

    // Check network idle condition
    if (onlyWhenIdle && !isNetworkIdle) {
      return;
    }

    // Check if already cached
    const cachedData = queryClient.getQueryData(queryKey);
    if (cachedData) {
      return; // Already cached, no need to prefetch
    }

    try {
      setIsPrefetching(true);

      await queryClient.prefetchQuery({
        queryKey,
        queryFn,
        staleTime: 5 * 60 * 1000 // 5 minutes
      });

      console.log('[usePrefetch] Prefetched:', queryKey);
    } catch (error) {
      console.error('[usePrefetch] Prefetch failed:', error);
    } finally {
      setIsPrefetching(false);
    }
  }, [enabled, queryKey, queryFn, onlyWhenIdle, isNetworkIdle, queryClient]);

  /**
   * Handle Mouse Enter (Hover)
   */
  const handleMouseEnter = useCallback(() => {
    if (!onHover || !enabled) return;

    // Clear existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    // Set new timeout
    hoverTimeoutRef.current = setTimeout(() => {
      executePrefetch();
    }, hoverDelay);
  }, [onHover, enabled, hoverDelay, executePrefetch]);

  /**
   * Handle Mouse Leave
   */
  const handleMouseLeave = useCallback(() => {
    // Clear timeout on mouse leave
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  }, []);

  /**
   * Prefetch Immediately
   */
  const prefetchNow = useCallback(() => {
    executePrefetch();
  }, [executePrefetch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return {
    isPrefetching,
    prefetchNow,
    handleMouseEnter,
    handleMouseLeave,
    // Convenience props for spreading on elements
    hoverProps: onHover
      ? {
          onMouseEnter: handleMouseEnter,
          onMouseLeave: handleMouseLeave
        }
      : {}
  };
}

/**
 * Prefetch List Item on Hover
 *
 * Specialized hook for prefetching detail views when hovering over list items
 *
 * @param itemId - Item ID
 * @param getQueryKey - Function to generate query key for detail view
 * @param getQueryFn - Function to generate query function
 * @param options - Prefetch options
 */
export function usePrefetchListItem<TId>(
  itemId: TId,
  getQueryKey: (id: TId) => unknown[],
  getQueryFn: (id: TId) => () => Promise<unknown>,
  options: Omit<UsePrefetchOptions, 'queryKey' | 'queryFn'> = {}
) {
  const queryKey = getQueryKey(itemId);
  const queryFn = getQueryFn(itemId);

  return usePrefetch({
    ...options,
    queryKey,
    queryFn,
    onHover: true,
    hoverDelay: options.hoverDelay ?? 100
  });
}

/**
 * Prefetch Next Page
 *
 * Prefetch the next page of paginated data
 *
 * @param currentPage - Current page number
 * @param hasNextPage - Whether there is a next page
 * @param getQueryKey - Function to generate query key for page
 * @param getQueryFn - Function to generate query function
 */
export function usePrefetchNextPage(
  currentPage: number,
  hasNextPage: boolean,
  getQueryKey: (page: number) => unknown[],
  getQueryFn: (page: number) => () => Promise<unknown>
) {
  const queryClient = useQueryClient();
  const isNetworkIdle = useNetworkIdle();

  useEffect(() => {
    if (!hasNextPage || !isNetworkIdle) return;

    const nextPage = currentPage + 1;
    const queryKey = getQueryKey(nextPage);
    const queryFn = getQueryFn(nextPage);

    // Prefetch next page when network is idle
    const timeoutId = setTimeout(() => {
      queryClient.prefetchQuery({
        queryKey,
        queryFn,
        staleTime: 5 * 60 * 1000
      });

      console.log('[usePrefetchNextPage] Prefetched page:', nextPage);
    }, 500); // Small delay to ensure current page is fully loaded

    return () => {
      clearTimeout(timeoutId);
    };
  }, [currentPage, hasNextPage, isNetworkIdle, getQueryKey, getQueryFn, queryClient]);
}

/**
 * Predictive Prefetch Hook
 *
 * Prefetches data based on navigation patterns
 *
 * @param currentRoute - Current route/page
 * @param getPrefetchConfig - Function to get prefetch config for a route
 */
export function usePredictivePrefetch(
  currentRoute: string,
  getPrefetchConfig: (
    route: string
  ) => {
    queryKey: unknown[];
    queryFn: () => Promise<unknown>;
  } | null
) {
  const queryClient = useQueryClient();
  const persistenceManager = getPersistenceManager();
  const isNetworkIdle = useNetworkIdle();
  const [predictedRoutes, setPredictedRoutes] = useState<string[]>([]);

  // Load navigation patterns
  useEffect(() => {
    async function loadPatterns() {
      const patterns = await persistenceManager.getNavigationPatterns(
        currentRoute
      );

      // Get top 3 most frequent destinations
      const topRoutes = patterns
        .sort((a, b) => b.frequency - a.frequency)
        .slice(0, 3)
        .map((p) => p.to);

      setPredictedRoutes(topRoutes);
    }

    loadPatterns();
  }, [currentRoute, persistenceManager]);

  // Prefetch predicted routes
  useEffect(() => {
    if (!isNetworkIdle || predictedRoutes.length === 0) return;

    const prefetchPromises = predictedRoutes.map(async (route) => {
      const config = getPrefetchConfig(route);
      if (!config) return;

      const { queryKey, queryFn } = config;

      // Check if already cached
      const cachedData = queryClient.getQueryData(queryKey);
      if (cachedData) return;

      try {
        await queryClient.prefetchQuery({
          queryKey,
          queryFn,
          staleTime: 5 * 60 * 1000
        });

        console.log('[usePredictivePrefetch] Prefetched route:', route);
      } catch (error) {
        console.error(
          '[usePredictivePrefetch] Prefetch failed for route:',
          route,
          error
        );
      }
    });

    Promise.all(prefetchPromises);
  }, [isNetworkIdle, predictedRoutes, getPrefetchConfig, queryClient]);

  /**
   * Record Navigation
   *
   * Call this when navigating to update patterns
   */
  const recordNavigation = useCallback(
    async (toRoute: string) => {
      await persistenceManager.persistNavigationPattern(currentRoute, toRoute);
    },
    [currentRoute, persistenceManager]
  );

  return {
    predictedRoutes,
    recordNavigation
  };
}

/**
 * Smart Prefetch Manager Hook
 *
 * Centralized prefetching with priority queue
 */
export function useSmartPrefetchManager() {
  const queryClient = useQueryClient();
  const isNetworkIdle = useNetworkIdle();
  const prefetchQueueRef = useRef<
    Array<{
      queryKey: unknown[];
      queryFn: () => Promise<unknown>;
      priority: number;
    }>
  >([]);
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Add to Prefetch Queue
   */
  const queuePrefetch = useCallback(
    (
      queryKey: unknown[],
      queryFn: () => Promise<unknown>,
      priority = 5
    ) => {
      // Check if already queued
      const alreadyQueued = prefetchQueueRef.current.some(
        (item) => JSON.stringify(item.queryKey) === JSON.stringify(queryKey)
      );

      if (alreadyQueued) return;

      // Add to queue
      prefetchQueueRef.current.push({
        queryKey,
        queryFn,
        priority
      });

      // Sort by priority (higher first)
      prefetchQueueRef.current.sort((a, b) => b.priority - a.priority);
    },
    []
  );

  /**
   * Process Prefetch Queue
   */
  const processQueue = useCallback(async () => {
    if (isProcessing || !isNetworkIdle || prefetchQueueRef.current.length === 0) {
      return;
    }

    setIsProcessing(true);

    while (prefetchQueueRef.current.length > 0) {
      const item = prefetchQueueRef.current.shift();
      if (!item) break;

      // Check if already cached
      const cachedData = queryClient.getQueryData(item.queryKey);
      if (cachedData) continue;

      try {
        await queryClient.prefetchQuery({
          queryKey: item.queryKey,
          queryFn: item.queryFn,
          staleTime: 5 * 60 * 1000
        });

        console.log(
          '[useSmartPrefetchManager] Prefetched:',
          item.queryKey
        );

        // Small delay between prefetches to avoid overwhelming network
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        console.error(
          '[useSmartPrefetchManager] Prefetch failed:',
          error
        );
      }
    }

    setIsProcessing(false);
  }, [isProcessing, isNetworkIdle, queryClient]);

  // Process queue when network becomes idle
  useEffect(() => {
    if (isNetworkIdle && !isProcessing) {
      processQueue();
    }
  }, [isNetworkIdle, isProcessing, processQueue]);

  return {
    queuePrefetch,
    isProcessing,
    queueSize: prefetchQueueRef.current.length
  };
}
