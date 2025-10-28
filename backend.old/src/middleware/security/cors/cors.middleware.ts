/**
 * @fileoverview CORS Middleware for Healthcare Applications
 * @module middleware/security/cors
 * @description Enterprise-grade CORS (Cross-Origin Resource Sharing) middleware with HIPAA-compliant
 * configurations for healthcare platforms. Provides secure cross-origin access control with
 * healthcare-specific validation, preflight caching, and comprehensive audit logging.
 *
 * Key Features:
 * - Healthcare-compliant CORS policies with trusted domain validation
 * - Preflight request caching for performance optimization
 * - Rate limiting for preflight requests (prevent abuse)
 * - Dynamic origin validation with custom validators
 * - Comprehensive audit logging for compliance tracking
 * - HTTPS enforcement for healthcare data protection
 *
 * @security Critical security middleware - controls cross-origin access to PHI
 * @compliance HIPAA - Access Control (164.312(a)(1)), Transmission Security (164.312(e)(1))
 *
 * @requires ../../utils/types/middleware.types - Framework-agnostic interfaces
 *
 * @version 1.0.0
 * @since 2025-01-01
 */

import { IRequest, IResponse, IMiddleware, MiddlewareContext, HealthcareUser, INextFunction } from '../../utils/types/middleware.types';

/**
 * CORS HTTP methods enumeration
 *
 * @enum {string}
 * @description Supported HTTP methods for CORS requests in healthcare platform
 *
 * @example
 * const allowedMethods = [CorsMethod.GET, CorsMethod.POST];
 */
export enum CorsMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
  OPTIONS = 'OPTIONS',
  HEAD = 'HEAD'
}

/**
 * CORS configuration interface for healthcare applications
 *
 * @interface ICorsConfig
 * @description Comprehensive CORS configuration with healthcare-specific security settings
 *
 * @property {boolean} enabled - Enable/disable CORS middleware
 * @property {string[] | Function} allowedOrigins - Allowed origins (array or validation function)
 * @property {CorsMethod[]} allowedMethods - Allowed HTTP methods for CORS requests
 * @property {string[]} allowedHeaders - Headers that can be sent in CORS requests
 * @property {string[]} exposedHeaders - Headers exposed to browser JavaScript
 * @property {boolean} allowCredentials - Allow cookies and authorization headers
 * @property {number} maxAge - Preflight cache duration in seconds
 * @property {boolean} enableHealthcareCors - Enable healthcare-specific CORS policies
 * @property {boolean} strictMode - Enforce strict HTTPS-only origin validation
 * @property {Function} [originValidator] - Custom origin validation function
 * @property {boolean} enableDynamicOrigins - Enable dynamic origin management
 * @property {string[]} trustedDomains - Trusted healthcare domains (e.g., .healthcare.gov)
 * @property {boolean} enableAuditLogging - Enable CORS request audit logging for compliance
 * @property {Object} preflightRateLimit - Rate limiting configuration for preflight requests
 * @property {Object} errorHandling - Error handling and logging configuration
 *
 * @example
 * const config: ICorsConfig = {
 *   enabled: true,
 *   allowedOrigins: ['https://app.hospital.com'],
 *   allowedMethods: [CorsMethod.GET, CorsMethod.POST],
 *   strictMode: true,
 *   enableHealthcareCors: true,
 *   enableAuditLogging: true
 * };
 */
export interface ICorsConfig {
  /** Enable CORS middleware */
  enabled: boolean;
  /** Allowed origins (array of strings or function) */
  allowedOrigins: string[] | ((origin: string, request: IRequest) => boolean);
  /** Allowed HTTP methods */
  allowedMethods: CorsMethod[];
  /** Allowed headers */
  allowedHeaders: string[];
  /** Exposed headers */
  exposedHeaders: string[];
  /** Enable credentials (cookies, authorization headers) */
  allowCredentials: boolean;
  /** Preflight max age in seconds */
  maxAge: number;
  /** Enable healthcare-specific CORS policies */
  enableHealthcareCors: boolean;
  /** Strict mode for healthcare compliance */
  strictMode: boolean;
  /** Custom origin validation function */
  originValidator?: (origin: string, request: IRequest) => Promise<boolean> | boolean;
  /** Enable dynamic origin management */
  enableDynamicOrigins: boolean;
  /** Trusted domains for healthcare applications */
  trustedDomains: string[];
  /** Enable audit logging for CORS requests */
  enableAuditLogging: boolean;
  /** Rate limiting for preflight requests */
  preflightRateLimit: {
    enabled: boolean;
    windowMs: number;
    maxRequests: number;
  };
  /** Error handling configuration */
  errorHandling: {
    logRejections: boolean;
    customErrorResponse: boolean;
    includeOriginInError: boolean;
  };
}

/**
 * Default CORS configuration for healthcare applications
 */
export const DEFAULT_CORS_CONFIG: ICorsConfig = {
  enabled: true,
  allowedOrigins: ['https://localhost:3000', 'https://127.0.0.1:3000'],
  allowedMethods: [CorsMethod.GET, CorsMethod.POST, CorsMethod.PUT, CorsMethod.DELETE, CorsMethod.OPTIONS],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-Request-ID',
    'X-Correlation-ID',
    'X-Healthcare-Context'
  ],
  exposedHeaders: [
    'X-Total-Count',
    'X-Request-ID',
    'X-RateLimit-Limit',
    'X-RateLimit-Remaining'
  ],
  allowCredentials: true,
  maxAge: 86400, // 24 hours
  enableHealthcareCors: true,
  strictMode: true,
  enableDynamicOrigins: false,
  trustedDomains: ['.healthcare.gov', '.hhs.gov'],
  enableAuditLogging: true,
  preflightRateLimit: {
    enabled: true,
    windowMs: 300000, // 5 minutes
    maxRequests: 100
  },
  errorHandling: {
    logRejections: true,
    customErrorResponse: false,
    includeOriginInError: false // Security: don't leak origin info
  }
};

/**
 * CORS context for request processing
 */
interface CorsContext {
  requestId: string;
  timestamp: Date;
  origin: string | null;
  method: string;
  isPreflight: boolean;
  user?: HealthcareUser;
  facility?: string;
  userAgent: string;
  clientIP: string;
}

/**
 * Preflight request cache for performance
 */
class PreflightCache {
  private cache: Map<string, { timestamp: number; headers: Record<string, string> }> = new Map();
  private maxAge: number;

  constructor(maxAge: number) {
    this.maxAge = maxAge * 1000; // Convert to milliseconds
    
    // Clean up expired entries every hour
    setInterval(() => this.cleanup(), 3600000);
  }

  public get(key: string): Record<string, string> | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    if (Date.now() - entry.timestamp > this.maxAge) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.headers;
  }

  public set(key: string, headers: Record<string, string>): void {
    this.cache.set(key, {
      timestamp: Date.now(),
      headers
    });
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.maxAge) {
        this.cache.delete(key);
      }
    }
  }

  public clear(): void {
    this.cache.clear();
  }
}

/**
 * Rate limiter for preflight requests
 */
class PreflightRateLimiter {
  private requests: Map<string, { count: number; resetTime: number }> = new Map();

  constructor(
    private windowMs: number,
    private maxRequests: number
  ) {
    // Clean up expired entries every minute
    setInterval(() => this.cleanup(), 60000);
  }

  public isAllowed(ip: string): boolean {
    const now = Date.now();
    const entry = this.requests.get(ip);

    if (!entry || now > entry.resetTime) {
      this.requests.set(ip, { count: 1, resetTime: now + this.windowMs });
      return true;
    }

    if (entry.count >= this.maxRequests) {
      return false;
    }

    entry.count++;
    return true;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [ip, entry] of this.requests.entries()) {
      if (now > entry.resetTime) {
        this.requests.delete(ip);
      }
    }
  }
}

/**
 * Healthcare-specific CORS validators
 */
class HealthcareCorsValidators {
  /**
   * Validate healthcare domain
   */
  public static isHealthcareDomain(origin: string): boolean {
    const healthcarePatterns = [
      /\.healthcare\.gov$/,
      /\.hhs\.gov$/,
      /\.cms\.gov$/,
      /\.cdc\.gov$/,
      /\.nih\.gov$/,
      /\.hospital\./,
      /\.clinic\./,
      /\.medical\./,
      /\.health\./
    ];

    try {
      const url = new URL(origin);
      const domain = url.hostname;
      
      return healthcarePatterns.some(pattern => pattern.test(domain));
    } catch {
      return false;
    }
  }

  /**
   * Validate trusted healthcare environment
   */
  public static isTrustedEnvironment(origin: string, trustedDomains: string[]): boolean {
    try {
      const url = new URL(origin);
      const domain = url.hostname;
      
      return trustedDomains.some(trusted => {
        if (trusted.startsWith('.')) {
          return domain.endsWith(trusted) || domain === trusted.slice(1);
        }
        return domain === trusted;
      });
    } catch {
      return false;
    }
  }

  /**
   * Check for secure origin (HTTPS)
   */
  public static isSecureOrigin(origin: string): boolean {
    try {
      const url = new URL(origin);
      
      // Allow localhost for development
      if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
        return true;
      }
      
      // Require HTTPS for all other origins in healthcare
      return url.protocol === 'https:';
    } catch {
      return false;
    }
  }
}

/**
 * Enterprise CORS middleware with HIPAA-compliant healthcare features
 *
 * @class CorsMiddleware
 * @implements {IMiddleware}
 * @description Framework-agnostic CORS middleware providing secure cross-origin resource sharing
 * for healthcare applications. Includes preflight caching, rate limiting, origin validation,
 * and comprehensive audit logging for regulatory compliance.
 *
 * Security Features:
 * - HTTPS-only enforcement in strict mode
 * - Trusted healthcare domain validation
 * - Preflight request rate limiting (prevent DoS)
 * - Request origin whitelisting with custom validators
 * - Credential support for authenticated requests
 * - Comprehensive audit logging for access tracking
 *
 * Performance Features:
 * - Preflight response caching (reduces repeated OPTIONS requests)
 * - Automatic cache cleanup to prevent memory leaks
 * - Efficient origin validation with early returns
 *
 * HIPAA Compliance:
 * - Access control logging (164.312(a)(1))
 * - Transmission security (164.312(e)(1))
 * - Audit controls (164.312(b))
 *
 * @example
 * // Create CORS middleware with healthcare defaults
 * const corsMiddleware = new CorsMiddleware({
 *   enabled: true,
 *   strictMode: true,
 *   enableHealthcareCors: true,
 *   allowedOrigins: ['https://app.hospital.com'],
 *   trustedDomains: ['.healthcare.gov', '.hhs.gov'],
 *   enableAuditLogging: true
 * });
 *
 * @example
 * // Use in middleware chain
 * await corsMiddleware.execute(request, response, next, context);
 *
 * @security Validates all cross-origin requests before allowing access to PHI
 * @performance Caches preflight responses for 24 hours (configurable)
 */
export class CorsMiddleware implements IMiddleware {
  public readonly name = 'CorsMiddleware';
  public readonly version = '1.0.0';
  
  private config: ICorsConfig;
  private preflightCache: PreflightCache;
  private rateLimiter?: PreflightRateLimiter;

  constructor(config: Partial<ICorsConfig> = {}) {
    this.config = { ...DEFAULT_CORS_CONFIG, ...config };
    
    // Initialize preflight cache
    this.preflightCache = new PreflightCache(this.config.maxAge);
    
    // Initialize rate limiter if enabled
    if (this.config.preflightRateLimit.enabled) {
      this.rateLimiter = new PreflightRateLimiter(
        this.config.preflightRateLimit.windowMs,
        this.config.preflightRateLimit.maxRequests
      );
    }
  }

  /**
   * Execute CORS middleware - validates and sets CORS headers
   *
   * @function execute
   * @async
   * @middleware
   * @implements {IMiddleware.execute}
   * @param {IRequest} request - Incoming HTTP request
   * @param {IResponse} response - HTTP response object
   * @param {INextFunction} next - Next middleware function
   * @param {MiddlewareContext} _context - Middleware execution context
   * @returns {Promise<void>} Resolves when CORS processing is complete
   *
   * @description
   * Main CORS middleware execution flow:
   * 1. Check if CORS is enabled
   * 2. Create CORS context from request
   * 3. Rate limit preflight requests (if enabled)
   * 4. Validate origin against allowed origins
   * 5. Set CORS headers on response
   * 6. Handle preflight OPTIONS requests
   * 7. Log CORS request for audit trail
   * 8. Pass control to next middleware
   *
   * Configuration:
   * - Enabled: {@link ICorsConfig.enabled}
   * - Allowed Origins: {@link ICorsConfig.allowedOrigins}
   * - Strict Mode: {@link ICorsConfig.strictMode}
   * - Rate Limiting: {@link ICorsConfig.preflightRateLimit}
   * - Audit Logging: {@link ICorsConfig.enableAuditLogging}
   *
   * @security
   * - Validates origin before allowing cross-origin access
   * - Enforces HTTPS in strict mode for PHI protection
   * - Rate limits preflight requests to prevent abuse
   * - Logs all CORS requests for compliance auditing
   *
   * @compliance
   * HIPAA 164.312(a)(1) - Access control logging
   * HIPAA 164.312(e)(1) - Transmission security (HTTPS enforcement)
   *
   * @throws {Error} When CORS validation fails or rate limit exceeded
   *
   * @example
   * // Automatic execution in middleware chain
   * server.ext('onPreResponse', async (request, h) => {
   *   await corsMiddleware.execute(request, response, next, context);
   * });
   *
   * @example
   * // Manual execution
   * const corsMiddleware = new CorsMiddleware(config);
   * await corsMiddleware.execute(req, res, next, context);
   */
  public async execute(
    request: IRequest,
    response: IResponse,
    next: INextFunction,
    _context: MiddlewareContext
  ): Promise<void> {
    if (!this.config.enabled) {
      next.call();
      return;
    }

    const corsContext = this.createCorsContext(request);
    
    try {
      // Handle preflight rate limiting
      if (corsContext.isPreflight && this.rateLimiter) {
        if (!this.rateLimiter.isAllowed(corsContext.clientIP)) {
          await this.handleRateLimitExceeded(response, corsContext);
          return;
        }
      }

      // Validate origin
      const isAllowedOrigin = await this.validateOrigin(corsContext.origin, request);
      
      if (!isAllowedOrigin) {
        await this.handleCorsRejection(response, corsContext, 'Origin not allowed');
        return;
      }

      // Set CORS headers
      await this.setCorsHeaders(response, corsContext, request);
      
      // Handle preflight requests
      if (corsContext.isPreflight) {
        await this.handlePreflightRequest(response, corsContext);
        return;
      }

      // Log CORS request if enabled
      if (this.config.enableAuditLogging) {
        await this.logCorsRequest(corsContext);
      }
      
      next.call();
      
    } catch (error) {
      console.error('[CorsMiddleware] Error processing CORS:', error);
      next.call(error as Error);
    }
  }

  /**
   * Create CORS context from request
   */
  private createCorsContext(req: IRequest): CorsContext {
    const user = req.user as HealthcareUser | undefined;
    const origin = req.headers['origin'] as string | undefined || null;
    const isPreflight = req.method === 'OPTIONS' && 
                       req.headers['access-control-request-method'] !== undefined;

    return {
      requestId: req.headers['x-request-id'] as string || this.generateRequestId(),
      timestamp: new Date(),
      origin,
      method: req.method,
      isPreflight,
      user,
      facility: user?.facilityId,
      userAgent: req.headers['user-agent'] as string || 'Unknown',
      clientIP: this.getClientIP(req)
    };
  }

  /**
   * Generate unique request ID
   */
  private generateRequestId(): string {
    return `cors_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Extract client IP address
   */
  private getClientIP(req: IRequest): string {
    return (
      req.headers['x-forwarded-for']?.toString().split(',')[0] ||
      req.headers['x-real-ip']?.toString() ||
      req.ip ||
      'unknown'
    );
  }

  /**
   * Validate origin against allowed origins
   */
  private async validateOrigin(origin: string | null, request: IRequest): Promise<boolean> {
    // No origin header (same-origin request)
    if (!origin) {
      return true;
    }

    // Custom origin validator
    if (this.config.originValidator) {
      try {
        return await this.config.originValidator(origin, request);
      } catch (error) {
        console.error('[CorsMiddleware] Origin validator error:', error);
        return false;
      }
    }

    // Healthcare-specific validation
    if (this.config.enableHealthcareCors) {
      // Require secure origins in strict mode
      if (this.config.strictMode && !HealthcareCorsValidators.isSecureOrigin(origin)) {
        return false;
      }

      // Check trusted domains
      if (this.config.trustedDomains.length > 0) {
        if (HealthcareCorsValidators.isTrustedEnvironment(origin, this.config.trustedDomains)) {
          return true;
        }
      }
    }

    // Function-based origin validation
    if (typeof this.config.allowedOrigins === 'function') {
      return this.config.allowedOrigins(origin, request);
    }

    // Array-based origin validation
    if (Array.isArray(this.config.allowedOrigins)) {
      return this.config.allowedOrigins.includes(origin);
    }

    return false;
  }

  /**
   * Set CORS headers on response
   */
  private async setCorsHeaders(
    response: IResponse, 
    context: CorsContext, 
    request: IRequest
  ): Promise<void> {
    // Set Origin header
    if (context.origin) {
      response.setHeader('Access-Control-Allow-Origin', context.origin);
    }

    // Set credentials header
    if (this.config.allowCredentials) {
      response.setHeader('Access-Control-Allow-Credentials', 'true');
    }

    // Set exposed headers
    if (this.config.exposedHeaders.length > 0) {
      response.setHeader('Access-Control-Expose-Headers', this.config.exposedHeaders.join(', '));
    }

    // Set Vary header for proper caching
    const varyHeaders = ['Origin'];
    if (this.config.allowCredentials) {
      varyHeaders.push('Credentials');
    }
    response.setHeader('Vary', varyHeaders.join(', '));

    // Add healthcare-specific security headers
    if (this.config.enableHealthcareCors) {
      response.setHeader('X-Healthcare-CORS', 'enabled');
      response.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
  }

  /**
   * Handle preflight requests
   */
  private async handlePreflightRequest(response: IResponse, context: CorsContext): Promise<void> {
    const cacheKey = `${context.origin}:${context.method}`;
    
    // Check cache first
    const cachedHeaders = this.preflightCache.get(cacheKey);
    if (cachedHeaders) {
      Object.entries(cachedHeaders).forEach(([key, value]) => {
        response.setHeader(key, value);
      });
      response.setStatus(204).end();
      return;
    }

    // Set preflight headers
    const preflightHeaders: Record<string, string> = {};

    // Allowed methods
    preflightHeaders['Access-Control-Allow-Methods'] = this.config.allowedMethods.join(', ');

    // Allowed headers
    if (this.config.allowedHeaders.length > 0) {
      preflightHeaders['Access-Control-Allow-Headers'] = this.config.allowedHeaders.join(', ');
    }

    // Max age
    preflightHeaders['Access-Control-Max-Age'] = this.config.maxAge.toString();

    // Cache and set headers
    this.preflightCache.set(cacheKey, preflightHeaders);
    
    Object.entries(preflightHeaders).forEach(([key, value]) => {
      response.setHeader(key, value);
    });

    // Log preflight request
    if (this.config.enableAuditLogging) {
      await this.logPreflightRequest(context);
    }

    response.setStatus(204).end();
  }

  /**
   * Handle CORS rejection
   */
  private async handleCorsRejection(
    response: IResponse, 
    context: CorsContext, 
    reason: string
  ): Promise<void> {
    // Log rejection if enabled
    if (this.config.errorHandling.logRejections) {
      await this.logCorsRejection(context, reason);
    }

    // Custom error response
    if (this.config.errorHandling.customErrorResponse) {
      const errorResponse: any = {
        error: 'CORS Policy Violation',
        message: 'Cross-origin request blocked by CORS policy',
        timestamp: context.timestamp.toISOString(),
        requestId: context.requestId
      };

      // Include origin in error only if configured (security consideration)
      if (this.config.errorHandling.includeOriginInError && context.origin) {
        errorResponse.origin = context.origin;
      }

      response.setStatus(403).json(errorResponse);
    } else {
      // Standard CORS rejection
      response.setStatus(403).end();
    }
  }

  /**
   * Handle rate limit exceeded for preflight requests
   */
  private async handleRateLimitExceeded(response: IResponse, context: CorsContext): Promise<void> {
    const logEntry = {
      event: 'CORS_PREFLIGHT_RATE_LIMIT_EXCEEDED',
      requestId: context.requestId,
      timestamp: context.timestamp.toISOString(),
      clientIP: context.clientIP,
      origin: context.origin,
      severity: 'MEDIUM',
      category: 'RATE_LIMITING'
    };

    console.log('[SECURITY] CORS Preflight Rate Limit Exceeded:', JSON.stringify(logEntry));

    response.setStatus(429).json({
      error: 'Too Many Requests',
      message: 'Rate limit exceeded for preflight requests',
      timestamp: context.timestamp.toISOString(),
      requestId: context.requestId
    });
  }

  /**
   * Log CORS request for audit
   */
  private async logCorsRequest(context: CorsContext): Promise<void> {
    const logEntry = {
      event: 'CORS_REQUEST',
      requestId: context.requestId,
      timestamp: context.timestamp.toISOString(),
      origin: context.origin,
      method: context.method,
      userAgent: context.userAgent,
      clientIP: context.clientIP,
      userId: context.user?.userId || null,
      facilityId: context.facility || null,
      isPreflight: context.isPreflight,
      severity: 'INFO',
      category: 'ACCESS_CONTROL'
    };

    console.log('[AUDIT] CORS Request:', JSON.stringify(logEntry));
  }

  /**
   * Log preflight request for audit
   */
  private async logPreflightRequest(context: CorsContext): Promise<void> {
    const logEntry = {
      event: 'CORS_PREFLIGHT_REQUEST',
      requestId: context.requestId,
      timestamp: context.timestamp.toISOString(),
      origin: context.origin,
      userAgent: context.userAgent,
      clientIP: context.clientIP,
      severity: 'INFO',
      category: 'ACCESS_CONTROL'
    };

    console.log('[AUDIT] CORS Preflight Request:', JSON.stringify(logEntry));
  }

  /**
   * Log CORS rejection for security monitoring
   */
  private async logCorsRejection(context: CorsContext, reason: string): Promise<void> {
    const logEntry = {
      event: 'CORS_REQUEST_REJECTED',
      requestId: context.requestId,
      timestamp: context.timestamp.toISOString(),
      origin: context.origin,
      method: context.method,
      reason,
      userAgent: context.userAgent,
      clientIP: context.clientIP,
      severity: 'MEDIUM',
      category: 'SECURITY'
    };

    console.log('[SECURITY] CORS Request Rejected:', JSON.stringify(logEntry));
  }

  /**
   * Get CORS configuration summary
   */
  public getCorsConfig(): any {
    return {
      enabled: this.config.enabled,
      allowedOrigins: Array.isArray(this.config.allowedOrigins) 
        ? this.config.allowedOrigins 
        : '[Function]',
      allowedMethods: this.config.allowedMethods,
      allowCredentials: this.config.allowCredentials,
      strictMode: this.config.strictMode,
      trustedDomains: this.config.trustedDomains,
      cacheSize: this.preflightCache ? 'Active' : 'Disabled',
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Cleanup resources
   */
  public destroy(): void {
    if (this.preflightCache) {
      this.preflightCache.clear();
    }
  }
}

/**
 * Factory function to create CORS middleware with healthcare defaults
 */
export function createCorsMiddleware(config: Partial<ICorsConfig> = {}): CorsMiddleware {
  const healthcareConfig: Partial<ICorsConfig> = {
    enabled: true,
    strictMode: true,              // Enforce strict CORS policies
    enableHealthcareCors: true,    // Enable healthcare-specific features
    allowCredentials: true,        // Required for authenticated healthcare apps
    enableAuditLogging: true,      // Required for compliance
    maxAge: 3600,                  // Shorter cache for security
    allowedOrigins: [
      'https://localhost:3000',
      'https://127.0.0.1:3000',
      'https://*.healthcare.local'
    ],
    allowedMethods: [CorsMethod.GET, CorsMethod.POST, CorsMethod.PUT, CorsMethod.DELETE],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'X-Request-ID',
      'X-Healthcare-Context',
      'X-Facility-ID'
    ],
    trustedDomains: ['.healthcare.gov', '.hhs.gov', '.local'],
    errorHandling: {
      logRejections: true,
      customErrorResponse: false,  // Don't leak information
      includeOriginInError: false  // Security consideration
    },
    ...config
  };

  return new CorsMiddleware(healthcareConfig);
}

export default CorsMiddleware;
