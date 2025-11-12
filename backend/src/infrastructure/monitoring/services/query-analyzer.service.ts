/**
 * @fileoverview Query Analyzer Service
 * @module infrastructure/monitoring/services
 * @description Service for analyzing query performance and collecting metrics
 */

import { Injectable, Logger } from '@nestjs/common';
import { QueryMetrics, QueryExecution } from '../types/query-monitor.types';

@Injectable()
export class QueryAnalyzerService {
  private readonly logger = new Logger(QueryAnalyzerService.name);

  // Configuration
  private readonly MAX_HISTORY_SIZE = 1000;

  // Metrics storage
  private queryMetrics = new Map<string, QueryMetrics>();
  private queryExecutions: QueryExecution[] = [];

  // Performance statistics
  private totalQueries = 0;
  private queryDistribution = {
    fast: 0,
    medium: 0,
    slow: 0,
    verySlow: 0,
  };

  constructor() {}

  /**
   * Record query execution and update metrics
   */
  recordQuery(sql: string, duration: number, model?: string): void {
    this.totalQueries++;

    // Normalize query to signature
    const signature = this.normalizeQuery(sql);

    // Update query metrics
    this.updateQueryMetrics(signature, duration);

    // Classify query by duration
    this.classifyQuery(duration);

    // Record execution for analysis
    this.recordExecution(signature, duration);

    this.logger.debug(`Query recorded: ${duration}ms`, {
      signature: signature.substring(0, 50),
      model,
    });
  }

  /**
   * Normalize SQL query to signature for pattern matching
   */
  private normalizeQuery(sql: string): string {
    return sql
      // Remove bind parameters
      .replace(/\$\d+/g, '?')
      // Remove string literals
      .replace(/'[^']*'/g, "'?'")
      // Remove numeric literals
      .replace(/\b\d+\b/g, '?')
      // Remove extra whitespace
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  /**
   * Update metrics for query signature
   */
  private updateQueryMetrics(signature: string, duration: number): void {
    let metrics = this.queryMetrics.get(signature);

    if (!metrics) {
      metrics = {
        querySignature: signature,
        count: 0,
        totalDuration: 0,
        avgDuration: 0,
        minDuration: Infinity,
        maxDuration: 0,
        p50Duration: 0,
        p95Duration: 0,
        p99Duration: 0,
        lastExecuted: new Date(),
        isSlowQuery: false,
      };
      this.queryMetrics.set(signature, metrics);
    }

    metrics.count++;
    metrics.totalDuration += duration;
    metrics.avgDuration = metrics.totalDuration / metrics.count;
    metrics.minDuration = Math.min(metrics.minDuration, duration);
    metrics.maxDuration = Math.max(metrics.maxDuration, duration);
    metrics.lastExecuted = new Date();
    metrics.isSlowQuery = metrics.avgDuration > 1000; // 1 second threshold

    // Update percentiles
    this.updatePercentiles(metrics);
  }

  /**
   * Calculate percentiles for query metrics
   */
  private updatePercentiles(metrics: QueryMetrics): void {
    // Approximate percentiles based on observed values
    const range = metrics.maxDuration - metrics.minDuration;

    metrics.p50Duration = metrics.minDuration + range * 0.5;
    metrics.p95Duration = metrics.minDuration + range * 0.95;
    metrics.p99Duration = metrics.minDuration + range * 0.99;
  }

  /**
   * Classify query by execution time
   */
  private classifyQuery(duration: number): void {
    if (duration < 100) {
      this.queryDistribution.fast++;
    } else if (duration < 500) {
      this.queryDistribution.medium++;
    } else if (duration < 1000) {
      this.queryDistribution.slow++;
    } else {
      this.queryDistribution.verySlow++;
    }
  }

  /**
   * Record query execution for analysis
   */
  private recordExecution(signature: string, duration: number): void {
    this.queryExecutions.push({
      signature,
      duration,
      timestamp: new Date(),
    });

    // Trim execution history
    if (this.queryExecutions.length > this.MAX_HISTORY_SIZE) {
      this.queryExecutions.shift();
    }
  }

  /**
   * Get metrics for specific query pattern
   */
  getQueryMetrics(signature: string): QueryMetrics | undefined {
    return this.queryMetrics.get(signature);
  }

  /**
   * Get all query metrics
   */
  getAllQueryMetrics(): QueryMetrics[] {
    return Array.from(this.queryMetrics.values());
  }

  /**
   * Get recent query executions
   */
  getRecentExecutions(limit: number = 100): QueryExecution[] {
    return this.queryExecutions.slice(-limit);
  }

  /**
   * Get query distribution statistics
   */
  getQueryDistribution() {
    return { ...this.queryDistribution };
  }

  /**
   * Get total query count
   */
  getTotalQueries(): number {
    return this.totalQueries;
  }

  /**
   * Calculate percentile from recent executions
   */
  calculatePercentile(percentile: number): number {
    const durations = this.queryExecutions.map(exec => exec.duration).sort((a, b) => a - b);
    return this.calculatePercentileFromArray(durations, percentile);
  }

  /**
   * Calculate percentile from sorted array
   */
  private calculatePercentileFromArray(sortedArray: number[], percentile: number): number {
    if (sortedArray.length === 0) return 0;

    const index = Math.ceil((percentile / 100) * sortedArray.length) - 1;
    return sortedArray[Math.max(0, index)];
  }

  /**
   * Get top frequent queries
   */
  getTopFrequentQueries(limit: number = 10): QueryMetrics[] {
    return Array.from(this.queryMetrics.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  /**
   * Reset all metrics
   */
  resetMetrics(): void {
    this.queryMetrics.clear();
    this.queryExecutions = [];
    this.totalQueries = 0;
    this.queryDistribution = {
      fast: 0,
      medium: 0,
      slow: 0,
      verySlow: 0,
    };
    this.logger.log('Query analyzer metrics reset');
  }
}
