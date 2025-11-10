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
/**
 * Configuration module advanced options
 */
export interface AdvancedConfigOptions {
    envFilePath?: string | string[];
    isGlobal?: boolean;
    cache?: boolean;
    expandVariables?: boolean;
    ignoreEnvFile?: boolean;
    validationSchema?: Record<string, any>;
    validationOptions?: Record<string, any>;
    load?: Array<() => Record<string, any>>;
    ignoreEnvVars?: boolean;
    encoding?: BufferEncoding;
}
/**
 * Configuration loader definition
 */
export interface ConfigLoader {
    name: string;
    load: () => Record<string, any> | Promise<Record<string, any>>;
    priority?: number;
    cache?: boolean;
    validate?: (config: any) => boolean;
}
/**
 * Configuration transformation rule
 */
export interface ConfigTransformRule {
    path: string;
    transform: (value: any) => any;
    condition?: (value: any) => boolean;
}
/**
 * Configuration schema definition
 */
export interface ConfigSchema {
    [key: string]: {
        type: 'string' | 'number' | 'boolean' | 'object' | 'array';
        required?: boolean;
        default?: any;
        enum?: any[];
        pattern?: RegExp;
        min?: number;
        max?: number;
        items?: ConfigSchema;
        properties?: ConfigSchema;
        validator?: (value: any) => boolean;
    };
}
/**
 * Remote configuration source
 */
export interface RemoteConfigSource {
    url: string;
    method?: 'GET' | 'POST';
    headers?: Record<string, string>;
    auth?: {
        type: 'bearer' | 'basic' | 'api-key';
        credentials: string | Record<string, string>;
    };
    interval?: number;
    transform?: (data: unknown) => Record<string, any>;
}
/**
 * Configuration version metadata
 */
export interface ConfigVersion {
    version: string;
    timestamp: number;
    hash: string;
    changes?: string[];
    author?: string;
}
/**
 * Configuration diff result
 */
export interface ConfigDiff {
    added: string[];
    removed: string[];
    modified: Array<{
        key: string;
        oldValue: any;
        newValue: any;
    }>;
}
/**
 * Configuration snapshot
 */
export interface ConfigSnapshot {
    timestamp: number;
    config: Record<string, any>;
    version?: string;
    metadata?: Record<string, any>;
}
/**
 * Configuration watch callback
 */
export type ConfigWatchCallback = (newConfig: Record<string, any>, oldConfig: Record<string, any>, diff: ConfigDiff) => void;
/**
 * Configuration reload strategy
 */
export interface ReloadStrategy {
    type: 'poll' | 'watch' | 'push' | 'manual';
    interval?: number;
    paths?: string[];
    debounceMs?: number;
}
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
export declare const buildConfigModuleOptions: (env: string, overrides?: Partial<AdvancedConfigOptions>) => AdvancedConfigOptions;
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
export declare const buildMultiEnvConfig: (environments: string[], baseOptions?: Partial<AdvancedConfigOptions>) => Record<string, AdvancedConfigOptions>;
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
export declare const buildLayeredConfig: (loaders: ConfigLoader[]) => (() => Promise<Record<string, any>>);
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
export declare const buildConditionalConfig: (condition: () => boolean, trueLoader: () => Record<string, any>, falseLoader?: () => Record<string, any>) => (() => Record<string, any>);
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
export declare const buildFeatureConfig: (featureName: string, config: Record<string, any>, options?: Partial<AdvancedConfigOptions>) => AdvancedConfigOptions;
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
export declare const createJoiSchema: (schema: ConfigSchema) => Record<string, any>;
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
export declare const createClassValidatorSchema: (schema: ConfigSchema) => Record<string, any>;
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
export declare const validateConfigSchema: (config: Record<string, any>, schema: ConfigSchema) => {
    valid: boolean;
    errors?: string[];
};
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
export declare const createSchemaValidator: (schema: ConfigSchema) => ((config: Record<string, any>) => boolean);
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
export declare const mergeValidationSchemas: (schemas: ConfigSchema[]) => ConfigSchema;
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
export declare const getTypedConfig: <T>(config: Record<string, any>, key: string, defaultValue?: T) => T;
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
export declare const getCoercedConfig: <T>(config: Record<string, any>, key: string, type: "string" | "number" | "boolean", defaultValue?: T) => T;
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
export declare const getValidatedConfig: <T>(config: Record<string, any>, key: string, validator: (value: T) => boolean, defaultValue?: T) => T;
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
export declare const getBatchConfig: (config: Record<string, any>, keys: string[]) => Record<string, any>;
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
export declare const getPrefixedConfig: (config: Record<string, any>, prefix: string) => Record<string, any>;
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
export declare const buildHierarchicalConfig: (namespaces: Record<string, Record<string, any>>) => Record<string, any>;
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
export declare const flattenConfig: (config: Record<string, any>, prefix?: string) => Record<string, any>;
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
export declare const unflattenConfig: (config: Record<string, any>) => Record<string, any>;
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
export declare const isolateNamespace: (namespace: string, config: Record<string, any>) => Record<string, any>;
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
export declare const mergeNamespaceConfigs: (configs: Record<string, any>[], resolver?: (key: string, values: any[]) => any) => Record<string, any>;
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
export declare const resolveSecretReferences: (config: Record<string, any>, resolver: (ref: string) => Promise<string>) => Promise<Record<string, any>>;
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
export declare const createRotatingSecret: (secretName: string, fetcher: () => Promise<string>, rotationInterval: number) => (() => Promise<string>);
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
export declare const encryptSecret: (secret: string, passphrase: string, salt?: string) => string;
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
export declare const decryptSecret: (encryptedSecret: string, passphrase: string) => string;
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
export declare const createSecretProvider: (provider: "aws" | "azure" | "vault" | "env", config: any) => ((key: string) => Promise<string>);
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
export declare const transformConfig: (config: Record<string, any>, rules: ConfigTransformRule[]) => Record<string, any>;
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
export declare const normalizeConfig: (config: Record<string, any>, options?: {
    trimStrings?: boolean;
    lowercaseKeys?: boolean;
    uppercaseKeys?: boolean;
    removeEmpty?: boolean;
    removeNull?: boolean;
}) => Record<string, any>;
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
export declare const castConfigTypes: (config: Record<string, any>, typeMap: Record<string, string>) => Record<string, any>;
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
export declare const sanitizeForLogging: (config: Record<string, any>, sensitiveKeys?: string[]) => Record<string, any>;
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
export declare const applyDefaults: (config: Record<string, any>, defaults: Record<string, any>) => Record<string, any>;
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
export declare const watchConfigFiles: (filePaths: string[], callback: ConfigWatchCallback, debounceMs?: number) => (() => void);
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
export declare const pollConfiguration: (loader: () => Promise<Record<string, any>>, intervalMs: number, callback: (config: Record<string, any>) => void) => (() => void);
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
export declare const detectConfigChanges: (oldConfig: Record<string, any>, newConfig: Record<string, any>) => ConfigDiff;
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
export declare const createHotReloadManager: (loader: () => Record<string, any>, validator: (config: Record<string, any>) => boolean) => {
    reload: () => Promise<boolean>;
    getConfig: () => Record<string, any>;
    getDiff: () => ConfigDiff;
};
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
export declare const gracefulReload: (config: Record<string, any>, newConfig: Record<string, any>, tester: (config: Record<string, any>) => Promise<boolean>) => Promise<{
    success: boolean;
    config: Record<string, any>;
}>;
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
export declare const createConfigSnapshot: (config: Record<string, any>, version?: string) => ConfigSnapshot;
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
export declare const generateConfigHash: (config: Record<string, any>) => string;
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
export declare const compareConfigVersions: (snapshot1: ConfigSnapshot, snapshot2: ConfigSnapshot) => boolean;
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
export declare const createRemoteConfigLoader: (source: RemoteConfigSource) => (() => Promise<Record<string, any>>);
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
export declare const createConfigBackupManager: (backupDir: string) => {
    save: (config: Record<string, any>, version: string) => Promise<void>;
    restore: (version: string) => Promise<Record<string, any>>;
    list: () => Promise<string[]>;
};
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
export declare const buildConfigOverrideChain: (configs: Record<string, any>[]) => Record<string, any>;
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
export declare const exportConfig: (config: Record<string, any>, format: "json" | "yaml" | "env" | "ts") => string;
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
export declare const importConfig: (content: string, format: "json" | "yaml" | "env") => Record<string, any>;
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
export declare const generateConfigDocumentation: (schema: ConfigSchema, examples?: Record<string, any>) => string;
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
export declare const testConfiguration: (config: Record<string, any>, tests: Array<{
    name: string;
    test: (config: any) => boolean;
}>) => {
    passed: number;
    failed: number;
    results: any[];
};
declare const _default: {
    buildConfigModuleOptions: (env: string, overrides?: Partial<AdvancedConfigOptions>) => AdvancedConfigOptions;
    buildMultiEnvConfig: (environments: string[], baseOptions?: Partial<AdvancedConfigOptions>) => Record<string, AdvancedConfigOptions>;
    buildLayeredConfig: (loaders: ConfigLoader[]) => (() => Promise<Record<string, any>>);
    buildConditionalConfig: (condition: () => boolean, trueLoader: () => Record<string, any>, falseLoader?: () => Record<string, any>) => (() => Record<string, any>);
    buildFeatureConfig: (featureName: string, config: Record<string, any>, options?: Partial<AdvancedConfigOptions>) => AdvancedConfigOptions;
    createJoiSchema: (schema: ConfigSchema) => Record<string, any>;
    createClassValidatorSchema: (schema: ConfigSchema) => Record<string, any>;
    validateConfigSchema: (config: Record<string, any>, schema: ConfigSchema) => {
        valid: boolean;
        errors?: string[];
    };
    createSchemaValidator: (schema: ConfigSchema) => ((config: Record<string, any>) => boolean);
    mergeValidationSchemas: (schemas: ConfigSchema[]) => ConfigSchema;
    getTypedConfig: <T>(config: Record<string, any>, key: string, defaultValue?: T) => T;
    getCoercedConfig: <T>(config: Record<string, any>, key: string, type: "string" | "number" | "boolean", defaultValue?: T) => T;
    getValidatedConfig: <T>(config: Record<string, any>, key: string, validator: (value: T) => boolean, defaultValue?: T) => T;
    getBatchConfig: (config: Record<string, any>, keys: string[]) => Record<string, any>;
    getPrefixedConfig: (config: Record<string, any>, prefix: string) => Record<string, any>;
    buildHierarchicalConfig: (namespaces: Record<string, Record<string, any>>) => Record<string, any>;
    flattenConfig: (config: Record<string, any>, prefix?: string) => Record<string, any>;
    unflattenConfig: (config: Record<string, any>) => Record<string, any>;
    isolateNamespace: (namespace: string, config: Record<string, any>) => Record<string, any>;
    mergeNamespaceConfigs: (configs: Record<string, any>[], resolver?: (key: string, values: any[]) => any) => Record<string, any>;
    resolveSecretReferences: (config: Record<string, any>, resolver: (ref: string) => Promise<string>) => Promise<Record<string, any>>;
    createRotatingSecret: (secretName: string, fetcher: () => Promise<string>, rotationInterval: number) => (() => Promise<string>);
    encryptSecret: (secret: string, passphrase: string, salt?: string) => string;
    decryptSecret: (encryptedSecret: string, passphrase: string) => string;
    createSecretProvider: (provider: "aws" | "azure" | "vault" | "env", config: any) => ((key: string) => Promise<string>);
    transformConfig: (config: Record<string, any>, rules: ConfigTransformRule[]) => Record<string, any>;
    normalizeConfig: (config: Record<string, any>, options?: {
        trimStrings?: boolean;
        lowercaseKeys?: boolean;
        uppercaseKeys?: boolean;
        removeEmpty?: boolean;
        removeNull?: boolean;
    }) => Record<string, any>;
    castConfigTypes: (config: Record<string, any>, typeMap: Record<string, string>) => Record<string, any>;
    sanitizeForLogging: (config: Record<string, any>, sensitiveKeys?: string[]) => Record<string, any>;
    applyDefaults: (config: Record<string, any>, defaults: Record<string, any>) => Record<string, any>;
    watchConfigFiles: (filePaths: string[], callback: ConfigWatchCallback, debounceMs?: number) => (() => void);
    pollConfiguration: (loader: () => Promise<Record<string, any>>, intervalMs: number, callback: (config: Record<string, any>) => void) => (() => void);
    detectConfigChanges: (oldConfig: Record<string, any>, newConfig: Record<string, any>) => ConfigDiff;
    createHotReloadManager: (loader: () => Record<string, any>, validator: (config: Record<string, any>) => boolean) => {
        reload: () => Promise<boolean>;
        getConfig: () => Record<string, any>;
        getDiff: () => ConfigDiff;
    };
    gracefulReload: (config: Record<string, any>, newConfig: Record<string, any>, tester: (config: Record<string, any>) => Promise<boolean>) => Promise<{
        success: boolean;
        config: Record<string, any>;
    }>;
    createConfigSnapshot: (config: Record<string, any>, version?: string) => ConfigSnapshot;
    generateConfigHash: (config: Record<string, any>) => string;
    compareConfigVersions: (snapshot1: ConfigSnapshot, snapshot2: ConfigSnapshot) => boolean;
    createRemoteConfigLoader: (source: RemoteConfigSource) => (() => Promise<Record<string, any>>);
    createConfigBackupManager: (backupDir: string) => {
        save: (config: Record<string, any>, version: string) => Promise<void>;
        restore: (version: string) => Promise<Record<string, any>>;
        list: () => Promise<string[]>;
    };
    buildConfigOverrideChain: (configs: Record<string, any>[]) => Record<string, any>;
    exportConfig: (config: Record<string, any>, format: "json" | "yaml" | "env" | "ts") => string;
    importConfig: (content: string, format: "json" | "yaml" | "env") => Record<string, any>;
    generateConfigDocumentation: (schema: ConfigSchema, examples?: Record<string, any>) => string;
    testConfiguration: (config: Record<string, any>, tests: Array<{
        name: string;
        test: (config: any) => boolean;
    }>) => {
        passed: number;
        failed: number;
        results: any[];
    };
};
export default _default;
//# sourceMappingURL=configuration-kit.d.ts.map