/**
 * @fileoverview Environment Configuration Kit
 * @module core/config/environment-kit
 *
 * Environment-specific configuration utilities including .env file loading,
 * environment detection, and multi-environment management.
 */

import * as fs from 'fs';
import * as path from 'path';

/**
 * Environment type
 */
export type Environment = 'development' | 'staging' | 'production' | 'test' | string;

/**
 * Environment configuration
 */
export interface EnvironmentConfig {
  /** Current environment */
  env: Environment;
  /** Is development environment */
  isDevelopment: boolean;
  /** Is production environment */
  isProduction: boolean;
  /** Is test environment */
  isTest: boolean;
  /** Is staging environment */
  isStaging: boolean;
  /** Environment variables */
  variables: Record<string, string>;
}

/**
 * .env file parsing options
 */
export interface EnvFileOptions {
  /** Path to .env file */
  path?: string;
  /** Encoding */
  encoding?: BufferEncoding;
  /** Override existing env variables */
  override?: boolean;
  /** Throw error if file not found */
  required?: boolean;
}

/**
 * Loads and parses a .env file
 *
 * @param options - Loading options
 * @returns Parsed environment variables
 *
 * @example
 * ```typescript
 * loadEnvFile({ path: '.env.production' });
 * // Loads variables from .env.production into process.env
 * ```
 */
export function loadEnvFile(
  options: EnvFileOptions = {}
): Record<string, string> {
  const {
    path: envPath = '.env',
    encoding = 'utf8',
    override = false,
    required = false,
  } = options;

  try {
    if (!fs.existsSync(envPath)) {
      if (required) {
        throw new Error(`Required .env file not found: ${envPath}`);
      }
      return {};
    }

    const content = fs.readFileSync(envPath, { encoding });
    const parsed = parseEnvContent(content);

    // Apply to process.env
    Object.entries(parsed).forEach(([key, value]) => {
      if (override || !process.env[key]) {
        process.env[key] = value;
      }
    });

    return parsed;
  } catch (error: any) {
    throw new Error(`Failed to load .env file from ${envPath}: ${error.message}`);
  }
}

/**
 * Parses .env file content
 *
 * @param content - .env file content
 * @returns Parsed key-value pairs
 */
export function parseEnvContent(content: string): Record<string, string> {
  const result: Record<string, string> = {};
  const lines = content.split('\n');

  for (let line of lines) {
    // Remove comments and trim
    line = line.split('#')[0].trim();

    if (!line) continue;

    // Parse key=value
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (!match) continue;

    const key = match[1];
    let value = match[2] || '';

    // Remove surrounding quotes
    value = value.trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    // Handle escape sequences
    value = value
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '\r')
      .replace(/\\t/g, '\t')
      .replace(/\\\\/g, '\\');

    result[key] = value;
  }

  return result;
}

/**
 * Detects current environment
 *
 * @param defaultEnv - Default environment if not set
 * @returns Current environment
 */
export function detectEnvironment(defaultEnv: Environment = 'development'): Environment {
  return (
    process.env.NODE_ENV ||
    process.env.ENV ||
    process.env.ENVIRONMENT ||
    defaultEnv
  ) as Environment;
}

/**
 * Gets environment configuration
 *
 * @returns Environment configuration object
 *
 * @example
 * ```typescript
 * const env = getEnvironmentConfig();
 * if (env.isProduction) {
 *   // Production-specific logic
 * }
 * ```
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  const env = detectEnvironment();

  return {
    env,
    isDevelopment: env === 'development',
    isProduction: env === 'production',
    isTest: env === 'test',
    isStaging: env === 'staging',
    variables: { ...process.env } as Record<string, string>,
  };
}

/**
 * Loads environment-specific configuration file
 *
 * @param baseDir - Base directory for config files
 * @param env - Environment (defaults to current)
 * @returns Loaded configuration or null
 *
 * @example
 * ```typescript
 * const config = loadEnvConfig('./config');
 * // Loads ./config/.env.production (if in production)
 * ```
 */
export function loadEnvConfig(
  baseDir: string = '.',
  env?: Environment
): Record<string, string> {
  const environment = env || detectEnvironment();
  const envFiles = [
    path.join(baseDir, '.env'),
    path.join(baseDir, `.env.${environment}`),
    path.join(baseDir, '.env.local'),
  ];

  let merged: Record<string, string> = {};

  for (const envFile of envFiles) {
    const parsed = loadEnvFile({ path: envFile, required: false });
    merged = { ...merged, ...parsed };
  }

  return merged;
}

/**
 * Validates required environment variables
 *
 * @param requiredVars - Array of required variable names
 * @throws Error if any required variable is missing
 *
 * @example
 * ```typescript
 * validateRequiredEnvVars(['DATABASE_URL', 'API_KEY', 'SECRET_KEY']);
 * ```
 */
export function validateRequiredEnvVars(requiredVars: string[]): void {
  const missing = requiredVars.filter((varName) => !process.env[varName]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
}

/**
 * Gets environment variable with type conversion
 *
 * @param key - Environment variable key
 * @param defaultValue - Default value
 * @param type - Expected type
 * @returns Typed environment variable value
 */
export function getEnvVar<T = string>(
  key: string,
  defaultValue?: T,
  type: 'string' | 'number' | 'boolean' = 'string'
): T {
  const value = process.env[key];

  if (value === undefined) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Environment variable ${key} is not set`);
  }

  switch (type) {
    case 'number': {
      const num = Number(value);
      if (isNaN(num)) {
        throw new Error(`Environment variable ${key} is not a valid number: ${value}`);
      }
      return num as T;
    }
    case 'boolean': {
      const normalized = value.toLowerCase();
      if (['true', '1', 'yes', 'on'].includes(normalized)) {
        return true as T;
      }
      if (['false', '0', 'no', 'off'].includes(normalized)) {
        return false as T;
      }
      throw new Error(`Environment variable ${key} is not a valid boolean: ${value}`);
    }
    default:
      return value as T;
  }
}

/**
 * Creates environment-aware configuration
 *
 * @param configs - Environment-specific configurations
 * @returns Configuration for current environment
 *
 * @example
 * ```typescript
 * const config = createEnvConfig({
 *   development: { apiUrl: 'http://localhost:3000', debug: true },
 *   production: { apiUrl: 'https://api.example.com', debug: false },
 *   default: { timeout: 5000 }
 * });
 * ```
 */
export function createEnvConfig<T>(configs: {
  [env: string]: Partial<T>;
  default?: Partial<T>;
}): T {
  const environment = detectEnvironment();
  const defaultConfig = configs.default || {};
  const envConfig = configs[environment] || {};

  return { ...defaultConfig, ...envConfig } as T;
}

/**
 * Environment variable group
 */
export interface EnvVarGroup {
  /** Group name */
  name: string;
  /** Variable prefix */
  prefix: string;
  /** Variables in the group */
  variables: string[];
}

/**
 * Groups environment variables by prefix
 *
 * @param prefix - Variable prefix (e.g., 'DATABASE_')
 * @param stripPrefix - Strip prefix from keys
 * @returns Grouped variables
 *
 * @example
 * ```typescript
 * // Environment: DATABASE_HOST=localhost, DATABASE_PORT=5432
 * const dbVars = groupEnvVarsByPrefix('DATABASE_', true);
 * // { host: 'localhost', port: '5432' }
 * ```
 */
export function groupEnvVarsByPrefix(
  prefix: string,
  stripPrefix: boolean = true
): Record<string, string> {
  const result: Record<string, string> = {};

  Object.keys(process.env).forEach((key) => {
    if (key.startsWith(prefix)) {
      const value = process.env[key];
      if (value !== undefined) {
        const resultKey = stripPrefix ? key.slice(prefix.length) : key;
        result[resultKey] = value;
      }
    }
  });

  return result;
}

/**
 * Expands environment variables in a string
 *
 * @param str - String with variable references (e.g., '${VAR}')
 * @returns String with expanded variables
 *
 * @example
 * ```typescript
 * // Environment: API_HOST=api.example.com, API_PORT=8080
 * expandEnvVars('https://${API_HOST}:${API_PORT}/v1');
 * // 'https://api.example.com:8080/v1'
 * ```
 */
export function expandEnvVars(str: string): string {
  return str.replace(/\$\{([^}]+)\}/g, (match, varName) => {
    const value = process.env[varName];
    if (value === undefined) {
      console.warn(`Environment variable ${varName} not found in: ${str}`);
      return match;
    }
    return value;
  });
}

/**
 * Generates .env file content from object
 *
 * @param vars - Environment variables
 * @param options - Generation options
 * @returns .env file content
 */
export function generateEnvFileContent(
  vars: Record<string, any>,
  options: {
    sorted?: boolean;
    comments?: Record<string, string>;
  } = {}
): string {
  const { sorted = true, comments = {} } = options;

  let entries = Object.entries(vars);

  if (sorted) {
    entries = entries.sort(([a], [b]) => a.localeCompare(b));
  }

  const lines = entries.map(([key, value]) => {
    const comment = comments[key] ? `# ${comments[key]}\n` : '';
    const formattedValue =
      typeof value === 'string' && value.includes(' ')
        ? `"${value}"`
        : String(value);
    return `${comment}${key}=${formattedValue}`;
  });

  return lines.join('\n') + '\n';
}

/**
 * Saves environment variables to .env file
 *
 * @param vars - Environment variables to save
 * @param filePath - Path to .env file
 * @param options - Save options
 */
export function saveEnvFile(
  vars: Record<string, any>,
  filePath: string = '.env',
  options: {
    sorted?: boolean;
    comments?: Record<string, string>;
  } = {}
): void {
  const content = generateEnvFileContent(vars, options);
  fs.writeFileSync(filePath, content, 'utf-8');
}

/**
 * Checks if running in specific environment
 *
 * @param env - Environment to check
 * @returns True if current environment matches
 */
export function isEnvironment(env: Environment): boolean {
  return detectEnvironment() === env;
}

/**
 * Environment Kit - Main export
 */
export default {
  loadEnvFile,
  parseEnvContent,
  detectEnvironment,
  getEnvironmentConfig,
  loadEnvConfig,
  validateRequiredEnvVars,
  getEnvVar,
  createEnvConfig,
  groupEnvVarsByPrefix,
  expandEnvVars,
  generateEnvFileContent,
  saveEnvFile,
  isEnvironment,
};
