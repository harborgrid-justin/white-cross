/**
 * LOC: CACHEMON001
 * File: cache-monitoring.service.ts
 * Purpose: Real-time cache metrics tracking and alerting
 *
 * FEATURES:
 * - Real-time cache hit/miss tracking
 * - Memory usage monitoring
 * - Eviction rate analysis
 * - Automatic alerting on low hit rates
 * - Performance trend analysis
 */

import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface CacheHitMetric {
  key: string;
  timestamp: Date;
  latencyMs: number;
  tier: "L1" | "L2";
}

export interface CacheMissMetric {
  key: string;
  timestamp: Date;
  reason: "not_found" | "expired" | "evicted";
}

export interface CacheEvictionMetric {
  key: string;
  timestamp: Date;
  reason: "size_limit" | "ttl_expired" | "manual";
  size: number;
}

export interface CacheMetricsSummary {
  timestamp: Date;
  timeWindowMinutes: number;

  // Hit/Miss stats
  totalRequests: number;
  hits: number;
  misses: number;
  hitRate: number;

  // Tier breakdown
  l1Hits: number;
  l2Hits: number;
  l1HitRate: number;
  l2HitRate: number;

  // Performance
  avgHitLatencyMs: number;
  avgMissLatencyMs: number;
  p50LatencyMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;

  // Evictions
  evictionCount: number;
  evictionRate: number;

  // Memory
  memoryUsageMB: number;
  memoryUtilization: number;

  // Hottest keys
  hottestKeys: Array<{ key: string; hits: number }>;
}

export interface CacheHealthReport {
  healthy: boolean;
  score: number; // 0-100
  issues: string[];
  warnings: string[];
  recommendations: string[];
  metrics: CacheMetricsSummary;
}

export interface CacheAlert {
  alertId: string;
  severity: "low" | "medium" | "high" | "critical";
  metric: string;
  threshold: number;
  currentValue: number;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
}

// ============================================================================
// CACHE MONITORING SERVICE
// ============================================================================

@Injectable()
export class CacheMonitoringService implements OnModuleInit {
  private readonly logger = new Logger(CacheMonitoringService.name);

  // Metrics storage (in-memory circular buffers)
  private hitMetrics: CacheHitMetric[] = [];
  private missMetrics: CacheMissMetric[] = [];
  private evictionMetrics: CacheEvictionMetric[] = [];
  private maxMetricsHistory = 10000; // Keep last 10k events

  // Aggregated counters
  private counters = {
    totalRequests: 0,
    totalHits: 0,
    totalMisses: 0,
    l1Hits: 0,
    l2Hits: 0,
    evictions: 0,
    totalLatency: 0,
  };

  // Key access frequency tracking
  private keyHitCounts: Map<string, number> = new Map();

  // Alert tracking
  private activeAlerts: Map<string, CacheAlert> = new Map();
  private alertThresholds = {
    lowHitRate: 50, // Alert if hit rate < 50%
    highMemoryUsage: 80, // Alert if memory > 80%
    highEvictionRate: 10, // Alert if eviction rate > 10%
    highLatency: 50, // Alert if p95 latency > 50ms
  };

  async onModuleInit() {
    this.logger.log("🔍 Cache Monitoring Service initialized");
  }

  // ============================================================================
  // METRICS TRACKING
  // ============================================================================

  /**
   * Track cache hit
   */
  trackCacheHit(key: string, latencyMs: number, tier: "L1" | "L2"): void {
    const metric: CacheHitMetric = {
      key,
      timestamp: new Date(),
      latencyMs,
      tier,
    };

    this.hitMetrics.push(metric);
    this.trimMetrics(this.hitMetrics);

    // Update counters
    this.counters.totalRequests++;
    this.counters.totalHits++;
    this.counters.totalLatency += latencyMs;

    if (tier === "L1") {
      this.counters.l1Hits++;
    } else {
      this.counters.l2Hits++;
    }

    // Track key frequency
    const currentCount = this.keyHitCounts.get(key) || 0;
    this.keyHitCounts.set(key, currentCount + 1);
  }

  /**
   * Track cache miss
   */
  trackCacheMiss(key: string, reason: "not_found" | "expired" | "evicted" = "not_found"): void {
    const metric: CacheMissMetric = {
      key,
      timestamp: new Date(),
      reason,
    };

    this.missMetrics.push(metric);
    this.trimMetrics(this.missMetrics);

    // Update counters
    this.counters.totalRequests++;
    this.counters.totalMisses++;
  }

  /**
   * Track cache eviction
   */
  trackCacheEviction(
    key: string,
    reason: "size_limit" | "ttl_expired" | "manual",
    size: number
  ): void {
    const metric: CacheEvictionMetric = {
      key,
      timestamp: new Date(),
      reason,
      size,
    };

    this.evictionMetrics.push(metric);
    this.trimMetrics(this.evictionMetrics);

    this.counters.evictions++;

    // Remove from hit counts
    this.keyHitCounts.delete(key);
  }

  /**
   * Trim metrics arrays to max size
   */
  private trimMetrics(metrics: any[]): void {
    if (metrics.length > this.maxMetricsHistory) {
      metrics.shift();
    }
  }

  // ============================================================================
  // METRICS RETRIEVAL
  // ============================================================================

  /**
   * Get comprehensive metrics summary
   */
  getMetrics(timeWindowMinutes: number = 5): CacheMetricsSummary {
    const cutoffTime = new Date(Date.now() - timeWindowMinutes * 60 * 1000);

    // Filter metrics by time window
    const recentHits = this.hitMetrics.filter(m => m.timestamp >= cutoffTime);
    const recentMisses = this.missMetrics.filter(m => m.timestamp >= cutoffTime);
    const recentEvictions = this.evictionMetrics.filter(m => m.timestamp >= cutoffTime);

    const totalRequests = recentHits.length + recentMisses.length;
    const hits = recentHits.length;
    const misses = recentMisses.length;
    const hitRate = totalRequests > 0 ? (hits / totalRequests) * 100 : 0;

    // Tier breakdown
    const l1Hits = recentHits.filter(m => m.tier === "L1").length;
    const l2Hits = recentHits.filter(m => m.tier === "L2").length;
    const l1HitRate = totalRequests > 0 ? (l1Hits / totalRequests) * 100 : 0;
    const l2HitRate = totalRequests > 0 ? (l2Hits / totalRequests) * 100 : 0;

    // Latency stats
    const hitLatencies = recentHits.map(m => m.latencyMs).sort((a, b) => a - b);
    const avgHitLatencyMs = hitLatencies.length > 0
      ? hitLatencies.reduce((sum, l) => sum + l, 0) / hitLatencies.length
      : 0;

    const p50Index = Math.floor(hitLatencies.length * 0.5);
    const p95Index = Math.floor(hitLatencies.length * 0.95);
    const p99Index = Math.floor(hitLatencies.length * 0.99);

    const p50LatencyMs = hitLatencies[p50Index] || 0;
    const p95LatencyMs = hitLatencies[p95Index] || 0;
    const p99LatencyMs = hitLatencies[p99Index] || 0;

    // Eviction stats
    const evictionCount = recentEvictions.length;
    const evictionRate = totalRequests > 0 ? (evictionCount / totalRequests) * 100 : 0;

    // Memory estimation (simplified)
    const memoryUsageMB = evictionCount > 0
      ? recentEvictions.reduce((sum, e) => sum + e.size, 0) / (1024 * 1024)
      : 0;

    // Hottest keys (top 10)
    const sortedKeys = Array.from(this.keyHitCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([key, hits]) => ({ key, hits }));

    return {
      timestamp: new Date(),
      timeWindowMinutes,
      totalRequests,
      hits,
      misses,
      hitRate,
      l1Hits,
      l2Hits,
      l1HitRate,
      l2HitRate,
      avgHitLatencyMs,
      avgMissLatencyMs: 0, // Would need to track miss latency separately
      p50LatencyMs,
      p95LatencyMs,
      p99LatencyMs,
      evictionCount,
      evictionRate,
      memoryUsageMB,
      memoryUtilization: 0, // Would need to track total available memory
      hottestKeys: sortedKeys,
    };
  }

  /**
   * Get cache health report
   */
  getCacheHealthReport(): CacheHealthReport {
    const metrics = this.getMetrics(5);
    const issues: string[] = [];
    const warnings: string[] = [];
    const recommendations: string[] = [];

    let score = 100;

    // Check hit rate
    if (metrics.hitRate < 50) {
      issues.push(`Very low cache hit rate: ${metrics.hitRate.toFixed(2)}%`);
      recommendations.push("Increase cache TTL or adjust caching strategy");
      score -= 30;
    } else if (metrics.hitRate < 70) {
      warnings.push(`Low cache hit rate: ${metrics.hitRate.toFixed(2)}%`);
      recommendations.push("Consider increasing cache size or TTL");
      score -= 15;
    }

    // Check latency
    if (metrics.p95LatencyMs > 50) {
      warnings.push(`High p95 latency: ${metrics.p95LatencyMs.toFixed(2)}ms`);
      recommendations.push("Check cache backend performance (Redis)");
      score -= 10;
    }

    // Check eviction rate
    if (metrics.evictionRate > 10) {
      issues.push(`High eviction rate: ${metrics.evictionRate.toFixed(2)}%`);
      recommendations.push("Increase cache size or reduce TTL");
      score -= 20;
    } else if (metrics.evictionRate > 5) {
      warnings.push(`Moderate eviction rate: ${metrics.evictionRate.toFixed(2)}%`);
      score -= 10;
    }

    // Check L1/L2 balance
    if (metrics.l1HitRate < 30 && metrics.hitRate > 50) {
      warnings.push("Low L1 hit rate - consider increasing L1 cache size");
      recommendations.push("Adjust L1 cache max entries");
      score -= 5;
    }

    const healthy = score >= 70 && issues.length === 0;

    return {
      healthy,
      score,
      issues,
      warnings,
      recommendations,
      metrics,
    };
  }

  // ============================================================================
  // ALERTING
  // ============================================================================

  /**
   * Check for alert conditions
   */
  @Cron("*/1 * * * *") // Every minute
  async checkAlerts(): Promise<void> {
    const metrics = this.getMetrics(5);

    // Check low hit rate
    if (metrics.hitRate < this.alertThresholds.lowHitRate) {
      this.raiseAlert(
        "low_hit_rate",
        "high",
        "hit_rate",
        this.alertThresholds.lowHitRate,
        metrics.hitRate,
        `Cache hit rate is below threshold: ${metrics.hitRate.toFixed(2)}% < ${this.alertThresholds.lowHitRate}%`
      );
    } else {
      this.clearAlert("low_hit_rate");
    }

    // Check high eviction rate
    if (metrics.evictionRate > this.alertThresholds.highEvictionRate) {
      this.raiseAlert(
        "high_eviction_rate",
        "medium",
        "eviction_rate",
        this.alertThresholds.highEvictionRate,
        metrics.evictionRate,
        `Cache eviction rate is high: ${metrics.evictionRate.toFixed(2)}% > ${this.alertThresholds.highEvictionRate}%`
      );
    } else {
      this.clearAlert("high_eviction_rate");
    }

    // Check high latency
    if (metrics.p95LatencyMs > this.alertThresholds.highLatency) {
      this.raiseAlert(
        "high_latency",
        "medium",
        "p95_latency",
        this.alertThresholds.highLatency,
        metrics.p95LatencyMs,
        `Cache p95 latency is high: ${metrics.p95LatencyMs.toFixed(2)}ms > ${this.alertThresholds.highLatency}ms`
      );
    } else {
      this.clearAlert("high_latency");
    }
  }

  /**
   * Raise alert
   */
  private raiseAlert(
    alertId: string,
    severity: "low" | "medium" | "high" | "critical",
    metric: string,
    threshold: number,
    currentValue: number,
    message: string
  ): void {
    const existingAlert = this.activeAlerts.get(alertId);

    if (!existingAlert) {
      const alert: CacheAlert = {
        alertId,
        severity,
        metric,
        threshold,
        currentValue,
        message,
        timestamp: new Date(),
        acknowledged: false,
      };

      this.activeAlerts.set(alertId, alert);
      this.logger.warn(`🚨 Cache Alert [${severity.toUpperCase()}]: ${message}`);
    }
  }

  /**
   * Clear alert
   */
  private clearAlert(alertId: string): void {
    const alert = this.activeAlerts.get(alertId);
    if (alert) {
      this.activeAlerts.delete(alertId);
      this.logger.log(`✅ Cache Alert Cleared: ${alertId}`);
    }
  }

  /**
   * Get active alerts
   */
  getActiveAlerts(): CacheAlert[] {
    return Array.from(this.activeAlerts.values());
  }

  /**
   * Acknowledge alert
   */
  acknowledgeAlert(alertId: string): boolean {
    const alert = this.activeAlerts.get(alertId);
    if (alert) {
      alert.acknowledged = true;
      return true;
    }
    return false;
  }

  // ============================================================================
  // STATISTICS & REPORTS
  // ============================================================================

  /**
   * Get real-time statistics
   */
  getRealtimeStatistics(): {
    totalRequests: number;
    totalHits: number;
    totalMisses: number;
    overallHitRate: number;
    l1Hits: number;
    l2Hits: number;
    evictions: number;
    avgLatency: number;
    uniqueKeys: number;
  } {
    const overallHitRate = this.counters.totalRequests > 0
      ? (this.counters.totalHits / this.counters.totalRequests) * 100
      : 0;

    const avgLatency = this.counters.totalHits > 0
      ? this.counters.totalLatency / this.counters.totalHits
      : 0;

    return {
      totalRequests: this.counters.totalRequests,
      totalHits: this.counters.totalHits,
      totalMisses: this.counters.totalMisses,
      overallHitRate,
      l1Hits: this.counters.l1Hits,
      l2Hits: this.counters.l2Hits,
      evictions: this.counters.evictions,
      avgLatency,
      uniqueKeys: this.keyHitCounts.size,
    };
  }

  /**
   * Reset all counters
   */
  resetCounters(): void {
    this.counters = {
      totalRequests: 0,
      totalHits: 0,
      totalMisses: 0,
      l1Hits: 0,
      l2Hits: 0,
      evictions: 0,
      totalLatency: 0,
    };
    this.hitMetrics = [];
    this.missMetrics = [];
    this.evictionMetrics = [];
    this.keyHitCounts.clear();
    this.logger.log("Cache monitoring counters reset");
  }

  /**
   * Update alert thresholds
   */
  updateAlertThresholds(thresholds: Partial<typeof this.alertThresholds>): void {
    this.alertThresholds = { ...this.alertThresholds, ...thresholds };
    this.logger.log("Alert thresholds updated", this.alertThresholds);
  }

  /**
   * Get hottest keys
   */
  getHottestKeys(limit: number = 20): Array<{ key: string; hits: number }> {
    return Array.from(this.keyHitCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([key, hits]) => ({ key, hits }));
  }

  /**
   * Get coldest keys
   */
  getColdestKeys(limit: number = 20): Array<{ key: string; hits: number }> {
    return Array.from(this.keyHitCounts.entries())
      .sort((a, b) => a[1] - b[1])
      .slice(0, limit)
      .map(([key, hits]) => ({ key, hits }));
  }
}

export default CacheMonitoringService;
