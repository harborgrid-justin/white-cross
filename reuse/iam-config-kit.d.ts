/**
 * @fileoverview IAM Configuration Management Utilities
 * @module reuse/iam-config-kit
 * @description Comprehensive IAM configuration utilities for NestJS applications covering
 * security settings, environment-specific configs, dynamic updates, validation, feature flags,
 * secrets management, encryption, and policy templates.
 *
 * Key Features:
 * - IAM-specific ConfigModule setup and initialization
 * - Security policy configuration management
 * - Environment-specific IAM configurations (dev, staging, prod)
 * - Dynamic IAM configuration updates
 * - Configuration validation with Joi and class-validator
 * - Feature flags for IAM capabilities
 * - Secrets management integration (AWS, Azure, Vault)
 * - Configuration encryption and decryption
 * - Default IAM policy templates
 * - Role-based access configuration
 * - JWT and session configuration
 * - OAuth/OIDC provider configuration
 * - MFA settings management
 * - Password policy configuration
 * - Audit logging configuration
 * - HIPAA-compliant IAM defaults
 *
 * @target NestJS v11.x, Node 18+, TypeScript 5.x
 *
 * @security
 * - Encrypted configuration storage
 * - Secret rotation support
 * - Audit logging for configuration access
 * - Role-based configuration access
 * - HIPAA-compliant security defaults
 * - Configuration validation and sanitization
 *
 * @example Basic usage
 * ```typescript
 * import { createIAMConfigModule, loadIAMSecuritySettings } from './iam-config-kit';
 *
 * // Create IAM config module
 * const iamConfig = createIAMConfigModule({
 *   envFilePath: '.env',
 *   validateOnStartup: true
 * });
 *
 * // Load security settings
 * const settings = loadIAMSecuritySettings();
 * ```
 *
 * @example Advanced usage
 * ```typescript
 * import {
 *   createJWTConfig,
 *   createOAuthConfig,
 *   createPasswordPolicy,
 *   loadSecretsFromVault,
 *   validateIAMConfig
 * } from './iam-config-kit';
 *
 * // JWT configuration
 * const jwtConfig = createJWTConfig({
 *   secret: process.env.JWT_SECRET,
 *   expiresIn: '15m'
 * });
 *
 * // Load secrets
 * await loadSecretsFromVault('iam/production');
 * ```
 *
 * LOC: IAM-CFG-2025
 * UPSTREAM: @nestjs/config, @nestjs/common, joi, class-validator, aws-sdk, azure-keyvault
 * DOWNSTREAM: IAM modules, auth services, guards, security middleware
 *
 * @version 1.0.0
 * @since 2025-11-08
 */
import { ConfigModuleOptions, ConfigFactory } from '@nestjs/config';
/**
 * @interface IAMConfigModuleOptions
 * @description Options for IAM configuration module initialization
 */
export interface IAMConfigModuleOptions {
    /** Path to environment file */
    envFilePath?: string | string[];
    /** Whether to validate configuration on startup */
    validateOnStartup?: boolean;
    /** Whether to cache configuration */
    cache?: boolean;
    /** Whether to load secrets from external providers */
    loadSecrets?: boolean;
    /** Secret provider configuration */
    secretProvider?: SecretProviderConfig;
    /** Whether configuration is global */
    isGlobal?: boolean;
    /** Custom validation schema */
    validationSchema?: any;
}
/**
 * @interface SecretProviderConfig
 * @description Configuration for external secret providers
 */
export interface SecretProviderConfig {
    /** Provider type */
    provider: 'aws' | 'azure' | 'vault' | 'consul';
    /** Region or location */
    region?: string;
    /** Secret path or name */
    secretPath: string;
    /** Cache duration in seconds */
    cacheDuration?: number;
    /** Custom endpoint URL */
    endpoint?: string;
}
/**
 * @interface JWTConfigOptions
 * @description JWT configuration options
 */
export interface JWTConfigOptions {
    /** JWT secret key */
    secret: string;
    /** Token expiration time */
    expiresIn?: string | number;
    /** Refresh token expiration */
    refreshExpiresIn?: string | number;
    /** Token issuer */
    issuer?: string;
    /** Token audience */
    audience?: string;
    /** Signing algorithm */
    algorithm?: 'HS256' | 'HS384' | 'HS512' | 'RS256' | 'RS384' | 'RS512';
    /** Public key for RS algorithms */
    publicKey?: string;
    /** Private key for RS algorithms */
    privateKey?: string;
}
/**
 * @interface OAuthConfigOptions
 * @description OAuth/OIDC provider configuration
 */
export interface OAuthConfigOptions {
    /** OAuth provider name */
    provider: string;
    /** Client ID */
    clientId: string;
    /** Client secret */
    clientSecret: string;
    /** Authorization endpoint */
    authorizationUrl: string;
    /** Token endpoint */
    tokenUrl: string;
    /** User info endpoint */
    userInfoUrl?: string;
    /** Redirect URI */
    redirectUri: string;
    /** OAuth scopes */
    scope?: string[];
    /** PKCE enabled */
    pkceEnabled?: boolean;
}
/**
 * @interface PasswordPolicyConfig
 * @description Password policy configuration
 */
export interface PasswordPolicyConfig {
    /** Minimum password length */
    minLength?: number;
    /** Maximum password length */
    maxLength?: number;
    /** Require uppercase letters */
    requireUppercase?: boolean;
    /** Require lowercase letters */
    requireLowercase?: boolean;
    /** Require numbers */
    requireNumbers?: boolean;
    /** Require special characters */
    requireSpecialChars?: boolean;
    /** Password expiration days */
    expirationDays?: number;
    /** Password history count */
    historyCount?: number;
    /** Maximum failed attempts */
    maxFailedAttempts?: number;
    /** Account lockout duration in minutes */
    lockoutDuration?: number;
}
/**
 * @interface MFAConfig
 * @description Multi-factor authentication configuration
 */
export interface MFAConfig {
    /** MFA enabled by default */
    enabled: boolean;
    /** MFA enforcement level */
    enforcement?: 'optional' | 'required' | 'role-based';
    /** Supported MFA methods */
    methods: Array<'totp' | 'sms' | 'email' | 'hardware' | 'biometric'>;
    /** TOTP issuer name */
    totpIssuer?: string;
    /** TOTP window tolerance */
    totpWindow?: number;
    /** SMS provider configuration */
    smsProvider?: any;
    /** Backup codes enabled */
    backupCodesEnabled?: boolean;
    /** Number of backup codes */
    backupCodesCount?: number;
}
/**
 * @interface SessionConfig
 * @description Session management configuration
 */
export interface SessionConfig {
    /** Session secret */
    secret: string;
    /** Session store type */
    store?: 'memory' | 'redis' | 'database';
    /** Session cookie name */
    cookieName?: string;
    /** Cookie max age in milliseconds */
    maxAge?: number;
    /** Cookie secure flag */
    secure?: boolean;
    /** Cookie httpOnly flag */
    httpOnly?: boolean;
    /** Cookie sameSite policy */
    sameSite?: 'strict' | 'lax' | 'none';
    /** Session timeout in minutes */
    timeout?: number;
    /** Rolling session */
    rolling?: boolean;
}
/**
 * @interface RBACConfig
 * @description Role-based access control configuration
 */
export interface RBACConfig {
    /** Default user role */
    defaultRole: string;
    /** Available roles */
    roles: string[];
    /** Role hierarchy */
    hierarchy?: Record<string, string[]>;
    /** Default permissions per role */
    defaultPermissions?: Record<string, string[]>;
    /** Super admin role */
    superAdminRole?: string;
    /** Role assignment strategy */
    assignmentStrategy?: 'manual' | 'automatic' | 'group-based';
}
/**
 * @interface SecuritySettingsConfig
 * @description General security settings
 */
export interface SecuritySettingsConfig {
    /** Enable rate limiting */
    rateLimitEnabled?: boolean;
    /** Rate limit window in minutes */
    rateLimitWindow?: number;
    /** Max requests per window */
    rateLimitMax?: number;
    /** Enable CORS */
    corsEnabled?: boolean;
    /** Allowed origins */
    allowedOrigins?: string[];
    /** Enable CSRF protection */
    csrfEnabled?: boolean;
    /** Enable helmet security headers */
    helmetEnabled?: boolean;
    /** Session encryption enabled */
    sessionEncryption?: boolean;
    /** API key rotation days */
    apiKeyRotationDays?: number;
}
/**
 * @interface AuditConfig
 * @description Audit logging configuration
 */
export interface AuditConfig {
    /** Audit logging enabled */
    enabled: boolean;
    /** Events to audit */
    events?: string[];
    /** Audit log retention days */
    retentionDays?: number;
    /** Log to database */
    logToDatabase?: boolean;
    /** Log to file */
    logToFile?: boolean;
    /** File path for audit logs */
    filePath?: string;
    /** Include request bodies */
    includeRequestBodies?: boolean;
    /** Include response bodies */
    includeResponseBodies?: boolean;
    /** PII redaction enabled */
    piiRedaction?: boolean;
}
/**
 * @interface FeatureFlagsConfig
 * @description IAM feature flags configuration
 */
export interface FeatureFlagsConfig {
    /** Social login enabled */
    socialLogin?: boolean;
    /** SSO enabled */
    ssoEnabled?: boolean;
    /** Biometric auth enabled */
    biometricAuth?: boolean;
    /** Passwordless login enabled */
    passwordlessLogin?: boolean;
    /** Risk-based authentication */
    riskBasedAuth?: boolean;
    /** Continuous authentication */
    continuousAuth?: boolean;
    /** Device fingerprinting */
    deviceFingerprinting?: boolean;
}
/**
 * @interface IAMEnvironmentConfig
 * @description Complete IAM environment configuration
 */
export interface IAMEnvironmentConfig {
    /** Environment name */
    environment: 'development' | 'staging' | 'production' | 'test';
    /** JWT configuration */
    jwt: JWTConfigOptions;
    /** OAuth configuration */
    oauth?: Record<string, OAuthConfigOptions>;
    /** Password policy */
    passwordPolicy: PasswordPolicyConfig;
    /** MFA configuration */
    mfa: MFAConfig;
    /** Session configuration */
    session: SessionConfig;
    /** RBAC configuration */
    rbac: RBACConfig;
    /** Security settings */
    security: SecuritySettingsConfig;
    /** Audit configuration */
    audit: AuditConfig;
    /** Feature flags */
    features: FeatureFlagsConfig;
}
/**
 * @interface ConfigValidationResult
 * @description Result of configuration validation
 */
export interface ConfigValidationResult {
    /** Validation success */
    valid: boolean;
    /** Validation errors */
    errors?: string[];
    /** Sanitized configuration */
    config?: any;
}
/**
 * @interface EncryptedConfigOptions
 * @description Options for encrypted configuration
 */
export interface EncryptedConfigOptions {
    /** Encryption algorithm */
    algorithm?: string;
    /** Encryption key */
    key: string;
    /** Initialization vector */
    iv?: string;
    /** Input encoding */
    inputEncoding?: BufferEncoding;
    /** Output encoding */
    outputEncoding?: BufferEncoding;
}
/**
 * Creates IAM-specific configuration module for NestJS.
 *
 * @param {IAMConfigModuleOptions} options - Configuration options
 * @returns {DynamicModule} NestJS dynamic module
 *
 * @example
 * ```typescript
 * const iamConfig = createIAMConfigModule({
 *   envFilePath: '.env.production',
 *   validateOnStartup: true,
 *   cache: true,
 *   loadSecrets: true
 * });
 * ```
 */
export declare const createIAMConfigModule: (options?: IAMConfigModuleOptions) => ConfigModuleOptions;
/**
 * Loads IAM security settings from environment variables.
 *
 * @returns {SecuritySettingsConfig} Security settings configuration
 *
 * @example
 * ```typescript
 * const settings = loadIAMSecuritySettings();
 * console.log(settings.rateLimitEnabled);
 * ```
 */
export declare const loadIAMSecuritySettings: () => SecuritySettingsConfig;
/**
 * Creates JWT configuration from environment variables.
 *
 * @param {Partial<JWTConfigOptions>} overrides - Configuration overrides
 * @returns {JWTConfigOptions} JWT configuration
 *
 * @example
 * ```typescript
 * const jwtConfig = createJWTConfig({
 *   secret: process.env.JWT_SECRET,
 *   expiresIn: '1h'
 * });
 * ```
 */
export declare const createJWTConfig: (overrides?: Partial<JWTConfigOptions>) => JWTConfigOptions;
/**
 * Creates OAuth/OIDC provider configuration.
 *
 * @param {string} provider - Provider name
 * @param {Partial<OAuthConfigOptions>} overrides - Configuration overrides
 * @returns {OAuthConfigOptions} OAuth configuration
 *
 * @example
 * ```typescript
 * const googleConfig = createOAuthConfig('google', {
 *   clientId: process.env.GOOGLE_CLIENT_ID,
 *   clientSecret: process.env.GOOGLE_CLIENT_SECRET
 * });
 * ```
 */
export declare const createOAuthConfig: (provider: string, overrides?: Partial<OAuthConfigOptions>) => OAuthConfigOptions;
/**
 * Creates password policy configuration.
 *
 * @param {Partial<PasswordPolicyConfig>} overrides - Policy overrides
 * @returns {PasswordPolicyConfig} Password policy
 *
 * @example
 * ```typescript
 * const policy = createPasswordPolicy({
 *   minLength: 12,
 *   requireSpecialChars: true
 * });
 * ```
 */
export declare const createPasswordPolicy: (overrides?: Partial<PasswordPolicyConfig>) => PasswordPolicyConfig;
/**
 * Creates MFA configuration.
 *
 * @param {Partial<MFAConfig>} overrides - Configuration overrides
 * @returns {MFAConfig} MFA configuration
 *
 * @example
 * ```typescript
 * const mfaConfig = createMFAConfig({
 *   enabled: true,
 *   enforcement: 'required'
 * });
 * ```
 */
export declare const createMFAConfig: (overrides?: Partial<MFAConfig>) => MFAConfig;
/**
 * Creates session configuration.
 *
 * @param {Partial<SessionConfig>} overrides - Configuration overrides
 * @returns {SessionConfig} Session configuration
 *
 * @example
 * ```typescript
 * const sessionConfig = createSessionConfig({
 *   store: 'redis',
 *   maxAge: 86400000
 * });
 * ```
 */
export declare const createSessionConfig: (overrides?: Partial<SessionConfig>) => SessionConfig;
/**
 * Creates RBAC configuration.
 *
 * @param {Partial<RBACConfig>} overrides - Configuration overrides
 * @returns {RBACConfig} RBAC configuration
 *
 * @example
 * ```typescript
 * const rbacConfig = createRBACConfig({
 *   defaultRole: 'patient',
 *   roles: ['patient', 'doctor', 'admin']
 * });
 * ```
 */
export declare const createRBACConfig: (overrides?: Partial<RBACConfig>) => RBACConfig;
/**
 * Creates audit configuration.
 *
 * @param {Partial<AuditConfig>} overrides - Configuration overrides
 * @returns {AuditConfig} Audit configuration
 *
 * @example
 * ```typescript
 * const auditConfig = createAuditConfig({
 *   enabled: true,
 *   retentionDays: 365
 * });
 * ```
 */
export declare const createAuditConfig: (overrides?: Partial<AuditConfig>) => AuditConfig;
/**
 * Creates feature flags configuration.
 *
 * @param {Partial<FeatureFlagsConfig>} overrides - Configuration overrides
 * @returns {FeatureFlagsConfig} Feature flags
 *
 * @example
 * ```typescript
 * const features = createFeatureFlags({
 *   socialLogin: true,
 *   biometricAuth: false
 * });
 * ```
 */
export declare const createFeatureFlags: (overrides?: Partial<FeatureFlagsConfig>) => FeatureFlagsConfig;
/**
 * Creates complete IAM environment configuration.
 *
 * @param {string} environment - Environment name
 * @returns {IAMEnvironmentConfig} Complete IAM configuration
 *
 * @example
 * ```typescript
 * const config = createIAMEnvironmentConfig('production');
 * console.log(config.jwt.secret);
 * ```
 */
export declare const createIAMEnvironmentConfig: (environment?: "development" | "staging" | "production" | "test") => IAMEnvironmentConfig;
/**
 * Gets development environment IAM configuration.
 *
 * @returns {IAMEnvironmentConfig} Development configuration
 *
 * @example
 * ```typescript
 * const devConfig = getDevelopmentConfig();
 * ```
 */
export declare const getDevelopmentConfig: () => IAMEnvironmentConfig;
/**
 * Gets staging environment IAM configuration.
 *
 * @returns {IAMEnvironmentConfig} Staging configuration
 *
 * @example
 * ```typescript
 * const stagingConfig = getStagingConfig();
 * ```
 */
export declare const getStagingConfig: () => IAMEnvironmentConfig;
/**
 * Gets production environment IAM configuration.
 *
 * @returns {IAMEnvironmentConfig} Production configuration
 *
 * @example
 * ```typescript
 * const prodConfig = getProductionConfig();
 * ```
 */
export declare const getProductionConfig: () => IAMEnvironmentConfig;
/**
 * Gets test environment IAM configuration.
 *
 * @returns {IAMEnvironmentConfig} Test configuration
 *
 * @example
 * ```typescript
 * const testConfig = getTestConfig();
 * ```
 */
export declare const getTestConfig: () => IAMEnvironmentConfig;
/**
 * Loads environment-specific configuration based on NODE_ENV.
 *
 * @returns {IAMEnvironmentConfig} Environment configuration
 *
 * @example
 * ```typescript
 * const config = loadEnvironmentConfig();
 * ```
 */
export declare const loadEnvironmentConfig: () => IAMEnvironmentConfig;
/**
 * Validates IAM configuration against requirements.
 *
 * @param {any} config - Configuration to validate
 * @returns {ConfigValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateIAMConfig(myConfig);
 * if (!result.valid) {
 *   console.error(result.errors);
 * }
 * ```
 */
export declare const validateIAMConfig: (config: any) => ConfigValidationResult;
/**
 * Validates JWT configuration.
 *
 * @param {JWTConfigOptions} config - JWT configuration
 * @returns {boolean} Validation result
 *
 * @example
 * ```typescript
 * const isValid = validateJWTConfig(jwtConfig);
 * ```
 */
export declare const validateJWTConfig: (config: JWTConfigOptions) => boolean;
/**
 * Validates OAuth configuration.
 *
 * @param {OAuthConfigOptions} config - OAuth configuration
 * @returns {boolean} Validation result
 *
 * @example
 * ```typescript
 * const isValid = validateOAuthConfig(oauthConfig);
 * ```
 */
export declare const validateOAuthConfig: (config: OAuthConfigOptions) => boolean;
/**
 * Sanitizes configuration by removing sensitive data.
 *
 * @param {any} config - Configuration to sanitize
 * @returns {any} Sanitized configuration
 *
 * @example
 * ```typescript
 * const safe = sanitizeConfig(config);
 * console.log(safe); // No secrets visible
 * ```
 */
export declare const sanitizeConfig: (config: any) => any;
/**
 * Loads secrets from AWS Secrets Manager.
 *
 * @param {string} secretName - Secret name or ARN
 * @param {string} region - AWS region
 * @returns {Promise<Record<string, string>>} Secrets
 *
 * @example
 * ```typescript
 * const secrets = await loadSecretsFromAWS('iam/production', 'us-east-1');
 * ```
 */
export declare const loadSecretsFromAWS: (secretName: string, region?: string) => Promise<Record<string, string>>;
/**
 * Loads secrets from Azure Key Vault.
 *
 * @param {string} vaultUrl - Key Vault URL
 * @param {string} secretName - Secret name
 * @returns {Promise<Record<string, string>>} Secrets
 *
 * @example
 * ```typescript
 * const secrets = await loadSecretsFromAzure('https://myvault.vault.azure.net', 'iam-secrets');
 * ```
 */
export declare const loadSecretsFromAzure: (vaultUrl: string, secretName: string) => Promise<Record<string, string>>;
/**
 * Loads secrets from HashiCorp Vault.
 *
 * @param {string} vaultUrl - Vault URL
 * @param {string} path - Secret path
 * @param {string} token - Vault token
 * @returns {Promise<Record<string, string>>} Secrets
 *
 * @example
 * ```typescript
 * const secrets = await loadSecretsFromVault('http://vault:8200', 'secret/iam', 'token');
 * ```
 */
export declare const loadSecretsFromVault: (vaultUrl: string, path: string, token: string) => Promise<Record<string, string>>;
/**
 * Merges secrets into environment variables.
 *
 * @param {Record<string, string>} secrets - Secrets to merge
 * @param {boolean} override - Whether to override existing values
 *
 * @example
 * ```typescript
 * mergeSecretsToEnv(secrets, false);
 * ```
 */
export declare const mergeSecretsToEnv: (secrets: Record<string, string>, override?: boolean) => void;
/**
 * Encrypts configuration value.
 *
 * @param {string} value - Value to encrypt
 * @param {string} key - Encryption key
 * @returns {string} Encrypted value
 *
 * @example
 * ```typescript
 * const encrypted = encryptConfigValue('my-secret', 'encryption-key');
 * ```
 */
export declare const encryptConfigValue: (value: string, key: string) => string;
/**
 * Decrypts configuration value.
 *
 * @param {string} encryptedValue - Encrypted value
 * @param {string} key - Decryption key
 * @returns {string} Decrypted value
 *
 * @example
 * ```typescript
 * const decrypted = decryptConfigValue(encrypted, 'encryption-key');
 * ```
 */
export declare const decryptConfigValue: (encryptedValue: string, key: string) => string;
/**
 * Encrypts entire configuration object.
 *
 * @param {Record<string, any>} config - Configuration object
 * @param {string} key - Encryption key
 * @returns {string} Encrypted configuration JSON
 *
 * @example
 * ```typescript
 * const encrypted = encryptConfig(myConfig, 'key');
 * ```
 */
export declare const encryptConfig: (config: Record<string, any>, key: string) => string;
/**
 * Decrypts configuration object.
 *
 * @param {string} encryptedConfig - Encrypted configuration
 * @param {string} key - Decryption key
 * @returns {Record<string, any>} Decrypted configuration
 *
 * @example
 * ```typescript
 * const config = decryptConfig(encrypted, 'key');
 * ```
 */
export declare const decryptConfig: (encryptedConfig: string, key: string) => Record<string, any>;
/**
 * Gets default IAM policy for a role.
 *
 * @param {string} role - Role name
 * @returns {string[]} Default permissions
 *
 * @example
 * ```typescript
 * const permissions = getDefaultPolicyForRole('doctor');
 * ```
 */
export declare const getDefaultPolicyForRole: (role: string) => string[];
/**
 * Creates default permission matrix.
 *
 * @returns {Record<string, string[]>} Permission matrix
 *
 * @example
 * ```typescript
 * const matrix = createDefaultPermissionMatrix();
 * ```
 */
export declare const createDefaultPermissionMatrix: () => Record<string, string[]>;
/**
 * Creates HIPAA-compliant default configuration.
 *
 * @returns {IAMEnvironmentConfig} HIPAA-compliant configuration
 *
 * @example
 * ```typescript
 * const hipaaConfig = createHIPAACompliantConfig();
 * ```
 */
export declare const createHIPAACompliantConfig: () => IAMEnvironmentConfig;
/**
 * Exports configuration to JSON file.
 *
 * @param {any} config - Configuration to export
 * @param {string} filePath - Output file path
 *
 * @example
 * ```typescript
 * exportConfigToFile(myConfig, './config/iam.json');
 * ```
 */
export declare const exportConfigToFile: (config: any, filePath: string) => void;
/**
 * Imports configuration from JSON file.
 *
 * @param {string} filePath - Input file path
 * @returns {any} Imported configuration
 *
 * @example
 * ```typescript
 * const config = importConfigFromFile('./config/iam.json');
 * ```
 */
export declare const importConfigFromFile: (filePath: string) => any;
/**
 * Merges multiple configuration objects.
 *
 * @param {...any[]} configs - Configuration objects to merge
 * @returns {any} Merged configuration
 *
 * @example
 * ```typescript
 * const merged = mergeConfigs(baseConfig, envConfig, overrides);
 * ```
 */
export declare const mergeConfigs: (...configs: any[]) => any;
/**
 * Deep merges two objects.
 *
 * @param {any} target - Target object
 * @param {any} source - Source object
 * @returns {any} Merged object
 *
 * @example
 * ```typescript
 * const merged = deepMerge(obj1, obj2);
 * ```
 */
export declare const deepMerge: (target: any, source: any) => any;
/**
 * Checks if value is an object.
 *
 * @param {any} item - Item to check
 * @returns {boolean} Is object
 *
 * @example
 * ```typescript
 * const result = isObject({});
 * ```
 */
export declare const isObject: (item: any) => boolean;
/**
 * Creates configuration namespace factory.
 *
 * @param {string} namespace - Namespace name
 * @param {() => any} factory - Configuration factory
 * @returns {ConfigFactory} NestJS config factory
 *
 * @example
 * ```typescript
 * const dbConfigFactory = createConfigNamespace('database', () => ({
 *   host: process.env.DB_HOST
 * }));
 * ```
 */
export declare const createConfigNamespace: (namespace: string, factory: () => any) => ConfigFactory;
/**
 * Creates async configuration factory.
 *
 * @param {() => Promise<any>} factory - Async factory function
 * @returns {() => Promise<any>} Async factory
 *
 * @example
 * ```typescript
 * const factory = createAsyncConfigFactory(async () => {
 *   const secrets = await fetchSecrets();
 *   return secrets;
 * });
 * ```
 */
export declare const createAsyncConfigFactory: (factory: () => Promise<any>) => (() => Promise<any>);
/**
 * Validates environment variable existence.
 *
 * @param {string[]} requiredVars - Required environment variables
 * @returns {boolean} Validation result
 *
 * @example
 * ```typescript
 * const isValid = validateRequiredEnvVars(['JWT_SECRET', 'DATABASE_URL']);
 * ```
 */
export declare const validateRequiredEnvVars: (requiredVars: string[]) => boolean;
/**
 * Creates configuration cache key.
 *
 * @param {string} namespace - Namespace
 * @param {string} key - Configuration key
 * @returns {string} Cache key
 *
 * @example
 * ```typescript
 * const cacheKey = createConfigCacheKey('database', 'host');
 * ```
 */
export declare const createConfigCacheKey: (namespace: string, key: string) => string;
/**
 * Parses time string to seconds.
 *
 * @param {string} time - Time string (e.g., '15m', '1h', '7d')
 * @returns {number} Seconds
 *
 * @example
 * ```typescript
 * const seconds = parseTimeToSeconds('15m'); // 900
 * ```
 */
export declare const parseTimeToSeconds: (time: string) => number;
//# sourceMappingURL=iam-config-kit.d.ts.map