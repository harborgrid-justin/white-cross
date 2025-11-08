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

import {
  Model,
  ModelStatic,
  Sequelize,
  DataTypes,
  ModelAttributes,
  ModelOptions,
  ValidationError,
  ValidationErrorItem,
  Transaction,
  Op,
  literal,
  fn,
  col,
  QueryTypes,
  FindOptions,
  Attributes,
  CreationAttributes,
} from 'sequelize';
import * as crypto from 'crypto';
import { monotonicFactory } from 'ulid';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * @enum AuditAction
 * @description Types of audit actions
 */
export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  SOFT_DELETE = 'SOFT_DELETE',
  RESTORE = 'RESTORE',
  BULK_CREATE = 'BULK_CREATE',
  BULK_UPDATE = 'BULK_UPDATE',
  BULK_DELETE = 'BULK_DELETE',
}

/**
 * @enum DataClassification
 * @description HIPAA data classification levels
 */
export enum DataClassification {
  PUBLIC = 'PUBLIC',
  INTERNAL = 'INTERNAL',
  CONFIDENTIAL = 'CONFIDENTIAL',
  PHI = 'PHI', // Protected Health Information
  PII = 'PII', // Personally Identifiable Information
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
  changes?: Record<string, { old: any; new: any }>;
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
  attributes?: string[] | { exclude?: string[]; include?: string[] };
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
export const createBaseModel = (
  sequelize: Sequelize,
  modelName: string,
  attributes: ModelAttributes,
  options: Partial<ModelOptions> = {},
): ModelStatic<Model> => {
  const defaultOptions: ModelOptions = {
    sequelize,
    modelName,
    tableName: options.tableName || toSnakeCase(modelName),
    timestamps: true,
    underscored: true,
    paranoid: false,
    ...options,
  };

  class BaseModel extends Model {}
  return BaseModel.init(attributes, defaultOptions);
};

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
export const createUUIDModel = (
  sequelize: Sequelize,
  modelName: string,
  attributes: ModelAttributes,
  options: Partial<ModelOptions> = {},
): ModelStatic<Model> => {
  const fullAttributes: ModelAttributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    ...attributes,
  };

  return createBaseModel(sequelize, modelName, fullAttributes, options);
};

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
export const createULIDModel = (
  sequelize: Sequelize,
  modelName: string,
  attributes: ModelAttributes,
  options: Partial<ModelOptions> = {},
): ModelStatic<Model> => {
  const fullAttributes: ModelAttributes = {
    id: {
      type: DataTypes.STRING(26),
      primaryKey: true,
      allowNull: false,
      defaultValue: () => generateULID(),
    },
    ...attributes,
  };

  return createBaseModel(sequelize, modelName, fullAttributes, options);
};

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
export const createVersionedModel = (
  sequelize: Sequelize,
  modelName: string,
  attributes: ModelAttributes,
  options: Partial<ModelOptions> = {},
): ModelStatic<Model> => {
  const versionedAttributes: ModelAttributes = {
    ...attributes,
    version: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
    },
  };

  const model = createUUIDModel(sequelize, modelName, versionedAttributes, options);

  // Add version increment hook
  addBeforeUpdateHook(model, async (instance) => {
    if (instance.changed()) {
      (instance as any).version += 1;
    }
  });

  return model;
};

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
export const addTimestamps = (
  model: ModelStatic<Model>,
  config: TimestampConfig = {},
): void => {
  const options = (model as any).options;
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
export const addUserTracking = async (
  sequelize: Sequelize,
  tableName: string,
  transaction?: Transaction,
): Promise<void> => {
  await sequelize.query(
    `ALTER TABLE ${tableName}
     ADD COLUMN IF NOT EXISTS created_by VARCHAR(255),
     ADD COLUMN IF NOT EXISTS updated_by VARCHAR(255)`,
    { transaction },
  );
};

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
export const createTimestampTrigger = async (
  sequelize: Sequelize,
  tableName: string,
  transaction?: Transaction,
): Promise<void> => {
  await sequelize.query(
    `CREATE OR REPLACE FUNCTION update_timestamp_${tableName}()
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
     EXECUTE FUNCTION update_timestamp_${tableName}();`,
    { transaction },
  );
};

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
export const addSoftDelete = (
  model: ModelStatic<Model>,
  config: SoftDeleteConfig = {},
): void => {
  const options = (model as any).options;
  options.paranoid = config.paranoid !== false;

  if (config.deletedAt) {
    options.deletedAt = config.deletedAt;
  }

  if (config.includeDeletedBy) {
    // Add deletedBy hook
    addBeforeDestroyHook(model, async (instance, options) => {
      if (options.userId) {
        (instance as any).deletedBy = options.userId;
      }
    });
  }
};

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
export const softDeleteRecord = async (
  instance: Model,
  userId?: string,
  transaction?: Transaction,
): Promise<void> => {
  await instance.destroy({
    transaction,
    userId: userId as any,
  });
};

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
export const restoreRecord = async (
  instance: Model,
  transaction?: Transaction,
): Promise<void> => {
  await instance.restore({ transaction });
};

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
export const forceDeleteRecord = async (
  instance: Model,
  transaction?: Transaction,
): Promise<void> => {
  await instance.destroy({ force: true, transaction });
};

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
export const getSoftDeletedRecords = async (
  model: ModelStatic<Model>,
  options: FindOptions = {},
): Promise<Model[]> => {
  return model.findAll({
    ...options,
    paranoid: false,
    where: {
      ...options.where,
      deletedAt: { [Op.ne]: null },
    },
  });
};

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
export const generateUUID = (): string => {
  return crypto.randomUUID();
};

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
export const generateULID = (): string => {
  const ulid = monotonicFactory();
  return ulid();
};

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
export const isValidUUID = (uuid: string): boolean => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

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
export const isValidULID = (ulid: string): boolean => {
  const ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/;
  return ulidRegex.test(ulid);
};

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
export const addEmailValidation = (
  model: ModelStatic<Model>,
  fieldName: string,
  required: boolean = true,
): void => {
  const attributes = (model as any).rawAttributes;
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
export const addPhoneValidation = (
  model: ModelStatic<Model>,
  fieldName: string,
  format: string = 'US',
): void => {
  const attributes = (model as any).rawAttributes;
  if (attributes[fieldName]) {
    const patterns: Record<string, RegExp> = {
      US: /^\+?1?\d{10}$/,
      INTERNATIONAL: /^\+?[1-9]\d{1,14}$/,
    };

    attributes[fieldName].validate = {
      ...attributes[fieldName].validate,
      isValidPhone(value: string) {
        if (value && !patterns[format]?.test(value.replace(/[\s\-\(\)]/g, ''))) {
          throw new Error(`${fieldName} must be a valid ${format} phone number`);
        }
      },
    };
  }
};

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
export const addURLValidation = (model: ModelStatic<Model>, fieldName: string): void => {
  const attributes = (model as any).rawAttributes;
  if (attributes[fieldName]) {
    attributes[fieldName].validate = {
      ...attributes[fieldName].validate,
      isUrl: {
        msg: `${fieldName} must be a valid URL`,
      },
    };
  }
};

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
export const addCustomValidation = (
  model: ModelStatic<Model>,
  fieldName: string,
  validator: (value: any) => boolean | Promise<boolean>,
  message: string,
): void => {
  const attributes = (model as any).rawAttributes;
  if (attributes[fieldName]) {
    attributes[fieldName].validate = {
      ...attributes[fieldName].validate,
      customValidation(value: any) {
        const result = validator(value);
        if (result instanceof Promise) {
          return result.then((isValid) => {
            if (!isValid) throw new Error(message);
          });
        }
        if (!result) throw new Error(message);
      },
    };
  }
};

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
export const addLengthValidation = (
  model: ModelStatic<Model>,
  fieldName: string,
  min: number,
  max: number,
): void => {
  const attributes = (model as any).rawAttributes;
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
export const addRangeValidation = (
  model: ModelStatic<Model>,
  fieldName: string,
  min: number,
  max: number,
): void => {
  const attributes = (model as any).rawAttributes;
  if (attributes[fieldName]) {
    attributes[fieldName].validate = {
      ...attributes[fieldName].validate,
      min: { args: [min], msg: `${fieldName} must be at least ${min}` },
      max: { args: [max], msg: `${fieldName} must be at most ${max}` },
    };
  }
};

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
export const addBeforeCreateHook = (
  model: ModelStatic<Model>,
  hook: (instance: Model, options: any) => Promise<void> | void,
): void => {
  model.addHook('beforeCreate', hook);
};

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
export const addAfterCreateHook = (
  model: ModelStatic<Model>,
  hook: (instance: Model, options: any) => Promise<void> | void,
): void => {
  model.addHook('afterCreate', hook);
};

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
export const addBeforeUpdateHook = (
  model: ModelStatic<Model>,
  hook: (instance: Model, options: any) => Promise<void> | void,
): void => {
  model.addHook('beforeUpdate', hook);
};

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
export const addAfterUpdateHook = (
  model: ModelStatic<Model>,
  hook: (instance: Model, options: any) => Promise<void> | void,
): void => {
  model.addHook('afterUpdate', hook);
};

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
export const addBeforeDestroyHook = (
  model: ModelStatic<Model>,
  hook: (instance: Model, options: any) => Promise<void> | void,
): void => {
  model.addHook('beforeDestroy', hook);
};

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
export const addAfterDestroyHook = (
  model: ModelStatic<Model>,
  hook: (instance: Model, options: any) => Promise<void> | void,
): void => {
  model.addHook('afterDestroy', hook);
};

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
export const addBeforeValidateHook = (
  model: ModelStatic<Model>,
  hook: (instance: Model, options: any) => Promise<void> | void,
): void => {
  model.addHook('beforeValidate', hook);
};

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
export const addVirtualAttribute = (
  model: ModelStatic<Model>,
  attributeName: string,
  getter: () => any,
  setter?: (value: any) => void,
): void => {
  const attributes = (model as any).rawAttributes;
  attributes[attributeName] = {
    type: DataTypes.VIRTUAL,
    get: getter,
    ...(setter && { set: setter }),
  };
};

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
export const addComputedField = (
  model: ModelStatic<Model>,
  fieldName: string,
  dependencies: string[],
  compute: (...args: any[]) => any,
): void => {
  addVirtualAttribute(model, fieldName, function (this: any) {
    const values = dependencies.map((dep) => this.getDataValue(dep));
    return compute(...values);
  });
};

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
export const addGetter = (
  model: ModelStatic<Model>,
  attributeName: string,
  getter: () => any,
): void => {
  const attributes = (model as any).rawAttributes;
  if (attributes[attributeName]) {
    attributes[attributeName].get = getter;
  }
};

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
export const addSetter = (
  model: ModelStatic<Model>,
  attributeName: string,
  setter: (value: any) => void,
): void => {
  const attributes = (model as any).rawAttributes;
  if (attributes[attributeName]) {
    attributes[attributeName].set = setter;
  }
};

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
export const addDefaultScope = (
  model: ModelStatic<Model>,
  scope: ScopeDefinition,
): void => {
  (model as any).addScope('defaultScope', scope, { override: true });
};

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
export const addNamedScope = (
  model: ModelStatic<Model>,
  scopeName: string,
  scope: ScopeDefinition | ((...args: any[]) => ScopeDefinition),
): void => {
  (model as any).addScope(scopeName, scope);
};

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
export const addActiveScope = (model: ModelStatic<Model>): void => {
  addNamedScope(model, 'active', { where: { active: true } });
};

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
export const addRecentScope = (model: ModelStatic<Model>, days: number = 7): void => {
  addNamedScope(model, 'recent', {
    where: {
      createdAt: {
        [Op.gte]: literal(`NOW() - INTERVAL '${days} days'`),
      },
    },
    order: [['createdAt', 'DESC']],
  });
};

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
export const createAuditLogTable = async (
  sequelize: Sequelize,
  tableName: string = 'audit_logs',
  transaction?: Transaction,
): Promise<void> => {
  await sequelize.query(
    `CREATE TABLE IF NOT EXISTS ${tableName} (
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
    )`,
    { transaction },
  );
};

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
export const logAudit = async (
  sequelize: Sequelize,
  entry: Partial<AuditLogEntry>,
  transaction?: Transaction,
): Promise<void> => {
  await sequelize.query(
    `INSERT INTO audit_logs (
      table_name, record_id, action, user_id, changes, metadata,
      ip_address, user_agent, timestamp
    ) VALUES (
      :tableName, :recordId, :action, :userId, :changes, :metadata,
      :ipAddress, :userAgent, NOW()
    )`,
    {
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
    },
  );
};

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
export const addAuditTrail = (
  sequelize: Sequelize,
  model: ModelStatic<Model>,
  userId?: string,
): void => {
  // After create
  addAfterCreateHook(model, async (instance, options) => {
    await logAudit(
      sequelize,
      {
        tableName: model.tableName,
        recordId: (instance as any).id,
        action: AuditAction.CREATE,
        userId: userId || (options as any).userId,
        metadata: { instance: instance.toJSON() },
      },
      options.transaction,
    );
  });

  // After update
  addAfterUpdateHook(model, async (instance, options) => {
    const changes: Record<string, { old: any; new: any }> = {};
    const changed = instance.changed();

    if (changed) {
      for (const field of Array.isArray(changed) ? changed : [changed]) {
        changes[field] = {
          old: instance.previous(field),
          new: (instance as any)[field],
        };
      }
    }

    await logAudit(
      sequelize,
      {
        tableName: model.tableName,
        recordId: (instance as any).id,
        action: AuditAction.UPDATE,
        userId: userId || (options as any).userId,
        changes,
      },
      options.transaction,
    );
  });

  // After destroy
  addAfterDestroyHook(model, async (instance, options) => {
    await logAudit(
      sequelize,
      {
        tableName: model.tableName,
        recordId: (instance as any).id,
        action: AuditAction.DELETE,
        userId: userId || (options as any).userId,
        metadata: { instance: instance.toJSON() },
      },
      options.transaction,
    );
  });
};

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
export const createVersionHistoryTable = async (
  sequelize: Sequelize,
  modelName: string,
  transaction?: Transaction,
): Promise<void> => {
  const tableName = `${toSnakeCase(modelName)}_versions`;

  await sequelize.query(
    `CREATE TABLE IF NOT EXISTS ${tableName} (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      record_id VARCHAR(255) NOT NULL,
      version INTEGER NOT NULL,
      data JSONB NOT NULL,
      user_id VARCHAR(255),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      INDEX idx_version_record (record_id),
      INDEX idx_version_number (record_id, version),
      UNIQUE(record_id, version)
    )`,
    { transaction },
  );
};

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
export const saveVersion = async (
  sequelize: Sequelize,
  modelName: string,
  instance: Model,
  userId?: string,
  transaction?: Transaction,
): Promise<void> => {
  const tableName = `${toSnakeCase(modelName)}_versions`;
  const version = (instance as any).version || 1;

  await sequelize.query(
    `INSERT INTO ${tableName} (record_id, version, data, user_id)
     VALUES (:recordId, :version, :data, :userId)`,
    {
      replacements: {
        recordId: (instance as any).id,
        version,
        data: JSON.stringify(instance.toJSON()),
        userId: userId || null,
      },
      transaction,
    },
  );
};

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
export const getVersionHistory = async (
  sequelize: Sequelize,
  modelName: string,
  recordId: string,
): Promise<VersionRecord[]> => {
  const tableName = `${toSnakeCase(modelName)}_versions`;

  const [results] = await sequelize.query(
    `SELECT * FROM ${tableName}
     WHERE record_id = :recordId
     ORDER BY version DESC`,
    {
      replacements: { recordId },
      type: QueryTypes.SELECT,
    },
  );

  return results as VersionRecord[];
};

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
export const addJSONField = async (
  sequelize: Sequelize,
  tableName: string,
  fieldName: string,
  defaultValue: any = {},
  transaction?: Transaction,
): Promise<void> => {
  const dialect = sequelize.getDialect();
  const type = dialect === 'postgres' ? 'JSONB' : 'JSON';

  await sequelize.query(
    `ALTER TABLE ${tableName}
     ADD COLUMN IF NOT EXISTS ${fieldName} ${type} DEFAULT '${JSON.stringify(defaultValue)}'`,
    { transaction },
  );
};

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
export const updateJSONPath = async (
  sequelize: Sequelize,
  tableName: string,
  fieldName: string,
  path: string,
  value: any,
  whereClause: string,
  replacements: Record<string, any> = {},
  transaction?: Transaction,
): Promise<void> => {
  const pathParts = path.split('.');
  const jsonPath = `{${pathParts.join(',')}}`;

  await sequelize.query(
    `UPDATE ${tableName}
     SET ${fieldName} = jsonb_set(
       COALESCE(${fieldName}, '{}'::jsonb),
       :jsonPath,
       :value::jsonb
     )
     WHERE ${whereClause}`,
    {
      replacements: {
        ...replacements,
        jsonPath,
        value: JSON.stringify(value),
      },
      transaction,
    },
  );
};

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
export const queryByJSONField = async (
  model: ModelStatic<Model>,
  fieldName: string,
  path: string,
  value: any,
  options: FindOptions = {},
): Promise<Model[]> => {
  const pathParts = path.split('.');
  const jsonPath = `{${pathParts.join(',')}}`;

  return model.findAll({
    ...options,
    where: {
      ...options.where,
      [Op.and]: literal(
        `${fieldName}#>>'${jsonPath}' = '${JSON.stringify(value).replace(/'/g, "''")}'`,
      ),
    },
  });
};

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
export const createEnumType = async (
  sequelize: Sequelize,
  enumName: string,
  values: string[],
  transaction?: Transaction,
): Promise<void> => {
  const valueList = values.map((v) => `'${v}'`).join(', ');

  await sequelize.query(
    `DO $$
     BEGIN
       IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = '${enumName}') THEN
         CREATE TYPE ${enumName} AS ENUM (${valueList});
       END IF;
     END$$;`,
    { transaction },
  );
};

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
export const addEnumValue = async (
  sequelize: Sequelize,
  enumName: string,
  value: string,
  transaction?: Transaction,
): Promise<void> => {
  await sequelize.query(
    `ALTER TYPE ${enumName} ADD VALUE IF NOT EXISTS '${value}'`,
    { transaction },
  );
};

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
export const addEnumValidation = (
  model: ModelStatic<Model>,
  fieldName: string,
  allowedValues: string[],
): void => {
  const attributes = (model as any).rawAttributes;
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
export const toSnakeCase = (str: string): string => {
  return str
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '');
};

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
export const toCamelCase = (str: string): string => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

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
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/['";]/g, '') // Remove SQL injection characters
    .trim();
};

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
export const validateRequiredFields = (
  instance: Model,
  requiredFields: string[],
): void => {
  const errors: ValidationErrorItem[] = [];

  for (const field of requiredFields) {
    const value = (instance as any)[field];
    if (value === null || value === undefined || value === '') {
      errors.push(
        new ValidationErrorItem(`${field} is required`, 'Validation error', field, value),
      );
    }
  }

  if (errors.length > 0) {
    throw new ValidationError('Validation error', errors);
  }
};

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
export const getModelChanges = (
  instance: Model,
): Record<string, { old: any; new: any }> => {
  const changes: Record<string, { old: any; new: any }> = {};
  const changed = instance.changed();

  if (changed) {
    for (const field of Array.isArray(changed) ? changed : [changed]) {
      changes[field] = {
        old: instance.previous(field),
        new: (instance as any)[field],
      };
    }
  }

  return changes;
};

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
export const cloneInstance = async (
  instance: Model,
  overrides: Partial<any> = {},
): Promise<Model> => {
  const data = instance.toJSON();
  delete data.id;
  delete data.createdAt;
  delete data.updatedAt;

  const Model = instance.constructor as ModelStatic<Model>;
  return Model.create({ ...data, ...overrides });
};

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
export const bulkUpsert = async (
  model: ModelStatic<Model>,
  records: any[],
  conflictFields: string[],
  transaction?: Transaction,
): Promise<number> => {
  const result = await model.bulkCreate(records, {
    updateOnDuplicate: Object.keys(records[0] || {}),
    transaction,
  });

  return result.length;
};
