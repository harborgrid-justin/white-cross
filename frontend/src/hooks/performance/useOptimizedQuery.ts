/**
 * Optimized Query Hook
 *
 * Enhanced TanStack Query hook with performance optimizations:
 * - Automatic request deduplication
 * - Smart stale-while-revalidate caching
 * - Optimistic updates
 * - Prefetching support
 * - Error retry with exponential backoff
 *
 * @module hooks/performance/useOptimizedQuery
 * @since 1.2.0
 */

import { useQuery, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';

export interface OptimizedQueryOptions<TData, TError = Error> extends Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'> {
  /** Query key */
  queryKey: unknown[];

  /** Query function */
  queryFn: () => Promise<TData>;

  /** Enable prefetching on mount (default: false) */
  prefetchOnMount?: boolean;

  /** Prefetch related queries (provide query keys) */
  prefetchRelated?: Array<{
    queryKey: unknown[];
    queryFn: () => Promise<any>;
  }>;

  /** Cache time in milliseconds (default: 5 minutes) */
  cacheTime?: number;

  /** Stale time in milliseconds (default: 1 minute) */
  staleTime?: number;

  /** Enable optimistic updates */
  optimisticUpdate?: boolean;
}

/**
 * Optimized query hook with advanced performance features
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useOptimizedQuery({
 *   queryKey: ['students', id],
 *   queryFn: () => fetchStudent(id),
 *   staleTime: 5 * 60 * 1000, // 5 minutes
 *   prefetchRelated: [
 *     {
 *       queryKey: ['student-health-records', id],
 *       queryFn: () => fetchHealthRecords(id),
 *     },
 *   ],
 * })
 * ```
 */
export function useOptimizedQuery<TData, TError = Error>({
  queryKey,
  queryFn,
  prefetchOnMount = false,
  prefetchRelated = [],
  cacheTime = 5 * 60 * 1000, // 5 minutes
  staleTime = 60 * 1000, // 1 minute
  optimisticUpdate = false,
  ...options
}: OptimizedQueryOptions<TData, TError>) {
  const queryClient = useQueryClient();

  // Main query with optimized defaults
  const query = useQuery<TData, TError>({
    queryKey,
    queryFn,
    staleTime,
    gcTime: cacheTime,
    retry: (failureCount, error: any) => {
      // Don't retry on client errors (4xx)
      if (error?.status >= 400 && error?.status < 500) {
        return false;
      }
      // Retry up to 3 times for server errors
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => {
      // Exponential backoff: 1s, 2s, 4s
      return Math.min(1000 * 2 ** attemptIndex, 10000);
    },
    ...options,
  });

  // Prefetch related queries on mount
  useEffect(() => {
    if (prefetchOnMount && query.isSuccess) {
      prefetchRelated.forEach(({ queryKey: relatedKey, queryFn: relatedFn }) => {
        queryClient.prefetchQuery({
          queryKey: relatedKey,
          queryFn: relatedFn,
          staleTime,
        });
      });
    }
  }, [prefetchOnMount, query.isSuccess, prefetchRelated, queryClient, staleTime]);

  // Prefetch function for manual prefetching
  const prefetch = useCallback(() => {
    return queryClient.prefetchQuery({
      queryKey,
      queryFn,
      staleTime,
    });
  }, [queryClient, queryKey, queryFn, staleTime]);

  // Invalidate function for cache invalidation
  const invalidate = useCallback(() => {
    return queryClient.invalidateQueries({ queryKey });
  }, [queryClient, queryKey]);

  // Optimistic update function
  const setOptimisticData = useCallback(
    (updater: (old: TData | undefined) => TData) => {
      if (optimisticUpdate) {
        queryClient.setQueryData(queryKey, updater);
      }
    },
    [queryClient, queryKey, optimisticUpdate]
  );

  return {
    ...query,
    prefetch,
    invalidate,
    setOptimisticData,
  };
}

/**
 * Hook for prefetching queries on hover or focus
 *
 * @example
 * ```tsx
 * const prefetchStudent = usePrefetchOnInteraction(['student', id], () => fetchStudent(id))
 *
 * return (
 *   <div onMouseEnter={prefetchStudent}>
 *     Student Name
 *   </div>
 * )
 * ```
 */
export function usePrefetchOnInteraction<TData>(
  queryKey: unknown[],
  queryFn: () => Promise<TData>,
  options: { staleTime?: number } = {}
) {
  const queryClient = useQueryClient();

  return useCallback(() => {
    queryClient.prefetchQuery({
      queryKey,
      queryFn,
      staleTime: options.staleTime ?? 60 * 1000,
    });
  }, [queryClient, queryKey, queryFn, options.staleTime]);
}
