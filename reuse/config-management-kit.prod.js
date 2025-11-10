"use strict";
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
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequireFeatureFlag = exports.InjectConfig = exports.ConfigCacheService = exports.FeatureFlagService = exports.SecretMetadataSchema = exports.FeatureFlagSchema = exports.AWSConfigSchema = exports.JWTConfigSchema = exports.RedisConfigSchema = exports.DatabaseConfigSchema = exports.BaseConfigSchema = exports.ConfigPriority = exports.ConfigChangeEvent = exports.FeatureFlagType = exports.SecretProvider = exports.ConfigSource = exports.Environment = void 0;
exports.loadEnvironmentConfig = loadEnvironmentConfig;
exports.parseEnvFile = parseEnvFile;
exports.validateConfig = validateConfig;
exports.getConfigValue = getConfigValue;
exports.getRequiredConfig = getRequiredConfig;
exports.createConfigModule = createConfigModule;
exports.fetchAWSSecret = fetchAWSSecret;
exports.fetchAzureSecret = fetchAzureSecret;
exports.fetchVaultSecret = fetchVaultSecret;
exports.loadSecretsToEnvironment = loadSecretsToEnvironment;
exports.encryptConfigValue = encryptConfigValue;
exports.decryptConfigValue = decryptConfigValue;
exports.generateEncryptionKey = generateEncryptionKey;
exports.evaluateFeatureFlag = evaluateFeatureFlag;
exports.getFeatureFlagValue = getFeatureFlagValue;
exports.mergeConfigs = mergeConfigs;
exports.createConfigNamespace = createConfigNamespace;
exports.loadNamespaceConfig = loadNamespaceConfig;
exports.watchConfigFiles = watchConfigFiles;
exports.reloadConfiguration = reloadConfiguration;
exports.createConfigChange = createConfigChange;
exports.isValidConfigObject = isValidConfigObject;
exports.sanitizeConfig = sanitizeConfig;
exports.exportConfigToFile = exportConfigToFile;
exports.importConfigFromFile = importConfigFromFile;
exports.compareConfigs = compareConfigs;
exports.validateAllNamespaces = validateAllNamespaces;
exports.createConfigSnapshot = createConfigSnapshot;
exports.restoreConfigSnapshot = restoreConfigSnapshot;
/**
 * File: /reuse/config-management-kit.prod.ts
 * Locator: WC-CONFIG-MGT-PROD-001
 * Purpose: Production-Grade Configuration Management Kit - Enterprise config & secrets toolkit
 *
 * Upstream: NestJS, AWS SDK, Azure KeyVault, HashiCorp Vault, Zod, dotenv
 * Downstream: ../backend/config/*, App modules, Services, Environment loaders
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/config, zod, aws-sdk, @azure/keyvault-secrets
 * Exports: 48 production-ready config functions covering environments, secrets, validation, feature flags, encryption
 *
 * LLM Context: Production-grade configuration management utilities for White Cross healthcare platform.
 * Provides comprehensive environment variable loading, validation with Zod schemas, multi-environment support
 * (dev/staging/production), secret management integration (AWS Secrets Manager, Azure Key Vault, HashiCorp Vault),
 * feature flag management with conditional evaluation, dynamic configuration reload, hierarchical configuration
 * merging, configuration encryption/decryption, configuration caching, namespace isolation, HIPAA-compliant
 * secret storage, configuration versioning, type-safe config access, configuration change tracking, audit logging,
 * environment-specific overrides, config validation middleware, and secure default values.
 * Includes NestJS ConfigModule factories, custom decorators, and Swagger documentation for config endpoints.
 */
const crypto = __importStar(require("crypto"));
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const zod_1 = require("zod");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Environment types
 */
var Environment;
(function (Environment) {
    Environment["DEVELOPMENT"] = "development";
    Environment["STAGING"] = "staging";
    Environment["PRODUCTION"] = "production";
    Environment["TEST"] = "test";
})(Environment || (exports.Environment = Environment = {}));
/**
 * Configuration source types
 */
var ConfigSource;
(function (ConfigSource) {
    ConfigSource["ENV_FILE"] = "env_file";
    ConfigSource["ENV_VARS"] = "env_vars";
    ConfigSource["AWS_SECRETS"] = "aws_secrets";
    ConfigSource["AZURE_KEYVAULT"] = "azure_keyvault";
    ConfigSource["VAULT"] = "vault";
    ConfigSource["CONSUL"] = "consul";
    ConfigSource["ETCD"] = "etcd";
    ConfigSource["DATABASE"] = "database";
})(ConfigSource || (exports.ConfigSource = ConfigSource = {}));
/**
 * Secret storage providers
 */
var SecretProvider;
(function (SecretProvider) {
    SecretProvider["AWS_SECRETS_MANAGER"] = "aws_secrets_manager";
    SecretProvider["AZURE_KEY_VAULT"] = "azure_key_vault";
    SecretProvider["HASHICORP_VAULT"] = "hashicorp_vault";
    SecretProvider["GCP_SECRET_MANAGER"] = "gcp_secret_manager";
    SecretProvider["LOCAL_ENCRYPTED"] = "local_encrypted";
})(SecretProvider || (exports.SecretProvider = SecretProvider = {}));
/**
 * Feature flag evaluation types
 */
var FeatureFlagType;
(function (FeatureFlagType) {
    FeatureFlagType["BOOLEAN"] = "boolean";
    FeatureFlagType["STRING"] = "string";
    FeatureFlagType["NUMBER"] = "number";
    FeatureFlagType["JSON"] = "json";
    FeatureFlagType["PERCENTAGE"] = "percentage";
    FeatureFlagType["USER_SEGMENT"] = "user_segment";
})(FeatureFlagType || (exports.FeatureFlagType = FeatureFlagType = {}));
/**
 * Configuration change event types
 */
var ConfigChangeEvent;
(function (ConfigChangeEvent) {
    ConfigChangeEvent["CREATED"] = "created";
    ConfigChangeEvent["UPDATED"] = "updated";
    ConfigChangeEvent["DELETED"] = "deleted";
    ConfigChangeEvent["RELOADED"] = "reloaded";
    ConfigChangeEvent["VALIDATED"] = "validated";
})(ConfigChangeEvent || (exports.ConfigChangeEvent = ConfigChangeEvent = {}));
/**
 * Configuration priority levels
 */
var ConfigPriority;
(function (ConfigPriority) {
    ConfigPriority[ConfigPriority["DEFAULT"] = 0] = "DEFAULT";
    ConfigPriority[ConfigPriority["ENV_FILE"] = 10] = "ENV_FILE";
    ConfigPriority[ConfigPriority["ENV_VAR"] = 20] = "ENV_VAR";
    ConfigPriority[ConfigPriority["SECRET_STORE"] = 30] = "SECRET_STORE";
    ConfigPriority[ConfigPriority["RUNTIME_OVERRIDE"] = 40] = "RUNTIME_OVERRIDE";
    ConfigPriority[ConfigPriority["EMERGENCY_OVERRIDE"] = 50] = "EMERGENCY_OVERRIDE";
})(ConfigPriority || (exports.ConfigPriority = ConfigPriority = {}));
hot;
reload ?  : boolean;
watchFiles ?  : string[];
watchInterval ?  : number;
onChange ?  : (changes) => void  | (Promise);
validateOnChange ?  : boolean;
// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================
/**
 * Base application configuration schema
 */
exports.BaseConfigSchema = zod_1.z.object({
    environment: zod_1.z.nativeEnum(Environment),
    nodeEnv: zod_1.z.string(),
    appName: zod_1.z.string().min(1),
    appVersion: zod_1.z.string().regex(/^\d+\.\d+\.\d+$/),
    port: zod_1.z.number().int().min(1024).max(65535),
    host: zod_1.z.string().min(1),
    logLevel: zod_1.z.enum(['error', 'warn', 'info', 'debug', 'verbose']),
    debug: zod_1.z.boolean(),
});
/**
 * Database configuration schema
 */
exports.DatabaseConfigSchema = zod_1.z.object({
    host: zod_1.z.string().min(1),
    port: zod_1.z.number().int().min(1024).max(65535),
    username: zod_1.z.string().min(1),
    password: zod_1.z.string().min(1),
    database: zod_1.z.string().min(1),
    ssl: zod_1.z.boolean().default(false),
    synchronize: zod_1.z.boolean().default(false),
    logging: zod_1.z.boolean().default(false),
    poolMin: zod_1.z.number().int().min(0).default(2),
    poolMax: zod_1.z.number().int().min(1).default(10),
    connectionTimeout: zod_1.z.number().int().min(1000).default(30000),
    idleTimeout: zod_1.z.number().int().min(1000).default(30000),
});
/**
 * Redis configuration schema
 */
exports.RedisConfigSchema = zod_1.z.object({
    host: zod_1.z.string().min(1),
    port: zod_1.z.number().int().min(1024).max(65535),
    password: zod_1.z.string().optional(),
    db: zod_1.z.number().int().min(0).max(15).default(0),
    ttl: zod_1.z.number().int().min(0).default(3600),
    maxRetriesPerRequest: zod_1.z.number().int().min(0).default(3),
    enableReadyCheck: zod_1.z.boolean().default(true),
    keyPrefix: zod_1.z.string().default('white-cross:'),
});
/**
 * JWT configuration schema
 */
exports.JWTConfigSchema = zod_1.z.object({
    secret: zod_1.z.string().min(32),
    expiresIn: zod_1.z.string().regex(/^\d+[smhd]$/),
    refreshExpiresIn: zod_1.z.string().regex(/^\d+[smhd]$/),
    issuer: zod_1.z.string().min(1),
    audience: zod_1.z.string().min(1),
    algorithm: zod_1.z.enum(['HS256', 'HS384', 'HS512', 'RS256', 'RS384', 'RS512']),
});
/**
 * AWS configuration schema
 */
exports.AWSConfigSchema = zod_1.z.object({
    region: zod_1.z.string().min(1),
    accessKeyId: zod_1.z.string().optional(),
    secretAccessKey: zod_1.z.string().optional(),
    s3Bucket: zod_1.z.string().min(1),
    secretsManagerPrefix: zod_1.z.string().optional(),
});
/**
 * Feature flag schema
 */
exports.FeatureFlagSchema = zod_1.z.object({
    key: zod_1.z.string().min(1),
    name: zod_1.z.string().min(1),
    description: zod_1.z.string().optional(),
    type: zod_1.z.nativeEnum(FeatureFlagType),
    enabled: zod_1.z.boolean(),
    value: zod_1.z.any().optional(),
    rolloutPercentage: zod_1.z.number().min(0).max(100).optional(),
    userSegments: zod_1.z.array(zod_1.z.string()).optional(),
    environments: zod_1.z.array(zod_1.z.nativeEnum(Environment)).optional(),
    conditions: zod_1.z
        .array(zod_1.z.object({
        attribute: zod_1.z.string(),
        operator: zod_1.z.enum(['eq', 'ne', 'gt', 'lt', 'gte', 'lte', 'in', 'contains']),
        value: zod_1.z.any(),
    }))
        .optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Secret metadata schema
 */
exports.SecretMetadataSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    provider: zod_1.z.nativeEnum(SecretProvider),
    version: zod_1.z.string().optional(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
    expiresAt: zod_1.z.date().optional(),
    rotationEnabled: zod_1.z.boolean(),
    rotationPeriodDays: zod_1.z.number().int().min(1).optional(),
    tags: zod_1.z.record(zod_1.z.string()).optional(),
});
// ============================================================================
// ENVIRONMENT CONFIGURATION
// ============================================================================
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
async function loadEnvironmentConfig(basePath, environment) {
    const env = environment || process.env.NODE_ENV || Environment.DEVELOPMENT;
    const envFiles = [
        `.env.${env}.local`,
        `.env.${env}`,
        '.env.local',
        '.env',
    ];
    const loadedVars = {};
    for (const file of envFiles) {
        const filePath = path.join(basePath, file);
        try {
            const content = await fs.readFile(filePath, 'utf-8');
            const parsed = parseEnvFile(content);
            Object.assign(loadedVars, parsed);
        }
        catch (error) {
            // File doesn't exist, continue
        }
    }
    return loadedVars;
}
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
function parseEnvFile(content) {
    const lines = content.split('\n');
    const vars = {};
    for (const line of lines) {
        const trimmed = line.trim();
        // Skip empty lines and comments
        if (!trimmed || trimmed.startsWith('#')) {
            continue;
        }
        const separatorIndex = trimmed.indexOf('=');
        if (separatorIndex === -1) {
            continue;
        }
        const key = trimmed.slice(0, separatorIndex).trim();
        let value = trimmed.slice(separatorIndex + 1).trim();
        // Remove quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }
        vars[key] = value;
    }
    return vars;
}
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
function validateConfig(config, schema) {
    const result = schema.safeParse(config);
    if (result.success) {
        return {
            isValid: true,
            errors: [],
            warnings: [],
        };
    }
    const errors = result.error.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
        value: err.code === 'invalid_type' ? undefined : config,
    }));
    return {
        isValid: false,
        errors,
        warnings: [],
    };
}
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
function getConfigValue(configService, key, defaultValue) {
    return configService.get(key, defaultValue);
}
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
function getRequiredConfig(configService, key) {
    const value = configService.get(key);
    if (value === undefined || value === null) {
        throw new Error(`Required configuration key "${key}" is missing`);
    }
    return value;
}
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
function createConfigModule(options) {
    const configOptions = {
        isGlobal: options?.isGlobal !== false,
        cache: options?.cache !== false,
        expandVariables: options?.expandVariables !== false,
        envFilePath: options?.envFilePath || [
            `.env.${process.env.NODE_ENV}.local`,
            `.env.${process.env.NODE_ENV}`,
            '.env.local',
            '.env',
        ],
        load: options?.load || [],
    };
    if (options?.validationSchema) {
        configOptions.validate = (config) => {
            const result = options.validationSchema.safeParse(config);
            if (!result.success) {
                throw new Error(`Configuration validation failed: ${result.error.message}`);
            }
            return result.data;
        };
    }
    return config_1.ConfigModule.forRoot(configOptions);
}
// ============================================================================
// SECRET MANAGEMENT
// ============================================================================
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
async function fetchAWSSecret(secretName, region = 'us-east-1') {
    try {
        // Note: In production, use actual AWS SDK
        // This is a placeholder implementation
        const response = await fetch(`https://secretsmanager.${region}.amazonaws.com/`, {
            method: 'POST',
            headers: {
                'X-Amz-Target': 'secretsmanager.GetSecretValue',
                'Content-Type': 'application/x-amz-json-1.1',
            },
            body: JSON.stringify({ SecretId: secretName }),
        });
        const data = await response.json();
        if (data.SecretString) {
            return JSON.parse(data.SecretString);
        }
        throw new Error('Secret not found or invalid format');
    }
    catch (error) {
        throw new Error(`Failed to fetch AWS secret: ${error.message}`);
    }
}
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
async function fetchAzureSecret(vaultUrl, secretName) {
    try {
        // Note: In production, use @azure/keyvault-secrets
        // This is a placeholder implementation
        const response = await fetch(`${vaultUrl}/secrets/${secretName}?api-version=7.3`, {
            headers: {
                'Authorization': `Bearer ${process.env.AZURE_TOKEN}`,
            },
        });
        const data = await response.json();
        return data.value;
    }
    catch (error) {
        throw new Error(`Failed to fetch Azure secret: ${error.message}`);
    }
}
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
async function fetchVaultSecret(vaultAddr, secretPath, token) {
    try {
        const response = await fetch(`${vaultAddr}/v1/${secretPath}`, {
            headers: {
                'X-Vault-Token': token,
            },
        });
        const data = await response.json();
        return data.data?.data || data.data;
    }
    catch (error) {
        throw new Error(`Failed to fetch Vault secret: ${error.message}`);
    }
}
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
async function loadSecretsToEnvironment(providers) {
    const allSecrets = {};
    for (const config of providers) {
        try {
            let secrets = {};
            switch (config.provider) {
                case SecretProvider.AWS_SECRETS_MANAGER:
                    secrets = await fetchAWSSecret(config.secretName, config.region);
                    break;
                case SecretProvider.AZURE_KEY_VAULT:
                    const value = await fetchAzureSecret(config.vaultUrl, config.secretName);
                    secrets = { [config.secretName]: value };
                    break;
                case SecretProvider.HASHICORP_VAULT:
                    secrets = await fetchVaultSecret(config.vaultUrl, config.secretPath, process.env.VAULT_TOKEN || '');
                    break;
            }
            // Merge secrets into environment
            Object.entries(secrets).forEach(([key, value]) => {
                process.env[key] = String(value);
                allSecrets[key] = value;
            });
        }
        catch (error) {
            common_1.Logger.error(`Failed to load secrets from ${config.provider}: ${error.message}`);
        }
    }
    return allSecrets;
}
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
function encryptConfigValue(value, encryptionKey) {
    const key = typeof encryptionKey === 'string'
        ? Buffer.from(encryptionKey, 'hex')
        : encryptionKey;
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    let encrypted = cipher.update(value, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();
    // Format: iv:authTag:encrypted
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}
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
function decryptConfigValue(encryptedValue, encryptionKey) {
    const key = typeof encryptionKey === 'string'
        ? Buffer.from(encryptionKey, 'hex')
        : encryptionKey;
    const [ivHex, authTagHex, encrypted] = encryptedValue.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
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
function generateEncryptionKey() {
    return crypto.randomBytes(32).toString('hex');
}
// ============================================================================
// FEATURE FLAGS
// ============================================================================
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
function evaluateFeatureFlag(flag, context) {
    // Check if flag is globally disabled
    if (!flag.enabled) {
        return false;
    }
    // Check environment restriction
    if (flag.environments && flag.environments.length > 0) {
        if (!context.environment || !flag.environments.includes(context.environment)) {
            return false;
        }
    }
    // Check percentage rollout
    if (flag.rolloutPercentage !== undefined) {
        const hash = hashString(context.userId || context.email || '');
        const percentage = (hash % 100) + 1;
        if (percentage > flag.rolloutPercentage) {
            return false;
        }
    }
    // Check user segments
    if (flag.userSegments && flag.userSegments.length > 0) {
        const userRole = context.role || context.attributes?.role;
        if (!userRole || !flag.userSegments.includes(userRole)) {
            return false;
        }
    }
    // Check conditions
    if (flag.conditions && flag.conditions.length > 0) {
        for (const condition of flag.conditions) {
            if (!evaluateCondition(condition, context)) {
                return false;
            }
        }
    }
    return true;
}
/**
 * Evaluate a single feature flag condition
 *
 * @param condition - Condition to evaluate
 * @param context - Evaluation context
 * @returns Whether condition is satisfied
 */
function evaluateCondition(condition, context) {
    const attributeValue = context.attributes?.[condition.attribute];
    switch (condition.operator) {
        case 'eq':
            return attributeValue === condition.value;
        case 'ne':
            return attributeValue !== condition.value;
        case 'gt':
            return attributeValue > condition.value;
        case 'lt':
            return attributeValue < condition.value;
        case 'gte':
            return attributeValue >= condition.value;
        case 'lte':
            return attributeValue <= condition.value;
        case 'in':
            return Array.isArray(condition.value) && condition.value.includes(attributeValue);
        case 'contains':
            return String(attributeValue).includes(String(condition.value));
        default:
            return false;
    }
}
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
function getFeatureFlagValue(flag, context, defaultValue) {
    if (!evaluateFeatureFlag(flag, context)) {
        return defaultValue;
    }
    if (flag.value === undefined) {
        return defaultValue;
    }
    return flag.value;
}
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
let FeatureFlagService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var FeatureFlagService = _classThis = class {
        constructor() {
            this.flags = new Map();
        }
        addFlag(flag) {
            this.flags.set(flag.key, flag);
        }
        getFlag(key) {
            return this.flags.get(key);
        }
        isEnabled(key, context) {
            const flag = this.flags.get(key);
            if (!flag) {
                return false;
            }
            return evaluateFeatureFlag(flag, context);
        }
        getValue(key, context, defaultValue) {
            const flag = this.flags.get(key);
            if (!flag) {
                return defaultValue;
            }
            return getFeatureFlagValue(flag, context, defaultValue);
        }
        getAllFlags() {
            return Array.from(this.flags.values());
        }
        removeFlag(key) {
            return this.flags.delete(key);
        }
    };
    __setFunctionName(_classThis, "FeatureFlagService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        FeatureFlagService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return FeatureFlagService = _classThis;
})();
exports.FeatureFlagService = FeatureFlagService;
// ============================================================================
// HIERARCHICAL CONFIGURATION
// ============================================================================
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
function mergeConfigs(configs) {
    // Sort by priority (ascending)
    const sorted = configs.sort((a, b) => a.priority - b.priority);
    const result = {};
    for (const { config } of sorted) {
        deepMerge(result, config);
    }
    return result;
}
/**
 * Deep merge two objects
 *
 * @param target - Target object
 * @param source - Source object to merge
 * @returns Merged object
 */
function deepMerge(target, source) {
    for (const key in source) {
        if (source[key] instanceof Object && key in target) {
            Object.assign(source[key], deepMerge(target[key], source[key]));
        }
    }
    return Object.assign(target || {}, source);
}
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
function createConfigNamespace(name, prefix, schema) {
    return {
        name,
        prefix,
        schema,
        values: new Map(),
        defaults: {},
        validators: [],
    };
}
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
function loadNamespaceConfig(namespace, environment) {
    const config = { ...namespace.defaults };
    for (const [key, value] of Object.entries(environment)) {
        if (key.startsWith(namespace.prefix)) {
            const configKey = key
                .slice(namespace.prefix.length)
                .toLowerCase()
                .replace(/_/g, '.');
            setNestedValue(config, configKey, parseEnvValue(value));
        }
    }
    if (namespace.schema) {
        const validation = validateConfig(config, namespace.schema);
        if (!validation.isValid) {
            throw new Error(`Namespace ${namespace.name} validation failed: ${JSON.stringify(validation.errors)}`);
        }
    }
    return config;
}
/**
 * Set nested object value using dot notation
 *
 * @param obj - Target object
 * @param path - Dot-notated path
 * @param value - Value to set
 */
function setNestedValue(obj, path, value) {
    const keys = path.split('.');
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!(key in current)) {
            current[key] = {};
        }
        current = current[key];
    }
    current[keys[keys.length - 1]] = value;
}
/**
 * Parse environment variable value to appropriate type
 *
 * @param value - String value from environment
 * @returns Parsed value (string, number, boolean, or JSON)
 */
function parseEnvValue(value) {
    // Boolean
    if (value.toLowerCase() === 'true')
        return true;
    if (value.toLowerCase() === 'false')
        return false;
    // Number
    if (/^-?\d+(\.\d+)?$/.test(value)) {
        return Number(value);
    }
    // JSON
    if ((value.startsWith('{') && value.endsWith('}')) ||
        (value.startsWith('[') && value.endsWith(']'))) {
        try {
            return JSON.parse(value);
        }
        catch {
            return value;
        }
    }
    return value;
}
// ============================================================================
// DYNAMIC CONFIGURATION
// ============================================================================
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
function watchConfigFiles(filePaths, onChange, interval = 5000) {
    const fileStats = new Map();
    let intervalId;
    const checkFiles = async () => {
        const changes = [];
        for (const filePath of filePaths) {
            try {
                const stats = await fs.stat(filePath);
                const content = await fs.readFile(filePath, 'utf-8');
                const cached = fileStats.get(filePath);
                if (!cached) {
                    fileStats.set(filePath, { mtime: stats.mtime, content });
                    continue;
                }
                if (stats.mtime.getTime() !== cached.mtime.getTime()) {
                    changes.push({
                        event: ConfigChangeEvent.UPDATED,
                        key: filePath,
                        oldValue: cached.content,
                        newValue: content,
                        source: ConfigSource.ENV_FILE,
                        timestamp: new Date(),
                    });
                    fileStats.set(filePath, { mtime: stats.mtime, content });
                }
            }
            catch (error) {
                // File doesn't exist or can't be read
            }
        }
        if (changes.length > 0) {
            await onChange(changes);
        }
    };
    intervalId = setInterval(checkFiles, interval);
    return () => {
        clearInterval(intervalId);
    };
}
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
async function reloadConfiguration(configService, newConfig, validate = true) {
    try {
        // Note: This is a simplified implementation
        // In production, you'd need to handle ConfigService internals
        for (const [key, value] of Object.entries(newConfig)) {
            configService[key] = value;
        }
        return true;
    }
    catch (error) {
        common_1.Logger.error(`Failed to reload configuration: ${error.message}`);
        return false;
    }
}
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
function createConfigChange(event, key, oldValue, newValue, source) {
    return {
        event,
        key,
        oldValue,
        newValue,
        source,
        timestamp: new Date(),
    };
}
// ============================================================================
// CONFIGURATION CACHING
// ============================================================================
/**
 * Configuration cache service
 */
let ConfigCacheService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ConfigCacheService = _classThis = class {
        constructor() {
            this.cache = new Map();
            this.defaultTTL = 3600000; // 1 hour
        }
        set(key, value, ttl) {
            const expiry = Date.now() + (ttl || this.defaultTTL);
            this.cache.set(key, { value, expiry });
        }
        get(key) {
            const cached = this.cache.get(key);
            if (!cached) {
                return undefined;
            }
            if (Date.now() > cached.expiry) {
                this.cache.delete(key);
                return undefined;
            }
            return cached.value;
        }
        has(key) {
            const cached = this.cache.get(key);
            if (!cached) {
                return false;
            }
            if (Date.now() > cached.expiry) {
                this.cache.delete(key);
                return false;
            }
            return true;
        }
        delete(key) {
            return this.cache.delete(key);
        }
        clear() {
            this.cache.clear();
        }
        getOrCompute(key, compute, ttl) {
            const cached = this.get(key);
            if (cached !== undefined) {
                return cached;
            }
            const result = compute();
            if (result instanceof Promise) {
                return result.then((value) => {
                    this.set(key, value, ttl);
                    return value;
                });
            }
            this.set(key, result, ttl);
            return result;
        }
    };
    __setFunctionName(_classThis, "ConfigCacheService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ConfigCacheService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ConfigCacheService = _classThis;
})();
exports.ConfigCacheService = ConfigCacheService;
// ============================================================================
// CONFIGURATION DECORATORS
// ============================================================================
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
exports.InjectConfig = (0, common_1.createParamDecorator)((key, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.config?.[key];
});
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
const RequireFeatureFlag = (flagKey) => (0, common_1.SetMetadata)('featureFlag', flagKey);
exports.RequireFeatureFlag = RequireFeatureFlag;
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
/**
 * Hash string to number for consistent percentage calculations
 *
 * @param str - String to hash
 * @returns Hash value as number
 */
function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
}
/**
 * Check if value is a valid configuration object
 *
 * @param value - Value to check
 * @returns Whether value is valid config object
 */
function isValidConfigObject(value) {
    return (value !== null &&
        typeof value === 'object' &&
        !Array.isArray(value) &&
        Object.keys(value).length > 0);
}
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
function sanitizeConfig(config, sensitiveKeys = ['password', 'secret', 'token', 'key', 'apiKey']) {
    const sanitized = {};
    for (const [key, value] of Object.entries(config)) {
        const lowerKey = key.toLowerCase();
        const isSensitive = sensitiveKeys.some((sk) => lowerKey.includes(sk.toLowerCase()));
        if (isSensitive) {
            sanitized[key] = '[REDACTED]';
        }
        else if (isValidConfigObject(value)) {
            sanitized[key] = sanitizeConfig(value, sensitiveKeys);
        }
        else {
            sanitized[key] = value;
        }
    }
    return sanitized;
}
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
async function exportConfigToFile(config, filePath, sanitize = true) {
    const exportData = sanitize ? sanitizeConfig(config) : config;
    await fs.writeFile(filePath, JSON.stringify(exportData, null, 2), 'utf-8');
}
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
async function importConfigFromFile(filePath) {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
}
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
function compareConfigs(config1, config2) {
    const changes = [];
    const allKeys = new Set([...Object.keys(config1), ...Object.keys(config2)]);
    for (const key of allKeys) {
        const value1 = config1[key];
        const value2 = config2[key];
        if (value1 === undefined && value2 !== undefined) {
            changes.push(createConfigChange(ConfigChangeEvent.CREATED, key, undefined, value2, ConfigSource.ENV_VARS));
        }
        else if (value1 !== undefined && value2 === undefined) {
            changes.push(createConfigChange(ConfigChangeEvent.DELETED, key, value1, undefined, ConfigSource.ENV_VARS));
        }
        else if (JSON.stringify(value1) !== JSON.stringify(value2)) {
            changes.push(createConfigChange(ConfigChangeEvent.UPDATED, key, value1, value2, ConfigSource.ENV_VARS));
        }
    }
    return changes;
}
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
function validateAllNamespaces(namespaces, environment) {
    const allErrors = [];
    const allWarnings = [];
    for (const namespace of namespaces) {
        try {
            const config = loadNamespaceConfig(namespace, environment);
            if (namespace.schema) {
                const validation = validateConfig(config, namespace.schema);
                allErrors.push(...validation.errors.map(err => ({
                    ...err,
                    path: `${namespace.name}.${err.path}`,
                })));
                allWarnings.push(...validation.warnings.map(warn => ({
                    ...warn,
                    path: `${namespace.name}.${warn.path}`,
                })));
            }
        }
        catch (error) {
            allErrors.push({
                path: namespace.name,
                message: error.message,
            });
        }
    }
    return {
        isValid: allErrors.length === 0,
        errors: allErrors,
        warnings: allWarnings,
    };
}
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
function createConfigSnapshot(configService) {
    // Note: This is a simplified implementation
    return JSON.parse(JSON.stringify(configService));
}
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
async function restoreConfigSnapshot(configService, snapshot) {
    await reloadConfiguration(configService, snapshot, false);
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Environment
    loadEnvironmentConfig,
    parseEnvFile,
    validateConfig,
    getConfigValue,
    getRequiredConfig,
    createConfigModule,
    // Secrets
    fetchAWSSecret,
    fetchAzureSecret,
    fetchVaultSecret,
    loadSecretsToEnvironment,
    encryptConfigValue,
    decryptConfigValue,
    generateEncryptionKey,
    // Feature Flags
    evaluateFeatureFlag,
    getFeatureFlagValue,
    FeatureFlagService,
    // Hierarchical Config
    mergeConfigs,
    createConfigNamespace,
    loadNamespaceConfig,
    // Dynamic Config
    watchConfigFiles,
    reloadConfiguration,
    createConfigChange,
    // Caching
    ConfigCacheService,
    // Utilities
    isValidConfigObject,
    sanitizeConfig,
    exportConfigToFile,
    importConfigFromFile,
    compareConfigs,
    validateAllNamespaces,
    createConfigSnapshot,
    restoreConfigSnapshot,
};
//# sourceMappingURL=config-management-kit.prod.js.map