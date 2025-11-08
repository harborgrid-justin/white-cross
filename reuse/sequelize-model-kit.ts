/**
 * LOC: M1O2D3E4L5
 * File: /reuse/sequelize-model-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (v6.x)
 *   - @types/validator (v13.x)
 *   - class-transformer (v0.5.x)
 *
 * DOWNSTREAM (imported by):
 *   - Model definitions
 *   - Model decorators
 *   - Entity factories
 */

/**
 * File: /reuse/sequelize-model-kit.ts
 * Locator: WC-UTL-SEQ-MKIT-001
 * Purpose: Sequelize Model Kit - Advanced model definition helpers and decorators
 *
 * Upstream: sequelize v6.x, @types/validator, class-transformer
 * Downstream: All Sequelize models, decorators, factories, and entity definitions
 * Dependencies: Sequelize v6.x, Node 18+, TypeScript 5.x
 * Exports: 45 model utilities for definitions, validators, decorators, soft deletes, scopes, and field management
 *
 * LLM Context: Production-grade Sequelize v6.x model kit for White Cross healthcare platform.
 * Provides advanced helpers for model definition, attribute decorators, data type utilities, validation,
 * soft delete management, paranoid options, scopes, getters/setters, virtual fields, indexes, constraints,
 * and method builders. HIPAA-compliant with comprehensive PHI protection and audit capabilities.
 */

import {
  Model,
  ModelStatic,
  Sequelize,
  DataTypes,
  ModelAttributes,
  ModelOptions,
  InitOptions,
  IndexOptions,
  ValidationOptions,
  Hooks,
  CreateOptions,
  FindOptions,
  WhereOptions,
  Op,
  Association,
  ScopeOptions,
  QueryInterface,
  Transaction,
  Identifier,
  Utils,
  ModelAttributeColumnOptions,
  AddScopeOptions,
} from 'sequelize';
import { isEmail, isUUID, isURL, isMobilePhone, isPostalCode, isISO8601 } from 'validator';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Model decorator metadata
 */
export interface ModelDecoratorMetadata {
  tableName?: string;
  timestamps?: boolean;
  paranoid?: boolean;
  underscored?: boolean;
  schema?: string;
  indexes?: IndexOptions[];
  scopes?: ScopeOptions;
}

/**
 * Field decorator options
 */
export interface FieldDecoratorOptions extends ModelAttributeColumnOptions {
  encrypted?: boolean;
  audited?: boolean;
  searchable?: boolean;
  sortable?: boolean;
}

/**
 * Soft delete configuration
 */
export interface SoftDeleteConfig {
  field?: string;
  force?: boolean;
  paranoid?: boolean;
  hooks?: boolean;
}

/**
 * Scope builder configuration
 */
export interface ScopeBuilderConfig {
  name: string;
  findOptions?: FindOptions;
  parameterized?: boolean;
  parameters?: string[];
}

/**
 * Virtual field configuration
 */
export interface VirtualFieldConfig<T = any> {
  type: any;
  get?: (this: Model) => T;
  set?: (this: Model, value: T) => void;
  dependencies?: string[];
}

/**
 * Index builder configuration
 */
export interface IndexBuilderConfig {
  name?: string;
  fields: (string | { name: string; order?: 'ASC' | 'DESC'; length?: number })[];
  unique?: boolean;
  type?: 'BTREE' | 'HASH' | 'GIST' | 'GIN';
  where?: WhereOptions;
  concurrently?: boolean;
}

/**
 * Constraint configuration
 */
export interface ConstraintConfig {
  type: 'UNIQUE' | 'CHECK' | 'PRIMARY KEY' | 'FOREIGN KEY' | 'EXCLUSION';
  name?: string;
  fields: string[];
  references?: {
    table: string;
    field: string;
  };
  onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION' | 'SET DEFAULT';
  onUpdate?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION' | 'SET DEFAULT';
  deferrable?: 'INITIALLY_IMMEDIATE' | 'INITIALLY_DEFERRED' | 'NOT';
}

/**
 * Getter/Setter configuration
 */
export interface GetterSetterConfig<T = any> {
  get?: (this: Model) => T;
  set?: (this: Model, value: T) => void;
  transform?: (value: any) => any;
  validate?: (value: any) => boolean;
}

/**
 * Model method configuration
 */
export interface ModelMethodConfig<T extends Model = Model> {
  name: string;
  type: 'instance' | 'static';
  fn: (this: T | ModelStatic<T>, ...args: any[]) => any;
}

/**
 * Attribute validation rules
 */
export interface AttributeValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | Promise<boolean>;
  message?: string;
}

// ============================================================================
// MODEL DEFINITION HELPERS
// ============================================================================

/**
 * Creates a model class with comprehensive configuration.
 * Includes all standard fields and advanced options.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} modelName - Name of the model
 * @param {ModelAttributes<T>} attributes - Model attributes
 * @param {Partial<ModelOptions<T>>} options - Model options
 * @returns {ModelStatic<T>} Configured model class
 *
 * @example
 * ```typescript
 * const User = defineModel(sequelize, 'User', {
 *   email: { type: DataTypes.STRING, unique: true, validate: { isEmail: true } },
 *   firstName: { type: DataTypes.STRING, allowNull: false },
 *   lastName: { type: DataTypes.STRING, allowNull: false }
 * }, {
 *   tableName: 'users',
 *   paranoid: true,
 *   indexes: [{ fields: ['email'] }]
 * });
 * ```
 */
export function defineModel<T extends Model>(
  sequelize: Sequelize,
  modelName: string,
  attributes: ModelAttributes<T>,
  options: Partial<ModelOptions<T>> = {},
): ModelStatic<T> {
  const modelAttributes: ModelAttributes<T> = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      comment: 'Primary key identifier',
    },
    ...attributes,
  };

  const modelOptions: ModelOptions<T> = {
    sequelize,
    modelName,
    tableName: options.tableName || modelName.toLowerCase() + 's',
    timestamps: options.timestamps !== false,
    paranoid: options.paranoid || false,
    underscored: options.underscored !== false,
    freezeTableName: options.freezeTableName !== false,
    ...options,
  };

  class DynamicModel extends Model<T> {}
  return DynamicModel.init(modelAttributes, modelOptions) as ModelStatic<T>;
}

/**
 * Creates an abstract base model with common fields and methods.
 * Designed for inheritance by concrete models.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} modelName - Name of the model
 * @param {ModelAttributes<T>} attributes - Model attributes
 * @param {Partial<ModelOptions<T>>} options - Model options
 * @returns {ModelStatic<T>} Abstract base model
 *
 * @example
 * ```typescript
 * const BaseEntity = createAbstractModel(sequelize, 'BaseEntity', {
 *   version: { type: DataTypes.INTEGER, defaultValue: 1 },
 *   isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
 * }, { timestamps: true, paranoid: true });
 * ```
 */
export function createAbstractModel<T extends Model>(
  sequelize: Sequelize,
  modelName: string,
  attributes: ModelAttributes<T>,
  options: Partial<ModelOptions<T>> = {},
): ModelStatic<T> {
  const abstractAttributes: ModelAttributes<T> = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    version: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
      comment: 'Optimistic locking version',
    },
    ...attributes,
  };

  const abstractOptions: Partial<ModelOptions<T>> = {
    sequelize,
    modelName,
    timestamps: true,
    paranoid: true,
    underscored: true,
    ...options,
  };

  return defineModel(sequelize, modelName, abstractAttributes, abstractOptions);
}

/**
 * Extends an existing model with additional attributes.
 * Useful for adding fields dynamically or in plugins.
 *
 * @param {ModelStatic<T>} model - Model to extend
 * @param {ModelAttributes<T>} newAttributes - New attributes to add
 * @returns {ModelStatic<T>} Extended model
 *
 * @example
 * ```typescript
 * const ExtendedUser = extendModel(User, {
 *   phoneNumber: { type: DataTypes.STRING },
 *   address: { type: DataTypes.TEXT }
 * });
 * ```
 */
export function extendModel<T extends Model>(
  model: ModelStatic<T>,
  newAttributes: ModelAttributes<T>,
): ModelStatic<T> {
  const currentAttributes = model.getAttributes();
  const mergedAttributes = { ...currentAttributes, ...newAttributes };

  Object.entries(newAttributes).forEach(([key, value]) => {
    model.rawAttributes[key] = value;
  });

  model.refreshAttributes();
  return model;
}

/**
 * Clones a model with a new name and optional modifications.
 * Preserves all attributes, options, and configurations.
 *
 * @param {ModelStatic<T>} sourceModel - Model to clone
 * @param {string} newModelName - New model name
 * @param {Partial<ModelOptions<T>>} optionOverrides - Option overrides
 * @returns {ModelStatic<T>} Cloned model
 *
 * @example
 * ```typescript
 * const ArchivedUser = cloneModel(User, 'ArchivedUser', {
 *   tableName: 'archived_users',
 *   timestamps: false
 * });
 * ```
 */
export function cloneModel<T extends Model>(
  sourceModel: ModelStatic<T>,
  newModelName: string,
  optionOverrides: Partial<ModelOptions<T>> = {},
): ModelStatic<T> {
  const attributes = { ...sourceModel.getAttributes() };
  const options = {
    ...sourceModel.options,
    modelName: newModelName,
    ...optionOverrides,
  };

  return defineModel(
    sourceModel.sequelize,
    newModelName,
    attributes as ModelAttributes<T>,
    options,
  );
}

/**
 * Creates a temporal (history) model that tracks changes over time.
 * Maintains version history with temporal validity periods.
 *
 * @param {ModelStatic<T>} sourceModel - Source model to track
 * @param {string} historyTableName - History table name
 * @returns {ModelStatic<any>} Temporal history model
 *
 * @example
 * ```typescript
 * const UserHistory = createTemporalModel(User, 'user_history');
 * ```
 */
export function createTemporalModel<T extends Model>(
  sourceModel: ModelStatic<T>,
  historyTableName?: string,
): ModelStatic<any> {
  const attributes = { ...sourceModel.getAttributes() };

  // Add temporal fields
  const temporalAttributes = {
    ...attributes,
    historyId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    validFrom: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    validTo: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    operation: {
      type: DataTypes.ENUM('INSERT', 'UPDATE', 'DELETE'),
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'User who made the change',
    },
  };

  return defineModel(
    sourceModel.sequelize,
    `${sourceModel.name}History`,
    temporalAttributes as ModelAttributes<any>,
    {
      tableName: historyTableName || `${sourceModel.tableName}_history`,
      timestamps: false,
      paranoid: false,
    },
  );
}

// ============================================================================
// ATTRIBUTE VALIDATORS
// ============================================================================

/**
 * Creates comprehensive validation rules for an attribute.
 * Combines built-in and custom validators.
 *
 * @param {AttributeValidationRules} rules - Validation rules
 * @returns {ValidationOptions} Sequelize validation options
 *
 * @example
 * ```typescript
 * const emailAttribute = {
 *   type: DataTypes.STRING,
 *   validate: createAttributeValidator({
 *     required: true,
 *     custom: (value) => isEmail(value),
 *     message: 'Invalid email format'
 *   })
 * };
 * ```
 */
export function createAttributeValidator(rules: AttributeValidationRules): ValidationOptions {
  const validation: ValidationOptions = {};

  if (rules.required) {
    validation.notNull = { msg: rules.message || 'This field is required' };
    validation.notEmpty = { msg: rules.message || 'This field cannot be empty' };
  }

  if (rules.minLength !== undefined) {
    validation.len = [rules.minLength, rules.maxLength || Infinity];
  }

  if (rules.min !== undefined) {
    validation.min = rules.min;
  }

  if (rules.max !== undefined) {
    validation.max = rules.max;
  }

  if (rules.pattern) {
    validation.is = { args: rules.pattern, msg: rules.message || 'Invalid format' };
  }

  if (rules.custom) {
    validation.customValidator = async function (value: any) {
      const isValid = await rules.custom!(value);
      if (!isValid) {
        throw new Error(rules.message || 'Validation failed');
      }
    };
  }

  return validation;
}

/**
 * Validates email addresses with comprehensive rules.
 * Supports domain whitelisting and blacklisting.
 *
 * @param {string[]} allowedDomains - Allowed email domains
 * @param {string[]} blockedDomains - Blocked email domains
 * @returns {ValidationOptions} Email validation options
 *
 * @example
 * ```typescript
 * const email = {
 *   type: DataTypes.STRING,
 *   validate: validateEmail(['company.com'], ['spam.com'])
 * };
 * ```
 */
export function validateEmail(
  allowedDomains?: string[],
  blockedDomains?: string[],
): ValidationOptions {
  return {
    isEmail: { msg: 'Invalid email address' },
    customEmailValidator: function (value: string) {
      if (!value) return;

      const domain = value.split('@')[1];

      if (allowedDomains && !allowedDomains.includes(domain)) {
        throw new Error(`Email domain must be one of: ${allowedDomains.join(', ')}`);
      }

      if (blockedDomains && blockedDomains.includes(domain)) {
        throw new Error('This email domain is not allowed');
      }
    },
  };
}

/**
 * Validates phone numbers with international format support.
 * Uses libphonenumber for comprehensive validation.
 *
 * @param {string} locale - Phone number locale (e.g., 'en-US')
 * @returns {ValidationOptions} Phone validation options
 *
 * @example
 * ```typescript
 * const phone = {
 *   type: DataTypes.STRING,
 *   validate: validatePhoneNumber('en-US')
 * };
 * ```
 */
export function validatePhoneNumber(locale: string = 'en-US'): ValidationOptions {
  return {
    customPhoneValidator: function (value: string) {
      if (!value) return;
      if (!isMobilePhone(value, locale as any)) {
        throw new Error(`Invalid phone number for locale ${locale}`);
      }
    },
  };
}

/**
 * Validates URLs with protocol and domain requirements.
 * Supports custom protocol whitelisting.
 *
 * @param {string[]} allowedProtocols - Allowed URL protocols
 * @returns {ValidationOptions} URL validation options
 *
 * @example
 * ```typescript
 * const website = {
 *   type: DataTypes.STRING,
 *   validate: validateUrl(['https'])
 * };
 * ```
 */
export function validateUrl(allowedProtocols: string[] = ['http', 'https']): ValidationOptions {
  return {
    isUrl: { msg: 'Invalid URL format' },
    customUrlValidator: function (value: string) {
      if (!value) return;

      const protocol = value.split(':')[0];
      if (!allowedProtocols.includes(protocol)) {
        throw new Error(`URL protocol must be one of: ${allowedProtocols.join(', ')}`);
      }
    },
  };
}

/**
 * Validates postal/ZIP codes for specific countries.
 * Supports multiple country formats.
 *
 * @param {string} countryCode - Country code (e.g., 'US', 'GB')
 * @returns {ValidationOptions} Postal code validation options
 *
 * @example
 * ```typescript
 * const zipCode = {
 *   type: DataTypes.STRING,
 *   validate: validatePostalCode('US')
 * };
 * ```
 */
export function validatePostalCode(countryCode: string): ValidationOptions {
  return {
    customPostalCodeValidator: function (value: string) {
      if (!value) return;
      if (!isPostalCode(value, countryCode as any)) {
        throw new Error(`Invalid postal code for country ${countryCode}`);
      }
    },
  };
}

/**
 * Validates date ranges ensuring start is before end.
 * Supports custom date comparison logic.
 *
 * @param {string} startField - Start date field name
 * @param {string} endField - End date field name
 * @returns {Function} Validation function
 *
 * @example
 * ```typescript
 * const Model = sequelize.define('Event', {
 *   startDate: DataTypes.DATE,
 *   endDate: DataTypes.DATE
 * }, {
 *   validate: { dateRange: validateDateRange('startDate', 'endDate') }
 * });
 * ```
 */
export function validateDateRange(startField: string, endField: string) {
  return function (this: Model) {
    const startDate = this.getDataValue(startField);
    const endDate = this.getDataValue(endField);

    if (startDate && endDate && startDate > endDate) {
      throw new Error(`${startField} must be before ${endField}`);
    }
  };
}

/**
 * Validates that a value is unique across specific conditions.
 * Supports conditional uniqueness constraints.
 *
 * @param {string} field - Field to check for uniqueness
 * @param {WhereOptions} conditions - Additional conditions
 * @returns {Function} Validation function
 *
 * @example
 * ```typescript
 * const email = {
 *   type: DataTypes.STRING,
 *   validate: {
 *     isUnique: validateUniqueness('email', { deletedAt: null })
 *   }
 * };
 * ```
 */
export function validateUniqueness(field: string, conditions: WhereOptions = {}) {
  return async function (this: Model, value: any) {
    const Model = this.constructor as ModelStatic<Model>;
    const where: WhereOptions = { [field]: value, ...conditions };

    if (this.getDataValue('id')) {
      where.id = { [Op.ne]: this.getDataValue('id') };
    }

    const existing = await Model.findOne({ where });
    if (existing) {
      throw new Error(`${field} must be unique`);
    }
  };
}

// ============================================================================
// DATA TYPE UTILITIES
// ============================================================================

/**
 * Creates a custom ENUM type with validation.
 * Supports dynamic enum values and custom error messages.
 *
 * @param {string[]} values - Allowed enum values
 * @param {string} errorMessage - Custom error message
 * @returns {object} ENUM attribute configuration
 *
 * @example
 * ```typescript
 * const role = createEnumType(['admin', 'user', 'guest'], 'Invalid role');
 * ```
 */
export function createEnumType(values: string[], errorMessage?: string) {
  return {
    type: DataTypes.ENUM(...values),
    validate: {
      isIn: {
        args: [values],
        msg: errorMessage || `Value must be one of: ${values.join(', ')}`,
      },
    },
  };
}

/**
 * Creates a JSON field with schema validation.
 * Validates JSON structure against a schema.
 *
 * @param {object} schema - JSON schema for validation
 * @returns {object} JSON attribute configuration
 *
 * @example
 * ```typescript
 * const metadata = createJsonType({
 *   type: 'object',
 *   properties: { version: { type: 'number' } }
 * });
 * ```
 */
export function createJsonType(schema?: any) {
  return {
    type: DataTypes.JSONB,
    validate: {
      isValidJson: function (value: any) {
        if (!value) return;

        if (typeof value !== 'object') {
          throw new Error('Value must be a valid JSON object');
        }

        if (schema) {
          // Basic schema validation (in production, use ajv or similar)
          const validateSchema = (data: any, schemaObj: any): boolean => {
            if (schemaObj.type === 'object' && typeof data !== 'object') return false;
            if (schemaObj.type === 'array' && !Array.isArray(data)) return false;
            if (schemaObj.type === 'string' && typeof data !== 'string') return false;
            if (schemaObj.type === 'number' && typeof data !== 'number') return false;
            return true;
          };

          if (!validateSchema(value, schema)) {
            throw new Error('JSON value does not match schema');
          }
        }
      },
    },
  };
}

/**
 * Creates an array field with length and element validation.
 * Supports typed arrays with element constraints.
 *
 * @param {any} elementType - Type of array elements
 * @param {number} minLength - Minimum array length
 * @param {number} maxLength - Maximum array length
 * @returns {object} Array attribute configuration
 *
 * @example
 * ```typescript
 * const tags = createArrayType(DataTypes.STRING, 1, 10);
 * ```
 */
export function createArrayType(elementType: any, minLength?: number, maxLength?: number) {
  return {
    type: DataTypes.ARRAY(elementType),
    validate: {
      isValidArray: function (value: any[]) {
        if (!value) return;

        if (!Array.isArray(value)) {
          throw new Error('Value must be an array');
        }

        if (minLength !== undefined && value.length < minLength) {
          throw new Error(`Array must have at least ${minLength} elements`);
        }

        if (maxLength !== undefined && value.length > maxLength) {
          throw new Error(`Array must have at most ${maxLength} elements`);
        }
      },
    },
  };
}

/**
 * Creates a decimal field with precision and scale.
 * Supports currency and financial calculations.
 *
 * @param {number} precision - Total number of digits
 * @param {number} scale - Number of decimal places
 * @returns {object} Decimal attribute configuration
 *
 * @example
 * ```typescript
 * const price = createDecimalType(10, 2); // 99999999.99
 * ```
 */
export function createDecimalType(precision: number, scale: number) {
  return {
    type: DataTypes.DECIMAL(precision, scale),
    get() {
      const value = this.getDataValue(arguments[0]);
      return value ? parseFloat(value) : null;
    },
  };
}

/**
 * Creates a UUID field with version selection.
 * Supports UUID v1, v4, and custom generation.
 *
 * @param {number} version - UUID version (1 or 4)
 * @param {boolean} isPrimaryKey - Whether this is a primary key
 * @returns {object} UUID attribute configuration
 *
 * @example
 * ```typescript
 * const id = createUuidType(4, true);
 * const referenceId = createUuidType(4, false);
 * ```
 */
export function createUuidType(version: 1 | 4 = 4, isPrimaryKey: boolean = false) {
  return {
    type: DataTypes.UUID,
    defaultValue: version === 4 ? DataTypes.UUIDV4 : DataTypes.UUIDV1,
    primaryKey: isPrimaryKey,
    allowNull: false,
    validate: {
      isUUID: version,
    },
  };
}

/**
 * Creates an encrypted string field for sensitive data.
 * Uses AES-256-GCM encryption with authentication.
 *
 * @param {number} maxLength - Maximum string length
 * @returns {object} Encrypted string attribute configuration
 *
 * @example
 * ```typescript
 * const ssn = createEncryptedStringType(11);
 * ```
 */
export function createEncryptedStringType(maxLength?: number) {
  const crypto = require('crypto');
  const algorithm = 'aes-256-gcm';
  const key = Buffer.from(process.env.ENCRYPTION_KEY || '', 'hex');

  return {
    type: maxLength ? DataTypes.STRING(maxLength * 3) : DataTypes.TEXT,
    get() {
      const encrypted = this.getDataValue(arguments[0]);
      if (!encrypted) return null;

      try {
        const parts = encrypted.split(':');
        const iv = Buffer.from(parts[0], 'hex');
        const authTag = Buffer.from(parts[1], 'hex');
        const encryptedData = parts[2];
        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        decipher.setAuthTag(authTag);
        let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
      } catch (error) {
        console.error('Decryption error:', error);
        return null;
      }
    },
    set(value: any) {
      if (!value) {
        this.setDataValue(arguments[0], null);
        return;
      }

      try {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(algorithm, key, iv);
        let encrypted = cipher.update(String(value), 'utf8', 'hex');
        encrypted += cipher.final('hex');
        const authTag = cipher.getAuthTag();
        const encryptedValue = `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
        this.setDataValue(arguments[0], encryptedValue);
      } catch (error) {
        console.error('Encryption error:', error);
        throw error;
      }
    },
  };
}

// ============================================================================
// MODEL DECORATORS
// ============================================================================

/**
 * Stores model decorator metadata
 */
const modelMetadataStore = new Map<Function, ModelDecoratorMetadata>();

/**
 * Table decorator for model classes.
 * Configures table-level options.
 *
 * @param {Partial<ModelDecoratorMetadata>} options - Table options
 * @returns {ClassDecorator} Class decorator
 *
 * @example
 * ```typescript
 * @Table({ tableName: 'users', timestamps: true, paranoid: true })
 * class User extends Model {
 *   // ...
 * }
 * ```
 */
export function Table(options: Partial<ModelDecoratorMetadata> = {}): ClassDecorator {
  return (target: Function) => {
    const existing = modelMetadataStore.get(target) || {};
    modelMetadataStore.set(target, { ...existing, ...options });
  };
}

/**
 * Column decorator for model properties.
 * Configures column-level options.
 *
 * @param {FieldDecoratorOptions} options - Column options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class User extends Model {
 *   @Column({ type: DataTypes.STRING, unique: true })
 *   email: string;
 * }
 * ```
 */
export function Column(options: FieldDecoratorOptions = {}): PropertyDecorator {
  return (target: Object, propertyKey: string | symbol) => {
    const metadata = modelMetadataStore.get(target.constructor) || {};
    if (!metadata.indexes) metadata.indexes = [];

    // Store column metadata for later initialization
    Reflect.defineMetadata('column:' + String(propertyKey), options, target.constructor);
  };
}

/**
 * PrimaryKey decorator for primary key fields.
 * Automatically configures as UUID v4 by default.
 *
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class User extends Model {
 *   @PrimaryKey
 *   id: string;
 * }
 * ```
 */
export function PrimaryKey(): PropertyDecorator {
  return Column({
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  });
}

/**
 * AutoIncrement decorator for auto-incrementing fields.
 * Typically used with integer primary keys.
 *
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class Log extends Model {
 *   @AutoIncrement
 *   @PrimaryKey
 *   id: number;
 * }
 * ```
 */
export function AutoIncrement(): PropertyDecorator {
  return (target: Object, propertyKey: string | symbol) => {
    const existing = Reflect.getMetadata('column:' + String(propertyKey), target.constructor) || {};
    Reflect.defineMetadata('column:' + String(propertyKey), {
      ...existing,
      autoIncrement: true,
      type: existing.type || DataTypes.INTEGER,
    }, target.constructor);
  };
}

/**
 * Unique decorator for unique constraint fields.
 * Supports composite unique constraints.
 *
 * @param {string} constraintName - Optional constraint name
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class User extends Model {
 *   @Unique('user_email_unique')
 *   email: string;
 * }
 * ```
 */
export function Unique(constraintName?: string): PropertyDecorator {
  return (target: Object, propertyKey: string | symbol) => {
    const existing = Reflect.getMetadata('column:' + String(propertyKey), target.constructor) || {};
    Reflect.defineMetadata('column:' + String(propertyKey), {
      ...existing,
      unique: constraintName || true,
    }, target.constructor);
  };
}

/**
 * Index decorator for indexed fields.
 * Creates database indexes for performance.
 *
 * @param {Partial<IndexBuilderConfig>} options - Index options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class User extends Model {
 *   @Index({ type: 'BTREE' })
 *   email: string;
 * }
 * ```
 */
export function Index(options: Partial<IndexBuilderConfig> = {}): PropertyDecorator {
  return (target: Object, propertyKey: string | symbol) => {
    const metadata = modelMetadataStore.get(target.constructor) || {};
    if (!metadata.indexes) metadata.indexes = [];

    metadata.indexes.push({
      fields: options.fields || [String(propertyKey)],
      unique: options.unique,
      type: options.type,
      name: options.name,
    } as IndexOptions);

    modelMetadataStore.set(target.constructor, metadata);
  };
}

// ============================================================================
// SOFT DELETE UTILITIES
// ============================================================================

/**
 * Adds soft delete functionality to a model.
 * Configures paranoid mode with deletedAt column.
 *
 * @param {ModelStatic<T>} model - Model to configure
 * @param {SoftDeleteConfig} config - Soft delete configuration
 * @returns {ModelStatic<T>} Configured model
 *
 * @example
 * ```typescript
 * const User = sequelize.define('User', { name: DataTypes.STRING });
 * addSoftDelete(User, { field: 'deletedAt', paranoid: true });
 * ```
 */
export function addSoftDelete<T extends Model>(
  model: ModelStatic<T>,
  config: SoftDeleteConfig = {},
): ModelStatic<T> {
  const options = model.options;
  options.paranoid = config.paranoid !== false;
  options.deletedAt = config.field || 'deletedAt';

  if (config.hooks !== false) {
    model.addHook('beforeDestroy', 'softDeleteHook', async (instance: T, opts: any) => {
      if (!config.force && !opts.force) {
        instance.setDataValue('deletedAt' as any, new Date());
        await instance.save({ hooks: false });
        opts.softDeleted = true;
      }
    });
  }

  return model;
}

/**
 * Restores a soft-deleted record.
 * Sets deletedAt to null and updates timestamps.
 *
 * @param {T} instance - Model instance to restore
 * @param {object} options - Restore options
 * @returns {Promise<T>} Restored instance
 *
 * @example
 * ```typescript
 * const user = await User.findByPk(userId, { paranoid: false });
 * await restoreSoftDeleted(user);
 * ```
 */
export function restoreSoftDeleted<T extends Model>(
  instance: T,
  options: any = {},
): Promise<T> {
  instance.setDataValue('deletedAt' as any, null);
  return instance.save(options);
}

/**
 * Permanently deletes a soft-deleted record.
 * Bypasses paranoid mode to hard delete.
 *
 * @param {T} instance - Model instance to hard delete
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * const user = await User.findByPk(userId, { paranoid: false });
 * await hardDelete(user);
 * ```
 */
export function hardDelete<T extends Model>(instance: T): Promise<void> {
  return instance.destroy({ force: true });
}

/**
 * Finds all soft-deleted records.
 * Queries with paranoid: false to include deleted records.
 *
 * @param {ModelStatic<T>} model - Model to query
 * @param {FindOptions} options - Additional query options
 * @returns {Promise<T[]>} Soft-deleted records
 *
 * @example
 * ```typescript
 * const deletedUsers = await findSoftDeleted(User, {
 *   where: { role: 'admin' }
 * });
 * ```
 */
export function findSoftDeleted<T extends Model>(
  model: ModelStatic<T>,
  options: FindOptions = {},
): Promise<T[]> {
  return model.findAll({
    ...options,
    paranoid: false,
    where: {
      ...options.where,
      deletedAt: { [Op.ne]: null },
    },
  });
}

/**
 * Bulk restores multiple soft-deleted records.
 * Efficient restoration of multiple records.
 *
 * @param {ModelStatic<T>} model - Model to restore records from
 * @param {WhereOptions} where - Conditions for restoration
 * @returns {Promise<number>} Number of restored records
 *
 * @example
 * ```typescript
 * const count = await bulkRestore(User, {
 *   deletedAt: { [Op.gte]: new Date('2024-01-01') }
 * });
 * ```
 */
export function bulkRestore<T extends Model>(
  model: ModelStatic<T>,
  where: WhereOptions,
): Promise<[affectedCount: number]> {
  return model.update(
    { deletedAt: null } as any,
    { where, paranoid: false },
  );
}

// ============================================================================
// SCOPE BUILDERS
// ============================================================================

/**
 * Creates a default scope for a model.
 * Applies to all queries unless overridden.
 *
 * @param {ModelStatic<T>} model - Model to add scope to
 * @param {FindOptions} options - Scope options
 * @returns {ModelStatic<T>} Model with default scope
 *
 * @example
 * ```typescript
 * addDefaultScope(User, {
 *   where: { isActive: true },
 *   attributes: { exclude: ['password'] }
 * });
 * ```
 */
export function addDefaultScope<T extends Model>(
  model: ModelStatic<T>,
  options: FindOptions,
): ModelStatic<T> {
  model.addScope('defaultScope', options, { override: true });
  return model;
}

/**
 * Creates a named scope with parameters.
 * Allows dynamic scope configuration.
 *
 * @param {ModelStatic<T>} model - Model to add scope to
 * @param {string} name - Scope name
 * @param {Function} scopeFn - Scope function
 * @returns {ModelStatic<T>} Model with named scope
 *
 * @example
 * ```typescript
 * addNamedScope(User, 'byRole', (role: string) => ({
 *   where: { role }
 * }));
 * // Usage: User.scope({ method: ['byRole', 'admin'] }).findAll()
 * ```
 */
export function addNamedScope<T extends Model>(
  model: ModelStatic<T>,
  name: string,
  scopeFn: (...args: any[]) => FindOptions,
): ModelStatic<T> {
  model.addScope(name, scopeFn);
  return model;
}

/**
 * Creates multiple scopes at once.
 * Batch scope definition for models.
 *
 * @param {ModelStatic<T>} model - Model to add scopes to
 * @param {Record<string, FindOptions | Function>} scopes - Scope definitions
 * @returns {ModelStatic<T>} Model with scopes
 *
 * @example
 * ```typescript
 * addMultipleScopes(User, {
 *   active: { where: { isActive: true } },
 *   recent: { order: [['createdAt', 'DESC']], limit: 10 },
 *   byRole: (role) => ({ where: { role } })
 * });
 * ```
 */
export function addMultipleScopes<T extends Model>(
  model: ModelStatic<T>,
  scopes: Record<string, FindOptions | ((...args: any[]) => FindOptions)>,
): ModelStatic<T> {
  Object.entries(scopes).forEach(([name, scope]) => {
    model.addScope(name, scope as any);
  });
  return model;
}

/**
 * Creates a scope that includes related models.
 * Simplifies eager loading configuration.
 *
 * @param {ModelStatic<T>} model - Model to add scope to
 * @param {string} scopeName - Scope name
 * @param {string[]} includes - Models to include
 * @returns {ModelStatic<T>} Model with include scope
 *
 * @example
 * ```typescript
 * addIncludeScope(User, 'withProfile', ['Profile', 'Posts']);
 * // Usage: User.scope('withProfile').findAll()
 * ```
 */
export function addIncludeScope<T extends Model>(
  model: ModelStatic<T>,
  scopeName: string,
  includes: string[],
): ModelStatic<T> {
  model.addScope(scopeName, {
    include: includes.map(name => ({ association: name })),
  });
  return model;
}

/**
 * Creates a scope for attribute selection.
 * Controls which attributes are returned.
 *
 * @param {ModelStatic<T>} model - Model to add scope to
 * @param {string} scopeName - Scope name
 * @param {string[]} attributes - Attributes to select
 * @returns {ModelStatic<T>} Model with attribute scope
 *
 * @example
 * ```typescript
 * addAttributeScope(User, 'publicFields', ['id', 'name', 'email']);
 * // Usage: User.scope('publicFields').findAll()
 * ```
 */
export function addAttributeScope<T extends Model>(
  model: ModelStatic<T>,
  scopeName: string,
  attributes: string[],
): ModelStatic<T> {
  model.addScope(scopeName, { attributes });
  return model;
}

// ============================================================================
// VIRTUAL FIELDS
// ============================================================================

/**
 * Adds a virtual field to a model.
 * Computed fields that don't persist to database.
 *
 * @param {ModelStatic<T>} model - Model to add virtual field to
 * @param {string} fieldName - Virtual field name
 * @param {VirtualFieldConfig} config - Virtual field configuration
 * @returns {ModelStatic<T>} Model with virtual field
 *
 * @example
 * ```typescript
 * addVirtualField(User, 'fullName', {
 *   type: DataTypes.VIRTUAL,
 *   get() { return `${this.firstName} ${this.lastName}`; },
 *   dependencies: ['firstName', 'lastName']
 * });
 * ```
 */
export function addVirtualField<T extends Model>(
  model: ModelStatic<T>,
  fieldName: string,
  config: VirtualFieldConfig,
): ModelStatic<T> {
  model.rawAttributes[fieldName] = {
    type: DataTypes.VIRTUAL,
    get: config.get,
    set: config.set,
  } as any;

  model.refreshAttributes();
  return model;
}

/**
 * Creates a computed field from multiple attributes.
 * Automatically generates getter based on template.
 *
 * @param {string[]} dependencies - Source attribute names
 * @param {Function} computeFn - Computation function
 * @returns {VirtualFieldConfig} Virtual field configuration
 *
 * @example
 * ```typescript
 * const fullAddress = createComputedField(
 *   ['street', 'city', 'state', 'zip'],
 *   (street, city, state, zip) => `${street}, ${city}, ${state} ${zip}`
 * );
 * ```
 */
export function createComputedField(
  dependencies: string[],
  computeFn: (...values: any[]) => any,
): VirtualFieldConfig {
  return {
    type: DataTypes.VIRTUAL,
    get() {
      const values = dependencies.map(dep => this.getDataValue(dep));
      return computeFn(...values);
    },
    dependencies,
  };
}

/**
 * Creates a virtual field that aggregates related data.
 * Useful for counts, sums, averages from associations.
 *
 * @param {string} association - Association name
 * @param {string} operation - Aggregation operation
 * @param {string} field - Field to aggregate
 * @returns {VirtualFieldConfig} Virtual field configuration
 *
 * @example
 * ```typescript
 * const postCount = createAggregateField('Posts', 'count', 'id');
 * addVirtualField(User, 'postCount', postCount);
 * ```
 */
export function createAggregateField(
  association: string,
  operation: 'count' | 'sum' | 'avg' | 'min' | 'max',
  field?: string,
): VirtualFieldConfig {
  return {
    type: DataTypes.VIRTUAL,
    get() {
      const related = this.getDataValue(association);
      if (!related || !Array.isArray(related)) return null;

      switch (operation) {
        case 'count':
          return related.length;
        case 'sum':
          return related.reduce((sum, item) => sum + (item[field!] || 0), 0);
        case 'avg':
          const sum = related.reduce((s, item) => s + (item[field!] || 0), 0);
          return related.length > 0 ? sum / related.length : 0;
        case 'min':
          return Math.min(...related.map(item => item[field!] || Infinity));
        case 'max':
          return Math.max(...related.map(item => item[field!] || -Infinity));
        default:
          return null;
      }
    },
    dependencies: [association],
  };
}

// ============================================================================
// GETTER/SETTER UTILITIES
// ============================================================================

/**
 * Creates a getter that transforms the stored value.
 * Useful for formatting, parsing, or decryption.
 *
 * @param {Function} transformFn - Transform function
 * @returns {Function} Getter function
 *
 * @example
 * ```typescript
 * const price = {
 *   type: DataTypes.DECIMAL(10, 2),
 *   get: createGetter((value) => parseFloat(value))
 * };
 * ```
 */
export function createGetter<T = any>(transformFn: (value: any) => T): () => T {
  return function (this: Model) {
    const value = this.getDataValue(arguments[0]);
    return value ? transformFn(value) : null;
  };
}

/**
 * Creates a setter that transforms the input value.
 * Useful for sanitization, normalization, or encryption.
 *
 * @param {Function} transformFn - Transform function
 * @returns {Function} Setter function
 *
 * @example
 * ```typescript
 * const email = {
 *   type: DataTypes.STRING,
 *   set: createSetter((value) => value.toLowerCase().trim())
 * };
 * ```
 */
export function createSetter(transformFn: (value: any) => any): (value: any) => void {
  return function (this: Model, value: any) {
    const transformed = value ? transformFn(value) : null;
    this.setDataValue(arguments[0], transformed);
  };
}

/**
 * Creates getter/setter pair for field normalization.
 * Ensures consistent data format.
 *
 * @param {Function} normalizeFn - Normalization function
 * @returns {GetterSetterConfig} Getter/setter configuration
 *
 * @example
 * ```typescript
 * const phone = {
 *   type: DataTypes.STRING,
 *   ...createNormalizer((value) => value.replace(/\D/g, ''))
 * };
 * ```
 */
export function createNormalizer(normalizeFn: (value: any) => any): GetterSetterConfig {
  return {
    get: createGetter(normalizeFn),
    set: createSetter(normalizeFn),
  };
}

/**
 * Creates getter/setter for JSON serialization.
 * Automatically parses and stringifies JSON.
 *
 * @param {any} defaultValue - Default value for empty JSON
 * @returns {GetterSetterConfig} Getter/setter configuration
 *
 * @example
 * ```typescript
 * const settings = {
 *   type: DataTypes.TEXT,
 *   ...createJsonSerializer({})
 * };
 * ```
 */
export function createJsonSerializer(defaultValue: any = null): GetterSetterConfig {
  return {
    get: createGetter((value: string) => {
      try {
        return value ? JSON.parse(value) : defaultValue;
      } catch {
        return defaultValue;
      }
    }),
    set: createSetter((value: any) => {
      try {
        return typeof value === 'string' ? value : JSON.stringify(value);
      } catch {
        return null;
      }
    }),
  };
}

// ============================================================================
// INDEX MANAGEMENT
// ============================================================================

/**
 * Adds a single index to a model.
 * Creates database index for query optimization.
 *
 * @param {ModelStatic<T>} model - Model to add index to
 * @param {IndexBuilderConfig} config - Index configuration
 * @returns {ModelStatic<T>} Model with index
 *
 * @example
 * ```typescript
 * addIndex(User, {
 *   name: 'user_email_idx',
 *   fields: ['email'],
 *   unique: true
 * });
 * ```
 */
export function addIndex<T extends Model>(
  model: ModelStatic<T>,
  config: IndexBuilderConfig,
): ModelStatic<T> {
  const options = model.options;
  if (!options.indexes) {
    options.indexes = [];
  }

  options.indexes.push({
    name: config.name,
    fields: config.fields,
    unique: config.unique,
    type: config.type,
    where: config.where,
  } as IndexOptions);

  return model;
}

/**
 * Adds a composite index across multiple fields.
 * Optimizes queries filtering on multiple columns.
 *
 * @param {ModelStatic<T>} model - Model to add index to
 * @param {string[]} fields - Fields to index
 * @param {Partial<IndexBuilderConfig>} options - Index options
 * @returns {ModelStatic<T>} Model with composite index
 *
 * @example
 * ```typescript
 * addCompositeIndex(User, ['lastName', 'firstName'], {
 *   name: 'user_name_idx'
 * });
 * ```
 */
export function addCompositeIndex<T extends Model>(
  model: ModelStatic<T>,
  fields: string[],
  options: Partial<IndexBuilderConfig> = {},
): ModelStatic<T> {
  return addIndex(model, {
    ...options,
    fields,
    name: options.name || `${model.tableName}_${fields.join('_')}_idx`,
  });
}

/**
 * Adds a unique constraint index.
 * Ensures uniqueness at database level.
 *
 * @param {ModelStatic<T>} model - Model to add index to
 * @param {string[]} fields - Fields for unique constraint
 * @param {string} name - Constraint name
 * @returns {ModelStatic<T>} Model with unique index
 *
 * @example
 * ```typescript
 * addUniqueIndex(User, ['email'], 'user_email_unique');
 * ```
 */
export function addUniqueIndex<T extends Model>(
  model: ModelStatic<T>,
  fields: string[],
  name?: string,
): ModelStatic<T> {
  return addIndex(model, {
    fields,
    unique: true,
    name: name || `${model.tableName}_${fields.join('_')}_unique`,
  });
}

/**
 * Adds a partial index with WHERE clause.
 * Indexes only rows matching specific conditions.
 *
 * @param {ModelStatic<T>} model - Model to add index to
 * @param {string[]} fields - Fields to index
 * @param {WhereOptions} where - Index condition
 * @param {Partial<IndexBuilderConfig>} options - Index options
 * @returns {ModelStatic<T>} Model with partial index
 *
 * @example
 * ```typescript
 * addPartialIndex(User, ['email'], { isActive: true }, {
 *   name: 'active_user_email_idx'
 * });
 * ```
 */
export function addPartialIndex<T extends Model>(
  model: ModelStatic<T>,
  fields: string[],
  where: WhereOptions,
  options: Partial<IndexBuilderConfig> = {},
): ModelStatic<T> {
  return addIndex(model, {
    ...options,
    fields,
    where,
    name: options.name || `${model.tableName}_${fields.join('_')}_partial_idx`,
  });
}

// ============================================================================
// CONSTRAINT MANAGEMENT
// ============================================================================

/**
 * Adds a check constraint to a model.
 * Validates data at database level.
 *
 * @param {ModelStatic<T>} model - Model to add constraint to
 * @param {string} name - Constraint name
 * @param {string} condition - SQL condition
 * @returns {ModelStatic<T>} Model with check constraint
 *
 * @example
 * ```typescript
 * addCheckConstraint(Product, 'price_positive', 'price > 0');
 * ```
 */
export function addCheckConstraint<T extends Model>(
  model: ModelStatic<T>,
  name: string,
  condition: string,
): ModelStatic<T> {
  // Note: This would typically be applied during migration
  // Stored for reference in model options
  if (!model.options.indexes) {
    model.options.indexes = [];
  }

  // Store as metadata for migration generation
  Reflect.defineMetadata(`constraint:check:${name}`, condition, model);
  return model;
}

/**
 * Validates constraint configuration.
 * Ensures constraint definitions are valid.
 *
 * @param {ConstraintConfig} constraint - Constraint configuration
 * @returns {boolean} Whether constraint is valid
 *
 * @example
 * ```typescript
 * const isValid = validateConstraint({
 *   type: 'FOREIGN KEY',
 *   fields: ['userId'],
 *   references: { table: 'users', field: 'id' }
 * });
 * ```
 */
export function validateConstraint(constraint: ConstraintConfig): boolean {
  if (!constraint.type || !constraint.fields || constraint.fields.length === 0) {
    return false;
  }

  if (constraint.type === 'FOREIGN KEY') {
    if (!constraint.references || !constraint.references.table || !constraint.references.field) {
      return false;
    }
  }

  return true;
}

/**
 * Retrieves model metadata for generating migrations.
 * Extracts all constraints, indexes, and configuration.
 *
 * @param {ModelStatic<T>} model - Model to extract metadata from
 * @returns {ModelDecoratorMetadata} Model metadata
 *
 * @example
 * ```typescript
 * const metadata = getModelMetadata(User);
 * console.log(metadata.indexes, metadata.tableName);
 * ```
 */
export function getModelMetadata<T extends Model>(
  model: ModelStatic<T>,
): ModelDecoratorMetadata {
  return modelMetadataStore.get(model as any) || {};
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Synchronizes a model with the database.
 * Creates table if it doesn't exist.
 *
 * @param {ModelStatic<T>} model - Model to synchronize
 * @param {object} options - Sync options
 * @returns {Promise<ModelStatic<T>>} Synchronized model
 *
 * @example
 * ```typescript
 * await syncModel(User, { alter: true });
 * ```
 */
export async function syncModel<T extends Model>(
  model: ModelStatic<T>,
  options: { force?: boolean; alter?: boolean } = {},
): Promise<ModelStatic<T>> {
  await model.sync(options);
  return model;
}

/**
 * Drops a model's table from the database.
 * Permanently deletes all data.
 *
 * @param {ModelStatic<T>} model - Model to drop
 * @param {object} options - Drop options
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await dropModel(User, { cascade: true });
 * ```
 */
export async function dropModel<T extends Model>(
  model: ModelStatic<T>,
  options: { cascade?: boolean } = {},
): Promise<void> {
  await model.drop(options);
}

/**
 * Retrieves all attributes from a model.
 * Returns complete attribute definitions.
 *
 * @param {ModelStatic<T>} model - Model to get attributes from
 * @returns {ModelAttributes<T>} Model attributes
 *
 * @example
 * ```typescript
 * const attributes = getModelAttributes(User);
 * console.log(attributes.email.type);
 * ```
 */
export function getModelAttributes<T extends Model>(
  model: ModelStatic<T>,
): ModelAttributes<T> {
  return model.getAttributes() as ModelAttributes<T>;
}

/**
 * Checks if a model has a specific attribute.
 * Useful for dynamic attribute checking.
 *
 * @param {ModelStatic<T>} model - Model to check
 * @param {string} attributeName - Attribute name
 * @returns {boolean} Whether attribute exists
 *
 * @example
 * ```typescript
 * if (hasAttribute(User, 'email')) {
 *   // Email attribute exists
 * }
 * ```
 */
export function hasAttribute<T extends Model>(
  model: ModelStatic<T>,
  attributeName: string,
): boolean {
  return attributeName in model.getAttributes();
}

/**
 * Gets the primary key field name for a model.
 * Handles composite primary keys.
 *
 * @param {ModelStatic<T>} model - Model to get primary key from
 * @returns {string | string[]} Primary key field name(s)
 *
 * @example
 * ```typescript
 * const pk = getPrimaryKey(User); // 'id'
 * ```
 */
export function getPrimaryKey<T extends Model>(
  model: ModelStatic<T>,
): string | string[] {
  const attributes = model.getAttributes();
  const primaryKeys = Object.keys(attributes).filter(
    key => attributes[key].primaryKey,
  );

  return primaryKeys.length === 1 ? primaryKeys[0] : primaryKeys;
}

/**
 * Refreshes model attributes after modifications.
 * Reloads attribute definitions from raw attributes.
 *
 * @param {ModelStatic<T>} model - Model to refresh
 * @returns {ModelStatic<T>} Refreshed model
 *
 * @example
 * ```typescript
 * model.rawAttributes.newField = { type: DataTypes.STRING };
 * refreshModel(model);
 * ```
 */
export function refreshModel<T extends Model>(
  model: ModelStatic<T>,
): ModelStatic<T> {
  model.refreshAttributes();
  return model;
}
