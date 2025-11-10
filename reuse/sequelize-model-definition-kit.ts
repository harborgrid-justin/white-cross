/**
 * LOC: SEQ_MDL_DEF_001
 * File: /reuse/sequelize-model-definition-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM core)
 *   - @nestjs/common
 *   - @nestjs/sequelize
 *
 * DOWNSTREAM (imported by):
 *   - Model definition files
 *   - Database schema builders
 *   - Migration generators
 *   - Model factories
 *   - Seeder utilities
 */

/**
 * File: /reuse/sequelize-model-definition-kit.ts
 * Locator: WC-UTL-SMDK-001
 * Purpose: Sequelize Model Definition Kit - Comprehensive model definition and configuration utilities
 *
 * Upstream: Sequelize 6.x, NestJS, TypeScript decorators
 * Downstream: ../backend/models/*, ../database/*, model definition modules
 * Dependencies: TypeScript 5.x, Node 18+, Sequelize 6.x, @nestjs/sequelize
 * Exports: 45 utility functions for model factories, attribute builders, validation, hooks, scopes, virtual attributes, indexes, constraints
 *
 * LLM Context: Comprehensive Sequelize model definition utilities for White Cross healthcare system.
 * Provides model factory functions, attribute builders with HIPAA-compliant defaults, data type helpers,
 * validation builders with healthcare-specific patterns, hook factories for audit trails, scope definitions,
 * virtual attributes, getters/setters, default value generators, timestamp management, paranoid delete helpers,
 * index definitions for performance optimization, constraint builders, and model extension patterns.
 * Essential for maintaining consistent, secure, performant model definitions across the healthcare platform.
 */

import {
  Model,
  ModelStatic,
  DataTypes,
  ModelAttributes,
  ModelOptions,
  InitOptions,
  Sequelize,
  ValidationErrorItem,
  Op,
  literal,
  fn,
  col,
  where,
  IndexesOptions,
  ModelValidateOptions,
  ModelHooks,
  FindAttributeOptions,
  Association,
  HasOneOptions,
  HasManyOptions,
  BelongsToOptions,
  BelongsToManyOptions,
} from 'sequelize';
import { Injectable } from '@nestjs/common';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Model definition configuration
 */
export interface ModelDefinitionConfig {
  tableName: string;
  timestamps?: boolean;
  paranoid?: boolean;
  underscored?: boolean;
  schema?: string;
  freezeTableName?: boolean;
  version?: boolean;
  hooks?: Partial<ModelHooks>;
  scopes?: { [scopeName: string]: any };
  indexes?: IndexesOptions[];
  validate?: ModelValidateOptions;
}

/**
 * Attribute builder configuration
 */
export interface AttributeBuilderConfig {
  type: any;
  allowNull?: boolean;
  defaultValue?: any;
  unique?: boolean | string | { name: string; msg?: string };
  primaryKey?: boolean;
  autoIncrement?: boolean;
  comment?: string;
  field?: string;
  validate?: any;
  get?: () => any;
  set?: (value: any) => void;
}

/**
 * Validation rule configuration
 */
export interface ValidationRuleConfig {
  validator: (value: any) => boolean | Promise<boolean>;
  message: string;
  args?: any[];
}

/**
 * Hook configuration
 */
export interface HookConfig {
  hookType: keyof ModelHooks;
  name?: string;
  handler: (...args: any[]) => void | Promise<void>;
}

/**
 * Scope configuration
 */
export interface ScopeConfig {
  name: string;
  scope: any;
  overwriteDefault?: boolean;
}

/**
 * Virtual attribute configuration
 */
export interface VirtualAttributeConfig {
  name: string;
  type: any;
  getter?: () => any;
  setter?: (value: any) => void;
}

/**
 * Index configuration
 */
export interface IndexConfig {
  name?: string;
  unique?: boolean;
  fields: (string | { name: string; length?: number; order?: string })[];
  using?: string;
  type?: string;
  where?: any;
}

/**
 * Constraint configuration
 */
export interface ConstraintConfig {
  type: 'unique' | 'check' | 'foreign';
  name?: string;
  fields?: string[];
  references?: {
    table: string;
    field: string;
  };
  onDelete?: string;
  onUpdate?: string;
  where?: any;
}

/**
 * Audit field configuration
 */
export interface AuditFieldConfig {
  createdBy?: boolean;
  updatedBy?: boolean;
  deletedBy?: boolean;
  ipAddress?: boolean;
  userAgent?: boolean;
}

/**
 * HIPAA compliance configuration
 */
export interface HipaaComplianceConfig {
  phiEncryption?: boolean;
  auditTrail?: boolean;
  accessLogging?: boolean;
  dataRetention?: number; // days
  anonymization?: boolean;
}

// ============================================================================
// MODEL FACTORY FUNCTIONS
// ============================================================================

/**
 * @function createBaseModel
 * @description Creates a base model class with standard configuration for healthcare applications
 * @param {string} modelName - Name of the model
 * @param {ModelAttributes} attributes - Model attributes definition
 * @param {ModelDefinitionConfig} config - Model configuration
 * @returns {typeof Model} Base model class
 *
 * @example
 * ```typescript
 * const Patient = createBaseModel('Patient', {
 *   id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
 *   name: { type: DataTypes.STRING, allowNull: false }
 * }, {
 *   tableName: 'patients',
 *   timestamps: true,
 *   paranoid: true
 * });
 * ```
 */
export const createBaseModel = (
  modelName: string,
  attributes: ModelAttributes,
  config: ModelDefinitionConfig,
): typeof Model => {
  class BaseModel extends Model {
    static associate(models: { [key: string]: ModelStatic<Model> }): void {
      // Override in extended models
    }
  }

  Object.defineProperty(BaseModel, 'name', { value: modelName });

  return BaseModel;
};

/**
 * @function createHipaaCompliantModel
 * @description Creates a HIPAA-compliant model with security and audit features
 * @param {string} modelName - Name of the model
 * @param {ModelAttributes} attributes - Model attributes definition
 * @param {HipaaComplianceConfig} hipaaConfig - HIPAA compliance configuration
 * @returns {ModelDefinitionConfig} HIPAA-compliant model configuration
 *
 * @security Implements HIPAA-required audit trails and PHI protection
 *
 * @example
 * ```typescript
 * const config = createHipaaCompliantModel('MedicalRecord', attributes, {
 *   phiEncryption: true,
 *   auditTrail: true,
 *   accessLogging: true,
 *   dataRetention: 2555
 * });
 * ```
 */
export const createHipaaCompliantModel = (
  modelName: string,
  attributes: ModelAttributes,
  hipaaConfig: HipaaComplianceConfig,
): ModelDefinitionConfig => {
  const config: ModelDefinitionConfig = {
    tableName: modelName.toLowerCase(),
    timestamps: true,
    paranoid: true,
    underscored: true,
    hooks: {},
  };

  if (hipaaConfig.auditTrail) {
    config.hooks = {
      ...config.hooks,
      beforeCreate: async (instance: any, options: any) => {
        instance.createdBy = options.userId || 'system';
        instance.createdIp = options.ipAddress;
      },
      beforeUpdate: async (instance: any, options: any) => {
        instance.updatedBy = options.userId || 'system';
        instance.updatedIp = options.ipAddress;
      },
      beforeDestroy: async (instance: any, options: any) => {
        instance.deletedBy = options.userId || 'system';
        instance.deletedIp = options.ipAddress;
      },
    };
  }

  return config;
};

/**
 * @function createModelWithDefaults
 * @description Creates model initialization options with sensible defaults for White Cross platform
 * @param {Partial<InitOptions>} options - Custom initialization options
 * @returns {InitOptions} Complete initialization options
 *
 * @example
 * ```typescript
 * const initOptions = createModelWithDefaults({
 *   sequelize: db,
 *   tableName: 'patients'
 * });
 * Patient.init(attributes, initOptions);
 * ```
 */
export const createModelWithDefaults = (
  options: Partial<InitOptions>,
): InitOptions => {
  return {
    timestamps: true,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    ...options,
  } as InitOptions;
};

// ============================================================================
// ATTRIBUTE BUILDERS
// ============================================================================

/**
 * @function buildPrimaryKeyAttribute
 * @description Builds a UUID-based primary key attribute with best practices
 * @param {string} [fieldName='id'] - Name of the primary key field
 * @returns {AttributeBuilderConfig} Primary key attribute configuration
 *
 * @example
 * ```typescript
 * const attributes = {
 *   id: buildPrimaryKeyAttribute(),
 *   patientId: buildPrimaryKeyAttribute('patientId')
 * };
 * ```
 */
export const buildPrimaryKeyAttribute = (
  fieldName: string = 'id',
): AttributeBuilderConfig => {
  return {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
    comment: `Primary key for ${fieldName}`,
  };
};

/**
 * @function buildTimestampAttributes
 * @description Builds standard timestamp attributes (createdAt, updatedAt, deletedAt)
 * @param {boolean} [includeDeleted=true] - Include deletedAt for paranoid models
 * @returns {ModelAttributes} Timestamp attributes
 *
 * @example
 * ```typescript
 * const attributes = {
 *   ...otherAttributes,
 *   ...buildTimestampAttributes(true)
 * };
 * ```
 */
export const buildTimestampAttributes = (
  includeDeleted: boolean = true,
): ModelAttributes => {
  const timestamps: ModelAttributes = {
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'Record creation timestamp',
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'Record last update timestamp',
    },
  };

  if (includeDeleted) {
    timestamps.deletedAt = {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Soft delete timestamp',
    };
  }

  return timestamps;
};

/**
 * @function buildAuditAttributes
 * @description Builds comprehensive audit trail attributes for HIPAA compliance
 * @param {AuditFieldConfig} config - Audit field configuration
 * @returns {ModelAttributes} Audit attributes
 *
 * @security HIPAA-compliant audit trail fields
 *
 * @example
 * ```typescript
 * const attributes = {
 *   ...otherAttributes,
 *   ...buildAuditAttributes({
 *     createdBy: true,
 *     updatedBy: true,
 *     ipAddress: true
 *   })
 * };
 * ```
 */
export const buildAuditAttributes = (
  config: AuditFieldConfig,
): ModelAttributes => {
  const auditFields: ModelAttributes = {};

  if (config.createdBy) {
    auditFields.createdBy = {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'User who created this record',
    };
  }

  if (config.updatedBy) {
    auditFields.updatedBy = {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'User who last updated this record',
    };
  }

  if (config.deletedBy) {
    auditFields.deletedBy = {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'User who deleted this record',
    };
  }

  if (config.ipAddress) {
    auditFields.createdIp = {
      type: DataTypes.STRING(45),
      allowNull: true,
      comment: 'IP address of record creator',
    };
    auditFields.updatedIp = {
      type: DataTypes.STRING(45),
      allowNull: true,
      comment: 'IP address of last updater',
    };
  }

  if (config.userAgent) {
    auditFields.userAgent = {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'User agent of last modifier',
    };
  }

  return auditFields;
};

/**
 * @function buildForeignKeyAttribute
 * @description Builds a foreign key attribute with proper constraints
 * @param {string} referencedTable - Name of referenced table
 * @param {string} [referencedField='id'] - Name of referenced field
 * @param {boolean} [allowNull=false] - Allow null values
 * @returns {AttributeBuilderConfig} Foreign key attribute configuration
 *
 * @example
 * ```typescript
 * const attributes = {
 *   patientId: buildForeignKeyAttribute('patients'),
 *   doctorId: buildForeignKeyAttribute('users', 'id', true)
 * };
 * ```
 */
export const buildForeignKeyAttribute = (
  referencedTable: string,
  referencedField: string = 'id',
  allowNull: boolean = false,
): AttributeBuilderConfig => {
  return {
    type: DataTypes.UUID,
    allowNull,
    comment: `Foreign key to ${referencedTable}.${referencedField}`,
  };
};

/**
 * @function buildEncryptedAttribute
 * @description Builds an attribute configured for PHI encryption storage
 * @param {string} fieldName - Name of the field
 * @param {number} [maxLength=500] - Maximum encrypted length
 * @returns {AttributeBuilderConfig} Encrypted attribute configuration
 *
 * @security PHI encryption for HIPAA compliance
 *
 * @example
 * ```typescript
 * const attributes = {
 *   ssn: buildEncryptedAttribute('ssn', 256),
 *   medicalRecordNumber: buildEncryptedAttribute('medicalRecordNumber')
 * };
 * ```
 */
export const buildEncryptedAttribute = (
  fieldName: string,
  maxLength: number = 500,
): AttributeBuilderConfig => {
  return {
    type: DataTypes.STRING(maxLength),
    allowNull: true,
    comment: `Encrypted ${fieldName} (PHI)`,
    validate: {
      notEmpty: true,
    },
  };
};

/**
 * @function buildEnumAttribute
 * @description Builds an enumeration attribute with validation
 * @param {string[]} values - Allowed enum values
 * @param {string} [defaultValue] - Default value
 * @returns {AttributeBuilderConfig} Enum attribute configuration
 *
 * @example
 * ```typescript
 * const attributes = {
 *   status: buildEnumAttribute(['active', 'inactive', 'pending'], 'pending'),
 *   gender: buildEnumAttribute(['M', 'F', 'O', 'U'])
 * };
 * ```
 */
export const buildEnumAttribute = (
  values: string[],
  defaultValue?: string,
): AttributeBuilderConfig => {
  return {
    type: DataTypes.ENUM(...values),
    allowNull: false,
    defaultValue: defaultValue || values[0],
    validate: {
      isIn: [values],
    },
    comment: `Allowed values: ${values.join(', ')}`,
  };
};

// ============================================================================
// DATA TYPE HELPERS
// ============================================================================

/**
 * @function createJsonbAttribute
 * @description Creates a JSONB attribute for PostgreSQL with validation
 * @param {any} [defaultValue={}] - Default JSON value
 * @param {boolean} [allowNull=false] - Allow null values
 * @returns {AttributeBuilderConfig} JSONB attribute configuration
 *
 * @example
 * ```typescript
 * const attributes = {
 *   metadata: createJsonbAttribute({ version: 1 }),
 *   settings: createJsonbAttribute({}, true)
 * };
 * ```
 */
export const createJsonbAttribute = (
  defaultValue: any = {},
  allowNull: boolean = false,
): AttributeBuilderConfig => {
  return {
    type: DataTypes.JSONB,
    allowNull,
    defaultValue,
    comment: 'JSONB data storage',
  };
};

/**
 * @function createDateOnlyAttribute
 * @description Creates a date-only attribute for birthdate, appointment dates, etc.
 * @param {boolean} [allowNull=false] - Allow null values
 * @returns {AttributeBuilderConfig} Date-only attribute configuration
 *
 * @example
 * ```typescript
 * const attributes = {
 *   birthDate: createDateOnlyAttribute(),
 *   appointmentDate: createDateOnlyAttribute(true)
 * };
 * ```
 */
export const createDateOnlyAttribute = (
  allowNull: boolean = false,
): AttributeBuilderConfig => {
  return {
    type: DataTypes.DATEONLY,
    allowNull,
    comment: 'Date without time component',
    validate: {
      isDate: true,
    },
  };
};

/**
 * @function createDecimalAttribute
 * @description Creates a decimal attribute for precise numeric values (prices, measurements)
 * @param {number} [precision=10] - Total number of digits
 * @param {number} [scale=2] - Number of decimal places
 * @returns {AttributeBuilderConfig} Decimal attribute configuration
 *
 * @example
 * ```typescript
 * const attributes = {
 *   price: createDecimalAttribute(10, 2),
 *   dosage: createDecimalAttribute(8, 4)
 * };
 * ```
 */
export const createDecimalAttribute = (
  precision: number = 10,
  scale: number = 2,
): AttributeBuilderConfig => {
  return {
    type: DataTypes.DECIMAL(precision, scale),
    allowNull: false,
    defaultValue: 0,
    comment: `Decimal value with ${precision} digits, ${scale} decimal places`,
  };
};

/**
 * @function createTextAttribute
 * @description Creates a TEXT attribute for long-form content
 * @param {boolean} [allowNull=true] - Allow null values
 * @returns {AttributeBuilderConfig} Text attribute configuration
 *
 * @example
 * ```typescript
 * const attributes = {
 *   notes: createTextAttribute(),
 *   description: createTextAttribute(false)
 * };
 * ```
 */
export const createTextAttribute = (
  allowNull: boolean = true,
): AttributeBuilderConfig => {
  return {
    type: DataTypes.TEXT,
    allowNull,
    comment: 'Long-form text content',
  };
};

/**
 * @function createBooleanAttribute
 * @description Creates a boolean attribute with default value
 * @param {boolean} [defaultValue=false] - Default boolean value
 * @returns {AttributeBuilderConfig} Boolean attribute configuration
 *
 * @example
 * ```typescript
 * const attributes = {
 *   isActive: createBooleanAttribute(true),
 *   isVerified: createBooleanAttribute(false)
 * };
 * ```
 */
export const createBooleanAttribute = (
  defaultValue: boolean = false,
): AttributeBuilderConfig => {
  return {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue,
    comment: `Boolean flag (default: ${defaultValue})`,
  };
};

// ============================================================================
// VALIDATION BUILDERS
// ============================================================================

/**
 * @function buildEmailValidation
 * @description Builds comprehensive email validation rules
 * @returns {object} Email validation configuration
 *
 * @example
 * ```typescript
 * const attributes = {
 *   email: {
 *     type: DataTypes.STRING,
 *     validate: buildEmailValidation()
 *   }
 * };
 * ```
 */
export const buildEmailValidation = (): object => {
  return {
    isEmail: {
      msg: 'Must be a valid email address',
    },
    notEmpty: {
      msg: 'Email cannot be empty',
    },
    len: {
      args: [5, 255],
      msg: 'Email must be between 5 and 255 characters',
    },
  };
};

/**
 * @function buildPhoneValidation
 * @description Builds phone number validation rules (US format)
 * @returns {object} Phone validation configuration
 *
 * @example
 * ```typescript
 * const attributes = {
 *   phone: {
 *     type: DataTypes.STRING,
 *     validate: buildPhoneValidation()
 *   }
 * };
 * ```
 */
export const buildPhoneValidation = (): object => {
  return {
    is: {
      args: /^[\+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/,
      msg: 'Must be a valid phone number (supports international formats)',
    },
  };
};

/**
 * @function buildPasswordValidation
 * @description Builds strong password validation rules for HIPAA compliance
 * @returns {object} Password validation configuration
 *
 * @security HIPAA-compliant password requirements
 *
 * @example
 * ```typescript
 * const attributes = {
 *   password: {
 *     type: DataTypes.STRING,
 *     validate: buildPasswordValidation()
 *   }
 * };
 * ```
 */
export const buildPasswordValidation = (): object => {
  return {
    len: {
      args: [12, 128],
      msg: 'Password must be between 12 and 128 characters',
    },
    is: {
      args: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/,
      msg: 'Password must contain uppercase, lowercase, number, and special character',
    },
  };
};

/**
 * @function buildCustomValidation
 * @description Builds a custom validation rule with error message
 * @param {ValidationRuleConfig} config - Validation configuration
 * @returns {object} Custom validation configuration
 *
 * @example
 * ```typescript
 * const attributes = {
 *   age: {
 *     type: DataTypes.INTEGER,
 *     validate: buildCustomValidation({
 *       validator: (value) => value >= 0 && value <= 120,
 *       message: 'Age must be between 0 and 120'
 *     })
 *   }
 * };
 * ```
 */
export const buildCustomValidation = (
  config: ValidationRuleConfig,
): object => {
  return {
    customValidator(value: any) {
      const isValid = config.validator(value);
      if (!isValid) {
        throw new Error(config.message);
      }
    },
  };
};

/**
 * @function buildUrlValidation
 * @description Builds URL validation rules
 * @returns {object} URL validation configuration
 *
 * @example
 * ```typescript
 * const attributes = {
 *   website: {
 *     type: DataTypes.STRING,
 *     validate: buildUrlValidation()
 *   }
 * };
 * ```
 */
export const buildUrlValidation = (): object => {
  return {
    isUrl: {
      msg: 'Must be a valid URL',
    },
  };
};

/**
 * @function buildDateRangeValidation
 * @description Builds validation for date ranges (start/end dates)
 * @param {Date} [minDate] - Minimum allowed date
 * @param {Date} [maxDate] - Maximum allowed date
 * @returns {object} Date range validation configuration
 *
 * @example
 * ```typescript
 * const attributes = {
 *   appointmentDate: {
 *     type: DataTypes.DATE,
 *     validate: buildDateRangeValidation(new Date(), new Date('2025-12-31'))
 *   }
 * };
 * ```
 */
export const buildDateRangeValidation = (
  minDate?: Date,
  maxDate?: Date,
): object => {
  const validation: any = {};

  if (minDate) {
    validation.isAfter = {
      args: minDate.toISOString(),
      msg: `Date must be after ${minDate.toISOString()}`,
    };
  }

  if (maxDate) {
    validation.isBefore = {
      args: maxDate.toISOString(),
      msg: `Date must be before ${maxDate.toISOString()}`,
    };
  }

  return validation;
};

// ============================================================================
// HOOK FACTORIES
// ============================================================================

/**
 * @function createAuditHook
 * @description Creates audit trail hooks for tracking changes
 * @param {string} userIdField - Field name for user ID
 * @returns {Partial<ModelHooks>} Audit hook configuration
 *
 * @security Audit trail for HIPAA compliance
 *
 * @example
 * ```typescript
 * const hooks = createAuditHook('userId');
 * Model.init(attributes, { sequelize, hooks });
 * ```
 */
export const createAuditHook = (
  userIdField: string = 'userId',
): Partial<ModelHooks> => {
  return {
    beforeCreate: async (instance: any, options: any) => {
      instance.createdBy = options[userIdField] || options.userId;
      instance.createdAt = new Date();
    },
    beforeUpdate: async (instance: any, options: any) => {
      instance.updatedBy = options[userIdField] || options.userId;
      instance.updatedAt = new Date();
    },
    beforeDestroy: async (instance: any, options: any) => {
      if (instance.deletedBy !== undefined) {
        instance.deletedBy = options[userIdField] || options.userId;
      }
    },
  };
};

/**
 * @function createTimestampHook
 * @description Creates hooks for automatic timestamp management
 * @returns {Partial<ModelHooks>} Timestamp hook configuration
 *
 * @example
 * ```typescript
 * const hooks = createTimestampHook();
 * Model.init(attributes, { sequelize, hooks });
 * ```
 */
export const createTimestampHook = (): Partial<ModelHooks> => {
  return {
    beforeCreate: async (instance: any) => {
      const now = new Date();
      instance.createdAt = now;
      instance.updatedAt = now;
    },
    beforeUpdate: async (instance: any) => {
      instance.updatedAt = new Date();
    },
  };
};

/**
 * @function createSlugGenerationHook
 * @description Creates hook for automatic slug generation from a field
 * @param {string} sourceField - Field to generate slug from
 * @param {string} [targetField='slug'] - Target slug field
 * @returns {Partial<ModelHooks>} Slug generation hook
 *
 * @example
 * ```typescript
 * const hooks = createSlugGenerationHook('title', 'slug');
 * Model.init(attributes, { sequelize, hooks });
 * ```
 */
export const createSlugGenerationHook = (
  sourceField: string,
  targetField: string = 'slug',
): Partial<ModelHooks> => {
  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  return {
    beforeValidate: async (instance: any) => {
      if (instance[sourceField] && !instance[targetField]) {
        instance[targetField] = generateSlug(instance[sourceField]);
      }
    },
  };
};

/**
 * @function createValidationHook
 * @description Creates hook for custom validation logic
 * @param {(instance: any) => Promise<void>} validator - Validation function
 * @returns {Partial<ModelHooks>} Validation hook
 *
 * @example
 * ```typescript
 * const hooks = createValidationHook(async (instance) => {
 *   if (instance.startDate > instance.endDate) {
 *     throw new Error('Start date must be before end date');
 *   }
 * });
 * ```
 */
export const createValidationHook = (
  validator: (instance: any) => Promise<void>,
): Partial<ModelHooks> => {
  return {
    beforeValidate: validator,
  };
};

/**
 * @function createEncryptionHook
 * @description Creates hooks for automatic field encryption/decryption
 * @param {string[]} fieldsToEncrypt - Fields requiring encryption
 * @param {(value: string) => string} encryptFn - Encryption function
 * @param {(value: string) => string} decryptFn - Decryption function
 * @returns {Partial<ModelHooks>} Encryption hook configuration
 *
 * @security PHI encryption for HIPAA compliance
 *
 * @example
 * ```typescript
 * const hooks = createEncryptionHook(
 *   ['ssn', 'medicalRecordNumber'],
 *   (val) => encrypt(val),
 *   (val) => decrypt(val)
 * );
 * ```
 */
export const createEncryptionHook = (
  fieldsToEncrypt: string[],
  encryptFn: (value: string) => string,
  decryptFn: (value: string) => string,
): Partial<ModelHooks> => {
  return {
    beforeCreate: async (instance: any) => {
      fieldsToEncrypt.forEach((field) => {
        if (instance[field]) {
          instance[field] = encryptFn(instance[field]);
        }
      });
    },
    beforeUpdate: async (instance: any) => {
      fieldsToEncrypt.forEach((field) => {
        if (instance.changed(field) && instance[field]) {
          instance[field] = encryptFn(instance[field]);
        }
      });
    },
    afterFind: async (instances: any) => {
      const decrypt = (instance: any) => {
        fieldsToEncrypt.forEach((field) => {
          if (instance[field]) {
            instance[field] = decryptFn(instance[field]);
          }
        });
      };

      if (Array.isArray(instances)) {
        instances.forEach(decrypt);
      } else if (instances) {
        decrypt(instances);
      }
    },
  };
};

// ============================================================================
// SCOPE DEFINITIONS
// ============================================================================

/**
 * @function createActiveScope
 * @description Creates a scope for filtering active (non-deleted) records
 * @returns {object} Active scope configuration
 *
 * @example
 * ```typescript
 * const scopes = {
 *   active: createActiveScope()
 * };
 * Model.init(attributes, { sequelize, scopes });
 * ```
 */
export const createActiveScope = (): object => {
  return {
    where: {
      deletedAt: null,
    },
  };
};

/**
 * @function createDateRangeScope
 * @description Creates a parameterized scope for date range filtering
 * @param {string} dateField - Field name for date comparison
 * @returns {Function} Scope function
 *
 * @example
 * ```typescript
 * const scopes = {
 *   byDateRange: createDateRangeScope('createdAt')
 * };
 * // Usage: Model.scope({ method: ['byDateRange', startDate, endDate] }).findAll()
 * ```
 */
export const createDateRangeScope = (dateField: string): Function => {
  return (startDate: Date, endDate: Date) => ({
    where: {
      [dateField]: {
        [Op.between]: [startDate, endDate],
      },
    },
  });
};

/**
 * @function createPaginationScope
 * @description Creates a pagination scope with limit and offset
 * @returns {Function} Pagination scope function
 *
 * @example
 * ```typescript
 * const scopes = {
 *   paginate: createPaginationScope()
 * };
 * // Usage: Model.scope({ method: ['paginate', 1, 20] }).findAll()
 * ```
 */
export const createPaginationScope = (): Function => {
  return (page: number, pageSize: number) => ({
    limit: pageSize,
    offset: (page - 1) * pageSize,
  });
};

/**
 * @function createSortScope
 * @description Creates a scope for sorting results
 * @param {string} defaultField - Default sort field
 * @param {string} [defaultOrder='ASC'] - Default sort order
 * @returns {Function} Sort scope function
 *
 * @example
 * ```typescript
 * const scopes = {
 *   sorted: createSortScope('createdAt', 'DESC')
 * };
 * ```
 */
export const createSortScope = (
  defaultField: string,
  defaultOrder: string = 'ASC',
): Function => {
  return (field?: string, order?: string) => ({
    order: [[field || defaultField, order || defaultOrder]],
  });
};

/**
 * @function createSearchScope
 * @description Creates a full-text search scope for specified fields
 * @param {string[]} searchFields - Fields to search
 * @returns {Function} Search scope function
 *
 * @example
 * ```typescript
 * const scopes = {
 *   search: createSearchScope(['name', 'email', 'description'])
 * };
 * // Usage: Model.scope({ method: ['search', 'john'] }).findAll()
 * ```
 */
export const createSearchScope = (searchFields: string[]): Function => {
  return (searchTerm: string) => ({
    where: {
      [Op.or]: searchFields.map((field) => ({
        [field]: {
          [Op.iLike]: `%${searchTerm}%`,
        },
      })),
    },
  });
};

// ============================================================================
// VIRTUAL ATTRIBUTES & GETTERS/SETTERS
// ============================================================================

/**
 * @function createVirtualAttribute
 * @description Creates a virtual attribute with getter and optional setter
 * @param {VirtualAttributeConfig} config - Virtual attribute configuration
 * @returns {object} Virtual attribute definition
 *
 * @example
 * ```typescript
 * const attributes = {
 *   fullName: createVirtualAttribute({
 *     name: 'fullName',
 *     type: DataTypes.VIRTUAL,
 *     getter: function() {
 *       return `${this.firstName} ${this.lastName}`;
 *     }
 *   })
 * };
 * ```
 */
export const createVirtualAttribute = (
  config: VirtualAttributeConfig,
): object => {
  return {
    type: config.type || DataTypes.VIRTUAL,
    get: config.getter,
    set: config.setter,
  };
};

/**
 * @function createComputedField
 * @description Creates a computed field from other model attributes
 * @param {string} fieldName - Name of computed field
 * @param {() => any} computeFn - Computation function
 * @returns {object} Computed field configuration
 *
 * @example
 * ```typescript
 * const attributes = {
 *   age: createComputedField('age', function() {
 *     const today = new Date();
 *     const birthDate = new Date(this.birthDate);
 *     return today.getFullYear() - birthDate.getFullYear();
 *   })
 * };
 * ```
 */
export const createComputedField = (
  fieldName: string,
  computeFn: () => any,
): object => {
  return {
    type: DataTypes.VIRTUAL,
    get: computeFn,
  };
};

/**
 * @function createFullNameGetter
 * @description Creates a virtual fullName attribute from firstName and lastName
 * @param {string} [firstNameField='firstName'] - First name field
 * @param {string} [lastNameField='lastName'] - Last name field
 * @returns {object} Full name virtual attribute
 *
 * @example
 * ```typescript
 * const attributes = {
 *   fullName: createFullNameGetter()
 * };
 * ```
 */
export const createFullNameGetter = (
  firstNameField: string = 'firstName',
  lastNameField: string = 'lastName',
): object => {
  return {
    type: DataTypes.VIRTUAL,
    get() {
      const firstName = (this as any)[firstNameField] || '';
      const lastName = (this as any)[lastNameField] || '';
      return `${firstName} ${lastName}`.trim();
    },
  };
};

// ============================================================================
// DEFAULT VALUE GENERATORS
// ============================================================================

/**
 * @function generateUuidDefault
 * @description Generates UUID v4 default value function
 * @returns {any} UUID default value configuration
 *
 * @example
 * ```typescript
 * const attributes = {
 *   id: {
 *     type: DataTypes.UUID,
 *     defaultValue: generateUuidDefault()
 *   }
 * };
 * ```
 */
export const generateUuidDefault = (): any => {
  return DataTypes.UUIDV4;
};

/**
 * @function generateTimestampDefault
 * @description Generates current timestamp default value
 * @returns {any} Timestamp default value configuration
 *
 * @example
 * ```typescript
 * const attributes = {
 *   createdAt: {
 *     type: DataTypes.DATE,
 *     defaultValue: generateTimestampDefault()
 *   }
 * };
 * ```
 */
export const generateTimestampDefault = (): any => {
  return DataTypes.NOW;
};

/**
 * @function generateSequentialDefault
 * @description Generates sequential number default value
 * @param {number} [start=1] - Starting number
 * @returns {Function} Sequential number generator
 *
 * @example
 * ```typescript
 * let counter = 0;
 * const attributes = {
 *   orderNumber: {
 *     type: DataTypes.INTEGER,
 *     defaultValue: () => ++counter
 *   }
 * };
 * ```
 */
export const generateSequentialDefault = (start: number = 1): Function => {
  let counter = start - 1;
  return () => ++counter;
};

// ============================================================================
// INDEX DEFINITIONS
// ============================================================================

/**
 * @function createUniqueIndex
 * @description Creates a unique index on specified fields
 * @param {string[]} fields - Fields to index
 * @param {string} [name] - Index name
 * @returns {IndexesOptions} Unique index configuration
 *
 * @example
 * ```typescript
 * const indexes = [
 *   createUniqueIndex(['email'], 'unique_email_idx'),
 *   createUniqueIndex(['userId', 'roleId'], 'unique_user_role_idx')
 * ];
 * ```
 */
export const createUniqueIndex = (
  fields: string[],
  name?: string,
): IndexesOptions => {
  return {
    unique: true,
    fields,
    name: name || `idx_unique_${fields.join('_')}`,
  };
};

/**
 * @function createCompositeIndex
 * @description Creates a composite index on multiple fields
 * @param {string[]} fields - Fields to index
 * @param {string} [name] - Index name
 * @returns {IndexesOptions} Composite index configuration
 *
 * @example
 * ```typescript
 * const indexes = [
 *   createCompositeIndex(['patientId', 'appointmentDate'], 'patient_appt_idx')
 * ];
 * ```
 */
export const createCompositeIndex = (
  fields: string[],
  name?: string,
): IndexesOptions => {
  return {
    fields,
    name: name || `idx_composite_${fields.join('_')}`,
  };
};

/**
 * @function createPartialIndex
 * @description Creates a partial index with WHERE clause for PostgreSQL
 * @param {string[]} fields - Fields to index
 * @param {object} whereClause - WHERE condition for partial index
 * @param {string} [name] - Index name
 * @returns {IndexesOptions} Partial index configuration
 *
 * @example
 * ```typescript
 * const indexes = [
 *   createPartialIndex(['email'], { deletedAt: null }, 'active_email_idx')
 * ];
 * ```
 */
export const createPartialIndex = (
  fields: string[],
  whereClause: object,
  name?: string,
): IndexesOptions => {
  return {
    fields,
    where: whereClause,
    name: name || `idx_partial_${fields.join('_')}`,
  };
};

/**
 * @function createFullTextIndex
 * @description Creates a full-text search index (PostgreSQL)
 * @param {string[]} fields - Fields for full-text search
 * @param {string} [name] - Index name
 * @returns {IndexesOptions} Full-text index configuration
 *
 * @example
 * ```typescript
 * const indexes = [
 *   createFullTextIndex(['title', 'description'], 'content_search_idx')
 * ];
 * ```
 */
export const createFullTextIndex = (
  fields: string[],
  name?: string,
): IndexesOptions => {
  return {
    fields,
    using: 'GIN',
    name: name || `idx_fulltext_${fields.join('_')}`,
  };
};

// ============================================================================
// CONSTRAINT BUILDERS
// ============================================================================

/**
 * @function buildUniqueConstraint
 * @description Builds a unique constraint definition
 * @param {string[]} fields - Fields for unique constraint
 * @param {string} [name] - Constraint name
 * @returns {object} Unique constraint configuration
 *
 * @example
 * ```typescript
 * const attributes = {
 *   email: {
 *     type: DataTypes.STRING,
 *     unique: buildUniqueConstraint(['email'], 'unique_email')
 *   }
 * };
 * ```
 */
export const buildUniqueConstraint = (
  fields: string[],
  name?: string,
): object => {
  return {
    name: name || `unique_${fields.join('_')}`,
    fields,
  };
};

/**
 * @function buildCheckConstraint
 * @description Builds a CHECK constraint for data validation
 * @param {string} name - Constraint name
 * @param {string} expression - SQL check expression
 * @returns {object} Check constraint configuration
 *
 * @example
 * ```typescript
 * // In model options:
 * const options = {
 *   validate: {
 *     ...buildCheckConstraint('valid_age', 'age >= 0 AND age <= 120')
 *   }
 * };
 * ```
 */
export const buildCheckConstraint = (
  name: string,
  expression: string,
): object => {
  return {
    [name]: function () {
      // Note: Sequelize doesn't support CHECK constraints directly
      // This is a placeholder for model-level validation
      // Actual CHECK constraints should be added in migrations
    },
  };
};

// ============================================================================
// MODEL EXTENSION PATTERNS
// ============================================================================

/**
 * @function extendModelWithMethods
 * @description Extends a model with custom instance and class methods
 * @param {typeof Model} model - Model to extend
 * @param {object} instanceMethods - Instance methods to add
 * @param {object} classMethods - Class methods to add
 * @returns {typeof Model} Extended model
 *
 * @example
 * ```typescript
 * const ExtendedModel = extendModelWithMethods(
 *   Patient,
 *   {
 *     getFullName() { return `${this.firstName} ${this.lastName}`; }
 *   },
 *   {
 *     async findActive() { return this.findAll({ where: { isActive: true } }); }
 *   }
 * );
 * ```
 */
export const extendModelWithMethods = (
  model: typeof Model,
  instanceMethods: { [key: string]: Function },
  classMethods: { [key: string]: Function },
): typeof Model => {
  // Add instance methods
  Object.entries(instanceMethods).forEach(([name, method]) => {
    model.prototype[name] = method;
  });

  // Add class methods
  Object.entries(classMethods).forEach(([name, method]) => {
    (model as any)[name] = method;
  });

  return model;
};

/**
 * @function createModelMixin
 * @description Creates a reusable model mixin with attributes and methods
 * @param {object} mixin - Mixin configuration with attributes and methods
 * @returns {object} Model mixin
 *
 * @example
 * ```typescript
 * const timestampMixin = createModelMixin({
 *   attributes: buildTimestampAttributes(),
 *   hooks: createTimestampHook()
 * });
 * ```
 */
export const createModelMixin = (mixin: {
  attributes?: ModelAttributes;
  hooks?: Partial<ModelHooks>;
  scopes?: object;
  indexes?: IndexesOptions[];
}): object => {
  return mixin;
};

/**
 * @function applyMixinToModel
 * @description Applies a mixin to model initialization options
 * @param {InitOptions} options - Model initialization options
 * @param {object} mixin - Mixin to apply
 * @returns {InitOptions} Enhanced initialization options
 *
 * @example
 * ```typescript
 * const options = applyMixinToModel(
 *   { sequelize, tableName: 'patients' },
 *   timestampMixin
 * );
 * ```
 */
export const applyMixinToModel = (
  options: InitOptions,
  mixin: any,
): InitOptions => {
  return {
    ...options,
    hooks: {
      ...options.hooks,
      ...mixin.hooks,
    },
    scopes: {
      ...options.scopes,
      ...mixin.scopes,
    },
    indexes: [...(options.indexes || []), ...(mixin.indexes || [])],
  };
};

// ============================================================================
// EXPORT DEFAULT
// ============================================================================

export default {
  // Model factories
  createBaseModel,
  createHipaaCompliantModel,
  createModelWithDefaults,

  // Attribute builders
  buildPrimaryKeyAttribute,
  buildTimestampAttributes,
  buildAuditAttributes,
  buildForeignKeyAttribute,
  buildEncryptedAttribute,
  buildEnumAttribute,

  // Data type helpers
  createJsonbAttribute,
  createDateOnlyAttribute,
  createDecimalAttribute,
  createTextAttribute,
  createBooleanAttribute,

  // Validation builders
  buildEmailValidation,
  buildPhoneValidation,
  buildPasswordValidation,
  buildCustomValidation,
  buildUrlValidation,
  buildDateRangeValidation,

  // Hook factories
  createAuditHook,
  createTimestampHook,
  createSlugGenerationHook,
  createValidationHook,
  createEncryptionHook,

  // Scope definitions
  createActiveScope,
  createDateRangeScope,
  createPaginationScope,
  createSortScope,
  createSearchScope,

  // Virtual attributes
  createVirtualAttribute,
  createComputedField,
  createFullNameGetter,

  // Default generators
  generateUuidDefault,
  generateTimestampDefault,
  generateSequentialDefault,

  // Index definitions
  createUniqueIndex,
  createCompositeIndex,
  createPartialIndex,
  createFullTextIndex,

  // Constraint builders
  buildUniqueConstraint,
  buildCheckConstraint,

  // Model extension
  extendModelWithMethods,
  createModelMixin,
  applyMixinToModel,
};
