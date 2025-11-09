"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobHealthChecker = exports.JobEventListener = exports.JobMetricsService = exports.DeadLetterQueueHandler = exports.JobRetryStrategy = exports.JobProgressTracker = exports.JobProcessor = exports.CompensationHandler = exports.SagaStep = exports.SagaOrchestrator = exports.DistributedLock = exports.CircuitBreakerState = exports.CircuitBreakerConfig = exports.CircuitBreaker = exports.getQueueMetrics = exports.getJobStatus = exports.cancelJob = exports.retryJob = exports.scheduleJob = exports.createJob = void 0;
// Re-export from background-jobs-kit.prod.ts
__exportStar(require("../../background-jobs-kit.prod"), exports);
// Re-export from background-jobs-scheduling-kit.ts
__exportStar(require("../../background-jobs-scheduling-kit"), exports);
// Re-export from queue-jobs-kit.ts
__exportStar(require("../../queue-jobs-kit"), exports);
// Job Creation & Scheduling
var background_jobs_kit_prod_1 = require("../../background-jobs-kit.prod");
Object.defineProperty(exports, "createJob", { enumerable: true, get: function () { return background_jobs_kit_prod_1.createJob; } });
Object.defineProperty(exports, "scheduleJob", { enumerable: true, get: function () { return background_jobs_kit_prod_1.scheduleJob; } });
Object.defineProperty(exports, "retryJob", { enumerable: true, get: function () { return background_jobs_kit_prod_1.retryJob; } });
Object.defineProperty(exports, "cancelJob", { enumerable: true, get: function () { return background_jobs_kit_prod_1.cancelJob; } });
Object.defineProperty(exports, "getJobStatus", { enumerable: true, get: function () { return background_jobs_kit_prod_1.getJobStatus; } });
Object.defineProperty(exports, "getQueueMetrics", { enumerable: true, get: function () { return background_jobs_kit_prod_1.getQueueMetrics; } });
// Resilience Patterns
var background_jobs_kit_prod_2 = require("../../background-jobs-kit.prod");
Object.defineProperty(exports, "CircuitBreaker", { enumerable: true, get: function () { return background_jobs_kit_prod_2.CircuitBreaker; } });
Object.defineProperty(exports, "CircuitBreakerConfig", { enumerable: true, get: function () { return background_jobs_kit_prod_2.CircuitBreakerConfig; } });
Object.defineProperty(exports, "CircuitBreakerState", { enumerable: true, get: function () { return background_jobs_kit_prod_2.CircuitBreakerState; } });
// Distributed Patterns
var background_jobs_kit_prod_3 = require("../../background-jobs-kit.prod");
Object.defineProperty(exports, "DistributedLock", { enumerable: true, get: function () { return background_jobs_kit_prod_3.DistributedLock; } });
Object.defineProperty(exports, "SagaOrchestrator", { enumerable: true, get: function () { return background_jobs_kit_prod_3.SagaOrchestrator; } });
Object.defineProperty(exports, "SagaStep", { enumerable: true, get: function () { return background_jobs_kit_prod_3.SagaStep; } });
Object.defineProperty(exports, "CompensationHandler", { enumerable: true, get: function () { return background_jobs_kit_prod_3.CompensationHandler; } });
// Job Processors
var background_jobs_kit_prod_4 = require("../../background-jobs-kit.prod");
Object.defineProperty(exports, "JobProcessor", { enumerable: true, get: function () { return background_jobs_kit_prod_4.JobProcessor; } });
Object.defineProperty(exports, "JobProgressTracker", { enumerable: true, get: function () { return background_jobs_kit_prod_4.JobProgressTracker; } });
Object.defineProperty(exports, "JobRetryStrategy", { enumerable: true, get: function () { return background_jobs_kit_prod_4.JobRetryStrategy; } });
Object.defineProperty(exports, "DeadLetterQueueHandler", { enumerable: true, get: function () { return background_jobs_kit_prod_4.DeadLetterQueueHandler; } });
// Monitoring
var background_jobs_kit_prod_5 = require("../../background-jobs-kit.prod");
Object.defineProperty(exports, "JobMetricsService", { enumerable: true, get: function () { return background_jobs_kit_prod_5.JobMetricsService; } });
Object.defineProperty(exports, "JobEventListener", { enumerable: true, get: function () { return background_jobs_kit_prod_5.JobEventListener; } });
Object.defineProperty(exports, "JobHealthChecker", { enumerable: true, get: function () { return background_jobs_kit_prod_5.JobHealthChecker; } });
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
//# sourceMappingURL=index.js.map