/**
 * LOC: BG-JOBS-PROD-001
 * File: /reuse/background-jobs-kit.prod.ts
 *
 * UPSTREAM (imports from):
 *   - bull / bullmq
 *   - @nestjs/bull
 *   - @nestjs/common
 *   - @nestjs/microservices
 *   - sequelize / sequelize-typescript
 *   - ioredis
 *   - zod
 *
 * DOWNSTREAM (imported by):
 *   - Background job processors
 *   - Queue service modules
 *   - Job scheduling services
 *   - Worker pool managers
 *   - Distributed processing systems
 */
/**
 * File: /reuse/background-jobs-kit.prod.ts
 * Locator: WC-UTL-BGJOBS-PROD-001
 * Purpose: Production-Grade Background Jobs and Queue Utilities - Enterprise-ready job queue management with NestJS + Bull/BullMQ + Sequelize
 *
 * Upstream: bull, bullmq, @nestjs/bull, @nestjs/common, @nestjs/microservices, sequelize, sequelize-typescript, ioredis, zod, node-cron
 * Downstream: ../backend/*, queue services, job processors, scheduler modules, distributed systems
 * Dependencies: NestJS 10.x, Bull 4.x / BullMQ 5.x, Sequelize 6.x, TypeScript 5.x, Redis 7.x, Zod 3.x
 * Exports: 45 production-grade utility functions for job queues, scheduling, workers, retries, metrics, distributed locks, idempotency
 *
 * LLM Context: Enterprise-grade background job processing utilities for White Cross healthcare platform.
 * Provides comprehensive queue creation/management, advanced scheduling (cron, delayed, recurring), priority handling,
 * auto-scaling worker pools, sophisticated retry strategies, dead letter queues, real-time progress tracking,
 * job cancellation, batching, distributed locks, idempotency keys, metrics monitoring, result storage,
 * event-driven workflows, parent-child relationships, rate limiting, circuit breakers, health checks,
 * and Sequelize models with full audit trails. Optimized for HIPAA-compliant healthcare background processing.
 *
 * Features:
 * - Distributed locks with Redis
 * - Idempotency key management
 * - Advanced Zod validation schemas
 * - NestJS decorators and providers
 * - Auto-scaling worker pools
 * - Circuit breaker patterns
 * - Comprehensive monitoring and alerting
 * - HIPAA-compliant audit logging
 * - Saga pattern support
 * - Job dependency graphs
 * - Multi-queue coordination
 */
import { z } from 'zod';
/**
 * Zod schema for job options validation.
 */
export declare const JobOptionsSchema: any;
/**
 * Zod schema for job data validation.
 */
export declare const JobDataSchema: any;
/**
 * Zod schema for worker pool configuration.
 */
export declare const WorkerPoolConfigSchema: any;
/**
 * Zod schema for rate limit configuration.
 */
export declare const RateLimitConfigSchema: any;
/**
 * Zod schema for distributed lock configuration.
 */
export declare const DistributedLockConfigSchema: any;
export interface JobOptions {
    priority?: number;
    delay?: number;
    attempts?: number;
    backoff?: number | {
        type: string;
        delay: number;
    };
    lifo?: boolean;
    timeout?: number;
    removeOnComplete?: boolean | number;
    removeOnFail?: boolean | number;
    jobId?: string;
    repeat?: RepeatOptions;
    idempotencyKey?: string;
}
export interface RepeatOptions {
    cron?: string;
    tz?: string;
    startDate?: Date | string;
    endDate?: Date | string;
    limit?: number;
    every?: number;
    count?: number;
}
export interface JobProgress {
    percentage: number;
    message?: string;
    data?: Record<string, any>;
    timestamp: Date;
}
export interface JobResult {
    jobId: string;
    queueName: string;
    status: 'completed' | 'failed';
    result?: any;
    error?: string;
    duration: number;
    completedAt: Date;
    idempotencyKey?: string;
}
export interface QueueMetrics {
    queueName: string;
    waiting: number;
    active: number;
    completed: number;
    failed: number;
    delayed: number;
    paused: boolean;
    timestamp: Date;
    throughput?: number;
    avgDuration?: number;
}
export interface WorkerPoolConfig {
    concurrency: number;
    maxStalledCount?: number;
    stalledInterval?: number;
    lockDuration?: number;
    lockRenewTime?: number;
    autoScaling?: {
        enabled: boolean;
        minConcurrency: number;
        maxConcurrency: number;
        scaleUpThreshold: number;
        scaleDownThreshold: number;
        checkInterval: number;
    };
}
export interface RateLimitConfig {
    max: number;
    duration: number;
    bounceBack?: boolean;
    groupKey?: string;
}
export interface JobBatch {
    batchId: string;
    jobIds: string[];
    status: 'pending' | 'processing' | 'completed' | 'failed';
    createdAt: Date;
    completedAt?: Date;
    metadata?: Record<string, any>;
}
export interface ParentChildRelation {
    parentJobId: string;
    childJobIds: string[];
    parentQueue: string;
    childQueue: string;
    dependencyMode: 'all' | 'any';
}
export interface JobEvent {
    eventType: 'created' | 'active' | 'completed' | 'failed' | 'progress' | 'stalled' | 'removed';
    jobId: string;
    queueName: string;
    data?: any;
    timestamp: Date;
}
export interface DeadLetterJob {
    jobId: string;
    queueName: string;
    failedAt: Date;
    attempts: number;
    error: string;
    data: any;
    canRetry: boolean;
}
export interface DistributedLockConfig {
    lockKey: string;
    ttl: number;
    retries?: number;
    retryDelay?: number;
    extendInterval?: number;
}
export interface IdempotencyRecord {
    key: string;
    jobId: string;
    result?: any;
    createdAt: Date;
    expiresAt: Date;
}
/**
 * 1. Creates production-grade Sequelize model for persistent job tracking.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {any} DataTypes - Sequelize DataTypes
 * @returns {any} Job model
 *
 * @example
 * ```typescript
 * const JobModel = createProductionJobModel(sequelize, DataTypes);
 * const job = await JobModel.create({
 *   jobId: 'job-123',
 *   queueName: 'patient-notifications',
 *   status: 'active',
 *   data: { patientId: '456' },
 *   idempotencyKey: 'notify-patient-456-2024-01-01'
 * });
 * ```
 */
export declare const createProductionJobModel: (sequelize: any, DataTypes: any) => any;
/**
 * 2. Creates production-grade Sequelize model for job schedules.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {any} DataTypes - Sequelize DataTypes
 * @returns {any} JobSchedule model
 *
 * @example
 * ```typescript
 * const JobScheduleModel = createJobScheduleModel(sequelize, DataTypes);
 * const schedule = await JobScheduleModel.create({
 *   name: 'daily-patient-reports',
 *   cronExpression: '0 8 * * *',
 *   queueName: 'reports',
 *   jobName: 'generate-patient-report',
 *   enabled: true,
 *   timezone: 'America/New_York'
 * });
 * ```
 */
export declare const createJobScheduleModel: (sequelize: any, DataTypes: any) => any;
/**
 * 3. Creates production-grade Sequelize model for job execution logs.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {any} DataTypes - Sequelize DataTypes
 * @returns {any} JobExecutionLog model
 *
 * @example
 * ```typescript
 * const JobExecutionLog = createJobExecutionLogModel(sequelize, DataTypes);
 * await JobExecutionLog.create({
 *   jobId: 'job-123',
 *   queueName: 'processing',
 *   status: 'completed',
 *   duration: 1234,
 *   workerId: 'worker-01',
 *   result: { recordsProcessed: 100 }
 * });
 * ```
 */
export declare const createJobExecutionLogModel: (sequelize: any, DataTypes: any) => any;
/**
 * 4. Creates production-grade Sequelize model for idempotency keys.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {any} DataTypes - Sequelize DataTypes
 * @returns {any} IdempotencyKey model
 *
 * @example
 * ```typescript
 * const IdempotencyKey = createIdempotencyKeyModel(sequelize, DataTypes);
 * const key = await IdempotencyKey.create({
 *   key: 'process-payment-123',
 *   jobId: 'job-456',
 *   result: { success: true },
 *   expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
 * });
 * ```
 */
export declare const createIdempotencyKeyModel: (sequelize: any, DataTypes: any) => any;
/**
 * 5. Creates production-grade Sequelize model for distributed locks.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {any} DataTypes - Sequelize DataTypes
 * @returns {any} DistributedLock model
 *
 * @example
 * ```typescript
 * const DistributedLock = createDistributedLockModel(sequelize, DataTypes);
 * const lock = await DistributedLock.create({
 *   lockKey: 'process-patient-123',
 *   ownerId: 'worker-01',
 *   expiresAt: new Date(Date.now() + 30000)
 * });
 * ```
 */
export declare const createDistributedLockModel: (sequelize: any, DataTypes: any) => any;
/**
 * 6. Creates a production-grade Bull queue with validation and monitoring.
 *
 * @param {string} queueName - Name of the queue
 * @param {any} redisConnection - Redis connection config or instance
 * @param {Partial<JobOptions>} [defaultJobOptions] - Default job options
 * @returns {any} Bull Queue instance
 *
 * @example
 * ```typescript
 * const emailQueue = createProductionQueue(
 *   'patient-emails',
 *   { host: 'localhost', port: 6379 },
 *   { attempts: 3, backoff: { type: 'exponential', delay: 2000 } }
 * );
 * await emailQueue.add({ to: 'patient@example.com', subject: 'Appointment' });
 * ```
 */
export declare const createProductionQueue: (queueName: string, redisConnection: any, defaultJobOptions?: Partial<JobOptions>) => any;
/**
 * 7. Creates a validated job with Zod schema validation.
 *
 * @param {any} queue - Bull queue instance
 * @param {string} jobName - Name of the job
 * @param {any} data - Job data
 * @param {z.ZodSchema} [schema] - Zod validation schema
 * @param {JobOptions} [options] - Job options
 * @returns {Promise<any>} Created job
 *
 * @example
 * ```typescript
 * const PatientDataSchema = z.object({
 *   patientId: z.string().uuid(),
 *   type: z.enum(['notification', 'report']),
 *   email: z.string().email()
 * });
 *
 * const job = await createValidatedJob(
 *   emailQueue,
 *   'send-email',
 *   { patientId: '123', type: 'notification', email: 'test@example.com' },
 *   PatientDataSchema,
 *   { priority: 5 }
 * );
 * ```
 */
export declare const createValidatedJob: (queue: any, jobName: string, data: any, schema?: z.ZodSchema, options?: JobOptions) => Promise<any>;
/**
 * 8. Creates an idempotent job that won't be executed twice for the same key.
 *
 * @param {any} queue - Bull queue instance
 * @param {string} jobName - Name of the job
 * @param {any} data - Job data
 * @param {string} idempotencyKey - Unique idempotency key
 * @param {any} idempotencyModel - Sequelize IdempotencyKey model
 * @param {JobOptions} [options] - Job options
 * @returns {Promise<{job?: any, cached: boolean, result?: any}>} Job or cached result
 *
 * @example
 * ```typescript
 * const result = await createIdempotentJob(
 *   paymentQueue,
 *   'process-payment',
 *   { amount: 100, patientId: '123' },
 *   'payment-123-2024-01-01',
 *   IdempotencyKeyModel,
 *   { priority: 10 }
 * );
 *
 * if (result.cached) {
 *   console.log('Already processed:', result.result);
 * } else {
 *   console.log('New job created:', result.job.id);
 * }
 * ```
 */
export declare const createIdempotentJob: (queue: any, jobName: string, data: any, idempotencyKey: string, idempotencyModel: any, options?: JobOptions) => Promise<{
    job?: any;
    cached: boolean;
    result?: any;
}>;
/**
 * 9. Updates idempotency key with job result.
 *
 * @param {any} idempotencyModel - Sequelize IdempotencyKey model
 * @param {string} idempotencyKey - Idempotency key
 * @param {any} result - Job result
 * @param {'completed' | 'failed'} status - Job status
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * // In job processor
 * const processor = async (job) => {
 *   const result = await processPayment(job.data);
 *
 *   if (job.data.idempotencyKey) {
 *     await updateIdempotencyKey(
 *       IdempotencyKeyModel,
 *       job.data.idempotencyKey,
 *       result,
 *       'completed'
 *     );
 *   }
 *
 *   return result;
 * };
 * ```
 */
export declare const updateIdempotencyKey: (idempotencyModel: any, idempotencyKey: string, result: any, status: "completed" | "failed") => Promise<void>;
/**
 * 10. Cleans up expired idempotency keys.
 *
 * @param {any} idempotencyModel - Sequelize IdempotencyKey model
 * @returns {Promise<number>} Number of deleted records
 *
 * @example
 * ```typescript
 * // Run periodically
 * setInterval(async () => {
 *   const deleted = await cleanupExpiredIdempotencyKeys(IdempotencyKeyModel);
 *   console.log(`Cleaned up ${deleted} expired idempotency keys`);
 * }, 60 * 60 * 1000); // Every hour
 * ```
 */
export declare const cleanupExpiredIdempotencyKeys: (idempotencyModel: any) => Promise<number>;
/**
 * 11. Acquires a distributed lock using Redis.
 *
 * @param {any} redis - Redis client
 * @param {string} lockKey - Lock key
 * @param {string} ownerId - Owner identifier (worker ID)
 * @param {number} ttl - Time to live in milliseconds
 * @returns {Promise<boolean>} True if lock acquired
 *
 * @example
 * ```typescript
 * const lockAcquired = await acquireDistributedLock(
 *   redisClient,
 *   'process-patient-123',
 *   'worker-01',
 *   30000
 * );
 *
 * if (lockAcquired) {
 *   try {
 *     await processPatient();
 *   } finally {
 *     await releaseDistributedLock(redisClient, 'process-patient-123', 'worker-01');
 *   }
 * }
 * ```
 */
export declare const acquireDistributedLock: (redis: any, lockKey: string, ownerId: string, ttl: number) => Promise<boolean>;
/**
 * 12. Releases a distributed lock.
 *
 * @param {any} redis - Redis client
 * @param {string} lockKey - Lock key
 * @param {string} ownerId - Owner identifier
 * @returns {Promise<boolean>} True if lock released
 *
 * @example
 * ```typescript
 * const released = await releaseDistributedLock(
 *   redisClient,
 *   'process-patient-123',
 *   'worker-01'
 * );
 * ```
 */
export declare const releaseDistributedLock: (redis: any, lockKey: string, ownerId: string) => Promise<boolean>;
/**
 * 13. Extends a distributed lock TTL.
 *
 * @param {any} redis - Redis client
 * @param {string} lockKey - Lock key
 * @param {string} ownerId - Owner identifier
 * @param {number} additionalTtl - Additional TTL in milliseconds
 * @returns {Promise<boolean>} True if extended
 *
 * @example
 * ```typescript
 * // Extend lock every 15 seconds for long-running job
 * const extendInterval = setInterval(async () => {
 *   const extended = await extendDistributedLock(
 *     redisClient,
 *     'long-process-123',
 *     'worker-01',
 *     30000
 *   );
 *   if (!extended) {
 *     clearInterval(extendInterval);
 *   }
 * }, 15000);
 * ```
 */
export declare const extendDistributedLock: (redis: any, lockKey: string, ownerId: string, additionalTtl: number) => Promise<boolean>;
/**
 * 14. Creates a distributed lock manager with automatic renewal.
 *
 * @param {any} redis - Redis client
 * @param {any} lockModel - Sequelize DistributedLock model
 * @returns {Object} Lock manager
 *
 * @example
 * ```typescript
 * const lockManager = createDistributedLockManager(redisClient, DistributedLockModel);
 *
 * const lock = await lockManager.acquire({
 *   lockKey: 'process-patient-123',
 *   ttl: 30000,
 *   retries: 3,
 *   retryDelay: 1000,
 *   extendInterval: 15000
 * });
 *
 * if (lock) {
 *   try {
 *     await processPatient();
 *   } finally {
 *     await lockManager.release(lock.lockId);
 *   }
 * }
 * ```
 */
export declare const createDistributedLockManager: (redis: any, lockModel: any) => {
    acquire(config: {
        lockKey: string;
        ttl: number;
        retries?: number;
        retryDelay?: number;
        extendInterval?: number;
        jobId?: string;
        resourceType?: string;
        resourceId?: string;
    }): Promise<{
        lockId: string;
        ownerId: string;
    } | null>;
    release(lockId: string): Promise<boolean>;
    releaseAll(): Promise<number>;
    cleanupExpired(): Promise<number>;
};
/**
 * 15. Executes a function with distributed lock protection.
 *
 * @param {any} redis - Redis client
 * @param {string} lockKey - Lock key
 * @param {Function} fn - Function to execute
 * @param {Object} config - Lock configuration
 * @returns {Promise<any>} Function result
 *
 * @example
 * ```typescript
 * const result = await withDistributedLock(
 *   redisClient,
 *   'process-payment-123',
 *   async () => {
 *     return await processPayment(paymentData);
 *   },
 *   { ttl: 30000, retries: 3 }
 * );
 * ```
 */
export declare const withDistributedLock: <T>(redis: any, lockKey: string, fn: () => Promise<T>, config?: {
    ttl: number;
    retries?: number;
    retryDelay?: number;
}) => Promise<T>;
/**
 * 16. Creates a cron-based job schedule with validation.
 *
 * @param {any} queue - Bull queue instance
 * @param {any} scheduleModel - Sequelize JobSchedule model
 * @param {Object} config - Schedule configuration
 * @returns {Promise<any>} Created schedule
 *
 * @example
 * ```typescript
 * const schedule = await createCronSchedule(
 *   reportQueue,
 *   JobScheduleModel,
 *   {
 *     name: 'daily-patient-reports',
 *     cronExpression: '0 8 * * *',
 *     jobName: 'generate-report',
 *     jobData: { type: 'daily-summary' },
 *     timezone: 'America/New_York',
 *     enabled: true
 *   }
 * );
 * ```
 */
export declare const createCronSchedule: (queue: any, scheduleModel: any, config: {
    name: string;
    cronExpression: string;
    jobName: string;
    jobData?: any;
    jobOptions?: JobOptions;
    timezone?: string;
    startDate?: Date;
    endDate?: Date;
    maxRuns?: number;
    enabled?: boolean;
    description?: string;
}) => Promise<any>;
/**
 * 17. Updates job schedule run tracking.
 *
 * @param {any} scheduleModel - Sequelize JobSchedule model
 * @param {string} scheduleName - Schedule name
 * @param {string} jobId - Job ID that was created
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * // In job processor or queue listener
 * queue.on('added', async (job) => {
 *   if (job.opts?.repeat) {
 *     await updateScheduleRunTracking(
 *       JobScheduleModel,
 *       'daily-reports',
 *       job.id
 *     );
 *   }
 * });
 * ```
 */
export declare const updateScheduleRunTracking: (scheduleModel: any, scheduleName: string, jobId: string) => Promise<void>;
/**
 * 18. Enables or disables a job schedule.
 *
 * @param {any} queue - Bull queue instance
 * @param {any} scheduleModel - Sequelize JobSchedule model
 * @param {string} scheduleName - Schedule name
 * @param {boolean} enabled - Enable or disable
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * // Disable schedule temporarily
 * await toggleSchedule(reportQueue, JobScheduleModel, 'daily-reports', false);
 *
 * // Re-enable later
 * await toggleSchedule(reportQueue, JobScheduleModel, 'daily-reports', true);
 * ```
 */
export declare const toggleSchedule: (queue: any, scheduleModel: any, scheduleName: string, enabled: boolean) => Promise<void>;
/**
 * 19. Creates a production-grade worker with comprehensive error handling.
 *
 * @param {any} queue - Bull queue instance
 * @param {Function} processor - Job processor function
 * @param {WorkerPoolConfig} config - Worker configuration
 * @param {any} executionLogModel - Sequelize JobExecutionLog model
 * @returns {any} Worker instance
 *
 * @example
 * ```typescript
 * const worker = createProductionWorker(
 *   processingQueue,
 *   async (job) => {
 *     return await processData(job.data);
 *   },
 *   {
 *     concurrency: 10,
 *     lockDuration: 30000,
 *     autoScaling: {
 *       enabled: true,
 *       minConcurrency: 5,
 *       maxConcurrency: 50,
 *       scaleUpThreshold: 100,
 *       scaleDownThreshold: 10,
 *       checkInterval: 30000
 *     }
 *   },
 *   JobExecutionLogModel
 * );
 * ```
 */
export declare const createProductionWorker: (queue: any, processor: (job: any) => Promise<any>, config: WorkerPoolConfig, executionLogModel?: any) => any;
/**
 * 20. Creates metrics aggregation for job execution logs.
 *
 * @param {any} executionLogModel - Sequelize JobExecutionLog model
 * @param {Object} filters - Filter criteria
 * @returns {Promise<Object>} Aggregated metrics
 *
 * @example
 * ```typescript
 * const metrics = await aggregateJobMetrics(JobExecutionLogModel, {
 *   queueName: 'processing',
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date(),
 *   groupBy: 'hour'
 * });
 *
 * console.log('Average duration:', metrics.avgDuration);
 * console.log('Success rate:', metrics.successRate);
 * console.log('P95 duration:', metrics.p95Duration);
 * ```
 */
export declare const aggregateJobMetrics: (executionLogModel: any, filters: {
    queueName?: string;
    jobName?: string;
    workerId?: string;
    startDate?: Date;
    endDate?: Date;
    status?: string;
}) => Promise<{
    totalJobs: number;
    successfulJobs: number;
    failedJobs: number;
    successRate: number;
    avgDuration: number;
    minDuration: number;
    maxDuration: number;
    p50Duration: number;
    p95Duration: number;
    p99Duration: number;
    avgCpuUsage: number;
    avgMemoryUsage: number;
}>;
/**
 * 21. Creates NestJS-compatible queue provider.
 *
 * @param {string} queueName - Queue name
 * @param {any} redisConfig - Redis configuration
 * @returns {Object} NestJS provider configuration
 *
 * @example
 * ```typescript
 * // In your NestJS module
 * import { Module } from '@nestjs/common';
 *
 * @Module({
 *   providers: [
 *     createNestJSQueueProvider('emails', {
 *       host: 'localhost',
 *       port: 6379
 *     }),
 *   ],
 *   exports: ['QUEUE_EMAILS'],
 * })
 * export class QueueModule {}
 * ```
 */
export declare const createNestJSQueueProvider: (queueName: string, redisConfig: any) => {
    provide: string;
    useFactory: () => any;
};
/**
 * 22. Creates NestJS processor decorator wrapper.
 *
 * @param {string} queueName - Queue name
 * @param {string} jobName - Job name
 * @returns {MethodDecorator} NestJS method decorator
 *
 * @example
 * ```typescript
 * import { Injectable } from '@nestjs/common';
 *
 * @Injectable()
 * export class EmailProcessor {
 *   @Process('send-email')
 *   async handleSendEmail(job: Job) {
 *     await this.emailService.send(job.data);
 *   }
 * }
 * ```
 */
export declare const Process: (jobName: string) => MethodDecorator;
/**
 * 23. Creates a circuit breaker for job processing.
 *
 * @param {Object} config - Circuit breaker configuration
 * @returns {Object} Circuit breaker instance
 *
 * @example
 * ```typescript
 * const circuitBreaker = createJobCircuitBreaker({
 *   failureThreshold: 5,
 *   resetTimeout: 60000,
 *   halfOpenRetries: 3,
 *   onStateChange: (state) => {
 *     console.log('Circuit breaker state:', state);
 *   }
 * });
 *
 * const processor = async (job) => {
 *   return circuitBreaker.execute(async () => {
 *     return await externalApiCall(job.data);
 *   });
 * };
 * ```
 */
export declare const createJobCircuitBreaker: (config: {
    failureThreshold: number;
    resetTimeout: number;
    halfOpenRetries: number;
    onStateChange?: (state: string) => void;
}) => {
    execute<T>(fn: () => Promise<T>): Promise<T>;
    getState(): string;
    getMetrics(): {
        state: "closed" | "open" | "half-open";
        failureCount: number;
        successCount: number;
        lastFailureTime: Date | null;
    };
    reset(): void;
};
/**
 * 24. Creates a saga coordinator for distributed transactions.
 *
 * @param {Map<string, any>} queues - Map of queue instances
 * @returns {Object} Saga coordinator
 *
 * @example
 * ```typescript
 * const saga = createSagaCoordinator(queueManager.getAllQueues());
 *
 * await saga
 *   .addStep('reserve-appointment', appointmentQueue, reserveData, compensateReserve)
 *   .addStep('charge-payment', paymentQueue, paymentData, compensatePayment)
 *   .addStep('send-confirmation', emailQueue, emailData, compensateEmail)
 *   .execute();
 * ```
 */
export declare const createSagaCoordinator: (queues: Map<string, any>) => {
    addStep(name: string, queue: any, data: any, compensate?: (result: any) => Promise<void>): /*elided*/ any;
    execute(): Promise<any[]>;
    compensate(): Promise<void>;
    getSagaId(): string;
    getCompletedSteps(): string[];
};
/**
 * Generates a unique job ID.
 */
export declare function generateJobId(prefix?: string): string;
/**
 * Formats duration in milliseconds to human-readable string.
 */
export declare function formatDuration(ms: number): string;
/**
 * Calculates exponential backoff delay.
 */
export declare function calculateExponentialBackoff(attemptNumber: number, baseDelay?: number, maxDelay?: number): number;
/**
 * Validates and sanitizes job data.
 */
export declare function sanitizeJobData(data: any): any;
/**
 * Creates a unique idempotency key from job data.
 */
export declare function createIdempotencyKey(prefix: string, data: Record<string, any>, fields: string[]): string;
/**
 * 25. Applies rate limiting to a queue.
 *
 * @param {any} queue - Bull queue instance
 * @param {RateLimitConfig} config - Rate limit configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await applyRateLimit(apiQueue, {
 *   max: 100,
 *   duration: 60000,
 *   bounceBack: true
 * });
 * ```
 */
export declare const applyRateLimit: (queue: any, config: RateLimitConfig) => Promise<void>;
/**
 * 26. Creates a sliding window rate limiter with Redis.
 *
 * @param {any} redis - Redis client
 * @param {string} key - Rate limit key
 * @param {number} limit - Max requests
 * @param {number} windowMs - Window duration
 * @returns {Object} Sliding window limiter
 *
 * @example
 * ```typescript
 * const limiter = createSlidingWindowLimiter(
 *   redisClient,
 *   'api:patient:123',
 *   100,
 *   60000
 * );
 * const allowed = await limiter.checkLimit();
 * if (allowed) {
 *   await processJob();
 * }
 * ```
 */
export declare const createSlidingWindowLimiter: (redis: any, key: string, limit: number, windowMs: number) => {
    checkLimit(): Promise<boolean>;
    getCurrentCount(): Promise<number>;
    reset(): Promise<void>;
};
/**
 * 27. Creates a token bucket rate limiter.
 *
 * @param {number} capacity - Bucket capacity
 * @param {number} refillRate - Tokens per interval
 * @param {number} refillInterval - Interval in ms
 * @returns {Object} Token bucket limiter
 *
 * @example
 * ```typescript
 * const limiter = createTokenBucketLimiter(100, 10, 1000);
 * const canProcess = await limiter.consume(5);
 * if (canProcess) {
 *   await queue.add('job', data);
 * }
 * ```
 */
export declare const createTokenBucketLimiter: (capacity: number, refillRate: number, refillInterval: number) => {
    consume(count?: number): Promise<boolean>;
    getAvailableTokens(): number;
    reset(): void;
};
/**
 * 28. Creates a dead letter queue handler.
 *
 * @param {string} dlqName - Dead letter queue name
 * @param {any} redisConnection - Redis connection
 * @param {any} jobModel - Sequelize Job model
 * @returns {Object} DLQ handler
 *
 * @example
 * ```typescript
 * const dlq = createDeadLetterQueue('failed-jobs', redisConfig, JobModel);
 * await dlq.moveToDeadLetter(failedJob, error);
 * const deadJobs = await dlq.getDeadLetters();
 * await dlq.retryDeadLetter('job-123');
 * ```
 */
export declare const createDeadLetterQueue: (dlqName: string, redisConnection: any, jobModel: any) => {
    moveToDeadLetter(job: any, error: Error): Promise<void>;
    getDeadLetters(limit?: number): Promise<DeadLetterJob[]>;
    retryDeadLetter(jobId: string, originalQueue: any): Promise<void>;
    purgeDeadLetters(olderThan?: Date): Promise<number>;
};
/**
 * 29. Creates automatic DLQ handler for monitoring queues.
 *
 * @param {Map<string, any>} queues - Map of queue instances
 * @param {any} dlq - Dead letter queue handler
 * @returns {Object} Auto DLQ handler
 *
 * @example
 * ```typescript
 * const autoDLQ = createAutoDLQHandler(queueManager.getAllQueues(), dlq);
 * autoDLQ.start();
 * // All failed jobs automatically moved to DLQ
 * autoDLQ.stop();
 * ```
 */
export declare const createAutoDLQHandler: (queues: Map<string, any>, dlq: any) => {
    start(): void;
    stop(): void;
    isRunning(): boolean;
};
/**
 * 30. Creates a job batch for bulk processing.
 *
 * @param {any} queue - Bull queue instance
 * @param {string} batchName - Batch name
 * @param {Array} jobs - Jobs to batch
 * @param {JobOptions} [options] - Batch job options
 * @returns {Promise<JobBatch>} Job batch
 *
 * @example
 * ```typescript
 * const batch = await createJobBatch(
 *   emailQueue,
 *   'daily-newsletters',
 *   patients.map(p => ({ name: 'newsletter', data: { email: p.email } })),
 *   { priority: 5 }
 * );
 * ```
 */
export declare const createJobBatch: (queue: any, batchName: string, jobs: Array<{
    name: string;
    data: any;
}>, options?: JobOptions) => Promise<JobBatch>;
/**
 * 31. Waits for batch completion.
 *
 * @param {any} queue - Bull queue instance
 * @param {JobBatch} batch - Job batch
 * @param {number} [timeout] - Timeout in ms
 * @returns {Promise<Object>} Batch results
 *
 * @example
 * ```typescript
 * const batch = await createJobBatch(queue, 'export', exportJobs);
 * const results = await waitForBatchCompletion(queue, batch);
 * console.log(`Batch complete: ${results.completed}/${results.total}`);
 * ```
 */
export declare const waitForBatchCompletion: (queue: any, batch: JobBatch, timeout?: number) => Promise<{
    batchId: string;
    total: number;
    completed: number;
    failed: number;
    results: any[];
    errors: any[];
}>;
/**
 * 32. Creates a job grouper for batching by key.
 *
 * @param {any} queue - Bull queue instance
 * @param {Function} groupKeyFn - Function to extract group key
 * @param {number} batchSize - Jobs per group
 * @param {number} flushInterval - Auto-flush interval
 * @returns {Object} Job grouper
 *
 * @example
 * ```typescript
 * const grouper = createJobGrouper(
 *   notificationQueue,
 *   (data) => data.patientId,
 *   10,
 *   30000
 * );
 * await grouper.add('notification', { patientId: '123', message: 'Test' });
 * ```
 */
export declare const createJobGrouper: (queue: any, groupKeyFn: (data: any) => string, batchSize?: number, flushInterval?: number) => {
    add(name: string, data: any, options?: JobOptions): Promise<void>;
    flush(): Promise<void>;
    getGroups(): Map<string, any[]>;
};
/**
 * 33. Gets comprehensive queue metrics.
 *
 * @param {any} queue - Bull queue instance
 * @returns {Promise<QueueMetrics>} Queue metrics
 *
 * @example
 * ```typescript
 * const metrics = await getQueueMetrics(processingQueue);
 * console.log(`Waiting: ${metrics.waiting}, Active: ${metrics.active}`);
 * ```
 */
export declare const getQueueMetrics: (queue: any) => Promise<QueueMetrics>;
/**
 * 34. Creates a metrics collector for periodic monitoring.
 *
 * @param {Map<string, any>} queues - Map of queues
 * @param {number} interval - Collection interval
 * @param {Function} onMetrics - Metrics callback
 * @returns {Object} Metrics collector
 *
 * @example
 * ```typescript
 * const collector = createMetricsCollector(
 *   queueManager.getAllQueues(),
 *   60000,
 *   async (metrics) => {
 *     await MetricsModel.bulkCreate(metrics);
 *   }
 * );
 * collector.start();
 * ```
 */
export declare const createMetricsCollector: (queues: Map<string, any>, interval: number, onMetrics: (metrics: QueueMetrics[]) => Promise<void>) => {
    start(): void;
    stop(): void;
    collectNow(): Promise<void>;
    isRunning(): boolean;
};
/**
 * 35. Creates a queue health checker with alerting.
 *
 * @param {any} queue - Bull queue instance
 * @param {Object} thresholds - Health thresholds
 * @param {Function} onUnhealthy - Alert callback
 * @returns {Object} Health checker
 *
 * @example
 * ```typescript
 * const healthChecker = createQueueHealthChecker(
 *   criticalQueue,
 *   { maxWaiting: 1000, maxActive: 100, maxFailedRate: 0.1 },
 *   async (status) => {
 *     await alertService.send(`Queue unhealthy: ${status.issues.join(', ')}`);
 *   }
 * );
 * ```
 */
export declare const createQueueHealthChecker: (queue: any, thresholds: {
    maxWaiting?: number;
    maxActive?: number;
    maxFailedRate?: number;
    checkInterval?: number;
}, onUnhealthy: (status: {
    healthy: boolean;
    issues: string[];
}) => Promise<void>) => {
    start(): void;
    stop(): void;
    checkNow(): Promise<void>;
    isRunning(): boolean;
};
/**
 * 36. Updates job progress.
 *
 * @param {any} job - Bull job instance
 * @param {number} percentage - Progress percentage (0-100)
 * @param {string} [message] - Progress message
 * @param {Record<string, any>} [data] - Additional data
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * const processor = async (job) => {
 *   await updateJobProgress(job, 25, 'Processing records...');
 *   await processRecords();
 *   await updateJobProgress(job, 100, 'Complete');
 * };
 * ```
 */
export declare const updateJobProgress: (job: any, percentage: number, message?: string, data?: Record<string, any>) => Promise<void>;
/**
 * 37. Creates a progress tracker with automatic calculation.
 *
 * @param {any} job - Bull job instance
 * @param {number} totalSteps - Total steps
 * @returns {Object} Progress tracker
 *
 * @example
 * ```typescript
 * const tracker = createProgressTracker(job, 4);
 * await tracker.step('Loading data');
 * await tracker.step('Validating');
 * await tracker.complete('Finished');
 * ```
 */
export declare const createProgressTracker: (job: any, totalSteps: number) => {
    step(message: string, data?: Record<string, any>): Promise<void>;
    setStep(step: number, message: string, data?: Record<string, any>): Promise<void>;
    complete(message?: string): Promise<void>;
    getCurrentStep(): number;
    getPercentage(): number;
};
/**
 * 38. Cancels a running or pending job.
 *
 * @param {any} queue - Bull queue instance
 * @param {string} jobId - Job ID to cancel
 * @returns {Promise<boolean>} True if cancelled
 *
 * @example
 * ```typescript
 * const cancelled = await cancelJob(reportQueue, 'long-running-report-123');
 * if (cancelled) {
 *   console.log('Report generation cancelled');
 * }
 * ```
 */
export declare const cancelJob: (queue: any, jobId: string) => Promise<boolean>;
/**
 * 39. Removes old completed and failed jobs.
 *
 * @param {any} queue - Bull queue instance
 * @param {Object} config - Cleanup configuration
 * @returns {Promise<Object>} Cleanup results
 *
 * @example
 * ```typescript
 * const result = await cleanupOldJobs(emailQueue, {
 *   completedOlderThan: 7 * 24 * 60 * 60 * 1000,
 *   failedOlderThan: 30 * 24 * 60 * 60 * 1000,
 *   limit: 1000
 * });
 * ```
 */
export declare const cleanupOldJobs: (queue: any, config: {
    completedOlderThan?: number;
    failedOlderThan?: number;
    limit?: number;
}) => Promise<{
    removed: number;
    completedRemoved: number;
    failedRemoved: number;
}>;
/**
 * 40. Creates automatic job cleanup scheduler.
 *
 * @param {any} queue - Bull queue instance
 * @param {Object} config - Cleanup configuration
 * @returns {Object} Cleanup scheduler
 *
 * @example
 * ```typescript
 * const cleanupScheduler = createJobCleanupScheduler(processingQueue, {
 *   interval: 24 * 60 * 60 * 1000,
 *   completedOlderThan: 7 * 24 * 60 * 60 * 1000,
 *   failedOlderThan: 30 * 24 * 60 * 60 * 1000
 * });
 * cleanupScheduler.start();
 * ```
 */
export declare const createJobCleanupScheduler: (queue: any, config: {
    interval: number;
    completedOlderThan?: number;
    failedOlderThan?: number;
    limit?: number;
}) => {
    start(): void;
    stop(): void;
    runNow(): Promise<void>;
    isRunning(): boolean;
};
/**
 * 41. Creates exponential backoff retry strategy.
 *
 * @param {number} initialDelay - Initial delay in ms
 * @param {number} maxDelay - Maximum delay in ms
 * @param {number} multiplier - Backoff multiplier
 * @returns {Object} Retry strategy
 *
 * @example
 * ```typescript
 * const retryStrategy = createExponentialBackoff(1000, 60000, 2);
 * await queue.add('api-call', data, {
 *   attempts: 5,
 *   backoff: retryStrategy
 * });
 * ```
 */
export declare const createExponentialBackoff: (initialDelay?: number, maxDelay?: number, multiplier?: number) => {
    type: string;
    calculate: (attemptsMade: number) => number;
};
/**
 * 42. Creates custom retry strategy with conditional logic.
 *
 * @param {Function} shouldRetry - Retry condition function
 * @param {Function} getDelay - Delay calculation function
 * @returns {Object} Custom retry handler
 *
 * @example
 * ```typescript
 * const customRetry = createCustomRetryStrategy(
 *   (job, error) => error.name !== 'ValidationError',
 *   (attemptsMade) => attemptsMade * 2000
 * );
 * ```
 */
export declare const createCustomRetryStrategy: (shouldRetry: (job: any, error: Error) => boolean, getDelay: (attemptsMade: number) => number) => {
    handle(job: any, error: Error): Promise<{
        retry: boolean;
        delay?: number;
    }>;
};
/**
 * 43. Creates event-driven job workflow.
 *
 * @param {Map<string, any>} queues - Map of queue instances
 * @returns {Object} Workflow builder
 *
 * @example
 * ```typescript
 * const workflow = createJobWorkflow(queueManager.getAllQueues());
 * workflow
 *   .start('upload-queue', 'process-upload', uploadData)
 *   .then('validation-queue', 'validate-file')
 *   .then('processing-queue', 'process-data')
 *   .execute();
 * ```
 */
export declare const createJobWorkflow: (queues: Map<string, any>) => {
    start(queueName: string, jobName: string, data: any): /*elided*/ any;
    then(queueName: string, jobName: string, transformData?: (prevResult: any) => any): /*elided*/ any;
    onComplete(callback: (results: any[]) => Promise<void>): /*elided*/ any;
    onError(callback: (error: Error, step: number) => Promise<void>): /*elided*/ any;
    execute(): Promise<any[]>;
};
/**
 * 44. Creates job event listeners.
 *
 * @param {any} queue - Bull queue instance
 * @param {Object} handlers - Event handlers
 * @returns {Function} Cleanup function
 *
 * @example
 * ```typescript
 * const stopListening = createJobEventListeners(processingQueue, {
 *   onActive: async (job) => console.log('Job started'),
 *   onCompleted: async (job, result) => console.log('Job complete'),
 * });
 * ```
 */
export declare const createJobEventListeners: (queue: any, handlers: {
    onActive?: (job: any) => Promise<void>;
    onCompleted?: (job: any, result: any) => Promise<void>;
    onFailed?: (job: any, error: Error) => Promise<void>;
    onProgress?: (job: any, progress: any) => Promise<void>;
    onStalled?: (job: any) => Promise<void>;
}) => (() => void);
/**
 * 45. Creates parent-child job relationships.
 *
 * @param {any} parentQueue - Parent queue
 * @param {any} childQueue - Child queue
 * @param {string} parentJobName - Parent job name
 * @param {any} parentData - Parent data
 * @param {Array} childJobs - Child job specifications
 * @returns {Promise<ParentChildRelation>} Parent-child relation
 *
 * @example
 * ```typescript
 * const relation = await createParentChildJobs(
 *   reportQueue,
 *   processingQueue,
 *   'generate-report',
 *   { reportId: '123' },
 *   [
 *     { name: 'fetch-data', data: { source: 'db1' } },
 *     { name: 'fetch-data', data: { source: 'db2' } }
 *   ]
 * );
 * ```
 */
export declare const createParentChildJobs: (parentQueue: any, childQueue: any, parentJobName: string, parentData: any, childJobs: Array<{
    name: string;
    data: any;
    options?: JobOptions;
}>) => Promise<ParentChildRelation>;
declare const _default: {
    JobOptionsSchema: any;
    JobDataSchema: any;
    WorkerPoolConfigSchema: any;
    RateLimitConfigSchema: any;
    DistributedLockConfigSchema: any;
    createProductionJobModel: (sequelize: any, DataTypes: any) => any;
    createJobScheduleModel: (sequelize: any, DataTypes: any) => any;
    createJobExecutionLogModel: (sequelize: any, DataTypes: any) => any;
    createIdempotencyKeyModel: (sequelize: any, DataTypes: any) => any;
    createDistributedLockModel: (sequelize: any, DataTypes: any) => any;
    createProductionQueue: (queueName: string, redisConnection: any, defaultJobOptions?: Partial<JobOptions>) => any;
    createValidatedJob: (queue: any, jobName: string, data: any, schema?: z.ZodSchema, options?: JobOptions) => Promise<any>;
    createIdempotentJob: (queue: any, jobName: string, data: any, idempotencyKey: string, idempotencyModel: any, options?: JobOptions) => Promise<{
        job?: any;
        cached: boolean;
        result?: any;
    }>;
    updateIdempotencyKey: (idempotencyModel: any, idempotencyKey: string, result: any, status: "completed" | "failed") => Promise<void>;
    cleanupExpiredIdempotencyKeys: (idempotencyModel: any) => Promise<number>;
    acquireDistributedLock: (redis: any, lockKey: string, ownerId: string, ttl: number) => Promise<boolean>;
    releaseDistributedLock: (redis: any, lockKey: string, ownerId: string) => Promise<boolean>;
    extendDistributedLock: (redis: any, lockKey: string, ownerId: string, additionalTtl: number) => Promise<boolean>;
    createDistributedLockManager: (redis: any, lockModel: any) => {
        acquire(config: {
            lockKey: string;
            ttl: number;
            retries?: number;
            retryDelay?: number;
            extendInterval?: number;
            jobId?: string;
            resourceType?: string;
            resourceId?: string;
        }): Promise<{
            lockId: string;
            ownerId: string;
        } | null>;
        release(lockId: string): Promise<boolean>;
        releaseAll(): Promise<number>;
        cleanupExpired(): Promise<number>;
    };
    withDistributedLock: <T>(redis: any, lockKey: string, fn: () => Promise<T>, config?: {
        ttl: number;
        retries?: number;
        retryDelay?: number;
    }) => Promise<T>;
    createCronSchedule: (queue: any, scheduleModel: any, config: {
        name: string;
        cronExpression: string;
        jobName: string;
        jobData?: any;
        jobOptions?: JobOptions;
        timezone?: string;
        startDate?: Date;
        endDate?: Date;
        maxRuns?: number;
        enabled?: boolean;
        description?: string;
    }) => Promise<any>;
    updateScheduleRunTracking: (scheduleModel: any, scheduleName: string, jobId: string) => Promise<void>;
    toggleSchedule: (queue: any, scheduleModel: any, scheduleName: string, enabled: boolean) => Promise<void>;
    createProductionWorker: (queue: any, processor: (job: any) => Promise<any>, config: WorkerPoolConfig, executionLogModel?: any) => any;
    aggregateJobMetrics: (executionLogModel: any, filters: {
        queueName?: string;
        jobName?: string;
        workerId?: string;
        startDate?: Date;
        endDate?: Date;
        status?: string;
    }) => Promise<{
        totalJobs: number;
        successfulJobs: number;
        failedJobs: number;
        successRate: number;
        avgDuration: number;
        minDuration: number;
        maxDuration: number;
        p50Duration: number;
        p95Duration: number;
        p99Duration: number;
        avgCpuUsage: number;
        avgMemoryUsage: number;
    }>;
    createNestJSQueueProvider: (queueName: string, redisConfig: any) => {
        provide: string;
        useFactory: () => any;
    };
    Process: (jobName: string) => MethodDecorator;
    createJobCircuitBreaker: (config: {
        failureThreshold: number;
        resetTimeout: number;
        halfOpenRetries: number;
        onStateChange?: (state: string) => void;
    }) => {
        execute<T>(fn: () => Promise<T>): Promise<T>;
        getState(): string;
        getMetrics(): {
            state: "closed" | "open" | "half-open";
            failureCount: number;
            successCount: number;
            lastFailureTime: Date | null;
        };
        reset(): void;
    };
    createSagaCoordinator: (queues: Map<string, any>) => {
        addStep(name: string, queue: any, data: any, compensate?: (result: any) => Promise<void>): /*elided*/ any;
        execute(): Promise<any[]>;
        compensate(): Promise<void>;
        getSagaId(): string;
        getCompletedSteps(): string[];
    };
    applyRateLimit: (queue: any, config: RateLimitConfig) => Promise<void>;
    createSlidingWindowLimiter: (redis: any, key: string, limit: number, windowMs: number) => {
        checkLimit(): Promise<boolean>;
        getCurrentCount(): Promise<number>;
        reset(): Promise<void>;
    };
    createTokenBucketLimiter: (capacity: number, refillRate: number, refillInterval: number) => {
        consume(count?: number): Promise<boolean>;
        getAvailableTokens(): number;
        reset(): void;
    };
    createDeadLetterQueue: (dlqName: string, redisConnection: any, jobModel: any) => {
        moveToDeadLetter(job: any, error: Error): Promise<void>;
        getDeadLetters(limit?: number): Promise<DeadLetterJob[]>;
        retryDeadLetter(jobId: string, originalQueue: any): Promise<void>;
        purgeDeadLetters(olderThan?: Date): Promise<number>;
    };
    createAutoDLQHandler: (queues: Map<string, any>, dlq: any) => {
        start(): void;
        stop(): void;
        isRunning(): boolean;
    };
    createJobBatch: (queue: any, batchName: string, jobs: Array<{
        name: string;
        data: any;
    }>, options?: JobOptions) => Promise<JobBatch>;
    waitForBatchCompletion: (queue: any, batch: JobBatch, timeout?: number) => Promise<{
        batchId: string;
        total: number;
        completed: number;
        failed: number;
        results: any[];
        errors: any[];
    }>;
    createJobGrouper: (queue: any, groupKeyFn: (data: any) => string, batchSize?: number, flushInterval?: number) => {
        add(name: string, data: any, options?: JobOptions): Promise<void>;
        flush(): Promise<void>;
        getGroups(): Map<string, any[]>;
    };
    getQueueMetrics: (queue: any) => Promise<QueueMetrics>;
    createMetricsCollector: (queues: Map<string, any>, interval: number, onMetrics: (metrics: QueueMetrics[]) => Promise<void>) => {
        start(): void;
        stop(): void;
        collectNow(): Promise<void>;
        isRunning(): boolean;
    };
    createQueueHealthChecker: (queue: any, thresholds: {
        maxWaiting?: number;
        maxActive?: number;
        maxFailedRate?: number;
        checkInterval?: number;
    }, onUnhealthy: (status: {
        healthy: boolean;
        issues: string[];
    }) => Promise<void>) => {
        start(): void;
        stop(): void;
        checkNow(): Promise<void>;
        isRunning(): boolean;
    };
    updateJobProgress: (job: any, percentage: number, message?: string, data?: Record<string, any>) => Promise<void>;
    createProgressTracker: (job: any, totalSteps: number) => {
        step(message: string, data?: Record<string, any>): Promise<void>;
        setStep(step: number, message: string, data?: Record<string, any>): Promise<void>;
        complete(message?: string): Promise<void>;
        getCurrentStep(): number;
        getPercentage(): number;
    };
    cancelJob: (queue: any, jobId: string) => Promise<boolean>;
    cleanupOldJobs: (queue: any, config: {
        completedOlderThan?: number;
        failedOlderThan?: number;
        limit?: number;
    }) => Promise<{
        removed: number;
        completedRemoved: number;
        failedRemoved: number;
    }>;
    createJobCleanupScheduler: (queue: any, config: {
        interval: number;
        completedOlderThan?: number;
        failedOlderThan?: number;
        limit?: number;
    }) => {
        start(): void;
        stop(): void;
        runNow(): Promise<void>;
        isRunning(): boolean;
    };
    createExponentialBackoff: (initialDelay?: number, maxDelay?: number, multiplier?: number) => {
        type: string;
        calculate: (attemptsMade: number) => number;
    };
    createCustomRetryStrategy: (shouldRetry: (job: any, error: Error) => boolean, getDelay: (attemptsMade: number) => number) => {
        handle(job: any, error: Error): Promise<{
            retry: boolean;
            delay?: number;
        }>;
    };
    createJobWorkflow: (queues: Map<string, any>) => {
        start(queueName: string, jobName: string, data: any): /*elided*/ any;
        then(queueName: string, jobName: string, transformData?: (prevResult: any) => any): /*elided*/ any;
        onComplete(callback: (results: any[]) => Promise<void>): /*elided*/ any;
        onError(callback: (error: Error, step: number) => Promise<void>): /*elided*/ any;
        execute(): Promise<any[]>;
    };
    createJobEventListeners: (queue: any, handlers: {
        onActive?: (job: any) => Promise<void>;
        onCompleted?: (job: any, result: any) => Promise<void>;
        onFailed?: (job: any, error: Error) => Promise<void>;
        onProgress?: (job: any, progress: any) => Promise<void>;
        onStalled?: (job: any) => Promise<void>;
    }) => (() => void);
    createParentChildJobs: (parentQueue: any, childQueue: any, parentJobName: string, parentData: any, childJobs: Array<{
        name: string;
        data: any;
        options?: JobOptions;
    }>) => Promise<ParentChildRelation>;
    generateJobId: typeof generateJobId;
    formatDuration: typeof formatDuration;
    calculateExponentialBackoff: typeof calculateExponentialBackoff;
    sanitizeJobData: typeof sanitizeJobData;
    createIdempotencyKey: typeof createIdempotencyKey;
};
export default _default;
//# sourceMappingURL=background-jobs-kit.prod.d.ts.map