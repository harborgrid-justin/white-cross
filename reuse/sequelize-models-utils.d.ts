/**
 * LOC: S1E2Q3U4E5
 * File: /reuse/sequelize-models-utils.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (v6.x)
 *   - @types/validator (v13.x)
 *   - bcrypt (v5.x)
 *
 * DOWNSTREAM (imported by):
 *   - Database model definitions
 *   - Model factories
 *   - Migration generators
 */
/**
 * File: /reuse/sequelize-models-utils.ts
 * Locator: WC-UTL-SEQ-MOD-001
 * Purpose: Sequelize Model Utilities - Comprehensive model definition and configuration helpers
 *
 * Upstream: sequelize v6.x, @types/validator, bcrypt
 * Downstream: All Sequelize models, model factories, migration utilities
 * Dependencies: Sequelize v6.x, Node 18+, TypeScript 5.x
 * Exports: 40 model utility functions for definition, validation, hooks, scopes, and configuration
 *
 * LLM Context: Production-grade Sequelize v6.x model utilities for White Cross healthcare platform.
 * Provides comprehensive helpers for model definition, attribute configuration, data type management,
 * validation, hooks, scopes, virtual attributes, getters/setters, indexes, constraints, timestamps,
 * paranoid models, factories, and method builders. HIPAA-compliant with field-level encryption and
 * audit trail support for PHI data protection.
 */
import { Model, ModelStatic, Sequelize, ModelAttributes, ModelOptions, ValidationOptions, CreateOptions, FindOptions, WhereOptions } from 'sequelize';
/**
 * Attribute configuration with validation
 */
export interface AttributeConfig {
    type: any;
    allowNull?: boolean;
    defaultValue?: any;
    unique?: boolean | string;
    primaryKey?: boolean;
    autoIncrement?: boolean;
    comment?: string;
    field?: string;
    validate?: ValidationOptions;
    get?: () => any;
    set?: (value: any) => void;
}
/**
 * Virtual attribute configuration
 */
export interface VirtualAttributeConfig {
    type: any;
    get?: () => any;
    set?: (value: any) => void;
    dependencies?: string[];
}
/**
 * Hook configuration
 */
export interface HookConfig<M extends Model> {
    beforeValidate?: (instance: M, options: any) => Promise<void> | void;
    afterValidate?: (instance: M, options: any) => Promise<void> | void;
    beforeCreate?: (instance: M, options: any) => Promise<void> | void;
    afterCreate?: (instance: M, options: any) => Promise<void> | void;
    beforeUpdate?: (instance: M, options: any) => Promise<void> | void;
    afterUpdate?: (instance: M, options: any) => Promise<void> | void;
    beforeDestroy?: (instance: M, options: any) => Promise<void> | void;
    afterDestroy?: (instance: M, options: any) => Promise<void> | void;
    beforeBulkCreate?: (instances: M[], options: any) => Promise<void> | void;
    afterBulkCreate?: (instances: M[], options: any) => Promise<void> | void;
    beforeBulkUpdate?: (options: any) => Promise<void> | void;
    afterBulkUpdate?: (options: any) => Promise<void> | void;
    beforeBulkDestroy?: (options: any) => Promise<void> | void;
    afterBulkDestroy?: (options: any) => Promise<void> | void;
}
/**
 * Scope configuration
 */
export interface ScopeConfig {
    [scopeName: string]: FindOptions | ((...args: any[]) => FindOptions);
}
/**
 * Index configuration
 */
export interface IndexConfig {
    name?: string;
    unique?: boolean;
    fields: (string | {
        name: string;
        order?: 'ASC' | 'DESC';
        length?: number;
    })[];
    using?: string;
    type?: string;
    where?: WhereOptions;
}
/**
 * Constraint configuration
 */
export interface ConstraintConfig {
    type: 'UNIQUE' | 'CHECK' | 'PRIMARY KEY' | 'FOREIGN KEY';
    name?: string;
    fields: string[];
    references?: {
        table: string;
        field: string;
    };
    onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
    onUpdate?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
}
/**
 * Model factory configuration
 */
export interface ModelFactoryConfig<T extends Model> {
    modelName: string;
    tableName?: string;
    attributes: ModelAttributes<T>;
    options?: Partial<ModelOptions<T>>;
    hooks?: HookConfig<T>;
    scopes?: ScopeConfig;
    indexes?: IndexConfig[];
    associations?: (model: ModelStatic<T>) => void;
}
/**
 * Timestamp configuration
 */
export interface TimestampConfig {
    createdAt?: boolean | string;
    updatedAt?: boolean | string;
    deletedAt?: boolean | string;
}
/**
 * Paranoid configuration
 */
export interface ParanoidConfig {
    deletedAt?: boolean | string;
    paranoid?: boolean;
    force?: boolean;
}
/**
 * Encryption configuration for PHI fields
 */
export interface EncryptionConfig {
    algorithm?: string;
    key?: string;
    iv?: string;
}
/**
 * Audit configuration
 */
export interface AuditConfig {
    userId?: string;
    action: 'CREATE' | 'UPDATE' | 'DELETE' | 'READ';
    tableName: string;
    recordId: string | number;
    changes?: any;
    metadata?: any;
}
/**
 * Creates a base model class with common fields and methods.
 * Includes id, createdAt, updatedAt, and deletedAt fields by default.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} modelName - Name of the model
 * @param {ModelAttributes<T>} attributes - Model attributes
 * @param {Partial<ModelOptions<T>>} options - Model options
 * @returns {ModelStatic<T>} Initialized model class
 *
 * @example
 * ```typescript
 * const User = createBaseModel(sequelize, 'User', {
 *   email: { type: DataTypes.STRING, unique: true },
 *   firstName: DataTypes.STRING,
 *   lastName: DataTypes.STRING
 * }, {
 *   tableName: 'users',
 *   paranoid: true
 * });
 * ```
 */
export declare function createBaseModel<T extends Model>(sequelize: Sequelize, modelName: string, attributes: ModelAttributes<T>, options?: Partial<ModelOptions<T>>): ModelStatic<T>;
/**
 * Defines a model with HIPAA-compliant field-level encryption for PHI.
 * Automatically encrypts sensitive fields and provides decryption getters.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} modelName - Name of the model
 * @param {ModelAttributes<T>} attributes - Model attributes
 * @param {string[]} encryptedFields - Fields to encrypt
 * @param {Partial<ModelOptions<T>>} options - Model options
 * @returns {ModelStatic<T>} Model with encryption support
 *
 * @example
 * ```typescript
 * const Patient = createEncryptedModel(sequelize, 'Patient', {
 *   ssn: DataTypes.STRING,
 *   medicalRecordNumber: DataTypes.STRING,
 *   diagnosis: DataTypes.TEXT
 * }, ['ssn', 'medicalRecordNumber', 'diagnosis'], {
 *   tableName: 'patients'
 * });
 * ```
 */
export declare function createEncryptedModel<T extends Model>(sequelize: Sequelize, modelName: string, attributes: ModelAttributes<T>, encryptedFields: string[], options?: Partial<ModelOptions<T>>): ModelStatic<T>;
/**
 * Creates a model with automatic audit trail logging.
 * Tracks all CREATE, UPDATE, DELETE operations with user context.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} modelName - Name of the model
 * @param {ModelAttributes<T>} attributes - Model attributes
 * @param {Partial<ModelOptions<T>>} options - Model options
 * @returns {ModelStatic<T>} Model with audit trail
 *
 * @example
 * ```typescript
 * const MedicalRecord = createAuditedModel(sequelize, 'MedicalRecord', {
 *   patientId: DataTypes.UUID,
 *   diagnosis: DataTypes.TEXT,
 *   treatmentPlan: DataTypes.TEXT
 * }, {
 *   tableName: 'medical_records'
 * });
 * ```
 */
export declare function createAuditedModel<T extends Model>(sequelize: Sequelize, modelName: string, attributes: ModelAttributes<T>, options?: Partial<ModelOptions<T>>): ModelStatic<T>;
/**
 * Extends a model with soft delete functionality.
 * Adds deletedAt column and configures paranoid mode.
 *
 * @param {ModelStatic<T>} model - Model to extend
 * @param {ParanoidConfig} config - Paranoid configuration
 * @returns {ModelStatic<T>} Extended model
 *
 * @example
 * ```typescript
 * const User = sequelize.define('User', { name: DataTypes.STRING });
 * const ParanoidUser = extendWithSoftDelete(User, {
 *   deletedAt: 'deletedAt',
 *   paranoid: true
 * });
 * ```
 */
export declare function extendWithSoftDelete<T extends Model>(model: ModelStatic<T>, config?: ParanoidConfig): ModelStatic<T>;
/**
 * Creates a model factory function for testing and seeding.
 * Generates instances with default or overridden values.
 *
 * @param {ModelStatic<T>} model - Model class
 * @param {Partial<T>} defaults - Default attribute values
 * @returns {Function} Factory function
 *
 * @example
 * ```typescript
 * const createUser = modelFactory(User, {
 *   email: 'test@example.com',
 *   firstName: 'Test',
 *   lastName: 'User',
 *   role: 'patient'
 * });
 *
 * const user1 = await createUser();
 * const user2 = await createUser({ email: 'custom@example.com' });
 * ```
 */
export declare function modelFactory<T extends Model>(model: ModelStatic<T>, defaults?: Partial<any>): (overrides?: Partial<any>) => Promise<T>;
/**
 * Creates a UUID primary key attribute configuration.
 * Uses UUIDV4 by default with automatic generation.
 *
 * @param {string} version - UUID version ('v1' or 'v4')
 * @returns {AttributeConfig} UUID attribute configuration
 *
 * @example
 * ```typescript
 * const User = sequelize.define('User', {
 *   id: createUuidAttribute('v4'),
 *   name: DataTypes.STRING
 * });
 * ```
 */
export declare function createUuidAttribute(version?: 'v1' | 'v4'): AttributeConfig;
/**
 * Creates a timestamp attribute with automatic date management.
 * Handles both creation and update timestamps.
 *
 * @param {string} type - Timestamp type ('created' or 'updated')
 * @returns {AttributeConfig} Timestamp attribute configuration
 *
 * @example
 * ```typescript
 * const Post = sequelize.define('Post', {
 *   createdAt: createTimestampAttribute('created'),
 *   updatedAt: createTimestampAttribute('updated'),
 *   publishedAt: {
 *     type: DataTypes.DATE,
 *     allowNull: true
 *   }
 * });
 * ```
 */
export declare function createTimestampAttribute(type: 'created' | 'updated'): AttributeConfig;
/**
 * Creates an email attribute with validation.
 * Validates email format and enforces uniqueness.
 *
 * @param {boolean} unique - Whether email should be unique
 * @param {boolean} allowNull - Whether null is allowed
 * @returns {AttributeConfig} Email attribute configuration
 *
 * @example
 * ```typescript
 * const User = sequelize.define('User', {
 *   email: createEmailAttribute(true, false),
 *   recoveryEmail: createEmailAttribute(false, true)
 * });
 * ```
 */
export declare function createEmailAttribute(unique?: boolean, allowNull?: boolean): AttributeConfig;
/**
 * Creates an encrypted password attribute with bcrypt hashing.
 * Automatically hashes on set, provides comparison method.
 *
 * @param {number} saltRounds - Bcrypt salt rounds (default: 10)
 * @returns {AttributeConfig} Password attribute configuration
 *
 * @example
 * ```typescript
 * const User = sequelize.define('User', {
 *   email: createEmailAttribute(),
 *   password: createPasswordAttribute(12)
 * });
 *
 * const user = await User.create({
 *   email: 'user@example.com',
 *   password: 'plain-password' // Automatically hashed
 * });
 * ```
 */
export declare function createPasswordAttribute(saltRounds?: number): AttributeConfig;
/**
 * Creates an enum attribute with validation.
 * Restricts values to specified enum options.
 *
 * @param {string[]} values - Allowed enum values
 * @param {any} defaultValue - Default value
 * @returns {AttributeConfig} Enum attribute configuration
 *
 * @example
 * ```typescript
 * const User = sequelize.define('User', {
 *   role: createEnumAttribute(['admin', 'doctor', 'nurse', 'patient'], 'patient'),
 *   status: createEnumAttribute(['active', 'inactive', 'suspended'], 'active')
 * });
 * ```
 */
export declare function createEnumAttribute(values: string[], defaultValue?: any): AttributeConfig;
/**
 * Creates a JSON attribute with parsing and validation.
 * Handles JSON serialization/deserialization automatically.
 *
 * @param {any} defaultValue - Default JSON value
 * @param {Function} validator - Custom validation function
 * @returns {AttributeConfig} JSON attribute configuration
 *
 * @example
 * ```typescript
 * const Patient = sequelize.define('Patient', {
 *   metadata: createJsonAttribute({}, (value) => {
 *     return typeof value === 'object' && !Array.isArray(value);
 *   }),
 *   allergies: createJsonAttribute([])
 * });
 * ```
 */
export declare function createJsonAttribute(defaultValue?: any, validator?: (value: any) => boolean): AttributeConfig;
/**
 * Creates a phone number attribute with validation.
 * Validates phone format and provides formatting.
 *
 * @param {string} locale - Phone locale (e.g., 'en-US')
 * @param {boolean} allowNull - Whether null is allowed
 * @returns {AttributeConfig} Phone attribute configuration
 *
 * @example
 * ```typescript
 * const Patient = sequelize.define('Patient', {
 *   phone: createPhoneAttribute('en-US', false),
 *   alternatePhone: createPhoneAttribute('en-US', true)
 * });
 * ```
 */
export declare function createPhoneAttribute(locale?: string, allowNull?: boolean): AttributeConfig;
/**
 * Creates a URL attribute with validation and normalization.
 * Validates URL format and provides protocol enforcement.
 *
 * @param {boolean} requireProtocol - Whether protocol is required
 * @param {string[]} allowedProtocols - Allowed protocols
 * @returns {AttributeConfig} URL attribute configuration
 *
 * @example
 * ```typescript
 * const Organization = sequelize.define('Organization', {
 *   website: createUrlAttribute(true, ['https']),
 *   logoUrl: createUrlAttribute(true, ['https', 'http'])
 * });
 * ```
 */
export declare function createUrlAttribute(requireProtocol?: boolean, allowedProtocols?: string[]): AttributeConfig;
/**
 * Creates a custom async validator function.
 * Useful for database lookups and external API validation.
 *
 * @param {Function} validatorFn - Async validation function
 * @param {string} errorMessage - Error message on validation failure
 * @returns {ValidationOptions} Validator configuration
 *
 * @example
 * ```typescript
 * const User = sequelize.define('User', {
 *   username: {
 *     type: DataTypes.STRING,
 *     validate: createAsyncValidator(
 *       async (value) => {
 *         const existing = await User.findOne({ where: { username: value } });
 *         return !existing;
 *       },
 *       'Username already taken'
 *     )
 *   }
 * });
 * ```
 */
export declare function createAsyncValidator(validatorFn: (value: any) => Promise<boolean>, errorMessage: string): ValidationOptions;
/**
 * Validates a value matches a regular expression pattern.
 * Provides custom error messages for pattern mismatches.
 *
 * @param {RegExp} pattern - Regular expression pattern
 * @param {string} message - Error message
 * @returns {ValidationOptions} Pattern validator
 *
 * @example
 * ```typescript
 * const Patient = sequelize.define('Patient', {
 *   medicalRecordNumber: {
 *     type: DataTypes.STRING,
 *     validate: validatePattern(/^MRN-\d{8}$/, 'MRN must be format: MRN-12345678')
 *   }
 * });
 * ```
 */
export declare function validatePattern(pattern: RegExp, message: string): ValidationOptions;
/**
 * Validates a numeric value is within a specified range.
 * Supports inclusive and exclusive boundaries.
 *
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {boolean} inclusive - Whether boundaries are inclusive
 * @returns {ValidationOptions} Range validator
 *
 * @example
 * ```typescript
 * const VitalSign = sequelize.define('VitalSign', {
 *   temperature: {
 *     type: DataTypes.FLOAT,
 *     validate: validateRange(95.0, 106.0, true)
 *   },
 *   heartRate: {
 *     type: DataTypes.INTEGER,
 *     validate: validateRange(40, 200, true)
 *   }
 * });
 * ```
 */
export declare function validateRange(min: number, max: number, inclusive?: boolean): ValidationOptions;
/**
 * Validates a date is within a specified range.
 * Useful for birth dates, appointment dates, etc.
 *
 * @param {Date} minDate - Minimum date
 * @param {Date} maxDate - Maximum date
 * @returns {ValidationOptions} Date range validator
 *
 * @example
 * ```typescript
 * const Patient = sequelize.define('Patient', {
 *   dateOfBirth: {
 *     type: DataTypes.DATE,
 *     validate: validateDateRange(
 *       new Date('1900-01-01'),
 *       new Date()
 *     )
 *   }
 * });
 * ```
 */
export declare function validateDateRange(minDate: Date, maxDate: Date): ValidationOptions;
/**
 * Creates a conditional validation based on another field's value.
 * Enables complex validation logic across multiple fields.
 *
 * @param {string} dependentField - Field to check
 * @param {any} dependentValue - Value that triggers validation
 * @param {ValidationOptions} validation - Validation to apply
 * @returns {ValidationOptions} Conditional validator
 *
 * @example
 * ```typescript
 * const Prescription = sequelize.define('Prescription', {
 *   medicationType: createEnumAttribute(['controlled', 'standard']),
 *   deaNumber: {
 *     type: DataTypes.STRING,
 *     validate: createConditionalValidation(
 *       'medicationType',
 *       'controlled',
 *       { notEmpty: true, len: [9, 9] }
 *     )
 *   }
 * });
 * ```
 */
export declare function createConditionalValidation(dependentField: string, dependentValue: any, validation: ValidationOptions): ValidationOptions;
/**
 * Creates a password hashing hook for authentication models.
 * Automatically hashes passwords before create and update.
 *
 * @param {string} passwordField - Name of password field
 * @param {number} saltRounds - Bcrypt salt rounds
 * @returns {HookConfig<T>} Password hashing hooks
 *
 * @example
 * ```typescript
 * const User = sequelize.define('User', {
 *   email: DataTypes.STRING,
 *   password: DataTypes.STRING
 * }, {
 *   hooks: createPasswordHashHook('password', 12)
 * });
 * ```
 */
export declare function createPasswordHashHook<T extends Model>(passwordField?: string, saltRounds?: number): HookConfig<T>;
/**
 * Creates audit logging hooks for tracking all model changes.
 * Logs CREATE, UPDATE, DELETE operations with user context.
 *
 * @param {string} modelName - Name of the model
 * @param {Function} logger - Logging function
 * @returns {HookConfig<T>} Audit logging hooks
 *
 * @example
 * ```typescript
 * const MedicalRecord = sequelize.define('MedicalRecord', attributes, {
 *   hooks: createAuditHooks('MedicalRecord', async (auditData) => {
 *     await AuditLog.create(auditData);
 *   })
 * });
 * ```
 */
export declare function createAuditHooks<T extends Model>(modelName: string, logger: (audit: AuditConfig) => Promise<void>): HookConfig<T>;
/**
 * Creates timestamp management hooks.
 * Automatically manages createdAt, updatedAt, createdBy, updatedBy fields.
 *
 * @returns {HookConfig<T>} Timestamp hooks
 *
 * @example
 * ```typescript
 * const Document = sequelize.define('Document', {
 *   title: DataTypes.STRING,
 *   createdBy: DataTypes.UUID,
 *   updatedBy: DataTypes.UUID
 * }, {
 *   hooks: createTimestampHooks()
 * });
 * ```
 */
export declare function createTimestampHooks<T extends Model>(): HookConfig<T>;
/**
 * Creates validation hooks with custom error formatting.
 * Provides consistent error messages across the application.
 *
 * @param {Function} errorFormatter - Error formatting function
 * @returns {HookConfig<T>} Validation hooks
 *
 * @example
 * ```typescript
 * const User = sequelize.define('User', attributes, {
 *   hooks: createValidationHooks((errors) => {
 *     return errors.map(e => ({
 *       field: e.path,
 *       message: e.message,
 *       code: 'VALIDATION_ERROR'
 *     }));
 *   })
 * });
 * ```
 */
export declare function createValidationHooks<T extends Model>(errorFormatter: (errors: any[]) => any[]): HookConfig<T>;
/**
 * Creates cascade delete hooks for maintaining referential integrity.
 * Automatically deletes or nullifies related records.
 *
 * @param {Array<{model: ModelStatic<any>, foreignKey: string, action: 'delete' | 'nullify'}>} relations - Relations to cascade
 * @returns {HookConfig<T>} Cascade hooks
 *
 * @example
 * ```typescript
 * const User = sequelize.define('User', attributes, {
 *   hooks: createCascadeHooks([
 *     { model: Post, foreignKey: 'userId', action: 'delete' },
 *     { model: Comment, foreignKey: 'authorId', action: 'nullify' }
 *   ])
 * });
 * ```
 */
export declare function createCascadeHooks<T extends Model>(relations: Array<{
    model: ModelStatic<any>;
    foreignKey: string;
    action: 'delete' | 'nullify';
}>): HookConfig<T>;
/**
 * Creates a pagination scope for large datasets.
 * Provides limit/offset based pagination.
 *
 * @param {number} defaultLimit - Default items per page
 * @returns {Function} Parameterized scope function
 *
 * @example
 * ```typescript
 * const User = sequelize.define('User', attributes, {
 *   scopes: {
 *     paginated: createPaginationScope(20)
 *   }
 * });
 *
 * const users = await User.scope({ method: ['paginated', 2, 20] }).findAll();
 * ```
 */
export declare function createPaginationScope(defaultLimit?: number): (page: number, limit?: number) => FindOptions;
/**
 * Creates a date range scope for filtering by date columns.
 * Supports various date filtering patterns.
 *
 * @param {string} dateField - Name of date field
 * @returns {Function} Date range scope function
 *
 * @example
 * ```typescript
 * const Appointment = sequelize.define('Appointment', attributes, {
 *   scopes: {
 *     dateRange: createDateRangeScope('appointmentDate')
 *   }
 * });
 *
 * const appointments = await Appointment.scope({
 *   method: ['dateRange', '2024-01-01', '2024-12-31']
 * }).findAll();
 * ```
 */
export declare function createDateRangeScope(dateField: string): (startDate: Date, endDate: Date) => FindOptions;
/**
 * Creates a search scope with multiple field matching.
 * Performs case-insensitive LIKE searches across specified fields.
 *
 * @param {string[]} searchFields - Fields to search
 * @returns {Function} Search scope function
 *
 * @example
 * ```typescript
 * const Patient = sequelize.define('Patient', attributes, {
 *   scopes: {
 *     search: createSearchScope(['firstName', 'lastName', 'email', 'phone'])
 *   }
 * });
 *
 * const results = await Patient.scope({ method: ['search', 'john'] }).findAll();
 * ```
 */
export declare function createSearchScope(searchFields: string[]): (query: string) => FindOptions;
/**
 * Creates a scope for filtering by related model attributes.
 * Enables complex filtering through associations.
 *
 * @param {string} associationName - Name of association
 * @param {WhereOptions} conditions - Filter conditions
 * @returns {FindOptions} Include scope
 *
 * @example
 * ```typescript
 * const Patient = sequelize.define('Patient', attributes, {
 *   scopes: {
 *     withActiveAppointments: createIncludeScope('Appointments', {
 *       status: 'scheduled'
 *     })
 *   }
 * });
 * ```
 */
export declare function createIncludeScope(associationName: string, conditions?: WhereOptions): FindOptions;
/**
 * Creates a scope for soft-deleted records.
 * Allows querying paranoid models including deleted records.
 *
 * @param {boolean} includeDeleted - Whether to include deleted
 * @returns {FindOptions} Paranoid scope
 *
 * @example
 * ```typescript
 * const User = sequelize.define('User', attributes, {
 *   paranoid: true,
 *   scopes: {
 *     withDeleted: createParanoidScope(true),
 *     onlyDeleted: createParanoidScope(false)
 *   }
 * });
 * ```
 */
export declare function createParanoidScope(includeDeleted?: boolean): FindOptions;
/**
 * Creates a virtual attribute that combines multiple fields.
 * Useful for computed display values.
 *
 * @param {string[]} fields - Fields to combine
 * @param {string} separator - Separator between fields
 * @returns {VirtualAttributeConfig} Virtual attribute config
 *
 * @example
 * ```typescript
 * const Patient = sequelize.define('Patient', {
 *   firstName: DataTypes.STRING,
 *   lastName: DataTypes.STRING,
 *   fullName: {
 *     type: DataTypes.VIRTUAL,
 *     ...createCombinedVirtual(['firstName', 'lastName'], ' ')
 *   }
 * });
 * ```
 */
export declare function createCombinedVirtual(fields: string[], separator?: string): VirtualAttributeConfig;
/**
 * Creates a virtual attribute for age calculation from birthdate.
 * Automatically calculates current age in years.
 *
 * @param {string} birthDateField - Name of birth date field
 * @returns {VirtualAttributeConfig} Virtual age attribute
 *
 * @example
 * ```typescript
 * const Patient = sequelize.define('Patient', {
 *   dateOfBirth: DataTypes.DATE,
 *   age: {
 *     type: DataTypes.VIRTUAL,
 *     ...createAgeVirtual('dateOfBirth')
 *   }
 * });
 * ```
 */
export declare function createAgeVirtual(birthDateField?: string): VirtualAttributeConfig;
/**
 * Creates a virtual attribute for formatted phone numbers.
 * Formats raw phone numbers for display.
 *
 * @param {string} phoneField - Name of phone field
 * @param {string} format - Phone format pattern
 * @returns {VirtualAttributeConfig} Virtual formatted phone
 *
 * @example
 * ```typescript
 * const Patient = sequelize.define('Patient', {
 *   phone: DataTypes.STRING,
 *   formattedPhone: {
 *     type: DataTypes.VIRTUAL,
 *     ...createPhoneFormatVirtual('phone', '(###) ###-####')
 *   }
 * });
 * ```
 */
export declare function createPhoneFormatVirtual(phoneField?: string, format?: string): VirtualAttributeConfig;
/**
 * Creates a virtual attribute for computing time differences.
 * Calculates duration between two timestamp fields.
 *
 * @param {string} startField - Start timestamp field
 * @param {string} endField - End timestamp field
 * @param {string} unit - Time unit ('hours', 'days', 'minutes')
 * @returns {VirtualAttributeConfig} Virtual duration attribute
 *
 * @example
 * ```typescript
 * const Appointment = sequelize.define('Appointment', {
 *   startTime: DataTypes.DATE,
 *   endTime: DataTypes.DATE,
 *   durationMinutes: {
 *     type: DataTypes.VIRTUAL,
 *     ...createDurationVirtual('startTime', 'endTime', 'minutes')
 *   }
 * });
 * ```
 */
export declare function createDurationVirtual(startField: string, endField: string, unit?: 'milliseconds' | 'seconds' | 'minutes' | 'hours' | 'days'): VirtualAttributeConfig;
/**
 * Creates a unique composite index configuration.
 * Enforces uniqueness across multiple columns.
 *
 * @param {string} name - Index name
 * @param {string[]} fields - Fields in the index
 * @returns {IndexConfig} Index configuration
 *
 * @example
 * ```typescript
 * const Appointment = sequelize.define('Appointment', attributes, {
 *   indexes: [
 *     createUniqueIndex('unique_patient_datetime', ['patientId', 'appointmentDate'])
 *   ]
 * });
 * ```
 */
export declare function createUniqueIndex(name: string, fields: string[]): IndexConfig;
/**
 * Creates a full-text search index configuration.
 * Enables efficient text searching on specified columns.
 *
 * @param {string} name - Index name
 * @param {string[]} fields - Fields to index
 * @returns {IndexConfig} Full-text index configuration
 *
 * @example
 * ```typescript
 * const MedicalRecord = sequelize.define('MedicalRecord', attributes, {
 *   indexes: [
 *     createFullTextIndex('medical_record_search', ['diagnosis', 'symptoms', 'notes'])
 *   ]
 * });
 * ```
 */
export declare function createFullTextIndex(name: string, fields: string[]): IndexConfig;
/**
 * Creates a partial index with WHERE clause.
 * Indexes only rows matching specified conditions.
 *
 * @param {string} name - Index name
 * @param {string[]} fields - Fields to index
 * @param {WhereOptions} where - Filter condition
 * @returns {IndexConfig} Partial index configuration
 *
 * @example
 * ```typescript
 * const User = sequelize.define('User', attributes, {
 *   indexes: [
 *     createPartialIndex('active_users_email', ['email'], { active: true })
 *   ]
 * });
 * ```
 */
export declare function createPartialIndex(name: string, fields: string[], where: WhereOptions): IndexConfig;
/**
 * Creates a composite index with custom field ordering.
 * Optimizes queries with multiple sort orders.
 *
 * @param {string} name - Index name
 * @param {Array<{field: string, order: 'ASC' | 'DESC'}>} fields - Fields with order
 * @returns {IndexConfig} Composite index configuration
 *
 * @example
 * ```typescript
 * const Appointment = sequelize.define('Appointment', attributes, {
 *   indexes: [
 *     createCompositeIndex('appointment_search', [
 *       { field: 'patientId', order: 'ASC' },
 *       { field: 'appointmentDate', order: 'DESC' }
 *     ])
 *   ]
 * });
 * ```
 */
export declare function createCompositeIndex(name: string, fields: Array<{
    field: string;
    order: 'ASC' | 'DESC';
}>): IndexConfig;
/**
 * Creates a getter that formats currency values.
 * Converts stored cents to dollar amounts.
 *
 * @param {string} field - Field name
 * @param {string} currency - Currency symbol
 * @returns {Function} Getter function
 *
 * @example
 * ```typescript
 * const Invoice = sequelize.define('Invoice', {
 *   amountCents: DataTypes.INTEGER,
 *   amount: {
 *     type: DataTypes.VIRTUAL,
 *     get: createCurrencyGetter('amountCents', '$')
 *   }
 * });
 * ```
 */
export declare function createCurrencyGetter(field: string, currency?: string): () => string | null;
/**
 * Creates a setter that stores currency as cents.
 * Converts dollar amounts to cents for storage.
 *
 * @param {string} field - Field name
 * @returns {Function} Setter function
 *
 * @example
 * ```typescript
 * const Invoice = sequelize.define('Invoice', {
 *   amountCents: {
 *     type: DataTypes.INTEGER,
 *     set: createCurrencySetter('amountCents')
 *   }
 * });
 * ```
 */
export declare function createCurrencySetter(field: string): (value: number | string) => void;
/**
 * Creates a getter that parses JSON strings.
 * Safely parses stored JSON data.
 *
 * @param {string} field - Field name
 * @param {any} defaultValue - Default value on parse error
 * @returns {Function} Getter function
 *
 * @example
 * ```typescript
 * const Patient = sequelize.define('Patient', {
 *   metadata: {
 *     type: DataTypes.TEXT,
 *     get: createJsonGetter('metadata', {})
 *   }
 * });
 * ```
 */
export declare function createJsonGetter(field: string, defaultValue?: any): () => any;
/**
 * Creates a setter that stringifies JSON objects.
 * Safely stores objects as JSON strings.
 *
 * @param {string} field - Field name
 * @returns {Function} Setter function
 *
 * @example
 * ```typescript
 * const Patient = sequelize.define('Patient', {
 *   metadata: {
 *     type: DataTypes.TEXT,
 *     set: createJsonSetter('metadata')
 *   }
 * });
 * ```
 */
export declare function createJsonSetter(field: string): (value: any) => void;
/**
 * Adds a password comparison method to authentication models.
 * Compares plain text password with hashed password.
 *
 * @param {ModelStatic<T>} model - Model class
 * @param {string} passwordField - Name of password field
 * @returns {void}
 *
 * @example
 * ```typescript
 * addPasswordCompareMethod(User, 'password');
 *
 * const user = await User.findOne({ where: { email: 'user@example.com' } });
 * const isValid = await user.comparePassword('plain-password');
 * ```
 */
export declare function addPasswordCompareMethod<T extends Model>(model: ModelStatic<T>, passwordField?: string): void;
/**
 * Adds a toJSON method that excludes sensitive fields.
 * Filters out password, tokens, and other sensitive data.
 *
 * @param {ModelStatic<T>} model - Model class
 * @param {string[]} excludeFields - Fields to exclude
 * @returns {void}
 *
 * @example
 * ```typescript
 * addSafeJsonMethod(User, ['password', 'resetToken', 'refreshToken']);
 *
 * const user = await User.findOne({ where: { id: userId } });
 * const safeData = user.toJSON(); // password excluded
 * ```
 */
export declare function addSafeJsonMethod<T extends Model>(model: ModelStatic<T>, excludeFields: string[]): void;
/**
 * Adds a findByEmail class method for user lookups.
 * Provides convenient email-based user retrieval.
 *
 * @param {ModelStatic<T>} model - Model class
 * @param {string} emailField - Name of email field
 * @returns {void}
 *
 * @example
 * ```typescript
 * addFindByEmailMethod(User, 'email');
 *
 * const user = await User.findByEmail('user@example.com');
 * ```
 */
export declare function addFindByEmailMethod<T extends Model>(model: ModelStatic<T>, emailField?: string): void;
/**
 * Adds a soft delete method that preserves data.
 * Sets deletedAt timestamp instead of removing record.
 *
 * @param {ModelStatic<T>} model - Model class
 * @returns {void}
 *
 * @example
 * ```typescript
 * addSoftDeleteMethod(User);
 *
 * const user = await User.findByPk(userId);
 * await user.softDelete();
 * ```
 */
export declare function addSoftDeleteMethod<T extends Model>(model: ModelStatic<T>): void;
/**
 * Validates model instance against all configured validators.
 * Provides detailed validation error reporting.
 *
 * @param {T} instance - Model instance
 * @returns {Promise<boolean>} Validation result
 *
 * @example
 * ```typescript
 * const user = User.build({ email: 'invalid-email' });
 * const isValid = await validateModelInstance(user);
 * if (!isValid) {
 *   console.error(user.errors);
 * }
 * ```
 */
export declare function validateModelInstance<T extends Model>(instance: T): Promise<boolean>;
/**
 * Bulk creates models with validation and transaction support.
 * Efficient batch creation with error handling.
 *
 * @param {ModelStatic<T>} model - Model class
 * @param {any[]} records - Records to create
 * @param {CreateOptions} options - Creation options
 * @returns {Promise<T[]>} Created instances
 *
 * @example
 * ```typescript
 * const patients = await bulkCreateWithValidation(Patient, [
 *   { firstName: 'John', lastName: 'Doe' },
 *   { firstName: 'Jane', lastName: 'Smith' }
 * ], { validate: true, returning: true });
 * ```
 */
export declare function bulkCreateWithValidation<T extends Model>(model: ModelStatic<T>, records: any[], options?: CreateOptions): Promise<T[]>;
//# sourceMappingURL=sequelize-models-utils.d.ts.map