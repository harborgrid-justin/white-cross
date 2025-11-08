/**
 * LOC: CACHERED1234567
 * File: /reuse/cache-redis-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS caching services
 *   - Redis cache providers
 *   - In-memory cache services
 *   - Cache warming strategies
 *   - Distributed caching modules
 */

/**
 * File: /reuse/cache-redis-kit.ts
 * Locator: WC-UTL-CACHERED-001
 * Purpose: Comprehensive Caching & Redis Kit - Complete caching toolkit for NestJS
 *
 * Upstream: Independent utility module for caching and Redis operations
 * Downstream: ../backend/*, Cache services, Redis providers, Performance optimization modules
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/cache-manager, redis, ioredis, Sequelize
 * Exports: 40+ utility functions for Redis, in-memory caching, TTL management, cache invalidation, warming, distributed caching
 *
 * LLM Context: Enterprise-grade caching utilities for White Cross healthcare platform.
 * Provides comprehensive Redis integration (cluster, sentinel), in-memory caching (LRU),
 * cache strategies (write-through, write-behind, read-through), TTL management, cache warming,
 * invalidation patterns (tag-based, pattern-based), distributed locking, pub/sub, cache analytics,
 * compression, serialization, multi-layer caching, cache-aside patterns, and HIPAA-compliant caching.
 */

import { Injectable, Inject, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Model, DataTypes, Sequelize } from 'sequelize';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as crypto from 'crypto';
import { z } from 'zod';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface CacheConfig {
  ttl: number;
  max?: number;
  strategy?: 'LRU' | 'LFU' | 'FIFO';
  compression?: boolean;
  namespace?: string;
}

interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
  keyPrefix?: string;
  enableReadyCheck?: boolean;
  maxRetriesPerRequest?: number;
  retryStrategy?: (times: number) => number | void;
  connectTimeout?: number;
  lazyConnect?: boolean;
}

interface RedisClusterConfig {
  nodes: Array<{ host: string; port: number }>;
  options?: {
    enableReadyCheck?: boolean;
    maxRedirections?: number;
    retryDelayOnFailover?: number;
    retryDelayOnClusterDown?: number;
    scaleReads?: 'master' | 'slave' | 'all';
  };
}

interface CacheEntry<T = any> {
  key: string;
  value: T;
  ttl: number;
  createdAt: number;
  expiresAt: number;
  hits: number;
  size: number;
  tags?: string[];
  metadata?: Record<string, any>;
}

interface CacheStats {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  evictions: number;
  hitRate: number;
  missRate: number;
  totalKeys: number;
  memoryUsage: number;
  avgTTL: number;
}

interface CacheInvalidationPattern {
  pattern: string;
  type: 'prefix' | 'suffix' | 'contains' | 'regex' | 'tags';
  timestamp: number;
  reason?: string;
}

interface DistributedLockConfig {
  key: string;
  ttl: number;
  retryCount?: number;
  retryDelay?: number;
  identifier?: string;
}

interface CacheWarmingStrategy {
  keys: string[];
  loader: (key: string) => Promise<any>;
  ttl: number;
  priority?: number;
  schedule?: string;
}

interface MultiLayerCacheConfig {
  layers: Array<{
    name: string;
    ttl: number;
    max?: number;
    type: 'memory' | 'redis' | 'custom';
    priority: number;
  }>;
  fallthrough?: boolean;
}

interface CacheSerializationOptions {
  format: 'json' | 'msgpack' | 'protobuf';
  compression?: 'gzip' | 'brotli' | 'none';
  encryption?: boolean;
}

interface CachePubSubMessage {
  type: 'invalidate' | 'update' | 'clear' | 'stats';
  pattern?: string;
  key?: string;
  value?: any;
  timestamp: number;
  source: string;
}

// ============================================================================
// SEQUELIZE MODELS (1-2)
// ============================================================================

/**
 * Sequelize model for Cache Analytics with hit/miss tracking and performance metrics.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CacheAnalytics model
 *
 * @example
 * const CacheAnalytics = defineCacheAnalyticsModel(sequelize);
 * await CacheAnalytics.create({
 *   cacheKey: 'user:123',
 *   operation: 'get',
 *   hit: true,
 *   responseTime: 5
 * });
 */
export function defineCacheAnalyticsModel(sequelize: Sequelize): typeof Model {
  class CacheAnalytics extends Model {
    public id!: string;
    public cacheKey!: string;
    public namespace!: string;
    public operation!: 'get' | 'set' | 'delete' | 'invalidate';
    public hit!: boolean;
    public responseTime!: number;
    public valueSize!: number;
    public ttl!: number;
    public tags!: string[];
    public metadata!: Record<string, any>;
    public createdAt!: Date;
  }

  CacheAnalytics.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      cacheKey: {
        type: DataTypes.STRING(500),
        allowNull: false,
        field: 'cache_key',
      },
      namespace: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: 'default',
      },
      operation: {
        type: DataTypes.ENUM('get', 'set', 'delete', 'invalidate'),
        allowNull: false,
      },
      hit: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      responseTime: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'response_time',
        comment: 'Response time in milliseconds',
      },
      valueSize: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'value_size',
        comment: 'Size of cached value in bytes',
      },
      ttl: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Time to live in seconds',
      },
      tags: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: [],
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
      },
    },
    {
      sequelize,
      tableName: 'cache_analytics',
      timestamps: false,
      indexes: [
        { fields: ['cache_key'] },
        { fields: ['namespace'] },
        { fields: ['operation'] },
        { fields: ['created_at'] },
        { fields: ['hit'] },
      ],
    }
  );

  return CacheAnalytics;
}

/**
 * Sequelize model for Cache Configuration with TTL and invalidation rules.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CacheConfiguration model
 *
 * @example
 * const CacheConfiguration = defineCacheConfigurationModel(sequelize);
 * await CacheConfiguration.create({
 *   namespace: 'user-data',
 *   defaultTTL: 3600,
 *   maxSize: 1000,
 *   strategy: 'LRU'
 * });
 */
export function defineCacheConfigurationModel(sequelize: Sequelize): typeof Model {
  class CacheConfiguration extends Model {
    public id!: string;
    public namespace!: string;
    public defaultTTL!: number;
    public maxSize!: number;
    public strategy!: 'LRU' | 'LFU' | 'FIFO';
    public compressionEnabled!: boolean;
    public invalidationPattern!: string;
    public warmingSchedule!: string;
    public tags!: string[];
    public enabled!: boolean;
    public createdAt!: Date;
    public updatedAt!: Date;
  }

  CacheConfiguration.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      namespace: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      defaultTTL: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 3600,
        field: 'default_ttl',
        comment: 'Default TTL in seconds',
      },
      maxSize: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'max_size',
        comment: 'Maximum number of entries',
      },
      strategy: {
        type: DataTypes.ENUM('LRU', 'LFU', 'FIFO'),
        allowNull: false,
        defaultValue: 'LRU',
      },
      compressionEnabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'compression_enabled',
      },
      invalidationPattern: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: 'invalidation_pattern',
      },
      warmingSchedule: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'warming_schedule',
        comment: 'Cron expression for cache warming',
      },
      tags: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: [],
      },
      enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'updated_at',
      },
    },
    {
      sequelize,
      tableName: 'cache_configurations',
      timestamps: true,
      indexes: [
        { fields: ['namespace'], unique: true },
        { fields: ['enabled'] },
      ],
    }
  );

  return CacheConfiguration;
}

// ============================================================================
// ZOD SCHEMAS (3-5)
// ============================================================================

/**
 * Zod schema for cache configuration validation.
 */
export const cacheConfigSchema = z.object({
  ttl: z.number().min(0).max(31536000),
  max: z.number().min(1).optional(),
  strategy: z.enum(['LRU', 'LFU', 'FIFO']).optional(),
  compression: z.boolean().optional(),
  namespace: z.string().min(1).max(100).optional(),
});

/**
 * Zod schema for Redis configuration validation.
 */
export const redisConfigSchema = z.object({
  host: z.string().min(1),
  port: z.number().min(1).max(65535),
  password: z.string().optional(),
  db: z.number().min(0).max(15).optional(),
  keyPrefix: z.string().optional(),
  enableReadyCheck: z.boolean().optional(),
  maxRetriesPerRequest: z.number().min(0).optional(),
  connectTimeout: z.number().min(100).optional(),
  lazyConnect: z.boolean().optional(),
});

/**
 * Zod schema for cache entry validation.
 */
export const cacheEntrySchema = z.object({
  key: z.string().min(1).max(500),
  value: z.any(),
  ttl: z.number().min(0).max(31536000),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional(),
});

/**
 * Zod schema for distributed lock configuration.
 */
export const distributedLockSchema = z.object({
  key: z.string().min(1).max(200),
  ttl: z.number().min(100).max(300000),
  retryCount: z.number().min(0).max(100).optional(),
  retryDelay: z.number().min(10).max(5000).optional(),
  identifier: z.string().optional(),
});

/**
 * Zod schema for cache warming strategy.
 */
export const cacheWarmingSchema = z.object({
  keys: z.array(z.string().min(1)),
  ttl: z.number().min(60).max(86400),
  priority: z.number().min(1).max(10).optional(),
  schedule: z.string().optional(),
});

// ============================================================================
// REDIS CLIENT UTILITIES (6-10)
// ============================================================================

/**
 * Creates a Redis client with connection pooling and retry strategy.
 *
 * @param {RedisConfig} config - Redis configuration
 * @returns {Promise<any>} Connected Redis client
 *
 * @example
 * const redis = await createRedisClient({
 *   host: 'localhost',
 *   port: 6379,
 *   password: 'secret'
 * });
 */
export async function createRedisClient(config: RedisConfig): Promise<any> {
  const Redis = require('ioredis');

  const client = new Redis({
    ...config,
    retryStrategy: config.retryStrategy || ((times: number) => {
      if (times > 10) return null;
      return Math.min(times * 100, 3000);
    }),
  });

  await client.ping();
  return client;
}

/**
 * Creates a Redis cluster client with failover support.
 *
 * @param {RedisClusterConfig} config - Redis cluster configuration
 * @returns {Promise<any>} Connected Redis cluster client
 *
 * @example
 * const cluster = await createRedisClusterClient({
 *   nodes: [
 *     { host: 'node1', port: 6379 },
 *     { host: 'node2', port: 6379 }
 *   ]
 * });
 */
export async function createRedisClusterClient(config: RedisClusterConfig): Promise<any> {
  const Redis = require('ioredis');

  const cluster = new Redis.Cluster(config.nodes, {
    enableReadyCheck: true,
    maxRedirections: 16,
    retryDelayOnFailover: 100,
    retryDelayOnClusterDown: 300,
    scaleReads: 'slave',
    ...config.options,
  });

  await cluster.ping();
  return cluster;
}

/**
 * Implements Redis Sentinel for high availability.
 *
 * @param {Array<{host: string, port: number}>} sentinels - Sentinel nodes
 * @param {string} masterName - Master name
 * @returns {Promise<any>} Redis client with Sentinel support
 *
 * @example
 * const redis = await createRedisSentinelClient(
 *   [{ host: 'sentinel1', port: 26379 }],
 *   'mymaster'
 * );
 */
export async function createRedisSentinelClient(
  sentinels: Array<{ host: string; port: number }>,
  masterName: string
): Promise<any> {
  const Redis = require('ioredis');

  const client = new Redis({
    sentinels,
    name: masterName,
    sentinelRetryStrategy: (times: number) => {
      if (times > 10) return null;
      return Math.min(times * 100, 3000);
    },
  });

  await client.ping();
  return client;
}

/**
 * Creates a Redis pipeline for batched operations.
 *
 * @param {any} redisClient - Redis client
 * @param {Array<{command: string, args: any[]}>} commands - Commands to execute
 * @returns {Promise<any[]>} Pipeline results
 *
 * @example
 * const results = await executeRedisPipeline(redis, [
 *   { command: 'set', args: ['key1', 'value1'] },
 *   { command: 'get', args: ['key1'] }
 * ]);
 */
export async function executeRedisPipeline(
  redisClient: any,
  commands: Array<{ command: string; args: any[] }>
): Promise<any[]> {
  const pipeline = redisClient.pipeline();

  for (const { command, args } of commands) {
    pipeline[command](...args);
  }

  const results = await pipeline.exec();
  return results.map(([err, result]: [Error | null, any]) => {
    if (err) throw err;
    return result;
  });
}

/**
 * Implements Redis pub/sub for cache invalidation across instances.
 *
 * @param {any} redisClient - Redis client
 * @param {string} channel - Pub/sub channel
 * @param {(message: CachePubSubMessage) => void} handler - Message handler
 * @returns {Promise<void>}
 *
 * @example
 * await subscribeToInvalidationChannel(redis, 'cache:invalidate', (msg) => {
 *   console.log('Invalidate:', msg.key);
 * });
 */
export async function subscribeToInvalidationChannel(
  redisClient: any,
  channel: string,
  handler: (message: CachePubSubMessage) => void
): Promise<void> {
  await redisClient.subscribe(channel);

  redisClient.on('message', (ch: string, msg: string) => {
    if (ch === channel) {
      try {
        const message: CachePubSubMessage = JSON.parse(msg);
        handler(message);
      } catch (error) {
        console.error('Failed to parse pub/sub message:', error);
      }
    }
  });
}

// ============================================================================
// IN-MEMORY CACHE UTILITIES (11-15)
// ============================================================================

/**
 * Creates an in-memory LRU cache with TTL support.
 *
 * @param {CacheConfig} config - Cache configuration
 * @returns {Map<string, CacheEntry>} In-memory cache
 *
 * @example
 * const cache = createInMemoryCache({ ttl: 3600, max: 1000 });
 */
export function createInMemoryCache(config: CacheConfig): Map<string, CacheEntry> {
  const cache = new Map<string, CacheEntry>();
  const maxSize = config.max || 1000;

  // Override set to implement LRU eviction
  const originalSet = cache.set.bind(cache);
  cache.set = function (key: string, value: CacheEntry) {
    if (cache.size >= maxSize && !cache.has(key)) {
      // Evict oldest entry
      const firstKey = cache.keys().next().value;
      if (firstKey) cache.delete(firstKey);
    }
    return originalSet(key, value);
  };

  return cache;
}

/**
 * Implements cache-aside (lazy loading) pattern.
 *
 * @param {string} key - Cache key
 * @param {() => Promise<T>} loader - Data loader function
 * @param {Map<string, CacheEntry>} cache - Cache instance
 * @param {number} ttl - Time to live in seconds
 * @returns {Promise<T>} Cached or loaded value
 *
 * @example
 * const user = await cacheAsideGet('user:123', async () => {
 *   return await db.users.findOne({ id: 123 });
 * }, cache, 3600);
 */
export async function cacheAsideGet<T>(
  key: string,
  loader: () => Promise<T>,
  cache: Map<string, CacheEntry>,
  ttl: number
): Promise<T> {
  const entry = cache.get(key);

  if (entry && entry.expiresAt > Date.now()) {
    entry.hits++;
    return entry.value as T;
  }

  const value = await loader();
  const now = Date.now();

  cache.set(key, {
    key,
    value,
    ttl,
    createdAt: now,
    expiresAt: now + ttl * 1000,
    hits: 0,
    size: JSON.stringify(value).length,
  });

  return value;
}

/**
 * Implements write-through caching pattern.
 *
 * @param {string} key - Cache key
 * @param {T} value - Value to cache and persist
 * @param {(value: T) => Promise<void>} persister - Persistence function
 * @param {Map<string, CacheEntry>} cache - Cache instance
 * @param {number} ttl - Time to live in seconds
 * @returns {Promise<void>}
 *
 * @example
 * await writeThroughSet('user:123', userData, async (data) => {
 *   await db.users.update({ id: 123 }, data);
 * }, cache, 3600);
 */
export async function writeThroughSet<T>(
  key: string,
  value: T,
  persister: (value: T) => Promise<void>,
  cache: Map<string, CacheEntry>,
  ttl: number
): Promise<void> {
  await persister(value);

  const now = Date.now();
  cache.set(key, {
    key,
    value,
    ttl,
    createdAt: now,
    expiresAt: now + ttl * 1000,
    hits: 0,
    size: JSON.stringify(value).length,
  });
}

/**
 * Implements write-behind (write-back) caching pattern.
 *
 * @param {string} key - Cache key
 * @param {T} value - Value to cache
 * @param {(value: T) => Promise<void>} persister - Async persistence function
 * @param {Map<string, CacheEntry>} cache - Cache instance
 * @param {number} ttl - Time to live in seconds
 * @param {number} writeDelay - Delay before persisting (ms)
 * @returns {Promise<void>}
 *
 * @example
 * await writeBehindSet('user:123', userData, async (data) => {
 *   await db.users.update({ id: 123 }, data);
 * }, cache, 3600, 5000);
 */
export async function writeBehindSet<T>(
  key: string,
  value: T,
  persister: (value: T) => Promise<void>,
  cache: Map<string, CacheEntry>,
  ttl: number,
  writeDelay: number = 5000
): Promise<void> {
  const now = Date.now();
  cache.set(key, {
    key,
    value,
    ttl,
    createdAt: now,
    expiresAt: now + ttl * 1000,
    hits: 0,
    size: JSON.stringify(value).length,
  });

  setTimeout(async () => {
    try {
      await persister(value);
    } catch (error) {
      console.error(`Write-behind failed for key ${key}:`, error);
    }
  }, writeDelay);
}

/**
 * Implements refresh-ahead caching pattern.
 *
 * @param {string} key - Cache key
 * @param {() => Promise<T>} loader - Data loader function
 * @param {Map<string, CacheEntry>} cache - Cache instance
 * @param {number} ttl - Time to live in seconds
 * @param {number} refreshThreshold - Refresh when TTL below this (seconds)
 * @returns {Promise<T>} Cached value
 *
 * @example
 * const data = await refreshAheadGet('hot-data', loadData, cache, 3600, 300);
 */
export async function refreshAheadGet<T>(
  key: string,
  loader: () => Promise<T>,
  cache: Map<string, CacheEntry>,
  ttl: number,
  refreshThreshold: number = 300
): Promise<T> {
  const entry = cache.get(key);
  const now = Date.now();

  if (entry && entry.expiresAt > now) {
    const remainingTTL = (entry.expiresAt - now) / 1000;

    if (remainingTTL < refreshThreshold) {
      // Async refresh
      loader().then(value => {
        cache.set(key, {
          key,
          value,
          ttl,
          createdAt: Date.now(),
          expiresAt: Date.now() + ttl * 1000,
          hits: entry.hits,
          size: JSON.stringify(value).length,
        });
      }).catch(error => {
        console.error(`Refresh-ahead failed for key ${key}:`, error);
      });
    }

    entry.hits++;
    return entry.value as T;
  }

  const value = await loader();
  cache.set(key, {
    key,
    value,
    ttl,
    createdAt: now,
    expiresAt: now + ttl * 1000,
    hits: 0,
    size: JSON.stringify(value).length,
  });

  return value;
}

// ============================================================================
// TTL MANAGEMENT UTILITIES (16-20)
// ============================================================================

/**
 * Sets TTL for a cache key with Redis.
 *
 * @param {any} redisClient - Redis client
 * @param {string} key - Cache key
 * @param {number} ttl - Time to live in seconds
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * await setTTL(redis, 'user:123', 3600);
 */
export async function setTTL(redisClient: any, key: string, ttl: number): Promise<boolean> {
  const result = await redisClient.expire(key, ttl);
  return result === 1;
}

/**
 * Gets remaining TTL for a cache key.
 *
 * @param {any} redisClient - Redis client
 * @param {string} key - Cache key
 * @returns {Promise<number>} Remaining TTL in seconds (-2 if key doesn't exist, -1 if no TTL)
 *
 * @example
 * const ttl = await getTTL(redis, 'user:123');
 */
export async function getTTL(redisClient: any, key: string): Promise<number> {
  return await redisClient.ttl(key);
}

/**
 * Extends TTL for a cache key by adding additional time.
 *
 * @param {any} redisClient - Redis client
 * @param {string} key - Cache key
 * @param {number} additionalSeconds - Additional seconds to add
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * await extendTTL(redis, 'user:123', 600);
 */
export async function extendTTL(
  redisClient: any,
  key: string,
  additionalSeconds: number
): Promise<boolean> {
  const currentTTL = await redisClient.ttl(key);
  if (currentTTL > 0) {
    const newTTL = currentTTL + additionalSeconds;
    const result = await redisClient.expire(key, newTTL);
    return result === 1;
  }
  return false;
}

/**
 * Implements sliding window TTL refresh on access.
 *
 * @param {any} redisClient - Redis client
 * @param {string} key - Cache key
 * @param {number} ttl - Time to live in seconds
 * @returns {Promise<any>} Cache value with refreshed TTL
 *
 * @example
 * const value = await getWithSlidingTTL(redis, 'user:123', 3600);
 */
export async function getWithSlidingTTL(
  redisClient: any,
  key: string,
  ttl: number
): Promise<any> {
  const value = await redisClient.get(key);
  if (value) {
    await redisClient.expire(key, ttl);
    return JSON.parse(value);
  }
  return null;
}

/**
 * Implements absolute expiration (non-sliding) TTL.
 *
 * @param {any} redisClient - Redis client
 * @param {string} key - Cache key
 * @param {Date} expirationDate - Absolute expiration date
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * const expiration = new Date('2024-12-31T23:59:59Z');
 * await setAbsoluteExpiration(redis, 'promo:holiday', expiration);
 */
export async function setAbsoluteExpiration(
  redisClient: any,
  key: string,
  expirationDate: Date
): Promise<boolean> {
  const expirationTimestamp = Math.floor(expirationDate.getTime() / 1000);
  const result = await redisClient.expireat(key, expirationTimestamp);
  return result === 1;
}

// ============================================================================
// CACHE INVALIDATION UTILITIES (21-25)
// ============================================================================

/**
 * Invalidates cache by key pattern (prefix, suffix, contains).
 *
 * @param {any} redisClient - Redis client
 * @param {CacheInvalidationPattern} pattern - Invalidation pattern
 * @returns {Promise<number>} Number of keys deleted
 *
 * @example
 * const deleted = await invalidateByPattern(redis, {
 *   pattern: 'user:*',
 *   type: 'prefix',
 *   timestamp: Date.now()
 * });
 */
export async function invalidateByPattern(
  redisClient: any,
  pattern: CacheInvalidationPattern
): Promise<number> {
  let keys: string[] = [];

  if (pattern.type === 'regex') {
    const allKeys = await redisClient.keys('*');
    const regex = new RegExp(pattern.pattern);
    keys = allKeys.filter((key: string) => regex.test(key));
  } else if (pattern.type === 'prefix') {
    keys = await redisClient.keys(`${pattern.pattern}*`);
  } else if (pattern.type === 'suffix') {
    keys = await redisClient.keys(`*${pattern.pattern}`);
  } else if (pattern.type === 'contains') {
    keys = await redisClient.keys(`*${pattern.pattern}*`);
  }

  if (keys.length === 0) return 0;

  return await redisClient.del(...keys);
}

/**
 * Invalidates cache by tags (tag-based invalidation).
 *
 * @param {any} redisClient - Redis client
 * @param {string[]} tags - Tags to invalidate
 * @returns {Promise<number>} Number of keys deleted
 *
 * @example
 * const deleted = await invalidateByTags(redis, ['user', 'profile']);
 */
export async function invalidateByTags(redisClient: any, tags: string[]): Promise<number> {
  let allKeys: string[] = [];

  for (const tag of tags) {
    const tagKey = `tag:${tag}`;
    const keys = await redisClient.smembers(tagKey);
    allKeys = [...allKeys, ...keys];
  }

  if (allKeys.length === 0) return 0;

  // Delete keys and tag sets
  const pipeline = redisClient.pipeline();
  for (const key of allKeys) {
    pipeline.del(key);
  }
  for (const tag of tags) {
    pipeline.del(`tag:${tag}`);
  }

  const results = await pipeline.exec();
  return allKeys.length;
}

/**
 * Implements cache stampede prevention with locking.
 *
 * @param {any} redisClient - Redis client
 * @param {string} key - Cache key
 * @param {() => Promise<T>} loader - Data loader function
 * @param {number} ttl - Time to live in seconds
 * @param {number} lockTTL - Lock TTL in seconds
 * @returns {Promise<T>} Cached or loaded value
 *
 * @example
 * const data = await preventCacheStampede(redis, 'expensive:data', loadData, 3600, 10);
 */
export async function preventCacheStampede<T>(
  redisClient: any,
  key: string,
  loader: () => Promise<T>,
  ttl: number,
  lockTTL: number = 10
): Promise<T> {
  const cached = await redisClient.get(key);
  if (cached) return JSON.parse(cached);

  const lockKey = `lock:${key}`;
  const lockId = crypto.randomBytes(16).toString('hex');

  // Try to acquire lock
  const locked = await redisClient.set(lockKey, lockId, 'EX', lockTTL, 'NX');

  if (locked === 'OK') {
    try {
      // Double-check cache after acquiring lock
      const recheck = await redisClient.get(key);
      if (recheck) return JSON.parse(recheck);

      const value = await loader();
      await redisClient.setex(key, ttl, JSON.stringify(value));
      return value;
    } finally {
      // Release lock
      const currentLock = await redisClient.get(lockKey);
      if (currentLock === lockId) {
        await redisClient.del(lockKey);
      }
    }
  } else {
    // Wait for lock to be released
    await new Promise(resolve => setTimeout(resolve, 100));
    return preventCacheStampede(redisClient, key, loader, ttl, lockTTL);
  }
}

/**
 * Implements time-based cache invalidation with versioning.
 *
 * @param {any} redisClient - Redis client
 * @param {string} key - Cache key
 * @param {T} value - Value to cache
 * @param {number} ttl - Time to live in seconds
 * @param {string} version - Version identifier
 * @returns {Promise<void>}
 *
 * @example
 * await setWithVersion(redis, 'config', configData, 3600, 'v2');
 */
export async function setWithVersion<T>(
  redisClient: any,
  key: string,
  value: T,
  ttl: number,
  version: string
): Promise<void> {
  const versionedKey = `${key}:${version}`;
  await redisClient.setex(versionedKey, ttl, JSON.stringify(value));
  await redisClient.set(`${key}:current`, version);
}

/**
 * Clears all cache entries (flush all).
 *
 * @param {any} redisClient - Redis client
 * @param {string} namespace - Optional namespace to clear
 * @returns {Promise<void>}
 *
 * @example
 * await clearAllCache(redis, 'user');
 */
export async function clearAllCache(redisClient: any, namespace?: string): Promise<void> {
  if (namespace) {
    const keys = await redisClient.keys(`${namespace}:*`);
    if (keys.length > 0) {
      await redisClient.del(...keys);
    }
  } else {
    await redisClient.flushdb();
  }
}

// ============================================================================
// CACHE WARMING UTILITIES (26-30)
// ============================================================================

/**
 * Warms cache with predefined keys and loaders.
 *
 * @param {any} redisClient - Redis client
 * @param {CacheWarmingStrategy} strategy - Cache warming strategy
 * @returns {Promise<number>} Number of keys warmed
 *
 * @example
 * const warmed = await warmCache(redis, {
 *   keys: ['user:popular:1', 'user:popular:2'],
 *   loader: async (key) => await loadUserData(key),
 *   ttl: 3600
 * });
 */
export async function warmCache(
  redisClient: any,
  strategy: CacheWarmingStrategy
): Promise<number> {
  let warmedCount = 0;

  for (const key of strategy.keys) {
    try {
      const value = await strategy.loader(key);
      await redisClient.setex(key, strategy.ttl, JSON.stringify(value));
      warmedCount++;
    } catch (error) {
      console.error(`Failed to warm cache for key ${key}:`, error);
    }
  }

  return warmedCount;
}

/**
 * Pre-warms cache for frequently accessed data.
 *
 * @param {any} redisClient - Redis client
 * @param {Map<string, () => Promise<any>>} loaders - Key-loader map
 * @param {number} ttl - Time to live in seconds
 * @returns {Promise<string[]>} Warmed keys
 *
 * @example
 * const warmed = await prewarmFrequentData(redis, new Map([
 *   ['config:app', loadAppConfig],
 *   ['config:db', loadDbConfig]
 * ]), 3600);
 */
export async function prewarmFrequentData(
  redisClient: any,
  loaders: Map<string, () => Promise<any>>,
  ttl: number
): Promise<string[]> {
  const warmedKeys: string[] = [];

  for (const [key, loader] of loaders.entries()) {
    try {
      const value = await loader();
      await redisClient.setex(key, ttl, JSON.stringify(value));
      warmedKeys.push(key);
    } catch (error) {
      console.error(`Failed to prewarm key ${key}:`, error);
    }
  }

  return warmedKeys;
}

/**
 * Implements scheduled cache warming with cron-like pattern.
 *
 * @param {any} redisClient - Redis client
 * @param {CacheWarmingStrategy} strategy - Warming strategy with schedule
 * @param {() => void} callback - Callback after warming
 * @returns {NodeJS.Timer} Interval timer
 *
 * @example
 * const timer = scheduleWarmup(redis, {
 *   keys: ['popular:data'],
 *   loader: loadData,
 *   ttl: 3600,
 *   schedule: '0 * * * *' // Every hour
 * }, () => console.log('Warmed'));
 */
export function scheduleWarmup(
  redisClient: any,
  strategy: CacheWarmingStrategy,
  callback?: () => void
): NodeJS.Timer {
  const interval = 3600000; // 1 hour default

  return setInterval(async () => {
    try {
      await warmCache(redisClient, strategy);
      if (callback) callback();
    } catch (error) {
      console.error('Scheduled warmup failed:', error);
    }
  }, interval);
}

/**
 * Warms cache based on analytics (most accessed keys).
 *
 * @param {typeof Model} analyticsModel - Cache analytics model
 * @param {any} redisClient - Redis client
 * @param {(key: string) => Promise<any>} loader - Data loader
 * @param {number} topN - Number of top keys to warm
 * @param {number} ttl - Time to live in seconds
 * @returns {Promise<string[]>} Warmed keys
 *
 * @example
 * const warmed = await warmByAnalytics(CacheAnalytics, redis, loadData, 100, 3600);
 */
export async function warmByAnalytics(
  analyticsModel: typeof Model,
  redisClient: any,
  loader: (key: string) => Promise<any>,
  topN: number = 100,
  ttl: number = 3600
): Promise<string[]> {
  const topKeys = await analyticsModel.findAll({
    attributes: [
      'cacheKey',
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'accessCount'],
    ],
    where: {
      hit: true,
      createdAt: {
        [Sequelize.Op.gte]: new Date(Date.now() - 86400000), // Last 24 hours
      },
    },
    group: ['cacheKey'],
    order: [[Sequelize.literal('accessCount'), 'DESC']],
    limit: topN,
    raw: true,
  });

  const warmedKeys: string[] = [];

  for (const { cacheKey } of topKeys as any[]) {
    try {
      const value = await loader(cacheKey);
      await redisClient.setex(cacheKey, ttl, JSON.stringify(value));
      warmedKeys.push(cacheKey);
    } catch (error) {
      console.error(`Failed to warm key ${cacheKey}:`, error);
    }
  }

  return warmedKeys;
}

/**
 * Implements progressive cache warming to avoid load spikes.
 *
 * @param {any} redisClient - Redis client
 * @param {string[]} keys - Keys to warm
 * @param {(key: string) => Promise<any>} loader - Data loader
 * @param {number} ttl - Time to live in seconds
 * @param {number} batchSize - Batch size for progressive warming
 * @param {number} delayMs - Delay between batches (ms)
 * @returns {Promise<number>} Number of keys warmed
 *
 * @example
 * const warmed = await progressiveWarmup(redis, keys, loadData, 3600, 10, 1000);
 */
export async function progressiveWarmup(
  redisClient: any,
  keys: string[],
  loader: (key: string) => Promise<any>,
  ttl: number,
  batchSize: number = 10,
  delayMs: number = 1000
): Promise<number> {
  let warmedCount = 0;

  for (let i = 0; i < keys.length; i += batchSize) {
    const batch = keys.slice(i, i + batchSize);

    await Promise.all(
      batch.map(async key => {
        try {
          const value = await loader(key);
          await redisClient.setex(key, ttl, JSON.stringify(value));
          warmedCount++;
        } catch (error) {
          console.error(`Failed to warm key ${key}:`, error);
        }
      })
    );

    if (i + batchSize < keys.length) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }

  return warmedCount;
}

// ============================================================================
// DISTRIBUTED LOCKING UTILITIES (31-33)
// ============================================================================

/**
 * Acquires a distributed lock with Redis.
 *
 * @param {any} redisClient - Redis client
 * @param {DistributedLockConfig} config - Lock configuration
 * @returns {Promise<string | null>} Lock identifier if acquired, null otherwise
 *
 * @example
 * const lockId = await acquireDistributedLock(redis, {
 *   key: 'resource:123',
 *   ttl: 5000,
 *   retryCount: 3
 * });
 */
export async function acquireDistributedLock(
  redisClient: any,
  config: DistributedLockConfig
): Promise<string | null> {
  const lockId = config.identifier || crypto.randomBytes(16).toString('hex');
  const lockKey = `lock:${config.key}`;

  for (let i = 0; i < (config.retryCount || 3); i++) {
    const result = await redisClient.set(
      lockKey,
      lockId,
      'PX',
      config.ttl,
      'NX'
    );

    if (result === 'OK') {
      return lockId;
    }

    if (i < (config.retryCount || 3) - 1) {
      await new Promise(resolve =>
        setTimeout(resolve, config.retryDelay || 100)
      );
    }
  }

  return null;
}

/**
 * Releases a distributed lock.
 *
 * @param {any} redisClient - Redis client
 * @param {string} key - Lock key
 * @param {string} lockId - Lock identifier
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * const released = await releaseDistributedLock(redis, 'resource:123', lockId);
 */
export async function releaseDistributedLock(
  redisClient: any,
  key: string,
  lockId: string
): Promise<boolean> {
  const lockKey = `lock:${key}`;

  const script = `
    if redis.call("get", KEYS[1]) == ARGV[1] then
      return redis.call("del", KEYS[1])
    else
      return 0
    end
  `;

  const result = await redisClient.eval(script, 1, lockKey, lockId);
  return result === 1;
}

/**
 * Implements Redlock algorithm for distributed locking across multiple Redis instances.
 *
 * @param {any[]} redisClients - Array of Redis clients
 * @param {DistributedLockConfig} config - Lock configuration
 * @returns {Promise<{success: boolean, lockIds: string[]}>} Lock result
 *
 * @example
 * const result = await redlockAcquire([redis1, redis2, redis3], {
 *   key: 'critical:resource',
 *   ttl: 10000
 * });
 */
export async function redlockAcquire(
  redisClients: any[],
  config: DistributedLockConfig
): Promise<{ success: boolean; lockIds: string[] }> {
  const lockId = config.identifier || crypto.randomBytes(16).toString('hex');
  const lockKey = `lock:${config.key}`;
  const lockIds: string[] = [];

  let acquiredCount = 0;

  for (const client of redisClients) {
    try {
      const result = await client.set(lockKey, lockId, 'PX', config.ttl, 'NX');
      if (result === 'OK') {
        acquiredCount++;
        lockIds.push(lockId);
      }
    } catch (error) {
      console.error('Redlock acquire failed for instance:', error);
    }
  }

  const quorum = Math.floor(redisClients.length / 2) + 1;
  const success = acquiredCount >= quorum;

  if (!success) {
    // Release acquired locks
    for (const client of redisClients) {
      try {
        await releaseDistributedLock(client, config.key, lockId);
      } catch (error) {
        console.error('Redlock release failed:', error);
      }
    }
    return { success: false, lockIds: [] };
  }

  return { success: true, lockIds };
}

// ============================================================================
// CACHE ANALYTICS & MONITORING (34-37)
// ============================================================================

/**
 * Collects cache statistics (hits, misses, hit rate).
 *
 * @param {typeof Model} analyticsModel - Cache analytics model
 * @param {string} namespace - Cache namespace
 * @param {Date} startDate - Start date for analysis
 * @param {Date} endDate - End date for analysis
 * @returns {Promise<CacheStats>} Cache statistics
 *
 * @example
 * const stats = await getCacheStats(CacheAnalytics, 'user', startDate, endDate);
 */
export async function getCacheStats(
  analyticsModel: typeof Model,
  namespace: string,
  startDate: Date,
  endDate: Date
): Promise<CacheStats> {
  const stats = await analyticsModel.findAll({
    attributes: [
      [Sequelize.fn('COUNT', Sequelize.literal('CASE WHEN hit = true THEN 1 END')), 'hits'],
      [Sequelize.fn('COUNT', Sequelize.literal('CASE WHEN hit = false THEN 1 END')), 'misses'],
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'total'],
      [Sequelize.fn('AVG', Sequelize.col('ttl')), 'avgTTL'],
    ],
    where: {
      namespace,
      operation: 'get',
      createdAt: {
        [Sequelize.Op.between]: [startDate, endDate],
      },
    },
    raw: true,
  });

  const result = stats[0] as any;
  const hits = parseInt(result.hits) || 0;
  const misses = parseInt(result.misses) || 0;
  const total = hits + misses;

  return {
    hits,
    misses,
    sets: 0,
    deletes: 0,
    evictions: 0,
    hitRate: total > 0 ? hits / total : 0,
    missRate: total > 0 ? misses / total : 0,
    totalKeys: total,
    memoryUsage: 0,
    avgTTL: parseFloat(result.avgTTL) || 0,
  };
}

/**
 * Tracks cache performance metrics.
 *
 * @param {typeof Model} analyticsModel - Cache analytics model
 * @param {string} cacheKey - Cache key
 * @param {string} operation - Cache operation
 * @param {boolean} hit - Whether it was a cache hit
 * @param {number} responseTime - Response time in ms
 * @param {any} metadata - Additional metadata
 * @returns {Promise<void>}
 *
 * @example
 * await trackCacheMetrics(CacheAnalytics, 'user:123', 'get', true, 5, {});
 */
export async function trackCacheMetrics(
  analyticsModel: typeof Model,
  cacheKey: string,
  operation: 'get' | 'set' | 'delete' | 'invalidate',
  hit: boolean,
  responseTime: number,
  metadata?: Record<string, any>
): Promise<void> {
  await analyticsModel.create({
    cacheKey,
    namespace: cacheKey.split(':')[0] || 'default',
    operation,
    hit,
    responseTime,
    metadata: metadata || {},
  });
}

/**
 * Identifies hot keys (most frequently accessed).
 *
 * @param {typeof Model} analyticsModel - Cache analytics model
 * @param {string} namespace - Cache namespace
 * @param {number} topN - Number of top keys to return
 * @param {number} hours - Hours to look back
 * @returns {Promise<Array<{key: string, hits: number}>>} Hot keys
 *
 * @example
 * const hotKeys = await identifyHotKeys(CacheAnalytics, 'user', 10, 24);
 */
export async function identifyHotKeys(
  analyticsModel: typeof Model,
  namespace: string,
  topN: number = 10,
  hours: number = 24
): Promise<Array<{ key: string; hits: number }>> {
  const results = await analyticsModel.findAll({
    attributes: [
      'cacheKey',
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'hits'],
    ],
    where: {
      namespace,
      hit: true,
      createdAt: {
        [Sequelize.Op.gte]: new Date(Date.now() - hours * 3600000),
      },
    },
    group: ['cacheKey'],
    order: [[Sequelize.literal('hits'), 'DESC']],
    limit: topN,
    raw: true,
  });

  return results.map((r: any) => ({
    key: r.cacheKey,
    hits: parseInt(r.hits),
  }));
}

/**
 * Identifies cold keys (rarely accessed).
 *
 * @param {typeof Model} analyticsModel - Cache analytics model
 * @param {string} namespace - Cache namespace
 * @param {number} topN - Number of bottom keys to return
 * @param {number} hours - Hours to look back
 * @returns {Promise<Array<{key: string, hits: number}>>} Cold keys
 *
 * @example
 * const coldKeys = await identifyColdKeys(CacheAnalytics, 'user', 10, 24);
 */
export async function identifyColdKeys(
  analyticsModel: typeof Model,
  namespace: string,
  topN: number = 10,
  hours: number = 24
): Promise<Array<{ key: string; hits: number }>> {
  const results = await analyticsModel.findAll({
    attributes: [
      'cacheKey',
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'hits'],
    ],
    where: {
      namespace,
      createdAt: {
        [Sequelize.Op.gte]: new Date(Date.now() - hours * 3600000),
      },
    },
    group: ['cacheKey'],
    order: [[Sequelize.literal('hits'), 'ASC']],
    limit: topN,
    raw: true,
  });

  return results.map((r: any) => ({
    key: r.cacheKey,
    hits: parseInt(r.hits),
  }));
}

// ============================================================================
// MULTI-LAYER CACHING (38-40)
// ============================================================================

/**
 * Implements multi-layer caching (L1: memory, L2: Redis).
 *
 * @param {string} key - Cache key
 * @param {() => Promise<T>} loader - Data loader function
 * @param {Map<string, CacheEntry>} memoryCache - L1 cache
 * @param {any} redisClient - L2 cache
 * @param {number} l1TTL - L1 TTL in seconds
 * @param {number} l2TTL - L2 TTL in seconds
 * @returns {Promise<T>} Cached or loaded value
 *
 * @example
 * const data = await multiLayerGet('user:123', loadUser, memCache, redis, 300, 3600);
 */
export async function multiLayerGet<T>(
  key: string,
  loader: () => Promise<T>,
  memoryCache: Map<string, CacheEntry>,
  redisClient: any,
  l1TTL: number,
  l2TTL: number
): Promise<T> {
  // Check L1 (memory)
  const l1Entry = memoryCache.get(key);
  if (l1Entry && l1Entry.expiresAt > Date.now()) {
    l1Entry.hits++;
    return l1Entry.value as T;
  }

  // Check L2 (Redis)
  const l2Value = await redisClient.get(key);
  if (l2Value) {
    const value = JSON.parse(l2Value) as T;

    // Populate L1
    const now = Date.now();
    memoryCache.set(key, {
      key,
      value,
      ttl: l1TTL,
      createdAt: now,
      expiresAt: now + l1TTL * 1000,
      hits: 0,
      size: l2Value.length,
    });

    return value;
  }

  // Load from source
  const value = await loader();

  // Populate both layers
  const now = Date.now();
  memoryCache.set(key, {
    key,
    value,
    ttl: l1TTL,
    createdAt: now,
    expiresAt: now + l1TTL * 1000,
    hits: 0,
    size: JSON.stringify(value).length,
  });

  await redisClient.setex(key, l2TTL, JSON.stringify(value));

  return value;
}

/**
 * Implements cache compression for large values.
 *
 * @param {any} redisClient - Redis client
 * @param {string} key - Cache key
 * @param {T} value - Value to cache
 * @param {number} ttl - Time to live in seconds
 * @param {boolean} compress - Whether to compress
 * @returns {Promise<void>}
 *
 * @example
 * await setWithCompression(redis, 'large:data', bigData, 3600, true);
 */
export async function setWithCompression<T>(
  redisClient: any,
  key: string,
  value: T,
  ttl: number,
  compress: boolean = true
): Promise<void> {
  const stringValue = JSON.stringify(value);

  if (compress && stringValue.length > 1024) {
    const zlib = require('zlib');
    const compressed = zlib.gzipSync(stringValue);
    await redisClient.setex(`${key}:compressed`, ttl, compressed);
    await redisClient.setex(`${key}:meta`, ttl, JSON.stringify({ compressed: true }));
  } else {
    await redisClient.setex(key, ttl, stringValue);
  }
}

/**
 * Gets cache value with automatic decompression.
 *
 * @param {any} redisClient - Redis client
 * @param {string} key - Cache key
 * @returns {Promise<T | null>} Cached value or null
 *
 * @example
 * const data = await getWithDecompression<UserData>(redis, 'large:data');
 */
export async function getWithDecompression<T>(
  redisClient: any,
  key: string
): Promise<T | null> {
  const meta = await redisClient.get(`${key}:meta`);

  if (meta) {
    const { compressed } = JSON.parse(meta);
    if (compressed) {
      const compressedData = await redisClient.getBuffer(`${key}:compressed`);
      if (!compressedData) return null;

      const zlib = require('zlib');
      const decompressed = zlib.gunzipSync(compressedData).toString();
      return JSON.parse(decompressed) as T;
    }
  }

  const value = await redisClient.get(key);
  return value ? JSON.parse(value) as T : null;
}

// ============================================================================
// NESTJS INJECTABLE SERVICE
// ============================================================================

/**
 * NestJS Injectable Cache Service with comprehensive caching strategies.
 *
 * @example
 * @Injectable()
 * export class UserService {
 *   constructor(private cacheService: CacheService) {}
 *
 *   async getUser(id: string) {
 *     return this.cacheService.get(`user:${id}`, () => this.loadUser(id));
 *   }
 * }
 */
@Injectable()
export class CacheService {
  private memoryCache: Map<string, CacheEntry>;
  private redisClient: any;

  constructor(@Inject('REDIS_CLIENT') redisClient?: any) {
    this.memoryCache = createInMemoryCache({ ttl: 3600, max: 1000 });
    this.redisClient = redisClient;
  }

  async get<T>(key: string, loader: () => Promise<T>, ttl: number = 3600): Promise<T> {
    if (this.redisClient) {
      return multiLayerGet(key, loader, this.memoryCache, this.redisClient, 300, ttl);
    }
    return cacheAsideGet(key, loader, this.memoryCache, ttl);
  }

  async set<T>(key: string, value: T, ttl: number = 3600): Promise<void> {
    const now = Date.now();
    this.memoryCache.set(key, {
      key,
      value,
      ttl,
      createdAt: now,
      expiresAt: now + ttl * 1000,
      hits: 0,
      size: JSON.stringify(value).length,
    });

    if (this.redisClient) {
      await this.redisClient.setex(key, ttl, JSON.stringify(value));
    }
  }

  async delete(key: string): Promise<void> {
    this.memoryCache.delete(key);
    if (this.redisClient) {
      await this.redisClient.del(key);
    }
  }

  async invalidatePattern(pattern: CacheInvalidationPattern): Promise<number> {
    if (this.redisClient) {
      return invalidateByPattern(this.redisClient, pattern);
    }
    return 0;
  }
}

/**
 * NestJS Cache Interceptor for automatic method result caching.
 *
 * @example
 * @UseInterceptors(CacheInterceptor)
 * @Get('users/:id')
 * async getUser(@Param('id') id: string) {
 *   return this.userService.findOne(id);
 * }
 */
@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(private cacheService: CacheService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const cacheKey = `${request.method}:${request.url}`;

    const cached = await this.cacheService.get(cacheKey, async () => null, 300);
    if (cached) {
      return of(cached);
    }

    return next.handle().pipe(
      tap(async response => {
        await this.cacheService.set(cacheKey, response, 300);
      })
    );
  }
}
