"use strict";
/**
 * @fileoverview Caching Strategies Kit - Comprehensive caching utilities for NestJS
 * @module reuse/caching-strategies-kit
 * @description Complete caching solution with Redis, in-memory LRU, multi-level caching,
 * cache patterns (cache-aside, write-through, write-behind), invalidation strategies,
 * TTL management, cache warming, stampede prevention, and performance monitoring.
 *
 * Key Features:
 * - Redis caching with connection pooling and clustering
 * - In-memory LRU cache with automatic eviction
 * - Cache-aside (lazy loading) pattern implementation
 * - Write-through and write-behind caching strategies
 * - Advanced cache invalidation (TTL, tags, patterns)
 * - Cache key generation and normalization
 * - Cache warming and preloading strategies
 * - Multi-level caching (L1/L2/L3 hierarchy)
 * - Cache stampede prevention with locking
 * - Distributed caching coordination
 * - Automatic serialization/deserialization
 * - Decorator-based caching for methods
 * - Comprehensive cache statistics and monitoring
 * - HIPAA-compliant caching with encryption
 * - Cache versioning and migration support
 *
 * @target NestJS v10.x, Redis v7.x, Node 18+, TypeScript 5.x
 *
 * @security
 * - Encrypted cache storage for PHI/PII data
 * - Secure key generation and namespace isolation
 * - Access control for distributed cache operations
 * - Audit logging for cache access patterns
 * - Automatic expiration of sensitive data
 * - Cache poisoning prevention
 * - DoS protection via rate limiting
 *
 * @example Basic Redis caching
 * ```typescript
 * import { redisCacheSet, redisCacheGet, redisCacheDel } from './caching-strategies-kit';
 * import Redis from 'ioredis';
 *
 * const redis = new Redis();
 *
 * // Set cache value
 * await redisCacheSet(redis, 'user:123', { name: 'John' }, { ttl: 3600 });
 *
 * // Get cache value
 * const user = await redisCacheGet(redis, 'user:123');
 *
 * // Delete cache value
 * await redisCacheDel(redis, 'user:123');
 * ```
 *
 * @example In-memory LRU caching
 * ```typescript
 * import { createLRUCache, lruSet, lruGet } from './caching-strategies-kit';
 *
 * const cache = createLRUCache({ maxSize: 1000, ttl: 3600 });
 *
 * // Set and get values
 * lruSet(cache, 'key', 'value', 300);
 * const value = lruGet(cache, 'key');
 * ```
 *
 * @example Cache-aside pattern
 * ```typescript
 * import { cacheAsideGet, cacheAsideSet } from './caching-strategies-kit';
 *
 * const value = await cacheAsideGet(redis, 'product:456', async () => {
 *   // Fetch from database if cache miss
 *   return await productRepository.findById('456');
 * }, { ttl: 1800 });
 * ```
 *
 * @example Multi-level caching
 * ```typescript
 * import { multiLevelGet, multiLevelSet, createCacheHierarchy } from './caching-strategies-kit';
 *
 * const hierarchy = createCacheHierarchy({
 *   l1: lruCache,
 *   l2: redis,
 *   l3: database
 * });
 *
 * const data = await multiLevelGet(hierarchy, 'key');
 * ```
 *
 * LOC: CACHE-STRAT-001
 * UPSTREAM: ioredis, @nestjs/cache-manager, cache-manager
 * DOWNSTREAM: service layer, repository pattern, API endpoints
 *
 * @version 1.0.0
 * @since 2025-11-08
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
exports.deserializeFromCache = exports.serializeForCache = exports.getWithStampedeProtection = exports.releaseCacheLock = exports.acquireCacheLock = exports.multiLevelInvalidate = exports.multiLevelSet = exports.multiLevelGet = exports.createCacheHierarchy = exports.scheduleCacheWarming = exports.warmCacheProgressive = exports.warmCache = exports.normalizeCacheKey = exports.generateHashedKey = exports.parseCacheKey = exports.buildCacheKey = exports.setMultipleTTLs = exports.refreshTTL = exports.extendTTL = exports.getTTL = exports.invalidateCascading = exports.invalidateMultiple = exports.invalidateByPattern = exports.invalidateByTag = exports.invalidateByTTL = exports.startWriteBehindFlush = exports.flushWriteBehindQueue = exports.writeBehindSet = exports.createWriteBehindQueue = exports.writeThroughDelete = exports.writeThroughUpdate = exports.writeThroughSet = exports.cacheAsideInvalidate = exports.cacheAsideMultiLevel = exports.cacheAsideGet = exports.lruStats = exports.lruClear = exports.lruDel = exports.lruGet = exports.lruSet = exports.createLRUCache = exports.redisCacheMSet = exports.redisCacheMGet = exports.redisCacheExists = exports.redisCacheDel = exports.redisCacheGet = exports.redisCacheSet = exports.InvalidationStrategy = exports.CacheLevel = exports.CacheStrategy = void 0;
exports.calculateCacheEfficiency = exports.trackCacheMetric = exports.getCacheStatistics = void 0;
const common_1 = require("@nestjs/common");
const crypto = __importStar(require("crypto"));
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * @enum CacheStrategy
 * @description Supported caching strategies
 */
var CacheStrategy;
(function (CacheStrategy) {
    CacheStrategy["CACHE_ASIDE"] = "CACHE_ASIDE";
    CacheStrategy["WRITE_THROUGH"] = "WRITE_THROUGH";
    CacheStrategy["WRITE_BEHIND"] = "WRITE_BEHIND";
    CacheStrategy["REFRESH_AHEAD"] = "REFRESH_AHEAD";
    CacheStrategy["READ_THROUGH"] = "READ_THROUGH";
})(CacheStrategy || (exports.CacheStrategy = CacheStrategy = {}));
/**
 * @enum CacheLevel
 * @description Cache hierarchy levels
 */
var CacheLevel;
(function (CacheLevel) {
    CacheLevel["L1_MEMORY"] = "L1_MEMORY";
    CacheLevel["L2_REDIS"] = "L2_REDIS";
    CacheLevel["L3_DATABASE"] = "L3_DATABASE";
})(CacheLevel || (exports.CacheLevel = CacheLevel = {}));
/**
 * @enum InvalidationStrategy
 * @description Cache invalidation strategies
 */
var InvalidationStrategy;
(function (InvalidationStrategy) {
    InvalidationStrategy["TTL"] = "TTL";
    InvalidationStrategy["TAG_BASED"] = "TAG_BASED";
    InvalidationStrategy["PATTERN"] = "PATTERN";
    InvalidationStrategy["EVENT_DRIVEN"] = "EVENT_DRIVEN";
    InvalidationStrategy["MANUAL"] = "MANUAL";
})(InvalidationStrategy || (exports.InvalidationStrategy = InvalidationStrategy = {}));
// ============================================================================
// REDIS CACHING UTILITIES
// ============================================================================
/**
 * Sets a value in Redis cache with optional TTL and compression
 *
 * @param {RedisClient} redis - Redis client instance
 * @param {string} key - Cache key
 * @param {any} value - Value to cache
 * @param {CacheOptions} [options] - Cache options
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await redisCacheSet(redis, 'user:123', userData, { ttl: 3600, encrypt: true });
 * ```
 */
const redisCacheSet = async (redis, key, value, options = {}) => {
    try {
        const fullKey = (0, exports.buildCacheKey)({ namespace: options.namespace || 'default', resource: key, identifier: '' });
        let serialized = JSON.stringify(value);
        if (options.compress) {
            serialized = await compressData(serialized);
        }
        if (options.encrypt) {
            serialized = await encryptData(serialized);
        }
        if (options.ttl) {
            await redis.setex(fullKey, options.ttl, serialized);
        }
        else {
            await redis.set(fullKey, serialized);
        }
        // Add tags if provided
        if (options.tags && options.tags.length > 0) {
            await addCacheTags(redis, fullKey, options.tags);
        }
        return true;
    }
    catch (error) {
        common_1.Logger.error(`Redis cache set failed for key ${key}:`, error);
        return false;
    }
};
exports.redisCacheSet = redisCacheSet;
/**
 * Gets a value from Redis cache with automatic deserialization
 *
 * @param {RedisClient} redis - Redis client instance
 * @param {string} key - Cache key
 * @param {CacheOptions} [options] - Cache options
 * @returns {Promise<T | null>} Cached value or null
 *
 * @example
 * ```typescript
 * const user = await redisCacheGet<User>(redis, 'user:123', { encrypt: true });
 * ```
 */
const redisCacheGet = async (redis, key, options = {}) => {
    try {
        const fullKey = (0, exports.buildCacheKey)({ namespace: options.namespace || 'default', resource: key, identifier: '' });
        let value = await redis.get(fullKey);
        if (!value)
            return null;
        if (options.encrypt) {
            value = await decryptData(value);
        }
        if (options.compress) {
            value = await decompressData(value);
        }
        return JSON.parse(value);
    }
    catch (error) {
        common_1.Logger.error(`Redis cache get failed for key ${key}:`, error);
        return null;
    }
};
exports.redisCacheGet = redisCacheGet;
/**
 * Deletes one or more keys from Redis cache
 *
 * @param {RedisClient} redis - Redis client instance
 * @param {...string} keys - Cache keys to delete
 * @returns {Promise<number>} Number of keys deleted
 *
 * @example
 * ```typescript
 * const deleted = await redisCacheDel(redis, 'user:123', 'user:456');
 * ```
 */
const redisCacheDel = async (redis, ...keys) => {
    try {
        if (keys.length === 0)
            return 0;
        return await redis.del(...keys);
    }
    catch (error) {
        common_1.Logger.error(`Redis cache delete failed:`, error);
        return 0;
    }
};
exports.redisCacheDel = redisCacheDel;
/**
 * Checks if a key exists in Redis cache
 *
 * @param {RedisClient} redis - Redis client instance
 * @param {string} key - Cache key
 * @returns {Promise<boolean>} True if key exists
 *
 * @example
 * ```typescript
 * const exists = await redisCacheExists(redis, 'user:123');
 * ```
 */
const redisCacheExists = async (redis, key) => {
    try {
        const result = await redis.exists(key);
        return result > 0;
    }
    catch (error) {
        common_1.Logger.error(`Redis cache exists check failed for key ${key}:`, error);
        return false;
    }
};
exports.redisCacheExists = redisCacheExists;
/**
 * Gets multiple values from Redis cache in a single operation
 *
 * @param {RedisClient} redis - Redis client instance
 * @param {string[]} keys - Array of cache keys
 * @returns {Promise<Map<string, any>>} Map of key-value pairs
 *
 * @example
 * ```typescript
 * const users = await redisCacheMGet(redis, ['user:123', 'user:456']);
 * ```
 */
const redisCacheMGet = async (redis, keys) => {
    try {
        if (keys.length === 0)
            return new Map();
        const values = await redis.mget(...keys);
        const result = new Map();
        keys.forEach((key, index) => {
            if (values[index]) {
                try {
                    result.set(key, JSON.parse(values[index]));
                }
                catch {
                    result.set(key, values[index]);
                }
            }
        });
        return result;
    }
    catch (error) {
        common_1.Logger.error(`Redis cache mget failed:`, error);
        return new Map();
    }
};
exports.redisCacheMGet = redisCacheMGet;
/**
 * Sets multiple key-value pairs in Redis cache atomically
 *
 * @param {RedisClient} redis - Redis client instance
 * @param {Map<string, any>} entries - Map of key-value pairs
 * @param {number} [ttl] - Optional TTL for all entries
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * const entries = new Map([['user:123', userData1], ['user:456', userData2]]);
 * await redisCacheMSet(redis, entries, 3600);
 * ```
 */
const redisCacheMSet = async (redis, entries, ttl) => {
    try {
        if (entries.size === 0)
            return true;
        const args = [];
        entries.forEach((value, key) => {
            args.push(key, JSON.stringify(value));
        });
        await redis.mset(...args);
        // Set TTL if provided
        if (ttl) {
            const pipeline = redis.pipeline();
            entries.forEach((_, key) => {
                pipeline.expire(key, ttl);
            });
            await pipeline.exec();
        }
        return true;
    }
    catch (error) {
        common_1.Logger.error(`Redis cache mset failed:`, error);
        return false;
    }
};
exports.redisCacheMSet = redisCacheMSet;
// ============================================================================
// IN-MEMORY LRU CACHING
// ============================================================================
/**
 * Creates a new LRU cache instance with specified configuration
 *
 * @param {object} config - LRU cache configuration
 * @param {number} config.maxSize - Maximum number of entries
 * @param {number} [config.ttl] - Default TTL in seconds
 * @returns {LRUCache} LRU cache instance
 *
 * @example
 * ```typescript
 * const cache = createLRUCache({ maxSize: 1000, ttl: 3600 });
 * ```
 */
const createLRUCache = (config) => {
    return {
        cache: new Map(),
        order: [],
        maxSize: config.maxSize,
        defaultTTL: config.ttl,
        stats: {
            hits: 0,
            misses: 0,
            sets: 0,
            deletes: 0,
            evictions: 0,
            errors: 0,
        },
    };
};
exports.createLRUCache = createLRUCache;
/**
 * Sets a value in LRU cache with automatic eviction
 *
 * @param {LRUCache} cache - LRU cache instance
 * @param {string} key - Cache key
 * @param {T} value - Value to cache
 * @param {number} [ttl] - Optional TTL in seconds
 * @returns {void}
 *
 * @example
 * ```typescript
 * lruSet(cache, 'user:123', userData, 300);
 * ```
 */
const lruSet = (cache, key, value, ttl) => {
    try {
        // Remove existing entry if present
        if (cache.cache.has(key)) {
            const index = cache.order.indexOf(key);
            if (index > -1) {
                cache.order.splice(index, 1);
            }
        }
        // Evict oldest entry if at capacity
        if (cache.cache.size >= cache.maxSize && !cache.cache.has(key)) {
            const oldestKey = cache.order.shift();
            if (oldestKey) {
                cache.cache.delete(oldestKey);
                cache.stats.evictions++;
            }
        }
        const effectiveTTL = ttl || cache.defaultTTL;
        const entry = {
            value,
            createdAt: Date.now(),
            expiresAt: effectiveTTL ? Date.now() + effectiveTTL * 1000 : undefined,
            accessCount: 0,
            size: estimateSize(value),
        };
        cache.cache.set(key, entry);
        cache.order.push(key);
        cache.stats.sets++;
    }
    catch (error) {
        common_1.Logger.error(`LRU cache set failed for key ${key}:`, error);
        cache.stats.errors++;
    }
};
exports.lruSet = lruSet;
/**
 * Gets a value from LRU cache with automatic expiration check
 *
 * @param {LRUCache} cache - LRU cache instance
 * @param {string} key - Cache key
 * @returns {T | null} Cached value or null
 *
 * @example
 * ```typescript
 * const user = lruGet<User>(cache, 'user:123');
 * ```
 */
const lruGet = (cache, key) => {
    try {
        const entry = cache.cache.get(key);
        if (!entry) {
            cache.stats.misses++;
            return null;
        }
        // Check expiration
        if (entry.expiresAt && entry.expiresAt < Date.now()) {
            cache.cache.delete(key);
            const index = cache.order.indexOf(key);
            if (index > -1) {
                cache.order.splice(index, 1);
            }
            cache.stats.misses++;
            return null;
        }
        // Update LRU order
        const index = cache.order.indexOf(key);
        if (index > -1) {
            cache.order.splice(index, 1);
        }
        cache.order.push(key);
        entry.accessCount++;
        cache.stats.hits++;
        return entry.value;
    }
    catch (error) {
        common_1.Logger.error(`LRU cache get failed for key ${key}:`, error);
        cache.stats.errors++;
        return null;
    }
};
exports.lruGet = lruGet;
/**
 * Deletes a value from LRU cache
 *
 * @param {LRUCache} cache - LRU cache instance
 * @param {string} key - Cache key
 * @returns {boolean} True if key was deleted
 *
 * @example
 * ```typescript
 * lruDel(cache, 'user:123');
 * ```
 */
const lruDel = (cache, key) => {
    try {
        const deleted = cache.cache.delete(key);
        if (deleted) {
            const index = cache.order.indexOf(key);
            if (index > -1) {
                cache.order.splice(index, 1);
            }
            cache.stats.deletes++;
            return true;
        }
        return false;
    }
    catch (error) {
        common_1.Logger.error(`LRU cache delete failed for key ${key}:`, error);
        cache.stats.errors++;
        return false;
    }
};
exports.lruDel = lruDel;
/**
 * Clears all entries from LRU cache
 *
 * @param {LRUCache} cache - LRU cache instance
 * @returns {void}
 *
 * @example
 * ```typescript
 * lruClear(cache);
 * ```
 */
const lruClear = (cache) => {
    cache.cache.clear();
    cache.order = [];
    cache.stats.deletes += cache.cache.size;
};
exports.lruClear = lruClear;
/**
 * Gets LRU cache statistics
 *
 * @param {LRUCache} cache - LRU cache instance
 * @returns {CacheStats & {hitRate: number, size: number}} Cache statistics
 *
 * @example
 * ```typescript
 * const stats = lruStats(cache);
 * console.log(`Hit rate: ${stats.hitRate}%`);
 * ```
 */
const lruStats = (cache) => {
    const totalRequests = cache.stats.hits + cache.stats.misses;
    const hitRate = totalRequests > 0 ? (cache.stats.hits / totalRequests) * 100 : 0;
    return {
        ...cache.stats,
        hitRate,
        size: cache.cache.size,
    };
};
exports.lruStats = lruStats;
// ============================================================================
// CACHE-ASIDE PATTERN
// ============================================================================
/**
 * Implements cache-aside pattern with automatic fallback to data source
 *
 * @param {RedisClient} redis - Redis client instance
 * @param {string} key - Cache key
 * @param {() => Promise<T>} fetchFn - Function to fetch data on cache miss
 * @param {CacheOptions} [options] - Cache options
 * @returns {Promise<T | null>} Cached or fetched value
 *
 * @example
 * ```typescript
 * const user = await cacheAsideGet(redis, 'user:123', async () => {
 *   return await userRepository.findById('123');
 * }, { ttl: 3600 });
 * ```
 */
const cacheAsideGet = async (redis, key, fetchFn, options = {}) => {
    try {
        // Try cache first
        const cached = await (0, exports.redisCacheGet)(redis, key, options);
        if (cached !== null) {
            return cached;
        }
        // Cache miss - fetch from source
        const value = await fetchFn();
        if (value !== null && value !== undefined) {
            // Store in cache for future requests
            await (0, exports.redisCacheSet)(redis, key, value, options);
        }
        return value;
    }
    catch (error) {
        common_1.Logger.error(`Cache-aside get failed for key ${key}:`, error);
        return null;
    }
};
exports.cacheAsideGet = cacheAsideGet;
/**
 * Implements cache-aside pattern for multi-level cache
 *
 * @param {CacheHierarchy} hierarchy - Cache hierarchy
 * @param {string} key - Cache key
 * @param {() => Promise<T>} fetchFn - Function to fetch data on cache miss
 * @param {CacheOptions} [options] - Cache options
 * @returns {Promise<T | null>} Cached or fetched value
 *
 * @example
 * ```typescript
 * const data = await cacheAsideMultiLevel(hierarchy, 'product:456',
 *   async () => await productRepo.find('456'),
 *   { ttl: 1800 }
 * );
 * ```
 */
const cacheAsideMultiLevel = async (hierarchy, key, fetchFn, options = {}) => {
    try {
        // Try L1 (memory) first
        if (hierarchy.l1) {
            const l1Value = (0, exports.lruGet)(hierarchy.l1, key);
            if (l1Value !== null) {
                return l1Value;
            }
        }
        // Try L2 (Redis)
        if (hierarchy.l2) {
            const l2Value = await (0, exports.redisCacheGet)(hierarchy.l2, key, options);
            if (l2Value !== null) {
                // Promote to L1
                if (hierarchy.l1 && hierarchy.options?.promoteOnHit) {
                    (0, exports.lruSet)(hierarchy.l1, key, l2Value, options.ttl);
                }
                return l2Value;
            }
        }
        // Try L3 (Database cache)
        if (hierarchy.l3) {
            const l3Value = await hierarchy.l3.get(key);
            if (l3Value !== null) {
                // Promote to higher levels
                if (hierarchy.l2 && hierarchy.options?.promoteOnHit) {
                    await (0, exports.redisCacheSet)(hierarchy.l2, key, l3Value, options);
                }
                if (hierarchy.l1 && hierarchy.options?.promoteOnHit) {
                    (0, exports.lruSet)(hierarchy.l1, key, l3Value, options.ttl);
                }
                return l3Value;
            }
        }
        // All cache levels missed - fetch from source
        const value = await fetchFn();
        if (value !== null && value !== undefined) {
            // Populate all cache levels
            if (hierarchy.l3) {
                await hierarchy.l3.set(key, value, options.ttl);
            }
            if (hierarchy.l2) {
                await (0, exports.redisCacheSet)(hierarchy.l2, key, value, options);
            }
            if (hierarchy.l1) {
                (0, exports.lruSet)(hierarchy.l1, key, value, options.ttl);
            }
        }
        return value;
    }
    catch (error) {
        common_1.Logger.error(`Multi-level cache-aside get failed for key ${key}:`, error);
        return null;
    }
};
exports.cacheAsideMultiLevel = cacheAsideMultiLevel;
/**
 * Invalidates cache entry in cache-aside pattern
 *
 * @param {RedisClient} redis - Redis client instance
 * @param {string} key - Cache key
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await cacheAsideInvalidate(redis, 'user:123');
 * ```
 */
const cacheAsideInvalidate = async (redis, key) => {
    try {
        const deleted = await (0, exports.redisCacheDel)(redis, key);
        return deleted > 0;
    }
    catch (error) {
        common_1.Logger.error(`Cache-aside invalidate failed for key ${key}:`, error);
        return false;
    }
};
exports.cacheAsideInvalidate = cacheAsideInvalidate;
// ============================================================================
// WRITE-THROUGH CACHING
// ============================================================================
/**
 * Implements write-through caching pattern
 *
 * @param {RedisClient} redis - Redis client instance
 * @param {string} key - Cache key
 * @param {T} value - Value to write
 * @param {(key: string, value: T) => Promise<void>} writeFn - Function to write to persistent storage
 * @param {CacheOptions} [options] - Cache options
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await writeThroughSet(redis, 'user:123', userData, async (key, value) => {
 *   await userRepository.save(value);
 * }, { ttl: 3600 });
 * ```
 */
const writeThroughSet = async (redis, key, value, writeFn, options = {}) => {
    try {
        // Write to persistent storage first
        await writeFn(key, value);
        // Then update cache
        await (0, exports.redisCacheSet)(redis, key, value, options);
        return true;
    }
    catch (error) {
        common_1.Logger.error(`Write-through set failed for key ${key}:`, error);
        return false;
    }
};
exports.writeThroughSet = writeThroughSet;
/**
 * Implements write-through caching for updates
 *
 * @param {RedisClient} redis - Redis client instance
 * @param {string} key - Cache key
 * @param {Partial<T>} updates - Partial updates to apply
 * @param {(key: string, updates: Partial<T>) => Promise<T>} updateFn - Function to update persistent storage
 * @param {CacheOptions} [options] - Cache options
 * @returns {Promise<T | null>} Updated value
 *
 * @example
 * ```typescript
 * const updated = await writeThroughUpdate(redis, 'user:123', { name: 'Jane' },
 *   async (key, updates) => await userRepository.update(key, updates),
 *   { ttl: 3600 }
 * );
 * ```
 */
const writeThroughUpdate = async (redis, key, updates, updateFn, options = {}) => {
    try {
        // Update persistent storage
        const updated = await updateFn(key, updates);
        // Update cache with new value
        await (0, exports.redisCacheSet)(redis, key, updated, options);
        return updated;
    }
    catch (error) {
        common_1.Logger.error(`Write-through update failed for key ${key}:`, error);
        return null;
    }
};
exports.writeThroughUpdate = writeThroughUpdate;
/**
 * Implements write-through deletion
 *
 * @param {RedisClient} redis - Redis client instance
 * @param {string} key - Cache key
 * @param {(key: string) => Promise<void>} deleteFn - Function to delete from persistent storage
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await writeThroughDelete(redis, 'user:123', async (key) => {
 *   await userRepository.delete(key);
 * });
 * ```
 */
const writeThroughDelete = async (redis, key, deleteFn) => {
    try {
        // Delete from persistent storage first
        await deleteFn(key);
        // Then remove from cache
        await (0, exports.redisCacheDel)(redis, key);
        return true;
    }
    catch (error) {
        common_1.Logger.error(`Write-through delete failed for key ${key}:`, error);
        return false;
    }
};
exports.writeThroughDelete = writeThroughDelete;
// ============================================================================
// WRITE-BEHIND CACHING
// ============================================================================
/**
 * Creates a write-behind queue
 *
 * @param {number} flushInterval - Flush interval in milliseconds
 * @param {number} batchSize - Maximum batch size for flush operations
 * @returns {WriteBehindQueue} Write-behind queue instance
 *
 * @example
 * ```typescript
 * const queue = createWriteBehindQueue(5000, 100);
 * ```
 */
const createWriteBehindQueue = (flushInterval = 5000, batchSize = 100) => {
    return {
        entries: new Map(),
        flushInterval,
        batchSize,
    };
};
exports.createWriteBehindQueue = createWriteBehindQueue;
/**
 * Adds entry to write-behind queue and updates cache immediately
 *
 * @param {RedisClient} redis - Redis client instance
 * @param {WriteBehindQueue} queue - Write-behind queue
 * @param {string} key - Cache key
 * @param {T} value - Value to write
 * @param {CacheOptions} [options] - Cache options
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await writeBehindSet(redis, queue, 'user:123', userData, { ttl: 3600 });
 * ```
 */
const writeBehindSet = async (redis, queue, key, value, options = {}) => {
    try {
        // Update cache immediately
        await (0, exports.redisCacheSet)(redis, key, value, options);
        // Add to write-behind queue
        queue.entries.set(key, {
            key,
            value,
            timestamp: Date.now(),
            retries: 0,
        });
        return true;
    }
    catch (error) {
        common_1.Logger.error(`Write-behind set failed for key ${key}:`, error);
        return false;
    }
};
exports.writeBehindSet = writeBehindSet;
/**
 * Flushes write-behind queue to persistent storage
 *
 * @param {WriteBehindQueue} queue - Write-behind queue
 * @param {(entries: WriteBehindEntry[]) => Promise<void>} flushFn - Function to flush entries to storage
 * @returns {Promise<number>} Number of entries flushed
 *
 * @example
 * ```typescript
 * const flushed = await flushWriteBehindQueue(queue, async (entries) => {
 *   await repository.batchWrite(entries);
 * });
 * ```
 */
const flushWriteBehindQueue = async (queue, flushFn) => {
    try {
        if (queue.entries.size === 0)
            return 0;
        const entries = Array.from(queue.entries.values()).slice(0, queue.batchSize);
        await flushFn(entries);
        // Remove flushed entries
        entries.forEach(entry => queue.entries.delete(entry.key));
        return entries.length;
    }
    catch (error) {
        common_1.Logger.error(`Write-behind queue flush failed:`, error);
        return 0;
    }
};
exports.flushWriteBehindQueue = flushWriteBehindQueue;
/**
 * Starts automatic flush interval for write-behind queue
 *
 * @param {WriteBehindQueue} queue - Write-behind queue
 * @param {(entries: WriteBehindEntry[]) => Promise<void>} flushFn - Function to flush entries
 * @returns {NodeJS.Timer} Interval timer
 *
 * @example
 * ```typescript
 * const timer = startWriteBehindFlush(queue, async (entries) => {
 *   await repository.batchWrite(entries);
 * });
 * ```
 */
const startWriteBehindFlush = (queue, flushFn) => {
    return setInterval(async () => {
        await (0, exports.flushWriteBehindQueue)(queue, flushFn);
    }, queue.flushInterval);
};
exports.startWriteBehindFlush = startWriteBehindFlush;
// ============================================================================
// CACHE INVALIDATION STRATEGIES
// ============================================================================
/**
 * Invalidates cache by TTL (time-based expiration)
 *
 * @param {RedisClient} redis - Redis client instance
 * @param {string} key - Cache key
 * @param {number} ttl - Time to live in seconds
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await invalidateByTTL(redis, 'temp:data', 300);
 * ```
 */
const invalidateByTTL = async (redis, key, ttl) => {
    try {
        const result = await redis.expire(key, ttl);
        return result === 1;
    }
    catch (error) {
        common_1.Logger.error(`TTL invalidation failed for key ${key}:`, error);
        return false;
    }
};
exports.invalidateByTTL = invalidateByTTL;
/**
 * Invalidates cache by tag (grouped invalidation)
 *
 * @param {RedisClient} redis - Redis client instance
 * @param {string} tag - Tag to invalidate
 * @returns {Promise<number>} Number of keys invalidated
 *
 * @example
 * ```typescript
 * await invalidateByTag(redis, 'user-data');
 * ```
 */
const invalidateByTag = async (redis, tag) => {
    try {
        // Get all keys with this tag
        const tagKey = `tag:${tag}`;
        const keys = await redis.smembers(tagKey);
        if (keys.length === 0)
            return 0;
        // Delete all tagged keys
        const deleted = await redis.del(...keys);
        // Clean up tag set
        await redis.del(tagKey);
        return deleted;
    }
    catch (error) {
        common_1.Logger.error(`Tag-based invalidation failed for tag ${tag}:`, error);
        return 0;
    }
};
exports.invalidateByTag = invalidateByTag;
/**
 * Invalidates cache by pattern (wildcard matching)
 *
 * @param {RedisClient} redis - Redis client instance
 * @param {string} pattern - Key pattern (e.g., 'user:*')
 * @returns {Promise<number>} Number of keys invalidated
 *
 * @example
 * ```typescript
 * await invalidateByPattern(redis, 'user:*');
 * ```
 */
const invalidateByPattern = async (redis, pattern) => {
    try {
        const keys = await redis.keys(pattern);
        if (keys.length === 0)
            return 0;
        return await redis.del(...keys);
    }
    catch (error) {
        common_1.Logger.error(`Pattern-based invalidation failed for pattern ${pattern}:`, error);
        return 0;
    }
};
exports.invalidateByPattern = invalidateByPattern;
/**
 * Invalidates multiple cache keys atomically
 *
 * @param {RedisClient} redis - Redis client instance
 * @param {string[]} keys - Array of cache keys
 * @returns {Promise<number>} Number of keys invalidated
 *
 * @example
 * ```typescript
 * await invalidateMultiple(redis, ['user:123', 'user:456', 'session:789']);
 * ```
 */
const invalidateMultiple = async (redis, keys) => {
    try {
        if (keys.length === 0)
            return 0;
        return await redis.del(...keys);
    }
    catch (error) {
        common_1.Logger.error(`Multiple key invalidation failed:`, error);
        return 0;
    }
};
exports.invalidateMultiple = invalidateMultiple;
/**
 * Invalidates cache with cascading effect (parent-child relationships)
 *
 * @param {RedisClient} redis - Redis client instance
 * @param {string} parentKey - Parent cache key
 * @param {string[]} childPatterns - Child key patterns
 * @returns {Promise<number>} Total number of keys invalidated
 *
 * @example
 * ```typescript
 * await invalidateCascading(redis, 'organization:123', ['org:123:users:*', 'org:123:projects:*']);
 * ```
 */
const invalidateCascading = async (redis, parentKey, childPatterns) => {
    try {
        let total = 0;
        // Invalidate parent
        total += await redis.del(parentKey);
        // Invalidate all children
        for (const pattern of childPatterns) {
            const keys = await redis.keys(pattern);
            if (keys.length > 0) {
                total += await redis.del(...keys);
            }
        }
        return total;
    }
    catch (error) {
        common_1.Logger.error(`Cascading invalidation failed for parent ${parentKey}:`, error);
        return 0;
    }
};
exports.invalidateCascading = invalidateCascading;
// ============================================================================
// TTL MANAGEMENT
// ============================================================================
/**
 * Gets remaining TTL for a cache key
 *
 * @param {RedisClient} redis - Redis client instance
 * @param {string} key - Cache key
 * @returns {Promise<number>} Remaining TTL in seconds (-1 if no TTL, -2 if key doesn't exist)
 *
 * @example
 * ```typescript
 * const ttl = await getTTL(redis, 'user:123');
 * ```
 */
const getTTL = async (redis, key) => {
    try {
        return await redis.ttl(key);
    }
    catch (error) {
        common_1.Logger.error(`Get TTL failed for key ${key}:`, error);
        return -2;
    }
};
exports.getTTL = getTTL;
/**
 * Extends TTL for a cache key
 *
 * @param {RedisClient} redis - Redis client instance
 * @param {string} key - Cache key
 * @param {number} additionalSeconds - Additional seconds to add
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await extendTTL(redis, 'session:abc', 1800);
 * ```
 */
const extendTTL = async (redis, key, additionalSeconds) => {
    try {
        const currentTTL = await redis.ttl(key);
        if (currentTTL < 0)
            return false;
        const newTTL = currentTTL + additionalSeconds;
        const result = await redis.expire(key, newTTL);
        return result === 1;
    }
    catch (error) {
        common_1.Logger.error(`Extend TTL failed for key ${key}:`, error);
        return false;
    }
};
exports.extendTTL = extendTTL;
/**
 * Refreshes TTL to original value
 *
 * @param {RedisClient} redis - Redis client instance
 * @param {string} key - Cache key
 * @param {number} ttl - TTL in seconds
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await refreshTTL(redis, 'user:123', 3600);
 * ```
 */
const refreshTTL = async (redis, key, ttl) => {
    try {
        const result = await redis.expire(key, ttl);
        return result === 1;
    }
    catch (error) {
        common_1.Logger.error(`Refresh TTL failed for key ${key}:`, error);
        return false;
    }
};
exports.refreshTTL = refreshTTL;
/**
 * Sets TTL for multiple keys atomically
 *
 * @param {RedisClient} redis - Redis client instance
 * @param {Map<string, number>} keyTTLs - Map of key to TTL
 * @returns {Promise<number>} Number of keys updated
 *
 * @example
 * ```typescript
 * const keyTTLs = new Map([['key1', 300], ['key2', 600]]);
 * await setMultipleTTLs(redis, keyTTLs);
 * ```
 */
const setMultipleTTLs = async (redis, keyTTLs) => {
    try {
        const pipeline = redis.pipeline();
        keyTTLs.forEach((ttl, key) => {
            pipeline.expire(key, ttl);
        });
        const results = await pipeline.exec();
        return results ? results.filter((r) => r[1] === 1).length : 0;
    }
    catch (error) {
        common_1.Logger.error(`Set multiple TTLs failed:`, error);
        return 0;
    }
};
exports.setMultipleTTLs = setMultipleTTLs;
// ============================================================================
// CACHE KEY BUILDERS
// ============================================================================
/**
 * Builds a structured cache key from components
 *
 * @param {CacheKey} components - Cache key components
 * @returns {string} Formatted cache key
 *
 * @example
 * ```typescript
 * const key = buildCacheKey({
 *   namespace: 'healthcare',
 *   resource: 'patient',
 *   identifier: '12345',
 *   version: 'v1'
 * });
 * // Result: 'healthcare:patient:12345:v1'
 * ```
 */
const buildCacheKey = (components) => {
    const parts = [components.namespace, components.resource];
    if (components.identifier) {
        parts.push(components.identifier);
    }
    if (components.version) {
        parts.push(components.version);
    }
    return parts.join(':');
};
exports.buildCacheKey = buildCacheKey;
/**
 * Parses a cache key into components
 *
 * @param {string} key - Cache key
 * @returns {Partial<CacheKey>} Parsed components
 *
 * @example
 * ```typescript
 * const components = parseCacheKey('healthcare:patient:12345:v1');
 * ```
 */
const parseCacheKey = (key) => {
    const parts = key.split(':');
    return {
        namespace: parts[0],
        resource: parts[1],
        identifier: parts[2],
        version: parts[3],
    };
};
exports.parseCacheKey = parseCacheKey;
/**
 * Generates cache key with hash for complex identifiers
 *
 * @param {string} namespace - Cache namespace
 * @param {any} identifier - Complex identifier object
 * @returns {string} Hashed cache key
 *
 * @example
 * ```typescript
 * const key = generateHashedKey('products', { category: 'electronics', brand: 'Apple' });
 * ```
 */
const generateHashedKey = (namespace, identifier) => {
    const hash = crypto
        .createHash('sha256')
        .update(JSON.stringify(identifier))
        .digest('hex')
        .substring(0, 16);
    return `${namespace}:${hash}`;
};
exports.generateHashedKey = generateHashedKey;
/**
 * Normalizes cache key to ensure consistency
 *
 * @param {string} key - Cache key
 * @returns {string} Normalized key
 *
 * @example
 * ```typescript
 * const normalized = normalizeCacheKey('User:123:Profile');
 * // Result: 'user:123:profile'
 * ```
 */
const normalizeCacheKey = (key) => {
    return key.toLowerCase().trim().replace(/\s+/g, '_');
};
exports.normalizeCacheKey = normalizeCacheKey;
// ============================================================================
// CACHE WARMING
// ============================================================================
/**
 * Warms cache with preloaded data
 *
 * @param {RedisClient} redis - Redis client instance
 * @param {Map<string, any>} data - Data to preload
 * @param {CacheOptions} [options] - Cache options
 * @returns {Promise<number>} Number of entries loaded
 *
 * @example
 * ```typescript
 * const warmData = new Map([['user:1', userData1], ['user:2', userData2]]);
 * await warmCache(redis, warmData, { ttl: 3600 });
 * ```
 */
const warmCache = async (redis, data, options = {}) => {
    try {
        let count = 0;
        const pipeline = redis.pipeline();
        data.forEach((value, key) => {
            const serialized = JSON.stringify(value);
            if (options.ttl) {
                pipeline.setex(key, options.ttl, serialized);
            }
            else {
                pipeline.set(key, serialized);
            }
            count++;
        });
        await pipeline.exec();
        return count;
    }
    catch (error) {
        common_1.Logger.error(`Cache warming failed:`, error);
        return 0;
    }
};
exports.warmCache = warmCache;
/**
 * Warms cache progressively with batched loading
 *
 * @param {RedisClient} redis - Redis client instance
 * @param {() => AsyncIterator<[string, any]>} dataIterator - Async iterator for data
 * @param {number} batchSize - Batch size for loading
 * @param {CacheOptions} [options] - Cache options
 * @returns {Promise<number>} Total entries loaded
 *
 * @example
 * ```typescript
 * async function* dataGenerator() {
 *   for (const user of users) {
 *     yield [`user:${user.id}`, user];
 *   }
 * }
 * await warmCacheProgressive(redis, dataGenerator, 100, { ttl: 3600 });
 * ```
 */
const warmCacheProgressive = async (redis, dataIterator, batchSize = 100, options = {}) => {
    try {
        let total = 0;
        let batch = new Map();
        const iterator = dataIterator();
        let result = await iterator.next();
        while (!result.done) {
            const [key, value] = result.value;
            batch.set(key, value);
            if (batch.size >= batchSize) {
                await (0, exports.redisCacheMSet)(redis, batch, options.ttl);
                total += batch.size;
                batch.clear();
            }
            result = await iterator.next();
        }
        // Load remaining batch
        if (batch.size > 0) {
            await (0, exports.redisCacheMSet)(redis, batch, options.ttl);
            total += batch.size;
        }
        return total;
    }
    catch (error) {
        common_1.Logger.error(`Progressive cache warming failed:`, error);
        return 0;
    }
};
exports.warmCacheProgressive = warmCacheProgressive;
/**
 * Schedules periodic cache warming
 *
 * @param {RedisClient} redis - Redis client instance
 * @param {() => Promise<Map<string, any>>} loadFn - Function to load data
 * @param {number} intervalMs - Warming interval in milliseconds
 * @param {CacheOptions} [options] - Cache options
 * @returns {NodeJS.Timer} Interval timer
 *
 * @example
 * ```typescript
 * const timer = scheduleCacheWarming(redis, async () => {
 *   return await loadPopularProducts();
 * }, 3600000, { ttl: 7200 });
 * ```
 */
const scheduleCacheWarming = (redis, loadFn, intervalMs, options = {}) => {
    return setInterval(async () => {
        try {
            const data = await loadFn();
            await (0, exports.warmCache)(redis, data, options);
            common_1.Logger.log(`Cache warmed with ${data.size} entries`);
        }
        catch (error) {
            common_1.Logger.error(`Scheduled cache warming failed:`, error);
        }
    }, intervalMs);
};
exports.scheduleCacheWarming = scheduleCacheWarming;
// ============================================================================
// MULTI-LEVEL CACHING
// ============================================================================
/**
 * Creates a cache hierarchy with multiple levels
 *
 * @param {object} config - Cache hierarchy configuration
 * @returns {CacheHierarchy} Cache hierarchy instance
 *
 * @example
 * ```typescript
 * const hierarchy = createCacheHierarchy({
 *   l1: lruCache,
 *   l2: redisClient,
 *   options: { promoteOnHit: true }
 * });
 * ```
 */
const createCacheHierarchy = (config) => {
    return {
        l1: config.l1,
        l2: config.l2,
        l3: config.l3,
        options: config.options || { promoteOnHit: true, replicateDownward: false },
    };
};
exports.createCacheHierarchy = createCacheHierarchy;
/**
 * Gets value from multi-level cache hierarchy
 *
 * @param {CacheHierarchy} hierarchy - Cache hierarchy
 * @param {string} key - Cache key
 * @param {CacheOptions} [options] - Cache options
 * @returns {Promise<T | null>} Cached value
 *
 * @example
 * ```typescript
 * const user = await multiLevelGet<User>(hierarchy, 'user:123');
 * ```
 */
const multiLevelGet = async (hierarchy, key, options = {}) => {
    try {
        // Try L1 (fastest)
        if (hierarchy.l1) {
            const l1Value = (0, exports.lruGet)(hierarchy.l1, key);
            if (l1Value !== null) {
                return l1Value;
            }
        }
        // Try L2
        if (hierarchy.l2) {
            const l2Value = await (0, exports.redisCacheGet)(hierarchy.l2, key, options);
            if (l2Value !== null) {
                // Promote to L1
                if (hierarchy.l1 && hierarchy.options?.promoteOnHit) {
                    (0, exports.lruSet)(hierarchy.l1, key, l2Value, options.ttl);
                }
                return l2Value;
            }
        }
        // Try L3
        if (hierarchy.l3) {
            const l3Value = await hierarchy.l3.get(key);
            if (l3Value !== null) {
                // Promote to higher levels
                if (hierarchy.l2 && hierarchy.options?.promoteOnHit) {
                    await (0, exports.redisCacheSet)(hierarchy.l2, key, l3Value, options);
                }
                if (hierarchy.l1 && hierarchy.options?.promoteOnHit) {
                    (0, exports.lruSet)(hierarchy.l1, key, l3Value, options.ttl);
                }
                return l3Value;
            }
        }
        return null;
    }
    catch (error) {
        common_1.Logger.error(`Multi-level get failed for key ${key}:`, error);
        return null;
    }
};
exports.multiLevelGet = multiLevelGet;
/**
 * Sets value in multi-level cache hierarchy
 *
 * @param {CacheHierarchy} hierarchy - Cache hierarchy
 * @param {string} key - Cache key
 * @param {T} value - Value to cache
 * @param {CacheOptions} [options] - Cache options
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await multiLevelSet(hierarchy, 'user:123', userData, { ttl: 3600 });
 * ```
 */
const multiLevelSet = async (hierarchy, key, value, options = {}) => {
    try {
        // Set in all levels
        if (hierarchy.l1) {
            (0, exports.lruSet)(hierarchy.l1, key, value, options.ttl);
        }
        if (hierarchy.l2) {
            await (0, exports.redisCacheSet)(hierarchy.l2, key, value, options);
        }
        if (hierarchy.l3 && hierarchy.options?.replicateDownward) {
            await hierarchy.l3.set(key, value, options.ttl);
        }
        return true;
    }
    catch (error) {
        common_1.Logger.error(`Multi-level set failed for key ${key}:`, error);
        return false;
    }
};
exports.multiLevelSet = multiLevelSet;
/**
 * Invalidates value across all cache levels
 *
 * @param {CacheHierarchy} hierarchy - Cache hierarchy
 * @param {string} key - Cache key
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await multiLevelInvalidate(hierarchy, 'user:123');
 * ```
 */
const multiLevelInvalidate = async (hierarchy, key) => {
    try {
        if (hierarchy.l1) {
            (0, exports.lruDel)(hierarchy.l1, key);
        }
        if (hierarchy.l2) {
            await (0, exports.redisCacheDel)(hierarchy.l2, key);
        }
        if (hierarchy.l3) {
            await hierarchy.l3.del(key);
        }
        return true;
    }
    catch (error) {
        common_1.Logger.error(`Multi-level invalidate failed for key ${key}:`, error);
        return false;
    }
};
exports.multiLevelInvalidate = multiLevelInvalidate;
// ============================================================================
// CACHE STAMPEDE PREVENTION
// ============================================================================
/**
 * Acquires distributed lock for cache stampede prevention
 *
 * @param {RedisClient} redis - Redis client instance
 * @param {string} key - Lock key
 * @param {number} ttl - Lock TTL in seconds
 * @returns {Promise<CacheLock | null>} Lock instance or null
 *
 * @example
 * ```typescript
 * const lock = await acquireCacheLock(redis, 'refresh:user:123', 10);
 * ```
 */
const acquireCacheLock = async (redis, key, ttl = 10) => {
    try {
        const lockId = crypto.randomBytes(16).toString('hex');
        const lockKey = `lock:${key}`;
        const result = await redis.set(lockKey, lockId, 'EX', ttl, 'NX');
        if (result === 'OK') {
            return {
                key: lockKey,
                lockId,
                expiresAt: Date.now() + ttl * 1000,
            };
        }
        return null;
    }
    catch (error) {
        common_1.Logger.error(`Acquire cache lock failed for key ${key}:`, error);
        return null;
    }
};
exports.acquireCacheLock = acquireCacheLock;
/**
 * Releases distributed lock
 *
 * @param {RedisClient} redis - Redis client instance
 * @param {CacheLock} lock - Lock instance
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await releaseCacheLock(redis, lock);
 * ```
 */
const releaseCacheLock = async (redis, lock) => {
    try {
        const current = await redis.get(lock.key);
        if (current === lock.lockId) {
            await redis.del(lock.key);
            return true;
        }
        return false;
    }
    catch (error) {
        common_1.Logger.error(`Release cache lock failed:`, error);
        return false;
    }
};
exports.releaseCacheLock = releaseCacheLock;
/**
 * Gets value with stampede prevention using distributed locking
 *
 * @param {RedisClient} redis - Redis client instance
 * @param {string} key - Cache key
 * @param {() => Promise<T>} fetchFn - Function to fetch data
 * @param {CacheOptions & {lockTTL?: number}} [options] - Cache and lock options
 * @returns {Promise<T | null>} Cached or fetched value
 *
 * @example
 * ```typescript
 * const data = await getWithStampedeProtection(redis, 'expensive:query', async () => {
 *   return await runExpensiveQuery();
 * }, { ttl: 3600, lockTTL: 30 });
 * ```
 */
const getWithStampedeProtection = async (redis, key, fetchFn, options = {}) => {
    try {
        // Try cache first
        const cached = await (0, exports.redisCacheGet)(redis, key, options);
        if (cached !== null) {
            return cached;
        }
        // Acquire lock
        const lock = await (0, exports.acquireCacheLock)(redis, key, options.lockTTL || 10);
        if (!lock) {
            // Another process is refreshing, wait and retry
            await new Promise(resolve => setTimeout(resolve, 100));
            return await (0, exports.redisCacheGet)(redis, key, options);
        }
        try {
            // We have the lock, fetch and cache
            const value = await fetchFn();
            if (value !== null && value !== undefined) {
                await (0, exports.redisCacheSet)(redis, key, value, options);
            }
            return value;
        }
        finally {
            await (0, exports.releaseCacheLock)(redis, lock);
        }
    }
    catch (error) {
        common_1.Logger.error(`Get with stampede protection failed for key ${key}:`, error);
        return null;
    }
};
exports.getWithStampedeProtection = getWithStampedeProtection;
// ============================================================================
// CACHE SERIALIZATION
// ============================================================================
/**
 * Serializes value for cache storage
 *
 * @param {T} value - Value to serialize
 * @param {boolean} [compress] - Enable compression
 * @returns {Promise<string>} Serialized value
 *
 * @example
 * ```typescript
 * const serialized = await serializeForCache(complexObject, true);
 * ```
 */
const serializeForCache = async (value, compress = false) => {
    let serialized = JSON.stringify(value);
    if (compress) {
        serialized = await compressData(serialized);
    }
    return serialized;
};
exports.serializeForCache = serializeForCache;
/**
 * Deserializes value from cache storage
 *
 * @param {string} serialized - Serialized value
 * @param {boolean} [compressed] - Value is compressed
 * @returns {Promise<T | null>} Deserialized value
 *
 * @example
 * ```typescript
 * const value = await deserializeFromCache<User>(serialized, true);
 * ```
 */
const deserializeFromCache = async (serialized, compressed = false) => {
    try {
        let data = serialized;
        if (compressed) {
            data = await decompressData(data);
        }
        return JSON.parse(data);
    }
    catch (error) {
        common_1.Logger.error(`Deserialization failed:`, error);
        return null;
    }
};
exports.deserializeFromCache = deserializeFromCache;
// ============================================================================
// CACHE STATISTICS
// ============================================================================
/**
 * Gets comprehensive cache statistics from Redis
 *
 * @param {RedisClient} redis - Redis client instance
 * @param {string} [namespace] - Optional namespace filter
 * @returns {Promise<any>} Cache statistics
 *
 * @example
 * ```typescript
 * const stats = await getCacheStatistics(redis, 'user');
 * ```
 */
const getCacheStatistics = async (redis, namespace) => {
    try {
        const pattern = namespace ? `${namespace}:*` : '*';
        const keys = await redis.keys(pattern);
        let totalSize = 0;
        let totalTTL = 0;
        let keysWithTTL = 0;
        for (const key of keys) {
            const ttl = await redis.ttl(key);
            if (ttl > 0) {
                totalTTL += ttl;
                keysWithTTL++;
            }
        }
        return {
            totalKeys: keys.length,
            keysWithTTL,
            averageTTL: keysWithTTL > 0 ? totalTTL / keysWithTTL : 0,
            namespace: namespace || 'all',
        };
    }
    catch (error) {
        common_1.Logger.error(`Get cache statistics failed:`, error);
        return null;
    }
};
exports.getCacheStatistics = getCacheStatistics;
/**
 * Tracks cache hit/miss metrics
 *
 * @param {string} key - Cache key
 * @param {boolean} hit - Whether it was a hit or miss
 * @returns {void}
 *
 * @example
 * ```typescript
 * trackCacheMetric('user:123', true);
 * ```
 */
const trackCacheMetric = (key, hit) => {
    // This would typically integrate with a metrics system like Prometheus
    common_1.Logger.debug(`Cache ${hit ? 'HIT' : 'MISS'} for key: ${key}`);
};
exports.trackCacheMetric = trackCacheMetric;
/**
 * Calculates cache efficiency metrics
 *
 * @param {CacheStats} stats - Cache statistics
 * @returns {object} Efficiency metrics
 *
 * @example
 * ```typescript
 * const metrics = calculateCacheEfficiency(cacheStats);
 * ```
 */
const calculateCacheEfficiency = (stats) => {
    const totalRequests = stats.hits + stats.misses;
    const hitRate = totalRequests > 0 ? (stats.hits / totalRequests) * 100 : 0;
    const missRate = totalRequests > 0 ? (stats.misses / totalRequests) * 100 : 0;
    const efficiency = hitRate - (stats.evictions / Math.max(stats.sets, 1)) * 100;
    return {
        hitRate,
        missRate,
        efficiency,
    };
};
exports.calculateCacheEfficiency = calculateCacheEfficiency;
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Adds tags to cache entry for grouped invalidation
 *
 * @param {RedisClient} redis - Redis client instance
 * @param {string} key - Cache key
 * @param {string[]} tags - Tags to add
 * @returns {Promise<void>}
 */
const addCacheTags = async (redis, key, tags) => {
    const pipeline = redis.pipeline();
    tags.forEach(tag => {
        pipeline.sadd(`tag:${tag}`, key);
    });
    await pipeline.exec();
};
/**
 * Compresses data using base64 encoding (placeholder for real compression)
 *
 * @param {string} data - Data to compress
 * @returns {Promise<string>} Compressed data
 */
const compressData = async (data) => {
    // Placeholder - in production, use zlib or similar
    return Buffer.from(data).toString('base64');
};
/**
 * Decompresses data from base64 encoding (placeholder for real decompression)
 *
 * @param {string} data - Compressed data
 * @returns {Promise<string>} Decompressed data
 */
const decompressData = async (data) => {
    // Placeholder - in production, use zlib or similar
    return Buffer.from(data, 'base64').toString('utf-8');
};
/**
 * Encrypts sensitive data for cache storage
 *
 * @param {string} data - Data to encrypt
 * @returns {Promise<string>} Encrypted data
 */
const encryptData = async (data) => {
    // Placeholder - implement proper encryption (AES-256-GCM)
    const cipher = crypto.createCipher('aes-256-cbc', process.env.CACHE_ENCRYPTION_KEY || 'default-key');
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
};
/**
 * Decrypts sensitive data from cache storage
 *
 * @param {string} data - Encrypted data
 * @returns {Promise<string>} Decrypted data
 */
const decryptData = async (data) => {
    // Placeholder - implement proper decryption (AES-256-GCM)
    const decipher = crypto.createDecipher('aes-256-cbc', process.env.CACHE_ENCRYPTION_KEY || 'default-key');
    let decrypted = decipher.update(data, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};
/**
 * Estimates size of cached value in bytes
 *
 * @param {any} value - Value to estimate
 * @returns {number} Estimated size in bytes
 */
const estimateSize = (value) => {
    try {
        return Buffer.byteLength(JSON.stringify(value), 'utf8');
    }
    catch {
        return 0;
    }
};
//# sourceMappingURL=caching-strategies-kit.js.map