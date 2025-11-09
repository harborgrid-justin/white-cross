/**
 * @fileoverview Configuration Parsers
 * @module core/config/parsers
 *
 * Environment variable parsing utilities for various data types including
 * arrays, booleans, numbers, URLs, durations, and JSON objects.
 */

/**
 * Parses environment variable as string with optional default
 *
 * @param key - Environment variable key
 * @param defaultValue - Default value if not set
 * @returns Parsed string value
 *
 * @example
 * ```typescript
 * const apiUrl = parseEnvString('API_URL', 'http://localhost:3000');
 * ```
 */
export function parseEnvString(key: string, defaultValue?: string): string | undefined {
  return process.env[key] || defaultValue;
}

/**
 * Parses environment variable as number
 *
 * @param key - Environment variable key
 * @param defaultValue - Default value if not set or invalid
 * @returns Parsed number value
 *
 * @example
 * ```typescript
 * const port = parseEnvNumber('PORT', 3000);
 * ```
 */
export function parseEnvNumber(key: string, defaultValue?: number): number | undefined {
  const value = process.env[key];
  if (!value) return defaultValue;

  const parsed = Number(value);
  if (isNaN(parsed)) {
    console.warn(`Invalid number for ${key}: ${value}, using default: ${defaultValue}`);
    return defaultValue;
  }

  return parsed;
}

/**
 * Parses environment variable as integer
 *
 * @param key - Environment variable key
 * @param defaultValue - Default value if not set or invalid
 * @returns Parsed integer value
 */
export function parseEnvInt(key: string, defaultValue?: number): number | undefined {
  const value = process.env[key];
  if (!value) return defaultValue;

  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    console.warn(`Invalid integer for ${key}: ${value}, using default: ${defaultValue}`);
    return defaultValue;
  }

  return parsed;
}

/**
 * Parses environment variable as float
 *
 * @param key - Environment variable key
 * @param defaultValue - Default value if not set or invalid
 * @returns Parsed float value
 */
export function parseEnvFloat(key: string, defaultValue?: number): number | undefined {
  const value = process.env[key];
  if (!value) return defaultValue;

  const parsed = parseFloat(value);
  if (isNaN(parsed)) {
    console.warn(`Invalid float for ${key}: ${value}, using default: ${defaultValue}`);
    return defaultValue;
  }

  return parsed;
}

/**
 * Parses environment variable as boolean
 *
 * @param key - Environment variable key
 * @param defaultValue - Default value if not set
 * @returns Parsed boolean value
 *
 * @example
 * ```typescript
 * const debug = parseEnvBoolean('DEBUG', false);
 * // Recognizes: true, false, 1, 0, yes, no, on, off
 * ```
 */
export function parseEnvBoolean(key: string, defaultValue?: boolean): boolean | undefined {
  const value = process.env[key];
  if (!value) return defaultValue;

  const normalized = value.toLowerCase().trim();

  if (['true', '1', 'yes', 'on'].includes(normalized)) {
    return true;
  }

  if (['false', '0', 'no', 'off'].includes(normalized)) {
    return false;
  }

  console.warn(`Invalid boolean for ${key}: ${value}, using default: ${defaultValue}`);
  return defaultValue;
}

/**
 * Parses environment variable as array
 *
 * @param key - Environment variable key
 * @param separator - Separator character (default: ',')
 * @param defaultValue - Default value if not set
 * @returns Parsed array of strings
 *
 * @example
 * ```typescript
 * // DATABASE_HOSTS=host1,host2,host3
 * const hosts = parseEnvArray('DATABASE_HOSTS', ',');
 * // ['host1', 'host2', 'host3']
 * ```
 */
export function parseEnvArray(
  key: string,
  separator: string = ',',
  defaultValue?: string[]
): string[] | undefined {
  const value = process.env[key];
  if (!value) return defaultValue;

  return value
    .split(separator)
    .map((item) => item.trim())
    .filter(Boolean);
}

/**
 * Parses environment variable as JSON
 *
 * @param key - Environment variable key
 * @param defaultValue - Default value if not set or invalid
 * @returns Parsed JSON object
 *
 * @example
 * ```typescript
 * // CONFIG_JSON={"timeout":5000,"retry":3}
 * const config = parseEnvJSON('CONFIG_JSON', {});
 * ```
 */
export function parseEnvJSON<T = any>(key: string, defaultValue?: T): T | undefined {
  const value = process.env[key];
  if (!value) return defaultValue;

  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.error(`Invalid JSON for ${key}: ${value}`, error);
    return defaultValue;
  }
}

/**
 * Parses environment variable as URL
 *
 * @param key - Environment variable key
 * @param defaultValue - Default value if not set or invalid
 * @returns Parsed URL object
 *
 * @example
 * ```typescript
 * const apiUrl = parseEnvURL('API_URL');
 * console.log(apiUrl.hostname, apiUrl.port);
 * ```
 */
export function parseEnvURL(key: string, defaultValue?: string): URL | undefined {
  const value = process.env[key] || defaultValue;
  if (!value) return undefined;

  try {
    return new URL(value);
  } catch (error) {
    console.error(`Invalid URL for ${key}: ${value}`, error);
    return undefined;
  }
}

/**
 * Parses environment variable as duration in milliseconds
 *
 * @param key - Environment variable key
 * @param defaultValue - Default value if not set
 * @returns Duration in milliseconds
 *
 * @example
 * ```typescript
 * // SESSION_TIMEOUT=30s
 * const timeout = parseEnvDuration('SESSION_TIMEOUT');
 * // 30000 (milliseconds)
 *
 * // Supported units: ms, s, m, h, d
 * // Examples: 100ms, 30s, 5m, 2h, 1d
 * ```
 */
export function parseEnvDuration(key: string, defaultValue?: number): number | undefined {
  const value = process.env[key];
  if (!value) return defaultValue;

  const match = value.match(/^(\d+(?:\.\d+)?)(ms|s|m|h|d)$/);
  if (!match) {
    console.warn(`Invalid duration format for ${key}: ${value}, using default: ${defaultValue}`);
    return defaultValue;
  }

  const [, amount, unit] = match;
  const num = parseFloat(amount);

  const multipliers: Record<string, number> = {
    ms: 1,
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return num * multipliers[unit];
}

/**
 * Parses environment variable as bytes
 *
 * @param key - Environment variable key
 * @param defaultValue - Default value if not set
 * @returns Size in bytes
 *
 * @example
 * ```typescript
 * // MAX_FILE_SIZE=5MB
 * const maxSize = parseEnvBytes('MAX_FILE_SIZE');
 * // 5242880 (bytes)
 *
 * // Supported units: B, KB, MB, GB, TB
 * ```
 */
export function parseEnvBytes(key: string, defaultValue?: number): number | undefined {
  const value = process.env[key];
  if (!value) return defaultValue;

  const match = value.match(/^(\d+(?:\.\d+)?)(B|KB|MB|GB|TB)$/i);
  if (!match) {
    console.warn(`Invalid bytes format for ${key}: ${value}, using default: ${defaultValue}`);
    return defaultValue;
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

  return num * multipliers[unit.toUpperCase()];
}

/**
 * Parses environment variable as enum value
 *
 * @param key - Environment variable key
 * @param allowedValues - Array of allowed values
 * @param defaultValue - Default value if not set or invalid
 * @returns Parsed enum value
 *
 * @example
 * ```typescript
 * const logLevel = parseEnvEnum('LOG_LEVEL', ['debug', 'info', 'warn', 'error'], 'info');
 * ```
 */
export function parseEnvEnum<T extends string>(
  key: string,
  allowedValues: readonly T[],
  defaultValue?: T
): T | undefined {
  const value = process.env[key];
  if (!value) return defaultValue;

  if (!allowedValues.includes(value as T)) {
    console.warn(
      `Invalid enum value for ${key}: ${value}. Allowed: ${allowedValues.join(', ')}. Using default: ${defaultValue}`
    );
    return defaultValue;
  }

  return value as T;
}

/**
 * Parses environment variable as date
 *
 * @param key - Environment variable key
 * @param defaultValue - Default value if not set or invalid
 * @returns Parsed Date object
 *
 * @example
 * ```typescript
 * // FEATURE_RELEASE_DATE=2024-12-31T23:59:59Z
 * const releaseDate = parseEnvDate('FEATURE_RELEASE_DATE');
 * ```
 */
export function parseEnvDate(key: string, defaultValue?: Date): Date | undefined {
  const value = process.env[key];
  if (!value) return defaultValue;

  const parsed = new Date(value);
  if (isNaN(parsed.getTime())) {
    console.warn(`Invalid date for ${key}: ${value}, using default: ${defaultValue}`);
    return defaultValue;
  }

  return parsed;
}

/**
 * Parses environment variable as regular expression
 *
 * @param key - Environment variable key
 * @param defaultValue - Default value if not set or invalid
 * @returns Parsed RegExp object
 *
 * @example
 * ```typescript
 * // EMAIL_PATTERN=^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$
 * const emailPattern = parseEnvRegExp('EMAIL_PATTERN');
 * ```
 */
export function parseEnvRegExp(key: string, defaultValue?: RegExp): RegExp | undefined {
  const value = process.env[key];
  if (!value) return defaultValue;

  try {
    return new RegExp(value);
  } catch (error) {
    console.error(`Invalid RegExp for ${key}: ${value}`, error);
    return defaultValue;
  }
}

/**
 * Requires environment variable to be set
 *
 * @param key - Environment variable key
 * @returns Value of the environment variable
 * @throws Error if environment variable is not set
 *
 * @example
 * ```typescript
 * const apiKey = requireEnv('API_KEY');
 * // Throws if API_KEY is not set
 * ```
 */
export function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Required environment variable ${key} is not set`);
  }
  return value;
}

/**
 * Parses multiple environment variables at once
 *
 * @param config - Configuration object with parsers
 * @returns Parsed configuration object
 *
 * @example
 * ```typescript
 * const config = parseEnvConfig({
 *   port: (env) => parseEnvNumber('PORT', 3000),
 *   debug: (env) => parseEnvBoolean('DEBUG', false),
 *   hosts: (env) => parseEnvArray('DATABASE_HOSTS', ',', [])
 * });
 * ```
 */
export function parseEnvConfig<T extends Record<string, any>>(
  config: {
    [K in keyof T]: (env: NodeJS.ProcessEnv) => T[K];
  }
): T {
  const result = {} as T;

  for (const [key, parser] of Object.entries(config)) {
    result[key as keyof T] = parser(process.env);
  }

  return result;
}
