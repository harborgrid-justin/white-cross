/**
 * LOC: CACHE001
 * File: cache-managers.ts
 * Purpose: Enterprise multi-tier caching with L1 (LRU) + L2 (Redis) and intelligent invalidation
 *
 * PERFORMANCE TARGETS:
 * - Cache hit rate: >75%
 * - L1 hit latency: <1ms
 * - L2 hit latency: <10ms
 * - Compression for values >100KB
 */

import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { Sequelize, Model, ModelStatic, FindOptions, WhereOptions } from "sequelize";
import { LRUCache } from "lru-cache";
import * as zlib from "zlib";
import { promisify } from "util";

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface CacheConfig {
  ttl: number; // Time to live in seconds
  key: string;
  tags?: string[];
  compress?: boolean;
}

export interface CacheStatistics {
  l1Hits: number;
  l1Misses: number;
  l2Hits: number;
  l2Misses: number;
  totalHits: number;
  totalMisses: number;
  hitRate: number;
  l1Size: number;
  l2Size: number;
  evictions: number;
  compressionSaved: number;
  averageGetLatency: number;
}

export interface CacheHealthReport {
  healthy: boolean;
  l1Operational: boolean;
  l2Operational: boolean;
  hitRate: number;
  warnings: string[];
  recommendations: string[];
}

export interface WarmupQuery {
  model: ModelStatic<any>;
  where: WhereOptions;
  cacheKey: string;
  ttl?: number;
}

interface CacheEntry {
  data: any;
  compressed: boolean;
  tags: string[];
  createdAt: number;
  hits: number;
  size: number;
}

// ============================================================================
// REDIS CLIENT INTERFACE (for future implementation)
// ============================================================================

/**
 * Redis client interface - can be swapped with real Redis client
 */
export interface IRedisClient {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, options?: { EX?: number }): Promise<void>;
  del(key: string): Promise<void>;
  keys(pattern: string): Promise<string[]>;
  ping(): Promise<string>;
  exists(key: string): Promise<number>;
  ttl(key: string): Promise<number>;
}

/**
 * Mock Redis client for development/testing
 */
class MockRedisClient implements IRedisClient {
  private store: Map<string, { value: string; expiry: number }> = new Map();

  async get(key: string): Promise<string | null> {
    const entry = this.store.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiry) {
      this.store.delete(key);
      return null;
    }

    return entry.value;
  }

  async set(key: string, value: string, options?: { EX?: number }): Promise<void> {
    const expiry = options?.EX
      ? Date.now() + options.EX * 1000
      : Date.now() + 3600000; // 1 hour default

    this.store.set(key, { value, expiry });
  }

  async del(key: string): Promise<void> {
    this.store.delete(key);
  }

  async keys(pattern: string): Promise<string[]> {
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    return Array.from(this.store.keys()).filter(key => regex.test(key));
  }

  async ping(): Promise<string> {
    return "PONG";
  }

  async exists(key: string): Promise<number> {
    return this.store.has(key) ? 1 : 0;
  }

  async ttl(key: string): Promise<number> {
    const entry = this.store.get(key);
    if (!entry) return -2;

    const remaining = Math.floor((entry.expiry - Date.now()) / 1000);
    return remaining > 0 ? remaining : -1;
  }
}

// ============================================================================
// ENHANCED CACHE MANAGER SERVICE
// ============================================================================

@Injectable()
export class EnhancedCacheManagerService implements OnModuleInit {
  private readonly logger = new Logger(EnhancedCacheManagerService.name);

  // TIER 1: In-Memory LRU Cache (fast, local, limited size)
  private l1Cache: LRUCache<string, CacheEntry>;

  // TIER 2: Redis Distributed Cache (shared, persistent, larger)
  private l2Cache: IRedisClient;

  // Tag-based invalidation tracking
  private tagIndex: Map<string, Set<string>> = new Map();

  // Statistics tracking
  private stats = {
    l1Hits: 0,
    l1Misses: 0,
    l2Hits: 0,
    l2Misses: 0,
    evictions: 0,
    compressionSaved: 0,
    totalGetTime: 0,
    totalGets: 0,
  };

  constructor() {
    // Initialize L1 Cache (1000 items, 1 minute TTL)
    this.l1Cache = new LRUCache<string, CacheEntry>({
      max: 1000,
      ttl: 60000, // 1 minute
      updateAgeOnGet: true,
      dispose: (value, key) => {
        this.stats.evictions++;
        this.cleanupTagIndex(key, value.tags);
      },
    });

    // Initialize L2 Cache (Redis or Mock)
    this.l2Cache = this.createRedisClient();
  }

  async onModuleInit() {
    this.logger.log("🚀 Enhanced Cache Manager initialized");
    await this.verifyRedisConnection();
  }

  // ============================================================================
  // CORE CACHE OPERATIONS
  // ============================================================================

  /**
   * Get value from cache (L1 -> L2 fallback)
   */
  async get<T = any>(key: string): Promise<T | null> {
    const startTime = Date.now();

    try {
      // Try L1 Cache first
      const l1Entry = this.l1Cache.get(key);
      if (l1Entry) {
        this.stats.l1Hits++;
        l1Entry.hits++;
        this.recordGetLatency(Date.now() - startTime);

        return l1Entry.compressed
          ? await this.decompress(l1Entry.data)
          : l1Entry.data;
      }

      this.stats.l1Misses++;

      // Try L2 Cache (Redis)
      const l2Value = await this.l2Cache.get(key);
      if (l2Value) {
        this.stats.l2Hits++;

        const entry: CacheEntry = JSON.parse(l2Value);

        // Promote to L1
        this.l1Cache.set(key, entry);

        this.recordGetLatency(Date.now() - startTime);

        return entry.compressed
          ? await this.decompress(entry.data)
          : entry.data;
      }

      this.stats.l2Misses++;
      this.recordGetLatency(Date.now() - startTime);

      return null;
    } catch (error) {
      this.logger.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Set value in cache (both L1 and L2)
   */
  async set(key: string, value: any, ttl: number = 300): Promise<void> {
    try {
      const shouldCompress = this.shouldCompress(value);
      const dataToStore = shouldCompress ? await this.compress(value) : value;
      const size = this.estimateSize(dataToStore);

      if (shouldCompress) {
        const originalSize = this.estimateSize(value);
        this.stats.compressionSaved += (originalSize - size);
      }

      const entry: CacheEntry = {
        data: dataToStore,
        compressed: shouldCompress,
        tags: [],
        createdAt: Date.now(),
        hits: 0,
        size,
      };

      // Store in L1
      this.l1Cache.set(key, entry);

      // Store in L2 (Redis)
      await this.l2Cache.set(key, JSON.stringify(entry), { EX: ttl });

      this.logger.debug(`Cached key: ${key} (compressed: ${shouldCompress}, size: ${size} bytes, ttl: ${ttl}s)`);
    } catch (error) {
      this.logger.error(`Cache set error for key ${key}:`, error);
    }
  }

  /**
   * Set value with tags for invalidation
   */
  async setWithTags(key: string, value: any, tags: string[], ttl: number = 300): Promise<void> {
    try {
      const shouldCompress = this.shouldCompress(value);
      const dataToStore = shouldCompress ? await this.compress(value) : value;
      const size = this.estimateSize(dataToStore);

      const entry: CacheEntry = {
        data: dataToStore,
        compressed: shouldCompress,
        tags,
        createdAt: Date.now(),
        hits: 0,
        size,
      };

      // Update tag index
      for (const tag of tags) {
        if (!this.tagIndex.has(tag)) {
          this.tagIndex.set(tag, new Set());
        }
        this.tagIndex.get(tag)!.add(key);
      }

      // Store in both caches
      this.l1Cache.set(key, entry);
      await this.l2Cache.set(key, JSON.stringify(entry), { EX: ttl });

      this.logger.debug(`Cached key: ${key} with tags: ${tags.join(', ')}`);
    } catch (error) {
      this.logger.error(`Cache setWithTags error for key ${key}:`, error);
    }
  }

  /**
   * Delete specific key from cache
   */
  async delete(key: string): Promise<void> {
    try {
      const entry = this.l1Cache.get(key);
      if (entry) {
        this.cleanupTagIndex(key, entry.tags);
      }

      this.l1Cache.delete(key);
      await this.l2Cache.del(key);

      this.logger.debug(`Deleted cache key: ${key}`);
    } catch (error) {
      this.logger.error(`Cache delete error for key ${key}:`, error);
    }
  }

  /**
   * Invalidate keys matching pattern
   */
  async invalidate(pattern: string): Promise<void> {
    try {
      const keysToDelete: string[] = [];

      // Find matching keys in L1
      for (const key of this.l1Cache.keys()) {
        if (this.matchPattern(key, pattern)) {
          keysToDelete.push(key);
        }
      }

      // Find matching keys in L2
      const l2Keys = await this.l2Cache.keys(pattern);
      keysToDelete.push(...l2Keys);

      // Delete all matching keys
      const uniqueKeys = [...new Set(keysToDelete)];
      for (const key of uniqueKeys) {
        await this.delete(key);
      }

      this.logger.log(`Invalidated ${uniqueKeys.length} keys matching pattern: ${pattern}`);
    } catch (error) {
      this.logger.error(`Cache invalidate error for pattern ${pattern}:`, error);
    }
  }

  /**
   * Invalidate all keys associated with a tag
   */
  async invalidateByTag(tag: string): Promise<void> {
    try {
      const keys = this.tagIndex.get(tag);
      if (!keys || keys.size === 0) {
        this.logger.debug(`No keys found for tag: ${tag}`);
        return;
      }

      const keyArray = Array.from(keys);
      for (const key of keyArray) {
        await this.delete(key);
      }

      this.tagIndex.delete(tag);

      this.logger.log(`Invalidated ${keyArray.length} keys for tag: ${tag}`);
    } catch (error) {
      this.logger.error(`Cache invalidateByTag error for tag ${tag}:`, error);
    }
  }

  /**
   * Clear all caches
   */
  async clear(): Promise<void> {
    this.l1Cache.clear();
    this.tagIndex.clear();
    // Note: Full Redis flush should be done carefully in production
    this.logger.warn("Cache cleared (L1 only - L2/Redis not flushed for safety)");
  }

  // ============================================================================
  // CACHE WARMING
  // ============================================================================

  /**
   * Warm cache with frequently accessed queries
   */
  async warmCache(queries: WarmupQuery[]): Promise<void> {
    this.logger.log(`Starting cache warmup with ${queries.length} queries...`);

    let warmed = 0;
    let failed = 0;

    for (const query of queries) {
      try {
        const results = await query.model.findAll({ where: query.where });
        await this.set(query.cacheKey, results, query.ttl || 600);
        warmed++;
      } catch (error) {
        this.logger.error(`Cache warmup failed for ${query.cacheKey}:`, error);
        failed++;
      }
    }

    this.logger.log(`Cache warmup complete: ${warmed} succeeded, ${failed} failed`);
  }

  // ============================================================================
  // STATISTICS & MONITORING
  // ============================================================================

  /**
   * Get comprehensive cache statistics
   */
  getCacheStatistics(): CacheStatistics {
    const totalHits = this.stats.l1Hits + this.stats.l2Hits;
    const totalMisses = this.stats.l1Misses + this.stats.l2Misses;
    const totalRequests = totalHits + totalMisses;

    return {
      l1Hits: this.stats.l1Hits,
      l1Misses: this.stats.l1Misses,
      l2Hits: this.stats.l2Hits,
      l2Misses: this.stats.l2Misses,
      totalHits,
      totalMisses,
      hitRate: totalRequests > 0 ? (totalHits / totalRequests) * 100 : 0,
      l1Size: this.l1Cache.size,
      l2Size: 0, // Would need Redis DBSIZE command
      evictions: this.stats.evictions,
      compressionSaved: this.stats.compressionSaved,
      averageGetLatency: this.stats.totalGets > 0
        ? this.stats.totalGetTime / this.stats.totalGets
        : 0,
    };
  }

  /**
   * Get cache hit rate percentage
   */
  getHitRate(): number {
    const stats = this.getCacheStatistics();
    return stats.hitRate;
  }

  /**
   * Get current cache size
   */
  getSize(): number {
    return this.l1Cache.size;
  }

  /**
   * Get memory usage estimate
   */
  getMemoryUsage(): number {
    let total = 0;
    for (const entry of this.l1Cache.values()) {
      total += entry.size;
    }
    return total;
  }

  /**
   * Check cache health
   */
  async checkCacheHealth(): Promise<CacheHealthReport> {
    const stats = this.getCacheStatistics();
    const warnings: string[] = [];
    const recommendations: string[] = [];

    // Check L1 health
    const l1Operational = this.l1Cache.size >= 0;

    // Check L2 health
    let l2Operational = false;
    try {
      await this.l2Cache.ping();
      l2Operational = true;
    } catch (error) {
      warnings.push("L2 cache (Redis) is not responding");
    }

    // Check hit rate
    if (stats.hitRate < 50) {
      warnings.push(`Low cache hit rate: ${stats.hitRate.toFixed(2)}%`);
      recommendations.push("Consider increasing cache TTL or warming critical queries");
    }

    // Check eviction rate
    const evictionRate = stats.evictions / (stats.totalHits + stats.totalMisses);
    if (evictionRate > 0.1) {
      warnings.push(`High eviction rate: ${(evictionRate * 100).toFixed(2)}%`);
      recommendations.push("Consider increasing L1 cache size (max entries)");
    }

    return {
      healthy: l1Operational && l2Operational && stats.hitRate >= 50,
      l1Operational,
      l2Operational,
      hitRate: stats.hitRate,
      warnings,
      recommendations,
    };
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  private createRedisClient(): IRedisClient {
    // In production, use real Redis client:
    // return new Redis({
    //   host: process.env.REDIS_HOST || 'localhost',
    //   port: parseInt(process.env.REDIS_PORT || '6379'),
    //   password: process.env.REDIS_PASSWORD,
    //   retryStrategy: (times) => Math.min(times * 50, 2000),
    // });

    // For now, use mock client
    this.logger.warn("Using MockRedisClient - replace with real Redis in production");
    return new MockRedisClient();
  }

  private async verifyRedisConnection(): Promise<void> {
    try {
      const response = await this.l2Cache.ping();
      this.logger.log(`L2 Cache (Redis) connected: ${response}`);
    } catch (error) {
      this.logger.error("L2 Cache (Redis) connection failed:", error);
    }
  }

  private shouldCompress(value: any): boolean {
    const size = this.estimateSize(value);
    return size > 100 * 1024; // Compress values > 100KB
  }

  private async compress(data: any): Promise<Buffer> {
    const json = JSON.stringify(data);
    return gzip(json);
  }

  private async decompress(data: Buffer): Promise<any> {
    const json = await gunzip(data);
    return JSON.parse(json.toString());
  }

  private estimateSize(value: any): number {
    if (Buffer.isBuffer(value)) {
      return value.length;
    }
    return Buffer.byteLength(JSON.stringify(value));
  }

  private matchPattern(key: string, pattern: string): boolean {
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    return regex.test(key);
  }

  private cleanupTagIndex(key: string, tags: string[]): void {
    for (const tag of tags) {
      const keys = this.tagIndex.get(tag);
      if (keys) {
        keys.delete(key);
        if (keys.size === 0) {
          this.tagIndex.delete(tag);
        }
      }
    }
  }

  private recordGetLatency(latency: number): void {
    this.stats.totalGetTime += latency;
    this.stats.totalGets++;
  }
}

// ============================================================================
// LEGACY COMPATIBILITY
// ============================================================================

/**
 * Legacy CacheManagerService for backward compatibility
 */
@Injectable()
export class CacheManagerService {
  constructor(private readonly enhancedCache: EnhancedCacheManagerService) {}

  async getCached(model: string, filters: any, strategy: any = "SHORT_TERM"): Promise<any> {
    const cacheKey = `${model}:${JSON.stringify(filters)}`;
    const ttl = strategy === "LONG_TERM" ? 3600 : 300;

    const cached = await this.enhancedCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    // In legacy mode, return null - caller should fetch and cache
    return null;
  }
}

export { EnhancedCacheManagerService };
