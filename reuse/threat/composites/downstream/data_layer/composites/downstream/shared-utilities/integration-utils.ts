/**
 * Integration Utilities - Authentication, Exception Filters, and Middleware
 *
 * Re-exports all authentication guards and exception filter strategies from
 * reference composite libraries. Provides enhanced middleware factory for
 * combining auth, rate limiting, and sanitization into a single middleware.
 *
 * @module shared-utilities/integration-utils
 * @version 1.0.0
 * @requires reuse/data/composites/authentication-guard-composites (1,488 lines)
 * @requires reuse/data/composites/exception-filter-strategies (1,501 lines)
 */

import { Injectable, NestMiddleware, Type } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

// ============================================================================
// RE-EXPORT REFERENCE AUTHENTICATION & EXCEPTION PATTERNS (3000+ lines)
// ============================================================================

export * from '../../../../../data/composites/authentication-guard-composites';
export * from '../../../../../data/composites/exception-filter-strategies';

// Import specific utilities for middleware composition
import {
  FlexibleAuthGuard,
  RateLimitGuard,
  RolesGuard,
  ApiKeyGuard,
} from '../../../../../data/composites/authentication-guard-composites';

import {
  GlobalExceptionFilter,
  ValidationExceptionFilter,
  DatabaseExceptionFilter,
  HttpExceptionFilter,
} from '../../../../../data/composites/exception-filter-strategies';

// ============================================================================
// HIPAA-SPECIFIC EXCEPTION FILTER
// ============================================================================

/**
 * HIPAA-compliant exception filter that sanitizes error responses
 * to prevent PHI leakage in error messages
 */
@Injectable()
export class HIPAAComplianceFilter {
  /**
   * Sensitive field patterns to redact from error messages
   */
  private readonly sensitivePatterns = [
    /ssn/i,
    /social security/i,
    /mrn/i,
    /medical record/i,
    /date of birth/i,
    /dob/i,
    /phone/i,
    /email/i,
    /address/i,
    /\d{3}-\d{2}-\d{4}/, // SSN format
    /\b\d{10}\b/, // Phone number
  ];

  catch(exception: any, host: any) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus ? exception.getStatus() : 500;
    let message = exception.message || 'Internal server error';

    // Sanitize error message to remove potential PHI
    message = this.sanitizeMessage(message);

    // Log the original error securely (not in response)
    console.error('[HIPAA Filter] Error:', {
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      status,
      originalMessage: exception.message,
      userId: (request as any).user?.id,
    });

    response.status(status).json({
      statusCode: status,
      message: message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  /**
   * Sanitize error message by removing sensitive patterns
   */
  private sanitizeMessage(message: string): string {
    let sanitized = message;

    for (const pattern of this.sensitivePatterns) {
      sanitized = sanitized.replace(pattern, '[REDACTED]');
    }

    return sanitized;
  }
}

// ============================================================================
// INPUT SANITIZATION SERVICE
// ============================================================================

/**
 * Input sanitization service to prevent XSS and injection attacks
 */
@Injectable()
export class SanitizationService {
  /**
   * Sanitize a single string value
   */
  sanitizeString(value: string): string {
    if (typeof value !== 'string') return value;

    return value
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .replace(/[\x00-\x1F\x7F-\x9F]/g, ''); // Remove control characters
  }

  /**
   * Sanitize an object recursively
   */
  sanitizeObject(obj: any): any {
    if (typeof obj !== 'object' || obj === null) {
      return typeof obj === 'string' ? this.sanitizeString(obj) : obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeObject(item));
    }

    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = this.sanitizeObject(value);
    }

    return sanitized;
  }

  /**
   * Sanitize SQL input to prevent SQL injection
   */
  sanitizeSqlInput(value: string): string {
    if (typeof value !== 'string') return value;

    return value
      .replace(/'/g, "''") // Escape single quotes
      .replace(/;/g, '') // Remove semicolons
      .replace(/--/g, '') // Remove SQL comments
      .replace(/\/\*/g, '') // Remove multi-line comments
      .replace(/\*\//g, '');
  }
}

// ============================================================================
// ENHANCED MIDDLEWARE FACTORY
// ============================================================================

/**
 * Options for creating authentication middleware
 */
export interface AuthMiddlewareOptions {
  /**
   * Enable JWT authentication
   */
  enableJWT?: boolean;

  /**
   * Enable API key authentication
   */
  enableApiKey?: boolean;

  /**
   * Enable rate limiting
   */
  enableRateLimiting?: boolean;

  /**
   * Rate limit: max requests per window
   */
  rateLimitMax?: number;

  /**
   * Rate limit: time window in milliseconds
   */
  rateLimitWindow?: number;

  /**
   * Enable input sanitization
   */
  enableSanitization?: boolean;

  /**
   * Enable role-based access control
   */
  enableRBAC?: boolean;

  /**
   * Required roles (if RBAC enabled)
   */
  requiredRoles?: string[];

  /**
   * Enable HIPAA compliance
   */
  hipaaCompliant?: boolean;
}

/**
 * Create an enhanced authentication middleware that combines
 * auth, rate limiting, sanitization, and RBAC
 *
 * @param options - Middleware configuration options
 * @returns NestJS middleware class
 */
export function createAuthenticationMiddleware(
  options: AuthMiddlewareOptions = {}
): Type<NestMiddleware> {
  const {
    enableJWT = true,
    enableApiKey = true,
    enableRateLimiting = true,
    rateLimitMax = 100,
    rateLimitWindow = 60000,
    enableSanitization = true,
    enableRBAC = false,
    requiredRoles = [],
    hipaaCompliant = false,
  } = options;

  @Injectable()
  class EnhancedAuthMiddleware implements NestMiddleware {
    constructor(
      private readonly authGuard: FlexibleAuthGuard,
      private readonly rateLimiter: RateLimitGuard,
      private readonly sanitizer: SanitizationService,
      private readonly rolesGuard?: RolesGuard
    ) {}

    async use(req: Request, res: Response, next: NextFunction) {
      try {
        // ================================================================
        // PHASE 1: AUTHENTICATION
        // ================================================================
        if (enableJWT || enableApiKey) {
          const context = this.createExecutionContext(req, res);
          const canActivate = await this.authGuard.canActivate(context);

          if (!canActivate) {
            res.status(401).json({
              statusCode: 401,
              message: 'Unauthorized',
              timestamp: new Date().toISOString(),
            });
            return;
          }
        }

        // ================================================================
        // PHASE 2: RATE LIMITING
        // ================================================================
        if (enableRateLimiting) {
          const context = this.createExecutionContext(req, res);
          const canActivate = await this.rateLimiter.canActivate(context);

          if (!canActivate) {
            res.status(429).json({
              statusCode: 429,
              message: 'Too many requests',
              timestamp: new Date().toISOString(),
              retryAfter: rateLimitWindow / 1000,
            });
            return;
          }
        }

        // ================================================================
        // PHASE 3: ROLE-BASED ACCESS CONTROL
        // ================================================================
        if (enableRBAC && this.rolesGuard && requiredRoles.length > 0) {
          const context = this.createExecutionContext(req, res);
          const canActivate = await this.rolesGuard.canActivate(context);

          if (!canActivate) {
            res.status(403).json({
              statusCode: 403,
              message: 'Forbidden - insufficient permissions',
              timestamp: new Date().toISOString(),
            });
            return;
          }
        }

        // ================================================================
        // PHASE 4: INPUT SANITIZATION
        // ================================================================
        if (enableSanitization) {
          if (req.body) {
            req.body = this.sanitizer.sanitizeObject(req.body);
          }
          if (req.query) {
            req.query = this.sanitizer.sanitizeObject(req.query);
          }
          if (req.params) {
            req.params = this.sanitizer.sanitizeObject(req.params);
          }
        }

        // ================================================================
        // PHASE 5: HIPAA COMPLIANCE CHECKS
        // ================================================================
        if (hipaaCompliant) {
          // Add HIPAA audit context
          (req as any).hipaaAudit = {
            accessTime: new Date(),
            userId: (req as any).user?.id,
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
            endpoint: req.path,
            method: req.method,
          };

          // Log PHI access
          console.log('[HIPAA Audit]', {
            timestamp: new Date().toISOString(),
            userId: (req as any).user?.id,
            endpoint: req.path,
            method: req.method,
            ipAddress: req.ip,
          });
        }

        next();
      } catch (error) {
        console.error('[EnhancedAuthMiddleware] Error:', error);
        res.status(500).json({
          statusCode: 500,
          message: hipaaCompliant
            ? 'Internal server error' // Generic for HIPAA
            : error.message,
          timestamp: new Date().toISOString(),
        });
      }
    }

    /**
     * Create execution context for guards
     */
    private createExecutionContext(req: Request, res: Response): any {
      return {
        switchToHttp: () => ({
          getRequest: () => req,
          getResponse: () => res,
        }),
        getHandler: () => ({}),
        getClass: () => ({}),
      };
    }
  }

  return EnhancedAuthMiddleware;
}

// ============================================================================
// MIDDLEWARE PRESETS
// ============================================================================

/**
 * Standard API middleware (auth + rate limiting + sanitization)
 */
export const StandardApiMiddleware = createAuthenticationMiddleware({
  enableJWT: true,
  enableApiKey: true,
  enableRateLimiting: true,
  rateLimitMax: 100,
  rateLimitWindow: 60000,
  enableSanitization: true,
  enableRBAC: false,
  hipaaCompliant: false,
});

/**
 * HIPAA-compliant middleware (all features + HIPAA compliance)
 */
export const HIPAAComplianceMiddleware = createAuthenticationMiddleware({
  enableJWT: true,
  enableApiKey: true,
  enableRateLimiting: true,
  rateLimitMax: 50, // Lower limit for PHI endpoints
  rateLimitWindow: 60000,
  enableSanitization: true,
  enableRBAC: true,
  hipaaCompliant: true,
});

/**
 * Public API middleware (no auth, rate limiting only)
 */
export const PublicApiMiddleware = createAuthenticationMiddleware({
  enableJWT: false,
  enableApiKey: false,
  enableRateLimiting: true,
  rateLimitMax: 200,
  rateLimitWindow: 60000,
  enableSanitization: true,
  enableRBAC: false,
  hipaaCompliant: false,
});

/**
 * Admin middleware (strict auth + RBAC)
 */
export const AdminMiddleware = createAuthenticationMiddleware({
  enableJWT: true,
  enableApiKey: false,
  enableRateLimiting: true,
  rateLimitMax: 1000,
  rateLimitWindow: 60000,
  enableSanitization: true,
  enableRBAC: true,
  requiredRoles: ['ADMIN', 'SUPER_ADMIN'],
  hipaaCompliant: false,
});

// ============================================================================
// EXPORT CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Create a threat intelligence-specific middleware
 */
export const ThreatIntelMiddleware = createAuthenticationMiddleware({
  enableJWT: true,
  enableApiKey: true,
  enableRateLimiting: true,
  rateLimitMax: 100,
  rateLimitWindow: 60000,
  enableSanitization: true,
  enableRBAC: true,
  requiredRoles: ['ANALYST', 'ADMIN'],
  hipaaCompliant: false,
});

/**
 * Create a healthcare-specific middleware (HIPAA compliant)
 */
export const HealthcareMiddleware = HIPAAComplianceMiddleware;
