/**
 * Enterprise Caching Infrastructure - Main Export
 *
 * Centralized exports for all caching services, utilities, and hooks.
 *
 * @module services/cache
 * @version 1.0.0
 */

// Core Cache Manager
export {
  CacheManager,
  getCacheManager,
  resetCacheManager
} from './CacheManager';

// Query Key Factory
export {
  QueryKeyFactory,
  queryKeys,
  studentKeys,
  healthRecordKeys,
  medicationKeys,
  appointmentKeys,
  incidentKeys,
  emergencyContactKeys,
  referenceKeys,
  userKeys
} from './QueryKeyFactory';

// Invalidation Strategy
export {
  InvalidationStrategy,
  getInvalidationStrategy,
  resetInvalidationStrategy,
  createStudentUpdateOperation
} from './InvalidationStrategy';

// Optimistic Update Manager
export {
  OptimisticUpdateManager,
  getOptimisticUpdateManager,
  resetOptimisticUpdateManager
} from './OptimisticUpdateManager';

// Persistence Layer
export {
  PersistenceManager,
  getPersistenceManager,
  resetPersistenceManager
} from './persistence';

// Cache Configuration
export {
  TTL_CONFIG,
  REFETCH_STRATEGIES,
  PERSISTENCE_RULES,
  CACHE_CONFIG,
  CACHE_WARMING_CONFIG,
  ENTITY_TTL_MAP,
  INDEXED_DB_CONFIG,
  PERFORMANCE_CONFIG,
  getTTLForEntity,
  getRefetchStrategy,
  canPersistEntity,
  getPersistedTTL
} from './cache-config';

// Type Exports
export type {
  CacheEntry,
  CacheConfig,
  CacheStats,
  InvalidationOptions,
  QueryKey,
  NormalizedQueryKey,
  CacheTag,
  CacheTagType,
  TTLConfig,
  RefetchStrategy,
  PersistenceRule,
  OptimisticUpdateContext,
  ConflictStrategy,
  ConflictDetection,
  MergeResult,
  QueuedMutation,
  PrefetchOptions,
  PrefetchStrategy,
  NavigationPattern,
  CacheWarmingConfig,
  InvalidationOperation,
  InvalidationRule,
  InvalidationTarget,
  PerformanceMetrics,
  IndexedDBSchema,
  PersistedCacheEntry,
  CacheEvent,
  CacheEventType,
  CacheEventListener
} from './types';

/**
 * Initialize Cache Infrastructure
 *
 * Call this function once during app initialization to set up
 * all caching infrastructure.
 *
 * @param queryClient - React Query client instance
 */
export async function initializeCacheInfrastructure(
  queryClient: unknown
): Promise<void> {
  console.log('[CacheInfrastructure] Initializing...');

  try {
    // Initialize persistence manager (IndexedDB)
    const persistenceManager = getPersistenceManager();

    // Clean up stale persisted data
    const cleanedCount = await persistenceManager.cleanupStaleData();
    console.log(
      `[CacheInfrastructure] Cleaned up ${cleanedCount} stale persisted entries`
    );

    // Get persistence stats
    const stats = await persistenceManager.getStats();
    console.log('[CacheInfrastructure] Persistence stats:', stats);

    // Initialize cache manager
    const cacheManager = getCacheManager();
    console.log('[CacheInfrastructure] Cache manager initialized');

    // Get cache stats
    const cacheStats = cacheManager.getStats();
    console.log('[CacheInfrastructure] Cache stats:', cacheStats);

    console.log('[CacheInfrastructure] Initialization complete');
  } catch (error) {
    console.error('[CacheInfrastructure] Initialization failed:', error);
    // Non-blocking - app can still function without advanced caching
  }
}

/**
 * Clear All Caches
 *
 * Utility function to clear both in-memory and persisted caches.
 * Useful for logout, data refresh, or testing.
 */
export async function clearAllCaches(): Promise<void> {
  console.log('[CacheInfrastructure] Clearing all caches...');

  try {
    // Clear in-memory cache
    const cacheManager = getCacheManager();
    cacheManager.clear();
    console.log('[CacheInfrastructure] In-memory cache cleared');

    // Clear persisted cache (IndexedDB)
    const persistenceManager = getPersistenceManager();
    await persistenceManager.clearAll();
    console.log('[CacheInfrastructure] Persisted cache cleared');

    console.log('[CacheInfrastructure] All caches cleared successfully');
  } catch (error) {
    console.error('[CacheInfrastructure] Failed to clear caches:', error);
    throw error;
  }
}

/**
 * Get Cache Infrastructure Stats
 *
 * Returns comprehensive statistics about caching infrastructure
 */
export async function getCacheInfrastructureStats(): Promise<{
  inMemory: ReturnType<CacheManager['getStats']>;
  persisted: Awaited<ReturnType<PersistenceManager['getStats']>>;
  optimisticUpdates: {
    pendingCount: number;
    queuedMutationsCount: number;
  };
}> {
  const cacheManager = getCacheManager();
  const persistenceManager = getPersistenceManager();

  // Note: We need a queryClient instance for optimistic update manager
  // This is a placeholder - in real usage, pass the actual queryClient
  const optimisticUpdateManager = getOptimisticUpdateManager(
    {} as any // Placeholder
  );

  const stats = {
    inMemory: cacheManager.getStats(),
    persisted: await persistenceManager.getStats(),
    optimisticUpdates: {
      pendingCount: optimisticUpdateManager.getPendingUpdatesCount(),
      queuedMutationsCount: optimisticUpdateManager.getQueuedMutationsCount()
    }
  };

  return stats;
}

/**
 * Export default cache infrastructure object
 */
export default {
  // Managers
  getCacheManager,
  getInvalidationStrategy,
  getOptimisticUpdateManager,
  getPersistenceManager,

  // Utilities
  initializeCacheInfrastructure,
  clearAllCaches,
  getCacheInfrastructureStats,

  // Query Keys
  queryKeys,

  // Configuration
  config: CACHE_CONFIG,
  ttl: TTL_CONFIG,
  refetchStrategies: REFETCH_STRATEGIES
};
