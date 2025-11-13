/**
 * @fileoverview Advanced Cache Strategy Service - Facade/Compatibility Layer
 * @module health-record/services
 * @description Facade for the new modular multi-tier caching strategy
 *
 * HIPAA CRITICAL - This service provides backward compatibility while delegating to modular services
 *
 * @compliance HIPAA Privacy Rule §164.308, HIPAA Security Rule §164.312
 */

import { Injectable, OnModuleDestroy, Inject } from '@nestjs/common';
import { CacheStrategyOrchestratorService } from './cache/cache-strategy-orchestrator.service';
import { CacheOptimizationService } from './cache/cache-optimization.service';
import { BaseService } from '@/common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { CacheMetrics, AccessPattern, ComplianceLevel } from './cache/cache-interfaces';

/**
 * Advanced Cache Strategy Service - Facade Pattern
 *
 * This service acts as a facade/compatibility layer that delegates
 * to the new modular cache services. This maintains backward compatibility
 * while using the improved modular architecture.
 */
@Injectable()
export class CacheStrategyService extends BaseService implements OnModuleDestroy {
  constructor(
    @Inject(LoggerService) logger: LoggerService,
    private readonly orchestrator: CacheStrategyOrchestratorService,
    private readonly optimization: CacheOptimizationService,
  ) {
    super({
      serviceName: 'CacheStrategyService',
      logger,
      enableAuditLogging: true,
    });

    this.logInfo('Cache Strategy Service (Facade) initialized - delegating to modular services');
  }

  /**
   * Get data from cache with intelligent tier fallback
   */
  async get<T>(key: string, compliance: ComplianceLevel): Promise<T | null> {
    const result = await this.orchestrator.get<T>(key, compliance);
    return result.success ? result.data || null : null;
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
  ): Promise<void> {
    await this.orchestrator.set(key, data, ttl, compliance, tags);
  }

  /**
   * Intelligent cache invalidation with dependency tracking
   */
  async invalidate(pattern: string | string[], reason: string = 'manual'): Promise<void> {
    await this.orchestrator.invalidate(pattern, reason);
  }

  /**
   * Get cache performance metrics
   */
  getCacheMetrics(): CacheMetrics {
    return this.orchestrator.getCacheMetrics();
  }

  /**
   * Get access patterns for analytics
   */
  getAccessPatterns(): AccessPattern[] {
    return this.orchestrator.getAccessPatterns();
  }

  /**
   * Delegate cache warming to optimization service
   */
  async performCacheWarming(): Promise<void> {
    await this.optimization.performCacheWarming();
  }

  /**
   * Delegate intelligent prefetching to optimization service
   */
  async performIntelligentPrefetch(): Promise<void> {
    await this.optimization.performIntelligentPrefetch();
  }

  /**
   * Delegate cache optimization to optimization service
   */
  async performCacheOptimization(): Promise<void> {
    await this.optimization.performCacheOptimization();
  }

  /**
   * Cleanup resources
   */
  onModuleDestroy(): void {
    this.logInfo('Cache Strategy Service (Facade) destroyed');
  }
}
