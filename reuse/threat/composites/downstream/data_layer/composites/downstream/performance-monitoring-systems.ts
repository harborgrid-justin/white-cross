/**
 * LOC: PERFMON001
 * File: performance-monitoring-systems.ts
 * Purpose: Enterprise-scale performance monitoring with real database integration
 *
 * ENHANCED FEATURES:
 * - pg_stat_statements integration for query tracking
 * - Real-time slow query detection
 * - Query plan analysis (EXPLAIN ANALYZE)
 * - Index suggestion engine
 * - Resource utilization monitoring
 * - Lock contention analysis
 * - Automatic alerting
 * - Performance baselines
 */

import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { Sequelize, QueryTypes } from "sequelize";
import { Cron } from "@nestjs/schedule";
import { ConnectionPoolManager } from "./services/connection-pool-manager.service";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface IPerformanceAlert {
  id: string;
  severity: "critical" | "warning" | "info";
  metric: string;
  threshold: number;
  currentValue: number;
  timestamp: Date;
  message: string;
}

export interface QueryMetrics {
  query: string;
  queryId: string;
  avgTime: number;
  maxTime: number;
  minTime: number;
  calls: number;
  rows: number;
  totalTime: number;
  stddevTime: number;
}

export interface SlowQuery extends QueryMetrics {
  detectedAt: Date;
  severity: "low" | "medium" | "high" | "critical";
}

export interface QueryPlan {
  query: string;
  plan: any;
  planningTime: number;
  executionTime: number;
  totalCost: number;
  actualRows: number;
  estimatedRows: number;
  indexesUsed: string[];
  scanType: string;
  recommendations: string[];
}

export interface IndexSuggestion {
  tableName: string;
  columns: string[];
  indexType: "btree" | "hash" | "gin" | "gist" | "brin";
  estimatedImpact: "high" | "medium" | "low";
  reason: string;
  queryExample: string;
  currentCost: number;
  estimatedCostWithIndex: number;
  potentialSavingsPercent: number;
}

export interface QueryStatistics {
  timestamp: Date;
  totalQueries: number;
  totalTime: number;
  avgTime: number;
  p50Time: number;
  p95Time: number;
  p99Time: number;
  slowQueries: number;
  cacheHitRate: number;
}

export interface LockInfo {
  pid: number;
  lockType: string;
  relation: string;
  mode: string;
  granted: boolean;
  duration: number;
  query: string;
  blockedBy?: number[];
}

export interface PerformanceBaseline {
  metric: string;
  p50: number;
  p95: number;
  p99: number;
  avg: number;
  max: number;
  sampleSize: number;
  recordedAt: Date;
}

// ============================================================================
// ENHANCED PERFORMANCE MONITORING SERVICE
// ============================================================================

@Injectable()
export class PerformanceMonitoringService implements OnModuleInit {
  private readonly logger = new Logger(PerformanceMonitoringService.name);
  private readonly alerts: IPerformanceAlert[] = [];
  private readonly metrics: Map<string, number[]> = new Map();
  private pgStatStatementsEnabled = false;
  private queryMetricsHistory: QueryStatistics[] = [];
  private slowQueryLog: SlowQuery[] = [];
  private maxSlowQueryLog = 1000;
  private baseline: Map<string, PerformanceBaseline> = new Map();

  constructor(
    private readonly sequelize: Sequelize,
    private readonly poolManager?: ConnectionPoolManager
  ) {}

  async onModuleInit() {
    await this.enablePgStatStatements();
    this.startMonitoring();
    this.logger.log("🔍 Enhanced Performance Monitoring Service initialized");
  }

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  /**
   * Enable pg_stat_statements extension
   */
  async enablePgStatStatements(): Promise<void> {
    try {
      await this.sequelize.query(
        "CREATE EXTENSION IF NOT EXISTS pg_stat_statements",
        { type: QueryTypes.RAW }
      );

      // Verify it's enabled
      const [results] = await this.sequelize.query(
        "SELECT 1 FROM pg_extension WHERE extname = 'pg_stat_statements'",
        { type: QueryTypes.SELECT }
      );

      this.pgStatStatementsEnabled = results.length > 0;

      if (this.pgStatStatementsEnabled) {
        this.logger.log("✅ pg_stat_statements extension enabled");
      } else {
        this.logger.warn("⚠️ pg_stat_statements extension not available");
      }
    } catch (error) {
      this.logger.error("Failed to enable pg_stat_statements:", error);
      this.pgStatStatementsEnabled = false;
    }
  }

  // ============================================================================
  // LEGACY METHODS (for backward compatibility)
  // ============================================================================

  recordMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }

    const values = this.metrics.get(name)!;
    values.push(value);

    // Keep only last 1000 values
    if (values.length > 1000) {
      values.shift();
    }

    this.checkThresholds(name, value);
  }

  async getMetricsSummary(): Promise<any> {
    const summary: any = {};

    for (const [name, values] of this.metrics) {
      if (values.length === 0) continue;

      summary[name] = {
        current: values[values.length - 1],
        avg: values.reduce((a, b) => a + b, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        count: values.length,
      };
    }

    return summary;
  }

  getActiveAlerts(): IPerformanceAlert[] {
    return this.alerts.filter(alert =>
      Date.now() - alert.timestamp.getTime() < 3600000 // Last hour
    );
  }

  async generatePerformanceReport(startDate: Date, endDate: Date): Promise<any> {
    return {
      period: { start: startDate, end: endDate },
      metrics: await this.getMetricsSummary(),
      alerts: this.alerts.filter(a => a.timestamp >= startDate && a.timestamp <= endDate),
      recommendations: this.generateRecommendations(),
      queryStats: await this.getQueryStats(),
      slowQueries: this.getSlowQueryLog(20),
    };
  }

  // ============================================================================
  // NEW ENHANCED METHODS
  // ============================================================================

  /**
   * Monitor slow queries in real-time
   */
  async monitorSlowQueries(thresholdMs: number = 1000): Promise<SlowQuery[]> {
    if (!this.pgStatStatementsEnabled) {
      this.logger.warn("pg_stat_statements not enabled - slow query monitoring unavailable");
      return [];
    }

    try {
      const [results] = await this.sequelize.query<any>(`
        SELECT
          md5(query) as query_id,
          query,
          calls,
          mean_exec_time as avg_time,
          max_exec_time as max_time,
          min_exec_time as min_time,
          stddev_exec_time as stddev_time,
          total_exec_time as total_time,
          rows
        FROM pg_stat_statements
        WHERE mean_exec_time > :threshold
          AND query NOT LIKE '%pg_stat_statements%'
          AND query NOT LIKE '%pg_catalog%'
        ORDER BY mean_exec_time DESC
        LIMIT 50
      `, {
        replacements: { threshold: thresholdMs },
        type: QueryTypes.SELECT,
      });

      const slowQueries: SlowQuery[] = results.map((row: any) => {
        // Determine severity based on avg time
        let severity: "low" | "medium" | "high" | "critical";
        if (row.avg_time > 10000) {
          severity = "critical";
        } else if (row.avg_time > 5000) {
          severity = "high";
        } else if (row.avg_time > 2000) {
          severity = "medium";
        } else {
          severity = "low";
        }

        return {
          query: row.query,
          queryId: row.query_id,
          avgTime: parseFloat(row.avg_time),
          maxTime: parseFloat(row.max_time),
          minTime: parseFloat(row.min_time),
          calls: parseInt(row.calls),
          rows: parseInt(row.rows),
          totalTime: parseFloat(row.total_time),
          stddevTime: parseFloat(row.stddev_time),
          detectedAt: new Date(),
          severity,
        };
      });

      // Log to slow query history
      for (const query of slowQueries) {
        this.slowQueryLog.push(query);
      }

      // Trim history
      if (this.slowQueryLog.length > this.maxSlowQueryLog) {
        this.slowQueryLog = this.slowQueryLog.slice(-this.maxSlowQueryLog);
      }

      return slowQueries;
    } catch (error) {
      this.logger.error("Failed to monitor slow queries:", error);
      return [];
    }
  }

  /**
   * Get slow query log
   */
  getSlowQueryLog(limit: number = 100): SlowQuery[] {
    return this.slowQueryLog
      .slice(-limit)
      .sort((a, b) => b.avgTime - a.avgTime);
  }

  /**
   * Analyze query execution plan
   */
  async analyzeQueryPlan(query: string): Promise<QueryPlan> {
    try {
      // Execute EXPLAIN ANALYZE
      const [explainResults] = await this.sequelize.query(
        `EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) ${query}`,
        { type: QueryTypes.SELECT }
      );

      const plan = (explainResults as any)[0]?.["QUERY PLAN"]?.[0];

      if (!plan) {
        throw new Error("Failed to get query plan");
      }

      const planningTime = plan["Planning Time"] || 0;
      const executionTime = plan["Execution Time"] || 0;
      const planNode = plan["Plan"];

      const totalCost = planNode["Total Cost"] || 0;
      const actualRows = planNode["Actual Rows"] || 0;
      const estimatedRows = planNode["Plan Rows"] || 0;

      // Extract indexes used
      const indexesUsed = this.extractIndexesFromPlan(planNode);

      // Determine scan type
      const scanType = planNode["Node Type"] || "Unknown";

      // Generate recommendations
      const recommendations = this.generatePlanRecommendations(
        planNode,
        actualRows,
        estimatedRows
      );

      return {
        query,
        plan: planNode,
        planningTime,
        executionTime,
        totalCost,
        actualRows,
        estimatedRows,
        indexesUsed,
        scanType,
        recommendations,
      };
    } catch (error) {
      this.logger.error("Failed to analyze query plan:", error);
      throw error;
    }
  }

  /**
   * Suggest indexes based on slow queries
   */
  async suggestIndexes(): Promise<IndexSuggestion[]> {
    const suggestions: IndexSuggestion[] = [];
    const slowQueries = await this.monitorSlowQueries(1000);

    for (const slowQuery of slowQueries.slice(0, 10)) {
      try {
        const plan = await this.analyzeQueryPlan(slowQuery.query);

        // If using sequential scan, suggest index
        if (plan.scanType === "Seq Scan" && plan.actualRows > 1000) {
          const tableName = this.extractTableName(slowQuery.query);
          const columns = this.extractWhereColumns(slowQuery.query);

          if (tableName && columns.length > 0) {
            const estimatedSavings = this.estimateIndexSavings(plan);

            suggestions.push({
              tableName,
              columns,
              indexType: "btree",
              estimatedImpact: estimatedSavings > 50 ? "high" : estimatedSavings > 25 ? "medium" : "low",
              reason: `Sequential scan on ${plan.actualRows} rows`,
              queryExample: slowQuery.query.substring(0, 200),
              currentCost: plan.totalCost,
              estimatedCostWithIndex: plan.totalCost * (1 - estimatedSavings / 100),
              potentialSavingsPercent: estimatedSavings,
            });
          }
        }
      } catch (error) {
        this.logger.error("Failed to suggest index for query:", error);
      }
    }

    return suggestions;
  }

  /**
   * Get comprehensive query statistics
   */
  async getQueryStats(): Promise<QueryStatistics> {
    if (!this.pgStatStatementsEnabled) {
      return {
        timestamp: new Date(),
        totalQueries: 0,
        totalTime: 0,
        avgTime: 0,
        p50Time: 0,
        p95Time: 0,
        p99Time: 0,
        slowQueries: 0,
        cacheHitRate: 0,
      };
    }

    try {
      const [results] = await this.sequelize.query<any>(`
        SELECT
          COUNT(*) as total_queries,
          SUM(total_exec_time) as total_time,
          AVG(mean_exec_time) as avg_time,
          PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY mean_exec_time) as p50_time,
          PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY mean_exec_time) as p95_time,
          PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY mean_exec_time) as p99_time,
          SUM(CASE WHEN mean_exec_time > 1000 THEN 1 ELSE 0 END) as slow_queries
        FROM pg_stat_statements
        WHERE query NOT LIKE '%pg_stat_statements%'
      `, {
        type: QueryTypes.SELECT,
      });

      const row = results[0];

      const stats: QueryStatistics = {
        timestamp: new Date(),
        totalQueries: parseInt(row.total_queries) || 0,
        totalTime: parseFloat(row.total_time) || 0,
        avgTime: parseFloat(row.avg_time) || 0,
        p50Time: parseFloat(row.p50_time) || 0,
        p95Time: parseFloat(row.p95_time) || 0,
        p99Time: parseFloat(row.p99_time) || 0,
        slowQueries: parseInt(row.slow_queries) || 0,
        cacheHitRate: 0, // Would need separate cache metrics
      };

      // Store in history
      this.queryMetricsHistory.push(stats);
      if (this.queryMetricsHistory.length > 1000) {
        this.queryMetricsHistory.shift();
      }

      return stats;
    } catch (error) {
      this.logger.error("Failed to get query stats:", error);
      throw error;
    }
  }

  /**
   * Detect lock contention
   */
  async detectLockContention(): Promise<LockInfo[]> {
    try {
      const [locks] = await this.sequelize.query<any>(`
        SELECT
          l.pid,
          l.locktype as lock_type,
          l.relation::regclass::text as relation,
          l.mode,
          l.granted,
          EXTRACT(EPOCH FROM (NOW() - a.query_start)) as duration,
          a.query
        FROM pg_locks l
        JOIN pg_stat_activity a ON l.pid = a.pid
        WHERE NOT l.granted
          AND a.datname = current_database()
        ORDER BY duration DESC
      `, {
        type: QueryTypes.SELECT,
      });

      return locks.map((row: any) => ({
        pid: row.pid,
        lockType: row.lock_type,
        relation: row.relation,
        mode: row.mode,
        granted: row.granted,
        duration: parseFloat(row.duration),
        query: row.query,
      }));
    } catch (error) {
      this.logger.error("Failed to detect lock contention:", error);
      return [];
    }
  }

  // ============================================================================
  // PERIODIC MONITORING (CRON JOBS)
  // ============================================================================

  private startMonitoring(): void {
    // Monitor every 30 seconds
    setInterval(() => {
      this.collectSystemMetrics();
    }, 30000);
  }

  private async collectSystemMetrics(): Promise<void> {
    // Collect pool metrics
    if (this.poolManager) {
      const poolMetrics = this.poolManager.getPoolMetrics();
      this.recordMetric("active_connections", poolMetrics.active);
      this.recordMetric("idle_connections", poolMetrics.idle);
      this.recordMetric("waiting_connections", poolMetrics.waiting);
      this.recordMetric("pool_utilization", poolMetrics.utilizationRate);
    }

    // Collect process metrics
    const memUsage = process.memoryUsage();
    this.recordMetric("heap_used_mb", memUsage.heapUsed / 1024 / 1024);
    this.recordMetric("heap_total_mb", memUsage.heapTotal / 1024 / 1024);
    this.recordMetric("rss_mb", memUsage.rss / 1024 / 1024);
  }

  @Cron("*/5 * * * *") // Every 5 minutes
  async periodicSlowQueryCheck(): Promise<void> {
    const slowQueries = await this.monitorSlowQueries(2000); // >2s

    if (slowQueries.length > 0) {
      this.logger.warn(
        `Found ${slowQueries.length} slow queries (>2s):\n` +
        slowQueries.slice(0, 3).map(q =>
          `  - ${q.query.substring(0, 100)}... (avg: ${q.avgTime.toFixed(2)}ms, calls: ${q.calls})`
        ).join("\n")
      );
    }
  }

  @Cron("*/1 * * * *") // Every minute
  async periodicStatsCollection(): Promise<void> {
    try {
      await this.getQueryStats();
    } catch (error) {
      this.logger.error("Failed to collect periodic stats:", error);
    }
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  private extractIndexesFromPlan(planNode: any): string[] {
    const indexes: Set<string> = new Set();

    const traverse = (node: any) => {
      if (node["Index Name"]) {
        indexes.add(node["Index Name"]);
      }

      if (node["Plans"]) {
        for (const subNode of node["Plans"]) {
          traverse(subNode);
        }
      }
    };

    traverse(planNode);
    return Array.from(indexes);
  }

  private generatePlanRecommendations(
    planNode: any,
    actualRows: number,
    estimatedRows: number
  ): string[] {
    const recommendations: string[] = [];

    // Check for sequential scans
    if (planNode["Node Type"] === "Seq Scan") {
      recommendations.push("Consider adding an index - using sequential scan");
    }

    // Check for row estimation accuracy
    const estimationError = Math.abs(actualRows - estimatedRows) / Math.max(estimatedRows, 1);
    if (estimationError > 0.5 && actualRows > 1000) {
      recommendations.push(
        `Poor row estimation (estimated: ${estimatedRows}, actual: ${actualRows}) - consider ANALYZE`
      );
    }

    // Check for nested loops with large datasets
    if (planNode["Node Type"] === "Nested Loop" && actualRows > 10000) {
      recommendations.push("Nested loop on large dataset - consider hash join or merge join");
    }

    return recommendations;
  }

  private extractTableName(query: string): string | null {
    const match = query.match(/FROM\s+([a-zA-Z0-9_"]+)/i);
    return match ? match[1].replace(/"/g, "") : null;
  }

  private extractWhereColumns(query: string): string[] {
    const whereMatch = query.match(/WHERE\s+(.+?)(?:ORDER BY|GROUP BY|LIMIT|$)/i);
    if (!whereMatch) return [];

    const whereClause = whereMatch[1];
    const columnMatches = whereClause.match(/([a-zA-Z0-9_"]+)\s*[=<>]/g);

    if (!columnMatches) return [];

    return columnMatches.map(m => m.split(/\s*[=<>]/)[0].replace(/"/g, "").trim());
  }

  private estimateIndexSavings(plan: QueryPlan): number {
    // Simple heuristic: more rows = more savings from index
    if (plan.actualRows > 100000) return 80;
    if (plan.actualRows > 10000) return 60;
    if (plan.actualRows > 1000) return 40;
    return 20;
  }

  private checkThresholds(name: string, value: number): void {
    const thresholds: Record<string, number> = {
      active_connections: 15,
      pool_utilization: 80,
      heap_used_mb: 1024,
      query_latency: 1000,
      error_rate: 5,
    };

    if (thresholds[name] && value > thresholds[name]) {
      this.createAlert(name, value, thresholds[name]);
    }
  }

  private createAlert(metric: string, value: number, threshold: number): void {
    const alert: IPerformanceAlert = {
      id: `alert_${Date.now()}`,
      severity: value > threshold * 1.5 ? "critical" : "warning",
      metric,
      threshold,
      currentValue: value,
      timestamp: new Date(),
      message: `${metric} exceeded threshold: ${value.toFixed(2)} > ${threshold}`,
    };

    this.alerts.push(alert);

    // Keep only last 1000 alerts
    if (this.alerts.length > 1000) {
      this.alerts.shift();
    }

    this.logger.warn(`Performance alert: ${alert.message}`);
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = [];

    const metrics = this.getMetricsSummary();

    if (metrics.pool_utilization?.avg > 70) {
      recommendations.push("High connection pool utilization - consider increasing pool size");
    }

    if (metrics.heap_used_mb?.current > 512) {
      recommendations.push("High memory usage - consider optimizing or scaling");
    }

    if (this.slowQueryLog.length > 10) {
      recommendations.push(`${this.slowQueryLog.length} slow queries detected - run suggestIndexes() for optimization`);
    }

    return recommendations;
  }

  /**
   * Reset pg_stat_statements
   */
  async resetStatistics(): Promise<void> {
    if (!this.pgStatStatementsEnabled) {
      this.logger.warn("pg_stat_statements not enabled");
      return;
    }

    try {
      await this.sequelize.query("SELECT pg_stat_statements_reset()", {
        type: QueryTypes.SELECT,
      });
      this.logger.log("✅ pg_stat_statements reset");
    } catch (error) {
      this.logger.error("Failed to reset statistics:", error);
    }
  }
}

export { PerformanceMonitoringService };
