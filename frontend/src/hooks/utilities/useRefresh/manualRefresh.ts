'use client';

/**
 * @fileoverview Manual refresh functionality
 * @module hooks/utilities/useRefresh/manualRefresh
 */

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

/**
 * Lightweight version for simple manual refresh only
 *
 * @example
 * ```tsx
 * const refresh = useSimpleRefresh();
 * <button onClick={refresh}>Refresh</button>
 * ```
 */
export function useSimpleRefresh(): () => void {
  const router = useRouter();
  return useCallback(() => {
    router.refresh();
  }, [router]);
}

/**
 * Create manual refresh function with state tracking
 */
export function useManualRefresh(
  router: ReturnType<typeof useRouter>,
  isRefreshing: boolean,
  onRefreshSuccess?: () => void,
  onRefreshError?: (error: Error) => void,
  debug?: boolean
) {
  return useCallback(
    async (
      setIsRefreshing: (value: boolean) => void,
      setLastRefreshed: (value: Date) => void,
      setRefreshCount: (fn: (prev: number) => number) => void
    ) => {
      if (isRefreshing) {
        if (debug) {
          console.log('[useRefresh] Refresh already in progress, skipping');
        }
        return;
      }

      try {
        setIsRefreshing(true);
        if (debug) {
          console.log('[useRefresh] Starting refresh...');
        }

        // Trigger Next.js router refresh
        router.refresh();

        // Small delay to ensure refresh completes
        await new Promise((resolve) => setTimeout(resolve, 100));

        setLastRefreshed(new Date());
        setRefreshCount((prev) => prev + 1);

        if (debug) {
          console.log('[useRefresh] Refresh completed successfully');
        }

        onRefreshSuccess?.();
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Refresh failed');
        if (debug) {
          console.error('[useRefresh] Refresh failed:', err);
        }
        onRefreshError?.(err);
      } finally {
        setIsRefreshing(false);
      }
    },
    [router, isRefreshing, onRefreshSuccess, onRefreshError, debug]
  );
}
