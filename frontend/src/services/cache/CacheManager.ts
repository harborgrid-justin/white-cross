/**
 * @fileoverview Enterprise-grade in-memory cache manager with LRU eviction and HIPAA compliance
 * @module services/cache/CacheManager
 * @category Services
 *
 * Advanced in-memory caching system providing:
 * - LRU (Least Recently Used) eviction policy with configurable max size
 * - TTL-based expiration for automatic cleanup
 * - Tag-based invalidation for granular cache control
 * - Memory usage tracking and management
 * - Performance monitoring with hit/miss rates
 * - Event system for cache operation observation
 * - HIPAA compliance - PHI data flagging and handling
 *
 * @example
 * ```typescript
 * const manager = getCacheManager();
 *
 * // Cache data with TTL
 * manager.set('user:123', userData, { ttl: 300000, tags: ['users'] });
 *
 * // Retrieve cached data
 * const cached = manager.get('user:123');
 *
 * // Invalidate by tag
 * manager.invalidateByTags(['users']);
 * ```
 */

import type {
  CacheEntry,
  CacheConfig,
  CacheStats,
  InvalidationOptions,
  CacheEventListener
} from './types';
import { CacheEventType } from './types';
import { CACHE_CONFIG, PERFORMANCE_CONFIG } from './cacheConfig';
import {
  MemoryEstimator,
  LRUEvictionPolicy,
  TagIndexManager,
  CacheEventEmitter,
  CacheStatistics,
  PerformanceMonitor
} from './core';

/**
 * Cache Manager Implementation
 *
 * @class
 * @classdesc Enterprise cache manager providing LRU-based in-memory caching
 * with TTL expiration, tag-based invalidation, and performance tracking.
 * Designed for healthcare applications with HIPAA compliance considerations.
 *
 * Performance Characteristics:
 * - O(1) get/set operations
 * - O(n) tag-based invalidation (n = number of cached items)
 * - O(1) LRU eviction when max size reached
 *
 * Memory Management:
 * - Tracks approximate memory usage per entry
 * - Automatic eviction when max size exceeded
 * - Configurable size limits
 *
 * @example
 * ```typescript
 * // Create with custom config
 * const cache = new CacheManager({
 *   maxSize: 200,
 *   defaultTTL: 600000
 * });
 *
 * // Listen to cache events
 * cache.on('evict', (event) => {
 *   console.log('Evicted:', event.key);
 * });
 * ```
 */
export class CacheManager {
  private cache: Map<string, CacheEntry> = new Map();
  private config: CacheConfig;
  private memoryUsage = 0;

  // Composed modules
  private memoryEstimator: MemoryEstimator;
  private evictionPolicy: LRUEvictionPolicy;
  private tagIndexManager: TagIndexManager;
  private eventEmitter: CacheEventEmitter;
  private statistics: CacheStatistics;
  private performanceMonitor: PerformanceMonitor;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = { ...CACHE_CONFIG, ...config };

    // Initialize composed modules
    this.memoryEstimator = new MemoryEstimator();
    this.evictionPolicy = new LRUEvictionPolicy();
    this.tagIndexManager = new TagIndexManager();
    this.eventEmitter = new CacheEventEmitter();
    this.statistics = new CacheStatistics();
    this.performanceMonitor = new PerformanceMonitor();

    // Initialize event system
    this.eventEmitter.initialize();
  }

  /**
   * Retrieves a value from the cache
   * @template T - Type of the cached value
   * @param key - Unique cache key identifier
   * @returns Cached value if found and not expired, undefined otherwise
   */
  get<T>(key: string): T | undefined {
    const startTime = performance.now();

    const entry = this.cache.get(key);

    if (!entry) {
      this.statistics.recordMiss();
      this.eventEmitter.emit(CacheEventType.MISS, key);
      this.statistics.recordAccessTime(performance.now() - startTime);
      return undefined;
    }

    // Check if expired
    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      // Remove expired entry
      this.cache.delete(key);
      this.updateMemoryUsage(-entry.size);
      this.statistics.recordMiss();
      this.eventEmitter.emit(CacheEventType.MISS, key);
      this.statistics.recordAccessTime(performance.now() - startTime);
      return undefined;
    }

    // Update LRU tracking
    entry.accessCount++;
    entry.lastAccessed = now;

    this.statistics.recordHit();
    this.eventEmitter.emit(CacheEventType.HIT, key);
    this.statistics.recordAccessTime(performance.now() - startTime);

    return entry.data as T;
  }

  /**
   * Stores a value in the cache with optional TTL and tags
   * @template T - Type of the value to cache
   * @param key - Unique cache key identifier
   * @param data - Data to store in cache
   * @param options - Cache storage options (ttl, tags, version, containsPHI)
   */
  set<T>(
    key: string,
    data: T,
    options: {
      ttl?: number;
      tags?: string[];
      version?: number;
      containsPHI?: boolean;
    } = {}
  ): void {
    const {
      ttl = this.config.defaultTTL,
      tags = [],
      version,
      containsPHI = false
    } = options;

    const size = this.memoryEstimator.estimateSize(data);
    const now = Date.now();

    // Remove old entry's tag index if updating existing key
    const existingEntry = this.cache.get(key);
    if (existingEntry) {
      this.tagIndexManager.removeFromIndex(key, existingEntry.tags);
    }

    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      ttl,
      tags,
      size,
      accessCount: 0,
      lastAccessed: now,
      version,
      containsPHI
    };

    // Check if we need to evict entries
    if (this.cache.size >= this.config.maxSize) {
      this.evictLRU();
    }

    // Check memory limit
    while (
      this.memoryUsage + size > this.config.maxMemory &&
      this.cache.size > 0
    ) {
      this.evictLRU();
    }

    this.cache.set(key, entry);
    this.tagIndexManager.addToIndex(key, tags);
    this.updateMemoryUsage(size);
    this.eventEmitter.emit(CacheEventType.SET, key);

    // Track performance
    if (this.performanceMonitor.isEnabled()) {
      this.performanceMonitor.recordMetric({
        operation: 'cache-set',
        duration: 0,
        timestamp: now,
        success: true,
        metadata: { key, size }
      });
    }
  }

  /**
   * Check if key exists in cache and is not expired
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    // Check expiration
    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.updateMemoryUsage(-entry.size);
      return false;
    }

    return true;
  }

  /**
   * Delete entry from cache
   */
  delete(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    this.tagIndexManager.removeFromIndex(key, entry.tags);
    this.cache.delete(key);
    this.updateMemoryUsage(-entry.size);
    this.eventEmitter.emit(CacheEventType.INVALIDATE, key);

    return true;
  }

  /**
   * Invalidate cache entries by tags, keys, or pattern
   */
  invalidate(options: InvalidationOptions): number {
    const { tags, keys, pattern } = options;
    let invalidatedCount = 0;

    if (keys) {
      // Invalidate specific keys
      for (const key of keys) {
        if (this.delete(key)) {
          invalidatedCount++;
        }
      }
    }

    if (tags) {
      // Optimized tag-based invalidation using reverse index - O(1) lookup
      const keysToInvalidate = new Set<string>();
      tags.forEach((tag) => {
        const taggedKeys = this.tagIndexManager.getKeysWithTag(tag);
        taggedKeys.forEach((key) => keysToInvalidate.add(key));
      });

      keysToInvalidate.forEach((key) => {
        if (this.delete(key)) {
          invalidatedCount++;
        }
      });
    }

    if (pattern) {
      // Invalidate by pattern
      for (const key of this.cache.keys()) {
        if (pattern.test(key)) {
          this.delete(key);
          invalidatedCount++;
        }
      }
    }

    this.statistics.recordInvalidations(invalidatedCount);

    return invalidatedCount;
  }

  /** Clear all cache entries */
  clear(): void {
    const count = this.cache.size;
    this.cache.clear();
    this.tagIndexManager.clear();
    this.memoryUsage = 0;
    this.statistics.recordInvalidations(count);
  }

  /** Clear expired entries */
  clearExpired(): number {
    const now = Date.now();
    let clearedCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.tagIndexManager.removeFromIndex(key, entry.tags);
        this.cache.delete(key);
        this.updateMemoryUsage(-entry.size);
        clearedCount++;
      }
    }

    return clearedCount;
  }

  /** Get all keys with specific tag (O(1) lookup) */
  getKeysWithTag(tag: string): string[] {
    return this.tagIndexManager.getKeysWithTag(tag);
  }

  /** Get all keys matching regex pattern */
  getKeysMatching(pattern: RegExp): string[] {
    return Array.from(this.cache.keys()).filter((key) => pattern.test(key));
  }

  /** Get cache statistics */
  getStats(): CacheStats {
    const stats = this.statistics.getStats();
    return {
      ...stats,
      size: this.cache.size,
      memoryUsage: this.memoryUsage
    };
  }

  /** Reset statistics */
  resetStats(): void {
    this.statistics.reset();
  }

  /** Add event listener */
  addEventListener(eventType: CacheEventType, listener: CacheEventListener): void {
    this.eventEmitter.addEventListener(eventType, listener);
  }

  /** Remove event listener */
  removeEventListener(eventType: CacheEventType, listener: CacheEventListener): void {
    this.eventEmitter.removeEventListener(eventType, listener);
  }

  /** Evict least recently used entry */
  private evictLRU(): void {
    const lruKey = this.evictionPolicy.evict(this.cache);

    if (lruKey) {
      const entry = this.cache.get(lruKey);
      this.cache.delete(lruKey);
      if (entry) {
        this.updateMemoryUsage(-entry.size);
      }
      this.statistics.recordEviction();
      this.eventEmitter.emit(CacheEventType.EVICT, lruKey);
    }
  }

  /** Update memory usage tracking */
  private updateMemoryUsage(delta: number): void {
    this.memoryUsage += delta;
  }

  /** Get cache entries (for debugging) */
  getEntries(): Map<string, CacheEntry> {
    return new Map(this.cache);
  }

  /** Get non-PHI entries for persistence */
  getPersistableEntries(): Array<{ key: string; entry: CacheEntry }> {
    const persistable: Array<{ key: string; entry: CacheEntry }> = [];

    for (const [key, entry] of this.cache.entries()) {
      if (!entry.containsPHI) {
        persistable.push({ key, entry });
      }
    }

    return persistable;
  }

  /**
   * Cleanup resources (CRITICAL for HIPAA compliance on logout)
   * Clears all cache entries and resets statistics
   */
  async cleanup(): Promise<void> {
    // Clear all cache entries
    this.clear();

    // Reset statistics
    this.resetStats();

    // Emit cleanup event for all listeners - no specific event type for cleanup
    // Just emit invalidate to notify listeners cache is being cleared
    this.eventEmitter.emit(CacheEventType.INVALIDATE, 'cleanup');

    // Allow event handlers to complete
    await Promise.resolve();
  }
}

// Singleton instance
let cacheManagerInstance: CacheManager | null = null;

/**
 * Get Cache Manager Singleton
 *
 * @returns Cache manager instance
 */
export function getCacheManager(): CacheManager {
  if (!cacheManagerInstance) {
    cacheManagerInstance = new CacheManager();
  }
  return cacheManagerInstance;
}

/**
 * Reset Cache Manager (for testing)
 */
export function resetCacheManager(): void {
  cacheManagerInstance = null;
}
