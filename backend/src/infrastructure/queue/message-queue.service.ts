/**
 * @fileoverview Message Queue Service
 * @module infrastructure/queue
 * @description Service for managing message-related queues with Bull and Redis
 */

import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue, Job } from 'bull';
import { QueueName, JobPriority } from './enums';
import { QueueConfigService, QUEUE_CONFIGS } from './queue.config';
import {
  SendMessageJobDto,
  DeliveryConfirmationJobDto,
  NotificationJobDto,
  EncryptionJobDto,
  IndexingJobDto,
  BatchMessageJobDto,
  MessageCleanupJobDto,
} from './dtos';
import {
  QueueJobOptions,
  JobResult,
  QueueMetrics,
  QueueStats,
  QueueHealth,
  FailedJobInfo,
} from './interfaces';

/**
 * Message Queue Service
 * Manages all message-related background job queues
 */
@Injectable()
export class MessageQueueService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MessageQueueService.name);

  constructor(
    @InjectQueue(QueueName.MESSAGE_DELIVERY)
    private readonly messageDeliveryQueue: Queue,

    @InjectQueue(QueueName.MESSAGE_NOTIFICATION)
    private readonly notificationQueue: Queue,

    @InjectQueue(QueueName.MESSAGE_INDEXING)
    private readonly indexingQueue: Queue,

    @InjectQueue(QueueName.MESSAGE_ENCRYPTION)
    private readonly encryptionQueue: Queue,

    @InjectQueue(QueueName.BATCH_MESSAGE_SENDING)
    private readonly batchMessageQueue: Queue,

    @InjectQueue(QueueName.MESSAGE_CLEANUP)
    private readonly cleanupQueue: Queue,

    private readonly queueConfig: QueueConfigService,
  ) {}

  async onModuleInit() {
    this.logger.log('Message Queue Service initialized');
    this.logger.log(`Redis: ${this.queueConfig.getRedisConnectionString()}`);
    this.logQueueConfigurations();
  }

  async onModuleDestroy() {
    this.logger.log('Shutting down Message Queue Service...');
    await this.closeAllQueues();
  }

  /**
   * Log queue configurations on startup
   */
  private logQueueConfigurations() {
    const configs = this.queueConfig.getAllQueueConfigs();
    Object.values(configs).forEach((config) => {
      this.logger.log(
        `Queue [${config.name}]: concurrency=${config.concurrency}, ` +
          `maxAttempts=${config.maxAttempts}, timeout=${config.timeout}ms`,
      );
    });
  }

  /**
   * Get queue instance by name
   */
  private getQueue(queueName: QueueName): Queue {
    switch (queueName) {
      case QueueName.MESSAGE_DELIVERY:
        return this.messageDeliveryQueue;
      case QueueName.MESSAGE_NOTIFICATION:
        return this.notificationQueue;
      case QueueName.MESSAGE_INDEXING:
        return this.indexingQueue;
      case QueueName.MESSAGE_ENCRYPTION:
        return this.encryptionQueue;
      case QueueName.BATCH_MESSAGE_SENDING:
        return this.batchMessageQueue;
      case QueueName.MESSAGE_CLEANUP:
        return this.cleanupQueue;
      default:
        throw new Error(`Unknown queue: ${queueName}`);
    }
  }

  /**
   * Add a message delivery job
   * @param data - Message delivery job data
   * @param options - Job options (priority, delay, etc.)
   * @returns Job instance
   */
  async addMessageDeliveryJob(
    data: SendMessageJobDto,
    options?: QueueJobOptions,
  ): Promise<Job<SendMessageJobDto>> {
    const job = await this.messageDeliveryQueue.add(
      'send-message',
      data,
      this.buildJobOptions(QueueName.MESSAGE_DELIVERY, options),
    );

    this.logger.log(
      `Message delivery job added: ${job.id} (messageId: ${data.messageId})`,
    );

    return job;
  }

  /**
   * Add a delivery confirmation job
   * @param data - Delivery confirmation job data
   * @param options - Job options
   * @returns Job instance
   */
  async addDeliveryConfirmationJob(
    data: DeliveryConfirmationJobDto,
    options?: QueueJobOptions,
  ): Promise<Job<DeliveryConfirmationJobDto>> {
    const job = await this.messageDeliveryQueue.add(
      'delivery-confirmation',
      data,
      this.buildJobOptions(QueueName.MESSAGE_DELIVERY, options),
    );

    this.logger.log(
      `Delivery confirmation job added: ${job.id} (messageId: ${data.messageId}, status: ${data.status})`,
    );

    return job;
  }

  /**
   * Add a notification job
   * @param data - Notification job data
   * @param options - Job options
   * @returns Job instance
   */
  async addNotificationJob(
    data: NotificationJobDto,
    options?: QueueJobOptions,
  ): Promise<Job<NotificationJobDto>> {
    const job = await this.notificationQueue.add(
      'send-notification',
      data,
      this.buildJobOptions(QueueName.MESSAGE_NOTIFICATION, options),
    );

    this.logger.log(
      `Notification job added: ${job.id} (type: ${data.type}, recipientId: ${data.recipientId})`,
    );

    return job;
  }

  /**
   * Add an encryption job
   * @param data - Encryption job data
   * @param options - Job options
   * @returns Job instance
   */
  async addEncryptionJob(
    data: EncryptionJobDto,
    options?: QueueJobOptions,
  ): Promise<Job<EncryptionJobDto>> {
    const job = await this.encryptionQueue.add(
      'encrypt-decrypt',
      data,
      this.buildJobOptions(QueueName.MESSAGE_ENCRYPTION, options),
    );

    this.logger.log(
      `Encryption job added: ${job.id} (operation: ${data.operation}, messageId: ${data.messageId})`,
    );

    return job;
  }

  /**
   * Add an indexing job
   * @param data - Indexing job data
   * @param options - Job options
   * @returns Job instance
   */
  async addIndexingJob(
    data: IndexingJobDto,
    options?: QueueJobOptions,
  ): Promise<Job<IndexingJobDto>> {
    const job = await this.indexingQueue.add(
      'index-message',
      data,
      this.buildJobOptions(QueueName.MESSAGE_INDEXING, options),
    );

    this.logger.log(
      `Indexing job added: ${job.id} (operation: ${data.operation}, messageId: ${data.messageId})`,
    );

    return job;
  }

  /**
   * Add a batch message job
   * @param data - Batch message job data
   * @param options - Job options
   * @returns Job instance
   */
  async addBatchMessageJob(
    data: BatchMessageJobDto,
    options?: QueueJobOptions,
  ): Promise<Job<BatchMessageJobDto>> {
    const job = await this.batchMessageQueue.add(
      'batch-send',
      data,
      this.buildJobOptions(QueueName.BATCH_MESSAGE_SENDING, options),
    );

    this.logger.log(
      `Batch message job added: ${job.id} (recipients: ${data.recipientIds.length})`,
    );

    return job;
  }

  /**
   * Add a cleanup job
   * @param data - Cleanup job data
   * @param options - Job options
   * @returns Job instance
   */
  async addCleanupJob(
    data: MessageCleanupJobDto,
    options?: QueueJobOptions,
  ): Promise<Job<MessageCleanupJobDto>> {
    const job = await this.cleanupQueue.add(
      'cleanup-messages',
      data,
      this.buildJobOptions(QueueName.MESSAGE_CLEANUP, options),
    );

    this.logger.log(
      `Cleanup job added: ${job.id} (type: ${data.cleanupType})`,
    );

    return job;
  }

  /**
   * Build job options with queue-specific defaults
   */
  private buildJobOptions(
    queueName: QueueName,
    options?: QueueJobOptions,
  ): any {
    const config = QUEUE_CONFIGS[queueName];
    const priorityOptions = options?.priority
      ? this.queueConfig.getJobOptionsForPriority(options.priority)
      : {};

    return {
      priority: options?.priority || JobPriority.NORMAL,
      delay: options?.delay || 0,
      attempts: options?.attempts || priorityOptions.attempts || config.maxAttempts,
      timeout: options?.timeout || config.timeout,
      backoff: options?.backoff || priorityOptions.backoff || {
        type: config.backoffType,
        delay: config.backoffDelay,
      },
      removeOnComplete: options?.removeOnComplete !== undefined
        ? options.removeOnComplete
        : {
            count: config.removeOnCompleteCount,
            age: config.removeOnCompleteAge,
          },
      removeOnFail: options?.removeOnFail !== undefined
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
   * Get metrics for all queues
   */
  async getQueueMetrics(): Promise<QueueMetrics> {
    const queueStats = await Promise.all(
      Object.values(QueueName).map((queueName) =>
        this.getQueueStats(queueName as QueueName),
      ),
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
    } catch (error) {
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
  async getFailedJobs(
    queueName: QueueName,
    limit: number = 100,
  ): Promise<FailedJobInfo[]> {
    const queue = this.getQueue(queueName);
    const failedJobs = await queue.getFailed(0, limit - 1);

    return failedJobs.map((job) => ({
      jobId: job.id as string,
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
  async cleanQueue(
    queueName: QueueName,
    grace: number = 86400000, // 24 hours in milliseconds
  ): Promise<void> {
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
   * Close all queues gracefully
   */
  private async closeAllQueues(): Promise<void> {
    const queues = [
      this.messageDeliveryQueue,
      this.notificationQueue,
      this.indexingQueue,
      this.encryptionQueue,
      this.batchMessageQueue,
      this.cleanupQueue,
    ];

    await Promise.all(queues.map((queue) => queue.close()));
    this.logger.log('All queues closed');
  }
}
