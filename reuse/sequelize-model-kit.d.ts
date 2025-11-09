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
import { Model, ModelStatic, Sequelize, ModelAttributes, ModelOptions, IndexOptions, ValidationOptions, FindOptions, WhereOptions, ScopeOptions, ModelAttributeColumnOptions } from 'sequelize';
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
export interface VirtualFieldConfig<T = unknown> {
    type: unknown;
    get?: (this: Model) => T;
    set?: (this: Model, value: T) => void;
    dependencies?: string[];
}
/**
 * Index builder configuration
 */
export interface IndexBuilderConfig {
    name?: string;
    fields: (string | {
        name: string;
        order?: 'ASC' | 'DESC';
        length?: number;
    })[];
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
export interface GetterSetterConfig<T = unknown> {
    get?: (this: Model) => T;
    set?: (this: Model, value: T) => void;
    transform?: (value: unknown) => unknown;
    validate?: (value: unknown) => boolean;
}
/**
 * Model method configuration
 */
export interface ModelMethodConfig<T extends Model = Model> {
    name: string;
    type: 'instance' | 'static';
    fn: (this: T | ModelStatic<T>, ...args: unknown[]) => unknown;
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
    custom?: (value: unknown) => boolean | Promise<boolean>;
    message?: string;
}
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
export declare function defineModel<T extends Model>(sequelize: Sequelize, modelName: string, attributes: ModelAttributes<T>, options?: Partial<ModelOptions<T>>): ModelStatic<T>;
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
export declare function createAbstractModel<T extends Model>(sequelize: Sequelize, modelName: string, attributes: ModelAttributes<T>, options?: Partial<ModelOptions<T>>): ModelStatic<T>;
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
export declare function extendModel<T extends Model>(model: ModelStatic<T>, newAttributes: ModelAttributes<T>): ModelStatic<T>;
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
export declare function cloneModel<T extends Model>(sourceModel: ModelStatic<T>, newModelName: string, optionOverrides?: Partial<ModelOptions<T>>): ModelStatic<T>;
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
export declare function createTemporalModel<T extends Model>(sourceModel: ModelStatic<T>, historyTableName?: string): ModelStatic<any>;
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
export declare function createAttributeValidator(rules: AttributeValidationRules): ValidationOptions;
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
export declare function validateEmail(allowedDomains?: string[], blockedDomains?: string[]): ValidationOptions;
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
export declare function validatePhoneNumber(locale?: string): ValidationOptions;
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
export declare function validateUrl(allowedProtocols?: string[]): ValidationOptions;
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
export declare function validatePostalCode(countryCode: string): ValidationOptions;
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
export declare function validateDateRange(startField: string, endField: string): (this: Model) => void;
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
export declare function validateUniqueness(field: string, conditions?: WhereOptions): (this: Model, value: unknown) => Promise<void>;
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
export declare function createEnumType(values: string[], errorMessage?: string): {
    type: any;
    validate: {
        isIn: {
            args: string[][];
            msg: string;
        };
    };
};
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
export declare function createJsonType(schema?: Record<string, unknown>): {
    type: any;
    validate: {
        isValidJson: (value: unknown) => void;
    };
};
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
export declare function createArrayType(elementType: unknown, minLength?: number, maxLength?: number): {
    type: any;
    validate: {
        isValidArray: (value: unknown) => void;
    };
};
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
export declare function createDecimalType(precision: number, scale: number): {
    type: any;
    get(): any;
};
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
export declare function createUuidType(version?: 1 | 4, isPrimaryKey?: boolean): {
    type: any;
    defaultValue: any;
    primaryKey: boolean;
    allowNull: boolean;
    validate: {
        isUUID: 1 | 4;
    };
};
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
export declare function createEncryptedStringType(maxLength?: number): {
    type: any;
    get(): any;
    set(value: any): void;
};
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
export declare function Table(options?: Partial<ModelDecoratorMetadata>): ClassDecorator;
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
export declare function Column(options?: FieldDecoratorOptions): PropertyDecorator;
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
export declare function PrimaryKey(): PropertyDecorator;
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
export declare function AutoIncrement(): PropertyDecorator;
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
export declare function Unique(constraintName?: string): PropertyDecorator;
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
export declare function Index(options?: Partial<IndexBuilderConfig>): PropertyDecorator;
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
export declare function addSoftDelete<T extends Model>(model: ModelStatic<T>, config?: SoftDeleteConfig): ModelStatic<T>;
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
export declare function restoreSoftDeleted<T extends Model>(instance: T, options?: any): Promise<T>;
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
export declare function hardDelete<T extends Model>(instance: T): Promise<void>;
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
export declare function findSoftDeleted<T extends Model>(model: ModelStatic<T>, options?: FindOptions): Promise<T[]>;
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
export declare function bulkRestore<T extends Model>(model: ModelStatic<T>, where: WhereOptions): Promise<[affectedCount: number]>;
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
export declare function addDefaultScope<T extends Model>(model: ModelStatic<T>, options: FindOptions): ModelStatic<T>;
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
export declare function addNamedScope<T extends Model>(model: ModelStatic<T>, name: string, scopeFn: (...args: any[]) => FindOptions): ModelStatic<T>;
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
export declare function addMultipleScopes<T extends Model>(model: ModelStatic<T>, scopes: Record<string, FindOptions | ((...args: any[]) => FindOptions)>): ModelStatic<T>;
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
export declare function addIncludeScope<T extends Model>(model: ModelStatic<T>, scopeName: string, includes: string[]): ModelStatic<T>;
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
export declare function addAttributeScope<T extends Model>(model: ModelStatic<T>, scopeName: string, attributes: string[]): ModelStatic<T>;
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
export declare function addVirtualField<T extends Model>(model: ModelStatic<T>, fieldName: string, config: VirtualFieldConfig): ModelStatic<T>;
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
export declare function createComputedField<T = unknown>(dependencies: string[], computeFn: (...values: unknown[]) => T): VirtualFieldConfig<T>;
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
export declare function createAggregateField(association: string, operation: 'count' | 'sum' | 'avg' | 'min' | 'max', field?: string): VirtualFieldConfig;
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
export declare function createGetter<T = unknown>(transformFn: (value: unknown) => T): () => T | null;
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
export declare function createSetter(transformFn: (value: unknown) => unknown): (value: unknown) => void;
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
export declare function createNormalizer(normalizeFn: (value: unknown) => unknown): GetterSetterConfig;
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
export declare function createJsonSerializer<T = unknown>(defaultValue?: T | null): GetterSetterConfig<T>;
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
export declare function addIndex<T extends Model>(model: ModelStatic<T>, config: IndexBuilderConfig): ModelStatic<T>;
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
export declare function addCompositeIndex<T extends Model>(model: ModelStatic<T>, fields: string[], options?: Partial<IndexBuilderConfig>): ModelStatic<T>;
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
export declare function addUniqueIndex<T extends Model>(model: ModelStatic<T>, fields: string[], name?: string): ModelStatic<T>;
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
export declare function addPartialIndex<T extends Model>(model: ModelStatic<T>, fields: string[], where: WhereOptions, options?: Partial<IndexBuilderConfig>): ModelStatic<T>;
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
export declare function addCheckConstraint<T extends Model>(model: ModelStatic<T>, name: string, condition: string): ModelStatic<T>;
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
export declare function validateConstraint(constraint: ConstraintConfig): boolean;
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
export declare function getModelMetadata<T extends Model>(model: ModelStatic<T>): ModelDecoratorMetadata;
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
export declare function syncModel<T extends Model>(model: ModelStatic<T>, options?: {
    force?: boolean;
    alter?: boolean;
}): Promise<ModelStatic<T>>;
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
export declare function dropModel<T extends Model>(model: ModelStatic<T>, options?: {
    cascade?: boolean;
}): Promise<void>;
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
export declare function getModelAttributes<T extends Model>(model: ModelStatic<T>): ModelAttributes<T>;
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
export declare function hasAttribute<T extends Model>(model: ModelStatic<T>, attributeName: string): boolean;
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
export declare function getPrimaryKey<T extends Model>(model: ModelStatic<T>): string | string[];
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
export declare function refreshModel<T extends Model>(model: ModelStatic<T>): ModelStatic<T>;
//# sourceMappingURL=sequelize-model-kit.d.ts.map