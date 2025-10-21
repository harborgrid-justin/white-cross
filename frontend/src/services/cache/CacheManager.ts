/**
 * Enterprise Cache Manager
 *
 * Advanced in-memory caching with:
 * - LRU eviction policy (max 100 items)
 * - TTL-based expiration
 * - Tag-based invalidation
 * - Size tracking and memory management
 * - Performance monitoring
 * - Event system for cache operations
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
import { CACHE_CONFIG, PERFORMANCE_CONFIG } from './cache-config';

/**
 * Cache Manager Implementation
 */
export class CacheManager {
  private cache: Map<string, CacheEntry> = new Map();
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
  private accessTimes: number[] = [];

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
   * Get Value from Cache
   *
   * @param key - Cache key
   * @returns Cached value or undefined if not found/expired
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
   * Set Value in Cache
   *
   * @param key - Cache key
   * @param data - Data to cache
   * @param options - Cache options
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
      // Invalidate by tags
      for (const [key, entry] of this.cache.entries()) {
        if (tags.some((tag) => entry.tags.includes(tag))) {
          this.delete(key);
          invalidatedCount++;
        }
      }
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
        this.cache.delete(key);
        this.updateMemoryUsage(-entry.size);
        clearedCount++;
      }
    }

    return clearedCount;
  }

  /**
   * Get All Keys with Tag
   *
   * @param tag - Cache tag
   * @returns Array of keys with this tag
   */
  getKeysWithTag(tag: string): string[] {
    const keys: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (entry.tags.includes(tag)) {
        keys.push(key);
      }
    }

    return keys;
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
    this.accessTimes = [];
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
   * Record Access Time
   *
   * @param duration - Access duration in ms
   */
  private recordAccessTime(duration: number): void {
    this.accessTimes.push(duration);

    // Keep only last 100 access times
    if (this.accessTimes.length > 100) {
      this.accessTimes.shift();
    }

    // Calculate average
    const sum = this.accessTimes.reduce((acc, time) => acc + time, 0);
    this.stats.avgAccessTime = sum / this.accessTimes.length;
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
