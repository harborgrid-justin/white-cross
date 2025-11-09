"use strict";
/**
 * @fileoverview Environment Configuration Kit
 * @module core/config/environment-kit
 *
 * Environment-specific configuration utilities including .env file loading,
 * environment detection, and multi-environment management.
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadEnvFile = loadEnvFile;
exports.parseEnvContent = parseEnvContent;
exports.detectEnvironment = detectEnvironment;
exports.getEnvironmentConfig = getEnvironmentConfig;
exports.loadEnvConfig = loadEnvConfig;
exports.validateRequiredEnvVars = validateRequiredEnvVars;
exports.getEnvVar = getEnvVar;
exports.createEnvConfig = createEnvConfig;
exports.groupEnvVarsByPrefix = groupEnvVarsByPrefix;
exports.expandEnvVars = expandEnvVars;
exports.generateEnvFileContent = generateEnvFileContent;
exports.saveEnvFile = saveEnvFile;
exports.isEnvironment = isEnvironment;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
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
function loadEnvFile(options = {}) {
    const { path: envPath = '.env', encoding = 'utf8', override = false, required = false, } = options;
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
    }
    catch (error) {
        throw new Error(`Failed to load .env file from ${envPath}: ${error.message}`);
    }
}
/**
 * Parses .env file content
 *
 * @param content - .env file content
 * @returns Parsed key-value pairs
 */
function parseEnvContent(content) {
    const result = {};
    const lines = content.split('\n');
    for (let line of lines) {
        // Remove comments and trim
        line = line.split('#')[0].trim();
        if (!line)
            continue;
        // Parse key=value
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (!match)
            continue;
        const key = match[1];
        let value = match[2] || '';
        // Remove surrounding quotes
        value = value.trim();
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
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
function detectEnvironment(defaultEnv = 'development') {
    return (process.env.NODE_ENV ||
        process.env.ENV ||
        process.env.ENVIRONMENT ||
        defaultEnv);
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
function getEnvironmentConfig() {
    const env = detectEnvironment();
    return {
        env,
        isDevelopment: env === 'development',
        isProduction: env === 'production',
        isTest: env === 'test',
        isStaging: env === 'staging',
        variables: { ...process.env },
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
function loadEnvConfig(baseDir = '.', env) {
    const environment = env || detectEnvironment();
    const envFiles = [
        path.join(baseDir, '.env'),
        path.join(baseDir, `.env.${environment}`),
        path.join(baseDir, '.env.local'),
    ];
    let merged = {};
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
function validateRequiredEnvVars(requiredVars) {
    const missing = requiredVars.filter((varName) => !process.env[varName]);
    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
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
function getEnvVar(key, defaultValue, type = 'string') {
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
            return num;
        }
        case 'boolean': {
            const normalized = value.toLowerCase();
            if (['true', '1', 'yes', 'on'].includes(normalized)) {
                return true;
            }
            if (['false', '0', 'no', 'off'].includes(normalized)) {
                return false;
            }
            throw new Error(`Environment variable ${key} is not a valid boolean: ${value}`);
        }
        default:
            return value;
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
function createEnvConfig(configs) {
    const environment = detectEnvironment();
    const defaultConfig = configs.default || {};
    const envConfig = configs[environment] || {};
    return { ...defaultConfig, ...envConfig };
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
function groupEnvVarsByPrefix(prefix, stripPrefix = true) {
    const result = {};
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
function expandEnvVars(str) {
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
function generateEnvFileContent(vars, options = {}) {
    const { sorted = true, comments = {} } = options;
    let entries = Object.entries(vars);
    if (sorted) {
        entries = entries.sort(([a], [b]) => a.localeCompare(b));
    }
    const lines = entries.map(([key, value]) => {
        const comment = comments[key] ? `# ${comments[key]}\n` : '';
        const formattedValue = typeof value === 'string' && value.includes(' ')
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
function saveEnvFile(vars, filePath = '.env', options = {}) {
    const content = generateEnvFileContent(vars, options);
    fs.writeFileSync(filePath, content, 'utf-8');
}
/**
 * Checks if running in specific environment
 *
 * @param env - Environment to check
 * @returns True if current environment matches
 */
function isEnvironment(env) {
    return detectEnvironment() === env;
}
/**
 * Environment Kit - Main export
 */
exports.default = {
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
//# sourceMappingURL=environment-kit.js.map