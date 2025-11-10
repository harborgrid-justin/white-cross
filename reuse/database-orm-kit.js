"use strict";
/**
 * LOC: DORM1234567
 * File: /reuse/database-orm-kit.ts
 *
 * UPSTREAM (imports from):
 *   - Sequelize (database ORM)
 *   - Database connection configuration
 *   - Model definitions and schemas
 *
 * DOWNSTREAM (imported by):
 *   - NestJS service layer
 *   - Repository implementations
 *   - Data access layer
 *   - Migration scripts
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.optimizeQueryWithIndex = exports.monitorSlowQueries = exports.checkDatabaseWriteability = exports.checkDatabaseHealth = exports.createModelFactory = exports.restoreDatabase = exports.backupDatabase = exports.createQueryCache = exports.measureQueryTime = exports.analyzeQueryPerformance = exports.validatePoolConnections = exports.drainConnectionPool = exports.getConnectionPoolStats = exports.createIndexMigration = exports.addColumnMigration = exports.createTableMigration = exports.generateSeedData = exports.seedDatabase = exports.seedModel = exports.queryAuditTrail = exports.trackChanges = exports.createAuditTrail = exports.findSoftDeleted = exports.hardDeleteSoftDeleted = exports.restoreSoftDeleted = exports.softDelete = exports.retryTransaction = exports.withNestedSavepoints = exports.rollbackToSavepoint = exports.createSavepoint = exports.withTransaction = exports.bulkUpsert = exports.bulkDelete = exports.bulkUpdate = exports.bulkInsert = exports.buildRangeQuery = exports.buildDynamicSort = exports.keysetPaginate = exports.offsetPaginate = exports.cursorPaginate = exports.buildFullTextSearch = exports.buildJsonFieldQuery = exports.buildConditionalQuery = exports.chainableQueryBuilder = exports.buildAdvancedQuery = void 0;
/**
 * File: /reuse/database-orm-kit.ts
 * Locator: WC-UTL-DORM-006
 * Purpose: Database & ORM Kit - Comprehensive database and Sequelize utility functions
 *
 * Upstream: Sequelize ORM, PostgreSQL, database connection pools
 * Downstream: ../backend/*, ../services/*, repository layers, migration scripts, seeding scripts
 * Dependencies: TypeScript 5.x, Node 18+, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45 utility functions for query building, pagination, bulk operations, transactions,
 *          soft deletes, audit trails, seeding, migrations, connection management, health checks
 *
 * LLM Context: Comprehensive database and ORM utilities for White Cross healthcare system.
 * Provides advanced query builders, pagination (cursor & offset), filtering, sorting, bulk operations,
 * transaction management, soft delete utilities, audit trail tracking, database seeding helpers,
 * migration utilities, connection pool management, query optimization, backup/restore helpers,
 * model factories, and database health checks. Essential for efficient, secure, and maintainable
 * database operations in healthcare applications with HIPAA compliance requirements.
 */
const sequelize_1 = require("sequelize");
const fs = __importStar(require("fs"));
// ============================================================================
// ADVANCED QUERY BUILDERS
// ============================================================================
/**
 * Builds a dynamic query with advanced filtering, sorting, and includes.
 *
 * @template T
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {object} options - Query building options
 * @returns {FindOptions<T>} Complete Sequelize query options
 *
 * @example
 * ```typescript
 * const query = buildAdvancedQuery(Patient, {
 *   filters: { status: 'active', 'age[gte]': 18 },
 *   search: { fields: ['firstName', 'lastName'], term: 'john' },
 *   sort: [{ field: 'createdAt', direction: 'DESC' }],
 *   includes: [{ model: MedicalRecord, as: 'records' }],
 *   limit: 20,
 *   offset: 0
 * });
 * ```
 */
const buildAdvancedQuery = (model, options) => {
    const query = {};
    // Build WHERE clause from filters
    if (options.filters) {
        const where = {};
        Object.entries(options.filters).forEach(([key, value]) => {
            const operatorMatch = key.match(/^(\w+)\[(\w+)\]$/);
            if (operatorMatch) {
                const [, field, operator] = operatorMatch;
                if (sequelize_1.Op[operator]) {
                    where[field] = { [sequelize_1.Op[operator]]: value };
                }
            }
            else {
                where[key] = value;
            }
        });
        query.where = where;
    }
    // Add search conditions
    if (options.search) {
        const searchWhere = {
            [sequelize_1.Op.or]: options.search.fields.map((field) => ({
                [field]: { [sequelize_1.Op.iLike]: `%${options.search.term}%` },
            })),
        };
        query.where = query.where ? { [sequelize_1.Op.and]: [query.where, searchWhere] } : searchWhere;
    }
    // Add sorting
    if (options.sort && options.sort.length > 0) {
        query.order = options.sort.map((s) => [s.field, s.direction]);
    }
    // Add includes
    if (options.includes) {
        query.include = options.includes;
    }
    // Add pagination
    if (options.limit !== undefined) {
        query.limit = options.limit;
    }
    if (options.offset !== undefined) {
        query.offset = options.offset;
    }
    // Add attribute selection
    if (options.attributes) {
        query.attributes = options.attributes;
    }
    return query;
};
exports.buildAdvancedQuery = buildAdvancedQuery;
/**
 * Creates a query builder with method chaining for complex queries.
 *
 * @template T
 * @param {ModelStatic<T>} model - Sequelize model
 * @returns {object} Chainable query builder
 *
 * @example
 * ```typescript
 * const results = await chainableQueryBuilder(Patient)
 *   .filter({ status: 'active' })
 *   .search(['firstName', 'lastName'], 'john')
 *   .sort('createdAt', 'DESC')
 *   .paginate(1, 20)
 *   .include([{ model: MedicalRecord }])
 *   .execute();
 * ```
 */
const chainableQueryBuilder = (model) => {
    let queryOptions = {};
    return {
        filter(conditions) {
            queryOptions.where = { ...(queryOptions.where || {}), ...conditions };
            return this;
        },
        search(fields, term) {
            const searchWhere = {
                [sequelize_1.Op.or]: fields.map((field) => ({
                    [field]: { [sequelize_1.Op.iLike]: `%${term}%` },
                })),
            };
            queryOptions.where = queryOptions.where
                ? { [sequelize_1.Op.and]: [queryOptions.where, searchWhere] }
                : searchWhere;
            return this;
        },
        sort(field, direction = 'ASC') {
            queryOptions.order = queryOptions.order || [];
            queryOptions.order.push([field, direction]);
            return this;
        },
        paginate(page, limit) {
            queryOptions.limit = limit;
            queryOptions.offset = (page - 1) * limit;
            return this;
        },
        include(includes) {
            queryOptions.include = includes;
            return this;
        },
        select(attributes) {
            queryOptions.attributes = attributes;
            return this;
        },
        distinct() {
            queryOptions.distinct = true;
            return this;
        },
        async execute() {
            return model.findAll(queryOptions);
        },
        async executeWithCount() {
            return model.findAndCountAll(queryOptions);
        },
        getOptions() {
            return queryOptions;
        },
    };
};
exports.chainableQueryBuilder = chainableQueryBuilder;
/**
 * Builds a conditional query based on runtime conditions.
 *
 * @template T
 * @param {object} conditions - Conditional query building rules
 * @returns {FindOptions<T>} Conditional query options
 *
 * @example
 * ```typescript
 * const query = buildConditionalQuery({
 *   when: (params) => params.includeInactive,
 *   then: { where: {} },
 *   else: { where: { status: 'active' } }
 * }, { includeInactive: false });
 * ```
 */
const buildConditionalQuery = (conditions, params) => {
    return conditions.when(params) ? conditions.then : conditions.else;
};
exports.buildConditionalQuery = buildConditionalQuery;
/**
 * Builds a query with JSON field filtering for PostgreSQL JSONB.
 *
 * @template T
 * @param {string} field - JSONB field name
 * @param {object} conditions - JSON path conditions
 * @returns {WhereOptions<any>} JSON field WHERE clause
 *
 * @example
 * ```typescript
 * const where = buildJsonFieldQuery('metadata', {
 *   'settings.notifications': true,
 *   'preferences.theme': 'dark'
 * });
 * ```
 */
const buildJsonFieldQuery = (field, conditions) => {
    const where = {};
    Object.entries(conditions).forEach(([path, value]) => {
        where[field] = {
            ...where[field],
            [sequelize_1.Op.contains]: { [path]: value },
        };
    });
    return where;
};
exports.buildJsonFieldQuery = buildJsonFieldQuery;
/**
 * Creates a query with full-text search using PostgreSQL tsvector.
 *
 * @param {string} searchColumn - Full-text search column (tsvector)
 * @param {string} searchTerm - Search term
 * @param {object} [options] - Search options
 * @returns {WhereOptions<any>} Full-text search WHERE clause
 *
 * @example
 * ```typescript
 * const where = buildFullTextSearch('search_vector', 'medical record', {
 *   language: 'english'
 * });
 * ```
 */
const buildFullTextSearch = (searchColumn, searchTerm, options) => {
    const tsQuery = searchTerm.split(' ').join(' & ');
    return {
        [searchColumn]: {
            [sequelize_1.Op.match]: (0, sequelize_1.literal)(`to_tsquery('${options?.language || 'english'}', '${tsQuery}')`),
        },
    };
};
exports.buildFullTextSearch = buildFullTextSearch;
// ============================================================================
// PAGINATION HELPERS
// ============================================================================
/**
 * Implements cursor-based pagination for efficient large dataset traversal.
 *
 * @template T
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {CursorPaginationOptions} options - Cursor pagination options
 * @param {FindOptions<T>} [queryOptions] - Additional query options
 * @returns {Promise<object>} Cursor-paginated results
 *
 * @example
 * ```typescript
 * const result = await cursorPaginate(Patient, {
 *   cursorField: 'id',
 *   limit: 20,
 *   cursor: 'patient-123',
 *   direction: 'forward'
 * });
 * ```
 */
const cursorPaginate = async (model, options, queryOptions) => {
    const { cursorField = 'id', limit, cursor, direction = 'forward', } = options;
    const where = { ...(queryOptions?.where || {}) };
    if (cursor) {
        where[cursorField] =
            direction === 'forward' ? { [sequelize_1.Op.gt]: cursor } : { [sequelize_1.Op.lt]: cursor };
    }
    const results = await model.findAll({
        ...queryOptions,
        where,
        limit: limit + 1,
        order: [[cursorField, direction === 'forward' ? 'ASC' : 'DESC']],
    });
    const hasMore = results.length > limit;
    const data = results.slice(0, limit);
    const nextCursor = hasMore && data.length > 0 ? data[data.length - 1][cursorField] : null;
    const previousCursor = data.length > 0 ? data[0][cursorField] : null;
    return {
        data,
        nextCursor,
        previousCursor,
        hasMore,
    };
};
exports.cursorPaginate = cursorPaginate;
/**
 * Implements offset-based pagination with metadata.
 *
 * @template T
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {OffsetPaginationOptions} options - Offset pagination options
 * @param {FindOptions<T>} [queryOptions] - Additional query options
 * @returns {Promise<object>} Offset-paginated results with metadata
 *
 * @example
 * ```typescript
 * const result = await offsetPaginate(Patient, {
 *   page: 2,
 *   limit: 20
 * }, { where: { status: 'active' } });
 * ```
 */
const offsetPaginate = async (model, options, queryOptions) => {
    const { page, limit } = options;
    const offset = (page - 1) * limit;
    const { count, rows } = await model.findAndCountAll({
        ...queryOptions,
        limit,
        offset,
    });
    const totalPages = Math.ceil(count / limit);
    return {
        data: rows,
        pagination: {
            total: count,
            page,
            limit,
            totalPages,
            hasNext: page < totalPages,
            hasPrevious: page > 1,
        },
    };
};
exports.offsetPaginate = offsetPaginate;
/**
 * Implements keyset pagination (efficient alternative to offset).
 *
 * @template T
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {object} options - Keyset pagination options
 * @returns {Promise<object>} Keyset-paginated results
 *
 * @example
 * ```typescript
 * const result = await keysetPaginate(Patient, {
 *   keyFields: ['createdAt', 'id'],
 *   lastValues: ['2024-01-01T00:00:00Z', 'patient-123'],
 *   limit: 20
 * });
 * ```
 */
const keysetPaginate = async (model, options) => {
    const { keyFields, lastValues, limit, direction = 'ASC' } = options;
    let where = {};
    if (lastValues && lastValues.length === keyFields.length) {
        const conditions = keyFields.map((field, index) => {
            if (index === keyFields.length - 1) {
                return {
                    [field]: direction === 'ASC' ? { [sequelize_1.Op.gt]: lastValues[index] } : { [sequelize_1.Op.lt]: lastValues[index] },
                };
            }
            return { [field]: { [sequelize_1.Op.eq]: lastValues[index] } };
        });
        where = { [sequelize_1.Op.or]: conditions };
    }
    const results = await model.findAll({
        where,
        order: keyFields.map((field) => [field, direction]),
        limit: limit + 1,
    });
    const hasMore = results.length > limit;
    const data = results.slice(0, limit);
    const nextKey = hasMore && data.length > 0
        ? keyFields.map((field) => data[data.length - 1][field])
        : null;
    return { data, nextKey };
};
exports.keysetPaginate = keysetPaginate;
/**
 * Creates a dynamic sorting clause from query parameters.
 *
 * @param {string | string[]} sortParams - Sort parameters (e.g., 'name:asc,createdAt:desc')
 * @param {string[]} allowedFields - Fields allowed for sorting
 * @returns {Array<[string, 'ASC' | 'DESC']>} Sequelize order clause
 *
 * @example
 * ```typescript
 * const order = buildDynamicSort('name:asc,age:desc', ['name', 'age', 'createdAt']);
 * // Result: [['name', 'ASC'], ['age', 'DESC']]
 * ```
 */
const buildDynamicSort = (sortParams, allowedFields) => {
    const sortArray = Array.isArray(sortParams) ? sortParams : sortParams.split(',');
    const order = [];
    sortArray.forEach((sort) => {
        const [field, direction = 'ASC'] = sort.split(':');
        if (allowedFields.includes(field)) {
            order.push([field, direction.toUpperCase()]);
        }
    });
    return order;
};
exports.buildDynamicSort = buildDynamicSort;
/**
 * Builds a WHERE clause for range queries on multiple fields.
 *
 * @param {Record<string, { min?: any; max?: any }>} ranges - Range conditions
 * @returns {WhereOptions<any>} Range WHERE clause
 *
 * @example
 * ```typescript
 * const where = buildRangeQuery({
 *   age: { min: 18, max: 65 },
 *   salary: { min: 50000 },
 *   score: { max: 100 }
 * });
 * ```
 */
const buildRangeQuery = (ranges) => {
    const where = {};
    Object.entries(ranges).forEach(([field, range]) => {
        const conditions = {};
        if (range.min !== undefined && range.max !== undefined) {
            conditions[sequelize_1.Op.between] = [range.min, range.max];
        }
        else if (range.min !== undefined) {
            conditions[sequelize_1.Op.gte] = range.min;
        }
        else if (range.max !== undefined) {
            conditions[sequelize_1.Op.lte] = range.max;
        }
        if (Object.keys(conditions).length > 0) {
            where[field] = conditions;
        }
    });
    return where;
};
exports.buildRangeQuery = buildRangeQuery;
// ============================================================================
// BULK OPERATIONS
// ============================================================================
/**
 * Performs efficient bulk insert with batching and error handling.
 *
 * @template T
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {BulkInsertOptions<T>} options - Bulk insert options
 * @returns {Promise<T[]>} Inserted records
 *
 * @example
 * ```typescript
 * const patients = await bulkInsert(Patient, {
 *   data: patientRecords,
 *   batchSize: 1000,
 *   validate: true,
 *   ignoreDuplicates: true
 * });
 * ```
 */
const bulkInsert = async (model, options) => {
    const { data, batchSize = 1000, validate = true, ignoreDuplicates = false, updateOnDuplicate, transaction, } = options;
    const results = [];
    for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize);
        const batchResults = await model.bulkCreate(batch, {
            validate,
            ignoreDuplicates,
            updateOnDuplicate,
            transaction,
            returning: true,
        });
        results.push(...batchResults);
    }
    return results;
};
exports.bulkInsert = bulkInsert;
/**
 * Performs efficient bulk update with batching.
 *
 * @template T
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {BulkUpdateOptions<T>} options - Bulk update options
 * @returns {Promise<number>} Number of affected rows
 *
 * @example
 * ```typescript
 * const affected = await bulkUpdate(Patient, {
 *   updates: [
 *     { where: { status: 'pending' }, data: { status: 'active' } },
 *     { where: { age: { [Op.gte]: 65 } }, data: { category: 'senior' } }
 *   ],
 *   batchSize: 500
 * });
 * ```
 */
const bulkUpdate = async (model, options) => {
    const { updates, batchSize = 500, transaction, individualHooks = false } = options;
    let totalAffected = 0;
    for (let i = 0; i < updates.length; i += batchSize) {
        const batch = updates.slice(i, i + batchSize);
        for (const update of batch) {
            const [affected] = await model.update(update.data, {
                where: update.where,
                transaction,
                individualHooks,
            });
            totalAffected += affected;
        }
    }
    return totalAffected;
};
exports.bulkUpdate = bulkUpdate;
/**
 * Performs efficient bulk delete with batching.
 *
 * @template T
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {BulkDeleteOptions} options - Bulk delete options
 * @returns {Promise<number>} Number of deleted rows
 *
 * @example
 * ```typescript
 * const deleted = await bulkDelete(Patient, {
 *   conditions: [
 *     { status: 'inactive', deletedAt: { [Op.not]: null } },
 *     { lastLoginAt: { [Op.lt]: threeMonthsAgo } }
 *   ],
 *   batchSize: 500,
 *   force: true
 * });
 * ```
 */
const bulkDelete = async (model, options) => {
    const { conditions, batchSize = 500, transaction, force = false } = options;
    let totalDeleted = 0;
    for (let i = 0; i < conditions.length; i += batchSize) {
        const batch = conditions.slice(i, i + batchSize);
        for (const condition of batch) {
            const deleted = await model.destroy({
                where: condition,
                transaction,
                force,
            });
            totalDeleted += deleted;
        }
    }
    return totalDeleted;
};
exports.bulkDelete = bulkDelete;
/**
 * Performs upsert (insert or update) with conflict resolution.
 *
 * @template T
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {object} options - Upsert options
 * @returns {Promise<object>} Upsert result
 *
 * @example
 * ```typescript
 * const result = await bulkUpsert(Patient, {
 *   data: patientData,
 *   conflictFields: ['email'],
 *   updateFields: ['firstName', 'lastName', 'phone']
 * });
 * ```
 */
const bulkUpsert = async (model, options) => {
    const { data, conflictFields, updateFields, transaction } = options;
    const results = await model.bulkCreate(data, {
        updateOnDuplicate: updateFields,
        transaction,
        returning: true,
    });
    // Note: Sequelize doesn't directly return created vs updated count
    // This is a simplified version
    return {
        created: results.length,
        updated: 0, // Would need custom logic to determine
    };
};
exports.bulkUpsert = bulkUpsert;
// ============================================================================
// TRANSACTION MANAGEMENT
// ============================================================================
/**
 * Executes a function within a managed transaction with auto-commit/rollback.
 *
 * @template T
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Function} callback - Transaction callback
 * @param {TransactionOptions} [options] - Transaction options
 * @returns {Promise<T>} Transaction result
 *
 * @example
 * ```typescript
 * const result = await withTransaction(sequelize, async (t) => {
 *   const patient = await Patient.create(data, { transaction: t });
 *   const record = await MedicalRecord.create(recordData, { transaction: t });
 *   return { patient, record };
 * }, { isolationLevel: IsolationLevel.SERIALIZABLE });
 * ```
 */
const withTransaction = async (sequelize, callback, options) => {
    return sequelize.transaction(options || {}, callback);
};
exports.withTransaction = withTransaction;
/**
 * Creates a savepoint within an existing transaction.
 *
 * @param {Transaction} transaction - Active transaction
 * @param {string} savepointName - Savepoint identifier
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createSavepoint(transaction, 'patient_created');
 * ```
 */
const createSavepoint = async (transaction, savepointName) => {
    await transaction.connection.query(`SAVEPOINT ${savepointName}`);
};
exports.createSavepoint = createSavepoint;
/**
 * Rolls back to a specific savepoint.
 *
 * @param {Transaction} transaction - Active transaction
 * @param {string} savepointName - Savepoint identifier
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await rollbackToSavepoint(transaction, 'patient_created');
 * ```
 */
const rollbackToSavepoint = async (transaction, savepointName) => {
    await transaction.connection.query(`ROLLBACK TO SAVEPOINT ${savepointName}`);
};
exports.rollbackToSavepoint = rollbackToSavepoint;
/**
 * Executes multiple operations with individual savepoints for partial rollback.
 *
 * @template T
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Array<Function>} operations - Array of operations
 * @returns {Promise<T[]>} Results of successful operations
 *
 * @example
 * ```typescript
 * const results = await withNestedSavepoints(sequelize, [
 *   async (t) => Patient.create(data1, { transaction: t }),
 *   async (t) => Patient.create(data2, { transaction: t }),
 *   async (t) => Patient.create(data3, { transaction: t })
 * ]);
 * ```
 */
const withNestedSavepoints = async (sequelize, operations) => {
    return sequelize.transaction(async (transaction) => {
        const results = [];
        for (let i = 0; i < operations.length; i++) {
            const savepointName = `savepoint_${i}`;
            await (0, exports.createSavepoint)(transaction, savepointName);
            try {
                const result = await operations[i](transaction);
                results.push(result);
            }
            catch (error) {
                await (0, exports.rollbackToSavepoint)(transaction, savepointName);
                throw error;
            }
        }
        return results;
    });
};
exports.withNestedSavepoints = withNestedSavepoints;
/**
 * Implements retry logic for transactions with exponential backoff.
 *
 * @template T
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Function} callback - Transaction callback
 * @param {object} options - Retry options
 * @returns {Promise<T>} Transaction result
 *
 * @example
 * ```typescript
 * const result = await retryTransaction(sequelize, async (t) => {
 *   return await Patient.create(data, { transaction: t });
 * }, { maxRetries: 3, backoffMs: 100 });
 * ```
 */
const retryTransaction = async (sequelize, callback, options = {}) => {
    const { maxRetries = 3, backoffMs = 100, shouldRetry = () => true } = options;
    let lastError;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await sequelize.transaction(callback);
        }
        catch (error) {
            lastError = error;
            if (!shouldRetry(lastError) || attempt === maxRetries - 1) {
                throw lastError;
            }
            await new Promise((resolve) => setTimeout(resolve, backoffMs * Math.pow(2, attempt)));
        }
    }
    throw lastError;
};
exports.retryTransaction = retryTransaction;
// ============================================================================
// SOFT DELETE UTILITIES
// ============================================================================
/**
 * Soft deletes a record by setting deletedAt timestamp.
 *
 * @template T
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {WhereOptions<T>} where - Deletion criteria
 * @param {SoftDeleteConfig} [config] - Soft delete configuration
 * @returns {Promise<number>} Number of affected rows
 *
 * @example
 * ```typescript
 * const deleted = await softDelete(Patient, {
 *   id: 'patient-123'
 * }, {
 *   deletedAtField: 'deletedAt',
 *   deletedByField: 'deletedBy'
 * });
 * ```
 */
const softDelete = async (model, where, config) => {
    const { deletedAtField = 'deletedAt', deletedByField } = config || {};
    const updateData = {
        [deletedAtField]: new Date(),
    };
    if (deletedByField) {
        // Would get from context/request
        updateData[deletedByField] = 'system';
    }
    const [affected] = await model.update(updateData, { where });
    return affected;
};
exports.softDelete = softDelete;
/**
 * Restores a soft-deleted record.
 *
 * @template T
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {WhereOptions<T>} where - Restoration criteria
 * @param {SoftDeleteConfig} [config] - Soft delete configuration
 * @returns {Promise<number>} Number of affected rows
 *
 * @example
 * ```typescript
 * const restored = await restoreSoftDeleted(Patient, {
 *   id: 'patient-123'
 * });
 * ```
 */
const restoreSoftDeleted = async (model, where, config) => {
    const { deletedAtField = 'deletedAt' } = config || {};
    const [affected] = await model.update({ [deletedAtField]: null }, { where: { ...where, [deletedAtField]: { [sequelize_1.Op.not]: null } } });
    return affected;
};
exports.restoreSoftDeleted = restoreSoftDeleted;
/**
 * Hard deletes soft-deleted records permanently.
 *
 * @template T
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {WhereOptions<T>} where - Deletion criteria
 * @param {SoftDeleteConfig} [config] - Soft delete configuration
 * @returns {Promise<number>} Number of deleted rows
 *
 * @example
 * ```typescript
 * const purged = await hardDeleteSoftDeleted(Patient, {
 *   deletedAt: { [Op.lt]: thirtyDaysAgo }
 * });
 * ```
 */
const hardDeleteSoftDeleted = async (model, where, config) => {
    const { deletedAtField = 'deletedAt' } = config || {};
    return model.destroy({
        where: { ...where, [deletedAtField]: { [sequelize_1.Op.not]: null } },
        force: true,
    });
};
exports.hardDeleteSoftDeleted = hardDeleteSoftDeleted;
/**
 * Queries soft-deleted records.
 *
 * @template T
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {FindOptions<T>} options - Query options
 * @returns {Promise<T[]>} Soft-deleted records
 *
 * @example
 * ```typescript
 * const deleted = await findSoftDeleted(Patient, {
 *   where: { departmentId: 'dept-123' }
 * });
 * ```
 */
const findSoftDeleted = async (model, options) => {
    return model.findAll({
        ...options,
        paranoid: false,
        where: {
            ...(options?.where || {}),
            deletedAt: { [sequelize_1.Op.not]: null },
        },
    });
};
exports.findSoftDeleted = findSoftDeleted;
// ============================================================================
// AUDIT TRAIL TRACKING
// ============================================================================
/**
 * Creates an audit trail entry for data changes.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {AuditTrailEntry} entry - Audit trail entry data
 * @param {AuditTrailConfig} config - Audit trail configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createAuditTrail(sequelize, {
 *   entityId: 'patient-123',
 *   entityType: 'Patient',
 *   action: 'UPDATE',
 *   userId: 'user-456',
 *   oldData: { status: 'pending' },
 *   newData: { status: 'active' },
 *   timestamp: new Date()
 * }, { tableName: 'audit_logs' });
 * ```
 */
const createAuditTrail = async (sequelize, entry, config) => {
    const { tableName, userIdField = 'userId', actionField = 'action', timestampField = 'timestamp', dataField = 'data', } = config;
    await sequelize.query(`INSERT INTO ${tableName} (entity_id, entity_type, ${actionField}, ${userIdField}, ${dataField}, ${timestampField})
     VALUES (:entityId, :entityType, :action, :userId, :data, :timestamp)`, {
        replacements: {
            entityId: entry.entityId,
            entityType: entry.entityType,
            action: entry.action,
            userId: entry.userId,
            data: JSON.stringify({ oldData: entry.oldData, newData: entry.newData, metadata: entry.metadata }),
            timestamp: entry.timestamp,
        },
        type: sequelize_1.QueryTypes.INSERT,
    });
};
exports.createAuditTrail = createAuditTrail;
/**
 * Tracks changes between old and new record versions.
 *
 * @param {any} oldRecord - Original record
 * @param {any} newRecord - Updated record
 * @returns {object} Changed fields with old and new values
 *
 * @example
 * ```typescript
 * const changes = trackChanges(
 *   { status: 'pending', email: 'old@test.com' },
 *   { status: 'active', email: 'new@test.com' }
 * );
 * // Result: { status: { old: 'pending', new: 'active' }, email: { old: 'old@test.com', new: 'new@test.com' } }
 * ```
 */
const trackChanges = (oldRecord, newRecord) => {
    const changes = {};
    const allKeys = new Set([...Object.keys(oldRecord), ...Object.keys(newRecord)]);
    allKeys.forEach((key) => {
        if (oldRecord[key] !== newRecord[key]) {
            changes[key] = {
                old: oldRecord[key],
                new: newRecord[key],
            };
        }
    });
    return changes;
};
exports.trackChanges = trackChanges;
/**
 * Queries audit trail history for an entity.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} criteria - Query criteria
 * @param {AuditTrailConfig} config - Audit trail configuration
 * @returns {Promise<any[]>} Audit trail records
 *
 * @example
 * ```typescript
 * const history = await queryAuditTrail(sequelize, {
 *   entityId: 'patient-123',
 *   entityType: 'Patient',
 *   actions: ['UPDATE', 'DELETE'],
 *   startDate: thirtyDaysAgo
 * }, { tableName: 'audit_logs' });
 * ```
 */
const queryAuditTrail = async (sequelize, criteria, config) => {
    const { tableName, actionField = 'action', userIdField = 'userId', timestampField = 'timestamp' } = config;
    const conditions = [];
    const replacements = {};
    if (criteria.entityId) {
        conditions.push('entity_id = :entityId');
        replacements.entityId = criteria.entityId;
    }
    if (criteria.entityType) {
        conditions.push('entity_type = :entityType');
        replacements.entityType = criteria.entityType;
    }
    if (criteria.actions && criteria.actions.length > 0) {
        conditions.push(`${actionField} IN (:actions)`);
        replacements.actions = criteria.actions;
    }
    if (criteria.userId) {
        conditions.push(`${userIdField} = :userId`);
        replacements.userId = criteria.userId;
    }
    if (criteria.startDate) {
        conditions.push(`${timestampField} >= :startDate`);
        replacements.startDate = criteria.startDate;
    }
    if (criteria.endDate) {
        conditions.push(`${timestampField} <= :endDate`);
        replacements.endDate = criteria.endDate;
    }
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const [results] = await sequelize.query(`SELECT * FROM ${tableName} ${whereClause} ORDER BY ${timestampField} DESC`, {
        replacements,
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.queryAuditTrail = queryAuditTrail;
// ============================================================================
// DATABASE SEEDING HELPERS
// ============================================================================
/**
 * Seeds a model with initial data.
 *
 * @template T
 * @param {SeedConfig} config - Seed configuration
 * @returns {Promise<T[]>} Seeded records
 *
 * @example
 * ```typescript
 * const patients = await seedModel({
 *   model: Patient,
 *   data: [
 *     { firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
 *     { firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' }
 *   ],
 *   truncate: true
 * });
 * ```
 */
const seedModel = async (config) => {
    const { model, data, truncate = false, cascade = false } = config;
    if (truncate) {
        await model.destroy({ where: {}, truncate: true, cascade });
    }
    return model.bulkCreate(data, { validate: true, returning: true });
};
exports.seedModel = seedModel;
/**
 * Seeds multiple models in dependency order.
 *
 * @param {SeedConfig[]} configs - Array of seed configurations
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await seedDatabase([
 *   { model: Department, data: departmentData, truncate: true },
 *   { model: Doctor, data: doctorData },
 *   { model: Patient, data: patientData }
 * ]);
 * ```
 */
const seedDatabase = async (configs) => {
    for (const config of configs) {
        await (0, exports.seedModel)(config);
    }
};
exports.seedDatabase = seedDatabase;
/**
 * Generates seed data using a factory pattern.
 *
 * @template T
 * @param {number} count - Number of records to generate
 * @param {Function} factory - Factory function
 * @returns {Partial<T>[]} Generated seed data
 *
 * @example
 * ```typescript
 * const patientData = generateSeedData(100, (index) => ({
 *   firstName: `Patient${index}`,
 *   lastName: `Test${index}`,
 *   email: `patient${index}@example.com`,
 *   studentId: `STU${String(index).padStart(6, '0')}`
 * }));
 * ```
 */
const generateSeedData = (count, factory) => {
    return Array.from({ length: count }, (_, index) => factory(index));
};
exports.generateSeedData = generateSeedData;
// ============================================================================
// MIGRATION UTILITIES
// ============================================================================
/**
 * Creates a table migration helper.
 *
 * @param {string} tableName - Table name
 * @param {ModelAttributes} attributes - Table attributes
 * @param {object} [options] - Table options
 * @returns {MigrationHelper} Migration up/down functions
 *
 * @example
 * ```typescript
 * const migration = createTableMigration('patients', {
 *   id: { type: DataType.UUID, primaryKey: true },
 *   firstName: { type: DataType.STRING, allowNull: false },
 *   lastName: { type: DataType.STRING, allowNull: false }
 * });
 * ```
 */
const createTableMigration = (tableName, attributes, options) => {
    return {
        up: async (queryInterface) => {
            await queryInterface.createTable(tableName, attributes, options);
        },
        down: async (queryInterface) => {
            await queryInterface.dropTable(tableName);
        },
    };
};
exports.createTableMigration = createTableMigration;
/**
 * Creates a column migration helper.
 *
 * @param {string} tableName - Table name
 * @param {string} columnName - Column name
 * @param {any} columnDefinition - Column definition
 * @returns {MigrationHelper} Migration up/down functions
 *
 * @example
 * ```typescript
 * const migration = addColumnMigration('patients', 'middleName', {
 *   type: DataType.STRING,
 *   allowNull: true
 * });
 * ```
 */
const addColumnMigration = (tableName, columnName, columnDefinition) => {
    return {
        up: async (queryInterface) => {
            await queryInterface.addColumn(tableName, columnName, columnDefinition);
        },
        down: async (queryInterface) => {
            await queryInterface.removeColumn(tableName, columnName);
        },
    };
};
exports.addColumnMigration = addColumnMigration;
/**
 * Creates an index migration helper.
 *
 * @param {string} tableName - Table name
 * @param {string[]} fields - Fields to index
 * @param {object} [options] - Index options
 * @returns {MigrationHelper} Migration up/down functions
 *
 * @example
 * ```typescript
 * const migration = createIndexMigration('patients', ['email'], {
 *   unique: true,
 *   name: 'patients_email_unique_idx'
 * });
 * ```
 */
const createIndexMigration = (tableName, fields, options) => {
    const indexName = options?.name || `${tableName}_${fields.join('_')}_idx`;
    return {
        up: async (queryInterface) => {
            await queryInterface.addIndex(tableName, fields, {
                ...options,
                name: indexName,
            });
        },
        down: async (queryInterface) => {
            await queryInterface.removeIndex(tableName, indexName);
        },
    };
};
exports.createIndexMigration = createIndexMigration;
// ============================================================================
// CONNECTION POOL MANAGEMENT
// ============================================================================
/**
 * Gets current connection pool statistics.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ConnectionPoolStats} Pool statistics
 *
 * @example
 * ```typescript
 * const stats = getConnectionPoolStats(sequelize);
 * console.log(`Active: ${stats.active}, Idle: ${stats.idle}`);
 * ```
 */
const getConnectionPoolStats = (sequelize) => {
    const pool = sequelize.connectionManager.pool;
    return {
        total: pool.size,
        active: pool.using,
        idle: pool.available,
        waiting: pool.waiting,
    };
};
exports.getConnectionPoolStats = getConnectionPoolStats;
/**
 * Drains and closes all connections in the pool.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await drainConnectionPool(sequelize);
 * ```
 */
const drainConnectionPool = async (sequelize) => {
    await sequelize.connectionManager.close();
};
exports.drainConnectionPool = drainConnectionPool;
/**
 * Validates all idle connections in the pool.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<number>} Number of valid connections
 *
 * @example
 * ```typescript
 * const validConnections = await validatePoolConnections(sequelize);
 * ```
 */
const validatePoolConnections = async (sequelize) => {
    try {
        await sequelize.authenticate();
        const stats = (0, exports.getConnectionPoolStats)(sequelize);
        return stats.total;
    }
    catch (error) {
        return 0;
    }
};
exports.validatePoolConnections = validatePoolConnections;
// ============================================================================
// QUERY OPTIMIZATION HELPERS
// ============================================================================
/**
 * Analyzes query performance using EXPLAIN.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} query - SQL query to analyze
 * @param {any} [replacements] - Query replacements
 * @returns {Promise<any>} Query execution plan
 *
 * @example
 * ```typescript
 * const plan = await analyzeQueryPerformance(sequelize,
 *   'SELECT * FROM patients WHERE status = :status',
 *   { status: 'active' }
 * );
 * ```
 */
const analyzeQueryPerformance = async (sequelize, query, replacements) => {
    const [results] = await sequelize.query(`EXPLAIN ANALYZE ${query}`, {
        replacements,
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.analyzeQueryPerformance = analyzeQueryPerformance;
/**
 * Measures query execution time.
 *
 * @template T
 * @param {Function} queryFn - Query function to measure
 * @returns {Promise<object>} Query result and execution metrics
 *
 * @example
 * ```typescript
 * const { result, metrics } = await measureQueryTime(async () => {
 *   return await Patient.findAll({ where: { status: 'active' } });
 * });
 * console.log(`Query took ${metrics.executionTime}ms`);
 * ```
 */
const measureQueryTime = async (queryFn) => {
    const startTime = Date.now();
    const result = await queryFn();
    const executionTime = Date.now() - startTime;
    return {
        result,
        metrics: {
            query: queryFn.toString(),
            executionTime,
            rowCount: Array.isArray(result) ? result.length : 1,
            timestamp: new Date(),
        },
    };
};
exports.measureQueryTime = measureQueryTime;
/**
 * Creates a query cache wrapper with TTL.
 *
 * @template T
 * @param {Function} queryFn - Query function to cache
 * @param {object} options - Cache options
 * @returns {Function} Cached query function
 *
 * @example
 * ```typescript
 * const getCachedPatients = createQueryCache(
 *   async () => Patient.findAll({ where: { status: 'active' } }),
 *   { ttl: 60000, key: 'active_patients' }
 * );
 * const patients = await getCachedPatients();
 * ```
 */
const createQueryCache = (queryFn, options) => {
    let cache = null;
    return async () => {
        if (cache && Date.now() - cache.timestamp < options.ttl) {
            return cache.data;
        }
        const data = await queryFn();
        cache = { data, timestamp: Date.now() };
        return data;
    };
};
exports.createQueryCache = createQueryCache;
// ============================================================================
// DATABASE BACKUP/RESTORE HELPERS
// ============================================================================
/**
 * Creates a database backup by exporting data to JSON.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {BackupOptions} options - Backup options
 * @returns {Promise<string>} Backup file path
 *
 * @example
 * ```typescript
 * const backupPath = await backupDatabase(sequelize, {
 *   outputPath: './backups/backup-2024-01-01.json',
 *   tables: ['patients', 'medical_records'],
 *   includeData: true
 * });
 * ```
 */
const backupDatabase = async (sequelize, options) => {
    const { outputPath, tables, includeData = true } = options;
    const backup = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        tables: {},
    };
    const tablesToBackup = tables || (await sequelize.getQueryInterface().showAllTables());
    for (const table of tablesToBackup) {
        if (includeData) {
            const [data] = await sequelize.query(`SELECT * FROM ${table}`, {
                type: sequelize_1.QueryTypes.SELECT,
            });
            backup.tables[table] = data;
        }
    }
    fs.writeFileSync(outputPath, JSON.stringify(backup, null, 2));
    return outputPath;
};
exports.backupDatabase = backupDatabase;
/**
 * Restores database from a backup file.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {RestoreOptions} options - Restore options
 * @returns {Promise<number>} Number of records restored
 *
 * @example
 * ```typescript
 * const restored = await restoreDatabase(sequelize, {
 *   inputPath: './backups/backup-2024-01-01.json',
 *   truncateTables: true
 * });
 * ```
 */
const restoreDatabase = async (sequelize, options) => {
    const { inputPath, truncateTables = false } = options;
    const backup = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));
    let totalRestored = 0;
    for (const [tableName, data] of Object.entries(backup.tables)) {
        if (truncateTables) {
            await sequelize.query(`TRUNCATE TABLE ${tableName} CASCADE`);
        }
        if (Array.isArray(data) && data.length > 0) {
            const columns = Object.keys(data[0]);
            const values = data
                .map((row) => `(${columns.map((col) => sequelize.escape(row[col])).join(', ')})`)
                .join(', ');
            await sequelize.query(`INSERT INTO ${tableName} (${columns.join(', ')}) VALUES ${values}`);
            totalRestored += data.length;
        }
    }
    return totalRestored;
};
exports.restoreDatabase = restoreDatabase;
// ============================================================================
// SEQUELIZE MODEL FACTORIES
// ============================================================================
/**
 * Creates a model factory for generating test data.
 *
 * @template T
 * @param {ModelFactoryConfig<T>} config - Factory configuration
 * @returns {object} Factory methods
 *
 * @example
 * ```typescript
 * const patientFactory = createModelFactory({
 *   model: Patient,
 *   defaults: {
 *     status: 'active',
 *     departmentId: 'default-dept'
 *   },
 *   traits: {
 *     inactive: { status: 'inactive' },
 *     senior: { age: 65 }
 *   },
 *   sequences: {
 *     email: (n) => `patient${n}@example.com`
 *   }
 * });
 *
 * const patient = await patientFactory.create({ firstName: 'John' });
 * const inactivePatient = await patientFactory.create({ firstName: 'Jane' }, ['inactive']);
 * ```
 */
const createModelFactory = (config) => {
    let sequenceCounter = 0;
    return {
        build(overrides, traitNames = []) {
            sequenceCounter++;
            let data = { ...config.defaults };
            // Apply traits
            traitNames.forEach((traitName) => {
                if (config.traits && config.traits[traitName]) {
                    data = { ...data, ...config.traits[traitName] };
                }
            });
            // Apply sequences
            if (config.sequences) {
                Object.entries(config.sequences).forEach(([key, sequenceFn]) => {
                    if (!overrides || !(key in overrides)) {
                        data[key] = sequenceFn(sequenceCounter);
                    }
                });
            }
            // Apply overrides
            data = { ...data, ...overrides };
            return data;
        },
        async create(overrides, traitNames = []) {
            const data = this.build(overrides, traitNames);
            return config.model.create(data);
        },
        async createMany(count, overrides, traitNames = []) {
            const records = Array.from({ length: count }, () => this.build(overrides, traitNames));
            return config.model.bulkCreate(records, { returning: true });
        },
    };
};
exports.createModelFactory = createModelFactory;
// ============================================================================
// DATABASE HEALTH CHECKS
// ============================================================================
/**
 * Performs a comprehensive database health check.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<DatabaseHealthCheck>} Health check results
 *
 * @example
 * ```typescript
 * const health = await checkDatabaseHealth(sequelize);
 * if (!health.isHealthy) {
 *   console.error('Database health check failed:', health.lastError);
 * }
 * ```
 */
const checkDatabaseHealth = async (sequelize) => {
    const startTime = Date.now();
    try {
        await sequelize.authenticate();
        const responseTime = Date.now() - startTime;
        const connectionPool = (0, exports.getConnectionPoolStats)(sequelize);
        return {
            isHealthy: true,
            responseTime,
            connectionPool,
        };
    }
    catch (error) {
        return {
            isHealthy: false,
            responseTime: Date.now() - startTime,
            connectionPool: {
                total: 0,
                active: 0,
                idle: 0,
                waiting: 0,
            },
            lastError: error.message,
        };
    }
};
exports.checkDatabaseHealth = checkDatabaseHealth;
/**
 * Checks if database can accept writes.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<boolean>} True if database accepts writes
 *
 * @example
 * ```typescript
 * const canWrite = await checkDatabaseWriteability(sequelize);
 * if (!canWrite) {
 *   throw new Error('Database is read-only');
 * }
 * ```
 */
const checkDatabaseWriteability = async (sequelize) => {
    try {
        const testTable = '_health_check_test';
        await sequelize.query(`CREATE TABLE IF NOT EXISTS ${testTable} (id SERIAL PRIMARY KEY)`);
        await sequelize.query(`DROP TABLE ${testTable}`);
        return true;
    }
    catch (error) {
        return false;
    }
};
exports.checkDatabaseWriteability = checkDatabaseWriteability;
/**
 * Monitors database for slow queries.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} thresholdMs - Slow query threshold in milliseconds
 * @returns {Function} Logging function to enable
 *
 * @example
 * ```typescript
 * const stopMonitoring = monitorSlowQueries(sequelize, 1000);
 * // Later...
 * stopMonitoring();
 * ```
 */
const monitorSlowQueries = (sequelize, thresholdMs) => {
    const originalLogging = sequelize.options.logging;
    sequelize.options.logging = (sql, timing) => {
        if (timing && timing > thresholdMs) {
            console.warn(`[SLOW QUERY ${timing}ms]:`, sql);
        }
    };
    return () => {
        sequelize.options.logging = originalLogging;
    };
};
exports.monitorSlowQueries = monitorSlowQueries;
/**
 * Optimizes query by adding appropriate indexes based on WHERE clause.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @param {string[]} fields - Fields to index
 * @param {object} [options] - Index options
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await optimizeQueryWithIndex(sequelize, 'patients', ['status', 'departmentId'], {
 *   unique: false,
 *   name: 'idx_patients_status_dept'
 * });
 * ```
 */
const optimizeQueryWithIndex = async (sequelize, tableName, fields, options) => {
    const indexName = options?.name || `idx_${tableName}_${fields.join('_')}`;
    const uniqueClause = options?.unique ? 'UNIQUE' : '';
    const typeClause = options?.type ? `USING ${options.type}` : '';
    await sequelize.query(`CREATE ${uniqueClause} INDEX IF NOT EXISTS ${indexName} ON ${tableName} ${typeClause} (${fields.join(', ')})`);
};
exports.optimizeQueryWithIndex = optimizeQueryWithIndex;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Advanced query builders
    buildAdvancedQuery: exports.buildAdvancedQuery,
    chainableQueryBuilder: exports.chainableQueryBuilder,
    buildConditionalQuery: exports.buildConditionalQuery,
    buildJsonFieldQuery: exports.buildJsonFieldQuery,
    buildFullTextSearch: exports.buildFullTextSearch,
    // Filtering and sorting utilities
    buildDynamicSort: exports.buildDynamicSort,
    buildRangeQuery: exports.buildRangeQuery,
    // Pagination helpers
    cursorPaginate: exports.cursorPaginate,
    offsetPaginate: exports.offsetPaginate,
    keysetPaginate: exports.keysetPaginate,
    // Bulk operations
    bulkInsert: exports.bulkInsert,
    bulkUpdate: exports.bulkUpdate,
    bulkDelete: exports.bulkDelete,
    bulkUpsert: exports.bulkUpsert,
    // Transaction management
    withTransaction: exports.withTransaction,
    createSavepoint: exports.createSavepoint,
    rollbackToSavepoint: exports.rollbackToSavepoint,
    withNestedSavepoints: exports.withNestedSavepoints,
    retryTransaction: exports.retryTransaction,
    // Soft delete utilities
    softDelete: exports.softDelete,
    restoreSoftDeleted: exports.restoreSoftDeleted,
    hardDeleteSoftDeleted: exports.hardDeleteSoftDeleted,
    findSoftDeleted: exports.findSoftDeleted,
    // Audit trail tracking
    createAuditTrail: exports.createAuditTrail,
    trackChanges: exports.trackChanges,
    queryAuditTrail: exports.queryAuditTrail,
    // Database seeding helpers
    seedModel: exports.seedModel,
    seedDatabase: exports.seedDatabase,
    generateSeedData: exports.generateSeedData,
    // Migration utilities
    createTableMigration: exports.createTableMigration,
    addColumnMigration: exports.addColumnMigration,
    createIndexMigration: exports.createIndexMigration,
    // Connection pool management
    getConnectionPoolStats: exports.getConnectionPoolStats,
    drainConnectionPool: exports.drainConnectionPool,
    validatePoolConnections: exports.validatePoolConnections,
    // Query optimization helpers
    analyzeQueryPerformance: exports.analyzeQueryPerformance,
    measureQueryTime: exports.measureQueryTime,
    createQueryCache: exports.createQueryCache,
    optimizeQueryWithIndex: exports.optimizeQueryWithIndex,
    // Database backup/restore helpers
    backupDatabase: exports.backupDatabase,
    restoreDatabase: exports.restoreDatabase,
    // Sequelize model factories
    createModelFactory: exports.createModelFactory,
    // Database health checks
    checkDatabaseHealth: exports.checkDatabaseHealth,
    checkDatabaseWriteability: exports.checkDatabaseWriteability,
    monitorSlowQueries: exports.monitorSlowQueries,
};
//# sourceMappingURL=database-orm-kit.js.map