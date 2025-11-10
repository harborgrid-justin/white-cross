/**
 * LOC: HTTPREQ789
 * File: /reuse/http-request-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v11.1.8)
 *   - @nestjs/platform-express (v11.1.8)
 *   - express (v4.18.2)
 *   - cookie-parser (v1.4.6)
 *   - multer (v1.4.5-lts.1)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS controllers and middleware
 *   - HTTP interceptors and guards
 *   - Request/response handlers
 */
/**
 * File: /reuse/http-request-kit.ts
 * Locator: WC-UTL-HTTPREQ-001
 * Purpose: Comprehensive HTTP Request Handling Utilities - request parsing, headers, cookies, query params, body transformation, file uploads
 *
 * Upstream: @nestjs/common, express, cookie-parser, multer, class-transformer, class-validator
 * Downstream: ../backend/*, NestJS controllers, middleware, interceptors, guards
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Express 4.x
 * Exports: 45 utility functions for HTTP request handling, parsing, validation, transformation, file uploads, content negotiation
 *
 * LLM Context: Production-grade HTTP request utilities for NestJS applications.
 * Provides comprehensive request parsing, header manipulation, cookie management, query parameter parsing,
 * body transformation, file upload handling, multipart forms, content negotiation, request validation,
 * response formatting, HTTP client wrappers, request logging, rate limiting, CORS handling, and security utilities.
 */
import { Request, Response } from 'express';
import { NestInterceptor } from '@nestjs/common';
/**
 * Parsed request information
 */
export interface ParsedRequest {
    method: string;
    path: string;
    query: Record<string, any>;
    params: Record<string, any>;
    body: any;
    headers: Record<string, string>;
    cookies: Record<string, string>;
    ip: string;
    userAgent: string;
    protocol: string;
    hostname: string;
    timestamp: Date;
}
/**
 * Header configuration
 */
export interface HeaderConfig {
    name: string;
    value: string;
    override?: boolean;
}
/**
 * Cookie options
 */
export interface CookieOptions {
    maxAge?: number;
    expires?: Date;
    httpOnly?: boolean;
    secure?: boolean;
    domain?: string;
    path?: string;
    sameSite?: 'strict' | 'lax' | 'none';
    signed?: boolean;
}
/**
 * Query parameter configuration
 */
export interface QueryParamConfig {
    name: string;
    type: 'string' | 'number' | 'boolean' | 'array';
    required?: boolean;
    default?: any;
    validate?: (value: any) => boolean;
}
/**
 * Body transformation options
 */
export interface BodyTransformOptions {
    removeNullValues?: boolean;
    removeEmptyStrings?: boolean;
    trimStrings?: boolean;
    convertDates?: boolean;
    sanitizeHtml?: boolean;
}
/**
 * File filter function type
 */
export type FileFilterFunction = (req: Request, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) => void;
/**
 * Multipart field configuration
 */
export interface MultipartField {
    name: string;
    maxCount?: number;
}
/**
 * Content negotiation result
 */
export interface ContentNegotiation {
    type: string;
    charset?: string;
    language?: string;
    encoding?: string;
}
/**
 * Request validation rules
 */
export interface ValidationRule {
    field: string;
    type: 'string' | 'number' | 'boolean' | 'email' | 'url' | 'uuid' | 'date' | 'array' | 'object';
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: RegExp;
    custom?: (value: any) => boolean | string;
}
/**
 * HTTP client configuration
 */
export interface HttpClientConfig {
    baseURL: string;
    timeout?: number;
    headers?: Record<string, string>;
    retries?: number;
    retryDelay?: number;
}
/**
 * Request logging options
 */
export interface RequestLogOptions {
    includeHeaders?: boolean;
    includeBody?: boolean;
    includeCookies?: boolean;
    maskFields?: string[];
    logLevel?: 'debug' | 'info' | 'warn' | 'error';
}
/**
 * 1. Parses complete request information into structured object.
 *
 * @param {Request} req - Express request object
 * @returns {ParsedRequest} Parsed request information
 *
 * @example
 * ```typescript
 * @Post('events')
 * async createEvent(@Req() req: Request) {
 *   const parsed = parseRequest(req);
 *   await this.auditService.log(parsed);
 *   return this.eventsService.create(req.body);
 * }
 * ```
 */
export declare function parseRequest(req: Request): ParsedRequest;
/**
 * 2. Extracts and validates specific query parameters with type conversion.
 *
 * @param {Request} req - Express request object
 * @param {QueryParamConfig[]} configs - Query parameter configurations
 * @returns {Record<string, any>} Validated query parameters
 *
 * @example
 * ```typescript
 * const params = extractQueryParams(req, [
 *   { name: 'page', type: 'number', default: 1 },
 *   { name: 'limit', type: 'number', default: 10 },
 *   { name: 'search', type: 'string', required: false }
 * ]);
 * ```
 */
export declare function extractQueryParams(req: Request, configs: QueryParamConfig[]): Record<string, any>;
/**
 * 3. Parses URL path parameters with optional type conversion.
 *
 * @param {Request} req - Express request object
 * @param {string[]} paramNames - Parameter names to extract
 * @returns {Record<string, string>} Path parameters
 *
 * @example
 * ```typescript
 * // Route: /users/:userId/posts/:postId
 * const params = parsePathParams(req, ['userId', 'postId']);
 * // Returns: { userId: '123', postId: '456' }
 * ```
 */
export declare function parsePathParams(req: Request, paramNames: string[]): Record<string, string>;
/**
 * 4. Extracts client IP address considering proxies and load balancers.
 *
 * @param {Request} req - Express request object
 * @returns {string} Client IP address
 *
 * @example
 * ```typescript
 * const clientIp = extractClientIp(req);
 * await this.securityService.checkIpBlacklist(clientIp);
 * ```
 */
export declare function extractClientIp(req: Request): string;
/**
 * 5. Parses content type from request header.
 *
 * @param {Request} req - Express request object
 * @returns {{ type: string; charset?: string }} Parsed content type
 *
 * @example
 * ```typescript
 * const contentType = parseContentType(req);
 * if (contentType.type !== 'application/json') {
 *   throw new BadRequestException('JSON required');
 * }
 * ```
 */
export declare function parseContentType(req: Request): {
    type: string;
    charset?: string;
};
/**
 * 6. Parses Accept header for content negotiation.
 *
 * @param {Request} req - Express request object
 * @returns {string[]} Accepted content types in priority order
 *
 * @example
 * ```typescript
 * const acceptedTypes = parseAcceptHeader(req);
 * const responseType = acceptedTypes[0] || 'application/json';
 * ```
 */
export declare function parseAcceptHeader(req: Request): string[];
/**
 * 7. Extracts request body size in bytes.
 *
 * @param {Request} req - Express request object
 * @returns {number} Body size in bytes
 *
 * @example
 * ```typescript
 * const bodySize = getRequestBodySize(req);
 * if (bodySize > MAX_BODY_SIZE) {
 *   throw new PayloadTooLargeException();
 * }
 * ```
 */
export declare function getRequestBodySize(req: Request): number;
/**
 * 8. Checks if request is HTTPS/secure.
 *
 * @param {Request} req - Express request object
 * @returns {boolean} True if request is secure
 *
 * @example
 * ```typescript
 * if (!isSecureRequest(req) && process.env.NODE_ENV === 'production') {
 *   throw new ForbiddenException('HTTPS required');
 * }
 * ```
 */
export declare function isSecureRequest(req: Request): boolean;
/**
 * 9. Sets custom header on response.
 *
 * @param {Response} res - Express response object
 * @param {string} name - Header name
 * @param {string} value - Header value
 * @param {boolean} override - Whether to override existing header
 *
 * @example
 * ```typescript
 * setResponseHeader(res, 'X-Request-ID', requestId);
 * setResponseHeader(res, 'X-RateLimit-Remaining', '99');
 * ```
 */
export declare function setResponseHeader(res: Response, name: string, value: string, override?: boolean): void;
/**
 * 10. Sets multiple headers at once.
 *
 * @param {Response} res - Express response object
 * @param {Record<string, string>} headers - Headers to set
 *
 * @example
 * ```typescript
 * setMultipleHeaders(res, {
 *   'X-Request-ID': requestId,
 *   'X-Response-Time': `${duration}ms`,
 *   'X-API-Version': '1.0'
 * });
 * ```
 */
export declare function setMultipleHeaders(res: Response, headers: Record<string, string>): void;
/**
 * 11. Extracts specific header value from request.
 *
 * @param {Request} req - Express request object
 * @param {string} name - Header name (case-insensitive)
 * @param {string} defaultValue - Default value if header not found
 * @returns {string} Header value
 *
 * @example
 * ```typescript
 * const apiKey = getHeader(req, 'X-API-Key');
 * const userAgent = getHeader(req, 'User-Agent', 'unknown');
 * ```
 */
export declare function getHeader(req: Request, name: string, defaultValue?: string): string;
/**
 * 12. Sets CORS headers on response.
 *
 * @param {Response} res - Express response object
 * @param {string | string[]} origins - Allowed origins
 * @param {string[]} methods - Allowed HTTP methods
 * @param {string[]} headers - Allowed headers
 *
 * @example
 * ```typescript
 * setCorsHeaders(res, '*', ['GET', 'POST', 'PUT', 'DELETE'], ['Content-Type', 'Authorization']);
 * ```
 */
export declare function setCorsHeaders(res: Response, origins: string | string[], methods?: string[], headers?: string[]): void;
/**
 * 13. Sets cache control headers.
 *
 * @param {Response} res - Express response object
 * @param {number} maxAge - Max age in seconds
 * @param {boolean} isPrivate - Whether cache is private
 *
 * @example
 * ```typescript
 * setCacheHeaders(res, 3600, false); // Public cache, 1 hour
 * setCacheHeaders(res, 0, true); // No cache
 * ```
 */
export declare function setCacheHeaders(res: Response, maxAge: number, isPrivate?: boolean): void;
/**
 * 14. Sets security headers (HSTS, CSP, etc.).
 *
 * @param {Response} res - Express response object
 *
 * @example
 * ```typescript
 * setSecurityHeaders(res);
 * ```
 */
export declare function setSecurityHeaders(res: Response): void;
/**
 * 15. Removes sensitive headers from request logging.
 *
 * @param {Record<string, any>} headers - Request headers
 * @param {string[]} sensitiveHeaders - Headers to mask
 * @returns {Record<string, any>} Sanitized headers
 *
 * @example
 * ```typescript
 * const safe = sanitizeHeaders(req.headers, ['authorization', 'cookie', 'x-api-key']);
 * logger.log('Request headers:', safe);
 * ```
 */
export declare function sanitizeHeaders(headers: Record<string, any>, sensitiveHeaders?: string[]): Record<string, any>;
/**
 * 16. Sets cookie with comprehensive options.
 *
 * @param {Response} res - Express response object
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {CookieOptions} options - Cookie options
 *
 * @example
 * ```typescript
 * setCookie(res, 'session_id', sessionId, {
 *   httpOnly: true,
 *   secure: true,
 *   maxAge: 3600000,
 *   sameSite: 'strict'
 * });
 * ```
 */
export declare function setCookie(res: Response, name: string, value: string, options?: CookieOptions): void;
/**
 * 17. Gets cookie value from request.
 *
 * @param {Request} req - Express request object
 * @param {string} name - Cookie name
 * @param {string} defaultValue - Default value if cookie not found
 * @returns {string} Cookie value
 *
 * @example
 * ```typescript
 * const sessionId = getCookie(req, 'session_id');
 * const theme = getCookie(req, 'theme', 'light');
 * ```
 */
export declare function getCookie(req: Request, name: string, defaultValue?: string): string;
/**
 * 18. Clears cookie by setting expiration to past.
 *
 * @param {Response} res - Express response object
 * @param {string} name - Cookie name
 * @param {string} path - Cookie path
 *
 * @example
 * ```typescript
 * clearCookie(res, 'session_id');
 * ```
 */
export declare function clearCookie(res: Response, name: string, path?: string): void;
/**
 * 19. Sets multiple cookies at once.
 *
 * @param {Response} res - Express response object
 * @param {Record<string, string>} cookies - Cookies to set
 * @param {CookieOptions} options - Common options for all cookies
 *
 * @example
 * ```typescript
 * setMultipleCookies(res, {
 *   session_id: sessionId,
 *   user_id: userId,
 *   theme: 'dark'
 * }, { httpOnly: true, secure: true });
 * ```
 */
export declare function setMultipleCookies(res: Response, cookies: Record<string, string>, options?: CookieOptions): void;
/**
 * 20. Parses signed cookie.
 *
 * @param {Request} req - Express request object
 * @param {string} name - Cookie name
 * @returns {string | undefined} Unsigned cookie value
 *
 * @example
 * ```typescript
 * const userId = getSignedCookie(req, 'user_id');
 * if (!userId) {
 *   throw new UnauthorizedException('Invalid session');
 * }
 * ```
 */
export declare function getSignedCookie(req: Request, name: string): string | undefined;
/**
 * 21. Transforms request body with various cleanup options.
 *
 * @param {any} body - Request body
 * @param {BodyTransformOptions} options - Transformation options
 * @returns {any} Transformed body
 *
 * @example
 * ```typescript
 * const cleaned = transformRequestBody(req.body, {
 *   removeNullValues: true,
 *   trimStrings: true,
 *   sanitizeHtml: true
 * });
 * ```
 */
export declare function transformRequestBody(body: any, options?: BodyTransformOptions): any;
/**
 * 22. Flattens nested request body to single level.
 *
 * @param {any} body - Nested request body
 * @param {string} separator - Key separator for flattened keys
 * @returns {Record<string, any>} Flattened body
 *
 * @example
 * ```typescript
 * const flat = flattenRequestBody({
 *   user: { name: 'John', address: { city: 'NYC' } }
 * });
 * // Returns: { 'user.name': 'John', 'user.address.city': 'NYC' }
 * ```
 */
export declare function flattenRequestBody(body: any, separator?: string, prefix?: string): Record<string, any>;
/**
 * 23. Picks specific fields from request body.
 *
 * @param {any} body - Request body
 * @param {string[]} fields - Fields to pick
 * @returns {any} Body with only specified fields
 *
 * @example
 * ```typescript
 * const userFields = pickBodyFields(req.body, ['name', 'email', 'phone']);
 * ```
 */
export declare function pickBodyFields(body: any, fields: string[]): any;
/**
 * 24. Omits specific fields from request body.
 *
 * @param {any} body - Request body
 * @param {string[]} fields - Fields to omit
 * @returns {any} Body without specified fields
 *
 * @example
 * ```typescript
 * const safe = omitBodyFields(req.body, ['password', 'ssn', 'creditCard']);
 * ```
 */
export declare function omitBodyFields(body: any, fields: string[]): any;
/**
 * 25. Merges request body with default values.
 *
 * @param {any} body - Request body
 * @param {any} defaults - Default values
 * @returns {any} Merged body
 *
 * @example
 * ```typescript
 * const merged = mergeWithDefaults(req.body, {
 *   status: 'active',
 *   role: 'user',
 *   notifications: true
 * });
 * ```
 */
export declare function mergeWithDefaults(body: any, defaults: any): any;
/**
 * 26. Converts string dates in body to Date objects.
 *
 * @param {any} body - Request body
 * @param {string[]} dateFields - Fields that contain dates
 * @returns {any} Body with converted dates
 *
 * @example
 * ```typescript
 * const converted = convertDatesInBody(req.body, ['birthDate', 'appointmentDate']);
 * ```
 */
export declare function convertDatesInBody(body: any, dateFields: string[]): any;
/**
 * 27. Creates file filter for allowed file types.
 *
 * @param {string[]} allowedMimeTypes - Allowed MIME types
 * @returns {FileFilterFunction} File filter function
 *
 * @example
 * ```typescript
 * const imageFilter = createFileFilter(['image/jpeg', 'image/png', 'image/gif']);
 * ```
 */
export declare function createFileFilter(allowedMimeTypes: string[]): FileFilterFunction;
/**
 * 28. Creates file filter for maximum file size.
 *
 * @param {number} maxSize - Maximum file size in bytes
 * @returns {FileFilterFunction} File filter function
 *
 * @example
 * ```typescript
 * const sizeFilter = createFileSizeFilter(5 * 1024 * 1024); // 5MB
 * ```
 */
export declare function createFileSizeFilter(maxSize: number): FileFilterFunction;
/**
 * 29. Extracts file extension from filename.
 *
 * @param {string} filename - Original filename
 * @returns {string} File extension (with dot)
 *
 * @example
 * ```typescript
 * const ext = getFileExtension('document.pdf'); // Returns: '.pdf'
 * ```
 */
export declare function getFileExtension(filename: string): string;
/**
 * 30. Generates unique filename for uploaded file.
 *
 * @param {string} originalName - Original filename
 * @param {string} prefix - Optional prefix
 * @returns {string} Unique filename
 *
 * @example
 * ```typescript
 * const filename = generateUniqueFilename('photo.jpg', 'patient');
 * // Returns: 'patient-1234567890123-photo.jpg'
 * ```
 */
export declare function generateUniqueFilename(originalName: string, prefix?: string): string;
/**
 * 31. Validates uploaded file metadata.
 *
 * @param {Express.Multer.File} file - Uploaded file
 * @param {number} maxSize - Maximum size in bytes
 * @param {string[]} allowedTypes - Allowed MIME types
 * @throws {Error} If validation fails
 *
 * @example
 * ```typescript
 * validateUploadedFile(file, 10 * 1024 * 1024, ['application/pdf', 'image/jpeg']);
 * ```
 */
export declare function validateUploadedFile(file: Express.Multer.File, maxSize: number, allowedTypes: string[]): void;
/**
 * 32. Negotiates content type based on Accept header.
 *
 * @param {Request} req - Express request object
 * @param {string[]} supportedTypes - Supported content types
 * @returns {string | null} Selected content type or null
 *
 * @example
 * ```typescript
 * const contentType = negotiateContentType(req, ['application/json', 'application/xml']);
 * if (!contentType) {
 *   throw new NotAcceptableException('Unsupported content type');
 * }
 * ```
 */
export declare function negotiateContentType(req: Request, supportedTypes: string[]): string | null;
/**
 * 33. Negotiates language based on Accept-Language header.
 *
 * @param {Request} req - Express request object
 * @param {string[]} supportedLanguages - Supported languages
 * @returns {string} Selected language
 *
 * @example
 * ```typescript
 * const lang = negotiateLanguage(req, ['en', 'es', 'fr']);
 * const response = await this.i18n.translate(message, lang);
 * ```
 */
export declare function negotiateLanguage(req: Request, supportedLanguages: string[]): string;
/**
 * 34. Checks if request accepts specific content type.
 *
 * @param {Request} req - Express request object
 * @param {string} contentType - Content type to check
 * @returns {boolean} True if content type is accepted
 *
 * @example
 * ```typescript
 * if (!acceptsContentType(req, 'application/json')) {
 *   throw new NotAcceptableException('JSON responses only');
 * }
 * ```
 */
export declare function acceptsContentType(req: Request, contentType: string): boolean;
/**
 * 35. Gets preferred charset from Accept-Charset header.
 *
 * @param {Request} req - Express request object
 * @param {string[]} supportedCharsets - Supported charsets
 * @returns {string} Selected charset
 *
 * @example
 * ```typescript
 * const charset = getPreferredCharset(req, ['utf-8', 'iso-8859-1']);
 * ```
 */
export declare function getPreferredCharset(req: Request, supportedCharsets?: string[]): string;
/**
 * 36. Validates request body against rules.
 *
 * @param {any} body - Request body
 * @param {ValidationRule[]} rules - Validation rules
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const result = validateRequestBody(req.body, [
 *   { field: 'email', type: 'email', required: true },
 *   { field: 'age', type: 'number', min: 18, max: 120 }
 * ]);
 * if (!result.valid) {
 *   throw new BadRequestException(result.errors);
 * }
 * ```
 */
export declare function validateRequestBody(body: any, rules: ValidationRule[]): {
    valid: boolean;
    errors: string[];
};
/**
 * 37. Validates email format.
 *
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 *
 * @example
 * ```typescript
 * if (!isValidEmail(req.body.email)) {
 *   throw new BadRequestException('Invalid email format');
 * }
 * ```
 */
export declare function isValidEmail(email: string): boolean;
/**
 * 38. Validates URL format.
 *
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid URL
 *
 * @example
 * ```typescript
 * if (!isValidUrl(req.body.website)) {
 *   throw new BadRequestException('Invalid URL format');
 * }
 * ```
 */
export declare function isValidUrl(url: string): boolean;
/**
 * 39. Validates UUID format.
 *
 * @param {string} uuid - UUID to validate
 * @returns {boolean} True if valid UUID
 *
 * @example
 * ```typescript
 * if (!isValidUuid(req.params.id)) {
 *   throw new BadRequestException('Invalid UUID format');
 * }
 * ```
 */
export declare function isValidUuid(uuid: string): boolean;
/**
 * 40. Validates phone number format (US format).
 *
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid phone number
 *
 * @example
 * ```typescript
 * if (!isValidPhoneNumber(req.body.phone)) {
 *   throw new BadRequestException('Invalid phone number format');
 * }
 * ```
 */
export declare function isValidPhoneNumber(phone: string): boolean;
/**
 * 41. Creates request logging interceptor.
 *
 * @param {RequestLogOptions} options - Logging options
 * @returns {NestInterceptor} Logging interceptor
 *
 * @example
 * ```typescript
 * @UseInterceptors(createRequestLogger({ includeHeaders: true, maskFields: ['password'] }))
 * @Post('users')
 * async createUser(@Body() dto: CreateUserDto) {
 *   return this.usersService.create(dto);
 * }
 * ```
 */
export declare function createRequestLogger(options?: RequestLogOptions): NestInterceptor;
/**
 * 42. Masks sensitive fields in object for logging.
 *
 * @param {any} obj - Object to mask
 * @param {string[]} sensitiveFields - Fields to mask
 * @returns {any} Masked object
 *
 * @example
 * ```typescript
 * const safe = maskSensitiveFields(req.body, ['password', 'ssn', 'creditCard']);
 * logger.info('User data:', safe);
 * ```
 */
export declare function maskSensitiveFields(obj: any, sensitiveFields: string[]): any;
/**
 * 43. Generates request correlation ID for distributed tracing.
 *
 * @param {Request} req - Express request object
 * @returns {string} Correlation ID
 *
 * @example
 * ```typescript
 * const correlationId = generateCorrelationId(req);
 * res.setHeader('X-Correlation-ID', correlationId);
 * ```
 */
export declare function generateCorrelationId(req: Request): string;
/**
 * 44. Measures request processing time.
 *
 * @param {Request} req - Express request object
 * @returns {{ start: () => void; end: () => number }} Timer functions
 *
 * @example
 * ```typescript
 * const timer = createRequestTimer(req);
 * timer.start();
 * // ... process request
 * const duration = timer.end();
 * console.log(`Request took ${duration}ms`);
 * ```
 */
export declare function createRequestTimer(req: Request): {
    start: () => void;
    end: () => number;
};
/**
 * 45. Creates request summary for logging and monitoring.
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {number} duration - Request duration in ms
 * @returns {object} Request summary
 *
 * @example
 * ```typescript
 * const summary = createRequestSummary(req, res, 145);
 * logger.info('Request completed:', summary);
 * ```
 */
export declare function createRequestSummary(req: Request, res: Response, duration: number): {
    method: string;
    path: string;
    statusCode: number;
    duration: number;
    ip: string;
    userAgent: string;
    timestamp: string;
};
declare const _default: {
    parseRequest: typeof parseRequest;
    extractQueryParams: typeof extractQueryParams;
    parsePathParams: typeof parsePathParams;
    extractClientIp: typeof extractClientIp;
    parseContentType: typeof parseContentType;
    parseAcceptHeader: typeof parseAcceptHeader;
    getRequestBodySize: typeof getRequestBodySize;
    isSecureRequest: typeof isSecureRequest;
    setResponseHeader: typeof setResponseHeader;
    setMultipleHeaders: typeof setMultipleHeaders;
    getHeader: typeof getHeader;
    setCorsHeaders: typeof setCorsHeaders;
    setCacheHeaders: typeof setCacheHeaders;
    setSecurityHeaders: typeof setSecurityHeaders;
    sanitizeHeaders: typeof sanitizeHeaders;
    setCookie: typeof setCookie;
    getCookie: typeof getCookie;
    clearCookie: typeof clearCookie;
    setMultipleCookies: typeof setMultipleCookies;
    getSignedCookie: typeof getSignedCookie;
    transformRequestBody: typeof transformRequestBody;
    flattenRequestBody: typeof flattenRequestBody;
    pickBodyFields: typeof pickBodyFields;
    omitBodyFields: typeof omitBodyFields;
    mergeWithDefaults: typeof mergeWithDefaults;
    convertDatesInBody: typeof convertDatesInBody;
    createFileFilter: typeof createFileFilter;
    createFileSizeFilter: typeof createFileSizeFilter;
    getFileExtension: typeof getFileExtension;
    generateUniqueFilename: typeof generateUniqueFilename;
    validateUploadedFile: typeof validateUploadedFile;
    negotiateContentType: typeof negotiateContentType;
    negotiateLanguage: typeof negotiateLanguage;
    acceptsContentType: typeof acceptsContentType;
    getPreferredCharset: typeof getPreferredCharset;
    validateRequestBody: typeof validateRequestBody;
    isValidEmail: typeof isValidEmail;
    isValidUrl: typeof isValidUrl;
    isValidUuid: typeof isValidUuid;
    isValidPhoneNumber: typeof isValidPhoneNumber;
    createRequestLogger: typeof createRequestLogger;
    maskSensitiveFields: typeof maskSensitiveFields;
    generateCorrelationId: typeof generateCorrelationId;
    createRequestTimer: typeof createRequestTimer;
    createRequestSummary: typeof createRequestSummary;
};
export default _default;
//# sourceMappingURL=http-request-kit.d.ts.map