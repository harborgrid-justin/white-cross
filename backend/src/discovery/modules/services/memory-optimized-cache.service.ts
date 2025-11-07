import { Injectable, Logger, Inject } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import {
  CacheableData,
  MemoryCacheOptions,
} from '../types/resource.types';

export interface CacheProviderConfig {
  ttl: number;
  maxSize: number;
  priority: 'low' | 'normal' | 'high';
  compressionEnabled: boolean;
}

export interface CacheEntry {
  data: CacheableData;
  timestamp: number;
  accessCount: number;
  lastAccessed: number;
  size: number;
  compressed: boolean;
  provider: string;
}

/**
 * Memory-Optimized Cache Service
 *
 * Uses Discovery Service patterns to:
 * - Automatically manage cache for discovered providers
 * - Implement intelligent memory management
 * - Provide compression and eviction strategies
 */
@Injectable()
export class MemoryOptimizedCacheService {
  private readonly logger = new Logger(MemoryOptimizedCacheService.name);
  private cache = new Map<string, CacheEntry>();
  private providerConfigs = new Map<string, CacheProviderConfig>();
  private memoryUsage = 0;
  private readonly compressionThreshold = 1024; // 1KB

  constructor(
    @Inject('MEMORY_CACHE_OPTIONS')
    private readonly options: MemoryCacheOptions,
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
  ) {}

  /**
   * Register a cacheable provider discovered by Discovery Service
   */
  async registerCacheableProvider(
    providerName: string,
    config: CacheProviderConfig,
  ): Promise<void> {
    this.providerConfigs.set(providerName, config);
    this.logger.log(`Registered cacheable provider: ${providerName}`, {
      ttl: config.ttl,
      maxSize: config.maxSize,
      priority: config.priority,
    });
  }

  /**
   * Set cache entry with automatic compression and memory tracking
   */
  async set(
    key: string,
    data: CacheableData,
    providerName?: string,
    customTtl?: number,
  ): Promise<void> {
    const provider = providerName || 'default';
    const config = this.providerConfigs.get(provider) || {
      ttl: 300,
      maxSize: 100,
      priority: 'normal',
      compressionEnabled: true,
    };

    // Calculate data size
    const dataSize = this.calculateSize(data);

    // Check if compression is needed and beneficial
    let finalData = data;
    let compressed = false;

    if (config.compressionEnabled && dataSize > this.compressionThreshold) {
      try {
        finalData = await this.compressData(data);
        compressed = true;
        this.logger.debug(
          `Compressed cache entry ${key}: ${dataSize} -> ${this.calculateSize(finalData)} bytes`,
        );
      } catch (error) {
        this.logger.warn(`Failed to compress cache entry ${key}:`, error);
      }
    }

    const entry: CacheEntry = {
      data: finalData,
      timestamp: Date.now(),
      accessCount: 0,
      lastAccessed: Date.now(),
      size: this.calculateSize(finalData),
      compressed,
      provider,
    };

    // Check memory limits before adding
    if (
      this.memoryUsage + entry.size >
      this.options.maxMemoryThreshold * 1024 * 1024
    ) {
      await this.evictLeastValuable(entry.size);
    }

    // Remove existing entry if it exists
    if (this.cache.has(key)) {
      this.memoryUsage -= this.cache.get(key)!.size;
    }

    this.cache.set(key, entry);
    this.memoryUsage += entry.size;

    // Set TTL cleanup for this entry
    const ttl = customTtl || config.ttl;
    setTimeout(() => {
      this.delete(key);
    }, ttl * 1000);
  }

  /**
   * Get cache entry with automatic decompression and access tracking
   */
  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);
    if (!entry) {
      return null;
    }

    // Update access statistics
    entry.accessCount++;
    entry.lastAccessed = Date.now();

    // Decompress if needed
    let data = entry.data;
    if (entry.compressed) {
      try {
        data = await this.decompressData(entry.data);
      } catch (error) {
        this.logger.error(`Failed to decompress cache entry ${key}:`, error);
        this.delete(key);
        return null;
      }
    }

    return data;
  }

  /**
   * Delete cache entry and update memory usage
   */
  delete(key: string): boolean {
    const entry = this.cache.get(key);
    if (entry) {
      this.memoryUsage -= entry.size;
      this.cache.delete(key);
      return true;
    }
    return false;
  }

  /**
   * Clear all cache entries for a specific provider
   */
  clearProvider(providerName: string): void {
    for (const [key, entry] of this.cache.entries()) {
      if (entry.provider === providerName) {
        this.delete(key);
      }
    }
    this.logger.log(`Cleared cache for provider: ${providerName}`);
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    totalEntries: number;
    memoryUsage: number;
    hitRate: number;
    providerBreakdown: Record<string, number>;
    compressionRatio: number;
  } {
    const providerBreakdown: Record<string, number> = {};
    let compressedEntries = 0;
    let totalCompressedSize = 0;
    let totalUncompressedSize = 0;

    for (const [key, entry] of this.cache.entries()) {
      providerBreakdown[entry.provider] =
        (providerBreakdown[entry.provider] || 0) + 1;

      if (entry.compressed) {
        compressedEntries++;
        totalCompressedSize += entry.size;
        // Estimate original size (rough calculation)
        totalUncompressedSize += entry.size * 3; // Assume 3:1 compression ratio
      }
    }

    return {
      totalEntries: this.cache.size,
      memoryUsage: this.memoryUsage,
      hitRate: 0, // This would need to be tracked separately
      providerBreakdown,
      compressionRatio:
        totalUncompressedSize > 0
          ? totalUncompressedSize / totalCompressedSize
          : 1,
    };
  }

  /**
   * Evict least valuable entries to free memory
   */
  private async evictLeastValuable(requiredSpace: number): Promise<void> {
    const entries = Array.from(this.cache.entries());

    // Sort by value (considering access frequency, recency, and priority)
    entries.sort(([keyA, entryA], [keyB, entryB]) => {
      const configA = this.providerConfigs.get(entryA.provider);
      const configB = this.providerConfigs.get(entryB.provider);

      const priorityScoreA = this.getPriorityScore(
        configA?.priority || 'normal',
      );
      const priorityScoreB = this.getPriorityScore(
        configB?.priority || 'normal',
      );

      const valueA = this.calculateEntryValue(entryA, priorityScoreA);
      const valueB = this.calculateEntryValue(entryB, priorityScoreB);

      return valueA - valueB; // Lower value = more likely to evict
    });

    let freedSpace = 0;
    const now = Date.now();

    for (const [key, entry] of entries) {
      if (freedSpace >= requiredSpace) break;

      this.delete(key);
      freedSpace += entry.size;

      this.logger.debug(
        `Evicted cache entry ${key} (${entry.size} bytes, provider: ${entry.provider})`,
      );
    }

    this.logger.log(`Evicted ${freedSpace} bytes to free memory`);
  }

  /**
   * Calculate entry value for eviction decisions
   */
  private calculateEntryValue(
    entry: CacheEntry,
    priorityScore: number,
  ): number {
    const now = Date.now();
    const age = now - entry.timestamp;
    const timeSinceLastAccess = now - entry.lastAccessed;

    // Higher frequency = higher value
    const frequencyScore = entry.accessCount / Math.max(age / 1000, 1);

    // More recent access = higher value
    const recencyScore = 1 / Math.max(timeSinceLastAccess / 1000, 1);

    // Combine all factors
    return frequencyScore * recencyScore * priorityScore;
  }

  /**
   * Get priority score for eviction calculations
   */
  private getPriorityScore(priority: string): number {
    switch (priority) {
      case 'high':
        return 3;
      case 'normal':
        return 2;
      case 'low':
        return 1;
      default:
        return 2;
    }
  }

  /**
   * Calculate approximate size of data in bytes
   */
  private calculateSize(data: CacheableData): number {
    try {
      return JSON.stringify(data).length * 2; // Rough estimate for UTF-16
    } catch {
      return 1024; // Default estimate
    }
  }

  /**
   * Compress data using simple JSON compression
   */
  private async compressData(data: CacheableData): Promise<string> {
    // In a real implementation, you'd use a proper compression library like zlib
    // For this example, we'll use a simple JSON minification
    return JSON.stringify(data);
  }

  /**
   * Decompress data
   */
  private async decompressData(compressedData: string): Promise<CacheableData> {
    // In a real implementation, you'd use the corresponding decompression
    return JSON.parse(compressedData) as CacheableData;
  }

  /**
   * Shutdown and cleanup
   */
  async shutdown(): Promise<void> {
    this.cache.clear();
    this.providerConfigs.clear();
    this.memoryUsage = 0;
    this.logger.log('Memory optimized cache shutdown complete');
  }
}
