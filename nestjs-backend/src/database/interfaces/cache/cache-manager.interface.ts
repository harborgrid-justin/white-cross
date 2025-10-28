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
 */

export interface ICacheManager {
  /**
   * Retrieves a cached value by key
   */
  get<T>(key: string): Promise<T | null>;

  /**
   * Stores a value in the cache with specified TTL
   */
  set<T>(key: string, value: T, ttl: number): Promise<void>;

  /**
   * Deletes a cached value by key
   */
  delete(key: string): Promise<void>;

  /**
   * Deletes all cache entries matching a pattern
   */
  deletePattern(pattern: string): Promise<void>;

  /**
   * Checks if a key exists in the cache
   */
  exists(key: string): Promise<boolean>;

  /**
   * Set multiple values at once
   */
  mset(entries: Array<[string, any, number]>): Promise<void>;

  /**
   * Get multiple values at once
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
  hits: number;
  misses: number;
  keyCount: number;
  memoryUsage: number;
  hitRate: number;
}

/**
 * Cache configuration
 */
export interface CacheConfig {
  enabled: boolean;
  defaultTTL: number;
  encryptPHI: boolean;
  auditCacheAccess: boolean;
  allowedEntityTypes: string[];
  maxCacheSize: number;
  evictionPolicy: string;
  redis?: {
    host: string;
    port: number;
    password?: string;
    db?: number;
  };
}

/**
 * Cache key builder interface
 */
export interface ICacheKeyBuilder {
  entity(entityType: string, id: string): string;
  list(entityType: string, filters: any): string;
  summary(entityType: string, id: string, summaryType: string): string;
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
    const normalized = JSON.stringify(filters, Object.keys(filters).sort());
    return Buffer.from(normalized).toString('base64').substring(0, 16);
  }
}
