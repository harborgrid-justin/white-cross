/**
 * Queue Configuration
 * Type-safe queue configuration for White Cross platform
 * Extracted from redis.config.ts for better separation of concerns
 */

import { registerAs } from '@nestjs/config';

export interface QueueConfig {
  // Redis connection (inherits from redis namespace)
  host: string;
  port: number;
  password?: string;
  username?: string;
  db: number;

  // Connection settings
  connectionTimeout: number;
  maxRetries: number;
  retryDelay: number;

  // Queue-specific settings
  keyPrefix: string;

  // Concurrency settings for different queue types
  concurrency: {
    delivery: number;
    notification: number;
    encryption: number;
    indexing: number;
    batch: number;
    cleanup: number;
  };

  // Job settings
  defaultJobOptions: {
    attempts: number;
    backoff: {
      type: 'exponential' | 'fixed';
      delay: number;
    };
    removeOnComplete: boolean | number;
    removeOnFail: boolean | number;
  };

  // Rate limiting per queue
  rateLimiter: {
    enabled: boolean;
    max: number;
    duration: number;
  };
}

export default registerAs('queue', (): QueueConfig => {
  return {
    // Redis connection settings (separate DB from cache)
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
    username: process.env.REDIS_USERNAME || undefined,
    db: parseInt(process.env.REDIS_QUEUE_DB || '1', 10), // Default DB 1 for queues

    // Connection settings
    connectionTimeout: parseInt(
      process.env.REDIS_CONNECTION_TIMEOUT || '5000',
      10,
    ),
    maxRetries: parseInt(process.env.REDIS_MAX_RETRIES || '3', 10),
    retryDelay: parseInt(process.env.REDIS_RETRY_DELAY || '1000', 10),

    // Queue-specific settings
    keyPrefix: 'bull', // BullMQ default prefix

    // Concurrency settings
    concurrency: {
      delivery: parseInt(process.env.QUEUE_CONCURRENCY_DELIVERY || '10', 10),
      notification: parseInt(
        process.env.QUEUE_CONCURRENCY_NOTIFICATION || '15',
        10,
      ),
      encryption: parseInt(process.env.QUEUE_CONCURRENCY_ENCRYPTION || '5', 10),
      indexing: parseInt(process.env.QUEUE_CONCURRENCY_INDEXING || '3', 10),
      batch: parseInt(process.env.QUEUE_CONCURRENCY_BATCH || '2', 10),
      cleanup: parseInt(process.env.QUEUE_CONCURRENCY_CLEANUP || '1', 10),
    },

    // Job settings
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000, // 1 second initial delay
      },
      removeOnComplete: 100, // Keep last 100 completed jobs
      removeOnFail: 500, // Keep last 500 failed jobs for debugging
    },

    // Rate limiting
    rateLimiter: {
      enabled: process.env.QUEUE_RATE_LIMITER_ENABLED !== 'false',
      max: parseInt(process.env.QUEUE_RATE_LIMITER_MAX || '100', 10),
      duration: parseInt(
        process.env.QUEUE_RATE_LIMITER_DURATION || '60000',
        10,
      ), // 1 minute
    },
  };
});
