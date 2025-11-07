/**
 * @fileoverview Cache Service Interface
 * @module shared/interfaces/cache.interface
 * @description Interface for caching services
 */

/**
 * Cache Options
 */
export interface CacheOptions {
  /**
   * Time to live in seconds
   */
  ttl?: number;

  /**
   * Namespace for the key
   */
  namespace?: string;
}

/**
 * Cache Service Interface
 *
 * Defines the contract for caching services.
 * Implementations can be in-memory, Redis, Memcached, etc.
 */
export interface ICacheService {
  /**
   * Get value from cache
   */
  get<T>(key: string): Promise<T | null>;

  /**
   * Set value in cache
   */
  set<T>(key: string, value: T, options?: CacheOptions): Promise<void>;

  /**
   * Delete value from cache
   */
  del(key: string): Promise<void>;

  /**
   * Delete multiple keys matching pattern
   */
  delPattern?(pattern: string): Promise<void>;

  /**
   * Check if key exists in cache
   */
  has?(key: string): Promise<boolean>;

  /**
   * Clear all cache entries
   */
  clear?(): Promise<void>;

  /**
   * Get cache statistics
   */
  stats?(): Promise<{
    hits: number;
    misses: number;
    keys: number;
  }>;
}
