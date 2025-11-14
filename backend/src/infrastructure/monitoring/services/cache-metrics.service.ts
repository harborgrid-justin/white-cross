/**
 * @fileoverview Cache Metrics Service
 * @module infrastructure/monitoring/services
 * @description Service for tracking cache performance and operations
 */

import { Injectable, Logger } from '@nestjs/common';
import { CacheMetrics, CacheOperation } from '../types/metrics.types';

import { BaseService } from '@/common/base';
@Injectable()
export class CacheMetricsService extends BaseService {
  constructor() {
    super('CacheMetricsService');
  }

  private cacheMetrics: CacheMetrics = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
    hitRate: 0,
    avgHitDuration: 0,
    avgMissDuration: 0,
    cacheSize: 0,
    evictions: 0,
  };

  /**
   * Record cache operation
   */
  recordCacheOperation(operation: CacheOperation, duration?: number): void {
    switch (operation) {
      case 'hit':
        this.cacheMetrics.hits++;
        if (duration) {
          this.cacheMetrics.avgHitDuration = (this.cacheMetrics.avgHitDuration + duration) / 2;
        }
        break;
      case 'miss':
        this.cacheMetrics.misses++;
        if (duration) {
          this.cacheMetrics.avgMissDuration = (this.cacheMetrics.avgMissDuration + duration) / 2;
        }
        break;
      case 'set':
        this.cacheMetrics.sets++;
        break;
      case 'delete':
        this.cacheMetrics.deletes++;
        break;
      case 'eviction':
        this.cacheMetrics.evictions++;
        break;
    }

    // Update hit rate
    this.updateHitRate();
  }

  /**
   * Update cache size
   */
  updateCacheSize(size: number): void {
    this.cacheMetrics.cacheSize = size;
  }

  /**
   * Get current cache metrics
   */
  getCacheMetrics(): CacheMetrics {
    return { ...this.cacheMetrics };
  }

  /**
   * Get cache hit rate
   */
  getHitRate(): number {
    return this.cacheMetrics.hitRate;
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    totalOperations: number;
    hitRate: number;
    missRate: number;
    avgHitDuration: number;
    avgMissDuration: number;
    cacheSize: number;
    evictions: number;
  } {
    const totalOperations = this.cacheMetrics.hits + this.cacheMetrics.misses;

    return {
      totalOperations,
      hitRate: this.cacheMetrics.hitRate,
      missRate: totalOperations > 0 ? this.cacheMetrics.misses / totalOperations : 0,
      avgHitDuration: this.cacheMetrics.avgHitDuration,
      avgMissDuration: this.cacheMetrics.avgMissDuration,
      cacheSize: this.cacheMetrics.cacheSize,
      evictions: this.cacheMetrics.evictions,
    };
  }

  /**
   * Reset cache metrics
   */
  reset(): void {
    this.cacheMetrics = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
      hitRate: 0,
      avgHitDuration: 0,
      avgMissDuration: 0,
      cacheSize: 0,
      evictions: 0,
    };
    this.logInfo('Cache metrics reset');
  }

  /**
   * Update hit rate calculation
   */
  private updateHitRate(): void {
    const total = this.cacheMetrics.hits + this.cacheMetrics.misses;
    this.cacheMetrics.hitRate = total > 0 ? this.cacheMetrics.hits / total : 0;
  }
}
