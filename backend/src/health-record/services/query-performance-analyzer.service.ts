/**
 * @fileoverview Query Performance Analyzer Service
 * @module health-record/services
 * @description Advanced query performance monitoring and optimization with database persistence
 *
 * HIPAA CRITICAL - This service analyzes PHI query patterns for performance optimization with persistent storage
 *
 * @compliance HIPAA Privacy Rule §164.308, HIPAA Security Rule §164.312
 */

import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Op } from 'sequelize';
import { HealthRecordMetricsService } from './health-record-metrics.service';
import { PHIAccessLogger } from './phi-access-logger.service';
import { PerformanceMetric, MetricType } from '../../database/models/performance-metric.model';
import { ComplianceLevel } from '../interfaces/health-record-types';

export interface QueryMetrics {
  queryId: string;
  sql: string;
  executionTime: number;
  rowsAffected: number;
  indexesUsed: string[];
  planHash: string;
  complexity: QueryComplexity;
  compliance: ComplianceLevel;
  timestamp: Date;
  parameters?: any;
  stackTrace?: string;
}

export enum QueryComplexity {
  SIMPLE = 'SIMPLE',           // Single table, simple conditions
  MODERATE = 'MODERATE',       // Join 2-3 tables, moderate conditions
  COMPLEX = 'COMPLEX',         // Join 4+ tables, complex conditions
  VERY_COMPLEX = 'VERY_COMPLEX' // Subqueries, CTEs, complex aggregations
}

export interface SlowQuery {
  queryMetrics: QueryMetrics;
  frequency: number;
  averageTime: number;
  maxTime: number;
  minTime: number;
  lastSeen: Date;
  optimizationSuggestions: OptimizationSuggestion[];
}

export interface OptimizationSuggestion {
  type: 'INDEX' | 'QUERY_REWRITE' | 'CACHING' | 'PARTITIONING' | 'DENORMALIZATION';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  estimatedImprovement: number; // Percentage
  implementation: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface QueryPattern {
  pattern: string;
  frequency: number;
  averageExecutionTime: number;
  dataTypes: string[];
  complianceLevel: ComplianceLevel;
  suggestions: OptimizationSuggestion[];
}

/**
 * Query Performance Analyzer Service
 *
 * Provides advanced query performance monitoring and optimization with database persistence:
 * - Real-time query execution monitoring with persistent storage
 * - Slow query detection and analysis
 * - Query optimization recommendations
 * - Performance regression detection
 * - Database-backed metrics and analysis
 */
@Injectable()
export class QueryPerformanceAnalyzer implements OnModuleDestroy {
  private readonly logger = new Logger(QueryPerformanceAnalyzer.name);

  // In-memory caches for performance
  private readonly slowQueries = new Map<string, SlowQuery>();
  private readonly queryPatterns = new Map<string, QueryPattern>();

  // Performance thresholds
  private readonly slowQueryThreshold = 1000; // 1 second
  private readonly verySlowQueryThreshold = 5000; // 5 seconds

  constructor(
    private readonly metricsService: HealthRecordMetricsService,
    private readonly phiLogger: PHIAccessLogger,
    private readonly eventEmitter: EventEmitter2,
    @InjectModel(PerformanceMetric) private readonly performanceMetricModel: typeof PerformanceMetric,
  ) {
    this.initializeAnalyzer();
    this.setupEventListeners();
  }

  /**
   * Initialize the query performance analyzer
   */
  private initializeAnalyzer(): void {
    this.logger.log('Initializing Query Performance Analyzer with database persistence');
    this.logger.log('Query Performance Analyzer initialized successfully');
  }

  /**
   * Record query execution metrics with database persistence
   */
  async recordQuery(
    sql: string,
    executionTime: number,
    rowsAffected: number = 0,
    compliance: ComplianceLevel = 'INTERNAL',
    parameters?: any,
    stackTrace?: string
  ): Promise<string> {
    const queryId = this.generateQueryId(sql);
    const normalizedSQL = this.normalizeSQL(sql);

    const queryMetrics: QueryMetrics = {
      queryId,
      sql: normalizedSQL,
      executionTime,
      rowsAffected,
      indexesUsed: this.extractIndexesUsed(sql),
      planHash: this.generatePlanHash(sql),
      complexity: this.calculateComplexity(sql),
      compliance,
      timestamp: new Date(),
      parameters,
      stackTrace
    };

    try {
      // Store query metrics in database
      await this.performanceMetricModel.create({
        metricType: MetricType.DATABASE_QUERY_TIME,
        value: executionTime,
        unit: 'ms',
        recordedAt: new Date(),
        tags: {
          queryId,
          sql: normalizedSQL,
          rowsAffected,
          indexesUsed: queryMetrics.indexesUsed,
          planHash: queryMetrics.planHash,
          complexity: queryMetrics.complexity,
          compliance,
          parameters: parameters ? JSON.stringify(parameters) : null,
          stackTrace
        }
      });

      // Check for slow queries
      if (executionTime > this.slowQueryThreshold) {
        await this.recordSlowQuery(queryMetrics);
      }

      // Update query patterns
      await this.updateQueryPattern(queryMetrics);

      // Log PHI access for sensitive queries
      if (compliance === 'PHI' || compliance === 'SENSITIVE_PHI') {
        this.phiLogger.logPHIAccess({
          correlationId: queryId,
          timestamp: new Date(),
          operation: 'QUERY_EXECUTE',
          dataTypes: this.extractDataTypesFromSQL(sql),
          recordCount: rowsAffected,
          sensitivityLevel: compliance,
          ipAddress: 'internal',
          userAgent: 'query-performance-analyzer',
          success: true,
        });
      }

      this.logger.debug(`Recorded query performance: ${queryId}, time: ${executionTime}ms, complexity: ${queryMetrics.complexity}`);

    } catch (error) {
      this.logger.error(`Failed to record query metrics for ${queryId}:`, error);
    }

    return queryId;
  }

  /**
   * Get query performance statistics from database
   */
  async getQueryPerformanceStats(
    startDate: Date,
    endDate: Date,
    complianceLevel?: ComplianceLevel
  ): Promise<{
    totalQueries: number;
    averageExecutionTime: number;
    slowQueriesCount: number;
    queriesByComplexity: Record<QueryComplexity, number>;
    topSlowQueries: SlowQuery[];
  }> {
    try {
      const whereClause: any = {
        metricType: MetricType.DATABASE_QUERY_TIME,
        recordedAt: {
          [Op.between]: [startDate, endDate]
        }
      };

      if (complianceLevel) {
        // Note: tags is a JSON field, so we can't easily filter by nested compliance
        // This would require a more complex query or denormalization
      }

      const metrics = await this.performanceMetricModel.findAll({
        where: whereClause,
        attributes: ['value', 'tags']
      });

      const totalQueries = metrics.length;
      const totalTime = metrics.reduce((sum, metric) => sum + metric.value, 0);
      const averageExecutionTime = totalQueries > 0 ? totalTime / totalQueries : 0;

      const slowQueriesCount = metrics.filter(m => m.value > this.slowQueryThreshold).length;

      const queriesByComplexity: Record<QueryComplexity, number> = {
        SIMPLE: 0,
        MODERATE: 0,
        COMPLEX: 0,
        VERY_COMPLEX: 0
      };

      metrics.forEach(metric => {
        const complexity = (metric.tags as any)?.complexity;
        if (complexity && queriesByComplexity[complexity] !== undefined) {
          queriesByComplexity[complexity]++;
        }
      });

      const topSlowQueries = await this.getTopSlowQueries(10, startDate, endDate);

      return {
        totalQueries,
        averageExecutionTime,
        slowQueriesCount,
        queriesByComplexity,
        topSlowQueries
      };

    } catch (error) {
      this.logger.error('Failed to get query performance stats:', error);
      return {
        totalQueries: 0,
        averageExecutionTime: 0,
        slowQueriesCount: 0,
        queriesByComplexity: { SIMPLE: 0, MODERATE: 0, COMPLEX: 0, VERY_COMPLEX: 0 },
        topSlowQueries: []
      };
    }
  }

  /**
   * Get top slow queries from database
   */
  async getTopSlowQueries(
    limit: number = 10,
    startDate?: Date,
    endDate?: Date
  ): Promise<SlowQuery[]> {
    try {
      const whereClause: any = {
        metricType: MetricType.DATABASE_QUERY_TIME,
        value: {
          [Op.gt]: this.slowQueryThreshold
        }
      };

      if (startDate && endDate) {
        whereClause.recordedAt = {
          [Op.between]: [startDate, endDate]
        };
      }

      const slowMetrics = await this.performanceMetricModel.findAll({
        where: whereClause,
        order: [['value', 'DESC']],
        limit,
        attributes: ['value', 'tags', 'createdAt']
      });

      return slowMetrics.map(metric => {
        const tags = metric.tags as any;
        return {
          queryMetrics: {
            queryId: tags?.queryId || '',
            sql: tags?.sql || '',
            executionTime: metric.value,
            rowsAffected: tags?.rowsAffected || 0,
            indexesUsed: tags?.indexesUsed || [],
            planHash: tags?.planHash || '',
            complexity: tags?.complexity || QueryComplexity.SIMPLE,
            compliance: tags?.compliance || 'INTERNAL',
            timestamp: metric.recordedAt || new Date(),
            parameters: tags?.parameters,
            stackTrace: tags?.stackTrace
          },
          frequency: 1, // Would need aggregation for accurate frequency
          averageTime: metric.value,
          maxTime: metric.value,
          minTime: metric.value,
          lastSeen: metric.recordedAt || new Date(),
          optimizationSuggestions: this.generateOptimizationSuggestions(tags?.sql || '', metric.value)
        };
      });

    } catch (error) {
      this.logger.error('Failed to get top slow queries:', error);
      return [];
    }
  }

  /**
   * Store performance analysis snapshot (runs daily)
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async storePerformanceAnalysisSnapshot(): Promise<void> {
    try {
      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000); // Last 24 hours

      const stats = await this.getQueryPerformanceStats(startDate, endDate);

      // Store analysis metrics
      const analysisMetrics = [
        {
          metricType: MetricType.REQUEST_COUNT,
          value: stats.totalQueries,
          unit: 'count'
        },
        {
          metricType: MetricType.API_RESPONSE_TIME,
          value: stats.averageExecutionTime,
          unit: 'ms'
        },
        {
          metricType: MetricType.ERROR_RATE,
          value: stats.slowQueriesCount,
          unit: 'count'
        }
      ];

      // Bulk create analysis metrics
      await this.performanceMetricModel.bulkCreate(
        analysisMetrics.map(metric => ({
          metricType: metric.metricType,
          value: metric.value,
          unit: metric.unit,
          recordedAt: new Date(),
          tags: {
            analysisPeriod: { start: startDate, end: endDate },
            snapshotType: 'daily_performance_analysis'
          }
        }))
      );

      this.logger.log(`Stored performance analysis snapshot: ${stats.totalQueries} queries analyzed`);

    } catch (error) {
      this.logger.error('Failed to store performance analysis snapshot:', error);
    }
  }

  /**
   * Record slow query with database persistence
   */
  private async recordSlowQuery(queryMetrics: QueryMetrics): Promise<void> {
    const key = queryMetrics.planHash;

    try {
      // Store slow query metric
      await this.performanceMetricModel.create({
        metricType: MetricType.ERROR_RATE,
        value: queryMetrics.executionTime,
        unit: 'ms',
        recordedAt: new Date(),
        tags: {
          queryId: queryMetrics.queryId,
          sql: queryMetrics.sql,
          planHash: queryMetrics.planHash,
          complexity: queryMetrics.complexity,
          compliance: queryMetrics.compliance,
          type: 'slow_query'
        }
      });

      // Update in-memory cache for quick access
      const existing = this.slowQueries.get(key);
      if (existing) {
        existing.frequency++;
        existing.averageTime = (existing.averageTime + queryMetrics.executionTime) / 2;
        existing.maxTime = Math.max(existing.maxTime, queryMetrics.executionTime);
        existing.minTime = Math.min(existing.minTime, queryMetrics.executionTime);
        existing.lastSeen = queryMetrics.timestamp;
      } else {
        this.slowQueries.set(key, {
          queryMetrics,
          frequency: 1,
          averageTime: queryMetrics.executionTime,
          maxTime: queryMetrics.executionTime,
          minTime: queryMetrics.executionTime,
          lastSeen: queryMetrics.timestamp,
          optimizationSuggestions: this.generateOptimizationSuggestions(queryMetrics.sql, queryMetrics.executionTime)
        });
      }

      this.logger.warn(`Slow query detected: ${queryMetrics.queryId}, time: ${queryMetrics.executionTime}ms`);

    } catch (error) {
      this.logger.error(`Failed to record slow query ${queryMetrics.queryId}:`, error);
    }
  }

  /**
   * Update query pattern analysis
   */
  private async updateQueryPattern(queryMetrics: QueryMetrics): Promise<void> {
    const pattern = this.extractQueryPattern(queryMetrics.sql);
    const existing = this.queryPatterns.get(pattern);

    if (existing) {
      existing.frequency++;
      existing.averageExecutionTime = (existing.averageExecutionTime + queryMetrics.executionTime) / 2;
    } else {
      this.queryPatterns.set(pattern, {
        pattern,
        frequency: 1,
        averageExecutionTime: queryMetrics.executionTime,
        dataTypes: this.extractDataTypesFromSQL(queryMetrics.sql),
        complianceLevel: queryMetrics.compliance,
        suggestions: this.generateOptimizationSuggestions(queryMetrics.sql, queryMetrics.executionTime)
      });
    }
  }

  /**
   * Generate optimization suggestions for a query
   */
  private generateOptimizationSuggestions(sql: string, executionTime: number): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = [];

    // Check for common optimization opportunities
    if (sql.toLowerCase().includes('select *')) {
      suggestions.push({
        type: 'QUERY_REWRITE',
        priority: 'MEDIUM',
        description: 'Replace SELECT * with specific column names',
        estimatedImprovement: 15,
        implementation: 'Specify only required columns in SELECT clause',
        riskLevel: 'LOW'
      });
    }

    if (executionTime > this.verySlowQueryThreshold) {
      suggestions.push({
        type: 'INDEX',
        priority: 'HIGH',
        description: 'Consider adding database indexes on frequently queried columns',
        estimatedImprovement: 80,
        implementation: 'Analyze query execution plan and add appropriate indexes',
        riskLevel: 'MEDIUM'
      });
    }

    if (sql.toLowerCase().includes('like') && !sql.toLowerCase().includes('like binary')) {
      suggestions.push({
        type: 'INDEX',
        priority: 'MEDIUM',
        description: 'LIKE queries without indexes can be slow',
        estimatedImprovement: 70,
        implementation: 'Consider full-text search or add appropriate indexes',
        riskLevel: 'MEDIUM'
      });
    }

    return suggestions;
  }

  /**
   * Extract query pattern for analysis
   */
  private extractQueryPattern(sql: string): string {
    // Normalize query by replacing literals with placeholders
    return sql
      .replace(/\b\d+\b/g, '?') // Replace numbers
      .replace(/'[^']*'/g, '?') // Replace string literals
      .replace(/\b(true|false)\b/gi, '?') // Replace booleans
      .trim();
  }

  /**
   * Extract data types from SQL query
   */
  private extractDataTypesFromSQL(sql: string): string[] {
    const dataTypes: string[] = [];
    const lowerSQL = sql.toLowerCase();

    if (lowerSQL.includes('allerg')) dataTypes.push('allergies');
    if (lowerSQL.includes('vaccin')) dataTypes.push('vaccinations');
    if (lowerSQL.includes('chronic') || lowerSQL.includes('condition')) dataTypes.push('chronicConditions');
    if (lowerSQL.includes('vital') || lowerSQL.includes('sign')) dataTypes.push('vitalSigns');
    if (lowerSQL.includes('student')) dataTypes.push('students');
    if (lowerSQL.includes('clinic') || lowerSQL.includes('visit')) dataTypes.push('clinicVisits');

    return dataTypes.length > 0 ? dataTypes : ['unknown'];
  }

  /**
   * Extract indexes used from SQL (simplified)
   */
  private extractIndexesUsed(sql: string): string[] {
    // This is a simplified implementation
    // In a real system, this would parse the execution plan
    const indexes: string[] = [];
    const lowerSQL = sql.toLowerCase();

    if (lowerSQL.includes('where') && lowerSQL.includes('id')) {
      indexes.push('primary_key');
    }

    return indexes;
  }

  /**
   * Generate plan hash for query identification
   */
  private generatePlanHash(sql: string): string {
    // Simple hash for query plan identification
    let hash = 0;
    for (let i = 0; i < sql.length; i++) {
      const char = sql.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  /**
   * Calculate query complexity
   */
  private calculateComplexity(sql: string): QueryComplexity {
    const lowerSQL = sql.toLowerCase();
    const joinCount = (lowerSQL.match(/\bjoin\b/g) || []).length;
    const hasSubquery = lowerSQL.includes('select') && lowerSQL.includes('(') && lowerSQL.includes(')');
    const hasCTE = lowerSQL.includes('with') && lowerSQL.includes('as') && lowerSQL.includes('(');
    const hasAggregation = /\b(count|sum|avg|min|max|group by)\b/.test(lowerSQL);

    if (hasCTE || hasSubquery || joinCount > 3) {
      return QueryComplexity.VERY_COMPLEX;
    } else if (joinCount > 1 || hasAggregation) {
      return QueryComplexity.COMPLEX;
    } else if (joinCount === 1) {
      return QueryComplexity.MODERATE;
    } else {
      return QueryComplexity.SIMPLE;
    }
  }

  /**
   * Normalize SQL for comparison
   */
  private normalizeSQL(sql: string): string {
    return sql
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/\b\d+\b/g, '?') // Replace numbers
      .replace(/'[^']*'/g, '?') // Replace string literals
      .trim();
  }

  /**
   * Generate query ID
   */
  private generateQueryId(sql: string): string {
    return `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    // Listen for database query events
    this.eventEmitter.on('database.query.executed', (event) => {
      this.recordQuery(
        event.sql,
        event.executionTime,
        event.rowsAffected,
        event.compliance || 'INTERNAL',
        event.parameters,
        event.stackTrace
      );
    });
  }

  /**
   * Cleanup resources
   */
  onModuleDestroy(): void {
    this.logger.log('Query Performance Analyzer Service destroyed');
  }
}