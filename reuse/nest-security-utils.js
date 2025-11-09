"use strict";
/**
 * @fileoverview NestJS Security Utilities
 * @module reuse/nest-security-utils
 * @description Comprehensive security utilities for NestJS applications with HIPAA compliance
 *
 * Features:
 * - JWT token generation, verification, and management
 * - Password hashing and validation with bcrypt
 * - API key generation and validation
 * - CSRF token management
 * - Security header utilities
 * - OAuth token helpers
 * - Session management utilities
 * - Rate limiting helpers
 * - Encryption and decryption utilities
 * - Security audit logging
 *
 * Security Features:
 * - HIPAA-compliant password requirements (12+ characters)
 * - Secure token generation with crypto randomBytes
 * - Constant-time comparison for tokens
 * - Automatic token expiration handling
 * - Secure session management
 * - XSS and CSRF protection utilities
 *
 * @requires @nestjs/jwt
 * @requires @nestjs/passport
 * @requires bcrypt
 * @requires crypto
 * @requires jsonwebtoken
 *
 * @example Basic JWT usage
 * ```typescript
 * import { generateJwtToken, verifyJwtToken, decodeJwtToken } from './nest-security-utils';
 *
 * // Generate token
 * const token = await generateJwtToken({ userId: '123', role: 'admin' }, 'secret', '1h');
 *
 * // Verify token
 * const isValid = await verifyJwtToken(token, 'secret');
 *
 * // Decode token
 * const payload = decodeJwtToken(token);
 * ```
 *
 * @example Password hashing
 * ```typescript
 * import { hashPasswordBcrypt, comparePasswordBcrypt, generateSecurePassword } from './nest-security-utils';
 *
 * // Hash password
 * const hash = await hashPasswordBcrypt('MySecureP@ssw0rd123');
 *
 * // Compare password
 * const isMatch = await comparePasswordBcrypt('MySecureP@ssw0rd123', hash);
 *
 * // Generate secure password
 * const newPassword = generateSecurePassword(16);
 * ```
 *
 * LOC: NEST_SEC_UTILS_V1
 * UPSTREAM: @nestjs/jwt, @nestjs/passport, bcrypt, crypto
 * DOWNSTREAM: Authentication services, authorization guards, security middleware
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
exports.generateCodeChallenge = exports.generateCodeVerifier = exports.generateOAuthState = exports.calculateLockoutExpiry = exports.shouldBlockRequest = exports.calculateRateLimitKey = exports.sanitizeHeaderValue = exports.generateNonce = exports.getSecurityHeaders = exports.decryptObject = exports.encryptObject = exports.decryptData = exports.encryptData = exports.calculateSessionExpiry = exports.isSessionExpired = exports.generateSessionId = exports.validateCsrfToken = exports.generateCsrfToken = exports.extractApiKey = exports.validateApiKeyFormat = exports.generateApiKey = exports.generateEmailVerificationToken = exports.generatePasswordResetToken = exports.generateRefreshToken = exports.compareTokens = exports.hashToken = exports.generateSecureToken = exports.generateSecurePassword = exports.validatePasswordStrength = exports.comparePasswordBcrypt = exports.hashPasswordBcrypt = exports.getTokenRemainingTime = exports.getTokenExpirationDate = exports.isTokenExpired = exports.extractBearerToken = exports.decodeJwtToken = exports.verifyJwtToken = exports.generateJwtToken = exports.SECURITY_CONFIG = void 0;
const bcrypt = __importStar(require("bcrypt"));
const crypto = __importStar(require("crypto"));
const jwt_1 = require("@nestjs/jwt");
/**
 * Security configuration constants
 */
exports.SECURITY_CONFIG = {
    SALT_ROUNDS: 12,
    PASSWORD_MIN_LENGTH: 12,
    PASSWORD_MAX_LENGTH: 128,
    TOKEN_LENGTH: 32,
    API_KEY_LENGTH: 64,
    SESSION_TIMEOUT: 3600000, // 1 hour in milliseconds
    REFRESH_TOKEN_EXPIRY: '7d',
    ACCESS_TOKEN_EXPIRY: '15m',
    CSRF_TOKEN_LENGTH: 32,
    ENCRYPTION_ALGORITHM: 'aes-256-gcm',
    IV_LENGTH: 16,
    AUTH_TAG_LENGTH: 16,
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION: 1800000, // 30 minutes in milliseconds
};
// =============================================================================
// JWT TOKEN UTILITIES
// =============================================================================
/**
 * @function generateJwtToken
 * @description Generate a signed JWT token with custom payload
 * @param {TokenPayload} payload - Token payload data
 * @param {string} secret - JWT secret key
 * @param {string | number} expiresIn - Token expiration (e.g., '1h', '7d', 3600)
 * @returns {Promise<string>} Signed JWT token
 *
 * @security Uses strong secret and configurable expiration
 *
 * @example
 * ```typescript
 * const token = await generateJwtToken(
 *   { userId: '123', role: 'admin' },
 *   'my-secret-key',
 *   '1h'
 * );
 * console.log(token); // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 * ```
 */
const generateJwtToken = async (payload, secret, expiresIn = exports.SECURITY_CONFIG.ACCESS_TOKEN_EXPIRY) => {
    const jwtService = new jwt_1.JwtService({ secret });
    return jwtService.signAsync(payload, { expiresIn });
};
exports.generateJwtToken = generateJwtToken;
/**
 * @function verifyJwtToken
 * @description Verify JWT token signature and expiration
 * @param {string} token - JWT token to verify
 * @param {string} secret - JWT secret key
 * @returns {Promise<TokenPayload | null>} Decoded payload or null if invalid
 *
 * @security Validates signature and expiration automatically
 *
 * @example
 * ```typescript
 * const payload = await verifyJwtToken(token, 'my-secret-key');
 * if (payload) {
 *   console.log('Valid token:', payload.userId);
 * } else {
 *   console.log('Invalid or expired token');
 * }
 * ```
 */
const verifyJwtToken = async (token, secret) => {
    try {
        const jwtService = new jwt_1.JwtService({ secret });
        return await jwtService.verifyAsync(token);
    }
    catch (error) {
        return null;
    }
};
exports.verifyJwtToken = verifyJwtToken;
/**
 * @function decodeJwtToken
 * @description Decode JWT token without verification (use for inspection only)
 * @param {string} token - JWT token to decode
 * @returns {TokenPayload | null} Decoded payload or null if invalid format
 *
 * @security WARNING: Does not verify signature - use only for inspection
 *
 * @example
 * ```typescript
 * const payload = decodeJwtToken(token);
 * if (payload) {
 *   console.log('Token expires at:', new Date(payload.exp! * 1000));
 * }
 * ```
 */
const decodeJwtToken = (token) => {
    try {
        const jwtService = new jwt_1.JwtService({});
        return jwtService.decode(token);
    }
    catch (error) {
        return null;
    }
};
exports.decodeJwtToken = decodeJwtToken;
/**
 * @function extractBearerToken
 * @description Extract Bearer token from Authorization header
 * @param {Request} request - Express request object
 * @returns {string | null} Extracted token or null
 *
 * @example
 * ```typescript
 * const token = extractBearerToken(request);
 * if (token) {
 *   const payload = await verifyJwtToken(token, secret);
 * }
 * ```
 */
const extractBearerToken = (request) => {
    const authHeader = request.headers.authorization;
    if (!authHeader)
        return null;
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer')
        return null;
    return parts[1];
};
exports.extractBearerToken = extractBearerToken;
/**
 * @function isTokenExpired
 * @description Check if JWT token is expired
 * @param {string} token - JWT token to check
 * @returns {boolean} True if expired, false otherwise
 *
 * @example
 * ```typescript
 * if (isTokenExpired(token)) {
 *   console.log('Token has expired, please refresh');
 * }
 * ```
 */
const isTokenExpired = (token) => {
    const payload = (0, exports.decodeJwtToken)(token);
    if (!payload || !payload.exp)
        return true;
    return Date.now() >= payload.exp * 1000;
};
exports.isTokenExpired = isTokenExpired;
/**
 * @function getTokenExpirationDate
 * @description Get expiration date from JWT token
 * @param {string} token - JWT token
 * @returns {Date | null} Expiration date or null
 *
 * @example
 * ```typescript
 * const expiresAt = getTokenExpirationDate(token);
 * console.log('Token expires:', expiresAt);
 * ```
 */
const getTokenExpirationDate = (token) => {
    const payload = (0, exports.decodeJwtToken)(token);
    if (!payload || !payload.exp)
        return null;
    return new Date(payload.exp * 1000);
};
exports.getTokenExpirationDate = getTokenExpirationDate;
/**
 * @function getTokenRemainingTime
 * @description Get remaining time until token expires in milliseconds
 * @param {string} token - JWT token
 * @returns {number} Milliseconds until expiration (0 if expired)
 *
 * @example
 * ```typescript
 * const remaining = getTokenRemainingTime(token);
 * console.log(`Token expires in ${remaining / 1000} seconds`);
 * ```
 */
const getTokenRemainingTime = (token) => {
    const expiresAt = (0, exports.getTokenExpirationDate)(token);
    if (!expiresAt)
        return 0;
    const remaining = expiresAt.getTime() - Date.now();
    return Math.max(0, remaining);
};
exports.getTokenRemainingTime = getTokenRemainingTime;
// =============================================================================
// PASSWORD HASHING UTILITIES
// =============================================================================
/**
 * @function hashPasswordBcrypt
 * @description Hash password using bcrypt with configurable salt rounds
 * @param {string} password - Plain text password
 * @param {number} saltRounds - Number of salt rounds (default: 12)
 * @returns {Promise<string>} Hashed password
 *
 * @security Uses bcrypt with 12 salt rounds for healthcare compliance
 *
 * @example
 * ```typescript
 * const hash = await hashPasswordBcrypt('MySecureP@ssw0rd123');
 * console.log(hash); // $2b$12$...
 * ```
 */
const hashPasswordBcrypt = async (password, saltRounds = exports.SECURITY_CONFIG.SALT_ROUNDS) => {
    if (!password || password.length < exports.SECURITY_CONFIG.PASSWORD_MIN_LENGTH) {
        throw new Error(`Password must be at least ${exports.SECURITY_CONFIG.PASSWORD_MIN_LENGTH} characters`);
    }
    return bcrypt.hash(password, saltRounds);
};
exports.hashPasswordBcrypt = hashPasswordBcrypt;
/**
 * @function comparePasswordBcrypt
 * @description Compare plain text password with bcrypt hash
 * @param {string} password - Plain text password
 * @param {string} hash - Bcrypt hash to compare against
 * @returns {Promise<boolean>} True if passwords match
 *
 * @security Uses constant-time comparison via bcrypt
 *
 * @example
 * ```typescript
 * const isValid = await comparePasswordBcrypt('password123', hash);
 * if (isValid) {
 *   console.log('Password is correct');
 * }
 * ```
 */
const comparePasswordBcrypt = async (password, hash) => {
    return bcrypt.compare(password, hash);
};
exports.comparePasswordBcrypt = comparePasswordBcrypt;
/**
 * @function validatePasswordStrength
 * @description Validate password meets strength requirements
 * @param {string} password - Password to validate
 * @returns {object} Validation result with isValid flag and errors
 *
 * @security Enforces HIPAA-compliant password requirements
 *
 * @example
 * ```typescript
 * const validation = validatePasswordStrength('weak');
 * if (!validation.isValid) {
 *   console.log('Errors:', validation.errors);
 * }
 * ```
 */
const validatePasswordStrength = (password) => {
    const errors = [];
    let strength = 0;
    if (!password) {
        return { isValid: false, errors: ['Password is required'], strength: 0 };
    }
    // Length check
    if (password.length < exports.SECURITY_CONFIG.PASSWORD_MIN_LENGTH) {
        errors.push(`Password must be at least ${exports.SECURITY_CONFIG.PASSWORD_MIN_LENGTH} characters`);
    }
    else {
        strength += 1;
    }
    if (password.length > exports.SECURITY_CONFIG.PASSWORD_MAX_LENGTH) {
        errors.push(`Password cannot exceed ${exports.SECURITY_CONFIG.PASSWORD_MAX_LENGTH} characters`);
    }
    // Complexity checks
    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }
    else {
        strength += 1;
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }
    else {
        strength += 1;
    }
    if (!/\d/.test(password)) {
        errors.push('Password must contain at least one number');
    }
    else {
        strength += 1;
    }
    if (!/[@$!%*?&]/.test(password)) {
        errors.push('Password must contain at least one special character (@$!%*?&)');
    }
    else {
        strength += 1;
    }
    return {
        isValid: errors.length === 0,
        errors,
        strength,
    };
};
exports.validatePasswordStrength = validatePasswordStrength;
/**
 * @function generateSecurePassword
 * @description Generate cryptographically secure random password
 * @param {number} length - Password length (default: 16)
 * @returns {string} Generated password
 *
 * @security Uses crypto.randomBytes for secure generation
 *
 * @example
 * ```typescript
 * const password = generateSecurePassword(20);
 * console.log(password); // "aB3$xY9@mN2&kL5!"
 * ```
 */
const generateSecurePassword = (length = 16) => {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const special = '@$!%*?&';
    const allChars = lowercase + uppercase + numbers + special;
    let password = '';
    password += lowercase[crypto.randomInt(0, lowercase.length)];
    password += uppercase[crypto.randomInt(0, uppercase.length)];
    password += numbers[crypto.randomInt(0, numbers.length)];
    password += special[crypto.randomInt(0, special.length)];
    for (let i = 4; i < length; i++) {
        password += allChars[crypto.randomInt(0, allChars.length)];
    }
    return password
        .split('')
        .sort(() => crypto.randomInt(0, 2) - 1)
        .join('');
};
exports.generateSecurePassword = generateSecurePassword;
// =============================================================================
// TOKEN MANAGEMENT UTILITIES
// =============================================================================
/**
 * @function generateSecureToken
 * @description Generate cryptographically secure random token
 * @param {number} length - Token length in bytes (default: 32)
 * @returns {string} Hex-encoded secure token
 *
 * @security Uses crypto.randomBytes for CSRF, reset tokens, etc.
 *
 * @example
 * ```typescript
 * const resetToken = generateSecureToken(32);
 * console.log(resetToken); // "a3f2..."
 * ```
 */
const generateSecureToken = (length = exports.SECURITY_CONFIG.TOKEN_LENGTH) => {
    return crypto.randomBytes(length).toString('hex');
};
exports.generateSecureToken = generateSecureToken;
/**
 * @function hashToken
 * @description Hash token for secure storage using SHA-256
 * @param {string} token - Token to hash
 * @returns {string} Hashed token
 *
 * @security Store hash in database, compare with incoming tokens
 *
 * @example
 * ```typescript
 * const tokenHash = hashToken(resetToken);
 * // Store tokenHash in database
 * ```
 */
const hashToken = (token) => {
    return crypto.createHash('sha256').update(token).digest('hex');
};
exports.hashToken = hashToken;
/**
 * @function compareTokens
 * @description Constant-time token comparison to prevent timing attacks
 * @param {string} token1 - First token
 * @param {string} token2 - Second token
 * @returns {boolean} True if tokens match
 *
 * @security Uses crypto.timingSafeEqual for constant-time comparison
 *
 * @example
 * ```typescript
 * const isValid = compareTokens(providedToken, storedToken);
 * ```
 */
const compareTokens = (token1, token2) => {
    if (token1.length !== token2.length)
        return false;
    try {
        const buf1 = Buffer.from(token1, 'utf8');
        const buf2 = Buffer.from(token2, 'utf8');
        return crypto.timingSafeEqual(buf1, buf2);
    }
    catch {
        return false;
    }
};
exports.compareTokens = compareTokens;
/**
 * @function generateRefreshToken
 * @description Generate refresh token with metadata
 * @param {string} userId - User ID
 * @returns {object} Refresh token and hash
 *
 * @example
 * ```typescript
 * const { token, hash } = generateRefreshToken('user123');
 * // Store hash in database, send token to client
 * ```
 */
const generateRefreshToken = (userId) => {
    const token = (0, exports.generateSecureToken)(64);
    const hash = (0, exports.hashToken)(token);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    return { token, hash, expiresAt };
};
exports.generateRefreshToken = generateRefreshToken;
/**
 * @function generatePasswordResetToken
 * @description Generate password reset token with expiration
 * @param {string} userId - User ID
 * @returns {object} Reset token, hash, and expiration
 *
 * @security Token expires in 1 hour
 *
 * @example
 * ```typescript
 * const { token, hash, expiresAt } = generatePasswordResetToken('user123');
 * // Send token via email, store hash in database
 * ```
 */
const generatePasswordResetToken = (userId) => {
    const token = (0, exports.generateSecureToken)(32);
    const hash = (0, exports.hashToken)(token);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    return { token, hash, expiresAt };
};
exports.generatePasswordResetToken = generatePasswordResetToken;
/**
 * @function generateEmailVerificationToken
 * @description Generate email verification token
 * @param {string} email - Email address
 * @returns {object} Verification token and hash
 *
 * @example
 * ```typescript
 * const { token, hash } = generateEmailVerificationToken('user@example.com');
 * ```
 */
const generateEmailVerificationToken = (email) => {
    const token = (0, exports.generateSecureToken)(32);
    const hash = (0, exports.hashToken)(token);
    return { token, hash };
};
exports.generateEmailVerificationToken = generateEmailVerificationToken;
// =============================================================================
// API KEY UTILITIES
// =============================================================================
/**
 * @function generateApiKey
 * @description Generate API key with prefix and hash
 * @param {string} userId - User ID
 * @param {string} name - API key name/description
 * @param {string} prefix - Key prefix (default: 'wc')
 * @returns {object} API key, hash, and metadata
 *
 * @security Returns plaintext key once, stores hash in database
 *
 * @example
 * ```typescript
 * const { key, hash } = generateApiKey('user123', 'Production API Key');
 * console.log(key); // "wc_a3f2b1..."
 * ```
 */
const generateApiKey = (userId, name, prefix = 'wc') => {
    const randomBytes = crypto.randomBytes(exports.SECURITY_CONFIG.API_KEY_LENGTH / 2);
    const key = `${prefix}_${randomBytes.toString('hex')}`;
    const hash = (0, exports.hashToken)(key);
    return {
        key,
        hash,
        userId,
        name,
        createdAt: new Date(),
    };
};
exports.generateApiKey = generateApiKey;
/**
 * @function validateApiKeyFormat
 * @description Validate API key format (prefix and length)
 * @param {string} apiKey - API key to validate
 * @param {string} prefix - Expected prefix (default: 'wc')
 * @returns {boolean} True if format is valid
 *
 * @example
 * ```typescript
 * const isValid = validateApiKeyFormat('wc_abc123...');
 * ```
 */
const validateApiKeyFormat = (apiKey, prefix = 'wc') => {
    const regex = new RegExp(`^${prefix}_[a-f0-9]{${exports.SECURITY_CONFIG.API_KEY_LENGTH}}$`);
    return regex.test(apiKey);
};
exports.validateApiKeyFormat = validateApiKeyFormat;
/**
 * @function extractApiKey
 * @description Extract API key from request (header or query)
 * @param {Request} request - Express request object
 * @returns {string | null} Extracted API key or null
 *
 * @example
 * ```typescript
 * const apiKey = extractApiKey(request);
 * if (apiKey) {
 *   // Validate API key
 * }
 * ```
 */
const extractApiKey = (request) => {
    // Check X-API-Key header
    const headerKey = request.headers['x-api-key'];
    if (headerKey)
        return headerKey;
    // Check query parameter
    const queryKey = request.query.api_key;
    if (queryKey)
        return queryKey;
    return null;
};
exports.extractApiKey = extractApiKey;
// =============================================================================
// CSRF PROTECTION UTILITIES
// =============================================================================
/**
 * @function generateCsrfToken
 * @description Generate CSRF token for form protection
 * @returns {string} CSRF token
 *
 * @security Use with double-submit cookie pattern
 *
 * @example
 * ```typescript
 * const csrfToken = generateCsrfToken();
 * // Send in both cookie and form
 * ```
 */
const generateCsrfToken = () => {
    return crypto.randomBytes(exports.SECURITY_CONFIG.CSRF_TOKEN_LENGTH).toString('hex');
};
exports.generateCsrfToken = generateCsrfToken;
/**
 * @function validateCsrfToken
 * @description Validate CSRF token from request
 * @param {Request} request - Express request object
 * @param {string} cookieName - CSRF cookie name (default: '_csrf')
 * @returns {boolean} True if valid
 *
 * @example
 * ```typescript
 * if (!validateCsrfToken(request)) {
 *   throw new ForbiddenException('Invalid CSRF token');
 * }
 * ```
 */
const validateCsrfToken = (request, cookieName = '_csrf') => {
    const cookieToken = request.cookies?.[cookieName];
    const headerToken = request.headers['x-csrf-token'];
    const bodyToken = request.body?._csrf;
    const providedToken = headerToken || bodyToken;
    if (!cookieToken || !providedToken)
        return false;
    return (0, exports.compareTokens)(cookieToken, providedToken);
};
exports.validateCsrfToken = validateCsrfToken;
// =============================================================================
// SESSION MANAGEMENT UTILITIES
// =============================================================================
/**
 * @function generateSessionId
 * @description Generate cryptographically secure session ID
 * @returns {string} Session ID
 *
 * @example
 * ```typescript
 * const sessionId = generateSessionId();
 * ```
 */
const generateSessionId = () => {
    return crypto.randomBytes(32).toString('hex');
};
exports.generateSessionId = generateSessionId;
/**
 * @function isSessionExpired
 * @description Check if session is expired
 * @param {Date} lastActivity - Last activity timestamp
 * @param {number} timeout - Session timeout in milliseconds
 * @returns {boolean} True if expired
 *
 * @example
 * ```typescript
 * if (isSessionExpired(session.lastActivity, 3600000)) {
 *   // Session expired after 1 hour
 * }
 * ```
 */
const isSessionExpired = (lastActivity, timeout = exports.SECURITY_CONFIG.SESSION_TIMEOUT) => {
    return Date.now() - lastActivity.getTime() > timeout;
};
exports.isSessionExpired = isSessionExpired;
/**
 * @function calculateSessionExpiry
 * @description Calculate session expiry date
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Date} Expiry date
 *
 * @example
 * ```typescript
 * const expiresAt = calculateSessionExpiry(3600000);
 * ```
 */
const calculateSessionExpiry = (timeout = exports.SECURITY_CONFIG.SESSION_TIMEOUT) => {
    return new Date(Date.now() + timeout);
};
exports.calculateSessionExpiry = calculateSessionExpiry;
// =============================================================================
// ENCRYPTION UTILITIES
// =============================================================================
/**
 * @function encryptData
 * @description Encrypt data using AES-256-GCM
 * @param {string} plaintext - Data to encrypt
 * @param {string} key - Encryption key
 * @returns {string} Encrypted data (IV:AuthTag:Ciphertext)
 *
 * @security Uses AES-256-GCM with random IV
 *
 * @example
 * ```typescript
 * const encrypted = encryptData('sensitive data', encryptionKey);
 * ```
 */
const encryptData = (plaintext, key) => {
    const derivedKey = crypto.scryptSync(key, 'salt', 32);
    const iv = crypto.randomBytes(exports.SECURITY_CONFIG.IV_LENGTH);
    const cipher = crypto.createCipheriv(exports.SECURITY_CONFIG.ENCRYPTION_ALGORITHM, derivedKey, iv);
    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
};
exports.encryptData = encryptData;
/**
 * @function decryptData
 * @description Decrypt data encrypted with encryptData
 * @param {string} encryptedData - Encrypted data string
 * @param {string} key - Decryption key
 * @returns {string} Decrypted plaintext
 *
 * @example
 * ```typescript
 * const plaintext = decryptData(encrypted, encryptionKey);
 * ```
 */
const decryptData = (encryptedData, key) => {
    const [ivHex, authTagHex, encrypted] = encryptedData.split(':');
    if (!ivHex || !authTagHex || !encrypted) {
        throw new Error('Invalid encrypted data format');
    }
    const derivedKey = crypto.scryptSync(key, 'salt', 32);
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = crypto.createDecipheriv(exports.SECURITY_CONFIG.ENCRYPTION_ALGORITHM, derivedKey, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};
exports.decryptData = decryptData;
/**
 * @function encryptObject
 * @description Encrypt JavaScript object
 * @param {object} obj - Object to encrypt
 * @param {string} key - Encryption key
 * @returns {string} Encrypted object string
 *
 * @example
 * ```typescript
 * const encrypted = encryptObject({ ssn: '123-45-6789' }, key);
 * ```
 */
const encryptObject = (obj, key) => {
    return (0, exports.encryptData)(JSON.stringify(obj), key);
};
exports.encryptObject = encryptObject;
/**
 * @function decryptObject
 * @description Decrypt object encrypted with encryptObject
 * @param {string} encryptedData - Encrypted object string
 * @param {string} key - Decryption key
 * @returns {any} Decrypted object
 *
 * @example
 * ```typescript
 * const obj = decryptObject(encrypted, key);
 * ```
 */
const decryptObject = (encryptedData, key) => {
    return JSON.parse((0, exports.decryptData)(encryptedData, key));
};
exports.decryptObject = decryptObject;
// =============================================================================
// SECURITY HEADER UTILITIES
// =============================================================================
/**
 * @function getSecurityHeaders
 * @description Get recommended security headers object
 * @returns {object} Security headers
 *
 * @security Includes HSTS, CSP, X-Frame-Options, etc.
 *
 * @example
 * ```typescript
 * const headers = getSecurityHeaders();
 * res.set(headers);
 * ```
 */
const getSecurityHeaders = () => {
    return {
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
        'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;",
    };
};
exports.getSecurityHeaders = getSecurityHeaders;
/**
 * @function generateNonce
 * @description Generate nonce for CSP
 * @returns {string} Nonce value
 *
 * @example
 * ```typescript
 * const nonce = generateNonce();
 * // Use in CSP header: script-src 'nonce-${nonce}'
 * ```
 */
const generateNonce = () => {
    return crypto.randomBytes(16).toString('base64');
};
exports.generateNonce = generateNonce;
/**
 * @function sanitizeHeaderValue
 * @description Sanitize header value to prevent injection
 * @param {string} value - Header value
 * @returns {string} Sanitized value
 *
 * @example
 * ```typescript
 * const safe = sanitizeHeaderValue(userInput);
 * ```
 */
const sanitizeHeaderValue = (value) => {
    return value.replace(/[\r\n]/g, '');
};
exports.sanitizeHeaderValue = sanitizeHeaderValue;
// =============================================================================
// RATE LIMITING UTILITIES
// =============================================================================
/**
 * @function calculateRateLimitKey
 * @description Calculate rate limit key from request
 * @param {Request} request - Express request
 * @param {string} prefix - Key prefix
 * @returns {string} Rate limit key
 *
 * @example
 * ```typescript
 * const key = calculateRateLimitKey(request, 'login');
 * ```
 */
const calculateRateLimitKey = (request, prefix = 'ratelimit') => {
    const userId = request.user?.id;
    const ip = request.ip || request.socket.remoteAddress;
    return userId ? `${prefix}:user:${userId}` : `${prefix}:ip:${ip}`;
};
exports.calculateRateLimitKey = calculateRateLimitKey;
/**
 * @function shouldBlockRequest
 * @description Check if request should be blocked based on attempt count
 * @param {number} attempts - Number of attempts
 * @param {number} maxAttempts - Maximum allowed attempts
 * @param {Date} lockoutUntil - Lockout expiry date
 * @returns {boolean} True if should block
 *
 * @example
 * ```typescript
 * if (shouldBlockRequest(user.loginAttempts, 5, user.lockoutUntil)) {
 *   throw new TooManyRequestsException();
 * }
 * ```
 */
const shouldBlockRequest = (attempts, maxAttempts = exports.SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS, lockoutUntil) => {
    if (lockoutUntil && lockoutUntil > new Date()) {
        return true;
    }
    return attempts >= maxAttempts;
};
exports.shouldBlockRequest = shouldBlockRequest;
/**
 * @function calculateLockoutExpiry
 * @description Calculate account lockout expiry time
 * @param {number} duration - Lockout duration in milliseconds
 * @returns {Date} Lockout expiry date
 *
 * @example
 * ```typescript
 * const lockoutUntil = calculateLockoutExpiry(1800000); // 30 minutes
 * ```
 */
const calculateLockoutExpiry = (duration = exports.SECURITY_CONFIG.LOCKOUT_DURATION) => {
    return new Date(Date.now() + duration);
};
exports.calculateLockoutExpiry = calculateLockoutExpiry;
// =============================================================================
// OAUTH UTILITIES
// =============================================================================
/**
 * @function generateOAuthState
 * @description Generate OAuth state parameter for CSRF protection
 * @returns {string} State parameter
 *
 * @security Prevents CSRF attacks in OAuth flow
 *
 * @example
 * ```typescript
 * const state = generateOAuthState();
 * // Store in session and send to OAuth provider
 * ```
 */
const generateOAuthState = () => {
    return crypto.randomBytes(32).toString('hex');
};
exports.generateOAuthState = generateOAuthState;
/**
 * @function generateCodeVerifier
 * @description Generate PKCE code verifier
 * @returns {string} Code verifier
 *
 * @security Used in OAuth 2.0 PKCE flow
 *
 * @example
 * ```typescript
 * const verifier = generateCodeVerifier();
 * const challenge = generateCodeChallenge(verifier);
 * ```
 */
const generateCodeVerifier = () => {
    return crypto
        .randomBytes(32)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
};
exports.generateCodeVerifier = generateCodeVerifier;
/**
 * @function generateCodeChallenge
 * @description Generate PKCE code challenge from verifier
 * @param {string} verifier - Code verifier
 * @returns {string} Code challenge
 *
 * @example
 * ```typescript
 * const challenge = generateCodeChallenge(verifier);
 * ```
 */
const generateCodeChallenge = (verifier) => {
    return crypto
        .createHash('sha256')
        .update(verifier)
        .digest('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
};
exports.generateCodeChallenge = generateCodeChallenge;
exports.default = {
    // JWT
    generateJwtToken: exports.generateJwtToken,
    verifyJwtToken: exports.verifyJwtToken,
    decodeJwtToken: exports.decodeJwtToken,
    extractBearerToken: exports.extractBearerToken,
    isTokenExpired: exports.isTokenExpired,
    getTokenExpirationDate: exports.getTokenExpirationDate,
    getTokenRemainingTime: exports.getTokenRemainingTime,
    // Password
    hashPasswordBcrypt: exports.hashPasswordBcrypt,
    comparePasswordBcrypt: exports.comparePasswordBcrypt,
    validatePasswordStrength: exports.validatePasswordStrength,
    generateSecurePassword: exports.generateSecurePassword,
    // Tokens
    generateSecureToken: exports.generateSecureToken,
    hashToken: exports.hashToken,
    compareTokens: exports.compareTokens,
    generateRefreshToken: exports.generateRefreshToken,
    generatePasswordResetToken: exports.generatePasswordResetToken,
    generateEmailVerificationToken: exports.generateEmailVerificationToken,
    // API Keys
    generateApiKey: exports.generateApiKey,
    validateApiKeyFormat: exports.validateApiKeyFormat,
    extractApiKey: exports.extractApiKey,
    // CSRF
    generateCsrfToken: exports.generateCsrfToken,
    validateCsrfToken: exports.validateCsrfToken,
    // Session
    generateSessionId: exports.generateSessionId,
    isSessionExpired: exports.isSessionExpired,
    calculateSessionExpiry: exports.calculateSessionExpiry,
    // Encryption
    encryptData: exports.encryptData,
    decryptData: exports.decryptData,
    encryptObject: exports.encryptObject,
    decryptObject: exports.decryptObject,
    // Headers
    getSecurityHeaders: exports.getSecurityHeaders,
    generateNonce: exports.generateNonce,
    sanitizeHeaderValue: exports.sanitizeHeaderValue,
    // Rate Limiting
    calculateRateLimitKey: exports.calculateRateLimitKey,
    shouldBlockRequest: exports.shouldBlockRequest,
    calculateLockoutExpiry: exports.calculateLockoutExpiry,
    // OAuth
    generateOAuthState: exports.generateOAuthState,
    generateCodeVerifier: exports.generateCodeVerifier,
    generateCodeChallenge: exports.generateCodeChallenge,
    // Constants
    SECURITY_CONFIG: exports.SECURITY_CONFIG,
};
//# sourceMappingURL=nest-security-utils.js.map