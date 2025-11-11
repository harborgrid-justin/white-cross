/**
 * @fileoverview Health Metrics Calculation Utilities
 * @module services/resilience/HealthMonitor/MetricsCalculator
 * @category Resilience Services
 *
 * Utilities for calculating health metrics including response time percentiles,
 * success rates, and statistical analysis of endpoint performance data.
 */

import type {
  EndpointHealth,
  ResponseTimeStats,
  TimeSeriesMetrics,
  HealthTrend,
  AggregationPeriod
} from './types';

/**
 * Metrics Calculator Class
 *
 * @class
 * @classdesc Provides utilities for calculating and analyzing health metrics
 * including response time percentiles, success rates, and trend analysis.
 *
 * Optimized for performance with efficient algorithms for percentile calculation
 * and statistical analysis suitable for real-time monitoring.
 */
export class MetricsCalculator {
  /**
   * Calculate response time percentiles from array of response times
   *
   * @param {number[]} responseTimes - Array of response times in milliseconds
   * @returns {ResponseTimeStats} Calculated response time statistics
   *
   * @description
   * Calculates comprehensive response time statistics including average,
   * min, max, median, p95, and p99 percentiles. Uses efficient sorting
   * algorithm optimized for typical monitoring workloads.
   *
   * @example
   * ```typescript
   * const calculator = new MetricsCalculator();
   * const responseTimes = [100, 150, 120, 300, 250, 180, 90, 200];
   * const stats = calculator.calculateResponseTimeStats(responseTimes);
   *
   * console.log(`Average: ${stats.average.toFixed(0)}ms`);
   * console.log(`P95: ${stats.p95}ms`);
   * console.log(`P99: ${stats.p99}ms`);
   * ```
   */
  public calculateResponseTimeStats(responseTimes: number[]): ResponseTimeStats {
    if (responseTimes.length === 0) {
      return {
        average: 0,
        min: 0,
        max: 0,
        median: 0,
        p95: 0,
        p99: 0,
        sampleCount: 0
      };
    }

    // Sort response times for percentile calculation
    const sorted = [...responseTimes].sort((a, b) => a - b);
    const count = sorted.length;

    // Calculate basic statistics
    const sum = sorted.reduce((acc, time) => acc + time, 0);
    const average = sum / count;
    const min = sorted[0] || 0;
    const max = sorted[count - 1] || 0;

    // Calculate percentiles
    const median = this.calculatePercentile(sorted, 0.5);
    const p95 = this.calculatePercentile(sorted, 0.95);
    const p99 = this.calculatePercentile(sorted, 0.99);

    return {
      average,
      min,
      max,
      median,
      p95,
      p99,
      sampleCount: count
    };
  }

  /**
   * Calculate specific percentile from sorted array
   *
   * @param {number[]} sortedValues - Pre-sorted array of values
   * @param {number} percentile - Percentile to calculate (0-1)
   * @returns {number} Calculated percentile value
   * @private
   */
  private calculatePercentile(sortedValues: number[], percentile: number): number {
    if (sortedValues.length === 0) return 0;
    if (percentile <= 0) return sortedValues[0];
    if (percentile >= 1) return sortedValues[sortedValues.length - 1];

    const index = percentile * (sortedValues.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);

    if (lower === upper) {
      return sortedValues[lower];
    }

    const weight = index - lower;
    return sortedValues[lower] * (1 - weight) + sortedValues[upper] * weight;
  }

  /**
   * Update endpoint health metrics based on current data
   *
   * @param {EndpointHealth} health - Health record to update
   * @param {number[]} responseTimes - Array of response times
   * @returns {EndpointHealth} Updated health record
   *
   * @description
   * Updates computed metrics including success rate, failure rate, and
   * response time statistics. Modifies the health record in place and
   * returns it for convenience.
   */
  public updateHealthMetrics(health: EndpointHealth, responseTimes: number[]): EndpointHealth {
    const total = health.totalRequests;

    if (total === 0) {
      health.successRate = 1.0;
      health.failureRate = 0;
      health.avgResponseTime = 0;
      health.p95ResponseTime = 0;
      health.p99ResponseTime = 0;
      return health;
    }

    // Update rates
    health.successRate = health.successfulRequests / total;
    health.failureRate = health.failedRequests / total;

    // Update response time metrics
    if (responseTimes.length > 0) {
      const stats = this.calculateResponseTimeStats(responseTimes);
      health.avgResponseTime = stats.average;
      health.p95ResponseTime = stats.p95;
      health.p99ResponseTime = stats.p99;
    }

    return health;
  }

  /**
   * Calculate overall health score for multiple endpoints
   *
   * @param {EndpointHealth[]} endpoints - Array of endpoint health records
   * @returns {number} Overall health score (0-100)
   *
   * @description
   * Calculates a weighted health score based on success rates and response times
   * across all endpoints. Critical endpoints (high request volume) have more
   * influence on the overall score.
   */
  public calculateOverallHealthScore(endpoints: EndpointHealth[]): number {
    if (endpoints.length === 0) return 100;

    let totalWeight = 0;
    let weightedScore = 0;

    for (const endpoint of endpoints) {
      const weight = Math.max(1, endpoint.totalRequests);
      const successScore = endpoint.successRate * 100;
      
      // Penalize slow response times
      const responseTimePenalty = Math.min(20, endpoint.p95ResponseTime / 100);
      const endpointScore = Math.max(0, successScore - responseTimePenalty);

      weightedScore += endpointScore * weight;
      totalWeight += weight;
    }

    return totalWeight > 0 ? Math.round(weightedScore / totalWeight) : 100;
  }

  /**
   * Analyze health trend over time series data
   *
   * @param {TimeSeriesMetrics[]} timeSeries - Time series health data
   * @returns {HealthTrend | null} Trend analysis or null if insufficient data
   *
   * @description
   * Analyzes trends in success rate and response time using linear regression
   * to determine if metrics are improving, stable, or degrading over time.
   */
  public analyzeHealthTrend(timeSeries: TimeSeriesMetrics[]): HealthTrend | null {
    if (timeSeries.length < 3) return null;

    const endpoint = timeSeries[0]?.period || 'unknown';

    // Analyze success rate trend
    const successRates = timeSeries.map(ts => ts.successRate);
    const successRateTrend = this.calculateTrend(successRates);

    // Analyze response time trend (inverse - lower is better)
    const responseTimes = timeSeries.map(ts => ts.avgResponseTime);
    const responseTimeTrend = this.calculateTrend(responseTimes.map(rt => -rt));

    // Calculate confidence based on data variance
    const confidence = this.calculateTrendConfidence(successRates, responseTimes);

    return {
      endpoint,
      successRateTrend,
      responseTimeTrend,
      confidence,
      timeSeries
    };
  }

  /**
   * Calculate trend direction using linear regression
   *
   * @param {number[]} values - Array of values over time
   * @returns {'improving' | 'stable' | 'degrading'} Trend direction
   * @private
   */
  private calculateTrend(values: number[]): 'improving' | 'stable' | 'degrading' {
    const n = values.length;
    const indices = Array.from({ length: n }, (_, i) => i);

    // Calculate linear regression slope
    const xMean = indices.reduce((sum, x) => sum + x, 0) / n;
    const yMean = values.reduce((sum, y) => sum + y, 0) / n;

    const numerator = indices.reduce((sum, x, i) => sum + (x - xMean) * (values[i] - yMean), 0);
    const denominator = indices.reduce((sum, x) => sum + (x - xMean) ** 2, 0);

    const slope = denominator !== 0 ? numerator / denominator : 0;

    // Determine trend based on slope and significance
    const threshold = 0.01; // Minimum slope to consider significant
    
    if (slope > threshold) return 'improving';
    if (slope < -threshold) return 'degrading';
    return 'stable';
  }

  /**
   * Calculate confidence level for trend analysis
   *
   * @param {number[]} successRates - Success rate time series
   * @param {number[]} responseTimes - Response time time series
   * @returns {number} Confidence level (0-1)
   * @private
   */
  private calculateTrendConfidence(successRates: number[], responseTimes: number[]): number {
    const n = successRates.length;
    
    // Calculate coefficient of variation for both metrics
    const successRateCV = this.calculateCoefficientOfVariation(successRates);
    const responseTimeCV = this.calculateCoefficientOfVariation(responseTimes);

    // Higher variation means lower confidence
    const avgCV = (successRateCV + responseTimeCV) / 2;
    const sampleSizeBonus = Math.min(0.3, n / 20); // Bonus for larger sample size
    
    const baseConfidence = Math.max(0, 1 - avgCV);
    return Math.min(1, baseConfidence + sampleSizeBonus);
  }

  /**
   * Calculate coefficient of variation (std dev / mean)
   *
   * @param {number[]} values - Array of values
   * @returns {number} Coefficient of variation
   * @private
   */
  private calculateCoefficientOfVariation(values: number[]): number {
    if (values.length === 0) return 0;

    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    if (mean === 0) return 0;

    const variance = values.reduce((sum, val) => sum + (val - mean) ** 2, 0) / values.length;
    const stdDev = Math.sqrt(variance);

    return stdDev / mean;
  }

  /**
   * Create time series metrics from raw health data
   *
   * @param {EndpointHealth[]} healthHistory - Historical health data
   * @param {AggregationPeriod} period - Aggregation period
   * @param {number} maxPoints - Maximum number of data points to return
   * @returns {TimeSeriesMetrics[]} Time series metrics
   *
   * @description
   * Aggregates raw health data into time series format for trend analysis
   * and visualization. Groups data by time period and calculates averages.
   */
  public createTimeSeries(
    healthHistory: EndpointHealth[],
    period: AggregationPeriod,
    maxPoints: number = 50
  ): TimeSeriesMetrics[] {
    if (healthHistory.length === 0) return [];

    const periodMs = this.getPeriodMilliseconds(period);
    const now = Date.now();
    const startTime = now - (maxPoints * periodMs);

    const buckets = new Map<number, EndpointHealth[]>();

    // Group health records into time buckets
    for (const health of healthHistory) {
      if (health.lastRequestTime < startTime) continue;

      const bucketTime = Math.floor(health.lastRequestTime / periodMs) * periodMs;
      if (!buckets.has(bucketTime)) {
        buckets.set(bucketTime, []);
      }
      buckets.get(bucketTime)!.push(health);
    }

    // Convert buckets to time series
    const timeSeries: TimeSeriesMetrics[] = [];
    
    for (const [bucketTime, healthRecords] of buckets.entries()) {
      const totalRequests = healthRecords.reduce((sum, h) => sum + h.totalRequests, 0);
      const successfulRequests = healthRecords.reduce((sum, h) => sum + h.successfulRequests, 0);
      const failedRequests = healthRecords.reduce((sum, h) => sum + h.failedRequests, 0);
      const avgResponseTime = healthRecords.reduce((sum, h) => sum + h.avgResponseTime, 0) / healthRecords.length;

      timeSeries.push({
        period,
        startTime: bucketTime,
        endTime: bucketTime + periodMs,
        successRate: totalRequests > 0 ? successfulRequests / totalRequests : 1,
        avgResponseTime,
        p95ResponseTime: Math.max(...healthRecords.map(h => h.p95ResponseTime)),
        requestCount: totalRequests,
        failureCount: failedRequests
      });
    }

    return timeSeries.sort((a, b) => a.startTime - b.startTime);
  }

  /**
   * Convert aggregation period to milliseconds
   *
   * @param {AggregationPeriod} period - Aggregation period
   * @returns {number} Period in milliseconds
   * @private
   */
  private getPeriodMilliseconds(period: AggregationPeriod): number {
    const periods = {
      '1m': 60 * 1000,
      '5m': 5 * 60 * 1000,
      '15m': 15 * 60 * 1000,
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000
    };
    return periods[period];
  }

  /**
   * Calculate health score for a single endpoint
   *
   * @param {EndpointHealth} health - Endpoint health record
   * @returns {number} Health score (0-100)
   *
   * @description
   * Calculates a composite health score based on success rate, response time,
   * and recent request patterns. Used for endpoint prioritization and alerting.
   */
  public calculateEndpointHealthScore(health: EndpointHealth): number {
    // Base score from success rate (0-80 points)
    const successScore = health.successRate * 80;

    // Response time penalty (0-15 points deducted)
    const responseTimePenalty = Math.min(15, health.p95ResponseTime / 200);

    // Timeout penalty (0-10 points deducted)
    const timeoutRate = health.totalRequests > 0 ? health.timeoutRequests / health.totalRequests : 0;
    const timeoutPenalty = timeoutRate * 10;

    // Recent activity bonus (0-5 points)
    const timeSinceLastRequest = Date.now() - health.lastRequestTime;
    const activityBonus = timeSinceLastRequest < 300000 ? 5 : 0; // 5 minutes

    const finalScore = successScore - responseTimePenalty - timeoutPenalty + activityBonus;
    return Math.max(0, Math.min(100, Math.round(finalScore)));
  }

  /**
   * Check if health metrics indicate degradation
   *
   * @param {EndpointHealth} health - Endpoint health record
   * @param {object} thresholds - Degradation thresholds
   * @returns {boolean} True if endpoint is degraded
   */
  public isDegraded(health: EndpointHealth, thresholds: {
    maxFailureRate: number;
    maxP95ResponseTime: number;
    maxTimeoutRate: number;
  }): boolean {
    const timeoutRate = health.totalRequests > 0 ? health.timeoutRequests / health.totalRequests : 0;

    return (
      health.failureRate > thresholds.maxFailureRate ||
      health.p95ResponseTime > thresholds.maxP95ResponseTime ||
      timeoutRate > thresholds.maxTimeoutRate
    );
  }
}

/**
 * Create shared metrics calculator instance
 */
export const metricsCalculator = new MetricsCalculator();
