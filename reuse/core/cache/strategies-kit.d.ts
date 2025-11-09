/**
 * @fileoverview Cache Strategies Kit
 * @module core/cache/strategies-kit
 *
 * Unified interface for working with different cache strategies.
 * Provides factory methods and utilities for selecting and configuring strategies.
 *
 * @example Use cache-aside strategy
 * ```typescript
 * const kit = new CacheStrategiesKit(storage);
 * const strategy = kit.cacheAside({ ttl: 3600000 });
 *
 * const data = await strategy.get('key', async () => {
 *   return await fetchFromDatabase();
 * });
 * ```
 */
import { CacheStrategy, CacheAsideStrategy, WriteThroughStrategy, WriteBehindStrategy, ReadThroughStrategy, RefreshAheadStrategy, CacheStorage, CacheStrategyOptions } from './strategies';
/**
 * Configuration for strategy kit
 */
export interface StrategiesKitConfig {
    /** Default TTL for all strategies */
    defaultTTL?: number;
    /** Default namespace for all strategies */
    defaultNamespace?: string;
    /** Enable compression by default */
    compress?: boolean;
}
/**
 * Cache Strategies Kit
 *
 * Factory and utility class for working with different caching strategies.
 */
export default class CacheStrategiesKit {
    private storage;
    private config;
    constructor(storage: CacheStorage, config?: StrategiesKitConfig);
    /**
     * Create cache-aside strategy
     */
    cacheAside(options?: CacheStrategyOptions): CacheAsideStrategy;
    /**
     * Create write-through strategy
     */
    writeThrough(options?: CacheStrategyOptions): WriteThroughStrategy;
    /**
     * Create write-behind strategy
     */
    writeBehind(options?: CacheStrategyOptions & {
        flushIntervalMs?: number;
        onFlush?: (key: string, value: any) => Promise<void>;
    }): WriteBehindStrategy;
    /**
     * Create read-through strategy
     */
    readThrough(loader: (key: string) => Promise<any>, options?: CacheStrategyOptions): ReadThroughStrategy;
    /**
     * Create refresh-ahead strategy
     */
    refreshAhead(options?: CacheStrategyOptions & {
        refreshThreshold?: number;
    }): RefreshAheadStrategy;
    /**
     * Merge options with defaults
     */
    private mergeOptions;
    /**
     * Get the underlying storage
     */
    getStorage(): CacheStorage;
    /**
     * Create a namespaced kit
     */
    namespace(namespace: string): CacheStrategiesKit;
}
/**
 * Strategy selector utility
 */
export declare class StrategySelector {
    /**
     * Select optimal strategy based on use case
     */
    static selectStrategy(useCase: 'read-heavy' | 'write-heavy' | 'balanced' | 'high-availability' | 'low-latency', storage: CacheStorage, options?: CacheStrategyOptions): CacheStrategy;
}
/**
 * Multi-level cache strategy
 *
 * Implements a multi-tier caching approach with L1 (memory) and L2 (Redis) caches.
 */
export declare class MultiLevelCacheStrategy {
    private l1Cache;
    private l2Cache;
    private options;
    constructor(l1Cache: CacheStorage, l2Cache: CacheStorage, options?: CacheStrategyOptions);
    /**
     * Get value from multi-level cache
     */
    get<T>(key: string, loader?: () => Promise<T>): Promise<T | null>;
    /**
     * Set value in multi-level cache
     */
    set<T>(key: string, value: T, ttl?: number): Promise<void>;
    /**
     * Delete from multi-level cache
     */
    delete(key: string): Promise<void>;
    /**
     * Check if key exists in either level
     */
    has(key: string): Promise<boolean>;
    /**
     * Clear both cache levels
     */
    clear(): Promise<void>;
}
/**
 * Partitioned cache strategy
 *
 * Distributes cache across multiple storage backends based on key hash.
 */
export declare class PartitionedCacheStrategy {
    private partitions;
    private options;
    constructor(partitions: CacheStorage[], options?: CacheStrategyOptions);
    /**
     * Get partition for key
     */
    private getPartition;
    /**
     * Simple hash function
     */
    private hashCode;
    /**
     * Get value from partitioned cache
     */
    get<T>(key: string): Promise<T | null>;
    /**
     * Set value in partitioned cache
     */
    set<T>(key: string, value: T, ttl?: number): Promise<void>;
    /**
     * Delete from partitioned cache
     */
    delete(key: string): Promise<void>;
    /**
     * Check if key exists
     */
    has(key: string): Promise<boolean>;
    /**
     * Clear all partitions
     */
    clear(): Promise<void>;
    /**
     * Get all keys from all partitions
     */
    keys(pattern?: string): Promise<string[]>;
}
/**
 * Replicated cache strategy
 *
 * Writes to multiple cache backends for redundancy and reads from the fastest.
 */
export declare class ReplicatedCacheStrategy {
    private replicas;
    private options;
    constructor(replicas: CacheStorage[], options?: CacheStrategyOptions);
    /**
     * Get value from replicated cache (first successful read)
     */
    get<T>(key: string): Promise<T | null>;
    /**
     * Set value in all replicas
     */
    set<T>(key: string, value: T, ttl?: number): Promise<void>;
    /**
     * Delete from all replicas
     */
    delete(key: string): Promise<void>;
    /**
     * Check if key exists in any replica
     */
    has(key: string): Promise<boolean>;
    /**
     * Clear all replicas
     */
    clear(): Promise<void>;
}
/**
 * Create strategies kit instance
 */
export declare function createStrategiesKit(storage: CacheStorage, config?: StrategiesKitConfig): CacheStrategiesKit;
export { CacheStrategiesKit };
//# sourceMappingURL=strategies-kit.d.ts.map