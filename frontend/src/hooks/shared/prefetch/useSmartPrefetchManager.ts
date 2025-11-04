/**
 * Smart Prefetch Manager Hook
 *
 * Centralized prefetching with priority queue
 */

import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useNetworkIdle } from './useNetworkIdle';

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
