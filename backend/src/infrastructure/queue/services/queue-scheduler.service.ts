/**
 * @fileoverview Queue Scheduler Service
 * @module infrastructure/queue/services
 * @description Service for scheduling recurring jobs and managing scheduled tasks
 */

import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import type { Job } from 'bull';
import { QueueName, JobPriority } from '../enums';
import { QueueJobOptions } from '../interfaces';
import { BaseQueueService } from './base-queue.service';

import { BaseService } from '@/common/base';
/**
 * Scheduled job configuration
 */
interface ScheduledJobConfig {
  /**
   * Unique identifier for the scheduled job
   */
  id: string;

  /**
   * Cron expression for scheduling
   */
  cronExpression: string;

  /**
   * Queue to add the job to
   */
  queueName: QueueName;

  /**
   * Job name/type
   */
  jobName: string;

  /**
   * Job data factory function
   */
  dataFactory: () => unknown;

  /**
   * Job options
   */
  options?: QueueJobOptions;

  /**
   * Whether the job is enabled
   */
  enabled: boolean;

  /**
   * Description of what this job does
   */
  description: string;
}

/**
 * Scheduled job execution record
 */
interface ScheduledJobExecution {
  id: string;
  jobId: string;
  executedAt: Date;
  success: boolean;
  error?: string;
}

/**
 * Queue Scheduler Service
 * Manages recurring jobs and scheduled tasks across queues
 */
@Injectable()
export class QueueSchedulerService extends BaseService {
  private scheduledJobs: Map<string, ScheduledJobConfig> = new Map();
  private executionHistory: ScheduledJobExecution[] = [];
  private queueServices: BaseQueueService[] = [];

  constructor() {
    this.logInfo('Queue Scheduler Service initialized');
    this.setupDefaultScheduledJobs();
  }

  /**
   * Register a queue service for job scheduling
   */
  registerQueueService(service: BaseQueueService): void {
    this.queueServices.push(service);
    this.logInfo(`Queue service registered for scheduling: ${service.constructor.name}`);
  }

  /**
   * Register a scheduled job
   */
  registerScheduledJob(config: ScheduledJobConfig): void {
    this.scheduledJobs.set(config.id, config);
    this.logInfo(`Scheduled job registered: ${config.id} (${config.cronExpression})`);
  }

  /**
   * Remove a scheduled job
   */
  removeScheduledJob(id: string): boolean {
    const removed = this.scheduledJobs.delete(id);
    if (removed) {
      this.logInfo(`Scheduled job removed: ${id}`);
    }
    return removed;
  }

  /**
   * Enable/disable a scheduled job
   */
  setScheduledJobEnabled(id: string, enabled: boolean): boolean {
    const job = this.scheduledJobs.get(id);
    if (job) {
      job.enabled = enabled;
      this.logInfo(`Scheduled job ${id} ${enabled ? 'enabled' : 'disabled'}`);
      return true;
    }
    return false;
  }

  /**
   * Get all scheduled jobs
   */
  getScheduledJobs(): ScheduledJobConfig[] {
    return Array.from(this.scheduledJobs.values());
  }

  /**
   * Get scheduled job by ID
   */
  getScheduledJob(id: string): ScheduledJobConfig | undefined {
    return this.scheduledJobs.get(id);
  }

  /**
   * Get execution history
   */
  getExecutionHistory(limit: number = 100): ScheduledJobExecution[] {
    return this.executionHistory
      .sort((a, b) => b.executedAt.getTime() - a.executedAt.getTime())
      .slice(0, limit);
  }

  /**
   * Execute a scheduled job manually
   */
  async executeScheduledJob(id: string): Promise<Job | null> {
    const config = this.scheduledJobs.get(id);
    if (!config) {
      throw new Error(`Scheduled job not found: ${id}`);
    }

    return this.executeJob(config);
  }

  /**
   * Schedule a one-time job with delay
   */
  async scheduleDelayedJob<T>(
    queueService: BaseQueueService,
    queueName: QueueName,
    jobName: string,
    data: T,
    delayMs: number,
    options?: QueueJobOptions,
  ): Promise<Job<T>> {
    const jobOptions: QueueJobOptions = {
      ...options,
      delay: delayMs,
    };

    const job = await queueService.addJobToQueue(queueName, jobName, data, jobOptions);

    this.logInfo(
      `Delayed job scheduled: ${jobName} in queue ${queueName} (delay: ${delayMs}ms)`,
    );

    return job;
  }

  /**
   * Schedule recurring job with custom interval
   */
  async scheduleRecurringJob<T>(
    queueService: BaseQueueService,
    queueName: QueueName,
    jobName: string,
    data: T,
    intervalMs: number,
    options?: QueueJobOptions,
  ): Promise<Job<T>> {
    const jobOptions: QueueJobOptions = {
      ...options,
      repeat: {
        every: intervalMs,
      },
    };

    const job = await queueService.addJobToQueue(queueName, jobName, data, jobOptions);

    this.logInfo(
      `Recurring job scheduled: ${jobName} in queue ${queueName} (interval: ${intervalMs}ms)`,
    );

    return job;
  }

  /**
   * Setup default scheduled jobs
   */
  private setupDefaultScheduledJobs(): void {
    // Queue cleanup job (daily at 3 AM)
    this.registerScheduledJob({
      id: 'queue-cleanup',
      cronExpression: '0 3 * * *',
      queueName: QueueName.MESSAGE_CLEANUP,
      jobName: 'queue-system-cleanup',
      dataFactory: () => ({
        cleanupType: 'system',
        maxAge: 86400000 * 7, // 7 days
      }),
      options: {
        priority: JobPriority.LOW,
      },
      enabled: true,
      description: 'Daily cleanup of old completed and failed jobs',
    });

    // Index optimization job (weekly on Sunday at 4 AM)
    this.registerScheduledJob({
      id: 'index-optimization',
      cronExpression: '0 4 * * 0',
      queueName: QueueName.MESSAGE_INDEXING,
      jobName: 'optimize-indexes',
      dataFactory: () => ({
        operation: 'optimize',
        batchSize: 1000,
      }),
      options: {
        priority: JobPriority.LOW,
      },
      enabled: true,
      description: 'Weekly search index optimization',
    });

    // Message archive job (daily at 5 AM)
    this.registerScheduledJob({
      id: 'message-archive',
      cronExpression: '0 5 * * *',
      queueName: QueueName.MESSAGE_CLEANUP,
      jobName: 'archive-old-messages',
      dataFactory: () => ({
        cleanupType: 'archive',
        olderThanDays: 90,
      }),
      options: {
        priority: JobPriority.LOW,
      },
      enabled: true,
      description: 'Daily archiving of old messages',
    });

    // Notification digest job (daily at 9 AM)
    this.registerScheduledJob({
      id: 'notification-digest',
      cronExpression: '0 9 * * *',
      queueName: QueueName.MESSAGE_NOTIFICATION,
      jobName: 'send-daily-digest',
      dataFactory: () => ({
        type: 'daily_digest',
        includeUnread: true,
      }),
      options: {
        priority: JobPriority.NORMAL,
      },
      enabled: true,
      description: 'Daily notification digest for users',
    });
  }

  /**
   * Execute a scheduled job
   */
  private async executeJob(config: ScheduledJobConfig): Promise<Job | null> {
    if (!config.enabled) {
      this.logDebug(`Skipping disabled scheduled job: ${config.id}`);
      return null;
    }

    try {
      const queueService = this.findQueueServiceForQueue(config.queueName);
      if (!queueService) {
        throw new Error(`No queue service found for queue: ${config.queueName}`);
      }

      const data = config.dataFactory();
      const job = await queueService.addJobToQueue(
        config.queueName,
        config.jobName,
        data,
        config.options,
      );

      this.recordExecution({
        id: config.id,
        jobId: String(job.id),
        executedAt: new Date(),
        success: true,
      });

      this.logInfo(`Scheduled job executed: ${config.id} -> Job ${job.id}`);
      return job;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      this.recordExecution({
        id: config.id,
        jobId: 'failed',
        executedAt: new Date(),
        success: false,
        error: errorMessage,
      });

      this.logError(`Scheduled job failed: ${config.id} - ${errorMessage}`);
      return null;
    }
  }

  /**
   * Find queue service that handles a specific queue
   */
  private findQueueServiceForQueue(queueName: QueueName): BaseQueueService | null {
    for (const service of this.queueServices) {
      try {
        // Try to get queue stats - if it doesn't throw, the service handles this queue
        service.getQueueStats(queueName);
        return service;
      } catch {
        // This service doesn't handle this queue
        continue;
      }
    }
    return null;
  }

  /**
   * Record job execution
   */
  private recordExecution(execution: ScheduledJobExecution): void {
    this.executionHistory.push(execution);

    // Keep only last 1000 executions
    if (this.executionHistory.length > 1000) {
      this.executionHistory.splice(0, this.executionHistory.length - 1000);
    }
  }

  /**
   * Scheduled job runner (every minute to check for jobs to execute)
   * Note: In a real implementation, you'd use the actual cron expressions
   * This is a simplified version for demonstration
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async runScheduledJobs(): Promise<void> {
    const now = new Date();
    
    // This is a simplified implementation
    // In production, you'd use a proper cron parser to check expressions
    for (const config of this.scheduledJobs.values()) {
      if (!config.enabled) continue;

      // Simple check for hourly jobs (for demo purposes)
      if (config.cronExpression.includes('0 * * * *') && now.getMinutes() === 0) {
        await this.executeJob(config);
      }
      
      // Simple check for daily jobs at specific hours
      if (config.cronExpression.includes('0 3 * * *') && 
          now.getHours() === 3 && now.getMinutes() === 0) {
        await this.executeJob(config);
      }
      
      if (config.cronExpression.includes('0 4 * * 0') && 
          now.getDay() === 0 && now.getHours() === 4 && now.getMinutes() === 0) {
        await this.executeJob(config);
      }
      
      if (config.cronExpression.includes('0 5 * * *') && 
          now.getHours() === 5 && now.getMinutes() === 0) {
        await this.executeJob(config);
      }
      
      if (config.cronExpression.includes('0 9 * * *') && 
          now.getHours() === 9 && now.getMinutes() === 0) {
        await this.executeJob(config);
      }
    }
  }

  /**
   * Get scheduler statistics
   */
  getSchedulerStats(): {
    totalScheduledJobs: number;
    enabledJobs: number;
    disabledJobs: number;
    recentExecutions: number;
    successRate: number;
    lastExecution: Date | null;
  } {
    const jobs = Array.from(this.scheduledJobs.values());
    const enabledJobs = jobs.filter(j => j.enabled).length;
    const recentExecutions = this.executionHistory.filter(
      e => Date.now() - e.executedAt.getTime() < 86400000 // Last 24 hours
    );
    const successfulExecutions = recentExecutions.filter(e => e.success).length;
    const successRate = recentExecutions.length > 0 
      ? successfulExecutions / recentExecutions.length 
      : 0;
    
    const lastExecution = this.executionHistory.length > 0
      ? this.executionHistory.sort((a, b) => b.executedAt.getTime() - a.executedAt.getTime())[0].executedAt
      : null;

    return {
      totalScheduledJobs: jobs.length,
      enabledJobs,
      disabledJobs: jobs.length - enabledJobs,
      recentExecutions: recentExecutions.length,
      successRate,
      lastExecution,
    };
  }
}
