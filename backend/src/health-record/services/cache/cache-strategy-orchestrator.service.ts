/**
 * @fileoverview Cache Strategy Orchestrator Service
 * @module health-record/services/cache
 * @description Main orchestrator for multi-tier caching strategy
 *
 * HIPAA CRITICAL - This service orchestrates PHI caching across all tiers with compliance controls
 *
 * @compliance HIPAA Privacy Rule §164.308, HIPAA Security Rule §164.312
 */

import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { HealthRecordMetricsService } from '../health-record-metrics.service';
import { L1CacheService } from './l1-cache.service';
import { L2CacheService } from './l2-cache.service';
import { L3CacheService } from './l3-cache.service';
import { CacheOptimizationService } from './cache-optimization.service';
import { CacheAccessPatternTrackerService } from './cache-access-pattern-tracker.service';
import { BaseService } from '../../common/base';
import { BaseService } from '../../common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { Inject } from '@nestjs/common';
import { BaseService } from '../../common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { Inject } from '@nestjs/common';
import {
  InMemoryCacheEntry,
  CacheTier,
  CacheMetrics,
  AccessPattern,
  ComplianceLevel,
  CacheOperationResult,
} from './cache-interfaces';

/**
 * Main Cache Strategy Orchestrator Service
 *
 * Implements multi-tier caching strategy with:
 * - L1: Fast in-memory cache for hot data
 * - L2: Distributed Redis cache for shared data
 * - L3: Database result cache for complex queries
 * - Intelligent prefetching based on access patterns
 * - HIPAA-compliant cache management
 */
@Injectable()
export class CacheStrategyOrchestratorService implements OnModuleDestroy {
  constructor(
    @Inject(LoggerService) logger: LoggerService,
    private readonly metricsService: HealthRecordMetricsService,
    private readonly eventEmitter: EventEmitter2,
    private readonly l1Cache: L1CacheService,
    private readonly l2Cache: L2CacheService,
    private readonly l3Cache: L3CacheService,
    private readonly optimization: CacheOptimizationService,
    private readonly patternTracker: CacheAccessPatternTrackerService,
  ) {
    super({
      serviceName: 'CacheStrategyOrchestratorService',
      logger,
      enableAuditLogging: true,
    });

    this.initializeCacheStrategy();
    this.setupEventListeners();
  }

  /**
   * Initialize cache strategy and start monitoring
   */
  private initializeCacheStrategy(): void {
    this.logInfo('Initializing advanced multi-tier cache strategy orchestrator');
    this.logInfo('Cache strategy orchestrator initialized successfully');
  }

  /**
   * Get data from cache with intelligent tier fallback
   */
  async get<T>(key: string, compliance: ComplianceLevel): Promise<CacheOperationResult<T>> {
    const startTime = Date.now();

    try {
      // Try L1 cache first (fastest)
      const l1Result = await this.l1Cache.get<T>(key, compliance);
      if (l1Result !== null) {
        this.patternTracker.updateAccessPattern(key, 'L1_HIT');
        this.recordCacheHit('L1', Date.now() - startTime);
        return {
          success: true,
          data: l1Result,
          responseTime: Date.now() - startTime,
          tier: CacheTier.L1,
        };
      }

      // Try L2 cache (Redis)
      const l2Result = await this.l2Cache.get<T>(key, compliance);
      if (l2Result !== null) {
        // Promote to L1 if appropriate
        await this.promoteToL1(key, l2Result, compliance);
        this.patternTracker.updateAccessPattern(key, 'L2_HIT');
        this.recordCacheHit('L2', Date.now() - startTime);
        return {
          success: true,
          data: l2Result,
          responseTime: Date.now() - startTime,
          tier: CacheTier.L2,
        };
      }

      // Try L3 cache (Database result cache)
      const l3Result = await this.l3Cache.get<T>(key, compliance);
      if (l3Result !== null) {
        // Consider promoting to higher tiers
        await this.considerPromotion(key, l3Result, compliance);
        this.patternTracker.updateAccessPattern(key, 'L3_HIT');
        this.recordCacheHit('L3', Date.now() - startTime);
        return {
          success: true,
          data: l3Result,
          responseTime: Date.now() - startTime,
          tier: CacheTier.L3,
        };
      }

      // Cache miss across all tiers
      this.patternTracker.updateAccessPattern(key, 'MISS');
      this.recordCacheMiss(Date.now() - startTime);

      return {
        success: false,
        responseTime: Date.now() - startTime,
      };
    } catch (error) {
      this.logError(`Cache get operation failed for key ${key}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTime: Date.now() - startTime,
      };
    }
  }

  /**
   * Set data in cache with intelligent tier placement
   */
  async set<T>(
    key: string,
    data: T,
    ttl: number,
    compliance: ComplianceLevel,
    tags: string[] = [],
  ): Promise<CacheOperationResult<void>> {
    const startTime = Date.now();
    const dataSize = this.calculateDataSize(data);

    try {
      const cacheEntry: InMemoryCacheEntry<T> = {
        data,
        timestamp: new Date(),
        accessCount: 1,
        lastAccessed: new Date(),
        compliance,
        encrypted: compliance === ComplianceLevel.PHI || compliance === ComplianceLevel.SENSITIVE_PHI,
        tags,
        size: dataSize,
        tier: this.determineBestTier(key, dataSize, compliance),
      };

      // Set in appropriate tier based on strategy
      await this.setInOptimalTier(key, cacheEntry, ttl);

      // Update access patterns
      this.patternTracker.updateAccessPattern(key, 'SET', {
        dataType: this.extractDataType(key, tags),
      });

      // Record metrics
      this.recordCacheSet(cacheEntry.tier, Date.now() - startTime, dataSize);

      // Consider prefetching related data
      this.optimization.scheduleRelatedPrefetch(key, tags, compliance);

      return {
        success: true,
        responseTime: Date.now() - startTime,
        tier: cacheEntry.tier,
      };
    } catch (error) {
      this.logError(`Cache set operation failed for key ${key}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTime: Date.now() - startTime,
      };
    }
  }

  /**
   * Intelligent cache invalidation with dependency tracking
   */
  async invalidate(
    pattern: string | string[],
    reason: string = 'manual',
  ): Promise<{ invalidatedCount: number; tiersAffected: CacheTier[] }> {
    const patterns = Array.isArray(pattern) ? pattern : [pattern];
    let invalidatedCount = 0;
    const tiersAffected = new Set<CacheTier>();

    for (const pat of patterns) {
      // Invalidate from all tiers
      const l1Count = await this.l1Cache.invalidate(pat);
      const l2Count = await this.l2Cache.invalidate(pat);
      const l3Count = await this.l3Cache.invalidate(pat);

      if (l1Count > 0) tiersAffected.add(CacheTier.L1);
      if (l2Count > 0) tiersAffected.add(CacheTier.L2);
      if (l3Count > 0) tiersAffected.add(CacheTier.L3);

      invalidatedCount += l1Count + l2Count + l3Count;

      // Remove from access patterns
      this.patternTracker.removeAccessPattern(pat);
    }

    this.logInfo(
      `Cache invalidation completed: ${invalidatedCount} entries removed, reason: ${reason}`,
    );

    // Emit invalidation event for dependent systems
    this.eventEmitter.emit('cache.invalidated', {
      patterns,
      reason,
      count: invalidatedCount,
      tiersAffected: Array.from(tiersAffected),
    });

    return {
      invalidatedCount,
      tiersAffected: Array.from(tiersAffected),
    };
  }

  /**
   * Get comprehensive cache performance metrics
   */
  getCacheMetrics(): CacheMetrics {
    const l1Stats = this.l1Cache.getStats();
    const l2Stats = this.l2Cache.getStats();
    const l3Stats = this.l3Cache.getStats();

    const totalHits = l1Stats.hits + l2Stats.hits + l3Stats.hits;
    const totalMisses = l1Stats.misses + l2Stats.misses + l3Stats.misses;
    const totalRequests = totalHits + totalMisses;

    return {
      l1Stats,
      l2Stats,
      l3Stats,
      overall: {
        hitRate: totalRequests > 0 ? totalHits / totalRequests : 0,
        averageResponseTime: this.calculateAverageResponseTime(),
        totalMemoryUsage: l1Stats.memoryUsage || 0,
      },
    };
  }

  /**
   * Get access patterns for analytics
   */
  getAccessPatterns(): AccessPattern[] {
    return this.patternTracker
      .getAccessPatterns()
      .sort((a, b) => b.importance - a.importance)
      .slice(0, 100); // Top 100 patterns
  }

  // ==================== Private Helper Methods ====================

  /**
   * Promote data to L1 cache
   */
  private async promoteToL1<T>(
    key: string,
    data: T,
    compliance: ComplianceLevel,
  ): Promise<void> {
    const entry: InMemoryCacheEntry<T> = {
      data,
      timestamp: new Date(),
      accessCount: 1,
      lastAccessed: new Date(),
      compliance,
      encrypted: compliance === ComplianceLevel.PHI || compliance === ComplianceLevel.SENSITIVE_PHI,
      tags: [],
      size: this.calculateDataSize(data),
      tier: CacheTier.L1,
    };

    await this.l1Cache.set(key, entry, 3600); // 1 hour TTL for promoted data
  }

  /**
   * Consider promoting data to higher tiers
   */
  private async considerPromotion<T>(
    key: string,
    data: T,
    compliance: ComplianceLevel,
  ): Promise<void> {
    // Simple promotion logic - could be enhanced with access frequency analysis
    const pattern = this.patternTracker.getAccessPattern(key);
    if (pattern && pattern.frequency > 3) {
      await this.promoteToL1(key, data, compliance);
    }
  }

  /**
   * Determine best tier for caching based on data characteristics
   */
  private determineBestTier(
    key: string,
    dataSize: number,
    compliance: ComplianceLevel,
  ): CacheTier {
    // PHI data should prefer L1 for faster access and better security
    if (compliance === ComplianceLevel.PHI || compliance === ComplianceLevel.SENSITIVE_PHI) {
      return dataSize < 1024 * 10 ? CacheTier.L1 : CacheTier.L2; // < 10KB goes to L1
    }

    // Large data goes to L3
    if (dataSize > 1024 * 100) {
      // > 100KB
      return CacheTier.L3;
    }

    // Medium data to L2
    if (dataSize > 1024 * 10) {
      // > 10KB
      return CacheTier.L2;
    }

    // Small data to L1
    return CacheTier.L1;
  }

  /**
   * Set data in optimal tier
   */
  private async setInOptimalTier<T>(
    key: string,
    entry: InMemoryCacheEntry<T>,
    ttl: number,
  ): Promise<void> {
    switch (entry.tier) {
      case CacheTier.L1:
        await this.l1Cache.set(key, entry, ttl);
        break;
      case CacheTier.L2:
        await this.l2Cache.set(key, entry, ttl);
        break;
      case CacheTier.L3:
        await this.l3Cache.set(key, entry, ttl);
        break;
    }
  }

  /**
   * Calculate data size for cache management
   */
  private calculateDataSize(data: unknown): number {
    try {
      return JSON.stringify(data).length;
    } catch {
      return 0;
    }
  }

  /**
   * Extract data type from cache key
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
   * Setup event listeners for cache invalidation
   */
  private setupEventListeners(): void {
    this.eventEmitter.on('health-record.created', (data: { studentId: string }) => {
      this.invalidateStudentCache(data.studentId);
    });

    this.eventEmitter.on('health-record.updated', (data: { studentId: string }) => {
      this.invalidateStudentCache(data.studentId);
    });

    this.eventEmitter.on('health-record.deleted', (data: { studentId: string }) => {
      this.invalidateStudentCache(data.studentId);
    });
  }

  /**
   * Invalidate all cache entries for a student
   */
  private async invalidateStudentCache(studentId: string): Promise<void> {
    const patterns = [
      `hr:*student/${studentId}*`,
      `hr:*student:${studentId}*`,
      `hr:*students:${studentId}*`,
    ];

    await this.invalidate(patterns, 'student_data_changed');
  }

  /**
   * Record cache hit metrics
   */
  private recordCacheHit(tier: string, responseTime: number): void {
    this.metricsService.recordCacheMetrics('HIT', tier as any, responseTime);
  }

  /**
   * Record cache miss metrics
   */
  private recordCacheMiss(responseTime: number): void {
    this.metricsService.recordCacheMetrics('MISS', 'MULTI_TIER', responseTime);
  }

  /**
   * Record cache set metrics
   */
  private recordCacheSet(
    tier: CacheTier,
    responseTime: number,
    dataSize: number,
  ): void {
    this.metricsService.recordCacheMetrics('SET', tier as any, responseTime);
  }

  /**
   * Calculate average response time across all tiers
   */
  private calculateAverageResponseTime(): number {
    // This would typically be calculated from historical metrics
    // For now, return a simple average
    return 50; // 50ms average
  }

  /**
   * Cleanup resources
   */
  onModuleDestroy(): void {
    this.logInfo('Cache Strategy Orchestrator Service destroyed');
  }
}
