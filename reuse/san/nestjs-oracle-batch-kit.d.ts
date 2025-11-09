/**
 * LOC: B7A8T9C0H1
 * File: /reuse/san/nestjs-oracle-batch-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v11.1.8)
 *   - @nestjs/bull (v10.2.1)
 *   - @nestjs/schedule (v4.1.1)
 *   - bull (v4.12.9)
 *   - node-cron (v3.0.3)
 *   - rxjs (v7.8.1)
 *
 * DOWNSTREAM (imported by):
 *   - Batch job services and schedulers
 *   - Bulk data processing modules
 *   - Report generation services
 *   - ETL (Extract, Transform, Load) pipelines
 */
/**
 * File: /reuse/san/nestjs-oracle-batch-kit.ts
 * Locator: WC-UTL-BATCH-001
 * Purpose: NestJS Oracle-Style Batch Processing Kit - Enterprise batch job execution and management
 *
 * Upstream: @nestjs/common, @nestjs/bull, @nestjs/schedule, bull, node-cron, rxjs
 * Downstream: Batch services, report generators, ETL pipelines, bulk processors, scheduled tasks
 * Dependencies: NestJS v11.x, Node 18+, TypeScript 5.x, Bull Queue, Redis, Node-cron
 * Exports: 47 batch processing functions for job scheduling, execution, chaining, parallel processing, chunking, recovery, transactions, monitoring
 *
 * LLM Context: Production-grade NestJS batch processing toolkit for White Cross healthcare platform.
 * Provides comprehensive utilities for batch job configuration, scheduling (cron and interval-based),
 * execution management, job chaining with dependencies, parallel batch processing, chunk-based data
 * processing, job restart and recovery mechanisms, batch transaction management, job monitoring and
 * reporting, and conditional job execution. HIPAA-compliant with comprehensive audit logging, secure
 * batch processing of PHI, transaction integrity, and healthcare-specific batch patterns for claims
 * processing, report generation, and bulk patient data operations.
 */
import { Logger } from '@nestjs/common';
import { JobOptions } from 'bull';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronCommand } from 'cron';
import { Observable, Subject } from 'rxjs';
/**
 * Batch job status enumeration
 */
export declare enum BatchJobStatus {
    PENDING = "pending",
    SCHEDULED = "scheduled",
    RUNNING = "running",
    PAUSED = "paused",
    COMPLETED = "completed",
    FAILED = "failed",
    CANCELLED = "cancelled",
    RESTARTING = "restarting"
}
/**
 * Batch job priority levels
 */
export declare enum BatchJobPriority {
    CRITICAL = 1,
    HIGH = 2,
    NORMAL = 3,
    LOW = 4,
    BACKGROUND = 5
}
/**
 * Batch job configuration interface
 */
export interface BatchJobConfig {
    jobId: string;
    name: string;
    description?: string;
    priority?: BatchJobPriority;
    maxRetries?: number;
    retryDelay?: number;
    timeout?: number;
    concurrency?: number;
    removeOnComplete?: boolean | number;
    removeOnFail?: boolean | number;
    metadata?: Record<string, any>;
}
/**
 * Batch job scheduling configuration
 */
export interface BatchScheduleConfig {
    cronExpression?: string;
    intervalMs?: number;
    startDate?: Date;
    endDate?: Date;
    timezone?: string;
    runImmediately?: boolean;
    maxExecutions?: number;
}
/**
 * Batch job execution context
 */
export interface BatchJobContext<T = any> {
    jobId: string;
    attemptNumber: number;
    data: T;
    metadata: Record<string, any>;
    startTime: Date;
    userId?: string;
    tenantId?: string;
    correlationId?: string;
}
/**
 * Batch job result
 */
export interface BatchJobResult<T = any> {
    jobId: string;
    status: BatchJobStatus;
    data?: T;
    error?: string;
    startTime: Date;
    endTime: Date;
    duration: number;
    processedItems?: number;
    failedItems?: number;
    metadata?: Record<string, any>;
}
/**
 * Job dependency configuration
 */
export interface JobDependency {
    jobId: string;
    requiresCompletion: boolean;
    failureStrategy?: 'abort' | 'continue' | 'retry';
    timeout?: number;
}
/**
 * Job chain configuration
 */
export interface JobChainConfig {
    chainId: string;
    name: string;
    jobs: Array<{
        jobId: string;
        config: BatchJobConfig;
        dependencies?: string[];
    }>;
    onChainComplete?: (results: BatchJobResult[]) => void | Promise<void>;
    onChainFail?: (error: Error, results: BatchJobResult[]) => void | Promise<void>;
}
/**
 * Parallel batch processing options
 */
export interface ParallelBatchOptions {
    concurrency: number;
    batchSize?: number;
    maxRetries?: number;
    retryDelay?: number;
    failFast?: boolean;
    onProgress?: (processed: number, total: number) => void;
}
/**
 * Chunk processing configuration
 */
export interface ChunkProcessingConfig<T = any> {
    chunkSize: number;
    totalItems?: number;
    dataSource: AsyncIterable<T> | T[];
    processor: (chunk: T[]) => Promise<any>;
    onChunkComplete?: (chunkIndex: number, result: any) => void;
    onChunkError?: (chunkIndex: number, error: Error) => void;
}
/**
 * Job recovery checkpoint
 */
export interface JobRecoveryCheckpoint {
    jobId: string;
    checkpointId: string;
    timestamp: Date;
    processedCount: number;
    lastProcessedId?: string;
    metadata?: Record<string, any>;
}
/**
 * Batch transaction context
 */
export interface BatchTransactionContext {
    transactionId: string;
    jobId: string;
    operations: Array<{
        type: string;
        data: any;
        status: 'pending' | 'committed' | 'rolled_back';
    }>;
    isolationLevel?: 'READ_UNCOMMITTED' | 'READ_COMMITTED' | 'REPEATABLE_READ' | 'SERIALIZABLE';
}
/**
 * Job monitoring metrics
 */
export interface JobMonitoringMetrics {
    jobId: string;
    status: BatchJobStatus;
    startTime?: Date;
    endTime?: Date;
    duration?: number;
    itemsProcessed: number;
    itemsFailed: number;
    throughput?: number;
    memoryUsage?: number;
    cpuUsage?: number;
    errorRate?: number;
}
/**
 * Conditional execution rule
 */
export interface ConditionalExecutionRule {
    condition: (context: BatchJobContext) => boolean | Promise<boolean>;
    action: 'execute' | 'skip' | 'defer';
    deferDuration?: number;
    metadata?: Record<string, any>;
}
/**
 * Creates a batch job configuration with enterprise defaults.
 *
 * @param {string} jobId - Unique job identifier
 * @param {string} name - Job name
 * @param {Partial<BatchJobConfig>} options - Additional job options
 * @returns {BatchJobConfig} Complete batch job configuration
 *
 * @example
 * ```typescript
 * const jobConfig = createBatchJobConfig(
 *   'claims-processing-001',
 *   'Daily Claims Processing',
 *   {
 *     priority: BatchJobPriority.HIGH,
 *     maxRetries: 3,
 *     timeout: 3600000
 *   }
 * );
 * ```
 */
export declare function createBatchJobConfig(jobId: string, name: string, options?: Partial<BatchJobConfig>): BatchJobConfig;
/**
 * Converts batch job config to Bull queue options.
 *
 * @param {BatchJobConfig} config - Batch job configuration
 * @returns {JobOptions} Bull queue job options
 *
 * @example
 * ```typescript
 * const jobConfig = createBatchJobConfig('job-001', 'Export Data');
 * const bullOptions = batchConfigToBullOptions(jobConfig);
 * await queue.add('export', data, bullOptions);
 * ```
 */
export declare function batchConfigToBullOptions(config: BatchJobConfig): JobOptions;
/**
 * Validates batch job configuration for enterprise requirements.
 *
 * @param {BatchJobConfig} config - Batch job configuration to validate
 * @throws {BadRequestException} If configuration is invalid
 *
 * @example
 * ```typescript
 * const config = createBatchJobConfig('job-001', 'Process Data');
 * validateBatchJobConfig(config);
 * // Throws if invalid
 * ```
 */
export declare function validateBatchJobConfig(config: BatchJobConfig): void;
/**
 * Merges batch job configurations with override support.
 *
 * @param {BatchJobConfig} base - Base configuration
 * @param {Partial<BatchJobConfig>} override - Override configuration
 * @returns {BatchJobConfig} Merged configuration
 *
 * @example
 * ```typescript
 * const baseConfig = createBatchJobConfig('job-001', 'Base Job');
 * const customConfig = mergeBatchJobConfig(baseConfig, {
 *   priority: BatchJobPriority.CRITICAL,
 *   timeout: 7200000
 * });
 * ```
 */
export declare function mergeBatchJobConfig(base: BatchJobConfig, override: Partial<BatchJobConfig>): BatchJobConfig;
/**
 * Creates batch job context from job data.
 *
 * @template T - Job data type
 * @param {string} jobId - Job identifier
 * @param {T} data - Job data
 * @param {number} attemptNumber - Current attempt number
 * @param {Record<string, any>} metadata - Additional metadata
 * @returns {BatchJobContext<T>} Job execution context
 *
 * @example
 * ```typescript
 * const context = createBatchJobContext(
 *   'claims-001',
 *   { claimIds: ['c1', 'c2', 'c3'] },
 *   1,
 *   { userId: 'user-123', tenantId: 'tenant-abc' }
 * );
 * ```
 */
export declare function createBatchJobContext<T = any>(jobId: string, data: T, attemptNumber?: number, metadata?: Record<string, any>): BatchJobContext<T>;
/**
 * Creates a cron-based batch job schedule.
 *
 * @param {string} cronExpression - Cron expression (e.g., '0 2 * * *' for 2 AM daily)
 * @param {Partial<BatchScheduleConfig>} options - Additional scheduling options
 * @returns {BatchScheduleConfig} Schedule configuration
 *
 * @example
 * ```typescript
 * // Daily at 2 AM
 * const schedule = createCronSchedule('0 2 * * *', {
 *   timezone: 'America/New_York',
 *   startDate: new Date('2025-01-01')
 * });
 * ```
 */
export declare function createCronSchedule(cronExpression: string, options?: Partial<BatchScheduleConfig>): BatchScheduleConfig;
/**
 * Creates an interval-based batch job schedule.
 *
 * @param {number} intervalMs - Interval in milliseconds
 * @param {Partial<BatchScheduleConfig>} options - Additional scheduling options
 * @returns {BatchScheduleConfig} Schedule configuration
 *
 * @example
 * ```typescript
 * // Every 30 minutes
 * const schedule = createIntervalSchedule(30 * 60 * 1000, {
 *   runImmediately: true,
 *   maxExecutions: 100
 * });
 * ```
 */
export declare function createIntervalSchedule(intervalMs: number, options?: Partial<BatchScheduleConfig>): BatchScheduleConfig;
/**
 * Validates cron expression format.
 *
 * @param {string} cronExpression - Cron expression to validate
 * @returns {boolean} True if valid
 *
 * @example
 * ```typescript
 * const isValid = validateCronExpression('0 2 * * *'); // true
 * const isInvalid = validateCronExpression('invalid'); // false
 * ```
 */
export declare function validateCronExpression(cronExpression: string): boolean;
/**
 * Registers a scheduled batch job with NestJS scheduler.
 *
 * @param {SchedulerRegistry} scheduler - NestJS scheduler registry
 * @param {string} jobName - Unique job name
 * @param {BatchScheduleConfig} schedule - Schedule configuration
 * @param {CronCommand} callback - Job execution callback
 *
 * @example
 * ```typescript
 * @Injectable()
 * class BatchService {
 *   constructor(private scheduler: SchedulerRegistry) {}
 *
 *   onModuleInit() {
 *     const schedule = createCronSchedule('0 2 * * *');
 *     registerScheduledJob(
 *       this.scheduler,
 *       'daily-report',
 *       schedule,
 *       () => this.generateDailyReport()
 *     );
 *   }
 * }
 * ```
 */
export declare function registerScheduledJob(scheduler: SchedulerRegistry, jobName: string, schedule: BatchScheduleConfig, callback: CronCommand): void;
/**
 * Unregisters a scheduled batch job.
 *
 * @param {SchedulerRegistry} scheduler - NestJS scheduler registry
 * @param {string} jobName - Job name to unregister
 * @param {boolean} isCron - Whether it's a cron job or interval
 *
 * @example
 * ```typescript
 * unregisterScheduledJob(this.scheduler, 'daily-report', true);
 * ```
 */
export declare function unregisterScheduledJob(scheduler: SchedulerRegistry, jobName: string, isCron?: boolean): void;
/**
 * Calculates next execution time for a schedule.
 *
 * @param {BatchScheduleConfig} schedule - Schedule configuration
 * @returns {Date | null} Next execution date or null
 *
 * @example
 * ```typescript
 * const schedule = createCronSchedule('0 2 * * *');
 * const nextRun = getNextExecutionTime(schedule);
 * console.log(`Next execution: ${nextRun}`);
 * ```
 */
export declare function getNextExecutionTime(schedule: BatchScheduleConfig): Date | null;
/**
 * Creates a one-time delayed job execution.
 *
 * @param {number} delayMs - Delay in milliseconds
 * @param {() => void | Promise<void>} callback - Callback to execute
 * @returns {NodeJS.Timeout} Timeout handle
 *
 * @example
 * ```typescript
 * const timeout = scheduleDelayedJob(
 *   60000,
 *   async () => await this.processData()
 * );
 * ```
 */
export declare function scheduleDelayedJob(delayMs: number, callback: () => void | Promise<void>): NodeJS.Timeout;
/**
 * Executes a batch job with comprehensive error handling and logging.
 *
 * @template T - Job data type
 * @template R - Job result type
 * @param {BatchJobContext<T>} context - Job execution context
 * @param {(ctx: BatchJobContext<T>) => Promise<R>} processor - Job processor function
 * @param {Logger} logger - Logger instance
 * @returns {Promise<BatchJobResult<R>>} Job execution result
 *
 * @example
 * ```typescript
 * const context = createBatchJobContext('job-001', { patientIds: [...] });
 * const result = await executeBatchJob(
 *   context,
 *   async (ctx) => await processPatients(ctx.data.patientIds),
 *   logger
 * );
 * ```
 */
export declare function executeBatchJob<T = any, R = any>(context: BatchJobContext<T>, processor: (ctx: BatchJobContext<T>) => Promise<R>, logger: Logger): Promise<BatchJobResult<R>>;
/**
 * Wraps batch job processor with retry logic.
 *
 * @template T - Job data type
 * @param {(data: T) => Promise<any>} processor - Job processor function
 * @param {number} maxRetries - Maximum retry attempts
 * @param {number} retryDelay - Delay between retries in ms
 * @returns {(data: T) => Promise<any>} Wrapped processor with retry
 *
 * @example
 * ```typescript
 * const reliableProcessor = withRetry(
 *   async (data) => await externalApi.process(data),
 *   3,
 *   5000
 * );
 * ```
 */
export declare function withRetry<T = any>(processor: (data: T) => Promise<any>, maxRetries?: number, retryDelay?: number): (data: T) => Promise<any>;
/**
 * Wraps batch job processor with timeout enforcement.
 *
 * @template T - Job data type
 * @param {(data: T) => Promise<any>} processor - Job processor function
 * @param {number} timeoutMs - Timeout in milliseconds
 * @returns {(data: T) => Promise<any>} Wrapped processor with timeout
 *
 * @example
 * ```typescript
 * const timedProcessor = withTimeout(
 *   async (data) => await longRunningOperation(data),
 *   300000 // 5 minutes
 * );
 * ```
 */
export declare function withTimeout<T = any>(processor: (data: T) => Promise<any>, timeoutMs: number): (data: T) => Promise<any>;
/**
 * Executes batch job with progress tracking.
 *
 * @template T - Job data type
 * @param {T[]} items - Items to process
 * @param {(item: T, index: number) => Promise<void>} processor - Item processor
 * @param {(processed: number, total: number) => void} onProgress - Progress callback
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await executeBatchJobWithProgress(
 *   patients,
 *   async (patient, index) => await processPatient(patient),
 *   (processed, total) => console.log(`${processed}/${total} patients processed`)
 * );
 * ```
 */
export declare function executeBatchJobWithProgress<T = any>(items: T[], processor: (item: T, index: number) => Promise<void>, onProgress?: (processed: number, total: number) => void): Promise<void>;
/**
 * Creates a pausable batch job executor.
 *
 * @returns {object} Pausable executor with control methods
 *
 * @example
 * ```typescript
 * const executor = createPausableBatchExecutor();
 * executor.start(items, async (item) => await process(item));
 * // Later...
 * executor.pause();
 * // Resume
 * executor.resume();
 * ```
 */
export declare function createPausableBatchExecutor<T = any>(): {
    start(items: T[], processor: (item: T, index: number) => Promise<void>, onProgress?: (processed: number, total: number) => void): Promise<void>;
    pause(): void;
    resume(): void;
    stop(): void;
    isPaused(): boolean;
    isStopped(): boolean;
};
/**
 * Executes batch job with rate limiting.
 *
 * @template T - Job data type
 * @param {T[]} items - Items to process
 * @param {(item: T) => Promise<void>} processor - Item processor
 * @param {number} maxPerSecond - Maximum items per second
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await executeBatchJobWithRateLimit(
 *   apiCalls,
 *   async (call) => await makeApiCall(call),
 *   10 // Max 10 calls per second
 * );
 * ```
 */
export declare function executeBatchJobWithRateLimit<T = any>(items: T[], processor: (item: T) => Promise<void>, maxPerSecond: number): Promise<void>;
/**
 * Creates a job chain with dependencies.
 *
 * @param {string} chainId - Unique chain identifier
 * @param {string} name - Chain name
 * @param {Array} jobs - Array of job configurations
 * @returns {JobChainConfig} Job chain configuration
 *
 * @example
 * ```typescript
 * const chain = createJobChain('monthly-report', 'Monthly Reports', [
 *   { jobId: 'extract', config: extractConfig },
 *   { jobId: 'transform', config: transformConfig, dependencies: ['extract'] },
 *   { jobId: 'load', config: loadConfig, dependencies: ['transform'] }
 * ]);
 * ```
 */
export declare function createJobChain(chainId: string, name: string, jobs: Array<{
    jobId: string;
    config: BatchJobConfig;
    dependencies?: string[];
}>): JobChainConfig;
/**
 * Validates job chain for circular dependencies.
 *
 * @param {JobChainConfig} chain - Job chain configuration
 * @throws {BadRequestException} If circular dependencies detected
 *
 * @example
 * ```typescript
 * const chain = createJobChain('chain-001', 'Data Pipeline', [...]);
 * validateJobChain(chain);
 * ```
 */
export declare function validateJobChain(chain: JobChainConfig): void;
/**
 * Executes a job chain in dependency order.
 *
 * @param {JobChainConfig} chain - Job chain configuration
 * @param {Map<string, (ctx: BatchJobContext) => Promise<any>>} processors - Job processors map
 * @param {Logger} logger - Logger instance
 * @returns {Promise<Map<string, BatchJobResult>>} Results by job ID
 *
 * @example
 * ```typescript
 * const processors = new Map([
 *   ['extract', async (ctx) => await extractData()],
 *   ['transform', async (ctx) => await transformData()],
 *   ['load', async (ctx) => await loadData()]
 * ]);
 * const results = await executeJobChain(chain, processors, logger);
 * ```
 */
export declare function executeJobChain(chain: JobChainConfig, processors: Map<string, (ctx: BatchJobContext) => Promise<any>>, logger: Logger): Promise<Map<string, BatchJobResult>>;
/**
 * Creates a job dependency graph visualization.
 *
 * @param {JobChainConfig} chain - Job chain configuration
 * @returns {string} Dependency graph as text
 *
 * @example
 * ```typescript
 * const graph = visualizeJobDependencies(chain);
 * console.log(graph);
 * // Output:
 * // extract
 * // └─> transform
 * //     └─> load
 * ```
 */
export declare function visualizeJobDependencies(chain: JobChainConfig): string;
/**
 * Waits for job dependencies to complete.
 *
 * @param {string[]} dependencyJobIds - Array of job IDs to wait for
 * @param {(jobId: string) => Promise<BatchJobStatus>} statusChecker - Function to check job status
 * @param {number} timeoutMs - Timeout in milliseconds
 * @returns {Promise<void>}
 * @throws {Error} If dependencies fail or timeout
 *
 * @example
 * ```typescript
 * await waitForDependencies(
 *   ['job-001', 'job-002'],
 *   async (jobId) => await checkJobStatus(jobId),
 *   300000
 * );
 * ```
 */
export declare function waitForDependencies(dependencyJobIds: string[], statusChecker: (jobId: string) => Promise<BatchJobStatus>, timeoutMs?: number): Promise<void>;
/**
 * Processes items in parallel batches with concurrency control.
 *
 * @template T - Item type
 * @template R - Result type
 * @param {T[]} items - Items to process
 * @param {(item: T) => Promise<R>} processor - Item processor function
 * @param {ParallelBatchOptions} options - Parallel processing options
 * @returns {Promise<R[]>} Array of results
 *
 * @example
 * ```typescript
 * const results = await processInParallelBatches(
 *   patients,
 *   async (patient) => await validatePatient(patient),
 *   { concurrency: 5, batchSize: 100 }
 * );
 * ```
 */
export declare function processInParallelBatches<T = any, R = any>(items: T[], processor: (item: T) => Promise<R>, options: ParallelBatchOptions): Promise<R[]>;
/**
 * Creates a parallel batch processor using RxJS streams.
 *
 * @template T - Item type
 * @template R - Result type
 * @param {number} concurrency - Number of concurrent operations
 * @returns {(items: T[], processor: (item: T) => Promise<R>) => Observable<R>} Stream processor
 *
 * @example
 * ```typescript
 * const parallelProcessor = createParallelBatchProcessor<Patient, ValidationResult>(5);
 * parallelProcessor(patients, validatePatient).subscribe({
 *   next: (result) => console.log('Processed:', result),
 *   complete: () => console.log('All done')
 * });
 * ```
 */
export declare function createParallelBatchProcessor<T = any, R = any>(concurrency: number): (items: T[], processor: (item: T) => Promise<R>) => Observable<R>;
/**
 * Distributes work across multiple workers.
 *
 * @template T - Work item type
 * @param {T[]} workItems - Items to distribute
 * @param {number} workerCount - Number of workers
 * @returns {T[][]} Array of work batches per worker
 *
 * @example
 * ```typescript
 * const batches = distributeWorkload(claims, 4);
 * const workers = batches.map((batch, idx) =>
 *   createWorker(`worker-${idx}`, batch)
 * );
 * ```
 */
export declare function distributeWorkload<T = any>(workItems: T[], workerCount: number): T[][];
/**
 * Executes batch processing with dynamic concurrency adjustment.
 *
 * @template T - Item type
 * @param {T[]} items - Items to process
 * @param {(item: T) => Promise<any>} processor - Item processor
 * @param {object} options - Processing options
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await executeDynamicParallelBatch(
 *   largeDataset,
 *   processItem,
 *   {
 *     initialConcurrency: 5,
 *     maxConcurrency: 20,
 *     adjustmentThreshold: 0.8 // Adjust if CPU usage > 80%
 *   }
 * );
 * ```
 */
export declare function executeDynamicParallelBatch<T = any>(items: T[], processor: (item: T) => Promise<any>, options: {
    initialConcurrency: number;
    maxConcurrency: number;
    adjustmentThreshold?: number;
}): Promise<void>;
/**
 * Processes items in parallel with result streaming.
 *
 * @template T - Item type
 * @template R - Result type
 * @param {T[]} items - Items to process
 * @param {(item: T) => Promise<R>} processor - Item processor
 * @param {number} concurrency - Concurrent operations
 * @returns {AsyncGenerator<R>} Async generator of results
 *
 * @example
 * ```typescript
 * for await (const result of streamParallelBatchResults(items, processItem, 10)) {
 *   console.log('Result:', result);
 *   await saveResult(result);
 * }
 * ```
 */
export declare function streamParallelBatchResults<T = any, R = any>(items: T[], processor: (item: T) => Promise<R>, concurrency: number): AsyncGenerator<R>;
/**
 * Processes data in fixed-size chunks.
 *
 * @template T - Data type
 * @param {ChunkProcessingConfig<T>} config - Chunk processing configuration
 * @returns {Promise<any[]>} Array of chunk results
 *
 * @example
 * ```typescript
 * const results = await processInChunks({
 *   chunkSize: 1000,
 *   dataSource: await getAllPatients(),
 *   processor: async (chunk) => await bulkUpdatePatients(chunk),
 *   onChunkComplete: (idx, result) => console.log(`Chunk ${idx} done`)
 * });
 * ```
 */
export declare function processInChunks<T = any>(config: ChunkProcessingConfig<T>): Promise<any[]>;
/**
 * Creates a chunk iterator for streaming processing.
 *
 * @template T - Data type
 * @param {T[]} data - Data array
 * @param {number} chunkSize - Size of each chunk
 * @returns {Generator<T[]>} Generator yielding chunks
 *
 * @example
 * ```typescript
 * const chunks = createChunkIterator(patients, 500);
 * for (const chunk of chunks) {
 *   await processChunk(chunk);
 * }
 * ```
 */
export declare function createChunkIterator<T = any>(data: T[], chunkSize: number): Generator<T[]>;
/**
 * Processes async iterable in chunks.
 *
 * @template T - Data type
 * @param {AsyncIterable<T>} source - Async data source
 * @param {number} chunkSize - Chunk size
 * @param {(chunk: T[]) => Promise<void>} processor - Chunk processor
 * @returns {Promise<number>} Total items processed
 *
 * @example
 * ```typescript
 * const processed = await processAsyncIterableInChunks(
 *   databaseCursor,
 *   1000,
 *   async (chunk) => await bulkInsert(chunk)
 * );
 * ```
 */
export declare function processAsyncIterableInChunks<T = any>(source: AsyncIterable<T>, chunkSize: number, processor: (chunk: T[]) => Promise<void>): Promise<number>;
/**
 * Calculates optimal chunk size based on available memory.
 *
 * @param {number} totalItems - Total number of items
 * @param {number} itemSizeBytes - Average item size in bytes
 * @param {number} maxMemoryMB - Maximum memory to use in MB
 * @returns {number} Optimal chunk size
 *
 * @example
 * ```typescript
 * const chunkSize = calculateOptimalChunkSize(
 *   1000000,
 *   1024, // 1KB per item
 *   512   // Use max 512MB
 * );
 * ```
 */
export declare function calculateOptimalChunkSize(totalItems: number, itemSizeBytes: number, maxMemoryMB?: number): number;
/**
 * Splits large dataset into chunks with memory management.
 *
 * @template T - Data type
 * @param {T[]} data - Data array
 * @param {number} targetChunks - Target number of chunks
 * @returns {T[][]} Array of data chunks
 *
 * @example
 * ```typescript
 * const chunks = splitIntoEvenChunks(largeDataset, 10);
 * await Promise.all(chunks.map(chunk => processChunk(chunk)));
 * ```
 */
export declare function splitIntoEvenChunks<T = any>(data: T[], targetChunks: number): T[][];
/**
 * Processes chunks with adaptive sizing based on processing time.
 *
 * @template T - Data type
 * @param {T[]} data - Data array
 * @param {(chunk: T[]) => Promise<void>} processor - Chunk processor
 * @param {object} options - Adaptive options
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await processChunksAdaptively(
 *   data,
 *   async (chunk) => await process(chunk),
 *   { initialChunkSize: 100, targetTimeMs: 5000 }
 * );
 * ```
 */
export declare function processChunksAdaptively<T = any>(data: T[], processor: (chunk: T[]) => Promise<void>, options: {
    initialChunkSize: number;
    targetTimeMs?: number;
    minChunkSize?: number;
    maxChunkSize?: number;
}): Promise<void>;
/**
 * Creates a recovery checkpoint for batch job.
 *
 * @param {string} jobId - Job identifier
 * @param {number} processedCount - Number of items processed
 * @param {string} lastProcessedId - ID of last processed item
 * @param {Record<string, any>} metadata - Additional metadata
 * @returns {JobRecoveryCheckpoint} Recovery checkpoint
 *
 * @example
 * ```typescript
 * const checkpoint = createRecoveryCheckpoint(
 *   'batch-001',
 *   5000,
 *   'patient-5000',
 *   { batchNumber: 5 }
 * );
 * await saveCheckpoint(checkpoint);
 * ```
 */
export declare function createRecoveryCheckpoint(jobId: string, processedCount: number, lastProcessedId?: string, metadata?: Record<string, any>): JobRecoveryCheckpoint;
/**
 * Resumes batch job from checkpoint.
 *
 * @template T - Data type
 * @param {JobRecoveryCheckpoint} checkpoint - Recovery checkpoint
 * @param {T[]} allData - Complete dataset
 * @param {(items: T[]) => Promise<void>} processor - Batch processor
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * const checkpoint = await loadCheckpoint('batch-001');
 * if (checkpoint) {
 *   await resumeFromCheckpoint(
 *     checkpoint,
 *     allPatients,
 *     async (batch) => await processBatch(batch)
 *   );
 * }
 * ```
 */
export declare function resumeFromCheckpoint<T = any>(checkpoint: JobRecoveryCheckpoint, allData: T[], processor: (items: T[]) => Promise<void>): Promise<void>;
/**
 * Implements automatic checkpoint saving during batch processing.
 *
 * @template T - Data type
 * @param {string} jobId - Job identifier
 * @param {T[]} data - Data to process
 * @param {(item: T) => Promise<void>} processor - Item processor
 * @param {(checkpoint: JobRecoveryCheckpoint) => Promise<void>} saveCheckpoint - Checkpoint saver
 * @param {number} checkpointInterval - Items between checkpoints
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await processWithAutoCheckpoint(
 *   'import-001',
 *   records,
 *   async (record) => await importRecord(record),
 *   async (cp) => await db.saveCheckpoint(cp),
 *   1000
 * );
 * ```
 */
export declare function processWithAutoCheckpoint<T = any>(jobId: string, data: T[], processor: (item: T) => Promise<void>, saveCheckpoint: (checkpoint: JobRecoveryCheckpoint) => Promise<void>, checkpointInterval?: number): Promise<void>;
/**
 * Validates checkpoint integrity and compatibility.
 *
 * @param {JobRecoveryCheckpoint} checkpoint - Checkpoint to validate
 * @param {string} expectedJobId - Expected job ID
 * @param {number} maxAgeMs - Maximum checkpoint age in ms
 * @returns {boolean} True if checkpoint is valid
 *
 * @example
 * ```typescript
 * const checkpoint = await loadCheckpoint('batch-001');
 * if (isCheckpointValid(checkpoint, 'batch-001', 24 * 60 * 60 * 1000)) {
 *   await resumeFromCheckpoint(checkpoint, data, process);
 * }
 * ```
 */
export declare function isCheckpointValid(checkpoint: JobRecoveryCheckpoint, expectedJobId: string, maxAgeMs?: number): boolean;
/**
 * Implements idempotent batch processing with deduplication.
 *
 * @template T - Data type
 * @param {T[]} items - Items to process
 * @param {(item: T) => string} getItemId - Function to get item ID
 * @param {(item: T) => Promise<void>} processor - Item processor
 * @param {Set<string>} processedIds - Set of already processed IDs
 * @returns {Promise<number>} Number of newly processed items
 *
 * @example
 * ```typescript
 * const processedIds = new Set(await getProcessedIds('batch-001'));
 * const newlyProcessed = await processIdempotent(
 *   claims,
 *   (claim) => claim.id,
 *   async (claim) => await processClaim(claim),
 *   processedIds
 * );
 * ```
 */
export declare function processIdempotent<T = any>(items: T[], getItemId: (item: T) => string, processor: (item: T) => Promise<void>, processedIds: Set<string>): Promise<number>;
/**
 * Creates a batch transaction context.
 *
 * @param {string} jobId - Job identifier
 * @param {string} isolationLevel - Transaction isolation level
 * @returns {BatchTransactionContext} Transaction context
 *
 * @example
 * ```typescript
 * const txContext = createBatchTransactionContext(
 *   'batch-001',
 *   'READ_COMMITTED'
 * );
 * ```
 */
export declare function createBatchTransactionContext(jobId: string, isolationLevel?: 'READ_UNCOMMITTED' | 'READ_COMMITTED' | 'REPEATABLE_READ' | 'SERIALIZABLE'): BatchTransactionContext;
/**
 * Executes batch operations within a transaction with rollback support.
 *
 * @template T - Operation result type
 * @param {() => Promise<T>} operation - Operation to execute
 * @param {() => Promise<void>} rollback - Rollback function
 * @returns {Promise<T>} Operation result
 * @throws {Error} If operation fails after rollback
 *
 * @example
 * ```typescript
 * const result = await executeBatchTransaction(
 *   async () => await bulkInsert(records),
 *   async () => await bulkDelete(records)
 * );
 * ```
 */
export declare function executeBatchTransaction<T = any>(operation: () => Promise<T>, rollback: () => Promise<void>): Promise<T>;
/**
 * Implements two-phase commit for distributed batch operations.
 *
 * @param {Array<() => Promise<void>>} preparePhases - Prepare phase operations
 * @param {Array<() => Promise<void>>} commitPhases - Commit phase operations
 * @param {Array<() => Promise<void>>} rollbackPhases - Rollback operations
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await executeTwoPhaseCommit(
 *   [() => db1.prepare(), () => db2.prepare()],
 *   [() => db1.commit(), () => db2.commit()],
 *   [() => db1.rollback(), () => db2.rollback()]
 * );
 * ```
 */
export declare function executeTwoPhaseCommit(preparePhases: Array<() => Promise<void>>, commitPhases: Array<() => Promise<void>>, rollbackPhases: Array<() => Promise<void>>): Promise<void>;
/**
 * Manages compensating transactions for batch operations.
 *
 * @template T - Operation data type
 * @param {Array<{ execute: () => Promise<T>; compensate: (data: T) => Promise<void> }>} operations
 * @returns {Promise<T[]>} Array of operation results
 *
 * @example
 * ```typescript
 * const results = await executeWithCompensation([
 *   {
 *     execute: () => createUser(userData),
 *     compensate: (user) => deleteUser(user.id)
 *   },
 *   {
 *     execute: () => sendWelcomeEmail(user),
 *     compensate: () => logEmailFailure(user)
 *   }
 * ]);
 * ```
 */
export declare function executeWithCompensation<T = any>(operations: Array<{
    execute: () => Promise<T>;
    compensate: (data: T) => Promise<void>;
}>): Promise<T[]>;
/**
 * Creates job monitoring metrics snapshot.
 *
 * @param {string} jobId - Job identifier
 * @param {BatchJobStatus} status - Current job status
 * @param {Partial<JobMonitoringMetrics>} metrics - Partial metrics
 * @returns {JobMonitoringMetrics} Complete metrics snapshot
 *
 * @example
 * ```typescript
 * const metrics = createJobMetrics('batch-001', BatchJobStatus.RUNNING, {
 *   itemsProcessed: 5000,
 *   itemsFailed: 10
 * });
 * ```
 */
export declare function createJobMetrics(jobId: string, status: BatchJobStatus, metrics: Partial<JobMonitoringMetrics>): JobMonitoringMetrics;
/**
 * Calculates batch processing throughput.
 *
 * @param {number} itemsProcessed - Number of items processed
 * @param {number} durationMs - Processing duration in milliseconds
 * @returns {number} Items per second
 *
 * @example
 * ```typescript
 * const throughput = calculateThroughput(10000, 60000);
 * console.log(`Processing ${throughput.toFixed(2)} items/second`);
 * ```
 */
export declare function calculateThroughput(itemsProcessed: number, durationMs: number): number;
/**
 * Generates batch job execution report.
 *
 * @param {BatchJobResult} result - Job execution result
 * @param {JobMonitoringMetrics} metrics - Job metrics
 * @returns {string} Formatted report
 *
 * @example
 * ```typescript
 * const report = generateBatchJobReport(jobResult, jobMetrics);
 * console.log(report);
 * await emailReport(report);
 * ```
 */
export declare function generateBatchJobReport(result: BatchJobResult, metrics: JobMonitoringMetrics): string;
/**
 * Monitors job progress and emits progress events.
 *
 * @param {string} jobId - Job identifier
 * @param {() => Promise<JobMonitoringMetrics>} metricsProvider - Function to get current metrics
 * @param {number} intervalMs - Monitoring interval
 * @returns {Subject<JobMonitoringMetrics>} Observable metrics stream
 *
 * @example
 * ```typescript
 * const monitor = monitorJobProgress(
 *   'batch-001',
 *   async () => await getJobMetrics('batch-001'),
 *   5000
 * );
 * monitor.subscribe(metrics => console.log('Progress:', metrics));
 * ```
 */
export declare function monitorJobProgress(jobId: string, metricsProvider: () => Promise<JobMonitoringMetrics>, intervalMs?: number): Subject<JobMonitoringMetrics>;
/**
 * Aggregates metrics from multiple batch jobs.
 *
 * @param {JobMonitoringMetrics[]} metricsArray - Array of job metrics
 * @returns {object} Aggregated metrics
 *
 * @example
 * ```typescript
 * const aggregated = aggregateBatchMetrics([
 *   metrics1, metrics2, metrics3
 * ]);
 * console.log(`Total processed: ${aggregated.totalProcessed}`);
 * ```
 */
export declare function aggregateBatchMetrics(metricsArray: JobMonitoringMetrics[]): {
    totalProcessed: number;
    totalFailed: number;
    averageThroughput: number;
    overallSuccessRate: number;
};
/**
 * Creates a conditional execution rule based on context.
 *
 * @param {(ctx: BatchJobContext) => boolean | Promise<boolean>} condition - Condition function
 * @param {'execute' | 'skip' | 'defer'} action - Action when condition is true
 * @param {number} deferDuration - Duration to defer if action is 'defer'
 * @returns {ConditionalExecutionRule} Execution rule
 *
 * @example
 * ```typescript
 * const rule = createConditionalRule(
 *   (ctx) => ctx.metadata.isBusinessHours,
 *   'execute'
 * );
 * ```
 */
export declare function createConditionalRule(condition: (ctx: BatchJobContext) => boolean | Promise<boolean>, action: 'execute' | 'skip' | 'defer', deferDuration?: number): ConditionalExecutionRule;
/**
 * Evaluates conditional rules and determines execution action.
 *
 * @param {BatchJobContext} context - Job execution context
 * @param {ConditionalExecutionRule[]} rules - Array of execution rules
 * @returns {Promise<'execute' | 'skip' | 'defer'>} Execution decision
 *
 * @example
 * ```typescript
 * const action = await evaluateConditionalRules(context, [
 *   businessHoursRule,
 *   systemLoadRule,
 *   dataAvailabilityRule
 * ]);
 * ```
 */
export declare function evaluateConditionalRules(context: BatchJobContext, rules: ConditionalExecutionRule[]): Promise<'execute' | 'skip' | 'defer'>;
/**
 * Executes batch job conditionally based on rules.
 *
 * @template T - Job data type
 * @param {BatchJobContext<T>} context - Job execution context
 * @param {ConditionalExecutionRule[]} rules - Conditional rules
 * @param {(ctx: BatchJobContext<T>) => Promise<any>} processor - Job processor
 * @returns {Promise<{ action: string; result?: any }>} Execution outcome
 *
 * @example
 * ```typescript
 * const outcome = await executeConditionalBatchJob(
 *   context,
 *   [businessHoursRule],
 *   async (ctx) => await processData(ctx.data)
 * );
 * ```
 */
export declare function executeConditionalBatchJob<T = any>(context: BatchJobContext<T>, rules: ConditionalExecutionRule[], processor: (ctx: BatchJobContext<T>) => Promise<any>): Promise<{
    action: string;
    result?: any;
}>;
/**
 * Creates a time-window execution rule.
 *
 * @param {number} startHour - Start hour (0-23)
 * @param {number} endHour - End hour (0-23)
 * @param {string} timezone - Timezone identifier
 * @returns {ConditionalExecutionRule} Time-window rule
 *
 * @example
 * ```typescript
 * // Execute only between 2 AM and 6 AM
 * const rule = createTimeWindowRule(2, 6, 'America/New_York');
 * ```
 */
export declare function createTimeWindowRule(startHour: number, endHour: number, timezone?: string): ConditionalExecutionRule;
declare const _default: {
    createBatchJobConfig: typeof createBatchJobConfig;
    batchConfigToBullOptions: typeof batchConfigToBullOptions;
    validateBatchJobConfig: typeof validateBatchJobConfig;
    mergeBatchJobConfig: typeof mergeBatchJobConfig;
    createBatchJobContext: typeof createBatchJobContext;
    createCronSchedule: typeof createCronSchedule;
    createIntervalSchedule: typeof createIntervalSchedule;
    validateCronExpression: typeof validateCronExpression;
    registerScheduledJob: typeof registerScheduledJob;
    unregisterScheduledJob: typeof unregisterScheduledJob;
    getNextExecutionTime: typeof getNextExecutionTime;
    scheduleDelayedJob: typeof scheduleDelayedJob;
    executeBatchJob: typeof executeBatchJob;
    withRetry: typeof withRetry;
    withTimeout: typeof withTimeout;
    executeBatchJobWithProgress: typeof executeBatchJobWithProgress;
    createPausableBatchExecutor: typeof createPausableBatchExecutor;
    executeBatchJobWithRateLimit: typeof executeBatchJobWithRateLimit;
    createJobChain: typeof createJobChain;
    validateJobChain: typeof validateJobChain;
    executeJobChain: typeof executeJobChain;
    visualizeJobDependencies: typeof visualizeJobDependencies;
    waitForDependencies: typeof waitForDependencies;
    processInParallelBatches: typeof processInParallelBatches;
    createParallelBatchProcessor: typeof createParallelBatchProcessor;
    distributeWorkload: typeof distributeWorkload;
    executeDynamicParallelBatch: typeof executeDynamicParallelBatch;
    streamParallelBatchResults: typeof streamParallelBatchResults;
    processInChunks: typeof processInChunks;
    createChunkIterator: typeof createChunkIterator;
    processAsyncIterableInChunks: typeof processAsyncIterableInChunks;
    calculateOptimalChunkSize: typeof calculateOptimalChunkSize;
    splitIntoEvenChunks: typeof splitIntoEvenChunks;
    processChunksAdaptively: typeof processChunksAdaptively;
    createRecoveryCheckpoint: typeof createRecoveryCheckpoint;
    resumeFromCheckpoint: typeof resumeFromCheckpoint;
    processWithAutoCheckpoint: typeof processWithAutoCheckpoint;
    isCheckpointValid: typeof isCheckpointValid;
    processIdempotent: typeof processIdempotent;
    createBatchTransactionContext: typeof createBatchTransactionContext;
    executeBatchTransaction: typeof executeBatchTransaction;
    executeTwoPhaseCommit: typeof executeTwoPhaseCommit;
    executeWithCompensation: typeof executeWithCompensation;
    createJobMetrics: typeof createJobMetrics;
    calculateThroughput: typeof calculateThroughput;
    generateBatchJobReport: typeof generateBatchJobReport;
    monitorJobProgress: typeof monitorJobProgress;
    aggregateBatchMetrics: typeof aggregateBatchMetrics;
    createConditionalRule: typeof createConditionalRule;
    evaluateConditionalRules: typeof evaluateConditionalRules;
    executeConditionalBatchJob: typeof executeConditionalBatchJob;
    createTimeWindowRule: typeof createTimeWindowRule;
};
export default _default;
//# sourceMappingURL=nestjs-oracle-batch-kit.d.ts.map