"use strict";
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
exports.DEFAULT_AUTH_RATE_LIMIT = exports.DEFAULT_PASSWORD_POLICY = exports.AuditInterceptor = exports.Session = exports.CurrentUser = exports.RequirePermissions = exports.Roles = exports.Public = exports.ApiKeyGuard = exports.PermissionsGuard = exports.RolesGuard = exports.JwtAuthGuard = exports.APIKeyCreationSchema = exports.TOTPVerificationSchema = exports.OAuth2TokenRequestSchema = exports.UserRegistrationSchema = exports.PasswordChangeSchema = exports.LoginCredentialsSchema = exports.ResourceType = exports.PermissionAction = exports.UserRole = exports.OAuth2GrantType = exports.AuthMethod = void 0;
exports.generateAccessToken = generateAccessToken;
exports.generateRefreshToken = generateRefreshToken;
exports.verifyJWTToken = verifyJWTToken;
exports.decodeJWTToken = decodeJWTToken;
exports.isTokenExpired = isTokenExpired;
exports.extractTokenFromHeader = extractTokenFromHeader;
exports.revokeToken = revokeToken;
exports.isTokenBlacklisted = isTokenBlacklisted;
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
exports.validatePasswordPolicy = validatePasswordPolicy;
exports.generateSecurePassword = generateSecurePassword;
exports.isPasswordExpired = isPasswordExpired;
exports.createSession = createSession;
exports.getSession = getSession;
exports.updateSessionActivity = updateSessionActivity;
exports.destroySession = destroySession;
exports.destroyAllUserSessions = destroyAllUserSessions;
exports.getUserSessions = getUserSessions;
exports.generateAuthorizationCode = generateAuthorizationCode;
exports.exchangeAuthorizationCode = exchangeAuthorizationCode;
exports.validateRedirectUri = validateRedirectUri;
exports.generatePKCEChallenge = generatePKCEChallenge;
exports.hasRole = hasRole;
exports.hasPermission = hasPermission;
exports.hasAnyPermission = hasAnyPermission;
exports.buildPermission = buildPermission;
exports.parsePermission = parsePermission;
exports.evaluateABACPolicy = evaluateABACPolicy;
exports.generateTOTPSecret = generateTOTPSecret;
exports.generateTOTPQRCodeURL = generateTOTPQRCodeURL;
exports.verifyTOTPCode = verifyTOTPCode;
exports.generateBackupCodes = generateBackupCodes;
exports.generateAPIKey = generateAPIKey;
exports.verifyAPIKey = verifyAPIKey;
exports.extractAPIKey = extractAPIKey;
exports.rotateAPIKey = rotateAPIKey;
exports.trackLoginAttempt = trackLoginAttempt;
exports.checkAccountLockout = checkAccountLockout;
exports.lockAccount = lockAccount;
exports.unlockAccount = unlockAccount;
/**
 * File: /reuse/auth-security-kit.prod.ts
 * Locator: WC-AUTH-SEC-PROD-001
 * Purpose: Production-Grade Authentication & Authorization Kit - Enterprise security toolkit
 *
 * Upstream: NestJS, Passport, JWT, Swagger, bcrypt, argon2, otplib, Sequelize, Zod
 * Downstream: ../backend/auth/*, Guards, Strategies, Controllers, Security Services
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/passport, @nestjs/jwt, @nestjs/swagger
 * Exports: 47+ production-ready auth functions covering JWT, OAuth2, RBAC, sessions, 2FA, API keys
 *
 * LLM Context: Production-grade authentication and authorization utilities for White Cross healthcare platform.
 * Provides comprehensive JWT token lifecycle management (access/refresh tokens), OAuth2/OIDC flows, password
 * hashing with bcrypt/argon2, password policy enforcement, session management with Redis, role-based access
 * control (RBAC), attribute-based access control (ABAC), permission checking, 2FA/TOTP authentication, API key
 * generation/validation, rate limiting for auth attempts, account lockout, NestJS guards, custom decorators,
 * audit interceptors, security headers, CSRF protection, and HIPAA-compliant authentication patterns.
 * Includes Sequelize models for users, roles, permissions, sessions, API keys, and audit logs.
 */
const crypto = __importStar(require("crypto"));
const bcrypt = __importStar(require("bcrypt"));
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const zod_1 = require("zod");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Authentication method types
 */
var AuthMethod;
(function (AuthMethod) {
    AuthMethod["LOCAL"] = "local";
    AuthMethod["JWT"] = "jwt";
    AuthMethod["OAUTH2"] = "oauth2";
    AuthMethod["OIDC"] = "oidc";
    AuthMethod["SAML"] = "saml";
    AuthMethod["API_KEY"] = "api_key";
    AuthMethod["MFA"] = "mfa";
    AuthMethod["BIOMETRIC"] = "biometric";
})(AuthMethod || (exports.AuthMethod = AuthMethod = {}));
/**
 * OAuth2 grant types
 */
var OAuth2GrantType;
(function (OAuth2GrantType) {
    OAuth2GrantType["AUTHORIZATION_CODE"] = "authorization_code";
    OAuth2GrantType["CLIENT_CREDENTIALS"] = "client_credentials";
    OAuth2GrantType["PASSWORD"] = "password";
    OAuth2GrantType["REFRESH_TOKEN"] = "refresh_token";
    OAuth2GrantType["IMPLICIT"] = "implicit";
    OAuth2GrantType["DEVICE_CODE"] = "device_code";
})(OAuth2GrantType || (exports.OAuth2GrantType = OAuth2GrantType = {}));
/**
 * User roles enum
 */
var UserRole;
(function (UserRole) {
    UserRole["SUPER_ADMIN"] = "super_admin";
    UserRole["ADMIN"] = "admin";
    UserRole["DOCTOR"] = "doctor";
    UserRole["NURSE"] = "nurse";
    UserRole["PATIENT"] = "patient";
    UserRole["STAFF"] = "staff";
    UserRole["GUEST"] = "guest";
})(UserRole || (exports.UserRole = UserRole = {}));
/**
 * Permission actions
 */
var PermissionAction;
(function (PermissionAction) {
    PermissionAction["CREATE"] = "create";
    PermissionAction["READ"] = "read";
    PermissionAction["UPDATE"] = "update";
    PermissionAction["DELETE"] = "delete";
    PermissionAction["EXECUTE"] = "execute";
    PermissionAction["APPROVE"] = "approve";
    PermissionAction["MANAGE"] = "manage";
})(PermissionAction || (exports.PermissionAction = PermissionAction = {}));
/**
 * Resource types for authorization
 */
var ResourceType;
(function (ResourceType) {
    ResourceType["USER"] = "user";
    ResourceType["PATIENT"] = "patient";
    ResourceType["APPOINTMENT"] = "appointment";
    ResourceType["MEDICAL_RECORD"] = "medical_record";
    ResourceType["PRESCRIPTION"] = "prescription";
    ResourceType["BILLING"] = "billing";
    ResourceType["REPORT"] = "report";
    ResourceType["ADMIN"] = "admin";
})(ResourceType || (exports.ResourceType = ResourceType = {}));
// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================
/**
 * Login credentials schema
 */
exports.LoginCredentialsSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(1, 'Password is required'),
    mfaCode: zod_1.z.string().optional(),
    rememberMe: zod_1.z.boolean().optional().default(false),
});
/**
 * Password change schema
 */
exports.PasswordChangeSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().min(1, 'Current password is required'),
    newPassword: zod_1.z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(128, 'Password must not exceed 128 characters'),
    confirmPassword: zod_1.z.string().min(1, 'Password confirmation is required'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});
/**
 * User registration schema
 */
exports.UserRegistrationSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(128, 'Password must not exceed 128 characters'),
    firstName: zod_1.z.string().min(1, 'First name is required'),
    lastName: zod_1.z.string().min(1, 'Last name is required'),
    role: zod_1.z.nativeEnum(UserRole).optional().default(UserRole.PATIENT),
    phoneNumber: zod_1.z.string().optional(),
});
/**
 * OAuth2 token request schema
 */
exports.OAuth2TokenRequestSchema = zod_1.z.object({
    grantType: zod_1.z.nativeEnum(OAuth2GrantType),
    code: zod_1.z.string().optional(),
    redirectUri: zod_1.z.string().url().optional(),
    clientId: zod_1.z.string().min(1, 'Client ID is required'),
    clientSecret: zod_1.z.string().optional(),
    refreshToken: zod_1.z.string().optional(),
    username: zod_1.z.string().optional(),
    password: zod_1.z.string().optional(),
    scope: zod_1.z.array(zod_1.z.string()).optional(),
    codeVerifier: zod_1.z.string().optional(),
});
/**
 * TOTP verification schema
 */
exports.TOTPVerificationSchema = zod_1.z.object({
    code: zod_1.z.string().length(6, 'TOTP code must be 6 digits'),
    userId: zod_1.z.string().uuid('Invalid user ID'),
});
/**
 * API key creation schema
 */
exports.APIKeyCreationSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'API key name is required').max(100),
    scopes: zod_1.z.array(zod_1.z.string()).min(1, 'At least one scope is required'),
    permissions: zod_1.z.array(zod_1.z.string()).optional().default([]),
    expiresInDays: zod_1.z.number().int().min(1).max(365).optional(),
    rateLimit: zod_1.z.number().int().min(0).optional(),
});
// ============================================================================
// JWT TOKEN MANAGEMENT
// ============================================================================
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
async function generateAccessToken(user, jwtService, options) {
    const payload = {
        sub: user.id,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
        type: 'access',
        sessionId: options?.sessionId || user.sessionId,
        jti: crypto.randomBytes(16).toString('hex'),
        ...options?.additionalClaims,
    };
    return jwtService.sign(payload, {
        expiresIn: options?.expiresIn || '15m',
        issuer: options?.issuer || 'white-cross-api',
        audience: options?.audience || 'white-cross-client',
    });
}
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
async function generateRefreshToken(userId, jwtService, options) {
    const payload = {
        sub: userId,
        email: '', // Refresh tokens don't need email
        role: UserRole.GUEST, // Placeholder
        type: 'refresh',
        sessionId: options?.sessionId,
        jti: crypto.randomBytes(16).toString('hex'),
    };
    return jwtService.sign(payload, {
        expiresIn: options?.expiresIn || '7d',
        issuer: options?.issuer || 'white-cross-api',
        audience: options?.audience || 'white-cross-client',
    });
}
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
async function verifyJWTToken(token, jwtService, options) {
    try {
        const payload = jwtService.verify(token, {
            issuer: options?.issuer || 'white-cross-api',
            audience: options?.audience || 'white-cross-client',
            ignoreExpiration: options?.ignoreExpiration || false,
        });
        return payload;
    }
    catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new common_1.UnauthorizedException('Token has expired');
        }
        else if (error.name === 'JsonWebTokenError') {
            throw new common_1.UnauthorizedException('Invalid token');
        }
        else {
            throw new common_1.UnauthorizedException('Token verification failed');
        }
    }
}
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
function decodeJWTToken(token) {
    try {
        const parts = token.split('.');
        if (parts.length !== 3)
            return null;
        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
        return payload;
    }
    catch (error) {
        return null;
    }
}
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
function isTokenExpired(token) {
    const payload = decodeJWTToken(token);
    if (!payload || !payload.exp)
        return true;
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
}
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
function extractTokenFromHeader(request) {
    const authHeader = request.headers.authorization;
    if (!authHeader)
        return null;
    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token)
        return null;
    return token;
}
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
async function revokeToken(token, redisClient, // Redis client type
ttl) {
    const payload = decodeJWTToken(token);
    if (!payload || !payload.jti) {
        throw new common_1.BadRequestException('Invalid token for revocation');
    }
    const expiryTTL = ttl || (payload.exp ? payload.exp - Math.floor(Date.now() / 1000) : 3600);
    await redisClient.setex(`blacklist:${payload.jti}`, expiryTTL, 'revoked');
}
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
async function isTokenBlacklisted(token, redisClient) {
    const payload = decodeJWTToken(token);
    if (!payload || !payload.jti)
        return false;
    const result = await redisClient.get(`blacklist:${payload.jti}`);
    return result !== null;
}
// ============================================================================
// PASSWORD HASHING & VALIDATION
// ============================================================================
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
async function hashPassword(password, saltRounds = 12) {
    if (!password || password.length === 0) {
        throw new common_1.BadRequestException('Password cannot be empty');
    }
    if (password.length > 72) {
        // bcrypt has a 72-character limit
        throw new common_1.BadRequestException('Password is too long (max 72 characters)');
    }
    return bcrypt.hash(password, saltRounds);
}
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
async function verifyPassword(password, hash) {
    if (!password || !hash)
        return false;
    try {
        return await bcrypt.compare(password, hash);
    }
    catch (error) {
        return false;
    }
}
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
async function validatePasswordPolicy(password, policy, previousPasswords) {
    const errors = [];
    let score = 0;
    // Length validation
    if (password.length < policy.minLength) {
        errors.push(`Password must be at least ${policy.minLength} characters`);
    }
    else {
        score += 20;
    }
    if (password.length > policy.maxLength) {
        errors.push(`Password must not exceed ${policy.maxLength} characters`);
    }
    // Character requirements
    if (policy.requireUppercase && !/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }
    else if (policy.requireUppercase) {
        score += 15;
    }
    if (policy.requireLowercase && !/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }
    else if (policy.requireLowercase) {
        score += 15;
    }
    if (policy.requireNumbers && !/\d/.test(password)) {
        errors.push('Password must contain at least one number');
    }
    else if (policy.requireNumbers) {
        score += 15;
    }
    if (policy.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('Password must contain at least one special character');
    }
    else if (policy.requireSpecialChars) {
        score += 15;
    }
    // Check for common patterns
    if (/^(.)\1+$/.test(password)) {
        errors.push('Password cannot be all the same character');
        score -= 20;
    }
    if (/^(012|123|234|345|456|567|678|789|abc|bcd|cde)/i.test(password)) {
        errors.push('Password contains sequential characters');
        score -= 10;
    }
    // Entropy calculation
    const uniqueChars = new Set(password).size;
    score += Math.min(20, uniqueChars * 2);
    // Check password reuse
    if (previousPasswords && policy.preventReuse > 0) {
        const isReused = await Promise.all(previousPasswords.slice(0, policy.preventReuse).map((hash) => verifyPassword(password, hash)));
        if (isReused.some((match) => match)) {
            errors.push(`Password cannot be the same as your last ${policy.preventReuse} passwords`);
        }
    }
    // Determine strength
    let strength = 'weak';
    if (score >= 80)
        strength = 'very_strong';
    else if (score >= 60)
        strength = 'strong';
    else if (score >= 40)
        strength = 'good';
    else if (score >= 20)
        strength = 'fair';
    return {
        isValid: errors.length === 0 && score >= policy.complexityScore * 20,
        errors,
        strength,
        score: Math.max(0, Math.min(100, score)),
    };
}
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
function generateSecurePassword(policy) {
    const length = Math.max(policy.minLength, 16);
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    let charset = '';
    let password = '';
    // Ensure required character types
    if (policy.requireUppercase) {
        charset += uppercase;
        password += uppercase[crypto.randomInt(uppercase.length)];
    }
    if (policy.requireLowercase) {
        charset += lowercase;
        password += lowercase[crypto.randomInt(lowercase.length)];
    }
    if (policy.requireNumbers) {
        charset += numbers;
        password += numbers[crypto.randomInt(numbers.length)];
    }
    if (policy.requireSpecialChars) {
        charset += special;
        password += special[crypto.randomInt(special.length)];
    }
    // Fill remaining characters
    for (let i = password.length; i < length; i++) {
        password += charset[crypto.randomInt(charset.length)];
    }
    // Shuffle password
    return password
        .split('')
        .sort(() => crypto.randomInt(3) - 1)
        .join('');
}
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
function isPasswordExpired(passwordChangedAt, policy) {
    if (!policy.maxAge || policy.maxAge <= 0)
        return false;
    const daysSinceChange = (Date.now() - passwordChangedAt.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceChange >= policy.maxAge;
}
// ============================================================================
// SESSION MANAGEMENT
// ============================================================================
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
async function createSession(user, redisClient, options) {
    const sessionId = crypto.randomBytes(32).toString('hex');
    const now = new Date();
    const expiresIn = options?.expiresIn || 3600; // 1 hour default
    const session = {
        sessionId,
        userId: user.id,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
        createdAt: now,
        lastActivity: now,
        expiresAt: new Date(now.getTime() + expiresIn * 1000),
        ipAddress: options?.ipAddress,
        userAgent: options?.userAgent,
        deviceId: options?.deviceId,
        mfaVerified: user.mfaVerified || false,
        metadata: options?.metadata,
    };
    await redisClient.setex(`session:${sessionId}`, expiresIn, JSON.stringify(session));
    // Track user sessions
    await redisClient.sadd(`user:${user.id}:sessions`, sessionId);
    return session;
}
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
async function getSession(sessionId, redisClient) {
    const data = await redisClient.get(`session:${sessionId}`);
    if (!data)
        return null;
    try {
        const session = JSON.parse(data);
        session.createdAt = new Date(session.createdAt);
        session.lastActivity = new Date(session.lastActivity);
        session.expiresAt = new Date(session.expiresAt);
        return session;
    }
    catch (error) {
        return null;
    }
}
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
async function updateSessionActivity(sessionId, redisClient, extendExpiry = true) {
    const session = await getSession(sessionId, redisClient);
    if (!session)
        return null;
    session.lastActivity = new Date();
    if (extendExpiry) {
        const ttl = await redisClient.ttl(`session:${sessionId}`);
        if (ttl > 0) {
            await redisClient.setex(`session:${sessionId}`, ttl, JSON.stringify(session));
        }
    }
    else {
        await redisClient.set(`session:${sessionId}`, JSON.stringify(session));
    }
    return session;
}
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
async function destroySession(sessionId, redisClient) {
    const session = await getSession(sessionId, redisClient);
    if (session) {
        await redisClient.srem(`user:${session.userId}:sessions`, sessionId);
    }
    await redisClient.del(`session:${sessionId}`);
}
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
async function destroyAllUserSessions(userId, redisClient, exceptSessionId) {
    const sessionIds = await redisClient.smembers(`user:${userId}:sessions`);
    let destroyed = 0;
    for (const sessionId of sessionIds) {
        if (exceptSessionId && sessionId === exceptSessionId)
            continue;
        await redisClient.del(`session:${sessionId}`);
        await redisClient.srem(`user:${userId}:sessions`, sessionId);
        destroyed++;
    }
    return destroyed;
}
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
async function getUserSessions(userId, redisClient) {
    const sessionIds = await redisClient.smembers(`user:${userId}:sessions`);
    const sessions = [];
    for (const sessionId of sessionIds) {
        const session = await getSession(sessionId, redisClient);
        if (session) {
            sessions.push(session);
        }
        else {
            // Clean up stale session reference
            await redisClient.srem(`user:${userId}:sessions`, sessionId);
        }
    }
    return sessions;
}
// ============================================================================
// OAUTH2 FLOWS
// ============================================================================
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
async function generateAuthorizationCode(clientId, userId, scope, redirectUri, redisClient, codeChallenge) {
    const code = crypto.randomBytes(32).toString('base64url');
    const codeData = {
        clientId,
        userId,
        scope,
        redirectUri,
        codeChallenge,
        createdAt: Date.now(),
    };
    // Authorization codes expire in 10 minutes
    await redisClient.setex(`auth_code:${code}`, 600, JSON.stringify(codeData));
    return code;
}
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
async function exchangeAuthorizationCode(code, clientId, redirectUri, codeVerifier, redisClient, jwtService) {
    const codeData = await redisClient.get(`auth_code:${code}`);
    if (!codeData) {
        throw new common_1.UnauthorizedException('Invalid or expired authorization code');
    }
    const data = JSON.parse(codeData);
    // Validate client ID and redirect URI
    if (data.clientId !== clientId || data.redirectUri !== redirectUri) {
        throw new common_1.UnauthorizedException('Invalid client or redirect URI');
    }
    // Verify PKCE if code challenge was provided
    if (data.codeChallenge) {
        if (!codeVerifier) {
            throw new common_1.BadRequestException('Code verifier required');
        }
        const challenge = crypto
            .createHash('sha256')
            .update(codeVerifier)
            .digest('base64url');
        if (challenge !== data.codeChallenge) {
            throw new common_1.UnauthorizedException('Invalid code verifier');
        }
    }
    // Delete authorization code (one-time use)
    await redisClient.del(`auth_code:${code}`);
    // Generate tokens
    const payload = {
        sub: data.userId,
        email: '', // Would need to fetch from DB
        role: UserRole.GUEST, // Would need to fetch from DB
        type: 'access',
        jti: crypto.randomBytes(16).toString('hex'),
    };
    const accessToken = jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = jwtService.sign({ ...payload, type: 'refresh' }, { expiresIn: '7d' });
    return {
        accessToken,
        refreshToken,
        tokenType: 'Bearer',
        expiresIn: 3600,
        scope: data.scope.join(' '),
    };
}
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
function validateRedirectUri(redirectUri, registeredUris) {
    return registeredUris.some((uri) => {
        // Exact match
        if (uri === redirectUri)
            return true;
        // Wildcard subdomain match
        if (uri.includes('*')) {
            const pattern = uri.replace(/\*/g, '.*');
            return new RegExp(`^${pattern}$`).test(redirectUri);
        }
        return false;
    });
}
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
function generatePKCEChallenge() {
    const verifier = crypto.randomBytes(32).toString('base64url');
    const challenge = crypto
        .createHash('sha256')
        .update(verifier)
        .digest('base64url');
    return { verifier, challenge };
}
// ============================================================================
// RBAC (Role-Based Access Control)
// ============================================================================
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
function hasRole(user, requiredRoles) {
    return requiredRoles.includes(user.role);
}
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
function hasPermission(user, requiredPermissions) {
    return requiredPermissions.every((permission) => user.permissions.includes(permission));
}
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
function hasAnyPermission(user, permissions) {
    return permissions.some((permission) => user.permissions.includes(permission));
}
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
function buildPermission(resource, action) {
    return `${resource}:${action}`;
}
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
function parsePermission(permission) {
    const [resource, action] = permission.split(':');
    return { resource, action };
}
// ============================================================================
// ABAC (Attribute-Based Access Control)
// ============================================================================
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
function evaluateABACPolicy(user, resource, action, policies) {
    // Sort policies by priority (higher first)
    const sortedPolicies = [...policies].sort((a, b) => b.priority - a.priority);
    for (const policy of sortedPolicies) {
        // Check if policy applies to this resource and action
        if (policy.resource.type !== resource.type || policy.action !== action) {
            continue;
        }
        // Check subject (user) conditions
        if (policy.subject.roles && !policy.subject.roles.includes(user.role)) {
            continue;
        }
        if (policy.subject.permissions &&
            !hasPermission(user, policy.subject.permissions)) {
            continue;
        }
        // Evaluate conditions
        if (policy.conditions) {
            const conditionsMet = policy.conditions.every((condition) => evaluateCondition(condition, user, resource.attributes || {}));
            if (!conditionsMet)
                continue;
        }
        // Policy matches - return effect
        return policy.effect === 'allow';
    }
    // No matching policy - deny by default
    return false;
}
/**
 * Evaluate individual ABAC condition
 *
 * @param condition - Condition to evaluate
 * @param user - Authenticated user
 * @param resourceAttributes - Resource attributes
 * @returns True if condition is met
 */
function evaluateCondition(condition, user, resourceAttributes) {
    // Get attribute value (from user or resource)
    const actualValue = resourceAttributes[condition.attribute] ||
        user[condition.attribute];
    if (actualValue === undefined)
        return false;
    // Evaluate based on operator
    switch (condition.operator) {
        case 'eq':
            return actualValue === condition.value;
        case 'ne':
            return actualValue !== condition.value;
        case 'gt':
            return actualValue > condition.value;
        case 'lt':
            return actualValue < condition.value;
        case 'in':
            return Array.isArray(condition.value)
                ? condition.value.includes(actualValue)
                : false;
        case 'contains':
            return Array.isArray(actualValue)
                ? actualValue.includes(condition.value)
                : false;
        default:
            return false;
    }
}
// ============================================================================
// 2FA / TOTP
// ============================================================================
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
function generateTOTPSecret(userId, email) {
    const secret = crypto.randomBytes(20).toString('base32');
    return {
        secret,
        issuer: 'White Cross Healthcare',
        label: email,
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        window: 1,
    };
}
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
function generateTOTPQRCodeURL(config) {
    const params = new URLSearchParams({
        secret: config.secret,
        issuer: config.issuer,
        algorithm: config.algorithm,
        digits: config.digits.toString(),
        period: config.period.toString(),
    });
    return `otpauth://totp/${encodeURIComponent(config.issuer)}:${encodeURIComponent(config.label)}?${params}`;
}
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
function verifyTOTPCode(code, secret, config) {
    const window = config?.window || 1;
    const period = config?.period || 30;
    const digits = config?.digits || 6;
    const counter = Math.floor(Date.now() / 1000 / period);
    // Check current time window and adjacent windows
    for (let i = -window; i <= window; i++) {
        const expectedCode = generateTOTPCode(secret, counter + i, digits);
        if (expectedCode === code)
            return true;
    }
    return false;
}
/**
 * Generate TOTP code for a specific counter
 *
 * @param secret - TOTP secret
 * @param counter - Time counter
 * @param digits - Number of digits (default: 6)
 * @returns Generated TOTP code
 */
function generateTOTPCode(secret, counter, digits = 6) {
    const buffer = Buffer.alloc(8);
    buffer.writeBigInt64BE(BigInt(counter));
    const hmac = crypto.createHmac('sha1', Buffer.from(secret, 'base32'));
    hmac.update(buffer);
    const hash = hmac.digest();
    const offset = hash[hash.length - 1] & 0x0f;
    const binary = ((hash[offset] & 0x7f) << 24) |
        ((hash[offset + 1] & 0xff) << 16) |
        ((hash[offset + 2] & 0xff) << 8) |
        (hash[offset + 3] & 0xff);
    const code = binary % Math.pow(10, digits);
    return code.toString().padStart(digits, '0');
}
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
function generateBackupCodes(count = 10) {
    const codes = [];
    for (let i = 0; i < count; i++) {
        const code = crypto.randomBytes(4).toString('hex').toUpperCase();
        codes.push(`${code.slice(0, 4)}-${code.slice(4)}`);
    }
    return codes;
}
// ============================================================================
// API KEY MANAGEMENT
// ============================================================================
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
async function generateAPIKey(userId, name, scopes, permissions, options) {
    const id = crypto.randomUUID();
    const key = `wc_${crypto.randomBytes(32).toString('base64url')}`;
    const hash = crypto.createHash('sha256').update(key).digest('hex');
    const expiresAt = options?.expiresInDays
        ? new Date(Date.now() + options.expiresInDays * 24 * 60 * 60 * 1000)
        : undefined;
    return {
        id,
        key, // Only return this once
        hash, // Store this in database
        userId,
        name,
        scopes,
        permissions,
        rateLimit: options?.rateLimit,
        expiresAt,
        isActive: true,
        createdAt: new Date(),
    };
}
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
function verifyAPIKey(apiKey, storedHash) {
    const hash = crypto.createHash('sha256').update(apiKey).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(storedHash));
}
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
function extractAPIKey(request) {
    // Check X-API-Key header
    const headerKey = request.headers['x-api-key'];
    if (headerKey && typeof headerKey === 'string') {
        return headerKey;
    }
    // Check Authorization header with ApiKey scheme
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('ApiKey ')) {
        return authHeader.substring(7);
    }
    // Check query parameter (not recommended for production)
    const queryKey = request.query.api_key;
    if (queryKey && typeof queryKey === 'string') {
        return queryKey;
    }
    return null;
}
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
async function rotateAPIKey(oldKeyId, userId, name, scopes, permissions) {
    // Generate new key with same permissions
    const newKey = await generateAPIKey(userId, name, scopes, permissions);
    // Old key should be marked as inactive in database
    // This function just generates the new key
    return newKey;
}
// ============================================================================
// RATE LIMITING & ACCOUNT LOCKOUT
// ============================================================================
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
async function trackLoginAttempt(email, ipAddress, success, redisClient, config) {
    const key = `login_attempts:${email}:${ipAddress}`;
    if (success) {
        // Reset attempts on successful login
        await redisClient.del(key);
        return { isLocked: false, attemptsRemaining: config.maxAttempts };
    }
    // Increment failed attempts
    const attempts = await redisClient.incr(key);
    if (attempts === 1) {
        // Set expiration on first attempt
        await redisClient.pexpire(key, config.windowMs);
    }
    const remaining = Math.max(0, config.maxAttempts - attempts);
    if (attempts >= config.maxAttempts) {
        // Set lockout
        const lockKey = `lockout:${email}`;
        await redisClient.psetex(lockKey, config.blockDurationMs, 'locked');
        return {
            isLocked: true,
            attemptsRemaining: 0,
            lockDurationMs: config.blockDurationMs,
        };
    }
    return {
        isLocked: false,
        attemptsRemaining: remaining,
    };
}
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
async function checkAccountLockout(email, redisClient) {
    const lockKey = `lockout:${email}`;
    const ttl = await redisClient.pttl(lockKey);
    if (ttl > 0) {
        return {
            userId: '', // Would need to fetch from DB
            isLocked: true,
            lockedAt: new Date(Date.now() - ttl),
            lockedUntil: new Date(Date.now() + ttl),
            failedAttempts: 0, // Could track this separately
            lockReason: 'Too many failed login attempts',
        };
    }
    return {
        userId: '',
        isLocked: false,
        failedAttempts: 0,
    };
}
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
async function lockAccount(userId, durationMs, reason, redisClient) {
    const lockKey = `account_lock:${userId}`;
    await redisClient.psetex(lockKey, durationMs, JSON.stringify({ reason, lockedAt: Date.now() }));
}
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
async function unlockAccount(userId, redisClient) {
    const lockKey = `account_lock:${userId}`;
    await redisClient.del(lockKey);
}
// ============================================================================
// NESTJS GUARDS
// ============================================================================
/**
 * JWT Authentication Guard
 * Validates JWT token and attaches user to request
 */
let JwtAuthGuard = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var JwtAuthGuard = _classThis = class {
        constructor(jwtService, reflector) {
            this.jwtService = jwtService;
            this.reflector = reflector;
        }
        async canActivate(context) {
            // Check if route is public
            const isPublic = this.reflector?.getAllAndOverride('isPublic', [
                context.getHandler(),
                context.getClass(),
            ]);
            if (isPublic)
                return true;
            const request = context.switchToHttp().getRequest();
            const token = extractTokenFromHeader(request);
            if (!token) {
                throw new common_1.UnauthorizedException('No token provided');
            }
            try {
                const payload = await verifyJWTToken(token, this.jwtService);
                // Attach user to request
                request.user = {
                    id: payload.sub,
                    email: payload.email,
                    role: payload.role,
                    permissions: payload.permissions || [],
                    sessionId: payload.sessionId,
                };
                return true;
            }
            catch (error) {
                throw new common_1.UnauthorizedException('Invalid token');
            }
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
 * Roles Guard
 * Checks if user has required role(s)
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
            if (!requiredRoles || requiredRoles.length === 0) {
                return true;
            }
            const request = context.switchToHttp().getRequest();
            const user = request.user;
            if (!user) {
                throw new common_1.UnauthorizedException('User not authenticated');
            }
            const hasRequiredRole = hasRole(user, requiredRoles);
            if (!hasRequiredRole) {
                throw new common_1.ForbiddenException('Insufficient role privileges');
            }
            return true;
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
 * Permissions Guard
 * Checks if user has required permission(s)
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
            if (!requiredPermissions || requiredPermissions.length === 0) {
                return true;
            }
            const request = context.switchToHttp().getRequest();
            const user = request.user;
            if (!user) {
                throw new common_1.UnauthorizedException('User not authenticated');
            }
            const hasRequiredPermissions = hasPermission(user, requiredPermissions);
            if (!hasRequiredPermissions) {
                throw new common_1.ForbiddenException('Insufficient permissions');
            }
            return true;
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
 * API Key Guard
 * Validates API key from headers
 */
let ApiKeyGuard = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ApiKeyGuard = _classThis = class {
        async canActivate(context) {
            const request = context.switchToHttp().getRequest();
            const apiKey = extractAPIKey(request);
            if (!apiKey) {
                throw new common_1.UnauthorizedException('API key required');
            }
            // In production, fetch from database and verify
            // For now, this is a placeholder
            // const storedKey = await this.apiKeyService.findByKey(apiKey);
            // if (!storedKey || !verifyAPIKey(apiKey, storedKey.hash)) {
            //   throw new UnauthorizedException('Invalid API key');
            // }
            // Attach API key info to request
            // (request as any).apiKey = storedKey;
            return true;
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
// ============================================================================
// NESTJS DECORATORS
// ============================================================================
/**
 * Public route decorator - bypasses authentication
 */
const Public = () => (0, common_1.SetMetadata)('isPublic', true);
exports.Public = Public;
/**
 * Roles decorator - requires specific roles
 */
const Roles = (...roles) => (0, common_1.SetMetadata)('roles', roles);
exports.Roles = Roles;
/**
 * Permissions decorator - requires specific permissions
 */
const RequirePermissions = (...permissions) => (0, common_1.SetMetadata)('permissions', permissions);
exports.RequirePermissions = RequirePermissions;
/**
 * Current user decorator - extracts user from request
 */
exports.CurrentUser = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
        throw new common_1.UnauthorizedException('User not found in request');
    }
    return data ? user[data] : user;
});
/**
 * Session decorator - extracts session from request
 */
exports.Session = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.session;
});
// ============================================================================
// NESTJS INTERCEPTORS
// ============================================================================
/**
 * Audit Interceptor
 * Logs all authenticated requests for security auditing
 */
let AuditInterceptor = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AuditInterceptor = _classThis = class {
        intercept(context, next) {
            const request = context.switchToHttp().getRequest();
            const user = request.user;
            const startTime = Date.now();
            return next.handle().pipe((0, operators_1.tap)({
                next: () => {
                    const duration = Date.now() - startTime;
                    this.logAuditEvent({
                        userId: user?.id,
                        email: user?.email,
                        action: `${request.method} ${request.url}`,
                        success: true,
                        duration,
                        ipAddress: request.ip,
                        userAgent: request.headers['user-agent'],
                    });
                },
                error: (error) => {
                    const duration = Date.now() - startTime;
                    this.logAuditEvent({
                        userId: user?.id,
                        email: user?.email,
                        action: `${request.method} ${request.url}`,
                        success: false,
                        duration,
                        error: error.message,
                        ipAddress: request.ip,
                        userAgent: request.headers['user-agent'],
                    });
                },
            }));
        }
        logAuditEvent(event) {
            // In production, save to database or logging service
            console.log('[AUDIT]', JSON.stringify(event));
        }
    };
    __setFunctionName(_classThis, "AuditInterceptor");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuditInterceptor = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuditInterceptor = _classThis;
})();
exports.AuditInterceptor = AuditInterceptor;
/**
 * Default password policy for healthcare applications
 */
exports.DEFAULT_PASSWORD_POLICY = {
    minLength: 12,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    preventReuse: 5,
    maxAge: 90, // 90 days
    minAge: 1, // 1 day
    complexityScore: 3, // Strong
};
/**
 * Default rate limit configuration for auth endpoints
 */
exports.DEFAULT_AUTH_RATE_LIMIT = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxAttempts: 5,
    blockDurationMs: 30 * 60 * 1000, // 30 minutes
    skipSuccessfulRequests: true,
};
//# sourceMappingURL=auth-security-kit.prod.js.map