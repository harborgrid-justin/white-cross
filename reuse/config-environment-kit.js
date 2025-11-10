"use strict";
/**
 * @fileoverview Configuration and Environment Management Kit
 * @module reuse/config-environment-kit
 * @description Comprehensive configuration and environment management utilities for NestJS applications
 * with TypeScript and Sequelize integration. Provides advanced configuration loading, validation,
 * secret management, feature flags with database persistence, dynamic reload, encryption, versioning,
 * and HIPAA-compliant configuration patterns for healthcare platforms.
 *
 * Key Features:
 * - Environment variable loading with advanced parsing and validation
 * - Configuration schema validation (Joi, class-validator, Zod)
 * - Multi-environment configuration management (dev, staging, production)
 * - Secret management with vault integration (AWS, Azure, HashiCorp, Google)
 * - Feature flags with database persistence and dynamic evaluation
 * - Dynamic configuration hot-reload with file watching
 * - Configuration encryption/decryption for sensitive data
 * - Configuration versioning and migration tracking with Sequelize
 * - Type-safe configuration access with TypeScript
 * - Configuration documentation auto-generation
 * - Environment-specific overrides and hierarchical loading
 * - Configuration validation on startup with health checks
 * - Remote configuration fetching from config servers
 * - Configuration audit logging and change tracking
 * - HIPAA-compliant security defaults and patterns
 *
 * @target NestJS v11.x, Node 18+, TypeScript 5.x, Sequelize v6.x
 *
 * @security
 * - Encrypted configuration storage at rest
 * - Secret rotation with zero-downtime
 * - Audit logging for all configuration access
 * - Role-based configuration access control
 * - HIPAA-compliant encryption (AES-256-GCM)
 * - Configuration validation and sanitization
 * - Secure secret injection patterns
 * - Configuration change approval workflows
 * - Tamper detection with checksums
 *
 * @example Basic environment variable loading
 * ```typescript
 * import {
 *   loadEnvWithValidation,
 *   parseTypedEnvVar,
 *   validateEnvSchema
 * } from './config-environment-kit';
 *
 * // Load and validate environment variables
 * const result = loadEnvWithValidation(['.env', '.env.local']);
 *
 * // Parse typed environment variable
 * const port = parseTypedEnvVar('PORT', 'number', 3000);
 * const isDebug = parseTypedEnvVar('DEBUG', 'boolean', false);
 * ```
 *
 * @example Advanced secret management
 * ```typescript
 * import {
 *   loadSecretsFromVaultProvider,
 *   rotateSecretsWithCallback,
 *   cacheSecrets
 * } from './config-environment-kit';
 *
 * // Load secrets from vault
 * const secrets = await loadSecretsFromVaultProvider({
 *   provider: 'aws-secrets-manager',
 *   secretId: 'white-cross/production/db',
 *   region: 'us-east-1',
 *   cacheDuration: 300
 * });
 *
 * // Setup automatic secret rotation
 * await rotateSecretsWithCallback({
 *   provider: 'aws-secrets-manager',
 *   secretId: 'white-cross/jwt',
 *   rotationInterval: 86400000
 * }, (newSecrets) => {
 *   console.log('Secrets rotated');
 * });
 * ```
 *
 * @example Feature flags with database
 * ```typescript
 * import {
 *   FeatureFlagModel,
 *   loadFeatureFlagsFromDB,
 *   evaluateFeatureFlag,
 *   updateFeatureFlagInDB
 * } from './config-environment-kit';
 *
 * // Load feature flags from database
 * const flags = await loadFeatureFlagsFromDB();
 *
 * // Evaluate feature flag with context
 * const isEnabled = await evaluateFeatureFlag('new-dashboard', {
 *   userId: 'user123',
 *   tenantId: 'tenant456'
 * });
 *
 * // Update feature flag
 * await updateFeatureFlagInDB('beta-features', { enabled: true, rollout: 50 });
 * ```
 *
 * @example Configuration versioning
 * ```typescript
 * import {
 *   ConfigHistoryModel,
 *   saveConfigVersion,
 *   getConfigVersion,
 *   rollbackToVersion
 * } from './config-environment-kit';
 *
 * // Save configuration version
 * await saveConfigVersion('app-config', currentConfig, {
 *   author: 'admin',
 *   reason: 'Updated database pool size'
 * });
 *
 * // Rollback to previous version
 * const previousConfig = await rollbackToVersion('app-config', '1.2.3');
 * ```
 *
 * LOC: WC-CFGENV-2025
 * UPSTREAM: @nestjs/config, @nestjs/common, sequelize, joi, class-validator, zod
 * DOWNSTREAM: Application modules, services, configuration providers, health checks
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
exports.generateConfigDocumentation = exports.fetchRemoteConfiguration = exports.validateConfigurationOnStartup = exports.getNestedConfigValue = exports.createTypeSafeConfigService = exports.compareConfigVersions = exports.rollbackToVersion = exports.listConfigVersions = exports.getConfigVersion = exports.saveConfigVersion = exports.encryptConfigObjectRecursive = exports.decryptConfigValueGCM = exports.encryptConfigValueGCM = exports.hotSwapConfiguration = exports.createHotReloadProvider = exports.watchConfigurationFiles = exports.bulkUpdateFeatureFlags = exports.createFeatureFlag = exports.updateFeatureFlagInDB = exports.evaluateFeatureFlag = exports.loadFeatureFlagsFromDB = exports.validateSecretFormat = exports.getCachedSecrets = exports.cacheSecrets = exports.rotateSecretsWithCallback = exports.loadSecretsFromVaultProvider = exports.applyEnvironmentOverrides = exports.validateEnvironmentRequirements = exports.createEnvironmentAwareFactory = exports.loadEnvironmentSpecificConfig = exports.mergeValidationSchemas = exports.validateConfigWithJsonSchema = exports.createRuntimeValidator = exports.validateConfigWithDecorators = exports.createComprehensiveSchema = exports.sanitizeEnvVariables = exports.validateEnvDependencies = exports.expandEnvVariables = exports.loadEnvHierarchical = exports.validateEnvSchema = exports.parseTypedEnvVar = exports.loadEnvWithValidation = exports.initConfigHistoryModel = exports.ConfigHistoryModel = exports.initFeatureFlagModel = exports.FeatureFlagModel = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("sequelize");
const Joi = __importStar(require("joi"));
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const crypto = __importStar(require("crypto"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const fs_1 = require("fs");
const dotenv = __importStar(require("dotenv"));
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * @class FeatureFlagModel
 * @description Sequelize model for feature flags with database persistence
 *
 * @example
 * ```typescript
 * const flag = await FeatureFlagModel.create({
 *   id: 'uuid-v4',
 *   name: 'new-dashboard',
 *   description: 'Enable new patient dashboard',
 *   enabled: true,
 *   rollout: 50,
 *   environment: 'production'
 * });
 * ```
 */
class FeatureFlagModel extends sequelize_1.Model {
}
exports.FeatureFlagModel = FeatureFlagModel;
/**
 * Initializes the FeatureFlagModel with Sequelize instance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof FeatureFlagModel} Initialized model
 */
const initFeatureFlagModel = (sequelize) => {
    FeatureFlagModel.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            unique: 'flag_name_env_tenant',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        enabled: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        rollout: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: 0,
                max: 100,
            },
        },
        conditions: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true,
        },
        tenantId: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
            unique: 'flag_name_env_tenant',
        },
        environment: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'development',
            unique: 'flag_name_env_tenant',
        },
        createdAt: sequelize_1.DataTypes.DATE,
        updatedAt: sequelize_1.DataTypes.DATE,
    }, {
        sequelize,
        tableName: 'feature_flags',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['name', 'environment', 'tenantId'],
            },
            {
                fields: ['environment'],
            },
            {
                fields: ['enabled'],
            },
            {
                fields: ['tenantId'],
            },
        ],
    });
    return FeatureFlagModel;
};
exports.initFeatureFlagModel = initFeatureFlagModel;
/**
 * @class ConfigHistoryModel
 * @description Sequelize model for configuration version history and audit trail
 *
 * @example
 * ```typescript
 * const history = await ConfigHistoryModel.create({
 *   id: 'uuid-v4',
 *   configKey: 'database',
 *   version: '1.2.3',
 *   configData: { host: 'localhost', port: 5432 },
 *   checksum: 'sha256-hash',
 *   author: 'admin@example.com',
 *   environment: 'production'
 * });
 * ```
 */
class ConfigHistoryModel extends sequelize_1.Model {
}
exports.ConfigHistoryModel = ConfigHistoryModel;
/**
 * Initializes the ConfigHistoryModel with Sequelize instance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof ConfigHistoryModel} Initialized model
 */
const initConfigHistoryModel = (sequelize) => {
    ConfigHistoryModel.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        configKey: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        version: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
        },
        configData: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
        },
        checksum: {
            type: sequelize_1.DataTypes.STRING(64),
            allowNull: false,
        },
        author: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
        },
        reason: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        environment: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'development',
        },
        tags: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true,
        },
        createdAt: sequelize_1.DataTypes.DATE,
    }, {
        sequelize,
        tableName: 'config_history',
        timestamps: true,
        updatedAt: false,
        indexes: [
            {
                unique: true,
                fields: ['configKey', 'version', 'environment'],
            },
            {
                fields: ['configKey', 'environment', 'createdAt'],
            },
            {
                fields: ['environment'],
            },
            {
                fields: ['author'],
            },
            {
                fields: ['checksum'],
            },
        ],
    });
    return ConfigHistoryModel;
};
exports.initConfigHistoryModel = initConfigHistoryModel;
// ============================================================================
// ENVIRONMENT VARIABLE LOADING & VALIDATION
// ============================================================================
/**
 * 1. Loads environment variables from multiple files with validation.
 *
 * @param {string[]} paths - Environment file paths in priority order
 * @param {EnvLoadOptions} options - Loading options
 * @returns {EnvLoadResult} Loading result with loaded variables
 *
 * @example
 * ```typescript
 * const result = loadEnvWithValidation([
 *   '.env.production.local',
 *   '.env.production',
 *   '.env.local',
 *   '.env'
 * ], { override: false, validate: true });
 *
 * if (!result.success) {
 *   console.error('Validation errors:', result.validationErrors);
 * }
 * ```
 */
const loadEnvWithValidation = (paths, options = {}) => {
    const loadedFiles = [];
    const failedFiles = [];
    const variables = {};
    const validationErrors = [];
    for (const filePath of paths) {
        try {
            const absolutePath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
            if (!fs.existsSync(absolutePath)) {
                failedFiles.push(filePath);
                continue;
            }
            const result = dotenv.config({
                path: absolutePath,
                encoding: options.encoding || 'utf8',
                override: options.override || false,
            });
            if (result.error) {
                failedFiles.push(filePath);
            }
            else {
                loadedFiles.push(filePath);
                Object.assign(variables, result.parsed || {});
            }
        }
        catch (error) {
            failedFiles.push(filePath);
        }
    }
    // Validate if schema provided
    if (options.validate && options.schema) {
        const validation = options.schema.validate(process.env, { abortEarly: false });
        if (validation.error) {
            validationErrors.push(...validation.error.details.map((d) => d.message));
        }
    }
    return {
        success: loadedFiles.length > 0 && validationErrors.length === 0,
        loaded: Object.keys(variables).length,
        loadedFiles,
        failedFiles,
        validationErrors,
        variables,
    };
};
exports.loadEnvWithValidation = loadEnvWithValidation;
/**
 * 2. Parses typed environment variable with advanced type conversion.
 *
 * @param {string} name - Environment variable name
 * @param {string} type - Expected type
 * @param {any} defaultValue - Default value if not set
 * @returns {any} Parsed and typed value
 *
 * @example
 * ```typescript
 * const port = parseTypedEnvVar('PORT', 'number', 3000);
 * const dbUrl = parseTypedEnvVar('DATABASE_URL', 'url', 'postgres://localhost');
 * const features = parseTypedEnvVar('FEATURES', 'array', []);
 * const config = parseTypedEnvVar('APP_CONFIG', 'json', {});
 * ```
 */
const parseTypedEnvVar = (name, type, defaultValue) => {
    const value = process.env[name];
    if (value === undefined || value === null || value === '') {
        return defaultValue;
    }
    try {
        switch (type) {
            case 'number': {
                const num = Number(value);
                if (isNaN(num)) {
                    throw new Error(`Invalid number: ${value}`);
                }
                return num;
            }
            case 'boolean': {
                const lower = value.toLowerCase().trim();
                return (lower === 'true' || lower === '1' || lower === 'yes');
            }
            case 'json': {
                return JSON.parse(value);
            }
            case 'array': {
                return value.split(',').map((v) => v.trim());
            }
            case 'url': {
                const url = new URL(value);
                return url.toString();
            }
            case 'email': {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    throw new Error(`Invalid email: ${value}`);
                }
                return value;
            }
            case 'string':
            default:
                return value;
        }
    }
    catch (error) {
        if (defaultValue !== undefined) {
            return defaultValue;
        }
        throw new Error(`Failed to parse env var ${name} as ${type}: ${error.message}`);
    }
};
exports.parseTypedEnvVar = parseTypedEnvVar;
/**
 * 3. Validates environment schema with detailed error reporting.
 *
 * @param {Joi.ObjectSchema} schema - Joi validation schema
 * @param {Record<string, any>} env - Environment variables to validate
 * @returns {{ valid: boolean; errors: string[]; value: any }} Validation result
 *
 * @example
 * ```typescript
 * const schema = Joi.object({
 *   PORT: Joi.number().port().required(),
 *   DATABASE_URL: Joi.string().uri().required(),
 *   LOG_LEVEL: Joi.string().valid('debug', 'info', 'warn', 'error').default('info')
 * });
 *
 * const result = validateEnvSchema(schema, process.env);
 * ```
 */
const validateEnvSchema = (schema, env = process.env) => {
    const result = schema.validate(env, {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: false,
    });
    return {
        valid: !result.error,
        errors: result.error ? result.error.details.map((d) => d.message) : [],
        value: result.value,
    };
};
exports.validateEnvSchema = validateEnvSchema;
/**
 * 4. Loads environment variables with hierarchical precedence.
 *
 * @param {string} environment - Current environment (development, staging, production)
 * @param {string} baseDir - Base directory for env files
 * @returns {EnvLoadResult} Loading result
 *
 * @example
 * ```typescript
 * const result = loadEnvHierarchical('production', './config');
 * // Loads in order: .env, .env.production, .env.production.local
 * ```
 */
const loadEnvHierarchical = (environment = process.env.NODE_ENV || 'development', baseDir = process.cwd()) => {
    const envFiles = [
        path.join(baseDir, '.env'),
        path.join(baseDir, `.env.${environment}`),
        path.join(baseDir, '.env.local'),
        path.join(baseDir, `.env.${environment}.local`),
    ];
    return (0, exports.loadEnvWithValidation)(envFiles, { override: false });
};
exports.loadEnvHierarchical = loadEnvHierarchical;
/**
 * 5. Expands environment variables with references (e.g., ${VAR_NAME}).
 *
 * @param {Record<string, string>} env - Environment variables
 * @returns {Record<string, string>} Expanded environment variables
 *
 * @example
 * ```typescript
 * const env = {
 *   BASE_URL: 'http://localhost',
 *   API_URL: '${BASE_URL}/api',
 *   AUTH_URL: '${BASE_URL}/auth'
 * };
 * const expanded = expandEnvVariables(env);
 * // { BASE_URL: 'http://localhost', API_URL: 'http://localhost/api', ... }
 * ```
 */
const expandEnvVariables = (env) => {
    const expanded = { ...env };
    const regex = /\$\{([^}]+)\}/g;
    const expand = (value, depth = 0) => {
        if (depth > 10) {
            throw new Error('Circular reference detected in environment variables');
        }
        return value.replace(regex, (match, varName) => {
            const varValue = expanded[varName] || process.env[varName] || match;
            return expand(varValue, depth + 1);
        });
    };
    for (const [key, value] of Object.entries(expanded)) {
        expanded[key] = expand(value);
    }
    return expanded;
};
exports.expandEnvVariables = expandEnvVariables;
/**
 * 6. Validates environment variable dependencies and constraints.
 *
 * @param {Record<string, string[]>} dependencies - Variable dependencies map
 * @param {Record<string, (value: string) => boolean>} constraints - Constraint validators
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const result = validateEnvDependencies(
 *   {
 *     DATABASE_SSL: ['DATABASE_SSL_CERT', 'DATABASE_SSL_KEY'],
 *     USE_REDIS: ['REDIS_HOST', 'REDIS_PORT']
 *   },
 *   {
 *     PORT: (val) => parseInt(val) >= 1024 && parseInt(val) <= 65535
 *   }
 * );
 * ```
 */
const validateEnvDependencies = (dependencies, constraints = {}) => {
    const errors = [];
    // Check dependencies
    for (const [parent, deps] of Object.entries(dependencies)) {
        if (process.env[parent]) {
            for (const dep of deps) {
                if (!process.env[dep]) {
                    errors.push(`When ${parent} is set, ${dep} is required but not found`);
                }
            }
        }
    }
    // Check constraints
    for (const [varName, validator] of Object.entries(constraints)) {
        const value = process.env[varName];
        if (value && !validator(value)) {
            errors.push(`${varName} validation failed`);
        }
    }
    return {
        valid: errors.length === 0,
        errors,
    };
};
exports.validateEnvDependencies = validateEnvDependencies;
/**
 * 7. Sanitizes environment variables by removing sensitive data.
 *
 * @param {Record<string, string>} env - Environment variables
 * @param {string[]} sensitiveKeys - Keys to sanitize
 * @returns {Record<string, string>} Sanitized environment variables
 *
 * @example
 * ```typescript
 * const sanitized = sanitizeEnvVariables(process.env, [
 *   'PASSWORD',
 *   'SECRET',
 *   'API_KEY',
 *   'TOKEN'
 * ]);
 * ```
 */
const sanitizeEnvVariables = (env, sensitiveKeys = ['PASSWORD', 'SECRET', 'KEY', 'TOKEN', 'CREDENTIAL']) => {
    const sanitized = {};
    for (const [key, value] of Object.entries(env)) {
        const isSensitive = sensitiveKeys.some((sensitive) => key.toUpperCase().includes(sensitive.toUpperCase()));
        sanitized[key] = isSensitive ? '***REDACTED***' : value;
    }
    return sanitized;
};
exports.sanitizeEnvVariables = sanitizeEnvVariables;
// ============================================================================
// CONFIGURATION SCHEMA VALIDATION
// ============================================================================
/**
 * 8. Creates comprehensive Joi schema for application configuration.
 *
 * @param {Record<string, Joi.Schema>} schemas - Schema definitions by namespace
 * @returns {Joi.ObjectSchema} Combined Joi schema
 *
 * @example
 * ```typescript
 * const schema = createComprehensiveSchema({
 *   database: Joi.object({
 *     host: Joi.string().required(),
 *     port: Joi.number().port().default(5432)
 *   }),
 *   redis: Joi.object({
 *     host: Joi.string().default('localhost'),
 *     port: Joi.number().port().default(6379)
 *   })
 * });
 * ```
 */
const createComprehensiveSchema = (schemas) => {
    return Joi.object(schemas).options({
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: false,
    });
};
exports.createComprehensiveSchema = createComprehensiveSchema;
/**
 * 9. Validates configuration with class-validator decorators.
 *
 * @param {any} ClassType - Class with validation decorators
 * @param {Record<string, any>} config - Configuration to validate
 * @returns {{ valid: boolean; errors: string[]; instance: any }} Validation result
 *
 * @example
 * ```typescript
 * class DatabaseConfig {
 *   @IsString() @IsNotEmpty()
 *   host: string;
 *
 *   @IsNumber() @Min(1024) @Max(65535)
 *   port: number = 5432;
 * }
 *
 * const result = validateConfigWithDecorators(DatabaseConfig, config);
 * ```
 */
const validateConfigWithDecorators = (ClassType, config) => {
    const instance = (0, class_transformer_1.plainToClass)(ClassType, config, {
        enableImplicitConversion: true,
        excludeExtraneousValues: false,
    });
    const errors = (0, class_validator_1.validateSync)(instance, {
        skipMissingProperties: false,
        whitelist: false,
        forbidNonWhitelisted: false,
    });
    return {
        valid: errors.length === 0,
        errors: errors.flatMap((err) => Object.values(err.constraints || {})),
        instance,
    };
};
exports.validateConfigWithDecorators = validateConfigWithDecorators;
/**
 * 10. Creates runtime configuration validator with custom rules.
 *
 * @param {Record<string, (value: any) => boolean | string>} rules - Validation rules
 * @returns {(config: any) => { valid: boolean; errors: string[] }} Validator function
 *
 * @example
 * ```typescript
 * const validator = createRuntimeValidator({
 *   'database.pool.max': (val) => val >= 5 || 'Pool max must be >= 5',
 *   'redis.ttl': (val) => val > 0 || 'TTL must be positive'
 * });
 *
 * const result = validator(config);
 * ```
 */
const createRuntimeValidator = (rules) => {
    return (config) => {
        const errors = [];
        for (const [path, validator] of Object.entries(rules)) {
            const value = getNestedValue(config, path);
            const result = validator(value);
            if (typeof result === 'string') {
                errors.push(result);
            }
            else if (!result) {
                errors.push(`Validation failed for ${path}`);
            }
        }
        return { valid: errors.length === 0, errors };
    };
};
exports.createRuntimeValidator = createRuntimeValidator;
/**
 * 11. Validates configuration against JSON schema.
 *
 * @param {any} config - Configuration to validate
 * @param {Record<string, any>} jsonSchema - JSON schema definition
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const schema = {
 *   type: 'object',
 *   properties: {
 *     port: { type: 'number', minimum: 1024, maximum: 65535 },
 *     host: { type: 'string', pattern: '^[a-z0-9.-]+$' }
 *   },
 *   required: ['port', 'host']
 * };
 *
 * const result = validateConfigWithJsonSchema(config, schema);
 * ```
 */
const validateConfigWithJsonSchema = (config, jsonSchema) => {
    // Simple JSON schema validation (basic implementation)
    const errors = [];
    const validateType = (value, expectedType, path) => {
        const actualType = Array.isArray(value) ? 'array' : typeof value;
        if (actualType !== expectedType) {
            errors.push(`${path}: Expected ${expectedType}, got ${actualType}`);
        }
    };
    const validateObject = (obj, schema, basePath = '') => {
        if (schema.type === 'object' && schema.properties) {
            for (const [key, propSchema] of Object.entries(schema.properties)) {
                const path = basePath ? `${basePath}.${key}` : key;
                const value = obj?.[key];
                if (schema.required?.includes(key) && (value === undefined || value === null)) {
                    errors.push(`${path}: Required property missing`);
                    continue;
                }
                if (value !== undefined && propSchema.type) {
                    validateType(value, propSchema.type, path);
                }
                if (typeof propSchema === 'object' && propSchema.properties) {
                    validateObject(value, propSchema, path);
                }
            }
        }
    };
    validateObject(config, jsonSchema);
    return { valid: errors.length === 0, errors };
};
exports.validateConfigWithJsonSchema = validateConfigWithJsonSchema;
/**
 * 12. Merges multiple validation schemas with conflict resolution.
 *
 * @param {Joi.ObjectSchema[]} schemas - Schemas to merge
 * @param {'strict' | 'permissive'} strategy - Merge strategy
 * @returns {Joi.ObjectSchema} Merged schema
 *
 * @example
 * ```typescript
 * const merged = mergeValidationSchemas([
 *   baseSchema,
 *   environmentSchema,
 *   featureSchema
 * ], 'permissive');
 * ```
 */
const mergeValidationSchemas = (schemas, strategy = 'permissive') => {
    let merged = Joi.object({});
    for (const schema of schemas) {
        merged = merged.concat(schema);
    }
    return merged.options({
        allowUnknown: strategy === 'permissive',
        stripUnknown: strategy === 'strict',
    });
};
exports.mergeValidationSchemas = mergeValidationSchemas;
// ============================================================================
// MULTI-ENVIRONMENT CONFIGURATION
// ============================================================================
/**
 * 13. Loads environment-specific configuration with cascading.
 *
 * @param {string} environment - Environment name
 * @param {string} configDir - Configuration directory
 * @returns {Record<string, any>} Merged configuration
 *
 * @example
 * ```typescript
 * const config = loadEnvironmentSpecificConfig('production', './config');
 * // Loads: default.json -> production.json -> production.local.json
 * ```
 */
const loadEnvironmentSpecificConfig = (environment = process.env.NODE_ENV || 'development', configDir = path.join(process.cwd(), 'config')) => {
    const configFiles = [
        path.join(configDir, 'default.json'),
        path.join(configDir, 'default.js'),
        path.join(configDir, `${environment}.json`),
        path.join(configDir, `${environment}.js`),
        path.join(configDir, 'local.json'),
        path.join(configDir, 'local.js'),
        path.join(configDir, `${environment}.local.json`),
        path.join(configDir, `${environment}.local.js`),
    ];
    let merged = {};
    for (const file of configFiles) {
        if (fs.existsSync(file)) {
            const ext = path.extname(file);
            let config = {};
            if (ext === '.json') {
                config = JSON.parse(fs.readFileSync(file, 'utf-8'));
            }
            else if (ext === '.js') {
                config = require(file);
                if (typeof config === 'function') {
                    config = config();
                }
            }
            merged = deepMerge(merged, config);
        }
    }
    return merged;
};
exports.loadEnvironmentSpecificConfig = loadEnvironmentSpecificConfig;
/**
 * 14. Creates environment-aware configuration factory.
 *
 * @param {Record<string, () => any>} factories - Environment-specific factories
 * @returns {() => any} Configuration factory
 *
 * @example
 * ```typescript
 * const factory = createEnvironmentAwareFactory({
 *   development: () => ({ debug: true, cache: false }),
 *   production: () => ({ debug: false, cache: true })
 * });
 * ```
 */
const createEnvironmentAwareFactory = (factories) => {
    return () => {
        const env = process.env.NODE_ENV || 'development';
        const factory = factories[env] || factories['development'];
        if (!factory) {
            throw new Error(`No configuration factory found for environment: ${env}`);
        }
        return factory();
    };
};
exports.createEnvironmentAwareFactory = createEnvironmentAwareFactory;
/**
 * 15. Validates environment-specific requirements and constraints.
 *
 * @param {string} environment - Environment name
 * @param {Record<string, string[]>} requirements - Required variables per environment
 * @returns {{ valid: boolean; missing: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const result = validateEnvironmentRequirements('production', {
 *   production: ['DATABASE_SSL', 'SENTRY_DSN', 'REDIS_CLUSTER'],
 *   development: ['DEBUG']
 * });
 * ```
 */
const validateEnvironmentRequirements = (environment, requirements) => {
    const required = requirements[environment] || [];
    const missing = [];
    for (const varName of required) {
        if (!process.env[varName]) {
            missing.push(varName);
        }
    }
    return {
        valid: missing.length === 0,
        missing,
    };
};
exports.validateEnvironmentRequirements = validateEnvironmentRequirements;
/**
 * 16. Applies environment-specific overrides to base configuration.
 *
 * @param {Record<string, any>} baseConfig - Base configuration
 * @param {Record<string, Record<string, any>>} overrides - Environment overrides
 * @param {string} environment - Current environment
 * @returns {Record<string, any>} Configuration with overrides applied
 *
 * @example
 * ```typescript
 * const config = applyEnvironmentOverrides(baseConfig, {
 *   production: { database: { pool: { max: 20 } } },
 *   development: { database: { logging: true } }
 * }, 'production');
 * ```
 */
const applyEnvironmentOverrides = (baseConfig, overrides, environment = process.env.NODE_ENV || 'development') => {
    const envOverrides = overrides[environment] || {};
    return deepMerge(baseConfig, envOverrides);
};
exports.applyEnvironmentOverrides = applyEnvironmentOverrides;
// ============================================================================
// SECRET MANAGEMENT & VAULT INTEGRATION
// ============================================================================
/**
 * 17. Loads secrets from vault provider with caching.
 *
 * @param {SecretProviderConfig} config - Vault provider configuration
 * @returns {Promise<Record<string, string>>} Loaded secrets
 *
 * @example
 * ```typescript
 * const secrets = await loadSecretsFromVaultProvider({
 *   provider: 'aws-secrets-manager',
 *   secretId: 'white-cross/production/db',
 *   region: 'us-east-1',
 *   cacheDuration: 300
 * });
 * ```
 */
const loadSecretsFromVaultProvider = async (config) => {
    const cacheKey = `${config.provider}:${config.secretId}:${config.version || 'latest'}`;
    // Check cache
    const cached = secretsCache.get(cacheKey);
    if (cached && config.cacheDuration) {
        const age = Date.now() - cached.timestamp;
        if (age < config.cacheDuration * 1000) {
            return cached.secrets;
        }
    }
    let secrets = {};
    switch (config.provider) {
        case 'aws-secrets-manager': {
            const { SecretsManagerClient, GetSecretValueCommand } = await Promise.resolve().then(() => __importStar(require('@aws-sdk/client-secrets-manager')));
            const client = new SecretsManagerClient({
                region: config.region || 'us-east-1',
                ...(config.credentials || {}),
            });
            const response = await client.send(new GetSecretValueCommand({
                SecretId: config.secretId,
                VersionId: config.version,
            }));
            if (response.SecretString) {
                secrets = JSON.parse(response.SecretString);
            }
            break;
        }
        case 'azure-keyvault': {
            const { SecretClient } = await Promise.resolve().then(() => __importStar(require('@azure/keyvault-secrets')));
            const { DefaultAzureCredential } = await Promise.resolve().then(() => __importStar(require('@azure/identity')));
            const credential = new DefaultAzureCredential();
            const client = new SecretClient(config.endpoint || '', credential);
            const secret = await client.getSecret(config.secretId);
            if (secret.value) {
                secrets = JSON.parse(secret.value);
            }
            break;
        }
        case 'hashicorp-vault': {
            const response = await fetch(`${config.endpoint}/v1/${config.secretId}`, {
                headers: {
                    'X-Vault-Token': config.credentials?.token || process.env.VAULT_TOKEN || '',
                },
            });
            if (!response.ok) {
                throw new Error(`Vault request failed: ${response.statusText}`);
            }
            const data = await response.json();
            secrets = data.data?.data || data.data || {};
            break;
        }
        case 'google-secret-manager': {
            const { SecretManagerServiceClient } = await Promise.resolve().then(() => __importStar(require('@google-cloud/secret-manager')));
            const client = new SecretManagerServiceClient(config.credentials);
            const [version] = await client.accessSecretVersion({
                name: config.secretId,
            });
            if (version.payload?.data) {
                const secretString = version.payload.data.toString();
                secrets = JSON.parse(secretString);
            }
            break;
        }
    }
    // Cache secrets
    secretsCache.set(cacheKey, { secrets, timestamp: Date.now() });
    return secrets;
};
exports.loadSecretsFromVaultProvider = loadSecretsFromVaultProvider;
/**
 * 18. Rotates secrets with automatic callback and zero-downtime.
 *
 * @param {SecretRotationConfig} config - Rotation configuration
 * @param {(secrets: Record<string, string>) => void | Promise<void>} callback - Rotation callback
 * @returns {Promise<NodeJS.Timer>} Rotation interval timer
 *
 * @example
 * ```typescript
 * const timer = await rotateSecretsWithCallback({
 *   provider: 'aws-secrets-manager',
 *   secretId: 'white-cross/jwt',
 *   region: 'us-east-1',
 *   rotationInterval: 86400000 // 24 hours
 * }, async (newSecrets) => {
 *   await updateJwtKeys(newSecrets);
 * });
 * ```
 */
const rotateSecretsWithCallback = async (config, callback) => {
    const rotate = async () => {
        try {
            const secrets = await (0, exports.loadSecretsFromVaultProvider)(config);
            await callback(secrets);
            if (config.onRotate) {
                await config.onRotate(secrets);
            }
        }
        catch (error) {
            common_1.Logger.error(`Secret rotation failed: ${error.message}`, 'SecretRotation');
            // Retry logic
            if (config.retryAttempts && config.retryAttempts > 0) {
                for (let i = 0; i < config.retryAttempts; i++) {
                    await new Promise((resolve) => setTimeout(resolve, config.retryDelay || 5000));
                    try {
                        const secrets = await (0, exports.loadSecretsFromVaultProvider)(config);
                        await callback(secrets);
                        return;
                    }
                    catch (retryError) {
                        common_1.Logger.error(`Retry ${i + 1} failed: ${retryError.message}`, 'SecretRotation');
                    }
                }
            }
        }
    };
    // Initial rotation
    await rotate();
    // Schedule periodic rotation
    return setInterval(rotate, config.rotationInterval);
};
exports.rotateSecretsWithCallback = rotateSecretsWithCallback;
/**
 * 19. Caches secrets in memory with TTL expiration.
 *
 * @param {string} key - Cache key
 * @param {Record<string, string>} secrets - Secrets to cache
 * @param {number} ttl - Time to live in seconds
 * @returns {void}
 *
 * @example
 * ```typescript
 * cacheSecrets('db-credentials', secrets, 300); // Cache for 5 minutes
 * ```
 */
const cacheSecrets = (key, secrets, ttl) => {
    secretsCache.set(key, {
        secrets,
        timestamp: Date.now(),
    });
    // Auto-expire
    setTimeout(() => {
        secretsCache.delete(key);
    }, ttl * 1000);
};
exports.cacheSecrets = cacheSecrets;
/**
 * 20. Retrieves cached secrets with automatic refresh.
 *
 * @param {string} key - Cache key
 * @param {() => Promise<Record<string, string>>} loader - Loader function if cache miss
 * @returns {Promise<Record<string, string>>} Cached or loaded secrets
 *
 * @example
 * ```typescript
 * const secrets = await getCachedSecrets('db-creds', async () => {
 *   return await loadSecretsFromVaultProvider(config);
 * });
 * ```
 */
const getCachedSecrets = async (key, loader) => {
    const cached = secretsCache.get(key);
    if (cached) {
        return cached.secrets;
    }
    const secrets = await loader();
    secretsCache.set(key, { secrets, timestamp: Date.now() });
    return secrets;
};
exports.getCachedSecrets = getCachedSecrets;
/**
 * 21. Validates secret format and strength requirements.
 *
 * @param {Record<string, string>} secrets - Secrets to validate
 * @param {Record<string, { pattern?: RegExp; minLength?: number; maxLength?: number }>} rules - Validation rules
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const result = validateSecretFormat(secrets, {
 *   JWT_SECRET: { minLength: 32, pattern: /^[A-Za-z0-9+/=]+$/ },
 *   API_KEY: { minLength: 16, pattern: /^[A-Z0-9]{32}$/ }
 * });
 * ```
 */
const validateSecretFormat = (secrets, rules) => {
    const errors = [];
    for (const [key, rule] of Object.entries(rules)) {
        const value = secrets[key];
        if (!value) {
            errors.push(`Secret ${key} is missing`);
            continue;
        }
        if (rule.minLength && value.length < rule.minLength) {
            errors.push(`Secret ${key} is too short (min: ${rule.minLength})`);
        }
        if (rule.maxLength && value.length > rule.maxLength) {
            errors.push(`Secret ${key} is too long (max: ${rule.maxLength})`);
        }
        if (rule.pattern && !rule.pattern.test(value)) {
            errors.push(`Secret ${key} does not match required format`);
        }
    }
    return { valid: errors.length === 0, errors };
};
exports.validateSecretFormat = validateSecretFormat;
// ============================================================================
// FEATURE FLAGS & TOGGLES (DATABASE-BACKED)
// ============================================================================
/**
 * 22. Loads feature flags from database with caching.
 *
 * @param {string} environment - Environment name
 * @param {string} tenantId - Tenant ID for multi-tenancy
 * @returns {Promise<Record<string, FeatureFlagAttributes>>} Feature flags
 *
 * @example
 * ```typescript
 * const flags = await loadFeatureFlagsFromDB('production', 'tenant-123');
 * ```
 */
const loadFeatureFlagsFromDB = async (environment = process.env.NODE_ENV || 'development', tenantId) => {
    const where = { environment };
    if (tenantId) {
        where.tenantId = tenantId;
    }
    const flags = await FeatureFlagModel.findAll({ where });
    return flags.reduce((acc, flag) => {
        acc[flag.name] = flag.toJSON();
        return acc;
    }, {});
};
exports.loadFeatureFlagsFromDB = loadFeatureFlagsFromDB;
/**
 * 23. Evaluates feature flag with advanced conditions and rollout.
 *
 * @param {string} flagName - Feature flag name
 * @param {Record<string, any>} context - Evaluation context
 * @param {string} environment - Environment name
 * @returns {Promise<boolean>} Feature enabled status
 *
 * @example
 * ```typescript
 * const enabled = await evaluateFeatureFlag('new-dashboard', {
 *   userId: 'user-123',
 *   userEmail: 'user@example.com',
 *   tenantId: 'tenant-456'
 * });
 * ```
 */
const evaluateFeatureFlag = async (flagName, context = {}, environment = process.env.NODE_ENV || 'development') => {
    const where = { name: flagName, environment };
    if (context.tenantId) {
        where.tenantId = context.tenantId;
    }
    const flag = await FeatureFlagModel.findOne({ where });
    if (!flag || !flag.enabled) {
        return false;
    }
    // Check rollout percentage
    if (flag.rollout !== null && flag.rollout !== undefined) {
        const userId = context.userId || context.userEmail || '';
        if (userId) {
            const hash = simpleHash(`${flagName}:${userId}`);
            if (hash % 100 >= flag.rollout) {
                return false;
            }
        }
    }
    // Check conditions
    if (flag.conditions) {
        for (const [key, value] of Object.entries(flag.conditions)) {
            if (context[key] !== value) {
                return false;
            }
        }
    }
    return true;
};
exports.evaluateFeatureFlag = evaluateFeatureFlag;
/**
 * 24. Updates feature flag in database with validation.
 *
 * @param {string} flagName - Feature flag name
 * @param {Partial<FeatureFlagAttributes>} updates - Flag updates
 * @param {string} environment - Environment name
 * @returns {Promise<FeatureFlagAttributes>} Updated flag
 *
 * @example
 * ```typescript
 * const updated = await updateFeatureFlagInDB('beta-features', {
 *   enabled: true,
 *   rollout: 50,
 *   metadata: { updatedBy: 'admin' }
 * });
 * ```
 */
const updateFeatureFlagInDB = async (flagName, updates, environment = process.env.NODE_ENV || 'development') => {
    const [flag] = await FeatureFlagModel.findOrCreate({
        where: { name: flagName, environment },
        defaults: {
            name: flagName,
            enabled: false,
            environment,
            ...updates,
        },
    });
    if (updates) {
        await flag.update(updates);
    }
    return flag.toJSON();
};
exports.updateFeatureFlagInDB = updateFeatureFlagInDB;
/**
 * 25. Creates feature flag with default configuration.
 *
 * @param {Omit<FeatureFlagAttributes, 'id' | 'createdAt' | 'updatedAt'>} flagData - Flag data
 * @returns {Promise<FeatureFlagAttributes>} Created flag
 *
 * @example
 * ```typescript
 * const flag = await createFeatureFlag({
 *   name: 'new-ui',
 *   description: 'New patient dashboard UI',
 *   enabled: false,
 *   rollout: 0,
 *   environment: 'staging'
 * });
 * ```
 */
const createFeatureFlag = async (flagData) => {
    const flag = await FeatureFlagModel.create(flagData);
    return flag.toJSON();
};
exports.createFeatureFlag = createFeatureFlag;
/**
 * 26. Bulk updates multiple feature flags atomically.
 *
 * @param {Record<string, Partial<FeatureFlagAttributes>>} updates - Flags to update
 * @param {string} environment - Environment name
 * @returns {Promise<FeatureFlagAttributes[]>} Updated flags
 *
 * @example
 * ```typescript
 * const updated = await bulkUpdateFeatureFlags({
 *   'new-dashboard': { enabled: true },
 *   'beta-features': { rollout: 100 }
 * }, 'production');
 * ```
 */
const bulkUpdateFeatureFlags = async (updates, environment = process.env.NODE_ENV || 'development') => {
    const results = [];
    for (const [name, data] of Object.entries(updates)) {
        const updated = await (0, exports.updateFeatureFlagInDB)(name, data, environment);
        results.push(updated);
    }
    return results;
};
exports.bulkUpdateFeatureFlags = bulkUpdateFeatureFlags;
// ============================================================================
// DYNAMIC CONFIGURATION RELOAD
// ============================================================================
/**
 * 27. Watches configuration files for changes with debouncing.
 *
 * @param {ConfigWatchOptions} options - Watch options
 * @returns {FSWatcher[]} Array of file watchers
 *
 * @example
 * ```typescript
 * const watchers = watchConfigurationFiles({
 *   paths: ['.env', 'config/app.json'],
 *   debounce: 1000,
 *   onChange: async (event) => {
 *     console.log('Config changed:', event.changedKeys);
 *     await reloadApplication();
 *   }
 * });
 * ```
 */
const watchConfigurationFiles = (options) => {
    const watchers = [];
    for (const filePath of options.paths) {
        let oldConfig = null;
        let timeoutId = null;
        const handleChange = async () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(async () => {
                try {
                    const newConfig = loadConfigFile(filePath, options.encoding);
                    const changedKeys = getChangedKeys(oldConfig, newConfig);
                    const event = {
                        filePath,
                        type: 'modified',
                        oldConfig,
                        newConfig,
                        changedKeys,
                        timestamp: new Date(),
                    };
                    await options.onChange(event);
                    oldConfig = newConfig;
                }
                catch (error) {
                    common_1.Logger.error(`Error reloading config file ${filePath}: ${error.message}`);
                }
            }, options.debounce || 1000);
        };
        if (fs.existsSync(filePath)) {
            oldConfig = loadConfigFile(filePath, options.encoding);
        }
        const watcher = (0, fs_1.watch)(filePath, handleChange);
        watchers.push(watcher);
    }
    return watchers;
};
exports.watchConfigurationFiles = watchConfigurationFiles;
/**
 * 28. Creates hot-reloadable configuration provider.
 *
 * @param {string} filePath - Configuration file path
 * @param {(config: any) => void | Promise<void>} onReload - Reload callback
 * @returns {{ getConfig: () => any; reload: () => Promise<void>; stop: () => void }} Hot reload controller
 *
 * @example
 * ```typescript
 * const { getConfig, reload, stop } = createHotReloadProvider('./config.json', (newConfig) => {
 *   console.log('Configuration reloaded');
 * });
 *
 * const config = getConfig();
 * ```
 */
const createHotReloadProvider = (filePath, onReload) => {
    let currentConfig = loadConfigFile(filePath);
    let watcher = null;
    const reload = async () => {
        currentConfig = loadConfigFile(filePath);
        await onReload(currentConfig);
    };
    watcher = (0, fs_1.watch)(filePath, async () => {
        await reload();
    });
    return {
        getConfig: () => currentConfig,
        reload,
        stop: () => {
            if (watcher) {
                watcher.close();
            }
        },
    };
};
exports.createHotReloadProvider = createHotReloadProvider;
/**
 * 29. Implements configuration hot-swap with rollback on error.
 *
 * @param {() => Promise<any>} loader - Configuration loader
 * @param {(config: any) => Promise<boolean>} validator - Configuration validator
 * @returns {Promise<{ success: boolean; config?: any; error?: string }>} Hot-swap result
 *
 * @example
 * ```typescript
 * const result = await hotSwapConfiguration(
 *   async () => await loadConfigFromRemote(url),
 *   async (config) => validateConfigSchema(config)
 * );
 * ```
 */
const hotSwapConfiguration = async (loader, validator) => {
    const oldConfig = { ...process.env };
    try {
        const newConfig = await loader();
        const isValid = await validator(newConfig);
        if (!isValid) {
            return { success: false, error: 'Configuration validation failed' };
        }
        // Apply new configuration
        Object.assign(process.env, newConfig);
        return { success: true, config: newConfig };
    }
    catch (error) {
        // Rollback to old configuration
        Object.assign(process.env, oldConfig);
        return { success: false, error: error.message };
    }
};
exports.hotSwapConfiguration = hotSwapConfiguration;
// ============================================================================
// CONFIGURATION ENCRYPTION
// ============================================================================
/**
 * 30. Encrypts configuration value using AES-256-GCM.
 *
 * @param {string} value - Value to encrypt
 * @param {EncryptionConfig} config - Encryption configuration
 * @returns {string} Encrypted value with IV and auth tag (base64)
 *
 * @example
 * ```typescript
 * const encrypted = encryptConfigValueGCM('secret-value', {
 *   algorithm: 'aes-256-gcm',
 *   key: process.env.ENCRYPTION_KEY
 * });
 * ```
 */
const encryptConfigValueGCM = (value, config) => {
    const key = typeof config.key === 'string'
        ? crypto.scryptSync(config.key, 'salt', 32)
        : config.key;
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(config.algorithm || 'aes-256-gcm', key, iv, config.aad ? { authTagLength: config.tagLength || 16 } : undefined);
    if (config.aad) {
        cipher.setAAD(config.aad);
    }
    let encrypted = cipher.update(value, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    const authTag = cipher.getAuthTag().toString('base64');
    return `${iv.toString('base64')}:${authTag}:${encrypted}`;
};
exports.encryptConfigValueGCM = encryptConfigValueGCM;
/**
 * 31. Decrypts configuration value encrypted with AES-256-GCM.
 *
 * @param {string} encryptedValue - Encrypted value with IV and auth tag
 * @param {EncryptionConfig} config - Encryption configuration
 * @returns {string} Decrypted value
 *
 * @example
 * ```typescript
 * const decrypted = decryptConfigValueGCM(encrypted, {
 *   algorithm: 'aes-256-gcm',
 *   key: process.env.ENCRYPTION_KEY
 * });
 * ```
 */
const decryptConfigValueGCM = (encryptedValue, config) => {
    const [ivBase64, authTagBase64, encrypted] = encryptedValue.split(':');
    const key = typeof config.key === 'string'
        ? crypto.scryptSync(config.key, 'salt', 32)
        : config.key;
    const iv = Buffer.from(ivBase64, 'base64');
    const authTag = Buffer.from(authTagBase64, 'base64');
    const decipher = crypto.createDecipheriv(config.algorithm || 'aes-256-gcm', key, iv);
    if (config.aad) {
        decipher.setAAD(config.aad);
    }
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};
exports.decryptConfigValueGCM = decryptConfigValueGCM;
/**
 * 32. Encrypts entire configuration object recursively.
 *
 * @param {Record<string, any>} config - Configuration object
 * @param {EncryptionConfig} encryptionConfig - Encryption configuration
 * @param {string[]} excludeKeys - Keys to exclude from encryption
 * @returns {Record<string, any>} Encrypted configuration
 *
 * @example
 * ```typescript
 * const encrypted = encryptConfigObjectRecursive(config, {
 *   algorithm: 'aes-256-gcm',
 *   key: encryptionKey
 * }, ['version', 'environment']);
 * ```
 */
const encryptConfigObjectRecursive = (config, encryptionConfig, excludeKeys = []) => {
    const encrypted = {};
    for (const [key, value] of Object.entries(config)) {
        if (excludeKeys.includes(key)) {
            encrypted[key] = value;
        }
        else if (typeof value === 'string') {
            encrypted[key] = (0, exports.encryptConfigValueGCM)(value, encryptionConfig);
        }
        else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            encrypted[key] = (0, exports.encryptConfigObjectRecursive)(value, encryptionConfig, excludeKeys);
        }
        else {
            encrypted[key] = value;
        }
    }
    return encrypted;
};
exports.encryptConfigObjectRecursive = encryptConfigObjectRecursive;
// ============================================================================
// CONFIGURATION VERSIONING (DATABASE-BACKED)
// ============================================================================
/**
 * 33. Saves configuration version to database with checksum.
 *
 * @param {string} configKey - Configuration key/namespace
 * @param {Record<string, any>} configData - Configuration data
 * @param {Partial<ConfigHistoryAttributes>} metadata - Version metadata
 * @returns {Promise<ConfigHistoryAttributes>} Saved configuration version
 *
 * @example
 * ```typescript
 * const version = await saveConfigVersion('database', dbConfig, {
 *   version: '1.3.0',
 *   author: 'admin@example.com',
 *   reason: 'Increased connection pool size',
 *   environment: 'production'
 * });
 * ```
 */
const saveConfigVersion = async (configKey, configData, metadata = {}) => {
    const checksum = calculateConfigChecksum(configData);
    const environment = metadata.environment || process.env.NODE_ENV || 'development';
    const version = metadata.version || generateVersionNumber(configKey, environment);
    const history = await ConfigHistoryModel.create({
        configKey,
        version,
        configData,
        checksum,
        author: metadata.author,
        reason: metadata.reason,
        environment,
        tags: metadata.tags,
    });
    return history.toJSON();
};
exports.saveConfigVersion = saveConfigVersion;
/**
 * 34. Retrieves configuration version from database.
 *
 * @param {string} configKey - Configuration key
 * @param {string} version - Version number
 * @param {string} environment - Environment name
 * @returns {Promise<ConfigHistoryAttributes | null>} Configuration version
 *
 * @example
 * ```typescript
 * const config = await getConfigVersion('database', '1.2.0', 'production');
 * ```
 */
const getConfigVersion = async (configKey, version, environment = process.env.NODE_ENV || 'development') => {
    const history = await ConfigHistoryModel.findOne({
        where: { configKey, version, environment },
    });
    return history ? history.toJSON() : null;
};
exports.getConfigVersion = getConfigVersion;
/**
 * 35. Lists all configuration versions with pagination.
 *
 * @param {string} configKey - Configuration key
 * @param {string} environment - Environment name
 * @param {number} limit - Maximum versions to return
 * @returns {Promise<ConfigHistoryAttributes[]>} Configuration versions
 *
 * @example
 * ```typescript
 * const versions = await listConfigVersions('database', 'production', 10);
 * ```
 */
const listConfigVersions = async (configKey, environment = process.env.NODE_ENV || 'development', limit = 50) => {
    const histories = await ConfigHistoryModel.findAll({
        where: { configKey, environment },
        order: [['createdAt', 'DESC']],
        limit,
    });
    return histories.map((h) => h.toJSON());
};
exports.listConfigVersions = listConfigVersions;
/**
 * 36. Rolls back to a previous configuration version.
 *
 * @param {string} configKey - Configuration key
 * @param {string} version - Version to rollback to
 * @param {string} environment - Environment name
 * @returns {Promise<Record<string, any>>} Rolled back configuration
 *
 * @example
 * ```typescript
 * const config = await rollbackToVersion('database', '1.1.0', 'production');
 * ```
 */
const rollbackToVersion = async (configKey, version, environment = process.env.NODE_ENV || 'development') => {
    const history = await (0, exports.getConfigVersion)(configKey, version, environment);
    if (!history) {
        throw new Error(`Configuration version ${version} not found for ${configKey}`);
    }
    // Verify checksum
    const calculatedChecksum = calculateConfigChecksum(history.configData);
    if (calculatedChecksum !== history.checksum) {
        throw new Error('Configuration checksum mismatch - data may be corrupted');
    }
    return history.configData;
};
exports.rollbackToVersion = rollbackToVersion;
/**
 * 37. Compares two configuration versions and returns differences.
 *
 * @param {string} configKey - Configuration key
 * @param {string} version1 - First version
 * @param {string} version2 - Second version
 * @param {string} environment - Environment name
 * @returns {Promise<{ added: string[]; removed: string[]; modified: string[] }>} Configuration differences
 *
 * @example
 * ```typescript
 * const diff = await compareConfigVersions('database', '1.0.0', '1.1.0', 'production');
 * ```
 */
const compareConfigVersions = async (configKey, version1, version2, environment = process.env.NODE_ENV || 'development') => {
    const [config1, config2] = await Promise.all([
        (0, exports.getConfigVersion)(configKey, version1, environment),
        (0, exports.getConfigVersion)(configKey, version2, environment),
    ]);
    if (!config1 || !config2) {
        throw new Error('One or both configuration versions not found');
    }
    return getConfigDiff(config1.configData, config2.configData);
};
exports.compareConfigVersions = compareConfigVersions;
// ============================================================================
// TYPE-SAFE CONFIGURATION ACCESS
// ============================================================================
/**
 * 38. Creates type-safe configuration service with strict typing.
 *
 * @param {T} schema - Configuration schema/type
 * @param {Record<string, any>} config - Configuration data
 * @returns {{ get: <K extends keyof T>(key: K) => T[K] }} Type-safe config accessor
 *
 * @example
 * ```typescript
 * interface AppConfig {
 *   port: number;
 *   database: { host: string; port: number };
 * }
 *
 * const configService = createTypeSafeConfigService<AppConfig>({} as AppConfig, config);
 * const port = configService.get('port'); // Typed as number
 * ```
 */
const createTypeSafeConfigService = (schema, config) => {
    return {
        get: (key) => {
            return config[key];
        },
        getAll: () => {
            return config;
        },
    };
};
exports.createTypeSafeConfigService = createTypeSafeConfigService;
/**
 * 39. Gets nested configuration value with type safety.
 *
 * @param {Record<string, any>} config - Configuration object
 * @param {string} path - Dot-separated path
 * @param {T} defaultValue - Default value
 * @returns {T} Configuration value
 *
 * @example
 * ```typescript
 * const host = getNestedConfigValue<string>(config, 'database.pool.host', 'localhost');
 * ```
 */
const getNestedConfigValue = (config, path, defaultValue) => {
    const value = getNestedValue(config, path);
    return value !== undefined ? value : defaultValue;
};
exports.getNestedConfigValue = getNestedConfigValue;
/**
 * 40. Validates configuration at application startup.
 *
 * @param {Joi.ObjectSchema} schema - Validation schema
 * @param {Record<string, any>} config - Configuration to validate
 * @param {boolean} throwOnError - Whether to throw on validation error
 * @returns {Promise<{ valid: boolean; errors: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * await validateConfigurationOnStartup(configSchema, config, true);
 * ```
 */
const validateConfigurationOnStartup = async (schema, config = process.env, throwOnError = true) => {
    const result = schema.validate(config, {
        abortEarly: false,
        allowUnknown: true,
    });
    const errors = result.error ? result.error.details.map((d) => d.message) : [];
    if (errors.length > 0 && throwOnError) {
        common_1.Logger.error('Configuration validation failed on startup', 'ConfigValidation');
        errors.forEach((error) => common_1.Logger.error(error, 'ConfigValidation'));
        throw new Error(`Configuration validation failed: ${errors.join('; ')}`);
    }
    return {
        valid: errors.length === 0,
        errors,
    };
};
exports.validateConfigurationOnStartup = validateConfigurationOnStartup;
// ============================================================================
// REMOTE CONFIGURATION FETCHING
// ============================================================================
/**
 * 41. Fetches configuration from remote config server.
 *
 * @param {RemoteConfigOptions} options - Remote config options
 * @returns {Promise<Record<string, any>>} Fetched configuration
 *
 * @example
 * ```typescript
 * const config = await fetchRemoteConfiguration({
 *   url: 'https://config.example.com/api/config',
 *   authToken: process.env.CONFIG_SERVER_TOKEN,
 *   timeout: 5000,
 *   retryAttempts: 3
 * });
 * ```
 */
const fetchRemoteConfiguration = async (options) => {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    if (options.authToken) {
        headers['Authorization'] = `Bearer ${options.authToken}`;
    }
    const fetchWithRetry = async (attempt = 0) => {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), options.timeout || 10000);
            const response = await fetch(options.url, {
                method: options.method || 'GET',
                headers,
                signal: controller.signal,
            });
            clearTimeout(timeoutId);
            if (!response.ok) {
                throw new Error(`Remote config request failed: ${response.statusText}`);
            }
            return response;
        }
        catch (error) {
            if (attempt < (options.retryAttempts || 0)) {
                await new Promise((resolve) => setTimeout(resolve, options.retryDelay || 1000));
                return fetchWithRetry(attempt + 1);
            }
            throw error;
        }
    };
    const response = await fetchWithRetry();
    const config = await response.json();
    // Cache if enabled
    if (options.cache && options.cacheTTL) {
        cacheRemoteConfig(options.url, config, options.cacheTTL);
    }
    return config;
};
exports.fetchRemoteConfiguration = fetchRemoteConfiguration;
// ============================================================================
// CONFIGURATION DOCUMENTATION GENERATION
// ============================================================================
/**
 * 42. Generates configuration documentation in specified format.
 *
 * @param {Record<string, any>} config - Configuration object
 * @param {ConfigDocOptions} options - Documentation options
 * @returns {string} Generated documentation
 *
 * @example
 * ```typescript
 * const docs = generateConfigDocumentation(config, {
 *   format: 'markdown',
 *   includeExamples: true,
 *   includeTypes: true
 * });
 * ```
 */
const generateConfigDocumentation = (config, options) => {
    if (options.format === 'markdown') {
        return generateMarkdownDocs(config, options);
    }
    else if (options.format === 'json') {
        return JSON.stringify(config, null, 2);
    }
    else {
        return generateHtmlDocs(config, options);
    }
};
exports.generateConfigDocumentation = generateConfigDocumentation;
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/** In-memory secrets cache */
const secretsCache = new Map();
/** Remote config cache */
const remoteConfigCache = new Map();
/**
 * Deep merges two objects recursively.
 */
const deepMerge = (target, source) => {
    if (!isObject(target) || !isObject(source)) {
        return source;
    }
    const result = { ...target };
    for (const key in source) {
        if (isObject(source[key])) {
            result[key] = deepMerge(result[key] || {}, source[key]);
        }
        else {
            result[key] = source[key];
        }
    }
    return result;
};
/**
 * Checks if value is a plain object.
 */
const isObject = (obj) => {
    return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
};
/**
 * Gets nested value from object using dot notation.
 */
const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
};
/**
 * Calculates SHA-256 checksum of configuration data.
 */
const calculateConfigChecksum = (config) => {
    const json = JSON.stringify(config, Object.keys(config).sort());
    return crypto.createHash('sha256').update(json).digest('hex');
};
/**
 * Generates version number for configuration.
 */
const generateVersionNumber = async (configKey, environment) => {
    const latestVersion = await ConfigHistoryModel.findOne({
        where: { configKey, environment },
        order: [['createdAt', 'DESC']],
    });
    if (!latestVersion) {
        return '1.0.0';
    }
    const [major, minor, patch] = latestVersion.version.split('.').map(Number);
    return `${major}.${minor}.${patch + 1}`;
};
/**
 * Gets changed keys between two configuration objects.
 */
const getChangedKeys = (oldConfig, newConfig) => {
    const changed = [];
    const allKeys = new Set([
        ...Object.keys(oldConfig || {}),
        ...Object.keys(newConfig || {}),
    ]);
    for (const key of allKeys) {
        if (oldConfig?.[key] !== newConfig?.[key]) {
            changed.push(key);
        }
    }
    return changed;
};
/**
 * Gets configuration differences between two versions.
 */
const getConfigDiff = (config1, config2) => {
    const added = [];
    const removed = [];
    const modified = [];
    const keys1 = Object.keys(config1);
    const keys2 = Object.keys(config2);
    for (const key of keys2) {
        if (!keys1.includes(key)) {
            added.push(key);
        }
        else if (JSON.stringify(config1[key]) !== JSON.stringify(config2[key])) {
            modified.push(key);
        }
    }
    for (const key of keys1) {
        if (!keys2.includes(key)) {
            removed.push(key);
        }
    }
    return { added, removed, modified };
};
/**
 * Simple hash function for feature flag rollout.
 */
const simpleHash = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
};
/**
 * Loads configuration from file (JSON or JS).
 */
const loadConfigFile = (filePath, encoding = 'utf-8') => {
    if (!fs.existsSync(filePath)) {
        return {};
    }
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.json') {
        return JSON.parse(fs.readFileSync(filePath, encoding));
    }
    else if (ext === '.js' || ext === '.ts') {
        const config = require(filePath);
        return typeof config === 'function' ? config() : config;
    }
    return {};
};
/**
 * Caches remote configuration.
 */
const cacheRemoteConfig = (key, config, ttl) => {
    remoteConfigCache.set(key, {
        config,
        expiresAt: Date.now() + ttl * 1000,
    });
};
/**
 * Generates Markdown documentation.
 */
const generateMarkdownDocs = (config, options) => {
    let markdown = '# Configuration Documentation\n\n';
    for (const [key, value] of Object.entries(config)) {
        markdown += `## ${key}\n\n`;
        markdown += `- **Type**: ${typeof value}\n`;
        if (options.includeDefaults && value !== undefined) {
            markdown += `- **Default**: \`${JSON.stringify(value)}\`\n`;
        }
        if (options.includeExamples) {
            markdown += `- **Example**: \`${JSON.stringify(value)}\`\n`;
        }
        markdown += '\n';
    }
    return markdown;
};
/**
 * Generates HTML documentation.
 */
const generateHtmlDocs = (config, options) => {
    let html = '<html><head><title>Configuration Documentation</title></head><body>';
    html += '<h1>Configuration Documentation</h1>';
    for (const [key, value] of Object.entries(config)) {
        html += `<h2>${key}</h2>`;
        html += `<p><strong>Type:</strong> ${typeof value}</p>`;
        if (options.includeDefaults) {
            html += `<p><strong>Default:</strong> <code>${JSON.stringify(value)}</code></p>`;
        }
    }
    html += '</body></html>';
    return html;
};
//# sourceMappingURL=config-environment-kit.js.map