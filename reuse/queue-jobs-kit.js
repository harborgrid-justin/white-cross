"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDistributedRateLimiter = exports.createSlidingWindowLimiter = exports.createTokenBucketLimiter = exports.applyRateLimit = exports.createJobDependencyGraph = exports.waitForChildJobs = exports.createParentChildJobs = exports.createJobEventListeners = exports.createJobWorkflow = exports.queryJobResults = exports.storeJobResults = exports.createQueueHealthChecker = exports.createMetricsCollector = exports.getQueueMetrics = exports.createJobGrouper = exports.waitForBatchCompletion = exports.createJobBatch = exports.createJobCleanupScheduler = exports.cleanupOldJobs = exports.cancelJob = exports.monitorJobProgress = exports.createProgressTracker = exports.updateJobProgress = exports.createAutoDLQHandler = exports.createDeadLetterQueue = exports.createCircuitBreakerRetry = exports.createCustomRetryStrategy = exports.createExponentialBackoff = exports.createAutoScalingWorkerPool = exports.createWorkerPoolManager = exports.createWorkerPool = exports.adjustJobPriority = exports.createPriorityJobScheduler = exports.addHighPriorityJob = exports.removeRepeatableJob = exports.createIntervalJob = exports.createCronJob = exports.scheduleDelayedJob = exports.createPersistentQueue = exports.createQueueManager = exports.createQueue = exports.createJobEventModel = exports.createJobResultModel = exports.createQueueModel = exports.createJobModel = void 0;
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
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
const createJobModel = (sequelize, DataTypes) => {
    return sequelize.define('Job', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        jobId: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            field: 'job_id',
        },
        queueName: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'queue_name',
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        data: {
            type: DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
        },
        options: {
            type: DataTypes.JSONB,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM('waiting', 'active', 'completed', 'failed', 'delayed', 'paused', 'stuck'),
            defaultValue: 'waiting',
        },
        priority: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        attempts: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        maxAttempts: {
            type: DataTypes.INTEGER,
            defaultValue: 3,
            field: 'max_attempts',
        },
        progress: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        processedOn: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'processed_on',
        },
        finishedOn: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'finished_on',
        },
        processedBy: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'processed_by',
        },
        failedReason: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: 'failed_reason',
        },
        stackTrace: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: 'stack_trace',
        },
        returnValue: {
            type: DataTypes.JSONB,
            allowNull: true,
            field: 'return_value',
        },
        parentJobId: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'parent_job_id',
        },
        delay: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        timestamp: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: 'created_at',
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: 'updated_at',
        },
    }, {
        tableName: 'jobs',
        timestamps: true,
        indexes: [
            { fields: ['job_id'] },
            { fields: ['queue_name'] },
            { fields: ['status'] },
            { fields: ['parent_job_id'] },
            { fields: ['created_at'] },
            { fields: ['queue_name', 'status'] },
        ],
    });
};
exports.createJobModel = createJobModel;
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
const createQueueModel = (sequelize, DataTypes) => {
    return sequelize.define('Queue', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        isPaused: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            field: 'is_paused',
        },
        maxConcurrency: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
            field: 'max_concurrency',
        },
        defaultJobOptions: {
            type: DataTypes.JSONB,
            allowNull: true,
            field: 'default_job_options',
        },
        rateLimit: {
            type: DataTypes.JSONB,
            allowNull: true,
            field: 'rate_limit',
        },
        retryStrategy: {
            type: DataTypes.JSONB,
            allowNull: true,
            field: 'retry_strategy',
        },
        metadata: {
            type: DataTypes.JSONB,
            defaultValue: {},
        },
        lastActiveAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'last_active_at',
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: 'created_at',
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: 'updated_at',
        },
    }, {
        tableName: 'queues',
        timestamps: true,
        indexes: [
            { fields: ['name'] },
            { fields: ['is_paused'] },
        ],
    });
};
exports.createQueueModel = createQueueModel;
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
const createJobResultModel = (sequelize, DataTypes) => {
    return sequelize.define('JobResult', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        jobId: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'job_id',
        },
        queueName: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'queue_name',
        },
        status: {
            type: DataTypes.ENUM('completed', 'failed'),
            allowNull: false,
        },
        result: {
            type: DataTypes.JSONB,
            allowNull: true,
        },
        error: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        errorStack: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: 'error_stack',
        },
        duration: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: 'Duration in milliseconds',
        },
        attempts: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
        },
        workerId: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'worker_id',
        },
        metadata: {
            type: DataTypes.JSONB,
            defaultValue: {},
        },
        completedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: 'completed_at',
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: 'created_at',
        },
    }, {
        tableName: 'job_results',
        timestamps: true,
        updatedAt: false,
        indexes: [
            { fields: ['job_id'] },
            { fields: ['queue_name'] },
            { fields: ['status'] },
            { fields: ['completed_at'] },
            { fields: ['queue_name', 'status'] },
        ],
    });
};
exports.createJobResultModel = createJobResultModel;
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
const createJobEventModel = (sequelize, DataTypes) => {
    return sequelize.define('JobEvent', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        jobId: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'job_id',
        },
        queueName: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'queue_name',
        },
        eventType: {
            type: DataTypes.ENUM('created', 'active', 'completed', 'failed', 'progress', 'stalled', 'removed', 'delayed', 'waiting'),
            allowNull: false,
            field: 'event_type',
        },
        data: {
            type: DataTypes.JSONB,
            allowNull: true,
        },
        workerId: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'worker_id',
        },
        timestamp: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: 'created_at',
        },
    }, {
        tableName: 'job_events',
        timestamps: true,
        updatedAt: false,
        indexes: [
            { fields: ['job_id'] },
            { fields: ['queue_name'] },
            { fields: ['event_type'] },
            { fields: ['timestamp'] },
            { fields: ['job_id', 'event_type'] },
        ],
    });
};
exports.createJobEventModel = createJobEventModel;
// ============================================================================
// QUEUE CREATION AND MANAGEMENT
// ============================================================================
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
const createQueue = (queueName, redisConnection, defaultJobOptions) => {
    // BullMQ style (adjust import as needed)
    const Queue = require('bullmq').Queue;
    return new Queue(queueName, {
        connection: redisConnection,
        defaultJobOptions: {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 1000,
            },
            removeOnComplete: 100,
            removeOnFail: 500,
            ...defaultJobOptions,
        },
    });
};
exports.createQueue = createQueue;
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
const createQueueManager = (redisConnection) => {
    const queues = new Map();
    return {
        registerQueue(queueName, options) {
            if (queues.has(queueName)) {
                return queues.get(queueName);
            }
            const queue = (0, exports.createQueue)(queueName, redisConnection, options);
            queues.set(queueName, queue);
            return queue;
        },
        getQueue(queueName) {
            return queues.get(queueName);
        },
        getAllQueues() {
            return new Map(queues);
        },
        async addJob(queueName, jobName, data, options) {
            const queue = queues.get(queueName);
            if (!queue) {
                throw new Error(`Queue ${queueName} not registered`);
            }
            return queue.add(jobName, data, options);
        },
        async pauseQueue(queueName) {
            const queue = queues.get(queueName);
            if (queue) {
                await queue.pause();
            }
        },
        async resumeQueue(queueName) {
            const queue = queues.get(queueName);
            if (queue) {
                await queue.resume();
            }
        },
        async closeQueue(queueName) {
            const queue = queues.get(queueName);
            if (queue) {
                await queue.close();
                queues.delete(queueName);
            }
        },
        async closeAll() {
            const closePromises = Array.from(queues.values()).map((q) => q.close());
            await Promise.all(closePromises);
            queues.clear();
        },
    };
};
exports.createQueueManager = createQueueManager;
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
const createPersistentQueue = (queueName, redisConnection, jobModel) => {
    const queue = (0, exports.createQueue)(queueName, redisConnection);
    // Hook into job lifecycle events
    queue.on('added', async (job) => {
        await jobModel.create({
            jobId: job.id,
            queueName,
            name: job.name,
            data: job.data,
            options: job.opts,
            status: 'waiting',
            priority: job.opts?.priority || 0,
            maxAttempts: job.opts?.attempts || 3,
            delay: job.opts?.delay || 0,
        });
    });
    queue.on('active', async (job) => {
        await jobModel.update({ status: 'active', processedOn: new Date() }, { where: { jobId: job.id } });
    });
    queue.on('completed', async (job, result) => {
        await jobModel.update({
            status: 'completed',
            finishedOn: new Date(),
            returnValue: result,
        }, { where: { jobId: job.id } });
    });
    queue.on('failed', async (job, err) => {
        await jobModel.update({
            status: 'failed',
            finishedOn: new Date(),
            failedReason: err.message,
            stackTrace: err.stack,
            attempts: job.attemptsMade,
        }, { where: { jobId: job.id } });
    });
    return queue;
};
exports.createPersistentQueue = createPersistentQueue;
// ============================================================================
// JOB SCHEDULING
// ============================================================================
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
const scheduleDelayedJob = async (queue, jobName, data, scheduleTime) => {
    const delay = scheduleTime instanceof Date
        ? scheduleTime.getTime() - Date.now()
        : scheduleTime;
    if (delay < 0) {
        throw new Error('Schedule time must be in the future');
    }
    return queue.add(jobName, data, { delay });
};
exports.scheduleDelayedJob = scheduleDelayedJob;
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
const createCronJob = async (queue, jobName, data, cronExpression, timezone) => {
    return queue.add(jobName, data, {
        repeat: {
            cron: cronExpression,
            tz: timezone || 'UTC',
        },
    });
};
exports.createCronJob = createCronJob;
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
const createIntervalJob = async (queue, jobName, data, intervalMs, maxCount) => {
    return queue.add(jobName, data, {
        repeat: {
            every: intervalMs,
            limit: maxCount,
        },
    });
};
exports.createIntervalJob = createIntervalJob;
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
const removeRepeatableJob = async (queue, repeatKey) => {
    return queue.removeRepeatableByKey(repeatKey);
};
exports.removeRepeatableJob = removeRepeatableJob;
// ============================================================================
// JOB PRIORITY HANDLING
// ============================================================================
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
const addHighPriorityJob = async (queue, jobName, data, priority = 10) => {
    return queue.add(jobName, data, { priority, lifo: true });
};
exports.addHighPriorityJob = addHighPriorityJob;
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
const createPriorityJobScheduler = (queue) => {
    return {
        async addCritical(jobName, data, options) {
            return queue.add(jobName, data, { ...options, priority: 100, lifo: true });
        },
        async addHigh(jobName, data, options) {
            return queue.add(jobName, data, { ...options, priority: 75 });
        },
        async addNormal(jobName, data, options) {
            return queue.add(jobName, data, { ...options, priority: 50 });
        },
        async addLow(jobName, data, options) {
            return queue.add(jobName, data, { ...options, priority: 25 });
        },
        async addBackground(jobName, data, options) {
            return queue.add(jobName, data, { ...options, priority: 1 });
        },
    };
};
exports.createPriorityJobScheduler = createPriorityJobScheduler;
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
const adjustJobPriority = async (queue, jobId, priorityFn) => {
    const job = await queue.getJob(jobId);
    if (!job) {
        throw new Error(`Job ${jobId} not found`);
    }
    const newPriority = priorityFn(job);
    await job.changePriority({ priority: newPriority });
};
exports.adjustJobPriority = adjustJobPriority;
// ============================================================================
// WORKER POOL MANAGEMENT
// ============================================================================
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
const createWorkerPool = (queue, processor, config) => {
    const Worker = require('bullmq').Worker;
    return new Worker(queue.name, processor, {
        connection: queue.opts.connection,
        concurrency: config.concurrency,
        lockDuration: config.lockDuration || 30000,
        lockRenewTime: config.lockRenewTime || 15000,
        maxStalledCount: config.maxStalledCount || 1,
        stalledInterval: config.stalledInterval || 30000,
    });
};
exports.createWorkerPool = createWorkerPool;
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
const createWorkerPoolManager = (redisConnection) => {
    const workers = new Map();
    return {
        registerWorker(queueName, processor, config) {
            if (workers.has(queueName)) {
                throw new Error(`Worker for queue ${queueName} already registered`);
            }
            const Worker = require('bullmq').Worker;
            const worker = new Worker(queueName, processor, {
                connection: redisConnection,
                concurrency: config.concurrency,
                lockDuration: config.lockDuration || 30000,
            });
            workers.set(queueName, worker);
            return worker;
        },
        getWorker(queueName) {
            return workers.get(queueName);
        },
        async pauseWorker(queueName) {
            const worker = workers.get(queueName);
            if (worker) {
                await worker.pause();
            }
        },
        async resumeWorker(queueName) {
            const worker = workers.get(queueName);
            if (worker) {
                await worker.resume();
            }
        },
        async closeWorker(queueName) {
            const worker = workers.get(queueName);
            if (worker) {
                await worker.close();
                workers.delete(queueName);
            }
        },
        async closeAll() {
            const closePromises = Array.from(workers.values()).map((w) => w.close());
            await Promise.all(closePromises);
            workers.clear();
        },
        getAllWorkers() {
            return new Map(workers);
        },
    };
};
exports.createWorkerPoolManager = createWorkerPoolManager;
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
const createAutoScalingWorkerPool = (queue, processor, config) => {
    let currentConcurrency = config.minConcurrency;
    let worker = null;
    let scalingInterval = null;
    const createWorkerWithConcurrency = (concurrency) => {
        if (worker) {
            worker.close();
        }
        const Worker = require('bullmq').Worker;
        worker = new Worker(queue.name, processor, {
            connection: queue.opts.connection,
            concurrency,
        });
        currentConcurrency = concurrency;
    };
    const checkAndScale = async () => {
        const waiting = await queue.getWaitingCount();
        if (waiting >= config.scaleUpThreshold && currentConcurrency < config.maxConcurrency) {
            const newConcurrency = Math.min(config.maxConcurrency, currentConcurrency + Math.ceil(currentConcurrency * 0.5));
            console.log(`Scaling up: ${currentConcurrency} -> ${newConcurrency}`);
            createWorkerWithConcurrency(newConcurrency);
        }
        else if (waiting <= config.scaleDownThreshold && currentConcurrency > config.minConcurrency) {
            const newConcurrency = Math.max(config.minConcurrency, currentConcurrency - Math.ceil(currentConcurrency * 0.25));
            console.log(`Scaling down: ${currentConcurrency} -> ${newConcurrency}`);
            createWorkerWithConcurrency(newConcurrency);
        }
    };
    // Initialize
    createWorkerWithConcurrency(config.minConcurrency);
    // Start auto-scaling
    scalingInterval = setInterval(checkAndScale, config.checkInterval || 30000);
    return {
        getWorker: () => worker,
        getCurrentConcurrency: () => currentConcurrency,
        stop: async () => {
            if (scalingInterval) {
                clearInterval(scalingInterval);
            }
            if (worker) {
                await worker.close();
            }
        },
    };
};
exports.createAutoScalingWorkerPool = createAutoScalingWorkerPool;
// ============================================================================
// JOB RETRY STRATEGIES
// ============================================================================
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
const createExponentialBackoff = (initialDelay = 1000, maxDelay = 60000, multiplier = 2) => {
    return {
        type: 'custom',
        calculate: (attemptsMade) => {
            const delay = initialDelay * Math.pow(multiplier, attemptsMade - 1);
            return Math.min(delay, maxDelay);
        },
    };
};
exports.createExponentialBackoff = createExponentialBackoff;
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
const createCustomRetryStrategy = (shouldRetry, getDelay) => {
    return {
        async handle(job, error) {
            const retry = shouldRetry(job, error);
            if (!retry) {
                return { retry: false };
            }
            const delay = getDelay(job.attemptsMade);
            return { retry: true, delay };
        },
    };
};
exports.createCustomRetryStrategy = createCustomRetryStrategy;
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
const createCircuitBreakerRetry = (config) => {
    let failureCount = 0;
    let lastFailureTime = null;
    let state = 'closed';
    return {
        shouldRetry(error) {
            const now = Date.now();
            // Check if we should reset
            if (state === 'open' && lastFailureTime && now - lastFailureTime >= config.resetTimeout) {
                state = 'half-open';
                failureCount = 0;
            }
            // Open circuit - no retries
            if (state === 'open') {
                return false;
            }
            // Record failure
            failureCount++;
            lastFailureTime = now;
            // Check if we should open circuit
            if (failureCount >= config.failureThreshold) {
                state = 'open';
                return false;
            }
            return true;
        },
        recordSuccess() {
            failureCount = 0;
            state = 'closed';
        },
        getState() {
            return state;
        },
        reset() {
            failureCount = 0;
            lastFailureTime = null;
            state = 'closed';
        },
    };
};
exports.createCircuitBreakerRetry = createCircuitBreakerRetry;
// ============================================================================
// DEAD LETTER QUEUE HANDLING
// ============================================================================
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
const createDeadLetterQueue = (dlqName, redisConnection, jobModel) => {
    const dlQueue = (0, exports.createQueue)(dlqName, redisConnection);
    return {
        async moveToDeadLetter(job, error) {
            const deadLetterJob = {
                jobId: job.id,
                queueName: job.queueName,
                failedAt: new Date(),
                attempts: job.attemptsMade,
                error: error.message,
                data: job.data,
                canRetry: job.attemptsMade < (job.opts?.attempts || 3),
            };
            await dlQueue.add('dead-letter', deadLetterJob);
            // Update job model
            await jobModel.update({
                status: 'failed',
                failedReason: error.message,
                stackTrace: error.stack,
            }, { where: { jobId: job.id } });
        },
        async getDeadLetters(limit = 100) {
            const jobs = await dlQueue.getJobs(['failed', 'completed'], 0, limit - 1);
            return jobs.map((job) => job.data);
        },
        async retryDeadLetter(jobId, originalQueue) {
            const dlJobs = await dlQueue.getJobs(['failed', 'completed']);
            const deadJob = dlJobs.find((job) => job.data.jobId === jobId);
            if (!deadJob) {
                throw new Error(`Dead letter job ${jobId} not found`);
            }
            const data = deadJob.data;
            if (!data.canRetry) {
                throw new Error(`Job ${jobId} cannot be retried`);
            }
            // Re-add to original queue
            await originalQueue.add('retry-from-dlq', data.data, {
                jobId: `retry-${jobId}`,
                attempts: 3,
            });
            // Remove from DLQ
            await deadJob.remove();
        },
        async purgeDeadLetters(olderThan) {
            const jobs = await dlQueue.getJobs(['failed', 'completed']);
            let purged = 0;
            for (const job of jobs) {
                const shouldPurge = olderThan
                    ? new Date(job.data.failedAt) < olderThan
                    : true;
                if (shouldPurge) {
                    await job.remove();
                    purged++;
                }
            }
            return purged;
        },
    };
};
exports.createDeadLetterQueue = createDeadLetterQueue;
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
const createAutoDLQHandler = (queues, dlq) => {
    const listeners = new Map();
    return {
        start() {
            queues.forEach((queue, queueName) => {
                const listener = async (job, error) => {
                    if (job.attemptsMade >= (job.opts?.attempts || 3)) {
                        await dlq.moveToDeadLetter(job, error);
                    }
                };
                queue.on('failed', listener);
                listeners.set(queueName, listener);
            });
        },
        stop() {
            queues.forEach((queue, queueName) => {
                const listener = listeners.get(queueName);
                if (listener) {
                    queue.off('failed', listener);
                }
            });
            listeners.clear();
        },
        isRunning() {
            return listeners.size > 0;
        },
    };
};
exports.createAutoDLQHandler = createAutoDLQHandler;
// ============================================================================
// JOB PROGRESS TRACKING
// ============================================================================
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
const updateJobProgress = async (job, percentage, message, data) => {
    const progress = {
        percentage: Math.max(0, Math.min(100, percentage)),
        message,
        data,
        timestamp: new Date(),
    };
    await job.updateProgress(progress);
};
exports.updateJobProgress = updateJobProgress;
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
const createProgressTracker = (job, totalSteps) => {
    let currentStep = 0;
    return {
        async step(message, data) {
            currentStep++;
            const percentage = Math.floor((currentStep / totalSteps) * 100);
            await (0, exports.updateJobProgress)(job, percentage, message, data);
        },
        async setStep(step, message, data) {
            currentStep = step;
            const percentage = Math.floor((currentStep / totalSteps) * 100);
            await (0, exports.updateJobProgress)(job, percentage, message, data);
        },
        async complete(message = 'Completed') {
            currentStep = totalSteps;
            await (0, exports.updateJobProgress)(job, 100, message);
        },
        getCurrentStep() {
            return currentStep;
        },
        getPercentage() {
            return Math.floor((currentStep / totalSteps) * 100);
        },
    };
};
exports.createProgressTracker = createProgressTracker;
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
const monitorJobProgress = (queue, jobEventModel) => {
    const progressListener = async (job, progress) => {
        await jobEventModel.create({
            jobId: job.id,
            queueName: queue.name,
            eventType: 'progress',
            data: progress,
        });
    };
    queue.on('progress', progressListener);
    return () => {
        queue.off('progress', progressListener);
    };
};
exports.monitorJobProgress = monitorJobProgress;
// ============================================================================
// JOB CANCELLATION AND CLEANUP
// ============================================================================
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
const cancelJob = async (queue, jobId) => {
    const job = await queue.getJob(jobId);
    if (!job) {
        return false;
    }
    const state = await job.getState();
    if (state === 'active') {
        // For active jobs, we can only mark them as failed
        await job.moveToFailed({ message: 'Job cancelled by user' }, true);
        await job.remove();
        return true;
    }
    else if (['waiting', 'delayed'].includes(state)) {
        await job.remove();
        return true;
    }
    return false;
};
exports.cancelJob = cancelJob;
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
const cleanupOldJobs = async (queue, config) => {
    const now = Date.now();
    let completedRemoved = 0;
    let failedRemoved = 0;
    // Clean completed jobs
    if (config.completedOlderThan) {
        const completed = await queue.getJobs(['completed'], 0, config.limit || 1000);
        for (const job of completed) {
            const age = now - job.finishedOn;
            if (age > config.completedOlderThan) {
                await job.remove();
                completedRemoved++;
            }
        }
    }
    // Clean failed jobs
    if (config.failedOlderThan) {
        const failed = await queue.getJobs(['failed'], 0, config.limit || 1000);
        for (const job of failed) {
            const age = now - job.finishedOn;
            if (age > config.failedOlderThan) {
                await job.remove();
                failedRemoved++;
            }
        }
    }
    return {
        removed: completedRemoved + failedRemoved,
        completedRemoved,
        failedRemoved,
    };
};
exports.cleanupOldJobs = cleanupOldJobs;
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
const createJobCleanupScheduler = (queue, config) => {
    let intervalId = null;
    return {
        start() {
            if (intervalId) {
                return;
            }
            const cleanup = async () => {
                try {
                    const result = await (0, exports.cleanupOldJobs)(queue, config);
                    console.log(`[${queue.name}] Cleanup: removed ${result.removed} jobs ` +
                        `(${result.completedRemoved} completed, ${result.failedRemoved} failed)`);
                }
                catch (error) {
                    console.error(`[${queue.name}] Cleanup error:`, error);
                }
            };
            intervalId = setInterval(cleanup, config.interval);
        },
        stop() {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
        },
        async runNow() {
            return (0, exports.cleanupOldJobs)(queue, config);
        },
        isRunning() {
            return intervalId !== null;
        },
    };
};
exports.createJobCleanupScheduler = createJobCleanupScheduler;
// ============================================================================
// JOB BATCHING AND GROUPING
// ============================================================================
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
const createJobBatch = async (queue, batchName, jobs, options) => {
    const batchId = `batch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const jobIds = [];
    // Add all jobs with batch metadata
    for (const jobSpec of jobs) {
        const job = await queue.add(jobSpec.name, {
            ...jobSpec.data,
            _batchId: batchId,
            _batchName: batchName,
        }, {
            ...options,
            jobId: `${batchId}-${jobIds.length}`,
        });
        jobIds.push(job.id);
    }
    return {
        batchId,
        jobIds,
        status: 'pending',
        createdAt: new Date(),
    };
};
exports.createJobBatch = createJobBatch;
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
const waitForBatchCompletion = async (queue, batch, timeout) => {
    const startTime = Date.now();
    const results = [];
    const errors = [];
    let completed = 0;
    let failed = 0;
    while (completed + failed < batch.jobIds.length) {
        if (timeout && Date.now() - startTime > timeout) {
            throw new Error(`Batch ${batch.batchId} timeout after ${timeout}ms`);
        }
        for (const jobId of batch.jobIds) {
            const job = await queue.getJob(jobId);
            if (!job)
                continue;
            const state = await job.getState();
            if (state === 'completed' && !results.find((r) => r.jobId === jobId)) {
                results.push({ jobId, result: job.returnvalue });
                completed++;
            }
            else if (state === 'failed' && !errors.find((e) => e.jobId === jobId)) {
                errors.push({ jobId, error: job.failedReason });
                failed++;
            }
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    return {
        batchId: batch.batchId,
        total: batch.jobIds.length,
        completed,
        failed,
        results,
        errors,
    };
};
exports.waitForBatchCompletion = waitForBatchCompletion;
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
const createJobGrouper = (queue, groupKeyFn, batchSize = 10, flushInterval = 30000) => {
    const groups = new Map();
    let flushTimer = null;
    const flush = async (groupKey) => {
        const keysToFlush = groupKey ? [groupKey] : Array.from(groups.keys());
        for (const key of keysToFlush) {
            const jobs = groups.get(key);
            if (!jobs || jobs.length === 0)
                continue;
            await queue.add('grouped-jobs', {
                groupKey: key,
                jobs: jobs.splice(0),
            });
            groups.delete(key);
        }
    };
    const scheduleFlush = () => {
        if (flushTimer)
            clearTimeout(flushTimer);
        flushTimer = setTimeout(() => flush(), flushInterval);
    };
    return {
        async add(name, data, options) {
            const groupKey = groupKeyFn(data);
            if (!groups.has(groupKey)) {
                groups.set(groupKey, []);
            }
            groups.get(groupKey).push({ name, data, options });
            if (groups.get(groupKey).length >= batchSize) {
                await flush(groupKey);
            }
            else {
                scheduleFlush();
            }
        },
        async flush() {
            return flush();
        },
        getGroups() {
            return new Map(groups);
        },
    };
};
exports.createJobGrouper = createJobGrouper;
// ============================================================================
// QUEUE METRICS AND MONITORING
// ============================================================================
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
const getQueueMetrics = async (queue) => {
    const [waiting, active, completed, failed, delayed, paused] = await Promise.all([
        queue.getWaitingCount(),
        queue.getActiveCount(),
        queue.getCompletedCount(),
        queue.getFailedCount(),
        queue.getDelayedCount(),
        queue.isPaused(),
    ]);
    return {
        queueName: queue.name,
        waiting,
        active,
        completed,
        failed,
        delayed,
        paused,
        timestamp: new Date(),
    };
};
exports.getQueueMetrics = getQueueMetrics;
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
const createMetricsCollector = (queues, interval, onMetrics) => {
    let intervalId = null;
    const collect = async () => {
        const metrics = [];
        for (const queue of queues.values()) {
            try {
                const queueMetrics = await (0, exports.getQueueMetrics)(queue);
                metrics.push(queueMetrics);
            }
            catch (error) {
                console.error(`Error collecting metrics for ${queue.name}:`, error);
            }
        }
        if (metrics.length > 0) {
            await onMetrics(metrics);
        }
    };
    return {
        start() {
            if (intervalId)
                return;
            intervalId = setInterval(collect, interval);
        },
        stop() {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
        },
        async collectNow() {
            return collect();
        },
        isRunning() {
            return intervalId !== null;
        },
    };
};
exports.createMetricsCollector = createMetricsCollector;
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
const createQueueHealthChecker = (queue, thresholds, onUnhealthy) => {
    let intervalId = null;
    const check = async () => {
        const metrics = await (0, exports.getQueueMetrics)(queue);
        const issues = [];
        if (thresholds.maxWaiting && metrics.waiting > thresholds.maxWaiting) {
            issues.push(`Waiting jobs (${metrics.waiting}) exceeds threshold (${thresholds.maxWaiting})`);
        }
        if (thresholds.maxActive && metrics.active > thresholds.maxActive) {
            issues.push(`Active jobs (${metrics.active}) exceeds threshold (${thresholds.maxActive})`);
        }
        if (thresholds.maxFailedRate) {
            const total = metrics.completed + metrics.failed;
            if (total > 0) {
                const failedRate = metrics.failed / total;
                if (failedRate > thresholds.maxFailedRate) {
                    issues.push(`Failed rate (${(failedRate * 100).toFixed(1)}%) exceeds threshold ` +
                        `(${(thresholds.maxFailedRate * 100).toFixed(1)}%)`);
                }
            }
        }
        if (issues.length > 0) {
            await onUnhealthy({ healthy: false, issues });
        }
    };
    return {
        start() {
            if (intervalId)
                return;
            intervalId = setInterval(check, thresholds.checkInterval || 60000);
        },
        stop() {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
        },
        async checkNow() {
            return check();
        },
        isRunning() {
            return intervalId !== null;
        },
    };
};
exports.createQueueHealthChecker = createQueueHealthChecker;
// ============================================================================
// JOB RESULT STORAGE
// ============================================================================
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
const storeJobResults = (queue, jobResultModel, retentionDays = 30) => {
    const completedListener = async (job, result) => {
        const duration = job.finishedOn - job.processedOn;
        await jobResultModel.create({
            jobId: job.id,
            queueName: queue.name,
            status: 'completed',
            result,
            duration,
            attempts: job.attemptsMade,
            workerId: job.processedBy,
        });
    };
    const failedListener = async (job, error) => {
        const duration = job.finishedOn - job.processedOn;
        await jobResultModel.create({
            jobId: job.id,
            queueName: queue.name,
            status: 'failed',
            error: error.message,
            errorStack: error.stack,
            duration,
            attempts: job.attemptsMade,
            workerId: job.processedBy,
        });
    };
    queue.on('completed', completedListener);
    queue.on('failed', failedListener);
    // Cleanup old results periodically
    const cleanupInterval = setInterval(async () => {
        const cutoffDate = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);
        await jobResultModel.destroy({
            where: {
                completedAt: { [require('sequelize').Op.lt]: cutoffDate },
            },
        });
    }, 24 * 60 * 60 * 1000); // Daily cleanup
    return () => {
        queue.off('completed', completedListener);
        queue.off('failed', failedListener);
        clearInterval(cleanupInterval);
    };
};
exports.storeJobResults = storeJobResults;
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
const queryJobResults = async (jobResultModel, filters) => {
    const { Op } = require('sequelize');
    const where = {};
    if (filters.queueName) {
        where.queueName = filters.queueName;
    }
    if (filters.status) {
        where.status = filters.status;
    }
    if (filters.startDate || filters.endDate) {
        where.completedAt = {};
        if (filters.startDate) {
            where.completedAt[Op.gte] = filters.startDate;
        }
        if (filters.endDate) {
            where.completedAt[Op.lte] = filters.endDate;
        }
    }
    const limit = filters.limit || 100;
    const offset = filters.offset || 0;
    const { count, rows } = await jobResultModel.findAndCountAll({
        where,
        limit,
        offset,
        order: [['completedAt', 'DESC']],
    });
    return {
        results: rows,
        total: count,
        page: Math.floor(offset / limit) + 1,
        pageSize: limit,
    };
};
exports.queryJobResults = queryJobResults;
// ============================================================================
// EVENT-DRIVEN JOB WORKFLOWS
// ============================================================================
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
const createJobWorkflow = (queues) => {
    const steps = [];
    let initialData;
    let onCompleteCallback = null;
    let onErrorCallback = null;
    return {
        start(queueName, jobName, data) {
            initialData = data;
            steps.push({ queueName, jobName });
            return this;
        },
        then(queueName, jobName, transformData) {
            steps.push({ queueName, jobName, transformData });
            return this;
        },
        onComplete(callback) {
            onCompleteCallback = callback;
            return this;
        },
        onError(callback) {
            onErrorCallback = callback;
            return this;
        },
        async execute() {
            const results = [];
            let currentData = initialData;
            try {
                for (let i = 0; i < steps.length; i++) {
                    const step = steps[i];
                    const queue = queues.get(step.queueName);
                    if (!queue) {
                        throw new Error(`Queue ${step.queueName} not found`);
                    }
                    // Transform data if needed
                    if (i > 0 && step.transformData) {
                        currentData = step.transformData(currentData);
                    }
                    // Add job and wait for completion
                    const job = await queue.add(step.jobName, currentData);
                    const result = await job.waitUntilFinished(queue.events);
                    results.push(result);
                    currentData = result;
                }
                if (onCompleteCallback) {
                    await onCompleteCallback(results);
                }
                return results;
            }
            catch (error) {
                if (onErrorCallback) {
                    await onErrorCallback(error, results.length);
                }
                throw error;
            }
        },
    };
};
exports.createJobWorkflow = createJobWorkflow;
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
const createJobEventListeners = (queue, handlers) => {
    const listeners = [];
    if (handlers.onActive) {
        queue.on('active', handlers.onActive);
        listeners.push({ event: 'active', handler: handlers.onActive });
    }
    if (handlers.onCompleted) {
        queue.on('completed', handlers.onCompleted);
        listeners.push({ event: 'completed', handler: handlers.onCompleted });
    }
    if (handlers.onFailed) {
        queue.on('failed', handlers.onFailed);
        listeners.push({ event: 'failed', handler: handlers.onFailed });
    }
    if (handlers.onProgress) {
        queue.on('progress', handlers.onProgress);
        listeners.push({ event: 'progress', handler: handlers.onProgress });
    }
    if (handlers.onStalled) {
        queue.on('stalled', handlers.onStalled);
        listeners.push({ event: 'stalled', handler: handlers.onStalled });
    }
    return () => {
        listeners.forEach(({ event, handler }) => {
            queue.off(event, handler);
        });
    };
};
exports.createJobEventListeners = createJobEventListeners;
// ============================================================================
// PARENT-CHILD JOB RELATIONSHIPS
// ============================================================================
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
const createParentChildJobs = async (parentQueue, childQueue, parentJobName, parentData, childJobs) => {
    // Create parent job first
    const parentJob = await parentQueue.add(parentJobName, parentData, {
        jobId: `parent-${Date.now()}`,
    });
    const childJobIds = [];
    // Create child jobs with parent reference
    for (const childSpec of childJobs) {
        const childJob = await childQueue.add(childSpec.name, {
            ...childSpec.data,
            _parentJobId: parentJob.id,
        }, {
            ...childSpec.options,
            jobId: `${parentJob.id}-child-${childJobIds.length}`,
        });
        childJobIds.push(childJob.id);
    }
    return {
        parentJobId: parentJob.id,
        childJobIds,
        parentQueue: parentQueue.name,
        childQueue: childQueue.name,
        dependencyMode: 'all',
    };
};
exports.createParentChildJobs = createParentChildJobs;
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
const waitForChildJobs = async (parentQueue, childQueue, relation, timeout) => {
    const startTime = Date.now();
    const childResults = [];
    let allCompleted = false;
    let allSucceeded = true;
    // Wait for all children
    while (!allCompleted) {
        if (timeout && Date.now() - startTime > timeout) {
            throw new Error(`Timeout waiting for child jobs after ${timeout}ms`);
        }
        const childStates = await Promise.all(relation.childJobIds.map(async (childId) => {
            const job = await childQueue.getJob(childId);
            if (!job)
                return { state: 'missing', result: null };
            const state = await job.getState();
            return { state, result: job.returnvalue, error: job.failedReason };
        }));
        allCompleted = childStates.every((s) => ['completed', 'failed'].includes(s.state));
        if (allCompleted) {
            allSucceeded = childStates.every((s) => s.state === 'completed');
            childResults.push(...childStates.map((s) => s.result || s.error));
        }
        else {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }
    // Get parent job result
    const parentJob = await parentQueue.getJob(relation.parentJobId);
    const parentState = await parentJob.getState();
    return {
        parentResult: parentJob.returnvalue,
        childResults,
        allSucceeded,
    };
};
exports.waitForChildJobs = waitForChildJobs;
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
const createJobDependencyGraph = (queues) => {
    const jobs = new Map();
    return {
        addJob(id, queueName, jobName, data, dependencies = []) {
            jobs.set(id, {
                id,
                queueName,
                jobName,
                data,
                dependencies,
            });
            return id;
        },
        async execute() {
            const results = new Map();
            const completed = new Set();
            const canExecute = (jobId) => {
                const job = jobs.get(jobId);
                if (!job)
                    return false;
                return job.dependencies.every((depId) => completed.has(depId));
            };
            while (completed.size < jobs.size) {
                const ready = Array.from(jobs.keys()).filter((id) => !completed.has(id) && canExecute(id));
                if (ready.length === 0 && completed.size < jobs.size) {
                    throw new Error('Circular dependency detected in job graph');
                }
                // Execute ready jobs in parallel
                await Promise.all(ready.map(async (jobId) => {
                    const jobSpec = jobs.get(jobId);
                    const queue = queues.get(jobSpec.queueName);
                    if (!queue) {
                        throw new Error(`Queue ${jobSpec.queueName} not found`);
                    }
                    const job = await queue.add(jobSpec.jobName, jobSpec.data);
                    const result = await job.waitUntilFinished(queue.events);
                    results.set(jobId, result);
                    completed.add(jobId);
                }));
            }
            return results;
        },
        getGraph() {
            return new Map(jobs);
        },
    };
};
exports.createJobDependencyGraph = createJobDependencyGraph;
// ============================================================================
// JOB RATE LIMITING
// ============================================================================
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
const applyRateLimit = async (queue, config) => {
    await queue.setLimiter({
        max: config.max,
        duration: config.duration,
        bounceBack: config.bounceBack || false,
        groupKey: config.groupKey,
    });
};
exports.applyRateLimit = applyRateLimit;
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
const createTokenBucketLimiter = (capacity, refillRate, refillInterval) => {
    let tokens = capacity;
    let lastRefill = Date.now();
    const refill = () => {
        const now = Date.now();
        const timePassed = now - lastRefill;
        const intervalsElapsed = Math.floor(timePassed / refillInterval);
        if (intervalsElapsed > 0) {
            tokens = Math.min(capacity, tokens + intervalsElapsed * refillRate);
            lastRefill = now;
        }
    };
    return {
        async consume(count = 1) {
            refill();
            if (tokens >= count) {
                tokens -= count;
                return true;
            }
            return false;
        },
        getAvailableTokens() {
            refill();
            return tokens;
        },
        async waitForTokens(count = 1, timeout) {
            const startTime = Date.now();
            while (true) {
                if (await this.consume(count)) {
                    return true;
                }
                if (timeout && Date.now() - startTime > timeout) {
                    return false;
                }
                await new Promise((resolve) => setTimeout(resolve, 100));
            }
        },
        reset() {
            tokens = capacity;
            lastRefill = Date.now();
        },
    };
};
exports.createTokenBucketLimiter = createTokenBucketLimiter;
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
const createSlidingWindowLimiter = (redis, key, limit, windowMs) => {
    return {
        async checkLimit() {
            const now = Date.now();
            const windowStart = now - windowMs;
            // Remove old entries
            await redis.zremrangebyscore(key, '-inf', windowStart);
            // Count current requests
            const count = await redis.zcard(key);
            if (count < limit) {
                // Add current request
                await redis.zadd(key, now, `${now}-${Math.random()}`);
                await redis.pexpire(key, windowMs);
                return true;
            }
            return false;
        },
        async getCurrentCount() {
            const now = Date.now();
            const windowStart = now - windowMs;
            await redis.zremrangebyscore(key, '-inf', windowStart);
            return redis.zcard(key);
        },
        async reset() {
            await redis.del(key);
        },
        async getTimeUntilReset() {
            const ttl = await redis.pttl(key);
            return Math.max(0, ttl);
        },
    };
};
exports.createSlidingWindowLimiter = createSlidingWindowLimiter;
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
const createDistributedRateLimiter = (redis, namespace) => {
    return {
        async tryAcquire(resourceId, maxRequests, windowMs) {
            const key = `${namespace}:ratelimit:${resourceId}`;
            const now = Date.now();
            const windowStart = now - windowMs;
            const multi = redis.multi();
            // Remove old entries
            multi.zremrangebyscore(key, '-inf', windowStart);
            // Count current
            multi.zcard(key);
            // Add new entry if under limit
            multi.zadd(key, now, `${now}-${Math.random()}`);
            // Set expiry
            multi.pexpire(key, windowMs);
            const results = await multi.exec();
            const count = results[1][1]; // Get count result
            if (count >= maxRequests) {
                // Remove the entry we just added
                await redis.zremrangebyscore(key, now, now);
                return false;
            }
            return true;
        },
        async getStatus(resourceId) {
            const key = `${namespace}:ratelimit:${resourceId}`;
            const count = await redis.zcard(key);
            const ttl = await redis.pttl(key);
            return {
                current: count,
                remaining: Math.max(0, count), // Would need limit to calculate properly
                resetAt: new Date(Date.now() + ttl),
            };
        },
    };
};
exports.createDistributedRateLimiter = createDistributedRateLimiter;
// ============================================================================
// HELPER UTILITIES
// ============================================================================
/**
 * Generates a unique job ID.
 */
function generateJobId(prefix) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return prefix ? `${prefix}-${timestamp}-${random}` : `${timestamp}-${random}`;
}
/**
 * Formats duration in milliseconds to human-readable string.
 */
function formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0)
        return `${days}d ${hours % 24}h`;
    if (hours > 0)
        return `${hours}h ${minutes % 60}m`;
    if (minutes > 0)
        return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
}
/**
 * Validates cron expression format.
 */
function isValidCronExpression(expr) {
    const cronRegex = /^(\*|([0-5]?\d)) (\*|([01]?\d|2[0-3])) (\*|([01]?\d|2\d|3[01])) (\*|([1-9]|1[0-2])) (\*|([0-6]))$/;
    return cronRegex.test(expr);
}
//# sourceMappingURL=queue-jobs-kit.js.map