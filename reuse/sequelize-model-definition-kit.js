"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyMixinToModel = exports.createModelMixin = exports.extendModelWithMethods = exports.buildCheckConstraint = exports.buildUniqueConstraint = exports.createFullTextIndex = exports.createPartialIndex = exports.createCompositeIndex = exports.createUniqueIndex = exports.generateSequentialDefault = exports.generateTimestampDefault = exports.generateUuidDefault = exports.createFullNameGetter = exports.createComputedField = exports.createVirtualAttribute = exports.createSearchScope = exports.createSortScope = exports.createPaginationScope = exports.createDateRangeScope = exports.createActiveScope = exports.createEncryptionHook = exports.createValidationHook = exports.createSlugGenerationHook = exports.createTimestampHook = exports.createAuditHook = exports.buildDateRangeValidation = exports.buildUrlValidation = exports.buildCustomValidation = exports.buildPasswordValidation = exports.buildPhoneValidation = exports.buildEmailValidation = exports.createBooleanAttribute = exports.createTextAttribute = exports.createDecimalAttribute = exports.createDateOnlyAttribute = exports.createJsonbAttribute = exports.buildEnumAttribute = exports.buildEncryptedAttribute = exports.buildForeignKeyAttribute = exports.buildAuditAttributes = exports.buildTimestampAttributes = exports.buildPrimaryKeyAttribute = exports.createModelWithDefaults = exports.createHipaaCompliantModel = exports.createBaseModel = void 0;
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
const sequelize_1 = require("sequelize");
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
const createBaseModel = (modelName, attributes, config) => {
    class BaseModel extends sequelize_1.Model {
        static associate(models) {
            // Override in extended models
        }
    }
    Object.defineProperty(BaseModel, 'name', { value: modelName });
    return BaseModel;
};
exports.createBaseModel = createBaseModel;
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
const createHipaaCompliantModel = (modelName, attributes, hipaaConfig) => {
    const config = {
        tableName: modelName.toLowerCase(),
        timestamps: true,
        paranoid: true,
        underscored: true,
        hooks: {},
    };
    if (hipaaConfig.auditTrail) {
        config.hooks = {
            ...config.hooks,
            beforeCreate: async (instance, options) => {
                instance.createdBy = options.userId || 'system';
                instance.createdIp = options.ipAddress;
            },
            beforeUpdate: async (instance, options) => {
                instance.updatedBy = options.userId || 'system';
                instance.updatedIp = options.ipAddress;
            },
            beforeDestroy: async (instance, options) => {
                instance.deletedBy = options.userId || 'system';
                instance.deletedIp = options.ipAddress;
            },
        };
    }
    return config;
};
exports.createHipaaCompliantModel = createHipaaCompliantModel;
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
const createModelWithDefaults = (options) => {
    return {
        timestamps: true,
        paranoid: true,
        underscored: true,
        freezeTableName: true,
        ...options,
    };
};
exports.createModelWithDefaults = createModelWithDefaults;
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
const buildPrimaryKeyAttribute = (fieldName = 'id') => {
    return {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        comment: `Primary key for ${fieldName}`,
    };
};
exports.buildPrimaryKeyAttribute = buildPrimaryKeyAttribute;
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
const buildTimestampAttributes = (includeDeleted = true) => {
    const timestamps = {
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            comment: 'Record creation timestamp',
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            comment: 'Record last update timestamp',
        },
    };
    if (includeDeleted) {
        timestamps.deletedAt = {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Soft delete timestamp',
        };
    }
    return timestamps;
};
exports.buildTimestampAttributes = buildTimestampAttributes;
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
const buildAuditAttributes = (config) => {
    const auditFields = {};
    if (config.createdBy) {
        auditFields.createdBy = {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'User who created this record',
        };
    }
    if (config.updatedBy) {
        auditFields.updatedBy = {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'User who last updated this record',
        };
    }
    if (config.deletedBy) {
        auditFields.deletedBy = {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'User who deleted this record',
        };
    }
    if (config.ipAddress) {
        auditFields.createdIp = {
            type: sequelize_1.DataTypes.STRING(45),
            allowNull: true,
            comment: 'IP address of record creator',
        };
        auditFields.updatedIp = {
            type: sequelize_1.DataTypes.STRING(45),
            allowNull: true,
            comment: 'IP address of last updater',
        };
    }
    if (config.userAgent) {
        auditFields.userAgent = {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'User agent of last modifier',
        };
    }
    return auditFields;
};
exports.buildAuditAttributes = buildAuditAttributes;
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
const buildForeignKeyAttribute = (referencedTable, referencedField = 'id', allowNull = false) => {
    return {
        type: sequelize_1.DataTypes.UUID,
        allowNull,
        comment: `Foreign key to ${referencedTable}.${referencedField}`,
    };
};
exports.buildForeignKeyAttribute = buildForeignKeyAttribute;
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
const buildEncryptedAttribute = (fieldName, maxLength = 500) => {
    return {
        type: sequelize_1.DataTypes.STRING(maxLength),
        allowNull: true,
        comment: `Encrypted ${fieldName} (PHI)`,
        validate: {
            notEmpty: true,
        },
    };
};
exports.buildEncryptedAttribute = buildEncryptedAttribute;
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
const buildEnumAttribute = (values, defaultValue) => {
    return {
        type: sequelize_1.DataTypes.ENUM(...values),
        allowNull: false,
        defaultValue: defaultValue || values[0],
        validate: {
            isIn: [values],
        },
        comment: `Allowed values: ${values.join(', ')}`,
    };
};
exports.buildEnumAttribute = buildEnumAttribute;
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
const createJsonbAttribute = (defaultValue = {}, allowNull = false) => {
    return {
        type: sequelize_1.DataTypes.JSONB,
        allowNull,
        defaultValue,
        comment: 'JSONB data storage',
    };
};
exports.createJsonbAttribute = createJsonbAttribute;
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
const createDateOnlyAttribute = (allowNull = false) => {
    return {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull,
        comment: 'Date without time component',
        validate: {
            isDate: true,
        },
    };
};
exports.createDateOnlyAttribute = createDateOnlyAttribute;
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
const createDecimalAttribute = (precision = 10, scale = 2) => {
    return {
        type: sequelize_1.DataTypes.DECIMAL(precision, scale),
        allowNull: false,
        defaultValue: 0,
        comment: `Decimal value with ${precision} digits, ${scale} decimal places`,
    };
};
exports.createDecimalAttribute = createDecimalAttribute;
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
const createTextAttribute = (allowNull = true) => {
    return {
        type: sequelize_1.DataTypes.TEXT,
        allowNull,
        comment: 'Long-form text content',
    };
};
exports.createTextAttribute = createTextAttribute;
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
const createBooleanAttribute = (defaultValue = false) => {
    return {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue,
        comment: `Boolean flag (default: ${defaultValue})`,
    };
};
exports.createBooleanAttribute = createBooleanAttribute;
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
const buildEmailValidation = () => {
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
exports.buildEmailValidation = buildEmailValidation;
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
const buildPhoneValidation = () => {
    return {
        is: {
            args: /^[\+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/,
            msg: 'Must be a valid phone number (supports international formats)',
        },
    };
};
exports.buildPhoneValidation = buildPhoneValidation;
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
const buildPasswordValidation = () => {
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
exports.buildPasswordValidation = buildPasswordValidation;
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
const buildCustomValidation = (config) => {
    return {
        customValidator(value) {
            const isValid = config.validator(value);
            if (!isValid) {
                throw new Error(config.message);
            }
        },
    };
};
exports.buildCustomValidation = buildCustomValidation;
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
const buildUrlValidation = () => {
    return {
        isUrl: {
            msg: 'Must be a valid URL',
        },
    };
};
exports.buildUrlValidation = buildUrlValidation;
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
const buildDateRangeValidation = (minDate, maxDate) => {
    const validation = {};
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
exports.buildDateRangeValidation = buildDateRangeValidation;
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
const createAuditHook = (userIdField = 'userId') => {
    return {
        beforeCreate: async (instance, options) => {
            instance.createdBy = options[userIdField] || options.userId;
            instance.createdAt = new Date();
        },
        beforeUpdate: async (instance, options) => {
            instance.updatedBy = options[userIdField] || options.userId;
            instance.updatedAt = new Date();
        },
        beforeDestroy: async (instance, options) => {
            if (instance.deletedBy !== undefined) {
                instance.deletedBy = options[userIdField] || options.userId;
            }
        },
    };
};
exports.createAuditHook = createAuditHook;
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
const createTimestampHook = () => {
    return {
        beforeCreate: async (instance) => {
            const now = new Date();
            instance.createdAt = now;
            instance.updatedAt = now;
        },
        beforeUpdate: async (instance) => {
            instance.updatedAt = new Date();
        },
    };
};
exports.createTimestampHook = createTimestampHook;
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
const createSlugGenerationHook = (sourceField, targetField = 'slug') => {
    const generateSlug = (text) => {
        return text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };
    return {
        beforeValidate: async (instance) => {
            if (instance[sourceField] && !instance[targetField]) {
                instance[targetField] = generateSlug(instance[sourceField]);
            }
        },
    };
};
exports.createSlugGenerationHook = createSlugGenerationHook;
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
const createValidationHook = (validator) => {
    return {
        beforeValidate: validator,
    };
};
exports.createValidationHook = createValidationHook;
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
const createEncryptionHook = (fieldsToEncrypt, encryptFn, decryptFn) => {
    return {
        beforeCreate: async (instance) => {
            fieldsToEncrypt.forEach((field) => {
                if (instance[field]) {
                    instance[field] = encryptFn(instance[field]);
                }
            });
        },
        beforeUpdate: async (instance) => {
            fieldsToEncrypt.forEach((field) => {
                if (instance.changed(field) && instance[field]) {
                    instance[field] = encryptFn(instance[field]);
                }
            });
        },
        afterFind: async (instances) => {
            const decrypt = (instance) => {
                fieldsToEncrypt.forEach((field) => {
                    if (instance[field]) {
                        instance[field] = decryptFn(instance[field]);
                    }
                });
            };
            if (Array.isArray(instances)) {
                instances.forEach(decrypt);
            }
            else if (instances) {
                decrypt(instances);
            }
        },
    };
};
exports.createEncryptionHook = createEncryptionHook;
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
const createActiveScope = () => {
    return {
        where: {
            deletedAt: null,
        },
    };
};
exports.createActiveScope = createActiveScope;
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
const createDateRangeScope = (dateField) => {
    return (startDate, endDate) => ({
        where: {
            [dateField]: {
                [sequelize_1.Op.between]: [startDate, endDate],
            },
        },
    });
};
exports.createDateRangeScope = createDateRangeScope;
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
const createPaginationScope = () => {
    return (page, pageSize) => ({
        limit: pageSize,
        offset: (page - 1) * pageSize,
    });
};
exports.createPaginationScope = createPaginationScope;
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
const createSortScope = (defaultField, defaultOrder = 'ASC') => {
    return (field, order) => ({
        order: [[field || defaultField, order || defaultOrder]],
    });
};
exports.createSortScope = createSortScope;
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
const createSearchScope = (searchFields) => {
    return (searchTerm) => ({
        where: {
            [sequelize_1.Op.or]: searchFields.map((field) => ({
                [field]: {
                    [sequelize_1.Op.iLike]: `%${searchTerm}%`,
                },
            })),
        },
    });
};
exports.createSearchScope = createSearchScope;
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
const createVirtualAttribute = (config) => {
    return {
        type: config.type || sequelize_1.DataTypes.VIRTUAL,
        get: config.getter,
        set: config.setter,
    };
};
exports.createVirtualAttribute = createVirtualAttribute;
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
const createComputedField = (fieldName, computeFn) => {
    return {
        type: sequelize_1.DataTypes.VIRTUAL,
        get: computeFn,
    };
};
exports.createComputedField = createComputedField;
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
const createFullNameGetter = (firstNameField = 'firstName', lastNameField = 'lastName') => {
    return {
        type: sequelize_1.DataTypes.VIRTUAL,
        get() {
            const firstName = this[firstNameField] || '';
            const lastName = this[lastNameField] || '';
            return `${firstName} ${lastName}`.trim();
        },
    };
};
exports.createFullNameGetter = createFullNameGetter;
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
const generateUuidDefault = () => {
    return sequelize_1.DataTypes.UUIDV4;
};
exports.generateUuidDefault = generateUuidDefault;
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
const generateTimestampDefault = () => {
    return sequelize_1.DataTypes.NOW;
};
exports.generateTimestampDefault = generateTimestampDefault;
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
const generateSequentialDefault = (start = 1) => {
    let counter = start - 1;
    return () => ++counter;
};
exports.generateSequentialDefault = generateSequentialDefault;
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
const createUniqueIndex = (fields, name) => {
    return {
        unique: true,
        fields,
        name: name || `idx_unique_${fields.join('_')}`,
    };
};
exports.createUniqueIndex = createUniqueIndex;
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
const createCompositeIndex = (fields, name) => {
    return {
        fields,
        name: name || `idx_composite_${fields.join('_')}`,
    };
};
exports.createCompositeIndex = createCompositeIndex;
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
const createPartialIndex = (fields, whereClause, name) => {
    return {
        fields,
        where: whereClause,
        name: name || `idx_partial_${fields.join('_')}`,
    };
};
exports.createPartialIndex = createPartialIndex;
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
const createFullTextIndex = (fields, name) => {
    return {
        fields,
        using: 'GIN',
        name: name || `idx_fulltext_${fields.join('_')}`,
    };
};
exports.createFullTextIndex = createFullTextIndex;
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
const buildUniqueConstraint = (fields, name) => {
    return {
        name: name || `unique_${fields.join('_')}`,
        fields,
    };
};
exports.buildUniqueConstraint = buildUniqueConstraint;
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
const buildCheckConstraint = (name, expression) => {
    return {
        [name]: function () {
            // Note: Sequelize doesn't support CHECK constraints directly
            // This is a placeholder for model-level validation
            // Actual CHECK constraints should be added in migrations
        },
    };
};
exports.buildCheckConstraint = buildCheckConstraint;
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
const extendModelWithMethods = (model, instanceMethods, classMethods) => {
    // Add instance methods
    Object.entries(instanceMethods).forEach(([name, method]) => {
        model.prototype[name] = method;
    });
    // Add class methods
    Object.entries(classMethods).forEach(([name, method]) => {
        model[name] = method;
    });
    return model;
};
exports.extendModelWithMethods = extendModelWithMethods;
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
const createModelMixin = (mixin) => {
    return mixin;
};
exports.createModelMixin = createModelMixin;
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
const applyMixinToModel = (options, mixin) => {
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
exports.applyMixinToModel = applyMixinToModel;
// ============================================================================
// EXPORT DEFAULT
// ============================================================================
exports.default = {
    // Model factories
    createBaseModel: exports.createBaseModel,
    createHipaaCompliantModel: exports.createHipaaCompliantModel,
    createModelWithDefaults: exports.createModelWithDefaults,
    // Attribute builders
    buildPrimaryKeyAttribute: exports.buildPrimaryKeyAttribute,
    buildTimestampAttributes: exports.buildTimestampAttributes,
    buildAuditAttributes: exports.buildAuditAttributes,
    buildForeignKeyAttribute: exports.buildForeignKeyAttribute,
    buildEncryptedAttribute: exports.buildEncryptedAttribute,
    buildEnumAttribute: exports.buildEnumAttribute,
    // Data type helpers
    createJsonbAttribute: exports.createJsonbAttribute,
    createDateOnlyAttribute: exports.createDateOnlyAttribute,
    createDecimalAttribute: exports.createDecimalAttribute,
    createTextAttribute: exports.createTextAttribute,
    createBooleanAttribute: exports.createBooleanAttribute,
    // Validation builders
    buildEmailValidation: exports.buildEmailValidation,
    buildPhoneValidation: exports.buildPhoneValidation,
    buildPasswordValidation: exports.buildPasswordValidation,
    buildCustomValidation: exports.buildCustomValidation,
    buildUrlValidation: exports.buildUrlValidation,
    buildDateRangeValidation: exports.buildDateRangeValidation,
    // Hook factories
    createAuditHook: exports.createAuditHook,
    createTimestampHook: exports.createTimestampHook,
    createSlugGenerationHook: exports.createSlugGenerationHook,
    createValidationHook: exports.createValidationHook,
    createEncryptionHook: exports.createEncryptionHook,
    // Scope definitions
    createActiveScope: exports.createActiveScope,
    createDateRangeScope: exports.createDateRangeScope,
    createPaginationScope: exports.createPaginationScope,
    createSortScope: exports.createSortScope,
    createSearchScope: exports.createSearchScope,
    // Virtual attributes
    createVirtualAttribute: exports.createVirtualAttribute,
    createComputedField: exports.createComputedField,
    createFullNameGetter: exports.createFullNameGetter,
    // Default generators
    generateUuidDefault: exports.generateUuidDefault,
    generateTimestampDefault: exports.generateTimestampDefault,
    generateSequentialDefault: exports.generateSequentialDefault,
    // Index definitions
    createUniqueIndex: exports.createUniqueIndex,
    createCompositeIndex: exports.createCompositeIndex,
    createPartialIndex: exports.createPartialIndex,
    createFullTextIndex: exports.createFullTextIndex,
    // Constraint builders
    buildUniqueConstraint: exports.buildUniqueConstraint,
    buildCheckConstraint: exports.buildCheckConstraint,
    // Model extension
    extendModelWithMethods: exports.extendModelWithMethods,
    createModelMixin: exports.createModelMixin,
    applyMixinToModel: exports.applyMixinToModel,
};
//# sourceMappingURL=sequelize-model-definition-kit.js.map