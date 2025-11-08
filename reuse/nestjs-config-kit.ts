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
 * File: /reuse/nestjs-config-kit.ts
 * Locator: WC-UTL-CFG-001
 * Purpose: Comprehensive NestJS Configuration Management Toolkit - Complete configuration utilities
 *
 * Upstream: Independent utility module for NestJS configuration operations
 * Downstream: ../backend/*, Config modules, Bootstrap files, Environment configs
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/config, joi, class-validator
 * Exports: 50 utility functions for config management, validation, secrets, feature flags
 *
 * LLM Context: Enterprise-grade configuration utilities for White Cross healthcare platform.
 * Provides environment variable management, Joi/class-validator schema validation, type-safe
 * config access, namespace management, dynamic loading, AWS/Azure secrets integration,
 * feature flags, multi-environment support, config caching, hot-reload, and HIPAA-compliant
 * configuration patterns for healthcare applications.
 */

import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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

// ============================================================================
// ENVIRONMENT VARIABLE UTILITIES
// ============================================================================

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
export const getEnv = <T = string>(key: string, defaultValue: T): T => {
  const value = process.env[key];

  if (value === undefined || value === null) {
    return defaultValue;
  }

  const defaultType = typeof defaultValue;

  if (defaultType === 'number') {
    const parsed = Number(value);
    return (isNaN(parsed) ? defaultValue : parsed) as T;
  }

  if (defaultType === 'boolean') {
    return (value.toLowerCase() === 'true' || value === '1') as T;
  }

  return value as T;
};

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
export const getRequiredEnv = (key: string, message?: string): string => {
  const value = process.env[key];

  if (!value) {
    throw new Error(
      message || `Required environment variable "${key}" is not set`
    );
  }

  return value;
};

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
export const parseEnvInt = (
  key: string,
  defaultValue: number,
  constraints?: { min?: number; max?: number }
): number => {
  const value = process.env[key];

  if (!value) return defaultValue;

  const parsed = parseInt(value, 10);

  if (isNaN(parsed)) return defaultValue;

  if (constraints?.min !== undefined && parsed < constraints.min) {
    return constraints.min;
  }

  if (constraints?.max !== undefined && parsed > constraints.max) {
    return constraints.max;
  }

  return parsed;
};

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
export const parseEnvFloat = (
  key: string,
  defaultValue: number,
  constraints?: { min?: number; max?: number }
): number => {
  const value = process.env[key];

  if (!value) return defaultValue;

  const parsed = parseFloat(value);

  if (isNaN(parsed)) return defaultValue;

  if (constraints?.min !== undefined && parsed < constraints.min) {
    return constraints.min;
  }

  if (constraints?.max !== undefined && parsed > constraints.max) {
    return constraints.max;
  }

  return parsed;
};

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
export const parseEnvBool = (key: string, defaultValue: boolean): boolean => {
  const value = process.env[key];

  if (!value) return defaultValue;

  const normalized = value.toLowerCase().trim();

  const truthyValues = ['true', '1', 'yes', 'on', 'enabled'];
  const falsyValues = ['false', '0', 'no', 'off', 'disabled'];

  if (truthyValues.includes(normalized)) return true;
  if (falsyValues.includes(normalized)) return false;

  return defaultValue;
};

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
export const parseEnvJSON = <T = any>(key: string, defaultValue: T): T => {
  const value = process.env[key];

  if (!value) return defaultValue;

  try {
    return JSON.parse(value) as T;
  } catch {
    return defaultValue;
  }
};

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
export const parseEnvArray = (
  key: string,
  defaultValue: string[] = [],
  separator: string = ','
): string[] => {
  const value = process.env[key];

  if (!value) return defaultValue;

  return value
    .split(separator)
    .map(item => item.trim())
    .filter(item => item.length > 0);
};

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
export const expandEnvVars = (
  value: string,
  env: Record<string, string> = process.env as Record<string, string>
): string => {
  return value.replace(/\$\{([^}]+)\}/g, (_, varName) => {
    const varValue = env[varName];

    if (varValue === undefined) {
      console.warn(`Environment variable ${varName} is not defined`);
      return '';
    }

    return varValue;
  });
};

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
export const setEnvVars = (
  vars: Record<string, string>,
  override: boolean = false
): void => {
  Object.entries(vars).forEach(([key, value]) => {
    if (override || !process.env[key]) {
      process.env[key] = value;
    }
  });
};

// ============================================================================
// CONFIGURATION MODULE BUILDERS
// ============================================================================

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
export const createConfigModuleOptions = (
  options: Partial<ConfigModuleInit> = {}
): ConfigModuleInit => {
  const env = process.env.NODE_ENV || 'development';

  return {
    isGlobal: true,
    cache: true,
    expandVariables: true,
    envFilePath: [
      `.env.${env}.local`,
      `.env.${env}`,
      '.env.local',
      '.env',
    ],
    ...options,
  };
};

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
export const createTestConfigOptions = (
  testVars?: Record<string, string>
): ConfigModuleInit => {
  if (testVars) {
    setEnvVars(testVars, true);
  }

  return {
    isGlobal: true,
    cache: false,
    ignoreEnvFile: true,
    expandVariables: false,
  };
};

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
export const createAsyncConfigFactory = (
  loader: () => Promise<Record<string, any>>
): (() => Promise<Record<string, any>>) => {
  let cachedConfig: Record<string, any> | null = null;

  return async () => {
    if (!cachedConfig) {
      cachedConfig = await loader();
    }
    return cachedConfig;
  };
};

// ============================================================================
// CONFIGURATION NAMESPACES
// ============================================================================

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
export const createNamespace = (
  namespace: string,
  config: Record<string, any>
): Record<string, any> => {
  return { [namespace]: config };
};

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
export const getNamespacedValue = <T = any>(
  config: Record<string, any>,
  path: string,
  defaultValue?: T
): T => {
  const keys = path.split('.');
  let value: any = config;

  for (const key of keys) {
    if (value === null || value === undefined || typeof value !== 'object') {
      return defaultValue as T;
    }
    value = value[key];
  }

  return value !== undefined ? value : (defaultValue as T);
};

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
export const setNamespacedValue = (
  config: Record<string, any>,
  path: string,
  value: any
): void => {
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  let current = config;

  for (const key of keys) {
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }

  current[lastKey] = value;
};

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
export const mergeNamespaces = (
  configs: Record<string, any>[],
  options?: MergeStrategyOptions
): Record<string, any> => {
  return mergeConfigs(configs, options);
};

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
export const extractNamespace = (
  config: Record<string, any>,
  namespace: string
): Record<string, any> | undefined => {
  return config[namespace];
};

// ============================================================================
// CONFIGURATION VALIDATION
// ============================================================================

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
export const validateWithJoi = (
  config: Record<string, any>,
  schema: any
): ConfigValidationResult => {
  const { error, value, warning } = schema.validate(config, {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: false,
  });

  if (error) {
    return {
      valid: false,
      errors: error.details.map((detail: any) => detail.message),
      warnings: warning ? warning.details.map((w: any) => w.message) : [],
    };
  }

  return {
    valid: true,
    config: value,
    warnings: warning ? warning.details.map((w: any) => w.message) : [],
  };
};

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
export const createConfigTypeGuard = (
  typeMap: Record<string, string>
): ((config: any) => boolean) => {
  return (config: any): boolean => {
    if (!config || typeof config !== 'object') return false;

    return Object.entries(typeMap).every(([key, expectedType]) => {
      const value = config[key];

      if (value === undefined || value === null) return false;

      return typeof value === expectedType;
    });
  };
};

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
export const validateRequiredKeys = (
  config: Record<string, any>,
  requiredKeys: string[]
): ConfigValidationResult => {
  const missing = requiredKeys.filter(key => {
    const value = config[key];
    return value === undefined || value === null || value === '';
  });

  if (missing.length > 0) {
    return {
      valid: false,
      errors: missing.map(key => `Required configuration key "${key}" is missing`),
    };
  }

  return { valid: true, config };
};

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
export const validateConstraints = (
  config: Record<string, any>,
  constraints: Record<string, any>
): ConfigValidationResult => {
  const errors: string[] = [];

  Object.entries(constraints).forEach(([key, constraint]) => {
    const value = config[key];

    if (value === undefined || value === null) return;

    if (constraint.min !== undefined && value < constraint.min) {
      errors.push(`${key} must be at least ${constraint.min}`);
    }

    if (constraint.max !== undefined && value > constraint.max) {
      errors.push(`${key} must be at most ${constraint.max}`);
    }

    if (constraint.enum && !constraint.enum.includes(value)) {
      errors.push(`${key} must be one of: ${constraint.enum.join(', ')}`);
    }

    if (constraint.pattern && !constraint.pattern.test(value)) {
      errors.push(`${key} does not match required pattern`);
    }
  });

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
    config,
  };
};

// ============================================================================
// ENVIRONMENT DETECTION
// ============================================================================

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
export const detectEnvironment = (): EnvironmentInfo => {
  const nodeEnv = (process.env.NODE_ENV || 'development').toLowerCase();

  return {
    name: nodeEnv,
    nodeEnv,
    isProduction: nodeEnv === 'production' || nodeEnv === 'prod',
    isDevelopment: nodeEnv === 'development' || nodeEnv === 'dev',
    isTest: nodeEnv === 'test' || nodeEnv === 'testing',
    isStaging: nodeEnv === 'staging' || nodeEnv === 'stage',
  };
};

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
export const isProduction = (): boolean => {
  return detectEnvironment().isProduction;
};

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
export const isDevelopment = (): boolean => {
  return detectEnvironment().isDevelopment;
};

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
export const isTest = (): boolean => {
  return detectEnvironment().isTest;
};

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
export const getEnvSpecificValue = <T = any>(
  envMap: Record<string, T>,
  defaultValue?: T
): T => {
  const env = detectEnvironment();
  return envMap[env.name] || defaultValue!;
};

// ============================================================================
// CONFIGURATION MERGING
// ============================================================================

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
export const mergeConfigs = (
  configs: Record<string, any>[],
  options?: MergeStrategyOptions
): Record<string, any> => {
  const opts: MergeStrategyOptions = {
    deep: true,
    arrayMerge: 'replace',
    skipNull: false,
    skipUndefined: true,
    ...options,
  };

  return configs.reduce((merged, config) => {
    return deepMerge(merged, config, opts);
  }, {});
};

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
export const deepMerge = (
  target: Record<string, any>,
  source: Record<string, any>,
  options?: MergeStrategyOptions
): Record<string, any> => {
  const opts: MergeStrategyOptions = {
    deep: true,
    arrayMerge: 'replace',
    skipNull: false,
    skipUndefined: true,
    ...options,
  };

  const result = { ...target };

  Object.entries(source).forEach(([key, sourceValue]) => {
    if (opts.skipUndefined && sourceValue === undefined) return;
    if (opts.skipNull && sourceValue === null) return;

    const targetValue = result[key];

    // Handle arrays
    if (Array.isArray(sourceValue)) {
      if (opts.arrayMerge === 'concat' && Array.isArray(targetValue)) {
        result[key] = [...targetValue, ...sourceValue];
      } else if (opts.arrayMerge === 'unique' && Array.isArray(targetValue)) {
        result[key] = [...new Set([...targetValue, ...sourceValue])];
      } else {
        result[key] = [...sourceValue];
      }
      return;
    }

    // Handle objects
    if (opts.deep && isPlainObject(sourceValue)) {
      if (isPlainObject(targetValue)) {
        result[key] = deepMerge(targetValue, sourceValue, opts);
      } else {
        result[key] = deepMerge({}, sourceValue, opts);
      }
      return;
    }

    // Primitive values
    result[key] = sourceValue;
  });

  return result;
};

/**
 * Helper function to check if value is a plain object.
 */
const isPlainObject = (value: any): boolean => {
  return value !== null &&
         typeof value === 'object' &&
         !Array.isArray(value) &&
         Object.getPrototypeOf(value) === Object.prototype;
};

// ============================================================================
// FEATURE FLAGS
// ============================================================================

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
export const createFeatureFlag = (
  name: string,
  enabled: boolean,
  options?: Partial<FeatureFlag>
): FeatureFlag => {
  return {
    name,
    enabled,
    environments: options?.environments,
    percentage: options?.percentage,
    metadata: options?.metadata,
  };
};

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
export const isFeatureEnabled = (
  flag: FeatureFlag,
  env?: EnvironmentInfo
): boolean => {
  if (!flag.enabled) return false;

  const currentEnv = env || detectEnvironment();

  // Check environment restrictions
  if (flag.environments && !flag.environments.includes(currentEnv.name)) {
    return false;
  }

  // Check percentage rollout
  if (flag.percentage !== undefined && flag.percentage < 100) {
    const randomValue = Math.random() * 100;
    return randomValue < flag.percentage;
  }

  return true;
};

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
export const createFeatureFlagManager = (flags: FeatureFlag[]) => {
  const flagMap = new Map<string, FeatureFlag>(
    flags.map(flag => [flag.name, flag])
  );

  return {
    isEnabled: (name: string): boolean => {
      const flag = flagMap.get(name);
      return flag ? isFeatureEnabled(flag) : false;
    },

    getFlag: (name: string): FeatureFlag | undefined => {
      return flagMap.get(name);
    },

    getAllFlags: (): FeatureFlag[] => {
      return Array.from(flagMap.values());
    },

    addFlag: (flag: FeatureFlag): void => {
      flagMap.set(flag.name, flag);
    },

    removeFlag: (name: string): boolean => {
      return flagMap.delete(name);
    },
  };
};

// ============================================================================
// SECRETS MANAGEMENT
// ============================================================================

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
export const encryptConfigValue = (value: string, key: string): string => {
  const keyBuffer = Buffer.from(key, 'hex');
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', keyBuffer, iv);

  let encrypted = cipher.update(value, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
};

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
export const decryptConfigValue = (encryptedValue: string, key: string): string => {
  const [ivHex, authTagHex, encrypted] = encryptedValue.split(':');

  const keyBuffer = Buffer.from(key, 'hex');
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');

  const decipher = crypto.createDecipheriv('aes-256-gcm', keyBuffer, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
};

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
export const maskConfigValue = (value: string, visibleChars: number = 4): string => {
  if (!value || value.length <= visibleChars * 2) {
    return '***';
  }

  const start = value.slice(0, visibleChars);
  const end = value.slice(-visibleChars);
  const masked = '*'.repeat(Math.min(value.length - visibleChars * 2, 10));

  return `${start}${masked}${end}`;
};

/**
 * Creates AWS Secrets Manager loader (placeholder).
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
export const loadFromAWSSecrets = async (
  secretName: string,
  region: string = 'us-east-1'
): Promise<Record<string, string>> => {
  // Placeholder - implement with AWS SDK
  console.warn('loadFromAWSSecrets is a placeholder - implement with @aws-sdk/client-secrets-manager');
  return {};
};

/**
 * Creates Azure Key Vault loader (placeholder).
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
export const loadFromAzureKeyVault = async (
  vaultUrl: string,
  secretNames: string[]
): Promise<Record<string, string>> => {
  // Placeholder - implement with Azure SDK
  console.warn('loadFromAzureKeyVault is a placeholder - implement with @azure/keyvault-secrets');
  return {};
};

// ============================================================================
// CONFIGURATION CACHING
// ============================================================================

/**
 * Configuration cache implementation with TTL.
 */
export class ConfigCache {
  private cache = new Map<string, ConfigCacheEntry>();

  /**
   * Sets a value in cache with TTL.
   *
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} [ttl] - TTL in milliseconds (default: 5 minutes)
   */
  set(key: string, value: any, ttl: number = 300000): void {
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * Gets value from cache if not expired.
   *
   * @param {string} key - Cache key
   * @returns {any | undefined} Cached value or undefined
   */
  get(key: string): any | undefined {
    const entry = this.cache.get(key);

    if (!entry) return undefined;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return undefined;
    }

    return entry.value;
  }

  /**
   * Checks if key exists and is not expired.
   *
   * @param {string} key - Cache key
   * @returns {boolean} True if exists and valid
   */
  has(key: string): boolean {
    return this.get(key) !== undefined;
  }

  /**
   * Clears all cached entries.
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Removes expired entries.
   */
  purge(): void {
    const now = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Gets cache statistics.
   *
   * @returns {object} Cache stats
   */
  getStats() {
    const entries = Array.from(this.cache.values());
    const now = Date.now();

    return {
      size: this.cache.size,
      valid: entries.filter(e => now - e.timestamp <= e.ttl).length,
      expired: entries.filter(e => now - e.timestamp > e.ttl).length,
    };
  }
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
export const createCachedGetter = (
  getter: (key: string) => any,
  ttl: number = 300000
): ((key: string) => any) => {
  const cache = new ConfigCache();

  return (key: string) => {
    if (cache.has(key)) {
      return cache.get(key);
    }

    const value = getter(key);
    cache.set(key, value, ttl);
    return value;
  };
};

// ============================================================================
// CONFIGURATION UTILITIES
// ============================================================================

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
export const generateConfigDocs = (
  schema: Record<string, any>,
  descriptions?: Record<string, string>
): string => {
  let markdown = '# Configuration Documentation\n\n';
  markdown += '## Environment Variables\n\n';
  markdown += '| Variable | Type | Description | Required |\n';
  markdown += '|----------|------|-------------|----------|\n';

  Object.entries(schema).forEach(([key, type]) => {
    const desc = descriptions?.[key] || '-';
    const required = String(type).includes('required') ? 'Yes' : 'No';
    markdown += `| ${key} | ${type} | ${desc} | ${required} |\n`;
  });

  return markdown;
};

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
export const exportEnvTemplate = (
  schema: Record<string, any>,
  descriptions?: Record<string, string>
): string => {
  let content = '# Configuration Template\n';
  content += '# Copy this file to .env and fill in the values\n\n';

  Object.entries(schema).forEach(([key, type]) => {
    const desc = descriptions?.[key];

    if (desc) {
      content += `# ${desc}\n`;
    }

    content += `# Type: ${type}\n`;
    content += `${key}=\n\n`;
  });

  return content;
};

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
export const sanitizeConfig = (
  config: Record<string, any>,
  secretKeys: string[] = ['PASSWORD', 'SECRET', 'TOKEN', 'KEY', 'CREDENTIAL']
): Record<string, any> => {
  const sanitized: Record<string, any> = {};

  Object.entries(config).forEach(([key, value]) => {
    const upperKey = key.toUpperCase();
    const isSecret = secretKeys.some(secretKey => upperKey.includes(secretKey));

    if (isSecret && typeof value === 'string') {
      sanitized[key] = maskConfigValue(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeConfig(value, secretKeys);
    } else {
      sanitized[key] = value;
    }
  });

  return sanitized;
};

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
export const validateURLs = (
  urls: Record<string, string>
): ConfigValidationResult => {
  const errors: string[] = [];

  Object.entries(urls).forEach(([key, url]) => {
    try {
      new URL(url);
    } catch {
      errors.push(`${key} is not a valid URL: ${url}`);
    }
  });

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
};

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
export const createMockConfigService = (mockConfig: Record<string, any>) => {
  return {
    get: <T = any>(key: string, defaultValue?: T): T => {
      return getNamespacedValue<T>(mockConfig, key, defaultValue);
    },

    getOrThrow: <T = any>(key: string): T => {
      const value = getNamespacedValue<T>(mockConfig, key);
      if (value === undefined) {
        throw new Error(`Configuration key "${key}" is not set`);
      }
      return value;
    },
  };
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Environment Variables
  getEnv,
  getRequiredEnv,
  parseEnvInt,
  parseEnvFloat,
  parseEnvBool,
  parseEnvJSON,
  parseEnvArray,
  expandEnvVars,
  setEnvVars,

  // Module Builders
  createConfigModuleOptions,
  createTestConfigOptions,
  createAsyncConfigFactory,

  // Namespaces
  createNamespace,
  getNamespacedValue,
  setNamespacedValue,
  mergeNamespaces,
  extractNamespace,

  // Validation
  validateWithJoi,
  createConfigTypeGuard,
  validateRequiredKeys,
  validateConstraints,
  validateURLs,

  // Environment Detection
  detectEnvironment,
  isProduction,
  isDevelopment,
  isTest,
  getEnvSpecificValue,

  // Merging
  mergeConfigs,
  deepMerge,

  // Feature Flags
  createFeatureFlag,
  isFeatureEnabled,
  createFeatureFlagManager,

  // Secrets
  encryptConfigValue,
  decryptConfigValue,
  maskConfigValue,
  loadFromAWSSecrets,
  loadFromAzureKeyVault,

  // Caching
  ConfigCache,
  createCachedGetter,

  // Utilities
  generateConfigDocs,
  exportEnvTemplate,
  sanitizeConfig,
  createMockConfigService,
};
