/**
 * @fileoverview Cache Strategies Kit
 * @module core/cache/strategies-kit
 *
 * Unified interface for working with different cache strategies.
 * Provides factory methods and utilities for selecting and configuring strategies.
 *
 * @example Use cache-aside strategy
 * ```typescript
 * const kit = new CacheStrategiesKit(storage);
 * const strategy = kit.cacheAside({ ttl: 3600000 });
 *
 * const data = await strategy.get('key', async () => {
 *   return await fetchFromDatabase();
 * });
 * ```
 */

import {
  CacheStrategy,
  CacheAsideStrategy,
  WriteThroughStrategy,
  WriteBehindStrategy,
  ReadThroughStrategy,
  RefreshAheadStrategy,
  CacheStorage,
  CacheStrategyOptions,
} from './strategies';

/**
 * Configuration for strategy kit
 */
export interface StrategiesKitConfig {
  /** Default TTL for all strategies */
  defaultTTL?: number;
  /** Default namespace for all strategies */
  defaultNamespace?: string;
  /** Enable compression by default */
  compress?: boolean;
}

/**
 * Cache Strategies Kit
 *
 * Factory and utility class for working with different caching strategies.
 */
export default class CacheStrategiesKit {
  private storage: CacheStorage;
  private config: StrategiesKitConfig;

  constructor(storage: CacheStorage, config: StrategiesKitConfig = {}) {
    this.storage = storage;
    this.config = {
      defaultTTL: 3600000,
      defaultNamespace: '',
      compress: false,
      ...config,
    };
  }

  /**
   * Create cache-aside strategy
   */
  cacheAside(options?: CacheStrategyOptions): CacheAsideStrategy {
    return new CacheAsideStrategy(this.storage, this.mergeOptions(options));
  }

  /**
   * Create write-through strategy
   */
  writeThrough(options?: CacheStrategyOptions): WriteThroughStrategy {
    return new WriteThroughStrategy(this.storage, this.mergeOptions(options));
  }

  /**
   * Create write-behind strategy
   */
  writeBehind(
    options?: CacheStrategyOptions & {
      flushIntervalMs?: number;
      onFlush?: (key: string, value: any) => Promise<void>;
    }
  ): WriteBehindStrategy {
    return new WriteBehindStrategy(this.storage, this.mergeOptions(options));
  }

  /**
   * Create read-through strategy
   */
  readThrough(
    loader: (key: string) => Promise<any>,
    options?: CacheStrategyOptions
  ): ReadThroughStrategy {
    return new ReadThroughStrategy(this.storage, loader, this.mergeOptions(options));
  }

  /**
   * Create refresh-ahead strategy
   */
  refreshAhead(
    options?: CacheStrategyOptions & { refreshThreshold?: number }
  ): RefreshAheadStrategy {
    return new RefreshAheadStrategy(this.storage, this.mergeOptions(options));
  }

  /**
   * Merge options with defaults
   */
  private mergeOptions<T extends CacheStrategyOptions>(options?: T): T {
    return {
      ttl: this.config.defaultTTL,
      namespace: this.config.defaultNamespace,
      compress: this.config.compress,
      ...options,
    } as T;
  }

  /**
   * Get the underlying storage
   */
  getStorage(): CacheStorage {
    return this.storage;
  }

  /**
   * Create a namespaced kit
   */
  namespace(namespace: string): CacheStrategiesKit {
    return new CacheStrategiesKit(this.storage, {
      ...this.config,
      defaultNamespace: namespace,
    });
  }
}

/**
 * Strategy selector utility
 */
export class StrategySelector {
  /**
   * Select optimal strategy based on use case
   */
  static selectStrategy(
    useCase: 'read-heavy' | 'write-heavy' | 'balanced' | 'high-availability' | 'low-latency',
    storage: CacheStorage,
    options?: CacheStrategyOptions
  ): CacheStrategy {
    switch (useCase) {
      case 'read-heavy':
        // Cache-aside is best for read-heavy workloads
        return new CacheAsideStrategy(storage, options);

      case 'write-heavy':
        // Write-behind reduces write latency
        return new WriteBehindStrategy(storage, {
          ...options,
          flushIntervalMs: 5000,
        });

      case 'balanced':
        // Write-through provides balance
        return new WriteThroughStrategy(storage, options);

      case 'high-availability':
        // Refresh-ahead prevents cache misses
        return new RefreshAheadStrategy(storage, {
          ...options,
          refreshThreshold: 0.8,
        });

      case 'low-latency':
        // Write-behind minimizes latency
        return new WriteBehindStrategy(storage, {
          ...options,
          flushIntervalMs: 10000,
        });

      default:
        return new CacheAsideStrategy(storage, options);
    }
  }
}

/**
 * Multi-level cache strategy
 *
 * Implements a multi-tier caching approach with L1 (memory) and L2 (Redis) caches.
 */
export class MultiLevelCacheStrategy {
  private l1Cache: CacheStorage;
  private l2Cache: CacheStorage;
  private options: CacheStrategyOptions;

  constructor(
    l1Cache: CacheStorage,
    l2Cache: CacheStorage,
    options: CacheStrategyOptions = {}
  ) {
    this.l1Cache = l1Cache;
    this.l2Cache = l2Cache;
    this.options = {
      ttl: 3600000,
      ...options,
    };
  }

  /**
   * Get value from multi-level cache
   */
  async get<T>(key: string, loader?: () => Promise<T>): Promise<T | null> {
    // Try L1 cache first
    let value = await this.l1Cache.get<T>(key);
    if (value !== null) {
      return value;
    }

    // Try L2 cache
    value = await this.l2Cache.get<T>(key);
    if (value !== null) {
      // Promote to L1
      await this.l1Cache.set(key, value, this.options.ttl);
      return value;
    }

    // Load from source if loader provided
    if (loader) {
      value = await loader();
      if (value !== null && value !== undefined) {
        // Store in both levels
        await this.set(key, value);
      }
      return value;
    }

    return null;
  }

  /**
   * Set value in multi-level cache
   */
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const effectiveTTL = ttl || this.options.ttl;

    // Write to both levels
    await Promise.all([
      this.l1Cache.set(key, value, effectiveTTL),
      this.l2Cache.set(key, value, effectiveTTL),
    ]);
  }

  /**
   * Delete from multi-level cache
   */
  async delete(key: string): Promise<void> {
    await Promise.all([
      this.l1Cache.delete(key),
      this.l2Cache.delete(key),
    ]);
  }

  /**
   * Check if key exists in either level
   */
  async has(key: string): Promise<boolean> {
    const [l1Has, l2Has] = await Promise.all([
      this.l1Cache.has(key),
      this.l2Cache.has(key),
    ]);

    return l1Has || l2Has;
  }

  /**
   * Clear both cache levels
   */
  async clear(): Promise<void> {
    await Promise.all([
      this.l1Cache.clear(),
      this.l2Cache.clear(),
    ]);
  }
}

/**
 * Partitioned cache strategy
 *
 * Distributes cache across multiple storage backends based on key hash.
 */
export class PartitionedCacheStrategy {
  private partitions: CacheStorage[];
  private options: CacheStrategyOptions;

  constructor(partitions: CacheStorage[], options: CacheStrategyOptions = {}) {
    if (partitions.length === 0) {
      throw new Error('At least one partition is required');
    }
    this.partitions = partitions;
    this.options = {
      ttl: 3600000,
      ...options,
    };
  }

  /**
   * Get partition for key
   */
  private getPartition(key: string): CacheStorage {
    const hash = this.hashCode(key);
    const index = Math.abs(hash) % this.partitions.length;
    return this.partitions[index];
  }

  /**
   * Simple hash function
   */
  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
  }

  /**
   * Get value from partitioned cache
   */
  async get<T>(key: string): Promise<T | null> {
    const partition = this.getPartition(key);
    return await partition.get<T>(key);
  }

  /**
   * Set value in partitioned cache
   */
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const partition = this.getPartition(key);
    const effectiveTTL = ttl || this.options.ttl;
    await partition.set(key, value, effectiveTTL);
  }

  /**
   * Delete from partitioned cache
   */
  async delete(key: string): Promise<void> {
    const partition = this.getPartition(key);
    await partition.delete(key);
  }

  /**
   * Check if key exists
   */
  async has(key: string): Promise<boolean> {
    const partition = this.getPartition(key);
    return await partition.has(key);
  }

  /**
   * Clear all partitions
   */
  async clear(): Promise<void> {
    await Promise.all(this.partitions.map(p => p.clear()));
  }

  /**
   * Get all keys from all partitions
   */
  async keys(pattern?: string): Promise<string[]> {
    const allKeys = await Promise.all(
      this.partitions.map(p => p.keys(pattern))
    );
    return allKeys.flat();
  }
}

/**
 * Replicated cache strategy
 *
 * Writes to multiple cache backends for redundancy and reads from the fastest.
 */
export class ReplicatedCacheStrategy {
  private replicas: CacheStorage[];
  private options: CacheStrategyOptions;

  constructor(replicas: CacheStorage[], options: CacheStrategyOptions = {}) {
    if (replicas.length === 0) {
      throw new Error('At least one replica is required');
    }
    this.replicas = replicas;
    this.options = {
      ttl: 3600000,
      ...options,
    };
  }

  /**
   * Get value from replicated cache (first successful read)
   */
  async get<T>(key: string): Promise<T | null> {
    // Race all replicas, return first successful result
    const results = await Promise.allSettled(
      this.replicas.map(replica => replica.get<T>(key))
    );

    for (const result of results) {
      if (result.status === 'fulfilled' && result.value !== null) {
        return result.value;
      }
    }

    return null;
  }

  /**
   * Set value in all replicas
   */
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const effectiveTTL = ttl || this.options.ttl;

    // Write to all replicas
    const results = await Promise.allSettled(
      this.replicas.map(replica => replica.set(key, value, effectiveTTL))
    );

    // Log any failures
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.error(`Failed to write to replica ${index}:`, result.reason);
      }
    });
  }

  /**
   * Delete from all replicas
   */
  async delete(key: string): Promise<void> {
    await Promise.allSettled(
      this.replicas.map(replica => replica.delete(key))
    );
  }

  /**
   * Check if key exists in any replica
   */
  async has(key: string): Promise<boolean> {
    const results = await Promise.allSettled(
      this.replicas.map(replica => replica.has(key))
    );

    return results.some(
      result => result.status === 'fulfilled' && result.value === true
    );
  }

  /**
   * Clear all replicas
   */
  async clear(): Promise<void> {
    await Promise.allSettled(
      this.replicas.map(replica => replica.clear())
    );
  }
}

/**
 * Create strategies kit instance
 */
export function createStrategiesKit(
  storage: CacheStorage,
  config?: StrategiesKitConfig
): CacheStrategiesKit {
  return new CacheStrategiesKit(storage, config);
}

export { CacheStrategiesKit };
