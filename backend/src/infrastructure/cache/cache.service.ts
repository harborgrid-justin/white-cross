/**
 * @fileoverview Redis-based Distributed Cache Service
 * @module infrastructure/cache/service
 * @description Enterprise-grade caching with Redis, multi-tier support, compression,
 * tag-based invalidation, and comprehensive monitoring
 *
 * Features:
 * - Redis integration with automatic reconnection
 * - Multi-tier caching (L1: memory, L2: Redis)
 * - Tag-based and pattern-based cache invalidation
 * - Automatic compression for large values
 * - Type-safe operations with generics
 * - Connection pooling and health monitoring
 * - Detailed statistics and metrics
 * - Graceful degradation on Redis failure
 */

import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import Redis from 'ioredis';
import * as zlib from 'zlib';
import { promisify } from 'util';
import { CacheConfigService } from './cache.config';
import {
  CacheOptions,
  CacheStats,
  CacheHealth,
  CacheOperationResult,
  BatchOperation,
  BatchOperationResult,
  InvalidationPattern,
  CacheEvent,
  CacheMetadata,
} from './cache.interfaces';
import {
  HighPerformance,
  GCSchedule,
  MemoryIntensive,
  ResourcePool,
  MemoryMonitoring,
  Cleanup,
  MemorySensitive,
  ImmediateCleanup
} from '../../discovery/modules/decorators/memory-optimization.decorators';

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);

/**
 * L1 (memory) cache entry
 */
interface L1Entry<T = any> {
  data: T;
  expiresAt: number;
  compressed: boolean;
  size: number;
}

/**
 * Redis cache service with multi-tier support
 * Enhanced with Discovery Service memory optimization patterns
 */
@HighPerformance()
@GCSchedule({
  gcTriggerThreshold: 256, // 256MB
  aggressiveGcThreshold: 512, // 512MB
  maxRequestsBeforeGC: 10000,
  timeBasedGC: true,
  gcInterval: 300000, // 5 minutes
  priority: 'critical',
  leakDetectionEnabled: true,
  preventiveGC: true
})
@MemoryIntensive({
  enabled: true,
  threshold: 200, // 200MB
  priority: 'high',
  cleanupStrategy: 'aggressive',
  monitoring: true
})
@ResourcePool({
  enabled: true,
  resourceType: 'connection',
  minSize: 2,
  maxSize: 20,
  priority: 9,
  validationEnabled: true,
  autoScale: true
})
@MemoryMonitoring({
  enabled: true,
  interval: 30000, // 30 seconds
  threshold: 150, // 150MB
  alerts: true
})
@Injectable()
export class CacheService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(CacheService.name);
  private redis: Redis | null = null;
  private l1Cache: Map<string, L1Entry> = new Map();
  private tagIndex: Map<string, Set<string>> = new Map();
  private stats: {
    hits: number;
    misses: number;
    l1Hits: number;
    l2Hits: number;
    sets: number;
    deletes: number;
    errors: number;
    getTotalLatency: number;
    setTotalLatency: number;
  };
  private startTime: number;
  private l1CleanupInterval?: NodeJS.Timeout;
  private reconnectAttempts = 0;
  private isHealthy = true;
  private lastError?: Error;

  constructor(
    private readonly cacheConfig: CacheConfigService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.stats = {
      hits: 0,
      misses: 0,
      l1Hits: 0,
      l2Hits: 0,
      sets: 0,
      deletes: 0,
      errors: 0,
      getTotalLatency: 0,
      setTotalLatency: 0,
    };
    this.startTime = Date.now();
  }

  /**
   * Initialize Redis connection and L1 cache cleanup
   */
  async onModuleInit(): Promise<void> {
    try {
      this.cacheConfig.validate();
      await this.connectRedis();
      this.startL1Cleanup();
      this.logger.log(
        `Cache service initialized: ${JSON.stringify(this.cacheConfig.getSummary())}`,
      );
    } catch (error) {
      this.logger.error('Failed to initialize cache service', error);
      this.isHealthy = false;
      this.lastError = error as Error;
    }
  }

  /**
   * Cleanup on module destroy
   */
  async onModuleDestroy(): Promise<void> {
    this.stopL1Cleanup();
    if (this.redis) {
      await this.redis.quit();
      this.redis = null;
    }
    this.l1Cache.clear();
    this.tagIndex.clear();
    this.logger.log('Cache service destroyed');
  }

  /**
   * Connect to Redis with retry logic
   * @private
   */
  private async connectRedis(): Promise<void> {
    const config = this.cacheConfig.getRedisConfig();

    try {
      this.redis = new Redis({
        host: config.host,
        port: config.port,
        password: config.password,
        db: config.db,
        connectTimeout: config.connectionTimeout,
        retryStrategy: (times) => {
          if (times > config.maxRetries) {
            this.logger.error('Redis connection failed after max retries');
            return null;
          }
          const delay = Math.min(times * config.retryDelay, 10000);
          this.logger.warn(`Retrying Redis connection in ${delay}ms (attempt ${times})`);
          return delay;
        },
        maxRetriesPerRequest: 3,
        enableReadyCheck: true,
        lazyConnect: false,
      });

      this.redis.on('error', (error) => {
        this.logger.error('Redis error:', error);
        this.isHealthy = false;
        this.lastError = error;
        this.stats.errors++;
      });

      this.redis.on('connect', () => {
        this.logger.log('Redis connected');
        this.isHealthy = true;
        this.reconnectAttempts = 0;
      });

      this.redis.on('ready', () => {
        this.logger.log('Redis ready');
      });

      this.redis.on('close', () => {
        this.logger.warn('Redis connection closed');
        this.isHealthy = false;
      });

      this.redis.on('reconnecting', () => {
        this.reconnectAttempts++;
        this.logger.log(`Redis reconnecting (attempt ${this.reconnectAttempts})`);
      });

      await this.redis.ping();
      this.logger.log('Redis connection established');
    } catch (error) {
      this.logger.error('Failed to connect to Redis', error);
      this.isHealthy = false;
      this.lastError = error as Error;
      throw error;
    }
  }

  /**
   * Get value from cache
   * @param key - Cache key
   * @param options - Cache options
   * @returns Cached value or null
   */
  @MemorySensitive(50) // 50MB threshold for cleanup
  async get<T = any>(
    key: string,
    options: CacheOptions = {},
  ): Promise<T | null> {
    const startTime = Date.now();
    const fullKey = this.cacheConfig.buildKey(key, options.namespace);

    try {
      // Try L1 cache first (if enabled and not skipped)
      if (this.cacheConfig.isL1CacheEnabled() && !options.skipL1) {
        const l1Result = this.getFromL1<T>(fullKey);
        if (l1Result !== null) {
          this.stats.hits++;
          this.stats.l1Hits++;
          this.stats.getTotalLatency += Date.now() - startTime;
          this.emitEvent(CacheEvent.HIT, fullKey, { source: 'L1' });
          return l1Result;
        }
      }

      // Try L2 (Redis) cache
      const l2Result = await this.getFromL2<T>(fullKey);
      if (l2Result !== null) {
        this.stats.hits++;
        this.stats.l2Hits++;
        this.stats.getTotalLatency += Date.now() - startTime;
        this.emitEvent(CacheEvent.HIT, fullKey, { source: 'L2' });

        // Populate L1 cache
        if (this.cacheConfig.isL1CacheEnabled() && !options.skipL1) {
          this.setToL1(fullKey, l2Result, options);
        }

        return l2Result;
      }

      // Cache miss
      this.stats.misses++;
      this.stats.getTotalLatency += Date.now() - startTime;
      this.emitEvent(CacheEvent.MISS, fullKey);
      return null;
    } catch (error) {
      this.logger.error(`Cache get error for key ${fullKey}:`, error);
      this.stats.errors++;
      this.lastError = error as Error;
      this.emitEvent(CacheEvent.ERROR, fullKey, { error });
      return null;
    }
  }

  /**
   * Set value in cache
   * @param key - Cache key
   * @param value - Value to cache
   * @param options - Cache options
   *
   * @description Attempts to set value in both L2 (Redis) and L1 (memory) cache.
   * If Redis is unavailable, gracefully degrades to L1 cache only and logs warning.
   */
  @MemorySensitive(75) // 75MB threshold for memory-intensive set operations
  async set<T = any>(
    key: string,
    value: T,
    options: CacheOptions = {},
  ): Promise<void> {
    const startTime = Date.now();
    const fullKey = this.cacheConfig.buildKey(key, options.namespace);

    try {
      // Attempt to set in L2 (Redis) cache
      try {
        await this.setToL2(fullKey, value, options);
      } catch (redisError) {
        // Graceful degradation: log warning but continue with L1 cache
        if (!this.redis) {
          this.logger.warn(`Redis unavailable, using L1 cache only for key: ${fullKey}`, {
            key: fullKey,
            cacheMode: 'L1-only',
            redisStatus: 'disconnected',
          });
          this.isHealthy = false;
        } else {
          // Redis exists but operation failed - log error
          this.logger.error(`Redis operation failed for key ${fullKey}:`, {
            error: redisError.message,
            key: fullKey,
          });
          this.stats.errors++;
          throw redisError;
        }
      }

      // Set in L1 cache (always attempt this as fallback)
      if (this.cacheConfig.isL1CacheEnabled() && !options.skipL1) {
        this.setToL1(fullKey, value, options);
      }

      // Update tag index
      if (options.tags && options.tags.length > 0) {
        this.indexTags(fullKey, options.tags);
      }

      this.stats.sets++;
      this.stats.setTotalLatency += Date.now() - startTime;
      this.emitEvent(CacheEvent.SET, fullKey, { tags: options.tags });
    } catch (error) {
      this.logger.error(`Cache set error for key ${fullKey}:`, {
        error: error.message,
        key: fullKey,
        redisConnected: !!this.redis,
        l1Enabled: this.cacheConfig.isL1CacheEnabled(),
      });
      this.stats.errors++;
      this.lastError = error as Error;
      this.emitEvent(CacheEvent.ERROR, fullKey, { error });
      throw error;
    }
  }

  /**
   * Delete value from cache
   * @param key - Cache key
   * @param options - Cache options
   *
   * @description Deletes value from both L1 and L2 cache. If Redis is unavailable,
   * still deletes from L1 cache and returns true.
   */
  async delete(key: string, options: CacheOptions = {}): Promise<boolean> {
    const fullKey = this.cacheConfig.buildKey(key, options.namespace);

    try {
      // Delete from L1 cache
      this.l1Cache.delete(fullKey);

      // Delete from L2 cache (Redis)
      if (this.redis) {
        try {
          await this.redis.del(fullKey);
        } catch (redisError) {
          this.logger.warn(`Redis delete failed for key ${fullKey}, L1 cache cleared`, {
            error: redisError.message,
            key: fullKey,
            l1Deleted: true,
          });
        }
      } else {
        this.logger.debug(`Redis unavailable, deleted from L1 cache only: ${fullKey}`);
      }

      // Remove from tag index
      this.removeFromTagIndex(fullKey);

      this.stats.deletes++;
      this.emitEvent(CacheEvent.DELETE, fullKey);
      return true;
    } catch (error) {
      this.logger.error(`Cache delete error for key ${fullKey}:`, {
        error: error.message,
        key: fullKey,
        redisConnected: !!this.redis,
      });
      this.stats.errors++;
      this.lastError = error as Error;
      this.emitEvent(CacheEvent.ERROR, fullKey, { error });
      return false;
    }
  }

  /**
   * Check if key exists in cache
   * @param key - Cache key
   * @param options - Cache options
   */
  async has(key: string, options: CacheOptions = {}): Promise<boolean> {
    const fullKey = this.cacheConfig.buildKey(key, options.namespace);

    // Check L1 cache
    if (this.l1Cache.has(fullKey)) {
      const entry = this.l1Cache.get(fullKey)!;
      if (entry.expiresAt > Date.now()) {
        return true;
      }
      this.l1Cache.delete(fullKey);
    }

    // Check L2 cache
    if (this.redis) {
      try {
        const exists = await this.redis.exists(fullKey);
        return exists === 1;
      } catch (error) {
        this.logger.error(`Cache has error for key ${fullKey}:`, error);
        return false;
      }
    }

    return false;
  }

  /**
   * Invalidate cache by pattern
   * @param pattern - Invalidation pattern
   */
  async invalidate(pattern: InvalidationPattern): Promise<number> {
    let count = 0;

    try {
      switch (pattern.type) {
        case 'key':
          await this.delete(pattern.value);
          count = 1;
          break;

        case 'prefix':
          count = await this.invalidateByPrefix(pattern.value);
          break;

        case 'tag':
          count = await this.invalidateByTag(pattern.value);
          break;

        case 'pattern':
          count = await this.invalidateByPattern(pattern.value);
          break;

        case 'cascade':
          count = await this.invalidateCascade(pattern.value);
          break;

        default:
          this.logger.warn(`Unknown invalidation pattern type: ${pattern.type}`);
      }

      this.emitEvent(CacheEvent.INVALIDATE, pattern.value, {
        type: pattern.type,
        count,
      });
      return count;
    } catch (error) {
      this.logger.error('Cache invalidation error:', error);
      this.stats.errors++;
      return 0;
    }
  }

  /**
   * Invalidate cache by prefix
   * @param prefix - Key prefix
   * @private
   */
  private async invalidateByPrefix(prefix: string): Promise<number> {
    const fullPrefix = this.cacheConfig.buildKey(prefix);
    let count = 0;

    // Clear from L1 cache
    for (const key of this.l1Cache.keys()) {
      if (key.startsWith(fullPrefix)) {
        this.l1Cache.delete(key);
        count++;
      }
    }

    // Clear from L2 cache
    if (this.redis) {
      const keys = await this.redis.keys(`${fullPrefix}*`);
      if (keys.length > 0) {
        await this.redis.del(...keys);
        count += keys.length;
      }
    }

    return count;
  }

  /**
   * Invalidate cache by tag
   * @param tag - Cache tag
   * @private
   */
  private async invalidateByTag(tag: string): Promise<number> {
    const keys = this.tagIndex.get(tag);
    if (!keys || keys.size === 0) {
      return 0;
    }

    let count = 0;
    for (const key of Array.from(keys)) {
      await this.delete(key, {});
      count++;
    }

    this.tagIndex.delete(tag);
    return count;
  }

  /**
   * Invalidate cache by pattern
   * @param pattern - Key pattern (supports wildcards)
   * @private
   */
  private async invalidateByPattern(pattern: string): Promise<number> {
    const fullPattern = this.cacheConfig.buildKey(pattern);
    let count = 0;

    // Clear from L1 cache
    const regex = new RegExp(
      `^${fullPattern.replace(/\*/g, '.*').replace(/\?/g, '.')}$`,
    );
    for (const key of this.l1Cache.keys()) {
      if (regex.test(key)) {
        this.l1Cache.delete(key);
        count++;
      }
    }

    // Clear from L2 cache
    if (this.redis) {
      const keys = await this.redis.keys(fullPattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
        count += keys.length;
      }
    }

    return count;
  }

  /**
   * Cascade invalidation (invalidate key and all related keys)
   * @param key - Cache key
   * @private
   */
  private async invalidateCascade(key: string): Promise<number> {
    // Delete the main key
    await this.delete(key);

    // Find and delete all keys that reference this key
    const pattern = `*:${key}:*`;
    return (await this.invalidateByPattern(pattern)) + 1;
  }

  /**
   * Get multiple keys at once (batch operation)
   * @param keys - Array of cache keys
   * @param options - Cache options
   */
  async mget<T = any>(
    keys: string[],
    options: CacheOptions = {},
  ): Promise<Array<T | null>> {
    const results: Array<T | null> = [];

    for (const key of keys) {
      const value = await this.get<T>(key, options);
      results.push(value);
    }

    return results;
  }

  /**
   * Set multiple keys at once (batch operation)
   * @param entries - Array of key-value pairs
   * @param options - Cache options
   */
  async mset<T = any>(
    entries: Array<{ key: string; value: T }>,
    options: CacheOptions = {},
  ): Promise<void> {
    for (const entry of entries) {
      await this.set(entry.key, entry.value, options);
    }
  }

  /**
   * Delete multiple keys at once (batch operation)
   * @param keys - Array of cache keys
   * @param options - Cache options
   */
  async mdel(keys: string[], options: CacheOptions = {}): Promise<number> {
    let count = 0;
    for (const key of keys) {
      const deleted = await this.delete(key, options);
      if (deleted) count++;
    }
    return count;
  }

  /**
   * Increment numeric value
   * @param key - Cache key
   * @param amount - Amount to increment (default: 1)
   * @param options - Cache options
   * @throws Error if Redis is not connected and operation cannot be performed
   */
  async increment(
    key: string,
    amount = 1,
    options: CacheOptions = {},
  ): Promise<number> {
    const fullKey = this.cacheConfig.buildKey(key, options.namespace);

    try {
      if (!this.redis) {
        const error = new Error(`Redis not connected - cannot increment key: ${fullKey}`);
        this.logger.warn(error.message, {
          key: fullKey,
          amount,
          redisStatus: 'disconnected',
          recommendation: 'Check Redis connection configuration and ensure Redis server is running',
        });
        this.stats.errors++;
        this.lastError = error;
        throw error;
      }

      const result = await this.redis.incrby(fullKey, amount);

      // Set TTL if specified
      if (options.ttl) {
        await this.redis.expire(fullKey, options.ttl);
      }

      return result;
    } catch (error) {
      this.logger.error(`Cache increment error for key ${fullKey}:`, {
        error: error.message,
        key: fullKey,
        amount,
        redisConnected: !!this.redis,
      });
      this.stats.errors++;
      this.lastError = error as Error;
      throw error;
    }
  }

  /**
   * Decrement numeric value
   * @param key - Cache key
   * @param amount - Amount to decrement (default: 1)
   * @param options - Cache options
   * @throws Error if Redis is not connected and operation cannot be performed
   */
  async decrement(
    key: string,
    amount = 1,
    options: CacheOptions = {},
  ): Promise<number> {
    const fullKey = this.cacheConfig.buildKey(key, options.namespace);

    try {
      if (!this.redis) {
        const error = new Error(`Redis not connected - cannot decrement key: ${fullKey}`);
        this.logger.warn(error.message, {
          key: fullKey,
          amount,
          redisStatus: 'disconnected',
          recommendation: 'Check Redis connection configuration and ensure Redis server is running',
        });
        this.stats.errors++;
        this.lastError = error;
        throw error;
      }

      const result = await this.redis.decrby(fullKey, amount);

      // Set TTL if specified
      if (options.ttl) {
        await this.redis.expire(fullKey, options.ttl);
      }

      return result;
    } catch (error) {
      this.logger.error(`Cache decrement error for key ${fullKey}:`, {
        error: error.message,
        key: fullKey,
        amount,
        redisConnected: !!this.redis,
      });
      this.stats.errors++;
      this.lastError = error as Error;
      throw error;
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const totalOps = this.stats.hits + this.stats.misses;
    const hitRate = totalOps > 0 ? (this.stats.hits / totalOps) * 100 : 0;

    let memoryUsage = 0;
    for (const entry of this.l1Cache.values()) {
      memoryUsage += entry.size;
    }

    return {
      hits: this.stats.hits,
      misses: this.stats.misses,
      hitRate: Math.round(hitRate * 100) / 100,
      l1Hits: this.stats.l1Hits,
      l2Hits: this.stats.l2Hits,
      keys: this.l1Cache.size,
      l1Size: this.l1Cache.size,
      l2Size: -1, // Would need Redis INFO command
      avgGetLatency:
        totalOps > 0
          ? Math.round((this.stats.getTotalLatency / totalOps) * 100) / 100
          : 0,
      avgSetLatency:
        this.stats.sets > 0
          ? Math.round((this.stats.setTotalLatency / this.stats.sets) * 100) / 100
          : 0,
      totalOperations: totalOps + this.stats.sets + this.stats.deletes,
      failedOperations: this.stats.errors,
      memoryUsage,
    };
  }

  /**
   * Reset cache statistics
   */
  resetStats(): void {
    this.stats = {
      hits: 0,
      misses: 0,
      l1Hits: 0,
      l2Hits: 0,
      sets: 0,
      deletes: 0,
      errors: 0,
      getTotalLatency: 0,
      setTotalLatency: 0,
    };
  }

  /**
   * Get cache health status
   */
  async getHealth(): Promise<CacheHealth> {
    let redisLatency = -1;
    let redisConnected = false;

    if (this.redis) {
      try {
        const start = Date.now();
        await this.redis.ping();
        redisLatency = Date.now() - start;
        redisConnected = true;
      } catch (error) {
        redisConnected = false;
      }
    }

    const l1Status =
      !this.cacheConfig.isL1CacheEnabled()
        ? 'disabled'
        : this.l1Cache.size >= this.cacheConfig.getConfig().l1MaxSize
          ? 'full'
          : 'ok';

    let status: 'healthy' | 'degraded' | 'unhealthy';
    if (redisConnected && l1Status !== 'full') {
      status = 'healthy';
    } else if (redisConnected || l1Status === 'ok') {
      status = 'degraded';
    } else {
      status = 'unhealthy';
    }

    return {
      status,
      redisConnected,
      redisLatency,
      l1Status,
      recentErrors: this.stats.errors,
      lastError: this.lastError?.message,
      uptime: Math.floor((Date.now() - this.startTime) / 1000),
    };
  }

  /**
   * Clear all cache (use with caution)
   */
  @ImmediateCleanup()
  @Cleanup('high')
  async clear(): Promise<void> {
    this.l1Cache.clear();
    this.tagIndex.clear();

    if (this.redis) {
      const pattern = `${this.cacheConfig.getKeyPrefix()}:*`;
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    }

    this.logger.warn('Cache cleared');
  }

  // Private helper methods

  /**
   * Get value from L1 cache
   * @private
   */
  private getFromL1<T>(key: string): T | null {
    const entry = this.l1Cache.get(key);
    if (!entry) {
      return null;
    }

    // Check expiration
    if (entry.expiresAt <= Date.now()) {
      this.l1Cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Set value in L1 cache
   * @private
   */
  private setToL1<T>(key: string, value: T, options: CacheOptions): void {
    const config = this.cacheConfig.getConfig();

    // Check L1 cache size limit
    if (this.l1Cache.size >= config.l1MaxSize) {
      this.evictL1();
    }

    const ttl = options.ttl || config.l1Ttl;
    const entry: L1Entry<T> = {
      data: value,
      expiresAt: Date.now() + ttl * 1000,
      compressed: false,
      size: JSON.stringify(value).length * 2, // Rough estimate
    };

    this.l1Cache.set(key, entry);
  }

  /**
   * Get value from L2 (Redis) cache
   * @private
   */
  private async getFromL2<T>(key: string): Promise<T | null> {
    if (!this.redis) {
      return null;
    }

    try {
      const value = await this.redis.get(key);
      if (!value) {
        return null;
      }

      return await this.deserialize<T>(value);
    } catch (error) {
      this.logger.error(`L2 cache get error for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Set value in L2 (Redis) cache
   * @private
   * @throws Error if Redis is not connected
   */
  private async setToL2<T>(
    key: string,
    value: T,
    options: CacheOptions,
  ): Promise<void> {
    if (!this.redis) {
      const error = new Error(`Redis not connected - cannot set key in L2 cache: ${key}`);
      this.logger.warn(error.message, {
        key,
        redisStatus: 'disconnected',
        fallback: 'L1 cache only',
        recommendation: 'Check Redis connection configuration and ensure Redis server is running',
      });
      this.stats.errors++;
      this.lastError = error;
      throw error;
    }

    const ttl = options.ttl || this.cacheConfig.getDefaultTTL();
    const serialized = await this.serialize(value, options);

    await this.redis.setex(key, ttl, serialized);
  }

  /**
   * Serialize value for storage
   * @private
   */
  private async serialize<T>(value: T, options: CacheOptions): Promise<string> {
    const json = JSON.stringify(value);
    const shouldCompress =
      (options.compress || this.cacheConfig.isCompressionEnabled()) &&
      json.length > this.cacheConfig.getConfig().compressionThreshold;

    if (shouldCompress) {
      const compressed = await gzip(Buffer.from(json));
      return `compressed:${compressed.toString('base64')}`;
    }

    return json;
  }

  /**
   * Deserialize value from storage
   * @private
   */
  private async deserialize<T>(value: string): Promise<T> {
    if (value.startsWith('compressed:')) {
      const compressed = Buffer.from(value.slice(11), 'base64');
      const decompressed = await gunzip(compressed);
      return JSON.parse(decompressed.toString());
    }

    return JSON.parse(value);
  }

  /**
   * Evict oldest entry from L1 cache (LRU)
   * @private
   */
  private evictL1(): void {
    let oldestKey: string | null = null;
    let oldestExpiry = Number.MAX_SAFE_INTEGER;

    for (const [key, entry] of this.l1Cache.entries()) {
      if (entry.expiresAt < oldestExpiry) {
        oldestExpiry = entry.expiresAt;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.l1Cache.delete(oldestKey);
      this.emitEvent(CacheEvent.EVICT, oldestKey, { source: 'L1' });
    }
  }

  /**
   * Index tags for cache invalidation
   * @private
   */
  private indexTags(key: string, tags: string[]): void {
    for (const tag of tags) {
      if (!this.tagIndex.has(tag)) {
        this.tagIndex.set(tag, new Set());
      }
      this.tagIndex.get(tag)!.add(key);
    }
  }

  /**
   * Remove key from tag index
   * @private
   */
  private removeFromTagIndex(key: string): void {
    for (const [tag, keys] of this.tagIndex.entries()) {
      keys.delete(key);
      if (keys.size === 0) {
        this.tagIndex.delete(tag);
      }
    }
  }

  /**
   * Start L1 cache cleanup interval
   * @private
   */
  private startL1Cleanup(): void {
    if (!this.cacheConfig.isL1CacheEnabled()) {
      return;
    }

    this.l1CleanupInterval = setInterval(() => {
      this.cleanupL1();
    }, 60000); // Every minute
  }

  /**
   * Stop L1 cache cleanup interval
   * @private
   */
  private stopL1Cleanup(): void {
    if (this.l1CleanupInterval) {
      clearInterval(this.l1CleanupInterval);
      this.l1CleanupInterval = undefined;
    }
  }

  /**
   * Cleanup expired entries from L1 cache
   * @private
   */
  @Cleanup('normal')
  private cleanupL1(): void {
    const now = Date.now();
    let removed = 0;

    for (const [key, entry] of this.l1Cache.entries()) {
      if (entry.expiresAt <= now) {
        this.l1Cache.delete(key);
        removed++;
      }
    }

    if (removed > 0) {
      this.logger.debug(`L1 cache cleanup: removed ${removed} expired entries`);
    }
  }

  /**
   * Emit cache event
   * @private
   */
  private emitEvent(
    event: CacheEvent,
    key: string,
    metadata?: Record<string, any>,
  ): void {
    this.eventEmitter.emit(event, {
      event,
      key,
      timestamp: Date.now(),
      metadata,
    });
  }
}
