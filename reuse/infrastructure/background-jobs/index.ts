/**
 * Background Jobs & Scheduling Infrastructure
 * 
 * @module infrastructure/background-jobs
 * @description Enterprise-grade background job processing, scheduling, and queue management
 * 
 * @example
 * ```typescript
 * import { createJob, scheduleJob, CircuitBreaker } from '@white-cross/reuse/infrastructure/background-jobs';
 * 
 * // Create a background job
 * const job = await createJob(queue, {
 *   name: 'send-report',
 *   data: { userId: '123' },
 *   options: { attempts: 3 }
 * });
 * 
 * // Schedule recurring job
 * await scheduleJob(queue, {
 *   name: 'daily-cleanup',
 *   cron: '0 2 * * *',
 *   data: {}
 * });
 * ```
 */

// Re-export from background-jobs-kit.prod.ts
export * from '../../background-jobs-kit.prod';

// Re-export from background-jobs-scheduling-kit.ts
export * from '../../background-jobs-scheduling-kit';

// Re-export from queue-jobs-kit.ts
export * from '../../queue-jobs-kit';

/**
 * Commonly Used Exports (Tree-shakeable)
 */

// Job Queue Management
export type {
  JobQueue,
  JobOptions,
  JobData,
  JobResult,
  QueueConfig,
  QueueMetrics
} from '../../background-jobs-kit.prod';

// Job Creation & Scheduling
export {
  createJob,
  scheduleJob,
  retryJob,
  cancelJob,
  getJobStatus,
  getQueueMetrics
} from '../../background-jobs-kit.prod';

// Resilience Patterns
export {
  CircuitBreaker,
  CircuitBreakerConfig,
  CircuitBreakerState
} from '../../background-jobs-kit.prod';

// Distributed Patterns
export {
  DistributedLock,
  SagaOrchestrator,
  SagaStep,
  CompensationHandler
} from '../../background-jobs-kit.prod';

// Job Processors
export {
  JobProcessor,
  JobProgressTracker,
  JobRetryStrategy,
  DeadLetterQueueHandler
} from '../../background-jobs-kit.prod';

// Monitoring
export {
  JobMetricsService,
  JobEventListener,
  JobHealthChecker
} from '../../background-jobs-kit.prod';

/**
 * Quick Reference
 * ===============
 * 
 * **Create Background Job**:
 * ```typescript
 * await createJob(queue, { name: 'task', data: {...}, options: { attempts: 3 } });
 * ```
 * 
 * **Schedule Recurring Job**:
 * ```typescript
 * await scheduleJob(queue, { name: 'cleanup', cron: '0 2 * * *', data: {...} });
 * ```
 * 
 * **Circuit Breaker**:
 * ```typescript
 * const breaker = new CircuitBreaker({ threshold: 5, timeout: 30000 });
 * await breaker.execute(() => externalApiCall());
 * ```
 * 
 * **Distributed Lock**:
 * ```typescript
 * const lock = new DistributedLock(redis, 'my-lock', { ttl: 10000 });
 * await lock.acquire();
 * try {
 *   // Critical section
 * } finally {
 *   await lock.release();
 * }
 * ```
 * 
 * **Saga Pattern**:
 * ```typescript
 * const saga = new SagaOrchestrator();
 * saga.addStep({ execute: step1, compensate: undo1 });
 * saga.addStep({ execute: step2, compensate: undo2 });
 * await saga.run();
 * ```
 */
