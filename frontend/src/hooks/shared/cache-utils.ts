/**
 * Cache Utilities
 *
 * Utility functions for cache statistics, monitoring, and optimization.
 *
 * @module hooks/shared/cache-utils
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuditLog } from './useAuditLog';
import { CacheStats } from './cache-types';

/**
 * Hook for cache utilities and optimization
 */
export function useCacheUtils(
  enableAuditLogging: boolean,
  performanceMode: 'balanced' | 'aggressive' | 'conservative'
) {
  const queryClient = useQueryClient();
  const { logAuditEvent } = useAuditLog();

  /**
   * Get cache statistics for monitoring
   */
  const getCacheStats = useCallback((): CacheStats => {
    const cache = queryClient.getQueryCache();
    const queries = cache.getAll();

    const stats: CacheStats = {
      totalQueries: queries.length,
      staleCodes: queries.filter(q => q.isStale()).length,
      errorQueries: queries.filter(q => q.state.error).length,
      loadingQueries: queries.filter(q => q.state.fetchStatus === 'fetching').length,
      cacheSize: JSON.stringify(queries).length,
    };

    return stats;
  }, [queryClient]);

  /**
   * Optimize cache performance
   */
  const optimizeCache = useCallback(async () => {
    const stats = getCacheStats();

    // Remove old queries based on performance mode
    const maxQueries = performanceMode === 'aggressive' ? 50 :
                      performanceMode === 'conservative' ? 200 : 100;

    if (stats.totalQueries > maxQueries) {
      // Remove oldest queries
      queryClient.getQueryCache().clear();

      if (enableAuditLogging) {
        await logAuditEvent({
          event: 'system_error', // Using system_error for maintenance events
          context: 'cache_optimization',
          severity: 'low',
          details: {
            action: 'cache_cleared',
            reason: 'performance_optimization',
            previousStats: stats,
          },
          timestamp: new Date(),
        });
      }
    }
  }, [getCacheStats, performanceMode, queryClient, enableAuditLogging, logAuditEvent]);

  return {
    getCacheStats,
    optimizeCache,
  };
}
