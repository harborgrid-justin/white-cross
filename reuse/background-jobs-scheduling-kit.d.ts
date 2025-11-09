/**
 * LOC: BG-JOB-SCH-001
 * File: /reuse/background-jobs-scheduling-kit.ts
 *
 * UPSTREAM (imports from):
 *   - bull / bullmq
 *   - @nestjs/bull
 *   - node-cron
 *   - cron-parser
 *   - sequelize
 *   - ioredis
 *
 * DOWNSTREAM (imported by):
 *   - Job scheduling services
 *   - Background task processors
 *   - Cron job managers
 *   - Workflow orchestrators
 */
/**
 * File: /reuse/background-jobs-scheduling-kit.ts
 * Locator: WC-UTL-BG-JOB-SCH-001
 * Purpose: Advanced Background Job Scheduling - Comprehensive scheduling patterns for NestJS + Bull/BullMQ
 *
 * Upstream: bull, bullmq, @nestjs/bull, node-cron, cron-parser, sequelize, ioredis
 * Downstream: ../backend/*, scheduler modules, workflow engines, job orchestrators
 * Dependencies: NestJS 10.x, Bull 4.x / BullMQ 4.x, Sequelize 6.x, TypeScript 5.x, Redis
 * Exports: 45 utility functions for advanced job scheduling, cron management, job templates,
 *          state machines, job recovery, schedule optimization, job chaining, recurring patterns
 *
 * LLM Context: Advanced background job scheduling utilities for White Cross healthcare system.
 * Provides sophisticated scheduling patterns, cron expression management, job state machines,
 * schedule templates, job recovery strategies, dynamic scheduling, calendar-aware scheduling,
 * job concurrency management, schedule optimization, job chaining, conditional execution,
 * distributed locking, job deduplication, and comprehensive schedule persistence.
 * Essential for complex healthcare workflow automation and reliable background processing.
 */
interface CronSchedule {
    id: string;
    name: string;
    cronExpression: string;
    timezone: string;
    enabled: boolean;
    jobData?: any;
    lastRun?: Date;
    nextRun?: Date;
    metadata?: Record<string, any>;
}
interface JobTemplate {
    id: string;
    name: string;
    description: string;
    defaultData: any;
    defaultOptions: any;
    validators?: Array<(data: any) => boolean>;
    transformers?: Array<(data: any) => any>;
}
interface StateTransition {
    from: string;
    to: string;
    timestamp: Date;
    triggeredBy?: string;
    data?: any;
}
interface ChainStep {
    id: string;
    name: string;
    queueName: string;
    jobName: string;
    condition?: (context: any) => boolean;
    transform?: (context: any) => any;
    onSuccess?: (result: any, context: any) => void;
    onError?: (error: Error, context: any) => void;
}
interface RecurringPattern {
    type: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
    interval?: number;
    daysOfWeek?: number[];
    daysOfMonth?: number[];
    monthsOfYear?: number[];
    timeOfDay?: {
        hour: number;
        minute: number;
    };
    cronExpression?: string;
}
interface ScheduleWindow {
    start: Date;
    end: Date;
    allowedHours?: number[];
    excludedDates?: Date[];
    maxConcurrent?: number;
}
interface JobLock {
    key: string;
    ownerId: string;
    expiresAt: Date;
    metadata?: Record<string, any>;
}
interface ScheduleAnalytics {
    scheduleName: string;
    totalRuns: number;
    successfulRuns: number;
    failedRuns: number;
    averageDuration: number;
    lastRunAt?: Date;
    nextRunAt?: Date;
    reliability: number;
}
interface JobRecoveryStrategy {
    maxAttempts: number;
    backoffType: 'fixed' | 'exponential' | 'linear';
    initialDelay: number;
    maxDelay: number;
    shouldRecover?: (job: any, error: Error) => boolean;
}
interface DynamicSchedule {
    id: string;
    name: string;
    scheduleFunction: (context: any) => Date;
    enabled: boolean;
    context?: Record<string, any>;
}
/**
 * 1. Creates Sequelize model for persistent cron schedules.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {any} DataTypes - Sequelize DataTypes
 * @returns {any} CronSchedule model
 *
 * @example
 * ```typescript
 * const CronScheduleModel = createCronScheduleModel(sequelize, DataTypes);
 * const schedule = await CronScheduleModel.create({
 *   name: 'daily-patient-report',
 *   cronExpression: '0 8 * * *',
 *   timezone: 'America/New_York',
 *   enabled: true,
 *   jobData: { reportType: 'summary' }
 * });
 * ```
 */
export declare const createCronScheduleModel: (sequelize: any, DataTypes: any) => any;
/**
 * 2. Creates Sequelize model for job templates.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {any} DataTypes - Sequelize DataTypes
 * @returns {any} JobTemplate model
 *
 * @example
 * ```typescript
 * const JobTemplateModel = createJobTemplateModel(sequelize, DataTypes);
 * const template = await JobTemplateModel.create({
 *   name: 'patient-notification',
 *   description: 'Template for patient notifications',
 *   defaultData: { notificationType: 'email', priority: 'normal' },
 *   defaultOptions: { attempts: 3, backoff: 2000 }
 * });
 * ```
 */
export declare const createJobTemplateModel: (sequelize: any, DataTypes: any) => any;
/**
 * 3. Creates Sequelize model for job state machine tracking.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {any} DataTypes - Sequelize DataTypes
 * @returns {any} JobState model
 *
 * @example
 * ```typescript
 * const JobStateModel = createJobStateModel(sequelize, DataTypes);
 * await JobStateModel.create({
 *   jobId: 'job-123',
 *   currentState: 'processing',
 *   previousState: 'pending',
 *   transitions: [{ from: 'pending', to: 'processing', timestamp: new Date() }]
 * });
 * ```
 */
export declare const createJobStateModel: (sequelize: any, DataTypes: any) => any;
/**
 * 4. Creates Sequelize model for job chains/workflows.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {any} DataTypes - Sequelize DataTypes
 * @returns {any} JobChain model
 *
 * @example
 * ```typescript
 * const JobChainModel = createJobChainModel(sequelize, DataTypes);
 * const chain = await JobChainModel.create({
 *   name: 'patient-onboarding',
 *   steps: [
 *     { name: 'validate', queueName: 'validation', jobName: 'validate-patient' },
 *     { name: 'register', queueName: 'registration', jobName: 'register-patient' }
 *   ],
 *   status: 'pending'
 * });
 * ```
 */
export declare const createJobChainModel: (sequelize: any, DataTypes: any) => any;
/**
 * 5. Creates a cron schedule with validation and persistence.
 *
 * @param {any} cronScheduleModel - CronSchedule model
 * @param {CronSchedule} scheduleData - Schedule configuration
 * @returns {Promise<any>} Created schedule
 *
 * @example
 * ```typescript
 * const schedule = await createCronSchedule(CronScheduleModel, {
 *   name: 'daily-medication-reminder',
 *   cronExpression: '0 9 * * *',
 *   timezone: 'America/New_York',
 *   queueName: 'notifications',
 *   jobName: 'send-medication-reminder',
 *   jobData: { reminderType: 'medication' },
 *   enabled: true
 * });
 * ```
 */
export declare const createCronSchedule: (cronScheduleModel: any, scheduleData: Partial<CronSchedule> & {
    queueName: string;
    jobName: string;
}) => Promise<any>;
/**
 * 6. Calculates next run time for a cron expression.
 *
 * @param {string} cronExpression - Cron expression
 * @param {string} [timezone='UTC'] - Timezone
 * @returns {Date} Next run time
 *
 * @example
 * ```typescript
 * const nextRun = calculateNextRun('0 9 * * *', 'America/New_York');
 * console.log('Next appointment reminder:', nextRun);
 * // Output: Next appointment reminder: 2024-01-15T14:00:00.000Z
 * ```
 */
export declare const calculateNextRun: (cronExpression: string, timezone?: string) => Date;
/**
 * 7. Updates cron schedule and recalculates next run.
 *
 * @param {any} cronScheduleModel - CronSchedule model
 * @param {string} scheduleId - Schedule ID
 * @param {Partial<CronSchedule>} updates - Schedule updates
 * @returns {Promise<any>} Updated schedule
 *
 * @example
 * ```typescript
 * await updateCronSchedule(CronScheduleModel, 'schedule-123', {
 *   cronExpression: '0 10 * * *', // Change from 9 AM to 10 AM
 *   enabled: true
 * });
 * ```
 */
export declare const updateCronSchedule: (cronScheduleModel: any, scheduleId: string, updates: Partial<CronSchedule>) => Promise<any>;
/**
 * 8. Gets schedules due for execution.
 *
 * @param {any} cronScheduleModel - CronSchedule model
 * @param {Date} [currentTime=new Date()] - Current time
 * @returns {Promise<any[]>} Due schedules
 *
 * @example
 * ```typescript
 * const dueSchedules = await getDueSchedules(CronScheduleModel);
 * for (const schedule of dueSchedules) {
 *   await executeSchedule(schedule);
 * }
 * ```
 */
export declare const getDueSchedules: (cronScheduleModel: any, currentTime?: Date) => Promise<any[]>;
/**
 * 9. Creates a cron scheduler that executes schedules automatically.
 *
 * @param {any} cronScheduleModel - CronSchedule model
 * @param {Map<string, any>} queues - Queue instances
 * @param {number} [checkInterval=60000] - Check interval in ms
 * @returns {Object} Cron scheduler
 *
 * @example
 * ```typescript
 * const scheduler = createCronScheduler(
 *   CronScheduleModel,
 *   queueManager.getAllQueues(),
 *   30000 // Check every 30 seconds
 * );
 * scheduler.start();
 * // Scheduler automatically executes due cron jobs
 * ```
 */
export declare const createCronScheduler: (cronScheduleModel: any, queues: Map<string, any>, checkInterval?: number) => {
    start(): void;
    stop(): void;
    executeNow(scheduleId: string): Promise<void>;
    isRunning(): boolean;
};
/**
 * 10. Generates human-readable description from cron expression.
 *
 * @param {string} cronExpression - Cron expression
 * @returns {string} Human-readable description
 *
 * @example
 * ```typescript
 * const description = describeCronExpression('0 9 * * 1-5');
 * console.log(description);
 * // Output: "At 09:00 AM, Monday through Friday"
 * ```
 */
export declare const describeCronExpression: (cronExpression: string) => string;
/**
 * 11. Creates a reusable job template.
 *
 * @param {any} jobTemplateModel - JobTemplate model
 * @param {JobTemplate} templateData - Template configuration
 * @returns {Promise<any>} Created template
 *
 * @example
 * ```typescript
 * const template = await createJobTemplate(JobTemplateModel, {
 *   name: 'send-patient-email',
 *   description: 'Template for sending patient emails',
 *   queueName: 'notifications',
 *   jobName: 'send-email',
 *   defaultData: {
 *     from: 'noreply@whitecross.health',
 *     priority: 'normal'
 *   },
 *   defaultOptions: { attempts: 3, backoff: 2000 }
 * });
 * ```
 */
export declare const createJobTemplate: (jobTemplateModel: any, templateData: Omit<JobTemplate, "id"> & {
    queueName: string;
    jobName: string;
}) => Promise<any>;
/**
 * 12. Creates a job from a template with custom data.
 *
 * @param {any} jobTemplateModel - JobTemplate model
 * @param {any} queue - Bull queue instance
 * @param {string} templateName - Template name
 * @param {any} [customData={}] - Custom job data
 * @param {any} [customOptions={}] - Custom job options
 * @returns {Promise<any>} Created job
 *
 * @example
 * ```typescript
 * const job = await createJobFromTemplate(
 *   JobTemplateModel,
 *   emailQueue,
 *   'send-patient-email',
 *   {
 *     to: 'patient@example.com',
 *     subject: 'Appointment Reminder',
 *     body: 'Your appointment is tomorrow at 2 PM'
 *   }
 * );
 * ```
 */
export declare const createJobFromTemplate: (jobTemplateModel: any, queue: any, templateName: string, customData?: any, customOptions?: any) => Promise<any>;
/**
 * 13. Validates job data against template schema.
 *
 * @param {any} jobTemplateModel - JobTemplate model
 * @param {string} templateName - Template name
 * @param {any} data - Data to validate
 * @returns {Promise<{valid: boolean, errors?: string[]}>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateJobData(
 *   JobTemplateModel,
 *   'send-patient-email',
 *   { to: 'patient@example.com', subject: 'Test' }
 * );
 * if (!validation.valid) {
 *   console.error('Validation errors:', validation.errors);
 * }
 * ```
 */
export declare const validateJobData: (jobTemplateModel: any, templateName: string, data: any) => Promise<{
    valid: boolean;
    errors?: string[];
}>;
/**
 * 14. Bulk creates jobs from a template.
 *
 * @param {any} jobTemplateModel - JobTemplate model
 * @param {any} queue - Bull queue instance
 * @param {string} templateName - Template name
 * @param {any[]} dataArray - Array of job data
 * @returns {Promise<any[]>} Created jobs
 *
 * @example
 * ```typescript
 * const jobs = await bulkCreateJobsFromTemplate(
 *   JobTemplateModel,
 *   emailQueue,
 *   'send-patient-email',
 *   patients.map(p => ({
 *     to: p.email,
 *     subject: 'Health Check Reminder',
 *     body: `Hi ${p.name}, time for your annual check-up!`
 *   }))
 * );
 * console.log(`Created ${jobs.length} notification jobs`);
 * ```
 */
export declare const bulkCreateJobsFromTemplate: (jobTemplateModel: any, queue: any, templateName: string, dataArray: any[]) => Promise<any[]>;
/**
 * 15. Creates a state machine for job lifecycle management.
 *
 * @param {any} jobStateModel - JobState model
 * @param {Object} config - State machine configuration
 * @returns {Object} State machine
 *
 * @example
 * ```typescript
 * const stateMachine = createJobStateMachine(JobStateModel, {
 *   initialState: 'pending',
 *   states: ['pending', 'validating', 'processing', 'completed', 'failed'],
 *   transitions: {
 *     pending: ['validating'],
 *     validating: ['processing', 'failed'],
 *     processing: ['completed', 'failed']
 *   }
 * });
 * await stateMachine.transition('job-123', 'processing');
 * ```
 */
export declare const createJobStateMachine: (jobStateModel: any, config: {
    initialState: string;
    states: string[];
    transitions: Record<string, string[]>;
    onTransition?: (from: string, to: string, jobId: string) => Promise<void>;
}) => {
    initialize(jobId: string, queueName: string, initialData?: any): Promise<any>;
    transition(jobId: string, toState: string, data?: any): Promise<any>;
    getState(jobId: string): Promise<any>;
    canTransitionTo(jobId: string, toState: string): Promise<boolean>;
    getTransitionHistory(state: any): StateTransition[];
};
/**
 * 16. Monitors job state transitions and triggers actions.
 *
 * @param {any} jobStateModel - JobState model
 * @param {Record<string, Function>} stateHandlers - State-specific handlers
 * @param {number} [pollInterval=5000] - Polling interval in ms
 * @returns {Object} State monitor
 *
 * @example
 * ```typescript
 * const monitor = createJobStateMonitor(JobStateModel, {
 *   completed: async (jobId) => {
 *     console.log(`Job ${jobId} completed successfully`);
 *   },
 *   failed: async (jobId) => {
 *     await sendAlert(`Job ${jobId} failed`);
 *   }
 * }, 10000);
 * monitor.start();
 * ```
 */
export declare const createJobStateMonitor: (jobStateModel: any, stateHandlers: Record<string, (jobId: string, stateData: any) => Promise<void>>, pollInterval?: number) => {
    start(): void;
    stop(): void;
    isRunning(): boolean;
};
/**
 * 17. Creates a job chain/workflow with multiple steps.
 *
 * @param {any} jobChainModel - JobChain model
 * @param {string} name - Chain name
 * @param {ChainStep[]} steps - Chain steps
 * @param {any} [initialContext={}] - Initial context
 * @returns {Promise<any>} Created job chain
 *
 * @example
 * ```typescript
 * const chain = await createJobChain(JobChainModel, 'patient-admission', [
 *   {
 *     name: 'validate-patient',
 *     queueName: 'validation',
 *     jobName: 'validate',
 *     condition: (ctx) => ctx.patientId != null
 *   },
 *   {
 *     name: 'create-record',
 *     queueName: 'records',
 *     jobName: 'create',
 *     transform: (ctx) => ({ ...ctx, recordType: 'admission' })
 *   },
 *   {
 *     name: 'notify-staff',
 *     queueName: 'notifications',
 *     jobName: 'notify'
 *   }
 * ], { patientId: '123', departmentId: 'emergency' });
 * ```
 */
export declare const createJobChain: (jobChainModel: any, name: string, steps: ChainStep[], initialContext?: any) => Promise<any>;
/**
 * 18. Executes a job chain step by step.
 *
 * @param {any} jobChainModel - JobChain model
 * @param {Map<string, any>} queues - Queue instances
 * @param {string} chainId - Chain ID
 * @returns {Promise<any>} Chain execution result
 *
 * @example
 * ```typescript
 * const result = await executeJobChain(
 *   JobChainModel,
 *   queueManager.getAllQueues(),
 *   'chain-123'
 * );
 * console.log('Chain status:', result.status);
 * console.log('Results:', result.results);
 * ```
 */
export declare const executeJobChain: (jobChainModel: any, queues: Map<string, any>, chainId: string) => Promise<any>;
/**
 * 19. Pauses a running job chain.
 *
 * @param {any} jobChainModel - JobChain model
 * @param {string} chainId - Chain ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await pauseJobChain(JobChainModel, 'chain-123');
 * // Chain pauses after current step completes
 * ```
 */
export declare const pauseJobChain: (jobChainModel: any, chainId: string) => Promise<void>;
/**
 * 20. Resumes a paused job chain.
 *
 * @param {any} jobChainModel - JobChain model
 * @param {Map<string, any>} queues - Queue instances
 * @param {string} chainId - Chain ID
 * @returns {Promise<any>} Resumed chain
 *
 * @example
 * ```typescript
 * const chain = await resumeJobChain(
 *   JobChainModel,
 *   queueManager.getAllQueues(),
 *   'chain-123'
 * );
 * ```
 */
export declare const resumeJobChain: (jobChainModel: any, queues: Map<string, any>, chainId: string) => Promise<any>;
/**
 * 21. Creates a job recovery strategy with configurable retry logic.
 *
 * @param {JobRecoveryStrategy} strategy - Recovery configuration
 * @returns {Object} Recovery handler
 *
 * @example
 * ```typescript
 * const recovery = createJobRecoveryStrategy({
 *   maxAttempts: 5,
 *   backoffType: 'exponential',
 *   initialDelay: 1000,
 *   maxDelay: 60000,
 *   shouldRecover: (job, error) => error.name !== 'ValidationError'
 * });
 * const canRecover = recovery.canRecover(job, error, 2);
 * const delay = recovery.getDelay(3);
 * ```
 */
export declare const createJobRecoveryStrategy: (strategy: JobRecoveryStrategy) => {
    canRecover(job: any, error: Error, attemptNumber: number): boolean;
    getDelay(attemptNumber: number): number;
    recover(queue: any, job: any, error: Error, attemptNumber: number): Promise<any>;
};
/**
 * 22. Monitors failed jobs and automatically recovers them.
 *
 * @param {any} queue - Bull queue instance
 * @param {JobRecoveryStrategy} strategy - Recovery strategy
 * @param {any} [jobModel] - Sequelize Job model for tracking
 * @returns {Function} Cleanup function
 *
 * @example
 * ```typescript
 * const stopRecovery = monitorAndRecoverJobs(
 *   processingQueue,
 *   {
 *     maxAttempts: 3,
 *     backoffType: 'exponential',
 *     initialDelay: 2000,
 *     maxDelay: 30000
 *   },
 *   JobModel
 * );
 * // Failed jobs automatically retried with backoff
 * ```
 */
export declare const monitorAndRecoverJobs: (queue: any, strategy: JobRecoveryStrategy, jobModel?: any) => (() => void);
/**
 * 23. Recovers stalled jobs that stopped processing.
 *
 * @param {any} queue - Bull queue instance
 * @param {number} [stalledInterval=30000] - Check interval in ms
 * @returns {Object} Stalled job recovery
 *
 * @example
 * ```typescript
 * const stalledRecovery = recoverStalledJobs(processingQueue, 60000);
 * stalledRecovery.start();
 * // Checks for stalled jobs every minute and recovers them
 * ```
 */
export declare const recoverStalledJobs: (queue: any, stalledInterval?: number) => {
    start(): void;
    stop(): void;
    recoverNow(): Promise<void>;
    isRunning(): boolean;
};
/**
 * 24. Acquires a distributed lock for job execution.
 *
 * @param {any} redis - Redis client
 * @param {string} lockKey - Lock key
 * @param {number} [ttl=30000] - Lock TTL in ms
 * @param {string} [ownerId] - Lock owner ID
 * @returns {Promise<JobLock | null>} Lock if acquired, null otherwise
 *
 * @example
 * ```typescript
 * const lock = await acquireJobLock(
 *   redisClient,
 *   'job:patient-export:daily',
 *   60000,
 *   'worker-1'
 * );
 * if (lock) {
 *   try {
 *     await executeJob();
 *   } finally {
 *     await releaseJobLock(redisClient, lock);
 *   }
 * }
 * ```
 */
export declare const acquireJobLock: (redis: any, lockKey: string, ttl?: number, ownerId?: string) => Promise<JobLock | null>;
/**
 * 25. Releases a distributed lock.
 *
 * @param {any} redis - Redis client
 * @param {JobLock} lock - Lock to release
 * @returns {Promise<boolean>} True if released
 *
 * @example
 * ```typescript
 * const released = await releaseJobLock(redisClient, lock);
 * if (!released) {
 *   console.warn('Lock already expired or owned by another process');
 * }
 * ```
 */
export declare const releaseJobLock: (redis: any, lock: JobLock) => Promise<boolean>;
/**
 * 26. Extends a distributed lock TTL.
 *
 * @param {any} redis - Redis client
 * @param {JobLock} lock - Lock to extend
 * @param {number} additionalTtl - Additional TTL in ms
 * @returns {Promise<boolean>} True if extended
 *
 * @example
 * ```typescript
 * // Extend lock for another 30 seconds
 * const extended = await extendJobLock(redisClient, lock, 30000);
 * if (extended) {
 *   console.log('Lock extended, continuing job processing');
 * }
 * ```
 */
export declare const extendJobLock: (redis: any, lock: JobLock, additionalTtl: number) => Promise<boolean>;
/**
 * 27. Executes a job with automatic distributed locking.
 *
 * @param {any} redis - Redis client
 * @param {string} lockKey - Lock key
 * @param {Function} jobFunction - Job function to execute
 * @param {Object} [options] - Lock options
 * @returns {Promise<any>} Job result
 *
 * @example
 * ```typescript
 * const result = await executeWithLock(
 *   redisClient,
 *   'daily-report-generation',
 *   async () => {
 *     return await generateDailyReport();
 *   },
 *   { ttl: 300000, retryDelay: 5000, maxRetries: 3 }
 * );
 * ```
 */
export declare const executeWithLock: (redis: any, lockKey: string, jobFunction: () => Promise<any>, options?: {
    ttl?: number;
    retryDelay?: number;
    maxRetries?: number;
}) => Promise<any>;
/**
 * 28. Checks if a job with the same data already exists.
 *
 * @param {any} redis - Redis client
 * @param {string} queueName - Queue name
 * @param {any} jobData - Job data
 * @param {number} [window=3600000] - Deduplication window in ms
 * @returns {Promise<boolean>} True if duplicate exists
 *
 * @example
 * ```typescript
 * const isDuplicate = await isJobDuplicate(
 *   redisClient,
 *   'email-queue',
 *   { to: 'patient@example.com', subject: 'Reminder' },
 *   60000 // 1 minute window
 * );
 * if (!isDuplicate) {
 *   await queue.add('send-email', jobData);
 * }
 * ```
 */
export declare const isJobDuplicate: (redis: any, queueName: string, jobData: any, window?: number) => Promise<boolean>;
/**
 * 29. Marks a job as processed for deduplication.
 *
 * @param {any} redis - Redis client
 * @param {string} queueName - Queue name
 * @param {any} jobData - Job data
 * @param {number} [window=3600000] - Deduplication window in ms
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await markJobAsProcessed(
 *   redisClient,
 *   'email-queue',
 *   { to: 'patient@example.com', subject: 'Reminder' },
 *   60000
 * );
 * ```
 */
export declare const markJobAsProcessed: (redis: any, queueName: string, jobData: any, window?: number) => Promise<void>;
/**
 * 30. Adds a job with automatic deduplication.
 *
 * @param {any} queue - Bull queue instance
 * @param {any} redis - Redis client
 * @param {string} jobName - Job name
 * @param {any} jobData - Job data
 * @param {any} [options] - Job options
 * @param {number} [dedupWindow=3600000] - Deduplication window
 * @returns {Promise<any | null>} Job if added, null if duplicate
 *
 * @example
 * ```typescript
 * const job = await addJobWithDeduplication(
 *   emailQueue,
 *   redisClient,
 *   'send-reminder',
 *   { patientId: '123', type: 'appointment' },
 *   { priority: 5 },
 *   300000 // 5 minute dedup window
 * );
 * if (job) {
 *   console.log('Job added');
 * } else {
 *   console.log('Duplicate job skipped');
 * }
 * ```
 */
export declare const addJobWithDeduplication: (queue: any, redis: any, jobName: string, jobData: any, options?: any, dedupWindow?: number) => Promise<any | null>;
/**
 * 31. Creates a dynamic schedule that calculates next run time programmatically.
 *
 * @param {string} name - Schedule name
 * @param {Function} scheduleFunction - Function that returns next run time
 * @param {any} [context] - Schedule context
 * @returns {DynamicSchedule} Dynamic schedule
 *
 * @example
 * ```typescript
 * const dynamicSchedule = createDynamicSchedule(
 *   'business-hours-only',
 *   (ctx) => {
 *     const now = new Date();
 *     const nextRun = new Date(now);
 *     nextRun.setHours(9, 0, 0, 0);
 *     if (now.getHours() >= 9) {
 *       nextRun.setDate(nextRun.getDate() + 1);
 *     }
 *     // Skip weekends
 *     while (nextRun.getDay() === 0 || nextRun.getDay() === 6) {
 *       nextRun.setDate(nextRun.getDate() + 1);
 *     }
 *     return nextRun;
 *   }
 * );
 * ```
 */
export declare const createDynamicSchedule: (name: string, scheduleFunction: (context: any) => Date, context?: any) => DynamicSchedule;
/**
 * 32. Schedules a job using a dynamic schedule.
 *
 * @param {any} queue - Bull queue instance
 * @param {DynamicSchedule} schedule - Dynamic schedule
 * @param {string} jobName - Job name
 * @param {any} jobData - Job data
 * @returns {Promise<any>} Scheduled job
 *
 * @example
 * ```typescript
 * const job = await scheduleJobDynamically(
 *   reportQueue,
 *   businessHoursSchedule,
 *   'generate-report',
 *   { reportType: 'daily' }
 * );
 * console.log('Next run:', job.opts.delay);
 * ```
 */
export declare const scheduleJobDynamically: (queue: any, schedule: DynamicSchedule, jobName: string, jobData: any) => Promise<any>;
/**
 * 33. Creates a schedule window with allowed hours and excluded dates.
 *
 * @param {Date} start - Window start date
 * @param {Date} end - Window end date
 * @param {Object} [options] - Window options
 * @returns {ScheduleWindow} Schedule window
 *
 * @example
 * ```typescript
 * const window = createScheduleWindow(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31'),
 *   {
 *     allowedHours: [9, 10, 11, 14, 15, 16], // 9 AM - noon, 2 PM - 5 PM
 *     excludedDates: [
 *       new Date('2024-07-04'), // July 4th
 *       new Date('2024-12-25')  // Christmas
 *     ],
 *     maxConcurrent: 10
 *   }
 * );
 * ```
 */
export declare const createScheduleWindow: (start: Date, end: Date, options?: {
    allowedHours?: number[];
    excludedDates?: Date[];
    maxConcurrent?: number;
}) => ScheduleWindow;
/**
 * 34. Checks if a date/time is within a schedule window.
 *
 * @param {ScheduleWindow} window - Schedule window
 * @param {Date} date - Date to check
 * @returns {boolean} True if date is allowed
 *
 * @example
 * ```typescript
 * const isAllowed = isDateInScheduleWindow(businessHoursWindow, new Date());
 * if (isAllowed) {
 *   await scheduleJob();
 * } else {
 *   console.log('Outside business hours');
 * }
 * ```
 */
export declare const isDateInScheduleWindow: (window: ScheduleWindow, date: Date) => boolean;
/**
 * 35. Finds next available time within a schedule window.
 *
 * @param {ScheduleWindow} window - Schedule window
 * @param {Date} [fromDate=new Date()] - Starting date
 * @returns {Date | null} Next available time, or null if none found
 *
 * @example
 * ```typescript
 * const nextAvailable = findNextAvailableTime(businessHoursWindow);
 * if (nextAvailable) {
 *   await scheduleJob(queue, 'process', data, nextAvailable);
 * }
 * ```
 */
export declare const findNextAvailableTime: (window: ScheduleWindow, fromDate?: Date) => Date | null;
/**
 * 36. Collects analytics for a cron schedule.
 *
 * @param {any} cronScheduleModel - CronSchedule model
 * @param {any} jobResultModel - JobResult model
 * @param {string} scheduleName - Schedule name
 * @returns {Promise<ScheduleAnalytics>} Schedule analytics
 *
 * @example
 * ```typescript
 * const analytics = await getScheduleAnalytics(
 *   CronScheduleModel,
 *   JobResultModel,
 *   'daily-patient-report'
 * );
 * console.log(`Reliability: ${(analytics.reliability * 100).toFixed(1)}%`);
 * console.log(`Average duration: ${analytics.averageDuration}ms`);
 * ```
 */
export declare const getScheduleAnalytics: (cronScheduleModel: any, jobResultModel: any, scheduleName: string) => Promise<ScheduleAnalytics>;
/**
 * 37. Generates a schedule performance report.
 *
 * @param {any} cronScheduleModel - CronSchedule model
 * @param {any} jobResultModel - JobResult model
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {Promise<Object>} Performance report
 *
 * @example
 * ```typescript
 * const report = await generateSchedulePerformanceReport(
 *   CronScheduleModel,
 *   JobResultModel,
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31')
 * );
 * console.log('Total schedules:', report.totalSchedules);
 * console.log('Most reliable:', report.mostReliable);
 * console.log('Needs attention:', report.needsAttention);
 * ```
 */
export declare const generateSchedulePerformanceReport: (cronScheduleModel: any, jobResultModel: any, startDate: Date, endDate: Date) => Promise<{
    totalSchedules: number;
    activeSchedules: number;
    totalRuns: number;
    successRate: number;
    mostReliable: ScheduleAnalytics[];
    needsAttention: ScheduleAnalytics[];
}>;
/**
 * 38. Creates a cron expression from a recurring pattern.
 *
 * @param {RecurringPattern} pattern - Recurring pattern
 * @returns {string} Cron expression
 *
 * @example
 * ```typescript
 * const cronExpr = createCronFromPattern({
 *   type: 'weekly',
 *   daysOfWeek: [1, 3, 5], // Mon, Wed, Fri
 *   timeOfDay: { hour: 9, minute: 0 }
 * });
 * console.log(cronExpr); // "0 9 * * 1,3,5"
 * ```
 */
export declare const createCronFromPattern: (pattern: RecurringPattern) => string;
/**
 * 39. Creates a schedule from a recurring pattern.
 *
 * @param {any} cronScheduleModel - CronSchedule model
 * @param {string} name - Schedule name
 * @param {RecurringPattern} pattern - Recurring pattern
 * @param {Object} jobConfig - Job configuration
 * @returns {Promise<any>} Created schedule
 *
 * @example
 * ```typescript
 * const schedule = await createScheduleFromPattern(
 *   CronScheduleModel,
 *   'weekly-medication-check',
 *   {
 *     type: 'weekly',
 *     daysOfWeek: [1, 3, 5],
 *     timeOfDay: { hour: 14, minute: 30 }
 *   },
 *   {
 *     queueName: 'health-checks',
 *     jobName: 'medication-check',
 *     jobData: { checkType: 'medication' }
 *   }
 * );
 * ```
 */
export declare const createScheduleFromPattern: (cronScheduleModel: any, name: string, pattern: RecurringPattern, jobConfig: {
    queueName: string;
    jobName: string;
    jobData?: any;
    jobOptions?: any;
}) => Promise<any>;
/**
 * 40. Creates a concurrency limiter for job execution.
 *
 * @param {any} redis - Redis client
 * @param {string} resourceId - Resource identifier
 * @param {number} maxConcurrent - Maximum concurrent jobs
 * @returns {Object} Concurrency limiter
 *
 * @example
 * ```typescript
 * const limiter = createConcurrencyLimiter(
 *   redisClient,
 *   'heavy-processing',
 *   5
 * );
 * const slot = await limiter.acquire();
 * if (slot) {
 *   try {
 *     await processJob();
 *   } finally {
 *     await limiter.release(slot);
 *   }
 * }
 * ```
 */
export declare const createConcurrencyLimiter: (redis: any, resourceId: string, maxConcurrent: number) => {
    acquire(timeout?: number): Promise<string | null>;
    release(slotId: string): Promise<void>;
    getCurrentCount(): Promise<number>;
    getRemainingSlots(): Promise<number>;
    waitForSlot(timeout?: number): Promise<string>;
};
/**
 * 41. Executes a job with concurrency limiting.
 *
 * @param {any} redis - Redis client
 * @param {string} resourceId - Resource identifier
 * @param {number} maxConcurrent - Maximum concurrent executions
 * @param {Function} jobFunction - Job function
 * @param {number} [timeout] - Acquisition timeout
 * @returns {Promise<any>} Job result
 *
 * @example
 * ```typescript
 * const result = await executeWithConcurrencyLimit(
 *   redisClient,
 *   'api-calls',
 *   10,
 *   async () => {
 *     return await callExternalAPI();
 *   },
 *   30000
 * );
 * ```
 */
export declare const executeWithConcurrencyLimit: (redis: any, resourceId: string, maxConcurrent: number, jobFunction: () => Promise<any>, timeout?: number) => Promise<any>;
/**
 * 42. Schedules multiple jobs at optimized intervals.
 *
 * @param {any} queue - Bull queue instance
 * @param {Array} jobs - Jobs to schedule
 * @param {Object} options - Scheduling options
 * @returns {Promise<any[]>} Scheduled jobs
 *
 * @example
 * ```typescript
 * const jobs = await scheduleBatchWithOptimization(
 *   processingQueue,
 *   patientRecords.map(record => ({
 *     name: 'process-record',
 *     data: record
 *   })),
 *   {
 *     spreadInterval: 60000, // Spread over 1 minute
 *     maxConcurrent: 10,
 *     priorityFunction: (job) => job.data.urgent ? 100 : 50
 *   }
 * );
 * ```
 */
export declare const scheduleBatchWithOptimization: (queue: any, jobs: Array<{
    name: string;
    data: any;
    options?: any;
}>, options?: {
    spreadInterval?: number;
    maxConcurrent?: number;
    priorityFunction?: (job: any) => number;
}) => Promise<any[]>;
/**
 * 43. Creates a job scheduler with adaptive timing.
 *
 * @param {any} queue - Bull queue instance
 * @param {Object} options - Scheduler options
 * @returns {Object} Adaptive scheduler
 *
 * @example
 * ```typescript
 * const scheduler = createAdaptiveJobScheduler(processingQueue, {
 *   minDelay: 1000,
 *   maxDelay: 60000,
 *   loadThreshold: 0.8
 * });
 *
 * scheduler.onLoad(async () => {
 *   const metrics = await queue.getMetrics();
 *   return metrics.active / metrics.concurrency;
 * });
 *
 * await scheduler.schedule('process', data);
 * ```
 */
export declare const createAdaptiveJobScheduler: (queue: any, options?: {
    minDelay?: number;
    maxDelay?: number;
    loadThreshold?: number;
}) => {
    onLoad(fn: () => Promise<number>): void;
    schedule(jobName: string, data: any, options?: any): Promise<any>;
    getCurrentDelay(): Promise<number>;
};
/**
 * 44. Optimizes job scheduling based on historical performance.
 *
 * @param {any} jobResultModel - JobResult model
 * @param {string} queueName - Queue name
 * @param {number} [lookbackDays=7] - Days to analyze
 * @returns {Promise<Object>} Optimization recommendations
 *
 * @example
 * ```typescript
 * const recommendations = await optimizeScheduleBasedOnHistory(
 *   JobResultModel,
 *   'processing-queue',
 *   14
 * );
 * console.log('Recommended concurrency:', recommendations.optimalConcurrency);
 * console.log('Best time windows:', recommendations.bestTimeWindows);
 * ```
 */
export declare const optimizeScheduleBasedOnHistory: (jobResultModel: any, queueName: string, lookbackDays?: number) => Promise<{
    optimalConcurrency: number;
    averageDuration: number;
    peakHours: number[];
    bestTimeWindows: Array<{
        start: number;
        end: number;
    }>;
    successRate: number;
}>;
/**
 * 45. Creates a self-optimizing job scheduler.
 *
 * @param {any} queue - Bull queue instance
 * @param {any} jobResultModel - JobResult model
 * @param {Object} options - Optimization options
 * @returns {Object} Self-optimizing scheduler
 *
 * @example
 * ```typescript
 * const scheduler = createSelfOptimizingScheduler(
 *   processingQueue,
 *   JobResultModel,
 *   {
 *     optimizationInterval: 3600000, // Optimize every hour
 *     lookbackDays: 7,
 *     autoAdjustConcurrency: true
 *   }
 * );
 * scheduler.start();
 * // Scheduler automatically adjusts based on performance
 * ```
 */
export declare const createSelfOptimizingScheduler: (queue: any, jobResultModel: any, options?: {
    optimizationInterval?: number;
    lookbackDays?: number;
    autoAdjustConcurrency?: boolean;
}) => {
    start(): void;
    stop(): void;
    optimizeNow(): Promise<void>;
    getRecommendations(): any;
    isRunning(): boolean;
};
export {};
//# sourceMappingURL=background-jobs-scheduling-kit.d.ts.map