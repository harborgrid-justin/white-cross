/**
 * LOC: AUTHSEC1234567
 * File: /reuse/auth-security-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS authentication services
 *   - Authorization guards
 *   - Security middleware
 *   - RBAC implementations
 *   - Permission systems
 *   - Sequelize models
 */
interface JWTPayload {
    sub: string;
    email?: string;
    role?: string;
    roles?: string[];
    permissions?: string[];
    iat?: number;
    exp?: number;
    iss?: string;
    aud?: string;
    jti?: string;
    [key: string]: any;
}
interface JWTConfig {
    secret: string;
    expiresIn?: string | number;
    algorithm?: 'HS256' | 'HS384' | 'HS512' | 'RS256';
    issuer?: string;
    audience?: string;
    notBefore?: number;
}
interface RefreshTokenConfig {
    userId: string;
    deviceId?: string;
    sessionId?: string;
    familyId?: string;
    expiresIn?: string | number;
    metadata?: Record<string, any>;
}
interface SessionConfig {
    userId: string;
    ipAddress?: string;
    userAgent?: string;
    expiresIn?: number;
    metadata?: Record<string, any>;
}
interface SessionData {
    sessionId: string;
    userId: string;
    createdAt: Date;
    lastActivity: Date;
    expiresAt: Date;
    ipAddress?: string;
    userAgent?: string;
    metadata?: Record<string, any>;
}
interface OAuth2Config {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    scope?: string[];
    state?: string;
    responseType?: 'code' | 'token';
    grantType?: 'authorization_code' | 'client_credentials' | 'refresh_token' | 'password';
}
interface OAuth2TokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token?: string;
    scope?: string;
    id_token?: string;
}
interface OAuth2ClientCredentials {
    clientId: string;
    clientSecret: string;
    scope?: string[];
    audience?: string;
}
interface ApiKeyConfig {
    prefix?: string;
    length?: number;
    expiresIn?: number;
    permissions?: string[];
    metadata?: Record<string, any>;
}
interface ApiKeyData {
    key: string;
    hash: string;
    prefix?: string;
    userId?: string;
    permissions?: string[];
    createdAt: Date;
    expiresAt?: Date;
    lastUsed?: Date;
    metadata?: Record<string, any>;
}
interface TOTPResult {
    secret: string;
    qrCode: string;
    uri: string;
}
interface RolePermissions {
    role: string;
    permissions: string[];
    inherits?: string[];
}
interface AccessControlList {
    userId: string;
    roles: string[];
    permissions: string[];
    deniedPermissions?: string[];
}
interface SecurityHeaders {
    'Strict-Transport-Security'?: string;
    'X-Content-Type-Options'?: string;
    'X-Frame-Options'?: string;
    'X-XSS-Protection'?: string;
    'Content-Security-Policy'?: string;
    'Referrer-Policy'?: string;
    'Permissions-Policy'?: string;
}
interface RateLimitConfig {
    maxRequests: number;
    windowMs: number;
    identifier?: string;
    skipSuccessfulRequests?: boolean;
    skipFailedRequests?: boolean;
}
interface RateLimitStatus {
    remaining: number;
    limit: number;
    resetAt: Date;
    retryAfter?: number;
}
interface PasswordPolicy {
    minLength?: number;
    maxLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumbers?: boolean;
    requireSpecialChars?: boolean;
    preventCommon?: boolean;
    preventReuse?: number;
    maxAge?: number;
}
interface PasswordValidationResult {
    isValid: boolean;
    score: number;
    strength: 'weak' | 'fair' | 'good' | 'strong' | 'very-strong';
    feedback: string[];
    metadata?: Record<string, any>;
}
interface LoginAttemptRecord {
    userId?: string;
    email: string;
    ipAddress: string;
    userAgent?: string;
    success: boolean;
    timestamp: Date;
    failureReason?: string;
}
interface AccountLockoutPolicy {
    maxFailedAttempts: number;
    lockoutDurationMs: number;
    attemptWindowMs: number;
    progressiveLockout?: boolean;
}
/**
 * Sequelize User model attributes for authentication.
 *
 * @example
 * ```typescript
 * import { DataTypes, Model } from 'sequelize';
 *
 * class User extends Model {
 *   declare id: string;
 *   declare email: string;
 *   declare passwordHash: string;
 *   // ... other fields
 * }
 *
 * User.init(getUserModelAttributes(), {
 *   sequelize,
 *   tableName: 'users',
 *   timestamps: true
 * });
 * ```
 */
export declare const getUserModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    email: {
        type: string;
        allowNull: boolean;
        unique: boolean;
        validate: {
            isEmail: boolean;
        };
    };
    passwordHash: {
        type: string;
        allowNull: boolean;
    };
    passwordChangedAt: {
        type: string;
        allowNull: boolean;
    };
    passwordHistory: {
        type: string;
        allowNull: boolean;
        defaultValue: never[];
    };
    role: {
        type: string;
        allowNull: boolean;
        defaultValue: string;
    };
    isActive: {
        type: string;
        defaultValue: boolean;
    };
    isEmailVerified: {
        type: string;
        defaultValue: boolean;
    };
    mfaEnabled: {
        type: string;
        defaultValue: boolean;
    };
    mfaSecret: {
        type: string;
        allowNull: boolean;
    };
    failedLoginAttempts: {
        type: string;
        defaultValue: number;
    };
    lockedUntil: {
        type: string;
        allowNull: boolean;
    };
    lastLoginAt: {
        type: string;
        allowNull: boolean;
    };
    lastLoginIp: {
        type: string;
        allowNull: boolean;
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    updatedAt: {
        type: string;
        allowNull: boolean;
    };
};
/**
 * Sequelize Role model attributes for RBAC.
 *
 * @example
 * ```typescript
 * class Role extends Model {}
 * Role.init(getRoleModelAttributes(), {
 *   sequelize,
 *   tableName: 'roles',
 *   timestamps: true
 * });
 * ```
 */
export declare const getRoleModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    name: {
        type: string;
        allowNull: boolean;
        unique: boolean;
    };
    displayName: {
        type: string;
        allowNull: boolean;
    };
    description: {
        type: string;
        allowNull: boolean;
    };
    priority: {
        type: string;
        defaultValue: number;
    };
    isSystem: {
        type: string;
        defaultValue: boolean;
    };
    metadata: {
        type: string;
        defaultValue: {};
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    updatedAt: {
        type: string;
        allowNull: boolean;
    };
};
/**
 * Sequelize Permission model attributes for fine-grained access control.
 *
 * @example
 * ```typescript
 * class Permission extends Model {}
 * Permission.init(getPermissionModelAttributes(), {
 *   sequelize,
 *   tableName: 'permissions',
 *   timestamps: true
 * });
 * ```
 */
export declare const getPermissionModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    name: {
        type: string;
        allowNull: boolean;
        unique: boolean;
    };
    resource: {
        type: string;
        allowNull: boolean;
    };
    action: {
        type: string;
        allowNull: boolean;
    };
    description: {
        type: string;
        allowNull: boolean;
    };
    isSystem: {
        type: string;
        defaultValue: boolean;
    };
    metadata: {
        type: string;
        defaultValue: {};
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    updatedAt: {
        type: string;
        allowNull: boolean;
    };
};
/**
 * Sequelize Session model attributes for session management.
 *
 * @example
 * ```typescript
 * class Session extends Model {}
 * Session.init(getSessionModelAttributes(), {
 *   sequelize,
 *   tableName: 'sessions',
 *   timestamps: true
 * });
 * ```
 */
export declare const getSessionModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    sessionId: {
        type: string;
        allowNull: boolean;
        unique: boolean;
    };
    userId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    ipAddress: {
        type: string;
        allowNull: boolean;
    };
    userAgent: {
        type: string;
        allowNull: boolean;
    };
    deviceId: {
        type: string;
        allowNull: boolean;
    };
    lastActivity: {
        type: string;
        allowNull: boolean;
    };
    expiresAt: {
        type: string;
        allowNull: boolean;
    };
    metadata: {
        type: string;
        defaultValue: {};
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    updatedAt: {
        type: string;
        allowNull: boolean;
    };
};
/**
 * Sequelize RefreshToken model attributes for token rotation.
 *
 * @example
 * ```typescript
 * class RefreshToken extends Model {}
 * RefreshToken.init(getRefreshTokenModelAttributes(), {
 *   sequelize,
 *   tableName: 'refresh_tokens',
 *   timestamps: true
 * });
 * ```
 */
export declare const getRefreshTokenModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    tokenHash: {
        type: string;
        allowNull: boolean;
        unique: boolean;
    };
    userId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    deviceId: {
        type: string;
        allowNull: boolean;
    };
    sessionId: {
        type: string;
        allowNull: boolean;
    };
    familyId: {
        type: string;
        allowNull: boolean;
    };
    expiresAt: {
        type: string;
        allowNull: boolean;
    };
    revokedAt: {
        type: string;
        allowNull: boolean;
    };
    replacedBy: {
        type: string;
        allowNull: boolean;
    };
    metadata: {
        type: string;
        defaultValue: {};
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    updatedAt: {
        type: string;
        allowNull: boolean;
    };
};
/**
 * Sequelize ApiKey model attributes for API key management.
 *
 * @example
 * ```typescript
 * class ApiKey extends Model {}
 * ApiKey.init(getApiKeyModelAttributes(), {
 *   sequelize,
 *   tableName: 'api_keys',
 *   timestamps: true
 * });
 * ```
 */
export declare const getApiKeyModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    keyHash: {
        type: string;
        allowNull: boolean;
        unique: boolean;
    };
    prefix: {
        type: string;
        allowNull: boolean;
    };
    name: {
        type: string;
        allowNull: boolean;
    };
    userId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    permissions: {
        type: string;
        defaultValue: never[];
    };
    expiresAt: {
        type: string;
        allowNull: boolean;
    };
    lastUsed: {
        type: string;
        allowNull: boolean;
    };
    isActive: {
        type: string;
        defaultValue: boolean;
    };
    metadata: {
        type: string;
        defaultValue: {};
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    updatedAt: {
        type: string;
        allowNull: boolean;
    };
};
/**
 * Sequelize LoginAttempt model attributes for security tracking.
 *
 * @example
 * ```typescript
 * class LoginAttempt extends Model {}
 * LoginAttempt.init(getLoginAttemptModelAttributes(), {
 *   sequelize,
 *   tableName: 'login_attempts',
 *   timestamps: true
 * });
 * ```
 */
export declare const getLoginAttemptModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    userId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    email: {
        type: string;
        allowNull: boolean;
    };
    ipAddress: {
        type: string;
        allowNull: boolean;
    };
    userAgent: {
        type: string;
        allowNull: boolean;
    };
    success: {
        type: string;
        allowNull: boolean;
    };
    failureReason: {
        type: string;
        allowNull: boolean;
    };
    metadata: {
        type: string;
        defaultValue: {};
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
};
/**
 * Sequelize UserRole junction table for many-to-many relationship.
 *
 * @example
 * ```typescript
 * class UserRole extends Model {}
 * UserRole.init(getUserRoleModelAttributes(), {
 *   sequelize,
 *   tableName: 'user_roles',
 *   timestamps: true
 * });
 * ```
 */
export declare const getUserRoleModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    userId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    roleId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    grantedBy: {
        type: string;
        allowNull: boolean;
    };
    expiresAt: {
        type: string;
        allowNull: boolean;
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    updatedAt: {
        type: string;
        allowNull: boolean;
    };
};
/**
 * Sequelize RolePermission junction table for role-permission mapping.
 *
 * @example
 * ```typescript
 * class RolePermission extends Model {}
 * RolePermission.init(getRolePermissionModelAttributes(), {
 *   sequelize,
 *   tableName: 'role_permissions',
 *   timestamps: true
 * });
 * ```
 */
export declare const getRolePermissionModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    roleId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    permissionId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    updatedAt: {
        type: string;
        allowNull: boolean;
    };
};
/**
 * Creates a comprehensive JWT access token with all standard and custom claims.
 *
 * @param {JWTPayload} payload - Token payload with user data
 * @param {JWTConfig} config - JWT configuration with security settings
 * @returns {string} Signed JWT token
 *
 * @example
 * ```typescript
 * const token = createComprehensiveJWT(
 *   {
 *     sub: 'user123',
 *     email: 'doctor@whitecross.com',
 *     role: 'doctor',
 *     permissions: ['read:patients', 'write:prescriptions']
 *   },
 *   {
 *     secret: process.env.JWT_SECRET,
 *     expiresIn: '15m',
 *     issuer: 'white-cross-api',
 *     audience: 'white-cross-frontend',
 *     algorithm: 'HS256'
 *   }
 * );
 * ```
 */
export declare const createComprehensiveJWT: (payload: JWTPayload, config: JWTConfig) => string;
/**
 * Verifies JWT token with comprehensive validation checks.
 *
 * @param {string} token - JWT token to verify
 * @param {JWTConfig} config - Verification configuration
 * @returns {JWTPayload | null} Decoded payload or null if invalid
 *
 * @example
 * ```typescript
 * const payload = verifyComprehensiveJWT(token, {
 *   secret: process.env.JWT_SECRET,
 *   issuer: 'white-cross-api',
 *   audience: 'white-cross-frontend'
 * });
 * if (payload) {
 *   console.log('User:', payload.sub, 'Role:', payload.role);
 * }
 * ```
 */
export declare const verifyComprehensiveJWT: (token: string, config: JWTConfig) => JWTPayload | null;
/**
 * Extracts JWT claims without verification (for inspection only).
 *
 * @param {string} token - JWT token to decode
 * @returns {JWTPayload | null} Decoded payload or null if invalid format
 *
 * @example
 * ```typescript
 * const claims = extractJWTClaims(token);
 * console.log('Expires at:', new Date(claims.exp * 1000));
 * console.log('Issued at:', new Date(claims.iat * 1000));
 * ```
 */
export declare const extractJWTClaims: (token: string) => JWTPayload | null;
/**
 * Validates JWT token structure and format without verification.
 *
 * @param {string} token - JWT token to validate
 * @returns {boolean} True if token has valid structure
 *
 * @example
 * ```typescript
 * if (validateJWTStructure(token)) {
 *   console.log('Token has valid JWT structure');
 * }
 * ```
 */
export declare const validateJWTStructure: (token: string) => boolean;
/**
 * Checks if JWT token will expire within specified seconds.
 *
 * @param {string} token - JWT token to check
 * @param {number} withinSeconds - Time window in seconds
 * @returns {boolean} True if token expires within window
 *
 * @example
 * ```typescript
 * if (isJWTExpiringWithin(token, 300)) {
 *   console.log('Token expires in less than 5 minutes, refresh needed');
 * }
 * ```
 */
export declare const isJWTExpiringWithin: (token: string, withinSeconds: number) => boolean;
/**
 * Gets detailed JWT token information.
 *
 * @param {string} token - JWT token to analyze
 * @returns {object} Token metadata
 *
 * @example
 * ```typescript
 * const info = getJWTInfo(token);
 * console.log(info);
 * // {
 * //   isExpired: false,
 * //   expiresIn: 850,
 * //   issuedAt: Date,
 * //   expiresAt: Date,
 * //   age: 50
 * // }
 * ```
 */
export declare const getJWTInfo: (token: string) => any;
/**
 * Creates a comprehensive refresh token with metadata and tracking.
 *
 * @param {RefreshTokenConfig} config - Refresh token configuration
 * @param {string} secret - Secret key for signing
 * @returns {string} Refresh token
 *
 * @example
 * ```typescript
 * const refreshToken = createComprehensiveRefreshToken(
 *   {
 *     userId: 'user123',
 *     deviceId: 'device-abc',
 *     sessionId: 'session-xyz',
 *     familyId: 'family-123',
 *     expiresIn: '7d',
 *     metadata: { ipAddress: '192.168.1.1' }
 *   },
 *   process.env.REFRESH_SECRET
 * );
 * ```
 */
export declare const createComprehensiveRefreshToken: (config: RefreshTokenConfig, secret: string) => string;
/**
 * Validates refresh token with family tracking for rotation detection.
 *
 * @param {string} token - Refresh token to validate
 * @param {string} secret - Secret key for verification
 * @param {string} [expectedFamilyId] - Expected family ID for rotation check
 * @returns {JWTPayload | null} Token payload or null if invalid
 *
 * @example
 * ```typescript
 * const payload = validateRefreshToken(refreshToken, secret, familyId);
 * if (!payload) {
 *   // Token reuse detected - potential security breach
 *   revokeAllTokensInFamily(familyId);
 * }
 * ```
 */
export declare const validateRefreshToken: (token: string, secret: string, expectedFamilyId?: string) => JWTPayload | null;
/**
 * Rotates refresh token while maintaining family tracking.
 *
 * @param {string} oldToken - Old refresh token
 * @param {string} secret - Secret key
 * @param {string} newExpiresIn - New expiration time
 * @returns {object} New tokens with family ID
 *
 * @example
 * ```typescript
 * const { accessToken, refreshToken, familyId } = rotateRefreshToken(
 *   oldRefreshToken,
 *   secret,
 *   '7d'
 * );
 * ```
 */
export declare const rotateRefreshToken: (oldToken: string, secret: string, newExpiresIn?: string | number) => {
    accessToken: string;
    refreshToken: string;
    familyId: string;
} | null;
/**
 * Generates secure hash for refresh token storage.
 *
 * @param {string} token - Refresh token to hash
 * @param {string} [algorithm] - Hash algorithm (default: sha256)
 * @returns {string} Token hash
 *
 * @example
 * ```typescript
 * const hash = hashRefreshTokenSecure(refreshToken);
 * // Store hash in database for comparison
 * await db.refreshTokens.create({ userId, hash, familyId });
 * ```
 */
export declare const hashRefreshTokenSecure: (token: string, algorithm?: "sha256" | "sha512") => string;
/**
 * Creates comprehensive session with full metadata tracking.
 *
 * @param {SessionConfig} config - Session configuration
 * @returns {SessionData} Session data object
 *
 * @example
 * ```typescript
 * const session = createComprehensiveSession({
 *   userId: 'user123',
 *   ipAddress: '192.168.1.1',
 *   userAgent: 'Mozilla/5.0...',
 *   expiresIn: 86400000, // 24 hours
 *   metadata: { loginMethod: '2fa', deviceType: 'mobile' }
 * });
 * ```
 */
export declare const createComprehensiveSession: (config: SessionConfig) => SessionData;
/**
 * Validates session with comprehensive security checks.
 *
 * @param {SessionData} session - Session to validate
 * @param {object} [options] - Validation options
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const result = validateSession(session, {
 *   checkExpiration: true,
 *   maxIdleTime: 1800000, // 30 minutes
 *   ipAddress: request.ip
 * });
 * if (!result.valid) {
 *   console.log('Session invalid:', result.reason);
 * }
 * ```
 */
export declare const validateSession: (session: SessionData, options?: {
    checkExpiration?: boolean;
    maxIdleTime?: number;
    ipAddress?: string;
    strictIpCheck?: boolean;
}) => {
    valid: boolean;
    reason?: string;
};
/**
 * Updates session activity with sliding expiration.
 *
 * @param {SessionData} session - Session to update
 * @param {number} [slidingWindow] - Sliding window in milliseconds
 * @returns {SessionData} Updated session
 *
 * @example
 * ```typescript
 * const updated = updateSessionWithSliding(session, 1800000); // 30 min sliding
 * ```
 */
export declare const updateSessionWithSliding: (session: SessionData, slidingWindow?: number) => SessionData;
/**
 * Generates secure session ID with custom format.
 *
 * @param {string} [prefix] - Optional prefix (e.g., 'sess_')
 * @param {number} [length] - Length in bytes (default: 32)
 * @returns {string} Secure session ID
 *
 * @example
 * ```typescript
 * const sessionId = generateSecureSessionId('sess_', 32);
 * // Result: 'sess_a1b2c3d4e5f6...'
 * ```
 */
export declare const generateSecureSessionId: (prefix?: string, length?: number) => string;
/**
 * Generates OAuth 2.0 authorization URL with PKCE support.
 *
 * @param {OAuth2Config} config - OAuth configuration
 * @returns {object} Authorization URL and state
 *
 * @example
 * ```typescript
 * const { authUrl, state, codeVerifier } = generateOAuth2AuthorizationUrl({
 *   clientId: 'client123',
 *   clientSecret: 'secret',
 *   redirectUri: 'https://app.com/callback',
 *   scope: ['openid', 'profile', 'email']
 * });
 * // Redirect user to authUrl
 * ```
 */
export declare const generateOAuth2AuthorizationUrl: (config: OAuth2Config) => {
    authUrl: string;
    state: string;
    codeVerifier?: string;
};
/**
 * Exchanges OAuth 2.0 authorization code for access token.
 *
 * @param {string} code - Authorization code
 * @param {OAuth2Config} config - OAuth configuration
 * @param {string} [codeVerifier] - PKCE code verifier
 * @returns {Promise<OAuth2TokenResponse>} Token response
 *
 * @example
 * ```typescript
 * const tokens = await exchangeOAuth2Code(authCode, config, codeVerifier);
 * console.log('Access token:', tokens.access_token);
 * ```
 */
export declare const exchangeOAuth2Code: (code: string, config: OAuth2Config, codeVerifier?: string) => Promise<OAuth2TokenResponse>;
/**
 * Performs OAuth 2.0 client credentials flow.
 *
 * @param {OAuth2ClientCredentials} config - Client credentials configuration
 * @returns {Promise<OAuth2TokenResponse>} Token response
 *
 * @example
 * ```typescript
 * const tokens = await performOAuth2ClientCredentialsFlow({
 *   clientId: 'client123',
 *   clientSecret: 'secret',
 *   scope: ['api:read', 'api:write']
 * });
 * ```
 */
export declare const performOAuth2ClientCredentialsFlow: (config: OAuth2ClientCredentials) => Promise<OAuth2TokenResponse>;
/**
 * Validates OAuth 2.0 state parameter to prevent CSRF attacks.
 *
 * @param {string} receivedState - State from OAuth callback
 * @param {string} expectedState - State stored in session
 * @returns {boolean} True if states match
 *
 * @example
 * ```typescript
 * if (!validateOAuth2State(req.query.state, session.oauthState)) {
 *   throw new Error('Invalid OAuth state - possible CSRF attack');
 * }
 * ```
 */
export declare const validateOAuth2State: (receivedState: string, expectedState: string) => boolean;
/**
 * Generates TOTP secret with QR code data.
 *
 * @param {string} accountName - Account identifier (e.g., email)
 * @param {string} issuer - Service name
 * @returns {TOTPResult} TOTP setup data
 *
 * @example
 * ```typescript
 * const totp = generateTOTPSetup('doctor@whitecross.com', 'White Cross');
 * // Display QR code to user for scanning with authenticator app
 * ```
 */
export declare const generateTOTPSetup: (accountName: string, issuer: string) => TOTPResult;
/**
 * Generates TOTP code from secret at current time.
 *
 * @param {string} secret - TOTP secret (base32)
 * @param {number} [step] - Time step in seconds (default: 30)
 * @param {number} [offset] - Time offset for testing
 * @returns {string} 6-digit TOTP code
 *
 * @example
 * ```typescript
 * const code = generateTOTPCode(secret);
 * // Result: '123456'
 * ```
 */
export declare const generateTOTPCode: (secret: string, step?: number, offset?: number) => string;
/**
 * Verifies TOTP code with time window tolerance.
 *
 * @param {string} code - TOTP code to verify
 * @param {string} secret - TOTP secret
 * @param {number} [window] - Time window tolerance (default: 1)
 * @returns {boolean} True if code is valid
 *
 * @example
 * ```typescript
 * if (verifyTOTPCode(userCode, secret, 1)) {
 *   // 2FA verification successful
 *   grantAccess();
 * }
 * ```
 */
export declare const verifyTOTPCode: (code: string, secret: string, window?: number) => boolean;
/**
 * Generates recovery codes for 2FA backup.
 *
 * @param {number} [count] - Number of codes to generate
 * @param {number} [length] - Length of each code
 * @returns {string[]} Array of recovery codes
 *
 * @example
 * ```typescript
 * const codes = generate2FARecoveryCodes(10, 8);
 * // Result: ['A1B2C3D4', 'E5F6G7H8', ...]
 * ```
 */
export declare const generate2FARecoveryCodes: (count?: number, length?: number) => string[];
/**
 * Hashes 2FA recovery code for secure storage.
 *
 * @param {string} code - Recovery code
 * @returns {string} Hashed code
 *
 * @example
 * ```typescript
 * const hash = hash2FARecoveryCode('A1B2C3D4');
 * // Store hash in database
 * ```
 */
export declare const hash2FARecoveryCode: (code: string) => string;
/**
 * Creates RBAC role with permissions and inheritance.
 *
 * @param {string} role - Role name
 * @param {string[]} permissions - List of permissions
 * @param {string[]} [inherits] - Parent roles to inherit from
 * @returns {RolePermissions} Role configuration
 *
 * @example
 * ```typescript
 * const doctorRole = createRBACRole('doctor', [
 *   'read:patients',
 *   'write:prescriptions',
 *   'read:medical-records'
 * ], ['user']);
 * ```
 */
export declare const createRBACRole: (role: string, permissions: string[], inherits?: string[]) => RolePermissions;
/**
 * Checks if user has required permission with role inheritance.
 *
 * @param {AccessControlList} acl - User's access control list
 * @param {string} permission - Required permission
 * @param {RolePermissions[]} roleDefinitions - All role definitions
 * @returns {boolean} True if user has permission
 *
 * @example
 * ```typescript
 * const hasAccess = checkRBACPermission(
 *   { userId: 'user123', roles: ['doctor'], permissions: [] },
 *   'write:prescriptions',
 *   allRoleDefinitions
 * );
 * ```
 */
export declare const checkRBACPermission: (acl: AccessControlList, permission: string, roleDefinitions: RolePermissions[]) => boolean;
/**
 * Resolves all permissions from roles including inheritance.
 *
 * @param {string[]} roles - User's roles
 * @param {RolePermissions[]} roleDefinitions - All role definitions
 * @returns {string[]} All resolved permissions
 *
 * @example
 * ```typescript
 * const permissions = resolveRolePermissions(['doctor'], allRoleDefinitions);
 * // Returns all permissions from 'doctor' role and inherited roles
 * ```
 */
export declare const resolveRolePermissions: (roles: string[], roleDefinitions: RolePermissions[]) => string[];
/**
 * Checks multiple permissions with AND/OR logic.
 *
 * @param {AccessControlList} acl - User's access control list
 * @param {string[]} permissions - Required permissions
 * @param {RolePermissions[]} roleDefinitions - All role definitions
 * @param {'AND' | 'OR'} logic - Permission check logic
 * @returns {boolean} True if permissions check passes
 *
 * @example
 * ```typescript
 * const hasAllPermissions = checkMultiplePermissions(
 *   acl,
 *   ['read:patients', 'write:prescriptions'],
 *   roleDefinitions,
 *   'AND'
 * );
 * ```
 */
export declare const checkMultiplePermissions: (acl: AccessControlList, permissions: string[], roleDefinitions: RolePermissions[], logic?: "AND" | "OR") => boolean;
/**
 * Creates permission string from resource and action.
 *
 * @param {string} resource - Resource name
 * @param {string} action - Action name
 * @returns {string} Permission string
 *
 * @example
 * ```typescript
 * const permission = createPermissionString('patients', 'read');
 * // Result: 'read:patients'
 * ```
 */
export declare const createPermissionString: (resource: string, action: string) => string;
/**
 * Parses permission string into components.
 *
 * @param {string} permission - Permission string
 * @returns {object} Permission components
 *
 * @example
 * ```typescript
 * const { action, resource } = parsePermissionString('read:patients');
 * // Result: { action: 'read', resource: 'patients' }
 * ```
 */
export declare const parsePermissionString: (permission: string) => {
    action: string;
    resource: string;
} | null;
/**
 * Generates comprehensive API key with metadata.
 *
 * @param {ApiKeyConfig} [config] - API key configuration
 * @returns {ApiKeyData} Complete API key data
 *
 * @example
 * ```typescript
 * const apiKey = generateComprehensiveApiKey({
 *   prefix: 'wc_live_',
 *   length: 32,
 *   expiresIn: 31536000000, // 1 year
 *   permissions: ['read:api', 'write:webhooks']
 * });
 * ```
 */
export declare const generateComprehensiveApiKey: (config?: ApiKeyConfig) => ApiKeyData;
/**
 * Validates API key with comprehensive security checks.
 *
 * @param {string} providedKey - API key to validate
 * @param {ApiKeyData} storedKeyData - Stored API key data
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const result = validateComprehensiveApiKey(providedKey, storedKeyData);
 * if (!result.valid) {
 *   console.log('API key invalid:', result.reason);
 * }
 * ```
 */
export declare const validateComprehensiveApiKey: (providedKey: string, storedKeyData: ApiKeyData) => {
    valid: boolean;
    reason?: string;
};
/**
 * Checks if API key has specific permission.
 *
 * @param {ApiKeyData} apiKeyData - API key data
 * @param {string} permission - Required permission
 * @returns {boolean} True if API key has permission
 *
 * @example
 * ```typescript
 * if (checkApiKeyPermission(apiKeyData, 'write:webhooks')) {
 *   // Allow webhook creation
 * }
 * ```
 */
export declare const checkApiKeyPermission: (apiKeyData: ApiKeyData, permission: string) => boolean;
/**
 * Hashes password with bcrypt for secure storage.
 *
 * @param {string} password - Plain text password
 * @param {number} [saltRounds] - Bcrypt salt rounds (default: 12)
 * @returns {Promise<string>} Password hash
 *
 * @example
 * ```typescript
 * const hash = await hashPasswordBcrypt('MyP@ssw0rd123!');
 * // Store hash in database
 * ```
 */
export declare const hashPasswordBcrypt: (password: string, saltRounds?: number) => Promise<string>;
/**
 * Verifies password against bcrypt hash.
 *
 * @param {string} password - Plain text password
 * @param {string} hash - Bcrypt hash
 * @returns {Promise<boolean>} True if password matches
 *
 * @example
 * ```typescript
 * const isValid = await verifyPasswordBcrypt(providedPassword, storedHash);
 * ```
 */
export declare const verifyPasswordBcrypt: (password: string, hash: string) => Promise<boolean>;
/**
 * Hashes password with Argon2 for maximum security.
 *
 * @param {string} password - Plain text password
 * @param {object} [options] - Argon2 options
 * @returns {Promise<string>} Password hash
 *
 * @example
 * ```typescript
 * const hash = await hashPasswordArgon2('MyP@ssw0rd123!', {
 *   timeCost: 3,
 *   memoryCost: 65536
 * });
 * ```
 */
export declare const hashPasswordArgon2: (password: string, options?: {
    timeCost?: number;
    memoryCost?: number;
    parallelism?: number;
}) => Promise<string>;
/**
 * Verifies password against Argon2 hash.
 *
 * @param {string} password - Plain text password
 * @param {string} hash - Argon2 hash
 * @returns {Promise<boolean>} True if password matches
 *
 * @example
 * ```typescript
 * const isValid = await verifyPasswordArgon2(providedPassword, storedHash);
 * ```
 */
export declare const verifyPasswordArgon2: (password: string, hash: string) => Promise<boolean>;
/**
 * Validates password against comprehensive policy.
 *
 * @param {string} password - Password to validate
 * @param {PasswordPolicy} policy - Password policy rules
 * @returns {PasswordValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validatePasswordPolicy('MyP@ssw0rd123!', {
 *   minLength: 12,
 *   requireUppercase: true,
 *   requireNumbers: true,
 *   requireSpecialChars: true,
 *   preventCommon: true
 * });
 * ```
 */
export declare const validatePasswordPolicy: (password: string, policy: PasswordPolicy) => PasswordValidationResult;
/**
 * Generates strong password meeting policy requirements.
 *
 * @param {number} length - Password length
 * @param {PasswordPolicy} [policy] - Password policy
 * @returns {string} Generated password
 *
 * @example
 * ```typescript
 * const password = generateSecurePassword(16, {
 *   requireUppercase: true,
 *   requireNumbers: true,
 *   requireSpecialChars: true
 * });
 * ```
 */
export declare const generateSecurePassword: (length?: number, policy?: PasswordPolicy) => string;
/**
 * Tracks login attempt with comprehensive metadata.
 *
 * @param {string} email - User email
 * @param {boolean} success - Whether login succeeded
 * @param {string} ipAddress - IP address
 * @param {object} [metadata] - Additional metadata
 * @returns {LoginAttemptRecord} Login attempt record
 *
 * @example
 * ```typescript
 * const attempt = trackLoginAttempt('user@example.com', false, '192.168.1.1', {
 *   userAgent: req.headers['user-agent'],
 *   failureReason: 'invalid_password'
 * });
 * ```
 */
export declare const trackLoginAttempt: (email: string, success: boolean, ipAddress: string, metadata?: {
    userAgent?: string;
    failureReason?: string;
}) => LoginAttemptRecord;
/**
 * Checks if account should be locked based on failed attempts.
 *
 * @param {number} failedAttempts - Number of failed attempts
 * @param {AccountLockoutPolicy} policy - Lockout policy
 * @returns {object} Lockout decision
 *
 * @example
 * ```typescript
 * const result = shouldLockAccount(5, {
 *   maxFailedAttempts: 5,
 *   lockoutDurationMs: 1800000, // 30 minutes
 *   attemptWindowMs: 900000 // 15 minutes
 * });
 * if (result.shouldLock) {
 *   // Lock account until result.lockUntil
 * }
 * ```
 */
export declare const shouldLockAccount: (failedAttempts: number, policy: AccountLockoutPolicy) => {
    shouldLock: boolean;
    lockUntil?: Date;
    lockDurationMs?: number;
};
/**
 * Checks if account is currently locked.
 *
 * @param {Date | null} lockedUntil - Lock expiration date
 * @returns {object} Lock status
 *
 * @example
 * ```typescript
 * const status = isAccountLocked(user.lockedUntil);
 * if (status.isLocked) {
 *   throw new Error(`Account locked for ${status.remainingSeconds} seconds`);
 * }
 * ```
 */
export declare const isAccountLocked: (lockedUntil: Date | null) => {
    isLocked: boolean;
    remainingSeconds?: number;
};
/**
 * Resets failed login attempts after successful login.
 *
 * @param {number} currentAttempts - Current failed attempts
 * @returns {number} Reset attempt count (0)
 *
 * @example
 * ```typescript
 * user.failedLoginAttempts = resetFailedLoginAttempts(user.failedLoginAttempts);
 * user.lockedUntil = null;
 * await user.save();
 * ```
 */
export declare const resetFailedLoginAttempts: (currentAttempts: number) => number;
/**
 * Generates comprehensive security headers for HTTP responses.
 *
 * @param {object} [options] - Header configuration options
 * @returns {SecurityHeaders} Security headers object
 *
 * @example
 * ```typescript
 * const headers = generateSecurityHeaders({
 *   hsts: { maxAge: 31536000, includeSubDomains: true },
 *   csp: {
 *     directives: {
 *       defaultSrc: ["'self'"],
 *       scriptSrc: ["'self'", "'unsafe-inline'"]
 *     }
 *   }
 * });
 * ```
 */
export declare const generateSecurityHeaders: (options?: any) => SecurityHeaders;
/**
 * Checks if request should be rate limited.
 *
 * @param {string} identifier - Rate limit identifier (e.g., user ID or IP)
 * @param {RateLimitConfig} config - Rate limit configuration
 * @param {Map<string, any>} store - Rate limit storage
 * @returns {RateLimitStatus} Rate limit status
 *
 * @example
 * ```typescript
 * const status = checkRateLimit('user123', {
 *   maxRequests: 100,
 *   windowMs: 900000 // 15 minutes
 * }, rateLimitStore);
 * if (status.remaining === 0) {
 *   throw new Error('Rate limit exceeded');
 * }
 * ```
 */
export declare const checkRateLimit: (identifier: string, config: RateLimitConfig, store: Map<string, any>) => RateLimitStatus;
declare const _default: {
    getUserModelAttributes: () => {
        id: {
            type: string;
            defaultValue: string;
            primaryKey: boolean;
        };
        email: {
            type: string;
            allowNull: boolean;
            unique: boolean;
            validate: {
                isEmail: boolean;
            };
        };
        passwordHash: {
            type: string;
            allowNull: boolean;
        };
        passwordChangedAt: {
            type: string;
            allowNull: boolean;
        };
        passwordHistory: {
            type: string;
            allowNull: boolean;
            defaultValue: never[];
        };
        role: {
            type: string;
            allowNull: boolean;
            defaultValue: string;
        };
        isActive: {
            type: string;
            defaultValue: boolean;
        };
        isEmailVerified: {
            type: string;
            defaultValue: boolean;
        };
        mfaEnabled: {
            type: string;
            defaultValue: boolean;
        };
        mfaSecret: {
            type: string;
            allowNull: boolean;
        };
        failedLoginAttempts: {
            type: string;
            defaultValue: number;
        };
        lockedUntil: {
            type: string;
            allowNull: boolean;
        };
        lastLoginAt: {
            type: string;
            allowNull: boolean;
        };
        lastLoginIp: {
            type: string;
            allowNull: boolean;
        };
        createdAt: {
            type: string;
            allowNull: boolean;
        };
        updatedAt: {
            type: string;
            allowNull: boolean;
        };
    };
    getRoleModelAttributes: () => {
        id: {
            type: string;
            defaultValue: string;
            primaryKey: boolean;
        };
        name: {
            type: string;
            allowNull: boolean;
            unique: boolean;
        };
        displayName: {
            type: string;
            allowNull: boolean;
        };
        description: {
            type: string;
            allowNull: boolean;
        };
        priority: {
            type: string;
            defaultValue: number;
        };
        isSystem: {
            type: string;
            defaultValue: boolean;
        };
        metadata: {
            type: string;
            defaultValue: {};
        };
        createdAt: {
            type: string;
            allowNull: boolean;
        };
        updatedAt: {
            type: string;
            allowNull: boolean;
        };
    };
    getPermissionModelAttributes: () => {
        id: {
            type: string;
            defaultValue: string;
            primaryKey: boolean;
        };
        name: {
            type: string;
            allowNull: boolean;
            unique: boolean;
        };
        resource: {
            type: string;
            allowNull: boolean;
        };
        action: {
            type: string;
            allowNull: boolean;
        };
        description: {
            type: string;
            allowNull: boolean;
        };
        isSystem: {
            type: string;
            defaultValue: boolean;
        };
        metadata: {
            type: string;
            defaultValue: {};
        };
        createdAt: {
            type: string;
            allowNull: boolean;
        };
        updatedAt: {
            type: string;
            allowNull: boolean;
        };
    };
    getSessionModelAttributes: () => {
        id: {
            type: string;
            defaultValue: string;
            primaryKey: boolean;
        };
        sessionId: {
            type: string;
            allowNull: boolean;
            unique: boolean;
        };
        userId: {
            type: string;
            allowNull: boolean;
            references: {
                model: string;
                key: string;
            };
        };
        ipAddress: {
            type: string;
            allowNull: boolean;
        };
        userAgent: {
            type: string;
            allowNull: boolean;
        };
        deviceId: {
            type: string;
            allowNull: boolean;
        };
        lastActivity: {
            type: string;
            allowNull: boolean;
        };
        expiresAt: {
            type: string;
            allowNull: boolean;
        };
        metadata: {
            type: string;
            defaultValue: {};
        };
        createdAt: {
            type: string;
            allowNull: boolean;
        };
        updatedAt: {
            type: string;
            allowNull: boolean;
        };
    };
    getRefreshTokenModelAttributes: () => {
        id: {
            type: string;
            defaultValue: string;
            primaryKey: boolean;
        };
        tokenHash: {
            type: string;
            allowNull: boolean;
            unique: boolean;
        };
        userId: {
            type: string;
            allowNull: boolean;
            references: {
                model: string;
                key: string;
            };
        };
        deviceId: {
            type: string;
            allowNull: boolean;
        };
        sessionId: {
            type: string;
            allowNull: boolean;
        };
        familyId: {
            type: string;
            allowNull: boolean;
        };
        expiresAt: {
            type: string;
            allowNull: boolean;
        };
        revokedAt: {
            type: string;
            allowNull: boolean;
        };
        replacedBy: {
            type: string;
            allowNull: boolean;
        };
        metadata: {
            type: string;
            defaultValue: {};
        };
        createdAt: {
            type: string;
            allowNull: boolean;
        };
        updatedAt: {
            type: string;
            allowNull: boolean;
        };
    };
    getApiKeyModelAttributes: () => {
        id: {
            type: string;
            defaultValue: string;
            primaryKey: boolean;
        };
        keyHash: {
            type: string;
            allowNull: boolean;
            unique: boolean;
        };
        prefix: {
            type: string;
            allowNull: boolean;
        };
        name: {
            type: string;
            allowNull: boolean;
        };
        userId: {
            type: string;
            allowNull: boolean;
            references: {
                model: string;
                key: string;
            };
        };
        permissions: {
            type: string;
            defaultValue: never[];
        };
        expiresAt: {
            type: string;
            allowNull: boolean;
        };
        lastUsed: {
            type: string;
            allowNull: boolean;
        };
        isActive: {
            type: string;
            defaultValue: boolean;
        };
        metadata: {
            type: string;
            defaultValue: {};
        };
        createdAt: {
            type: string;
            allowNull: boolean;
        };
        updatedAt: {
            type: string;
            allowNull: boolean;
        };
    };
    getLoginAttemptModelAttributes: () => {
        id: {
            type: string;
            defaultValue: string;
            primaryKey: boolean;
        };
        userId: {
            type: string;
            allowNull: boolean;
            references: {
                model: string;
                key: string;
            };
        };
        email: {
            type: string;
            allowNull: boolean;
        };
        ipAddress: {
            type: string;
            allowNull: boolean;
        };
        userAgent: {
            type: string;
            allowNull: boolean;
        };
        success: {
            type: string;
            allowNull: boolean;
        };
        failureReason: {
            type: string;
            allowNull: boolean;
        };
        metadata: {
            type: string;
            defaultValue: {};
        };
        createdAt: {
            type: string;
            allowNull: boolean;
        };
    };
    getUserRoleModelAttributes: () => {
        id: {
            type: string;
            defaultValue: string;
            primaryKey: boolean;
        };
        userId: {
            type: string;
            allowNull: boolean;
            references: {
                model: string;
                key: string;
            };
        };
        roleId: {
            type: string;
            allowNull: boolean;
            references: {
                model: string;
                key: string;
            };
        };
        grantedBy: {
            type: string;
            allowNull: boolean;
        };
        expiresAt: {
            type: string;
            allowNull: boolean;
        };
        createdAt: {
            type: string;
            allowNull: boolean;
        };
        updatedAt: {
            type: string;
            allowNull: boolean;
        };
    };
    getRolePermissionModelAttributes: () => {
        id: {
            type: string;
            defaultValue: string;
            primaryKey: boolean;
        };
        roleId: {
            type: string;
            allowNull: boolean;
            references: {
                model: string;
                key: string;
            };
        };
        permissionId: {
            type: string;
            allowNull: boolean;
            references: {
                model: string;
                key: string;
            };
        };
        createdAt: {
            type: string;
            allowNull: boolean;
        };
        updatedAt: {
            type: string;
            allowNull: boolean;
        };
    };
    createComprehensiveJWT: (payload: JWTPayload, config: JWTConfig) => string;
    verifyComprehensiveJWT: (token: string, config: JWTConfig) => JWTPayload | null;
    extractJWTClaims: (token: string) => JWTPayload | null;
    validateJWTStructure: (token: string) => boolean;
    isJWTExpiringWithin: (token: string, withinSeconds: number) => boolean;
    getJWTInfo: (token: string) => any;
    createComprehensiveRefreshToken: (config: RefreshTokenConfig, secret: string) => string;
    validateRefreshToken: (token: string, secret: string, expectedFamilyId?: string) => JWTPayload | null;
    rotateRefreshToken: (oldToken: string, secret: string, newExpiresIn?: string | number) => {
        accessToken: string;
        refreshToken: string;
        familyId: string;
    } | null;
    hashRefreshTokenSecure: (token: string, algorithm?: "sha256" | "sha512") => string;
    createComprehensiveSession: (config: SessionConfig) => SessionData;
    validateSession: (session: SessionData, options?: {
        checkExpiration?: boolean;
        maxIdleTime?: number;
        ipAddress?: string;
        strictIpCheck?: boolean;
    }) => {
        valid: boolean;
        reason?: string;
    };
    updateSessionWithSliding: (session: SessionData, slidingWindow?: number) => SessionData;
    generateSecureSessionId: (prefix?: string, length?: number) => string;
    generateOAuth2AuthorizationUrl: (config: OAuth2Config) => {
        authUrl: string;
        state: string;
        codeVerifier?: string;
    };
    exchangeOAuth2Code: (code: string, config: OAuth2Config, codeVerifier?: string) => Promise<OAuth2TokenResponse>;
    performOAuth2ClientCredentialsFlow: (config: OAuth2ClientCredentials) => Promise<OAuth2TokenResponse>;
    validateOAuth2State: (receivedState: string, expectedState: string) => boolean;
    generateTOTPSetup: (accountName: string, issuer: string) => TOTPResult;
    generateTOTPCode: (secret: string, step?: number, offset?: number) => string;
    verifyTOTPCode: (code: string, secret: string, window?: number) => boolean;
    generate2FARecoveryCodes: (count?: number, length?: number) => string[];
    hash2FARecoveryCode: (code: string) => string;
    createRBACRole: (role: string, permissions: string[], inherits?: string[]) => RolePermissions;
    checkRBACPermission: (acl: AccessControlList, permission: string, roleDefinitions: RolePermissions[]) => boolean;
    resolveRolePermissions: (roles: string[], roleDefinitions: RolePermissions[]) => string[];
    checkMultiplePermissions: (acl: AccessControlList, permissions: string[], roleDefinitions: RolePermissions[], logic?: "AND" | "OR") => boolean;
    createPermissionString: (resource: string, action: string) => string;
    parsePermissionString: (permission: string) => {
        action: string;
        resource: string;
    } | null;
    generateComprehensiveApiKey: (config?: ApiKeyConfig) => ApiKeyData;
    validateComprehensiveApiKey: (providedKey: string, storedKeyData: ApiKeyData) => {
        valid: boolean;
        reason?: string;
    };
    checkApiKeyPermission: (apiKeyData: ApiKeyData, permission: string) => boolean;
    hashPasswordBcrypt: (password: string, saltRounds?: number) => Promise<string>;
    verifyPasswordBcrypt: (password: string, hash: string) => Promise<boolean>;
    hashPasswordArgon2: (password: string, options?: {
        timeCost?: number;
        memoryCost?: number;
        parallelism?: number;
    }) => Promise<string>;
    verifyPasswordArgon2: (password: string, hash: string) => Promise<boolean>;
    validatePasswordPolicy: (password: string, policy: PasswordPolicy) => PasswordValidationResult;
    generateSecurePassword: (length?: number, policy?: PasswordPolicy) => string;
    trackLoginAttempt: (email: string, success: boolean, ipAddress: string, metadata?: {
        userAgent?: string;
        failureReason?: string;
    }) => LoginAttemptRecord;
    shouldLockAccount: (failedAttempts: number, policy: AccountLockoutPolicy) => {
        shouldLock: boolean;
        lockUntil?: Date;
        lockDurationMs?: number;
    };
    isAccountLocked: (lockedUntil: Date | null) => {
        isLocked: boolean;
        remainingSeconds?: number;
    };
    resetFailedLoginAttempts: (currentAttempts: number) => number;
    generateSecurityHeaders: (options?: any) => SecurityHeaders;
    checkRateLimit: (identifier: string, config: RateLimitConfig, store: Map<string, any>) => RateLimitStatus;
};
export default _default;
//# sourceMappingURL=auth-security-kit.d.ts.map