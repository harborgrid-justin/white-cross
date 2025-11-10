"use strict";
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
exports.createBaseModel = createBaseModel;
exports.createEncryptedModel = createEncryptedModel;
exports.createAuditedModel = createAuditedModel;
exports.extendWithSoftDelete = extendWithSoftDelete;
exports.modelFactory = modelFactory;
exports.createUuidAttribute = createUuidAttribute;
exports.createTimestampAttribute = createTimestampAttribute;
exports.createEmailAttribute = createEmailAttribute;
exports.createPasswordAttribute = createPasswordAttribute;
exports.createEnumAttribute = createEnumAttribute;
exports.createJsonAttribute = createJsonAttribute;
exports.createPhoneAttribute = createPhoneAttribute;
exports.createUrlAttribute = createUrlAttribute;
exports.createAsyncValidator = createAsyncValidator;
exports.validatePattern = validatePattern;
exports.validateRange = validateRange;
exports.validateDateRange = validateDateRange;
exports.createConditionalValidation = createConditionalValidation;
exports.createPasswordHashHook = createPasswordHashHook;
exports.createAuditHooks = createAuditHooks;
exports.createTimestampHooks = createTimestampHooks;
exports.createValidationHooks = createValidationHooks;
exports.createCascadeHooks = createCascadeHooks;
exports.createPaginationScope = createPaginationScope;
exports.createDateRangeScope = createDateRangeScope;
exports.createSearchScope = createSearchScope;
exports.createIncludeScope = createIncludeScope;
exports.createParanoidScope = createParanoidScope;
exports.createCombinedVirtual = createCombinedVirtual;
exports.createAgeVirtual = createAgeVirtual;
exports.createPhoneFormatVirtual = createPhoneFormatVirtual;
exports.createDurationVirtual = createDurationVirtual;
exports.createUniqueIndex = createUniqueIndex;
exports.createFullTextIndex = createFullTextIndex;
exports.createPartialIndex = createPartialIndex;
exports.createCompositeIndex = createCompositeIndex;
exports.createCurrencyGetter = createCurrencyGetter;
exports.createCurrencySetter = createCurrencySetter;
exports.createJsonGetter = createJsonGetter;
exports.createJsonSetter = createJsonSetter;
exports.addPasswordCompareMethod = addPasswordCompareMethod;
exports.addSafeJsonMethod = addSafeJsonMethod;
exports.addFindByEmailMethod = addFindByEmailMethod;
exports.addSoftDeleteMethod = addSoftDeleteMethod;
exports.validateModelInstance = validateModelInstance;
exports.bulkCreateWithValidation = bulkCreateWithValidation;
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
const sequelize_1 = require("sequelize");
const bcrypt = __importStar(require("bcrypt"));
const validator_1 = require("validator");
// ============================================================================
// MODEL DEFINITION HELPERS
// ============================================================================
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
function createBaseModel(sequelize, modelName, attributes, options = {}) {
    const baseAttributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        ...attributes,
    };
    const baseOptions = {
        sequelize,
        modelName,
        timestamps: true,
        paranoid: true,
        underscored: true,
        ...options,
    };
    class BaseModel extends sequelize_1.Model {
    }
    return BaseModel.init(baseAttributes, baseOptions);
}
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
function createEncryptedModel(sequelize, modelName, attributes, encryptedFields, options = {}) {
    const crypto = require('crypto');
    const algorithm = process.env.ENCRYPTION_ALGORITHM || 'aes-256-gcm';
    const key = Buffer.from(process.env.ENCRYPTION_KEY || '', 'hex');
    const encryptedAttributes = { ...attributes };
    // Add encryption getters/setters for sensitive fields
    encryptedFields.forEach((field) => {
        if (encryptedAttributes[field]) {
            const originalConfig = encryptedAttributes[field];
            encryptedAttributes[field] = {
                ...originalConfig,
                get() {
                    const encrypted = this.getDataValue(field);
                    if (!encrypted)
                        return null;
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
                    }
                    catch (error) {
                        console.error(`Decryption error for field ${field}:`, error);
                        return null;
                    }
                },
                set(value) {
                    if (!value) {
                        this.setDataValue(field, null);
                        return;
                    }
                    try {
                        const iv = crypto.randomBytes(16);
                        const cipher = crypto.createCipheriv(algorithm, key, iv);
                        let encrypted = cipher.update(String(value), 'utf8', 'hex');
                        encrypted += cipher.final('hex');
                        const authTag = cipher.getAuthTag();
                        const encryptedValue = `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
                        this.setDataValue(field, encryptedValue);
                    }
                    catch (error) {
                        console.error(`Encryption error for field ${field}:`, error);
                        throw error;
                    }
                },
            };
        }
    });
    return createBaseModel(sequelize, modelName, encryptedAttributes, options);
}
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
function createAuditedModel(sequelize, modelName, attributes, options = {}) {
    const auditedOptions = {
        ...options,
        hooks: {
            ...options.hooks,
            afterCreate: async (instance, opts) => {
                await logAudit({
                    userId: opts.userId || 'system',
                    action: 'CREATE',
                    tableName: modelName,
                    recordId: instance.get('id'),
                    changes: instance.toJSON(),
                    metadata: { timestamp: new Date(), ip: opts.ip },
                });
                if (options.hooks?.afterCreate) {
                    await options.hooks.afterCreate(instance, opts);
                }
            },
            afterUpdate: async (instance, opts) => {
                await logAudit({
                    userId: opts.userId || 'system',
                    action: 'UPDATE',
                    tableName: modelName,
                    recordId: instance.get('id'),
                    changes: instance.changed(),
                    metadata: { timestamp: new Date(), ip: opts.ip },
                });
                if (options.hooks?.afterUpdate) {
                    await options.hooks.afterUpdate(instance, opts);
                }
            },
            afterDestroy: async (instance, opts) => {
                await logAudit({
                    userId: opts.userId || 'system',
                    action: 'DELETE',
                    tableName: modelName,
                    recordId: instance.get('id'),
                    changes: null,
                    metadata: { timestamp: new Date(), ip: opts.ip },
                });
                if (options.hooks?.afterDestroy) {
                    await options.hooks.afterDestroy(instance, opts);
                }
            },
        },
    };
    return createBaseModel(sequelize, modelName, attributes, auditedOptions);
}
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
function extendWithSoftDelete(model, config = {}) {
    const options = model.options;
    options.paranoid = config.paranoid !== false;
    if (config.deletedAt) {
        options.deletedAt = config.deletedAt;
    }
    return model;
}
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
function modelFactory(model, defaults = {}) {
    return async (overrides = {}) => {
        const attributes = { ...defaults, ...overrides };
        return await model.create(attributes);
    };
}
// ============================================================================
// ATTRIBUTE CONFIGURATION HELPERS
// ============================================================================
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
function createUuidAttribute(version = 'v4') {
    return {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: version === 'v4' ? sequelize_1.DataTypes.UUIDV4 : sequelize_1.DataTypes.UUIDV1,
        primaryKey: true,
        allowNull: false,
        validate: {
            isUUID: 4,
        },
    };
}
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
function createTimestampAttribute(type) {
    return {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: type === 'created' ? sequelize_1.DataTypes.NOW : sequelize_1.DataTypes.NOW,
        field: type === 'created' ? 'created_at' : 'updated_at',
    };
}
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
function createEmailAttribute(unique = true, allowNull = false) {
    return {
        type: sequelize_1.DataTypes.STRING,
        allowNull,
        unique: unique ? 'unique_email' : false,
        validate: {
            isEmail: {
                msg: 'Invalid email format',
            },
            notEmpty: !allowNull,
        },
        set(value) {
            this.setDataValue('email', value?.toLowerCase()?.trim());
        },
    };
}
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
function createPasswordAttribute(saltRounds = 10) {
    return {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [8, 100],
                msg: 'Password must be between 8 and 100 characters',
            },
        },
        set(value) {
            if (value) {
                const hash = bcrypt.hashSync(value, saltRounds);
                this.setDataValue('password', hash);
            }
        },
    };
}
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
function createEnumAttribute(values, defaultValue) {
    return {
        type: sequelize_1.DataTypes.ENUM(...values),
        allowNull: false,
        defaultValue: defaultValue || values[0],
        validate: {
            isIn: {
                args: [values],
                msg: `Value must be one of: ${values.join(', ')}`,
            },
        },
    };
}
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
function createJsonAttribute(defaultValue = {}, validator) {
    return {
        type: sequelize_1.DataTypes.JSON,
        allowNull: true,
        defaultValue,
        validate: validator
            ? {
                customValidator(value) {
                    if (value && !validator(value)) {
                        throw new Error('Invalid JSON structure');
                    }
                },
            }
            : undefined,
    };
}
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
function createPhoneAttribute(locale = 'en-US', allowNull = false) {
    return {
        type: sequelize_1.DataTypes.STRING,
        allowNull,
        validate: {
            isMobilePhone(value) {
                if (value && !(0, validator_1.isMobilePhone)(value, locale)) {
                    throw new Error(`Invalid phone number for locale ${locale}`);
                }
            },
        },
        set(value) {
            if (value) {
                // Remove all non-numeric characters
                const cleaned = value.replace(/\D/g, '');
                this.setDataValue('phone', cleaned);
            }
        },
    };
}
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
function createUrlAttribute(requireProtocol = true, allowedProtocols = ['http', 'https']) {
    return {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        validate: {
            isUrl: {
                msg: 'Invalid URL format',
            },
            protocolCheck(value) {
                if (value && requireProtocol) {
                    const protocol = value.split('://')[0];
                    if (!allowedProtocols.includes(protocol)) {
                        throw new Error(`Protocol must be one of: ${allowedProtocols.join(', ')}`);
                    }
                }
            },
        },
    };
}
// ============================================================================
// VALIDATION HELPERS
// ============================================================================
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
function createAsyncValidator(validatorFn, errorMessage) {
    return {
        async customValidator(value) {
            const isValid = await validatorFn(value);
            if (!isValid) {
                throw new Error(errorMessage);
            }
        },
    };
}
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
function validatePattern(pattern, message) {
    return {
        customValidator(value) {
            if (value && !pattern.test(value)) {
                throw new Error(message);
            }
        },
    };
}
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
function validateRange(min, max, inclusive = true) {
    return {
        customValidator(value) {
            if (value !== null && value !== undefined) {
                const isValid = inclusive ? value >= min && value <= max : value > min && value < max;
                if (!isValid) {
                    throw new Error(`Value must be between ${min} and ${max} ${inclusive ? '(inclusive)' : '(exclusive)'}`);
                }
            }
        },
    };
}
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
function validateDateRange(minDate, maxDate) {
    return {
        customValidator(value) {
            if (value) {
                const date = new Date(value);
                if (date < minDate || date > maxDate) {
                    throw new Error(`Date must be between ${minDate.toISOString()} and ${maxDate.toISOString()}`);
                }
            }
        },
    };
}
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
function createConditionalValidation(dependentField, dependentValue, validation) {
    return {
        customValidator(value) {
            const dependentFieldValue = this[dependentField];
            if (dependentFieldValue === dependentValue) {
                // Apply validation
                Object.keys(validation).forEach((key) => {
                    const validator = validation[key];
                    if (typeof validator === 'function') {
                        validator.call(this, value);
                    }
                });
            }
        },
    };
}
// ============================================================================
// HOOK UTILITIES
// ============================================================================
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
function createPasswordHashHook(passwordField = 'password', saltRounds = 10) {
    return {
        beforeCreate: async (instance) => {
            const password = instance.get(passwordField);
            if (password) {
                const hash = await bcrypt.hash(password, saltRounds);
                instance.set(passwordField, hash);
            }
        },
        beforeUpdate: async (instance) => {
            if (instance.changed(passwordField)) {
                const password = instance.get(passwordField);
                if (password) {
                    const hash = await bcrypt.hash(password, saltRounds);
                    instance.set(passwordField, hash);
                }
            }
        },
    };
}
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
function createAuditHooks(modelName, logger) {
    return {
        afterCreate: async (instance, options) => {
            await logger({
                userId: options.userId || 'system',
                action: 'CREATE',
                tableName: modelName,
                recordId: instance.get('id'),
                changes: instance.toJSON(),
                metadata: { timestamp: new Date(), ip: options.ip },
            });
        },
        afterUpdate: async (instance, options) => {
            await logger({
                userId: options.userId || 'system',
                action: 'UPDATE',
                tableName: modelName,
                recordId: instance.get('id'),
                changes: instance.changed(),
                metadata: { timestamp: new Date(), ip: options.ip, previous: instance._previousDataValues },
            });
        },
        afterDestroy: async (instance, options) => {
            await logger({
                userId: options.userId || 'system',
                action: 'DELETE',
                tableName: modelName,
                recordId: instance.get('id'),
                changes: instance.toJSON(),
                metadata: { timestamp: new Date(), ip: options.ip },
            });
        },
    };
}
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
function createTimestampHooks() {
    return {
        beforeCreate: (instance, options) => {
            const now = new Date();
            if (instance.get('createdAt') === undefined) {
                instance.set('createdAt', now);
            }
            if (instance.get('updatedAt') === undefined) {
                instance.set('updatedAt', now);
            }
            if (options.userId) {
                if (instance.get('createdBy') === undefined) {
                    instance.set('createdBy', options.userId);
                }
                if (instance.get('updatedBy') === undefined) {
                    instance.set('updatedBy', options.userId);
                }
            }
        },
        beforeUpdate: (instance, options) => {
            instance.set('updatedAt', new Date());
            if (options.userId) {
                instance.set('updatedBy', options.userId);
            }
        },
    };
}
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
function createValidationHooks(errorFormatter) {
    return {
        beforeValidate: async (instance, options) => {
            // Pre-validation processing
            if (options.skipValidation) {
                return;
            }
        },
        afterValidate: async (instance, options) => {
            // Post-validation processing
            if (instance.errors && instance.errors.length > 0) {
                const formattedErrors = errorFormatter(instance.errors);
                throw new Error(JSON.stringify(formattedErrors));
            }
        },
    };
}
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
function createCascadeHooks(relations) {
    return {
        beforeDestroy: async (instance, options) => {
            for (const relation of relations) {
                if (relation.action === 'delete') {
                    await relation.model.destroy({
                        where: { [relation.foreignKey]: instance.get('id') },
                        transaction: options.transaction,
                    });
                }
                else if (relation.action === 'nullify') {
                    await relation.model.update({ [relation.foreignKey]: null }, {
                        where: { [relation.foreignKey]: instance.get('id') },
                        transaction: options.transaction,
                    });
                }
            }
        },
    };
}
// ============================================================================
// SCOPE BUILDERS
// ============================================================================
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
function createPaginationScope(defaultLimit = 20) {
    return (page = 1, limit = defaultLimit) => {
        const offset = (page - 1) * limit;
        return {
            limit,
            offset,
        };
    };
}
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
function createDateRangeScope(dateField) {
    return (startDate, endDate) => {
        return {
            where: {
                [dateField]: {
                    [sequelize_1.Op.between]: [startDate, endDate],
                },
            },
        };
    };
}
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
function createSearchScope(searchFields) {
    return (query) => {
        if (!query) {
            return {};
        }
        const searchPattern = `%${query}%`;
        return {
            where: {
                [sequelize_1.Op.or]: searchFields.map((field) => ({
                    [field]: {
                        [sequelize_1.Op.iLike]: searchPattern,
                    },
                })),
            },
        };
    };
}
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
function createIncludeScope(associationName, conditions = {}) {
    return {
        include: [
            {
                association: associationName,
                where: conditions,
                required: false,
            },
        ],
    };
}
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
function createParanoidScope(includeDeleted = true) {
    return {
        paranoid: !includeDeleted,
    };
}
// ============================================================================
// VIRTUAL ATTRIBUTE HELPERS
// ============================================================================
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
function createCombinedVirtual(fields, separator = ' ') {
    return {
        type: sequelize_1.DataTypes.VIRTUAL,
        get() {
            const values = fields.map((field) => this.getDataValue(field)).filter(Boolean);
            return values.join(separator);
        },
        dependencies: fields,
    };
}
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
function createAgeVirtual(birthDateField = 'dateOfBirth') {
    return {
        type: sequelize_1.DataTypes.VIRTUAL,
        get() {
            const birthDate = this.getDataValue(birthDateField);
            if (!birthDate)
                return null;
            const today = new Date();
            const birth = new Date(birthDate);
            let age = today.getFullYear() - birth.getFullYear();
            const monthDiff = today.getMonth() - birth.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
                age--;
            }
            return age;
        },
        dependencies: [birthDateField],
    };
}
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
function createPhoneFormatVirtual(phoneField = 'phone', format = '(###) ###-####') {
    return {
        type: sequelize_1.DataTypes.VIRTUAL,
        get() {
            const phone = this.getDataValue(phoneField);
            if (!phone)
                return null;
            const cleaned = phone.replace(/\D/g, '');
            let formatted = format;
            for (let i = 0; i < cleaned.length; i++) {
                formatted = formatted.replace('#', cleaned[i]);
            }
            return formatted.replace(/#/g, '');
        },
        dependencies: [phoneField],
    };
}
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
function createDurationVirtual(startField, endField, unit = 'hours') {
    const divisors = {
        milliseconds: 1,
        seconds: 1000,
        minutes: 60000,
        hours: 3600000,
        days: 86400000,
    };
    return {
        type: sequelize_1.DataTypes.VIRTUAL,
        get() {
            const start = this.getDataValue(startField);
            const end = this.getDataValue(endField);
            if (!start || !end)
                return null;
            const diff = new Date(end).getTime() - new Date(start).getTime();
            return Math.floor(diff / divisors[unit]);
        },
        dependencies: [startField, endField],
    };
}
// ============================================================================
// INDEX MANAGEMENT
// ============================================================================
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
function createUniqueIndex(name, fields) {
    return {
        name,
        unique: true,
        fields,
    };
}
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
function createFullTextIndex(name, fields) {
    return {
        name,
        type: 'FULLTEXT',
        fields,
    };
}
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
function createPartialIndex(name, fields, where) {
    return {
        name,
        fields,
        where,
    };
}
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
function createCompositeIndex(name, fields) {
    return {
        name,
        fields: fields.map((f) => ({
            name: f.field,
            order: f.order,
        })),
    };
}
// ============================================================================
// GETTER/SETTER UTILITIES
// ============================================================================
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
function createCurrencyGetter(field, currency = '$') {
    return function () {
        const cents = this.getDataValue(field);
        if (cents === null || cents === undefined)
            return null;
        return `${currency}${(cents / 100).toFixed(2)}`;
    };
}
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
function createCurrencySetter(field) {
    return function (value) {
        if (value === null || value === undefined) {
            this.setDataValue(field, null);
            return;
        }
        const amount = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]+/g, '')) : value;
        this.setDataValue(field, Math.round(amount * 100));
    };
}
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
function createJsonGetter(field, defaultValue = null) {
    return function () {
        const value = this.getDataValue(field);
        if (!value)
            return defaultValue;
        try {
            return typeof value === 'string' ? JSON.parse(value) : value;
        }
        catch (error) {
            console.error(`JSON parse error for field ${field}:`, error);
            return defaultValue;
        }
    };
}
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
function createJsonSetter(field) {
    return function (value) {
        if (value === null || value === undefined) {
            this.setDataValue(field, null);
            return;
        }
        try {
            const jsonString = typeof value === 'string' ? value : JSON.stringify(value);
            this.setDataValue(field, jsonString);
        }
        catch (error) {
            console.error(`JSON stringify error for field ${field}:`, error);
            throw error;
        }
    };
}
// ============================================================================
// INSTANCE AND CLASS METHOD BUILDERS
// ============================================================================
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
function addPasswordCompareMethod(model, passwordField = 'password') {
    model.prototype.comparePassword = async function (plainPassword) {
        const hashedPassword = this.getDataValue(passwordField);
        if (!hashedPassword)
            return false;
        return await bcrypt.compare(plainPassword, hashedPassword);
    };
}
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
function addSafeJsonMethod(model, excludeFields) {
    model.prototype.toJSON = function () {
        const values = { ...this.get() };
        excludeFields.forEach((field) => {
            delete values[field];
        });
        return values;
    };
}
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
function addFindByEmailMethod(model, emailField = 'email') {
    model.findByEmail = async function (email) {
        return await this.findOne({
            where: { [emailField]: email.toLowerCase().trim() },
        });
    };
}
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
function addSoftDeleteMethod(model) {
    model.prototype.softDelete = async function (options = {}) {
        this.setDataValue('deletedAt', new Date());
        await this.save(options);
    };
    model.prototype.restore = async function (options = {}) {
        this.setDataValue('deletedAt', null);
        await this.save(options);
    };
}
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
/**
 * Logs audit information to database or external service.
 * Centralized audit logging for HIPAA compliance.
 *
 * @param {AuditConfig} audit - Audit configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await logAudit({
 *   userId: 'user-123',
 *   action: 'UPDATE',
 *   tableName: 'patients',
 *   recordId: 'patient-456',
 *   changes: { firstName: 'John' },
 *   metadata: { ip: '192.168.1.1' }
 * });
 * ```
 */
async function logAudit(audit) {
    // Implementation would write to audit log table or external service
    console.log('[AUDIT]', JSON.stringify(audit));
    // Example: await AuditLog.create(audit);
}
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
async function validateModelInstance(instance) {
    try {
        await instance.validate();
        return true;
    }
    catch (error) {
        console.error('Validation errors:', error);
        return false;
    }
}
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
async function bulkCreateWithValidation(model, records, options = {}) {
    const defaultOptions = {
        validate: true,
        individualHooks: true,
        ...options,
    };
    try {
        return await model.bulkCreate(records, defaultOptions);
    }
    catch (error) {
        console.error('Bulk create error:', error);
        throw error;
    }
}
//# sourceMappingURL=sequelize-models-utils.js.map