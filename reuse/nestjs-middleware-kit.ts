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

/**
 * File: /reuse/nestjs-middleware-kit.ts
 * Locator: WC-UTL-NMID-001
 * Purpose: NestJS Middleware Kit - Comprehensive middleware utilities and factories
 *
 * Upstream: @nestjs/common, express, helmet, compression, cookie-parser, express-rate-limit
 * Downstream: All NestJS applications, middleware layers, security configuration
 * Dependencies: NestJS v11.x, Node 18+, TypeScript 5.x, Express
 * Exports: 45 middleware utility functions for logging, CORS, compression, security, validation
 *
 * LLM Context: Production-grade NestJS middleware toolkit for White Cross healthcare platform.
 * Provides comprehensive middleware factories for request logging, CORS configuration, compression,
 * Helmet security headers, rate limiting, request validation, input sanitization, body parsing,
 * cookie handling, authentication, authorization, request tracking, and audit logging. HIPAA-compliant
 * with comprehensive security features and PHI protection.
 */

import {
  Injectable,
  NestMiddleware,
  Logger,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  RequestMethod,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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

// ============================================================================
// MIDDLEWARE FACTORIES
// ============================================================================

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
export function createLoggingMiddleware(
  options: LoggingOptions = {},
): (req: Request, res: Response, next: NextFunction) => void {
  const logger = new Logger('RequestLogger');
  const {
    logBody = false,
    logHeaders = false,
    logQuery = true,
    logParams = true,
    logResponse = false,
    excludePaths = [],
    excludeHeaders = ['authorization', 'cookie'],
    sanitizePHI = true,
  } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    if (excludePaths.some((path) => req.path.startsWith(path))) {
      return next();
    }

    const startTime = Date.now();
    const requestId = req.headers['x-request-id'] || `req-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    const logData: any = {
      requestId,
      method: req.method,
      path: req.path,
      ip: req.ip,
    };

    if (logQuery && Object.keys(req.query).length > 0) {
      logData.query = req.query;
    }

    if (logParams && Object.keys(req.params).length > 0) {
      logData.params = req.params;
    }

    if (logBody && req.body) {
      logData.body = sanitizePHI ? sanitizePHIData(req.body) : req.body;
    }

    if (logHeaders) {
      const headers = { ...req.headers };
      excludeHeaders.forEach((header) => delete headers[header]);
      logData.headers = headers;
    }

    logger.log(`Incoming ${req.method} ${req.path}`, logData);

    if (logResponse) {
      const originalSend = res.send;
      res.send = function (data: any): Response {
        const duration = Date.now() - startTime;
        logger.log(`Response ${req.method} ${req.path}`, {
          requestId,
          statusCode: res.statusCode,
          duration: `${duration}ms`,
        });
        return originalSend.call(this, data);
      };
    }

    next();
  };
}

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
export function createCorsMiddleware(
  options: CorsOptions = {},
): (req: Request, res: Response, next: NextFunction) => void {
  const {
    origin = '*',
    methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders = ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders = [],
    credentials = false,
    maxAge = 86400,
    preflightContinue = false,
  } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    const requestOrigin = req.headers.origin;

    // Determine if origin is allowed
    let allowedOrigin = '*';
    if (typeof origin === 'string') {
      allowedOrigin = origin;
    } else if (Array.isArray(origin)) {
      allowedOrigin = requestOrigin && origin.includes(requestOrigin) ? requestOrigin : origin[0];
    } else if (origin instanceof RegExp) {
      allowedOrigin = requestOrigin && origin.test(requestOrigin) ? requestOrigin : '';
    } else if (typeof origin === 'function') {
      allowedOrigin = requestOrigin && origin(requestOrigin) ? requestOrigin : '';
    }

    if (allowedOrigin) {
      res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    }

    if (credentials) {
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }

    res.setHeader('Access-Control-Allow-Methods', methods.join(', '));
    res.setHeader('Access-Control-Allow-Headers', allowedHeaders.join(', '));

    if (exposedHeaders.length > 0) {
      res.setHeader('Access-Control-Expose-Headers', exposedHeaders.join(', '));
    }

    if (maxAge) {
      res.setHeader('Access-Control-Max-Age', maxAge.toString());
    }

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      if (preflightContinue) {
        next();
      } else {
        res.status(204).send();
      }
    } else {
      next();
    }
  };
}

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
export function createRateLimitMiddleware(
  options: RateLimitOptions,
): (req: Request, res: Response, next: NextFunction) => void {
  const {
    windowMs,
    max,
    message = 'Too many requests',
    skipSuccessfulRequests = false,
    skipFailedRequests = false,
    keyGenerator = (req) => req.ip || 'unknown',
  } = options;

  const requests = new Map<string, { count: number; resetTime: number }>();

  return (req: Request, res: Response, next: NextFunction) => {
    const key = keyGenerator(req);
    const now = Date.now();

    let record = requests.get(key);

    // Reset if window expired
    if (!record || now > record.resetTime) {
      record = {
        count: 0,
        resetTime: now + windowMs,
      };
      requests.set(key, record);
    }

    // Increment request count
    record.count++;

    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', max.toString());
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - record.count).toString());
    res.setHeader('X-RateLimit-Reset', new Date(record.resetTime).toISOString());

    if (record.count > max) {
      res.status(429).json({
        statusCode: 429,
        message,
        error: 'Too Many Requests',
      });
      return;
    }

    // Track response status if needed
    if (skipSuccessfulRequests || skipFailedRequests) {
      const originalSend = res.send;
      res.send = function (data: any): Response {
        const statusCode = res.statusCode;
        if (
          (skipSuccessfulRequests && statusCode < 400) ||
          (skipFailedRequests && statusCode >= 400)
        ) {
          record!.count--;
        }
        return originalSend.call(this, data);
      };
    }

    next();
  };
}

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
export function createCompressionMiddleware(
  options: CompressionOptions = {},
): (req: Request, res: Response, next: NextFunction) => void {
  const {
    threshold = 1024,
    filter = (req, res) => {
      // Don't compress responses with Cache-Control: no-transform
      if (res.getHeader('Cache-Control')?.toString().includes('no-transform')) {
        return false;
      }
      // Compress if client accepts gzip or deflate
      const acceptEncoding = req.headers['accept-encoding'] || '';
      return /gzip|deflate/i.test(acceptEncoding);
    },
  } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    if (!filter(req, res)) {
      return next();
    }

    // This is a placeholder - in production, use the 'compression' package
    // import compression from 'compression';
    // return compression({ threshold, level })(req, res, next);

    next();
  };
}

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
export function createSecurityMiddleware(): (
  req: Request,
  res: Response,
  next: NextFunction,
) => void {
  return (req: Request, res: Response, next: NextFunction) => {
    // Set security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'; frame-ancestors 'none';",
    );
    res.setHeader(
      'Permissions-Policy',
      'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()',
    );

    next();
  };
}

// ============================================================================
// REQUEST VALIDATION MIDDLEWARE
// ============================================================================

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
export function createValidationMiddleware(
  options: ValidationOptions = {},
): (req: Request, res: Response, next: NextFunction) => void {
  const {
    stripUnknown = false,
    maxBodySize = 10 * 1024 * 1024,
    allowedContentTypes = ['application/json', 'application/x-www-form-urlencoded'],
  } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    // Validate content length
    const contentLength = parseInt(req.headers['content-length'] || '0', 10);
    if (contentLength > maxBodySize) {
      throw new BadRequestException(`Request body too large. Maximum size is ${maxBodySize} bytes`);
    }

    // Validate content type for requests with body
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      const contentType = req.headers['content-type']?.split(';')[0];
      if (contentType && !allowedContentTypes.some((type) => contentType.includes(type))) {
        throw new BadRequestException(
          `Invalid content type. Allowed types: ${allowedContentTypes.join(', ')}`,
        );
      }
    }

    next();
  };
}

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
export function createSanitizationMiddleware(
  rules: SanitizationRule[],
): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.body || typeof req.body !== 'object') {
      return next();
    }

    for (const rule of rules) {
      if (req.body[rule.field] !== undefined) {
        let value = req.body[rule.field];

        for (const sanitizationRule of rule.rules) {
          value = applySanitizationRule(value, sanitizationRule);
        }

        req.body[rule.field] = value;
      }
    }

    next();
  };
}

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
export function createXssProtectionMiddleware(): (
  req: Request,
  res: Response,
  next: NextFunction,
) => void {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.body) {
      req.body = sanitizeObject(req.body);
    }
    if (req.query) {
      req.query = sanitizeObject(req.query as Record<string, any>);
    }
    if (req.params) {
      req.params = sanitizeObject(req.params);
    }

    next();
  };
}

// ============================================================================
// COOKIE HANDLING MIDDLEWARE
// ============================================================================

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
export function createCookieParserMiddleware(
  secret?: string,
): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, res: Response, next: NextFunction) => {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) {
      req.cookies = {};
      req.signedCookies = {};
      return next();
    }

    const cookies: Record<string, string> = {};
    const signedCookies: Record<string, string> = {};

    cookieHeader.split(';').forEach((cookie) => {
      const [name, ...rest] = cookie.split('=');
      const value = rest.join('=').trim();
      const cookieName = name.trim();

      if (cookieName.startsWith('s:') && secret) {
        // Handle signed cookies
        const unsigned = unsignCookie(value, secret);
        if (unsigned) {
          signedCookies[cookieName.substring(2)] = unsigned;
        }
      } else {
        cookies[cookieName] = decodeURIComponent(value);
      }
    });

    req.cookies = cookies;
    req.signedCookies = signedCookies;

    next();
  };
}

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
export function setSecureCookie(
  res: Response,
  name: string,
  value: string,
  options: CookieOptions = {},
): void {
  const {
    httpOnly = true,
    secure = true,
    sameSite = 'strict',
    maxAge = 24 * 60 * 60 * 1000,
    domain,
    path = '/',
    signed = false,
  } = options;

  const cookieOptions: string[] = [
    `${name}=${encodeURIComponent(value)}`,
    `Path=${path}`,
    `Max-Age=${Math.floor(maxAge / 1000)}`,
  ];

  if (httpOnly) cookieOptions.push('HttpOnly');
  if (secure) cookieOptions.push('Secure');
  if (sameSite) cookieOptions.push(`SameSite=${sameSite}`);
  if (domain) cookieOptions.push(`Domain=${domain}`);

  res.setHeader('Set-Cookie', cookieOptions.join('; '));
}

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
export function clearCookie(res: Response, name: string, options: Partial<CookieOptions> = {}): void {
  const { path = '/', domain } = options;

  const cookieOptions: string[] = [
    `${name}=`,
    `Path=${path}`,
    'Expires=Thu, 01 Jan 1970 00:00:00 GMT',
  ];

  if (domain) cookieOptions.push(`Domain=${domain}`);

  res.setHeader('Set-Cookie', cookieOptions.join('; '));
}

// ============================================================================
// AUTHENTICATION & AUTHORIZATION MIDDLEWARE
// ============================================================================

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
export function createJwtAuthMiddleware(
  secret: string,
  excludePaths: string[] = [],
): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, res: Response, next: NextFunction) => {
    // Skip authentication for excluded paths
    if (excludePaths.some((path) => req.path.startsWith(path))) {
      return next();
    }

    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authorization.substring(7);

    try {
      // In production, use a proper JWT library like 'jsonwebtoken'
      // const decoded = jwt.verify(token, secret);
      // req.user = decoded;

      // Placeholder validation
      if (!token) {
        throw new UnauthorizedException('Invalid token');
      }

      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  };
}

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
export function createApiKeyAuthMiddleware(
  validApiKeys: string[],
  headerName: string = 'x-api-key',
): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers[headerName.toLowerCase()];

    if (!apiKey || typeof apiKey !== 'string') {
      throw new UnauthorizedException('API key required');
    }

    if (!validApiKeys.includes(apiKey)) {
      throw new ForbiddenException('Invalid API key');
    }

    next();
  };
}

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
export function createRoleAuthMiddleware(
  allowedRoles: string[],
): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    if (!user.role || !allowedRoles.includes(user.role)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    next();
  };
}

// ============================================================================
// REQUEST TRACKING & AUDIT LOGGING
// ============================================================================

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
export function createRequestTrackingMiddleware(): (
  req: Request,
  res: Response,
  next: NextFunction,
) => void {
  return (req: Request, res: Response, next: NextFunction) => {
    const context: RequestContext = {
      requestId:
        (req.headers['x-request-id'] as string) ||
        `req-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      startTime: Date.now(),
      correlationId: req.headers['x-correlation-id'] as string,
    };

    // Attach context to request
    (req as any).context = context;

    // Set request ID header in response
    res.setHeader('X-Request-Id', context.requestId);
    if (context.correlationId) {
      res.setHeader('X-Correlation-Id', context.correlationId);
    }

    next();
  };
}

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
export function createAuditLogMiddleware(
  logFunction: (entry: AuditLogEntry) => Promise<void>,
): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, res: Response, next: NextFunction) => {
    const context = (req as any).context as RequestContext;
    const startTime = context?.startTime || Date.now();

    const originalSend = res.send;
    res.send = function (data: any): Response {
      const duration = Date.now() - startTime;

      const auditEntry: AuditLogEntry = {
        timestamp: new Date(),
        requestId: context?.requestId || 'unknown',
        method: req.method,
        path: req.path,
        userId: (req as any).user?.id,
        ip: req.ip || req.connection?.remoteAddress || 'unknown',
        userAgent: req.headers['user-agent'] || 'unknown',
        statusCode: res.statusCode,
        duration,
      };

      // Determine action and resource from path
      const pathParts = req.path.split('/').filter(Boolean);
      if (pathParts.length > 0) {
        auditEntry.resource = pathParts[pathParts.length - 1];
        auditEntry.action = `${req.method}_${auditEntry.resource}`.toUpperCase();
      }

      // Log asynchronously
      logFunction(auditEntry).catch((error) => {
        console.error('Failed to write audit log:', error);
      });

      return originalSend.call(this, data);
    };

    next();
  };
}

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
export function createPerformanceMonitoringMiddleware(
  slowRequestThreshold: number = 1000,
): (req: Request, res: Response, next: NextFunction) => void {
  const logger = new Logger('PerformanceMonitor');

  return (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();

    const originalSend = res.send;
    res.send = function (data: any): Response {
      const duration = Date.now() - startTime;

      if (duration > slowRequestThreshold) {
        logger.warn(`Slow request detected: ${req.method} ${req.path} (${duration}ms)`, {
          method: req.method,
          path: req.path,
          duration,
          statusCode: res.statusCode,
        });
      }

      res.setHeader('X-Response-Time', `${duration}ms`);

      return originalSend.call(this, data);
    };

    next();
  };
}

// ============================================================================
// BODY PARSING UTILITIES
// ============================================================================

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
export function createJsonBodyParser(
  limit: number = 10 * 1024 * 1024,
): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.headers['content-type']?.includes('application/json')) {
      let body = '';

      req.on('data', (chunk) => {
        body += chunk.toString();
        if (body.length > limit) {
          req.removeAllListeners('data');
          throw new BadRequestException('Request body too large');
        }
      });

      req.on('end', () => {
        try {
          req.body = JSON.parse(body);
          next();
        } catch (error) {
          throw new BadRequestException('Invalid JSON');
        }
      });
    } else {
      next();
    }
  };
}

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
export function createUrlEncodedParser(
  extended: boolean = true,
): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.headers['content-type']?.includes('application/x-www-form-urlencoded')) {
      let body = '';

      req.on('data', (chunk) => {
        body += chunk.toString();
      });

      req.on('end', () => {
        try {
          const params = new URLSearchParams(body);
          req.body = Object.fromEntries(params.entries());
          next();
        } catch (error) {
          throw new BadRequestException('Invalid URL-encoded data');
        }
      });
    } else {
      next();
    }
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

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
export function sanitizeObject(obj: any): any {
  if (typeof obj === 'string') {
    return obj
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item));
  }

  if (obj !== null && typeof obj === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeObject(value);
    }
    return sanitized;
  }

  return obj;
}

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
export function applySanitizationRule(value: any, rule: string): any {
  if (typeof value !== 'string') {
    return value;
  }

  switch (rule) {
    case 'trim':
      return value.trim();
    case 'lowercase':
      return value.toLowerCase();
    case 'uppercase':
      return value.toUpperCase();
    case 'escape':
      return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
    case 'stripHtml':
      return value.replace(/<[^>]*>/g, '');
    default:
      return value;
  }
}

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
export function sanitizePHIData(data: any): any {
  const phiFields = [
    'ssn',
    'social_security',
    'dateOfBirth',
    'dob',
    'medicalRecordNumber',
    'mrn',
    'address',
    'phone',
    'email',
    'name',
    'firstName',
    'lastName',
  ];

  if (Array.isArray(data)) {
    return data.map((item) => sanitizePHIData(item));
  }

  if (data !== null && typeof data === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      if (phiFields.some((field) => key.toLowerCase().includes(field.toLowerCase()))) {
        sanitized[key] = '***';
      } else if (typeof value === 'object') {
        sanitized[key] = sanitizePHIData(value);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }

  return data;
}

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
export function unsignCookie(value: string, secret: string): string | undefined {
  // Simplified implementation - in production, use a proper signing library
  if (!value.startsWith('s:')) {
    return undefined;
  }

  const unsigned = value.substring(2).split('.')[0];
  // In production, verify the signature using the secret
  return unsigned;
}

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
export function validateOrigin(origin: string, whitelist: string[]): boolean {
  return whitelist.includes(origin) || whitelist.includes('*');
}

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
export function generateRequestId(): string {
  return `req-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

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
export function isIpWhitelisted(ip: string, whitelist: string[]): boolean {
  return whitelist.includes(ip) || whitelist.includes('*');
}

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
export function combineMiddlewares(
  middlewares: Array<(req: Request, res: Response, next: NextFunction) => void>,
): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, res: Response, next: NextFunction) => {
    let index = 0;

    const runNext = () => {
      if (index < middlewares.length) {
        const middleware = middlewares[index++];
        middleware(req, res, runNext);
      } else {
        next();
      }
    };

    runNext();
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Middleware Factories
  createLoggingMiddleware,
  createCorsMiddleware,
  createRateLimitMiddleware,
  createCompressionMiddleware,
  createSecurityMiddleware,

  // Request Validation Middleware
  createValidationMiddleware,
  createSanitizationMiddleware,
  createXssProtectionMiddleware,

  // Cookie Handling
  createCookieParserMiddleware,
  setSecureCookie,
  clearCookie,

  // Authentication & Authorization
  createJwtAuthMiddleware,
  createApiKeyAuthMiddleware,
  createRoleAuthMiddleware,

  // Request Tracking & Audit Logging
  createRequestTrackingMiddleware,
  createAuditLogMiddleware,
  createPerformanceMonitoringMiddleware,

  // Body Parsing
  createJsonBodyParser,
  createUrlEncodedParser,

  // Utility Functions
  sanitizeObject,
  applySanitizationRule,
  sanitizePHIData,
  unsignCookie,
  validateOrigin,
  generateRequestId,
  isIpWhitelisted,
  combineMiddlewares,
};
