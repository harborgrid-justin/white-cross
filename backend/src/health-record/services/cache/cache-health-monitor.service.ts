/**
 * @fileoverview Cache Health Monitor Service
 * @module health-reco@/services/cache
 * @description Monitors cache health status and manages alerts
 */

import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  CacheHealthStatus,
  CacheAlert,
} from './cache-interfaces';
import { CACHE_CONSTANTS } from './cache-constants';
import { CacheMetricsCollectorService } from './cache-metrics-collector.service';

import { BaseService } from '@/common/base';
@Injectable()
export class CacheHealthMonitorService extends BaseService {
  private readonly alerts: CacheAlert[] = [];
  private readonly maxAlertsHistory = CACHE_CONSTANTS.METRICS.MAX_ALERTS_HISTORY;

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly metricsCollector: CacheMetricsCollectorService,
  ) {
    this.startHealthMonitoring();
  }

  getHealthStatus(): CacheHealthStatus {
    const stats = this.metricsCollector.getPerformanceStats();
    const activeAlerts = this.alerts.filter(alert => !alert.resolved);

    let status: 'healthy' | 'warning' | 'critical' = 'healthy';
    let issues: string[] = [];

    // Check hit rate
    if (stats.overallHitRate < CACHE_CONSTANTS.METRICS.HEALTH_THRESHOLDS.MIN_HIT_RATE) {
      status = 'critical';
      issues.push(`Low hit rate: ${(stats.overallHitRate * 100).toFixed(1)}%`);
    } else if (stats.overallHitRate < CACHE_CONSTANTS.METRICS.HEALTH_THRESHOLDS.WARNING_HIT_RATE) {
      status = status === 'critical' ? 'critical' : 'warning';
      issues.push(`Below optimal hit rate: ${(stats.overallHitRate * 100).toFixed(1)}%`);
    }

    // Check response time
    if (stats.averageResponseTime > CACHE_CONSTANTS.METRICS.HEALTH_THRESHOLDS.MAX_RESPONSE_TIME) {
      status = 'critical';
      issues.push(`High response time: ${stats.averageResponseTime.toFixed(0)}ms`);
    } else if (stats.averageResponseTime > CACHE_CONSTANTS.METRICS.HEALTH_THRESHOLDS.WARNING_RESPONSE_TIME) {
      status = status === 'critical' ? 'critical' : 'warning';
      issues.push(`Elevated response time: ${stats.averageResponseTime.toFixed(0)}ms`);
    }

    // Check error rate
    const errorRate = this.calculateErrorRate();
    if (errorRate > CACHE_CONSTANTS.METRICS.HEALTH_THRESHOLDS.MAX_ERROR_RATE) {
      status = 'critical';
      issues.push(`High error rate: ${(errorRate * 100).toFixed(1)}%`);
    }

    // Check memory usage
    const memoryUsagePercent = this.calculateMemoryUsagePercent();
    if (memoryUsagePercent > CACHE_CONSTANTS.METRICS.HEALTH_THRESHOLDS.MAX_MEMORY_USAGE) {
      status = 'critical';
      issues.push(`High memory usage: ${memoryUsagePercent.toFixed(1)}%`);
    }

    return {
      status,
      issues,
      activeAlerts: activeAlerts.length,
      lastChecked: new Date(),
      recommendations: this.generateHealthRecommendations(status, issues),
    };
  }

  getActiveAlerts(): CacheAlert[] {
    return this.alerts.filter(alert => !alert.resolved);
  }

  resolveAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert && !alert.resolved) {
      alert.resolved = true;
      alert.resolvedAt = new Date();
      this.logInfo(`Alert resolved: ${alert.message}`);
      return true;
    }
    return false;
  }

  getHealthSummary(): {
    status: CacheHealthStatus;
    alerts: { active: number; total: number };
    recentIssues: string[];
  } {
    const health = this.getHealthStatus();
    const recentAlerts = this.alerts
      .filter(alert => !alert.resolved)
      .sort((a, b) => b.lastOccurred.getTime() - a.lastOccurred.getTime())
      .slice(0, 5);

    return {
      status: health,
      alerts: {
        active: this.alerts.filter(a => !a.resolved).length,
        total: this.alerts.length,
      },
      recentIssues: recentAlerts.map(alert => alert.message),
    };
  }

  reset(): void {
    this.alerts.length = 0;
    this.logInfo('Cache health monitor reset');
  }

  private startHealthMonitoring(): void {
    // Check health every 30 seconds
    setInterval(() => {
      try {
        this.performHealthCheck();
      } catch (error) {
        this.logError('Failed to perform health check:', error);
      }
    }, 30000);

    // Clean up old alerts every hour
    setInterval(() => {
      try {
        this.cleanupOldAlerts();
      } catch (error) {
        this.logError('Failed to cleanup old alerts:', error);
      }
    }, 60 * 60 * 1000); // 1 hour
  }

  private performHealthCheck(): void {
    const health = this.getHealthStatus();

    if (health.status === 'critical') {
      this.logError('Cache health status: CRITICAL', { issues: health.issues });
    } else if (health.status === 'warning') {
      this.logWarning('Cache health status: WARNING', { issues: health.issues });
    }

    // Check for new alerts based on current metrics
    this.checkForAlerts();
  }

  private checkForAlerts(): void {
    const stats = this.metricsCollector.getPerformanceStats();

    // Response time alert
    if (stats.averageResponseTime > CACHE_CONSTANTS.METRICS.ALERT_THRESHOLDS.RESPONSE_TIME) {
      this.createAlert(
        'high_response_time',
        `High average response time: ${stats.averageResponseTime.toFixed(0)}ms`,
        'warning',
        { averageResponseTime: stats.averageResponseTime }
      );
    }

    // Hit rate alert
    if (stats.overallHitRate < CACHE_CONSTANTS.METRICS.ALERT_THRESHOLDS.MIN_HIT_RATE) {
      this.createAlert(
        'low_hit_rate',
        `Low hit rate: ${(stats.overallHitRate * 100).toFixed(1)}%`,
        'critical',
        { hitRate: stats.overallHitRate }
      );
    }

    // Memory usage alert
    const memoryUsagePercent = this.calculateMemoryUsagePercent();
    if (memoryUsagePercent > CACHE_CONSTANTS.METRICS.ALERT_THRESHOLDS.MEMORY_USAGE) {
      this.createAlert(
        'high_memory_usage',
        `High memory usage: ${memoryUsagePercent.toFixed(1)}%`,
        'warning',
        { memoryUsagePercent }
      );
    }

    // Operations per second alert (too low)
    if (stats.operationsPerSecond < CACHE_CONSTANTS.METRICS.ALERT_THRESHOLDS.MIN_OPS_PER_SECOND) {
      this.createAlert(
        'low_throughput',
        `Low cache throughput: ${stats.operationsPerSecond.toFixed(1)} ops/sec`,
        'warning',
        { operationsPerSecond: stats.operationsPerSecond }
      );
    }
  }

  private calculateErrorRate(): number {
    const rawMetrics = this.metricsCollector.getRawMetrics();
    let totalFailed = 0;
    let totalOperations = 0;

    for (const tierMetrics of rawMetrics.tiers.values()) {
      totalFailed += tierMetrics.failedOperations;
      totalOperations += tierMetrics.totalOperations;
    }

    return totalOperations > 0 ? totalFailed / totalOperations : 0;
  }

  private calculateMemoryUsagePercent(): number {
    const rawMetrics = this.metricsCollector.getRawMetrics();
    const maxMemory = CACHE_CONSTANTS.METRICS.MAX_MEMORY_USAGE_BYTES;
    return maxMemory > 0 ? (rawMetrics.totalCacheSize / maxMemory) * 100 : 0;
  }

  private createAlert(type: string, message: string, severity: 'info' | 'warning' | 'critical', metadata: any): void {
    // Check if similar alert already exists and is active
    const existingAlert = this.alerts.find(
      alert => alert.type === type && !alert.resolved && alert.severity === severity
    );

    if (existingAlert) {
      existingAlert.occurrences++;
      existingAlert.lastOccurred = new Date();
      return;
    }

    const alert: CacheAlert = {
      id: `${type}_${Date.now()}`,
      type,
      message,
      severity,
      createdAt: new Date(),
      lastOccurred: new Date(),
      occurrences: 1,
      resolved: false,
      metadata,
    };

    this.alerts.push(alert);

    // Keep only recent alerts
    if (this.alerts.length > this.maxAlertsHistory) {
      this.alerts.shift();
    }

    this.logInfo(`Cache alert created: ${message}`, { type, severity, metadata });

    // Emit alert event
    this.eventEmitter.emit('cache.alert.created', alert);
  }

  private generateHealthRecommendations(status: string, issues: string[]): string[] {
    const recommendations: string[] = [];

    if (issues.some(issue => issue.includes('hit rate'))) {
      recommendations.push('Consider increasing cache TTL or implementing cache warming');
      recommendations.push('Review cache key generation strategy');
      recommendations.push('Check if cache size limits are too restrictive');
    }

    if (issues.some(issue => issue.includes('response time'))) {
      recommendations.push('Consider promoting frequently accessed data to higher cache tiers');
      recommendations.push('Review network latency and Redis configuration');
      recommendations.push('Check for memory pressure causing GC pauses');
    }

    if (issues.some(issue => issue.includes('memory'))) {
      recommendations.push('Implement more aggressive cache eviction policies');
      recommendations.push('Consider increasing cache memory allocation');
      recommendations.push('Review data serialization sizes');
    }

    if (issues.some(issue => issue.includes('error rate'))) {
      recommendations.push('Check Redis connectivity and error logs');
      recommendations.push('Review cache serialization/deserialization logic');
      recommendations.push('Monitor for network issues affecting cache operations');
    }

    if (issues.some(issue => issue.includes('throughput'))) {
      recommendations.push('Consider horizontal scaling of cache instances');
      recommendations.push('Review cache key distribution for better parallelism');
      recommendations.push('Check for lock contention in cache operations');
    }

    return recommendations;
  }

  private cleanupOldAlerts(): void {
    const cutoffTime = Date.now() - (24 * 60 * 60 * 1000); // 24 hours ago
    const initialCount = this.alerts.length;

    // Mark old unresolved alerts as resolved
    this.alerts.forEach(alert => {
      if (!alert.resolved && alert.lastOccurred.getTime() < cutoffTime) {
        alert.resolved = true;
        alert.resolvedAt = new Date();
      }
    });

    // Remove very old resolved alerts (keep only last 100)
    if (this.alerts.length > 100) {
      this.alerts.splice(0, this.alerts.length - 100);
    }

    const removedCount = initialCount - this.alerts.length;
    if (removedCount > 0) {
      this.logDebug(`Cleaned up ${removedCount} old alerts`);
    }
  }
}
