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
    failed: Array<{
        index: number;
        error: string;
        data: any;
    }>;
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
export declare const createGenericCrudService: <T>(model: any, entityName: string) => {
    create: (data: Partial<T>, options?: CrudOptions) => Promise<T>;
    findById: (id: string, options?: CrudOptions) => Promise<unknown>;
    findAll: (pagination: PaginationOptions, options?: CrudOptions) => Promise<PaginatedResult<unknown>>;
    update: (id: string, data: Partial<T>, options?: CrudOptions) => Promise<T | null>;
    delete: (id: string, options?: CrudOptions) => Promise<boolean>;
    entityName: string;
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
export declare const createRepository: <T>(model: any) => {
    findOne: (options: QueryBuilderOptions) => any;
    findAll: (options: QueryBuilderOptions) => any;
    findById: (id: string, options?: CrudOptions) => Promise<unknown>;
    save: (data: Partial<T>, options?: CrudOptions) => Promise<T>;
    update: (id: string, data: Partial<T>, options?: CrudOptions) => Promise<T | null>;
    delete: (id: string, options?: CrudOptions) => Promise<boolean>;
    count: (where?: Record<string, any>) => any;
};
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
export declare const createSingle: <T>(model: any, data: Partial<T>, options?: CrudOptions) => Promise<T>;
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
export declare const createBulk: <T>(model: any, dataArray: Partial<T>[], options?: CrudOptions) => Promise<T[]>;
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
export declare const createBatch: <T>(model: any, dataArray: Partial<T>[], batchSize?: number, options?: CrudOptions) => Promise<BulkOperationResult<T>>;
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
export declare const createWithAudit: <T>(model: any, data: Partial<T>, userId: string, transaction?: any) => Promise<T>;
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
export declare const findById: <T>(model: any, id: string, options?: CrudOptions) => Promise<T | null>;
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
export declare const findOne: <T>(model: any, where: Record<string, any>, options?: CrudOptions) => Promise<T | null>;
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
export declare const findAllPaginated: <T>(model: any, pagination: PaginationOptions, options?: CrudOptions) => Promise<PaginatedResult<T>>;
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
export declare const searchRecords: <T>(model: any, filters: FilterOptions[], sort?: SortOptions[], pagination?: PaginationOptions, options?: CrudOptions) => Promise<PaginatedResult<T>>;
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
export declare const updateSingle: <T>(model: any, id: string, data: Partial<T>, options?: CrudOptions) => Promise<T | null>;
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
export declare const updateBulk: <T>(model: any, where: Record<string, any>, data: Partial<T>, options?: CrudOptions) => Promise<number>;
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
export declare const partialUpdate: <T>(model: any, id: string, partialData: Partial<T>, options?: CrudOptions) => Promise<T | null>;
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
export declare const fullUpdate: <T>(model: any, id: string, fullData: T, options?: CrudOptions) => Promise<T | null>;
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
export declare const updateWithOptimisticLock: <T>(model: any, id: string, data: Partial<T>, lockOptions: OptimisticLockOptions, options?: CrudOptions) => Promise<T>;
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
export declare const softDelete: (model: any, id: string, options?: CrudOptions) => Promise<boolean>;
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
export declare const hardDelete: (model: any, id: string, options?: CrudOptions) => Promise<boolean>;
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
export declare const bulkSoftDelete: (model: any, where: Record<string, any>, options?: CrudOptions) => Promise<number>;
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
export declare const bulkHardDelete: (model: any, where: Record<string, any>, options?: CrudOptions) => Promise<number>;
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
export declare const restoreDeleted: (model: any, id: string, options?: CrudOptions) => Promise<boolean>;
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
export declare const upsert: <T>(model: any, data: Partial<T>, conflictFields: string[], options?: CrudOptions) => Promise<UpsertResult<T>>;
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
export declare const bulkUpsert: <T>(model: any, dataArray: Partial<T>[], conflictFields: string[], options?: CrudOptions) => Promise<BulkOperationResult<T>>;
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
export declare const executeInTransaction: <T>(sequelize: any, operation: (transaction: any) => Promise<T>) => Promise<T>;
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
export declare const createWithRelationsInTransaction: <T>(sequelize: any, operations: Array<{
    model: any;
    data: Partial<T>;
}>, options?: CrudOptions) => Promise<any[]>;
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
export declare const findWithRelations: <T>(model: any, id: string, relations: string[], options?: CrudOptions) => Promise<T | null>;
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
export declare const createWithNestedRelations: <T>(sequelize: any, model: any, data: any, relationModels: Record<string, any>, options?: CrudOptions) => Promise<T>;
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
export declare const calculatePaginationMeta: (page: number, limit: number, total: number) => {
    page: number;
    limit: number;
    offset: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
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
export declare const createPaginationFromQuery: (query: Record<string, any>, defaultLimit?: number, maxLimit?: number) => PaginationOptions;
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
export declare const buildWhereClause: (filters: FilterOptions[]) => Record<string, any>;
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
export declare const buildOrderClause: (sortOptions: SortOptions[]) => Array<[string, string]>;
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
export declare const parseFiltersFromQuery: (query: Record<string, any>) => FilterOptions[];
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
export declare const selectFields: <T>(model: any, fields: string[], where?: Record<string, any>, options?: CrudOptions) => Promise<Partial<T>[]>;
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
export declare const excludeFields: <T>(model: any, excludeFields: string[], where?: Record<string, any>, options?: CrudOptions) => Promise<Partial<T>[]>;
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
export declare const createAuditLog: (action: AuditLogEntry["action"], entityName: string, entityId: string, userId?: string, changes?: Record<string, any>) => AuditLogEntry;
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
export declare const withAuditLog: <T>(operation: () => Promise<T>, action: AuditLogEntry["action"], entityName: string, entityId: string, logHandler: (log: AuditLogEntry) => Promise<void>, userId?: string) => Promise<T>;
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
export declare const createCrudEvent: <T>(action: CrudEventPayload<T>["action"], entity: T, metadata?: Record<string, any>) => CrudEventPayload<T>;
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
export declare const withCrudEvent: <T>(operation: () => Promise<T>, action: CrudEventPayload<T>["action"], emitter: (event: CrudEventPayload<T>) => void, metadata?: Record<string, any>) => Promise<T>;
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
export declare const countRecords: (model: any, where?: Record<string, any>, options?: CrudOptions) => Promise<number>;
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
export declare const existsById: (model: any, id: string, options?: CrudOptions) => Promise<boolean>;
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
export declare const existsWhere: (model: any, where: Record<string, any>, options?: CrudOptions) => Promise<boolean>;
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
export declare const findDistinct: (model: any, field: string, where?: Record<string, any>, options?: CrudOptions) => Promise<any[]>;
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
export declare const aggregateByField: (model: any, groupField: string, where?: Record<string, any>, options?: CrudOptions) => Promise<Array<{
    value: any;
    count: number;
}>>;
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
export declare const findWithCursor: <T>(model: any, cursor?: string, limit?: number, sort?: SortOptions[], where?: Record<string, any>, options?: CrudOptions) => Promise<{
    data: T[];
    nextCursor: string | null;
    hasMore: boolean;
}>;
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
export declare const findByIds: <T>(model: any, ids: string[], options?: CrudOptions) => Promise<T[]>;
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
export declare const syncWithExternalData: <T>(sequelize: any, model: any, externalData: Array<Partial<T> & {
    id?: string;
}>, conflictFields: string[], options?: CrudOptions) => Promise<{
    created: number;
    updated: number;
    deleted: number;
}>;
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
export declare const validateData: <T>(data: Partial<T>, validator: (data: Partial<T>) => Promise<string[]> | string[]) => Promise<{
    valid: boolean;
    errors: string[];
}>;
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
export declare const createWithValidation: <T>(model: any, data: Partial<T>, validator: (data: Partial<T>) => Promise<string[]> | string[], options?: CrudOptions) => Promise<T>;
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
export declare const updateWithValidation: <T>(model: any, id: string, data: Partial<T>, validator: (data: Partial<T>) => Promise<string[]> | string[], options?: CrudOptions) => Promise<T | null>;
declare const _default: {
    createGenericCrudService: <T>(model: any, entityName: string) => {
        create: (data: Partial<T>, options?: CrudOptions) => Promise<T>;
        findById: (id: string, options?: CrudOptions) => Promise<unknown>;
        findAll: (pagination: PaginationOptions, options?: CrudOptions) => Promise<PaginatedResult<unknown>>;
        update: (id: string, data: Partial<T>, options?: CrudOptions) => Promise<T | null>;
        delete: (id: string, options?: CrudOptions) => Promise<boolean>;
        entityName: string;
    };
    createRepository: <T>(model: any) => {
        findOne: (options: QueryBuilderOptions) => any;
        findAll: (options: QueryBuilderOptions) => any;
        findById: (id: string, options?: CrudOptions) => Promise<unknown>;
        save: (data: Partial<T>, options?: CrudOptions) => Promise<T>;
        update: (id: string, data: Partial<T>, options?: CrudOptions) => Promise<T | null>;
        delete: (id: string, options?: CrudOptions) => Promise<boolean>;
        count: (where?: Record<string, any>) => any;
    };
    createSingle: <T>(model: any, data: Partial<T>, options?: CrudOptions) => Promise<T>;
    createBulk: <T>(model: any, dataArray: Partial<T>[], options?: CrudOptions) => Promise<T[]>;
    createBatch: <T>(model: any, dataArray: Partial<T>[], batchSize?: number, options?: CrudOptions) => Promise<BulkOperationResult<T>>;
    createWithAudit: <T>(model: any, data: Partial<T>, userId: string, transaction?: any) => Promise<T>;
    findById: <T>(model: any, id: string, options?: CrudOptions) => Promise<T | null>;
    findOne: <T>(model: any, where: Record<string, any>, options?: CrudOptions) => Promise<T | null>;
    findAllPaginated: <T>(model: any, pagination: PaginationOptions, options?: CrudOptions) => Promise<PaginatedResult<T>>;
    searchRecords: <T>(model: any, filters: FilterOptions[], sort?: SortOptions[], pagination?: PaginationOptions, options?: CrudOptions) => Promise<PaginatedResult<T>>;
    updateSingle: <T>(model: any, id: string, data: Partial<T>, options?: CrudOptions) => Promise<T | null>;
    updateBulk: <T>(model: any, where: Record<string, any>, data: Partial<T>, options?: CrudOptions) => Promise<number>;
    partialUpdate: <T>(model: any, id: string, partialData: Partial<T>, options?: CrudOptions) => Promise<T | null>;
    fullUpdate: <T>(model: any, id: string, fullData: T, options?: CrudOptions) => Promise<T | null>;
    updateWithOptimisticLock: <T>(model: any, id: string, data: Partial<T>, lockOptions: OptimisticLockOptions, options?: CrudOptions) => Promise<T>;
    softDelete: (model: any, id: string, options?: CrudOptions) => Promise<boolean>;
    hardDelete: (model: any, id: string, options?: CrudOptions) => Promise<boolean>;
    bulkSoftDelete: (model: any, where: Record<string, any>, options?: CrudOptions) => Promise<number>;
    bulkHardDelete: (model: any, where: Record<string, any>, options?: CrudOptions) => Promise<number>;
    restoreDeleted: (model: any, id: string, options?: CrudOptions) => Promise<boolean>;
    upsert: <T>(model: any, data: Partial<T>, conflictFields: string[], options?: CrudOptions) => Promise<UpsertResult<T>>;
    bulkUpsert: <T>(model: any, dataArray: Partial<T>[], conflictFields: string[], options?: CrudOptions) => Promise<BulkOperationResult<T>>;
    executeInTransaction: <T>(sequelize: any, operation: (transaction: any) => Promise<T>) => Promise<T>;
    createWithRelationsInTransaction: <T>(sequelize: any, operations: Array<{
        model: any;
        data: Partial<T>;
    }>, options?: CrudOptions) => Promise<any[]>;
    findWithRelations: <T>(model: any, id: string, relations: string[], options?: CrudOptions) => Promise<T | null>;
    createWithNestedRelations: <T>(sequelize: any, model: any, data: any, relationModels: Record<string, any>, options?: CrudOptions) => Promise<T>;
    calculatePaginationMeta: (page: number, limit: number, total: number) => {
        page: number;
        limit: number;
        offset: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrevious: boolean;
    };
    createPaginationFromQuery: (query: Record<string, any>, defaultLimit?: number, maxLimit?: number) => PaginationOptions;
    buildWhereClause: (filters: FilterOptions[]) => Record<string, any>;
    buildOrderClause: (sortOptions: SortOptions[]) => Array<[string, string]>;
    parseFiltersFromQuery: (query: Record<string, any>) => FilterOptions[];
    selectFields: <T>(model: any, fields: string[], where?: Record<string, any>, options?: CrudOptions) => Promise<Partial<T>[]>;
    excludeFields: <T>(model: any, excludeFields: string[], where?: Record<string, any>, options?: CrudOptions) => Promise<Partial<T>[]>;
    createAuditLog: (action: AuditLogEntry["action"], entityName: string, entityId: string, userId?: string, changes?: Record<string, any>) => AuditLogEntry;
    withAuditLog: <T>(operation: () => Promise<T>, action: AuditLogEntry["action"], entityName: string, entityId: string, logHandler: (log: AuditLogEntry) => Promise<void>, userId?: string) => Promise<T>;
    createCrudEvent: <T>(action: CrudEventPayload<T>["action"], entity: T, metadata?: Record<string, any>) => CrudEventPayload<T>;
    withCrudEvent: <T>(operation: () => Promise<T>, action: CrudEventPayload<T>["action"], emitter: (event: CrudEventPayload<T>) => void, metadata?: Record<string, any>) => Promise<T>;
    countRecords: (model: any, where?: Record<string, any>, options?: CrudOptions) => Promise<number>;
    existsById: (model: any, id: string, options?: CrudOptions) => Promise<boolean>;
    existsWhere: (model: any, where: Record<string, any>, options?: CrudOptions) => Promise<boolean>;
    findDistinct: (model: any, field: string, where?: Record<string, any>, options?: CrudOptions) => Promise<any[]>;
    aggregateByField: (model: any, groupField: string, where?: Record<string, any>, options?: CrudOptions) => Promise<Array<{
        value: any;
        count: number;
    }>>;
    findWithCursor: <T>(model: any, cursor?: string, limit?: number, sort?: SortOptions[], where?: Record<string, any>, options?: CrudOptions) => Promise<{
        data: T[];
        nextCursor: string | null;
        hasMore: boolean;
    }>;
    findByIds: <T>(model: any, ids: string[], options?: CrudOptions) => Promise<T[]>;
    syncWithExternalData: <T>(sequelize: any, model: any, externalData: Array<Partial<T> & {
        id?: string;
    }>, conflictFields: string[], options?: CrudOptions) => Promise<{
        created: number;
        updated: number;
        deleted: number;
    }>;
    validateData: <T>(data: Partial<T>, validator: (data: Partial<T>) => Promise<string[]> | string[]) => Promise<{
        valid: boolean;
        errors: string[];
    }>;
    createWithValidation: <T>(model: any, data: Partial<T>, validator: (data: Partial<T>) => Promise<string[]> | string[], options?: CrudOptions) => Promise<T>;
    updateWithValidation: <T>(model: any, id: string, data: Partial<T>, validator: (data: Partial<T>) => Promise<string[]> | string[], options?: CrudOptions) => Promise<T | null>;
};
export default _default;
//# sourceMappingURL=crud-operations-utils.d.ts.map