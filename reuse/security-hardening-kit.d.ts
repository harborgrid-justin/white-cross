/**
 * @fileoverview Security Hardening & Protection Comprehensive Kit
 * @module reuse/security-hardening-kit
 * @description Production-ready security hardening utilities for enterprise NestJS applications
 * including CSRF protection, XSS prevention, input sanitization, encryption, and HIPAA compliance.
 *
 * Key Features:
 * - CSRF protection with token generation and validation
 * - XSS sanitization for HTML, JavaScript, and SQL
 * - SQL injection prevention and query parameterization
 * - Helmet security headers configuration
 * - CORS configuration and validation
 * - Content Security Policy (CSP) builder
 * - Input sanitization and validation
 * - AES-256-GCM encryption and decryption
 * - Secure cookie handling
 * - Security audit logging
 * - Rate limiting per IP/user
 * - Request signature validation (HMAC)
 * - File upload security scanning
 * - DNS rebinding protection
 * - Clickjacking prevention
 * - MIME sniffing prevention
 * - Subresource Integrity (SRI) validation
 * - Certificate pinning
 * - Secrets management and rotation
 *
 * @target Sequelize v6.x, NestJS 10.x, Node 18+, TypeScript 5.x
 *
 * @security
 * - OWASP Top 10 protection
 * - HIPAA-compliant data protection
 * - NIST cybersecurity framework alignment
 * - SOC 2 compliance support
 * - PCI DSS data security standards
 * - GDPR data protection requirements
 * - Automated security event logging
 *
 * @example Basic usage
 * ```typescript
 * import { sanitizeHTML, encryptData, generateCSRFToken } from './security-hardening-kit';
 *
 * // Sanitize user input
 * const clean = sanitizeHTML('<script>alert("xss")</script>Hello');
 *
 * // Encrypt sensitive data
 * const encrypted = await encryptData('patient-data', encryptionKey);
 *
 * // CSRF protection
 * const token = generateCSRFToken();
 * ```
 *
 * @example Advanced usage
 * ```typescript
 * import { buildCSP, configureHelmet, validateRequestSignature } from './security-hardening-kit';
 *
 * // Configure Content Security Policy
 * const csp = buildCSP({
 *   defaultSrc: ["'self'"],
 *   scriptSrc: ["'self'", "'unsafe-inline'"],
 *   styleSrc: ["'self'", 'https://fonts.googleapis.com']
 * });
 *
 * // Validate HMAC request signature
 * const isValid = await validateRequestSignature(request, secret);
 * ```
 *
 * LOC: SECHR8901X890
 * UPSTREAM: helmet, csurf, xss, validator, crypto, sequelize
 * DOWNSTREAM: Security middleware, guards, interceptors, audit services
 *
 * @version 1.0.0
 * @since 2025-11-08
 */
import { NestMiddleware, ExecutionContext, NestInterceptor, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Model, ModelStatic, Transaction, Sequelize } from 'sequelize';
import { Request, Response, NextFunction } from 'express';
/**
 * @interface CSRFTokenConfig
 * @description CSRF token configuration
 */
export interface CSRFTokenConfig {
    secret?: string;
    saltLength?: number;
    tokenLength?: number;
    cookieName?: string;
    headerName?: string;
}
/**
 * @interface SecurityHeadersConfig
 * @description Security headers configuration
 */
export interface SecurityHeadersConfig {
    strictTransportSecurity?: {
        maxAge?: number;
        includeSubDomains?: boolean;
        preload?: boolean;
    };
    contentSecurityPolicy?: CSPConfig;
    xFrameOptions?: 'DENY' | 'SAMEORIGIN' | string;
    xContentTypeOptions?: boolean;
    xXssProtection?: boolean;
    referrerPolicy?: string;
    permissionsPolicy?: string;
}
/**
 * @interface CSPConfig
 * @description Content Security Policy configuration
 */
export interface CSPConfig {
    defaultSrc?: string[];
    scriptSrc?: string[];
    styleSrc?: string[];
    imgSrc?: string[];
    connectSrc?: string[];
    fontSrc?: string[];
    objectSrc?: string[];
    mediaSrc?: string[];
    frameSrc?: string[];
    sandbox?: string[];
    reportUri?: string;
    reportTo?: string;
    upgradeInsecureRequests?: boolean;
    blockAllMixedContent?: boolean;
}
/**
 * @interface CORSConfig
 * @description CORS configuration
 */
export interface CORSConfig {
    origin?: string | string[] | boolean | RegExp | Function;
    methods?: string[];
    allowedHeaders?: string[];
    exposedHeaders?: string[];
    credentials?: boolean;
    maxAge?: number;
    preflightContinue?: boolean;
    optionsSuccessStatus?: number;
}
/**
 * @interface EncryptionConfig
 * @description Encryption configuration
 */
export interface EncryptionConfig {
    algorithm?: 'aes-256-gcm' | 'aes-256-cbc' | 'chacha20-poly1305';
    keyDerivation?: 'pbkdf2' | 'scrypt' | 'argon2';
    iterations?: number;
    keyLength?: number;
    saltLength?: number;
}
/**
 * @interface RateLimitConfig
 * @description Rate limiting configuration
 */
export interface RateLimitConfig {
    windowMs: number;
    max: number;
    message?: string;
    statusCode?: number;
    skipSuccessfulRequests?: boolean;
    skipFailedRequests?: boolean;
    keyGenerator?: (req: Request) => string;
}
/**
 * @interface SecurityAuditEvent
 * @description Security audit event
 */
export interface SecurityAuditEvent {
    type: 'csrf_violation' | 'xss_attempt' | 'sql_injection' | 'rate_limit' | 'unauthorized_access' | 'suspicious_activity' | 'data_breach' | 'encryption_failure' | 'validation_failure' | 'authentication_failure';
    severity: 'low' | 'medium' | 'high' | 'critical';
    userId?: string;
    ipAddress?: string;
    userAgent?: string;
    endpoint?: string;
    method?: string;
    description: string;
    payload?: any;
    metadata?: Record<string, any>;
}
/**
 * @interface SanitizationOptions
 * @description Input sanitization options
 */
export interface SanitizationOptions {
    allowedTags?: string[];
    allowedAttributes?: Record<string, string[]>;
    stripIgnoreTag?: boolean;
    stripIgnoreTagBody?: boolean;
    whiteList?: Record<string, string[]>;
}
/**
 * @interface RequestSignatureConfig
 * @description Request signature configuration
 */
export interface RequestSignatureConfig {
    secret: string;
    algorithm?: 'sha256' | 'sha384' | 'sha512';
    headerName?: string;
    timestampHeader?: string;
    maxAge?: number;
}
export declare const SecurityAuditEventSchema: any;
export declare const CSPConfigSchema: any;
export declare const RateLimitConfigSchema: any;
/**
 * @interface SecurityAuditModel
 * @description Security audit log model interface
 */
export interface SecurityAuditModel extends Model {
    id: string;
    type: string;
    severity: string;
    userId?: string;
    ipAddress?: string;
    userAgent?: string;
    endpoint?: string;
    method?: string;
    description: string;
    payload?: any;
    metadata?: Record<string, any>;
    createdAt: Date;
}
/**
 * @function defineSecurityAuditModel
 * @description Defines the SecurityAudit Sequelize model
 */
export declare function defineSecurityAuditModel(sequelize: Sequelize): ModelStatic<SecurityAuditModel>;
/**
 * @interface RateLimitModel
 * @description Rate limit tracking model interface
 */
export interface RateLimitModel extends Model {
    id: string;
    identifier: string;
    endpoint?: string;
    count: number;
    windowStart: Date;
    windowEnd: Date;
    blocked: boolean;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * @function defineRateLimitModel
 * @description Defines the RateLimit Sequelize model
 */
export declare function defineRateLimitModel(sequelize: Sequelize): ModelStatic<RateLimitModel>;
/**
 * @interface EncryptionKeyModel
 * @description Encryption key management model interface
 */
export interface EncryptionKeyModel extends Model {
    id: string;
    name: string;
    purpose: string;
    algorithm: string;
    keyHash: string;
    version: number;
    isActive: boolean;
    rotatedAt?: Date;
    expiresAt?: Date;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * @function defineEncryptionKeyModel
 * @description Defines the EncryptionKey Sequelize model
 */
export declare function defineEncryptionKeyModel(sequelize: Sequelize): ModelStatic<EncryptionKeyModel>;
/**
 * @function generateCSRFToken
 * @description Generates a cryptographically secure CSRF token
 *
 * @param {CSRFTokenConfig} config - CSRF token configuration
 * @returns {string} CSRF token
 *
 * @example
 * ```typescript
 * const token = generateCSRFToken({ tokenLength: 32 });
 * // Store in session and send to client
 * ```
 */
export declare function generateCSRFToken(config?: CSRFTokenConfig): string;
/**
 * @function validateCSRFToken
 * @description Validates a CSRF token
 *
 * @param {string} token - Token from request
 * @param {string} sessionToken - Token from session
 * @returns {boolean} True if tokens match
 *
 * @example
 * ```typescript
 * const isValid = validateCSRFToken(requestToken, sessionToken);
 * if (!isValid) throw new ForbiddenException('Invalid CSRF token');
 * ```
 */
export declare function validateCSRFToken(token: string, sessionToken: string): boolean;
/**
 * @function generateDoubleSubmitCookie
 * @description Generates a double-submit cookie CSRF token
 *
 * @param {string} secret - Application secret
 * @returns {{ token: string; cookieValue: string }} Token and cookie value
 *
 * @example
 * ```typescript
 * const { token, cookieValue } = generateDoubleSubmitCookie(appSecret);
 * res.cookie('csrf-token', cookieValue, { httpOnly: true, secure: true });
 * // Send token to client in response
 * ```
 */
export declare function generateDoubleSubmitCookie(secret: string): {
    token: string;
    cookieValue: string;
};
/**
 * @function validateDoubleSubmitCookie
 * @description Validates a double-submit cookie CSRF token
 *
 * @param {string} token - Token from request header/body
 * @param {string} cookieValue - Value from cookie
 * @param {string} secret - Application secret
 * @returns {boolean} True if valid
 *
 * @example
 * ```typescript
 * const isValid = validateDoubleSubmitCookie(
 *   req.headers['x-csrf-token'],
 *   req.cookies['csrf-token'],
 *   appSecret
 * );
 * ```
 */
export declare function validateDoubleSubmitCookie(token: string, cookieValue: string, secret: string): boolean;
/**
 * @function sanitizeHTML
 * @description Sanitizes HTML to prevent XSS attacks
 *
 * @param {string} input - HTML input to sanitize
 * @param {SanitizationOptions} options - Sanitization options
 * @returns {string} Sanitized HTML
 *
 * @example
 * ```typescript
 * const clean = sanitizeHTML('<script>alert("xss")</script><p>Hello</p>');
 * // Returns: '<p>Hello</p>'
 * ```
 */
export declare function sanitizeHTML(input: string, options?: SanitizationOptions): string;
/**
 * @function escapeHTML
 * @description Escapes HTML special characters
 *
 * @param {string} input - String to escape
 * @returns {string} Escaped string
 *
 * @example
 * ```typescript
 * const escaped = escapeHTML('<script>alert("xss")</script>');
 * // Returns: '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
 * ```
 */
export declare function escapeHTML(input: string): string;
/**
 * @function stripScripts
 * @description Removes all script tags from input
 *
 * @param {string} input - Input string
 * @returns {string} String without scripts
 *
 * @example
 * ```typescript
 * const clean = stripScripts('<p>Hello</p><script>alert(1)</script>');
 * // Returns: '<p>Hello</p>'
 * ```
 */
export declare function stripScripts(input: string): string;
/**
 * @function sanitizeJavaScript
 * @description Sanitizes JavaScript code
 *
 * @param {string} input - JavaScript code
 * @returns {string} Sanitized code
 *
 * @example
 * ```typescript
 * const safe = sanitizeJavaScript('eval("malicious code")');
 * ```
 */
export declare function sanitizeJavaScript(input: string): string;
/**
 * @function detectXSSAttempt
 * @description Detects potential XSS attempts in input
 *
 * @param {string} input - Input to check
 * @returns {{ isAttempt: boolean; patterns: string[] }} Detection result
 *
 * @example
 * ```typescript
 * const result = detectXSSAttempt('<img src=x onerror=alert(1)>');
 * if (result.isAttempt) {
 *   console.log('XSS attempt detected:', result.patterns);
 * }
 * ```
 */
export declare function detectXSSAttempt(input: string): {
    isAttempt: boolean;
    patterns: string[];
};
/**
 * @function sanitizeSQL
 * @description Sanitizes SQL input to prevent injection
 *
 * @param {string} input - SQL input
 * @returns {string} Sanitized input
 *
 * @example
 * ```typescript
 * const safe = sanitizeSQL("'; DROP TABLE users; --");
 * ```
 */
export declare function sanitizeSQL(input: string): string;
/**
 * @function escapeSQL
 * @description Escapes SQL special characters
 *
 * @param {string} input - Input string
 * @returns {string} Escaped string
 *
 * @example
 * ```typescript
 * const escaped = escapeSQL("O'Reilly");
 * // Returns: "O''Reilly"
 * ```
 */
export declare function escapeSQL(input: string): string;
/**
 * @function detectSQLInjection
 * @description Detects potential SQL injection attempts
 *
 * @param {string} input - Input to check
 * @returns {{ isAttempt: boolean; patterns: string[] }} Detection result
 *
 * @example
 * ```typescript
 * const result = detectSQLInjection("' OR '1'='1");
 * if (result.isAttempt) {
 *   console.log('SQL injection detected:', result.patterns);
 * }
 * ```
 */
export declare function detectSQLInjection(input: string): {
    isAttempt: boolean;
    patterns: string[];
};
/**
 * @function parameterizeQuery
 * @description Helper to ensure parameterized queries are used
 *
 * @param {string} query - SQL query template
 * @param {any[]} params - Query parameters
 * @returns {{ query: string; params: any[] }} Parameterized query
 *
 * @example
 * ```typescript
 * const { query, params } = parameterizeQuery(
 *   'SELECT * FROM users WHERE email = ?',
 *   ['user@example.com']
 * );
 * ```
 */
export declare function parameterizeQuery(query: string, params: any[]): {
    query: string;
    params: any[];
};
/**
 * @function buildCSP
 * @description Builds a Content Security Policy header
 *
 * @param {CSPConfig} config - CSP configuration
 * @returns {string} CSP header value
 *
 * @example
 * ```typescript
 * const csp = buildCSP({
 *   defaultSrc: ["'self'"],
 *   scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.example.com'],
 *   styleSrc: ["'self'", 'https://fonts.googleapis.com']
 * });
 * ```
 */
export declare function buildCSP(config: CSPConfig): string;
/**
 * @function getStrictCSP
 * @description Returns a strict CSP configuration
 *
 * @returns {CSPConfig} Strict CSP config
 *
 * @example
 * ```typescript
 * const strictCSP = getStrictCSP();
 * const cspHeader = buildCSP(strictCSP);
 * ```
 */
export declare function getStrictCSP(): CSPConfig;
/**
 * @function validateCSPViolation
 * @description Validates and logs CSP violations
 *
 * @param {any} violation - CSP violation report
 * @param {ModelStatic<SecurityAuditModel>} SecurityAudit - SecurityAudit model
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * app.post('/csp-report', async (req, res) => {
 *   await validateCSPViolation(req.body, SecurityAudit);
 *   res.status(204).send();
 * });
 * ```
 */
export declare function validateCSPViolation(violation: any, SecurityAudit: ModelStatic<SecurityAuditModel>, transaction?: Transaction): Promise<void>;
/**
 * @function configureHelmet
 * @description Configures Helmet security headers
 *
 * @param {SecurityHeadersConfig} config - Security headers configuration
 * @returns {any} Helmet middleware configuration
 *
 * @example
 * ```typescript
 * const helmetConfig = configureHelmet({
 *   strictTransportSecurity: {
 *     maxAge: 31536000,
 *     includeSubDomains: true,
 *     preload: true
 *   }
 * });
 * app.use(helmet(helmetConfig));
 * ```
 */
export declare function configureHelmet(config?: SecurityHeadersConfig): any;
/**
 * @function setSecurityHeaders
 * @description Sets comprehensive security headers
 *
 * @param {Response} res - Express response object
 * @param {SecurityHeadersConfig} config - Configuration
 * @returns {void}
 *
 * @example
 * ```typescript
 * app.use((req, res, next) => {
 *   setSecurityHeaders(res);
 *   next();
 * });
 * ```
 */
export declare function setSecurityHeaders(res: Response, config?: SecurityHeadersConfig): void;
/**
 * @function configureCORS
 * @description Configures CORS settings
 *
 * @param {CORSConfig} config - CORS configuration
 * @returns {any} CORS middleware configuration
 *
 * @example
 * ```typescript
 * const corsConfig = configureCORS({
 *   origin: ['https://app.whitecross.com'],
 *   credentials: true,
 *   methods: ['GET', 'POST', 'PUT', 'DELETE']
 * });
 * app.use(cors(corsConfig));
 * ```
 */
export declare function configureCORS(config?: CORSConfig): any;
/**
 * @function validateCORSOrigin
 * @description Validates if an origin is allowed
 *
 * @param {string} origin - Request origin
 * @param {string[]} allowedOrigins - Allowed origins
 * @returns {boolean} True if origin is allowed
 *
 * @example
 * ```typescript
 * const isAllowed = validateCORSOrigin(
 *   req.headers.origin,
 *   ['https://app.whitecross.com', 'https://admin.whitecross.com']
 * );
 * ```
 */
export declare function validateCORSOrigin(origin: string, allowedOrigins: string[]): boolean;
/**
 * @function encryptData
 * @description Encrypts data using AES-256-GCM
 *
 * @param {string} plaintext - Data to encrypt
 * @param {string} key - Encryption key (base64)
 * @param {EncryptionConfig} config - Encryption configuration
 * @returns {string} Encrypted data (iv:authTag:ciphertext)
 *
 * @example
 * ```typescript
 * const encrypted = encryptData('patient-ssn-123-45-6789', encryptionKey);
 * // Store encrypted in database
 * ```
 */
export declare function encryptData(plaintext: string, key: string, config?: EncryptionConfig): string;
/**
 * @function decryptData
 * @description Decrypts data encrypted with encryptData
 *
 * @param {string} ciphertext - Encrypted data (iv:authTag:ciphertext)
 * @param {string} key - Decryption key (base64)
 * @param {EncryptionConfig} config - Encryption configuration
 * @returns {string} Decrypted plaintext
 *
 * @example
 * ```typescript
 * const decrypted = decryptData(encryptedData, encryptionKey);
 * console.log('SSN:', decrypted);
 * ```
 */
export declare function decryptData(ciphertext: string, key: string, config?: EncryptionConfig): string;
/**
 * @function generateEncryptionKey
 * @description Generates a random encryption key
 *
 * @param {number} bytes - Key size in bytes (default: 32 for AES-256)
 * @returns {string} Base64-encoded key
 *
 * @example
 * ```typescript
 * const key = generateEncryptionKey();
 * // Store securely in environment variables or key management service
 * ```
 */
export declare function generateEncryptionKey(bytes?: number): string;
/**
 * @function deriveKeyFromPassword
 * @description Derives an encryption key from a password using PBKDF2
 *
 * @param {string} password - Password
 * @param {string} salt - Salt (base64)
 * @param {EncryptionConfig} config - Configuration
 * @returns {Promise<string>} Derived key (base64)
 *
 * @example
 * ```typescript
 * const key = await deriveKeyFromPassword('user-password', salt);
 * ```
 */
export declare function deriveKeyFromPassword(password: string, salt: string, config?: EncryptionConfig): Promise<string>;
/**
 * @function hashData
 * @description Hashes data using SHA-256
 *
 * @param {string} data - Data to hash
 * @returns {string} Hash (hex)
 *
 * @example
 * ```typescript
 * const hash = hashData('sensitive-data');
 * ```
 */
export declare function hashData(data: string): string;
/**
 * @function rotateEncryptionKey
 * @description Rotates an encryption key
 *
 * @param {ModelStatic<EncryptionKeyModel>} EncryptionKey - EncryptionKey model
 * @param {string} keyId - Current key ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<{ oldKey: EncryptionKeyModel; newKey: EncryptionKeyModel }>} Old and new keys
 *
 * @example
 * ```typescript
 * const { oldKey, newKey } = await rotateEncryptionKey(EncryptionKey, currentKeyId);
 * // Re-encrypt data with new key
 * ```
 */
export declare function rotateEncryptionKey(EncryptionKey: ModelStatic<EncryptionKeyModel>, keyId: string, transaction?: Transaction): Promise<{
    oldKey: EncryptionKeyModel;
    newKey: EncryptionKeyModel;
}>;
/**
 * @function setSecureCookie
 * @description Sets a secure cookie
 *
 * @param {Response} res - Express response
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {object} options - Cookie options
 * @returns {void}
 *
 * @example
 * ```typescript
 * setSecureCookie(res, 'session', sessionId, {
 *   maxAge: 30 * 60 * 1000, // 30 minutes
 *   httpOnly: true,
 *   secure: true,
 *   sameSite: 'strict'
 * });
 * ```
 */
export declare function setSecureCookie(res: Response, name: string, value: string, options?: {
    maxAge?: number;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
    domain?: string;
    path?: string;
    signed?: boolean;
}): void;
/**
 * @function clearSecureCookie
 * @description Clears a secure cookie
 *
 * @param {Response} res - Express response
 * @param {string} name - Cookie name
 * @param {object} options - Cookie options
 * @returns {void}
 *
 * @example
 * ```typescript
 * clearSecureCookie(res, 'session');
 * ```
 */
export declare function clearSecureCookie(res: Response, name: string, options?: {
    domain?: string;
    path?: string;
}): void;
/**
 * @function checkRateLimit
 * @description Checks if a request is within rate limits
 *
 * @param {ModelStatic<RateLimitModel>} RateLimit - RateLimit model
 * @param {string} identifier - Rate limit identifier (IP, user ID, etc.)
 * @param {RateLimitConfig} config - Rate limit configuration
 * @param {string} endpoint - Optional endpoint
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<{ allowed: boolean; remaining: number; resetAt: Date }>} Rate limit status
 *
 * @example
 * ```typescript
 * const status = await checkRateLimit(RateLimit, req.ip, {
 *   windowMs: 15 * 60 * 1000, // 15 minutes
 *   max: 100
 * }, req.path);
 * if (!status.allowed) throw new HttpException('Too many requests', 429);
 * ```
 */
export declare function checkRateLimit(RateLimit: ModelStatic<RateLimitModel>, identifier: string, config: RateLimitConfig, endpoint?: string, transaction?: Transaction): Promise<{
    allowed: boolean;
    remaining: number;
    resetAt: Date;
}>;
/**
 * @function cleanupExpiredRateLimits
 * @description Removes expired rate limit records
 *
 * @param {ModelStatic<RateLimitModel>} RateLimit - RateLimit model
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<number>} Number of deleted records
 *
 * @example
 * ```typescript
 * const deleted = await cleanupExpiredRateLimits(RateLimit);
 * console.log(`Cleaned up ${deleted} expired rate limits`);
 * ```
 */
export declare function cleanupExpiredRateLimits(RateLimit: ModelStatic<RateLimitModel>, transaction?: Transaction): Promise<number>;
/**
 * @function generateRequestSignature
 * @description Generates an HMAC signature for a request
 *
 * @param {RequestSignatureConfig} config - Signature configuration
 * @param {object} payload - Request payload
 * @param {number} timestamp - Request timestamp
 * @returns {string} HMAC signature (hex)
 *
 * @example
 * ```typescript
 * const signature = generateRequestSignature(
 *   { secret: 'webhook-secret', algorithm: 'sha256' },
 *   requestBody,
 *   Date.now()
 * );
 * ```
 */
export declare function generateRequestSignature(config: RequestSignatureConfig, payload: any, timestamp: number): string;
/**
 * @function validateRequestSignature
 * @description Validates an HMAC request signature
 *
 * @param {RequestSignatureConfig} config - Signature configuration
 * @param {string} signature - Provided signature
 * @param {object} payload - Request payload
 * @param {number} timestamp - Request timestamp
 * @returns {boolean} True if signature is valid
 *
 * @example
 * ```typescript
 * const isValid = validateRequestSignature(
 *   { secret: 'webhook-secret' },
 *   req.headers['x-signature'],
 *   req.body,
 *   parseInt(req.headers['x-timestamp'])
 * );
 * ```
 */
export declare function validateRequestSignature(config: RequestSignatureConfig, signature: string, payload: any, timestamp: number): boolean;
/**
 * @function validateEmail
 * @description Validates an email address
 *
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 *
 * @example
 * ```typescript
 * if (!validateEmail(userEmail)) {
 *   throw new BadRequestException('Invalid email');
 * }
 * ```
 */
export declare function validateEmail(email: string): boolean;
/**
 * @function validateURL
 * @description Validates a URL
 *
 * @param {string} url - URL to validate
 * @param {object} options - Validation options
 * @returns {boolean} True if valid
 *
 * @example
 * ```typescript
 * if (!validateURL(redirectUrl, { protocols: ['https'] })) {
 *   throw new BadRequestException('Invalid URL');
 * }
 * ```
 */
export declare function validateURL(url: string, options?: {
    protocols?: string[];
    require_protocol?: boolean;
    require_host?: boolean;
}): boolean;
/**
 * @function sanitizeFilename
 * @description Sanitizes a filename to prevent directory traversal
 *
 * @param {string} filename - Filename to sanitize
 * @returns {string} Sanitized filename
 *
 * @example
 * ```typescript
 * const safe = sanitizeFilename('../../../etc/passwd');
 * // Returns: 'passwd'
 * ```
 */
export declare function sanitizeFilename(filename: string): string;
/**
 * @function validateIPAddress
 * @description Validates an IP address
 *
 * @param {string} ip - IP address
 * @param {string} version - IP version ('4' or '6')
 * @returns {boolean} True if valid
 *
 * @example
 * ```typescript
 * if (validateIPAddress(req.ip, '4')) {
 *   console.log('Valid IPv4 address');
 * }
 * ```
 */
export declare function validateIPAddress(ip: string, version?: '4' | '6'): boolean;
/**
 * @function normalizeInput
 * @description Normalizes and trims input
 *
 * @param {string} input - Input to normalize
 * @returns {string} Normalized input
 *
 * @example
 * ```typescript
 * const normalized = normalizeInput('  Hello   World  ');
 * // Returns: 'Hello World'
 * ```
 */
export declare function normalizeInput(input: string): string;
/**
 * @function logSecurityEvent
 * @description Logs a security event to the audit trail
 *
 * @param {ModelStatic<SecurityAuditModel>} SecurityAudit - SecurityAudit model
 * @param {SecurityAuditEvent} event - Security event
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<SecurityAuditModel>} Created audit record
 *
 * @example
 * ```typescript
 * await logSecurityEvent(SecurityAudit, {
 *   type: 'xss_attempt',
 *   severity: 'high',
 *   userId: req.user.id,
 *   ipAddress: req.ip,
 *   description: 'XSS attempt detected in user input',
 *   payload: req.body
 * });
 * ```
 */
export declare function logSecurityEvent(SecurityAudit: ModelStatic<SecurityAuditModel>, event: SecurityAuditEvent, transaction?: Transaction): Promise<SecurityAuditModel>;
/**
 * @function getSecurityAuditReport
 * @description Generates a security audit report
 *
 * @param {ModelStatic<SecurityAuditModel>} SecurityAudit - SecurityAudit model
 * @param {object} filters - Report filters
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Audit report
 *
 * @example
 * ```typescript
 * const report = await getSecurityAuditReport(SecurityAudit, {
 *   startDate: new Date('2025-01-01'),
 *   endDate: new Date('2025-01-31'),
 *   severity: 'high'
 * });
 * ```
 */
export declare function getSecurityAuditReport(SecurityAudit: ModelStatic<SecurityAuditModel>, filters?: {
    startDate?: Date;
    endDate?: Date;
    type?: string;
    severity?: string;
    userId?: string;
}, transaction?: Transaction): Promise<any>;
/**
 * @function detectAnomalousActivity
 * @description Detects anomalous security activity
 *
 * @param {ModelStatic<SecurityAuditModel>} SecurityAudit - SecurityAudit model
 * @param {string} identifier - User ID or IP address
 * @param {number} windowMinutes - Time window in minutes
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<{ isAnomalous: boolean; reason: string[] }>} Detection result
 *
 * @example
 * ```typescript
 * const result = await detectAnomalousActivity(SecurityAudit, userId, 60);
 * if (result.isAnomalous) {
 *   console.log('Anomalous activity detected:', result.reason);
 * }
 * ```
 */
export declare function detectAnomalousActivity(SecurityAudit: ModelStatic<SecurityAuditModel>, identifier: string, windowMinutes?: number, transaction?: Transaction): Promise<{
    isAnomalous: boolean;
    reason: string[];
}>;
/**
 * @middleware CSRFMiddleware
 * @description CSRF protection middleware
 *
 * @example
 * ```typescript
 * app.use(new CSRFMiddleware(csrfSecret).use);
 * ```
 */
export declare class CSRFMiddleware implements NestMiddleware {
    private readonly secret;
    constructor(secret: string);
    use(req: Request, res: Response, next: NextFunction): any;
}
/**
 * @middleware SecurityHeadersMiddleware
 * @description Security headers middleware
 *
 * @example
 * ```typescript
 * app.use(new SecurityHeadersMiddleware().use);
 * ```
 */
export declare class SecurityHeadersMiddleware implements NestMiddleware {
    private readonly config?;
    constructor(config?: SecurityHeadersConfig | undefined);
    use(req: Request, res: Response, next: NextFunction): void;
}
/**
 * @interceptor SecurityAuditInterceptor
 * @description Intercepts requests for security auditing
 *
 * @example
 * ```typescript
 * @UseInterceptors(SecurityAuditInterceptor)
 * ```
 */
export declare class SecurityAuditInterceptor implements NestInterceptor {
    private readonly SecurityAudit;
    constructor(SecurityAudit: ModelStatic<SecurityAuditModel>);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
//# sourceMappingURL=security-hardening-kit.d.ts.map