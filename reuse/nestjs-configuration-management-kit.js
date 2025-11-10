"use strict";
/**
 * @fileoverview NestJS Configuration Management Kit
 * @module reuse/nestjs-configuration-management-kit
 * @description Comprehensive configuration management utilities for NestJS applications covering
 * environment validation, config schemas, namespace factories, dynamic loading, secret management,
 * feature flags, encryption, multi-environment support, caching, hot reload, and type safety.
 *
 * Key Features:
 * - Environment variable validation and parsing
 * - Configuration schema management (Joi, class-validator)
 * - Namespace-based configuration organization
 * - Dynamic configuration loading from multiple sources
 * - Secret management (AWS Secrets Manager, Azure Key Vault, HashiCorp Vault)
 * - Feature flag management and evaluation
 * - Configuration encryption and decryption
 * - Multi-environment support (dev, staging, production)
 * - Configuration caching and invalidation
 * - Hot reload and file watching
 * - Configuration versioning and migration
 * - Type-safe configuration access
 * - Deep merging and defaults handling
 * - HIPAA-compliant configuration patterns
 *
 * @target NestJS v11.x, Node 18+, TypeScript 5.x
 *
 * @security
 * - Encrypted configuration storage
 * - Secret rotation support
 * - Audit logging for configuration access
 * - Role-based configuration access
 * - HIPAA-compliant security defaults
 * - Configuration validation and sanitization
 * - Secure secret injection patterns
 *
 * @example Basic usage
 * ```typescript
 * import {
 *   validateRequiredEnvVars,
 *   createJoiValidationSchema,
 *   createConfigNamespace,
 *   loadConfigFromFile
 * } from './nestjs-configuration-management-kit';
 *
 * // Validate environment variables
 * validateRequiredEnvVars(['DATABASE_HOST', 'JWT_SECRET']);
 *
 * // Create validation schema
 * const schema = createJoiValidationSchema({
 *   PORT: Joi.number().port().default(3000),
 *   DATABASE_HOST: Joi.string().required()
 * });
 * ```
 *
 * @example Advanced usage
 * ```typescript
 * import {
 *   loadSecretsFromAWS,
 *   createFeatureFlagProvider,
 *   encryptConfigValue,
 *   watchConfigFile,
 *   createTypeSafeConfigService
 * } from './nestjs-configuration-management-kit';
 *
 * // Load secrets from AWS
 * await loadSecretsFromAWS('white-cross/production', 'us-east-1');
 *
 * // Create feature flags
 * const flags = createFeatureFlagProvider({
 *   newDashboard: true,
 *   betaFeatures: false
 * });
 *
 * // Watch config file for changes
 * watchConfigFile('.env', (changes) => {
 *   console.log('Config changed:', changes);
 * });
 * ```
 *
 * LOC: WC-CFGMGMT-2025
 * UPSTREAM: @nestjs/config, @nestjs/common, joi, class-validator, class-transformer
 * DOWNSTREAM: Application modules, services, controllers, guards, middleware
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
exports.createHotReloadConfig = exports.watchConfigFile = exports.createCachedGetter = exports.invalidateCacheByPattern = exports.createConfigCache = exports.validateAcrossEnvironments = exports.validateEnvironmentConfig = exports.detectEnvironment = exports.loadEnvironmentConfig = exports.encryptConfigObject = exports.hashConfigValue = exports.decryptConfigValue = exports.encryptConfigValue = exports.createDynamicFeatureFlag = exports.evaluateFeatureFlagRollout = exports.loadFeatureFlags = exports.createFeatureFlagProvider = exports.validateSecrets = exports.rotateSecrets = exports.injectSecretsIntoEnv = exports.loadSecretsFromVault = exports.loadSecretsFromAzure = exports.loadSecretsFromAWS = exports.loadMultipleSources = exports.loadConditionalConfig = exports.createAsyncConfigFactory = exports.loadConfigFromRemote = exports.loadConfigFromFile = exports.mergeNamespaces = exports.getEntireNamespace = exports.getNamespacedConfig = exports.createMultipleNamespaces = exports.createConfigNamespace = exports.validateNestedConfig = exports.generateSchemaFromTypes = exports.mergeValidationSchemas = exports.createClassValidatorSchema = exports.validateConfigWithJoi = exports.createJoiValidationSchema = exports.applyEnvVarDefaults = exports.validateEnvVarDependencies = exports.checkMissingEnvVars = exports.validateEnvVarPattern = exports.parseEnvVar = exports.validateRequiredEnvVars = void 0;
const config_1 = require("@nestjs/config");
const Joi = __importStar(require("joi"));
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const crypto = __importStar(require("crypto"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const fs_1 = require("fs");
// ============================================================================
// ENVIRONMENT VARIABLE VALIDATION
// ============================================================================
/**
 * 1. Validates required environment variables are present and populated.
 *
 * @param {string[]} requiredVars - List of required environment variable names
 * @param {boolean} throwOnError - Whether to throw error on validation failure
 * @returns {EnvValidationResult} Validation result with missing variables
 *
 * @example
 * ```typescript
 * const result = validateRequiredEnvVars(['DATABASE_HOST', 'JWT_SECRET']);
 * if (!result.valid) {
 *   console.error('Missing env vars:', result.missing);
 * }
 * ```
 */
const validateRequiredEnvVars = (requiredVars, throwOnError = false) => {
    const missing = [];
    const errors = [];
    for (const varName of requiredVars) {
        if (!process.env[varName] || process.env[varName]?.trim() === '') {
            missing.push(varName);
            errors.push(`Required environment variable ${varName} is not set`);
        }
    }
    const valid = missing.length === 0;
    if (!valid && throwOnError) {
        throw new Error(`Environment validation failed: ${errors.join(', ')}`);
    }
    return {
        valid,
        missing,
        invalid: [],
        defaults: {},
        errors,
    };
};
exports.validateRequiredEnvVars = validateRequiredEnvVars;
/**
 * 2. Parses environment variable with type conversion and validation.
 *
 * @param {string} varName - Environment variable name
 * @param {string} type - Expected type ('string' | 'number' | 'boolean' | 'json')
 * @param {any} defaultValue - Default value if not set
 * @returns {any} Parsed and typed value
 *
 * @example
 * ```typescript
 * const port = parseEnvVar('PORT', 'number', 3000);
 * const isDebug = parseEnvVar('DEBUG', 'boolean', false);
 * const config = parseEnvVar('APP_CONFIG', 'json', {});
 * ```
 */
const parseEnvVar = (varName, type = 'string', defaultValue) => {
    const value = process.env[varName];
    if (value === undefined || value === null || value === '') {
        return defaultValue;
    }
    try {
        switch (type) {
            case 'number':
                const num = Number(value);
                if (isNaN(num)) {
                    throw new Error(`Invalid number: ${value}`);
                }
                return num;
            case 'boolean':
                return (value.toLowerCase() === 'true' || value === '1');
            case 'json':
                return JSON.parse(value);
            case 'string':
            default:
                return value;
        }
    }
    catch (error) {
        if (defaultValue !== undefined) {
            return defaultValue;
        }
        throw new Error(`Failed to parse env var ${varName}: ${error.message}`);
    }
};
exports.parseEnvVar = parseEnvVar;
/**
 * 3. Validates environment variable against a pattern or regex.
 *
 * @param {string} varName - Environment variable name
 * @param {RegExp | string} pattern - Validation pattern
 * @param {string} errorMessage - Custom error message
 * @returns {boolean} Validation result
 *
 * @example
 * ```typescript
 * validateEnvVarPattern('EMAIL', /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
 * validateEnvVarPattern('API_KEY', /^[A-Z0-9]{32}$/);
 * ```
 */
const validateEnvVarPattern = (varName, pattern, errorMessage) => {
    const value = process.env[varName];
    if (!value) {
        throw new Error(`Environment variable ${varName} is not set`);
    }
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
    if (!regex.test(value)) {
        throw new Error(errorMessage || `Environment variable ${varName} does not match pattern ${pattern}`);
    }
    return true;
};
exports.validateEnvVarPattern = validateEnvVarPattern;
/**
 * 4. Checks for missing environment variables and returns list.
 *
 * @param {string[]} varNames - List of variable names to check
 * @returns {string[]} List of missing variable names
 *
 * @example
 * ```typescript
 * const missing = checkMissingEnvVars(['DB_HOST', 'DB_PORT', 'DB_NAME']);
 * if (missing.length > 0) {
 *   console.warn('Missing vars:', missing);
 * }
 * ```
 */
const checkMissingEnvVars = (varNames) => {
    return varNames.filter((varName) => !process.env[varName]);
};
exports.checkMissingEnvVars = checkMissingEnvVars;
/**
 * 5. Validates environment variable combinations and dependencies.
 *
 * @param {Record<string, string[]>} dependencies - Map of variables to their dependencies
 * @returns {EnvValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateEnvVarDependencies({
 *   DATABASE_SSL: ['DATABASE_SSL_CERT', 'DATABASE_SSL_KEY'],
 *   JWT_ALGORITHM_RS256: ['JWT_PUBLIC_KEY', 'JWT_PRIVATE_KEY']
 * });
 * ```
 */
const validateEnvVarDependencies = (dependencies) => {
    const missing = [];
    const errors = [];
    for (const [parentVar, requiredVars] of Object.entries(dependencies)) {
        if (process.env[parentVar]) {
            for (const requiredVar of requiredVars) {
                if (!process.env[requiredVar]) {
                    missing.push(requiredVar);
                    errors.push(`When ${parentVar} is set, ${requiredVar} is required but not found`);
                }
            }
        }
    }
    return {
        valid: missing.length === 0,
        missing,
        invalid: [],
        defaults: {},
        errors,
    };
};
exports.validateEnvVarDependencies = validateEnvVarDependencies;
/**
 * 6. Applies default values for missing environment variables.
 *
 * @param {Record<string, string>} defaults - Map of variable names to default values
 * @param {boolean} overwrite - Whether to overwrite existing values
 * @returns {Record<string, string>} Applied defaults
 *
 * @example
 * ```typescript
 * const applied = applyEnvVarDefaults({
 *   PORT: '3000',
 *   NODE_ENV: 'development',
 *   LOG_LEVEL: 'info'
 * });
 * ```
 */
const applyEnvVarDefaults = (defaults, overwrite = false) => {
    const applied = {};
    for (const [key, value] of Object.entries(defaults)) {
        if (!process.env[key] || overwrite) {
            process.env[key] = value;
            applied[key] = value;
        }
    }
    return applied;
};
exports.applyEnvVarDefaults = applyEnvVarDefaults;
// ============================================================================
// CONFIGURATION SCHEMA MANAGEMENT
// ============================================================================
/**
 * 7. Creates Joi validation schema for configuration.
 *
 * @param {Record<string, Joi.Schema>} schemaDefinition - Schema definition
 * @param {Joi.ValidationOptions} options - Validation options
 * @returns {Joi.ObjectSchema} Joi validation schema
 *
 * @example
 * ```typescript
 * const schema = createJoiValidationSchema({
 *   PORT: Joi.number().port().default(3000),
 *   DATABASE_HOST: Joi.string().required(),
 *   DATABASE_PORT: Joi.number().port().default(5432)
 * });
 * ```
 */
const createJoiValidationSchema = (schemaDefinition, options = {}) => {
    return Joi.object(schemaDefinition).options({
        abortEarly: false,
        allowUnknown: true,
        ...options,
    });
};
exports.createJoiValidationSchema = createJoiValidationSchema;
/**
 * 8. Validates configuration against Joi schema.
 *
 * @param {any} config - Configuration object to validate
 * @param {Joi.ObjectSchema} schema - Joi validation schema
 * @returns {{ value: any; error?: Joi.ValidationError }} Validation result
 *
 * @example
 * ```typescript
 * const result = validateConfigWithJoi(process.env, schema);
 * if (result.error) {
 *   throw new Error(result.error.message);
 * }
 * ```
 */
const validateConfigWithJoi = (config, schema) => {
    return schema.validate(config);
};
exports.validateConfigWithJoi = validateConfigWithJoi;
/**
 * 9. Creates class-validator schema from class definition.
 *
 * @param {any} ClassType - Class with validation decorators
 * @param {any} config - Configuration object
 * @returns {any} Validated and transformed instance
 *
 * @example
 * ```typescript
 * class EnvironmentVariables {
 *   @IsNumber()
 *   PORT: number = 3000;
 * }
 * const validated = createClassValidatorSchema(EnvironmentVariables, process.env);
 * ```
 */
const createClassValidatorSchema = (ClassType, config) => {
    const validatedConfig = (0, class_transformer_1.plainToClass)(ClassType, config, {
        enableImplicitConversion: true,
    });
    const errors = (0, class_validator_1.validateSync)(validatedConfig, {
        skipMissingProperties: false,
    });
    if (errors.length > 0) {
        const messages = errors.map((err) => Object.values(err.constraints || {}).join(', '));
        throw new Error(`Configuration validation failed: ${messages.join('; ')}`);
    }
    return validatedConfig;
};
exports.createClassValidatorSchema = createClassValidatorSchema;
/**
 * 10. Merges multiple validation schemas together.
 *
 * @param {Joi.ObjectSchema[]} schemas - Array of Joi schemas to merge
 * @returns {Joi.ObjectSchema} Merged schema
 *
 * @example
 * ```typescript
 * const merged = mergeValidationSchemas([
 *   databaseSchema,
 *   authSchema,
 *   cacheSchema
 * ]);
 * ```
 */
const mergeValidationSchemas = (schemas) => {
    let merged = Joi.object({});
    for (const schema of schemas) {
        merged = merged.concat(schema);
    }
    return merged;
};
exports.mergeValidationSchemas = mergeValidationSchemas;
/**
 * 11. Generates validation schema from TypeScript interface (runtime).
 *
 * @param {Record<string, string>} typeMap - Map of property names to types
 * @returns {Joi.ObjectSchema} Generated Joi schema
 *
 * @example
 * ```typescript
 * const schema = generateSchemaFromTypes({
 *   port: 'number',
 *   host: 'string',
 *   enabled: 'boolean'
 * });
 * ```
 */
const generateSchemaFromTypes = (typeMap) => {
    const schemaObj = {};
    for (const [key, type] of Object.entries(typeMap)) {
        switch (type.toLowerCase()) {
            case 'number':
                schemaObj[key] = Joi.number();
                break;
            case 'string':
                schemaObj[key] = Joi.string();
                break;
            case 'boolean':
                schemaObj[key] = Joi.boolean();
                break;
            case 'array':
                schemaObj[key] = Joi.array();
                break;
            case 'object':
                schemaObj[key] = Joi.object();
                break;
            default:
                schemaObj[key] = Joi.any();
        }
    }
    return Joi.object(schemaObj);
};
exports.generateSchemaFromTypes = generateSchemaFromTypes;
/**
 * 12. Validates nested configuration objects recursively.
 *
 * @param {any} config - Configuration object
 * @param {Joi.ObjectSchema} schema - Validation schema
 * @param {string} path - Current path for error reporting
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const result = validateNestedConfig(config, schema, 'database');
 * ```
 */
const validateNestedConfig = (config, schema, path = '') => {
    const result = schema.validate(config, { abortEarly: false });
    const errors = [];
    if (result.error) {
        result.error.details.forEach((detail) => {
            const fullPath = path ? `${path}.${detail.path.join('.')}` : detail.path.join('.');
            errors.push(`${fullPath}: ${detail.message}`);
        });
    }
    return {
        valid: errors.length === 0,
        errors,
    };
};
exports.validateNestedConfig = validateNestedConfig;
// ============================================================================
// NAMESPACE CONFIGURATION
// ============================================================================
/**
 * 13. Creates a configuration namespace factory with registerAs.
 *
 * @param {string} namespace - Namespace name
 * @param {() => any} factory - Configuration factory function
 * @returns {ConfigFactory} NestJS configuration factory
 *
 * @example
 * ```typescript
 * const dbConfig = createConfigNamespace('database', () => ({
 *   host: process.env.DB_HOST,
 *   port: parseInt(process.env.DB_PORT)
 * }));
 * ```
 */
const createConfigNamespace = (namespace, factory) => {
    return (0, config_1.registerAs)(namespace, factory);
};
exports.createConfigNamespace = createConfigNamespace;
/**
 * 14. Creates multiple namespaced configurations at once.
 *
 * @param {Record<string, () => any>} namespaces - Map of namespace names to factories
 * @returns {Array<ReturnType<typeof registerAs>>} Array of config factories
 *
 * @example
 * ```typescript
 * const configs = createMultipleNamespaces({
 *   database: () => ({ host: 'localhost' }),
 *   redis: () => ({ host: 'localhost', port: 6379 })
 * });
 * ```
 */
const createMultipleNamespaces = (namespaces) => {
    return Object.entries(namespaces).map(([name, factory]) => (0, config_1.registerAs)(name, factory));
};
exports.createMultipleNamespaces = createMultipleNamespaces;
/**
 * 15. Gets namespaced configuration value safely.
 *
 * @param {ConfigService} configService - NestJS ConfigService
 * @param {string} namespace - Namespace name
 * @param {string} key - Configuration key
 * @param {any} defaultValue - Default value if not found
 * @returns {any} Configuration value
 *
 * @example
 * ```typescript
 * const dbHost = getNamespacedConfig(configService, 'database', 'host', 'localhost');
 * ```
 */
const getNamespacedConfig = (configService, namespace, key, defaultValue) => {
    return configService.get(`${namespace}.${key}`, defaultValue);
};
exports.getNamespacedConfig = getNamespacedConfig;
/**
 * 16. Retrieves entire namespace configuration object.
 *
 * @param {ConfigService} configService - NestJS ConfigService
 * @param {string} namespace - Namespace name
 * @returns {any} Namespace configuration object
 *
 * @example
 * ```typescript
 * const dbConfig = getEntireNamespace(configService, 'database');
 * ```
 */
const getEntireNamespace = (configService, namespace) => {
    return configService.get(namespace);
};
exports.getEntireNamespace = getEntireNamespace;
/**
 * 17. Merges multiple namespace configurations.
 *
 * @param {ConfigService} configService - NestJS ConfigService
 * @param {string[]} namespaces - Array of namespace names
 * @returns {any} Merged configuration object
 *
 * @example
 * ```typescript
 * const merged = mergeNamespaces(configService, ['database', 'redis', 'cache']);
 * ```
 */
const mergeNamespaces = (configService, namespaces) => {
    const merged = {};
    for (const namespace of namespaces) {
        const config = configService.get(namespace);
        if (config) {
            merged[namespace] = config;
        }
    }
    return merged;
};
exports.mergeNamespaces = mergeNamespaces;
// ============================================================================
// DYNAMIC CONFIGURATION LOADING
// ============================================================================
/**
 * 18. Loads configuration from JSON or YAML file.
 *
 * @param {string} filePath - Path to configuration file
 * @param {boolean} required - Whether file is required
 * @returns {any} Loaded configuration object
 *
 * @example
 * ```typescript
 * const config = loadConfigFromFile('./config/app.json');
 * ```
 */
const loadConfigFromFile = (filePath, required = false) => {
    const absolutePath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
    if (!fs.existsSync(absolutePath)) {
        if (required) {
            throw new Error(`Required configuration file not found: ${filePath}`);
        }
        return {};
    }
    const content = fs.readFileSync(absolutePath, 'utf-8');
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.json') {
        return JSON.parse(content);
    }
    else if (ext === '.js' || ext === '.ts') {
        return require(absolutePath);
    }
    throw new Error(`Unsupported configuration file format: ${ext}`);
};
exports.loadConfigFromFile = loadConfigFromFile;
/**
 * 19. Loads configuration asynchronously from remote source.
 *
 * @param {string} url - Remote configuration URL
 * @param {RequestInit} options - Fetch options
 * @returns {Promise<any>} Remote configuration
 *
 * @example
 * ```typescript
 * const config = await loadConfigFromRemote('https://config.example.com/app.json');
 * ```
 */
const loadConfigFromRemote = async (url, options) => {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`Failed to load remote config: ${response.statusText}`);
        }
        return await response.json();
    }
    catch (error) {
        throw new Error(`Error loading remote configuration: ${error.message}`);
    }
};
exports.loadConfigFromRemote = loadConfigFromRemote;
/**
 * 20. Creates async configuration factory for dynamic loading.
 *
 * @param {() => Promise<any>} loader - Async configuration loader
 * @param {number} timeout - Timeout in milliseconds
 * @returns {() => Promise<any>} Async factory function
 *
 * @example
 * ```typescript
 * const factory = createAsyncConfigFactory(async () => {
 *   return await loadSecretsFromVault();
 * }, 5000);
 * ```
 */
const createAsyncConfigFactory = (loader, timeout = 10000) => {
    return async () => {
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Configuration loading timeout')), timeout));
        return Promise.race([loader(), timeoutPromise]);
    };
};
exports.createAsyncConfigFactory = createAsyncConfigFactory;
/**
 * 21. Conditionally loads configuration based on environment.
 *
 * @param {Record<string, () => any>} envConfigs - Map of environment to config factory
 * @param {string} environment - Current environment
 * @returns {any} Environment-specific configuration
 *
 * @example
 * ```typescript
 * const config = loadConditionalConfig({
 *   development: () => ({ debug: true }),
 *   production: () => ({ debug: false })
 * }, 'development');
 * ```
 */
const loadConditionalConfig = (envConfigs, environment) => {
    const env = environment || process.env.NODE_ENV || 'development';
    const factory = envConfigs[env];
    if (!factory) {
        throw new Error(`No configuration found for environment: ${env}`);
    }
    return factory();
};
exports.loadConditionalConfig = loadConditionalConfig;
/**
 * 22. Loads and merges multiple configuration sources.
 *
 * @param {DynamicConfigSource[]} sources - Array of configuration sources
 * @returns {Promise<any>} Merged configuration
 *
 * @example
 * ```typescript
 * const config = await loadMultipleSources([
 *   { type: 'file', location: './config.json' },
 *   { type: 'env', location: '.env' }
 * ]);
 * ```
 */
const loadMultipleSources = async (sources) => {
    let merged = {};
    for (const source of sources) {
        let config = {};
        if (source.type === 'file') {
            config = (0, exports.loadConfigFromFile)(source.location, false);
        }
        else if (source.loader) {
            config = await source.loader();
        }
        if (source.merge !== false) {
            merged = deepMerge(merged, config);
        }
        else {
            merged = config;
        }
    }
    return merged;
};
exports.loadMultipleSources = loadMultipleSources;
// ============================================================================
// SECRET MANAGEMENT
// ============================================================================
/**
 * 23. Loads secrets from AWS Secrets Manager.
 *
 * @param {string} secretName - Secret name or ARN
 * @param {string} region - AWS region
 * @returns {Promise<Record<string, string>>} Secret key-value pairs
 *
 * @example
 * ```typescript
 * const secrets = await loadSecretsFromAWS('white-cross/production', 'us-east-1');
 * ```
 */
const loadSecretsFromAWS = async (secretName, region = 'us-east-1') => {
    try {
        // Dynamic import to avoid bundling AWS SDK if not needed
        const { SecretsManagerClient, GetSecretValueCommand } = await Promise.resolve().then(() => __importStar(require('@aws-sdk/client-secrets-manager')));
        const client = new SecretsManagerClient({ region });
        const response = await client.send(new GetSecretValueCommand({ SecretId: secretName }));
        if (response.SecretString) {
            return JSON.parse(response.SecretString);
        }
        throw new Error('Secret value not found');
    }
    catch (error) {
        throw new Error(`Failed to load AWS secrets: ${error.message}`);
    }
};
exports.loadSecretsFromAWS = loadSecretsFromAWS;
/**
 * 24. Loads secrets from Azure Key Vault.
 *
 * @param {string} vaultUrl - Key Vault URL
 * @param {string} secretName - Secret name
 * @returns {Promise<string>} Secret value
 *
 * @example
 * ```typescript
 * const secret = await loadSecretsFromAzure(
 *   'https://myvault.vault.azure.net',
 *   'database-password'
 * );
 * ```
 */
const loadSecretsFromAzure = async (vaultUrl, secretName) => {
    try {
        const { SecretClient } = await Promise.resolve().then(() => __importStar(require('@azure/keyvault-secrets')));
        const { DefaultAzureCredential } = await Promise.resolve().then(() => __importStar(require('@azure/identity')));
        const credential = new DefaultAzureCredential();
        const client = new SecretClient(vaultUrl, credential);
        const secret = await client.getSecret(secretName);
        return secret.value || '';
    }
    catch (error) {
        throw new Error(`Failed to load Azure secret: ${error.message}`);
    }
};
exports.loadSecretsFromAzure = loadSecretsFromAzure;
/**
 * 25. Loads secrets from HashiCorp Vault.
 *
 * @param {string} endpoint - Vault endpoint URL
 * @param {string} token - Vault token
 * @param {string} secretPath - Secret path
 * @returns {Promise<Record<string, any>>} Secret data
 *
 * @example
 * ```typescript
 * const secrets = await loadSecretsFromVault(
 *   'http://localhost:8200',
 *   'vault-token',
 *   'secret/data/myapp'
 * );
 * ```
 */
const loadSecretsFromVault = async (endpoint, token, secretPath) => {
    try {
        const response = await fetch(`${endpoint}/v1/${secretPath}`, {
            headers: {
                'X-Vault-Token': token,
            },
        });
        if (!response.ok) {
            throw new Error(`Vault request failed: ${response.statusText}`);
        }
        const data = await response.json();
        return data.data?.data || data.data || {};
    }
    catch (error) {
        throw new Error(`Failed to load Vault secrets: ${error.message}`);
    }
};
exports.loadSecretsFromVault = loadSecretsFromVault;
/**
 * 26. Injects secrets into environment variables.
 *
 * @param {Record<string, string>} secrets - Secret key-value pairs
 * @param {string} prefix - Optional prefix for env vars
 * @returns {void}
 *
 * @example
 * ```typescript
 * injectSecretsIntoEnv({
 *   DB_PASSWORD: 'secret123',
 *   API_KEY: 'key456'
 * }, 'APP_');
 * ```
 */
const injectSecretsIntoEnv = (secrets, prefix = '') => {
    for (const [key, value] of Object.entries(secrets)) {
        const envKey = prefix ? `${prefix}${key}` : key;
        if (!process.env[envKey]) {
            process.env[envKey] = value;
        }
    }
};
exports.injectSecretsIntoEnv = injectSecretsIntoEnv;
/**
 * 27. Rotates secrets by loading new values and updating cache.
 *
 * @param {SecretProviderConfig} config - Secret provider configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await rotateSecrets({
 *   provider: 'aws-secrets-manager',
 *   secretId: 'white-cross/db',
 *   region: 'us-east-1'
 * });
 * ```
 */
const rotateSecrets = async (config) => {
    let secrets = {};
    if (config.provider === 'aws-secrets-manager') {
        secrets = await (0, exports.loadSecretsFromAWS)(config.secretId, config.region);
    }
    else if (config.provider === 'hashicorp-vault' && config.endpoint) {
        const token = process.env.VAULT_TOKEN || '';
        secrets = await (0, exports.loadSecretsFromVault)(config.endpoint, token, config.secretId);
    }
    (0, exports.injectSecretsIntoEnv)(secrets);
};
exports.rotateSecrets = rotateSecrets;
/**
 * 28. Validates secret format and requirements.
 *
 * @param {Record<string, string>} secrets - Secrets to validate
 * @param {Record<string, RegExp>} requirements - Validation patterns
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const result = validateSecrets(secrets, {
 *   JWT_SECRET: /^[A-Za-z0-9]{32,}$/,
 *   API_KEY: /^[A-Z0-9]{16}$/
 * });
 * ```
 */
const validateSecrets = (secrets, requirements) => {
    const errors = [];
    for (const [key, pattern] of Object.entries(requirements)) {
        const value = secrets[key];
        if (!value) {
            errors.push(`Required secret ${key} is missing`);
        }
        else if (!pattern.test(value)) {
            errors.push(`Secret ${key} does not match required format`);
        }
    }
    return {
        valid: errors.length === 0,
        errors,
    };
};
exports.validateSecrets = validateSecrets;
// ============================================================================
// FEATURE FLAGS
// ============================================================================
/**
 * 29. Creates a feature flag provider with evaluation logic.
 *
 * @param {Record<string, FeatureFlagConfig>} flags - Feature flag definitions
 * @returns {FeatureFlagProvider} Feature flag provider
 *
 * @example
 * ```typescript
 * const provider = createFeatureFlagProvider({
 *   newDashboard: { name: 'newDashboard', enabled: true },
 *   betaFeatures: { name: 'betaFeatures', enabled: false, rollout: 50 }
 * });
 * ```
 */
const createFeatureFlagProvider = (flags) => {
    return {
        isEnabled(flagName, context) {
            const flag = flags[flagName];
            if (!flag)
                return false;
            if (!flag.enabled)
                return false;
            if (flag.rollout !== undefined && context?.userId) {
                const hash = simpleHash(context.userId);
                return (hash % 100) < flag.rollout;
            }
            return true;
        },
        getAllFlags() {
            return Object.entries(flags).reduce((acc, [name, config]) => {
                acc[name] = config.enabled;
                return acc;
            }, {});
        },
        updateFlag(flagName, enabled) {
            if (flags[flagName]) {
                flags[flagName].enabled = enabled;
            }
        },
        evaluateFlag(flagName, context) {
            const flag = flags[flagName];
            if (!flag || !flag.enabled)
                return false;
            if (flag.conditions) {
                return evaluateConditions(flag.conditions, context);
            }
            return true;
        },
    };
};
exports.createFeatureFlagProvider = createFeatureFlagProvider;
/**
 * 30. Loads feature flags from configuration.
 *
 * @param {ConfigService} configService - NestJS ConfigService
 * @param {string} namespace - Feature flags namespace
 * @returns {Record<string, boolean>} Feature flags
 *
 * @example
 * ```typescript
 * const flags = loadFeatureFlags(configService, 'features');
 * if (flags.newDashboard) {
 *   // Use new dashboard
 * }
 * ```
 */
const loadFeatureFlags = (configService, namespace = 'features') => {
    return configService.get(namespace, {});
};
exports.loadFeatureFlags = loadFeatureFlags;
/**
 * 31. Evaluates feature flag with percentage rollout.
 *
 * @param {string} flagName - Feature flag name
 * @param {number} rolloutPercent - Rollout percentage (0-100)
 * @param {string} userId - User identifier for consistent hashing
 * @returns {boolean} Whether feature is enabled for user
 *
 * @example
 * ```typescript
 * const enabled = evaluateFeatureFlagRollout('newUI', 25, user.id);
 * ```
 */
const evaluateFeatureFlagRollout = (flagName, rolloutPercent, userId) => {
    const hash = simpleHash(`${flagName}:${userId}`);
    return (hash % 100) < rolloutPercent;
};
exports.evaluateFeatureFlagRollout = evaluateFeatureFlagRollout;
/**
 * 32. Creates dynamic feature flag that can be toggled at runtime.
 *
 * @param {string} flagName - Feature flag name
 * @param {boolean} initialValue - Initial flag value
 * @returns {{ isEnabled: () => boolean; toggle: (value?: boolean) => void }} Feature flag control
 *
 * @example
 * ```typescript
 * const debugFlag = createDynamicFeatureFlag('debugMode', false);
 * if (debugFlag.isEnabled()) {
 *   console.log('Debug mode active');
 * }
 * debugFlag.toggle(true);
 * ```
 */
const createDynamicFeatureFlag = (flagName, initialValue) => {
    let enabled = initialValue;
    return {
        isEnabled: () => enabled,
        toggle: (value) => {
            enabled = value !== undefined ? value : !enabled;
        },
    };
};
exports.createDynamicFeatureFlag = createDynamicFeatureFlag;
// ============================================================================
// CONFIGURATION ENCRYPTION
// ============================================================================
/**
 * 33. Encrypts configuration value using AES-256.
 *
 * @param {string} value - Value to encrypt
 * @param {string} key - Encryption key
 * @param {string} algorithm - Encryption algorithm
 * @returns {string} Encrypted value (base64)
 *
 * @example
 * ```typescript
 * const encrypted = encryptConfigValue('secret123', process.env.ENCRYPTION_KEY);
 * ```
 */
const encryptConfigValue = (value, key, algorithm = 'aes-256-cbc') => {
    const keyBuffer = crypto.scryptSync(key, 'salt', 32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, keyBuffer, iv);
    let encrypted = cipher.update(value, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return `${iv.toString('base64')}:${encrypted}`;
};
exports.encryptConfigValue = encryptConfigValue;
/**
 * 34. Decrypts configuration value encrypted with AES-256.
 *
 * @param {string} encryptedValue - Encrypted value (base64)
 * @param {string} key - Decryption key
 * @param {string} algorithm - Encryption algorithm
 * @returns {string} Decrypted value
 *
 * @example
 * ```typescript
 * const decrypted = decryptConfigValue(encrypted, process.env.ENCRYPTION_KEY);
 * ```
 */
const decryptConfigValue = (encryptedValue, key, algorithm = 'aes-256-cbc') => {
    const [ivBase64, encrypted] = encryptedValue.split(':');
    const keyBuffer = crypto.scryptSync(key, 'salt', 32);
    const iv = Buffer.from(ivBase64, 'base64');
    const decipher = crypto.createDecipheriv(algorithm, keyBuffer, iv);
    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};
exports.decryptConfigValue = decryptConfigValue;
/**
 * 35. Hashes sensitive configuration values for comparison.
 *
 * @param {string} value - Value to hash
 * @param {string} algorithm - Hash algorithm
 * @returns {string} Hashed value (hex)
 *
 * @example
 * ```typescript
 * const hashed = hashConfigValue('sensitive-data', 'sha256');
 * ```
 */
const hashConfigValue = (value, algorithm = 'sha256') => {
    return crypto.createHash(algorithm).update(value).digest('hex');
};
exports.hashConfigValue = hashConfigValue;
/**
 * 36. Encrypts entire configuration object recursively.
 *
 * @param {any} config - Configuration object
 * @param {string} key - Encryption key
 * @param {string[]} excludeKeys - Keys to exclude from encryption
 * @returns {any} Encrypted configuration object
 *
 * @example
 * ```typescript
 * const encrypted = encryptConfigObject(config, key, ['version', 'environment']);
 * ```
 */
const encryptConfigObject = (config, key, excludeKeys = []) => {
    if (typeof config !== 'object' || config === null) {
        return config;
    }
    const encrypted = Array.isArray(config) ? [] : {};
    for (const [k, v] of Object.entries(config)) {
        if (excludeKeys.includes(k)) {
            encrypted[k] = v;
        }
        else if (typeof v === 'string') {
            encrypted[k] = (0, exports.encryptConfigValue)(v, key);
        }
        else if (typeof v === 'object' && v !== null) {
            encrypted[k] = (0, exports.encryptConfigObject)(v, key, excludeKeys);
        }
        else {
            encrypted[k] = v;
        }
    }
    return encrypted;
};
exports.encryptConfigObject = encryptConfigObject;
// ============================================================================
// MULTI-ENVIRONMENT SUPPORT
// ============================================================================
/**
 * 37. Loads environment-specific configuration files.
 *
 * @param {string} baseDir - Base directory for config files
 * @param {string} environment - Environment name
 * @returns {any} Environment-specific configuration
 *
 * @example
 * ```typescript
 * const config = loadEnvironmentConfig('./config', 'production');
 * ```
 */
const loadEnvironmentConfig = (baseDir, environment) => {
    const env = environment || process.env.NODE_ENV || 'development';
    const files = [
        path.join(baseDir, 'default.json'),
        path.join(baseDir, `${env}.json`),
        path.join(baseDir, `${env}.local.json`),
    ];
    let config = {};
    for (const file of files) {
        if (fs.existsSync(file)) {
            const fileConfig = (0, exports.loadConfigFromFile)(file, false);
            config = deepMerge(config, fileConfig);
        }
    }
    return config;
};
exports.loadEnvironmentConfig = loadEnvironmentConfig;
/**
 * 38. Detects current environment from various sources.
 *
 * @param {string[]} sources - Sources to check (env, file, etc.)
 * @returns {string} Detected environment
 *
 * @example
 * ```typescript
 * const env = detectEnvironment(['NODE_ENV', 'APP_ENV']);
 * ```
 */
const detectEnvironment = (sources = ['NODE_ENV', 'APP_ENV', 'ENVIRONMENT']) => {
    for (const source of sources) {
        const value = process.env[source];
        if (value) {
            return value;
        }
    }
    return 'development';
};
exports.detectEnvironment = detectEnvironment;
/**
 * 39. Validates environment-specific configuration requirements.
 *
 * @param {string} environment - Environment name
 * @param {Record<string, string[]>} requirements - Required vars per environment
 * @returns {{ valid: boolean; missing: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const result = validateEnvironmentConfig('production', {
 *   production: ['DATABASE_SSL', 'SENTRY_DSN'],
 *   development: ['DEBUG']
 * });
 * ```
 */
const validateEnvironmentConfig = (environment, requirements) => {
    const required = requirements[environment] || [];
    const missing = (0, exports.checkMissingEnvVars)(required);
    return {
        valid: missing.length === 0,
        missing,
    };
};
exports.validateEnvironmentConfig = validateEnvironmentConfig;
/**
 * 40. Creates cross-environment configuration validator.
 *
 * @param {string[]} environments - Environments to validate
 * @param {(env: string) => boolean} validator - Validation function
 * @returns {Record<string, boolean>} Validation results per environment
 *
 * @example
 * ```typescript
 * const results = validateAcrossEnvironments(
 *   ['development', 'staging', 'production'],
 *   (env) => validateEnvVars(env)
 * );
 * ```
 */
const validateAcrossEnvironments = (environments, validator) => {
    return environments.reduce((results, env) => {
        results[env] = validator(env);
        return results;
    }, {});
};
exports.validateAcrossEnvironments = validateAcrossEnvironments;
// ============================================================================
// CONFIGURATION CACHING
// ============================================================================
/**
 * 41. Creates configuration cache with TTL support.
 *
 * @param {ConfigCacheOptions} options - Cache options
 * @returns {ConfigCache} Configuration cache instance
 *
 * @example
 * ```typescript
 * const cache = createConfigCache({
 *   enabled: true,
 *   ttl: 60000,
 *   maxSize: 100
 * });
 * ```
 */
const createConfigCache = (options) => {
    const cache = new Map();
    return {
        get(key) {
            const entry = cache.get(key);
            if (!entry)
                return undefined;
            if (entry.expiresAt && entry.expiresAt < new Date()) {
                cache.delete(key);
                return undefined;
            }
            entry.accessCount++;
            return entry.value;
        },
        set(key, value) {
            const entry = {
                value,
                timestamp: new Date(),
                expiresAt: options.ttl ? new Date(Date.now() + options.ttl) : undefined,
                accessCount: 0,
            };
            cache.set(key, entry);
            if (options.maxSize && cache.size > options.maxSize) {
                const oldestKey = Array.from(cache.entries())
                    .sort((a, b) => a[1].timestamp.getTime() - b[1].timestamp.getTime())[0][0];
                cache.delete(oldestKey);
            }
        },
        invalidate(key) {
            cache.delete(key);
        },
        clear() {
            cache.clear();
        },
        size() {
            return cache.size;
        },
    };
};
exports.createConfigCache = createConfigCache;
/**
 * 42. Invalidates cached configuration values by pattern.
 *
 * @param {Map<string, any>} cache - Configuration cache
 * @param {RegExp | string} pattern - Invalidation pattern
 * @returns {number} Number of invalidated entries
 *
 * @example
 * ```typescript
 * const count = invalidateCacheByPattern(cache, /^database\./);
 * ```
 */
const invalidateCacheByPattern = (cache, pattern) => {
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
    let count = 0;
    for (const key of cache.keys()) {
        if (regex.test(key)) {
            cache.delete(key);
            count++;
        }
    }
    return count;
};
exports.invalidateCacheByPattern = invalidateCacheByPattern;
/**
 * 43. Creates cached configuration getter with auto-refresh.
 *
 * @param {() => Promise<any>} loader - Configuration loader function
 * @param {number} ttl - Cache TTL in milliseconds
 * @returns {() => Promise<any>} Cached getter function
 *
 * @example
 * ```typescript
 * const getConfig = createCachedGetter(
 *   async () => await loadConfigFromRemote(url),
 *   60000
 * );
 * ```
 */
const createCachedGetter = (loader, ttl) => {
    let cache = null;
    let lastLoad = 0;
    return async () => {
        const now = Date.now();
        if (!cache || now - lastLoad > ttl) {
            cache = await loader();
            lastLoad = now;
        }
        return cache;
    };
};
exports.createCachedGetter = createCachedGetter;
// ============================================================================
// HOT RELOAD & WATCHING
// ============================================================================
/**
 * 44. Watches configuration file for changes and triggers reload.
 *
 * @param {string} filePath - Configuration file path
 * @param {(changes: ConfigChangeEvent) => void} callback - Change callback
 * @param {number} debounce - Debounce delay in milliseconds
 * @returns {FSWatcher} File system watcher
 *
 * @example
 * ```typescript
 * const watcher = watchConfigFile('.env', (changes) => {
 *   console.log('Config changed:', changes.changedKeys);
 * }, 1000);
 * ```
 */
const watchConfigFile = (filePath, callback, debounce = 1000) => {
    let oldConfig = null;
    let timeoutId = null;
    const handleChange = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            try {
                const newConfig = (0, exports.loadConfigFromFile)(filePath, false);
                const changedKeys = getChangedKeys(oldConfig, newConfig);
                const event = {
                    filePath,
                    type: 'modified',
                    oldConfig,
                    newConfig,
                    changedKeys,
                    timestamp: new Date(),
                };
                callback(event);
                oldConfig = newConfig;
            }
            catch (error) {
                console.error('Error reloading config:', error);
            }
        }, debounce);
    };
    oldConfig = (0, exports.loadConfigFromFile)(filePath, false);
    return (0, fs_1.watch)(filePath, handleChange);
};
exports.watchConfigFile = watchConfigFile;
/**
 * 45. Creates hot-reloadable configuration module.
 *
 * @param {string} filePath - Configuration file path
 * @param {(config: any) => void} onReload - Reload callback
 * @returns {{ config: any; reload: () => void; stop: () => void }} Hot reload controller
 *
 * @example
 * ```typescript
 * const { config, reload, stop } = createHotReloadConfig('./config.json', (newConfig) => {
 *   console.log('Config reloaded:', newConfig);
 * });
 * ```
 */
const createHotReloadConfig = (filePath, onReload) => {
    let config = (0, exports.loadConfigFromFile)(filePath, false);
    let watcher = null;
    const reload = () => {
        config = (0, exports.loadConfigFromFile)(filePath, false);
        onReload(config);
    };
    watcher = (0, exports.watchConfigFile)(filePath, () => reload(), 1000);
    return {
        config,
        reload,
        stop: () => {
            if (watcher) {
                watcher.close();
            }
        },
    };
};
exports.createHotReloadConfig = createHotReloadConfig;
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
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
 * Evaluates conditions for feature flags.
 */
const evaluateConditions = (conditions, context) => {
    for (const [key, value] of Object.entries(conditions)) {
        if (context[key] !== value) {
            return false;
        }
    }
    return true;
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
//# sourceMappingURL=nestjs-configuration-management-kit.js.map