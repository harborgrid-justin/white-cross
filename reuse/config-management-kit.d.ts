/**
 * @fileoverview Advanced Configuration Management Kit
 * @module reuse/config-management-kit
 * @description Comprehensive configuration management utilities for NestJS applications covering
 * advanced environment variable parsing, validation, namespace factories, dynamic loading, secret
 * management, feature flags, multi-environment support, encryption, change detection, type-safe
 * access, default handling, config file formats, and caching strategies.
 *
 * Key Features:
 * - Advanced environment variable parsing with type inference
 * - Multi-format configuration file support (JSON, YAML, TOML, ENV)
 * - Schema-based validation with multiple validation engines
 * - Namespace-based configuration organization and hierarchies
 * - Dynamic configuration loading from multiple sources
 * - Secret management with rotation and encryption
 * - Feature flag management with A/B testing support
 * - Multi-environment configuration with inheritance
 * - Configuration encryption and decryption
 * - Change detection and hot reload
 * - Type-safe configuration access
 * - Smart default value handling
 * - Configuration caching and memoization
 * - Configuration migration and versioning
 *
 * @target NestJS v11.x, Node 18+, TypeScript 5.x
 *
 * @security
 * - Encrypted configuration storage
 * - Secret rotation support
 * - Audit logging for configuration access
 * - HIPAA-compliant security defaults
 * - Configuration validation and sanitization
 * - Secure secret injection patterns
 *
 * @example Basic usage
 * ```typescript
 * import {
 *   parseEnvArray,
 *   parseEnvObject,
 *   createConfigHierarchy,
 *   loadYAMLConfig
 * } from './config-management-kit';
 *
 * // Parse complex environment variables
 * const hosts = parseEnvArray('DATABASE_HOSTS', ',');
 * const dbConfig = parseEnvObject('DATABASE_CONFIG');
 *
 * // Create configuration hierarchy
 * const config = createConfigHierarchy(['default', 'production', 'local']);
 * ```
 *
 * @example Advanced usage
 * ```typescript
 * import {
 *   createConfigSchema,
 *   watchMultipleConfigs,
 *   createFeatureFlagService,
 *   rotateSecretsScheduled
 * } from './config-management-kit';
 *
 * // Create validation schema
 * const schema = createConfigSchema({
 *   database: { host: 'string', port: 'number' }
 * });
 *
 * // Watch multiple config files
 * watchMultipleConfigs(['app.json', 'db.json'], (changes) => {
 *   console.log('Configs changed:', changes);
 * });
 *
 * // Create feature flag service
 * const flags = createFeatureFlagService({
 *   newUI: { enabled: true, rollout: 50 }
 * });
 * ```
 *
 * LOC: WC-CFGMGMT-KIT-2025
 * UPSTREAM: @nestjs/config, @nestjs/common, joi, class-validator, yaml, dotenv
 * DOWNSTREAM: Application modules, services, configuration providers
 *
 * @version 1.0.0
 * @since 2025-11-08
 */
import { ConfigService } from '@nestjs/config';
/**
 * @interface ConfigParseOptions
 * @description Options for parsing configuration values
 */
export interface ConfigParseOptions {
    /** Type to parse to */
    type?: 'string' | 'number' | 'boolean' | 'json' | 'array' | 'object';
    /** Default value if parsing fails */
    defaultValue?: any;
    /** Separator for array parsing */
    separator?: string;
    /** Whether to throw on parse error */
    throwOnError?: boolean;
    /** Transform function */
    transform?: (value: any) => any;
}
/**
 * @interface ConfigValidationRule
 * @description Configuration validation rule
 */
export interface ConfigValidationRule {
    /** Field path (dot notation) */
    path: string;
    /** Validation type */
    type: 'required' | 'pattern' | 'range' | 'enum' | 'custom';
    /** Validation value */
    value?: any;
    /** Error message */
    message?: string;
    /** Custom validator function */
    validator?: (value: any) => boolean;
}
/**
 * @interface ConfigHierarchyOptions
 * @description Options for configuration hierarchy
 */
export interface ConfigHierarchyOptions {
    /** Base directory for config files */
    baseDir?: string;
    /** File extension */
    extension?: string;
    /** Merge strategy */
    mergeStrategy?: 'deep' | 'shallow' | 'replace';
    /** Whether to validate each level */
    validate?: boolean;
}
/**
 * @interface ConfigLoaderOptions
 * @description Options for configuration loader
 */
export interface ConfigLoaderOptions {
    /** Source type */
    source: 'file' | 'env' | 'remote' | 'vault' | 'consul' | 'etcd';
    /** Source location */
    location: string;
    /** Format */
    format?: 'json' | 'yaml' | 'toml' | 'env' | 'ini';
    /** Refresh interval in ms */
    refreshInterval?: number;
    /** Cache duration in ms */
    cacheDuration?: number;
    /** Error handling strategy */
    onError?: 'throw' | 'warn' | 'ignore';
}
/**
 * @interface FeatureFlagOptions
 * @description Feature flag configuration options
 */
export interface FeatureFlagOptions {
    /** Flag enabled status */
    enabled: boolean;
    /** Rollout percentage (0-100) */
    rollout?: number;
    /** Start date for flag */
    startDate?: Date;
    /** End date for flag */
    endDate?: Date;
    /** Target user segments */
    segments?: string[];
    /** Conditions */
    conditions?: Record<string, any>;
    /** Metadata */
    metadata?: Record<string, any>;
}
/**
 * @interface SecretRotationConfig
 * @description Secret rotation configuration
 */
export interface SecretRotationConfig {
    /** Rotation interval in milliseconds */
    interval: number;
    /** Secret provider */
    provider: string;
    /** Secret identifier */
    secretId: string;
    /** Notification callback */
    onRotate?: (oldSecret: string, newSecret: string) => void;
    /** Error callback */
    onError?: (error: Error) => void;
}
/**
 * @interface ConfigMigration
 * @description Configuration migration definition
 */
export interface ConfigMigration {
    /** Migration version */
    version: string;
    /** Description */
    description: string;
    /** Migration function */
    up: (config: any) => any;
    /** Rollback function */
    down?: (config: any) => any;
}
/**
 * @interface ConfigSnapshot
 * @description Configuration snapshot for versioning
 */
export interface ConfigSnapshot {
    /** Snapshot timestamp */
    timestamp: Date;
    /** Configuration version */
    version: string;
    /** Configuration data */
    config: any;
    /** Snapshot checksum */
    checksum: string;
    /** Environment */
    environment: string;
}
/**
 * @interface TypeSafeConfigOptions
 * @description Options for type-safe configuration
 */
export interface TypeSafeConfigOptions<T> {
    /** Configuration schema */
    schema: T;
    /** Validation function */
    validate?: (config: any) => boolean;
    /** Default values */
    defaults?: Partial<T>;
    /** Strict mode */
    strict?: boolean;
}
/**
 * 1. Parses environment variable as array with custom separator.
 *
 * @param {string} varName - Environment variable name
 * @param {string} separator - Array item separator
 * @param {any[]} defaultValue - Default array value
 * @returns {string[]} Parsed array
 *
 * @example
 * ```typescript
 * // DATABASE_HOSTS=host1,host2,host3
 * const hosts = parseEnvArray('DATABASE_HOSTS', ',');
 * // ['host1', 'host2', 'host3']
 *
 * // ALLOWED_ORIGINS=http://localhost:3000|https://app.example.com
 * const origins = parseEnvArray('ALLOWED_ORIGINS', '|');
 * ```
 */
export declare const parseEnvArray: (varName: string, separator?: string, defaultValue?: string[]) => string[];
/**
 * 2. Parses environment variable as JSON object with error handling.
 *
 * @param {string} varName - Environment variable name
 * @param {any} defaultValue - Default object value
 * @returns {any} Parsed object
 *
 * @example
 * ```typescript
 * // DATABASE_CONFIG={"host":"localhost","port":5432}
 * const dbConfig = parseEnvObject('DATABASE_CONFIG');
 * // { host: 'localhost', port: 5432 }
 *
 * // FEATURE_FLAGS={"newUI":true,"betaFeatures":false}
 * const flags = parseEnvObject('FEATURE_FLAGS', {});
 * ```
 */
export declare const parseEnvObject: <T = any>(varName: string, defaultValue?: T) => T;
/**
 * 3. Parses environment variable with automatic type inference.
 *
 * @param {string} varName - Environment variable name
 * @param {ConfigParseOptions} options - Parse options
 * @returns {any} Parsed value with inferred type
 *
 * @example
 * ```typescript
 * const port = parseEnvAuto('PORT', { type: 'number', defaultValue: 3000 });
 * const debug = parseEnvAuto('DEBUG', { type: 'boolean' });
 * const hosts = parseEnvAuto('HOSTS', { type: 'array', separator: ',' });
 * ```
 */
export declare const parseEnvAuto: (varName: string, options?: ConfigParseOptions) => any;
/**
 * 4. Parses environment variable as URL with validation.
 *
 * @param {string} varName - Environment variable name
 * @param {string} defaultValue - Default URL
 * @returns {URL} Parsed URL object
 *
 * @example
 * ```typescript
 * const apiUrl = parseEnvURL('API_URL', 'http://localhost:3000');
 * console.log(apiUrl.hostname); // 'localhost'
 * console.log(apiUrl.port); // '3000'
 * ```
 */
export declare const parseEnvURL: (varName: string, defaultValue?: string) => URL;
/**
 * 5. Parses environment variable as duration (ms, s, m, h, d).
 *
 * @param {string} varName - Environment variable name
 * @param {number} defaultValue - Default duration in milliseconds
 * @returns {number} Duration in milliseconds
 *
 * @example
 * ```typescript
 * // TOKEN_EXPIRY=15m
 * const expiry = parseEnvDuration('TOKEN_EXPIRY'); // 900000 (15 minutes)
 *
 * // SESSION_TIMEOUT=2h
 * const timeout = parseEnvDuration('SESSION_TIMEOUT'); // 7200000 (2 hours)
 *
 * // CACHE_TTL=30s
 * const ttl = parseEnvDuration('CACHE_TTL'); // 30000 (30 seconds)
 * ```
 */
export declare const parseEnvDuration: (varName: string, defaultValue?: number) => number;
/**
 * 6. Parses environment variable as byte size (B, KB, MB, GB).
 *
 * @param {string} varName - Environment variable name
 * @param {number} defaultValue - Default size in bytes
 * @returns {number} Size in bytes
 *
 * @example
 * ```typescript
 * // MAX_FILE_SIZE=10MB
 * const maxSize = parseEnvByteSize('MAX_FILE_SIZE'); // 10485760
 *
 * // MEMORY_LIMIT=2GB
 * const memLimit = parseEnvByteSize('MEMORY_LIMIT'); // 2147483648
 * ```
 */
export declare const parseEnvByteSize: (varName: string, defaultValue?: number) => number;
/**
 * 7. Parses environment variable as enum with validation.
 *
 * @param {string} varName - Environment variable name
 * @param {string[]} allowedValues - Allowed enum values
 * @param {string} defaultValue - Default enum value
 * @returns {string} Validated enum value
 *
 * @example
 * ```typescript
 * const logLevel = parseEnvEnum(
 *   'LOG_LEVEL',
 *   ['debug', 'info', 'warn', 'error'],
 *   'info'
 * );
 *
 * const nodeEnv = parseEnvEnum(
 *   'NODE_ENV',
 *   ['development', 'staging', 'production'],
 *   'development'
 * );
 * ```
 */
export declare const parseEnvEnum: <T extends string>(varName: string, allowedValues: T[], defaultValue?: T) => T;
/**
 * 8. Parses environment variable as regular expression.
 *
 * @param {string} varName - Environment variable name
 * @param {string} flags - RegExp flags
 * @param {RegExp} defaultValue - Default regex
 * @returns {RegExp} Parsed regular expression
 *
 * @example
 * ```typescript
 * // EMAIL_PATTERN=^[^\s@]+@[^\s@]+\.[^\s@]+$
 * const emailRegex = parseEnvRegex('EMAIL_PATTERN');
 *
 * // WHITELIST_PATTERN=^(user|admin|moderator)$
 * const whitelistRegex = parseEnvRegex('WHITELIST_PATTERN', 'i');
 * ```
 */
export declare const parseEnvRegex: (varName: string, flags?: string, defaultValue?: RegExp) => RegExp;
/**
 * 9. Loads YAML configuration file with parsing.
 *
 * @param {string} filePath - Path to YAML file
 * @param {boolean} required - Whether file is required
 * @returns {any} Parsed YAML configuration
 *
 * @example
 * ```typescript
 * const config = loadYAMLConfig('./config/app.yaml');
 * const dbConfig = loadYAMLConfig('./config/database.yml', true);
 * ```
 */
export declare const loadYAMLConfig: (filePath: string, required?: boolean) => any;
/**
 * 10. Loads TOML configuration file with parsing.
 *
 * @param {string} filePath - Path to TOML file
 * @param {boolean} required - Whether file is required
 * @returns {any} Parsed TOML configuration
 *
 * @example
 * ```typescript
 * const config = loadTOMLConfig('./config/app.toml');
 * const settings = loadTOMLConfig('./settings.toml', true);
 * ```
 */
export declare const loadTOMLConfig: (filePath: string, required?: boolean) => any;
/**
 * 11. Loads .env file and parses key-value pairs.
 *
 * @param {string} filePath - Path to .env file
 * @param {boolean} override - Whether to override existing env vars
 * @returns {Record<string, string>} Parsed environment variables
 *
 * @example
 * ```typescript
 * const envVars = loadEnvFile('.env.production');
 * const localVars = loadEnvFile('.env.local', true);
 * ```
 */
export declare const loadEnvFile: (filePath: string, override?: boolean) => Record<string, string>;
/**
 * 12. Loads INI configuration file with section support.
 *
 * @param {string} filePath - Path to INI file
 * @param {boolean} required - Whether file is required
 * @returns {Record<string, any>} Parsed INI configuration
 *
 * @example
 * ```typescript
 * const config = loadINIConfig('./config.ini');
 * // { database: { host: 'localhost', port: 5432 }, ... }
 * ```
 */
export declare const loadINIConfig: (filePath: string, required?: boolean) => Record<string, any>;
/**
 * 13. Loads configuration from multiple files with merging.
 *
 * @param {string[]} filePaths - Array of config file paths
 * @param {string} format - File format
 * @returns {any} Merged configuration
 *
 * @example
 * ```typescript
 * const config = loadMultipleConfigFiles([
 *   './config/default.json',
 *   './config/production.json',
 *   './config/local.json'
 * ], 'json');
 * ```
 */
export declare const loadMultipleConfigFiles: (filePaths: string[], format?: "json" | "yaml" | "toml" | "ini" | "env") => any;
/**
 * 14. Auto-detects configuration file format and loads it.
 *
 * @param {string} filePath - Path to config file
 * @returns {any} Loaded configuration
 *
 * @example
 * ```typescript
 * const config = autoLoadConfig('./config/app.yaml');
 * const settings = autoLoadConfig('./settings.json');
 * const env = autoLoadConfig('./.env');
 * ```
 */
export declare const autoLoadConfig: (filePath: string) => any;
/**
 * 15. Creates configuration hierarchy from multiple sources.
 *
 * @param {string[]} levels - Hierarchy levels (e.g., ['default', 'production', 'local'])
 * @param {ConfigHierarchyOptions} options - Hierarchy options
 * @returns {any} Merged hierarchical configuration
 *
 * @example
 * ```typescript
 * const config = createConfigHierarchy(
 *   ['default', 'production', 'local'],
 *   { baseDir: './config', extension: '.json' }
 * );
 * ```
 */
export declare const createConfigHierarchy: (levels: string[], options?: ConfigHierarchyOptions) => any;
/**
 * 16. Creates configuration cascade with precedence rules.
 *
 * @param {Record<string, any>} sources - Named configuration sources
 * @param {string[]} precedence - Source names in order of precedence
 * @returns {any} Cascaded configuration
 *
 * @example
 * ```typescript
 * const config = createConfigCascade(
 *   {
 *     defaults: { port: 3000, host: 'localhost' },
 *     environment: { port: 8080 },
 *     runtime: { host: '0.0.0.0' }
 *   },
 *   ['defaults', 'environment', 'runtime']
 * );
 * // Result: { port: 8080, host: '0.0.0.0' }
 * ```
 */
export declare const createConfigCascade: (sources: Record<string, any>, precedence: string[]) => any;
/**
 * 17. Resolves configuration inheritance chain.
 *
 * @param {any} config - Configuration with inheritance
 * @param {string} inheritKey - Key used for inheritance (default: 'extends')
 * @returns {any} Resolved configuration
 *
 * @example
 * ```typescript
 * const config = {
 *   base: { timeout: 5000, retries: 3 },
 *   production: { extends: 'base', timeout: 10000 }
 * };
 * const resolved = resolveConfigInheritance(config);
 * // production: { timeout: 10000, retries: 3 }
 * ```
 */
export declare const resolveConfigInheritance: (config: any, inheritKey?: string) => any;
/**
 * 18. Creates configuration validation schema from rules.
 *
 * @param {ConfigValidationRule[]} rules - Validation rules
 * @returns {(config: any) => { valid: boolean; errors: string[] }} Validator function
 *
 * @example
 * ```typescript
 * const validator = createConfigSchema([
 *   { path: 'database.host', type: 'required' },
 *   { path: 'database.port', type: 'range', value: [1024, 65535] },
 *   { path: 'environment', type: 'enum', value: ['dev', 'prod'] }
 * ]);
 * const result = validator(config);
 * ```
 */
export declare const createConfigSchema: (rules: ConfigValidationRule[]) => ((config: any) => {
    valid: boolean;
    errors: string[];
});
/**
 * 19. Validates configuration against multiple schemas.
 *
 * @param {any} config - Configuration to validate
 * @param {Array<(config: any) => { valid: boolean; errors: string[] }>} validators - Array of validators
 * @returns {{ valid: boolean; errors: string[] }} Combined validation result
 *
 * @example
 * ```typescript
 * const result = validateConfigMultiSchema(config, [
 *   databaseValidator,
 *   authValidator,
 *   cacheValidator
 * ]);
 * ```
 */
export declare const validateConfigMultiSchema: (config: any, validators: Array<(config: any) => {
    valid: boolean;
    errors: string[];
}>) => {
    valid: boolean;
    errors: string[];
};
/**
 * 20. Sanitizes configuration by removing sensitive fields.
 *
 * @param {any} config - Configuration to sanitize
 * @param {string[]} sensitiveKeys - Keys to redact
 * @param {string} redactionText - Replacement text
 * @returns {any} Sanitized configuration
 *
 * @example
 * ```typescript
 * const sanitized = sanitizeConfig(config, [
 *   'password',
 *   'apiKey',
 *   'secret',
 *   'token'
 * ], '[REDACTED]');
 * ```
 */
export declare const sanitizeConfig: (config: any, sensitiveKeys?: string[], redactionText?: string) => any;
/**
 * 21. Creates type-safe configuration service with schema validation.
 *
 * @param {TypeSafeConfigOptions<T>} options - Type-safe config options
 * @returns {TypeSafeConfigService<T>} Type-safe configuration service
 *
 * @example
 * ```typescript
 * interface AppConfig {
 *   database: { host: string; port: number };
 *   redis: { host: string; port: number };
 * }
 *
 * const configService = createTypeSafeConfig<AppConfig>({
 *   schema: { database: { host: 'localhost', port: 5432 } },
 *   defaults: { redis: { host: 'localhost', port: 6379 } }
 * });
 *
 * const dbHost = configService.get('database.host');
 * ```
 */
export declare const createTypeSafeConfig: <T extends Record<string, any>>(options: TypeSafeConfigOptions<T>) => {
    get<K extends keyof T>(key: K): T[K];
    getOrDefault<K extends keyof T>(key: K, defaultValue: T[K]): T[K];
    has(key: keyof T): boolean;
    getAll(): T;
    set<K extends keyof T>(key: K, value: T[K]): void;
};
/**
 * 22. Creates strongly-typed configuration getter with inference.
 *
 * @param {ConfigService} configService - NestJS ConfigService
 * @returns {<T>(key: string, defaultValue?: T) => T} Typed getter
 *
 * @example
 * ```typescript
 * const getConfig = createStronglyTypedGetter(configService);
 * const port = getConfig<number>('PORT', 3000);
 * const hosts = getConfig<string[]>('DATABASE_HOSTS', []);
 * ```
 */
export declare const createStronglyTypedGetter: (configService: ConfigService) => <T>(key: string, defaultValue?: T) => T;
/**
 * 23. Rotates secrets on a schedule with automatic reloading.
 *
 * @param {SecretRotationConfig} config - Rotation configuration
 * @returns {{ stop: () => void }} Rotation controller
 *
 * @example
 * ```typescript
 * const rotation = rotateSecretsScheduled({
 *   interval: 3600000, // 1 hour
 *   provider: 'aws-secrets-manager',
 *   secretId: 'app/production/db',
 *   onRotate: (old, new) => console.log('Secret rotated')
 * });
 *
 * // Later: rotation.stop();
 * ```
 */
export declare const rotateSecretsScheduled: (config: SecretRotationConfig) => {
    stop: () => void;
};
/**
 * 24. Creates secret manager with caching and expiration.
 *
 * @param {number} cacheDuration - Cache duration in milliseconds
 * @returns {SecretManager} Secret manager instance
 *
 * @example
 * ```typescript
 * const secretManager = createSecretManager(300000); // 5 minutes
 * const dbPassword = await secretManager.getSecret('db-password');
 * secretManager.invalidate('db-password');
 * ```
 */
export declare const createSecretManager: (cacheDuration?: number) => {
    getSecret(key: string): Promise<string>;
    invalidate(key: string): void;
    clear(): void;
};
/**
 * 25. Encrypts secrets for storage with key derivation.
 *
 * @param {Record<string, string>} secrets - Secrets to encrypt
 * @param {string} masterKey - Master encryption key
 * @returns {Record<string, string>} Encrypted secrets
 *
 * @example
 * ```typescript
 * const encrypted = encryptSecrets({
 *   DB_PASSWORD: 'secret123',
 *   API_KEY: 'key456'
 * }, process.env.MASTER_KEY);
 * ```
 */
export declare const encryptSecrets: (secrets: Record<string, string>, masterKey: string) => Record<string, string>;
/**
 * 26. Decrypts secrets from encrypted storage.
 *
 * @param {Record<string, string>} encryptedSecrets - Encrypted secrets
 * @param {string} masterKey - Master decryption key
 * @returns {Record<string, string>} Decrypted secrets
 *
 * @example
 * ```typescript
 * const decrypted = decryptSecrets(encrypted, process.env.MASTER_KEY);
 * ```
 */
export declare const decryptSecrets: (encryptedSecrets: Record<string, string>, masterKey: string) => Record<string, string>;
/**
 * 27. Creates feature flag service with A/B testing support.
 *
 * @param {Record<string, FeatureFlagOptions>} flags - Feature flag definitions
 * @returns {FeatureFlagService} Feature flag service
 *
 * @example
 * ```typescript
 * const flagService = createFeatureFlagService({
 *   newUI: { enabled: true, rollout: 50 },
 *   betaFeatures: {
 *     enabled: true,
 *     segments: ['beta-testers'],
 *     startDate: new Date('2025-01-01')
 *   }
 * });
 *
 * if (flagService.isEnabled('newUI', { userId: '123' })) {
 *   // Show new UI
 * }
 * ```
 */
export declare const createFeatureFlagService: (flags: Record<string, FeatureFlagOptions>) => {
    isEnabled(flagName: string, context?: {
        userId?: string;
        segment?: string;
    }): boolean;
    getVariant(flagName: string, variants: string[], context?: {
        userId?: string;
    }): string;
    getAllFlags(): Record<string, FeatureFlagOptions>;
    updateFlag(flagName: string, updates: Partial<FeatureFlagOptions>): void;
};
/**
 * 28. Evaluates feature flag with complex conditions.
 *
 * @param {string} flagName - Feature flag name
 * @param {Record<string, any>} conditions - Evaluation conditions
 * @param {Record<string, any>} context - Evaluation context
 * @returns {boolean} Evaluation result
 *
 * @example
 * ```typescript
 * const enabled = evaluateFeatureFlagComplex(
 *   'premiumFeatures',
 *   { tier: 'premium', country: 'US' },
 *   { tier: user.tier, country: user.country }
 * );
 * ```
 */
export declare const evaluateFeatureFlagComplex: (flagName: string, conditions: Record<string, any>, context: Record<string, any>) => boolean;
/**
 * 29. Creates percentage-based feature rollout calculator.
 *
 * @param {string} flagName - Feature flag name
 * @param {number} percentage - Rollout percentage (0-100)
 * @returns {(userId: string) => boolean} Rollout evaluator
 *
 * @example
 * ```typescript
 * const checkRollout = createPercentageRollout('newDashboard', 25);
 * const isUserIncluded = checkRollout(user.id); // 25% of users will get true
 * ```
 */
export declare const createPercentageRollout: (flagName: string, percentage: number) => ((userId: string) => boolean);
/**
 * 30. Watches multiple configuration files with aggregated changes.
 *
 * @param {string[]} filePaths - Configuration file paths
 * @param {(changes: Map<string, any>) => void} callback - Change callback
 * @param {number} debounce - Debounce delay in milliseconds
 * @returns {{ stop: () => void }} Watch controller
 *
 * @example
 * ```typescript
 * const watcher = watchMultipleConfigs(
 *   ['app.json', 'db.json', 'cache.json'],
 *   (changes) => {
 *     for (const [file, change] of changes) {
 *       console.log(`${file} changed:`, change);
 *     }
 *   }
 * );
 * ```
 */
export declare const watchMultipleConfigs: (filePaths: string[], callback: (changes: Map<string, any>) => void, debounce?: number) => {
    stop: () => void;
};
/**
 * 31. Detects configuration changes and computes diff.
 *
 * @param {any} oldConfig - Old configuration
 * @param {any} newConfig - New configuration
 * @returns {{ added: string[]; modified: string[]; removed: string[] }} Change diff
 *
 * @example
 * ```typescript
 * const diff = detectConfigChanges(oldConfig, newConfig);
 * console.log('Added:', diff.added);
 * console.log('Modified:', diff.modified);
 * console.log('Removed:', diff.removed);
 * ```
 */
export declare const detectConfigChanges: (oldConfig: any, newConfig: any) => {
    added: string[];
    modified: string[];
    removed: string[];
};
/**
 * 32. Creates configuration change event emitter.
 *
 * @param {string} configPath - Configuration file path
 * @returns {ConfigChangeEmitter} Change event emitter
 *
 * @example
 * ```typescript
 * const emitter = createConfigChangeEmitter('./config.json');
 * emitter.on('change', (diff) => console.log('Changed:', diff));
 * emitter.on('error', (err) => console.error('Error:', err));
 * emitter.start();
 * ```
 */
export declare const createConfigChangeEmitter: (configPath: string) => {
    on(event: "change" | "error", callback: (data: any) => void): void;
    emit(event: string, data: any): void;
    start(): void;
    stop(): void;
};
/**
 * 33. Creates memoized configuration getter with cache.
 *
 * @param {(key: string) => any} getter - Configuration getter function
 * @param {number} ttl - Cache TTL in milliseconds
 * @returns {(key: string) => any} Memoized getter
 *
 * @example
 * ```typescript
 * const getConfig = memoizeConfigGetter(
 *   (key) => configService.get(key),
 *   60000 // 1 minute cache
 * );
 *
 * const dbHost = getConfig('database.host'); // Cached for 1 minute
 * ```
 */
export declare const memoizeConfigGetter: (getter: (key: string) => any, ttl?: number) => ((key: string) => any);
/**
 * 34. Creates configuration cache with LRU eviction.
 *
 * @param {number} maxSize - Maximum cache size
 * @returns {ConfigLRUCache} LRU cache instance
 *
 * @example
 * ```typescript
 * const cache = createConfigLRUCache(100);
 * cache.set('database.host', 'localhost');
 * const host = cache.get('database.host');
 * ```
 */
export declare const createConfigLRUCache: (maxSize?: number) => {
    get(key: string): any;
    set(key: string, value: any): void;
    has(key: string): boolean;
    clear(): void;
    size(): number;
};
/**
 * 35. Preloads and caches configuration for faster access.
 *
 * @param {string[]} configPaths - Configuration file paths
 * @returns {Promise<Map<string, any>>} Preloaded configuration cache
 *
 * @example
 * ```typescript
 * const cache = await preloadConfigCache([
 *   './config/app.json',
 *   './config/database.json',
 *   './config/redis.json'
 * ]);
 * const appConfig = cache.get('./config/app.json');
 * ```
 */
export declare const preloadConfigCache: (configPaths: string[]) => Promise<Map<string, any>>;
/**
 * 36. Migrates configuration from one version to another.
 *
 * @param {any} config - Configuration to migrate
 * @param {ConfigMigration[]} migrations - Migration definitions
 * @param {string} targetVersion - Target version
 * @returns {any} Migrated configuration
 *
 * @example
 * ```typescript
 * const migrated = migrateConfig(oldConfig, [
 *   {
 *     version: '2.0.0',
 *     description: 'Rename db to database',
 *     up: (config) => {
 *       config.database = config.db;
 *       delete config.db;
 *       return config;
 *     }
 *   }
 * ], '2.0.0');
 * ```
 */
export declare const migrateConfig: (config: any, migrations: ConfigMigration[], targetVersion: string) => any;
/**
 * 37. Creates configuration snapshot for versioning.
 *
 * @param {any} config - Configuration to snapshot
 * @param {string} version - Version identifier
 * @param {string} environment - Environment name
 * @returns {ConfigSnapshot} Configuration snapshot
 *
 * @example
 * ```typescript
 * const snapshot = createConfigSnapshot(config, '1.2.3', 'production');
 * saveSnapshot(snapshot);
 * ```
 */
export declare const createConfigSnapshot: (config: any, version: string, environment: string) => ConfigSnapshot;
/**
 * 38. Validates configuration snapshot integrity.
 *
 * @param {ConfigSnapshot} snapshot - Configuration snapshot
 * @returns {boolean} Validation result
 *
 * @example
 * ```typescript
 * const snapshot = loadSnapshot('snapshot-123.json');
 * if (validateConfigSnapshot(snapshot)) {
 *   applySnapshot(snapshot);
 * }
 * ```
 */
export declare const validateConfigSnapshot: (snapshot: ConfigSnapshot) => boolean;
/**
 * 39. Flattens nested configuration to dot notation.
 *
 * @param {any} config - Nested configuration object
 * @param {string} prefix - Key prefix
 * @returns {Record<string, any>} Flattened configuration
 *
 * @example
 * ```typescript
 * const flat = flattenConfig({
 *   database: { host: 'localhost', port: 5432 },
 *   redis: { host: 'localhost' }
 * });
 * // { 'database.host': 'localhost', 'database.port': 5432, 'redis.host': 'localhost' }
 * ```
 */
export declare const flattenConfig: (config: any, prefix?: string) => Record<string, any>;
/**
 * 40. Expands flattened configuration back to nested structure.
 *
 * @param {Record<string, any>} flatConfig - Flattened configuration
 * @returns {any} Nested configuration object
 *
 * @example
 * ```typescript
 * const nested = expandConfig({
 *   'database.host': 'localhost',
 *   'database.port': 5432,
 *   'redis.host': 'localhost'
 * });
 * // { database: { host: 'localhost', port: 5432 }, redis: { host: 'localhost' } }
 * ```
 */
export declare const expandConfig: (flatConfig: Record<string, any>) => any;
/**
 * 41. Compares two configurations and returns differences.
 *
 * @param {any} config1 - First configuration
 * @param {any} config2 - Second configuration
 * @returns {Record<string, { old: any; new: any }>} Configuration differences
 *
 * @example
 * ```typescript
 * const diff = compareConfigs(oldConfig, newConfig);
 * for (const [key, { old, new: newValue }] of Object.entries(diff)) {
 *   console.log(`${key}: ${old} -> ${newValue}`);
 * }
 * ```
 */
export declare const compareConfigs: (config1: any, config2: any) => Record<string, {
    old: any;
    new: any;
}>;
/**
 * 42. Merges configuration with environment variable overrides.
 *
 * @param {any} config - Base configuration
 * @param {string} envPrefix - Environment variable prefix
 * @returns {any} Merged configuration
 *
 * @example
 * ```typescript
 * // Environment: APP_DATABASE_HOST=prod.db.com
 * const config = mergeConfigWithEnv(
 *   { database: { host: 'localhost' } },
 *   'APP_'
 * );
 * // { database: { host: 'prod.db.com' } }
 * ```
 */
export declare const mergeConfigWithEnv: (config: any, envPrefix?: string) => any;
/**
 * 43. Exports configuration to different formats.
 *
 * @param {any} config - Configuration to export
 * @param {string} format - Export format
 * @returns {string} Exported configuration string
 *
 * @example
 * ```typescript
 * const jsonConfig = exportConfig(config, 'json');
 * const yamlConfig = exportConfig(config, 'yaml');
 * const envConfig = exportConfig(config, 'env');
 * fs.writeFileSync('config.json', jsonConfig);
 * ```
 */
export declare const exportConfig: (config: any, format?: "json" | "yaml" | "env" | "toml") => string;
/**
 * 44. Validates configuration completeness across environments.
 *
 * @param {Record<string, any>} configs - Environment configurations
 * @param {string[]} requiredKeys - Required configuration keys
 * @returns {{ valid: boolean; missing: Record<string, string[]> }} Validation result
 *
 * @example
 * ```typescript
 * const result = validateConfigCompleteness(
 *   {
 *     development: { database: { host: 'localhost' } },
 *     production: { database: { port: 5432 } }
 *   },
 *   ['database.host', 'database.port']
 * );
 * // { valid: false, missing: { production: ['database.host'], development: ['database.port'] } }
 * ```
 */
export declare const validateConfigCompleteness: (configs: Record<string, any>, requiredKeys: string[]) => {
    valid: boolean;
    missing: Record<string, string[]>;
};
/**
 * 45. Creates configuration proxy with access logging.
 *
 * @param {any} config - Configuration object
 * @param {(key: string) => void} onAccess - Access callback
 * @returns {any} Proxied configuration
 *
 * @example
 * ```typescript
 * const proxiedConfig = createConfigProxy(config, (key) => {
 *   console.log(`Config accessed: ${key}`);
 * });
 *
 * const dbHost = proxiedConfig.database.host; // Logs: "Config accessed: database.host"
 * ```
 */
export declare const createConfigProxy: (config: any, onAccess: (key: string) => void) => any;
//# sourceMappingURL=config-management-kit.d.ts.map