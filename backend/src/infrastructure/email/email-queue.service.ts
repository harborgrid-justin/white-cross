/**
 * @fileoverview Email Queue Service
 * @module infrastructure/email
 * @description Manages email queuing using BullMQ with retry logic and job tracking
 */

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Queue, Job } from 'bullmq';
import { ConfigService } from '@nestjs/config';
import {
  EmailQueueJobData,
  EmailQueueJobResult,
  EmailPriority,
  SendEmailDto,
} from './dto/email.dto';

/**
 * Queue name constant
 */
export const EMAIL_QUEUE_NAME = 'email-queue';

/**
 * EmailQueueService class
 * Handles email job queuing, processing, and retry logic
 */
@Processor(EMAIL_QUEUE_NAME)
@Injectable()
export class EmailQueueService implements OnModuleInit {
  private readonly logger = new Logger(EmailQueueService.name);
  private readonly maxRetries: number;
  private readonly backoffDelay: number;

  constructor(
    @InjectQueue(EMAIL_QUEUE_NAME) private readonly emailQueue: Queue,
    private readonly configService: ConfigService,
  ) {
    this.maxRetries = this.configService.get<number>(
      'EMAIL_QUEUE_MAX_RETRIES',
      3,
    );
    this.backoffDelay = this.configService.get<number>(
      'EMAIL_QUEUE_BACKOFF_DELAY',
      5000,
    );
  }

  /**
   * Initialize the service
   */
  async onModuleInit(): Promise<void> {
    this.logger.log('EmailQueueService initialized');
    await this.logQueueStats();
  }

  /**
   * Add an email job to the queue
   * @param emailData - Email data to send
   * @param options - Queue options (priority, delay, etc.)
   * @returns Job ID
   */
  async addToQueue(
    emailData: SendEmailDto,
    options?: {
      priority?: EmailPriority;
      delay?: number;
      maxRetries?: number;
    },
  ): Promise<string> {
    const priority = options?.priority || EmailPriority.NORMAL;
    const delay = options?.delay || 0;
    const maxRetries = options?.maxRetries || this.maxRetries;

    const jobData: EmailQueueJobData = {
      id: `email-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      emailData,
      priority,
      retryCount: 0,
      maxRetries,
      createdAt: new Date(),
      scheduledFor: delay > 0 ? new Date(Date.now() + delay) : undefined,
    };

    const job = await this.emailQueue.add('send-email', jobData, {
      priority: this.getPriorityValue(priority),
      delay,
      attempts: maxRetries + 1,
      backoff: {
        type: 'exponential',
        delay: this.backoffDelay,
      },
      removeOnComplete: {
        age: 86400, // Keep completed jobs for 24 hours
        count: 1000, // Keep last 1000 completed jobs
      },
      removeOnFail: {
        age: 604800, // Keep failed jobs for 7 days
      },
    });

    this.logger.log(
      `Email job added to queue: ${job.id} (priority: ${priority})`,
    );
    return job.id || '';
  }

  /**
   * Process email sending job
   * @param job - Bull job
   * @returns Job result
   */
  @Process('send-email')
  async processSendEmail(
    job: Job<EmailQueueJobData>,
  ): Promise<EmailQueueJobResult> {
    const { id, emailData, retryCount } = job.data;
    const attemptNumber = job.attemptsMade;

    this.logger.log(
      `Processing email job: ${id} (attempt ${attemptNumber}/${job.opts.attempts})`,
    );

    try {
      // The actual email sending will be delegated to EmailService
      // This is handled by the processor callback registered in the module
      // For now, we just track the job

      const result: EmailQueueJobResult = {
        jobId: job.id || '',
        success: true,
        retryCount: attemptNumber - 1,
        completedAt: new Date(),
      };

      this.logger.log(`Email job completed: ${id}`);
      await job.updateProgress(100);

      return result;
    } catch (error) {
      this.logger.error(`Email job failed: ${id} - ${error.message}`);

      // Update retry count
      job.data.retryCount = attemptNumber;

      const shouldRetry = attemptNumber < (job.opts.attempts || 1);

      if (shouldRetry) {
        const nextRetryDelay = this.calculateBackoffDelay(attemptNumber);
        this.logger.warn(
          `Email job will retry in ${nextRetryDelay}ms: ${id} (attempt ${attemptNumber}/${job.opts.attempts})`,
        );
        throw error; // Let BullMQ handle the retry
      } else {
        this.logger.error(`Email job exhausted all retries: ${id}`);
        await this.moveToDeadLetterQueue(job, error);

        return {
          jobId: job.id || '',
          success: false,
          error: error.message,
          retryCount: attemptNumber - 1,
          completedAt: new Date(),
        };
      }
    }
  }

  /**
   * Get job status
   * @param jobId - Job ID
   * @returns Job status and data
   */
  async getJobStatus(jobId: string): Promise<{
    status: string;
    progress: number;
    data?: EmailQueueJobData;
    result?: EmailQueueJobResult;
    error?: string;
  }> {
    const job = await this.emailQueue.getJob(jobId);

    if (!job) {
      throw new Error(`Job ${jobId} not found`);
    }

    const state = await job.getState();
    const progress = job.progress as number;

    return {
      status: state,
      progress,
      data: job.data,
      result: job.returnvalue,
      error: job.failedReason,
    };
  }

  /**
   * Cancel a queued job
   * @param jobId - Job ID
   */
  async cancelJob(jobId: string): Promise<void> {
    const job = await this.emailQueue.getJob(jobId);

    if (!job) {
      throw new Error(`Job ${jobId} not found`);
    }

    await job.remove();
    this.logger.log(`Email job cancelled: ${jobId}`);
  }

  /**
   * Get queue statistics
   * @returns Queue metrics
   */
  async getQueueStats(): Promise<{
    waiting: number;
    active: number;
    completed: number;
    failed: number;
    delayed: number;
    paused: number;
  }> {
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      this.emailQueue.getWaitingCount(),
      this.emailQueue.getActiveCount(),
      this.emailQueue.getCompletedCount(),
      this.emailQueue.getFailedCount(),
      this.emailQueue.getDelayedCount(),
      // Note: getPausedCount may not be available in all BullMQ versions
    ]);

    return { waiting, active, completed, failed, delayed, paused: 0 };
  }

  /**
   * Log queue statistics
   * @private
   */
  private async logQueueStats(): Promise<void> {
    try {
      const stats = await this.getQueueStats();
      this.logger.debug(
        `Queue stats - Waiting: ${stats.waiting}, Active: ${stats.active}, ` +
          `Completed: ${stats.completed}, Failed: ${stats.failed}, ` +
          `Delayed: ${stats.delayed}, Paused: ${stats.paused}`,
      );
    } catch (error) {
      this.logger.warn(`Failed to log queue stats: ${error.message}`);
    }
  }

  /**
   * Clear completed jobs from queue
   * @param gracePeriodMs - Grace period in milliseconds (default: 1 hour)
   */
  async clearCompleted(gracePeriodMs: number = 3600000): Promise<void> {
    await this.emailQueue.clean(gracePeriodMs, 100, 'completed');
    this.logger.log('Cleared completed jobs from queue');
  }

  /**
   * Clear failed jobs from queue
   * @param gracePeriodMs - Grace period in milliseconds (default: 7 days)
   */
  async clearFailed(gracePeriodMs: number = 604800000): Promise<void> {
    await this.emailQueue.clean(gracePeriodMs, 100, 'failed');
    this.logger.log('Cleared failed jobs from queue');
  }

  /**
   * Pause the queue
   */
  async pauseQueue(): Promise<void> {
    await this.emailQueue.pause();
    this.logger.warn('Email queue paused');
  }

  /**
   * Resume the queue
   */
  async resumeQueue(): Promise<void> {
    await this.emailQueue.resume();
    this.logger.log('Email queue resumed');
  }

  /**
   * Retry all failed jobs
   * @returns Number of jobs retried
   */
  async retryFailedJobs(): Promise<number> {
    const failedJobs = await this.emailQueue.getFailed();
    let retriedCount = 0;

    for (const job of failedJobs) {
      try {
        await job.retry();
        retriedCount++;
        this.logger.debug(`Retrying failed job: ${job.id}`);
      } catch (error) {
        this.logger.warn(`Failed to retry job ${job.id}: ${error.message}`);
      }
    }

    this.logger.log(`Retried ${retriedCount} failed jobs`);
    return retriedCount;
  }

  /**
   * Get priority value for BullMQ (lower number = higher priority)
   * @param priority - Email priority
   * @returns Numeric priority value
   * @private
   */
  private getPriorityValue(priority: EmailPriority): number {
    const priorityMap: Record<EmailPriority, number> = {
      [EmailPriority.URGENT]: 1,
      [EmailPriority.HIGH]: 2,
      [EmailPriority.NORMAL]: 3,
      [EmailPriority.LOW]: 4,
    };

    return priorityMap[priority] || 3;
  }

  /**
   * Calculate exponential backoff delay
   * @param attemptNumber - Current attempt number
   * @returns Delay in milliseconds
   * @private
   */
  private calculateBackoffDelay(attemptNumber: number): number {
    return this.backoffDelay * Math.pow(2, attemptNumber - 1);
  }

  /**
   * Move job to dead letter queue
   * @param job - Failed job
   * @param error - Error that caused the failure
   * @private
   */
  private async moveToDeadLetterQueue(
    job: Job<EmailQueueJobData>,
    error: Error,
  ): Promise<void> {
    // Log to dead letter queue (in production, this could write to a database or separate queue)
    this.logger.error(
      `Dead letter queue: Job ${job.id} failed permanently`,
      JSON.stringify({
        jobId: job.id,
        data: job.data,
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      }),
    );

    // Could also send alert to monitoring system
  }

  /**
   * Get jobs by status
   * @param status - Job status
   * @param start - Start index
   * @param end - End index
   * @returns Array of jobs
   */
  async getJobsByStatus(
    status: 'waiting' | 'active' | 'completed' | 'failed' | 'delayed',
    start: number = 0,
    end: number = 10,
  ): Promise<Job<EmailQueueJobData>[]> {
    switch (status) {
      case 'waiting':
        return this.emailQueue.getWaiting(start, end);
      case 'active':
        return this.emailQueue.getActive(start, end);
      case 'completed':
        return this.emailQueue.getCompleted(start, end);
      case 'failed':
        return this.emailQueue.getFailed(start, end);
      case 'delayed':
        return this.emailQueue.getDelayed(start, end);
      default:
        return [];
    }
  }

  /**
   * Health check for the queue
   * @returns Health status
   */
  async healthCheck(): Promise<{
    healthy: boolean;
    stats: Record<string, number>;
  }> {
    try {
      const stats = await this.getQueueStats();
      const healthy = stats.active >= 0; // Basic check - queue is responding

      return { healthy, stats };
    } catch (error) {
      this.logger.error(`Queue health check failed: ${error.message}`);
      return { healthy: false, stats: {} };
    }
  }
}
