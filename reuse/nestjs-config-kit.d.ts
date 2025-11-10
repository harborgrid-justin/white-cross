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
/**
 * Configuration module initialization options
 */
export interface ConfigModuleInit {
    envFilePath?: string | string[];
    isGlobal?: boolean;
    cache?: boolean;
    expandVariables?: boolean;
    ignoreEnvFile?: boolean;
    validationSchema?: any;
    validationOptions?: any;
}
/**
 * Environment variable parsing options
 */
export interface EnvParseOptions {
    parseNumbers?: boolean;
    parseBooleans?: boolean;
    parseJSON?: boolean;
    trim?: boolean;
}
/**
 * Configuration validation result
 */
export interface ConfigValidationResult {
    valid: boolean;
    errors?: string[];
    warnings?: string[];
    config?: Record<string, any>;
}
/**
 * Configuration namespace definition
 */
export interface ConfigNamespace {
    name: string;
    factory: () => Record<string, any> | Promise<Record<string, any>>;
    cache?: boolean;
    validate?: (config: any) => boolean;
}
/**
 * Secret provider configuration
 */
export interface SecretProviderConfig {
    provider: 'aws' | 'azure' | 'vault' | 'gcp' | 'local';
    region?: string;
    endpoint?: string;
    credentials?: any;
    cacheDuration?: number;
}
/**
 * Feature flag configuration
 */
export interface FeatureFlag {
    name: string;
    enabled: boolean;
    environments?: string[];
    percentage?: number;
    metadata?: Record<string, any>;
}
/**
 * Configuration cache entry
 */
export interface ConfigCacheEntry {
    value: any;
    timestamp: number;
    ttl: number;
}
/**
 * Environment detection result
 */
export interface EnvironmentInfo {
    name: string;
    isProduction: boolean;
    isDevelopment: boolean;
    isTest: boolean;
    isStaging: boolean;
    nodeEnv: string;
}
/**
 * Configuration merge strategy options
 */
export interface MergeStrategyOptions {
    deep?: boolean;
    arrayMerge?: 'replace' | 'concat' | 'unique';
    skipNull?: boolean;
    skipUndefined?: boolean;
}
/**
 * Configuration watcher options
 */
export interface ConfigWatcherOptions {
    files: string[];
    onReload: (config: Record<string, any>) => void;
    debounceMs?: number;
    persistent?: boolean;
}
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
export declare const getEnv: <T = string>(key: string, defaultValue: T) => T;
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
export declare const getRequiredEnv: (key: string, message?: string) => string;
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
export declare const parseEnvInt: (key: string, defaultValue: number, constraints?: {
    min?: number;
    max?: number;
}) => number;
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
export declare const parseEnvFloat: (key: string, defaultValue: number, constraints?: {
    min?: number;
    max?: number;
}) => number;
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
export declare const parseEnvBool: (key: string, defaultValue: boolean) => boolean;
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
export declare const parseEnvJSON: <T = any>(key: string, defaultValue: T) => T;
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
export declare const parseEnvArray: (key: string, defaultValue?: string[], separator?: string) => string[];
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
export declare const expandEnvVars: (value: string, env?: Record<string, string>) => string;
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
export declare const setEnvVars: (vars: Record<string, string>, override?: boolean) => void;
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
export declare const createConfigModuleOptions: (options?: Partial<ConfigModuleInit>) => ConfigModuleInit;
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
export declare const createTestConfigOptions: (testVars?: Record<string, string>) => ConfigModuleInit;
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
export declare const createAsyncConfigFactory: (loader: () => Promise<Record<string, any>>) => (() => Promise<Record<string, any>>);
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
export declare const createNamespace: (namespace: string, config: Record<string, any>) => Record<string, any>;
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
export declare const getNamespacedValue: <T = any>(config: Record<string, any>, path: string, defaultValue?: T) => T;
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
export declare const setNamespacedValue: (config: Record<string, any>, path: string, value: any) => void;
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
export declare const mergeNamespaces: (configs: Record<string, any>[], options?: MergeStrategyOptions) => Record<string, any>;
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
export declare const extractNamespace: (config: Record<string, any>, namespace: string) => Record<string, any> | undefined;
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
export declare const validateWithJoi: (config: Record<string, any>, schema: any) => ConfigValidationResult;
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
export declare const createConfigTypeGuard: (typeMap: Record<string, string>) => ((config: any) => boolean);
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
export declare const validateRequiredKeys: (config: Record<string, any>, requiredKeys: string[]) => ConfigValidationResult;
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
export declare const validateConstraints: (config: Record<string, any>, constraints: Record<string, any>) => ConfigValidationResult;
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
export declare const detectEnvironment: () => EnvironmentInfo;
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
export declare const isProduction: () => boolean;
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
export declare const isDevelopment: () => boolean;
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
export declare const isTest: () => boolean;
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
export declare const getEnvSpecificValue: <T = any>(envMap: Record<string, T>, defaultValue?: T) => T;
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
export declare const mergeConfigs: (configs: Record<string, any>[], options?: MergeStrategyOptions) => Record<string, any>;
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
export declare const deepMerge: (target: Record<string, any>, source: Record<string, any>, options?: MergeStrategyOptions) => Record<string, any>;
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
export declare const createFeatureFlag: (name: string, enabled: boolean, options?: Partial<FeatureFlag>) => FeatureFlag;
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
export declare const isFeatureEnabled: (flag: FeatureFlag, env?: EnvironmentInfo) => boolean;
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
export declare const createFeatureFlagManager: (flags: FeatureFlag[]) => {
    isEnabled: (name: string) => boolean;
    getFlag: (name: string) => FeatureFlag | undefined;
    getAllFlags: () => FeatureFlag[];
    addFlag: (flag: FeatureFlag) => void;
    removeFlag: (name: string) => boolean;
};
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
export declare const encryptConfigValue: (value: string, key: string) => string;
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
export declare const decryptConfigValue: (encryptedValue: string, key: string) => string;
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
export declare const maskConfigValue: (value: string, visibleChars?: number) => string;
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
export declare const loadFromAWSSecrets: (secretName: string, region?: string) => Promise<Record<string, string>>;
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
export declare const loadFromAzureKeyVault: (vaultUrl: string, secretNames: string[]) => Promise<Record<string, string>>;
/**
 * Configuration cache implementation with TTL.
 */
export declare class ConfigCache {
    private cache;
    /**
     * Sets a value in cache with TTL.
     *
     * @param {string} key - Cache key
     * @param {any} value - Value to cache
     * @param {number} [ttl] - TTL in milliseconds (default: 5 minutes)
     */
    set(key: string, value: any, ttl?: number): void;
    /**
     * Gets value from cache if not expired.
     *
     * @param {string} key - Cache key
     * @returns {any | undefined} Cached value or undefined
     */
    get(key: string): any | undefined;
    /**
     * Checks if key exists and is not expired.
     *
     * @param {string} key - Cache key
     * @returns {boolean} True if exists and valid
     */
    has(key: string): boolean;
    /**
     * Clears all cached entries.
     */
    clear(): void;
    /**
     * Removes expired entries.
     */
    purge(): void;
    /**
     * Gets cache statistics.
     *
     * @returns {object} Cache stats
     */
    getStats(): {
        size: number;
        valid: number;
        expired: number;
    };
}
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
export declare const createCachedGetter: (getter: (key: string) => any, ttl?: number) => ((key: string) => any);
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
export declare const generateConfigDocs: (schema: Record<string, any>, descriptions?: Record<string, string>) => string;
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
export declare const exportEnvTemplate: (schema: Record<string, any>, descriptions?: Record<string, string>) => string;
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
export declare const sanitizeConfig: (config: Record<string, any>, secretKeys?: string[]) => Record<string, any>;
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
export declare const validateURLs: (urls: Record<string, string>) => ConfigValidationResult;
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
export declare const createMockConfigService: (mockConfig: Record<string, any>) => {
    get: <T = any>(key: string, defaultValue?: T) => T;
    getOrThrow: <T = any>(key: string) => T;
};
declare const _default: {
    getEnv: <T = string>(key: string, defaultValue: T) => T;
    getRequiredEnv: (key: string, message?: string) => string;
    parseEnvInt: (key: string, defaultValue: number, constraints?: {
        min?: number;
        max?: number;
    }) => number;
    parseEnvFloat: (key: string, defaultValue: number, constraints?: {
        min?: number;
        max?: number;
    }) => number;
    parseEnvBool: (key: string, defaultValue: boolean) => boolean;
    parseEnvJSON: <T = any>(key: string, defaultValue: T) => T;
    parseEnvArray: (key: string, defaultValue?: string[], separator?: string) => string[];
    expandEnvVars: (value: string, env?: Record<string, string>) => string;
    setEnvVars: (vars: Record<string, string>, override?: boolean) => void;
    createConfigModuleOptions: (options?: Partial<ConfigModuleInit>) => ConfigModuleInit;
    createTestConfigOptions: (testVars?: Record<string, string>) => ConfigModuleInit;
    createAsyncConfigFactory: (loader: () => Promise<Record<string, any>>) => (() => Promise<Record<string, any>>);
    createNamespace: (namespace: string, config: Record<string, any>) => Record<string, any>;
    getNamespacedValue: <T = any>(config: Record<string, any>, path: string, defaultValue?: T) => T;
    setNamespacedValue: (config: Record<string, any>, path: string, value: any) => void;
    mergeNamespaces: (configs: Record<string, any>[], options?: MergeStrategyOptions) => Record<string, any>;
    extractNamespace: (config: Record<string, any>, namespace: string) => Record<string, any> | undefined;
    validateWithJoi: (config: Record<string, any>, schema: any) => ConfigValidationResult;
    createConfigTypeGuard: (typeMap: Record<string, string>) => ((config: any) => boolean);
    validateRequiredKeys: (config: Record<string, any>, requiredKeys: string[]) => ConfigValidationResult;
    validateConstraints: (config: Record<string, any>, constraints: Record<string, any>) => ConfigValidationResult;
    validateURLs: (urls: Record<string, string>) => ConfigValidationResult;
    detectEnvironment: () => EnvironmentInfo;
    isProduction: () => boolean;
    isDevelopment: () => boolean;
    isTest: () => boolean;
    getEnvSpecificValue: <T = any>(envMap: Record<string, T>, defaultValue?: T) => T;
    mergeConfigs: (configs: Record<string, any>[], options?: MergeStrategyOptions) => Record<string, any>;
    deepMerge: (target: Record<string, any>, source: Record<string, any>, options?: MergeStrategyOptions) => Record<string, any>;
    createFeatureFlag: (name: string, enabled: boolean, options?: Partial<FeatureFlag>) => FeatureFlag;
    isFeatureEnabled: (flag: FeatureFlag, env?: EnvironmentInfo) => boolean;
    createFeatureFlagManager: (flags: FeatureFlag[]) => {
        isEnabled: (name: string) => boolean;
        getFlag: (name: string) => FeatureFlag | undefined;
        getAllFlags: () => FeatureFlag[];
        addFlag: (flag: FeatureFlag) => void;
        removeFlag: (name: string) => boolean;
    };
    encryptConfigValue: (value: string, key: string) => string;
    decryptConfigValue: (encryptedValue: string, key: string) => string;
    maskConfigValue: (value: string, visibleChars?: number) => string;
    loadFromAWSSecrets: (secretName: string, region?: string) => Promise<Record<string, string>>;
    loadFromAzureKeyVault: (vaultUrl: string, secretNames: string[]) => Promise<Record<string, string>>;
    ConfigCache: typeof ConfigCache;
    createCachedGetter: (getter: (key: string) => any, ttl?: number) => ((key: string) => any);
    generateConfigDocs: (schema: Record<string, any>, descriptions?: Record<string, string>) => string;
    exportEnvTemplate: (schema: Record<string, any>, descriptions?: Record<string, string>) => string;
    sanitizeConfig: (config: Record<string, any>, secretKeys?: string[]) => Record<string, any>;
    createMockConfigService: (mockConfig: Record<string, any>) => {
        get: <T = any>(key: string, defaultValue?: T) => T;
        getOrThrow: <T = any>(key: string) => T;
    };
};
export default _default;
//# sourceMappingURL=nestjs-config-kit.d.ts.map