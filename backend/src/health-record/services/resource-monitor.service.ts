/**
 * @fileoverview Resource Monitor Service
 * @module health-record/services
 * @description Monitors resource usage and generates alerts
 *
 * HIPAA CRITICAL - This service monitors resource usage for PHI processing compliance
 *
 * @compliance HIPAA Security Rule §164.312
 */

import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PHIAccessLogger } from './phi-access-logger.service';
import { ResourceMetricsCollector, ResourceMetrics } from './resource-metrics-collector.service';

export enum ResourceAlertType {
  HIGH_MEMORY_USAGE = 'HIGH_MEMORY_USAGE',
  HIGH_CPU_USAGE = 'HIGH_CPU_USAGE',
  DATABASE_CONNECTION_POOL_EXHAUSTED = 'DATABASE_CONNECTION_POOL_EXHAUSTED',
  CACHE_HIT_RATE_LOW = 'CACHE_HIT_RATE_LOW',
  NETWORK_LATENCY_HIGH = 'NETWORK_LATENCY_HIGH',
  PHI_PROCESSING_OVERLOAD = 'PHI_PROCESSING_OVERLOAD',
  COMPLIANCE_RISK_DETECTED = 'COMPLIANCE_RISK_DETECTED',
}

export interface ResourceAlert {
  id: string;
  alertType: ResourceAlertType;
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  title: string;
  message: string;
  timestamp: Date;
  threshold: number;
  currentValue: number;
  trend: 'INCREASING' | 'DECREASING' | 'STABLE';
  acknowledged: boolean;
  resolvedAt?: Date;
  metadata: {
    resourceType: string;
    complianceImpact: boolean;
    autoRecoveryAttempted: boolean;
  };
}

@Injectable()
export class ResourceMonitor {
  private readonly logger = new Logger(ResourceMonitor.name);
  private readonly alerts = new Map<string, ResourceAlert>();
  private readonly maxHistorySize = 1000;

  private readonly thresholds = {
    memory: {
      warning: 70, // 70% memory usage
      critical: 85, // 85% memory usage
      leakSuspicion: 90, // 90% sustained usage
    },
    cpu: {
      warning: 60, // 60% CPU usage
      critical: 80, // 80% CPU usage
    },
    database: {
      connectionWarning: 80, // 80% of max connections
      connectionCritical: 95, // 95% of max connections
      slowQueryThreshold: 2000, // 2 seconds
    },
    cache: {
      hitRateWarning: 60, // 60% hit rate
      hitRateCritical: 40, // 40% hit rate
    },
    network: {
      latencyWarning: 500, // 500ms latency
      latencyCritical: 1000, // 1000ms latency
    },
  };

  constructor(
    private readonly metricsCollector: ResourceMetricsCollector,
    private readonly phiLogger: PHIAccessLogger,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Get current resource metrics
   */
  getCurrentMetrics(): ResourceMetrics {
    return this.metricsCollector.collectResourceMetrics();
  }

  /**
   * Get active alerts
   */
  getActiveAlerts(): ResourceAlert[] {
    return Array.from(this.alerts.values())
      .filter((alert) => !alert.acknowledged && !alert.resolvedAt)
      .sort(
        (a, b) =>
          this.getSeverityWeight(b.severity) -
          this.getSeverityWeight(a.severity),
      );
  }

  /**
   * Check for resource alerts
   */
  async checkForAlerts(metrics: ResourceMetrics): Promise<void> {
    const alerts: ResourceAlert[] = [];

    // Memory alerts
    if (metrics.memory.utilization > this.thresholds.memory.critical) {
      alerts.push(
        this.createAlert(
          ResourceAlertType.HIGH_MEMORY_USAGE,
          'CRITICAL',
          'Critical Memory Usage',
          `Memory usage at ${metrics.memory.utilization.toFixed(1)}% (threshold: ${this.thresholds.memory.critical}%)`,
          this.thresholds.memory.critical,
          metrics.memory.utilization,
        ),
      );
    } else if (metrics.memory.utilization > this.thresholds.memory.warning) {
      alerts.push(
        this.createAlert(
          ResourceAlertType.HIGH_MEMORY_USAGE,
          'WARNING',
          'High Memory Usage',
          `Memory usage at ${metrics.memory.utilization.toFixed(1)}% (threshold: ${this.thresholds.memory.warning}%)`,
          this.thresholds.memory.warning,
          metrics.memory.utilization,
        ),
      );
    }

    // CPU alerts
    if (metrics.cpu.usage > this.thresholds.cpu.critical) {
      alerts.push(
        this.createAlert(
          ResourceAlertType.HIGH_CPU_USAGE,
          'CRITICAL',
          'Critical CPU Usage',
          `CPU usage at ${metrics.cpu.usage.toFixed(1)}% (threshold: ${this.thresholds.cpu.critical}%)`,
          this.thresholds.cpu.critical,
          metrics.cpu.usage,
        ),
      );
    } else if (metrics.cpu.usage > this.thresholds.cpu.warning) {
      alerts.push(
        this.createAlert(
          ResourceAlertType.HIGH_CPU_USAGE,
          'WARNING',
          'High CPU Usage',
          `CPU usage at ${metrics.cpu.usage.toFixed(1)}% (threshold: ${this.thresholds.cpu.warning}%)`,
          this.thresholds.cpu.warning,
          metrics.cpu.usage,
        ),
      );
    }

    // Database alerts
    const dbUtilization = (metrics.database.activeConnections / 100) * 100; // Assuming max 100
    if (dbUtilization > this.thresholds.database.connectionCritical) {
      alerts.push(
        this.createAlert(
          ResourceAlertType.DATABASE_CONNECTION_POOL_EXHAUSTED,
          'CRITICAL',
          'Database Connection Pool Critical',
          `Database connections at ${dbUtilization.toFixed(1)}% capacity`,
          this.thresholds.database.connectionCritical,
          dbUtilization,
        ),
      );
    }

    // Cache alerts
    if (metrics.cache.hitRate < this.thresholds.cache.hitRateCritical) {
      alerts.push(
        this.createAlert(
          ResourceAlertType.CACHE_HIT_RATE_LOW,
          'CRITICAL',
          'Critical Cache Hit Rate',
          `Cache hit rate at ${metrics.cache.hitRate.toFixed(1)}% (threshold: ${this.thresholds.cache.hitRateCritical}%)`,
          this.thresholds.cache.hitRateCritical,
          metrics.cache.hitRate,
        ),
      );
    }

    // Store new alerts
    for (const alert of alerts) {
      if (!this.alerts.has(alert.id)) {
        this.alerts.set(alert.id, alert);
        await this.handleNewAlert(alert);
      }
    }
  }

  /**
   * Acknowledge alert
   */
  acknowledgeAlert(alertId: string): boolean {
    const alert = this.alerts.get(alertId);
    if (alert && !alert.acknowledged) {
      alert.acknowledged = true;
      this.logger.log(`Alert acknowledged: ${alert.title}`);
      return true;
    }
    return false;
  }

  /**
   * Resolve alert
   */
  resolveAlert(alertId: string): boolean {
    const alert = this.alerts.get(alertId);
    if (alert && !alert.resolvedAt) {
      alert.resolvedAt = new Date();
      this.logger.log(`Alert resolved: ${alert.title}`);
      return true;
    }
    return false;
  }

  /**
   * Create resource alert
   */
  private createAlert(
    alertType: ResourceAlertType,
    severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL',
    title: string,
    message: string,
    threshold: number,
    currentValue: number,
  ): ResourceAlert {
    return {
      id: this.generateAlertId(alertType),
      alertType,
      severity,
      title,
      message,
      timestamp: new Date(),
      threshold,
      currentValue,
      trend: this.calculateTrend(alertType, currentValue),
      acknowledged: false,
      metadata: {
        resourceType: alertType.split('_')[0].toLowerCase(),
        complianceImpact: this.assessComplianceImpact(alertType),
        autoRecoveryAttempted: false,
      },
    };
  }

  /**
   * Handle new alert
   */
  private async handleNewAlert(alert: ResourceAlert): Promise<void> {
    this.logger.warn(`Resource alert: ${alert.title} - ${alert.message}`);

    // Emit event for external monitoring
    this.eventEmitter.emit('resource.alert', {
      alert,
      timestamp: new Date(),
    });

    // Log security incident for compliance-impacting alerts
    if (alert.metadata.complianceImpact) {
      this.phiLogger.logSecurityIncident({
        correlationId: alert.id,
        timestamp: alert.timestamp,
        incidentType: 'RESOURCE_ALERT',
        operation: 'RESOURCE_MONITORING',
        errorMessage: alert.message,
        severity: this.mapAlertSeverityToIncidentSeverity(alert.severity),
        ipAddress: 'internal',
      });
    }
  }

  /**
   * Generate alert ID
   */
  private generateAlertId(alertType: ResourceAlertType): string {
    return `${alertType}_${Date.now()}`;
  }

  /**
   * Calculate trend (simplified)
   */
  private calculateTrend(
    alertType: ResourceAlertType,
    currentValue: number,
  ): 'INCREASING' | 'DECREASING' | 'STABLE' {
    // In a real implementation, this would compare with historical data
    return 'STABLE';
  }

  /**
   * Assess compliance impact
   */
  private assessComplianceImpact(alertType: ResourceAlertType): boolean {
    return (
      alertType === ResourceAlertType.PHI_PROCESSING_OVERLOAD ||
      alertType === ResourceAlertType.COMPLIANCE_RISK_DETECTED
    );
  }

  /**
   * Get severity weight for sorting
   */
  private getSeverityWeight(severity: string): number {
    switch (severity) {
      case 'CRITICAL':
        return 4;
      case 'ERROR':
        return 3;
      case 'WARNING':
        return 2;
      case 'INFO':
        return 1;
      default:
        return 0;
    }
  }

  /**
   * Map alert severity to incident severity
   */
  private mapAlertSeverityToIncidentSeverity(
    alertSeverity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL',
  ): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    switch (alertSeverity) {
      case 'INFO':
        return 'LOW';
      case 'WARNING':
        return 'MEDIUM';
      case 'ERROR':
        return 'HIGH';
      case 'CRITICAL':
        return 'CRITICAL';
      default:
        return 'MEDIUM';
    }
  }

  /**
   * Clean up old alerts
   */
  cleanupOldAlerts(): number {
    const cutoffDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
    let cleanedCount = 0;

    for (const [id, alert] of this.alerts.entries()) {
      if (alert.timestamp < cutoffDate && alert.resolvedAt) {
        this.alerts.delete(id);
        cleanedCount++;
      }
    }

    return cleanedCount;
  }
}