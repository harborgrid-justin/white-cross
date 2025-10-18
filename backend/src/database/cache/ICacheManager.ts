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
 * Provides abstraction for caching layer with PHI encryption support
 */

export interface ICacheManager {
  /**
   * Get cached value by key
   * @param key Cache key
   * @returns Cached value or null if not found
   */
  get<T>(key: string): Promise<T | null>;

  /**
   * Set cache value
   * @param key Cache key
   * @param value Value to cache
   * @param ttl Time to live in seconds
   */
  set<T>(key: string, value: T, ttl: number): Promise<void>;

  /**
   * Delete cached value
   * @param key Cache key
   */
  delete(key: string): Promise<void>;

  /**
   * Delete multiple keys matching pattern
   * @param pattern Pattern to match (e.g., "user:*")
   */
  deletePattern(pattern: string): Promise<void>;

  /**
   * Check if key exists in cache
   * @param key Cache key
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
  search(query: string, filters: any): string;
}

/**
 * Default cache key builder implementation
 */
export class CacheKeyBuilder implements ICacheKeyBuilder {
  private static readonly PREFIX = 'white-cross';

  entity(entityType: string, id: string): string {
    return `${CacheKeyBuilder.PREFIX}:${entityType.toLowerCase()}:${id}`;
  }

  list(entityType: string, filters: any): string {
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
 * Get cache TTL for entity type
 */
export function getCacheTTL(entityType: string): number {
  return ENTITY_CACHE_TTL[entityType] || CacheTTL.MEDIUM;
}
