/**
 * LOC: AUTH_SEC_PROD_001
 * File: /reuse/auth-security-kit.prod.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/passport
 *   - @nestjs/jwt
 *   - @nestjs/swagger
 *   - passport
 *   - bcrypt
 *   - argon2
 *   - otplib
 *   - qrcode
 *   - sequelize-typescript
 *   - zod
 *
 * DOWNSTREAM (imported by):
 *   - Authentication services
 *   - Authorization services
 *   - Auth controllers
 *   - Security middleware
 *   - Guard implementations
 *   - API key validators
 */
import { CanActivate, ExecutionContext, NestInterceptor, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
/**
 * Authentication method types
 */
export declare enum AuthMethod {
    LOCAL = "local",
    JWT = "jwt",
    OAUTH2 = "oauth2",
    OIDC = "oidc",
    SAML = "saml",
    API_KEY = "api_key",
    MFA = "mfa",
    BIOMETRIC = "biometric"
}
/**
 * OAuth2 grant types
 */
export declare enum OAuth2GrantType {
    AUTHORIZATION_CODE = "authorization_code",
    CLIENT_CREDENTIALS = "client_credentials",
    PASSWORD = "password",
    REFRESH_TOKEN = "refresh_token",
    IMPLICIT = "implicit",
    DEVICE_CODE = "device_code"
}
/**
 * User roles enum
 */
export declare enum UserRole {
    SUPER_ADMIN = "super_admin",
    ADMIN = "admin",
    DOCTOR = "doctor",
    NURSE = "nurse",
    PATIENT = "patient",
    STAFF = "staff",
    GUEST = "guest"
}
/**
 * Permission actions
 */
export declare enum PermissionAction {
    CREATE = "create",
    READ = "read",
    UPDATE = "update",
    DELETE = "delete",
    EXECUTE = "execute",
    APPROVE = "approve",
    MANAGE = "manage"
}
/**
 * Resource types for authorization
 */
export declare enum ResourceType {
    USER = "user",
    PATIENT = "patient",
    APPOINTMENT = "appointment",
    MEDICAL_RECORD = "medical_record",
    PRESCRIPTION = "prescription",
    BILLING = "billing",
    REPORT = "report",
    ADMIN = "admin"
}
/**
 * JWT payload structure
 */
export interface JWTPayload {
    sub: string;
    email: string;
    role: UserRole;
    permissions?: string[];
    sessionId?: string;
    type: 'access' | 'refresh' | 'mfa' | 'reset';
    iat?: number;
    exp?: number;
    iss?: string;
    aud?: string;
    jti?: string;
}
/**
 * Access token response
 */
export interface AccessTokenResponse {
    accessToken: string;
    refreshToken?: string;
    tokenType: 'Bearer';
    expiresIn: number;
    scope?: string;
    idToken?: string;
}
/**
 * OAuth2 authorization request
 */
export interface OAuth2AuthRequest {
    clientId: string;
    redirectUri: string;
    responseType: 'code' | 'token' | 'id_token';
    scope: string[];
    state: string;
    codeChallenge?: string;
    codeChallengeMethod?: 'S256' | 'plain';
    nonce?: string;
}
/**
 * OAuth2 token request
 */
export interface OAuth2TokenRequest {
    grantType: OAuth2GrantType;
    code?: string;
    redirectUri?: string;
    clientId: string;
    clientSecret?: string;
    refreshToken?: string;
    username?: string;
    password?: string;
    scope?: string[];
    codeVerifier?: string;
}
/**
 * User authentication payload
 */
export interface AuthUser {
    id: string;
    email: string;
    role: UserRole;
    permissions: string[];
    isActive: boolean;
    isMfaEnabled: boolean;
    mfaVerified?: boolean;
    sessionId?: string;
    lastLogin?: Date;
}
/**
 * Session data structure
 */
export interface SessionData {
    sessionId: string;
    userId: string;
    email: string;
    role: UserRole;
    permissions: string[];
    createdAt: Date;
    lastActivity: Date;
    expiresAt: Date;
    ipAddress?: string;
    userAgent?: string;
    deviceId?: string;
    mfaVerified: boolean;
    metadata?: Record<string, any>;
}
/**
 * Password policy configuration
 */
export interface PasswordPolicy {
    minLength: number;
    maxLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    preventReuse: number;
    maxAge: number;
    minAge: number;
    complexityScore: number;
}
/**
 * Password validation result
 */
export interface PasswordValidationResult {
    isValid: boolean;
    errors: string[];
    strength: 'weak' | 'fair' | 'good' | 'strong' | 'very_strong';
    score: number;
}
/**
 * RBAC permission structure
 */
export interface Permission {
    id: string;
    resource: ResourceType;
    action: PermissionAction;
    conditions?: Record<string, any>;
    effect: 'allow' | 'deny';
}
/**
 * ABAC policy structure
 */
export interface ABACPolicy {
    id: string;
    name: string;
    description?: string;
    subject: {
        roles?: UserRole[];
        permissions?: string[];
        attributes?: Record<string, any>;
    };
    resource: {
        type: ResourceType;
        attributes?: Record<string, any>;
    };
    action: PermissionAction;
    conditions?: Array<{
        attribute: string;
        operator: 'eq' | 'ne' | 'gt' | 'lt' | 'in' | 'contains';
        value: any;
    }>;
    effect: 'allow' | 'deny';
    priority: number;
}
/**
 * 2FA/TOTP configuration
 */
export interface TOTPConfig {
    secret: string;
    issuer: string;
    label: string;
    algorithm: 'SHA1' | 'SHA256' | 'SHA512';
    digits: 6 | 8;
    period: number;
    window: number;
}
/**
 * API key structure
 */
export interface APIKey {
    id: string;
    key: string;
    hash: string;
    userId: string;
    name: string;
    scopes: string[];
    permissions: string[];
    rateLimit?: number;
    expiresAt?: Date;
    lastUsedAt?: Date;
    isActive: boolean;
    createdAt: Date;
}
/**
 * Rate limit configuration
 */
export interface RateLimitConfig {
    windowMs: number;
    maxAttempts: number;
    blockDurationMs: number;
    skipSuccessfulRequests?: boolean;
    keyGenerator?: (req: Request) => string;
}
/**
 * Login attempt tracking
 */
export interface LoginAttempt {
    userId?: string;
    email: string;
    ipAddress: string;
    userAgent: string;
    success: boolean;
    failureReason?: string;
    timestamp: Date;
    metadata?: Record<string, any>;
}
/**
 * Account lockout state
 */
export interface AccountLockout {
    userId: string;
    isLocked: boolean;
    lockedAt?: Date;
    lockedUntil?: Date;
    failedAttempts: number;
    lockReason?: string;
}
/**
 * Login credentials schema
 */
export declare const LoginCredentialsSchema: any;
/**
 * Password change schema
 */
export declare const PasswordChangeSchema: any;
/**
 * User registration schema
 */
export declare const UserRegistrationSchema: any;
/**
 * OAuth2 token request schema
 */
export declare const OAuth2TokenRequestSchema: any;
/**
 * TOTP verification schema
 */
export declare const TOTPVerificationSchema: any;
/**
 * API key creation schema
 */
export declare const APIKeyCreationSchema: any;
/**
 * Generate JWT access token with comprehensive payload
 *
 * @param user - User authentication data
 * @param jwtService - NestJS JWT service instance
 * @param options - Optional token generation options
 * @returns Signed JWT access token
 *
 * @example
 * ```typescript
 * const token = await generateAccessToken(authUser, jwtService, {
 *   expiresIn: '15m',
 *   issuer: 'white-cross-api',
 *   audience: 'white-cross-client',
 * });
 * ```
 */
export declare function generateAccessToken(user: AuthUser, jwtService: JwtService, options?: {
    expiresIn?: string | number;
    issuer?: string;
    audience?: string;
    sessionId?: string;
    additionalClaims?: Record<string, any>;
}): Promise<string>;
/**
 * Generate JWT refresh token with long expiration
 *
 * @param userId - User ID to encode in token
 * @param jwtService - NestJS JWT service instance
 * @param options - Optional token generation options
 * @returns Signed JWT refresh token
 *
 * @example
 * ```typescript
 * const refreshToken = await generateRefreshToken(user.id, jwtService, {
 *   expiresIn: '7d',
 *   sessionId: session.id,
 * });
 * ```
 */
export declare function generateRefreshToken(userId: string, jwtService: JwtService, options?: {
    expiresIn?: string | number;
    sessionId?: string;
    issuer?: string;
    audience?: string;
}): Promise<string>;
/**
 * Verify and decode JWT token with error handling
 *
 * @param token - JWT token to verify
 * @param jwtService - NestJS JWT service instance
 * @param options - Token verification options
 * @returns Decoded JWT payload
 * @throws UnauthorizedException if token is invalid or expired
 *
 * @example
 * ```typescript
 * try {
 *   const payload = await verifyJWTToken(token, jwtService, {
 *     issuer: 'white-cross-api',
 *     audience: 'white-cross-client',
 *   });
 *   console.log('User ID:', payload.sub);
 * } catch (error) {
 *   // Handle invalid token
 * }
 * ```
 */
export declare function verifyJWTToken(token: string, jwtService: JwtService, options?: {
    issuer?: string;
    audience?: string;
    ignoreExpiration?: boolean;
}): Promise<JWTPayload>;
/**
 * Decode JWT token without verification (for debugging)
 *
 * @param token - JWT token to decode
 * @returns Decoded payload or null if invalid
 *
 * @example
 * ```typescript
 * const payload = decodeJWTToken(token);
 * if (payload) {
 *   console.log('Token expires at:', new Date(payload.exp * 1000));
 * }
 * ```
 */
export declare function decodeJWTToken(token: string): JWTPayload | null;
/**
 * Check if JWT token is expired
 *
 * @param token - JWT token to check
 * @returns True if token is expired
 *
 * @example
 * ```typescript
 * if (isTokenExpired(token)) {
 *   // Request new token
 *   const newToken = await refreshAccessToken(refreshToken);
 * }
 * ```
 */
export declare function isTokenExpired(token: string): boolean;
/**
 * Extract token from Authorization header
 *
 * @param request - Express request object
 * @returns Extracted token or null
 *
 * @example
 * ```typescript
 * const token = extractTokenFromHeader(request);
 * if (token) {
 *   const payload = await verifyJWTToken(token, jwtService);
 * }
 * ```
 */
export declare function extractTokenFromHeader(request: Request): string | null;
/**
 * Revoke JWT token (add to blacklist)
 *
 * @param token - Token to revoke
 * @param redisClient - Redis client for blacklist storage
 * @param ttl - Time to live in seconds (should match token expiry)
 * @returns Promise resolving when token is blacklisted
 *
 * @example
 * ```typescript
 * await revokeToken(token, redisClient, 900); // 15 minutes
 * ```
 */
export declare function revokeToken(token: string, redisClient: any, // Redis client type
ttl?: number): Promise<void>;
/**
 * Check if JWT token is blacklisted
 *
 * @param token - Token to check
 * @param redisClient - Redis client for blacklist storage
 * @returns True if token is blacklisted
 *
 * @example
 * ```typescript
 * if (await isTokenBlacklisted(token, redisClient)) {
 *   throw new UnauthorizedException('Token has been revoked');
 * }
 * ```
 */
export declare function isTokenBlacklisted(token: string, redisClient: any): Promise<boolean>;
/**
 * Hash password using bcrypt with configurable salt rounds
 *
 * @param password - Plain text password
 * @param saltRounds - Number of salt rounds (default: 12)
 * @returns Hashed password
 *
 * @example
 * ```typescript
 * const hashedPassword = await hashPassword(plainPassword, 12);
 * await userRepository.save({ email, password: hashedPassword });
 * ```
 */
export declare function hashPassword(password: string, saltRounds?: number): Promise<string>;
/**
 * Verify password against bcrypt hash
 *
 * @param password - Plain text password
 * @param hash - Bcrypt hash to compare against
 * @returns True if password matches hash
 *
 * @example
 * ```typescript
 * const isValid = await verifyPassword(inputPassword, user.password);
 * if (!isValid) {
 *   throw new UnauthorizedException('Invalid credentials');
 * }
 * ```
 */
export declare function verifyPassword(password: string, hash: string): Promise<boolean>;
/**
 * Validate password against security policy
 *
 * @param password - Password to validate
 * @param policy - Password policy configuration
 * @param previousPasswords - Array of previous password hashes to check reuse
 * @returns Validation result with errors and strength score
 *
 * @example
 * ```typescript
 * const result = validatePasswordPolicy(newPassword, passwordPolicy, user.passwordHistory);
 * if (!result.isValid) {
 *   throw new BadRequestException(result.errors.join(', '));
 * }
 * ```
 */
export declare function validatePasswordPolicy(password: string, policy: PasswordPolicy, previousPasswords?: string[]): Promise<PasswordValidationResult>;
/**
 * Generate secure random password meeting policy requirements
 *
 * @param policy - Password policy to satisfy
 * @returns Generated secure password
 *
 * @example
 * ```typescript
 * const tempPassword = generateSecurePassword(passwordPolicy);
 * await sendPasswordResetEmail(user.email, tempPassword);
 * ```
 */
export declare function generateSecurePassword(policy: PasswordPolicy): string;
/**
 * Check if password has expired based on policy
 *
 * @param passwordChangedAt - Date when password was last changed
 * @param policy - Password policy configuration
 * @returns True if password has expired
 *
 * @example
 * ```typescript
 * if (isPasswordExpired(user.passwordChangedAt, passwordPolicy)) {
 *   return { requirePasswordChange: true };
 * }
 * ```
 */
export declare function isPasswordExpired(passwordChangedAt: Date, policy: PasswordPolicy): boolean;
/**
 * Create new user session with Redis storage
 *
 * @param user - Authenticated user data
 * @param redisClient - Redis client for session storage
 * @param options - Session creation options
 * @returns Created session data
 *
 * @example
 * ```typescript
 * const session = await createSession(user, redisClient, {
 *   expiresIn: 3600,
 *   ipAddress: req.ip,
 *   userAgent: req.headers['user-agent'],
 * });
 * ```
 */
export declare function createSession(user: AuthUser, redisClient: any, options?: {
    expiresIn?: number;
    ipAddress?: string;
    userAgent?: string;
    deviceId?: string;
    metadata?: Record<string, any>;
}): Promise<SessionData>;
/**
 * Get session data from Redis
 *
 * @param sessionId - Session ID to retrieve
 * @param redisClient - Redis client
 * @returns Session data or null if not found
 *
 * @example
 * ```typescript
 * const session = await getSession(sessionId, redisClient);
 * if (!session) {
 *   throw new UnauthorizedException('Invalid session');
 * }
 * ```
 */
export declare function getSession(sessionId: string, redisClient: any): Promise<SessionData | null>;
/**
 * Update session last activity timestamp
 *
 * @param sessionId - Session ID to update
 * @param redisClient - Redis client
 * @param extendExpiry - Whether to extend session expiry
 * @returns Updated session or null
 *
 * @example
 * ```typescript
 * await updateSessionActivity(sessionId, redisClient, true);
 * ```
 */
export declare function updateSessionActivity(sessionId: string, redisClient: any, extendExpiry?: boolean): Promise<SessionData | null>;
/**
 * Destroy user session
 *
 * @param sessionId - Session ID to destroy
 * @param redisClient - Redis client
 * @returns Promise resolving when session is destroyed
 *
 * @example
 * ```typescript
 * await destroySession(sessionId, redisClient);
 * ```
 */
export declare function destroySession(sessionId: string, redisClient: any): Promise<void>;
/**
 * Destroy all sessions for a user
 *
 * @param userId - User ID
 * @param redisClient - Redis client
 * @param exceptSessionId - Optional session ID to keep
 * @returns Number of sessions destroyed
 *
 * @example
 * ```typescript
 * await destroyAllUserSessions(user.id, redisClient, currentSessionId);
 * ```
 */
export declare function destroyAllUserSessions(userId: string, redisClient: any, exceptSessionId?: string): Promise<number>;
/**
 * Get all active sessions for a user
 *
 * @param userId - User ID
 * @param redisClient - Redis client
 * @returns Array of active sessions
 *
 * @example
 * ```typescript
 * const sessions = await getUserSessions(user.id, redisClient);
 * console.log(`User has ${sessions.length} active sessions`);
 * ```
 */
export declare function getUserSessions(userId: string, redisClient: any): Promise<SessionData[]>;
/**
 * Generate OAuth2 authorization code
 *
 * @param clientId - Client application ID
 * @param userId - User ID
 * @param scope - Requested scopes
 * @param redirectUri - Redirect URI
 * @param redisClient - Redis client for code storage
 * @param codeChallenge - PKCE code challenge
 * @returns Authorization code
 *
 * @example
 * ```typescript
 * const code = await generateAuthorizationCode(
 *   clientId,
 *   user.id,
 *   ['openid', 'profile'],
 *   redirectUri,
 *   redisClient
 * );
 * ```
 */
export declare function generateAuthorizationCode(clientId: string, userId: string, scope: string[], redirectUri: string, redisClient: any, codeChallenge?: string): Promise<string>;
/**
 * Exchange authorization code for access token
 *
 * @param code - Authorization code
 * @param clientId - Client ID
 * @param redirectUri - Redirect URI (must match original)
 * @param codeVerifier - PKCE code verifier
 * @param redisClient - Redis client
 * @param jwtService - JWT service
 * @returns Access token response
 *
 * @example
 * ```typescript
 * const tokens = await exchangeAuthorizationCode(
 *   code,
 *   clientId,
 *   redirectUri,
 *   codeVerifier,
 *   redisClient,
 *   jwtService
 * );
 * ```
 */
export declare function exchangeAuthorizationCode(code: string, clientId: string, redirectUri: string, codeVerifier: string | undefined, redisClient: any, jwtService: JwtService): Promise<AccessTokenResponse>;
/**
 * Validate OAuth2 redirect URI against registered URIs
 *
 * @param redirectUri - URI to validate
 * @param registeredUris - Array of registered redirect URIs
 * @returns True if URI is valid
 *
 * @example
 * ```typescript
 * if (!validateRedirectUri(req.redirectUri, client.redirectUris)) {
 *   throw new BadRequestException('Invalid redirect URI');
 * }
 * ```
 */
export declare function validateRedirectUri(redirectUri: string, registeredUris: string[]): boolean;
/**
 * Generate PKCE code verifier and challenge
 *
 * @returns Object with verifier and challenge
 *
 * @example
 * ```typescript
 * const { verifier, challenge } = generatePKCEChallenge();
 * // Store verifier, send challenge to auth server
 * ```
 */
export declare function generatePKCEChallenge(): {
    verifier: string;
    challenge: string;
};
/**
 * Check if user has required role
 *
 * @param user - Authenticated user
 * @param requiredRoles - Required roles (any match grants access)
 * @returns True if user has any of the required roles
 *
 * @example
 * ```typescript
 * if (!hasRole(user, [UserRole.ADMIN, UserRole.SUPER_ADMIN])) {
 *   throw new ForbiddenException('Insufficient privileges');
 * }
 * ```
 */
export declare function hasRole(user: AuthUser, requiredRoles: UserRole[]): boolean;
/**
 * Check if user has required permission
 *
 * @param user - Authenticated user
 * @param requiredPermissions - Required permissions (all must match)
 * @returns True if user has all required permissions
 *
 * @example
 * ```typescript
 * if (!hasPermission(user, ['patients:read', 'patients:write'])) {
 *   throw new ForbiddenException('Missing required permissions');
 * }
 * ```
 */
export declare function hasPermission(user: AuthUser, requiredPermissions: string[]): boolean;
/**
 * Check if user has any of the required permissions
 *
 * @param user - Authenticated user
 * @param permissions - Permissions to check
 * @returns True if user has at least one permission
 *
 * @example
 * ```typescript
 * if (!hasAnyPermission(user, ['admin:read', 'admin:write'])) {
 *   throw new ForbiddenException();
 * }
 * ```
 */
export declare function hasAnyPermission(user: AuthUser, permissions: string[]): boolean;
/**
 * Build permission string from resource and action
 *
 * @param resource - Resource type
 * @param action - Permission action
 * @returns Formatted permission string
 *
 * @example
 * ```typescript
 * const permission = buildPermission(ResourceType.PATIENT, PermissionAction.READ);
 * // Returns: "patient:read"
 * ```
 */
export declare function buildPermission(resource: ResourceType, action: PermissionAction): string;
/**
 * Parse permission string into resource and action
 *
 * @param permission - Permission string (e.g., "patient:read")
 * @returns Object with resource and action
 *
 * @example
 * ```typescript
 * const { resource, action } = parsePermission("patient:read");
 * ```
 */
export declare function parsePermission(permission: string): {
    resource: string;
    action: string;
};
/**
 * Evaluate ABAC policy against user and resource
 *
 * @param user - Authenticated user
 * @param resource - Resource being accessed
 * @param action - Action being performed
 * @param policies - ABAC policies to evaluate
 * @returns True if access is granted
 *
 * @example
 * ```typescript
 * const allowed = evaluateABACPolicy(
 *   user,
 *   { type: ResourceType.PATIENT, ownerId: patientId },
 *   PermissionAction.READ,
 *   abacPolicies
 * );
 * ```
 */
export declare function evaluateABACPolicy(user: AuthUser, resource: {
    type: ResourceType;
    attributes?: Record<string, any>;
}, action: PermissionAction, policies: ABACPolicy[]): boolean;
/**
 * Generate TOTP secret for user
 *
 * @param userId - User ID
 * @param email - User email
 * @returns TOTP configuration with secret
 *
 * @example
 * ```typescript
 * const totpConfig = generateTOTPSecret(user.id, user.email);
 * await userRepository.update(user.id, { totpSecret: totpConfig.secret });
 * ```
 */
export declare function generateTOTPSecret(userId: string, email: string): TOTPConfig;
/**
 * Generate TOTP QR code URL for authenticator apps
 *
 * @param config - TOTP configuration
 * @returns otpauth:// URL for QR code generation
 *
 * @example
 * ```typescript
 * const url = generateTOTPQRCodeURL(totpConfig);
 * const qrCode = await QRCode.toDataURL(url);
 * ```
 */
export declare function generateTOTPQRCodeURL(config: TOTPConfig): string;
/**
 * Verify TOTP code against secret
 *
 * @param code - 6-digit TOTP code
 * @param secret - TOTP secret
 * @param config - Optional TOTP configuration
 * @returns True if code is valid
 *
 * @example
 * ```typescript
 * const isValid = verifyTOTPCode(inputCode, user.totpSecret);
 * if (!isValid) {
 *   throw new UnauthorizedException('Invalid 2FA code');
 * }
 * ```
 */
export declare function verifyTOTPCode(code: string, secret: string, config?: Partial<TOTPConfig>): boolean;
/**
 * Generate backup codes for 2FA recovery
 *
 * @param count - Number of backup codes to generate
 * @returns Array of backup codes
 *
 * @example
 * ```typescript
 * const backupCodes = generateBackupCodes(10);
 * await userRepository.update(user.id, { backupCodes });
 * ```
 */
export declare function generateBackupCodes(count?: number): string[];
/**
 * Generate API key with hash for storage
 *
 * @param userId - User ID
 * @param name - API key name/description
 * @param scopes - Allowed scopes
 * @param permissions - Allowed permissions
 * @param options - Additional options
 * @returns API key object with plain key and hash
 *
 * @example
 * ```typescript
 * const apiKey = await generateAPIKey(user.id, 'Mobile App', ['read'], ['patients:read']);
 * // Store apiKey.hash in DB, return apiKey.key to user (only shown once)
 * ```
 */
export declare function generateAPIKey(userId: string, name: string, scopes: string[], permissions: string[], options?: {
    expiresInDays?: number;
    rateLimit?: number;
}): Promise<APIKey>;
/**
 * Verify API key and return associated data
 *
 * @param apiKey - API key to verify
 * @param storedHash - Stored hash from database
 * @returns True if key matches hash
 *
 * @example
 * ```typescript
 * const isValid = verifyAPIKey(inputKey, storedApiKey.hash);
 * if (!isValid) {
 *   throw new UnauthorizedException('Invalid API key');
 * }
 * ```
 */
export declare function verifyAPIKey(apiKey: string, storedHash: string): boolean;
/**
 * Extract API key from request headers
 *
 * @param request - Express request object
 * @returns API key or null
 *
 * @example
 * ```typescript
 * const apiKey = extractAPIKey(request);
 * if (apiKey) {
 *   const keyData = await validateAPIKey(apiKey);
 * }
 * ```
 */
export declare function extractAPIKey(request: Request): string | null;
/**
 * Rotate API key (generate new key, invalidate old)
 *
 * @param oldKeyId - ID of existing API key
 * @param userId - User ID
 * @param name - Key name
 * @param scopes - Scopes
 * @param permissions - Permissions
 * @returns New API key
 *
 * @example
 * ```typescript
 * const newKey = await rotateAPIKey(oldKey.id, user.id, oldKey.name, oldKey.scopes, oldKey.permissions);
 * ```
 */
export declare function rotateAPIKey(oldKeyId: string, userId: string, name: string, scopes: string[], permissions: string[]): Promise<APIKey>;
/**
 * Track login attempt and check rate limit
 *
 * @param email - User email or identifier
 * @param ipAddress - Request IP address
 * @param success - Whether login was successful
 * @param redisClient - Redis client
 * @param config - Rate limit configuration
 * @returns Object indicating if locked and attempts remaining
 *
 * @example
 * ```typescript
 * const result = await trackLoginAttempt(email, req.ip, false, redisClient, rateLimitConfig);
 * if (result.isLocked) {
 *   throw new UnauthorizedException('Too many failed attempts');
 * }
 * ```
 */
export declare function trackLoginAttempt(email: string, ipAddress: string, success: boolean, redisClient: any, config: RateLimitConfig): Promise<{
    isLocked: boolean;
    attemptsRemaining: number;
    lockDurationMs?: number;
}>;
/**
 * Check if account is currently locked
 *
 * @param email - User email
 * @param redisClient - Redis client
 * @returns Lockout state
 *
 * @example
 * ```typescript
 * const lockout = await checkAccountLockout(email, redisClient);
 * if (lockout.isLocked) {
 *   throw new UnauthorizedException(`Account locked until ${lockout.lockedUntil}`);
 * }
 * ```
 */
export declare function checkAccountLockout(email: string, redisClient: any): Promise<AccountLockout>;
/**
 * Manually lock user account
 *
 * @param userId - User ID to lock
 * @param durationMs - Lock duration in milliseconds
 * @param reason - Reason for lockout
 * @param redisClient - Redis client
 * @returns Promise resolving when account is locked
 *
 * @example
 * ```typescript
 * await lockAccount(user.id, 24 * 60 * 60 * 1000, 'Suspicious activity', redisClient);
 * ```
 */
export declare function lockAccount(userId: string, durationMs: number, reason: string, redisClient: any): Promise<void>;
/**
 * Unlock user account
 *
 * @param userId - User ID to unlock
 * @param redisClient - Redis client
 * @returns Promise resolving when account is unlocked
 *
 * @example
 * ```typescript
 * await unlockAccount(user.id, redisClient);
 * ```
 */
export declare function unlockAccount(userId: string, redisClient: any): Promise<void>;
/**
 * JWT Authentication Guard
 * Validates JWT token and attaches user to request
 */
export declare class JwtAuthGuard implements CanActivate {
    private readonly jwtService;
    private readonly reflector?;
    constructor(jwtService: JwtService, reflector?: Reflector);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
/**
 * Roles Guard
 * Checks if user has required role(s)
 */
export declare class RolesGuard implements CanActivate {
    private readonly reflector;
    constructor(reflector: Reflector);
    canActivate(context: ExecutionContext): boolean;
}
/**
 * Permissions Guard
 * Checks if user has required permission(s)
 */
export declare class PermissionsGuard implements CanActivate {
    private readonly reflector;
    constructor(reflector: Reflector);
    canActivate(context: ExecutionContext): boolean;
}
/**
 * API Key Guard
 * Validates API key from headers
 */
export declare class ApiKeyGuard implements CanActivate {
    canActivate(context: ExecutionContext): Promise<boolean>;
}
/**
 * Public route decorator - bypasses authentication
 */
export declare const Public: () => any;
/**
 * Roles decorator - requires specific roles
 */
export declare const Roles: (...roles: UserRole[]) => any;
/**
 * Permissions decorator - requires specific permissions
 */
export declare const RequirePermissions: (...permissions: string[]) => any;
/**
 * Current user decorator - extracts user from request
 */
export declare const CurrentUser: any;
/**
 * Session decorator - extracts session from request
 */
export declare const Session: any;
/**
 * Audit Interceptor
 * Logs all authenticated requests for security auditing
 */
export declare class AuditInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
    private logAuditEvent;
}
/**
 * User model interface for Sequelize
 */
export interface UserModel {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    permissions: string[];
    isActive: boolean;
    isEmailVerified: boolean;
    isMfaEnabled: boolean;
    mfaSecret?: string;
    backupCodes?: string[];
    passwordChangedAt?: Date;
    passwordHistory?: string[];
    failedLoginAttempts: number;
    lastLoginAt?: Date;
    lastLoginIp?: string;
    lockedUntil?: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * Role model interface for Sequelize
 */
export interface RoleModel {
    id: string;
    name: UserRole;
    displayName: string;
    description?: string;
    permissions: string[];
    isSystem: boolean;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Permission model interface for Sequelize
 */
export interface PermissionModel {
    id: string;
    resource: ResourceType;
    action: PermissionAction;
    description?: string;
    isSystem: boolean;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Session model interface for Sequelize
 */
export interface SessionModel {
    id: string;
    sessionId: string;
    userId: string;
    data: string;
    expiresAt: Date;
    ipAddress?: string;
    userAgent?: string;
    deviceId?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * API Key model interface for Sequelize
 */
export interface APIKeyModel {
    id: string;
    hash: string;
    userId: string;
    name: string;
    scopes: string[];
    permissions: string[];
    rateLimit?: number;
    lastUsedAt?: Date;
    expiresAt?: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Audit Log model interface for Sequelize
 */
export interface AuditLogModel {
    id: string;
    userId?: string;
    email?: string;
    action: string;
    resource?: string;
    resourceId?: string;
    success: boolean;
    errorMessage?: string;
    ipAddress?: string;
    userAgent?: string;
    metadata?: string;
    createdAt: Date;
}
/**
 * Default password policy for healthcare applications
 */
export declare const DEFAULT_PASSWORD_POLICY: PasswordPolicy;
/**
 * Default rate limit configuration for auth endpoints
 */
export declare const DEFAULT_AUTH_RATE_LIMIT: RateLimitConfig;
//# sourceMappingURL=auth-security-kit.prod.d.ts.map