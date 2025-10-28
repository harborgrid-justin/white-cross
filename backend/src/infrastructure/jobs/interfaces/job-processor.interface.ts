/**
 * Job Processor Interface
 *
 * Base interface for job processors
 */
import { Job } from 'bullmq';

export interface JobProcessor<T = any> {
  process(job: Job<T>): Promise<any>;
}
