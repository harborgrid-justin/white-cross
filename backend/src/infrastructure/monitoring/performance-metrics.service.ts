/**
 * @fileoverview Performance Metrics Service
 * @module infrastructure/monitoring
 * @description Main service orchestrating all performance monitoring functionality
 */

import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { RequestMetrics, CacheMetrics, PerformanceSummary, PerformanceTrend } from './types/metrics.types';
import { RequestMetricsService } from './services/request-metrics.service';
import { CacheMetricsService } from './services/cache-metrics.service';
import { SystemMetricsService } from './services/system-metrics.service';
import { PerformanceAnalyzerService } from './services/performance-analyzer.service';

import { BaseService } from '../../common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { Inject } from '@nestjs/common';
@Injectable()
export class PerformanceMetricsService implements OnModuleInit, OnModuleDestroy {
  private readonly METRICS_RETENTION_HOURS = 24;

  // Intervals
  private metricsCollectionInterval: NodeJS.Timeout | null = null;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor(
    @Inject(LoggerService) logger: LoggerService,
    private readonly requestMetrics: RequestMetricsService,
    private readonly cacheMetrics: CacheMetricsService,
    private readonly systemMetrics: SystemMetricsService,
    private readonly performanceAnalyzer: PerformanceAnalyzerService,
  ) {
    super({
      serviceName: 'PerformanceMetricsService',
      logger,
      enableAuditLogging: true,
    });
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
   * Get cache metrics
   */
  getCacheMetrics(): CacheMetrics {
    return this.cacheMetrics.getCacheMetrics();
  }

  /**
   * Get pool metrics history
   */
  getPoolMetricsHistory(hours: number = 1) {
    return this.systemMetrics.getPoolMetricsHistory(hours);
  }

  /**
   * Get memory metrics history
   */
  getMemoryMetricsHistory(hours: number = 1) {
    return this.systemMetrics.getMemoryMetricsHistory(hours);
  }

  /**
   * Get performance history
   */
  getPerformanceHistory(hours: number = 1): PerformanceSummary[] {
    return this.performanceAnalyzer.getPerformanceHistory(hours);
  }

  /**
   * Reset all metrics
   */
  resetMetrics(): void {
    this.requestMetrics.reset();
    this.cacheMetrics.reset();
    this.systemMetrics.reset();
    this.performanceAnalyzer.reset();
    this.logInfo('All performance metrics reset');
  }

  /**
   * Export metrics for external monitoring systems
   */
  exportMetrics() {
    const summary = this.performanceAnalyzer.getCurrentSummary();

    return {
      requests: this.requestMetrics.getEndpointMetrics(),
      cache: this.cacheMetrics.getCacheMetrics(),
      pool: this.systemMetrics.getCurrentPoolMetrics(),
      memory: this.systemMetrics.getCurrentMemoryMetrics(),
      summary,
    };
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
  recordRequest(
    endpoint: string,
    method: string,
    duration: number,
    statusCode: number,
  ): void {
    this.totalRequests++;

    if (statusCode >= 400) {
      this.totalErrors++;
    }

    const key = `${method}:${endpoint}`;
    let metrics = this.requestMetrics.get(key);

    if (!metrics) {
      metrics = {
        endpoint,
        method,
        count: 0,
        totalDuration: 0,
        avgDuration: 0,
        minDuration: Infinity,
        maxDuration: 0,
        p50Duration: 0,
        p95Duration: 0,
        p99Duration: 0,
        statusCodes: {},
        errorCount: 0,
        lastAccessed: new Date(),
      };
      this.requestMetrics.set(key, metrics);
    }

    metrics.count++;
    metrics.totalDuration += duration;
    metrics.avgDuration = metrics.totalDuration / metrics.count;
    metrics.minDuration = Math.min(metrics.minDuration, duration);
    metrics.maxDuration = Math.max(metrics.maxDuration, duration);
    metrics.lastAccessed = new Date();
    metrics.statusCodes[statusCode] = (metrics.statusCodes[statusCode] || 0) + 1;

    if (statusCode >= 400) {
      metrics.errorCount++;
    }

    // Update percentiles (approximate)
    this.updateRequestPercentiles(metrics);

    // Store duration for overall percentile calculation
    this.requestDurations.push(duration);
    if (this.requestDurations.length > 10000) {
      this.requestDurations.shift();
    }

    // Trim endpoint metrics if too many
    if (this.requestMetrics.size > this.MAX_ENDPOINT_METRICS) {
      this.trimEndpointMetrics();
    }
  }

  /**
   * Update percentiles for request metrics
   */
  private updateRequestPercentiles(metrics: RequestMetrics): void {
    const range = metrics.maxDuration - metrics.minDuration;
    metrics.p50Duration = metrics.minDuration + range * 0.5;
    metrics.p95Duration = metrics.minDuration + range * 0.95;
    metrics.p99Duration = metrics.minDuration + range * 0.99;
  }

  /**
   * Trim least accessed endpoint metrics
   */
  private trimEndpointMetrics(): void {
    const entries = Array.from(this.requestMetrics.entries());
    entries.sort((a, b) => a[1].lastAccessed.getTime() - b[1].lastAccessed.getTime());

    // Remove oldest 10%
    const toRemove = Math.floor(entries.length * 0.1);
    for (let i = 0; i < toRemove; i++) {
      this.requestMetrics.delete(entries[i][0]);
    }
  }

  /**
   * Record cache operation
   */
  recordCacheOperation(
    operation: 'hit' | 'miss' | 'set' | 'delete' | 'eviction',
    duration?: number,
  ): void {
    switch (operation) {
      case 'hit':
        this.cacheMetrics.hits++;
        if (duration) {
          this.cacheMetrics.avgHitDuration =
            (this.cacheMetrics.avgHitDuration + duration) / 2;
        }
        break;
      case 'miss':
        this.cacheMetrics.misses++;
        if (duration) {
          this.cacheMetrics.avgMissDuration =
            (this.cacheMetrics.avgMissDuration + duration) / 2;
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
    const total = this.cacheMetrics.hits + this.cacheMetrics.misses;
    this.cacheMetrics.hitRate = total > 0 ? this.cacheMetrics.hits / total : 0;
  }

  /**
   * Update cache size
   */
  updateCacheSize(size: number): void {
    this.cacheMetrics.cacheSize = size;
  }

  /**
   * Collect system-level metrics
   */
  private collectSystemMetrics(): void {
    // Collect memory metrics
    const memUsage = process.memoryUsage();
    const memMetrics: MemoryMetrics = {
      heapUsed: memUsage.heapUsed,
      heapTotal: memUsage.heapTotal,
      external: memUsage.external,
      rss: memUsage.rss,
      utilizationPercent: (memUsage.heapUsed / memUsage.heapTotal) * 100,
      gcPauses: 0, // Would need gc-stats library
      avgGcDuration: 0,
    };

    this.memoryMetricsHistory.push(memMetrics);
    if (this.memoryMetricsHistory.length > this.MAX_HISTORY_POINTS) {
      this.memoryMetricsHistory.shift();
    }

    // Collect connection pool metrics
    try {
      const pool = (this.sequelize as any).connectionManager?.pool;
      if (pool) {
        const poolMetrics: PoolMetrics = {
          activeConnections: pool.used?.length || 0,
          idleConnections: pool.free?.length || 0,
          waitingRequests: pool.pending?.length || 0,
          totalConnections: (pool.used?.length || 0) + (pool.free?.length || 0),
          maxConnections: pool.options?.max || 0,
          utilizationPercent: 0,
          avgWaitTime: 0,
          connectionErrors: 0,
        };

        if (poolMetrics.maxConnections > 0) {
          poolMetrics.utilizationPercent =
            (poolMetrics.totalConnections / poolMetrics.maxConnections) * 100;
        }

        this.poolMetricsHistory.push(poolMetrics);
        if (this.poolMetricsHistory.length > this.MAX_HISTORY_POINTS) {
          this.poolMetricsHistory.shift();
        }
      }
    } catch (error) {
      this.logError('Error collecting pool metrics:', error);
    }
  }

  /**
   * Record performance summary
   */
  private recordPerformanceSummary(): void {
    const uptime = Date.now() - this.startTime;
    const uptimeSeconds = uptime / 1000;

    const sortedDurations = [...this.requestDurations].sort((a, b) => a - b);
    const avgDuration =
      sortedDurations.length > 0
        ? sortedDurations.reduce((sum, d) => sum + d, 0) / sortedDurations.length
        : 0;

    // Get top and slowest endpoints
    const endpointMetrics = Array.from(this.requestMetrics.values());
    const topEndpoints = endpointMetrics.sort((a, b) => b.count - a.count).slice(0, 10);
    const slowestEndpoints = endpointMetrics
      .sort((a, b) => b.avgDuration - a.avgDuration)
      .slice(0, 10);

    const summary: PerformanceSummary = {
      timestamp: new Date(),
      uptime,
      requests: {
        total: this.totalRequests,
        perSecond: this.totalRequests / uptimeSeconds,
        avgDuration,
        errorRate: this.totalRequests > 0 ? this.totalErrors / this.totalRequests : 0,
      },
      queries: {
        totalQueries: 0,
        slowQueries: 0,
        avgQueryTime: 0,
        p50QueryTime: 0,
        p95QueryTime: 0,
        p99QueryTime: 0,
        n1DetectionCount: 0,
        queryDistribution: {
          fast: 0,
          medium: 0,
          slow: 0,
          verySlow: 0,
        },
      },
      cache: { ...this.cacheMetrics },
      pool:
        this.poolMetricsHistory[this.poolMetricsHistory.length - 1] ||
        ({
          activeConnections: 0,
          idleConnections: 0,
          waitingRequests: 0,
          totalConnections: 0,
          maxConnections: 0,
          utilizationPercent: 0,
          avgWaitTime: 0,
          connectionErrors: 0,
        } as PoolMetrics),
      memory:
        this.memoryMetricsHistory[this.memoryMetricsHistory.length - 1] ||
        ({
          heapUsed: 0,
          heapTotal: 0,
          external: 0,
          rss: 0,
          utilizationPercent: 0,
          gcPauses: 0,
          avgGcDuration: 0,
        } as MemoryMetrics),
      topEndpoints,
      slowestEndpoints,
    };

    this.performanceHistory.push(summary);
    if (this.performanceHistory.length > this.MAX_HISTORY_POINTS) {
      this.performanceHistory.shift();
    }
  }

  /**
   * Clean up old metrics
   */
  private cleanupOldMetrics(): void {
    const cutoff = Date.now() - this.METRICS_RETENTION_HOURS * 3600000;

    // Clean up request metrics
    let cleaned = 0;
    for (const [key, metrics] of this.requestMetrics.entries()) {
      if (metrics.lastAccessed.getTime() < cutoff) {
        this.requestMetrics.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      this.logDebug(`Cleaned up ${cleaned} old endpoint metrics`);
    }
  }

  /**
   * Get current performance summary
   */
  getCurrentSummary(): PerformanceSummary {
    this.collectSystemMetrics();
    this.recordPerformanceSummary();
    return this.performanceHistory[this.performanceHistory.length - 1];
  }

  /**
   * Get performance trends
   */
  getPerformanceTrends(hours: number = 1): PerformanceTrend[] {
    const trends: PerformanceTrend[] = [];
    const cutoff = Date.now() - hours * 3600000;

    const recentHistory = this.performanceHistory.filter(
      (h) => h.timestamp.getTime() >= cutoff,
    );

    if (recentHistory.length < 2) {
      return trends;
    }

    const baseline = recentHistory[0];
    const current = recentHistory[recentHistory.length - 1];

    // Request performance trend
    trends.push(this.calculateTrend('avgRequestDuration', baseline, current));
    trends.push(this.calculateTrend('requestsPerSecond', baseline, current));
    trends.push(this.calculateTrend('errorRate', baseline, current));

    // Cache performance trend
    trends.push(this.calculateTrend('cacheHitRate', baseline, current));

    // Memory trend
    trends.push(this.calculateTrend('memoryUtilization', baseline, current));

    // Pool utilization trend
    trends.push(this.calculateTrend('poolUtilization', baseline, current));

    return trends;
  }

  /**
   * Calculate performance trend
   */
  private calculateTrend(
    metric: string,
    baseline: PerformanceSummary,
    current: PerformanceSummary,
  ): PerformanceTrend {
    let baselineValue = 0;
    let currentValue = 0;

    switch (metric) {
      case 'avgRequestDuration':
        baselineValue = baseline.requests.avgDuration;
        currentValue = current.requests.avgDuration;
        break;
      case 'requestsPerSecond':
        baselineValue = baseline.requests.perSecond;
        currentValue = current.requests.perSecond;
        break;
      case 'errorRate':
        baselineValue = baseline.requests.errorRate;
        currentValue = current.requests.errorRate;
        break;
      case 'cacheHitRate':
        baselineValue = baseline.cache.hitRate;
        currentValue = current.cache.hitRate;
        break;
      case 'memoryUtilization':
        baselineValue = baseline.memory.utilizationPercent;
        currentValue = current.memory.utilizationPercent;
        break;
      case 'poolUtilization':
        baselineValue = baseline.pool.utilizationPercent;
        currentValue = current.pool.utilizationPercent;
        break;
    }

    const percentChange = baselineValue !== 0 ? ((currentValue - baselineValue) / baselineValue) * 100 : 0;

    let trend: 'improving' | 'degrading' | 'stable';
    if (Math.abs(percentChange) < 5) {
      trend = 'stable';
    } else if (
      (metric === 'avgRequestDuration' ||
        metric === 'errorRate' ||
        metric === 'memoryUtilization') &&
      percentChange > 0
    ) {
      trend = 'degrading';
    } else if (percentChange > 0) {
      trend = 'improving';
    } else {
      trend = 'degrading';
    }

    return {
      timestamp: current.timestamp,
      metric,
      value: currentValue,
      baseline: baselineValue,
      percentChange,
      trend,
    };
  }

  /**
   * Get endpoint metrics
   */
  getEndpointMetrics(endpoint?: string, method?: string): RequestMetrics[] {
    if (endpoint && method) {
      const key = `${method}:${endpoint}`;
      const metrics = this.requestMetrics.get(key);
      return metrics ? [metrics] : [];
    }

    return Array.from(this.requestMetrics.values());
  }

  /**
   * Get cache metrics
   */
  getCacheMetrics(): CacheMetrics {
    return { ...this.cacheMetrics };
  }

  /**
   * Get pool metrics history
   */
  getPoolMetricsHistory(hours: number = 1): PoolMetrics[] {
    const cutoff = Date.now() - hours * 3600000;
    return this.poolMetricsHistory.filter(
      (m, i) => this.poolMetricsHistory.length - 1 - i < hours * 60,
    );
  }

  /**
   * Get memory metrics history
   */
  getMemoryMetricsHistory(hours: number = 1): MemoryMetrics[] {
    const cutoff = Date.now() - hours * 3600000;
    return this.memoryMetricsHistory.filter(
      (m, i) => this.memoryMetricsHistory.length - 1 - i < hours * 60,
    );
  }

  /**
   * Get performance history
   */
  getPerformanceHistory(hours: number = 1): PerformanceSummary[] {
    const cutoff = Date.now() - hours * 3600000;
    return this.performanceHistory.filter((h) => h.timestamp.getTime() >= cutoff);
  }

  /**
   * Reset all metrics
   */
  resetMetrics(): void {
    this.requestMetrics.clear();
    this.requestDurations = [];
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
    this.poolMetricsHistory = [];
    this.memoryMetricsHistory = [];
    this.performanceHistory = [];
    this.totalRequests = 0;
    this.totalErrors = 0;
    this.startTime = Date.now();
    this.logInfo('Performance metrics reset');
  }

  /**
   * Export metrics for external monitoring systems
   */
  exportMetrics(): {
    requests: RequestMetrics[];
    cache: CacheMetrics;
    pool: PoolMetrics | null;
    memory: MemoryMetrics | null;
    summary: PerformanceSummary | null;
  } {
    return {
      requests: Array.from(this.requestMetrics.values()),
      cache: { ...this.cacheMetrics },
      pool: this.poolMetricsHistory[this.poolMetricsHistory.length - 1] || null,
      memory: this.memoryMetricsHistory[this.memoryMetricsHistory.length - 1] || null,
      summary: this.performanceHistory[this.performanceHistory.length - 1] || null,
    };
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
