/**
 * @fileoverview Queue Metrics Interfaces
 * @module infrastructure/queue/interfaces
 * @description Type definitions for queue monitoring and metrics
 */

import { QueueName } from '../enums';

/**
 * Statistics for a single queue
 */
export interface QueueStats {
  /**
   * Queue name
   */
  name: QueueName;

  /**
   * Number of jobs waiting to be processed
   */
  waiting: number;

  /**
   * Number of jobs currently being processed
   */
  active: number;

  /**
   * Number of completed jobs
   */
  completed: number;

  /**
   * Number of failed jobs
   */
  failed: number;

  /**
   * Number of delayed jobs
   */
  delayed: number;

  /**
   * Number of paused jobs
   */
  paused: number;
}

/**
 * Aggregated metrics across all queues
 */
export interface QueueMetrics {
  /**
   * Individual queue statistics
   */
  queues: Record<QueueName, QueueStats>;

  /**
   * Total statistics across all queues
   */
  totals: {
    waiting: number;
    active: number;
    completed: number;
    failed: number;
    delayed: number;
    paused: number;
  };

  /**
   * Timestamp when metrics were collected
   */
  timestamp: Date;
}

/**
 * Health status of a queue
 */
export interface QueueHealth {
  /**
   * Queue name
   */
  name: QueueName;

  /**
   * Overall health status
   */
  status: 'healthy' | 'degraded' | 'unhealthy';

  /**
   * Health check details
   */
  checks: {
    /**
     * Redis connection status
     */
    redis: boolean;

    /**
     * Whether queue is accepting jobs
     */
    accepting: boolean;

    /**
     * Whether workers are processing jobs
     */
    processing: boolean;

    /**
     * High failure rate indicator
     */
    highFailureRate: boolean;
  };

  /**
   * Failure rate (failed / total processed)
   */
  failureRate: number;

  /**
   * Average processing time in milliseconds
   */
  averageProcessingTime?: number;

  /**
   * Timestamp of health check
   */
  checkedAt: Date;
}

/**
 * Failed job information for dead letter queue
 */
export interface FailedJobInfo {
  /**
   * Job ID
   */
  jobId: string;

  /**
   * Queue name where job failed
   */
  queueName: QueueName;

  /**
   * Job data
   */
  data: any;

  /**
   * Error information
   */
  error: {
    message: string;
    stack?: string;
  };

  /**
   * Number of attempts made
   */
  attempts: number;

  /**
   * Timestamp when job failed
   */
  failedAt: Date;

  /**
   * Timestamp when job was originally created
   */
  createdAt: Date;
}
