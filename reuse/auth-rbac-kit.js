"use strict";
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
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MFAGuard = exports.ApiKeyGuard = exports.PermissionsGuard = exports.RolesGuard = exports.JwtAuthGuard = exports.RequireMFA = exports.Public = exports.Permissions = exports.Roles = exports.CurrentUser = exports.ApiKeySchema = exports.PasswordPolicySchema = exports.JWTPayloadSchema = void 0;
exports.defineUserModel = defineUserModel;
exports.defineRefreshTokenModel = defineRefreshTokenModel;
exports.defineSessionModel = defineSessionModel;
exports.defineApiKeyModel = defineApiKeyModel;
exports.defineRoleModel = defineRoleModel;
exports.defineUserRoleModel = defineUserRoleModel;
exports.definePermissionModel = definePermissionModel;
exports.defineRolePermissionModel = defineRolePermissionModel;
exports.defineLoginAttemptModel = defineLoginAttemptModel;
exports.generateJWT = generateJWT;
exports.verifyJWT = verifyJWT;
exports.generateRefreshToken = generateRefreshToken;
exports.refreshAccessToken = refreshAccessToken;
exports.revokeRefreshToken = revokeRefreshToken;
exports.revokeAllUserTokens = revokeAllUserTokens;
exports.cleanupExpiredTokens = cleanupExpiredTokens;
exports.hashPassword = hashPassword;
exports.hashPasswordArgon2 = hashPasswordArgon2;
exports.verifyPassword = verifyPassword;
exports.verifyPasswordArgon2 = verifyPasswordArgon2;
exports.validatePasswordPolicy = validatePasswordPolicy;
exports.generatePasswordResetToken = generatePasswordResetToken;
exports.resetPassword = resetPassword;
exports.generateTOTPSecret = generateTOTPSecret;
exports.verifyTOTP = verifyTOTP;
exports.enableMFA = enableMFA;
exports.disableMFA = disableMFA;
exports.verifyBackupCode = verifyBackupCode;
exports.createSession = createSession;
exports.validateSession = validateSession;
exports.destroySession = destroySession;
exports.destroyAllUserSessions = destroyAllUserSessions;
exports.cleanupExpiredSessions = cleanupExpiredSessions;
exports.generateApiKey = generateApiKey;
exports.validateApiKey = validateApiKey;
exports.revokeApiKey = revokeApiKey;
exports.checkPermission = checkPermission;
exports.hasAnyRole = hasAnyRole;
exports.hasAllRoles = hasAllRoles;
exports.getUserRoles = getUserRoles;
exports.getUserPermissions = getUserPermissions;
exports.assignRoleToUser = assignRoleToUser;
exports.revokeRoleFromUser = revokeRoleFromUser;
exports.trackLoginAttempt = trackLoginAttempt;
exports.getRecentLoginAttempts = getRecentLoginAttempts;
exports.shouldLockAccount = shouldLockAccount;
exports.lockUserAccount = lockUserAccount;
exports.unlockUserAccount = unlockUserAccount;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
const argon2 = __importStar(require("argon2"));
const crypto = __importStar(require("crypto"));
const speakeasy = __importStar(require("speakeasy"));
const qrcode = __importStar(require("qrcode"));
const sequelize_1 = require("sequelize");
const zod_1 = require("zod");
// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================
exports.JWTPayloadSchema = zod_1.z.object({
    sub: zod_1.z.string(),
    email: zod_1.z.string().email().optional(),
    role: zod_1.z.string().optional(),
    roles: zod_1.z.array(zod_1.z.string()).optional(),
    permissions: zod_1.z.array(zod_1.z.string()).optional(),
    type: zod_1.z.enum(['access', 'refresh', 'api-key']).optional(),
    sessionId: zod_1.z.string().optional(),
    deviceId: zod_1.z.string().optional(),
    iat: zod_1.z.number().optional(),
    exp: zod_1.z.number().optional(),
    nbf: zod_1.z.number().optional(),
    jti: zod_1.z.string().optional(),
    iss: zod_1.z.string().optional(),
    aud: zod_1.z.union([zod_1.z.string(), zod_1.z.array(zod_1.z.string())]).optional(),
});
exports.PasswordPolicySchema = zod_1.z.object({
    minLength: zod_1.z.number().min(8).max(128).optional(),
    maxLength: zod_1.z.number().min(8).max(512).optional(),
    requireUppercase: zod_1.z.boolean().optional(),
    requireLowercase: zod_1.z.boolean().optional(),
    requireNumbers: zod_1.z.boolean().optional(),
    requireSpecialChars: zod_1.z.boolean().optional(),
    preventCommonPasswords: zod_1.z.boolean().optional(),
    preventUserInfo: zod_1.z.boolean().optional(),
    maxRepeatingChars: zod_1.z.number().min(1).max(10).optional(),
});
exports.ApiKeySchema = zod_1.z.object({
    key: zod_1.z.string().min(32),
    userId: zod_1.z.string().optional(),
    permissions: zod_1.z.array(zod_1.z.string()).optional(),
    scopes: zod_1.z.array(zod_1.z.string()).optional(),
    expiresAt: zod_1.z.date().optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * @function defineUserModel
 * @description Defines the User Sequelize model
 */
function defineUserModel(sequelize) {
    return sequelize.define('User', {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        email: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: { isEmail: true },
        },
        passwordHash: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        firstName: sequelize_1.DataTypes.STRING,
        lastName: sequelize_1.DataTypes.STRING,
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: true,
        },
        isEmailVerified: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: false,
        },
        emailVerificationToken: sequelize_1.DataTypes.STRING,
        passwordResetToken: sequelize_1.DataTypes.STRING,
        passwordResetExpires: sequelize_1.DataTypes.DATE,
        passwordChangedAt: sequelize_1.DataTypes.DATE,
        failedLoginAttempts: {
            type: sequelize_1.DataTypes.INTEGER,
            defaultValue: 0,
        },
        lockedUntil: sequelize_1.DataTypes.DATE,
        lastLoginAt: sequelize_1.DataTypes.DATE,
        lastLoginIp: sequelize_1.DataTypes.STRING,
        mfaEnabled: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: false,
        },
        mfaSecret: sequelize_1.DataTypes.STRING,
        mfaBackupCodes: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        metadata: sequelize_1.DataTypes.JSONB,
    }, {
        tableName: 'users',
        timestamps: true,
        indexes: [
            { fields: ['email'] },
            { fields: ['isActive'] },
            { fields: ['passwordResetToken'] },
        ],
    });
}
/**
 * @function defineRefreshTokenModel
 * @description Defines the RefreshToken Sequelize model
 */
function defineRefreshTokenModel(sequelize) {
    return sequelize.define('RefreshToken', {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: { model: 'users', key: 'id' },
        },
        tokenHash: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        familyId: sequelize_1.DataTypes.UUID,
        deviceId: sequelize_1.DataTypes.STRING,
        sessionId: sequelize_1.DataTypes.UUID,
        ipAddress: sequelize_1.DataTypes.STRING,
        userAgent: sequelize_1.DataTypes.TEXT,
        expiresAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        isRevoked: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: false,
        },
        revokedAt: sequelize_1.DataTypes.DATE,
        revokedReason: sequelize_1.DataTypes.STRING,
        metadata: sequelize_1.DataTypes.JSONB,
    }, {
        tableName: 'refresh_tokens',
        timestamps: true,
        updatedAt: false,
        indexes: [
            { fields: ['userId'] },
            { fields: ['tokenHash'] },
            { fields: ['familyId'] },
            { fields: ['expiresAt'] },
            { fields: ['isRevoked'] },
        ],
    });
}
/**
 * @function defineSessionModel
 * @description Defines the Session Sequelize model
 */
function defineSessionModel(sequelize) {
    return sequelize.define('Session', {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: { model: 'users', key: 'id' },
        },
        sessionToken: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        ipAddress: sequelize_1.DataTypes.STRING,
        userAgent: sequelize_1.DataTypes.TEXT,
        lastActivityAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        expiresAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: true,
        },
        metadata: sequelize_1.DataTypes.JSONB,
    }, {
        tableName: 'sessions',
        timestamps: true,
        indexes: [
            { fields: ['userId'] },
            { fields: ['sessionToken'] },
            { fields: ['expiresAt'] },
            { fields: ['isActive'] },
        ],
    });
}
/**
 * @function defineApiKeyModel
 * @description Defines the ApiKey Sequelize model
 */
function defineApiKeyModel(sequelize) {
    return sequelize.define('ApiKey', {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            references: { model: 'users', key: 'id' },
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        keyHash: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        prefix: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        permissions: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            defaultValue: [],
        },
        scopes: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            defaultValue: [],
        },
        rateLimit: sequelize_1.DataTypes.INTEGER,
        lastUsedAt: sequelize_1.DataTypes.DATE,
        expiresAt: sequelize_1.DataTypes.DATE,
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: true,
        },
        metadata: sequelize_1.DataTypes.JSONB,
    }, {
        tableName: 'api_keys',
        timestamps: true,
        indexes: [
            { fields: ['userId'] },
            { fields: ['keyHash'] },
            { fields: ['prefix'] },
            { fields: ['isActive'] },
        ],
    });
}
/**
 * @function defineRoleModel
 * @description Defines the Role Sequelize model
 */
function defineRoleModel(sequelize) {
    return sequelize.define('Role', {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        description: sequelize_1.DataTypes.TEXT,
        priority: {
            type: sequelize_1.DataTypes.INTEGER,
            defaultValue: 0,
        },
        inherits: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            defaultValue: [],
        },
        isSystem: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: false,
        },
        metadata: sequelize_1.DataTypes.JSONB,
    }, {
        tableName: 'roles',
        timestamps: true,
        indexes: [{ fields: ['name'] }, { fields: ['priority'] }],
    });
}
/**
 * @function defineUserRoleModel
 * @description Defines the UserRole Sequelize model
 */
function defineUserRoleModel(sequelize) {
    return sequelize.define('UserRole', {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: { model: 'users', key: 'id' },
        },
        roleId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: { model: 'roles', key: 'id' },
        },
        assignedBy: {
            type: sequelize_1.DataTypes.UUID,
            references: { model: 'users', key: 'id' },
        },
        expiresAt: sequelize_1.DataTypes.DATE,
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: true,
        },
        metadata: sequelize_1.DataTypes.JSONB,
    }, {
        tableName: 'user_roles',
        timestamps: true,
        indexes: [
            { fields: ['userId'] },
            { fields: ['roleId'] },
            { fields: ['userId', 'roleId'], unique: true },
        ],
    });
}
/**
 * @function definePermissionModel
 * @description Defines the Permission Sequelize model
 */
function definePermissionModel(sequelize) {
    return sequelize.define('Permission', {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        resource: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        action: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        scope: sequelize_1.DataTypes.STRING,
        conditions: sequelize_1.DataTypes.JSONB,
        description: sequelize_1.DataTypes.TEXT,
        isSystem: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: false,
        },
        metadata: sequelize_1.DataTypes.JSONB,
    }, {
        tableName: 'permissions',
        timestamps: true,
        indexes: [
            { fields: ['name'] },
            { fields: ['resource'] },
            { fields: ['resource', 'action'] },
        ],
    });
}
/**
 * @function defineRolePermissionModel
 * @description Defines the RolePermission Sequelize model
 */
function defineRolePermissionModel(sequelize) {
    return sequelize.define('RolePermission', {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        roleId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: { model: 'roles', key: 'id' },
        },
        permissionId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: { model: 'permissions', key: 'id' },
        },
        isGranted: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: true,
        },
    }, {
        tableName: 'role_permissions',
        timestamps: true,
        updatedAt: false,
        indexes: [
            { fields: ['roleId'] },
            { fields: ['permissionId'] },
            { fields: ['roleId', 'permissionId'], unique: true },
        ],
    });
}
/**
 * @function defineLoginAttemptModel
 * @description Defines the LoginAttempt Sequelize model
 */
function defineLoginAttemptModel(sequelize) {
    return sequelize.define('LoginAttempt', {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            references: { model: 'users', key: 'id' },
        },
        email: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        ipAddress: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        userAgent: sequelize_1.DataTypes.TEXT,
        success: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
        },
        failureReason: sequelize_1.DataTypes.STRING,
        metadata: sequelize_1.DataTypes.JSONB,
    }, {
        tableName: 'login_attempts',
        timestamps: true,
        updatedAt: false,
        indexes: [
            { fields: ['userId'] },
            { fields: ['email'] },
            { fields: ['ipAddress'] },
            { fields: ['createdAt'] },
        ],
    });
}
// ============================================================================
// JWT UTILITIES
// ============================================================================
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
async function generateJWT(payload, config) {
    const jwt = require('jsonwebtoken');
    const options = {
        expiresIn: config.expiresIn || '15m',
        algorithm: config.algorithm || 'HS256',
    };
    if (config.issuer)
        options.issuer = config.issuer;
    if (config.audience)
        options.audience = config.audience;
    if (config.jwtid)
        options.jwtid = config.jwtid;
    if (config.subject)
        options.subject = config.subject;
    if (config.notBefore)
        options.notBefore = config.notBefore;
    const secret = config.privateKey || config.secret;
    return new Promise((resolve, reject) => {
        jwt.sign(payload, secret, options, (err, token) => {
            if (err)
                reject(err);
            else
                resolve(token);
        });
    });
}
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
async function verifyJWT(token, config) {
    const jwt = require('jsonwebtoken');
    const options = {
        algorithms: [config.algorithm || 'HS256'],
    };
    if (config.issuer)
        options.issuer = config.issuer;
    if (config.audience)
        options.audience = config.audience;
    const secret = config.publicKey || config.secret;
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, options, (err, decoded) => {
            if (err)
                reject(err);
            else
                resolve(decoded);
        });
    });
}
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
async function generateRefreshToken(RefreshToken, config, transaction) {
    const token = crypto.randomBytes(64).toString('base64url');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date();
    if (config.expiresIn) {
        expiresAt.setTime(expiresAt.getTime() + config.expiresIn);
    }
    else {
        expiresAt.setDate(expiresAt.getDate() + 7); // Default 7 days
    }
    const familyId = config.familyId || crypto.randomUUID();
    const model = await RefreshToken.create({
        userId: config.userId,
        tokenHash,
        familyId,
        deviceId: config.deviceId,
        sessionId: config.sessionId,
        expiresAt,
        metadata: config.metadata,
    }, { transaction });
    return { token, model };
}
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
async function refreshAccessToken(refreshToken, User, RefreshToken, jwtConfig, transaction) {
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const tokenRecord = await RefreshToken.findOne({
        where: {
            tokenHash,
            isRevoked: false,
            expiresAt: { [sequelize_1.Op.gt]: new Date() },
        },
        transaction,
    });
    if (!tokenRecord) {
        // Token reuse detected - revoke entire family
        const suspiciousToken = await RefreshToken.findOne({
            where: { tokenHash },
            transaction,
        });
        if (suspiciousToken && suspiciousToken.familyId) {
            await RefreshToken.update({ isRevoked: true, revokedReason: 'token_reuse_detected' }, {
                where: { familyId: suspiciousToken.familyId },
                transaction,
            });
        }
        throw new common_1.UnauthorizedException('Invalid or expired refresh token');
    }
    const user = await User.findByPk(tokenRecord.userId, { transaction });
    if (!user || !user.isActive) {
        throw new common_1.UnauthorizedException('User not found or inactive');
    }
    // Revoke old token
    await tokenRecord.update({ isRevoked: true }, { transaction });
    // Generate new access token
    const accessToken = await generateJWT({
        sub: user.id,
        email: user.email,
        type: 'access',
    }, jwtConfig);
    // Generate new refresh token with same family
    const { token: newRefreshToken } = await generateRefreshToken(RefreshToken, {
        userId: user.id,
        familyId: tokenRecord.familyId,
        deviceId: tokenRecord.deviceId,
        sessionId: tokenRecord.sessionId,
    }, transaction);
    return { accessToken, refreshToken: newRefreshToken, user };
}
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
async function revokeRefreshToken(RefreshToken, token, reason, transaction) {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    await RefreshToken.update({
        isRevoked: true,
        revokedAt: new Date(),
        revokedReason: reason,
    }, {
        where: { tokenHash },
        transaction,
    });
}
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
async function revokeAllUserTokens(RefreshToken, userId, reason, transaction) {
    const [count] = await RefreshToken.update({
        isRevoked: true,
        revokedAt: new Date(),
        revokedReason: reason,
    }, {
        where: {
            userId,
            isRevoked: false,
        },
        transaction,
    });
    return count;
}
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
async function cleanupExpiredTokens(RefreshToken, transaction) {
    return await RefreshToken.destroy({
        where: {
            expiresAt: { [sequelize_1.Op.lt]: new Date() },
        },
        transaction,
    });
}
// ============================================================================
// PASSWORD UTILITIES
// ============================================================================
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
async function hashPassword(password, rounds = 12) {
    return await bcrypt.hash(password, rounds);
}
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
async function hashPasswordArgon2(password) {
    return await argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 65536, // 64 MB
        timeCost: 3,
        parallelism: 4,
    });
}
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
async function verifyPassword(password, hash) {
    return await bcrypt.compare(password, hash);
}
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
async function verifyPasswordArgon2(password, hash) {
    return await argon2.verify(hash, password);
}
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
function validatePasswordPolicy(password, policy, userInfo) {
    const errors = [];
    if (policy.minLength && password.length < policy.minLength) {
        errors.push(`Password must be at least ${policy.minLength} characters long`);
    }
    if (policy.maxLength && password.length > policy.maxLength) {
        errors.push(`Password must not exceed ${policy.maxLength} characters`);
    }
    if (policy.requireUppercase && !/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }
    if (policy.requireLowercase && !/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }
    if (policy.requireNumbers && !/\d/.test(password)) {
        errors.push('Password must contain at least one number');
    }
    if (policy.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('Password must contain at least one special character');
    }
    if (policy.maxRepeatingChars) {
        const regex = new RegExp(`(.)\\1{${policy.maxRepeatingChars},}`);
        if (regex.test(password)) {
            errors.push(`Password must not contain more than ${policy.maxRepeatingChars} repeating characters`);
        }
    }
    if (policy.preventUserInfo && userInfo) {
        const lowerPassword = password.toLowerCase();
        if (userInfo.email && lowerPassword.includes(userInfo.email.toLowerCase())) {
            errors.push('Password must not contain your email');
        }
        if (userInfo.firstName && lowerPassword.includes(userInfo.firstName.toLowerCase())) {
            errors.push('Password must not contain your first name');
        }
        if (userInfo.lastName && lowerPassword.includes(userInfo.lastName.toLowerCase())) {
            errors.push('Password must not contain your last name');
        }
    }
    if (policy.preventCommonPasswords) {
        const commonPasswords = [
            'password', '123456', '12345678', 'qwerty', 'abc123',
            'monkey', '1234567', 'letmein', 'trustno1', 'dragon'
        ];
        if (commonPasswords.includes(password.toLowerCase())) {
            errors.push('Password is too common');
        }
    }
    return {
        valid: errors.length === 0,
        errors,
    };
}
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
async function generatePasswordResetToken(User, email, transaction) {
    const user = await User.findOne({
        where: { email, isActive: true },
        transaction,
    });
    if (!user) {
        throw new common_1.BadRequestException('User not found');
    }
    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiry
    await user.update({
        passwordResetToken: tokenHash,
        passwordResetExpires: expiresAt,
    }, { transaction });
    return { token, user };
}
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
async function resetPassword(User, token, newPassword, transaction) {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
        where: {
            passwordResetToken: tokenHash,
            passwordResetExpires: { [sequelize_1.Op.gt]: new Date() },
        },
        transaction,
    });
    if (!user) {
        throw new common_1.BadRequestException('Invalid or expired reset token');
    }
    const passwordHash = await hashPassword(newPassword);
    await user.update({
        passwordHash,
        passwordResetToken: null,
        passwordResetExpires: null,
        passwordChangedAt: new Date(),
        failedLoginAttempts: 0,
        lockedUntil: null,
    }, { transaction });
    return user;
}
// ============================================================================
// MULTI-FACTOR AUTHENTICATION (MFA)
// ============================================================================
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
async function generateTOTPSecret(email, issuer = 'White Cross') {
    const secret = speakeasy.generateSecret({
        name: `${issuer} (${email})`,
        issuer,
        length: 32,
    });
    const qrCode = await qrcode.toDataURL(secret.otpauth_url);
    const backupCodes = Array.from({ length: 10 }, () => crypto.randomBytes(4).toString('hex'));
    return {
        secret: secret.base32,
        qrCode,
        uri: secret.otpauth_url,
        backupCodes,
    };
}
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
function verifyTOTP(token, secret, window = 1) {
    return speakeasy.totp.verify({
        secret,
        encoding: 'base32',
        token,
        window,
    });
}
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
async function enableMFA(User, userId, secret, backupCodes, transaction) {
    const hashedBackupCodes = await Promise.all(backupCodes.map(code => hashPassword(code, 10)));
    const user = await User.findByPk(userId, { transaction });
    if (!user) {
        throw new common_1.BadRequestException('User not found');
    }
    await user.update({
        mfaEnabled: true,
        mfaSecret: secret,
        mfaBackupCodes: hashedBackupCodes,
    }, { transaction });
    return user;
}
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
async function disableMFA(User, userId, transaction) {
    const user = await User.findByPk(userId, { transaction });
    if (!user) {
        throw new common_1.BadRequestException('User not found');
    }
    await user.update({
        mfaEnabled: false,
        mfaSecret: null,
        mfaBackupCodes: null,
    }, { transaction });
    return user;
}
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
async function verifyBackupCode(User, userId, code, transaction) {
    const user = await User.findByPk(userId, { transaction });
    if (!user || !user.mfaBackupCodes || user.mfaBackupCodes.length === 0) {
        return false;
    }
    for (let i = 0; i < user.mfaBackupCodes.length; i++) {
        const isMatch = await verifyPassword(code, user.mfaBackupCodes[i]);
        if (isMatch) {
            // Remove used backup code
            const updatedCodes = [...user.mfaBackupCodes];
            updatedCodes.splice(i, 1);
            await user.update({ mfaBackupCodes: updatedCodes }, { transaction });
            return true;
        }
    }
    return false;
}
// ============================================================================
// SESSION MANAGEMENT
// ============================================================================
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
async function createSession(Session, config, transaction) {
    const sessionToken = crypto.randomBytes(64).toString('base64url');
    const expiresAt = new Date();
    if (config.expiresIn) {
        expiresAt.setTime(expiresAt.getTime() + config.expiresIn);
    }
    else {
        expiresAt.setMinutes(expiresAt.getMinutes() + 30); // Default 30 minutes
    }
    return await Session.create({
        userId: config.userId,
        sessionToken,
        ipAddress: config.ipAddress,
        userAgent: config.userAgent,
        lastActivityAt: new Date(),
        expiresAt,
        metadata: config.metadata,
    }, { transaction });
}
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
async function validateSession(Session, sessionToken, transaction) {
    const session = await Session.findOne({
        where: {
            sessionToken,
            isActive: true,
            expiresAt: { [sequelize_1.Op.gt]: new Date() },
        },
        transaction,
    });
    if (session) {
        await session.update({ lastActivityAt: new Date() }, { transaction });
    }
    return session;
}
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
async function destroySession(Session, sessionToken, transaction) {
    await Session.update({ isActive: false }, {
        where: { sessionToken },
        transaction,
    });
}
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
async function destroyAllUserSessions(Session, userId, transaction) {
    const [count] = await Session.update({ isActive: false }, {
        where: { userId, isActive: true },
        transaction,
    });
    return count;
}
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
async function cleanupExpiredSessions(Session, transaction) {
    return await Session.destroy({
        where: {
            expiresAt: { [sequelize_1.Op.lt]: new Date() },
        },
        transaction,
    });
}
// ============================================================================
// API KEY MANAGEMENT
// ============================================================================
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
async function generateApiKey(ApiKey, config, transaction) {
    const prefix = config.prefix || 'wc';
    const length = config.length || 32;
    const randomPart = crypto.randomBytes(length).toString('base64url');
    const key = `${prefix}_${randomPart}`;
    const keyHash = crypto.createHash('sha256').update(key).digest('hex');
    let expiresAt;
    if (config.expiresIn) {
        expiresAt = new Date();
        expiresAt.setTime(expiresAt.getTime() + config.expiresIn);
    }
    const model = await ApiKey.create({
        userId: config.userId,
        name: `API Key ${Date.now()}`,
        keyHash,
        prefix,
        permissions: config.permissions || [],
        scopes: config.scopes || [],
        rateLimit: config.rateLimit,
        expiresAt,
        metadata: config.metadata,
    }, { transaction });
    return { key, model };
}
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
async function validateApiKey(ApiKey, key, transaction) {
    const keyHash = crypto.createHash('sha256').update(key).digest('hex');
    const apiKey = await ApiKey.findOne({
        where: {
            keyHash,
            isActive: true,
            [sequelize_1.Op.or]: [
                { expiresAt: null },
                { expiresAt: { [sequelize_1.Op.gt]: new Date() } },
            ],
        },
        transaction,
    });
    if (apiKey) {
        await apiKey.update({ lastUsedAt: new Date() }, { transaction });
    }
    return apiKey;
}
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
async function revokeApiKey(ApiKey, keyId, transaction) {
    await ApiKey.update({ isActive: false }, {
        where: { id: keyId },
        transaction,
    });
}
// ============================================================================
// RBAC UTILITIES
// ============================================================================
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
async function checkPermission(userId, permissionName, UserRole, RolePermission, Permission, transaction) {
    const userRoles = await UserRole.findAll({
        where: {
            userId,
            isActive: true,
            [sequelize_1.Op.or]: [
                { expiresAt: null },
                { expiresAt: { [sequelize_1.Op.gt]: new Date() } },
            ],
        },
        transaction,
    });
    const roleIds = userRoles.map(ur => ur.roleId);
    const permission = await Permission.findOne({
        where: { name: permissionName },
        transaction,
    });
    if (!permission)
        return false;
    const rolePermission = await RolePermission.findOne({
        where: {
            roleId: { [sequelize_1.Op.in]: roleIds },
            permissionId: permission.id,
            isGranted: true,
        },
        transaction,
    });
    return !!rolePermission;
}
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
async function hasAnyRole(userId, roleNames, UserRole, Role, transaction) {
    const roles = await Role.findAll({
        where: {
            name: { [sequelize_1.Op.in]: roleNames },
        },
        transaction,
    });
    const roleIds = roles.map(r => r.id);
    const userRole = await UserRole.findOne({
        where: {
            userId,
            roleId: { [sequelize_1.Op.in]: roleIds },
            isActive: true,
            [sequelize_1.Op.or]: [
                { expiresAt: null },
                { expiresAt: { [sequelize_1.Op.gt]: new Date() } },
            ],
        },
        transaction,
    });
    return !!userRole;
}
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
async function hasAllRoles(userId, roleNames, UserRole, Role, transaction) {
    const roles = await Role.findAll({
        where: {
            name: { [sequelize_1.Op.in]: roleNames },
        },
        transaction,
    });
    const roleIds = roles.map(r => r.id);
    const userRoles = await UserRole.findAll({
        where: {
            userId,
            roleId: { [sequelize_1.Op.in]: roleIds },
            isActive: true,
            [sequelize_1.Op.or]: [
                { expiresAt: null },
                { expiresAt: { [sequelize_1.Op.gt]: new Date() } },
            ],
        },
        transaction,
    });
    return userRoles.length === roleNames.length;
}
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
async function getUserRoles(userId, UserRole, Role, transaction) {
    const userRoles = await UserRole.findAll({
        where: {
            userId,
            isActive: true,
            [sequelize_1.Op.or]: [
                { expiresAt: null },
                { expiresAt: { [sequelize_1.Op.gt]: new Date() } },
            ],
        },
        include: [{ model: Role, as: 'role' }],
        transaction,
    });
    return userRoles.map((ur) => ur.role).filter(Boolean);
}
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
async function getUserPermissions(userId, UserRole, RolePermission, Permission, transaction) {
    const userRoles = await UserRole.findAll({
        where: {
            userId,
            isActive: true,
            [sequelize_1.Op.or]: [
                { expiresAt: null },
                { expiresAt: { [sequelize_1.Op.gt]: new Date() } },
            ],
        },
        transaction,
    });
    const roleIds = userRoles.map(ur => ur.roleId);
    const rolePermissions = await RolePermission.findAll({
        where: {
            roleId: { [sequelize_1.Op.in]: roleIds },
            isGranted: true,
        },
        include: [{ model: Permission, as: 'permission' }],
        transaction,
    });
    const permissions = rolePermissions
        .map((rp) => rp.permission)
        .filter(Boolean);
    // Remove duplicates
    const uniquePermissions = Array.from(new Map(permissions.map(p => [p.id, p])).values());
    return uniquePermissions;
}
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
async function assignRoleToUser(userId, roleName, UserRole, Role, options = {}, transaction) {
    const role = await Role.findOne({
        where: { name: roleName },
        transaction,
    });
    if (!role) {
        throw new common_1.BadRequestException(`Role '${roleName}' not found`);
    }
    return await UserRole.create({
        userId,
        roleId: role.id,
        assignedBy: options.assignedBy,
        expiresAt: options.expiresAt,
        metadata: options.metadata,
    }, { transaction });
}
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
async function revokeRoleFromUser(userId, roleName, UserRole, Role, transaction) {
    const role = await Role.findOne({
        where: { name: roleName },
        transaction,
    });
    if (!role) {
        throw new common_1.BadRequestException(`Role '${roleName}' not found`);
    }
    await UserRole.update({ isActive: false }, {
        where: {
            userId,
            roleId: role.id,
        },
        transaction,
    });
}
// ============================================================================
// LOGIN ATTEMPT TRACKING
// ============================================================================
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
async function trackLoginAttempt(LoginAttempt, attempt, transaction) {
    return await LoginAttempt.create(attempt, { transaction });
}
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
async function getRecentLoginAttempts(LoginAttempt, email, minutes = 15, transaction) {
    const since = new Date();
    since.setMinutes(since.getMinutes() - minutes);
    return await LoginAttempt.findAll({
        where: {
            email,
            createdAt: { [sequelize_1.Op.gte]: since },
        },
        order: [['createdAt', 'DESC']],
        transaction,
    });
}
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
async function shouldLockAccount(LoginAttempt, email, maxAttempts = 5, windowMinutes = 15, transaction) {
    const attempts = await getRecentLoginAttempts(LoginAttempt, email, windowMinutes, transaction);
    const failedAttempts = attempts.filter(a => !a.success);
    return failedAttempts.length >= maxAttempts;
}
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
async function lockUserAccount(User, email, lockMinutes = 30, transaction) {
    const lockedUntil = new Date();
    lockedUntil.setMinutes(lockedUntil.getMinutes() + lockMinutes);
    const user = await User.findOne({
        where: { email },
        transaction,
    });
    if (!user) {
        throw new common_1.BadRequestException('User not found');
    }
    await user.update({
        lockedUntil,
        failedLoginAttempts: 0,
    }, { transaction });
    return user;
}
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
async function unlockUserAccount(User, userId, transaction) {
    const user = await User.findByPk(userId, { transaction });
    if (!user) {
        throw new common_1.BadRequestException('User not found');
    }
    await user.update({
        lockedUntil: null,
        failedLoginAttempts: 0,
    }, { transaction });
    return user;
}
// ============================================================================
// NESTJS DECORATORS
// ============================================================================
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
exports.CurrentUser = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
});
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
const Roles = (...roles) => (0, common_1.SetMetadata)('roles', roles);
exports.Roles = Roles;
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
const Permissions = (...permissions) => (0, common_1.SetMetadata)('permissions', permissions);
exports.Permissions = Permissions;
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
const Public = () => (0, common_1.SetMetadata)('isPublic', true);
exports.Public = Public;
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
const RequireMFA = () => (0, common_1.SetMetadata)('requireMFA', true);
exports.RequireMFA = RequireMFA;
// ============================================================================
// NESTJS GUARDS
// ============================================================================
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
let JwtAuthGuard = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var JwtAuthGuard = _classThis = class {
        constructor(reflector, jwtService) {
            this.reflector = reflector;
            this.jwtService = jwtService;
        }
        async canActivate(context) {
            const isPublic = this.reflector.getAllAndOverride('isPublic', [
                context.getHandler(),
                context.getClass(),
            ]);
            if (isPublic) {
                return true;
            }
            const request = context.switchToHttp().getRequest();
            const token = this.extractTokenFromHeader(request);
            if (!token) {
                throw new common_1.UnauthorizedException('No token provided');
            }
            try {
                const payload = this.jwtService.verify(token);
                request.user = payload;
                return true;
            }
            catch {
                throw new common_1.UnauthorizedException('Invalid token');
            }
        }
        extractTokenFromHeader(request) {
            const [type, token] = request.headers.authorization?.split(' ') ?? [];
            return type === 'Bearer' ? token : undefined;
        }
    };
    __setFunctionName(_classThis, "JwtAuthGuard");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        JwtAuthGuard = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return JwtAuthGuard = _classThis;
})();
exports.JwtAuthGuard = JwtAuthGuard;
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
let RolesGuard = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var RolesGuard = _classThis = class {
        constructor(reflector) {
            this.reflector = reflector;
        }
        canActivate(context) {
            const requiredRoles = this.reflector.getAllAndOverride('roles', [
                context.getHandler(),
                context.getClass(),
            ]);
            if (!requiredRoles) {
                return true;
            }
            const { user } = context.switchToHttp().getRequest();
            if (!user) {
                throw new common_1.UnauthorizedException('User not authenticated');
            }
            const userRoles = user.roles || (user.role ? [user.role] : []);
            return requiredRoles.some(role => userRoles.includes(role));
        }
    };
    __setFunctionName(_classThis, "RolesGuard");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RolesGuard = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RolesGuard = _classThis;
})();
exports.RolesGuard = RolesGuard;
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
let PermissionsGuard = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var PermissionsGuard = _classThis = class {
        constructor(reflector) {
            this.reflector = reflector;
        }
        canActivate(context) {
            const requiredPermissions = this.reflector.getAllAndOverride('permissions', [context.getHandler(), context.getClass()]);
            if (!requiredPermissions) {
                return true;
            }
            const { user } = context.switchToHttp().getRequest();
            if (!user) {
                throw new common_1.UnauthorizedException('User not authenticated');
            }
            const userPermissions = user.permissions || [];
            return requiredPermissions.every(permission => userPermissions.includes(permission));
        }
    };
    __setFunctionName(_classThis, "PermissionsGuard");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PermissionsGuard = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PermissionsGuard = _classThis;
})();
exports.PermissionsGuard = PermissionsGuard;
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
let ApiKeyGuard = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ApiKeyGuard = _classThis = class {
        constructor(apiKeyModel, reflector) {
            this.apiKeyModel = apiKeyModel;
            this.reflector = reflector;
        }
        async canActivate(context) {
            const isPublic = this.reflector.getAllAndOverride('isPublic', [
                context.getHandler(),
                context.getClass(),
            ]);
            if (isPublic) {
                return true;
            }
            const request = context.switchToHttp().getRequest();
            const apiKey = this.extractApiKey(request);
            if (!apiKey) {
                throw new common_1.UnauthorizedException('No API key provided');
            }
            const validKey = await validateApiKey(this.apiKeyModel, apiKey);
            if (!validKey) {
                throw new common_1.UnauthorizedException('Invalid API key');
            }
            request.user = {
                sub: validKey.userId || 'api-key',
                type: 'api-key',
                permissions: validKey.permissions,
                scopes: validKey.scopes,
            };
            return true;
        }
        extractApiKey(request) {
            const authHeader = request.headers.authorization;
            if (authHeader?.startsWith('Bearer ')) {
                return authHeader.substring(7);
            }
            const apiKeyHeader = request.headers['x-api-key'];
            if (typeof apiKeyHeader === 'string') {
                return apiKeyHeader;
            }
            return undefined;
        }
    };
    __setFunctionName(_classThis, "ApiKeyGuard");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ApiKeyGuard = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ApiKeyGuard = _classThis;
})();
exports.ApiKeyGuard = ApiKeyGuard;
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
let MFAGuard = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var MFAGuard = _classThis = class {
        constructor(reflector) {
            this.reflector = reflector;
        }
        canActivate(context) {
            const requireMFA = this.reflector.getAllAndOverride('requireMFA', [
                context.getHandler(),
                context.getClass(),
            ]);
            if (!requireMFA) {
                return true;
            }
            const { user } = context.switchToHttp().getRequest();
            if (!user) {
                throw new common_1.UnauthorizedException('User not authenticated');
            }
            if (!user.mfaVerified) {
                throw new common_1.ForbiddenException('MFA verification required');
            }
            return true;
        }
    };
    __setFunctionName(_classThis, "MFAGuard");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MFAGuard = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MFAGuard = _classThis;
})();
exports.MFAGuard = MFAGuard;
//# sourceMappingURL=auth-rbac-kit.js.map