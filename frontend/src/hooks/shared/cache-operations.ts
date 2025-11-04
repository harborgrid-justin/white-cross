/**
 * Cache Operations
 *
 * Core cache operations including invalidation, clearing, and prefetching
 * with audit logging support.
 *
 * @module hooks/shared/cache-operations
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuditLog } from './useAuditLog';
import { InvalidationScope, DataSensitivity } from './cache-types';
import { useCacheStrategies } from './cache-strategies';

/**
 * Hook for cache operations with audit logging
 */
export function useCacheOperations(
  enableAuditLogging: boolean,
  defaultSensitivity: DataSensitivity
) {
  const queryClient = useQueryClient();
  const { logAuditEvent } = useAuditLog();
  const { getCacheStrategy } = useCacheStrategies(defaultSensitivity);

  /**
   * Invalidate cache with auditing
   */
  const invalidateCache = useCallback(async (
    keys: string | string[],
    scope: InvalidationScope = 'exact',
    context?: string
  ) => {
    const keyArray = Array.isArray(keys) ? keys : [keys];

    try {
      for (const key of keyArray) {
        switch (scope) {
          case 'exact':
            await queryClient.invalidateQueries({ queryKey: [key] });
            break;
          case 'prefix':
            await queryClient.invalidateQueries({
              queryKey: [key],
              type: 'all'
            });
            break;
          case 'pattern':
            await queryClient.invalidateQueries({
              predicate: (query) =>
                query.queryKey.some(k =>
                  typeof k === 'string' && k.includes(key)
                )
            });
            break;
          case 'domain':
            await queryClient.invalidateQueries({ queryKey: [key] });
            break;
        }
      }

      // Audit cache invalidation for compliance
      if (enableAuditLogging) {
        await logAuditEvent({
          event: 'data_modification',
          context: `cache_invalidation_${scope}`,
          severity: 'low',
          details: {
            keys: keyArray,
            scope,
            context,
            timestamp: new Date().toISOString(),
          },
          timestamp: new Date(),
        });
      }
    } catch (error) {
      console.error('Cache invalidation failed:', error);
      throw error;
    }
  }, [queryClient, enableAuditLogging, logAuditEvent]);

  /**
   * Clear sensitive data from cache
   */
  const clearSensitiveCache = useCallback(async () => {
    // Remove PHI and critical data from cache
    await queryClient.invalidateQueries({
      predicate: (query) => {
        const key = query.queryKey[0] as string;
        return key?.includes('phi') ||
               key?.includes('critical') ||
               key?.includes('patient') ||
               key?.includes('medical');
      }
    });

    if (enableAuditLogging) {
      await logAuditEvent({
        event: 'data_modification',
        context: 'sensitive_cache_cleared',
        severity: 'medium',
        details: {
          action: 'clear_sensitive_cache',
          timestamp: new Date().toISOString(),
        },
        timestamp: new Date(),
      });
    }
  }, [queryClient, enableAuditLogging, logAuditEvent]);

  /**
   * Prefetch data with cache strategy
   */
  const prefetchWithStrategy = useCallback(async (
    queryKey: string[],
    queryFn: () => Promise<unknown>,
    sensitivity: DataSensitivity = defaultSensitivity
  ) => {
    const strategy = getCacheStrategy(sensitivity);

    try {
      await queryClient.prefetchQuery({
        queryKey,
        queryFn,
        staleTime: strategy.staleTime,
        gcTime: strategy.cacheTime, // TanStack Query v5 uses gcTime instead of cacheTime
      });
    } catch (error) {
      console.error('Prefetch failed:', error);
      // Don't throw - prefetch failures shouldn't break the app
    }
  }, [queryClient, getCacheStrategy, defaultSensitivity]);

  return {
    invalidateCache,
    clearSensitiveCache,
    prefetchWithStrategy,
  };
}
