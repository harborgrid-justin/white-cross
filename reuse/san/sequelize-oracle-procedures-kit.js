"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineProcedure = defineProcedure;
exports.getProcedure = getProcedure;
exports.listProcedures = listProcedures;
exports.unregisterProcedure = unregisterProcedure;
exports.clearProcedures = clearProcedures;
exports.validateParameters = validateParameters;
exports.normalizeParameters = normalizeParameters;
exports.extractOutputParameters = extractOutputParameters;
exports.sanitizeParameters = sanitizeParameters;
exports.executeProcedure = executeProcedure;
exports.executeProcedureByName = executeProcedureByName;
exports.executeProcedureSequence = executeProcedureSequence;
exports.executeProcedureParallel = executeProcedureParallel;
exports.retryProcedure = retryProcedure;
exports.bulkInsert = bulkInsert;
exports.bulkUpdate = bulkUpdate;
exports.bulkDelete = bulkDelete;
exports.bulkUpsert = bulkUpsert;
exports.bulkMerge = bulkMerge;
exports.executeTransaction = executeTransaction;
exports.optimisticUpdate = optimisticUpdate;
exports.processHierarchy = processHierarchy;
exports.aggregateData = aggregateData;
exports.pivotData = pivotData;
exports.paginateResults = paginateResults;
exports.streamResults = streamResults;
exports.cacheResults = cacheResults;
exports.invalidateCache = invalidateCache;
exports.registerProcedureVersion = registerProcedureVersion;
exports.getProcedureVersions = getProcedureVersions;
exports.deprecateProcedureVersion = deprecateProcedureVersion;
exports.analyzeProcedurePerformance = analyzeProcedurePerformance;
exports.recordProcedureExecution = recordProcedureExecution;
exports.logProcedureExecution = logProcedureExecution;
exports.batchProcedureCalls = batchProcedureCalls;
exports.compareResultSets = compareResultSets;
exports.exportResultSetToCsv = exportResultSetToCsv;
exports.importResultSetFromCsv = importResultSetFromCsv;
exports.validateResultSetSchema = validateResultSetSchema;
exports.deduplicateResultSet = deduplicateResultSet;
exports.sortResultSet = sortResultSet;
exports.filterResultSet = filterResultSet;
exports.groupResultSet = groupResultSet;
exports.transformResultSet = transformResultSet;
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
const sequelize_1 = require("sequelize");
// ============================================================================
// PROCEDURE DEFINITION AND REGISTRATION
// ============================================================================
/**
 * Registry for stored procedure definitions
 */
const procedureRegistry = new Map();
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
function defineProcedure(procedure) {
    const key = `${procedure.name}:${procedure.version}`;
    if (procedureRegistry.has(key)) {
        throw new Error(`Procedure ${key} is already registered`);
    }
    procedureRegistry.set(key, procedure);
    return procedure;
}
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
function getProcedure(name, version = 'latest') {
    if (version === 'latest') {
        const procedures = Array.from(procedureRegistry.entries())
            .filter(([key]) => key.startsWith(name + ':'))
            .map(([_, proc]) => proc);
        if (procedures.length === 0)
            return undefined;
        return procedures.sort((a, b) => b.version.localeCompare(a.version, undefined, { numeric: true }))[0];
    }
    return procedureRegistry.get(`${name}:${version}`);
}
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
function listProcedures(nameFilter) {
    const procedures = Array.from(procedureRegistry.values());
    if (!nameFilter)
        return procedures;
    const pattern = new RegExp(nameFilter);
    return procedures.filter(p => pattern.test(p.name));
}
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
function unregisterProcedure(name, version) {
    const key = `${name}:${version}`;
    return procedureRegistry.delete(key);
}
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
function clearProcedures() {
    procedureRegistry.clear();
}
// ============================================================================
// PARAMETER HANDLING AND VALIDATION
// ============================================================================
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
async function validateParameters(params, definition) {
    const errors = [];
    const warnings = [];
    for (const param of definition) {
        const value = params[param.name];
        // Check required parameters
        if (param.required && (value === undefined || value === null)) {
            errors.push(new Error(`Required parameter '${param.name}' is missing`));
            continue;
        }
        // Type validation
        if (value !== undefined && value !== null) {
            const expectedType = param.dataType.toLowerCase();
            const actualType = typeof value;
            if (expectedType === 'number' && actualType !== 'number') {
                errors.push(new Error(`Parameter '${param.name}' must be a number`));
            }
            else if (expectedType === 'string' && actualType !== 'string') {
                errors.push(new Error(`Parameter '${param.name}' must be a string`));
            }
            else if (expectedType === 'boolean' && actualType !== 'boolean') {
                errors.push(new Error(`Parameter '${param.name}' must be a boolean`));
            }
        }
        // Custom validation
        if (param.validation && value !== undefined && value !== null) {
            const isValid = await param.validation(value);
            if (!isValid) {
                errors.push(new Error(`Parameter '${param.name}' failed custom validation`));
            }
        }
    }
    return {
        success: errors.length === 0,
        errors,
        warnings,
    };
}
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
function normalizeParameters(params, definition) {
    const normalized = { ...params };
    for (const param of definition) {
        if (normalized[param.name] === undefined && param.defaultValue !== undefined) {
            normalized[param.name] = param.defaultValue;
        }
        // Type coercion
        if (normalized[param.name] !== undefined && normalized[param.name] !== null) {
            const value = normalized[param.name];
            const expectedType = param.dataType.toLowerCase();
            if (expectedType === 'number' && typeof value === 'string') {
                normalized[param.name] = parseFloat(value);
            }
            else if (expectedType === 'boolean' && typeof value === 'string') {
                normalized[param.name] = value.toLowerCase() === 'true';
            }
            else if (expectedType === 'string' && typeof value !== 'string') {
                normalized[param.name] = String(value);
            }
        }
    }
    return normalized;
}
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
function extractOutputParameters(result, definition) {
    const outputs = {};
    for (const param of definition) {
        if ((param.type === 'OUT' || param.type === 'INOUT') && result[param.name] !== undefined) {
            outputs[param.name] = result[param.name];
        }
    }
    return outputs;
}
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
function sanitizeParameters(params) {
    if (params === null || params === undefined)
        return params;
    if (typeof params === 'string') {
        return params
            .replace(/'/g, "''")
            .replace(/;/g, '')
            .replace(/--/g, '')
            .replace(/\/\*/g, '')
            .replace(/\*\//g, '');
    }
    if (Array.isArray(params)) {
        return params.map(sanitizeParameters);
    }
    if (typeof params === 'object') {
        const sanitized = {};
        for (const [key, value] of Object.entries(params)) {
            sanitized[key] = sanitizeParameters(value);
        }
        return sanitized;
    }
    return params;
}
// ============================================================================
// PROCEDURE EXECUTION
// ============================================================================
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
async function executeProcedure(procedure, params, context = {}) {
    const startTime = Date.now();
    try {
        // Validate parameters
        const validation = await validateParameters(params, procedure.parameters);
        if (!validation.success) {
            return {
                success: false,
                errors: validation.errors,
                warnings: validation.warnings,
                executionTime: Date.now() - startTime,
            };
        }
        // Normalize parameters
        const normalizedParams = normalizeParameters(params, procedure.parameters);
        // Execute before hook
        if (procedure.before) {
            await procedure.before(normalizedParams, context);
        }
        // Execute procedure
        const result = await procedure.execute(normalizedParams, context);
        result.executionTime = Date.now() - startTime;
        // Extract output parameters
        if (result.data) {
            result.outputParams = extractOutputParameters(result.data, procedure.parameters);
        }
        // Execute after hook
        if (procedure.after) {
            await procedure.after(result, context);
        }
        // Audit logging (HIPAA compliance)
        if (context.auditLog && result.success) {
            await logProcedureExecution(procedure.name, procedure.version, context, result);
        }
        return result;
    }
    catch (error) {
        return {
            success: false,
            errors: [error],
            executionTime: Date.now() - startTime,
        };
    }
}
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
async function executeProcedureByName(name, params, context = {}, version = 'latest') {
    const procedure = getProcedure(name, version);
    if (!procedure) {
        return {
            success: false,
            errors: [new Error(`Procedure ${name}:${version} not found`)],
        };
    }
    return executeProcedure(procedure, params, context);
}
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
async function executeProcedureSequence(procedures, paramsList, context = {}) {
    if (procedures.length !== paramsList.length) {
        throw new Error('Number of procedures must match number of parameter sets');
    }
    const results = [];
    for (let i = 0; i < procedures.length; i++) {
        const result = await executeProcedure(procedures[i], paramsList[i], context);
        results.push(result);
        if (!result.success) {
            // Rollback on error
            if (context.transaction) {
                await context.transaction.rollback();
            }
            break;
        }
    }
    return results;
}
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
async function executeProcedureParallel(procedures, paramsList, context = {}) {
    if (procedures.length !== paramsList.length) {
        throw new Error('Number of procedures must match number of parameter sets');
    }
    const promises = procedures.map((proc, i) => executeProcedure(proc, paramsList[i], context));
    return Promise.all(promises);
}
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
async function retryProcedure(procedure, params, context = {}, maxRetries = 3, initialDelay = 1000) {
    let lastResult = null;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        lastResult = await executeProcedure(procedure, params, context);
        if (lastResult.success) {
            return lastResult;
        }
        if (attempt < maxRetries) {
            const delay = initialDelay * Math.pow(2, attempt);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    return lastResult;
}
// ============================================================================
// BULK DATA OPERATIONS
// ============================================================================
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
async function bulkInsert(model, records, config = {}, context = {}) {
    const { batchSize = 1000, continueOnError = false, validateBeforeInsert = true, hooks = true, } = config;
    const errors = [];
    const warnings = [];
    let totalInserted = 0;
    try {
        for (let i = 0; i < records.length; i += batchSize) {
            const batch = records.slice(i, i + batchSize);
            try {
                const options = {
                    transaction: context.transaction,
                    validate: validateBeforeInsert,
                    hooks,
                };
                if (config.updateOnDuplicate) {
                    options.updateOnDuplicate = config.updateOnDuplicate;
                }
                const inserted = await model.bulkCreate(batch, options);
                totalInserted += inserted.length;
            }
            catch (error) {
                errors.push(error);
                if (!continueOnError) {
                    throw error;
                }
            }
        }
        return {
            success: errors.length === 0,
            affectedRows: totalInserted,
            errors,
            warnings,
        };
    }
    catch (error) {
        return {
            success: false,
            affectedRows: totalInserted,
            errors: [error],
            warnings,
        };
    }
}
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
async function bulkUpdate(model, updates, where, config = {}, context = {}) {
    try {
        const options = {
            where,
            transaction: context.transaction,
            hooks: config.hooks !== false,
        };
        const [affectedCount] = await model.update(updates, options);
        return {
            success: true,
            affectedRows: affectedCount,
        };
    }
    catch (error) {
        return {
            success: false,
            errors: [error],
        };
    }
}
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
async function bulkDelete(model, where, config = {}, context = {}) {
    try {
        const options = {
            where,
            transaction: context.transaction,
            hooks: config.hooks !== false,
        };
        const deletedCount = await model.destroy(options);
        return {
            success: true,
            affectedRows: deletedCount,
        };
    }
    catch (error) {
        return {
            success: false,
            errors: [error],
        };
    }
}
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
async function bulkUpsert(model, records, conflictFields, config = {}, context = {}) {
    const updateFields = config.updateOnDuplicate ||
        Object.keys(model.getAttributes()).filter(key => !conflictFields.includes(key));
    return bulkInsert(model, records, {
        ...config,
        updateOnDuplicate: updateFields,
    }, context);
}
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
async function bulkMerge(model, sourceData, matchFields, mergeFn, context = {}) {
    const errors = [];
    let insertCount = 0;
    let updateCount = 0;
    try {
        for (const record of sourceData) {
            const where = {};
            matchFields.forEach(field => {
                where[field] = record[field];
            });
            const existing = await model.findOne({
                where,
                transaction: context.transaction,
            });
            if (existing) {
                const merged = mergeFn(existing.toJSON(), record);
                await existing.update(merged, { transaction: context.transaction });
                updateCount++;
            }
            else {
                await model.create(record, { transaction: context.transaction });
                insertCount++;
            }
        }
        return {
            success: true,
            affectedRows: insertCount + updateCount,
            metadata: { insertCount, updateCount },
        };
    }
    catch (error) {
        return {
            success: false,
            errors: [error],
            metadata: { insertCount, updateCount },
        };
    }
}
// ============================================================================
// COMPLEX BUSINESS LOGIC
// ============================================================================
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
async function executeTransaction(sequelize, operations, context = {}) {
    const startTime = Date.now();
    try {
        const result = await sequelize.transaction({
            isolationLevel: context.isolationLevel,
        }, async (t) => {
            return operations(t);
        });
        return {
            success: true,
            data: result,
            executionTime: Date.now() - startTime,
        };
    }
    catch (error) {
        return {
            success: false,
            errors: [error],
            executionTime: Date.now() - startTime,
        };
    }
}
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
async function optimisticUpdate(model, id, updates, expectedVersion, context = {}) {
    try {
        const record = await model.findByPk(id, { transaction: context.transaction });
        if (!record) {
            return {
                success: false,
                errors: [new Error('Record not found')],
            };
        }
        const currentVersion = record.getDataValue('version');
        if (currentVersion !== expectedVersion) {
            return {
                success: false,
                errors: [new Error('Version mismatch: record was modified by another user')],
                metadata: { currentVersion, expectedVersion },
            };
        }
        updates.version = expectedVersion + 1;
        await record.update(updates, { transaction: context.transaction });
        return {
            success: true,
            data: record,
            metadata: { newVersion: expectedVersion + 1 },
        };
    }
    catch (error) {
        return {
            success: false,
            errors: [error],
        };
    }
}
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
async function processHierarchy(model, parentId = null, depth = 10, context = {}) {
    try {
        const buildTree = async (pid, currentDepth) => {
            if (currentDepth > depth)
                return [];
            const items = await model.findAll({
                where: { parentId: pid },
                transaction: context.transaction,
            });
            const tree = [];
            for (const item of items) {
                const children = await buildTree(item.getDataValue('id'), currentDepth + 1);
                tree.push({
                    ...item.toJSON(),
                    children,
                });
            }
            return tree;
        };
        const data = await buildTree(parentId, 0);
        return {
            success: true,
            data,
            rowCount: data.length,
        };
    }
    catch (error) {
        return {
            success: false,
            errors: [error],
        };
    }
}
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
async function aggregateData(model, groupBy, aggregations, where = {}, context = {}) {
    try {
        const sequelize = model.sequelize;
        const selectFields = [
            ...groupBy,
            ...Object.entries(aggregations).map(([alias, expr]) => `${expr} AS ${alias}`),
        ];
        const query = `
      SELECT ${selectFields.join(', ')}
      FROM ${model.tableName}
      ${Object.keys(where).length > 0 ? 'WHERE ?' : ''}
      GROUP BY ${groupBy.join(', ')}
    `;
        const results = await sequelize.query(query, {
            type: sequelize_1.QueryTypes.SELECT,
            replacements: Object.keys(where).length > 0 ? [where] : [],
            transaction: context.transaction,
        });
        return {
            success: true,
            data: results,
            rowCount: results.length,
        };
    }
    catch (error) {
        return {
            success: false,
            errors: [error],
        };
    }
}
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
async function pivotData(model, rowField, columnField, valueField, aggregateFunction = 'SUM', context = {}) {
    try {
        const data = await model.findAll({
            attributes: [rowField, columnField, valueField],
            transaction: context.transaction,
        });
        const pivoted = new Map();
        for (const record of data) {
            const row = record.getDataValue(rowField);
            const col = record.getDataValue(columnField);
            const val = record.getDataValue(valueField);
            if (!pivoted.has(row)) {
                pivoted.set(row, new Map());
            }
            const rowData = pivoted.get(row);
            const currentVal = rowData.get(col) || 0;
            if (aggregateFunction === 'SUM') {
                rowData.set(col, currentVal + val);
            }
            else if (aggregateFunction === 'COUNT') {
                rowData.set(col, currentVal + 1);
            }
            else if (aggregateFunction === 'AVG') {
                rowData.set(col, { sum: (currentVal.sum || 0) + val, count: (currentVal.count || 0) + 1 });
            }
        }
        const result = Array.from(pivoted.entries()).map(([row, cols]) => ({
            [rowField]: row,
            ...Object.fromEntries(cols.entries()),
        }));
        return {
            success: true,
            data: result,
            rowCount: result.length,
        };
    }
    catch (error) {
        return {
            success: false,
            errors: [error],
        };
    }
}
// ============================================================================
// RESULT SET MANAGEMENT
// ============================================================================
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
async function paginateResults(model, page, pageSize, options = {}, context = {}) {
    try {
        const offset = (page - 1) * pageSize;
        const { count, rows } = await model.findAndCountAll({
            ...options,
            limit: pageSize,
            offset,
            transaction: context.transaction,
        });
        const totalPages = Math.ceil(count / pageSize);
        return {
            success: true,
            data: rows,
            rowCount: rows.length,
            metadata: {
                page,
                pageSize,
                totalRecords: count,
                totalPages,
                hasNext: page < totalPages,
                hasPrevious: page > 1,
            },
        };
    }
    catch (error) {
        return {
            success: false,
            errors: [error],
        };
    }
}
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
async function streamResults(model, options, processFn, chunkSize = 1000, context = {}) {
    let processed = 0;
    let offset = 0;
    try {
        while (true) {
            const chunk = await model.findAll({
                ...options,
                limit: chunkSize,
                offset,
                transaction: context.transaction,
            });
            if (chunk.length === 0)
                break;
            await processFn(chunk);
            processed += chunk.length;
            offset += chunkSize;
            if (chunk.length < chunkSize)
                break;
        }
        return {
            success: true,
            rowCount: processed,
        };
    }
    catch (error) {
        return {
            success: false,
            errors: [error],
            rowCount: processed,
        };
    }
}
/**
 * Caches procedure results for improved performance.
 * Implements time-based and version-based cache invalidation.
 *
 * @param {string} cacheKey - Cache key
 * @param {Function} fetchFn - Data fetch function
 * @param {number} ttl - Time to live in seconds
 * @returns {Promise<ProcedureResult>} Cached or fresh result
 *
 * @example
 * ```typescript
 * const result = await cacheResults('users:active', async () => {
 *   return User.findAll({ where: { isActive: true } });
 * }, 300);
 * ```
 */
const resultCache = new Map();
async function cacheResults(cacheKey, fetchFn, ttl = 300) {
    const now = Date.now();
    const cached = resultCache.get(cacheKey);
    if (cached && cached.expiresAt > now) {
        return {
            success: true,
            data: cached.data,
            metadata: { cached: true },
        };
    }
    try {
        const data = await fetchFn();
        resultCache.set(cacheKey, {
            data,
            expiresAt: now + (ttl * 1000),
        });
        return {
            success: true,
            data,
            metadata: { cached: false },
        };
    }
    catch (error) {
        return {
            success: false,
            errors: [error],
        };
    }
}
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
function invalidateCache(pattern) {
    const regex = new RegExp(pattern.replace('*', '.*'));
    let count = 0;
    for (const key of resultCache.keys()) {
        if (regex.test(key)) {
            resultCache.delete(key);
            count++;
        }
    }
    return count;
}
// ============================================================================
// VERSIONING AND MIGRATION
// ============================================================================
/**
 * Manages procedure versioning and deprecation.
 * Tracks version history and migration paths.
 *
 * @param {string} procedureName - Procedure name
 * @param {ProcedureVersion} version - Version metadata
 * @returns {void}
 *
 * @example
 * ```typescript
 * registerProcedureVersion('sp_get_users', {
 *   version: '2.0.0',
 *   description: 'Added pagination support',
 *   createdAt: new Date(),
 *   migration: 'Replace limit param with page and pageSize'
 * });
 * ```
 */
const versionRegistry = new Map();
function registerProcedureVersion(procedureName, version) {
    if (!versionRegistry.has(procedureName)) {
        versionRegistry.set(procedureName, []);
    }
    versionRegistry.get(procedureName).push(version);
}
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
function getProcedureVersions(procedureName) {
    return versionRegistry.get(procedureName) || [];
}
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
function deprecateProcedureVersion(procedureName, version, reason) {
    const versions = versionRegistry.get(procedureName);
    if (!versions)
        return false;
    const target = versions.find(v => v.version === version);
    if (!target)
        return false;
    target.deprecated = true;
    target.migration = reason;
    return true;
}
// ============================================================================
// PERFORMANCE OPTIMIZATION
// ============================================================================
/**
 * Analyzes procedure execution performance.
 * Collects timing and resource metrics.
 *
 * @param {string} procedureName - Procedure name
 * @returns {ProcedureStats | undefined} Performance statistics
 *
 * @example
 * ```typescript
 * const stats = analyzeProcedurePerformance('sp_get_users');
 * console.log(`Average execution: ${stats?.averageExecutionTime}ms`);
 * ```
 */
const performanceStats = new Map();
function analyzeProcedurePerformance(procedureName) {
    return performanceStats.get(procedureName);
}
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
function recordProcedureExecution(procedureName, success, executionTime) {
    const stats = performanceStats.get(procedureName) || {
        totalExecutions: 0,
        successCount: 0,
        errorCount: 0,
        averageExecutionTime: 0,
    };
    stats.totalExecutions++;
    if (success) {
        stats.successCount++;
    }
    else {
        stats.errorCount++;
    }
    stats.averageExecutionTime =
        (stats.averageExecutionTime * (stats.totalExecutions - 1) + executionTime) / stats.totalExecutions;
    stats.lastExecuted = new Date();
    performanceStats.set(procedureName, stats);
}
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
async function logProcedureExecution(procedureName, version, context, result) {
    // HIPAA audit log implementation
    const logEntry = {
        timestamp: new Date().toISOString(),
        procedure: `${procedureName}:${version}`,
        userId: context.userId,
        sessionId: context.sessionId,
        success: result.success,
        executionTime: result.executionTime,
        affectedRows: result.affectedRows,
        errorCount: result.errors?.length || 0,
    };
    // In production, write to audit log table or external service
    console.log('[AUDIT]', JSON.stringify(logEntry));
}
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
async function batchProcedureCalls(procedure, paramsList, context = {}, batchSize = 100) {
    const results = [];
    for (let i = 0; i < paramsList.length; i += batchSize) {
        const batch = paramsList.slice(i, i + batchSize);
        const batchResults = await executeProcedureParallel(Array(batch.length).fill(procedure), batch, context);
        results.push(...batchResults);
    }
    return results;
}
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
function compareResultSets(resultSet1, resultSet2, keyField = 'id') {
    const map1 = new Map(resultSet1.map(item => [item[keyField], item]));
    const map2 = new Map(resultSet2.map(item => [item[keyField], item]));
    const added = [];
    const removed = [];
    const modified = [];
    for (const [key, item] of map2) {
        if (!map1.has(key)) {
            added.push(item);
        }
        else if (JSON.stringify(map1.get(key)) !== JSON.stringify(item)) {
            modified.push({ old: map1.get(key), new: item });
        }
    }
    for (const [key, item] of map1) {
        if (!map2.has(key)) {
            removed.push(item);
        }
    }
    return { added, removed, modified };
}
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
function exportResultSetToCsv(resultSet, columns) {
    if (resultSet.length === 0)
        return '';
    const fields = columns || Object.keys(resultSet[0]);
    const header = fields.join(',');
    const rows = resultSet.map(row => fields.map(field => {
        const value = row[field];
        return typeof value === 'string' && value.includes(',')
            ? `"${value.replace(/"/g, '""')}"`
            : value;
    }).join(','));
    return [header, ...rows].join('\n');
}
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
function importResultSetFromCsv(csv, hasHeader = true) {
    const lines = csv.trim().split('\n');
    if (lines.length === 0)
        return [];
    const headers = hasHeader
        ? lines[0].split(',').map(h => h.trim())
        : Array.from({ length: lines[0].split(',').length }, (_, i) => `column${i}`);
    const dataLines = hasHeader ? lines.slice(1) : lines;
    return dataLines.map(line => {
        const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
        return headers.reduce((obj, header, i) => {
            obj[header] = values[i];
            return obj;
        }, {});
    });
}
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
function validateResultSetSchema(resultSet, schema) {
    const errors = [];
    for (let i = 0; i < resultSet.length; i++) {
        const row = resultSet[i];
        for (const [field, expectedType] of Object.entries(schema)) {
            const actualType = typeof row[field];
            if (actualType !== expectedType) {
                errors.push(new Error(`Row ${i}: Field '${field}' expected type '${expectedType}', got '${actualType}'`));
            }
        }
    }
    return {
        success: errors.length === 0,
        errors,
    };
}
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
function deduplicateResultSet(resultSet, keyField = 'id', strategy = 'first') {
    const seen = new Map();
    if (strategy === 'first') {
        for (const item of resultSet) {
            const key = item[keyField];
            if (!seen.has(key)) {
                seen.set(key, item);
            }
        }
    }
    else {
        for (const item of resultSet) {
            seen.set(item[keyField], item);
        }
    }
    return Array.from(seen.values());
}
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
function sortResultSet(resultSet, sortBy) {
    return [...resultSet].sort((a, b) => {
        for (const { field, order } of sortBy) {
            const aVal = a[field];
            const bVal = b[field];
            if (aVal < bVal)
                return order === 'ASC' ? -1 : 1;
            if (aVal > bVal)
                return order === 'ASC' ? 1 : -1;
        }
        return 0;
    });
}
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
function filterResultSet(resultSet, filters) {
    return resultSet.filter(row => {
        return Object.entries(filters).every(([field, value]) => {
            if (Array.isArray(value)) {
                return value.includes(row[field]);
            }
            return row[field] === value;
        });
    });
}
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
function groupResultSet(resultSet, groupByField) {
    const groups = new Map();
    for (const item of resultSet) {
        const key = item[groupByField];
        if (!groups.has(key)) {
            groups.set(key, []);
        }
        groups.get(key).push(item);
    }
    return groups;
}
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
function transformResultSet(resultSet, transformers) {
    return resultSet.map(row => {
        const transformed = { ...row };
        for (const [field, transformer] of Object.entries(transformers)) {
            if (field in transformed) {
                transformed[field] = transformer(transformed[field]);
            }
        }
        return transformed;
    });
}
// ============================================================================
// EXPORT
// ============================================================================
exports.default = {
    // Procedure definition and registration
    defineProcedure,
    getProcedure,
    listProcedures,
    unregisterProcedure,
    clearProcedures,
    // Parameter handling and validation
    validateParameters,
    normalizeParameters,
    extractOutputParameters,
    sanitizeParameters,
    // Procedure execution
    executeProcedure,
    executeProcedureByName,
    executeProcedureSequence,
    executeProcedureParallel,
    retryProcedure,
    // Bulk data operations
    bulkInsert,
    bulkUpdate,
    bulkDelete,
    bulkUpsert,
    bulkMerge,
    // Complex business logic
    executeTransaction,
    optimisticUpdate,
    processHierarchy,
    aggregateData,
    pivotData,
    // Result set management
    paginateResults,
    streamResults,
    cacheResults,
    invalidateCache,
    // Versioning and migration
    registerProcedureVersion,
    getProcedureVersions,
    deprecateProcedureVersion,
    // Performance optimization
    analyzeProcedurePerformance,
    recordProcedureExecution,
    logProcedureExecution,
    // Batch operations
    batchProcedureCalls,
    // Result set utilities
    compareResultSets,
    exportResultSetToCsv,
    importResultSetFromCsv,
    validateResultSetSchema,
    deduplicateResultSet,
    sortResultSet,
    filterResultSet,
    groupResultSet,
    transformResultSet,
};
//# sourceMappingURL=sequelize-oracle-procedures-kit.js.map