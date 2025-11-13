/**
 * Query Performance Logger Service
 * Logs and monitors database query performance
 * HIPAA Compliance: Logs query patterns without exposing PHI data
 */

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize';

import { BaseService } from '../common/base';
import { BaseService } from '../common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { Inject } from '@nestjs/common';
import { BaseService } from '../common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { Inject } from '@nestjs/common';
import { BaseService } from '../common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { Inject } from '@nestjs/common';
import { BaseService } from '../common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { Inject } from '@nestjs/common';
export interface QueryMetrics {
  sql: string;
  duration: number;
  timestamp: Date;
  model?: string;
  operation?: string;
}

export interface SlowQueryAlert {
  sql: string;
  duration: number;
  threshold: number;
  model?: string;
  timestamp: Date;
}

export interface QueryStatistics {
  totalQueries: number;
  slowQueries: number;
  avgDuration: number;
  maxDuration: number;
  minDuration: number;
  queriesByModel: Record<string, number>;
  slowestQueries: QueryMetrics[];
  mostFrequentQueries: { query: string; count: number; avgDuration: number }[];
}

@Injectable()
export class QueryPerformanceLoggerService implements OnModuleInit {
  private metrics: QueryMetrics[] = [];
  private slowQueries: SlowQueryAlert[] = [];
  private queryStats = new Map<
    string,
    { count: number; totalDuration: number; maxDuration: number }
  >();

  private readonly MAX_METRICS_HISTORY = 1000;
  private readonly MAX_SLOW_QUERY_HISTORY = 100;
  private readonly SLOW_QUERY_THRESHOLD = 1000; // 1 second
  private readonly VERY_SLOW_QUERY_THRESHOLD = 5000; // 5 seconds

  constructor(@InjectConnection() private readonly sequelize: Sequelize) {}

  async onModuleInit() {
    this.setupQueryLogging();
    this.logInfo('Query Performance Logger initialized');
  }

  /**
   * Setup Sequelize query logging hooks
   */
  private setupQueryLogging(): void {
    // Hook before query execution
    this.sequelize.addHook('beforeQuery', (options: any, query: any) => {
      query.startTime = Date.now();
      query.startDate = new Date();
    });

    // Hook after query execution
    this.sequelize.addHook('afterQuery', (options: any, query: any) => {
      const duration = Date.now() - query.startTime;

      // Record metrics
      this.recordQueryMetrics({
        sql: this.sanitizeSQL(options.sql),
        duration,
        timestamp: query.startDate,
        model: options.model?.name,
        operation: this.extractOperation(options.sql),
      });

      // Check for slow queries
      if (duration > this.SLOW_QUERY_THRESHOLD) {
        this.recordSlowQuery({
          sql: this.sanitizeSQL(options.sql),
          duration,
          threshold: this.SLOW_QUERY_THRESHOLD,
          model: options.model?.name,
          timestamp: query.startDate,
        });

        // Log very slow queries immediately
        if (duration > this.VERY_SLOW_QUERY_THRESHOLD) {
          this.logError(`VERY SLOW QUERY (${duration}ms):`, {
            sql: this.sanitizeSQL(options.sql).substring(0, 200),
            model: options.model?.name,
            duration,
          });
        } else {
          this.logWarning(`SLOW QUERY (${duration}ms):`, {
            sql: this.sanitizeSQL(options.sql).substring(0, 200),
            model: options.model?.name,
            duration,
          });
        }
      }

      // Log all queries in development/debug mode
      if (
        process.env.DB_LOGGING === 'true' ||
        process.env.LOG_LEVEL === 'debug'
      ) {
        this.logDebug(
          `Query [${duration}ms]: ${this.sanitizeSQL(options.sql).substring(0, 100)}`,
        );
      }

      // Update query statistics
      this.updateQueryStats(options.sql, duration);
    });
  }

  /**
   * Record query metrics
   */
  private recordQueryMetrics(metrics: QueryMetrics): void {
    this.metrics.push(metrics);

    // Keep only recent metrics
    if (this.metrics.length > this.MAX_METRICS_HISTORY) {
      this.metrics.shift();
    }
  }

  /**
   * Record slow query
   */
  private recordSlowQuery(alert: SlowQueryAlert): void {
    this.slowQueries.push(alert);

    // Keep only recent slow queries
    if (this.slowQueries.length > this.MAX_SLOW_QUERY_HISTORY) {
      this.slowQueries.shift();
    }
  }

  /**
   * Update query statistics
   */
  private updateQueryStats(sql: string, duration: number): void {
    const normalizedQuery = this.normalizeQuery(sql);

    const stats = this.queryStats.get(normalizedQuery) || {
      count: 0,
      totalDuration: 0,
      maxDuration: 0,
    };

    stats.count++;
    stats.totalDuration += duration;
    stats.maxDuration = Math.max(stats.maxDuration, duration);

    this.queryStats.set(normalizedQuery, stats);
  }

  /**
   * Get query performance statistics
   */
  getStatistics(): QueryStatistics {
    if (this.metrics.length === 0) {
      return {
        totalQueries: 0,
        slowQueries: 0,
        avgDuration: 0,
        maxDuration: 0,
        minDuration: 0,
        queriesByModel: {},
        slowestQueries: [],
        mostFrequentQueries: [],
      };
    }

    const durations = this.metrics.map((m) => m.duration);
    const avgDuration =
      durations.reduce((sum, d) => sum + d, 0) / durations.length;
    const maxDuration = Math.max(...durations);
    const minDuration = Math.min(...durations);

    // Group by model
    const queriesByModel: Record<string, number> = {};
    this.metrics.forEach((m) => {
      if (m.model) {
        queriesByModel[m.model] = (queriesByModel[m.model] || 0) + 1;
      }
    });

    // Get slowest queries
    const slowestQueries = [...this.metrics]
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 10);

    // Get most frequent queries
    const mostFrequentQueries = Array.from(this.queryStats.entries())
      .map(([query, stats]) => ({
        query,
        count: stats.count,
        avgDuration: stats.totalDuration / stats.count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalQueries: this.metrics.length,
      slowQueries: this.slowQueries.length,
      avgDuration: Math.round(avgDuration * 100) / 100,
      maxDuration,
      minDuration,
      queriesByModel,
      slowestQueries,
      mostFrequentQueries,
    };
  }

  /**
   * Get slow queries
   */
  getSlowQueries(limit: number = 20): SlowQueryAlert[] {
    return this.slowQueries.slice(-limit);
  }

  /**
   * Get recent queries
   */
  getRecentQueries(limit: number = 50): QueryMetrics[] {
    return this.metrics.slice(-limit);
  }

  /**
   * Get performance report
   */
  getPerformanceReport(): string {
    const stats = this.getStatistics();

    const report = [
      '=== Database Query Performance Report ===',
      '',
      `Total Queries: ${stats.totalQueries}`,
      `Slow Queries: ${stats.slowQueries} (${((stats.slowQueries / stats.totalQueries) * 100).toFixed(2)}%)`,
      `Average Duration: ${stats.avgDuration.toFixed(2)}ms`,
      `Max Duration: ${stats.maxDuration}ms`,
      `Min Duration: ${stats.minDuration}ms`,
      '',
      'Queries by Model:',
      ...Object.entries(stats.queriesByModel)
        .sort((a, b) => b[1] - a[1])
        .map(([model, count]) => `  ${model}: ${count} queries`),
      '',
      'Top 5 Slowest Queries:',
      ...stats.slowestQueries
        .slice(0, 5)
        .map(
          (q, i) =>
            `  ${i + 1}. [${q.duration}ms] ${q.model || 'Unknown'}: ${q.sql.substring(0, 100)}...`,
        ),
      '',
      'Top 5 Most Frequent Queries:',
      ...stats.mostFrequentQueries
        .slice(0, 5)
        .map(
          (q, i) =>
            `  ${i + 1}. [${q.count}x, avg ${q.avgDuration.toFixed(2)}ms] ${q.query.substring(0, 100)}...`,
        ),
      '',
      '========================================',
    ];

    return report.join('\n');
  }

  /**
   * Clear metrics history
   */
  clearHistory(): void {
    this.metrics = [];
    this.slowQueries = [];
    this.queryStats.clear();
    this.logInfo('Query performance history cleared');
  }

  /**
   * Reset statistics
   */
  resetStatistics(): void {
    this.queryStats.clear();
    this.logInfo('Query statistics reset');
  }

  // Private helper methods

  /**
   * Sanitize SQL to remove PHI data
   */
  private sanitizeSQL(sql: string): string {
    // Remove parameter values that might contain PHI
    return sql
      .replace(/'\w+@\w+\.\w+'/g, "'[EMAIL]'") // Email addresses
      .replace(/'\d{3}-\d{2}-\d{4}'/g, "'[SSN]'") // SSN patterns
      .replace(/'\d{10,}'/g, "'[PHONE]'") // Phone numbers
      .replace(/'[A-Z][a-z]+ [A-Z][a-z]+'/g, "'[NAME]'"); // Names (approximate)
  }

  /**
   * Normalize query for grouping similar queries
   */
  private normalizeQuery(sql: string): string {
    return sql
      .replace(/\$\d+/g, '?') // Replace positional parameters
      .replace(/'\d+'/g, "'?'") // Replace numeric literals
      .replace(/\d+/g, '?') // Replace all numbers
      .replace(/\s+/g, ' ') // Normalize whitespace
      .toLowerCase()
      .substring(0, 500); // Limit length
  }

  /**
   * Extract operation type from SQL
   */
  private extractOperation(sql: string): string {
    const normalized = sql.trim().toLowerCase();

    if (normalized.startsWith('select')) return 'SELECT';
    if (normalized.startsWith('insert')) return 'INSERT';
    if (normalized.startsWith('update')) return 'UPDATE';
    if (normalized.startsWith('delete')) return 'DELETE';
    if (normalized.startsWith('create')) return 'CREATE';
    if (normalized.startsWith('alter')) return 'ALTER';
    if (normalized.startsWith('drop')) return 'DROP';

    return 'UNKNOWN';
  }

  /**
   * Log performance summary (can be called periodically)
   */
  logPerformanceSummary(): void {
    const stats = this.getStatistics();

    if (stats.totalQueries === 0) {
      return;
    }

    this.logInfo('Query Performance Summary:', {
      totalQueries: stats.totalQueries,
      slowQueries: stats.slowQueries,
      avgDuration: `${stats.avgDuration.toFixed(2)}ms`,
      maxDuration: `${stats.maxDuration}ms`,
    });

    // Warn if slow query rate is high
    const slowQueryRate = (stats.slowQueries / stats.totalQueries) * 100;
    if (slowQueryRate > 10) {
      this.logWarning(
        `High slow query rate: ${slowQueryRate.toFixed(2)}% (${stats.slowQueries}/${stats.totalQueries})`,
      );
    }
  }
}
