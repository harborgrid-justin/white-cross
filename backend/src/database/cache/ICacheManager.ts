/**
 * LOC: BC0CC377F7
 * WC-GEN-014 | ICacheManager.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - None (leaf node)
 *
 * DOWNSTREAM (imported by):
 *   - BaseRepository.ts (database/repositories/base/BaseRepository.ts)
 *   - AllergyRepository.ts (database/repositories/impl/AllergyRepository.ts)
 *   - AppointmentRepository.ts (database/repositories/impl/AppointmentRepository.ts)
 *   - AuditLogRepository.ts (database/repositories/impl/AuditLogRepository.ts)
 *   - ChronicConditionRepository.ts (database/repositories/impl/ChronicConditionRepository.ts)
 *   - ... and 8 more
 */

/**
 * WC-GEN-014 | ICacheManager.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: Independent module | Dependencies: None
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes, interfaces, constants, functions | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

/**
 * Cache Manager Interface
 *
 * Provides abstraction layer for caching operations with healthcare-specific features:
 * - PHI data encryption at rest
 * - Configurable TTL per entity type
 * - Audit logging for PHI cache access
 * - Pattern-based cache invalidation
 * - Statistics tracking for performance monitoring
 *
 * Supports Redis, in-memory, or custom cache implementations through this interface.
 *
 * @interface ICacheManager
 *
 * @example
 * ```typescript
 * // Implementing a Redis cache manager
 * class RedisCacheManager implements ICacheManager {
 *   async get<T>(key: string): Promise<T | null> {
 *     const value = await redis.get(key);
 *     return value ? JSON.parse(value) : null;
 *   }
 *   // ... other methods
 * }
 * ```
 *
 * @see {@link CacheConfig} for cache configuration options
 * @see {@link CacheTTL} for standard TTL values
 */

export interface ICacheManager {
  /**
   * Retrieves a cached value by key.
   *
   * Returns the cached value if found and not expired, otherwise returns null.
   * For PHI entities, may require audit logging of the cache read operation.
   *
   * @template T - Type of the cached value
   * @param {string} key - Cache key to retrieve
   *
   * @returns {Promise<T | null>} Cached value or null if not found/expired
   *
   * @example
   * ```typescript
   * const student = await cacheManager.get<Student>('white-cross:student:123');
   * if (student) {
   *   console.log('Cache hit:', student);
   * } else {
   *   console.log('Cache miss');
   * }
   * ```
   */
  get<T>(key: string): Promise<T | null>;

  /**
   * Stores a value in the cache with specified TTL.
   *
   * Sets or updates a cache entry. For PHI entities, data should be encrypted
   * before caching if encryption is enabled in configuration.
   *
   * @template T - Type of the value to cache
   * @param {string} key - Cache key to set
   * @param {T} value - Value to cache (will be serialized)
   * @param {number} ttl - Time to live in seconds (cache entry lifetime)
   *
   * @returns {Promise<void>} Resolves when value is cached
   *
   * @example
   * ```typescript
   * // Cache student data for 15 minutes
   * await cacheManager.set(
   *   'white-cross:student:123',
   *   studentData,
   *   CacheTTL.MEDIUM  // 900 seconds = 15 minutes
   * );
   * ```
   *
   * @see {@link CacheTTL} for standard TTL constants
   */
  set<T>(key: string, value: T, ttl: number): Promise<void>;

  /**
   * Deletes a cached value by key.
   *
   * Removes the cache entry immediately. Used for cache invalidation
   * when entity data is updated or deleted.
   *
   * @param {string} key - Cache key to delete
   *
   * @returns {Promise<void>} Resolves when cache entry is deleted
   *
   * @example
   * ```typescript
   * // Invalidate student cache after update
   * await Student.update({ name: 'New Name' }, { where: { id: '123' } });
   * await cacheManager.delete('white-cross:student:123');
   * ```
   */
  delete(key: string): Promise<void>;

  /**
   * Deletes all cache entries matching a pattern.
   *
   * Performs bulk cache invalidation using pattern matching (e.g., wildcard patterns).
   * Useful for invalidating all related cache entries after a bulk operation.
   *
   * @param {string} pattern - Pattern to match (supports wildcards like 'user:*')
   *
   * @returns {Promise<void>} Resolves when all matching entries are deleted
   *
   * @example
   * ```typescript
   * // Invalidate all student caches for a specific school
   * await cacheManager.deletePattern('white-cross:student:school-123:*');
   *
   * // Invalidate all health record list caches
   * await cacheManager.deletePattern('white-cross:healthrecord:list:*');
   * ```
   *
   * @remarks
   * Pattern matching syntax depends on cache implementation (Redis: SCAN, in-memory: regex).
   * Use sparingly as pattern matching can be expensive on large datasets.
   */
  deletePattern(pattern: string): Promise<void>;

  /**
   * Checks if a key exists in the cache.
   *
   * Returns true if key exists and has not expired, false otherwise.
   * Does not count as a cache read for audit purposes.
   *
   * @param {string} key - Cache key to check
   *
   * @returns {Promise<boolean>} True if key exists, false otherwise
   *
   * @example
   * ```typescript
   * if (await cacheManager.exists('white-cross:student:123')) {
   *   console.log('Student is cached');
   * } else {
   *   console.log('Need to fetch from database');
   * }
   * ```
   */
  exists(key: string): Promise<boolean>;

  /**
   * Set multiple values at once
   * @param entries Array of key-value-ttl tuples
   */
  mset(entries: Array<[string, any, number]>): Promise<void>;

  /**
   * Get multiple values at once
   * @param keys Array of cache keys
   */
  mget<T>(keys: string[]): Promise<Array<T | null>>;

  /**
   * Clear all cache entries (use with caution)
   */
  clear(): Promise<void>;

  /**
   * Get cache statistics
   */
  getStats(): Promise<CacheStats>;
}

/**
 * Cache statistics
 */
export interface CacheStats {
  /**
   * Number of cache hits
   */
  hits: number;

  /**
   * Number of cache misses
   */
  misses: number;

  /**
   * Total number of keys in cache
   */
  keyCount: number;

  /**
   * Memory usage in bytes
   */
  memoryUsage: number;

  /**
   * Hit rate percentage
   */
  hitRate: number;
}

/**
 * Cache configuration
 */
export interface CacheConfig {
  /**
   * Enable/disable caching
   */
  enabled: boolean;

  /**
   * Default TTL in seconds
   */
  defaultTTL: number;

  /**
   * Encrypt PHI data before caching
   */
  encryptPHI: boolean;

  /**
   * Enable audit logging for cache access
   */
  auditCacheAccess: boolean;

  /**
   * Entity types allowed to be cached
   */
  allowedEntityTypes: string[];

  /**
   * Maximum cache size in MB
   */
  maxCacheSize: number;

  /**
   * Cache eviction policy
   */
  evictionPolicy: EvictionPolicy;
}

/**
 * Cache eviction policies
 */
export enum EvictionPolicy {
  /**
   * Least Recently Used
   */
  LRU = 'LRU',

  /**
   * Least Frequently Used
   */
  LFU = 'LFU',

  /**
   * First In First Out
   */
  FIFO = 'FIFO',

  /**
   * Time To Live
   */
  TTL = 'TTL'
}

/**
 * Cache key builder interface
 */
export interface ICacheKeyBuilder {
  /**
   * Build cache key for single entity
   */
  entity(entityType: string, id: string): string;

  /**
   * Build cache key for entity list
   */
  list(entityType: string, filters: any): string;

  /**
   * Build cache key for aggregate/summary
   */
  summary(entityType: string, id: string, summaryType: string): string;

  /**
   * Build cache key for search results
   */
  search(query: string, filters: Record<string, unknown>): string;
}

/**
 * Default cache key builder implementation
 */
export class CacheKeyBuilder implements ICacheKeyBuilder {
  private static readonly PREFIX = 'white-cross';

  entity(entityType: string, id: string): string {
    return `${CacheKeyBuilder.PREFIX}:${entityType.toLowerCase()}:${id}`;
  }

  list(entityType: string, filters: Record<string, unknown>): string {
    const filterHash = this.hashFilters(filters);
    return `${CacheKeyBuilder.PREFIX}:${entityType.toLowerCase()}:list:${filterHash}`;
  }

  summary(entityType: string, id: string, summaryType: string): string {
    return `${CacheKeyBuilder.PREFIX}:${entityType.toLowerCase()}:${id}:summary:${summaryType}`;
  }

  search(query: string, filters: any): string {
    const filterHash = this.hashFilters({ query, ...filters });
    return `${CacheKeyBuilder.PREFIX}:search:${filterHash}`;
  }

  private hashFilters(filters: any): string {
    // Create consistent hash of filter object
    const normalized = JSON.stringify(filters, Object.keys(filters).sort());
    // Simple hash implementation - use crypto.createHash in production
    return Buffer.from(normalized).toString('base64').substring(0, 16);
  }
}

/**
 * Cache TTL (Time To Live) constants
 */
export enum CacheTTL {
  /**
   * 5 minutes
   */
  SHORT = 300,

  /**
   * 15 minutes
   */
  MEDIUM = 900,

  /**
   * 30 minutes
   */
  LONG = 1800,

  /**
   * 1 hour
   */
  HOUR = 3600,

  /**
   * 1 day
   */
  DAY = 86400
}

/**
 * Entity-specific cache TTL configuration
 */
export const ENTITY_CACHE_TTL: Record<string, number> = {
  HealthRecord: CacheTTL.SHORT,
  Allergy: CacheTTL.LONG,
  ChronicCondition: CacheTTL.MEDIUM,
  Student: CacheTTL.LONG,
  StudentMedication: CacheTTL.SHORT,
  User: CacheTTL.LONG,
  Appointment: CacheTTL.SHORT
};

/**
 * Retrieves the recommended cache TTL for a given entity type.
 *
 * Returns entity-specific TTL if configured, otherwise returns default MEDIUM TTL (15 minutes).
 * PHI entities typically have shorter TTL to ensure data freshness and compliance.
 *
 * @param {string} entityType - Entity type name (e.g., 'HealthRecord', 'Student')
 *
 * @returns {number} TTL in seconds for the entity type
 *
 * @example
 * ```typescript
 * const ttl = getCacheTTL('HealthRecord');  // Returns 300 (5 minutes)
 * await cacheManager.set('white-cross:healthrecord:123', data, ttl);
 *
 * const defaultTTL = getCacheTTL('UnknownEntity');  // Returns 900 (15 minutes)
 * ```
 *
 * @see {@link ENTITY_CACHE_TTL} for entity-specific TTL configuration
 * @see {@link CacheTTL} for standard TTL constants
 */
export function getCacheTTL(entityType: string): number {
  return ENTITY_CACHE_TTL[entityType] || CacheTTL.MEDIUM;
}
