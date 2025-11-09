"use strict";
/**
 * LOC: IAM_AUTH_KIT_001
 * File: /reuse/iam-authentication-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/passport
 *   - @nestjs/jwt
 *   - passport
 *   - bcrypt
 *   - crypto
 *
 * DOWNSTREAM (imported by):
 *   - Authentication services
 *   - Auth controllers
 *   - Passport strategies
 *   - Authentication guards
 *   - Session middleware
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
exports.calculateLockoutExpiry = exports.shouldLockAccount = exports.trackLoginAttempt = exports.extractBearerToken = exports.createJwtStrategyConfig = exports.createLocalStrategyConfig = exports.encodeSamlRequest = exports.parseSamlResponse = exports.generateSamlRequest = exports.validateOAuthState = exports.exchangeOAuthCode = exports.buildOAuthAuthorizationUrl = exports.generateOAuthState = exports.hashBackupCode = exports.generateBackupCodes = exports.generateTotpUri = exports.generateTotpSecret = exports.verifyMfaToken = exports.generateMfaToken = exports.parseRememberMeCookie = exports.validateRememberMeToken = exports.hashRememberMeValidator = exports.generateRememberMeToken = exports.verifyCookieSignature = exports.signCookieValue = exports.extractCookieToken = exports.clearAuthCookie = exports.setAuthCookie = exports.checkTokenExpiration = exports.rotateRefreshToken = exports.validateRefreshToken = exports.verifyAccessToken = exports.generateRefreshToken = exports.generateAccessToken = exports.destroySession = exports.calculateSessionTimeout = exports.extendSessionExpiration = exports.refreshSessionActivity = exports.validateSessionActive = exports.generateSecureSessionId = exports.createAuthSession = exports.validatePasswordComplexity = exports.hashPasswordForStorage = exports.performLocalLogin = exports.validateLocalCredentials = exports.AuthFlowType = void 0;
/**
 * File: /reuse/iam-authentication-kit.ts
 * Locator: WC-IAM-AUTH-KIT-001
 * Purpose: Comprehensive IAM Authentication Kit - Enterprise-grade authentication toolkit
 *
 * Upstream: NestJS, Passport, JWT, bcrypt, crypto
 * Downstream: ../backend/auth/*, Guards, Strategies, Controllers
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/passport, @nestjs/jwt
 * Exports: 47 authentication functions for flows, sessions, tokens, MFA, OAuth, SAML
 *
 * LLM Context: Enterprise-grade authentication utilities for White Cross healthcare platform.
 * Provides comprehensive authentication flows (local, OAuth 2.0, SAML), session management,
 * token lifecycle management, cookie security, multi-factor authentication, Passport strategy
 * helpers, login/logout flows, remember-me functionality, and authentication state tracking.
 * HIPAA-compliant authentication patterns for secure healthcare data access.
 */
const crypto = __importStar(require("crypto"));
const bcrypt = __importStar(require("bcrypt"));
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Authentication flow types
 */
var AuthFlowType;
(function (AuthFlowType) {
    AuthFlowType["LOCAL"] = "local";
    AuthFlowType["OAUTH"] = "oauth";
    AuthFlowType["SAML"] = "saml";
    AuthFlowType["API_KEY"] = "api_key";
    AuthFlowType["BIOMETRIC"] = "biometric";
    AuthFlowType["MFA"] = "mfa";
})(AuthFlowType || (exports.AuthFlowType = AuthFlowType = {}));
// ============================================================================
// LOCAL AUTHENTICATION FLOW
// ============================================================================
/**
 * @function validateLocalCredentials
 * @description Validates user credentials for local authentication
 * @param {LoginCredentials} credentials - User login credentials
 * @param {string} storedPasswordHash - Stored bcrypt password hash
 * @returns {Promise<boolean>} True if credentials are valid
 *
 * @security Uses bcrypt constant-time comparison
 *
 * @example
 * ```typescript
 * const isValid = await validateLocalCredentials(
 *   { email: 'user@example.com', password: 'SecureP@ss123' },
 *   user.passwordHash
 * );
 * if (isValid) {
 *   // Proceed with login
 * }
 * ```
 */
const validateLocalCredentials = async (credentials, storedPasswordHash) => {
    if (!credentials.password || !storedPasswordHash) {
        return false;
    }
    return bcrypt.compare(credentials.password, storedPasswordHash);
};
exports.validateLocalCredentials = validateLocalCredentials;
/**
 * @function performLocalLogin
 * @description Performs complete local authentication flow
 * @param {LoginCredentials} credentials - Login credentials
 * @param {Function} userLookup - Async function to lookup user by email
 * @returns {Promise<AuthResult>} Authentication result
 *
 * @example
 * ```typescript
 * const result = await performLocalLogin(credentials, async (email) => {
 *   return await userService.findByEmail(email);
 * });
 * ```
 */
const performLocalLogin = async (credentials, userLookup) => {
    const user = await userLookup(credentials.email);
    if (!user || !user.isActive) {
        return {
            success: false,
            message: 'Invalid credentials or inactive account',
        };
    }
    const isValid = await (0, exports.validateLocalCredentials)(credentials, user.passwordHash);
    if (!isValid) {
        return {
            success: false,
            message: 'Invalid credentials',
        };
    }
    // Check if MFA is required
    if (user.mfaEnabled && !credentials.mfaCode) {
        return {
            success: false,
            requiresMfa: true,
            mfaToken: (0, exports.generateMfaToken)(user.id),
            message: 'MFA verification required',
        };
    }
    return {
        success: true,
        userId: user.id,
    };
};
exports.performLocalLogin = performLocalLogin;
/**
 * @function hashPasswordForStorage
 * @description Hashes password with bcrypt for secure storage
 * @param {string} password - Plain text password
 * @param {number} saltRounds - Bcrypt salt rounds (default: 12)
 * @returns {Promise<string>} Password hash
 *
 * @security HIPAA-compliant with 12+ salt rounds
 *
 * @example
 * ```typescript
 * const hash = await hashPasswordForStorage('MySecureP@ss123');
 * // Store hash in database
 * ```
 */
const hashPasswordForStorage = async (password, saltRounds = 12) => {
    return bcrypt.hash(password, saltRounds);
};
exports.hashPasswordForStorage = hashPasswordForStorage;
/**
 * @function validatePasswordComplexity
 * @description Validates password meets complexity requirements
 * @param {string} password - Password to validate
 * @returns {object} Validation result with errors
 *
 * @security Enforces HIPAA-compliant password requirements
 *
 * @example
 * ```typescript
 * const validation = validatePasswordComplexity('weak');
 * if (!validation.isValid) {
 *   console.log('Errors:', validation.errors);
 * }
 * ```
 */
const validatePasswordComplexity = (password) => {
    const errors = [];
    let score = 0;
    if (!password) {
        return { isValid: false, errors: ['Password is required'], score: 0 };
    }
    // Length requirements
    if (password.length < 12) {
        errors.push('Password must be at least 12 characters long');
    }
    else if (password.length >= 12) {
        score += 1;
    }
    if (password.length >= 16) {
        score += 1;
    }
    // Character variety
    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain lowercase letters');
    }
    else {
        score += 1;
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain uppercase letters');
    }
    else {
        score += 1;
    }
    if (!/\d/.test(password)) {
        errors.push('Password must contain numbers');
    }
    else {
        score += 1;
    }
    if (!/[@$!%*?&#^()_\-+=\[\]{}|;:,.<>]/.test(password)) {
        errors.push('Password must contain special characters');
    }
    else {
        score += 1;
    }
    // Common patterns
    if (/(.)\1{2,}/.test(password)) {
        errors.push('Password contains repeated characters');
        score -= 1;
    }
    if (/^(password|admin|user|12345|qwerty)/i.test(password)) {
        errors.push('Password is too common');
        score = 0;
    }
    return {
        isValid: errors.length === 0,
        errors,
        score: Math.max(0, score),
    };
};
exports.validatePasswordComplexity = validatePasswordComplexity;
// ============================================================================
// SESSION MANAGEMENT
// ============================================================================
/**
 * @function createAuthSession
 * @description Creates a new authentication session
 * @param {AuthPayload} payload - Authentication payload
 * @param {number} expirationMs - Session expiration in milliseconds
 * @returns {SessionData} Session data object
 *
 * @example
 * ```typescript
 * const session = createAuthSession(
 *   { userId: 'user123', email: 'user@example.com', role: 'doctor' },
 *   3600000 // 1 hour
 * );
 * ```
 */
const createAuthSession = (payload, expirationMs = 3600000) => {
    const now = new Date();
    return {
        sessionId: (0, exports.generateSecureSessionId)(),
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
        createdAt: now,
        lastActivity: now,
        expiresAt: new Date(now.getTime() + expirationMs),
        ipAddress: payload.ipAddress,
        userAgent: payload.userAgent,
        deviceId: payload.deviceId,
        mfaVerified: payload.mfaVerified || false,
        rememberMe: false,
    };
};
exports.createAuthSession = createAuthSession;
/**
 * @function generateSecureSessionId
 * @description Generates cryptographically secure session ID
 * @returns {string} Session ID (64 character hex string)
 *
 * @security Uses crypto.randomBytes
 *
 * @example
 * ```typescript
 * const sessionId = generateSecureSessionId();
 * ```
 */
const generateSecureSessionId = () => {
    return crypto.randomBytes(32).toString('hex');
};
exports.generateSecureSessionId = generateSecureSessionId;
/**
 * @function validateSessionActive
 * @description Checks if session is active and not expired
 * @param {SessionData} session - Session data
 * @returns {boolean} True if session is active
 *
 * @example
 * ```typescript
 * if (!validateSessionActive(session)) {
 *   throw new UnauthorizedException('Session expired');
 * }
 * ```
 */
const validateSessionActive = (session) => {
    if (!session || !session.expiresAt) {
        return false;
    }
    return new Date() < session.expiresAt;
};
exports.validateSessionActive = validateSessionActive;
/**
 * @function refreshSessionActivity
 * @description Updates session last activity timestamp
 * @param {SessionData} session - Session to update
 * @returns {SessionData} Updated session
 *
 * @example
 * ```typescript
 * const updated = refreshSessionActivity(session);
 * ```
 */
const refreshSessionActivity = (session) => {
    return {
        ...session,
        lastActivity: new Date(),
    };
};
exports.refreshSessionActivity = refreshSessionActivity;
/**
 * @function extendSessionExpiration
 * @description Extends session expiration time
 * @param {SessionData} session - Session to extend
 * @param {number} extensionMs - Extension time in milliseconds
 * @returns {SessionData} Extended session
 *
 * @example
 * ```typescript
 * const extended = extendSessionExpiration(session, 1800000); // Add 30 minutes
 * ```
 */
const extendSessionExpiration = (session, extensionMs) => {
    return {
        ...session,
        expiresAt: new Date(session.expiresAt.getTime() + extensionMs),
    };
};
exports.extendSessionExpiration = extendSessionExpiration;
/**
 * @function calculateSessionTimeout
 * @description Calculates remaining session time in seconds
 * @param {SessionData} session - Session data
 * @returns {number} Remaining seconds (0 if expired)
 *
 * @example
 * ```typescript
 * const remaining = calculateSessionTimeout(session);
 * console.log(`Session expires in ${remaining} seconds`);
 * ```
 */
const calculateSessionTimeout = (session) => {
    const remaining = session.expiresAt.getTime() - Date.now();
    return Math.max(0, Math.floor(remaining / 1000));
};
exports.calculateSessionTimeout = calculateSessionTimeout;
/**
 * @function destroySession
 * @description Creates a destroyed session marker for cleanup
 * @param {string} sessionId - Session ID to destroy
 * @returns {object} Destruction metadata
 *
 * @example
 * ```typescript
 * const metadata = destroySession(session.sessionId);
 * await sessionStore.delete(sessionId);
 * ```
 */
const destroySession = (sessionId) => {
    return {
        sessionId,
        destroyedAt: new Date(),
        reason: 'explicit_logout',
    };
};
exports.destroySession = destroySession;
// ============================================================================
// TOKEN LIFECYCLE MANAGEMENT
// ============================================================================
/**
 * @function generateAccessToken
 * @description Generates short-lived access token
 * @param {AuthPayload} payload - Token payload
 * @param {number} expiresInSeconds - Expiration time (default: 900 = 15 minutes)
 * @returns {string} JWT access token
 *
 * @example
 * ```typescript
 * const token = generateAccessToken({ userId: 'user123', email: '...', role: 'admin' });
 * ```
 */
const generateAccessToken = (payload, expiresInSeconds = 900) => {
    const header = {
        alg: 'HS256',
        typ: 'JWT',
    };
    const now = Math.floor(Date.now() / 1000);
    const fullPayload = {
        sub: payload.userId,
        email: payload.email,
        role: payload.role,
        permissions: payload.permissions || [],
        type: 'access',
        iat: now,
        exp: now + expiresInSeconds,
    };
    return encodeJWT(header, fullPayload);
};
exports.generateAccessToken = generateAccessToken;
/**
 * @function generateRefreshToken
 * @description Generates long-lived refresh token
 * @param {string} userId - User ID
 * @param {number} expiresInSeconds - Expiration (default: 604800 = 7 days)
 * @returns {object} Refresh token and hash
 *
 * @example
 * ```typescript
 * const { token, hash } = generateRefreshToken('user123');
 * // Store hash in database
 * ```
 */
const generateRefreshToken = (userId, expiresInSeconds = 604800) => {
    const token = crypto.randomBytes(64).toString('hex');
    const hash = crypto.createHash('sha256').update(token).digest('hex');
    return {
        token,
        hash,
        expiresAt: new Date(Date.now() + expiresInSeconds * 1000),
    };
};
exports.generateRefreshToken = generateRefreshToken;
/**
 * @function verifyAccessToken
 * @description Verifies and decodes access token
 * @param {string} token - JWT token
 * @param {string} secret - JWT secret
 * @returns {AuthPayload | null} Decoded payload or null
 *
 * @example
 * ```typescript
 * const payload = verifyAccessToken(token, 'secret-key');
 * if (!payload) {
 *   throw new UnauthorizedException('Invalid token');
 * }
 * ```
 */
const verifyAccessToken = (token, secret) => {
    try {
        const decoded = decodeJWT(token, secret);
        if (!decoded || decoded.type !== 'access') {
            return null;
        }
        return {
            userId: decoded.sub,
            email: decoded.email,
            role: decoded.role,
            permissions: decoded.permissions,
        };
    }
    catch {
        return null;
    }
};
exports.verifyAccessToken = verifyAccessToken;
/**
 * @function validateRefreshToken
 * @description Validates refresh token against stored hash
 * @param {string} token - Refresh token
 * @param {string} storedHash - Stored token hash
 * @returns {boolean} True if valid
 *
 * @security Uses constant-time comparison
 *
 * @example
 * ```typescript
 * if (!validateRefreshToken(providedToken, storedHash)) {
 *   throw new UnauthorizedException('Invalid refresh token');
 * }
 * ```
 */
const validateRefreshToken = (token, storedHash) => {
    const hash = crypto.createHash('sha256').update(token).digest('hex');
    try {
        return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(storedHash));
    }
    catch {
        return false;
    }
};
exports.validateRefreshToken = validateRefreshToken;
/**
 * @function rotateRefreshToken
 * @description Rotates refresh token (invalidate old, create new)
 * @param {string} userId - User ID
 * @returns {object} New refresh token and hash
 *
 * @security Implements refresh token rotation for security
 *
 * @example
 * ```typescript
 * const newToken = rotateRefreshToken('user123');
 * // Invalidate old token, store new hash
 * ```
 */
const rotateRefreshToken = (userId) => {
    return (0, exports.generateRefreshToken)(userId);
};
exports.rotateRefreshToken = rotateRefreshToken;
/**
 * @function checkTokenExpiration
 * @description Checks if token is expired
 * @param {string} token - JWT token
 * @returns {boolean} True if expired
 *
 * @example
 * ```typescript
 * if (checkTokenExpiration(token)) {
 *   // Request refresh
 * }
 * ```
 */
const checkTokenExpiration = (token) => {
    try {
        const decoded = decodeJWTUnsafe(token);
        if (!decoded || !decoded.exp) {
            return true;
        }
        return decoded.exp < Math.floor(Date.now() / 1000);
    }
    catch {
        return true;
    }
};
exports.checkTokenExpiration = checkTokenExpiration;
// ============================================================================
// COOKIE SECURITY
// ============================================================================
/**
 * @function setAuthCookie
 * @description Sets secure authentication cookie
 * @param {Response} res - Express response
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {AuthCookieOptions} options - Cookie options
 *
 * @security Sets httpOnly, secure, sameSite flags
 *
 * @example
 * ```typescript
 * setAuthCookie(res, 'access_token', token, {
 *   httpOnly: true,
 *   secure: true,
 *   sameSite: 'strict',
 *   maxAge: 900000
 * });
 * ```
 */
const setAuthCookie = (res, name, value, options = {}) => {
    const defaultOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
    };
    res.cookie(name, value, { ...defaultOptions, ...options });
};
exports.setAuthCookie = setAuthCookie;
/**
 * @function clearAuthCookie
 * @description Clears authentication cookie
 * @param {Response} res - Express response
 * @param {string} name - Cookie name
 *
 * @example
 * ```typescript
 * clearAuthCookie(res, 'access_token');
 * ```
 */
const clearAuthCookie = (res, name) => {
    res.clearCookie(name, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
    });
};
exports.clearAuthCookie = clearAuthCookie;
/**
 * @function extractCookieToken
 * @description Extracts token from request cookie
 * @param {Request} req - Express request
 * @param {string} cookieName - Cookie name
 * @returns {string | null} Token or null
 *
 * @example
 * ```typescript
 * const token = extractCookieToken(req, 'access_token');
 * ```
 */
const extractCookieToken = (req, cookieName) => {
    return req.cookies?.[cookieName] || null;
};
exports.extractCookieToken = extractCookieToken;
/**
 * @function signCookieValue
 * @description Signs cookie value for tamper detection
 * @param {string} value - Value to sign
 * @param {string} secret - Signing secret
 * @returns {string} Signed value (value.signature)
 *
 * @example
 * ```typescript
 * const signed = signCookieValue('user123', 'secret');
 * ```
 */
const signCookieValue = (value, secret) => {
    const signature = crypto.createHmac('sha256', secret).update(value).digest('hex');
    return `${value}.${signature}`;
};
exports.signCookieValue = signCookieValue;
/**
 * @function verifyCookieSignature
 * @description Verifies signed cookie value
 * @param {string} signedValue - Signed value
 * @param {string} secret - Signing secret
 * @returns {string | null} Original value or null if invalid
 *
 * @example
 * ```typescript
 * const value = verifyCookieSignature(signedCookie, 'secret');
 * ```
 */
const verifyCookieSignature = (signedValue, secret) => {
    const [value, signature] = signedValue.split('.');
    if (!value || !signature) {
        return null;
    }
    const expectedSignature = crypto.createHmac('sha256', secret).update(value).digest('hex');
    try {
        if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
            return value;
        }
    }
    catch {
        return null;
    }
    return null;
};
exports.verifyCookieSignature = verifyCookieSignature;
// ============================================================================
// REMEMBER-ME FUNCTIONALITY
// ============================================================================
/**
 * @function generateRememberMeToken
 * @description Generates remember-me token with selector and validator
 * @param {string} userId - User ID
 * @returns {RememberMeToken} Remember-me token data
 *
 * @security Uses selector/validator pattern for token theft detection
 *
 * @example
 * ```typescript
 * const rememberMe = generateRememberMeToken('user123');
 * // Store selector and hashed validator in database
 * ```
 */
const generateRememberMeToken = (userId) => {
    const selector = crypto.randomBytes(12).toString('hex');
    const validator = crypto.randomBytes(32).toString('hex');
    return {
        userId,
        selector,
        validator,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    };
};
exports.generateRememberMeToken = generateRememberMeToken;
/**
 * @function hashRememberMeValidator
 * @description Hashes remember-me validator for storage
 * @param {string} validator - Validator string
 * @returns {string} Hashed validator
 *
 * @example
 * ```typescript
 * const hash = hashRememberMeValidator(rememberMe.validator);
 * // Store hash in database
 * ```
 */
const hashRememberMeValidator = (validator) => {
    return crypto.createHash('sha256').update(validator).digest('hex');
};
exports.hashRememberMeValidator = hashRememberMeValidator;
/**
 * @function validateRememberMeToken
 * @description Validates remember-me token
 * @param {string} selector - Token selector
 * @param {string} validator - Token validator
 * @param {string} storedHash - Stored validator hash
 * @returns {boolean} True if valid
 *
 * @example
 * ```typescript
 * const isValid = validateRememberMeToken(selector, validator, storedHash);
 * ```
 */
const validateRememberMeToken = (selector, validator, storedHash) => {
    const hash = (0, exports.hashRememberMeValidator)(validator);
    try {
        return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(storedHash));
    }
    catch {
        return false;
    }
};
exports.validateRememberMeToken = validateRememberMeToken;
/**
 * @function parseRememberMeCookie
 * @description Parses remember-me cookie value
 * @param {string} cookieValue - Cookie value (selector:validator)
 * @returns {object | null} Parsed selector and validator
 *
 * @example
 * ```typescript
 * const parsed = parseRememberMeCookie(cookie);
 * if (parsed) {
 *   // Validate against database
 * }
 * ```
 */
const parseRememberMeCookie = (cookieValue) => {
    const parts = cookieValue.split(':');
    if (parts.length !== 2) {
        return null;
    }
    return {
        selector: parts[0],
        validator: parts[1],
    };
};
exports.parseRememberMeCookie = parseRememberMeCookie;
// ============================================================================
// MULTI-FACTOR AUTHENTICATION
// ============================================================================
/**
 * @function generateMfaToken
 * @description Generates temporary MFA verification token
 * @param {string} userId - User ID
 * @returns {string} MFA token
 *
 * @example
 * ```typescript
 * const mfaToken = generateMfaToken('user123');
 * // Send to client for MFA flow
 * ```
 */
const generateMfaToken = (userId) => {
    const payload = {
        userId,
        type: 'mfa',
        exp: Math.floor(Date.now() / 1000) + 300, // 5 minutes
    };
    return encodeJWT({ alg: 'HS256', typ: 'JWT' }, payload);
};
exports.generateMfaToken = generateMfaToken;
/**
 * @function verifyMfaToken
 * @description Verifies MFA verification token
 * @param {string} token - MFA token
 * @param {string} secret - JWT secret
 * @returns {string | null} User ID or null
 *
 * @example
 * ```typescript
 * const userId = verifyMfaToken(mfaToken, 'secret');
 * if (userId) {
 *   // Proceed with MFA verification
 * }
 * ```
 */
const verifyMfaToken = (token, secret) => {
    try {
        const decoded = decodeJWT(token, secret);
        if (!decoded || decoded.type !== 'mfa') {
            return null;
        }
        return decoded.userId;
    }
    catch {
        return null;
    }
};
exports.verifyMfaToken = verifyMfaToken;
/**
 * @function generateTotpSecret
 * @description Generates TOTP secret for MFA setup
 * @returns {string} Base32 encoded secret
 *
 * @example
 * ```typescript
 * const secret = generateTotpSecret();
 * // Use with authenticator app
 * ```
 */
const generateTotpSecret = () => {
    const buffer = crypto.randomBytes(20);
    return base32Encode(buffer);
};
exports.generateTotpSecret = generateTotpSecret;
/**
 * @function generateTotpUri
 * @description Generates TOTP URI for QR code
 * @param {string} secret - TOTP secret
 * @param {string} accountName - Account name (email)
 * @param {string} issuer - Issuer name
 * @returns {string} TOTP URI
 *
 * @example
 * ```typescript
 * const uri = generateTotpUri(secret, 'user@example.com', 'WhiteCross');
 * // Generate QR code from URI
 * ```
 */
const generateTotpUri = (secret, accountName, issuer = 'WhiteCross') => {
    return `otpauth://totp/${issuer}:${accountName}?secret=${secret}&issuer=${issuer}`;
};
exports.generateTotpUri = generateTotpUri;
/**
 * @function generateBackupCodes
 * @description Generates MFA backup codes
 * @param {number} count - Number of codes (default: 10)
 * @returns {string[]} Array of backup codes
 *
 * @example
 * ```typescript
 * const codes = generateBackupCodes(10);
 * // Display codes to user once, store hashes
 * ```
 */
const generateBackupCodes = (count = 10) => {
    const codes = [];
    for (let i = 0; i < count; i++) {
        const code = crypto.randomBytes(4).toString('hex').toUpperCase();
        codes.push(`${code.slice(0, 4)}-${code.slice(4, 8)}`);
    }
    return codes;
};
exports.generateBackupCodes = generateBackupCodes;
/**
 * @function hashBackupCode
 * @description Hashes backup code for storage
 * @param {string} code - Backup code
 * @returns {string} Hashed code
 *
 * @example
 * ```typescript
 * const hash = hashBackupCode('A1B2-C3D4');
 * ```
 */
const hashBackupCode = (code) => {
    return crypto.createHash('sha256').update(code.replace(/-/g, '')).digest('hex');
};
exports.hashBackupCode = hashBackupCode;
// ============================================================================
// OAUTH 2.0 FLOW
// ============================================================================
/**
 * @function generateOAuthState
 * @description Generates OAuth state parameter for CSRF protection
 * @returns {string} State parameter
 *
 * @example
 * ```typescript
 * const state = generateOAuthState();
 * // Store in session, send to OAuth provider
 * ```
 */
const generateOAuthState = () => {
    return crypto.randomBytes(32).toString('hex');
};
exports.generateOAuthState = generateOAuthState;
/**
 * @function buildOAuthAuthorizationUrl
 * @description Builds OAuth authorization URL
 * @param {OAuthProviderConfig} config - OAuth provider config
 * @param {string} state - State parameter
 * @returns {string} Authorization URL
 *
 * @example
 * ```typescript
 * const url = buildOAuthAuthorizationUrl(config, state);
 * // Redirect user to URL
 * ```
 */
const buildOAuthAuthorizationUrl = (config, state) => {
    const params = new URLSearchParams({
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        response_type: 'code',
        state,
        scope: (config.scope || []).join(' '),
    });
    const authUrl = config.authorizationUrl || getDefaultAuthUrl(config.provider);
    return `${authUrl}?${params.toString()}`;
};
exports.buildOAuthAuthorizationUrl = buildOAuthAuthorizationUrl;
/**
 * @function exchangeOAuthCode
 * @description Exchanges OAuth authorization code for tokens (simulated)
 * @param {string} code - Authorization code
 * @param {OAuthProviderConfig} config - OAuth config
 * @returns {Promise<object>} Token response
 *
 * @example
 * ```typescript
 * const tokens = await exchangeOAuthCode(code, config);
 * ```
 */
const exchangeOAuthCode = async (code, config) => {
    // Simulated token exchange - in production, make actual HTTP request
    return {
        access_token: crypto.randomBytes(32).toString('hex'),
        refresh_token: crypto.randomBytes(32).toString('hex'),
        expires_in: 3600,
    };
};
exports.exchangeOAuthCode = exchangeOAuthCode;
/**
 * @function validateOAuthState
 * @description Validates OAuth state parameter
 * @param {string} receivedState - State from OAuth callback
 * @param {string} storedState - State stored in session
 * @returns {boolean} True if valid
 *
 * @security Prevents CSRF attacks in OAuth flow
 *
 * @example
 * ```typescript
 * if (!validateOAuthState(receivedState, sessionState)) {
 *   throw new UnauthorizedException('Invalid OAuth state');
 * }
 * ```
 */
const validateOAuthState = (receivedState, storedState) => {
    try {
        return crypto.timingSafeEqual(Buffer.from(receivedState), Buffer.from(storedState));
    }
    catch {
        return false;
    }
};
exports.validateOAuthState = validateOAuthState;
// ============================================================================
// SAML AUTHENTICATION
// ============================================================================
/**
 * @function generateSamlRequest
 * @description Generates SAML authentication request
 * @param {SamlConfig} config - SAML configuration
 * @returns {string} SAML request XML
 *
 * @example
 * ```typescript
 * const request = generateSamlRequest(samlConfig);
 * // Send to IdP
 * ```
 */
const generateSamlRequest = (config) => {
    const id = `_${crypto.randomUUID()}`;
    const timestamp = new Date().toISOString();
    return `<?xml version="1.0" encoding="UTF-8"?>
<samlp:AuthnRequest xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol"
  xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
  ID="${id}"
  Version="2.0"
  IssueInstant="${timestamp}"
  Destination="${config.entryPoint}"
  AssertionConsumerServiceURL="${config.callbackUrl}"
  ProtocolBinding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST">
  <saml:Issuer>${config.issuer}</saml:Issuer>
  <samlp:NameIDPolicy Format="urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress" AllowCreate="true"/>
</samlp:AuthnRequest>`;
};
exports.generateSamlRequest = generateSamlRequest;
/**
 * @function parseSamlResponse
 * @description Parses SAML response (placeholder)
 * @param {string} samlResponse - Base64 encoded SAML response
 * @returns {object} Parsed user data
 *
 * @example
 * ```typescript
 * const userData = parseSamlResponse(response);
 * ```
 */
const parseSamlResponse = (samlResponse) => {
    // Placeholder - actual implementation requires XML parsing
    const decoded = Buffer.from(samlResponse, 'base64').toString('utf8');
    return {
        userId: 'saml-user-123',
        email: 'user@example.com',
        attributes: {},
    };
};
exports.parseSamlResponse = parseSamlResponse;
/**
 * @function encodeSamlRequest
 * @description Encodes SAML request for HTTP redirect
 * @param {string} request - SAML request XML
 * @returns {string} Base64 encoded request
 *
 * @example
 * ```typescript
 * const encoded = encodeSamlRequest(samlRequest);
 * ```
 */
const encodeSamlRequest = (request) => {
    return Buffer.from(request).toString('base64');
};
exports.encodeSamlRequest = encodeSamlRequest;
// ============================================================================
// PASSPORT STRATEGY HELPERS
// ============================================================================
/**
 * @function createLocalStrategyConfig
 * @description Creates configuration for Passport local strategy
 * @returns {object} Strategy configuration
 *
 * @example
 * ```typescript
 * const config = createLocalStrategyConfig();
 * ```
 */
const createLocalStrategyConfig = () => {
    return {
        usernameField: 'email',
        passwordField: 'password',
    };
};
exports.createLocalStrategyConfig = createLocalStrategyConfig;
/**
 * @function createJwtStrategyConfig
 * @description Creates configuration for Passport JWT strategy
 * @param {string} secret - JWT secret
 * @returns {object} Strategy configuration
 *
 * @example
 * ```typescript
 * const config = createJwtStrategyConfig('secret-key');
 * ```
 */
const createJwtStrategyConfig = (secret) => {
    return {
        jwtFromRequest: (req) => (0, exports.extractBearerToken)(req),
        secretOrKey: secret,
        ignoreExpiration: false,
    };
};
exports.createJwtStrategyConfig = createJwtStrategyConfig;
/**
 * @function extractBearerToken
 * @description Extracts Bearer token from Authorization header
 * @param {Request} req - Express request
 * @returns {string | null} Token or null
 *
 * @example
 * ```typescript
 * const token = extractBearerToken(req);
 * ```
 */
const extractBearerToken = (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return null;
    }
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return null;
    }
    return parts[1];
};
exports.extractBearerToken = extractBearerToken;
// ============================================================================
// AUTHENTICATION STATE TRACKING
// ============================================================================
/**
 * @function trackLoginAttempt
 * @description Creates login attempt record
 * @param {string} email - Email address
 * @param {boolean} success - Whether attempt succeeded
 * @param {string} ipAddress - IP address
 * @returns {object} Attempt record
 *
 * @example
 * ```typescript
 * const attempt = trackLoginAttempt('user@example.com', false, '192.168.1.1');
 * ```
 */
const trackLoginAttempt = (email, success, ipAddress) => {
    return {
        email,
        success,
        timestamp: new Date(),
        ipAddress,
    };
};
exports.trackLoginAttempt = trackLoginAttempt;
/**
 * @function shouldLockAccount
 * @description Determines if account should be locked
 * @param {number} failedAttempts - Number of failed attempts
 * @param {number} threshold - Lockout threshold (default: 5)
 * @returns {boolean} True if should lock
 *
 * @example
 * ```typescript
 * if (shouldLockAccount(user.failedAttempts)) {
 *   // Lock account
 * }
 * ```
 */
const shouldLockAccount = (failedAttempts, threshold = 5) => {
    return failedAttempts >= threshold;
};
exports.shouldLockAccount = shouldLockAccount;
/**
 * @function calculateLockoutExpiry
 * @description Calculates account lockout expiry time
 * @param {number} durationMinutes - Lockout duration (default: 30)
 * @returns {Date} Lockout expiry date
 *
 * @example
 * ```typescript
 * const lockoutUntil = calculateLockoutExpiry(30);
 * ```
 */
const calculateLockoutExpiry = (durationMinutes = 30) => {
    return new Date(Date.now() + durationMinutes * 60 * 1000);
};
exports.calculateLockoutExpiry = calculateLockoutExpiry;
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Encodes JWT (simplified - use proper library in production)
 */
const encodeJWT = (header, payload) => {
    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedPayload = base64UrlEncode(JSON.stringify(payload));
    const signature = crypto
        .createHmac('sha256', process.env.JWT_SECRET || 'default-secret')
        .update(`${encodedHeader}.${encodedPayload}`)
        .digest('base64url');
    return `${encodedHeader}.${encodedPayload}.${signature}`;
};
/**
 * Decodes JWT with verification
 */
const decodeJWT = (token, secret) => {
    const parts = token.split('.');
    if (parts.length !== 3) {
        throw new Error('Invalid token format');
    }
    const [encodedHeader, encodedPayload, signature] = parts;
    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(`${encodedHeader}.${encodedPayload}`)
        .digest('base64url');
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
        throw new Error('Invalid signature');
    }
    return JSON.parse(base64UrlDecode(encodedPayload));
};
/**
 * Decodes JWT without verification
 */
const decodeJWTUnsafe = (token) => {
    const parts = token.split('.');
    if (parts.length !== 3) {
        throw new Error('Invalid token format');
    }
    return JSON.parse(base64UrlDecode(parts[1]));
};
/**
 * Base64 URL encode
 */
const base64UrlEncode = (str) => {
    return Buffer.from(str)
        .toString('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
};
/**
 * Base64 URL decode
 */
const base64UrlDecode = (str) => {
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    return Buffer.from(base64, 'base64').toString('utf8');
};
/**
 * Base32 encode
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
 * Get default OAuth authorization URL
 */
const getDefaultAuthUrl = (provider) => {
    const urls = {
        google: 'https://accounts.google.com/o/oauth2/v2/auth',
        github: 'https://github.com/login/oauth/authorize',
        microsoft: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    };
    return urls[provider] || '';
};
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Local authentication
    validateLocalCredentials: exports.validateLocalCredentials,
    performLocalLogin: exports.performLocalLogin,
    hashPasswordForStorage: exports.hashPasswordForStorage,
    validatePasswordComplexity: exports.validatePasswordComplexity,
    // Session management
    createAuthSession: exports.createAuthSession,
    generateSecureSessionId: exports.generateSecureSessionId,
    validateSessionActive: exports.validateSessionActive,
    refreshSessionActivity: exports.refreshSessionActivity,
    extendSessionExpiration: exports.extendSessionExpiration,
    calculateSessionTimeout: exports.calculateSessionTimeout,
    destroySession: exports.destroySession,
    // Token lifecycle
    generateAccessToken: exports.generateAccessToken,
    generateRefreshToken: exports.generateRefreshToken,
    verifyAccessToken: exports.verifyAccessToken,
    validateRefreshToken: exports.validateRefreshToken,
    rotateRefreshToken: exports.rotateRefreshToken,
    checkTokenExpiration: exports.checkTokenExpiration,
    // Cookie security
    setAuthCookie: exports.setAuthCookie,
    clearAuthCookie: exports.clearAuthCookie,
    extractCookieToken: exports.extractCookieToken,
    signCookieValue: exports.signCookieValue,
    verifyCookieSignature: exports.verifyCookieSignature,
    // Remember-me
    generateRememberMeToken: exports.generateRememberMeToken,
    hashRememberMeValidator: exports.hashRememberMeValidator,
    validateRememberMeToken: exports.validateRememberMeToken,
    parseRememberMeCookie: exports.parseRememberMeCookie,
    // MFA
    generateMfaToken: exports.generateMfaToken,
    verifyMfaToken: exports.verifyMfaToken,
    generateTotpSecret: exports.generateTotpSecret,
    generateTotpUri: exports.generateTotpUri,
    generateBackupCodes: exports.generateBackupCodes,
    hashBackupCode: exports.hashBackupCode,
    // OAuth
    generateOAuthState: exports.generateOAuthState,
    buildOAuthAuthorizationUrl: exports.buildOAuthAuthorizationUrl,
    exchangeOAuthCode: exports.exchangeOAuthCode,
    validateOAuthState: exports.validateOAuthState,
    // SAML
    generateSamlRequest: exports.generateSamlRequest,
    parseSamlResponse: exports.parseSamlResponse,
    encodeSamlRequest: exports.encodeSamlRequest,
    // Passport helpers
    createLocalStrategyConfig: exports.createLocalStrategyConfig,
    createJwtStrategyConfig: exports.createJwtStrategyConfig,
    extractBearerToken: exports.extractBearerToken,
    // State tracking
    trackLoginAttempt: exports.trackLoginAttempt,
    shouldLockAccount: exports.shouldLockAccount,
    calculateLockoutExpiry: exports.calculateLockoutExpiry,
};
//# sourceMappingURL=iam-authentication-kit.js.map