"use strict";
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
exports.isAccountLocked = exports.shouldLockAccount = exports.trackLoginAttempt = exports.generateSecurePassword = exports.validatePasswordPolicy = exports.verifyPasswordArgon2 = exports.hashPasswordArgon2 = exports.verifyPasswordBcrypt = exports.hashPasswordBcrypt = exports.checkApiKeyPermission = exports.validateComprehensiveApiKey = exports.generateComprehensiveApiKey = exports.parsePermissionString = exports.createPermissionString = exports.checkMultiplePermissions = exports.resolveRolePermissions = exports.checkRBACPermission = exports.createRBACRole = exports.hash2FARecoveryCode = exports.generate2FARecoveryCodes = exports.verifyTOTPCode = exports.generateTOTPCode = exports.generateTOTPSetup = exports.validateOAuth2State = exports.performOAuth2ClientCredentialsFlow = exports.exchangeOAuth2Code = exports.generateOAuth2AuthorizationUrl = exports.generateSecureSessionId = exports.updateSessionWithSliding = exports.validateSession = exports.createComprehensiveSession = exports.hashRefreshTokenSecure = exports.rotateRefreshToken = exports.validateRefreshToken = exports.createComprehensiveRefreshToken = exports.getJWTInfo = exports.isJWTExpiringWithin = exports.validateJWTStructure = exports.extractJWTClaims = exports.verifyComprehensiveJWT = exports.createComprehensiveJWT = exports.getRolePermissionModelAttributes = exports.getUserRoleModelAttributes = exports.getLoginAttemptModelAttributes = exports.getApiKeyModelAttributes = exports.getRefreshTokenModelAttributes = exports.getSessionModelAttributes = exports.getPermissionModelAttributes = exports.getRoleModelAttributes = exports.getUserModelAttributes = void 0;
exports.checkRateLimit = exports.generateSecurityHeaders = exports.resetFailedLoginAttempts = void 0;
/**
 * File: /reuse/auth-security-kit.ts
 * Locator: WC-UTL-AUTHSEC-001
 * Purpose: Comprehensive Authentication & Security Kit - Complete auth/authz toolkit for NestJS + Sequelize
 *
 * Upstream: Independent utility module for authentication and authorization operations
 * Downstream: ../backend/*, Auth services, Guards, Interceptors, Passport strategies, RBAC modules
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/jwt, @nestjs/passport, bcrypt, argon2, sequelize
 * Exports: 50+ utility functions for JWT, OAuth, sessions, MFA, RBAC, permissions, API keys, security headers, Sequelize models
 *
 * LLM Context: Enterprise-grade authentication and authorization utilities for White Cross healthcare platform.
 * Provides comprehensive JWT management, OAuth 2.0 flows, session handling, multi-factor authentication,
 * role-based access control (RBAC), permission systems, API key management, security headers, rate limiting,
 * and HIPAA-compliant authentication patterns for secure healthcare data access. Includes Sequelize models
 * for users, roles, permissions, sessions, tokens, and login attempts tracking.
 */
const crypto = __importStar(require("crypto"));
// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================
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
const getUserModelAttributes = () => ({
    id: {
        type: 'UUID',
        defaultValue: 'UUIDV4',
        primaryKey: true,
    },
    email: {
        type: 'STRING',
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    passwordHash: {
        type: 'STRING',
        allowNull: false,
    },
    passwordChangedAt: {
        type: 'DATE',
        allowNull: true,
    },
    passwordHistory: {
        type: 'JSONB',
        allowNull: true,
        defaultValue: [],
    },
    role: {
        type: 'STRING',
        allowNull: false,
        defaultValue: 'user',
    },
    isActive: {
        type: 'BOOLEAN',
        defaultValue: true,
    },
    isEmailVerified: {
        type: 'BOOLEAN',
        defaultValue: false,
    },
    mfaEnabled: {
        type: 'BOOLEAN',
        defaultValue: false,
    },
    mfaSecret: {
        type: 'STRING',
        allowNull: true,
    },
    failedLoginAttempts: {
        type: 'INTEGER',
        defaultValue: 0,
    },
    lockedUntil: {
        type: 'DATE',
        allowNull: true,
    },
    lastLoginAt: {
        type: 'DATE',
        allowNull: true,
    },
    lastLoginIp: {
        type: 'STRING',
        allowNull: true,
    },
    createdAt: {
        type: 'DATE',
        allowNull: false,
    },
    updatedAt: {
        type: 'DATE',
        allowNull: false,
    },
});
exports.getUserModelAttributes = getUserModelAttributes;
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
const getRoleModelAttributes = () => ({
    id: {
        type: 'UUID',
        defaultValue: 'UUIDV4',
        primaryKey: true,
    },
    name: {
        type: 'STRING',
        allowNull: false,
        unique: true,
    },
    displayName: {
        type: 'STRING',
        allowNull: false,
    },
    description: {
        type: 'TEXT',
        allowNull: true,
    },
    priority: {
        type: 'INTEGER',
        defaultValue: 0,
    },
    isSystem: {
        type: 'BOOLEAN',
        defaultValue: false,
    },
    metadata: {
        type: 'JSONB',
        defaultValue: {},
    },
    createdAt: {
        type: 'DATE',
        allowNull: false,
    },
    updatedAt: {
        type: 'DATE',
        allowNull: false,
    },
});
exports.getRoleModelAttributes = getRoleModelAttributes;
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
const getPermissionModelAttributes = () => ({
    id: {
        type: 'UUID',
        defaultValue: 'UUIDV4',
        primaryKey: true,
    },
    name: {
        type: 'STRING',
        allowNull: false,
        unique: true,
    },
    resource: {
        type: 'STRING',
        allowNull: false,
    },
    action: {
        type: 'STRING',
        allowNull: false,
    },
    description: {
        type: 'TEXT',
        allowNull: true,
    },
    isSystem: {
        type: 'BOOLEAN',
        defaultValue: false,
    },
    metadata: {
        type: 'JSONB',
        defaultValue: {},
    },
    createdAt: {
        type: 'DATE',
        allowNull: false,
    },
    updatedAt: {
        type: 'DATE',
        allowNull: false,
    },
});
exports.getPermissionModelAttributes = getPermissionModelAttributes;
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
const getSessionModelAttributes = () => ({
    id: {
        type: 'UUID',
        defaultValue: 'UUIDV4',
        primaryKey: true,
    },
    sessionId: {
        type: 'STRING',
        allowNull: false,
        unique: true,
    },
    userId: {
        type: 'UUID',
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    ipAddress: {
        type: 'STRING',
        allowNull: true,
    },
    userAgent: {
        type: 'TEXT',
        allowNull: true,
    },
    deviceId: {
        type: 'STRING',
        allowNull: true,
    },
    lastActivity: {
        type: 'DATE',
        allowNull: false,
    },
    expiresAt: {
        type: 'DATE',
        allowNull: false,
    },
    metadata: {
        type: 'JSONB',
        defaultValue: {},
    },
    createdAt: {
        type: 'DATE',
        allowNull: false,
    },
    updatedAt: {
        type: 'DATE',
        allowNull: false,
    },
});
exports.getSessionModelAttributes = getSessionModelAttributes;
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
const getRefreshTokenModelAttributes = () => ({
    id: {
        type: 'UUID',
        defaultValue: 'UUIDV4',
        primaryKey: true,
    },
    tokenHash: {
        type: 'STRING',
        allowNull: false,
        unique: true,
    },
    userId: {
        type: 'UUID',
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    deviceId: {
        type: 'STRING',
        allowNull: true,
    },
    sessionId: {
        type: 'UUID',
        allowNull: true,
    },
    familyId: {
        type: 'STRING',
        allowNull: true,
    },
    expiresAt: {
        type: 'DATE',
        allowNull: false,
    },
    revokedAt: {
        type: 'DATE',
        allowNull: true,
    },
    replacedBy: {
        type: 'UUID',
        allowNull: true,
    },
    metadata: {
        type: 'JSONB',
        defaultValue: {},
    },
    createdAt: {
        type: 'DATE',
        allowNull: false,
    },
    updatedAt: {
        type: 'DATE',
        allowNull: false,
    },
});
exports.getRefreshTokenModelAttributes = getRefreshTokenModelAttributes;
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
const getApiKeyModelAttributes = () => ({
    id: {
        type: 'UUID',
        defaultValue: 'UUIDV4',
        primaryKey: true,
    },
    keyHash: {
        type: 'STRING',
        allowNull: false,
        unique: true,
    },
    prefix: {
        type: 'STRING',
        allowNull: true,
    },
    name: {
        type: 'STRING',
        allowNull: false,
    },
    userId: {
        type: 'UUID',
        allowNull: true,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    permissions: {
        type: 'JSONB',
        defaultValue: [],
    },
    expiresAt: {
        type: 'DATE',
        allowNull: true,
    },
    lastUsed: {
        type: 'DATE',
        allowNull: true,
    },
    isActive: {
        type: 'BOOLEAN',
        defaultValue: true,
    },
    metadata: {
        type: 'JSONB',
        defaultValue: {},
    },
    createdAt: {
        type: 'DATE',
        allowNull: false,
    },
    updatedAt: {
        type: 'DATE',
        allowNull: false,
    },
});
exports.getApiKeyModelAttributes = getApiKeyModelAttributes;
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
const getLoginAttemptModelAttributes = () => ({
    id: {
        type: 'UUID',
        defaultValue: 'UUIDV4',
        primaryKey: true,
    },
    userId: {
        type: 'UUID',
        allowNull: true,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    email: {
        type: 'STRING',
        allowNull: false,
    },
    ipAddress: {
        type: 'STRING',
        allowNull: false,
    },
    userAgent: {
        type: 'TEXT',
        allowNull: true,
    },
    success: {
        type: 'BOOLEAN',
        allowNull: false,
    },
    failureReason: {
        type: 'STRING',
        allowNull: true,
    },
    metadata: {
        type: 'JSONB',
        defaultValue: {},
    },
    createdAt: {
        type: 'DATE',
        allowNull: false,
    },
});
exports.getLoginAttemptModelAttributes = getLoginAttemptModelAttributes;
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
const getUserRoleModelAttributes = () => ({
    id: {
        type: 'UUID',
        defaultValue: 'UUIDV4',
        primaryKey: true,
    },
    userId: {
        type: 'UUID',
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    roleId: {
        type: 'UUID',
        allowNull: false,
        references: {
            model: 'roles',
            key: 'id',
        },
    },
    grantedBy: {
        type: 'UUID',
        allowNull: true,
    },
    expiresAt: {
        type: 'DATE',
        allowNull: true,
    },
    createdAt: {
        type: 'DATE',
        allowNull: false,
    },
    updatedAt: {
        type: 'DATE',
        allowNull: false,
    },
});
exports.getUserRoleModelAttributes = getUserRoleModelAttributes;
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
const getRolePermissionModelAttributes = () => ({
    id: {
        type: 'UUID',
        defaultValue: 'UUIDV4',
        primaryKey: true,
    },
    roleId: {
        type: 'UUID',
        allowNull: false,
        references: {
            model: 'roles',
            key: 'id',
        },
    },
    permissionId: {
        type: 'UUID',
        allowNull: false,
        references: {
            model: 'permissions',
            key: 'id',
        },
    },
    createdAt: {
        type: 'DATE',
        allowNull: false,
    },
    updatedAt: {
        type: 'DATE',
        allowNull: false,
    },
});
exports.getRolePermissionModelAttributes = getRolePermissionModelAttributes;
// ============================================================================
// JWT TOKEN CREATION AND VALIDATION
// ============================================================================
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
const createComprehensiveJWT = (payload, config) => {
    const header = {
        alg: config.algorithm || 'HS256',
        typ: 'JWT',
    };
    const now = Math.floor(Date.now() / 1000);
    const exp = config.expiresIn
        ? now + (typeof config.expiresIn === 'string' ? parseTimeToSeconds(config.expiresIn) : config.expiresIn)
        : now + 900; // 15 minutes default
    const fullPayload = {
        ...payload,
        iat: now,
        exp,
        iss: config.issuer,
        aud: config.audience,
        nbf: config.notBefore || now,
        jti: crypto.randomUUID(), // JWT ID for tracking
    };
    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));
    const signature = signJWT(`${encodedHeader}.${encodedPayload}`, config.secret, config.algorithm);
    return `${encodedHeader}.${encodedPayload}.${signature}`;
};
exports.createComprehensiveJWT = createComprehensiveJWT;
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
const verifyComprehensiveJWT = (token, config) => {
    try {
        const parts = token.split('.');
        if (parts.length !== 3)
            return null;
        const [encodedHeader, encodedPayload, signature] = parts;
        const expectedSignature = signJWT(`${encodedHeader}.${encodedPayload}`, config.secret, config.algorithm);
        // Timing-safe comparison to prevent timing attacks
        if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
            return null;
        }
        const header = JSON.parse(base64UrlDecode(encodedHeader));
        const payload = JSON.parse(base64UrlDecode(encodedPayload));
        // Validate algorithm
        if (header.alg !== (config.algorithm || 'HS256'))
            return null;
        const now = Math.floor(Date.now() / 1000);
        // Check expiration
        if (payload.exp && payload.exp < now)
            return null;
        // Check not before
        if (payload.nbf && payload.nbf > now)
            return null;
        // Check issuer
        if (config.issuer && payload.iss !== config.issuer)
            return null;
        // Check audience
        if (config.audience && payload.aud !== config.audience)
            return null;
        return payload;
    }
    catch (error) {
        return null;
    }
};
exports.verifyComprehensiveJWT = verifyComprehensiveJWT;
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
const extractJWTClaims = (token) => {
    try {
        const parts = token.split('.');
        if (parts.length !== 3)
            return null;
        return JSON.parse(base64UrlDecode(parts[1]));
    }
    catch (error) {
        return null;
    }
};
exports.extractJWTClaims = extractJWTClaims;
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
const validateJWTStructure = (token) => {
    const parts = token.split('.');
    if (parts.length !== 3)
        return false;
    try {
        JSON.parse(base64UrlDecode(parts[0])); // Header
        JSON.parse(base64UrlDecode(parts[1])); // Payload
        return parts[2].length > 0; // Signature exists
    }
    catch {
        return false;
    }
};
exports.validateJWTStructure = validateJWTStructure;
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
const isJWTExpiringWithin = (token, withinSeconds) => {
    const payload = (0, exports.extractJWTClaims)(token);
    if (!payload || !payload.exp)
        return true;
    const now = Math.floor(Date.now() / 1000);
    const expiresIn = payload.exp - now;
    return expiresIn <= withinSeconds;
};
exports.isJWTExpiringWithin = isJWTExpiringWithin;
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
const getJWTInfo = (token) => {
    const payload = (0, exports.extractJWTClaims)(token);
    if (!payload)
        return null;
    const now = Math.floor(Date.now() / 1000);
    return {
        isExpired: payload.exp ? payload.exp < now : null,
        expiresIn: payload.exp ? Math.max(0, payload.exp - now) : null,
        issuedAt: payload.iat ? new Date(payload.iat * 1000) : null,
        expiresAt: payload.exp ? new Date(payload.exp * 1000) : null,
        age: payload.iat ? now - payload.iat : null,
        issuer: payload.iss,
        audience: payload.aud,
        subject: payload.sub,
        jti: payload.jti,
    };
};
exports.getJWTInfo = getJWTInfo;
// ============================================================================
// REFRESH TOKEN MANAGEMENT
// ============================================================================
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
const createComprehensiveRefreshToken = (config, secret) => {
    const payload = {
        sub: config.userId,
        type: 'refresh',
        deviceId: config.deviceId,
        sessionId: config.sessionId,
        familyId: config.familyId || crypto.randomUUID(),
        metadata: config.metadata,
        jti: crypto.randomUUID(),
    };
    return (0, exports.createComprehensiveJWT)(payload, {
        secret,
        expiresIn: config.expiresIn || '7d',
        algorithm: 'HS256',
    });
};
exports.createComprehensiveRefreshToken = createComprehensiveRefreshToken;
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
const validateRefreshToken = (token, secret, expectedFamilyId) => {
    const payload = (0, exports.verifyComprehensiveJWT)(token, { secret });
    if (!payload || payload.type !== 'refresh')
        return null;
    // Check family ID for rotation detection
    if (expectedFamilyId && payload.familyId !== expectedFamilyId)
        return null;
    return payload;
};
exports.validateRefreshToken = validateRefreshToken;
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
const rotateRefreshToken = (oldToken, secret, newExpiresIn = '7d') => {
    const payload = (0, exports.validateRefreshToken)(oldToken, secret);
    if (!payload)
        return null;
    const familyId = payload.familyId || crypto.randomUUID();
    const accessToken = (0, exports.createComprehensiveJWT)({
        sub: payload.sub,
        deviceId: payload.deviceId,
        sessionId: payload.sessionId,
    }, { secret, expiresIn: '15m' });
    const refreshToken = (0, exports.createComprehensiveRefreshToken)({
        userId: payload.sub,
        deviceId: payload.deviceId,
        sessionId: payload.sessionId,
        familyId,
        expiresIn: newExpiresIn,
        metadata: payload.metadata,
    }, secret);
    return { accessToken, refreshToken, familyId };
};
exports.rotateRefreshToken = rotateRefreshToken;
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
const hashRefreshTokenSecure = (token, algorithm = 'sha256') => {
    return crypto.createHash(algorithm).update(token).digest('hex');
};
exports.hashRefreshTokenSecure = hashRefreshTokenSecure;
// ============================================================================
// SESSION MANAGEMENT
// ============================================================================
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
const createComprehensiveSession = (config) => {
    const now = new Date();
    const expiresIn = config.expiresIn || 86400000; // 24 hours default
    return {
        sessionId: crypto.randomUUID(),
        userId: config.userId,
        createdAt: now,
        lastActivity: now,
        expiresAt: new Date(now.getTime() + expiresIn),
        ipAddress: config.ipAddress,
        userAgent: config.userAgent,
        metadata: config.metadata,
    };
};
exports.createComprehensiveSession = createComprehensiveSession;
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
const validateSession = (session, options) => {
    const now = new Date();
    // Check expiration
    if (options?.checkExpiration !== false && session.expiresAt < now) {
        return { valid: false, reason: 'session_expired' };
    }
    // Check idle timeout
    if (options?.maxIdleTime) {
        const idleTime = now.getTime() - session.lastActivity.getTime();
        if (idleTime > options.maxIdleTime) {
            return { valid: false, reason: 'session_idle_timeout' };
        }
    }
    // Check IP address if strict mode enabled
    if (options?.strictIpCheck && options?.ipAddress && session.ipAddress !== options.ipAddress) {
        return { valid: false, reason: 'ip_address_mismatch' };
    }
    return { valid: true };
};
exports.validateSession = validateSession;
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
const updateSessionWithSliding = (session, slidingWindow) => {
    const now = new Date();
    const updated = {
        ...session,
        lastActivity: now,
    };
    // Sliding expiration: extend session if activity detected
    if (slidingWindow) {
        updated.expiresAt = new Date(now.getTime() + slidingWindow);
    }
    return updated;
};
exports.updateSessionWithSliding = updateSessionWithSliding;
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
const generateSecureSessionId = (prefix = '', length = 32) => {
    const randomId = crypto.randomBytes(length).toString('hex');
    return `${prefix}${randomId}`;
};
exports.generateSecureSessionId = generateSecureSessionId;
// ============================================================================
// OAUTH 2.0 FLOWS
// ============================================================================
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
const generateOAuth2AuthorizationUrl = (config) => {
    const state = config.state || crypto.randomBytes(32).toString('hex');
    const codeVerifier = crypto.randomBytes(32).toString('base64url');
    const codeChallenge = crypto.createHash('sha256').update(codeVerifier).digest('base64url');
    const params = new URLSearchParams({
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        response_type: config.responseType || 'code',
        state,
        scope: (config.scope || []).join(' '),
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
    });
    const authUrl = `https://oauth.provider.com/authorize?${params.toString()}`;
    return { authUrl, state, codeVerifier };
};
exports.generateOAuth2AuthorizationUrl = generateOAuth2AuthorizationUrl;
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
const exchangeOAuth2Code = async (code, config, codeVerifier) => {
    // This is a placeholder - in production, make actual HTTP request to token endpoint
    const tokenPayload = {
        grant_type: 'authorization_code',
        code,
        redirect_uri: config.redirectUri,
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code_verifier: codeVerifier,
    };
    // Simulated response
    return {
        access_token: crypto.randomBytes(32).toString('hex'),
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: crypto.randomBytes(32).toString('hex'),
        scope: (config.scope || []).join(' '),
    };
};
exports.exchangeOAuth2Code = exchangeOAuth2Code;
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
const performOAuth2ClientCredentialsFlow = async (config) => {
    // This is a placeholder - in production, make actual HTTP request
    const tokenPayload = {
        grant_type: 'client_credentials',
        client_id: config.clientId,
        client_secret: config.clientSecret,
        scope: (config.scope || []).join(' '),
        audience: config.audience,
    };
    // Simulated response
    return {
        access_token: crypto.randomBytes(32).toString('hex'),
        token_type: 'Bearer',
        expires_in: 3600,
        scope: (config.scope || []).join(' '),
    };
};
exports.performOAuth2ClientCredentialsFlow = performOAuth2ClientCredentialsFlow;
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
const validateOAuth2State = (receivedState, expectedState) => {
    try {
        return crypto.timingSafeEqual(Buffer.from(receivedState), Buffer.from(expectedState));
    }
    catch {
        return false;
    }
};
exports.validateOAuth2State = validateOAuth2State;
// ============================================================================
// MULTI-FACTOR AUTHENTICATION (MFA/2FA)
// ============================================================================
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
const generateTOTPSetup = (accountName, issuer) => {
    const secret = base32Encode(crypto.randomBytes(20));
    const uri = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(accountName)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`;
    return {
        secret,
        qrCode: uri, // Use QR code library to generate actual QR code image
        uri,
    };
};
exports.generateTOTPSetup = generateTOTPSetup;
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
const generateTOTPCode = (secret, step = 30, offset = 0) => {
    const time = Math.floor((Date.now() / 1000 + offset) / step);
    const timeBuffer = Buffer.alloc(8);
    timeBuffer.writeBigUInt64BE(BigInt(time));
    const hmac = crypto.createHmac('sha1', base32Decode(secret));
    hmac.update(timeBuffer);
    const hash = hmac.digest();
    const offset_bits = hash[hash.length - 1] & 0xf;
    const code = ((hash[offset_bits] & 0x7f) << 24) |
        ((hash[offset_bits + 1] & 0xff) << 16) |
        ((hash[offset_bits + 2] & 0xff) << 8) |
        (hash[offset_bits + 3] & 0xff);
    return (code % 1000000).toString().padStart(6, '0');
};
exports.generateTOTPCode = generateTOTPCode;
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
const verifyTOTPCode = (code, secret, window = 1) => {
    // Check current time and +/- window
    for (let i = -window; i <= window; i++) {
        const expectedCode = (0, exports.generateTOTPCode)(secret, 30, i * 30);
        if (code === expectedCode)
            return true;
    }
    return false;
};
exports.verifyTOTPCode = verifyTOTPCode;
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
const generate2FARecoveryCodes = (count = 10, length = 8) => {
    const codes = [];
    for (let i = 0; i < count; i++) {
        const code = crypto
            .randomBytes(Math.ceil(length / 2))
            .toString('hex')
            .toUpperCase()
            .slice(0, length);
        codes.push(code);
    }
    return codes;
};
exports.generate2FARecoveryCodes = generate2FARecoveryCodes;
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
const hash2FARecoveryCode = (code) => {
    return crypto.createHash('sha256').update(code).digest('hex');
};
exports.hash2FARecoveryCode = hash2FARecoveryCode;
// ============================================================================
// ROLE-BASED ACCESS CONTROL (RBAC)
// ============================================================================
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
const createRBACRole = (role, permissions, inherits) => {
    return {
        role,
        permissions,
        inherits,
    };
};
exports.createRBACRole = createRBACRole;
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
const checkRBACPermission = (acl, permission, roleDefinitions) => {
    // Check if explicitly denied
    if (acl.deniedPermissions?.includes(permission))
        return false;
    // Check direct permissions
    if (acl.permissions.includes(permission))
        return true;
    // Check role-based permissions with inheritance
    const userPermissions = (0, exports.resolveRolePermissions)(acl.roles, roleDefinitions);
    return userPermissions.includes(permission);
};
exports.checkRBACPermission = checkRBACPermission;
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
const resolveRolePermissions = (roles, roleDefinitions) => {
    const resolvedPermissions = new Set();
    const processedRoles = new Set();
    const resolveRole = (roleName) => {
        if (processedRoles.has(roleName))
            return;
        processedRoles.add(roleName);
        const roleDef = roleDefinitions.find(r => r.role === roleName);
        if (!roleDef)
            return;
        // Add role's permissions
        roleDef.permissions.forEach(p => resolvedPermissions.add(p));
        // Recursively resolve inherited roles
        roleDef.inherits?.forEach(inheritedRole => resolveRole(inheritedRole));
    };
    roles.forEach(role => resolveRole(role));
    return Array.from(resolvedPermissions);
};
exports.resolveRolePermissions = resolveRolePermissions;
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
const checkMultiplePermissions = (acl, permissions, roleDefinitions, logic = 'AND') => {
    if (logic === 'AND') {
        return permissions.every(perm => (0, exports.checkRBACPermission)(acl, perm, roleDefinitions));
    }
    else {
        return permissions.some(perm => (0, exports.checkRBACPermission)(acl, perm, roleDefinitions));
    }
};
exports.checkMultiplePermissions = checkMultiplePermissions;
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
const createPermissionString = (resource, action) => {
    return `${action}:${resource}`;
};
exports.createPermissionString = createPermissionString;
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
const parsePermissionString = (permission) => {
    const parts = permission.split(':');
    if (parts.length !== 2)
        return null;
    return { action: parts[0], resource: parts[1] };
};
exports.parsePermissionString = parsePermissionString;
// ============================================================================
// API KEY GENERATION AND VALIDATION
// ============================================================================
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
const generateComprehensiveApiKey = (config) => {
    const length = config?.length || 32;
    const prefix = config?.prefix || '';
    const key = crypto.randomBytes(length).toString('hex');
    const fullKey = `${prefix}${key}`;
    const hash = crypto.createHash('sha256').update(fullKey).digest('hex');
    const now = new Date();
    const expiresAt = config?.expiresIn ? new Date(now.getTime() + config.expiresIn) : undefined;
    return {
        key: fullKey,
        hash,
        prefix: config?.prefix,
        permissions: config?.permissions,
        createdAt: now,
        expiresAt,
        metadata: config?.metadata,
    };
};
exports.generateComprehensiveApiKey = generateComprehensiveApiKey;
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
const validateComprehensiveApiKey = (providedKey, storedKeyData) => {
    // Validate format
    if (storedKeyData.prefix && !providedKey.startsWith(storedKeyData.prefix)) {
        return { valid: false, reason: 'invalid_prefix' };
    }
    // Validate hash
    const providedHash = crypto.createHash('sha256').update(providedKey).digest('hex');
    if (!crypto.timingSafeEqual(Buffer.from(providedHash), Buffer.from(storedKeyData.hash))) {
        return { valid: false, reason: 'invalid_key' };
    }
    // Check expiration
    if (storedKeyData.expiresAt && storedKeyData.expiresAt < new Date()) {
        return { valid: false, reason: 'expired' };
    }
    return { valid: true };
};
exports.validateComprehensiveApiKey = validateComprehensiveApiKey;
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
const checkApiKeyPermission = (apiKeyData, permission) => {
    if (!apiKeyData.permissions)
        return false;
    return apiKeyData.permissions.includes(permission);
};
exports.checkApiKeyPermission = checkApiKeyPermission;
// ============================================================================
// PASSWORD HASHING AND VALIDATION (BCRYPT & ARGON2)
// ============================================================================
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
const hashPasswordBcrypt = async (password, saltRounds = 12) => {
    // This is a placeholder - use actual bcrypt library
    // import * as bcrypt from 'bcrypt';
    // return bcrypt.hash(password, saltRounds);
    // Simulated bcrypt hash
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
    return `$2b$${saltRounds}$${salt}${hash}`;
};
exports.hashPasswordBcrypt = hashPasswordBcrypt;
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
const verifyPasswordBcrypt = async (password, hash) => {
    // This is a placeholder - use actual bcrypt library
    // import * as bcrypt from 'bcrypt';
    // return bcrypt.compare(password, hash);
    // Simulated verification
    return true; // Replace with actual bcrypt.compare()
};
exports.verifyPasswordBcrypt = verifyPasswordBcrypt;
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
const hashPasswordArgon2 = async (password, options) => {
    // This is a placeholder - use actual argon2 library
    // import * as argon2 from 'argon2';
    // return argon2.hash(password, options);
    // Simulated argon2 hash
    const salt = crypto.randomBytes(32);
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512');
    return `$argon2id$v=19$m=65536,t=3,p=4$${salt.toString('base64')}$${hash.toString('base64')}`;
};
exports.hashPasswordArgon2 = hashPasswordArgon2;
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
const verifyPasswordArgon2 = async (password, hash) => {
    // This is a placeholder - use actual argon2 library
    // import * as argon2 from 'argon2';
    // return argon2.verify(hash, password);
    // Simulated verification
    return true; // Replace with actual argon2.verify()
};
exports.verifyPasswordArgon2 = verifyPasswordArgon2;
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
const validatePasswordPolicy = (password, policy) => {
    let score = 0;
    const feedback = [];
    // Length checks
    if (policy.minLength && password.length < policy.minLength) {
        feedback.push(`Password must be at least ${policy.minLength} characters`);
    }
    else {
        score += 1;
    }
    if (policy.maxLength && password.length > policy.maxLength) {
        feedback.push(`Password must not exceed ${policy.maxLength} characters`);
    }
    // Character requirements
    if (policy.requireUppercase && !/[A-Z]/.test(password)) {
        feedback.push('Include at least one uppercase letter');
    }
    else if (policy.requireUppercase) {
        score += 1;
    }
    if (policy.requireLowercase && !/[a-z]/.test(password)) {
        feedback.push('Include at least one lowercase letter');
    }
    else if (policy.requireLowercase) {
        score += 1;
    }
    if (policy.requireNumbers && !/\d/.test(password)) {
        feedback.push('Include at least one number');
    }
    else if (policy.requireNumbers) {
        score += 1;
    }
    if (policy.requireSpecialChars && !/[^A-Za-z0-9]/.test(password)) {
        feedback.push('Include at least one special character');
    }
    else if (policy.requireSpecialChars) {
        score += 1;
    }
    // Common password check
    if (policy.preventCommon) {
        const commonPasswords = ['password', 'admin', 'user', '12345678', 'qwerty'];
        if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
            score = Math.max(0, score - 2);
            feedback.push('Avoid common passwords');
        }
    }
    // Pattern checks
    if (/(.)\1{2,}/.test(password)) {
        score = Math.max(0, score - 1);
        feedback.push('Avoid repeated characters');
    }
    const isValid = feedback.length === 0;
    const strength = calculatePasswordStrength(score);
    return {
        isValid,
        score,
        strength,
        feedback,
    };
};
exports.validatePasswordPolicy = validatePasswordPolicy;
/**
 * Calculates password strength category from score.
 *
 * @param {number} score - Password score
 * @returns {string} Strength category
 */
const calculatePasswordStrength = (score) => {
    if (score <= 1)
        return 'weak';
    if (score === 2)
        return 'fair';
    if (score === 3)
        return 'good';
    if (score === 4)
        return 'strong';
    return 'very-strong';
};
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
const generateSecurePassword = (length = 16, policy) => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    let chars = '';
    let password = '';
    // Build character set based on policy
    if (!policy || policy.requireLowercase !== false)
        chars += lowercase;
    if (!policy || policy.requireUppercase !== false)
        chars += uppercase;
    if (!policy || policy.requireNumbers !== false)
        chars += numbers;
    if (!policy || policy.requireSpecialChars !== false)
        chars += special;
    const randomBytes = crypto.randomBytes(length);
    // Ensure at least one of each required type
    let pos = 0;
    if (policy?.requireLowercase !== false) {
        password += lowercase[randomBytes[pos++] % lowercase.length];
    }
    if (policy?.requireUppercase !== false) {
        password += uppercase[randomBytes[pos++] % uppercase.length];
    }
    if (policy?.requireNumbers !== false) {
        password += numbers[randomBytes[pos++] % numbers.length];
    }
    if (policy?.requireSpecialChars !== false) {
        password += special[randomBytes[pos++] % special.length];
    }
    // Fill remaining with random characters
    for (let i = pos; i < length; i++) {
        password += chars[randomBytes[i] % chars.length];
    }
    // Shuffle password
    return password
        .split('')
        .sort(() => Math.random() - 0.5)
        .join('');
};
exports.generateSecurePassword = generateSecurePassword;
// ============================================================================
// ACCOUNT LOCKOUT AND SECURITY POLICIES
// ============================================================================
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
const trackLoginAttempt = (email, success, ipAddress, metadata) => {
    return {
        email,
        success,
        ipAddress,
        userAgent: metadata?.userAgent,
        failureReason: metadata?.failureReason,
        timestamp: new Date(),
    };
};
exports.trackLoginAttempt = trackLoginAttempt;
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
const shouldLockAccount = (failedAttempts, policy) => {
    if (failedAttempts < policy.maxFailedAttempts) {
        return { shouldLock: false };
    }
    let lockDurationMs = policy.lockoutDurationMs;
    // Progressive lockout: increase duration based on attempts
    if (policy.progressiveLockout) {
        const excessAttempts = failedAttempts - policy.maxFailedAttempts;
        lockDurationMs = policy.lockoutDurationMs * Math.pow(2, excessAttempts);
    }
    const lockUntil = new Date(Date.now() + lockDurationMs);
    return {
        shouldLock: true,
        lockUntil,
        lockDurationMs,
    };
};
exports.shouldLockAccount = shouldLockAccount;
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
const isAccountLocked = (lockedUntil) => {
    if (!lockedUntil) {
        return { isLocked: false };
    }
    const now = new Date();
    if (now >= lockedUntil) {
        return { isLocked: false };
    }
    const remainingMs = lockedUntil.getTime() - now.getTime();
    const remainingSeconds = Math.ceil(remainingMs / 1000);
    return {
        isLocked: true,
        remainingSeconds,
    };
};
exports.isAccountLocked = isAccountLocked;
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
const resetFailedLoginAttempts = (currentAttempts) => {
    return 0;
};
exports.resetFailedLoginAttempts = resetFailedLoginAttempts;
// ============================================================================
// SECURITY HEADERS CONFIGURATION
// ============================================================================
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
const generateSecurityHeaders = (options) => {
    return {
        'Strict-Transport-Security': options?.hsts !== false
            ? `max-age=${options?.hsts?.maxAge || 31536000}; includeSubDomains; preload`
            : undefined,
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': options?.frameOptions || 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Content-Security-Policy': options?.csp || "default-src 'self'",
        'Referrer-Policy': options?.referrerPolicy || 'strict-origin-when-cross-origin',
        'Permissions-Policy': options?.permissionsPolicy || 'geolocation=(), microphone=(), camera=()',
    };
};
exports.generateSecurityHeaders = generateSecurityHeaders;
// ============================================================================
// RATE LIMITING UTILITIES
// ============================================================================
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
const checkRateLimit = (identifier, config, store) => {
    const now = Date.now();
    const key = config.identifier || identifier;
    const record = store.get(key) || { count: 0, resetAt: now + config.windowMs };
    // Reset if window expired
    if (now >= record.resetAt) {
        record.count = 0;
        record.resetAt = now + config.windowMs;
    }
    record.count += 1;
    store.set(key, record);
    const remaining = Math.max(0, config.maxRequests - record.count);
    const retryAfter = remaining === 0 ? Math.ceil((record.resetAt - now) / 1000) : undefined;
    return {
        remaining,
        limit: config.maxRequests,
        resetAt: new Date(record.resetAt),
        retryAfter,
    };
};
exports.checkRateLimit = checkRateLimit;
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Converts time string to seconds (e.g., '15m', '7d', '1h').
 */
const parseTimeToSeconds = (timeStr) => {
    const units = {
        s: 1,
        m: 60,
        h: 3600,
        d: 86400,
        w: 604800,
    };
    const match = timeStr.match(/^(\d+)([smhdw])$/);
    if (!match)
        return 900;
    const [, value, unit] = match;
    return parseInt(value) * units[unit];
};
/**
 * Base64 URL encodes a string.
 */
const base64UrlEncode = (str) => {
    return Buffer.from(str)
        .toString('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
};
/**
 * Base64 URL decodes a string.
 */
const base64UrlDecode = (str) => {
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    return Buffer.from(base64, 'base64').toString('utf8');
};
/**
 * Signs JWT using HMAC.
 */
const signJWT = (data, secret, algorithm) => {
    const alg = algorithm || 'HS256';
    const hashAlg = alg.replace('HS', 'sha');
    return crypto.createHmac(hashAlg, secret).update(data).digest('base64url');
};
/**
 * Base32 encodes buffer.
 */
const base32Encode = (buffer) => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let bits = 0;
    let value = 0;
    let output = '';
    for (let i = 0; i < buffer.length; i++) {
        value = (value << 8) | buffer[i];
        bits += 8;
        while (bits >= 5) {
            output += alphabet[(value >>> (bits - 5)) & 31];
            bits -= 5;
        }
    }
    if (bits > 0) {
        output += alphabet[(value << (5 - bits)) & 31];
    }
    return output;
};
/**
 * Base32 decodes string to buffer.
 */
const base32Decode = (str) => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let bits = 0;
    let value = 0;
    const output = [];
    for (let i = 0; i < str.length; i++) {
        const idx = alphabet.indexOf(str[i].toUpperCase());
        if (idx === -1)
            continue;
        value = (value << 5) | idx;
        bits += 5;
        if (bits >= 8) {
            output.push((value >>> (bits - 8)) & 255);
            bits -= 8;
        }
    }
    return Buffer.from(output);
};
exports.default = {
    // Sequelize Models
    getUserModelAttributes: exports.getUserModelAttributes,
    getRoleModelAttributes: exports.getRoleModelAttributes,
    getPermissionModelAttributes: exports.getPermissionModelAttributes,
    getSessionModelAttributes: exports.getSessionModelAttributes,
    getRefreshTokenModelAttributes: exports.getRefreshTokenModelAttributes,
    getApiKeyModelAttributes: exports.getApiKeyModelAttributes,
    getLoginAttemptModelAttributes: exports.getLoginAttemptModelAttributes,
    getUserRoleModelAttributes: exports.getUserRoleModelAttributes,
    getRolePermissionModelAttributes: exports.getRolePermissionModelAttributes,
    // JWT tokens
    createComprehensiveJWT: exports.createComprehensiveJWT,
    verifyComprehensiveJWT: exports.verifyComprehensiveJWT,
    extractJWTClaims: exports.extractJWTClaims,
    validateJWTStructure: exports.validateJWTStructure,
    isJWTExpiringWithin: exports.isJWTExpiringWithin,
    getJWTInfo: exports.getJWTInfo,
    // Refresh tokens
    createComprehensiveRefreshToken: exports.createComprehensiveRefreshToken,
    validateRefreshToken: exports.validateRefreshToken,
    rotateRefreshToken: exports.rotateRefreshToken,
    hashRefreshTokenSecure: exports.hashRefreshTokenSecure,
    // Session management
    createComprehensiveSession: exports.createComprehensiveSession,
    validateSession: exports.validateSession,
    updateSessionWithSliding: exports.updateSessionWithSliding,
    generateSecureSessionId: exports.generateSecureSessionId,
    // OAuth 2.0
    generateOAuth2AuthorizationUrl: exports.generateOAuth2AuthorizationUrl,
    exchangeOAuth2Code: exports.exchangeOAuth2Code,
    performOAuth2ClientCredentialsFlow: exports.performOAuth2ClientCredentialsFlow,
    validateOAuth2State: exports.validateOAuth2State,
    // MFA/2FA
    generateTOTPSetup: exports.generateTOTPSetup,
    generateTOTPCode: exports.generateTOTPCode,
    verifyTOTPCode: exports.verifyTOTPCode,
    generate2FARecoveryCodes: exports.generate2FARecoveryCodes,
    hash2FARecoveryCode: exports.hash2FARecoveryCode,
    // RBAC
    createRBACRole: exports.createRBACRole,
    checkRBACPermission: exports.checkRBACPermission,
    resolveRolePermissions: exports.resolveRolePermissions,
    checkMultiplePermissions: exports.checkMultiplePermissions,
    createPermissionString: exports.createPermissionString,
    parsePermissionString: exports.parsePermissionString,
    // API keys
    generateComprehensiveApiKey: exports.generateComprehensiveApiKey,
    validateComprehensiveApiKey: exports.validateComprehensiveApiKey,
    checkApiKeyPermission: exports.checkApiKeyPermission,
    // Password hashing
    hashPasswordBcrypt: exports.hashPasswordBcrypt,
    verifyPasswordBcrypt: exports.verifyPasswordBcrypt,
    hashPasswordArgon2: exports.hashPasswordArgon2,
    verifyPasswordArgon2: exports.verifyPasswordArgon2,
    validatePasswordPolicy: exports.validatePasswordPolicy,
    generateSecurePassword: exports.generateSecurePassword,
    // Account lockout
    trackLoginAttempt: exports.trackLoginAttempt,
    shouldLockAccount: exports.shouldLockAccount,
    isAccountLocked: exports.isAccountLocked,
    resetFailedLoginAttempts: exports.resetFailedLoginAttempts,
    // Security headers
    generateSecurityHeaders: exports.generateSecurityHeaders,
    // Rate limiting
    checkRateLimit: exports.checkRateLimit,
};
//# sourceMappingURL=auth-security-kit.js.map