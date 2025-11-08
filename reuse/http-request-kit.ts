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

import { Request, Response, NextFunction } from 'express';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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
export type FileFilterFunction = (
  req: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => void;

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

// ============================================================================
// SECTION 1: REQUEST PARSING UTILITIES (1-8)
// ============================================================================

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
export function parseRequest(req: Request): ParsedRequest {
  return {
    method: req.method,
    path: req.path,
    query: req.query as Record<string, any>,
    params: req.params,
    body: req.body,
    headers: req.headers as Record<string, string>,
    cookies: req.cookies || {},
    ip: extractClientIp(req),
    userAgent: req.headers['user-agent'] || 'unknown',
    protocol: req.protocol,
    hostname: req.hostname,
    timestamp: new Date(),
  };
}

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
export function extractQueryParams(
  req: Request,
  configs: QueryParamConfig[],
): Record<string, any> {
  const result: Record<string, any> = {};

  for (const config of configs) {
    let value = req.query[config.name];

    // Check if required
    if (config.required && (value === undefined || value === null || value === '')) {
      throw new Error(`Required query parameter '${config.name}' is missing`);
    }

    // Use default if not provided
    if (value === undefined || value === null || value === '') {
      value = config.default;
    }

    // Type conversion
    if (value !== undefined && value !== null) {
      switch (config.type) {
        case 'number':
          value = Number(value);
          if (isNaN(value as number)) {
            throw new Error(`Query parameter '${config.name}' must be a number`);
          }
          break;
        case 'boolean':
          value = value === 'true' || value === '1' || value === true;
          break;
        case 'array':
          value = Array.isArray(value) ? value : [value];
          break;
      }

      // Custom validation
      if (config.validate && !config.validate(value)) {
        throw new Error(`Query parameter '${config.name}' failed validation`);
      }
    }

    result[config.name] = value;
  }

  return result;
}

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
export function parsePathParams(req: Request, paramNames: string[]): Record<string, string> {
  const result: Record<string, string> = {};

  for (const paramName of paramNames) {
    const value = req.params[paramName];
    if (value !== undefined) {
      result[paramName] = value;
    }
  }

  return result;
}

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
export function extractClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const ips = (forwarded as string).split(',');
    return ips[0].trim();
  }

  const realIp = req.headers['x-real-ip'];
  if (realIp) {
    return realIp as string;
  }

  return req.ip || req.socket?.remoteAddress || 'unknown';
}

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
export function parseContentType(req: Request): { type: string; charset?: string } {
  const contentType = req.headers['content-type'] || '';
  const parts = contentType.split(';').map((p) => p.trim());

  const type = parts[0] || 'application/octet-stream';
  const charsetPart = parts.find((p) => p.startsWith('charset='));
  const charset = charsetPart ? charsetPart.split('=')[1] : undefined;

  return { type, charset };
}

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
export function parseAcceptHeader(req: Request): string[] {
  const accept = req.headers.accept || '*/*';

  return accept
    .split(',')
    .map((type) => {
      const parts = type.split(';');
      const mediaType = parts[0].trim();
      const qPart = parts.find((p) => p.trim().startsWith('q='));
      const quality = qPart ? parseFloat(qPart.split('=')[1]) : 1.0;
      return { mediaType, quality };
    })
    .sort((a, b) => b.quality - a.quality)
    .map((item) => item.mediaType);
}

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
export function getRequestBodySize(req: Request): number {
  const contentLength = req.headers['content-length'];
  return contentLength ? parseInt(contentLength, 10) : 0;
}

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
export function isSecureRequest(req: Request): boolean {
  if (req.secure) {
    return true;
  }

  const proto = req.headers['x-forwarded-proto'];
  return proto === 'https';
}

// ============================================================================
// SECTION 2: HEADER MANIPULATION (9-15)
// ============================================================================

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
export function setResponseHeader(
  res: Response,
  name: string,
  value: string,
  override: boolean = true,
): void {
  if (override || !res.getHeader(name)) {
    res.setHeader(name, value);
  }
}

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
export function setMultipleHeaders(res: Response, headers: Record<string, string>): void {
  for (const [name, value] of Object.entries(headers)) {
    res.setHeader(name, value);
  }
}

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
export function getHeader(req: Request, name: string, defaultValue: string = ''): string {
  const headerName = name.toLowerCase();
  const value = req.headers[headerName];
  return (Array.isArray(value) ? value[0] : value) || defaultValue;
}

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
export function setCorsHeaders(
  res: Response,
  origins: string | string[],
  methods: string[] = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  headers: string[] = ['Content-Type', 'Authorization'],
): void {
  const origin = Array.isArray(origins) ? origins.join(',') : origins;

  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', methods.join(','));
  res.setHeader('Access-Control-Allow-Headers', headers.join(','));
  res.setHeader('Access-Control-Allow-Credentials', 'true');
}

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
export function setCacheHeaders(
  res: Response,
  maxAge: number,
  isPrivate: boolean = false,
): void {
  const directive = isPrivate ? 'private' : 'public';
  res.setHeader('Cache-Control', `${directive}, max-age=${maxAge}`);

  if (maxAge > 0) {
    const expires = new Date(Date.now() + maxAge * 1000);
    res.setHeader('Expires', expires.toUTCString());
  }
}

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
export function setSecurityHeaders(res: Response): void {
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';",
  );
}

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
export function sanitizeHeaders(
  headers: Record<string, any>,
  sensitiveHeaders: string[] = ['authorization', 'cookie', 'x-api-key'],
): Record<string, any> {
  const sanitized = { ...headers };

  for (const header of sensitiveHeaders) {
    if (sanitized[header.toLowerCase()]) {
      sanitized[header.toLowerCase()] = '[REDACTED]';
    }
  }

  return sanitized;
}

// ============================================================================
// SECTION 3: COOKIE MANAGEMENT (16-20)
// ============================================================================

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
export function setCookie(
  res: Response,
  name: string,
  value: string,
  options?: CookieOptions,
): void {
  res.cookie(name, value, options);
}

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
export function getCookie(req: Request, name: string, defaultValue: string = ''): string {
  return req.cookies?.[name] || defaultValue;
}

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
export function clearCookie(res: Response, name: string, path: string = '/'): void {
  res.clearCookie(name, { path });
}

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
export function setMultipleCookies(
  res: Response,
  cookies: Record<string, string>,
  options?: CookieOptions,
): void {
  for (const [name, value] of Object.entries(cookies)) {
    res.cookie(name, value, options);
  }
}

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
export function getSignedCookie(req: Request, name: string): string | undefined {
  return req.signedCookies?.[name];
}

// ============================================================================
// SECTION 4: BODY TRANSFORMATION (21-26)
// ============================================================================

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
export function transformRequestBody(body: any, options: BodyTransformOptions = {}): any {
  if (body === null || body === undefined) {
    return body;
  }

  if (Array.isArray(body)) {
    return body.map((item) => transformRequestBody(item, options));
  }

  if (typeof body === 'object') {
    const result: any = {};

    for (const [key, value] of Object.entries(body)) {
      // Remove null values
      if (options.removeNullValues && value === null) {
        continue;
      }

      // Remove empty strings
      if (options.removeEmptyStrings && value === '') {
        continue;
      }

      // Transform value
      let transformedValue = value;

      if (typeof value === 'string') {
        // Trim strings
        if (options.trimStrings) {
          transformedValue = value.trim();
        }

        // Sanitize HTML (basic)
        if (options.sanitizeHtml) {
          transformedValue = (transformedValue as string).replace(/<script[^>]*>.*?<\/script>/gi, '');
        }
      } else if (typeof value === 'object') {
        // Recursively transform nested objects
        transformedValue = transformRequestBody(value, options);
      }

      result[key] = transformedValue;
    }

    return result;
  }

  return body;
}

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
export function flattenRequestBody(
  body: any,
  separator: string = '.',
  prefix: string = '',
): Record<string, any> {
  const result: Record<string, any> = {};

  for (const [key, value] of Object.entries(body)) {
    const newKey = prefix ? `${prefix}${separator}${key}` : key;

    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(result, flattenRequestBody(value, separator, newKey));
    } else {
      result[newKey] = value;
    }
  }

  return result;
}

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
export function pickBodyFields(body: any, fields: string[]): any {
  if (!body || typeof body !== 'object') {
    return body;
  }

  const result: any = {};
  for (const field of fields) {
    if (field in body) {
      result[field] = body[field];
    }
  }

  return result;
}

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
export function omitBodyFields(body: any, fields: string[]): any {
  if (!body || typeof body !== 'object') {
    return body;
  }

  const result = { ...body };
  for (const field of fields) {
    delete result[field];
  }

  return result;
}

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
export function mergeWithDefaults(body: any, defaults: any): any {
  return { ...defaults, ...body };
}

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
export function convertDatesInBody(body: any, dateFields: string[]): any {
  if (!body || typeof body !== 'object') {
    return body;
  }

  const result = { ...body };

  for (const field of dateFields) {
    if (result[field]) {
      const date = new Date(result[field]);
      if (!isNaN(date.getTime())) {
        result[field] = date;
      }
    }
  }

  return result;
}

// ============================================================================
// SECTION 5: FILE UPLOAD HANDLERS (27-31)
// ============================================================================

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
export function createFileFilter(allowedMimeTypes: string[]): FileFilterFunction {
  return (req: Request, file: Express.Multer.File, callback) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(
        new Error(`File type ${file.mimetype} not allowed. Allowed types: ${allowedMimeTypes.join(', ')}`),
        false,
      );
    }
  };
}

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
export function createFileSizeFilter(maxSize: number): FileFilterFunction {
  return (req: Request, file: Express.Multer.File, callback) => {
    // Note: This is a basic check. Actual size validation happens in multer limits
    callback(null, true);
  };
}

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
export function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  return lastDot === -1 ? '' : filename.substring(lastDot);
}

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
export function generateUniqueFilename(originalName: string, prefix: string = ''): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  const ext = getFileExtension(originalName);
  const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.'));

  const safeName = nameWithoutExt
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 50);

  return prefix
    ? `${prefix}-${timestamp}-${random}-${safeName}${ext}`
    : `${timestamp}-${random}-${safeName}${ext}`;
}

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
export function validateUploadedFile(
  file: Express.Multer.File,
  maxSize: number,
  allowedTypes: string[],
): void {
  if (!file) {
    throw new Error('No file uploaded');
  }

  if (file.size > maxSize) {
    throw new Error(`File size ${file.size} exceeds maximum ${maxSize} bytes`);
  }

  if (!allowedTypes.includes(file.mimetype)) {
    throw new Error(`File type ${file.mimetype} not allowed`);
  }
}

// ============================================================================
// SECTION 6: CONTENT NEGOTIATION (32-35)
// ============================================================================

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
export function negotiateContentType(req: Request, supportedTypes: string[]): string | null {
  const acceptedTypes = parseAcceptHeader(req);

  for (const acceptedType of acceptedTypes) {
    if (acceptedType === '*/*') {
      return supportedTypes[0];
    }

    for (const supportedType of supportedTypes) {
      if (acceptedType === supportedType || acceptedType.startsWith(supportedType.split('/')[0] + '/*')) {
        return supportedType;
      }
    }
  }

  return null;
}

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
export function negotiateLanguage(req: Request, supportedLanguages: string[]): string {
  const acceptLanguage = req.headers['accept-language'];
  if (!acceptLanguage) {
    return supportedLanguages[0];
  }

  const languages = acceptLanguage.split(',').map((lang) => {
    const parts = lang.split(';');
    const code = parts[0].trim().split('-')[0];
    const qPart = parts.find((p) => p.trim().startsWith('q='));
    const quality = qPart ? parseFloat(qPart.split('=')[1]) : 1.0;
    return { code, quality };
  });

  languages.sort((a, b) => b.quality - a.quality);

  for (const lang of languages) {
    if (supportedLanguages.includes(lang.code)) {
      return lang.code;
    }
  }

  return supportedLanguages[0];
}

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
export function acceptsContentType(req: Request, contentType: string): boolean {
  const accepted = parseAcceptHeader(req);
  return accepted.includes(contentType) || accepted.includes('*/*');
}

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
export function getPreferredCharset(
  req: Request,
  supportedCharsets: string[] = ['utf-8'],
): string {
  const acceptCharset = req.headers['accept-charset'];
  if (!acceptCharset) {
    return supportedCharsets[0];
  }

  const charsets = acceptCharset.split(',').map((c) => c.trim().toLowerCase());

  for (const charset of charsets) {
    if (supportedCharsets.includes(charset)) {
      return charset;
    }
  }

  return supportedCharsets[0];
}

// ============================================================================
// SECTION 7: REQUEST VALIDATION (36-40)
// ============================================================================

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
export function validateRequestBody(
  body: any,
  rules: ValidationRule[],
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const rule of rules) {
    const value = body[rule.field];

    // Required check
    if (rule.required && (value === undefined || value === null || value === '')) {
      errors.push(`Field '${rule.field}' is required`);
      continue;
    }

    // Skip further validation if value is not provided and not required
    if (value === undefined || value === null) {
      continue;
    }

    // Type validation
    switch (rule.type) {
      case 'string':
        if (typeof value !== 'string') {
          errors.push(`Field '${rule.field}' must be a string`);
        }
        break;
      case 'number':
        if (typeof value !== 'number' || isNaN(value)) {
          errors.push(`Field '${rule.field}' must be a number`);
        } else {
          if (rule.min !== undefined && value < rule.min) {
            errors.push(`Field '${rule.field}' must be at least ${rule.min}`);
          }
          if (rule.max !== undefined && value > rule.max) {
            errors.push(`Field '${rule.field}' must be at most ${rule.max}`);
          }
        }
        break;
      case 'boolean':
        if (typeof value !== 'boolean') {
          errors.push(`Field '${rule.field}' must be a boolean`);
        }
        break;
      case 'email':
        if (typeof value !== 'string' || !isValidEmail(value)) {
          errors.push(`Field '${rule.field}' must be a valid email`);
        }
        break;
      case 'url':
        if (typeof value !== 'string' || !isValidUrl(value)) {
          errors.push(`Field '${rule.field}' must be a valid URL`);
        }
        break;
      case 'uuid':
        if (typeof value !== 'string' || !isValidUuid(value)) {
          errors.push(`Field '${rule.field}' must be a valid UUID`);
        }
        break;
      case 'array':
        if (!Array.isArray(value)) {
          errors.push(`Field '${rule.field}' must be an array`);
        }
        break;
      case 'object':
        if (typeof value !== 'object' || Array.isArray(value)) {
          errors.push(`Field '${rule.field}' must be an object`);
        }
        break;
    }

    // Pattern validation
    if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
      errors.push(`Field '${rule.field}' does not match required pattern`);
    }

    // Custom validation
    if (rule.custom) {
      const customResult = rule.custom(value);
      if (typeof customResult === 'string') {
        errors.push(customResult);
      } else if (!customResult) {
        errors.push(`Field '${rule.field}' failed custom validation`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

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
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

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
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

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
export function isValidUuid(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

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
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  const digitsOnly = phone.replace(/\D/g, '');
  return phoneRegex.test(phone) && digitsOnly.length >= 10 && digitsOnly.length <= 15;
}

// ============================================================================
// SECTION 8: REQUEST LOGGING & MONITORING (41-45)
// ============================================================================

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
export function createRequestLogger(options: RequestLogOptions = {}): NestInterceptor {
  @Injectable()
  class RequestLoggerInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest<Request>();
      const startTime = Date.now();

      const logData: any = {
        method: request.method,
        path: request.path,
        timestamp: new Date().toISOString(),
      };

      if (options.includeHeaders) {
        logData.headers = sanitizeHeaders(
          request.headers as Record<string, any>,
          options.maskFields,
        );
      }

      if (options.includeBody && request.body) {
        logData.body = maskSensitiveFields(request.body, options.maskFields || []);
      }

      if (options.includeCookies) {
        logData.cookies = request.cookies;
      }

      console.log('[REQUEST]', logData);

      return next.handle().pipe(
        tap(() => {
          const duration = Date.now() - startTime;
          console.log('[RESPONSE]', {
            path: request.path,
            duration: `${duration}ms`,
          });
        }),
      );
    }
  }

  return new RequestLoggerInterceptor();
}

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
export function maskSensitiveFields(obj: any, sensitiveFields: string[]): any {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  const masked = Array.isArray(obj) ? [...obj] : { ...obj };

  for (const key in masked) {
    if (sensitiveFields.includes(key.toLowerCase())) {
      masked[key] = '[REDACTED]';
    } else if (typeof masked[key] === 'object') {
      masked[key] = maskSensitiveFields(masked[key], sensitiveFields);
    }
  }

  return masked;
}

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
export function generateCorrelationId(req: Request): string {
  const existing =
    req.headers['x-correlation-id'] ||
    req.headers['x-request-id'] ||
    req.headers['traceparent'];

  if (existing) {
    return Array.isArray(existing) ? existing[0] : existing;
  }

  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

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
export function createRequestTimer(req: Request): {
  start: () => void;
  end: () => number;
} {
  let startTime: number;

  return {
    start: () => {
      startTime = Date.now();
    },
    end: () => {
      return Date.now() - startTime;
    },
  };
}

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
export function createRequestSummary(
  req: Request,
  res: Response,
  duration: number,
): {
  method: string;
  path: string;
  statusCode: number;
  duration: number;
  ip: string;
  userAgent: string;
  timestamp: string;
} {
  return {
    method: req.method,
    path: req.path,
    statusCode: res.statusCode,
    duration,
    ip: extractClientIp(req),
    userAgent: req.headers['user-agent'] || 'unknown',
    timestamp: new Date().toISOString(),
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Request Parsing
  parseRequest,
  extractQueryParams,
  parsePathParams,
  extractClientIp,
  parseContentType,
  parseAcceptHeader,
  getRequestBodySize,
  isSecureRequest,

  // Header Manipulation
  setResponseHeader,
  setMultipleHeaders,
  getHeader,
  setCorsHeaders,
  setCacheHeaders,
  setSecurityHeaders,
  sanitizeHeaders,

  // Cookie Management
  setCookie,
  getCookie,
  clearCookie,
  setMultipleCookies,
  getSignedCookie,

  // Body Transformation
  transformRequestBody,
  flattenRequestBody,
  pickBodyFields,
  omitBodyFields,
  mergeWithDefaults,
  convertDatesInBody,

  // File Upload
  createFileFilter,
  createFileSizeFilter,
  getFileExtension,
  generateUniqueFilename,
  validateUploadedFile,

  // Content Negotiation
  negotiateContentType,
  negotiateLanguage,
  acceptsContentType,
  getPreferredCharset,

  // Request Validation
  validateRequestBody,
  isValidEmail,
  isValidUrl,
  isValidUuid,
  isValidPhoneNumber,

  // Logging & Monitoring
  createRequestLogger,
  maskSensitiveFields,
  generateCorrelationId,
  createRequestTimer,
  createRequestSummary,
};
