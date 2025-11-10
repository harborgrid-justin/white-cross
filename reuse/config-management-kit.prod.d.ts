/**
 * LOC: CONFIG_MGT_PROD_001
 * File: /reuse/config-management-kit.prod.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/config
 *   - @nestjs/swagger
 *   - aws-sdk (Secrets Manager)
 *   - @azure/keyvault-secrets
 *   - @azure/identity
 *   - node-vault
 *   - zod
 *   - crypto
 *   - fs/promises
 *   - dotenv
 *
 * DOWNSTREAM (imported by):
 *   - App module configuration
 *   - Environment setup
 *   - Feature flag services
 *   - Config validation middleware
 *   - Dynamic config services
 *   - Secret management services
 */
import { DynamicModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { z } from 'zod';
/**
 * Environment types
 */
export declare enum Environment {
    DEVELOPMENT = "development",
    STAGING = "staging",
    PRODUCTION = "production",
    TEST = "test"
}
/**
 * Configuration source types
 */
export declare enum ConfigSource {
    ENV_FILE = "env_file",
    ENV_VARS = "env_vars",
    AWS_SECRETS = "aws_secrets",
    AZURE_KEYVAULT = "azure_keyvault",
    VAULT = "vault",
    CONSUL = "consul",
    ETCD = "etcd",
    DATABASE = "database"
}
/**
 * Secret storage providers
 */
export declare enum SecretProvider {
    AWS_SECRETS_MANAGER = "aws_secrets_manager",
    AZURE_KEY_VAULT = "azure_key_vault",
    HASHICORP_VAULT = "hashicorp_vault",
    GCP_SECRET_MANAGER = "gcp_secret_manager",
    LOCAL_ENCRYPTED = "local_encrypted"
}
/**
 * Feature flag evaluation types
 */
export declare enum FeatureFlagType {
    BOOLEAN = "boolean",
    STRING = "string",
    NUMBER = "number",
    JSON = "json",
    PERCENTAGE = "percentage",
    USER_SEGMENT = "user_segment"
}
/**
 * Configuration change event types
 */
export declare enum ConfigChangeEvent {
    CREATED = "created",
    UPDATED = "updated",
    DELETED = "deleted",
    RELOADED = "reloaded",
    VALIDATED = "validated"
}
/**
 * Configuration priority levels
 */
export declare enum ConfigPriority {
    DEFAULT = 0,
    ENV_FILE = 10,
    ENV_VAR = 20,
    SECRET_STORE = 30,
    RUNTIME_OVERRIDE = 40,
    EMERGENCY_OVERRIDE = 50
}
/**
 * Base configuration interface
 */
export interface BaseConfig {
    environment: Environment;
    nodeEnv: string;
    appName: string;
    appVersion: string;
    port: number;
    host: string;
    logLevel: string;
    debug: boolean;
}
/**
 * Database configuration
 */
export interface DatabaseConfig {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    ssl: boolean;
    synchronize: boolean;
    logging: boolean;
    poolMin: number;
    poolMax: number;
    connectionTimeout: number;
    idleTimeout: number;
}
/**
 * Redis configuration
 */
export interface RedisConfig {
    host: string;
    port: number;
    password?: string;
    db: number;
    ttl: number;
    maxRetriesPerRequest: number;
    enableReadyCheck: boolean;
    keyPrefix: string;
}
/**
 * JWT configuration
 */
export interface JWTConfig {
    secret: string;
    expiresIn: string;
    refreshExpiresIn: string;
    issuer: string;
    audience: string;
    algorithm: string;
}
/**
 * AWS configuration
 */
export interface AWSConfig {
    region: string;
    accessKeyId?: string;
    secretAccessKey?: string;
    s3Bucket: string;
    secretsManagerPrefix?: string;
}
/**
 * Secret metadata
 */
export interface SecretMetadata {
    name: string;
    provider: SecretProvider;
    version?: string;
    createdAt: Date;
    updatedAt: Date;
    expiresAt?: Date;
    rotationEnabled: boolean;
    rotationPeriodDays?: number;
    tags?: Record<string, string>;
}
/**
 * Secret value with metadata
 */
export interface Secret {
    key: string;
    value: string;
    metadata: SecretMetadata;
    encrypted: boolean;
}
/**
 * Feature flag configuration
 */
export interface FeatureFlag {
    key: string;
    name: string;
    description?: string;
    type: FeatureFlagType;
    enabled: boolean;
    value?: any;
    rolloutPercentage?: number;
    userSegments?: string[];
    environments?: Environment[];
    conditions?: FeatureFlagCondition[];
    metadata?: Record<string, any>;
}
/**
 * Feature flag condition
 */
export interface FeatureFlagCondition {
    attribute: string;
    operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'contains';
    value: any;
}
/**
 * Feature flag evaluation context
 */
export interface FeatureFlagContext {
    userId?: string;
    email?: string;
    role?: string;
    environment?: Environment;
    attributes?: Record<string, any>;
}
/**
 * Configuration validation result
 */
export interface ConfigValidationResult {
    isValid: boolean;
    errors: Array<{
        path: string;
        message: string;
        value?: any;
    }>;
    warnings: Array<{
        path: string;
        message: string;
    }>;
}
/**
 * Configuration change event
 */
export interface ConfigChange {
    event: ConfigChangeEvent;
    key: string;
    oldValue?: any;
    newValue?: any;
    source: ConfigSource;
    timestamp: Date;
    userId?: string;
    metadata?: Record<string, any>;
}
/**
 * Hierarchical configuration node
 */
export interface ConfigNode {
    key: string;
    value: any;
    priority: ConfigPriority;
    source: ConfigSource;
    children?: Map<string, ConfigNode>;
    metadata?: Record<string, any>;
}
/**
 * Configuration namespace
 */
export interface ConfigNamespace {
    name: string;
    prefix: string;
    schema?: z.ZodSchema;
    values: Map<string, any>;
    defaults?: Record<string, any>;
    validators?: Array<(config: any) => boolean>;
}
/**
 * Dynamic configuration options
 */
export interface DynamicConfigOptions {
}
/**
 * Encryption configuration
 */
export interface EncryptionConfig {
    algorithm: string;
    key: Buffer;
    iv?: Buffer;
    encoding?: BufferEncoding;
}
/**
 * Base application configuration schema
 */
export declare const BaseConfigSchema: any;
/**
 * Database configuration schema
 */
export declare const DatabaseConfigSchema: any;
/**
 * Redis configuration schema
 */
export declare const RedisConfigSchema: any;
/**
 * JWT configuration schema
 */
export declare const JWTConfigSchema: any;
/**
 * AWS configuration schema
 */
export declare const AWSConfigSchema: any;
/**
 * Feature flag schema
 */
export declare const FeatureFlagSchema: any;
/**
 * Secret metadata schema
 */
export declare const SecretMetadataSchema: any;
/**
 * Load environment variables from .env files based on NODE_ENV
 *
 * @param basePath - Base directory path for .env files
 * @param environment - Target environment (defaults to NODE_ENV)
 * @returns Loaded environment variables
 *
 * @example
 * ```typescript
 * const env = await loadEnvironmentConfig('/app', Environment.PRODUCTION);
 * console.log(env.DATABASE_HOST);
 * ```
 */
export declare function loadEnvironmentConfig(basePath: string, environment?: Environment): Promise<Record<string, string>>;
/**
 * Parse .env file content into key-value pairs
 *
 * @param content - Raw .env file content
 * @returns Parsed environment variables
 *
 * @example
 * ```typescript
 * const vars = parseEnvFile('DATABASE_HOST=localhost\nDATABASE_PORT=5432');
 * ```
 */
export declare function parseEnvFile(content: string): Record<string, string>;
/**
 * Validate environment configuration against Zod schema
 *
 * @param config - Configuration object to validate
 * @param schema - Zod schema for validation
 * @returns Validation result with errors
 *
 * @example
 * ```typescript
 * const result = validateConfig(config, DatabaseConfigSchema);
 * if (!result.isValid) {
 *   console.error(result.errors);
 * }
 * ```
 */
export declare function validateConfig<T>(config: unknown, schema: z.ZodSchema<T>): ConfigValidationResult;
/**
 * Get typed configuration value with default fallback
 *
 * @param configService - NestJS ConfigService instance
 * @param key - Configuration key (supports dot notation)
 * @param defaultValue - Default value if key not found
 * @returns Configuration value
 *
 * @example
 * ```typescript
 * const dbHost = getConfigValue(configService, 'database.host', 'localhost');
 * const port = getConfigValue(configService, 'port', 3000);
 * ```
 */
export declare function getConfigValue<T>(configService: ConfigService, key: string, defaultValue?: T): T;
/**
 * Get required configuration value or throw error
 *
 * @param configService - NestJS ConfigService instance
 * @param key - Configuration key (supports dot notation)
 * @returns Configuration value
 * @throws Error if key not found
 *
 * @example
 * ```typescript
 * const jwtSecret = getRequiredConfig(configService, 'jwt.secret');
 * ```
 */
export declare function getRequiredConfig<T>(configService: ConfigService, key: string): T;
/**
 * Create NestJS ConfigModule with custom options
 *
 * @param options - Configuration module options
 * @returns DynamicModule for ConfigModule
 *
 * @example
 * ```typescript
 * @Module({
 *   imports: [
 *     createConfigModule({
 *       envFilePath: ['.env.production', '.env'],
 *       validationSchema: ApplicationConfigSchema,
 *     }),
 *   ],
 * })
 * export class AppModule {}
 * ```
 */
export declare function createConfigModule(options?: {
    envFilePath?: string | string[];
    validationSchema?: z.ZodSchema;
    load?: Array<() => Record<string, any>>;
    isGlobal?: boolean;
    cache?: boolean;
    expandVariables?: boolean;
}): DynamicModule;
/**
 * Fetch secrets from AWS Secrets Manager
 *
 * @param secretName - Name/ARN of the secret
 * @param region - AWS region
 * @returns Secret value as JSON object
 *
 * @example
 * ```typescript
 * const dbCredentials = await fetchAWSSecret('prod/database', 'us-east-1');
 * console.log(dbCredentials.password);
 * ```
 */
export declare function fetchAWSSecret(secretName: string, region?: string): Promise<Record<string, any>>;
/**
 * Fetch secrets from Azure Key Vault
 *
 * @param vaultUrl - Azure Key Vault URL
 * @param secretName - Name of the secret
 * @returns Secret value
 *
 * @example
 * ```typescript
 * const apiKey = await fetchAzureSecret(
 *   'https://my-vault.vault.azure.net',
 *   'api-key'
 * );
 * ```
 */
export declare function fetchAzureSecret(vaultUrl: string, secretName: string): Promise<string>;
/**
 * Fetch secrets from HashiCorp Vault
 *
 * @param vaultAddr - Vault server address
 * @param secretPath - Path to secret in Vault
 * @param token - Vault authentication token
 * @returns Secret data
 *
 * @example
 * ```typescript
 * const secrets = await fetchVaultSecret(
 *   'https://vault.example.com',
 *   'secret/data/database',
 *   process.env.VAULT_TOKEN
 * );
 * ```
 */
export declare function fetchVaultSecret(vaultAddr: string, secretPath: string, token: string): Promise<Record<string, any>>;
/**
 * Load secrets from multiple providers into environment
 *
 * @param providers - Array of secret providers to load from
 * @returns Combined secrets from all providers
 *
 * @example
 * ```typescript
 * await loadSecretsToEnvironment([
 *   { provider: SecretProvider.AWS_SECRETS_MANAGER, secretName: 'prod/db' },
 *   { provider: SecretProvider.AZURE_KEY_VAULT, vaultUrl: '...', secretName: 'api-key' },
 * ]);
 * ```
 */
export declare function loadSecretsToEnvironment(providers: Array<{
    provider: SecretProvider;
    secretName?: string;
    vaultUrl?: string;
    secretPath?: string;
    region?: string;
}>): Promise<Record<string, any>>;
/**
 * Encrypt configuration value using AES-256-GCM
 *
 * @param value - Value to encrypt
 * @param encryptionKey - Encryption key (32 bytes for AES-256)
 * @returns Encrypted value with IV and auth tag
 *
 * @example
 * ```typescript
 * const encrypted = encryptConfigValue('my-secret', encryptionKey);
 * ```
 */
export declare function encryptConfigValue(value: string, encryptionKey: Buffer | string): string;
/**
 * Decrypt configuration value encrypted with AES-256-GCM
 *
 * @param encryptedValue - Encrypted value with IV and auth tag
 * @param encryptionKey - Decryption key (32 bytes for AES-256)
 * @returns Decrypted value
 *
 * @example
 * ```typescript
 * const decrypted = decryptConfigValue(encrypted, encryptionKey);
 * ```
 */
export declare function decryptConfigValue(encryptedValue: string, encryptionKey: Buffer | string): string;
/**
 * Generate secure encryption key for config encryption
 *
 * @returns 32-byte encryption key as hex string
 *
 * @example
 * ```typescript
 * const encryptionKey = generateEncryptionKey();
 * process.env.CONFIG_ENCRYPTION_KEY = encryptionKey;
 * ```
 */
export declare function generateEncryptionKey(): string;
/**
 * Evaluate feature flag for given context
 *
 * @param flag - Feature flag configuration
 * @param context - Evaluation context (user, environment, etc.)
 * @returns Whether flag is enabled for context
 *
 * @example
 * ```typescript
 * const isEnabled = evaluateFeatureFlag(flag, {
 *   userId: '123',
 *   role: 'admin',
 *   environment: Environment.PRODUCTION,
 * });
 * ```
 */
export declare function evaluateFeatureFlag(flag: FeatureFlag, context: FeatureFlagContext): boolean;
/**
 * Get feature flag value with type casting
 *
 * @param flag - Feature flag configuration
 * @param context - Evaluation context
 * @param defaultValue - Default value if flag is disabled
 * @returns Feature flag value or default
 *
 * @example
 * ```typescript
 * const maxUploadSize = getFeatureFlagValue<number>(
 *   uploadLimitFlag,
 *   context,
 *   10485760
 * );
 * ```
 */
export declare function getFeatureFlagValue<T>(flag: FeatureFlag, context: FeatureFlagContext, defaultValue: T): T;
/**
 * Create feature flag service for managing flags
 *
 * @example
 * ```typescript
 * const flagService = new FeatureFlagService();
 * flagService.addFlag({
 *   key: 'new-dashboard',
 *   name: 'New Dashboard UI',
 *   type: FeatureFlagType.BOOLEAN,
 *   enabled: true,
 *   rolloutPercentage: 50,
 * });
 * ```
 */
export declare class FeatureFlagService {
    private flags;
    addFlag(flag: FeatureFlag): void;
    getFlag(key: string): FeatureFlag | undefined;
    isEnabled(key: string, context: FeatureFlagContext): boolean;
    getValue<T>(key: string, context: FeatureFlagContext, defaultValue: T): T;
    getAllFlags(): FeatureFlag[];
    removeFlag(key: string): boolean;
}
/**
 * Merge configuration objects with priority-based override
 *
 * @param configs - Array of config objects with priorities
 * @returns Merged configuration
 *
 * @example
 * ```typescript
 * const merged = mergeConfigs([
 *   { config: defaults, priority: ConfigPriority.DEFAULT },
 *   { config: envVars, priority: ConfigPriority.ENV_VAR },
 *   { config: secrets, priority: ConfigPriority.SECRET_STORE },
 * ]);
 * ```
 */
export declare function mergeConfigs(configs: Array<{
    config: Record<string, any>;
    priority: ConfigPriority;
}>): Record<string, any>;
/**
 * Create configuration namespace with isolated scope
 *
 * @param name - Namespace name
 * @param prefix - Environment variable prefix
 * @param schema - Optional validation schema
 * @returns Configuration namespace
 *
 * @example
 * ```typescript
 * const dbNamespace = createConfigNamespace(
 *   'database',
 *   'DATABASE_',
 *   DatabaseConfigSchema
 * );
 * ```
 */
export declare function createConfigNamespace(name: string, prefix: string, schema?: z.ZodSchema): ConfigNamespace;
/**
 * Load configuration values into namespace from environment
 *
 * @param namespace - Target namespace
 * @param environment - Environment variables
 * @returns Loaded configuration object
 *
 * @example
 * ```typescript
 * const dbConfig = loadNamespaceConfig(dbNamespace, process.env);
 * ```
 */
export declare function loadNamespaceConfig(namespace: ConfigNamespace, environment: Record<string, string | undefined>): Record<string, any>;
/**
 * Watch configuration files for changes and reload
 *
 * @param filePaths - Array of file paths to watch
 * @param onChange - Callback when changes detected
 * @param interval - Watch interval in milliseconds
 * @returns Cleanup function to stop watching
 *
 * @example
 * ```typescript
 * const stopWatching = watchConfigFiles(
 *   ['.env', 'config/app.json'],
 *   async (changes) => {
 *     console.log('Config changed:', changes);
 *     await reloadApplication();
 *   },
 *   5000
 * );
 * ```
 */
export declare function watchConfigFiles(filePaths: string[], onChange: (changes: ConfigChange[]) => void | Promise<void>, interval?: number): () => void;
/**
 * Reload configuration dynamically without restart
 *
 * @param configService - NestJS ConfigService instance
 * @param newConfig - New configuration values
 * @param validate - Whether to validate before applying
 * @returns Whether reload was successful
 *
 * @example
 * ```typescript
 * const success = await reloadConfiguration(configService, {
 *   'database.poolMax': 20,
 *   'redis.ttl': 7200,
 * });
 * ```
 */
export declare function reloadConfiguration(configService: ConfigService, newConfig: Record<string, any>, validate?: boolean): Promise<boolean>;
/**
 * Create configuration change event
 *
 * @param event - Event type
 * @param key - Configuration key
 * @param oldValue - Previous value
 * @param newValue - New value
 * @param source - Configuration source
 * @returns Configuration change event
 */
export declare function createConfigChange(event: ConfigChangeEvent, key: string, oldValue: any, newValue: any, source: ConfigSource): ConfigChange;
/**
 * Configuration cache service
 */
export declare class ConfigCacheService {
    private cache;
    private defaultTTL;
    set(key: string, value: any, ttl?: number): void;
    get<T>(key: string): T | undefined;
    has(key: string): boolean;
    delete(key: string): boolean;
    clear(): void;
    getOrCompute<T>(key: string, compute: () => T | Promise<T>, ttl?: number): T | Promise<T>;
}
/**
 * Decorator to inject configuration value
 *
 * @param key - Configuration key
 * @param defaultValue - Default value if not found
 *
 * @example
 * ```typescript
 * @Injectable()
 * class MyService {
 *   constructor(
 *     @InjectConfig('database.host') private dbHost: string,
 *     @InjectConfig('port', 3000) private port: number,
 *   ) {}
 * }
 * ```
 */
export declare const InjectConfig: any;
/**
 * Decorator to mark feature flag requirement
 *
 * @param flagKey - Feature flag key
 *
 * @example
 * ```typescript
 * @Controller('new-feature')
 * export class NewFeatureController {
 *   @Get()
 *   @RequireFeatureFlag('new-dashboard')
 *   getDashboard() {
 *     return { message: 'New dashboard' };
 *   }
 * }
 * ```
 */
export declare const RequireFeatureFlag: (flagKey: string) => any;
/**
 * Check if value is a valid configuration object
 *
 * @param value - Value to check
 * @returns Whether value is valid config object
 */
export declare function isValidConfigObject(value: any): boolean;
/**
 * Sanitize configuration for logging (remove secrets)
 *
 * @param config - Configuration object
 * @param sensitiveKeys - Keys to redact
 * @returns Sanitized configuration
 *
 * @example
 * ```typescript
 * const safe = sanitizeConfig(config, ['password', 'secret', 'token']);
 * console.log(safe); // Secrets are [REDACTED]
 * ```
 */
export declare function sanitizeConfig(config: Record<string, any>, sensitiveKeys?: string[]): Record<string, any>;
/**
 * Export configuration to JSON file
 *
 * @param config - Configuration object
 * @param filePath - Output file path
 * @param sanitize - Whether to sanitize sensitive values
 *
 * @example
 * ```typescript
 * await exportConfigToFile(config, '/tmp/config-backup.json', true);
 * ```
 */
export declare function exportConfigToFile(config: Record<string, any>, filePath: string, sanitize?: boolean): Promise<void>;
/**
 * Import configuration from JSON file
 *
 * @param filePath - Input file path
 * @returns Configuration object
 *
 * @example
 * ```typescript
 * const config = await importConfigFromFile('/config/production.json');
 * ```
 */
export declare function importConfigFromFile(filePath: string): Promise<Record<string, any>>;
/**
 * Compare two configurations and return differences
 *
 * @param config1 - First configuration
 * @param config2 - Second configuration
 * @returns Array of configuration changes
 *
 * @example
 * ```typescript
 * const diffs = compareConfigs(oldConfig, newConfig);
 * diffs.forEach(diff => console.log(`${diff.key}: ${diff.oldValue} -> ${diff.newValue}`));
 * ```
 */
export declare function compareConfigs(config1: Record<string, any>, config2: Record<string, any>): ConfigChange[];
/**
 * Validate all configuration namespaces
 *
 * @param namespaces - Array of namespaces to validate
 * @param environment - Environment variables
 * @returns Combined validation result
 *
 * @example
 * ```typescript
 * const result = validateAllNamespaces(
 *   [dbNamespace, redisNamespace, jwtNamespace],
 *   process.env
 * );
 * ```
 */
export declare function validateAllNamespaces(namespaces: ConfigNamespace[], environment: Record<string, string | undefined>): ConfigValidationResult;
/**
 * Create configuration snapshot for rollback
 *
 * @param configService - NestJS ConfigService instance
 * @returns Configuration snapshot
 *
 * @example
 * ```typescript
 * const snapshot = createConfigSnapshot(configService);
 * // Make changes...
 * // Rollback if needed:
 * await restoreConfigSnapshot(configService, snapshot);
 * ```
 */
export declare function createConfigSnapshot(configService: ConfigService): Record<string, any>;
/**
 * Restore configuration from snapshot
 *
 * @param configService - NestJS ConfigService instance
 * @param snapshot - Configuration snapshot
 *
 * @example
 * ```typescript
 * await restoreConfigSnapshot(configService, snapshot);
 * ```
 */
export declare function restoreConfigSnapshot(configService: ConfigService, snapshot: Record<string, any>): Promise<void>;
declare const _default: {
    loadEnvironmentConfig: typeof loadEnvironmentConfig;
    parseEnvFile: typeof parseEnvFile;
    validateConfig: typeof validateConfig;
    getConfigValue: typeof getConfigValue;
    getRequiredConfig: typeof getRequiredConfig;
    createConfigModule: typeof createConfigModule;
    fetchAWSSecret: typeof fetchAWSSecret;
    fetchAzureSecret: typeof fetchAzureSecret;
    fetchVaultSecret: typeof fetchVaultSecret;
    loadSecretsToEnvironment: typeof loadSecretsToEnvironment;
    encryptConfigValue: typeof encryptConfigValue;
    decryptConfigValue: typeof decryptConfigValue;
    generateEncryptionKey: typeof generateEncryptionKey;
    evaluateFeatureFlag: typeof evaluateFeatureFlag;
    getFeatureFlagValue: typeof getFeatureFlagValue;
    FeatureFlagService: typeof FeatureFlagService;
    mergeConfigs: typeof mergeConfigs;
    createConfigNamespace: typeof createConfigNamespace;
    loadNamespaceConfig: typeof loadNamespaceConfig;
    watchConfigFiles: typeof watchConfigFiles;
    reloadConfiguration: typeof reloadConfiguration;
    createConfigChange: typeof createConfigChange;
    ConfigCacheService: typeof ConfigCacheService;
    isValidConfigObject: typeof isValidConfigObject;
    sanitizeConfig: typeof sanitizeConfig;
    exportConfigToFile: typeof exportConfigToFile;
    importConfigFromFile: typeof importConfigFromFile;
    compareConfigs: typeof compareConfigs;
    validateAllNamespaces: typeof validateAllNamespaces;
    createConfigSnapshot: typeof createConfigSnapshot;
    restoreConfigSnapshot: typeof restoreConfigSnapshot;
};
export default _default;
//# sourceMappingURL=config-management-kit.prod.d.ts.map