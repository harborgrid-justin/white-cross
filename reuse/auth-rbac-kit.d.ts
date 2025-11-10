/**
 * @fileoverview Authentication, Authorization & RBAC Comprehensive Kit
 * @module reuse/auth-rbac-kit
 * @description Production-ready authentication, authorization, RBAC, JWT, and OAuth utilities
 * for enterprise NestJS applications with deep Sequelize integration and HIPAA compliance.
 *
 * Key Features:
 * - JWT token generation, validation, and refresh with rotation
 * - OAuth 2.0 flows (Authorization Code, Client Credentials, PKCE)
 * - Role-Based Access Control (RBAC) with hierarchy
 * - Permission checking and policy enforcement
 * - Session management with Redis integration
 * - Multi-factor authentication (TOTP, SMS, Email)
 * - API key authentication and management
 * - Password hashing with bcrypt/argon2
 * - User context extraction and validation
 * - Token blacklisting and revocation
 * - Login attempt tracking and account lockout
 * - Social authentication (Google, Facebook, Microsoft)
 * - Passwordless authentication
 * - Biometric authentication support
 * - Audit logging for all auth events
 *
 * @target Sequelize v6.x, NestJS 10.x, Node 18+, TypeScript 5.x
 *
 * @security
 * - HIPAA-compliant authentication patterns
 * - Secure token storage and rotation
 * - Password strength enforcement (NIST 800-63B)
 * - Automatic session timeout and cleanup
 * - Brute force protection
 * - Multi-factor authentication support
 * - Audit trail for all authentication events
 *
 * @example Basic JWT usage
 * ```typescript
 * import { generateJWT, verifyJWT, refreshAccessToken } from './auth-rbac-kit';
 *
 * // Generate access token
 * const token = await generateJWT({ userId: '123', email: 'user@example.com' }, config);
 *
 * // Verify token
 * const payload = await verifyJWT(token, config);
 *
 * // Refresh token
 * const newTokens = await refreshAccessToken(refreshToken, User, RefreshToken);
 * ```
 *
 * @example RBAC usage
 * ```typescript
 * import { checkPermission, getUserRoles, hasAnyRole } from './auth-rbac-kit';
 *
 * // Check permission
 * const canRead = await checkPermission(userId, 'patient:read', UserRole, RolePermission);
 *
 * // Check roles
 * const isDoctor = await hasAnyRole(userId, ['doctor', 'senior-doctor'], UserRole);
 * ```
 *
 * LOC: AUTHRB8901X567
 * UPSTREAM: @nestjs/jwt, @nestjs/passport, bcrypt, argon2, speakeasy, sequelize
 * DOWNSTREAM: Auth services, guards, middleware, API endpoints
 *
 * @version 1.0.0
 * @since 2025-11-08
 */
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Model, ModelStatic, Transaction, Sequelize } from 'sequelize';
/**
 * @interface JWTPayload
 * @description JWT token payload structure
 */
export interface JWTPayload {
    sub: string;
    email?: string;
    role?: string;
    roles?: string[];
    permissions?: string[];
    type?: 'access' | 'refresh' | 'api-key';
    sessionId?: string;
    deviceId?: string;
    iat?: number;
    exp?: number;
    nbf?: number;
    jti?: string;
    iss?: string;
    aud?: string;
    [key: string]: any;
}
/**
 * @interface JWTConfig
 * @description JWT configuration options
 */
export interface JWTConfig {
    secret: string;
    publicKey?: string;
    privateKey?: string;
    expiresIn?: string | number;
    notBefore?: number;
    algorithm?: 'HS256' | 'HS384' | 'HS512' | 'RS256' | 'RS384' | 'RS512';
    issuer?: string;
    audience?: string | string[];
    jwtid?: string;
    subject?: string;
}
/**
 * @interface RefreshTokenConfig
 * @description Refresh token configuration
 */
export interface RefreshTokenConfig {
    userId: string;
    deviceId?: string;
    sessionId?: string;
    familyId?: string;
    expiresIn?: number;
    metadata?: Record<string, any>;
}
/**
 * @interface OAuth2Config
 * @description OAuth 2.0 configuration
 */
export interface OAuth2Config {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    authorizationURL: string;
    tokenURL: string;
    scope?: string[];
    state?: string;
    responseType?: 'code' | 'token';
    grantType?: 'authorization_code' | 'client_credentials' | 'refresh_token' | 'password';
    pkce?: boolean;
}
/**
 * @interface OAuth2TokenResponse
 * @description OAuth 2.0 token response
 */
export interface OAuth2TokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token?: string;
    scope?: string;
    id_token?: string;
}
/**
 * @interface MFAConfig
 * @description Multi-factor authentication configuration
 */
export interface MFAConfig {
    secret?: string;
    type: 'totp' | 'sms' | 'email' | 'push';
    window?: number;
    step?: number;
    algorithm?: 'sha1' | 'sha256' | 'sha512';
    digits?: number;
}
/**
 * @interface TOTPResult
 * @description TOTP setup result
 */
export interface TOTPResult {
    secret: string;
    qrCode: string;
    uri: string;
    backupCodes: string[];
}
/**
 * @interface SessionConfig
 * @description Session configuration
 */
export interface SessionConfig {
    userId: string;
    ipAddress?: string;
    userAgent?: string;
    expiresIn?: number;
    metadata?: Record<string, any>;
}
/**
 * @interface ApiKeyConfig
 * @description API key configuration
 */
export interface ApiKeyConfig {
    userId?: string;
    prefix?: string;
    length?: number;
    expiresIn?: number;
    permissions?: string[];
    scopes?: string[];
    rateLimit?: number;
    metadata?: Record<string, any>;
}
/**
 * @interface PasswordPolicy
 * @description Password policy configuration
 */
export interface PasswordPolicy {
    minLength?: number;
    maxLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumbers?: boolean;
    requireSpecialChars?: boolean;
    preventCommonPasswords?: boolean;
    preventUserInfo?: boolean;
    maxRepeatingChars?: number;
}
/**
 * @interface RoleHierarchy
 * @description Role hierarchy definition
 */
export interface RoleHierarchy {
    [role: string]: string[];
}
/**
 * @interface PermissionDefinition
 * @description Permission definition
 */
export interface PermissionDefinition {
    resource: string;
    action: string;
    scope?: string;
    conditions?: Record<string, any>;
}
export declare const JWTPayloadSchema: any;
export declare const PasswordPolicySchema: any;
export declare const ApiKeySchema: any;
/**
 * @interface UserModel
 * @description User model interface
 */
export interface UserModel extends Model {
    id: string;
    email: string;
    passwordHash?: string;
    firstName?: string;
    lastName?: string;
    isActive: boolean;
    isEmailVerified: boolean;
    emailVerificationToken?: string;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    passwordChangedAt?: Date;
    failedLoginAttempts: number;
    lockedUntil?: Date;
    lastLoginAt?: Date;
    lastLoginIp?: string;
    mfaEnabled: boolean;
    mfaSecret?: string;
    mfaBackupCodes?: string[];
    refreshTokens?: RefreshTokenModel[];
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * @function defineUserModel
 * @description Defines the User Sequelize model
 */
export declare function defineUserModel(sequelize: Sequelize): ModelStatic<UserModel>;
/**
 * @interface RefreshTokenModel
 * @description Refresh token model interface
 */
export interface RefreshTokenModel extends Model {
    id: string;
    userId: string;
    tokenHash: string;
    familyId?: string;
    deviceId?: string;
    sessionId?: string;
    ipAddress?: string;
    userAgent?: string;
    expiresAt: Date;
    isRevoked: boolean;
    revokedAt?: Date;
    revokedReason?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
}
/**
 * @function defineRefreshTokenModel
 * @description Defines the RefreshToken Sequelize model
 */
export declare function defineRefreshTokenModel(sequelize: Sequelize): ModelStatic<RefreshTokenModel>;
/**
 * @interface SessionModel
 * @description Session model interface
 */
export interface SessionModel extends Model {
    id: string;
    userId: string;
    sessionToken: string;
    ipAddress?: string;
    userAgent?: string;
    lastActivityAt: Date;
    expiresAt: Date;
    isActive: boolean;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * @function defineSessionModel
 * @description Defines the Session Sequelize model
 */
export declare function defineSessionModel(sequelize: Sequelize): ModelStatic<SessionModel>;
/**
 * @interface ApiKeyModel
 * @description API key model interface
 */
export interface ApiKeyModel extends Model {
    id: string;
    userId?: string;
    name: string;
    keyHash: string;
    prefix: string;
    permissions: string[];
    scopes: string[];
    rateLimit?: number;
    lastUsedAt?: Date;
    expiresAt?: Date;
    isActive: boolean;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * @function defineApiKeyModel
 * @description Defines the ApiKey Sequelize model
 */
export declare function defineApiKeyModel(sequelize: Sequelize): ModelStatic<ApiKeyModel>;
/**
 * @interface RoleModel
 * @description Role model interface
 */
export interface RoleModel extends Model {
    id: string;
    name: string;
    description?: string;
    priority: number;
    inherits?: string[];
    isSystem: boolean;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * @function defineRoleModel
 * @description Defines the Role Sequelize model
 */
export declare function defineRoleModel(sequelize: Sequelize): ModelStatic<RoleModel>;
/**
 * @interface UserRoleModel
 * @description User-role association model interface
 */
export interface UserRoleModel extends Model {
    id: string;
    userId: string;
    roleId: string;
    assignedBy?: string;
    expiresAt?: Date;
    isActive: boolean;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * @function defineUserRoleModel
 * @description Defines the UserRole Sequelize model
 */
export declare function defineUserRoleModel(sequelize: Sequelize): ModelStatic<UserRoleModel>;
/**
 * @interface PermissionModel
 * @description Permission model interface
 */
export interface PermissionModel extends Model {
    id: string;
    name: string;
    resource: string;
    action: string;
    scope?: string;
    conditions?: Record<string, any>;
    description?: string;
    isSystem: boolean;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * @function definePermissionModel
 * @description Defines the Permission Sequelize model
 */
export declare function definePermissionModel(sequelize: Sequelize): ModelStatic<PermissionModel>;
/**
 * @interface RolePermissionModel
 * @description Role-permission association model interface
 */
export interface RolePermissionModel extends Model {
    id: string;
    roleId: string;
    permissionId: string;
    isGranted: boolean;
    createdAt: Date;
}
/**
 * @function defineRolePermissionModel
 * @description Defines the RolePermission Sequelize model
 */
export declare function defineRolePermissionModel(sequelize: Sequelize): ModelStatic<RolePermissionModel>;
/**
 * @interface LoginAttemptModel
 * @description Login attempt tracking model interface
 */
export interface LoginAttemptModel extends Model {
    id: string;
    userId?: string;
    email: string;
    ipAddress: string;
    userAgent?: string;
    success: boolean;
    failureReason?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
}
/**
 * @function defineLoginAttemptModel
 * @description Defines the LoginAttempt Sequelize model
 */
export declare function defineLoginAttemptModel(sequelize: Sequelize): ModelStatic<LoginAttemptModel>;
/**
 * @function generateJWT
 * @description Generates a JWT access token with custom payload
 *
 * @param {JWTPayload} payload - Token payload
 * @param {JWTConfig} config - JWT configuration
 * @returns {Promise<string>} Signed JWT token
 *
 * @example
 * ```typescript
 * const token = await generateJWT(
 *   { sub: 'user-123', email: 'user@example.com', roles: ['doctor'] },
 *   { secret: 'secret-key', expiresIn: '15m', issuer: 'white-cross' }
 * );
 * ```
 */
export declare function generateJWT(payload: JWTPayload, config: JWTConfig): Promise<string>;
/**
 * @function verifyJWT
 * @description Verifies and decodes a JWT token
 *
 * @param {string} token - JWT token to verify
 * @param {JWTConfig} config - JWT configuration
 * @returns {Promise<JWTPayload>} Decoded payload
 *
 * @example
 * ```typescript
 * try {
 *   const payload = await verifyJWT(token, { secret: 'secret-key' });
 *   console.log('User ID:', payload.sub);
 * } catch (error) {
 *   console.error('Invalid token:', error.message);
 * }
 * ```
 */
export declare function verifyJWT(token: string, config: JWTConfig): Promise<JWTPayload>;
/**
 * @function generateRefreshToken
 * @description Generates a refresh token and stores it in the database
 *
 * @param {ModelStatic<RefreshTokenModel>} RefreshToken - RefreshToken model
 * @param {RefreshTokenConfig} config - Refresh token configuration
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<{ token: string; model: RefreshTokenModel }>} Token and database record
 *
 * @example
 * ```typescript
 * const { token, model } = await generateRefreshToken(RefreshToken, {
 *   userId: 'user-123',
 *   deviceId: 'device-456',
 *   expiresIn: 7 * 24 * 60 * 60 * 1000 // 7 days
 * });
 * ```
 */
export declare function generateRefreshToken(RefreshToken: ModelStatic<RefreshTokenModel>, config: RefreshTokenConfig, transaction?: Transaction): Promise<{
    token: string;
    model: RefreshTokenModel;
}>;
/**
 * @function refreshAccessToken
 * @description Refreshes an access token using a refresh token
 *
 * @param {string} refreshToken - Refresh token
 * @param {ModelStatic<UserModel>} User - User model
 * @param {ModelStatic<RefreshTokenModel>} RefreshToken - RefreshToken model
 * @param {JWTConfig} jwtConfig - JWT configuration
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<{ accessToken: string; refreshToken: string }>} New tokens
 *
 * @example
 * ```typescript
 * const tokens = await refreshAccessToken(
 *   oldRefreshToken,
 *   User,
 *   RefreshToken,
 *   { secret: 'secret-key', expiresIn: '15m' }
 * );
 * ```
 */
export declare function refreshAccessToken(refreshToken: string, User: ModelStatic<UserModel>, RefreshToken: ModelStatic<RefreshTokenModel>, jwtConfig: JWTConfig, transaction?: Transaction): Promise<{
    accessToken: string;
    refreshToken: string;
    user: UserModel;
}>;
/**
 * @function revokeRefreshToken
 * @description Revokes a refresh token
 *
 * @param {ModelStatic<RefreshTokenModel>} RefreshToken - RefreshToken model
 * @param {string} token - Refresh token to revoke
 * @param {string} reason - Revocation reason
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await revokeRefreshToken(RefreshToken, token, 'user_logout');
 * ```
 */
export declare function revokeRefreshToken(RefreshToken: ModelStatic<RefreshTokenModel>, token: string, reason: string, transaction?: Transaction): Promise<void>;
/**
 * @function revokeAllUserTokens
 * @description Revokes all refresh tokens for a user
 *
 * @param {ModelStatic<RefreshTokenModel>} RefreshToken - RefreshToken model
 * @param {string} userId - User ID
 * @param {string} reason - Revocation reason
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<number>} Number of revoked tokens
 *
 * @example
 * ```typescript
 * await revokeAllUserTokens(RefreshToken, 'user-123', 'password_change');
 * ```
 */
export declare function revokeAllUserTokens(RefreshToken: ModelStatic<RefreshTokenModel>, userId: string, reason: string, transaction?: Transaction): Promise<number>;
/**
 * @function cleanupExpiredTokens
 * @description Removes expired refresh tokens from the database
 *
 * @param {ModelStatic<RefreshTokenModel>} RefreshToken - RefreshToken model
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<number>} Number of deleted tokens
 *
 * @example
 * ```typescript
 * const deleted = await cleanupExpiredTokens(RefreshToken);
 * console.log(`Cleaned up ${deleted} expired tokens`);
 * ```
 */
export declare function cleanupExpiredTokens(RefreshToken: ModelStatic<RefreshTokenModel>, transaction?: Transaction): Promise<number>;
/**
 * @function hashPassword
 * @description Hashes a password using bcrypt
 *
 * @param {string} password - Plain text password
 * @param {number} rounds - Salt rounds (default: 12)
 * @returns {Promise<string>} Hashed password
 *
 * @example
 * ```typescript
 * const hash = await hashPassword('mySecurePassword123!');
 * ```
 */
export declare function hashPassword(password: string, rounds?: number): Promise<string>;
/**
 * @function hashPasswordArgon2
 * @description Hashes a password using Argon2
 *
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 *
 * @example
 * ```typescript
 * const hash = await hashPasswordArgon2('mySecurePassword123!');
 * ```
 */
export declare function hashPasswordArgon2(password: string): Promise<string>;
/**
 * @function verifyPassword
 * @description Verifies a password against a bcrypt hash
 *
 * @param {string} password - Plain text password
 * @param {string} hash - Password hash
 * @returns {Promise<boolean>} True if password matches
 *
 * @example
 * ```typescript
 * const isValid = await verifyPassword('password123', storedHash);
 * if (isValid) console.log('Password correct!');
 * ```
 */
export declare function verifyPassword(password: string, hash: string): Promise<boolean>;
/**
 * @function verifyPasswordArgon2
 * @description Verifies a password against an Argon2 hash
 *
 * @param {string} password - Plain text password
 * @param {string} hash - Password hash
 * @returns {Promise<boolean>} True if password matches
 *
 * @example
 * ```typescript
 * const isValid = await verifyPasswordArgon2('password123', storedHash);
 * ```
 */
export declare function verifyPasswordArgon2(password: string, hash: string): Promise<boolean>;
/**
 * @function validatePasswordPolicy
 * @description Validates a password against a policy
 *
 * @param {string} password - Password to validate
 * @param {PasswordPolicy} policy - Password policy
 * @param {object} userInfo - User information to prevent reuse
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const result = validatePasswordPolicy('MyPass123!', {
 *   minLength: 8,
 *   requireUppercase: true,
 *   requireNumbers: true,
 *   requireSpecialChars: true
 * });
 * if (!result.valid) console.error(result.errors);
 * ```
 */
export declare function validatePasswordPolicy(password: string, policy: PasswordPolicy, userInfo?: {
    email?: string;
    firstName?: string;
    lastName?: string;
}): {
    valid: boolean;
    errors: string[];
};
/**
 * @function generatePasswordResetToken
 * @description Generates a secure password reset token
 *
 * @param {ModelStatic<UserModel>} User - User model
 * @param {string} email - User email
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<{ token: string; user: UserModel }>} Reset token and user
 *
 * @example
 * ```typescript
 * const { token, user } = await generatePasswordResetToken(User, 'user@example.com');
 * // Send token via email
 * ```
 */
export declare function generatePasswordResetToken(User: ModelStatic<UserModel>, email: string, transaction?: Transaction): Promise<{
    token: string;
    user: UserModel;
}>;
/**
 * @function resetPassword
 * @description Resets a user's password using a reset token
 *
 * @param {ModelStatic<UserModel>} User - User model
 * @param {string} token - Password reset token
 * @param {string} newPassword - New password
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<UserModel>} Updated user
 *
 * @example
 * ```typescript
 * await resetPassword(User, resetToken, 'newSecurePassword123!');
 * ```
 */
export declare function resetPassword(User: ModelStatic<UserModel>, token: string, newPassword: string, transaction?: Transaction): Promise<UserModel>;
/**
 * @function generateTOTPSecret
 * @description Generates a TOTP secret for MFA
 *
 * @param {string} email - User email
 * @param {string} issuer - Issuer name (e.g., 'White Cross')
 * @returns {Promise<TOTPResult>} TOTP secret, QR code, and backup codes
 *
 * @example
 * ```typescript
 * const mfa = await generateTOTPSecret('user@example.com', 'White Cross');
 * console.log('Secret:', mfa.secret);
 * console.log('QR Code:', mfa.qrCode);
 * ```
 */
export declare function generateTOTPSecret(email: string, issuer?: string): Promise<TOTPResult>;
/**
 * @function verifyTOTP
 * @description Verifies a TOTP code
 *
 * @param {string} token - TOTP code to verify
 * @param {string} secret - TOTP secret
 * @param {number} window - Time window (default: 1)
 * @returns {boolean} True if code is valid
 *
 * @example
 * ```typescript
 * const isValid = verifyTOTP('123456', userMfaSecret);
 * if (isValid) console.log('MFA code verified!');
 * ```
 */
export declare function verifyTOTP(token: string, secret: string, window?: number): boolean;
/**
 * @function enableMFA
 * @description Enables MFA for a user
 *
 * @param {ModelStatic<UserModel>} User - User model
 * @param {string} userId - User ID
 * @param {string} secret - TOTP secret
 * @param {string[]} backupCodes - Backup codes
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<UserModel>} Updated user
 *
 * @example
 * ```typescript
 * const mfa = await generateTOTPSecret('user@example.com');
 * await enableMFA(User, userId, mfa.secret, mfa.backupCodes);
 * ```
 */
export declare function enableMFA(User: ModelStatic<UserModel>, userId: string, secret: string, backupCodes: string[], transaction?: Transaction): Promise<UserModel>;
/**
 * @function disableMFA
 * @description Disables MFA for a user
 *
 * @param {ModelStatic<UserModel>} User - User model
 * @param {string} userId - User ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<UserModel>} Updated user
 *
 * @example
 * ```typescript
 * await disableMFA(User, userId);
 * ```
 */
export declare function disableMFA(User: ModelStatic<UserModel>, userId: string, transaction?: Transaction): Promise<UserModel>;
/**
 * @function verifyBackupCode
 * @description Verifies and consumes an MFA backup code
 *
 * @param {ModelStatic<UserModel>} User - User model
 * @param {string} userId - User ID
 * @param {string} code - Backup code
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<boolean>} True if code is valid
 *
 * @example
 * ```typescript
 * const isValid = await verifyBackupCode(User, userId, '1a2b3c4d');
 * ```
 */
export declare function verifyBackupCode(User: ModelStatic<UserModel>, userId: string, code: string, transaction?: Transaction): Promise<boolean>;
/**
 * @function createSession
 * @description Creates a new user session
 *
 * @param {ModelStatic<SessionModel>} Session - Session model
 * @param {SessionConfig} config - Session configuration
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<SessionModel>} Created session
 *
 * @example
 * ```typescript
 * const session = await createSession(Session, {
 *   userId: 'user-123',
 *   ipAddress: '192.168.1.1',
 *   userAgent: 'Mozilla/5.0...',
 *   expiresIn: 30 * 60 * 1000 // 30 minutes
 * });
 * ```
 */
export declare function createSession(Session: ModelStatic<SessionModel>, config: SessionConfig, transaction?: Transaction): Promise<SessionModel>;
/**
 * @function validateSession
 * @description Validates and updates a session
 *
 * @param {ModelStatic<SessionModel>} Session - Session model
 * @param {string} sessionToken - Session token
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<SessionModel | null>} Session if valid, null otherwise
 *
 * @example
 * ```typescript
 * const session = await validateSession(Session, sessionToken);
 * if (session) console.log('Session valid for user:', session.userId);
 * ```
 */
export declare function validateSession(Session: ModelStatic<SessionModel>, sessionToken: string, transaction?: Transaction): Promise<SessionModel | null>;
/**
 * @function destroySession
 * @description Destroys a user session
 *
 * @param {ModelStatic<SessionModel>} Session - Session model
 * @param {string} sessionToken - Session token
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await destroySession(Session, sessionToken);
 * ```
 */
export declare function destroySession(Session: ModelStatic<SessionModel>, sessionToken: string, transaction?: Transaction): Promise<void>;
/**
 * @function destroyAllUserSessions
 * @description Destroys all sessions for a user
 *
 * @param {ModelStatic<SessionModel>} Session - Session model
 * @param {string} userId - User ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<number>} Number of destroyed sessions
 *
 * @example
 * ```typescript
 * await destroyAllUserSessions(Session, userId);
 * ```
 */
export declare function destroyAllUserSessions(Session: ModelStatic<SessionModel>, userId: string, transaction?: Transaction): Promise<number>;
/**
 * @function cleanupExpiredSessions
 * @description Removes expired sessions from the database
 *
 * @param {ModelStatic<SessionModel>} Session - Session model
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<number>} Number of deleted sessions
 *
 * @example
 * ```typescript
 * const deleted = await cleanupExpiredSessions(Session);
 * console.log(`Cleaned up ${deleted} expired sessions`);
 * ```
 */
export declare function cleanupExpiredSessions(Session: ModelStatic<SessionModel>, transaction?: Transaction): Promise<number>;
/**
 * @function generateApiKey
 * @description Generates a new API key
 *
 * @param {ModelStatic<ApiKeyModel>} ApiKey - ApiKey model
 * @param {ApiKeyConfig} config - API key configuration
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<{ key: string; model: ApiKeyModel }>} API key and database record
 *
 * @example
 * ```typescript
 * const { key, model } = await generateApiKey(ApiKey, {
 *   userId: 'user-123',
 *   prefix: 'wc',
 *   permissions: ['read:patients', 'write:appointments'],
 *   expiresIn: 365 * 24 * 60 * 60 * 1000 // 1 year
 * });
 * ```
 */
export declare function generateApiKey(ApiKey: ModelStatic<ApiKeyModel>, config: ApiKeyConfig, transaction?: Transaction): Promise<{
    key: string;
    model: ApiKeyModel;
}>;
/**
 * @function validateApiKey
 * @description Validates an API key
 *
 * @param {ModelStatic<ApiKeyModel>} ApiKey - ApiKey model
 * @param {string} key - API key to validate
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<ApiKeyModel | null>} API key record if valid, null otherwise
 *
 * @example
 * ```typescript
 * const apiKey = await validateApiKey(ApiKey, providedKey);
 * if (apiKey) console.log('Valid API key with permissions:', apiKey.permissions);
 * ```
 */
export declare function validateApiKey(ApiKey: ModelStatic<ApiKeyModel>, key: string, transaction?: Transaction): Promise<ApiKeyModel | null>;
/**
 * @function revokeApiKey
 * @description Revokes an API key
 *
 * @param {ModelStatic<ApiKeyModel>} ApiKey - ApiKey model
 * @param {string} keyId - API key ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await revokeApiKey(ApiKey, 'key-id-123');
 * ```
 */
export declare function revokeApiKey(ApiKey: ModelStatic<ApiKeyModel>, keyId: string, transaction?: Transaction): Promise<void>;
/**
 * @function checkPermission
 * @description Checks if a user has a specific permission
 *
 * @param {string} userId - User ID
 * @param {string} permissionName - Permission name (e.g., 'patient:read')
 * @param {ModelStatic<UserRoleModel>} UserRole - UserRole model
 * @param {ModelStatic<RolePermissionModel>} RolePermission - RolePermission model
 * @param {ModelStatic<PermissionModel>} Permission - Permission model
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<boolean>} True if user has permission
 *
 * @example
 * ```typescript
 * const canRead = await checkPermission(userId, 'patient:read', UserRole, RolePermission, Permission);
 * ```
 */
export declare function checkPermission(userId: string, permissionName: string, UserRole: ModelStatic<UserRoleModel>, RolePermission: ModelStatic<RolePermissionModel>, Permission: ModelStatic<PermissionModel>, transaction?: Transaction): Promise<boolean>;
/**
 * @function hasAnyRole
 * @description Checks if a user has any of the specified roles
 *
 * @param {string} userId - User ID
 * @param {string[]} roleNames - Role names to check
 * @param {ModelStatic<UserRoleModel>} UserRole - UserRole model
 * @param {ModelStatic<RoleModel>} Role - Role model
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<boolean>} True if user has any of the roles
 *
 * @example
 * ```typescript
 * const isDoctor = await hasAnyRole(userId, ['doctor', 'senior-doctor'], UserRole, Role);
 * ```
 */
export declare function hasAnyRole(userId: string, roleNames: string[], UserRole: ModelStatic<UserRoleModel>, Role: ModelStatic<RoleModel>, transaction?: Transaction): Promise<boolean>;
/**
 * @function hasAllRoles
 * @description Checks if a user has all of the specified roles
 *
 * @param {string} userId - User ID
 * @param {string[]} roleNames - Role names to check
 * @param {ModelStatic<UserRoleModel>} UserRole - UserRole model
 * @param {ModelStatic<RoleModel>} Role - Role model
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<boolean>} True if user has all roles
 *
 * @example
 * ```typescript
 * const hasAll = await hasAllRoles(userId, ['doctor', 'researcher'], UserRole, Role);
 * ```
 */
export declare function hasAllRoles(userId: string, roleNames: string[], UserRole: ModelStatic<UserRoleModel>, Role: ModelStatic<RoleModel>, transaction?: Transaction): Promise<boolean>;
/**
 * @function getUserRoles
 * @description Gets all active roles for a user
 *
 * @param {string} userId - User ID
 * @param {ModelStatic<UserRoleModel>} UserRole - UserRole model
 * @param {ModelStatic<RoleModel>} Role - Role model
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<RoleModel[]>} User's roles
 *
 * @example
 * ```typescript
 * const roles = await getUserRoles(userId, UserRole, Role);
 * console.log('User roles:', roles.map(r => r.name));
 * ```
 */
export declare function getUserRoles(userId: string, UserRole: ModelStatic<UserRoleModel>, Role: ModelStatic<RoleModel>, transaction?: Transaction): Promise<RoleModel[]>;
/**
 * @function getUserPermissions
 * @description Gets all effective permissions for a user
 *
 * @param {string} userId - User ID
 * @param {ModelStatic<UserRoleModel>} UserRole - UserRole model
 * @param {ModelStatic<RolePermissionModel>} RolePermission - RolePermission model
 * @param {ModelStatic<PermissionModel>} Permission - Permission model
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<PermissionModel[]>} User's permissions
 *
 * @example
 * ```typescript
 * const permissions = await getUserPermissions(userId, UserRole, RolePermission, Permission);
 * console.log('User can:', permissions.map(p => `${p.resource}:${p.action}`));
 * ```
 */
export declare function getUserPermissions(userId: string, UserRole: ModelStatic<UserRoleModel>, RolePermission: ModelStatic<RolePermissionModel>, Permission: ModelStatic<PermissionModel>, transaction?: Transaction): Promise<PermissionModel[]>;
/**
 * @function assignRoleToUser
 * @description Assigns a role to a user
 *
 * @param {string} userId - User ID
 * @param {string} roleName - Role name
 * @param {ModelStatic<UserRoleModel>} UserRole - UserRole model
 * @param {ModelStatic<RoleModel>} Role - Role model
 * @param {object} options - Assignment options
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<UserRoleModel>} Created user role
 *
 * @example
 * ```typescript
 * await assignRoleToUser(userId, 'doctor', UserRole, Role, {
 *   assignedBy: 'admin-id',
 *   expiresAt: new Date('2025-12-31')
 * });
 * ```
 */
export declare function assignRoleToUser(userId: string, roleName: string, UserRole: ModelStatic<UserRoleModel>, Role: ModelStatic<RoleModel>, options?: {
    assignedBy?: string;
    expiresAt?: Date;
    metadata?: Record<string, any>;
}, transaction?: Transaction): Promise<UserRoleModel>;
/**
 * @function revokeRoleFromUser
 * @description Revokes a role from a user
 *
 * @param {string} userId - User ID
 * @param {string} roleName - Role name
 * @param {ModelStatic<UserRoleModel>} UserRole - UserRole model
 * @param {ModelStatic<RoleModel>} Role - Role model
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await revokeRoleFromUser(userId, 'temp-access', UserRole, Role);
 * ```
 */
export declare function revokeRoleFromUser(userId: string, roleName: string, UserRole: ModelStatic<UserRoleModel>, Role: ModelStatic<RoleModel>, transaction?: Transaction): Promise<void>;
/**
 * @function trackLoginAttempt
 * @description Tracks a login attempt (success or failure)
 *
 * @param {ModelStatic<LoginAttemptModel>} LoginAttempt - LoginAttempt model
 * @param {object} attempt - Login attempt data
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<LoginAttemptModel>} Created login attempt record
 *
 * @example
 * ```typescript
 * await trackLoginAttempt(LoginAttempt, {
 *   userId: 'user-123',
 *   email: 'user@example.com',
 *   ipAddress: '192.168.1.1',
 *   success: true
 * });
 * ```
 */
export declare function trackLoginAttempt(LoginAttempt: ModelStatic<LoginAttemptModel>, attempt: {
    userId?: string;
    email: string;
    ipAddress: string;
    userAgent?: string;
    success: boolean;
    failureReason?: string;
    metadata?: Record<string, any>;
}, transaction?: Transaction): Promise<LoginAttemptModel>;
/**
 * @function getRecentLoginAttempts
 * @description Gets recent login attempts for a user
 *
 * @param {ModelStatic<LoginAttemptModel>} LoginAttempt - LoginAttempt model
 * @param {string} email - User email
 * @param {number} minutes - Time window in minutes
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<LoginAttemptModel[]>} Recent login attempts
 *
 * @example
 * ```typescript
 * const attempts = await getRecentLoginAttempts(LoginAttempt, 'user@example.com', 15);
 * const failedAttempts = attempts.filter(a => !a.success);
 * ```
 */
export declare function getRecentLoginAttempts(LoginAttempt: ModelStatic<LoginAttemptModel>, email: string, minutes?: number, transaction?: Transaction): Promise<LoginAttemptModel[]>;
/**
 * @function shouldLockAccount
 * @description Determines if an account should be locked based on failed attempts
 *
 * @param {ModelStatic<LoginAttemptModel>} LoginAttempt - LoginAttempt model
 * @param {string} email - User email
 * @param {number} maxAttempts - Maximum failed attempts allowed
 * @param {number} windowMinutes - Time window in minutes
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<boolean>} True if account should be locked
 *
 * @example
 * ```typescript
 * const shouldLock = await shouldLockAccount(LoginAttempt, 'user@example.com', 5, 15);
 * if (shouldLock) {
 *   await lockUserAccount(User, email, 30);
 * }
 * ```
 */
export declare function shouldLockAccount(LoginAttempt: ModelStatic<LoginAttemptModel>, email: string, maxAttempts?: number, windowMinutes?: number, transaction?: Transaction): Promise<boolean>;
/**
 * @function lockUserAccount
 * @description Locks a user account for a specified duration
 *
 * @param {ModelStatic<UserModel>} User - User model
 * @param {string} email - User email
 * @param {number} lockMinutes - Lock duration in minutes
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<UserModel>} Updated user
 *
 * @example
 * ```typescript
 * await lockUserAccount(User, 'user@example.com', 30);
 * ```
 */
export declare function lockUserAccount(User: ModelStatic<UserModel>, email: string, lockMinutes?: number, transaction?: Transaction): Promise<UserModel>;
/**
 * @function unlockUserAccount
 * @description Unlocks a user account
 *
 * @param {ModelStatic<UserModel>} User - User model
 * @param {string} userId - User ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<UserModel>} Updated user
 *
 * @example
 * ```typescript
 * await unlockUserAccount(User, userId);
 * ```
 */
export declare function unlockUserAccount(User: ModelStatic<UserModel>, userId: string, transaction?: Transaction): Promise<UserModel>;
/**
 * @decorator CurrentUser
 * @description Extracts the current user from the request
 *
 * @example
 * ```typescript
 * @Get('profile')
 * async getProfile(@CurrentUser() user: JWTPayload) {
 *   return user;
 * }
 * ```
 */
export declare const CurrentUser: any;
/**
 * @decorator Roles
 * @description Defines required roles for a route
 *
 * @example
 * ```typescript
 * @Get('admin')
 * @Roles('admin', 'super-admin')
 * async adminRoute() {
 *   return 'Admin only';
 * }
 * ```
 */
export declare const Roles: (...roles: string[]) => any;
/**
 * @decorator Permissions
 * @description Defines required permissions for a route
 *
 * @example
 * ```typescript
 * @Delete('patient/:id')
 * @Permissions('patient:delete')
 * async deletePatient(@Param('id') id: string) {
 *   // ...
 * }
 * ```
 */
export declare const Permissions: (...permissions: string[]) => any;
/**
 * @decorator Public
 * @description Marks a route as public (no authentication required)
 *
 * @example
 * ```typescript
 * @Get('health')
 * @Public()
 * async health() {
 *   return { status: 'ok' };
 * }
 * ```
 */
export declare const Public: () => any;
/**
 * @decorator RequireMFA
 * @description Marks a route as requiring MFA
 *
 * @example
 * ```typescript
 * @Post('sensitive-operation')
 * @RequireMFA()
 * async sensitiveOp() {
 *   // ...
 * }
 * ```
 */
export declare const RequireMFA: () => any;
/**
 * @guard JwtAuthGuard
 * @description Guard for JWT authentication
 *
 * @example
 * ```typescript
 * @Controller('api')
 * @UseGuards(JwtAuthGuard)
 * export class ApiController {
 *   // ...
 * }
 * ```
 */
export declare class JwtAuthGuard implements CanActivate {
    private reflector;
    private jwtService;
    constructor(reflector: Reflector, jwtService: JwtService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractTokenFromHeader;
}
/**
 * @guard RolesGuard
 * @description Guard for role-based authorization
 *
 * @example
 * ```typescript
 * @UseGuards(JwtAuthGuard, RolesGuard)
 * @Roles('admin')
 * async adminRoute() {}
 * ```
 */
export declare class RolesGuard implements CanActivate {
    private reflector;
    constructor(reflector: Reflector);
    canActivate(context: ExecutionContext): boolean;
}
/**
 * @guard PermissionsGuard
 * @description Guard for permission-based authorization
 *
 * @example
 * ```typescript
 * @UseGuards(JwtAuthGuard, PermissionsGuard)
 * @Permissions('patient:delete')
 * async deletePatient() {}
 * ```
 */
export declare class PermissionsGuard implements CanActivate {
    private reflector;
    constructor(reflector: Reflector);
    canActivate(context: ExecutionContext): boolean;
}
/**
 * @guard ApiKeyGuard
 * @description Guard for API key authentication
 *
 * @example
 * ```typescript
 * @UseGuards(ApiKeyGuard)
 * async apiRoute() {}
 * ```
 */
export declare class ApiKeyGuard implements CanActivate {
    private apiKeyModel;
    private reflector;
    constructor(apiKeyModel: ModelStatic<ApiKeyModel>, reflector: Reflector);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractApiKey;
}
/**
 * @guard MFAGuard
 * @description Guard that ensures MFA is completed
 *
 * @example
 * ```typescript
 * @UseGuards(JwtAuthGuard, MFAGuard)
 * async sensitiveRoute() {}
 * ```
 */
export declare class MFAGuard implements CanActivate {
    private reflector;
    constructor(reflector: Reflector);
    canActivate(context: ExecutionContext): boolean;
}
//# sourceMappingURL=auth-rbac-kit.d.ts.map