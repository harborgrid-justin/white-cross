/**
 * Monitoring Service
 *
 * Central service for performance monitoring, health checks, and alerting
 * in the White Cross healthcare platform.
 */

import { Injectable, Logger } from '@nestjs/common';
import { HealthCheckService, HealthIndicatorResult } from '@nestjs/terminus';
import { BaseService } from '@/common/base';
import {
  IAPMetricsProvider,
  MetricData,
  MetricType,
  HealthcareMetrics,
  AlertConfig,
} from './metrics.provider';

@Injectable()
export class MonitoringService extends BaseService {
  private alerts: AlertConfig[] = [];
  private activeAlerts: Map<string, { triggered: Date; config: AlertConfig }> = new Map();

  constructor(
    private readonly metricsProvider: IAPMetricsProvider,
    private readonly healthCheckService: HealthCheckService,
  ) {
    super("MonitoringService");
    // Initialize default healthcare alerts
    this.initializeDefaultAlerts();
  }

  /**
   * Record a custom metric
   */
  async recordMetric(
    name: string,
    value: number,
    type: MetricType = MetricType.COUNTER,
    labels: Record<string, string> = {},
    description?: string
  ): Promise<void> {
    const metric: MetricData = {
      name,
      type,
      value,
      labels,
      timestamp: new Date(),
      description
    };

    await this.metricsProvider.recordMetric(metric);

    // Check for alerts
    await this.checkAlerts(metric);
  }

  /**
   * Record HTTP request metrics
   */
  async recordHttpRequest(
    method: string,
    path: string,
    statusCode: number,
    duration: number,
    userId?: string
  ): Promise<void> {
    const labels = {
      method,
      path: path.replace(/\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '/:id'), // Anonymize UUIDs
      status_code: statusCode.toString(),
      user_id: userId || 'anonymous'
    };

    // Record request count
    await this.metricsProvider.incrementCounter(
      HealthcareMetrics.HTTP_REQUEST_TOTAL,
      labels
    );

    // Record request duration
    await this.metricsProvider.recordHistogram(
      HealthcareMetrics.HTTP_REQUEST_DURATION,
      duration / 1000, // Convert to seconds
      labels
    );

    // Record errors separately
    if (statusCode >= 400) {
      await this.metricsProvider.incrementCounter(
        HealthcareMetrics.HTTP_REQUEST_ERRORS,
        labels
      );
    }
  }

  /**
   * Record database query metrics
   */
  async recordDatabaseQuery(
    operation: string,
    table: string,
    duration: number,
    success: boolean = true
  ): Promise<void> {
    const labels = {
      operation,
      table,
      success: success.toString()
    };

    await this.metricsProvider.recordHistogram(
      HealthcareMetrics.DB_QUERY_DURATION,
      duration / 1000,
      labels
    );
  }

  /**
   * Record business metrics
   */
  async recordBusinessMetric(
    metric: HealthcareMetrics,
    value: number = 1,
    labels: Record<string, string> = {}
  ): Promise<void> {
    await this.metricsProvider.recordCounter(metric, value, labels);
  }

  /**
   * Record PHI access for HIPAA compliance
   */
  async recordPHIAccess(
    userId: string,
    resourceType: string,
    resourceId: string,
    action: string,
  ): Promise<void> {
    await this.metricsProvider.incrementCounter(
      HealthcareMetrics.PHI_ACCESS_TOTAL,
      {
        user_id: userId,
        resource_type: resourceType,
        resource_id: resourceId,
        action,
      },
    );

    await this.metricsProvider.incrementCounter(
      HealthcareMetrics.AUDIT_EVENTS_TOTAL,
      {
        event_type: 'phi_access',
        user_id: userId,
      },
    );
  }

  /**
   * Start a performance timer
   */
  startTimer(name: string, labels: Record<string, string> = {}): () => Promise<void> {
    return this.metricsProvider.startTimer(name, labels);
  }

  /**
   * Add custom alert configuration
   */
  addAlert(config: AlertConfig): void {
    this.alerts.push(config);
    this.logInfo(`Added alert: ${config.metric} ${config.condition} ${config.threshold}`);
  }

  /**
   * Get active alerts
   */
  getActiveAlerts(): Array<{ config: AlertConfig; triggered: Date }> {
    return Array.from(this.activeAlerts.entries()).map(([key, value]) => ({
      config: value.config,
      triggered: value.triggered
    }));
  }

  /**
   * Get system health status
   */
  async getHealthStatus(): Promise<HealthIndicatorResult> {
    return this.healthCheckService.check([
      // Add health indicators here
      // Example: () => this.databaseHealthCheck(),
      // Example: () => this.cacheHealthCheck(),
    ]);
  }

  /**
   * Get performance statistics
   */
  getPerformanceStats(): {
    uptime: number;
    memoryUsage: NodeJS.MemoryUsage;
    activeAlerts: number;
    totalMetrics: number;
  } {
    const memUsage = process.memoryUsage();

    return {
      uptime: process.uptime(),
      memoryUsage: memUsage,
      activeAlerts: this.activeAlerts.size,
      totalMetrics: 0 // Would need to get from provider
    };
  }

  /**
   * Export metrics in Prometheus format
   */
  exportMetrics(): string {
    // This would be implemented for Prometheus provider
    return '# Metrics export not implemented for current provider';
  }

  /**
   * Initialize default healthcare alerts
   */
  private initializeDefaultAlerts(): void {
    // High error rate alert
    this.addAlert({
      metric: HealthcareMetrics.HTTP_REQUEST_ERRORS,
      condition: 'gt',
      threshold: 10,
      duration: 300, // 5 minutes
      severity: 'high',
      description: 'High HTTP error rate detected'
    });

    // Slow response time alert
    this.addAlert({
      metric: HealthcareMetrics.HTTP_REQUEST_DURATION,
      condition: 'gt',
      threshold: 5, // 5 seconds
      duration: 60, // 1 minute
      severity: 'medium',
      description: 'Slow response times detected'
    });

    // High PHI access alert
    this.addAlert({
      metric: HealthcareMetrics.PHI_ACCESS_TOTAL,
      condition: 'gt',
      threshold: 100,
      duration: 3600, // 1 hour
      severity: 'medium',
      description: 'High PHI access rate detected'
    });

    // Database connection issues
    this.addAlert({
      metric: HealthcareMetrics.DB_CONNECTION_ACTIVE,
      condition: 'gt',
      threshold: 50, // 50 active connections
      duration: 300,
      severity: 'high',
      description: 'High database connection usage'
    });
  }

  /**
   * Check alerts against metric data
   */
  private async checkAlerts(metric: MetricData): Promise<void> {
    for (const alert of this.alerts) {
      if (alert.metric !== metric.name) continue;

      const shouldTrigger = this.evaluateCondition(
        metric.value,
        alert.condition,
        alert.threshold
      );

      if (shouldTrigger) {
        const alertKey = `${alert.metric}:${alert.condition}:${alert.threshold}`;

        if (!this.activeAlerts.has(alertKey)) {
          // New alert
          this.activeAlerts.set(alertKey, {
            config: alert,
            triggered: new Date()
          });

          this.logWarning(`Alert triggered: ${alert.description}`, {
            metric: alert.metric,
            value: metric.value,
            threshold: alert.threshold,
            severity: alert.severity
          });

          // In a real implementation, this would send notifications
          // await this.sendAlertNotification(alert);
        }
      } else {
        // Clear resolved alerts
        const alertKey = `${alert.metric}:${alert.condition}:${alert.threshold}`;
        if (this.activeAlerts.has(alertKey)) {
          this.activeAlerts.delete(alertKey);
          this.logInfo(`Alert resolved: ${alert.description}`);
        }
      }
    }
  }

  /**
   * Evaluate alert condition
   */
  private evaluateCondition(value: number, condition: string, threshold: number): boolean {
    switch (condition) {
      case 'gt': return value > threshold;
      case 'lt': return value < threshold;
      case 'eq': return value === threshold;
      case 'ne': return value !== threshold;
      default: return false;
    }
  }
}