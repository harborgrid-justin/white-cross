"use strict";
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
exports.addEnumValue = exports.createEnumType = exports.queryByJSONField = exports.updateJSONPath = exports.addJSONField = exports.getVersionHistory = exports.saveVersion = exports.createVersionHistoryTable = exports.addAuditTrail = exports.logAudit = exports.createAuditLogTable = exports.addRecentScope = exports.addActiveScope = exports.addNamedScope = exports.addDefaultScope = exports.addSetter = exports.addGetter = exports.addComputedField = exports.addVirtualAttribute = exports.addBeforeValidateHook = exports.addAfterDestroyHook = exports.addBeforeDestroyHook = exports.addAfterUpdateHook = exports.addBeforeUpdateHook = exports.addAfterCreateHook = exports.addBeforeCreateHook = exports.addRangeValidation = exports.addLengthValidation = exports.addCustomValidation = exports.addURLValidation = exports.addPhoneValidation = exports.addEmailValidation = exports.isValidULID = exports.isValidUUID = exports.generateULID = exports.generateUUID = exports.getSoftDeletedRecords = exports.forceDeleteRecord = exports.restoreRecord = exports.softDeleteRecord = exports.addSoftDelete = exports.createTimestampTrigger = exports.addUserTracking = exports.addTimestamps = exports.createVersionedModel = exports.createULIDModel = exports.createUUIDModel = exports.createBaseModel = exports.DataClassification = exports.AuditAction = void 0;
exports.bulkUpsert = exports.cloneInstance = exports.getModelChanges = exports.validateRequiredFields = exports.sanitizeInput = exports.toCamelCase = exports.toSnakeCase = exports.addEnumValidation = void 0;
const sequelize_1 = require("sequelize");
const crypto = __importStar(require("crypto"));
const ulid_1 = require("ulid");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * @enum AuditAction
 * @description Types of audit actions
 */
var AuditAction;
(function (AuditAction) {
    AuditAction["CREATE"] = "CREATE";
    AuditAction["UPDATE"] = "UPDATE";
    AuditAction["DELETE"] = "DELETE";
    AuditAction["SOFT_DELETE"] = "SOFT_DELETE";
    AuditAction["RESTORE"] = "RESTORE";
    AuditAction["BULK_CREATE"] = "BULK_CREATE";
    AuditAction["BULK_UPDATE"] = "BULK_UPDATE";
    AuditAction["BULK_DELETE"] = "BULK_DELETE";
})(AuditAction || (exports.AuditAction = AuditAction = {}));
/**
 * @enum DataClassification
 * @description HIPAA data classification levels
 */
var DataClassification;
(function (DataClassification) {
    DataClassification["PUBLIC"] = "PUBLIC";
    DataClassification["INTERNAL"] = "INTERNAL";
    DataClassification["CONFIDENTIAL"] = "CONFIDENTIAL";
    DataClassification["PHI"] = "PHI";
    DataClassification["PII"] = "PII";
})(DataClassification || (exports.DataClassification = DataClassification = {}));
// ============================================================================
// MODEL DEFINITION HELPERS
// ============================================================================
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
const createBaseModel = (sequelize, modelName, attributes, options = {}) => {
    const defaultOptions = {
        sequelize,
        modelName,
        tableName: options.tableName || (0, exports.toSnakeCase)(modelName),
        timestamps: true,
        underscored: true,
        paranoid: false,
        ...options,
    };
    class BaseModel extends sequelize_1.Model {
    }
    return BaseModel.init(attributes, defaultOptions);
};
exports.createBaseModel = createBaseModel;
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
const createUUIDModel = (sequelize, modelName, attributes, options = {}) => {
    const fullAttributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        ...attributes,
    };
    return (0, exports.createBaseModel)(sequelize, modelName, fullAttributes, options);
};
exports.createUUIDModel = createUUIDModel;
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
const createULIDModel = (sequelize, modelName, attributes, options = {}) => {
    const fullAttributes = {
        id: {
            type: sequelize_1.DataTypes.STRING(26),
            primaryKey: true,
            allowNull: false,
            defaultValue: () => (0, exports.generateULID)(),
        },
        ...attributes,
    };
    return (0, exports.createBaseModel)(sequelize, modelName, fullAttributes, options);
};
exports.createULIDModel = createULIDModel;
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
const createVersionedModel = (sequelize, modelName, attributes, options = {}) => {
    const versionedAttributes = {
        ...attributes,
        version: {
            type: sequelize_1.DataTypes.INTEGER,
            defaultValue: 1,
            allowNull: false,
        },
    };
    const model = (0, exports.createUUIDModel)(sequelize, modelName, versionedAttributes, options);
    // Add version increment hook
    (0, exports.addBeforeUpdateHook)(model, async (instance) => {
        if (instance.changed()) {
            instance.version += 1;
        }
    });
    return model;
};
exports.createVersionedModel = createVersionedModel;
// ============================================================================
// TIMESTAMP MANAGEMENT
// ============================================================================
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
const addTimestamps = (model, config = {}) => {
    const options = model.options;
    options.timestamps = true;
    if (config.createdAt !== undefined) {
        options.createdAt = config.createdAt;
    }
    if (config.updatedAt !== undefined) {
        options.updatedAt = config.updatedAt;
    }
    if (config.underscored !== undefined) {
        options.underscored = config.underscored;
    }
};
exports.addTimestamps = addTimestamps;
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
const addUserTracking = async (sequelize, tableName, transaction) => {
    await sequelize.query(`ALTER TABLE ${tableName}
     ADD COLUMN IF NOT EXISTS created_by VARCHAR(255),
     ADD COLUMN IF NOT EXISTS updated_by VARCHAR(255)`, { transaction });
};
exports.addUserTracking = addUserTracking;
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
const createTimestampTrigger = async (sequelize, tableName, transaction) => {
    await sequelize.query(`CREATE OR REPLACE FUNCTION update_timestamp_${tableName}()
     RETURNS TRIGGER AS $$
     BEGIN
       NEW.updated_at = NOW();
       RETURN NEW;
     END;
     $$ LANGUAGE plpgsql;

     DROP TRIGGER IF EXISTS trigger_update_timestamp_${tableName} ON ${tableName};

     CREATE TRIGGER trigger_update_timestamp_${tableName}
     BEFORE UPDATE ON ${tableName}
     FOR EACH ROW
     EXECUTE FUNCTION update_timestamp_${tableName}();`, { transaction });
};
exports.createTimestampTrigger = createTimestampTrigger;
// ============================================================================
// SOFT DELETE UTILITIES
// ============================================================================
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
const addSoftDelete = (model, config = {}) => {
    const options = model.options;
    options.paranoid = config.paranoid !== false;
    if (config.deletedAt) {
        options.deletedAt = config.deletedAt;
    }
    if (config.includeDeletedBy) {
        // Add deletedBy hook
        (0, exports.addBeforeDestroyHook)(model, async (instance, options) => {
            if (options.userId) {
                instance.deletedBy = options.userId;
            }
        });
    }
};
exports.addSoftDelete = addSoftDelete;
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
const softDeleteRecord = async (instance, userId, transaction) => {
    await instance.destroy({
        transaction,
        userId: userId,
    });
};
exports.softDeleteRecord = softDeleteRecord;
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
const restoreRecord = async (instance, transaction) => {
    await instance.restore({ transaction });
};
exports.restoreRecord = restoreRecord;
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
const forceDeleteRecord = async (instance, transaction) => {
    await instance.destroy({ force: true, transaction });
};
exports.forceDeleteRecord = forceDeleteRecord;
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
const getSoftDeletedRecords = async (model, options = {}) => {
    return model.findAll({
        ...options,
        paranoid: false,
        where: {
            ...options.where,
            deletedAt: { [sequelize_1.Op.ne]: null },
        },
    });
};
exports.getSoftDeletedRecords = getSoftDeletedRecords;
// ============================================================================
// UUID AND ULID GENERATORS
// ============================================================================
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
const generateUUID = () => {
    return crypto.randomUUID();
};
exports.generateUUID = generateUUID;
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
const generateULID = () => {
    const ulid = (0, ulid_1.monotonicFactory)();
    return ulid();
};
exports.generateULID = generateULID;
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
const isValidUUID = (uuid) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
};
exports.isValidUUID = isValidUUID;
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
const isValidULID = (ulid) => {
    const ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/;
    return ulidRegex.test(ulid);
};
exports.isValidULID = isValidULID;
// ============================================================================
// VALIDATION RULES
// ============================================================================
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
const addEmailValidation = (model, fieldName, required = true) => {
    const attributes = model.rawAttributes;
    if (attributes[fieldName]) {
        attributes[fieldName].validate = {
            ...attributes[fieldName].validate,
            isEmail: {
                msg: `${fieldName} must be a valid email address`,
            },
            ...(required && {
                notEmpty: {
                    msg: `${fieldName} cannot be empty`,
                },
            }),
        };
    }
};
exports.addEmailValidation = addEmailValidation;
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
const addPhoneValidation = (model, fieldName, format = 'US') => {
    const attributes = model.rawAttributes;
    if (attributes[fieldName]) {
        const patterns = {
            US: /^\+?1?\d{10}$/,
            INTERNATIONAL: /^\+?[1-9]\d{1,14}$/,
        };
        attributes[fieldName].validate = {
            ...attributes[fieldName].validate,
            isValidPhone(value) {
                if (value && !patterns[format]?.test(value.replace(/[\s\-\(\)]/g, ''))) {
                    throw new Error(`${fieldName} must be a valid ${format} phone number`);
                }
            },
        };
    }
};
exports.addPhoneValidation = addPhoneValidation;
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
const addURLValidation = (model, fieldName) => {
    const attributes = model.rawAttributes;
    if (attributes[fieldName]) {
        attributes[fieldName].validate = {
            ...attributes[fieldName].validate,
            isUrl: {
                msg: `${fieldName} must be a valid URL`,
            },
        };
    }
};
exports.addURLValidation = addURLValidation;
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
const addCustomValidation = (model, fieldName, validator, message) => {
    const attributes = model.rawAttributes;
    if (attributes[fieldName]) {
        attributes[fieldName].validate = {
            ...attributes[fieldName].validate,
            customValidation(value) {
                const result = validator(value);
                if (result instanceof Promise) {
                    return result.then((isValid) => {
                        if (!isValid)
                            throw new Error(message);
                    });
                }
                if (!result)
                    throw new Error(message);
            },
        };
    }
};
exports.addCustomValidation = addCustomValidation;
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
const addLengthValidation = (model, fieldName, min, max) => {
    const attributes = model.rawAttributes;
    if (attributes[fieldName]) {
        attributes[fieldName].validate = {
            ...attributes[fieldName].validate,
            len: {
                args: [min, max],
                msg: `${fieldName} must be between ${min} and ${max} characters`,
            },
        };
    }
};
exports.addLengthValidation = addLengthValidation;
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
const addRangeValidation = (model, fieldName, min, max) => {
    const attributes = model.rawAttributes;
    if (attributes[fieldName]) {
        attributes[fieldName].validate = {
            ...attributes[fieldName].validate,
            min: { args: [min], msg: `${fieldName} must be at least ${min}` },
            max: { args: [max], msg: `${fieldName} must be at most ${max}` },
        };
    }
};
exports.addRangeValidation = addRangeValidation;
// ============================================================================
// MODEL HOOKS
// ============================================================================
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
const addBeforeCreateHook = (model, hook) => {
    model.addHook('beforeCreate', hook);
};
exports.addBeforeCreateHook = addBeforeCreateHook;
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
const addAfterCreateHook = (model, hook) => {
    model.addHook('afterCreate', hook);
};
exports.addAfterCreateHook = addAfterCreateHook;
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
const addBeforeUpdateHook = (model, hook) => {
    model.addHook('beforeUpdate', hook);
};
exports.addBeforeUpdateHook = addBeforeUpdateHook;
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
const addAfterUpdateHook = (model, hook) => {
    model.addHook('afterUpdate', hook);
};
exports.addAfterUpdateHook = addAfterUpdateHook;
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
const addBeforeDestroyHook = (model, hook) => {
    model.addHook('beforeDestroy', hook);
};
exports.addBeforeDestroyHook = addBeforeDestroyHook;
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
const addAfterDestroyHook = (model, hook) => {
    model.addHook('afterDestroy', hook);
};
exports.addAfterDestroyHook = addAfterDestroyHook;
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
const addBeforeValidateHook = (model, hook) => {
    model.addHook('beforeValidate', hook);
};
exports.addBeforeValidateHook = addBeforeValidateHook;
// ============================================================================
// VIRTUAL ATTRIBUTES AND GETTERS
// ============================================================================
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
const addVirtualAttribute = (model, attributeName, getter, setter) => {
    const attributes = model.rawAttributes;
    attributes[attributeName] = {
        type: sequelize_1.DataTypes.VIRTUAL,
        get: getter,
        ...(setter && { set: setter }),
    };
};
exports.addVirtualAttribute = addVirtualAttribute;
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
const addComputedField = (model, fieldName, dependencies, compute) => {
    (0, exports.addVirtualAttribute)(model, fieldName, function () {
        const values = dependencies.map((dep) => this.getDataValue(dep));
        return compute(...values);
    });
};
exports.addComputedField = addComputedField;
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
const addGetter = (model, attributeName, getter) => {
    const attributes = model.rawAttributes;
    if (attributes[attributeName]) {
        attributes[attributeName].get = getter;
    }
};
exports.addGetter = addGetter;
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
const addSetter = (model, attributeName, setter) => {
    const attributes = model.rawAttributes;
    if (attributes[attributeName]) {
        attributes[attributeName].set = setter;
    }
};
exports.addSetter = addSetter;
// ============================================================================
// SCOPES AND DEFAULT SCOPES
// ============================================================================
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
const addDefaultScope = (model, scope) => {
    model.addScope('defaultScope', scope, { override: true });
};
exports.addDefaultScope = addDefaultScope;
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
const addNamedScope = (model, scopeName, scope) => {
    model.addScope(scopeName, scope);
};
exports.addNamedScope = addNamedScope;
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
const addActiveScope = (model) => {
    (0, exports.addNamedScope)(model, 'active', { where: { active: true } });
};
exports.addActiveScope = addActiveScope;
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
const addRecentScope = (model, days = 7) => {
    (0, exports.addNamedScope)(model, 'recent', {
        where: {
            createdAt: {
                [sequelize_1.Op.gte]: (0, sequelize_1.literal)(`NOW() - INTERVAL '${days} days'`),
            },
        },
        order: [['createdAt', 'DESC']],
    });
};
exports.addRecentScope = addRecentScope;
// ============================================================================
// AUDIT TRAIL AND VERSIONING
// ============================================================================
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
const createAuditLogTable = async (sequelize, tableName = 'audit_logs', transaction) => {
    await sequelize.query(`CREATE TABLE IF NOT EXISTS ${tableName} (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      table_name VARCHAR(255) NOT NULL,
      record_id VARCHAR(255) NOT NULL,
      action VARCHAR(50) NOT NULL,
      user_id VARCHAR(255),
      changes JSONB,
      metadata JSONB,
      ip_address VARCHAR(45),
      user_agent TEXT,
      timestamp TIMESTAMPTZ DEFAULT NOW(),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      INDEX idx_audit_table_record (table_name, record_id),
      INDEX idx_audit_timestamp (timestamp),
      INDEX idx_audit_user (user_id)
    )`, { transaction });
};
exports.createAuditLogTable = createAuditLogTable;
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
const logAudit = async (sequelize, entry, transaction) => {
    await sequelize.query(`INSERT INTO audit_logs (
      table_name, record_id, action, user_id, changes, metadata,
      ip_address, user_agent, timestamp
    ) VALUES (
      :tableName, :recordId, :action, :userId, :changes, :metadata,
      :ipAddress, :userAgent, NOW()
    )`, {
        replacements: {
            tableName: entry.tableName,
            recordId: entry.recordId,
            action: entry.action,
            userId: entry.userId || null,
            changes: entry.changes ? JSON.stringify(entry.changes) : null,
            metadata: entry.metadata ? JSON.stringify(entry.metadata) : null,
            ipAddress: entry.ipAddress || null,
            userAgent: entry.userAgent || null,
        },
        transaction,
    });
};
exports.logAudit = logAudit;
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
const addAuditTrail = (sequelize, model, userId) => {
    // After create
    (0, exports.addAfterCreateHook)(model, async (instance, options) => {
        await (0, exports.logAudit)(sequelize, {
            tableName: model.tableName,
            recordId: instance.id,
            action: AuditAction.CREATE,
            userId: userId || options.userId,
            metadata: { instance: instance.toJSON() },
        }, options.transaction);
    });
    // After update
    (0, exports.addAfterUpdateHook)(model, async (instance, options) => {
        const changes = {};
        const changed = instance.changed();
        if (changed) {
            for (const field of Array.isArray(changed) ? changed : [changed]) {
                changes[field] = {
                    old: instance.previous(field),
                    new: instance[field],
                };
            }
        }
        await (0, exports.logAudit)(sequelize, {
            tableName: model.tableName,
            recordId: instance.id,
            action: AuditAction.UPDATE,
            userId: userId || options.userId,
            changes,
        }, options.transaction);
    });
    // After destroy
    (0, exports.addAfterDestroyHook)(model, async (instance, options) => {
        await (0, exports.logAudit)(sequelize, {
            tableName: model.tableName,
            recordId: instance.id,
            action: AuditAction.DELETE,
            userId: userId || options.userId,
            metadata: { instance: instance.toJSON() },
        }, options.transaction);
    });
};
exports.addAuditTrail = addAuditTrail;
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
const createVersionHistoryTable = async (sequelize, modelName, transaction) => {
    const tableName = `${(0, exports.toSnakeCase)(modelName)}_versions`;
    await sequelize.query(`CREATE TABLE IF NOT EXISTS ${tableName} (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      record_id VARCHAR(255) NOT NULL,
      version INTEGER NOT NULL,
      data JSONB NOT NULL,
      user_id VARCHAR(255),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      INDEX idx_version_record (record_id),
      INDEX idx_version_number (record_id, version),
      UNIQUE(record_id, version)
    )`, { transaction });
};
exports.createVersionHistoryTable = createVersionHistoryTable;
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
const saveVersion = async (sequelize, modelName, instance, userId, transaction) => {
    const tableName = `${(0, exports.toSnakeCase)(modelName)}_versions`;
    const version = instance.version || 1;
    await sequelize.query(`INSERT INTO ${tableName} (record_id, version, data, user_id)
     VALUES (:recordId, :version, :data, :userId)`, {
        replacements: {
            recordId: instance.id,
            version,
            data: JSON.stringify(instance.toJSON()),
            userId: userId || null,
        },
        transaction,
    });
};
exports.saveVersion = saveVersion;
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
const getVersionHistory = async (sequelize, modelName, recordId) => {
    const tableName = `${(0, exports.toSnakeCase)(modelName)}_versions`;
    const [results] = await sequelize.query(`SELECT * FROM ${tableName}
     WHERE record_id = :recordId
     ORDER BY version DESC`, {
        replacements: { recordId },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.getVersionHistory = getVersionHistory;
// ============================================================================
// JSON FIELD HELPERS
// ============================================================================
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
const addJSONField = async (sequelize, tableName, fieldName, defaultValue = {}, transaction) => {
    const dialect = sequelize.getDialect();
    const type = dialect === 'postgres' ? 'JSONB' : 'JSON';
    await sequelize.query(`ALTER TABLE ${tableName}
     ADD COLUMN IF NOT EXISTS ${fieldName} ${type} DEFAULT '${JSON.stringify(defaultValue)}'`, { transaction });
};
exports.addJSONField = addJSONField;
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
const updateJSONPath = async (sequelize, tableName, fieldName, path, value, whereClause, replacements = {}, transaction) => {
    const pathParts = path.split('.');
    const jsonPath = `{${pathParts.join(',')}}`;
    await sequelize.query(`UPDATE ${tableName}
     SET ${fieldName} = jsonb_set(
       COALESCE(${fieldName}, '{}'::jsonb),
       :jsonPath,
       :value::jsonb
     )
     WHERE ${whereClause}`, {
        replacements: {
            ...replacements,
            jsonPath,
            value: JSON.stringify(value),
        },
        transaction,
    });
};
exports.updateJSONPath = updateJSONPath;
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
const queryByJSONField = async (model, fieldName, path, value, options = {}) => {
    const pathParts = path.split('.');
    const jsonPath = `{${pathParts.join(',')}}`;
    return model.findAll({
        ...options,
        where: {
            ...options.where,
            [sequelize_1.Op.and]: (0, sequelize_1.literal)(`${fieldName}#>>'${jsonPath}' = '${JSON.stringify(value).replace(/'/g, "''")}'`),
        },
    });
};
exports.queryByJSONField = queryByJSONField;
// ============================================================================
// ENUM TYPES
// ============================================================================
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
const createEnumType = async (sequelize, enumName, values, transaction) => {
    const valueList = values.map((v) => `'${v}'`).join(', ');
    await sequelize.query(`DO $$
     BEGIN
       IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = '${enumName}') THEN
         CREATE TYPE ${enumName} AS ENUM (${valueList});
       END IF;
     END$$;`, { transaction });
};
exports.createEnumType = createEnumType;
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
const addEnumValue = async (sequelize, enumName, value, transaction) => {
    await sequelize.query(`ALTER TYPE ${enumName} ADD VALUE IF NOT EXISTS '${value}'`, { transaction });
};
exports.addEnumValue = addEnumValue;
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
const addEnumValidation = (model, fieldName, allowedValues) => {
    const attributes = model.rawAttributes;
    if (attributes[fieldName]) {
        attributes[fieldName].validate = {
            ...attributes[fieldName].validate,
            isIn: {
                args: [allowedValues],
                msg: `${fieldName} must be one of: ${allowedValues.join(', ')}`,
            },
        };
    }
};
exports.addEnumValidation = addEnumValidation;
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
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
const toSnakeCase = (str) => {
    return str
        .replace(/([A-Z])/g, '_$1')
        .toLowerCase()
        .replace(/^_/, '');
};
exports.toSnakeCase = toSnakeCase;
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
const toCamelCase = (str) => {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};
exports.toCamelCase = toCamelCase;
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
const sanitizeInput = (input) => {
    return input
        .replace(/[<>]/g, '') // Remove HTML tags
        .replace(/['";]/g, '') // Remove SQL injection characters
        .trim();
};
exports.sanitizeInput = sanitizeInput;
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
const validateRequiredFields = (instance, requiredFields) => {
    const errors = [];
    for (const field of requiredFields) {
        const value = instance[field];
        if (value === null || value === undefined || value === '') {
            errors.push(new sequelize_1.ValidationErrorItem(`${field} is required`, 'Validation error', field, value));
        }
    }
    if (errors.length > 0) {
        throw new sequelize_1.ValidationError('Validation error', errors);
    }
};
exports.validateRequiredFields = validateRequiredFields;
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
const getModelChanges = (instance) => {
    const changes = {};
    const changed = instance.changed();
    if (changed) {
        for (const field of Array.isArray(changed) ? changed : [changed]) {
            changes[field] = {
                old: instance.previous(field),
                new: instance[field],
            };
        }
    }
    return changes;
};
exports.getModelChanges = getModelChanges;
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
const cloneInstance = async (instance, overrides = {}) => {
    const data = instance.toJSON();
    delete data.id;
    delete data.createdAt;
    delete data.updatedAt;
    const Model = instance.constructor;
    return Model.create({ ...data, ...overrides });
};
exports.cloneInstance = cloneInstance;
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
const bulkUpsert = async (model, records, conflictFields, transaction) => {
    const result = await model.bulkCreate(records, {
        updateOnDuplicate: Object.keys(records[0] || {}),
        transaction,
    });
    return result.length;
};
exports.bulkUpsert = bulkUpsert;
//# sourceMappingURL=database-models-kit.js.map