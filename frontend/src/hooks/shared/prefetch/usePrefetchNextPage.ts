/**
 * Prefetch Next Page Hook
 *
 * Prefetch the next page of paginated data when network is idle
 */

import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNetworkIdle } from './useNetworkIdle';

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
