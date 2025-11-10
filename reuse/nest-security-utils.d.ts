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
import { Request } from 'express';
/**
 * Security configuration constants
 */
export declare const SECURITY_CONFIG: {
    readonly SALT_ROUNDS: 12;
    readonly PASSWORD_MIN_LENGTH: 12;
    readonly PASSWORD_MAX_LENGTH: 128;
    readonly TOKEN_LENGTH: 32;
    readonly API_KEY_LENGTH: 64;
    readonly SESSION_TIMEOUT: 3600000;
    readonly REFRESH_TOKEN_EXPIRY: "7d";
    readonly ACCESS_TOKEN_EXPIRY: "15m";
    readonly CSRF_TOKEN_LENGTH: 32;
    readonly ENCRYPTION_ALGORITHM: "aes-256-gcm";
    readonly IV_LENGTH: 16;
    readonly AUTH_TAG_LENGTH: 16;
    readonly MAX_LOGIN_ATTEMPTS: 5;
    readonly LOCKOUT_DURATION: 1800000;
};
/**
 * Token payload interface
 */
export interface TokenPayload {
    sub?: string;
    userId?: string;
    email?: string;
    role?: string;
    permissions?: string[];
    type?: 'access' | 'refresh' | 'reset' | 'verification';
    iat?: number;
    exp?: number;
    [key: string]: any;
}
/**
 * API key structure
 */
export interface ApiKey {
    key: string;
    hash: string;
    userId: string;
    name: string;
    createdAt: Date;
    expiresAt?: Date;
}
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
export declare const generateJwtToken: (payload: TokenPayload, secret: string, expiresIn?: string | number) => Promise<string>;
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
export declare const verifyJwtToken: (token: string, secret: string) => Promise<TokenPayload | null>;
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
export declare const decodeJwtToken: (token: string) => TokenPayload | null;
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
export declare const extractBearerToken: (request: Request) => string | null;
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
export declare const isTokenExpired: (token: string) => boolean;
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
export declare const getTokenExpirationDate: (token: string) => Date | null;
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
export declare const getTokenRemainingTime: (token: string) => number;
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
export declare const hashPasswordBcrypt: (password: string, saltRounds?: number) => Promise<string>;
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
export declare const comparePasswordBcrypt: (password: string, hash: string) => Promise<boolean>;
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
export declare const validatePasswordStrength: (password: string) => {
    isValid: boolean;
    errors: string[];
    strength: number;
};
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
export declare const generateSecurePassword: (length?: number) => string;
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
export declare const generateSecureToken: (length?: number) => string;
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
export declare const hashToken: (token: string) => string;
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
export declare const compareTokens: (token1: string, token2: string) => boolean;
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
export declare const generateRefreshToken: (userId: string) => {
    token: string;
    hash: string;
    expiresAt: Date;
};
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
export declare const generatePasswordResetToken: (userId: string) => {
    token: string;
    hash: string;
    expiresAt: Date;
};
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
export declare const generateEmailVerificationToken: (email: string) => {
    token: string;
    hash: string;
};
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
export declare const generateApiKey: (userId: string, name: string, prefix?: string) => ApiKey;
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
export declare const validateApiKeyFormat: (apiKey: string, prefix?: string) => boolean;
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
export declare const extractApiKey: (request: Request) => string | null;
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
export declare const generateCsrfToken: () => string;
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
export declare const validateCsrfToken: (request: Request, cookieName?: string) => boolean;
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
export declare const generateSessionId: () => string;
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
export declare const isSessionExpired: (lastActivity: Date, timeout?: number) => boolean;
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
export declare const calculateSessionExpiry: (timeout?: number) => Date;
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
export declare const encryptData: (plaintext: string, key: string) => string;
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
export declare const decryptData: (encryptedData: string, key: string) => string;
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
export declare const encryptObject: (obj: any, key: string) => string;
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
export declare const decryptObject: (encryptedData: string, key: string) => any;
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
export declare const getSecurityHeaders: () => Record<string, string>;
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
export declare const generateNonce: () => string;
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
export declare const sanitizeHeaderValue: (value: string) => string;
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
export declare const calculateRateLimitKey: (request: Request, prefix?: string) => string;
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
export declare const shouldBlockRequest: (attempts: number, maxAttempts?: number, lockoutUntil?: Date) => boolean;
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
export declare const calculateLockoutExpiry: (duration?: number) => Date;
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
export declare const generateOAuthState: () => string;
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
export declare const generateCodeVerifier: () => string;
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
export declare const generateCodeChallenge: (verifier: string) => string;
declare const _default: {
    generateJwtToken: (payload: TokenPayload, secret: string, expiresIn?: string | number) => Promise<string>;
    verifyJwtToken: (token: string, secret: string) => Promise<TokenPayload | null>;
    decodeJwtToken: (token: string) => TokenPayload | null;
    extractBearerToken: (request: Request) => string | null;
    isTokenExpired: (token: string) => boolean;
    getTokenExpirationDate: (token: string) => Date | null;
    getTokenRemainingTime: (token: string) => number;
    hashPasswordBcrypt: (password: string, saltRounds?: number) => Promise<string>;
    comparePasswordBcrypt: (password: string, hash: string) => Promise<boolean>;
    validatePasswordStrength: (password: string) => {
        isValid: boolean;
        errors: string[];
        strength: number;
    };
    generateSecurePassword: (length?: number) => string;
    generateSecureToken: (length?: number) => string;
    hashToken: (token: string) => string;
    compareTokens: (token1: string, token2: string) => boolean;
    generateRefreshToken: (userId: string) => {
        token: string;
        hash: string;
        expiresAt: Date;
    };
    generatePasswordResetToken: (userId: string) => {
        token: string;
        hash: string;
        expiresAt: Date;
    };
    generateEmailVerificationToken: (email: string) => {
        token: string;
        hash: string;
    };
    generateApiKey: (userId: string, name: string, prefix?: string) => ApiKey;
    validateApiKeyFormat: (apiKey: string, prefix?: string) => boolean;
    extractApiKey: (request: Request) => string | null;
    generateCsrfToken: () => string;
    validateCsrfToken: (request: Request, cookieName?: string) => boolean;
    generateSessionId: () => string;
    isSessionExpired: (lastActivity: Date, timeout?: number) => boolean;
    calculateSessionExpiry: (timeout?: number) => Date;
    encryptData: (plaintext: string, key: string) => string;
    decryptData: (encryptedData: string, key: string) => string;
    encryptObject: (obj: any, key: string) => string;
    decryptObject: (encryptedData: string, key: string) => any;
    getSecurityHeaders: () => Record<string, string>;
    generateNonce: () => string;
    sanitizeHeaderValue: (value: string) => string;
    calculateRateLimitKey: (request: Request, prefix?: string) => string;
    shouldBlockRequest: (attempts: number, maxAttempts?: number, lockoutUntil?: Date) => boolean;
    calculateLockoutExpiry: (duration?: number) => Date;
    generateOAuthState: () => string;
    generateCodeVerifier: () => string;
    generateCodeChallenge: (verifier: string) => string;
    SECURITY_CONFIG: {
        readonly SALT_ROUNDS: 12;
        readonly PASSWORD_MIN_LENGTH: 12;
        readonly PASSWORD_MAX_LENGTH: 128;
        readonly TOKEN_LENGTH: 32;
        readonly API_KEY_LENGTH: 64;
        readonly SESSION_TIMEOUT: 3600000;
        readonly REFRESH_TOKEN_EXPIRY: "7d";
        readonly ACCESS_TOKEN_EXPIRY: "15m";
        readonly CSRF_TOKEN_LENGTH: 32;
        readonly ENCRYPTION_ALGORITHM: "aes-256-gcm";
        readonly IV_LENGTH: 16;
        readonly AUTH_TAG_LENGTH: 16;
        readonly MAX_LOGIN_ATTEMPTS: 5;
        readonly LOCKOUT_DURATION: 1800000;
    };
};
export default _default;
//# sourceMappingURL=nest-security-utils.d.ts.map