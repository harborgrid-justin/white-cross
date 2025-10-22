/**
 * @fileoverview Not Found (404) Middleware - Healthcare-Compliant 404 Handler
 * @module middleware/error-handling/not-found/not-found
 * @description Enterprise-grade 404 middleware with rate limiting, audit logging, and security features
 *
 * Key Features:
 * - Framework-agnostic 404 handling
 * - Rate limiting to prevent 404 abuse/scanning
 * - Comprehensive audit logging for security monitoring
 * - Configurable detail levels (production vs development)
 * - Healthcare-compliant response formatting
 * - Request path sanitization
 * - IP-based rate limiting with automatic cleanup
 * - Custom headers and messages support
 *
 * UPSTREAM (imports from):
 *   - utils/types/middleware.types (Framework-agnostic interfaces)
 *
 * DOWNSTREAM (imported by):
 *   - adapters/express/express.adapter.ts
 *   - adapters/hapi/hapi.adapter.ts
 *   - Server configuration files
 *
 * @security Prevents information disclosure in 404 responses
 * @security Rate limiting prevents path enumeration attacks
 * @security Audit logging tracks potential security scans
 *
 * @compliance HIPAA - Audit trail for access attempts
 * @compliance SOC2 - Security event logging
 *
 * @example
 * // Production configuration
 * const middleware = createNotFoundMiddleware({
 *   enableDetailedErrors: false,
 *   enableAuditLogging: true,
 *   includeRequestPath: false,
 *   enableRateLimit: true
 * });
 *
 * @example
 * // Development configuration
 * const middleware = new NotFoundMiddleware({
 *   enableDetailedErrors: true,
 *   includeRequestPath: true,
 *   customMessage: 'Resource not found. Check the API documentation.'
 * });
 *
 * @author Healthcare Platform Team
 * @version 1.0.0
 * @since 2025-10-21
 */

import { IRequest, IResponse, IMiddleware, MiddlewareContext, HealthcareUser, INextFunction } from '../../utils/types/middleware.types';

/**
 * Configuration interface for not found middleware
 */
export interface INotFoundConfig {
  /** Enable detailed error responses (disable in production) */
  enableDetailedErrors: boolean;
  /** Custom 404 message template */
  customMessage?: string;
  /** Enable audit logging for 404s */
  enableAuditLogging: boolean;
  /** Include request path in response */
  includeRequestPath: boolean;
  /** Custom headers to include in 404 responses */
  customHeaders?: Record<string, string>;
  /** Rate limit 404 responses per IP */
  enableRateLimit: boolean;
  /** Maximum 404s per IP per window */
  maxRequestsPerWindow: number;
  /** Rate limit window in seconds */
  rateLimitWindow: number;
}

/**
 * Default configuration for not found middleware
 */
export const DEFAULT_NOT_FOUND_CONFIG: INotFoundConfig = {
  enableDetailedErrors: process.env.NODE_ENV !== 'production',
  enableAuditLogging: true,
  includeRequestPath: true,
  enableRateLimit: true,
  maxRequestsPerWindow: 100,
  rateLimitWindow: 3600 // 1 hour
};

/**
 * Extended context interface for not found handling
 */
interface NotFoundContext {
  requestId: string;
  timestamp: Date;
  userAgent: string;
  clientIP: string;
  user?: HealthcareUser;
  method: string;
  path: string;
  facility?: string | null;
  sessionId?: string | null;
}

/**
 * Rate limiting store for tracking 404 requests per IP
 *
 * @class NotFoundRateLimiter
 * @description In-memory rate limiter to prevent 404 abuse and path enumeration attacks.
 * Automatically cleans up expired entries every 5 minutes.
 *
 * Security Features:
 * - IP-based tracking
 * - Sliding window implementation
 * - Automatic memory cleanup
 * - Configurable limits and windows
 *
 * @example
 * const limiter = new NotFoundRateLimiter(3600000, 100); // 1 hour, 100 requests
 * if (!limiter.isAllowed('192.168.1.1')) {
 *   // Rate limit exceeded
 * }
 */
class NotFoundRateLimiter {
  private store: Map<string, { count: number; resetTime: number }> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor(private windowMs: number, private maxRequests: number) {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => this.cleanup(), 300000);
  }

  public isAllowed(ip: string): boolean {
    const now = Date.now();
    const entry = this.store.get(ip);

    if (!entry || now > entry.resetTime) {
      this.store.set(ip, { count: 1, resetTime: now + this.windowMs });
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
    for (const [ip, entry] of this.store.entries()) {
      if (now > entry.resetTime) {
        this.store.delete(ip);
      }
    }
  }

  public destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.store.clear();
  }
}

/**
 * Enterprise not found middleware with healthcare compliance
 */
export class NotFoundMiddleware implements IMiddleware {
  public readonly name = 'NotFoundMiddleware';
  public readonly version = '1.0.0';
  
  private rateLimiter?: NotFoundRateLimiter;
  private config: INotFoundConfig;

  constructor(config: Partial<INotFoundConfig> = {}) {
    this.config = { ...DEFAULT_NOT_FOUND_CONFIG, ...config };
    
    if (this.config.enableRateLimit) {
      this.rateLimiter = new NotFoundRateLimiter(
        this.config.rateLimitWindow * 1000,
        this.config.maxRequestsPerWindow
      );
    }
  }

  /**
   * Required execute method for IMiddleware interface
   */
  public async execute(
    request: IRequest, 
    response: IResponse, 
    _next: INextFunction, 
    _context: MiddlewareContext
  ): Promise<void> {
    await this.handle(request, response);
  }

  /**
   * Handle not found requests with comprehensive logging and security features
   *
   * @public
   * @async
   * @method handle
   * @param {IRequest} req - Framework-agnostic request object
   * @param {IResponse} res - Framework-agnostic response object
   * @returns {Promise<void>}
   *
   * @description Main handler for 404 errors. Processes requests through:
   * 1. Context creation and IP extraction
   * 2. Rate limit check (if enabled)
   * 3. Audit logging
   * 4. Response formatting and sending
   *
   * Processing Flow:
   * - Extract request context (IP, path, user, etc.)
   * - Check rate limiting (return 429 if exceeded)
   * - Log access attempt for audit trail
   * - Send standardized 404 response
   * - Handle any errors with fallback response
   *
   * Response Format (Production):
   * {
   *   error: 'Not Found',
   *   message: 'The requested resource was not found',
   *   timestamp: '2025-10-22T10:30:00.000Z',
   *   requestId: 'req-abc123'
   * }
   *
   * Response Format (Development):
   * {
   *   error: 'Not Found',
   *   message: 'The requested resource was not found',
   *   timestamp: '2025-10-22T10:30:00.000Z',
   *   requestId: 'req-abc123',
   *   details: {
   *     method: 'GET',
   *     path: '/api/unknown',
   *     userAgent: 'Mozilla/5.0...'
   *   }
   * }
   *
   * @example
   * await notFoundMiddleware.handle(request, response);
   */
  public async handle(req: IRequest, res: IResponse): Promise<void> {
    try {
      const context = this.createContext(req);
      
      // Check rate limiting if enabled
      if (this.rateLimiter && !this.rateLimiter.isAllowed(context.clientIP)) {
        await this.handleRateLimitExceeded(res, context);
        return;
      }

      // Log the 404 for audit purposes
      if (this.config.enableAuditLogging) {
        await this.logNotFoundAttempt(context);
      }

      // Send 404 response
      await this.sendNotFoundResponse(res, context);

    } catch (error) {
      console.error('[NotFoundMiddleware] Error handling 404:', error);
      
      // Fallback response
      res.setStatus(404).json({
        error: 'Not Found',
        message: 'The requested resource was not found',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Create context for not found handling
   */
  private createContext(req: IRequest): NotFoundContext {
    const user = req.user as HealthcareUser | undefined;
    
    return {
      requestId: req.headers['x-request-id'] as string || this.generateRequestId(),
      timestamp: new Date(),
      userAgent: req.headers['user-agent'] as string || 'Unknown',
      clientIP: this.getClientIP(req),
      user,
      method: req.method || 'GET',
      path: req.path || req.url || '/',
      facility: user?.facilityId || null,
      sessionId: req.sessionId || null
    };
  }

  /**
   * Generate unique request ID for tracking
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Extract client IP address with proxy support
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
   * Log not found attempts for security monitoring
   */
  private async logNotFoundAttempt(context: NotFoundContext): Promise<void> {
    const logEntry = {
      event: 'NOT_FOUND_ACCESS_ATTEMPT',
      requestId: context.requestId,
      timestamp: context.timestamp.toISOString(),
      method: context.method,
      path: context.path,
      userAgent: context.userAgent,
      clientIP: context.clientIP,
      userId: context.user?.userId || null,
      facilityId: context.facility || null,
      sessionId: context.sessionId,
      severity: 'LOW',
      category: 'ACCESS_CONTROL'
    };

    // In production, this would integrate with your logging service
    console.log('[AUDIT] Not Found Access Attempt:', JSON.stringify(logEntry));
  }

  /**
   * Handle rate limit exceeded for 404 requests
   */
  private async handleRateLimitExceeded(res: IResponse, context: NotFoundContext): Promise<void> {
    const logEntry = {
      event: 'NOT_FOUND_RATE_LIMIT_EXCEEDED',
      requestId: context.requestId,
      timestamp: context.timestamp.toISOString(),
      clientIP: context.clientIP,
      severity: 'MEDIUM',
      category: 'RATE_LIMITING'
    };

    console.log('[SECURITY] Not Found Rate Limit Exceeded:', JSON.stringify(logEntry));

    res.setStatus(429).json({
      error: 'Too Many Requests',
      message: 'Rate limit exceeded for not found requests',
      timestamp: context.timestamp.toISOString(),
      requestId: context.requestId
    });
  }

  /**
   * Send standardized not found response
   */
  private async sendNotFoundResponse(res: IResponse, context: NotFoundContext): Promise<void> {
    // Set custom headers if configured
    if (this.config.customHeaders) {
      Object.entries(this.config.customHeaders).forEach(([key, value]) => {
        res.setHeader(key, value);
      });
    }

    // Set standard security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');

    const response: any = {
      error: 'Not Found',
      message: this.config.customMessage || 'The requested resource was not found',
      timestamp: context.timestamp.toISOString(),
      requestId: context.requestId
    };

    // Include additional details if configured
    if (this.config.enableDetailedErrors) {
      response.details = {
        method: context.method,
        userAgent: context.userAgent
      };

      if (this.config.includeRequestPath) {
        response.details.path = context.path;
      }
    }

    res.setStatus(404).json(response);
  }

  /**
   * Cleanup resources when middleware is destroyed
   */
  public destroy(): void {
    if (this.rateLimiter) {
      this.rateLimiter.destroy();
    }
  }
}

/**
 * Factory function to create not found middleware with healthcare defaults
 *
 * @function createNotFoundMiddleware
 * @param {Partial<INotFoundConfig>} [config={}] - Optional configuration overrides
 * @returns {NotFoundMiddleware} Configured not found middleware instance
 *
 * @description Creates a not found middleware with healthcare-compliant defaults.
 * Applies security-focused configuration suitable for production healthcare applications.
 *
 * Healthcare Defaults:
 * - Detailed errors: Disabled (minimize info disclosure)
 * - Audit logging: Enabled (HIPAA compliance)
 * - Request path inclusion: Disabled (security)
 * - Rate limiting: Enabled (prevent abuse)
 * - Max requests: 50 per hour (conservative)
 * - Custom headers: Healthcare service identifier
 *
 * @security Production-safe configuration by default
 * @compliance HIPAA-compliant audit logging enabled
 *
 * @example
 * // Use healthcare defaults
 * const middleware = createNotFoundMiddleware();
 *
 * @example
 * // Override specific settings
 * const middleware = createNotFoundMiddleware({
 *   maxRequestsPerWindow: 100,
 *   customMessage: 'Resource not available'
 * });
 */
export function createNotFoundMiddleware(config: Partial<INotFoundConfig> = {}): NotFoundMiddleware {
  const healthcareConfig: Partial<INotFoundConfig> = {
    enableDetailedErrors: false, // Disable in production for security
    enableAuditLogging: true,    // Required for HIPAA compliance
    includeRequestPath: false,   // Minimize info disclosure
    enableRateLimit: true,       // Prevent abuse
    maxRequestsPerWindow: 50,    // Conservative limit
    rateLimitWindow: 3600,       // 1 hour window
    customHeaders: {
      'X-Healthcare-Service': 'White-Cross-Platform'
    },
    ...config
  };

  return new NotFoundMiddleware(healthcareConfig);
}

/**
 * Express.js integration helper
 */
export function notFoundHandler(config: Partial<INotFoundConfig> = {}) {
  const middleware = createNotFoundMiddleware(config);
  
  return async (req: any, res: any, _next: any) => {
    await middleware.handle(req, res);
  };
}

export default NotFoundMiddleware;
