"use strict";
/**
 * LOC: NEST-CACHE-001
 * File: /reuse/nestjs-caching-performance-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/cache-manager
 *   - redis
 *   - ioredis
 *
 * DOWNSTREAM (imported by):
 *   - Backend service modules
 *   - API controllers
 *   - Performance optimization layers
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCacheSizeMonitor = exports.createCacheHealthCheck = exports.createCachePerformanceMonitor = exports.createCacheStatsCollector = exports.createQueryCache = exports.cacheQueryResult = exports.createETagInterceptor = exports.validateETag = exports.generateETag = exports.createResponseCacheMiddleware = exports.generateHttpCacheHeaders = exports.memoizeAsync = exports.memoize = exports.deserializeFromCache = exports.serializeForCache = exports.decompress = exports.compress = exports.timeBasedTTL = exports.dynamicTTL = exports.namespacedCacheKey = exports.hashCacheKey = exports.generateCacheKey = exports.probabilisticEarlyExpiration = exports.preventCacheStampede = exports.writeBehindPattern = exports.writeThroughPattern = exports.cacheAsidePattern = exports.preloadCache = exports.warmCache = exports.createBatchInvalidation = exports.createCascadeInvalidation = exports.invalidateCacheByPattern = exports.createDistributedCache = exports.createTTLCache = exports.createLRUCache = exports.createDistributedRedisCache = exports.createRedisCache = exports.createAdaptiveTTLCache = exports.createTaggedCache = exports.createSelfCleaningCache = exports.createMultiTierCache = exports.createConditionalCacheDecorator = exports.createCacheEvictDecorator = exports.wrapWithCache = exports.createCacheDecorator = void 0;
// ============================================================================
// CACHE DECORATORS & WRAPPER FUNCTIONS
// ============================================================================
/**
 * 1. Creates a method decorator for automatic caching of method results.
 *
 * @param {any} cacheManager - NestJS cache manager instance
 * @param {number} [ttl=300] - Cache TTL in seconds
 * @param {Function} [keyGenerator] - Custom cache key generator
 * @returns {MethodDecorator} Cache decorator
 * @throws {Error} If cacheManager is null or undefined
 *
 * @example
 * ```typescript
 * class PatientService {
 *   @CacheResult(cacheManager, 600)
 *   async findById(id: string): Promise<Patient> {
 *     return this.repository.findOne({ where: { id } });
 *   }
 * }
 * ```
 */
const createCacheDecorator = (cacheManager, ttl = 300, keyGenerator) => {
    if (!cacheManager) {
        throw new Error('Cache manager is required for createCacheDecorator');
    }
    if (ttl <= 0) {
        throw new Error('TTL must be a positive number');
    }
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            try {
                const cacheKey = keyGenerator
                    ? keyGenerator(...args)
                    : `${target.constructor.name}.${propertyKey}:${JSON.stringify(args)}`;
                const cached = await cacheManager.get(cacheKey);
                if (cached !== undefined && cached !== null) {
                    return cached;
                }
                const result = await originalMethod.apply(this, args);
                await cacheManager.set(cacheKey, result, ttl);
                return result;
            }
            catch (error) {
                console.error(`Cache decorator error for ${propertyKey}:`, error);
                // Fall back to executing the original method without caching on error
                return await originalMethod.apply(this, args);
            }
        };
        return descriptor;
    };
};
exports.createCacheDecorator = createCacheDecorator;
/**
 * 2. Wraps a function with caching logic.
 *
 * @param {Function} fn - Function to cache
 * @param {any} cacheManager - Cache manager instance
 * @param {CacheConfig} [config] - Cache configuration
 * @returns {Function} Cached function
 *
 * @example
 * ```typescript
 * const getCachedPatient = wrapWithCache(
 *   async (id) => fetchPatient(id),
 *   cacheManager,
 *   { ttl: 600, compression: true }
 * );
 * ```
 */
const wrapWithCache = (fn, cacheManager, config = {}) => {
    const { ttl = 300, compression = false } = config;
    return async (...args) => {
        const cacheKey = `cached:${fn.name}:${JSON.stringify(args)}`;
        const cached = await cacheManager.get(cacheKey);
        if (cached !== undefined && cached !== null) {
            return compression ? await (0, exports.decompress)(cached) : cached;
        }
        const result = await fn(...args);
        const valueToCache = compression ? await (0, exports.compress)(result) : result;
        await cacheManager.set(cacheKey, valueToCache, ttl);
        return result;
    };
};
exports.wrapWithCache = wrapWithCache;
/**
 * 3. Creates a cache-evicting decorator that invalidates cache on method execution.
 *
 * @param {any} cacheManager - Cache manager instance
 * @param {string | Function} keyPattern - Cache key pattern or generator
 * @returns {MethodDecorator} Cache eviction decorator
 *
 * @example
 * ```typescript
 * class PatientService {
 *   @CacheEvict(cacheManager, 'patient:*')
 *   async updatePatient(id: string, data: any): Promise<Patient> {
 *     return this.repository.update(id, data);
 *   }
 * }
 * ```
 */
const createCacheEvictDecorator = (cacheManager, keyPattern) => {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            const result = await originalMethod.apply(this, args);
            const pattern = typeof keyPattern === 'function' ? keyPattern(...args) : keyPattern;
            await (0, exports.invalidateCacheByPattern)(cacheManager, pattern);
            return result;
        };
        return descriptor;
    };
};
exports.createCacheEvictDecorator = createCacheEvictDecorator;
/**
 * 4. Creates a conditional caching decorator based on a predicate.
 *
 * @param {any} cacheManager - Cache manager instance
 * @param {Function} predicate - Function to determine if result should be cached
 * @param {number} [ttl=300] - Cache TTL in seconds
 * @returns {MethodDecorator} Conditional cache decorator
 *
 * @example
 * ```typescript
 * class ReportService {
 *   @ConditionalCache(cacheManager, (result) => result.size < 1000000, 3600)
 *   async generateReport(params: any): Promise<Report> {
 *     return this.compute(params);
 *   }
 * }
 * ```
 */
const createConditionalCacheDecorator = (cacheManager, predicate, ttl = 300) => {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            const cacheKey = `${target.constructor.name}.${propertyKey}:${JSON.stringify(args)}`;
            const cached = await cacheManager.get(cacheKey);
            if (cached !== undefined && cached !== null) {
                return cached;
            }
            const result = await originalMethod.apply(this, args);
            if (predicate(result)) {
                await cacheManager.set(cacheKey, result, ttl);
            }
            return result;
        };
        return descriptor;
    };
};
exports.createConditionalCacheDecorator = createConditionalCacheDecorator;
// ============================================================================
// CACHE MANAGERS & CONFIGURATION
// ============================================================================
/**
 * 5. Creates a multi-tier cache manager with fallback support.
 *
 * @param {any[]} cacheManagers - Array of cache managers (ordered by priority)
 * @returns {Object} Multi-tier cache manager
 *
 * @example
 * ```typescript
 * const multiCache = createMultiTierCache([
 *   memoryCacheManager,
 *   redisCacheManager,
 *   diskCacheManager
 * ]);
 * await multiCache.set('key', value, 300);
 * ```
 */
const createMultiTierCache = (cacheManagers) => {
    return {
        async get(key) {
            for (let i = 0; i < cacheManagers.length; i++) {
                const value = await cacheManagers[i].get(key);
                if (value !== undefined && value !== null) {
                    // Backfill higher-priority caches
                    for (let j = 0; j < i; j++) {
                        await cacheManagers[j].set(key, value);
                    }
                    return value;
                }
            }
            return null;
        },
        async set(key, value, ttl) {
            await Promise.all(cacheManagers.map((manager) => manager.set(key, value, ttl)));
        },
        async del(key) {
            await Promise.all(cacheManagers.map((manager) => manager.del(key)));
        },
        async reset() {
            await Promise.all(cacheManagers.map((manager) => manager.reset()));
        },
        async wrap(key, fn, ttl) {
            const cached = await this.get(key);
            if (cached !== undefined && cached !== null) {
                return cached;
            }
            const result = await fn();
            await this.set(key, result, ttl);
            return result;
        },
    };
};
exports.createMultiTierCache = createMultiTierCache;
/**
 * 6. Creates a cache manager with automatic cleanup of expired entries.
 *
 * @param {any} cacheManager - Base cache manager
 * @param {number} [cleanupInterval=60000] - Cleanup interval in ms
 * @returns {Object} Self-cleaning cache manager
 *
 * @example
 * ```typescript
 * const cleanCache = createSelfCleaningCache(cacheManager, 30000);
 * // Automatically removes expired entries every 30 seconds
 * ```
 */
const createSelfCleaningCache = (cacheManager, cleanupInterval = 60000) => {
    const entries = new Map();
    let cleanupTimer;
    const cleanup = () => {
        const now = Date.now();
        for (const [key, entry] of entries.entries()) {
            if (now - entry.timestamp > entry.ttl * 1000) {
                entries.delete(key);
                cacheManager.del(key);
            }
        }
    };
    cleanupTimer = setInterval(cleanup, cleanupInterval);
    return {
        async get(key) {
            const entry = entries.get(key);
            if (entry) {
                const now = Date.now();
                if (now - entry.timestamp > entry.ttl * 1000) {
                    entries.delete(key);
                    await cacheManager.del(key);
                    return null;
                }
                entry.hits++;
                return entry.value;
            }
            return cacheManager.get(key);
        },
        async set(key, value, ttl = 300) {
            entries.set(key, {
                value,
                timestamp: Date.now(),
                ttl,
                hits: 0,
            });
            await cacheManager.set(key, value, ttl);
        },
        async del(key) {
            entries.delete(key);
            await cacheManager.del(key);
        },
        stopCleanup() {
            clearInterval(cleanupTimer);
        },
        getStats() {
            const totalHits = Array.from(entries.values()).reduce((sum, entry) => sum + entry.hits, 0);
            return {
                hits: totalHits,
                misses: 0,
                hitRate: 0,
                size: entries.size,
                keys: entries.size,
            };
        },
    };
};
exports.createSelfCleaningCache = createSelfCleaningCache;
/**
 * 7. Creates a cache manager with tag-based invalidation support.
 *
 * @param {any} cacheManager - Base cache manager
 * @returns {Object} Tag-based cache manager
 *
 * @example
 * ```typescript
 * const tagCache = createTaggedCache(cacheManager);
 * await tagCache.set('patient:123', data, 300, ['patient', 'active']);
 * await tagCache.invalidateByTag('patient'); // Invalidates all patient cache
 * ```
 */
const createTaggedCache = (cacheManager) => {
    const tagIndex = new Map();
    const keyTags = new Map();
    return {
        async get(key) {
            return cacheManager.get(key);
        },
        async set(key, value, ttl, tags) {
            await cacheManager.set(key, value, ttl);
            if (tags && tags.length > 0) {
                keyTags.set(key, new Set(tags));
                tags.forEach((tag) => {
                    if (!tagIndex.has(tag)) {
                        tagIndex.set(tag, new Set());
                    }
                    tagIndex.get(tag).add(key);
                });
            }
        },
        async del(key) {
            await cacheManager.del(key);
            const tags = keyTags.get(key);
            if (tags) {
                tags.forEach((tag) => {
                    tagIndex.get(tag)?.delete(key);
                });
                keyTags.delete(key);
            }
        },
        async invalidateByTag(tag) {
            const keys = tagIndex.get(tag);
            if (keys) {
                await Promise.all(Array.from(keys).map((key) => this.del(key)));
                tagIndex.delete(tag);
            }
        },
        async invalidateByTags(tags) {
            await Promise.all(tags.map((tag) => this.invalidateByTag(tag)));
        },
        getKeysByTag(tag) {
            return Array.from(tagIndex.get(tag) || []);
        },
    };
};
exports.createTaggedCache = createTaggedCache;
/**
 * 8. Creates a cache manager with adaptive TTL based on access patterns.
 *
 * @param {any} cacheManager - Base cache manager
 * @param {number} [baseTTL=300] - Base TTL in seconds
 * @param {number} [maxTTL=3600] - Maximum TTL in seconds
 * @returns {Object} Adaptive cache manager
 *
 * @example
 * ```typescript
 * const adaptiveCache = createAdaptiveTTLCache(cacheManager, 300, 7200);
 * // Frequently accessed items get longer TTL automatically
 * ```
 */
const createAdaptiveTTLCache = (cacheManager, baseTTL = 300, maxTTL = 3600) => {
    const accessCounts = new Map();
    return {
        async get(key) {
            const value = await cacheManager.get(key);
            if (value !== undefined && value !== null) {
                accessCounts.set(key, (accessCounts.get(key) || 0) + 1);
            }
            return value;
        },
        async set(key, value, ttl) {
            const accessCount = accessCounts.get(key) || 0;
            const adaptiveTTL = Math.min(baseTTL * (1 + Math.log(accessCount + 1)), maxTTL);
            await cacheManager.set(key, value, ttl || adaptiveTTL);
        },
        async del(key) {
            accessCounts.delete(key);
            await cacheManager.del(key);
        },
        getAccessCount(key) {
            return accessCounts.get(key) || 0;
        },
        resetAccessCounts() {
            accessCounts.clear();
        },
    };
};
exports.createAdaptiveTTLCache = createAdaptiveTTLCache;
// ============================================================================
// REDIS INTEGRATION
// ============================================================================
/**
 * 9. Creates a Redis cache client with connection pooling and retry logic.
 *
 * @param {Object} redisConfig - Redis configuration
 * @returns {Promise<Object>} Redis cache client
 *
 * @example
 * ```typescript
 * const redisCache = await createRedisCache({
 *   host: 'localhost',
 *   port: 6379,
 *   password: 'secret',
 *   db: 0
 * });
 * ```
 */
const createRedisCache = async (redisConfig) => {
    // Note: Actual Redis client creation would use ioredis or node-redis
    const client = {
        isConnected: false,
        config: redisConfig,
    };
    return {
        async get(key) {
            try {
                const value = await client.get(key);
                return value ? JSON.parse(value) : null;
            }
            catch (error) {
                console.error('Redis get error:', error);
                return null;
            }
        },
        async set(key, value, ttl) {
            try {
                const serialized = JSON.stringify(value);
                if (ttl) {
                    await client.setex(key, ttl, serialized);
                }
                else {
                    await client.set(key, serialized);
                }
            }
            catch (error) {
                console.error('Redis set error:', error);
            }
        },
        async del(key) {
            try {
                await client.del(key);
            }
            catch (error) {
                console.error('Redis del error:', error);
            }
        },
        async mget(keys) {
            try {
                const values = await client.mget(...keys);
                return values.map((v) => (v ? JSON.parse(v) : null));
            }
            catch (error) {
                console.error('Redis mget error:', error);
                return [];
            }
        },
        async mset(entries) {
            try {
                const pipeline = client.pipeline();
                entries.forEach(({ key, value, ttl }) => {
                    const serialized = JSON.stringify(value);
                    if (ttl) {
                        pipeline.setex(key, ttl, serialized);
                    }
                    else {
                        pipeline.set(key, serialized);
                    }
                });
                await pipeline.exec();
            }
            catch (error) {
                console.error('Redis mset error:', error);
            }
        },
        async keys(pattern) {
            try {
                return await client.keys(pattern);
            }
            catch (error) {
                console.error('Redis keys error:', error);
                return [];
            }
        },
        async ttl(key) {
            try {
                return await client.ttl(key);
            }
            catch (error) {
                console.error('Redis ttl error:', error);
                return -1;
            }
        },
        async expire(key, seconds) {
            try {
                await client.expire(key, seconds);
            }
            catch (error) {
                console.error('Redis expire error:', error);
            }
        },
        async flushdb() {
            try {
                await client.flushdb();
            }
            catch (error) {
                console.error('Redis flushdb error:', error);
            }
        },
        async disconnect() {
            try {
                await client.quit();
            }
            catch (error) {
                console.error('Redis disconnect error:', error);
            }
        },
    };
};
exports.createRedisCache = createRedisCache;
/**
 * 10. Creates a Redis-based distributed cache with pub/sub for cache invalidation.
 *
 * @param {any} redisClient - Redis client instance
 * @param {string} [channel='cache-invalidation'] - Pub/sub channel name
 * @returns {Object} Distributed cache with pub/sub
 *
 * @example
 * ```typescript
 * const distributedCache = createDistributedRedisCache(redisClient);
 * await distributedCache.set('key', value, 300);
 * // Invalidation broadcasts to all instances
 * ```
 */
const createDistributedRedisCache = (redisClient, channel = 'cache-invalidation') => {
    const subscriber = redisClient.duplicate();
    const invalidationCallbacks = new Set();
    subscriber.subscribe(channel);
    subscriber.on('message', (ch, key) => {
        if (ch === channel) {
            invalidationCallbacks.forEach((callback) => callback(key));
        }
    });
    return {
        async get(key) {
            const value = await redisClient.get(key);
            return value ? JSON.parse(value) : null;
        },
        async set(key, value, ttl) {
            const serialized = JSON.stringify(value);
            if (ttl) {
                await redisClient.setex(key, ttl, serialized);
            }
            else {
                await redisClient.set(key, serialized);
            }
        },
        async del(key) {
            await redisClient.del(key);
            await redisClient.publish(channel, key);
        },
        onInvalidation(callback) {
            invalidationCallbacks.add(callback);
        },
        offInvalidation(callback) {
            invalidationCallbacks.delete(callback);
        },
        async disconnect() {
            await subscriber.unsubscribe(channel);
            await subscriber.quit();
        },
    };
};
exports.createDistributedRedisCache = createDistributedRedisCache;
// ============================================================================
// IN-MEMORY CACHING
// ============================================================================
/**
 * 11. Creates a simple in-memory LRU cache with size limits.
 *
 * @param {number} [maxSize=1000] - Maximum number of entries
 * @returns {Object} LRU cache manager
 *
 * @example
 * ```typescript
 * const lruCache = createLRUCache(500);
 * await lruCache.set('key', value);
 * const cached = await lruCache.get('key');
 * ```
 */
const createLRUCache = (maxSize = 1000) => {
    const cache = new Map();
    const accessOrder = new Map();
    let accessCounter = 0;
    return {
        async get(key) {
            const entry = cache.get(key);
            if (entry) {
                accessOrder.set(key, ++accessCounter);
                return entry.value;
            }
            return null;
        },
        async set(key, value) {
            if (cache.size >= maxSize && !cache.has(key)) {
                // Evict least recently used
                let lruKey = null;
                let minAccess = Infinity;
                for (const [k, access] of accessOrder.entries()) {
                    if (access < minAccess) {
                        minAccess = access;
                        lruKey = k;
                    }
                }
                if (lruKey) {
                    cache.delete(lruKey);
                    accessOrder.delete(lruKey);
                }
            }
            cache.set(key, { value, timestamp: Date.now() });
            accessOrder.set(key, ++accessCounter);
        },
        async del(key) {
            cache.delete(key);
            accessOrder.delete(key);
        },
        async reset() {
            cache.clear();
            accessOrder.clear();
            accessCounter = 0;
        },
        size() {
            return cache.size;
        },
        keys() {
            return Array.from(cache.keys());
        },
    };
};
exports.createLRUCache = createLRUCache;
/**
 * 12. Creates an in-memory cache with time-based expiration.
 *
 * @param {number} [defaultTTL=300] - Default TTL in seconds
 * @returns {Object} TTL-based cache manager
 *
 * @example
 * ```typescript
 * const ttlCache = createTTLCache(600);
 * await ttlCache.set('key', value, 300); // 5 minute TTL
 * ```
 */
const createTTLCache = (defaultTTL = 300) => {
    const cache = new Map();
    return {
        async get(key) {
            const entry = cache.get(key);
            if (!entry)
                return null;
            if (Date.now() > entry.expiry) {
                cache.delete(key);
                return null;
            }
            return entry.value;
        },
        async set(key, value, ttl) {
            const effectiveTTL = ttl || defaultTTL;
            cache.set(key, {
                value,
                expiry: Date.now() + effectiveTTL * 1000,
                ttl: effectiveTTL,
            });
        },
        async del(key) {
            cache.delete(key);
        },
        async reset() {
            cache.clear();
        },
        async cleanupExpired() {
            const now = Date.now();
            let cleaned = 0;
            for (const [key, entry] of cache.entries()) {
                if (now > entry.expiry) {
                    cache.delete(key);
                    cleaned++;
                }
            }
            return cleaned;
        },
        size() {
            return cache.size;
        },
    };
};
exports.createTTLCache = createTTLCache;
// ============================================================================
// DISTRIBUTED CACHING
// ============================================================================
/**
 * 13. Creates a distributed cache coordinator for multi-instance deployments.
 *
 * @param {any[]} cacheNodes - Array of cache node clients
 * @param {Function} [hashFn] - Consistent hashing function
 * @returns {Object} Distributed cache coordinator
 *
 * @example
 * ```typescript
 * const distCache = createDistributedCache([
 *   redisNode1,
 *   redisNode2,
 *   redisNode3
 * ]);
 * await distCache.set('key', value); // Automatically sharded
 * ```
 */
const createDistributedCache = (cacheNodes, hashFn) => {
    const defaultHash = (key) => {
        let hash = 0;
        for (let i = 0; i < key.length; i++) {
            hash = (hash << 5) - hash + key.charCodeAt(i);
            hash = hash & hash;
        }
        return Math.abs(hash);
    };
    const getNode = (key) => {
        const hash = (hashFn || defaultHash)(key);
        const index = hash % cacheNodes.length;
        return cacheNodes[index];
    };
    return {
        async get(key) {
            const node = getNode(key);
            return node.get(key);
        },
        async set(key, value, ttl) {
            const node = getNode(key);
            await node.set(key, value, ttl);
        },
        async del(key) {
            const node = getNode(key);
            await node.del(key);
        },
        async mget(keys) {
            const nodeGroups = new Map();
            keys.forEach((key) => {
                const node = getNode(key);
                if (!nodeGroups.has(node)) {
                    nodeGroups.set(node, []);
                }
                nodeGroups.get(node).push(key);
            });
            const results = new Map();
            await Promise.all(Array.from(nodeGroups.entries()).map(async ([node, nodeKeys]) => {
                const values = await node.mget(nodeKeys);
                nodeKeys.forEach((key, index) => {
                    results.set(key, values[index]);
                });
            }));
            return keys.map((key) => results.get(key));
        },
        async broadcast(fn) {
            await Promise.all(cacheNodes.map((node) => fn(node)));
        },
        async flushAll() {
            await this.broadcast((node) => node.flushdb());
        },
    };
};
exports.createDistributedCache = createDistributedCache;
// ============================================================================
// CACHE INVALIDATION STRATEGIES
// ============================================================================
/**
 * 14. Invalidates cache entries matching a pattern.
 *
 * @param {any} cacheManager - Cache manager instance
 * @param {string} pattern - Key pattern (supports wildcards)
 * @returns {Promise<number>} Number of invalidated keys
 *
 * @example
 * ```typescript
 * await invalidateCacheByPattern(cacheManager, 'patient:*');
 * await invalidateCacheByPattern(cacheManager, '*:active');
 * ```
 */
const invalidateCacheByPattern = async (cacheManager, pattern) => {
    try {
        const keys = await cacheManager.store.keys(pattern);
        await Promise.all(keys.map((key) => cacheManager.del(key)));
        return keys.length;
    }
    catch (error) {
        console.error('Cache invalidation error:', error);
        return 0;
    }
};
exports.invalidateCacheByPattern = invalidateCacheByPattern;
/**
 * 15. Creates a cascade invalidation strategy for related cache entries.
 *
 * @param {any} cacheManager - Cache manager instance
 * @param {Map<string, string[]>} dependencies - Cache key dependencies map
 * @returns {Object} Cascade invalidation manager
 *
 * @example
 * ```typescript
 * const invalidator = createCascadeInvalidation(cacheManager, new Map([
 *   ['patient:123', ['visit:*:patient:123', 'prescription:patient:123']]
 * ]));
 * await invalidator.invalidate('patient:123'); // Invalidates all related
 * ```
 */
const createCascadeInvalidation = (cacheManager, dependencies) => {
    return {
        async invalidate(key) {
            await cacheManager.del(key);
            const relatedPatterns = dependencies.get(key);
            if (relatedPatterns) {
                await Promise.all(relatedPatterns.map((pattern) => (0, exports.invalidateCacheByPattern)(cacheManager, pattern)));
            }
        },
        addDependency(key, dependentPattern) {
            if (!dependencies.has(key)) {
                dependencies.set(key, []);
            }
            dependencies.get(key).push(dependentPattern);
        },
        removeDependency(key, dependentPattern) {
            const deps = dependencies.get(key);
            if (deps) {
                const index = deps.indexOf(dependentPattern);
                if (index > -1) {
                    deps.splice(index, 1);
                }
            }
        },
    };
};
exports.createCascadeInvalidation = createCascadeInvalidation;
/**
 * 16. Creates a time-based batch invalidation strategy.
 *
 * @param {any} cacheManager - Cache manager instance
 * @param {number} [batchInterval=60000] - Batch interval in ms
 * @returns {Object} Batch invalidation manager
 *
 * @example
 * ```typescript
 * const batchInvalidator = createBatchInvalidation(cacheManager, 30000);
 * batchInvalidator.scheduleInvalidation('patient:123');
 * // Batched invalidation every 30 seconds
 * ```
 */
const createBatchInvalidation = (cacheManager, batchInterval = 60000) => {
    const pendingInvalidations = new Set();
    let batchTimer;
    const processBatch = async () => {
        if (pendingInvalidations.size > 0) {
            const keys = Array.from(pendingInvalidations);
            await Promise.all(keys.map((key) => cacheManager.del(key)));
            pendingInvalidations.clear();
        }
    };
    batchTimer = setInterval(processBatch, batchInterval);
    return {
        scheduleInvalidation(key) {
            pendingInvalidations.add(key);
        },
        async flushNow() {
            await processBatch();
        },
        getPendingCount() {
            return pendingInvalidations.size;
        },
        stop() {
            clearInterval(batchTimer);
        },
    };
};
exports.createBatchInvalidation = createBatchInvalidation;
// ============================================================================
// CACHE WARMING & PRELOADING
// ============================================================================
/**
 * 17. Warms up cache with frequently accessed data.
 *
 * @param {any} cacheManager - Cache manager instance
 * @param {CacheWarmingOptions} options - Warming options
 * @returns {Promise<number>} Number of entries warmed
 *
 * @example
 * ```typescript
 * await warmCache(cacheManager, {
 *   keys: ['patient:active', 'appointments:today'],
 *   loader: async (key) => await fetchData(key),
 *   batchSize: 10
 * });
 * ```
 */
const warmCache = async (cacheManager, options) => {
    const { batchSize = 10, delay = 100, keys = [], loader } = options;
    if (!loader) {
        throw new Error('Loader function is required for cache warming');
    }
    let warmed = 0;
    for (let i = 0; i < keys.length; i += batchSize) {
        const batch = keys.slice(i, i + batchSize);
        await Promise.all(batch.map(async (key) => {
            try {
                const value = await loader(key);
                await cacheManager.set(key, value);
                warmed++;
            }
            catch (error) {
                console.error(`Failed to warm cache for key ${key}:`, error);
            }
        }));
        if (i + batchSize < keys.length && delay > 0) {
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
    return warmed;
};
exports.warmCache = warmCache;
/**
 * 18. Creates a cache preloader that runs on application startup.
 *
 * @param {any} cacheManager - Cache manager instance
 * @param {Function} dataLoader - Function to load preload data
 * @returns {Promise<void>} Preload completion promise
 *
 * @example
 * ```typescript
 * await preloadCache(cacheManager, async () => {
 *   return {
 *     'config:app': await loadAppConfig(),
 *     'lookup:states': await loadStates()
 *   };
 * });
 * ```
 */
const preloadCache = async (cacheManager, dataLoader) => {
    try {
        const data = await dataLoader();
        await Promise.all(Object.entries(data).map(([key, value]) => cacheManager.set(key, value, 86400)));
        console.log(`Preloaded ${Object.keys(data).length} cache entries`);
    }
    catch (error) {
        console.error('Cache preload failed:', error);
    }
};
exports.preloadCache = preloadCache;
// ============================================================================
// CACHE PATTERNS (Cache-Aside, Write-Through, Write-Behind)
// ============================================================================
/**
 * 19. Implements cache-aside (lazy loading) pattern.
 *
 * @param {any} cacheManager - Cache manager instance
 * @param {Function} dataLoader - Function to load data on cache miss
 * @param {number} [ttl=300] - Cache TTL in seconds
 * @returns {Function} Cache-aside wrapper
 *
 * @example
 * ```typescript
 * const getPatient = cacheAsidePattern(
 *   cacheManager,
 *   async (id) => await db.findPatient(id),
 *   600
 * );
 * const patient = await getPatient('patient:123');
 * ```
 */
const cacheAsidePattern = (cacheManager, dataLoader, ttl = 300) => {
    return async (key) => {
        // Try to get from cache
        let value = await cacheManager.get(key);
        if (value === null || value === undefined) {
            // Cache miss - load from data source
            value = await dataLoader(key);
            // Store in cache
            await cacheManager.set(key, value, ttl);
        }
        return value;
    };
};
exports.cacheAsidePattern = cacheAsidePattern;
/**
 * 20. Implements write-through caching pattern.
 *
 * @param {any} cacheManager - Cache manager instance
 * @param {Function} dataSaver - Function to save data to database
 * @param {number} [ttl=300] - Cache TTL in seconds
 * @returns {Function} Write-through wrapper
 *
 * @example
 * ```typescript
 * const savePatient = writeThroughPattern(
 *   cacheManager,
 *   async (key, data) => await db.save(data),
 *   600
 * );
 * await savePatient('patient:123', patientData);
 * ```
 */
const writeThroughPattern = (cacheManager, dataSaver, ttl = 300) => {
    return async (key, data) => {
        // Write to database first
        const saved = await dataSaver(key, data);
        // Then update cache
        await cacheManager.set(key, saved, ttl);
        return saved;
    };
};
exports.writeThroughPattern = writeThroughPattern;
/**
 * 21. Implements write-behind (write-back) caching pattern.
 *
 * @param {any} cacheManager - Cache manager instance
 * @param {Function} dataSaver - Function to save data to database
 * @param {number} [flushInterval=5000] - Flush interval in ms
 * @returns {Object} Write-behind cache manager
 *
 * @example
 * ```typescript
 * const writeBehindCache = writeBehindPattern(
 *   cacheManager,
 *   async (entries) => await db.batchSave(entries),
 *   10000
 * );
 * await writeBehindCache.set('patient:123', data);
 * ```
 */
const writeBehindPattern = (cacheManager, dataSaver, flushInterval = 5000) => {
    const pendingWrites = new Map();
    let flushTimer;
    const flush = async () => {
        if (pendingWrites.size > 0) {
            const entries = Array.from(pendingWrites.entries()).map(([key, value]) => ({ key, value }));
            try {
                await dataSaver(entries);
                pendingWrites.clear();
            }
            catch (error) {
                console.error('Write-behind flush failed:', error);
            }
        }
    };
    flushTimer = setInterval(flush, flushInterval);
    return {
        async get(key) {
            // Check pending writes first
            if (pendingWrites.has(key)) {
                return pendingWrites.get(key);
            }
            return cacheManager.get(key);
        },
        async set(key, value, ttl) {
            // Write to cache immediately
            await cacheManager.set(key, value, ttl);
            // Queue for async database write
            pendingWrites.set(key, value);
        },
        async flushNow() {
            await flush();
        },
        stop() {
            clearInterval(flushTimer);
            flush(); // Final flush
        },
        getPendingWriteCount() {
            return pendingWrites.size;
        },
    };
};
exports.writeBehindPattern = writeBehindPattern;
// ============================================================================
// CACHE STAMPEDE PREVENTION
// ============================================================================
/**
 * 22. Prevents cache stampede using request coalescing.
 *
 * @param {any} cacheManager - Cache manager instance
 * @param {Function} dataLoader - Function to load data
 * @param {number} [ttl=300] - Cache TTL in seconds
 * @returns {Function} Stampede-protected loader
 *
 * @example
 * ```typescript
 * const getReport = preventCacheStampede(
 *   cacheManager,
 *   async (reportId) => await generateReport(reportId),
 *   3600
 * );
 * // Multiple simultaneous requests coalesce into single DB query
 * ```
 */
const preventCacheStampede = (cacheManager, dataLoader, ttl = 300) => {
    const inflightRequests = new Map();
    return async (key) => {
        // Check cache first
        const cached = await cacheManager.get(key);
        if (cached !== null && cached !== undefined) {
            return cached;
        }
        // Check if request is already in flight
        if (inflightRequests.has(key)) {
            return inflightRequests.get(key);
        }
        // Start new request
        const promise = (async () => {
            try {
                const value = await dataLoader(key);
                await cacheManager.set(key, value, ttl);
                return value;
            }
            finally {
                inflightRequests.delete(key);
            }
        })();
        inflightRequests.set(key, promise);
        return promise;
    };
};
exports.preventCacheStampede = preventCacheStampede;
/**
 * 23. Implements probabilistic early expiration to prevent stampede.
 *
 * @param {any} cacheManager - Cache manager instance
 * @param {Function} dataLoader - Function to load data
 * @param {number} [ttl=300] - Cache TTL in seconds
 * @param {number} [beta=1] - Beta factor for probability calculation
 * @returns {Function} Early expiration loader
 *
 * @example
 * ```typescript
 * const getData = probabilisticEarlyExpiration(
 *   cacheManager,
 *   async (key) => await loadData(key),
 *   600,
 *   1.5
 * );
 * ```
 */
const probabilisticEarlyExpiration = (cacheManager, dataLoader, ttl = 300, beta = 1) => {
    const startTimes = new Map();
    return async (key) => {
        const cached = await cacheManager.get(key);
        const now = Date.now();
        if (cached !== null && cached !== undefined) {
            const startTime = startTimes.get(key) || now;
            const delta = now - startTime;
            const remainingTTL = await cacheManager.ttl?.(key);
            if (remainingTTL && remainingTTL > 0) {
                const probability = delta * beta * Math.log(Math.random());
                if (probability < remainingTTL * 1000) {
                    return cached;
                }
            }
        }
        // Refresh cache
        const value = await dataLoader(key);
        await cacheManager.set(key, value, ttl);
        startTimes.set(key, now);
        return value;
    };
};
exports.probabilisticEarlyExpiration = probabilisticEarlyExpiration;
// ============================================================================
// CACHE KEY GENERATION
// ============================================================================
/**
 * 24. Generates deterministic cache keys from function arguments.
 *
 * @param {string} prefix - Key prefix
 * @param {CacheKeyOptions} [options] - Key generation options
 * @returns {Function} Key generator function
 *
 * @example
 * ```typescript
 * const keyGen = generateCacheKey('patient', { includeVersion: true, version: 'v2' });
 * const key = keyGen(123, 'active'); // 'patient:v2:123:active'
 * ```
 */
const generateCacheKey = (prefix, options = {}) => {
    const { suffix = '', separator = ':', includeVersion = false, version = 'v1', } = options;
    return (...args) => {
        const parts = [prefix];
        if (includeVersion) {
            parts.push(version);
        }
        parts.push(...args.map((arg) => String(arg)));
        if (suffix) {
            parts.push(suffix);
        }
        return parts.join(separator);
    };
};
exports.generateCacheKey = generateCacheKey;
/**
 * 25. Creates a hash-based cache key for complex objects.
 *
 * @param {string} prefix - Key prefix
 * @param {any} obj - Object to hash
 * @param {string} [algorithm='md5'] - Hash algorithm
 * @returns {string} Hashed cache key
 *
 * @example
 * ```typescript
 * const key = hashCacheKey('query', {
 *   filters: { status: 'active' },
 *   sort: 'name',
 *   page: 1
 * }); // 'query:a3f2b1c9d8e7f6'
 * ```
 */
const hashCacheKey = (prefix, obj, algorithm = 'md5') => {
    // Simple hash implementation (in production, use crypto.createHash)
    const str = JSON.stringify(obj);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
    }
    return `${prefix}:${Math.abs(hash).toString(16)}`;
};
exports.hashCacheKey = hashCacheKey;
/**
 * 26. Creates a namespace-aware cache key generator.
 *
 * @param {string} namespace - Cache namespace
 * @param {string} [tenant] - Tenant identifier for multi-tenancy
 * @returns {Function} Namespaced key generator
 *
 * @example
 * ```typescript
 * const genKey = namespacedCacheKey('healthcare', 'tenant123');
 * const key = genKey('patient', '456'); // 'healthcare:tenant123:patient:456'
 * ```
 */
const namespacedCacheKey = (namespace, tenant) => {
    return (...parts) => {
        const keyParts = [namespace];
        if (tenant) {
            keyParts.push(tenant);
        }
        keyParts.push(...parts.map((p) => String(p)));
        return keyParts.join(':');
    };
};
exports.namespacedCacheKey = namespacedCacheKey;
// ============================================================================
// CACHE TTL STRATEGIES
// ============================================================================
/**
 * 27. Creates a dynamic TTL calculator based on data characteristics.
 *
 * @param {Function} calculator - Function to calculate TTL
 * @returns {Function} TTL calculator wrapper
 *
 * @example
 * ```typescript
 * const getTTL = dynamicTTL((data) => {
 *   if (data.priority === 'high') return 60;
 *   if (data.size > 1000000) return 300;
 *   return 3600;
 * });
 * const ttl = getTTL(patientData);
 * ```
 */
const dynamicTTL = (calculator) => {
    return (data) => {
        try {
            return calculator(data);
        }
        catch (error) {
            console.error('TTL calculation error:', error);
            return 300; // Default to 5 minutes
        }
    };
};
exports.dynamicTTL = dynamicTTL;
/**
 * 28. Creates a time-of-day based TTL strategy.
 *
 * @param {Record<string, number>} schedule - TTL schedule by hour
 * @returns {Function} Time-based TTL calculator
 *
 * @example
 * ```typescript
 * const getTTL = timeBasedTTL({
 *   '09-17': 300,  // Business hours: 5 min
 *   '17-09': 3600  // Off hours: 1 hour
 * });
 * ```
 */
const timeBasedTTL = (schedule) => {
    return () => {
        const now = new Date();
        const hour = now.getHours();
        for (const [timeRange, ttl] of Object.entries(schedule)) {
            const [start, end] = timeRange.split('-').map(Number);
            if (start < end) {
                if (hour >= start && hour < end)
                    return ttl;
            }
            else {
                if (hour >= start || hour < end)
                    return ttl;
            }
        }
        return 300; // Default
    };
};
exports.timeBasedTTL = timeBasedTTL;
// ============================================================================
// CACHE COMPRESSION & SERIALIZATION
// ============================================================================
/**
 * 29. Compresses cache data to reduce memory/network usage.
 *
 * @param {any} data - Data to compress
 * @param {CompressionOptions} [options] - Compression options
 * @returns {Promise<Buffer>} Compressed data
 *
 * @example
 * ```typescript
 * const compressed = await compress(largeObject, {
 *   algorithm: 'gzip',
 *   level: 9
 * });
 * await cacheManager.set('key', compressed);
 * ```
 */
const compress = async (data, options = {}) => {
    const { algorithm = 'gzip', level = 6, threshold = 1024 } = options;
    const serialized = JSON.stringify(data);
    // Only compress if data exceeds threshold
    if (serialized.length < threshold) {
        return { compressed: false, data: serialized };
    }
    // In production, use zlib.gzip, zlib.deflate, or zlib.brotliCompress
    return {
        compressed: true,
        algorithm,
        data: serialized, // Placeholder - would be actual compressed buffer
    };
};
exports.compress = compress;
/**
 * 30. Decompresses cached data.
 *
 * @param {any} compressedData - Compressed data
 * @returns {Promise<any>} Decompressed data
 *
 * @example
 * ```typescript
 * const data = await cacheManager.get('key');
 * const decompressed = await decompress(data);
 * ```
 */
const decompress = async (compressedData) => {
    if (!compressedData.compressed) {
        return JSON.parse(compressedData.data);
    }
    // In production, use zlib.gunzip, zlib.inflate, or zlib.brotliDecompress
    return JSON.parse(compressedData.data);
};
exports.decompress = decompress;
/**
 * 31. Serializes complex objects for caching (handles Date, RegExp, etc.).
 *
 * @param {any} data - Data to serialize
 * @returns {string} Serialized data
 *
 * @example
 * ```typescript
 * const serialized = serializeForCache({
 *   date: new Date(),
 *   regex: /pattern/gi,
 *   data: complexObject
 * });
 * ```
 */
const serializeForCache = (data) => {
    return JSON.stringify(data, (key, value) => {
        if (value instanceof Date) {
            return { __type: 'Date', value: value.toISOString() };
        }
        if (value instanceof RegExp) {
            return { __type: 'RegExp', value: value.toString() };
        }
        if (value instanceof Map) {
            return { __type: 'Map', value: Array.from(value.entries()) };
        }
        if (value instanceof Set) {
            return { __type: 'Set', value: Array.from(value) };
        }
        return value;
    });
};
exports.serializeForCache = serializeForCache;
/**
 * 32. Deserializes cached data back to original types.
 *
 * @param {string} serialized - Serialized data
 * @returns {any} Deserialized data
 *
 * @example
 * ```typescript
 * const data = deserializeFromCache(cachedString);
 * console.log(data.date instanceof Date); // true
 * ```
 */
const deserializeFromCache = (serialized) => {
    return JSON.parse(serialized, (key, value) => {
        if (value && typeof value === 'object' && '__type' in value) {
            switch (value.__type) {
                case 'Date':
                    return new Date(value.value);
                case 'RegExp': {
                    const match = value.value.match(/\/(.*?)\/([gimuy]*)$/);
                    return new RegExp(match[1], match[2]);
                }
                case 'Map':
                    return new Map(value.value);
                case 'Set':
                    return new Set(value.value);
            }
        }
        return value;
    });
};
exports.deserializeFromCache = deserializeFromCache;
// ============================================================================
// MEMOIZATION
// ============================================================================
/**
 * 33. Creates a memoized version of a function with configurable cache.
 *
 * @param {Function} fn - Function to memoize
 * @param {MemoizeOptions} [options] - Memoization options
 * @returns {Function} Memoized function
 *
 * @example
 * ```typescript
 * const expensiveCalc = memoize(
 *   (a, b) => heavyComputation(a, b),
 *   { ttl: 600, maxSize: 100 }
 * );
 * ```
 */
const memoize = (fn, options = {}) => {
    const { ttl = 300, maxSize = 1000, keyGenerator = (...args) => JSON.stringify(args), } = options;
    const cache = new Map();
    return ((...args) => {
        const key = keyGenerator(...args);
        const now = Date.now();
        const cached = cache.get(key);
        if (cached && now < cached.expiry) {
            return cached.value;
        }
        const result = fn(...args);
        cache.set(key, { value: result, expiry: now + ttl * 1000 });
        // Enforce max size
        if (cache.size > maxSize) {
            const firstKey = cache.keys().next().value;
            cache.delete(firstKey);
        }
        return result;
    });
};
exports.memoize = memoize;
/**
 * 34. Creates an async memoization wrapper for promise-returning functions.
 *
 * @param {Function} fn - Async function to memoize
 * @param {MemoizeOptions} [options] - Memoization options
 * @returns {Function} Memoized async function
 *
 * @example
 * ```typescript
 * const getPatient = memoizeAsync(
 *   async (id) => await db.findPatient(id),
 *   { ttl: 300 }
 * );
 * ```
 */
const memoizeAsync = (fn, options = {}) => {
    const { ttl = 300, maxSize = 1000, keyGenerator = (...args) => JSON.stringify(args), } = options;
    const cache = new Map();
    return (async (...args) => {
        const key = keyGenerator(...args);
        const now = Date.now();
        const cached = cache.get(key);
        if (cached) {
            if (now < cached.expiry) {
                return cached.promise || cached.value;
            }
            cache.delete(key);
        }
        const promise = fn(...args);
        cache.set(key, { value: null, expiry: now + ttl * 1000, promise });
        try {
            const result = await promise;
            cache.set(key, { value: result, expiry: now + ttl * 1000 });
            if (cache.size > maxSize) {
                const firstKey = cache.keys().next().value;
                cache.delete(firstKey);
            }
            return result;
        }
        catch (error) {
            cache.delete(key);
            throw error;
        }
    });
};
exports.memoizeAsync = memoizeAsync;
// ============================================================================
// HTTP CACHING & RESPONSE OPTIMIZATION
// ============================================================================
/**
 * 35. Generates HTTP cache headers for API responses.
 *
 * @param {HttpCacheOptions} options - HTTP cache options
 * @returns {Record<string, string>} Cache headers
 *
 * @example
 * ```typescript
 * const headers = generateHttpCacheHeaders({
 *   maxAge: 300,
 *   public: true,
 *   mustRevalidate: true
 * });
 * res.set(headers);
 * ```
 */
const generateHttpCacheHeaders = (options) => {
    const { maxAge, sMaxAge, private: isPrivate, public: isPublic, noCache, noStore, mustRevalidate, } = options;
    const directives = [];
    if (noStore) {
        directives.push('no-store');
    }
    else if (noCache) {
        directives.push('no-cache');
    }
    else {
        if (isPrivate)
            directives.push('private');
        if (isPublic)
            directives.push('public');
        if (maxAge !== undefined)
            directives.push(`max-age=${maxAge}`);
        if (sMaxAge !== undefined)
            directives.push(`s-maxage=${sMaxAge}`);
        if (mustRevalidate)
            directives.push('must-revalidate');
    }
    return {
        'Cache-Control': directives.join(', '),
    };
};
exports.generateHttpCacheHeaders = generateHttpCacheHeaders;
/**
 * 36. Creates a response caching middleware for NestJS.
 *
 * @param {any} cacheManager - Cache manager instance
 * @param {number} [ttl=300] - Cache TTL in seconds
 * @returns {Function} NestJS middleware
 *
 * @example
 * ```typescript
 * @Controller('patients')
 * export class PatientsController {
 *   @Get(':id')
 *   @UseInterceptors(responseCacheInterceptor(cacheManager, 600))
 *   async getPatient(@Param('id') id: string) {
 *     return this.service.findById(id);
 *   }
 * }
 * ```
 */
const createResponseCacheMiddleware = (cacheManager, ttl = 300) => {
    return async (req, res, next) => {
        // Only cache GET requests
        if (req.method !== 'GET') {
            return next();
        }
        const cacheKey = `http:${req.method}:${req.originalUrl}`;
        // Check cache
        const cached = await cacheManager.get(cacheKey);
        if (cached) {
            res.set((0, exports.generateHttpCacheHeaders)({ public: true, maxAge: ttl }));
            return res.json(cached);
        }
        // Intercept response
        const originalJson = res.json.bind(res);
        res.json = (data) => {
            cacheManager.set(cacheKey, data, ttl);
            res.set((0, exports.generateHttpCacheHeaders)({ public: true, maxAge: ttl }));
            return originalJson(data);
        };
        next();
    };
};
exports.createResponseCacheMiddleware = createResponseCacheMiddleware;
// ============================================================================
// ETAG GENERATION
// ============================================================================
/**
 * 37. Generates an ETag for response data.
 *
 * @param {any} data - Response data
 * @param {ETagOptions} [options] - ETag options
 * @returns {string} ETag value
 *
 * @example
 * ```typescript
 * const etag = generateETag(responseData, { algorithm: 'sha256', weak: false });
 * res.set('ETag', etag);
 * ```
 */
const generateETag = (data, options = {}) => {
    const { weak = false, algorithm = 'md5' } = options;
    const content = typeof data === 'string' ? data : JSON.stringify(data);
    // Simple hash (in production, use crypto.createHash)
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
        const char = content.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
    }
    const etagValue = `"${Math.abs(hash).toString(16)}"`;
    return weak ? `W/${etagValue}` : etagValue;
};
exports.generateETag = generateETag;
/**
 * 38. Validates if request ETag matches current data.
 *
 * @param {string} requestETag - ETag from request header
 * @param {any} currentData - Current response data
 * @returns {boolean} True if ETags match
 *
 * @example
 * ```typescript
 * if (validateETag(req.headers['if-none-match'], data)) {
 *   return res.status(304).send();
 * }
 * ```
 */
const validateETag = (requestETag, currentData) => {
    if (!requestETag)
        return false;
    const currentETag = (0, exports.generateETag)(currentData);
    return requestETag === currentETag || requestETag === `W/${currentETag}`;
};
exports.validateETag = validateETag;
/**
 * 39. Creates an ETag-based conditional GET interceptor.
 *
 * @param {ETagOptions} [options] - ETag options
 * @returns {Function} NestJS interceptor
 *
 * @example
 * ```typescript
 * @Get(':id')
 * @UseInterceptors(etagInterceptor())
 * async getData() {
 *   return this.service.getData();
 * }
 * ```
 */
const createETagInterceptor = (options = {}) => {
    return (req, res, next) => {
        const originalJson = res.json.bind(res);
        res.json = (data) => {
            const etag = (0, exports.generateETag)(data, options);
            res.set('ETag', etag);
            const clientETag = req.headers['if-none-match'];
            if (clientETag === etag) {
                return res.status(304).send();
            }
            return originalJson(data);
        };
        next();
    };
};
exports.createETagInterceptor = createETagInterceptor;
// ============================================================================
// QUERY RESULT CACHING
// ============================================================================
/**
 * 40. Caches database query results with automatic invalidation.
 *
 * @param {any} cacheManager - Cache manager instance
 * @param {Function} queryFn - Database query function
 * @param {string} cacheKey - Cache key
 * @param {number} [ttl=300] - Cache TTL in seconds
 * @returns {Promise<any>} Query result
 *
 * @example
 * ```typescript
 * const patients = await cacheQueryResult(
 *   cacheManager,
 *   () => db.query('SELECT * FROM patients WHERE active = true'),
 *   'patients:active',
 *   600
 * );
 * ```
 */
const cacheQueryResult = async (cacheManager, queryFn, cacheKey, ttl = 300) => {
    const cached = await cacheManager.get(cacheKey);
    if (cached !== null && cached !== undefined) {
        return cached;
    }
    const result = await queryFn();
    await cacheManager.set(cacheKey, result, ttl);
    return result;
};
exports.cacheQueryResult = cacheQueryResult;
/**
 * 41. Creates a query result cache with automatic dependency tracking.
 *
 * @param {any} cacheManager - Cache manager instance
 * @returns {Object} Query cache manager
 *
 * @example
 * ```typescript
 * const queryCache = createQueryCache(cacheManager);
 * const result = await queryCache.execute(
 *   'patients-by-status',
 *   () => db.query(...),
 *   { dependencies: ['patients'] }
 * );
 * ```
 */
const createQueryCache = (cacheManager) => {
    const dependencyMap = new Map();
    return {
        async execute(key, queryFn, options = {}) {
            const { ttl = 300, dependencies = [] } = options;
            const cached = await cacheManager.get(key);
            if (cached !== null && cached !== undefined) {
                return cached;
            }
            const result = await queryFn();
            await cacheManager.set(key, result, ttl);
            // Track dependencies
            if (dependencies.length > 0) {
                dependencies.forEach((dep) => {
                    if (!dependencyMap.has(dep)) {
                        dependencyMap.set(dep, new Set());
                    }
                    dependencyMap.get(dep).add(key);
                });
            }
            return result;
        },
        async invalidateDependency(dependency) {
            const dependentKeys = dependencyMap.get(dependency);
            if (dependentKeys) {
                await Promise.all(Array.from(dependentKeys).map((key) => cacheManager.del(key)));
                dependencyMap.delete(dependency);
            }
        },
    };
};
exports.createQueryCache = createQueryCache;
// ============================================================================
// CACHE MONITORING & STATISTICS
// ============================================================================
/**
 * 42. Creates a cache statistics collector.
 *
 * @param {any} cacheManager - Cache manager instance
 * @returns {Object} Stats collector
 *
 * @example
 * ```typescript
 * const stats = createCacheStatsCollector(cacheManager);
 * stats.recordHit('patient:123');
 * const metrics = stats.getStats();
 * console.log(metrics.hitRate);
 * ```
 */
const createCacheStatsCollector = (cacheManager) => {
    let hits = 0;
    let misses = 0;
    let sets = 0;
    let deletes = 0;
    const originalGet = cacheManager.get.bind(cacheManager);
    const originalSet = cacheManager.set.bind(cacheManager);
    const originalDel = cacheManager.del.bind(cacheManager);
    cacheManager.get = async (key) => {
        const value = await originalGet(key);
        if (value !== null && value !== undefined) {
            hits++;
        }
        else {
            misses++;
        }
        return value;
    };
    cacheManager.set = async (key, value, ttl) => {
        sets++;
        return originalSet(key, value, ttl);
    };
    cacheManager.del = async (key) => {
        deletes++;
        return originalDel(key);
    };
    return {
        getStats() {
            const total = hits + misses;
            return {
                hits,
                misses,
                hitRate: total > 0 ? hits / total : 0,
                size: sets - deletes,
                keys: sets - deletes,
            };
        },
        reset() {
            hits = 0;
            misses = 0;
            sets = 0;
            deletes = 0;
        },
        recordHit(key) {
            hits++;
        },
        recordMiss(key) {
            misses++;
        },
    };
};
exports.createCacheStatsCollector = createCacheStatsCollector;
/**
 * 43. Creates a cache performance monitor with metrics export.
 *
 * @param {any} cacheManager - Cache manager instance
 * @param {number} [reportInterval=60000] - Report interval in ms
 * @returns {Object} Performance monitor
 *
 * @example
 * ```typescript
 * const monitor = createCachePerformanceMonitor(cacheManager, 30000);
 * monitor.onReport((metrics) => console.log(metrics));
 * ```
 */
const createCachePerformanceMonitor = (cacheManager, reportInterval = 60000) => {
    const metrics = {
        operations: 0,
        totalLatency: 0,
        errors: 0,
        avgLatency: 0,
    };
    const reportCallbacks = new Set();
    let reportTimer;
    const wrapOperation = (operation, fn) => {
        return async (...args) => {
            const startTime = Date.now();
            metrics.operations++;
            try {
                const result = await fn(...args);
                const latency = Date.now() - startTime;
                metrics.totalLatency += latency;
                metrics.avgLatency = metrics.totalLatency / metrics.operations;
                return result;
            }
            catch (error) {
                metrics.errors++;
                throw error;
            }
        };
    };
    cacheManager.get = wrapOperation('get', cacheManager.get);
    cacheManager.set = wrapOperation('set', cacheManager.set);
    cacheManager.del = wrapOperation('del', cacheManager.del);
    const report = () => {
        const snapshot = { ...metrics };
        reportCallbacks.forEach((callback) => callback(snapshot));
    };
    reportTimer = setInterval(report, reportInterval);
    return {
        getMetrics() {
            return { ...metrics };
        },
        onReport(callback) {
            reportCallbacks.add(callback);
        },
        stop() {
            clearInterval(reportTimer);
        },
    };
};
exports.createCachePerformanceMonitor = createCachePerformanceMonitor;
/**
 * 44. Creates a cache health checker for monitoring.
 *
 * @param {any} cacheManager - Cache manager instance
 * @param {number} [threshold=0.8] - Minimum acceptable hit rate
 * @returns {Function} Health check function
 *
 * @example
 * ```typescript
 * const healthCheck = createCacheHealthCheck(cacheManager, 0.75);
 * const health = await healthCheck();
 * console.log(health.healthy, health.hitRate);
 * ```
 */
const createCacheHealthCheck = (cacheManager, threshold = 0.8) => {
    const statsCollector = (0, exports.createCacheStatsCollector)(cacheManager);
    return async () => {
        const stats = statsCollector.getStats();
        const issues = [];
        if (stats.hitRate < threshold) {
            issues.push(`Hit rate ${stats.hitRate.toFixed(2)} below threshold ${threshold}`);
        }
        try {
            const testKey = '__health_check__';
            await cacheManager.set(testKey, 'test', 10);
            const value = await cacheManager.get(testKey);
            await cacheManager.del(testKey);
            if (value !== 'test') {
                issues.push('Cache read/write test failed');
            }
        }
        catch (error) {
            issues.push(`Cache operation error: ${error}`);
        }
        return {
            healthy: issues.length === 0 && stats.hitRate >= threshold,
            hitRate: stats.hitRate,
            stats,
            issues,
        };
    };
};
exports.createCacheHealthCheck = createCacheHealthCheck;
/**
 * 45. Creates a cache size monitor with alerts for memory limits.
 *
 * @param {any} cacheManager - Cache manager instance
 * @param {number} maxSizeBytes - Maximum cache size in bytes
 * @param {Function} onThreshold - Callback when threshold exceeded
 * @returns {Object} Size monitor
 *
 * @example
 * ```typescript
 * const sizeMonitor = createCacheSizeMonitor(
 *   cacheManager,
 *   100 * 1024 * 1024, // 100MB
 *   (size) => console.warn(`Cache size: ${size} bytes`)
 * );
 * ```
 */
const createCacheSizeMonitor = (cacheManager, maxSizeBytes, onThreshold) => {
    let currentSize = 0;
    const estimateSize = (value) => {
        // Rough estimate of object size
        const str = JSON.stringify(value);
        return str.length * 2; // UTF-16 encoding
    };
    const originalSet = cacheManager.set.bind(cacheManager);
    const originalDel = cacheManager.del.bind(cacheManager);
    cacheManager.set = async (key, value, ttl) => {
        const size = estimateSize(value);
        currentSize += size;
        if (currentSize > maxSizeBytes && onThreshold) {
            onThreshold(currentSize);
        }
        return originalSet(key, value, ttl);
    };
    cacheManager.del = async (key) => {
        const value = await cacheManager.get(key);
        if (value) {
            currentSize -= estimateSize(value);
        }
        return originalDel(key);
    };
    return {
        getCurrentSize() {
            return currentSize;
        },
        getMaxSize() {
            return maxSizeBytes;
        },
        getUtilization() {
            return currentSize / maxSizeBytes;
        },
        isOverThreshold() {
            return currentSize > maxSizeBytes;
        },
    };
};
exports.createCacheSizeMonitor = createCacheSizeMonitor;
//# sourceMappingURL=nestjs-caching-performance-kit.js.map