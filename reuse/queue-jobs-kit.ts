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

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface JobOptions {
  priority?: number;
  delay?: number;
  attempts?: number;
  backoff?: number | { type: string; delay: number };
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

interface JobProgress {
  percentage: number;
  message?: string;
  data?: Record<string, any>;
  timestamp: Date;
}

interface JobResult {
  jobId: string;
  queueName: string;
  status: 'completed' | 'failed';
  result?: any;
  error?: string;
  duration: number;
  completedAt: Date;
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

interface JobEvent {
  eventType: 'created' | 'active' | 'completed' | 'failed' | 'progress' | 'stalled' | 'removed';
  jobId: string;
  queueName: string;
  data?: any;
  timestamp: Date;
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
export const createJobModel = (sequelize: any, DataTypes: any) => {
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
export const createQueueModel = (sequelize: any, DataTypes: any) => {
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
export const createJobResultModel = (sequelize: any, DataTypes: any) => {
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
export const createJobEventModel = (sequelize: any, DataTypes: any) => {
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
export const createQueue = (
  queueName: string,
  redisConnection: any,
  defaultJobOptions?: Partial<JobOptions>,
): any => {
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
export const createQueueManager = (redisConnection: any) => {
  const queues = new Map<string, any>();

  return {
    registerQueue(queueName: string, options?: Partial<JobOptions>): any {
      if (queues.has(queueName)) {
        return queues.get(queueName);
      }

      const queue = createQueue(queueName, redisConnection, options);
      queues.set(queueName, queue);
      return queue;
    },

    getQueue(queueName: string): any | undefined {
      return queues.get(queueName);
    },

    getAllQueues(): Map<string, any> {
      return new Map(queues);
    },

    async addJob(queueName: string, jobName: string, data: any, options?: JobOptions): Promise<any> {
      const queue = queues.get(queueName);
      if (!queue) {
        throw new Error(`Queue ${queueName} not registered`);
      }

      return queue.add(jobName, data, options);
    },

    async pauseQueue(queueName: string): Promise<void> {
      const queue = queues.get(queueName);
      if (queue) {
        await queue.pause();
      }
    },

    async resumeQueue(queueName: string): Promise<void> {
      const queue = queues.get(queueName);
      if (queue) {
        await queue.resume();
      }
    },

    async closeQueue(queueName: string): Promise<void> {
      const queue = queues.get(queueName);
      if (queue) {
        await queue.close();
        queues.delete(queueName);
      }
    },

    async closeAll(): Promise<void> {
      const closePromises = Array.from(queues.values()).map((q) => q.close());
      await Promise.all(closePromises);
      queues.clear();
    },
  };
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
export const createPersistentQueue = (
  queueName: string,
  redisConnection: any,
  jobModel: any,
) => {
  const queue = createQueue(queueName, redisConnection);

  // Hook into job lifecycle events
  queue.on('added', async (job: any) => {
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

  queue.on('active', async (job: any) => {
    await jobModel.update(
      { status: 'active', processedOn: new Date() },
      { where: { jobId: job.id } }
    );
  });

  queue.on('completed', async (job: any, result: any) => {
    await jobModel.update(
      {
        status: 'completed',
        finishedOn: new Date(),
        returnValue: result,
      },
      { where: { jobId: job.id } }
    );
  });

  queue.on('failed', async (job: any, err: Error) => {
    await jobModel.update(
      {
        status: 'failed',
        finishedOn: new Date(),
        failedReason: err.message,
        stackTrace: err.stack,
        attempts: job.attemptsMade,
      },
      { where: { jobId: job.id } }
    );
  });

  return queue;
};

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
export const scheduleDelayedJob = async (
  queue: any,
  jobName: string,
  data: any,
  scheduleTime: Date | number,
): Promise<any> => {
  const delay = scheduleTime instanceof Date
    ? scheduleTime.getTime() - Date.now()
    : scheduleTime;

  if (delay < 0) {
    throw new Error('Schedule time must be in the future');
  }

  return queue.add(jobName, data, { delay });
};

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
export const createCronJob = async (
  queue: any,
  jobName: string,
  data: any,
  cronExpression: string,
  timezone?: string,
): Promise<any> => {
  return queue.add(jobName, data, {
    repeat: {
      cron: cronExpression,
      tz: timezone || 'UTC',
    },
  });
};

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
export const createIntervalJob = async (
  queue: any,
  jobName: string,
  data: any,
  intervalMs: number,
  maxCount?: number,
): Promise<any> => {
  return queue.add(jobName, data, {
    repeat: {
      every: intervalMs,
      limit: maxCount,
    },
  });
};

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
export const removeRepeatableJob = async (
  queue: any,
  repeatKey: string,
): Promise<boolean> => {
  return queue.removeRepeatableByKey(repeatKey);
};

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
export const addHighPriorityJob = async (
  queue: any,
  jobName: string,
  data: any,
  priority: number = 10,
): Promise<any> => {
  return queue.add(jobName, data, { priority, lifo: true });
};

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
export const createPriorityJobScheduler = (queue: any) => {
  return {
    async addCritical(jobName: string, data: any, options?: JobOptions): Promise<any> {
      return queue.add(jobName, data, { ...options, priority: 100, lifo: true });
    },

    async addHigh(jobName: string, data: any, options?: JobOptions): Promise<any> {
      return queue.add(jobName, data, { ...options, priority: 75 });
    },

    async addNormal(jobName: string, data: any, options?: JobOptions): Promise<any> {
      return queue.add(jobName, data, { ...options, priority: 50 });
    },

    async addLow(jobName: string, data: any, options?: JobOptions): Promise<any> {
      return queue.add(jobName, data, { ...options, priority: 25 });
    },

    async addBackground(jobName: string, data: any, options?: JobOptions): Promise<any> {
      return queue.add(jobName, data, { ...options, priority: 1 });
    },
  };
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
export const adjustJobPriority = async (
  queue: any,
  jobId: string,
  priorityFn: (job: any) => number,
): Promise<void> => {
  const job = await queue.getJob(jobId);
  if (!job) {
    throw new Error(`Job ${jobId} not found`);
  }

  const newPriority = priorityFn(job);
  await job.changePriority({ priority: newPriority });
};

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
export const createWorkerPool = (
  queue: any,
  processor: (job: any) => Promise<any>,
  config: WorkerPoolConfig,
): any => {
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
export const createWorkerPoolManager = (redisConnection: any) => {
  const workers = new Map<string, any>();

  return {
    registerWorker(
      queueName: string,
      processor: (job: any) => Promise<any>,
      config: WorkerPoolConfig,
    ): any {
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

    getWorker(queueName: string): any | undefined {
      return workers.get(queueName);
    },

    async pauseWorker(queueName: string): Promise<void> {
      const worker = workers.get(queueName);
      if (worker) {
        await worker.pause();
      }
    },

    async resumeWorker(queueName: string): Promise<void> {
      const worker = workers.get(queueName);
      if (worker) {
        await worker.resume();
      }
    },

    async closeWorker(queueName: string): Promise<void> {
      const worker = workers.get(queueName);
      if (worker) {
        await worker.close();
        workers.delete(queueName);
      }
    },

    async closeAll(): Promise<void> {
      const closePromises = Array.from(workers.values()).map((w) => w.close());
      await Promise.all(closePromises);
      workers.clear();
    },

    getAllWorkers(): Map<string, any> {
      return new Map(workers);
    },
  };
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
export const createAutoScalingWorkerPool = (
  queue: any,
  processor: (job: any) => Promise<any>,
  config: {
    minConcurrency: number;
    maxConcurrency: number;
    scaleUpThreshold: number;
    scaleDownThreshold: number;
    checkInterval?: number;
  },
) => {
  let currentConcurrency = config.minConcurrency;
  let worker: any = null;
  let scalingInterval: NodeJS.Timeout | null = null;

  const createWorkerWithConcurrency = (concurrency: number) => {
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
      const newConcurrency = Math.min(
        config.maxConcurrency,
        currentConcurrency + Math.ceil(currentConcurrency * 0.5)
      );
      console.log(`Scaling up: ${currentConcurrency} -> ${newConcurrency}`);
      createWorkerWithConcurrency(newConcurrency);
    } else if (waiting <= config.scaleDownThreshold && currentConcurrency > config.minConcurrency) {
      const newConcurrency = Math.max(
        config.minConcurrency,
        currentConcurrency - Math.ceil(currentConcurrency * 0.25)
      );
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
export const createExponentialBackoff = (
  initialDelay: number = 1000,
  maxDelay: number = 60000,
  multiplier: number = 2,
) => {
  return {
    type: 'custom',
    calculate: (attemptsMade: number): number => {
      const delay = initialDelay * Math.pow(multiplier, attemptsMade - 1);
      return Math.min(delay, maxDelay);
    },
  };
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
export const createCustomRetryStrategy = (
  shouldRetry: (job: any, error: Error) => boolean,
  getDelay: (attemptsMade: number) => number,
) => {
  return {
    async handle(job: any, error: Error): Promise<{ retry: boolean; delay?: number }> {
      const retry = shouldRetry(job, error);

      if (!retry) {
        return { retry: false };
      }

      const delay = getDelay(job.attemptsMade);
      return { retry: true, delay };
    },
  };
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
export const createCircuitBreakerRetry = (config: {
  failureThreshold: number;
  resetTimeout: number;
  halfOpenRetries: number;
}) => {
  let failureCount = 0;
  let lastFailureTime: number | null = null;
  let state: 'closed' | 'open' | 'half-open' = 'closed';

  return {
    shouldRetry(error: Error): boolean {
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

    recordSuccess(): void {
      failureCount = 0;
      state = 'closed';
    },

    getState(): string {
      return state;
    },

    reset(): void {
      failureCount = 0;
      lastFailureTime = null;
      state = 'closed';
    },
  };
};

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
export const createDeadLetterQueue = (
  dlqName: string,
  redisConnection: any,
  jobModel: any,
) => {
  const dlQueue = createQueue(dlqName, redisConnection);

  return {
    async moveToDeadLetter(job: any, error: Error): Promise<void> {
      const deadLetterJob: DeadLetterJob = {
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
      await jobModel.update(
        {
          status: 'failed',
          failedReason: error.message,
          stackTrace: error.stack,
        },
        { where: { jobId: job.id } }
      );
    },

    async getDeadLetters(limit: number = 100): Promise<DeadLetterJob[]> {
      const jobs = await dlQueue.getJobs(['failed', 'completed'], 0, limit - 1);
      return jobs.map((job: any) => job.data);
    },

    async retryDeadLetter(jobId: string, originalQueue: any): Promise<void> {
      const dlJobs = await dlQueue.getJobs(['failed', 'completed']);
      const deadJob = dlJobs.find((job: any) => job.data.jobId === jobId);

      if (!deadJob) {
        throw new Error(`Dead letter job ${jobId} not found`);
      }

      const data: DeadLetterJob = deadJob.data;

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

    async purgeDeadLetters(olderThan?: Date): Promise<number> {
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
export const createAutoDLQHandler = (
  queues: Map<string, any>,
  dlq: any,
) => {
  const listeners = new Map<string, any>();

  return {
    start(): void {
      queues.forEach((queue, queueName) => {
        const listener = async (job: any, error: Error) => {
          if (job.attemptsMade >= (job.opts?.attempts || 3)) {
            await dlq.moveToDeadLetter(job, error);
          }
        };

        queue.on('failed', listener);
        listeners.set(queueName, listener);
      });
    },

    stop(): void {
      queues.forEach((queue, queueName) => {
        const listener = listeners.get(queueName);
        if (listener) {
          queue.off('failed', listener);
        }
      });
      listeners.clear();
    },

    isRunning(): boolean {
      return listeners.size > 0;
    },
  };
};

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
export const updateJobProgress = async (
  job: any,
  percentage: number,
  message?: string,
  data?: Record<string, any>,
): Promise<void> => {
  const progress: JobProgress = {
    percentage: Math.max(0, Math.min(100, percentage)),
    message,
    data,
    timestamp: new Date(),
  };

  await job.updateProgress(progress);
};

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
export const createProgressTracker = (job: any, totalSteps: number) => {
  let currentStep = 0;

  return {
    async step(message: string, data?: Record<string, any>): Promise<void> {
      currentStep++;
      const percentage = Math.floor((currentStep / totalSteps) * 100);
      await updateJobProgress(job, percentage, message, data);
    },

    async setStep(step: number, message: string, data?: Record<string, any>): Promise<void> {
      currentStep = step;
      const percentage = Math.floor((currentStep / totalSteps) * 100);
      await updateJobProgress(job, percentage, message, data);
    },

    async complete(message: string = 'Completed'): Promise<void> {
      currentStep = totalSteps;
      await updateJobProgress(job, 100, message);
    },

    getCurrentStep(): number {
      return currentStep;
    },

    getPercentage(): number {
      return Math.floor((currentStep / totalSteps) * 100);
    },
  };
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
export const monitorJobProgress = (queue: any, jobEventModel: any): (() => void) => {
  const progressListener = async (job: any, progress: any) => {
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
export const cancelJob = async (queue: any, jobId: string): Promise<boolean> => {
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
  } else if (['waiting', 'delayed'].includes(state)) {
    await job.remove();
    return true;
  }

  return false;
};

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
export const cleanupOldJobs = async (
  queue: any,
  config: {
    completedOlderThan?: number;
    failedOlderThan?: number;
    limit?: number;
  },
): Promise<{ removed: number; completedRemoved: number; failedRemoved: number }> => {
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
export const createJobCleanupScheduler = (
  queue: any,
  config: {
    interval: number;
    completedOlderThan?: number;
    failedOlderThan?: number;
    limit?: number;
  },
) => {
  let intervalId: NodeJS.Timeout | null = null;

  return {
    start(): void {
      if (intervalId) {
        return;
      }

      const cleanup = async () => {
        try {
          const result = await cleanupOldJobs(queue, config);
          console.log(
            `[${queue.name}] Cleanup: removed ${result.removed} jobs ` +
            `(${result.completedRemoved} completed, ${result.failedRemoved} failed)`
          );
        } catch (error) {
          console.error(`[${queue.name}] Cleanup error:`, error);
        }
      };

      intervalId = setInterval(cleanup, config.interval);
    },

    stop(): void {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    },

    async runNow(): Promise<void> {
      return cleanupOldJobs(queue, config);
    },

    isRunning(): boolean {
      return intervalId !== null;
    },
  };
};

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
export const createJobBatch = async (
  queue: any,
  batchName: string,
  jobs: Array<{ name: string; data: any }>,
  options?: JobOptions,
): Promise<JobBatch> => {
  const batchId = `batch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const jobIds: string[] = [];

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
export const waitForBatchCompletion = async (
  queue: any,
  batch: JobBatch,
  timeout?: number,
): Promise<{
  batchId: string;
  total: number;
  completed: number;
  failed: number;
  results: any[];
  errors: any[];
}> => {
  const startTime = Date.now();
  const results: any[] = [];
  const errors: any[] = [];
  let completed = 0;
  let failed = 0;

  while (completed + failed < batch.jobIds.length) {
    if (timeout && Date.now() - startTime > timeout) {
      throw new Error(`Batch ${batch.batchId} timeout after ${timeout}ms`);
    }

    for (const jobId of batch.jobIds) {
      const job = await queue.getJob(jobId);
      if (!job) continue;

      const state = await job.getState();

      if (state === 'completed' && !results.find((r) => r.jobId === jobId)) {
        results.push({ jobId, result: job.returnvalue });
        completed++;
      } else if (state === 'failed' && !errors.find((e) => e.jobId === jobId)) {
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
export const createJobGrouper = (
  queue: any,
  groupKeyFn: (data: any) => string,
  batchSize: number = 10,
  flushInterval: number = 30000,
) => {
  const groups = new Map<string, any[]>();
  let flushTimer: NodeJS.Timeout | null = null;

  const flush = async (groupKey?: string) => {
    const keysToFlush = groupKey ? [groupKey] : Array.from(groups.keys());

    for (const key of keysToFlush) {
      const jobs = groups.get(key);
      if (!jobs || jobs.length === 0) continue;

      await queue.add('grouped-jobs', {
        groupKey: key,
        jobs: jobs.splice(0),
      });

      groups.delete(key);
    }
  };

  const scheduleFlush = () => {
    if (flushTimer) clearTimeout(flushTimer);
    flushTimer = setTimeout(() => flush(), flushInterval);
  };

  return {
    async add(name: string, data: any, options?: JobOptions): Promise<void> {
      const groupKey = groupKeyFn(data);

      if (!groups.has(groupKey)) {
        groups.set(groupKey, []);
      }

      groups.get(groupKey)!.push({ name, data, options });

      if (groups.get(groupKey)!.length >= batchSize) {
        await flush(groupKey);
      } else {
        scheduleFlush();
      }
    },

    async flush(): Promise<void> {
      return flush();
    },

    getGroups(): Map<string, any[]> {
      return new Map(groups);
    },
  };
};

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
export const getQueueMetrics = async (queue: any): Promise<QueueMetrics> => {
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
export const createMetricsCollector = (
  queues: Map<string, any>,
  interval: number,
  onMetrics: (metrics: QueueMetrics[]) => Promise<void>,
) => {
  let intervalId: NodeJS.Timeout | null = null;

  const collect = async () => {
    const metrics: QueueMetrics[] = [];

    for (const queue of queues.values()) {
      try {
        const queueMetrics = await getQueueMetrics(queue);
        metrics.push(queueMetrics);
      } catch (error) {
        console.error(`Error collecting metrics for ${queue.name}:`, error);
      }
    }

    if (metrics.length > 0) {
      await onMetrics(metrics);
    }
  };

  return {
    start(): void {
      if (intervalId) return;
      intervalId = setInterval(collect, interval);
    },

    stop(): void {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    },

    async collectNow(): Promise<void> {
      return collect();
    },

    isRunning(): boolean {
      return intervalId !== null;
    },
  };
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
export const createQueueHealthChecker = (
  queue: any,
  thresholds: {
    maxWaiting?: number;
    maxActive?: number;
    maxFailedRate?: number;
    checkInterval?: number;
  },
  onUnhealthy: (status: { healthy: boolean; issues: string[] }) => Promise<void>,
) => {
  let intervalId: NodeJS.Timeout | null = null;

  const check = async () => {
    const metrics = await getQueueMetrics(queue);
    const issues: string[] = [];

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
          issues.push(
            `Failed rate (${(failedRate * 100).toFixed(1)}%) exceeds threshold ` +
            `(${(thresholds.maxFailedRate * 100).toFixed(1)}%)`
          );
        }
      }
    }

    if (issues.length > 0) {
      await onUnhealthy({ healthy: false, issues });
    }
  };

  return {
    start(): void {
      if (intervalId) return;
      intervalId = setInterval(check, thresholds.checkInterval || 60000);
    },

    stop(): void {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    },

    async checkNow(): Promise<void> {
      return check();
    },

    isRunning(): boolean {
      return intervalId !== null;
    },
  };
};

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
export const storeJobResults = (
  queue: any,
  jobResultModel: any,
  retentionDays: number = 30,
): (() => void) => {
  const completedListener = async (job: any, result: any) => {
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

  const failedListener = async (job: any, error: Error) => {
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
export const queryJobResults = async (
  jobResultModel: any,
  filters: {
    queueName?: string;
    status?: 'completed' | 'failed';
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  },
): Promise<{ results: any[]; total: number; page: number; pageSize: number }> => {
  const { Op } = require('sequelize');
  const where: any = {};

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
export const createJobWorkflow = (queues: Map<string, any>) => {
  const steps: Array<{
    queueName: string;
    jobName: string;
    transformData?: (prevResult: any) => any;
  }> = [];

  let initialData: any;
  let onCompleteCallback: ((results: any[]) => Promise<void>) | null = null;
  let onErrorCallback: ((error: Error, step: number) => Promise<void>) | null = null;

  return {
    start(queueName: string, jobName: string, data: any) {
      initialData = data;
      steps.push({ queueName, jobName });
      return this;
    },

    then(queueName: string, jobName: string, transformData?: (prevResult: any) => any) {
      steps.push({ queueName, jobName, transformData });
      return this;
    },

    onComplete(callback: (results: any[]) => Promise<void>) {
      onCompleteCallback = callback;
      return this;
    },

    onError(callback: (error: Error, step: number) => Promise<void>) {
      onErrorCallback = callback;
      return this;
    },

    async execute(): Promise<any[]> {
      const results: any[] = [];
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
      } catch (error) {
        if (onErrorCallback) {
          await onErrorCallback(error as Error, results.length);
        }
        throw error;
      }
    },
  };
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
export const createJobEventListeners = (
  queue: any,
  handlers: {
    onActive?: (job: any) => Promise<void>;
    onCompleted?: (job: any, result: any) => Promise<void>;
    onFailed?: (job: any, error: Error) => Promise<void>;
    onProgress?: (job: any, progress: any) => Promise<void>;
    onStalled?: (job: any) => Promise<void>;
  },
): (() => void) => {
  const listeners: Array<{ event: string; handler: any }> = [];

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
export const createParentChildJobs = async (
  parentQueue: any,
  childQueue: any,
  parentJobName: string,
  parentData: any,
  childJobs: Array<{ name: string; data: any; options?: JobOptions }>,
): Promise<ParentChildRelation> => {
  // Create parent job first
  const parentJob = await parentQueue.add(parentJobName, parentData, {
    jobId: `parent-${Date.now()}`,
  });

  const childJobIds: string[] = [];

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
export const waitForChildJobs = async (
  parentQueue: any,
  childQueue: any,
  relation: ParentChildRelation,
  timeout?: number,
): Promise<{ parentResult: any; childResults: any[]; allSucceeded: boolean }> => {
  const startTime = Date.now();
  const childResults: any[] = [];
  let allCompleted = false;
  let allSucceeded = true;

  // Wait for all children
  while (!allCompleted) {
    if (timeout && Date.now() - startTime > timeout) {
      throw new Error(`Timeout waiting for child jobs after ${timeout}ms`);
    }

    const childStates = await Promise.all(
      relation.childJobIds.map(async (childId) => {
        const job = await childQueue.getJob(childId);
        if (!job) return { state: 'missing', result: null };

        const state = await job.getState();
        return { state, result: job.returnvalue, error: job.failedReason };
      })
    );

    allCompleted = childStates.every((s) =>
      ['completed', 'failed'].includes(s.state)
    );

    if (allCompleted) {
      allSucceeded = childStates.every((s) => s.state === 'completed');
      childResults.push(...childStates.map((s) => s.result || s.error));
    } else {
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
export const createJobDependencyGraph = (queues: Map<string, any>) => {
  const jobs = new Map<string, {
    id: string;
    queueName: string;
    jobName: string;
    data: any;
    dependencies: string[];
    job?: any;
    result?: any;
  }>();

  return {
    addJob(
      id: string,
      queueName: string,
      jobName: string,
      data: any,
      dependencies: string[] = [],
    ): string {
      jobs.set(id, {
        id,
        queueName,
        jobName,
        data,
        dependencies,
      });
      return id;
    },

    async execute(): Promise<Map<string, any>> {
      const results = new Map<string, any>();
      const completed = new Set<string>();

      const canExecute = (jobId: string): boolean => {
        const job = jobs.get(jobId);
        if (!job) return false;
        return job.dependencies.every((depId) => completed.has(depId));
      };

      while (completed.size < jobs.size) {
        const ready = Array.from(jobs.keys()).filter(
          (id) => !completed.has(id) && canExecute(id)
        );

        if (ready.length === 0 && completed.size < jobs.size) {
          throw new Error('Circular dependency detected in job graph');
        }

        // Execute ready jobs in parallel
        await Promise.all(
          ready.map(async (jobId) => {
            const jobSpec = jobs.get(jobId)!;
            const queue = queues.get(jobSpec.queueName);

            if (!queue) {
              throw new Error(`Queue ${jobSpec.queueName} not found`);
            }

            const job = await queue.add(jobSpec.jobName, jobSpec.data);
            const result = await job.waitUntilFinished(queue.events);

            results.set(jobId, result);
            completed.add(jobId);
          })
        );
      }

      return results;
    },

    getGraph(): Map<string, any> {
      return new Map(jobs);
    },
  };
};

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
export const applyRateLimit = async (
  queue: any,
  config: RateLimitConfig,
): Promise<void> => {
  await queue.setLimiter({
    max: config.max,
    duration: config.duration,
    bounceBack: config.bounceBack || false,
    groupKey: config.groupKey,
  });
};

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
export const createTokenBucketLimiter = (
  capacity: number,
  refillRate: number,
  refillInterval: number,
) => {
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
    async consume(count: number = 1): Promise<boolean> {
      refill();

      if (tokens >= count) {
        tokens -= count;
        return true;
      }

      return false;
    },

    getAvailableTokens(): number {
      refill();
      return tokens;
    },

    async waitForTokens(count: number = 1, timeout?: number): Promise<boolean> {
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

    reset(): void {
      tokens = capacity;
      lastRefill = Date.now();
    },
  };
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
export const createSlidingWindowLimiter = (
  redis: any,
  key: string,
  limit: number,
  windowMs: number,
) => {
  return {
    async checkLimit(): Promise<boolean> {
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

    async getCurrentCount(): Promise<number> {
      const now = Date.now();
      const windowStart = now - windowMs;
      await redis.zremrangebyscore(key, '-inf', windowStart);
      return redis.zcard(key);
    },

    async reset(): Promise<void> {
      await redis.del(key);
    },

    async getTimeUntilReset(): Promise<number> {
      const ttl = await redis.pttl(key);
      return Math.max(0, ttl);
    },
  };
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
export const createDistributedRateLimiter = (redis: any, namespace: string) => {
  return {
    async tryAcquire(
      resourceId: string,
      maxRequests: number,
      windowMs: number,
    ): Promise<boolean> {
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

    async getStatus(resourceId: string): Promise<{
      current: number;
      remaining: number;
      resetAt: Date;
    }> {
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

// ============================================================================
// HELPER UTILITIES
// ============================================================================

/**
 * Generates a unique job ID.
 */
function generateJobId(prefix?: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return prefix ? `${prefix}-${timestamp}-${random}` : `${timestamp}-${random}`;
}

/**
 * Formats duration in milliseconds to human-readable string.
 */
function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

/**
 * Validates cron expression format.
 */
function isValidCronExpression(expr: string): boolean {
  const cronRegex = /^(\*|([0-5]?\d)) (\*|([01]?\d|2[0-3])) (\*|([01]?\d|2\d|3[01])) (\*|([1-9]|1[0-2])) (\*|([0-6]))$/;
  return cronRegex.test(expr);
}
