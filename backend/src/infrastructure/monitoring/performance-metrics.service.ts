/**
 * @fileoverview Performance Metrics Service
 * @module infrastructure/monitoring
 * @description Main service orchestrating all performance monitoring functionality
 */

import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { RequestMetrics, CacheMetrics, PerformanceSummary, PerformanceTrend } from './types/metrics.types';
import { RequestMetricsService } from './services/request-metrics.service';
import { CacheMetricsService } from './services/cache-metrics.service';
import { SystemMetricsService } from './services/system-metrics.service';
import { PerformanceAnalyzerService } from './services/performance-analyzer.service';

import { BaseService } from '@/common/base';

@Injectable()
export class PerformanceMetricsService extends BaseService implements OnModuleInit, OnModuleDestroy {
  private readonly METRICS_RETENTION_HOURS = 24;

  // Intervals
  private metricsCollectionInterval: NodeJS.Timeout | null = null;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor(
    private readonly requestMetrics: RequestMetricsService,
    private readonly cacheMetrics: CacheMetricsService,
    private readonly systemMetrics: SystemMetricsService,
    private readonly performanceAnalyzer: PerformanceAnalyzerService,
  ) {
    super('PerformanceMetricsService');
  }

  async onModuleInit(): Promise<void> {
    this.logInfo('Initializing Performance Metrics Service');
    this.startMetricsCollection();
  }

  /**
   * Start periodic metrics collection
   */
  private startMetricsCollection(): void {
    // Collect metrics every minute
    this.metricsCollectionInterval = setInterval(() => {
      this.systemMetrics.collectSystemMetrics();
      this.performanceAnalyzer.recordPerformanceSummary();
    }, 60000);

    // Cleanup old metrics every hour
    this.cleanupInterval = setInterval(() => {
      this.cleanupOldMetrics();
    }, 3600000);

    this.logInfo('Performance metrics collection started');
  }

  /**
   * Record HTTP request metrics
   */
  recordRequest(endpoint: string, method: string, duration: number, statusCode: number): void {
    this.requestMetrics.recordRequest(endpoint, method, duration, statusCode);
  }

  /**
   * Record cache operation
   */
  recordCacheOperation(operation: 'hit' | 'miss' | 'set' | 'delete' | 'eviction', duration?: number): void {
    this.cacheMetrics.recordCacheOperation(operation, duration);
  }

  /**
   * Update cache size
   */
  updateCacheSize(size: number): void {
    this.cacheMetrics.updateCacheSize(size);
  }

  /**
   * Clean up old metrics
   */
  private cleanupOldMetrics(): void {
    const cutoff = Date.now() - this.METRICS_RETENTION_HOURS * 3600000;
    this.requestMetrics.cleanupOldMetrics(cutoff);
  }

  /**
   * Get current performance summary
   */
  getCurrentSummary(): PerformanceSummary {
    return this.performanceAnalyzer.getCurrentSummary();
  }

  /**
   * Get performance trends
   */
  getPerformanceTrends(hours: number = 1): PerformanceTrend[] {
    return this.performanceAnalyzer.getPerformanceTrends(hours);
  }

  /**
   * Get endpoint metrics
   */
  getEndpointMetrics(endpoint?: string, method?: string): RequestMetrics[] {
    return this.requestMetrics.getEndpointMetrics(endpoint, method);
  }

  /**
   * Cleanup on module destroy
   */
  async onModuleDestroy(): Promise<void> {
    if (this.metricsCollectionInterval) {
      clearInterval(this.metricsCollectionInterval);
    }
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.logInfo('Performance metrics service stopped');
  }
}
