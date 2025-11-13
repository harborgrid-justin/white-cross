/**
 * @fileoverview Request Metrics Service
 * @module infrastructure/monitoring/services
 * @description Service for tracking and analyzing HTTP request performance metrics
 */

import { Injectable, Logger } from '@nestjs/common';
import { RequestMetrics } from '../types/metrics.types';

import { BaseService } from '../../../common/base';
@Injectable()
export class RequestMetricsService extends BaseService {
  constructor() {
    super('RequestMetricsService');
  }

  private readonly MAX_ENDPOINT_METRICS = 500;
  private requestMetrics = new Map<string, RequestMetrics>();
  private requestDurations: number[] = [];
  private totalRequests = 0;
  private totalErrors = 0;

  /**
   * Record HTTP request metrics
   */
  recordRequest(endpoint: string, method: string, duration: number, statusCode: number): void {
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
   * Get top endpoints by request count
   */
  getTopEndpoints(limit: number = 10): RequestMetrics[] {
    return Array.from(this.requestMetrics.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  /**
   * Get slowest endpoints by average duration
   */
  getSlowestEndpoints(limit: number = 10): RequestMetrics[] {
    return Array.from(this.requestMetrics.values())
      .sort((a, b) => b.avgDuration - a.avgDuration)
      .slice(0, limit);
  }

  /**
   * Get overall request statistics
   */
  getRequestStats(): {
    totalRequests: number;
    totalErrors: number;
    errorRate: number;
    avgDuration: number;
    requestDurations: number[];
  } {
    const sortedDurations = [...this.requestDurations].sort((a, b) => a - b);
    const avgDuration =
      sortedDurations.length > 0
        ? sortedDurations.reduce((sum, d) => sum + d, 0) / sortedDurations.length
        : 0;

    return {
      totalRequests: this.totalRequests,
      totalErrors: this.totalErrors,
      errorRate: this.totalRequests > 0 ? this.totalErrors / this.totalRequests : 0,
      avgDuration,
      requestDurations: sortedDurations,
    };
  }

  /**
   * Clean up old metrics
   */
  cleanupOldMetrics(cutoffTime: number): number {
    let cleaned = 0;
    for (const [key, metrics] of this.requestMetrics.entries()) {
      if (metrics.lastAccessed.getTime() < cutoffTime) {
        this.requestMetrics.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      this.logDebug(`Cleaned up ${cleaned} old endpoint metrics`);
    }

    return cleaned;
  }

  /**
   * Reset all request metrics
   */
  reset(): void {
    this.requestMetrics.clear();
    this.requestDurations = [];
    this.totalRequests = 0;
    this.totalErrors = 0;
    this.logInfo('Request metrics reset');
  }
}
