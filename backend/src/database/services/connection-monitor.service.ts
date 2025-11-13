/**
 * Connection Pool Monitor Service
 * Monitors database connection pool health and performance metrics
 *
 * Features:
 * - Real-time connection pool metrics tracking
 * - Automatic health checks
 * - Alert generation for critical conditions
 * - Metrics export for monitoring systems
 */

import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';

import { BaseService } from '@/common/base';
import { BaseService } from '@/common/base';
import { LoggerService } from '@/common/logging/logger.service';
import { Inject } from '@nestjs/common';
import { BaseService } from '@/common/base';
import { LoggerService } from '@/common/logging/logger.service';
import { Inject } from '@nestjs/common';
import { BaseService } from '@/common/base';
import { LoggerService } from '@/common/logging/logger.service';
import { Inject } from '@nestjs/common';
import { BaseService } from '@/common/base';
import { LoggerService } from '@/common/logging/logger.service';
import { Inject } from '@nestjs/common';
export interface ConnectionPoolMetrics {
  active: number;
  idle: number;
  waiting: number;
  total: number;
  max: number;
  utilizationPercent: number;
  timestamp: Date;
}

export interface ConnectionHealthStatus {
  isHealthy: boolean;
  lastCheckTime: Date;
  consecutiveFailures: number;
  issues: string[];
}

@Injectable()
export class ConnectionMonitorService implements OnModuleInit, OnModuleDestroy {
  private monitoringInterval: NodeJS.Timeout | null = null;
  private healthCheckInterval: NodeJS.Timeout | null = null;

  // Configuration
  private readonly MONITORING_INTERVAL = 30000; // 30 seconds
  private readonly HEALTH_CHECK_INTERVAL = 60000; // 60 seconds
  private readonly HIGH_UTILIZATION_THRESHOLD = 0.8; // 80%
  private readonly CRITICAL_UTILIZATION_THRESHOLD = 0.95; // 95%
  private readonly HIGH_WAIT_THRESHOLD = 5;

  // Metrics storage
  private currentMetrics: ConnectionPoolMetrics | null = null;
  private healthStatus: ConnectionHealthStatus = {
    isHealthy: true,
    lastCheckTime: new Date(),
    consecutiveFailures: 0,
    issues: [],
  };

  constructor(@InjectConnection() private readonly sequelize: Sequelize) {}

  async onModuleInit(): Promise<void> {
    this.logInfo('Initializing Connection Pool Monitor');
    await this.startMonitoring();
  }

  async onModuleDestroy(): Promise<void> {
    this.logInfo('Stopping Connection Pool Monitor');
    await this.stopMonitoring();
  }

  /**
   * Start monitoring the connection pool
   */
  async startMonitoring(): Promise<void> {
    // Initial metrics collection
    await this.collectMetrics();
    await this.performHealthCheck();

    // Set up periodic monitoring
    this.monitoringInterval = setInterval(async () => {
      await this.collectMetrics();
      this.analyzeMetrics();
    }, this.MONITORING_INTERVAL);

    this.healthCheckInterval = setInterval(async () => {
      await this.performHealthCheck();
    }, this.HEALTH_CHECK_INTERVAL);

    this.logInfo('Connection pool monitoring started');
  }

  /**
   * Stop monitoring
   */
  async stopMonitoring(): Promise<void> {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }

    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }

    this.logInfo('Connection pool monitoring stopped');
  }

  /**
   * Collect current connection pool metrics
   */
  async collectMetrics(): Promise<ConnectionPoolMetrics> {
    try {
      const pool = (this.sequelize as any).connectionManager?.pool;

      if (!pool) {
        this.logWarning('Connection pool not available');
        return this.getEmptyMetrics();
      }

      const active = pool.used?.length || 0;
      const idle = pool.free?.length || 0;
      const waiting = pool.pending?.length || 0;
      const total = active + idle;
      const max = pool.options?.max || 0;
      const utilizationPercent = max > 0 ? (total / max) * 100 : 0;

      this.currentMetrics = {
        active,
        idle,
        waiting,
        total,
        max,
        utilizationPercent,
        timestamp: new Date(),
      };

      return this.currentMetrics;
    } catch (error) {
      this.logError('Failed to collect connection pool metrics', error);
      return this.getEmptyMetrics();
    }
  }

  /**
   * Analyze metrics and trigger alerts if needed
   */
  private analyzeMetrics(): void {
    if (!this.currentMetrics) {
      return;
    }

    const { active, waiting, max, utilizationPercent } = this.currentMetrics;

    // Check for high utilization
    if (utilizationPercent >= this.CRITICAL_UTILIZATION_THRESHOLD * 100) {
      this.logError(
        `CRITICAL: Connection pool utilization at ${utilizationPercent.toFixed(1)}% (${active}/${max} connections)`,
        {
          metrics: this.currentMetrics,
        },
      );
    } else if (utilizationPercent >= this.HIGH_UTILIZATION_THRESHOLD * 100) {
      this.logWarning(
        `HIGH: Connection pool utilization at ${utilizationPercent.toFixed(1)}% (${active}/${max} connections)`,
        {
          metrics: this.currentMetrics,
        },
      );
    }

    // Check for high wait queue
    if (waiting > this.HIGH_WAIT_THRESHOLD) {
      this.logWarning(
        `Connection pool wait queue is high: ${waiting} requests waiting`,
        {
          metrics: this.currentMetrics,
        },
      );
    }

    // Log metrics periodically for monitoring systems
    this.logDebug('Connection Pool Metrics', {
      active,
      idle: this.currentMetrics.idle,
      waiting,
      utilization: `${utilizationPercent.toFixed(1)}%`,
    });
  }

  /**
   * Perform database health check
   */
  async performHealthCheck(): Promise<ConnectionHealthStatus> {
    const issues: string[] = [];

    try {
      // Test database connectivity
      await this.sequelize.authenticate();

      // Reset failure counter on success
      this.healthStatus.consecutiveFailures = 0;
      this.healthStatus.isHealthy = true;
      this.healthStatus.issues = [];

      this.logDebug('Database health check passed');
    } catch (error) {
      this.healthStatus.consecutiveFailures++;
      issues.push(`Database authentication failed: ${error.message}`);

      this.logError(
        `Database health check failed (${this.healthStatus.consecutiveFailures} consecutive failures)`,
        error,
      );

      // Mark as unhealthy after 3 consecutive failures
      if (this.healthStatus.consecutiveFailures >= 3) {
        this.healthStatus.isHealthy = false;
        this.logError(
          'Database marked as UNHEALTHY after 3 consecutive failures',
        );
      }
    }

    // Check metrics for additional issues
    if (this.currentMetrics) {
      if (
        this.currentMetrics.utilizationPercent >=
        this.CRITICAL_UTILIZATION_THRESHOLD * 100
      ) {
        issues.push('Connection pool near exhaustion');
      }
      if (this.currentMetrics.waiting > this.HIGH_WAIT_THRESHOLD) {
        issues.push('High connection wait queue');
      }
    }

    this.healthStatus.lastCheckTime = new Date();
    this.healthStatus.issues = issues;

    return this.healthStatus;
  }

  /**
   * Get current metrics
   */
  getMetrics(): ConnectionPoolMetrics | null {
    return this.currentMetrics;
  }

  /**
   * Get health status
   */
  getHealthStatus(): ConnectionHealthStatus {
    return { ...this.healthStatus };
  }

  /**
   * Get metrics formatted for Prometheus/monitoring systems
   */
  getPrometheusMetrics(): string {
    if (!this.currentMetrics) {
      return '';
    }

    const { active, idle, waiting, total, max, utilizationPercent } =
      this.currentMetrics;

    return `
# HELP db_pool_active_connections Number of active database connections
# TYPE db_pool_active_connections gauge
db_pool_active_connections ${active}

# HELP db_pool_idle_connections Number of idle database connections
# TYPE db_pool_idle_connections gauge
db_pool_idle_connections ${idle}

# HELP db_pool_waiting_requests Number of requests waiting for connections
# TYPE db_pool_waiting_requests gauge
db_pool_waiting_requests ${waiting}

# HELP db_pool_total_connections Total number of database connections
# TYPE db_pool_total_connections gauge
db_pool_total_connections ${total}

# HELP db_pool_max_connections Maximum number of database connections
# TYPE db_pool_max_connections gauge
db_pool_max_connections ${max}

# HELP db_pool_utilization_percent Connection pool utilization percentage
# TYPE db_pool_utilization_percent gauge
db_pool_utilization_percent ${utilizationPercent}

# HELP db_health_status Database health status (1 = healthy, 0 = unhealthy)
# TYPE db_health_status gauge
db_health_status ${this.healthStatus.isHealthy ? 1 : 0}

# HELP db_health_consecutive_failures Number of consecutive health check failures
# TYPE db_health_consecutive_failures gauge
db_health_consecutive_failures ${this.healthStatus.consecutiveFailures}
    `.trim();
  }

  /**
   * Get empty metrics object
   */
  private getEmptyMetrics(): ConnectionPoolMetrics {
    return {
      active: 0,
      idle: 0,
      waiting: 0,
      total: 0,
      max: 0,
      utilizationPercent: 0,
      timestamp: new Date(),
    };
  }

  /**
   * Force immediate metrics collection (for testing/debugging)
   */
  async forceMetricsCollection(): Promise<ConnectionPoolMetrics> {
    const metrics = await this.collectMetrics();
    this.analyzeMetrics();
    return metrics;
  }

  /**
   * Force immediate health check (for testing/debugging)
   */
  async forceHealthCheck(): Promise<ConnectionHealthStatus> {
    return await this.performHealthCheck();
  }
}
