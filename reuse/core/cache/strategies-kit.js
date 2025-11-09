"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheStrategiesKit = exports.ReplicatedCacheStrategy = exports.PartitionedCacheStrategy = exports.MultiLevelCacheStrategy = exports.StrategySelector = void 0;
exports.createStrategiesKit = createStrategiesKit;
const strategies_1 = require("./strategies");
/**
 * Cache Strategies Kit
 *
 * Factory and utility class for working with different caching strategies.
 */
class CacheStrategiesKit {
    constructor(storage, config = {}) {
        this.storage = storage;
        this.config = {
            defaultTTL: 3600000,
            defaultNamespace: '',
            compress: false,
            ...config,
        };
    }
    /**
     * Create cache-aside strategy
     */
    cacheAside(options) {
        return new strategies_1.CacheAsideStrategy(this.storage, this.mergeOptions(options));
    }
    /**
     * Create write-through strategy
     */
    writeThrough(options) {
        return new strategies_1.WriteThroughStrategy(this.storage, this.mergeOptions(options));
    }
    /**
     * Create write-behind strategy
     */
    writeBehind(options) {
        return new strategies_1.WriteBehindStrategy(this.storage, this.mergeOptions(options));
    }
    /**
     * Create read-through strategy
     */
    readThrough(loader, options) {
        return new strategies_1.ReadThroughStrategy(this.storage, loader, this.mergeOptions(options));
    }
    /**
     * Create refresh-ahead strategy
     */
    refreshAhead(options) {
        return new strategies_1.RefreshAheadStrategy(this.storage, this.mergeOptions(options));
    }
    /**
     * Merge options with defaults
     */
    mergeOptions(options) {
        return {
            ttl: this.config.defaultTTL,
            namespace: this.config.defaultNamespace,
            compress: this.config.compress,
            ...options,
        };
    }
    /**
     * Get the underlying storage
     */
    getStorage() {
        return this.storage;
    }
    /**
     * Create a namespaced kit
     */
    namespace(namespace) {
        return new CacheStrategiesKit(this.storage, {
            ...this.config,
            defaultNamespace: namespace,
        });
    }
}
exports.default = CacheStrategiesKit;
exports.CacheStrategiesKit = CacheStrategiesKit;
/**
 * Strategy selector utility
 */
class StrategySelector {
    /**
     * Select optimal strategy based on use case
     */
    static selectStrategy(useCase, storage, options) {
        switch (useCase) {
            case 'read-heavy':
                // Cache-aside is best for read-heavy workloads
                return new strategies_1.CacheAsideStrategy(storage, options);
            case 'write-heavy':
                // Write-behind reduces write latency
                return new strategies_1.WriteBehindStrategy(storage, {
                    ...options,
                    flushIntervalMs: 5000,
                });
            case 'balanced':
                // Write-through provides balance
                return new strategies_1.WriteThroughStrategy(storage, options);
            case 'high-availability':
                // Refresh-ahead prevents cache misses
                return new strategies_1.RefreshAheadStrategy(storage, {
                    ...options,
                    refreshThreshold: 0.8,
                });
            case 'low-latency':
                // Write-behind minimizes latency
                return new strategies_1.WriteBehindStrategy(storage, {
                    ...options,
                    flushIntervalMs: 10000,
                });
            default:
                return new strategies_1.CacheAsideStrategy(storage, options);
        }
    }
}
exports.StrategySelector = StrategySelector;
/**
 * Multi-level cache strategy
 *
 * Implements a multi-tier caching approach with L1 (memory) and L2 (Redis) caches.
 */
class MultiLevelCacheStrategy {
    constructor(l1Cache, l2Cache, options = {}) {
        this.l1Cache = l1Cache;
        this.l2Cache = l2Cache;
        this.options = {
            ttl: 3600000,
            ...options,
        };
    }
    /**
     * Get value from multi-level cache
     */
    async get(key, loader) {
        // Try L1 cache first
        let value = await this.l1Cache.get(key);
        if (value !== null) {
            return value;
        }
        // Try L2 cache
        value = await this.l2Cache.get(key);
        if (value !== null) {
            // Promote to L1
            await this.l1Cache.set(key, value, this.options.ttl);
            return value;
        }
        // Load from source if loader provided
        if (loader) {
            value = await loader();
            if (value !== null && value !== undefined) {
                // Store in both levels
                await this.set(key, value);
            }
            return value;
        }
        return null;
    }
    /**
     * Set value in multi-level cache
     */
    async set(key, value, ttl) {
        const effectiveTTL = ttl || this.options.ttl;
        // Write to both levels
        await Promise.all([
            this.l1Cache.set(key, value, effectiveTTL),
            this.l2Cache.set(key, value, effectiveTTL),
        ]);
    }
    /**
     * Delete from multi-level cache
     */
    async delete(key) {
        await Promise.all([
            this.l1Cache.delete(key),
            this.l2Cache.delete(key),
        ]);
    }
    /**
     * Check if key exists in either level
     */
    async has(key) {
        const [l1Has, l2Has] = await Promise.all([
            this.l1Cache.has(key),
            this.l2Cache.has(key),
        ]);
        return l1Has || l2Has;
    }
    /**
     * Clear both cache levels
     */
    async clear() {
        await Promise.all([
            this.l1Cache.clear(),
            this.l2Cache.clear(),
        ]);
    }
}
exports.MultiLevelCacheStrategy = MultiLevelCacheStrategy;
/**
 * Partitioned cache strategy
 *
 * Distributes cache across multiple storage backends based on key hash.
 */
class PartitionedCacheStrategy {
    constructor(partitions, options = {}) {
        if (partitions.length === 0) {
            throw new Error('At least one partition is required');
        }
        this.partitions = partitions;
        this.options = {
            ttl: 3600000,
            ...options,
        };
    }
    /**
     * Get partition for key
     */
    getPartition(key) {
        const hash = this.hashCode(key);
        const index = Math.abs(hash) % this.partitions.length;
        return this.partitions[index];
    }
    /**
     * Simple hash function
     */
    hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash;
    }
    /**
     * Get value from partitioned cache
     */
    async get(key) {
        const partition = this.getPartition(key);
        return await partition.get(key);
    }
    /**
     * Set value in partitioned cache
     */
    async set(key, value, ttl) {
        const partition = this.getPartition(key);
        const effectiveTTL = ttl || this.options.ttl;
        await partition.set(key, value, effectiveTTL);
    }
    /**
     * Delete from partitioned cache
     */
    async delete(key) {
        const partition = this.getPartition(key);
        await partition.delete(key);
    }
    /**
     * Check if key exists
     */
    async has(key) {
        const partition = this.getPartition(key);
        return await partition.has(key);
    }
    /**
     * Clear all partitions
     */
    async clear() {
        await Promise.all(this.partitions.map(p => p.clear()));
    }
    /**
     * Get all keys from all partitions
     */
    async keys(pattern) {
        const allKeys = await Promise.all(this.partitions.map(p => p.keys(pattern)));
        return allKeys.flat();
    }
}
exports.PartitionedCacheStrategy = PartitionedCacheStrategy;
/**
 * Replicated cache strategy
 *
 * Writes to multiple cache backends for redundancy and reads from the fastest.
 */
class ReplicatedCacheStrategy {
    constructor(replicas, options = {}) {
        if (replicas.length === 0) {
            throw new Error('At least one replica is required');
        }
        this.replicas = replicas;
        this.options = {
            ttl: 3600000,
            ...options,
        };
    }
    /**
     * Get value from replicated cache (first successful read)
     */
    async get(key) {
        // Race all replicas, return first successful result
        const results = await Promise.allSettled(this.replicas.map(replica => replica.get(key)));
        for (const result of results) {
            if (result.status === 'fulfilled' && result.value !== null) {
                return result.value;
            }
        }
        return null;
    }
    /**
     * Set value in all replicas
     */
    async set(key, value, ttl) {
        const effectiveTTL = ttl || this.options.ttl;
        // Write to all replicas
        const results = await Promise.allSettled(this.replicas.map(replica => replica.set(key, value, effectiveTTL)));
        // Log any failures
        results.forEach((result, index) => {
            if (result.status === 'rejected') {
                console.error(`Failed to write to replica ${index}:`, result.reason);
            }
        });
    }
    /**
     * Delete from all replicas
     */
    async delete(key) {
        await Promise.allSettled(this.replicas.map(replica => replica.delete(key)));
    }
    /**
     * Check if key exists in any replica
     */
    async has(key) {
        const results = await Promise.allSettled(this.replicas.map(replica => replica.has(key)));
        return results.some(result => result.status === 'fulfilled' && result.value === true);
    }
    /**
     * Clear all replicas
     */
    async clear() {
        await Promise.allSettled(this.replicas.map(replica => replica.clear()));
    }
}
exports.ReplicatedCacheStrategy = ReplicatedCacheStrategy;
/**
 * Create strategies kit instance
 */
function createStrategiesKit(storage, config) {
    return new CacheStrategiesKit(storage, config);
}
//# sourceMappingURL=strategies-kit.js.map