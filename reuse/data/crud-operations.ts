/**
 * @fileoverview Advanced CRUD Operations for Sequelize + NestJS
 * @module reuse/data/crud-operations
 * @description Production-ready CRUD operations with batch processing, audit trails,
 * soft deletes, version control, and enterprise-grade error handling
 *
 * @version 1.0.0
 * @requires sequelize ^6.x
 * @requires @nestjs/common ^10.x
 * @requires sequelize-typescript ^2.x
 */

import { Logger, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import {
  Model,
  ModelCtor,
  Transaction,
  FindOptions,
  CreateOptions,
  UpdateOptions,
  DestroyOptions,
  BulkCreateOptions,
  Sequelize,
  Op,
  WhereOptions,
  Attributes,
  CreationAttributes
} from 'sequelize';
import { Model as SequelizeTypescriptModel } from 'sequelize-typescript';

/**
 * Audit trail metadata for tracking changes
 */
export interface AuditMetadata {
  userId?: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'RESTORE' | 'ARCHIVE';
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  reason?: string;
  metadata?: Record<string, any>;
}

/**
 * Batch operation result with detailed metrics
 */
export interface BatchOperationResult<T> {
  success: boolean;
  totalRecords: number;
  successCount: number;
  failureCount: number;
  results: T[];
  errors: Array<{ index: number; error: string; data?: any }>;
  executionTimeMs: number;
}

/**
 * Soft delete options
 */
export interface SoftDeleteOptions {
  deletedBy?: string;
  deleteReason?: string;
  cascade?: boolean;
  transaction?: Transaction;
}

/**
 * Version control metadata
 */
export interface VersionMetadata {
  version: number;
  previousVersion?: number;
  changeDescription?: string;
  changedFields?: string[];
}

/**
 * Create a single record with full audit trail
 *
 * @param model - Sequelize model class
 * @param data - Record data to create
 * @param audit - Audit metadata
 * @param options - Creation options including transaction
 * @returns Created record instance
 * @throws BadRequestException if validation fails
 * @throws InternalServerErrorException if database operation fails
 */
export async function createWithAudit<M extends Model>(
  model: ModelCtor<M>,
  data: any,
  audit: AuditMetadata,
  options?: CreateOptions<Attributes<M>>
): Promise<M> {
  const logger = new Logger('CrudOperations::createWithAudit');

  try {
    const recordData = {
      ...data,
      createdBy: audit.userId,
      createdAt: audit.timestamp,
    };

    const record = await model.create(recordData as any, options);

    logger.log(`Created ${model.name} record: ${(record as any).id} by user ${audit.userId}`);

    return record;
  } catch (error) {
    logger.error(`Failed to create ${model.name} record`, error);

    if ((error as any).name === 'SequelizeValidationError') {
      throw new BadRequestException(`Validation failed: ${(error as any).message}`);
    }

    throw new InternalServerErrorException(`Failed to create ${model.name} record`);
  }
}

/**
 * Update a single record with audit trail and version control
 *
 * @param model - Sequelize model class
 * @param id - Record ID
 * @param data - Update data
 * @param audit - Audit metadata
 * @param options - Update options including transaction
 * @returns Updated record instance
 * @throws NotFoundException if record not found
 */
export async function updateWithAudit<M extends Model>(
  model: ModelCtor<M>,
  id: string,
  data: Partial<any>,
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
    };

    // Increment version if enabled
    if (options?.incrementVersion && 'version' in record) {
      (updateData as any).version = ((record as any).version || 0) + 1;
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
 * Conditional update - only update if condition matches
 *
 * @param model - Sequelize model class
 * @param id - Record ID
 * @param data - Update data
 * @param condition - Condition that must be met for update
 * @param audit - Audit metadata
 * @returns Updated record or null if condition not met
 */
export async function conditionalUpdate<M extends Model>(
  model: ModelCtor<M>,
  id: string,
  data: Partial<any>,
  condition: WhereOptions<any>,
  audit: AuditMetadata,
  transaction?: Transaction
): Promise<M | null> {
  const logger = new Logger('CrudOperations::conditionalUpdate');

  try {
    const record = await model.findOne({
      where: { id, ...condition } as any,
      transaction
    });

    if (!record) {
      logger.warn(`Conditional update failed - record ${id} does not meet condition`);
      return null;
    }

    return await updateWithAudit(model, id, data, audit, { transaction });
  } catch (error) {
    logger.error(`Conditional update failed for ${model.name} ${id}`, error);
    throw new InternalServerErrorException('Conditional update failed');
  }
}

/**
 * Selective field update - only update specified fields
 *
 * @param model - Sequelize model class
 * @param id - Record ID
 * @param fields - Fields to update with their values
 * @param audit - Audit metadata
 * @param options - Update options
 * @returns Updated record
 */
export async function selectiveFieldUpdate<M extends Model>(
  model: ModelCtor<M>,
  id: string,
  fields: Record<string, any>,
  audit: AuditMetadata,
  options?: { transaction?: Transaction; validate?: boolean }
): Promise<M> {
  const logger = new Logger('CrudOperations::selectiveFieldUpdate');

  try {
    const record = await model.findByPk(id, { transaction: options?.transaction });

    if (!record) {
      throw new NotFoundException(`${model.name} record with ID ${id} not found`);
    }

    // Only update specified fields
    const updateData: any = {
      updatedBy: audit.userId,
      updatedAt: audit.timestamp,
    };

    Object.keys(fields).forEach(key => {
      if (key in record) {
        updateData[key] = fields[key];
      }
    });

    await record.update(updateData, {
      transaction: options?.transaction,
      validate: options?.validate ?? true,
      fields: [...Object.keys(fields), 'updatedBy', 'updatedAt']
    });

    logger.log(`Selective update on ${model.name} ${id}: ${Object.keys(fields).join(', ')}`);

    return record;
  } catch (error) {
    logger.error(`Selective field update failed for ${model.name} ${id}`, error);
    throw error;
  }
}

/**
 * Soft delete a record (set deletedAt timestamp)
 *
 * @param model - Sequelize model class (must have paranoid: true)
 * @param id - Record ID
 * @param options - Soft delete options
 * @returns Soft-deleted record
 */
export async function softDelete<M extends Model>(
  model: ModelCtor<M>,
  id: string,
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

    // Check if already soft deleted
    if ((record as any).deletedAt) {
      throw new BadRequestException(`${model.name} record ${id} is already deleted`);
    }

    const deleteData: any = {
      deletedAt: new Date(),
    };

    if (options?.deletedBy) {
      deleteData.deletedBy = options.deletedBy;
    }

    if (options?.deleteReason) {
      deleteData.deleteReason = options.deleteReason;
    }

    await record.update(deleteData, { transaction: options?.transaction });

    logger.log(`Soft deleted ${model.name} record: ${id}`);

    return record;
  } catch (error) {
    logger.error(`Soft delete failed for ${model.name} ${id}`, error);
    throw error;
  }
}

/**
 * Restore a soft-deleted record
 *
 * @param model - Sequelize model class
 * @param id - Record ID
 * @param audit - Audit metadata
 * @param transaction - Optional transaction
 * @returns Restored record
 */
export async function restore<M extends Model>(
  model: ModelCtor<M>,
  id: string,
  audit: AuditMetadata,
  transaction?: Transaction
): Promise<M> {
  const logger = new Logger('CrudOperations::restore');

  try {
    const record = await model.findByPk(id, {
      transaction,
      paranoid: false
    });

    if (!record) {
      throw new NotFoundException(`${model.name} record with ID ${id} not found`);
    }

    if (!(record as any).deletedAt) {
      throw new BadRequestException(`${model.name} record ${id} is not deleted`);
    }

    await record.update({
      deletedAt: null,
      restoredBy: audit.userId,
      restoredAt: audit.timestamp,
    }, { transaction });

    logger.log(`Restored ${model.name} record: ${id} by user ${audit.userId}`);

    return record;
  } catch (error) {
    logger.error(`Restore failed for ${model.name} ${id}`, error);
    throw error;
  }
}

/**
 * Archive a record (move to archived state, not deleted)
 *
 * @param model - Sequelize model class
 * @param id - Record ID
 * @param audit - Audit metadata
 * @param options - Archive options
 * @returns Archived record
 */
export async function archive<M extends Model>(
  model: ModelCtor<M>,
  id: string,
  audit: AuditMetadata,
  options?: { transaction?: Transaction; archiveReason?: string }
): Promise<M> {
  const logger = new Logger('CrudOperations::archive');

  try {
    const record = await model.findByPk(id, { transaction: options?.transaction });

    if (!record) {
      throw new NotFoundException(`${model.name} record with ID ${id} not found`);
    }

    await record.update({
      isArchived: true,
      archivedBy: audit.userId,
      archivedAt: audit.timestamp,
      archiveReason: options?.archiveReason,
    }, { transaction: options?.transaction });

    logger.log(`Archived ${model.name} record: ${id}`);

    return record;
  } catch (error) {
    logger.error(`Archive failed for ${model.name} ${id}`, error);
    throw error;
  }
}

/**
 * Unarchive a record
 *
 * @param model - Sequelize model class
 * @param id - Record ID
 * @param audit - Audit metadata
 * @param transaction - Optional transaction
 * @returns Unarchived record
 */
export async function unarchive<M extends Model>(
  model: ModelCtor<M>,
  id: string,
  audit: AuditMetadata,
  transaction?: Transaction
): Promise<M> {
  const logger = new Logger('CrudOperations::unarchive');

  try {
    const record = await model.findByPk(id, { transaction });

    if (!record) {
      throw new NotFoundException(`${model.name} record with ID ${id} not found`);
    }

    await record.update({
      isArchived: false,
      unarchivedBy: audit.userId,
      unarchivedAt: audit.timestamp,
    }, { transaction });

    logger.log(`Unarchived ${model.name} record: ${id}`);

    return record;
  } catch (error) {
    logger.error(`Unarchive failed for ${model.name} ${id}`, error);
    throw error;
  }
}

/**
 * Hard delete a record (permanent removal)
 *
 * @param model - Sequelize model class
 * @param id - Record ID
 * @param audit - Audit metadata (for logging)
 * @param options - Destroy options
 * @returns Success boolean
 */
export async function hardDelete<M extends Model>(
  model: ModelCtor<M>,
  id: string,
  audit: AuditMetadata,
  options?: DestroyOptions<Attributes<M>>
): Promise<boolean> {
  const logger = new Logger('CrudOperations::hardDelete');

  try {
    const destroyed = await model.destroy({
      where: { id } as any,
      force: true, // Bypass paranoid mode
      ...options
    });

    if (destroyed === 0) {
      throw new NotFoundException(`${model.name} record with ID ${id} not found`);
    }

    logger.warn(`Hard deleted ${model.name} record: ${id} by user ${audit.userId}`);

    return true;
  } catch (error) {
    logger.error(`Hard delete failed for ${model.name} ${id}`, error);
    throw error;
  }
}

/**
 * Batch create records with validation and error tracking
 *
 * @param model - Sequelize model class
 * @param records - Array of records to create
 * @param audit - Audit metadata
 * @param options - Bulk create options
 * @returns Batch operation result
 */
export async function batchCreate<M extends Model>(
  model: ModelCtor<M>,
  records: any[],
  audit: AuditMetadata,
  options?: BulkCreateOptions<Attributes<M>>
): Promise<BatchOperationResult<M>> {
  const logger = new Logger('CrudOperations::batchCreate');
  const startTime = Date.now();

  const result: BatchOperationResult<M> = {
    success: false,
    totalRecords: records.length,
    successCount: 0,
    failureCount: 0,
    results: [],
    errors: [],
    executionTimeMs: 0
  };

  try {
    const recordsWithAudit = records.map(record => ({
      ...record,
      createdBy: audit.userId,
      createdAt: audit.timestamp,
    }));

    const created = await model.bulkCreate(recordsWithAudit as any[], {
      validate: true,
      individualHooks: false, // Skip for performance
      returning: true,
      ...options
    });

    result.results = created;
    result.successCount = created.length;
    result.success = true;

    logger.log(`Batch created ${created.length} ${model.name} records`);
  } catch (error) {
    logger.error(`Batch create failed for ${model.name}`, error);
    result.failureCount = records.length;
    result.errors.push({
      index: -1,
      error: (error as Error).message,
    });
  }

  result.executionTimeMs = Date.now() - startTime;
  return result;
}

/**
 * Batch create with individual error tracking (slower but more granular)
 *
 * @param model - Sequelize model class
 * @param records - Array of records to create
 * @param audit - Audit metadata
 * @param transaction - Optional transaction
 * @returns Batch operation result with per-record error tracking
 */
export async function batchCreateIndividual<M extends Model>(
  model: ModelCtor<M>,
  records: any[],
  audit: AuditMetadata,
  transaction?: Transaction
): Promise<BatchOperationResult<M>> {
  const logger = new Logger('CrudOperations::batchCreateIndividual');
  const startTime = Date.now();

  const result: BatchOperationResult<M> = {
    success: false,
    totalRecords: records.length,
    successCount: 0,
    failureCount: 0,
    results: [],
    errors: [],
    executionTimeMs: 0
  };

  for (let i = 0; i < records.length; i++) {
    try {
      const created = await createWithAudit(model, records[i], audit, { transaction });
      result.results.push(created);
      result.successCount++;
    } catch (error) {
      result.failureCount++;
      result.errors.push({
        index: i,
        error: (error as Error).message,
        data: records[i],
      });
    }
  }

  result.success = result.successCount > 0;
  result.executionTimeMs = Date.now() - startTime;

  logger.log(`Batch create: ${result.successCount}/${result.totalRecords} succeeded`);

  return result;
}

/**
 * Batch update records
 *
 * @param model - Sequelize model class
 * @param updates - Array of {id, data} objects
 * @param audit - Audit metadata
 * @param transaction - Optional transaction
 * @returns Batch operation result
 */
export async function batchUpdate<M extends Model>(
  model: ModelCtor<M>,
  updates: Array<{ id: string; data: Partial<any> }>,
  audit: AuditMetadata,
  transaction?: Transaction
): Promise<BatchOperationResult<M>> {
  const logger = new Logger('CrudOperations::batchUpdate');
  const startTime = Date.now();

  const result: BatchOperationResult<M> = {
    success: false,
    totalRecords: updates.length,
    successCount: 0,
    failureCount: 0,
    results: [],
    errors: [],
    executionTimeMs: 0
  };

  for (let i = 0; i < updates.length; i++) {
    const { id, data } = updates[i];

    try {
      const updated = await updateWithAudit(model, id, data, audit, { transaction });
      result.results.push(updated);
      result.successCount++;
    } catch (error) {
      result.failureCount++;
      result.errors.push({
        index: i,
        error: (error as Error).message,
        data: updates[i],
      });
    }
  }

  result.success = result.successCount > 0;
  result.executionTimeMs = Date.now() - startTime;

  logger.log(`Batch update: ${result.successCount}/${result.totalRecords} succeeded`);

  return result;
}

/**
 * Batch soft delete records
 *
 * @param model - Sequelize model class
 * @param ids - Array of record IDs to delete
 * @param options - Soft delete options
 * @returns Batch operation result
 */
export async function batchSoftDelete<M extends Model>(
  model: ModelCtor<M>,
  ids: string[],
  options?: SoftDeleteOptions
): Promise<BatchOperationResult<M>> {
  const logger = new Logger('CrudOperations::batchSoftDelete');
  const startTime = Date.now();

  const result: BatchOperationResult<M> = {
    success: false,
    totalRecords: ids.length,
    successCount: 0,
    failureCount: 0,
    results: [],
    errors: [],
    executionTimeMs: 0
  };

  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];

    try {
      const deleted = await softDelete(model, id, options);
      result.results.push(deleted);
      result.successCount++;
    } catch (error) {
      result.failureCount++;
      result.errors.push({
        index: i,
        error: (error as Error).message,
        data: { id },
      });
    }
  }

  result.success = result.successCount > 0;
  result.executionTimeMs = Date.now() - startTime;

  logger.log(`Batch soft delete: ${result.successCount}/${result.totalRecords} succeeded`);

  return result;
}

/**
 * Cascade delete - delete record and related records
 *
 * @param model - Sequelize model class
 * @param id - Record ID
 * @param relatedModels - Array of related model configurations
 * @param audit - Audit metadata
 * @param transaction - Optional transaction
 * @returns Success boolean
 */
export async function cascadeDelete<M extends Model>(
  model: ModelCtor<M>,
  id: string,
  relatedModels: Array<{
    model: ModelCtor<any>;
    foreignKey: string;
    softDelete?: boolean;
  }>,
  audit: AuditMetadata,
  transaction?: Transaction
): Promise<boolean> {
  const logger = new Logger('CrudOperations::cascadeDelete');

  try {
    // Delete related records first
    for (const related of relatedModels) {
      const where = { [related.foreignKey]: id };

      if (related.softDelete) {
        await related.model.update(
          { deletedAt: new Date(), deletedBy: audit.userId },
          { where, transaction } as any
        );
      } else {
        await related.model.destroy({ where, transaction, force: true } as any);
      }
    }

    // Delete main record
    await softDelete(model, id, {
      deletedBy: audit.userId,
      transaction
    });

    logger.log(`Cascade deleted ${model.name} ${id} and ${relatedModels.length} related models`);

    return true;
  } catch (error) {
    logger.error(`Cascade delete failed for ${model.name} ${id}`, error);
    throw error;
  }
}

/**
 * Upsert (insert or update) a record
 *
 * @param model - Sequelize model class
 * @param data - Record data
 * @param uniqueKeys - Array of fields that identify unique record
 * @param audit - Audit metadata
 * @param transaction - Optional transaction
 * @returns Upserted record and boolean indicating if created (true) or updated (false)
 */
export async function upsert<M extends Model>(
  model: ModelCtor<M>,
  data: any,
  uniqueKeys: string[],
  audit: AuditMetadata,
  transaction?: Transaction
): Promise<{ record: M; created: boolean }> {
  const logger = new Logger('CrudOperations::upsert');

  try {
    const where: any = {};
    uniqueKeys.forEach(key => {
      if (data[key]) {
        where[key] = data[key];
      }
    });

    const existing = await model.findOne({ where, transaction });

    if (existing) {
      const updated = await updateWithAudit(
        model,
        (existing as any).id,
        data,
        audit,
        { transaction }
      );

      logger.log(`Upserted (updated) ${model.name} record`);
      return { record: updated, created: false };
    } else {
      const created = await createWithAudit(model, data, audit, { transaction });
      logger.log(`Upserted (created) ${model.name} record`);
      return { record: created, created: true };
    }
  } catch (error) {
    logger.error(`Upsert failed for ${model.name}`, error);
    throw error;
  }
}

/**
 * Bulk upsert records
 *
 * @param model - Sequelize model class
 * @param records - Array of records to upsert
 * @param conflictFields - Fields that determine uniqueness
 * @param audit - Audit metadata
 * @param transaction - Optional transaction
 * @returns Batch operation result
 */
export async function bulkUpsert<M extends Model>(
  model: ModelCtor<M>,
  records: any[],
  conflictFields: string[],
  audit: AuditMetadata,
  transaction?: Transaction
): Promise<BatchOperationResult<M>> {
  const logger = new Logger('CrudOperations::bulkUpsert');
  const startTime = Date.now();

  const result: BatchOperationResult<M> = {
    success: false,
    totalRecords: records.length,
    successCount: 0,
    failureCount: 0,
    results: [],
    errors: [],
    executionTimeMs: 0
  };

  for (let i = 0; i < records.length; i++) {
    try {
      const { record } = await upsert(model, records[i], conflictFields, audit, transaction);
      result.results.push(record);
      result.successCount++;
    } catch (error) {
      result.failureCount++;
      result.errors.push({
        index: i,
        error: (error as Error).message,
        data: records[i],
      });
    }
  }

  result.success = result.successCount > 0;
  result.executionTimeMs = Date.now() - startTime;

  logger.log(`Bulk upsert: ${result.successCount}/${result.totalRecords} succeeded`);

  return result;
}

/**
 * Create a versioned record with version tracking
 *
 * @param model - Sequelize model class
 * @param data - Record data
 * @param versionMeta - Version metadata
 * @param audit - Audit metadata
 * @param transaction - Optional transaction
 * @returns Created record with version
 */
export async function createVersioned<M extends Model>(
  model: ModelCtor<M>,
  data: any,
  versionMeta: Omit<VersionMetadata, 'version'>,
  audit: AuditMetadata,
  transaction?: Transaction
): Promise<M> {
  const logger = new Logger('CrudOperations::createVersioned');

  try {
    const versionedData = {
      ...data,
      version: 1,
      versionMetadata: versionMeta,
    };

    const record = await createWithAudit(model, versionedData, audit, { transaction });

    logger.log(`Created versioned ${model.name} record v1`);

    return record;
  } catch (error) {
    logger.error(`Failed to create versioned ${model.name}`, error);
    throw error;
  }
}

/**
 * Update a versioned record with version increment
 *
 * @param model - Sequelize model class
 * @param id - Record ID
 * @param data - Update data
 * @param versionMeta - Version metadata
 * @param audit - Audit metadata
 * @param transaction - Optional transaction
 * @returns Updated record with new version
 */
export async function updateVersioned<M extends Model>(
  model: ModelCtor<M>,
  id: string,
  data: Partial<any>,
  versionMeta: Omit<VersionMetadata, 'version'>,
  audit: AuditMetadata,
  transaction?: Transaction
): Promise<M> {
  const logger = new Logger('CrudOperations::updateVersioned');

  try {
    const record = await model.findByPk(id, { transaction });

    if (!record) {
      throw new NotFoundException(`${model.name} record with ID ${id} not found`);
    }

    const currentVersion = (record as any).version || 0;
    const newVersion = currentVersion + 1;

    const versionedData = {
      ...data,
      version: newVersion,
      versionMetadata: {
        ...versionMeta,
        version: newVersion,
        previousVersion: currentVersion,
      },
    };

    const updated = await updateWithAudit(model, id, versionedData, audit, { transaction });

    logger.log(`Updated versioned ${model.name} record to v${newVersion}`);

    return updated;
  } catch (error) {
    logger.error(`Failed to update versioned ${model.name} ${id}`, error);
    throw error;
  }
}

/**
 * Find or create a record atomically
 *
 * @param model - Sequelize model class
 * @param where - Where clause for finding
 * @param defaults - Default values for creation
 * @param audit - Audit metadata
 * @param transaction - Optional transaction
 * @returns Found or created record and boolean indicating if created
 */
export async function findOrCreate<M extends Model>(
  model: ModelCtor<M>,
  where: WhereOptions<any>,
  defaults: any,
  audit: AuditMetadata,
  transaction?: Transaction
): Promise<{ record: M; created: boolean }> {
  const logger = new Logger('CrudOperations::findOrCreate');

  try {
    const [record, created] = await model.findOrCreate({
      where,
      defaults: {
        ...defaults,
        createdBy: audit.userId,
        createdAt: audit.timestamp,
      },
      transaction
    } as any);

    logger.log(`FindOrCreate ${model.name}: ${created ? 'created' : 'found'}`);

    return { record, created };
  } catch (error) {
    logger.error(`FindOrCreate failed for ${model.name}`, error);
    throw error;
  }
}

/**
 * Count records with conditions
 *
 * @param model - Sequelize model class
 * @param where - Where conditions
 * @param transaction - Optional transaction
 * @returns Count of matching records
 */
export async function count<M extends Model>(
  model: ModelCtor<M>,
  where?: WhereOptions<any>,
  transaction?: Transaction
): Promise<number> {
  try {
    return await model.count({ where, transaction } as any);
  } catch (error) {
    const logger = new Logger('CrudOperations::count');
    logger.error(`Count failed for ${model.name}`, error);
    throw error;
  }
}

/**
 * Check if record exists
 *
 * @param model - Sequelize model class
 * @param where - Where conditions
 * @param transaction - Optional transaction
 * @returns Boolean indicating existence
 */
export async function exists<M extends Model>(
  model: ModelCtor<M>,
  where: WhereOptions<any>,
  transaction?: Transaction
): Promise<boolean> {
  try {
    const count = await model.count({ where, transaction } as any);
    return count > 0;
  } catch (error) {
    const logger = new Logger('CrudOperations::exists');
    logger.error(`Exists check failed for ${model.name}`, error);
    throw error;
  }
}

/**
 * Increment a numeric field atomically
 *
 * @param model - Sequelize model class
 * @param id - Record ID
 * @param field - Field to increment
 * @param amount - Amount to increment (default: 1)
 * @param transaction - Optional transaction
 * @returns Updated record
 */
export async function increment<M extends Model>(
  model: ModelCtor<M>,
  id: string,
  field: string,
  amount: number = 1,
  transaction?: Transaction
): Promise<M> {
  const logger = new Logger('CrudOperations::increment');

  try {
    const record = await model.findByPk(id, { transaction });

    if (!record) {
      throw new NotFoundException(`${model.name} record with ID ${id} not found`);
    }

    await record.increment(field, { by: amount, transaction } as any);
    await record.reload({ transaction });

    logger.log(`Incremented ${field} by ${amount} for ${model.name} ${id}`);

    return record;
  } catch (error) {
    logger.error(`Increment failed for ${model.name} ${id}`, error);
    throw error;
  }
}

/**
 * Decrement a numeric field atomically
 *
 * @param model - Sequelize model class
 * @param id - Record ID
 * @param field - Field to decrement
 * @param amount - Amount to decrement (default: 1)
 * @param transaction - Optional transaction
 * @returns Updated record
 */
export async function decrement<M extends Model>(
  model: ModelCtor<M>,
  id: string,
  field: string,
  amount: number = 1,
  transaction?: Transaction
): Promise<M> {
  const logger = new Logger('CrudOperations::decrement');

  try {
    const record = await model.findByPk(id, { transaction });

    if (!record) {
      throw new NotFoundException(`${model.name} record with ID ${id} not found`);
    }

    await record.decrement(field, { by: amount, transaction } as any);
    await record.reload({ transaction });

    logger.log(`Decremented ${field} by ${amount} for ${model.name} ${id}`);

    return record;
  } catch (error) {
    logger.error(`Decrement failed for ${model.name} ${id}`, error);
    throw error;
  }
}

/**
 * Batch increment field for multiple records
 *
 * @param model - Sequelize model class
 * @param where - Where conditions
 * @param field - Field to increment
 * @param amount - Amount to increment
 * @param transaction - Optional transaction
 * @returns Number of affected rows
 */
export async function bulkIncrement<M extends Model>(
  model: ModelCtor<M>,
  where: WhereOptions<any>,
  field: string,
  amount: number = 1,
  transaction?: Transaction
): Promise<number> {
  const logger = new Logger('CrudOperations::bulkIncrement');

  try {
    const [affectedCount] = await model.update(
      { [field]: Sequelize.literal(`"${field}" + ${amount}`) } as any,
      { where, transaction } as any
    );

    logger.log(`Bulk incremented ${field} for ${affectedCount} ${model.name} records`);

    return affectedCount;
  } catch (error) {
    logger.error(`Bulk increment failed for ${model.name}`, error);
    throw error;
  }
}

/**
 * Export all CRUD operation functions
 */
export const CrudOperations = {
  createWithAudit,
  updateWithAudit,
  conditionalUpdate,
  selectiveFieldUpdate,
  softDelete,
  restore,
  archive,
  unarchive,
  hardDelete,
  batchCreate,
  batchCreateIndividual,
  batchUpdate,
  batchSoftDelete,
  cascadeDelete,
  upsert,
  bulkUpsert,
  createVersioned,
  updateVersioned,
  findOrCreate,
  count,
  exists,
  increment,
  decrement,
  bulkIncrement,
};
