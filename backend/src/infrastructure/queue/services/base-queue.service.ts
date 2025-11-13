/**
 * @fileoverview Base Queue Service
 * @module infrastructure/queue/services
 * @description Generic base service for queue operations with common functionality
 */

import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import type { Job, Queue } from 'bull';
import { JobPriority, QueueName } from '../enums';
import { QueueConfigService } from '../queue.config';
import {
  FailedJobInfo,
  QueueHealth,
  QueueJobOptions,
  QueueMetrics,
  QueueStats,
} from '../interfaces';

/**
 * Base Queue Service
 * Provides common queue management functionality that can be extended by specific queue services
 */
@Injectable()
export abstract class BaseQueueService implements OnModuleInit, OnModuleDestroy {
  protected readonly logger: Logger;
  protected readonly queues: Map<QueueName, Queue> = new Map();

  constructor(
    protected readonly queueConfig: QueueConfigService,
    serviceName: string,
  ) {
    this.logger = new Logger(serviceName);
  }

  onModuleInit(): void {
    this.logger.log(`${this.constructor.name} initialized`);
    this.logger.log(`Redis: ${this.queueConfig.getRedisConnectionString()}`);
    this.logQueueConfigurations();
  }

  async onModuleDestroy() {
    this.logger.log(`Shutting down ${this.constructor.name}...`);
    await this.closeAllQueues();
  }

  /**
   * Register a queue instance with the service
   */
  protected registerQueue(queueName: QueueName, queue: Queue): void {
    this.queues.set(queueName, queue);
  }

  /**
   * Get queue instance by name
   */
  protected getQueue(queueName: QueueName): Queue {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Queue ${queueName} not registered`);
    }
    return queue;
  }

  /**
   * Get all registered queue names
   */
  protected getRegisteredQueueNames(): QueueName[] {
    return Array.from(this.queues.keys());
  }

  /**
   * Log queue configurations on startup
   */
  private logQueueConfigurations(): void {
    const configs = this.queueConfig.getAllQueueConfigs();
    this.getRegisteredQueueNames().forEach((queueName) => {
      const config = configs[queueName];
      if (config) {
        this.logger.log(
          `Queue [${config.name}]: concurrency=${config.concurrency}, ` +
            `maxAttempts=${config.maxAttempts}, timeout=${config.timeout}ms`,
        );
      }
    });
  }

  /**
   * Add a job to a specific queue with common options handling
   */
  protected async addJobToQueue<T>(
    queueName: QueueName,
    jobName: string,
    data: T,
    options?: QueueJobOptions,
  ): Promise<Job<T>> {
    const queue = this.getQueue(queueName);
    const jobOptions = this.buildJobOptions(queueName, options);

    const job = await queue.add(jobName, data, jobOptions);

    this.logger.log(
      `Job added to ${queueName}: ${job.id} (${jobName}) - Priority: ${jobOptions.priority as number}`,
    );

    return job;
  }

  /**
   * Add multiple jobs to a queue in batch
   */
  protected async addBatchJobsToQueue<T>(
    queueName: QueueName,
    jobs: Array<{ name: string; data: T; options?: QueueJobOptions }>,
  ): Promise<Job<T>[]> {
    const queue = this.getQueue(queueName);

    const bullJobs = jobs.map(({ name, data, options }) => ({
      name,
      data,
      opts: this.buildJobOptions(queueName, options),
    }));

    const createdJobs = await queue.addBulk(bullJobs);

    this.logger.log(`Batch jobs added to ${queueName}: ${createdJobs.length} jobs`);

    return createdJobs;
  }

  /**
   * Build job options with queue-specific defaults and priority handling
   */
  private buildJobOptions(
    queueName: QueueName,
    options?: QueueJobOptions,
  ): Record<string, unknown> {
    const config = this.queueConfig.getQueueConfig(queueName);
    const priorityOptions = options?.priority
      ? this.queueConfig.getJobOptionsForPriority(options.priority)
      : { attempts: undefined, backoff: undefined };

    return {
      priority: options?.priority || JobPriority.NORMAL,
      delay: options?.delay || 0,
      attempts:
        options?.attempts ||
        (priorityOptions as { attempts?: number }).attempts ||
        config.maxAttempts,
      timeout: options?.timeout || config.timeout,
      backoff:
        options?.backoff ||
        (priorityOptions as { backoff?: { type: string; delay: number } }).backoff || {
          type: config.backoffType,
          delay: config.backoffDelay,
        },
      removeOnComplete:
        options?.removeOnComplete !== undefined
          ? options.removeOnComplete
          : {
              count: config.removeOnCompleteCount,
              age: config.removeOnCompleteAge,
            },
      removeOnFail:
        options?.removeOnFail !== undefined
          ? options.removeOnFail
          : {
              count: config.removeOnFailCount,
              age: config.removeOnFailAge,
            },
      repeat: options?.repeat,
    };
  }

  /**
   * Get statistics for a specific queue
   */
  async getQueueStats(queueName: QueueName): Promise<QueueStats> {
    const queue = this.getQueue(queueName);

    const [waiting, active, completed, failed, delayed, paused] = await Promise.all([
      queue.getWaitingCount(),
      queue.getActiveCount(),
      queue.getCompletedCount(),
      queue.getFailedCount(),
      queue.getDelayedCount(),
      queue.getPausedCount(),
    ]);

    return {
      name: queueName,
      waiting,
      active,
      completed,
      failed,
      delayed,
      paused,
    };
  }

  /**
   * Get metrics for all registered queues
   */
  async getQueueMetrics(): Promise<QueueMetrics> {
    const queueStats = await Promise.all(
      this.getRegisteredQueueNames().map((queueName) => this.getQueueStats(queueName)),
    );

    const queues = queueStats.reduce(
      (acc, stats) => {
        acc[stats.name] = stats;
        return acc;
      },
      {} as Record<QueueName, QueueStats>,
    );

    const totals = queueStats.reduce(
      (acc, stats) => ({
        waiting: acc.waiting + stats.waiting,
        active: acc.active + stats.active,
        completed: acc.completed + stats.completed,
        failed: acc.failed + stats.failed,
        delayed: acc.delayed + stats.delayed,
        paused: acc.paused + stats.paused,
      }),
      { waiting: 0, active: 0, completed: 0, failed: 0, delayed: 0, paused: 0 },
    );

    return {
      queues,
      totals,
      timestamp: new Date(),
    };
  }

  /**
   * Get health status for a queue
   */
  async getQueueHealth(queueName: QueueName): Promise<QueueHealth> {
    const queue = this.getQueue(queueName);
    const stats = await this.getQueueStats(queueName);

    // Calculate failure rate
    const totalProcessed = stats.completed + stats.failed;
    const failureRate = totalProcessed > 0 ? stats.failed / totalProcessed : 0;
    const highFailureRate = failureRate > 0.1; // More than 10% failure rate

    // Check Redis connection
    let redisConnected = true;
    try {
      await queue.client.ping();
    } catch {
      redisConnected = false;
    }

    // Determine overall status
    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    if (!redisConnected || highFailureRate) {
      status = 'unhealthy';
    } else if (stats.failed > 100 || stats.waiting > 1000) {
      status = 'degraded';
    }

    return {
      name: queueName,
      status,
      checks: {
        redis: redisConnected,
        accepting: stats.paused === 0,
        processing: stats.active > 0 || stats.waiting === 0,
        highFailureRate,
      },
      failureRate,
      checkedAt: new Date(),
    };
  }

  /**
   * Get failed jobs from a queue
   */
  async getFailedJobs(queueName: QueueName, limit: number = 100): Promise<FailedJobInfo[]> {
    const queue = this.getQueue(queueName);
    const failedJobs = await queue.getFailed(0, limit - 1);

    return failedJobs.map((job) => ({
      jobId: String(job.id || 'unknown'),
      queueName,
      data: job.data,
      error: {
        message: job.failedReason || 'Unknown error',
        stack: job.stacktrace?.join('\n'),
      },
      attempts: job.attemptsMade,
      failedAt: new Date(job.finishedOn || Date.now()),
      createdAt: new Date(job.timestamp),
    }));
  }

  /**
   * Pause a queue
   */
  async pauseQueue(queueName: QueueName): Promise<void> {
    const queue = this.getQueue(queueName);
    await queue.pause();
    this.logger.warn(`Queue paused: ${queueName}`);
  }

  /**
   * Resume a queue
   */
  async resumeQueue(queueName: QueueName): Promise<void> {
    const queue = this.getQueue(queueName);
    await queue.resume();
    this.logger.log(`Queue resumed: ${queueName}`);
  }

  /**
   * Clean old jobs from a queue
   */
  async cleanQueue(queueName: QueueName, grace: number = 86400000): Promise<void> {
    const queue = this.getQueue(queueName);
    await queue.clean(grace, 'completed');
    await queue.clean(grace * 7, 'failed'); // Keep failed jobs longer
    this.logger.log(`Queue cleaned: ${queueName}`);
  }

  /**
   * Retry a failed job
   */
  async retryFailedJob(queueName: QueueName, jobId: string): Promise<void> {
    const queue = this.getQueue(queueName);
    const job = await queue.getJob(jobId);

    if (!job) {
      throw new Error(`Job ${jobId} not found in queue ${queueName}`);
    }

    await job.retry();
    this.logger.log(`Job retried: ${jobId} in queue ${queueName}`);
  }

  /**
   * Remove a job from a queue
   */
  async removeJob(queueName: QueueName, jobId: string): Promise<void> {
    const queue = this.getQueue(queueName);
    const job = await queue.getJob(jobId);

    if (!job) {
      throw new Error(`Job ${jobId} not found in queue ${queueName}`);
    }

    await job.remove();
    this.logger.log(`Job removed: ${jobId} from queue ${queueName}`);
  }

  /**
   * Get job by ID
   */
  async getJob(queueName: QueueName, jobId: string): Promise<Job | null> {
    const queue = this.getQueue(queueName);
    return queue.getJob(jobId);
  }

  /**
   * Get jobs by status
   */
  async getJobsByStatus(
    queueName: QueueName,
    status: 'waiting' | 'active' | 'completed' | 'failed' | 'delayed',
    start: number = 0,
    end: number = 99,
  ): Promise<Job[]> {
    const queue = this.getQueue(queueName);

    switch (status) {
      case 'waiting':
        return queue.getWaiting(start, end);
      case 'active':
        return queue.getActive(start, end);
      case 'completed':
        return queue.getCompleted(start, end);
      case 'failed':
        return queue.getFailed(start, end);
      case 'delayed':
        return queue.getDelayed(start, end);
      default:
        throw new Error(`Unknown job status: ${status as string}`);
    }
  }

  /**
   * Close all queues gracefully
   */
  private async closeAllQueues(): Promise<void> {
    const closePromises = Array.from(this.queues.values()).map((queue) => queue.close());
    await Promise.all(closePromises);
    this.logger.log('All queues closed');
  }
}
