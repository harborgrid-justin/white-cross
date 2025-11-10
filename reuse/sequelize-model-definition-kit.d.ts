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
import { Model, ModelAttributes, InitOptions, IndexesOptions, ModelValidateOptions, ModelHooks } from 'sequelize';
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
    scopes?: {
        [scopeName: string]: any;
    };
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
    unique?: boolean | string | {
        name: string;
        msg?: string;
    };
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
    fields: (string | {
        name: string;
        length?: number;
        order?: string;
    })[];
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
    dataRetention?: number;
    anonymization?: boolean;
}
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
export declare const createBaseModel: (modelName: string, attributes: ModelAttributes, config: ModelDefinitionConfig) => typeof Model;
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
export declare const createHipaaCompliantModel: (modelName: string, attributes: ModelAttributes, hipaaConfig: HipaaComplianceConfig) => ModelDefinitionConfig;
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
export declare const createModelWithDefaults: (options: Partial<InitOptions>) => InitOptions;
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
export declare const buildPrimaryKeyAttribute: (fieldName?: string) => AttributeBuilderConfig;
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
export declare const buildTimestampAttributes: (includeDeleted?: boolean) => ModelAttributes;
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
export declare const buildAuditAttributes: (config: AuditFieldConfig) => ModelAttributes;
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
export declare const buildForeignKeyAttribute: (referencedTable: string, referencedField?: string, allowNull?: boolean) => AttributeBuilderConfig;
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
export declare const buildEncryptedAttribute: (fieldName: string, maxLength?: number) => AttributeBuilderConfig;
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
export declare const buildEnumAttribute: (values: string[], defaultValue?: string) => AttributeBuilderConfig;
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
export declare const createJsonbAttribute: (defaultValue?: any, allowNull?: boolean) => AttributeBuilderConfig;
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
export declare const createDateOnlyAttribute: (allowNull?: boolean) => AttributeBuilderConfig;
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
export declare const createDecimalAttribute: (precision?: number, scale?: number) => AttributeBuilderConfig;
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
export declare const createTextAttribute: (allowNull?: boolean) => AttributeBuilderConfig;
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
export declare const createBooleanAttribute: (defaultValue?: boolean) => AttributeBuilderConfig;
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
export declare const buildEmailValidation: () => object;
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
export declare const buildPhoneValidation: () => object;
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
export declare const buildPasswordValidation: () => object;
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
export declare const buildCustomValidation: (config: ValidationRuleConfig) => object;
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
export declare const buildUrlValidation: () => object;
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
export declare const buildDateRangeValidation: (minDate?: Date, maxDate?: Date) => object;
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
export declare const createAuditHook: (userIdField?: string) => Partial<ModelHooks>;
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
export declare const createTimestampHook: () => Partial<ModelHooks>;
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
export declare const createSlugGenerationHook: (sourceField: string, targetField?: string) => Partial<ModelHooks>;
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
export declare const createValidationHook: (validator: (instance: any) => Promise<void>) => Partial<ModelHooks>;
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
export declare const createEncryptionHook: (fieldsToEncrypt: string[], encryptFn: (value: string) => string, decryptFn: (value: string) => string) => Partial<ModelHooks>;
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
export declare const createActiveScope: () => object;
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
export declare const createDateRangeScope: (dateField: string) => Function;
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
export declare const createPaginationScope: () => Function;
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
export declare const createSortScope: (defaultField: string, defaultOrder?: string) => Function;
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
export declare const createSearchScope: (searchFields: string[]) => Function;
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
export declare const createVirtualAttribute: (config: VirtualAttributeConfig) => object;
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
export declare const createComputedField: (fieldName: string, computeFn: () => any) => object;
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
export declare const createFullNameGetter: (firstNameField?: string, lastNameField?: string) => object;
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
export declare const generateUuidDefault: () => any;
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
export declare const generateTimestampDefault: () => any;
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
export declare const generateSequentialDefault: (start?: number) => Function;
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
export declare const createUniqueIndex: (fields: string[], name?: string) => IndexesOptions;
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
export declare const createCompositeIndex: (fields: string[], name?: string) => IndexesOptions;
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
export declare const createPartialIndex: (fields: string[], whereClause: object, name?: string) => IndexesOptions;
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
export declare const createFullTextIndex: (fields: string[], name?: string) => IndexesOptions;
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
export declare const buildUniqueConstraint: (fields: string[], name?: string) => object;
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
export declare const buildCheckConstraint: (name: string, expression: string) => object;
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
export declare const extendModelWithMethods: (model: typeof Model, instanceMethods: {
    [key: string]: Function;
}, classMethods: {
    [key: string]: Function;
}) => typeof Model;
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
export declare const createModelMixin: (mixin: {
    attributes?: ModelAttributes;
    hooks?: Partial<ModelHooks>;
    scopes?: object;
    indexes?: IndexesOptions[];
}) => object;
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
export declare const applyMixinToModel: (options: InitOptions, mixin: any) => InitOptions;
declare const _default: {
    createBaseModel: (modelName: string, attributes: ModelAttributes, config: ModelDefinitionConfig) => typeof Model;
    createHipaaCompliantModel: (modelName: string, attributes: ModelAttributes, hipaaConfig: HipaaComplianceConfig) => ModelDefinitionConfig;
    createModelWithDefaults: (options: Partial<InitOptions>) => InitOptions;
    buildPrimaryKeyAttribute: (fieldName?: string) => AttributeBuilderConfig;
    buildTimestampAttributes: (includeDeleted?: boolean) => ModelAttributes;
    buildAuditAttributes: (config: AuditFieldConfig) => ModelAttributes;
    buildForeignKeyAttribute: (referencedTable: string, referencedField?: string, allowNull?: boolean) => AttributeBuilderConfig;
    buildEncryptedAttribute: (fieldName: string, maxLength?: number) => AttributeBuilderConfig;
    buildEnumAttribute: (values: string[], defaultValue?: string) => AttributeBuilderConfig;
    createJsonbAttribute: (defaultValue?: any, allowNull?: boolean) => AttributeBuilderConfig;
    createDateOnlyAttribute: (allowNull?: boolean) => AttributeBuilderConfig;
    createDecimalAttribute: (precision?: number, scale?: number) => AttributeBuilderConfig;
    createTextAttribute: (allowNull?: boolean) => AttributeBuilderConfig;
    createBooleanAttribute: (defaultValue?: boolean) => AttributeBuilderConfig;
    buildEmailValidation: () => object;
    buildPhoneValidation: () => object;
    buildPasswordValidation: () => object;
    buildCustomValidation: (config: ValidationRuleConfig) => object;
    buildUrlValidation: () => object;
    buildDateRangeValidation: (minDate?: Date, maxDate?: Date) => object;
    createAuditHook: (userIdField?: string) => Partial<ModelHooks>;
    createTimestampHook: () => Partial<ModelHooks>;
    createSlugGenerationHook: (sourceField: string, targetField?: string) => Partial<ModelHooks>;
    createValidationHook: (validator: (instance: any) => Promise<void>) => Partial<ModelHooks>;
    createEncryptionHook: (fieldsToEncrypt: string[], encryptFn: (value: string) => string, decryptFn: (value: string) => string) => Partial<ModelHooks>;
    createActiveScope: () => object;
    createDateRangeScope: (dateField: string) => Function;
    createPaginationScope: () => Function;
    createSortScope: (defaultField: string, defaultOrder?: string) => Function;
    createSearchScope: (searchFields: string[]) => Function;
    createVirtualAttribute: (config: VirtualAttributeConfig) => object;
    createComputedField: (fieldName: string, computeFn: () => any) => object;
    createFullNameGetter: (firstNameField?: string, lastNameField?: string) => object;
    generateUuidDefault: () => any;
    generateTimestampDefault: () => any;
    generateSequentialDefault: (start?: number) => Function;
    createUniqueIndex: (fields: string[], name?: string) => IndexesOptions;
    createCompositeIndex: (fields: string[], name?: string) => IndexesOptions;
    createPartialIndex: (fields: string[], whereClause: object, name?: string) => IndexesOptions;
    createFullTextIndex: (fields: string[], name?: string) => IndexesOptions;
    buildUniqueConstraint: (fields: string[], name?: string) => object;
    buildCheckConstraint: (name: string, expression: string) => object;
    extendModelWithMethods: (model: typeof Model, instanceMethods: {
        [key: string]: Function;
    }, classMethods: {
        [key: string]: Function;
    }) => typeof Model;
    createModelMixin: (mixin: {
        attributes?: ModelAttributes;
        hooks?: Partial<ModelHooks>;
        scopes?: object;
        indexes?: IndexesOptions[];
    }) => object;
    applyMixinToModel: (options: InitOptions, mixin: any) => InitOptions;
};
export default _default;
//# sourceMappingURL=sequelize-model-definition-kit.d.ts.map