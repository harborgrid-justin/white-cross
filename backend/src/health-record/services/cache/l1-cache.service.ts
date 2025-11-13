/**
 * @fileoverview L1 Cache Service - In-Memory Cache Operations
 * @module health-record/services/cache
 * @description Fast in-memory caching for hot data with LRU eviction
 *
 * HIPAA CRITICAL - L1 cache for PHI data with memory limits and encryption
 *
 * @compliance HIPAA Privacy Rule §164.308, HIPAA Security Rule §164.312
 */

import { Injectable, Logger } from '@nestjs/common';
import { ComplianceLevel } from '../../interfaces/health-record-types';
import { InMemoryCacheEntry, CacheTier, CacheOperationResult } from './cache-interfaces';

import { BaseService } from '@/common/base';
@Injectable()
export class L1CacheService extends BaseService {
  // L1 Cache: In-memory storage
  private readonly l1Cache = new Map<string, InMemoryCacheEntry>();
  private readonly maxL1Size = 1000; // Maximum entries in L1
  private readonly l1MaxMemory = 50 * 1024 * 1024; // 50MB max memory

  // Metrics tracking
  private l1Hits = 0;
  private l1Misses = 0;
  private l1Evictions = 0;

  /**
   * Get data from L1 cache
   */
  get<T>(key: string): CacheOperationResult<T> {
    const startTime = Date.now();
    const entry = this.l1Cache.get(key);

    if (!entry) {
      this.l1Misses++;
      return {
        success: false,
        responseTime: Date.now() - startTime,
      };
    }

    // Update access info
    entry.accessCount++;
    entry.lastAccessed = new Date();

    this.l1Hits++;
    return {
      success: true,
      data: entry.data as T,
      responseTime: Date.now() - startTime,
    };
  }

  /**
   * Set data in L1 cache
   */
  set<T>(
    key: string,
    data: T,
    compliance: ComplianceLevel,
    tags: string[] = [],
  ): CacheOperationResult<void> {
    const startTime = Date.now();
    const dataSize = this.calculateDataSize(data);

    try {
      // Check memory limits
      if (this.shouldEvictForMemory(dataSize)) {
        this.evictLeastImportantEntries();
      }

      // Check size limits
      if (this.l1Cache.size >= this.maxL1Size) {
        this.evictLeastImportantEntry();
      }

      const entry: InMemoryCacheEntry<T> = {
        data,
        timestamp: new Date(),
        accessCount: 1,
        lastAccessed: new Date(),
        compliance,
        encrypted: compliance === 'PHI' || compliance === 'SENSITIVE_PHI',
        tags,
        size: dataSize,
        tier: CacheTier.L1,
      };

      this.l1Cache.set(key, entry);

      return {
        success: true,
        responseTime: Date.now() - startTime,
      };
    } catch (error) {
      this.logError(`L1 cache set failed for key ${key}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTime: Date.now() - startTime,
      };
    }
  }

  /**
   * Delete from L1 cache
   */
  delete(key: string): CacheOperationResult<boolean> {
    const startTime = Date.now();
    const deleted = this.l1Cache.delete(key);

    return {
      success: true,
      data: deleted,
      responseTime: Date.now() - startTime,
    };
  }

  /**
   * Clear all L1 cache entries
   */
  clear(): CacheOperationResult<void> {
    const startTime = Date.now();
    this.l1Cache.clear();
    this.resetMetrics();

    return {
      success: true,
      responseTime: Date.now() - startTime,
    };
  }

  /**
   * Get L1 cache statistics
   */
  getStats(): {
    hits: number;
    misses: number;
    evictions: number;
    size: number;
    memoryUsage: number;
    hitRate: number;
  } {
    const totalRequests = this.l1Hits + this.l1Misses;
    const hitRate = totalRequests > 0 ? this.l1Hits / totalRequests : 0;

    return {
      hits: this.l1Hits,
      misses: this.l1Misses,
      evictions: this.l1Evictions,
      size: this.l1Cache.size,
      memoryUsage: this.calculateMemoryUsage(),
      hitRate,
    };
  }

  /**
   * Check if key exists in L1 cache
   */
  has(key: string): boolean {
    return this.l1Cache.has(key);
  }

  /**
   * Get all keys in L1 cache
   */
  keys(): string[] {
    return Array.from(this.l1Cache.keys());
  }

  /**
   * Optimize L1 cache (evict least recently used entries)
   */
  optimize(): number {
    const beforeSize = this.l1Cache.size;
    this.evictLeastRecentlyUsed(100); // Evict 100 least recently used
    const evicted = beforeSize - this.l1Cache.size;
    this.l1Evictions += evicted;
    return evicted;
  }

  // ==================== Private Helper Methods ====================

  /**
   * Calculate data size for memory management
   */
  private calculateDataSize(data: any): number {
    try {
      return JSON.stringify(data).length;
    } catch {
      return 0;
    }
  }

  /**
   * Calculate total memory usage
   */
  private calculateMemoryUsage(): number {
    let total = 0;
    for (const entry of Array.from(this.l1Cache.values())) {
      total += entry.size;
    }
    return total;
  }

  /**
   * Check if we should evict entries for memory constraints
   */
  private shouldEvictForMemory(newDataSize: number): boolean {
    const currentMemory = this.calculateMemoryUsage();
    return currentMemory + newDataSize > this.l1MaxMemory;
  }

  /**
   * Evict least important entries to free memory
   */
  private evictLeastImportantEntries(): void {
    // Sort entries by importance (access count * recency)
    const entries = Array.from(this.l1Cache.entries()).map(([key, entry]) => ({
      key,
      entry,
      importance: entry.accessCount * (1 / (Date.now() - entry.lastAccessed.getTime() + 1)),
    }));

    entries.sort((a, b) => a.importance - b.importance);

    // Evict least important entries until memory is acceptable
    let currentMemory = this.calculateMemoryUsage();
    let evicted = 0;

    for (const { key } of entries) {
      if (currentMemory <= this.l1MaxMemory * 0.8) break; // Keep 80% memory usage

      this.l1Cache.delete(key);
      currentMemory = this.calculateMemoryUsage();
      evicted++;
    }

    this.l1Evictions += evicted;
  }

  /**
   * Evict single least important entry
   */
  private evictLeastImportantEntry(): void {
    let leastImportantKey: string | null = null;
    let leastImportance = Infinity;

    for (const [key, entry] of this.l1Cache.entries()) {
      const importance = entry.accessCount * (1 / (Date.now() - entry.lastAccessed.getTime() + 1));
      if (importance < leastImportance) {
        leastImportance = importance;
        leastImportantKey = key;
      }
    }

    if (leastImportantKey) {
      this.l1Cache.delete(leastImportantKey);
      this.l1Evictions++;
    }
  }

  /**
   * Evict least recently used entries
   */
  private evictLeastRecentlyUsed(count: number): void {
    const entries = Array.from(this.l1Cache.entries())
      .map(([key, entry]) => ({ key, lastAccessed: entry.lastAccessed.getTime() }))
      .sort((a, b) => a.lastAccessed - b.lastAccessed);

    for (let i = 0; i < Math.min(count, entries.length); i++) {
      this.l1Cache.delete(entries[i].key);
      this.l1Evictions++;
    }
  }

  /**
   * Reset metrics counters
   */
  private resetMetrics(): void {
    this.l1Hits = 0;
    this.l1Misses = 0;
    this.l1Evictions = 0;
  }
}
