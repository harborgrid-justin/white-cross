/**
 * LOC: CRUD1234567
 * File: /reuse/crud-operations-utils.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS service classes
 *   - Repository implementations
 *   - CRUD controllers
 *   - Data access layers
 */

/**
 * File: /reuse/crud-operations-utils.ts
 * Locator: WC-UTL-CRUD-001
 * Purpose: Comprehensive CRUD Operations Utilities - Generic patterns for database operations
 *
 * Upstream: Independent utility module for CRUD operations
 * Downstream: ../backend/*, NestJS services, Sequelize repositories, TypeORM services
 * Dependencies: TypeScript 5.x, Node 18+, Sequelize 6.x, NestJS 10.x
 * Exports: 48 utility functions for CRUD operations, transactions, pagination, filtering
 *
 * LLM Context: Comprehensive CRUD utilities for database operations in White Cross healthcare system.
 * Provides generic CRUD service patterns, transaction management, optimistic locking, relation handling,
 * pagination, filtering, sorting, field projection, audit logging integration, and event-driven CRUD.
 * Essential for consistent, secure, and efficient data access in healthcare applications.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface CrudOptions {
  transaction?: any;
  userId?: string;
  includeDeleted?: boolean;
  relations?: string[];
  fields?: string[];
}

interface PaginationOptions {
  page: number;
  limit: number;
  offset?: number;
}

interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

interface FilterOptions {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'in' | 'between';
  value: any;
}

interface SortOptions {
  field: string;
  order: 'ASC' | 'DESC';
}

interface BulkOperationResult<T> {
  success: T[];
  failed: Array<{ index: number; error: string; data: any }>;
  successCount: number;
  failureCount: number;
}

interface UpsertResult<T> {
  data: T;
  created: boolean;
  updated: boolean;
}

interface OptimisticLockOptions {
  versionField: string;
  expectedVersion: number;
}

interface AuditLogEntry {
  action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';
  entityName: string;
  entityId: string;
  userId?: string;
  timestamp: Date;
  changes?: Record<string, any>;
}

interface CrudEventPayload<T> {
  action: 'created' | 'updated' | 'deleted';
  entity: T;
  metadata: Record<string, any>;
}

interface QueryBuilderOptions {
  where?: Record<string, any>;
  include?: any[];
  attributes?: string[];
  order?: Array<[string, 'ASC' | 'DESC']>;
  limit?: number;
  offset?: number;
}

// ============================================================================
// GENERIC CRUD SERVICE FACTORY
// ============================================================================

/**
 * Creates a generic CRUD service instance for any entity model.
 *
 * @template T
 * @param {any} model - Sequelize model class
 * @param {string} entityName - Entity name for logging/events
 * @returns {object} Generic CRUD service with standard methods
 *
 * @example
 * ```typescript
 * const patientService = createGenericCrudService(PatientModel, 'Patient');
 * const patient = await patientService.create({ name: 'John Doe' });
 * const patients = await patientService.findAll({ page: 1, limit: 20 });
 * ```
 */
export const createGenericCrudService = <T>(model: any, entityName: string) => {
  return {
    create: (data: Partial<T>, options?: CrudOptions) =>
      createSingle(model, data, options),
    findById: (id: string, options?: CrudOptions) =>
      findById(model, id, options),
    findAll: (pagination: PaginationOptions, options?: CrudOptions) =>
      findAllPaginated(model, pagination, options),
    update: (id: string, data: Partial<T>, options?: CrudOptions) =>
      updateSingle(model, id, data, options),
    delete: (id: string, options?: CrudOptions) =>
      softDelete(model, id, options),
    entityName,
  };
};

/**
 * Creates a repository pattern implementation for an entity.
 *
 * @template T
 * @param {any} model - Sequelize model class
 * @returns {object} Repository instance with CRUD and query methods
 *
 * @example
 * ```typescript
 * const patientRepository = createRepository(PatientModel);
 * const patient = await patientRepository.findOne({ where: { email: 'test@example.com' } });
 * await patientRepository.save({ name: 'Jane Doe' });
 * ```
 */
export const createRepository = <T>(model: any) => {
  return {
    findOne: (options: QueryBuilderOptions) => model.findOne(options),
    findAll: (options: QueryBuilderOptions) => model.findAll(options),
    findById: (id: string, options?: CrudOptions) => findById(model, id, options),
    save: (data: Partial<T>, options?: CrudOptions) =>
      createSingle(model, data, options),
    update: (id: string, data: Partial<T>, options?: CrudOptions) =>
      updateSingle(model, id, data, options),
    delete: (id: string, options?: CrudOptions) => hardDelete(model, id, options),
    count: (where?: Record<string, any>) => model.count({ where }),
  };
};

// ============================================================================
// CREATE OPERATIONS
// ============================================================================

/**
 * Creates a single record in the database.
 *
 * @template T
 * @param {any} model - Sequelize model
 * @param {Partial<T>} data - Data to create
 * @param {CrudOptions} [options] - CRUD options (transaction, userId, etc.)
 * @returns {Promise<T>} Created record
 *
 * @example
 * ```typescript
 * const patient = await createSingle(PatientModel, {
 *   name: 'John Doe',
 *   dateOfBirth: '1990-01-01',
 *   studentId: 'STU123'
 * }, { userId: 'user-123' });
 * ```
 */
export const createSingle = async <T>(
  model: any,
  data: Partial<T>,
  options?: CrudOptions,
): Promise<T> => {
  const recordData: any = { ...data };

  if (options?.userId) {
    recordData.createdBy = options.userId;
    recordData.updatedBy = options.userId;
  }

  recordData.createdAt = new Date();
  recordData.updatedAt = new Date();

  const result = await model.create(recordData, {
    transaction: options?.transaction,
  });

  return result.toJSON() as T;
};

/**
 * Creates multiple records in bulk with validation.
 *
 * @template T
 * @param {any} model - Sequelize model
 * @param {Partial<T>[]} dataArray - Array of data objects to create
 * @param {CrudOptions} [options] - CRUD options
 * @returns {Promise<T[]>} Array of created records
 *
 * @example
 * ```typescript
 * const patients = await createBulk(PatientModel, [
 *   { name: 'John Doe', studentId: 'STU123' },
 *   { name: 'Jane Smith', studentId: 'STU456' }
 * ], { transaction: t });
 * ```
 */
export const createBulk = async <T>(
  model: any,
  dataArray: Partial<T>[],
  options?: CrudOptions,
): Promise<T[]> => {
  const enrichedData = dataArray.map((data: any) => ({
    ...data,
    createdBy: options?.userId,
    updatedBy: options?.userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  const results = await model.bulkCreate(enrichedData, {
    transaction: options?.transaction,
    validate: true,
  });

  return results.map((r: any) => r.toJSON()) as T[];
};

/**
 * Creates records in batches with error handling per batch.
 *
 * @template T
 * @param {any} model - Sequelize model
 * @param {Partial<T>[]} dataArray - Array of data objects
 * @param {number} [batchSize] - Batch size (default: 100)
 * @param {CrudOptions} [options] - CRUD options
 * @returns {Promise<BulkOperationResult<T>>} Bulk operation result
 *
 * @example
 * ```typescript
 * const result = await createBatch(PatientModel, largeDataArray, 50);
 * console.log(`Created ${result.successCount}, Failed ${result.failureCount}`);
 * ```
 */
export const createBatch = async <T>(
  model: any,
  dataArray: Partial<T>[],
  batchSize: number = 100,
  options?: CrudOptions,
): Promise<BulkOperationResult<T>> => {
  const result: BulkOperationResult<T> = {
    success: [],
    failed: [],
    successCount: 0,
    failureCount: 0,
  };

  for (let i = 0; i < dataArray.length; i += batchSize) {
    const batch = dataArray.slice(i, i + batchSize);

    try {
      const created = await createBulk(model, batch, options);
      result.success.push(...created);
      result.successCount += created.length;
    } catch (error: any) {
      batch.forEach((data, idx) => {
        result.failed.push({
          index: i + idx,
          error: error.message,
          data,
        });
      });
      result.failureCount += batch.length;
    }
  }

  return result;
};

/**
 * Creates a record with automatic timestamp and audit fields.
 *
 * @template T
 * @param {any} model - Sequelize model
 * @param {Partial<T>} data - Data to create
 * @param {string} userId - User ID for audit trail
 * @param {any} [transaction] - Database transaction
 * @returns {Promise<T>} Created record with audit fields
 *
 * @example
 * ```typescript
 * const patient = await createWithAudit(PatientModel, patientData, 'user-123', t);
 * // Includes createdBy, updatedBy, createdAt, updatedAt
 * ```
 */
export const createWithAudit = async <T>(
  model: any,
  data: Partial<T>,
  userId: string,
  transaction?: any,
): Promise<T> => {
  return createSingle(model, data, { userId, transaction });
};

// ============================================================================
// READ OPERATIONS
// ============================================================================

/**
 * Finds a single record by ID.
 *
 * @template T
 * @param {any} model - Sequelize model
 * @param {string} id - Record ID
 * @param {CrudOptions} [options] - CRUD options (relations, fields, etc.)
 * @returns {Promise<T | null>} Found record or null
 *
 * @example
 * ```typescript
 * const patient = await findById(PatientModel, 'patient-123', {
 *   relations: ['medicalRecords', 'emergencyContacts']
 * });
 * ```
 */
export const findById = async <T>(
  model: any,
  id: string,
  options?: CrudOptions,
): Promise<T | null> => {
  const queryOptions: any = {
    where: { id },
    transaction: options?.transaction,
  };

  if (options?.relations && options.relations.length > 0) {
    queryOptions.include = options.relations.map((rel) => ({ association: rel }));
  }

  if (options?.fields && options.fields.length > 0) {
    queryOptions.attributes = options.fields;
  }

  if (!options?.includeDeleted) {
    queryOptions.where.deletedAt = null;
  }

  const result = await model.findOne(queryOptions);
  return result ? (result.toJSON() as T) : null;
};

/**
 * Finds a single record matching query criteria.
 *
 * @template T
 * @param {any} model - Sequelize model
 * @param {Record<string, any>} where - Where clause
 * @param {CrudOptions} [options] - CRUD options
 * @returns {Promise<T | null>} Found record or null
 *
 * @example
 * ```typescript
 * const patient = await findOne(PatientModel, {
 *   email: 'patient@example.com',
 *   deletedAt: null
 * });
 * ```
 */
export const findOne = async <T>(
  model: any,
  where: Record<string, any>,
  options?: CrudOptions,
): Promise<T | null> => {
  const queryOptions: any = {
    where: { ...where },
    transaction: options?.transaction,
  };

  if (!options?.includeDeleted) {
    queryOptions.where.deletedAt = null;
  }

  if (options?.relations) {
    queryOptions.include = options.relations.map((rel) => ({ association: rel }));
  }

  const result = await model.findOne(queryOptions);
  return result ? (result.toJSON() as T) : null;
};

/**
 * Finds all records matching criteria with pagination.
 *
 * @template T
 * @param {any} model - Sequelize model
 * @param {PaginationOptions} pagination - Pagination settings
 * @param {CrudOptions} [options] - CRUD options
 * @returns {Promise<PaginatedResult<T>>} Paginated results
 *
 * @example
 * ```typescript
 * const result = await findAllPaginated(PatientModel, { page: 1, limit: 20 });
 * console.log(`Found ${result.total} patients, showing page ${result.page}`);
 * ```
 */
export const findAllPaginated = async <T>(
  model: any,
  pagination: PaginationOptions,
  options?: CrudOptions,
): Promise<PaginatedResult<T>> => {
  const { page, limit } = pagination;
  const offset = pagination.offset ?? (page - 1) * limit;

  const queryOptions: any = {
    limit,
    offset,
    transaction: options?.transaction,
    where: {},
  };

  if (!options?.includeDeleted) {
    queryOptions.where.deletedAt = null;
  }

  if (options?.relations) {
    queryOptions.include = options.relations.map((rel) => ({ association: rel }));
  }

  if (options?.fields) {
    queryOptions.attributes = options.fields;
  }

  const { count, rows } = await model.findAndCountAll(queryOptions);
  const totalPages = Math.ceil(count / limit);

  return {
    data: rows.map((r: any) => r.toJSON()) as T[],
    total: count,
    page,
    limit,
    totalPages,
    hasNext: page < totalPages,
    hasPrevious: page > 1,
  };
};

/**
 * Searches records with filtering, sorting, and pagination.
 *
 * @template T
 * @param {any} model - Sequelize model
 * @param {FilterOptions[]} filters - Array of filter conditions
 * @param {SortOptions[]} [sort] - Sort options
 * @param {PaginationOptions} [pagination] - Pagination options
 * @param {CrudOptions} [options] - CRUD options
 * @returns {Promise<PaginatedResult<T>>} Search results
 *
 * @example
 * ```typescript
 * const results = await searchRecords(PatientModel,
 *   [
 *     { field: 'age', operator: 'gte', value: 18 },
 *     { field: 'status', operator: 'eq', value: 'active' }
 *   ],
 *   [{ field: 'name', order: 'ASC' }],
 *   { page: 1, limit: 20 }
 * );
 * ```
 */
export const searchRecords = async <T>(
  model: any,
  filters: FilterOptions[],
  sort?: SortOptions[],
  pagination?: PaginationOptions,
  options?: CrudOptions,
): Promise<PaginatedResult<T>> => {
  const where = buildWhereClause(filters);
  const order = sort ? sort.map((s) => [s.field, s.order]) : [];

  const queryOptions: any = {
    where,
    order,
    transaction: options?.transaction,
  };

  if (pagination) {
    const offset = pagination.offset ?? (pagination.page - 1) * pagination.limit;
    queryOptions.limit = pagination.limit;
    queryOptions.offset = offset;
  }

  if (!options?.includeDeleted) {
    queryOptions.where.deletedAt = null;
  }

  const { count, rows } = await model.findAndCountAll(queryOptions);

  if (!pagination) {
    return {
      data: rows.map((r: any) => r.toJSON()) as T[],
      total: count,
      page: 1,
      limit: count,
      totalPages: 1,
      hasNext: false,
      hasPrevious: false,
    };
  }

  const totalPages = Math.ceil(count / pagination.limit);

  return {
    data: rows.map((r: any) => r.toJSON()) as T[],
    total: count,
    page: pagination.page,
    limit: pagination.limit,
    totalPages,
    hasNext: pagination.page < totalPages,
    hasPrevious: pagination.page > 1,
  };
};

// ============================================================================
// UPDATE OPERATIONS
// ============================================================================

/**
 * Updates a single record by ID.
 *
 * @template T
 * @param {any} model - Sequelize model
 * @param {string} id - Record ID
 * @param {Partial<T>} data - Data to update
 * @param {CrudOptions} [options] - CRUD options
 * @returns {Promise<T | null>} Updated record or null if not found
 *
 * @example
 * ```typescript
 * const updated = await updateSingle(PatientModel, 'patient-123', {
 *   status: 'inactive',
 *   notes: 'Patient transferred'
 * }, { userId: 'user-123' });
 * ```
 */
export const updateSingle = async <T>(
  model: any,
  id: string,
  data: Partial<T>,
  options?: CrudOptions,
): Promise<T | null> => {
  const record = await model.findOne({
    where: { id },
    transaction: options?.transaction,
  });

  if (!record) {
    return null;
  }

  const updateData: any = { ...data };

  if (options?.userId) {
    updateData.updatedBy = options.userId;
  }

  updateData.updatedAt = new Date();

  await record.update(updateData, { transaction: options?.transaction });

  return record.toJSON() as T;
};

/**
 * Updates multiple records matching criteria.
 *
 * @template T
 * @param {any} model - Sequelize model
 * @param {Record<string, any>} where - Where clause for records to update
 * @param {Partial<T>} data - Data to update
 * @param {CrudOptions} [options] - CRUD options
 * @returns {Promise<number>} Number of updated records
 *
 * @example
 * ```typescript
 * const count = await updateBulk(PatientModel,
 *   { status: 'pending', createdAt: { $lt: yesterday } },
 *   { status: 'expired' },
 *   { userId: 'system' }
 * );
 * console.log(`Updated ${count} records`);
 * ```
 */
export const updateBulk = async <T>(
  model: any,
  where: Record<string, any>,
  data: Partial<T>,
  options?: CrudOptions,
): Promise<number> => {
  const updateData: any = { ...data };

  if (options?.userId) {
    updateData.updatedBy = options.userId;
  }

  updateData.updatedAt = new Date();

  const [affectedCount] = await model.update(updateData, {
    where,
    transaction: options?.transaction,
  });

  return affectedCount;
};

/**
 * Performs a partial update (PATCH) on a record.
 *
 * @template T
 * @param {any} model - Sequelize model
 * @param {string} id - Record ID
 * @param {Partial<T>} partialData - Partial data to update
 * @param {CrudOptions} [options] - CRUD options
 * @returns {Promise<T | null>} Updated record
 *
 * @example
 * ```typescript
 * const updated = await partialUpdate(PatientModel, 'patient-123', {
 *   email: 'newemail@example.com'
 * }); // Only updates email field
 * ```
 */
export const partialUpdate = async <T>(
  model: any,
  id: string,
  partialData: Partial<T>,
  options?: CrudOptions,
): Promise<T | null> => {
  return updateSingle(model, id, partialData, options);
};

/**
 * Performs a full update (PUT) on a record.
 *
 * @template T
 * @param {any} model - Sequelize model
 * @param {string} id - Record ID
 * @param {T} fullData - Complete data object
 * @param {CrudOptions} [options] - CRUD options
 * @returns {Promise<T | null>} Updated record
 *
 * @example
 * ```typescript
 * const updated = await fullUpdate(PatientModel, 'patient-123', {
 *   id: 'patient-123',
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   // ... all required fields
 * });
 * ```
 */
export const fullUpdate = async <T>(
  model: any,
  id: string,
  fullData: T,
  options?: CrudOptions,
): Promise<T | null> => {
  return updateSingle(model, id, fullData, options);
};

/**
 * Updates a record with optimistic locking to prevent concurrent modifications.
 *
 * @template T
 * @param {any} model - Sequelize model
 * @param {string} id - Record ID
 * @param {Partial<T>} data - Data to update
 * @param {OptimisticLockOptions} lockOptions - Optimistic lock configuration
 * @param {CrudOptions} [options] - CRUD options
 * @returns {Promise<T>} Updated record
 * @throws {Error} If version mismatch detected
 *
 * @example
 * ```typescript
 * const updated = await updateWithOptimisticLock(
 *   PatientModel,
 *   'patient-123',
 *   { status: 'active' },
 *   { versionField: 'version', expectedVersion: 5 }
 * );
 * ```
 */
export const updateWithOptimisticLock = async <T>(
  model: any,
  id: string,
  data: Partial<T>,
  lockOptions: OptimisticLockOptions,
  options?: CrudOptions,
): Promise<T> => {
  const { versionField, expectedVersion } = lockOptions;

  const record: any = await model.findOne({
    where: { id },
    transaction: options?.transaction,
  });

  if (!record) {
    throw new Error(`Record with ID ${id} not found`);
  }

  const currentVersion = record[versionField];

  if (currentVersion !== expectedVersion) {
    throw new Error(
      `Version mismatch: expected ${expectedVersion}, got ${currentVersion}. ` +
      `Record was modified by another process.`
    );
  }

  const updateData: any = {
    ...data,
    [versionField]: currentVersion + 1,
    updatedAt: new Date(),
  };

  if (options?.userId) {
    updateData.updatedBy = options.userId;
  }

  await record.update(updateData, { transaction: options?.transaction });

  return record.toJSON() as T;
};

// ============================================================================
// DELETE OPERATIONS
// ============================================================================

/**
 * Performs a soft delete on a record (sets deletedAt timestamp).
 *
 * @param {any} model - Sequelize model
 * @param {string} id - Record ID
 * @param {CrudOptions} [options] - CRUD options
 * @returns {Promise<boolean>} True if deleted, false if not found
 *
 * @example
 * ```typescript
 * const deleted = await softDelete(PatientModel, 'patient-123', {
 *   userId: 'user-123'
 * });
 * // Sets deletedAt, deletedBy fields
 * ```
 */
export const softDelete = async (
  model: any,
  id: string,
  options?: CrudOptions,
): Promise<boolean> => {
  const record = await model.findOne({
    where: { id },
    transaction: options?.transaction,
  });

  if (!record) {
    return false;
  }

  const updateData: any = {
    deletedAt: new Date(),
  };

  if (options?.userId) {
    updateData.deletedBy = options.userId;
  }

  await record.update(updateData, { transaction: options?.transaction });

  return true;
};

/**
 * Performs a hard delete on a record (permanently removes from database).
 *
 * @param {any} model - Sequelize model
 * @param {string} id - Record ID
 * @param {CrudOptions} [options] - CRUD options
 * @returns {Promise<boolean>} True if deleted, false if not found
 *
 * @example
 * ```typescript
 * const deleted = await hardDelete(PatientModel, 'patient-123', {
 *   transaction: t
 * });
 * // Permanently removes record
 * ```
 */
export const hardDelete = async (
  model: any,
  id: string,
  options?: CrudOptions,
): Promise<boolean> => {
  const affectedCount = await model.destroy({
    where: { id },
    transaction: options?.transaction,
    force: true,
  });

  return affectedCount > 0;
};

/**
 * Soft deletes multiple records matching criteria.
 *
 * @param {any} model - Sequelize model
 * @param {Record<string, any>} where - Where clause for records to delete
 * @param {CrudOptions} [options] - CRUD options
 * @returns {Promise<number>} Number of deleted records
 *
 * @example
 * ```typescript
 * const count = await bulkSoftDelete(PatientModel,
 *   { status: 'archived', updatedAt: { $lt: oneYearAgo } },
 *   { userId: 'admin-123' }
 * );
 * ```
 */
export const bulkSoftDelete = async (
  model: any,
  where: Record<string, any>,
  options?: CrudOptions,
): Promise<number> => {
  const updateData: any = {
    deletedAt: new Date(),
  };

  if (options?.userId) {
    updateData.deletedBy = options.userId;
  }

  const [affectedCount] = await model.update(updateData, {
    where,
    transaction: options?.transaction,
  });

  return affectedCount;
};

/**
 * Hard deletes multiple records matching criteria.
 *
 * @param {any} model - Sequelize model
 * @param {Record<string, any>} where - Where clause for records to delete
 * @param {CrudOptions} [options] - CRUD options
 * @returns {Promise<number>} Number of deleted records
 *
 * @example
 * ```typescript
 * const count = await bulkHardDelete(LogModel,
 *   { createdAt: { $lt: thirtyDaysAgo } },
 *   { transaction: t }
 * );
 * ```
 */
export const bulkHardDelete = async (
  model: any,
  where: Record<string, any>,
  options?: CrudOptions,
): Promise<number> => {
  const affectedCount = await model.destroy({
    where,
    transaction: options?.transaction,
    force: true,
  });

  return affectedCount;
};

/**
 * Restores a soft-deleted record.
 *
 * @param {any} model - Sequelize model
 * @param {string} id - Record ID
 * @param {CrudOptions} [options] - CRUD options
 * @returns {Promise<boolean>} True if restored, false if not found
 *
 * @example
 * ```typescript
 * const restored = await restoreDeleted(PatientModel, 'patient-123');
 * // Sets deletedAt to null
 * ```
 */
export const restoreDeleted = async (
  model: any,
  id: string,
  options?: CrudOptions,
): Promise<boolean> => {
  const record = await model.findOne({
    where: { id },
    paranoid: false,
    transaction: options?.transaction,
  });

  if (!record) {
    return false;
  }

  await record.update(
    { deletedAt: null, deletedBy: null },
    { transaction: options?.transaction }
  );

  return true;
};

// ============================================================================
// UPSERT OPERATIONS
// ============================================================================

/**
 * Creates a new record or updates existing one based on unique constraint.
 *
 * @template T
 * @param {any} model - Sequelize model
 * @param {Partial<T>} data - Data to upsert
 * @param {string[]} conflictFields - Fields to check for conflicts
 * @param {CrudOptions} [options] - CRUD options
 * @returns {Promise<UpsertResult<T>>} Upsert result with created/updated flag
 *
 * @example
 * ```typescript
 * const result = await upsert(PatientModel,
 *   { email: 'patient@example.com', name: 'John Doe' },
 *   ['email'],
 *   { userId: 'user-123' }
 * );
 * console.log(result.created ? 'Created' : 'Updated');
 * ```
 */
export const upsert = async <T>(
  model: any,
  data: Partial<T>,
  conflictFields: string[],
  options?: CrudOptions,
): Promise<UpsertResult<T>> => {
  const where: Record<string, any> = {};
  conflictFields.forEach((field) => {
    where[field] = (data as any)[field];
  });

  const existing = await model.findOne({
    where,
    transaction: options?.transaction,
  });

  if (existing) {
    const updated = await updateSingle(model, existing.id, data, options);
    return {
      data: updated as T,
      created: false,
      updated: true,
    };
  } else {
    const created = await createSingle(model, data, options);
    return {
      data: created,
      created: true,
      updated: false,
    };
  }
};

/**
 * Upserts multiple records with conflict resolution.
 *
 * @template T
 * @param {any} model - Sequelize model
 * @param {Partial<T>[]} dataArray - Array of data to upsert
 * @param {string[]} conflictFields - Fields to check for conflicts
 * @param {CrudOptions} [options] - CRUD options
 * @returns {Promise<BulkOperationResult<T>>} Bulk upsert results
 *
 * @example
 * ```typescript
 * const result = await bulkUpsert(PatientModel,
 *   [
 *     { email: 'patient1@example.com', name: 'John' },
 *     { email: 'patient2@example.com', name: 'Jane' }
 *   ],
 *   ['email']
 * );
 * ```
 */
export const bulkUpsert = async <T>(
  model: any,
  dataArray: Partial<T>[],
  conflictFields: string[],
  options?: CrudOptions,
): Promise<BulkOperationResult<T>> => {
  const result: BulkOperationResult<T> = {
    success: [],
    failed: [],
    successCount: 0,
    failureCount: 0,
  };

  for (let i = 0; i < dataArray.length; i++) {
    try {
      const upsertResult = await upsert(model, dataArray[i], conflictFields, options);
      result.success.push(upsertResult.data);
      result.successCount++;
    } catch (error: any) {
      result.failed.push({
        index: i,
        error: error.message,
        data: dataArray[i],
      });
      result.failureCount++;
    }
  }

  return result;
};

// ============================================================================
// TRANSACTION-WRAPPED CRUD
// ============================================================================

/**
 * Executes CRUD operation within a transaction.
 *
 * @template T
 * @param {any} sequelize - Sequelize instance
 * @param {(transaction: any) => Promise<T>} operation - Operation to execute in transaction
 * @returns {Promise<T>} Operation result
 *
 * @example
 * ```typescript
 * const result = await executeInTransaction(sequelize, async (t) => {
 *   const patient = await createSingle(PatientModel, patientData, { transaction: t });
 *   await createSingle(MedicalRecordModel, recordData, { transaction: t });
 *   return patient;
 * });
 * ```
 */
export const executeInTransaction = async <T>(
  sequelize: any,
  operation: (transaction: any) => Promise<T>,
): Promise<T> => {
  const transaction = await sequelize.transaction();

  try {
    const result = await operation(transaction);
    await transaction.commit();
    return result;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

/**
 * Creates multiple related records in a single transaction.
 *
 * @template T
 * @param {any} sequelize - Sequelize instance
 * @param {Array<{ model: any; data: Partial<T> }>} operations - Array of create operations
 * @param {CrudOptions} [options] - CRUD options
 * @returns {Promise<any[]>} Array of created records
 *
 * @example
 * ```typescript
 * const results = await createWithRelationsInTransaction(sequelize, [
 *   { model: PatientModel, data: patientData },
 *   { model: EmergencyContactModel, data: contactData },
 *   { model: MedicalHistoryModel, data: historyData }
 * ], { userId: 'user-123' });
 * ```
 */
export const createWithRelationsInTransaction = async <T>(
  sequelize: any,
  operations: Array<{ model: any; data: Partial<T> }>,
  options?: CrudOptions,
): Promise<any[]> => {
  return executeInTransaction(sequelize, async (transaction) => {
    const results: any[] = [];

    for (const op of operations) {
      const result = await createSingle(op.model, op.data, {
        ...options,
        transaction,
      });
      results.push(result);
    }

    return results;
  });
};

// ============================================================================
// CRUD WITH RELATIONS
// ============================================================================

/**
 * Finds a record with specified relations eagerly loaded.
 *
 * @template T
 * @param {any} model - Sequelize model
 * @param {string} id - Record ID
 * @param {string[]} relations - Relations to include
 * @param {CrudOptions} [options] - CRUD options
 * @returns {Promise<T | null>} Record with relations
 *
 * @example
 * ```typescript
 * const patient = await findWithRelations(PatientModel, 'patient-123', [
 *   'medicalRecords',
 *   'emergencyContacts',
 *   'appointments'
 * ]);
 * ```
 */
export const findWithRelations = async <T>(
  model: any,
  id: string,
  relations: string[],
  options?: CrudOptions,
): Promise<T | null> => {
  return findById(model, id, { ...options, relations });
};

/**
 * Creates a record with nested relations in a transaction.
 *
 * @template T
 * @param {any} sequelize - Sequelize instance
 * @param {any} model - Sequelize model
 * @param {any} data - Data with nested relations
 * @param {Record<string, any>} relationModels - Map of relation names to models
 * @param {CrudOptions} [options] - CRUD options
 * @returns {Promise<T>} Created record with relations
 *
 * @example
 * ```typescript
 * const patient = await createWithNestedRelations(
 *   sequelize,
 *   PatientModel,
 *   {
 *     name: 'John Doe',
 *     medicalRecords: [{ diagnosis: 'Flu', date: new Date() }],
 *     emergencyContacts: [{ name: 'Jane Doe', phone: '555-0100' }]
 *   },
 *   { medicalRecords: MedicalRecordModel, emergencyContacts: EmergencyContactModel }
 * );
 * ```
 */
export const createWithNestedRelations = async <T>(
  sequelize: any,
  model: any,
  data: any,
  relationModels: Record<string, any>,
  options?: CrudOptions,
): Promise<T> => {
  return executeInTransaction(sequelize, async (transaction) => {
    const { ...mainData } = data;
    const relationData: Record<string, any[]> = {};

    Object.keys(relationModels).forEach((relationName) => {
      if (mainData[relationName]) {
        relationData[relationName] = mainData[relationName];
        delete mainData[relationName];
      }
    });

    const mainRecord: any = await createSingle(model, mainData, {
      ...options,
      transaction,
    });

    for (const [relationName, relatedItems] of Object.entries(relationData)) {
      const relationModel = relationModels[relationName];

      for (const item of relatedItems) {
        await createSingle(
          relationModel,
          { ...item, [model.name.toLowerCase() + 'Id']: mainRecord.id },
          { ...options, transaction }
        );
      }
    }

    return findById(model, mainRecord.id, {
      ...options,
      relations: Object.keys(relationModels),
      transaction,
    }) as Promise<T>;
  });
};

// ============================================================================
// PAGINATION HELPERS
// ============================================================================

/**
 * Calculates pagination metadata from page and limit.
 *
 * @param {number} page - Current page number (1-indexed)
 * @param {number} limit - Items per page
 * @param {number} total - Total number of items
 * @returns {object} Pagination metadata
 *
 * @example
 * ```typescript
 * const meta = calculatePaginationMeta(2, 20, 150);
 * // Result: { page: 2, limit: 20, offset: 20, total: 150, totalPages: 8, hasNext: true, hasPrevious: true }
 * ```
 */
export const calculatePaginationMeta = (
  page: number,
  limit: number,
  total: number,
) => {
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;

  return {
    page,
    limit,
    offset,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrevious: page > 1,
  };
};

/**
 * Creates pagination options from query parameters.
 *
 * @param {Record<string, any>} query - Query parameters
 * @param {number} [defaultLimit] - Default limit (default: 20)
 * @param {number} [maxLimit] - Maximum limit (default: 100)
 * @returns {PaginationOptions} Pagination options
 *
 * @example
 * ```typescript
 * const pagination = createPaginationFromQuery({ page: '2', limit: '50' });
 * // Result: { page: 2, limit: 50, offset: 50 }
 * ```
 */
export const createPaginationFromQuery = (
  query: Record<string, any>,
  defaultLimit: number = 20,
  maxLimit: number = 100,
): PaginationOptions => {
  const page = Math.max(1, parseInt(query.page || '1', 10));
  const limit = Math.min(
    maxLimit,
    Math.max(1, parseInt(query.limit || String(defaultLimit), 10))
  );
  const offset = (page - 1) * limit;

  return { page, limit, offset };
};

// ============================================================================
// FILTERING AND SORTING
// ============================================================================

/**
 * Builds Sequelize where clause from filter options.
 *
 * @param {FilterOptions[]} filters - Array of filter conditions
 * @returns {Record<string, any>} Sequelize where clause
 *
 * @example
 * ```typescript
 * const where = buildWhereClause([
 *   { field: 'age', operator: 'gte', value: 18 },
 *   { field: 'status', operator: 'eq', value: 'active' }
 * ]);
 * // Result: { age: { [Op.gte]: 18 }, status: { [Op.eq]: 'active' } }
 * ```
 */
export const buildWhereClause = (filters: FilterOptions[]): Record<string, any> => {
  const where: Record<string, any> = {};

  filters.forEach((filter) => {
    const { field, operator, value } = filter;

    switch (operator) {
      case 'eq':
        where[field] = value;
        break;
      case 'ne':
        where[field] = { $ne: value };
        break;
      case 'gt':
        where[field] = { $gt: value };
        break;
      case 'gte':
        where[field] = { $gte: value };
        break;
      case 'lt':
        where[field] = { $lt: value };
        break;
      case 'lte':
        where[field] = { $lte: value };
        break;
      case 'like':
        where[field] = { $like: `%${value}%` };
        break;
      case 'in':
        where[field] = { $in: Array.isArray(value) ? value : [value] };
        break;
      case 'between':
        if (Array.isArray(value) && value.length === 2) {
          where[field] = { $between: value };
        }
        break;
    }
  });

  return where;
};

/**
 * Builds Sequelize order clause from sort options.
 *
 * @param {SortOptions[]} sortOptions - Array of sort configurations
 * @returns {Array<[string, string]>} Sequelize order array
 *
 * @example
 * ```typescript
 * const order = buildOrderClause([
 *   { field: 'createdAt', order: 'DESC' },
 *   { field: 'name', order: 'ASC' }
 * ]);
 * // Result: [['createdAt', 'DESC'], ['name', 'ASC']]
 * ```
 */
export const buildOrderClause = (
  sortOptions: SortOptions[],
): Array<[string, string]> => {
  return sortOptions.map((sort) => [sort.field, sort.order]);
};

/**
 * Parses filter options from query string parameters.
 *
 * @param {Record<string, any>} query - Query parameters
 * @returns {FilterOptions[]} Array of filter options
 *
 * @example
 * ```typescript
 * const filters = parseFiltersFromQuery({
 *   'filter[age][gte]': '18',
 *   'filter[status][eq]': 'active'
 * });
 * // Result: [{ field: 'age', operator: 'gte', value: 18 }, ...]
 * ```
 */
export const parseFiltersFromQuery = (
  query: Record<string, any>,
): FilterOptions[] => {
  const filters: FilterOptions[] = [];
  const filterPattern = /^filter\[(\w+)\]\[(\w+)\]$/;

  Object.keys(query).forEach((key) => {
    const match = key.match(filterPattern);
    if (match) {
      const [, field, operator] = match;
      filters.push({
        field,
        operator: operator as FilterOptions['operator'],
        value: query[key],
      });
    }
  });

  return filters;
};

// ============================================================================
// FIELD SELECTION/PROJECTION
// ============================================================================

/**
 * Selects specific fields from query results.
 *
 * @template T
 * @param {any} model - Sequelize model
 * @param {string[]} fields - Fields to select
 * @param {Record<string, any>} [where] - Where clause
 * @param {CrudOptions} [options] - CRUD options
 * @returns {Promise<Partial<T>[]>} Records with selected fields only
 *
 * @example
 * ```typescript
 * const patients = await selectFields(PatientModel,
 *   ['id', 'name', 'email'],
 *   { status: 'active' }
 * );
 * // Only returns id, name, email fields
 * ```
 */
export const selectFields = async <T>(
  model: any,
  fields: string[],
  where?: Record<string, any>,
  options?: CrudOptions,
): Promise<Partial<T>[]> => {
  const results = await model.findAll({
    attributes: fields,
    where: where || {},
    transaction: options?.transaction,
  });

  return results.map((r: any) => r.toJSON()) as Partial<T>[];
};

/**
 * Excludes specific fields from query results.
 *
 * @template T
 * @param {any} model - Sequelize model
 * @param {string[]} excludeFields - Fields to exclude
 * @param {Record<string, any>} [where] - Where clause
 * @param {CrudOptions} [options] - CRUD options
 * @returns {Promise<Partial<T>[]>} Records without excluded fields
 *
 * @example
 * ```typescript
 * const patients = await excludeFields(PatientModel,
 *   ['password', 'ssn', 'privateNotes'],
 *   { status: 'active' }
 * );
 * // Returns all fields except password, ssn, privateNotes
 * ```
 */
export const excludeFields = async <T>(
  model: any,
  excludeFields: string[],
  where?: Record<string, any>,
  options?: CrudOptions,
): Promise<Partial<T>[]> => {
  const results = await model.findAll({
    attributes: { exclude: excludeFields },
    where: where || {},
    transaction: options?.transaction,
  });

  return results.map((r: any) => r.toJSON()) as Partial<T>[];
};

// ============================================================================
// CRUD AUDIT LOGGING
// ============================================================================

/**
 * Creates an audit log entry for CRUD operation.
 *
 * @param {string} action - CRUD action type
 * @param {string} entityName - Entity name
 * @param {string} entityId - Entity ID
 * @param {string} [userId] - User ID who performed action
 * @param {Record<string, any>} [changes] - Changes made
 * @returns {AuditLogEntry} Audit log entry
 *
 * @example
 * ```typescript
 * const auditLog = createAuditLog(
 *   'UPDATE',
 *   'Patient',
 *   'patient-123',
 *   'user-456',
 *   { status: { from: 'active', to: 'inactive' } }
 * );
 * ```
 */
export const createAuditLog = (
  action: AuditLogEntry['action'],
  entityName: string,
  entityId: string,
  userId?: string,
  changes?: Record<string, any>,
): AuditLogEntry => {
  return {
    action,
    entityName,
    entityId,
    userId,
    timestamp: new Date(),
    changes,
  };
};

/**
 * Wraps a CRUD operation with automatic audit logging.
 *
 * @template T
 * @param {() => Promise<T>} operation - CRUD operation to execute
 * @param {string} action - Action type
 * @param {string} entityName - Entity name
 * @param {string} entityId - Entity ID
 * @param {(log: AuditLogEntry) => Promise<void>} logHandler - Audit log handler
 * @param {string} [userId] - User ID
 * @returns {Promise<T>} Operation result
 *
 * @example
 * ```typescript
 * const patient = await withAuditLog(
 *   () => updateSingle(PatientModel, 'patient-123', data),
 *   'UPDATE',
 *   'Patient',
 *   'patient-123',
 *   async (log) => await AuditLogModel.create(log),
 *   'user-456'
 * );
 * ```
 */
export const withAuditLog = async <T>(
  operation: () => Promise<T>,
  action: AuditLogEntry['action'],
  entityName: string,
  entityId: string,
  logHandler: (log: AuditLogEntry) => Promise<void>,
  userId?: string,
): Promise<T> => {
  const result = await operation();

  const auditLog = createAuditLog(action, entityName, entityId, userId);
  await logHandler(auditLog);

  return result;
};

// ============================================================================
// CRUD EVENT EMITTERS
// ============================================================================

/**
 * Creates a CRUD event payload for event-driven architecture.
 *
 * @template T
 * @param {CrudEventPayload<T>['action']} action - Event action
 * @param {T} entity - Entity data
 * @param {Record<string, any>} [metadata] - Additional metadata
 * @returns {CrudEventPayload<T>} Event payload
 *
 * @example
 * ```typescript
 * const event = createCrudEvent('created', patient, {
 *   userId: 'user-123',
 *   timestamp: new Date()
 * });
 * eventEmitter.emit('patient.created', event);
 * ```
 */
export const createCrudEvent = <T>(
  action: CrudEventPayload<T>['action'],
  entity: T,
  metadata?: Record<string, any>,
): CrudEventPayload<T> => {
  return {
    action,
    entity,
    metadata: metadata || {},
  };
};

/**
 * Wraps CRUD operation with event emission.
 *
 * @template T
 * @param {() => Promise<T>} operation - CRUD operation
 * @param {CrudEventPayload<T>['action']} action - Event action
 * @param {(event: CrudEventPayload<T>) => void} emitter - Event emitter function
 * @param {Record<string, any>} [metadata] - Event metadata
 * @returns {Promise<T>} Operation result
 *
 * @example
 * ```typescript
 * const patient = await withCrudEvent(
 *   () => createSingle(PatientModel, data),
 *   'created',
 *   (event) => eventEmitter.emit('patient.created', event),
 *   { userId: 'user-123' }
 * );
 * ```
 */
export const withCrudEvent = async <T>(
  operation: () => Promise<T>,
  action: CrudEventPayload<T>['action'],
  emitter: (event: CrudEventPayload<T>) => void,
  metadata?: Record<string, any>,
): Promise<T> => {
  const result = await operation();

  const event = createCrudEvent(action, result, metadata);
  emitter(event);

  return result;
};

// ============================================================================
// COUNT AND EXISTS OPERATIONS
// ============================================================================

/**
 * Counts records matching criteria.
 *
 * @param {any} model - Sequelize model
 * @param {Record<string, any>} [where] - Where clause
 * @param {CrudOptions} [options] - CRUD options
 * @returns {Promise<number>} Count of matching records
 *
 * @example
 * ```typescript
 * const count = await countRecords(PatientModel, {
 *   status: 'active',
 *   deletedAt: null
 * });
 * ```
 */
export const countRecords = async (
  model: any,
  where?: Record<string, any>,
  options?: CrudOptions,
): Promise<number> => {
  const queryWhere = { ...where };

  if (!options?.includeDeleted) {
    queryWhere.deletedAt = null;
  }

  return model.count({
    where: queryWhere,
    transaction: options?.transaction,
  });
};

/**
 * Checks if a record exists by ID.
 *
 * @param {any} model - Sequelize model
 * @param {string} id - Record ID
 * @param {CrudOptions} [options] - CRUD options
 * @returns {Promise<boolean>} True if record exists
 *
 * @example
 * ```typescript
 * const exists = await existsById(PatientModel, 'patient-123');
 * if (exists) {
 *   // Record exists
 * }
 * ```
 */
export const existsById = async (
  model: any,
  id: string,
  options?: CrudOptions,
): Promise<boolean> => {
  const count = await countRecords(model, { id }, options);
  return count > 0;
};

/**
 * Checks if any records match criteria.
 *
 * @param {any} model - Sequelize model
 * @param {Record<string, any>} where - Where clause
 * @param {CrudOptions} [options] - CRUD options
 * @returns {Promise<boolean>} True if any records match
 *
 * @example
 * ```typescript
 * const hasActivePatients = await existsWhere(PatientModel, {
 *   status: 'active',
 *   lastVisit: { $gte: thirtyDaysAgo }
 * });
 * ```
 */
export const existsWhere = async (
  model: any,
  where: Record<string, any>,
  options?: CrudOptions,
): Promise<boolean> => {
  const count = await countRecords(model, where, options);
  return count > 0;
};

// ============================================================================
// AGGREGATION HELPERS
// ============================================================================

/**
 * Finds distinct values for a field.
 *
 * @param {any} model - Sequelize model
 * @param {string} field - Field name
 * @param {Record<string, any>} [where] - Where clause
 * @param {CrudOptions} [options] - CRUD options
 * @returns {Promise<any[]>} Array of distinct values
 *
 * @example
 * ```typescript
 * const statuses = await findDistinct(PatientModel, 'status');
 * // Result: ['active', 'inactive', 'archived']
 * ```
 */
export const findDistinct = async (
  model: any,
  field: string,
  where?: Record<string, any>,
  options?: CrudOptions,
): Promise<any[]> => {
  const results = await model.findAll({
    attributes: [[model.sequelize.fn('DISTINCT', model.sequelize.col(field)), field]],
    where: where || {},
    transaction: options?.transaction,
    raw: true,
  });

  return results.map((r: any) => r[field]);
};

/**
 * Aggregates records by field with count.
 *
 * @param {any} model - Sequelize model
 * @param {string} groupField - Field to group by
 * @param {Record<string, any>} [where] - Where clause
 * @param {CrudOptions} [options] - CRUD options
 * @returns {Promise<Array<{ value: any; count: number }>>} Aggregated results
 *
 * @example
 * ```typescript
 * const byStatus = await aggregateByField(PatientModel, 'status');
 * // Result: [{ value: 'active', count: 150 }, { value: 'inactive', count: 25 }]
 * ```
 */
export const aggregateByField = async (
  model: any,
  groupField: string,
  where?: Record<string, any>,
  options?: CrudOptions,
): Promise<Array<{ value: any; count: number }>> => {
  const results = await model.findAll({
    attributes: [
      groupField,
      [model.sequelize.fn('COUNT', model.sequelize.col('id')), 'count'],
    ],
    where: where || {},
    group: [groupField],
    transaction: options?.transaction,
    raw: true,
  });

  return results.map((r: any) => ({
    value: r[groupField],
    count: parseInt(r.count, 10),
  }));
};

// ============================================================================
// CURSOR-BASED PAGINATION
// ============================================================================

/**
 * Implements cursor-based pagination for efficient large dataset navigation.
 *
 * @template T
 * @param {any} model - Sequelize model
 * @param {string} [cursor] - Cursor for next page (ID of last item)
 * @param {number} [limit] - Items per page (default: 20)
 * @param {SortOptions[]} [sort] - Sort options
 * @param {Record<string, any>} [where] - Where clause
 * @param {CrudOptions} [options] - CRUD options
 * @returns {Promise<{ data: T[]; nextCursor: string | null; hasMore: boolean }>} Cursor pagination result
 *
 * @example
 * ```typescript
 * const page1 = await findWithCursor(PatientModel, null, 20);
 * const page2 = await findWithCursor(PatientModel, page1.nextCursor, 20);
 * ```
 */
export const findWithCursor = async <T>(
  model: any,
  cursor?: string,
  limit: number = 20,
  sort?: SortOptions[],
  where?: Record<string, any>,
  options?: CrudOptions,
): Promise<{ data: T[]; nextCursor: string | null; hasMore: boolean }> => {
  const queryWhere: Record<string, any> = { ...where };

  if (cursor) {
    queryWhere.id = { $gt: cursor };
  }

  if (!options?.includeDeleted) {
    queryWhere.deletedAt = null;
  }

  const order = sort ? buildOrderClause(sort) : [['id', 'ASC']];

  const results = await model.findAll({
    where: queryWhere,
    limit: limit + 1,
    order,
    transaction: options?.transaction,
  });

  const hasMore = results.length > limit;
  const data = results.slice(0, limit).map((r: any) => r.toJSON()) as T[];
  const nextCursor = hasMore && data.length > 0 ? (data[data.length - 1] as any).id : null;

  return {
    data,
    nextCursor,
    hasMore,
  };
};

// ============================================================================
// BULK FIND OPERATIONS
// ============================================================================

/**
 * Finds multiple records by their IDs in a single query.
 *
 * @template T
 * @param {any} model - Sequelize model
 * @param {string[]} ids - Array of record IDs
 * @param {CrudOptions} [options] - CRUD options
 * @returns {Promise<T[]>} Array of found records
 *
 * @example
 * ```typescript
 * const patients = await findByIds(PatientModel, [
 *   'patient-123',
 *   'patient-456',
 *   'patient-789'
 * ]);
 * ```
 */
export const findByIds = async <T>(
  model: any,
  ids: string[],
  options?: CrudOptions,
): Promise<T[]> => {
  const queryOptions: any = {
    where: { id: { $in: ids } },
    transaction: options?.transaction,
  };

  if (!options?.includeDeleted) {
    queryOptions.where.deletedAt = null;
  }

  if (options?.relations) {
    queryOptions.include = options.relations.map((rel) => ({ association: rel }));
  }

  if (options?.fields) {
    queryOptions.attributes = options.fields;
  }

  const results = await model.findAll(queryOptions);
  return results.map((r: any) => r.toJSON()) as T[];
};

/**
 * Synchronizes records with external data source (creates, updates, or deletes).
 *
 * @template T
 * @param {any} sequelize - Sequelize instance
 * @param {any} model - Sequelize model
 * @param {Array<Partial<T> & { id: string }>} externalData - External data with IDs
 * @param {string[]} conflictFields - Fields to check for conflicts
 * @param {CrudOptions} [options] - CRUD options
 * @returns {Promise<{ created: number; updated: number; deleted: number }>} Sync statistics
 *
 * @example
 * ```typescript
 * const stats = await syncWithExternalData(
 *   sequelize,
 *   PatientModel,
 *   externalPatients,
 *   ['externalId'],
 *   { userId: 'sync-service' }
 * );
 * console.log(`Created: ${stats.created}, Updated: ${stats.updated}, Deleted: ${stats.deleted}`);
 * ```
 */
export const syncWithExternalData = async <T>(
  sequelize: any,
  model: any,
  externalData: Array<Partial<T> & { id?: string }>,
  conflictFields: string[],
  options?: CrudOptions,
): Promise<{ created: number; updated: number; deleted: number }> => {
  return executeInTransaction(sequelize, async (transaction) => {
    const stats = { created: 0, updated: 0, deleted: 0 };
    const txOptions = { ...options, transaction };

    // Get all existing records
    const existingRecords = await model.findAll({
      transaction,
      where: !options?.includeDeleted ? { deletedAt: null } : {},
    });

    const existingIds = new Set(existingRecords.map((r: any) => r.id));
    const externalIds = new Set(
      externalData.map((d: any) => d.id).filter(Boolean)
    );

    // Upsert external data
    for (const data of externalData) {
      const result = await upsert(model, data, conflictFields, txOptions);
      if (result.created) {
        stats.created++;
      } else if (result.updated) {
        stats.updated++;
      }
    }

    // Delete records not in external data
    for (const existingRecord of existingRecords) {
      const recordId = (existingRecord as any).id;
      if (!externalIds.has(recordId)) {
        await softDelete(model, recordId, txOptions);
        stats.deleted++;
      }
    }

    return stats;
  });
};

// ============================================================================
// VALIDATION PIPELINE
// ============================================================================

/**
 * Validates data before CRUD operation using custom validator function.
 *
 * @template T
 * @param {Partial<T>} data - Data to validate
 * @param {(data: Partial<T>) => Promise<string[]> | string[]} validator - Validator function
 * @returns {Promise<{ valid: boolean; errors: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateData(patientData, async (data) => {
 *   const errors = [];
 *   if (!data.name) errors.push('Name is required');
 *   if (!data.email) errors.push('Email is required');
 *   return errors;
 * });
 * ```
 */
export const validateData = async <T>(
  data: Partial<T>,
  validator: (data: Partial<T>) => Promise<string[]> | string[],
): Promise<{ valid: boolean; errors: string[] }> => {
  const errors = await validator(data);
  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Creates a record with validation pipeline.
 *
 * @template T
 * @param {any} model - Sequelize model
 * @param {Partial<T>} data - Data to create
 * @param {(data: Partial<T>) => Promise<string[]> | string[]} validator - Validator function
 * @param {CrudOptions} [options] - CRUD options
 * @returns {Promise<T>} Created record
 * @throws {Error} If validation fails
 *
 * @example
 * ```typescript
 * const patient = await createWithValidation(
 *   PatientModel,
 *   patientData,
 *   async (data) => {
 *     const errors = [];
 *     if (!data.name) errors.push('Name required');
 *     return errors;
 *   }
 * );
 * ```
 */
export const createWithValidation = async <T>(
  model: any,
  data: Partial<T>,
  validator: (data: Partial<T>) => Promise<string[]> | string[],
  options?: CrudOptions,
): Promise<T> => {
  const validation = await validateData(data, validator);

  if (!validation.valid) {
    throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
  }

  return createSingle(model, data, options);
};

/**
 * Updates a record with validation pipeline.
 *
 * @template T
 * @param {any} model - Sequelize model
 * @param {string} id - Record ID
 * @param {Partial<T>} data - Data to update
 * @param {(data: Partial<T>) => Promise<string[]> | string[]} validator - Validator function
 * @param {CrudOptions} [options] - CRUD options
 * @returns {Promise<T | null>} Updated record
 * @throws {Error} If validation fails
 *
 * @example
 * ```typescript
 * const patient = await updateWithValidation(
 *   PatientModel,
 *   'patient-123',
 *   updateData,
 *   async (data) => validatePatientData(data)
 * );
 * ```
 */
export const updateWithValidation = async <T>(
  model: any,
  id: string,
  data: Partial<T>,
  validator: (data: Partial<T>) => Promise<string[]> | string[],
  options?: CrudOptions,
): Promise<T | null> => {
  const validation = await validateData(data, validator);

  if (!validation.valid) {
    throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
  }

  return updateSingle(model, id, data, options);
};

export default {
  // Generic service factory
  createGenericCrudService,
  createRepository,

  // Create operations
  createSingle,
  createBulk,
  createBatch,
  createWithAudit,

  // Read operations
  findById,
  findOne,
  findAllPaginated,
  searchRecords,

  // Update operations
  updateSingle,
  updateBulk,
  partialUpdate,
  fullUpdate,
  updateWithOptimisticLock,

  // Delete operations
  softDelete,
  hardDelete,
  bulkSoftDelete,
  bulkHardDelete,
  restoreDeleted,

  // Upsert operations
  upsert,
  bulkUpsert,

  // Transaction-wrapped CRUD
  executeInTransaction,
  createWithRelationsInTransaction,

  // CRUD with relations
  findWithRelations,
  createWithNestedRelations,

  // Pagination helpers
  calculatePaginationMeta,
  createPaginationFromQuery,

  // Filtering and sorting
  buildWhereClause,
  buildOrderClause,
  parseFiltersFromQuery,

  // Field selection
  selectFields,
  excludeFields,

  // Audit logging
  createAuditLog,
  withAuditLog,

  // Event emitters
  createCrudEvent,
  withCrudEvent,

  // Count and exists operations
  countRecords,
  existsById,
  existsWhere,

  // Aggregation helpers
  findDistinct,
  aggregateByField,

  // Cursor-based pagination
  findWithCursor,

  // Bulk find operations
  findByIds,
  syncWithExternalData,

  // Validation pipeline
  validateData,
  createWithValidation,
  updateWithValidation,
};
