/**
 * @fileoverview Cache Storage Service
 * @module infrastructure/cache/storage
 * @description Manages L1 (memory) and L2 (Redis) cache storage operations
 *
 * Responsibilities:
 * - L1 cache get/set/delete operations with TTL
 * - L2 Redis cache get/set/delete operations
 * - L1 cache eviction (LRU)
 * - L1 cache cleanup for expired entries
 * - Memory usage tracking
 */

import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CacheConfigService } from './cache.config';
import { CacheConnectionService } from './cache-connection.service';
import { CacheSerializationService } from './cache-serialization.service';
import type { CacheOptions } from './cache.interfaces';
import { CacheEvent } from './cache.interfaces';
import { Cleanup, MemorySensitive } from '@/discovery/modules';

import { BaseService } from '@/common/base';
/**
 * L1 (memory) cache entry structure
 */
interface L1Entry<T = any> {
  data: T;
  expiresAt: number;
  compressed: boolean;
  size: number;
}

/**
 * Service responsible for cache storage operations across L1 and L2 tiers
 */
@Injectable()
export class CacheStorageService extends BaseService {
  private l1Cache: Map<string, L1Entry> = new Map();
  private l1CleanupInterval?: NodeJS.Timeout;

  constructor(
    private readonly cacheConfig: CacheConfigService,
    private readonly connectionService: CacheConnectionService,
    private readonly serializationService: CacheSerializationService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Start L1 cache cleanup interval
   */
  startCleanup(): void {
    if (!this.cacheConfig.isL1CacheEnabled()) {
      return;
    }

    this.l1CleanupInterval = setInterval(() => {
      this.cleanupL1();
    }, 60000); // Every minute
  }

  /**
   * Stop L1 cache cleanup interval
   */
  stopCleanup(): void {
    if (this.l1CleanupInterval) {
      clearInterval(this.l1CleanupInterval);
      this.l1CleanupInterval = undefined;
    }
  }

  /**
   * Clear all cache entries from L1 and L2
   */
  async clearAll(): Promise<void> {
    this.l1Cache.clear();

    const redis = this.connectionService.getClient();
    if (redis) {
      const pattern = `${this.cacheConfig.getKeyPrefix()}:*`;
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    }

    this.logWarning('All cache cleared');
  }

  /**
   * Get L1 cache size
   */
  getL1Size(): number {
    return this.l1Cache.size;
  }

  /**
   * Get L1 memory usage in bytes
   */
  getL1MemoryUsage(): number {
    let memoryUsage = 0;
    for (const entry of this.l1Cache.values()) {
      memoryUsage += entry.size;
    }
    return memoryUsage;
  }

  /**
   * Get value from L1 cache
   *
   * @param key - Full cache key
   * @returns Cached value or null if not found/expired
   */
  getFromL1<T>(key: string): T | null {
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
   * Set value in L1 cache with automatic eviction
   *
   * @param key - Full cache key
   * @param value - Value to cache
   * @param options - Cache options
   */
  @MemorySensitive(50)
  setToL1<T>(key: string, value: T, options: CacheOptions): void {
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
      size: this.serializationService.estimateSize(value),
    };

    this.l1Cache.set(key, entry);
  }

  /**
   * Delete value from L1 cache
   *
   * @param key - Full cache key
   * @returns True if key existed and was deleted
   */
  deleteFromL1(key: string): boolean {
    return this.l1Cache.delete(key);
  }

  /**
   * Check if key exists in L1 cache and is not expired
   *
   * @param key - Full cache key
   * @returns True if key exists and is valid
   */
  hasInL1(key: string): boolean {
    const entry = this.l1Cache.get(key);
    if (!entry) {
      return false;
    }

    if (entry.expiresAt <= Date.now()) {
      this.l1Cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Get value from L2 (Redis) cache
   *
   * @param key - Full cache key
   * @returns Cached value or null if not found
   */
  async getFromL2<T>(key: string): Promise<T | null> {
    const redis = this.connectionService.getClient();
    if (!redis) {
      return null;
    }

    try {
      const value = await redis.get(key);
      if (!value) {
        return null;
      }

      return await this.serializationService.deserialize<T>(value);
    } catch (error) {
      this.logError(`L2 cache get error for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Set value in L2 (Redis) cache
   *
   * @param key - Full cache key
   * @param value - Value to cache
   * @param options - Cache options
   * @throws Error if Redis is not connected
   */
  async setToL2<T>(key: string, value: T, options: CacheOptions): Promise<void> {
    const redis = this.connectionService.getClient();
    if (!redis) {
      const error = new Error(`Redis not connected - cannot set key in L2 cache: ${key}`);
      this.logWarning(error.message, {
        key,
        redisStatus: 'disconnected',
        fallback: 'L1 cache only',
      });
      throw error;
    }

    const ttl = options.ttl || this.cacheConfig.getDefaultTTL();
    const serialized = await this.serializationService.serialize(value, options);

    await redis.setex(key, ttl, serialized);
  }

  /**
   * Delete value from L2 (Redis) cache
   *
   * @param key - Full cache key
   * @returns True if key was deleted
   */
  async deleteFromL2(key: string): Promise<boolean> {
    const redis = this.connectionService.getClient();
    if (!redis) {
      return false;
    }

    try {
      await redis.del(key);
      return true;
    } catch (error) {
      this.logError(`L2 cache delete error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Check if key exists in L2 (Redis) cache
   *
   * @param key - Full cache key
   * @returns True if key exists
   */
  async hasInL2(key: string): Promise<boolean> {
    const redis = this.connectionService.getClient();
    if (!redis) {
      return false;
    }

    try {
      const exists = await redis.exists(key);
      return exists === 1;
    } catch (error) {
      this.logError(`L2 cache has error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Get all keys from L1 cache
   */
  getL1Keys(): string[] {
    return Array.from(this.l1Cache.keys());
  }

  /**
   * Get keys matching pattern from L2 (Redis) cache
   *
   * @param pattern - Key pattern (supports wildcards)
   * @returns Array of matching keys
   */
  async getL2KeysByPattern(pattern: string): Promise<string[]> {
    const redis = this.connectionService.getClient();
    if (!redis) {
      return [];
    }

    try {
      return await redis.keys(pattern);
    } catch (error) {
      this.logError(`L2 cache keys error for pattern ${pattern}:`, error);
      return [];
    }
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
      this.logDebug(`L1 cache cleanup: removed ${removed} expired entries`);
    }
  }

  /**
   * Emit cache event
   * @private
   */
  private emitEvent(event: CacheEvent, key: string, metadata?: Record<string, any>): void {
    this.eventEmitter.emit(event, {
      event,
      key,
      timestamp: Date.now(),
      metadata,
    });
  }
}
