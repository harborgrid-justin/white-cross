"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createParentChildJobs = exports.createJobEventListeners = exports.createJobWorkflow = exports.createCustomRetryStrategy = exports.createExponentialBackoff = exports.createJobCleanupScheduler = exports.cleanupOldJobs = exports.cancelJob = exports.createProgressTracker = exports.updateJobProgress = exports.createQueueHealthChecker = exports.createMetricsCollector = exports.getQueueMetrics = exports.createJobGrouper = exports.waitForBatchCompletion = exports.createJobBatch = exports.createAutoDLQHandler = exports.createDeadLetterQueue = exports.createTokenBucketLimiter = exports.createSlidingWindowLimiter = exports.applyRateLimit = exports.createSagaCoordinator = exports.createJobCircuitBreaker = exports.Process = exports.createNestJSQueueProvider = exports.aggregateJobMetrics = exports.createProductionWorker = exports.toggleSchedule = exports.updateScheduleRunTracking = exports.createCronSchedule = exports.withDistributedLock = exports.createDistributedLockManager = exports.extendDistributedLock = exports.releaseDistributedLock = exports.acquireDistributedLock = exports.cleanupExpiredIdempotencyKeys = exports.updateIdempotencyKey = exports.createIdempotentJob = exports.createValidatedJob = exports.createProductionQueue = exports.createDistributedLockModel = exports.createIdempotencyKeyModel = exports.createJobExecutionLogModel = exports.createJobScheduleModel = exports.createProductionJobModel = exports.DistributedLockConfigSchema = exports.RateLimitConfigSchema = exports.WorkerPoolConfigSchema = exports.JobDataSchema = exports.JobOptionsSchema = void 0;
exports.generateJobId = generateJobId;
exports.formatDuration = formatDuration;
exports.calculateExponentialBackoff = calculateExponentialBackoff;
exports.sanitizeJobData = sanitizeJobData;
exports.createIdempotencyKey = createIdempotencyKey;
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
const zod_1 = require("zod");
// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================
/**
 * Zod schema for job options validation.
 */
exports.JobOptionsSchema = zod_1.z.object({
    priority: zod_1.z.number().int().min(0).max(1000).optional(),
    delay: zod_1.z.number().int().min(0).optional(),
    attempts: zod_1.z.number().int().min(1).max(100).optional(),
    backoff: zod_1.z.union([
        zod_1.z.number().int().min(0),
        zod_1.z.object({
            type: zod_1.z.enum(['fixed', 'exponential', 'custom']),
            delay: zod_1.z.number().int().min(0),
        }),
    ]).optional(),
    lifo: zod_1.z.boolean().optional(),
    timeout: zod_1.z.number().int().min(0).optional(),
    removeOnComplete: zod_1.z.union([zod_1.z.boolean(), zod_1.z.number().int().min(0)]).optional(),
    removeOnFail: zod_1.z.union([zod_1.z.boolean(), zod_1.z.number().int().min(0)]).optional(),
    jobId: zod_1.z.string().optional(),
    repeat: zod_1.z.object({
        cron: zod_1.z.string().optional(),
        tz: zod_1.z.string().optional(),
        startDate: zod_1.z.union([zod_1.z.date(), zod_1.z.string()]).optional(),
        endDate: zod_1.z.union([zod_1.z.date(), zod_1.z.string()]).optional(),
        limit: zod_1.z.number().int().min(0).optional(),
        every: zod_1.z.number().int().min(0).optional(),
        count: zod_1.z.number().int().min(0).optional(),
    }).optional(),
    idempotencyKey: zod_1.z.string().optional(),
});
/**
 * Zod schema for job data validation.
 */
exports.JobDataSchema = zod_1.z.object({
    type: zod_1.z.string().min(1),
    payload: zod_1.z.record(zod_1.z.any()),
    metadata: zod_1.z.object({
        userId: zod_1.z.string().optional(),
        tenantId: zod_1.z.string().optional(),
        traceId: zod_1.z.string().optional(),
        timestamp: zod_1.z.date().optional(),
    }).optional(),
    idempotencyKey: zod_1.z.string().optional(),
});
/**
 * Zod schema for worker pool configuration.
 */
exports.WorkerPoolConfigSchema = zod_1.z.object({
    concurrency: zod_1.z.number().int().min(1).max(1000),
    maxStalledCount: zod_1.z.number().int().min(0).optional(),
    stalledInterval: zod_1.z.number().int().min(0).optional(),
    lockDuration: zod_1.z.number().int().min(1000).optional(),
    lockRenewTime: zod_1.z.number().int().min(100).optional(),
    autoScaling: zod_1.z.object({
        enabled: zod_1.z.boolean(),
        minConcurrency: zod_1.z.number().int().min(1),
        maxConcurrency: zod_1.z.number().int().min(1),
        scaleUpThreshold: zod_1.z.number().int().min(0),
        scaleDownThreshold: zod_1.z.number().int().min(0),
        checkInterval: zod_1.z.number().int().min(1000),
    }).optional(),
});
/**
 * Zod schema for rate limit configuration.
 */
exports.RateLimitConfigSchema = zod_1.z.object({
    max: zod_1.z.number().int().min(1),
    duration: zod_1.z.number().int().min(1),
    bounceBack: zod_1.z.boolean().optional(),
    groupKey: zod_1.z.string().optional(),
});
/**
 * Zod schema for distributed lock configuration.
 */
exports.DistributedLockConfigSchema = zod_1.z.object({
    lockKey: zod_1.z.string().min(1),
    ttl: zod_1.z.number().int().min(100),
    retries: zod_1.z.number().int().min(0).optional(),
    retryDelay: zod_1.z.number().int().min(0).optional(),
    extendInterval: zod_1.z.number().int().min(0).optional(),
});
// ============================================================================
// SEQUELIZE MODELS (PRODUCTION-GRADE)
// ============================================================================
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
const createProductionJobModel = (sequelize, DataTypes) => {
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
            comment: 'Bull/BullMQ job identifier',
        },
        queueName: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'queue_name',
            index: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Job type/name',
        },
        data: {
            type: DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
            comment: 'Job payload data',
        },
        options: {
            type: DataTypes.JSONB,
            allowNull: true,
            comment: 'Job configuration options',
        },
        status: {
            type: DataTypes.ENUM('waiting', 'active', 'completed', 'failed', 'delayed', 'paused', 'stuck', 'cancelled'),
            defaultValue: 'waiting',
            index: true,
        },
        priority: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            index: true,
        },
        attempts: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            comment: 'Number of execution attempts',
        },
        maxAttempts: {
            type: DataTypes.INTEGER,
            defaultValue: 3,
            field: 'max_attempts',
        },
        progress: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            validate: { min: 0, max: 100 },
        },
        processedOn: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'processed_on',
            comment: 'When job processing started',
        },
        finishedOn: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'finished_on',
            comment: 'When job completed or failed',
        },
        processedBy: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'processed_by',
            comment: 'Worker ID that processed this job',
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
            comment: 'Job execution result',
        },
        parentJobId: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'parent_job_id',
            index: true,
        },
        delay: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Delay in milliseconds',
        },
        idempotencyKey: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
            field: 'idempotency_key',
            index: true,
            comment: 'Unique key for idempotent operations',
        },
        lockKey: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'lock_key',
            comment: 'Distributed lock key if used',
        },
        metadata: {
            type: DataTypes.JSONB,
            defaultValue: {},
            comment: 'Additional metadata (userId, tenantId, etc.)',
        },
        tags: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            defaultValue: [],
            comment: 'Tags for categorization and filtering',
        },
        scheduledFor: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'scheduled_for',
            index: true,
            comment: 'When job is scheduled to run',
        },
        executionTime: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'execution_time',
            comment: 'Actual execution duration in milliseconds',
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'deleted_at',
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
        paranoid: true,
        indexes: [
            { fields: ['job_id'], unique: true },
            { fields: ['queue_name'] },
            { fields: ['status'] },
            { fields: ['parent_job_id'] },
            { fields: ['created_at'] },
            { fields: ['idempotency_key'], unique: true, where: { idempotency_key: { [sequelize.Sequelize.Op.ne]: null } } },
            { fields: ['queue_name', 'status'] },
            { fields: ['scheduled_for'] },
            { fields: ['tags'], using: 'gin' },
            { fields: ['metadata'], using: 'gin' },
        ],
        hooks: {
            beforeCreate: (job) => {
                if (!job.scheduledFor && job.delay) {
                    job.scheduledFor = new Date(Date.now() + job.delay);
                }
            },
            beforeUpdate: (job) => {
                if (job.changed('processedOn') && job.finishedOn) {
                    job.executionTime = job.finishedOn - job.processedOn;
                }
            },
        },
    });
};
exports.createProductionJobModel = createProductionJobModel;
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
const createJobScheduleModel = (sequelize, DataTypes) => {
    return sequelize.define('JobSchedule', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            comment: 'Human-readable schedule name',
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        cronExpression: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'cron_expression',
            comment: 'Cron expression for scheduling',
        },
        interval: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Interval in milliseconds for repeating jobs',
        },
        queueName: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'queue_name',
            index: true,
        },
        jobName: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'job_name',
        },
        jobData: {
            type: DataTypes.JSONB,
            defaultValue: {},
            field: 'job_data',
        },
        jobOptions: {
            type: DataTypes.JSONB,
            defaultValue: {},
            field: 'job_options',
        },
        enabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            index: true,
        },
        timezone: {
            type: DataTypes.STRING,
            defaultValue: 'UTC',
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'start_date',
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'end_date',
        },
        maxRuns: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'max_runs',
            comment: 'Maximum number of times to run (null = unlimited)',
        },
        runCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            field: 'run_count',
            comment: 'Number of times this schedule has executed',
        },
        lastRunAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'last_run_at',
        },
        nextRunAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'next_run_at',
            index: true,
        },
        lastJobId: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'last_job_id',
        },
        metadata: {
            type: DataTypes.JSONB,
            defaultValue: {},
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'deleted_at',
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
        tableName: 'job_schedules',
        timestamps: true,
        paranoid: true,
        indexes: [
            { fields: ['name'], unique: true },
            { fields: ['queue_name'] },
            { fields: ['enabled'] },
            { fields: ['next_run_at'] },
            { fields: ['enabled', 'next_run_at'] },
        ],
        validate: {
            cronOrInterval() {
                if (!this.cronExpression && !this.interval) {
                    throw new Error('Either cronExpression or interval must be set');
                }
            },
        },
    });
};
exports.createJobScheduleModel = createJobScheduleModel;
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
const createJobExecutionLogModel = (sequelize, DataTypes) => {
    return sequelize.define('JobExecutionLog', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        jobId: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'job_id',
            index: true,
        },
        queueName: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'queue_name',
            index: true,
        },
        jobName: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'job_name',
        },
        status: {
            type: DataTypes.ENUM('completed', 'failed', 'timeout', 'cancelled'),
            allowNull: false,
            index: true,
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
            index: true,
        },
        workerHost: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'worker_host',
        },
        cpuUsage: {
            type: DataTypes.FLOAT,
            allowNull: true,
            field: 'cpu_usage',
            comment: 'CPU usage percentage during execution',
        },
        memoryUsage: {
            type: DataTypes.BIGINT,
            allowNull: true,
            field: 'memory_usage',
            comment: 'Memory usage in bytes',
        },
        metadata: {
            type: DataTypes.JSONB,
            defaultValue: {},
        },
        idempotencyKey: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'idempotency_key',
            index: true,
        },
        executedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: 'executed_at',
            index: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: 'created_at',
        },
    }, {
        tableName: 'job_execution_logs',
        timestamps: true,
        updatedAt: false,
        indexes: [
            { fields: ['job_id'] },
            { fields: ['queue_name'] },
            { fields: ['status'] },
            { fields: ['executed_at'] },
            { fields: ['queue_name', 'status'] },
            { fields: ['worker_id'] },
            { fields: ['idempotency_key'] },
            { fields: ['metadata'], using: 'gin' },
        ],
    });
};
exports.createJobExecutionLogModel = createJobExecutionLogModel;
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
const createIdempotencyKeyModel = (sequelize, DataTypes) => {
    return sequelize.define('IdempotencyKey', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        key: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            index: true,
            comment: 'Unique idempotency key',
        },
        jobId: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'job_id',
            comment: 'Associated job ID',
        },
        queueName: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'queue_name',
        },
        result: {
            type: DataTypes.JSONB,
            allowNull: true,
            comment: 'Cached result for idempotent replay',
        },
        status: {
            type: DataTypes.ENUM('pending', 'completed', 'failed'),
            defaultValue: 'pending',
            index: true,
        },
        metadata: {
            type: DataTypes.JSONB,
            defaultValue: {},
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false,
            field: 'expires_at',
            index: true,
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
        tableName: 'idempotency_keys',
        timestamps: true,
        indexes: [
            { fields: ['key'], unique: true },
            { fields: ['job_id'] },
            { fields: ['expires_at'] },
            { fields: ['status'] },
            { fields: ['queue_name'] },
        ],
    });
};
exports.createIdempotencyKeyModel = createIdempotencyKeyModel;
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
const createDistributedLockModel = (sequelize, DataTypes) => {
    return sequelize.define('DistributedLock', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        lockKey: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            field: 'lock_key',
            index: true,
        },
        ownerId: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'owner_id',
            comment: 'Worker/process that owns this lock',
        },
        jobId: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'job_id',
        },
        resourceType: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'resource_type',
            comment: 'Type of resource being locked',
        },
        resourceId: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'resource_id',
            comment: 'ID of resource being locked',
        },
        metadata: {
            type: DataTypes.JSONB,
            defaultValue: {},
        },
        acquiredAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: 'acquired_at',
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false,
            field: 'expires_at',
            index: true,
        },
        renewedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'renewed_at',
        },
        renewCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            field: 'renew_count',
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: 'created_at',
        },
    }, {
        tableName: 'distributed_locks',
        timestamps: true,
        updatedAt: false,
        indexes: [
            { fields: ['lock_key'], unique: true },
            { fields: ['owner_id'] },
            { fields: ['expires_at'] },
            { fields: ['job_id'] },
            { fields: ['resource_type', 'resource_id'] },
        ],
    });
};
exports.createDistributedLockModel = createDistributedLockModel;
// ============================================================================
// QUEUE CREATION AND MANAGEMENT
// ============================================================================
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
const createProductionQueue = (queueName, redisConnection, defaultJobOptions) => {
    // Validate options if provided
    if (defaultJobOptions) {
        exports.JobOptionsSchema.partial().parse(defaultJobOptions);
    }
    const { Queue } = require('bullmq');
    const queue = new Queue(queueName, {
        connection: redisConnection,
        defaultJobOptions: {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 1000,
            },
            removeOnComplete: {
                age: 24 * 3600, // Keep completed jobs for 24 hours
                count: 1000, // Keep maximum 1000 completed jobs
            },
            removeOnFail: {
                age: 7 * 24 * 3600, // Keep failed jobs for 7 days
            },
            ...defaultJobOptions,
        },
    });
    // Add event listeners for monitoring
    queue.on('error', (error) => {
        console.error(`[Queue:${queueName}] Error:`, error);
    });
    queue.on('waiting', (jobId) => {
        console.log(`[Queue:${queueName}] Job ${jobId} is waiting`);
    });
    return queue;
};
exports.createProductionQueue = createProductionQueue;
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
const createValidatedJob = async (queue, jobName, data, schema, options) => {
    // Validate data if schema provided
    if (schema) {
        schema.parse(data);
    }
    // Validate options
    if (options) {
        exports.JobOptionsSchema.partial().parse(options);
    }
    return queue.add(jobName, data, options);
};
exports.createValidatedJob = createValidatedJob;
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
const createIdempotentJob = async (queue, jobName, data, idempotencyKey, idempotencyModel, options) => {
    // Check if idempotency key exists
    const existing = await idempotencyModel.findOne({
        where: { key: idempotencyKey },
    });
    if (existing) {
        if (existing.status === 'completed') {
            // Return cached result
            return {
                cached: true,
                result: existing.result,
            };
        }
        else if (existing.status === 'pending') {
            // Job is still being processed
            const job = await queue.getJob(existing.jobId);
            return {
                job,
                cached: true,
            };
        }
    }
    // Create new job
    const job = await queue.add(jobName, data, {
        ...options,
        jobId: `${idempotencyKey}-${Date.now()}`,
    });
    // Store idempotency key
    await idempotencyModel.create({
        key: idempotencyKey,
        jobId: job.id,
        queueName: queue.name,
        status: 'pending',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });
    return {
        job,
        cached: false,
    };
};
exports.createIdempotentJob = createIdempotentJob;
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
const updateIdempotencyKey = async (idempotencyModel, idempotencyKey, result, status) => {
    await idempotencyModel.update({
        result,
        status,
    }, {
        where: { key: idempotencyKey },
    });
};
exports.updateIdempotencyKey = updateIdempotencyKey;
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
const cleanupExpiredIdempotencyKeys = async (idempotencyModel) => {
    const { Op } = require('sequelize');
    const result = await idempotencyModel.destroy({
        where: {
            expiresAt: {
                [Op.lt]: new Date(),
            },
        },
    });
    return result;
};
exports.cleanupExpiredIdempotencyKeys = cleanupExpiredIdempotencyKeys;
// ============================================================================
// DISTRIBUTED LOCKS
// ============================================================================
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
const acquireDistributedLock = async (redis, lockKey, ownerId, ttl) => {
    const key = `lock:${lockKey}`;
    const result = await redis.set(key, ownerId, 'PX', ttl, 'NX');
    return result === 'OK';
};
exports.acquireDistributedLock = acquireDistributedLock;
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
const releaseDistributedLock = async (redis, lockKey, ownerId) => {
    const key = `lock:${lockKey}`;
    // Lua script to ensure we only delete our own lock
    const script = `
    if redis.call("get", KEYS[1]) == ARGV[1] then
      return redis.call("del", KEYS[1])
    else
      return 0
    end
  `;
    const result = await redis.eval(script, 1, key, ownerId);
    return result === 1;
};
exports.releaseDistributedLock = releaseDistributedLock;
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
const extendDistributedLock = async (redis, lockKey, ownerId, additionalTtl) => {
    const key = `lock:${lockKey}`;
    // Lua script to extend only our own lock
    const script = `
    if redis.call("get", KEYS[1]) == ARGV[1] then
      return redis.call("pexpire", KEYS[1], ARGV[2])
    else
      return 0
    end
  `;
    const result = await redis.eval(script, 1, key, ownerId, additionalTtl);
    return result === 1;
};
exports.extendDistributedLock = extendDistributedLock;
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
const createDistributedLockManager = (redis, lockModel) => {
    const locks = new Map();
    return {
        async acquire(config) {
            const validated = exports.DistributedLockConfigSchema.parse(config);
            const ownerId = `worker-${process.pid}-${Date.now()}`;
            const retries = validated.retries || 0;
            const retryDelay = validated.retryDelay || 1000;
            let attempt = 0;
            while (attempt <= retries) {
                const acquired = await (0, exports.acquireDistributedLock)(redis, validated.lockKey, ownerId, validated.ttl);
                if (acquired) {
                    const expiresAt = new Date(Date.now() + validated.ttl);
                    // Store in database
                    const lock = await lockModel.create({
                        lockKey: validated.lockKey,
                        ownerId,
                        jobId: config.jobId,
                        resourceType: config.resourceType,
                        resourceId: config.resourceId,
                        expiresAt,
                    });
                    // Setup auto-renewal if configured
                    if (config.extendInterval && config.extendInterval < validated.ttl) {
                        const intervalId = setInterval(async () => {
                            const extended = await (0, exports.extendDistributedLock)(redis, validated.lockKey, ownerId, validated.ttl);
                            if (extended) {
                                await lockModel.update({
                                    expiresAt: new Date(Date.now() + validated.ttl),
                                    renewedAt: new Date(),
                                    renewCount: lockModel.sequelize.literal('renew_count + 1'),
                                }, { where: { id: lock.id } });
                            }
                            else {
                                clearInterval(intervalId);
                                locks.delete(lock.id);
                            }
                        }, config.extendInterval);
                        locks.set(lock.id, { intervalId, ownerId });
                    }
                    return { lockId: lock.id, ownerId };
                }
                attempt++;
                if (attempt <= retries) {
                    await new Promise(resolve => setTimeout(resolve, retryDelay));
                }
            }
            return null;
        },
        async release(lockId) {
            const lock = await lockModel.findByPk(lockId);
            if (!lock)
                return false;
            // Stop auto-renewal
            const lockInfo = locks.get(lockId);
            if (lockInfo) {
                clearInterval(lockInfo.intervalId);
                locks.delete(lockId);
            }
            // Release Redis lock
            await (0, exports.releaseDistributedLock)(redis, lock.lockKey, lock.ownerId);
            // Delete from database
            await lock.destroy();
            return true;
        },
        async releaseAll() {
            let released = 0;
            for (const lockId of locks.keys()) {
                if (await this.release(lockId)) {
                    released++;
                }
            }
            return released;
        },
        async cleanupExpired() {
            const { Op } = require('sequelize');
            const expired = await lockModel.findAll({
                where: {
                    expiresAt: { [Op.lt]: new Date() },
                },
            });
            for (const lock of expired) {
                await (0, exports.releaseDistributedLock)(redis, lock.lockKey, lock.ownerId);
                await lock.destroy();
            }
            return expired.length;
        },
    };
};
exports.createDistributedLockManager = createDistributedLockManager;
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
const withDistributedLock = async (redis, lockKey, fn, config = { ttl: 30000 }) => {
    const ownerId = `worker-${process.pid}-${Date.now()}`;
    const retries = config.retries || 0;
    const retryDelay = config.retryDelay || 1000;
    let attempt = 0;
    while (attempt <= retries) {
        const acquired = await (0, exports.acquireDistributedLock)(redis, lockKey, ownerId, config.ttl);
        if (acquired) {
            try {
                return await fn();
            }
            finally {
                await (0, exports.releaseDistributedLock)(redis, lockKey, ownerId);
            }
        }
        attempt++;
        if (attempt <= retries) {
            await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
    }
    throw new Error(`Failed to acquire lock for ${lockKey} after ${retries + 1} attempts`);
};
exports.withDistributedLock = withDistributedLock;
// ============================================================================
// ADVANCED JOB SCHEDULING
// ============================================================================
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
const createCronSchedule = async (queue, scheduleModel, config) => {
    // Validate cron expression
    if (!isValidCronExpression(config.cronExpression)) {
        throw new Error(`Invalid cron expression: ${config.cronExpression}`);
    }
    // Create schedule in database
    const schedule = await scheduleModel.create({
        name: config.name,
        description: config.description,
        cronExpression: config.cronExpression,
        queueName: queue.name,
        jobName: config.jobName,
        jobData: config.jobData || {},
        jobOptions: config.jobOptions || {},
        timezone: config.timezone || 'UTC',
        startDate: config.startDate,
        endDate: config.endDate,
        maxRuns: config.maxRuns,
        enabled: config.enabled !== false,
    });
    // Add to Bull queue
    if (schedule.enabled) {
        await queue.add(config.jobName, config.jobData || {}, {
            ...config.jobOptions,
            repeat: {
                cron: config.cronExpression,
                tz: config.timezone || 'UTC',
                startDate: config.startDate,
                endDate: config.endDate,
                limit: config.maxRuns,
            },
        });
    }
    return schedule;
};
exports.createCronSchedule = createCronSchedule;
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
const updateScheduleRunTracking = async (scheduleModel, scheduleName, jobId) => {
    await scheduleModel.update({
        runCount: scheduleModel.sequelize.literal('run_count + 1'),
        lastRunAt: new Date(),
        lastJobId: jobId,
    }, {
        where: { name: scheduleName },
    });
    // Check if max runs reached
    const schedule = await scheduleModel.findOne({
        where: { name: scheduleName },
    });
    if (schedule && schedule.maxRuns && schedule.runCount >= schedule.maxRuns) {
        await schedule.update({ enabled: false });
    }
};
exports.updateScheduleRunTracking = updateScheduleRunTracking;
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
const toggleSchedule = async (queue, scheduleModel, scheduleName, enabled) => {
    const schedule = await scheduleModel.findOne({
        where: { name: scheduleName },
    });
    if (!schedule) {
        throw new Error(`Schedule ${scheduleName} not found`);
    }
    if (enabled && !schedule.enabled) {
        // Enable schedule
        await queue.add(schedule.jobName, schedule.jobData, {
            ...schedule.jobOptions,
            repeat: schedule.cronExpression ? {
                cron: schedule.cronExpression,
                tz: schedule.timezone,
                startDate: schedule.startDate,
                endDate: schedule.endDate,
                limit: schedule.maxRuns,
            } : {
                every: schedule.interval,
                limit: schedule.maxRuns,
            },
        });
    }
    else if (!enabled && schedule.enabled) {
        // Disable schedule
        const repeatableJobs = await queue.getRepeatableJobs();
        const job = repeatableJobs.find((j) => j.name === schedule.jobName &&
            (j.cron === schedule.cronExpression || j.every === schedule.interval));
        if (job) {
            await queue.removeRepeatableByKey(job.key);
        }
    }
    await schedule.update({ enabled });
};
exports.toggleSchedule = toggleSchedule;
// ============================================================================
// WORKER POOL ENHANCEMENTS
// ============================================================================
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
const createProductionWorker = (queue, processor, config, executionLogModel) => {
    // Validate configuration
    exports.WorkerPoolConfigSchema.parse(config);
    const { Worker } = require('bullmq');
    const workerId = `worker-${process.pid}-${Date.now()}`;
    const wrappedProcessor = async (job) => {
        const startTime = Date.now();
        const startUsage = process.cpuUsage();
        const startMemory = process.memoryUsage();
        try {
            const result = await processor(job);
            const duration = Date.now() - startTime;
            const cpuUsage = process.cpuUsage(startUsage);
            const memoryUsage = process.memoryUsage();
            // Log execution if model provided
            if (executionLogModel) {
                await executionLogModel.create({
                    jobId: job.id,
                    queueName: queue.name,
                    jobName: job.name,
                    status: 'completed',
                    result,
                    duration,
                    attempts: job.attemptsMade,
                    workerId,
                    workerHost: require('os').hostname(),
                    cpuUsage: (cpuUsage.user + cpuUsage.system) / 1000,
                    memoryUsage: memoryUsage.heapUsed,
                    idempotencyKey: job.data.idempotencyKey,
                });
            }
            return result;
        }
        catch (error) {
            const duration = Date.now() - startTime;
            // Log execution failure
            if (executionLogModel) {
                await executionLogModel.create({
                    jobId: job.id,
                    queueName: queue.name,
                    jobName: job.name,
                    status: 'failed',
                    error: error.message,
                    errorStack: error.stack,
                    duration,
                    attempts: job.attemptsMade,
                    workerId,
                    workerHost: require('os').hostname(),
                    idempotencyKey: job.data.idempotencyKey,
                });
            }
            throw error;
        }
    };
    const worker = new Worker(queue.name, wrappedProcessor, {
        connection: queue.opts.connection,
        concurrency: config.concurrency,
        lockDuration: config.lockDuration || 30000,
        lockRenewTime: config.lockRenewTime || 15000,
        maxStalledCount: config.maxStalledCount || 1,
        stalledInterval: config.stalledInterval || 30000,
    });
    // Add error handling
    worker.on('failed', (job, error) => {
        console.error(`[Worker:${workerId}] Job ${job.id} failed:`, error);
    });
    worker.on('stalled', (jobId) => {
        console.warn(`[Worker:${workerId}] Job ${jobId} stalled`);
    });
    return worker;
};
exports.createProductionWorker = createProductionWorker;
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
const aggregateJobMetrics = async (executionLogModel, filters) => {
    const { Op, fn, col, literal } = require('sequelize');
    const where = {};
    if (filters.queueName)
        where.queueName = filters.queueName;
    if (filters.jobName)
        where.jobName = filters.jobName;
    if (filters.workerId)
        where.workerId = filters.workerId;
    if (filters.status)
        where.status = filters.status;
    if (filters.startDate || filters.endDate) {
        where.executedAt = {};
        if (filters.startDate)
            where.executedAt[Op.gte] = filters.startDate;
        if (filters.endDate)
            where.executedAt[Op.lte] = filters.endDate;
    }
    // Get basic aggregations
    const aggregations = await executionLogModel.findOne({
        where,
        attributes: [
            [fn('COUNT', col('id')), 'totalJobs'],
            [fn('COUNT', literal("CASE WHEN status = 'completed' THEN 1 END")), 'successfulJobs'],
            [fn('COUNT', literal("CASE WHEN status = 'failed' THEN 1 END")), 'failedJobs'],
            [fn('AVG', col('duration')), 'avgDuration'],
            [fn('MIN', col('duration')), 'minDuration'],
            [fn('MAX', col('duration')), 'maxDuration'],
            [fn('AVG', col('cpuUsage')), 'avgCpuUsage'],
            [fn('AVG', col('memoryUsage')), 'avgMemoryUsage'],
        ],
        raw: true,
    });
    // Get percentiles
    const durations = await executionLogModel.findAll({
        where,
        attributes: ['duration'],
        order: [['duration', 'ASC']],
        raw: true,
    });
    const sortedDurations = durations.map((d) => d.duration).sort((a, b) => a - b);
    const p50Index = Math.floor(sortedDurations.length * 0.5);
    const p95Index = Math.floor(sortedDurations.length * 0.95);
    const p99Index = Math.floor(sortedDurations.length * 0.99);
    const totalJobs = parseInt(aggregations.totalJobs) || 0;
    const successfulJobs = parseInt(aggregations.successfulJobs) || 0;
    const failedJobs = parseInt(aggregations.failedJobs) || 0;
    return {
        totalJobs,
        successfulJobs,
        failedJobs,
        successRate: totalJobs > 0 ? (successfulJobs / totalJobs) * 100 : 0,
        avgDuration: parseFloat(aggregations.avgDuration) || 0,
        minDuration: parseInt(aggregations.minDuration) || 0,
        maxDuration: parseInt(aggregations.maxDuration) || 0,
        p50Duration: sortedDurations[p50Index] || 0,
        p95Duration: sortedDurations[p95Index] || 0,
        p99Duration: sortedDurations[p99Index] || 0,
        avgCpuUsage: parseFloat(aggregations.avgCpuUsage) || 0,
        avgMemoryUsage: parseFloat(aggregations.avgMemoryUsage) || 0,
    };
};
exports.aggregateJobMetrics = aggregateJobMetrics;
// ============================================================================
// NESTJS INTEGRATION UTILITIES
// ============================================================================
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
const createNestJSQueueProvider = (queueName, redisConfig) => {
    return {
        provide: `QUEUE_${queueName.toUpperCase()}`,
        useFactory: () => {
            return (0, exports.createProductionQueue)(queueName, redisConfig);
        },
    };
};
exports.createNestJSQueueProvider = createNestJSQueueProvider;
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
const Process = (jobName) => {
    return (target, propertyKey, descriptor) => {
        // This would integrate with @nestjs/bull decorators
        // Simplified for standalone usage
        descriptor.value.__jobName = jobName;
        return descriptor;
    };
};
exports.Process = Process;
// ============================================================================
// CIRCUIT BREAKER PATTERN
// ============================================================================
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
const createJobCircuitBreaker = (config) => {
    let failureCount = 0;
    let successCount = 0;
    let lastFailureTime = null;
    let state = 'closed';
    const setState = (newState) => {
        if (state !== newState) {
            state = newState;
            if (config.onStateChange) {
                config.onStateChange(newState);
            }
        }
    };
    return {
        async execute(fn) {
            const now = Date.now();
            // Check if we should reset to half-open
            if (state === 'open' && lastFailureTime && now - lastFailureTime >= config.resetTimeout) {
                setState('half-open');
                failureCount = 0;
                successCount = 0;
            }
            // Reject if circuit is open
            if (state === 'open') {
                throw new Error('Circuit breaker is OPEN - requests are being rejected');
            }
            try {
                const result = await fn();
                // Record success
                if (state === 'half-open') {
                    successCount++;
                    if (successCount >= config.halfOpenRetries) {
                        setState('closed');
                        failureCount = 0;
                        successCount = 0;
                    }
                }
                else {
                    failureCount = 0;
                }
                return result;
            }
            catch (error) {
                // Record failure
                failureCount++;
                lastFailureTime = now;
                successCount = 0;
                // Open circuit if threshold reached
                if (failureCount >= config.failureThreshold) {
                    setState('open');
                }
                throw error;
            }
        },
        getState() {
            return state;
        },
        getMetrics() {
            return {
                state,
                failureCount,
                successCount,
                lastFailureTime: lastFailureTime ? new Date(lastFailureTime) : null,
            };
        },
        reset() {
            setState('closed');
            failureCount = 0;
            successCount = 0;
            lastFailureTime = null;
        },
    };
};
exports.createJobCircuitBreaker = createJobCircuitBreaker;
// Continue with remaining functions...
// (Due to length, I'll add the remaining functions in the next section)
// ============================================================================
// SAGA PATTERN SUPPORT
// ============================================================================
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
const createSagaCoordinator = (queues) => {
    const steps = [];
    const sagaId = `saga-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const completedSteps = [];
    return {
        addStep(name, queue, data, compensate) {
            steps.push({
                name,
                queueName: queue.name,
                data: { ...data, _sagaId: sagaId },
                compensate,
            });
            return this;
        },
        async execute() {
            const results = [];
            try {
                for (const step of steps) {
                    const queue = queues.get(step.queueName);
                    if (!queue) {
                        throw new Error(`Queue ${step.queueName} not found`);
                    }
                    const job = await queue.add(step.name, step.data);
                    const result = await job.waitUntilFinished(queue.events);
                    step.result = result;
                    results.push(result);
                    completedSteps.push(step.name);
                }
                return results;
            }
            catch (error) {
                // Compensate in reverse order
                console.error(`Saga ${sagaId} failed, initiating compensation`);
                await this.compensate();
                throw error;
            }
        },
        async compensate() {
            // Compensate in reverse order
            for (let i = completedSteps.length - 1; i >= 0; i--) {
                const stepName = completedSteps[i];
                const step = steps.find(s => s.name === stepName);
                if (step && step.compensate) {
                    try {
                        await step.compensate(step.result);
                        console.log(`Compensated step: ${stepName}`);
                    }
                    catch (compensateError) {
                        console.error(`Failed to compensate step ${stepName}:`, compensateError);
                    }
                }
            }
        },
        getSagaId() {
            return sagaId;
        },
        getCompletedSteps() {
            return [...completedSteps];
        },
    };
};
exports.createSagaCoordinator = createSagaCoordinator;
// ============================================================================
// HELPER UTILITIES
// ============================================================================
/**
 * Validates cron expression format.
 */
function isValidCronExpression(expr) {
    const cronRegex = /^(\*|([0-5]?\d)) (\*|([01]?\d|2[0-3])) (\*|([01]?\d|2\d|3[01])) (\*|([1-9]|1[0-2])) (\*|([0-6]))$/;
    return cronRegex.test(expr);
}
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
 * Calculates exponential backoff delay.
 */
function calculateExponentialBackoff(attemptNumber, baseDelay = 1000, maxDelay = 60000) {
    const delay = baseDelay * Math.pow(2, attemptNumber - 1);
    return Math.min(delay, maxDelay);
}
/**
 * Validates and sanitizes job data.
 */
function sanitizeJobData(data) {
    // Remove circular references
    return JSON.parse(JSON.stringify(data));
}
/**
 * Creates a unique idempotency key from job data.
 */
function createIdempotencyKey(prefix, data, fields) {
    const values = fields.map(field => data[field]).filter(Boolean);
    const hash = require('crypto')
        .createHash('sha256')
        .update(JSON.stringify(values))
        .digest('hex')
        .substring(0, 16);
    return `${prefix}-${hash}`;
}
// ============================================================================
// RATE LIMITING
// ============================================================================
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
const applyRateLimit = async (queue, config) => {
    exports.RateLimitConfigSchema.parse(config);
    await queue.setLimiter({
        max: config.max,
        duration: config.duration,
        bounceBack: config.bounceBack || false,
        groupKey: config.groupKey,
    });
};
exports.applyRateLimit = applyRateLimit;
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
const createSlidingWindowLimiter = (redis, key, limit, windowMs) => {
    return {
        async checkLimit() {
            const now = Date.now();
            const windowStart = now - windowMs;
            await redis.zremrangebyscore(key, '-inf', windowStart);
            const count = await redis.zcard(key);
            if (count < limit) {
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
    };
};
exports.createSlidingWindowLimiter = createSlidingWindowLimiter;
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
        reset() {
            tokens = capacity;
            lastRefill = Date.now();
        },
    };
};
exports.createTokenBucketLimiter = createTokenBucketLimiter;
// ============================================================================
// DEAD LETTER QUEUE
// ============================================================================
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
const createDeadLetterQueue = (dlqName, redisConnection, jobModel) => {
    const dlQueue = (0, exports.createProductionQueue)(dlqName, redisConnection);
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
            await originalQueue.add('retry-from-dlq', data.data, {
                jobId: `retry-${jobId}`,
                attempts: 3,
            });
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
// JOB BATCHING
// ============================================================================
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
const createJobBatch = async (queue, batchName, jobs, options) => {
    const batchId = `batch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const jobIds = [];
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
// QUEUE MONITORING AND HEALTH
// ============================================================================
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
// JOB PROGRESS TRACKING
// ============================================================================
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
// ============================================================================
// JOB CANCELLATION AND CLEANUP
// ============================================================================
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
const cancelJob = async (queue, jobId) => {
    const job = await queue.getJob(jobId);
    if (!job) {
        return false;
    }
    const state = await job.getState();
    if (state === 'active') {
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
const cleanupOldJobs = async (queue, config) => {
    const now = Date.now();
    let completedRemoved = 0;
    let failedRemoved = 0;
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
const createJobCleanupScheduler = (queue, config) => {
    let intervalId = null;
    return {
        start() {
            if (intervalId)
                return;
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
// ADVANCED RETRY STRATEGIES
// ============================================================================
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
// ============================================================================
// EVENT-DRIVEN WORKFLOWS
// ============================================================================
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
                    if (i > 0 && step.transformData) {
                        currentData = step.transformData(currentData);
                    }
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
const createParentChildJobs = async (parentQueue, childQueue, parentJobName, parentData, childJobs) => {
    const parentJob = await parentQueue.add(parentJobName, parentData, {
        jobId: `parent-${Date.now()}`,
    });
    const childJobIds = [];
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
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Schemas
    JobOptionsSchema: exports.JobOptionsSchema,
    JobDataSchema: exports.JobDataSchema,
    WorkerPoolConfigSchema: exports.WorkerPoolConfigSchema,
    RateLimitConfigSchema: exports.RateLimitConfigSchema,
    DistributedLockConfigSchema: exports.DistributedLockConfigSchema,
    // Models
    createProductionJobModel: exports.createProductionJobModel,
    createJobScheduleModel: exports.createJobScheduleModel,
    createJobExecutionLogModel: exports.createJobExecutionLogModel,
    createIdempotencyKeyModel: exports.createIdempotencyKeyModel,
    createDistributedLockModel: exports.createDistributedLockModel,
    // Queue Management
    createProductionQueue: exports.createProductionQueue,
    createValidatedJob: exports.createValidatedJob,
    createIdempotentJob: exports.createIdempotentJob,
    updateIdempotencyKey: exports.updateIdempotencyKey,
    cleanupExpiredIdempotencyKeys: exports.cleanupExpiredIdempotencyKeys,
    // Distributed Locks
    acquireDistributedLock: exports.acquireDistributedLock,
    releaseDistributedLock: exports.releaseDistributedLock,
    extendDistributedLock: exports.extendDistributedLock,
    createDistributedLockManager: exports.createDistributedLockManager,
    withDistributedLock: exports.withDistributedLock,
    // Scheduling
    createCronSchedule: exports.createCronSchedule,
    updateScheduleRunTracking: exports.updateScheduleRunTracking,
    toggleSchedule: exports.toggleSchedule,
    // Workers
    createProductionWorker: exports.createProductionWorker,
    aggregateJobMetrics: exports.aggregateJobMetrics,
    // NestJS Integration
    createNestJSQueueProvider: exports.createNestJSQueueProvider,
    Process: exports.Process,
    // Patterns
    createJobCircuitBreaker: exports.createJobCircuitBreaker,
    createSagaCoordinator: exports.createSagaCoordinator,
    // Rate Limiting
    applyRateLimit: exports.applyRateLimit,
    createSlidingWindowLimiter: exports.createSlidingWindowLimiter,
    createTokenBucketLimiter: exports.createTokenBucketLimiter,
    // Dead Letter Queue
    createDeadLetterQueue: exports.createDeadLetterQueue,
    createAutoDLQHandler: exports.createAutoDLQHandler,
    // Batching
    createJobBatch: exports.createJobBatch,
    waitForBatchCompletion: exports.waitForBatchCompletion,
    createJobGrouper: exports.createJobGrouper,
    // Monitoring
    getQueueMetrics: exports.getQueueMetrics,
    createMetricsCollector: exports.createMetricsCollector,
    createQueueHealthChecker: exports.createQueueHealthChecker,
    // Progress
    updateJobProgress: exports.updateJobProgress,
    createProgressTracker: exports.createProgressTracker,
    // Cleanup
    cancelJob: exports.cancelJob,
    cleanupOldJobs: exports.cleanupOldJobs,
    createJobCleanupScheduler: exports.createJobCleanupScheduler,
    // Retry
    createExponentialBackoff: exports.createExponentialBackoff,
    createCustomRetryStrategy: exports.createCustomRetryStrategy,
    // Workflows
    createJobWorkflow: exports.createJobWorkflow,
    createJobEventListeners: exports.createJobEventListeners,
    createParentChildJobs: exports.createParentChildJobs,
    // Utilities
    generateJobId,
    formatDuration,
    calculateExponentialBackoff,
    sanitizeJobData,
    createIdempotencyKey,
};
//# sourceMappingURL=background-jobs-kit.prod.js.map