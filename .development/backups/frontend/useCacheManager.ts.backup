/**
 * Enterprise Cache Manager Hook
 * 
 * Centralized cache management hook with healthcare-appropriate caching strategies,
 * intelligent invalidation, and performance optimization for enterprise applications.
 * 
 * @module hooks/shared/useCacheManager
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

import { useCallback, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuditLog } from './useAuditLog';

/**
 * Cache time constants for healthcare applications
 */
export const CACHE_TIMES = {
  // Critical healthcare data - minimal or no caching
  CRITICAL: {
    staleTime: 0,
    cacheTime: 1 * 60 * 1000, // 1 minute
  },
  // Real-time data
  REALTIME: {
    staleTime: 30 * 1000, // 30 seconds
    cacheTime: 2 * 60 * 1000, // 2 minutes
  },
  // Frequently changing data
  DYNAMIC: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 15 * 60 * 1000, // 15 minutes
  },
  // Moderately stable data
  MODERATE: {
    staleTime: 15 * 60 * 1000, // 15 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
  },
  // Stable reference data
  STABLE: {
    staleTime: 60 * 60 * 1000, // 1 hour
    cacheTime: 4 * 60 * 60 * 1000, // 4 hours
  },
} as const;

/**
 * Data sensitivity levels for healthcare compliance
 */
export type DataSensitivity = 
  | 'public'        // Non-sensitive public data
  | 'internal'      // Internal business data
  | 'confidential'  // Confidential business data
  | 'phi'           // Protected Health Information
  | 'critical';     // Safety-critical healthcare data

/**
 * Cache strategy configuration
 */
export interface CacheStrategy {
  sensitivity: DataSensitivity;
  staleTime: number;
  cacheTime: number;
  enableOptimistic: boolean;
  requiresInvalidation: boolean;
}

/**
 * Cache invalidation scope
 */
export type InvalidationScope = 
  | 'exact'      // Invalidate exact key match
  | 'prefix'     // Invalidate keys with prefix
  | 'pattern'    // Invalidate keys matching pattern
  | 'domain';    // Invalidate entire domain

/**
 * Cache manager options
 */
export interface CacheManagerOptions {
  enableAuditLogging?: boolean;
  defaultSensitivity?: DataSensitivity;
  performanceMode?: 'balanced' | 'aggressive' | 'conservative';
}

/**
 * Enterprise Cache Manager Hook
 */
export function useCacheManager(options: CacheManagerOptions = {}) {
  const {
    enableAuditLogging = true,
    defaultSensitivity = 'internal',
    performanceMode = 'balanced'
  } = options;

  const queryClient = useQueryClient();
  const { logAuditEvent } = useAuditLog();

  /**
   * Get cache strategy based on data sensitivity
   */
  const getCacheStrategy = useCallback((sensitivity: DataSensitivity = defaultSensitivity): CacheStrategy => {
    const strategies: Record<DataSensitivity, CacheStrategy> = {
      public: {
        sensitivity: 'public',
        ...CACHE_TIMES.STABLE,
        enableOptimistic: true,
        requiresInvalidation: false,
      },
      internal: {
        sensitivity: 'internal',
        ...CACHE_TIMES.MODERATE,
        enableOptimistic: true,
        requiresInvalidation: true,
      },
      confidential: {
        sensitivity: 'confidential',
        ...CACHE_TIMES.DYNAMIC,
        enableOptimistic: false,
        requiresInvalidation: true,
      },
      phi: {
        sensitivity: 'phi',
        ...CACHE_TIMES.REALTIME,
        enableOptimistic: false,
        requiresInvalidation: true,
      },
      critical: {
        sensitivity: 'critical',
        ...CACHE_TIMES.CRITICAL,
        enableOptimistic: false,
        requiresInvalidation: true,
      },
    };

    return strategies[sensitivity];
  }, [defaultSensitivity]);

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

  /**
   * Get cache statistics for monitoring
   */
  const getCacheStats = useCallback(() => {
    const cache = queryClient.getQueryCache();
    const queries = cache.getAll();
    
    const stats = {
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

  /**
   * Memoized cache configuration
   */
  const cacheConfig = useMemo(() => ({
    strategies: {
      public: getCacheStrategy('public'),
      internal: getCacheStrategy('internal'),
      confidential: getCacheStrategy('confidential'),
      phi: getCacheStrategy('phi'),
      critical: getCacheStrategy('critical'),
    },
    performance: {
      mode: performanceMode,
      auditingEnabled: enableAuditLogging,
    },
  }), [getCacheStrategy, performanceMode, enableAuditLogging]);

  return {
    getCacheStrategy,
    invalidateCache,
    clearSensitiveCache,
    prefetchWithStrategy,
    getCacheStats,
    optimizeCache,
    cacheConfig,
    CACHE_TIMES,
  };
}