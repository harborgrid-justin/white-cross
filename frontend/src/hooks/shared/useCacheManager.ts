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

import { useMemo } from 'react';
import { useCacheStrategies } from './cache-strategies';
import { useCacheOperations } from './cache-operations';
import { useCacheUtils } from './cache-utils';
import { CACHE_TIMES } from './cache-types';

// Re-export types and constants
export {
  CACHE_TIMES,
  type DataSensitivity,
  type CacheStrategy,
  type InvalidationScope,
  type CacheManagerOptions,
  type CacheStats,
} from './cache-types';

// Re-export strategy hook
export { useCacheStrategies } from './cache-strategies';

// Re-export operations hook
export { useCacheOperations } from './cache-operations';

// Re-export utils hook
export { useCacheUtils } from './cache-utils';

/**
 * Enterprise Cache Manager Hook
 */
export function useCacheManager(options: import('./cache-types').CacheManagerOptions = {}) {
  const {
    enableAuditLogging = true,
    defaultSensitivity = 'internal',
    performanceMode = 'balanced'
  } = options;

  // Get strategy functions
  const { getCacheStrategy, cacheConfig: strategiesConfig } = useCacheStrategies(defaultSensitivity);

  // Get cache operations
  const {
    invalidateCache,
    clearSensitiveCache,
    prefetchWithStrategy,
  } = useCacheOperations(enableAuditLogging, defaultSensitivity);

  // Get cache utils
  const {
    getCacheStats,
    optimizeCache,
  } = useCacheUtils(enableAuditLogging, performanceMode);

  /**
   * Memoized cache configuration
   */
  const cacheConfig = useMemo(() => ({
    ...strategiesConfig,
    performance: {
      mode: performanceMode,
      auditingEnabled: enableAuditLogging,
    },
  }), [strategiesConfig, performanceMode, enableAuditLogging]);

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
