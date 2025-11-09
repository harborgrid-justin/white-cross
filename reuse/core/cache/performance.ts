/**
 * @fileoverview Cache Performance Utilities
 * @module core/cache/performance
 *
 * Performance optimization utilities for caching including metrics tracking,
 * cache warming, batch operations, and performance monitoring.
 *
 * @example Track cache metrics
 * ```typescript
 * const metrics = new CacheMetrics();
 * metrics.recordHit('user-cache');
 * metrics.recordMiss('user-cache');
 * const stats = metrics.getStats('user-cache');
 * console.log(`Hit rate: ${stats.hitRate}%`);
 * ```
 */

/**
 * Cache performance metrics
 */
export interface CacheMetricsData {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  errors: number;
  totalTime: number;
  avgTime: number;
  hitRate: number;
  missRate: number;
}

/**
 * Cache metrics tracker
 */
export class CacheMetrics {
  private metrics: Map<string, {
    hits: number;
    misses: number;
    sets: number;
    deletes: number;
    errors: number;
    times: number[];
  }> = new Map();

  /**
   * Record a cache hit
   */
  recordHit(namespace: string, time?: number): void {
    const metrics = this.getOrCreateMetrics(namespace);
    metrics.hits++;
    if (time !== undefined) {
      metrics.times.push(time);
    }
  }

  /**
   * Record a cache miss
   */
  recordMiss(namespace: string, time?: number): void {
    const metrics = this.getOrCreateMetrics(namespace);
    metrics.misses++;
    if (time !== undefined) {
      metrics.times.push(time);
    }
  }

  /**
   * Record a cache set operation
   */
  recordSet(namespace: string, time?: number): void {
    const metrics = this.getOrCreateMetrics(namespace);
    metrics.sets++;
    if (time !== undefined) {
      metrics.times.push(time);
    }
  }

  /**
   * Record a cache delete operation
   */
  recordDelete(namespace: string, time?: number): void {
    const metrics = this.getOrCreateMetrics(namespace);
    metrics.deletes++;
    if (time !== undefined) {
      metrics.times.push(time);
    }
  }

  /**
   * Record a cache error
   */
  recordError(namespace: string): void {
    const metrics = this.getOrCreateMetrics(namespace);
    metrics.errors++;
  }

  /**
   * Get or create metrics for namespace
   */
  private getOrCreateMetrics(namespace: string) {
    if (!this.metrics.has(namespace)) {
      this.metrics.set(namespace, {
        hits: 0,
        misses: 0,
        sets: 0,
        deletes: 0,
        errors: 0,
        times: [],
      });
    }
    return this.metrics.get(namespace)!;
  }

  /**
   * Get statistics for a namespace
   */
  getStats(namespace: string): CacheMetricsData {
    const metrics = this.metrics.get(namespace);

    if (!metrics) {
      return {
        hits: 0,
        misses: 0,
        sets: 0,
        deletes: 0,
        errors: 0,
        totalTime: 0,
        avgTime: 0,
        hitRate: 0,
        missRate: 0,
      };
    }

    const totalRequests = metrics.hits + metrics.misses;
    const totalTime = metrics.times.reduce((sum, time) => sum + time, 0);
    const avgTime = metrics.times.length > 0 ? totalTime / metrics.times.length : 0;
    const hitRate = totalRequests > 0 ? (metrics.hits / totalRequests) * 100 : 0;
    const missRate = totalRequests > 0 ? (metrics.misses / totalRequests) * 100 : 0;

    return {
      hits: metrics.hits,
      misses: metrics.misses,
      sets: metrics.sets,
      deletes: metrics.deletes,
      errors: metrics.errors,
      totalTime,
      avgTime,
      hitRate,
      missRate,
    };
  }

  /**
   * Get all statistics
   */
  getAllStats(): Map<string, CacheMetricsData> {
    const allStats = new Map<string, CacheMetricsData>();
    for (const namespace of this.metrics.keys()) {
      allStats.set(namespace, this.getStats(namespace));
    }
    return allStats;
  }

  /**
   * Reset metrics for a namespace
   */
  reset(namespace?: string): void {
    if (namespace) {
      this.metrics.delete(namespace);
    } else {
      this.metrics.clear();
    }
  }
}

/**
 * Cache warmer configuration
 */
export interface CacheWarmerConfig {
  /** Batch size for warming operations */
  batchSize?: number;
  /** Delay between batches in milliseconds */
  batchDelay?: number;
  /** Maximum concurrent warming operations */
  concurrency?: number;
}

/**
 * Cache warmer for preloading frequently accessed data
 */
export class CacheWarmer {
  private config: Required<CacheWarmerConfig>;

  constructor(config: CacheWarmerConfig = {}) {
    this.config = {
      batchSize: 100,
      batchDelay: 100,
      concurrency: 5,
      ...config,
    };
  }

  /**
   * Warm cache with data
   */
  async warm<T>(
    keys: string[],
    loader: (key: string) => Promise<T>,
    setter: (key: string, value: T) => Promise<void>
  ): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    // Process in batches
    for (let i = 0; i < keys.length; i += this.config.batchSize) {
      const batch = keys.slice(i, i + this.config.batchSize);

      // Process batch with concurrency limit
      const chunks = this.chunkArray(batch, this.config.concurrency);

      for (const chunk of chunks) {
        const results = await Promise.allSettled(
          chunk.map(async (key) => {
            const value = await loader(key);
            await setter(key, value);
          })
        );

        results.forEach(result => {
          if (result.status === 'fulfilled') {
            success++;
          } else {
            failed++;
            console.error('Cache warming error:', result.reason);
          }
        });
      }

      // Delay between batches
      if (i + this.config.batchSize < keys.length) {
        await this.delay(this.config.batchDelay);
      }
    }

    return { success, failed };
  }

  /**
   * Chunk array into smaller arrays
   */
  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  /**
   * Delay utility
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Batch cache operations
 */
export class BatchCacheOperations {
  /**
   * Get multiple values from cache
   */
  async getMany<T>(
    keys: string[],
    getter: (key: string) => Promise<T | null>
  ): Promise<Map<string, T>> {
    const results = new Map<string, T>();

    const promises = keys.map(async (key) => {
      try {
        const value = await getter(key);
        if (value !== null) {
          results.set(key, value);
        }
      } catch (error) {
        console.error(`Error getting key ${key}:`, error);
      }
    });

    await Promise.all(promises);
    return results;
  }

  /**
   * Set multiple values in cache
   */
  async setMany<T>(
    entries: Map<string, T>,
    setter: (key: string, value: T) => Promise<void>
  ): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    const promises = Array.from(entries.entries()).map(async ([key, value]) => {
      try {
        await setter(key, value);
        success++;
      } catch (error) {
        failed++;
        console.error(`Error setting key ${key}:`, error);
      }
    });

    await Promise.all(promises);
    return { success, failed };
  }

  /**
   * Delete multiple values from cache
   */
  async deleteMany(
    keys: string[],
    deleter: (key: string) => Promise<void>
  ): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    const promises = keys.map(async (key) => {
      try {
        await deleter(key);
        success++;
      } catch (error) {
        failed++;
        console.error(`Error deleting key ${key}:`, error);
      }
    });

    await Promise.all(promises);
    return { success, failed };
  }
}

/**
 * Performance monitor for cache operations
 */
export class CachePerformanceMonitor {
  private operations: {
    operation: string;
    duration: number;
    timestamp: number;
    success: boolean;
  }[] = [];
  private maxOperations: number;

  constructor(maxOperations: number = 1000) {
    this.maxOperations = maxOperations;
  }

  /**
   * Track an operation
   */
  async track<T>(
    operation: string,
    fn: () => Promise<T>
  ): Promise<T> {
    const start = Date.now();
    let success = true;

    try {
      const result = await fn();
      return result;
    } catch (error) {
      success = false;
      throw error;
    } finally {
      const duration = Date.now() - start;
      this.recordOperation(operation, duration, success);
    }
  }

  /**
   * Record operation metrics
   */
  private recordOperation(
    operation: string,
    duration: number,
    success: boolean
  ): void {
    this.operations.push({
      operation,
      duration,
      timestamp: Date.now(),
      success,
    });

    // Keep only last N operations
    if (this.operations.length > this.maxOperations) {
      this.operations.shift();
    }
  }

  /**
   * Get performance statistics
   */
  getStatistics(operation?: string): {
    count: number;
    avgDuration: number;
    minDuration: number;
    maxDuration: number;
    successRate: number;
    p50: number;
    p95: number;
    p99: number;
  } {
    const filtered = operation
      ? this.operations.filter(op => op.operation === operation)
      : this.operations;

    if (filtered.length === 0) {
      return {
        count: 0,
        avgDuration: 0,
        minDuration: 0,
        maxDuration: 0,
        successRate: 0,
        p50: 0,
        p95: 0,
        p99: 0,
      };
    }

    const durations = filtered.map(op => op.duration).sort((a, b) => a - b);
    const successCount = filtered.filter(op => op.success).length;

    return {
      count: filtered.length,
      avgDuration: durations.reduce((sum, d) => sum + d, 0) / durations.length,
      minDuration: durations[0],
      maxDuration: durations[durations.length - 1],
      successRate: (successCount / filtered.length) * 100,
      p50: this.percentile(durations, 0.5),
      p95: this.percentile(durations, 0.95),
      p99: this.percentile(durations, 0.99),
    };
  }

  /**
   * Calculate percentile
   */
  private percentile(sorted: number[], p: number): number {
    const index = Math.ceil(sorted.length * p) - 1;
    return sorted[Math.max(0, index)];
  }

  /**
   * Get slow operations (above threshold)
   */
  getSlowOperations(thresholdMs: number): typeof this.operations {
    return this.operations.filter(op => op.duration > thresholdMs);
  }

  /**
   * Clear recorded operations
   */
  clear(): void {
    this.operations = [];
  }
}

/**
 * Memoization decorator for functions
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  options: {
    ttl?: number;
    keyGenerator?: (...args: Parameters<T>) => string;
    maxSize?: number;
  } = {}
): T {
  const cache = new Map<string, { value: any; expiry: number | null }>();
  const { ttl, keyGenerator, maxSize = 1000 } = options;

  const defaultKeyGenerator = (...args: any[]): string => {
    return JSON.stringify(args);
  };

  const getKey = keyGenerator || defaultKeyGenerator;

  return ((...args: Parameters<T>) => {
    const key = getKey(...args);
    const cached = cache.get(key);

    if (cached) {
      if (cached.expiry === null || cached.expiry > Date.now()) {
        return cached.value;
      }
      cache.delete(key);
    }

    const result = fn(...args);
    const expiry = ttl ? Date.now() + ttl : null;

    cache.set(key, { value: result, expiry });

    // Evict oldest if cache is too large
    if (cache.size > maxSize) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }

    return result;
  }) as T;
}

/**
 * Async memoization decorator
 */
export function memoizeAsync<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: {
    ttl?: number;
    keyGenerator?: (...args: Parameters<T>) => string;
    maxSize?: number;
  } = {}
): T {
  const cache = new Map<string, { value: any; expiry: number | null }>();
  const pending = new Map<string, Promise<any>>();
  const { ttl, keyGenerator, maxSize = 1000 } = options;

  const defaultKeyGenerator = (...args: any[]): string => {
    return JSON.stringify(args);
  };

  const getKey = keyGenerator || defaultKeyGenerator;

  return (async (...args: Parameters<T>) => {
    const key = getKey(...args);
    const cached = cache.get(key);

    // Return cached value if valid
    if (cached) {
      if (cached.expiry === null || cached.expiry > Date.now()) {
        return cached.value;
      }
      cache.delete(key);
    }

    // Return pending promise if exists
    const pendingPromise = pending.get(key);
    if (pendingPromise) {
      return pendingPromise;
    }

    // Execute function and cache promise
    const promise = fn(...args);
    pending.set(key, promise);

    try {
      const result = await promise;
      const expiry = ttl ? Date.now() + ttl : null;

      cache.set(key, { value: result, expiry });

      // Evict oldest if cache is too large
      if (cache.size > maxSize) {
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
      }

      return result;
    } finally {
      pending.delete(key);
    }
  }) as T;
}

/**
 * Debounced cache setter to reduce write operations
 */
export class DebouncedCacheSetter<T> {
  private pending: Map<string, { value: T; timeout: NodeJS.Timeout }> = new Map();
  private delay: number;

  constructor(
    private setter: (key: string, value: T) => Promise<void>,
    delay: number = 1000
  ) {
    this.delay = delay;
  }

  /**
   * Set value with debounce
   */
  set(key: string, value: T): void {
    const existing = this.pending.get(key);
    if (existing) {
      clearTimeout(existing.timeout);
    }

    const timeout = setTimeout(async () => {
      try {
        await this.setter(key, value);
        this.pending.delete(key);
      } catch (error) {
        console.error(`Error setting debounced key ${key}:`, error);
      }
    }, this.delay);

    this.pending.set(key, { value, timeout });
  }

  /**
   * Flush all pending sets immediately
   */
  async flush(): Promise<void> {
    const promises: Promise<void>[] = [];

    for (const [key, { value, timeout }] of this.pending.entries()) {
      clearTimeout(timeout);
      promises.push(this.setter(key, value));
    }

    this.pending.clear();
    await Promise.all(promises);
  }

  /**
   * Cancel all pending sets
   */
  cancel(): void {
    for (const { timeout } of this.pending.values()) {
      clearTimeout(timeout);
    }
    this.pending.clear();
  }
}
