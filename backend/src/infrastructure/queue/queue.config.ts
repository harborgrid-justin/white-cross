/**
 * @fileoverview Queue Configuration
 * @module infrastructure/queue
 * @description Configuration settings for Bull queues and Redis connection
 */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  BullModuleOptions,
  SharedBullConfigurationFactory,
} from '@nestjs/bull';
import { QueueName, JobPriority } from './enums';

/**
 * Queue-specific configuration
 */
export interface QueueConfig {
  /**
   * Queue name
   */
  name: QueueName;

  /**
   * Number of concurrent jobs to process
   */
  concurrency: number;

  /**
   * Maximum number of retry attempts
   */
  maxAttempts: number;

  /**
   * Backoff type for retries
   */
  backoffType: 'fixed' | 'exponential';

  /**
   * Initial backoff delay in milliseconds
   */
  backoffDelay: number;

  /**
   * Job timeout in milliseconds
   */
  timeout: number;

  /**
   * Remove completed jobs after this many
   */
  removeOnCompleteCount: number;

  /**
   * Remove completed jobs older than this (seconds)
   */
  removeOnCompleteAge: number;

  /**
   * Remove failed jobs after this many
   */
  removeOnFailCount: number;

  /**
   * Remove failed jobs older than this (seconds)
   */
  removeOnFailAge: number;
}

/**
 * Default queue configurations for each queue type
 */
export const QUEUE_CONFIGS: Record<QueueName, QueueConfig> = {
  [QueueName.MESSAGE_DELIVERY]: {
    name: QueueName.MESSAGE_DELIVERY,
    concurrency: 10,
    maxAttempts: 5,
    backoffType: 'exponential',
    backoffDelay: 2000, // 2s, 4s, 8s, 16s, 32s
    timeout: 30000, // 30 seconds
    removeOnCompleteCount: 1000,
    removeOnCompleteAge: 86400, // 24 hours
    removeOnFailCount: 2000,
    removeOnFailAge: 604800, // 7 days
  },

  [QueueName.MESSAGE_NOTIFICATION]: {
    name: QueueName.MESSAGE_NOTIFICATION,
    concurrency: 15,
    maxAttempts: 3,
    backoffType: 'exponential',
    backoffDelay: 1000, // 1s, 2s, 4s
    timeout: 20000, // 20 seconds
    removeOnCompleteCount: 500,
    removeOnCompleteAge: 43200, // 12 hours
    removeOnFailCount: 1000,
    removeOnFailAge: 259200, // 3 days
  },

  [QueueName.MESSAGE_INDEXING]: {
    name: QueueName.MESSAGE_INDEXING,
    concurrency: 3,
    maxAttempts: 3,
    backoffType: 'exponential',
    backoffDelay: 3000, // 3s, 6s, 12s
    timeout: 60000, // 60 seconds
    removeOnCompleteCount: 500,
    removeOnCompleteAge: 86400, // 24 hours
    removeOnFailCount: 1000,
    removeOnFailAge: 259200, // 3 days
  },

  [QueueName.MESSAGE_ENCRYPTION]: {
    name: QueueName.MESSAGE_ENCRYPTION,
    concurrency: 5, // CPU intensive
    maxAttempts: 3,
    backoffType: 'exponential',
    backoffDelay: 2000, // 2s, 4s, 8s
    timeout: 45000, // 45 seconds
    removeOnCompleteCount: 500,
    removeOnCompleteAge: 86400, // 24 hours
    removeOnFailCount: 1000,
    removeOnFailAge: 604800, // 7 days
  },

  [QueueName.BATCH_MESSAGE_SENDING]: {
    name: QueueName.BATCH_MESSAGE_SENDING,
    concurrency: 2, // Resource intensive
    maxAttempts: 3,
    backoffType: 'exponential',
    backoffDelay: 5000, // 5s, 10s, 20s
    timeout: 300000, // 5 minutes
    removeOnCompleteCount: 100,
    removeOnCompleteAge: 172800, // 48 hours
    removeOnFailCount: 200,
    removeOnFailAge: 604800, // 7 days
  },

  [QueueName.MESSAGE_CLEANUP]: {
    name: QueueName.MESSAGE_CLEANUP,
    concurrency: 1, // Sequential processing
    maxAttempts: 2,
    backoffType: 'fixed',
    backoffDelay: 10000, // 10 seconds
    timeout: 600000, // 10 minutes
    removeOnCompleteCount: 50,
    removeOnCompleteAge: 86400, // 24 hours
    removeOnFailCount: 100,
    removeOnFailAge: 604800, // 7 days
  },
};

/**
 * Queue configuration service
 * Provides type-safe queue configuration
 */
@Injectable()
export class QueueConfigService implements SharedBullConfigurationFactory {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Create Bull module configuration
   * Implements SharedBullConfigurationFactory interface
   */
  createSharedConfiguration(): BullModuleOptions {
    return {
      redis: {
        host: this.configService.get<string>('REDIS_HOST', 'localhost'),
        port: this.configService.get<number>('REDIS_PORT', 6379),
        password: this.configService.get<string>('REDIS_PASSWORD'),
        username: this.configService.get<string>('REDIS_USERNAME'),
        db: this.configService.get<number>('REDIS_QUEUE_DB', 0), // Use database 0 (same as cache)
        maxRetriesPerRequest: 20,
        enableReadyCheck: true,
        retryStrategy: (times: number) => {
          if (times > 10) {
            return null; // Stop retrying
          }
          return Math.min(times * 1000, 5000); // Max 5 second delay
        },
      },
      prefix: 'msg-queue', // Prefix all queue keys
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: {
          count: 500,
          age: 86400, // 24 hours
        },
        removeOnFail: {
          count: 1000,
          age: 604800, // 7 days
        },
      },
    };
  }

  /**
   * Get configuration for a specific queue
   */
  getQueueConfig(queueName: QueueName): QueueConfig {
    return QUEUE_CONFIGS[queueName];
  }

  /**
   * Get all queue configurations
   */
  getAllQueueConfigs(): Record<QueueName, QueueConfig> {
    return QUEUE_CONFIGS;
  }

  /**
   * Get Redis connection string for logging
   */
  getRedisConnectionString(): string {
    const host = this.configService.get<string>('REDIS_HOST', 'localhost');
    const port = this.configService.get<number>('REDIS_PORT', 6379);
    const db = this.configService.get<number>('REDIS_QUEUE_DB', 0);
    return `redis://${host}:${port}/${db}`;
  }

  /**
   * Check if Redis is configured
   */
  isRedisConfigured(): boolean {
    const host = this.configService.get<string>('REDIS_HOST');
    const port = this.configService.get<number>('REDIS_PORT');
    return Boolean(host && port);
  }

  /**
   * Get job options for a specific priority
   */
  getJobOptionsForPriority(priority: JobPriority) {
    return {
      priority,
      attempts: priority >= JobPriority.HIGH ? 5 : 3,
      backoff: {
        type: 'exponential' as const,
        delay: priority >= JobPriority.HIGH ? 1000 : 2000,
      },
    };
  }
}
