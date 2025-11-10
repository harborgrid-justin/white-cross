/**
 * LOC: QUEUE-JOB-001
 * File: /reuse/queue-jobs-kit.ts
 *
 * UPSTREAM (imports from):
 *   - bull / bullmq
 *   - @nestjs/bull
 *   - sequelize
 *   - sequelize-typescript
 *   - ioredis
 *
 * DOWNSTREAM (imported by):
 *   - Background job processors
 *   - Queue service modules
 *   - Job scheduling services
 *   - Worker pool managers
 */
/**
 * File: /reuse/queue-jobs-kit.ts
 * Locator: WC-UTL-QUEUE-001
 * Purpose: Queue and Job Processing Utilities - Comprehensive job queue management for NestJS + Bull/BullMQ + Sequelize
 *
 * Upstream: bull, bullmq, @nestjs/bull, sequelize, sequelize-typescript, ioredis
 * Downstream: ../backend/*, queue services, job processors, scheduler modules
 * Dependencies: NestJS 10.x, Bull 4.x / BullMQ 4.x, Sequelize 6.x, TypeScript 5.x, Redis
 * Exports: 45 utility functions for job queues, scheduling, workers, retries, metrics, batching, rate limiting
 *
 * LLM Context: Comprehensive job queue and background processing utilities for White Cross healthcare system.
 * Provides queue creation/management, job scheduling (cron, delayed), priority handling, worker pools,
 * retry strategies, dead letter queues, progress tracking, job cancellation, batching, metrics monitoring,
 * result storage, event-driven workflows, parent-child relationships, rate limiting, and Sequelize models
 * for persistent job tracking. Essential for scalable healthcare background processing.
 */
interface JobOptions {
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
}
interface RepeatOptions {
    cron?: string;
    tz?: string;
    startDate?: Date | string;
    endDate?: Date | string;
    limit?: number;
    every?: number;
    count?: number;
}
interface QueueMetrics {
    queueName: string;
    waiting: number;
    active: number;
    completed: number;
    failed: number;
    delayed: number;
    paused: boolean;
    timestamp: Date;
}
interface WorkerPoolConfig {
    concurrency: number;
    maxStalledCount?: number;
    stalledInterval?: number;
    lockDuration?: number;
    lockRenewTime?: number;
}
interface RateLimitConfig {
    max: number;
    duration: number;
    bounceBack?: boolean;
    groupKey?: string;
}
interface JobBatch {
    batchId: string;
    jobIds: string[];
    status: 'pending' | 'processing' | 'completed' | 'failed';
    createdAt: Date;
    completedAt?: Date;
}
interface ParentChildRelation {
    parentJobId: string;
    childJobIds: string[];
    parentQueue: string;
    childQueue: string;
    dependencyMode: 'all' | 'any';
}
interface DeadLetterJob {
    jobId: string;
    queueName: string;
    failedAt: Date;
    attempts: number;
    error: string;
    data: any;
    canRetry: boolean;
}
/**
 * 1. Creates Sequelize model for persistent job tracking.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {any} DataTypes - Sequelize DataTypes
 * @returns {any} Job model
 *
 * @example
 * ```typescript
 * const JobModel = createJobModel(sequelize, DataTypes);
 * const job = await JobModel.create({
 *   jobId: 'job-123',
 *   queueName: 'patient-notifications',
 *   status: 'active',
 *   data: { patientId: '456' }
 * });
 * ```
 */
export declare const createJobModel: (sequelize: any, DataTypes: any) => any;
/**
 * 2. Creates Sequelize model for queue metadata and configuration.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {any} DataTypes - Sequelize DataTypes
 * @returns {any} Queue model
 *
 * @example
 * ```typescript
 * const QueueModel = createQueueModel(sequelize, DataTypes);
 * const queue = await QueueModel.create({
 *   name: 'patient-notifications',
 *   description: 'Patient email and SMS notifications',
 *   maxConcurrency: 10,
 *   rateLimit: { max: 100, duration: 60000 }
 * });
 * ```
 */
export declare const createQueueModel: (sequelize: any, DataTypes: any) => any;
/**
 * 3. Creates Sequelize model for job results and audit trail.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {any} DataTypes - Sequelize DataTypes
 * @returns {any} JobResult model
 *
 * @example
 * ```typescript
 * const JobResultModel = createJobResultModel(sequelize, DataTypes);
 * await JobResultModel.create({
 *   jobId: 'job-123',
 *   queueName: 'email-queue',
 *   status: 'completed',
 *   result: { emailSent: true, messageId: 'msg-456' },
 *   duration: 1234
 * });
 * ```
 */
export declare const createJobResultModel: (sequelize: any, DataTypes: any) => any;
/**
 * 4. Creates Sequelize model for job events and lifecycle tracking.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {any} DataTypes - Sequelize DataTypes
 * @returns {any} JobEvent model
 *
 * @example
 * ```typescript
 * const JobEventModel = createJobEventModel(sequelize, DataTypes);
 * await JobEventModel.create({
 *   jobId: 'job-123',
 *   eventType: 'progress',
 *   queueName: 'file-processing',
 *   data: { percentage: 75, message: 'Processing file...' }
 * });
 * ```
 */
export declare const createJobEventModel: (sequelize: any, DataTypes: any) => any;
/**
 * 5. Creates a Bull queue with default configuration.
 *
 * @param {string} queueName - Name of the queue
 * @param {any} redisConnection - Redis connection config or instance
 * @param {Partial<JobOptions>} [defaultJobOptions] - Default job options
 * @returns {any} Bull Queue instance
 *
 * @example
 * ```typescript
 * const emailQueue = createQueue(
 *   'patient-emails',
 *   { host: 'localhost', port: 6379 },
 *   { attempts: 3, backoff: { type: 'exponential', delay: 2000 } }
 * );
 * await emailQueue.add({ to: 'patient@example.com', subject: 'Appointment' });
 * ```
 */
export declare const createQueue: (queueName: string, redisConnection: any, defaultJobOptions?: Partial<JobOptions>) => any;
/**
 * 6. Creates a queue manager for handling multiple queues.
 *
 * @param {any} redisConnection - Redis connection config
 * @returns {Object} Queue manager instance
 *
 * @example
 * ```typescript
 * const queueManager = createQueueManager(redisConfig);
 * queueManager.registerQueue('emails', { priority: true });
 * queueManager.registerQueue('sms', { priority: false });
 * await queueManager.addJob('emails', 'send-welcome', emailData);
 * const allQueues = queueManager.getAllQueues();
 * ```
 */
export declare const createQueueManager: (redisConnection: any) => {
    registerQueue(queueName: string, options?: Partial<JobOptions>): any;
    getQueue(queueName: string): any | undefined;
    getAllQueues(): Map<string, any>;
    addJob(queueName: string, jobName: string, data: any, options?: JobOptions): Promise<any>;
    pauseQueue(queueName: string): Promise<void>;
    resumeQueue(queueName: string): Promise<void>;
    closeQueue(queueName: string): Promise<void>;
    closeAll(): Promise<void>;
};
/**
 * 7. Creates a queue with automatic persistence to database.
 *
 * @param {string} queueName - Name of the queue
 * @param {any} redisConnection - Redis connection
 * @param {any} jobModel - Sequelize Job model
 * @returns {any} Queue with persistence
 *
 * @example
 * ```typescript
 * const persistentQueue = createPersistentQueue(
 *   'patient-processing',
 *   redisConfig,
 *   JobModel
 * );
 * const job = await persistentQueue.add('process-patient', { id: '123' });
 * // Job is automatically saved to database
 * ```
 */
export declare const createPersistentQueue: (queueName: string, redisConnection: any, jobModel: any) => any;
/**
 * 8. Schedules a job to run at a specific time.
 *
 * @param {any} queue - Bull queue instance
 * @param {string} jobName - Name of the job
 * @param {any} data - Job data
 * @param {Date | number} scheduleTime - When to run (Date or delay in ms)
 * @returns {Promise<any>} Scheduled job
 *
 * @example
 * ```typescript
 * // Schedule appointment reminder for tomorrow
 * const reminderJob = await scheduleDelayedJob(
 *   appointmentQueue,
 *   'send-reminder',
 *   { patientId: '123', appointmentId: '456' },
 *   new Date(Date.now() + 24 * 60 * 60 * 1000)
 * );
 * ```
 */
export declare const scheduleDelayedJob: (queue: any, jobName: string, data: any, scheduleTime: Date | number) => Promise<any>;
/**
 * 9. Creates a cron-based repeating job.
 *
 * @param {any} queue - Bull queue instance
 * @param {string} jobName - Name of the job
 * @param {any} data - Job data
 * @param {string} cronExpression - Cron expression
 * @param {string} [timezone] - Timezone for cron
 * @returns {Promise<any>} Repeating job
 *
 * @example
 * ```typescript
 * // Daily patient report at 8 AM
 * const reportJob = await createCronJob(
 *   reportQueue,
 *   'daily-patient-report',
 *   { reportType: 'summary' },
 *   '0 8 * * *',
 *   'America/New_York'
 * );
 * ```
 */
export declare const createCronJob: (queue: any, jobName: string, data: any, cronExpression: string, timezone?: string) => Promise<any>;
/**
 * 10. Creates a job that repeats at fixed intervals.
 *
 * @param {any} queue - Bull queue instance
 * @param {string} jobName - Name of the job
 * @param {any} data - Job data
 * @param {number} intervalMs - Interval in milliseconds
 * @param {number} [maxCount] - Maximum repetitions
 * @returns {Promise<any>} Repeating job
 *
 * @example
 * ```typescript
 * // Check patient vitals every 5 minutes, 12 times (1 hour)
 * const vitalsJob = await createIntervalJob(
 *   monitoringQueue,
 *   'check-vitals',
 *   { patientId: '123' },
 *   5 * 60 * 1000,
 *   12
 * );
 * ```
 */
export declare const createIntervalJob: (queue: any, jobName: string, data: any, intervalMs: number, maxCount?: number) => Promise<any>;
/**
 * 11. Removes a repeatable job by key.
 *
 * @param {any} queue - Bull queue instance
 * @param {string} repeatKey - Repeat job key
 * @returns {Promise<boolean>} True if removed
 *
 * @example
 * ```typescript
 * const repeatableJobs = await queue.getRepeatableJobs();
 * for (const job of repeatableJobs) {
 *   if (job.name === 'old-job') {
 *     await removeRepeatableJob(queue, job.key);
 *   }
 * }
 * ```
 */
export declare const removeRepeatableJob: (queue: any, repeatKey: string) => Promise<boolean>;
/**
 * 12. Adds a high-priority job to the queue.
 *
 * @param {any} queue - Bull queue instance
 * @param {string} jobName - Name of the job
 * @param {any} data - Job data
 * @param {number} [priority=10] - Priority (higher = processed first)
 * @returns {Promise<any>} High priority job
 *
 * @example
 * ```typescript
 * // Emergency patient alert - highest priority
 * const emergencyJob = await addHighPriorityJob(
 *   notificationQueue,
 *   'emergency-alert',
 *   { patientId: '123', message: 'Critical vitals' },
 *   100
 * );
 * ```
 */
export declare const addHighPriorityJob: (queue: any, jobName: string, data: any, priority?: number) => Promise<any>;
/**
 * 13. Creates a priority-based job scheduler.
 *
 * @param {any} queue - Bull queue instance
 * @returns {Object} Priority scheduler
 *
 * @example
 * ```typescript
 * const priorityScheduler = createPriorityJobScheduler(taskQueue);
 * await priorityScheduler.addCritical('urgent-task', urgentData);
 * await priorityScheduler.addNormal('routine-task', routineData);
 * await priorityScheduler.addLow('background-task', backgroundData);
 * ```
 */
export declare const createPriorityJobScheduler: (queue: any) => {
    addCritical(jobName: string, data: any, options?: JobOptions): Promise<any>;
    addHigh(jobName: string, data: any, options?: JobOptions): Promise<any>;
    addNormal(jobName: string, data: any, options?: JobOptions): Promise<any>;
    addLow(jobName: string, data: any, options?: JobOptions): Promise<any>;
    addBackground(jobName: string, data: any, options?: JobOptions): Promise<any>;
};
/**
 * 14. Dynamically adjusts job priority based on conditions.
 *
 * @param {any} queue - Bull queue instance
 * @param {string} jobId - Job ID
 * @param {Function} priorityFn - Function to calculate new priority
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await adjustJobPriority(
 *   processingQueue,
 *   'job-123',
 *   (job) => {
 *     const age = Date.now() - job.timestamp;
 *     return Math.min(100, Math.floor(age / 60000)); // Increase priority over time
 *   }
 * );
 * ```
 */
export declare const adjustJobPriority: (queue: any, jobId: string, priorityFn: (job: any) => number) => Promise<void>;
/**
 * 15. Creates a worker pool with configurable concurrency.
 *
 * @param {any} queue - Bull queue instance
 * @param {Function} processor - Job processor function
 * @param {WorkerPoolConfig} config - Worker configuration
 * @returns {any} Worker instance
 *
 * @example
 * ```typescript
 * const worker = createWorkerPool(
 *   imageQueue,
 *   async (job) => {
 *     return await processImage(job.data.imageUrl);
 *   },
 *   { concurrency: 5, lockDuration: 30000 }
 * );
 * ```
 */
export declare const createWorkerPool: (queue: any, processor: (job: any) => Promise<any>, config: WorkerPoolConfig) => any;
/**
 * 16. Creates a worker pool manager for multiple queues.
 *
 * @param {any} redisConnection - Redis connection
 * @returns {Object} Worker pool manager
 *
 * @example
 * ```typescript
 * const workerManager = createWorkerPoolManager(redisConfig);
 * workerManager.registerWorker('emails', emailProcessor, { concurrency: 10 });
 * workerManager.registerWorker('sms', smsProcessor, { concurrency: 20 });
 * await workerManager.pauseWorker('emails');
 * await workerManager.resumeWorker('emails');
 * ```
 */
export declare const createWorkerPoolManager: (redisConnection: any) => {
    registerWorker(queueName: string, processor: (job: any) => Promise<any>, config: WorkerPoolConfig): any;
    getWorker(queueName: string): any | undefined;
    pauseWorker(queueName: string): Promise<void>;
    resumeWorker(queueName: string): Promise<void>;
    closeWorker(queueName: string): Promise<void>;
    closeAll(): Promise<void>;
    getAllWorkers(): Map<string, any>;
};
/**
 * 17. Creates an auto-scaling worker pool based on queue size.
 *
 * @param {any} queue - Bull queue instance
 * @param {Function} processor - Job processor
 * @param {Object} config - Scaling configuration
 * @returns {Object} Auto-scaling worker pool
 *
 * @example
 * ```typescript
 * const autoScalingWorker = createAutoScalingWorkerPool(
 *   processingQueue,
 *   jobProcessor,
 *   {
 *     minConcurrency: 1,
 *     maxConcurrency: 20,
 *     scaleUpThreshold: 100,
 *     scaleDownThreshold: 10,
 *     checkInterval: 30000
 *   }
 * );
 * ```
 */
export declare const createAutoScalingWorkerPool: (queue: any, processor: (job: any) => Promise<any>, config: {
    minConcurrency: number;
    maxConcurrency: number;
    scaleUpThreshold: number;
    scaleDownThreshold: number;
    checkInterval?: number;
}) => {
    getWorker: () => any;
    getCurrentConcurrency: () => number;
    stop: () => Promise<void>;
};
/**
 * 18. Creates an exponential backoff retry strategy.
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
 * 19. Creates a custom retry strategy with conditional logic.
 *
 * @param {Function} shouldRetry - Function to determine if job should retry
 * @param {Function} getDelay - Function to calculate retry delay
 * @returns {Object} Custom retry handler
 *
 * @example
 * ```typescript
 * const customRetry = createCustomRetryStrategy(
 *   (job, error) => {
 *     // Don't retry validation errors
 *     return error.name !== 'ValidationError';
 *   },
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
 * 20. Creates a retry strategy with circuit breaker pattern.
 *
 * @param {Object} config - Circuit breaker configuration
 * @returns {Object} Circuit breaker retry strategy
 *
 * @example
 * ```typescript
 * const circuitBreaker = createCircuitBreakerRetry({
 *   failureThreshold: 5,
 *   resetTimeout: 60000,
 *   halfOpenRetries: 3
 * });
 * // Stops retrying after threshold failures, resets after timeout
 * ```
 */
export declare const createCircuitBreakerRetry: (config: {
    failureThreshold: number;
    resetTimeout: number;
    halfOpenRetries: number;
}) => {
    shouldRetry(error: Error): boolean;
    recordSuccess(): void;
    getState(): string;
    reset(): void;
};
/**
 * 21. Creates a dead letter queue for failed jobs.
 *
 * @param {string} dlqName - Name of dead letter queue
 * @param {any} redisConnection - Redis connection
 * @param {any} jobModel - Sequelize Job model
 * @returns {Object} Dead letter queue handler
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
 * 22. Creates an automatic DLQ handler that monitors all queues.
 *
 * @param {Map<string, any>} queues - Map of queue names to queue instances
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
 * 23. Updates job progress with percentage and message.
 *
 * @param {any} job - Bull job instance
 * @param {number} percentage - Progress percentage (0-100)
 * @param {string} [message] - Progress message
 * @param {Record<string, any>} [data] - Additional progress data
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * // Inside job processor
 * const processor = async (job) => {
 *   await updateJobProgress(job, 25, 'Processing patient records...');
 *   await processRecords();
 *   await updateJobProgress(job, 50, 'Generating report...');
 *   await generateReport();
 *   await updateJobProgress(job, 100, 'Complete');
 * };
 * ```
 */
export declare const updateJobProgress: (job: any, percentage: number, message?: string, data?: Record<string, any>) => Promise<void>;
/**
 * 24. Creates a progress tracker with automatic percentage calculation.
 *
 * @param {any} job - Bull job instance
 * @param {number} totalSteps - Total number of steps
 * @returns {Object} Progress tracker
 *
 * @example
 * ```typescript
 * const tracker = createProgressTracker(job, 4);
 * await tracker.step('Loading patient data');
 * await tracker.step('Validating records');
 * await tracker.step('Processing results');
 * await tracker.complete('Finished successfully');
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
 * 25. Monitors job progress and logs to database.
 *
 * @param {any} queue - Bull queue instance
 * @param {any} jobEventModel - Sequelize JobEvent model
 * @returns {Function} Cleanup function
 *
 * @example
 * ```typescript
 * const stopMonitoring = monitorJobProgress(processingQueue, JobEventModel);
 * // All job progress is logged to database
 * stopMonitoring(); // Stop monitoring
 * ```
 */
export declare const monitorJobProgress: (queue: any, jobEventModel: any) => (() => void);
/**
 * 26. Cancels a running or pending job.
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
 * 27. Removes old completed and failed jobs.
 *
 * @param {any} queue - Bull queue instance
 * @param {Object} config - Cleanup configuration
 * @returns {Promise<Object>} Cleanup results
 *
 * @example
 * ```typescript
 * const result = await cleanupOldJobs(emailQueue, {
 *   completedOlderThan: 7 * 24 * 60 * 60 * 1000, // 7 days
 *   failedOlderThan: 30 * 24 * 60 * 60 * 1000, // 30 days
 *   limit: 1000
 * });
 * console.log(`Cleaned ${result.removed} jobs`);
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
 * 28. Creates an automatic job cleanup scheduler.
 *
 * @param {any} queue - Bull queue instance
 * @param {Object} config - Cleanup configuration
 * @returns {Object} Cleanup scheduler
 *
 * @example
 * ```typescript
 * const cleanupScheduler = createJobCleanupScheduler(processingQueue, {
 *   interval: 24 * 60 * 60 * 1000, // Daily
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
 * 29. Creates a job batch for processing multiple related jobs.
 *
 * @param {any} queue - Bull queue instance
 * @param {string} batchName - Batch name
 * @param {Array<{name: string, data: any}>} jobs - Jobs to batch
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
 * console.log(`Created batch ${batch.batchId} with ${batch.jobIds.length} jobs`);
 * ```
 */
export declare const createJobBatch: (queue: any, batchName: string, jobs: Array<{
    name: string;
    data: any;
}>, options?: JobOptions) => Promise<JobBatch>;
/**
 * 30. Monitors batch completion and returns results.
 *
 * @param {any} queue - Bull queue instance
 * @param {JobBatch} batch - Job batch to monitor
 * @returns {Promise<Object>} Batch results
 *
 * @example
 * ```typescript
 * const batch = await createJobBatch(queue, 'export', exportJobs);
 * const results = await waitForBatchCompletion(queue, batch);
 * console.log(`Batch complete: ${results.completed}/${results.total}`);
 * console.log('Results:', results.results);
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
 * 31. Groups jobs by a key and processes them together.
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
 * // Jobs grouped by patientId and processed in batches
 * ```
 */
export declare const createJobGrouper: (queue: any, groupKeyFn: (data: any) => string, batchSize?: number, flushInterval?: number) => {
    add(name: string, data: any, options?: JobOptions): Promise<void>;
    flush(): Promise<void>;
    getGroups(): Map<string, any[]>;
};
/**
 * 32. Gets comprehensive queue metrics.
 *
 * @param {any} queue - Bull queue instance
 * @returns {Promise<QueueMetrics>} Queue metrics
 *
 * @example
 * ```typescript
 * const metrics = await getQueueMetrics(processingQueue);
 * console.log(`Queue: ${metrics.queueName}`);
 * console.log(`Waiting: ${metrics.waiting}, Active: ${metrics.active}`);
 * console.log(`Completed: ${metrics.completed}, Failed: ${metrics.failed}`);
 * ```
 */
export declare const getQueueMetrics: (queue: any) => Promise<QueueMetrics>;
/**
 * 33. Creates a metrics collector that periodically logs queue stats.
 *
 * @param {Map<string, any>} queues - Map of queues to monitor
 * @param {number} interval - Collection interval in ms
 * @param {Function} onMetrics - Callback for metrics
 * @returns {Object} Metrics collector
 *
 * @example
 * ```typescript
 * const collector = createMetricsCollector(
 *   queueManager.getAllQueues(),
 *   60000,
 *   async (metrics) => {
 *     await MetricsModel.bulkCreate(metrics);
 *     console.log('Metrics collected for', metrics.length, 'queues');
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
 * 34. Creates a queue health checker with alerting.
 *
 * @param {any} queue - Bull queue instance
 * @param {Object} thresholds - Health check thresholds
 * @param {Function} onUnhealthy - Alert callback
 * @returns {Object} Health checker
 *
 * @example
 * ```typescript
 * const healthChecker = createQueueHealthChecker(
 *   criticalQueue,
 *   {
 *     maxWaiting: 1000,
 *     maxActive: 100,
 *     maxFailedRate: 0.1
 *   },
 *   async (status) => {
 *     await alertService.send(`Queue unhealthy: ${status.issues.join(', ')}`);
 *   }
 * );
 * healthChecker.start();
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
 * 35. Stores job results in database with automatic cleanup.
 *
 * @param {any} queue - Bull queue instance
 * @param {any} jobResultModel - Sequelize JobResult model
 * @param {number} [retentionDays] - Days to retain results
 * @returns {Function} Cleanup function
 *
 * @example
 * ```typescript
 * const stopResultStorage = storeJobResults(
 *   processingQueue,
 *   JobResultModel,
 *   30 // Keep results for 30 days
 * );
 * // All job results automatically stored in database
 * ```
 */
export declare const storeJobResults: (queue: any, jobResultModel: any, retentionDays?: number) => (() => void);
/**
 * 36. Retrieves job results with filtering and pagination.
 *
 * @param {any} jobResultModel - Sequelize JobResult model
 * @param {Object} filters - Filter criteria
 * @returns {Promise<Object>} Paginated results
 *
 * @example
 * ```typescript
 * const results = await queryJobResults(JobResultModel, {
 *   queueName: 'email-queue',
 *   status: 'completed',
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date(),
 *   limit: 100,
 *   offset: 0
 * });
 * console.log(`Found ${results.total} results`);
 * ```
 */
export declare const queryJobResults: (jobResultModel: any, filters: {
    queueName?: string;
    status?: "completed" | "failed";
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
}) => Promise<{
    results: any[];
    total: number;
    page: number;
    pageSize: number;
}>;
/**
 * 37. Creates an event-driven job workflow with chaining.
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
 *   .onComplete(async (results) => {
 *     console.log('Workflow complete:', results);
 *   })
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
 * 38. Creates event listeners for job lifecycle with custom handlers.
 *
 * @param {any} queue - Bull queue instance
 * @param {Object} handlers - Event handlers
 * @returns {Function} Cleanup function
 *
 * @example
 * ```typescript
 * const stopListening = createJobEventListeners(processingQueue, {
 *   onActive: async (job) => {
 *     console.log(`Job ${job.id} started`);
 *   },
 *   onCompleted: async (job, result) => {
 *     await notifyUser(job.data.userId, 'Job complete');
 *   },
 *   onFailed: async (job, error) => {
 *     await logError(job.id, error);
 *   }
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
 * 39. Creates a parent job with child dependencies.
 *
 * @param {any} parentQueue - Parent queue instance
 * @param {any} childQueue - Child queue instance
 * @param {string} parentJobName - Parent job name
 * @param {any} parentData - Parent job data
 * @param {Array} childJobs - Child job specifications
 * @returns {Promise<ParentChildRelation>} Parent-child relationship
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
 * // Parent job waits for all children to complete
 * ```
 */
export declare const createParentChildJobs: (parentQueue: any, childQueue: any, parentJobName: string, parentData: any, childJobs: Array<{
    name: string;
    data: any;
    options?: JobOptions;
}>) => Promise<ParentChildRelation>;
/**
 * 40. Waits for all child jobs to complete before processing parent.
 *
 * @param {any} parentQueue - Parent queue
 * @param {any} childQueue - Child queue
 * @param {ParentChildRelation} relation - Parent-child relation
 * @returns {Promise<Object>} Combined results
 *
 * @example
 * ```typescript
 * const relation = await createParentChildJobs(...);
 * const results = await waitForChildJobs(parentQueue, childQueue, relation);
 * console.log('All children complete:', results.childResults);
 * console.log('Parent result:', results.parentResult);
 * ```
 */
export declare const waitForChildJobs: (parentQueue: any, childQueue: any, relation: ParentChildRelation, timeout?: number) => Promise<{
    parentResult: any;
    childResults: any[];
    allSucceeded: boolean;
}>;
/**
 * 41. Creates a job dependency graph processor.
 *
 * @param {Map<string, any>} queues - Map of queues
 * @returns {Object} Dependency graph processor
 *
 * @example
 * ```typescript
 * const graph = createJobDependencyGraph(queueManager.getAllQueues());
 * const rootJob = graph.addJob('fetch-data', fetchQueue, 'fetch', fetchData);
 * const processJob = graph.addJob('process', processQueue, 'process', processData, [rootJob]);
 * const saveJob = graph.addJob('save', saveQueue, 'save', saveData, [processJob]);
 * await graph.execute();
 * ```
 */
export declare const createJobDependencyGraph: (queues: Map<string, any>) => {
    addJob(id: string, queueName: string, jobName: string, data: any, dependencies?: string[]): string;
    execute(): Promise<Map<string, any>>;
    getGraph(): Map<string, any>;
};
/**
 * 42. Applies rate limiting to a queue.
 *
 * @param {any} queue - Bull queue instance
 * @param {RateLimitConfig} config - Rate limit configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await applyRateLimit(apiQueue, {
 *   max: 100, // Max 100 jobs
 *   duration: 60000, // Per minute
 *   bounceBack: true // Delay jobs that exceed limit
 * });
 * ```
 */
export declare const applyRateLimit: (queue: any, config: RateLimitConfig) => Promise<void>;
/**
 * 43. Creates a token bucket rate limiter for jobs.
 *
 * @param {number} capacity - Bucket capacity (max tokens)
 * @param {number} refillRate - Tokens added per interval
 * @param {number} refillInterval - Refill interval in ms
 * @returns {Object} Token bucket limiter
 *
 * @example
 * ```typescript
 * const limiter = createTokenBucketLimiter(100, 10, 1000);
 * const canProcess = await limiter.consume(5); // Try to consume 5 tokens
 * if (canProcess) {
 *   await queue.add('job', data);
 * }
 * ```
 */
export declare const createTokenBucketLimiter: (capacity: number, refillRate: number, refillInterval: number) => {
    consume(count?: number): Promise<boolean>;
    getAvailableTokens(): number;
    waitForTokens(count?: number, timeout?: number): Promise<boolean>;
    reset(): void;
};
/**
 * 44. Creates a sliding window rate limiter with Redis.
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
 *   'api:user:123',
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
    getTimeUntilReset(): Promise<number>;
};
/**
 * 45. Creates a distributed rate limiter across multiple workers.
 *
 * @param {any} redis - Redis client
 * @param {string} namespace - Rate limit namespace
 * @returns {Object} Distributed rate limiter
 *
 * @example
 * ```typescript
 * const limiter = createDistributedRateLimiter(redisClient, 'notifications');
 * const canSend = await limiter.tryAcquire('email', 1000, 60000);
 * if (canSend) {
 *   await sendEmail(data);
 * }
 * ```
 */
export declare const createDistributedRateLimiter: (redis: any, namespace: string) => {
    tryAcquire(resourceId: string, maxRequests: number, windowMs: number): Promise<boolean>;
    getStatus(resourceId: string): Promise<{
        current: number;
        remaining: number;
        resetAt: Date;
    }>;
};
export {};
//# sourceMappingURL=queue-jobs-kit.d.ts.map