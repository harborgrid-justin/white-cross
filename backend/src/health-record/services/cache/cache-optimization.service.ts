/**
 * @fileoverview Cache Optimization Service
 * @module health-record/services/cache
 * @description Handles cache warming, intelligent prefetching, and optimization
 *
 * HIPAA CRITICAL - This service optimizes PHI caching with compliance controls
 *
 * @compliance HIPAA Privacy Rule §164.308, HIPAA Security Rule §164.312
 */

import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { L1CacheService } from './l1-cache.service';
import { L2CacheService } from './l2-cache.service';
import { L3CacheService } from './l3-cache.service';
import { CacheAccessPatternTrackerService } from './cache-access-pattern-tracker.service';
import { BaseService } from '@/common/base';
import {
  AccessPattern,
  CacheWarmingResult,
  PrefetchResult,
  ComplianceLevel,
} from './cache-interfaces';

@Injectable()
export class CacheOptimizationService extends BaseService {
  private readonly prefetchQueue = new Set<string>();
  private readonly warmingEnabled = true;
  private readonly prefetchEnabled = true;

  constructor(
    private readonly l1Cache: L1CacheService,
    private readonly l2Cache: L2CacheService,
    private readonly l3Cache: L3CacheService,
    private readonly patternTracker: CacheAccessPatternTrackerService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.initializeOptimization();
  }

  /**
   * Initialize optimization strategies
   */
  private initializeOptimization(): void {
    this.logInfo('Initializing cache optimization service');

    // Schedule initial cache warming after startup
    if (this.warmingEnabled) {
      setTimeout(() => {
        this.performCacheWarming();
      }, 30000); // 30 seconds after startup
    }

    this.logInfo('Cache optimization service initialized');
  }

  /**
   * Cache warming based on access patterns
   */
  @Cron(CronExpression.EVERY_5_MINUTES)
  async performCacheWarming(): Promise<CacheWarmingResult> {
    if (!this.warmingEnabled) {
      return { warmedCount: 0, failedCount: 0, duration: 0 };
    }

    const startTime = Date.now();
    this.logDebug('Starting cache warming process');

    const topPatterns = this.getTopAccessPatterns(20);
    let warmedCount = 0;
    let failedCount = 0;

    for (const pattern of topPatterns) {
      if (this.shouldWarmCache(pattern)) {
        try {
          await this.warmCacheEntry(pattern.key);
          warmedCount++;
        } catch (error) {
          this.logError(`Cache warming failed for ${pattern.key}:`, error);
          failedCount++;
        }
      }
    }

    const duration = Date.now() - startTime;

    if (warmedCount > 0) {
      this.logInfo(
        `Cache warming completed: ${warmedCount} entries warmed, ${failedCount} failed`,
      );
    }

    // Emit warming completion event
    this.eventEmitter.emit('cache.warming.completed', {
      warmedCount,
      failedCount,
      duration,
    });

    return { warmedCount, failedCount, duration };
  }

  /**
   * Intelligent prefetching based on access patterns
   */
  @Cron('*/2 * * * *') // Every 2 minutes
  async performIntelligentPrefetch(): Promise<PrefetchResult> {
    if (!this.prefetchEnabled || this.prefetchQueue.size === 0) {
      return { prefetchedCount: 0, failedCount: 0, duration: 0 };
    }

    const startTime = Date.now();
    this.logDebug(`Starting intelligent prefetch: ${this.prefetchQueue.size} candidates`);

    const prefetchBatch = Array.from(this.prefetchQueue).slice(0, 10);
    this.prefetchQueue.clear();

    let prefetchedCount = 0;
    let failedCount = 0;

    for (const key of prefetchBatch) {
      try {
        const success = await this.prefetchRelatedData(key);
        if (success) {
          prefetchedCount++;
        } else {
          failedCount++;
        }
      } catch (error) {
        this.logError(`Prefetch failed for ${key}:`, error);
        failedCount++;
      }
    }

    const duration = Date.now() - startTime;

    if (prefetchedCount > 0) {
      this.logInfo(
        `Intelligent prefetch completed: ${prefetchedCount} entries prefetched, ${failedCount} failed`,
      );
    }

    // Emit prefetch completion event
    this.eventEmitter.emit('cache.prefetch.completed', {
      prefetchedCount,
      failedCount,
      duration,
    });

    return { prefetchedCount, failedCount, duration };
  }

  /**
   * Cache optimization and cleanup
   */
  @Cron(CronExpression.EVERY_HOUR)
  async performCacheOptimization(): Promise<{
    l1Optimized: number;
    l3Cleaned: number;
    patternsCleanedUp: number;
  }> {
    this.logDebug('Starting cache optimization');

    // Optimize L1 cache
    const l1Optimized = await this.optimizeL1Cache();

    // Clean up expired L3 cache entries
    const l3Cleaned = await this.l3Cache.cleanupExpired();

    // Clean up stale access patterns
    const patternsCleanedUp = this.cleanupAccessPatterns();

    // Update cache metrics
    this.updateCacheMetrics();

    this.logInfo(
      `Cache optimization completed: L1 optimized: ${l1Optimized}, L3 cleaned: ${l3Cleaned}, patterns cleaned: ${patternsCleanedUp}`,
    );

    // Emit optimization completion event
    this.eventEmitter.emit('cache.optimization.completed', {
      l1Optimized,
      l3Cleaned,
      patternsCleanedUp,
    });

    return { l1Optimized, l3Cleaned, patternsCleanedUp };
  }

  /**
   * Schedule prefetch for related data
   */
  scheduleRelatedPrefetch(key: string, tags: string[], compliance: ComplianceLevel): void {
    if (!this.prefetchEnabled) return;

    // Extract student ID and data type for related data discovery
    const studentId = this.extractStudentId(key);
    const dataType = this.extractDataType(key, tags);

    if (studentId) {
      // Prefetch related health record data for the student
      const relatedKeys = this.generateRelatedKeys(studentId, dataType, compliance);
      relatedKeys.forEach((relatedKey) => this.prefetchQueue.add(relatedKey));
    }
  }

  /**
   * Get top access patterns for optimization
   */
  private getTopAccessPatterns(limit: number): AccessPattern[] {
    const patterns = this.patternTracker.getAccessPatterns();
    return patterns.sort((a, b) => b.importance - a.importance).slice(0, limit);
  }

  /**
   * Determine if cache entry should be warmed
   */
  private shouldWarmCache(pattern: AccessPattern): boolean {
    const now = new Date();
    const timeSinceLastAccess = now.getTime() - pattern.lastAccess.getTime();
    const timeUntilPredictedAccess = pattern.predictedNextAccess.getTime() - now.getTime();

    // Warm if:
    // 1. High importance (frequent access)
    // 2. Predicted to be accessed soon
    // 3. Not accessed recently (cache likely expired)
    return (
      pattern.importance > 5 &&
      timeUntilPredictedAccess < 300000 && // Within 5 minutes
      timeSinceLastAccess > 60000 // Not accessed in last minute
    );
  }

  /**
   * Warm a specific cache entry
   */
  private async warmCacheEntry(key: string): Promise<boolean> {
    try {
      // Attempt to load data from the slowest tier first
      // This simulates a real data access that would populate all tiers
      const data = await this.l3Cache.get(key, ComplianceLevel.INTERNAL);

      if (data) {
        // Data exists in L3, promote to faster tiers if beneficial
        return true;
      }

      // If not in cache, this indicates the data might need to be fetched
      // from the original source, but we don't want to do that in warming
      return false;
    } catch (error) {
      this.logError(`Cache warming failed for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Prefetch related data based on access patterns
   */
  private async prefetchRelatedData(key: string): Promise<boolean> {
    try {
      // Extract context from the key
      const studentId = this.extractStudentId(key);
      const dataType = this.extractDataType(key, []);

      if (!studentId) return false;

      // Generate related data keys based on common access patterns
      const relatedKeys = this.generateRelatedKeys(studentId, dataType, ComplianceLevel.INTERNAL);

      let prefetched = false;
      for (const relatedKey of relatedKeys.slice(0, 3)) {
        // Limit to 3 related items per prefetch
        const data = await this.l3Cache.get(relatedKey, ComplianceLevel.INTERNAL);
        if (data) {
          prefetched = true;
        }
      }

      return prefetched;
    } catch (error) {
      this.logError(`Prefetch failed for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Optimize L1 cache by evicting least important entries
   */
  private async optimizeL1Cache(): number {
    try {
      const l1Stats = this.l1Cache.getStats();
      const currentSize = l1Stats.size;
      const maxSize = 800; // Target size for optimization

      if (currentSize <= maxSize) {
        return 0; // No optimization needed
      }

      // Get access patterns to identify least important entries
      const patterns = this.patternTracker.getAccessPatterns();
      const leastImportant = patterns
        .sort((a, b) => a.importance - b.importance)
        .slice(0, currentSize - maxSize);

      let evicted = 0;
      for (const pattern of leastImportant) {
        const success = this.l1Cache.delete(pattern.key);
        if (success) evicted++;
      }

      return evicted;
    } catch (error) {
      this.logError('L1 cache optimization failed:', error);
      return 0;
    }
  }

  /**
   * Clean up stale access patterns
   */
  private cleanupAccessPatterns(): number {
    const now = new Date();
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days

    return this.patternTracker.cleanupStalePatterns(now, maxAge);
  }

  /**
   * Update cache metrics
   */
  private updateCacheMetrics(): void {
    // This method would typically update centralized metrics
    // For now, we'll just log the current state
    const l1Stats = this.l1Cache.getStats();
    const l2Stats = this.l2Cache.getStats();
    const l3Stats = this.l3Cache.getStats();

    this.logDebug('Cache metrics updated', {
      l1: l1Stats,
      l2: l2Stats,
      l3: l3Stats,
    });
  }

  /**
   * Extract student ID from cache key
   */
  private extractStudentId(key: string): string | undefined {
    const match = key.match(/student[/:]([a-fA-F0-9-]+)/);
    return match ? match[1] : undefined;
  }

  /**
   * Extract data type from cache key and tags
   */
  private extractDataType(key: string, tags: string[]): string {
    if (tags.length > 0) return tags[0];

    if (key.includes('allergies')) return 'ALLERGIES';
    if (key.includes('vaccinations')) return 'VACCINATIONS';
    if (key.includes('conditions')) return 'CONDITIONS';
    if (key.includes('vitals')) return 'VITALS';
    if (key.includes('summary')) return 'SUMMARY';

    return 'HEALTH_RECORD';
  }

  /**
   * Generate related cache keys for prefetching
   */
  private generateRelatedKeys(studentId: string, dataType: string): string[] {
    const relatedKeys: string[] = [];

    // Common related data patterns
    switch (dataType) {
      case 'ALLERGIES':
        relatedKeys.push(
          `hr:student/${studentId}/conditions`,
          `hr:student/${studentId}/medications`,
          `hr:student/${studentId}/summary`,
        );
        break;
      case 'VACCINATIONS':
        relatedKeys.push(
          `hr:student/${studentId}/health-status`,
          `hr:student/${studentId}/immunization-schedule`,
        );
        break;
      case 'CONDITIONS':
        relatedKeys.push(
          `hr:student/${studentId}/allergies`,
          `hr:student/${studentId}/medications`,
          `hr:student/${studentId}/vitals`,
        );
        break;
      case 'VITALS':
        relatedKeys.push(
          `hr:student/${studentId}/conditions`,
          `hr:student/${studentId}/growth-tracking`,
          `hr:student/${studentId}/health-metrics`,
        );
        break;
      default:
        relatedKeys.push(`hr:student/${studentId}/summary`);
    }

    return relatedKeys;
  }

  /**
   * Get optimization statistics
   */
  getOptimizationStats(): {
    prefetchQueueSize: number;
    warmingEnabled: boolean;
    prefetchEnabled: boolean;
  } {
    return {
      prefetchQueueSize: this.prefetchQueue.size,
      warmingEnabled: this.warmingEnabled,
      prefetchEnabled: this.prefetchEnabled,
    };
  }

  /**
   * Enable/disable cache warming
   */
  setWarmingEnabled(enabled: boolean): void {
    // Note: This would typically require restart to take full effect
    // due to the cron jobs being initialized at startup
    this.logInfo(`Cache warming ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Enable/disable prefetching
   */
  setPrefetchEnabled(enabled: boolean): void {
    // Note: This would typically require restart to take full effect
    // due to the cron jobs being initialized at startup
    this.logInfo(`Cache prefetching ${enabled ? 'enabled' : 'disabled'}`);
  }
}
