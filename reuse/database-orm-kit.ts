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

import {
  Op,
  Sequelize,
  Model,
  ModelStatic,
  FindOptions,
  WhereOptions,
  Transaction,
  TransactionOptions,
  IsolationLevel,
  QueryTypes,
  DataType,
  ModelAttributes,
  QueryInterface,
  literal,
  fn,
  col,
} from 'sequelize';
import * as fs from 'fs';
import * as path from 'path';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface BulkInsertOptions<T> {
  data: Partial<T>[];
  batchSize?: number;
  validate?: boolean;
  ignoreDuplicates?: boolean;
  updateOnDuplicate?: string[];
  transaction?: Transaction;
}

interface BulkUpdateOptions<T> {
  updates: Array<{ where: WhereOptions<any>; data: Partial<T> }>;
  batchSize?: number;
  transaction?: Transaction;
  individualHooks?: boolean;
}

interface BulkDeleteOptions {
  conditions: WhereOptions<any>[];
  batchSize?: number;
  transaction?: Transaction;
  force?: boolean;
}

interface SoftDeleteConfig {
  deletedAtField?: string;
  deletedByField?: string;
  paranoid?: boolean;
}

interface AuditTrailConfig {
  tableName: string;
  userIdField?: string;
  actionField?: string;
  timestampField?: string;
  dataField?: string;
}

interface AuditTrailEntry {
  entityId: string;
  entityType: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'READ';
  userId?: string;
  oldData?: any;
  newData?: any;
  timestamp: Date;
  metadata?: Record<string, any>;
}

interface SeedConfig {
  model: ModelStatic<any>;
  data: any[];
  truncate?: boolean;
  cascade?: boolean;
}

interface MigrationHelper {
  up: (queryInterface: QueryInterface, sequelize: Sequelize) => Promise<void>;
  down: (queryInterface: QueryInterface, sequelize: Sequelize) => Promise<void>;
}

interface ConnectionPoolStats {
  total: number;
  active: number;
  idle: number;
  waiting: number;
}

interface DatabaseHealthCheck {
  isHealthy: boolean;
  responseTime: number;
  connectionPool: ConnectionPoolStats;
  diskSpace?: number;
  lastError?: string;
}

interface QueryPerformanceMetrics {
  query: string;
  executionTime: number;
  rowCount: number;
  timestamp: Date;
  explain?: any;
}

interface BackupOptions {
  outputPath: string;
  tables?: string[];
  compress?: boolean;
  includeData?: boolean;
}

interface RestoreOptions {
  inputPath: string;
  dropTables?: boolean;
  truncateTables?: boolean;
}

interface ModelFactoryConfig<T> {
  model: ModelStatic<T>;
  defaults?: Partial<T>;
  traits?: Record<string, Partial<T>>;
  sequences?: Record<string, (index: number) => any>;
}

interface CursorPaginationOptions {
  cursorField?: string;
  limit: number;
  cursor?: string;
  direction?: 'forward' | 'backward';
}

interface OffsetPaginationOptions {
  page: number;
  limit: number;
}

interface TransactionContext {
  transaction: Transaction;
  savepoints: string[];
  metadata?: Record<string, any>;
}

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
export const buildAdvancedQuery = <T extends Model>(
  model: ModelStatic<T>,
  options: {
    filters?: Record<string, any>;
    search?: { fields: string[]; term: string };
    sort?: Array<{ field: string; direction: 'ASC' | 'DESC' }>;
    includes?: any[];
    limit?: number;
    offset?: number;
    attributes?: string[];
  },
): FindOptions<T> => {
  const query: FindOptions<T> = {};

  // Build WHERE clause from filters
  if (options.filters) {
    const where: any = {};
    Object.entries(options.filters).forEach(([key, value]) => {
      const operatorMatch = key.match(/^(\w+)\[(\w+)\]$/);
      if (operatorMatch) {
        const [, field, operator] = operatorMatch;
        if (Op[operator as keyof typeof Op]) {
          where[field] = { [Op[operator as keyof typeof Op]]: value };
        }
      } else {
        where[key] = value;
      }
    });
    query.where = where;
  }

  // Add search conditions
  if (options.search) {
    const searchWhere = {
      [Op.or]: options.search.fields.map((field) => ({
        [field]: { [Op.iLike]: `%${options.search!.term}%` },
      })),
    };
    query.where = query.where ? { [Op.and]: [query.where, searchWhere] } : searchWhere;
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
export const chainableQueryBuilder = <T extends Model>(model: ModelStatic<T>) => {
  let queryOptions: FindOptions<T> = {};

  return {
    filter(conditions: WhereOptions<T>) {
      queryOptions.where = { ...(queryOptions.where || {}), ...conditions };
      return this;
    },
    search(fields: string[], term: string) {
      const searchWhere = {
        [Op.or]: fields.map((field) => ({
          [field]: { [Op.iLike]: `%${term}%` },
        })),
      };
      queryOptions.where = queryOptions.where
        ? { [Op.and]: [queryOptions.where, searchWhere] }
        : searchWhere;
      return this;
    },
    sort(field: string, direction: 'ASC' | 'DESC' = 'ASC') {
      queryOptions.order = queryOptions.order || [];
      (queryOptions.order as any[]).push([field, direction]);
      return this;
    },
    paginate(page: number, limit: number) {
      queryOptions.limit = limit;
      queryOptions.offset = (page - 1) * limit;
      return this;
    },
    include(includes: any[]) {
      queryOptions.include = includes;
      return this;
    },
    select(attributes: string[]) {
      queryOptions.attributes = attributes;
      return this;
    },
    distinct() {
      queryOptions.distinct = true;
      return this;
    },
    async execute(): Promise<T[]> {
      return model.findAll(queryOptions);
    },
    async executeWithCount(): Promise<{ rows: T[]; count: number }> {
      return model.findAndCountAll(queryOptions);
    },
    getOptions(): FindOptions<T> {
      return queryOptions;
    },
  };
};

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
export const buildConditionalQuery = <T extends Model>(
  conditions: {
    when: (params: any) => boolean;
    then: FindOptions<T>;
    else: FindOptions<T>;
  },
  params: any,
): FindOptions<T> => {
  return conditions.when(params) ? conditions.then : conditions.else;
};

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
export const buildJsonFieldQuery = (
  field: string,
  conditions: Record<string, any>,
): WhereOptions<any> => {
  const where: any = {};

  Object.entries(conditions).forEach(([path, value]) => {
    where[field] = {
      ...where[field],
      [Op.contains]: { [path]: value },
    };
  });

  return where;
};

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
export const buildFullTextSearch = (
  searchColumn: string,
  searchTerm: string,
  options?: { language?: string },
): WhereOptions<any> => {
  const tsQuery = searchTerm.split(' ').join(' & ');
  return {
    [searchColumn]: {
      [Op.match]: literal(`to_tsquery('${options?.language || 'english'}', '${tsQuery}')`),
    },
  };
};

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
export const cursorPaginate = async <T extends Model>(
  model: ModelStatic<T>,
  options: CursorPaginationOptions,
  queryOptions?: FindOptions<T>,
): Promise<{
  data: T[];
  nextCursor: string | null;
  previousCursor: string | null;
  hasMore: boolean;
}> => {
  const {
    cursorField = 'id',
    limit,
    cursor,
    direction = 'forward',
  } = options;

  const where: any = { ...(queryOptions?.where || {}) };

  if (cursor) {
    where[cursorField] =
      direction === 'forward' ? { [Op.gt]: cursor } : { [Op.lt]: cursor };
  }

  const results = await model.findAll({
    ...queryOptions,
    where,
    limit: limit + 1,
    order: [[cursorField, direction === 'forward' ? 'ASC' : 'DESC']],
  });

  const hasMore = results.length > limit;
  const data = results.slice(0, limit);

  const nextCursor =
    hasMore && data.length > 0 ? (data[data.length - 1] as any)[cursorField] : null;
  const previousCursor = data.length > 0 ? (data[0] as any)[cursorField] : null;

  return {
    data,
    nextCursor,
    previousCursor,
    hasMore,
  };
};

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
export const offsetPaginate = async <T extends Model>(
  model: ModelStatic<T>,
  options: OffsetPaginationOptions,
  queryOptions?: FindOptions<T>,
): Promise<{
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}> => {
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
export const keysetPaginate = async <T extends Model>(
  model: ModelStatic<T>,
  options: {
    keyFields: string[];
    lastValues?: any[];
    limit: number;
    direction?: 'ASC' | 'DESC';
  },
): Promise<{ data: T[]; nextKey: any[] | null }> => {
  const { keyFields, lastValues, limit, direction = 'ASC' } = options;

  let where: any = {};

  if (lastValues && lastValues.length === keyFields.length) {
    const conditions = keyFields.map((field, index) => {
      if (index === keyFields.length - 1) {
        return {
          [field]: direction === 'ASC' ? { [Op.gt]: lastValues[index] } : { [Op.lt]: lastValues[index] },
        };
      }
      return { [field]: { [Op.eq]: lastValues[index] } };
    });
    where = { [Op.or]: conditions };
  }

  const results = await model.findAll({
    where,
    order: keyFields.map((field) => [field, direction]),
    limit: limit + 1,
  });

  const hasMore = results.length > limit;
  const data = results.slice(0, limit);

  const nextKey =
    hasMore && data.length > 0
      ? keyFields.map((field) => (data[data.length - 1] as any)[field])
      : null;

  return { data, nextKey };
};

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
export const buildDynamicSort = (
  sortParams: string | string[],
  allowedFields: string[],
): Array<[string, 'ASC' | 'DESC']> => {
  const sortArray = Array.isArray(sortParams) ? sortParams : sortParams.split(',');
  const order: Array<[string, 'ASC' | 'DESC']> = [];

  sortArray.forEach((sort) => {
    const [field, direction = 'ASC'] = sort.split(':');
    if (allowedFields.includes(field)) {
      order.push([field, direction.toUpperCase() as 'ASC' | 'DESC']);
    }
  });

  return order;
};

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
export const buildRangeQuery = (
  ranges: Record<string, { min?: any; max?: any }>,
): WhereOptions<any> => {
  const where: any = {};

  Object.entries(ranges).forEach(([field, range]) => {
    const conditions: any = {};

    if (range.min !== undefined && range.max !== undefined) {
      conditions[Op.between] = [range.min, range.max];
    } else if (range.min !== undefined) {
      conditions[Op.gte] = range.min;
    } else if (range.max !== undefined) {
      conditions[Op.lte] = range.max;
    }

    if (Object.keys(conditions).length > 0) {
      where[field] = conditions;
    }
  });

  return where;
};

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
export const bulkInsert = async <T extends Model>(
  model: ModelStatic<T>,
  options: BulkInsertOptions<T>,
): Promise<T[]> => {
  const {
    data,
    batchSize = 1000,
    validate = true,
    ignoreDuplicates = false,
    updateOnDuplicate,
    transaction,
  } = options;

  const results: T[] = [];

  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);

    const batchResults = await model.bulkCreate(batch as any[], {
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
export const bulkUpdate = async <T extends Model>(
  model: ModelStatic<T>,
  options: BulkUpdateOptions<T>,
): Promise<number> => {
  const { updates, batchSize = 500, transaction, individualHooks = false } = options;

  let totalAffected = 0;

  for (let i = 0; i < updates.length; i += batchSize) {
    const batch = updates.slice(i, i + batchSize);

    for (const update of batch) {
      const [affected] = await model.update(update.data as any, {
        where: update.where,
        transaction,
        individualHooks,
      });
      totalAffected += affected;
    }
  }

  return totalAffected;
};

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
export const bulkDelete = async <T extends Model>(
  model: ModelStatic<T>,
  options: BulkDeleteOptions,
): Promise<number> => {
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
export const bulkUpsert = async <T extends Model>(
  model: ModelStatic<T>,
  options: {
    data: Partial<T>[];
    conflictFields: string[];
    updateFields: string[];
    transaction?: Transaction;
  },
): Promise<{ created: number; updated: number }> => {
  const { data, conflictFields, updateFields, transaction } = options;

  const results = await model.bulkCreate(data as any[], {
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
export const withTransaction = async <T>(
  sequelize: Sequelize,
  callback: (transaction: Transaction) => Promise<T>,
  options?: TransactionOptions,
): Promise<T> => {
  return sequelize.transaction(options || {}, callback);
};

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
export const createSavepoint = async (
  transaction: Transaction,
  savepointName: string,
): Promise<void> => {
  await transaction.connection.query(`SAVEPOINT ${savepointName}`);
};

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
export const rollbackToSavepoint = async (
  transaction: Transaction,
  savepointName: string,
): Promise<void> => {
  await transaction.connection.query(`ROLLBACK TO SAVEPOINT ${savepointName}`);
};

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
export const withNestedSavepoints = async <T>(
  sequelize: Sequelize,
  operations: Array<(transaction: Transaction) => Promise<T>>,
): Promise<T[]> => {
  return sequelize.transaction(async (transaction) => {
    const results: T[] = [];

    for (let i = 0; i < operations.length; i++) {
      const savepointName = `savepoint_${i}`;
      await createSavepoint(transaction, savepointName);

      try {
        const result = await operations[i](transaction);
        results.push(result);
      } catch (error) {
        await rollbackToSavepoint(transaction, savepointName);
        throw error;
      }
    }

    return results;
  });
};

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
export const retryTransaction = async <T>(
  sequelize: Sequelize,
  callback: (transaction: Transaction) => Promise<T>,
  options: {
    maxRetries?: number;
    backoffMs?: number;
    shouldRetry?: (error: Error) => boolean;
  } = {},
): Promise<T> => {
  const { maxRetries = 3, backoffMs = 100, shouldRetry = () => true } = options;

  let lastError: Error;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await sequelize.transaction(callback);
    } catch (error) {
      lastError = error as Error;

      if (!shouldRetry(lastError) || attempt === maxRetries - 1) {
        throw lastError;
      }

      await new Promise((resolve) =>
        setTimeout(resolve, backoffMs * Math.pow(2, attempt)),
      );
    }
  }

  throw lastError!;
};

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
export const softDelete = async <T extends Model>(
  model: ModelStatic<T>,
  where: WhereOptions<T>,
  config?: SoftDeleteConfig,
): Promise<number> => {
  const { deletedAtField = 'deletedAt', deletedByField } = config || {};

  const updateData: any = {
    [deletedAtField]: new Date(),
  };

  if (deletedByField) {
    // Would get from context/request
    updateData[deletedByField] = 'system';
  }

  const [affected] = await model.update(updateData, { where });
  return affected;
};

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
export const restoreSoftDeleted = async <T extends Model>(
  model: ModelStatic<T>,
  where: WhereOptions<T>,
  config?: SoftDeleteConfig,
): Promise<number> => {
  const { deletedAtField = 'deletedAt' } = config || {};

  const [affected] = await model.update(
    { [deletedAtField]: null } as any,
    { where: { ...where, [deletedAtField]: { [Op.not]: null } } as any },
  );

  return affected;
};

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
export const hardDeleteSoftDeleted = async <T extends Model>(
  model: ModelStatic<T>,
  where: WhereOptions<T>,
  config?: SoftDeleteConfig,
): Promise<number> => {
  const { deletedAtField = 'deletedAt' } = config || {};

  return model.destroy({
    where: { ...where, [deletedAtField]: { [Op.not]: null } } as any,
    force: true,
  });
};

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
export const findSoftDeleted = async <T extends Model>(
  model: ModelStatic<T>,
  options?: FindOptions<T>,
): Promise<T[]> => {
  return model.findAll({
    ...options,
    paranoid: false,
    where: {
      ...(options?.where || {}),
      deletedAt: { [Op.not]: null },
    } as any,
  });
};

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
export const createAuditTrail = async (
  sequelize: Sequelize,
  entry: AuditTrailEntry,
  config: AuditTrailConfig,
): Promise<void> => {
  const {
    tableName,
    userIdField = 'userId',
    actionField = 'action',
    timestampField = 'timestamp',
    dataField = 'data',
  } = config;

  await sequelize.query(
    `INSERT INTO ${tableName} (entity_id, entity_type, ${actionField}, ${userIdField}, ${dataField}, ${timestampField})
     VALUES (:entityId, :entityType, :action, :userId, :data, :timestamp)`,
    {
      replacements: {
        entityId: entry.entityId,
        entityType: entry.entityType,
        action: entry.action,
        userId: entry.userId,
        data: JSON.stringify({ oldData: entry.oldData, newData: entry.newData, metadata: entry.metadata }),
        timestamp: entry.timestamp,
      },
      type: QueryTypes.INSERT,
    },
  );
};

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
export const trackChanges = (
  oldRecord: any,
  newRecord: any,
): Record<string, { old: any; new: any }> => {
  const changes: Record<string, { old: any; new: any }> = {};

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
export const queryAuditTrail = async (
  sequelize: Sequelize,
  criteria: {
    entityId?: string;
    entityType?: string;
    actions?: string[];
    userId?: string;
    startDate?: Date;
    endDate?: Date;
  },
  config: AuditTrailConfig,
): Promise<any[]> => {
  const { tableName, actionField = 'action', userIdField = 'userId', timestampField = 'timestamp' } = config;

  const conditions: string[] = [];
  const replacements: any = {};

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

  const [results] = await sequelize.query(
    `SELECT * FROM ${tableName} ${whereClause} ORDER BY ${timestampField} DESC`,
    {
      replacements,
      type: QueryTypes.SELECT,
    },
  );

  return results as any[];
};

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
export const seedModel = async <T extends Model>(config: SeedConfig): Promise<T[]> => {
  const { model, data, truncate = false, cascade = false } = config;

  if (truncate) {
    await model.destroy({ where: {}, truncate: true, cascade });
  }

  return model.bulkCreate(data, { validate: true, returning: true }) as any;
};

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
export const seedDatabase = async (configs: SeedConfig[]): Promise<void> => {
  for (const config of configs) {
    await seedModel(config);
  }
};

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
export const generateSeedData = <T>(
  count: number,
  factory: (index: number) => Partial<T>,
): Partial<T>[] => {
  return Array.from({ length: count }, (_, index) => factory(index));
};

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
export const createTableMigration = (
  tableName: string,
  attributes: ModelAttributes,
  options?: any,
): MigrationHelper => {
  return {
    up: async (queryInterface: QueryInterface) => {
      await queryInterface.createTable(tableName, attributes, options);
    },
    down: async (queryInterface: QueryInterface) => {
      await queryInterface.dropTable(tableName);
    },
  };
};

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
export const addColumnMigration = (
  tableName: string,
  columnName: string,
  columnDefinition: any,
): MigrationHelper => {
  return {
    up: async (queryInterface: QueryInterface) => {
      await queryInterface.addColumn(tableName, columnName, columnDefinition);
    },
    down: async (queryInterface: QueryInterface) => {
      await queryInterface.removeColumn(tableName, columnName);
    },
  };
};

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
export const createIndexMigration = (
  tableName: string,
  fields: string[],
  options?: { unique?: boolean; name?: string },
): MigrationHelper => {
  const indexName = options?.name || `${tableName}_${fields.join('_')}_idx`;

  return {
    up: async (queryInterface: QueryInterface) => {
      await queryInterface.addIndex(tableName, fields, {
        ...options,
        name: indexName,
      });
    },
    down: async (queryInterface: QueryInterface) => {
      await queryInterface.removeIndex(tableName, indexName);
    },
  };
};

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
export const getConnectionPoolStats = (sequelize: Sequelize): ConnectionPoolStats => {
  const pool = (sequelize.connectionManager as any).pool;

  return {
    total: pool.size,
    active: pool.using,
    idle: pool.available,
    waiting: pool.waiting,
  };
};

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
export const drainConnectionPool = async (sequelize: Sequelize): Promise<void> => {
  await sequelize.connectionManager.close();
};

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
export const validatePoolConnections = async (
  sequelize: Sequelize,
): Promise<number> => {
  try {
    await sequelize.authenticate();
    const stats = getConnectionPoolStats(sequelize);
    return stats.total;
  } catch (error) {
    return 0;
  }
};

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
export const analyzeQueryPerformance = async (
  sequelize: Sequelize,
  query: string,
  replacements?: any,
): Promise<any> => {
  const [results] = await sequelize.query(`EXPLAIN ANALYZE ${query}`, {
    replacements,
    type: QueryTypes.SELECT,
  });

  return results;
};

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
export const measureQueryTime = async <T>(
  queryFn: () => Promise<T>,
): Promise<{ result: T; metrics: QueryPerformanceMetrics }> => {
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
export const createQueryCache = <T>(
  queryFn: () => Promise<T>,
  options: { ttl: number; key: string },
): (() => Promise<T>) => {
  let cache: { data: T; timestamp: number } | null = null;

  return async (): Promise<T> => {
    if (cache && Date.now() - cache.timestamp < options.ttl) {
      return cache.data;
    }

    const data = await queryFn();
    cache = { data, timestamp: Date.now() };
    return data;
  };
};

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
export const backupDatabase = async (
  sequelize: Sequelize,
  options: BackupOptions,
): Promise<string> => {
  const { outputPath, tables, includeData = true } = options;

  const backup: any = {
    version: '1.0',
    timestamp: new Date().toISOString(),
    tables: {},
  };

  const tablesToBackup = tables || (await sequelize.getQueryInterface().showAllTables());

  for (const table of tablesToBackup) {
    if (includeData) {
      const [data] = await sequelize.query(`SELECT * FROM ${table}`, {
        type: QueryTypes.SELECT,
      });
      backup.tables[table] = data;
    }
  }

  fs.writeFileSync(outputPath, JSON.stringify(backup, null, 2));

  return outputPath;
};

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
export const restoreDatabase = async (
  sequelize: Sequelize,
  options: RestoreOptions,
): Promise<number> => {
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
        .map(
          (row: any) =>
            `(${columns.map((col) => sequelize.escape(row[col])).join(', ')})`,
        )
        .join(', ');

      await sequelize.query(
        `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES ${values}`,
      );
      totalRestored += data.length;
    }
  }

  return totalRestored;
};

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
export const createModelFactory = <T extends Model>(
  config: ModelFactoryConfig<T>,
) => {
  let sequenceCounter = 0;

  return {
    build(overrides?: Partial<T>, traitNames: string[] = []): Partial<T> {
      sequenceCounter++;
      let data: any = { ...config.defaults };

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

    async create(overrides?: Partial<T>, traitNames: string[] = []): Promise<T> {
      const data = this.build(overrides, traitNames);
      return config.model.create(data as any);
    },

    async createMany(
      count: number,
      overrides?: Partial<T>,
      traitNames: string[] = [],
    ): Promise<T[]> {
      const records = Array.from({ length: count }, () =>
        this.build(overrides, traitNames),
      );
      return config.model.bulkCreate(records as any[], { returning: true });
    },
  };
};

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
export const checkDatabaseHealth = async (
  sequelize: Sequelize,
): Promise<DatabaseHealthCheck> => {
  const startTime = Date.now();

  try {
    await sequelize.authenticate();
    const responseTime = Date.now() - startTime;
    const connectionPool = getConnectionPoolStats(sequelize);

    return {
      isHealthy: true,
      responseTime,
      connectionPool,
    };
  } catch (error) {
    return {
      isHealthy: false,
      responseTime: Date.now() - startTime,
      connectionPool: {
        total: 0,
        active: 0,
        idle: 0,
        waiting: 0,
      },
      lastError: (error as Error).message,
    };
  }
};

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
export const checkDatabaseWriteability = async (
  sequelize: Sequelize,
): Promise<boolean> => {
  try {
    const testTable = '_health_check_test';
    await sequelize.query(`CREATE TABLE IF NOT EXISTS ${testTable} (id SERIAL PRIMARY KEY)`);
    await sequelize.query(`DROP TABLE ${testTable}`);
    return true;
  } catch (error) {
    return false;
  }
};

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
export const monitorSlowQueries = (
  sequelize: Sequelize,
  thresholdMs: number,
): (() => void) => {
  const originalLogging = sequelize.options.logging;

  sequelize.options.logging = (sql: string, timing?: number) => {
    if (timing && timing > thresholdMs) {
      console.warn(`[SLOW QUERY ${timing}ms]:`, sql);
    }
  };

  return () => {
    sequelize.options.logging = originalLogging;
  };
};

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
export const optimizeQueryWithIndex = async (
  sequelize: Sequelize,
  tableName: string,
  fields: string[],
  options?: { unique?: boolean; name?: string; type?: string },
): Promise<void> => {
  const indexName = options?.name || `idx_${tableName}_${fields.join('_')}`;
  const uniqueClause = options?.unique ? 'UNIQUE' : '';
  const typeClause = options?.type ? `USING ${options.type}` : '';

  await sequelize.query(
    `CREATE ${uniqueClause} INDEX IF NOT EXISTS ${indexName} ON ${tableName} ${typeClause} (${fields.join(', ')})`,
  );
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Advanced query builders
  buildAdvancedQuery,
  chainableQueryBuilder,
  buildConditionalQuery,
  buildJsonFieldQuery,
  buildFullTextSearch,

  // Filtering and sorting utilities
  buildDynamicSort,
  buildRangeQuery,

  // Pagination helpers
  cursorPaginate,
  offsetPaginate,
  keysetPaginate,

  // Bulk operations
  bulkInsert,
  bulkUpdate,
  bulkDelete,
  bulkUpsert,

  // Transaction management
  withTransaction,
  createSavepoint,
  rollbackToSavepoint,
  withNestedSavepoints,
  retryTransaction,

  // Soft delete utilities
  softDelete,
  restoreSoftDeleted,
  hardDeleteSoftDeleted,
  findSoftDeleted,

  // Audit trail tracking
  createAuditTrail,
  trackChanges,
  queryAuditTrail,

  // Database seeding helpers
  seedModel,
  seedDatabase,
  generateSeedData,

  // Migration utilities
  createTableMigration,
  addColumnMigration,
  createIndexMigration,

  // Connection pool management
  getConnectionPoolStats,
  drainConnectionPool,
  validatePoolConnections,

  // Query optimization helpers
  analyzeQueryPerformance,
  measureQueryTime,
  createQueryCache,
  optimizeQueryWithIndex,

  // Database backup/restore helpers
  backupDatabase,
  restoreDatabase,

  // Sequelize model factories
  createModelFactory,

  // Database health checks
  checkDatabaseHealth,
  checkDatabaseWriteability,
  monitorSlowQueries,
};
