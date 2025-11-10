/**
 * Enterprise-ready Sequelize Model Decorators
 *
 * Comprehensive decorator utilities for model definition, field validation,
 * transformations, computed fields, encryption, indexing, and metadata management.
 *
 * @module reuse/data/model-decorators
 * @version 1.0.0
 * @requires sequelize v6
 * @requires reflect-metadata
 */

import 'reflect-metadata';
import {
  Model,
  ModelStatic,
  DataTypes,
  ModelAttributes,
  ModelOptions,
  Sequelize,
  IndexOptions,
  ValidationErrorItem,
  ValidationError,
} from 'sequelize';
import * as crypto from 'crypto';

/**
 * Metadata keys for decorator storage
 */
const METADATA_KEYS = {
  MODEL_OPTIONS: 'sequelize:model:options',
  ATTRIBUTES: 'sequelize:model:attributes',
  INDEXES: 'sequelize:model:indexes',
  VALIDATIONS: 'sequelize:field:validations',
  TRANSFORMS: 'sequelize:field:transforms',
  HOOKS: 'sequelize:model:hooks',
  SCOPES: 'sequelize:model:scopes',
  ASSOCIATIONS: 'sequelize:model:associations',
  COMPUTED: 'sequelize:field:computed',
  ENCRYPTED: 'sequelize:field:encrypted',
  VIRTUAL: 'sequelize:field:virtual',
  FOREIGN_KEYS: 'sequelize:field:foreign_keys',
  COMPOSITE_KEYS: 'sequelize:model:composite_keys',
  GETTERS: 'sequelize:field:getters',
  SETTERS: 'sequelize:field:setters',
};

/**
 * Type definitions for decorators
 */
export interface FieldOptions {
  type?: any;
  allowNull?: boolean;
  defaultValue?: any;
  primaryKey?: boolean;
  autoIncrement?: boolean;
  unique?: boolean | string;
  comment?: string;
  references?: {
    model: string;
    key: string;
  };
  onUpdate?: string;
  onDelete?: string;
}

export interface ValidationOptions {
  validator: (value: any, instance?: any) => boolean | Promise<boolean>;
  message?: string;
  args?: any[];
}

export interface TransformOptions {
  toDatabase?: (value: any) => any;
  fromDatabase?: (value: any) => any;
}

export interface EncryptionOptions {
  algorithm?: string;
  key: string;
  iv?: string;
}

export interface IndexConfig {
  name?: string;
  unique?: boolean;
  fields: string[];
  type?: string;
}

export interface ScopeConfig {
  name: string;
  scope: any;
}

export interface AssociationConfig {
  type: 'belongsTo' | 'hasOne' | 'hasMany' | 'belongsToMany';
  target: string;
  options?: any;
}

// ============================================================================
// Model-level Decorators
// ============================================================================

/**
 * Decorator to define a Sequelize model with table configuration
 *
 * @param tableName - Name of the database table
 * @param options - Additional model options
 * @returns Class decorator
 *
 * @example
 * ```typescript
 * @Table('users', { timestamps: true, paranoid: true })
 * class User extends Model {
 *   @Field({ type: DataTypes.STRING })
 *   name: string;
 * }
 * ```
 */
export function Table(
  tableName?: string,
  options?: Partial<ModelOptions<any>>
): ClassDecorator {
  return function (target: any) {
    const modelOptions: Partial<ModelOptions<any>> = {
      ...options,
      tableName: tableName || target.name.toLowerCase() + 's',
      modelName: target.name,
    };

    Reflect.defineMetadata(METADATA_KEYS.MODEL_OPTIONS, modelOptions, target);
    return target;
  };
}

/**
 * Decorator to register a model with automatic initialization
 *
 * @param sequelize - Sequelize instance
 * @returns Class decorator
 *
 * @example
 * ```typescript
 * @RegisterModel(sequelize)
 * @Table('products')
 * class Product extends Model {}
 * ```
 */
export function RegisterModel(sequelize: Sequelize): ClassDecorator {
  return function (target: any) {
    const attributes = Reflect.getMetadata(METADATA_KEYS.ATTRIBUTES, target.prototype) || {};
    const options = Reflect.getMetadata(METADATA_KEYS.MODEL_OPTIONS, target) || {};

    target.init(attributes, {
      ...options,
      sequelize,
    });

    return target;
  };
}

/**
 * Decorator to enable timestamps on a model
 *
 * @param createdAt - Custom name for createdAt field
 * @param updatedAt - Custom name for updatedAt field
 * @returns Class decorator
 *
 * @example
 * ```typescript
 * @Timestamps('created_at', 'updated_at')
 * @Table('orders')
 * class Order extends Model {}
 * ```
 */
export function Timestamps(
  createdAt: string | boolean = 'createdAt',
  updatedAt: string | boolean = 'updatedAt'
): ClassDecorator {
  return function (target: any) {
    const options = Reflect.getMetadata(METADATA_KEYS.MODEL_OPTIONS, target) || {};
    options.timestamps = true;
    options.createdAt = createdAt;
    options.updatedAt = updatedAt;
    Reflect.defineMetadata(METADATA_KEYS.MODEL_OPTIONS, options, target);
    return target;
  };
}

/**
 * Decorator to enable paranoid (soft delete) mode
 *
 * @param deletedAt - Custom name for deletedAt field
 * @returns Class decorator
 *
 * @example
 * ```typescript
 * @Paranoid('deleted_at')
 * @Table('users')
 * class User extends Model {}
 * ```
 */
export function Paranoid(deletedAt: string = 'deletedAt'): ClassDecorator {
  return function (target: any) {
    const options = Reflect.getMetadata(METADATA_KEYS.MODEL_OPTIONS, target) || {};
    options.paranoid = true;
    options.deletedAt = deletedAt;
    Reflect.defineMetadata(METADATA_KEYS.MODEL_OPTIONS, options, target);
    return target;
  };
}

/**
 * Decorator to enable underscored naming convention
 *
 * @returns Class decorator
 *
 * @example
 * ```typescript
 * @Underscored()
 * @Table('user_profiles')
 * class UserProfile extends Model {}
 * ```
 */
export function Underscored(): ClassDecorator {
  return function (target: any) {
    const options = Reflect.getMetadata(METADATA_KEYS.MODEL_OPTIONS, target) || {};
    options.underscored = true;
    Reflect.defineMetadata(METADATA_KEYS.MODEL_OPTIONS, options, target);
    return target;
  };
}

// ============================================================================
// Field Definition Decorators
// ============================================================================

/**
 * Decorator to define a model field with options
 *
 * @param options - Field configuration options
 * @returns Property decorator
 *
 * @example
 * ```typescript
 * class User extends Model {
 *   @Field({ type: DataTypes.STRING, allowNull: false, unique: true })
 *   email: string;
 * }
 * ```
 */
export function Field(options: FieldOptions): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    const attributes = Reflect.getMetadata(METADATA_KEYS.ATTRIBUTES, target) || {};
    attributes[propertyKey as string] = {
      type: options.type || DataTypes.STRING,
      allowNull: options.allowNull !== false,
      ...options,
    };
    Reflect.defineMetadata(METADATA_KEYS.ATTRIBUTES, attributes, target);
  };
}

/**
 * Decorator to mark a field as primary key
 *
 * @param autoIncrement - Whether the field should auto-increment
 * @returns Property decorator
 *
 * @example
 * ```typescript
 * class Product extends Model {
 *   @PrimaryKey(true)
 *   @Field({ type: DataTypes.INTEGER })
 *   id: number;
 * }
 * ```
 */
export function PrimaryKey(autoIncrement: boolean = false): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    const attributes = Reflect.getMetadata(METADATA_KEYS.ATTRIBUTES, target) || {};
    attributes[propertyKey as string] = {
      ...(attributes[propertyKey as string] || {}),
      primaryKey: true,
      autoIncrement,
    };
    Reflect.defineMetadata(METADATA_KEYS.ATTRIBUTES, attributes, target);
  };
}

/**
 * Decorator to mark a field as required (not null)
 *
 * @returns Property decorator
 *
 * @example
 * ```typescript
 * class User extends Model {
 *   @Required()
 *   @Field({ type: DataTypes.STRING })
 *   username: string;
 * }
 * ```
 */
export function Required(): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    const attributes = Reflect.getMetadata(METADATA_KEYS.ATTRIBUTES, target) || {};
    attributes[propertyKey as string] = {
      ...(attributes[propertyKey as string] || {}),
      allowNull: false,
    };
    Reflect.defineMetadata(METADATA_KEYS.ATTRIBUTES, attributes, target);
  };
}

/**
 * Decorator to set a default value for a field
 *
 * @param value - Default value or function
 * @returns Property decorator
 *
 * @example
 * ```typescript
 * class Order extends Model {
 *   @Default('pending')
 *   @Field({ type: DataTypes.STRING })
 *   status: string;
 * }
 * ```
 */
export function Default(value: any): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    const attributes = Reflect.getMetadata(METADATA_KEYS.ATTRIBUTES, target) || {};
    attributes[propertyKey as string] = {
      ...(attributes[propertyKey as string] || {}),
      defaultValue: value,
    };
    Reflect.defineMetadata(METADATA_KEYS.ATTRIBUTES, attributes, target);
  };
}

// ============================================================================
// Validation Decorators
// ============================================================================

/**
 * Decorator to add email validation to a field
 *
 * @param message - Custom error message
 * @returns Property decorator
 *
 * @example
 * ```typescript
 * class User extends Model {
 *   @IsEmail('Invalid email format')
 *   @Field({ type: DataTypes.STRING })
 *   email: string;
 * }
 * ```
 */
export function IsEmail(message?: string): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    const attributes = Reflect.getMetadata(METADATA_KEYS.ATTRIBUTES, target) || {};
    const attr = attributes[propertyKey as string] || {};
    attr.validate = attr.validate || {};
    attr.validate.isEmail = {
      msg: message || 'Invalid email address',
    };
    attributes[propertyKey as string] = attr;
    Reflect.defineMetadata(METADATA_KEYS.ATTRIBUTES, attributes, target);
  };
}

/**
 * Decorator to add URL validation to a field
 *
 * @param message - Custom error message
 * @returns Property decorator
 *
 * @example
 * ```typescript
 * class Profile extends Model {
 *   @IsUrl('Invalid URL format')
 *   @Field({ type: DataTypes.STRING })
 *   website: string;
 * }
 * ```
 */
export function IsUrl(message?: string): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    const attributes = Reflect.getMetadata(METADATA_KEYS.ATTRIBUTES, target) || {};
    const attr = attributes[propertyKey as string] || {};
    attr.validate = attr.validate || {};
    attr.validate.isUrl = {
      msg: message || 'Invalid URL',
    };
    attributes[propertyKey as string] = attr;
    Reflect.defineMetadata(METADATA_KEYS.ATTRIBUTES, attributes, target);
  };
}

/**
 * Decorator to add length validation to a field
 *
 * @param min - Minimum length
 * @param max - Maximum length
 * @param message - Custom error message
 * @returns Property decorator
 *
 * @example
 * ```typescript
 * class User extends Model {
 *   @Length(3, 50, 'Username must be between 3 and 50 characters')
 *   @Field({ type: DataTypes.STRING })
 *   username: string;
 * }
 * ```
 */
export function Length(min: number, max: number, message?: string): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    const attributes = Reflect.getMetadata(METADATA_KEYS.ATTRIBUTES, target) || {};
    const attr = attributes[propertyKey as string] || {};
    attr.validate = attr.validate || {};
    attr.validate.len = {
      args: [min, max],
      msg: message || `Length must be between ${min} and ${max}`,
    };
    attributes[propertyKey as string] = attr;
    Reflect.defineMetadata(METADATA_KEYS.ATTRIBUTES, attributes, target);
  };
}

/**
 * Decorator to add numeric range validation
 *
 * @param min - Minimum value
 * @param max - Maximum value
 * @param message - Custom error message
 * @returns Property decorator
 *
 * @example
 * ```typescript
 * class Product extends Model {
 *   @Range(0, 1000000, 'Price must be between 0 and 1,000,000')
 *   @Field({ type: DataTypes.DECIMAL })
 *   price: number;
 * }
 * ```
 */
export function Range(min: number, max: number, message?: string): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    const attributes = Reflect.getMetadata(METADATA_KEYS.ATTRIBUTES, target) || {};
    const attr = attributes[propertyKey as string] || {};
    attr.validate = attr.validate || {};
    attr.validate.min = min;
    attr.validate.max = max;
    attributes[propertyKey as string] = attr;
    Reflect.defineMetadata(METADATA_KEYS.ATTRIBUTES, attributes, target);
  };
}

/**
 * Decorator to add custom validation logic
 *
 * @param validatorFn - Validation function
 * @param message - Custom error message
 * @returns Property decorator
 *
 * @example
 * ```typescript
 * class User extends Model {
 *   @Validate((value) => value.length >= 8, 'Password too short')
 *   @Field({ type: DataTypes.STRING })
 *   password: string;
 * }
 * ```
 */
export function Validate(
  validatorFn: (value: any) => boolean | Promise<boolean>,
  message?: string
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    const attributes = Reflect.getMetadata(METADATA_KEYS.ATTRIBUTES, target) || {};
    const attr = attributes[propertyKey as string] || {};
    attr.validate = attr.validate || {};

    const validatorName = `custom_${propertyKey.toString()}`;
    attr.validate[validatorName] = async function (value: any) {
      const isValid = await validatorFn(value);
      if (!isValid) {
        throw new Error(message || `Validation failed for ${propertyKey.toString()}`);
      }
    };

    attributes[propertyKey as string] = attr;
    Reflect.defineMetadata(METADATA_KEYS.ATTRIBUTES, attributes, target);
  };
}

/**
 * Decorator to validate that field value is in a list of allowed values
 *
 * @param values - Array of allowed values
 * @param message - Custom error message
 * @returns Property decorator
 *
 * @example
 * ```typescript
 * class User extends Model {
 *   @IsIn(['admin', 'user', 'guest'])
 *   @Field({ type: DataTypes.STRING })
 *   role: string;
 * }
 * ```
 */
export function IsIn(values: any[], message?: string): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    const attributes = Reflect.getMetadata(METADATA_KEYS.ATTRIBUTES, target) || {};
    const attr = attributes[propertyKey as string] || {};
    attr.validate = attr.validate || {};
    attr.validate.isIn = {
      args: [values],
      msg: message || `Value must be one of: ${values.join(', ')}`,
    };
    attributes[propertyKey as string] = attr;
    Reflect.defineMetadata(METADATA_KEYS.ATTRIBUTES, attributes, target);
  };
}

/**
 * Decorator to validate alphanumeric characters only
 *
 * @param message - Custom error message
 * @returns Property decorator
 *
 * @example
 * ```typescript
 * class Product extends Model {
 *   @IsAlphanumeric('SKU must be alphanumeric')
 *   @Field({ type: DataTypes.STRING })
 *   sku: string;
 * }
 * ```
 */
export function IsAlphanumeric(message?: string): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    const attributes = Reflect.getMetadata(METADATA_KEYS.ATTRIBUTES, target) || {};
    const attr = attributes[propertyKey as string] || {};
    attr.validate = attr.validate || {};
    attr.validate.isAlphanumeric = {
      msg: message || 'Only alphanumeric characters allowed',
    };
    attributes[propertyKey as string] = attr;
    Reflect.defineMetadata(METADATA_KEYS.ATTRIBUTES, attributes, target);
  };
}

// ============================================================================
// Transform Decorators
// ============================================================================

/**
 * Decorator to transform field value to lowercase
 *
 * @returns Property decorator
 *
 * @example
 * ```typescript
 * class User extends Model {
 *   @Lowercase()
 *   @Field({ type: DataTypes.STRING })
 *   email: string;
 * }
 * ```
 */
export function Lowercase(): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    const attributes = Reflect.getMetadata(METADATA_KEYS.ATTRIBUTES, target) || {};
    const attr = attributes[propertyKey as string] || {};

    const originalSet = attr.set;
    attr.set = function (value: string) {
      const transformed = value ? value.toLowerCase() : value;
      if (originalSet) {
        originalSet.call(this, transformed);
      } else {
        this.setDataValue(propertyKey as string, transformed);
      }
    };

    attributes[propertyKey as string] = attr;
    Reflect.defineMetadata(METADATA_KEYS.ATTRIBUTES, attributes, target);
  };
}

/**
 * Decorator to transform field value to uppercase
 *
 * @returns Property decorator
 *
 * @example
 * ```typescript
 * class Country extends Model {
 *   @Uppercase()
 *   @Field({ type: DataTypes.STRING })
 *   code: string;
 * }
 * ```
 */
export function Uppercase(): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    const attributes = Reflect.getMetadata(METADATA_KEYS.ATTRIBUTES, target) || {};
    const attr = attributes[propertyKey as string] || {};

    const originalSet = attr.set;
    attr.set = function (value: string) {
      const transformed = value ? value.toUpperCase() : value;
      if (originalSet) {
        originalSet.call(this, transformed);
      } else {
        this.setDataValue(propertyKey as string, transformed);
      }
    };

    attributes[propertyKey as string] = attr;
    Reflect.defineMetadata(METADATA_KEYS.ATTRIBUTES, attributes, target);
  };
}

/**
 * Decorator to trim whitespace from field value
 *
 * @returns Property decorator
 *
 * @example
 * ```typescript
 * class User extends Model {
 *   @Trim()
 *   @Field({ type: DataTypes.STRING })
 *   username: string;
 * }
 * ```
 */
export function Trim(): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    const attributes = Reflect.getMetadata(METADATA_KEYS.ATTRIBUTES, target) || {};
    const attr = attributes[propertyKey as string] || {};

    const originalSet = attr.set;
    attr.set = function (value: string) {
      const transformed = typeof value === 'string' ? value.trim() : value;
      if (originalSet) {
        originalSet.call(this, transformed);
      } else {
        this.setDataValue(propertyKey as string, transformed);
      }
    };

    attributes[propertyKey as string] = attr;
    Reflect.defineMetadata(METADATA_KEYS.ATTRIBUTES, attributes, target);
  };
}

/**
 * Decorator to apply custom transformation to field value
 *
 * @param transformFn - Transformation function
 * @returns Property decorator
 *
 * @example
 * ```typescript
 * class User extends Model {
 *   @Transform((value) => value.replace(/\s+/g, ''))
 *   @Field({ type: DataTypes.STRING })
 *   phone: string;
 * }
 * ```
 */
export function Transform(transformFn: (value: any) => any): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    const attributes = Reflect.getMetadata(METADATA_KEYS.ATTRIBUTES, target) || {};
    const attr = attributes[propertyKey as string] || {};

    const originalSet = attr.set;
    attr.set = function (value: any) {
      const transformed = transformFn(value);
      if (originalSet) {
        originalSet.call(this, transformed);
      } else {
        this.setDataValue(propertyKey as string, transformed);
      }
    };

    attributes[propertyKey as string] = attr;
    Reflect.defineMetadata(METADATA_KEYS.ATTRIBUTES, attributes, target);
  };
}

// ============================================================================
// Computed Field Decorators
// ============================================================================

/**
 * Decorator to define a computed virtual field
 *
 * @param dependencies - Array of field names this computed field depends on
 * @returns Property decorator
 *
 * @example
 * ```typescript
 * class User extends Model {
 *   @Field({ type: DataTypes.STRING })
 *   firstName: string;
 *
 *   @Field({ type: DataTypes.STRING })
 *   lastName: string;
 *
 *   @Computed(['firstName', 'lastName'])
 *   get fullName(): string {
 *     return `${this.firstName} ${this.lastName}`;
 *   }
 * }
 * ```
 */
export function Computed(dependencies?: string[]): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    const computed = Reflect.getMetadata(METADATA_KEYS.COMPUTED, target) || {};
    computed[propertyKey as string] = { dependencies: dependencies || [] };
    Reflect.defineMetadata(METADATA_KEYS.COMPUTED, computed, target);

    const attributes = Reflect.getMetadata(METADATA_KEYS.ATTRIBUTES, target) || {};
    attributes[propertyKey as string] = {
      type: DataTypes.VIRTUAL,
      get() {
        const descriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
        return descriptor?.get?.call(this);
      },
    };
    Reflect.defineMetadata(METADATA_KEYS.ATTRIBUTES, attributes, target);
  };
}

// ============================================================================
// Encrypted Field Decorators
// ============================================================================

/**
 * Decorator to automatically encrypt/decrypt a field
 *
 * @param options - Encryption configuration
 * @returns Property decorator
 *
 * @example
 * ```typescript
 * class User extends Model {
 *   @Encrypted({ key: process.env.ENCRYPTION_KEY })
 *   @Field({ type: DataTypes.TEXT })
 *   ssn: string;
 * }
 * ```
 */
export function Encrypted(options: EncryptionOptions): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    const algorithm = options.algorithm || 'aes-256-cbc';
    const key = Buffer.from(options.key, 'hex');
    const iv = options.iv ? Buffer.from(options.iv, 'hex') : crypto.randomBytes(16);

    const attributes = Reflect.getMetadata(METADATA_KEYS.ATTRIBUTES, target) || {};
    const attr = attributes[propertyKey as string] || {};

    // Encrypt on set
    attr.set = function (value: string) {
      if (value) {
        const cipher = crypto.createCipheriv(algorithm, key, iv);
        let encrypted = cipher.update(value, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        this.setDataValue(propertyKey as string, `${iv.toString('hex')}:${encrypted}`);
      } else {
        this.setDataValue(propertyKey as string, value);
      }
    };

    // Decrypt on get
    attr.get = function () {
      const value = this.getDataValue(propertyKey as string);
      if (value && typeof value === 'string' && value.includes(':')) {
        const [ivHex, encrypted] = value.split(':');
        const decipher = crypto.createDecipheriv(
          algorithm,
          key,
          Buffer.from(ivHex, 'hex')
        );
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
      }
      return value;
    };

    attributes[propertyKey as string] = attr;
    Reflect.defineMetadata(METADATA_KEYS.ATTRIBUTES, attributes, target);

    const encrypted = Reflect.getMetadata(METADATA_KEYS.ENCRYPTED, target) || {};
    encrypted[propertyKey as string] = options;
    Reflect.defineMetadata(METADATA_KEYS.ENCRYPTED, encrypted, target);
  };
}

// ============================================================================
// Index Decorators
// ============================================================================

/**
 * Decorator to create an index on a field
 *
 * @param options - Index configuration
 * @returns Property decorator
 *
 * @example
 * ```typescript
 * class User extends Model {
 *   @Index({ name: 'email_idx', unique: true })
 *   @Field({ type: DataTypes.STRING })
 *   email: string;
 * }
 * ```
 */
export function Index(options?: {
  name?: string;
  unique?: boolean;
  type?: string;
}): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    const indexes = Reflect.getMetadata(METADATA_KEYS.INDEXES, target.constructor) || [];
    indexes.push({
      name: options?.name || `${propertyKey.toString()}_idx`,
      fields: [propertyKey as string],
      unique: options?.unique || false,
      type: options?.type,
    });
    Reflect.defineMetadata(METADATA_KEYS.INDEXES, indexes, target.constructor);

    // Also update model options
    const modelOptions =
      Reflect.getMetadata(METADATA_KEYS.MODEL_OPTIONS, target.constructor) || {};
    modelOptions.indexes = indexes;
    Reflect.defineMetadata(METADATA_KEYS.MODEL_OPTIONS, modelOptions, target.constructor);
  };
}

/**
 * Decorator to create a unique index on a field
 *
 * @param indexName - Optional custom index name
 * @returns Property decorator
 *
 * @example
 * ```typescript
 * class User extends Model {
 *   @UniqueIndex('unique_email')
 *   @Field({ type: DataTypes.STRING })
 *   email: string;
 * }
 * ```
 */
export function UniqueIndex(indexName?: string): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    return Index({
      name: indexName || `${propertyKey.toString()}_unique_idx`,
      unique: true,
    })(target, propertyKey);
  };
}

// ============================================================================
// Constraint Decorators
// ============================================================================

/**
 * Decorator to mark a field as unique
 *
 * @param constraintName - Optional constraint name
 * @returns Property decorator
 *
 * @example
 * ```typescript
 * class User extends Model {
 *   @Unique('unique_username')
 *   @Field({ type: DataTypes.STRING })
 *   username: string;
 * }
 * ```
 */
export function Unique(constraintName?: string | boolean): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    const attributes = Reflect.getMetadata(METADATA_KEYS.ATTRIBUTES, target) || {};
    const attr = attributes[propertyKey as string] || {};
    attr.unique = constraintName || true;
    attributes[propertyKey as string] = attr;
    Reflect.defineMetadata(METADATA_KEYS.ATTRIBUTES, attributes, target);
  };
}

/**
 * Decorator to define a composite unique constraint
 *
 * @param constraintName - Name of the constraint
 * @param fields - Array of field names
 * @returns Class decorator
 *
 * @example
 * ```typescript
 * @CompositeUnique('user_email_unique', ['userId', 'email'])
 * @Table('user_emails')
 * class UserEmail extends Model {}
 * ```
 */
export function CompositeUnique(
  constraintName: string,
  fields: string[]
): ClassDecorator {
  return function (target: any) {
    const indexes = Reflect.getMetadata(METADATA_KEYS.INDEXES, target) || [];
    indexes.push({
      name: constraintName,
      fields,
      unique: true,
    });
    Reflect.defineMetadata(METADATA_KEYS.INDEXES, indexes, target);

    const modelOptions = Reflect.getMetadata(METADATA_KEYS.MODEL_OPTIONS, target) || {};
    modelOptions.indexes = indexes;
    Reflect.defineMetadata(METADATA_KEYS.MODEL_OPTIONS, modelOptions, target);

    return target;
  };
}

// ============================================================================
// Foreign Key Decorators
// ============================================================================

/**
 * Decorator to define a foreign key relationship
 *
 * @param targetModel - Name of the target model
 * @param targetKey - Key in the target model (default: 'id')
 * @param options - Additional foreign key options
 * @returns Property decorator
 *
 * @example
 * ```typescript
 * class Order extends Model {
 *   @ForeignKey('User', 'id', { onDelete: 'CASCADE' })
 *   @Field({ type: DataTypes.INTEGER })
 *   userId: number;
 * }
 * ```
 */
export function ForeignKey(
  targetModel: string,
  targetKey: string = 'id',
  options?: { onDelete?: string; onUpdate?: string }
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    const attributes = Reflect.getMetadata(METADATA_KEYS.ATTRIBUTES, target) || {};
    const attr = attributes[propertyKey as string] || {};
    attr.references = {
      model: targetModel,
      key: targetKey,
    };
    if (options?.onDelete) attr.onDelete = options.onDelete;
    if (options?.onUpdate) attr.onUpdate = options.onUpdate;
    attributes[propertyKey as string] = attr;
    Reflect.defineMetadata(METADATA_KEYS.ATTRIBUTES, attributes, target);

    const foreignKeys = Reflect.getMetadata(METADATA_KEYS.FOREIGN_KEYS, target) || {};
    foreignKeys[propertyKey as string] = { targetModel, targetKey, options };
    Reflect.defineMetadata(METADATA_KEYS.FOREIGN_KEYS, foreignKeys, target);
  };
}

// ============================================================================
// Composite Key Decorator
// ============================================================================

/**
 * Decorator to define a composite primary key
 *
 * @param fields - Array of field names that form the composite key
 * @returns Class decorator
 *
 * @example
 * ```typescript
 * @CompositeKey(['userId', 'productId'])
 * @Table('user_products')
 * class UserProduct extends Model {}
 * ```
 */
export function CompositeKey(fields: string[]): ClassDecorator {
  return function (target: any) {
    const compositeKeys =
      Reflect.getMetadata(METADATA_KEYS.COMPOSITE_KEYS, target) || [];
    compositeKeys.push(fields);
    Reflect.defineMetadata(METADATA_KEYS.COMPOSITE_KEYS, compositeKeys, target);

    // Mark each field as part of primary key
    fields.forEach((field) => {
      const attributes =
        Reflect.getMetadata(METADATA_KEYS.ATTRIBUTES, target.prototype) || {};
      const attr = attributes[field] || {};
      attr.primaryKey = true;
      attributes[field] = attr;
      Reflect.defineMetadata(METADATA_KEYS.ATTRIBUTES, attributes, target.prototype);
    });

    return target;
  };
}

// ============================================================================
// Virtual Field Decorator
// ============================================================================

/**
 * Decorator to define a virtual field
 *
 * @returns Property decorator
 *
 * @example
 * ```typescript
 * class User extends Model {
 *   @Field({ type: DataTypes.STRING })
 *   firstName: string;
 *
 *   @Virtual()
 *   get displayName(): string {
 *     return `User: ${this.firstName}`;
 *   }
 * }
 * ```
 */
export function Virtual(): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    const attributes = Reflect.getMetadata(METADATA_KEYS.ATTRIBUTES, target) || {};
    const descriptor = Object.getOwnPropertyDescriptor(target, propertyKey);

    attributes[propertyKey as string] = {
      type: DataTypes.VIRTUAL,
      get: descriptor?.get,
      set: descriptor?.set,
    };

    Reflect.defineMetadata(METADATA_KEYS.ATTRIBUTES, attributes, target);

    const virtuals = Reflect.getMetadata(METADATA_KEYS.VIRTUAL, target) || {};
    virtuals[propertyKey as string] = true;
    Reflect.defineMetadata(METADATA_KEYS.VIRTUAL, virtuals, target);
  };
}

// ============================================================================
// Getter/Setter Decorators
// ============================================================================

/**
 * Decorator to define a custom getter for a field
 *
 * @param getterFn - Getter function
 * @returns Property decorator
 *
 * @example
 * ```typescript
 * class User extends Model {
 *   @Getter(function() { return this.getDataValue('email').toLowerCase(); })
 *   @Field({ type: DataTypes.STRING })
 *   email: string;
 * }
 * ```
 */
export function Getter(getterFn: (this: any) => any): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    const attributes = Reflect.getMetadata(METADATA_KEYS.ATTRIBUTES, target) || {};
    const attr = attributes[propertyKey as string] || {};
    attr.get = getterFn;
    attributes[propertyKey as string] = attr;
    Reflect.defineMetadata(METADATA_KEYS.ATTRIBUTES, attributes, target);

    const getters = Reflect.getMetadata(METADATA_KEYS.GETTERS, target) || {};
    getters[propertyKey as string] = getterFn;
    Reflect.defineMetadata(METADATA_KEYS.GETTERS, getters, target);
  };
}

/**
 * Decorator to define a custom setter for a field
 *
 * @param setterFn - Setter function
 * @returns Property decorator
 *
 * @example
 * ```typescript
 * class User extends Model {
 *   @Setter(function(value) { this.setDataValue('email', value.toLowerCase()); })
 *   @Field({ type: DataTypes.STRING })
 *   email: string;
 * }
 * ```
 */
export function Setter(setterFn: (this: any, value: any) => void): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    const attributes = Reflect.getMetadata(METADATA_KEYS.ATTRIBUTES, target) || {};
    const attr = attributes[propertyKey as string] || {};
    attr.set = setterFn;
    attributes[propertyKey as string] = attr;
    Reflect.defineMetadata(METADATA_KEYS.ATTRIBUTES, attributes, target);

    const setters = Reflect.getMetadata(METADATA_KEYS.SETTERS, target) || {};
    setters[propertyKey as string] = setterFn;
    Reflect.defineMetadata(METADATA_KEYS.SETTERS, setters, target);
  };
}

// ============================================================================
// Hook Decorators
// ============================================================================

/**
 * Decorator to register a beforeCreate hook
 *
 * @returns Method decorator
 *
 * @example
 * ```typescript
 * @Table('users')
 * class User extends Model {
 *   @BeforeCreate
 *   static async hashPassword(instance: User) {
 *     instance.password = await hash(instance.password);
 *   }
 * }
 * ```
 */
export function BeforeCreate(): MethodDecorator {
  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const hooks = Reflect.getMetadata(METADATA_KEYS.HOOKS, target) || {};
    hooks.beforeCreate = hooks.beforeCreate || [];
    hooks.beforeCreate.push(descriptor.value);
    Reflect.defineMetadata(METADATA_KEYS.HOOKS, hooks, target);

    const modelOptions = Reflect.getMetadata(METADATA_KEYS.MODEL_OPTIONS, target) || {};
    modelOptions.hooks = modelOptions.hooks || {};
    modelOptions.hooks.beforeCreate = descriptor.value;
    Reflect.defineMetadata(METADATA_KEYS.MODEL_OPTIONS, modelOptions, target);
  };
}

/**
 * Decorator to register an afterCreate hook
 *
 * @returns Method decorator
 *
 * @example
 * ```typescript
 * @Table('users')
 * class User extends Model {
 *   @AfterCreate
 *   static async sendWelcomeEmail(instance: User) {
 *     await emailService.sendWelcome(instance.email);
 *   }
 * }
 * ```
 */
export function AfterCreate(): MethodDecorator {
  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const hooks = Reflect.getMetadata(METADATA_KEYS.HOOKS, target) || {};
    hooks.afterCreate = hooks.afterCreate || [];
    hooks.afterCreate.push(descriptor.value);
    Reflect.defineMetadata(METADATA_KEYS.HOOKS, hooks, target);

    const modelOptions = Reflect.getMetadata(METADATA_KEYS.MODEL_OPTIONS, target) || {};
    modelOptions.hooks = modelOptions.hooks || {};
    modelOptions.hooks.afterCreate = descriptor.value;
    Reflect.defineMetadata(METADATA_KEYS.MODEL_OPTIONS, modelOptions, target);
  };
}

/**
 * Decorator to register a beforeUpdate hook
 *
 * @returns Method decorator
 *
 * @example
 * ```typescript
 * @Table('users')
 * class User extends Model {
 *   @BeforeUpdate
 *   static updateTimestamp(instance: User) {
 *     instance.updatedAt = new Date();
 *   }
 * }
 * ```
 */
export function BeforeUpdate(): MethodDecorator {
  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const hooks = Reflect.getMetadata(METADATA_KEYS.HOOKS, target) || {};
    hooks.beforeUpdate = hooks.beforeUpdate || [];
    hooks.beforeUpdate.push(descriptor.value);
    Reflect.defineMetadata(METADATA_KEYS.HOOKS, hooks, target);

    const modelOptions = Reflect.getMetadata(METADATA_KEYS.MODEL_OPTIONS, target) || {};
    modelOptions.hooks = modelOptions.hooks || {};
    modelOptions.hooks.beforeUpdate = descriptor.value;
    Reflect.defineMetadata(METADATA_KEYS.MODEL_OPTIONS, modelOptions, target);
  };
}

/**
 * Decorator to register an afterUpdate hook
 *
 * @returns Method decorator
 *
 * @example
 * ```typescript
 * @Table('users')
 * class User extends Model {
 *   @AfterUpdate
 *   static async logUpdate(instance: User) {
 *     await auditLog.create({ action: 'UPDATE', model: 'User', id: instance.id });
 *   }
 * }
 * ```
 */
export function AfterUpdate(): MethodDecorator {
  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const hooks = Reflect.getMetadata(METADATA_KEYS.HOOKS, target) || {};
    hooks.afterUpdate = hooks.afterUpdate || [];
    hooks.afterUpdate.push(descriptor.value);
    Reflect.defineMetadata(METADATA_KEYS.HOOKS, hooks, target);

    const modelOptions = Reflect.getMetadata(METADATA_KEYS.MODEL_OPTIONS, target) || {};
    modelOptions.hooks = modelOptions.hooks || {};
    modelOptions.hooks.afterUpdate = descriptor.value;
    Reflect.defineMetadata(METADATA_KEYS.MODEL_OPTIONS, modelOptions, target);
  };
}

/**
 * Decorator to register a beforeDestroy hook
 *
 * @returns Method decorator
 *
 * @example
 * ```typescript
 * @Table('users')
 * class User extends Model {
 *   @BeforeDestroy
 *   static async cleanupRelated(instance: User) {
 *     await instance.Posts.destroy();
 *   }
 * }
 * ```
 */
export function BeforeDestroy(): MethodDecorator {
  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const hooks = Reflect.getMetadata(METADATA_KEYS.HOOKS, target) || {};
    hooks.beforeDestroy = hooks.beforeDestroy || [];
    hooks.beforeDestroy.push(descriptor.value);
    Reflect.defineMetadata(METADATA_KEYS.HOOKS, hooks, target);

    const modelOptions = Reflect.getMetadata(METADATA_KEYS.MODEL_OPTIONS, target) || {};
    modelOptions.hooks = modelOptions.hooks || {};
    modelOptions.hooks.beforeDestroy = descriptor.value;
    Reflect.defineMetadata(METADATA_KEYS.MODEL_OPTIONS, modelOptions, target);
  };
}

/**
 * Decorator to register an afterDestroy hook
 *
 * @returns Method decorator
 *
 * @example
 * ```typescript
 * @Table('users')
 * class User extends Model {
 *   @AfterDestroy
 *   static async logDeletion(instance: User) {
 *     await auditLog.create({ action: 'DELETE', model: 'User', id: instance.id });
 *   }
 * }
 * ```
 */
export function AfterDestroy(): MethodDecorator {
  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const hooks = Reflect.getMetadata(METADATA_KEYS.HOOKS, target) || {};
    hooks.afterDestroy = hooks.afterDestroy || [];
    hooks.afterDestroy.push(descriptor.value);
    Reflect.defineMetadata(METADATA_KEYS.HOOKS, hooks, target);

    const modelOptions = Reflect.getMetadata(METADATA_KEYS.MODEL_OPTIONS, target) || {};
    modelOptions.hooks = modelOptions.hooks || {};
    modelOptions.hooks.afterDestroy = descriptor.value;
    Reflect.defineMetadata(METADATA_KEYS.MODEL_OPTIONS, modelOptions, target);
  };
}

// ============================================================================
// Scope Decorators
// ============================================================================

/**
 * Decorator to define a default scope for a model
 *
 * @param scope - Scope configuration
 * @returns Class decorator
 *
 * @example
 * ```typescript
 * @DefaultScope({ where: { active: true } })
 * @Table('users')
 * class User extends Model {}
 * ```
 */
export function DefaultScope(scope: any): ClassDecorator {
  return function (target: any) {
    const modelOptions = Reflect.getMetadata(METADATA_KEYS.MODEL_OPTIONS, target) || {};
    modelOptions.defaultScope = scope;
    Reflect.defineMetadata(METADATA_KEYS.MODEL_OPTIONS, modelOptions, target);
    return target;
  };
}

/**
 * Decorator to define a named scope for a model
 *
 * @param name - Name of the scope
 * @param scope - Scope configuration
 * @returns Class decorator
 *
 * @example
 * ```typescript
 * @Scope('active', { where: { status: 'active' } })
 * @Table('users')
 * class User extends Model {}
 * ```
 */
export function Scope(name: string, scope: any): ClassDecorator {
  return function (target: any) {
    const scopes = Reflect.getMetadata(METADATA_KEYS.SCOPES, target) || {};
    scopes[name] = scope;
    Reflect.defineMetadata(METADATA_KEYS.SCOPES, scopes, target);

    const modelOptions = Reflect.getMetadata(METADATA_KEYS.MODEL_OPTIONS, target) || {};
    modelOptions.scopes = modelOptions.scopes || {};
    modelOptions.scopes[name] = scope;
    Reflect.defineMetadata(METADATA_KEYS.MODEL_OPTIONS, modelOptions, target);

    return target;
  };
}

// ============================================================================
// Metadata Helper Functions
// ============================================================================

/**
 * Retrieves all metadata for a model class
 *
 * @param target - Model class or prototype
 * @returns Complete metadata object
 *
 * @example
 * ```typescript
 * const metadata = getModelMetadata(User);
 * console.log('Model attributes:', metadata.attributes);
 * ```
 */
export function getModelMetadata(target: any): {
  options: any;
  attributes: any;
  indexes: any[];
  hooks: any;
  scopes: any;
  computed: any;
  encrypted: any;
  foreignKeys: any;
} {
  return {
    options: Reflect.getMetadata(METADATA_KEYS.MODEL_OPTIONS, target) || {},
    attributes: Reflect.getMetadata(METADATA_KEYS.ATTRIBUTES, target.prototype) || {},
    indexes: Reflect.getMetadata(METADATA_KEYS.INDEXES, target) || [],
    hooks: Reflect.getMetadata(METADATA_KEYS.HOOKS, target) || {},
    scopes: Reflect.getMetadata(METADATA_KEYS.SCOPES, target) || {},
    computed: Reflect.getMetadata(METADATA_KEYS.COMPUTED, target.prototype) || {},
    encrypted: Reflect.getMetadata(METADATA_KEYS.ENCRYPTED, target.prototype) || {},
    foreignKeys: Reflect.getMetadata(METADATA_KEYS.FOREIGN_KEYS, target.prototype) || {},
  };
}

/**
 * Initializes a model with all decorator metadata
 *
 * @param ModelClass - Model class to initialize
 * @param sequelize - Sequelize instance
 * @returns Initialized model
 *
 * @example
 * ```typescript
 * @Table('users')
 * class User extends Model {}
 *
 * const InitializedUser = initializeModel(User, sequelize);
 * ```
 */
export function initializeModel<T extends typeof Model>(
  ModelClass: T,
  sequelize: Sequelize
): T {
  const metadata = getModelMetadata(ModelClass);

  ModelClass.init(metadata.attributes, {
    ...metadata.options,
    sequelize,
  });

  return ModelClass;
}
