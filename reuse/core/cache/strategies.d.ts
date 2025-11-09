/**
 * @fileoverview Cache Strategies Implementation
 * @module core/cache/strategies
 *
 * Production-ready implementations of common caching strategies including
 * cache-aside, write-through, write-behind, and read-through patterns.
 *
 * @example Cache-aside pattern
 * ```typescript
 * const cacheAside = new CacheAsideStrategy(cache);
 * const data = await cacheAside.get('key', async () => {
 *   return await database.query('SELECT * FROM users WHERE id = ?', [id]);
 * });
 * ```
 */
/**
 * Options for cache strategy operations
 */
export interface CacheStrategyOptions {
    /** Time-to-live in milliseconds */
    ttl?: number;
    /** Namespace for cache keys */
    namespace?: string;
    /** Whether to compress data before caching */
    compress?: boolean;
    /** Custom key generator function */
    keyGenerator?: (key: string) => string;
}
/**
 * Interface for cache storage backend
 */
export interface CacheStorage {
    get<T>(key: string): Promise<T | null>;
    set<T>(key: string, value: T, ttl?: number): Promise<void>;
    delete(key: string): Promise<void>;
    clear(): Promise<void>;
    has(key: string): Promise<boolean>;
    keys(pattern?: string): Promise<string[]>;
}
/**
 * Base class for cache strategies
 */
export declare abstract class CacheStrategy {
    protected storage: CacheStorage;
    protected options: CacheStrategyOptions;
    constructor(storage: CacheStorage, options?: CacheStrategyOptions);
    /**
     * Generates a namespaced cache key
     */
    protected generateKey(key: string): string;
    /**
     * Abstract method to retrieve data
     */
    abstract get<T>(key: string, loader?: () => Promise<T>, options?: CacheStrategyOptions): Promise<T | null>;
    /**
     * Abstract method to store data
     */
    abstract set<T>(key: string, value: T, options?: CacheStrategyOptions): Promise<void>;
    /**
     * Delete a cached item
     */
    delete(key: string): Promise<void>;
    /**
     * Check if a key exists in cache
     */
    has(key: string): Promise<boolean>;
    /**
     * Clear all cached items
     */
    clear(): Promise<void>;
}
/**
 * Cache-Aside (Lazy Loading) Strategy
 *
 * Application checks cache first, if miss, loads from data source and populates cache.
 * Best for read-heavy workloads where data doesn't change frequently.
 */
export declare class CacheAsideStrategy extends CacheStrategy {
    /**
     * Get value from cache or load from data source
     */
    get<T>(key: string, loader?: () => Promise<T>, options?: CacheStrategyOptions): Promise<T | null>;
    /**
     * Set value in cache
     */
    set<T>(key: string, value: T, options?: CacheStrategyOptions): Promise<void>;
}
/**
 * Write-Through Strategy
 *
 * Data is written to cache and data source simultaneously.
 * Ensures cache is always consistent with data source.
 */
export declare class WriteThroughStrategy extends CacheStrategy {
    /**
     * Get value from cache
     */
    get<T>(key: string, loader?: () => Promise<T>, options?: CacheStrategyOptions): Promise<T | null>;
    /**
     * Set value in both cache and data source
     */
    set<T>(key: string, value: T, options?: CacheStrategyOptions): Promise<void>;
}
/**
 * Write-Behind (Write-Back) Strategy
 *
 * Data is written to cache immediately, then asynchronously to data source.
 * Improves write performance but risks data loss if cache fails.
 */
export declare class WriteBehindStrategy extends CacheStrategy {
    private writeQueue;
    private flushInterval;
    private flushIntervalMs;
    private onFlush?;
    constructor(storage: CacheStorage, options?: CacheStrategyOptions & {
        flushIntervalMs?: number;
        onFlush?: (key: string, value: any) => Promise<void>;
    });
    /**
     * Start the background flush interval
     */
    private startFlushInterval;
    /**
     * Get value from cache
     */
    get<T>(key: string, loader?: () => Promise<T>, options?: CacheStrategyOptions): Promise<T | null>;
    /**
     * Set value in cache and queue for background write
     */
    set<T>(key: string, value: T, options?: CacheStrategyOptions): Promise<void>;
    /**
     * Flush queued writes to data source
     */
    flush(): Promise<void>;
    /**
     * Stop the flush interval and flush remaining writes
     */
    stop(): Promise<void>;
}
/**
 * Read-Through Strategy
 *
 * Cache sits in front of data source and handles loading transparently.
 * Application always reads from cache; cache loads from data source on miss.
 */
export declare class ReadThroughStrategy extends CacheStrategy {
    private loader;
    constructor(storage: CacheStorage, loader: (key: string) => Promise<any>, options?: CacheStrategyOptions);
    /**
     * Get value from cache, loading transparently on miss
     */
    get<T>(key: string, loader?: () => Promise<T>, options?: CacheStrategyOptions): Promise<T | null>;
    /**
     * Set value in cache
     */
    set<T>(key: string, value: T, options?: CacheStrategyOptions): Promise<void>;
}
/**
 * Refresh-Ahead Strategy
 *
 * Proactively refreshes cache before expiration to prevent cache misses.
 * Best for frequently accessed data with predictable access patterns.
 */
export declare class RefreshAheadStrategy extends CacheStrategy {
    private refreshThreshold;
    private activeRefreshes;
    constructor(storage: CacheStorage, options?: CacheStrategyOptions & {
        refreshThreshold?: number;
    });
    /**
     * Get value from cache with proactive refresh
     */
    get<T>(key: string, loader?: () => Promise<T>, options?: CacheStrategyOptions): Promise<T | null>;
    /**
     * Maybe refresh cache in background
     */
    private maybeRefresh;
    /**
     * Set value in cache
     */
    set<T>(key: string, value: T, options?: CacheStrategyOptions): Promise<void>;
}
//# sourceMappingURL=strategies.d.ts.map