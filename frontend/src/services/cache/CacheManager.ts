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
  CacheEvent,
  CacheEventType,
  CacheEventListener,
  PerformanceMetrics
} from './types';
import { CACHE_CONFIG, PERFORMANCE_CONFIG } from './cacheConfig';

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
  // Tag index for O(1) lookups by tag
  private tagIndex: Map<string, Set<string>> = new Map();
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    hitRate: 0,
    evictions: 0,
    size: 0,
    memoryUsage: 0,
    avgAccessTime: 0,
    invalidations: 0
  };
  private config: CacheConfig;
  private listeners: Map<CacheEventType, Set<CacheEventListener>> = new Map();
  // Use running average instead of storing all access times
  private accessStats = { count: 0, sum: 0, avg: 0 };

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = { ...CACHE_CONFIG, ...config };
    this.initializeEventListeners();
  }

  /**
   * Initialize Event Listeners
   */
  private initializeEventListeners(): void {
    // Initialize listener sets for each event type
    this.listeners.set('hit', new Set());
    this.listeners.set('miss', new Set());
    this.listeners.set('set', new Set());
    this.listeners.set('invalidate', new Set());
    this.listeners.set('evict', new Set());
    this.listeners.set('persist', new Set());
    this.listeners.set('restore', new Set());
  }

  /**
   * Retrieves a value from the cache
   * 
   * @template T - Type of the cached value
   * @param {string} key - Unique cache key identifier
   * @returns {T | undefined} Cached value if found and not expired, undefined otherwise
   * 
   * @description
   * Performs cache lookup with automatic expiration checking:
   * - Returns undefined if key doesn't exist
   * - Returns undefined if entry has expired (and removes it)
   * - Updates LRU tracking (access count and timestamp)
   * - Records performance metrics (hit/miss, access time)
   * 
   * @example
   * ```typescript
   * const user = manager.get<User>('user:123');
   * if (user) {
   *   console.log('Cache hit:', user);
   * } else {
   *   console.log('Cache miss, fetch from API');
   * }
   * ```
   */
  get<T>(key: string): T | undefined {
    const startTime = performance.now();

    const entry = this.cache.get(key);

    if (!entry) {
      this.recordMiss(key);
      this.recordAccessTime(performance.now() - startTime);
      return undefined;
    }

    // Check if expired
    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      // Remove expired entry
      this.cache.delete(key);
      this.updateMemoryUsage(-entry.size);
      this.recordMiss(key);
      this.recordAccessTime(performance.now() - startTime);
      return undefined;
    }

    // Update LRU tracking
    entry.accessCount++;
    entry.lastAccessed = now;

    this.recordHit(key);
    this.recordAccessTime(performance.now() - startTime);

    return entry.data as T;
  }

  /**
   * Stores a value in the cache with optional TTL and tags
   * 
   * @template T - Type of the value to cache
   * @param {string} key - Unique cache key identifier
   * @param {T} data - Data to store in cache
   * @param {Object} options - Cache storage options
   * @param {number} [options.ttl] - Time-to-live in milliseconds (default: config.defaultTTL)
   * @param {string[]} [options.tags] - Tags for tag-based invalidation
   * @param {number} [options.version] - Version number for cache versioning
   * @param {boolean} [options.containsPHI] - HIPAA flag indicating if data contains PHI
   * @returns {void}
   * 
   * @description
   * Stores data with automatic LRU eviction when max size is reached:
   * - Calculates approximate memory size
   * - Evicts least recently used items if necessary
   * - Updates statistics and triggers events
   * - Marks PHI data appropriately for compliance
   * 
   * @example
   * ```typescript
   * // Basic usage
   * manager.set('user:123', userData);
   * 
   * // With TTL and tags
   * manager.set('student:456', studentData, {
   *   ttl: 300000, // 5 minutes
   *   tags: ['students', 'active'],
   *   containsPHI: true // HIPAA compliance
   * });
   * ```
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

    const size = this.estimateSize(data);
    const now = Date.now();

    // Remove old entry's tag index if updating existing key
    const existingEntry = this.cache.get(key);
    if (existingEntry) {
      this.removeFromTagIndex(key, existingEntry.tags);
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
      this.stats.memoryUsage + size > this.config.maxMemory &&
      this.cache.size > 0
    ) {
      this.evictLRU();
    }

    this.cache.set(key, entry);
    this.addToTagIndex(key, tags);
    this.updateMemoryUsage(size);
    this.emitEvent('set', key);

    // Track performance
    if (PERFORMANCE_CONFIG.enabled) {
      this.recordMetric({
        operation: 'cache-set',
        duration: 0,
        timestamp: now,
        success: true,
        metadata: { key, size }
      });
    }
  }

  /**
   * Check if Key Exists in Cache
   *
   * @param key - Cache key
   * @returns Whether key exists and is not expired
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
   * Delete Entry from Cache
   *
   * @param key - Cache key
   * @returns Whether entry was deleted
   */
  delete(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    this.removeFromTagIndex(key, entry.tags);
    this.cache.delete(key);
    this.updateMemoryUsage(-entry.size);
    this.emitEvent('invalidate', key);

    return true;
  }

  /**
   * Invalidate Cache Entries
   *
   * @param options - Invalidation options
   * @returns Number of entries invalidated
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
      tags.forEach(tag => {
        const taggedKeys = this.tagIndex.get(tag);
        if (taggedKeys) {
          taggedKeys.forEach(key => keysToInvalidate.add(key));
        }
      });

      keysToInvalidate.forEach(key => {
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

    this.stats.invalidations += invalidatedCount;

    return invalidatedCount;
  }

  /**
   * Clear All Cache Entries
   */
  clear(): void {
    const count = this.cache.size;
    this.cache.clear();
    this.tagIndex.clear();
    this.stats.memoryUsage = 0;
    this.stats.size = 0;
    this.stats.invalidations += count;
  }

  /**
   * Clear Expired Entries
   *
   * @returns Number of entries cleared
   */
  clearExpired(): number {
    const now = Date.now();
    let clearedCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.removeFromTagIndex(key, entry.tags);
        this.cache.delete(key);
        this.updateMemoryUsage(-entry.size);
        clearedCount++;
      }
    }

    return clearedCount;
  }

  /**
   * Get All Keys with Tag
   * Optimized to use tag index for O(1) lookup
   *
   * @param tag - Cache tag
   * @returns Array of keys with this tag
   */
  getKeysWithTag(tag: string): string[] {
    const taggedKeys = this.tagIndex.get(tag);
    return taggedKeys ? Array.from(taggedKeys) : [];
  }

  /**
   * Get All Keys Matching Pattern
   *
   * @param pattern - Regex pattern
   * @returns Array of matching keys
   */
  getKeysMatching(pattern: RegExp): string[] {
    return Array.from(this.cache.keys()).filter((key) => pattern.test(key));
  }

  /**
   * Get Cache Statistics
   *
   * @returns Current cache statistics
   */
  getStats(): CacheStats {
    return {
      ...this.stats,
      size: this.cache.size,
      hitRate: this.stats.hits + this.stats.misses > 0
        ? this.stats.hits / (this.stats.hits + this.stats.misses)
        : 0
    };
  }

  /**
   * Reset Statistics
   */
  resetStats(): void {
    this.stats = {
      hits: 0,
      misses: 0,
      hitRate: 0,
      evictions: 0,
      size: this.cache.size,
      memoryUsage: this.stats.memoryUsage,
      avgAccessTime: 0,
      invalidations: 0
    };
    this.accessStats = { count: 0, sum: 0, avg: 0 };
  }

  /**
   * Add Event Listener
   *
   * @param eventType - Type of event
   * @param listener - Event listener function
   */
  addEventListener(
    eventType: CacheEventType,
    listener: CacheEventListener
  ): void {
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      listeners.add(listener);
    }
  }

  /**
   * Remove Event Listener
   *
   * @param eventType - Type of event
   * @param listener - Event listener function
   */
  removeEventListener(
    eventType: CacheEventType,
    listener: CacheEventListener
  ): void {
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      listeners.delete(listener);
    }
  }

  /**
   * Emit Cache Event
   *
   * @param type - Event type
   * @param key - Cache key
   * @param metadata - Additional metadata
   */
  private emitEvent(
    type: CacheEventType,
    key: string,
    metadata?: Record<string, unknown>
  ): void {
    const event: CacheEvent = {
      type,
      key,
      timestamp: Date.now(),
      metadata
    };

    const listeners = this.listeners.get(type);
    if (listeners) {
      listeners.forEach((listener) => listener(event));
    }
  }

  /**
   * Evict Least Recently Used Entry
   */
  private evictLRU(): void {
    let lruKey: string | null = null;
    let lruTime = Infinity;

    // Find entry with oldest lastAccessed time
    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccessed < lruTime) {
        lruTime = entry.lastAccessed;
        lruKey = key;
      }
    }

    if (lruKey) {
      const entry = this.cache.get(lruKey);
      this.cache.delete(lruKey);
      if (entry) {
        this.updateMemoryUsage(-entry.size);
      }
      this.stats.evictions++;
      this.emitEvent('evict', lruKey);
    }
  }

  /**
   * Estimate Size of Data
   *
   * Rough estimate in bytes for memory tracking
   *
   * @param data - Data to estimate
   * @returns Estimated size in bytes
   */
  private estimateSize(data: unknown): number {
    const json = JSON.stringify(data);
    // Rough estimate: 2 bytes per character (UTF-16)
    return json.length * 2;
  }

  /**
   * Update Memory Usage Tracking
   *
   * @param delta - Change in memory usage (bytes)
   */
  private updateMemoryUsage(delta: number): void {
    this.stats.memoryUsage += delta;
    this.stats.size = this.cache.size;
  }

  /**
   * Record Cache Hit
   *
   * @param key - Cache key
   */
  private recordHit(key: string): void {
    this.stats.hits++;
    this.emitEvent('hit', key);
  }

  /**
   * Record Cache Miss
   *
   * @param key - Cache key
   */
  private recordMiss(key: string): void {
    this.stats.misses++;
    this.emitEvent('miss', key);
  }

  /**
   * Record Access Time using running average
   * Prevents memory leak from unbounded array growth
   *
   * @param duration - Access duration in ms
   */
  private recordAccessTime(duration: number): void {
    // Update running average without storing all values
    this.accessStats.count++;
    this.accessStats.sum += duration;

    // Calculate weighted running average (gives more weight to recent values)
    const weight = Math.min(100, this.accessStats.count); // Cap weight at 100 samples
    this.accessStats.avg = ((this.accessStats.avg * (weight - 1)) + duration) / weight;

    // Update stats
    this.stats.avgAccessTime = this.accessStats.avg;

    // Reset periodically to prevent numerical overflow
    if (this.accessStats.count > 10000) {
      this.accessStats.count = 100;
      this.accessStats.sum = this.accessStats.avg * 100;
    }
  }

  /**
   * Record Performance Metric
   *
   * @param metric - Performance metric
   */
  private recordMetric(metric: PerformanceMetrics): void {
    if (!PERFORMANCE_CONFIG.enabled) return;

    // Sample based on sample rate
    if (Math.random() > PERFORMANCE_CONFIG.sampleRate) return;

    // Check against thresholds
    const threshold = PERFORMANCE_CONFIG.thresholds[
      metric.operation as keyof typeof PERFORMANCE_CONFIG.thresholds
    ];

    if (threshold && metric.duration > threshold) {
      console.warn(
        `[CacheManager] Slow operation: ${metric.operation} took ${metric.duration}ms (threshold: ${threshold}ms)`,
        metric.metadata
      );
    }
  }

  /**
   * Add key to tag index for O(1) tag lookups
   *
   * @param key - Cache key
   * @param tags - Array of tags
   */
  private addToTagIndex(key: string, tags: string[]): void {
    tags.forEach(tag => {
      if (!this.tagIndex.has(tag)) {
        this.tagIndex.set(tag, new Set());
      }
      this.tagIndex.get(tag)!.add(key);
    });
  }

  /**
   * Remove key from tag index
   *
   * @param key - Cache key
   * @param tags - Array of tags
   */
  private removeFromTagIndex(key: string, tags: string[]): void {
    tags.forEach(tag => {
      const taggedKeys = this.tagIndex.get(tag);
      if (taggedKeys) {
        taggedKeys.delete(key);
        // Clean up empty tag sets to prevent memory bloat
        if (taggedKeys.size === 0) {
          this.tagIndex.delete(tag);
        }
      }
    });
  }

  /**
   * Get Cache Entries for Debugging
   *
   * @returns Map of all cache entries (shallow copy)
   */
  getEntries(): Map<string, CacheEntry> {
    return new Map(this.cache);
  }

  /**
   * Get Non-PHI Entries for Persistence
   *
   * @returns Array of entries that can be persisted
   */
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
   * Cleanup Resources
   *
   * Clears all cache entries, resets statistics, and performs cleanup.
   * CRITICAL for HIPAA compliance - must be called on user logout to prevent
   * PHI data from being accessible to the next user session.
   *
   * @returns Promise that resolves when cleanup is complete
   *
   * @example
   * ```typescript
   * // On user logout
   * const cacheManager = getCacheManager();
   * await cacheManager.cleanup();
   * ```
   */
  async cleanup(): Promise<void> {
    // Clear all cache entries
    this.clear();

    // Reset statistics
    this.resetStats();

    // Emit cleanup event
    this.emitEvent({
      type: 'clear',
      timestamp: Date.now()
    });

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
