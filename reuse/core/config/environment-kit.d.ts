/**
 * @fileoverview Environment Configuration Kit
 * @module core/config/environment-kit
 *
 * Environment-specific configuration utilities including .env file loading,
 * environment detection, and multi-environment management.
 */
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
export declare function loadEnvFile(options?: EnvFileOptions): Record<string, string>;
/**
 * Parses .env file content
 *
 * @param content - .env file content
 * @returns Parsed key-value pairs
 */
export declare function parseEnvContent(content: string): Record<string, string>;
/**
 * Detects current environment
 *
 * @param defaultEnv - Default environment if not set
 * @returns Current environment
 */
export declare function detectEnvironment(defaultEnv?: Environment): Environment;
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
export declare function getEnvironmentConfig(): EnvironmentConfig;
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
export declare function loadEnvConfig(baseDir?: string, env?: Environment): Record<string, string>;
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
export declare function validateRequiredEnvVars(requiredVars: string[]): void;
/**
 * Gets environment variable with type conversion
 *
 * @param key - Environment variable key
 * @param defaultValue - Default value
 * @param type - Expected type
 * @returns Typed environment variable value
 */
export declare function getEnvVar<T = string>(key: string, defaultValue?: T, type?: 'string' | 'number' | 'boolean'): T;
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
export declare function createEnvConfig<T>(configs: {
    [env: string]: Partial<T>;
    default?: Partial<T>;
}): T;
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
export declare function groupEnvVarsByPrefix(prefix: string, stripPrefix?: boolean): Record<string, string>;
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
export declare function expandEnvVars(str: string): string;
/**
 * Generates .env file content from object
 *
 * @param vars - Environment variables
 * @param options - Generation options
 * @returns .env file content
 */
export declare function generateEnvFileContent(vars: Record<string, any>, options?: {
    sorted?: boolean;
    comments?: Record<string, string>;
}): string;
/**
 * Saves environment variables to .env file
 *
 * @param vars - Environment variables to save
 * @param filePath - Path to .env file
 * @param options - Save options
 */
export declare function saveEnvFile(vars: Record<string, any>, filePath?: string, options?: {
    sorted?: boolean;
    comments?: Record<string, string>;
}): void;
/**
 * Checks if running in specific environment
 *
 * @param env - Environment to check
 * @returns True if current environment matches
 */
export declare function isEnvironment(env: Environment): boolean;
/**
 * Environment Kit - Main export
 */
declare const _default: {
    loadEnvFile: typeof loadEnvFile;
    parseEnvContent: typeof parseEnvContent;
    detectEnvironment: typeof detectEnvironment;
    getEnvironmentConfig: typeof getEnvironmentConfig;
    loadEnvConfig: typeof loadEnvConfig;
    validateRequiredEnvVars: typeof validateRequiredEnvVars;
    getEnvVar: typeof getEnvVar;
    createEnvConfig: typeof createEnvConfig;
    groupEnvVarsByPrefix: typeof groupEnvVarsByPrefix;
    expandEnvVars: typeof expandEnvVars;
    generateEnvFileContent: typeof generateEnvFileContent;
    saveEnvFile: typeof saveEnvFile;
    isEnvironment: typeof isEnvironment;
};
export default _default;
//# sourceMappingURL=environment-kit.d.ts.map