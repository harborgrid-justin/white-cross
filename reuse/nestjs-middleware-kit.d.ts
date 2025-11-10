/**
 * LOC: M6D7W8K9T0
 * File: /reuse/nestjs-middleware-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v11.1.8)
 *   - express (v4.18.2)
 *   - helmet (v7.1.0)
 *   - compression (v1.7.4)
 *   - cookie-parser (v1.4.6)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS middleware configuration
 *   - Application bootstrap
 *   - Security and validation layers
 */
import { Request, Response, NextFunction } from 'express';
/**
 * Request logging options
 */
export interface LoggingOptions {
    logBody?: boolean;
    logHeaders?: boolean;
    logQuery?: boolean;
    logParams?: boolean;
    logResponse?: boolean;
    excludePaths?: string[];
    excludeHeaders?: string[];
    sanitizePHI?: boolean;
}
/**
 * CORS configuration options
 */
export interface CorsOptions {
    origin?: string | string[] | RegExp | ((origin: string) => boolean);
    methods?: string[];
    allowedHeaders?: string[];
    exposedHeaders?: string[];
    credentials?: boolean;
    maxAge?: number;
    preflightContinue?: boolean;
}
/**
 * Rate limiting configuration
 */
export interface RateLimitOptions {
    windowMs: number;
    max: number;
    message?: string;
    skipSuccessfulRequests?: boolean;
    skipFailedRequests?: boolean;
    keyGenerator?: (req: Request) => string;
}
/**
 * Compression options
 */
export interface CompressionOptions {
    threshold?: number;
    level?: number;
    filter?: (req: Request, res: Response) => boolean;
}
/**
 * Request validation options
 */
export interface ValidationOptions {
    stripUnknown?: boolean;
    abortEarly?: boolean;
    maxBodySize?: number;
    allowedContentTypes?: string[];
}
/**
 * Sanitization rules
 */
export interface SanitizationRule {
    field: string;
    rules: ('trim' | 'lowercase' | 'uppercase' | 'escape' | 'stripHtml')[];
}
/**
 * Cookie options
 */
export interface CookieOptions {
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
    maxAge?: number;
    domain?: string;
    path?: string;
    signed?: boolean;
}
/**
 * Audit log entry
 */
export interface AuditLogEntry {
    timestamp: Date;
    requestId: string;
    method: string;
    path: string;
    userId?: string;
    ip: string;
    userAgent: string;
    statusCode?: number;
    duration?: number;
    action?: string;
    resource?: string;
}
/**
 * Request context for tracking
 */
export interface RequestContext {
    requestId: string;
    startTime: number;
    userId?: string;
    tenantId?: string;
    correlationId?: string;
}
/**
 * Creates request logging middleware with configurable options.
 *
 * @param {LoggingOptions} options - Logging configuration
 * @returns {(req: Request, res: Response, next: NextFunction) => void} Middleware function
 *
 * @example
 * ```typescript
 * // In main.ts
 * app.use(createLoggingMiddleware({
 *   logBody: true,
 *   logHeaders: false,
 *   excludePaths: ['/health', '/metrics'],
 *   sanitizePHI: true
 * }));
 * ```
 */
export declare function createLoggingMiddleware(options?: LoggingOptions): (req: Request, res: Response, next: NextFunction) => void;
/**
 * Creates CORS middleware with custom configuration.
 *
 * @param {CorsOptions} options - CORS configuration
 * @returns {(req: Request, res: Response, next: NextFunction) => void} Middleware function
 *
 * @example
 * ```typescript
 * app.use(createCorsMiddleware({
 *   origin: ['https://example.com', 'https://app.example.com'],
 *   methods: ['GET', 'POST', 'PUT', 'DELETE'],
 *   credentials: true,
 *   maxAge: 86400
 * }));
 * ```
 */
export declare function createCorsMiddleware(options?: CorsOptions): (req: Request, res: Response, next: NextFunction) => void;
/**
 * Creates rate limiting middleware.
 *
 * @param {RateLimitOptions} options - Rate limit configuration
 * @returns {(req: Request, res: Response, next: NextFunction) => void} Middleware function
 *
 * @example
 * ```typescript
 * app.use('/api/auth', createRateLimitMiddleware({
 *   windowMs: 15 * 60 * 1000, // 15 minutes
 *   max: 5, // 5 requests per window
 *   message: 'Too many login attempts'
 * }));
 * ```
 */
export declare function createRateLimitMiddleware(options: RateLimitOptions): (req: Request, res: Response, next: NextFunction) => void;
/**
 * Creates compression middleware for response compression.
 *
 * @param {CompressionOptions} options - Compression configuration
 * @returns {(req: Request, res: Response, next: NextFunction) => void} Middleware function
 *
 * @example
 * ```typescript
 * app.use(createCompressionMiddleware({
 *   threshold: 1024, // Only compress responses > 1KB
 *   level: 6 // Compression level 0-9
 * }));
 * ```
 */
export declare function createCompressionMiddleware(options?: CompressionOptions): (req: Request, res: Response, next: NextFunction) => void;
/**
 * Creates helmet security middleware with HIPAA-compliant defaults.
 *
 * @returns {(req: Request, res: Response, next: NextFunction) => void} Middleware function
 *
 * @example
 * ```typescript
 * app.use(createSecurityMiddleware());
 * ```
 */
export declare function createSecurityMiddleware(): (req: Request, res: Response, next: NextFunction) => void;
/**
 * Creates request validation middleware.
 *
 * @param {ValidationOptions} options - Validation configuration
 * @returns {(req: Request, res: Response, next: NextFunction) => void} Middleware function
 *
 * @example
 * ```typescript
 * app.use(createValidationMiddleware({
 *   maxBodySize: 10 * 1024 * 1024, // 10MB
 *   allowedContentTypes: ['application/json', 'multipart/form-data']
 * }));
 * ```
 */
export declare function createValidationMiddleware(options?: ValidationOptions): (req: Request, res: Response, next: NextFunction) => void;
/**
 * Creates body sanitization middleware.
 *
 * @param {SanitizationRule[]} rules - Sanitization rules
 * @returns {(req: Request, res: Response, next: NextFunction) => void} Middleware function
 *
 * @example
 * ```typescript
 * app.use(createSanitizationMiddleware([
 *   { field: 'email', rules: ['trim', 'lowercase'] },
 *   { field: 'name', rules: ['trim', 'escape'] }
 * ]));
 * ```
 */
export declare function createSanitizationMiddleware(rules: SanitizationRule[]): (req: Request, res: Response, next: NextFunction) => void;
/**
 * Creates input sanitization middleware for XSS prevention.
 *
 * @returns {(req: Request, res: Response, next: NextFunction) => void} Middleware function
 *
 * @example
 * ```typescript
 * app.use(createXssProtectionMiddleware());
 * ```
 */
export declare function createXssProtectionMiddleware(): (req: Request, res: Response, next: NextFunction) => void;
/**
 * Creates cookie parser middleware with signing support.
 *
 * @param {string} secret - Secret for cookie signing
 * @returns {(req: Request, res: Response, next: NextFunction) => void} Middleware function
 *
 * @example
 * ```typescript
 * app.use(createCookieParserMiddleware(process.env.COOKIE_SECRET));
 * ```
 */
export declare function createCookieParserMiddleware(secret?: string): (req: Request, res: Response, next: NextFunction) => void;
/**
 * Creates secure cookie setter helper.
 *
 * @param {Response} res - Express response object
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {CookieOptions} options - Cookie options
 *
 * @example
 * ```typescript
 * @Post('login')
 * async login(@Body() dto: LoginDto, @Res() res: Response) {
 *   const token = await this.authService.login(dto);
 *   setSecureCookie(res, 'auth_token', token, {
 *     httpOnly: true,
 *     secure: true,
 *     sameSite: 'strict',
 *     maxAge: 24 * 60 * 60 * 1000 // 24 hours
 *   });
 *   return res.json({ success: true });
 * }
 * ```
 */
export declare function setSecureCookie(res: Response, name: string, value: string, options?: CookieOptions): void;
/**
 * Clears a cookie by setting it to expire.
 *
 * @param {Response} res - Express response object
 * @param {string} name - Cookie name
 * @param {Partial<CookieOptions>} options - Cookie options
 *
 * @example
 * ```typescript
 * @Post('logout')
 * async logout(@Res() res: Response) {
 *   clearCookie(res, 'auth_token');
 *   return res.json({ success: true });
 * }
 * ```
 */
export declare function clearCookie(res: Response, name: string, options?: Partial<CookieOptions>): void;
/**
 * Creates JWT authentication middleware.
 *
 * @param {string} secret - JWT secret
 * @param {string[]} excludePaths - Paths to exclude from authentication
 * @returns {(req: Request, res: Response, next: NextFunction) => void} Middleware function
 *
 * @example
 * ```typescript
 * app.use(createJwtAuthMiddleware(
 *   process.env.JWT_SECRET,
 *   ['/api/auth/login', '/api/auth/register', '/health']
 * ));
 * ```
 */
export declare function createJwtAuthMiddleware(secret: string, excludePaths?: string[]): (req: Request, res: Response, next: NextFunction) => void;
/**
 * Creates API key authentication middleware.
 *
 * @param {string[]} validApiKeys - Array of valid API keys
 * @param {string} headerName - Header name for API key (default: 'x-api-key')
 * @returns {(req: Request, res: Response, next: NextFunction) => void} Middleware function
 *
 * @example
 * ```typescript
 * app.use('/api/webhooks', createApiKeyAuthMiddleware(
 *   process.env.VALID_API_KEYS.split(','),
 *   'x-api-key'
 * ));
 * ```
 */
export declare function createApiKeyAuthMiddleware(validApiKeys: string[], headerName?: string): (req: Request, res: Response, next: NextFunction) => void;
/**
 * Creates role-based authorization middleware.
 *
 * @param {string[]} allowedRoles - Array of allowed roles
 * @returns {(req: Request, res: Response, next: NextFunction) => void} Middleware function
 *
 * @example
 * ```typescript
 * app.use('/api/admin', createRoleAuthMiddleware(['admin', 'superadmin']));
 * ```
 */
export declare function createRoleAuthMiddleware(allowedRoles: string[]): (req: Request, res: Response, next: NextFunction) => void;
/**
 * Creates request tracking middleware that adds context to requests.
 *
 * @returns {(req: Request, res: Response, next: NextFunction) => void} Middleware function
 *
 * @example
 * ```typescript
 * app.use(createRequestTrackingMiddleware());
 * ```
 */
export declare function createRequestTrackingMiddleware(): (req: Request, res: Response, next: NextFunction) => void;
/**
 * Creates audit logging middleware for HIPAA compliance.
 *
 * @param {(entry: AuditLogEntry) => Promise<void>} logFunction - Function to persist audit logs
 * @returns {(req: Request, res: Response, next: NextFunction) => void} Middleware function
 *
 * @example
 * ```typescript
 * app.use(createAuditLogMiddleware(async (entry) => {
 *   await auditLogRepository.save(entry);
 * }));
 * ```
 */
export declare function createAuditLogMiddleware(logFunction: (entry: AuditLogEntry) => Promise<void>): (req: Request, res: Response, next: NextFunction) => void;
/**
 * Creates performance monitoring middleware.
 *
 * @param {number} slowRequestThreshold - Threshold in ms to log slow requests (default: 1000)
 * @returns {(req: Request, res: Response, next: NextFunction) => void} Middleware function
 *
 * @example
 * ```typescript
 * app.use(createPerformanceMonitoringMiddleware(2000)); // Log requests > 2 seconds
 * ```
 */
export declare function createPerformanceMonitoringMiddleware(slowRequestThreshold?: number): (req: Request, res: Response, next: NextFunction) => void;
/**
 * Creates JSON body parser middleware with size limit.
 *
 * @param {number} limit - Size limit in bytes (default: 10MB)
 * @returns {(req: Request, res: Response, next: NextFunction) => void} Middleware function
 *
 * @example
 * ```typescript
 * app.use(createJsonBodyParser(5 * 1024 * 1024)); // 5MB limit
 * ```
 */
export declare function createJsonBodyParser(limit?: number): (req: Request, res: Response, next: NextFunction) => void;
/**
 * Creates URL-encoded body parser middleware.
 *
 * @param {boolean} extended - Use extended parsing (default: true)
 * @returns {(req: Request, res: Response, next: NextFunction) => void} Middleware function
 *
 * @example
 * ```typescript
 * app.use(createUrlEncodedParser());
 * ```
 */
export declare function createUrlEncodedParser(extended?: boolean): (req: Request, res: Response, next: NextFunction) => void;
/**
 * Sanitizes object recursively to prevent XSS attacks.
 *
 * @param {any} obj - Object to sanitize
 * @returns {any} Sanitized object
 *
 * @example
 * ```typescript
 * const sanitized = sanitizeObject({ name: '<script>alert(1)</script>' });
 * // Returns: { name: '&lt;script&gt;alert(1)&lt;/script&gt;' }
 * ```
 */
export declare function sanitizeObject(obj: any): any;
/**
 * Applies a sanitization rule to a value.
 *
 * @param {any} value - Value to sanitize
 * @param {string} rule - Sanitization rule name
 * @returns {any} Sanitized value
 *
 * @example
 * ```typescript
 * const sanitized = applySanitizationRule('  HELLO  ', 'trim');
 * // Returns: 'HELLO'
 * ```
 */
export declare function applySanitizationRule(value: any, rule: string): any;
/**
 * Sanitizes PHI (Protected Health Information) data for logging.
 *
 * @param {any} data - Data to sanitize
 * @returns {any} Sanitized data with PHI fields redacted
 *
 * @example
 * ```typescript
 * const sanitized = sanitizePHIData({
 *   name: 'John Doe',
 *   ssn: '123-45-6789',
 *   email: 'john@example.com'
 * });
 * // Returns: { name: '***', ssn: '***', email: '***' }
 * ```
 */
export declare function sanitizePHIData(data: any): any;
/**
 * Unsigns a signed cookie value.
 *
 * @param {string} value - Signed cookie value
 * @param {string} secret - Secret used for signing
 * @returns {string | undefined} Unsigned value or undefined if invalid
 *
 * @example
 * ```typescript
 * const unsigned = unsignCookie('s:value.signature', 'my-secret');
 * // Returns: 'value' if signature is valid
 * ```
 */
export declare function unsignCookie(value: string, secret: string): string | undefined;
/**
 * Validates request origin against whitelist.
 *
 * @param {string} origin - Request origin
 * @param {string[]} whitelist - Array of allowed origins
 * @returns {boolean} True if origin is allowed
 *
 * @example
 * ```typescript
 * const isAllowed = validateOrigin(
 *   'https://app.example.com',
 *   ['https://app.example.com', 'https://admin.example.com']
 * );
 * // Returns: true
 * ```
 */
export declare function validateOrigin(origin: string, whitelist: string[]): boolean;
/**
 * Generates a random request ID.
 *
 * @returns {string} Random request ID
 *
 * @example
 * ```typescript
 * const requestId = generateRequestId();
 * // Returns: 'req-1699564800000-a1b2c3d4'
 * ```
 */
export declare function generateRequestId(): string;
/**
 * Checks if IP address is in whitelist.
 *
 * @param {string} ip - IP address to check
 * @param {string[]} whitelist - Array of allowed IP addresses
 * @returns {boolean} True if IP is allowed
 *
 * @example
 * ```typescript
 * const isAllowed = isIpWhitelisted('192.168.1.100', ['192.168.1.100', '10.0.0.1']);
 * // Returns: true
 * ```
 */
export declare function isIpWhitelisted(ip: string, whitelist: string[]): boolean;
/**
 * Creates middleware that combines multiple middleware functions.
 *
 * @param {Array<(req: Request, res: Response, next: NextFunction) => void>} middlewares - Array of middleware functions
 * @returns {(req: Request, res: Response, next: NextFunction) => void} Combined middleware
 *
 * @example
 * ```typescript
 * const combinedMiddleware = combineMiddlewares([
 *   createLoggingMiddleware(),
 *   createSecurityMiddleware(),
 *   createRequestTrackingMiddleware()
 * ]);
 * app.use(combinedMiddleware);
 * ```
 */
export declare function combineMiddlewares(middlewares: Array<(req: Request, res: Response, next: NextFunction) => void>): (req: Request, res: Response, next: NextFunction) => void;
declare const _default: {
    createLoggingMiddleware: typeof createLoggingMiddleware;
    createCorsMiddleware: typeof createCorsMiddleware;
    createRateLimitMiddleware: typeof createRateLimitMiddleware;
    createCompressionMiddleware: typeof createCompressionMiddleware;
    createSecurityMiddleware: typeof createSecurityMiddleware;
    createValidationMiddleware: typeof createValidationMiddleware;
    createSanitizationMiddleware: typeof createSanitizationMiddleware;
    createXssProtectionMiddleware: typeof createXssProtectionMiddleware;
    createCookieParserMiddleware: typeof createCookieParserMiddleware;
    setSecureCookie: typeof setSecureCookie;
    clearCookie: typeof clearCookie;
    createJwtAuthMiddleware: typeof createJwtAuthMiddleware;
    createApiKeyAuthMiddleware: typeof createApiKeyAuthMiddleware;
    createRoleAuthMiddleware: typeof createRoleAuthMiddleware;
    createRequestTrackingMiddleware: typeof createRequestTrackingMiddleware;
    createAuditLogMiddleware: typeof createAuditLogMiddleware;
    createPerformanceMonitoringMiddleware: typeof createPerformanceMonitoringMiddleware;
    createJsonBodyParser: typeof createJsonBodyParser;
    createUrlEncodedParser: typeof createUrlEncodedParser;
    sanitizeObject: typeof sanitizeObject;
    applySanitizationRule: typeof applySanitizationRule;
    sanitizePHIData: typeof sanitizePHIData;
    unsignCookie: typeof unsignCookie;
    validateOrigin: typeof validateOrigin;
    generateRequestId: typeof generateRequestId;
    isIpWhitelisted: typeof isIpWhitelisted;
    combineMiddlewares: typeof combineMiddlewares;
};
export default _default;
//# sourceMappingURL=nestjs-middleware-kit.d.ts.map