/**
 * Prefetch List Item Hook
 *
 * Specialized hook for prefetching detail views when hovering over list items
 */

import { usePrefetch, type UsePrefetchOptions } from './usePrefetchCore';

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
