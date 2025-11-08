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

/**
 * File: /reuse/cache-management-utils.ts
 * Locator: WC-UTL-CACHE-001
 * Purpose: Comprehensive Cache Management Utilities - Redis, in-memory, multi-level caching
 *
 * Upstream: Independent utility module for cache operations
 * Downstream: ../backend/*, Sequelize services, API middleware, query optimizers
 * Dependencies: TypeScript 5.x, Node 18+, Redis client, ioredis
 * Exports: 42 utility functions for cache management, invalidation, compression, and coordination
 *
 * LLM Context: Complete cache management utilities for White Cross healthcare system.
 * Provides Redis integration, in-memory LRU caching, multi-level cache hierarchies,
 * cache-aside/write-through patterns, TTL management, distributed coordination, and
 * Sequelize query result caching. Essential for high-performance healthcare data access.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface CacheOptions {
  ttl?: number;
  namespace?: string;
  compress?: boolean;
  tags?: string[];
}

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
  tags?: string[];
  hits?: number;
  createdAt: number;
}

interface CacheStats {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  hitRate: number;
  size: number;
}

interface LRUCacheOptions {
  maxSize: number;
  ttl?: number;
  onEvict?: (key: string, value: any) => void;
}

interface CacheKeyOptions {
  prefix?: string;
  namespace?: string;
  version?: string;
  separator?: string;
}

interface MultiLevelCacheOptions {
  l1Ttl?: number;
  l2Ttl?: number;
  l1MaxSize?: number;
  skipL1?: boolean;
  skipL2?: boolean;
}

interface CacheWarmingConfig {
  batchSize: number;
  concurrency: number;
  delay?: number;
}

interface DistributedLockOptions {
  ttl: number;
  retryDelay?: number;
  maxRetries?: number;
}

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
export const setRedisCache = async (
  redisClient: any,
  key: string,
  value: any,
  options: CacheOptions = {},
): Promise<boolean> => {
  try {
    const { ttl, namespace, compress = false } = options;
    const cacheKey = namespace ? `${namespace}:${key}` : key;
    let serialized = JSON.stringify(value);

    if (compress) {
      const zlib = await import('zlib');
      const compressed = zlib.gzipSync(serialized);
      serialized = compressed.toString('base64');
    }

    if (ttl) {
      await redisClient.setex(cacheKey, ttl, serialized);
    } else {
      await redisClient.set(cacheKey, serialized);
    }

    return true;
  } catch (error) {
    console.error('Redis cache set error:', error);
    return false;
  }
};

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
export const getRedisCache = async (
  redisClient: any,
  key: string,
  options: CacheOptions = {},
): Promise<any> => {
  try {
    const { namespace, compress = false } = options;
    const cacheKey = namespace ? `${namespace}:${key}` : key;
    const cached = await redisClient.get(cacheKey);

    if (!cached) return null;

    let serialized = cached;

    if (compress) {
      const zlib = await import('zlib');
      const buffer = Buffer.from(cached, 'base64');
      serialized = zlib.gunzipSync(buffer).toString();
    }

    return JSON.parse(serialized);
  } catch (error) {
    console.error('Redis cache get error:', error);
    return null;
  }
};

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
export const deleteRedisCache = async (
  redisClient: any,
  pattern: string,
  isPattern: boolean = false,
): Promise<number> => {
  try {
    if (!isPattern) {
      return await redisClient.del(pattern);
    }

    const keys = await redisClient.keys(pattern);
    if (keys.length === 0) return 0;

    return await redisClient.del(...keys);
  } catch (error) {
    console.error('Redis cache delete error:', error);
    return 0;
  }
};

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
export const incrementRedisCounter = async (
  redisClient: any,
  key: string,
  increment: number = 1,
  ttl?: number,
): Promise<number> => {
  try {
    const newValue = await redisClient.incrby(key, increment);
    if (ttl && newValue === increment) {
      await redisClient.expire(key, ttl);
    }
    return newValue;
  } catch (error) {
    console.error('Redis increment error:', error);
    return 0;
  }
};

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
export const setRedisMultiple = async (
  redisClient: any,
  entries: Record<string, any>,
  ttl?: number,
): Promise<boolean> => {
  try {
    const pipeline = redisClient.pipeline();

    for (const [key, value] of Object.entries(entries)) {
      const serialized = JSON.stringify(value);
      if (ttl) {
        pipeline.setex(key, ttl, serialized);
      } else {
        pipeline.set(key, serialized);
      }
    }

    await pipeline.exec();
    return true;
  } catch (error) {
    console.error('Redis multi-set error:', error);
    return false;
  }
};

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
export const getRedisMultiple = async (
  redisClient: any,
  keys: string[],
): Promise<Record<string, any>> => {
  try {
    const values = await redisClient.mget(...keys);
    const result: Record<string, any> = {};

    keys.forEach((key, index) => {
      if (values[index]) {
        try {
          result[key] = JSON.parse(values[index]);
        } catch {
          result[key] = values[index];
        }
      }
    });

    return result;
  } catch (error) {
    console.error('Redis multi-get error:', error);
    return {};
  }
};

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
export const createMemoryCache = (): Map<string, CacheEntry<any>> => {
  return new Map<string, CacheEntry<any>>();
};

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
export const setMemoryCache = <T>(
  cache: Map<string, CacheEntry<T>>,
  key: string,
  value: T,
  options: CacheOptions = {},
): boolean => {
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
  } catch (error) {
    console.error('Memory cache set error:', error);
    return false;
  }
};

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
export const getMemoryCache = <T>(
  cache: Map<string, CacheEntry<T>>,
  key: string,
): T | null => {
  const entry = cache.get(key);

  if (!entry) return null;

  if (entry.expiresAt < Date.now()) {
    cache.delete(key);
    return null;
  }

  entry.hits = (entry.hits || 0) + 1;
  return entry.value;
};

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
export const deleteMemoryCache = (
  cache: Map<string, CacheEntry<any>>,
  key: string,
): boolean => {
  return cache.delete(key);
};

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
export const clearExpiredMemoryCache = (
  cache: Map<string, CacheEntry<any>>,
): number => {
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
export const createLRUCache = (
  options: LRUCacheOptions,
): Map<string, CacheEntry<any>> => {
  const cache = new Map<string, CacheEntry<any>>();
  const { maxSize, ttl, onEvict } = options;

  const originalSet = cache.set.bind(cache);
  cache.set = (key: string, value: CacheEntry<any>) => {
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
export const setLRUCache = <T>(
  cache: Map<string, CacheEntry<T>>,
  key: string,
  value: T,
  ttl?: number,
): boolean => {
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
  } catch (error) {
    console.error('LRU cache set error:', error);
    return false;
  }
};

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
export const getLRUCache = <T>(
  cache: Map<string, CacheEntry<T>>,
  key: string,
): T | null => {
  const entry = cache.get(key);

  if (!entry) return null;

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
export const generateCacheKey = (
  parts: string[],
  options: CacheKeyOptions = {},
): string => {
  const { prefix, namespace, version, separator = ':' } = options;
  const components: string[] = [];

  if (prefix) components.push(prefix);
  if (namespace) components.push(namespace);
  if (version) components.push(version);
  components.push(...parts.map(p => String(p)));

  return components.join(separator);
};

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
export const generateQueryCacheKey = (
  base: string,
  params: Record<string, any>,
): string => {
  const sortedKeys = Object.keys(params).sort();
  const parts = sortedKeys.map(key => `${key}=${JSON.stringify(params[key])}`);
  return `${base}:${parts.join(':')}`;
};

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
export const namespaceCacheKey = (
  namespace: string,
  identifier: string,
  suffix?: string,
): string => {
  const parts = [namespace, identifier];
  if (suffix) parts.push(suffix);
  return parts.join(':');
};

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
export const hashCacheKey = (obj: any): string => {
  const crypto = require('crypto');
  const str = JSON.stringify(obj, Object.keys(obj).sort());
  return crypto.createHash('md5').update(str).digest('hex').substring(0, 8);
};

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
export const cacheAside = async <T>(
  key: string,
  loader: () => Promise<T>,
  cache: any,
  options: CacheOptions = {},
): Promise<T> => {
  // Try to get from cache
  const cached = cache instanceof Map
    ? getMemoryCache(cache, key)
    : await getRedisCache(cache, key, options);

  if (cached !== null) {
    return cached;
  }

  // Load data
  const data = await loader();

  // Cache the result
  if (cache instanceof Map) {
    setMemoryCache(cache, key, data, options);
  } else {
    await setRedisCache(cache, key, data, options);
  }

  return data;
};

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
export const cacheAsideWithFallback = async <T>(
  key: string,
  loader: () => Promise<T>,
  cache: any,
  options: CacheOptions = {},
): Promise<T | null> => {
  try {
    return await cacheAside(key, loader, cache, options);
  } catch (error) {
    console.error('Cache-aside with fallback error:', error);
    // Return stale cache data if available
    return cache instanceof Map
      ? getMemoryCache(cache, key)
      : await getRedisCache(cache, key, options);
  }
};

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
export const writeThrough = async <T>(
  key: string,
  value: T,
  persister: () => Promise<void>,
  cache: any,
  options: CacheOptions = {},
): Promise<boolean> => {
  try {
    // Write to database first
    await persister();

    // Then update cache
    if (cache instanceof Map) {
      setMemoryCache(cache, key, value, options);
    } else {
      await setRedisCache(cache, key, value, options);
    }

    return true;
  } catch (error) {
    console.error('Write-through error:', error);
    return false;
  }
};

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
export const writeBack = async <T>(
  key: string,
  value: T,
  persister: () => Promise<void>,
  cache: any,
  options: CacheOptions = {},
): Promise<boolean> => {
  try {
    // Write to cache immediately
    if (cache instanceof Map) {
      setMemoryCache(cache, key, value, options);
    } else {
      await setRedisCache(cache, key, value, options);
    }

    // Persist asynchronously
    setImmediate(async () => {
      try {
        await persister();
      } catch (error) {
        console.error('Write-back persistence error:', error);
      }
    });

    return true;
  } catch (error) {
    console.error('Write-back error:', error);
    return false;
  }
};

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
export const invalidateByTag = (
  cache: Map<string, CacheEntry<any>>,
  tag: string,
): number => {
  let count = 0;

  for (const [key, entry] of cache.entries()) {
    if (entry.tags && entry.tags.includes(tag)) {
      cache.delete(key);
      count++;
    }
  }

  return count;
};

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
export const invalidateByPattern = async (
  cache: any,
  pattern: string,
): Promise<number> => {
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
  } else {
    return await deleteRedisCache(cache, pattern, true);
  }
};

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
export const invalidateByAge = (
  cache: Map<string, CacheEntry<any>>,
  maxAge: number,
): number => {
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
export const updateCacheTTL = async (
  cache: any,
  key: string,
  ttl: number,
): Promise<boolean> => {
  try {
    if (cache instanceof Map) {
      const entry = cache.get(key);
      if (entry) {
        entry.expiresAt = Date.now() + ttl * 1000;
        return true;
      }
      return false;
    } else {
      return await cache.expire(key, ttl) === 1;
    }
  } catch (error) {
    console.error('Update TTL error:', error);
    return false;
  }
};

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
export const getCacheTTL = async (
  cache: any,
  key: string,
): Promise<number> => {
  try {
    if (cache instanceof Map) {
      const entry = cache.get(key);
      if (!entry) return -2;
      if (entry.expiresAt === Infinity) return -1;
      return Math.max(0, Math.floor((entry.expiresAt - Date.now()) / 1000));
    } else {
      return await cache.ttl(key);
    }
  } catch (error) {
    console.error('Get TTL error:', error);
    return -2;
  }
};

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
export const refreshCacheTTL = async (
  cache: any,
  key: string,
  ttl: number,
): Promise<boolean> => {
  return await updateCacheTTL(cache, key, ttl);
};

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
export const warmCache = async (
  keys: string[],
  loader: (key: string) => Promise<any>,
  cache: any,
  config: CacheWarmingConfig,
): Promise<number> => {
  const { batchSize, concurrency, delay = 0 } = config;
  let warmed = 0;

  for (let i = 0; i < keys.length; i += batchSize) {
    const batch = keys.slice(i, i + batchSize);
    const chunks: string[][] = [];

    for (let j = 0; j < batch.length; j += concurrency) {
      chunks.push(batch.slice(j, j + concurrency));
    }

    for (const chunk of chunks) {
      await Promise.all(
        chunk.map(async (key) => {
          try {
            const data = await loader(key);
            if (data !== null) {
              if (cache instanceof Map) {
                setMemoryCache(cache, key, data);
              } else {
                await setRedisCache(cache, key, data);
              }
              warmed++;
            }
          } catch (error) {
            console.error(`Error warming cache for key ${key}:`, error);
          }
        }),
      );

      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  return warmed;
};

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
export const warmFrequentlyAccessed = async (
  cache: Map<string, CacheEntry<any>>,
  topN: number,
  loader: (key: string) => Promise<any>,
): Promise<number> => {
  const entries = Array.from(cache.entries())
    .sort((a, b) => (b[1].hits || 0) - (a[1].hits || 0))
    .slice(0, topN);

  let warmed = 0;

  for (const [key] of entries) {
    try {
      const data = await loader(key);
      if (data !== null) {
        setMemoryCache(cache, key, data);
        warmed++;
      }
    } catch (error) {
      console.error(`Error warming frequently accessed key ${key}:`, error);
    }
  }

  return warmed;
};

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
export const getMultiLevelCache = async (
  key: string,
  l1Cache: Map<string, CacheEntry<any>>,
  l2Cache: any,
  options: MultiLevelCacheOptions = {},
): Promise<any> => {
  const { skipL1 = false, skipL2 = false } = options;

  // Try L1 cache first
  if (!skipL1) {
    const l1Value = getMemoryCache(l1Cache, key);
    if (l1Value !== null) return l1Value;
  }

  // Try L2 cache
  if (!skipL2) {
    const l2Value = await getRedisCache(l2Cache, key);
    if (l2Value !== null) {
      // Promote to L1
      setMemoryCache(l1Cache, key, l2Value, { ttl: options.l1Ttl });
      return l2Value;
    }
  }

  return null;
};

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
export const setMultiLevelCache = async (
  key: string,
  value: any,
  l1Cache: Map<string, CacheEntry<any>>,
  l2Cache: any,
  options: MultiLevelCacheOptions = {},
): Promise<boolean> => {
  const { l1Ttl = 60, l2Ttl = 300, skipL1 = false, skipL2 = false } = options;

  try {
    if (!skipL1) {
      setMemoryCache(l1Cache, key, value, { ttl: l1Ttl });
    }

    if (!skipL2) {
      await setRedisCache(l2Cache, key, value, { ttl: l2Ttl });
    }

    return true;
  } catch (error) {
    console.error('Multi-level cache set error:', error);
    return false;
  }
};

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
export const invalidateMultiLevelCache = async (
  key: string,
  l1Cache: Map<string, CacheEntry<any>>,
  l2Cache: any,
  isPattern: boolean = false,
): Promise<number> => {
  let count = 0;

  // Invalidate L1
  if (isPattern) {
    count += await invalidateByPattern(l1Cache, key);
  } else {
    if (deleteMemoryCache(l1Cache, key)) count++;
  }

  // Invalidate L2
  count += await deleteRedisCache(l2Cache, key, isPattern);

  return count;
};

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
export const acquireDistributedLock = async (
  redisClient: any,
  lockKey: string,
  lockValue: string,
  options: DistributedLockOptions,
): Promise<boolean> => {
  const { ttl, retryDelay = 100, maxRetries = 0 } = options;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await redisClient.set(lockKey, lockValue, 'EX', ttl, 'NX');
      if (result === 'OK') return true;

      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    } catch (error) {
      console.error('Distributed lock acquire error:', error);
    }
  }

  return false;
};

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
export const releaseDistributedLock = async (
  redisClient: any,
  lockKey: string,
  lockValue: string,
): Promise<boolean> => {
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
  } catch (error) {
    console.error('Distributed lock release error:', error);
    return false;
  }
};

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
export const getCacheStats = (
  cache: Map<string, CacheEntry<any>>,
): CacheStats => {
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
export const trackCacheAccess = (
  stats: CacheStats,
  isHit: boolean,
): void => {
  if (isHit) {
    stats.hits++;
  } else {
    stats.misses++;
  }

  const total = stats.hits + stats.misses;
  stats.hitRate = total > 0 ? (stats.hits / total) * 100 : 0;
};

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
export const cacheSequelizeQuery = async (
  model: any,
  queryOptions: any,
  cache: any,
  cacheOptions: CacheOptions = {},
): Promise<any> => {
  const key = generateQueryCacheKey(model.name, queryOptions);

  return await cacheAside(
    key,
    async () => await model.findAll(queryOptions),
    cache,
    cacheOptions,
  );
};

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
export const invalidateSequelizeCache = async (
  model: any,
  cache: any,
  namespace?: string,
): Promise<number> => {
  const pattern = namespace ? `${namespace}:*` : `${model.name}:*`;
  return await invalidateByPattern(cache, pattern);
};

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
export const setupSequelizeCacheHooks = (
  model: any,
  cache: any,
  namespace?: string,
): void => {
  const invalidateCache = async () => {
    await invalidateSequelizeCache(model, cache, namespace);
  };

  model.addHook('afterCreate', invalidateCache);
  model.addHook('afterUpdate', invalidateCache);
  model.addHook('afterDestroy', invalidateCache);
  model.addHook('afterBulkCreate', invalidateCache);
  model.addHook('afterBulkUpdate', invalidateCache);
  model.addHook('afterBulkDestroy', invalidateCache);
};

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
export const exportCacheToJSON = (
  cache: Map<string, CacheEntry<any>>,
): string => {
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
export const importCacheFromJSON = (
  cache: Map<string, CacheEntry<any>>,
  jsonData: string,
): number => {
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
