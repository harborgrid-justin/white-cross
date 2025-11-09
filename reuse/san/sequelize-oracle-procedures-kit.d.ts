/**
 * LOC: P1R2O3C4E5
 * File: /reuse/san/sequelize-oracle-procedures-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (v6.x)
 *   - @types/node (v18.x)
 *   - crypto (built-in)
 *
 * DOWNSTREAM (imported by):
 *   - Service layer implementations
 *   - Business logic processors
 *   - Data transformation pipelines
 *   - Batch processing systems
 */
/**
 * File: /reuse/san/sequelize-oracle-procedures-kit.ts
 * Locator: WC-UTL-SEQ-PROC-001
 * Purpose: Sequelize Oracle Procedures Kit - TypeScript alternatives to Oracle stored procedures
 *
 * Upstream: sequelize v6.x, Node 18+, crypto
 * Downstream: Service layers, business logic, batch processors, data pipelines
 * Dependencies: Sequelize v6.x, Node 18+, TypeScript 5.x
 * Exports: 44 stored procedure utilities for complex business logic, bulk operations, parameter handling, and result set management
 *
 * LLM Context: Production-grade Sequelize v6.x procedure alternatives for White Cross healthcare platform.
 * Provides function-based data operations, bulk processing, transaction management, parameter validation,
 * result set handling, versioning, and performance optimization patterns. HIPAA-compliant with comprehensive
 * audit logging and PHI protection capabilities.
 */
import { Model, ModelStatic, Sequelize, Transaction, WhereOptions, FindOptions, Attributes } from 'sequelize';
/**
 * Procedure parameter definition
 */
export interface ProcedureParameter {
    name: string;
    type: 'IN' | 'OUT' | 'INOUT';
    dataType: string;
    required?: boolean;
    defaultValue?: any;
    validation?: (value: any) => boolean | Promise<boolean>;
}
/**
 * Procedure execution context
 */
export interface ProcedureContext {
    transaction?: Transaction;
    userId?: string;
    sessionId?: string;
    auditLog?: boolean;
    timeout?: number;
    isolationLevel?: 'READ UNCOMMITTED' | 'READ COMMITTED' | 'REPEATABLE READ' | 'SERIALIZABLE';
}
/**
 * Procedure result set
 */
export interface ProcedureResult<T = any> {
    success: boolean;
    data?: T;
    rowCount?: number;
    affectedRows?: number;
    outputParams?: Record<string, any>;
    errors?: Error[];
    warnings?: string[];
    executionTime?: number;
    metadata?: Record<string, any>;
}
/**
 * Bulk operation configuration
 */
export interface BulkOperationConfig {
    batchSize?: number;
    parallelism?: number;
    continueOnError?: boolean;
    validateBeforeInsert?: boolean;
    updateOnDuplicate?: string[];
    hooks?: boolean;
}
/**
 * Procedure version metadata
 */
export interface ProcedureVersion {
    version: string;
    description: string;
    createdAt: Date;
    deprecated?: boolean;
    migration?: string;
}
/**
 * Stored procedure definition
 */
export interface StoredProcedure<TInput = any, TOutput = any> {
    name: string;
    version: string;
    parameters: ProcedureParameter[];
    execute: (params: TInput, context: ProcedureContext) => Promise<ProcedureResult<TOutput>>;
    validate?: (params: TInput) => Promise<boolean>;
    before?: (params: TInput, context: ProcedureContext) => Promise<void>;
    after?: (result: ProcedureResult<TOutput>, context: ProcedureContext) => Promise<void>;
}
/**
 * Cursor configuration for large result sets
 */
export interface CursorConfig {
    fetchSize?: number;
    scrollable?: boolean;
    holdable?: boolean;
    timeout?: number;
}
/**
 * Procedure execution statistics
 */
export interface ProcedureStats {
    totalExecutions: number;
    successCount: number;
    errorCount: number;
    averageExecutionTime: number;
    lastExecuted?: Date;
}
/**
 * Defines a stored procedure with comprehensive metadata.
 * Registers the procedure for execution and versioning.
 *
 * @param {StoredProcedure} procedure - Procedure definition
 * @returns {StoredProcedure} Registered procedure
 *
 * @example
 * ```typescript
 * const getUsersByRole = defineProcedure({
 *   name: 'sp_get_users_by_role',
 *   version: '1.0.0',
 *   parameters: [
 *     { name: 'role', type: 'IN', dataType: 'string', required: true },
 *     { name: 'limit', type: 'IN', dataType: 'number', defaultValue: 100 }
 *   ],
 *   execute: async (params, context) => {
 *     const users = await User.findAll({ where: { role: params.role }, limit: params.limit });
 *     return { success: true, data: users, rowCount: users.length };
 *   }
 * });
 * ```
 */
export declare function defineProcedure<TInput = any, TOutput = any>(procedure: StoredProcedure<TInput, TOutput>): StoredProcedure<TInput, TOutput>;
/**
 * Retrieves a registered stored procedure by name and version.
 * Supports latest version resolution.
 *
 * @param {string} name - Procedure name
 * @param {string} version - Procedure version (or 'latest')
 * @returns {StoredProcedure | undefined} Retrieved procedure
 *
 * @example
 * ```typescript
 * const procedure = getProcedure('sp_get_users_by_role', '1.0.0');
 * if (procedure) {
 *   const result = await executeProcedure(procedure, { role: 'admin' });
 * }
 * ```
 */
export declare function getProcedure(name: string, version?: string): StoredProcedure | undefined;
/**
 * Lists all registered procedures with optional filtering.
 * Useful for procedure discovery and documentation.
 *
 * @param {string} nameFilter - Optional name filter pattern
 * @returns {StoredProcedure[]} List of procedures
 *
 * @example
 * ```typescript
 * const userProcedures = listProcedures('sp_user_');
 * console.log(userProcedures.map(p => p.name));
 * ```
 */
export declare function listProcedures(nameFilter?: string): StoredProcedure[];
/**
 * Unregisters a stored procedure by name and version.
 * Used for cleanup or dynamic procedure management.
 *
 * @param {string} name - Procedure name
 * @param {string} version - Procedure version
 * @returns {boolean} Whether procedure was unregistered
 *
 * @example
 * ```typescript
 * unregisterProcedure('sp_deprecated_function', '0.9.0');
 * ```
 */
export declare function unregisterProcedure(name: string, version: string): boolean;
/**
 * Clears all registered procedures.
 * Primarily used for testing or system reset.
 *
 * @returns {void}
 *
 * @example
 * ```typescript
 * clearProcedures(); // Reset procedure registry
 * ```
 */
export declare function clearProcedures(): void;
/**
 * Validates procedure parameters against definition.
 * Ensures type safety and required field presence.
 *
 * @param {any} params - Input parameters
 * @param {ProcedureParameter[]} definition - Parameter definitions
 * @returns {Promise<ProcedureResult>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateParameters(
 *   { role: 'admin', limit: 50 },
 *   [
 *     { name: 'role', type: 'IN', dataType: 'string', required: true },
 *     { name: 'limit', type: 'IN', dataType: 'number' }
 *   ]
 * );
 * ```
 */
export declare function validateParameters(params: any, definition: ProcedureParameter[]): Promise<ProcedureResult>;
/**
 * Normalizes procedure parameters with defaults and type coercion.
 * Applies default values and converts types as needed.
 *
 * @param {any} params - Input parameters
 * @param {ProcedureParameter[]} definition - Parameter definitions
 * @returns {any} Normalized parameters
 *
 * @example
 * ```typescript
 * const normalized = normalizeParameters(
 *   { role: 'admin' },
 *   [
 *     { name: 'role', type: 'IN', dataType: 'string', required: true },
 *     { name: 'limit', type: 'IN', dataType: 'number', defaultValue: 100 }
 *   ]
 * ); // { role: 'admin', limit: 100 }
 * ```
 */
export declare function normalizeParameters(params: any, definition: ProcedureParameter[]): any;
/**
 * Extracts output parameters from procedure result.
 * Handles OUT and INOUT parameter types.
 *
 * @param {any} result - Procedure execution result
 * @param {ProcedureParameter[]} definition - Parameter definitions
 * @returns {Record<string, any>} Output parameters
 *
 * @example
 * ```typescript
 * const outputs = extractOutputParameters(
 *   { userId: 123, status: 'created', totalCount: 456 },
 *   [
 *     { name: 'userId', type: 'OUT', dataType: 'number' },
 *     { name: 'totalCount', type: 'OUT', dataType: 'number' }
 *   ]
 * ); // { userId: 123, totalCount: 456 }
 * ```
 */
export declare function extractOutputParameters(result: any, definition: ProcedureParameter[]): Record<string, any>;
/**
 * Sanitizes input parameters for SQL injection prevention.
 * Escapes special characters and validates input.
 *
 * @param {any} params - Input parameters
 * @returns {any} Sanitized parameters
 *
 * @example
 * ```typescript
 * const safe = sanitizeParameters({ query: "'; DROP TABLE users; --" });
 * ```
 */
export declare function sanitizeParameters(params: any): any;
/**
 * Executes a stored procedure with full lifecycle management.
 * Handles validation, execution, error handling, and auditing.
 *
 * @param {StoredProcedure} procedure - Procedure to execute
 * @param {any} params - Input parameters
 * @param {ProcedureContext} context - Execution context
 * @returns {Promise<ProcedureResult>} Execution result
 *
 * @example
 * ```typescript
 * const result = await executeProcedure(
 *   getUsersByRole,
 *   { role: 'admin', limit: 50 },
 *   { userId: 'user123', auditLog: true }
 * );
 * ```
 */
export declare function executeProcedure<TInput = any, TOutput = any>(procedure: StoredProcedure<TInput, TOutput>, params: TInput, context?: ProcedureContext): Promise<ProcedureResult<TOutput>>;
/**
 * Executes a procedure by name with automatic version resolution.
 * Convenience wrapper around executeProcedure.
 *
 * @param {string} name - Procedure name
 * @param {any} params - Input parameters
 * @param {ProcedureContext} context - Execution context
 * @param {string} version - Procedure version
 * @returns {Promise<ProcedureResult>} Execution result
 *
 * @example
 * ```typescript
 * const result = await executeProcedureByName(
 *   'sp_get_users_by_role',
 *   { role: 'admin' }
 * );
 * ```
 */
export declare function executeProcedureByName(name: string, params: any, context?: ProcedureContext, version?: string): Promise<ProcedureResult>;
/**
 * Executes multiple procedures in sequence within a transaction.
 * Ensures atomicity across procedure executions.
 *
 * @param {StoredProcedure[]} procedures - Procedures to execute
 * @param {any[]} paramsList - Parameters for each procedure
 * @param {ProcedureContext} context - Shared execution context
 * @returns {Promise<ProcedureResult[]>} Execution results
 *
 * @example
 * ```typescript
 * const results = await executeProcedureSequence(
 *   [createUser, assignRole, sendWelcomeEmail],
 *   [
 *     { email: 'user@example.com', name: 'John' },
 *     { userId: 123, role: 'admin' },
 *     { userId: 123, template: 'welcome' }
 *   ],
 *   { transaction: t }
 * );
 * ```
 */
export declare function executeProcedureSequence(procedures: StoredProcedure[], paramsList: any[], context?: ProcedureContext): Promise<ProcedureResult[]>;
/**
 * Executes procedures in parallel for performance.
 * Suitable for independent operations.
 *
 * @param {StoredProcedure[]} procedures - Procedures to execute
 * @param {any[]} paramsList - Parameters for each procedure
 * @param {ProcedureContext} context - Shared execution context
 * @returns {Promise<ProcedureResult[]>} Execution results
 *
 * @example
 * ```typescript
 * const results = await executeProcedureParallel(
 *   [fetchUserData, fetchOrderData, fetchPreferences],
 *   [{ userId: 123 }, { userId: 123 }, { userId: 123 }]
 * );
 * ```
 */
export declare function executeProcedureParallel(procedures: StoredProcedure[], paramsList: any[], context?: ProcedureContext): Promise<ProcedureResult[]>;
/**
 * Retries failed procedure execution with exponential backoff.
 * Handles transient failures gracefully.
 *
 * @param {StoredProcedure} procedure - Procedure to execute
 * @param {any} params - Input parameters
 * @param {ProcedureContext} context - Execution context
 * @param {number} maxRetries - Maximum retry attempts
 * @param {number} initialDelay - Initial delay in ms
 * @returns {Promise<ProcedureResult>} Execution result
 *
 * @example
 * ```typescript
 * const result = await retryProcedure(
 *   fetchExternalData,
 *   { endpoint: 'api/users' },
 *   {},
 *   3,
 *   1000
 * );
 * ```
 */
export declare function retryProcedure(procedure: StoredProcedure, params: any, context?: ProcedureContext, maxRetries?: number, initialDelay?: number): Promise<ProcedureResult>;
/**
 * Performs bulk insert with batching and error handling.
 * Optimized for large-scale data insertion.
 *
 * @param {ModelStatic<T>} model - Target model
 * @param {any[]} records - Records to insert
 * @param {BulkOperationConfig} config - Operation configuration
 * @param {ProcedureContext} context - Execution context
 * @returns {Promise<ProcedureResult>} Bulk insert result
 *
 * @example
 * ```typescript
 * const result = await bulkInsert(User, users, {
 *   batchSize: 1000,
 *   validateBeforeInsert: true,
 *   continueOnError: false
 * });
 * ```
 */
export declare function bulkInsert<T extends Model>(model: ModelStatic<T>, records: any[], config?: BulkOperationConfig, context?: ProcedureContext): Promise<ProcedureResult>;
/**
 * Performs bulk update with optimized batching.
 * Updates multiple records efficiently.
 *
 * @param {ModelStatic<T>} model - Target model
 * @param {any} updates - Update values
 * @param {WhereOptions} where - Update conditions
 * @param {BulkOperationConfig} config - Operation configuration
 * @param {ProcedureContext} context - Execution context
 * @returns {Promise<ProcedureResult>} Bulk update result
 *
 * @example
 * ```typescript
 * const result = await bulkUpdate(
 *   User,
 *   { status: 'active' },
 *   { deletedAt: null },
 *   { hooks: true }
 * );
 * ```
 */
export declare function bulkUpdate<T extends Model>(model: ModelStatic<T>, updates: any, where: WhereOptions, config?: BulkOperationConfig, context?: ProcedureContext): Promise<ProcedureResult>;
/**
 * Performs bulk delete with safety checks.
 * Supports soft delete and cascading.
 *
 * @param {ModelStatic<T>} model - Target model
 * @param {WhereOptions} where - Delete conditions
 * @param {BulkOperationConfig} config - Operation configuration
 * @param {ProcedureContext} context - Execution context
 * @returns {Promise<ProcedureResult>} Bulk delete result
 *
 * @example
 * ```typescript
 * const result = await bulkDelete(User, {
 *   lastLoginAt: { [Op.lt]: new Date('2023-01-01') }
 * });
 * ```
 */
export declare function bulkDelete<T extends Model>(model: ModelStatic<T>, where: WhereOptions, config?: BulkOperationConfig, context?: ProcedureContext): Promise<ProcedureResult>;
/**
 * Performs upsert (insert or update) with conflict resolution.
 * Handles duplicate key scenarios gracefully.
 *
 * @param {ModelStatic<T>} model - Target model
 * @param {any[]} records - Records to upsert
 * @param {string[]} conflictFields - Fields to check for conflicts
 * @param {BulkOperationConfig} config - Operation configuration
 * @param {ProcedureContext} context - Execution context
 * @returns {Promise<ProcedureResult>} Upsert result
 *
 * @example
 * ```typescript
 * const result = await bulkUpsert(User, users, ['email'], {
 *   updateOnDuplicate: ['firstName', 'lastName', 'updatedAt']
 * });
 * ```
 */
export declare function bulkUpsert<T extends Model>(model: ModelStatic<T>, records: any[], conflictFields: string[], config?: BulkOperationConfig, context?: ProcedureContext): Promise<ProcedureResult>;
/**
 * Merges data from source to target with conflict resolution.
 * Supports complex merge logic.
 *
 * @param {ModelStatic<T>} model - Target model
 * @param {any[]} sourceData - Source data to merge
 * @param {string[]} matchFields - Fields to match on
 * @param {Function} mergeFn - Merge conflict resolution function
 * @param {ProcedureContext} context - Execution context
 * @returns {Promise<ProcedureResult>} Merge result
 *
 * @example
 * ```typescript
 * const result = await bulkMerge(User, externalUsers, ['email'],
 *   (existing, incoming) => ({ ...existing, ...incoming, updatedAt: new Date() })
 * );
 * ```
 */
export declare function bulkMerge<T extends Model>(model: ModelStatic<T>, sourceData: any[], matchFields: string[], mergeFn: (existing: any, incoming: any) => any, context?: ProcedureContext): Promise<ProcedureResult>;
/**
 * Executes complex multi-table transaction with rollback support.
 * Coordinates operations across multiple models atomically.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Function} operations - Transaction operations
 * @param {ProcedureContext} context - Execution context
 * @returns {Promise<ProcedureResult>} Transaction result
 *
 * @example
 * ```typescript
 * const result = await executeTransaction(sequelize, async (t) => {
 *   const user = await User.create({ email: 'user@example.com' }, { transaction: t });
 *   await Profile.create({ userId: user.id, name: 'John' }, { transaction: t });
 *   return { userId: user.id };
 * });
 * ```
 */
export declare function executeTransaction(sequelize: Sequelize, operations: (transaction: Transaction) => Promise<any>, context?: ProcedureContext): Promise<ProcedureResult>;
/**
 * Implements optimistic locking with version checking.
 * Prevents lost updates in concurrent scenarios.
 *
 * @param {ModelStatic<T>} model - Target model
 * @param {string} id - Record ID
 * @param {any} updates - Update values
 * @param {number} expectedVersion - Expected version number
 * @param {ProcedureContext} context - Execution context
 * @returns {Promise<ProcedureResult>} Update result
 *
 * @example
 * ```typescript
 * const result = await optimisticUpdate(
 *   User,
 *   'user-123',
 *   { firstName: 'Jane' },
 *   5
 * );
 * ```
 */
export declare function optimisticUpdate<T extends Model>(model: ModelStatic<T>, id: string, updates: any, expectedVersion: number, context?: ProcedureContext): Promise<ProcedureResult>;
/**
 * Processes hierarchical data with parent-child relationships.
 * Handles tree structures and nested data.
 *
 * @param {ModelStatic<T>} model - Target model
 * @param {string} parentId - Parent record ID
 * @param {number} depth - Maximum depth to traverse
 * @param {ProcedureContext} context - Execution context
 * @returns {Promise<ProcedureResult>} Hierarchical data
 *
 * @example
 * ```typescript
 * const result = await processHierarchy(Category, null, 5);
 * // Returns nested category tree
 * ```
 */
export declare function processHierarchy<T extends Model>(model: ModelStatic<T>, parentId?: string | null, depth?: number, context?: ProcedureContext): Promise<ProcedureResult>;
/**
 * Aggregates data with grouping and calculations.
 * Performs complex analytical queries.
 *
 * @param {ModelStatic<T>} model - Target model
 * @param {string[]} groupBy - Group by fields
 * @param {Record<string, string>} aggregations - Aggregation functions
 * @param {WhereOptions} where - Filter conditions
 * @param {ProcedureContext} context - Execution context
 * @returns {Promise<ProcedureResult>} Aggregated results
 *
 * @example
 * ```typescript
 * const result = await aggregateData(Order, ['status'], {
 *   totalAmount: 'SUM(amount)',
 *   orderCount: 'COUNT(*)',
 *   avgAmount: 'AVG(amount)'
 * }, { createdAt: { [Op.gte]: new Date('2024-01-01') } });
 * ```
 */
export declare function aggregateData<T extends Model>(model: ModelStatic<T>, groupBy: string[], aggregations: Record<string, string>, where?: WhereOptions, context?: ProcedureContext): Promise<ProcedureResult>;
/**
 * Pivots data from rows to columns for reporting.
 * Transforms normalized data into pivot table format.
 *
 * @param {ModelStatic<T>} model - Target model
 * @param {string} rowField - Row dimension field
 * @param {string} columnField - Column dimension field
 * @param {string} valueField - Value field to aggregate
 * @param {string} aggregateFunction - Aggregation function
 * @param {ProcedureContext} context - Execution context
 * @returns {Promise<ProcedureResult>} Pivoted data
 *
 * @example
 * ```typescript
 * const result = await pivotData(
 *   Sales,
 *   'productId',
 *   'month',
 *   'revenue',
 *   'SUM'
 * );
 * ```
 */
export declare function pivotData<T extends Model>(model: ModelStatic<T>, rowField: string, columnField: string, valueField: string, aggregateFunction?: string, context?: ProcedureContext): Promise<ProcedureResult>;
/**
 * Paginates large result sets efficiently.
 * Implements cursor-based and offset-based pagination.
 *
 * @param {ModelStatic<T>} model - Target model
 * @param {number} page - Page number (1-based)
 * @param {number} pageSize - Records per page
 * @param {FindOptions} options - Query options
 * @param {ProcedureContext} context - Execution context
 * @returns {Promise<ProcedureResult>} Paginated results
 *
 * @example
 * ```typescript
 * const result = await paginateResults(User, 2, 50, {
 *   where: { isActive: true },
 *   order: [['createdAt', 'DESC']]
 * });
 * ```
 */
export declare function paginateResults<T extends Model>(model: ModelStatic<T>, page: number, pageSize: number, options?: FindOptions<Attributes<T>>, context?: ProcedureContext): Promise<ProcedureResult>;
/**
 * Streams large result sets to avoid memory overflow.
 * Processes results in chunks using cursors.
 *
 * @param {ModelStatic<T>} model - Target model
 * @param {FindOptions} options - Query options
 * @param {Function} processFn - Processing function for each chunk
 * @param {number} chunkSize - Records per chunk
 * @param {ProcedureContext} context - Execution context
 * @returns {Promise<ProcedureResult>} Streaming result
 *
 * @example
 * ```typescript
 * await streamResults(User, { where: { isActive: true } },
 *   async (users) => {
 *     await sendEmailBatch(users);
 *   },
 *   1000
 * );
 * ```
 */
export declare function streamResults<T extends Model>(model: ModelStatic<T>, options: FindOptions<Attributes<T>>, processFn: (chunk: T[]) => Promise<void>, chunkSize?: number, context?: ProcedureContext): Promise<ProcedureResult>;
export declare function cacheResults<T>(cacheKey: string, fetchFn: () => Promise<T>, ttl?: number): Promise<ProcedureResult<T>>;
/**
 * Invalidates cached procedure results.
 * Supports pattern-based invalidation.
 *
 * @param {string} pattern - Cache key pattern (supports wildcards)
 * @returns {number} Number of invalidated entries
 *
 * @example
 * ```typescript
 * invalidateCache('users:*'); // Invalidate all user caches
 * ```
 */
export declare function invalidateCache(pattern: string): number;
export declare function registerProcedureVersion(procedureName: string, version: ProcedureVersion): void;
/**
 * Retrieves version history for a procedure.
 * Returns all registered versions.
 *
 * @param {string} procedureName - Procedure name
 * @returns {ProcedureVersion[]} Version history
 *
 * @example
 * ```typescript
 * const versions = getProcedureVersions('sp_get_users');
 * console.log(versions.map(v => v.version));
 * ```
 */
export declare function getProcedureVersions(procedureName: string): ProcedureVersion[];
/**
 * Marks a procedure version as deprecated.
 * Adds deprecation warnings to execution.
 *
 * @param {string} procedureName - Procedure name
 * @param {string} version - Version to deprecate
 * @param {string} reason - Deprecation reason
 * @returns {boolean} Whether version was deprecated
 *
 * @example
 * ```typescript
 * deprecateProcedureVersion('sp_get_users', '1.0.0',
 *   'Use version 2.0.0 with pagination support'
 * );
 * ```
 */
export declare function deprecateProcedureVersion(procedureName: string, version: string, reason: string): boolean;
export declare function analyzeProcedurePerformance(procedureName: string): ProcedureStats | undefined;
/**
 * Records procedure execution metrics.
 * Updates performance statistics.
 *
 * @param {string} procedureName - Procedure name
 * @param {boolean} success - Whether execution succeeded
 * @param {number} executionTime - Execution time in ms
 * @returns {void}
 *
 * @example
 * ```typescript
 * recordProcedureExecution('sp_get_users', true, 125);
 * ```
 */
export declare function recordProcedureExecution(procedureName: string, success: boolean, executionTime: number): void;
/**
 * Logs procedure execution for HIPAA compliance and auditing.
 * Records all procedure calls with parameters and results.
 *
 * @param {string} procedureName - Procedure name
 * @param {string} version - Procedure version
 * @param {ProcedureContext} context - Execution context
 * @param {ProcedureResult} result - Execution result
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await logProcedureExecution('sp_update_patient', '1.0.0',
 *   { userId: 'user123', sessionId: 'session456' },
 *   { success: true, affectedRows: 1 }
 * );
 * ```
 */
export declare function logProcedureExecution(procedureName: string, version: string, context: ProcedureContext, result: ProcedureResult): Promise<void>;
/**
 * Batches procedure calls for efficiency.
 * Groups multiple procedure executions.
 *
 * @param {StoredProcedure} procedure - Procedure to batch
 * @param {any[]} paramsList - Array of parameters
 * @param {ProcedureContext} context - Execution context
 * @param {number} batchSize - Batch size
 * @returns {Promise<ProcedureResult[]>} Batch results
 *
 * @example
 * ```typescript
 * const results = await batchProcedureCalls(
 *   updateUserStatus,
 *   [{ userId: 1, status: 'active' }, { userId: 2, status: 'inactive' }],
 *   {},
 *   10
 * );
 * ```
 */
export declare function batchProcedureCalls(procedure: StoredProcedure, paramsList: any[], context?: ProcedureContext, batchSize?: number): Promise<ProcedureResult[]>;
/**
 * Compares two result sets for differences.
 * Useful for data reconciliation.
 *
 * @param {any[]} resultSet1 - First result set
 * @param {any[]} resultSet2 - Second result set
 * @param {string} keyField - Key field for comparison
 * @returns {object} Differences between result sets
 *
 * @example
 * ```typescript
 * const diff = compareResultSets(oldData, newData, 'id');
 * ```
 */
export declare function compareResultSets(resultSet1: any[], resultSet2: any[], keyField?: string): {
    added: any[];
    removed: any[];
    modified: any[];
};
/**
 * Exports result set to CSV format.
 * Generates downloadable data export.
 *
 * @param {any[]} resultSet - Data to export
 * @param {string[]} columns - Columns to include
 * @returns {string} CSV formatted string
 *
 * @example
 * ```typescript
 * const csv = exportResultSetToCsv(users, ['id', 'email', 'name']);
 * ```
 */
export declare function exportResultSetToCsv(resultSet: any[], columns?: string[]): string;
/**
 * Imports data from CSV format.
 * Parses CSV into result set.
 *
 * @param {string} csv - CSV formatted string
 * @param {boolean} hasHeader - Whether CSV has header row
 * @returns {any[]} Parsed result set
 *
 * @example
 * ```typescript
 * const data = importResultSetFromCsv(csvContent, true);
 * ```
 */
export declare function importResultSetFromCsv(csv: string, hasHeader?: boolean): any[];
/**
 * Validates result set schema.
 * Ensures data conforms to expected structure.
 *
 * @param {any[]} resultSet - Result set to validate
 * @param {object} schema - Expected schema
 * @returns {ProcedureResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateResultSetSchema(data, {
 *   id: 'string',
 *   email: 'string',
 *   age: 'number'
 * });
 * ```
 */
export declare function validateResultSetSchema(resultSet: any[], schema: Record<string, string>): ProcedureResult;
/**
 * Deduplicates result set based on key field.
 * Removes duplicate records.
 *
 * @param {any[]} resultSet - Result set to deduplicate
 * @param {string} keyField - Field to use for deduplication
 * @param {string} strategy - Deduplication strategy ('first' or 'last')
 * @returns {any[]} Deduplicated result set
 *
 * @example
 * ```typescript
 * const unique = deduplicateResultSet(data, 'email', 'last');
 * ```
 */
export declare function deduplicateResultSet(resultSet: any[], keyField?: string, strategy?: 'first' | 'last'): any[];
/**
 * Sorts result set by multiple fields.
 * Implements multi-column sorting.
 *
 * @param {any[]} resultSet - Result set to sort
 * @param {Array<{field: string, order: 'ASC' | 'DESC'}>} sortBy - Sort configuration
 * @returns {any[]} Sorted result set
 *
 * @example
 * ```typescript
 * const sorted = sortResultSet(data, [
 *   { field: 'lastName', order: 'ASC' },
 *   { field: 'firstName', order: 'ASC' }
 * ]);
 * ```
 */
export declare function sortResultSet(resultSet: any[], sortBy: Array<{
    field: string;
    order: 'ASC' | 'DESC';
}>): any[];
/**
 * Filters result set by multiple conditions.
 * Implements complex filtering logic.
 *
 * @param {any[]} resultSet - Result set to filter
 * @param {Record<string, any>} filters - Filter conditions
 * @returns {any[]} Filtered result set
 *
 * @example
 * ```typescript
 * const filtered = filterResultSet(data, {
 *   status: 'active',
 *   role: ['admin', 'moderator']
 * });
 * ```
 */
export declare function filterResultSet(resultSet: any[], filters: Record<string, any>): any[];
/**
 * Groups result set by field.
 * Creates grouped data structure.
 *
 * @param {any[]} resultSet - Result set to group
 * @param {string} groupByField - Field to group by
 * @returns {Map<any, any[]>} Grouped result set
 *
 * @example
 * ```typescript
 * const grouped = groupResultSet(orders, 'customerId');
 * ```
 */
export declare function groupResultSet(resultSet: any[], groupByField: string): Map<any, any[]>;
/**
 * Transforms result set fields.
 * Maps data to new structure.
 *
 * @param {any[]} resultSet - Result set to transform
 * @param {Record<string, Function>} transformers - Field transformers
 * @returns {any[]} Transformed result set
 *
 * @example
 * ```typescript
 * const transformed = transformResultSet(users, {
 *   email: (val) => val.toLowerCase(),
 *   createdAt: (val) => new Date(val)
 * });
 * ```
 */
export declare function transformResultSet(resultSet: any[], transformers: Record<string, (value: any) => any>): any[];
declare const _default: {
    defineProcedure: typeof defineProcedure;
    getProcedure: typeof getProcedure;
    listProcedures: typeof listProcedures;
    unregisterProcedure: typeof unregisterProcedure;
    clearProcedures: typeof clearProcedures;
    validateParameters: typeof validateParameters;
    normalizeParameters: typeof normalizeParameters;
    extractOutputParameters: typeof extractOutputParameters;
    sanitizeParameters: typeof sanitizeParameters;
    executeProcedure: typeof executeProcedure;
    executeProcedureByName: typeof executeProcedureByName;
    executeProcedureSequence: typeof executeProcedureSequence;
    executeProcedureParallel: typeof executeProcedureParallel;
    retryProcedure: typeof retryProcedure;
    bulkInsert: typeof bulkInsert;
    bulkUpdate: typeof bulkUpdate;
    bulkDelete: typeof bulkDelete;
    bulkUpsert: typeof bulkUpsert;
    bulkMerge: typeof bulkMerge;
    executeTransaction: typeof executeTransaction;
    optimisticUpdate: typeof optimisticUpdate;
    processHierarchy: typeof processHierarchy;
    aggregateData: typeof aggregateData;
    pivotData: typeof pivotData;
    paginateResults: typeof paginateResults;
    streamResults: typeof streamResults;
    cacheResults: typeof cacheResults;
    invalidateCache: typeof invalidateCache;
    registerProcedureVersion: typeof registerProcedureVersion;
    getProcedureVersions: typeof getProcedureVersions;
    deprecateProcedureVersion: typeof deprecateProcedureVersion;
    analyzeProcedurePerformance: typeof analyzeProcedurePerformance;
    recordProcedureExecution: typeof recordProcedureExecution;
    logProcedureExecution: typeof logProcedureExecution;
    batchProcedureCalls: typeof batchProcedureCalls;
    compareResultSets: typeof compareResultSets;
    exportResultSetToCsv: typeof exportResultSetToCsv;
    importResultSetFromCsv: typeof importResultSetFromCsv;
    validateResultSetSchema: typeof validateResultSetSchema;
    deduplicateResultSet: typeof deduplicateResultSet;
    sortResultSet: typeof sortResultSet;
    filterResultSet: typeof filterResultSet;
    groupResultSet: typeof groupResultSet;
    transformResultSet: typeof transformResultSet;
};
export default _default;
//# sourceMappingURL=sequelize-oracle-procedures-kit.d.ts.map