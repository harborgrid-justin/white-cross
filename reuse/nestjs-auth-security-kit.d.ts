/**
 * LOC: NESTJS_AUTH_SEC_KIT_001
 * File: /reuse/nestjs-auth-security-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/jwt
 *   - @nestjs/passport
 *   - crypto (Node.js built-in)
 *   - bcrypt
 *
 * DOWNSTREAM (imported by):
 *   - Authentication services and controllers
 *   - Authorization guards and decorators
 *   - Security middleware and interceptors
 *   - Password management services
 *   - API key validation services
 *   - Rate limiting services
 */
import { Request } from 'express';
/**
 * JWT payload structure
 */
export interface JwtPayload {
    sub: string;
    email?: string;
    role?: string;
    roles?: string[];
    permissions?: string[];
    iat?: number;
    exp?: number;
    iss?: string;
    aud?: string;
    metadata?: Record<string, any>;
}
/**
 * User role definition
 */
export interface UserRole {
    name: string;
    level: number;
    inherits?: string[];
    permissions: string[];
}
/**
 * Permission structure
 */
export interface Permission {
    resource: string;
    action: string;
    conditions?: Record<string, any>;
}
/**
 * ABAC policy structure
 */
export interface AbacPolicy {
    id: string;
    name: string;
    effect: 'allow' | 'deny';
    subject: Record<string, any>;
    resource: Record<string, any>;
    action: string[];
    conditions?: Record<string, any>;
}
/**
 * API key structure
 */
export interface ApiKey {
    key: string;
    hash: string;
    userId: string;
    name: string;
    scopes: string[];
    expiresAt?: Date;
    rateLimit?: number;
    metadata?: Record<string, any>;
}
/**
 * Password validation result
 */
export interface PasswordValidation {
    isValid: boolean;
    errors: string[];
    score: number;
    suggestions?: string[];
}
/**
 * Rate limit configuration
 */
export interface RateLimitConfig {
    windowMs: number;
    maxRequests: number;
    keyPrefix?: string;
    skipSuccessfulRequests?: boolean;
    skipFailedRequests?: boolean;
}
/**
 * TOTP configuration
 */
export interface TotpConfig {
    secret: string;
    period?: number;
    digits?: number;
    algorithm?: 'sha1' | 'sha256' | 'sha512';
}
/**
 * Security headers configuration
 */
export interface SecurityHeadersConfig {
    csp?: Record<string, string[]>;
    hsts?: {
        maxAge: number;
        includeSubDomains?: boolean;
        preload?: boolean;
    };
    xssProtection?: boolean;
    noSniff?: boolean;
    frameOptions?: 'DENY' | 'SAMEORIGIN' | string;
}
/**
 * Encryption options
 */
export interface EncryptionOptions {
    algorithm?: string;
    ivLength?: number;
    tagLength?: number;
    encoding?: BufferEncoding;
}
/**
 * Session data structure
 */
export interface SessionData {
    sessionId: string;
    userId: string;
    email?: string;
    role?: string;
    createdAt: Date;
    lastActivity: Date;
    expiresAt: Date;
    ipAddress?: string;
    userAgent?: string;
    deviceFingerprint?: string;
    metadata?: Record<string, any>;
}
/**
 * 1. Generate JWT access token with comprehensive payload
 * @param payload - Token payload data
 * @param secret - JWT secret key
 * @param expiresIn - Token expiration (e.g., '15m', 900)
 * @returns Signed JWT token
 */
export declare const generateJwtToken: (payload: JwtPayload, secret: string, expiresIn?: string | number) => string;
/**
 * 2. Verify and decode JWT token with signature validation
 * @param token - JWT token to verify
 * @param secret - JWT secret key
 * @returns Decoded payload or null if invalid
 */
export declare const verifyJwtToken: (token: string, secret: string) => JwtPayload | null;
/**
 * 3. Extract JWT token from Authorization header
 * @param request - HTTP request object
 * @returns Extracted token or null
 */
export declare const extractJwtFromHeader: (request: Request) => string | null;
/**
 * 4. Decode JWT without verification (for inspection only)
 * @param token - JWT token
 * @returns Decoded payload or null
 */
export declare const decodeJwtUnsafe: (token: string) => JwtPayload | null;
/**
 * 5. Check if JWT token is expired
 * @param token - JWT token
 * @returns True if expired, false otherwise
 */
export declare const isJwtExpired: (token: string) => boolean;
/**
 * 6. Generate refresh token with secure random bytes
 * @param userId - User identifier
 * @param expiresInDays - Expiration in days (default: 30)
 * @returns Refresh token object with token and hash
 */
export declare const generateRefreshToken: (userId: string, expiresInDays?: number) => {
    token: string;
    hash: string;
    expiresAt: Date;
};
/**
 * 7. Validate refresh token against stored hash
 * @param token - Provided refresh token
 * @param storedHash - Stored token hash
 * @returns True if valid
 */
export declare const validateRefreshToken: (token: string, storedHash: string) => boolean;
/**
 * 8. Extract token claims without validation
 * @param token - JWT token
 * @returns Token claims object
 */
export declare const extractJwtClaims: (token: string) => Record<string, any>;
/**
 * 9. Hash password with bcrypt (async)
 * @param password - Plain text password
 * @param saltRounds - Number of salt rounds (default: 12)
 * @returns Promise resolving to password hash
 */
export declare const hashPassword: (password: string, saltRounds?: number) => Promise<string>;
/**
 * 10. Verify password against bcrypt hash (async)
 * @param password - Plain text password
 * @param hash - Stored password hash
 * @returns Promise resolving to validation result
 */
export declare const verifyPassword: (password: string, hash: string) => Promise<boolean>;
/**
 * 11. Validate password complexity requirements
 * @param password - Password to validate
 * @returns Validation result with errors and score
 */
export declare const validatePasswordComplexity: (password: string) => PasswordValidation;
/**
 * 12. Generate secure random password
 * @param length - Password length (default: 16)
 * @param includeSymbols - Include special characters
 * @returns Generated password
 */
export declare const generateSecurePassword: (length?: number, includeSymbols?: boolean) => string;
/**
 * 13. Check if password hash needs rehashing (bcrypt rounds changed)
 * @param hash - Password hash
 * @param currentRounds - Current salt rounds setting
 * @returns True if rehashing needed
 */
export declare const needsPasswordRehash: (hash: string, currentRounds?: number) => boolean;
/**
 * 14. Check if user has required role
 * @param userRole - User's role
 * @param requiredRoles - Required roles (any match)
 * @returns True if user has required role
 */
export declare const hasRole: (userRole: string, requiredRoles: string[]) => boolean;
/**
 * 15. Check if user has all required roles
 * @param userRoles - User's roles
 * @param requiredRoles - Required roles (all must match)
 * @returns True if user has all required roles
 */
export declare const hasAllRoles: (userRoles: string[], requiredRoles: string[]) => boolean;
/**
 * 16. Check if user has any of the required roles
 * @param userRoles - User's roles
 * @param requiredRoles - Required roles (any match)
 * @returns True if user has any required role
 */
export declare const hasAnyRole: (userRoles: string[], requiredRoles: string[]) => boolean;
/**
 * 17. Get role hierarchy level
 * @param role - Role name
 * @param roleDefinitions - Role definitions with levels
 * @returns Role level (higher = more privileged)
 */
export declare const getRoleLevel: (role: string, roleDefinitions: UserRole[]) => number;
/**
 * 18. Check if role has higher privilege than another
 * @param role - Role to check
 * @param compareRole - Role to compare against
 * @param roleDefinitions - Role definitions
 * @returns True if role has higher privilege
 */
export declare const isRoleHigherThan: (role: string, compareRole: string, roleDefinitions: UserRole[]) => boolean;
/**
 * 19. Evaluate ABAC policy against user attributes
 * @param policy - ABAC policy
 * @param userAttributes - User's attributes
 * @param resourceAttributes - Resource attributes
 * @param action - Action being performed
 * @returns True if policy allows access
 */
export declare const evaluateAbacPolicy: (policy: AbacPolicy, userAttributes: Record<string, any>, resourceAttributes: Record<string, any>, action: string) => boolean;
/**
 * 20. Evaluate ABAC conditions
 * @param conditions - Conditions to evaluate
 * @param context - Evaluation context
 * @returns True if conditions are met
 */
export declare const evaluateConditions: (conditions: Record<string, any>, context: Record<string, any>) => boolean;
/**
 * 21. Check resource ownership
 * @param userId - User ID
 * @param resource - Resource with ownerId
 * @returns True if user owns resource
 */
export declare const isResourceOwner: (userId: string, resource: {
    ownerId?: string;
    userId?: string;
    createdBy?: string;
}) => boolean;
/**
 * 22. Check if user can access resource based on attributes
 * @param userAttributes - User attributes
 * @param resourceAttributes - Resource attributes
 * @param requiredAttributes - Required matching attributes
 * @returns True if access allowed
 */
export declare const canAccessResource: (userAttributes: Record<string, any>, resourceAttributes: Record<string, any>, requiredAttributes: string[]) => boolean;
/**
 * 23. Check if user has specific permission
 * @param userPermissions - User's permissions
 * @param requiredPermission - Required permission
 * @returns True if user has permission
 */
export declare const hasPermission: (userPermissions: string[], requiredPermission: string) => boolean;
/**
 * 24. Check if user has all required permissions
 * @param userPermissions - User's permissions
 * @param requiredPermissions - Required permissions
 * @returns True if user has all permissions
 */
export declare const hasAllPermissions: (userPermissions: string[], requiredPermissions: string[]) => boolean;
/**
 * 25. Check if user has any of required permissions
 * @param userPermissions - User's permissions
 * @param requiredPermissions - Required permissions
 * @returns True if user has any permission
 */
export declare const hasAnyPermission: (userPermissions: string[], requiredPermissions: string[]) => boolean;
/**
 * 26. Build permission string from resource and action
 * @param resource - Resource name
 * @param action - Action name
 * @returns Permission string (e.g., 'users:read')
 */
export declare const buildPermission: (resource: string, action: string) => string;
/**
 * 27. Generate API key with prefix
 * @param prefix - Key prefix (e.g., 'wc_live', 'wc_test')
 * @param length - Key length (default: 32)
 * @returns Generated API key
 */
export declare const generateApiKey: (prefix?: string, length?: number) => string;
/**
 * 28. Hash API key for secure storage
 * @param apiKey - API key to hash
 * @returns Hashed API key
 */
export declare const hashApiKey: (apiKey: string) => string;
/**
 * 29. Validate API key against stored hash
 * @param providedKey - Provided API key
 * @param storedHash - Stored key hash
 * @returns True if valid
 */
export declare const validateApiKey: (providedKey: string, storedHash: string) => boolean;
/**
 * 30. Extract API key from request header
 * @param request - HTTP request
 * @param headerName - Header name (default: 'x-api-key')
 * @returns Extracted API key or null
 */
export declare const extractApiKeyFromHeader: (request: Request, headerName?: string) => string | null;
/**
 * 31. Generate OAuth state parameter for CSRF protection
 * @returns Random state string
 */
export declare const generateOAuthState: () => string;
/**
 * 32. Validate OAuth state parameter
 * @param receivedState - State from OAuth callback
 * @param storedState - State stored in session
 * @returns True if valid
 */
export declare const validateOAuthState: (receivedState: string, storedState: string) => boolean;
/**
 * 33. Build OAuth authorization URL
 * @param baseUrl - OAuth provider's authorization URL
 * @param clientId - Client ID
 * @param redirectUri - Redirect URI
 * @param state - State parameter
 * @param scopes - Requested scopes
 * @returns Complete authorization URL
 */
export declare const buildOAuthAuthUrl: (baseUrl: string, clientId: string, redirectUri: string, state: string, scopes?: string[]) => string;
/**
 * 34. Generate secure session ID
 * @returns Random session ID
 */
export declare const generateSessionId: () => string;
/**
 * 35. Create session data object
 * @param userId - User ID
 * @param expiresInMinutes - Session expiration (default: 60)
 * @param metadata - Additional session data
 * @returns Session data object
 */
export declare const createSessionData: (userId: string, expiresInMinutes?: number, metadata?: Record<string, any>) => SessionData;
/**
 * 36. Check if session is expired
 * @param session - Session data
 * @returns True if session is expired
 */
export declare const isSessionExpired: (session: SessionData) => boolean;
/**
 * 37. Update session activity timestamp
 * @param session - Session data
 * @returns Updated session data
 */
export declare const updateSessionActivity: (session: SessionData) => SessionData;
/**
 * 38. Generate CSRF token
 * @returns Random CSRF token
 */
export declare const generateCsrfToken: () => string;
/**
 * 39. Validate CSRF token
 * @param providedToken - Token from request
 * @param storedToken - Token from session
 * @returns True if valid
 */
export declare const validateCsrfToken: (providedToken: string, storedToken: string) => boolean;
/**
 * 40. Extract CSRF token from request
 * @param request - HTTP request
 * @returns CSRF token from header or body
 */
export declare const extractCsrfToken: (request: Request) => string | null;
/**
 * 41. Generate rate limit key for user/IP
 * @param identifier - User ID or IP address
 * @param action - Action being rate limited
 * @param prefix - Key prefix
 * @returns Rate limit cache key
 */
export declare const generateRateLimitKey: (identifier: string, action: string, prefix?: string) => string;
/**
 * 42. Calculate rate limit reset time
 * @param windowMs - Rate limit window in milliseconds
 * @returns Reset timestamp
 */
export declare const calculateRateLimitReset: (windowMs: number) => Date;
/**
 * 43. Check if rate limit exceeded
 * @param currentCount - Current request count
 * @param maxRequests - Maximum allowed requests
 * @returns True if limit exceeded
 */
export declare const isRateLimitExceeded: (currentCount: number, maxRequests: number) => boolean;
/**
 * 44. Generate TOTP secret for 2FA setup
 * @returns Base32-encoded secret
 */
export declare const generateTotpSecret: () => string;
/**
 * 45. Generate backup codes for 2FA
 * @param count - Number of codes to generate
 * @returns Array of backup codes
 */
export declare const generateBackupCodes: (count?: number) => string[];
declare const _default: {
    generateJwtToken: (payload: JwtPayload, secret: string, expiresIn?: string | number) => string;
    verifyJwtToken: (token: string, secret: string) => JwtPayload | null;
    extractJwtFromHeader: (request: Request) => string | null;
    decodeJwtUnsafe: (token: string) => JwtPayload | null;
    isJwtExpired: (token: string) => boolean;
    generateRefreshToken: (userId: string, expiresInDays?: number) => {
        token: string;
        hash: string;
        expiresAt: Date;
    };
    validateRefreshToken: (token: string, storedHash: string) => boolean;
    extractJwtClaims: (token: string) => Record<string, any>;
    hashPassword: (password: string, saltRounds?: number) => Promise<string>;
    verifyPassword: (password: string, hash: string) => Promise<boolean>;
    validatePasswordComplexity: (password: string) => PasswordValidation;
    generateSecurePassword: (length?: number, includeSymbols?: boolean) => string;
    needsPasswordRehash: (hash: string, currentRounds?: number) => boolean;
    hasRole: (userRole: string, requiredRoles: string[]) => boolean;
    hasAllRoles: (userRoles: string[], requiredRoles: string[]) => boolean;
    hasAnyRole: (userRoles: string[], requiredRoles: string[]) => boolean;
    getRoleLevel: (role: string, roleDefinitions: UserRole[]) => number;
    isRoleHigherThan: (role: string, compareRole: string, roleDefinitions: UserRole[]) => boolean;
    evaluateAbacPolicy: (policy: AbacPolicy, userAttributes: Record<string, any>, resourceAttributes: Record<string, any>, action: string) => boolean;
    evaluateConditions: (conditions: Record<string, any>, context: Record<string, any>) => boolean;
    isResourceOwner: (userId: string, resource: {
        ownerId?: string;
        userId?: string;
        createdBy?: string;
    }) => boolean;
    canAccessResource: (userAttributes: Record<string, any>, resourceAttributes: Record<string, any>, requiredAttributes: string[]) => boolean;
    hasPermission: (userPermissions: string[], requiredPermission: string) => boolean;
    hasAllPermissions: (userPermissions: string[], requiredPermissions: string[]) => boolean;
    hasAnyPermission: (userPermissions: string[], requiredPermissions: string[]) => boolean;
    buildPermission: (resource: string, action: string) => string;
    generateApiKey: (prefix?: string, length?: number) => string;
    hashApiKey: (apiKey: string) => string;
    validateApiKey: (providedKey: string, storedHash: string) => boolean;
    extractApiKeyFromHeader: (request: Request, headerName?: string) => string | null;
    generateOAuthState: () => string;
    validateOAuthState: (receivedState: string, storedState: string) => boolean;
    buildOAuthAuthUrl: (baseUrl: string, clientId: string, redirectUri: string, state: string, scopes?: string[]) => string;
    generateSessionId: () => string;
    createSessionData: (userId: string, expiresInMinutes?: number, metadata?: Record<string, any>) => SessionData;
    isSessionExpired: (session: SessionData) => boolean;
    updateSessionActivity: (session: SessionData) => SessionData;
    generateCsrfToken: () => string;
    validateCsrfToken: (providedToken: string, storedToken: string) => boolean;
    extractCsrfToken: (request: Request) => string | null;
    generateRateLimitKey: (identifier: string, action: string, prefix?: string) => string;
    calculateRateLimitReset: (windowMs: number) => Date;
    isRateLimitExceeded: (currentCount: number, maxRequests: number) => boolean;
    generateTotpSecret: () => string;
    generateBackupCodes: (count?: number) => string[];
};
export default _default;
//# sourceMappingURL=nestjs-auth-security-kit.d.ts.map