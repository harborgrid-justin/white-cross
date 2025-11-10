/**
 * LOC: WF-VAR-MGMT-001
 * File: /reuse/server/workflow/workflow-variable-management.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM)
 *   - @nestjs/common (framework)
 *   - zod (validation)
 *   - crypto (encryption)
 *   - ../../error-handling-kit.ts
 *   - ../../auditing-utils.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend workflow services
 *   - Workflow process engine
 *   - Variable expression evaluators
 *   - Workflow context managers
 *   - Process instance controllers
 */
/**
 * File: /reuse/server/workflow/workflow-variable-management.ts
 * Locator: WC-WF-VAR-MGMT-001
 * Purpose: Comprehensive Workflow Variable Management - Enterprise-grade process variable handling
 *
 * Upstream: Sequelize, NestJS, Zod, Crypto, Error handling utilities, Auditing utilities
 * Downstream: ../backend/*, Workflow engines, variable evaluators, context managers, process controllers
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, Zod 3.x
 * Exports: 45 utility functions for variable creation, scoping, type management, persistence, history tracking,
 *          encryption, transient variables, expressions, serialization, access control, lifecycle management
 *
 * LLM Context: Enterprise-grade workflow variable management system competing with Camunda and Oracle BPM.
 * Provides comprehensive variable creation and initialization, multi-level scoping (global/process/local),
 * type-safe variable management with runtime validation, encrypted variable storage for sensitive data,
 * complete variable history and audit trails, transient variable handling for temporary data,
 * expression evaluation for dynamic variables, JSON serialization/deserialization, role-based access control,
 * variable lifecycle management with automatic cleanup, variable versioning, bulk operations,
 * variable migration across process versions, HIPAA/SOC2/GDPR-compliant variable handling,
 * and real-time variable change notifications.
 */
import { Model, Sequelize, Transaction } from 'sequelize';
/**
 * Variable scope levels defining visibility and lifetime
 *
 * @enum {string}
 * @property {string} GLOBAL - Shared across all process instances and persists indefinitely
 * @property {string} PROCESS - Scoped to process instance, persists for process lifetime
 * @property {string} LOCAL - Scoped to current activity, cleared after activity completion
 * @property {string} TRANSIENT - Temporary variable, never persisted to database
 */
export declare enum VariableScope {
    GLOBAL = "global",
    PROCESS = "process",
    LOCAL = "local",
    TRANSIENT = "transient"
}
/**
 * Supported variable data types with runtime validation
 *
 * @enum {string}
 */
export declare enum VariableType {
    STRING = "string",
    NUMBER = "number",
    BOOLEAN = "boolean",
    DATE = "date",
    JSON = "json",
    BINARY = "binary",
    OBJECT = "object",
    ARRAY = "array",
    NULL = "null",
    ENCRYPTED = "encrypted"
}
/**
 * Encryption security levels for sensitive variables
 *
 * @enum {string}
 * @property {string} NONE - No encryption, plain text storage
 * @property {string} BASIC - AES-256-CBC encryption with single key
 * @property {string} ADVANCED - AES-256-GCM with key rotation support
 * @property {string} ENTERPRISE - Hardware security module (HSM) backed encryption
 */
export declare enum EncryptionLevel {
    NONE = "none",
    BASIC = "basic",
    ADVANCED = "advanced",
    ENTERPRISE = "enterprise"
}
/**
 * Access control levels for variable read/write permissions
 *
 * @enum {string}
 */
export declare enum AccessLevel {
    PUBLIC = "public",
    PROTECTED = "protected",
    PRIVATE = "private",
    RESTRICTED = "restricted",
    ADMIN_ONLY = "admin_only"
}
/**
 * Variable change operation types for audit trails
 *
 * @enum {string}
 */
export declare enum VariableOperation {
    CREATE = "create",
    UPDATE = "update",
    DELETE = "delete",
    READ = "read",
    ENCRYPT = "encrypt",
    DECRYPT = "decrypt",
    MIGRATE = "migrate",
    SERIALIZE = "serialize",
    DESERIALIZE = "deserialize"
}
/**
 * Variable lifecycle states
 *
 * @enum {string}
 */
export declare enum VariableLifecycleState {
    ACTIVE = "active",
    DEPRECATED = "deprecated",
    ARCHIVED = "archived",
    DELETED = "deleted",
    LOCKED = "locked",
    MIGRATING = "migrating"
}
/**
 * Process variable interface representing a single variable instance
 *
 * @interface ProcessVariable
 * @property {string} id - Unique variable identifier
 * @property {string} name - Variable name (unique within scope)
 * @property {VariableType} type - Data type of the variable
 * @property {any} value - Current variable value
 * @property {VariableScope} scope - Visibility and lifetime scope
 * @property {string} [processInstanceId] - Process instance ID (for PROCESS scope)
 * @property {string} [activityId] - Activity ID (for LOCAL scope)
 * @property {EncryptionLevel} encryptionLevel - Security encryption level
 * @property {AccessLevel} accessLevel - Access control level
 * @property {VariableLifecycleState} lifecycleState - Current lifecycle state
 * @property {boolean} isTransient - Whether variable should be persisted
 * @property {Record<string, any>} metadata - Additional variable metadata
 * @property {number} version - Variable version for optimistic locking
 * @property {string} [createdBy] - User who created the variable
 * @property {string} [updatedBy] - User who last updated the variable
 * @property {Date} createdAt - Variable creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 * @property {Date} [expiresAt] - Optional expiration timestamp
 */
export interface ProcessVariable {
    id: string;
    name: string;
    type: VariableType;
    value: any;
    scope: VariableScope;
    processInstanceId?: string;
    activityId?: string;
    encryptionLevel: EncryptionLevel;
    accessLevel: AccessLevel;
    lifecycleState: VariableLifecycleState;
    isTransient: boolean;
    metadata: Record<string, any>;
    version: number;
    createdBy?: string;
    updatedBy?: string;
    createdAt: Date;
    updatedAt: Date;
    expiresAt?: Date;
}
/**
 * Variable history entry for audit trails and rollback
 *
 * @interface VariableHistory
 * @property {string} id - History entry ID
 * @property {string} variableId - Reference to the variable
 * @property {string} variableName - Variable name at time of change
 * @property {VariableOperation} operation - Type of operation performed
 * @property {any} oldValue - Previous value before change
 * @property {any} newValue - New value after change
 * @property {string} [changedBy] - User who made the change
 * @property {Date} changedAt - When the change occurred
 * @property {Record<string, any>} context - Additional context about the change
 */
export interface VariableHistory {
    id: string;
    variableId: string;
    variableName: string;
    operation: VariableOperation;
    oldValue: any;
    newValue: any;
    changedBy?: string;
    changedAt: Date;
    context: Record<string, any>;
}
/**
 * Variable expression for dynamic value evaluation
 *
 * @interface VariableExpression
 * @property {string} id - Expression ID
 * @property {string} variableId - Variable this expression is bound to
 * @property {string} expression - Expression string (e.g., "${var1} + ${var2}")
 * @property {string} language - Expression language (jexl, javascript, spel)
 * @property {string[]} dependencies - Variables this expression depends on
 * @property {boolean} autoEvaluate - Whether to auto-evaluate on dependency change
 * @property {Date} lastEvaluatedAt - Last evaluation timestamp
 */
export interface VariableExpression {
    id: string;
    variableId: string;
    expression: string;
    language: string;
    dependencies: string[];
    autoEvaluate: boolean;
    lastEvaluatedAt?: Date;
}
/**
 * Variable access control entry
 *
 * @interface VariableAccessControl
 * @property {string} variableId - Variable being controlled
 * @property {string} principalId - User or role ID
 * @property {string} principalType - 'user' or 'role'
 * @property {boolean} canRead - Read permission
 * @property {boolean} canWrite - Write permission
 * @property {boolean} canDelete - Delete permission
 * @property {Date} [expiresAt] - Optional permission expiration
 */
export interface VariableAccessControl {
    variableId: string;
    principalId: string;
    principalType: 'user' | 'role';
    canRead: boolean;
    canWrite: boolean;
    canDelete: boolean;
    expiresAt?: Date;
}
/**
 * Zod schema for variable creation validation
 */
export declare const CreateVariableSchema: any;
/**
 * Zod schema for variable update validation
 */
export declare const UpdateVariableSchema: any;
/**
 * Zod schema for variable expression validation
 */
export declare const VariableExpressionSchema: any;
/**
 * Sequelize model for ProcessVariable table
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} ProcessVariable model
 */
export declare function createProcessVariableModel(sequelize: Sequelize): {
    new (): {};
};
/**
 * Sequelize model for VariableHistory table
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} VariableHistory model
 */
export declare function createVariableHistoryModel(sequelize: Sequelize): {
    new (): {};
};
/**
 * Sequelize model for VariableExpression table
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} VariableExpression model
 */
export declare function createVariableExpressionModel(sequelize: Sequelize): {
    new (): {};
};
/**
 * Sequelize model for VariableAccessControl table
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} VariableAccessControl model
 */
export declare function createVariableAccessControlModel(sequelize: Sequelize): {
    new (): {};
};
/**
 * Creates a new process variable with validation and optional encryption
 *
 * @async
 * @template T - Type of the variable value
 * @param {Object} params - Variable creation parameters
 * @param {typeof Model} params.model - Sequelize ProcessVariable model
 * @param {string} params.name - Variable name (must match /^[a-zA-Z_][a-zA-Z0-9_]*$/)
 * @param {T} params.value - Initial variable value
 * @param {VariableType} params.type - Variable data type
 * @param {VariableScope} params.scope - Variable scope (global/process/local/transient)
 * @param {string} [params.processInstanceId] - Process instance ID (required for PROCESS scope)
 * @param {string} [params.activityId] - Activity ID (required for LOCAL scope)
 * @param {EncryptionLevel} [params.encryptionLevel=EncryptionLevel.NONE] - Encryption level
 * @param {AccessLevel} [params.accessLevel=AccessLevel.PUBLIC] - Access control level
 * @param {boolean} [params.isTransient=false] - Whether to persist variable
 * @param {Record<string, any>} [params.metadata={}] - Additional metadata
 * @param {Date} [params.expiresAt] - Optional expiration timestamp
 * @param {string} [params.userId] - User creating the variable (for audit)
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<ProcessVariable>} Created variable instance
 * @throws {BadRequestException} If validation fails or required scope parameters missing
 * @throws {ConflictException} If variable with same name already exists in scope
 *
 * @example
 * ```typescript
 * const variable = await createProcessVariable({
 *   model: ProcessVariableModel,
 *   name: 'customerEmail',
 *   value: 'user@example.com',
 *   type: VariableType.STRING,
 *   scope: VariableScope.PROCESS,
 *   processInstanceId: 'proc-123',
 *   encryptionLevel: EncryptionLevel.ADVANCED,
 *   userId: 'admin@company.com',
 * });
 * ```
 *
 * @remarks
 * - Variables are automatically versioned starting at version 1
 * - PROCESS scope requires processInstanceId parameter
 * - LOCAL scope requires both processInstanceId and activityId
 * - Encrypted variables are automatically encrypted before storage
 * - Transient variables are created but never persisted to database
 *
 * @see {@link getVariableByName} for retrieving variables
 * @see {@link updateVariableValue} for updating variable values
 */
export declare function createProcessVariable<T = any>(params: {
    model: typeof Model;
    name: string;
    value: T;
    type: VariableType;
    scope: VariableScope;
    processInstanceId?: string;
    activityId?: string;
    encryptionLevel?: EncryptionLevel;
    accessLevel?: AccessLevel;
    isTransient?: boolean;
    metadata?: Record<string, any>;
    expiresAt?: Date;
    userId?: string;
    transaction?: Transaction;
}): Promise<ProcessVariable>;
/**
 * Initializes a batch of variables for a process instance
 *
 * @async
 * @param {Object} params - Batch initialization parameters
 * @param {typeof Model} params.model - Sequelize ProcessVariable model
 * @param {string} params.processInstanceId - Process instance ID
 * @param {Array<{name: string, value: any, type: VariableType}>} params.variables - Variables to initialize
 * @param {VariableScope} [params.defaultScope=VariableScope.PROCESS] - Default variable scope
 * @param {string} [params.userId] - User initializing variables
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<ProcessVariable[]>} Array of created variables
 * @throws {BadRequestException} If any variable fails validation
 *
 * @example
 * ```typescript
 * const variables = await initializeProcessVariables({
 *   model: ProcessVariableModel,
 *   processInstanceId: 'proc-123',
 *   variables: [
 *     { name: 'amount', value: 1000, type: VariableType.NUMBER },
 *     { name: 'currency', value: 'USD', type: VariableType.STRING },
 *     { name: 'approved', value: false, type: VariableType.BOOLEAN },
 *   ],
 *   userId: 'system',
 * });
 * ```
 *
 * @remarks
 * - Creates all variables in a single transaction for atomicity
 * - Skips variables that already exist (doesn't throw error)
 * - All variables default to PROCESS scope unless specified
 */
export declare function initializeProcessVariables(params: {
    model: typeof Model;
    processInstanceId: string;
    variables: Array<{
        name: string;
        value: any;
        type: VariableType;
        scope?: VariableScope;
    }>;
    defaultScope?: VariableScope;
    userId?: string;
    transaction?: Transaction;
}): Promise<ProcessVariable[]>;
/**
 * Creates a global variable accessible across all process instances
 *
 * @async
 * @template T
 * @param {Object} params - Global variable parameters
 * @param {typeof Model} params.model - Sequelize ProcessVariable model
 * @param {string} params.name - Variable name
 * @param {T} params.value - Variable value
 * @param {VariableType} params.type - Variable type
 * @param {AccessLevel} [params.accessLevel=AccessLevel.PUBLIC] - Access control
 * @param {Record<string, any>} [params.metadata] - Additional metadata
 * @param {string} [params.userId] - Creating user ID
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<ProcessVariable>} Created global variable
 * @throws {ConflictException} If global variable with same name exists
 *
 * @example
 * ```typescript
 * const globalConfig = await createGlobalVariable({
 *   model: ProcessVariableModel,
 *   name: 'maxRetryAttempts',
 *   value: 3,
 *   type: VariableType.NUMBER,
 *   accessLevel: AccessLevel.PROTECTED,
 *   userId: 'admin',
 * });
 * ```
 *
 * @remarks
 * - Global variables persist indefinitely until explicitly deleted
 * - Accessible from any process instance or activity
 * - Recommended for configuration values and constants
 */
export declare function createGlobalVariable<T = any>(params: {
    model: typeof Model;
    name: string;
    value: T;
    type: VariableType;
    accessLevel?: AccessLevel;
    metadata?: Record<string, any>;
    userId?: string;
    transaction?: Transaction;
}): Promise<ProcessVariable>;
/**
 * Creates a transient variable that exists only in memory
 *
 * @async
 * @template T
 * @param {Object} params - Transient variable parameters
 * @param {typeof Model} params.model - Sequelize ProcessVariable model
 * @param {string} params.name - Variable name
 * @param {T} params.value - Variable value
 * @param {VariableType} params.type - Variable type
 * @param {string} [params.processInstanceId] - Process instance ID
 * @param {string} [params.activityId] - Activity ID
 * @param {Date} [params.expiresAt] - Expiration timestamp
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<ProcessVariable>} Created transient variable
 *
 * @example
 * ```typescript
 * const tempData = await createTransientVariable({
 *   model: ProcessVariableModel,
 *   name: 'sessionToken',
 *   value: 'abc123xyz',
 *   type: VariableType.STRING,
 *   processInstanceId: 'proc-123',
 *   expiresAt: new Date(Date.now() + 3600000), // 1 hour
 * });
 * ```
 *
 * @remarks
 * - Transient variables are never persisted to database
 * - Useful for temporary computation results and session data
 * - Automatically cleared when process instance completes
 * - Lower performance overhead than persisted variables
 */
export declare function createTransientVariable<T = any>(params: {
    model: typeof Model;
    name: string;
    value: T;
    type: VariableType;
    processInstanceId?: string;
    activityId?: string;
    expiresAt?: Date;
    transaction?: Transaction;
}): Promise<ProcessVariable>;
/**
 * Creates a local (activity-scoped) variable
 *
 * @async
 * @template T
 * @param {Object} params - Local variable parameters
 * @param {typeof Model} params.model - Sequelize ProcessVariable model
 * @param {string} params.name - Variable name
 * @param {T} params.value - Variable value
 * @param {VariableType} params.type - Variable type
 * @param {string} params.processInstanceId - Process instance ID (required)
 * @param {string} params.activityId - Activity ID (required)
 * @param {string} [params.userId] - Creating user ID
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<ProcessVariable>} Created local variable
 * @throws {BadRequestException} If processInstanceId or activityId missing
 *
 * @example
 * ```typescript
 * const localVar = await createLocalVariable({
 *   model: ProcessVariableModel,
 *   name: 'approverComments',
 *   value: 'Looks good to me',
 *   type: VariableType.STRING,
 *   processInstanceId: 'proc-123',
 *   activityId: 'task-approval-456',
 *   userId: 'approver@company.com',
 * });
 * ```
 *
 * @remarks
 * - Local variables are automatically cleaned up after activity completes
 * - Not accessible from other activities in the same process
 * - Ideal for user task input data and activity-specific state
 */
export declare function createLocalVariable<T = any>(params: {
    model: typeof Model;
    name: string;
    value: T;
    type: VariableType;
    processInstanceId: string;
    activityId: string;
    userId?: string;
    transaction?: Transaction;
}): Promise<ProcessVariable>;
/**
 * Retrieves a variable by name with scope resolution
 *
 * @async
 * @param {Object} params - Query parameters
 * @param {typeof Model} params.model - Sequelize ProcessVariable model
 * @param {string} params.name - Variable name to find
 * @param {VariableScope} [params.scope] - Specific scope to search (optional)
 * @param {string} [params.processInstanceId] - Process instance ID for scoped search
 * @param {string} [params.activityId] - Activity ID for local scope search
 * @param {boolean} [params.includeTransient=false] - Include transient variables
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<ProcessVariable | null>} Found variable or null
 *
 * @example
 * ```typescript
 * const variable = await getVariableByName({
 *   model: ProcessVariableModel,
 *   name: 'customerEmail',
 *   processInstanceId: 'proc-123',
 * });
 * ```
 *
 * @remarks
 * - Searches in order: LOCAL -> PROCESS -> GLOBAL if no scope specified
 * - Returns first match found in scope hierarchy
 * - Respects access control levels
 */
export declare function getVariableByName(params: {
    model: typeof Model;
    name: string;
    scope?: VariableScope;
    processInstanceId?: string;
    activityId?: string;
    includeTransient?: boolean;
    transaction?: Transaction;
}): Promise<ProcessVariable | null>;
/**
 * Retrieves all variables for a process instance
 *
 * @async
 * @param {Object} params - Query parameters
 * @param {typeof Model} params.model - Sequelize ProcessVariable model
 * @param {string} params.processInstanceId - Process instance ID
 * @param {VariableScope[]} [params.scopes] - Filter by specific scopes
 * @param {boolean} [params.includeTransient=false] - Include transient variables
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<ProcessVariable[]>} Array of variables
 *
 * @example
 * ```typescript
 * const processVars = await getProcessInstanceVariables({
 *   model: ProcessVariableModel,
 *   processInstanceId: 'proc-123',
 *   scopes: [VariableScope.PROCESS, VariableScope.GLOBAL],
 * });
 * ```
 */
export declare function getProcessInstanceVariables(params: {
    model: typeof Model;
    processInstanceId: string;
    scopes?: VariableScope[];
    includeTransient?: boolean;
    transaction?: Transaction;
}): Promise<ProcessVariable[]>;
/**
 * Retrieves all global variables
 *
 * @async
 * @param {Object} params - Query parameters
 * @param {typeof Model} params.model - Sequelize ProcessVariable model
 * @param {AccessLevel[]} [params.accessLevels] - Filter by access levels
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<ProcessVariable[]>} Array of global variables
 *
 * @example
 * ```typescript
 * const globals = await getAllGlobalVariables({
 *   model: ProcessVariableModel,
 *   accessLevels: [AccessLevel.PUBLIC, AccessLevel.PROTECTED],
 * });
 * ```
 */
export declare function getAllGlobalVariables(params: {
    model: typeof Model;
    accessLevels?: AccessLevel[];
    transaction?: Transaction;
}): Promise<ProcessVariable[]>;
/**
 * Updates a variable's value with optimistic locking and history tracking
 *
 * @async
 * @template T
 * @param {Object} params - Update parameters
 * @param {typeof Model} params.model - Sequelize ProcessVariable model
 * @param {typeof Model} params.historyModel - Variable history model
 * @param {string} params.variableId - Variable ID to update
 * @param {T} params.newValue - New value to set
 * @param {number} [params.expectedVersion] - Expected version for optimistic locking
 * @param {string} [params.userId] - User making the update
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<ProcessVariable>} Updated variable
 * @throws {NotFoundException} If variable not found
 * @throws {ConflictException} If version mismatch (optimistic locking failure)
 *
 * @example
 * ```typescript
 * const updated = await updateVariableValue({
 *   model: ProcessVariableModel,
 *   historyModel: VariableHistoryModel,
 *   variableId: 'var-123',
 *   newValue: 'updated@example.com',
 *   expectedVersion: 1,
 *   userId: 'admin',
 * });
 * ```
 *
 * @remarks
 * - Automatically creates history entry for audit trail
 * - Increments version number on each update
 * - Optimistic locking prevents lost updates
 * - Respects access control permissions
 */
export declare function updateVariableValue<T = any>(params: {
    model: typeof Model;
    historyModel: typeof Model;
    variableId: string;
    newValue: T;
    expectedVersion?: number;
    userId?: string;
    transaction?: Transaction;
}): Promise<ProcessVariable>;
/**
 * Updates multiple variables in a single transaction
 *
 * @async
 * @param {Object} params - Bulk update parameters
 * @param {typeof Model} params.model - Sequelize ProcessVariable model
 * @param {typeof Model} params.historyModel - Variable history model
 * @param {Array<{variableId: string, newValue: any}>} params.updates - Array of updates
 * @param {string} [params.userId] - User making updates
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<ProcessVariable[]>} Array of updated variables
 *
 * @example
 * ```typescript
 * const updated = await bulkUpdateVariables({
 *   model: ProcessVariableModel,
 *   historyModel: VariableHistoryModel,
 *   updates: [
 *     { variableId: 'var-1', newValue: 100 },
 *     { variableId: 'var-2', newValue: 200 },
 *   ],
 *   userId: 'admin',
 * });
 * ```
 *
 * @remarks
 * - All updates are atomic (all succeed or all fail)
 * - Creates individual history entries for each update
 * - Significantly faster than individual updates
 */
export declare function bulkUpdateVariables(params: {
    model: typeof Model;
    historyModel: typeof Model;
    updates: Array<{
        variableId: string;
        newValue: any;
    }>;
    userId?: string;
    transaction?: Transaction;
}): Promise<ProcessVariable[]>;
/**
 * Updates variable metadata without changing value
 *
 * @async
 * @param {Object} params - Metadata update parameters
 * @param {typeof Model} params.model - Sequelize ProcessVariable model
 * @param {string} params.variableId - Variable ID
 * @param {Record<string, any>} params.metadata - Metadata to merge
 * @param {boolean} [params.merge=true] - Merge with existing or replace
 * @param {string} [params.userId] - Updating user
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<ProcessVariable>} Updated variable
 *
 * @example
 * ```typescript
 * const updated = await updateVariableMetadata({
 *   model: ProcessVariableModel,
 *   variableId: 'var-123',
 *   metadata: { tags: ['customer', 'email'], category: 'contact' },
 *   merge: true,
 * });
 * ```
 */
export declare function updateVariableMetadata(params: {
    model: typeof Model;
    variableId: string;
    metadata: Record<string, any>;
    merge?: boolean;
    userId?: string;
    transaction?: Transaction;
}): Promise<ProcessVariable>;
/**
 * Encrypts a variable's value using AES-256-GCM
 *
 * @async
 * @param {Object} params - Encryption parameters
 * @param {typeof Model} params.model - Sequelize ProcessVariable model
 * @param {string} params.variableId - Variable ID to encrypt
 * @param {string} params.encryptionKey - Encryption key (32 bytes for AES-256)
 * @param {EncryptionLevel} [params.encryptionLevel=EncryptionLevel.ADVANCED] - Encryption level
 * @param {string} [params.userId] - User performing encryption
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<ProcessVariable>} Encrypted variable
 * @throws {NotFoundException} If variable not found
 * @throws {BadRequestException} If encryption key invalid
 *
 * @example
 * ```typescript
 * const encrypted = await encryptVariable({
 *   model: ProcessVariableModel,
 *   variableId: 'var-ssn-123',
 *   encryptionKey: process.env.ENCRYPTION_KEY,
 *   encryptionLevel: EncryptionLevel.ADVANCED,
 *   userId: 'admin',
 * });
 * ```
 *
 * @remarks
 * - Uses AES-256-GCM for authenticated encryption
 * - Generates random IV for each encryption
 * - Stores encrypted data as base64
 * - Original value is irrecoverable without key
 * - Type is automatically changed to ENCRYPTED
 */
export declare function encryptVariable(params: {
    model: typeof Model;
    variableId: string;
    encryptionKey: string;
    encryptionLevel?: EncryptionLevel;
    userId?: string;
    transaction?: Transaction;
}): Promise<ProcessVariable>;
/**
 * Decrypts an encrypted variable
 *
 * @async
 * @param {Object} params - Decryption parameters
 * @param {typeof Model} params.model - Sequelize ProcessVariable model
 * @param {string} params.variableId - Variable ID to decrypt
 * @param {string} params.encryptionKey - Decryption key (same as encryption key)
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<any>} Decrypted value
 * @throws {NotFoundException} If variable not found
 * @throws {BadRequestException} If variable not encrypted or decryption fails
 *
 * @example
 * ```typescript
 * const decryptedValue = await decryptVariable({
 *   model: ProcessVariableModel,
 *   variableId: 'var-ssn-123',
 *   encryptionKey: process.env.ENCRYPTION_KEY,
 * });
 * ```
 *
 * @remarks
 * - Verifies authentication tag for data integrity
 * - Throws error if data has been tampered with
 * - Returns original plaintext value
 * - Does not modify the variable in database
 */
export declare function decryptVariable(params: {
    model: typeof Model;
    variableId: string;
    encryptionKey: string;
    transaction?: Transaction;
}): Promise<any>;
/**
 * Rotates encryption key for a variable
 *
 * @async
 * @param {Object} params - Key rotation parameters
 * @param {typeof Model} params.model - Sequelize ProcessVariable model
 * @param {string} params.variableId - Variable ID
 * @param {string} params.oldKey - Current encryption key
 * @param {string} params.newKey - New encryption key
 * @param {string} [params.userId] - User performing rotation
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<ProcessVariable>} Re-encrypted variable
 *
 * @example
 * ```typescript
 * const rotated = await rotateVariableEncryptionKey({
 *   model: ProcessVariableModel,
 *   variableId: 'var-ssn-123',
 *   oldKey: process.env.OLD_KEY,
 *   newKey: process.env.NEW_KEY,
 *   userId: 'admin',
 * });
 * ```
 *
 * @remarks
 * - Decrypts with old key and re-encrypts with new key
 * - Atomic operation (transaction-safe)
 * - Updates encryption metadata
 */
export declare function rotateVariableEncryptionKey(params: {
    model: typeof Model;
    variableId: string;
    oldKey: string;
    newKey: string;
    userId?: string;
    transaction?: Transaction;
}): Promise<ProcessVariable>;
/**
 * Retrieves complete history for a variable
 *
 * @async
 * @param {Object} params - History query parameters
 * @param {typeof Model} params.historyModel - Variable history model
 * @param {string} params.variableId - Variable ID
 * @param {number} [params.limit=100] - Maximum number of history entries
 * @param {number} [params.offset=0] - Offset for pagination
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<VariableHistory[]>} Array of history entries
 *
 * @example
 * ```typescript
 * const history = await getVariableHistory({
 *   historyModel: VariableHistoryModel,
 *   variableId: 'var-123',
 *   limit: 50,
 * });
 * ```
 */
export declare function getVariableHistory(params: {
    historyModel: typeof Model;
    variableId: string;
    limit?: number;
    offset?: number;
    transaction?: Transaction;
}): Promise<VariableHistory[]>;
/**
 * Retrieves variable value at a specific point in time
 *
 * @async
 * @param {Object} params - Point-in-time query parameters
 * @param {typeof Model} params.historyModel - Variable history model
 * @param {string} params.variableId - Variable ID
 * @param {Date} params.timestamp - Target timestamp
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<any>} Variable value at specified time
 *
 * @example
 * ```typescript
 * const valueYesterday = await getVariableValueAtTime({
 *   historyModel: VariableHistoryModel,
 *   variableId: 'var-123',
 *   timestamp: new Date(Date.now() - 86400000), // 24 hours ago
 * });
 * ```
 *
 * @remarks
 * - Walks backward through history to find value
 * - Returns null if variable didn't exist at that time
 */
export declare function getVariableValueAtTime(params: {
    historyModel: typeof Model;
    variableId: string;
    timestamp: Date;
    transaction?: Transaction;
}): Promise<any>;
/**
 * Retrieves all changes made by a specific user
 *
 * @async
 * @param {Object} params - User audit query parameters
 * @param {typeof Model} params.historyModel - Variable history model
 * @param {string} params.userId - User ID to audit
 * @param {Date} [params.startDate] - Start of date range
 * @param {Date} [params.endDate] - End of date range
 * @param {number} [params.limit=100] - Maximum entries
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<VariableHistory[]>} Array of user's changes
 *
 * @example
 * ```typescript
 * const userChanges = await getVariableChangesByUser({
 *   historyModel: VariableHistoryModel,
 *   userId: 'admin@company.com',
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-01-31'),
 * });
 * ```
 */
export declare function getVariableChangesByUser(params: {
    historyModel: typeof Model;
    userId: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    transaction?: Transaction;
}): Promise<VariableHistory[]>;
/**
 * Creates a variable expression for dynamic evaluation
 *
 * @async
 * @param {Object} params - Expression creation parameters
 * @param {typeof Model} params.expressionModel - Variable expression model
 * @param {string} params.variableId - Variable to bind expression to
 * @param {string} params.expression - Expression string (e.g., "${var1} + ${var2}")
 * @param {string} [params.language='jexl'] - Expression language
 * @param {string[]} [params.dependencies=[]] - Variable dependencies
 * @param {boolean} [params.autoEvaluate=true] - Auto-evaluate on dependency change
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<VariableExpression>} Created expression
 *
 * @example
 * ```typescript
 * const expr = await createVariableExpression({
 *   expressionModel: VariableExpressionModel,
 *   variableId: 'var-total',
 *   expression: '${price} * ${quantity}',
 *   language: 'jexl',
 *   dependencies: ['price', 'quantity'],
 *   autoEvaluate: true,
 * });
 * ```
 *
 * @remarks
 * - Supported languages: jexl, javascript, spel
 * - Auto-evaluation triggers on dependency changes
 * - Dependencies must be valid variable names
 */
export declare function createVariableExpression(params: {
    expressionModel: typeof Model;
    variableId: string;
    expression: string;
    language?: string;
    dependencies?: string[];
    autoEvaluate?: boolean;
    transaction?: Transaction;
}): Promise<VariableExpression>;
/**
 * Evaluates a variable expression and updates variable value
 *
 * @async
 * @param {Object} params - Expression evaluation parameters
 * @param {typeof Model} params.expressionModel - Variable expression model
 * @param {typeof Model} params.variableModel - ProcessVariable model
 * @param {string} params.variableId - Variable with expression
 * @param {Record<string, any>} params.context - Variable context for evaluation
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<any>} Evaluated value
 * @throws {NotFoundException} If expression not found
 * @throws {BadRequestException} If evaluation fails
 *
 * @example
 * ```typescript
 * const result = await evaluateVariableExpression({
 *   expressionModel: VariableExpressionModel,
 *   variableModel: ProcessVariableModel,
 *   variableId: 'var-total',
 *   context: { price: 10, quantity: 5 },
 * });
 * // result = 50
 * ```
 *
 * @remarks
 * - Uses jexl library for expression evaluation
 * - Updates variable value with evaluated result
 * - Records evaluation timestamp
 * - Throws error if expression syntax invalid
 */
export declare function evaluateVariableExpression(params: {
    expressionModel: typeof Model;
    variableModel: typeof Model;
    variableId: string;
    context: Record<string, any>;
    transaction?: Transaction;
}): Promise<any>;
/**
 * Grants access permissions to a variable
 *
 * @async
 * @param {Object} params - Access grant parameters
 * @param {typeof Model} params.aclModel - Variable access control model
 * @param {string} params.variableId - Variable ID
 * @param {string} params.principalId - User or role ID
 * @param {string} params.principalType - 'user' or 'role'
 * @param {boolean} [params.canRead=true] - Grant read permission
 * @param {boolean} [params.canWrite=false] - Grant write permission
 * @param {boolean} [params.canDelete=false] - Grant delete permission
 * @param {Date} [params.expiresAt] - Permission expiration
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<VariableAccessControl>} Created ACL entry
 *
 * @example
 * ```typescript
 * const acl = await grantVariableAccess({
 *   aclModel: VariableAccessControlModel,
 *   variableId: 'var-sensitive-123',
 *   principalId: 'user-456',
 *   principalType: 'user',
 *   canRead: true,
 *   canWrite: true,
 *   expiresAt: new Date(Date.now() + 86400000), // 24 hours
 * });
 * ```
 */
export declare function grantVariableAccess(params: {
    aclModel: typeof Model;
    variableId: string;
    principalId: string;
    principalType: 'user' | 'role';
    canRead?: boolean;
    canWrite?: boolean;
    canDelete?: boolean;
    expiresAt?: Date;
    transaction?: Transaction;
}): Promise<VariableAccessControl>;
/**
 * Checks if a principal has specific permission on a variable
 *
 * @async
 * @param {Object} params - Permission check parameters
 * @param {typeof Model} params.aclModel - Variable access control model
 * @param {string} params.variableId - Variable ID
 * @param {string} params.principalId - User or role ID
 * @param {'read'|'write'|'delete'} params.permission - Permission to check
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<boolean>} True if permission granted
 *
 * @example
 * ```typescript
 * const canWrite = await checkVariablePermission({
 *   aclModel: VariableAccessControlModel,
 *   variableId: 'var-123',
 *   principalId: 'user-456',
 *   permission: 'write',
 * });
 * ```
 */
export declare function checkVariablePermission(params: {
    aclModel: typeof Model;
    variableId: string;
    principalId: string;
    permission: 'read' | 'write' | 'delete';
    transaction?: Transaction;
}): Promise<boolean>;
/**
 * Revokes all access permissions for a principal on a variable
 *
 * @async
 * @param {Object} params - Access revocation parameters
 * @param {typeof Model} params.aclModel - Variable access control model
 * @param {string} params.variableId - Variable ID
 * @param {string} params.principalId - User or role ID
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<number>} Number of ACL entries deleted
 *
 * @example
 * ```typescript
 * const deleted = await revokeVariableAccess({
 *   aclModel: VariableAccessControlModel,
 *   variableId: 'var-123',
 *   principalId: 'user-456',
 * });
 * ```
 */
export declare function revokeVariableAccess(params: {
    aclModel: typeof Model;
    variableId: string;
    principalId: string;
    transaction?: Transaction;
}): Promise<number>;
/**
 * Deletes a variable (soft delete by setting lifecycle state)
 *
 * @async
 * @param {Object} params - Delete parameters
 * @param {typeof Model} params.model - ProcessVariable model
 * @param {typeof Model} params.historyModel - Variable history model
 * @param {string} params.variableId - Variable ID to delete
 * @param {string} [params.userId] - User performing deletion
 * @param {boolean} [params.hardDelete=false] - Permanently delete from database
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<boolean>} True if deleted successfully
 *
 * @example
 * ```typescript
 * const deleted = await deleteVariable({
 *   model: ProcessVariableModel,
 *   historyModel: VariableHistoryModel,
 *   variableId: 'var-123',
 *   userId: 'admin',
 *   hardDelete: false, // soft delete
 * });
 * ```
 *
 * @remarks
 * - Soft delete sets lifecycleState to DELETED
 * - Hard delete permanently removes from database
 * - Creates history entry for audit trail
 */
export declare function deleteVariable(params: {
    model: typeof Model;
    historyModel: typeof Model;
    variableId: string;
    userId?: string;
    hardDelete?: boolean;
    transaction?: Transaction;
}): Promise<boolean>;
/**
 * Archives a variable (sets lifecycle state to ARCHIVED)
 *
 * @async
 * @param {Object} params - Archive parameters
 * @param {typeof Model} params.model - ProcessVariable model
 * @param {string} params.variableId - Variable ID
 * @param {string} [params.userId] - User performing archival
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<ProcessVariable>} Archived variable
 *
 * @example
 * ```typescript
 * const archived = await archiveVariable({
 *   model: ProcessVariableModel,
 *   variableId: 'var-old-123',
 *   userId: 'admin',
 * });
 * ```
 */
export declare function archiveVariable(params: {
    model: typeof Model;
    variableId: string;
    userId?: string;
    transaction?: Transaction;
}): Promise<ProcessVariable>;
/**
 * Cleans up expired variables based on expiresAt timestamp
 *
 * @async
 * @param {Object} params - Cleanup parameters
 * @param {typeof Model} params.model - ProcessVariable model
 * @param {boolean} [params.hardDelete=false] - Permanently delete expired variables
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<number>} Number of variables cleaned up
 *
 * @example
 * ```typescript
 * const cleaned = await cleanupExpiredVariables({
 *   model: ProcessVariableModel,
 *   hardDelete: false,
 * });
 * console.log(`Cleaned up ${cleaned} expired variables`);
 * ```
 *
 * @remarks
 * - Runs as background job, typically scheduled
 * - Respects hard delete flag
 * - Only affects variables with expiresAt set
 */
export declare function cleanupExpiredVariables(params: {
    model: typeof Model;
    hardDelete?: boolean;
    transaction?: Transaction;
}): Promise<number>;
/**
 * Cleans up local variables for a completed activity
 *
 * @async
 * @param {Object} params - Activity cleanup parameters
 * @param {typeof Model} params.model - ProcessVariable model
 * @param {string} params.processInstanceId - Process instance ID
 * @param {string} params.activityId - Completed activity ID
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<number>} Number of variables deleted
 *
 * @example
 * ```typescript
 * const deleted = await cleanupActivityVariables({
 *   model: ProcessVariableModel,
 *   processInstanceId: 'proc-123',
 *   activityId: 'task-456',
 * });
 * ```
 *
 * @remarks
 * - Called automatically when activity completes
 * - Only deletes LOCAL scope variables
 * - Preserves PROCESS and GLOBAL scope variables
 */
export declare function cleanupActivityVariables(params: {
    model: typeof Model;
    processInstanceId: string;
    activityId: string;
    transaction?: Transaction;
}): Promise<number>;
/**
 * Cleans up all variables for a completed process instance
 *
 * @async
 * @param {Object} params - Process cleanup parameters
 * @param {typeof Model} params.model - ProcessVariable model
 * @param {string} params.processInstanceId - Process instance ID
 * @param {boolean} [params.preserveAudit=true] - Archive instead of delete for audit
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<number>} Number of variables cleaned up
 *
 * @example
 * ```typescript
 * const cleaned = await cleanupProcessVariables({
 *   model: ProcessVariableModel,
 *   processInstanceId: 'proc-123',
 *   preserveAudit: true, // archive for compliance
 * });
 * ```
 */
export declare function cleanupProcessVariables(params: {
    model: typeof Model;
    processInstanceId: string;
    preserveAudit?: boolean;
    transaction?: Transaction;
}): Promise<number>;
/**
 * Serializes a variable to JSON format
 *
 * @param {ProcessVariable} variable - Variable to serialize
 * @param {boolean} [includeValue=true] - Include variable value
 * @param {boolean} [includeMetadata=true] - Include metadata
 * @returns {Record<string, any>} Serialized variable
 *
 * @example
 * ```typescript
 * const json = serializeVariable(variable, true, true);
 * const jsonString = JSON.stringify(json);
 * ```
 */
export declare function serializeVariable(variable: ProcessVariable, includeValue?: boolean, includeMetadata?: boolean): Record<string, any>;
/**
 * Deserializes a variable from JSON format
 *
 * @param {Record<string, any>} json - JSON representation
 * @returns {Partial<ProcessVariable>} Deserialized variable data
 *
 * @example
 * ```typescript
 * const variableData = deserializeVariable(jsonData);
 * ```
 */
export declare function deserializeVariable(json: Record<string, any>): Partial<ProcessVariable>;
/**
 * Exports variables to portable JSON format for migration
 *
 * @async
 * @param {Object} params - Export parameters
 * @param {typeof Model} params.model - ProcessVariable model
 * @param {string} [params.processInstanceId] - Filter by process instance
 * @param {VariableScope[]} [params.scopes] - Filter by scopes
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<Record<string, any>[]>} Array of serialized variables
 *
 * @example
 * ```typescript
 * const exported = await exportVariables({
 *   model: ProcessVariableModel,
 *   processInstanceId: 'proc-123',
 *   scopes: [VariableScope.PROCESS],
 * });
 * fs.writeFileSync('variables.json', JSON.stringify(exported, null, 2));
 * ```
 */
export declare function exportVariables(params: {
    model: typeof Model;
    processInstanceId?: string;
    scopes?: VariableScope[];
    transaction?: Transaction;
}): Promise<Record<string, any>[]>;
/**
 * Imports variables from JSON format
 *
 * @async
 * @param {Object} params - Import parameters
 * @param {typeof Model} params.model - ProcessVariable model
 * @param {Record<string, any>[]} params.variables - Array of serialized variables
 * @param {string} [params.targetProcessInstanceId] - Override process instance ID
 * @param {string} [params.userId] - User performing import
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<ProcessVariable[]>} Array of imported variables
 *
 * @example
 * ```typescript
 * const jsonData = JSON.parse(fs.readFileSync('variables.json', 'utf8'));
 * const imported = await importVariables({
 *   model: ProcessVariableModel,
 *   variables: jsonData,
 *   targetProcessInstanceId: 'proc-new-456',
 *   userId: 'admin',
 * });
 * ```
 */
export declare function importVariables(params: {
    model: typeof Model;
    variables: Record<string, any>[];
    targetProcessInstanceId?: string;
    userId?: string;
    transaction?: Transaction;
}): Promise<ProcessVariable[]>;
//# sourceMappingURL=workflow-variable-management.d.ts.map