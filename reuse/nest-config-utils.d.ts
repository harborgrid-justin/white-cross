/**
 * @fileoverview NestJS Configuration Management Utilities
 * @module reuse/nest-config-utils
 * @description Comprehensive configuration utilities for NestJS applications covering environment management,
 * validation, secret management, dynamic loading, caching, and type-safe access patterns.
 *
 * Key Features:
 * - ConfigModule setup and initialization helpers
 * - Environment variable loading and parsing
 * - Schema-based validation (Joi, class-validator)
 * - Multi-environment configuration management
 * - Secret management and encryption
 * - Configuration namespace utilities
 * - Dynamic and async configuration loaders
 * - Configuration caching and optimization
 * - Type-safe configuration getters
 * - File parsers (JSON, YAML, ENV, TOML)
 * - Configuration merging and composition
 * - Default value handling
 * - Hot-reload capabilities
 * - Configuration injection helpers
 * - Encrypted configuration support
 * - Documentation generation
 * - Testing utilities
 * - Remote configuration loaders (AWS, Azure, Consul)
 *
 * @target NestJS v11.x, Node 18+, TypeScript 5.x
 *
 * @security
 * - Supports encrypted environment variables
 * - AWS Secrets Manager integration
 * - Azure Key Vault support
 * - Secret rotation helpers
 * - HIPAA-compliant configuration validation
 * - Secure default values
 * - Configuration access auditing
 *
 * @example Basic usage
 * ```typescript
 * import { createConfigModule, loadEnvFile, validateConfigSchema } from './nest-config-utils';
 *
 * // Create config module
 * const configModule = createConfigModule({
 *   envFilePath: ['.env.local', '.env'],
 *   isGlobal: true,
 *   cache: true
 * });
 *
 * // Load and validate env file
 * const envVars = loadEnvFile('.env');
 * const isValid = validateConfigSchema(envVars, mySchema);
 * ```
 *
 * @example Advanced usage
 * ```typescript
 * import {
 *   createNamespaceConfig,
 *   loadSecretsFromAWS,
 *   createAsyncConfigFactory,
 *   createTypeGuard
 * } from './nest-config-utils';
 *
 * // Namespace configuration
 * const dbConfig = createNamespaceConfig('database', {
 *   host: process.env.DB_HOST,
 *   port: parseInt(process.env.DB_PORT, 10)
 * });
 *
 * // Load secrets
 * await loadSecretsFromAWS('my-app/production');
 *
 * // Async factory
 * const factory = createAsyncConfigFactory(async () => {
 *   return { apiKey: await fetchApiKey() };
 * });
 * ```
 *
 * LOC: CF45D8E912
 * UPSTREAM: @nestjs/config, @nestjs/common, joi, class-validator, yaml, aws-sdk
 * DOWNSTREAM: app.module.ts, *.config.ts, configuration services
 *
 * @version 1.0.0
 * @since 2025-11-08
 */
import { Type } from '@nestjs/common';
import { ConfigModuleOptions, ConfigFactory } from '@nestjs/config';
/**
 * @interface EnvLoadOptions
 * @description Options for loading environment files
 */
export interface EnvLoadOptions {
    /** Path to environment file */
    path?: string;
    /** Override existing environment variables */
    override?: boolean;
    /** Parse values as JSON when possible */
    parseJSON?: boolean;
    /** Required environment variables */
    required?: string[];
}
/**
 * @interface ConfigValidationResult
 * @description Result of configuration validation
 */
export interface ConfigValidationResult {
    /** Whether validation passed */
    valid: boolean;
    /** Validation errors if any */
    errors?: string[];
    /** Validated configuration */
    config?: Record<string, any>;
}
/**
 * @interface ConfigNamespaceOptions
 * @description Options for creating configuration namespaces
 */
export interface ConfigNamespaceOptions {
    /** Namespace name */
    namespace: string;
    /** Configuration factory */
    factory: () => Record<string, any> | Promise<Record<string, any>>;
    /** Whether to cache the configuration */
    cache?: boolean;
}
/**
 * @interface SecretConfig
 * @description Configuration for secret management
 */
export interface SecretConfig {
    /** Secret provider (aws, azure, vault, etc.) */
    provider: 'aws' | 'azure' | 'vault' | 'consul';
    /** Region or location */
    region?: string;
    /** Secret name or path */
    secretName: string;
    /** Cache duration in seconds */
    cacheDuration?: number;
}
/**
 * @interface ConfigCacheOptions
 * @description Options for configuration caching
 */
export interface ConfigCacheOptions {
    /** Cache TTL in milliseconds */
    ttl?: number;
    /** Maximum cache entries */
    maxSize?: number;
    /** Cache key prefix */
    prefix?: string;
}
/**
 * @interface ConfigMergeOptions
 * @description Options for merging configurations
 */
export interface ConfigMergeOptions {
    /** Deep merge strategy */
    deep?: boolean;
    /** Array merge strategy: 'replace', 'concat', 'merge' */
    arrayMerge?: 'replace' | 'concat' | 'merge';
    /** Skip undefined values */
    skipUndefined?: boolean;
}
/**
 * @interface HotReloadOptions
 * @description Options for hot-reloading configuration
 */
export interface HotReloadOptions {
    /** Files to watch */
    watchFiles: string[];
    /** Callback on reload */
    onReload?: (config: Record<string, any>) => void;
    /** Debounce delay in milliseconds */
    debounce?: number;
}
/**
 * @function createConfigModule
 * @description Creates a NestJS ConfigModule with common defaults for healthcare applications
 *
 * @param {Partial<ConfigModuleOptions>} options - Configuration module options
 * @returns {DynamicModule} Configured NestJS dynamic module
 *
 * @example
 * ```typescript
 * const configModule = createConfigModule({
 *   envFilePath: ['.env.local', '.env'],
 *   isGlobal: true,
 *   cache: true,
 *   expandVariables: true
 * });
 *
 * @Module({
 *   imports: [configModule]
 * })
 * export class AppModule {}
 * ```
 */
export declare function createConfigModule(options?: Partial<ConfigModuleOptions>): ConfigModuleOptions;
/**
 * @function getEnvFilePaths
 * @description Generates environment file paths based on NODE_ENV
 *
 * @param {string} nodeEnv - Node environment (development, staging, production)
 * @param {string} baseDir - Base directory for env files
 * @returns {string[]} Array of env file paths in priority order
 *
 * @example
 * ```typescript
 * const paths = getEnvFilePaths('production', '/app/config');
 * // Returns: [
 * //   '/app/config/.env.production.local',
 * //   '/app/config/.env.production',
 * //   '/app/config/.env.local',
 * //   '/app/config/.env'
 * // ]
 * ```
 */
export declare function getEnvFilePaths(nodeEnv?: string, baseDir?: string): string[];
/**
 * @function createGlobalConfigModule
 * @description Creates a global NestJS ConfigModule with validation
 *
 * @param {ConfigFactory[]} factories - Array of configuration factories
 * @param {any} validationSchema - Joi validation schema
 * @returns {ConfigModuleOptions} Global config module options
 *
 * @example
 * ```typescript
 * import * as Joi from 'joi';
 * import databaseConfig from './config/database.config';
 *
 * const schema = Joi.object({
 *   DATABASE_HOST: Joi.string().required(),
 *   DATABASE_PORT: Joi.number().default(5432)
 * });
 *
 * const configModule = createGlobalConfigModule([databaseConfig], schema);
 * ```
 */
export declare function createGlobalConfigModule(factories?: ConfigFactory[], validationSchema?: any): ConfigModuleOptions;
/**
 * @function loadEnvFile
 * @description Loads and parses environment variables from a file
 *
 * @param {string} filePath - Path to the environment file
 * @param {EnvLoadOptions} options - Loading options
 * @returns {Record<string, string>} Parsed environment variables
 *
 * @example
 * ```typescript
 * const envVars = loadEnvFile('.env.production', {
 *   required: ['DATABASE_URL', 'JWT_SECRET'],
 *   parseJSON: true
 * });
 * ```
 */
export declare function loadEnvFile(filePath: string, options?: EnvLoadOptions): Record<string, string>;
/**
 * @function parseEnvValue
 * @description Parses environment variable value to appropriate type
 *
 * @param {string} value - Raw environment variable value
 * @returns {any} Parsed value (string, number, boolean, or JSON)
 *
 * @example
 * ```typescript
 * parseEnvValue('true');      // Returns: true
 * parseEnvValue('42');        // Returns: 42
 * parseEnvValue('{"a":1}');  // Returns: { a: 1 }
 * parseEnvValue('text');      // Returns: 'text'
 * ```
 */
export declare function parseEnvValue(value: string): any;
/**
 * @function expandEnvVariables
 * @description Expands environment variable references like ${VAR_NAME}
 *
 * @param {string} value - Value containing variable references
 * @param {Record<string, string>} env - Environment variables object
 * @returns {string} Expanded value
 *
 * @example
 * ```typescript
 * const env = { DB_HOST: 'localhost', DB_PORT: '5432' };
 * const expanded = expandEnvVariables('${DB_HOST}:${DB_PORT}', env);
 * // Returns: 'localhost:5432'
 * ```
 */
export declare function expandEnvVariables(value: string, env?: Record<string, string>): string;
/**
 * @function loadEnvWithPriority
 * @description Loads environment variables from multiple files with priority
 *
 * @param {string[]} filePaths - Array of env file paths (highest priority first)
 * @returns {Record<string, string>} Merged environment variables
 *
 * @example
 * ```typescript
 * const envVars = loadEnvWithPriority([
 *   '.env.production.local',
 *   '.env.production',
 *   '.env'
 * ]);
 * ```
 */
export declare function loadEnvWithPriority(filePaths: string[]): Record<string, string>;
/**
 * @function validateConfigSchema
 * @description Validates configuration against a Joi schema
 *
 * @param {Record<string, any>} config - Configuration object
 * @param {any} schema - Joi validation schema
 * @returns {ConfigValidationResult} Validation result
 *
 * @example
 * ```typescript
 * import * as Joi from 'joi';
 *
 * const schema = Joi.object({
 *   PORT: Joi.number().port().required(),
 *   NODE_ENV: Joi.string().valid('development', 'production')
 * });
 *
 * const result = validateConfigSchema(process.env, schema);
 * if (!result.valid) {
 *   console.error('Config errors:', result.errors);
 * }
 * ```
 */
export declare function validateConfigSchema(config: Record<string, any>, schema: any): ConfigValidationResult;
/**
 * @function validateRequiredEnvVars
 * @description Validates that required environment variables are present
 *
 * @param {string[]} required - Array of required variable names
 * @param {Record<string, any>} env - Environment variables object
 * @throws {Error} If any required variables are missing
 *
 * @example
 * ```typescript
 * validateRequiredEnvVars([
 *   'DATABASE_URL',
 *   'JWT_SECRET',
 *   'REDIS_HOST'
 * ], process.env);
 * ```
 */
export declare function validateRequiredEnvVars(required: string[], env?: Record<string, any>): void;
/**
 * @function createJoiSchema
 * @description Creates a Joi schema for common configuration patterns
 *
 * @param {Record<string, any>} schemaDefinition - Schema definition object
 * @returns {any} Joi schema object
 *
 * @example
 * ```typescript
 * const schema = createJoiSchema({
 *   DATABASE_HOST: { type: 'string', required: true },
 *   DATABASE_PORT: { type: 'number', default: 5432 },
 *   DATABASE_SSL: { type: 'boolean', default: false }
 * });
 * ```
 */
export declare function createJoiSchema(schemaDefinition: Record<string, any>): any;
/**
 * @function validateConfigType
 * @description Type-safe configuration validation using TypeScript
 *
 * @template T
 * @param {unknown} config - Configuration to validate
 * @param {(config: any) => config is T} typeGuard - Type guard function
 * @returns {T} Typed configuration
 * @throws {Error} If validation fails
 *
 * @example
 * ```typescript
 * interface DbConfig {
 *   host: string;
 *   port: number;
 * }
 *
 * const isDbConfig = (config: any): config is DbConfig => {
 *   return typeof config.host === 'string' && typeof config.port === 'number';
 * };
 *
 * const dbConfig = validateConfigType<DbConfig>(rawConfig, isDbConfig);
 * ```
 */
export declare function validateConfigType<T>(config: unknown, typeGuard: (config: any) => config is T): T;
/**
 * @function createClassValidatorSchema
 * @description Creates a validation function using class-validator
 *
 * @param {Type<any>} validationClass - Class with validation decorators
 * @returns {(config: Record<string, unknown>) => any} Validation function
 *
 * @example
 * ```typescript
 * import { IsString, IsNumber, Min, Max } from 'class-validator';
 *
 * class EnvironmentVariables {
 *   @IsString()
 *   DATABASE_HOST: string;
 *
 *   @IsNumber()
 *   @Min(1024)
 *   @Max(65535)
 *   DATABASE_PORT: number;
 * }
 *
 * const validate = createClassValidatorSchema(EnvironmentVariables);
 * ```
 */
export declare function createClassValidatorSchema(validationClass: Type<any>): (config: Record<string, unknown>) => Record<string, unknown>;
/**
 * @function createTypeGuard
 * @description Creates a type guard function for configuration validation
 *
 * @template T
 * @param {Record<string, string>} typeMap - Map of property names to expected types
 * @returns {(config: any) => config is T} Type guard function
 *
 * @example
 * ```typescript
 * interface AppConfig {
 *   port: number;
 *   host: string;
 *   debug: boolean;
 * }
 *
 * const isAppConfig = createTypeGuard<AppConfig>({
 *   port: 'number',
 *   host: 'string',
 *   debug: 'boolean'
 * });
 *
 * if (isAppConfig(config)) {
 *   console.log(config.port); // Type-safe access
 * }
 * ```
 */
export declare function createTypeGuard<T>(typeMap: Record<string, string>): (config: any) => config is T;
/**
 * @function getEnvironment
 * @description Gets current environment with fallback
 *
 * @param {string} fallback - Fallback environment
 * @returns {string} Current environment
 *
 * @example
 * ```typescript
 * const env = getEnvironment('development');
 * // Returns: process.env.NODE_ENV || 'development'
 * ```
 */
export declare function getEnvironment(fallback?: string): string;
/**
 * @function isProduction
 * @description Checks if running in production environment
 *
 * @returns {boolean} True if production
 *
 * @example
 * ```typescript
 * if (isProduction()) {
 *   // Use production database
 * }
 * ```
 */
export declare function isProduction(): boolean;
/**
 * @function isDevelopment
 * @description Checks if running in development environment
 *
 * @returns {boolean} True if development
 *
 * @example
 * ```typescript
 * if (isDevelopment()) {
 *   // Enable debug logging
 * }
 * ```
 */
export declare function isDevelopment(): boolean;
/**
 * @function isTest
 * @description Checks if running in test environment
 *
 * @returns {boolean} True if test
 *
 * @example
 * ```typescript
 * if (isTest()) {
 *   // Use test database
 * }
 * ```
 */
export declare function isTest(): boolean;
/**
 * @function loadEnvironmentConfig
 * @description Loads configuration for specific environment
 *
 * @param {string} environment - Environment name
 * @param {string} configDir - Configuration directory
 * @returns {Record<string, any>} Environment-specific configuration
 *
 * @example
 * ```typescript
 * const prodConfig = loadEnvironmentConfig('production', './config');
 * // Loads ./config/production.json or ./config/production.js
 * ```
 */
export declare function loadEnvironmentConfig(environment: string, configDir?: string): Record<string, any>;
/**
 * @function encryptValue
 * @description Encrypts a configuration value using AES-256-GCM
 *
 * @param {string} value - Value to encrypt
 * @param {string} key - Encryption key (32 bytes)
 * @returns {string} Encrypted value in format: iv:authTag:encrypted
 *
 * @example
 * ```typescript
 * const encrypted = encryptValue('my-secret-password', process.env.ENCRYPTION_KEY);
 * ```
 */
export declare function encryptValue(value: string, key: string): string;
/**
 * @function decryptValue
 * @description Decrypts an encrypted configuration value
 *
 * @param {string} encryptedValue - Encrypted value from encryptValue
 * @param {string} key - Decryption key (32 bytes)
 * @returns {string} Decrypted value
 *
 * @example
 * ```typescript
 * const decrypted = decryptValue(encrypted, process.env.ENCRYPTION_KEY);
 * ```
 */
export declare function decryptValue(encryptedValue: string, key: string): string;
/**
 * @function generateEncryptionKey
 * @description Generates a secure encryption key for configuration
 *
 * @returns {string} Hex-encoded 256-bit encryption key
 *
 * @example
 * ```typescript
 * const key = generateEncryptionKey();
 * console.log('ENCRYPTION_KEY=' + key);
 * ```
 */
export declare function generateEncryptionKey(): string;
/**
 * @function maskSecret
 * @description Masks a secret value for logging (shows first/last chars)
 *
 * @param {string} secret - Secret to mask
 * @param {number} visibleChars - Number of visible chars at start/end
 * @returns {string} Masked secret
 *
 * @example
 * ```typescript
 * const masked = maskSecret('super-secret-api-key', 4);
 * // Returns: 'supe***********-key'
 * ```
 */
export declare function maskSecret(secret: string, visibleChars?: number): string;
/**
 * @function loadSecretsFromAWS
 * @description Loads secrets from AWS Secrets Manager (placeholder)
 *
 * @param {string} secretName - AWS secret name
 * @param {string} region - AWS region
 * @returns {Promise<Record<string, string>>} Secret values
 *
 * @example
 * ```typescript
 * const secrets = await loadSecretsFromAWS('white-cross/production', 'us-east-1');
 * process.env.DATABASE_PASSWORD = secrets.DATABASE_PASSWORD;
 * ```
 */
export declare function loadSecretsFromAWS(secretName: string, region?: string): Promise<Record<string, string>>;
/**
 * @function loadSecretsFromAzure
 * @description Loads secrets from Azure Key Vault (placeholder)
 *
 * @param {string} vaultUrl - Azure Key Vault URL
 * @param {string[]} secretNames - Secret names to retrieve
 * @returns {Promise<Record<string, string>>} Secret values
 *
 * @example
 * ```typescript
 * const secrets = await loadSecretsFromAzure(
 *   'https://my-vault.vault.azure.net',
 *   ['database-password', 'api-key']
 * );
 * ```
 */
export declare function loadSecretsFromAzure(vaultUrl: string, secretNames: string[]): Promise<Record<string, string>>;
/**
 * @function createNamespaceConfig
 * @description Creates a namespaced configuration factory
 *
 * @param {string} namespace - Namespace name
 * @param {() => Record<string, any>} factory - Configuration factory function
 * @returns {ConfigFactory} NestJS configuration factory
 *
 * @example
 * ```typescript
 * const databaseConfig = createNamespaceConfig('database', () => ({
 *   host: process.env.DATABASE_HOST,
 *   port: parseInt(process.env.DATABASE_PORT, 10),
 *   username: process.env.DATABASE_USERNAME
 * }));
 *
 * // Use in ConfigModule
 * ConfigModule.forRoot({
 *   load: [databaseConfig]
 * });
 *
 * // Access in service
 * const host = this.configService.get('database.host');
 * ```
 */
export declare function createNamespaceConfig(namespace: string, factory: () => Record<string, any>): ConfigFactory;
/**
 * @function getNamespacedValue
 * @description Gets a value from namespaced configuration
 *
 * @param {Record<string, any>} config - Configuration object
 * @param {string} namespace - Namespace
 * @param {string} key - Configuration key
 * @param {any} defaultValue - Default value if not found
 * @returns {any} Configuration value
 *
 * @example
 * ```typescript
 * const config = { database: { host: 'localhost', port: 5432 } };
 * const host = getNamespacedValue(config, 'database', 'host');
 * // Returns: 'localhost'
 * ```
 */
export declare function getNamespacedValue(config: Record<string, any>, namespace: string, key: string, defaultValue?: any): any;
/**
 * @function mergeNamespaces
 * @description Merges multiple namespaced configurations
 *
 * @param {Record<string, any>[]} configs - Array of configuration objects
 * @returns {Record<string, any>} Merged configuration
 *
 * @example
 * ```typescript
 * const baseConfig = { database: { host: 'localhost' } };
 * const envConfig = { database: { port: 5432 } };
 * const merged = mergeNamespaces([baseConfig, envConfig]);
 * // Returns: { database: { host: 'localhost', port: 5432 } }
 * ```
 */
export declare function mergeNamespaces(configs: Record<string, any>[]): Record<string, any>;
/**
 * @function createAsyncConfigFactory
 * @description Creates an async configuration factory
 *
 * @param {() => Promise<Record<string, any>>} factory - Async factory function
 * @returns {() => Promise<Record<string, any>>} Async configuration factory
 *
 * @example
 * ```typescript
 * const asyncConfig = createAsyncConfigFactory(async () => {
 *   const secrets = await loadSecretsFromAWS('my-app/config');
 *   return {
 *     apiKey: secrets.API_KEY,
 *     database: {
 *       password: secrets.DB_PASSWORD
 *     }
 *   };
 * });
 * ```
 */
export declare function createAsyncConfigFactory(factory: () => Promise<Record<string, any>>): () => Promise<Record<string, any>>;
/**
 * @function loadConfigFromRemote
 * @description Loads configuration from remote HTTP endpoint
 *
 * @param {string} url - Remote configuration URL
 * @param {Record<string, string>} headers - HTTP headers
 * @returns {Promise<Record<string, any>>} Remote configuration
 *
 * @example
 * ```typescript
 * const remoteConfig = await loadConfigFromRemote(
 *   'https://config.example.com/app/production',
 *   { 'Authorization': 'Bearer token' }
 * );
 * ```
 */
export declare function loadConfigFromRemote(url: string, headers?: Record<string, string>): Promise<Record<string, any>>;
/**
 * @function createConditionalConfig
 * @description Creates configuration that changes based on conditions
 *
 * @param {Record<string, () => any>} conditions - Map of condition to config factory
 * @param {string} defaultKey - Default condition key
 * @returns {() => any} Configuration factory
 *
 * @example
 * ```typescript
 * const config = createConditionalConfig({
 *   production: () => ({ logLevel: 'error', debug: false }),
 *   development: () => ({ logLevel: 'debug', debug: true })
 * }, 'development');
 * ```
 */
export declare function createConditionalConfig(conditions: Record<string, () => any>, defaultKey: string): () => any;
/**
 * @class ConfigCache
 * @description Simple configuration cache with TTL support
 *
 * @example
 * ```typescript
 * const cache = new ConfigCache({ ttl: 60000 }); // 1 minute TTL
 * cache.set('database.host', 'localhost');
 * const host = cache.get('database.host');
 * ```
 */
export declare class ConfigCache {
    private cache;
    private ttl;
    private prefix;
    constructor(options?: ConfigCacheOptions);
    /**
     * @method set
     * @description Sets a value in the cache
     *
     * @param {string} key - Cache key
     * @param {any} value - Value to cache
     * @param {number} ttl - TTL in milliseconds (optional)
     */
    set(key: string, value: any, ttl?: number): void;
    /**
     * @method get
     * @description Gets a value from the cache
     *
     * @param {string} key - Cache key
     * @returns {any} Cached value or undefined
     */
    get(key: string): any;
    /**
     * @method has
     * @description Checks if key exists in cache
     *
     * @param {string} key - Cache key
     * @returns {boolean} True if exists and not expired
     */
    has(key: string): boolean;
    /**
     * @method clear
     * @description Clears all cached entries
     */
    clear(): void;
    /**
     * @method purgeExpired
     * @description Removes expired entries
     */
    purgeExpired(): void;
}
/**
 * @function createCachedConfigGetter
 * @description Creates a cached configuration getter function
 *
 * @param {(key: string) => any} getter - Original getter function
 * @param {ConfigCacheOptions} options - Cache options
 * @returns {(key: string) => any} Cached getter function
 *
 * @example
 * ```typescript
 * const cachedGet = createCachedConfigGetter(
 *   (key) => configService.get(key),
 *   { ttl: 60000 }
 * );
 *
 * const host = cachedGet('database.host'); // Cached for 1 minute
 * ```
 */
export declare function createCachedConfigGetter(getter: (key: string) => any, options?: ConfigCacheOptions): (key: string) => any;
/**
 * @function getConfigValue
 * @description Type-safe configuration value getter with default
 *
 * @template T
 * @param {Record<string, any>} config - Configuration object
 * @param {string} path - Dot-notation path (e.g., 'database.host')
 * @param {T} defaultValue - Default value
 * @returns {T} Configuration value
 *
 * @example
 * ```typescript
 * const port = getConfigValue<number>(config, 'server.port', 3000);
 * const host = getConfigValue<string>(config, 'server.host', 'localhost');
 * ```
 */
export declare function getConfigValue<T>(config: Record<string, any>, path: string, defaultValue: T): T;
/**
 * @function getRequiredConfigValue
 * @description Gets a required configuration value (throws if missing)
 *
 * @template T
 * @param {Record<string, any>} config - Configuration object
 * @param {string} path - Dot-notation path
 * @returns {T} Configuration value
 * @throws {Error} If value is undefined or null
 *
 * @example
 * ```typescript
 * const secret = getRequiredConfigValue<string>(config, 'jwt.secret');
 * // Throws if jwt.secret is not set
 * ```
 */
export declare function getRequiredConfigValue<T>(config: Record<string, any>, path: string): T;
/**
 * @function createTypedConfigGetter
 * @description Creates a typed configuration getter function
 *
 * @template T
 * @param {Record<string, any>} config - Configuration object
 * @returns {(path: string, defaultValue?: T) => T} Typed getter function
 *
 * @example
 * ```typescript
 * const getNumber = createTypedConfigGetter<number>(config);
 * const port = getNumber('server.port', 3000);
 * ```
 */
export declare function createTypedConfigGetter<T>(config: Record<string, any>): (path: string, defaultValue?: T) => T;
/**
 * @function parseJSONConfig
 * @description Parses JSON configuration file
 *
 * @param {string} filePath - Path to JSON file
 * @returns {Record<string, any>} Parsed configuration
 *
 * @example
 * ```typescript
 * const config = parseJSONConfig('./config/production.json');
 * ```
 */
export declare function parseJSONConfig(filePath: string): Record<string, any>;
/**
 * @function parseYAMLConfig
 * @description Parses YAML configuration file (placeholder)
 *
 * @param {string} filePath - Path to YAML file
 * @returns {Record<string, any>} Parsed configuration
 *
 * @example
 * ```typescript
 * const config = parseYAMLConfig('./config/production.yaml');
 * ```
 */
export declare function parseYAMLConfig(filePath: string): Record<string, any>;
/**
 * @function parseINIConfig
 * @description Parses INI configuration file
 *
 * @param {string} filePath - Path to INI file
 * @returns {Record<string, any>} Parsed configuration
 *
 * @example
 * ```typescript
 * const config = parseINIConfig('./config/app.ini');
 * ```
 */
export declare function parseINIConfig(filePath: string): Record<string, any>;
/**
 * @function detectConfigFormat
 * @description Detects configuration file format from extension
 *
 * @param {string} filePath - Configuration file path
 * @returns {'json' | 'yaml' | 'yml' | 'ini' | 'env' | 'unknown'} File format
 *
 * @example
 * ```typescript
 * const format = detectConfigFormat('config.yaml');
 * // Returns: 'yaml'
 * ```
 */
export declare function detectConfigFormat(filePath: string): 'json' | 'yaml' | 'yml' | 'ini' | 'env' | 'unknown';
/**
 * @function loadConfigFile
 * @description Loads configuration file with automatic format detection
 *
 * @param {string} filePath - Configuration file path
 * @returns {Record<string, any>} Parsed configuration
 *
 * @example
 * ```typescript
 * const config = loadConfigFile('./config/production.json');
 * // Automatically detects JSON format and parses
 * ```
 */
export declare function loadConfigFile(filePath: string): Record<string, any>;
/**
 * @function mergeConfigs
 * @description Deep merges multiple configuration objects
 *
 * @param {Record<string, any>[]} configs - Array of configurations to merge
 * @param {ConfigMergeOptions} options - Merge options
 * @returns {Record<string, any>} Merged configuration
 *
 * @example
 * ```typescript
 * const merged = mergeConfigs([
 *   { database: { host: 'localhost', port: 5432 } },
 *   { database: { password: 'secret' } },
 *   { cache: { ttl: 3600 } }
 * ]);
 * // Returns: { database: { host: 'localhost', port: 5432, password: 'secret' }, cache: { ttl: 3600 } }
 * ```
 */
export declare function mergeConfigs(configs: Record<string, any>[], options?: ConfigMergeOptions): Record<string, any>;
/**
 * @function deepMerge
 * @description Deep merges source object into target
 *
 * @param {Record<string, any>} target - Target object
 * @param {Record<string, any>} source - Source object
 * @param {ConfigMergeOptions} options - Merge options
 * @returns {Record<string, any>} Merged object (mutates target)
 *
 * @example
 * ```typescript
 * const target = { a: 1, b: { c: 2 } };
 * const source = { b: { d: 3 }, e: 4 };
 * deepMerge(target, source);
 * // target is now: { a: 1, b: { c: 2, d: 3 }, e: 4 }
 * ```
 */
export declare function deepMerge(target: Record<string, any>, source: Record<string, any>, options?: ConfigMergeOptions): Record<string, any>;
/**
 * @function overrideConfig
 * @description Overrides configuration with environment-specific values
 *
 * @param {Record<string, any>} baseConfig - Base configuration
 * @param {Record<string, any>} overrides - Override values
 * @returns {Record<string, any>} Merged configuration
 *
 * @example
 * ```typescript
 * const base = { port: 3000, host: 'localhost' };
 * const prod = { host: 'api.example.com' };
 * const config = overrideConfig(base, prod);
 * // Returns: { port: 3000, host: 'api.example.com' }
 * ```
 */
export declare function overrideConfig(baseConfig: Record<string, any>, overrides: Record<string, any>): Record<string, any>;
/**
 * @function setDefaults
 * @description Sets default values for missing configuration keys
 *
 * @param {Record<string, any>} config - Configuration object
 * @param {Record<string, any>} defaults - Default values
 * @returns {Record<string, any>} Configuration with defaults applied
 *
 * @example
 * ```typescript
 * const config = { host: 'localhost' };
 * const withDefaults = setDefaults(config, {
 *   host: 'localhost',
 *   port: 3000,
 *   timeout: 5000
 * });
 * // Returns: { host: 'localhost', port: 3000, timeout: 5000 }
 * ```
 */
export declare function setDefaults(config: Record<string, any>, defaults: Record<string, any>): Record<string, any>;
/**
 * @function getWithDefault
 * @description Gets configuration value with type coercion and default
 *
 * @template T
 * @param {Record<string, any>} config - Configuration object
 * @param {string} key - Configuration key
 * @param {T} defaultValue - Default value
 * @param {(value: any) => T} coerce - Optional coercion function
 * @returns {T} Configuration value
 *
 * @example
 * ```typescript
 * const port = getWithDefault(
 *   process.env,
 *   'PORT',
 *   3000,
 *   (v) => parseInt(v, 10)
 * );
 * ```
 */
export declare function getWithDefault<T>(config: Record<string, any>, key: string, defaultValue: T, coerce?: (value: any) => T): T;
/**
 * @function generateConfigDocs
 * @description Generates markdown documentation for configuration
 *
 * @param {Record<string, any>} schema - Configuration schema
 * @param {Record<string, string>} descriptions - Key descriptions
 * @returns {string} Markdown documentation
 *
 * @example
 * ```typescript
 * const docs = generateConfigDocs(
 *   { DATABASE_HOST: 'string', DATABASE_PORT: 'number' },
 *   { DATABASE_HOST: 'Database hostname', DATABASE_PORT: 'Database port' }
 * );
 * ```
 */
export declare function generateConfigDocs(schema: Record<string, any>, descriptions: Record<string, string>): string;
/**
 * @function exportConfigTemplate
 * @description Exports a .env template file from schema
 *
 * @param {Record<string, any>} schema - Configuration schema
 * @param {Record<string, string>} descriptions - Key descriptions
 * @returns {string} .env template content
 *
 * @example
 * ```typescript
 * const template = exportConfigTemplate(
 *   { DATABASE_HOST: 'string', DATABASE_PORT: 'number' },
 *   { DATABASE_HOST: 'Database hostname' }
 * );
 * fs.writeFileSync('.env.template', template);
 * ```
 */
export declare function exportConfigTemplate(schema: Record<string, any>, descriptions: Record<string, string>): string;
/**
 * @function createTestConfig
 * @description Creates a test configuration with defaults
 *
 * @param {Partial<Record<string, any>>} overrides - Configuration overrides
 * @returns {Record<string, any>} Test configuration
 *
 * @example
 * ```typescript
 * const testConfig = createTestConfig({
 *   DATABASE_HOST: 'localhost',
 *   DATABASE_PORT: 5433 // Override default
 * });
 * ```
 */
export declare function createTestConfig(overrides?: Partial<Record<string, any>>): Record<string, any>;
/**
 * @function validateTestConfig
 * @description Validates that test configuration doesn't use production values
 *
 * @param {Record<string, any>} config - Configuration to validate
 * @throws {Error} If production values detected
 *
 * @example
 * ```typescript
 * validateTestConfig(testConfig);
 * // Throws if NODE_ENV is 'production'
 * ```
 */
export declare function validateTestConfig(config: Record<string, any>): void;
/**
 * @function mockConfigService
 * @description Creates a mock ConfigService for testing
 *
 * @param {Record<string, any>} config - Mock configuration values
 * @returns {any} Mock ConfigService instance
 *
 * @example
 * ```typescript
 * const configService = mockConfigService({
 *   'database.host': 'localhost',
 *   'database.port': 5432
 * });
 *
 * expect(configService.get('database.host')).toBe('localhost');
 * ```
 */
export declare function mockConfigService(config: Record<string, any>): any;
/**
 * @function loadConfigFromConsul
 * @description Loads configuration from HashiCorp Consul (placeholder)
 *
 * @param {string} consulUrl - Consul URL
 * @param {string} keyPath - Configuration key path
 * @returns {Promise<Record<string, any>>} Configuration from Consul
 *
 * @example
 * ```typescript
 * const config = await loadConfigFromConsul(
 *   'http://consul.example.com:8500',
 *   'white-cross/production'
 * );
 * ```
 */
export declare function loadConfigFromConsul(consulUrl: string, keyPath: string): Promise<Record<string, any>>;
/**
 * @function createRemoteConfigLoader
 * @description Creates a remote configuration loader with caching
 *
 * @param {() => Promise<Record<string, any>>} loader - Async loader function
 * @param {number} refreshInterval - Refresh interval in milliseconds
 * @returns {() => Promise<Record<string, any>>} Cached loader function
 *
 * @example
 * ```typescript
 * const loader = createRemoteConfigLoader(
 *   () => loadConfigFromRemote('https://config.example.com'),
 *   300000 // Refresh every 5 minutes
 * );
 *
 * const config = await loader();
 * ```
 */
export declare function createRemoteConfigLoader(loader: () => Promise<Record<string, any>>, refreshInterval?: number): () => Promise<Record<string, any>>;
/**
 * @constant DEFAULT_CONFIG_OPTIONS
 * @description Default configuration module options
 */
export declare const DEFAULT_CONFIG_OPTIONS: ConfigModuleOptions;
/**
 * @constant COMMON_ENV_VARS
 * @description Common environment variable names for healthcare apps
 */
export declare const COMMON_ENV_VARS: {
    readonly NODE_ENV: "NODE_ENV";
    readonly PORT: "PORT";
    readonly API_PREFIX: "API_PREFIX";
    readonly DATABASE_HOST: "DATABASE_HOST";
    readonly DATABASE_PORT: "DATABASE_PORT";
    readonly DATABASE_USERNAME: "DATABASE_USERNAME";
    readonly DATABASE_PASSWORD: "DATABASE_PASSWORD";
    readonly DATABASE_NAME: "DATABASE_NAME";
    readonly DATABASE_SSL: "DATABASE_SSL";
    readonly REDIS_HOST: "REDIS_HOST";
    readonly REDIS_PORT: "REDIS_PORT";
    readonly REDIS_PASSWORD: "REDIS_PASSWORD";
    readonly JWT_SECRET: "JWT_SECRET";
    readonly JWT_EXPIRES_IN: "JWT_EXPIRES_IN";
    readonly JWT_REFRESH_EXPIRES_IN: "JWT_REFRESH_EXPIRES_IN";
    readonly AWS_REGION: "AWS_REGION";
    readonly AWS_ACCESS_KEY_ID: "AWS_ACCESS_KEY_ID";
    readonly AWS_SECRET_ACCESS_KEY: "AWS_SECRET_ACCESS_KEY";
    readonly AWS_S3_BUCKET: "AWS_S3_BUCKET";
    readonly SENTRY_DSN: "SENTRY_DSN";
    readonly LOG_LEVEL: "LOG_LEVEL";
};
//# sourceMappingURL=nest-config-utils.d.ts.map