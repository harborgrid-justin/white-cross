/**
 * @fileoverview Base Job Processor
 * @module infrastructure/jobs/base
 * @description Base class for job processors with common functionality
 */

import { Logger } from '@nestjs/common';

/**
 * Base processor class with common job processing functionality
 */
export abstract class BaseJobProcessor {
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
}
