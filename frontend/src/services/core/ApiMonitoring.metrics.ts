/**
 * WF-MET-262 | ApiMonitoring.metrics.ts - Metrics tracking and aggregation
 * Purpose: Manage API metrics collection, storage, and performance statistics
 * Upstream: ApiMonitoring.types | Dependencies: ApiMonitoring.types
 * Downstream: ApiMonitoring | Called by: ApiMonitoring class
 * Exports: MetricsTracker class
 * Last Updated: 2025-11-04 | File Type: .ts
 * LLM Context: In-memory metrics storage with aggregation and query capabilities
 */

import { ApiMetrics, PerformanceStats, MonitoringConfig } from './ApiMonitoring.types';

// ==========================================
// METRICS TRACKER CLASS
// ==========================================

/**
 * Manages metrics collection, storage, and aggregation for API monitoring
 *
 * Features:
 * - In-memory metrics storage with configurable history size
 * - Performance statistics aggregation
 * - Endpoint-specific metrics filtering
 * - Error tracking and slow request identification
 * - Metrics export for persistence or analysis
 */
export class MetricsTracker {
  private metrics: Map<string, ApiMetrics> = new Map();
  private metricsHistory: ApiMetrics[] = [];
  private maxHistorySize: number;
  private config: MonitoringConfig;

  constructor(config: MonitoringConfig, maxHistorySize: number = 100) {
    this.config = config;
    this.maxHistorySize = maxHistorySize;
  }

  // ==========================================
  // METRICS RECORDING
  // ==========================================

  /**
   * Record metrics for a completed request
   * @param metrics - API metrics to record
   */
  public recordMetrics(metrics: ApiMetrics): void {
    if (!this.config.trackPerformance) return;

    // Update current metrics
    this.metrics.set(metrics.requestId, metrics);

    // Add to history
    this.metricsHistory.push(metrics);

    // Limit history size
    if (this.metricsHistory.length > this.maxHistorySize) {
      this.metricsHistory.shift();
    }

    // Cleanup old metrics
    this.metrics.delete(metrics.requestId);
  }

  // ==========================================
  // PERFORMANCE STATS
  // ==========================================

  /**
   * Get aggregated performance statistics across all recorded requests
   * @returns Performance statistics including success rate, response times, and error rate
   */
  public getPerformanceStats(): PerformanceStats {
    const history = this.metricsHistory;

    if (history.length === 0) {
      return {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        averageResponseTime: 0,
        slowestRequest: null,
        fastestRequest: null,
        errorRate: 0,
      };
    }

    const successfulRequests = history.filter(m => m.success).length;
    const failedRequests = history.filter(m => !m.success).length;
    const totalRequests = history.length;

    const durations = history.map(m => m.duration);
    const averageResponseTime = durations.reduce((a, b) => a + b, 0) / durations.length;

    const sortedByDuration = [...history].sort((a, b) => a.duration - b.duration);
    const slowestRequest = sortedByDuration[sortedByDuration.length - 1];
    const fastestRequest = sortedByDuration[0];

    const errorRate = failedRequests / totalRequests;

    return {
      totalRequests,
      successfulRequests,
      failedRequests,
      averageResponseTime: Math.round(averageResponseTime),
      slowestRequest,
      fastestRequest,
      errorRate: Math.round(errorRate * 100) / 100,
    };
  }

  /**
   * Get metrics for a specific endpoint
   * @param endpoint - Endpoint URL or partial URL to filter by
   * @returns Array of metrics matching the endpoint
   */
  public getEndpointMetrics(endpoint: string): ApiMetrics[] {
    return this.metricsHistory.filter(m => m.url.includes(endpoint));
  }

  /**
   * Get recent errors (most recent first)
   * @param limit - Maximum number of errors to return (default: 10)
   * @returns Array of error metrics
   */
  public getRecentErrors(limit: number = 10): ApiMetrics[] {
    return this.metricsHistory
      .filter(m => !m.success)
      .slice(-limit)
      .reverse();
  }

  /**
   * Get slow requests sorted by duration (slowest first)
   * @param limit - Maximum number of slow requests to return (default: 10)
   * @returns Array of slow request metrics
   */
  public getSlowRequests(limit: number = 10): ApiMetrics[] {
    return [...this.metricsHistory]
      .filter(m => m.duration > this.config.slowRequestThreshold)
      .sort((a, b) => b.duration - a.duration)
      .slice(0, limit);
  }

  /**
   * Clear all metrics history
   */
  public clearHistory(): void {
    this.metricsHistory = [];
    this.metrics.clear();
  }

  /**
   * Export metrics to JSON string for persistence or analysis
   * @returns JSON string containing stats, history, and timestamp
   */
  public exportMetrics(): string {
    return JSON.stringify({
      stats: this.getPerformanceStats(),
      history: this.metricsHistory,
      timestamp: new Date().toISOString(),
    }, null, 2);
  }

  /**
   * Update configuration (e.g., slow request threshold)
   * @param config - Partial monitoring configuration to update
   */
  public updateConfig(config: Partial<MonitoringConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current metrics history
   * @returns Array of all recorded metrics
   */
  public getHistory(): ApiMetrics[] {
    return [...this.metricsHistory];
  }
}
