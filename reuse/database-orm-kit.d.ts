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
import { Sequelize, Model, ModelStatic, FindOptions, WhereOptions, Transaction, TransactionOptions, ModelAttributes, QueryInterface } from 'sequelize';
interface BulkInsertOptions<T> {
    data: Partial<T>[];
    batchSize?: number;
    validate?: boolean;
    ignoreDuplicates?: boolean;
    updateOnDuplicate?: string[];
    transaction?: Transaction;
}
interface BulkUpdateOptions<T> {
    updates: Array<{
        where: WhereOptions<any>;
        data: Partial<T>;
    }>;
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
export declare const buildAdvancedQuery: <T extends Model>(model: ModelStatic<T>, options: {
    filters?: Record<string, any>;
    search?: {
        fields: string[];
        term: string;
    };
    sort?: Array<{
        field: string;
        direction: "ASC" | "DESC";
    }>;
    includes?: any[];
    limit?: number;
    offset?: number;
    attributes?: string[];
}) => FindOptions<T>;
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
export declare const chainableQueryBuilder: <T extends Model>(model: ModelStatic<T>) => {
    filter(conditions: WhereOptions<T>): /*elided*/ any;
    search(fields: string[], term: string): /*elided*/ any;
    sort(field: string, direction?: "ASC" | "DESC"): /*elided*/ any;
    paginate(page: number, limit: number): /*elided*/ any;
    include(includes: any[]): /*elided*/ any;
    select(attributes: string[]): /*elided*/ any;
    distinct(): /*elided*/ any;
    execute(): Promise<T[]>;
    executeWithCount(): Promise<{
        rows: T[];
        count: number;
    }>;
    getOptions(): FindOptions<T>;
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
export declare const buildConditionalQuery: <T extends Model>(conditions: {
    when: (params: any) => boolean;
    then: FindOptions<T>;
    else: FindOptions<T>;
}, params: any) => FindOptions<T>;
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
export declare const buildJsonFieldQuery: (field: string, conditions: Record<string, any>) => WhereOptions<any>;
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
export declare const buildFullTextSearch: (searchColumn: string, searchTerm: string, options?: {
    language?: string;
}) => WhereOptions<any>;
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
export declare const cursorPaginate: <T extends Model>(model: ModelStatic<T>, options: CursorPaginationOptions, queryOptions?: FindOptions<T>) => Promise<{
    data: T[];
    nextCursor: string | null;
    previousCursor: string | null;
    hasMore: boolean;
}>;
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
export declare const offsetPaginate: <T extends Model>(model: ModelStatic<T>, options: OffsetPaginationOptions, queryOptions?: FindOptions<T>) => Promise<{
    data: T[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrevious: boolean;
    };
}>;
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
export declare const keysetPaginate: <T extends Model>(model: ModelStatic<T>, options: {
    keyFields: string[];
    lastValues?: any[];
    limit: number;
    direction?: "ASC" | "DESC";
}) => Promise<{
    data: T[];
    nextKey: any[] | null;
}>;
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
export declare const buildDynamicSort: (sortParams: string | string[], allowedFields: string[]) => Array<[string, "ASC" | "DESC"]>;
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
export declare const buildRangeQuery: (ranges: Record<string, {
    min?: any;
    max?: any;
}>) => WhereOptions<any>;
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
export declare const bulkInsert: <T extends Model>(model: ModelStatic<T>, options: BulkInsertOptions<T>) => Promise<T[]>;
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
export declare const bulkUpdate: <T extends Model>(model: ModelStatic<T>, options: BulkUpdateOptions<T>) => Promise<number>;
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
export declare const bulkDelete: <T extends Model>(model: ModelStatic<T>, options: BulkDeleteOptions) => Promise<number>;
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
export declare const bulkUpsert: <T extends Model>(model: ModelStatic<T>, options: {
    data: Partial<T>[];
    conflictFields: string[];
    updateFields: string[];
    transaction?: Transaction;
}) => Promise<{
    created: number;
    updated: number;
}>;
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
export declare const withTransaction: <T>(sequelize: Sequelize, callback: (transaction: Transaction) => Promise<T>, options?: TransactionOptions) => Promise<T>;
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
export declare const createSavepoint: (transaction: Transaction, savepointName: string) => Promise<void>;
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
export declare const rollbackToSavepoint: (transaction: Transaction, savepointName: string) => Promise<void>;
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
export declare const withNestedSavepoints: <T>(sequelize: Sequelize, operations: Array<(transaction: Transaction) => Promise<T>>) => Promise<T[]>;
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
export declare const retryTransaction: <T>(sequelize: Sequelize, callback: (transaction: Transaction) => Promise<T>, options?: {
    maxRetries?: number;
    backoffMs?: number;
    shouldRetry?: (error: Error) => boolean;
}) => Promise<T>;
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
export declare const softDelete: <T extends Model>(model: ModelStatic<T>, where: WhereOptions<T>, config?: SoftDeleteConfig) => Promise<number>;
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
export declare const restoreSoftDeleted: <T extends Model>(model: ModelStatic<T>, where: WhereOptions<T>, config?: SoftDeleteConfig) => Promise<number>;
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
export declare const hardDeleteSoftDeleted: <T extends Model>(model: ModelStatic<T>, where: WhereOptions<T>, config?: SoftDeleteConfig) => Promise<number>;
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
export declare const findSoftDeleted: <T extends Model>(model: ModelStatic<T>, options?: FindOptions<T>) => Promise<T[]>;
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
export declare const createAuditTrail: (sequelize: Sequelize, entry: AuditTrailEntry, config: AuditTrailConfig) => Promise<void>;
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
export declare const trackChanges: (oldRecord: any, newRecord: any) => Record<string, {
    old: any;
    new: any;
}>;
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
export declare const queryAuditTrail: (sequelize: Sequelize, criteria: {
    entityId?: string;
    entityType?: string;
    actions?: string[];
    userId?: string;
    startDate?: Date;
    endDate?: Date;
}, config: AuditTrailConfig) => Promise<any[]>;
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
export declare const seedModel: <T extends Model>(config: SeedConfig) => Promise<T[]>;
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
export declare const seedDatabase: (configs: SeedConfig[]) => Promise<void>;
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
export declare const generateSeedData: <T>(count: number, factory: (index: number) => Partial<T>) => Partial<T>[];
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
export declare const createTableMigration: (tableName: string, attributes: ModelAttributes, options?: any) => MigrationHelper;
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
export declare const addColumnMigration: (tableName: string, columnName: string, columnDefinition: any) => MigrationHelper;
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
export declare const createIndexMigration: (tableName: string, fields: string[], options?: {
    unique?: boolean;
    name?: string;
}) => MigrationHelper;
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
export declare const getConnectionPoolStats: (sequelize: Sequelize) => ConnectionPoolStats;
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
export declare const drainConnectionPool: (sequelize: Sequelize) => Promise<void>;
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
export declare const validatePoolConnections: (sequelize: Sequelize) => Promise<number>;
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
export declare const analyzeQueryPerformance: (sequelize: Sequelize, query: string, replacements?: any) => Promise<any>;
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
export declare const measureQueryTime: <T>(queryFn: () => Promise<T>) => Promise<{
    result: T;
    metrics: QueryPerformanceMetrics;
}>;
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
export declare const createQueryCache: <T>(queryFn: () => Promise<T>, options: {
    ttl: number;
    key: string;
}) => (() => Promise<T>);
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
export declare const backupDatabase: (sequelize: Sequelize, options: BackupOptions) => Promise<string>;
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
export declare const restoreDatabase: (sequelize: Sequelize, options: RestoreOptions) => Promise<number>;
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
export declare const createModelFactory: <T extends Model>(config: ModelFactoryConfig<T>) => {
    build(overrides?: Partial<T>, traitNames?: string[]): Partial<T>;
    create(overrides?: Partial<T>, traitNames?: string[]): Promise<T>;
    createMany(count: number, overrides?: Partial<T>, traitNames?: string[]): Promise<T[]>;
};
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
export declare const checkDatabaseHealth: (sequelize: Sequelize) => Promise<DatabaseHealthCheck>;
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
export declare const checkDatabaseWriteability: (sequelize: Sequelize) => Promise<boolean>;
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
export declare const monitorSlowQueries: (sequelize: Sequelize, thresholdMs: number) => (() => void);
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
export declare const optimizeQueryWithIndex: (sequelize: Sequelize, tableName: string, fields: string[], options?: {
    unique?: boolean;
    name?: string;
    type?: string;
}) => Promise<void>;
declare const _default: {
    buildAdvancedQuery: <T extends Model>(model: ModelStatic<T>, options: {
        filters?: Record<string, any>;
        search?: {
            fields: string[];
            term: string;
        };
        sort?: Array<{
            field: string;
            direction: "ASC" | "DESC";
        }>;
        includes?: any[];
        limit?: number;
        offset?: number;
        attributes?: string[];
    }) => FindOptions<T>;
    chainableQueryBuilder: <T extends Model>(model: ModelStatic<T>) => {
        filter(conditions: WhereOptions<T>): /*elided*/ any;
        search(fields: string[], term: string): /*elided*/ any;
        sort(field: string, direction?: "ASC" | "DESC"): /*elided*/ any;
        paginate(page: number, limit: number): /*elided*/ any;
        include(includes: any[]): /*elided*/ any;
        select(attributes: string[]): /*elided*/ any;
        distinct(): /*elided*/ any;
        execute(): Promise<T[]>;
        executeWithCount(): Promise<{
            rows: T[];
            count: number;
        }>;
        getOptions(): FindOptions<T>;
    };
    buildConditionalQuery: <T extends Model>(conditions: {
        when: (params: any) => boolean;
        then: FindOptions<T>;
        else: FindOptions<T>;
    }, params: any) => FindOptions<T>;
    buildJsonFieldQuery: (field: string, conditions: Record<string, any>) => WhereOptions<any>;
    buildFullTextSearch: (searchColumn: string, searchTerm: string, options?: {
        language?: string;
    }) => WhereOptions<any>;
    buildDynamicSort: (sortParams: string | string[], allowedFields: string[]) => Array<[string, "ASC" | "DESC"]>;
    buildRangeQuery: (ranges: Record<string, {
        min?: any;
        max?: any;
    }>) => WhereOptions<any>;
    cursorPaginate: <T extends Model>(model: ModelStatic<T>, options: CursorPaginationOptions, queryOptions?: FindOptions<T>) => Promise<{
        data: T[];
        nextCursor: string | null;
        previousCursor: string | null;
        hasMore: boolean;
    }>;
    offsetPaginate: <T extends Model>(model: ModelStatic<T>, options: OffsetPaginationOptions, queryOptions?: FindOptions<T>) => Promise<{
        data: T[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            hasNext: boolean;
            hasPrevious: boolean;
        };
    }>;
    keysetPaginate: <T extends Model>(model: ModelStatic<T>, options: {
        keyFields: string[];
        lastValues?: any[];
        limit: number;
        direction?: "ASC" | "DESC";
    }) => Promise<{
        data: T[];
        nextKey: any[] | null;
    }>;
    bulkInsert: <T extends Model>(model: ModelStatic<T>, options: BulkInsertOptions<T>) => Promise<T[]>;
    bulkUpdate: <T extends Model>(model: ModelStatic<T>, options: BulkUpdateOptions<T>) => Promise<number>;
    bulkDelete: <T extends Model>(model: ModelStatic<T>, options: BulkDeleteOptions) => Promise<number>;
    bulkUpsert: <T extends Model>(model: ModelStatic<T>, options: {
        data: Partial<T>[];
        conflictFields: string[];
        updateFields: string[];
        transaction?: Transaction;
    }) => Promise<{
        created: number;
        updated: number;
    }>;
    withTransaction: <T>(sequelize: Sequelize, callback: (transaction: Transaction) => Promise<T>, options?: TransactionOptions) => Promise<T>;
    createSavepoint: (transaction: Transaction, savepointName: string) => Promise<void>;
    rollbackToSavepoint: (transaction: Transaction, savepointName: string) => Promise<void>;
    withNestedSavepoints: <T>(sequelize: Sequelize, operations: Array<(transaction: Transaction) => Promise<T>>) => Promise<T[]>;
    retryTransaction: <T>(sequelize: Sequelize, callback: (transaction: Transaction) => Promise<T>, options?: {
        maxRetries?: number;
        backoffMs?: number;
        shouldRetry?: (error: Error) => boolean;
    }) => Promise<T>;
    softDelete: <T extends Model>(model: ModelStatic<T>, where: WhereOptions<T>, config?: SoftDeleteConfig) => Promise<number>;
    restoreSoftDeleted: <T extends Model>(model: ModelStatic<T>, where: WhereOptions<T>, config?: SoftDeleteConfig) => Promise<number>;
    hardDeleteSoftDeleted: <T extends Model>(model: ModelStatic<T>, where: WhereOptions<T>, config?: SoftDeleteConfig) => Promise<number>;
    findSoftDeleted: <T extends Model>(model: ModelStatic<T>, options?: FindOptions<T>) => Promise<T[]>;
    createAuditTrail: (sequelize: Sequelize, entry: AuditTrailEntry, config: AuditTrailConfig) => Promise<void>;
    trackChanges: (oldRecord: any, newRecord: any) => Record<string, {
        old: any;
        new: any;
    }>;
    queryAuditTrail: (sequelize: Sequelize, criteria: {
        entityId?: string;
        entityType?: string;
        actions?: string[];
        userId?: string;
        startDate?: Date;
        endDate?: Date;
    }, config: AuditTrailConfig) => Promise<any[]>;
    seedModel: <T extends Model>(config: SeedConfig) => Promise<T[]>;
    seedDatabase: (configs: SeedConfig[]) => Promise<void>;
    generateSeedData: <T>(count: number, factory: (index: number) => Partial<T>) => Partial<T>[];
    createTableMigration: (tableName: string, attributes: ModelAttributes, options?: any) => MigrationHelper;
    addColumnMigration: (tableName: string, columnName: string, columnDefinition: any) => MigrationHelper;
    createIndexMigration: (tableName: string, fields: string[], options?: {
        unique?: boolean;
        name?: string;
    }) => MigrationHelper;
    getConnectionPoolStats: (sequelize: Sequelize) => ConnectionPoolStats;
    drainConnectionPool: (sequelize: Sequelize) => Promise<void>;
    validatePoolConnections: (sequelize: Sequelize) => Promise<number>;
    analyzeQueryPerformance: (sequelize: Sequelize, query: string, replacements?: any) => Promise<any>;
    measureQueryTime: <T>(queryFn: () => Promise<T>) => Promise<{
        result: T;
        metrics: QueryPerformanceMetrics;
    }>;
    createQueryCache: <T>(queryFn: () => Promise<T>, options: {
        ttl: number;
        key: string;
    }) => (() => Promise<T>);
    optimizeQueryWithIndex: (sequelize: Sequelize, tableName: string, fields: string[], options?: {
        unique?: boolean;
        name?: string;
        type?: string;
    }) => Promise<void>;
    backupDatabase: (sequelize: Sequelize, options: BackupOptions) => Promise<string>;
    restoreDatabase: (sequelize: Sequelize, options: RestoreOptions) => Promise<number>;
    createModelFactory: <T extends Model>(config: ModelFactoryConfig<T>) => {
        build(overrides?: Partial<T>, traitNames?: string[]): Partial<T>;
        create(overrides?: Partial<T>, traitNames?: string[]): Promise<T>;
        createMany(count: number, overrides?: Partial<T>, traitNames?: string[]): Promise<T[]>;
    };
    checkDatabaseHealth: (sequelize: Sequelize) => Promise<DatabaseHealthCheck>;
    checkDatabaseWriteability: (sequelize: Sequelize) => Promise<boolean>;
    monitorSlowQueries: (sequelize: Sequelize, thresholdMs: number) => (() => void);
};
export default _default;
//# sourceMappingURL=database-orm-kit.d.ts.map