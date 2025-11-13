/**
 * @fileoverview Performance Analyzer Service
 * @module infrastructure/monitoring/services
 * @description Service for analyzing performance trends and generating summaries
 */

import { Injectable, Logger } from '@nestjs/common';
import { PerformanceSummary, PerformanceTrend } from '../types/metrics.types';
import { RequestMetricsService } from './request-metrics.service';
import { CacheMetricsService } from './cache-metrics.service';
import { SystemMetricsService } from './system-metrics.service';

import { BaseService } from '../../../common/base';
@Injectable()
export class PerformanceAnalyzerService extends BaseService {
  private readonly MAX_HISTORY_POINTS = 1440; // 24 hours at 1 min intervals
  private performanceHistory: PerformanceSummary[] = [];
  private startTime = Date.now();

  constructor(
    private readonly requestMetrics: RequestMetricsService,
    private readonly cacheMetrics: CacheMetricsService,
    private readonly systemMetrics: SystemMetricsService,
  ) {
    super('PerformanceAnalyzerService');
  }

  /**
   * Record performance summary
   */
  recordPerformanceSummary(): void {
    const uptime = Date.now() - this.startTime;
    const uptimeSeconds = uptime / 1000;

    const requestStats = this.requestMetrics.getRequestStats();
    const cacheMetrics = this.cacheMetrics.getCacheMetrics();
    const systemMetrics = this.systemMetrics.collectSystemMetrics();

    // Get top and slowest endpoints
    const topEndpoints = this.requestMetrics.getTopEndpoints(10);
    const slowestEndpoints = this.requestMetrics.getSlowestEndpoints(10);

    const summary: PerformanceSummary = {
      timestamp: new Date(),
      uptime,
      requests: {
        total: requestStats.totalRequests,
        perSecond: requestStats.totalRequests / uptimeSeconds,
        avgDuration: requestStats.avgDuration,
        errorRate: requestStats.errorRate,
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
      cache: cacheMetrics,
      pool: systemMetrics.pool,
      memory: systemMetrics.memory,
      topEndpoints,
      slowestEndpoints,
    };

    this.performanceHistory.push(summary);
    if (this.performanceHistory.length > this.MAX_HISTORY_POINTS) {
      this.performanceHistory.shift();
    }
  }

  /**
   * Get current performance summary
   */
  getCurrentSummary(): PerformanceSummary {
    this.systemMetrics.collectSystemMetrics();
    this.recordPerformanceSummary();
    return this.performanceHistory[this.performanceHistory.length - 1];
  }

  /**
   * Get performance trends
   */
  getPerformanceTrends(hours: number = 1): PerformanceTrend[] {
    const trends: PerformanceTrend[] = [];
    const cutoff = Date.now() - hours * 3600000;

    const recentHistory = this.performanceHistory.filter((h) => h.timestamp.getTime() >= cutoff);

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
   * Get performance history
   */
  getPerformanceHistory(hours: number = 1): PerformanceSummary[] {
    const cutoff = Date.now() - hours * 3600000;
    return this.performanceHistory.filter((h) => h.timestamp.getTime() >= cutoff);
  }

  /**
   * Reset performance history
   */
  reset(): void {
    this.performanceHistory = [];
    this.startTime = Date.now();
    this.logInfo('Performance history reset');
  }
}
