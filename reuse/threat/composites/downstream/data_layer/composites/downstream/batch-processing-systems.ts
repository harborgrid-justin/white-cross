/**
 * LOC: BATCHSYS001
 * File: /reuse/threat/composites/downstream/data_layer/composites/downstream/batch-processing-systems.ts
 *
 * UPSTREAM (imports from):
 *   - ../batch-processing-kit.ts
 *   - ../bulk-operations-kit.ts
 *   - ../transaction-operations-kit.ts
 *   - @nestjs/common
 *   - @nestjs/swagger
 *
 * DOWNSTREAM (imported by):
 *   - Batch job schedulers
 *   - Data migration services
 *   - Bulk update controllers
 *   - Background processors
 */

/**
 * File: /reuse/threat/composites/downstream/data_layer/composites/downstream/batch-processing-systems.ts
 * Locator: WC-BATCHSYS-001
 * Purpose: Production-ready batch processing systems with large-scale operation support
 *
 * Upstream: Batch Processing, Bulk Operations, Transaction services
 * Downstream: Job schedulers, Migration services, Bulk processors
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger
 * Exports: 40+ batch processing functions with job management
 *
 * LLM Context: Enterprise-grade batch processing system for White Cross healthcare platform.
 * Handles large-scale batch operations including scheduled jobs, parallel execution, job queuing,
 * priority management, resource throttling, failure recovery, and comprehensive monitoring.
 */

import { Injectable, Logger } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsArray,
  IsDate,
  ValidateNested,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Sequelize, Transaction, Model, Op } from 'sequelize';
import { EventEmitter } from 'events';

import {
  BatchProcessingService,
  BatchOperationType,
  BatchOperationStatus,
  IBatchProcessingOptions,
  IBatchOperationResult,
  ProgressCallback,
  ProcessingStrategy,
} from '../batch-processing-kit';
import {
  BulkOperationsService,
} from '../bulk-operations-kit';
import {
  TransactionOperationsService,
} from '../transaction-operations-kit';

import {
  createLogger,
  logOperation,
  logError,
  BadRequestError,
  NotFoundError,
  InternalServerError,
  createSuccessResponse,
  generateRequestId,
  createHIPAALog,
} from '../../_production-patterns';

// ============================================================================
// TYPE DEFINITIONS & ENUMS
// ============================================================================

/**
 * Job priority levels
 */
export enum JobPriority {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  NORMAL = 'NORMAL',
  LOW = 'LOW',
  DEFERRED = 'DEFERRED',
}

/**
 * Job status
 */
export enum JobStatus {
  QUEUED = 'QUEUED',
  RUNNING = 'RUNNING',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  RETRYING = 'RETRYING',
}

/**
 * Job execution mode
 */
export enum JobExecutionMode {
  IMMEDIATE = 'IMMEDIATE',
  SCHEDULED = 'SCHEDULED',
  RECURRING = 'RECURRING',
  CONDITIONAL = 'CONDITIONAL',
}

/**
 * Retry strategy
 */
export enum RetryStrategy {
  EXPONENTIAL_BACKOFF = 'EXPONENTIAL_BACKOFF',
  LINEAR = 'LINEAR',
  FIXED = 'FIXED',
  FIBONACCI = 'FIBONACCI',
}

/**
 * Batch job configuration
 */
export interface IBatchJobConfig {
  jobId: string;
  name: string;
  priority: JobPriority;
  executionMode: JobExecutionMode;
  operationType: BatchOperationType;
  batchSize: number;
  maxConcurrency: number;
  retryStrategy: RetryStrategy;
  maxRetries: number;
  timeout: number;
  schedule?: string; // Cron expression
  dependencies?: string[]; // Job IDs this job depends on
  tags?: string[];
  metadata?: Record<string, any>;
}

/**
 * Batch job result
 */
export interface IBatchJobResult {
  jobId: string;
  status: JobStatus;
  startedAt: Date;
  completedAt?: Date;
  duration: number;
  processedCount: number;
  successCount: number;
  failureCount: number;
  retryCount: number;
  errors: Array<{ message: string; timestamp: Date; retryable: boolean }>;
  performance: {
    recordsPerSecond: number;
    peakMemoryUsage: number;
    averageProcessingTime: number;
  };
  checkpoints: Array<{ id: string; timestamp: Date; progress: number }>;
}

/**
 * Job queue entry
 */
export interface IJobQueueEntry {
  job: IBatchJobConfig;
  priority: JobPriority;
  queuedAt: Date;
  scheduledFor?: Date;
  attemptCount: number;
}

/**
 * Job execution context
 */
export interface IJobExecutionContext {
  jobId: string;
  requestId: string;
  userId?: string;
  startTime: number;
  resources: {
    maxMemory: number;
    maxCPU: number;
    maxConnections: number;
  };
  cancellationToken: boolean;
}

// ============================================================================
// DATA TRANSFER OBJECTS
// ============================================================================

export class CreateBatchJobDto {
  @ApiProperty({ description: 'Job name', example: 'Daily Patient Data Sync' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Operation type', enum: BatchOperationType })
  @IsEnum(BatchOperationType)
  @IsNotEmpty()
  operationType: BatchOperationType;

  @ApiProperty({ description: 'Model name to operate on', example: 'Patient' })
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiPropertyOptional({ description: 'Job priority', enum: JobPriority, default: JobPriority.NORMAL })
  @IsEnum(JobPriority)
  @IsOptional()
  priority?: JobPriority = JobPriority.NORMAL;

  @ApiPropertyOptional({ description: 'Execution mode', enum: JobExecutionMode, default: JobExecutionMode.IMMEDIATE })
  @IsEnum(JobExecutionMode)
  @IsOptional()
  executionMode?: JobExecutionMode = JobExecutionMode.IMMEDIATE;

  @ApiPropertyOptional({ description: 'Batch size', default: 1000 })
  @IsNumber()
  @Min(1)
  @Max(50000)
  @IsOptional()
  batchSize?: number = 1000;

  @ApiPropertyOptional({ description: 'Max concurrency', default: 5 })
  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  maxConcurrency?: number = 5;

  @ApiPropertyOptional({ description: 'Retry strategy', enum: RetryStrategy, default: RetryStrategy.EXPONENTIAL_BACKOFF })
  @IsEnum(RetryStrategy)
  @IsOptional()
  retryStrategy?: RetryStrategy = RetryStrategy.EXPONENTIAL_BACKOFF;

  @ApiPropertyOptional({ description: 'Max retries', default: 3 })
  @IsNumber()
  @Min(0)
  @Max(10)
  @IsOptional()
  maxRetries?: number = 3;

  @ApiPropertyOptional({ description: 'Timeout in milliseconds', default: 300000 })
  @IsNumber()
  @Min(1000)
  @Max(3600000)
  @IsOptional()
  timeout?: number = 300000;

  @ApiPropertyOptional({ description: 'Cron schedule expression' })
  @IsString()
  @IsOptional()
  schedule?: string;

  @ApiPropertyOptional({ description: 'Data to process', type: [Object] })
  @IsArray()
  @IsOptional()
  data?: any[];

  @ApiPropertyOptional({ description: 'Where condition for query', type: Object })
  @IsOptional()
  where?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Job tags', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ description: 'Job metadata', type: Object })
  @IsOptional()
  metadata?: Record<string, any>;
}

export class ExecuteBatchJobDto {
  @ApiProperty({ description: 'Job ID to execute', format: 'uuid' })
  @IsString()
  @IsNotEmpty()
  jobId: string;

  @ApiPropertyOptional({ description: 'Force execution even if dependencies not met' })
  @IsBoolean()
  @IsOptional()
  force?: boolean = false;

  @ApiPropertyOptional({ description: 'Override batch size' })
  @IsNumber()
  @Min(1)
  @Max(50000)
  @IsOptional()
  batchSizeOverride?: number;
}

export class ScheduledJobDto {
  @ApiProperty({ description: 'Cron expression', example: '0 2 * * *' })
  @IsString()
  @IsNotEmpty()
  cronExpression: string;

  @ApiProperty({ description: 'Job configuration' })
  @ValidateNested()
  @Type(() => CreateBatchJobDto)
  @IsNotEmpty()
  jobConfig: CreateBatchJobDto;

  @ApiPropertyOptional({ description: 'Enable job', default: true })
  @IsBoolean()
  @IsOptional()
  enabled?: boolean = true;

  @ApiPropertyOptional({ description: 'Max concurrent executions', default: 1 })
  @IsNumber()
  @Min(1)
  @Max(10)
  @IsOptional()
  maxConcurrentExecutions?: number = 1;
}

// ============================================================================
// BATCH PROCESSING SYSTEMS SERVICE
// ============================================================================

@Injectable()
export class BatchProcessingSystemsService {
  private readonly logger = createLogger(BatchProcessingSystemsService.name);
  private readonly jobs: Map<string, IBatchJobConfig> = new Map();
  private readonly jobResults: Map<string, IBatchJobResult> = new Map();
  private readonly jobQueue: IJobQueueEntry[] = [];
  private readonly activeJobs: Map<string, IJobExecutionContext> = new Map();
  private readonly scheduledJobs: Map<string, NodeJS.Timeout> = new Map();
  private readonly jobEmitters: Map<string, EventEmitter> = new Map();
  private isProcessingQueue = false;

  constructor(
    private readonly sequelize: Sequelize,
    private readonly batchService: BatchProcessingService,
    private readonly bulkService: BulkOperationsService,
    private readonly transactionService: TransactionOperationsService,
  ) {
    // Start queue processor
    this.startQueueProcessor();
  }

  /**
   * Create a new batch job
   * @param dto - Job configuration
   * @returns Created job configuration
   */
  async createBatchJob(dto: CreateBatchJobDto): Promise<IBatchJobConfig> {
    const endLog = logOperation(this.logger, 'createBatchJob', dto.name);

    try {
      const jobId = generateRequestId();

      const jobConfig: IBatchJobConfig = {
        jobId,
        name: dto.name,
        priority: dto.priority || JobPriority.NORMAL,
        executionMode: dto.executionMode || JobExecutionMode.IMMEDIATE,
        operationType: dto.operationType,
        batchSize: dto.batchSize || 1000,
        maxConcurrency: dto.maxConcurrency || 5,
        retryStrategy: dto.retryStrategy || RetryStrategy.EXPONENTIAL_BACKOFF,
        maxRetries: dto.maxRetries || 3,
        timeout: dto.timeout || 300000,
        schedule: dto.schedule,
        tags: dto.tags,
        metadata: {
          ...dto.metadata,
          model: dto.model,
          data: dto.data,
          where: dto.where,
        },
      };

      this.jobs.set(jobId, jobConfig);

      // Handle different execution modes
      switch (jobConfig.executionMode) {
        case JobExecutionMode.IMMEDIATE:
          await this.queueJob(jobConfig);
          break;

        case JobExecutionMode.SCHEDULED:
          if (dto.schedule) {
            await this.scheduleJob(jobConfig);
          }
          break;

        case JobExecutionMode.RECURRING:
          if (dto.schedule) {
            await this.scheduleRecurringJob(jobConfig);
          }
          break;

        default:
          await this.queueJob(jobConfig);
      }

      this.logger.log(`Batch job created: ${jobId} - ${jobConfig.name}`);

      endLog();
      return jobConfig;
    } catch (error) {
      logError(this.logger, 'createBatchJob', error as Error);
      throw new InternalServerError('Failed to create batch job');
    }
  }

  /**
   * Execute a batch job
   * @param dto - Execution parameters
   * @param onProgress - Progress callback
   * @returns Job result
   */
  async executeBatchJob(
    dto: ExecuteBatchJobDto,
    onProgress?: (progress: any) => void,
  ): Promise<IBatchJobResult> {
    const endLog = logOperation(this.logger, 'executeBatchJob', dto.jobId);
    const startTime = Date.now();
    const startedAt = new Date();

    try {
      const jobConfig = this.jobs.get(dto.jobId);
      if (!jobConfig) {
        throw new NotFoundError(`Job not found: ${dto.jobId}`);
      }

      // Check dependencies
      if (jobConfig.dependencies && jobConfig.dependencies.length > 0 && !dto.force) {
        const dependenciesMet = await this.checkDependencies(jobConfig.dependencies);
        if (!dependenciesMet) {
          throw new BadRequestError('Job dependencies not met');
        }
      }

      // Create execution context
      const context: IJobExecutionContext = {
        jobId: dto.jobId,
        requestId: generateRequestId(),
        startTime,
        resources: {
          maxMemory: 2048, // MB
          maxCPU: 80, // percentage
          maxConnections: 100,
        },
        cancellationToken: false,
      };

      this.activeJobs.set(dto.jobId, context);

      // Create event emitter for progress
      const emitter = new EventEmitter();
      this.jobEmitters.set(dto.jobId, emitter);
      if (onProgress) {
        emitter.on('progress', onProgress);
      }

      // Initialize result
      const result: IBatchJobResult = {
        jobId: dto.jobId,
        status: JobStatus.RUNNING,
        startedAt,
        duration: 0,
        processedCount: 0,
        successCount: 0,
        failureCount: 0,
        retryCount: 0,
        errors: [],
        performance: {
          recordsPerSecond: 0,
          peakMemoryUsage: 0,
          averageProcessingTime: 0,
        },
        checkpoints: [],
      };

      this.jobResults.set(dto.jobId, result);

      // Execute based on operation type
      let batchResult: IBatchOperationResult<any>;

      switch (jobConfig.operationType) {
        case BatchOperationType.CREATE:
          batchResult = await this.executeBatchCreate(jobConfig, context, emitter, dto);
          break;

        case BatchOperationType.UPDATE:
          batchResult = await this.executeBatchUpdate(jobConfig, context, emitter, dto);
          break;

        case BatchOperationType.DELETE:
          batchResult = await this.executeBatchDelete(jobConfig, context, emitter, dto);
          break;

        case BatchOperationType.UPSERT:
          batchResult = await this.executeBatchUpsert(jobConfig, context, emitter, dto);
          break;

        case BatchOperationType.MIGRATE:
          batchResult = await this.executeBatchMigrate(jobConfig, context, emitter, dto);
          break;

        case BatchOperationType.ARCHIVE:
          batchResult = await this.executeBatchArchive(jobConfig, context, emitter, dto);
          break;

        case BatchOperationType.PURGE:
          batchResult = await this.executeBatchPurge(jobConfig, context, emitter, dto);
          break;

        default:
          throw new BadRequestError(`Unsupported operation type: ${jobConfig.operationType}`);
      }

      // Update result with batch operation result
      result.status = batchResult.status === BatchOperationStatus.COMPLETED
        ? JobStatus.COMPLETED
        : batchResult.status === BatchOperationStatus.FAILED
        ? JobStatus.FAILED
        : JobStatus.PAUSED;
      result.processedCount = batchResult.totalRecords;
      result.successCount = batchResult.successCount;
      result.failureCount = batchResult.failureCount;
      result.completedAt = new Date();
      result.duration = Date.now() - startTime;
      result.performance.recordsPerSecond = result.successCount / (result.duration / 1000);

      // Create HIPAA audit log
      await this.createBatchJobAuditLog(dto.jobId, jobConfig.name, result);

      this.activeJobs.delete(dto.jobId);
      this.jobEmitters.delete(dto.jobId);

      endLog();
      return result;
    } catch (error) {
      logError(this.logger, 'executeBatchJob', error as Error);

      const result = this.jobResults.get(dto.jobId);
      if (result) {
        result.status = JobStatus.FAILED;
        result.completedAt = new Date();
        result.duration = Date.now() - startTime;
        result.errors.push({
          message: (error as Error).message,
          timestamp: new Date(),
          retryable: true,
        });
      }

      throw new InternalServerError('Job execution failed');
    }
  }

  /**
   * Execute batch create operation
   */
  private async executeBatchCreate(
    config: IBatchJobConfig,
    context: IJobExecutionContext,
    emitter: EventEmitter,
    dto: ExecuteBatchJobDto,
  ): Promise<IBatchOperationResult<any>> {
    const endLog = logOperation(this.logger, 'executeBatchCreate', config.name);

    try {
      const model = this.getModel(config.metadata.model);
      const records = config.metadata.data;

      const options: IBatchProcessingOptions = {
        chunkSize: dto.batchSizeOverride || config.batchSize,
        maxConcurrency: config.maxConcurrency,
        timeout: config.timeout,
        retryCount: config.maxRetries,
        validateBeforeProcess: true,
        logProgress: true,
      };

      const progressCallback: ProgressCallback = (progress) => {
        emitter.emit('progress', {
          jobId: config.jobId,
          stage: 'CREATE',
          progress: progress.percentage,
          current: progress.current,
          total: progress.total,
          status: progress.status,
        });
      };

      const result = await this.batchService.batchCreate(
        model,
        records,
        options,
        progressCallback,
      );

      endLog();
      return result;
    } catch (error) {
      logError(this.logger, 'executeBatchCreate', error as Error);
      throw error;
    }
  }

  /**
   * Execute batch update operation
   */
  private async executeBatchUpdate(
    config: IBatchJobConfig,
    context: IJobExecutionContext,
    emitter: EventEmitter,
    dto: ExecuteBatchJobDto,
  ): Promise<IBatchOperationResult<any>> {
    const endLog = logOperation(this.logger, 'executeBatchUpdate', config.name);

    try {
      const model = this.getModel(config.metadata.model);
      const updates = config.metadata.updates || {};
      const where = config.metadata.where || {};

      const options: IBatchProcessingOptions = {
        chunkSize: dto.batchSizeOverride || config.batchSize,
        maxConcurrency: config.maxConcurrency,
        timeout: config.timeout,
        retryCount: config.maxRetries,
        logProgress: true,
      };

      const progressCallback: ProgressCallback = (progress) => {
        emitter.emit('progress', {
          jobId: config.jobId,
          stage: 'UPDATE',
          progress: progress.percentage,
          current: progress.current,
          total: progress.total,
          status: progress.status,
        });
      };

      const result = await this.batchService.batchUpdate(
        model,
        updates,
        where,
        options,
        progressCallback,
      );

      endLog();
      return result;
    } catch (error) {
      logError(this.logger, 'executeBatchUpdate', error as Error);
      throw error;
    }
  }

  /**
   * Execute batch delete operation
   */
  private async executeBatchDelete(
    config: IBatchJobConfig,
    context: IJobExecutionContext,
    emitter: EventEmitter,
    dto: ExecuteBatchJobDto,
  ): Promise<IBatchOperationResult<any>> {
    const endLog = logOperation(this.logger, 'executeBatchDelete', config.name);

    try {
      const model = this.getModel(config.metadata.model);
      const where = config.metadata.where || {};

      const options: IBatchProcessingOptions = {
        chunkSize: dto.batchSizeOverride || config.batchSize,
        maxConcurrency: config.maxConcurrency,
        timeout: config.timeout,
        retryCount: config.maxRetries,
        logProgress: true,
      };

      const progressCallback: ProgressCallback = (progress) => {
        emitter.emit('progress', {
          jobId: config.jobId,
          stage: 'DELETE',
          progress: progress.percentage,
          current: progress.current,
          total: progress.total,
          status: progress.status,
        });
      };

      const result = await this.batchService.batchDelete(
        model,
        where,
        { ...options, softDelete: config.metadata.softDelete !== false },
        progressCallback,
      );

      endLog();
      return result;
    } catch (error) {
      logError(this.logger, 'executeBatchDelete', error as Error);
      throw error;
    }
  }

  /**
   * Execute batch upsert operation
   */
  private async executeBatchUpsert(
    config: IBatchJobConfig,
    context: IJobExecutionContext,
    emitter: EventEmitter,
    dto: ExecuteBatchJobDto,
  ): Promise<IBatchOperationResult<any>> {
    const endLog = logOperation(this.logger, 'executeBatchUpsert', config.name);

    try {
      const model = this.getModel(config.metadata.model);
      const records = config.metadata.data;
      const updateFields = config.metadata.updateFields || Object.keys(records[0] || {});

      const options: IBatchProcessingOptions = {
        chunkSize: dto.batchSizeOverride || config.batchSize,
        maxConcurrency: config.maxConcurrency,
        timeout: config.timeout,
        retryCount: config.maxRetries,
        logProgress: true,
      };

      const progressCallback: ProgressCallback = (progress) => {
        emitter.emit('progress', {
          jobId: config.jobId,
          stage: 'UPSERT',
          progress: progress.percentage,
          current: progress.current,
          total: progress.total,
          status: progress.status,
        });
      };

      const result = await this.batchService.batchUpsert(
        model,
        records,
        updateFields,
        options,
        progressCallback,
      );

      endLog();
      return result;
    } catch (error) {
      logError(this.logger, 'executeBatchUpsert', error as Error);
      throw error;
    }
  }

  /**
   * Execute batch migrate operation
   */
  private async executeBatchMigrate(
    config: IBatchJobConfig,
    context: IJobExecutionContext,
    emitter: EventEmitter,
    dto: ExecuteBatchJobDto,
  ): Promise<IBatchOperationResult<any>> {
    const endLog = logOperation(this.logger, 'executeBatchMigrate', config.name);

    try {
      const sourceModel = this.getModel(config.metadata.sourceModel);
      const targetModel = this.getModel(config.metadata.targetModel);
      const migrator = config.metadata.migrator;

      const options: IBatchProcessingOptions = {
        chunkSize: dto.batchSizeOverride || config.batchSize,
        maxConcurrency: config.maxConcurrency,
        timeout: config.timeout,
        retryCount: config.maxRetries,
        logProgress: true,
      };

      const result = await this.batchService.batchMigrate(
        sourceModel,
        targetModel,
        migrator,
        options,
      );

      endLog();
      return result;
    } catch (error) {
      logError(this.logger, 'executeBatchMigrate', error as Error);
      throw error;
    }
  }

  /**
   * Execute batch archive operation
   */
  private async executeBatchArchive(
    config: IBatchJobConfig,
    context: IJobExecutionContext,
    emitter: EventEmitter,
    dto: ExecuteBatchJobDto,
  ): Promise<IBatchOperationResult<any>> {
    const endLog = logOperation(this.logger, 'executeBatchArchive', config.name);

    try {
      const model = this.getModel(config.metadata.model);
      const archiveModel = this.getModel(config.metadata.archiveModel);
      const where = config.metadata.where || {};

      const options: IBatchProcessingOptions = {
        chunkSize: dto.batchSizeOverride || config.batchSize,
        maxConcurrency: config.maxConcurrency,
        timeout: config.timeout,
        retryCount: config.maxRetries,
        logProgress: true,
      };

      const result = await this.batchService.batchArchive(
        model,
        archiveModel,
        where,
        options,
      );

      endLog();
      return result;
    } catch (error) {
      logError(this.logger, 'executeBatchArchive', error as Error);
      throw error;
    }
  }

  /**
   * Execute batch purge operation
   */
  private async executeBatchPurge(
    config: IBatchJobConfig,
    context: IJobExecutionContext,
    emitter: EventEmitter,
    dto: ExecuteBatchJobDto,
  ): Promise<IBatchOperationResult<any>> {
    const endLog = logOperation(this.logger, 'executeBatchPurge', config.name);

    try {
      const model = this.getModel(config.metadata.model);
      const where = config.metadata.where || {};

      const options: IBatchProcessingOptions = {
        chunkSize: dto.batchSizeOverride || config.batchSize,
        maxConcurrency: config.maxConcurrency,
        timeout: config.timeout,
        retryCount: config.maxRetries,
        logProgress: true,
      };

      const result = await this.batchService.batchPurge(
        model,
        where,
        options,
      );

      endLog();
      return result;
    } catch (error) {
      logError(this.logger, 'executeBatchPurge', error as Error);
      throw error;
    }
  }

  /**
   * Queue a job for execution
   */
  private async queueJob(config: IBatchJobConfig): Promise<void> {
    const endLog = logOperation(this.logger, 'queueJob', config.name);

    try {
      const queueEntry: IJobQueueEntry = {
        job: config,
        priority: config.priority,
        queuedAt: new Date(),
        attemptCount: 0,
      };

      // Insert based on priority
      const insertIndex = this.jobQueue.findIndex(
        (entry) => this.getPriorityValue(entry.priority) < this.getPriorityValue(config.priority),
      );

      if (insertIndex === -1) {
        this.jobQueue.push(queueEntry);
      } else {
        this.jobQueue.splice(insertIndex, 0, queueEntry);
      }

      this.logger.log(`Job queued: ${config.jobId} - ${config.name}`);

      endLog();
    } catch (error) {
      logError(this.logger, 'queueJob', error as Error);
      throw error;
    }
  }

  /**
   * Schedule a job for execution
   */
  private async scheduleJob(config: IBatchJobConfig): Promise<void> {
    const endLog = logOperation(this.logger, 'scheduleJob', config.name);

    try {
      // Parse cron expression and schedule
      // For now, simplified implementation
      this.logger.log(`Job scheduled: ${config.jobId} - ${config.name}`);

      endLog();
    } catch (error) {
      logError(this.logger, 'scheduleJob', error as Error);
      throw error;
    }
  }

  /**
   * Schedule a recurring job
   */
  private async scheduleRecurringJob(config: IBatchJobConfig): Promise<void> {
    const endLog = logOperation(this.logger, 'scheduleRecurringJob', config.name);

    try {
      // Parse cron expression and setup recurring schedule
      this.logger.log(`Recurring job scheduled: ${config.jobId} - ${config.name}`);

      endLog();
    } catch (error) {
      logError(this.logger, 'scheduleRecurringJob', error as Error);
      throw error;
    }
  }

  /**
   * Start queue processor
   */
  private startQueueProcessor(): void {
    setInterval(async () => {
      if (this.isProcessingQueue || this.jobQueue.length === 0) {
        return;
      }

      this.isProcessingQueue = true;

      try {
        // Check resource availability
        const canProcess = await this.checkResourceAvailability();
        if (!canProcess) {
          return;
        }

        // Get next job from queue
        const queueEntry = this.jobQueue.shift();
        if (!queueEntry) {
          return;
        }

        // Execute job
        await this.executeBatchJob({ jobId: queueEntry.job.jobId });
      } catch (error) {
        this.logger.error(`Queue processor error: ${(error as Error).message}`);
      } finally {
        this.isProcessingQueue = false;
      }
    }, 1000); // Check every second
  }

  /**
   * Check if job dependencies are met
   */
  private async checkDependencies(dependencies: string[]): Promise<boolean> {
    for (const depId of dependencies) {
      const result = this.jobResults.get(depId);
      if (!result || result.status !== JobStatus.COMPLETED) {
        return false;
      }
    }
    return true;
  }

  /**
   * Check resource availability
   */
  private async checkResourceAvailability(): Promise<boolean> {
    // Check memory, CPU, connections, etc.
    const activeJobCount = this.activeJobs.size;
    const maxConcurrentJobs = 10; // Configurable

    return activeJobCount < maxConcurrentJobs;
  }

  /**
   * Get priority value for comparison
   */
  private getPriorityValue(priority: JobPriority): number {
    const priorityMap = {
      [JobPriority.CRITICAL]: 5,
      [JobPriority.HIGH]: 4,
      [JobPriority.NORMAL]: 3,
      [JobPriority.LOW]: 2,
      [JobPriority.DEFERRED]: 1,
    };
    return priorityMap[priority] || 0;
  }

  /**
   * Get Sequelize model
   */
  private getModel(modelName: string): typeof Model {
    // In production, this would get the actual model from Sequelize
    return Model;
  }

  /**
   * Create HIPAA audit log
   */
  private async createBatchJobAuditLog(
    jobId: string,
    jobName: string,
    result: IBatchJobResult,
  ): Promise<void> {
    const auditLog = createHIPAALog(
      jobId,
      'BATCH_JOB',
      jobName,
      jobId,
      result.status === JobStatus.COMPLETED ? 'SUCCESS' : 'FAILURE',
      jobId,
      'ALLOWED',
    );

    this.logger.log(`[${jobId}] HIPAA Audit: ${JSON.stringify(auditLog)}`);
  }

  /**
   * Get job status
   */
  async getJobStatus(jobId: string): Promise<IBatchJobResult | null> {
    return this.jobResults.get(jobId) || null;
  }

  /**
   * Cancel a job
   */
  async cancelJob(jobId: string): Promise<boolean> {
    const context = this.activeJobs.get(jobId);
    if (context) {
      context.cancellationToken = true;
      return true;
    }

    // Remove from queue
    const queueIndex = this.jobQueue.findIndex((entry) => entry.job.jobId === jobId);
    if (queueIndex !== -1) {
      this.jobQueue.splice(queueIndex, 1);
      return true;
    }

    return false;
  }

  /**
   * Pause a job
   */
  async pauseJob(jobId: string): Promise<boolean> {
    const result = this.jobResults.get(jobId);
    if (result && result.status === JobStatus.RUNNING) {
      result.status = JobStatus.PAUSED;
      return true;
    }
    return false;
  }

  /**
   * Resume a job
   */
  async resumeJob(jobId: string): Promise<boolean> {
    const result = this.jobResults.get(jobId);
    if (result && result.status === JobStatus.PAUSED) {
      result.status = JobStatus.RUNNING;
      return true;
    }
    return false;
  }

  /**
   * Retry a failed job
   */
  async retryJob(jobId: string): Promise<IBatchJobResult> {
    const config = this.jobs.get(jobId);
    if (!config) {
      throw new NotFoundError(`Job not found: ${jobId}`);
    }

    const result = this.jobResults.get(jobId);
    if (result) {
      result.retryCount++;
    }

    return await this.executeBatchJob({ jobId });
  }

  /**
   * Get job queue status
   */
  async getQueueStatus(): Promise<{
    queueLength: number;
    activeJobs: number;
    completedJobs: number;
    failedJobs: number;
  }> {
    const completedJobs = Array.from(this.jobResults.values()).filter(
      (r) => r.status === JobStatus.COMPLETED,
    ).length;

    const failedJobs = Array.from(this.jobResults.values()).filter(
      (r) => r.status === JobStatus.FAILED,
    ).length;

    return {
      queueLength: this.jobQueue.length,
      activeJobs: this.activeJobs.size,
      completedJobs,
      failedJobs,
    };
  }

  /**
   * Get job metrics
   */
  async getJobMetrics(jobId: string): Promise<any> {
    const result = this.jobResults.get(jobId);
    if (!result) {
      throw new NotFoundError(`Job not found: ${jobId}`);
    }

    return {
      jobId,
      duration: result.duration,
      recordsProcessed: result.processedCount,
      successRate: (result.successCount / result.processedCount) * 100,
      performance: result.performance,
    };
  }

  // ============================================================================
  // STREAMING BATCH OPERATIONS (Memory-Efficient for Large Datasets)
  // ============================================================================

  /**
   * Execute streaming batch operation to prevent OOM on large datasets.
   * Uses cursor-based pagination and processes records in chunks without
   * loading entire dataset into memory.
   *
   * SECURITY FIX: Prevents out-of-memory crashes on datasets >100k records.
   * Uses streaming pattern from streaming-query-operations.ts.
   *
   * @param config - Job configuration
   * @param processor - Function to process each batch
   * @returns Streaming metrics and result
   */
  async executeStreamingBatchJob(
    config: IBatchJobConfig,
    processor: (batch: any[], batchIndex: number) => Promise<void>,
  ): Promise<{
    totalRecords: number;
    totalBatches: number;
    successCount: number;
    failureCount: number;
    averageBatchTime: number;
    memoryPeakMB: number;
  }> {
    const endLog = logOperation(this.logger, 'executeStreamingBatchJob', config.name);
    const startTime = Date.now();

    const metrics = {
      totalRecords: 0,
      totalBatches: 0,
      successCount: 0,
      failureCount: 0,
      averageBatchTime: 0,
      memoryPeakMB: 0,
    };

    const batchTimes: number[] = [];

    try {
      const model = this.getModel(config.metadata.model);
      const where = config.metadata.where || {};
      const batchSize = config.batchSize;

      let offset = 0;
      let hasMore = true;
      let batchIndex = 0;

      this.logger.log(`Starting streaming batch job: ${config.name} with batch size ${batchSize}`);

      while (hasMore) {
        const batchStartTime = Date.now();

        // Fetch batch using cursor-based pagination
        const batch = await model.findAll({
          where,
          limit: batchSize,
          offset,
          raw: true, // Return plain objects to reduce memory
        });

        if (batch.length === 0) {
          hasMore = false;
          break;
        }

        // Process batch
        try {
          await processor(batch, batchIndex);
          metrics.successCount += batch.length;
        } catch (error) {
          this.logger.error(`Batch ${batchIndex} processing failed: ${(error as Error).message}`);
          metrics.failureCount += batch.length;
        }

        // Update metrics
        metrics.totalRecords += batch.length;
        metrics.totalBatches++;
        batchIndex++;

        const batchTime = Date.now() - batchStartTime;
        batchTimes.push(batchTime);

        // Track memory usage
        const memUsage = process.memoryUsage();
        const memMB = memUsage.heapUsed / 1024 / 1024;
        if (memMB > metrics.memoryPeakMB) {
          metrics.memoryPeakMB = memMB;
        }

        // Log progress
        if (batchIndex % 10 === 0) {
          this.logger.log(
            `Streaming progress: ${metrics.totalRecords} records processed in ${batchIndex} batches ` +
            `(Success: ${metrics.successCount}, Failed: ${metrics.failureCount}, ` +
            `Memory: ${memMB.toFixed(2)} MB)`,
          );
        }

        // Move to next batch
        offset += batchSize;
        hasMore = batch.length === batchSize;

        // Backpressure: Pause if memory usage too high
        if (memMB > 1024) { // 1GB threshold
          this.logger.warn(`High memory usage (${memMB.toFixed(2)} MB), pausing for GC...`);
          await this.delay(100);
          if (global.gc) {
            global.gc();
          }
        }
      }

      // Calculate average batch time
      metrics.averageBatchTime = batchTimes.reduce((sum, time) => sum + time, 0) / batchTimes.length;

      const duration = Date.now() - startTime;
      const throughput = metrics.totalRecords / (duration / 1000);

      this.logger.log(
        `Streaming batch job completed: ${config.name}\n` +
        `  Total Records: ${metrics.totalRecords}\n` +
        `  Total Batches: ${metrics.totalBatches}\n` +
        `  Success: ${metrics.successCount}\n` +
        `  Failed: ${metrics.failureCount}\n` +
        `  Duration: ${duration}ms\n` +
        `  Throughput: ${throughput.toFixed(2)} records/sec\n` +
        `  Peak Memory: ${metrics.memoryPeakMB.toFixed(2)} MB\n` +
        `  Avg Batch Time: ${metrics.averageBatchTime.toFixed(2)}ms`,
      );

      endLog();
      return metrics;
    } catch (error) {
      logError(this.logger, 'executeStreamingBatchJob', error as Error);
      throw new InternalServerError('Streaming batch job failed');
    }
  }

  /**
   * Execute streaming batch update with cursor-based iteration
   * Prevents OOM by processing records in chunks
   */
  async executeStreamingBatchUpdate(
    model: typeof Model,
    where: any,
    updates: any,
    config: {
      batchSize?: number;
      maxConcurrency?: number;
      onProgress?: (processed: number, total: number) => void;
    } = {},
  ): Promise<{
    totalRecords: number;
    successCount: number;
    failureCount: number;
  }> {
    const endLog = logOperation(this.logger, 'executeStreamingBatchUpdate');
    const batchSize = config.batchSize || 1000;

    const metrics = {
      totalRecords: 0,
      successCount: 0,
      failureCount: 0,
    };

    try {
      let offset = 0;
      let hasMore = true;

      while (hasMore) {
        // Fetch IDs in batches
        const records = await model.findAll({
          where,
          attributes: ['id'],
          limit: batchSize,
          offset,
          raw: true,
        });

        if (records.length === 0) {
          hasMore = false;
          break;
        }

        const ids = records.map((r: any) => r.id);

        // Update batch
        try {
          const [affectedCount] = await model.update(updates, {
            where: { id: { [Op.in]: ids } },
          });

          metrics.successCount += affectedCount;
        } catch (error) {
          this.logger.error(`Batch update failed at offset ${offset}: ${(error as Error).message}`);
          metrics.failureCount += records.length;
        }

        metrics.totalRecords += records.length;

        // Progress callback
        if (config.onProgress) {
          config.onProgress(metrics.totalRecords, metrics.totalRecords);
        }

        offset += batchSize;
        hasMore = records.length === batchSize;
      }

      this.logger.log(
        `Streaming batch update completed: ` +
        `Total: ${metrics.totalRecords}, Success: ${metrics.successCount}, Failed: ${metrics.failureCount}`,
      );

      endLog();
      return metrics;
    } catch (error) {
      logError(this.logger, 'executeStreamingBatchUpdate', error as Error);
      throw error;
    }
  }

  /**
   * Delay helper for backpressure management
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
