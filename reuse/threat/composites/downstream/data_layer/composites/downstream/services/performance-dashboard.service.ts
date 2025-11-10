/**
 * LOC: PERFDASH001
 * File: performance-dashboard.service.ts
 * Purpose: Unified performance dashboard aggregating all metrics
 *
 * FEATURES:
 * - Unified view of all performance metrics
 * - Real-time status indicators
 * - Historical trend analysis
 * - Automatic health scoring
 * - Actionable recommendations
 */

import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { Sequelize } from "sequelize";
import { EnhancedCacheManagerService, CacheStatistics } from "../cache-managers";
import { ConnectionPoolManager, PoolMetrics, PoolHealthReport } from "./connection-pool-manager.service";
import { CacheMonitoringService, CacheMetricsSummary, CacheHealthReport } from "./cache-monitoring.service";
import { CacheWarmupService, WarmupProgress } from "./cache-warmup.service";
import { PerformanceMonitoringService, QueryStatistics, SlowQuery, IndexSuggestion } from "../performance-monitoring-systems";
import { DistributedLockManager, LockStatistics } from "./distributed-lock-manager.service";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface PerformanceMetrics {
  timestamp: Date;

  // Database Metrics
  database: {
    activeConnections: number;
    idleConnections: number;
    waitingConnections: number;
    poolUtilization: number;
    queryLatencyP50: number;
    queryLatencyP95: number;
    queryLatencyP99: number;
    slowQueryCount: number;
    totalQueries: number;
  };

  // Cache Metrics
  cache: {
    hitRate: number;
    l1HitRate: number;
    l2HitRate: number;
    evictionRate: number;
    size: number;
    memoryUsageMB: number;
    avgLatencyMs: number;
    p95LatencyMs: number;
  };

  // Application Metrics
  application: {
    heapUsedMB: number;
    heapTotalMB: number;
    rssMB: number;
    cpuUsagePercent: number;
    uptimeSeconds: number;
    eventLoopLag: number;
  };

  // Lock Metrics
  locks: {
    activeLocks: number;
    totalAcquired: number;
    totalFailed: number;
    averageHoldTime: number;
  };
}

export interface PerformanceHealth {
  overall: {
    healthy: boolean;
    score: number; // 0-100
    status: "excellent" | "good" | "degraded" | "critical";
  };
  components: {
    database: ComponentHealth;
    cache: ComponentHealth;
    application: ComponentHealth;
    locks: ComponentHealth;
  };
  issues: string[];
  warnings: string[];
  recommendations: string[];
}

export interface ComponentHealth {
  healthy: boolean;
  score: number;
  status: "excellent" | "good" | "degraded" | "critical";
  metrics: Record<string, any>;
}

export interface HistoricalMetrics {
  timeRange: {
    start: Date;
    end: Date;
    durationMinutes: number;
  };
  samples: PerformanceMetrics[];
  aggregations: {
    database: {
      avgQueryLatency: number;
      peakQueryLatency: number;
      avgPoolUtilization: number;
      peakPoolUtilization: number;
    };
    cache: {
      avgHitRate: number;
      minHitRate: number;
      avgEvictionRate: number;
    };
    application: {
      avgHeapUsage: number;
      peakHeapUsage: number;
    };
  };
}

export interface PerformanceSummary {
  currentMetrics: PerformanceMetrics;
  health: PerformanceHealth;
  topSlowQueries: SlowQuery[];
  indexSuggestions: IndexSuggestion[];
  activeIssues: string[];
  uptime: number;
  lastRestart: Date;
}

// ============================================================================
// PERFORMANCE DASHBOARD SERVICE
// ============================================================================

@Injectable()
export class PerformanceDashboardService implements OnModuleInit {
  private readonly logger = new Logger(PerformanceDashboardService.name);
  private metricsHistory: PerformanceMetrics[] = [];
  private maxHistorySize = 1440; // 24 hours at 1-minute intervals
  private startTime = new Date();
  private eventLoopLag = 0;

  constructor(
    private readonly sequelize: Sequelize,
    private readonly cacheManager: EnhancedCacheManagerService,
    private readonly poolManager: ConnectionPoolManager,
    private readonly cacheMonitoring: CacheMonitoringService,
    private readonly cacheWarmup: CacheWarmupService,
    private readonly perfMonitoring: PerformanceMonitoringService,
    private readonly lockManager: DistributedLockManager
  ) {}

  async onModuleInit() {
    this.startMetricsCollection();
    this.startEventLoopMonitoring();
    this.logger.log("📊 Performance Dashboard Service initialized");
  }

  // ============================================================================
  // CURRENT METRICS
  // ============================================================================

  /**
   * Get current performance metrics across all systems
   */
  async getCurrentMetrics(): Promise<PerformanceMetrics> {
    try {
      // Collect all metrics in parallel
      const [
        poolMetrics,
        queryStats,
        cacheStats,
        cacheMetrics,
        lockStats,
      ] = await Promise.all([
        this.poolManager.getPoolMetrics(),
        this.perfMonitoring.getQueryStats(),
        this.cacheManager.getCacheStatistics(),
        this.cacheMonitoring.getMetrics(5),
        Promise.resolve(this.lockManager.getLockStatistics()),
      ]);

      // Get process metrics
      const memUsage = process.memoryUsage();
      const cpuUsage = process.cpuUsage();

      const metrics: PerformanceMetrics = {
        timestamp: new Date(),

        database: {
          activeConnections: poolMetrics.active,
          idleConnections: poolMetrics.idle,
          waitingConnections: poolMetrics.waiting,
          poolUtilization: poolMetrics.utilizationRate,
          queryLatencyP50: queryStats.p50Time,
          queryLatencyP95: queryStats.p95Time,
          queryLatencyP99: queryStats.p99Time,
          slowQueryCount: queryStats.slowQueries,
          totalQueries: queryStats.totalQueries,
        },

        cache: {
          hitRate: cacheStats.hitRate,
          l1HitRate: (cacheStats.l1Hits / (cacheStats.totalHits + cacheStats.totalMisses)) * 100 || 0,
          l2HitRate: (cacheStats.l2Hits / (cacheStats.totalHits + cacheStats.totalMisses)) * 100 || 0,
          evictionRate: cacheMetrics.evictionRate,
          size: cacheStats.l1Size,
          memoryUsageMB: cacheMetrics.memoryUsageMB,
          avgLatencyMs: cacheStats.averageGetLatency,
          p95LatencyMs: cacheMetrics.p95LatencyMs,
        },

        application: {
          heapUsedMB: memUsage.heapUsed / 1024 / 1024,
          heapTotalMB: memUsage.heapTotal / 1024 / 1024,
          rssMB: memUsage.rss / 1024 / 1024,
          cpuUsagePercent: (cpuUsage.user + cpuUsage.system) / 1000000 / process.uptime() * 100,
          uptimeSeconds: process.uptime(),
          eventLoopLag: this.eventLoopLag,
        },

        locks: {
          activeLocks: lockStats.activeLocks,
          totalAcquired: lockStats.totalAcquired,
          totalFailed: lockStats.totalFailed,
          averageHoldTime: lockStats.averageHoldTime,
        },
      };

      // Store in history
      this.metricsHistory.push(metrics);
      if (this.metricsHistory.length > this.maxHistorySize) {
        this.metricsHistory.shift();
      }

      return metrics;
    } catch (error) {
      this.logger.error("Failed to get current metrics:", error);
      throw error;
    }
  }

  // ============================================================================
  // HEALTH ASSESSMENT
  // ============================================================================

  /**
   * Get comprehensive health assessment
   */
  async getPerformanceHealth(): Promise<PerformanceHealth> {
    const metrics = await this.getCurrentMetrics();
    const poolHealth = await this.poolManager.checkPoolHealth();
    const cacheHealth = this.cacheMonitoring.getCacheHealthReport();

    const issues: string[] = [];
    const warnings: string[] = [];
    const recommendations: string[] = [];

    // Assess database health
    const dbHealth = this.assessDatabaseHealth(metrics.database, poolHealth);
    issues.push(...dbHealth.issues);
    warnings.push(...dbHealth.warnings);
    recommendations.push(...dbHealth.recommendations);

    // Assess cache health
    issues.push(...cacheHealth.issues);
    warnings.push(...cacheHealth.warnings);
    recommendations.push(...cacheHealth.recommendations);

    // Assess application health
    const appHealth = this.assessApplicationHealth(metrics.application);
    issues.push(...appHealth.issues);
    warnings.push(...appHealth.warnings);
    recommendations.push(...appHealth.recommendations);

    // Assess lock health
    const lockHealth = this.assessLockHealth(metrics.locks);
    issues.push(...lockHealth.issues);
    warnings.push(...lockHealth.warnings);
    recommendations.push(...lockHealth.recommendations);

    // Calculate overall health score
    const componentScores = [
      dbHealth.score,
      cacheHealth.score,
      appHealth.score,
      lockHealth.score,
    ];
    const overallScore = componentScores.reduce((sum, score) => sum + score, 0) / componentScores.length;

    const overallHealthy = issues.length === 0 && overallScore >= 70;
    let overallStatus: "excellent" | "good" | "degraded" | "critical";

    if (overallScore >= 90) {
      overallStatus = "excellent";
    } else if (overallScore >= 70) {
      overallStatus = "good";
    } else if (overallScore >= 50) {
      overallStatus = "degraded";
    } else {
      overallStatus = "critical";
    }

    return {
      overall: {
        healthy: overallHealthy,
        score: overallScore,
        status: overallStatus,
      },
      components: {
        database: {
          healthy: dbHealth.score >= 70,
          score: dbHealth.score,
          status: this.getStatusFromScore(dbHealth.score),
          metrics: metrics.database,
        },
        cache: {
          healthy: cacheHealth.healthy,
          score: cacheHealth.score,
          status: this.getStatusFromScore(cacheHealth.score),
          metrics: metrics.cache,
        },
        application: {
          healthy: appHealth.score >= 70,
          score: appHealth.score,
          status: this.getStatusFromScore(appHealth.score),
          metrics: metrics.application,
        },
        locks: {
          healthy: lockHealth.score >= 70,
          score: lockHealth.score,
          status: this.getStatusFromScore(lockHealth.score),
          metrics: metrics.locks,
        },
      },
      issues,
      warnings,
      recommendations,
    };
  }

  /**
   * Get performance summary for dashboard
   */
  async getPerformanceSummary(): Promise<PerformanceSummary> {
    const [
      currentMetrics,
      health,
      slowQueries,
      indexSuggestions,
    ] = await Promise.all([
      this.getCurrentMetrics(),
      this.getPerformanceHealth(),
      this.perfMonitoring.monitorSlowQueries(1000),
      this.perfMonitoring.suggestIndexes(),
    ]);

    return {
      currentMetrics,
      health,
      topSlowQueries: slowQueries.slice(0, 10),
      indexSuggestions: indexSuggestions.slice(0, 5),
      activeIssues: health.issues,
      uptime: process.uptime(),
      lastRestart: this.startTime,
    };
  }

  // ============================================================================
  // HISTORICAL METRICS
  // ============================================================================

  /**
   * Get historical metrics
   */
  getHistoricalMetrics(durationMinutes: number = 60): HistoricalMetrics {
    const cutoffTime = new Date(Date.now() - durationMinutes * 60 * 1000);
    const samples = this.metricsHistory.filter(m => m.timestamp >= cutoffTime);

    const aggregations = this.calculateAggregations(samples);

    return {
      timeRange: {
        start: cutoffTime,
        end: new Date(),
        durationMinutes,
      },
      samples,
      aggregations,
    };
  }

  /**
   * Calculate aggregations from samples
   */
  private calculateAggregations(samples: PerformanceMetrics[]): HistoricalMetrics["aggregations"] {
    if (samples.length === 0) {
      return {
        database: {
          avgQueryLatency: 0,
          peakQueryLatency: 0,
          avgPoolUtilization: 0,
          peakPoolUtilization: 0,
        },
        cache: {
          avgHitRate: 0,
          minHitRate: 0,
          avgEvictionRate: 0,
        },
        application: {
          avgHeapUsage: 0,
          peakHeapUsage: 0,
        },
      };
    }

    const dbLatencies = samples.map(s => s.database.queryLatencyP95);
    const poolUtils = samples.map(s => s.database.poolUtilization);
    const cacheHitRates = samples.map(s => s.cache.hitRate);
    const evictionRates = samples.map(s => s.cache.evictionRate);
    const heapUsages = samples.map(s => s.application.heapUsedMB);

    return {
      database: {
        avgQueryLatency: this.average(dbLatencies),
        peakQueryLatency: Math.max(...dbLatencies),
        avgPoolUtilization: this.average(poolUtils),
        peakPoolUtilization: Math.max(...poolUtils),
      },
      cache: {
        avgHitRate: this.average(cacheHitRates),
        minHitRate: Math.min(...cacheHitRates),
        avgEvictionRate: this.average(evictionRates),
      },
      application: {
        avgHeapUsage: this.average(heapUsages),
        peakHeapUsage: Math.max(...heapUsages),
      },
    };
  }

  // ============================================================================
  // HEALTH ASSESSMENT HELPERS
  // ============================================================================

  private assessDatabaseHealth(dbMetrics: any, poolHealth: PoolHealthReport) {
    const issues: string[] = [];
    const warnings: string[] = [];
    const recommendations: string[] = [];
    let score = 100;

    // Check pool utilization
    if (dbMetrics.poolUtilization > 90) {
      issues.push(`Critical: Pool utilization at ${dbMetrics.poolUtilization.toFixed(1)}%`);
      recommendations.push("Increase connection pool size immediately");
      score -= 30;
    } else if (dbMetrics.poolUtilization > 75) {
      warnings.push(`High pool utilization: ${dbMetrics.poolUtilization.toFixed(1)}%`);
      recommendations.push("Consider increasing connection pool size");
      score -= 15;
    }

    // Check query latency
    if (dbMetrics.queryLatencyP95 > 2000) {
      issues.push(`Critical: p95 query latency at ${dbMetrics.queryLatencyP95.toFixed(0)}ms`);
      recommendations.push("Investigate slow queries and add indexes");
      score -= 25;
    } else if (dbMetrics.queryLatencyP95 > 1000) {
      warnings.push(`High p95 query latency: ${dbMetrics.queryLatencyP95.toFixed(0)}ms`);
      recommendations.push("Review and optimize slow queries");
      score -= 10;
    }

    // Check waiting connections
    if (dbMetrics.waitingConnections > 5) {
      warnings.push(`${dbMetrics.waitingConnections} requests waiting for connections`);
      recommendations.push("Pool may be undersized for current load");
      score -= 10;
    }

    // Check slow queries
    if (dbMetrics.slowQueryCount > 10) {
      warnings.push(`${dbMetrics.slowQueryCount} slow queries detected`);
      recommendations.push("Run index suggestions to optimize queries");
      score -= 10;
    }

    // Add pool health issues
    issues.push(...poolHealth.errors);
    warnings.push(...poolHealth.warnings);
    recommendations.push(...poolHealth.recommendations);

    return { issues, warnings, recommendations, score: Math.max(0, score) };
  }

  private assessApplicationHealth(appMetrics: any) {
    const issues: string[] = [];
    const warnings: string[] = [];
    const recommendations: string[] = [];
    let score = 100;

    // Check heap usage
    const heapUsagePercent = (appMetrics.heapUsedMB / appMetrics.heapTotalMB) * 100;

    if (heapUsagePercent > 90) {
      issues.push(`Critical: Heap usage at ${heapUsagePercent.toFixed(1)}%`);
      recommendations.push("Memory leak suspected - investigate and restart");
      score -= 30;
    } else if (heapUsagePercent > 75) {
      warnings.push(`High heap usage: ${heapUsagePercent.toFixed(1)}%`);
      recommendations.push("Monitor memory usage closely");
      score -= 15;
    }

    // Check event loop lag
    if (appMetrics.eventLoopLag > 100) {
      issues.push(`Critical: Event loop lag at ${appMetrics.eventLoopLag.toFixed(0)}ms`);
      recommendations.push("CPU-bound operations blocking event loop");
      score -= 25;
    } else if (appMetrics.eventLoopLag > 50) {
      warnings.push(`High event loop lag: ${appMetrics.eventLoopLag.toFixed(0)}ms`);
      recommendations.push("Review async operations and reduce blocking code");
      score -= 10;
    }

    // Check RSS
    if (appMetrics.rssMB > 2048) {
      warnings.push(`High memory usage: ${appMetrics.rssMB.toFixed(0)}MB`);
      recommendations.push("Consider scaling or optimizing memory usage");
      score -= 10;
    }

    return { issues, warnings, recommendations, score: Math.max(0, score) };
  }

  private assessLockHealth(lockMetrics: any) {
    const issues: string[] = [];
    const warnings: string[] = [];
    const recommendations: string[] = [];
    let score = 100;

    // Check lock failure rate
    if (lockMetrics.totalAcquired > 0) {
      const failureRate = (lockMetrics.totalFailed / lockMetrics.totalAcquired) * 100;

      if (failureRate > 10) {
        warnings.push(`High lock failure rate: ${failureRate.toFixed(1)}%`);
        recommendations.push("Review lock contention and timeout settings");
        score -= 15;
      }
    }

    // Check active locks
    if (lockMetrics.activeLocks > 100) {
      warnings.push(`High number of active locks: ${lockMetrics.activeLocks}`);
      recommendations.push("Verify locks are being released properly");
      score -= 10;
    }

    // Check average hold time
    if (lockMetrics.averageHoldTime > 30000) {
      warnings.push(`Long average lock hold time: ${(lockMetrics.averageHoldTime / 1000).toFixed(1)}s`);
      recommendations.push("Review operations holding locks for extended periods");
      score -= 10;
    }

    return { issues, warnings, recommendations, score: Math.max(0, score) };
  }

  private getStatusFromScore(score: number): "excellent" | "good" | "degraded" | "critical" {
    if (score >= 90) return "excellent";
    if (score >= 70) return "good";
    if (score >= 50) return "degraded";
    return "critical";
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  private average(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  private startMetricsCollection(): void {
    // Collect metrics every minute
    setInterval(async () => {
      try {
        await this.getCurrentMetrics();
      } catch (error) {
        this.logger.error("Failed to collect metrics:", error);
      }
    }, 60000);
  }

  private startEventLoopMonitoring(): void {
    setInterval(() => {
      const start = Date.now();
      setImmediate(() => {
        this.eventLoopLag = Date.now() - start;
      });
    }, 5000);
  }

  /**
   * Get cache warmup status
   */
  getCacheWarmupStatus(): WarmupProgress | null {
    return this.cacheWarmup.getProgress();
  }

  /**
   * Get metrics history count
   */
  getMetricsHistoryCount(): number {
    return this.metricsHistory.length;
  }

  /**
   * Clear metrics history
   */
  clearMetricsHistory(): void {
    this.metricsHistory = [];
    this.logger.log("Metrics history cleared");
  }
}

export default PerformanceDashboardService;
