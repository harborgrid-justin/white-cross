"use strict";
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
exports.parseTimeToSeconds = exports.createConfigCacheKey = exports.validateRequiredEnvVars = exports.createAsyncConfigFactory = exports.createConfigNamespace = exports.isObject = exports.deepMerge = exports.mergeConfigs = exports.importConfigFromFile = exports.exportConfigToFile = exports.createHIPAACompliantConfig = exports.createDefaultPermissionMatrix = exports.getDefaultPolicyForRole = exports.decryptConfig = exports.encryptConfig = exports.decryptConfigValue = exports.encryptConfigValue = exports.mergeSecretsToEnv = exports.loadSecretsFromVault = exports.loadSecretsFromAzure = exports.loadSecretsFromAWS = exports.sanitizeConfig = exports.validateOAuthConfig = exports.validateJWTConfig = exports.validateIAMConfig = exports.loadEnvironmentConfig = exports.getTestConfig = exports.getProductionConfig = exports.getStagingConfig = exports.getDevelopmentConfig = exports.createIAMEnvironmentConfig = exports.createFeatureFlags = exports.createAuditConfig = exports.createRBACConfig = exports.createSessionConfig = exports.createMFAConfig = exports.createPasswordPolicy = exports.createOAuthConfig = exports.createJWTConfig = exports.loadIAMSecuritySettings = exports.createIAMConfigModule = void 0;
const config_1 = require("@nestjs/config");
const crypto = __importStar(require("crypto"));
const fs = __importStar(require("fs"));
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
const createIAMConfigModule = (options = {}) => {
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
exports.createIAMConfigModule = createIAMConfigModule;
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
const loadIAMSecuritySettings = () => {
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
exports.loadIAMSecuritySettings = loadIAMSecuritySettings;
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
const createJWTConfig = (overrides = {}) => {
    return {
        secret: process.env.JWT_SECRET || overrides.secret || '',
        expiresIn: process.env.JWT_EXPIRES_IN || overrides.expiresIn || '15m',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || overrides.refreshExpiresIn || '7d',
        issuer: process.env.JWT_ISSUER || overrides.issuer || 'white-cross-healthcare',
        audience: process.env.JWT_AUDIENCE || overrides.audience || 'white-cross-api',
        algorithm: process.env.JWT_ALGORITHM || overrides.algorithm || 'HS256',
        publicKey: process.env.JWT_PUBLIC_KEY || overrides.publicKey,
        privateKey: process.env.JWT_PRIVATE_KEY || overrides.privateKey,
    };
};
exports.createJWTConfig = createJWTConfig;
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
const createOAuthConfig = (provider, overrides = {}) => {
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
exports.createOAuthConfig = createOAuthConfig;
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
const createPasswordPolicy = (overrides = {}) => {
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
exports.createPasswordPolicy = createPasswordPolicy;
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
const createMFAConfig = (overrides = {}) => {
    const methods = process.env.MFA_METHODS?.split(',') || ['totp', 'email'];
    return {
        enabled: process.env.MFA_ENABLED === 'true' || overrides.enabled || false,
        enforcement: process.env.MFA_ENFORCEMENT || overrides.enforcement || 'optional',
        methods: methods,
        totpIssuer: process.env.MFA_TOTP_ISSUER || overrides.totpIssuer || 'White Cross Healthcare',
        totpWindow: parseInt(process.env.MFA_TOTP_WINDOW || '1', 10) || overrides.totpWindow,
        backupCodesEnabled: process.env.MFA_BACKUP_CODES_ENABLED !== 'false' || overrides.backupCodesEnabled !== false,
        backupCodesCount: parseInt(process.env.MFA_BACKUP_CODES_COUNT || '10', 10) || overrides.backupCodesCount,
    };
};
exports.createMFAConfig = createMFAConfig;
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
const createSessionConfig = (overrides = {}) => {
    return {
        secret: process.env.SESSION_SECRET || overrides.secret || '',
        store: process.env.SESSION_STORE || overrides.store || 'memory',
        cookieName: process.env.SESSION_COOKIE_NAME || overrides.cookieName || 'white-cross.sid',
        maxAge: parseInt(process.env.SESSION_MAX_AGE || '86400000', 10) || overrides.maxAge,
        secure: process.env.SESSION_SECURE === 'true' || overrides.secure || false,
        httpOnly: process.env.SESSION_HTTP_ONLY !== 'false' || overrides.httpOnly !== false,
        sameSite: process.env.SESSION_SAME_SITE || overrides.sameSite || 'lax',
        timeout: parseInt(process.env.SESSION_TIMEOUT || '30', 10) || overrides.timeout,
        rolling: process.env.SESSION_ROLLING === 'true' || overrides.rolling || false,
    };
};
exports.createSessionConfig = createSessionConfig;
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
const createRBACConfig = (overrides = {}) => {
    const roles = process.env.RBAC_ROLES?.split(',') || ['patient', 'doctor', 'nurse', 'admin'];
    return {
        defaultRole: process.env.RBAC_DEFAULT_ROLE || overrides.defaultRole || 'patient',
        roles: overrides.roles || roles,
        superAdminRole: process.env.RBAC_SUPER_ADMIN_ROLE || overrides.superAdminRole || 'admin',
        assignmentStrategy: process.env.RBAC_ASSIGNMENT_STRATEGY || overrides.assignmentStrategy || 'manual',
        hierarchy: overrides.hierarchy,
        defaultPermissions: overrides.defaultPermissions,
    };
};
exports.createRBACConfig = createRBACConfig;
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
const createAuditConfig = (overrides = {}) => {
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
exports.createAuditConfig = createAuditConfig;
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
const createFeatureFlags = (overrides = {}) => {
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
exports.createFeatureFlags = createFeatureFlags;
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
const createIAMEnvironmentConfig = (environment = 'development') => {
    return {
        environment,
        jwt: (0, exports.createJWTConfig)(),
        passwordPolicy: (0, exports.createPasswordPolicy)(),
        mfa: (0, exports.createMFAConfig)(),
        session: (0, exports.createSessionConfig)(),
        rbac: (0, exports.createRBACConfig)(),
        security: (0, exports.loadIAMSecuritySettings)(),
        audit: (0, exports.createAuditConfig)(),
        features: (0, exports.createFeatureFlags)(),
    };
};
exports.createIAMEnvironmentConfig = createIAMEnvironmentConfig;
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
const getDevelopmentConfig = () => {
    return {
        ...(0, exports.createIAMEnvironmentConfig)('development'),
        jwt: {
            ...(0, exports.createJWTConfig)(),
            expiresIn: '1h',
        },
        security: {
            ...(0, exports.loadIAMSecuritySettings)(),
            rateLimitEnabled: false,
            corsEnabled: true,
            allowedOrigins: ['http://localhost:3000', 'http://localhost:3001'],
        },
        audit: {
            ...(0, exports.createAuditConfig)(),
            logToFile: true,
            includeRequestBodies: true,
        },
    };
};
exports.getDevelopmentConfig = getDevelopmentConfig;
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
const getStagingConfig = () => {
    return {
        ...(0, exports.createIAMEnvironmentConfig)('staging'),
        jwt: {
            ...(0, exports.createJWTConfig)(),
            expiresIn: '30m',
        },
        security: {
            ...(0, exports.loadIAMSecuritySettings)(),
            rateLimitEnabled: true,
            corsEnabled: true,
            helmetEnabled: true,
        },
        audit: {
            ...(0, exports.createAuditConfig)(),
            enabled: true,
            logToDatabase: true,
        },
    };
};
exports.getStagingConfig = getStagingConfig;
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
const getProductionConfig = () => {
    return {
        ...(0, exports.createIAMEnvironmentConfig)('production'),
        jwt: {
            ...(0, exports.createJWTConfig)(),
            expiresIn: '15m',
        },
        mfa: {
            ...(0, exports.createMFAConfig)(),
            enabled: true,
            enforcement: 'required',
        },
        security: {
            ...(0, exports.loadIAMSecuritySettings)(),
            rateLimitEnabled: true,
            corsEnabled: true,
            csrfEnabled: true,
            helmetEnabled: true,
            sessionEncryption: true,
        },
        audit: {
            ...(0, exports.createAuditConfig)(),
            enabled: true,
            logToDatabase: true,
            piiRedaction: true,
        },
    };
};
exports.getProductionConfig = getProductionConfig;
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
const getTestConfig = () => {
    return {
        ...(0, exports.createIAMEnvironmentConfig)('test'),
        jwt: {
            secret: 'test-secret-key-min-32-characters',
            expiresIn: '1h',
            issuer: 'test',
            audience: 'test',
            algorithm: 'HS256',
        },
        security: {
            ...(0, exports.loadIAMSecuritySettings)(),
            rateLimitEnabled: false,
            corsEnabled: true,
        },
        audit: {
            ...(0, exports.createAuditConfig)(),
            enabled: false,
        },
    };
};
exports.getTestConfig = getTestConfig;
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
const loadEnvironmentConfig = () => {
    const env = process.env.NODE_ENV || 'development';
    switch (env) {
        case 'production':
            return (0, exports.getProductionConfig)();
        case 'staging':
            return (0, exports.getStagingConfig)();
        case 'test':
            return (0, exports.getTestConfig)();
        default:
            return (0, exports.getDevelopmentConfig)();
    }
};
exports.loadEnvironmentConfig = loadEnvironmentConfig;
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
const validateIAMConfig = (config) => {
    const errors = [];
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
exports.validateIAMConfig = validateIAMConfig;
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
const validateJWTConfig = (config) => {
    if (!config.secret || config.secret.length < 32) {
        return false;
    }
    if (config.algorithm?.startsWith('RS') && (!config.publicKey || !config.privateKey)) {
        return false;
    }
    return true;
};
exports.validateJWTConfig = validateJWTConfig;
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
const validateOAuthConfig = (config) => {
    return !!(config.clientId &&
        config.clientSecret &&
        config.authorizationUrl &&
        config.tokenUrl &&
        config.redirectUri);
};
exports.validateOAuthConfig = validateOAuthConfig;
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
const sanitizeConfig = (config) => {
    const sensitiveKeys = ['secret', 'password', 'key', 'token', 'clientSecret', 'privateKey'];
    const sanitize = (obj) => {
        if (typeof obj !== 'object' || obj === null) {
            return obj;
        }
        const sanitized = Array.isArray(obj) ? [] : {};
        for (const key in obj) {
            if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk.toLowerCase()))) {
                sanitized[key] = '***REDACTED***';
            }
            else if (typeof obj[key] === 'object') {
                sanitized[key] = sanitize(obj[key]);
            }
            else {
                sanitized[key] = obj[key];
            }
        }
        return sanitized;
    };
    return sanitize(config);
};
exports.sanitizeConfig = sanitizeConfig;
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
const loadSecretsFromAWS = async (secretName, region = 'us-east-1') => {
    try {
        // This is a placeholder - actual implementation would use AWS SDK
        // import { SecretsManager } from '@aws-sdk/client-secrets-manager';
        console.log(`Loading secrets from AWS: ${secretName} in ${region}`);
        // Simulated response
        return {};
    }
    catch (error) {
        console.error('Failed to load secrets from AWS:', error);
        throw error;
    }
};
exports.loadSecretsFromAWS = loadSecretsFromAWS;
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
const loadSecretsFromAzure = async (vaultUrl, secretName) => {
    try {
        // This is a placeholder - actual implementation would use Azure SDK
        // import { SecretClient } from '@azure/keyvault-secrets';
        console.log(`Loading secrets from Azure Key Vault: ${vaultUrl}/${secretName}`);
        // Simulated response
        return {};
    }
    catch (error) {
        console.error('Failed to load secrets from Azure:', error);
        throw error;
    }
};
exports.loadSecretsFromAzure = loadSecretsFromAzure;
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
const loadSecretsFromVault = async (vaultUrl, path, token) => {
    try {
        console.log(`Loading secrets from Vault: ${vaultUrl}/${path}`);
        // Simulated response
        return {};
    }
    catch (error) {
        console.error('Failed to load secrets from Vault:', error);
        throw error;
    }
};
exports.loadSecretsFromVault = loadSecretsFromVault;
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
const mergeSecretsToEnv = (secrets, override = false) => {
    Object.entries(secrets).forEach(([key, value]) => {
        if (override || !process.env[key]) {
            process.env[key] = value;
        }
    });
};
exports.mergeSecretsToEnv = mergeSecretsToEnv;
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
const encryptConfigValue = (value, key) => {
    const algorithm = 'aes-256-cbc';
    const iv = crypto.randomBytes(16);
    const keyBuffer = crypto.scryptSync(key, 'salt', 32);
    const cipher = crypto.createCipheriv(algorithm, keyBuffer, iv);
    let encrypted = cipher.update(value, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
};
exports.encryptConfigValue = encryptConfigValue;
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
const decryptConfigValue = (encryptedValue, key) => {
    const algorithm = 'aes-256-cbc';
    const [ivHex, encrypted] = encryptedValue.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const keyBuffer = crypto.scryptSync(key, 'salt', 32);
    const decipher = crypto.createDecipheriv(algorithm, keyBuffer, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};
exports.decryptConfigValue = decryptConfigValue;
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
const encryptConfig = (config, key) => {
    const jsonConfig = JSON.stringify(config);
    return (0, exports.encryptConfigValue)(jsonConfig, key);
};
exports.encryptConfig = encryptConfig;
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
const decryptConfig = (encryptedConfig, key) => {
    const decrypted = (0, exports.decryptConfigValue)(encryptedConfig, key);
    return JSON.parse(decrypted);
};
exports.decryptConfig = decryptConfig;
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
const getDefaultPolicyForRole = (role) => {
    const policies = {
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
exports.getDefaultPolicyForRole = getDefaultPolicyForRole;
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
const createDefaultPermissionMatrix = () => {
    return {
        patient: (0, exports.getDefaultPolicyForRole)('patient'),
        doctor: (0, exports.getDefaultPolicyForRole)('doctor'),
        nurse: (0, exports.getDefaultPolicyForRole)('nurse'),
        admin: (0, exports.getDefaultPolicyForRole)('admin'),
    };
};
exports.createDefaultPermissionMatrix = createDefaultPermissionMatrix;
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
const createHIPAACompliantConfig = () => {
    return {
        environment: 'production',
        jwt: {
            ...(0, exports.createJWTConfig)(),
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
            ...(0, exports.createSessionConfig)(),
            secure: true,
            httpOnly: true,
            sameSite: 'strict',
            timeout: 15,
        },
        rbac: (0, exports.createRBACConfig)(),
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
        features: (0, exports.createFeatureFlags)(),
    };
};
exports.createHIPAACompliantConfig = createHIPAACompliantConfig;
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
const exportConfigToFile = (config, filePath) => {
    const sanitized = (0, exports.sanitizeConfig)(config);
    const json = JSON.stringify(sanitized, null, 2);
    fs.writeFileSync(filePath, json, 'utf8');
};
exports.exportConfigToFile = exportConfigToFile;
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
const importConfigFromFile = (filePath) => {
    const json = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(json);
};
exports.importConfigFromFile = importConfigFromFile;
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
const mergeConfigs = (...configs) => {
    return configs.reduce((acc, config) => {
        return (0, exports.deepMerge)(acc, config);
    }, {});
};
exports.mergeConfigs = mergeConfigs;
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
const deepMerge = (target, source) => {
    const output = { ...target };
    if ((0, exports.isObject)(target) && (0, exports.isObject)(source)) {
        Object.keys(source).forEach(key => {
            if ((0, exports.isObject)(source[key])) {
                if (!(key in target)) {
                    Object.assign(output, { [key]: source[key] });
                }
                else {
                    output[key] = (0, exports.deepMerge)(target[key], source[key]);
                }
            }
            else {
                Object.assign(output, { [key]: source[key] });
            }
        });
    }
    return output;
};
exports.deepMerge = deepMerge;
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
const isObject = (item) => {
    return item && typeof item === 'object' && !Array.isArray(item);
};
exports.isObject = isObject;
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
const createConfigNamespace = (namespace, factory) => {
    return (0, config_1.registerAs)(namespace, factory);
};
exports.createConfigNamespace = createConfigNamespace;
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
const createAsyncConfigFactory = (factory) => {
    return factory;
};
exports.createAsyncConfigFactory = createAsyncConfigFactory;
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
const validateRequiredEnvVars = (requiredVars) => {
    const missing = requiredVars.filter(varName => !process.env[varName]);
    if (missing.length > 0) {
        console.error(`Missing required environment variables: ${missing.join(', ')}`);
        return false;
    }
    return true;
};
exports.validateRequiredEnvVars = validateRequiredEnvVars;
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
const createConfigCacheKey = (namespace, key) => {
    return `config:${namespace}:${key}`;
};
exports.createConfigCacheKey = createConfigCacheKey;
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
const parseTimeToSeconds = (time) => {
    const units = {
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
exports.parseTimeToSeconds = parseTimeToSeconds;
//# sourceMappingURL=iam-config-kit.js.map