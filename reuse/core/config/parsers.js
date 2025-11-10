"use strict";
/**
 * @fileoverview Configuration Parsers
 * @module core/config/parsers
 *
 * Environment variable parsing utilities for various data types including
 * arrays, booleans, numbers, URLs, durations, and JSON objects.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseEnvString = parseEnvString;
exports.parseEnvNumber = parseEnvNumber;
exports.parseEnvInt = parseEnvInt;
exports.parseEnvFloat = parseEnvFloat;
exports.parseEnvBoolean = parseEnvBoolean;
exports.parseEnvArray = parseEnvArray;
exports.parseEnvJSON = parseEnvJSON;
exports.parseEnvURL = parseEnvURL;
exports.parseEnvDuration = parseEnvDuration;
exports.parseEnvBytes = parseEnvBytes;
exports.parseEnvEnum = parseEnvEnum;
exports.parseEnvDate = parseEnvDate;
exports.parseEnvRegExp = parseEnvRegExp;
exports.requireEnv = requireEnv;
exports.parseEnvConfig = parseEnvConfig;
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
function parseEnvString(key, defaultValue) {
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
function parseEnvNumber(key, defaultValue) {
    const value = process.env[key];
    if (!value)
        return defaultValue;
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
function parseEnvInt(key, defaultValue) {
    const value = process.env[key];
    if (!value)
        return defaultValue;
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
function parseEnvFloat(key, defaultValue) {
    const value = process.env[key];
    if (!value)
        return defaultValue;
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
function parseEnvBoolean(key, defaultValue) {
    const value = process.env[key];
    if (!value)
        return defaultValue;
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
function parseEnvArray(key, separator = ',', defaultValue) {
    const value = process.env[key];
    if (!value)
        return defaultValue;
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
function parseEnvJSON(key, defaultValue) {
    const value = process.env[key];
    if (!value)
        return defaultValue;
    try {
        return JSON.parse(value);
    }
    catch (error) {
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
function parseEnvURL(key, defaultValue) {
    const value = process.env[key] || defaultValue;
    if (!value)
        return undefined;
    try {
        return new URL(value);
    }
    catch (error) {
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
function parseEnvDuration(key, defaultValue) {
    const value = process.env[key];
    if (!value)
        return defaultValue;
    const match = value.match(/^(\d+(?:\.\d+)?)(ms|s|m|h|d)$/);
    if (!match) {
        console.warn(`Invalid duration format for ${key}: ${value}, using default: ${defaultValue}`);
        return defaultValue;
    }
    const [, amount, unit] = match;
    const num = parseFloat(amount);
    const multipliers = {
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
function parseEnvBytes(key, defaultValue) {
    const value = process.env[key];
    if (!value)
        return defaultValue;
    const match = value.match(/^(\d+(?:\.\d+)?)(B|KB|MB|GB|TB)$/i);
    if (!match) {
        console.warn(`Invalid bytes format for ${key}: ${value}, using default: ${defaultValue}`);
        return defaultValue;
    }
    const [, amount, unit] = match;
    const num = parseFloat(amount);
    const multipliers = {
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
function parseEnvEnum(key, allowedValues, defaultValue) {
    const value = process.env[key];
    if (!value)
        return defaultValue;
    if (!allowedValues.includes(value)) {
        console.warn(`Invalid enum value for ${key}: ${value}. Allowed: ${allowedValues.join(', ')}. Using default: ${defaultValue}`);
        return defaultValue;
    }
    return value;
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
function parseEnvDate(key, defaultValue) {
    const value = process.env[key];
    if (!value)
        return defaultValue;
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
function parseEnvRegExp(key, defaultValue) {
    const value = process.env[key];
    if (!value)
        return defaultValue;
    try {
        return new RegExp(value);
    }
    catch (error) {
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
function requireEnv(key) {
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
function parseEnvConfig(config) {
    const result = {};
    for (const [key, parser] of Object.entries(config)) {
        result[key] = parser(process.env);
    }
    return result;
}
//# sourceMappingURL=parsers.js.map