/**
 * @fileoverview Slow Query Detector Service
 * @module infrastructure/monitoring/services
 * @description Service for detecting and tracking slow database queries
 */

import { Injectable, Logger } from '@nestjs/common';
import { SlowQuery, PerformanceAlert } from '../types/query-monitor.types';

import { BaseService } from '../../../common/base';
@Injectable()
export class SlowQueryDetectorService extends BaseService {
  // Configuration
  private readonly SLOW_QUERY_THRESHOLD = 1000; // 1 second
  private readonly MAX_SLOW_QUERIES = 100;

  // Storage
  private slowQueries: SlowQuery[] = [];
  private alerts: PerformanceAlert[] = [];

  constructor() {}

  /**
   * Check if query is slow and record it
   */
  checkAndRecordSlowQuery(sql: string, duration: number, model?: string): boolean {
    if (duration <= this.SLOW_QUERY_THRESHOLD) {
      return false;
    }

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

    // Create alert
    this.createAlert(slowQuery);

    this.logWarning(`SLOW QUERY (${duration}ms):`, {
      model,
      sql: sql.substring(0, 200),
      duration,
    });

    return true;
  }

  /**
   * Create performance alert for slow query
   */
  private createAlert(slowQuery: SlowQuery): void {
    const alert: PerformanceAlert = {
      type: 'slow_query',
      severity: slowQuery.duration > this.SLOW_QUERY_THRESHOLD * 2 ? 'critical' : 'warning',
      message: `Slow query detected: ${slowQuery.duration}ms`,
      details: {
        sql: slowQuery.sql.substring(0, 200),
        duration: slowQuery.duration,
        model: slowQuery.model,
      },
      timestamp: new Date(),
    };

    this.alerts.push(alert);

    // Trim alert history
    if (this.alerts.length > 100) {
      this.alerts.shift();
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
   * Get all slow queries
   */
  getSlowQueries(limit: number = 20): SlowQuery[] {
    return [...this.slowQueries]
      .sort((a, b) => b.duration - a.duration)
      .slice(0, limit);
  }

  /**
   * Get slow queries within time range
   */
  getSlowQueriesInRange(startTime: Date, endTime: Date): SlowQuery[] {
    return this.slowQueries.filter(
      query => query.timestamp >= startTime && query.timestamp <= endTime,
    );
  }

  /**
   * Get top slow queries by duration
   */
  getTopSlowQueries(limit: number = 10): SlowQuery[] {
    return [...this.slowQueries]
      .sort((a, b) => b.duration - a.duration)
      .slice(0, limit);
  }

  /**
   * Get slow query count
   */
  getSlowQueryCount(): number {
    return this.slowQueries.length;
  }

  /**
   * Get average slow query duration
   */
  getAverageSlowQueryDuration(): number {
    if (this.slowQueries.length === 0) return 0;

    const total = this.slowQueries.reduce((sum, query) => sum + query.duration, 0);
    return total / this.slowQueries.length;
  }

  /**
   * Get recent alerts
   */
  getAlerts(limit: number = 20): PerformanceAlert[] {
    return [...this.alerts].slice(-limit);
  }

  /**
   * Check if there are any critical slow queries
   */
  hasCriticalSlowQueries(): boolean {
    return this.slowQueries.some(query => query.duration > this.SLOW_QUERY_THRESHOLD * 2);
  }

  /**
   * Get slow query statistics
   */
  getSlowQueryStats() {
    const queries = this.slowQueries;
    const total = queries.length;

    if (total === 0) {
      return {
        total: 0,
        averageDuration: 0,
        maxDuration: 0,
        minDuration: 0,
        criticalCount: 0,
      };
    }

    const durations = queries.map(q => q.duration);
    const maxDuration = Math.max(...durations);
    const minDuration = Math.min(...durations);
    const averageDuration = durations.reduce((sum, d) => sum + d, 0) / total;
    const criticalCount = queries.filter(q => q.duration > this.SLOW_QUERY_THRESHOLD * 2).length;

    return {
      total,
      averageDuration,
      maxDuration,
      minDuration,
      criticalCount,
    };
  }

  /**
   * Reset slow query data
   */
  reset(): void {
    this.slowQueries = [];
    this.alerts = [];
    this.logInfo('Slow query detector reset');
  }
}
