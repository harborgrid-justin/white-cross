/**
 * Administration API - Combined Monitoring Service
 *
 * Comprehensive system monitoring service that coordinates:
 * - System health monitoring
 * - Performance metrics tracking
 * - Backup management
 *
 * Provides unified access to all monitoring subsystems and
 * aggregated monitoring data.
 *
 * @module services/modules/administrationApi/monitoring/monitoringService
 */

import type { ApiClient } from '../../../core/ApiClient';
import { createApiError } from '../../../core/errors';
import type {
  SystemHealth,
  BackupLog,
  PerformanceMetric,
} from '../types';
import { SystemHealthService } from './systemHealthService';
import { MetricsService } from './metricsService';
import { BackupService } from './backupService';

/**
 * Combined System Monitoring Service
 */
export class MonitoringService {
  public readonly health: SystemHealthService;
  public readonly metrics: MetricsService;
  public readonly backups: BackupService;

  constructor(client: ApiClient) {
    this.health = new SystemHealthService(client);
    this.metrics = new MetricsService(client);
    this.backups = new BackupService(client);
  }

  /**
   * Get comprehensive system overview
   */
  async getSystemOverview(): Promise<{
    health: SystemHealth;
    recentMetrics: PerformanceMetric[];
    recentBackups: BackupLog[];
    alerts: Array<{
      type: 'warning' | 'error' | 'info';
      message: string;
      timestamp: string;
    }>;
  }> {
    try {
      const [health, metrics, backups] = await Promise.all([
        this.health.getSystemHealth(),
        this.metrics.getMetrics({ limit: 10 }),
        this.backups.getBackupLogs({ limit: 5 })
      ]);

      // Generate alerts based on system status
      const alerts: Array<{
        type: 'warning' | 'error' | 'info';
        message: string;
        timestamp: string;
      }> = [];

      if (health.status === 'down') {
        alerts.push({
          type: 'error',
          message: 'System is currently down',
          timestamp: new Date().toISOString()
        });
      } else if (health.status === 'degraded') {
        alerts.push({
          type: 'warning',
          message: 'System performance is degraded',
          timestamp: new Date().toISOString()
        });
      }

      // Check for failed services
      health.services.forEach(service => {
        if (service.status === 'down') {
          alerts.push({
            type: 'error',
            message: `Service ${service.name} is down`,
            timestamp: service.lastCheck
          });
        } else if (service.status === 'degraded') {
          alerts.push({
            type: 'warning',
            message: `Service ${service.name} is degraded`,
            timestamp: service.lastCheck
          });
        }
      });

      return {
        health,
        recentMetrics: metrics,
        recentBackups: backups.data,
        alerts
      };
    } catch (error) {
      throw createApiError(error, 'Failed to get system overview');
    }
  }

  /**
   * Perform system health check
   */
  async performHealthCheck(): Promise<{
    overall: 'healthy' | 'degraded' | 'down';
    checks: Array<{
      name: string;
      status: 'pass' | 'warn' | 'fail';
      message: string;
      duration: number;
    }>;
    timestamp: string;
  }> {
    try {
      const startTime = Date.now();

      const checks: Array<{
        name: string;
        status: 'pass' | 'warn' | 'fail';
        message: string;
        duration: number;
      }> = [];

      try {
        const checkStart = Date.now();
        const health = await this.health.getSystemHealth();
        checks.push({
          name: 'System Health',
          status: health.status === 'healthy' ? 'pass' : health.status === 'degraded' ? 'warn' : 'fail',
          message: `System is ${health.status}`,
          duration: Date.now() - checkStart
        });
      } catch (error) {
        checks.push({
          name: 'System Health',
          status: 'fail',
          message: 'Failed to check system health',
          duration: Date.now() - startTime
        });
      }

      try {
        const checkStart = Date.now();
        await this.health.checkAllServices();
        checks.push({
          name: 'Services Check',
          status: 'pass',
          message: 'All services checked successfully',
          duration: Date.now() - checkStart
        });
      } catch (error) {
        const checkStart = Date.now();
        checks.push({
          name: 'Services Check',
          status: 'fail',
          message: 'Failed to check services',
          duration: Date.now() - checkStart
        });
      }

      // Determine overall status
      const hasFailures = checks.some(check => check.status === 'fail');
      const hasWarnings = checks.some(check => check.status === 'warn');
      const overall = hasFailures ? 'down' : hasWarnings ? 'degraded' : 'healthy';

      return {
        overall,
        checks,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw createApiError(error, 'Health check failed');
    }
  }
}

/**
 * Factory function to create MonitoringService instance
 */
export function createMonitoringService(client: ApiClient): MonitoringService {
  return new MonitoringService(client);
}
