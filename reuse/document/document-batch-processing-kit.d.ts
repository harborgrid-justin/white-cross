/**
 * LOC: DOC-BATCH-001
 * File: /reuse/document/document-batch-processing-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/bull
 *   - bull
 *   - sequelize (v6.x)
 *   - p-limit
 *   - p-queue
 *   - async
 *
 * DOWNSTREAM (imported by):
 *   - Document batch controllers
 *   - Bulk document processing services
 *   - Job queue management modules
 *   - Document migration services
 */
/**
 * File: /reuse/document/document-batch-processing-kit.ts
 * Locator: WC-UTL-DOCBATCH-001
 * Purpose: High-Performance Batch Processing Kit - Bulk operations, job queues, parallel processing, progress tracking
 *
 * Upstream: @nestjs/common, @nestjs/bull, bull, sequelize, p-limit, p-queue, async
 * Downstream: Batch controllers, bulk processing services, job queues, migration modules
 * Dependencies: NestJS 10.x, Bull 4.x, Sequelize 6.x, TypeScript 5.x, p-limit 4.x
 * Exports: 40 utility functions for batch jobs, parallel execution, progress tracking, error recovery, scheduling, optimization
 *
 * LLM Context: Production-grade batch processing utilities for White Cross healthcare platform.
 * Provides job queue management, parallel document processing, progress tracking, automatic retry logic,
 * error recovery mechanisms, advanced job scheduling, performance optimization, resource management,
 * throttling controls, and comprehensive monitoring. Essential for bulk document operations, data migrations,
 * mass document transformations, scheduled report generation, and high-volume healthcare record processing.
 */
import { Sequelize } from 'sequelize';
import { EventEmitter } from 'events';
/**
 * Batch job status
 */
export type BatchJobStatus = 'pending' | 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'paused';
/**
 * Batch task status
 */
export type BatchTaskStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'skipped' | 'retrying';
/**
 * Job priority levels
 */
export type JobPriority = 'low' | 'normal' | 'high' | 'critical';
/**
 * Retry strategy types
 */
export type RetryStrategy = 'exponential' | 'linear' | 'fixed' | 'fibonacci';
/**
 * Batch job configuration
 */
export interface BatchJobConfig {
    name: string;
    batchSize: number;
    concurrency?: number;
    priority?: JobPriority;
    timeout?: number;
    retryAttempts?: number;
    retryStrategy?: RetryStrategy;
    retryDelay?: number;
    trackProgress?: boolean;
    autoStart?: boolean;
    metadata?: Record<string, any>;
    onProgress?: (progress: BatchProgress) => void;
    onTaskComplete?: (taskId: string, result: any) => void;
    onTaskError?: (taskId: string, error: Error) => void;
}
/**
 * Batch task configuration
 */
export interface BatchTaskConfig {
    jobId: string;
    documentId: string;
    operation: string;
    parameters?: Record<string, any>;
    priority?: JobPriority;
    timeout?: number;
    dependencies?: string[];
    retryAttempts?: number;
    metadata?: Record<string, any>;
}
/**
 * Batch progress information
 */
export interface BatchProgress {
    jobId: string;
    totalTasks: number;
    completedTasks: number;
    failedTasks: number;
    skippedTasks: number;
    processingTasks: number;
    pendingTasks: number;
    percentComplete: number;
    startedAt?: Date;
    estimatedCompletion?: Date;
    averageTaskDuration?: number;
    throughput?: number;
}
/**
 * Batch execution result
 */
export interface BatchExecutionResult {
    jobId: string;
    status: BatchJobStatus;
    totalTasks: number;
    successCount: number;
    failureCount: number;
    skippedCount: number;
    duration: number;
    results: Array<{
        taskId: string;
        documentId: string;
        status: BatchTaskStatus;
        result?: any;
        error?: string;
        duration?: number;
    }>;
    errors?: Array<{
        taskId: string;
        error: string;
        stack?: string;
    }>;
    metadata?: Record<string, any>;
}
/**
 * Queue options for Bull
 */
export interface QueueOptions {
    redis?: {
        host: string;
        port: number;
        password?: string;
        db?: number;
    };
    limiter?: {
        max: number;
        duration: number;
    };
    defaultJobOptions?: {
        attempts?: number;
        backoff?: number | {
            type: string;
            delay: number;
        };
        removeOnComplete?: boolean;
        removeOnFail?: boolean;
    };
}
/**
 * Job scheduling options
 */
export interface JobScheduleOptions {
    cron?: string;
    every?: number;
    startDate?: Date;
    endDate?: Date;
    repeat?: {
        cron?: string;
        every?: number;
        limit?: number;
    };
    timezone?: string;
}
/**
 * Parallel execution configuration
 */
export interface ParallelExecutionConfig {
    concurrency: number;
    maxRetries?: number;
    timeout?: number;
    continueOnError?: boolean;
    resourceLimits?: {
        maxMemory?: number;
        maxCpu?: number;
    };
    throttle?: {
        maxPerSecond?: number;
        maxConcurrent?: number;
    };
}
/**
 * Error recovery configuration
 */
export interface ErrorRecoveryConfig {
    maxRetries: number;
    retryStrategy: RetryStrategy;
    retryDelay: number;
    backoffMultiplier?: number;
    maxRetryDelay?: number;
    deadLetterQueue?: boolean;
    onRetryExhausted?: (task: any, error: Error) => void;
    onRecoverySuccess?: (task: any) => void;
}
/**
 * Performance metrics
 */
export interface PerformanceMetrics {
    jobId: string;
    totalDuration: number;
    averageTaskDuration: number;
    minTaskDuration: number;
    maxTaskDuration: number;
    throughput: number;
    tasksPerSecond: number;
    memoryUsage: {
        heapUsed: number;
        heapTotal: number;
        external: number;
    };
    cpuUsage: {
        user: number;
        system: number;
    };
    queueMetrics?: {
        waiting: number;
        active: number;
        completed: number;
        failed: number;
        delayed: number;
    };
}
/**
 * Resource limits
 */
export interface ResourceLimits {
    maxMemoryMB: number;
    maxConcurrentJobs: number;
    maxTasksPerJob: number;
    maxRetries: number;
    taskTimeout: number;
    jobTimeout: number;
}
/**
 * Batch job filter criteria
 */
export interface BatchJobFilter {
    status?: BatchJobStatus[];
    priority?: JobPriority[];
    createdAfter?: Date;
    createdBefore?: Date;
    completedAfter?: Date;
    completedBefore?: Date;
    name?: string;
    metadata?: Record<string, any>;
}
/**
 * Checkpoint data for resumable jobs
 */
export interface CheckpointData {
    jobId: string;
    lastCompletedTaskIndex: number;
    completedTaskIds: string[];
    state: Record<string, any>;
    timestamp: Date;
}
/**
 * Batch job model attributes
 */
export interface BatchJobAttributes {
    id: string;
    name: string;
    status: BatchJobStatus;
    priority: JobPriority;
    totalTasks: number;
    completedTasks: number;
    failedTasks: number;
    skippedTasks: number;
    batchSize: number;
    concurrency: number;
    retryAttempts: number;
    retryStrategy: RetryStrategy;
    retryDelay: number;
    timeout?: number;
    startedAt?: Date;
    completedAt?: Date;
    estimatedCompletion?: Date;
    duration?: number;
    errorMessage?: string;
    errorStack?: string;
    metadata?: Record<string, any>;
    checkpointData?: Record<string, any>;
    createdBy?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Batch task model attributes
 */
export interface BatchTaskAttributes {
    id: string;
    jobId: string;
    documentId: string;
    operation: string;
    status: BatchTaskStatus;
    priority: JobPriority;
    parameters?: Record<string, any>;
    result?: Record<string, any>;
    errorMessage?: string;
    errorStack?: string;
    retryCount: number;
    maxRetries: number;
    timeout?: number;
    startedAt?: Date;
    completedAt?: Date;
    duration?: number;
    dependencies?: string[];
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Batch result model attributes
 */
export interface BatchResultAttributes {
    id: string;
    jobId: string;
    taskId?: string;
    documentId?: string;
    resultType: string;
    resultData: Record<string, any>;
    status: string;
    processingTime: number;
    memoryUsage?: number;
    metadata?: Record<string, any>;
    createdAt: Date;
}
/**
 * Creates BatchJob model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<BatchJobAttributes>>} BatchJob model
 *
 * @example
 * ```typescript
 * const BatchJobModel = createBatchJobModel(sequelize);
 * const job = await BatchJobModel.create({
 *   name: 'PDF Conversion Batch',
 *   status: 'pending',
 *   priority: 'high',
 *   totalTasks: 100,
 *   batchSize: 10,
 *   concurrency: 5
 * });
 * ```
 */
export declare const createBatchJobModel: (sequelize: Sequelize) => any;
/**
 * Creates BatchTask model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<BatchTaskAttributes>>} BatchTask model
 *
 * @example
 * ```typescript
 * const BatchTaskModel = createBatchTaskModel(sequelize);
 * const task = await BatchTaskModel.create({
 *   jobId: 'job-uuid',
 *   documentId: 'doc-uuid',
 *   operation: 'convert_to_pdf',
 *   status: 'pending',
 *   priority: 'normal',
 *   maxRetries: 3
 * });
 * ```
 */
export declare const createBatchTaskModel: (sequelize: Sequelize) => any;
/**
 * Creates BatchResult model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<BatchResultAttributes>>} BatchResult model
 *
 * @example
 * ```typescript
 * const BatchResultModel = createBatchResultModel(sequelize);
 * const result = await BatchResultModel.create({
 *   jobId: 'job-uuid',
 *   taskId: 'task-uuid',
 *   documentId: 'doc-uuid',
 *   resultType: 'conversion',
 *   resultData: { outputPath: '/path/to/output.pdf' },
 *   status: 'success',
 *   processingTime: 1500
 * });
 * ```
 */
export declare const createBatchResultModel: (sequelize: Sequelize) => any;
/**
 * 1. Creates a new batch job.
 *
 * @param {BatchJobConfig} config - Batch job configuration
 * @returns {Promise<string>} Job ID
 *
 * @example
 * ```typescript
 * const jobId = await createBatchJob({
 *   name: 'Convert 1000 Documents to PDF',
 *   batchSize: 50,
 *   concurrency: 10,
 *   priority: 'high',
 *   retryAttempts: 3,
 *   metadata: { category: 'medical-records' }
 * });
 * ```
 */
export declare const createBatchJob: (config: BatchJobConfig) => Promise<string>;
/**
 * 2. Adds tasks to a batch job.
 *
 * @param {string} jobId - Batch job ID
 * @param {BatchTaskConfig[]} tasks - Tasks to add
 * @returns {Promise<string[]>} Task IDs
 *
 * @example
 * ```typescript
 * const taskIds = await addTasksToJob('job-123', [
 *   { jobId: 'job-123', documentId: 'doc-1', operation: 'convert_pdf' },
 *   { jobId: 'job-123', documentId: 'doc-2', operation: 'convert_pdf' },
 * ]);
 * ```
 */
export declare const addTasksToJob: (jobId: string, tasks: BatchTaskConfig[]) => Promise<string[]>;
/**
 * 3. Queues a batch job for execution.
 *
 * @param {string} jobId - Job ID to queue
 * @param {QueueOptions} [options] - Queue options
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await queueBatchJob('job-123', {
 *   redis: { host: 'localhost', port: 6379 },
 *   limiter: { max: 100, duration: 1000 }
 * });
 * ```
 */
export declare const queueBatchJob: (jobId: string, options?: QueueOptions) => Promise<void>;
/**
 * 4. Retrieves batch job status and progress.
 *
 * @param {string} jobId - Job ID
 * @returns {Promise<BatchProgress>} Progress information
 *
 * @example
 * ```typescript
 * const progress = await getBatchJobProgress('job-123');
 * console.log(`${progress.percentComplete}% complete`);
 * console.log(`ETA: ${progress.estimatedCompletion}`);
 * ```
 */
export declare const getBatchJobProgress: (jobId: string) => Promise<BatchProgress>;
/**
 * 5. Pauses a running batch job.
 *
 * @param {string} jobId - Job ID to pause
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await pauseBatchJob('job-123');
 * console.log('Job paused. Resume with resumeBatchJob()');
 * ```
 */
export declare const pauseBatchJob: (jobId: string) => Promise<void>;
/**
 * 6. Resumes a paused batch job.
 *
 * @param {string} jobId - Job ID to resume
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await resumeBatchJob('job-123');
 * console.log('Job resumed');
 * ```
 */
export declare const resumeBatchJob: (jobId: string) => Promise<void>;
/**
 * 7. Cancels a batch job.
 *
 * @param {string} jobId - Job ID to cancel
 * @param {boolean} [graceful] - Wait for current tasks to complete
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await cancelBatchJob('job-123', true);
 * console.log('Job cancelled gracefully');
 * ```
 */
export declare const cancelBatchJob: (jobId: string, graceful?: boolean) => Promise<void>;
/**
 * 8. Removes completed batch jobs older than specified days.
 *
 * @param {number} days - Age threshold in days
 * @returns {Promise<number>} Number of jobs removed
 *
 * @example
 * ```typescript
 * const removed = await cleanupOldJobs(30);
 * console.log(`Removed ${removed} jobs older than 30 days`);
 * ```
 */
export declare const cleanupOldJobs: (days: number) => Promise<number>;
/**
 * 9. Executes tasks in parallel with concurrency control.
 *
 * @param {string} jobId - Job ID
 * @param {ParallelExecutionConfig} config - Parallel execution configuration
 * @returns {Promise<BatchExecutionResult>} Execution result
 *
 * @example
 * ```typescript
 * const result = await executeTasksParallel('job-123', {
 *   concurrency: 10,
 *   maxRetries: 3,
 *   timeout: 30000,
 *   continueOnError: true
 * });
 * console.log(`Success: ${result.successCount}, Failed: ${result.failureCount}`);
 * ```
 */
export declare const executeTasksParallel: (jobId: string, config: ParallelExecutionConfig) => Promise<BatchExecutionResult>;
/**
 * 10. Executes tasks in batches sequentially.
 *
 * @param {string} jobId - Job ID
 * @param {number} batchSize - Size of each batch
 * @returns {Promise<BatchExecutionResult>} Execution result
 *
 * @example
 * ```typescript
 * const result = await executeTasksInBatches('job-123', 50);
 * console.log(`Processed ${result.totalTasks} tasks in batches of 50`);
 * ```
 */
export declare const executeTasksInBatches: (jobId: string, batchSize: number) => Promise<BatchExecutionResult>;
/**
 * 11. Executes tasks with priority-based ordering.
 *
 * @param {string} jobId - Job ID
 * @param {number} concurrency - Concurrent execution limit
 * @returns {Promise<BatchExecutionResult>} Execution result
 *
 * @example
 * ```typescript
 * const result = await executeTasksByPriority('job-123', 5);
 * // Critical and high priority tasks execute first
 * ```
 */
export declare const executeTasksByPriority: (jobId: string, concurrency: number) => Promise<BatchExecutionResult>;
/**
 * 12. Executes tasks with dependency resolution.
 *
 * @param {string} jobId - Job ID
 * @returns {Promise<BatchExecutionResult>} Execution result
 *
 * @example
 * ```typescript
 * const result = await executeTasksWithDependencies('job-123');
 * // Tasks execute only after their dependencies complete
 * ```
 */
export declare const executeTasksWithDependencies: (jobId: string) => Promise<BatchExecutionResult>;
/**
 * 13. Throttles task execution to limit resource usage.
 *
 * @param {string} jobId - Job ID
 * @param {number} maxPerSecond - Maximum tasks per second
 * @param {number} maxConcurrent - Maximum concurrent tasks
 * @returns {Promise<BatchExecutionResult>} Execution result
 *
 * @example
 * ```typescript
 * const result = await throttleTaskExecution('job-123', 10, 5);
 * // Max 10 tasks/second, max 5 concurrent
 * ```
 */
export declare const throttleTaskExecution: (jobId: string, maxPerSecond: number, maxConcurrent: number) => Promise<BatchExecutionResult>;
/**
 * 14. Executes tasks with timeout enforcement.
 *
 * @param {string} jobId - Job ID
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<BatchExecutionResult>} Execution result
 *
 * @example
 * ```typescript
 * const result = await executeTasksWithTimeout('job-123', 30000);
 * // Tasks timeout after 30 seconds
 * ```
 */
export declare const executeTasksWithTimeout: (jobId: string, timeout: number) => Promise<BatchExecutionResult>;
/**
 * 15. Executes tasks with streaming results.
 *
 * @param {string} jobId - Job ID
 * @param {(result: any) => void} onResult - Result callback
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await executeTasksStreaming('job-123', (result) => {
 *   console.log('Task completed:', result.taskId);
 *   // Process result immediately
 * });
 * ```
 */
export declare const executeTasksStreaming: (jobId: string, onResult: (result: any) => void) => Promise<void>;
/**
 * 16. Tracks real-time job progress.
 *
 * @param {string} jobId - Job ID
 * @param {(progress: BatchProgress) => void} callback - Progress callback
 * @returns {EventEmitter} Progress event emitter
 *
 * @example
 * ```typescript
 * const tracker = trackJobProgress('job-123', (progress) => {
 *   console.log(`Progress: ${progress.percentComplete}%`);
 * });
 * tracker.on('complete', () => console.log('Done!'));
 * ```
 */
export declare const trackJobProgress: (jobId: string, callback: (progress: BatchProgress) => void) => EventEmitter;
/**
 * 17. Calculates job completion ETA.
 *
 * @param {string} jobId - Job ID
 * @returns {Promise<Date | null>} Estimated completion time
 *
 * @example
 * ```typescript
 * const eta = await calculateJobETA('job-123');
 * console.log(`Expected completion: ${eta}`);
 * ```
 */
export declare const calculateJobETA: (jobId: string) => Promise<Date | null>;
/**
 * 18. Retrieves detailed task progress.
 *
 * @param {string} taskId - Task ID
 * @returns {Promise<{ status: BatchTaskStatus; progress: number; duration?: number }>} Task progress
 *
 * @example
 * ```typescript
 * const taskProgress = await getTaskProgress('task-123');
 * console.log(`Task status: ${taskProgress.status}`);
 * ```
 */
export declare const getTaskProgress: (taskId: string) => Promise<{
    status: BatchTaskStatus;
    progress: number;
    duration?: number;
}>;
/**
 * 19. Generates progress report for job.
 *
 * @param {string} jobId - Job ID
 * @returns {Promise<string>} Progress report (JSON)
 *
 * @example
 * ```typescript
 * const report = await generateProgressReport('job-123');
 * console.log(report);
 * ```
 */
export declare const generateProgressReport: (jobId: string) => Promise<string>;
/**
 * 20. Updates job progress checkpoint.
 *
 * @param {string} jobId - Job ID
 * @param {CheckpointData} checkpoint - Checkpoint data
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateJobCheckpoint('job-123', {
 *   jobId: 'job-123',
 *   lastCompletedTaskIndex: 50,
 *   completedTaskIds: ['task-1', 'task-2'],
 *   state: { processedBytes: 1024000 },
 *   timestamp: new Date()
 * });
 * ```
 */
export declare const updateJobCheckpoint: (jobId: string, checkpoint: CheckpointData) => Promise<void>;
/**
 * 21. Retrieves job performance metrics.
 *
 * @param {string} jobId - Job ID
 * @returns {Promise<PerformanceMetrics>} Performance metrics
 *
 * @example
 * ```typescript
 * const metrics = await getJobPerformanceMetrics('job-123');
 * console.log(`Throughput: ${metrics.tasksPerSecond} tasks/sec`);
 * ```
 */
export declare const getJobPerformanceMetrics: (jobId: string) => Promise<PerformanceMetrics>;
/**
 * 22. Exports job progress to external format.
 *
 * @param {string} jobId - Job ID
 * @param {string} format - Export format (json, csv)
 * @returns {Promise<string>} Exported data
 *
 * @example
 * ```typescript
 * const csv = await exportJobProgress('job-123', 'csv');
 * await fs.writeFile('progress.csv', csv);
 * ```
 */
export declare const exportJobProgress: (jobId: string, format: string) => Promise<string>;
/**
 * 23. Retries failed tasks with backoff strategy.
 *
 * @param {string} jobId - Job ID
 * @param {ErrorRecoveryConfig} config - Recovery configuration
 * @returns {Promise<number>} Number of tasks retried
 *
 * @example
 * ```typescript
 * const retried = await retryFailedTasks('job-123', {
 *   maxRetries: 3,
 *   retryStrategy: 'exponential',
 *   retryDelay: 1000,
 *   backoffMultiplier: 2
 * });
 * console.log(`Retried ${retried} failed tasks`);
 * ```
 */
export declare const retryFailedTasks: (jobId: string, config: ErrorRecoveryConfig) => Promise<number>;
/**
 * 24. Implements circuit breaker for failing operations.
 *
 * @param {string} operation - Operation name
 * @param {number} threshold - Failure threshold
 * @param {number} timeout - Circuit open duration (ms)
 * @returns {{ execute: (fn: Function) => Promise<any>; getState: () => string }} Circuit breaker
 *
 * @example
 * ```typescript
 * const breaker = createCircuitBreaker('pdf-conversion', 5, 60000);
 * try {
 *   await breaker.execute(() => convertPDF(document));
 * } catch (error) {
 *   console.log('Circuit open:', breaker.getState());
 * }
 * ```
 */
export declare const createCircuitBreaker: (operation: string, threshold: number, timeout: number) => {
    execute: (fn: Function) => Promise<any>;
    getState: () => string;
};
/**
 * 25. Handles dead letter queue for permanently failed tasks.
 *
 * @param {string} jobId - Job ID
 * @returns {Promise<Array<{ taskId: string; error: string }>>} Dead letter tasks
 *
 * @example
 * ```typescript
 * const deadLetterTasks = await handleDeadLetterQueue('job-123');
 * // Review and manually process these tasks
 * ```
 */
export declare const handleDeadLetterQueue: (jobId: string) => Promise<Array<{
    taskId: string;
    error: string;
}>>;
/**
 * 26. Implements fallback strategy for failed operations.
 *
 * @param {Function} primaryFn - Primary operation
 * @param {Function} fallbackFn - Fallback operation
 * @returns {Promise<any>} Operation result
 *
 * @example
 * ```typescript
 * const result = await executeFallback(
 *   () => convertWithPrimaryService(doc),
 *   () => convertWithBackupService(doc)
 * );
 * ```
 */
export declare const executeFallback: (primaryFn: Function, fallbackFn: Function) => Promise<any>;
/**
 * 27. Recovers job from checkpoint.
 *
 * @param {string} jobId - Job ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await recoverJobFromCheckpoint('job-123');
 * // Resumes job from last successful checkpoint
 * ```
 */
export declare const recoverJobFromCheckpoint: (jobId: string) => Promise<void>;
/**
 * 28. Implements graceful degradation for overloaded systems.
 *
 * @param {string} jobId - Job ID
 * @param {number} currentLoad - Current system load (0-1)
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await degradeGracefully('job-123', 0.85);
 * // Reduces concurrency and batch size under high load
 * ```
 */
export declare const degradeGracefully: (jobId: string, currentLoad: number) => Promise<void>;
/**
 * 29. Generates error recovery report.
 *
 * @param {string} jobId - Job ID
 * @returns {Promise<string>} Recovery report (JSON)
 *
 * @example
 * ```typescript
 * const report = await generateErrorRecoveryReport('job-123');
 * console.log(report);
 * ```
 */
export declare const generateErrorRecoveryReport: (jobId: string) => Promise<string>;
/**
 * 30. Schedules recurring batch job.
 *
 * @param {BatchJobConfig} jobConfig - Job configuration
 * @param {JobScheduleOptions} scheduleOptions - Schedule options
 * @returns {Promise<string>} Schedule ID
 *
 * @example
 * ```typescript
 * const scheduleId = await scheduleRecurringJob(
 *   { name: 'Daily Report Generation', batchSize: 100, concurrency: 5 },
 *   { cron: '0 2 * * *', timezone: 'America/New_York' }
 * );
 * // Runs daily at 2 AM EST
 * ```
 */
export declare const scheduleRecurringJob: (jobConfig: BatchJobConfig, scheduleOptions: JobScheduleOptions) => Promise<string>;
/**
 * 31. Schedules one-time batch job.
 *
 * @param {BatchJobConfig} jobConfig - Job configuration
 * @param {Date} scheduledTime - Execution time
 * @returns {Promise<string>} Job ID
 *
 * @example
 * ```typescript
 * const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
 * const jobId = await scheduleOneTimeJob(jobConfig, tomorrow);
 * ```
 */
export declare const scheduleOneTimeJob: (jobConfig: BatchJobConfig, scheduledTime: Date) => Promise<string>;
/**
 * 32. Retrieves scheduled jobs.
 *
 * @param {BatchJobFilter} [filter] - Filter criteria
 * @returns {Promise<Array<{ jobId: string; name: string; nextRun: Date }>>} Scheduled jobs
 *
 * @example
 * ```typescript
 * const scheduled = await getScheduledJobs({ status: ['pending', 'queued'] });
 * ```
 */
export declare const getScheduledJobs: (filter?: BatchJobFilter) => Promise<Array<{
    jobId: string;
    name: string;
    nextRun: Date;
}>>;
/**
 * 33. Cancels scheduled job.
 *
 * @param {string} scheduleId - Schedule ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await cancelScheduledJob('schedule-123');
 * ```
 */
export declare const cancelScheduledJob: (scheduleId: string) => Promise<void>;
/**
 * 34. Updates job schedule.
 *
 * @param {string} scheduleId - Schedule ID
 * @param {JobScheduleOptions} newSchedule - New schedule options
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateJobSchedule('schedule-123', { cron: '0 3 * * *' });
 * // Changed from 2 AM to 3 AM
 * ```
 */
export declare const updateJobSchedule: (scheduleId: string, newSchedule: JobScheduleOptions) => Promise<void>;
/**
 * 35. Validates cron schedule expression.
 *
 * @param {string} cronExpression - Cron expression
 * @returns {{ valid: boolean; nextRun?: Date; error?: string }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateCronSchedule('0 2 * * *');
 * if (validation.valid) {
 *   console.log('Next run:', validation.nextRun);
 * }
 * ```
 */
export declare const validateCronSchedule: (cronExpression: string) => {
    valid: boolean;
    nextRun?: Date;
    error?: string;
};
/**
 * 36. Optimizes batch size based on performance metrics.
 *
 * @param {string} jobId - Job ID
 * @returns {Promise<number>} Optimized batch size
 *
 * @example
 * ```typescript
 * const optimalSize = await optimizeBatchSize('job-123');
 * console.log(`Optimal batch size: ${optimalSize}`);
 * ```
 */
export declare const optimizeBatchSize: (jobId: string) => Promise<number>;
/**
 * 37. Implements resource pooling for batch operations.
 *
 * @param {number} poolSize - Pool size
 * @param {Function} resourceFactory - Resource factory function
 * @returns {{ acquire: () => Promise<any>; release: (resource: any) => void }} Resource pool
 *
 * @example
 * ```typescript
 * const dbPool = createResourcePool(10, () => createDatabaseConnection());
 * const conn = await dbPool.acquire();
 * // Use connection
 * dbPool.release(conn);
 * ```
 */
export declare const createResourcePool: (poolSize: number, resourceFactory: Function) => {
    acquire: () => Promise<any>;
    release: (resource: any) => void;
};
/**
 * 38. Implements memory-efficient streaming batch processing.
 *
 * @param {string} jobId - Job ID
 * @param {number} chunkSize - Processing chunk size
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await streamBatchProcessing('job-123', 10);
 * // Processes in small chunks to minimize memory usage
 * ```
 */
export declare const streamBatchProcessing: (jobId: string, chunkSize: number) => Promise<void>;
/**
 * 39. Monitors and adjusts concurrency dynamically.
 *
 * @param {string} jobId - Job ID
 * @param {ResourceLimits} limits - Resource limits
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await adjustConcurrencyDynamically('job-123', {
 *   maxMemoryMB: 512,
 *   maxConcurrentJobs: 10,
 *   maxTasksPerJob: 1000,
 *   maxRetries: 3,
 *   taskTimeout: 30000,
 *   jobTimeout: 3600000
 * });
 * ```
 */
export declare const adjustConcurrencyDynamically: (jobId: string, limits: ResourceLimits) => Promise<void>;
/**
 * 40. Implements intelligent task prefetching.
 *
 * @param {string} jobId - Job ID
 * @param {number} prefetchCount - Number of tasks to prefetch
 * @returns {Promise<any[]>} Prefetched tasks
 *
 * @example
 * ```typescript
 * const tasks = await prefetchTasks('job-123', 20);
 * // Prefetch next 20 tasks for faster processing
 * ```
 */
export declare const prefetchTasks: (jobId: string, prefetchCount: number) => Promise<any[]>;
declare const _default: {
    createBatchJobModel: (sequelize: Sequelize) => any;
    createBatchTaskModel: (sequelize: Sequelize) => any;
    createBatchResultModel: (sequelize: Sequelize) => any;
    createBatchJob: (config: BatchJobConfig) => Promise<string>;
    addTasksToJob: (jobId: string, tasks: BatchTaskConfig[]) => Promise<string[]>;
    queueBatchJob: (jobId: string, options?: QueueOptions) => Promise<void>;
    getBatchJobProgress: (jobId: string) => Promise<BatchProgress>;
    pauseBatchJob: (jobId: string) => Promise<void>;
    resumeBatchJob: (jobId: string) => Promise<void>;
    cancelBatchJob: (jobId: string, graceful?: boolean) => Promise<void>;
    cleanupOldJobs: (days: number) => Promise<number>;
    executeTasksParallel: (jobId: string, config: ParallelExecutionConfig) => Promise<BatchExecutionResult>;
    executeTasksInBatches: (jobId: string, batchSize: number) => Promise<BatchExecutionResult>;
    executeTasksByPriority: (jobId: string, concurrency: number) => Promise<BatchExecutionResult>;
    executeTasksWithDependencies: (jobId: string) => Promise<BatchExecutionResult>;
    throttleTaskExecution: (jobId: string, maxPerSecond: number, maxConcurrent: number) => Promise<BatchExecutionResult>;
    executeTasksWithTimeout: (jobId: string, timeout: number) => Promise<BatchExecutionResult>;
    executeTasksStreaming: (jobId: string, onResult: (result: any) => void) => Promise<void>;
    trackJobProgress: (jobId: string, callback: (progress: BatchProgress) => void) => EventEmitter;
    calculateJobETA: (jobId: string) => Promise<Date | null>;
    getTaskProgress: (taskId: string) => Promise<{
        status: BatchTaskStatus;
        progress: number;
        duration?: number;
    }>;
    generateProgressReport: (jobId: string) => Promise<string>;
    updateJobCheckpoint: (jobId: string, checkpoint: CheckpointData) => Promise<void>;
    getJobPerformanceMetrics: (jobId: string) => Promise<PerformanceMetrics>;
    exportJobProgress: (jobId: string, format: string) => Promise<string>;
    retryFailedTasks: (jobId: string, config: ErrorRecoveryConfig) => Promise<number>;
    createCircuitBreaker: (operation: string, threshold: number, timeout: number) => {
        execute: (fn: Function) => Promise<any>;
        getState: () => string;
    };
    handleDeadLetterQueue: (jobId: string) => Promise<Array<{
        taskId: string;
        error: string;
    }>>;
    executeFallback: (primaryFn: Function, fallbackFn: Function) => Promise<any>;
    recoverJobFromCheckpoint: (jobId: string) => Promise<void>;
    degradeGracefully: (jobId: string, currentLoad: number) => Promise<void>;
    generateErrorRecoveryReport: (jobId: string) => Promise<string>;
    scheduleRecurringJob: (jobConfig: BatchJobConfig, scheduleOptions: JobScheduleOptions) => Promise<string>;
    scheduleOneTimeJob: (jobConfig: BatchJobConfig, scheduledTime: Date) => Promise<string>;
    getScheduledJobs: (filter?: BatchJobFilter) => Promise<Array<{
        jobId: string;
        name: string;
        nextRun: Date;
    }>>;
    cancelScheduledJob: (scheduleId: string) => Promise<void>;
    updateJobSchedule: (scheduleId: string, newSchedule: JobScheduleOptions) => Promise<void>;
    validateCronSchedule: (cronExpression: string) => {
        valid: boolean;
        nextRun?: Date;
        error?: string;
    };
    optimizeBatchSize: (jobId: string) => Promise<number>;
    createResourcePool: (poolSize: number, resourceFactory: Function) => {
        acquire: () => Promise<any>;
        release: (resource: any) => void;
    };
    streamBatchProcessing: (jobId: string, chunkSize: number) => Promise<void>;
    adjustConcurrencyDynamically: (jobId: string, limits: ResourceLimits) => Promise<void>;
    prefetchTasks: (jobId: string, prefetchCount: number) => Promise<any[]>;
};
export default _default;
//# sourceMappingURL=document-batch-processing-kit.d.ts.map