/**
 * @fileoverview Cache Statistics and Monitoring Service
 * @module infrastructure/cache/statistics
 * @description Advanced cache metrics, monitoring, and health indicators
 */

import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { HealthCheckError, HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { CacheService } from './cache.service';
import { CacheWarmingService } from './cache-warming.service';
import { RateLimiterService } from './rate-limiter.service';
import type { CacheEventPayload } from './cache.interfaces';
import { CacheEvent } from './cache.interfaces';


import { BaseService } from '@/common/base';
import { BaseService } from '@/common/base';
import { LoggerService } from '@/common/logging/logger.service';
import { Inject } from '@nestjs/common';
/**
 * Cache warm event payload
 */
interface CacheWarmPayload {
  keys?: string[];
  pattern?: string;
  count?: number;
  [key: string]: unknown;
}

/**
 * Detailed cache metrics
 */
export interface CacheMetrics {
  /** Basic statistics */
  stats: {
    hits: number;
    misses: number;
    hitRate: number;
    l1Hits: number;
    l2Hits: number;
    keys: number;
    memoryUsage: number;
  };

  /** Performance metrics */
  performance: {
    avgGetLatency: number;
    avgSetLatency: number;
    totalOperations: number;
    failedOperations: number;
    failureRate: number;
  };

  /** Health status */
  health: {
    status: string;
    redisConnected: boolean;
    redisLatency: number;
    l1Status: string;
    uptime: number;
  };

  /** Warming statistics */
  warming: {
    totalWarmed: number;
    lastCount: number;
    failures: number;
    lastWarmingTime?: Date;
    strategies: number;
  };

  /** Rate limiting statistics */
  rateLimit: {
    totalRequests: number;
    limitedRequests: number;
    limitRate: number;
    uniqueKeys: number;
  };

  /** Event statistics */
  events: {
    hits: number;
    misses: number;
    sets: number;
    deletes: number;
    invalidations: number;
    errors: number;
    evictions: number;
  };
}

/**
 * Cache statistics and monitoring service
 */
@Injectable()
export class CacheStatisticsService extends HealthIndicator {
  private eventCounts = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
    invalidations: 0,
    errors: 0,
    evictions: 0,
    warms: 0,
  };
  private latencyBuckets = {
    '<10ms': 0,
    '<50ms': 0,
    '<100ms': 0,
    '<500ms': 0,
    '>=500ms': 0,
  };

  constructor(
    @Inject(LoggerService) logger: LoggerService,
    private readonly cacheService: CacheService,
    private readonly warmingService: CacheWarmingService,
    private readonly rateLimiterService: RateLimiterService,
  ) {
    super({
      serviceName: 'CacheStatisticsService',
      logger,
      enableAuditLogging: true,
    });
  }

  /**
   * Get comprehensive cache metrics
   */
  async getMetrics(): Promise<CacheMetrics> {
    const stats = this.cacheService.getStats();
    const health = await this.cacheService.getHealth();
    const warming = this.warmingService.getStats();
    const rateLimit = this.rateLimiterService.getStats();

    const failureRate =
      stats.totalOperations > 0
        ? (stats.failedOperations / stats.totalOperations) * 100
        : 0;

    return {
      stats: {
        hits: stats.hits,
        misses: stats.misses,
        hitRate: stats.hitRate,
        l1Hits: stats.l1Hits,
        l2Hits: stats.l2Hits,
        keys: stats.keys,
        memoryUsage: stats.memoryUsage,
      },
      performance: {
        avgGetLatency: stats.avgGetLatency,
        avgSetLatency: stats.avgSetLatency,
        totalOperations: stats.totalOperations,
        failedOperations: stats.failedOperations,
        failureRate: Math.round(failureRate * 100) / 100,
      },
      health: {
        status: health.status,
        redisConnected: health.redisConnected,
        redisLatency: health.redisLatency,
        l1Status: health.l1Status,
        uptime: health.uptime,
      },
      warming: {
        totalWarmed: warming.totalWarmed,
        lastCount: warming.lastCount,
        failures: warming.failures,
        lastWarmingTime: warming.lastWarmingTime,
        strategies: warming.strategies,
      },
      rateLimit: {
        totalRequests: rateLimit.totalRequests,
        limitedRequests: rateLimit.limitedRequests,
        limitRate: rateLimit.limitRate,
        uniqueKeys: rateLimit.uniqueKeys,
      },
      events: {
        hits: this.eventCounts.hits,
        misses: this.eventCounts.misses,
        sets: this.eventCounts.sets,
        deletes: this.eventCounts.deletes,
        invalidations: this.eventCounts.invalidations,
        errors: this.eventCounts.errors,
        evictions: this.eventCounts.evictions,
      },
    };
  }

  /**
   * Get Prometheus-compatible metrics
   */
  async getPrometheusMetrics(): Promise<string> {
    const metrics = await this.getMetrics();
    const lines: string[] = [];

    // Cache hits
    lines.push('# HELP cache_hits_total Total number of cache hits');
    lines.push('# TYPE cache_hits_total counter');
    lines.push(`cache_hits_total ${metrics.stats.hits}`);

    // Cache misses
    lines.push('# HELP cache_misses_total Total number of cache misses');
    lines.push('# TYPE cache_misses_total counter');
    lines.push(`cache_misses_total ${metrics.stats.misses}`);

    // Hit rate
    lines.push('# HELP cache_hit_rate Cache hit rate percentage');
    lines.push('# TYPE cache_hit_rate gauge');
    lines.push(`cache_hit_rate ${metrics.stats.hitRate}`);

    // L1 hits
    lines.push('# HELP cache_l1_hits_total Total number of L1 cache hits');
    lines.push('# TYPE cache_l1_hits_total counter');
    lines.push(`cache_l1_hits_total ${metrics.stats.l1Hits}`);

    // L2 hits
    lines.push('# HELP cache_l2_hits_total Total number of L2 cache hits');
    lines.push('# TYPE cache_l2_hits_total counter');
    lines.push(`cache_l2_hits_total ${metrics.stats.l2Hits}`);

    // Keys
    lines.push('# HELP cache_keys_total Total number of keys in cache');
    lines.push('# TYPE cache_keys_total gauge');
    lines.push(`cache_keys_total ${metrics.stats.keys}`);

    // Memory usage
    lines.push('# HELP cache_memory_bytes Memory usage in bytes');
    lines.push('# TYPE cache_memory_bytes gauge');
    lines.push(`cache_memory_bytes ${metrics.stats.memoryUsage}`);

    // Latency
    lines.push(
      '# HELP cache_get_latency_ms Average GET latency in milliseconds',
    );
    lines.push('# TYPE cache_get_latency_ms gauge');
    lines.push(`cache_get_latency_ms ${metrics.performance.avgGetLatency}`);

    lines.push(
      '# HELP cache_set_latency_ms Average SET latency in milliseconds',
    );
    lines.push('# TYPE cache_set_latency_ms gauge');
    lines.push(`cache_set_latency_ms ${metrics.performance.avgSetLatency}`);

    // Operations
    lines.push('# HELP cache_operations_total Total cache operations');
    lines.push('# TYPE cache_operations_total counter');
    lines.push(`cache_operations_total ${metrics.performance.totalOperations}`);

    // Failed operations
    lines.push(
      '# HELP cache_failed_operations_total Total failed cache operations',
    );
    lines.push('# TYPE cache_failed_operations_total counter');
    lines.push(
      `cache_failed_operations_total ${metrics.performance.failedOperations}`,
    );

    // Health
    lines.push(
      '# HELP cache_health_status Cache health status (1=healthy, 0=unhealthy)',
    );
    lines.push('# TYPE cache_health_status gauge');
    lines.push(
      `cache_health_status ${metrics.health.status === 'healthy' ? 1 : 0}`,
    );

    // Redis connection
    lines.push(
      '# HELP cache_redis_connected Redis connection status (1=connected, 0=disconnected)',
    );
    lines.push('# TYPE cache_redis_connected gauge');
    lines.push(
      `cache_redis_connected ${metrics.health.redisConnected ? 1 : 0}`,
    );

    // Redis latency
    lines.push(
      '# HELP cache_redis_latency_ms Redis ping latency in milliseconds',
    );
    lines.push('# TYPE cache_redis_latency_ms gauge');
    lines.push(`cache_redis_latency_ms ${metrics.health.redisLatency}`);

    // Warming
    lines.push(
      '# HELP cache_warmed_total Total number of cache entries warmed',
    );
    lines.push('# TYPE cache_warmed_total counter');
    lines.push(`cache_warmed_total ${metrics.warming.totalWarmed}`);

    // Rate limiting
    lines.push('# HELP rate_limit_requests_total Total rate limit requests');
    lines.push('# TYPE rate_limit_requests_total counter');
    lines.push(`rate_limit_requests_total ${metrics.rateLimit.totalRequests}`);

    lines.push('# HELP rate_limit_limited_total Total rate limited requests');
    lines.push('# TYPE rate_limit_limited_total counter');
    lines.push(`rate_limit_limited_total ${metrics.rateLimit.limitedRequests}`);

    return lines.join('\n') + '\n';
  }

  /**
   * Health indicator for NestJS Terminus
   */
  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      const health = await this.cacheService.getHealth();

      if (health.status === 'healthy') {
        return this.getStatus(key, true, {
          status: health.status,
          redisConnected: health.redisConnected,
          redisLatency: health.redisLatency,
          uptime: health.uptime,
        });
      }

      if (health.status === 'degraded') {
        return this.getStatus(key, true, {
          status: 'degraded',
          redisConnected: health.redisConnected,
          warning: 'Cache is operating in degraded mode',
        });
      }

      throw new HealthCheckError(
        'Cache unhealthy',
        this.getStatus(key, false, health),
      );
    } catch (error) {
      throw new HealthCheckError(
        'Cache health check failed',
        this.getStatus(key, false, {
          error: error instanceof Error ? error.message : 'Unknown error',
        }),
      );
    }
  }

  /**
   * Get cache report (human-readable)
   */
  async getReport(): Promise<string> {
    const metrics = await this.getMetrics();
    const lines: string[] = [];

    lines.push('=== CACHE STATISTICS REPORT ===');
    lines.push('');
    lines.push('Basic Statistics:');
    lines.push(`  Hits: ${metrics.stats.hits}`);
    lines.push(`  Misses: ${metrics.stats.misses}`);
    lines.push(`  Hit Rate: ${metrics.stats.hitRate}%`);
    lines.push(`  L1 Hits: ${metrics.stats.l1Hits}`);
    lines.push(`  L2 Hits: ${metrics.stats.l2Hits}`);
    lines.push(`  Total Keys: ${metrics.stats.keys}`);
    lines.push(
      `  Memory Usage: ${this.formatBytes(metrics.stats.memoryUsage)}`,
    );
    lines.push('');
    lines.push('Performance:');
    lines.push(
      `  Avg GET Latency: ${metrics.performance.avgGetLatency.toFixed(2)}ms`,
    );
    lines.push(
      `  Avg SET Latency: ${metrics.performance.avgSetLatency.toFixed(2)}ms`,
    );
    lines.push(`  Total Operations: ${metrics.performance.totalOperations}`);
    lines.push(`  Failed Operations: ${metrics.performance.failedOperations}`);
    lines.push(`  Failure Rate: ${metrics.performance.failureRate}%`);
    lines.push('');
    lines.push('Health:');
    lines.push(`  Status: ${metrics.health.status}`);
    lines.push(
      `  Redis Connected: ${metrics.health.redisConnected ? 'Yes' : 'No'}`,
    );
    lines.push(`  Redis Latency: ${metrics.health.redisLatency}ms`);
    lines.push(`  L1 Status: ${metrics.health.l1Status}`);
    lines.push(`  Uptime: ${this.formatDuration(metrics.health.uptime)}`);
    lines.push('');
    lines.push('Cache Warming:');
    lines.push(`  Total Warmed: ${metrics.warming.totalWarmed}`);
    lines.push(`  Last Count: ${metrics.warming.lastCount}`);
    lines.push(`  Failures: ${metrics.warming.failures}`);
    lines.push(`  Strategies: ${metrics.warming.strategies}`);
    if (metrics.warming.lastWarmingTime) {
      lines.push(
        `  Last Warming: ${metrics.warming.lastWarmingTime.toISOString()}`,
      );
    }
    lines.push('');
    lines.push('Rate Limiting:');
    lines.push(`  Total Requests: ${metrics.rateLimit.totalRequests}`);
    lines.push(`  Limited Requests: ${metrics.rateLimit.limitedRequests}`);
    lines.push(`  Limit Rate: ${metrics.rateLimit.limitRate}%`);
    lines.push(`  Unique Keys: ${metrics.rateLimit.uniqueKeys}`);
    lines.push('');
    lines.push('Events:');
    lines.push(`  Hits: ${metrics.events.hits}`);
    lines.push(`  Misses: ${metrics.events.misses}`);
    lines.push(`  Sets: ${metrics.events.sets}`);
    lines.push(`  Deletes: ${metrics.events.deletes}`);
    lines.push(`  Invalidations: ${metrics.events.invalidations}`);
    lines.push(`  Errors: ${metrics.events.errors}`);
    lines.push(`  Evictions: ${metrics.events.evictions}`);
    lines.push('');
    lines.push('===============================');

    return lines.join('\n');
  }

  /**
   * Reset all statistics
   */
  async resetStats(): Promise<void> {
    this.cacheService.resetStats();
    this.warmingService.resetStats();
    this.rateLimiterService.resetStats();
    this.eventCounts = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
      invalidations: 0,
      errors: 0,
      evictions: 0,
      warms: 0,
    };
    this.latencyBuckets = {
      '<10ms': 0,
      '<50ms': 0,
      '<100ms': 0,
      '<500ms': 0,
      '>=500ms': 0,
    };
    this.logInfo('Cache statistics reset');
  }

  // Event listeners

  @OnEvent(CacheEvent.HIT)
  handleCacheHit(payload: CacheEventPayload): void {
    this.eventCounts.hits++;
  }

  @OnEvent(CacheEvent.MISS)
  handleCacheMiss(payload: CacheEventPayload): void {
    this.eventCounts.misses++;
  }

  @OnEvent(CacheEvent.SET)
  handleCacheSet(payload: CacheEventPayload): void {
    this.eventCounts.sets++;
  }

  @OnEvent(CacheEvent.DELETE)
  handleCacheDelete(payload: CacheEventPayload): void {
    this.eventCounts.deletes++;
  }

  @OnEvent(CacheEvent.INVALIDATE)
  handleCacheInvalidate(payload: CacheEventPayload): void {
    this.eventCounts.invalidations++;
  }

  @OnEvent(CacheEvent.ERROR)
  handleCacheError(payload: CacheEventPayload): void {
    this.eventCounts.errors++;
  }

  @OnEvent(CacheEvent.EVICT)
  handleCacheEvict(payload: CacheEventPayload): void {
    this.eventCounts.evictions++;
  }

  @OnEvent(CacheEvent.WARM)
  handleCacheWarm(payload: CacheWarmPayload): void {
    this.eventCounts.warms++;
  }

  // Private helper methods

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }

  private formatDuration(seconds: number): string {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const parts: string[] = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

    return parts.join(' ');
  }
}
