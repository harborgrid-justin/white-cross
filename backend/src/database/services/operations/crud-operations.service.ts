/**
 * @fileoverview CRUD Operations Service for Database Operations
 * @module @/database/services/operations/crud-operations
 * @description Enhanced CRUD operations with audit trails, version control, and soft delete support
 *
 * @version 1.0.0
 */

import { Logger, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import {
  Model,
  ModelCtor,
  CreateOptions,
  Transaction,
  IncludeOptions,
  FindOptions,
  Attributes,
  BulkCreateOptions,
} from 'sequelize';
import type { AuditMetadata, SoftDeleteOptions, BatchExecutionResult } from './interfaces';

/**
 * Enhanced model interface for audit fields
 */
interface AuditableModel {
  id: string | number;
  createdBy?: string;
  createdAt?: Date;
  updatedBy?: string;
  updatedAt?: Date;
  deletedAt?: Date | null;
  deletedBy?: string;
  deleteReason?: string;
  version?: number;
}

/**
 * Create a single record with full audit trail
 */
export async function createWithAudit<M extends Model>(
  model: ModelCtor<M>,
  data: Partial<Attributes<M>>,
  audit: AuditMetadata,
  options?: CreateOptions<Attributes<M>>
): Promise<M> {
  const logger = new Logger('CrudOperations::createWithAudit');

  try {
    const recordData = {
      ...data,
      createdBy: audit.userId,
      createdAt: audit.timestamp,
    } as Partial<Attributes<M>>;

    const record = await model.create(recordData as any, options);

    logger.log(`Created ${model.name} record: ${(record as unknown as AuditableModel).id} by user ${audit.userId}`);

    return record;
  } catch (error) {
    logger.error(`Failed to create ${model.name} record`, error);

    if ((error as Error & { name?: string }).name === 'SequelizeValidationError') {
      throw new BadRequestException(`Validation failed: ${(error as Error).message}`);
    }

    throw new InternalServerErrorException(`Failed to create ${model.name} record`);
  }
}

/**
 * Update a single record with audit trail and version control
 */
export async function updateWithAudit<M extends Model>(
  model: ModelCtor<M>,
  id: string | number,
  data: Partial<Attributes<M>>,
  audit: AuditMetadata,
  options?: { transaction?: Transaction; incrementVersion?: boolean }
): Promise<M> {
  const logger = new Logger('CrudOperations::updateWithAudit');

  try {
    const record = await model.findByPk(id, { transaction: options?.transaction });

    if (!record) {
      throw new NotFoundException(`${model.name} record with ID ${id} not found`);
    }

    const updateData = {
      ...data,
      updatedBy: audit.userId,
      updatedAt: audit.timestamp,
    } as Partial<Attributes<M>>;

    if (options?.incrementVersion && 'version' in record) {
      (updateData as AuditableModel).version = ((record as unknown as AuditableModel).version || 0) + 1;
    }

    await record.update(updateData, { transaction: options?.transaction });

    logger.log(`Updated ${model.name} record: ${id} by user ${audit.userId}`);

    return record;
  } catch (error) {
    if (error instanceof NotFoundException) {
      throw error;
    }

    logger.error(`Failed to update ${model.name} record ${id}`, error);
    throw new InternalServerErrorException(`Failed to update ${model.name} record`);
  }
}

/**
 * Soft delete a record (set deletedAt timestamp)
 */
export async function softDelete<M extends Model>(
  model: ModelCtor<M>,
  id: string | number,
  options?: SoftDeleteOptions
): Promise<M> {
  const logger = new Logger('CrudOperations::softDelete');

  try {
    const record = await model.findByPk(id, {
      transaction: options?.transaction,
      paranoid: false
    });

    if (!record) {
      throw new NotFoundException(`${model.name} record with ID ${id} not found`);
    }

    const recordData = record as unknown as AuditableModel;
    if (recordData.deletedAt) {
      throw new BadRequestException(`${model.name} record ${id} is already deleted`);
    }

    const deleteData: Partial<AuditableModel> = {
      deletedAt: new Date(),
    };

    if (options?.deletedBy) {
      deleteData.deletedBy = options.deletedBy;
    }

    if (options?.deleteReason) {
      deleteData.deleteReason = options.deleteReason;
    }

    await record.update(deleteData as Partial<Attributes<M>>, { transaction: options?.transaction });

    logger.log(`Soft deleted ${model.name} record: ${id}`);

    return record;
  } catch (error) {
    logger.error(`Soft delete failed for ${model.name} ${id}`, error);
    throw error;
  }
}

/**
 * Restore a soft-deleted record
 */
export async function restoreRecord<M extends Model>(
  model: ModelCtor<M>,
  id: string | number,
  audit: AuditMetadata,
  options?: { transaction?: Transaction }
): Promise<M> {
  const logger = new Logger('CrudOperations::restoreRecord');

  try {
    const record = await model.findByPk(id, {
      transaction: options?.transaction,
      paranoid: false
    });

    if (!record) {
      throw new NotFoundException(`${model.name} record with ID ${id} not found`);
    }

    const recordData = record as unknown as AuditableModel;
    if (!recordData.deletedAt) {
      throw new BadRequestException(`${model.name} record ${id} is not deleted`);
    }

    const restoreData: Partial<AuditableModel> = {
      deletedAt: null,
      deletedBy: undefined,
      deleteReason: undefined,
      updatedBy: audit.userId,
      updatedAt: audit.timestamp,
    };

    await record.update(restoreData as Partial<Attributes<M>>, { transaction: options?.transaction });

    logger.log(`Restored ${model.name} record: ${id} by user ${audit.userId}`);

    return record;
  } catch (error) {
    logger.error(`Restore failed for ${model.name} ${id}`, error);
    throw error;
  }
}

/**
 * Batch create records with validation and error tracking
 */
export async function batchCreateWithAudit<M extends Model>(
  model: ModelCtor<M>,
  records: Partial<Attributes<M>>[],
  audit: AuditMetadata,
  options?: BulkCreateOptions<Attributes<M>>
): Promise<BatchExecutionResult<M>> {
  const logger = new Logger('CrudOperations::batchCreateWithAudit');
  const startTime = Date.now();

  const result: BatchExecutionResult<M> = {
    success: false,
    totalBatches: 1,
    successfulBatches: 0,
    failedBatches: 0,
    results: [],
    errors: [],
    executionTimeMs: 0,
    averageBatchTimeMs: 0,
    throughput: 0
  };

  try {
    const recordsWithAudit = records.map(record => ({
      ...record,
      createdBy: audit.userId,
      createdAt: audit.timestamp,
    }));

    const created = await model.bulkCreate(recordsWithAudit as any, {
      validate: true,
      individualHooks: false,
      returning: true,
      ...options
    });

    result.results = created;
    result.successfulBatches = 1;
    result.success = true;

    logger.log(`Batch created ${created.length} ${model.name} records`);
  } catch (error) {
    logger.error(`Batch create failed for ${model.name}`, error);
    result.failedBatches = 1;
    result.errors.push({
      batchIndex: -1,
      error: (error as Error).message,
    });
  }

  result.executionTimeMs = Date.now() - startTime;
  result.averageBatchTimeMs = result.executionTimeMs;
  result.throughput = result.results.length > 0 ? (result.results.length / result.executionTimeMs) * 1000 : 0;

  return result;
}

/**
 * Find records with eager loading to prevent N+1 queries
 */
export async function findWithIncludes<M extends Model>(
  model: ModelCtor<M>,
  where: Parameters<typeof model.findAll>[0]['where'],
  include: IncludeOptions[],
  options?: {
    attributes?: string[];
    order?: Parameters<typeof model.findAll>[0]['order'];
    limit?: number;
    offset?: number;
    transaction?: Transaction;
  }
): Promise<M[]> {
  const logger = new Logger('CrudOperations::findWithIncludes');

  try {
    return await model.findAll({
      where,
      include,
      attributes: options?.attributes,
      order: options?.order,
      limit: options?.limit,
      offset: options?.offset,
      transaction: options?.transaction,
      subQuery: false,
      distinct: options?.limit || options?.offset ? true : undefined,
    } as FindOptions<Attributes<M>>);
  } catch (error) {
    logger.error(`Find with includes failed for ${model.name}`, error);
    throw new InternalServerErrorException(`Failed to fetch ${model.name} records with associations`);
  }
}

/**
 * Find a single record with includes and error handling
 */
export async function findOneWithIncludes<M extends Model>(
  model: ModelCtor<M>,
  where: Parameters<typeof model.findOne>[0]['where'],
  include: IncludeOptions[],
  options?: {
    attributes?: string[];
    transaction?: Transaction;
    paranoid?: boolean;
  }
): Promise<M | null> {
  const logger = new Logger('CrudOperations::findOneWithIncludes');

  try {
    return await model.findOne({
      where,
      include,
      attributes: options?.attributes,
      transaction: options?.transaction,
      paranoid: options?.paranoid,
    } as FindOptions<Attributes<M>>);
  } catch (error) {
    logger.error(`Find one with includes failed for ${model.name}`, error);
    throw new InternalServerErrorException(`Failed to fetch ${model.name} record with associations`);
  }
}

/**
 * Find or create a record with audit trail
 */
export async function findOrCreateWithAudit<M extends Model>(
  model: ModelCtor<M>,
  where: Parameters<typeof model.findOne>[0]['where'],
  defaults: Partial<Attributes<M>>,
  audit: AuditMetadata,
  options?: { transaction?: Transaction }
): Promise<{ record: M; created: boolean }> {
  const logger = new Logger('CrudOperations::findOrCreateWithAudit');

  try {
    const defaultsWithAudit = {
      ...defaults,
      createdBy: audit.userId,
      createdAt: audit.timestamp,
    };

    const [record, created] = await model.findOrCreate({
      where,
      defaults: defaultsWithAudit as any,
      transaction: options?.transaction,
    });

    if (created) {
      logger.log(`Created new ${model.name} record: ${(record as unknown as AuditableModel).id} by user ${audit.userId}`);
    } else {
      logger.log(`Found existing ${model.name} record: ${(record as unknown as AuditableModel).id}`);
    }

    return { record, created };
  } catch (error) {
    logger.error(`Find or create failed for ${model.name}`, error);
    throw new InternalServerErrorException(`Failed to find or create ${model.name} record`);
  }
}

/**
 * Upsert (update or insert) a record with audit trail
 */
export async function upsertWithAudit<M extends Model>(
  model: ModelCtor<M>,
  data: Partial<Attributes<M>>,
  audit: AuditMetadata,
  options?: { transaction?: Transaction }
): Promise<{ record: M; created: boolean }> {
  const logger = new Logger('CrudOperations::upsertWithAudit');

  try {
    const dataWithAudit = {
      ...data,
      createdBy: audit.userId,
      createdAt: audit.timestamp,
      updatedBy: audit.userId,
      updatedAt: audit.timestamp,
    };

    const [record, created] = await model.upsert(dataWithAudit as any, {
      transaction: options?.transaction,
      returning: true,
    });

    const action = created ? 'Created' : 'Updated';
    logger.log(`${action} ${model.name} record: ${(record as unknown as AuditableModel).id} by user ${audit.userId}`);

    return { record, created };
  } catch (error) {
    logger.error(`Upsert failed for ${model.name}`, error);
    throw new InternalServerErrorException(`Failed to upsert ${model.name} record`);
  }
}

/**
 * Get record count with where conditions
 */
export async function getCount<M extends Model>(
  model: ModelCtor<M>,
  where?: Parameters<typeof model.count>[0]['where'],
  options?: {
    include?: IncludeOptions[];
    transaction?: Transaction;
    paranoid?: boolean;
  }
): Promise<number> {
  const logger = new Logger('CrudOperations::getCount');

  try {
    return await model.count({
      where,
      include: options?.include,
      transaction: options?.transaction,
      paranoid: options?.paranoid,
      distinct: options?.include ? true : undefined,
    });
  } catch (error) {
    logger.error(`Count failed for ${model.name}`, error);
    throw new InternalServerErrorException(`Failed to count ${model.name} records`);
  }
}

/**
 * Check if a record exists
 */
export async function exists<M extends Model>(
  model: ModelCtor<M>,
  where: Parameters<typeof model.findOne>[0]['where'],
  options?: {
    transaction?: Transaction;
    paranoid?: boolean;
  }
): Promise<boolean> {
  const logger = new Logger('CrudOperations::exists');

  try {
    const record = await model.findOne({
      where,
      attributes: ['id'],
      transaction: options?.transaction,
      paranoid: options?.paranoid,
    });

    return record !== null;
  } catch (error) {
    logger.error(`Exists check failed for ${model.name}`, error);
    throw new InternalServerErrorException(`Failed to check if ${model.name} record exists`);
  }
}
