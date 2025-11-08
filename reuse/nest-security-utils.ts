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

import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

/**
 * Security configuration constants
 */
export const SECURITY_CONFIG = {
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
} as const;

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
export const generateJwtToken = async (
  payload: TokenPayload,
  secret: string,
  expiresIn: string | number = SECURITY_CONFIG.ACCESS_TOKEN_EXPIRY,
): Promise<string> => {
  const jwtService = new JwtService({ secret });
  return jwtService.signAsync(payload, { expiresIn });
};

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
export const verifyJwtToken = async (
  token: string,
  secret: string,
): Promise<TokenPayload | null> => {
  try {
    const jwtService = new JwtService({ secret });
    return await jwtService.verifyAsync<TokenPayload>(token);
  } catch (error) {
    return null;
  }
};

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
export const decodeJwtToken = (token: string): TokenPayload | null => {
  try {
    const jwtService = new JwtService({});
    return jwtService.decode(token) as TokenPayload;
  } catch (error) {
    return null;
  }
};

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
export const extractBearerToken = (request: Request): string | null => {
  const authHeader = request.headers.authorization;
  if (!authHeader) return null;

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;

  return parts[1];
};

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
export const isTokenExpired = (token: string): boolean => {
  const payload = decodeJwtToken(token);
  if (!payload || !payload.exp) return true;

  return Date.now() >= payload.exp * 1000;
};

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
export const getTokenExpirationDate = (token: string): Date | null => {
  const payload = decodeJwtToken(token);
  if (!payload || !payload.exp) return null;

  return new Date(payload.exp * 1000);
};

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
export const getTokenRemainingTime = (token: string): number => {
  const expiresAt = getTokenExpirationDate(token);
  if (!expiresAt) return 0;

  const remaining = expiresAt.getTime() - Date.now();
  return Math.max(0, remaining);
};

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
export const hashPasswordBcrypt = async (
  password: string,
  saltRounds: number = SECURITY_CONFIG.SALT_ROUNDS,
): Promise<string> => {
  if (!password || password.length < SECURITY_CONFIG.PASSWORD_MIN_LENGTH) {
    throw new Error(
      `Password must be at least ${SECURITY_CONFIG.PASSWORD_MIN_LENGTH} characters`,
    );
  }

  return bcrypt.hash(password, saltRounds);
};

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
export const comparePasswordBcrypt = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

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
export const validatePasswordStrength = (password: string): {
  isValid: boolean;
  errors: string[];
  strength: number;
} => {
  const errors: string[] = [];
  let strength = 0;

  if (!password) {
    return { isValid: false, errors: ['Password is required'], strength: 0 };
  }

  // Length check
  if (password.length < SECURITY_CONFIG.PASSWORD_MIN_LENGTH) {
    errors.push(
      `Password must be at least ${SECURITY_CONFIG.PASSWORD_MIN_LENGTH} characters`,
    );
  } else {
    strength += 1;
  }

  if (password.length > SECURITY_CONFIG.PASSWORD_MAX_LENGTH) {
    errors.push(
      `Password cannot exceed ${SECURITY_CONFIG.PASSWORD_MAX_LENGTH} characters`,
    );
  }

  // Complexity checks
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  } else {
    strength += 1;
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  } else {
    strength += 1;
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  } else {
    strength += 1;
  }

  if (!/[@$!%*?&]/.test(password)) {
    errors.push('Password must contain at least one special character (@$!%*?&)');
  } else {
    strength += 1;
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength,
  };
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
export const generateSecurePassword = (length: number = 16): string => {
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
export const generateSecureToken = (
  length: number = SECURITY_CONFIG.TOKEN_LENGTH,
): string => {
  return crypto.randomBytes(length).toString('hex');
};

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
export const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

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
export const compareTokens = (token1: string, token2: string): boolean => {
  if (token1.length !== token2.length) return false;

  try {
    const buf1 = Buffer.from(token1, 'utf8');
    const buf2 = Buffer.from(token2, 'utf8');
    return crypto.timingSafeEqual(buf1, buf2);
  } catch {
    return false;
  }
};

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
export const generateRefreshToken = (
  userId: string,
): { token: string; hash: string; expiresAt: Date } => {
  const token = generateSecureToken(64);
  const hash = hashToken(token);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  return { token, hash, expiresAt };
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
export const generatePasswordResetToken = (
  userId: string,
): { token: string; hash: string; expiresAt: Date } => {
  const token = generateSecureToken(32);
  const hash = hashToken(token);
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  return { token, hash, expiresAt };
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
export const generateEmailVerificationToken = (
  email: string,
): { token: string; hash: string } => {
  const token = generateSecureToken(32);
  const hash = hashToken(token);

  return { token, hash };
};

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
export const generateApiKey = (
  userId: string,
  name: string,
  prefix: string = 'wc',
): ApiKey => {
  const randomBytes = crypto.randomBytes(SECURITY_CONFIG.API_KEY_LENGTH / 2);
  const key = `${prefix}_${randomBytes.toString('hex')}`;
  const hash = hashToken(key);

  return {
    key,
    hash,
    userId,
    name,
    createdAt: new Date(),
  };
};

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
export const validateApiKeyFormat = (
  apiKey: string,
  prefix: string = 'wc',
): boolean => {
  const regex = new RegExp(`^${prefix}_[a-f0-9]{${SECURITY_CONFIG.API_KEY_LENGTH}}$`);
  return regex.test(apiKey);
};

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
export const extractApiKey = (request: Request): string | null => {
  // Check X-API-Key header
  const headerKey = request.headers['x-api-key'] as string;
  if (headerKey) return headerKey;

  // Check query parameter
  const queryKey = request.query.api_key as string;
  if (queryKey) return queryKey;

  return null;
};

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
export const generateCsrfToken = (): string => {
  return crypto.randomBytes(SECURITY_CONFIG.CSRF_TOKEN_LENGTH).toString('hex');
};

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
export const validateCsrfToken = (
  request: Request,
  cookieName: string = '_csrf',
): boolean => {
  const cookieToken = request.cookies?.[cookieName];
  const headerToken = request.headers['x-csrf-token'] as string;
  const bodyToken = (request.body as any)?._csrf;

  const providedToken = headerToken || bodyToken;

  if (!cookieToken || !providedToken) return false;

  return compareTokens(cookieToken, providedToken);
};

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
export const generateSessionId = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

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
export const isSessionExpired = (
  lastActivity: Date,
  timeout: number = SECURITY_CONFIG.SESSION_TIMEOUT,
): boolean => {
  return Date.now() - lastActivity.getTime() > timeout;
};

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
export const calculateSessionExpiry = (
  timeout: number = SECURITY_CONFIG.SESSION_TIMEOUT,
): Date => {
  return new Date(Date.now() + timeout);
};

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
export const encryptData = (plaintext: string, key: string): string => {
  const derivedKey = crypto.scryptSync(key, 'salt', 32);
  const iv = crypto.randomBytes(SECURITY_CONFIG.IV_LENGTH);
  const cipher = crypto.createCipheriv(
    SECURITY_CONFIG.ENCRYPTION_ALGORITHM,
    derivedKey,
    iv,
  );

  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
};

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
export const decryptData = (encryptedData: string, key: string): string => {
  const [ivHex, authTagHex, encrypted] = encryptedData.split(':');
  if (!ivHex || !authTagHex || !encrypted) {
    throw new Error('Invalid encrypted data format');
  }

  const derivedKey = crypto.scryptSync(key, 'salt', 32);
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');

  const decipher = crypto.createDecipheriv(
    SECURITY_CONFIG.ENCRYPTION_ALGORITHM,
    derivedKey,
    iv,
  );
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
};

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
export const encryptObject = (obj: any, key: string): string => {
  return encryptData(JSON.stringify(obj), key);
};

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
export const decryptObject = (encryptedData: string, key: string): any => {
  return JSON.parse(decryptData(encryptedData, key));
};

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
export const getSecurityHeaders = (): Record<string, string> => {
  return {
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    'Content-Security-Policy':
      "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;",
  };
};

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
export const generateNonce = (): string => {
  return crypto.randomBytes(16).toString('base64');
};

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
export const sanitizeHeaderValue = (value: string): string => {
  return value.replace(/[\r\n]/g, '');
};

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
export const calculateRateLimitKey = (
  request: Request,
  prefix: string = 'ratelimit',
): string => {
  const userId = (request as any).user?.id;
  const ip = request.ip || request.socket.remoteAddress;

  return userId ? `${prefix}:user:${userId}` : `${prefix}:ip:${ip}`;
};

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
export const shouldBlockRequest = (
  attempts: number,
  maxAttempts: number = SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS,
  lockoutUntil?: Date,
): boolean => {
  if (lockoutUntil && lockoutUntil > new Date()) {
    return true;
  }

  return attempts >= maxAttempts;
};

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
export const calculateLockoutExpiry = (
  duration: number = SECURITY_CONFIG.LOCKOUT_DURATION,
): Date => {
  return new Date(Date.now() + duration);
};

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
export const generateOAuthState = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

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
export const generateCodeVerifier = (): string => {
  return crypto
    .randomBytes(32)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

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
export const generateCodeChallenge = (verifier: string): string => {
  return crypto
    .createHash('sha256')
    .update(verifier)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

export default {
  // JWT
  generateJwtToken,
  verifyJwtToken,
  decodeJwtToken,
  extractBearerToken,
  isTokenExpired,
  getTokenExpirationDate,
  getTokenRemainingTime,
  // Password
  hashPasswordBcrypt,
  comparePasswordBcrypt,
  validatePasswordStrength,
  generateSecurePassword,
  // Tokens
  generateSecureToken,
  hashToken,
  compareTokens,
  generateRefreshToken,
  generatePasswordResetToken,
  generateEmailVerificationToken,
  // API Keys
  generateApiKey,
  validateApiKeyFormat,
  extractApiKey,
  // CSRF
  generateCsrfToken,
  validateCsrfToken,
  // Session
  generateSessionId,
  isSessionExpired,
  calculateSessionExpiry,
  // Encryption
  encryptData,
  decryptData,
  encryptObject,
  decryptObject,
  // Headers
  getSecurityHeaders,
  generateNonce,
  sanitizeHeaderValue,
  // Rate Limiting
  calculateRateLimitKey,
  shouldBlockRequest,
  calculateLockoutExpiry,
  // OAuth
  generateOAuthState,
  generateCodeVerifier,
  generateCodeChallenge,
  // Constants
  SECURITY_CONFIG,
};
