/**
 * Enterprise Caching Infrastructure - Main Export
 *
 * Centralized exports for all caching services, utilities, and hooks.
 *
 * @module services/cache
 * @version 1.0.0
 */

// Core Cache Manager
import {
  CacheManager as CacheManagerClass,
  getCacheManager as getCacheManagerFunc,
  resetCacheManager as resetCacheManagerFunc
} from './CacheManager';
export {
  CacheManagerClass as CacheManager,
  getCacheManagerFunc as getCacheManager,
  resetCacheManagerFunc as resetCacheManager
};

// Query Key Factory
import {
  QueryKeyFactory as QueryKeyFactoryClass,
  queryKeys as queryKeysObj,
  studentKeys as studentKeysObj,
  healthRecordKeys as healthRecordKeysObj,
  medicationKeys as medicationKeysObj,
  appointmentKeys as appointmentKeysObj,
  incidentKeys as incidentKeysObj,
  emergencyContactKeys as emergencyContactKeysObj,
  referenceKeys as referenceKeysObj,
  userKeys as userKeysObj
} from './QueryKeyFactory';
export {
  QueryKeyFactoryClass as QueryKeyFactory,
  queryKeysObj as queryKeys,
  studentKeysObj as studentKeys,
  healthRecordKeysObj as healthRecordKeys,
  medicationKeysObj as medicationKeys,
  appointmentKeysObj as appointmentKeys,
  incidentKeysObj as incidentKeys,
  emergencyContactKeysObj as emergencyContactKeys,
  referenceKeysObj as referenceKeys,
  userKeysObj as userKeys
};

// Invalidation Strategy
import {
  InvalidationStrategy as InvalidationStrategyClass,
  getInvalidationStrategy as getInvalidationStrategyFunc,
  resetInvalidationStrategy as resetInvalidationStrategyFunc,
  createStudentUpdateOperation as createStudentUpdateOperationFunc
} from './InvalidationStrategy';
export {
  InvalidationStrategyClass as InvalidationStrategy,
  getInvalidationStrategyFunc as getInvalidationStrategy,
  resetInvalidationStrategyFunc as resetInvalidationStrategy,
  createStudentUpdateOperationFunc as createStudentUpdateOperation
};

// Optimistic Update Manager
import {
  OptimisticUpdateManager as OptimisticUpdateManagerClass,
  getOptimisticUpdateManager as getOptimisticUpdateManagerFunc,
  resetOptimisticUpdateManager as resetOptimisticUpdateManagerFunc
} from './OptimisticUpdateManager';
export {
  OptimisticUpdateManagerClass as OptimisticUpdateManager,
  getOptimisticUpdateManagerFunc as getOptimisticUpdateManager,
  resetOptimisticUpdateManagerFunc as resetOptimisticUpdateManager
};

// Persistence Layer
import {
  PersistenceManager as PersistenceManagerClass,
  getPersistenceManager as getPersistenceManagerFunc,
  resetPersistenceManager as resetPersistenceManagerFunc
} from './persistence';
export {
  PersistenceManagerClass as PersistenceManager,
  getPersistenceManagerFunc as getPersistenceManager,
  resetPersistenceManagerFunc as resetPersistenceManager
};

// Cache Configuration
import {
  TTL_CONFIG as TTL_CONFIG_OBJ,
  REFETCH_STRATEGIES as REFETCH_STRATEGIES_OBJ,
  PERSISTENCE_RULES as PERSISTENCE_RULES_OBJ,
  CACHE_CONFIG as CACHE_CONFIG_OBJ,
  CACHE_WARMING_CONFIG as CACHE_WARMING_CONFIG_OBJ,
  ENTITY_TTL_MAP as ENTITY_TTL_MAP_OBJ,
  INDEXED_DB_CONFIG as INDEXED_DB_CONFIG_OBJ,
  PERFORMANCE_CONFIG as PERFORMANCE_CONFIG_OBJ,
  getTTLForEntity as getTTLForEntityFunc,
  getRefetchStrategy as getRefetchStrategyFunc,
  canPersistEntity as canPersistEntityFunc,
  getPersistedTTL as getPersistedTTLFunc
} from './cacheConfig';
export {
  TTL_CONFIG_OBJ as TTL_CONFIG,
  REFETCH_STRATEGIES_OBJ as REFETCH_STRATEGIES,
  PERSISTENCE_RULES_OBJ as PERSISTENCE_RULES,
  CACHE_CONFIG_OBJ as CACHE_CONFIG,
  CACHE_WARMING_CONFIG_OBJ as CACHE_WARMING_CONFIG,
  ENTITY_TTL_MAP_OBJ as ENTITY_TTL_MAP,
  INDEXED_DB_CONFIG_OBJ as INDEXED_DB_CONFIG,
  PERFORMANCE_CONFIG_OBJ as PERFORMANCE_CONFIG,
  getTTLForEntityFunc as getTTLForEntity,
  getRefetchStrategyFunc as getRefetchStrategy,
  canPersistEntityFunc as canPersistEntity,
  getPersistedTTLFunc as getPersistedTTL
};

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
 * @param _queryClient - React Query client instance (unused, reserved for future use)
 */
export async function initializeCacheInfrastructure(
  _queryClient?: unknown
): Promise<void> {
  console.log('[CacheInfrastructure] Initializing...');

  try {
    // Initialize persistence manager (IndexedDB)
    const persistenceManager = getPersistenceManagerFunc();

    // Clean up stale persisted data
    const cleanedCount = await persistenceManager.cleanupStaleData();
    console.log(
      `[CacheInfrastructure] Cleaned up ${cleanedCount} stale persisted entries`
    );

    // Get persistence stats
    const stats = await persistenceManager.getStats();
    console.log('[CacheInfrastructure] Persistence stats:', stats);

    // Initialize cache manager
    const cacheManager = getCacheManagerFunc();
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
    const cacheManager = getCacheManagerFunc();
    cacheManager.clear();
    console.log('[CacheInfrastructure] In-memory cache cleared');

    // Clear persisted cache (IndexedDB)
    const persistenceManager = getPersistenceManagerFunc();
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
  inMemory: ReturnType<CacheManagerClass['getStats']>;
  persisted: Awaited<ReturnType<PersistenceManagerClass['getStats']>>;
  optimisticUpdates: {
    pendingCount: number;
    queuedMutationsCount: number;
  };
}> {
  const cacheManager = getCacheManagerFunc();
  const persistenceManager = getPersistenceManagerFunc();

  // Note: We need a queryClient instance for optimistic update manager
  // This is a placeholder - in real usage, pass the actual queryClient
  const optimisticUpdateManager = getOptimisticUpdateManagerFunc(
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
  getCacheManager: getCacheManagerFunc,
  getInvalidationStrategy: getInvalidationStrategyFunc,
  getOptimisticUpdateManager: getOptimisticUpdateManagerFunc,
  getPersistenceManager: getPersistenceManagerFunc,

  // Utilities
  initializeCacheInfrastructure,
  clearAllCaches,
  getCacheInfrastructureStats,

  // Query Keys
  queryKeys: queryKeysObj,

  // Configuration
  config: CACHE_CONFIG_OBJ,
  ttl: TTL_CONFIG_OBJ,
  refetchStrategies: REFETCH_STRATEGIES_OBJ
};
