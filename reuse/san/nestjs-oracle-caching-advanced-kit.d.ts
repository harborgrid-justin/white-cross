/**
 * LOC: C7A8H9E0X1
 * File: /reuse/san/nestjs-oracle-caching-advanced-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v11.1.8)
 *   - @nestjs/cache-manager (v2.2.2)
 *   - cache-manager (v5.7.6)
 *   - ioredis (v5.4.1)
 *   - lru-cache (v10.4.3)
 *   - node-cache (v5.1.2)
 *   - zlib (Node.js built-in)
 *   - crypto (Node.js built-in)
 *
 * DOWNSTREAM (imported by):
 *   - Multi-tier caching services
 *   - Distributed cache coordinators
 *   - Cache coherence managers
 *   - Cache partitioning handlers
 *   - Performance optimization services
 */
/**
 * Cache tier levels for multi-tier caching
 */
export declare enum CacheTier {
    L1 = "L1",// In-memory, fastest
    L2 = "L2",// Local Redis, fast
    L3 = "L3"
}
/**
 * Cache eviction policies
 */
export declare enum EvictionPolicy {
    LRU = "LRU",// Least Recently Used
    LFU = "LFU",// Least Frequently Used
    FIFO = "FIFO",// First In First Out
    ARC = "ARC",// Adaptive Replacement Cache
    RANDOM = "RANDOM"
}
/**
 * Cache coherence protocol states (MESI)
 */
export declare enum CacheCoherenceState {
    MODIFIED = "M",// Cache line modified, only copy
    EXCLUSIVE = "E",// Cache line exclusive, clean
    SHARED = "S",// Cache line shared, clean
    INVALID = "I"
}
/**
 * Cache write strategies
 */
export declare enum CacheWriteStrategy {
    WRITE_THROUGH = "WRITE_THROUGH",// Write to cache and backend simultaneously
    WRITE_BEHIND = "WRITE_BEHIND",// Write to cache, async write to backend
    WRITE_AROUND = "WRITE_AROUND"
}
/**
 * Cache read strategies
 */
export declare enum CacheReadStrategy {
    READ_THROUGH = "READ_THROUGH",// Read from cache, fetch from backend on miss
    READ_ASIDE = "READ_ASIDE"
}
/**
 * Cache entry metadata
 */
export interface CacheEntryMetadata {
    key: string;
    tier: CacheTier;
    coherenceState: CacheCoherenceState;
    size: number;
    compressed: boolean;
    encrypted: boolean;
    createdAt: Date;
    lastAccessedAt: Date;
    accessCount: number;
    ttl: number;
    tags: string[];
    version: number;
}
/**
 * Multi-tier cache configuration
 */
export interface MultiTierCacheConfig {
    l1?: {
        enabled: boolean;
        maxSize: number;
        ttl: number;
        evictionPolicy: EvictionPolicy;
    };
    l2?: {
        enabled: boolean;
        host: string;
        port: number;
        ttl: number;
    };
    l3?: {
        enabled: boolean;
        cluster: string[];
        ttl: number;
    };
    coherenceEnabled: boolean;
    compressionThreshold: number;
    encryptionEnabled: boolean;
}
/**
 * Cache key generation strategy
 */
export interface CacheKeyStrategy {
    prefix?: string;
    separator?: string;
    includeVersion?: boolean;
    includeNamespace?: boolean;
    hashLongKeys?: boolean;
    maxLength?: number;
}
/**
 * Cache statistics
 */
export interface CacheStatistics {
    hits: number;
    misses: number;
    hitRate: number;
    evictions: number;
    size: number;
    maxSize: number;
    memoryUsage: number;
    avgAccessTime: number;
    l1Stats?: TierStatistics;
    l2Stats?: TierStatistics;
    l3Stats?: TierStatistics;
}
/**
 * Individual tier statistics
 */
export interface TierStatistics {
    tier: CacheTier;
    hits: number;
    misses: number;
    size: number;
    evictions: number;
    memoryUsage: number;
}
/**
 * Cache warming configuration
 */
export interface CacheWarmingConfig {
    enabled: boolean;
    strategy: 'eager' | 'lazy' | 'scheduled';
    batchSize: number;
    concurrency: number;
    schedule?: string;
    keys?: string[];
    queryFunction?: () => Promise<any[]>;
}
/**
 * Distributed lock configuration
 */
export interface DistributedLockConfig {
    key: string;
    ttl: number;
    retryCount: number;
    retryDelay: number;
    lockTimeout: number;
}
/**
 * Cache partition configuration
 */
export interface CachePartitionConfig {
    partitionCount: number;
    partitionStrategy: 'hash' | 'range' | 'consistent-hash';
    replicationFactor: number;
}
/**
 * Cache compression options
 */
export interface CompressionOptions {
    enabled: boolean;
    threshold: number;
    level: number;
    algorithm: 'gzip' | 'deflate' | 'brotli';
}
/**
 * Conditional caching predicate
 */
export interface CachePredicate<T = any> {
    shouldCache: (value: T, key: string) => boolean | Promise<boolean>;
    shouldInvalidate?: (value: T, key: string) => boolean | Promise<boolean>;
}
/**
 * Near cache configuration
 */
export interface NearCacheConfig {
    enabled: boolean;
    maxSize: number;
    ttl: number;
    invalidateOnUpdate: boolean;
    preload: boolean;
}
/**
 * Cache invalidation event
 */
export interface CacheInvalidationEvent {
    keys: string[];
    tags?: string[];
    pattern?: string;
    tier?: CacheTier;
    timestamp: Date;
    reason: string;
}
/**
 * Serialization options
 */
export interface SerializationOptions {
    serializer: 'json' | 'msgpack' | 'protobuf' | 'avro';
    compressAfterSerialize: boolean;
    encryptAfterSerialize: boolean;
}
/**
 * Creates a multi-tier cache configuration for L1/L2/L3 caching.
 *
 * @param {Partial<MultiTierCacheConfig>} config - Cache configuration
 * @returns {MultiTierCacheConfig} Complete multi-tier cache config
 *
 * @example
 * ```typescript
 * const cacheConfig = createMultiTierCacheConfig({
 *   l1: { enabled: true, maxSize: 1000, ttl: 60, evictionPolicy: EvictionPolicy.LRU },
 *   l2: { enabled: true, host: 'localhost', port: 6379, ttl: 300 },
 *   l3: { enabled: true, cluster: ['redis1:6379', 'redis2:6379'], ttl: 3600 },
 *   coherenceEnabled: true
 * });
 * ```
 */
export declare function createMultiTierCacheConfig(config: Partial<MultiTierCacheConfig>): MultiTierCacheConfig;
/**
 * Determines appropriate cache tier for a given entry size and access pattern.
 *
 * @param {number} size - Entry size in bytes
 * @param {number} accessFrequency - Access frequency (accesses per second)
 * @param {MultiTierCacheConfig} config - Cache configuration
 * @returns {CacheTier} Recommended cache tier
 *
 * @example
 * ```typescript
 * const tier = determineCacheTier(2048, 100, cacheConfig);
 * // Returns CacheTier.L1 for hot data
 * ```
 */
export declare function determineCacheTier(size: number, accessFrequency: number, config: MultiTierCacheConfig): CacheTier;
/**
 * Promotes cache entry from lower tier to higher tier based on access patterns.
 *
 * @param {string} key - Cache key
 * @param {CacheTier} currentTier - Current tier
 * @param {CacheEntryMetadata} metadata - Entry metadata
 * @returns {CacheTier | null} Target tier for promotion, or null if no promotion needed
 *
 * @example
 * ```typescript
 * const newTier = promoteCacheEntry('patient:123', CacheTier.L3, metadata);
 * if (newTier) {
 *   await moveCacheEntry(key, currentTier, newTier);
 * }
 * ```
 */
export declare function promoteCacheEntry(key: string, currentTier: CacheTier, metadata: CacheEntryMetadata): CacheTier | null;
/**
 * Demotes cache entry from higher tier to lower tier to free up space.
 *
 * @param {string} key - Cache key
 * @param {CacheTier} currentTier - Current tier
 * @param {CacheEntryMetadata} metadata - Entry metadata
 * @returns {CacheTier | null} Target tier for demotion, or null if no demotion needed
 *
 * @example
 * ```typescript
 * const newTier = demoteCacheEntry('patient:456', CacheTier.L1, metadata);
 * if (newTier) {
 *   await moveCacheEntry(key, currentTier, newTier);
 * }
 * ```
 */
export declare function demoteCacheEntry(key: string, currentTier: CacheTier, metadata: CacheEntryMetadata): CacheTier | null;
/**
 * Generates consistent hash for cache key to determine partition assignment.
 *
 * @param {string} key - Cache key
 * @param {number} partitionCount - Number of partitions
 * @returns {number} Partition index (0 to partitionCount-1)
 *
 * @example
 * ```typescript
 * const partition = getConsistentHashPartition('patient:123', 16);
 * // Returns: 7 (consistent across calls)
 * ```
 */
export declare function getConsistentHashPartition(key: string, partitionCount: number): number;
/**
 * Creates virtual nodes for consistent hashing to improve distribution.
 *
 * @param {string} nodeId - Node identifier
 * @param {number} virtualNodeCount - Number of virtual nodes per physical node
 * @returns {string[]} Array of virtual node identifiers
 *
 * @example
 * ```typescript
 * const vnodes = createVirtualNodes('cache-node-1', 150);
 * // Returns: ['cache-node-1#0', 'cache-node-1#1', ..., 'cache-node-1#149']
 * ```
 */
export declare function createVirtualNodes(nodeId: string, virtualNodeCount: number): string[];
/**
 * Determines target cache nodes for a given key using consistent hashing.
 *
 * @param {string} key - Cache key
 * @param {string[]} nodes - Available cache nodes
 * @param {number} replicationFactor - Number of replicas
 * @returns {string[]} Target nodes for the key
 *
 * @example
 * ```typescript
 * const nodes = ['redis1', 'redis2', 'redis3', 'redis4'];
 * const targets = getTargetNodes('patient:123', nodes, 2);
 * // Returns: ['redis2', 'redis3'] - primary and replica
 * ```
 */
export declare function getTargetNodes(key: string, nodes: string[], replicationFactor: number): string[];
/**
 * Coordinates distributed cache invalidation across cluster nodes.
 *
 * @param {string[]} keys - Keys to invalidate
 * @param {string[]} nodes - Cluster nodes
 * @returns {Promise<CacheInvalidationEvent>} Invalidation event details
 *
 * @example
 * ```typescript
 * await coordinateInvalidation(
 *   ['patient:123', 'patient:456'],
 *   ['redis1:6379', 'redis2:6379', 'redis3:6379']
 * );
 * ```
 */
export declare function coordinateInvalidation(keys: string[], nodes: string[]): Promise<CacheInvalidationEvent>;
/**
 * Synchronizes cache state across distributed nodes using pub/sub.
 *
 * @param {string} channel - Pub/sub channel name
 * @param {CacheInvalidationEvent} event - Invalidation event
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await synchronizeCacheState('cache:invalidation', {
 *   keys: ['patient:123'],
 *   timestamp: new Date(),
 *   reason: 'update'
 * });
 * ```
 */
export declare function synchronizeCacheState(channel: string, event: CacheInvalidationEvent): Promise<void>;
/**
 * Updates cache coherence state using MESI protocol.
 *
 * @param {string} key - Cache key
 * @param {CacheCoherenceState} currentState - Current coherence state
 * @param {'read' | 'write' | 'invalidate'} operation - Operation type
 * @returns {CacheCoherenceState} New coherence state
 *
 * @example
 * ```typescript
 * const newState = updateCoherenceState(
 *   'patient:123',
 *   CacheCoherenceState.EXCLUSIVE,
 *   'write'
 * );
 * // Returns: CacheCoherenceState.MODIFIED
 * ```
 */
export declare function updateCoherenceState(key: string, currentState: CacheCoherenceState, operation: 'read' | 'write' | 'invalidate'): CacheCoherenceState;
/**
 * Implements write-invalidate protocol for cache coherence.
 *
 * @param {string} key - Cache key
 * @param {string[]} nodes - All cache nodes
 * @param {string} sourceNode - Node performing the write
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await writeInvalidateProtocol(
 *   'patient:123',
 *   ['node1', 'node2', 'node3'],
 *   'node1'
 * );
 * ```
 */
export declare function writeInvalidateProtocol(key: string, nodes: string[], sourceNode: string): Promise<void>;
/**
 * Implements snooping protocol for cache coherence monitoring.
 *
 * @param {string} key - Cache key to snoop
 * @param {string} node - Node performing snooping
 * @returns {Promise<CacheCoherenceState>} Current coherence state
 *
 * @example
 * ```typescript
 * const state = await snoopCacheCoherence('patient:123', 'node1');
 * if (state === CacheCoherenceState.INVALID) {
 *   await refreshCache(key);
 * }
 * ```
 */
export declare function snoopCacheCoherence(key: string, node: string): Promise<CacheCoherenceState>;
/**
 * Validates cache coherence across distributed nodes.
 *
 * @param {string} key - Cache key
 * @param {string[]} nodes - Nodes to validate
 * @returns {Promise<boolean>} True if coherent, false otherwise
 *
 * @example
 * ```typescript
 * const isCoherent = await validateCacheCoherence('patient:123', allNodes);
 * if (!isCoherent) {
 *   await repairCacheCoherence(key);
 * }
 * ```
 */
export declare function validateCacheCoherence(key: string, nodes: string[]): Promise<boolean>;
/**
 * Creates cache partition configuration for horizontal scaling.
 *
 * @param {number} partitionCount - Number of partitions
 * @param {CachePartitionConfig['partitionStrategy']} strategy - Partitioning strategy
 * @param {number} replicationFactor - Replication factor
 * @returns {CachePartitionConfig} Partition configuration
 *
 * @example
 * ```typescript
 * const partitionConfig = createPartitionConfig(16, 'consistent-hash', 2);
 * ```
 */
export declare function createPartitionConfig(partitionCount: number, strategy: CachePartitionConfig['partitionStrategy'], replicationFactor: number): CachePartitionConfig;
/**
 * Determines partition for a key using range-based partitioning.
 *
 * @param {string} key - Cache key
 * @param {number} partitionCount - Number of partitions
 * @param {string[]} rangeKeys - Sorted range boundary keys
 * @returns {number} Partition index
 *
 * @example
 * ```typescript
 * const partition = getRangeBasedPartition(
 *   'patient:m123',
 *   4,
 *   ['patient:a', 'patient:g', 'patient:m', 'patient:s']
 * );
 * // Returns: 2
 * ```
 */
export declare function getRangeBasedPartition(key: string, partitionCount: number, rangeKeys: string[]): number;
/**
 * Rebalances cache partitions when nodes are added or removed.
 *
 * @param {string[]} oldNodes - Previous node list
 * @param {string[]} newNodes - Updated node list
 * @param {CachePartitionConfig} config - Partition configuration
 * @returns {Map<string, string>} Key migration map (key -> new node)
 *
 * @example
 * ```typescript
 * const migrationMap = rebalancePartitions(
 *   ['node1', 'node2'],
 *   ['node1', 'node2', 'node3'],
 *   partitionConfig
 * );
 * ```
 */
export declare function rebalancePartitions(oldNodes: string[], newNodes: string[], config: CachePartitionConfig): Map<string, string>;
/**
 * Calculates shard affinity for a key based on application context.
 *
 * @param {string} key - Cache key
 * @param {string} context - Application context (e.g., tenant ID, region)
 * @param {number} shardCount - Number of shards
 * @returns {number} Shard index
 *
 * @example
 * ```typescript
 * const shard = calculateShardAffinity('patient:123', 'tenant:org1', 8);
 * // Ensures all org1 data goes to same shard for locality
 * ```
 */
export declare function calculateShardAffinity(key: string, context: string, shardCount: number): number;
/**
 * Creates near cache configuration for local caching of remote data.
 *
 * @param {Partial<NearCacheConfig>} options - Near cache options
 * @returns {NearCacheConfig} Complete near cache configuration
 *
 * @example
 * ```typescript
 * const nearCache = createNearCacheConfig({
 *   enabled: true,
 *   maxSize: 500,
 *   ttl: 30,
 *   invalidateOnUpdate: true
 * });
 * ```
 */
export declare function createNearCacheConfig(options: Partial<NearCacheConfig>): NearCacheConfig;
/**
 * Determines if entry should be cached in near cache based on access patterns.
 *
 * @param {string} key - Cache key
 * @param {CacheEntryMetadata} metadata - Entry metadata
 * @param {NearCacheConfig} config - Near cache configuration
 * @returns {boolean} True if should be near-cached
 *
 * @example
 * ```typescript
 * if (shouldNearCache('patient:123', metadata, nearCacheConfig)) {
 *   await populateNearCache(key, value);
 * }
 * ```
 */
export declare function shouldNearCache(key: string, metadata: CacheEntryMetadata, config: NearCacheConfig): boolean;
/**
 * Invalidates near cache entries when remote cache is updated.
 *
 * @param {string[]} keys - Keys to invalidate in near cache
 * @param {NearCacheConfig} config - Near cache configuration
 * @returns {Promise<number>} Number of entries invalidated
 *
 * @example
 * ```typescript
 * const invalidated = await invalidateNearCache(['patient:123', 'patient:456'], config);
 * // Returns: 2
 * ```
 */
export declare function invalidateNearCache(keys: string[], config: NearCacheConfig): Promise<number>;
/**
 * Preloads frequently accessed data into near cache on startup.
 *
 * @param {() => Promise<Array<{ key: string; value: any }>>} loader - Data loader function
 * @param {NearCacheConfig} config - Near cache configuration
 * @returns {Promise<number>} Number of entries preloaded
 *
 * @example
 * ```typescript
 * const loaded = await preloadNearCache(
 *   async () => await frequentlyAccessedKeys(),
 *   nearCacheConfig
 * );
 * ```
 */
export declare function preloadNearCache(loader: () => Promise<Array<{
    key: string;
    value: any;
}>>, config: NearCacheConfig): Promise<number>;
/**
 * Implements write-through caching pattern with synchronous backend updates.
 *
 * @template T - Data type
 * @param {string} key - Cache key
 * @param {T} value - Value to cache and persist
 * @param {(key: string, value: T) => Promise<void>} backendWriter - Backend write function
 * @param {number} ttl - Time to live in seconds
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await writeThroughCache(
 *   'patient:123',
 *   patientData,
 *   async (key, data) => await db.save(data),
 *   300
 * );
 * ```
 */
export declare function writeThroughCache<T>(key: string, value: T, backendWriter: (key: string, value: T) => Promise<void>, ttl: number): Promise<void>;
/**
 * Implements write-behind caching pattern with asynchronous backend updates.
 *
 * @template T - Data type
 * @param {string} key - Cache key
 * @param {T} value - Value to cache
 * @param {(key: string, value: T) => Promise<void>} backendWriter - Backend write function
 * @param {number} ttl - Time to live in seconds
 * @param {number} flushDelay - Delay before backend write (ms)
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await writeBehindCache(
 *   'patient:123',
 *   patientData,
 *   async (key, data) => await db.save(data),
 *   300,
 *   5000
 * );
 * ```
 */
export declare function writeBehindCache<T>(key: string, value: T, backendWriter: (key: string, value: T) => Promise<void>, ttl: number, flushDelay?: number): Promise<void>;
/**
 * Flushes pending write-behind cache entries to backend storage.
 *
 * @param {Map<string, any>} pendingWrites - Pending write buffer
 * @param {(entries: Array<{ key: string; value: any }>) => Promise<void>} batchWriter - Batch write function
 * @returns {Promise<number>} Number of entries flushed
 *
 * @example
 * ```typescript
 * const flushed = await flushWriteBehindBuffer(
 *   pendingWrites,
 *   async (entries) => await db.batchSave(entries)
 * );
 * ```
 */
export declare function flushWriteBehindBuffer(pendingWrites: Map<string, any>, batchWriter: (entries: Array<{
    key: string;
    value: any;
}>) => Promise<void>): Promise<number>;
/**
 * Implements write-around caching pattern (bypass cache on writes).
 *
 * @template T - Data type
 * @param {string} key - Cache key
 * @param {T} value - Value to persist
 * @param {(key: string, value: T) => Promise<void>} backendWriter - Backend write function
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await writeAroundCache(
 *   'patient:123',
 *   patientData,
 *   async (key, data) => await db.save(data)
 * );
 * // Cache is invalidated, next read will fetch fresh data
 * ```
 */
export declare function writeAroundCache<T>(key: string, value: T, backendWriter: (key: string, value: T) => Promise<void>): Promise<void>;
/**
 * Implements LRU (Least Recently Used) eviction policy.
 *
 * @param {Map<string, CacheEntryMetadata>} cache - Cache metadata map
 * @param {number} maxSize - Maximum cache size
 * @returns {string[]} Keys to evict
 *
 * @example
 * ```typescript
 * const toEvict = evictLRU(cacheMetadata, 1000);
 * for (const key of toEvict) {
 *   await cache.del(key);
 * }
 * ```
 */
export declare function evictLRU(cache: Map<string, CacheEntryMetadata>, maxSize: number): string[];
/**
 * Implements LFU (Least Frequently Used) eviction policy.
 *
 * @param {Map<string, CacheEntryMetadata>} cache - Cache metadata map
 * @param {number} maxSize - Maximum cache size
 * @returns {string[]} Keys to evict
 *
 * @example
 * ```typescript
 * const toEvict = evictLFU(cacheMetadata, 1000);
 * ```
 */
export declare function evictLFU(cache: Map<string, CacheEntryMetadata>, maxSize: number): string[];
/**
 * Implements FIFO (First In First Out) eviction policy.
 *
 * @param {Map<string, CacheEntryMetadata>} cache - Cache metadata map
 * @param {number} maxSize - Maximum cache size
 * @returns {string[]} Keys to evict
 *
 * @example
 * ```typescript
 * const toEvict = evictFIFO(cacheMetadata, 1000);
 * ```
 */
export declare function evictFIFO(cache: Map<string, CacheEntryMetadata>, maxSize: number): string[];
/**
 * Implements ARC (Adaptive Replacement Cache) eviction policy.
 *
 * @param {Map<string, CacheEntryMetadata>} cache - Cache metadata map
 * @param {number} maxSize - Maximum cache size
 * @param {number} p - Target size for recent cache (adaptive parameter)
 * @returns {{ toEvict: string[]; newP: number }} Keys to evict and updated p value
 *
 * @example
 * ```typescript
 * const { toEvict, newP } = evictARC(cacheMetadata, 1000, 500);
 * ```
 */
export declare function evictARC(cache: Map<string, CacheEntryMetadata>, maxSize: number, p: number): {
    toEvict: string[];
    newP: number;
};
/**
 * Implements random eviction policy for testing or low-overhead scenarios.
 *
 * @param {Map<string, CacheEntryMetadata>} cache - Cache metadata map
 * @param {number} maxSize - Maximum cache size
 * @returns {string[]} Keys to evict
 *
 * @example
 * ```typescript
 * const toEvict = evictRandom(cacheMetadata, 1000);
 * ```
 */
export declare function evictRandom(cache: Map<string, CacheEntryMetadata>, maxSize: number): string[];
/**
 * Warms cache eagerly by preloading all specified keys.
 *
 * @param {string[]} keys - Keys to preload
 * @param {(key: string) => Promise<any>} loader - Data loader function
 * @param {number} concurrency - Number of concurrent loads
 * @returns {Promise<number>} Number of keys successfully warmed
 *
 * @example
 * ```typescript
 * const warmed = await warmCacheEager(
 *   ['patient:123', 'patient:456', 'patient:789'],
 *   async (key) => await db.findByKey(key),
 *   5
 * );
 * ```
 */
export declare function warmCacheEager(keys: string[], loader: (key: string) => Promise<any>, concurrency?: number): Promise<number>;
/**
 * Warms cache lazily by tracking access patterns and preloading on-demand.
 *
 * @param {string} key - Key being accessed
 * @param {Map<string, number>} accessLog - Access frequency log
 * @param {(key: string) => Promise<any>} loader - Data loader function
 * @param {number} threshold - Access threshold for warming
 * @returns {Promise<boolean>} True if warmed, false otherwise
 *
 * @example
 * ```typescript
 * const warmed = await warmCacheLazy(
 *   'patient:123',
 *   accessLog,
 *   async (key) => await db.findByKey(key),
 *   3
 * );
 * ```
 */
export declare function warmCacheLazy(key: string, accessLog: Map<string, number>, loader: (key: string) => Promise<any>, threshold?: number): Promise<boolean>;
/**
 * Schedules periodic cache warming based on cron expression.
 *
 * @param {CacheWarmingConfig} config - Cache warming configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await scheduleCacheWarming({
 *   enabled: true,
 *   strategy: 'scheduled',
 *   batchSize: 100,
 *   concurrency: 10,
 *   schedule: '0 2 * * *', // Daily at 2 AM
 *   queryFunction: async () => await db.getFrequentlyAccessed()
 * });
 * ```
 */
export declare function scheduleCacheWarming(config: CacheWarmingConfig): Promise<void>;
/**
 * Calculates comprehensive cache statistics across all tiers.
 *
 * @param {Map<string, CacheEntryMetadata>} l1Cache - L1 cache metadata
 * @param {Map<string, CacheEntryMetadata>} l2Cache - L2 cache metadata
 * @param {Map<string, CacheEntryMetadata>} l3Cache - L3 cache metadata
 * @param {number} hits - Total cache hits
 * @param {number} misses - Total cache misses
 * @returns {CacheStatistics} Comprehensive cache statistics
 *
 * @example
 * ```typescript
 * const stats = calculateCacheStatistics(l1Meta, l2Meta, l3Meta, 1000, 200);
 * console.log(`Hit rate: ${stats.hitRate}%`);
 * ```
 */
export declare function calculateCacheStatistics(l1Cache: Map<string, CacheEntryMetadata>, l2Cache: Map<string, CacheEntryMetadata>, l3Cache: Map<string, CacheEntryMetadata>, hits: number, misses: number): CacheStatistics;
/**
 * Monitors cache performance metrics over time window.
 *
 * @param {CacheStatistics[]} snapshots - Statistics snapshots
 * @param {number} windowMs - Time window in milliseconds
 * @returns {object} Performance metrics
 *
 * @example
 * ```typescript
 * const metrics = monitorCachePerformance(statsSnapshots, 60000);
 * console.log(`Avg hit rate: ${metrics.avgHitRate}%`);
 * ```
 */
export declare function monitorCachePerformance(snapshots: CacheStatistics[], windowMs: number): {
    avgHitRate: number;
    maxSize: number;
    evictionRate: number;
    memoryGrowth: number;
};
/**
 * Detects cache anomalies and performance issues.
 *
 * @param {CacheStatistics} stats - Current cache statistics
 * @param {object} thresholds - Anomaly detection thresholds
 * @returns {string[]} List of detected issues
 *
 * @example
 * ```typescript
 * const issues = detectCacheAnomalies(stats, {
 *   minHitRate: 80,
 *   maxEvictionRate: 10,
 *   maxMemoryUsage: 1024 * 1024 * 1024
 * });
 * if (issues.length > 0) {
 *   logger.warn('Cache issues detected:', issues);
 * }
 * ```
 */
export declare function detectCacheAnomalies(stats: CacheStatistics, thresholds: {
    minHitRate?: number;
    maxEvictionRate?: number;
    maxMemoryUsage?: number;
}): string[];
/**
 * Creates a conditional cache predicate based on data size.
 *
 * @param {number} maxSize - Maximum size in bytes to cache
 * @returns {CachePredicate} Size-based cache predicate
 *
 * @example
 * ```typescript
 * const predicate = createSizePredicate(10 * 1024); // Cache only if < 10KB
 * if (await predicate.shouldCache(data, key)) {
 *   await cache.set(key, data);
 * }
 * ```
 */
export declare function createSizePredicate(maxSize: number): CachePredicate;
/**
 * Creates a conditional cache predicate based on data freshness.
 *
 * @param {number} maxAgeMs - Maximum data age in milliseconds
 * @returns {CachePredicate} Freshness-based cache predicate
 *
 * @example
 * ```typescript
 * const predicate = createFreshnessPredicate(5 * 60 * 1000); // 5 minutes
 * ```
 */
export declare function createFreshnessPredicate(maxAgeMs: number): CachePredicate;
/**
 * Creates a conditional cache predicate for HIPAA-compliant PHI data.
 *
 * @param {boolean} requireEncryption - Whether encryption is required
 * @returns {CachePredicate} HIPAA-compliant cache predicate
 *
 * @example
 * ```typescript
 * const predicate = createHIPAAPredicate(true);
 * if (await predicate.shouldCache(patientData, key)) {
 *   await encryptAndCache(key, patientData);
 * }
 * ```
 */
export declare function createHIPAAPredicate(requireEncryption: boolean): CachePredicate;
/**
 * Combines multiple cache predicates with AND logic.
 *
 * @param {CachePredicate[]} predicates - Array of predicates to combine
 * @returns {CachePredicate} Combined predicate
 *
 * @example
 * ```typescript
 * const combined = combinePredicates([
 *   createSizePredicate(10 * 1024),
 *   createFreshnessPredicate(5 * 60 * 1000),
 *   createHIPAAPredicate(true)
 * ]);
 * ```
 */
export declare function combinePredicates(predicates: CachePredicate[]): CachePredicate;
/**
 * Generates cache key using hierarchical namespace strategy.
 *
 * @param {string[]} segments - Key segments (namespace, resource, id, etc.)
 * @param {CacheKeyStrategy} strategy - Key generation strategy
 * @returns {string} Generated cache key
 *
 * @example
 * ```typescript
 * const key = generateCacheKey(
 *   ['patients', 'medical-records', '123', 'labs'],
 *   { prefix: 'wc', separator: ':', includeVersion: true }
 * );
 * // Returns: 'wc:v1:patients:medical-records:123:labs'
 * ```
 */
export declare function generateCacheKey(segments: string[], strategy?: CacheKeyStrategy): string;
/**
 * Generates content-based cache key using hash of data.
 *
 * @param {any} data - Data to hash
 * @param {string} prefix - Key prefix
 * @returns {string} Content-based cache key
 *
 * @example
 * ```typescript
 * const key = generateContentBasedKey({ query: 'SELECT * FROM patients' }, 'query');
 * // Returns: 'query:a3b4c5d6e7f8...'
 * ```
 */
export declare function generateContentBasedKey(data: any, prefix?: string): string;
/**
 * Generates time-based cache key with expiration bucket.
 *
 * @param {string} baseKey - Base key
 * @param {number} bucketSizeMs - Time bucket size in milliseconds
 * @returns {string} Time-bucketed cache key
 *
 * @example
 * ```typescript
 * const key = generateTimeBucketKey('stats', 60000);
 * // Returns: 'stats:bucket:1699459200000' (rounded to nearest minute)
 * ```
 */
export declare function generateTimeBucketKey(baseKey: string, bucketSizeMs: number): string;
/**
 * Generates tenant-aware cache key for multi-tenancy.
 *
 * @param {string} tenantId - Tenant identifier
 * @param {string} resource - Resource name
 * @param {string} id - Resource identifier
 * @returns {string} Tenant-scoped cache key
 *
 * @example
 * ```typescript
 * const key = generateTenantKey('org1', 'patients', '123');
 * // Returns: 'tenant:org1:patients:123'
 * ```
 */
export declare function generateTenantKey(tenantId: string, resource: string, id: string): string;
/**
 * Serializes data for cache storage with optimal encoding.
 *
 * @template T - Data type
 * @param {T} data - Data to serialize
 * @param {SerializationOptions} options - Serialization options
 * @returns {Promise<Buffer>} Serialized data buffer
 *
 * @example
 * ```typescript
 * const serialized = await serializeForCache(patientData, {
 *   serializer: 'json',
 *   compressAfterSerialize: true,
 *   encryptAfterSerialize: true
 * });
 * ```
 */
export declare function serializeForCache<T>(data: T, options: SerializationOptions): Promise<Buffer>;
/**
 * Deserializes data from cache storage.
 *
 * @template T - Expected data type
 * @param {Buffer} buffer - Serialized data buffer
 * @param {SerializationOptions} options - Serialization options
 * @returns {Promise<T>} Deserialized data
 *
 * @example
 * ```typescript
 * const data = await deserializeFromCache<Patient>(buffer, {
 *   serializer: 'json',
 *   compressAfterSerialize: true,
 *   encryptAfterSerialize: true
 * });
 * ```
 */
export declare function deserializeFromCache<T>(buffer: Buffer, options: SerializationOptions): Promise<T>;
/**
 * Encrypts buffer for secure cache storage (HIPAA compliance).
 *
 * @param {Buffer} data - Data to encrypt
 * @param {string} key - Encryption key
 * @returns {Buffer} Encrypted buffer
 *
 * @example
 * ```typescript
 * const encrypted = encryptBuffer(Buffer.from('sensitive PHI'), encryptionKey);
 * ```
 */
export declare function encryptBuffer(data: Buffer, key: string): Buffer;
/**
 * Decrypts buffer from secure cache storage.
 *
 * @param {Buffer} data - Encrypted data
 * @param {string} key - Encryption key
 * @returns {Buffer} Decrypted buffer
 *
 * @example
 * ```typescript
 * const decrypted = decryptBuffer(encryptedBuffer, encryptionKey);
 * ```
 */
export declare function decryptBuffer(data: Buffer, key: string): Buffer;
/**
 * Compresses data if it exceeds threshold size.
 *
 * @param {Buffer | string} data - Data to compress
 * @param {CompressionOptions} options - Compression options
 * @returns {Promise<{ data: Buffer; compressed: boolean }>} Compressed data and flag
 *
 * @example
 * ```typescript
 * const { data, compressed } = await compressIfNeeded(largeData, {
 *   enabled: true,
 *   threshold: 1024,
 *   level: 6,
 *   algorithm: 'gzip'
 * });
 * ```
 */
export declare function compressIfNeeded(data: Buffer | string, options: CompressionOptions): Promise<{
    data: Buffer;
    compressed: boolean;
}>;
/**
 * Decompresses compressed cache data.
 *
 * @param {Buffer} data - Compressed data
 * @param {boolean} isCompressed - Whether data is compressed
 * @returns {Promise<Buffer>} Decompressed data
 *
 * @example
 * ```typescript
 * const decompressed = await decompressIfNeeded(cachedData, metadata.compressed);
 * ```
 */
export declare function decompressIfNeeded(data: Buffer, isCompressed: boolean): Promise<Buffer>;
/**
 * Calculates compression ratio for cache analytics.
 *
 * @param {number} originalSize - Original data size in bytes
 * @param {number} compressedSize - Compressed data size in bytes
 * @returns {number} Compression ratio (e.g., 2.5 means 2.5x compression)
 *
 * @example
 * ```typescript
 * const ratio = calculateCompressionRatio(10240, 4096);
 * // Returns: 2.5 (60% size reduction)
 * ```
 */
export declare function calculateCompressionRatio(originalSize: number, compressedSize: number): number;
/**
 * Tags cache entries for grouped invalidation.
 *
 * @param {string} key - Cache key
 * @param {string[]} tags - Tags to associate with the key
 * @returns {Map<string, Set<string>>} Tag-to-keys mapping
 *
 * @example
 * ```typescript
 * const tagMap = tagCacheEntry('patient:123', ['patient', 'org1', 'medical']);
 * // Later: invalidateByTag('org1') invalidates all org1 entries
 * ```
 */
export declare function tagCacheEntry(key: string, tags: string[]): Map<string, Set<string>>;
/**
 * Invalidates all cache entries with a specific tag.
 *
 * @param {string} tag - Tag to invalidate
 * @param {Map<string, Set<string>>} tagMap - Tag-to-keys mapping
 * @returns {string[]} Keys that were invalidated
 *
 * @example
 * ```typescript
 * const invalidated = invalidateByTag('org1', tagMap);
 * for (const key of invalidated) {
 *   await cache.del(key);
 * }
 * ```
 */
export declare function invalidateByTag(tag: string, tagMap: Map<string, Set<string>>): string[];
/**
 * Invalidates cache entries matching a pattern.
 *
 * @param {string} pattern - Pattern to match (supports wildcards)
 * @param {string[]} allKeys - All cache keys
 * @returns {string[]} Matching keys to invalidate
 *
 * @example
 * ```typescript
 * const toInvalidate = invalidateByPattern('patient:*:labs', allCacheKeys);
 * // Invalidates: patient:123:labs, patient:456:labs, etc.
 * ```
 */
export declare function invalidateByPattern(pattern: string, allKeys: string[]): string[];
/**
 * Invalidates cache entries for a specific tenant (multi-tenancy).
 *
 * @param {string} tenantId - Tenant identifier
 * @param {string[]} allKeys - All cache keys
 * @returns {string[]} Tenant-specific keys to invalidate
 *
 * @example
 * ```typescript
 * const toInvalidate = invalidateByTenant('org1', allCacheKeys);
 * ```
 */
export declare function invalidateByTenant(tenantId: string, allKeys: string[]): string[];
/**
 * Acquires distributed lock for cache operations.
 *
 * @param {DistributedLockConfig} config - Lock configuration
 * @returns {Promise<string | null>} Lock token if acquired, null otherwise
 *
 * @example
 * ```typescript
 * const lockToken = await acquireDistributedLock({
 *   key: 'patient:123:lock',
 *   ttl: 5000,
 *   retryCount: 3,
 *   retryDelay: 100,
 *   lockTimeout: 5000
 * });
 * if (lockToken) {
 *   try {
 *     await updateCache();
 *   } finally {
 *     await releaseDistributedLock(lockToken, config.key);
 *   }
 * }
 * ```
 */
export declare function acquireDistributedLock(config: DistributedLockConfig): Promise<string | null>;
/**
 * Releases distributed lock for cache operations.
 *
 * @param {string} lockToken - Lock token from acquisition
 * @param {string} lockKey - Lock key
 * @returns {Promise<boolean>} True if released, false otherwise
 *
 * @example
 * ```typescript
 * await releaseDistributedLock(lockToken, 'patient:123:lock');
 * ```
 */
export declare function releaseDistributedLock(lockToken: string, lockKey: string): Promise<boolean>;
/**
 * Executes function with distributed lock for safe cache updates.
 *
 * @template T - Return type
 * @param {DistributedLockConfig} config - Lock configuration
 * @param {() => Promise<T>} fn - Function to execute with lock
 * @returns {Promise<T>} Function result
 * @throws {Error} If lock cannot be acquired
 *
 * @example
 * ```typescript
 * const result = await withDistributedLock(
 *   { key: 'patient:123:lock', ttl: 5000, retryCount: 3, retryDelay: 100, lockTimeout: 5000 },
 *   async () => {
 *     const data = await fetchData();
 *     await cache.set('patient:123', data);
 *     return data;
 *   }
 * );
 * ```
 */
export declare function withDistributedLock<T>(config: DistributedLockConfig, fn: () => Promise<T>): Promise<T>;
declare const _default: {
    createMultiTierCacheConfig: typeof createMultiTierCacheConfig;
    determineCacheTier: typeof determineCacheTier;
    promoteCacheEntry: typeof promoteCacheEntry;
    demoteCacheEntry: typeof demoteCacheEntry;
    getConsistentHashPartition: typeof getConsistentHashPartition;
    createVirtualNodes: typeof createVirtualNodes;
    getTargetNodes: typeof getTargetNodes;
    coordinateInvalidation: typeof coordinateInvalidation;
    synchronizeCacheState: typeof synchronizeCacheState;
    updateCoherenceState: typeof updateCoherenceState;
    writeInvalidateProtocol: typeof writeInvalidateProtocol;
    snoopCacheCoherence: typeof snoopCacheCoherence;
    validateCacheCoherence: typeof validateCacheCoherence;
    createPartitionConfig: typeof createPartitionConfig;
    getRangeBasedPartition: typeof getRangeBasedPartition;
    rebalancePartitions: typeof rebalancePartitions;
    calculateShardAffinity: typeof calculateShardAffinity;
    createNearCacheConfig: typeof createNearCacheConfig;
    shouldNearCache: typeof shouldNearCache;
    invalidateNearCache: typeof invalidateNearCache;
    preloadNearCache: typeof preloadNearCache;
    writeThroughCache: typeof writeThroughCache;
    writeBehindCache: typeof writeBehindCache;
    flushWriteBehindBuffer: typeof flushWriteBehindBuffer;
    writeAroundCache: typeof writeAroundCache;
    evictLRU: typeof evictLRU;
    evictLFU: typeof evictLFU;
    evictFIFO: typeof evictFIFO;
    evictARC: typeof evictARC;
    evictRandom: typeof evictRandom;
    warmCacheEager: typeof warmCacheEager;
    warmCacheLazy: typeof warmCacheLazy;
    scheduleCacheWarming: typeof scheduleCacheWarming;
    calculateCacheStatistics: typeof calculateCacheStatistics;
    monitorCachePerformance: typeof monitorCachePerformance;
    detectCacheAnomalies: typeof detectCacheAnomalies;
    createSizePredicate: typeof createSizePredicate;
    createFreshnessPredicate: typeof createFreshnessPredicate;
    createHIPAAPredicate: typeof createHIPAAPredicate;
    combinePredicates: typeof combinePredicates;
    generateCacheKey: typeof generateCacheKey;
    generateContentBasedKey: typeof generateContentBasedKey;
    generateTimeBucketKey: typeof generateTimeBucketKey;
    generateTenantKey: typeof generateTenantKey;
    serializeForCache: typeof serializeForCache;
    deserializeFromCache: typeof deserializeFromCache;
    encryptBuffer: typeof encryptBuffer;
    decryptBuffer: typeof decryptBuffer;
    compressIfNeeded: typeof compressIfNeeded;
    decompressIfNeeded: typeof decompressIfNeeded;
    calculateCompressionRatio: typeof calculateCompressionRatio;
    tagCacheEntry: typeof tagCacheEntry;
    invalidateByTag: typeof invalidateByTag;
    invalidateByPattern: typeof invalidateByPattern;
    invalidateByTenant: typeof invalidateByTenant;
    acquireDistributedLock: typeof acquireDistributedLock;
    releaseDistributedLock: typeof releaseDistributedLock;
    withDistributedLock: typeof withDistributedLock;
};
export default _default;
//# sourceMappingURL=nestjs-oracle-caching-advanced-kit.d.ts.map