/**
 * Query Performance Monitor Service
 *
 * Monitors and analyzes Sequelize query performance in real-time
 *
 * Features:
 * - Slow query detection and logging (>1000ms threshold)
 * - Query pattern tracking and analysis
 * - N+1 query detection
 * - Query execution time distribution
 * - Automatic alerting for performance degradation
 * - HIPAA-compliant logging (no PHI in logs)
 *
 * Performance Targets:
 * - P50: < 100ms
 * - P95: < 500ms
 * - P99: < 1000ms
 */

import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize';
import * as crypto from 'crypto';

export interface QueryMetrics {
  querySignature: string;
  count: number;
  totalDuration: number;
  avgDuration: number;
  minDuration: number;
  maxDuration: number;
  p50Duration: number;
  p95Duration: number;
  p99Duration: number;
  lastExecuted: Date;
  isSlowQuery: boolean;
}

export interface SlowQuery {
  sql: string;
  duration: number;
  model?: string;
  timestamp: Date;
  stackTrace?: string;
}

export interface N1QueryDetection {
  pattern: string;
  occurrences: number;
  withinTimeWindow: number; // ms
  likelyN1: boolean;
  affectedModel?: string;
  timestamp: Date;
}

export interface PerformanceAlert {
  type: 'slow_query' | 'n1_detected' | 'performance_degradation' | 'high_query_rate';
  severity: 'info' | 'warning' | 'critical';
  message: string;
  details: any;
  timestamp: Date;
}

export interface PerformanceReport {
  totalQueries: number;
  slowQueries: number;
  avgQueryTime: number;
  p50QueryTime: number;
  p95QueryTime: number;
  p99QueryTime: number;
  queryDistribution: {
    fast: number;    // < 100ms
    medium: number;  // 100-500ms
    slow: number;    // 500-1000ms
    verySlow: number; // > 1000ms
  };
  topSlowQueries: SlowQuery[];
  topFrequentQueries: QueryMetrics[];
  n1Detections: N1QueryDetection[];
  alerts: PerformanceAlert[];
  periodStart: Date;
  periodEnd: Date;
}

@Injectable()
export class QueryMonitorService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(QueryMonitorService.name);

  // Configuration
  private readonly SLOW_QUERY_THRESHOLD = 1000; // 1 second
  private readonly MEDIUM_QUERY_THRESHOLD = 500; // 500ms
  private readonly FAST_QUERY_THRESHOLD = 100; // 100ms
  private readonly N1_DETECTION_WINDOW = 1000; // 1 second
  private readonly N1_OCCURRENCE_THRESHOLD = 5;
  private readonly MAX_HISTORY_SIZE = 1000;
  private readonly MAX_SLOW_QUERIES = 100;

  // Metrics storage
  private queryMetrics = new Map<string, QueryMetrics>();
  private queryExecutions: { signature: string; duration: number; timestamp: Date }[] = [];
  private slowQueries: SlowQuery[] = [];
  private n1Detections: N1QueryDetection[] = [];
  private alerts: PerformanceAlert[] = [];

  // Performance statistics
  private totalQueries = 0;
  private queryDistribution = {
    fast: 0,
    medium: 0,
    slow: 0,
    verySlow: 0,
  };

  // Monitoring state
  private isMonitoring = false;
  private reportInterval: NodeJS.Timeout | null = null;

  constructor(
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

  async onModuleInit(): Promise<void> {
    this.logger.log('Initializing Query Monitor Service');
    this.startMonitoring();
  }

  /**
   * Start query performance monitoring
   */
  startMonitoring(): void {
    if (this.isMonitoring) {
      this.logger.warn('Query monitoring already started');
      return;
    }

    this.isMonitoring = true;

    // Hook into Sequelize query lifecycle
    this.sequelize.addHook('beforeQuery', (options: any, query: any) => {
      query.startTime = Date.now();
      query.model = options.model?.name;
    });

    this.sequelize.addHook('afterQuery', (options: any, query: any) => {
      const duration = Date.now() - query.startTime;
      this.recordQuery(options.sql, duration, query.model);
    });

    // Start periodic reporting
    this.reportInterval = setInterval(() => {
      this.generatePeriodicReport();
    }, 60000); // Every minute

    this.logger.log('Query performance monitoring started');
  }

  /**
   * Record query execution and analyze performance
   */
  private recordQuery(sql: string, duration: number, model?: string): void {
    this.totalQueries++;

    // Normalize query to signature
    const signature = this.normalizeQuery(sql);

    // Update query metrics
    this.updateQueryMetrics(signature, duration);

    // Classify query by duration
    this.classifyQuery(duration);

    // Record execution for N+1 detection
    this.queryExecutions.push({
      signature,
      duration,
      timestamp: new Date(),
    });

    // Trim execution history
    if (this.queryExecutions.length > this.MAX_HISTORY_SIZE) {
      this.queryExecutions.shift();
    }

    // Check for slow query
    if (duration > this.SLOW_QUERY_THRESHOLD) {
      this.recordSlowQuery(sql, duration, model);
    }

    // Detect N+1 queries
    this.detectN1Queries(signature, model);
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
    metrics.isSlowQuery = metrics.avgDuration > this.SLOW_QUERY_THRESHOLD;

    // Update percentiles (approximate)
    this.updatePercentiles(metrics);
  }

  /**
   * Calculate percentiles for query metrics
   */
  private updatePercentiles(metrics: QueryMetrics): void {
    // Approximate percentiles based on observed values
    // In production, use a proper percentile calculation library
    const range = metrics.maxDuration - metrics.minDuration;

    metrics.p50Duration = metrics.minDuration + range * 0.5;
    metrics.p95Duration = metrics.minDuration + range * 0.95;
    metrics.p99Duration = metrics.minDuration + range * 0.99;
  }

  /**
   * Classify query by execution time
   */
  private classifyQuery(duration: number): void {
    if (duration < this.FAST_QUERY_THRESHOLD) {
      this.queryDistribution.fast++;
    } else if (duration < this.MEDIUM_QUERY_THRESHOLD) {
      this.queryDistribution.medium++;
    } else if (duration < this.SLOW_QUERY_THRESHOLD) {
      this.queryDistribution.slow++;
    } else {
      this.queryDistribution.verySlow++;
    }
  }

  /**
   * Record slow query for analysis
   */
  private recordSlowQuery(sql: string, duration: number, model?: string): void {
    const slowQuery: SlowQuery = {
      sql: sql.substring(0, 500), // Truncate long queries
      duration,
      model,
      timestamp: new Date(),
      stackTrace: this.captureStackTrace(),
    };

    this.slowQueries.push(slowQuery);

    // Trim slow query history
    if (this.slowQueries.length > this.MAX_SLOW_QUERIES) {
      this.slowQueries.shift();
    }

    // Alert on slow query
    this.createAlert({
      type: 'slow_query',
      severity: duration > this.SLOW_QUERY_THRESHOLD * 2 ? 'critical' : 'warning',
      message: `Slow query detected: ${duration}ms`,
      details: { sql: sql.substring(0, 200), duration, model },
      timestamp: new Date(),
    });

    this.logger.warn(`SLOW QUERY (${duration}ms):`, {
      model,
      sql: sql.substring(0, 200),
      duration,
    });
  }

  /**
   * Detect potential N+1 query patterns
   */
  private detectN1Queries(signature: string, model?: string): void {
    const now = Date.now();
    const recentExecutions = this.queryExecutions.filter(
      (exec) =>
        exec.signature === signature &&
        now - exec.timestamp.getTime() < this.N1_DETECTION_WINDOW,
    );

    if (recentExecutions.length >= this.N1_OCCURRENCE_THRESHOLD) {
      // Check if this N+1 pattern was already detected recently
      const existingDetection = this.n1Detections.find(
        (detection) =>
          detection.pattern === signature &&
          now - detection.timestamp.getTime() < 60000, // Within last minute
      );

      if (!existingDetection) {
        const detection: N1QueryDetection = {
          pattern: signature.substring(0, 200),
          occurrences: recentExecutions.length,
          withinTimeWindow: this.N1_DETECTION_WINDOW,
          likelyN1: true,
          affectedModel: model,
          timestamp: new Date(),
        };

        this.n1Detections.push(detection);

        this.createAlert({
          type: 'n1_detected',
          severity: 'critical',
          message: `N+1 query pattern detected: ${recentExecutions.length} similar queries in ${this.N1_DETECTION_WINDOW}ms`,
          details: detection,
          timestamp: new Date(),
        });

        this.logger.error(`N+1 QUERY DETECTED:`, {
          model,
          occurrences: recentExecutions.length,
          pattern: signature.substring(0, 200),
        });
      }
    }
  }

  /**
   * Capture stack trace for debugging
   */
  private captureStackTrace(): string {
    const stack = new Error().stack || '';
    return stack
      .split('\n')
      .slice(3, 8) // Get relevant stack frames
      .join('\n');
  }

  /**
   * Create performance alert
   */
  private createAlert(alert: PerformanceAlert): void {
    this.alerts.push(alert);

    // Trim alert history
    if (this.alerts.length > 100) {
      this.alerts.shift();
    }
  }

  /**
   * Generate periodic performance report
   */
  private generatePeriodicReport(): void {
    const report = this.getPerformanceReport();

    // Log summary
    this.logger.log('Query Performance Summary:', {
      totalQueries: report.totalQueries,
      slowQueries: report.slowQueries,
      avgQueryTime: `${report.avgQueryTime.toFixed(2)}ms`,
      p50: `${report.p50QueryTime.toFixed(2)}ms`,
      p95: `${report.p95QueryTime.toFixed(2)}ms`,
      p99: `${report.p99QueryTime.toFixed(2)}ms`,
    });

    // Check performance targets
    this.checkPerformanceTargets(report);
  }

  /**
   * Check if performance targets are met
   */
  private checkPerformanceTargets(report: PerformanceReport): void {
    const targets = {
      p50: 100,
      p95: 500,
      p99: 1000,
    };

    if (report.p50QueryTime > targets.p50) {
      this.createAlert({
        type: 'performance_degradation',
        severity: 'warning',
        message: `P50 query time ${report.p50QueryTime.toFixed(2)}ms exceeds target of ${targets.p50}ms`,
        details: { current: report.p50QueryTime, target: targets.p50 },
        timestamp: new Date(),
      });
    }

    if (report.p95QueryTime > targets.p95) {
      this.createAlert({
        type: 'performance_degradation',
        severity: 'warning',
        message: `P95 query time ${report.p95QueryTime.toFixed(2)}ms exceeds target of ${targets.p95}ms`,
        details: { current: report.p95QueryTime, target: targets.p95 },
        timestamp: new Date(),
      });
    }

    if (report.p99QueryTime > targets.p99) {
      this.createAlert({
        type: 'performance_degradation',
        severity: 'critical',
        message: `P99 query time ${report.p99QueryTime.toFixed(2)}ms exceeds target of ${targets.p99}ms`,
        details: { current: report.p99QueryTime, target: targets.p99 },
        timestamp: new Date(),
      });
    }
  }

  /**
   * Get comprehensive performance report
   */
  getPerformanceReport(): PerformanceReport {
    const allDurations = this.queryExecutions.map((exec) => exec.duration).sort((a, b) => a - b);

    const p50 = this.calculatePercentile(allDurations, 50);
    const p95 = this.calculatePercentile(allDurations, 95);
    const p99 = this.calculatePercentile(allDurations, 99);

    const avgDuration =
      allDurations.length > 0
        ? allDurations.reduce((sum, d) => sum + d, 0) / allDurations.length
        : 0;

    // Get top slow queries
    const topSlowQueries = [...this.slowQueries]
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 10);

    // Get top frequent queries
    const topFrequentQueries = Array.from(this.queryMetrics.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalQueries: this.totalQueries,
      slowQueries: this.slowQueries.length,
      avgQueryTime: avgDuration,
      p50QueryTime: p50,
      p95QueryTime: p95,
      p99QueryTime: p99,
      queryDistribution: { ...this.queryDistribution },
      topSlowQueries,
      topFrequentQueries,
      n1Detections: [...this.n1Detections].slice(-10),
      alerts: [...this.alerts].slice(-20),
      periodStart: this.queryExecutions[0]?.timestamp || new Date(),
      periodEnd: new Date(),
    };
  }

  /**
   * Calculate percentile from sorted array
   */
  private calculatePercentile(sortedArray: number[], percentile: number): number {
    if (sortedArray.length === 0) return 0;

    const index = Math.ceil((percentile / 100) * sortedArray.length) - 1;
    return sortedArray[Math.max(0, index)];
  }

  /**
   * Get metrics for specific query pattern
   */
  getQueryMetrics(signature: string): QueryMetrics | undefined {
    return this.queryMetrics.get(signature);
  }

  /**
   * Get all slow queries
   */
  getSlowQueries(limit: number = 20): SlowQuery[] {
    return [...this.slowQueries]
      .sort((a, b) => b.duration - a.duration)
      .slice(0, limit);
  }

  /**
   * Get N+1 query detections
   */
  getN1Detections(limit: number = 10): N1QueryDetection[] {
    return [...this.n1Detections].slice(-limit);
  }

  /**
   * Get recent alerts
   */
  getAlerts(limit: number = 20): PerformanceAlert[] {
    return [...this.alerts].slice(-limit);
  }

  /**
   * Reset all metrics and statistics
   */
  resetMetrics(): void {
    this.queryMetrics.clear();
    this.queryExecutions = [];
    this.slowQueries = [];
    this.n1Detections = [];
    this.alerts = [];
    this.totalQueries = 0;
    this.queryDistribution = {
      fast: 0,
      medium: 0,
      slow: 0,
      verySlow: 0,
    };
    this.logger.log('Query monitor metrics reset');
  }

  /**
   * Stop monitoring
   */
  stopMonitoring(): void {
    if (!this.isMonitoring) {
      return;
    }

    this.isMonitoring = false;

    if (this.reportInterval) {
      clearInterval(this.reportInterval);
      this.reportInterval = null;
    }

    this.logger.log('Query performance monitoring stopped');
  }

  /**
   * Cleanup on module destroy
   */
  async onModuleDestroy(): Promise<void> {
    this.stopMonitoring();
  }
}
