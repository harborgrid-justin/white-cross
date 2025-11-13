/**
 * Alert Management Service
 *
 * @module infrastructure/monitoring
 * @description Service responsible for alert generation, storage, and management.
 * Monitors system metrics and triggers alerts when thresholds are exceeded.
 */

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseService } from '../../common/base';
import {
  Alert,
  AlertConfig,
  AlertSeverity,
  MetricsSnapshot,
} from './interfaces/metrics.interface';

/**
 * AlertManagementService
 *
 * @description Manages system alerts based on configurable thresholds.
 * Monitors CPU usage, memory usage, response times, error rates, and failed jobs.
 * Provides alert acknowledgment and resolution functionality.
 *
 * @example
 * ```typescript
 * await alertManagementService.checkAlerts(metricsSnapshot);
 * const activeAlerts = alertManagementService.getActiveAlerts();
 * ```
 */
@Injectable()
export class AlertManagementService extends BaseService {
  // Alert storage
  private alerts: Map<string, Alert> = new Map();

  // Alert configuration
  private alertConfig: AlertConfig = {
    enabled: true,
    cpuThreshold: 80,
    memoryThreshold: 85,
    responseTimeThreshold: 5000,
    errorRateThreshold: 5,
    dbConnectionThreshold: 90,
    failedJobsThreshold: 100,
  };

  constructor(private readonly configService: ConfigService) {
    this.loadAlertConfig();
  }

  /**
   * Load alert configuration from environment
   */
  private loadAlertConfig(): void {
    this.alertConfig = {
      enabled: this.configService.get('ALERTS_ENABLED', 'true') === 'true',
      cpuThreshold: this.configService.get('ALERT_CPU_THRESHOLD', 80),
      memoryThreshold: this.configService.get('ALERT_MEMORY_THRESHOLD', 85),
      responseTimeThreshold: this.configService.get(
        'ALERT_RESPONSE_TIME_THRESHOLD',
        5000,
      ),
      errorRateThreshold: this.configService.get(
        'ALERT_ERROR_RATE_THRESHOLD',
        5,
      ),
      dbConnectionThreshold: this.configService.get(
        'ALERT_DB_CONNECTION_THRESHOLD',
        90,
      ),
      failedJobsThreshold: this.configService.get(
        'ALERT_FAILED_JOBS_THRESHOLD',
        100,
      ),
    };

    this.logInfo('Alert configuration loaded', this.alertConfig);
  }

  /**
   * Get alert configuration
   */
  getAlertConfig(): AlertConfig {
    return { ...this.alertConfig };
  }

  /**
   * Update alert configuration
   */
  updateAlertConfig(config: Partial<AlertConfig>): void {
    this.alertConfig = { ...this.alertConfig, ...config };
    this.logInfo('Alert configuration updated', this.alertConfig);
  }

  /**
   * Check for alert conditions based on metrics
   *
   * @param metrics Current metrics snapshot
   */
  async checkAlerts(metrics: MetricsSnapshot): Promise<void> {
    if (!this.alertConfig.enabled) {
      return;
    }

    const alerts: Alert[] = [];

    // Check CPU usage
    if (metrics.system.cpu.usage > this.alertConfig.cpuThreshold) {
      alerts.push({
        id: `cpu-high-${Date.now()}`,
        severity: AlertSeverity.WARNING,
        title: 'High CPU Usage',
        message: `CPU usage is ${metrics.system.cpu.usage.toFixed(2)}% (threshold: ${this.alertConfig.cpuThreshold}%)`,
        component: 'system',
        timestamp: new Date().toISOString(),
        acknowledged: false,
        metadata: { cpuUsage: metrics.system.cpu.usage },
      });
    }

    // Check memory usage
    if (metrics.system.memory.usagePercent > this.alertConfig.memoryThreshold) {
      alerts.push({
        id: `memory-high-${Date.now()}`,
        severity: AlertSeverity.WARNING,
        title: 'High Memory Usage',
        message: `Memory usage is ${metrics.system.memory.usagePercent.toFixed(2)}% (threshold: ${this.alertConfig.memoryThreshold}%)`,
        component: 'system',
        timestamp: new Date().toISOString(),
        acknowledged: false,
        metadata: { memoryUsage: metrics.system.memory.usagePercent },
      });
    }

    // Check response time
    if (
      metrics.performance.requests.averageResponseTime >
      this.alertConfig.responseTimeThreshold
    ) {
      alerts.push({
        id: `response-time-high-${Date.now()}`,
        severity: AlertSeverity.ERROR,
        title: 'High Response Time',
        message: `Average response time is ${metrics.performance.requests.averageResponseTime.toFixed(2)}ms (threshold: ${this.alertConfig.responseTimeThreshold}ms)`,
        component: 'application',
        timestamp: new Date().toISOString(),
        acknowledged: false,
        metadata: {
          responseTime: metrics.performance.requests.averageResponseTime,
        },
      });
    }

    // Check error rate
    const errorRate = 100 - metrics.performance.requests.successRate;
    if (errorRate > this.alertConfig.errorRateThreshold) {
      alerts.push({
        id: `error-rate-high-${Date.now()}`,
        severity: AlertSeverity.CRITICAL,
        title: 'High Error Rate',
        message: `Error rate is ${errorRate.toFixed(2)}% (threshold: ${this.alertConfig.errorRateThreshold}%)`,
        component: 'application',
        timestamp: new Date().toISOString(),
        acknowledged: false,
        metadata: { errorRate },
      });
    }

    // Check failed jobs
    if (
      metrics.performance.queue.failedJobs >
      this.alertConfig.failedJobsThreshold
    ) {
      alerts.push({
        id: `failed-jobs-high-${Date.now()}`,
        severity: AlertSeverity.ERROR,
        title: 'High Failed Jobs Count',
        message: `Failed jobs count is ${metrics.performance.queue.failedJobs} (threshold: ${this.alertConfig.failedJobsThreshold})`,
        component: 'queue',
        timestamp: new Date().toISOString(),
        acknowledged: false,
        metadata: { failedJobs: metrics.performance.queue.failedJobs },
      });
    }

    // Store new alerts
    alerts.forEach((alert) => {
      this.alerts.set(alert.id, alert);
      this.logWarning(`Alert triggered: ${alert.title}`, alert);
    });

    // Clean up old alerts (older than 1 hour)
    this.cleanupOldAlerts();
  }

  /**
   * Clean up alerts older than 1 hour
   */
  private cleanupOldAlerts(): void {
    const oneHourAgo = Date.now() - 3600000;
    Array.from(this.alerts.entries()).forEach(([id, alert]) => {
      if (new Date(alert.timestamp).getTime() < oneHourAgo) {
        this.alerts.delete(id);
      }
    });
  }

  /**
   * Get all alerts
   *
   * @returns Array of all alerts
   */
  getAllAlerts(): Alert[] {
    return Array.from(this.alerts.values());
  }

  /**
   * Get active alerts
   *
   * @returns Array of active alerts (not acknowledged and not resolved)
   */
  getActiveAlerts(): Alert[] {
    return Array.from(this.alerts.values()).filter(
      (alert) => !alert.acknowledged && !alert.resolvedAt,
    );
  }

  /**
   * Get alert by ID
   *
   * @param alertId Alert ID
   * @returns Alert or undefined if not found
   */
  getAlert(alertId: string): Alert | undefined {
    return this.alerts.get(alertId);
  }

  /**
   * Acknowledge an alert
   *
   * @param alertId Alert ID
   * @returns True if alert was acknowledged, false if not found
   */
  acknowledgeAlert(alertId: string): boolean {
    const alert = this.alerts.get(alertId);
    if (alert) {
      alert.acknowledged = true;
      this.logInfo(`Alert acknowledged: ${alertId}`);
      return true;
    }
    return false;
  }

  /**
   * Resolve an alert
   *
   * @param alertId Alert ID
   * @returns True if alert was resolved, false if not found
   */
  resolveAlert(alertId: string): boolean {
    const alert = this.alerts.get(alertId);
    if (alert) {
      alert.resolvedAt = new Date().toISOString();
      this.logInfo(`Alert resolved: ${alertId}`);
      return true;
    }
    return false;
  }

  /**
   * Clear all alerts
   */
  clearAllAlerts(): void {
    this.alerts.clear();
    this.logInfo('All alerts cleared');
  }

  /**
   * Clear resolved alerts
   */
  clearResolvedAlerts(): void {
    Array.from(this.alerts.entries()).forEach(([id, alert]) => {
      if (alert.resolvedAt) {
        this.alerts.delete(id);
      }
    });
    this.logInfo('Resolved alerts cleared');
  }
}
