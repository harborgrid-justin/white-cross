/**
 * @fileoverview Cache Management Kit
 * @module core/cache/management-kit
 *
 * Comprehensive cache management utilities including lifecycle management,
 * eviction policies, cache invalidation, and monitoring.
 *
 * @example Basic cache manager
 * ```typescript
 * const manager = new CacheManagementKit({
 *   maxSize: 1000,
 *   evictionPolicy: 'lru',
 *   ttl: 3600000
 * });
 *
 * await manager.set('key', 'value');
 * const value = await manager.get('key');
 * ```
 */
/**
 * Cache management configuration
 */
export interface CacheManagementConfig {
    /** Maximum number of items in cache */
    maxSize?: number;
    /** Default TTL in milliseconds */
    ttl?: number;
    /** Eviction policy */
    evictionPolicy?: 'lru' | 'lfu' | 'fifo' | 'ttl';
    /** Enable metrics tracking */
    enableMetrics?: boolean;
    /** Cleanup interval in milliseconds */
    cleanupInterval?: number;
}
/**
 * Cache Management Kit
 *
 * Provides comprehensive cache management with eviction policies,
 * metrics tracking, and lifecycle management.
 */
export default class CacheManagementKit<T = any> {
    private cache;
    private config;
    private metrics;
    private cleanupTimer;
    constructor(config?: CacheManagementConfig);
    /**
     * Start periodic cleanup
     */
    private startCleanup;
    /**
     * Get value from cache
     */
    get(key: string): Promise<T | null>;
    /**
     * Set value in cache
     */
    set(key: string, value: T, ttl?: number): Promise<void>;
    /**
     * Delete value from cache
     */
    delete(key: string): Promise<boolean>;
    /**
     * Check if key exists
     */
    has(key: string): Promise<boolean>;
    /**
     * Clear all cache entries
     */
    clear(): Promise<void>;
    /**
     * Get all keys
     */
    keys(pattern?: string): Promise<string[]>;
    /**
     * Get cache size
     */
    size(): number;
    /**
     * Evict entry based on policy
     */
    private evict;
    /**
     * Evict least recently used entry
     */
    private evictLRU;
    /**
     * Evict least frequently used entry
     */
    private evictLFU;
    /**
     * Evict first in first out entry
     */
    private evictFIFO;
    /**
     * Evict entry with shortest TTL
     */
    private evictTTL;
    /**
     * Clean expired entries
     */
    private cleanExpired;
    /**
     * Get cache metrics
     */
    getMetrics(): import("./performance").CacheMetricsData;
    /**
     * Reset metrics
     */
    resetMetrics(): void;
    /**
     * Get cache statistics
     */
    getStats(): {
        size: number;
        maxSize: number;
        hitRate: number;
        missRate: number;
        evictionPolicy: string;
    };
    /**
     * Invalidate cache entries matching pattern
     */
    invalidate(pattern: string): Promise<number>;
    /**
     * Get or set pattern
     */
    getOrSet(key: string, loader: () => Promise<T>, ttl?: number): Promise<T>;
    /**
     * Batch get operation
     */
    getMany(keys: string[]): Promise<Map<string, T>>;
    /**
     * Batch set operation
     */
    setMany(entries: Map<string, T>, ttl?: number): Promise<void>;
    /**
     * Batch delete operation
     */
    deleteMany(keys: string[]): Promise<number>;
    /**
     * Refresh cache entry TTL
     */
    touch(key: string, ttl?: number): Promise<boolean>;
    /**
     * Get remaining TTL for a key
     */
    getTTL(key: string): Promise<number>;
    /**
     * Stop cleanup timer and cleanup
     */
    destroy(): void;
}
/**
 * Create cache manager instance
 */
export declare function createCacheManager<T = any>(config?: CacheManagementConfig): CacheManagementKit<T>;
/**
 * Cache invalidation utilities
 */
export declare class CacheInvalidator {
    private patterns;
    /**
     * Register a pattern for a tag
     */
    registerTag(tag: string, pattern: string): void;
    /**
     * Invalidate by tag
     */
    invalidateByTag(tag: string, cache: CacheManagementKit): Promise<number>;
    /**
     * Invalidate multiple tags
     */
    invalidateTags(tags: string[], cache: CacheManagementKit): Promise<number>;
    /**
     * Clear all patterns for a tag
     */
    clearTag(tag: string): void;
    /**
     * Clear all tags
     */
    clearAll(): void;
}
export { CacheManagementKit };
//# sourceMappingURL=management-kit.d.ts.map