/**
 * Cache Strategy Configuration
 *
 * Defines cache strategies based on data sensitivity levels
 * for healthcare-appropriate caching.
 *
 * @module hooks/shared/cache-strategies
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

import { useCallback, useMemo } from 'react';
import { CACHE_TIMES, DataSensitivity, CacheStrategy } from './cache-types';

/**
 * Hook for getting cache strategies based on data sensitivity
 */
export function useCacheStrategies(defaultSensitivity: DataSensitivity = 'internal') {
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
  }), [getCacheStrategy]);

  return {
    getCacheStrategy,
    cacheConfig,
  };
}
