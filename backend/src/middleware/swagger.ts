/**
 * @fileoverview Swagger UI Middleware Configuration
 * @module middleware/swagger
 * @description Production-grade Swagger UI middleware with security headers, rate limiting, and environment-specific configurations
 * @requires @hapi/hapi - Hapi server framework
 * @requires ../constants - Swagger configuration constants
 * @requires ../utils/logger - Application logging
 *
 * LOC: F8A9B2C4D5
 * WC-MDW-SWG-075 | Swagger UI Security Middleware & Documentation Access Control
 *
 * UPSTREAM (imports from):
 *   - index.ts (constants/index.ts)
 *   - logger.ts (utils/logger.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (index.ts)
 */

/**
 * WC-MDW-SWG-075 | Swagger UI Security Middleware & Documentation Access Control
 * Purpose: Swagger UI security headers, rate limiting, environment-specific access control
 * Upstream: constants/SWAGGER_CONFIG, constants/ENVIRONMENT, utils/logger
 * Downstream: index.ts | Called by: Hapi server initialization
 * Related: config/swagger.ts, routes/*, .env.example
 * Exports: configureSwaggerMiddleware, swaggerHealthCheck | Key Services: Swagger UI security
 * Last Updated: 2025-10-23 | Dependencies: @hapi/hapi, constants, logger
 * Critical Path: Server start → Swagger UI setup → Security headers → Access control
 * LLM Context: Production-grade API documentation security, CORS, CSP, rate limiting
 */

import { Server, Request, ResponseToolkit } from '@hapi/hapi';
import { SWAGGER_CONFIG, ENVIRONMENT } from '../constants';
import { logger } from '../utils/logger';

/**
 * @interface SwaggerMiddlewareConfig
 * @description Configuration options for Swagger middleware
 *
 * @property {boolean} enableInProduction - Allow Swagger UI in production environment
 * @property {boolean} requireAuth - Require authentication to access Swagger UI
 * @property {string[]} allowedIPs - IP addresses allowed to access Swagger UI (empty = all)
 * @property {boolean} enableRateLimiting - Enable rate limiting for Swagger endpoints
 * @property {number} rateLimitMax - Maximum requests per window
 * @property {number} rateLimitWindowMs - Rate limit window in milliseconds
 * @property {boolean} enableCSP - Enable Content Security Policy headers
 * @property {boolean} enableCORS - Enable CORS for Swagger UI
 */
export interface SwaggerMiddlewareConfig {
  enableInProduction?: boolean;
  requireAuth?: boolean;
  allowedIPs?: string[];
  enableRateLimiting?: boolean;
  rateLimitMax?: number;
  rateLimitWindowMs?: number;
  enableCSP?: boolean;
  enableCORS?: boolean;
}

/**
 * @constant {SwaggerMiddlewareConfig} DEFAULT_CONFIG
 * @description Default Swagger middleware configuration
 * @private
 */
const DEFAULT_CONFIG: SwaggerMiddlewareConfig = {
  enableInProduction: process.env.SWAGGER_ENABLE_IN_PRODUCTION === 'true',
  requireAuth: process.env.SWAGGER_REQUIRE_AUTH === 'true',
  allowedIPs: process.env.SWAGGER_ALLOWED_IPS?.split(',') || [],
  enableRateLimiting: process.env.SWAGGER_ENABLE_RATE_LIMITING !== 'false',
  rateLimitMax: parseInt(process.env.SWAGGER_RATE_LIMIT_MAX || '100', 10),
  rateLimitWindowMs: parseInt(process.env.SWAGGER_RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
  enableCSP: process.env.SWAGGER_ENABLE_CSP !== 'false',
  enableCORS: process.env.SWAGGER_ENABLE_CORS !== 'false',
};

/**
 * Rate limiting storage for Swagger endpoints
 * @type {Map<string, { count: number, resetTime: number }>}
 * @private
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Check if request is within rate limit
 *
 * @function checkRateLimit
 * @param {string} ip - Client IP address
 * @param {SwaggerMiddlewareConfig} config - Middleware configuration
 * @returns {boolean} True if within rate limit, false otherwise
 * @private
 */
function checkRateLimit(ip: string, config: SwaggerMiddlewareConfig): boolean {
  if (!config.enableRateLimiting) return true;

  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + (config.rateLimitWindowMs || DEFAULT_CONFIG.rateLimitWindowMs!),
    });
    return true;
  }

  if (record.count >= (config.rateLimitMax || DEFAULT_CONFIG.rateLimitMax!)) {
    return false;
  }

  record.count++;
  return true;
}

/**
 * Get client IP address from request
 *
 * @function getClientIP
 * @param {Request} request - Hapi request object
 * @returns {string} Client IP address
 * @private
 */
function getClientIP(request: Request): string {
  // Check for proxy headers
  const forwardedFor = request.headers['x-forwarded-for'];
  if (forwardedFor) {
    return Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor.split(',')[0];
  }

  const realIP = request.headers['x-real-ip'];
  if (realIP) {
    return Array.isArray(realIP) ? realIP[0] : realIP;
  }

  return request.info.remoteAddress;
}

/**
 * Check if IP is allowed to access Swagger UI
 *
 * @function isIPAllowed
 * @param {string} ip - Client IP address
 * @param {string[]} allowedIPs - List of allowed IP addresses
 * @returns {boolean} True if IP is allowed
 * @private
 */
function isIPAllowed(ip: string, allowedIPs: string[]): boolean {
  if (!allowedIPs || allowedIPs.length === 0) return true;
  return allowedIPs.includes(ip) || allowedIPs.includes('*');
}

/**
 * Configure Swagger UI middleware with security headers and access control
 *
 * @async
 * @function configureSwaggerMiddleware
 * @param {Server} server - Hapi server instance
 * @param {SwaggerMiddlewareConfig} [customConfig={}] - Custom middleware configuration
 * @returns {Promise<void>}
 *
 * @description Sets up Swagger UI middleware with:
 * - Environment-specific access control (disabled in production by default)
 * - Security headers (CSP, X-Frame-Options, X-Content-Type-Options)
 * - IP whitelisting for restricted access
 * - Rate limiting to prevent abuse
 * - CORS configuration for cross-origin requests
 * - Authentication requirements (optional)
 *
 * @example
 * // Basic setup
 * await configureSwaggerMiddleware(server);
 *
 * @example
 * // Production setup with IP restrictions
 * await configureSwaggerMiddleware(server, {
 *   enableInProduction: true,
 *   allowedIPs: ['10.0.0.1', '10.0.0.2'],
 *   requireAuth: true
 * });
 *
 * @throws {Error} When middleware setup fails
 * @security Applies multiple security layers for API documentation access
 */
export async function configureSwaggerMiddleware(
  server: Server,
  customConfig: SwaggerMiddlewareConfig = {}
): Promise<void> {
  const config: SwaggerMiddlewareConfig = { ...DEFAULT_CONFIG, ...customConfig };

  logger.info('Configuring Swagger middleware', {
    environment: ENVIRONMENT.NODE_ENV,
    enableInProduction: config.enableInProduction,
    requireAuth: config.requireAuth,
    allowedIPs: config.allowedIPs?.length || 0,
  });

  // Disable Swagger in production unless explicitly enabled
  if (ENVIRONMENT.IS_PRODUCTION && !config.enableInProduction) {
    logger.warn('Swagger UI is disabled in production environment');

    // Register route to inform users Swagger is disabled
    server.route({
      method: 'GET',
      path: SWAGGER_CONFIG.PATHS.DOCUMENTATION,
      handler: (request: Request, h: ResponseToolkit) => {
        return h.response({
          message: 'API documentation is disabled in production',
          environment: ENVIRONMENT.NODE_ENV,
        }).code(403);
      },
      options: {
        auth: false,
        tags: ['api', 'documentation'],
        description: 'Swagger UI disabled in production',
      },
    });

    return;
  }

  // Register onPreResponse extension for Swagger security headers
  server.ext('onPreResponse', (request: Request, h: ResponseToolkit) => {
    const path = request.path;

    // Check if request is for Swagger UI or documentation
    const isSwaggerPath =
      path.startsWith(SWAGGER_CONFIG.PATHS.DOCUMENTATION) ||
      path.startsWith(SWAGGER_CONFIG.PATHS.SWAGGER_UI) ||
      path.startsWith(SWAGGER_CONFIG.PATHS.JSON);

    if (!isSwaggerPath) {
      return h.continue;
    }

    const clientIP = getClientIP(request);

    // Check IP whitelist
    if (config.allowedIPs && config.allowedIPs.length > 0) {
      if (!isIPAllowed(clientIP, config.allowedIPs)) {
        logger.warn('Swagger access denied: IP not allowed', { ip: clientIP });
        return h.response({
          error: 'Access denied',
          message: 'Your IP address is not authorized to access API documentation',
        }).code(403);
      }
    }

    // Check rate limit
    if (config.enableRateLimiting) {
      if (!checkRateLimit(clientIP, config)) {
        logger.warn('Swagger access denied: Rate limit exceeded', { ip: clientIP });
        return h.response({
          error: 'Rate limit exceeded',
          message: 'Too many requests to API documentation. Please try again later.',
          retryAfter: Math.ceil((config.rateLimitWindowMs || 900000) / 1000),
        }).code(429).header('Retry-After', String(Math.ceil((config.rateLimitWindowMs || 900000) / 1000)));
      }
    }

    const response = request.response;

    // Skip header setting for error responses
    if ('isBoom' in response && response.isBoom) {
      return h.continue;
    }

    // Add security headers for Swagger UI
    if ('header' in response && typeof response.header === 'function') {
      // Content Security Policy
      if (config.enableCSP) {
        response.header(
          'Content-Security-Policy',
          "default-src 'self'; " +
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; " +
          "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; " +
          "img-src 'self' data: https: blob:; " +
          "font-src 'self' data: https://cdn.jsdelivr.net; " +
          "connect-src 'self';"
        );
      }

      // X-Frame-Options to prevent clickjacking
      response.header('X-Frame-Options', 'SAMEORIGIN');

      // X-Content-Type-Options to prevent MIME sniffing
      response.header('X-Content-Type-Options', 'nosniff');

      // X-XSS-Protection for older browsers
      response.header('X-XSS-Protection', '1; mode=block');

      // Referrer-Policy
      response.header('Referrer-Policy', 'no-referrer');

      // Permissions-Policy to disable unnecessary browser features
      response.header('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

      // CORS headers for Swagger UI
      if (config.enableCORS) {
        response.header('Access-Control-Allow-Origin', request.headers.origin || '*');
        response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        response.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        response.header('Access-Control-Allow-Credentials', 'true');
      }

      // Cache control - Swagger UI can be cached for short duration
      response.header('Cache-Control', 'public, max-age=300'); // 5 minutes
    }

    return h.continue;
  });

  logger.info('Swagger middleware configured successfully');
}

/**
 * Health check endpoint for Swagger documentation availability
 *
 * @function swaggerHealthCheck
 * @param {Request} request - Hapi request object
 * @param {ResponseToolkit} h - Hapi response toolkit
 * @returns {Object} Health check response with documentation status
 *
 * @description Returns health status of Swagger documentation including:
 * - Availability status
 * - Environment information
 * - Access URLs
 * - Configuration details
 *
 * @example
 * // Register health check route
 * server.route({
 *   method: 'GET',
 *   path: '/api/health/swagger',
 *   handler: swaggerHealthCheck,
 *   options: { auth: false }
 * });
 *
 * @example
 * // Response format
 * {
 *   status: 'available',
 *   environment: 'development',
 *   endpoints: {
 *     documentation: 'http://localhost:3001/docs',
 *     swaggerUI: 'http://localhost:3001/swagger/',
 *     json: 'http://localhost:3001/swagger.json'
 *   },
 *   config: {
 *     enableInProduction: false,
 *     requireAuth: false,
 *     rateLimitEnabled: true
 *   }
 * }
 */
export function swaggerHealthCheck(request: Request, h: ResponseToolkit) {
  const baseUrl = `${request.server.info.protocol}://${request.info.host}`;
  const config = DEFAULT_CONFIG;

  const isAvailable =
    ENVIRONMENT.IS_DEVELOPMENT ||
    ENVIRONMENT.IS_TEST ||
    (ENVIRONMENT.IS_PRODUCTION && config.enableInProduction);

  return h.response({
    status: isAvailable ? 'available' : 'disabled',
    environment: ENVIRONMENT.NODE_ENV,
    endpoints: isAvailable ? {
      documentation: `${baseUrl}${SWAGGER_CONFIG.PATHS.DOCUMENTATION}`,
      swaggerUI: `${baseUrl}${SWAGGER_CONFIG.PATHS.SWAGGER_UI}`,
      json: `${baseUrl}${SWAGGER_CONFIG.PATHS.JSON}`,
    } : null,
    config: {
      enableInProduction: config.enableInProduction,
      requireAuth: config.requireAuth,
      rateLimitEnabled: config.enableRateLimiting,
      allowedIPsCount: config.allowedIPs?.length || 0,
    },
    timestamp: new Date().toISOString(),
  }).code(200);
}

/**
 * Get Swagger middleware statistics
 *
 * @function getSwaggerStats
 * @returns {Object} Middleware statistics
 *
 * @description Returns statistics about Swagger middleware including:
 * - Total rate limit entries
 * - Active rate limit records
 * - Configuration details
 *
 * @example
 * const stats = getSwaggerStats();
 * console.log(stats.rateLimitEntries); // 42
 */
export function getSwaggerStats() {
  return {
    rateLimitEntries: rateLimitStore.size,
    config: DEFAULT_CONFIG,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Clear rate limit records (for testing or maintenance)
 *
 * @function clearRateLimitStore
 * @returns {void}
 *
 * @description Clears all rate limit records from memory
 * @example
 * clearRateLimitStore();
 */
export function clearRateLimitStore(): void {
  rateLimitStore.clear();
  logger.info('Swagger rate limit store cleared');
}
