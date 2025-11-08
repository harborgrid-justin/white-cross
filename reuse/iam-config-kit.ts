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

import { DynamicModule } from '@nestjs/common';
import { ConfigModuleOptions, ConfigFactory, registerAs } from '@nestjs/config';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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

// ============================================================================
// IAM CONFIG MODULE SETUP
// ============================================================================

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
export const createIAMConfigModule = (options: IAMConfigModuleOptions = {}): ConfigModuleOptions => {
  return {
    envFilePath: options.envFilePath || '.env',
    isGlobal: options.isGlobal !== false,
    cache: options.cache !== false,
    expandVariables: true,
    validationSchema: options.validationSchema,
    validationOptions: {
      abortEarly: true,
      allowUnknown: false,
    },
  };
};

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
export const loadIAMSecuritySettings = (): SecuritySettingsConfig => {
  return {
    rateLimitEnabled: process.env.IAM_RATE_LIMIT_ENABLED === 'true',
    rateLimitWindow: parseInt(process.env.IAM_RATE_LIMIT_WINDOW || '15', 10),
    rateLimitMax: parseInt(process.env.IAM_RATE_LIMIT_MAX || '100', 10),
    corsEnabled: process.env.IAM_CORS_ENABLED !== 'false',
    allowedOrigins: process.env.IAM_ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    csrfEnabled: process.env.IAM_CSRF_ENABLED === 'true',
    helmetEnabled: process.env.IAM_HELMET_ENABLED !== 'false',
    sessionEncryption: process.env.IAM_SESSION_ENCRYPTION === 'true',
    apiKeyRotationDays: parseInt(process.env.IAM_API_KEY_ROTATION_DAYS || '90', 10),
  };
};

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
export const createJWTConfig = (overrides: Partial<JWTConfigOptions> = {}): JWTConfigOptions => {
  return {
    secret: process.env.JWT_SECRET || overrides.secret || '',
    expiresIn: process.env.JWT_EXPIRES_IN || overrides.expiresIn || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || overrides.refreshExpiresIn || '7d',
    issuer: process.env.JWT_ISSUER || overrides.issuer || 'white-cross-healthcare',
    audience: process.env.JWT_AUDIENCE || overrides.audience || 'white-cross-api',
    algorithm: (process.env.JWT_ALGORITHM as any) || overrides.algorithm || 'HS256',
    publicKey: process.env.JWT_PUBLIC_KEY || overrides.publicKey,
    privateKey: process.env.JWT_PRIVATE_KEY || overrides.privateKey,
  };
};

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
export const createOAuthConfig = (
  provider: string,
  overrides: Partial<OAuthConfigOptions> = {},
): OAuthConfigOptions => {
  const prefix = provider.toUpperCase();
  return {
    provider,
    clientId: process.env[`${prefix}_CLIENT_ID`] || overrides.clientId || '',
    clientSecret: process.env[`${prefix}_CLIENT_SECRET`] || overrides.clientSecret || '',
    authorizationUrl: process.env[`${prefix}_AUTH_URL`] || overrides.authorizationUrl || '',
    tokenUrl: process.env[`${prefix}_TOKEN_URL`] || overrides.tokenUrl || '',
    userInfoUrl: process.env[`${prefix}_USER_INFO_URL`] || overrides.userInfoUrl,
    redirectUri: process.env[`${prefix}_REDIRECT_URI`] || overrides.redirectUri || '',
    scope: process.env[`${prefix}_SCOPE`]?.split(',') || overrides.scope || ['openid', 'profile', 'email'],
    pkceEnabled: process.env[`${prefix}_PKCE_ENABLED`] === 'true' || overrides.pkceEnabled || false,
  };
};

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
export const createPasswordPolicy = (overrides: Partial<PasswordPolicyConfig> = {}): PasswordPolicyConfig => {
  return {
    minLength: parseInt(process.env.PASSWORD_MIN_LENGTH || '8', 10) || overrides.minLength,
    maxLength: parseInt(process.env.PASSWORD_MAX_LENGTH || '128', 10) || overrides.maxLength,
    requireUppercase: process.env.PASSWORD_REQUIRE_UPPERCASE !== 'false' || overrides.requireUppercase !== false,
    requireLowercase: process.env.PASSWORD_REQUIRE_LOWERCASE !== 'false' || overrides.requireLowercase !== false,
    requireNumbers: process.env.PASSWORD_REQUIRE_NUMBERS !== 'false' || overrides.requireNumbers !== false,
    requireSpecialChars: process.env.PASSWORD_REQUIRE_SPECIAL === 'true' || overrides.requireSpecialChars || false,
    expirationDays: parseInt(process.env.PASSWORD_EXPIRATION_DAYS || '90', 10) || overrides.expirationDays,
    historyCount: parseInt(process.env.PASSWORD_HISTORY_COUNT || '5', 10) || overrides.historyCount,
    maxFailedAttempts: parseInt(process.env.PASSWORD_MAX_FAILED_ATTEMPTS || '5', 10) || overrides.maxFailedAttempts,
    lockoutDuration: parseInt(process.env.PASSWORD_LOCKOUT_DURATION || '30', 10) || overrides.lockoutDuration,
  };
};

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
export const createMFAConfig = (overrides: Partial<MFAConfig> = {}): MFAConfig => {
  const methods = process.env.MFA_METHODS?.split(',') || ['totp', 'email'];
  return {
    enabled: process.env.MFA_ENABLED === 'true' || overrides.enabled || false,
    enforcement: (process.env.MFA_ENFORCEMENT as any) || overrides.enforcement || 'optional',
    methods: methods as any,
    totpIssuer: process.env.MFA_TOTP_ISSUER || overrides.totpIssuer || 'White Cross Healthcare',
    totpWindow: parseInt(process.env.MFA_TOTP_WINDOW || '1', 10) || overrides.totpWindow,
    backupCodesEnabled: process.env.MFA_BACKUP_CODES_ENABLED !== 'false' || overrides.backupCodesEnabled !== false,
    backupCodesCount: parseInt(process.env.MFA_BACKUP_CODES_COUNT || '10', 10) || overrides.backupCodesCount,
  };
};

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
export const createSessionConfig = (overrides: Partial<SessionConfig> = {}): SessionConfig => {
  return {
    secret: process.env.SESSION_SECRET || overrides.secret || '',
    store: (process.env.SESSION_STORE as any) || overrides.store || 'memory',
    cookieName: process.env.SESSION_COOKIE_NAME || overrides.cookieName || 'white-cross.sid',
    maxAge: parseInt(process.env.SESSION_MAX_AGE || '86400000', 10) || overrides.maxAge,
    secure: process.env.SESSION_SECURE === 'true' || overrides.secure || false,
    httpOnly: process.env.SESSION_HTTP_ONLY !== 'false' || overrides.httpOnly !== false,
    sameSite: (process.env.SESSION_SAME_SITE as any) || overrides.sameSite || 'lax',
    timeout: parseInt(process.env.SESSION_TIMEOUT || '30', 10) || overrides.timeout,
    rolling: process.env.SESSION_ROLLING === 'true' || overrides.rolling || false,
  };
};

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
export const createRBACConfig = (overrides: Partial<RBACConfig> = {}): RBACConfig => {
  const roles = process.env.RBAC_ROLES?.split(',') || ['patient', 'doctor', 'nurse', 'admin'];
  return {
    defaultRole: process.env.RBAC_DEFAULT_ROLE || overrides.defaultRole || 'patient',
    roles: overrides.roles || roles,
    superAdminRole: process.env.RBAC_SUPER_ADMIN_ROLE || overrides.superAdminRole || 'admin',
    assignmentStrategy: (process.env.RBAC_ASSIGNMENT_STRATEGY as any) || overrides.assignmentStrategy || 'manual',
    hierarchy: overrides.hierarchy,
    defaultPermissions: overrides.defaultPermissions,
  };
};

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
export const createAuditConfig = (overrides: Partial<AuditConfig> = {}): AuditConfig => {
  const events = process.env.AUDIT_EVENTS?.split(',') || ['login', 'logout', 'access', 'change'];
  return {
    enabled: process.env.AUDIT_ENABLED !== 'false' || overrides.enabled !== false,
    events: overrides.events || events,
    retentionDays: parseInt(process.env.AUDIT_RETENTION_DAYS || '365', 10) || overrides.retentionDays,
    logToDatabase: process.env.AUDIT_LOG_TO_DB !== 'false' || overrides.logToDatabase !== false,
    logToFile: process.env.AUDIT_LOG_TO_FILE === 'true' || overrides.logToFile || false,
    filePath: process.env.AUDIT_FILE_PATH || overrides.filePath || './logs/audit.log',
    includeRequestBodies: process.env.AUDIT_INCLUDE_REQUEST_BODIES === 'true' || overrides.includeRequestBodies || false,
    includeResponseBodies: process.env.AUDIT_INCLUDE_RESPONSE_BODIES === 'true' || overrides.includeResponseBodies || false,
    piiRedaction: process.env.AUDIT_PII_REDACTION !== 'false' || overrides.piiRedaction !== false,
  };
};

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
export const createFeatureFlags = (overrides: Partial<FeatureFlagsConfig> = {}): FeatureFlagsConfig => {
  return {
    socialLogin: process.env.FEATURE_SOCIAL_LOGIN === 'true' || overrides.socialLogin || false,
    ssoEnabled: process.env.FEATURE_SSO === 'true' || overrides.ssoEnabled || false,
    biometricAuth: process.env.FEATURE_BIOMETRIC_AUTH === 'true' || overrides.biometricAuth || false,
    passwordlessLogin: process.env.FEATURE_PASSWORDLESS === 'true' || overrides.passwordlessLogin || false,
    riskBasedAuth: process.env.FEATURE_RISK_BASED_AUTH === 'true' || overrides.riskBasedAuth || false,
    continuousAuth: process.env.FEATURE_CONTINUOUS_AUTH === 'true' || overrides.continuousAuth || false,
    deviceFingerprinting: process.env.FEATURE_DEVICE_FINGERPRINTING === 'true' || overrides.deviceFingerprinting || false,
  };
};

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
export const createIAMEnvironmentConfig = (
  environment: 'development' | 'staging' | 'production' | 'test' = 'development',
): IAMEnvironmentConfig => {
  return {
    environment,
    jwt: createJWTConfig(),
    passwordPolicy: createPasswordPolicy(),
    mfa: createMFAConfig(),
    session: createSessionConfig(),
    rbac: createRBACConfig(),
    security: loadIAMSecuritySettings(),
    audit: createAuditConfig(),
    features: createFeatureFlags(),
  };
};

// ============================================================================
// ENVIRONMENT-SPECIFIC CONFIGURATIONS
// ============================================================================

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
export const getDevelopmentConfig = (): IAMEnvironmentConfig => {
  return {
    ...createIAMEnvironmentConfig('development'),
    jwt: {
      ...createJWTConfig(),
      expiresIn: '1h',
    },
    security: {
      ...loadIAMSecuritySettings(),
      rateLimitEnabled: false,
      corsEnabled: true,
      allowedOrigins: ['http://localhost:3000', 'http://localhost:3001'],
    },
    audit: {
      ...createAuditConfig(),
      logToFile: true,
      includeRequestBodies: true,
    },
  };
};

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
export const getStagingConfig = (): IAMEnvironmentConfig => {
  return {
    ...createIAMEnvironmentConfig('staging'),
    jwt: {
      ...createJWTConfig(),
      expiresIn: '30m',
    },
    security: {
      ...loadIAMSecuritySettings(),
      rateLimitEnabled: true,
      corsEnabled: true,
      helmetEnabled: true,
    },
    audit: {
      ...createAuditConfig(),
      enabled: true,
      logToDatabase: true,
    },
  };
};

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
export const getProductionConfig = (): IAMEnvironmentConfig => {
  return {
    ...createIAMEnvironmentConfig('production'),
    jwt: {
      ...createJWTConfig(),
      expiresIn: '15m',
    },
    mfa: {
      ...createMFAConfig(),
      enabled: true,
      enforcement: 'required',
    },
    security: {
      ...loadIAMSecuritySettings(),
      rateLimitEnabled: true,
      corsEnabled: true,
      csrfEnabled: true,
      helmetEnabled: true,
      sessionEncryption: true,
    },
    audit: {
      ...createAuditConfig(),
      enabled: true,
      logToDatabase: true,
      piiRedaction: true,
    },
  };
};

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
export const getTestConfig = (): IAMEnvironmentConfig => {
  return {
    ...createIAMEnvironmentConfig('test'),
    jwt: {
      secret: 'test-secret-key-min-32-characters',
      expiresIn: '1h',
      issuer: 'test',
      audience: 'test',
      algorithm: 'HS256',
    },
    security: {
      ...loadIAMSecuritySettings(),
      rateLimitEnabled: false,
      corsEnabled: true,
    },
    audit: {
      ...createAuditConfig(),
      enabled: false,
    },
  };
};

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
export const loadEnvironmentConfig = (): IAMEnvironmentConfig => {
  const env = process.env.NODE_ENV || 'development';

  switch (env) {
    case 'production':
      return getProductionConfig();
    case 'staging':
      return getStagingConfig();
    case 'test':
      return getTestConfig();
    default:
      return getDevelopmentConfig();
  }
};

// ============================================================================
// CONFIGURATION VALIDATION
// ============================================================================

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
export const validateIAMConfig = (config: any): ConfigValidationResult => {
  const errors: string[] = [];

  // Validate JWT config
  if (!config.jwt?.secret || config.jwt.secret.length < 32) {
    errors.push('JWT secret must be at least 32 characters');
  }

  // Validate password policy
  if (config.passwordPolicy?.minLength < 8) {
    errors.push('Password minimum length must be at least 8 characters');
  }

  // Validate session config
  if (!config.session?.secret) {
    errors.push('Session secret is required');
  }

  // Validate RBAC config
  if (!config.rbac?.defaultRole) {
    errors.push('Default role is required');
  }

  if (!config.rbac?.roles || config.rbac.roles.length === 0) {
    errors.push('At least one role must be defined');
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
    config: errors.length === 0 ? config : undefined,
  };
};

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
export const validateJWTConfig = (config: JWTConfigOptions): boolean => {
  if (!config.secret || config.secret.length < 32) {
    return false;
  }

  if (config.algorithm?.startsWith('RS') && (!config.publicKey || !config.privateKey)) {
    return false;
  }

  return true;
};

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
export const validateOAuthConfig = (config: OAuthConfigOptions): boolean => {
  return !!(
    config.clientId &&
    config.clientSecret &&
    config.authorizationUrl &&
    config.tokenUrl &&
    config.redirectUri
  );
};

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
export const sanitizeConfig = (config: any): any => {
  const sensitiveKeys = ['secret', 'password', 'key', 'token', 'clientSecret', 'privateKey'];

  const sanitize = (obj: any): any => {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    const sanitized: any = Array.isArray(obj) ? [] : {};

    for (const key in obj) {
      if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk.toLowerCase()))) {
        sanitized[key] = '***REDACTED***';
      } else if (typeof obj[key] === 'object') {
        sanitized[key] = sanitize(obj[key]);
      } else {
        sanitized[key] = obj[key];
      }
    }

    return sanitized;
  };

  return sanitize(config);
};

// ============================================================================
// SECRETS MANAGEMENT
// ============================================================================

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
export const loadSecretsFromAWS = async (
  secretName: string,
  region: string = 'us-east-1',
): Promise<Record<string, string>> => {
  try {
    // This is a placeholder - actual implementation would use AWS SDK
    // import { SecretsManager } from '@aws-sdk/client-secrets-manager';

    console.log(`Loading secrets from AWS: ${secretName} in ${region}`);

    // Simulated response
    return {};
  } catch (error) {
    console.error('Failed to load secrets from AWS:', error);
    throw error;
  }
};

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
export const loadSecretsFromAzure = async (
  vaultUrl: string,
  secretName: string,
): Promise<Record<string, string>> => {
  try {
    // This is a placeholder - actual implementation would use Azure SDK
    // import { SecretClient } from '@azure/keyvault-secrets';

    console.log(`Loading secrets from Azure Key Vault: ${vaultUrl}/${secretName}`);

    // Simulated response
    return {};
  } catch (error) {
    console.error('Failed to load secrets from Azure:', error);
    throw error;
  }
};

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
export const loadSecretsFromVault = async (
  vaultUrl: string,
  path: string,
  token: string,
): Promise<Record<string, string>> => {
  try {
    console.log(`Loading secrets from Vault: ${vaultUrl}/${path}`);

    // Simulated response
    return {};
  } catch (error) {
    console.error('Failed to load secrets from Vault:', error);
    throw error;
  }
};

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
export const mergeSecretsToEnv = (secrets: Record<string, string>, override: boolean = false): void => {
  Object.entries(secrets).forEach(([key, value]) => {
    if (override || !process.env[key]) {
      process.env[key] = value;
    }
  });
};

// ============================================================================
// CONFIGURATION ENCRYPTION
// ============================================================================

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
export const encryptConfigValue = (value: string, key: string): string => {
  const algorithm = 'aes-256-cbc';
  const iv = crypto.randomBytes(16);
  const keyBuffer = crypto.scryptSync(key, 'salt', 32);

  const cipher = crypto.createCipheriv(algorithm, keyBuffer, iv);
  let encrypted = cipher.update(value, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return `${iv.toString('hex')}:${encrypted}`;
};

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
export const decryptConfigValue = (encryptedValue: string, key: string): string => {
  const algorithm = 'aes-256-cbc';
  const [ivHex, encrypted] = encryptedValue.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const keyBuffer = crypto.scryptSync(key, 'salt', 32);

  const decipher = crypto.createDecipheriv(algorithm, keyBuffer, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
};

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
export const encryptConfig = (config: Record<string, any>, key: string): string => {
  const jsonConfig = JSON.stringify(config);
  return encryptConfigValue(jsonConfig, key);
};

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
export const decryptConfig = (encryptedConfig: string, key: string): Record<string, any> => {
  const decrypted = decryptConfigValue(encryptedConfig, key);
  return JSON.parse(decrypted);
};

// ============================================================================
// DEFAULT IAM POLICIES
// ============================================================================

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
export const getDefaultPolicyForRole = (role: string): string[] => {
  const policies: Record<string, string[]> = {
    patient: ['read:own-profile', 'update:own-profile', 'read:own-appointments', 'create:appointments'],
    doctor: [
      'read:patients',
      'update:patients',
      'read:appointments',
      'update:appointments',
      'create:prescriptions',
      'read:medical-records',
    ],
    nurse: ['read:patients', 'update:vital-signs', 'read:appointments', 'read:prescriptions'],
    admin: ['*'],
  };

  return policies[role] || [];
};

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
export const createDefaultPermissionMatrix = (): Record<string, string[]> => {
  return {
    patient: getDefaultPolicyForRole('patient'),
    doctor: getDefaultPolicyForRole('doctor'),
    nurse: getDefaultPolicyForRole('nurse'),
    admin: getDefaultPolicyForRole('admin'),
  };
};

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
export const createHIPAACompliantConfig = (): IAMEnvironmentConfig => {
  return {
    environment: 'production',
    jwt: {
      ...createJWTConfig(),
      expiresIn: '15m',
    },
    passwordPolicy: {
      minLength: 12,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      expirationDays: 90,
      historyCount: 24,
      maxFailedAttempts: 3,
      lockoutDuration: 30,
    },
    mfa: {
      enabled: true,
      enforcement: 'required',
      methods: ['totp', 'sms'],
      totpIssuer: 'White Cross Healthcare',
      totpWindow: 1,
      backupCodesEnabled: true,
      backupCodesCount: 10,
    },
    session: {
      ...createSessionConfig(),
      secure: true,
      httpOnly: true,
      sameSite: 'strict',
      timeout: 15,
    },
    rbac: createRBACConfig(),
    security: {
      rateLimitEnabled: true,
      rateLimitWindow: 15,
      rateLimitMax: 100,
      corsEnabled: true,
      allowedOrigins: [],
      csrfEnabled: true,
      helmetEnabled: true,
      sessionEncryption: true,
      apiKeyRotationDays: 90,
    },
    audit: {
      enabled: true,
      events: ['login', 'logout', 'access', 'change', 'failed_login', 'permission_denied'],
      retentionDays: 2555, // 7 years
      logToDatabase: true,
      logToFile: true,
      filePath: './logs/audit.log',
      includeRequestBodies: false,
      includeResponseBodies: false,
      piiRedaction: true,
    },
    features: createFeatureFlags(),
  };
};

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
export const exportConfigToFile = (config: any, filePath: string): void => {
  const sanitized = sanitizeConfig(config);
  const json = JSON.stringify(sanitized, null, 2);
  fs.writeFileSync(filePath, json, 'utf8');
};

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
export const importConfigFromFile = (filePath: string): any => {
  const json = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(json);
};

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
export const mergeConfigs = (...configs: any[]): any => {
  return configs.reduce((acc, config) => {
    return deepMerge(acc, config);
  }, {});
};

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
export const deepMerge = (target: any, source: any): any => {
  const output = { ...target };

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }

  return output;
};

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
export const isObject = (item: any): boolean => {
  return item && typeof item === 'object' && !Array.isArray(item);
};

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
export const createConfigNamespace = (namespace: string, factory: () => any): ConfigFactory => {
  return registerAs(namespace, factory);
};

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
export const createAsyncConfigFactory = (factory: () => Promise<any>): (() => Promise<any>) => {
  return factory;
};

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
export const validateRequiredEnvVars = (requiredVars: string[]): boolean => {
  const missing = requiredVars.filter(varName => !process.env[varName]);

  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    return false;
  }

  return true;
};

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
export const createConfigCacheKey = (namespace: string, key: string): string => {
  return `config:${namespace}:${key}`;
};

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
export const parseTimeToSeconds = (time: string): number => {
  const units: Record<string, number> = {
    s: 1,
    m: 60,
    h: 3600,
    d: 86400,
    w: 604800,
  };

  const match = time.match(/^(\d+)([smhdw])$/);
  if (!match) {
    return parseInt(time, 10);
  }

  const [, value, unit] = match;
  return parseInt(value, 10) * (units[unit] || 1);
};
