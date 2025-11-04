/**
 * Student Prefetch and Cache Warming Utilities
 *
 * Prefetching strategies and automatic cache warming for student data.
 *
 * @module hooks/utilities/studentPrefetchUtils
 * @author White Cross Healthcare Platform
 * @version 2.0.0
 */

import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useRef } from 'react';
import { studentQueryKeys } from './queryKeys';
import { cacheConfig } from './cacheConfig';
import { apiActions } from '@/lib/api';
import type { PrefetchOptions, CacheWarmingStrategy } from './studentUtilityTypes';

/**
 * Hook for data prefetching and cache warming
 *
 * @returns Prefetch and cache warming utilities
 *
 * @example
 * ```tsx
 * const { prefetchData } = usePrefetchManager();
 *
 * // Prefetch students by grade
 * await prefetchData({ grades: ['5'], limit: 50 });
 * ```
 */
export const usePrefetchManager = () => {
  const queryClient = useQueryClient();

  /**
   * Prefetch data based on strategy
   */
  const prefetchData = useCallback(
    async (options: PrefetchOptions = {}) => {
      const {
        grades,
        limit = 50,
        includeRelationships = false,
        priority = 'medium',
        filters = {},
      } = options;

      const prefetchPromises: Promise<void>[] = [];

      // Prefetch by grades if specified
      if (grades?.length) {
        for (const grade of grades) {
          prefetchPromises.push(
            queryClient.prefetchQuery({
              queryKey: studentQueryKeys.lists.byGrade(grade),
              queryFn: () => apiActions.students.getAll({ grade, limit }),
              staleTime: cacheConfig.lists.staleTime,
            })
          );
        }
      }

      // Prefetch general list
      prefetchPromises.push(
        queryClient.prefetchQuery({
          queryKey: studentQueryKeys.lists.active(),
          queryFn: () => apiActions.students.getAll({ isActive: true, limit }),
          staleTime: cacheConfig.lists.staleTime,
        })
      );

      // Prefetch statistics
      prefetchPromises.push(
        queryClient.prefetchQuery({
          queryKey: studentQueryKeys.statistics.overview(),
          queryFn: () => apiActions.students.getAll({}),
          staleTime: cacheConfig.statistics.staleTime,
        })
      );

      await Promise.allSettled(prefetchPromises);
    },
    [queryClient]
  );

  /**
   * Warm cache with common data patterns
   */
  const warmCache = useCallback(
    async (strategy: CacheWarmingStrategy) => {
      if (!strategy.enabled) return;

      const { patterns, delay = 0 } = strategy;

      // Wait for delay if specified
      if (delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      const warmingPromises: Promise<void>[] = [];

      for (const pattern of patterns) {
        switch (pattern) {
          case 'lists':
            warmingPromises.push(prefetchData({ limit: 50, priority: 'low' }));
            break;

          case 'statistics':
            warmingPromises.push(
              queryClient.prefetchQuery({
                queryKey: studentQueryKeys.statistics.overview(),
                queryFn: () => apiActions.students.getAll({}),
                staleTime: cacheConfig.statistics.staleTime,
              })
            );
            break;

          case 'current-grade':
            // Prefetch current academic year grades
            const currentGrades = [
              'K',
              '1',
              '2',
              '3',
              '4',
              '5',
              '6',
              '7',
              '8',
              '9',
              '10',
              '11',
              '12',
            ];
            warmingPromises.push(
              prefetchData({ grades: currentGrades.slice(0, 5), limit: 30 })
            );
            break;
        }
      }

      await Promise.allSettled(warmingPromises);
    },
    [queryClient, prefetchData]
  );

  return {
    prefetchData,
    warmCache,
  };
};

/**
 * Hook for automatic cache warming and maintenance
 *
 * @param strategy - Cache warming strategy
 * @returns Cache warming utilities
 *
 * @example
 * ```tsx
 * const { isWarming, stopWarming } = useCacheWarming({
 *   enabled: true,
 *   patterns: ['lists', 'statistics'],
 *   delay: 1000,
 *   refreshInterval: 300000 // 5 minutes
 * });
 * ```
 */
export const useCacheWarming = (strategy: CacheWarmingStrategy) => {
  const { warmCache } = usePrefetchManager();
  const warmingRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Start automatic cache warming
   */
  const startWarming = useCallback(() => {
    if (!strategy.enabled || warmingRef.current) return;

    const runWarming = () => {
      warmCache(strategy).catch((error) => {
        console.error('Cache warming failed:', error);
      });
    };

    // Initial warming
    setTimeout(runWarming, strategy.delay || 0);

    // Set up interval if specified
    if (strategy.refreshInterval) {
      warmingRef.current = setInterval(runWarming, strategy.refreshInterval);
    }
  }, [strategy, warmCache]);

  /**
   * Stop automatic cache warming
   */
  const stopWarming = useCallback(() => {
    if (warmingRef.current) {
      clearInterval(warmingRef.current);
      warmingRef.current = null;
    }
  }, []);

  // Auto-start on mount, auto-stop on unmount
  useEffect(() => {
    startWarming();
    return stopWarming;
  }, [startWarming, stopWarming]);

  return {
    startWarming,
    stopWarming,
    isWarming: warmingRef.current !== null,
  };
};
