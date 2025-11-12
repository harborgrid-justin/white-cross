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
