/**
 * LOC: ENV9J0K1F4
 * File: /reuse/environment-kit.ts
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
 * Environment type enumeration
 */
export declare enum EnvironmentType {
    Development = "development",
    Staging = "staging",
    Production = "production",
    Test = "test",
    Local = "local"
}
/**
 * Environment detection result
 */
export interface EnvironmentInfo {
    type: EnvironmentType;
    name: string;
    isProduction: boolean;
    isDevelopment: boolean;
    isStaging: boolean;
    isTest: boolean;
    isLocal: boolean;
    nodeEnv: string;
    metadata?: Record<string, any>;
}
/**
 * Environment variable definition
 */
export interface EnvVarDefinition {
    key: string;
    type: 'string' | 'number' | 'boolean' | 'json' | 'array';
    required: boolean;
    default?: any;
    description?: string;
    pattern?: RegExp;
    validator?: (value: any) => boolean;
    sensitive?: boolean;
}
/**
 * Environment file configuration
 */
export interface EnvFileConfig {
    path: string;
    encoding?: BufferEncoding;
    override?: boolean;
    expand?: boolean;
    validate?: boolean;
}
/**
 * Feature flag definition
 */
export interface FeatureFlag {
    name: string;
    enabled: boolean;
    environments?: EnvironmentType[];
    percentage?: number;
    users?: string[];
    metadata?: Record<string, any>;
    startDate?: Date;
    endDate?: Date;
}
/**
 * Environment comparison result
 */
export interface EnvComparisonResult {
    environment1: string;
    environment2: string;
    identical: boolean;
    onlyInEnv1: string[];
    onlyInEnv2: string[];
    different: Array<{
        key: string;
        value1: string;
        value2: string;
    }>;
}
/**
 * Environment migration plan
 */
export interface MigrationPlan {
    from: string;
    to: string;
    changes: Array<{
        key: string;
        action: 'add' | 'remove' | 'update';
        oldValue?: string;
        newValue?: string;
    }>;
    warnings?: string[];
}
/**
 * Environment validation result
 */
export interface EnvValidationResult {
    valid: boolean;
    errors: Array<{
        key: string;
        message: string;
    }>;
    warnings: Array<{
        key: string;
        message: string;
    }>;
}
/**
 * Environment override configuration
 */
export interface EnvOverrideConfig {
    source: 'file' | 'cli' | 'env' | 'code';
    priority: number;
    values: Record<string, string>;
}
/**
 * 1. Detects current environment with comprehensive information.
 *
 * @returns {EnvironmentInfo} Detailed environment information
 *
 * @example
 * ```typescript
 * const env = detectEnvironment();
 * if (env.isProduction) {
 *   console.log('Running in production mode');
 * }
 * ```
 */
export declare const detectEnvironment: () => EnvironmentInfo;
/**
 * 2. Normalizes environment string to EnvironmentType.
 *
 * @param {string} env - Environment string
 * @returns {EnvironmentType} Normalized environment type
 *
 * @example
 * ```typescript
 * const type = normalizeEnvironmentType('prod'); // EnvironmentType.Production
 * ```
 */
export declare const normalizeEnvironmentType: (env: string) => EnvironmentType;
/**
 * 3. Checks if current environment matches any of the specified types.
 *
 * @param {EnvironmentType[]} types - Environment types to check
 * @returns {boolean} True if current environment matches
 *
 * @example
 * ```typescript
 * if (isEnvironment([EnvironmentType.Development, EnvironmentType.Test])) {
 *   console.log('Debug mode enabled');
 * }
 * ```
 */
export declare const isEnvironment: (types: EnvironmentType[]) => boolean;
/**
 * 4. Gets environment-specific value from mapping.
 *
 * @template T
 * @param {Partial<Record<EnvironmentType, T>>} valueMap - Environment value map
 * @param {T} [defaultValue] - Default value
 * @returns {T} Environment-specific value
 *
 * @example
 * ```typescript
 * const logLevel = getEnvironmentValue({
 *   [EnvironmentType.Production]: 'error',
 *   [EnvironmentType.Development]: 'debug',
 * }, 'info');
 * ```
 */
export declare const getEnvironmentValue: <T>(valueMap: Partial<Record<EnvironmentType, T>>, defaultValue?: T) => T;
/**
 * 5. Creates environment guard function.
 *
 * @param {EnvironmentType[]} allowedEnvs - Allowed environments
 * @returns {() => void} Guard function that throws if environment not allowed
 *
 * @example
 * ```typescript
 * const guardProduction = createEnvironmentGuard([EnvironmentType.Production]);
 * guardProduction(); // Throws if not in production
 * ```
 */
export declare const createEnvironmentGuard: (allowedEnvs: EnvironmentType[]) => (() => void);
/**
 * 6. Parses .env file content into key-value pairs.
 *
 * @param {string} content - .env file content
 * @param {object} [options] - Parse options
 * @returns {Record<string, string>} Parsed environment variables
 *
 * @example
 * ```typescript
 * const envVars = parseEnvFile(fs.readFileSync('.env', 'utf8'));
 * ```
 */
export declare const parseEnvFile: (content: string, options?: {
    override?: boolean;
    comments?: boolean;
    multiline?: boolean;
}) => Record<string, string>;
/**
 * 7. Loads .env file from disk.
 *
 * @param {string} filePath - Path to .env file
 * @param {Partial<EnvFileConfig>} [options] - Load options
 * @returns {Record<string, string>} Loaded environment variables
 *
 * @example
 * ```typescript
 * const envVars = loadEnvFile('.env.local', { override: true });
 * ```
 */
export declare const loadEnvFile: (filePath: string, options?: Partial<EnvFileConfig>) => Record<string, string>;
/**
 * 8. Expands variable references like ${VAR_NAME} in env values.
 *
 * @param {Record<string, string>} env - Environment variables
 * @returns {Record<string, string>} Expanded environment variables
 *
 * @example
 * ```typescript
 * const expanded = expandEnvVariables({
 *   DB_HOST: 'localhost',
 *   DB_URL: 'postgres://${DB_HOST}:5432/mydb'
 * });
 * // Result: { DB_HOST: 'localhost', DB_URL: 'postgres://localhost:5432/mydb' }
 * ```
 */
export declare const expandEnvVariables: (env: Record<string, string>) => Record<string, string>;
/**
 * 9. Writes environment variables to .env file.
 *
 * @param {string} filePath - Output file path
 * @param {Record<string, string>} env - Environment variables
 * @param {object} [options] - Write options
 *
 * @example
 * ```typescript
 * writeEnvFile('.env.local', {
 *   DATABASE_URL: 'postgres://localhost/mydb',
 *   PORT: '3000'
 * }, { comments: true });
 * ```
 */
export declare const writeEnvFile: (filePath: string, env: Record<string, string>, options?: {
    comments?: Record<string, string>;
    sort?: boolean;
}) => void;
/**
 * 10. Merges multiple .env files with priority.
 *
 * @param {string[]} filePaths - Array of .env file paths (lowest to highest priority)
 * @param {Partial<EnvFileConfig>} [options] - Load options
 * @returns {Record<string, string>} Merged environment variables
 *
 * @example
 * ```typescript
 * const env = mergeEnvFiles(['.env', '.env.local', '.env.development.local']);
 * ```
 */
export declare const mergeEnvFiles: (filePaths: string[], options?: Partial<EnvFileConfig>) => Record<string, string>;
/**
 * 11. Creates environment-specific configuration object.
 *
 * @param {EnvironmentType} env - Environment type
 * @param {Record<string, any>} baseConfig - Base configuration
 * @param {Partial<Record<EnvironmentType, Record<string, any>>>} overrides - Environment overrides
 * @returns {Record<string, any>} Environment-specific configuration
 *
 * @example
 * ```typescript
 * const config = buildEnvSpecificConfig(
 *   EnvironmentType.Production,
 *   { port: 3000 },
 *   { [EnvironmentType.Production]: { port: 80 } }
 * );
 * ```
 */
export declare const buildEnvSpecificConfig: (env: EnvironmentType, baseConfig: Record<string, any>, overrides: Partial<Record<EnvironmentType, Record<string, any>>>) => Record<string, any>;
/**
 * 12. Loads environment-specific .env files automatically.
 *
 * @param {string} [env] - Environment name (defaults to NODE_ENV)
 * @param {string} [basePath] - Base directory path
 * @returns {Record<string, string>} Loaded environment variables
 *
 * @example
 * ```typescript
 * const env = loadEnvironmentFiles('production', './config');
 * // Loads: .env, .env.production, .env.production.local
 * ```
 */
export declare const loadEnvironmentFiles: (env?: string, basePath?: string) => Record<string, string>;
/**
 * 43. Creates .env.example template file.
 *
 * @param {EnvVarDefinition[]} definitions - Variable definitions
 * @returns {string} .env.example content
 *
 * @example
 * ```typescript
 * const template = generateEnvTemplate(definitions);
 * fs.writeFileSync('.env.example', template);
 * ```
 */
export declare const generateEnvTemplate: (definitions: EnvVarDefinition[]) => string;
/**
 * 44. Audits environment for security issues.
 *
 * @param {Record<string, string>} env - Environment to audit
 * @returns {{ issues: string[]; warnings: string[] }} Audit result
 *
 * @example
 * ```typescript
 * const audit = auditEnvironmentSecurity(process.env);
 * ```
 */
export declare const auditEnvironmentSecurity: (env: Record<string, string>) => {
    issues: string[];
    warnings: string[];
};
/**
 * 45. Creates environment testing utility.
 *
 * @param {Record<string, string>} env - Environment to test
 * @param {Array<{ name: string; test: (env: any) => boolean }>} tests - Test suite
 * @returns {{ passed: number; failed: number; results: any[] }} Test results
 *
 * @example
 * ```typescript
 * const results = testEnvironment(process.env, [
 *   { name: 'Has database URL', test: (e) => !!e.DATABASE_URL },
 *   { name: 'Valid port', test: (e) => Number(e.PORT) >= 1024 }
 * ]);
 * ```
 */
export declare const testEnvironment: (env: Record<string, string>, tests: Array<{
    name: string;
    test: (env: any) => boolean;
}>) => {
    passed: number;
    failed: number;
    results: any[];
};
declare const _default: {
    detectEnvironment: () => EnvironmentInfo;
    normalizeEnvironmentType: (env: string) => EnvironmentType;
    isEnvironment: (types: EnvironmentType[]) => boolean;
    getEnvironmentValue: <T>(valueMap: Partial<Record<EnvironmentType, T>>, defaultValue?: T) => T;
    createEnvironmentGuard: (allowedEnvs: EnvironmentType[]) => (() => void);
    parseEnvFile: (content: string, options?: {
        override?: boolean;
        comments?: boolean;
        multiline?: boolean;
    }) => Record<string, string>;
    loadEnvFile: (filePath: string, options?: Partial<EnvFileConfig>) => Record<string, string>;
    expandEnvVariables: (env: Record<string, string>) => Record<string, string>;
    writeEnvFile: (filePath: string, env: Record<string, string>, options?: {
        comments?: Record<string, string>;
        sort?: boolean;
    }) => void;
    mergeEnvFiles: (filePaths: string[], options?: Partial<EnvFileConfig>) => Record<string, string>;
    buildEnvSpecificConfig: (env: EnvironmentType, baseConfig: Record<string, any>, overrides: Partial<Record<EnvironmentType, Record<string, any>>>) => Record<string, any>;
    loadEnvironmentFiles: (env?: string, basePath?: string) => Record<string, string>;
    createEnvCascade: any;
    buildMultiTierConfig: any;
    loadEnvironmentProfile: any;
    createFeatureFlag: any;
    evaluateFeatureFlag: any;
    createFeatureFlagManager: any;
    loadFeatureFlagsFromEnv: any;
    createEnvBasedFlags: any;
    validateEnvironmentVariables: any;
    validateEnvVarType: any;
    createEnvValidator: any;
    requireEnvironmentVariables: any;
    validateEnvConstraints: any;
    generateEnvFilePaths: any;
    createEnvironmentSwitcher: any;
    validateEnvConsistency: any;
    createEnvironmentGroup: any;
    loadEnvironmentModule: any;
    applyEnvironmentOverrides: any;
    parseCliEnvironmentOverrides: any;
    createEnvironmentProxy: any;
    freezeEnvironment: any;
    snapshotEnvironment: any;
    compareEnvironments: any;
    createMigrationPlan: any;
    executeMigration: any;
    generateMigrationScript: any;
    validateMigrationSafety: any;
    maskSensitiveEnv: any;
    generateEnvironmentDocs: any;
    generateEnvTemplate: (definitions: EnvVarDefinition[]) => string;
    auditEnvironmentSecurity: (env: Record<string, string>) => {
        issues: string[];
        warnings: string[];
    };
    testEnvironment: (env: Record<string, string>, tests: Array<{
        name: string;
        test: (env: any) => boolean;
    }>) => {
        passed: number;
        failed: number;
        results: any[];
    };
};
export default _default;
//# sourceMappingURL=environment-kit.d.ts.map