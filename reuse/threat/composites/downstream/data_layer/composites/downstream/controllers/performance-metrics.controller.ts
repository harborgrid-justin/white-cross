/**
 * LOC: PERFCTRL001
 * File: performance-metrics.controller.ts
 * Purpose: REST API endpoints for performance metrics and monitoring
 *
 * ENDPOINTS:
 * - GET /metrics - Current performance metrics
 * - GET /metrics/health - Health assessment
 * - GET /metrics/summary - Dashboard summary
 * - GET /metrics/history - Historical metrics
 * - GET /metrics/slow-queries - Slow query log
 * - GET /metrics/index-suggestions - Index optimization suggestions
 * - GET /metrics/cache - Cache statistics
 * - GET /metrics/pool - Connection pool metrics
 * - GET /metrics/locks - Lock statistics
 * - POST /metrics/cache/warmup - Trigger cache warmup
 * - POST /metrics/cache/clear - Clear cache
 * - POST /metrics/stats/reset - Reset statistics
 */

import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Logger,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { PerformanceDashboardService } from "../services/performance-dashboard.service";
import { PerformanceMonitoringService } from "../performance-monitoring-systems";
import { EnhancedCacheManagerService } from "../cache-managers";
import { CacheWarmupService, WarmupStrategy } from "../services/cache-warmup.service";
import { CacheMonitoringService } from "../services/cache-monitoring.service";
import { ConnectionPoolManager } from "../services/connection-pool-manager.service";
import { DistributedLockManager } from "../services/distributed-lock-manager.service";

// ============================================================================
// DTOs
// ============================================================================

export class TriggerWarmupDto {
  strategy?: WarmupStrategy;
}

export class QueryPlanDto {
  query: string;
}

// ============================================================================
// PERFORMANCE METRICS CONTROLLER
// ============================================================================

@ApiTags("Performance Metrics")
@Controller("metrics")
// @ApiBearerAuth() // Enable in production with proper auth
export class PerformanceMetricsController {
  private readonly logger = new Logger(PerformanceMetricsController.name);

  constructor(
    private readonly dashboard: PerformanceDashboardService,
    private readonly perfMonitoring: PerformanceMonitoringService,
    private readonly cacheManager: EnhancedCacheManagerService,
    private readonly cacheWarmup: CacheWarmupService,
    private readonly cacheMonitoring: CacheMonitoringService,
    private readonly poolManager: ConnectionPoolManager,
    private readonly lockManager: DistributedLockManager
  ) {}

  // ============================================================================
  // DASHBOARD ENDPOINTS
  // ============================================================================

  @Get()
  @ApiOperation({
    summary: "Get current performance metrics",
    description: "Returns real-time performance metrics across all systems",
  })
  @ApiResponse({
    status: 200,
    description: "Current performance metrics",
  })
  async getCurrentMetrics() {
    const metrics = await this.dashboard.getCurrentMetrics();
    return {
      success: true,
      data: metrics,
      timestamp: new Date(),
    };
  }

  @Get("health")
  @ApiOperation({
    summary: "Get performance health assessment",
    description: "Comprehensive health check with scoring and recommendations",
  })
  @ApiResponse({
    status: 200,
    description: "Performance health report",
  })
  async getHealth() {
    const health = await this.dashboard.getPerformanceHealth();
    return {
      success: true,
      data: health,
      timestamp: new Date(),
    };
  }

  @Get("summary")
  @ApiOperation({
    summary: "Get performance dashboard summary",
    description: "Complete dashboard view with metrics, health, slow queries, and suggestions",
  })
  @ApiResponse({
    status: 200,
    description: "Dashboard summary",
  })
  async getSummary() {
    const summary = await this.dashboard.getPerformanceSummary();
    return {
      success: true,
      data: summary,
      timestamp: new Date(),
    };
  }

  @Get("history")
  @ApiOperation({
    summary: "Get historical performance metrics",
    description: "Time-series metrics with aggregations",
  })
  @ApiQuery({
    name: "duration",
    required: false,
    type: Number,
    description: "Duration in minutes (default: 60)",
  })
  @ApiResponse({
    status: 200,
    description: "Historical metrics",
  })
  async getHistory(@Query("duration") duration?: number) {
    const durationMinutes = duration ? parseInt(duration.toString()) : 60;
    const history = this.dashboard.getHistoricalMetrics(durationMinutes);
    return {
      success: true,
      data: history,
      timestamp: new Date(),
    };
  }

  // ============================================================================
  // QUERY PERFORMANCE ENDPOINTS
  // ============================================================================

  @Get("slow-queries")
  @ApiOperation({
    summary: "Get slow query log",
    description: "List of slow queries detected by pg_stat_statements",
  })
  @ApiQuery({
    name: "threshold",
    required: false,
    type: Number,
    description: "Threshold in milliseconds (default: 1000)",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    description: "Maximum number of queries to return (default: 50)",
  })
  @ApiResponse({
    status: 200,
    description: "Slow query list",
  })
  async getSlowQueries(
    @Query("threshold") threshold?: number,
    @Query("limit") limit?: number
  ) {
    const thresholdMs = threshold ? parseInt(threshold.toString()) : 1000;
    const slowQueries = await this.perfMonitoring.monitorSlowQueries(thresholdMs);
    const limitNum = limit ? parseInt(limit.toString()) : 50;

    return {
      success: true,
      data: {
        queries: slowQueries.slice(0, limitNum),
        total: slowQueries.length,
        threshold: thresholdMs,
      },
      timestamp: new Date(),
    };
  }

  @Get("query-stats")
  @ApiOperation({
    summary: "Get query statistics",
    description: "Aggregated query performance statistics",
  })
  @ApiResponse({
    status: 200,
    description: "Query statistics",
  })
  async getQueryStats() {
    const stats = await this.perfMonitoring.getQueryStats();
    return {
      success: true,
      data: stats,
      timestamp: new Date(),
    };
  }

  @Post("query-plan")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Analyze query execution plan",
    description: "Get EXPLAIN ANALYZE output with recommendations",
  })
  @ApiBody({ type: QueryPlanDto })
  @ApiResponse({
    status: 200,
    description: "Query plan analysis",
  })
  async analyzeQueryPlan(@Body() dto: QueryPlanDto) {
    try {
      const plan = await this.perfMonitoring.analyzeQueryPlan(dto.query);
      return {
        success: true,
        data: plan,
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        timestamp: new Date(),
      };
    }
  }

  @Get("index-suggestions")
  @ApiOperation({
    summary: "Get index optimization suggestions",
    description: "AI-powered index suggestions based on slow queries",
  })
  @ApiResponse({
    status: 200,
    description: "Index suggestions",
  })
  async getIndexSuggestions() {
    const suggestions = await this.perfMonitoring.suggestIndexes();
    return {
      success: true,
      data: {
        suggestions,
        count: suggestions.length,
      },
      timestamp: new Date(),
    };
  }

  // ============================================================================
  // CACHE ENDPOINTS
  // ============================================================================

  @Get("cache")
  @ApiOperation({
    summary: "Get cache statistics",
    description: "Multi-tier cache metrics and health",
  })
  @ApiResponse({
    status: 200,
    description: "Cache statistics",
  })
  async getCacheStats() {
    const [cacheStats, cacheMetrics, cacheHealth] = await Promise.all([
      Promise.resolve(this.cacheManager.getCacheStatistics()),
      Promise.resolve(this.cacheMonitoring.getMetrics(5)),
      Promise.resolve(this.cacheMonitoring.getCacheHealthReport()),
    ]);

    return {
      success: true,
      data: {
        statistics: cacheStats,
        metrics: cacheMetrics,
        health: cacheHealth,
      },
      timestamp: new Date(),
    };
  }

  @Get("cache/hottest-keys")
  @ApiOperation({
    summary: "Get hottest cache keys",
    description: "Most frequently accessed cache keys",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    description: "Number of keys to return (default: 20)",
  })
  @ApiResponse({
    status: 200,
    description: "Hottest keys",
  })
  async getHottestKeys(@Query("limit") limit?: number) {
    const limitNum = limit ? parseInt(limit.toString()) : 20;
    const hottestKeys = this.cacheMonitoring.getHottestKeys(limitNum);

    return {
      success: true,
      data: {
        keys: hottestKeys,
        count: hottestKeys.length,
      },
      timestamp: new Date(),
    };
  }

  @Post("cache/warmup")
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary: "Trigger cache warmup",
    description: "Manually trigger cache warming with specified strategy",
  })
  @ApiBody({ type: TriggerWarmupDto, required: false })
  @ApiResponse({
    status: 202,
    description: "Cache warmup triggered",
  })
  async triggerCacheWarmup(@Body() dto?: TriggerWarmupDto) {
    try {
      if (this.cacheWarmup.isWarmupInProgress()) {
        return {
          success: false,
          error: "Cache warmup already in progress",
          timestamp: new Date(),
        };
      }

      // Trigger warmup asynchronously
      this.cacheWarmup.triggerWarmup(dto?.strategy).then(result => {
        this.logger.log(`Cache warmup completed: ${result.completedTasks}/${result.totalTasks} tasks`);
      }).catch(error => {
        this.logger.error("Cache warmup failed:", error);
      });

      return {
        success: true,
        message: "Cache warmup triggered",
        strategy: dto?.strategy || WarmupStrategy.CRITICAL_ONLY,
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        timestamp: new Date(),
      };
    }
  }

  @Get("cache/warmup/status")
  @ApiOperation({
    summary: "Get cache warmup status",
    description: "Check progress of ongoing cache warmup",
  })
  @ApiResponse({
    status: 200,
    description: "Warmup progress",
  })
  async getWarmupStatus() {
    const progress = this.cacheWarmup.getProgress();

    return {
      success: true,
      data: {
        inProgress: this.cacheWarmup.isWarmupInProgress(),
        progress,
      },
      timestamp: new Date(),
    };
  }

  @Post("cache/clear")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Clear cache",
    description: "Clear all cached data (L1 only for safety)",
  })
  @ApiResponse({
    status: 200,
    description: "Cache cleared",
  })
  async clearCache() {
    await this.cacheManager.clear();

    return {
      success: true,
      message: "Cache cleared (L1 only)",
      timestamp: new Date(),
    };
  }

  // ============================================================================
  // CONNECTION POOL ENDPOINTS
  // ============================================================================

  @Get("pool")
  @ApiOperation({
    summary: "Get connection pool metrics",
    description: "Connection pool statistics and health",
  })
  @ApiResponse({
    status: 200,
    description: "Pool metrics",
  })
  async getPoolMetrics() {
    const [metrics, health] = await Promise.all([
      Promise.resolve(this.poolManager.getPoolMetrics()),
      this.poolManager.checkPoolHealth(),
    ]);

    return {
      success: true,
      data: {
        metrics,
        health,
      },
      timestamp: new Date(),
    };
  }

  @Get("pool/leaks")
  @ApiOperation({
    summary: "Detect connection leaks",
    description: "Find connections held for too long",
  })
  @ApiResponse({
    status: 200,
    description: "Connection leaks",
  })
  async detectLeaks() {
    const leaks = await this.poolManager.detectLeaks();

    return {
      success: true,
      data: {
        leaks,
        count: leaks.length,
      },
      timestamp: new Date(),
    };
  }

  @Get("pool/long-running")
  @ApiOperation({
    summary: "Get long-running queries",
    description: "Find queries running longer than threshold",
  })
  @ApiQuery({
    name: "threshold",
    required: false,
    type: Number,
    description: "Threshold in milliseconds (default: 10000)",
  })
  @ApiResponse({
    status: 200,
    description: "Long-running queries",
  })
  async getLongRunningQueries(@Query("threshold") threshold?: number) {
    const thresholdMs = threshold ? parseInt(threshold.toString()) : 10000;
    const queries = await this.poolManager.getLongRunningQueries(thresholdMs);

    return {
      success: true,
      data: {
        queries,
        count: queries.length,
        threshold: thresholdMs,
      },
      timestamp: new Date(),
    };
  }

  // ============================================================================
  // LOCK ENDPOINTS
  // ============================================================================

  @Get("locks")
  @ApiOperation({
    summary: "Get lock statistics",
    description: "Distributed lock metrics",
  })
  @ApiResponse({
    status: 200,
    description: "Lock statistics",
  })
  async getLockStats() {
    const stats = this.lockManager.getLockStatistics();
    const activeLocks = this.lockManager.getActiveLocks();

    return {
      success: true,
      data: {
        statistics: stats,
        activeLocks,
      },
      timestamp: new Date(),
    };
  }

  @Get("locks/contention")
  @ApiOperation({
    summary: "Detect lock contention",
    description: "Find locks that are blocked",
  })
  @ApiResponse({
    status: 200,
    description: "Lock contention",
  })
  async detectLockContention() {
    const contention = await this.perfMonitoring.detectLockContention();

    return {
      success: true,
      data: {
        locks: contention,
        count: contention.length,
      },
      timestamp: new Date(),
    };
  }

  // ============================================================================
  // ADMIN ENDPOINTS
  // ============================================================================

  @Post("stats/reset")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Reset statistics",
    description: "Reset pg_stat_statements and other counters (admin only)",
  })
  @ApiResponse({
    status: 200,
    description: "Statistics reset",
  })
  async resetStatistics() {
    try {
      await this.perfMonitoring.resetStatistics();
      this.poolManager.resetStatistics();
      this.cacheMonitoring.resetCounters();

      return {
        success: true,
        message: "Statistics reset successfully",
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        timestamp: new Date(),
      };
    }
  }

  @Get("alerts")
  @ApiOperation({
    summary: "Get active alerts",
    description: "List of active performance alerts",
  })
  @ApiResponse({
    status: 200,
    description: "Active alerts",
  })
  async getActiveAlerts() {
    const perfAlerts = this.perfMonitoring.getActiveAlerts();
    const cacheAlerts = this.cacheMonitoring.getActiveAlerts();

    return {
      success: true,
      data: {
        performance: perfAlerts,
        cache: cacheAlerts,
        total: perfAlerts.length + cacheAlerts.length,
      },
      timestamp: new Date(),
    };
  }

  // ============================================================================
  // HEALTH CHECK
  // ============================================================================

  @Get("ping")
  @ApiOperation({
    summary: "Health check endpoint",
    description: "Simple health check",
  })
  @ApiResponse({
    status: 200,
    description: "Service is healthy",
  })
  async ping() {
    return {
      success: true,
      message: "Performance metrics service is running",
      uptime: process.uptime(),
      timestamp: new Date(),
    };
  }
}

export default PerformanceMetricsController;
