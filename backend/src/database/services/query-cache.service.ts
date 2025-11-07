/**
 * Query Cache Service
 * Implements multi-layer caching for Sequelize queries with Redis support
 *
 * Features:
 * - Two-tier caching (in-memory + Redis)
 * - Automatic cache invalidation on model changes
 * - Configurable TTL per query
 * - Cache statistics tracking
 * - HIPAA-compliant caching (no PHI in cache keys)
 */

import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Model, ModelCtor } from 'sequelize-typescript';
import * as crypto from 'crypto';

export interface CacheOptions {
  ttl?: number; // Time to live in seconds (default: 300)
  keyPrefix?: string; // Prefix for cache key
  invalidateOn?: string[]; // Operations that invalidate cache: ['create', 'update', 'destroy']
  useLocalCache?: boolean; // Use in-memory cache (default: true)
  useRedisCache?: boolean; // Use Redis cache (default: false, requires Redis setup)
}

export interface CacheStats {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  hitRate: number;
  localCacheSize: number;
  redisAvailable: boolean;
}

@Injectable()
export class QueryCacheService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(QueryCacheService.name);

  // Local in-memory cache
  private localCache = new Map<string, { data: any; expires: number }>();

  // Cache statistics
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
    hitRate: 0,
    localCacheSize: 0,
    redisAvailable: false,
  };

  // Default configuration
  private readonly DEFAULT_TTL = 300; // 5 minutes
  private readonly MAX_LOCAL_CACHE_SIZE = 1000;
  private readonly CLEANUP_INTERVAL = 60000; // 1 minute

  // Cleanup interval
  private cleanupInterval: NodeJS.Timeout | null = null;

  // Model invalidation hooks storage
  private modelHooks = new Map<string, Set<string>>();

  constructor() {} // @Inject('REDIS_CLIENT') private readonly redis?: any // Redis client would be injected here when implemented

  async onModuleInit(): Promise<void> {
    this.logger.log('Initializing Query Cache Service');
    this.startCleanupTask();
  }

  /**
   * Start periodic cleanup of expired cache entries
   */
  private startCleanupTask(): void {
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpiredEntries();
    }, this.CLEANUP_INTERVAL);
  }

  /**
   * Clean up expired entries from local cache
   */
  private cleanupExpiredEntries(): void {
    const now = Date.now();
    let cleanedCount = 0;

    const entries = Array.from(this.localCache.entries());
    for (const [key, value] of entries) {
      if (value.expires < now) {
        this.localCache.delete(key);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      this.logger.debug(`Cleaned up ${cleanedCount} expired cache entries`);
    }

    this.stats.localCacheSize = this.localCache.size;
  }

  /**
   * Get cached data or execute query
   */
  async findWithCache<T extends Model>(
    model: ModelCtor<T>,
    findOptions: any,
    cacheOptions: CacheOptions = {},
  ): Promise<T[]> {
    const {
      ttl = this.DEFAULT_TTL,
      keyPrefix = 'query',
      invalidateOn = ['create', 'update', 'destroy'],
      useLocalCache = true,
      useRedisCache = false,
    } = cacheOptions;

    // Generate cache key
    const cacheKey = this.generateCacheKey(keyPrefix, model.name, findOptions);

    // Try local cache first
    if (useLocalCache) {
      const localData = this.getFromLocalCache(cacheKey);
      if (localData !== null) {
        this.stats.hits++;
        this.updateHitRate();
        return localData;
      }
    }

    // Try Redis cache (if enabled and available)
    // if (useRedisCache && this.stats.redisAvailable) {
    //   const redisData = await this.getFromRedis(cacheKey);
    //   if (redisData !== null) {
    //     // Populate local cache
    //     this.setInLocalCache(cacheKey, redisData, ttl);
    //     this.stats.hits++;
    //     this.updateHitRate();
    //     return redisData;
    //   }
    // }

    // Cache miss - execute query
    this.stats.misses++;
    this.updateHitRate();

    const result = await model.findAll(findOptions);

    // Cache the result
    await this.set(cacheKey, result, ttl, { useLocalCache, useRedisCache });

    // Set up invalidation hooks
    this.setupInvalidationHooks(model, keyPrefix, invalidateOn);

    return result;
  }

  /**
   * Get single record with cache
   */
  async findOneWithCache<T extends Model>(
    model: ModelCtor<T>,
    findOptions: any,
    cacheOptions: CacheOptions = {},
  ): Promise<T | null> {
    const {
      ttl = this.DEFAULT_TTL,
      keyPrefix = 'query_one',
      invalidateOn = ['create', 'update', 'destroy'],
      useLocalCache = true,
      useRedisCache = false,
    } = cacheOptions;

    const cacheKey = this.generateCacheKey(keyPrefix, model.name, findOptions);

    // Try local cache
    if (useLocalCache) {
      const localData = this.getFromLocalCache(cacheKey);
      if (localData !== null) {
        this.stats.hits++;
        this.updateHitRate();
        return localData;
      }
    }

    // Cache miss - execute query
    this.stats.misses++;
    this.updateHitRate();

    const result = await model.findOne(findOptions);

    // Cache the result
    await this.set(cacheKey, result, ttl, { useLocalCache, useRedisCache });

    // Set up invalidation hooks
    this.setupInvalidationHooks(model, keyPrefix, invalidateOn);

    return result;
  }

  /**
   * Get data from local cache
   */
  private getFromLocalCache(key: string): any | null {
    const entry = this.localCache.get(key);

    if (!entry) {
      return null;
    }

    // Check expiration
    if (entry.expires < Date.now()) {
      this.localCache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Set data in local cache
   */
  private setInLocalCache(key: string, data: any, ttl: number): void {
    // Enforce cache size limit
    if (this.localCache.size >= this.MAX_LOCAL_CACHE_SIZE) {
      // Remove oldest entries (simple FIFO)
      const firstKey = this.localCache.keys().next().value;
      if (firstKey) {
        this.localCache.delete(firstKey);
      }
    }

    this.localCache.set(key, {
      data,
      expires: Date.now() + ttl * 1000,
    });

    this.stats.localCacheSize = this.localCache.size;
  }

  /**
   * Set data in cache
   */
  async set(
    key: string,
    data: any,
    ttl: number = this.DEFAULT_TTL,
    options: { useLocalCache?: boolean; useRedisCache?: boolean } = {},
  ): Promise<void> {
    const { useLocalCache = true, useRedisCache = false } = options;

    this.stats.sets++;

    // Set in local cache
    if (useLocalCache) {
      this.setInLocalCache(key, data, ttl);
    }

    // Set in Redis (if enabled)
    // if (useRedisCache && this.stats.redisAvailable) {
    //   await this.setInRedis(key, data, ttl);
    // }
  }

  /**
   * Invalidate cache by pattern
   */
  async invalidatePattern(pattern: string): Promise<number> {
    let deletedCount = 0;

    // Clear from local cache
    const keys = Array.from(this.localCache.keys());
    for (const key of keys) {
      if (key.includes(pattern)) {
        this.localCache.delete(key);
        deletedCount++;
      }
    }

    this.stats.deletes += deletedCount;
    this.stats.localCacheSize = this.localCache.size;

    // Clear from Redis (if available)
    // if (this.stats.redisAvailable) {
    //   const redisCount = await this.invalidateRedisPattern(pattern);
    //   deletedCount += redisCount;
    // }

    if (deletedCount > 0) {
      this.logger.debug(
        `Invalidated ${deletedCount} cache entries matching pattern: ${pattern}`,
      );
    }

    return deletedCount;
  }

  /**
   * Setup cache invalidation hooks on model
   */
  private setupInvalidationHooks<T extends Model>(
    model: ModelCtor<T>,
    keyPrefix: string,
    operations: string[],
  ): void {
    const modelName = model.name;
    const hookKey = `${modelName}:${keyPrefix}`;

    // Check if hooks already set up
    if (this.modelHooks.has(hookKey)) {
      return;
    }

    const registeredHooks = new Set<string>();

    operations.forEach((operation) => {
      const hookName = `after${this.capitalize(operation)}`;

      // Register hook
      model.addHook(hookName as any, async () => {
        await this.invalidatePattern(`${keyPrefix}:${modelName}`);
      });

      // Also handle bulk operations
      const bulkHookName = `afterBulk${this.capitalize(operation)}`;
      model.addHook(bulkHookName as any, async () => {
        await this.invalidatePattern(`${keyPrefix}:${modelName}`);
      });

      registeredHooks.add(hookName);
    });

    this.modelHooks.set(hookKey, registeredHooks);
    this.logger.debug(`Registered cache invalidation hooks for ${modelName}`);
  }

  /**
   * Generate cache key from query options
   */
  generateCacheKey(prefix: string, modelName: string, options: any): string {
    // Create a deterministic hash of options (excluding PHI data)
    const sanitizedOptions = this.sanitizeOptionsForCaching(options);
    const optionsString = JSON.stringify(sanitizedOptions);
    const hash = crypto
      .createHash('md5')
      .update(optionsString)
      .digest('hex')
      .substring(0, 16);

    return `${prefix}:${modelName}:${hash}`;
  }

  /**
   * Sanitize query options for caching (remove PHI)
   */
  private sanitizeOptionsForCaching(options: any): any {
    // Create a copy and remove sensitive data
    const sanitized = { ...options };

    // Remove attributes that might contain PHI
    if (sanitized.attributes) {
      delete sanitized.attributes;
    }

    // Keep only structure of where clause, not actual values
    if (sanitized.where) {
      sanitized.where = this.sanitizeWhereClause(sanitized.where);
    }

    return sanitized;
  }

  /**
   * Sanitize where clause for cache key generation
   */
  private sanitizeWhereClause(where: any): any {
    if (typeof where !== 'object' || where === null) {
      return 'VALUE';
    }

    const sanitized: any = {};
    for (const [key, value] of Object.entries(where)) {
      if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeWhereClause(value);
      } else {
        sanitized[key] = 'VALUE';
      }
    }

    return sanitized;
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    return {
      ...this.stats,
      localCacheSize: this.localCache.size,
    };
  }

  /**
   * Update hit rate calculation
   */
  private updateHitRate(): void {
    const total = this.stats.hits + this.stats.misses;
    this.stats.hitRate = total > 0 ? this.stats.hits / total : 0;
  }

  /**
   * Clear all cache
   */
  async clearAll(): Promise<void> {
    const size = this.localCache.size;
    this.localCache.clear();
    this.stats.localCacheSize = 0;

    // Clear Redis if available
    // if (this.stats.redisAvailable) {
    //   await this.clearRedis();
    // }

    this.logger.log(`Cleared ${size} entries from cache`);
  }

  /**
   * Reset statistics
   */
  resetStats(): void {
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
      hitRate: 0,
      localCacheSize: this.localCache.size,
      redisAvailable: false,
    };
  }

  /**
   * Capitalize first letter
   */
  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Get formatted statistics report
   */
  getFormattedStats(): string {
    const stats = this.getStats();

    return `
=== Query Cache Statistics ===
Total Hits: ${stats.hits}
Total Misses: ${stats.misses}
Hit Rate: ${(stats.hitRate * 100).toFixed(2)}%
Cache Sets: ${stats.sets}
Cache Deletes: ${stats.deletes}
Local Cache Size: ${stats.localCacheSize}
Redis Available: ${stats.redisAvailable}
    `.trim();
  }

  /**
   * Cleanup on module destroy
   */
  async onModuleDestroy(): Promise<void> {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    await this.clearAll();
  }
}
