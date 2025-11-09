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
import { Model, Sequelize, CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';
import * as Joi from 'joi';
import { FSWatcher } from 'fs';
/**
 * @interface EnvLoadOptions
 * @description Options for environment variable loading
 */
export interface EnvLoadOptions {
    /** Environment file paths in priority order */
    paths?: string[];
    /** Whether to override existing env vars */
    override?: boolean;
    /** Encoding for env files */
    encoding?: BufferEncoding;
    /** Whether to expand variables */
    expand?: boolean;
    /** Whether to validate after loading */
    validate?: boolean;
    /** Validation schema */
    schema?: Joi.ObjectSchema;
}
/**
 * @interface EnvLoadResult
 * @description Result of environment variable loading
 */
export interface EnvLoadResult {
    /** Loading success status */
    success: boolean;
    /** Loaded variables count */
    loaded: number;
    /** Loaded file paths */
    loadedFiles: string[];
    /** Failed file paths */
    failedFiles: string[];
    /** Validation errors */
    validationErrors: string[];
    /** Parsed variables */
    variables: Record<string, string>;
}
/**
 * @interface TypedEnvOptions
 * @description Options for typed environment variable parsing
 */
export interface TypedEnvOptions<T = any> {
    /** Variable name */
    name: string;
    /** Expected type */
    type: 'string' | 'number' | 'boolean' | 'json' | 'array' | 'url' | 'email';
    /** Default value */
    defaultValue?: T;
    /** Required flag */
    required?: boolean;
    /** Validation function */
    validator?: (value: T) => boolean;
    /** Transformation function */
    transform?: (value: string) => T;
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
    /** Rotation interval in milliseconds */
    rotationInterval?: number;
}
/**
 * @interface SecretRotationConfig
 * @description Configuration for secret rotation
 */
export interface SecretRotationConfig extends SecretProviderConfig {
    /** Rotation interval in milliseconds */
    rotationInterval: number;
    /** Callback on rotation */
    onRotate?: (secrets: Record<string, string>) => void | Promise<void>;
    /** Rotation retry attempts */
    retryAttempts?: number;
    /** Rotation retry delay */
    retryDelay?: number;
}
/**
 * @interface FeatureFlagAttributes
 * @description Feature flag database attributes
 */
export interface FeatureFlagAttributes {
    /** Flag unique identifier */
    id: string;
    /** Flag name */
    name: string;
    /** Flag description */
    description?: string;
    /** Flag enabled status */
    enabled: boolean;
    /** Rollout percentage (0-100) */
    rollout?: number;
    /** Flag conditions as JSON */
    conditions?: Record<string, any>;
    /** Flag metadata */
    metadata?: Record<string, any>;
    /** Tenant ID for multi-tenancy */
    tenantId?: string;
    /** Environment */
    environment: string;
    /** Created timestamp */
    createdAt?: Date;
    /** Updated timestamp */
    updatedAt?: Date;
}
/**
 * @interface ConfigHistoryAttributes
 * @description Configuration history database attributes
 */
export interface ConfigHistoryAttributes {
    /** History entry ID */
    id: string;
    /** Configuration key/namespace */
    configKey: string;
    /** Configuration version */
    version: string;
    /** Configuration data as JSON */
    configData: Record<string, any>;
    /** Configuration checksum */
    checksum: string;
    /** Change author */
    author?: string;
    /** Change reason */
    reason?: string;
    /** Environment */
    environment: string;
    /** Tags */
    tags?: string[];
    /** Created timestamp */
    createdAt?: Date;
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
    /** Change author */
    author?: string;
    /** Change reason */
    reason?: string;
}
/**
 * @interface RemoteConfigOptions
 * @description Options for remote configuration fetching
 */
export interface RemoteConfigOptions {
    /** Remote config URL */
    url: string;
    /** HTTP method */
    method?: 'GET' | 'POST';
    /** Request headers */
    headers?: Record<string, string>;
    /** Request timeout in milliseconds */
    timeout?: number;
    /** Retry attempts */
    retryAttempts?: number;
    /** Retry delay */
    retryDelay?: number;
    /** Authentication token */
    authToken?: string;
    /** Whether to cache */
    cache?: boolean;
    /** Cache TTL */
    cacheTTL?: number;
}
/**
 * @interface ConfigWatchOptions
 * @description Configuration file watch options
 */
export interface ConfigWatchOptions {
    /** File paths to watch */
    paths: string[];
    /** Debounce delay in milliseconds */
    debounce?: number;
    /** Callback on change */
    onChange: (event: ConfigChangeEvent) => void | Promise<void>;
    /** Whether to reload immediately */
    immediate?: boolean;
    /** File encoding */
    encoding?: BufferEncoding;
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
 * @interface EncryptionConfig
 * @description Configuration encryption settings
 */
export interface EncryptionConfig {
    /** Encryption algorithm */
    algorithm: 'aes-256-gcm' | 'aes-256-cbc' | 'chacha20-poly1305';
    /** Encryption key */
    key: string | Buffer;
    /** Additional authenticated data */
    aad?: Buffer;
    /** Tag length for GCM */
    tagLength?: number;
}
/**
 * @interface ConfigDocOptions
 * @description Configuration documentation generation options
 */
export interface ConfigDocOptions {
    /** Output format */
    format: 'markdown' | 'html' | 'json';
    /** Include examples */
    includeExamples?: boolean;
    /** Include types */
    includeTypes?: boolean;
    /** Include defaults */
    includeDefaults?: boolean;
    /** Group by namespace */
    groupByNamespace?: boolean;
}
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
export declare class FeatureFlagModel extends Model<InferAttributes<FeatureFlagModel>, InferCreationAttributes<FeatureFlagModel>> {
    id: CreationOptional<string>;
    name: string;
    description: CreationOptional<string | null>;
    enabled: boolean;
    rollout: CreationOptional<number | null>;
    conditions: CreationOptional<Record<string, any> | null>;
    metadata: CreationOptional<Record<string, any> | null>;
    tenantId: CreationOptional<string | null>;
    environment: string;
    readonly createdAt: CreationOptional<Date>;
    readonly updatedAt: CreationOptional<Date>;
}
/**
 * Initializes the FeatureFlagModel with Sequelize instance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof FeatureFlagModel} Initialized model
 */
export declare const initFeatureFlagModel: (sequelize: Sequelize) => typeof FeatureFlagModel;
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
export declare class ConfigHistoryModel extends Model<InferAttributes<ConfigHistoryModel>, InferCreationAttributes<ConfigHistoryModel>> {
    id: CreationOptional<string>;
    configKey: string;
    version: string;
    configData: Record<string, any>;
    checksum: string;
    author: CreationOptional<string | null>;
    reason: CreationOptional<string | null>;
    environment: string;
    tags: CreationOptional<string[] | null>;
    readonly createdAt: CreationOptional<Date>;
}
/**
 * Initializes the ConfigHistoryModel with Sequelize instance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof ConfigHistoryModel} Initialized model
 */
export declare const initConfigHistoryModel: (sequelize: Sequelize) => typeof ConfigHistoryModel;
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
export declare const loadEnvWithValidation: (paths: string[], options?: Partial<EnvLoadOptions>) => EnvLoadResult;
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
export declare const parseTypedEnvVar: <T = any>(name: string, type: "string" | "number" | "boolean" | "json" | "array" | "url" | "email", defaultValue?: T) => T;
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
export declare const validateEnvSchema: (schema: Joi.ObjectSchema, env?: Record<string, any>) => {
    valid: boolean;
    errors: string[];
    value: any;
};
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
export declare const loadEnvHierarchical: (environment?: string, baseDir?: string) => EnvLoadResult;
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
export declare const expandEnvVariables: (env: Record<string, string>) => Record<string, string>;
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
export declare const validateEnvDependencies: (dependencies: Record<string, string[]>, constraints?: Record<string, (value: string) => boolean>) => {
    valid: boolean;
    errors: string[];
};
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
export declare const sanitizeEnvVariables: (env: Record<string, string>, sensitiveKeys?: string[]) => Record<string, string>;
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
export declare const createComprehensiveSchema: (schemas: Record<string, Joi.Schema>) => Joi.ObjectSchema;
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
export declare const validateConfigWithDecorators: <T extends object>(ClassType: new () => T, config: Record<string, any>) => {
    valid: boolean;
    errors: string[];
    instance: T;
};
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
export declare const createRuntimeValidator: (rules: Record<string, (value: any) => boolean | string>) => ((config: any) => {
    valid: boolean;
    errors: string[];
});
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
export declare const validateConfigWithJsonSchema: (config: any, jsonSchema: Record<string, any>) => {
    valid: boolean;
    errors: string[];
};
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
export declare const mergeValidationSchemas: (schemas: Joi.ObjectSchema[], strategy?: "strict" | "permissive") => Joi.ObjectSchema;
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
export declare const loadEnvironmentSpecificConfig: (environment?: string, configDir?: string) => Record<string, any>;
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
export declare const createEnvironmentAwareFactory: (factories: Record<string, () => any>) => (() => any);
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
export declare const validateEnvironmentRequirements: (environment: string, requirements: Record<string, string[]>) => {
    valid: boolean;
    missing: string[];
};
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
export declare const applyEnvironmentOverrides: (baseConfig: Record<string, any>, overrides: Record<string, Record<string, any>>, environment?: string) => Record<string, any>;
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
export declare const loadSecretsFromVaultProvider: (config: SecretProviderConfig) => Promise<Record<string, string>>;
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
export declare const rotateSecretsWithCallback: (config: SecretRotationConfig, callback: (secrets: Record<string, string>) => void | Promise<void>) => Promise<NodeJS.Timer>;
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
export declare const cacheSecrets: (key: string, secrets: Record<string, string>, ttl: number) => void;
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
export declare const getCachedSecrets: (key: string, loader: () => Promise<Record<string, string>>) => Promise<Record<string, string>>;
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
export declare const validateSecretFormat: (secrets: Record<string, string>, rules: Record<string, {
    pattern?: RegExp;
    minLength?: number;
    maxLength?: number;
}>) => {
    valid: boolean;
    errors: string[];
};
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
export declare const loadFeatureFlagsFromDB: (environment?: string, tenantId?: string) => Promise<Record<string, FeatureFlagAttributes>>;
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
export declare const evaluateFeatureFlag: (flagName: string, context?: Record<string, any>, environment?: string) => Promise<boolean>;
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
export declare const updateFeatureFlagInDB: (flagName: string, updates: Partial<FeatureFlagAttributes>, environment?: string) => Promise<FeatureFlagAttributes>;
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
export declare const createFeatureFlag: (flagData: Omit<FeatureFlagAttributes, "id" | "createdAt" | "updatedAt">) => Promise<FeatureFlagAttributes>;
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
export declare const bulkUpdateFeatureFlags: (updates: Record<string, Partial<FeatureFlagAttributes>>, environment?: string) => Promise<FeatureFlagAttributes[]>;
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
export declare const watchConfigurationFiles: (options: ConfigWatchOptions) => FSWatcher[];
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
export declare const createHotReloadProvider: (filePath: string, onReload: (config: any) => void | Promise<void>) => {
    getConfig: () => any;
    reload: () => Promise<void>;
    stop: () => void;
};
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
export declare const hotSwapConfiguration: (loader: () => Promise<any>, validator: (config: any) => Promise<boolean>) => Promise<{
    success: boolean;
    config?: any;
    error?: string;
}>;
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
export declare const encryptConfigValueGCM: (value: string, config: EncryptionConfig) => string;
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
export declare const decryptConfigValueGCM: (encryptedValue: string, config: EncryptionConfig) => string;
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
export declare const encryptConfigObjectRecursive: (config: Record<string, any>, encryptionConfig: EncryptionConfig, excludeKeys?: string[]) => Record<string, any>;
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
export declare const saveConfigVersion: (configKey: string, configData: Record<string, any>, metadata?: Partial<ConfigHistoryAttributes>) => Promise<ConfigHistoryAttributes>;
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
export declare const getConfigVersion: (configKey: string, version: string, environment?: string) => Promise<ConfigHistoryAttributes | null>;
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
export declare const listConfigVersions: (configKey: string, environment?: string, limit?: number) => Promise<ConfigHistoryAttributes[]>;
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
export declare const rollbackToVersion: (configKey: string, version: string, environment?: string) => Promise<Record<string, any>>;
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
export declare const compareConfigVersions: (configKey: string, version1: string, version2: string, environment?: string) => Promise<{
    added: string[];
    removed: string[];
    modified: string[];
}>;
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
export declare const createTypeSafeConfigService: <T extends Record<string, any>>(schema: T, config: Record<string, any>) => {
    get: <K extends keyof T>(key: K) => T[K];
    getAll: () => T;
};
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
export declare const getNestedConfigValue: <T = any>(config: Record<string, any>, path: string, defaultValue?: T) => T;
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
export declare const validateConfigurationOnStartup: (schema: Joi.ObjectSchema, config?: Record<string, any>, throwOnError?: boolean) => Promise<{
    valid: boolean;
    errors: string[];
}>;
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
export declare const fetchRemoteConfiguration: (options: RemoteConfigOptions) => Promise<Record<string, any>>;
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
export declare const generateConfigDocumentation: (config: Record<string, any>, options: ConfigDocOptions) => string;
//# sourceMappingURL=config-environment-kit.d.ts.map