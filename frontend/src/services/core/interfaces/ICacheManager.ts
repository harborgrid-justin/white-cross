/**
 * @fileoverview Cache Manager Interface for Dependency Injection
 * @module services/core/interfaces/ICacheManager
 * @category Interfaces
 *
 * Interface abstraction for cache management to enable dependency injection
 * and improve testability of components that depend on caching.
 *
 * Benefits:
 * - Enables easy mocking for tests
 * - Provides clear contract for cache operations
 * - Supports multiple cache implementations
 * - Type-safe cache operations
 *
 * @example
 * ```typescript
 * // In tests
 * class MockCacheManager implements ICacheManager {
 *   get<T>(key: string): T | undefined { return undefined; }
 *   set<T>(key: string, data: T): void { }
 *   // ... other methods
 * }
 *
 * // In production
 * const cacheManager: ICacheManager = getCacheManager();
 * const apiClient = new ApiClient(tokenManager, cacheManager);
 * ```
 */

import type {
  CacheStats,
  InvalidationOptions
} from '../../cache/types';

/**
 * Cache Manager Interface
 *
 * Defines the contract for cache storage and retrieval implementations.
 * All cache managers must implement these methods to be compatible with
 * the dependency injection system.
 *
 * @interface
 */
export interface ICacheManager {
  /**
   * Retrieves a value from the cache
   *
   * @template T - Type of the cached value
   * @param key - Unique cache key identifier
   * @returns Cached value if found and not expired, undefined otherwise
   */
  get<T>(key: string): T | undefined;

  /**
   * Stores a value in the cache with optional TTL and tags
   *
   * @template T - Type of the value to cache
   * @param key - Unique cache key identifier
   * @param data - Data to store in cache
   * @param options - Cache storage options (ttl, tags, version, containsPHI)
   */
  set<T>(
    key: string,
    data: T,
    options?: {
      ttl?: number;
      tags?: string[];
      version?: number;
      containsPHI?: boolean;
    }
  ): void;

  /**
   * Check if key exists in cache and is not expired
   *
   * @param key - Cache key
   * @returns Whether key exists and is not expired
   */
  has(key: string): boolean;

  /**
   * Delete entry from cache
   *
   * @param key - Cache key
   * @returns Whether entry was deleted
   */
  delete(key: string): boolean;

  /**
   * Invalidate cache entries by keys, tags, or pattern
   *
   * @param options - Invalidation options
   * @returns Number of entries invalidated
   */
  invalidate(options: InvalidationOptions): number;

  /**
   * Clear all cache entries
   */
  clear(): void;

  /**
   * Clear expired entries
   *
   * @returns Number of entries cleared
   */
  clearExpired(): number;

  /**
   * Get all keys with specific tag
   *
   * @param tag - Cache tag
   * @returns Array of keys with this tag
   */
  getKeysWithTag(tag: string): string[];

  /**
   * Get all keys matching pattern
   *
   * @param pattern - Regex pattern
   * @returns Array of matching keys
   */
  getKeysMatching(pattern: RegExp): string[];

  /**
   * Get cache statistics
   *
   * @returns Current cache statistics
   */
  getStats(): CacheStats;

  /**
   * Reset statistics
   */
  resetStats(): void;

  /**
   * Cleanup resources (timers, listeners, etc.)
   * Call before destroying the instance
   */
  cleanup(): Promise<void>;
}

/**
 * Type guard to check if an object implements ICacheManager
 *
 * @param obj - Object to check
 * @returns true if object implements ICacheManager interface
 */
export function isCacheManager(obj: unknown): obj is ICacheManager {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  const manager = obj as ICacheManager;

  return (
    typeof manager.get === 'function' &&
    typeof manager.set === 'function' &&
    typeof manager.has === 'function' &&
    typeof manager.delete === 'function' &&
    typeof manager.invalidate === 'function' &&
    typeof manager.clear === 'function' &&
    typeof manager.clearExpired === 'function' &&
    typeof manager.getKeysWithTag === 'function' &&
    typeof manager.getKeysMatching === 'function' &&
    typeof manager.getStats === 'function' &&
    typeof manager.resetStats === 'function' &&
    typeof manager.cleanup === 'function'
  );
}
