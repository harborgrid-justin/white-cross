/**
 * BullMQ Queue Manager
 *
 * Manages background job processing using BullMQ and Redis.
 * Replaces cron-based job system with more scalable queue-based approach.
 *
 * Features:
 * - Redis-backed job persistence
 * - Retry logic with exponential backoff
 * - Job priority and delayed jobs
 * - Comprehensive job monitoring
 * - Horizontal scalability
 *
 * @module infrastructure/jobs/QueueManager
 */

import { Queue, Worker, QueueEvents, Job } from 'bullmq';
import { getRedisClient } from '../../config/redis';
import { logger } from '../../utils/logger';
import type { RedisClientType } from 'redis';

/**
 * Job types
 */
export enum JobType {
  MEDICATION_REMINDER = 'medication-reminder',
  IMMUNIZATION_ALERT = 'immunization-alert',
  APPOINTMENT_REMINDER = 'appointment-reminder',
  INVENTORY_MAINTENANCE = 'inventory-maintenance',
  REPORT_GENERATION = 'report-generation',
  DATA_EXPORT = 'data-export',
  NOTIFICATION_BATCH = 'notification-batch',
  CLEANUP_TASK = 'cleanup-task'
}

/**
 * Job processor function type
 */
export type JobProcessor<T = any> = (job: Job<T>) => Promise<any>;

/**
 * Queue Manager class
 */
export class QueueManager {
  private queues: Map<JobType, Queue> = new Map();
  private workers: Map<JobType, Worker> = new Map();
  private queueEvents: Map<JobType, QueueEvents> = new Map();
  private processors: Map<JobType, JobProcessor> = new Map();
  private redisConnection: any = null;

  /**
   * Initialize queue manager
   */
  async initialize(): Promise<void> {
    try {
      const redisClient = getRedisClient();

      if (!redisClient) {
        logger.warn('Redis not available, queue manager will not be initialized');
        return;
      }

      // Create BullMQ connection from Redis client
      this.redisConnection = {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        password: process.env.REDIS_PASSWORD || undefined,
        maxRetriesPerRequest: null
      };

      logger.info('Queue manager initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize queue manager', error);
      throw error;
    }
  }

  /**
   * Create a queue for a specific job type
   */
  createQueue(jobType: JobType): Queue {
    if (this.queues.has(jobType)) {
      return this.queues.get(jobType)!;
    }

    const queue = new Queue(jobType, {
      connection: this.redisConnection,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000
        },
        removeOnComplete: {
          count: 100,
          age: 24 * 3600 // 24 hours
        },
        removeOnFail: {
          count: 1000,
          age: 7 * 24 * 3600 // 7 days
        }
      }
    });

    this.queues.set(jobType, queue);
    logger.info(`Queue created: ${jobType}`);

    return queue;
  }

  /**
   * Register a job processor
   */
  registerProcessor<T = any>(jobType: JobType, processor: JobProcessor<T>): void {
    this.processors.set(jobType, processor);

    // Create queue if it doesn't exist
    if (!this.queues.has(jobType)) {
      this.createQueue(jobType);
    }

    // Create worker
    const worker = new Worker(
      jobType,
      async (job: Job<T>) => {
        logger.info(`Processing job ${job.id} of type ${jobType}`, {
          data: job.data,
          attempt: job.attemptsMade + 1
        });

        try {
          const result = await processor(job);
          logger.info(`Job ${job.id} completed successfully`, { result });
          return result;
        } catch (error) {
          logger.error(`Job ${job.id} failed`, {
            error: error instanceof Error ? error.message : 'Unknown error',
            attempt: job.attemptsMade + 1
          });
          throw error;
        }
      },
      {
        connection: this.redisConnection,
        concurrency: 5,
        limiter: {
          max: 100,
          duration: 60000 // 100 jobs per minute
        }
      }
    );

    // Worker event handlers
    worker.on('completed', (job) => {
      logger.info(`Worker completed job ${job.id} of type ${jobType}`);
    });

    worker.on('failed', (job, error) => {
      logger.error(`Worker failed job ${job?.id} of type ${jobType}`, {
        error: error.message,
        attempt: job?.attemptsMade
      });
    });

    worker.on('error', (error) => {
      logger.error(`Worker error for ${jobType}:`, error);
    });

    this.workers.set(jobType, worker);

    // Create queue events listener
    const queueEvents = new QueueEvents(jobType, {
      connection: this.redisConnection
    });

    queueEvents.on('waiting', ({ jobId }) => {
      logger.debug(`Job ${jobId} is waiting in ${jobType} queue`);
    });

    queueEvents.on('active', ({ jobId }) => {
      logger.debug(`Job ${jobId} is active in ${jobType} queue`);
    });

    queueEvents.on('completed', ({ jobId, returnvalue }) => {
      logger.debug(`Job ${jobId} completed in ${jobType} queue`, { returnvalue });
    });

    queueEvents.on('failed', ({ jobId, failedReason }) => {
      logger.error(`Job ${jobId} failed in ${jobType} queue`, { failedReason });
    });

    this.queueEvents.set(jobType, queueEvents);

    logger.info(`Processor registered for ${jobType}`);
  }

  /**
   * Add a job to the queue
   */
  async addJob<T = any>(
    jobType: JobType,
    data: T,
    options?: {
      delay?: number;
      priority?: number;
      repeat?: {
        pattern?: string;
        every?: number;
      };
      jobId?: string;
    }
  ): Promise<Job<T>> {
    const queue = this.queues.get(jobType) || this.createQueue(jobType);

    const job = await queue.add(jobType, data, {
      delay: options?.delay,
      priority: options?.priority,
      repeat: options?.repeat,
      jobId: options?.jobId
    });

    logger.info(`Job added to ${jobType} queue`, {
      jobId: job.id,
      data,
      options
    });

    return job;
  }

  /**
   * Schedule repeating job (cron-like)
   */
  async scheduleJob<T = any>(
    jobType: JobType,
    data: T,
    cronPattern: string,
    jobId?: string
  ): Promise<Job<T>> {
    return this.addJob(jobType, data, {
      repeat: {
        pattern: cronPattern
      },
      jobId: jobId || `${jobType}-scheduled`
    });
  }

  /**
   * Get job by ID
   */
  async getJob(jobType: JobType, jobId: string): Promise<Job | undefined> {
    const queue = this.queues.get(jobType);
    if (!queue) {
      return undefined;
    }

    return queue.getJob(jobId);
  }

  /**
   * Get queue statistics
   */
  async getQueueStats(jobType: JobType): Promise<{
    waiting: number;
    active: number;
    completed: number;
    failed: number;
    delayed: number;
  }> {
    const queue = this.queues.get(jobType);

    if (!queue) {
      return {
        waiting: 0,
        active: 0,
        completed: 0,
        failed: 0,
        delayed: 0
      };
    }

    const [waiting, active, completed, failed, delayed] = await Promise.all([
      queue.getWaitingCount(),
      queue.getActiveCount(),
      queue.getCompletedCount(),
      queue.getFailedCount(),
      queue.getDelayedCount()
    ]);

    return {
      waiting,
      active,
      completed,
      failed,
      delayed
    };
  }

  /**
   * Get all queue statistics
   */
  async getAllQueueStats(): Promise<Record<JobType, any>> {
    const stats: Record<string, any> = {};

    for (const jobType of this.queues.keys()) {
      stats[jobType] = await this.getQueueStats(jobType);
    }

    return stats as Record<JobType, any>;
  }

  /**
   * Pause a queue
   */
  async pauseQueue(jobType: JobType): Promise<void> {
    const queue = this.queues.get(jobType);
    if (queue) {
      await queue.pause();
      logger.info(`Queue ${jobType} paused`);
    }
  }

  /**
   * Resume a queue
   */
  async resumeQueue(jobType: JobType): Promise<void> {
    const queue = this.queues.get(jobType);
    if (queue) {
      await queue.resume();
      logger.info(`Queue ${jobType} resumed`);
    }
  }

  /**
   * Clean old jobs from queue
   */
  async cleanQueue(jobType: JobType, grace: number = 24 * 3600 * 1000): Promise<void> {
    const queue = this.queues.get(jobType);
    if (queue) {
      await queue.clean(grace, 100, 'completed');
      await queue.clean(grace * 7, 100, 'failed'); // Keep failed jobs longer
      logger.info(`Queue ${jobType} cleaned`);
    }
  }

  /**
   * Gracefully shutdown queue manager
   */
  async shutdown(): Promise<void> {
    logger.info('Shutting down queue manager...');

    // Close all workers
    for (const [jobType, worker] of this.workers.entries()) {
      await worker.close();
      logger.info(`Worker closed: ${jobType}`);
    }

    // Close all queue events
    for (const [jobType, queueEvents] of this.queueEvents.entries()) {
      await queueEvents.close();
      logger.info(`Queue events closed: ${jobType}`);
    }

    // Close all queues
    for (const [jobType, queue] of this.queues.entries()) {
      await queue.close();
      logger.info(`Queue closed: ${jobType}`);
    }

    this.workers.clear();
    this.queueEvents.clear();
    this.queues.clear();
    this.processors.clear();

    logger.info('Queue manager shutdown complete');
  }
}

// Singleton instance
let queueManager: QueueManager | null = null;

/**
 * Get or create queue manager instance
 */
export function getQueueManager(): QueueManager {
  if (!queueManager) {
    queueManager = new QueueManager();
  }
  return queueManager;
}

export default getQueueManager;
