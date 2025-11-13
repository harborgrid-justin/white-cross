/**
 * Database Connection Pool Monitor
 * Monitors and logs database connection pool health metrics
 * HIPAA Compliance: Tracks database access patterns for audit trails
 */

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize';
import { Cron, CronExpression } from '@nestjs/schedule';

import { BaseService } from '../common/base';
import { BaseService } from '../common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { Inject } from '@nestjs/common';
import { BaseService } from '../common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { Inject } from '@nestjs/common';
import { BaseService } from '../common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { Inject } from '@nestjs/common';
import { BaseService } from '../common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { Inject } from '@nestjs/common';
export interface PoolMetrics {
  activeConnections: number;
  idleConnections: number;
  waitingRequests: number;
  totalConnections: number;
  maxConnections: number;
  utilizationPercent: number;
  timestamp: Date;
}

export interface PoolAlert {
  type:
    | 'high_utilization'
    | 'connection_wait'
    | 'pool_exhaustion'
    | 'connection_error';
  severity: 'warning' | 'critical';
  message: string;
  metrics: PoolMetrics | null;
  timestamp: Date;
}

@Injectable()
export class DatabasePoolMonitorService implements OnModuleInit {
  private metrics: PoolMetrics[] = [];
  private alerts: PoolAlert[] = [];
  private readonly MAX_METRICS_HISTORY = 100;
  private readonly MAX_ALERTS_HISTORY = 50;

  // Alert thresholds
  private readonly HIGH_UTILIZATION_THRESHOLD = 0.8; // 80%
  private readonly CRITICAL_UTILIZATION_THRESHOLD = 0.9; // 90%
  private readonly MAX_WAITING_REQUESTS = 5;

  constructor(@InjectConnection() private readonly sequelize: Sequelize) {}

  async onModuleInit() {
    this.logInfo('Database Pool Monitor initialized');
    await this.checkPoolHealth();
  }

  /**
   * Collect connection pool metrics every 30 seconds
   */
  @Cron(CronExpression.EVERY_30_SECONDS)
  async collectMetrics(): Promise<PoolMetrics | null> {
    try {
      const pool = this.getConnectionPool();

      if (!pool) {
        this.logWarning('Connection pool not available');
        return null;
      }

      const metrics: PoolMetrics = {
        activeConnections: pool.used?.length || 0,
        idleConnections: pool.free?.length || 0,
        waitingRequests: pool.pending?.length || 0,
        totalConnections: (pool.used?.length || 0) + (pool.free?.length || 0),
        maxConnections: pool.options?.max || 0,
        utilizationPercent: 0,
        timestamp: new Date(),
      };

      // Calculate utilization percentage
      if (metrics.maxConnections > 0) {
        metrics.utilizationPercent =
          (metrics.totalConnections / metrics.maxConnections) * 100;
      }

      // Store metrics
      this.metrics.push(metrics);
      if (this.metrics.length > this.MAX_METRICS_HISTORY) {
        this.metrics.shift();
      }

      // Check for alerts
      this.checkForAlerts(metrics);

      // Log metrics if utilization is high or there are waiting requests
      if (metrics.utilizationPercent > 70 || metrics.waitingRequests > 0) {
        this.logWarning('Pool Metrics:', {
          active: metrics.activeConnections,
          idle: metrics.idleConnections,
          waiting: metrics.waitingRequests,
          utilization: `${metrics.utilizationPercent.toFixed(1)}%`,
        });
      }

      return metrics;
    } catch (error) {
      this.logError('Error collecting pool metrics:', error);
      return null;
    }
  }

  /**
   * Health check for connection pool
   */
  async checkPoolHealth(): Promise<boolean> {
    try {
      await this.sequelize.authenticate();
      const metrics = await this.collectMetrics();

      if (!metrics) {
        return false;
      }

      const isHealthy =
        metrics.utilizationPercent <
          this.CRITICAL_UTILIZATION_THRESHOLD * 100 &&
        metrics.waitingRequests < this.MAX_WAITING_REQUESTS;

      if (!isHealthy) {
        this.logError('Pool health check failed:', {
          utilization: `${metrics.utilizationPercent.toFixed(1)}%`,
          waiting: metrics.waitingRequests,
        });
      } else {
        this.logDebug('Pool health check passed');
      }

      return isHealthy;
    } catch (error) {
      this.logError('Database connection health check failed:', error);

      // Record connection error alert
      this.recordAlert({
        type: 'connection_error',
        severity: 'critical',
        message: `Database connection failed: ${error.message}`,
        metrics: null,
        timestamp: new Date(),
      });

      return false;
    }
  }

  /**
   * Get current pool metrics
   */
  getCurrentMetrics(): PoolMetrics | null {
    return this.metrics[this.metrics.length - 1] || null;
  }

  /**
   * Get metrics history
   */
  getMetricsHistory(limit: number = 20): PoolMetrics[] {
    return this.metrics.slice(-limit);
  }

  /**
   * Get recent alerts
   */
  getAlerts(limit: number = 10): PoolAlert[] {
    return this.alerts.slice(-limit);
  }

  /**
   * Get pool statistics summary
   */
  getPoolStatistics() {
    if (this.metrics.length === 0) {
      return null;
    }

    const avgUtilization =
      this.metrics.reduce((sum, m) => sum + m.utilizationPercent, 0) /
      this.metrics.length;
    const maxUtilization = Math.max(
      ...this.metrics.map((m) => m.utilizationPercent),
    );
    const avgWaiting =
      this.metrics.reduce((sum, m) => sum + m.waitingRequests, 0) /
      this.metrics.length;
    const maxWaiting = Math.max(...this.metrics.map((m) => m.waitingRequests));

    return {
      current: this.getCurrentMetrics(),
      averages: {
        utilizationPercent: avgUtilization,
        waitingRequests: avgWaiting,
      },
      peaks: {
        utilizationPercent: maxUtilization,
        waitingRequests: maxWaiting,
      },
      alertCount: this.alerts.length,
      criticalAlertCount: this.alerts.filter((a) => a.severity === 'critical')
        .length,
    };
  }

  /**
   * Clear metrics and alerts history
   */
  clearHistory(): void {
    this.metrics = [];
    this.alerts = [];
    this.logInfo('Pool monitor history cleared');
  }

  // Private methods

  private getConnectionPool(): any {
    try {
      return (this.sequelize as any).connectionManager?.pool;
    } catch (error) {
      this.logError('Error accessing connection pool:', error);
      return null;
    }
  }

  private checkForAlerts(metrics: PoolMetrics): void {
    // Check for high utilization
    if (
      metrics.utilizationPercent >=
      this.CRITICAL_UTILIZATION_THRESHOLD * 100
    ) {
      this.recordAlert({
        type: 'pool_exhaustion',
        severity: 'critical',
        message: `Critical pool utilization: ${metrics.utilizationPercent.toFixed(1)}% (${metrics.totalConnections}/${metrics.maxConnections})`,
        metrics,
        timestamp: new Date(),
      });
    } else if (
      metrics.utilizationPercent >=
      this.HIGH_UTILIZATION_THRESHOLD * 100
    ) {
      this.recordAlert({
        type: 'high_utilization',
        severity: 'warning',
        message: `High pool utilization: ${metrics.utilizationPercent.toFixed(1)}% (${metrics.totalConnections}/${metrics.maxConnections})`,
        metrics,
        timestamp: new Date(),
      });
    }

    // Check for waiting requests
    if (metrics.waitingRequests > this.MAX_WAITING_REQUESTS) {
      this.recordAlert({
        type: 'connection_wait',
        severity: metrics.waitingRequests > 10 ? 'critical' : 'warning',
        message: `${metrics.waitingRequests} requests waiting for database connections`,
        metrics,
        timestamp: new Date(),
      });
    }
  }

  private recordAlert(alert: PoolAlert): void {
    this.alerts.push(alert);

    if (this.alerts.length > this.MAX_ALERTS_HISTORY) {
      this.alerts.shift();
    }

    // Log alert
    const logMethod = alert.severity === 'critical' ? 'error' : 'warn';
    this.logger[logMethod](`[${alert.type.toUpperCase()}] ${alert.message}`);
  }
}
