/**
 * Queue Manager Service
 *
 * NestJS service for managing BullMQ job queues
 * Migrated from backend/src/infrastructure/jobs/QueueManager.ts
 *
 * Features:
 * - Redis-backed job persistence
 * - Retry logic with exponential backoff
 * - Job priority and delayed jobs
 * - Comprehensive job monitoring
 * - Horizontal scalability
 */
import { Injectable, OnModuleDestroy, OnModuleInit, Inject } from '@nestjs/common';
import { BaseService } from '../../shared/base/BaseService';
import { LoggerService } from '../../shared/logging/logger.service';
import { ConfigService } from '@nestjs/config';
import { Job, Queue } from 'bullmq';
import { JobType } from '@/infrastructure/jobs';

import { BaseService } from '../../common/base';
import { BaseService } from '../../common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { Inject } from '@nestjs/common';
import { BaseService } from '../../common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { Inject } from '@nestjs/common';
import { BaseService } from '../../common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { Inject } from '@nestjs/common';
import { BaseService } from '../../common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { Inject } from '@nestjs/common';
export interface JobOptions {
  delay?: number;
  priority?: number;
  repeat?: {
    pattern?: string;
    every?: number;
  };
  jobId?: string;
}

export interface QueueStats {
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
}

@Injectable()
export class QueueManagerService implements OnModuleInit, OnModuleDestroy {
  private queues: Map<JobType, Queue> = new Map();

  constructor(
    @Inject(LoggerService) logger: LoggerService,
    private readonly configService: ConfigService
  ) {
    super({
      serviceName: 'QueueManagerService',
      logger,
      enableAuditLogging: true,
    });
  }

  async onModuleInit() {
    try {
      const redisHost = this.configService.get<string>(
        'REDIS_HOST',
        'localhost',
      );
      const redisPort = this.configService.get<number>('REDIS_PORT', 6379);
      const redisPassword = this.configService.get<string>('REDIS_PASSWORD');

      this.logInfo(
        `Queue manager initialized with Redis at ${redisHost}:${redisPort}`,
      );

      // Initialize scheduled jobs
      await this.initializeScheduledJobs();
    } catch (error) {
      this.logError('Failed to initialize queue manager', error);
      throw error;
    }
  }

  /**
   * Initialize scheduled jobs with cron patterns
   */
  private async initializeScheduledJobs() {
    try {
      // Schedule medication reminders job (midnight and 6am daily)
      await this.scheduleJob(
        JobType.MEDICATION_REMINDER,
        {},
        '0 0,6 * * *',
        'medication-reminder-scheduled',
      );
      this.logInfo('Medication reminders job scheduled (0 0,6 * * *)');

      // Schedule inventory maintenance job (every 15 minutes)
      await this.scheduleJob(
        JobType.INVENTORY_MAINTENANCE,
        {},
        '*/15 * * * *',
        'inventory-maintenance-scheduled',
      );
      this.logInfo('Inventory maintenance job scheduled (*/15 * * * *)');

      this.logInfo('All scheduled jobs initialized successfully');
    } catch (error) {
      this.logError('Failed to initialize scheduled jobs', error);
    }
  }

  async onModuleDestroy() {
    await this.shutdown();
  }

  /**
   * Get or create a queue for a specific job type
   */
  getQueue(jobType: JobType): Queue {
    if (this.queues.has(jobType)) {
      return this.queues.get(jobType)!;
    }

    const redisConfig = {
      host: this.configService.get<string>('REDIS_HOST', 'localhost'),
      port: this.configService.get<number>('REDIS_PORT', 6379),
      password: this.configService.get<string>('REDIS_PASSWORD'),
      maxRetriesPerRequest: null,
    };

    const queue = new Queue(jobType, {
      connection: redisConfig,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: {
          count: 100,
          age: 24 * 3600, // 24 hours
        },
        removeOnFail: {
          count: 1000,
          age: 7 * 24 * 3600, // 7 days
        },
      },
    });

    this.queues.set(jobType, queue);
    this.logInfo(`Queue created: ${jobType}`);

    return queue;
  }

  /**
   * Add a job to the queue
   */
  async addJob<T = any>(
    jobType: JobType,
    data: T,
    options?: JobOptions,
  ): Promise<Job<T>> {
    const queue = this.getQueue(jobType);

    const job = await queue.add(jobType, data, {
      delay: options?.delay,
      priority: options?.priority,
      repeat: options?.repeat,
      jobId: options?.jobId,
    });

    this.logInfo(`Job added to ${jobType} queue`, {
      jobId: job.id,
      options,
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
    jobId?: string,
  ): Promise<Job<T>> {
    return this.addJob(jobType, data, {
      repeat: {
        pattern: cronPattern,
      },
      jobId: jobId || `${jobType}-scheduled`,
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
  async getQueueStats(jobType: JobType): Promise<QueueStats> {
    const queue = this.queues.get(jobType);

    if (!queue) {
      return {
        waiting: 0,
        active: 0,
        completed: 0,
        failed: 0,
        delayed: 0,
      };
    }

    const [waiting, active, completed, failed, delayed] = await Promise.all([
      queue.getWaitingCount(),
      queue.getActiveCount(),
      queue.getCompletedCount(),
      queue.getFailedCount(),
      queue.getDelayedCount(),
    ]);

    return {
      waiting,
      active,
      completed,
      failed,
      delayed,
    };
  }

  /**
   * Get all queue statistics
   */
  async getAllQueueStats(): Promise<Record<JobType, QueueStats>> {
    const stats: Record<string, QueueStats> = {};

    for (const jobType of this.queues.keys()) {
      stats[jobType] = await this.getQueueStats(jobType);
    }

    return stats as Record<JobType, QueueStats>;
  }

  /**
   * Pause a queue
   */
  async pauseQueue(jobType: JobType): Promise<void> {
    const queue = this.queues.get(jobType);
    if (queue) {
      await queue.pause();
      this.logInfo(`Queue ${jobType} paused`);
    }
  }

  /**
   * Resume a queue
   */
  async resumeQueue(jobType: JobType): Promise<void> {
    const queue = this.queues.get(jobType);
    if (queue) {
      await queue.resume();
      this.logInfo(`Queue ${jobType} resumed`);
    }
  }

  /**
   * Clean old jobs from queue
   */
  async cleanQueue(
    jobType: JobType,
    grace: number = 24 * 3600 * 1000,
  ): Promise<void> {
    const queue = this.queues.get(jobType);
    if (queue) {
      await queue.clean(grace, 100, 'completed');
      await queue.clean(grace * 7, 100, 'failed'); // Keep failed jobs longer
      this.logInfo(`Queue ${jobType} cleaned`);
    }
  }

  /**
   * Gracefully shutdown queue manager
   */
  async shutdown(): Promise<void> {
    this.logInfo('Shutting down queue manager...');

    // Close all queues
    for (const [jobType, queue] of this.queues.entries()) {
      await queue.close();
      this.logInfo(`Queue closed: ${jobType}`);
    }

    this.queues.clear();
    this.logInfo('Queue manager shutdown complete');
  }
}
