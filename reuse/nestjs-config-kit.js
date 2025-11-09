"use strict";
/**
 * LOC: CFG7F8E9D2
 * File: /reuse/nestjs-config-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Configuration modules
 *   - Application bootstrap
 *   - Environment-specific configs
 *   - Feature flag services
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
exports.createMockConfigService = exports.validateURLs = exports.sanitizeConfig = exports.exportEnvTemplate = exports.generateConfigDocs = exports.createCachedGetter = exports.ConfigCache = exports.loadFromAzureKeyVault = exports.loadFromAWSSecrets = exports.maskConfigValue = exports.decryptConfigValue = exports.encryptConfigValue = exports.createFeatureFlagManager = exports.isFeatureEnabled = exports.createFeatureFlag = exports.deepMerge = exports.mergeConfigs = exports.getEnvSpecificValue = exports.isTest = exports.isDevelopment = exports.isProduction = exports.detectEnvironment = exports.validateConstraints = exports.validateRequiredKeys = exports.createConfigTypeGuard = exports.validateWithJoi = exports.extractNamespace = exports.mergeNamespaces = exports.setNamespacedValue = exports.getNamespacedValue = exports.createNamespace = exports.createAsyncConfigFactory = exports.createTestConfigOptions = exports.createConfigModuleOptions = exports.setEnvVars = exports.expandEnvVars = exports.parseEnvArray = exports.parseEnvJSON = exports.parseEnvBool = exports.parseEnvFloat = exports.parseEnvInt = exports.getRequiredEnv = exports.getEnv = void 0;
/**
 * File: /reuse/nestjs-config-kit.ts
 * Locator: WC-UTL-CFG-001
 * Purpose: Comprehensive NestJS Configuration Management Toolkit - Complete configuration utilities
 *
 * Upstream: Independent utility module for NestJS configuration operations
 * Downstream: ../backend/*, Config modules, Bootstrap files, Environment configs
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/config, joi, class-validator
 * Exports: 50 utility functions for config management, validation, secrets, feature flags
 *
 * LLM Context: Enterprise-grade configuration utilities for White Cross healthcare platform.
 * Provides environment variable management, Joi/class-validator schema validation, type-safe
 * config access, namespace management, dynamic loading, AWS/Azure secrets integration,
 * feature flags, multi-environment support, config caching, hot-reload, and HIPAA-compliant
 * configuration patterns for healthcare applications.
 */
const crypto = __importStar(require("crypto"));
// ============================================================================
// ENVIRONMENT VARIABLE UTILITIES
// ============================================================================
/**
 * Gets environment variable with type coercion and default value.
 *
 * @param {string} key - Environment variable name
 * @param {T} defaultValue - Default value if not found
 * @returns {T} Environment variable value
 *
 * @example
 * ```typescript
 * const port = getEnv('PORT', 3000);
 * const host = getEnv('HOST', 'localhost');
 * // Returns typed values: number and string respectively
 * ```
 */
const getEnv = (key, defaultValue) => {
    const value = process.env[key];
    if (value === undefined || value === null) {
        return defaultValue;
    }
    const defaultType = typeof defaultValue;
    if (defaultType === 'number') {
        const parsed = Number(value);
        return (isNaN(parsed) ? defaultValue : parsed);
    }
    if (defaultType === 'boolean') {
        return (value.toLowerCase() === 'true' || value === '1');
    }
    return value;
};
exports.getEnv = getEnv;
/**
 * Gets required environment variable or throws error.
 *
 * @param {string} key - Environment variable name
 * @param {string} [message] - Custom error message
 * @returns {string} Environment variable value
 * @throws {Error} If variable is not set
 *
 * @example
 * ```typescript
 * const jwtSecret = getRequiredEnv('JWT_SECRET');
 * const dbUrl = getRequiredEnv('DATABASE_URL', 'Database URL must be configured');
 * ```
 */
const getRequiredEnv = (key, message) => {
    const value = process.env[key];
    if (!value) {
        throw new Error(message || `Required environment variable "${key}" is not set`);
    }
    return value;
};
exports.getRequiredEnv = getRequiredEnv;
/**
 * Parses environment variable as integer with validation.
 *
 * @param {string} key - Environment variable name
 * @param {number} defaultValue - Default value
 * @param {object} [constraints] - Min/max constraints
 * @returns {number} Parsed integer value
 *
 * @example
 * ```typescript
 * const port = parseEnvInt('PORT', 3000, { min: 1024, max: 65535 });
 * const poolSize = parseEnvInt('DB_POOL_SIZE', 10, { min: 1, max: 100 });
 * ```
 */
const parseEnvInt = (key, defaultValue, constraints) => {
    const value = process.env[key];
    if (!value)
        return defaultValue;
    const parsed = parseInt(value, 10);
    if (isNaN(parsed))
        return defaultValue;
    if (constraints?.min !== undefined && parsed < constraints.min) {
        return constraints.min;
    }
    if (constraints?.max !== undefined && parsed > constraints.max) {
        return constraints.max;
    }
    return parsed;
};
exports.parseEnvInt = parseEnvInt;
/**
 * Parses environment variable as float with validation.
 *
 * @param {string} key - Environment variable name
 * @param {number} defaultValue - Default value
 * @param {object} [constraints] - Min/max constraints
 * @returns {number} Parsed float value
 *
 * @example
 * ```typescript
 * const timeout = parseEnvFloat('REQUEST_TIMEOUT', 30.5, { min: 0.1, max: 300 });
 * ```
 */
const parseEnvFloat = (key, defaultValue, constraints) => {
    const value = process.env[key];
    if (!value)
        return defaultValue;
    const parsed = parseFloat(value);
    if (isNaN(parsed))
        return defaultValue;
    if (constraints?.min !== undefined && parsed < constraints.min) {
        return constraints.min;
    }
    if (constraints?.max !== undefined && parsed > constraints.max) {
        return constraints.max;
    }
    return parsed;
};
exports.parseEnvFloat = parseEnvFloat;
/**
 * Parses environment variable as boolean.
 *
 * @param {string} key - Environment variable name
 * @param {boolean} defaultValue - Default value
 * @returns {boolean} Parsed boolean value
 *
 * @example
 * ```typescript
 * const debug = parseEnvBool('DEBUG', false);
 * const ssl = parseEnvBool('DATABASE_SSL', true);
 * // Accepts: true/false, 1/0, yes/no, on/off
 * ```
 */
const parseEnvBool = (key, defaultValue) => {
    const value = process.env[key];
    if (!value)
        return defaultValue;
    const normalized = value.toLowerCase().trim();
    const truthyValues = ['true', '1', 'yes', 'on', 'enabled'];
    const falsyValues = ['false', '0', 'no', 'off', 'disabled'];
    if (truthyValues.includes(normalized))
        return true;
    if (falsyValues.includes(normalized))
        return false;
    return defaultValue;
};
exports.parseEnvBool = parseEnvBool;
/**
 * Parses environment variable as JSON object.
 *
 * @param {string} key - Environment variable name
 * @param {T} defaultValue - Default value
 * @returns {T} Parsed JSON object
 *
 * @example
 * ```typescript
 * const corsOrigins = parseEnvJSON<string[]>('CORS_ORIGINS', ['http://localhost:3000']);
 * const config = parseEnvJSON<Config>('APP_CONFIG', { timeout: 30 });
 * ```
 */
const parseEnvJSON = (key, defaultValue) => {
    const value = process.env[key];
    if (!value)
        return defaultValue;
    try {
        return JSON.parse(value);
    }
    catch {
        return defaultValue;
    }
};
exports.parseEnvJSON = parseEnvJSON;
/**
 * Parses environment variable as array (comma-separated).
 *
 * @param {string} key - Environment variable name
 * @param {string[]} defaultValue - Default array
 * @param {string} [separator] - Separator character (default: ',')
 * @returns {string[]} Parsed array
 *
 * @example
 * ```typescript
 * const origins = parseEnvArray('ALLOWED_ORIGINS', ['http://localhost:3000']);
 * const ips = parseEnvArray('TRUSTED_IPS', [], '|');
 * ```
 */
const parseEnvArray = (key, defaultValue = [], separator = ',') => {
    const value = process.env[key];
    if (!value)
        return defaultValue;
    return value
        .split(separator)
        .map(item => item.trim())
        .filter(item => item.length > 0);
};
exports.parseEnvArray = parseEnvArray;
/**
 * Expands environment variable references like ${VAR_NAME}.
 *
 * @param {string} value - Value with variable references
 * @param {Record<string, string>} [env] - Environment object (default: process.env)
 * @returns {string} Expanded value
 *
 * @example
 * ```typescript
 * const expanded = expandEnvVars('postgres://${DB_HOST}:${DB_PORT}/mydb');
 * // Result: 'postgres://localhost:5432/mydb'
 * ```
 */
const expandEnvVars = (value, env = process.env) => {
    return value.replace(/\$\{([^}]+)\}/g, (_, varName) => {
        const varValue = env[varName];
        if (varValue === undefined) {
            console.warn(`Environment variable ${varName} is not defined`);
            return '';
        }
        return varValue;
    });
};
exports.expandEnvVars = expandEnvVars;
/**
 * Sets multiple environment variables at once.
 *
 * @param {Record<string, string>} vars - Variables to set
 * @param {boolean} [override] - Override existing variables (default: false)
 *
 * @example
 * ```typescript
 * setEnvVars({
 *   NODE_ENV: 'development',
 *   PORT: '3001',
 *   DEBUG: 'true'
 * }, true);
 * ```
 */
const setEnvVars = (vars, override = false) => {
    Object.entries(vars).forEach(([key, value]) => {
        if (override || !process.env[key]) {
            process.env[key] = value;
        }
    });
};
exports.setEnvVars = setEnvVars;
// ============================================================================
// CONFIGURATION MODULE BUILDERS
// ============================================================================
/**
 * Creates ConfigModule options with sensible defaults.
 *
 * @param {Partial<ConfigModuleInit>} options - Custom options
 * @returns {ConfigModuleInit} Complete config module options
 *
 * @example
 * ```typescript
 * const config = createConfigModuleOptions({
 *   envFilePath: ['.env.local', '.env'],
 *   cache: true,
 *   validationSchema: myJoiSchema
 * });
 * ```
 */
const createConfigModuleOptions = (options = {}) => {
    const env = process.env.NODE_ENV || 'development';
    return {
        isGlobal: true,
        cache: true,
        expandVariables: true,
        envFilePath: [
            `.env.${env}.local`,
            `.env.${env}`,
            '.env.local',
            '.env',
        ],
        ...options,
    };
};
exports.createConfigModuleOptions = createConfigModuleOptions;
/**
 * Creates ConfigModule options for testing environment.
 *
 * @param {Record<string, string>} [testVars] - Test environment variables
 * @returns {ConfigModuleInit} Test config options
 *
 * @example
 * ```typescript
 * const testConfig = createTestConfigOptions({
 *   DATABASE_URL: 'postgres://localhost:5432/test_db',
 *   JWT_SECRET: 'test-secret'
 * });
 * ```
 */
const createTestConfigOptions = (testVars) => {
    if (testVars) {
        (0, exports.setEnvVars)(testVars, true);
    }
    return {
        isGlobal: true,
        cache: false,
        ignoreEnvFile: true,
        expandVariables: false,
    };
};
exports.createTestConfigOptions = createTestConfigOptions;
/**
 * Creates async ConfigModule factory for dynamic configuration.
 *
 * @param {() => Promise<Record<string, any>>} loader - Async config loader
 * @returns {() => Promise<Record<string, any>>} Async factory function
 *
 * @example
 * ```typescript
 * const asyncFactory = createAsyncConfigFactory(async () => {
 *   const secrets = await loadSecretsFromAWS();
 *   return { database: { password: secrets.DB_PASSWORD } };
 * });
 * ```
 */
const createAsyncConfigFactory = (loader) => {
    let cachedConfig = null;
    return async () => {
        if (!cachedConfig) {
            cachedConfig = await loader();
        }
        return cachedConfig;
    };
};
exports.createAsyncConfigFactory = createAsyncConfigFactory;
// ============================================================================
// CONFIGURATION NAMESPACES
// ============================================================================
/**
 * Creates namespaced configuration object.
 *
 * @param {string} namespace - Namespace name
 * @param {Record<string, any>} config - Configuration object
 * @returns {Record<string, any>} Namespaced configuration
 *
 * @example
 * ```typescript
 * const dbConfig = createNamespace('database', {
 *   host: process.env.DB_HOST,
 *   port: parseInt(process.env.DB_PORT)
 * });
 * // Result: { database: { host: '...', port: 5432 } }
 * ```
 */
const createNamespace = (namespace, config) => {
    return { [namespace]: config };
};
exports.createNamespace = createNamespace;
/**
 * Gets value from namespaced configuration using dot notation.
 *
 * @param {Record<string, any>} config - Configuration object
 * @param {string} path - Dot-notation path (e.g., 'database.host')
 * @param {T} [defaultValue] - Default value if not found
 * @returns {T} Configuration value
 *
 * @example
 * ```typescript
 * const host = getNamespacedValue(config, 'database.host', 'localhost');
 * const port = getNamespacedValue<number>(config, 'database.port', 5432);
 * ```
 */
const getNamespacedValue = (config, path, defaultValue) => {
    const keys = path.split('.');
    let value = config;
    for (const key of keys) {
        if (value === null || value === undefined || typeof value !== 'object') {
            return defaultValue;
        }
        value = value[key];
    }
    return value !== undefined ? value : defaultValue;
};
exports.getNamespacedValue = getNamespacedValue;
/**
 * Sets value in namespaced configuration using dot notation.
 *
 * @param {Record<string, any>} config - Configuration object
 * @param {string} path - Dot-notation path
 * @param {any} value - Value to set
 *
 * @example
 * ```typescript
 * setNamespacedValue(config, 'database.host', 'localhost');
 * setNamespacedValue(config, 'cache.redis.port', 6379);
 * ```
 */
const setNamespacedValue = (config, path, value) => {
    const keys = path.split('.');
    const lastKey = keys.pop();
    let current = config;
    for (const key of keys) {
        if (!current[key] || typeof current[key] !== 'object') {
            current[key] = {};
        }
        current = current[key];
    }
    current[lastKey] = value;
};
exports.setNamespacedValue = setNamespacedValue;
/**
 * Merges multiple namespaced configurations.
 *
 * @param {Record<string, any>[]} configs - Array of configs to merge
 * @param {MergeStrategyOptions} [options] - Merge options
 * @returns {Record<string, any>} Merged configuration
 *
 * @example
 * ```typescript
 * const merged = mergeNamespaces([
 *   { database: { host: 'localhost' } },
 *   { database: { port: 5432 } },
 *   { cache: { ttl: 3600 } }
 * ]);
 * ```
 */
const mergeNamespaces = (configs, options) => {
    return (0, exports.mergeConfigs)(configs, options);
};
exports.mergeNamespaces = mergeNamespaces;
/**
 * Extracts specific namespace from configuration.
 *
 * @param {Record<string, any>} config - Full configuration
 * @param {string} namespace - Namespace to extract
 * @returns {Record<string, any> | undefined} Namespace configuration
 *
 * @example
 * ```typescript
 * const dbConfig = extractNamespace(config, 'database');
 * // Result: { host: 'localhost', port: 5432, ... }
 * ```
 */
const extractNamespace = (config, namespace) => {
    return config[namespace];
};
exports.extractNamespace = extractNamespace;
// ============================================================================
// CONFIGURATION VALIDATION
// ============================================================================
/**
 * Validates configuration against Joi schema.
 *
 * @param {Record<string, any>} config - Configuration to validate
 * @param {any} schema - Joi schema
 * @returns {ConfigValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const schema = Joi.object({
 *   PORT: Joi.number().port().required(),
 *   NODE_ENV: Joi.string().valid('development', 'production')
 * });
 * const result = validateWithJoi(process.env, schema);
 * ```
 */
const validateWithJoi = (config, schema) => {
    const { error, value, warning } = schema.validate(config, {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: false,
    });
    if (error) {
        return {
            valid: false,
            errors: error.details.map((detail) => detail.message),
            warnings: warning ? warning.details.map((w) => w.message) : [],
        };
    }
    return {
        valid: true,
        config: value,
        warnings: warning ? warning.details.map((w) => w.message) : [],
    };
};
exports.validateWithJoi = validateWithJoi;
/**
 * Creates type guard for configuration validation.
 *
 * @param {Record<string, string>} typeMap - Map of keys to expected types
 * @returns {(config: any) => boolean} Type guard function
 *
 * @example
 * ```typescript
 * const isValidConfig = createConfigTypeGuard({
 *   port: 'number',
 *   host: 'string',
 *   debug: 'boolean'
 * });
 *
 * if (isValidConfig(config)) {
 *   console.log(config.port); // Type-safe access
 * }
 * ```
 */
const createConfigTypeGuard = (typeMap) => {
    return (config) => {
        if (!config || typeof config !== 'object')
            return false;
        return Object.entries(typeMap).every(([key, expectedType]) => {
            const value = config[key];
            if (value === undefined || value === null)
                return false;
            return typeof value === expectedType;
        });
    };
};
exports.createConfigTypeGuard = createConfigTypeGuard;
/**
 * Validates required configuration keys are present.
 *
 * @param {Record<string, any>} config - Configuration object
 * @param {string[]} requiredKeys - Required keys
 * @returns {ConfigValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateRequiredKeys(config, [
 *   'DATABASE_URL',
 *   'JWT_SECRET',
 *   'REDIS_HOST'
 * ]);
 * ```
 */
const validateRequiredKeys = (config, requiredKeys) => {
    const missing = requiredKeys.filter(key => {
        const value = config[key];
        return value === undefined || value === null || value === '';
    });
    if (missing.length > 0) {
        return {
            valid: false,
            errors: missing.map(key => `Required configuration key "${key}" is missing`),
        };
    }
    return { valid: true, config };
};
exports.validateRequiredKeys = validateRequiredKeys;
/**
 * Validates configuration value ranges and constraints.
 *
 * @param {Record<string, any>} config - Configuration object
 * @param {Record<string, any>} constraints - Validation constraints
 * @returns {ConfigValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateConstraints(config, {
 *   PORT: { min: 1024, max: 65535 },
 *   POOL_SIZE: { min: 1, max: 100 }
 * });
 * ```
 */
const validateConstraints = (config, constraints) => {
    const errors = [];
    Object.entries(constraints).forEach(([key, constraint]) => {
        const value = config[key];
        if (value === undefined || value === null)
            return;
        if (constraint.min !== undefined && value < constraint.min) {
            errors.push(`${key} must be at least ${constraint.min}`);
        }
        if (constraint.max !== undefined && value > constraint.max) {
            errors.push(`${key} must be at most ${constraint.max}`);
        }
        if (constraint.enum && !constraint.enum.includes(value)) {
            errors.push(`${key} must be one of: ${constraint.enum.join(', ')}`);
        }
        if (constraint.pattern && !constraint.pattern.test(value)) {
            errors.push(`${key} does not match required pattern`);
        }
    });
    return {
        valid: errors.length === 0,
        errors: errors.length > 0 ? errors : undefined,
        config,
    };
};
exports.validateConstraints = validateConstraints;
// ============================================================================
// ENVIRONMENT DETECTION
// ============================================================================
/**
 * Detects current environment and returns detailed info.
 *
 * @returns {EnvironmentInfo} Environment information
 *
 * @example
 * ```typescript
 * const env = detectEnvironment();
 * if (env.isProduction) {
 *   // Production-specific logic
 * }
 * ```
 */
const detectEnvironment = () => {
    const nodeEnv = (process.env.NODE_ENV || 'development').toLowerCase();
    return {
        name: nodeEnv,
        nodeEnv,
        isProduction: nodeEnv === 'production' || nodeEnv === 'prod',
        isDevelopment: nodeEnv === 'development' || nodeEnv === 'dev',
        isTest: nodeEnv === 'test' || nodeEnv === 'testing',
        isStaging: nodeEnv === 'staging' || nodeEnv === 'stage',
    };
};
exports.detectEnvironment = detectEnvironment;
/**
 * Checks if running in production environment.
 *
 * @returns {boolean} True if production
 *
 * @example
 * ```typescript
 * if (isProduction()) {
 *   console.log('Running in production mode');
 * }
 * ```
 */
const isProduction = () => {
    return (0, exports.detectEnvironment)().isProduction;
};
exports.isProduction = isProduction;
/**
 * Checks if running in development environment.
 *
 * @returns {boolean} True if development
 *
 * @example
 * ```typescript
 * if (isDevelopment()) {
 *   console.log('Debug mode enabled');
 * }
 * ```
 */
const isDevelopment = () => {
    return (0, exports.detectEnvironment)().isDevelopment;
};
exports.isDevelopment = isDevelopment;
/**
 * Checks if running in test environment.
 *
 * @returns {boolean} True if test
 *
 * @example
 * ```typescript
 * if (isTest()) {
 *   console.log('Using test database');
 * }
 * ```
 */
const isTest = () => {
    return (0, exports.detectEnvironment)().isTest;
};
exports.isTest = isTest;
/**
 * Gets environment-specific configuration value.
 *
 * @param {Record<string, T>} envMap - Map of environment to value
 * @param {T} [defaultValue] - Default value
 * @returns {T} Environment-specific value
 *
 * @example
 * ```typescript
 * const logLevel = getEnvSpecificValue({
 *   production: 'error',
 *   development: 'debug',
 *   test: 'silent'
 * }, 'info');
 * ```
 */
const getEnvSpecificValue = (envMap, defaultValue) => {
    const env = (0, exports.detectEnvironment)();
    return envMap[env.name] || defaultValue;
};
exports.getEnvSpecificValue = getEnvSpecificValue;
// ============================================================================
// CONFIGURATION MERGING
// ============================================================================
/**
 * Deep merges multiple configuration objects.
 *
 * @param {Record<string, any>[]} configs - Configs to merge (priority: first to last)
 * @param {MergeStrategyOptions} [options] - Merge options
 * @returns {Record<string, any>} Merged configuration
 *
 * @example
 * ```typescript
 * const merged = mergeConfigs([
 *   baseConfig,
 *   envConfig,
 *   localConfig
 * ], { deep: true, arrayMerge: 'concat' });
 * ```
 */
const mergeConfigs = (configs, options) => {
    const opts = {
        deep: true,
        arrayMerge: 'replace',
        skipNull: false,
        skipUndefined: true,
        ...options,
    };
    return configs.reduce((merged, config) => {
        return (0, exports.deepMerge)(merged, config, opts);
    }, {});
};
exports.mergeConfigs = mergeConfigs;
/**
 * Deep merges source into target object.
 *
 * @param {Record<string, any>} target - Target object
 * @param {Record<string, any>} source - Source object
 * @param {MergeStrategyOptions} [options] - Merge options
 * @returns {Record<string, any>} Merged object
 *
 * @example
 * ```typescript
 * const result = deepMerge(
 *   { a: 1, b: { c: 2 } },
 *   { b: { d: 3 }, e: 4 }
 * );
 * // Result: { a: 1, b: { c: 2, d: 3 }, e: 4 }
 * ```
 */
const deepMerge = (target, source, options) => {
    const opts = {
        deep: true,
        arrayMerge: 'replace',
        skipNull: false,
        skipUndefined: true,
        ...options,
    };
    const result = { ...target };
    Object.entries(source).forEach(([key, sourceValue]) => {
        if (opts.skipUndefined && sourceValue === undefined)
            return;
        if (opts.skipNull && sourceValue === null)
            return;
        const targetValue = result[key];
        // Handle arrays
        if (Array.isArray(sourceValue)) {
            if (opts.arrayMerge === 'concat' && Array.isArray(targetValue)) {
                result[key] = [...targetValue, ...sourceValue];
            }
            else if (opts.arrayMerge === 'unique' && Array.isArray(targetValue)) {
                result[key] = [...new Set([...targetValue, ...sourceValue])];
            }
            else {
                result[key] = [...sourceValue];
            }
            return;
        }
        // Handle objects
        if (opts.deep && isPlainObject(sourceValue)) {
            if (isPlainObject(targetValue)) {
                result[key] = (0, exports.deepMerge)(targetValue, sourceValue, opts);
            }
            else {
                result[key] = (0, exports.deepMerge)({}, sourceValue, opts);
            }
            return;
        }
        // Primitive values
        result[key] = sourceValue;
    });
    return result;
};
exports.deepMerge = deepMerge;
/**
 * Helper function to check if value is a plain object.
 */
const isPlainObject = (value) => {
    return value !== null &&
        typeof value === 'object' &&
        !Array.isArray(value) &&
        Object.getPrototypeOf(value) === Object.prototype;
};
// ============================================================================
// FEATURE FLAGS
// ============================================================================
/**
 * Creates feature flag configuration.
 *
 * @param {string} name - Feature flag name
 * @param {boolean} enabled - Whether feature is enabled
 * @param {Partial<FeatureFlag>} [options] - Additional options
 * @returns {FeatureFlag} Feature flag configuration
 *
 * @example
 * ```typescript
 * const newUIFlag = createFeatureFlag('new-ui', true, {
 *   environments: ['development', 'staging'],
 *   percentage: 50
 * });
 * ```
 */
const createFeatureFlag = (name, enabled, options) => {
    return {
        name,
        enabled,
        environments: options?.environments,
        percentage: options?.percentage,
        metadata: options?.metadata,
    };
};
exports.createFeatureFlag = createFeatureFlag;
/**
 * Checks if feature flag is enabled for current environment.
 *
 * @param {FeatureFlag} flag - Feature flag configuration
 * @param {EnvironmentInfo} [env] - Environment info (auto-detected if not provided)
 * @returns {boolean} True if feature is enabled
 *
 * @example
 * ```typescript
 * if (isFeatureEnabled(newUIFlag)) {
 *   // Use new UI
 * }
 * ```
 */
const isFeatureEnabled = (flag, env) => {
    if (!flag.enabled)
        return false;
    const currentEnv = env || (0, exports.detectEnvironment)();
    // Check environment restrictions
    if (flag.environments && !flag.environments.includes(currentEnv.name)) {
        return false;
    }
    // Check percentage rollout
    if (flag.percentage !== undefined && flag.percentage < 100) {
        const randomValue = Math.random() * 100;
        return randomValue < flag.percentage;
    }
    return true;
};
exports.isFeatureEnabled = isFeatureEnabled;
/**
 * Creates feature flag manager for multiple flags.
 *
 * @param {FeatureFlag[]} flags - Array of feature flags
 * @returns {object} Feature flag manager
 *
 * @example
 * ```typescript
 * const flags = createFeatureFlagManager([
 *   createFeatureFlag('feature-a', true),
 *   createFeatureFlag('feature-b', false)
 * ]);
 *
 * if (flags.isEnabled('feature-a')) {
 *   // Feature A logic
 * }
 * ```
 */
const createFeatureFlagManager = (flags) => {
    const flagMap = new Map(flags.map(flag => [flag.name, flag]));
    return {
        isEnabled: (name) => {
            const flag = flagMap.get(name);
            return flag ? (0, exports.isFeatureEnabled)(flag) : false;
        },
        getFlag: (name) => {
            return flagMap.get(name);
        },
        getAllFlags: () => {
            return Array.from(flagMap.values());
        },
        addFlag: (flag) => {
            flagMap.set(flag.name, flag);
        },
        removeFlag: (name) => {
            return flagMap.delete(name);
        },
    };
};
exports.createFeatureFlagManager = createFeatureFlagManager;
// ============================================================================
// SECRETS MANAGEMENT
// ============================================================================
/**
 * Encrypts configuration value for storage.
 *
 * @param {string} value - Value to encrypt
 * @param {string} key - Encryption key (32 bytes hex)
 * @returns {string} Encrypted value with IV
 *
 * @example
 * ```typescript
 * const encrypted = encryptConfigValue('my-secret-password', encryptionKey);
 * ```
 */
const encryptConfigValue = (value, key) => {
    const keyBuffer = Buffer.from(key, 'hex');
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', keyBuffer, iv);
    let encrypted = cipher.update(value, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
};
exports.encryptConfigValue = encryptConfigValue;
/**
 * Decrypts encrypted configuration value.
 *
 * @param {string} encryptedValue - Encrypted value with IV
 * @param {string} key - Decryption key (32 bytes hex)
 * @returns {string} Decrypted value
 *
 * @example
 * ```typescript
 * const decrypted = decryptConfigValue(encrypted, encryptionKey);
 * ```
 */
const decryptConfigValue = (encryptedValue, key) => {
    const [ivHex, authTagHex, encrypted] = encryptedValue.split(':');
    const keyBuffer = Buffer.from(key, 'hex');
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-gcm', keyBuffer, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};
exports.decryptConfigValue = decryptConfigValue;
/**
 * Masks sensitive configuration value for logging.
 *
 * @param {string} value - Value to mask
 * @param {number} [visibleChars] - Number of visible characters at start/end
 * @returns {string} Masked value
 *
 * @example
 * ```typescript
 * const masked = maskConfigValue('super-secret-api-key', 4);
 * // Result: 'supe***********-key'
 * ```
 */
const maskConfigValue = (value, visibleChars = 4) => {
    if (!value || value.length <= visibleChars * 2) {
        return '***';
    }
    const start = value.slice(0, visibleChars);
    const end = value.slice(-visibleChars);
    const masked = '*'.repeat(Math.min(value.length - visibleChars * 2, 10));
    return `${start}${masked}${end}`;
};
exports.maskConfigValue = maskConfigValue;
/**
 * Creates AWS Secrets Manager loader.
 * Requires @aws-sdk/client-secrets-manager package.
 *
 * @param {string} secretName - AWS secret name
 * @param {string} [region] - AWS region
 * @returns {Promise<Record<string, string>>} Secret values
 *
 * @example
 * ```typescript
 * const secrets = await loadFromAWSSecrets('white-cross/production', 'us-east-1');
 * ```
 */
const loadFromAWSSecrets = async (secretName, region = 'us-east-1') => {
    try {
        const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');
        const client = new SecretsManagerClient({ region });
        const command = new GetSecretValueCommand({ SecretId: secretName });
        const response = await client.send(command);
        if (response.SecretString) {
            return JSON.parse(response.SecretString);
        }
        console.warn(`Secret ${secretName} has no string value`);
        return {};
    }
    catch (error) {
        console.warn('AWS Secrets Manager requires @aws-sdk/client-secrets-manager. Install with: npm install @aws-sdk/client-secrets-manager', 'Error:', error.message);
        return {};
    }
};
exports.loadFromAWSSecrets = loadFromAWSSecrets;
/**
 * Creates Azure Key Vault loader.
 * Requires @azure/keyvault-secrets and @azure/identity packages.
 *
 * @param {string} vaultUrl - Key Vault URL
 * @param {string[]} secretNames - Secret names to load
 * @returns {Promise<Record<string, string>>} Secret values
 *
 * @example
 * ```typescript
 * const secrets = await loadFromAzureKeyVault(
 *   'https://my-vault.vault.azure.net',
 *   ['db-password', 'api-key']
 * );
 * ```
 */
const loadFromAzureKeyVault = async (vaultUrl, secretNames) => {
    try {
        const { SecretClient } = require('@azure/keyvault-secrets');
        const { DefaultAzureCredential } = require('@azure/identity');
        const credential = new DefaultAzureCredential();
        const client = new SecretClient(vaultUrl, credential);
        const secrets = {};
        for (const secretName of secretNames) {
            try {
                const secret = await client.getSecret(secretName);
                if (secret.value) {
                    secrets[secretName] = secret.value;
                }
            }
            catch (error) {
                console.warn(`Failed to load secret ${secretName}:`, error.message);
            }
        }
        return secrets;
    }
    catch (error) {
        console.warn('Azure Key Vault requires @azure/keyvault-secrets and @azure/identity. Install with: npm install @azure/keyvault-secrets @azure/identity', 'Error:', error.message);
        return {};
    }
};
exports.loadFromAzureKeyVault = loadFromAzureKeyVault;
// ============================================================================
// CONFIGURATION CACHING
// ============================================================================
/**
 * Configuration cache implementation with TTL.
 */
class ConfigCache {
    constructor() {
        this.cache = new Map();
    }
    /**
     * Sets a value in cache with TTL.
     *
     * @param {string} key - Cache key
     * @param {any} value - Value to cache
     * @param {number} [ttl] - TTL in milliseconds (default: 5 minutes)
     */
    set(key, value, ttl = 300000) {
        this.cache.set(key, {
            value,
            timestamp: Date.now(),
            ttl,
        });
    }
    /**
     * Gets value from cache if not expired.
     *
     * @param {string} key - Cache key
     * @returns {any | undefined} Cached value or undefined
     */
    get(key) {
        const entry = this.cache.get(key);
        if (!entry)
            return undefined;
        const now = Date.now();
        if (now - entry.timestamp > entry.ttl) {
            this.cache.delete(key);
            return undefined;
        }
        return entry.value;
    }
    /**
     * Checks if key exists and is not expired.
     *
     * @param {string} key - Cache key
     * @returns {boolean} True if exists and valid
     */
    has(key) {
        return this.get(key) !== undefined;
    }
    /**
     * Clears all cached entries.
     */
    clear() {
        this.cache.clear();
    }
    /**
     * Removes expired entries.
     */
    purge() {
        const now = Date.now();
        for (const [key, entry] of this.cache.entries()) {
            if (now - entry.timestamp > entry.ttl) {
                this.cache.delete(key);
            }
        }
    }
    /**
     * Gets cache statistics.
     *
     * @returns {object} Cache stats
     */
    getStats() {
        const entries = Array.from(this.cache.values());
        const now = Date.now();
        return {
            size: this.cache.size,
            valid: entries.filter(e => now - e.timestamp <= e.ttl).length,
            expired: entries.filter(e => now - e.timestamp > e.ttl).length,
        };
    }
}
exports.ConfigCache = ConfigCache;
/**
 * Creates cached configuration getter.
 *
 * @param {(key: string) => any} getter - Original getter function
 * @param {number} [ttl] - Cache TTL in milliseconds
 * @returns {(key: string) => any} Cached getter function
 *
 * @example
 * ```typescript
 * const cachedGet = createCachedGetter(
 *   (key) => configService.get(key),
 *   60000 // 1 minute cache
 * );
 * ```
 */
const createCachedGetter = (getter, ttl = 300000) => {
    const cache = new ConfigCache();
    return (key) => {
        if (cache.has(key)) {
            return cache.get(key);
        }
        const value = getter(key);
        cache.set(key, value, ttl);
        return value;
    };
};
exports.createCachedGetter = createCachedGetter;
// ============================================================================
// CONFIGURATION UTILITIES
// ============================================================================
/**
 * Generates configuration documentation in markdown.
 *
 * @param {Record<string, any>} schema - Configuration schema
 * @param {Record<string, string>} [descriptions] - Key descriptions
 * @returns {string} Markdown documentation
 *
 * @example
 * ```typescript
 * const docs = generateConfigDocs(
 *   { PORT: 'number', HOST: 'string' },
 *   { PORT: 'Server port', HOST: 'Server hostname' }
 * );
 * ```
 */
const generateConfigDocs = (schema, descriptions) => {
    let markdown = '# Configuration Documentation\n\n';
    markdown += '## Environment Variables\n\n';
    markdown += '| Variable | Type | Description | Required |\n';
    markdown += '|----------|------|-------------|----------|\n';
    Object.entries(schema).forEach(([key, type]) => {
        const desc = descriptions?.[key] || '-';
        const required = String(type).includes('required') ? 'Yes' : 'No';
        markdown += `| ${key} | ${type} | ${desc} | ${required} |\n`;
    });
    return markdown;
};
exports.generateConfigDocs = generateConfigDocs;
/**
 * Exports configuration template as .env file content.
 *
 * @param {Record<string, any>} schema - Configuration schema
 * @param {Record<string, string>} [descriptions] - Key descriptions
 * @returns {string} .env template content
 *
 * @example
 * ```typescript
 * const template = exportEnvTemplate(schema, descriptions);
 * fs.writeFileSync('.env.template', template);
 * ```
 */
const exportEnvTemplate = (schema, descriptions) => {
    let content = '# Configuration Template\n';
    content += '# Copy this file to .env and fill in the values\n\n';
    Object.entries(schema).forEach(([key, type]) => {
        const desc = descriptions?.[key];
        if (desc) {
            content += `# ${desc}\n`;
        }
        content += `# Type: ${type}\n`;
        content += `${key}=\n\n`;
    });
    return content;
};
exports.exportEnvTemplate = exportEnvTemplate;
/**
 * Sanitizes configuration for logging (removes secrets).
 *
 * @param {Record<string, any>} config - Configuration object
 * @param {string[]} [secretKeys] - Keys to mask
 * @returns {Record<string, any>} Sanitized configuration
 *
 * @example
 * ```typescript
 * const sanitized = sanitizeConfig(config, [
 *   'PASSWORD',
 *   'SECRET',
 *   'TOKEN',
 *   'KEY'
 * ]);
 * console.log(sanitized); // Secrets are masked
 * ```
 */
const sanitizeConfig = (config, secretKeys = ['PASSWORD', 'SECRET', 'TOKEN', 'KEY', 'CREDENTIAL']) => {
    const sanitized = {};
    Object.entries(config).forEach(([key, value]) => {
        const upperKey = key.toUpperCase();
        const isSecret = secretKeys.some(secretKey => upperKey.includes(secretKey));
        if (isSecret && typeof value === 'string') {
            sanitized[key] = (0, exports.maskConfigValue)(value);
        }
        else if (typeof value === 'object' && value !== null) {
            sanitized[key] = (0, exports.sanitizeConfig)(value, secretKeys);
        }
        else {
            sanitized[key] = value;
        }
    });
    return sanitized;
};
exports.sanitizeConfig = sanitizeConfig;
/**
 * Validates configuration URLs and endpoints.
 *
 * @param {Record<string, string>} urls - URL configuration
 * @returns {ConfigValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateURLs({
 *   DATABASE_URL: 'postgres://localhost:5432/mydb',
 *   REDIS_URL: 'redis://localhost:6379'
 * });
 * ```
 */
const validateURLs = (urls) => {
    const errors = [];
    Object.entries(urls).forEach(([key, url]) => {
        try {
            new URL(url);
        }
        catch {
            errors.push(`${key} is not a valid URL: ${url}`);
        }
    });
    return {
        valid: errors.length === 0,
        errors: errors.length > 0 ? errors : undefined,
    };
};
exports.validateURLs = validateURLs;
/**
 * Creates mock ConfigService for testing.
 *
 * @param {Record<string, any>} mockConfig - Mock configuration values
 * @returns {object} Mock ConfigService
 *
 * @example
 * ```typescript
 * const configService = createMockConfigService({
 *   'database.host': 'localhost',
 *   'database.port': 5432
 * });
 *
 * expect(configService.get('database.host')).toBe('localhost');
 * ```
 */
const createMockConfigService = (mockConfig) => {
    return {
        get: (key, defaultValue) => {
            return (0, exports.getNamespacedValue)(mockConfig, key, defaultValue);
        },
        getOrThrow: (key) => {
            const value = (0, exports.getNamespacedValue)(mockConfig, key);
            if (value === undefined) {
                throw new Error(`Configuration key "${key}" is not set`);
            }
            return value;
        },
    };
};
exports.createMockConfigService = createMockConfigService;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Environment Variables
    getEnv: exports.getEnv,
    getRequiredEnv: exports.getRequiredEnv,
    parseEnvInt: exports.parseEnvInt,
    parseEnvFloat: exports.parseEnvFloat,
    parseEnvBool: exports.parseEnvBool,
    parseEnvJSON: exports.parseEnvJSON,
    parseEnvArray: exports.parseEnvArray,
    expandEnvVars: exports.expandEnvVars,
    setEnvVars: exports.setEnvVars,
    // Module Builders
    createConfigModuleOptions: exports.createConfigModuleOptions,
    createTestConfigOptions: exports.createTestConfigOptions,
    createAsyncConfigFactory: exports.createAsyncConfigFactory,
    // Namespaces
    createNamespace: exports.createNamespace,
    getNamespacedValue: exports.getNamespacedValue,
    setNamespacedValue: exports.setNamespacedValue,
    mergeNamespaces: exports.mergeNamespaces,
    extractNamespace: exports.extractNamespace,
    // Validation
    validateWithJoi: exports.validateWithJoi,
    createConfigTypeGuard: exports.createConfigTypeGuard,
    validateRequiredKeys: exports.validateRequiredKeys,
    validateConstraints: exports.validateConstraints,
    validateURLs: exports.validateURLs,
    // Environment Detection
    detectEnvironment: exports.detectEnvironment,
    isProduction: exports.isProduction,
    isDevelopment: exports.isDevelopment,
    isTest: exports.isTest,
    getEnvSpecificValue: exports.getEnvSpecificValue,
    // Merging
    mergeConfigs: exports.mergeConfigs,
    deepMerge: exports.deepMerge,
    // Feature Flags
    createFeatureFlag: exports.createFeatureFlag,
    isFeatureEnabled: exports.isFeatureEnabled,
    createFeatureFlagManager: exports.createFeatureFlagManager,
    // Secrets
    encryptConfigValue: exports.encryptConfigValue,
    decryptConfigValue: exports.decryptConfigValue,
    maskConfigValue: exports.maskConfigValue,
    loadFromAWSSecrets: exports.loadFromAWSSecrets,
    loadFromAzureKeyVault: exports.loadFromAzureKeyVault,
    // Caching
    ConfigCache,
    createCachedGetter: exports.createCachedGetter,
    // Utilities
    generateConfigDocs: exports.generateConfigDocs,
    exportEnvTemplate: exports.exportEnvTemplate,
    sanitizeConfig: exports.sanitizeConfig,
    createMockConfigService: exports.createMockConfigService,
};
//# sourceMappingURL=nestjs-config-kit.js.map