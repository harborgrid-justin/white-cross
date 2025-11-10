/**
 * LOC: SANCACHE001
 * File: /reuse/san/network-caching-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - SAN network controllers
 *   - Network caching services
 *   - Distributed cache managers
 */
/**
 * File: /reuse/san/network-caching-kit.ts
 * Locator: WC-UTL-SAN-CACHE-001
 * Purpose: Comprehensive Network Caching Utilities for Software-Defined Virtual Networks
 *
 * Upstream: Independent utility module for network caching
 * Downstream: ../backend/*, SAN controllers, cache services, distributed cache systems
 * Dependencies: TypeScript 5.x, Node 18+, Sequelize 6.x, Redis 7.x
 * Exports: 40 utility functions for cache strategies, invalidation, distributed caching, warming, statistics, compression, partitioning, eviction
 *
 * LLM Context: Production-grade network caching utilities for software-defined enterprise virtual networks.
 * Provides multiple cache strategies (LRU, LFU, FIFO, Adaptive), distributed caching with partitioning,
 * intelligent cache warming, comprehensive statistics, compression, and flexible eviction policies.
 * Essential for high-performance SAN infrastructure with low-latency requirements and optimal resource utilization.
 */
import { Sequelize } from 'sequelize';
interface CacheEntry {
    key: string;
    value: any;
    ttl: number;
    createdAt: number;
    lastAccessedAt: number;
    accessCount: number;
    size: number;
    compressed: boolean;
    tags: string[];
}
interface CacheStrategy {
    name: string;
    get: (key: string) => CacheEntry | null;
    set: (key: string, value: any, ttl: number, tags?: string[]) => void;
    delete: (key: string) => boolean;
    clear: () => void;
    evict: () => void;
}
interface CacheStatistics {
    hits: number;
    misses: number;
    hitRatio: number;
    totalRequests: number;
    evictions: number;
    size: number;
    avgAccessTime: number;
}
interface CachePartitionConfig {
    partitionCount: number;
    strategy: 'hash' | 'range' | 'list';
    replicationFactor: number;
}
interface CachePartition {
    id: string;
    range: {
        start: string;
        end: string;
    };
    nodes: string[];
    size: number;
    entries: number;
}
interface CacheWarmupConfig {
    sources: Array<{
        url: string;
        priority: number;
    }>;
    batchSize: number;
    concurrency: number;
    timeout: number;
}
interface DistributedCacheConfig {
    nodes: string[];
    replicationFactor: number;
    consistentHashing: boolean;
    partitionCount: number;
}
interface CompressionConfig {
    enabled: boolean;
    minSize: number;
    algorithm: 'gzip' | 'deflate' | 'brotli';
    level: number;
}
interface EvictionPolicy {
    strategy: 'lru' | 'lfu' | 'fifo' | 'ttl';
    maxSize: number;
    maxEntries: number;
}
/**
 * Sequelize model for Network Cache entries with TTL and metadata.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} NetworkCache model
 *
 * @example
 * ```typescript
 * const NetworkCache = createNetworkCacheModel(sequelize);
 * const entry = await NetworkCache.create({
 *   cacheKey: 'network:net-12345:config',
 *   value: { vlanId: 100, subnet: '10.0.1.0/24' },
 *   ttl: 3600,
 *   tags: ['network', 'config']
 * });
 * ```
 */
export declare const createNetworkCacheModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        cacheKey: string;
        value: any;
        ttl: number;
        expiresAt: Date;
        compressed: boolean;
        size: number;
        accessCount: number;
        lastAccessedAt: Date | null;
        tags: string[];
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Cache Statistics tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CacheStatistics model
 *
 * @example
 * ```typescript
 * const CacheStats = createCacheStatisticsModel(sequelize);
 * const stats = await CacheStats.create({
 *   period: 'hourly',
 *   hits: 1250,
 *   misses: 150,
 *   evictions: 25,
 *   avgResponseTime: 2.5
 * });
 * ```
 */
export declare const createCacheStatisticsModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        period: string;
        hits: number;
        misses: number;
        evictions: number;
        totalSize: number;
        totalEntries: number;
        avgResponseTime: number;
        hitRatio: number;
        metadata: Record<string, any>;
        readonly createdAt: Date;
    };
};
/**
 * Sequelize model for Cache Partitions in distributed systems.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CachePartition model
 *
 * @example
 * ```typescript
 * const CachePartition = createCachePartitionModel(sequelize);
 * const partition = await CachePartition.create({
 *   partitionId: 'part-0',
 *   rangeStart: '0',
 *   rangeEnd: '3fffffff',
 *   nodes: ['cache-node-1', 'cache-node-2'],
 *   entryCount: 5000
 * });
 * ```
 */
export declare const createCachePartitionModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        partitionId: string;
        rangeStart: string;
        rangeEnd: string;
        nodes: string[];
        entryCount: number;
        totalSize: number;
        status: string;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Creates a cache strategy instance based on configuration.
 *
 * @param {string} strategyType - Strategy type (lru, lfu, fifo, adaptive)
 * @param {number} maxEntries - Maximum cache entries
 * @returns {CacheStrategy} Cache strategy instance
 *
 * @example
 * ```typescript
 * const cache = createCacheStrategy('lru', 1000);
 * cache.set('key1', { data: 'value' }, 3600);
 * const value = cache.get('key1');
 * ```
 */
export declare const createCacheStrategy: (strategyType: string, maxEntries: number) => CacheStrategy;
/**
 * Creates LRU (Least Recently Used) cache strategy.
 *
 * @param {number} maxEntries - Maximum cache entries
 * @returns {CacheStrategy} LRU cache instance
 *
 * @example
 * ```typescript
 * const lruCache = getLRUCache(500);
 * lruCache.set('network:123', networkData, 3600);
 * const data = lruCache.get('network:123');
 * ```
 */
export declare const getLRUCache: (maxEntries: number) => CacheStrategy;
/**
 * Creates LFU (Least Frequently Used) cache strategy.
 *
 * @param {number} maxEntries - Maximum cache entries
 * @returns {CacheStrategy} LFU cache instance
 *
 * @example
 * ```typescript
 * const lfuCache = getLFUCache(500);
 * lfuCache.set('popular:item', data, 7200);
 * ```
 */
export declare const getLFUCache: (maxEntries: number) => CacheStrategy;
/**
 * Creates FIFO (First In First Out) cache strategy.
 *
 * @param {number} maxEntries - Maximum cache entries
 * @returns {CacheStrategy} FIFO cache instance
 *
 * @example
 * ```typescript
 * const fifoCache = getFIFOCache(500);
 * fifoCache.set('temp:data', tempData, 300);
 * ```
 */
export declare const getFIFOCache: (maxEntries: number) => CacheStrategy;
/**
 * Creates adaptive cache strategy that switches between LRU and LFU.
 *
 * @param {number} maxEntries - Maximum cache entries
 * @returns {CacheStrategy} Adaptive cache instance
 *
 * @example
 * ```typescript
 * const adaptiveCache = getAdaptiveCache(500);
 * adaptiveCache.set('dynamic:key', data, 1800);
 * ```
 */
export declare const getAdaptiveCache: (maxEntries: number) => CacheStrategy;
/**
 * Invalidates specific cache entry by key.
 *
 * @param {CacheStrategy} cache - Cache strategy instance
 * @param {string} key - Cache key to invalidate
 * @returns {boolean} Whether invalidation succeeded
 *
 * @example
 * ```typescript
 * const invalidated = invalidateCache(cache, 'network:123');
 * ```
 */
export declare const invalidateCache: (cache: CacheStrategy, key: string) => boolean;
/**
 * Invalidates cache entries matching a pattern.
 *
 * @param {any} CacheModel - Sequelize cache model
 * @param {string} pattern - Key pattern (supports wildcards)
 * @returns {Promise<number>} Number of invalidated entries
 *
 * @example
 * ```typescript
 * const count = await invalidateByPattern(CacheModel, 'network:*:config');
 * console.log(`Invalidated ${count} entries`);
 * ```
 */
export declare const invalidateByPattern: (CacheModel: any, pattern: string) => Promise<number>;
/**
 * Invalidates all cache entries with specific tag.
 *
 * @param {any} CacheModel - Sequelize cache model
 * @param {string} tag - Tag to invalidate
 * @returns {Promise<number>} Number of invalidated entries
 *
 * @example
 * ```typescript
 * const count = await invalidateByTag(CacheModel, 'network-config');
 * ```
 */
export declare const invalidateByTag: (CacheModel: any, tag: string) => Promise<number>;
/**
 * Invalidates all expired cache entries.
 *
 * @param {any} CacheModel - Sequelize cache model
 * @returns {Promise<number>} Number of invalidated entries
 *
 * @example
 * ```typescript
 * const count = await invalidateExpired(CacheModel);
 * console.log(`Removed ${count} expired entries`);
 * ```
 */
export declare const invalidateExpired: (CacheModel: any) => Promise<number>;
/**
 * Cascades invalidation to related cache entries.
 *
 * @param {any} CacheModel - Sequelize cache model
 * @param {string} key - Primary key to invalidate
 * @param {string[]} relatedPatterns - Related key patterns
 * @returns {Promise<number>} Total invalidated entries
 *
 * @example
 * ```typescript
 * const count = await cascadeInvalidate(
 *   CacheModel,
 *   'network:123',
 *   ['network:123:*', 'subnet:*:network:123']
 * );
 * ```
 */
export declare const cascadeInvalidate: (CacheModel: any, key: string, relatedPatterns: string[]) => Promise<number>;
/**
 * Creates distributed cache instance across multiple nodes.
 *
 * @param {DistributedCacheConfig} config - Distributed cache configuration
 * @returns {any} Distributed cache manager
 *
 * @example
 * ```typescript
 * const distCache = createDistributedCache({
 *   nodes: ['cache1:6379', 'cache2:6379', 'cache3:6379'],
 *   replicationFactor: 2,
 *   consistentHashing: true,
 *   partitionCount: 16
 * });
 * ```
 */
export declare const createDistributedCache: (config: DistributedCacheConfig) => any;
/**
 * Synchronizes cache data across distributed nodes.
 *
 * @param {string} key - Cache key
 * @param {any} value - Cache value
 * @param {string[]} nodes - Target nodes
 * @returns {Promise<{ success: number; failed: number }>} Sync results
 *
 * @example
 * ```typescript
 * const result = await syncCacheNodes('network:123', data, [
 *   'cache1:6379',
 *   'cache2:6379'
 * ]);
 * ```
 */
export declare const syncCacheNodes: (key: string, value: any, nodes: string[]) => Promise<{
    success: number;
    failed: number;
}>;
/**
 * Handles cache partition split/merge scenarios.
 *
 * @param {string} partitionId - Partition identifier
 * @param {string} action - Action (split or merge)
 * @param {any} PartitionModel - Partition model
 * @returns {Promise<CachePartition[]>} Updated partitions
 *
 * @example
 * ```typescript
 * const partitions = await handleCachePartition('part-0', 'split', PartitionModel);
 * ```
 */
export declare const handleCachePartition: (partitionId: string, action: string, PartitionModel: any) => Promise<CachePartition[]>;
/**
 * Rebalances cache across nodes based on load.
 *
 * @param {any} PartitionModel - Partition model
 * @param {string[]} nodes - Available cache nodes
 * @returns {Promise<number>} Number of rebalanced partitions
 *
 * @example
 * ```typescript
 * const count = await rebalanceCache(PartitionModel, [
 *   'cache1:6379',
 *   'cache2:6379',
 *   'cache3:6379'
 * ]);
 * ```
 */
export declare const rebalanceCache: (PartitionModel: any, nodes: string[]) => Promise<number>;
/**
 * Retrieves distributed cache topology information.
 *
 * @param {any} PartitionModel - Partition model
 * @returns {Promise<any>} Cache topology data
 *
 * @example
 * ```typescript
 * const topology = await getCacheTopology(PartitionModel);
 * console.log('Total partitions:', topology.partitionCount);
 * console.log('Total nodes:', topology.nodeCount);
 * ```
 */
export declare const getCacheTopology: (PartitionModel: any) => Promise<any>;
/**
 * Warms cache with preloaded data from sources.
 *
 * @param {CacheWarmupConfig} config - Warmup configuration
 * @param {CacheStrategy} cache - Cache instance
 * @returns {Promise<{ loaded: number; failed: number }>} Warmup results
 *
 * @example
 * ```typescript
 * const result = await warmCache({
 *   sources: [
 *     { url: '/api/networks', priority: 10 },
 *     { url: '/api/subnets', priority: 5 }
 *   ],
 *   batchSize: 100,
 *   concurrency: 5,
 *   timeout: 30000
 * }, cache);
 * ```
 */
export declare const warmCache: (config: CacheWarmupConfig, cache: CacheStrategy) => Promise<{
    loaded: number;
    failed: number;
}>;
/**
 * Preloads specific cache data in batches.
 *
 * @param {Array<{ key: string; value: any; ttl: number }>} data - Data to preload
 * @param {CacheStrategy} cache - Cache instance
 * @param {number} batchSize - Batch size
 * @returns {Promise<number>} Number of entries loaded
 *
 * @example
 * ```typescript
 * const count = await preloadCacheData([
 *   { key: 'net:1', value: { ...networkData }, ttl: 3600 },
 *   { key: 'net:2', value: { ...networkData }, ttl: 3600 }
 * ], cache, 50);
 * ```
 */
export declare const preloadCacheData: (data: Array<{
    key: string;
    value: any;
    ttl: number;
}>, cache: CacheStrategy, batchSize: number) => Promise<number>;
/**
 * Schedules periodic cache warmup.
 *
 * @param {CacheWarmupConfig} config - Warmup configuration
 * @param {CacheStrategy} cache - Cache instance
 * @param {number} intervalMs - Warmup interval in milliseconds
 * @returns {NodeJS.Timeout} Interval handle
 *
 * @example
 * ```typescript
 * const interval = scheduleWarmup(warmupConfig, cache, 3600000); // Every hour
 * // Later: clearInterval(interval);
 * ```
 */
export declare const scheduleWarmup: (config: CacheWarmupConfig, cache: CacheStrategy, intervalMs: number) => NodeJS.Timeout;
/**
 * Prioritizes cache warmup based on access patterns.
 *
 * @param {any} CacheModel - Cache model
 * @param {number} topN - Number of top entries to prioritize
 * @returns {Promise<string[]>} Prioritized cache keys
 *
 * @example
 * ```typescript
 * const priorityKeys = await prioritizeWarmup(CacheModel, 100);
 * // Warm these keys first
 * ```
 */
export declare const prioritizeWarmup: (CacheModel: any, topN: number) => Promise<string[]>;
/**
 * Validates cache warmup data before loading.
 *
 * @param {any} data - Data to validate
 * @param {any} schema - Validation schema
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const result = validateWarmupData(warmupData, {
 *   key: { type: 'string', required: true },
 *   value: { type: 'object', required: true }
 * });
 * ```
 */
export declare const validateWarmupData: (data: any, schema: any) => {
    valid: boolean;
    errors: string[];
};
/**
 * Retrieves comprehensive cache statistics.
 *
 * @param {any} CacheModel - Cache model
 * @param {any} StatsModel - Statistics model
 * @returns {Promise<CacheStatistics>} Cache statistics
 *
 * @example
 * ```typescript
 * const stats = await getCacheStats(CacheModel, StatsModel);
 * console.log('Hit ratio:', stats.hitRatio);
 * console.log('Total size:', stats.size);
 * ```
 */
export declare const getCacheStats: (CacheModel: any, StatsModel: any) => Promise<CacheStatistics>;
/**
 * Records cache hit event.
 *
 * @param {any} StatsModel - Statistics model
 * @param {number} responseTime - Response time in ms
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await recordCacheHit(StatsModel, 2.5);
 * ```
 */
export declare const recordCacheHit: (StatsModel: any, responseTime: number) => Promise<void>;
/**
 * Records cache miss event.
 *
 * @param {any} StatsModel - Statistics model
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await recordCacheMiss(StatsModel);
 * ```
 */
export declare const recordCacheMiss: (StatsModel: any) => Promise<void>;
/**
 * Calculates cache hit ratio over time period.
 *
 * @param {any} StatsModel - Statistics model
 * @param {string} period - Time period (hourly, daily, weekly)
 * @param {number} limit - Number of periods to analyze
 * @returns {Promise<number>} Average hit ratio
 *
 * @example
 * ```typescript
 * const ratio = await calculateHitRatio(StatsModel, 'daily', 7);
 * console.log('7-day average hit ratio:', ratio);
 * ```
 */
export declare const calculateHitRatio: (StatsModel: any, period: string, limit: number) => Promise<number>;
/**
 * Retrieves detailed cache metrics and analytics.
 *
 * @param {any} CacheModel - Cache model
 * @param {any} StatsModel - Statistics model
 * @returns {Promise<any>} Detailed metrics
 *
 * @example
 * ```typescript
 * const metrics = await getCacheMetrics(CacheModel, StatsModel);
 * console.log('Metrics:', metrics);
 * ```
 */
export declare const getCacheMetrics: (CacheModel: any, StatsModel: any) => Promise<any>;
/**
 * Compresses cache entry value.
 *
 * @param {any} value - Value to compress
 * @param {CompressionConfig} config - Compression configuration
 * @returns {Promise<{ compressed: Buffer; originalSize: number; compressedSize: number }>} Compression result
 *
 * @example
 * ```typescript
 * const result = await compressCacheEntry(largeData, {
 *   enabled: true,
 *   minSize: 1024,
 *   algorithm: 'gzip',
 *   level: 6
 * });
 * ```
 */
export declare const compressCacheEntry: (value: any, config: CompressionConfig) => Promise<{
    compressed: Buffer;
    originalSize: number;
    compressedSize: number;
}>;
/**
 * Decompresses cache entry value.
 *
 * @param {Buffer} compressed - Compressed data
 * @param {boolean} isCompressed - Whether data is compressed
 * @returns {Promise<any>} Decompressed value
 *
 * @example
 * ```typescript
 * const value = await decompressCacheEntry(compressedBuffer, true);
 * ```
 */
export declare const decompressCacheEntry: (compressed: Buffer, isCompressed: boolean) => Promise<any>;
/**
 * Calculates compression ratio for cache entries.
 *
 * @param {any} CacheModel - Cache model
 * @returns {Promise<number>} Average compression ratio
 *
 * @example
 * ```typescript
 * const ratio = await getCompressionRatio(CacheModel);
 * console.log('Compression ratio:', ratio);
 * ```
 */
export declare const getCompressionRatio: (CacheModel: any) => Promise<number>;
/**
 * Configures compression settings for cache.
 *
 * @param {Partial<CompressionConfig>} config - Compression configuration
 * @returns {CompressionConfig} Complete configuration
 *
 * @example
 * ```typescript
 * const config = configureCompression({
 *   enabled: true,
 *   minSize: 2048,
 *   algorithm: 'gzip'
 * });
 * ```
 */
export declare const configureCompression: (config: Partial<CompressionConfig>) => CompressionConfig;
/**
 * Partitions cache based on key distribution.
 *
 * @param {CachePartitionConfig} config - Partition configuration
 * @param {any} PartitionModel - Partition model
 * @returns {Promise<CachePartition[]>} Created partitions
 *
 * @example
 * ```typescript
 * const partitions = await partitionCache({
 *   partitionCount: 16,
 *   strategy: 'hash',
 *   replicationFactor: 2
 * }, PartitionModel);
 * ```
 */
export declare const partitionCache: (config: CachePartitionConfig, PartitionModel: any) => Promise<CachePartition[]>;
/**
 * Retrieves partition strategy configuration.
 *
 * @param {string} strategy - Strategy type (hash, range, list)
 * @returns {any} Strategy configuration
 *
 * @example
 * ```typescript
 * const strategy = getPartitionStrategy('hash');
 * ```
 */
export declare const getPartitionStrategy: (strategy: string) => any;
/**
 * Redistributes cache entries across partitions.
 *
 * @param {any} PartitionModel - Partition model
 * @param {any} CacheModel - Cache model
 * @returns {Promise<number>} Number of redistributed entries
 *
 * @example
 * ```typescript
 * const count = await redistributePartitions(PartitionModel, CacheModel);
 * ```
 */
export declare const redistributePartitions: (PartitionModel: any, CacheModel: any) => Promise<number>;
/**
 * Merges multiple cache partitions into one.
 *
 * @param {string[]} partitionIds - Partition IDs to merge
 * @param {any} PartitionModel - Partition model
 * @returns {Promise<CachePartition>} Merged partition
 *
 * @example
 * ```typescript
 * const merged = await mergePartitions(['part-0', 'part-1'], PartitionModel);
 * ```
 */
export declare const mergePartitions: (partitionIds: string[], PartitionModel: any) => Promise<CachePartition>;
/**
 * Creates cache eviction policy.
 *
 * @param {EvictionPolicy} policy - Eviction policy configuration
 * @returns {any} Eviction policy handler
 *
 * @example
 * ```typescript
 * const policy = createEvictionPolicy({
 *   strategy: 'lru',
 *   maxSize: 104857600, // 100MB
 *   maxEntries: 10000
 * });
 * ```
 */
export declare const createEvictionPolicy: (policy: EvictionPolicy) => any;
/**
 * Evicts least recently used entry.
 *
 * @param {CacheEntry[]} entries - Cache entries
 * @returns {CacheEntry | null} Entry to evict
 *
 * @example
 * ```typescript
 * const victim = evictLRU(cacheEntries);
 * if (victim) {
 *   cache.delete(victim.key);
 * }
 * ```
 */
export declare const evictLRU: (entries: CacheEntry[]) => CacheEntry | null;
/**
 * Evicts least frequently used entry.
 *
 * @param {CacheEntry[]} entries - Cache entries
 * @returns {CacheEntry | null} Entry to evict
 *
 * @example
 * ```typescript
 * const victim = evictLFU(cacheEntries);
 * ```
 */
export declare const evictLFU: (entries: CacheEntry[]) => CacheEntry | null;
/**
 * Evicts entry closest to expiration (TTL-based).
 *
 * @param {CacheEntry[]} entries - Cache entries
 * @returns {CacheEntry | null} Entry to evict
 *
 * @example
 * ```typescript
 * const victim = evictByTTL(cacheEntries);
 * ```
 */
export declare const evictByTTL: (entries: CacheEntry[]) => CacheEntry | null;
declare const _default: {
    createNetworkCacheModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            cacheKey: string;
            value: any;
            ttl: number;
            expiresAt: Date;
            compressed: boolean;
            size: number;
            accessCount: number;
            lastAccessedAt: Date | null;
            tags: string[];
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createCacheStatisticsModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            period: string;
            hits: number;
            misses: number;
            evictions: number;
            totalSize: number;
            totalEntries: number;
            avgResponseTime: number;
            hitRatio: number;
            metadata: Record<string, any>;
            readonly createdAt: Date;
        };
    };
    createCachePartitionModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            partitionId: string;
            rangeStart: string;
            rangeEnd: string;
            nodes: string[];
            entryCount: number;
            totalSize: number;
            status: string;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createCacheStrategy: (strategyType: string, maxEntries: number) => CacheStrategy;
    getLRUCache: (maxEntries: number) => CacheStrategy;
    getLFUCache: (maxEntries: number) => CacheStrategy;
    getFIFOCache: (maxEntries: number) => CacheStrategy;
    getAdaptiveCache: (maxEntries: number) => CacheStrategy;
    invalidateCache: (cache: CacheStrategy, key: string) => boolean;
    invalidateByPattern: (CacheModel: any, pattern: string) => Promise<number>;
    invalidateByTag: (CacheModel: any, tag: string) => Promise<number>;
    invalidateExpired: (CacheModel: any) => Promise<number>;
    cascadeInvalidate: (CacheModel: any, key: string, relatedPatterns: string[]) => Promise<number>;
    createDistributedCache: (config: DistributedCacheConfig) => any;
    syncCacheNodes: (key: string, value: any, nodes: string[]) => Promise<{
        success: number;
        failed: number;
    }>;
    handleCachePartition: (partitionId: string, action: string, PartitionModel: any) => Promise<CachePartition[]>;
    rebalanceCache: (PartitionModel: any, nodes: string[]) => Promise<number>;
    getCacheTopology: (PartitionModel: any) => Promise<any>;
    warmCache: (config: CacheWarmupConfig, cache: CacheStrategy) => Promise<{
        loaded: number;
        failed: number;
    }>;
    preloadCacheData: (data: Array<{
        key: string;
        value: any;
        ttl: number;
    }>, cache: CacheStrategy, batchSize: number) => Promise<number>;
    scheduleWarmup: (config: CacheWarmupConfig, cache: CacheStrategy, intervalMs: number) => NodeJS.Timeout;
    prioritizeWarmup: (CacheModel: any, topN: number) => Promise<string[]>;
    validateWarmupData: (data: any, schema: any) => {
        valid: boolean;
        errors: string[];
    };
    getCacheStats: (CacheModel: any, StatsModel: any) => Promise<CacheStatistics>;
    recordCacheHit: (StatsModel: any, responseTime: number) => Promise<void>;
    recordCacheMiss: (StatsModel: any) => Promise<void>;
    calculateHitRatio: (StatsModel: any, period: string, limit: number) => Promise<number>;
    getCacheMetrics: (CacheModel: any, StatsModel: any) => Promise<any>;
    compressCacheEntry: (value: any, config: CompressionConfig) => Promise<{
        compressed: Buffer;
        originalSize: number;
        compressedSize: number;
    }>;
    decompressCacheEntry: (compressed: Buffer, isCompressed: boolean) => Promise<any>;
    getCompressionRatio: (CacheModel: any) => Promise<number>;
    configureCompression: (config: Partial<CompressionConfig>) => CompressionConfig;
    partitionCache: (config: CachePartitionConfig, PartitionModel: any) => Promise<CachePartition[]>;
    getPartitionStrategy: (strategy: string) => any;
    redistributePartitions: (PartitionModel: any, CacheModel: any) => Promise<number>;
    mergePartitions: (partitionIds: string[], PartitionModel: any) => Promise<CachePartition>;
    createEvictionPolicy: (policy: EvictionPolicy) => any;
    evictLRU: (entries: CacheEntry[]) => CacheEntry | null;
    evictLFU: (entries: CacheEntry[]) => CacheEntry | null;
    evictByTTL: (entries: CacheEntry[]) => CacheEntry | null;
};
export default _default;
//# sourceMappingURL=network-caching-kit.d.ts.map