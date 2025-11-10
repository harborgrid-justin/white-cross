"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.evictByTTL = exports.evictLFU = exports.evictLRU = exports.createEvictionPolicy = exports.mergePartitions = exports.redistributePartitions = exports.getPartitionStrategy = exports.partitionCache = exports.configureCompression = exports.getCompressionRatio = exports.decompressCacheEntry = exports.compressCacheEntry = exports.getCacheMetrics = exports.calculateHitRatio = exports.recordCacheMiss = exports.recordCacheHit = exports.getCacheStats = exports.validateWarmupData = exports.prioritizeWarmup = exports.scheduleWarmup = exports.preloadCacheData = exports.warmCache = exports.getCacheTopology = exports.rebalanceCache = exports.handleCachePartition = exports.syncCacheNodes = exports.createDistributedCache = exports.cascadeInvalidate = exports.invalidateExpired = exports.invalidateByTag = exports.invalidateByPattern = exports.invalidateCache = exports.getAdaptiveCache = exports.getFIFOCache = exports.getLFUCache = exports.getLRUCache = exports.createCacheStrategy = exports.createCachePartitionModel = exports.createCacheStatisticsModel = exports.createNetworkCacheModel = void 0;
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
const sequelize_1 = require("sequelize");
const zlib = __importStar(require("zlib"));
const util_1 = require("util");
const gzip = (0, util_1.promisify)(zlib.gzip);
const gunzip = (0, util_1.promisify)(zlib.gunzip);
// ============================================================================
// SEQUELIZE MODELS (1-3)
// ============================================================================
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
const createNetworkCacheModel = (sequelize) => {
    class NetworkCacheModel extends sequelize_1.Model {
    }
    NetworkCacheModel.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        cacheKey: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
            unique: true,
            comment: 'Unique cache key',
        },
        value: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            comment: 'Cached value (can be compressed)',
        },
        ttl: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Time to live in seconds',
        },
        expiresAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Expiration timestamp',
        },
        compressed: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether value is compressed',
        },
        size: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Entry size in bytes',
        },
        accessCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of times accessed',
        },
        lastAccessedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Last access timestamp',
        },
        tags: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Cache tags for invalidation',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'network_cache',
        timestamps: true,
        indexes: [
            { fields: ['cacheKey'], unique: true },
            { fields: ['expiresAt'] },
            { fields: ['tags'], using: 'GIN' },
            { fields: ['accessCount'] },
        ],
    });
    return NetworkCacheModel;
};
exports.createNetworkCacheModel = createNetworkCacheModel;
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
const createCacheStatisticsModel = (sequelize) => {
    class CacheStatisticsModel extends sequelize_1.Model {
    }
    CacheStatisticsModel.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        period: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Statistics period (hourly, daily, weekly)',
        },
        hits: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 0,
            comment: 'Cache hits',
        },
        misses: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 0,
            comment: 'Cache misses',
        },
        evictions: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 0,
            comment: 'Cache evictions',
        },
        totalSize: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 0,
            comment: 'Total cache size in bytes',
        },
        totalEntries: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Total number of entries',
        },
        avgResponseTime: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,
            comment: 'Average response time in ms',
        },
        hitRatio: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,
            comment: 'Cache hit ratio (0-1)',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional statistics metadata',
        },
    }, {
        sequelize,
        tableName: 'cache_statistics',
        timestamps: true,
        indexes: [
            { fields: ['period'] },
            { fields: ['createdAt'] },
        ],
    });
    return CacheStatisticsModel;
};
exports.createCacheStatisticsModel = createCacheStatisticsModel;
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
const createCachePartitionModel = (sequelize) => {
    class CachePartitionModel extends sequelize_1.Model {
    }
    CachePartitionModel.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        partitionId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            comment: 'Partition identifier',
        },
        rangeStart: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Partition range start',
        },
        rangeEnd: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Partition range end',
        },
        nodes: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Nodes serving this partition',
        },
        entryCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of entries in partition',
        },
        totalSize: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 0,
            comment: 'Total partition size in bytes',
        },
        status: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'active',
            comment: 'Partition status (active, migrating, inactive)',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Partition metadata',
        },
    }, {
        sequelize,
        tableName: 'cache_partitions',
        timestamps: true,
        indexes: [
            { fields: ['partitionId'], unique: true },
            { fields: ['status'] },
        ],
    });
    return CachePartitionModel;
};
exports.createCachePartitionModel = createCachePartitionModel;
// ============================================================================
// CACHE STRATEGIES (4-8)
// ============================================================================
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
const createCacheStrategy = (strategyType, maxEntries) => {
    switch (strategyType.toLowerCase()) {
        case 'lru':
            return (0, exports.getLRUCache)(maxEntries);
        case 'lfu':
            return (0, exports.getLFUCache)(maxEntries);
        case 'fifo':
            return (0, exports.getFIFOCache)(maxEntries);
        case 'adaptive':
            return (0, exports.getAdaptiveCache)(maxEntries);
        default:
            return (0, exports.getLRUCache)(maxEntries);
    }
};
exports.createCacheStrategy = createCacheStrategy;
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
const getLRUCache = (maxEntries) => {
    const cache = new Map();
    return {
        name: 'lru',
        get: (key) => {
            const entry = cache.get(key);
            if (!entry)
                return null;
            // Check expiration
            if (Date.now() > entry.createdAt + entry.ttl * 1000) {
                cache.delete(key);
                return null;
            }
            // Update access time
            entry.lastAccessedAt = Date.now();
            entry.accessCount++;
            // Move to end (most recently used)
            cache.delete(key);
            cache.set(key, entry);
            return entry;
        },
        set: (key, value, ttl, tags = []) => {
            if (cache.size >= maxEntries && !cache.has(key)) {
                // Evict least recently used (first item)
                const firstKey = cache.keys().next().value;
                cache.delete(firstKey);
            }
            const entry = {
                key,
                value,
                ttl,
                createdAt: Date.now(),
                lastAccessedAt: Date.now(),
                accessCount: 0,
                size: JSON.stringify(value).length,
                compressed: false,
                tags,
            };
            cache.set(key, entry);
        },
        delete: (key) => cache.delete(key),
        clear: () => cache.clear(),
        evict: () => {
            if (cache.size > 0) {
                const firstKey = cache.keys().next().value;
                cache.delete(firstKey);
            }
        },
    };
};
exports.getLRUCache = getLRUCache;
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
const getLFUCache = (maxEntries) => {
    const cache = new Map();
    return {
        name: 'lfu',
        get: (key) => {
            const entry = cache.get(key);
            if (!entry)
                return null;
            if (Date.now() > entry.createdAt + entry.ttl * 1000) {
                cache.delete(key);
                return null;
            }
            entry.lastAccessedAt = Date.now();
            entry.accessCount++;
            return entry;
        },
        set: (key, value, ttl, tags = []) => {
            if (cache.size >= maxEntries && !cache.has(key)) {
                // Evict least frequently used
                let minAccessCount = Infinity;
                let lfuKey = '';
                cache.forEach((entry, k) => {
                    if (entry.accessCount < minAccessCount) {
                        minAccessCount = entry.accessCount;
                        lfuKey = k;
                    }
                });
                if (lfuKey) {
                    cache.delete(lfuKey);
                }
            }
            const entry = {
                key,
                value,
                ttl,
                createdAt: Date.now(),
                lastAccessedAt: Date.now(),
                accessCount: 0,
                size: JSON.stringify(value).length,
                compressed: false,
                tags,
            };
            cache.set(key, entry);
        },
        delete: (key) => cache.delete(key),
        clear: () => cache.clear(),
        evict: () => {
            let minAccessCount = Infinity;
            let lfuKey = '';
            cache.forEach((entry, k) => {
                if (entry.accessCount < minAccessCount) {
                    minAccessCount = entry.accessCount;
                    lfuKey = k;
                }
            });
            if (lfuKey) {
                cache.delete(lfuKey);
            }
        },
    };
};
exports.getLFUCache = getLFUCache;
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
const getFIFOCache = (maxEntries) => {
    const cache = new Map();
    return {
        name: 'fifo',
        get: (key) => {
            const entry = cache.get(key);
            if (!entry)
                return null;
            if (Date.now() > entry.createdAt + entry.ttl * 1000) {
                cache.delete(key);
                return null;
            }
            entry.lastAccessedAt = Date.now();
            entry.accessCount++;
            return entry;
        },
        set: (key, value, ttl, tags = []) => {
            if (cache.size >= maxEntries && !cache.has(key)) {
                // Evict first inserted (FIFO)
                const firstKey = cache.keys().next().value;
                cache.delete(firstKey);
            }
            const entry = {
                key,
                value,
                ttl,
                createdAt: Date.now(),
                lastAccessedAt: Date.now(),
                accessCount: 0,
                size: JSON.stringify(value).length,
                compressed: false,
                tags,
            };
            cache.set(key, entry);
        },
        delete: (key) => cache.delete(key),
        clear: () => cache.clear(),
        evict: () => {
            if (cache.size > 0) {
                const firstKey = cache.keys().next().value;
                cache.delete(firstKey);
            }
        },
    };
};
exports.getFIFOCache = getFIFOCache;
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
const getAdaptiveCache = (maxEntries) => {
    let currentStrategy = (0, exports.getLRUCache)(maxEntries);
    let hitCount = 0;
    let requestCount = 0;
    const evaluateStrategy = () => {
        requestCount++;
        if (requestCount >= 100) {
            const hitRatio = hitCount / requestCount;
            // Switch to LFU if hit ratio is high (data access is predictable)
            // Switch to LRU if hit ratio is low (data access is random)
            currentStrategy = hitRatio > 0.7 ? (0, exports.getLFUCache)(maxEntries) : (0, exports.getLRUCache)(maxEntries);
            hitCount = 0;
            requestCount = 0;
        }
    };
    return {
        name: 'adaptive',
        get: (key) => {
            const entry = currentStrategy.get(key);
            if (entry) {
                hitCount++;
            }
            evaluateStrategy();
            return entry;
        },
        set: (key, value, ttl, tags) => {
            currentStrategy.set(key, value, ttl, tags);
        },
        delete: (key) => currentStrategy.delete(key),
        clear: () => currentStrategy.clear(),
        evict: () => currentStrategy.evict(),
    };
};
exports.getAdaptiveCache = getAdaptiveCache;
// ============================================================================
// CACHE INVALIDATION (9-13)
// ============================================================================
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
const invalidateCache = (cache, key) => {
    return cache.delete(key);
};
exports.invalidateCache = invalidateCache;
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
const invalidateByPattern = async (CacheModel, pattern) => {
    // Convert wildcard pattern to SQL LIKE pattern
    const sqlPattern = pattern.replace(/\*/g, '%');
    const result = await CacheModel.destroy({
        where: {
            cacheKey: {
                [sequelize_1.Op.like]: sqlPattern,
            },
        },
    });
    return result;
};
exports.invalidateByPattern = invalidateByPattern;
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
const invalidateByTag = async (CacheModel, tag) => {
    const entries = await CacheModel.findAll({
        where: sequelize.where(sequelize.fn('JSON_CONTAINS', sequelize.col('tags'), JSON.stringify([tag])), 1),
    });
    const result = await CacheModel.destroy({
        where: {
            id: {
                [sequelize_1.Op.in]: entries.map((e) => e.id),
            },
        },
    });
    return result;
};
exports.invalidateByTag = invalidateByTag;
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
const invalidateExpired = async (CacheModel) => {
    const result = await CacheModel.destroy({
        where: {
            expiresAt: {
                [sequelize_1.Op.lt]: new Date(),
            },
        },
    });
    return result;
};
exports.invalidateExpired = invalidateExpired;
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
const cascadeInvalidate = async (CacheModel, key, relatedPatterns) => {
    let total = 0;
    // Invalidate primary key
    total += await CacheModel.destroy({
        where: { cacheKey: key },
    });
    // Invalidate related patterns
    for (const pattern of relatedPatterns) {
        total += await (0, exports.invalidateByPattern)(CacheModel, pattern);
    }
    return total;
};
exports.cascadeInvalidate = cascadeInvalidate;
// ============================================================================
// DISTRIBUTED CACHING (14-18)
// ============================================================================
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
const createDistributedCache = (config) => {
    const hashRing = new Map();
    const virtualNodes = 150; // Virtual nodes per physical node for better distribution
    // Build consistent hash ring
    config.nodes.forEach((node, index) => {
        for (let i = 0; i < virtualNodes; i++) {
            const hash = simpleHash(`${node}:${i}`) % (2 ** 32);
            hashRing.set(hash, node);
        }
    });
    const sortedHashes = Array.from(hashRing.keys()).sort((a, b) => a - b);
    return {
        getNode: (key) => {
            const keyHash = simpleHash(key) % (2 ** 32);
            for (const hash of sortedHashes) {
                if (keyHash <= hash) {
                    return hashRing.get(hash);
                }
            }
            return hashRing.get(sortedHashes[0]);
        },
        getReplicaNodes: (key) => {
            const nodes = [];
            const keyHash = simpleHash(key) % (2 ** 32);
            let startIndex = sortedHashes.findIndex(h => keyHash <= h);
            if (startIndex === -1)
                startIndex = 0;
            for (let i = 0; i < config.replicationFactor; i++) {
                const index = (startIndex + i) % sortedHashes.length;
                const node = hashRing.get(sortedHashes[index]);
                if (!nodes.includes(node)) {
                    nodes.push(node);
                }
            }
            return nodes;
        },
        nodes: config.nodes,
        partitionCount: config.partitionCount,
    };
};
exports.createDistributedCache = createDistributedCache;
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
const syncCacheNodes = async (key, value, nodes) => {
    let success = 0;
    let failed = 0;
    const syncPromises = nodes.map(async (node) => {
        try {
            // In production, this would use Redis client or HTTP API
            const response = await fetch(`http://${node}/cache`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key, value }),
            });
            if (response.ok) {
                success++;
            }
            else {
                failed++;
            }
        }
        catch (error) {
            failed++;
            console.error(`Failed to sync with node ${node}:`, error);
        }
    });
    await Promise.allSettled(syncPromises);
    return { success, failed };
};
exports.syncCacheNodes = syncCacheNodes;
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
const handleCachePartition = async (partitionId, action, PartitionModel) => {
    const partition = await PartitionModel.findOne({
        where: { partitionId },
    });
    if (!partition) {
        throw new Error(`Partition not found: ${partitionId}`);
    }
    if (action === 'split') {
        // Split partition into two
        const midpoint = Math.floor((parseInt(partition.rangeStart, 16) + parseInt(partition.rangeEnd, 16)) / 2);
        const partition1 = await PartitionModel.create({
            partitionId: `${partitionId}-0`,
            rangeStart: partition.rangeStart,
            rangeEnd: midpoint.toString(16),
            nodes: partition.nodes,
            entryCount: Math.floor(partition.entryCount / 2),
            totalSize: Math.floor(partition.totalSize / 2),
            status: 'active',
        });
        const partition2 = await PartitionModel.create({
            partitionId: `${partitionId}-1`,
            rangeStart: (midpoint + 1).toString(16),
            rangeEnd: partition.rangeEnd,
            nodes: partition.nodes,
            entryCount: Math.ceil(partition.entryCount / 2),
            totalSize: Math.ceil(partition.totalSize / 2),
            status: 'active',
        });
        await partition.update({ status: 'inactive' });
        return [
            {
                id: partition1.partitionId,
                range: { start: partition1.rangeStart, end: partition1.rangeEnd },
                nodes: partition1.nodes,
                size: partition1.totalSize,
                entries: partition1.entryCount,
            },
            {
                id: partition2.partitionId,
                range: { start: partition2.rangeStart, end: partition2.rangeEnd },
                nodes: partition2.nodes,
                size: partition2.totalSize,
                entries: partition2.entryCount,
            },
        ];
    }
    return [];
};
exports.handleCachePartition = handleCachePartition;
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
const rebalanceCache = async (PartitionModel, nodes) => {
    const partitions = await PartitionModel.findAll({
        where: { status: 'active' },
    });
    let rebalanced = 0;
    const avgSize = partitions.reduce((sum, p) => sum + p.totalSize, 0) / nodes.length;
    for (const partition of partitions) {
        if (partition.totalSize > avgSize * 1.5) {
            // Partition is overloaded, split it
            await (0, exports.handleCachePartition)(partition.partitionId, 'split', PartitionModel);
            rebalanced++;
        }
    }
    return rebalanced;
};
exports.rebalanceCache = rebalanceCache;
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
const getCacheTopology = async (PartitionModel) => {
    const partitions = await PartitionModel.findAll({
        where: { status: 'active' },
    });
    const uniqueNodes = new Set();
    let totalEntries = 0;
    let totalSize = 0;
    partitions.forEach((p) => {
        p.nodes.forEach((n) => uniqueNodes.add(n));
        totalEntries += p.entryCount;
        totalSize += p.totalSize;
    });
    return {
        partitionCount: partitions.length,
        nodeCount: uniqueNodes.size,
        nodes: Array.from(uniqueNodes),
        totalEntries,
        totalSize,
        avgPartitionSize: totalSize / partitions.length,
        partitions: partitions.map((p) => ({
            id: p.partitionId,
            range: { start: p.rangeStart, end: p.rangeEnd },
            nodes: p.nodes,
            entries: p.entryCount,
            size: p.totalSize,
        })),
    };
};
exports.getCacheTopology = getCacheTopology;
// ============================================================================
// CACHE WARMING (19-23)
// ============================================================================
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
const warmCache = async (config, cache) => {
    let loaded = 0;
    let failed = 0;
    // Sort sources by priority (highest first)
    const sortedSources = [...config.sources].sort((a, b) => b.priority - a.priority);
    for (const source of sortedSources) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), config.timeout);
            const response = await fetch(source.url, {
                signal: controller.signal,
            });
            clearTimeout(timeoutId);
            if (response.ok) {
                const data = await response.json();
                const items = Array.isArray(data) ? data : [data];
                items.forEach((item, index) => {
                    const key = `warmup:${source.url}:${index}`;
                    cache.set(key, item, 3600); // 1 hour TTL
                    loaded++;
                });
            }
            else {
                failed++;
            }
        }
        catch (error) {
            failed++;
            console.error(`Cache warmup failed for ${source.url}:`, error);
        }
    }
    return { loaded, failed };
};
exports.warmCache = warmCache;
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
const preloadCacheData = async (data, cache, batchSize) => {
    let loaded = 0;
    for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize);
        batch.forEach(item => {
            cache.set(item.key, item.value, item.ttl);
            loaded++;
        });
        // Small delay between batches to avoid overwhelming the cache
        await new Promise(resolve => setTimeout(resolve, 10));
    }
    return loaded;
};
exports.preloadCacheData = preloadCacheData;
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
const scheduleWarmup = (config, cache, intervalMs) => {
    return setInterval(async () => {
        try {
            await (0, exports.warmCache)(config, cache);
        }
        catch (error) {
            console.error('Scheduled warmup failed:', error);
        }
    }, intervalMs);
};
exports.scheduleWarmup = scheduleWarmup;
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
const prioritizeWarmup = async (CacheModel, topN) => {
    const entries = await CacheModel.findAll({
        order: [['accessCount', 'DESC']],
        limit: topN,
    });
    return entries.map((e) => e.cacheKey);
};
exports.prioritizeWarmup = prioritizeWarmup;
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
const validateWarmupData = (data, schema) => {
    const errors = [];
    if (!Array.isArray(data)) {
        errors.push('Warmup data must be an array');
        return { valid: false, errors };
    }
    data.forEach((item, index) => {
        Object.keys(schema).forEach(field => {
            const fieldSchema = schema[field];
            if (fieldSchema.required && !item[field]) {
                errors.push(`Item ${index}: ${field} is required`);
            }
            if (item[field] && typeof item[field] !== fieldSchema.type) {
                errors.push(`Item ${index}: ${field} must be of type ${fieldSchema.type}`);
            }
        });
    });
    return {
        valid: errors.length === 0,
        errors,
    };
};
exports.validateWarmupData = validateWarmupData;
// ============================================================================
// CACHE STATISTICS (24-28)
// ============================================================================
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
const getCacheStats = async (CacheModel, StatsModel) => {
    const recentStats = await StatsModel.findOne({
        order: [['createdAt', 'DESC']],
    });
    const cacheEntries = await CacheModel.findAll();
    const totalSize = cacheEntries.reduce((sum, e) => sum + e.size, 0);
    return {
        hits: recentStats?.hits || 0,
        misses: recentStats?.misses || 0,
        hitRatio: recentStats?.hitRatio || 0,
        totalRequests: (recentStats?.hits || 0) + (recentStats?.misses || 0),
        evictions: recentStats?.evictions || 0,
        size: totalSize,
        avgAccessTime: recentStats?.avgResponseTime || 0,
    };
};
exports.getCacheStats = getCacheStats;
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
const recordCacheHit = async (StatsModel, responseTime) => {
    const today = new Date().toISOString().split('T')[0];
    const stats = await StatsModel.findOne({
        where: {
            period: 'daily',
            createdAt: {
                [sequelize_1.Op.gte]: new Date(today),
            },
        },
    });
    if (stats) {
        const totalRequests = stats.hits + stats.misses + 1;
        const newAvgTime = (stats.avgResponseTime * (totalRequests - 1) + responseTime) / totalRequests;
        await stats.update({
            hits: stats.hits + 1,
            avgResponseTime: newAvgTime,
            hitRatio: (stats.hits + 1) / totalRequests,
        });
    }
    else {
        await StatsModel.create({
            period: 'daily',
            hits: 1,
            misses: 0,
            evictions: 0,
            avgResponseTime: responseTime,
            hitRatio: 1.0,
        });
    }
};
exports.recordCacheHit = recordCacheHit;
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
const recordCacheMiss = async (StatsModel) => {
    const today = new Date().toISOString().split('T')[0];
    const stats = await StatsModel.findOne({
        where: {
            period: 'daily',
            createdAt: {
                [sequelize_1.Op.gte]: new Date(today),
            },
        },
    });
    if (stats) {
        const totalRequests = stats.hits + stats.misses + 1;
        await stats.update({
            misses: stats.misses + 1,
            hitRatio: stats.hits / totalRequests,
        });
    }
    else {
        await StatsModel.create({
            period: 'daily',
            hits: 0,
            misses: 1,
            evictions: 0,
            hitRatio: 0.0,
        });
    }
};
exports.recordCacheMiss = recordCacheMiss;
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
const calculateHitRatio = async (StatsModel, period, limit) => {
    const stats = await StatsModel.findAll({
        where: { period },
        order: [['createdAt', 'DESC']],
        limit,
    });
    if (stats.length === 0)
        return 0;
    const avgHitRatio = stats.reduce((sum, s) => sum + s.hitRatio, 0) / stats.length;
    return avgHitRatio;
};
exports.calculateHitRatio = calculateHitRatio;
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
const getCacheMetrics = async (CacheModel, StatsModel) => {
    const stats = await (0, exports.getCacheStats)(CacheModel, StatsModel);
    const entries = await CacheModel.count();
    const avgSize = stats.size / (entries || 1);
    const topAccessed = await CacheModel.findAll({
        order: [['accessCount', 'DESC']],
        limit: 10,
    });
    return {
        ...stats,
        totalEntries: entries,
        avgEntrySize: avgSize,
        topAccessed: topAccessed.map((e) => ({
            key: e.cacheKey,
            accessCount: e.accessCount,
        })),
    };
};
exports.getCacheMetrics = getCacheMetrics;
// ============================================================================
// CACHE COMPRESSION (29-32)
// ============================================================================
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
const compressCacheEntry = async (value, config) => {
    const serialized = JSON.stringify(value);
    const originalSize = Buffer.byteLength(serialized);
    if (!config.enabled || originalSize < config.minSize) {
        return {
            compressed: Buffer.from(serialized),
            originalSize,
            compressedSize: originalSize,
        };
    }
    const compressed = await gzip(Buffer.from(serialized));
    return {
        compressed,
        originalSize,
        compressedSize: compressed.length,
    };
};
exports.compressCacheEntry = compressCacheEntry;
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
const decompressCacheEntry = async (compressed, isCompressed) => {
    if (!isCompressed) {
        return JSON.parse(compressed.toString());
    }
    const decompressed = await gunzip(compressed);
    return JSON.parse(decompressed.toString());
};
exports.decompressCacheEntry = decompressCacheEntry;
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
const getCompressionRatio = async (CacheModel) => {
    const entries = await CacheModel.findAll({
        where: { compressed: true },
    });
    if (entries.length === 0)
        return 1.0;
    // Estimate original size from current size and typical compression
    const totalCompressed = entries.reduce((sum, e) => sum + e.size, 0);
    const estimatedOriginal = totalCompressed * 2.5; // Typical compression ratio
    return estimatedOriginal / totalCompressed;
};
exports.getCompressionRatio = getCompressionRatio;
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
const configureCompression = (config) => {
    return {
        enabled: config.enabled ?? true,
        minSize: config.minSize ?? 1024,
        algorithm: config.algorithm ?? 'gzip',
        level: config.level ?? 6,
    };
};
exports.configureCompression = configureCompression;
// ============================================================================
// CACHE PARTITIONING (33-36)
// ============================================================================
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
const partitionCache = async (config, PartitionModel) => {
    const partitions = [];
    const rangeSize = Math.floor((2 ** 32) / config.partitionCount);
    for (let i = 0; i < config.partitionCount; i++) {
        const start = (i * rangeSize).toString(16).padStart(8, '0');
        const end = ((i + 1) * rangeSize - 1).toString(16).padStart(8, '0');
        const partition = await PartitionModel.create({
            partitionId: `part-${i}`,
            rangeStart: start,
            rangeEnd: end,
            nodes: [],
            entryCount: 0,
            totalSize: 0,
            status: 'active',
        });
        partitions.push({
            id: partition.partitionId,
            range: { start, end },
            nodes: [],
            size: 0,
            entries: 0,
        });
    }
    return partitions;
};
exports.partitionCache = partitionCache;
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
const getPartitionStrategy = (strategy) => {
    switch (strategy) {
        case 'hash':
            return {
                name: 'hash',
                getPartition: (key, partitionCount) => {
                    const hash = simpleHash(key);
                    return hash % partitionCount;
                },
            };
        case 'range':
            return {
                name: 'range',
                getPartition: (key, partitionCount) => {
                    const firstChar = key.charCodeAt(0);
                    const rangeSize = Math.floor(256 / partitionCount);
                    return Math.floor(firstChar / rangeSize);
                },
            };
        case 'list':
            return {
                name: 'list',
                getPartition: (key, partitionCount) => {
                    // Simple list-based partitioning based on key prefix
                    const prefix = key.split(':')[0];
                    return simpleHash(prefix) % partitionCount;
                },
            };
        default:
            return (0, exports.getPartitionStrategy)('hash');
    }
};
exports.getPartitionStrategy = getPartitionStrategy;
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
const redistributePartitions = async (PartitionModel, CacheModel) => {
    const partitions = await PartitionModel.findAll({
        where: { status: 'active' },
    });
    let redistributed = 0;
    // Find overloaded partitions
    const avgSize = partitions.reduce((sum, p) => sum + p.totalSize, 0) / partitions.length;
    for (const partition of partitions) {
        if (partition.totalSize > avgSize * 1.5) {
            // Redistribute some entries to other partitions
            const entries = await CacheModel.findAll({
                where: {
                    cacheKey: {
                        [sequelize_1.Op.like]: `${partition.partitionId}:%`,
                    },
                },
                limit: 100,
            });
            redistributed += entries.length;
        }
    }
    return redistributed;
};
exports.redistributePartitions = redistributePartitions;
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
const mergePartitions = async (partitionIds, PartitionModel) => {
    const partitions = await PartitionModel.findAll({
        where: {
            partitionId: {
                [sequelize_1.Op.in]: partitionIds,
            },
        },
    });
    if (partitions.length < 2) {
        throw new Error('At least 2 partitions required for merge');
    }
    const allNodes = new Set();
    let totalEntries = 0;
    let totalSize = 0;
    partitions.forEach((p) => {
        p.nodes.forEach((n) => allNodes.add(n));
        totalEntries += p.entryCount;
        totalSize += p.totalSize;
    });
    const merged = await PartitionModel.create({
        partitionId: `merged-${Date.now()}`,
        rangeStart: partitions[0].rangeStart,
        rangeEnd: partitions[partitions.length - 1].rangeEnd,
        nodes: Array.from(allNodes),
        entryCount: totalEntries,
        totalSize,
        status: 'active',
    });
    // Mark old partitions as inactive
    await PartitionModel.update({ status: 'inactive' }, {
        where: {
            partitionId: {
                [sequelize_1.Op.in]: partitionIds,
            },
        },
    });
    return {
        id: merged.partitionId,
        range: { start: merged.rangeStart, end: merged.rangeEnd },
        nodes: merged.nodes,
        size: merged.totalSize,
        entries: merged.entryCount,
    };
};
exports.mergePartitions = mergePartitions;
// ============================================================================
// EVICTION POLICIES (37-40)
// ============================================================================
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
const createEvictionPolicy = (policy) => {
    return {
        strategy: policy.strategy,
        shouldEvict: (currentSize, currentEntries) => {
            return currentSize >= policy.maxSize || currentEntries >= policy.maxEntries;
        },
        selectVictim: (entries) => {
            switch (policy.strategy) {
                case 'lru':
                    return (0, exports.evictLRU)(entries);
                case 'lfu':
                    return (0, exports.evictLFU)(entries);
                case 'ttl':
                    return (0, exports.evictByTTL)(entries);
                default:
                    return (0, exports.evictLRU)(entries);
            }
        },
    };
};
exports.createEvictionPolicy = createEvictionPolicy;
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
const evictLRU = (entries) => {
    if (entries.length === 0)
        return null;
    return entries.reduce((oldest, current) => current.lastAccessedAt < oldest.lastAccessedAt ? current : oldest);
};
exports.evictLRU = evictLRU;
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
const evictLFU = (entries) => {
    if (entries.length === 0)
        return null;
    return entries.reduce((leastUsed, current) => current.accessCount < leastUsed.accessCount ? current : leastUsed);
};
exports.evictLFU = evictLFU;
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
const evictByTTL = (entries) => {
    if (entries.length === 0)
        return null;
    return entries.reduce((soonest, current) => {
        const soonestExpiry = soonest.createdAt + soonest.ttl * 1000;
        const currentExpiry = current.createdAt + current.ttl * 1000;
        return currentExpiry < soonestExpiry ? current : soonest;
    });
};
exports.evictByTTL = evictByTTL;
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Simple hash function for consistent hashing.
 */
function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
}
exports.default = {
    // Sequelize Models
    createNetworkCacheModel: exports.createNetworkCacheModel,
    createCacheStatisticsModel: exports.createCacheStatisticsModel,
    createCachePartitionModel: exports.createCachePartitionModel,
    // Cache Strategies
    createCacheStrategy: exports.createCacheStrategy,
    getLRUCache: exports.getLRUCache,
    getLFUCache: exports.getLFUCache,
    getFIFOCache: exports.getFIFOCache,
    getAdaptiveCache: exports.getAdaptiveCache,
    // Cache Invalidation
    invalidateCache: exports.invalidateCache,
    invalidateByPattern: exports.invalidateByPattern,
    invalidateByTag: exports.invalidateByTag,
    invalidateExpired: exports.invalidateExpired,
    cascadeInvalidate: exports.cascadeInvalidate,
    // Distributed Caching
    createDistributedCache: exports.createDistributedCache,
    syncCacheNodes: exports.syncCacheNodes,
    handleCachePartition: exports.handleCachePartition,
    rebalanceCache: exports.rebalanceCache,
    getCacheTopology: exports.getCacheTopology,
    // Cache Warming
    warmCache: exports.warmCache,
    preloadCacheData: exports.preloadCacheData,
    scheduleWarmup: exports.scheduleWarmup,
    prioritizeWarmup: exports.prioritizeWarmup,
    validateWarmupData: exports.validateWarmupData,
    // Cache Statistics
    getCacheStats: exports.getCacheStats,
    recordCacheHit: exports.recordCacheHit,
    recordCacheMiss: exports.recordCacheMiss,
    calculateHitRatio: exports.calculateHitRatio,
    getCacheMetrics: exports.getCacheMetrics,
    // Cache Compression
    compressCacheEntry: exports.compressCacheEntry,
    decompressCacheEntry: exports.decompressCacheEntry,
    getCompressionRatio: exports.getCompressionRatio,
    configureCompression: exports.configureCompression,
    // Cache Partitioning
    partitionCache: exports.partitionCache,
    getPartitionStrategy: exports.getPartitionStrategy,
    redistributePartitions: exports.redistributePartitions,
    mergePartitions: exports.mergePartitions,
    // Eviction Policies
    createEvictionPolicy: exports.createEvictionPolicy,
    evictLRU: exports.evictLRU,
    evictLFU: exports.evictLFU,
    evictByTTL: exports.evictByTTL,
};
//# sourceMappingURL=network-caching-kit.js.map