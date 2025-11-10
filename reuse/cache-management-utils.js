"use strict";
/**
 * LOC: CACHE12345
 * File: /reuse/cache-management-utils.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Sequelize models and services
 *   - API controllers
 *   - Database query layers
 *   - Redis integration modules
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
exports.importCacheFromJSON = exports.exportCacheToJSON = exports.setupSequelizeCacheHooks = exports.invalidateSequelizeCache = exports.cacheSequelizeQuery = exports.trackCacheAccess = exports.getCacheStats = exports.releaseDistributedLock = exports.acquireDistributedLock = exports.invalidateMultiLevelCache = exports.setMultiLevelCache = exports.getMultiLevelCache = exports.warmFrequentlyAccessed = exports.warmCache = exports.refreshCacheTTL = exports.getCacheTTL = exports.updateCacheTTL = exports.invalidateByAge = exports.invalidateByPattern = exports.invalidateByTag = exports.writeBack = exports.writeThrough = exports.cacheAsideWithFallback = exports.cacheAside = exports.hashCacheKey = exports.namespaceCacheKey = exports.generateQueryCacheKey = exports.generateCacheKey = exports.getLRUCache = exports.setLRUCache = exports.createLRUCache = exports.clearExpiredMemoryCache = exports.deleteMemoryCache = exports.getMemoryCache = exports.setMemoryCache = exports.createMemoryCache = exports.getRedisMultiple = exports.setRedisMultiple = exports.incrementRedisCounter = exports.deleteRedisCache = exports.getRedisCache = exports.setRedisCache = void 0;
// ============================================================================
// REDIS CACHE HELPERS
// ============================================================================
/**
 * Sets a value in Redis cache with optional TTL and compression.
 *
 * @param {any} redisClient - Redis client instance
 * @param {string} key - Cache key
 * @param {any} value - Value to cache
 * @param {CacheOptions} [options] - Cache options
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await setRedisCache(redis, 'user:123', userData, { ttl: 3600, compress: true });
 * ```
 */
const setRedisCache = async (redisClient, key, value, options = {}) => {
    try {
        const { ttl, namespace, compress = false } = options;
        const cacheKey = namespace ? `${namespace}:${key}` : key;
        let serialized = JSON.stringify(value);
        if (compress) {
            const zlib = await Promise.resolve().then(() => __importStar(require('zlib')));
            const compressed = zlib.gzipSync(serialized);
            serialized = compressed.toString('base64');
        }
        if (ttl) {
            await redisClient.setex(cacheKey, ttl, serialized);
        }
        else {
            await redisClient.set(cacheKey, serialized);
        }
        return true;
    }
    catch (error) {
        console.error('Redis cache set error:', error);
        return false;
    }
};
exports.setRedisCache = setRedisCache;
/**
 * Gets a value from Redis cache with decompression support.
 *
 * @param {any} redisClient - Redis client instance
 * @param {string} key - Cache key
 * @param {CacheOptions} [options] - Cache options
 * @returns {Promise<any>} Cached value or null
 *
 * @example
 * ```typescript
 * const userData = await getRedisCache(redis, 'user:123', { compress: true });
 * ```
 */
const getRedisCache = async (redisClient, key, options = {}) => {
    try {
        const { namespace, compress = false } = options;
        const cacheKey = namespace ? `${namespace}:${key}` : key;
        const cached = await redisClient.get(cacheKey);
        if (!cached)
            return null;
        let serialized = cached;
        if (compress) {
            const zlib = await Promise.resolve().then(() => __importStar(require('zlib')));
            const buffer = Buffer.from(cached, 'base64');
            serialized = zlib.gunzipSync(buffer).toString();
        }
        return JSON.parse(serialized);
    }
    catch (error) {
        console.error('Redis cache get error:', error);
        return null;
    }
};
exports.getRedisCache = getRedisCache;
/**
 * Deletes a key or pattern from Redis cache.
 *
 * @param {any} redisClient - Redis client instance
 * @param {string} pattern - Key or pattern to delete
 * @param {boolean} [isPattern=false] - Whether pattern is a wildcard pattern
 * @returns {Promise<number>} Number of keys deleted
 *
 * @example
 * ```typescript
 * await deleteRedisCache(redis, 'user:*', true); // Delete all user keys
 * ```
 */
const deleteRedisCache = async (redisClient, pattern, isPattern = false) => {
    try {
        if (!isPattern) {
            return await redisClient.del(pattern);
        }
        const keys = await redisClient.keys(pattern);
        if (keys.length === 0)
            return 0;
        return await redisClient.del(...keys);
    }
    catch (error) {
        console.error('Redis cache delete error:', error);
        return 0;
    }
};
exports.deleteRedisCache = deleteRedisCache;
/**
 * Performs atomic increment operation in Redis.
 *
 * @param {any} redisClient - Redis client instance
 * @param {string} key - Counter key
 * @param {number} [increment=1] - Increment value
 * @param {number} [ttl] - Optional TTL for key
 * @returns {Promise<number>} New counter value
 *
 * @example
 * ```typescript
 * const count = await incrementRedisCounter(redis, 'api:hits:endpoint', 1, 3600);
 * ```
 */
const incrementRedisCounter = async (redisClient, key, increment = 1, ttl) => {
    try {
        const newValue = await redisClient.incrby(key, increment);
        if (ttl && newValue === increment) {
            await redisClient.expire(key, ttl);
        }
        return newValue;
    }
    catch (error) {
        console.error('Redis increment error:', error);
        return 0;
    }
};
exports.incrementRedisCounter = incrementRedisCounter;
/**
 * Sets multiple key-value pairs in Redis atomically.
 *
 * @param {any} redisClient - Redis client instance
 * @param {Record<string, any>} entries - Key-value pairs to set
 * @param {number} [ttl] - Optional TTL for all keys
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await setRedisMultiple(redis, { 'key1': 'val1', 'key2': 'val2' }, 3600);
 * ```
 */
const setRedisMultiple = async (redisClient, entries, ttl) => {
    try {
        const pipeline = redisClient.pipeline();
        for (const [key, value] of Object.entries(entries)) {
            const serialized = JSON.stringify(value);
            if (ttl) {
                pipeline.setex(key, ttl, serialized);
            }
            else {
                pipeline.set(key, serialized);
            }
        }
        await pipeline.exec();
        return true;
    }
    catch (error) {
        console.error('Redis multi-set error:', error);
        return false;
    }
};
exports.setRedisMultiple = setRedisMultiple;
/**
 * Gets multiple values from Redis in a single operation.
 *
 * @param {any} redisClient - Redis client instance
 * @param {string[]} keys - Array of keys to retrieve
 * @returns {Promise<Record<string, any>>} Key-value map of results
 *
 * @example
 * ```typescript
 * const results = await getRedisMultiple(redis, ['user:1', 'user:2', 'user:3']);
 * ```
 */
const getRedisMultiple = async (redisClient, keys) => {
    try {
        const values = await redisClient.mget(...keys);
        const result = {};
        keys.forEach((key, index) => {
            if (values[index]) {
                try {
                    result[key] = JSON.parse(values[index]);
                }
                catch {
                    result[key] = values[index];
                }
            }
        });
        return result;
    }
    catch (error) {
        console.error('Redis multi-get error:', error);
        return {};
    }
};
exports.getRedisMultiple = getRedisMultiple;
// ============================================================================
// IN-MEMORY CACHE (MAP-BASED)
// ============================================================================
/**
 * Creates an in-memory cache instance with TTL support.
 *
 * @returns {Map<string, CacheEntry<any>>} Cache map instance
 *
 * @example
 * ```typescript
 * const cache = createMemoryCache();
 * ```
 */
const createMemoryCache = () => {
    return new Map();
};
exports.createMemoryCache = createMemoryCache;
/**
 * Sets a value in memory cache with TTL and metadata.
 *
 * @param {Map<string, CacheEntry<T>>} cache - Cache map instance
 * @param {string} key - Cache key
 * @param {T} value - Value to cache
 * @param {CacheOptions} [options] - Cache options
 * @returns {boolean} Success status
 *
 * @example
 * ```typescript
 * setMemoryCache(cache, 'user:123', userData, { ttl: 300, tags: ['user'] });
 * ```
 */
const setMemoryCache = (cache, key, value, options = {}) => {
    try {
        const { ttl, tags } = options;
        const now = Date.now();
        cache.set(key, {
            value,
            expiresAt: ttl ? now + ttl * 1000 : Infinity,
            tags,
            hits: 0,
            createdAt: now,
        });
        return true;
    }
    catch (error) {
        console.error('Memory cache set error:', error);
        return false;
    }
};
exports.setMemoryCache = setMemoryCache;
/**
 * Gets a value from memory cache, checking TTL.
 *
 * @param {Map<string, CacheEntry<T>>} cache - Cache map instance
 * @param {string} key - Cache key
 * @returns {T | null} Cached value or null if expired
 *
 * @example
 * ```typescript
 * const userData = getMemoryCache(cache, 'user:123');
 * ```
 */
const getMemoryCache = (cache, key) => {
    const entry = cache.get(key);
    if (!entry)
        return null;
    if (entry.expiresAt < Date.now()) {
        cache.delete(key);
        return null;
    }
    entry.hits = (entry.hits || 0) + 1;
    return entry.value;
};
exports.getMemoryCache = getMemoryCache;
/**
 * Deletes a key from memory cache.
 *
 * @param {Map<string, CacheEntry<any>>} cache - Cache map instance
 * @param {string} key - Cache key
 * @returns {boolean} Whether key was deleted
 *
 * @example
 * ```typescript
 * deleteMemoryCache(cache, 'user:123');
 * ```
 */
const deleteMemoryCache = (cache, key) => {
    return cache.delete(key);
};
exports.deleteMemoryCache = deleteMemoryCache;
/**
 * Clears all expired entries from memory cache.
 *
 * @param {Map<string, CacheEntry<any>>} cache - Cache map instance
 * @returns {number} Number of entries cleared
 *
 * @example
 * ```typescript
 * const cleared = clearExpiredMemoryCache(cache);
 * console.log(`Cleared ${cleared} expired entries`);
 * ```
 */
const clearExpiredMemoryCache = (cache) => {
    const now = Date.now();
    let cleared = 0;
    for (const [key, entry] of cache.entries()) {
        if (entry.expiresAt < now) {
            cache.delete(key);
            cleared++;
        }
    }
    return cleared;
};
exports.clearExpiredMemoryCache = clearExpiredMemoryCache;
// ============================================================================
// LRU CACHE IMPLEMENTATION
// ============================================================================
/**
 * Creates an LRU (Least Recently Used) cache with size limits.
 *
 * @param {LRUCacheOptions} options - LRU cache configuration
 * @returns {Map<string, CacheEntry<any>>} LRU cache instance
 *
 * @example
 * ```typescript
 * const lruCache = createLRUCache({ maxSize: 1000, ttl: 300 });
 * ```
 */
const createLRUCache = (options) => {
    const cache = new Map();
    const { maxSize, ttl, onEvict } = options;
    const originalSet = cache.set.bind(cache);
    cache.set = (key, value) => {
        if (cache.size >= maxSize && !cache.has(key)) {
            const firstKey = cache.keys().next().value;
            const evicted = cache.get(firstKey);
            cache.delete(firstKey);
            if (onEvict && evicted) {
                onEvict(firstKey, evicted.value);
            }
        }
        return originalSet(key, value);
    };
    return cache;
};
exports.createLRUCache = createLRUCache;
/**
 * Sets a value in LRU cache with automatic eviction.
 *
 * @param {Map<string, CacheEntry<T>>} cache - LRU cache instance
 * @param {string} key - Cache key
 * @param {T} value - Value to cache
 * @param {number} [ttl] - Optional TTL in seconds
 * @returns {boolean} Success status
 *
 * @example
 * ```typescript
 * setLRUCache(lruCache, 'product:456', productData, 600);
 * ```
 */
const setLRUCache = (cache, key, value, ttl) => {
    try {
        const now = Date.now();
        // Delete and re-insert to move to end (most recent)
        if (cache.has(key)) {
            cache.delete(key);
        }
        cache.set(key, {
            value,
            expiresAt: ttl ? now + ttl * 1000 : Infinity,
            hits: 0,
            createdAt: now,
        });
        return true;
    }
    catch (error) {
        console.error('LRU cache set error:', error);
        return false;
    }
};
exports.setLRUCache = setLRUCache;
/**
 * Gets a value from LRU cache and updates access order.
 *
 * @param {Map<string, CacheEntry<T>>} cache - LRU cache instance
 * @param {string} key - Cache key
 * @returns {T | null} Cached value or null
 *
 * @example
 * ```typescript
 * const productData = getLRUCache(lruCache, 'product:456');
 * ```
 */
const getLRUCache = (cache, key) => {
    const entry = cache.get(key);
    if (!entry)
        return null;
    if (entry.expiresAt < Date.now()) {
        cache.delete(key);
        return null;
    }
    // Move to end to mark as recently used
    cache.delete(key);
    cache.set(key, entry);
    entry.hits = (entry.hits || 0) + 1;
    return entry.value;
};
exports.getLRUCache = getLRUCache;
// ============================================================================
// CACHE KEY GENERATION
// ============================================================================
/**
 * Generates a standardized cache key from components.
 *
 * @param {string[]} parts - Key components
 * @param {CacheKeyOptions} [options] - Key generation options
 * @returns {string} Generated cache key
 *
 * @example
 * ```typescript
 * const key = generateCacheKey(['user', '123', 'profile'], { prefix: 'app', version: 'v1' });
 * // Returns: 'app:v1:user:123:profile'
 * ```
 */
const generateCacheKey = (parts, options = {}) => {
    const { prefix, namespace, version, separator = ':' } = options;
    const components = [];
    if (prefix)
        components.push(prefix);
    if (namespace)
        components.push(namespace);
    if (version)
        components.push(version);
    components.push(...parts.map(p => String(p)));
    return components.join(separator);
};
exports.generateCacheKey = generateCacheKey;
/**
 * Generates a cache key from object properties for query caching.
 *
 * @param {string} base - Base key component
 * @param {Record<string, any>} params - Parameters to include in key
 * @returns {string} Generated cache key
 *
 * @example
 * ```typescript
 * const key = generateQueryCacheKey('students', { grade: 10, status: 'active' });
 * // Returns: 'students:grade=10:status=active'
 * ```
 */
const generateQueryCacheKey = (base, params) => {
    const sortedKeys = Object.keys(params).sort();
    const parts = sortedKeys.map(key => `${key}=${JSON.stringify(params[key])}`);
    return `${base}:${parts.join(':')}`;
};
exports.generateQueryCacheKey = generateQueryCacheKey;
/**
 * Generates a namespaced cache key with automatic prefixing.
 *
 * @param {string} namespace - Namespace for the key
 * @param {string} identifier - Unique identifier
 * @param {string} [suffix] - Optional suffix
 * @returns {string} Namespaced cache key
 *
 * @example
 * ```typescript
 * const key = namespaceCacheKey('medical-records', '123', 'history');
 * // Returns: 'medical-records:123:history'
 * ```
 */
const namespaceCacheKey = (namespace, identifier, suffix) => {
    const parts = [namespace, identifier];
    if (suffix)
        parts.push(suffix);
    return parts.join(':');
};
exports.namespaceCacheKey = namespaceCacheKey;
/**
 * Hashes a complex object into a short cache key component.
 *
 * @param {any} obj - Object to hash
 * @returns {string} Hashed key component
 *
 * @example
 * ```typescript
 * const hash = hashCacheKey({ where: { age: { gt: 18 } }, order: [['name', 'ASC']] });
 * // Returns: 'a3f2c9d8'
 * ```
 */
const hashCacheKey = (obj) => {
    const crypto = require('crypto');
    const str = JSON.stringify(obj, Object.keys(obj).sort());
    return crypto.createHash('md5').update(str).digest('hex').substring(0, 8);
};
exports.hashCacheKey = hashCacheKey;
// ============================================================================
// CACHE-ASIDE PATTERN
// ============================================================================
/**
 * Implements cache-aside pattern: check cache, query on miss, cache result.
 *
 * @param {string} key - Cache key
 * @param {() => Promise<T>} loader - Function to load data on cache miss
 * @param {any} cache - Cache instance (Redis or Map)
 * @param {CacheOptions} [options] - Cache options
 * @returns {Promise<T>} Data from cache or loader
 *
 * @example
 * ```typescript
 * const user = await cacheAside(
 *   'user:123',
 *   () => User.findByPk(123),
 *   redisClient,
 *   { ttl: 300 }
 * );
 * ```
 */
const cacheAside = async (key, loader, cache, options = {}) => {
    // Try to get from cache
    const cached = cache instanceof Map
        ? (0, exports.getMemoryCache)(cache, key)
        : await (0, exports.getRedisCache)(cache, key, options);
    if (cached !== null) {
        return cached;
    }
    // Load data
    const data = await loader();
    // Cache the result
    if (cache instanceof Map) {
        (0, exports.setMemoryCache)(cache, key, data, options);
    }
    else {
        await (0, exports.setRedisCache)(cache, key, data, options);
    }
    return data;
};
exports.cacheAside = cacheAside;
/**
 * Implements cache-aside with fallback to stale data on error.
 *
 * @param {string} key - Cache key
 * @param {() => Promise<T>} loader - Function to load data
 * @param {any} cache - Cache instance
 * @param {CacheOptions} [options] - Cache options
 * @returns {Promise<T | null>} Data or null
 *
 * @example
 * ```typescript
 * const user = await cacheAsideWithFallback('user:123', () => User.findByPk(123), redis);
 * ```
 */
const cacheAsideWithFallback = async (key, loader, cache, options = {}) => {
    try {
        return await (0, exports.cacheAside)(key, loader, cache, options);
    }
    catch (error) {
        console.error('Cache-aside with fallback error:', error);
        // Return stale cache data if available
        return cache instanceof Map
            ? (0, exports.getMemoryCache)(cache, key)
            : await (0, exports.getRedisCache)(cache, key, options);
    }
};
exports.cacheAsideWithFallback = cacheAsideWithFallback;
// ============================================================================
// WRITE-THROUGH / WRITE-BACK CACHING
// ============================================================================
/**
 * Implements write-through caching: write to cache and database simultaneously.
 *
 * @param {string} key - Cache key
 * @param {T} value - Value to write
 * @param {() => Promise<void>} persister - Function to persist to database
 * @param {any} cache - Cache instance
 * @param {CacheOptions} [options] - Cache options
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await writeThrough('user:123', userData, () => user.save(), redis, { ttl: 300 });
 * ```
 */
const writeThrough = async (key, value, persister, cache, options = {}) => {
    try {
        // Write to database first
        await persister();
        // Then update cache
        if (cache instanceof Map) {
            (0, exports.setMemoryCache)(cache, key, value, options);
        }
        else {
            await (0, exports.setRedisCache)(cache, key, value, options);
        }
        return true;
    }
    catch (error) {
        console.error('Write-through error:', error);
        return false;
    }
};
exports.writeThrough = writeThrough;
/**
 * Implements write-back caching: write to cache immediately, persist later.
 *
 * @param {string} key - Cache key
 * @param {T} value - Value to write
 * @param {() => Promise<void>} persister - Function to persist to database
 * @param {any} cache - Cache instance
 * @param {CacheOptions} [options] - Cache options
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await writeBack('counter:hits', hitCount, () => Counter.update(hitCount), redis);
 * ```
 */
const writeBack = async (key, value, persister, cache, options = {}) => {
    try {
        // Write to cache immediately
        if (cache instanceof Map) {
            (0, exports.setMemoryCache)(cache, key, value, options);
        }
        else {
            await (0, exports.setRedisCache)(cache, key, value, options);
        }
        // Persist asynchronously
        setImmediate(async () => {
            try {
                await persister();
            }
            catch (error) {
                console.error('Write-back persistence error:', error);
            }
        });
        return true;
    }
    catch (error) {
        console.error('Write-back error:', error);
        return false;
    }
};
exports.writeBack = writeBack;
// ============================================================================
// CACHE INVALIDATION STRATEGIES
// ============================================================================
/**
 * Invalidates cache entries by tag.
 *
 * @param {Map<string, CacheEntry<any>>} cache - Cache map instance
 * @param {string} tag - Tag to invalidate
 * @returns {number} Number of entries invalidated
 *
 * @example
 * ```typescript
 * const count = invalidateByTag(cache, 'user');
 * console.log(`Invalidated ${count} user-related cache entries`);
 * ```
 */
const invalidateByTag = (cache, tag) => {
    let count = 0;
    for (const [key, entry] of cache.entries()) {
        if (entry.tags && entry.tags.includes(tag)) {
            cache.delete(key);
            count++;
        }
    }
    return count;
};
exports.invalidateByTag = invalidateByTag;
/**
 * Invalidates cache entries matching a key pattern.
 *
 * @param {any} cache - Cache instance
 * @param {string} pattern - Key pattern to match
 * @returns {Promise<number>} Number of entries invalidated
 *
 * @example
 * ```typescript
 * await invalidateByPattern(redis, 'user:*:profile');
 * ```
 */
const invalidateByPattern = async (cache, pattern) => {
    if (cache instanceof Map) {
        const regex = new RegExp(pattern.replace(/\*/g, '.*'));
        let count = 0;
        for (const key of cache.keys()) {
            if (regex.test(key)) {
                cache.delete(key);
                count++;
            }
        }
        return count;
    }
    else {
        return await (0, exports.deleteRedisCache)(cache, pattern, true);
    }
};
exports.invalidateByPattern = invalidateByPattern;
/**
 * Invalidates cache entries older than specified age.
 *
 * @param {Map<string, CacheEntry<any>>} cache - Cache map instance
 * @param {number} maxAge - Maximum age in seconds
 * @returns {number} Number of entries invalidated
 *
 * @example
 * ```typescript
 * const count = invalidateByAge(cache, 3600); // Invalidate entries older than 1 hour
 * ```
 */
const invalidateByAge = (cache, maxAge) => {
    const cutoff = Date.now() - maxAge * 1000;
    let count = 0;
    for (const [key, entry] of cache.entries()) {
        if (entry.createdAt < cutoff) {
            cache.delete(key);
            count++;
        }
    }
    return count;
};
exports.invalidateByAge = invalidateByAge;
// ============================================================================
// TTL MANAGEMENT
// ============================================================================
/**
 * Updates TTL for an existing cache entry.
 *
 * @param {any} cache - Cache instance
 * @param {string} key - Cache key
 * @param {number} ttl - New TTL in seconds
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await updateCacheTTL(redis, 'session:abc123', 1800);
 * ```
 */
const updateCacheTTL = async (cache, key, ttl) => {
    try {
        if (cache instanceof Map) {
            const entry = cache.get(key);
            if (entry) {
                entry.expiresAt = Date.now() + ttl * 1000;
                return true;
            }
            return false;
        }
        else {
            return await cache.expire(key, ttl) === 1;
        }
    }
    catch (error) {
        console.error('Update TTL error:', error);
        return false;
    }
};
exports.updateCacheTTL = updateCacheTTL;
/**
 * Gets remaining TTL for a cache entry.
 *
 * @param {any} cache - Cache instance
 * @param {string} key - Cache key
 * @returns {Promise<number>} Remaining TTL in seconds, -1 if no expiry, -2 if not found
 *
 * @example
 * ```typescript
 * const ttl = await getCacheTTL(redis, 'session:abc123');
 * ```
 */
const getCacheTTL = async (cache, key) => {
    try {
        if (cache instanceof Map) {
            const entry = cache.get(key);
            if (!entry)
                return -2;
            if (entry.expiresAt === Infinity)
                return -1;
            return Math.max(0, Math.floor((entry.expiresAt - Date.now()) / 1000));
        }
        else {
            return await cache.ttl(key);
        }
    }
    catch (error) {
        console.error('Get TTL error:', error);
        return -2;
    }
};
exports.getCacheTTL = getCacheTTL;
/**
 * Refreshes TTL for a cache entry (extends expiration).
 *
 * @param {any} cache - Cache instance
 * @param {string} key - Cache key
 * @param {number} ttl - New TTL in seconds
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await refreshCacheTTL(redis, 'active-session:xyz', 3600);
 * ```
 */
const refreshCacheTTL = async (cache, key, ttl) => {
    return await (0, exports.updateCacheTTL)(cache, key, ttl);
};
exports.refreshCacheTTL = refreshCacheTTL;
// ============================================================================
// CACHE WARMING
// ============================================================================
/**
 * Warms up cache by preloading data in batches.
 *
 * @param {string[]} keys - Keys to warm
 * @param {(key: string) => Promise<any>} loader - Function to load each key
 * @param {any} cache - Cache instance
 * @param {CacheWarmingConfig} config - Warming configuration
 * @returns {Promise<number>} Number of keys warmed
 *
 * @example
 * ```typescript
 * await warmCache(
 *   ['user:1', 'user:2', 'user:3'],
 *   (key) => User.findByPk(key.split(':')[1]),
 *   redis,
 *   { batchSize: 10, concurrency: 3 }
 * );
 * ```
 */
const warmCache = async (keys, loader, cache, config) => {
    const { batchSize, concurrency, delay = 0 } = config;
    let warmed = 0;
    for (let i = 0; i < keys.length; i += batchSize) {
        const batch = keys.slice(i, i + batchSize);
        const chunks = [];
        for (let j = 0; j < batch.length; j += concurrency) {
            chunks.push(batch.slice(j, j + concurrency));
        }
        for (const chunk of chunks) {
            await Promise.all(chunk.map(async (key) => {
                try {
                    const data = await loader(key);
                    if (data !== null) {
                        if (cache instanceof Map) {
                            (0, exports.setMemoryCache)(cache, key, data);
                        }
                        else {
                            await (0, exports.setRedisCache)(cache, key, data);
                        }
                        warmed++;
                    }
                }
                catch (error) {
                    console.error(`Error warming cache for key ${key}:`, error);
                }
            }));
            if (delay > 0) {
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    return warmed;
};
exports.warmCache = warmCache;
/**
 * Warms cache for frequently accessed items based on access patterns.
 *
 * @param {Map<string, CacheEntry<any>>} cache - Cache map instance
 * @param {number} topN - Number of top items to warm
 * @param {(key: string) => Promise<any>} loader - Function to reload data
 * @returns {Promise<number>} Number of items warmed
 *
 * @example
 * ```typescript
 * await warmFrequentlyAccessed(cache, 100, (key) => loadFromDB(key));
 * ```
 */
const warmFrequentlyAccessed = async (cache, topN, loader) => {
    const entries = Array.from(cache.entries())
        .sort((a, b) => (b[1].hits || 0) - (a[1].hits || 0))
        .slice(0, topN);
    let warmed = 0;
    for (const [key] of entries) {
        try {
            const data = await loader(key);
            if (data !== null) {
                (0, exports.setMemoryCache)(cache, key, data);
                warmed++;
            }
        }
        catch (error) {
            console.error(`Error warming frequently accessed key ${key}:`, error);
        }
    }
    return warmed;
};
exports.warmFrequentlyAccessed = warmFrequentlyAccessed;
// ============================================================================
// MULTI-LEVEL CACHING
// ============================================================================
/**
 * Gets data from multi-level cache (L1 memory, L2 Redis).
 *
 * @param {string} key - Cache key
 * @param {Map<string, CacheEntry<any>>} l1Cache - L1 memory cache
 * @param {any} l2Cache - L2 Redis cache
 * @param {MultiLevelCacheOptions} [options] - Cache options
 * @returns {Promise<any>} Cached value or null
 *
 * @example
 * ```typescript
 * const data = await getMultiLevelCache('user:123', memCache, redis);
 * ```
 */
const getMultiLevelCache = async (key, l1Cache, l2Cache, options = {}) => {
    const { skipL1 = false, skipL2 = false } = options;
    // Try L1 cache first
    if (!skipL1) {
        const l1Value = (0, exports.getMemoryCache)(l1Cache, key);
        if (l1Value !== null)
            return l1Value;
    }
    // Try L2 cache
    if (!skipL2) {
        const l2Value = await (0, exports.getRedisCache)(l2Cache, key);
        if (l2Value !== null) {
            // Promote to L1
            (0, exports.setMemoryCache)(l1Cache, key, l2Value, { ttl: options.l1Ttl });
            return l2Value;
        }
    }
    return null;
};
exports.getMultiLevelCache = getMultiLevelCache;
/**
 * Sets data in multi-level cache with different TTLs.
 *
 * @param {string} key - Cache key
 * @param {any} value - Value to cache
 * @param {Map<string, CacheEntry<any>>} l1Cache - L1 memory cache
 * @param {any} l2Cache - L2 Redis cache
 * @param {MultiLevelCacheOptions} [options] - Cache options
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await setMultiLevelCache('user:123', userData, memCache, redis, {
 *   l1Ttl: 60,
 *   l2Ttl: 300
 * });
 * ```
 */
const setMultiLevelCache = async (key, value, l1Cache, l2Cache, options = {}) => {
    const { l1Ttl = 60, l2Ttl = 300, skipL1 = false, skipL2 = false } = options;
    try {
        if (!skipL1) {
            (0, exports.setMemoryCache)(l1Cache, key, value, { ttl: l1Ttl });
        }
        if (!skipL2) {
            await (0, exports.setRedisCache)(l2Cache, key, value, { ttl: l2Ttl });
        }
        return true;
    }
    catch (error) {
        console.error('Multi-level cache set error:', error);
        return false;
    }
};
exports.setMultiLevelCache = setMultiLevelCache;
/**
 * Invalidates data from all cache levels.
 *
 * @param {string} key - Cache key or pattern
 * @param {Map<string, CacheEntry<any>>} l1Cache - L1 memory cache
 * @param {any} l2Cache - L2 Redis cache
 * @param {boolean} [isPattern=false] - Whether key is a pattern
 * @returns {Promise<number>} Total number of entries invalidated
 *
 * @example
 * ```typescript
 * await invalidateMultiLevelCache('user:*', memCache, redis, true);
 * ```
 */
const invalidateMultiLevelCache = async (key, l1Cache, l2Cache, isPattern = false) => {
    let count = 0;
    // Invalidate L1
    if (isPattern) {
        count += await (0, exports.invalidateByPattern)(l1Cache, key);
    }
    else {
        if ((0, exports.deleteMemoryCache)(l1Cache, key))
            count++;
    }
    // Invalidate L2
    count += await (0, exports.deleteRedisCache)(l2Cache, key, isPattern);
    return count;
};
exports.invalidateMultiLevelCache = invalidateMultiLevelCache;
// ============================================================================
// DISTRIBUTED CACHE COORDINATION
// ============================================================================
/**
 * Acquires a distributed lock using Redis.
 *
 * @param {any} redisClient - Redis client instance
 * @param {string} lockKey - Lock identifier
 * @param {string} lockValue - Unique lock value
 * @param {DistributedLockOptions} options - Lock options
 * @returns {Promise<boolean>} Whether lock was acquired
 *
 * @example
 * ```typescript
 * const acquired = await acquireDistributedLock(
 *   redis,
 *   'lock:cache-rebuild',
 *   'worker-123',
 *   { ttl: 30, maxRetries: 3 }
 * );
 * ```
 */
const acquireDistributedLock = async (redisClient, lockKey, lockValue, options) => {
    const { ttl, retryDelay = 100, maxRetries = 0 } = options;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            const result = await redisClient.set(lockKey, lockValue, 'EX', ttl, 'NX');
            if (result === 'OK')
                return true;
            if (attempt < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, retryDelay));
            }
        }
        catch (error) {
            console.error('Distributed lock acquire error:', error);
        }
    }
    return false;
};
exports.acquireDistributedLock = acquireDistributedLock;
/**
 * Releases a distributed lock using Redis.
 *
 * @param {any} redisClient - Redis client instance
 * @param {string} lockKey - Lock identifier
 * @param {string} lockValue - Unique lock value
 * @returns {Promise<boolean>} Whether lock was released
 *
 * @example
 * ```typescript
 * await releaseDistributedLock(redis, 'lock:cache-rebuild', 'worker-123');
 * ```
 */
const releaseDistributedLock = async (redisClient, lockKey, lockValue) => {
    try {
        // Lua script for atomic check-and-delete
        const script = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    `;
        const result = await redisClient.eval(script, 1, lockKey, lockValue);
        return result === 1;
    }
    catch (error) {
        console.error('Distributed lock release error:', error);
        return false;
    }
};
exports.releaseDistributedLock = releaseDistributedLock;
// ============================================================================
// CACHE STATISTICS
// ============================================================================
/**
 * Collects comprehensive cache statistics.
 *
 * @param {Map<string, CacheEntry<any>>} cache - Cache map instance
 * @returns {CacheStats} Cache statistics
 *
 * @example
 * ```typescript
 * const stats = getCacheStats(cache);
 * console.log(`Hit rate: ${stats.hitRate}%`);
 * ```
 */
const getCacheStats = (cache) => {
    let hits = 0;
    let totalAge = 0;
    const now = Date.now();
    for (const entry of cache.values()) {
        hits += entry.hits || 0;
        totalAge += now - entry.createdAt;
    }
    const size = cache.size;
    const avgAge = size > 0 ? totalAge / size / 1000 : 0;
    return {
        hits,
        misses: 0, // Would need to track separately
        sets: 0, // Would need to track separately
        deletes: 0, // Would need to track separately
        hitRate: 0, // Would need hit + miss count
        size,
    };
};
exports.getCacheStats = getCacheStats;
/**
 * Tracks cache hit/miss and updates statistics.
 *
 * @param {CacheStats} stats - Statistics object
 * @param {boolean} isHit - Whether operation was a hit
 * @returns {void}
 *
 * @example
 * ```typescript
 * trackCacheAccess(stats, true); // Record a hit
 * trackCacheAccess(stats, false); // Record a miss
 * ```
 */
const trackCacheAccess = (stats, isHit) => {
    if (isHit) {
        stats.hits++;
    }
    else {
        stats.misses++;
    }
    const total = stats.hits + stats.misses;
    stats.hitRate = total > 0 ? (stats.hits / total) * 100 : 0;
};
exports.trackCacheAccess = trackCacheAccess;
// ============================================================================
// SEQUELIZE QUERY RESULT CACHING
// ============================================================================
/**
 * Caches Sequelize query results with automatic key generation.
 *
 * @param {any} model - Sequelize model
 * @param {any} queryOptions - Sequelize query options
 * @param {any} cache - Cache instance
 * @param {CacheOptions} [cacheOptions] - Cache options
 * @returns {Promise<any>} Query results
 *
 * @example
 * ```typescript
 * const users = await cacheSequelizeQuery(
 *   User,
 *   { where: { status: 'active' }, limit: 10 },
 *   redis,
 *   { ttl: 300, namespace: 'users' }
 * );
 * ```
 */
const cacheSequelizeQuery = async (model, queryOptions, cache, cacheOptions = {}) => {
    const key = (0, exports.generateQueryCacheKey)(model.name, queryOptions);
    return await (0, exports.cacheAside)(key, async () => await model.findAll(queryOptions), cache, cacheOptions);
};
exports.cacheSequelizeQuery = cacheSequelizeQuery;
/**
 * Invalidates Sequelize model cache on data changes.
 *
 * @param {any} model - Sequelize model
 * @param {any} cache - Cache instance
 * @param {string} [namespace] - Optional namespace
 * @returns {Promise<number>} Number of entries invalidated
 *
 * @example
 * ```typescript
 * await invalidateSequelizeCache(User, redis, 'users');
 * ```
 */
const invalidateSequelizeCache = async (model, cache, namespace) => {
    const pattern = namespace ? `${namespace}:*` : `${model.name}:*`;
    return await (0, exports.invalidateByPattern)(cache, pattern);
};
exports.invalidateSequelizeCache = invalidateSequelizeCache;
/**
 * Sets up automatic cache invalidation hooks for Sequelize model.
 *
 * @param {any} model - Sequelize model
 * @param {any} cache - Cache instance
 * @param {string} [namespace] - Optional namespace
 * @returns {void}
 *
 * @example
 * ```typescript
 * setupSequelizeCacheHooks(User, redis, 'users');
 * ```
 */
const setupSequelizeCacheHooks = (model, cache, namespace) => {
    const invalidateCache = async () => {
        await (0, exports.invalidateSequelizeCache)(model, cache, namespace);
    };
    model.addHook('afterCreate', invalidateCache);
    model.addHook('afterUpdate', invalidateCache);
    model.addHook('afterDestroy', invalidateCache);
    model.addHook('afterBulkCreate', invalidateCache);
    model.addHook('afterBulkUpdate', invalidateCache);
    model.addHook('afterBulkDestroy', invalidateCache);
};
exports.setupSequelizeCacheHooks = setupSequelizeCacheHooks;
/**
 * Exports cache data to JSON for backup or migration.
 *
 * @param {Map<string, CacheEntry<any>>} cache - Cache map instance
 * @returns {string} JSON representation of cache
 *
 * @example
 * ```typescript
 * const backup = exportCacheToJSON(cache);
 * await fs.writeFile('cache-backup.json', backup);
 * ```
 */
const exportCacheToJSON = (cache) => {
    const entries = Array.from(cache.entries()).map(([key, value]) => ({
        key,
        value: value.value,
        expiresAt: value.expiresAt,
        tags: value.tags,
        hits: value.hits,
        createdAt: value.createdAt,
    }));
    return JSON.stringify(entries, null, 2);
};
exports.exportCacheToJSON = exportCacheToJSON;
/**
 * Imports cache data from JSON backup.
 *
 * @param {Map<string, CacheEntry<any>>} cache - Cache map instance
 * @param {string} jsonData - JSON representation of cache
 * @returns {number} Number of entries imported
 *
 * @example
 * ```typescript
 * const backup = await fs.readFile('cache-backup.json', 'utf-8');
 * const count = importCacheFromJSON(cache, backup);
 * console.log(`Imported ${count} cache entries`);
 * ```
 */
const importCacheFromJSON = (cache, jsonData) => {
    const entries = JSON.parse(jsonData);
    let count = 0;
    for (const entry of entries) {
        cache.set(entry.key, {
            value: entry.value,
            expiresAt: entry.expiresAt,
            tags: entry.tags,
            hits: entry.hits || 0,
            createdAt: entry.createdAt,
        });
        count++;
    }
    return count;
};
exports.importCacheFromJSON = importCacheFromJSON;
//# sourceMappingURL=cache-management-utils.js.map