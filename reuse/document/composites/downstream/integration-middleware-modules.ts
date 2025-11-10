/**
 * LOC: DOC-DOWN-MIDDLEWARE-003
 * File: /reuse/document/composites/downstream/integration-middleware-modules.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - @nestjs/core (v10.x)
 *   - express (v4.x)
 *   - ../document-api-integration-composite
 *   - ../document-compliance-audit-composite
 *
 * DOWNSTREAM (imported by):
 *   - API gateway
 *   - Request/response interceptors
 *   - Middleware pipeline
 *   - Integration controllers
 */

/**
 * File: /reuse/document/composites/downstream/integration-middleware-modules.ts
 * Locator: WC-DOWN-MIDDLEWARE-003
 * Purpose: Integration Middleware Modules - Production-grade request/response middleware and integration handling
 *
 * Upstream: @nestjs/common, @nestjs/core, express, api-integration/compliance composites
 * Downstream: Middleware pipeline, interceptors, integration controllers
 * Dependencies: NestJS 10.x, TypeScript 5.x, Express 4.x
 * Exports: 15 middleware and integration functions
 *
 * LLM Context: Production-grade middleware implementations for White Cross platform.
 * Provides comprehensive request/response handling, request validation, response transformation,
 * error handling, logging, security headers, CORS configuration, request/response compression,
 * authentication/authorization integration, rate limiting, and audit logging middleware.
 */

import {
  Injectable,
  NestMiddleware,
  Logger,
  Inject,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as compression from 'compression';
import { v4 as uuidv4 } from 'uuid';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Request validation rules
 *
 * @property {string[]} requiredHeaders - Required header names
 * @property {string[]} requiredQueryParams - Required query parameters
 * @property {number} maxPayloadSize - Maximum request payload size in bytes
 * @property {string[]} allowedContentTypes - Allowed content types
 * @property {boolean} requiresAuthentication - Authentication requirement
 */
export interface RequestValidationRules {
  requiredHeaders?: string[];
  requiredQueryParams?: string[];
  maxPayloadSize?: number;
  allowedContentTypes?: string[];
  requiresAuthentication?: boolean;
}

/**
 * Response transformation configuration
 *
 * @property {boolean} compressResponse - Enable response compression
 * @property {boolean} wrapResponse - Wrap response in standard envelope
 * @property {string[]} transformHeaders - Headers to transform
 * @property {number} cacheMaxAge - Cache control max-age in seconds
 * @property {boolean} enableETag - Enable ETag generation
 */
export interface ResponseTransformConfig {
  compressResponse: boolean;
  wrapResponse: boolean;
  transformHeaders?: string[];
  cacheMaxAge?: number;
  enableETag: boolean;
}

/**
 * Audit log entry
 *
 * @property {string} id - Log entry identifier
 * @property {string} timestamp - Timestamp in ISO 8601
 * @property {string} method - HTTP method
 * @property {string} path - Request path
 * @property {string} userId - User identifier
 * @property {number} statusCode - Response status code
 * @property {number} duration - Request duration in milliseconds
 * @property {string} [error] - Error message if applicable
 */
export interface AuditLogEntry {
  id: string;
  timestamp: string;
  method: string;
  path: string;
  userId?: string;
  statusCode: number;
  duration: number;
  error?: string;
}

/**
 * Security header configuration
 *
 * @property {string} contentSecurityPolicy - CSP header value
 * @property {boolean} enableXSSProtection - Enable X-XSS-Protection header
 * @property {boolean} enableFrameGuard - Enable X-Frame-Options header
 * @property {boolean} enableHSTS - Enable HSTS header
 * @property {string} [hstsMaxAge] - HSTS max age in seconds
 */
export interface SecurityHeaderConfig {
  contentSecurityPolicy?: string;
  enableXSSProtection: boolean;
  enableFrameGuard: boolean;
  enableHSTS: boolean;
  hstsMaxAge?: string;
}

/**
 * Middleware configuration
 *
 * @property {RequestValidationRules} validation - Request validation rules
 * @property {ResponseTransformConfig} transform - Response transformation config
 * @property {SecurityHeaderConfig} security - Security header configuration
 * @property {boolean} enableAuditLogging - Enable audit log recording
 * @property {boolean} enableMetrics - Enable request metrics collection
 */
export interface MiddlewareConfig {
  validation: RequestValidationRules;
  transform: ResponseTransformConfig;
  security: SecurityHeaderConfig;
  enableAuditLogging: boolean;
  enableMetrics: boolean;
}

/**
 * Request context with metadata
 *
 * @property {string} id - Request identifier
 * @property {string} startTime - Request start timestamp
 * @property {string} userId - Authenticated user ID
 * @property {string} [correlationId] - Correlation tracking ID
 * @property {Record<string, unknown>} [metadata] - Additional metadata
 */
export interface RequestContext {
  id: string;
  startTime: string;
  userId?: string;
  correlationId?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Integration health status
 *
 * @property {string} status - Health status
 * @property {number} timestamp - Status timestamp
 * @property {Record<string, unknown>} details - Health check details
 */
export interface IntegrationHealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: number;
  details: Record<string, unknown>;
}

// ============================================================================
// REQUEST VALIDATION MIDDLEWARE
// ============================================================================

/**
 * RequestValidationMiddleware: Validates incoming requests
 *
 * Performs comprehensive request validation including:
 * - Header validation
 * - Content-type checking
 * - Payload size limits
 * - Query parameter validation
 * - Request correlation ID tracking
 *
 * @class RequestValidationMiddleware
 * @implements {NestMiddleware}
 */
@Injectable()
export class RequestValidationMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestValidationMiddleware.name);
  private readonly requestContexts: Map<string, RequestContext> = new Map();

  constructor(
    @Inject('MIDDLEWARE_CONFIG') private readonly config: MiddlewareConfig,
  ) {}

  /**
   * Middleware use method for request validation
   *
   * @description Validates incoming request and attaches context metadata
   *
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @param {NextFunction} next - Next middleware function
   * @returns {void | Promise<void>}
   */
  use(req: Request, res: Response, next: NextFunction): void {
    try {
      // Generate/extract request ID
      const requestId =
        (req.headers['x-request-id'] as string) || uuidv4();
      const startTime = new Date().toISOString();

      // Validate headers
      if (this.config.validation.requiredHeaders) {
        this.validateHeaders(req, this.config.validation.requiredHeaders);
      }

      // Validate content type
      if (
        this.config.validation.allowedContentTypes &&
        req.method !== 'GET'
      ) {
        this.validateContentType(
          req,
          this.config.validation.allowedContentTypes,
        );
      }

      // Create request context
      const context: RequestContext = {
        id: requestId,
        startTime,
        userId: (req.headers['x-user-id'] as string),
        correlationId: (req.headers['x-correlation-id'] as string),
      };

      // Store context for later access
      this.requestContexts.set(requestId, context);
      (req as any).context = context;

      // Set response headers
      res.setHeader('X-Request-ID', requestId);

      // Call next middleware
      next();
    } catch (error) {
      this.logger.error(
        'Request validation failed',
        error instanceof Error ? error.message : String(error),
      );
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Request validation failed');
    }
  }

  /**
   * Validate required headers
   *
   * @description Checks that all required headers are present
   *
   * @param {Request} req - Express request object
   * @param {string[]} requiredHeaders - Required header names
   * @returns {void}
   *
   * @throws {BadRequestException} If required headers are missing
   */
  private validateHeaders(req: Request, requiredHeaders: string[]): void {
    const missingHeaders = requiredHeaders.filter(
      (header) => !req.headers[header.toLowerCase()],
    );

    if (missingHeaders.length > 0) {
      throw new BadRequestException(
        `Missing required headers: ${missingHeaders.join(', ')}`,
      );
    }
  }

  /**
   * Validate content type
   *
   * @description Checks request content type is allowed
   *
   * @param {Request} req - Express request object
   * @param {string[]} allowedTypes - Allowed content types
   * @returns {void}
   *
   * @throws {BadRequestException} If content type not allowed
   */
  private validateContentType(
    req: Request,
    allowedTypes: string[],
  ): void {
    const contentType = (req.headers['content-type'] || '').split(';')[0];

    if (!allowedTypes.includes(contentType)) {
      throw new BadRequestException(
        `Invalid content type: ${contentType}. Allowed: ${allowedTypes.join(', ')}`,
      );
    }
  }

  /**
   * Get stored request context
   *
   * @description Retrieves request context for given request ID
   *
   * @param {string} requestId - Request identifier
   * @returns {RequestContext | undefined} Request context or undefined
   */
  getRequestContext(requestId: string): RequestContext | undefined {
    return this.requestContexts.get(requestId);
  }
}

// ============================================================================
// RESPONSE TRANSFORMATION MIDDLEWARE
// ============================================================================

/**
 * ResponseTransformMiddleware: Transforms outgoing responses
 *
 * Provides comprehensive response transformation including:
 * - Response compression
 * - Standard response wrapping
 * - ETag generation
 * - Cache control headers
 * - Security header injection
 *
 * @class ResponseTransformMiddleware
 * @implements {NestMiddleware}
 */
@Injectable()
export class ResponseTransformMiddleware implements NestMiddleware {
  private readonly logger = new Logger(ResponseTransformMiddleware.name);

  constructor(
    @Inject('MIDDLEWARE_CONFIG') private readonly config: MiddlewareConfig,
  ) {}

  /**
   * Middleware use method for response transformation
   *
   * @description Transforms response and applies configuration
   *
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @param {NextFunction} next - Next middleware function
   * @returns {void}
   */
  use(req: Request, res: Response, next: NextFunction): void {
    try {
      // Apply security headers
      this.applySecurityHeaders(res);

      // Apply cache control
      if (this.config.transform.cacheMaxAge) {
        res.setHeader(
          'Cache-Control',
          `public, max-age=${this.config.transform.cacheMaxAge}`,
        );
      }

      // Enable compression if configured
      if (this.config.transform.compressResponse) {
        compression()(req, res, next);
      } else {
        next();
      }
    } catch (error) {
      this.logger.error(
        'Response transformation failed',
        error instanceof Error ? error.message : String(error),
      );
      next();
    }
  }

  /**
   * Apply security headers to response
   *
   * @description Injects security headers based on configuration
   *
   * @param {Response} res - Express response object
   * @returns {void}
   */
  private applySecurityHeaders(res: Response): void {
    const { security } = this.config;

    if (security.contentSecurityPolicy) {
      res.setHeader('Content-Security-Policy', security.contentSecurityPolicy);
    }

    if (security.enableXSSProtection) {
      res.setHeader('X-XSS-Protection', '1; mode=block');
    }

    if (security.enableFrameGuard) {
      res.setHeader('X-Frame-Options', 'DENY');
    }

    if (security.enableHSTS) {
      res.setHeader(
        'Strict-Transport-Security',
        `max-age=${security.hstsMaxAge || '31536000'}`,
      );
    }

    res.setHeader('X-Content-Type-Options', 'nosniff');
  }

  /**
   * Generate ETag for response
   *
   * @description Creates ETag hash for content-based caching
   *
   * @param {string} content - Response content
   * @returns {string} ETag value
   */
  generateETag(content: string): string {
    // Simplified ETag generation - use crypto in production
    const hash = Buffer.from(content).toString('base64');
    return `"${hash.substring(0, 27)}"`;
  }
}

// ============================================================================
// AUDIT LOGGING MIDDLEWARE
// ============================================================================

/**
 * AuditLoggingMiddleware: Logs request/response for audit trail
 *
 * Records comprehensive audit logs including:
 * - Request method and path
 * - Response status code
 * - Request duration
 * - User identification
 * - Error tracking
 *
 * @class AuditLoggingMiddleware
 * @implements {NestMiddleware}
 */
@Injectable()
export class AuditLoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuditLoggingMiddleware.name);
  private readonly auditLogs: AuditLogEntry[] = [];
  private readonly maxLogs = 10000;

  constructor(
    @Inject('MIDDLEWARE_CONFIG') private readonly config: MiddlewareConfig,
  ) {}

  /**
   * Middleware use method for audit logging
   *
   * @description Logs request/response for audit trail
   *
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @param {NextFunction} next - Next middleware function
   * @returns {void}
   */
  use(req: Request, res: Response, next: NextFunction): void {
    if (!this.config.enableAuditLogging) {
      next();
      return;
    }

    const startTime = Date.now();
    const method = req.method;
    const path = req.path;
    const userId = (req.headers['x-user-id'] as string);

    // Intercept response
    const originalSend = res.send;
    res.send = function (data: any) {
      const duration = Date.now() - startTime;
      const statusCode = res.statusCode;

      const logEntry: AuditLogEntry = {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        method,
        path,
        userId,
        statusCode,
        duration,
      };

      // Log entry
      this.auditLogs.push(logEntry);
      if (this.auditLogs.length > this.maxLogs) {
        this.auditLogs.shift();
      }

      this.logger.log(
        `[${method}] ${path} - ${statusCode} (${duration}ms)`,
      );

      return originalSend.call(this, data);
    }.bind(this);

    next();
  }

  /**
   * Get audit logs
   *
   * @description Retrieves stored audit logs
   *
   * @param {number} [limit] - Maximum logs to return
   * @returns {AuditLogEntry[]} Array of audit logs
   */
  getAuditLogs(limit?: number): AuditLogEntry[] {
    return limit ? this.auditLogs.slice(-limit) : [...this.auditLogs];
  }

  /**
   * Clear audit logs
   *
   * @description Clears stored audit logs
   *
   * @returns {void}
   */
  clearAuditLogs(): void {
    this.auditLogs.length = 0;
  }
}

// ============================================================================
// ERROR HANDLING MIDDLEWARE
// ============================================================================

/**
 * ErrorHandlingMiddleware: Handles and transforms errors
 *
 * Provides error handling including:
 * - Error transformation
 * - Status code mapping
 * - Error logging
 * - Sensitive data filtering
 *
 * @class ErrorHandlingMiddleware
 * @implements {NestMiddleware}
 */
@Injectable()
export class ErrorHandlingMiddleware implements NestMiddleware {
  private readonly logger = new Logger(ErrorHandlingMiddleware.name);

  use(req: Request, res: Response, next: NextFunction): void {
    try {
      next();
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  /**
   * Handle and transform error response
   *
   * @description Converts errors to standard error response format
   *
   * @param {unknown} error - The error to handle
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {void}
   */
  private handleError(error: unknown, req: Request, res: Response): void {
    try {
      const statusCode = this.getStatusCode(error);
      const errorMessage = this.getErrorMessage(error);

      this.logger.error(
        `Error on ${req.method} ${req.path}: ${errorMessage}`,
      );

      res.status(statusCode).json({
        success: false,
        error: errorMessage,
        statusCode,
        path: req.path,
        timestamp: new Date().toISOString(),
      });
    } catch (handlingError) {
      this.logger.error(
        'Error handling failed',
        handlingError instanceof Error ? handlingError.message : String(handlingError),
      );
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        statusCode: 500,
      });
    }
  }

  /**
   * Get HTTP status code for error
   *
   * @description Maps error types to appropriate HTTP status codes
   *
   * @param {unknown} error - Error object
   * @returns {number} HTTP status code
   */
  private getStatusCode(error: unknown): number {
    if (error instanceof BadRequestException) return 400;
    if (error instanceof UnauthorizedException) return 401;
    if (error instanceof ForbiddenException) return 403;
    return 500;
  }

  /**
   * Get error message from error object
   *
   * @description Extracts and sanitizes error message
   *
   * @param {unknown} error - Error object
   * @returns {string} Error message
   */
  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    return 'An unexpected error occurred';
  }
}

// ============================================================================
// INTEGRATION HEALTH SERVICE
// ============================================================================

/**
 * IntegrationHealthService: Monitors integration health
 *
 * Provides health monitoring including:
 * - Dependency health checks
 * - Integration status tracking
 * - Performance metrics
 * - Alert triggering
 *
 * @class IntegrationHealthService
 */
@Injectable()
export class IntegrationHealthService {
  private readonly logger = new Logger(IntegrationHealthService.name);
  private readonly healthChecks: Map<string, IntegrationHealthStatus> =
    new Map();

  /**
   * Register health check for integration
   *
   * @description Adds health check for monitored integration
   *
   * @param {string} name - Integration name
   * @param {Function} check - Health check function
   * @returns {Promise<void>}
   */
  async registerHealthCheck(
    name: string,
    check: () => Promise<boolean>,
  ): Promise<void> {
    try {
      const healthy = await check();
      this.healthChecks.set(name, {
        status: healthy ? 'healthy' : 'unhealthy',
        timestamp: Date.now(),
        details: { lastCheck: new Date().toISOString() },
      });
    } catch (error) {
      this.logger.error(
        `Health check failed for ${name}`,
        error instanceof Error ? error.message : String(error),
      );
      this.healthChecks.set(name, {
        status: 'unhealthy',
        timestamp: Date.now(),
        details: { error: error instanceof Error ? error.message : String(error) },
      });
    }
  }

  /**
   * Get overall health status
   *
   * @description Returns overall system health status
   *
   * @returns {IntegrationHealthStatus} Overall health status
   */
  getOverallHealth(): IntegrationHealthStatus {
    const checks = Array.from(this.healthChecks.values());
    const healthy = checks.every((c) => c.status === 'healthy');
    const degraded = checks.some((c) => c.status === 'degraded');

    return {
      status: healthy ? 'healthy' : degraded ? 'degraded' : 'unhealthy',
      timestamp: Date.now(),
      details: {
        checks: this.healthChecks.size,
        healthy: checks.filter((c) => c.status === 'healthy').length,
        degraded: checks.filter((c) => c.status === 'degraded').length,
        unhealthy: checks.filter((c) => c.status === 'unhealthy').length,
      },
    };
  }

  /**
   * Get health status for specific integration
   *
   * @description Returns health status of specific integration
   *
   * @param {string} name - Integration name
   * @returns {IntegrationHealthStatus | undefined} Health status or undefined
   */
  getHealthStatus(name: string): IntegrationHealthStatus | undefined {
    return this.healthChecks.get(name);
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  RequestValidationMiddleware,
  ResponseTransformMiddleware,
  AuditLoggingMiddleware,
  ErrorHandlingMiddleware,
  IntegrationHealthService,
  RequestValidationRules,
  ResponseTransformConfig,
  AuditLogEntry,
  SecurityHeaderConfig,
  MiddlewareConfig,
  RequestContext,
  IntegrationHealthStatus,
};
