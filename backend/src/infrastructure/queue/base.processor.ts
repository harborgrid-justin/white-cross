/**
 * @fileoverview Base Queue Processor
 * @module infrastructure/queue
 * @description Base class for queue processors with common functionality
 */

import { OnQueueActive, OnQueueCompleted, OnQueueFailed } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import type { Job } from 'bull';
import type { JobResult } from './interfaces';

/**
 * Base processor class with common queue processing functionality
 */
export abstract class BaseQueueProcessor {
  protected readonly logger: Logger;

  constructor(processorName: string) {
    this.logger = new Logger(processorName);
  }

  /**
   * Common delay utility for simulating async operations
   * @param ms - Milliseconds to delay
   */
  protected delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Common job execution wrapper with error handling and result formatting
   * @param job - The Bull job instance
   * @param jobData - Job data with required properties
   * @param executionFn - The actual processing function to execute
   * @returns Formatted job result
   */
  protected async executeJobWithCommonHandling<T, R>(
    job: Job<T>,
    jobData: { messageId?: string; operation?: string; type?: string },
    executionFn: () => Promise<R>,
  ): Promise<JobResult> {
    const startTime = Date.now();
    const identifier = jobData.messageId || jobData.type || 'unknown';
    const operation = jobData.operation || job.name;

    this.logger.log(`Processing ${operation} for ${identifier}`);

    try {
      const result = await executionFn();

      const processingTime = Date.now() - startTime;
      this.logger.log(`${operation} completed for ${identifier} (${processingTime}ms)`);

      return {
        success: true,
        data: result,
        metadata: {
          processingTime,
          attempts: job.attemptsMade,
          completedAt: new Date(),
        },
      };
    } catch (error) {
      const processingTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;

      this.logger.error(`${operation} failed for ${identifier}: ${errorMessage}`, errorStack);

      return {
        success: false,
        error: {
          message: errorMessage,
          stack: errorStack,
        },
        metadata: {
          processingTime,
          attempts: job.attemptsMade,
          completedAt: new Date(),
        },
      };
    }
  }

  /**
   * Common job active handler
   */
  @OnQueueActive()
  onActive(job: Job): void {
    this.logger.debug(`Processing job ${job.id} of type ${job.name}`);
  }

  /**
   * Common job completed handler
   */
  @OnQueueCompleted()
  onCompleted(job: Job, result: JobResult): void {
    this.logger.log(`Job ${job.id} completed successfully (attempts: ${result.metadata.attempts})`);
  }

  /**
   * Common job failed handler
   */
  @OnQueueFailed()
  onFailed(job: Job, error: Error): void {
    this.logger.error(`Job ${job.id} failed after ${job.attemptsMade} attempts: ${error.message}`);
  }
}
