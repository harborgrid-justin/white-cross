/**
 * @fileoverview Cache Metrics Collector Service
 * @module health-record/services/cache
 * @description Collects and aggregates cache performance metrics
 */

import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  CacheMetrics,
  CachePerformanceStats,
  TierMetrics,
} from './cache-interfaces';
import { CACHE_CONSTANTS, CACHE_EVENTS } from './cache-constants';

import { BaseService } from '../../common/base';
@Injectable()
export class CacheMetricsCollectorService extends BaseService {
  private readonly metrics: CacheMetrics = this.initializeMetrics();

  constructor(private readonly eventEmitter: EventEmitter2) {
    this.setupEventListeners();
  }

  recordOperation(operation: string, tier: string, success: boolean, responseTime: number): void {
    try {
      const tierMetrics = this.getOrCreateTierMetrics(tier);

      tierMetrics.totalOperations++;
      if (success) {
        tierMetrics.successfulOperations++;
      } else {
        tierMetrics.failedOperations++;
      }

      // Update response time statistics
      this.updateResponseTimeStats(tierMetrics, responseTime);

      // Update global metrics
      this.metrics.totalOperations++;
      if (success) {
        this.metrics.totalHits++;
      } else {
        this.metrics.totalMisses++;
      }

      this.metrics.lastUpdated = new Date();
    } catch (error) {
      this.logError(`Failed to record operation metrics:`, error);
    }
  }

  recordCacheSize(tier: string, size: number, itemCount: number): void {
    try {
      const tierMetrics = this.getOrCreateTierMetrics(tier);
      tierMetrics.currentSize = size;
      tierMetrics.itemCount = itemCount;
      tierMetrics.lastSizeUpdate = new Date();

      // Update global cache size
      this.updateGlobalCacheSize();
    } catch (error) {
      this.logError(`Failed to record cache size metrics:`, error);
    }
  }

  recordEviction(tier: string, reason: string, evictedItems: number): void {
    try {
      const tierMetrics = this.getOrCreateTierMetrics(tier);
      tierMetrics.evictions++;
      tierMetrics.evictedItems += evictedItems;
      tierMetrics.lastEviction = new Date();

      this.metrics.totalEvictions += evictedItems;

      this.logDebug(`Cache eviction in ${tier}: ${evictedItems} items (${reason})`);
    } catch (error) {
      this.logError(`Failed to record eviction metrics:`, error);
    }
  }

  getPerformanceStats(): CachePerformanceStats {
    const now = Date.now();
    const uptime = now - this.metrics.startTime.getTime();

    return {
      uptime,
      totalOperations: this.metrics.totalOperations,
      totalHits: this.metrics.totalHits,
      totalMisses: this.metrics.totalMisses,
      overallHitRate: this.calculateOverallHitRate(),
      averageResponseTime: this.calculateAverageResponseTime(),
      operationsPerSecond: this.metrics.totalOperations / Math.max(1, uptime / 1000),
      tierBreakdown: this.getTierPerformanceBreakdown(),
      memoryUsage: this.calculateMemoryUsage(),
      lastUpdated: this.metrics.lastUpdated,
    };
  }

  getMetricsSummary(): {
    operations: { total: number; hits: number; misses: number; hitRate: number };
    performance: { avgResponseTime: number; opsPerSecond: number };
    memory: { totalSize: number; itemCount: number; usagePercent: number };
  } {
    const stats = this.getPerformanceStats();

    return {
      operations: {
        total: stats.totalOperations,
        hits: stats.totalHits,
        misses: stats.totalMisses,
        hitRate: stats.overallHitRate,
      },
      performance: {
        avgResponseTime: stats.averageResponseTime,
        opsPerSecond: stats.operationsPerSecond,
      },
      memory: {
        totalSize: this.metrics.totalCacheSize,
        itemCount: this.metrics.totalItemCount,
        usagePercent: this.calculateMemoryUsagePercent(),
      },
    };
  }

  getRawMetrics(): CacheMetrics {
    return { ...this.metrics };
  }

  reset(): void {
    Object.assign(this.metrics, this.initializeMetrics());
    this.logInfo('Cache metrics reset');
  }

  private initializeMetrics(): CacheMetrics {
    return {
      startTime: new Date(),
      totalOperations: 0,
      totalHits: 0,
      totalMisses: 0,
      totalEvictions: 0,
      totalCacheSize: 0,
      totalItemCount: 0,
      tiers: new Map(),
      lastUpdated: new Date(),
    };
  }

  private setupEventListeners(): void {
    // Listen for cache access events
    this.eventEmitter.on(CACHE_EVENTS.ACCESS_RECORDED, (data: any) => {
      this.recordOperation('access', data.tier, data.hit, data.responseTime);
    });

    // Listen for cache invalidation events
    this.eventEmitter.on(CACHE_EVENTS.INVALIDATED, (data: { key: string; tier?: string }) => {
      this.recordOperation('invalidate', data.tier || 'unknown', true, 0);
    });

    // Listen for cache warming events
    this.eventEmitter.on(CACHE_EVENTS.WARMED, (data: { key: string; success: boolean; responseTime?: number }) => {
      this.recordOperation('warm', 'unknown', data.success, data.responseTime || 0);
    });
  }

  private getOrCreateTierMetrics(tier: string): TierMetrics {
    let tierMetrics = this.metrics.tiers.get(tier);
    if (!tierMetrics) {
      tierMetrics = {
        tier,
        totalOperations: 0,
        successfulOperations: 0,
        failedOperations: 0,
        evictions: 0,
        evictedItems: 0,
        currentSize: 0,
        itemCount: 0,
        averageResponseTime: 0,
        minResponseTime: Infinity,
        maxResponseTime: 0,
        lastSizeUpdate: new Date(),
        lastEviction: null,
      };
      this.metrics.tiers.set(tier, tierMetrics);
    }
    return tierMetrics;
  }

  private updateResponseTimeStats(tierMetrics: TierMetrics, responseTime: number): void {
    tierMetrics.averageResponseTime = (
      (tierMetrics.averageResponseTime * (tierMetrics.totalOperations - 1)) + responseTime
    ) / tierMetrics.totalOperations;

    tierMetrics.minResponseTime = Math.min(tierMetrics.minResponseTime, responseTime);
    tierMetrics.maxResponseTime = Math.max(tierMetrics.maxResponseTime, responseTime);
  }

  private updateGlobalCacheSize(): void {
    this.metrics.totalCacheSize = 0;
    this.metrics.totalItemCount = 0;

    for (const tierMetrics of this.metrics.tiers.values()) {
      this.metrics.totalCacheSize += tierMetrics.currentSize;
      this.metrics.totalItemCount += tierMetrics.itemCount;
    }
  }

  private calculateOverallHitRate(): number {
    const totalRequests = this.metrics.totalHits + this.metrics.totalMisses;
    return totalRequests > 0 ? this.metrics.totalHits / totalRequests : 0;
  }

  private calculateAverageResponseTime(): number {
    let totalResponseTime = 0;
    let totalOperations = 0;

    for (const tierMetrics of this.metrics.tiers.values()) {
      totalResponseTime += tierMetrics.averageResponseTime * tierMetrics.totalOperations;
      totalOperations += tierMetrics.totalOperations;
    }

    return totalOperations > 0 ? totalResponseTime / totalOperations : 0;
  }

  private calculateMemoryUsage(): number {
    return this.metrics.totalCacheSize;
  }

  private calculateMemoryUsagePercent(): number {
    const maxMemory = CACHE_CONSTANTS.METRICS.MAX_MEMORY_USAGE_BYTES;
    return maxMemory > 0 ? (this.metrics.totalCacheSize / maxMemory) * 100 : 0;
  }

  private getTierPerformanceBreakdown(): Record<string, {
    operations: number;
    hitRate: number;
    avgResponseTime: number;
    size: number;
    itemCount: number;
  }> {
    const breakdown: Record<string, any> = {};

    for (const [tier, metrics] of this.metrics.tiers.entries()) {
      const hitRate = metrics.totalOperations > 0 ?
        metrics.successfulOperations / metrics.totalOperations : 0;

      breakdown[tier] = {
        operations: metrics.totalOperations,
        hitRate,
        avgResponseTime: metrics.averageResponseTime,
        size: metrics.currentSize,
        itemCount: metrics.itemCount,
      };
    }

    return breakdown;
  }
}
