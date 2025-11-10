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
import { ConfigService, registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { FSWatcher } from 'fs';
/**
 * @interface EnvValidationOptions
 * @description Options for environment variable validation
 */
export interface EnvValidationOptions {
    /** Required environment variables */
    required?: string[];
    /** Optional environment variables with defaults */
    defaults?: Record<string, string>;
    /** Custom validation functions */
    validators?: Record<string, (value: string) => boolean>;
    /** Whether to throw on validation failure */
    throwOnError?: boolean;
    /** Whether to log validation results */
    logResults?: boolean;
}
/**
 * @interface EnvValidationResult
 * @description Result of environment variable validation
 */
export interface EnvValidationResult {
    /** Validation success status */
    valid: boolean;
    /** Missing required variables */
    missing: string[];
    /** Invalid variables */
    invalid: string[];
    /** Applied defaults */
    defaults: Record<string, string>;
    /** Error messages */
    errors: string[];
}
/**
 * @interface ConfigSchemaOptions
 * @description Options for creating configuration schemas
 */
export interface ConfigSchemaOptions {
    /** Schema type */
    type: 'joi' | 'class-validator';
    /** Schema definitions */
    schema: any;
    /** Validation options */
    validationOptions?: Joi.ValidationOptions | any;
    /** Whether to abort on first error */
    abortEarly?: boolean;
    /** Whether to allow unknown keys */
    allowUnknown?: boolean;
}
/**
 * @interface ConfigNamespaceOptions
 * @description Options for configuration namespaces
 */
export interface ConfigNamespaceOptions {
    /** Namespace name */
    name: string;
    /** Configuration factory function */
    factory: () => any | Promise<any>;
    /** Whether to cache the result */
    cache?: boolean;
    /** Dependencies for async factories */
    dependencies?: any[];
}
/**
 * @interface DynamicConfigSource
 * @description Configuration source for dynamic loading
 */
export interface DynamicConfigSource {
    /** Source type */
    type: 'file' | 'env' | 'remote' | 'vault' | 'database';
    /** Source location */
    location: string;
    /** Loader function */
    loader?: () => Promise<any>;
    /** Refresh interval in milliseconds */
    refreshInterval?: number;
    /** Whether to merge with existing config */
    merge?: boolean;
}
/**
 * @interface SecretProviderConfig
 * @description Configuration for secret providers
 */
export interface SecretProviderConfig {
    /** Provider type */
    provider: 'aws-secrets-manager' | 'azure-keyvault' | 'hashicorp-vault' | 'google-secret-manager';
    /** Region or location */
    region?: string;
    /** Secret identifier */
    secretId: string;
    /** Version or stage */
    version?: string;
    /** Cache duration in seconds */
    cacheDuration?: number;
    /** Custom endpoint */
    endpoint?: string;
    /** Credentials */
    credentials?: any;
}
/**
 * @interface FeatureFlagConfig
 * @description Feature flag configuration
 */
export interface FeatureFlagConfig {
    /** Flag name */
    name: string;
    /** Flag enabled status */
    enabled: boolean;
    /** Flag description */
    description?: string;
    /** Flag rollout percentage (0-100) */
    rollout?: number;
    /** Flag conditions */
    conditions?: Record<string, any>;
    /** Flag metadata */
    metadata?: Record<string, any>;
}
/**
 * @interface FeatureFlagProvider
 * @description Feature flag provider interface
 */
export interface FeatureFlagProvider {
    /** Get flag value */
    isEnabled(flagName: string, context?: any): boolean;
    /** Get all flags */
    getAllFlags(): Record<string, boolean>;
    /** Update flag */
    updateFlag(flagName: string, enabled: boolean): void;
    /** Evaluate flag with conditions */
    evaluateFlag(flagName: string, context: any): boolean;
}
/**
 * @interface EncryptionConfig
 * @description Configuration encryption settings
 */
export interface EncryptionConfig {
    /** Encryption algorithm */
    algorithm: string;
    /** Encryption key */
    key: string;
    /** Initialization vector */
    iv?: string;
    /** Input encoding */
    inputEncoding?: BufferEncoding;
    /** Output encoding */
    outputEncoding?: BufferEncoding;
}
/**
 * @interface EnvironmentConfig
 * @description Multi-environment configuration
 */
export interface EnvironmentConfig {
    /** Environment name */
    environment: 'development' | 'staging' | 'production' | 'test';
    /** Environment-specific settings */
    settings: Record<string, any>;
    /** Environment file paths */
    envFiles?: string[];
    /** Whether to validate on load */
    validate?: boolean;
    /** Environment variables prefix */
    envPrefix?: string;
}
/**
 * @interface ConfigCacheOptions
 * @description Configuration caching options
 */
export interface ConfigCacheOptions {
    /** Whether caching is enabled */
    enabled: boolean;
    /** Cache TTL in milliseconds */
    ttl?: number;
    /** Maximum cache size */
    maxSize?: number;
    /** Cache invalidation strategy */
    invalidation?: 'manual' | 'ttl' | 'onchange';
}
/**
 * @interface ConfigCacheEntry
 * @description Configuration cache entry
 */
export interface ConfigCacheEntry<T = any> {
    /** Cached value */
    value: T;
    /** Cache timestamp */
    timestamp: Date;
    /** Cache expiry time */
    expiresAt?: Date;
    /** Access count */
    accessCount: number;
}
/**
 * @interface ConfigWatchOptions
 * @description Configuration file watch options
 */
export interface ConfigWatchOptions {
    /** File paths to watch */
    paths: string[];
    /** Watch interval in milliseconds */
    interval?: number;
    /** Callback on change */
    onChange: (changes: ConfigChangeEvent) => void;
    /** Whether to reload immediately */
    immediate?: boolean;
    /** Debounce delay in milliseconds */
    debounce?: number;
}
/**
 * @interface ConfigChangeEvent
 * @description Configuration change event
 */
export interface ConfigChangeEvent {
    /** Changed file path */
    filePath: string;
    /** Change type */
    type: 'added' | 'modified' | 'deleted';
    /** Old configuration */
    oldConfig?: any;
    /** New configuration */
    newConfig?: any;
    /** Changed keys */
    changedKeys: string[];
    /** Timestamp */
    timestamp: Date;
}
/**
 * @interface ConfigVersionInfo
 * @description Configuration version information
 */
export interface ConfigVersionInfo {
    /** Version number */
    version: string;
    /** Version timestamp */
    timestamp: Date;
    /** Configuration checksum */
    checksum: string;
    /** Version metadata */
    metadata?: Record<string, any>;
    /** Migration path */
    migrationPath?: string;
}
/**
 * @interface TypeSafeConfigService
 * @description Type-safe configuration service interface
 */
export interface TypeSafeConfigService<T = any> {
    /** Get configuration value */
    get<K extends keyof T>(key: K): T[K];
    /** Get configuration value with default */
    getOrDefault<K extends keyof T>(key: K, defaultValue: T[K]): T[K];
    /** Get entire configuration */
    getAll(): T;
    /** Check if key exists */
    has(key: keyof T): boolean;
}
/**
 * @interface ConfigMergeOptions
 * @description Configuration merge options
 */
export interface ConfigMergeOptions {
    /** Merge strategy */
    strategy: 'shallow' | 'deep' | 'overwrite';
    /** Array merge behavior */
    arrayMerge?: 'replace' | 'concat' | 'unique';
    /** Whether to clone objects */
    clone?: boolean;
    /** Custom merger function */
    customMerger?: (target: any, source: any, key: string) => any;
}
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
export declare const validateRequiredEnvVars: (requiredVars: string[], throwOnError?: boolean) => EnvValidationResult;
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
export declare const parseEnvVar: <T = any>(varName: string, type?: "string" | "number" | "boolean" | "json", defaultValue?: T) => T;
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
export declare const validateEnvVarPattern: (varName: string, pattern: RegExp | string, errorMessage?: string) => boolean;
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
export declare const checkMissingEnvVars: (varNames: string[]) => string[];
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
export declare const validateEnvVarDependencies: (dependencies: Record<string, string[]>) => EnvValidationResult;
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
export declare const applyEnvVarDefaults: (defaults: Record<string, string>, overwrite?: boolean) => Record<string, string>;
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
export declare const createJoiValidationSchema: (schemaDefinition: Record<string, Joi.Schema>, options?: Joi.ValidationOptions) => Joi.ObjectSchema;
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
export declare const validateConfigWithJoi: (config: any, schema: Joi.ObjectSchema) => {
    value: any;
    error?: Joi.ValidationError;
};
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
export declare const createClassValidatorSchema: <T extends object>(ClassType: new () => T, config: Record<string, unknown>) => T;
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
export declare const mergeValidationSchemas: (schemas: Joi.ObjectSchema[]) => Joi.ObjectSchema;
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
export declare const generateSchemaFromTypes: (typeMap: Record<string, string>) => Joi.ObjectSchema;
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
export declare const validateNestedConfig: (config: any, schema: Joi.ObjectSchema, path?: string) => {
    valid: boolean;
    errors: string[];
};
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
export declare const createConfigNamespace: (namespace: string, factory: () => any) => ReturnType<typeof registerAs>;
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
export declare const createMultipleNamespaces: (namespaces: Record<string, () => any>) => Array<ReturnType<typeof registerAs>>;
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
export declare const getNamespacedConfig: <T = any>(configService: ConfigService, namespace: string, key: string, defaultValue?: T) => T;
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
export declare const getEntireNamespace: <T = any>(configService: ConfigService, namespace: string) => T;
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
export declare const mergeNamespaces: (configService: ConfigService, namespaces: string[]) => any;
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
export declare const loadConfigFromFile: (filePath: string, required?: boolean) => any;
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
export declare const loadConfigFromRemote: (url: string, options?: RequestInit) => Promise<any>;
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
export declare const createAsyncConfigFactory: (loader: () => Promise<any>, timeout?: number) => (() => Promise<any>);
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
export declare const loadConditionalConfig: (envConfigs: Record<string, () => any>, environment?: string) => any;
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
export declare const loadMultipleSources: (sources: DynamicConfigSource[]) => Promise<any>;
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
export declare const loadSecretsFromAWS: (secretName: string, region?: string) => Promise<Record<string, string>>;
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
export declare const loadSecretsFromAzure: (vaultUrl: string, secretName: string) => Promise<string>;
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
export declare const loadSecretsFromVault: (endpoint: string, token: string, secretPath: string) => Promise<Record<string, any>>;
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
export declare const injectSecretsIntoEnv: (secrets: Record<string, string>, prefix?: string) => void;
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
export declare const rotateSecrets: (config: SecretProviderConfig) => Promise<void>;
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
export declare const validateSecrets: (secrets: Record<string, string>, requirements: Record<string, RegExp>) => {
    valid: boolean;
    errors: string[];
};
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
export declare const createFeatureFlagProvider: (flags: Record<string, FeatureFlagConfig>) => FeatureFlagProvider;
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
export declare const loadFeatureFlags: (configService: ConfigService, namespace?: string) => Record<string, boolean>;
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
export declare const evaluateFeatureFlagRollout: (flagName: string, rolloutPercent: number, userId: string) => boolean;
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
export declare const createDynamicFeatureFlag: (flagName: string, initialValue: boolean) => {
    isEnabled: () => boolean;
    toggle: (value?: boolean) => void;
};
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
export declare const encryptConfigValue: (value: string, key: string, algorithm?: string) => string;
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
export declare const decryptConfigValue: (encryptedValue: string, key: string, algorithm?: string) => string;
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
export declare const hashConfigValue: (value: string, algorithm?: string) => string;
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
export declare const encryptConfigObject: (config: any, key: string, excludeKeys?: string[]) => any;
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
export declare const loadEnvironmentConfig: (baseDir: string, environment?: string) => any;
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
export declare const detectEnvironment: (sources?: string[]) => string;
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
export declare const validateEnvironmentConfig: (environment: string, requirements: Record<string, string[]>) => {
    valid: boolean;
    missing: string[];
};
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
export declare const validateAcrossEnvironments: (environments: string[], validator: (env: string) => boolean) => Record<string, boolean>;
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
export declare const createConfigCache: (options: ConfigCacheOptions) => {
    get<T>(key: string): T | undefined;
    set<T>(key: string, value: T): void;
    invalidate(key: string): void;
    clear(): void;
    size(): number;
};
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
export declare const invalidateCacheByPattern: (cache: Map<string, any>, pattern: RegExp | string) => number;
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
export declare const createCachedGetter: (loader: () => Promise<any>, ttl: number) => (() => Promise<any>);
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
export declare const watchConfigFile: (filePath: string, callback: (changes: ConfigChangeEvent) => void, debounce?: number) => FSWatcher;
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
export declare const createHotReloadConfig: (filePath: string, onReload: (config: any) => void) => {
    config: any;
    reload: () => void;
    stop: () => void;
};
//# sourceMappingURL=nestjs-configuration-management-kit.d.ts.map