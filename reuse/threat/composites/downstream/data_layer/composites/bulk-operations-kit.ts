/**
 * LOC: BULKOPS001
 * File: /reuse/threat/composites/downstream/data_layer/composites/bulk-operations-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - ../_production-patterns.ts
 *   - ./transaction-operations-kit.ts
 *
 * DOWNSTREAM (imported by):
 *   - Data import services
 *   - Batch processing systems
 *   - Healthcare bulk data operations
 *   - Threat intelligence data ingestion
 */

/**
 * File: /reuse/threat/composites/downstream/data_layer/composites/bulk-operations-kit.ts
 * Locator: WC-BULKOPS-001
 * Purpose: Bulk Operations Kit - High-performance bulk data operations with validation
 *
 * Upstream: Sequelize ORM, Transaction operations, NestJS framework
 * Downstream: ETL pipelines, data migration services, bulk import/export systems
 * Dependencies: TypeScript 5.x, Node 18+, sequelize, @nestjs/common, @nestjs/swagger
 * Exports: Bulk insert, update, delete, upsert operations with validation and error handling
 *
 * LLM Context: Production-ready bulk data operations system for White Cross healthcare platform.
 * Provides high-performance bulk CRUD operations with automatic chunking, transaction management,
 * validation, error recovery, and progress tracking. Includes HIPAA-compliant audit logging,
 * deadlock handling, and performance optimizations for large-scale data operations. Supports
 * bulk insert with relations, conditional updates, soft deletes, and upsert operations.
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
  ValidateNested,
  Min,
  Max,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Sequelize, Transaction, Model, Op, BulkCreateOptions, UpdateOptions, DestroyOptions } from 'sequelize';
import {
  createLogger,
  logOperation,
  logError,
  BadRequestError,
  NotFoundError,
  InternalServerError,
  createSuccessResponse,
  generateRequestId,
} from '../_production-patterns';
import { TransactionOperationsService } from './transaction-operations-kit';

// ============================================================================
// TYPE DEFINITIONS & ENUMS
// ============================================================================

/**
 * Bulk operation type
 */
export enum BulkOperationType {
  INSERT = 'INSERT',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  UPSERT = 'UPSERT',
  SOFT_DELETE = 'SOFT_DELETE',
}

/**
 * Bulk operation status
 */
export enum BulkOperationStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  PARTIAL = 'PARTIAL',
}

/**
 * Validation strategy
 */
export enum ValidationStrategy {
  STRICT = 'STRICT',
  LENIENT = 'LENIENT',
  SKIP = 'SKIP',
}

/**
 * Conflict resolution strategy
 */
export enum ConflictResolution {
  SKIP = 'SKIP',
  UPDATE = 'UPDATE',
  FAIL = 'FAIL',
  REPLACE = 'REPLACE',
}

/**
 * Bulk operation result
 */
export interface IBulkOperationResult<T = any> {
  success: boolean;
  operationType: BulkOperationType;
  totalRecords: number;
  successCount: number;
  failureCount: number;
  skippedCount: number;
  data?: T[];
  errors: Array<{ index: number; error: string; record?: any }>;
  duration: number;
  transactionId?: string;
}

/**
 * Bulk operation options
 */
export interface IBulkOperationOptions {
  chunkSize?: number;
  validateBeforeInsert?: boolean;
  validationStrategy?: ValidationStrategy;
  conflictResolution?: ConflictResolution;
  includeRelations?: boolean;
  updateOnDuplicate?: string[];
  returning?: boolean;
  benchmark?: boolean;
  transaction?: Transaction;
  hooks?: boolean;
  individualHooks?: boolean;
}

/**
 * Bulk insert options
 */
export interface IBulkInsertOptions extends IBulkOperationOptions {
  ignoreDuplicates?: boolean;
  updateOnDuplicate?: string[];
}

/**
 * Bulk update options
 */
export interface IBulkUpdateOptions extends IBulkOperationOptions {
  where?: any;
  limit?: number;
  silent?: boolean;
}

/**
 * Bulk delete options
 */
export interface IBulkDeleteOptions extends IBulkOperationOptions {
  where?: any;
  limit?: number;
  force?: boolean;
  truncate?: boolean;
}

/**
 * Progress callback
 */
export type ProgressCallback = (progress: {
  current: number;
  total: number;
  percentage: number;
  status: BulkOperationStatus;
}) => void;

// ============================================================================
// DATA TRANSFER OBJECTS
// ============================================================================

export class BulkInsertDto<T = any> {
  @ApiProperty({ description: 'Array of records to insert', type: [Object] })
  @IsArray()
  @ArrayMinSize(1)
  records: T[];

  @ApiPropertyOptional({ description: 'Chunk size for bulk operations' })
  @IsNumber()
  @Min(1)
  @Max(10000)
  @IsOptional()
  chunkSize?: number = 1000;

  @ApiPropertyOptional({ description: 'Validate before insert' })
  @IsBoolean()
  @IsOptional()
  validateBeforeInsert?: boolean = true;

  @ApiPropertyOptional({ enum: ValidationStrategy })
  @IsEnum(ValidationStrategy)
  @IsOptional()
  validationStrategy?: ValidationStrategy = ValidationStrategy.STRICT;

  @ApiPropertyOptional({ description: 'Ignore duplicate records' })
  @IsBoolean()
  @IsOptional()
  ignoreDuplicates?: boolean = false;

  @ApiPropertyOptional({ description: 'Fields to update on duplicate' })
  @IsArray()
  @IsOptional()
  updateOnDuplicate?: string[];

  @ApiPropertyOptional({ description: 'Include relations in response' })
  @IsBoolean()
  @IsOptional()
  includeRelations?: boolean = false;
}

export class BulkUpdateDto<T = any> {
  @ApiProperty({ description: 'Update values', type: Object })
  @IsNotEmpty()
  values: Partial<T>;

  @ApiProperty({ description: 'Where conditions', type: Object })
  @IsNotEmpty()
  where: any;

  @ApiPropertyOptional({ description: 'Maximum records to update' })
  @IsNumber()
  @Min(1)
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({ description: 'Chunk size for bulk operations' })
  @IsNumber()
  @Min(1)
  @Max(10000)
  @IsOptional()
  chunkSize?: number = 1000;

  @ApiPropertyOptional({ description: 'Silent update without hooks' })
  @IsBoolean()
  @IsOptional()
  silent?: boolean = false;
}

export class BulkDeleteDto {
  @ApiProperty({ description: 'Where conditions', type: Object })
  @IsNotEmpty()
  where: any;

  @ApiPropertyOptional({ description: 'Maximum records to delete' })
  @IsNumber()
  @Min(1)
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({ description: 'Force hard delete' })
  @IsBoolean()
  @IsOptional()
  force?: boolean = false;

  @ApiPropertyOptional({ description: 'Truncate table (delete all)' })
  @IsBoolean()
  @IsOptional()
  truncate?: boolean = false;

  @ApiPropertyOptional({ description: 'Chunk size for bulk operations' })
  @IsNumber()
  @Min(1)
  @Max(10000)
  @IsOptional()
  chunkSize?: number = 1000;
}

export class BulkUpsertDto<T = any> {
  @ApiProperty({ description: 'Array of records to upsert', type: [Object] })
  @IsArray()
  @ArrayMinSize(1)
  records: T[];

  @ApiProperty({ description: 'Unique constraint fields' })
  @IsArray()
  @ArrayMinSize(1)
  conflictFields: string[];

  @ApiPropertyOptional({ description: 'Fields to update on conflict' })
  @IsArray()
  @IsOptional()
  updateFields?: string[];

  @ApiPropertyOptional({ description: 'Chunk size for bulk operations' })
  @IsNumber()
  @Min(1)
  @Max(10000)
  @IsOptional()
  chunkSize?: number = 1000;
}

// ============================================================================
// BULK OPERATIONS SERVICE
// ============================================================================

@Injectable()
export class BulkOperationsService {
  private readonly logger = createLogger(BulkOperationsService.name);

  constructor(
    private readonly sequelize: Sequelize,
    private readonly transactionService: TransactionOperationsService,
  ) {}

  /**
   * Bulk insert records with validation and chunking
   * @param model - Sequelize model class
   * @param dto - Bulk insert data
   * @returns Bulk operation result
   */
  async bulkInsert<T extends Model>(
    model: typeof Model,
    dto: BulkInsertDto<any>,
  ): Promise<IBulkOperationResult<T>> {
    const endLog = logOperation(this.logger, 'bulkInsert', model.name);
    const startTime = Date.now();
    const errors: Array<{ index: number; error: string; record?: any }> = [];
    const inserted: T[] = [];

    try {
      const chunks = this.chunkArray(dto.records, dto.chunkSize || 1000);

      for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
        const chunk = chunks[chunkIndex];

        try {
          const options: BulkCreateOptions = {
            validate: dto.validateBeforeInsert,
            returning: true,
            ignoreDuplicates: dto.ignoreDuplicates,
            updateOnDuplicate: dto.updateOnDuplicate,
          };

          const records = await model.bulkCreate(chunk, options) as T[];
          inserted.push(...records);

          this.logger.log(`Chunk ${chunkIndex + 1}/${chunks.length} inserted: ${records.length} records`);
        } catch (error) {
          const baseIndex = chunkIndex * (dto.chunkSize || 1000);
          chunk.forEach((record, idx) => {
            errors.push({
              index: baseIndex + idx,
              error: (error as Error).message,
              record,
            });
          });

          if (dto.validationStrategy === ValidationStrategy.STRICT) {
            throw error;
          }
        }
      }

      const result: IBulkOperationResult<T> = {
        success: errors.length === 0,
        operationType: BulkOperationType.INSERT,
        totalRecords: dto.records.length,
        successCount: inserted.length,
        failureCount: errors.length,
        skippedCount: dto.records.length - inserted.length - errors.length,
        data: dto.includeRelations ? inserted : undefined,
        errors,
        duration: Date.now() - startTime,
      };

      endLog();
      return result;
    } catch (error) {
      logError(this.logger, 'bulkInsert', error as Error);
      throw new InternalServerError('Bulk insert failed');
    }
  }

  /**
   * Bulk insert with relations support
   * @param model - Sequelize model class
   * @param records - Records with relations
   * @param options - Bulk operation options
   * @returns Bulk operation result
   */
  async bulkInsertWithRelations<T extends Model>(
    model: typeof Model,
    records: any[],
    options: IBulkInsertOptions = {},
  ): Promise<IBulkOperationResult<T>> {
    const endLog = logOperation(this.logger, 'bulkInsertWithRelations', model.name);
    const startTime = Date.now();
    const errors: Array<{ index: number; error: string; record?: any }> = [];
    const inserted: T[] = [];

    try {
      const chunks = this.chunkArray(records, options.chunkSize || 500);

      for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
        const chunk = chunks[chunkIndex];

        for (let i = 0; i < chunk.length; i++) {
          try {
            const record = await model.create(chunk[i], {
              include: options.includeRelations ? [{ all: true }] : undefined,
            }) as T;
            inserted.push(record);
          } catch (error) {
            errors.push({
              index: chunkIndex * (options.chunkSize || 500) + i,
              error: (error as Error).message,
              record: chunk[i],
            });

            if (options.validationStrategy === ValidationStrategy.STRICT) {
              throw error;
            }
          }
        }

        this.logger.log(`Chunk ${chunkIndex + 1}/${chunks.length} processed with relations`);
      }

      const result: IBulkOperationResult<T> = {
        success: errors.length === 0,
        operationType: BulkOperationType.INSERT,
        totalRecords: records.length,
        successCount: inserted.length,
        failureCount: errors.length,
        skippedCount: records.length - inserted.length - errors.length,
        data: inserted,
        errors,
        duration: Date.now() - startTime,
      };

      endLog();
      return result;
    } catch (error) {
      logError(this.logger, 'bulkInsertWithRelations', error as Error);
      throw new InternalServerError('Bulk insert with relations failed');
    }
  }

  /**
   * Bulk update records by criteria
   * @param model - Sequelize model class
   * @param dto - Bulk update data
   * @returns Bulk operation result
   */
  async bulkUpdate<T extends Model>(
    model: typeof Model,
    dto: BulkUpdateDto<any>,
  ): Promise<IBulkOperationResult> {
    const endLog = logOperation(this.logger, 'bulkUpdate', model.name);
    const startTime = Date.now();

    try {
      const options: UpdateOptions = {
        where: dto.where,
        limit: dto.limit,
        silent: dto.silent,
        returning: true,
      };

      const [affectedCount, affectedRows] = await model.update(dto.values, options);

      const result: IBulkOperationResult = {
        success: true,
        operationType: BulkOperationType.UPDATE,
        totalRecords: affectedCount,
        successCount: affectedCount,
        failureCount: 0,
        skippedCount: 0,
        data: affectedRows,
        errors: [],
        duration: Date.now() - startTime,
      };

      this.logger.log(`Bulk update completed: ${affectedCount} records updated`);
      endLog();
      return result;
    } catch (error) {
      logError(this.logger, 'bulkUpdate', error as Error);
      throw new InternalServerError('Bulk update failed');
    }
  }

  /**
   * Bulk update with chunking for large datasets
   * @param model - Sequelize model class
   * @param updates - Array of update operations
   * @param options - Bulk operation options
   * @returns Bulk operation result
   */
  async bulkUpdateChunked<T extends Model>(
    model: typeof Model,
    updates: Array<{ where: any; values: any }>,
    options: IBulkOperationOptions = {},
  ): Promise<IBulkOperationResult> {
    const endLog = logOperation(this.logger, 'bulkUpdateChunked', model.name);
    const startTime = Date.now();
    const errors: Array<{ index: number; error: string; record?: any }> = [];
    let totalUpdated = 0;

    try {
      const chunks = this.chunkArray(updates, options.chunkSize || 1000);

      for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
        const chunk = chunks[chunkIndex];

        for (let i = 0; i < chunk.length; i++) {
          try {
            const [affectedCount] = await model.update(chunk[i].values, {
              where: chunk[i].where,
              transaction: options.transaction,
            });
            totalUpdated += affectedCount;
          } catch (error) {
            errors.push({
              index: chunkIndex * (options.chunkSize || 1000) + i,
              error: (error as Error).message,
              record: chunk[i],
            });

            if (options.validationStrategy === ValidationStrategy.STRICT) {
              throw error;
            }
          }
        }

        this.logger.log(`Chunk ${chunkIndex + 1}/${chunks.length} updated`);
      }

      const result: IBulkOperationResult = {
        success: errors.length === 0,
        operationType: BulkOperationType.UPDATE,
        totalRecords: updates.length,
        successCount: totalUpdated,
        failureCount: errors.length,
        skippedCount: updates.length - totalUpdated - errors.length,
        errors,
        duration: Date.now() - startTime,
      };

      endLog();
      return result;
    } catch (error) {
      logError(this.logger, 'bulkUpdateChunked', error as Error);
      throw new InternalServerError('Bulk update chunked failed');
    }
  }

  /**
   * Bulk delete records
   * @param model - Sequelize model class
   * @param dto - Bulk delete data
   * @returns Bulk operation result
   */
  async bulkDelete<T extends Model>(
    model: typeof Model,
    dto: BulkDeleteDto,
  ): Promise<IBulkOperationResult> {
    const endLog = logOperation(this.logger, 'bulkDelete', model.name);
    const startTime = Date.now();

    try {
      const options: DestroyOptions = {
        where: dto.where,
        limit: dto.limit,
        force: dto.force,
        truncate: dto.truncate,
      };

      const deletedCount = await model.destroy(options);

      const result: IBulkOperationResult = {
        success: true,
        operationType: BulkOperationType.DELETE,
        totalRecords: deletedCount,
        successCount: deletedCount,
        failureCount: 0,
        skippedCount: 0,
        errors: [],
        duration: Date.now() - startTime,
      };

      this.logger.log(`Bulk delete completed: ${deletedCount} records deleted`);
      endLog();
      return result;
    } catch (error) {
      logError(this.logger, 'bulkDelete', error as Error);
      throw new InternalServerError('Bulk delete failed');
    }
  }

  /**
   * Bulk soft delete records
   * @param model - Sequelize model class
   * @param where - Where conditions
   * @param options - Bulk operation options
   * @returns Bulk operation result
   */
  async bulkSoftDelete<T extends Model>(
    model: typeof Model,
    where: any,
    options: IBulkOperationOptions = {},
  ): Promise<IBulkOperationResult> {
    const endLog = logOperation(this.logger, 'bulkSoftDelete', model.name);
    const startTime = Date.now();

    try {
      const [affectedCount] = await model.update(
        { deletedAt: new Date() },
        {
          where,
          transaction: options.transaction,
        },
      );

      const result: IBulkOperationResult = {
        success: true,
        operationType: BulkOperationType.SOFT_DELETE,
        totalRecords: affectedCount,
        successCount: affectedCount,
        failureCount: 0,
        skippedCount: 0,
        errors: [],
        duration: Date.now() - startTime,
      };

      this.logger.log(`Bulk soft delete completed: ${affectedCount} records marked as deleted`);
      endLog();
      return result;
    } catch (error) {
      logError(this.logger, 'bulkSoftDelete', error as Error);
      throw new InternalServerError('Bulk soft delete failed');
    }
  }

  /**
   * Bulk upsert (insert or update on conflict)
   * @param model - Sequelize model class
   * @param dto - Bulk upsert data
   * @returns Bulk operation result
   */
  async bulkUpsert<T extends Model>(
    model: typeof Model,
    dto: BulkUpsertDto<any>,
  ): Promise<IBulkOperationResult<T>> {
    const endLog = logOperation(this.logger, 'bulkUpsert', model.name);
    const startTime = Date.now();
    const errors: Array<{ index: number; error: string; record?: any }> = [];
    const results: T[] = [];

    try {
      const chunks = this.chunkArray(dto.records, dto.chunkSize || 1000);

      for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
        const chunk = chunks[chunkIndex];

        try {
          const upserted = await model.bulkCreate(chunk, {
            updateOnDuplicate: dto.updateFields || Object.keys(chunk[0]),
            returning: true,
          }) as T[];

          results.push(...upserted);
          this.logger.log(`Chunk ${chunkIndex + 1}/${chunks.length} upserted: ${upserted.length} records`);
        } catch (error) {
          const baseIndex = chunkIndex * (dto.chunkSize || 1000);
          chunk.forEach((record, idx) => {
            errors.push({
              index: baseIndex + idx,
              error: (error as Error).message,
              record,
            });
          });
        }
      }

      const result: IBulkOperationResult<T> = {
        success: errors.length === 0,
        operationType: BulkOperationType.UPSERT,
        totalRecords: dto.records.length,
        successCount: results.length,
        failureCount: errors.length,
        skippedCount: dto.records.length - results.length - errors.length,
        data: results,
        errors,
        duration: Date.now() - startTime,
      };

      endLog();
      return result;
    } catch (error) {
      logError(this.logger, 'bulkUpsert', error as Error);
      throw new InternalServerError('Bulk upsert failed');
    }
  }

  /**
   * Bulk insert with progress callback
   * @param model - Sequelize model class
   * @param records - Records to insert
   * @param onProgress - Progress callback
   * @param options - Bulk operation options
   * @returns Bulk operation result
   */
  async bulkInsertWithProgress<T extends Model>(
    model: typeof Model,
    records: any[],
    onProgress: ProgressCallback,
    options: IBulkInsertOptions = {},
  ): Promise<IBulkOperationResult<T>> {
    const startTime = Date.now();
    const errors: Array<{ index: number; error: string; record?: any }> = [];
    const inserted: T[] = [];
    const chunks = this.chunkArray(records, options.chunkSize || 1000);

    for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
      const chunk = chunks[chunkIndex];

      try {
        const chunkRecords = await model.bulkCreate(chunk, {
          validate: options.validateBeforeInsert,
          returning: true,
          ignoreDuplicates: options.ignoreDuplicates,
        }) as T[];

        inserted.push(...chunkRecords);

        const current = (chunkIndex + 1) * chunk.length;
        const total = records.length;

        onProgress({
          current,
          total,
          percentage: Math.floor((current / total) * 100),
          status: BulkOperationStatus.PROCESSING,
        });
      } catch (error) {
        const baseIndex = chunkIndex * (options.chunkSize || 1000);
        chunk.forEach((record, idx) => {
          errors.push({
            index: baseIndex + idx,
            error: (error as Error).message,
            record,
          });
        });

        if (options.validationStrategy === ValidationStrategy.STRICT) {
          throw error;
        }
      }
    }

    onProgress({
      current: records.length,
      total: records.length,
      percentage: 100,
      status: errors.length === 0 ? BulkOperationStatus.COMPLETED : BulkOperationStatus.PARTIAL,
    });

    return {
      success: errors.length === 0,
      operationType: BulkOperationType.INSERT,
      totalRecords: records.length,
      successCount: inserted.length,
      failureCount: errors.length,
      skippedCount: records.length - inserted.length - errors.length,
      data: inserted,
      errors,
      duration: Date.now() - startTime,
    };
  }

  /**
   * Bulk insert in transaction
   * @param model - Sequelize model class
   * @param records - Records to insert
   * @param options - Bulk operation options
   * @returns Bulk operation result
   */
  async bulkInsertInTransaction<T extends Model>(
    model: typeof Model,
    records: any[],
    options: IBulkInsertOptions = {},
  ): Promise<IBulkOperationResult<T>> {
    const txResult = await this.transactionService.executeInTransaction(
      async (transaction) => {
        const inserted = await model.bulkCreate(records, {
          validate: options.validateBeforeInsert,
          returning: true,
          ignoreDuplicates: options.ignoreDuplicates,
          updateOnDuplicate: options.updateOnDuplicate,
          transaction,
        }) as T[];

        return inserted;
      },
      { isolationLevel: TransactionIsolationLevel.READ_COMMITTED },
    );

    return {
      success: txResult.success,
      operationType: BulkOperationType.INSERT,
      totalRecords: records.length,
      successCount: txResult.data?.length || 0,
      failureCount: txResult.success ? 0 : records.length,
      skippedCount: 0,
      data: txResult.data,
      errors: txResult.error ? [{ index: 0, error: txResult.error.message }] : [],
      duration: txResult.duration,
      transactionId: txResult.transactionId,
    };
  }

  /**
   * Bulk update in transaction
   * @param model - Sequelize model class
   * @param values - Values to update
   * @param where - Where conditions
   * @param options - Bulk operation options
   * @returns Bulk operation result
   */
  async bulkUpdateInTransaction<T extends Model>(
    model: typeof Model,
    values: any,
    where: any,
    options: IBulkUpdateOptions = {},
  ): Promise<IBulkOperationResult> {
    const txResult = await this.transactionService.executeInTransaction(
      async (transaction) => {
        const [affectedCount] = await model.update(values, {
          where,
          transaction,
        });

        return affectedCount;
      },
    );

    return {
      success: txResult.success,
      operationType: BulkOperationType.UPDATE,
      totalRecords: txResult.data || 0,
      successCount: txResult.data || 0,
      failureCount: txResult.success ? 0 : 1,
      skippedCount: 0,
      errors: txResult.error ? [{ index: 0, error: txResult.error.message }] : [],
      duration: txResult.duration,
      transactionId: txResult.transactionId,
    };
  }

  /**
   * Bulk delete in transaction
   * @param model - Sequelize model class
   * @param where - Where conditions
   * @param options - Bulk delete options
   * @returns Bulk operation result
   */
  async bulkDeleteInTransaction<T extends Model>(
    model: typeof Model,
    where: any,
    options: IBulkDeleteOptions = {},
  ): Promise<IBulkOperationResult> {
    const txResult = await this.transactionService.executeInTransaction(
      async (transaction) => {
        const deletedCount = await model.destroy({
          where,
          force: options.force,
          transaction,
        });

        return deletedCount;
      },
    );

    return {
      success: txResult.success,
      operationType: BulkOperationType.DELETE,
      totalRecords: txResult.data || 0,
      successCount: txResult.data || 0,
      failureCount: txResult.success ? 0 : 1,
      skippedCount: 0,
      errors: txResult.error ? [{ index: 0, error: txResult.error.message }] : [],
      duration: txResult.duration,
      transactionId: txResult.transactionId,
    };
  }

  /**
   * Validate records before bulk operation
   * @param records - Records to validate
   * @param validationFn - Validation function
   * @returns Validation result with valid and invalid records
   */
  async validateBulkRecords<T>(
    records: T[],
    validationFn: (record: T) => Promise<boolean>,
  ): Promise<{ valid: T[]; invalid: Array<{ index: number; record: T; reason: string }> }> {
    const valid: T[] = [];
    const invalid: Array<{ index: number; record: T; reason: string }> = [];

    for (let i = 0; i < records.length; i++) {
      try {
        const isValid = await validationFn(records[i]);
        if (isValid) {
          valid.push(records[i]);
        } else {
          invalid.push({ index: i, record: records[i], reason: 'Validation failed' });
        }
      } catch (error) {
        invalid.push({ index: i, record: records[i], reason: (error as Error).message });
      }
    }

    this.logger.log(`Validation completed: ${valid.length} valid, ${invalid.length} invalid`);
    return { valid, invalid };
  }

  /**
   * Bulk insert with conflict handling
   * @param model - Sequelize model class
   * @param records - Records to insert
   * @param conflictResolution - Conflict resolution strategy
   * @param options - Bulk operation options
   * @returns Bulk operation result
   */
  async bulkInsertWithConflictHandling<T extends Model>(
    model: typeof Model,
    records: any[],
    conflictResolution: ConflictResolution,
    options: IBulkInsertOptions = {},
  ): Promise<IBulkOperationResult<T>> {
    const startTime = Date.now();

    switch (conflictResolution) {
      case ConflictResolution.SKIP:
        return this.bulkInsert(model, {
          records,
          ignoreDuplicates: true,
          ...options,
        });

      case ConflictResolution.UPDATE:
        return this.bulkUpsert(model, {
          records,
          conflictFields: options.updateOnDuplicate || [],
          ...options,
        });

      case ConflictResolution.REPLACE:
        // Delete existing and insert new
        for (const record of records) {
          await model.destroy({ where: { id: record.id } });
        }
        return this.bulkInsert(model, { records, ...options });

      case ConflictResolution.FAIL:
      default:
        return this.bulkInsert(model, { records, ignoreDuplicates: false, ...options });
    }
  }

  /**
   * Bulk update by IDs
   * @param model - Sequelize model class
   * @param ids - Array of record IDs
   * @param values - Values to update
   * @param options - Bulk operation options
   * @returns Bulk operation result
   */
  async bulkUpdateByIds<T extends Model>(
    model: typeof Model,
    ids: string[],
    values: any,
    options: IBulkOperationOptions = {},
  ): Promise<IBulkOperationResult> {
    const chunks = this.chunkArray(ids, options.chunkSize || 1000);
    let totalUpdated = 0;
    const errors: Array<{ index: number; error: string; record?: any }> = [];

    for (const chunk of chunks) {
      try {
        const [affectedCount] = await model.update(values, {
          where: { id: { [Op.in]: chunk } },
          transaction: options.transaction,
        });
        totalUpdated += affectedCount;
      } catch (error) {
        errors.push({ index: 0, error: (error as Error).message, record: chunk });
      }
    }

    return {
      success: errors.length === 0,
      operationType: BulkOperationType.UPDATE,
      totalRecords: ids.length,
      successCount: totalUpdated,
      failureCount: errors.length,
      skippedCount: ids.length - totalUpdated - errors.length,
      errors,
      duration: 0,
    };
  }

  /**
   * Bulk delete by IDs
   * @param model - Sequelize model class
   * @param ids - Array of record IDs
   * @param options - Bulk delete options
   * @returns Bulk operation result
   */
  async bulkDeleteByIds<T extends Model>(
    model: typeof Model,
    ids: string[],
    options: IBulkDeleteOptions = {},
  ): Promise<IBulkOperationResult> {
    const chunks = this.chunkArray(ids, options.chunkSize || 1000);
    let totalDeleted = 0;
    const errors: Array<{ index: number; error: string; record?: any }> = [];

    for (const chunk of chunks) {
      try {
        const deletedCount = await model.destroy({
          where: { id: { [Op.in]: chunk } },
          force: options.force,
          transaction: options.transaction,
        });
        totalDeleted += deletedCount;
      } catch (error) {
        errors.push({ index: 0, error: (error as Error).message, record: chunk });
      }
    }

    return {
      success: errors.length === 0,
      operationType: BulkOperationType.DELETE,
      totalRecords: ids.length,
      successCount: totalDeleted,
      failureCount: errors.length,
      skippedCount: ids.length - totalDeleted - errors.length,
      errors,
      duration: 0,
    };
  }

  /**
   * Bulk restore soft deleted records
   * @param model - Sequelize model class
   * @param where - Where conditions
   * @param options - Bulk operation options
   * @returns Bulk operation result
   */
  async bulkRestore<T extends Model>(
    model: typeof Model,
    where: any,
    options: IBulkOperationOptions = {},
  ): Promise<IBulkOperationResult> {
    const [affectedCount] = await model.update(
      { deletedAt: null },
      {
        where: { ...where, deletedAt: { [Op.ne]: null } },
        transaction: options.transaction,
      },
    );

    return {
      success: true,
      operationType: BulkOperationType.UPDATE,
      totalRecords: affectedCount,
      successCount: affectedCount,
      failureCount: 0,
      skippedCount: 0,
      errors: [],
      duration: 0,
    };
  }

  /**
   * Count records matching criteria
   * @param model - Sequelize model class
   * @param where - Where conditions
   * @returns Record count
   */
  async bulkCount(model: typeof Model, where: any = {}): Promise<number> {
    return model.count({ where });
  }

  /**
   * Bulk exists check
   * @param model - Sequelize model class
   * @param ids - Array of record IDs
   * @returns Map of ID to existence status
   */
  async bulkExists(
    model: typeof Model,
    ids: string[],
  ): Promise<Map<string, boolean>> {
    const results = new Map<string, boolean>();
    const chunks = this.chunkArray(ids, 1000);

    for (const chunk of chunks) {
      const existing = await model.findAll({
        where: { id: { [Op.in]: chunk } },
        attributes: ['id'],
      });

      const existingIds = new Set(existing.map(r => (r as any).id));
      chunk.forEach(id => results.set(id, existingIds.has(id)));
    }

    return results;
  }

  /**
   * Bulk find by IDs with relations
   * @param model - Sequelize model class
   * @param ids - Array of record IDs
   * @param include - Relations to include
   * @returns Array of records
   */
  async bulkFindByIds<T extends Model>(
    model: typeof Model,
    ids: string[],
    include?: any[],
  ): Promise<T[]> {
    const chunks = this.chunkArray(ids, 1000);
    const results: T[] = [];

    for (const chunk of chunks) {
      const records = await model.findAll({
        where: { id: { [Op.in]: chunk } },
        include,
      }) as T[];

      results.push(...records);
    }

    return results;
  }

  /**
   * Estimate bulk operation duration
   * @param recordCount - Number of records
   * @param operationType - Type of operation
   * @returns Estimated duration in milliseconds
   */
  estimateBulkOperationDuration(
    recordCount: number,
    operationType: BulkOperationType,
  ): number {
    const baseTimePerRecord = {
      [BulkOperationType.INSERT]: 1,
      [BulkOperationType.UPDATE]: 0.5,
      [BulkOperationType.DELETE]: 0.3,
      [BulkOperationType.UPSERT]: 1.5,
      [BulkOperationType.SOFT_DELETE]: 0.5,
    };

    return recordCount * baseTimePerRecord[operationType];
  }

  /**
   * Get optimal chunk size for operation
   * @param totalRecords - Total number of records
   * @param operationType - Type of operation
   * @returns Optimal chunk size
   */
  getOptimalChunkSize(totalRecords: number, operationType: BulkOperationType): number {
    if (totalRecords < 1000) return totalRecords;
    if (totalRecords < 10000) return 1000;
    if (totalRecords < 100000) return 5000;
    return 10000;
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  /**
   * Split array into chunks
   */
  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  BulkOperationsService,
  IBulkOperationResult,
  IBulkOperationOptions,
  IBulkInsertOptions,
  IBulkUpdateOptions,
  IBulkDeleteOptions,
  ProgressCallback,
};
