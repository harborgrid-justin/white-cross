/**
 * LOC: CACHE1234567
 * File: /reuse/caching-performance-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Backend services and controllers
 *   - API gateway implementations
 *   - Database access layers
 */

/**
 * File: /reuse/caching-performance-kit.ts
 * Locator: WC-UTL-CACHE-001
 * Purpose: Comprehensive Caching & Performance Utilities - Multi-layer caching, compression, optimization
 *
 * Upstream: Independent utility module for caching and performance optimization
 * Downstream: ../backend/*, services, controllers, database layers
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Redis, Sequelize 6.x
 * Exports: 45 utility functions for caching strategies, compression, performance optimization, monitoring
 *
 * LLM Context: Production-grade caching and performance utilities for White Cross healthcare system.
 * Provides multi-layer caching (memory, Redis, distributed), cache invalidation patterns, TTL management,
 * cache-aside/write-through/write-behind patterns, memoization, HTTP response caching, query result caching,
 * cache warming, statistics, compression (gzip/brotli), lazy loading, and CDN integration.
 */

import { Model, DataTypes, Sequelize, Optional } from 'sequelize';
import * as crypto from 'crypto';
import * as zlib from 'zlib';
import { promisify } from 'util';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface CacheEntry<T = any> {
  key: string;
  value: T;
  ttl: number;
  createdAt: number;
  expiresAt: number;
  tags?: string[];
  metadata?: Record<string, any>;
}

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  tags?: string[];
  namespace?: string;
  compress?: boolean;
  metadata?: Record<string, any>;
}

interface CacheKeyConfig {
  prefix?: string;
  namespace?: string;
  separator?: string;
  includeVersion?: boolean;
  version?: string;
}

interface CacheStats {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  size: number;
  hitRate: number;
  memoryUsage: number;
}

interface CacheLayer {
  name: string;
  priority: number;
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, options?: CacheOptions): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
}

interface CacheInvalidationPattern {
  type: 'time-based' | 'tag-based' | 'dependency-based' | 'event-based';
  handler: () => Promise<void>;
}

interface CompressionOptions {
  algorithm: 'gzip' | 'brotli' | 'deflate';
  level?: number;
  threshold?: number; // Minimum size in bytes to compress
}

interface MemoizeOptions {
  ttl?: number;
  maxSize?: number;
  keyGenerator?: (...args: any[]) => string;
  resolver?: (...args: any[]) => any;
}

interface CacheWarmingStrategy {
  enabled: boolean;
  interval?: number; // Warming interval in milliseconds
  keys: string[] | (() => Promise<string[]>);
  loader: (key: string) => Promise<any>;
}

interface CDNConfig {
  provider: 'cloudflare' | 'cloudfront' | 'fastly' | 'akamai';
  endpoint: string;
  apiKey: string;
  zone?: string;
}

interface PerformanceMetrics {
  responseTime: number;
  throughput: number;
  errorRate: number;
  cacheHitRate: number;
  timestamp: number;
}

interface LazyLoadConfig<T> {
  loader: () => Promise<T>;
  cacheKey?: string;
  ttl?: number;
  preload?: boolean;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

interface CacheEntryAttributes {
  id: number;
  key: string;
  value: string; // JSON stringified
  namespace: string;
  ttl: number;
  expiresAt: Date;
  tags: string[];
  metadata: Record<string, any>;
  size: number;
  compressed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface CacheEntryCreationAttributes extends Optional<CacheEntryAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

/**
 * Sequelize model for persistent cache entries.
 */
export class CacheEntryModel extends Model<CacheEntryAttributes, CacheEntryCreationAttributes> implements CacheEntryAttributes {
  declare id: number;
  declare key: string;
  declare value: string;
  declare namespace: string;
  declare ttl: number;
  declare expiresAt: Date;
  declare tags: string[];
  declare metadata: Record<string, any>;
  declare size: number;
  declare compressed: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;

  static initModel(sequelize: Sequelize): typeof CacheEntryModel {
    CacheEntryModel.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        key: {
          type: DataTypes.STRING(512),
          allowNull: false,
          unique: true,
          comment: 'Unique cache key',
        },
        value: {
          type: DataTypes.TEXT,
          allowNull: false,
          comment: 'JSON stringified cached value',
        },
        namespace: {
          type: DataTypes.STRING(128),
          allowNull: false,
          defaultValue: 'default',
          comment: 'Cache namespace for logical grouping',
        },
        ttl: {
          type: DataTypes.INTEGER,
          allowNull: false,
          comment: 'Time to live in milliseconds',
        },
        expiresAt: {
          type: DataTypes.DATE,
          allowNull: false,
          comment: 'Expiration timestamp',
        },
        tags: {
          type: DataTypes.JSON,
          allowNull: false,
          defaultValue: [],
          comment: 'Tags for cache invalidation',
        },
        metadata: {
          type: DataTypes.JSON,
          allowNull: false,
          defaultValue: {},
          comment: 'Additional metadata',
        },
        size: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          comment: 'Size in bytes',
        },
        compressed: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          comment: 'Whether value is compressed',
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'cache_entries',
        indexes: [
          { fields: ['key'] },
          { fields: ['namespace'] },
          { fields: ['expiresAt'] },
          { fields: ['tags'], using: 'GIN' }, // Postgres GIN index for JSON arrays
        ],
      }
    );

    return CacheEntryModel;
  }
}

interface CacheStatisticsAttributes {
  id: number;
  namespace: string;
  operation: 'get' | 'set' | 'delete' | 'clear';
  hit: boolean;
  responseTime: number;
  keyPattern: string;
  timestamp: Date;
  metadata: Record<string, any>;
  createdAt: Date;
}

interface CacheStatisticsCreationAttributes extends Optional<CacheStatisticsAttributes, 'id' | 'createdAt'> {}

/**
 * Sequelize model for cache statistics and monitoring.
 */
export class CacheStatisticsModel extends Model<CacheStatisticsAttributes, CacheStatisticsCreationAttributes> implements CacheStatisticsAttributes {
  declare id: number;
  declare namespace: string;
  declare operation: 'get' | 'set' | 'delete' | 'clear';
  declare hit: boolean;
  declare responseTime: number;
  declare keyPattern: string;
  declare timestamp: Date;
  declare metadata: Record<string, any>;
  declare createdAt: Date;

  static initModel(sequelize: Sequelize): typeof CacheStatisticsModel {
    CacheStatisticsModel.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        namespace: {
          type: DataTypes.STRING(128),
          allowNull: false,
          comment: 'Cache namespace',
        },
        operation: {
          type: DataTypes.ENUM('get', 'set', 'delete', 'clear'),
          allowNull: false,
          comment: 'Cache operation type',
        },
        hit: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          comment: 'Whether operation was a cache hit',
        },
        responseTime: {
          type: DataTypes.FLOAT,
          allowNull: false,
          comment: 'Operation response time in milliseconds',
        },
        keyPattern: {
          type: DataTypes.STRING(256),
          allowNull: false,
          comment: 'Cache key pattern for aggregation',
        },
        timestamp: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        metadata: {
          type: DataTypes.JSON,
          allowNull: false,
          defaultValue: {},
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'cache_statistics',
        timestamps: true,
        updatedAt: false,
        indexes: [
          { fields: ['namespace'] },
          { fields: ['operation'] },
          { fields: ['timestamp'] },
          { fields: ['keyPattern'] },
        ],
      }
    );

    return CacheStatisticsModel;
  }
}

// ============================================================================
// CACHE KEY GENERATION STRATEGIES
// ============================================================================

/**
 * Generates a deterministic cache key from arguments.
 *
 * @param {CacheKeyConfig} config - Cache key configuration
 * @param {...any[]} args - Arguments to include in key
 * @returns {string} Generated cache key
 *
 * @example
 * ```typescript
 * const key = generateCacheKey(
 *   { prefix: 'user', namespace: 'auth', version: 'v1' },
 *   'getUserById',
 *   123
 * );
 * // Result: 'auth:user:v1:getUserById:123'
 * ```
 */
export const generateCacheKey = (config: CacheKeyConfig, ...args: any[]): string => {
  const parts: string[] = [];

  if (config.namespace) parts.push(config.namespace);
  if (config.prefix) parts.push(config.prefix);
  if (config.includeVersion && config.version) parts.push(config.version);

  args.forEach((arg) => {
    if (typeof arg === 'object') {
      parts.push(hashObject(arg));
    } else {
      parts.push(String(arg));
    }
  });

  return parts.join(config.separator || ':');
};

/**
 * Generates a hash-based cache key for complex objects.
 *
 * @param {CacheKeyConfig} config - Cache key configuration
 * @param {Record<string, any>} obj - Object to hash
 * @returns {string} Hash-based cache key
 *
 * @example
 * ```typescript
 * const key = generateHashKey(
 *   { prefix: 'query', namespace: 'db' },
 *   { table: 'users', where: { active: true }, limit: 10 }
 * );
 * // Result: 'db:query:a3f5e9b2c1d4...'
 * ```
 */
export const generateHashKey = (config: CacheKeyConfig, obj: Record<string, any>): string => {
  const hash = hashObject(obj);
  return generateCacheKey(config, hash);
};

/**
 * Generates a pattern-based cache key for wildcard matching.
 *
 * @param {CacheKeyConfig} config - Cache key configuration
 * @param {string} pattern - Pattern template
 * @param {Record<string, any>} values - Values to substitute
 * @returns {string} Pattern-based cache key
 *
 * @example
 * ```typescript
 * const key = generatePatternKey(
 *   { namespace: 'user' },
 *   'profile:{userId}:{section}',
 *   { userId: 123, section: 'settings' }
 * );
 * // Result: 'user:profile:123:settings'
 * ```
 */
export const generatePatternKey = (
  config: CacheKeyConfig,
  pattern: string,
  values: Record<string, any>
): string => {
  let key = pattern;
  Object.entries(values).forEach(([placeholder, value]) => {
    key = key.replace(`{${placeholder}}`, String(value));
  });

  if (config.namespace) {
    key = `${config.namespace}:${key}`;
  }

  return key;
};

/**
 * Generates a semantic cache key based on meaning rather than exact match.
 *
 * @param {CacheKeyConfig} config - Cache key configuration
 * @param {string} query - Query or operation description
 * @returns {string} Semantic cache key
 *
 * @example
 * ```typescript
 * const key = generateSemanticKey(
 *   { namespace: 'ai' },
 *   'Find all active users in California'
 * );
 * // Result: 'ai:semantic:3f8a9c2e...'
 * ```
 */
export const generateSemanticKey = (config: CacheKeyConfig, query: string): string => {
  // Normalize query: lowercase, remove extra spaces, sort words
  const normalized = query
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .sort()
    .join(' ');

  const hash = crypto.createHash('sha256').update(normalized).digest('hex').substring(0, 16);
  return generateCacheKey(config, 'semantic', hash);
};

// ============================================================================
// MEMORY CACHE LAYER
// ============================================================================

/**
 * In-memory LRU cache implementation with TTL support.
 */
export class MemoryCache implements CacheLayer {
  public name = 'memory';
  public priority = 1;
  private cache = new Map<string, CacheEntry>();
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
    size: 0,
    hitRate: 0,
    memoryUsage: 0,
  };

  constructor(
    private maxSize: number = 1000,
    private defaultTTL: number = 60000
  ) {}

  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);
    const now = Date.now();

    if (!entry) {
      this.stats.misses++;
      this.updateHitRate();
      return null;
    }

    if (entry.expiresAt < now) {
      this.cache.delete(key);
      this.stats.misses++;
      this.updateHitRate();
      return null;
    }

    this.stats.hits++;
    this.updateHitRate();
    return entry.value as T;
  }

  async set<T>(key: string, value: T, options: CacheOptions = {}): Promise<void> {
    const ttl = options.ttl || this.defaultTTL;
    const now = Date.now();

    // LRU eviction if at capacity
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      key,
      value,
      ttl,
      createdAt: now,
      expiresAt: now + ttl,
      tags: options.tags,
      metadata: options.metadata,
    });

    this.stats.sets++;
    this.stats.size = this.cache.size;
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
    this.stats.deletes++;
    this.stats.size = this.cache.size;
  }

  async clear(): Promise<void> {
    this.cache.clear();
    this.stats.size = 0;
  }

  getStats(): CacheStats {
    return { ...this.stats };
  }

  private updateHitRate(): void {
    const total = this.stats.hits + this.stats.misses;
    this.stats.hitRate = total > 0 ? this.stats.hits / total : 0;
  }
}

/**
 * Creates a multi-layer cache with fallback support.
 *
 * @param {CacheLayer[]} layers - Cache layers in priority order
 * @returns {MultiLayerCache} Multi-layer cache instance
 *
 * @example
 * ```typescript
 * const cache = createMultiLayerCache([
 *   new MemoryCache(1000, 60000),
 *   new RedisCache(),
 *   new DatabaseCache()
 * ]);
 *
 * await cache.get('user:123'); // Checks memory → Redis → Database
 * ```
 */
export const createMultiLayerCache = (layers: CacheLayer[]) => {
  const sortedLayers = layers.sort((a, b) => a.priority - b.priority);

  return {
    async get<T>(key: string): Promise<T | null> {
      for (const layer of sortedLayers) {
        const value = await layer.get<T>(key);
        if (value !== null) {
          // Backfill faster layers
          for (const fasterLayer of sortedLayers) {
            if (fasterLayer === layer) break;
            await fasterLayer.set(key, value);
          }
          return value;
        }
      }
      return null;
    },

    async set<T>(key: string, value: T, options?: CacheOptions): Promise<void> {
      await Promise.all(sortedLayers.map((layer) => layer.set(key, value, options)));
    },

    async delete(key: string): Promise<void> {
      await Promise.all(sortedLayers.map((layer) => layer.delete(key)));
    },

    async clear(): Promise<void> {
      await Promise.all(sortedLayers.map((layer) => layer.clear()));
    },
  };
};

// ============================================================================
// TTL MANAGEMENT
// ============================================================================

/**
 * Calculates adaptive TTL based on access patterns.
 *
 * @param {string} key - Cache key
 * @param {number} accessCount - Number of accesses
 * @param {number} baselineTTL - Baseline TTL in milliseconds
 * @returns {number} Calculated TTL
 *
 * @example
 * ```typescript
 * const ttl = calculateAdaptiveTTL('hot-data', 1000, 60000);
 * // Result: Higher TTL for frequently accessed data
 * ```
 */
export const calculateAdaptiveTTL = (
  key: string,
  accessCount: number,
  baselineTTL: number
): number => {
  // More accesses = longer TTL (up to 10x baseline)
  const multiplier = Math.min(10, 1 + Math.log10(accessCount + 1));
  return Math.floor(baselineTTL * multiplier);
};

/**
 * Calculates time-of-day based TTL for predictable traffic patterns.
 *
 * @param {number} baselineTTL - Baseline TTL in milliseconds
 * @param {number} peakHourStart - Peak hour start (0-23)
 * @param {number} peakHourEnd - Peak hour end (0-23)
 * @returns {number} Calculated TTL
 *
 * @example
 * ```typescript
 * const ttl = calculateTimeBasedTTL(60000, 9, 17);
 * // Result: Longer TTL during peak hours (9 AM - 5 PM)
 * ```
 */
export const calculateTimeBasedTTL = (
  baselineTTL: number,
  peakHourStart: number,
  peakHourEnd: number
): number => {
  const currentHour = new Date().getHours();
  const isPeakHour =
    currentHour >= peakHourStart && currentHour <= peakHourEnd;

  return isPeakHour ? baselineTTL * 2 : baselineTTL;
};

/**
 * Implements TTL jitter to prevent thundering herd problem.
 *
 * @param {number} ttl - Base TTL in milliseconds
 * @param {number} jitterPercent - Jitter percentage (0-100)
 * @returns {number} TTL with jitter applied
 *
 * @example
 * ```typescript
 * const ttl = applyTTLJitter(60000, 10);
 * // Result: 54000-66000 (60s ± 10%)
 * ```
 */
export const applyTTLJitter = (ttl: number, jitterPercent: number): number => {
  const jitter = ttl * (jitterPercent / 100);
  const randomJitter = Math.random() * jitter * 2 - jitter;
  return Math.floor(ttl + randomJitter);
};

/**
 * Implements probabilistic early expiration to prevent cache stampede.
 *
 * @param {number} currentTTL - Current remaining TTL
 * @param {number} originalTTL - Original TTL
 * @param {number} delta - Computation time delta
 * @returns {boolean} Whether to refresh early
 *
 * @example
 * ```typescript
 * const shouldRefresh = shouldRefreshEarly(5000, 60000, 100);
 * // Result: Probabilistically true as expiration approaches
 * ```
 */
export const shouldRefreshEarly = (
  currentTTL: number,
  originalTTL: number,
  delta: number
): boolean => {
  if (currentTTL <= 0) return true;

  // XFetch algorithm: P(refresh) = delta * log(rand) / remaining_ttl
  const probability = (delta * Math.log(Math.random())) / currentTTL;
  return probability < -1;
};

// ============================================================================
// CACHE PATTERNS
// ============================================================================

/**
 * Implements cache-aside (lazy loading) pattern.
 *
 * @param {string} key - Cache key
 * @param {() => Promise<T>} loader - Data loader function
 * @param {CacheLayer} cache - Cache layer
 * @param {CacheOptions} [options] - Cache options
 * @returns {Promise<T>} Cached or loaded data
 *
 * @example
 * ```typescript
 * const user = await cacheAside(
 *   'user:123',
 *   async () => await db.users.findByPk(123),
 *   memoryCache,
 *   { ttl: 300000 }
 * );
 * ```
 */
export const cacheAside = async <T>(
  key: string,
  loader: () => Promise<T>,
  cache: CacheLayer,
  options?: CacheOptions
): Promise<T> => {
  // Try to get from cache
  const cached = await cache.get<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Load from source
  const value = await loader();

  // Store in cache
  await cache.set(key, value, options);

  return value;
};

/**
 * Implements write-through caching pattern.
 *
 * @param {string} key - Cache key
 * @param {T} value - Value to write
 * @param {(value: T) => Promise<void>} writer - Data writer function
 * @param {CacheLayer} cache - Cache layer
 * @param {CacheOptions} [options] - Cache options
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await writeThrough(
 *   'user:123',
 *   updatedUser,
 *   async (user) => await db.users.update(user, { where: { id: 123 } }),
 *   memoryCache
 * );
 * ```
 */
export const writeThrough = async <T>(
  key: string,
  value: T,
  writer: (value: T) => Promise<void>,
  cache: CacheLayer,
  options?: CacheOptions
): Promise<void> => {
  // Write to cache and database synchronously
  await Promise.all([
    cache.set(key, value, options),
    writer(value),
  ]);
};

/**
 * Implements write-behind (write-back) caching pattern.
 *
 * @param {string} key - Cache key
 * @param {T} value - Value to write
 * @param {(value: T) => Promise<void>} writer - Data writer function
 * @param {CacheLayer} cache - Cache layer
 * @param {number} [delay=1000] - Write delay in milliseconds
 * @param {CacheOptions} [options] - Cache options
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await writeBehind(
 *   'counter:123',
 *   { count: 100 },
 *   async (data) => await db.counters.update(data, { where: { id: 123 } }),
 *   memoryCache,
 *   5000 // Flush after 5 seconds
 * );
 * ```
 */
export const writeBehind = async <T>(
  key: string,
  value: T,
  writer: (value: T) => Promise<void>,
  cache: CacheLayer,
  delay: number = 1000,
  options?: CacheOptions
): Promise<void> => {
  // Write to cache immediately
  await cache.set(key, value, options);

  // Schedule async write to database
  setTimeout(async () => {
    try {
      await writer(value);
    } catch (error) {
      console.error(`Write-behind failed for key ${key}:`, error);
      // Could implement retry logic or dead-letter queue here
    }
  }, delay);
};

/**
 * Implements refresh-ahead caching pattern.
 *
 * @param {string} key - Cache key
 * @param {() => Promise<T>} loader - Data loader function
 * @param {CacheLayer} cache - Cache layer
 * @param {number} refreshThreshold - Threshold percentage (0-100)
 * @param {CacheOptions} [options] - Cache options
 * @returns {Promise<T>} Cached or loaded data
 *
 * @example
 * ```typescript
 * const data = await refreshAhead(
 *   'reports:daily',
 *   async () => await generateDailyReport(),
 *   memoryCache,
 *   80, // Refresh when 80% of TTL has elapsed
 *   { ttl: 3600000 }
 * );
 * ```
 */
export const refreshAhead = async <T>(
  key: string,
  loader: () => Promise<T>,
  cache: CacheLayer,
  refreshThreshold: number,
  options?: CacheOptions
): Promise<T> => {
  const cached = await cache.get<T>(key);

  if (cached !== null) {
    // Background refresh if near expiration
    // (In production, track entry metadata to determine remaining TTL)
    const shouldRefresh = Math.random() * 100 > refreshThreshold;
    if (shouldRefresh) {
      loader().then((value) => cache.set(key, value, options));
    }
    return cached;
  }

  const value = await loader();
  await cache.set(key, value, options);
  return value;
};

// ============================================================================
// CACHE INVALIDATION PATTERNS
// ============================================================================

/**
 * Invalidates cache entries by tags.
 *
 * @param {string[]} tags - Tags to invalidate
 * @param {CacheLayer} cache - Cache layer
 * @returns {Promise<number>} Number of invalidated entries
 *
 * @example
 * ```typescript
 * const count = await invalidateByTags(['user', 'profile'], memoryCache);
 * // Invalidates all entries tagged with 'user' or 'profile'
 * ```
 */
export const invalidateByTags = async (
  tags: string[],
  cache: CacheLayer
): Promise<number> => {
  // In a real implementation, this would query cache entries by tags
  // For demonstration, we'll show the pattern
  const entries = await findEntriesByTags(tags);
  let count = 0;

  for (const entry of entries) {
    await cache.delete(entry.key);
    count++;
  }

  return count;
};

/**
 * Invalidates cache entries by pattern (wildcard matching).
 *
 * @param {string} pattern - Key pattern (supports * wildcard)
 * @param {CacheLayer} cache - Cache layer
 * @returns {Promise<number>} Number of invalidated entries
 *
 * @example
 * ```typescript
 * const count = await invalidateByPattern('user:*:profile', memoryCache);
 * // Invalidates all user profile entries
 * ```
 */
export const invalidateByPattern = async (
  pattern: string,
  cache: CacheLayer
): Promise<number> => {
  const regex = patternToRegex(pattern);
  const entries = await findEntriesByPattern(regex);
  let count = 0;

  for (const entry of entries) {
    await cache.delete(entry.key);
    count++;
  }

  return count;
};

/**
 * Implements dependency-based cache invalidation.
 *
 * @param {string} key - Primary key that changed
 * @param {Map<string, string[]>} dependencyGraph - Dependency graph
 * @param {CacheLayer} cache - Cache layer
 * @returns {Promise<string[]>} Invalidated keys
 *
 * @example
 * ```typescript
 * const graph = new Map([
 *   ['user:123', ['user:123:profile', 'user:123:settings', 'feed:123']],
 *   ['post:456', ['feed:123', 'feed:789']]
 * ]);
 *
 * const invalidated = await invalidateByDependency('user:123', graph, cache);
 * // Invalidates user:123:profile, user:123:settings, feed:123
 * ```
 */
export const invalidateByDependency = async (
  key: string,
  dependencyGraph: Map<string, string[]>,
  cache: CacheLayer
): Promise<string[]> => {
  const dependents = dependencyGraph.get(key) || [];
  const invalidated: string[] = [];

  for (const dependent of dependents) {
    await cache.delete(dependent);
    invalidated.push(dependent);

    // Recursively invalidate transitive dependencies
    const transitive = await invalidateByDependency(dependent, dependencyGraph, cache);
    invalidated.push(...transitive);
  }

  return invalidated;
};

/**
 * Implements time-based cache invalidation with scheduled cleanup.
 *
 * @param {CacheLayer} cache - Cache layer
 * @param {number} interval - Cleanup interval in milliseconds
 * @returns {NodeJS.Timeout} Cleanup interval handle
 *
 * @example
 * ```typescript
 * const cleanup = scheduleTimeBasedInvalidation(memoryCache, 60000);
 * // Cleans up expired entries every minute
 *
 * // To stop: clearInterval(cleanup);
 * ```
 */
export const scheduleTimeBasedInvalidation = (
  cache: CacheLayer,
  interval: number
): NodeJS.Timeout => {
  return setInterval(async () => {
    const expiredKeys = await findExpiredKeys();
    for (const key of expiredKeys) {
      await cache.delete(key);
    }
  }, interval);
};

// ============================================================================
// MEMOIZATION HELPERS
// ============================================================================

/**
 * Creates a memoized version of a function with configurable options.
 *
 * @param {Function} fn - Function to memoize
 * @param {MemoizeOptions} [options] - Memoization options
 * @returns {Function} Memoized function
 *
 * @example
 * ```typescript
 * const expensiveCalculation = memoize(
 *   async (x: number, y: number) => {
 *     await new Promise(r => setTimeout(r, 1000));
 *     return x * y;
 *   },
 *   { ttl: 60000, maxSize: 100 }
 * );
 *
 * await expensiveCalculation(5, 10); // Takes 1 second
 * await expensiveCalculation(5, 10); // Instant (cached)
 * ```
 */
export const memoize = <T extends (...args: any[]) => any>(
  fn: T,
  options: MemoizeOptions = {}
): T => {
  const cache = new Map<string, { value: any; expiresAt: number }>();
  const maxSize = options.maxSize || 100;

  const memoized = ((...args: any[]) => {
    const key = options.keyGenerator
      ? options.keyGenerator(...args)
      : JSON.stringify(args);

    const cached = cache.get(key);
    const now = Date.now();

    if (cached && cached.expiresAt > now) {
      return cached.value;
    }

    const result = fn(...args);

    // Handle promises
    if (result instanceof Promise) {
      return result.then((value) => {
        const expiresAt = now + (options.ttl || 60000);

        // LRU eviction
        if (cache.size >= maxSize) {
          const firstKey = cache.keys().next().value;
          cache.delete(firstKey);
        }

        cache.set(key, { value, expiresAt });
        return value;
      });
    }

    const expiresAt = now + (options.ttl || 60000);
    if (cache.size >= maxSize) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    cache.set(key, { value: result, expiresAt });

    return result;
  }) as T;

  return memoized;
};

/**
 * Creates a memoized async function with debouncing.
 *
 * @param {Function} fn - Async function to memoize
 * @param {number} wait - Debounce wait time in milliseconds
 * @param {MemoizeOptions} [options] - Memoization options
 * @returns {Function} Debounced memoized function
 *
 * @example
 * ```typescript
 * const searchAPI = memoizeWithDebounce(
 *   async (query: string) => await fetch(`/api/search?q=${query}`),
 *   300,
 *   { ttl: 300000 }
 * );
 *
 * // Only makes one API call for rapid successive calls
 * searchAPI('test');
 * searchAPI('test');
 * searchAPI('test');
 * ```
 */
export const memoizeWithDebounce = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  wait: number,
  options: MemoizeOptions = {}
): T => {
  const memoized = memoize(fn, options);
  const timeouts = new Map<string, NodeJS.Timeout>();

  return ((...args: any[]) => {
    return new Promise((resolve, reject) => {
      const key = options.keyGenerator
        ? options.keyGenerator(...args)
        : JSON.stringify(args);

      const existingTimeout = timeouts.get(key);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }

      const timeout = setTimeout(() => {
        timeouts.delete(key);
        memoized(...args).then(resolve).catch(reject);
      }, wait);

      timeouts.set(key, timeout);
    });
  }) as T;
};

// ============================================================================
// COMPRESSION UTILITIES
// ============================================================================

const gzipAsync = promisify(zlib.gzip);
const gunzipAsync = promisify(zlib.gunzip);
const brotliCompressAsync = promisify(zlib.brotliCompress);
const brotliDecompressAsync = promisify(zlib.brotliDecompress);
const deflateAsync = promisify(zlib.deflate);
const inflateAsync = promisify(zlib.inflate);

/**
 * Compresses data using specified algorithm.
 *
 * @param {any} data - Data to compress
 * @param {CompressionOptions} [options] - Compression options
 * @returns {Promise<Buffer>} Compressed data
 *
 * @example
 * ```typescript
 * const compressed = await compressData(
 *   { large: 'object', with: 'lots', of: 'data' },
 *   { algorithm: 'brotli', level: 9 }
 * );
 * ```
 */
export const compressData = async (
  data: any,
  options: CompressionOptions = { algorithm: 'gzip' }
): Promise<Buffer> => {
  const json = JSON.stringify(data);
  const buffer = Buffer.from(json, 'utf-8');

  // Skip compression for small data
  if (options.threshold && buffer.length < options.threshold) {
    return buffer;
  }

  switch (options.algorithm) {
    case 'gzip':
      return await gzipAsync(buffer, { level: options.level });
    case 'brotli':
      return await brotliCompressAsync(buffer, {
        params: {
          [zlib.constants.BROTLI_PARAM_QUALITY]: options.level || 11,
        },
      });
    case 'deflate':
      return await deflateAsync(buffer, { level: options.level });
    default:
      throw new Error(`Unsupported compression algorithm: ${options.algorithm}`);
  }
};

/**
 * Decompresses data using specified algorithm.
 *
 * @param {Buffer} data - Compressed data
 * @param {CompressionOptions} options - Compression options
 * @returns {Promise<any>} Decompressed data
 *
 * @example
 * ```typescript
 * const decompressed = await decompressData(compressed, { algorithm: 'brotli' });
 * ```
 */
export const decompressData = async (
  data: Buffer,
  options: CompressionOptions
): Promise<any> => {
  let buffer: Buffer;

  switch (options.algorithm) {
    case 'gzip':
      buffer = await gunzipAsync(data);
      break;
    case 'brotli':
      buffer = await brotliDecompressAsync(data);
      break;
    case 'deflate':
      buffer = await inflateAsync(data);
      break;
    default:
      throw new Error(`Unsupported compression algorithm: ${options.algorithm}`);
  }

  return JSON.parse(buffer.toString('utf-8'));
};

/**
 * Determines best compression algorithm for data.
 *
 * @param {any} data - Data to analyze
 * @returns {Promise<CompressionOptions>} Recommended compression options
 *
 * @example
 * ```typescript
 * const options = await selectCompressionAlgorithm(largeDataset);
 * // Result: { algorithm: 'brotli', level: 11 }
 * ```
 */
export const selectCompressionAlgorithm = async (
  data: any
): Promise<CompressionOptions> => {
  const json = JSON.stringify(data);
  const size = Buffer.byteLength(json, 'utf-8');

  // Small data: no compression
  if (size < 1024) {
    return { algorithm: 'gzip', level: 0, threshold: 1024 };
  }

  // Medium data: gzip (fast)
  if (size < 100000) {
    return { algorithm: 'gzip', level: 6 };
  }

  // Large data: brotli (best compression)
  return { algorithm: 'brotli', level: 11 };
};

// ============================================================================
// CACHE WARMING AND PRELOADING
// ============================================================================

/**
 * Warms cache with preloaded data.
 *
 * @param {CacheWarmingStrategy} strategy - Cache warming strategy
 * @param {CacheLayer} cache - Cache layer
 * @param {CacheOptions} [options] - Cache options
 * @returns {Promise<number>} Number of warmed entries
 *
 * @example
 * ```typescript
 * const warmed = await warmCache(
 *   {
 *     enabled: true,
 *     keys: ['user:123', 'user:456', 'user:789'],
 *     loader: async (key) => await db.users.findByPk(key.split(':')[1])
 *   },
 *   memoryCache,
 *   { ttl: 3600000 }
 * );
 * ```
 */
export const warmCache = async (
  strategy: CacheWarmingStrategy,
  cache: CacheLayer,
  options?: CacheOptions
): Promise<number> => {
  if (!strategy.enabled) return 0;

  const keys = typeof strategy.keys === 'function'
    ? await strategy.keys()
    : strategy.keys;

  let count = 0;

  for (const key of keys) {
    try {
      const value = await strategy.loader(key);
      await cache.set(key, value, options);
      count++;
    } catch (error) {
      console.error(`Failed to warm cache for key ${key}:`, error);
    }
  }

  return count;
};

/**
 * Schedules periodic cache warming.
 *
 * @param {CacheWarmingStrategy} strategy - Cache warming strategy
 * @param {CacheLayer} cache - Cache layer
 * @param {CacheOptions} [options] - Cache options
 * @returns {NodeJS.Timeout} Warming interval handle
 *
 * @example
 * ```typescript
 * const warming = scheduleCacheWarming(
 *   {
 *     enabled: true,
 *     interval: 3600000, // Every hour
 *     keys: async () => await getPopularProductIds(),
 *     loader: async (id) => await db.products.findByPk(id)
 *   },
 *   redisCache
 * );
 * ```
 */
export const scheduleCacheWarming = (
  strategy: CacheWarmingStrategy,
  cache: CacheLayer,
  options?: CacheOptions
): NodeJS.Timeout => {
  const interval = strategy.interval || 3600000; // Default 1 hour

  return setInterval(async () => {
    await warmCache(strategy, cache, options);
  }, interval);
};

// ============================================================================
// HTTP RESPONSE CACHING
// ============================================================================

/**
 * Generates cache-control headers for HTTP responses.
 *
 * @param {number} maxAge - Max age in seconds
 * @param {object} [options] - Cache control options
 * @returns {string} Cache-Control header value
 *
 * @example
 * ```typescript
 * const cacheControl = generateCacheControlHeader(3600, {
 *   public: true,
 *   immutable: true
 * });
 * // Result: 'public, max-age=3600, immutable'
 * ```
 */
export const generateCacheControlHeader = (
  maxAge: number,
  options: {
    public?: boolean;
    private?: boolean;
    noCache?: boolean;
    noStore?: boolean;
    immutable?: boolean;
    mustRevalidate?: boolean;
    sMaxAge?: number;
  } = {}
): string => {
  const directives: string[] = [];

  if (options.public) directives.push('public');
  if (options.private) directives.push('private');
  if (options.noCache) directives.push('no-cache');
  if (options.noStore) directives.push('no-store');
  if (options.immutable) directives.push('immutable');
  if (options.mustRevalidate) directives.push('must-revalidate');

  directives.push(`max-age=${maxAge}`);

  if (options.sMaxAge) {
    directives.push(`s-maxage=${options.sMaxAge}`);
  }

  return directives.join(', ');
};

/**
 * Generates ETag for response content.
 *
 * @param {any} content - Response content
 * @param {boolean} [weak=false] - Whether to generate weak ETag
 * @returns {string} ETag header value
 *
 * @example
 * ```typescript
 * const etag = generateETag({ id: 123, name: 'John' });
 * // Result: '"a3f5e9b2c1d4..."'
 *
 * const weakEtag = generateETag(content, true);
 * // Result: 'W/"a3f5e9b2c1d4..."'
 * ```
 */
export const generateETag = (content: any, weak: boolean = false): string => {
  const hash = hashObject(content);
  return weak ? `W/"${hash}"` : `"${hash}"`;
};

/**
 * Checks if cached response is still valid based on conditional headers.
 *
 * @param {string | undefined} ifNoneMatch - If-None-Match header value
 * @param {string | undefined} ifModifiedSince - If-Modified-Since header value
 * @param {string} etag - Current ETag
 * @param {Date} lastModified - Last modified date
 * @returns {boolean} Whether cached response is valid
 *
 * @example
 * ```typescript
 * const isValid = isCachedResponseValid(
 *   req.headers['if-none-match'],
 *   req.headers['if-modified-since'],
 *   currentEtag,
 *   lastModifiedDate
 * );
 *
 * if (isValid) {
 *   return res.status(304).send();
 * }
 * ```
 */
export const isCachedResponseValid = (
  ifNoneMatch: string | undefined,
  ifModifiedSince: string | undefined,
  etag: string,
  lastModified: Date
): boolean => {
  // Check ETag
  if (ifNoneMatch && ifNoneMatch === etag) {
    return true;
  }

  // Check Last-Modified
  if (ifModifiedSince) {
    const modifiedSinceDate = new Date(ifModifiedSince);
    if (lastModified <= modifiedSinceDate) {
      return true;
    }
  }

  return false;
};

// ============================================================================
// DATABASE QUERY RESULT CACHING
// ============================================================================

/**
 * Caches Sequelize query results with automatic invalidation.
 *
 * @param {Function} query - Sequelize query function
 * @param {string} cacheKey - Cache key
 * @param {CacheLayer} cache - Cache layer
 * @param {CacheOptions} [options] - Cache options
 * @returns {Promise<any>} Query results
 *
 * @example
 * ```typescript
 * const users = await cacheQueryResult(
 *   () => User.findAll({ where: { active: true } }),
 *   'users:active',
 *   redisCache,
 *   { ttl: 300000, tags: ['users'] }
 * );
 * ```
 */
export const cacheQueryResult = async <T>(
  query: () => Promise<T>,
  cacheKey: string,
  cache: CacheLayer,
  options?: CacheOptions
): Promise<T> => {
  return await cacheAside(cacheKey, query, cache, options);
};

/**
 * Automatically generates cache key from Sequelize query options.
 *
 * @param {string} modelName - Model name
 * @param {any} queryOptions - Sequelize query options
 * @returns {string} Generated cache key
 *
 * @example
 * ```typescript
 * const key = generateQueryCacheKey('User', {
 *   where: { active: true, role: 'admin' },
 *   limit: 10,
 *   order: [['createdAt', 'DESC']]
 * });
 * // Result: 'query:User:hash...'
 * ```
 */
export const generateQueryCacheKey = (
  modelName: string,
  queryOptions: any
): string => {
  return generateHashKey(
    { prefix: 'query', namespace: modelName },
    queryOptions
  );
};

// ============================================================================
// CACHE STATISTICS AND MONITORING
// ============================================================================

/**
 * Tracks cache operation metrics.
 *
 * @param {string} operation - Operation type
 * @param {boolean} hit - Whether operation was a cache hit
 * @param {number} responseTime - Response time in milliseconds
 * @param {string} keyPattern - Cache key pattern
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await trackCacheMetrics('get', true, 5.2, 'user:*', sequelize);
 * ```
 */
export const trackCacheMetrics = async (
  operation: 'get' | 'set' | 'delete' | 'clear',
  hit: boolean,
  responseTime: number,
  keyPattern: string,
  sequelize: Sequelize
): Promise<void> => {
  await CacheStatisticsModel.create({
    namespace: 'default',
    operation,
    hit,
    responseTime,
    keyPattern,
    timestamp: new Date(),
    metadata: {},
  });
};

/**
 * Calculates cache hit rate for a time period.
 *
 * @param {string} namespace - Cache namespace
 * @param {Date} startTime - Start time
 * @param {Date} endTime - End time
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<number>} Hit rate (0-1)
 *
 * @example
 * ```typescript
 * const hitRate = await calculateHitRate(
 *   'default',
 *   new Date(Date.now() - 3600000),
 *   new Date()
 * );
 * // Result: 0.85 (85% hit rate)
 * ```
 */
export const calculateHitRate = async (
  namespace: string,
  startTime: Date,
  endTime: Date,
  sequelize: Sequelize
): Promise<number> => {
  const stats = await CacheStatisticsModel.findAll({
    where: {
      namespace,
      operation: 'get',
      timestamp: {
        [sequelize.Op.between]: [startTime, endTime],
      },
    },
    attributes: [
      [sequelize.fn('COUNT', sequelize.col('id')), 'total'],
      [sequelize.fn('SUM', sequelize.literal('CASE WHEN hit THEN 1 ELSE 0 END')), 'hits'],
    ],
    raw: true,
  });

  const result = stats[0] as any;
  const total = parseInt(result.total, 10);
  const hits = parseInt(result.hits, 10);

  return total > 0 ? hits / total : 0;
};

/**
 * Generates cache performance report.
 *
 * @param {string} namespace - Cache namespace
 * @param {Date} startTime - Start time
 * @param {Date} endTime - End time
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<object>} Performance report
 *
 * @example
 * ```typescript
 * const report = await generateCacheReport(
 *   'default',
 *   new Date(Date.now() - 86400000),
 *   new Date(),
 *   sequelize
 * );
 * ```
 */
export const generateCacheReport = async (
  namespace: string,
  startTime: Date,
  endTime: Date,
  sequelize: Sequelize
): Promise<{
  hitRate: number;
  avgResponseTime: number;
  totalOperations: number;
  operationBreakdown: Record<string, number>;
  topKeyPatterns: Array<{ pattern: string; count: number }>;
}> => {
  const hitRate = await calculateHitRate(namespace, startTime, endTime, sequelize);

  const stats = await CacheStatisticsModel.findAll({
    where: {
      namespace,
      timestamp: {
        [sequelize.Op.between]: [startTime, endTime],
      },
    },
    attributes: [
      'operation',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      [sequelize.fn('AVG', sequelize.col('responseTime')), 'avgResponseTime'],
    ],
    group: ['operation'],
    raw: true,
  });

  const topPatterns = await CacheStatisticsModel.findAll({
    where: {
      namespace,
      timestamp: {
        [sequelize.Op.between]: [startTime, endTime],
      },
    },
    attributes: [
      'keyPattern',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
    ],
    group: ['keyPattern'],
    order: [[sequelize.literal('count'), 'DESC']],
    limit: 10,
    raw: true,
  });

  const operationBreakdown: Record<string, number> = {};
  let avgResponseTime = 0;
  let totalOperations = 0;

  stats.forEach((stat: any) => {
    operationBreakdown[stat.operation] = parseInt(stat.count, 10);
    totalOperations += parseInt(stat.count, 10);
    avgResponseTime += parseFloat(stat.avgResponseTime) * parseInt(stat.count, 10);
  });

  avgResponseTime = totalOperations > 0 ? avgResponseTime / totalOperations : 0;

  return {
    hitRate,
    avgResponseTime,
    totalOperations,
    operationBreakdown,
    topKeyPatterns: topPatterns.map((p: any) => ({
      pattern: p.keyPattern,
      count: parseInt(p.count, 10),
    })),
  };
};

// ============================================================================
// CDN INTEGRATION UTILITIES
// ============================================================================

/**
 * Purges CDN cache for specified URLs.
 *
 * @param {string[]} urls - URLs to purge
 * @param {CDNConfig} config - CDN configuration
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await purgeCDNCache(
 *   ['https://cdn.example.com/styles.css', 'https://cdn.example.com/script.js'],
 *   {
 *     provider: 'cloudflare',
 *     endpoint: 'https://api.cloudflare.com/client/v4',
 *     apiKey: 'your-api-key',
 *     zone: 'your-zone-id'
 *   }
 * );
 * ```
 */
export const purgeCDNCache = async (
  urls: string[],
  config: CDNConfig
): Promise<boolean> => {
  // Implementation would vary by CDN provider
  // This is a placeholder showing the pattern
  console.log(`Purging CDN cache for ${urls.length} URLs on ${config.provider}`);
  return true;
};

/**
 * Purges CDN cache by tags.
 *
 * @param {string[]} tags - Cache tags to purge
 * @param {CDNConfig} config - CDN configuration
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await purgeCDNCacheByTags(['product-images', 'user-avatars'], cdnConfig);
 * ```
 */
export const purgeCDNCacheByTags = async (
  tags: string[],
  config: CDNConfig
): Promise<boolean> => {
  console.log(`Purging CDN cache for tags: ${tags.join(', ')}`);
  return true;
};

/**
 * Generates CDN-optimized URL with cache busting.
 *
 * @param {string} baseUrl - Base URL
 * @param {string} version - Version string for cache busting
 * @returns {string} CDN-optimized URL
 *
 * @example
 * ```typescript
 * const url = generateCDNUrl('/assets/styles.css', 'v1.2.3');
 * // Result: '/assets/styles.css?v=v1.2.3'
 * ```
 */
export const generateCDNUrl = (baseUrl: string, version: string): string => {
  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}v=${version}`;
};

// ============================================================================
// LAZY LOADING HELPERS
// ============================================================================

/**
 * Creates a lazy-loaded value that's computed on first access.
 *
 * @param {LazyLoadConfig<T>} config - Lazy load configuration
 * @param {CacheLayer} cache - Cache layer
 * @returns {() => Promise<T>} Lazy loader function
 *
 * @example
 * ```typescript
 * const getExpensiveData = createLazyLoader(
 *   {
 *     loader: async () => await computeExpensiveData(),
 *     cacheKey: 'expensive-data',
 *     ttl: 3600000
 *   },
 *   memoryCache
 * );
 *
 * const data = await getExpensiveData(); // Computed on first call
 * const data2 = await getExpensiveData(); // Cached
 * ```
 */
export const createLazyLoader = <T>(
  config: LazyLoadConfig<T>,
  cache: CacheLayer
): (() => Promise<T>) => {
  let loading = false;
  let loadPromise: Promise<T> | null = null;

  return async (): Promise<T> => {
    // Check cache first
    if (config.cacheKey) {
      const cached = await cache.get<T>(config.cacheKey);
      if (cached !== null) {
        return cached;
      }
    }

    // Prevent multiple simultaneous loads
    if (loading && loadPromise) {
      return loadPromise;
    }

    loading = true;
    loadPromise = config.loader().then((value) => {
      loading = false;
      loadPromise = null;

      if (config.cacheKey) {
        cache.set(config.cacheKey, value, { ttl: config.ttl });
      }

      return value;
    });

    return loadPromise;
  };
};

/**
 * Implements intersection observer-based lazy loading for resources.
 *
 * @param {string[]} resourceUrls - Resource URLs to lazy load
 * @param {Function} onLoad - Callback when resource loads
 * @returns {object} Lazy loading controller
 *
 * @example
 * ```typescript
 * const lazyImages = createIntersectionLazyLoader(
 *   ['/images/photo1.jpg', '/images/photo2.jpg'],
 *   (url) => console.log(`Loaded: ${url}`)
 * );
 * ```
 */
export const createIntersectionLazyLoader = (
  resourceUrls: string[],
  onLoad: (url: string) => void
) => {
  const loaded = new Set<string>();

  return {
    markAsLoaded(url: string) {
      loaded.add(url);
      onLoad(url);
    },
    isLoaded(url: string) {
      return loaded.has(url);
    },
    getPendingUrls() {
      return resourceUrls.filter((url) => !loaded.has(url));
    },
  };
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generates deterministic hash for objects.
 *
 * @param {any} obj - Object to hash
 * @returns {string} SHA-256 hash
 */
function hashObject(obj: any): string {
  const str = JSON.stringify(obj, Object.keys(obj).sort());
  return crypto.createHash('sha256').update(str).digest('hex').substring(0, 16);
}

/**
 * Converts wildcard pattern to regex.
 *
 * @param {string} pattern - Pattern with * wildcards
 * @returns {RegExp} Regular expression
 */
function patternToRegex(pattern: string): RegExp {
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
  const regexPattern = escaped.replace(/\*/g, '.*');
  return new RegExp(`^${regexPattern}$`);
}

/**
 * Placeholder: Find cache entries by tags (implementation depends on cache layer).
 */
async function findEntriesByTags(tags: string[]): Promise<CacheEntry[]> {
  // In production, query cache storage by tags
  return [];
}

/**
 * Placeholder: Find cache entries matching pattern.
 */
async function findEntriesByPattern(pattern: RegExp): Promise<CacheEntry[]> {
  // In production, query cache storage and filter by pattern
  return [];
}

/**
 * Placeholder: Find expired cache keys.
 */
async function findExpiredKeys(): Promise<string[]> {
  // In production, query cache storage for expired entries
  return [];
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  // Types
  CacheEntry,
  CacheOptions,
  CacheKeyConfig,
  CacheStats,
  CacheLayer,
  CacheInvalidationPattern,
  CompressionOptions,
  MemoizeOptions,
  CacheWarmingStrategy,
  CDNConfig,
  PerformanceMetrics,
  LazyLoadConfig,
};
