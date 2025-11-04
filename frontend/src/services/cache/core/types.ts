/**
 * Internal Core Types for Cache Manager Modules
 *
 * @module services/cache/core/types
 * @internal
 */

import type { CacheEntry, CacheEvent, CacheEventType, PerformanceMetrics } from '../types';

/**
 * Cache Event Listener Type
 */
export type CacheEventListener = (event: CacheEvent) => void;

/**
 * Eviction Policy Interface
 *
 * Defines the contract for pluggable eviction strategies (LRU, LFU, FIFO, etc.)
 */
export interface IEvictionPolicy {
  /**
   * Evict one entry from the cache
   * @param cache - The cache Map to evict from
   * @returns The evicted key, or null if cache is empty
   */
  evict(cache: Map<string, CacheEntry>): string | null;
}

/**
 * Statistics Tracker Interface
 */
export interface IStatisticsTracker {
  /**
   * Record a cache hit
   */
  recordHit(): void;

  /**
   * Record a cache miss
   */
  recordMiss(): void;

  /**
   * Record access time
   */
  recordAccessTime(duration: number): void;

  /**
   * Record an eviction
   */
  recordEviction(): void;

  /**
   * Record invalidations
   */
  recordInvalidations(count: number): void;

  /**
   * Get current statistics
   */
  getStats(): {
    hits: number;
    misses: number;
    hitRate: number;
    evictions: number;
    avgAccessTime: number;
    invalidations: number;
  };

  /**
   * Reset all statistics
   */
  reset(): void;
}

/**
 * Tag Index Manager Interface
 */
export interface ITagIndexManager {
  /**
   * Add key to tag index
   */
  addToIndex(key: string, tags: string[]): void;

  /**
   * Remove key from tag index
   */
  removeFromIndex(key: string, tags: string[]): void;

  /**
   * Get all keys with a specific tag
   */
  getKeysWithTag(tag: string): string[];

  /**
   * Clear all tag indexes
   */
  clear(): void;
}

/**
 * Event Emitter Interface
 */
export interface ICacheEventEmitter {
  /**
   * Initialize event listeners
   */
  initialize(): void;

  /**
   * Add event listener
   */
  addEventListener(eventType: CacheEventType, listener: CacheEventListener): void;

  /**
   * Remove event listener
   */
  removeEventListener(eventType: CacheEventType, listener: CacheEventListener): void;

  /**
   * Emit cache event
   */
  emit(type: CacheEventType, key: string, metadata?: Record<string, unknown>): void;
}

/**
 * Memory Estimator Interface
 */
export interface IMemoryEstimator {
  /**
   * Estimate size of data in bytes
   */
  estimateSize(data: unknown): number;
}

/**
 * Performance Monitor Interface
 */
export interface IPerformanceMonitor {
  /**
   * Record a performance metric
   */
  recordMetric(metric: PerformanceMetrics): void;

  /**
   * Check if monitoring is enabled
   */
  isEnabled(): boolean;
}
