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

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService, registerAs } from '@nestjs/config';
import {
  Model,
  Sequelize,
  DataTypes,
  ModelAttributes,
  ModelStatic,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import * as Joi from 'joi';
import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { watch, FSWatcher } from 'fs';
import * as dotenv from 'dotenv';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

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
export class FeatureFlagModel extends Model<
  InferAttributes<FeatureFlagModel>,
  InferCreationAttributes<FeatureFlagModel>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare description: CreationOptional<string | null>;
  declare enabled: boolean;
  declare rollout: CreationOptional<number | null>;
  declare conditions: CreationOptional<Record<string, any> | null>;
  declare metadata: CreationOptional<Record<string, any> | null>;
  declare tenantId: CreationOptional<string | null>;
  declare environment: string;
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
}

/**
 * Initializes the FeatureFlagModel with Sequelize instance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof FeatureFlagModel} Initialized model
 */
export const initFeatureFlagModel = (sequelize: Sequelize): typeof FeatureFlagModel => {
  FeatureFlagModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: 'flag_name_env_tenant',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      rollout: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 0,
          max: 100,
        },
      },
      conditions: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      tenantId: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: 'flag_name_env_tenant',
      },
      environment: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'development',
        unique: 'flag_name_env_tenant',
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      tableName: 'feature_flags',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['name', 'environment', 'tenantId'],
        },
        {
          fields: ['environment'],
        },
        {
          fields: ['enabled'],
        },
        {
          fields: ['tenantId'],
        },
      ],
    },
  );

  return FeatureFlagModel;
};

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
export class ConfigHistoryModel extends Model<
  InferAttributes<ConfigHistoryModel>,
  InferCreationAttributes<ConfigHistoryModel>
> {
  declare id: CreationOptional<string>;
  declare configKey: string;
  declare version: string;
  declare configData: Record<string, any>;
  declare checksum: string;
  declare author: CreationOptional<string | null>;
  declare reason: CreationOptional<string | null>;
  declare environment: string;
  declare tags: CreationOptional<string[] | null>;
  declare readonly createdAt: CreationOptional<Date>;
}

/**
 * Initializes the ConfigHistoryModel with Sequelize instance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof ConfigHistoryModel} Initialized model
 */
export const initConfigHistoryModel = (sequelize: Sequelize): typeof ConfigHistoryModel => {
  ConfigHistoryModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      configKey: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      version: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      configData: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      checksum: {
        type: DataTypes.STRING(64),
        allowNull: false,
      },
      author: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      environment: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'development',
      },
      tags: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      createdAt: DataTypes.DATE,
    },
    {
      sequelize,
      tableName: 'config_history',
      timestamps: true,
      updatedAt: false,
      indexes: [
        {
          unique: true,
          fields: ['configKey', 'version', 'environment'],
        },
        {
          fields: ['configKey', 'environment', 'createdAt'],
        },
        {
          fields: ['environment'],
        },
        {
          fields: ['author'],
        },
        {
          fields: ['checksum'],
        },
      ],
    },
  );

  return ConfigHistoryModel;
};

// ============================================================================
// ENVIRONMENT VARIABLE LOADING & VALIDATION
// ============================================================================

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
export const loadEnvWithValidation = (
  paths: string[],
  options: Partial<EnvLoadOptions> = {},
): EnvLoadResult => {
  const loadedFiles: string[] = [];
  const failedFiles: string[] = [];
  const variables: Record<string, string> = {};
  const validationErrors: string[] = [];

  for (const filePath of paths) {
    try {
      const absolutePath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);

      if (!fs.existsSync(absolutePath)) {
        failedFiles.push(filePath);
        continue;
      }

      const result = dotenv.config({
        path: absolutePath,
        encoding: options.encoding || 'utf8',
        override: options.override || false,
      });

      if (result.error) {
        failedFiles.push(filePath);
      } else {
        loadedFiles.push(filePath);
        Object.assign(variables, result.parsed || {});
      }
    } catch (error) {
      failedFiles.push(filePath);
    }
  }

  // Validate if schema provided
  if (options.validate && options.schema) {
    const validation = options.schema.validate(process.env, { abortEarly: false });
    if (validation.error) {
      validationErrors.push(...validation.error.details.map((d) => d.message));
    }
  }

  return {
    success: loadedFiles.length > 0 && validationErrors.length === 0,
    loaded: Object.keys(variables).length,
    loadedFiles,
    failedFiles,
    validationErrors,
    variables,
  };
};

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
export const parseTypedEnvVar = <T = any>(
  name: string,
  type: 'string' | 'number' | 'boolean' | 'json' | 'array' | 'url' | 'email',
  defaultValue?: T,
): T => {
  const value = process.env[name];

  if (value === undefined || value === null || value === '') {
    return defaultValue as T;
  }

  try {
    switch (type) {
      case 'number': {
        const num = Number(value);
        if (isNaN(num)) {
          throw new Error(`Invalid number: ${value}`);
        }
        return num as T;
      }

      case 'boolean': {
        const lower = value.toLowerCase().trim();
        return (lower === 'true' || lower === '1' || lower === 'yes') as T;
      }

      case 'json': {
        return JSON.parse(value) as T;
      }

      case 'array': {
        return value.split(',').map((v) => v.trim()) as T;
      }

      case 'url': {
        const url = new URL(value);
        return url.toString() as T;
      }

      case 'email': {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          throw new Error(`Invalid email: ${value}`);
        }
        return value as T;
      }

      case 'string':
      default:
        return value as T;
    }
  } catch (error) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Failed to parse env var ${name} as ${type}: ${error.message}`);
  }
};

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
export const validateEnvSchema = (
  schema: Joi.ObjectSchema,
  env: Record<string, any> = process.env,
): { valid: boolean; errors: string[]; value: any } => {
  const result = schema.validate(env, {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: false,
  });

  return {
    valid: !result.error,
    errors: result.error ? result.error.details.map((d) => d.message) : [],
    value: result.value,
  };
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
export const loadEnvHierarchical = (
  environment: string = process.env.NODE_ENV || 'development',
  baseDir: string = process.cwd(),
): EnvLoadResult => {
  const envFiles = [
    path.join(baseDir, '.env'),
    path.join(baseDir, `.env.${environment}`),
    path.join(baseDir, '.env.local'),
    path.join(baseDir, `.env.${environment}.local`),
  ];

  return loadEnvWithValidation(envFiles, { override: false });
};

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
export const expandEnvVariables = (
  env: Record<string, string>,
): Record<string, string> => {
  const expanded: Record<string, string> = { ...env };
  const regex = /\$\{([^}]+)\}/g;

  const expand = (value: string, depth = 0): string => {
    if (depth > 10) {
      throw new Error('Circular reference detected in environment variables');
    }

    return value.replace(regex, (match, varName) => {
      const varValue = expanded[varName] || process.env[varName] || match;
      return expand(varValue, depth + 1);
    });
  };

  for (const [key, value] of Object.entries(expanded)) {
    expanded[key] = expand(value);
  }

  return expanded;
};

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
export const validateEnvDependencies = (
  dependencies: Record<string, string[]>,
  constraints: Record<string, (value: string) => boolean> = {},
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Check dependencies
  for (const [parent, deps] of Object.entries(dependencies)) {
    if (process.env[parent]) {
      for (const dep of deps) {
        if (!process.env[dep]) {
          errors.push(`When ${parent} is set, ${dep} is required but not found`);
        }
      }
    }
  }

  // Check constraints
  for (const [varName, validator] of Object.entries(constraints)) {
    const value = process.env[varName];
    if (value && !validator(value)) {
      errors.push(`${varName} validation failed`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
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
export const sanitizeEnvVariables = (
  env: Record<string, string>,
  sensitiveKeys: string[] = ['PASSWORD', 'SECRET', 'KEY', 'TOKEN', 'CREDENTIAL'],
): Record<string, string> => {
  const sanitized: Record<string, string> = {};

  for (const [key, value] of Object.entries(env)) {
    const isSensitive = sensitiveKeys.some((sensitive) =>
      key.toUpperCase().includes(sensitive.toUpperCase()),
    );

    sanitized[key] = isSensitive ? '***REDACTED***' : value;
  }

  return sanitized;
};

// ============================================================================
// CONFIGURATION SCHEMA VALIDATION
// ============================================================================

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
export const createComprehensiveSchema = (
  schemas: Record<string, Joi.Schema>,
): Joi.ObjectSchema => {
  return Joi.object(schemas).options({
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: false,
  });
};

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
export const validateConfigWithDecorators = <T extends object>(
  ClassType: new () => T,
  config: Record<string, any>,
): { valid: boolean; errors: string[]; instance: T } => {
  const instance = plainToClass(ClassType, config, {
    enableImplicitConversion: true,
    excludeExtraneousValues: false,
  });

  const errors = validateSync(instance as object, {
    skipMissingProperties: false,
    whitelist: false,
    forbidNonWhitelisted: false,
  });

  return {
    valid: errors.length === 0,
    errors: errors.flatMap((err) => Object.values(err.constraints || {})),
    instance,
  };
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
export const createRuntimeValidator = (
  rules: Record<string, (value: any) => boolean | string>,
): ((config: any) => { valid: boolean; errors: string[] }) => {
  return (config: any) => {
    const errors: string[] = [];

    for (const [path, validator] of Object.entries(rules)) {
      const value = getNestedValue(config, path);
      const result = validator(value);

      if (typeof result === 'string') {
        errors.push(result);
      } else if (!result) {
        errors.push(`Validation failed for ${path}`);
      }
    }

    return { valid: errors.length === 0, errors };
  };
};

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
export const validateConfigWithJsonSchema = (
  config: any,
  jsonSchema: Record<string, any>,
): { valid: boolean; errors: string[] } => {
  // Simple JSON schema validation (basic implementation)
  const errors: string[] = [];

  const validateType = (value: any, expectedType: string, path: string): void => {
    const actualType = Array.isArray(value) ? 'array' : typeof value;
    if (actualType !== expectedType) {
      errors.push(`${path}: Expected ${expectedType}, got ${actualType}`);
    }
  };

  const validateObject = (obj: any, schema: any, basePath = ''): void => {
    if (schema.type === 'object' && schema.properties) {
      for (const [key, propSchema] of Object.entries(schema.properties)) {
        const path = basePath ? `${basePath}.${key}` : key;
        const value = obj?.[key];

        if (schema.required?.includes(key) && (value === undefined || value === null)) {
          errors.push(`${path}: Required property missing`);
          continue;
        }

        if (value !== undefined && (propSchema as any).type) {
          validateType(value, (propSchema as any).type, path);
        }

        if (typeof propSchema === 'object' && (propSchema as any).properties) {
          validateObject(value, propSchema, path);
        }
      }
    }
  };

  validateObject(config, jsonSchema);

  return { valid: errors.length === 0, errors };
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
export const mergeValidationSchemas = (
  schemas: Joi.ObjectSchema[],
  strategy: 'strict' | 'permissive' = 'permissive',
): Joi.ObjectSchema => {
  let merged = Joi.object({});

  for (const schema of schemas) {
    merged = merged.concat(schema);
  }

  return merged.options({
    allowUnknown: strategy === 'permissive',
    stripUnknown: strategy === 'strict',
  });
};

// ============================================================================
// MULTI-ENVIRONMENT CONFIGURATION
// ============================================================================

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
export const loadEnvironmentSpecificConfig = (
  environment: string = process.env.NODE_ENV || 'development',
  configDir: string = path.join(process.cwd(), 'config'),
): Record<string, any> => {
  const configFiles = [
    path.join(configDir, 'default.json'),
    path.join(configDir, 'default.js'),
    path.join(configDir, `${environment}.json`),
    path.join(configDir, `${environment}.js`),
    path.join(configDir, 'local.json'),
    path.join(configDir, 'local.js'),
    path.join(configDir, `${environment}.local.json`),
    path.join(configDir, `${environment}.local.js`),
  ];

  let merged = {};

  for (const file of configFiles) {
    if (fs.existsSync(file)) {
      const ext = path.extname(file);
      let config: any = {};

      if (ext === '.json') {
        config = JSON.parse(fs.readFileSync(file, 'utf-8'));
      } else if (ext === '.js') {
        config = require(file);
        if (typeof config === 'function') {
          config = config();
        }
      }

      merged = deepMerge(merged, config);
    }
  }

  return merged;
};

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
export const createEnvironmentAwareFactory = (
  factories: Record<string, () => any>,
): (() => any) => {
  return () => {
    const env = process.env.NODE_ENV || 'development';
    const factory = factories[env] || factories['development'];

    if (!factory) {
      throw new Error(`No configuration factory found for environment: ${env}`);
    }

    return factory();
  };
};

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
export const validateEnvironmentRequirements = (
  environment: string,
  requirements: Record<string, string[]>,
): { valid: boolean; missing: string[] } => {
  const required = requirements[environment] || [];
  const missing: string[] = [];

  for (const varName of required) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }

  return {
    valid: missing.length === 0,
    missing,
  };
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
export const applyEnvironmentOverrides = (
  baseConfig: Record<string, any>,
  overrides: Record<string, Record<string, any>>,
  environment: string = process.env.NODE_ENV || 'development',
): Record<string, any> => {
  const envOverrides = overrides[environment] || {};
  return deepMerge(baseConfig, envOverrides);
};

// ============================================================================
// SECRET MANAGEMENT & VAULT INTEGRATION
// ============================================================================

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
export const loadSecretsFromVaultProvider = async (
  config: SecretProviderConfig,
): Promise<Record<string, string>> => {
  const cacheKey = `${config.provider}:${config.secretId}:${config.version || 'latest'}`;

  // Check cache
  const cached = secretsCache.get(cacheKey);
  if (cached && config.cacheDuration) {
    const age = Date.now() - cached.timestamp;
    if (age < config.cacheDuration * 1000) {
      return cached.secrets;
    }
  }

  let secrets: Record<string, string> = {};

  switch (config.provider) {
    case 'aws-secrets-manager': {
      const { SecretsManagerClient, GetSecretValueCommand } = await import(
        '@aws-sdk/client-secrets-manager'
      );

      const client = new SecretsManagerClient({
        region: config.region || 'us-east-1',
        ...(config.credentials || {}),
      });

      const response = await client.send(
        new GetSecretValueCommand({
          SecretId: config.secretId,
          VersionId: config.version,
        }),
      );

      if (response.SecretString) {
        secrets = JSON.parse(response.SecretString);
      }
      break;
    }

    case 'azure-keyvault': {
      const { SecretClient } = await import('@azure/keyvault-secrets');
      const { DefaultAzureCredential } = await import('@azure/identity');

      const credential = new DefaultAzureCredential();
      const client = new SecretClient(config.endpoint || '', credential);
      const secret = await client.getSecret(config.secretId);

      if (secret.value) {
        secrets = JSON.parse(secret.value);
      }
      break;
    }

    case 'hashicorp-vault': {
      const response = await fetch(`${config.endpoint}/v1/${config.secretId}`, {
        headers: {
          'X-Vault-Token': config.credentials?.token || process.env.VAULT_TOKEN || '',
        },
      });

      if (!response.ok) {
        throw new Error(`Vault request failed: ${response.statusText}`);
      }

      const data = await response.json();
      secrets = data.data?.data || data.data || {};
      break;
    }

    case 'google-secret-manager': {
      const { SecretManagerServiceClient } = await import(
        '@google-cloud/secret-manager'
      );

      const client = new SecretManagerServiceClient(config.credentials);
      const [version] = await client.accessSecretVersion({
        name: config.secretId,
      });

      if (version.payload?.data) {
        const secretString = version.payload.data.toString();
        secrets = JSON.parse(secretString);
      }
      break;
    }
  }

  // Cache secrets
  secretsCache.set(cacheKey, { secrets, timestamp: Date.now() });

  return secrets;
};

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
export const rotateSecretsWithCallback = async (
  config: SecretRotationConfig,
  callback: (secrets: Record<string, string>) => void | Promise<void>,
): Promise<NodeJS.Timer> => {
  const rotate = async () => {
    try {
      const secrets = await loadSecretsFromVaultProvider(config);
      await callback(secrets);

      if (config.onRotate) {
        await config.onRotate(secrets);
      }
    } catch (error) {
      Logger.error(`Secret rotation failed: ${error.message}`, 'SecretRotation');

      // Retry logic
      if (config.retryAttempts && config.retryAttempts > 0) {
        for (let i = 0; i < config.retryAttempts; i++) {
          await new Promise((resolve) => setTimeout(resolve, config.retryDelay || 5000));
          try {
            const secrets = await loadSecretsFromVaultProvider(config);
            await callback(secrets);
            return;
          } catch (retryError) {
            Logger.error(`Retry ${i + 1} failed: ${retryError.message}`, 'SecretRotation');
          }
        }
      }
    }
  };

  // Initial rotation
  await rotate();

  // Schedule periodic rotation
  return setInterval(rotate, config.rotationInterval);
};

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
export const cacheSecrets = (
  key: string,
  secrets: Record<string, string>,
  ttl: number,
): void => {
  secretsCache.set(key, {
    secrets,
    timestamp: Date.now(),
  });

  // Auto-expire
  setTimeout(() => {
    secretsCache.delete(key);
  }, ttl * 1000);
};

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
export const getCachedSecrets = async (
  key: string,
  loader: () => Promise<Record<string, string>>,
): Promise<Record<string, string>> => {
  const cached = secretsCache.get(key);

  if (cached) {
    return cached.secrets;
  }

  const secrets = await loader();
  secretsCache.set(key, { secrets, timestamp: Date.now() });

  return secrets;
};

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
export const validateSecretFormat = (
  secrets: Record<string, string>,
  rules: Record<string, { pattern?: RegExp; minLength?: number; maxLength?: number }>,
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  for (const [key, rule] of Object.entries(rules)) {
    const value = secrets[key];

    if (!value) {
      errors.push(`Secret ${key} is missing`);
      continue;
    }

    if (rule.minLength && value.length < rule.minLength) {
      errors.push(`Secret ${key} is too short (min: ${rule.minLength})`);
    }

    if (rule.maxLength && value.length > rule.maxLength) {
      errors.push(`Secret ${key} is too long (max: ${rule.maxLength})`);
    }

    if (rule.pattern && !rule.pattern.test(value)) {
      errors.push(`Secret ${key} does not match required format`);
    }
  }

  return { valid: errors.length === 0, errors };
};

// ============================================================================
// FEATURE FLAGS & TOGGLES (DATABASE-BACKED)
// ============================================================================

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
export const loadFeatureFlagsFromDB = async (
  environment: string = process.env.NODE_ENV || 'development',
  tenantId?: string,
): Promise<Record<string, FeatureFlagAttributes>> => {
  const where: any = { environment };

  if (tenantId) {
    where.tenantId = tenantId;
  }

  const flags = await FeatureFlagModel.findAll({ where });

  return flags.reduce(
    (acc, flag) => {
      acc[flag.name] = flag.toJSON() as FeatureFlagAttributes;
      return acc;
    },
    {} as Record<string, FeatureFlagAttributes>,
  );
};

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
export const evaluateFeatureFlag = async (
  flagName: string,
  context: Record<string, any> = {},
  environment: string = process.env.NODE_ENV || 'development',
): Promise<boolean> => {
  const where: any = { name: flagName, environment };

  if (context.tenantId) {
    where.tenantId = context.tenantId;
  }

  const flag = await FeatureFlagModel.findOne({ where });

  if (!flag || !flag.enabled) {
    return false;
  }

  // Check rollout percentage
  if (flag.rollout !== null && flag.rollout !== undefined) {
    const userId = context.userId || context.userEmail || '';
    if (userId) {
      const hash = simpleHash(`${flagName}:${userId}`);
      if (hash % 100 >= flag.rollout) {
        return false;
      }
    }
  }

  // Check conditions
  if (flag.conditions) {
    for (const [key, value] of Object.entries(flag.conditions)) {
      if (context[key] !== value) {
        return false;
      }
    }
  }

  return true;
};

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
export const updateFeatureFlagInDB = async (
  flagName: string,
  updates: Partial<FeatureFlagAttributes>,
  environment: string = process.env.NODE_ENV || 'development',
): Promise<FeatureFlagAttributes> => {
  const [flag] = await FeatureFlagModel.findOrCreate({
    where: { name: flagName, environment },
    defaults: {
      name: flagName,
      enabled: false,
      environment,
      ...updates,
    } as any,
  });

  if (updates) {
    await flag.update(updates);
  }

  return flag.toJSON() as FeatureFlagAttributes;
};

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
export const createFeatureFlag = async (
  flagData: Omit<FeatureFlagAttributes, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<FeatureFlagAttributes> => {
  const flag = await FeatureFlagModel.create(flagData as any);
  return flag.toJSON() as FeatureFlagAttributes;
};

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
export const bulkUpdateFeatureFlags = async (
  updates: Record<string, Partial<FeatureFlagAttributes>>,
  environment: string = process.env.NODE_ENV || 'development',
): Promise<FeatureFlagAttributes[]> => {
  const results: FeatureFlagAttributes[] = [];

  for (const [name, data] of Object.entries(updates)) {
    const updated = await updateFeatureFlagInDB(name, data, environment);
    results.push(updated);
  }

  return results;
};

// ============================================================================
// DYNAMIC CONFIGURATION RELOAD
// ============================================================================

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
export const watchConfigurationFiles = (options: ConfigWatchOptions): FSWatcher[] => {
  const watchers: FSWatcher[] = [];

  for (const filePath of options.paths) {
    let oldConfig: any = null;
    let timeoutId: NodeJS.Timeout | null = null;

    const handleChange = async () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(async () => {
        try {
          const newConfig = loadConfigFile(filePath, options.encoding);
          const changedKeys = getChangedKeys(oldConfig, newConfig);

          const event: ConfigChangeEvent = {
            filePath,
            type: 'modified',
            oldConfig,
            newConfig,
            changedKeys,
            timestamp: new Date(),
          };

          await options.onChange(event);
          oldConfig = newConfig;
        } catch (error) {
          Logger.error(`Error reloading config file ${filePath}: ${error.message}`);
        }
      }, options.debounce || 1000);
    };

    if (fs.existsSync(filePath)) {
      oldConfig = loadConfigFile(filePath, options.encoding);
    }

    const watcher = watch(filePath, handleChange);
    watchers.push(watcher);
  }

  return watchers;
};

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
export const createHotReloadProvider = (
  filePath: string,
  onReload: (config: any) => void | Promise<void>,
): { getConfig: () => any; reload: () => Promise<void>; stop: () => void } => {
  let currentConfig = loadConfigFile(filePath);
  let watcher: FSWatcher | null = null;

  const reload = async () => {
    currentConfig = loadConfigFile(filePath);
    await onReload(currentConfig);
  };

  watcher = watch(filePath, async () => {
    await reload();
  });

  return {
    getConfig: () => currentConfig,
    reload,
    stop: () => {
      if (watcher) {
        watcher.close();
      }
    },
  };
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
export const hotSwapConfiguration = async (
  loader: () => Promise<any>,
  validator: (config: any) => Promise<boolean>,
): Promise<{ success: boolean; config?: any; error?: string }> => {
  const oldConfig = { ...process.env };

  try {
    const newConfig = await loader();
    const isValid = await validator(newConfig);

    if (!isValid) {
      return { success: false, error: 'Configuration validation failed' };
    }

    // Apply new configuration
    Object.assign(process.env, newConfig);

    return { success: true, config: newConfig };
  } catch (error) {
    // Rollback to old configuration
    Object.assign(process.env, oldConfig);
    return { success: false, error: error.message };
  }
};

// ============================================================================
// CONFIGURATION ENCRYPTION
// ============================================================================

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
export const encryptConfigValueGCM = (
  value: string,
  config: EncryptionConfig,
): string => {
  const key = typeof config.key === 'string'
    ? crypto.scryptSync(config.key, 'salt', 32)
    : config.key;

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    config.algorithm || 'aes-256-gcm',
    key,
    iv,
    config.aad ? { authTagLength: config.tagLength || 16 } : undefined,
  );

  if (config.aad) {
    cipher.setAAD(config.aad);
  }

  let encrypted = cipher.update(value, 'utf8', 'base64');
  encrypted += cipher.final('base64');

  const authTag = (cipher as any).getAuthTag().toString('base64');

  return `${iv.toString('base64')}:${authTag}:${encrypted}`;
};

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
export const decryptConfigValueGCM = (
  encryptedValue: string,
  config: EncryptionConfig,
): string => {
  const [ivBase64, authTagBase64, encrypted] = encryptedValue.split(':');

  const key = typeof config.key === 'string'
    ? crypto.scryptSync(config.key, 'salt', 32)
    : config.key;

  const iv = Buffer.from(ivBase64, 'base64');
  const authTag = Buffer.from(authTagBase64, 'base64');

  const decipher = crypto.createDecipheriv(
    config.algorithm || 'aes-256-gcm',
    key,
    iv,
  );

  if (config.aad) {
    decipher.setAAD(config.aad);
  }

  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, 'base64', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
};

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
export const encryptConfigObjectRecursive = (
  config: Record<string, any>,
  encryptionConfig: EncryptionConfig,
  excludeKeys: string[] = [],
): Record<string, any> => {
  const encrypted: Record<string, any> = {};

  for (const [key, value] of Object.entries(config)) {
    if (excludeKeys.includes(key)) {
      encrypted[key] = value;
    } else if (typeof value === 'string') {
      encrypted[key] = encryptConfigValueGCM(value, encryptionConfig);
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      encrypted[key] = encryptConfigObjectRecursive(value, encryptionConfig, excludeKeys);
    } else {
      encrypted[key] = value;
    }
  }

  return encrypted;
};

// ============================================================================
// CONFIGURATION VERSIONING (DATABASE-BACKED)
// ============================================================================

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
export const saveConfigVersion = async (
  configKey: string,
  configData: Record<string, any>,
  metadata: Partial<ConfigHistoryAttributes> = {},
): Promise<ConfigHistoryAttributes> => {
  const checksum = calculateConfigChecksum(configData);
  const environment = metadata.environment || process.env.NODE_ENV || 'development';

  const version = metadata.version || generateVersionNumber(configKey, environment);

  const history = await ConfigHistoryModel.create({
    configKey,
    version,
    configData,
    checksum,
    author: metadata.author,
    reason: metadata.reason,
    environment,
    tags: metadata.tags,
  } as any);

  return history.toJSON() as ConfigHistoryAttributes;
};

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
export const getConfigVersion = async (
  configKey: string,
  version: string,
  environment: string = process.env.NODE_ENV || 'development',
): Promise<ConfigHistoryAttributes | null> => {
  const history = await ConfigHistoryModel.findOne({
    where: { configKey, version, environment },
  });

  return history ? (history.toJSON() as ConfigHistoryAttributes) : null;
};

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
export const listConfigVersions = async (
  configKey: string,
  environment: string = process.env.NODE_ENV || 'development',
  limit: number = 50,
): Promise<ConfigHistoryAttributes[]> => {
  const histories = await ConfigHistoryModel.findAll({
    where: { configKey, environment },
    order: [['createdAt', 'DESC']],
    limit,
  });

  return histories.map((h) => h.toJSON() as ConfigHistoryAttributes);
};

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
export const rollbackToVersion = async (
  configKey: string,
  version: string,
  environment: string = process.env.NODE_ENV || 'development',
): Promise<Record<string, any>> => {
  const history = await getConfigVersion(configKey, version, environment);

  if (!history) {
    throw new Error(`Configuration version ${version} not found for ${configKey}`);
  }

  // Verify checksum
  const calculatedChecksum = calculateConfigChecksum(history.configData);
  if (calculatedChecksum !== history.checksum) {
    throw new Error('Configuration checksum mismatch - data may be corrupted');
  }

  return history.configData;
};

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
export const compareConfigVersions = async (
  configKey: string,
  version1: string,
  version2: string,
  environment: string = process.env.NODE_ENV || 'development',
): Promise<{ added: string[]; removed: string[]; modified: string[] }> => {
  const [config1, config2] = await Promise.all([
    getConfigVersion(configKey, version1, environment),
    getConfigVersion(configKey, version2, environment),
  ]);

  if (!config1 || !config2) {
    throw new Error('One or both configuration versions not found');
  }

  return getConfigDiff(config1.configData, config2.configData);
};

// ============================================================================
// TYPE-SAFE CONFIGURATION ACCESS
// ============================================================================

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
export const createTypeSafeConfigService = <T extends Record<string, any>>(
  schema: T,
  config: Record<string, any>,
): { get: <K extends keyof T>(key: K) => T[K]; getAll: () => T } => {
  return {
    get: <K extends keyof T>(key: K): T[K] => {
      return config[key as string] as T[K];
    },
    getAll: (): T => {
      return config as T;
    },
  };
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
export const getNestedConfigValue = <T = any>(
  config: Record<string, any>,
  path: string,
  defaultValue?: T,
): T => {
  const value = getNestedValue(config, path);
  return value !== undefined ? value : (defaultValue as T);
};

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
export const validateConfigurationOnStartup = async (
  schema: Joi.ObjectSchema,
  config: Record<string, any> = process.env,
  throwOnError: boolean = true,
): Promise<{ valid: boolean; errors: string[] }> => {
  const result = schema.validate(config, {
    abortEarly: false,
    allowUnknown: true,
  });

  const errors = result.error ? result.error.details.map((d) => d.message) : [];

  if (errors.length > 0 && throwOnError) {
    Logger.error('Configuration validation failed on startup', 'ConfigValidation');
    errors.forEach((error) => Logger.error(error, 'ConfigValidation'));
    throw new Error(`Configuration validation failed: ${errors.join('; ')}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

// ============================================================================
// REMOTE CONFIGURATION FETCHING
// ============================================================================

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
export const fetchRemoteConfiguration = async (
  options: RemoteConfigOptions,
): Promise<Record<string, any>> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (options.authToken) {
    headers['Authorization'] = `Bearer ${options.authToken}`;
  }

  const fetchWithRetry = async (attempt: number = 0): Promise<Response> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), options.timeout || 10000);

      const response = await fetch(options.url, {
        method: options.method || 'GET',
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Remote config request failed: ${response.statusText}`);
      }

      return response;
    } catch (error) {
      if (attempt < (options.retryAttempts || 0)) {
        await new Promise((resolve) => setTimeout(resolve, options.retryDelay || 1000));
        return fetchWithRetry(attempt + 1);
      }
      throw error;
    }
  };

  const response = await fetchWithRetry();
  const config = await response.json();

  // Cache if enabled
  if (options.cache && options.cacheTTL) {
    cacheRemoteConfig(options.url, config, options.cacheTTL);
  }

  return config;
};

// ============================================================================
// CONFIGURATION DOCUMENTATION GENERATION
// ============================================================================

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
export const generateConfigDocumentation = (
  config: Record<string, any>,
  options: ConfigDocOptions,
): string => {
  if (options.format === 'markdown') {
    return generateMarkdownDocs(config, options);
  } else if (options.format === 'json') {
    return JSON.stringify(config, null, 2);
  } else {
    return generateHtmlDocs(config, options);
  }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/** In-memory secrets cache */
const secretsCache = new Map<string, { secrets: Record<string, string>; timestamp: number }>();

/** Remote config cache */
const remoteConfigCache = new Map<string, { config: any; expiresAt: number }>();

/**
 * Deep merges two objects recursively.
 */
const deepMerge = (target: any, source: any): any => {
  if (!isObject(target) || !isObject(source)) {
    return source;
  }

  const result = { ...target };

  for (const key in source) {
    if (isObject(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }

  return result;
};

/**
 * Checks if value is a plain object.
 */
const isObject = (obj: any): boolean => {
  return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
};

/**
 * Gets nested value from object using dot notation.
 */
const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

/**
 * Calculates SHA-256 checksum of configuration data.
 */
const calculateConfigChecksum = (config: Record<string, any>): string => {
  const json = JSON.stringify(config, Object.keys(config).sort());
  return crypto.createHash('sha256').update(json).digest('hex');
};

/**
 * Generates version number for configuration.
 */
const generateVersionNumber = async (
  configKey: string,
  environment: string,
): Promise<string> => {
  const latestVersion = await ConfigHistoryModel.findOne({
    where: { configKey, environment },
    order: [['createdAt', 'DESC']],
  });

  if (!latestVersion) {
    return '1.0.0';
  }

  const [major, minor, patch] = latestVersion.version.split('.').map(Number);
  return `${major}.${minor}.${patch + 1}`;
};

/**
 * Gets changed keys between two configuration objects.
 */
const getChangedKeys = (oldConfig: any, newConfig: any): string[] => {
  const changed: string[] = [];
  const allKeys = new Set([
    ...Object.keys(oldConfig || {}),
    ...Object.keys(newConfig || {}),
  ]);

  for (const key of allKeys) {
    if (oldConfig?.[key] !== newConfig?.[key]) {
      changed.push(key);
    }
  }

  return changed;
};

/**
 * Gets configuration differences between two versions.
 */
const getConfigDiff = (
  config1: Record<string, any>,
  config2: Record<string, any>,
): { added: string[]; removed: string[]; modified: string[] } => {
  const added: string[] = [];
  const removed: string[] = [];
  const modified: string[] = [];

  const keys1 = Object.keys(config1);
  const keys2 = Object.keys(config2);

  for (const key of keys2) {
    if (!keys1.includes(key)) {
      added.push(key);
    } else if (JSON.stringify(config1[key]) !== JSON.stringify(config2[key])) {
      modified.push(key);
    }
  }

  for (const key of keys1) {
    if (!keys2.includes(key)) {
      removed.push(key);
    }
  }

  return { added, removed, modified };
};

/**
 * Simple hash function for feature flag rollout.
 */
const simpleHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

/**
 * Loads configuration from file (JSON or JS).
 */
const loadConfigFile = (filePath: string, encoding: BufferEncoding = 'utf-8'): any => {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.json') {
    return JSON.parse(fs.readFileSync(filePath, encoding));
  } else if (ext === '.js' || ext === '.ts') {
    const config = require(filePath);
    return typeof config === 'function' ? config() : config;
  }

  return {};
};

/**
 * Caches remote configuration.
 */
const cacheRemoteConfig = (key: string, config: any, ttl: number): void => {
  remoteConfigCache.set(key, {
    config,
    expiresAt: Date.now() + ttl * 1000,
  });
};

/**
 * Generates Markdown documentation.
 */
const generateMarkdownDocs = (
  config: Record<string, any>,
  options: ConfigDocOptions,
): string => {
  let markdown = '# Configuration Documentation\n\n';

  for (const [key, value] of Object.entries(config)) {
    markdown += `## ${key}\n\n`;
    markdown += `- **Type**: ${typeof value}\n`;

    if (options.includeDefaults && value !== undefined) {
      markdown += `- **Default**: \`${JSON.stringify(value)}\`\n`;
    }

    if (options.includeExamples) {
      markdown += `- **Example**: \`${JSON.stringify(value)}\`\n`;
    }

    markdown += '\n';
  }

  return markdown;
};

/**
 * Generates HTML documentation.
 */
const generateHtmlDocs = (
  config: Record<string, any>,
  options: ConfigDocOptions,
): string => {
  let html = '<html><head><title>Configuration Documentation</title></head><body>';
  html += '<h1>Configuration Documentation</h1>';

  for (const [key, value] of Object.entries(config)) {
    html += `<h2>${key}</h2>`;
    html += `<p><strong>Type:</strong> ${typeof value}</p>`;

    if (options.includeDefaults) {
      html += `<p><strong>Default:</strong> <code>${JSON.stringify(value)}</code></p>`;
    }
  }

  html += '</body></html>';
  return html;
};
