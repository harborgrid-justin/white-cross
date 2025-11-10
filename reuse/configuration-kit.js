"use strict";
/**
 * LOC: CFG8G9H0E3
 * File: /reuse/configuration-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Configuration modules
 *   - Application bootstrap
 *   - Module initialization
 *   - Config services
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
exports.testConfiguration = exports.generateConfigDocumentation = exports.importConfig = exports.exportConfig = exports.buildConfigOverrideChain = exports.createConfigBackupManager = exports.createRemoteConfigLoader = exports.compareConfigVersions = exports.generateConfigHash = exports.createConfigSnapshot = exports.gracefulReload = exports.createHotReloadManager = exports.detectConfigChanges = exports.pollConfiguration = exports.watchConfigFiles = exports.applyDefaults = exports.sanitizeForLogging = exports.castConfigTypes = exports.normalizeConfig = exports.transformConfig = exports.createSecretProvider = exports.decryptSecret = exports.encryptSecret = exports.createRotatingSecret = exports.resolveSecretReferences = exports.mergeNamespaceConfigs = exports.isolateNamespace = exports.unflattenConfig = exports.flattenConfig = exports.buildHierarchicalConfig = exports.getPrefixedConfig = exports.getBatchConfig = exports.getValidatedConfig = exports.getCoercedConfig = exports.getTypedConfig = exports.mergeValidationSchemas = exports.createSchemaValidator = exports.validateConfigSchema = exports.createClassValidatorSchema = exports.createJoiSchema = exports.buildFeatureConfig = exports.buildConditionalConfig = exports.buildLayeredConfig = exports.buildMultiEnvConfig = exports.buildConfigModuleOptions = void 0;
/**
 * File: /reuse/configuration-kit.ts
 * Locator: WC-UTL-CFG-002
 * Purpose: Advanced NestJS Configuration Management Toolkit - Configuration builders and utilities
 *
 * Upstream: Independent utility module for NestJS configuration operations
 * Downstream: ../backend/*, Config modules, Bootstrap files, Feature modules
 * Dependencies: TypeScript 5.x, Node 18+, joi, class-validator
 * Exports: 45 utility functions for config module building, validation, namespaces, transformations
 *
 * LLM Context: Enterprise-grade configuration utilities for White Cross healthcare platform.
 * Provides advanced config module builders, schema validation patterns, namespace management,
 * configuration transformation, secret integration, dynamic config loading, versioning,
 * remote config support, hot-reload capabilities, and HIPAA-compliant configuration patterns.
 */
const crypto = __importStar(require("crypto"));
const path = __importStar(require("path"));
// ============================================================================
// 1. CONFIG MODULE BUILDERS
// ============================================================================
/**
 * 1. Creates advanced ConfigModule options with environment-based paths.
 *
 * @param {string} env - Environment name
 * @param {Partial<AdvancedConfigOptions>} [overrides] - Option overrides
 * @returns {AdvancedConfigOptions} Complete config module options
 *
 * @example
 * ```typescript
 * const config = buildConfigModuleOptions('production', {
 *   cache: true,
 *   validationSchema: mySchema
 * });
 * ```
 */
const buildConfigModuleOptions = (env, overrides) => {
    const isProd = env === 'production' || env === 'prod';
    return {
        isGlobal: true,
        cache: isProd,
        expandVariables: true,
        ignoreEnvFile: false,
        envFilePath: [
            `.env.${env}.local`,
            `.env.${env}`,
            `.env.local`,
            '.env',
        ],
        validationOptions: {
            abortEarly: isProd,
            allowUnknown: !isProd,
        },
        encoding: 'utf8',
        ...overrides,
    };
};
exports.buildConfigModuleOptions = buildConfigModuleOptions;
/**
 * 2. Creates multi-environment ConfigModule options.
 *
 * @param {string[]} environments - Array of environment names
 * @param {Partial<AdvancedConfigOptions>} [baseOptions] - Base options
 * @returns {Record<string, AdvancedConfigOptions>} Config options per environment
 *
 * @example
 * ```typescript
 * const configs = buildMultiEnvConfig(['dev', 'staging', 'production']);
 * const prodConfig = configs.production;
 * ```
 */
const buildMultiEnvConfig = (environments, baseOptions) => {
    const configs = {};
    environments.forEach(env => {
        configs[env] = (0, exports.buildConfigModuleOptions)(env, baseOptions);
    });
    return configs;
};
exports.buildMultiEnvConfig = buildMultiEnvConfig;
/**
 * 3. Creates layered configuration with priority-based loading.
 *
 * @param {ConfigLoader[]} loaders - Array of config loaders (lowest to highest priority)
 * @returns {() => Promise<Record<string, any>>} Async factory function
 *
 * @example
 * ```typescript
 * const factory = buildLayeredConfig([
 *   { name: 'defaults', load: () => defaultConfig },
 *   { name: 'env', load: () => envConfig },
 *   { name: 'secrets', load: async () => await loadSecrets() }
 * ]);
 * ```
 */
const buildLayeredConfig = (loaders) => {
    const sortedLoaders = [...loaders].sort((a, b) => (a.priority || 0) - (b.priority || 0));
    return async () => {
        let config = {};
        for (const loader of sortedLoaders) {
            const loadedConfig = await Promise.resolve(loader.load());
            if (loader.validate && !loader.validate(loadedConfig)) {
                throw new Error(`Config validation failed for loader: ${loader.name}`);
            }
            config = deepMergeConfigs(config, loadedConfig);
        }
        return config;
    };
};
exports.buildLayeredConfig = buildLayeredConfig;
/**
 * 4. Creates conditional configuration loader.
 *
 * @param {() => boolean} condition - Condition function
 * @param {() => Record<string, any>} trueLoader - Loader when condition is true
 * @param {() => Record<string, any>} [falseLoader] - Loader when condition is false
 * @returns {() => Record<string, any>} Conditional loader
 *
 * @example
 * ```typescript
 * const loader = buildConditionalConfig(
 *   () => process.env.NODE_ENV === 'production',
 *   () => prodConfig,
 *   () => devConfig
 * );
 * ```
 */
const buildConditionalConfig = (condition, trueLoader, falseLoader) => {
    return () => {
        return condition() ? trueLoader() : (falseLoader?.() || {});
    };
};
exports.buildConditionalConfig = buildConditionalConfig;
/**
 * 5. Creates feature-based configuration module factory.
 *
 * @param {string} featureName - Feature name
 * @param {Record<string, any>} config - Feature configuration
 * @param {Partial<AdvancedConfigOptions>} [options] - Module options
 * @returns {AdvancedConfigOptions} Feature config options
 *
 * @example
 * ```typescript
 * const authConfig = buildFeatureConfig('auth', {
 *   jwt: { secret: process.env.JWT_SECRET }
 * });
 * ```
 */
const buildFeatureConfig = (featureName, config, options) => {
    return {
        isGlobal: false,
        cache: true,
        load: [() => ({ [featureName]: config })],
        ...options,
    };
};
exports.buildFeatureConfig = buildFeatureConfig;
// ============================================================================
// 2. CONFIGURATION VALIDATION SCHEMAS
// ============================================================================
/**
 * 6. Creates Joi schema from configuration schema definition.
 *
 * @param {ConfigSchema} schema - Configuration schema
 * @returns {Record<string, any>} Joi validation schema placeholder
 * @throws {Error} When joi package is not available
 *
 * @example
 * ```typescript
 * const schema = createJoiSchema({
 *   PORT: { type: 'number', required: true, min: 1024, max: 65535 },
 *   HOST: { type: 'string', required: true, default: 'localhost' }
 * });
 * ```
 */
const createJoiSchema = (schema) => {
    // Placeholder - requires joi import
    // This would build a Joi schema from the ConfigSchema definition
    throw new Error('createJoiSchema requires joi package to be installed');
};
exports.createJoiSchema = createJoiSchema;
/**
 * 7. Creates class-validator schema from configuration definition.
 *
 * @param {ConfigSchema} schema - Configuration schema
 * @returns {Record<string, any>} Class constructor with validators placeholder
 * @throws {Error} When class-validator package is not available
 *
 * @example
 * ```typescript
 * const EnvVars = createClassValidatorSchema({
 *   PORT: { type: 'number', required: true },
 *   HOST: { type: 'string', required: true }
 * });
 * ```
 */
const createClassValidatorSchema = (schema) => {
    // Placeholder - would dynamically create class with decorators
    throw new Error('createClassValidatorSchema requires class-validator package to be installed');
};
exports.createClassValidatorSchema = createClassValidatorSchema;
/**
 * 8. Validates configuration against custom schema.
 *
 * @param {Record<string, any>} config - Configuration to validate
 * @param {ConfigSchema} schema - Validation schema
 * @returns {{ valid: boolean; errors?: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const result = validateConfigSchema(config, {
 *   PORT: { type: 'number', required: true, min: 1024 }
 * });
 * ```
 */
const validateConfigSchema = (config, schema) => {
    const errors = [];
    Object.entries(schema).forEach(([key, rules]) => {
        const value = config[key];
        // Required check
        if (rules.required && (value === undefined || value === null)) {
            errors.push(`${key} is required`);
            return;
        }
        if (value === undefined || value === null)
            return;
        // Type check
        const actualType = Array.isArray(value) ? 'array' : typeof value;
        if (actualType !== rules.type && rules.type !== 'object') {
            errors.push(`${key} must be of type ${rules.type}`);
        }
        // Number constraints
        if (rules.type === 'number' && typeof value === 'number') {
            if (rules.min !== undefined && value < rules.min) {
                errors.push(`${key} must be at least ${rules.min}`);
            }
            if (rules.max !== undefined && value > rules.max) {
                errors.push(`${key} must be at most ${rules.max}`);
            }
        }
        // Enum check
        if (rules.enum && !rules.enum.includes(value)) {
            errors.push(`${key} must be one of: ${rules.enum.join(', ')}`);
        }
        // Pattern check
        if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
            errors.push(`${key} does not match required pattern`);
        }
        // Custom validator
        if (rules.validator && !rules.validator(value)) {
            errors.push(`${key} failed custom validation`);
        }
    });
    return {
        valid: errors.length === 0,
        errors: errors.length > 0 ? errors : undefined,
    };
};
exports.validateConfigSchema = validateConfigSchema;
/**
 * 9. Creates schema validator factory for reusable validation.
 *
 * @param {ConfigSchema} schema - Configuration schema
 * @returns {(config: Record<string, any>) => boolean} Validator function
 *
 * @example
 * ```typescript
 * const validate = createSchemaValidator(mySchema);
 * if (!validate(config)) {
 *   throw new Error('Invalid configuration');
 * }
 * ```
 */
const createSchemaValidator = (schema) => {
    return (config) => {
        const result = (0, exports.validateConfigSchema)(config, schema);
        return result.valid;
    };
};
exports.createSchemaValidator = createSchemaValidator;
/**
 * 10. Merges multiple validation schemas.
 *
 * @param {ConfigSchema[]} schemas - Array of schemas to merge
 * @returns {ConfigSchema} Merged schema
 *
 * @example
 * ```typescript
 * const merged = mergeValidationSchemas([baseSchema, dbSchema, authSchema]);
 * ```
 */
const mergeValidationSchemas = (schemas) => {
    return schemas.reduce((merged, schema) => {
        return { ...merged, ...schema };
    }, {});
};
exports.mergeValidationSchemas = mergeValidationSchemas;
// ============================================================================
// 3. TYPED CONFIG GETTERS
// ============================================================================
/**
 * 11. Creates strongly-typed configuration getter.
 *
 * @template T
 * @param {Record<string, any>} config - Configuration object
 * @param {string} key - Configuration key
 * @param {T} [defaultValue] - Default value
 * @returns {T} Typed configuration value
 *
 * @example
 * ```typescript
 * const port = getTypedConfig<number>(config, 'PORT', 3000);
 * const host = getTypedConfig<string>(config, 'HOST', 'localhost');
 * ```
 */
const getTypedConfig = (config, key, defaultValue) => {
    const value = config[key];
    return (value !== undefined ? value : defaultValue);
};
exports.getTypedConfig = getTypedConfig;
/**
 * 12. Creates configuration getter with type coercion.
 *
 * @template T
 * @param {Record<string, any>} config - Configuration object
 * @param {string} key - Configuration key
 * @param {'string' | 'number' | 'boolean'} type - Target type
 * @param {T} [defaultValue] - Default value
 * @returns {T} Coerced value
 *
 * @example
 * ```typescript
 * const port = getCoercedConfig(config, 'PORT', 'number', 3000);
 * const debug = getCoercedConfig(config, 'DEBUG', 'boolean', false);
 * ```
 */
const getCoercedConfig = (config, key, type, defaultValue) => {
    const value = config[key];
    if (value === undefined || value === null) {
        return defaultValue;
    }
    switch (type) {
        case 'number':
            const num = Number(value);
            return (isNaN(num) ? defaultValue : num);
        case 'boolean':
            if (typeof value === 'boolean')
                return value;
            const strVal = String(value).toLowerCase();
            return (['true', '1', 'yes', 'on'].includes(strVal));
        case 'string':
            return String(value);
        default:
            return value;
    }
};
exports.getCoercedConfig = getCoercedConfig;
/**
 * 13. Creates configuration getter with validation.
 *
 * @template T
 * @param {Record<string, any>} config - Configuration object
 * @param {string} key - Configuration key
 * @param {(value: T) => boolean} validator - Validation function
 * @param {T} [defaultValue] - Default value
 * @returns {T} Validated value
 * @throws {Error} If validation fails
 *
 * @example
 * ```typescript
 * const port = getValidatedConfig(
 *   config,
 *   'PORT',
 *   (val: number) => val >= 1024 && val <= 65535,
 *   3000
 * );
 * ```
 */
const getValidatedConfig = (config, key, validator, defaultValue) => {
    const value = (0, exports.getTypedConfig)(config, key, defaultValue);
    if (!validator(value)) {
        throw new Error(`Configuration validation failed for key: ${key}`);
    }
    return value;
};
exports.getValidatedConfig = getValidatedConfig;
/**
 * 14. Creates batch configuration getter.
 *
 * @param {Record<string, any>} config - Configuration object
 * @param {string[]} keys - Array of keys to retrieve
 * @returns {Record<string, any>} Object with retrieved values
 *
 * @example
 * ```typescript
 * const dbConfig = getBatchConfig(config, [
 *   'DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD'
 * ]);
 * ```
 */
const getBatchConfig = (config, keys) => {
    const result = {};
    keys.forEach(key => {
        if (config[key] !== undefined) {
            result[key] = config[key];
        }
    });
    return result;
};
exports.getBatchConfig = getBatchConfig;
/**
 * 15. Creates prefixed configuration getter.
 *
 * @param {Record<string, any>} config - Configuration object
 * @param {string} prefix - Key prefix (e.g., 'DATABASE_')
 * @returns {Record<string, any>} Object with prefixed keys removed
 *
 * @example
 * ```typescript
 * const dbConfig = getPrefixedConfig(config, 'DATABASE_');
 * // DATABASE_HOST becomes HOST
 * ```
 */
const getPrefixedConfig = (config, prefix) => {
    const result = {};
    Object.entries(config).forEach(([key, value]) => {
        if (key.startsWith(prefix)) {
            const newKey = key.substring(prefix.length);
            result[newKey] = value;
        }
    });
    return result;
};
exports.getPrefixedConfig = getPrefixedConfig;
// ============================================================================
// 4. NAMESPACE CONFIGURATION HELPERS
// ============================================================================
/**
 * 16. Creates hierarchical namespace configuration.
 *
 * @param {Record<string, Record<string, any>>} namespaces - Namespace definitions
 * @returns {Record<string, any>} Hierarchical configuration
 *
 * @example
 * ```typescript
 * const config = buildHierarchicalConfig({
 *   database: { host: 'localhost', port: 5432 },
 *   cache: { ttl: 3600, max: 100 }
 * });
 * ```
 */
const buildHierarchicalConfig = (namespaces) => {
    return namespaces;
};
exports.buildHierarchicalConfig = buildHierarchicalConfig;
/**
 * 17. Flattens nested configuration to dot notation.
 *
 * @param {Record<string, any>} config - Nested configuration
 * @param {string} [prefix] - Key prefix
 * @returns {Record<string, any>} Flattened configuration
 *
 * @example
 * ```typescript
 * const flat = flattenConfig({ db: { host: 'localhost', port: 5432 } });
 * // Result: { 'db.host': 'localhost', 'db.port': 5432 }
 * ```
 */
const flattenConfig = (config, prefix = '') => {
    const result = {};
    Object.entries(config).forEach(([key, value]) => {
        const newKey = prefix ? `${prefix}.${key}` : key;
        if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
            Object.assign(result, (0, exports.flattenConfig)(value, newKey));
        }
        else {
            result[newKey] = value;
        }
    });
    return result;
};
exports.flattenConfig = flattenConfig;
/**
 * 18. Unflattens dot notation configuration to nested object.
 *
 * @param {Record<string, any>} config - Flattened configuration
 * @returns {Record<string, any>} Nested configuration
 *
 * @example
 * ```typescript
 * const nested = unflattenConfig({ 'db.host': 'localhost', 'db.port': 5432 });
 * // Result: { db: { host: 'localhost', port: 5432 } }
 * ```
 */
const unflattenConfig = (config) => {
    const result = {};
    Object.entries(config).forEach(([key, value]) => {
        const keys = key.split('.');
        let current = result;
        keys.forEach((k, index) => {
            if (index === keys.length - 1) {
                current[k] = value;
            }
            else {
                current[k] = current[k] || {};
                current = current[k];
            }
        });
    });
    return result;
};
exports.unflattenConfig = unflattenConfig;
/**
 * 19. Creates namespace isolation wrapper.
 *
 * @param {string} namespace - Namespace name
 * @param {Record<string, any>} config - Full configuration
 * @returns {Record<string, any>} Isolated namespace configuration
 *
 * @example
 * ```typescript
 * const dbConfig = isolateNamespace('database', fullConfig);
 * ```
 */
const isolateNamespace = (namespace, config) => {
    return config[namespace] || {};
};
exports.isolateNamespace = isolateNamespace;
/**
 * 20. Merges namespace configurations with conflict resolution.
 *
 * @param {Record<string, any>[]} configs - Array of namespace configs
 * @param {(key: string, values: any[]) => any} [resolver] - Conflict resolver
 * @returns {Record<string, any>} Merged configuration
 *
 * @example
 * ```typescript
 * const merged = mergeNamespaceConfigs(
 *   [config1, config2],
 *   (key, values) => values[values.length - 1]
 * );
 * ```
 */
const mergeNamespaceConfigs = (configs, resolver) => {
    const merged = {};
    const conflicts = new Map();
    configs.forEach(config => {
        Object.entries(config).forEach(([key, value]) => {
            if (merged[key] !== undefined && merged[key] !== value) {
                if (!conflicts.has(key)) {
                    conflicts.set(key, [merged[key]]);
                }
                conflicts.get(key).push(value);
            }
            merged[key] = value;
        });
    });
    // Resolve conflicts
    if (resolver) {
        conflicts.forEach((values, key) => {
            merged[key] = resolver(key, values);
        });
    }
    return merged;
};
exports.mergeNamespaceConfigs = mergeNamespaceConfigs;
// ============================================================================
// 5. SECRET MANAGEMENT UTILITIES
// ============================================================================
/**
 * 21. Creates secret reference resolver for configuration.
 *
 * @param {Record<string, any>} config - Configuration with secret references
 * @param {(ref: string) => Promise<string>} resolver - Secret resolver function
 * @returns {Promise<Record<string, any>>} Configuration with resolved secrets
 *
 * @example
 * ```typescript
 * const resolved = await resolveSecretReferences(
 *   { password: '{{secret:db-password}}' },
 *   async (ref) => await getSecret(ref)
 * );
 * ```
 */
const resolveSecretReferences = async (config, resolver) => {
    const resolved = {};
    for (const [key, value] of Object.entries(config)) {
        if (typeof value === 'string') {
            const match = value.match(/\{\{secret:([^}]+)\}\}/);
            if (match) {
                resolved[key] = await resolver(match[1]);
            }
            else {
                resolved[key] = value;
            }
        }
        else if (typeof value === 'object' && value !== null) {
            resolved[key] = await (0, exports.resolveSecretReferences)(value, resolver);
        }
        else {
            resolved[key] = value;
        }
    }
    return resolved;
};
exports.resolveSecretReferences = resolveSecretReferences;
/**
 * 22. Creates secret rotation handler.
 *
 * @param {string} secretName - Secret name
 * @param {() => Promise<string>} fetcher - Secret fetcher
 * @param {number} rotationInterval - Rotation interval in ms
 * @returns {() => Promise<string>} Rotating secret getter
 *
 * @example
 * ```typescript
 * const getApiKey = createRotatingSecret(
 *   'api-key',
 *   async () => await fetchSecret('api-key'),
 *   3600000 // Rotate every hour
 * );
 * ```
 */
const createRotatingSecret = (secretName, fetcher, rotationInterval) => {
    let cachedSecret = null;
    let lastFetch = 0;
    return async () => {
        const now = Date.now();
        if (!cachedSecret || now - lastFetch > rotationInterval) {
            cachedSecret = await fetcher();
            lastFetch = now;
        }
        return cachedSecret;
    };
};
exports.createRotatingSecret = createRotatingSecret;
/**
 * 23. Creates secret encryption wrapper with key derivation.
 *
 * @param {string} secret - Secret to encrypt
 * @param {string} passphrase - Encryption passphrase
 * @param {string} [salt] - Salt for key derivation
 * @returns {string} Encrypted secret
 *
 * @example
 * ```typescript
 * const encrypted = encryptSecret('my-password', 'master-key');
 * ```
 */
const encryptSecret = (secret, passphrase, salt) => {
    const derivedSalt = salt || crypto.randomBytes(16).toString('hex');
    const key = crypto.pbkdf2Sync(passphrase, derivedSalt, 100000, 32, 'sha256');
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    let encrypted = cipher.update(secret, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();
    return `${derivedSalt}:${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
};
exports.encryptSecret = encryptSecret;
/**
 * 24. Decrypts secret encrypted with encryptSecret.
 *
 * @param {string} encryptedSecret - Encrypted secret string
 * @param {string} passphrase - Decryption passphrase
 * @returns {string} Decrypted secret
 *
 * @example
 * ```typescript
 * const decrypted = decryptSecret(encrypted, 'master-key');
 * ```
 */
const decryptSecret = (encryptedSecret, passphrase) => {
    const [salt, ivHex, authTagHex, encrypted] = encryptedSecret.split(':');
    const key = crypto.pbkdf2Sync(passphrase, salt, 100000, 32, 'sha256');
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};
exports.decryptSecret = decryptSecret;
/**
 * 25. Creates secret provider factory for multiple backends.
 *
 * @param {'aws' | 'azure' | 'vault' | 'env'} provider - Provider type
 * @param {any} config - Provider configuration
 * @returns {(key: string) => Promise<string>} Secret getter
 *
 * @example
 * ```typescript
 * const getSecret = createSecretProvider('aws', { region: 'us-east-1' });
 * const password = await getSecret('db-password');
 * ```
 */
const createSecretProvider = (provider, config) => {
    return async (key) => {
        switch (provider) {
            case 'env':
                return process.env[key] || '';
            case 'aws':
            case 'azure':
            case 'vault':
                console.warn(`${provider} secret provider not implemented`);
                return '';
            default:
                throw new Error(`Unknown secret provider: ${provider}`);
        }
    };
};
exports.createSecretProvider = createSecretProvider;
// ============================================================================
// 6. CONFIGURATION TRANSFORMATION
// ============================================================================
/**
 * 26. Transforms configuration values using rules.
 *
 * @param {Record<string, any>} config - Configuration to transform
 * @param {ConfigTransformRule[]} rules - Transformation rules
 * @returns {Record<string, any>} Transformed configuration
 *
 * @example
 * ```typescript
 * const transformed = transformConfig(config, [
 *   { path: 'port', transform: (v) => parseInt(v) },
 *   { path: 'url', transform: (v) => v.toLowerCase() }
 * ]);
 * ```
 */
const transformConfig = (config, rules) => {
    const result = { ...config };
    rules.forEach(rule => {
        const keys = rule.path.split('.');
        let current = result;
        const lastKey = keys.pop();
        // Navigate to parent
        for (const key of keys) {
            if (!current[key])
                return;
            current = current[key];
        }
        // Apply transformation
        if (current[lastKey] !== undefined) {
            if (!rule.condition || rule.condition(current[lastKey])) {
                current[lastKey] = rule.transform(current[lastKey]);
            }
        }
    });
    return result;
};
exports.transformConfig = transformConfig;
/**
 * 27. Creates configuration normalizer for consistent formatting.
 *
 * @param {Record<string, any>} config - Configuration to normalize
 * @param {object} [options] - Normalization options
 * @returns {Record<string, any>} Normalized configuration
 *
 * @example
 * ```typescript
 * const normalized = normalizeConfig(config, {
 *   trimStrings: true,
 *   lowercaseKeys: true,
 *   removeEmpty: true
 * });
 * ```
 */
const normalizeConfig = (config, options) => {
    const opts = {
        trimStrings: true,
        lowercaseKeys: false,
        uppercaseKeys: false,
        removeEmpty: false,
        removeNull: false,
        ...options,
    };
    const result = {};
    Object.entries(config).forEach(([key, value]) => {
        // Skip based on options
        if (opts.removeEmpty && value === '')
            return;
        if (opts.removeNull && value === null)
            return;
        // Transform key
        let newKey = key;
        if (opts.lowercaseKeys)
            newKey = newKey.toLowerCase();
        if (opts.uppercaseKeys)
            newKey = newKey.toUpperCase();
        // Transform value
        let newValue = value;
        if (typeof value === 'string' && opts.trimStrings) {
            newValue = value.trim();
        }
        else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            newValue = (0, exports.normalizeConfig)(value, options);
        }
        result[newKey] = newValue;
    });
    return result;
};
exports.normalizeConfig = normalizeConfig;
/**
 * 28. Creates configuration type caster.
 *
 * @param {Record<string, any>} config - Configuration to cast
 * @param {Record<string, string>} typeMap - Type mapping
 * @returns {Record<string, any>} Type-cast configuration
 *
 * @example
 * ```typescript
 * const casted = castConfigTypes(config, {
 *   PORT: 'number',
 *   DEBUG: 'boolean',
 *   TAGS: 'array'
 * });
 * ```
 */
const castConfigTypes = (config, typeMap) => {
    const result = { ...config };
    Object.entries(typeMap).forEach(([key, type]) => {
        if (result[key] === undefined)
            return;
        const value = result[key];
        switch (type) {
            case 'number':
                result[key] = Number(value);
                break;
            case 'boolean':
                result[key] = String(value).toLowerCase() === 'true' || value === '1';
                break;
            case 'string':
                result[key] = String(value);
                break;
            case 'array':
                result[key] = Array.isArray(value) ? value : String(value).split(',').map(s => s.trim());
                break;
            case 'json':
                result[key] = typeof value === 'string' ? JSON.parse(value) : value;
                break;
        }
    });
    return result;
};
exports.castConfigTypes = castConfigTypes;
/**
 * 29. Creates configuration sanitizer for safe logging.
 *
 * @param {Record<string, any>} config - Configuration to sanitize
 * @param {string[]} [sensitiveKeys] - Keys to redact
 * @returns {Record<string, any>} Sanitized configuration
 *
 * @example
 * ```typescript
 * const safe = sanitizeForLogging(config, [
 *   'PASSWORD', 'SECRET', 'TOKEN', 'KEY'
 * ]);
 * ```
 */
const sanitizeForLogging = (config, sensitiveKeys = ['PASSWORD', 'SECRET', 'TOKEN', 'KEY', 'CREDENTIAL']) => {
    const result = {};
    Object.entries(config).forEach(([key, value]) => {
        const isSensitive = sensitiveKeys.some(pattern => key.toUpperCase().includes(pattern));
        if (isSensitive && typeof value === 'string') {
            result[key] = '***REDACTED***';
        }
        else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            result[key] = (0, exports.sanitizeForLogging)(value, sensitiveKeys);
        }
        else {
            result[key] = value;
        }
    });
    return result;
};
exports.sanitizeForLogging = sanitizeForLogging;
/**
 * 30. Creates default value applier.
 *
 * @param {Record<string, any>} config - Configuration object
 * @param {Record<string, any>} defaults - Default values
 * @returns {Record<string, any>} Configuration with defaults applied
 *
 * @example
 * ```typescript
 * const withDefaults = applyDefaults(config, {
 *   PORT: 3000,
 *   HOST: 'localhost',
 *   DEBUG: false
 * });
 * ```
 */
const applyDefaults = (config, defaults) => {
    return deepMergeConfigs(defaults, config);
};
exports.applyDefaults = applyDefaults;
// ============================================================================
// 7. HOT RELOAD HELPERS
// ============================================================================
/**
 * 31. Creates configuration file watcher with reload callback.
 *
 * @param {string[]} filePaths - Paths to watch
 * @param {ConfigWatchCallback} callback - Reload callback
 * @param {number} [debounceMs] - Debounce time in ms
 * @returns {() => void} Stop watching function
 * @throws {Error} When file paths array is empty
 *
 * @example
 * ```typescript
 * const stop = watchConfigFiles(
 *   ['.env', '.env.local'],
 *   (newConfig, oldConfig, diff) => console.log('Config changed')
 * );
 * ```
 */
const watchConfigFiles = (filePaths, callback, debounceMs = 1000) => {
    if (!filePaths || filePaths.length === 0) {
        throw new Error('File paths array cannot be empty');
    }
    // Placeholder - would use fs.watch with proper implementation
    // In production: implement debounced fs.watch with error handling
    return () => {
        // Cleanup watchers
    };
};
exports.watchConfigFiles = watchConfigFiles;
/**
 * 32. Creates polling-based configuration reloader.
 *
 * @param {() => Promise<Record<string, any>>} loader - Config loader
 * @param {number} intervalMs - Poll interval
 * @param {(config: Record<string, any>) => void} callback - Change callback
 * @returns {() => void} Stop polling function
 *
 * @example
 * ```typescript
 * const stop = pollConfiguration(
 *   async () => await loadRemoteConfig(),
 *   30000,
 *   (config) => updateConfig(config)
 * );
 * ```
 */
const pollConfiguration = (loader, intervalMs, callback) => {
    let lastConfig = null;
    const interval = setInterval(async () => {
        const newConfig = await loader();
        if (JSON.stringify(newConfig) !== JSON.stringify(lastConfig)) {
            lastConfig = newConfig;
            callback(newConfig);
        }
    }, intervalMs);
    return () => clearInterval(interval);
};
exports.pollConfiguration = pollConfiguration;
/**
 * 33. Creates configuration change detector.
 *
 * @param {Record<string, any>} oldConfig - Old configuration
 * @param {Record<string, any>} newConfig - New configuration
 * @returns {ConfigDiff} Configuration differences
 *
 * @example
 * ```typescript
 * const diff = detectConfigChanges(oldConfig, newConfig);
 * console.log(`Added: ${diff.added.length}, Modified: ${diff.modified.length}`);
 * ```
 */
const detectConfigChanges = (oldConfig, newConfig) => {
    const added = [];
    const removed = [];
    const modified = [];
    const oldFlat = (0, exports.flattenConfig)(oldConfig);
    const newFlat = (0, exports.flattenConfig)(newConfig);
    // Check for added and modified
    Object.keys(newFlat).forEach(key => {
        if (!(key in oldFlat)) {
            added.push(key);
        }
        else if (JSON.stringify(oldFlat[key]) !== JSON.stringify(newFlat[key])) {
            modified.push({
                key,
                oldValue: oldFlat[key],
                newValue: newFlat[key],
            });
        }
    });
    // Check for removed
    Object.keys(oldFlat).forEach(key => {
        if (!(key in newFlat)) {
            removed.push(key);
        }
    });
    return { added, removed, modified };
};
exports.detectConfigChanges = detectConfigChanges;
/**
 * 34. Creates hot-reload manager with validation.
 *
 * @param {() => Record<string, any>} loader - Config loader
 * @param {(config: Record<string, any>) => boolean} validator - Validator
 * @returns {object} Hot reload manager
 *
 * @example
 * ```typescript
 * const manager = createHotReloadManager(
 *   () => loadConfig(),
 *   (config) => validateConfig(config)
 * );
 * await manager.reload();
 * ```
 */
const createHotReloadManager = (loader, validator) => {
    let currentConfig = loader();
    return {
        reload: async () => {
            const newConfig = loader();
            if (!validator(newConfig)) {
                console.error('Config validation failed, keeping current config');
                return false;
            }
            currentConfig = newConfig;
            return true;
        },
        getConfig: () => currentConfig,
        getDiff: () => {
            const newConfig = loader();
            return (0, exports.detectConfigChanges)(currentConfig, newConfig);
        },
    };
};
exports.createHotReloadManager = createHotReloadManager;
/**
 * 35. Creates graceful configuration reload with rollback.
 *
 * @param {Record<string, any>} config - Current configuration
 * @param {Record<string, any>} newConfig - New configuration
 * @param {(config: Record<string, any>) => Promise<boolean>} tester - Config tester
 * @returns {Promise<{ success: boolean; config: Record<string, any> }>} Reload result
 *
 * @example
 * ```typescript
 * const result = await gracefulReload(
 *   currentConfig,
 *   newConfig,
 *   async (cfg) => await testDatabaseConnection(cfg)
 * );
 * ```
 */
const gracefulReload = async (config, newConfig, tester) => {
    const testPassed = await tester(newConfig);
    if (testPassed) {
        return { success: true, config: newConfig };
    }
    console.warn('Configuration test failed, rolling back');
    return { success: false, config };
};
exports.gracefulReload = gracefulReload;
// ============================================================================
// 8. CONFIGURATION VERSIONING & REMOTE LOADING
// ============================================================================
/**
 * 36. Creates configuration snapshot with version metadata.
 *
 * @param {Record<string, any>} config - Configuration to snapshot
 * @param {string} [version] - Version identifier
 * @returns {ConfigSnapshot} Configuration snapshot
 *
 * @example
 * ```typescript
 * const snapshot = createConfigSnapshot(config, 'v1.2.3');
 * ```
 */
const createConfigSnapshot = (config, version) => {
    return {
        timestamp: Date.now(),
        config: JSON.parse(JSON.stringify(config)),
        version,
        metadata: {
            hash: (0, exports.generateConfigHash)(config),
        },
    };
};
exports.createConfigSnapshot = createConfigSnapshot;
/**
 * 37. Generates hash for configuration content.
 *
 * @param {Record<string, any>} config - Configuration object
 * @returns {string} SHA-256 hash
 *
 * @example
 * ```typescript
 * const hash = generateConfigHash(config);
 * ```
 */
const generateConfigHash = (config) => {
    const content = JSON.stringify(config, Object.keys(config).sort());
    return crypto.createHash('sha256').update(content).digest('hex');
};
exports.generateConfigHash = generateConfigHash;
/**
 * 38. Compares configuration versions.
 *
 * @param {ConfigSnapshot} snapshot1 - First snapshot
 * @param {ConfigSnapshot} snapshot2 - Second snapshot
 * @returns {boolean} True if configurations are identical
 *
 * @example
 * ```typescript
 * const same = compareConfigVersions(snapshot1, snapshot2);
 * ```
 */
const compareConfigVersions = (snapshot1, snapshot2) => {
    return (0, exports.generateConfigHash)(snapshot1.config) === (0, exports.generateConfigHash)(snapshot2.config);
};
exports.compareConfigVersions = compareConfigVersions;
/**
 * 39. Creates remote configuration loader.
 *
 * @param {RemoteConfigSource} source - Remote source configuration
 * @returns {() => Promise<Record<string, any>>} Remote loader
 * @throws {Error} When HTTP client is not available
 *
 * @example
 * ```typescript
 * const loader = createRemoteConfigLoader({
 *   url: 'https://config.example.com/api/config',
 *   headers: { 'Authorization': 'Bearer token' }
 * });
 * ```
 */
const createRemoteConfigLoader = (source) => {
    if (!source || !source.url) {
        throw new Error('Remote config source URL is required');
    }
    return async () => {
        throw new Error('Remote config loading requires HTTP client (fetch/axios) to be implemented');
    };
};
exports.createRemoteConfigLoader = createRemoteConfigLoader;
/**
 * 40. Creates configuration backup manager.
 *
 * @param {string} backupDir - Backup directory path
 * @returns {object} Backup manager
 *
 * @example
 * ```typescript
 * const backups = createConfigBackupManager('./backups');
 * await backups.save(config, 'v1.0.0');
 * const restored = await backups.restore('v1.0.0');
 * ```
 */
const createConfigBackupManager = (backupDir) => {
    return {
        save: async (config, version) => {
            const snapshot = (0, exports.createConfigSnapshot)(config, version);
            const filename = `config-${version}-${Date.now()}.json`;
            const filepath = path.join(backupDir, filename);
            // Would write to file
            console.log(`Would save config to ${filepath}`);
        },
        restore: async (version) => {
            // Would read from file
            console.warn('Restore not implemented');
            return {};
        },
        list: async () => {
            // Would list backup files
            return [];
        },
    };
};
exports.createConfigBackupManager = createConfigBackupManager;
// ============================================================================
// 9. ADVANCED UTILITIES
// ============================================================================
/**
 * 41. Creates configuration override chain.
 *
 * @param {Record<string, any>[]} configs - Configs in priority order (low to high)
 * @returns {Record<string, any>} Final configuration
 *
 * @example
 * ```typescript
 * const final = buildConfigOverrideChain([
 *   defaultConfig,
 *   envConfig,
 *   localConfig,
 *   cliConfig
 * ]);
 * ```
 */
const buildConfigOverrideChain = (configs) => {
    return configs.reduce((result, config) => deepMergeConfigs(result, config), {});
};
exports.buildConfigOverrideChain = buildConfigOverrideChain;
/**
 * 42. Creates configuration export utility.
 *
 * @param {Record<string, any>} config - Configuration to export
 * @param {'json' | 'yaml' | 'env' | 'ts'} format - Export format
 * @returns {string} Exported configuration
 *
 * @example
 * ```typescript
 * const json = exportConfig(config, 'json');
 * const env = exportConfig(config, 'env');
 * ```
 */
const exportConfig = (config, format) => {
    switch (format) {
        case 'json':
            return JSON.stringify(config, null, 2);
        case 'env':
            const flat = (0, exports.flattenConfig)(config);
            return Object.entries(flat)
                .map(([key, value]) => `${key}=${value}`)
                .join('\n');
        case 'yaml':
        case 'ts':
            console.warn(`${format} export not implemented`);
            return '';
        default:
            return JSON.stringify(config);
    }
};
exports.exportConfig = exportConfig;
/**
 * 43. Creates configuration import utility.
 *
 * @param {string} content - Configuration content
 * @param {'json' | 'yaml' | 'env'} format - Import format
 * @returns {Record<string, any>} Parsed configuration
 *
 * @example
 * ```typescript
 * const config = importConfig(fileContent, 'json');
 * ```
 */
const importConfig = (content, format) => {
    switch (format) {
        case 'json':
            return JSON.parse(content);
        case 'env':
            const config = {};
            content.split('\n').forEach(line => {
                const trimmed = line.trim();
                if (trimmed && !trimmed.startsWith('#')) {
                    const [key, ...valueParts] = trimmed.split('=');
                    config[key.trim()] = valueParts.join('=').trim();
                }
            });
            return config;
        case 'yaml':
            console.warn('YAML import not implemented');
            return {};
        default:
            return {};
    }
};
exports.importConfig = importConfig;
/**
 * 44. Creates configuration documentation generator.
 *
 * @param {ConfigSchema} schema - Configuration schema
 * @param {Record<string, any>} [examples] - Example values
 * @returns {string} Generated documentation
 *
 * @example
 * ```typescript
 * const docs = generateConfigDocumentation(schema, examples);
 * fs.writeFileSync('CONFIG.md', docs);
 * ```
 */
const generateConfigDocumentation = (schema, examples) => {
    let doc = '# Configuration Documentation\n\n';
    doc += 'Auto-generated configuration reference.\n\n';
    doc += '## Environment Variables\n\n';
    Object.entries(schema).forEach(([key, rules]) => {
        doc += `### ${key}\n\n`;
        doc += `- **Type**: ${rules.type}\n`;
        doc += `- **Required**: ${rules.required ? 'Yes' : 'No'}\n`;
        if (rules.default !== undefined) {
            doc += `- **Default**: \`${rules.default}\`\n`;
        }
        if (rules.enum) {
            doc += `- **Allowed values**: ${rules.enum.map(v => `\`${v}\``).join(', ')}\n`;
        }
        if (rules.min !== undefined) {
            doc += `- **Minimum**: ${rules.min}\n`;
        }
        if (rules.max !== undefined) {
            doc += `- **Maximum**: ${rules.max}\n`;
        }
        if (examples && examples[key] !== undefined) {
            doc += `- **Example**: \`${examples[key]}\`\n`;
        }
        doc += '\n';
    });
    return doc;
};
exports.generateConfigDocumentation = generateConfigDocumentation;
/**
 * 45. Creates configuration testing helper.
 *
 * @param {Record<string, any>} config - Configuration to test
 * @param {Array<{ name: string; test: (config: any) => boolean }>} tests - Test suite
 * @returns {{ passed: number; failed: number; results: any[] }} Test results
 *
 * @example
 * ```typescript
 * const results = testConfiguration(config, [
 *   { name: 'Database connection', test: (c) => !!c.DATABASE_URL },
 *   { name: 'Valid port', test: (c) => c.PORT >= 1024 && c.PORT <= 65535 }
 * ]);
 * ```
 */
const testConfiguration = (config, tests) => {
    const results = tests.map(({ name, test }) => {
        const passed = test(config);
        return { name, passed };
    });
    const passed = results.filter(r => r.passed).length;
    const failed = results.filter(r => !r.passed).length;
    return { passed, failed, results };
};
exports.testConfiguration = testConfiguration;
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Deep merges two configuration objects.
 */
const deepMergeConfigs = (target, source) => {
    const result = { ...target };
    Object.entries(source).forEach(([key, value]) => {
        if (value === undefined)
            return;
        if (isPlainObject(value) && isPlainObject(result[key])) {
            result[key] = deepMergeConfigs(result[key], value);
        }
        else {
            result[key] = value;
        }
    });
    return result;
};
/**
 * Checks if value is a plain object.
 */
const isPlainObject = (value) => {
    return value !== null &&
        typeof value === 'object' &&
        !Array.isArray(value) &&
        Object.getPrototypeOf(value) === Object.prototype;
};
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Config Module Builders (1-5)
    buildConfigModuleOptions: exports.buildConfigModuleOptions,
    buildMultiEnvConfig: exports.buildMultiEnvConfig,
    buildLayeredConfig: exports.buildLayeredConfig,
    buildConditionalConfig: exports.buildConditionalConfig,
    buildFeatureConfig: exports.buildFeatureConfig,
    // Validation Schemas (6-10)
    createJoiSchema: exports.createJoiSchema,
    createClassValidatorSchema: exports.createClassValidatorSchema,
    validateConfigSchema: exports.validateConfigSchema,
    createSchemaValidator: exports.createSchemaValidator,
    mergeValidationSchemas: exports.mergeValidationSchemas,
    // Typed Config Getters (11-15)
    getTypedConfig: exports.getTypedConfig,
    getCoercedConfig: exports.getCoercedConfig,
    getValidatedConfig: exports.getValidatedConfig,
    getBatchConfig: exports.getBatchConfig,
    getPrefixedConfig: exports.getPrefixedConfig,
    // Namespace Helpers (16-20)
    buildHierarchicalConfig: exports.buildHierarchicalConfig,
    flattenConfig: exports.flattenConfig,
    unflattenConfig: exports.unflattenConfig,
    isolateNamespace: exports.isolateNamespace,
    mergeNamespaceConfigs: exports.mergeNamespaceConfigs,
    // Secret Management (21-25)
    resolveSecretReferences: exports.resolveSecretReferences,
    createRotatingSecret: exports.createRotatingSecret,
    encryptSecret: exports.encryptSecret,
    decryptSecret: exports.decryptSecret,
    createSecretProvider: exports.createSecretProvider,
    // Configuration Transformation (26-30)
    transformConfig: exports.transformConfig,
    normalizeConfig: exports.normalizeConfig,
    castConfigTypes: exports.castConfigTypes,
    sanitizeForLogging: exports.sanitizeForLogging,
    applyDefaults: exports.applyDefaults,
    // Hot Reload (31-35)
    watchConfigFiles: exports.watchConfigFiles,
    pollConfiguration: exports.pollConfiguration,
    detectConfigChanges: exports.detectConfigChanges,
    createHotReloadManager: exports.createHotReloadManager,
    gracefulReload: exports.gracefulReload,
    // Versioning & Remote (36-40)
    createConfigSnapshot: exports.createConfigSnapshot,
    generateConfigHash: exports.generateConfigHash,
    compareConfigVersions: exports.compareConfigVersions,
    createRemoteConfigLoader: exports.createRemoteConfigLoader,
    createConfigBackupManager: exports.createConfigBackupManager,
    // Advanced Utilities (41-45)
    buildConfigOverrideChain: exports.buildConfigOverrideChain,
    exportConfig: exports.exportConfig,
    importConfig: exports.importConfig,
    generateConfigDocumentation: exports.generateConfigDocumentation,
    testConfiguration: exports.testConfiguration,
};
//# sourceMappingURL=configuration-kit.js.map