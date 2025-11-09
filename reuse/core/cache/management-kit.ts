/**
 * @fileoverview Cache Management Kit
 * @module core/cache/management-kit
 *
 * Comprehensive cache management utilities including lifecycle management,
 * eviction policies, cache invalidation, and monitoring.
 *
 * @example Basic cache manager
 * ```typescript
 * const manager = new CacheManagementKit({
 *   maxSize: 1000,
 *   evictionPolicy: 'lru',
 *   ttl: 3600000
 * });
 *
 * await manager.set('key', 'value');
 * const value = await manager.get('key');
 * ```
 */

import type { CacheStorage } from './strategies';
import { CacheMetrics } from './performance';

/**
 * Cache management configuration
 */
export interface CacheManagementConfig {
  /** Maximum number of items in cache */
  maxSize?: number;
  /** Default TTL in milliseconds */
  ttl?: number;
  /** Eviction policy */
  evictionPolicy?: 'lru' | 'lfu' | 'fifo' | 'ttl';
  /** Enable metrics tracking */
  enableMetrics?: boolean;
  /** Cleanup interval in milliseconds */
  cleanupInterval?: number;
}

/**
 * Cache entry metadata
 */
interface CacheEntry<T> {
  value: T;
  expiry: number | null;
  accessCount: number;
  lastAccess: number;
  createdAt: number;
}

/**
 * Cache Management Kit
 *
 * Provides comprehensive cache management with eviction policies,
 * metrics tracking, and lifecycle management.
 */
export default class CacheManagementKit<T = any> {
  private cache: Map<string, CacheEntry<T>> = new Map();
  private config: Required<CacheManagementConfig>;
  private metrics: CacheMetrics;
  private cleanupTimer: NodeJS.Timeout | null = null;

  constructor(config: CacheManagementConfig = {}) {
    this.config = {
      maxSize: 1000,
      ttl: 3600000, // 1 hour
      evictionPolicy: 'lru',
      enableMetrics: true,
      cleanupInterval: 60000, // 1 minute
      ...config,
    };

    this.metrics = new CacheMetrics();
    this.startCleanup();
  }

  /**
   * Start periodic cleanup
   */
  private startCleanup(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }

    this.cleanupTimer = setInterval(() => {
      this.cleanExpired();
    }, this.config.cleanupInterval);
  }

  /**
   * Get value from cache
   */
  async get(key: string): Promise<T | null> {
    const start = Date.now();

    try {
      const entry = this.cache.get(key);

      if (!entry) {
        if (this.config.enableMetrics) {
          this.metrics.recordMiss('default', Date.now() - start);
        }
        return null;
      }

      // Check expiry
      if (entry.expiry !== null && entry.expiry < Date.now()) {
        this.cache.delete(key);
        if (this.config.enableMetrics) {
          this.metrics.recordMiss('default', Date.now() - start);
        }
        return null;
      }

      // Update access metadata
      entry.accessCount++;
      entry.lastAccess = Date.now();

      if (this.config.enableMetrics) {
        this.metrics.recordHit('default', Date.now() - start);
      }

      return entry.value;
    } catch (error) {
      if (this.config.enableMetrics) {
        this.metrics.recordError('default');
      }
      throw error;
    }
  }

  /**
   * Set value in cache
   */
  async set(key: string, value: T, ttl?: number): Promise<void> {
    const start = Date.now();

    try {
      // Check if we need to evict
      if (this.cache.size >= this.config.maxSize && !this.cache.has(key)) {
        this.evict();
      }

      const effectiveTtl = ttl !== undefined ? ttl : this.config.ttl;
      const expiry = effectiveTtl > 0 ? Date.now() + effectiveTtl : null;

      const entry: CacheEntry<T> = {
        value,
        expiry,
        accessCount: 0,
        lastAccess: Date.now(),
        createdAt: Date.now(),
      };

      this.cache.set(key, entry);

      if (this.config.enableMetrics) {
        this.metrics.recordSet('default', Date.now() - start);
      }
    } catch (error) {
      if (this.config.enableMetrics) {
        this.metrics.recordError('default');
      }
      throw error;
    }
  }

  /**
   * Delete value from cache
   */
  async delete(key: string): Promise<boolean> {
    const start = Date.now();

    try {
      const deleted = this.cache.delete(key);

      if (this.config.enableMetrics && deleted) {
        this.metrics.recordDelete('default', Date.now() - start);
      }

      return deleted;
    } catch (error) {
      if (this.config.enableMetrics) {
        this.metrics.recordError('default');
      }
      throw error;
    }
  }

  /**
   * Check if key exists
   */
  async has(key: string): Promise<boolean> {
    const entry = this.cache.get(key);

    if (!entry) {
      return false;
    }

    // Check expiry
    if (entry.expiry !== null && entry.expiry < Date.now()) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Clear all cache entries
   */
  async clear(): Promise<void> {
    this.cache.clear();
    if (this.config.enableMetrics) {
      this.metrics.reset('default');
    }
  }

  /**
   * Get all keys
   */
  async keys(pattern?: string): Promise<string[]> {
    const allKeys = Array.from(this.cache.keys());

    if (!pattern || pattern === '*') {
      return allKeys;
    }

    // Simple pattern matching
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    return allKeys.filter(key => regex.test(key));
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Evict entry based on policy
   */
  private evict(): void {
    if (this.cache.size === 0) {
      return;
    }

    let keyToEvict: string | null = null;

    switch (this.config.evictionPolicy) {
      case 'lru':
        keyToEvict = this.evictLRU();
        break;
      case 'lfu':
        keyToEvict = this.evictLFU();
        break;
      case 'fifo':
        keyToEvict = this.evictFIFO();
        break;
      case 'ttl':
        keyToEvict = this.evictTTL();
        break;
    }

    if (keyToEvict) {
      this.cache.delete(keyToEvict);
    }
  }

  /**
   * Evict least recently used entry
   */
  private evictLRU(): string | null {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccess < oldestTime) {
        oldestTime = entry.lastAccess;
        oldestKey = key;
      }
    }

    return oldestKey;
  }

  /**
   * Evict least frequently used entry
   */
  private evictLFU(): string | null {
    let leastUsedKey: string | null = null;
    let leastCount = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.accessCount < leastCount) {
        leastCount = entry.accessCount;
        leastUsedKey = key;
      }
    }

    return leastUsedKey;
  }

  /**
   * Evict first in first out entry
   */
  private evictFIFO(): string | null {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.createdAt < oldestTime) {
        oldestTime = entry.createdAt;
        oldestKey = key;
      }
    }

    return oldestKey;
  }

  /**
   * Evict entry with shortest TTL
   */
  private evictTTL(): string | null {
    let shortestTTLKey: string | null = null;
    let shortestExpiry = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiry !== null && entry.expiry < shortestExpiry) {
        shortestExpiry = entry.expiry;
        shortestTTLKey = key;
      }
    }

    // If no entries with TTL, fall back to LRU
    return shortestTTLKey || this.evictLRU();
  }

  /**
   * Clean expired entries
   */
  private cleanExpired(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiry !== null && entry.expiry < now) {
        keysToDelete.push(key);
      }
    }

    for (const key of keysToDelete) {
      this.cache.delete(key);
    }
  }

  /**
   * Get cache metrics
   */
  getMetrics() {
    return this.metrics.getStats('default');
  }

  /**
   * Reset metrics
   */
  resetMetrics(): void {
    this.metrics.reset('default');
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    size: number;
    maxSize: number;
    hitRate: number;
    missRate: number;
    evictionPolicy: string;
  } {
    const metrics = this.getMetrics();
    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      hitRate: metrics.hitRate,
      missRate: metrics.missRate,
      evictionPolicy: this.config.evictionPolicy,
    };
  }

  /**
   * Invalidate cache entries matching pattern
   */
  async invalidate(pattern: string): Promise<number> {
    const keys = await this.keys(pattern);
    let count = 0;

    for (const key of keys) {
      if (await this.delete(key)) {
        count++;
      }
    }

    return count;
  }

  /**
   * Get or set pattern
   */
  async getOrSet(
    key: string,
    loader: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cached = await this.get(key);

    if (cached !== null) {
      return cached;
    }

    const value = await loader();
    await this.set(key, value, ttl);
    return value;
  }

  /**
   * Batch get operation
   */
  async getMany(keys: string[]): Promise<Map<string, T>> {
    const results = new Map<string, T>();

    for (const key of keys) {
      const value = await this.get(key);
      if (value !== null) {
        results.set(key, value);
      }
    }

    return results;
  }

  /**
   * Batch set operation
   */
  async setMany(entries: Map<string, T>, ttl?: number): Promise<void> {
    const promises: Promise<void>[] = [];

    for (const [key, value] of entries.entries()) {
      promises.push(this.set(key, value, ttl));
    }

    await Promise.all(promises);
  }

  /**
   * Batch delete operation
   */
  async deleteMany(keys: string[]): Promise<number> {
    let deleted = 0;

    for (const key of keys) {
      if (await this.delete(key)) {
        deleted++;
      }
    }

    return deleted;
  }

  /**
   * Refresh cache entry TTL
   */
  async touch(key: string, ttl?: number): Promise<boolean> {
    const entry = this.cache.get(key);

    if (!entry) {
      return false;
    }

    const effectiveTtl = ttl !== undefined ? ttl : this.config.ttl;
    entry.expiry = effectiveTtl > 0 ? Date.now() + effectiveTtl : null;
    entry.lastAccess = Date.now();

    return true;
  }

  /**
   * Get remaining TTL for a key
   */
  async getTTL(key: string): Promise<number> {
    const entry = this.cache.get(key);

    if (!entry) {
      return -2; // Key doesn't exist
    }

    if (entry.expiry === null) {
      return -1; // No expiry
    }

    const remaining = entry.expiry - Date.now();
    return remaining > 0 ? remaining : -2;
  }

  /**
   * Stop cleanup timer and cleanup
   */
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    this.cache.clear();
  }
}

/**
 * Create cache manager instance
 */
export function createCacheManager<T = any>(
  config?: CacheManagementConfig
): CacheManagementKit<T> {
  return new CacheManagementKit<T>(config);
}

/**
 * Cache invalidation utilities
 */
export class CacheInvalidator {
  private patterns: Map<string, Set<string>> = new Map();

  /**
   * Register a pattern for a tag
   */
  registerTag(tag: string, pattern: string): void {
    if (!this.patterns.has(tag)) {
      this.patterns.set(tag, new Set());
    }
    this.patterns.get(tag)!.add(pattern);
  }

  /**
   * Invalidate by tag
   */
  async invalidateByTag(
    tag: string,
    cache: CacheManagementKit
  ): Promise<number> {
    const patterns = this.patterns.get(tag);
    if (!patterns) {
      return 0;
    }

    let totalInvalidated = 0;

    for (const pattern of patterns) {
      const count = await cache.invalidate(pattern);
      totalInvalidated += count;
    }

    return totalInvalidated;
  }

  /**
   * Invalidate multiple tags
   */
  async invalidateTags(
    tags: string[],
    cache: CacheManagementKit
  ): Promise<number> {
    let total = 0;

    for (const tag of tags) {
      const count = await this.invalidateByTag(tag, cache);
      total += count;
    }

    return total;
  }

  /**
   * Clear all patterns for a tag
   */
  clearTag(tag: string): void {
    this.patterns.delete(tag);
  }

  /**
   * Clear all tags
   */
  clearAll(): void {
    this.patterns.clear();
  }
}

export { CacheManagementKit };
