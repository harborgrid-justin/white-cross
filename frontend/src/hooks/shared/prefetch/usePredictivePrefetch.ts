/**
 * Predictive Prefetch Hook
 *
 * Prefetches data based on navigation patterns
 */

import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState, useCallback } from 'react';
import { getPersistenceManager } from '@/services/cache/persistence';
import { useNetworkIdle } from './useNetworkIdle';

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
