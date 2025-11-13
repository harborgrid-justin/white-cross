/**
 * @fileoverview Queue Monitoring Service
 * @module infrastructure/queue/services
 * @description Service for monitoring queue health and performance across all queues
 */

import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { QueueName } from '../enums';
import { QueueHealth, QueueMetrics, FailedJobInfo } from '../interfaces';
import { BaseQueueService } from './base-queue.service';

import { BaseService } from '@/common/base';
/**
 * Alert configuration
 */
interface AlertConfig {
  /**
   * Maximum failure rate before alerting (0.0 to 1.0)
   */
  maxFailureRate: number;

  /**
   * Maximum number of waiting jobs before alerting
   */
  maxWaitingJobs: number;

  /**
   * Maximum number of failed jobs before alerting
   */
  maxFailedJobs: number;

  /**
   * Maximum queue processing time in minutes
   */
  maxProcessingTimeMinutes: number;
}

/**
 * Queue health summary
 */
interface QueueHealthSummary {
  totalQueues: number;
  healthyQueues: number;
  degradedQueues: number;
  unhealthyQueues: number;
  overallStatus: 'healthy' | 'degraded' | 'unhealthy';
  checkedAt: Date;
}

/**
 * Queue Monitoring Service
 * Provides comprehensive monitoring and alerting for queue systems
 */
@Injectable()
export class QueueMonitoringService extends BaseService {
  private readonly alertConfig: AlertConfig = {
    maxFailureRate: 0.15, // 15%
    maxWaitingJobs: 1000,
    maxFailedJobs: 500,
    maxProcessingTimeMinutes: 30,
  };

  private queueServices: BaseQueueService[] = [];
  private lastHealthCheck: Date | null = null;
  private healthHistory: Map<string, QueueHealth[]> = new Map();

  constructor() {
    this.logInfo('Queue Monitoring Service initialized');
  }

  /**
   * Register a queue service for monitoring
   */
  registerQueueService(service: BaseQueueService): void {
    this.queueServices.push(service);
    this.logInfo(`Queue service registered: ${service.constructor.name}`);
  }

  /**
   * Get health status for all queues across all services
   */
  async getOverallHealth(): Promise<QueueHealthSummary> {
    const allHealthChecks: QueueHealth[] = [];

    for (const service of this.queueServices) {
      const metrics = await service.getQueueMetrics();
      for (const queueName of Object.keys(metrics.queues) as QueueName[]) {
        const health = await service.getQueueHealth(queueName);
        allHealthChecks.push(health);
        this.recordHealthHistory(queueName, health);
      }
    }

    const healthyCount = allHealthChecks.filter((h) => h.status === 'healthy').length;
    const degradedCount = allHealthChecks.filter((h) => h.status === 'degraded').length;
    const unhealthyCount = allHealthChecks.filter((h) => h.status === 'unhealthy').length;

    let overallStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    if (unhealthyCount > 0) {
      overallStatus = 'unhealthy';
    } else if (degradedCount > 0) {
      overallStatus = 'degraded';
    }

    this.lastHealthCheck = new Date();

    return {
      totalQueues: allHealthChecks.length,
      healthyQueues: healthyCount,
      degradedQueues: degradedCount,
      unhealthyQueues: unhealthyCount,
      overallStatus,
      checkedAt: this.lastHealthCheck,
    };
  }

  /**
   * Get comprehensive metrics for all queues
   */
  async getComprehensiveMetrics(): Promise<{
    services: Record<string, QueueMetrics>;
    summary: {
      totalJobs: {
        waiting: number;
        active: number;
        completed: number;
        failed: number;
        delayed: number;
        paused: number;
      };
      averageFailureRate: number;
      servicesCount: number;
      queuesCount: number;
    };
    timestamp: Date;
  }> {
    const serviceMetrics: Record<string, QueueMetrics> = {};
    let totalQueues = 0;
    const totalJobs = {
      waiting: 0,
      active: 0,
      completed: 0,
      failed: 0,
      delayed: 0,
      paused: 0,
    };

    for (const service of this.queueServices) {
      const metrics = await service.getQueueMetrics();
      serviceMetrics[service.constructor.name] = metrics;

      totalQueues += Object.keys(metrics.queues).length;
      totalJobs.waiting += metrics.totals.waiting;
      totalJobs.active += metrics.totals.active;
      totalJobs.completed += metrics.totals.completed;
      totalJobs.failed += metrics.totals.failed;
      totalJobs.delayed += metrics.totals.delayed;
      totalJobs.paused += metrics.totals.paused;
    }

    const totalProcessed = totalJobs.completed + totalJobs.failed;
    const averageFailureRate = totalProcessed > 0 ? totalJobs.failed / totalProcessed : 0;

    return {
      services: serviceMetrics,
      summary: {
        totalJobs,
        averageFailureRate,
        servicesCount: this.queueServices.length,
        queuesCount: totalQueues,
      },
      timestamp: new Date(),
    };
  }

  /**
   * Get failed jobs across all queues
   */
  async getAllFailedJobs(limit: number = 500): Promise<FailedJobInfo[]> {
    const allFailedJobs: FailedJobInfo[] = [];

    for (const service of this.queueServices) {
      const metrics = await service.getQueueMetrics();
      for (const queueName of Object.keys(metrics.queues) as QueueName[]) {
        const failedJobs = await service.getFailedJobs(queueName, Math.min(limit, 100));
        allFailedJobs.push(...failedJobs);
      }
    }

    // Sort by failure time (most recent first) and limit
    return allFailedJobs
      .sort((a, b) => b.failedAt.getTime() - a.failedAt.getTime())
      .slice(0, limit);
  }

  /**
   * Get health history for a specific queue
   */
  getHealthHistory(queueName: QueueName, limit: number = 100): QueueHealth[] {
    const history = this.healthHistory.get(queueName) || [];
    return history.slice(-limit);
  }

  /**
   * Check if any alerts should be triggered
   */
  async checkAlerts(): Promise<{
    alerts: Array<{
      type: 'high_failure_rate' | 'too_many_waiting' | 'too_many_failed' | 'queue_unhealthy';
      queueName: QueueName;
      serviceName: string;
      message: string;
      severity: 'warning' | 'critical';
      value: number;
      threshold: number;
    }>;
    alertsTriggered: boolean;
  }> {
    const alerts: Array<{
      type: 'high_failure_rate' | 'too_many_waiting' | 'too_many_failed' | 'queue_unhealthy';
      queueName: QueueName;
      serviceName: string;
      message: string;
      severity: 'warning' | 'critical';
      value: number;
      threshold: number;
    }> = [];

    for (const service of this.queueServices) {
      const metrics = await service.getQueueMetrics();
      const serviceName = service.constructor.name;

      for (const [queueName, stats] of Object.entries(metrics.queues)) {
        const queueNameTyped = queueName as QueueName;
        const health = await service.getQueueHealth(queueNameTyped);

        // Check failure rate
        if (health.failureRate > this.alertConfig.maxFailureRate) {
          alerts.push({
            type: 'high_failure_rate',
            queueName: queueNameTyped,
            serviceName,
            message: `High failure rate: ${(health.failureRate * 100).toFixed(1)}%`,
            severity: health.failureRate > 0.3 ? 'critical' : 'warning',
            value: health.failureRate,
            threshold: this.alertConfig.maxFailureRate,
          });
        }

        // Check waiting jobs
        if (stats.waiting > this.alertConfig.maxWaitingJobs) {
          alerts.push({
            type: 'too_many_waiting',
            queueName: queueNameTyped,
            serviceName,
            message: `Too many waiting jobs: ${stats.waiting}`,
            severity: stats.waiting > this.alertConfig.maxWaitingJobs * 2 ? 'critical' : 'warning',
            value: stats.waiting,
            threshold: this.alertConfig.maxWaitingJobs,
          });
        }

        // Check failed jobs
        if (stats.failed > this.alertConfig.maxFailedJobs) {
          alerts.push({
            type: 'too_many_failed',
            queueName: queueNameTyped,
            serviceName,
            message: `Too many failed jobs: ${stats.failed}`,
            severity: stats.failed > this.alertConfig.maxFailedJobs * 2 ? 'critical' : 'warning',
            value: stats.failed,
            threshold: this.alertConfig.maxFailedJobs,
          });
        }

        // Check overall health
        if (health.status === 'unhealthy') {
          alerts.push({
            type: 'queue_unhealthy',
            queueName: queueNameTyped,
            serviceName,
            message: `Queue is unhealthy`,
            severity: 'critical',
            value: 1,
            threshold: 0,
          });
        }
      }
    }

    return {
      alerts,
      alertsTriggered: alerts.length > 0,
    };
  }

  /**
   * Clean old jobs across all queues
   */
  async cleanAllQueues(grace: number = 86400000): Promise<void> {
    this.logInfo('Starting cleanup of all queues...');

    for (const service of this.queueServices) {
      const metrics = await service.getQueueMetrics();
      for (const queueName of Object.keys(metrics.queues) as QueueName[]) {
        try {
          await service.cleanQueue(queueName, grace);
        } catch (error) {
          this.logError(
            `Failed to clean queue ${queueName}: ${error instanceof Error ? error.message : String(error)}`,
          );
        }
      }
    }

    this.logInfo('Queue cleanup completed');
  }

  /**
   * Record health history for a queue
   */
  private recordHealthHistory(queueName: QueueName, health: QueueHealth): void {
    if (!this.healthHistory.has(queueName)) {
      this.healthHistory.set(queueName, []);
    }

    const history = this.healthHistory.get(queueName)!;
    history.push(health);

    // Keep only last 1000 entries
    if (history.length > 1000) {
      history.splice(0, history.length - 1000);
    }
  }

  /**
   * Scheduled health check (every 5 minutes)
   */
  @Cron(CronExpression.EVERY_5_MINUTES)
  async scheduledHealthCheck(): Promise<void> {
    try {
      this.logDebug('Running scheduled health check...');
      
      const healthSummary = await this.getOverallHealth();
      const alerts = await this.checkAlerts();

      if (healthSummary.overallStatus !== 'healthy') {
        this.logWarning(
          `Queue health status: ${healthSummary.overallStatus} ` +
          `(${healthSummary.unhealthyQueues} unhealthy, ${healthSummary.degradedQueues} degraded)`,
        );
      }

      if (alerts.alertsTriggered) {
        this.logWarning(`${alerts.alerts.length} queue alerts triggered`);
        
        const criticalAlerts = alerts.alerts.filter((a) => a.severity === 'critical');
        if (criticalAlerts.length > 0) {
          this.logError(`${criticalAlerts.length} critical queue alerts!`);
        }
      }
    } catch (error) {
      this.logError(
        `Scheduled health check failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Scheduled cleanup (daily at 2 AM)
   */
  @Cron('0 2 * * *')
  async scheduledCleanup(): Promise<void> {
    try {
      await this.cleanAllQueues();
    } catch (error) {
      this.logError(
        `Scheduled cleanup failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Get service information
   */
  getServiceInfo(): {
    registeredServices: string[];
    lastHealthCheck: Date | null;
    alertConfig: AlertConfig;
  } {
    return {
      registeredServices: this.queueServices.map((s) => s.constructor.name),
      lastHealthCheck: this.lastHealthCheck,
      alertConfig: this.alertConfig,
    };
  }
}
