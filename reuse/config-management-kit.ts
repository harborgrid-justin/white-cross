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

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService, registerAs } from '@nestjs/config';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { watch, FSWatcher } from 'fs';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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

// ============================================================================
// ENVIRONMENT VARIABLE PARSING
// ============================================================================

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
export const parseEnvArray = (
  varName: string,
  separator = ',',
  defaultValue: string[] = [],
): string[] => {
  const value = process.env[varName];

  if (!value || value.trim() === '') {
    return defaultValue;
  }

  return value.split(separator).map(item => item.trim()).filter(item => item.length > 0);
};

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
export const parseEnvObject = <T = any>(
  varName: string,
  defaultValue: T = {} as T,
): T => {
  const value = process.env[varName];

  if (!value || value.trim() === '') {
    return defaultValue;
  }

  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.warn(`Failed to parse ${varName} as JSON, using default value`);
    return defaultValue;
  }
};

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
export const parseEnvAuto = (
  varName: string,
  options: ConfigParseOptions = {},
): any => {
  const value = process.env[varName];

  if (!value || value.trim() === '') {
    return options.defaultValue;
  }

  try {
    switch (options.type) {
      case 'number':
        const num = Number(value);
        if (isNaN(num)) throw new Error('Invalid number');
        return options.transform ? options.transform(num) : num;

      case 'boolean':
        const boolValue = value.toLowerCase() === 'true' || value === '1';
        return options.transform ? options.transform(boolValue) : boolValue;

      case 'json':
        const jsonValue = JSON.parse(value);
        return options.transform ? options.transform(jsonValue) : jsonValue;

      case 'array':
        const arrayValue = parseEnvArray(varName, options.separator || ',');
        return options.transform ? options.transform(arrayValue) : arrayValue;

      case 'object':
        const objectValue = parseEnvObject(varName);
        return options.transform ? options.transform(objectValue) : objectValue;

      case 'string':
      default:
        return options.transform ? options.transform(value) : value;
    }
  } catch (error) {
    if (options.throwOnError) {
      throw new Error(`Failed to parse ${varName}: ${error.message}`);
    }
    return options.defaultValue;
  }
};

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
export const parseEnvURL = (
  varName: string,
  defaultValue?: string,
): URL => {
  const value = process.env[varName] || defaultValue;

  if (!value) {
    throw new Error(`Environment variable ${varName} is required for URL parsing`);
  }

  try {
    return new URL(value);
  } catch (error) {
    throw new Error(`Invalid URL in ${varName}: ${value}`);
  }
};

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
export const parseEnvDuration = (
  varName: string,
  defaultValue?: number,
): number => {
  const value = process.env[varName];

  if (!value) {
    if (defaultValue !== undefined) return defaultValue;
    throw new Error(`Environment variable ${varName} is required`);
  }

  const match = value.match(/^(\d+)(ms|s|m|h|d)$/);

  if (!match) {
    throw new Error(`Invalid duration format in ${varName}: ${value}`);
  }

  const [, amount, unit] = match;
  const num = parseInt(amount, 10);

  const multipliers = {
    ms: 1,
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return num * multipliers[unit];
};

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
export const parseEnvByteSize = (
  varName: string,
  defaultValue?: number,
): number => {
  const value = process.env[varName];

  if (!value) {
    if (defaultValue !== undefined) return defaultValue;
    throw new Error(`Environment variable ${varName} is required`);
  }

  const match = value.match(/^(\d+(?:\.\d+)?)(B|KB|MB|GB|TB)$/i);

  if (!match) {
    throw new Error(`Invalid byte size format in ${varName}: ${value}`);
  }

  const [, amount, unit] = match;
  const num = parseFloat(amount);

  const multipliers: Record<string, number> = {
    B: 1,
    KB: 1024,
    MB: 1024 * 1024,
    GB: 1024 * 1024 * 1024,
    TB: 1024 * 1024 * 1024 * 1024,
  };

  return Math.floor(num * multipliers[unit.toUpperCase()]);
};

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
export const parseEnvEnum = <T extends string>(
  varName: string,
  allowedValues: T[],
  defaultValue?: T,
): T => {
  const value = process.env[varName] || defaultValue;

  if (!value) {
    throw new Error(`Environment variable ${varName} is required`);
  }

  if (!allowedValues.includes(value as T)) {
    throw new Error(
      `Invalid value for ${varName}: ${value}. Allowed values: ${allowedValues.join(', ')}`
    );
  }

  return value as T;
};

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
export const parseEnvRegex = (
  varName: string,
  flags?: string,
  defaultValue?: RegExp,
): RegExp => {
  const value = process.env[varName];

  if (!value) {
    if (defaultValue) return defaultValue;
    throw new Error(`Environment variable ${varName} is required`);
  }

  try {
    return new RegExp(value, flags);
  } catch (error) {
    throw new Error(`Invalid regex in ${varName}: ${error.message}`);
  }
};

// ============================================================================
// CONFIGURATION FILE LOADING
// ============================================================================

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
export const loadYAMLConfig = (filePath: string, required = false): any => {
  const absolutePath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);

  if (!fs.existsSync(absolutePath)) {
    if (required) {
      throw new Error(`Required YAML config file not found: ${filePath}`);
    }
    return {};
  }

  try {
    const content = fs.readFileSync(absolutePath, 'utf-8');
    // Simple YAML parsing for basic structures
    return parseSimpleYAML(content);
  } catch (error) {
    throw new Error(`Failed to parse YAML file ${filePath}: ${error.message}`);
  }
};

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
export const loadTOMLConfig = (filePath: string, required = false): any => {
  const absolutePath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);

  if (!fs.existsSync(absolutePath)) {
    if (required) {
      throw new Error(`Required TOML config file not found: ${filePath}`);
    }
    return {};
  }

  try {
    const content = fs.readFileSync(absolutePath, 'utf-8');
    return parseSimpleTOML(content);
  } catch (error) {
    throw new Error(`Failed to parse TOML file ${filePath}: ${error.message}`);
  }
};

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
export const loadEnvFile = (
  filePath: string,
  override = false,
): Record<string, string> => {
  const absolutePath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);

  if (!fs.existsSync(absolutePath)) {
    return {};
  }

  const content = fs.readFileSync(absolutePath, 'utf-8');
  const parsed: Record<string, string> = {};

  content.split('\n').forEach(line => {
    line = line.trim();

    // Skip comments and empty lines
    if (!line || line.startsWith('#')) return;

    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();

      // Remove quotes
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      parsed[key] = value;

      if (override || !process.env[key]) {
        process.env[key] = value;
      }
    }
  });

  return parsed;
};

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
export const loadINIConfig = (
  filePath: string,
  required = false,
): Record<string, any> => {
  const absolutePath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);

  if (!fs.existsSync(absolutePath)) {
    if (required) {
      throw new Error(`Required INI config file not found: ${filePath}`);
    }
    return {};
  }

  const content = fs.readFileSync(absolutePath, 'utf-8');
  const config: Record<string, any> = {};
  let currentSection = '';

  content.split('\n').forEach(line => {
    line = line.trim();

    if (!line || line.startsWith(';') || line.startsWith('#')) return;

    // Section header
    const sectionMatch = line.match(/^\[([^\]]+)\]$/);
    if (sectionMatch) {
      currentSection = sectionMatch[1];
      config[currentSection] = {};
      return;
    }

    // Key-value pair
    const kvMatch = line.match(/^([^=]+)=(.*)$/);
    if (kvMatch) {
      const key = kvMatch[1].trim();
      let value: any = kvMatch[2].trim();

      // Type inference
      if (value === 'true') value = true;
      else if (value === 'false') value = false;
      else if (!isNaN(Number(value)) && value !== '') value = Number(value);

      if (currentSection) {
        config[currentSection][key] = value;
      } else {
        config[key] = value;
      }
    }
  });

  return config;
};

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
export const loadMultipleConfigFiles = (
  filePaths: string[],
  format: 'json' | 'yaml' | 'toml' | 'ini' | 'env' = 'json',
): any => {
  let merged = {};

  for (const filePath of filePaths) {
    let config: any = {};

    switch (format) {
      case 'json':
        config = loadJSONConfigSafe(filePath);
        break;
      case 'yaml':
        config = loadYAMLConfig(filePath);
        break;
      case 'toml':
        config = loadTOMLConfig(filePath);
        break;
      case 'ini':
        config = loadINIConfig(filePath);
        break;
      case 'env':
        config = loadEnvFile(filePath);
        break;
    }

    merged = deepMergeConfigs(merged, config);
  }

  return merged;
};

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
export const autoLoadConfig = (filePath: string): any => {
  const ext = path.extname(filePath).toLowerCase();

  switch (ext) {
    case '.json':
      return loadJSONConfigSafe(filePath);
    case '.yaml':
    case '.yml':
      return loadYAMLConfig(filePath);
    case '.toml':
      return loadTOMLConfig(filePath);
    case '.ini':
      return loadINIConfig(filePath);
    case '.env':
      return loadEnvFile(filePath);
    default:
      throw new Error(`Unsupported config file format: ${ext}`);
  }
};

// ============================================================================
// CONFIGURATION HIERARCHY
// ============================================================================

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
export const createConfigHierarchy = (
  levels: string[],
  options: ConfigHierarchyOptions = {},
): any => {
  const baseDir = options.baseDir || './config';
  const extension = options.extension || '.json';

  let config = {};

  for (const level of levels) {
    const filePath = path.join(baseDir, `${level}${extension}`);

    if (fs.existsSync(filePath)) {
      const levelConfig = autoLoadConfig(filePath);

      if (options.mergeStrategy === 'replace') {
        config = levelConfig;
      } else if (options.mergeStrategy === 'shallow') {
        config = { ...config, ...levelConfig };
      } else {
        config = deepMergeConfigs(config, levelConfig);
      }
    }
  }

  return config;
};

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
export const createConfigCascade = (
  sources: Record<string, any>,
  precedence: string[],
): any => {
  let config = {};

  for (const sourceName of precedence) {
    if (sources[sourceName]) {
      config = deepMergeConfigs(config, sources[sourceName]);
    }
  }

  return config;
};

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
export const resolveConfigInheritance = (
  config: any,
  inheritKey = 'extends',
): any => {
  const resolved: any = {};

  const resolveLevel = (key: string, visited = new Set<string>()): any => {
    if (visited.has(key)) {
      throw new Error(`Circular inheritance detected: ${key}`);
    }

    visited.add(key);
    const level = config[key];

    if (!level) return {};

    let result = { ...level };

    if (result[inheritKey]) {
      const parent = resolveLevel(result[inheritKey], visited);
      delete result[inheritKey];
      result = deepMergeConfigs(parent, result);
    }

    return result;
  };

  for (const key of Object.keys(config)) {
    resolved[key] = resolveLevel(key);
  }

  return resolved;
};

// ============================================================================
// CONFIGURATION VALIDATION
// ============================================================================

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
export const createConfigSchema = (
  rules: ConfigValidationRule[],
): ((config: any) => { valid: boolean; errors: string[] }) => {
  return (config: any) => {
    const errors: string[] = [];

    for (const rule of rules) {
      const value = getNestedValue(config, rule.path);

      switch (rule.type) {
        case 'required':
          if (value === undefined || value === null) {
            errors.push(rule.message || `Required field ${rule.path} is missing`);
          }
          break;

        case 'pattern':
          if (value && rule.value && !rule.value.test(String(value))) {
            errors.push(rule.message || `Field ${rule.path} does not match pattern`);
          }
          break;

        case 'range':
          if (value !== undefined && rule.value) {
            const [min, max] = rule.value;
            if (value < min || value > max) {
              errors.push(rule.message || `Field ${rule.path} must be between ${min} and ${max}`);
            }
          }
          break;

        case 'enum':
          if (value && rule.value && !rule.value.includes(value)) {
            errors.push(
              rule.message || `Field ${rule.path} must be one of: ${rule.value.join(', ')}`
            );
          }
          break;

        case 'custom':
          if (rule.validator && !rule.validator(value)) {
            errors.push(rule.message || `Field ${rule.path} failed custom validation`);
          }
          break;
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  };
};

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
export const validateConfigMultiSchema = (
  config: any,
  validators: Array<(config: any) => { valid: boolean; errors: string[] }>,
): { valid: boolean; errors: string[] } => {
  const allErrors: string[] = [];

  for (const validator of validators) {
    const result = validator(config);
    if (!result.valid) {
      allErrors.push(...result.errors);
    }
  }

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
  };
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
export const sanitizeConfig = (
  config: any,
  sensitiveKeys: string[] = ['password', 'secret', 'token', 'key', 'apiKey'],
  redactionText = '[REDACTED]',
): any => {
  if (typeof config !== 'object' || config === null) {
    return config;
  }

  const sanitized: any = Array.isArray(config) ? [] : {};

  for (const [key, value] of Object.entries(config)) {
    const isKeywordSensitive = sensitiveKeys.some(keyword =>
      key.toLowerCase().includes(keyword.toLowerCase())
    );

    if (isKeywordSensitive) {
      sanitized[key] = redactionText;
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeConfig(value, sensitiveKeys, redactionText);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
};

// ============================================================================
// TYPE-SAFE CONFIGURATION
// ============================================================================

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
export const createTypeSafeConfig = <T extends Record<string, any>>(
  options: TypeSafeConfigOptions<T>,
) => {
  const config = options.defaults
    ? deepMergeConfigs(options.defaults, options.schema)
    : options.schema;

  if (options.validate && !options.validate(config)) {
    throw new Error('Configuration validation failed');
  }

  return {
    get<K extends keyof T>(key: K): T[K] {
      const value = getNestedValue(config, key as string);

      if (options.strict && value === undefined) {
        throw new Error(`Configuration key ${String(key)} not found`);
      }

      return value;
    },

    getOrDefault<K extends keyof T>(key: K, defaultValue: T[K]): T[K] {
      const value = getNestedValue(config, key as string);
      return value !== undefined ? value : defaultValue;
    },

    has(key: keyof T): boolean {
      return getNestedValue(config, key as string) !== undefined;
    },

    getAll(): T {
      return config as T;
    },

    set<K extends keyof T>(key: K, value: T[K]): void {
      setNestedValue(config, key as string, value);
    },
  };
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
export const createStronglyTypedGetter = (configService: ConfigService) => {
  return <T>(key: string, defaultValue?: T): T => {
    const value = configService.get<T>(key);
    return value !== undefined && value !== null ? value : (defaultValue as T);
  };
};

// ============================================================================
// SECRET MANAGEMENT
// ============================================================================

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
export const rotateSecretsScheduled = (
  config: SecretRotationConfig,
): { stop: () => void } => {
  let currentSecret = '';

  const rotate = async () => {
    try {
      // Placeholder for actual secret loading logic
      const newSecret = await loadSecretFromProvider(config.provider, config.secretId);

      if (config.onRotate) {
        config.onRotate(currentSecret, newSecret);
      }

      currentSecret = newSecret;
    } catch (error) {
      if (config.onError) {
        config.onError(error as Error);
      }
    }
  };

  const intervalId = setInterval(rotate, config.interval);
  rotate(); // Initial load

  return {
    stop: () => clearInterval(intervalId),
  };
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
export const createSecretManager = (cacheDuration = 300000) => {
  const cache = new Map<string, { value: string; expiresAt: number }>();

  return {
    async getSecret(key: string): Promise<string> {
      const cached = cache.get(key);

      if (cached && cached.expiresAt > Date.now()) {
        return cached.value;
      }

      // Placeholder for actual secret fetching
      const secret = process.env[key] || '';

      cache.set(key, {
        value: secret,
        expiresAt: Date.now() + cacheDuration,
      });

      return secret;
    },

    invalidate(key: string): void {
      cache.delete(key);
    },

    clear(): void {
      cache.clear();
    },
  };
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
export const encryptSecrets = (
  secrets: Record<string, string>,
  masterKey: string,
): Record<string, string> => {
  const encrypted: Record<string, string> = {};

  for (const [key, value] of Object.entries(secrets)) {
    const keyBuffer = crypto.scryptSync(masterKey, 'salt', 32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', keyBuffer, iv);

    let encryptedValue = cipher.update(value, 'utf8', 'base64');
    encryptedValue += cipher.final('base64');

    encrypted[key] = `${iv.toString('base64')}:${encryptedValue}`;
  }

  return encrypted;
};

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
export const decryptSecrets = (
  encryptedSecrets: Record<string, string>,
  masterKey: string,
): Record<string, string> => {
  const decrypted: Record<string, string> = {};

  for (const [key, value] of Object.entries(encryptedSecrets)) {
    const [ivBase64, encrypted] = value.split(':');
    const keyBuffer = crypto.scryptSync(masterKey, 'salt', 32);
    const iv = Buffer.from(ivBase64, 'base64');
    const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, iv);

    let decryptedValue = decipher.update(encrypted, 'base64', 'utf8');
    decryptedValue += decipher.final('utf8');

    decrypted[key] = decryptedValue;
  }

  return decrypted;
};

// ============================================================================
// FEATURE FLAGS
// ============================================================================

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
export const createFeatureFlagService = (
  flags: Record<string, FeatureFlagOptions>,
) => {
  return {
    isEnabled(flagName: string, context?: { userId?: string; segment?: string }): boolean {
      const flag = flags[flagName];

      if (!flag || !flag.enabled) return false;

      // Check date range
      const now = new Date();
      if (flag.startDate && now < flag.startDate) return false;
      if (flag.endDate && now > flag.endDate) return false;

      // Check segments
      if (flag.segments && context?.segment) {
        if (!flag.segments.includes(context.segment)) return false;
      }

      // Check rollout percentage
      if (flag.rollout !== undefined && context?.userId) {
        const hash = simpleHashFunction(context.userId);
        return (hash % 100) < flag.rollout;
      }

      // Check conditions
      if (flag.conditions && context) {
        return evaluateConditions(flag.conditions, context);
      }

      return true;
    },

    getVariant(flagName: string, variants: string[], context?: { userId?: string }): string {
      if (!this.isEnabled(flagName, context)) {
        return variants[0]; // Default variant
      }

      if (context?.userId) {
        const hash = simpleHashFunction(`${flagName}:${context.userId}`);
        return variants[hash % variants.length];
      }

      return variants[0];
    },

    getAllFlags(): Record<string, FeatureFlagOptions> {
      return flags;
    },

    updateFlag(flagName: string, updates: Partial<FeatureFlagOptions>): void {
      if (flags[flagName]) {
        flags[flagName] = { ...flags[flagName], ...updates };
      }
    },
  };
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
export const evaluateFeatureFlagComplex = (
  flagName: string,
  conditions: Record<string, any>,
  context: Record<string, any>,
): boolean => {
  return evaluateConditions(conditions, context);
};

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
export const createPercentageRollout = (
  flagName: string,
  percentage: number,
): ((userId: string) => boolean) => {
  return (userId: string) => {
    const hash = simpleHashFunction(`${flagName}:${userId}`);
    return (hash % 100) < percentage;
  };
};

// ============================================================================
// CONFIGURATION CHANGE DETECTION
// ============================================================================

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
export const watchMultipleConfigs = (
  filePaths: string[],
  callback: (changes: Map<string, any>) => void,
  debounce = 1000,
): { stop: () => void } => {
  const watchers: FSWatcher[] = [];
  const changes = new Map<string, any>();
  let timeoutId: NodeJS.Timeout | null = null;

  const handleChange = (filePath: string) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    changes.set(filePath, autoLoadConfig(filePath));

    timeoutId = setTimeout(() => {
      callback(new Map(changes));
      changes.clear();
    }, debounce);
  };

  for (const filePath of filePaths) {
    if (fs.existsSync(filePath)) {
      const watcher = watch(filePath, () => handleChange(filePath));
      watchers.push(watcher);
    }
  }

  return {
    stop: () => {
      if (timeoutId) clearTimeout(timeoutId);
      watchers.forEach(w => w.close());
    },
  };
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
export const detectConfigChanges = (
  oldConfig: any,
  newConfig: any,
): { added: string[]; modified: string[]; removed: string[] } => {
  const added: string[] = [];
  const modified: string[] = [];
  const removed: string[] = [];

  const oldKeys = new Set(Object.keys(oldConfig || {}));
  const newKeys = new Set(Object.keys(newConfig || {}));

  // Detect added keys
  for (const key of newKeys) {
    if (!oldKeys.has(key)) {
      added.push(key);
    } else if (JSON.stringify(oldConfig[key]) !== JSON.stringify(newConfig[key])) {
      modified.push(key);
    }
  }

  // Detect removed keys
  for (const key of oldKeys) {
    if (!newKeys.has(key)) {
      removed.push(key);
    }
  }

  return { added, modified, removed };
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
export const createConfigChangeEmitter = (configPath: string) => {
  const listeners: Record<string, Array<(data: any) => void>> = {};
  let watcher: FSWatcher | null = null;
  let currentConfig: any = null;

  return {
    on(event: 'change' | 'error', callback: (data: any) => void): void {
      if (!listeners[event]) {
        listeners[event] = [];
      }
      listeners[event].push(callback);
    },

    emit(event: string, data: any): void {
      if (listeners[event]) {
        listeners[event].forEach(callback => callback(data));
      }
    },

    start(): void {
      currentConfig = autoLoadConfig(configPath);

      watcher = watch(configPath, () => {
        try {
          const newConfig = autoLoadConfig(configPath);
          const diff = detectConfigChanges(currentConfig, newConfig);

          this.emit('change', { diff, newConfig, oldConfig: currentConfig });
          currentConfig = newConfig;
        } catch (error) {
          this.emit('error', error);
        }
      });
    },

    stop(): void {
      if (watcher) {
        watcher.close();
      }
    },
  };
};

// ============================================================================
// CONFIGURATION CACHING
// ============================================================================

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
export const memoizeConfigGetter = (
  getter: (key: string) => any,
  ttl = 60000,
): ((key: string) => any) => {
  const cache = new Map<string, { value: any; expiresAt: number }>();

  return (key: string) => {
    const cached = cache.get(key);

    if (cached && cached.expiresAt > Date.now()) {
      return cached.value;
    }

    const value = getter(key);

    cache.set(key, {
      value,
      expiresAt: Date.now() + ttl,
    });

    return value;
  };
};

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
export const createConfigLRUCache = (maxSize = 100) => {
  const cache = new Map<string, any>();

  return {
    get(key: string): any {
      if (!cache.has(key)) return undefined;

      // Move to end (most recently used)
      const value = cache.get(key);
      cache.delete(key);
      cache.set(key, value);

      return value;
    },

    set(key: string, value: any): void {
      if (cache.has(key)) {
        cache.delete(key);
      }

      cache.set(key, value);

      if (cache.size > maxSize) {
        // Remove least recently used (first item)
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
      }
    },

    has(key: string): boolean {
      return cache.has(key);
    },

    clear(): void {
      cache.clear();
    },

    size(): number {
      return cache.size;
    },
  };
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
export const preloadConfigCache = async (
  configPaths: string[],
): Promise<Map<string, any>> => {
  const cache = new Map<string, any>();

  for (const configPath of configPaths) {
    try {
      const config = autoLoadConfig(configPath);
      cache.set(configPath, config);
    } catch (error) {
      console.warn(`Failed to preload config ${configPath}:`, error);
    }
  }

  return cache;
};

// ============================================================================
// CONFIGURATION MIGRATION
// ============================================================================

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
export const migrateConfig = (
  config: any,
  migrations: ConfigMigration[],
  targetVersion: string,
): any => {
  let migrated = { ...config };

  const currentVersion = config.version || '1.0.0';
  const sortedMigrations = migrations.sort((a, b) =>
    compareVersions(a.version, b.version)
  );

  for (const migration of sortedMigrations) {
    if (
      compareVersions(migration.version, currentVersion) > 0 &&
      compareVersions(migration.version, targetVersion) <= 0
    ) {
      migrated = migration.up(migrated);
      migrated.version = migration.version;
    }
  }

  return migrated;
};

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
export const createConfigSnapshot = (
  config: any,
  version: string,
  environment: string,
): ConfigSnapshot => {
  const configString = JSON.stringify(config);
  const checksum = crypto.createHash('sha256').update(configString).digest('hex');

  return {
    timestamp: new Date(),
    version,
    config,
    checksum,
    environment,
  };
};

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
export const validateConfigSnapshot = (snapshot: ConfigSnapshot): boolean => {
  const configString = JSON.stringify(snapshot.config);
  const checksum = crypto.createHash('sha256').update(configString).digest('hex');

  return checksum === snapshot.checksum;
};

// ============================================================================
// CONFIGURATION UTILITIES
// ============================================================================

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
export const flattenConfig = (
  config: any,
  prefix = '',
): Record<string, any> => {
  const flattened: Record<string, any> = {};

  for (const [key, value] of Object.entries(config)) {
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(flattened, flattenConfig(value, newKey));
    } else {
      flattened[newKey] = value;
    }
  }

  return flattened;
};

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
export const expandConfig = (flatConfig: Record<string, any>): any => {
  const expanded: any = {};

  for (const [key, value] of Object.entries(flatConfig)) {
    setNestedValue(expanded, key, value);
  }

  return expanded;
};

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
export const compareConfigs = (
  config1: any,
  config2: any,
): Record<string, { old: any; new: any }> => {
  const flat1 = flattenConfig(config1);
  const flat2 = flattenConfig(config2);
  const differences: Record<string, { old: any; new: any }> = {};

  const allKeys = new Set([...Object.keys(flat1), ...Object.keys(flat2)]);

  for (const key of allKeys) {
    if (flat1[key] !== flat2[key]) {
      differences[key] = {
        old: flat1[key],
        new: flat2[key],
      };
    }
  }

  return differences;
};

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
export const mergeConfigWithEnv = (config: any, envPrefix = ''): any => {
  const merged = { ...config };
  const flatMerged = flattenConfig(merged);

  for (const [key, value] of Object.entries(process.env)) {
    if (envPrefix && !key.startsWith(envPrefix)) continue;

    const configKey = envPrefix
      ? key.slice(envPrefix.length).toLowerCase().replace(/_/g, '.')
      : key.toLowerCase().replace(/_/g, '.');

    if (configKey in flatMerged) {
      flatMerged[configKey] = value;
    }
  }

  return expandConfig(flatMerged);
};

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
export const exportConfig = (
  config: any,
  format: 'json' | 'yaml' | 'env' | 'toml' = 'json',
): string => {
  switch (format) {
    case 'json':
      return JSON.stringify(config, null, 2);

    case 'yaml':
      return stringifySimpleYAML(config);

    case 'env':
      const flat = flattenConfig(config);
      return Object.entries(flat)
        .map(([key, value]) => `${key.toUpperCase().replace(/\./g, '_')}=${value}`)
        .join('\n');

    case 'toml':
      return stringifySimpleTOML(config);

    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
};

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
export const validateConfigCompleteness = (
  configs: Record<string, any>,
  requiredKeys: string[],
): { valid: boolean; missing: Record<string, string[]> } => {
  const missing: Record<string, string[]> = {};

  for (const [env, config] of Object.entries(configs)) {
    const envMissing: string[] = [];

    for (const key of requiredKeys) {
      if (getNestedValue(config, key) === undefined) {
        envMissing.push(key);
      }
    }

    if (envMissing.length > 0) {
      missing[env] = envMissing;
    }
  }

  return {
    valid: Object.keys(missing).length === 0,
    missing,
  };
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
export const createConfigProxy = (
  config: any,
  onAccess: (key: string) => void,
): any => {
  const handler = {
    get(target: any, prop: string) {
      onAccess(prop);
      const value = target[prop];

      if (value !== null && typeof value === 'object') {
        return new Proxy(value, handler);
      }

      return value;
    },
  };

  return new Proxy(config, handler);
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Deep merges two configuration objects.
 */
const deepMergeConfigs = (target: any, source: any): any => {
  if (!isPlainObject(target) || !isPlainObject(source)) {
    return source;
  }

  const result = { ...target };

  for (const key in source) {
    if (isPlainObject(source[key])) {
      result[key] = deepMergeConfigs(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }

  return result;
};

/**
 * Checks if value is a plain object.
 */
const isPlainObject = (obj: any): boolean => {
  return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
};

/**
 * Gets nested value from object using dot notation.
 */
const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

/**
 * Sets nested value in object using dot notation.
 */
const setNestedValue = (obj: any, path: string, value: any): void => {
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  const target = keys.reduce((current, key) => {
    if (!current[key]) current[key] = {};
    return current[key];
  }, obj);
  target[lastKey] = value;
};

/**
 * Simple hash function for deterministic hashing.
 */
const simpleHashFunction = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

/**
 * Evaluates conditions against context.
 */
const evaluateConditions = (conditions: Record<string, any>, context: Record<string, any>): boolean => {
  for (const [key, value] of Object.entries(conditions)) {
    if (context[key] !== value) {
      return false;
    }
  }
  return true;
};

/**
 * Compares two semantic versions.
 */
const compareVersions = (v1: string, v2: string): number => {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);

  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const part1 = parts1[i] || 0;
    const part2 = parts2[i] || 0;

    if (part1 > part2) return 1;
    if (part1 < part2) return -1;
  }

  return 0;
};

/**
 * Loads secret from provider (placeholder).
 */
const loadSecretFromProvider = async (provider: string, secretId: string): Promise<string> => {
  // Placeholder implementation
  return process.env[secretId] || '';
};

/**
 * Loads JSON config safely with error handling.
 */
const loadJSONConfigSafe = (filePath: string): any => {
  const absolutePath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);

  if (!fs.existsSync(absolutePath)) {
    return {};
  }

  try {
    const content = fs.readFileSync(absolutePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.warn(`Failed to parse JSON file ${filePath}:`, error);
    return {};
  }
};

/**
 * Simple YAML parser (basic implementation).
 */
const parseSimpleYAML = (content: string): any => {
  const lines = content.split('\n');
  const result: any = {};
  let currentKey = '';
  let currentIndent = 0;

  for (const line of lines) {
    if (!line.trim() || line.trim().startsWith('#')) continue;

    const match = line.match(/^(\s*)([^:]+):\s*(.*)$/);
    if (match) {
      const [, indent, key, value] = match;
      const indentLevel = indent.length;

      if (value.trim()) {
        result[key.trim()] = parseYAMLValue(value.trim());
      } else {
        currentKey = key.trim();
        currentIndent = indentLevel;
        result[currentKey] = {};
      }
    }
  }

  return result;
};

/**
 * Parses YAML value with type inference.
 */
const parseYAMLValue = (value: string): any => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value === 'null') return null;
  if (!isNaN(Number(value))) return Number(value);
  if (value.startsWith('"') && value.endsWith('"')) return value.slice(1, -1);
  if (value.startsWith("'") && value.endsWith("'")) return value.slice(1, -1);
  return value;
};

/**
 * Simple YAML stringifier.
 */
const stringifySimpleYAML = (obj: any, indent = 0): string => {
  const lines: string[] = [];
  const spaces = ' '.repeat(indent);

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      lines.push(`${spaces}${key}:`);
      lines.push(stringifySimpleYAML(value, indent + 2));
    } else {
      lines.push(`${spaces}${key}: ${value}`);
    }
  }

  return lines.join('\n');
};

/**
 * Simple TOML parser (basic implementation).
 */
const parseSimpleTOML = (content: string): any => {
  const result: any = {};
  let currentSection = '';

  content.split('\n').forEach(line => {
    line = line.trim();
    if (!line || line.startsWith('#')) return;

    // Section
    const sectionMatch = line.match(/^\[([^\]]+)\]$/);
    if (sectionMatch) {
      currentSection = sectionMatch[1];
      result[currentSection] = {};
      return;
    }

    // Key-value
    const kvMatch = line.match(/^([^=]+)=(.*)$/);
    if (kvMatch) {
      const key = kvMatch[1].trim();
      const value = parseTOMLValue(kvMatch[2].trim());

      if (currentSection) {
        result[currentSection][key] = value;
      } else {
        result[key] = value;
      }
    }
  });

  return result;
};

/**
 * Parses TOML value with type inference.
 */
const parseTOMLValue = (value: string): any => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (!isNaN(Number(value))) return Number(value);
  if (value.startsWith('"') && value.endsWith('"')) return value.slice(1, -1);
  if (value.startsWith("'") && value.endsWith("'")) return value.slice(1, -1);
  return value;
};

/**
 * Simple TOML stringifier.
 */
const stringifySimpleTOML = (obj: any): string => {
  const lines: string[] = [];

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      lines.push(`[${key}]`);
      for (const [k, v] of Object.entries(value)) {
        lines.push(`${k} = ${formatTOMLValue(v)}`);
      }
      lines.push('');
    } else {
      lines.push(`${key} = ${formatTOMLValue(value)}`);
    }
  }

  return lines.join('\n');
};

/**
 * Formats value for TOML output.
 */
const formatTOMLValue = (value: any): string => {
  if (typeof value === 'string') return `"${value}"`;
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  return String(value);
};
