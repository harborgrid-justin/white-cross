/**
 * Query Logger Service
 * Tracks and logs query performance metrics for database optimization
 *
 * Features:
 * - Slow query detection and logging
 * - Query statistics aggregation
 * - N+1 query pattern detection
 * - Performance metrics export
 */

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';

import { BaseService } from '../../common/base';
import { BaseService } from '../../common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { Inject } from '@nestjs/common';
import { BaseService } from '../../common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { Inject } from '@nestjs/common';
import { BaseService } from '../../common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { Inject } from '@nestjs/common';
import { BaseService } from '../../common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { Inject } from '@nestjs/common';
export interface QueryMetrics {
  count: number;
  totalDuration: number;
  avgDuration: number;
  maxDuration: number;
  minDuration: number;
  lastExecuted: Date;
}

export interface SlowQuery {
  sql: string;
  duration: number;
  timestamp: Date;
  model?: string;
  bindings?: any[];
}

@Injectable()
export class QueryLoggerService extends BaseService implements OnModuleInit {
  // Configuration
  private readonly SLOW_QUERY_THRESHOLD = 500; // 500ms
  private readonly N_PLUS_ONE_THRESHOLD = 10; // Number of similar queries in short time
  private readonly N_PLUS_ONE_WINDOW = 1000; // 1 second window

  // Metrics storage
  private queryStats = new Map<string, QueryMetrics>();
  private slowQueries: SlowQuery[] = [];
  private recentQueries: Array<{ signature: string; timestamp: number }> = [];

  // Query tracking
  private activeQueries = new Map<
    string,
    { startTime: number; options: any }
  >();

  constructor(@InjectConnection() private readonly sequelize: Sequelize) {}

  async onModuleInit(): Promise<void> {
    this.logInfo('Initializing Query Logger Service');
    this.setupQueryHooks();
  }

  /**
   * Set up Sequelize hooks for query tracking
   */
  private setupQueryHooks(): void {
    // Before query execution
    this.sequelize.addHook('beforeQuery', (options: any, query: any) => {
      const queryId = this.generateQueryId();
      query.queryId = queryId;
      query.startTime = Date.now();

      this.activeQueries.set(queryId, {
        startTime: query.startTime,
        options,
      });
    });

    // After query execution
    this.sequelize.addHook('afterQuery', (options: any, query: any) => {
      const duration = Date.now() - query.startTime;
      const queryId = query.queryId;

      // Remove from active queries
      this.activeQueries.delete(queryId);

      // Record query metrics
      this.recordQueryExecution(options, duration);

      // Check for slow queries
      if (duration > this.SLOW_QUERY_THRESHOLD) {
        this.recordSlowQuery(options, duration);
      }

      // Check for N+1 patterns
      this.detectNPlusOne(options, duration);

      // Clean up old data periodically
      if (Math.random() < 0.01) {
        // 1% chance on each query
        this.cleanupOldData();
      }
    });

    this.logInfo('Query hooks configured successfully');
  }

  /**
   * Record query execution metrics
   */
  private recordQueryExecution(options: any, duration: number): void {
    const signature = this.normalizeQuery(options.sql);

    const existingStats = this.queryStats.get(signature) || {
      count: 0,
      totalDuration: 0,
      avgDuration: 0,
      maxDuration: 0,
      minDuration: Infinity,
      lastExecuted: new Date(),
    };

    existingStats.count++;
    existingStats.totalDuration += duration;
    existingStats.avgDuration =
      existingStats.totalDuration / existingStats.count;
    existingStats.maxDuration = Math.max(existingStats.maxDuration, duration);
    existingStats.minDuration = Math.min(existingStats.minDuration, duration);
    existingStats.lastExecuted = new Date();

    this.queryStats.set(signature, existingStats);

    // Track for N+1 detection
    this.recentQueries.push({
      signature,
      timestamp: Date.now(),
    });
  }

  /**
   * Record slow query for analysis
   */
  private recordSlowQuery(options: any, duration: number): void {
    const slowQuery: SlowQuery = {
      sql: options.sql?.substring(0, 500), // Limit SQL length
      duration,
      timestamp: new Date(),
      model: options.model?.name,
      bindings: options.bind,
    };

    this.slowQueries.push(slowQuery);

    // Keep only last 100 slow queries
    if (this.slowQueries.length > 100) {
      this.slowQueries.shift();
    }

    // Log slow query warning
    this.logWarning(`Slow query detected (${duration}ms)`, {
      sql: slowQuery.sql,
      model: slowQuery.model,
      duration,
      threshold: this.SLOW_QUERY_THRESHOLD,
    });
  }

  /**
   * Detect N+1 query patterns
   */
  private detectNPlusOne(options: any, duration: number): void {
    const signature = this.normalizeQuery(options.sql);
    const now = Date.now();

    // Clean up old entries from recent queries
    this.recentQueries = this.recentQueries.filter(
      (q) => now - q.timestamp < this.N_PLUS_ONE_WINDOW,
    );

    // Count similar queries in the time window
    const similarQueries = this.recentQueries.filter(
      (q) => q.signature === signature,
    );

    if (similarQueries.length >= this.N_PLUS_ONE_THRESHOLD) {
      this.logWarning(`Possible N+1 query pattern detected`, {
        count: similarQueries.length,
        window: `${this.N_PLUS_ONE_WINDOW}ms`,
        sql: options.sql?.substring(0, 200),
        model: options.model?.name,
        suggestion: 'Consider using eager loading with include/associations',
      });

      // Clear the detected pattern to avoid spam
      this.recentQueries = this.recentQueries.filter(
        (q) => q.signature !== signature,
      );
    }
  }

  /**
   * Normalize SQL query for grouping similar queries
   */
  private normalizeQuery(sql: string): string {
    if (!sql) return '';

    return (
      sql
        // Remove parameter values
        .replace(/\$\d+/g, '?')
        .replace(/'[^']*'/g, "'?'")
        .replace(/"\d+"/g, '"?"')
        .replace(/\d+/g, '?')
        // Normalize whitespace
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase()
    );
  }

  /**
   * Generate unique query ID
   */
  private generateQueryId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Clean up old data to prevent memory leaks
   */
  private cleanupOldData(): void {
    const now = Date.now();
    const ONE_HOUR = 60 * 60 * 1000;

    // Clean up old recent queries
    this.recentQueries = this.recentQueries.filter(
      (q) => now - q.timestamp < ONE_HOUR,
    );

    // Keep only recent slow queries (last hour)
    this.slowQueries = this.slowQueries.filter(
      (q) => now - q.timestamp.getTime() < ONE_HOUR,
    );

    // Limit query stats size (keep top 1000 by execution count)
    if (this.queryStats.size > 1000) {
      const sortedStats = Array.from(this.queryStats.entries())
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 1000);

      this.queryStats = new Map(sortedStats);
    }
  }

  /**
   * Get performance report
   */
  getPerformanceReport(): {
    totalQueries: number;
    slowQueries: SlowQuery[];
    topSlowQueries: Array<{ signature: string; metrics: QueryMetrics }>;
    topFrequentQueries: Array<{ signature: string; metrics: QueryMetrics }>;
    activeQueries: number;
  } {
    const sortedByDuration = Array.from(this.queryStats.entries())
      .sort((a, b) => b[1].avgDuration - a[1].avgDuration)
      .slice(0, 10)
      .map(([signature, metrics]) => ({ signature, metrics }));

    const sortedByFrequency = Array.from(this.queryStats.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 10)
      .map(([signature, metrics]) => ({ signature, metrics }));

    const totalQueries = Array.from(this.queryStats.values()).reduce(
      (sum, stats) => sum + stats.count,
      0,
    );

    return {
      totalQueries,
      slowQueries: [...this.slowQueries].reverse(), // Most recent first
      topSlowQueries: sortedByDuration,
      topFrequentQueries: sortedByFrequency,
      activeQueries: this.activeQueries.size,
    };
  }

  /**
   * Get query statistics for a specific query
   */
  getQueryStats(sql: string): QueryMetrics | null {
    const signature = this.normalizeQuery(sql);
    return this.queryStats.get(signature) || null;
  }

  /**
   * Get all slow queries
   */
  getSlowQueries(): SlowQuery[] {
    return [...this.slowQueries].reverse();
  }

  /**
   * Get currently executing queries
   */
  getActiveQueries(): Array<{
    queryId: string;
    duration: number;
    options: any;
  }> {
    const now = Date.now();
    return Array.from(this.activeQueries.entries()).map(([queryId, data]) => ({
      queryId,
      duration: now - data.startTime,
      options: {
        sql: data.options.sql?.substring(0, 200),
        model: data.options.model?.name,
      },
    }));
  }

  /**
   * Reset all statistics (for testing/debugging)
   */
  resetStats(): void {
    this.queryStats.clear();
    this.slowQueries = [];
    this.recentQueries = [];
    this.logInfo('Query statistics reset');
  }

  /**
   * Get formatted report for logging
   */
  getFormattedReport(): string {
    const report = this.getPerformanceReport();

    let output = '\n=== Query Performance Report ===\n';
    output += `Total Queries Executed: ${report.totalQueries}\n`;
    output += `Slow Queries (>${this.SLOW_QUERY_THRESHOLD}ms): ${report.slowQueries.length}\n`;
    output += `Active Queries: ${report.activeQueries}\n\n`;

    output += '=== Top 5 Slowest Queries (by avg duration) ===\n';
    report.topSlowQueries.slice(0, 5).forEach((item, idx) => {
      output += `${idx + 1}. Avg: ${item.metrics.avgDuration.toFixed(2)}ms, `;
      output += `Count: ${item.metrics.count}, `;
      output += `Max: ${item.metrics.maxDuration}ms\n`;
      output += `   SQL: ${item.signature.substring(0, 100)}...\n`;
    });

    output += '\n=== Top 5 Most Frequent Queries ===\n';
    report.topFrequentQueries.slice(0, 5).forEach((item, idx) => {
      output += `${idx + 1}. Count: ${item.metrics.count}, `;
      output += `Avg: ${item.metrics.avgDuration.toFixed(2)}ms\n`;
      output += `   SQL: ${item.signature.substring(0, 100)}...\n`;
    });

    if (report.slowQueries.length > 0) {
      output += '\n=== Recent Slow Queries (last 5) ===\n';
      report.slowQueries.slice(0, 5).forEach((query, idx) => {
        output += `${idx + 1}. ${query.duration}ms at ${query.timestamp.toISOString()}\n`;
        output += `   Model: ${query.model || 'N/A'}\n`;
        output += `   SQL: ${query.sql}\n`;
      });
    }

    return output;
  }

  /**
   * Export metrics in Prometheus format
   */
  getPrometheusMetrics(): string {
    const report = this.getPerformanceReport();

    return `
# HELP db_queries_total Total number of database queries executed
# TYPE db_queries_total counter
db_queries_total ${report.totalQueries}

# HELP db_slow_queries_total Total number of slow queries
# TYPE db_slow_queries_total counter
db_slow_queries_total ${report.slowQueries.length}

# HELP db_active_queries Number of currently executing queries
# TYPE db_active_queries gauge
db_active_queries ${report.activeQueries}

# HELP db_unique_query_patterns Number of unique query patterns
# TYPE db_unique_query_patterns gauge
db_unique_query_patterns ${this.queryStats.size}
    `.trim();
  }
}
