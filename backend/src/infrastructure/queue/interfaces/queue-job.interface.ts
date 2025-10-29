/**
 * @fileoverview Queue Job Interfaces
 * @module infrastructure/queue/interfaces
 * @description Type definitions for queue jobs and their options
 */

import { JobPriority } from '../enums';

/**
 * Base interface for all queue jobs
 * Provides common properties across all job types
 */
export interface BaseQueueJob {
  /**
   * Unique identifier for the job
   * Used for tracking and deduplication
   */
  jobId?: string;

  /**
   * Timestamp when the job was created
   */
  createdAt: Date;

  /**
   * User or system that initiated the job
   */
  initiatedBy?: string;

  /**
   * Additional metadata for the job
   */
  metadata?: Record<string, any>;
}

/**
 * Options for adding a job to a queue
 */
export interface QueueJobOptions {
  /**
   * Job priority level
   * @default JobPriority.NORMAL
   */
  priority?: JobPriority;

  /**
   * Delay in milliseconds before the job should be processed
   * @default 0
   */
  delay?: number;

  /**
   * Number of retry attempts on failure
   * @default 3
   */
  attempts?: number;

  /**
   * Backoff strategy for retries
   */
  backoff?: {
    type: 'fixed' | 'exponential';
    delay: number;
  };

  /**
   * Time-to-live in milliseconds
   * Job will be removed if not completed within this time
   */
  timeout?: number;

  /**
   * Remove job from queue on completion
   * @default true
   */
  removeOnComplete?: boolean;

  /**
   * Remove job from queue on failure
   * @default false
   */
  removeOnFail?: boolean;

  /**
   * Repeatable job configuration (for scheduled jobs)
   */
  repeat?: {
    cron?: string;
    every?: number;
    limit?: number;
  };
}

/**
 * Result of job processing
 */
export interface JobResult<T = any> {
  /**
   * Whether the job completed successfully
   */
  success: boolean;

  /**
   * Result data from the job
   */
  data?: T;

  /**
   * Error information if job failed
   */
  error?: {
    message: string;
    code?: string;
    stack?: string;
  };

  /**
   * Processing metadata
   */
  metadata: {
    /**
     * Time taken to process the job in milliseconds
     */
    processingTime: number;

    /**
     * Number of attempts made
     */
    attempts: number;

    /**
     * Timestamp when processing completed
     */
    completedAt: Date;
  };
}

/**
 * Job progress information
 */
export interface JobProgress {
  /**
   * Percentage complete (0-100)
   */
  percentage: number;

  /**
   * Current step or phase
   */
  step?: string;

  /**
   * Total number of steps
   */
  totalSteps?: number;

  /**
   * Current step number
   */
  currentStep?: number;

  /**
   * Additional progress data
   */
  data?: Record<string, any>;
}
