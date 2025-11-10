/**
 * @fileoverview Cache Performance Utilities
 * @module core/cache/performance
 *
 * Performance optimization utilities for caching including metrics tracking,
 * cache warming, batch operations, and performance monitoring.
 *
 * @example Track cache metrics
 * ```typescript
 * const metrics = new CacheMetrics();
 * metrics.recordHit('user-cache');
 * metrics.recordMiss('user-cache');
 * const stats = metrics.getStats('user-cache');
 * console.log(`Hit rate: ${stats.hitRate}%`);
 * ```
 */
/**
 * Cache performance metrics
 */
export interface CacheMetricsData {
    hits: number;
    misses: number;
    sets: number;
    deletes: number;
    errors: number;
    totalTime: number;
    avgTime: number;
    hitRate: number;
    missRate: number;
}
/**
 * Cache metrics tracker
 */
export declare class CacheMetrics {
    private metrics;
    /**
     * Record a cache hit
     */
    recordHit(namespace: string, time?: number): void;
    /**
     * Record a cache miss
     */
    recordMiss(namespace: string, time?: number): void;
    /**
     * Record a cache set operation
     */
    recordSet(namespace: string, time?: number): void;
    /**
     * Record a cache delete operation
     */
    recordDelete(namespace: string, time?: number): void;
    /**
     * Record a cache error
     */
    recordError(namespace: string): void;
    /**
     * Get or create metrics for namespace
     */
    private getOrCreateMetrics;
    /**
     * Get statistics for a namespace
     */
    getStats(namespace: string): CacheMetricsData;
    /**
     * Get all statistics
     */
    getAllStats(): Map<string, CacheMetricsData>;
    /**
     * Reset metrics for a namespace
     */
    reset(namespace?: string): void;
}
/**
 * Cache warmer configuration
 */
export interface CacheWarmerConfig {
    /** Batch size for warming operations */
    batchSize?: number;
    /** Delay between batches in milliseconds */
    batchDelay?: number;
    /** Maximum concurrent warming operations */
    concurrency?: number;
}
/**
 * Cache warmer for preloading frequently accessed data
 */
export declare class CacheWarmer {
    private config;
    constructor(config?: CacheWarmerConfig);
    /**
     * Warm cache with data
     */
    warm<T>(keys: string[], loader: (key: string) => Promise<T>, setter: (key: string, value: T) => Promise<void>): Promise<{
        success: number;
        failed: number;
    }>;
    /**
     * Chunk array into smaller arrays
     */
    private chunkArray;
    /**
     * Delay utility
     */
    private delay;
}
/**
 * Batch cache operations
 */
export declare class BatchCacheOperations {
    /**
     * Get multiple values from cache
     */
    getMany<T>(keys: string[], getter: (key: string) => Promise<T | null>): Promise<Map<string, T>>;
    /**
     * Set multiple values in cache
     */
    setMany<T>(entries: Map<string, T>, setter: (key: string, value: T) => Promise<void>): Promise<{
        success: number;
        failed: number;
    }>;
    /**
     * Delete multiple values from cache
     */
    deleteMany(keys: string[], deleter: (key: string) => Promise<void>): Promise<{
        success: number;
        failed: number;
    }>;
}
/**
 * Performance monitor for cache operations
 */
export declare class CachePerformanceMonitor {
    private operations;
    private maxOperations;
    constructor(maxOperations?: number);
    /**
     * Track an operation
     */
    track<T>(operation: string, fn: () => Promise<T>): Promise<T>;
    /**
     * Record operation metrics
     */
    private recordOperation;
    /**
     * Get performance statistics
     */
    getStatistics(operation?: string): {
        count: number;
        avgDuration: number;
        minDuration: number;
        maxDuration: number;
        successRate: number;
        p50: number;
        p95: number;
        p99: number;
    };
    /**
     * Calculate percentile
     */
    private percentile;
    /**
     * Get slow operations (above threshold)
     */
    getSlowOperations(thresholdMs: number): typeof this.operations;
    /**
     * Clear recorded operations
     */
    clear(): void;
}
/**
 * Memoization decorator for functions
 */
export declare function memoize<T extends (...args: any[]) => any>(fn: T, options?: {
    ttl?: number;
    keyGenerator?: (...args: Parameters<T>) => string;
    maxSize?: number;
}): T;
/**
 * Async memoization decorator
 */
export declare function memoizeAsync<T extends (...args: any[]) => Promise<any>>(fn: T, options?: {
    ttl?: number;
    keyGenerator?: (...args: Parameters<T>) => string;
    maxSize?: number;
}): T;
/**
 * Debounced cache setter to reduce write operations
 */
export declare class DebouncedCacheSetter<T> {
    private setter;
    private pending;
    private delay;
    constructor(setter: (key: string, value: T) => Promise<void>, delay?: number);
    /**
     * Set value with debounce
     */
    set(key: string, value: T): void;
    /**
     * Flush all pending sets immediately
     */
    flush(): Promise<void>;
    /**
     * Cancel all pending sets
     */
    cancel(): void;
}
//# sourceMappingURL=performance.d.ts.map