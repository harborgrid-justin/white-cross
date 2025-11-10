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
export declare function parseEnvString(key: string, defaultValue?: string): string | undefined;
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
export declare function parseEnvNumber(key: string, defaultValue?: number): number | undefined;
/**
 * Parses environment variable as integer
 *
 * @param key - Environment variable key
 * @param defaultValue - Default value if not set or invalid
 * @returns Parsed integer value
 */
export declare function parseEnvInt(key: string, defaultValue?: number): number | undefined;
/**
 * Parses environment variable as float
 *
 * @param key - Environment variable key
 * @param defaultValue - Default value if not set or invalid
 * @returns Parsed float value
 */
export declare function parseEnvFloat(key: string, defaultValue?: number): number | undefined;
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
export declare function parseEnvBoolean(key: string, defaultValue?: boolean): boolean | undefined;
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
export declare function parseEnvArray(key: string, separator?: string, defaultValue?: string[]): string[] | undefined;
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
export declare function parseEnvJSON<T = any>(key: string, defaultValue?: T): T | undefined;
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
export declare function parseEnvURL(key: string, defaultValue?: string): URL | undefined;
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
export declare function parseEnvDuration(key: string, defaultValue?: number): number | undefined;
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
export declare function parseEnvBytes(key: string, defaultValue?: number): number | undefined;
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
export declare function parseEnvEnum<T extends string>(key: string, allowedValues: readonly T[], defaultValue?: T): T | undefined;
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
export declare function parseEnvDate(key: string, defaultValue?: Date): Date | undefined;
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
export declare function parseEnvRegExp(key: string, defaultValue?: RegExp): RegExp | undefined;
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
export declare function requireEnv(key: string): string;
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
export declare function parseEnvConfig<T extends Record<string, any>>(config: {
    [K in keyof T]: (env: NodeJS.ProcessEnv) => T[K];
}): T;
//# sourceMappingURL=parsers.d.ts.map