/**
 * @fileoverview Database Models Kit - Comprehensive Sequelize model utilities
 * @module reuse/database-models-kit
 * @description Complete Sequelize model helper functions for model definition,
 * validation, hooks, virtual attributes, scopes, soft deletes, versioning,
 * audit trails, and advanced model patterns.
 *
 * Key Features:
 * - Model definition helpers and builders
 * - Custom data type definitions and validators
 * - Advanced validation rules and sanitizers
 * - Comprehensive model hooks (lifecycle events)
 * - Virtual attributes and computed getters
 * - Scopes and default scope management
 * - Paranoid/soft delete utilities
 * - UUID/ULID primary key generators
 * - Timestamp management and automation
 * - Audit trail and change tracking
 * - Model versioning and history
 * - JSON field helpers and operations
 * - Enum type definitions and validators
 * - Association helpers and patterns
 * - Query optimization utilities
 *
 * @target Sequelize v6.x, Node 18+, TypeScript 5.x
 *
 * @security
 * - Input sanitization and validation
 * - SQL injection prevention
 * - XSS protection in JSON fields
 * - Secure default values
 * - Audit logging for sensitive operations
 * - Field-level encryption support
 * - HIPAA compliance helpers
 *
 * @example Basic model definition
 * ```typescript
 * import { createBaseModel, addTimestamps, addSoftDelete } from './database-models-kit';
 *
 * const UserModel = createBaseModel(sequelize, 'User', {
 *   firstName: DataTypes.STRING,
 *   email: DataTypes.STRING
 * });
 *
 * addTimestamps(UserModel);
 * addSoftDelete(UserModel);
 * ```
 *
 * @example Advanced model with hooks and validations
 * ```typescript
 * import {
 *   addBeforeCreateHook,
 *   addEmailValidation,
 *   addAuditTrail,
 *   createVersionedModel
 * } from './database-models-kit';
 *
 * const model = createVersionedModel(sequelize, 'Patient', attributes);
 * addBeforeCreateHook(model, async (instance) => {
 *   instance.id = generateULID();
 * });
 * addEmailValidation(model, 'email');
 * addAuditTrail(sequelize, 'Patient');
 * ```
 *
 * @example Virtual attributes and scopes
 * ```typescript
 * import {
 *   addVirtualAttribute,
 *   addDefaultScope,
 *   addNamedScope
 * } from './database-models-kit';
 *
 * addVirtualAttribute(UserModel, 'fullName', function() {
 *   return `${this.firstName} ${this.lastName}`;
 * });
 *
 * addDefaultScope(UserModel, { where: { active: true } });
 * addNamedScope(UserModel, 'verified', { where: { emailVerified: true } });
 * ```
 *
 * LOC: DB-MODEL-001
 * UPSTREAM: sequelize, @types/sequelize, ulid, crypto
 * DOWNSTREAM: all models, migrations, seeders, services
 *
 * @version 1.0.0
 * @since 2025-11-08
 */
import { Model, ModelStatic, Sequelize, ModelAttributes, ModelOptions, Transaction, FindOptions } from 'sequelize';
/**
 * @enum AuditAction
 * @description Types of audit actions
 */
export declare enum AuditAction {
    CREATE = "CREATE",
    UPDATE = "UPDATE",
    DELETE = "DELETE",
    SOFT_DELETE = "SOFT_DELETE",
    RESTORE = "RESTORE",
    BULK_CREATE = "BULK_CREATE",
    BULK_UPDATE = "BULK_UPDATE",
    BULK_DELETE = "BULK_DELETE"
}
/**
 * @enum DataClassification
 * @description HIPAA data classification levels
 */
export declare enum DataClassification {
    PUBLIC = "PUBLIC",
    INTERNAL = "INTERNAL",
    CONFIDENTIAL = "CONFIDENTIAL",
    PHI = "PHI",// Protected Health Information
    PII = "PII"
}
/**
 * @interface BaseModelAttributes
 * @description Standard attributes for base models
 */
export interface BaseModelAttributes {
    id: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
    createdBy?: string | null;
    updatedBy?: string | null;
    deletedBy?: string | null;
}
/**
 * @interface AuditLogEntry
 * @description Audit log entry structure
 */
export interface AuditLogEntry {
    id: string;
    tableName: string;
    recordId: string;
    action: AuditAction;
    userId?: string;
    changes?: Record<string, {
        old: any;
        new: any;
    }>;
    metadata?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
    timestamp: Date;
}
/**
 * @interface VersionRecord
 * @description Version history record
 */
export interface VersionRecord {
    id: string;
    modelName: string;
    recordId: string;
    version: number;
    data: Record<string, any>;
    userId?: string;
    createdAt: Date;
}
/**
 * @interface ModelValidationRule
 * @description Custom validation rule definition
 */
export interface ModelValidationRule {
    field: string;
    validator: (value: any, instance?: any) => boolean | Promise<boolean>;
    message: string;
}
/**
 * @interface ScopeDefinition
 * @description Scope configuration
 */
export interface ScopeDefinition {
    where?: Record<string, any>;
    include?: any[];
    attributes?: string[] | {
        exclude?: string[];
        include?: string[];
    };
    order?: any[];
    limit?: number;
}
/**
 * @interface TimestampConfig
 * @description Timestamp configuration options
 */
export interface TimestampConfig {
    createdAt?: string | boolean;
    updatedAt?: string | boolean;
    deletedAt?: string | boolean;
    underscored?: boolean;
}
/**
 * @interface SoftDeleteConfig
 * @description Soft delete configuration
 */
export interface SoftDeleteConfig {
    paranoid?: boolean;
    deletedAt?: string;
    includeDeletedBy?: boolean;
}
/**
 * Creates a base model with standard configuration
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} modelName - Model name
 * @param {ModelAttributes} attributes - Model attributes
 * @param {Partial<ModelOptions>} [options={}] - Additional model options
 * @returns {ModelStatic<Model>} Configured model
 *
 * @example
 * ```typescript
 * const User = createBaseModel(sequelize, 'User', {
 *   id: { type: DataTypes.UUID, primaryKey: true },
 *   email: { type: DataTypes.STRING, allowNull: false }
 * });
 * ```
 */
export declare const createBaseModel: (sequelize: Sequelize, modelName: string, attributes: ModelAttributes, options?: Partial<ModelOptions>) => ModelStatic<Model>;
/**
 * Creates a model with UUID primary key
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} modelName - Model name
 * @param {ModelAttributes} attributes - Model attributes (excluding id)
 * @param {Partial<ModelOptions>} [options={}] - Additional options
 * @returns {ModelStatic<Model>} Model with UUID primary key
 *
 * @example
 * ```typescript
 * const Product = createUUIDModel(sequelize, 'Product', {
 *   name: DataTypes.STRING,
 *   price: DataTypes.DECIMAL
 * });
 * ```
 */
export declare const createUUIDModel: (sequelize: Sequelize, modelName: string, attributes: ModelAttributes, options?: Partial<ModelOptions>) => ModelStatic<Model>;
/**
 * Creates a model with ULID primary key
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} modelName - Model name
 * @param {ModelAttributes} attributes - Model attributes (excluding id)
 * @param {Partial<ModelOptions>} [options={}] - Additional options
 * @returns {ModelStatic<Model>} Model with ULID primary key
 *
 * @example
 * ```typescript
 * const Order = createULIDModel(sequelize, 'Order', {
 *   total: DataTypes.DECIMAL,
 *   status: DataTypes.STRING
 * });
 * ```
 */
export declare const createULIDModel: (sequelize: Sequelize, modelName: string, attributes: ModelAttributes, options?: Partial<ModelOptions>) => ModelStatic<Model>;
/**
 * Creates a versioned model with history tracking
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} modelName - Model name
 * @param {ModelAttributes} attributes - Model attributes
 * @param {Partial<ModelOptions>} [options={}] - Additional options
 * @returns {ModelStatic<Model>} Versioned model
 *
 * @example
 * ```typescript
 * const Patient = createVersionedModel(sequelize, 'Patient', {
 *   firstName: DataTypes.STRING,
 *   medicalRecordNumber: DataTypes.STRING
 * });
 * ```
 */
export declare const createVersionedModel: (sequelize: Sequelize, modelName: string, attributes: ModelAttributes, options?: Partial<ModelOptions>) => ModelStatic<Model>;
/**
 * Adds standard timestamps to a model
 *
 * @param {ModelStatic<Model>} model - Model to modify
 * @param {TimestampConfig} [config={}] - Timestamp configuration
 * @returns {void}
 *
 * @example
 * ```typescript
 * addTimestamps(UserModel, {
 *   createdAt: 'created_at',
 *   updatedAt: 'updated_at'
 * });
 * ```
 */
export declare const addTimestamps: (model: ModelStatic<Model>, config?: TimestampConfig) => void;
/**
 * Adds user tracking fields (createdBy, updatedBy)
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await addUserTracking(sequelize, 'users');
 * ```
 */
export declare const addUserTracking: (sequelize: Sequelize, tableName: string, transaction?: Transaction) => Promise<void>;
/**
 * Creates a timestamp trigger for automatic updates
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createTimestampTrigger(sequelize, 'patients');
 * ```
 */
export declare const createTimestampTrigger: (sequelize: Sequelize, tableName: string, transaction?: Transaction) => Promise<void>;
/**
 * Adds soft delete (paranoid) functionality to a model
 *
 * @param {ModelStatic<Model>} model - Model to modify
 * @param {SoftDeleteConfig} [config={}] - Soft delete configuration
 * @returns {void}
 *
 * @example
 * ```typescript
 * addSoftDelete(UserModel, {
 *   paranoid: true,
 *   deletedAt: 'deleted_at',
 *   includeDeletedBy: true
 * });
 * ```
 */
export declare const addSoftDelete: (model: ModelStatic<Model>, config?: SoftDeleteConfig) => void;
/**
 * Soft deletes a record
 *
 * @param {Model} instance - Model instance
 * @param {string} [userId] - User performing deletion
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await softDeleteRecord(userInstance, 'admin-123');
 * ```
 */
export declare const softDeleteRecord: (instance: Model, userId?: string, transaction?: Transaction) => Promise<void>;
/**
 * Restores a soft-deleted record
 *
 * @param {Model} instance - Model instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await restoreRecord(userInstance);
 * ```
 */
export declare const restoreRecord: (instance: Model, transaction?: Transaction) => Promise<void>;
/**
 * Permanently deletes a soft-deleted record
 *
 * @param {Model} instance - Model instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await forceDeleteRecord(userInstance);
 * ```
 */
export declare const forceDeleteRecord: (instance: Model, transaction?: Transaction) => Promise<void>;
/**
 * Gets all soft-deleted records for a model
 *
 * @param {ModelStatic<Model>} model - Model class
 * @param {FindOptions} [options={}] - Query options
 * @returns {Promise<Model[]>} Soft-deleted records
 *
 * @example
 * ```typescript
 * const deleted = await getSoftDeletedRecords(UserModel);
 * ```
 */
export declare const getSoftDeletedRecords: (model: ModelStatic<Model>, options?: FindOptions) => Promise<Model[]>;
/**
 * Generates a UUID v4
 *
 * @returns {string} UUID v4 string
 *
 * @example
 * ```typescript
 * const id = generateUUID();
 * // => '550e8400-e29b-41d4-a716-446655440000'
 * ```
 */
export declare const generateUUID: () => string;
/**
 * Generates a ULID (Universally Unique Lexicographically Sortable Identifier)
 *
 * @returns {string} ULID string
 *
 * @example
 * ```typescript
 * const id = generateULID();
 * // => '01HXYZ1234ABCDEFGHIJKLMNOP'
 * ```
 */
export declare const generateULID: () => string;
/**
 * Validates UUID format
 *
 * @param {string} uuid - UUID string to validate
 * @returns {boolean} True if valid UUID
 *
 * @example
 * ```typescript
 * isValidUUID('550e8400-e29b-41d4-a716-446655440000'); // => true
 * ```
 */
export declare const isValidUUID: (uuid: string) => boolean;
/**
 * Validates ULID format
 *
 * @param {string} ulid - ULID string to validate
 * @returns {boolean} True if valid ULID
 *
 * @example
 * ```typescript
 * isValidULID('01HXYZ1234ABCDEFGHIJKLMNOP'); // => true
 * ```
 */
export declare const isValidULID: (ulid: string) => boolean;
/**
 * Adds email validation to a model field
 *
 * @param {ModelStatic<Model>} model - Model to modify
 * @param {string} fieldName - Field name
 * @param {boolean} [required=true] - Whether field is required
 * @returns {void}
 *
 * @example
 * ```typescript
 * addEmailValidation(UserModel, 'email');
 * ```
 */
export declare const addEmailValidation: (model: ModelStatic<Model>, fieldName: string, required?: boolean) => void;
/**
 * Adds phone number validation
 *
 * @param {ModelStatic<Model>} model - Model to modify
 * @param {string} fieldName - Field name
 * @param {string} [format='US'] - Phone format (US, INTERNATIONAL)
 * @returns {void}
 *
 * @example
 * ```typescript
 * addPhoneValidation(UserModel, 'phoneNumber', 'US');
 * ```
 */
export declare const addPhoneValidation: (model: ModelStatic<Model>, fieldName: string, format?: string) => void;
/**
 * Adds URL validation
 *
 * @param {ModelStatic<Model>} model - Model to modify
 * @param {string} fieldName - Field name
 * @returns {void}
 *
 * @example
 * ```typescript
 * addURLValidation(WebsiteModel, 'url');
 * ```
 */
export declare const addURLValidation: (model: ModelStatic<Model>, fieldName: string) => void;
/**
 * Adds custom validation rule to a field
 *
 * @param {ModelStatic<Model>} model - Model to modify
 * @param {string} fieldName - Field name
 * @param {Function} validator - Validator function
 * @param {string} message - Error message
 * @returns {void}
 *
 * @example
 * ```typescript
 * addCustomValidation(UserModel, 'username', (value) => {
 *   return /^[a-zA-Z0-9_]+$/.test(value);
 * }, 'Username can only contain letters, numbers, and underscores');
 * ```
 */
export declare const addCustomValidation: (model: ModelStatic<Model>, fieldName: string, validator: (value: any) => boolean | Promise<boolean>, message: string) => void;
/**
 * Adds length validation
 *
 * @param {ModelStatic<Model>} model - Model to modify
 * @param {string} fieldName - Field name
 * @param {number} min - Minimum length
 * @param {number} max - Maximum length
 * @returns {void}
 *
 * @example
 * ```typescript
 * addLengthValidation(UserModel, 'username', 3, 20);
 * ```
 */
export declare const addLengthValidation: (model: ModelStatic<Model>, fieldName: string, min: number, max: number) => void;
/**
 * Adds numeric range validation
 *
 * @param {ModelStatic<Model>} model - Model to modify
 * @param {string} fieldName - Field name
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {void}
 *
 * @example
 * ```typescript
 * addRangeValidation(ProductModel, 'price', 0, 10000);
 * ```
 */
export declare const addRangeValidation: (model: ModelStatic<Model>, fieldName: string, min: number, max: number) => void;
/**
 * Adds a beforeCreate hook to a model
 *
 * @param {ModelStatic<Model>} model - Model to modify
 * @param {Function} hook - Hook function
 * @returns {void}
 *
 * @example
 * ```typescript
 * addBeforeCreateHook(UserModel, async (instance) => {
 *   instance.id = generateUUID();
 * });
 * ```
 */
export declare const addBeforeCreateHook: (model: ModelStatic<Model>, hook: (instance: Model, options: any) => Promise<void> | void) => void;
/**
 * Adds an afterCreate hook to a model
 *
 * @param {ModelStatic<Model>} model - Model to modify
 * @param {Function} hook - Hook function
 * @returns {void}
 *
 * @example
 * ```typescript
 * addAfterCreateHook(UserModel, async (instance) => {
 *   await sendWelcomeEmail(instance.email);
 * });
 * ```
 */
export declare const addAfterCreateHook: (model: ModelStatic<Model>, hook: (instance: Model, options: any) => Promise<void> | void) => void;
/**
 * Adds a beforeUpdate hook to a model
 *
 * @param {ModelStatic<Model>} model - Model to modify
 * @param {Function} hook - Hook function
 * @returns {void}
 *
 * @example
 * ```typescript
 * addBeforeUpdateHook(UserModel, async (instance) => {
 *   instance.updatedAt = new Date();
 * });
 * ```
 */
export declare const addBeforeUpdateHook: (model: ModelStatic<Model>, hook: (instance: Model, options: any) => Promise<void> | void) => void;
/**
 * Adds an afterUpdate hook to a model
 *
 * @param {ModelStatic<Model>} model - Model to modify
 * @param {Function} hook - Hook function
 * @returns {void}
 *
 * @example
 * ```typescript
 * addAfterUpdateHook(UserModel, async (instance) => {
 *   await notifyUserOfChanges(instance);
 * });
 * ```
 */
export declare const addAfterUpdateHook: (model: ModelStatic<Model>, hook: (instance: Model, options: any) => Promise<void> | void) => void;
/**
 * Adds a beforeDestroy hook to a model
 *
 * @param {ModelStatic<Model>} model - Model to modify
 * @param {Function} hook - Hook function
 * @returns {void}
 *
 * @example
 * ```typescript
 * addBeforeDestroyHook(UserModel, async (instance) => {
 *   await archiveUserData(instance);
 * });
 * ```
 */
export declare const addBeforeDestroyHook: (model: ModelStatic<Model>, hook: (instance: Model, options: any) => Promise<void> | void) => void;
/**
 * Adds an afterDestroy hook to a model
 *
 * @param {ModelStatic<Model>} model - Model to modify
 * @param {Function} hook - Hook function
 * @returns {void}
 *
 * @example
 * ```typescript
 * addAfterDestroyHook(UserModel, async (instance) => {
 *   await cleanupRelatedData(instance.id);
 * });
 * ```
 */
export declare const addAfterDestroyHook: (model: ModelStatic<Model>, hook: (instance: Model, options: any) => Promise<void> | void) => void;
/**
 * Adds a beforeValidate hook to a model
 *
 * @param {ModelStatic<Model>} model - Model to modify
 * @param {Function} hook - Hook function
 * @returns {void}
 *
 * @example
 * ```typescript
 * addBeforeValidateHook(UserModel, async (instance) => {
 *   instance.email = instance.email?.toLowerCase();
 * });
 * ```
 */
export declare const addBeforeValidateHook: (model: ModelStatic<Model>, hook: (instance: Model, options: any) => Promise<void> | void) => void;
/**
 * Adds a virtual attribute to a model
 *
 * @param {ModelStatic<Model>} model - Model to modify
 * @param {string} attributeName - Virtual attribute name
 * @param {Function} getter - Getter function
 * @param {Function} [setter] - Optional setter function
 * @returns {void}
 *
 * @example
 * ```typescript
 * addVirtualAttribute(UserModel, 'fullName', function() {
 *   return `${this.firstName} ${this.lastName}`;
 * });
 * ```
 */
export declare const addVirtualAttribute: (model: ModelStatic<Model>, attributeName: string, getter: () => any, setter?: (value: any) => void) => void;
/**
 * Creates a computed field based on other attributes
 *
 * @param {ModelStatic<Model>} model - Model to modify
 * @param {string} fieldName - Computed field name
 * @param {string[]} dependencies - Dependent field names
 * @param {Function} compute - Computation function
 * @returns {void}
 *
 * @example
 * ```typescript
 * addComputedField(OrderModel, 'totalWithTax', ['subtotal', 'taxRate'], function() {
 *   return this.subtotal * (1 + this.taxRate);
 * });
 * ```
 */
export declare const addComputedField: (model: ModelStatic<Model>, fieldName: string, dependencies: string[], compute: (...args: any[]) => any) => void;
/**
 * Adds a getter to transform attribute on retrieval
 *
 * @param {ModelStatic<Model>} model - Model to modify
 * @param {string} attributeName - Attribute name
 * @param {Function} getter - Getter function
 * @returns {void}
 *
 * @example
 * ```typescript
 * addGetter(UserModel, 'email', function() {
 *   return this.getDataValue('email')?.toLowerCase();
 * });
 * ```
 */
export declare const addGetter: (model: ModelStatic<Model>, attributeName: string, getter: () => any) => void;
/**
 * Adds a setter to transform attribute on assignment
 *
 * @param {ModelStatic<Model>} model - Model to modify
 * @param {string} attributeName - Attribute name
 * @param {Function} setter - Setter function
 * @returns {void}
 *
 * @example
 * ```typescript
 * addSetter(UserModel, 'email', function(value) {
 *   this.setDataValue('email', value?.toLowerCase());
 * });
 * ```
 */
export declare const addSetter: (model: ModelStatic<Model>, attributeName: string, setter: (value: any) => void) => void;
/**
 * Adds a default scope to a model
 *
 * @param {ModelStatic<Model>} model - Model to modify
 * @param {ScopeDefinition} scope - Scope definition
 * @returns {void}
 *
 * @example
 * ```typescript
 * addDefaultScope(UserModel, {
 *   where: { active: true },
 *   attributes: { exclude: ['password'] }
 * });
 * ```
 */
export declare const addDefaultScope: (model: ModelStatic<Model>, scope: ScopeDefinition) => void;
/**
 * Adds a named scope to a model
 *
 * @param {ModelStatic<Model>} model - Model to modify
 * @param {string} scopeName - Scope name
 * @param {ScopeDefinition | Function} scope - Scope definition or function
 * @returns {void}
 *
 * @example
 * ```typescript
 * addNamedScope(UserModel, 'verified', {
 *   where: { emailVerified: true }
 * });
 * ```
 */
export declare const addNamedScope: (model: ModelStatic<Model>, scopeName: string, scope: ScopeDefinition | ((...args: any[]) => ScopeDefinition)) => void;
/**
 * Adds an active records scope
 *
 * @param {ModelStatic<Model>} model - Model to modify
 * @returns {void}
 *
 * @example
 * ```typescript
 * addActiveScope(UserModel);
 * // Usage: UserModel.scope('active').findAll()
 * ```
 */
export declare const addActiveScope: (model: ModelStatic<Model>) => void;
/**
 * Adds a recent records scope
 *
 * @param {ModelStatic<Model>} model - Model to modify
 * @param {number} [days=7] - Days to look back
 * @returns {void}
 *
 * @example
 * ```typescript
 * addRecentScope(OrderModel, 30);
 * ```
 */
export declare const addRecentScope: (model: ModelStatic<Model>, days?: number) => void;
/**
 * Creates an audit log table
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} [tableName='audit_logs'] - Audit log table name
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createAuditLogTable(sequelize);
 * ```
 */
export declare const createAuditLogTable: (sequelize: Sequelize, tableName?: string, transaction?: Transaction) => Promise<void>;
/**
 * Logs an audit entry
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<AuditLogEntry>} entry - Audit log entry
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await logAudit(sequelize, {
 *   tableName: 'users',
 *   recordId: 'user-123',
 *   action: AuditAction.UPDATE,
 *   userId: 'admin-456',
 *   changes: { email: { old: 'old@test.com', new: 'new@test.com' } }
 * });
 * ```
 */
export declare const logAudit: (sequelize: Sequelize, entry: Partial<AuditLogEntry>, transaction?: Transaction) => Promise<void>;
/**
 * Adds automatic audit logging to a model
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ModelStatic<Model>} model - Model to audit
 * @param {string} [userId] - User ID for audit
 * @returns {void}
 *
 * @example
 * ```typescript
 * addAuditTrail(sequelize, UserModel);
 * ```
 */
export declare const addAuditTrail: (sequelize: Sequelize, model: ModelStatic<Model>, userId?: string) => void;
/**
 * Creates a version history table
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} modelName - Model name to version
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createVersionHistoryTable(sequelize, 'Patient');
 * ```
 */
export declare const createVersionHistoryTable: (sequelize: Sequelize, modelName: string, transaction?: Transaction) => Promise<void>;
/**
 * Saves a version snapshot
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} modelName - Model name
 * @param {Model} instance - Model instance
 * @param {string} [userId] - User ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await saveVersion(sequelize, 'Patient', patientInstance, 'doctor-123');
 * ```
 */
export declare const saveVersion: (sequelize: Sequelize, modelName: string, instance: Model, userId?: string, transaction?: Transaction) => Promise<void>;
/**
 * Gets version history for a record
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} modelName - Model name
 * @param {string} recordId - Record ID
 * @returns {Promise<VersionRecord[]>} Version history
 *
 * @example
 * ```typescript
 * const history = await getVersionHistory(sequelize, 'Patient', 'patient-123');
 * ```
 */
export declare const getVersionHistory: (sequelize: Sequelize, modelName: string, recordId: string) => Promise<VersionRecord[]>;
/**
 * Adds a JSON field to a model
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @param {string} fieldName - Field name
 * @param {any} [defaultValue={}] - Default value
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await addJSONField(sequelize, 'users', 'preferences', {});
 * ```
 */
export declare const addJSONField: (sequelize: Sequelize, tableName: string, fieldName: string, defaultValue?: any, transaction?: Transaction) => Promise<void>;
/**
 * Updates a JSON field path
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @param {string} fieldName - JSON field name
 * @param {string} path - JSON path (e.g., 'settings.theme')
 * @param {any} value - Value to set
 * @param {string} whereClause - WHERE clause
 * @param {Record<string, any>} [replacements={}] - Query replacements
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateJSONPath(sequelize, 'users', 'preferences', 'theme', 'dark', 'id = :userId', { userId: '123' });
 * ```
 */
export declare const updateJSONPath: (sequelize: Sequelize, tableName: string, fieldName: string, path: string, value: any, whereClause: string, replacements?: Record<string, any>, transaction?: Transaction) => Promise<void>;
/**
 * Queries by JSON field value
 *
 * @param {ModelStatic<Model>} model - Model class
 * @param {string} fieldName - JSON field name
 * @param {string} path - JSON path
 * @param {any} value - Value to match
 * @param {FindOptions} [options={}] - Additional query options
 * @returns {Promise<Model[]>} Matching records
 *
 * @example
 * ```typescript
 * const users = await queryByJSONField(UserModel, 'preferences', 'theme', 'dark');
 * ```
 */
export declare const queryByJSONField: (model: ModelStatic<Model>, fieldName: string, path: string, value: any, options?: FindOptions) => Promise<Model[]>;
/**
 * Creates a Postgres ENUM type
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} enumName - Enum type name
 * @param {string[]} values - Enum values
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createEnumType(sequelize, 'user_status', ['ACTIVE', 'INACTIVE', 'SUSPENDED']);
 * ```
 */
export declare const createEnumType: (sequelize: Sequelize, enumName: string, values: string[], transaction?: Transaction) => Promise<void>;
/**
 * Adds a value to an existing ENUM type
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} enumName - Enum type name
 * @param {string} value - New value to add
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await addEnumValue(sequelize, 'user_status', 'BANNED');
 * ```
 */
export declare const addEnumValue: (sequelize: Sequelize, enumName: string, value: string, transaction?: Transaction) => Promise<void>;
/**
 * Creates an enum validator for a model field
 *
 * @param {ModelStatic<Model>} model - Model to modify
 * @param {string} fieldName - Field name
 * @param {string[]} allowedValues - Allowed values
 * @returns {void}
 *
 * @example
 * ```typescript
 * addEnumValidation(UserModel, 'status', ['ACTIVE', 'INACTIVE', 'SUSPENDED']);
 * ```
 */
export declare const addEnumValidation: (model: ModelStatic<Model>, fieldName: string, allowedValues: string[]) => void;
/**
 * Converts camelCase to snake_case
 *
 * @param {string} str - String to convert
 * @returns {string} snake_case string
 *
 * @example
 * ```typescript
 * toSnakeCase('userName'); // => 'user_name'
 * ```
 */
export declare const toSnakeCase: (str: string) => string;
/**
 * Converts snake_case to camelCase
 *
 * @param {string} str - String to convert
 * @returns {string} camelCase string
 *
 * @example
 * ```typescript
 * toCamelCase('user_name'); // => 'userName'
 * ```
 */
export declare const toCamelCase: (str: string) => string;
/**
 * Sanitizes user input for SQL safety
 *
 * @param {string} input - Input string
 * @returns {string} Sanitized string
 *
 * @example
 * ```typescript
 * const safe = sanitizeInput(userInput);
 * ```
 */
export declare const sanitizeInput: (input: string) => string;
/**
 * Validates required fields on a model instance
 *
 * @param {Model} instance - Model instance
 * @param {string[]} requiredFields - Required field names
 * @throws {ValidationError} If required fields are missing
 * @returns {void}
 *
 * @example
 * ```typescript
 * validateRequiredFields(userInstance, ['email', 'firstName', 'lastName']);
 * ```
 */
export declare const validateRequiredFields: (instance: Model, requiredFields: string[]) => void;
/**
 * Gets model changes (dirty fields)
 *
 * @param {Model} instance - Model instance
 * @returns {Record<string, { old: any; new: any }>} Changed fields
 *
 * @example
 * ```typescript
 * const changes = getModelChanges(userInstance);
 * // => { email: { old: 'old@test.com', new: 'new@test.com' } }
 * ```
 */
export declare const getModelChanges: (instance: Model) => Record<string, {
    old: any;
    new: any;
}>;
/**
 * Clones a model instance
 *
 * @param {Model} instance - Model instance to clone
 * @param {Partial<any>} [overrides={}] - Fields to override
 * @returns {Promise<Model>} Cloned instance
 *
 * @example
 * ```typescript
 * const clone = await cloneInstance(originalUser, { email: 'new@test.com' });
 * ```
 */
export declare const cloneInstance: (instance: Model, overrides?: Partial<any>) => Promise<Model>;
/**
 * Bulk upserts records efficiently
 *
 * @param {ModelStatic<Model>} model - Model class
 * @param {any[]} records - Records to upsert
 * @param {string[]} conflictFields - Fields to check for conflicts
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of records affected
 *
 * @example
 * ```typescript
 * await bulkUpsert(UserModel, users, ['email']);
 * ```
 */
export declare const bulkUpsert: (model: ModelStatic<Model>, records: any[], conflictFields: string[], transaction?: Transaction) => Promise<number>;
//# sourceMappingURL=database-models-kit.d.ts.map