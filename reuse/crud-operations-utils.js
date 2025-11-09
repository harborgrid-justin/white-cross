"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateWithValidation = exports.createWithValidation = exports.validateData = exports.syncWithExternalData = exports.findByIds = exports.findWithCursor = exports.aggregateByField = exports.findDistinct = exports.existsWhere = exports.existsById = exports.countRecords = exports.withCrudEvent = exports.createCrudEvent = exports.withAuditLog = exports.createAuditLog = exports.excludeFields = exports.selectFields = exports.parseFiltersFromQuery = exports.buildOrderClause = exports.buildWhereClause = exports.createPaginationFromQuery = exports.calculatePaginationMeta = exports.createWithNestedRelations = exports.findWithRelations = exports.createWithRelationsInTransaction = exports.executeInTransaction = exports.bulkUpsert = exports.upsert = exports.restoreDeleted = exports.bulkHardDelete = exports.bulkSoftDelete = exports.hardDelete = exports.softDelete = exports.updateWithOptimisticLock = exports.fullUpdate = exports.partialUpdate = exports.updateBulk = exports.updateSingle = exports.searchRecords = exports.findAllPaginated = exports.findOne = exports.findById = exports.createWithAudit = exports.createBatch = exports.createBulk = exports.createSingle = exports.createRepository = exports.createGenericCrudService = void 0;
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
const createGenericCrudService = (model, entityName) => {
    return {
        create: (data, options) => (0, exports.createSingle)(model, data, options),
        findById: (id, options) => (0, exports.findById)(model, id, options),
        findAll: (pagination, options) => (0, exports.findAllPaginated)(model, pagination, options),
        update: (id, data, options) => (0, exports.updateSingle)(model, id, data, options),
        delete: (id, options) => (0, exports.softDelete)(model, id, options),
        entityName,
    };
};
exports.createGenericCrudService = createGenericCrudService;
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
const createRepository = (model) => {
    return {
        findOne: (options) => model.findOne(options),
        findAll: (options) => model.findAll(options),
        findById: (id, options) => (0, exports.findById)(model, id, options),
        save: (data, options) => (0, exports.createSingle)(model, data, options),
        update: (id, data, options) => (0, exports.updateSingle)(model, id, data, options),
        delete: (id, options) => (0, exports.hardDelete)(model, id, options),
        count: (where) => model.count({ where }),
    };
};
exports.createRepository = createRepository;
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
const createSingle = async (model, data, options) => {
    const recordData = { ...data };
    if (options?.userId) {
        recordData.createdBy = options.userId;
        recordData.updatedBy = options.userId;
    }
    recordData.createdAt = new Date();
    recordData.updatedAt = new Date();
    const result = await model.create(recordData, {
        transaction: options?.transaction,
    });
    return result.toJSON();
};
exports.createSingle = createSingle;
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
const createBulk = async (model, dataArray, options) => {
    const enrichedData = dataArray.map((data) => ({
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
    return results.map((r) => r.toJSON());
};
exports.createBulk = createBulk;
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
const createBatch = async (model, dataArray, batchSize = 100, options) => {
    const result = {
        success: [],
        failed: [],
        successCount: 0,
        failureCount: 0,
    };
    for (let i = 0; i < dataArray.length; i += batchSize) {
        const batch = dataArray.slice(i, i + batchSize);
        try {
            const created = await (0, exports.createBulk)(model, batch, options);
            result.success.push(...created);
            result.successCount += created.length;
        }
        catch (error) {
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
exports.createBatch = createBatch;
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
const createWithAudit = async (model, data, userId, transaction) => {
    return (0, exports.createSingle)(model, data, { userId, transaction });
};
exports.createWithAudit = createWithAudit;
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
const findById = async (model, id, options) => {
    const queryOptions = {
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
    return result ? result.toJSON() : null;
};
exports.findById = findById;
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
const findOne = async (model, where, options) => {
    const queryOptions = {
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
    return result ? result.toJSON() : null;
};
exports.findOne = findOne;
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
const findAllPaginated = async (model, pagination, options) => {
    const { page, limit } = pagination;
    const offset = pagination.offset ?? (page - 1) * limit;
    const queryOptions = {
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
        data: rows.map((r) => r.toJSON()),
        total: count,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
    };
};
exports.findAllPaginated = findAllPaginated;
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
const searchRecords = async (model, filters, sort, pagination, options) => {
    const where = (0, exports.buildWhereClause)(filters);
    const order = sort ? sort.map((s) => [s.field, s.order]) : [];
    const queryOptions = {
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
            data: rows.map((r) => r.toJSON()),
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
        data: rows.map((r) => r.toJSON()),
        total: count,
        page: pagination.page,
        limit: pagination.limit,
        totalPages,
        hasNext: pagination.page < totalPages,
        hasPrevious: pagination.page > 1,
    };
};
exports.searchRecords = searchRecords;
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
const updateSingle = async (model, id, data, options) => {
    const record = await model.findOne({
        where: { id },
        transaction: options?.transaction,
    });
    if (!record) {
        return null;
    }
    const updateData = { ...data };
    if (options?.userId) {
        updateData.updatedBy = options.userId;
    }
    updateData.updatedAt = new Date();
    await record.update(updateData, { transaction: options?.transaction });
    return record.toJSON();
};
exports.updateSingle = updateSingle;
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
const updateBulk = async (model, where, data, options) => {
    const updateData = { ...data };
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
exports.updateBulk = updateBulk;
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
const partialUpdate = async (model, id, partialData, options) => {
    return (0, exports.updateSingle)(model, id, partialData, options);
};
exports.partialUpdate = partialUpdate;
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
const fullUpdate = async (model, id, fullData, options) => {
    return (0, exports.updateSingle)(model, id, fullData, options);
};
exports.fullUpdate = fullUpdate;
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
const updateWithOptimisticLock = async (model, id, data, lockOptions, options) => {
    const { versionField, expectedVersion } = lockOptions;
    const record = await model.findOne({
        where: { id },
        transaction: options?.transaction,
    });
    if (!record) {
        throw new Error(`Record with ID ${id} not found`);
    }
    const currentVersion = record[versionField];
    if (currentVersion !== expectedVersion) {
        throw new Error(`Version mismatch: expected ${expectedVersion}, got ${currentVersion}. ` +
            `Record was modified by another process.`);
    }
    const updateData = {
        ...data,
        [versionField]: currentVersion + 1,
        updatedAt: new Date(),
    };
    if (options?.userId) {
        updateData.updatedBy = options.userId;
    }
    await record.update(updateData, { transaction: options?.transaction });
    return record.toJSON();
};
exports.updateWithOptimisticLock = updateWithOptimisticLock;
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
const softDelete = async (model, id, options) => {
    const record = await model.findOne({
        where: { id },
        transaction: options?.transaction,
    });
    if (!record) {
        return false;
    }
    const updateData = {
        deletedAt: new Date(),
    };
    if (options?.userId) {
        updateData.deletedBy = options.userId;
    }
    await record.update(updateData, { transaction: options?.transaction });
    return true;
};
exports.softDelete = softDelete;
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
const hardDelete = async (model, id, options) => {
    const affectedCount = await model.destroy({
        where: { id },
        transaction: options?.transaction,
        force: true,
    });
    return affectedCount > 0;
};
exports.hardDelete = hardDelete;
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
const bulkSoftDelete = async (model, where, options) => {
    const updateData = {
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
exports.bulkSoftDelete = bulkSoftDelete;
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
const bulkHardDelete = async (model, where, options) => {
    const affectedCount = await model.destroy({
        where,
        transaction: options?.transaction,
        force: true,
    });
    return affectedCount;
};
exports.bulkHardDelete = bulkHardDelete;
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
const restoreDeleted = async (model, id, options) => {
    const record = await model.findOne({
        where: { id },
        paranoid: false,
        transaction: options?.transaction,
    });
    if (!record) {
        return false;
    }
    await record.update({ deletedAt: null, deletedBy: null }, { transaction: options?.transaction });
    return true;
};
exports.restoreDeleted = restoreDeleted;
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
const upsert = async (model, data, conflictFields, options) => {
    const where = {};
    conflictFields.forEach((field) => {
        where[field] = data[field];
    });
    const existing = await model.findOne({
        where,
        transaction: options?.transaction,
    });
    if (existing) {
        const updated = await (0, exports.updateSingle)(model, existing.id, data, options);
        return {
            data: updated,
            created: false,
            updated: true,
        };
    }
    else {
        const created = await (0, exports.createSingle)(model, data, options);
        return {
            data: created,
            created: true,
            updated: false,
        };
    }
};
exports.upsert = upsert;
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
const bulkUpsert = async (model, dataArray, conflictFields, options) => {
    const result = {
        success: [],
        failed: [],
        successCount: 0,
        failureCount: 0,
    };
    for (let i = 0; i < dataArray.length; i++) {
        try {
            const upsertResult = await (0, exports.upsert)(model, dataArray[i], conflictFields, options);
            result.success.push(upsertResult.data);
            result.successCount++;
        }
        catch (error) {
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
exports.bulkUpsert = bulkUpsert;
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
const executeInTransaction = async (sequelize, operation) => {
    const transaction = await sequelize.transaction();
    try {
        const result = await operation(transaction);
        await transaction.commit();
        return result;
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
};
exports.executeInTransaction = executeInTransaction;
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
const createWithRelationsInTransaction = async (sequelize, operations, options) => {
    return (0, exports.executeInTransaction)(sequelize, async (transaction) => {
        const results = [];
        for (const op of operations) {
            const result = await (0, exports.createSingle)(op.model, op.data, {
                ...options,
                transaction,
            });
            results.push(result);
        }
        return results;
    });
};
exports.createWithRelationsInTransaction = createWithRelationsInTransaction;
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
const findWithRelations = async (model, id, relations, options) => {
    return (0, exports.findById)(model, id, { ...options, relations });
};
exports.findWithRelations = findWithRelations;
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
const createWithNestedRelations = async (sequelize, model, data, relationModels, options) => {
    return (0, exports.executeInTransaction)(sequelize, async (transaction) => {
        const { ...mainData } = data;
        const relationData = {};
        Object.keys(relationModels).forEach((relationName) => {
            if (mainData[relationName]) {
                relationData[relationName] = mainData[relationName];
                delete mainData[relationName];
            }
        });
        const mainRecord = await (0, exports.createSingle)(model, mainData, {
            ...options,
            transaction,
        });
        for (const [relationName, relatedItems] of Object.entries(relationData)) {
            const relationModel = relationModels[relationName];
            for (const item of relatedItems) {
                await (0, exports.createSingle)(relationModel, { ...item, [model.name.toLowerCase() + 'Id']: mainRecord.id }, { ...options, transaction });
            }
        }
        return (0, exports.findById)(model, mainRecord.id, {
            ...options,
            relations: Object.keys(relationModels),
            transaction,
        });
    });
};
exports.createWithNestedRelations = createWithNestedRelations;
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
const calculatePaginationMeta = (page, limit, total) => {
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
exports.calculatePaginationMeta = calculatePaginationMeta;
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
const createPaginationFromQuery = (query, defaultLimit = 20, maxLimit = 100) => {
    const page = Math.max(1, parseInt(query.page || '1', 10));
    const limit = Math.min(maxLimit, Math.max(1, parseInt(query.limit || String(defaultLimit), 10)));
    const offset = (page - 1) * limit;
    return { page, limit, offset };
};
exports.createPaginationFromQuery = createPaginationFromQuery;
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
const buildWhereClause = (filters) => {
    const where = {};
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
exports.buildWhereClause = buildWhereClause;
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
const buildOrderClause = (sortOptions) => {
    return sortOptions.map((sort) => [sort.field, sort.order]);
};
exports.buildOrderClause = buildOrderClause;
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
const parseFiltersFromQuery = (query) => {
    const filters = [];
    const filterPattern = /^filter\[(\w+)\]\[(\w+)\]$/;
    Object.keys(query).forEach((key) => {
        const match = key.match(filterPattern);
        if (match) {
            const [, field, operator] = match;
            filters.push({
                field,
                operator: operator,
                value: query[key],
            });
        }
    });
    return filters;
};
exports.parseFiltersFromQuery = parseFiltersFromQuery;
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
const selectFields = async (model, fields, where, options) => {
    const results = await model.findAll({
        attributes: fields,
        where: where || {},
        transaction: options?.transaction,
    });
    return results.map((r) => r.toJSON());
};
exports.selectFields = selectFields;
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
const excludeFields = async (model, excludeFields, where, options) => {
    const results = await model.findAll({
        attributes: { exclude: excludeFields },
        where: where || {},
        transaction: options?.transaction,
    });
    return results.map((r) => r.toJSON());
};
exports.excludeFields = excludeFields;
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
const createAuditLog = (action, entityName, entityId, userId, changes) => {
    return {
        action,
        entityName,
        entityId,
        userId,
        timestamp: new Date(),
        changes,
    };
};
exports.createAuditLog = createAuditLog;
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
const withAuditLog = async (operation, action, entityName, entityId, logHandler, userId) => {
    const result = await operation();
    const auditLog = (0, exports.createAuditLog)(action, entityName, entityId, userId);
    await logHandler(auditLog);
    return result;
};
exports.withAuditLog = withAuditLog;
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
const createCrudEvent = (action, entity, metadata) => {
    return {
        action,
        entity,
        metadata: metadata || {},
    };
};
exports.createCrudEvent = createCrudEvent;
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
const withCrudEvent = async (operation, action, emitter, metadata) => {
    const result = await operation();
    const event = (0, exports.createCrudEvent)(action, result, metadata);
    emitter(event);
    return result;
};
exports.withCrudEvent = withCrudEvent;
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
const countRecords = async (model, where, options) => {
    const queryWhere = { ...where };
    if (!options?.includeDeleted) {
        queryWhere.deletedAt = null;
    }
    return model.count({
        where: queryWhere,
        transaction: options?.transaction,
    });
};
exports.countRecords = countRecords;
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
const existsById = async (model, id, options) => {
    const count = await (0, exports.countRecords)(model, { id }, options);
    return count > 0;
};
exports.existsById = existsById;
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
const existsWhere = async (model, where, options) => {
    const count = await (0, exports.countRecords)(model, where, options);
    return count > 0;
};
exports.existsWhere = existsWhere;
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
const findDistinct = async (model, field, where, options) => {
    const results = await model.findAll({
        attributes: [[model.sequelize.fn('DISTINCT', model.sequelize.col(field)), field]],
        where: where || {},
        transaction: options?.transaction,
        raw: true,
    });
    return results.map((r) => r[field]);
};
exports.findDistinct = findDistinct;
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
const aggregateByField = async (model, groupField, where, options) => {
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
    return results.map((r) => ({
        value: r[groupField],
        count: parseInt(r.count, 10),
    }));
};
exports.aggregateByField = aggregateByField;
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
const findWithCursor = async (model, cursor, limit = 20, sort, where, options) => {
    const queryWhere = { ...where };
    if (cursor) {
        queryWhere.id = { $gt: cursor };
    }
    if (!options?.includeDeleted) {
        queryWhere.deletedAt = null;
    }
    const order = sort ? (0, exports.buildOrderClause)(sort) : [['id', 'ASC']];
    const results = await model.findAll({
        where: queryWhere,
        limit: limit + 1,
        order,
        transaction: options?.transaction,
    });
    const hasMore = results.length > limit;
    const data = results.slice(0, limit).map((r) => r.toJSON());
    const nextCursor = hasMore && data.length > 0 ? data[data.length - 1].id : null;
    return {
        data,
        nextCursor,
        hasMore,
    };
};
exports.findWithCursor = findWithCursor;
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
const findByIds = async (model, ids, options) => {
    const queryOptions = {
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
    return results.map((r) => r.toJSON());
};
exports.findByIds = findByIds;
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
const syncWithExternalData = async (sequelize, model, externalData, conflictFields, options) => {
    return (0, exports.executeInTransaction)(sequelize, async (transaction) => {
        const stats = { created: 0, updated: 0, deleted: 0 };
        const txOptions = { ...options, transaction };
        // Get all existing records
        const existingRecords = await model.findAll({
            transaction,
            where: !options?.includeDeleted ? { deletedAt: null } : {},
        });
        const existingIds = new Set(existingRecords.map((r) => r.id));
        const externalIds = new Set(externalData.map((d) => d.id).filter(Boolean));
        // Upsert external data
        for (const data of externalData) {
            const result = await (0, exports.upsert)(model, data, conflictFields, txOptions);
            if (result.created) {
                stats.created++;
            }
            else if (result.updated) {
                stats.updated++;
            }
        }
        // Delete records not in external data
        for (const existingRecord of existingRecords) {
            const recordId = existingRecord.id;
            if (!externalIds.has(recordId)) {
                await (0, exports.softDelete)(model, recordId, txOptions);
                stats.deleted++;
            }
        }
        return stats;
    });
};
exports.syncWithExternalData = syncWithExternalData;
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
const validateData = async (data, validator) => {
    const errors = await validator(data);
    return {
        valid: errors.length === 0,
        errors,
    };
};
exports.validateData = validateData;
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
const createWithValidation = async (model, data, validator, options) => {
    const validation = await (0, exports.validateData)(data, validator);
    if (!validation.valid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }
    return (0, exports.createSingle)(model, data, options);
};
exports.createWithValidation = createWithValidation;
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
const updateWithValidation = async (model, id, data, validator, options) => {
    const validation = await (0, exports.validateData)(data, validator);
    if (!validation.valid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }
    return (0, exports.updateSingle)(model, id, data, options);
};
exports.updateWithValidation = updateWithValidation;
exports.default = {
    // Generic service factory
    createGenericCrudService: exports.createGenericCrudService,
    createRepository: exports.createRepository,
    // Create operations
    createSingle: exports.createSingle,
    createBulk: exports.createBulk,
    createBatch: exports.createBatch,
    createWithAudit: exports.createWithAudit,
    // Read operations
    findById: exports.findById,
    findOne: exports.findOne,
    findAllPaginated: exports.findAllPaginated,
    searchRecords: exports.searchRecords,
    // Update operations
    updateSingle: exports.updateSingle,
    updateBulk: exports.updateBulk,
    partialUpdate: exports.partialUpdate,
    fullUpdate: exports.fullUpdate,
    updateWithOptimisticLock: exports.updateWithOptimisticLock,
    // Delete operations
    softDelete: exports.softDelete,
    hardDelete: exports.hardDelete,
    bulkSoftDelete: exports.bulkSoftDelete,
    bulkHardDelete: exports.bulkHardDelete,
    restoreDeleted: exports.restoreDeleted,
    // Upsert operations
    upsert: exports.upsert,
    bulkUpsert: exports.bulkUpsert,
    // Transaction-wrapped CRUD
    executeInTransaction: exports.executeInTransaction,
    createWithRelationsInTransaction: exports.createWithRelationsInTransaction,
    // CRUD with relations
    findWithRelations: exports.findWithRelations,
    createWithNestedRelations: exports.createWithNestedRelations,
    // Pagination helpers
    calculatePaginationMeta: exports.calculatePaginationMeta,
    createPaginationFromQuery: exports.createPaginationFromQuery,
    // Filtering and sorting
    buildWhereClause: exports.buildWhereClause,
    buildOrderClause: exports.buildOrderClause,
    parseFiltersFromQuery: exports.parseFiltersFromQuery,
    // Field selection
    selectFields: exports.selectFields,
    excludeFields: exports.excludeFields,
    // Audit logging
    createAuditLog: exports.createAuditLog,
    withAuditLog: exports.withAuditLog,
    // Event emitters
    createCrudEvent: exports.createCrudEvent,
    withCrudEvent: exports.withCrudEvent,
    // Count and exists operations
    countRecords: exports.countRecords,
    existsById: exports.existsById,
    existsWhere: exports.existsWhere,
    // Aggregation helpers
    findDistinct: exports.findDistinct,
    aggregateByField: exports.aggregateByField,
    // Cursor-based pagination
    findWithCursor: exports.findWithCursor,
    // Bulk find operations
    findByIds: exports.findByIds,
    syncWithExternalData: exports.syncWithExternalData,
    // Validation pipeline
    validateData: exports.validateData,
    createWithValidation: exports.createWithValidation,
    updateWithValidation: exports.updateWithValidation,
};
//# sourceMappingURL=crud-operations-utils.js.map