/**
 * @fileoverview Express Framework Adapter for Healthcare Middleware System
 * @module middleware/adapters/express
 * @description Provides Express.js-specific implementations and adapters for framework-agnostic
 * middleware components. Converts framework-agnostic middleware to Express middleware functions
 * with HIPAA-compliant healthcare context enhancement and error handling.
 *
 * Key Features:
 * - Framework-agnostic middleware → Express RequestHandler conversion
 * - Healthcare context enhancement for HIPAA compliance
 * - Request/Response wrapper implementations for IRequest/IResponse
 * - Error handler creation utilities
 * - Middleware chaining utilities
 * - Security headers and sanitization utilities
 * - PHI access tracking and audit logging support
 *
 * Architecture:
 * - ExpressRequestWrapper: Adapts Express Request to IRequest interface
 * - ExpressResponseWrapper: Adapts Express Response to IResponse interface
 * - ExpressMiddlewareAdapter: Converts middleware to Express RequestHandler
 * - ExpressMiddlewareUtils: Utility functions for Express-specific operations
 *
 * @security Handles HIPAA-compliant request/response processing
 * @compliance HIPAA - PHI access tracking, audit logging, security headers
 *
 * @requires express - Express.js framework types
 * @requires ../../utils/types/middleware.types - Framework-agnostic middleware types
 *
 * @version 1.0.0
 * @author Healthcare Platform Team
 * @since 2025-10-21
 */

import { Injectable } from '@nestjs/common';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import {
  IMiddleware,
  IRequest,
  IResponse,
  INextFunction,
  MiddlewareContext,
  HealthcareRequest,
  HealthcareResponse
} from '../../utils/types/middleware.types';

/**
 * Express-specific request wrapper implementing IRequest interface
 */
export class ExpressRequestWrapper implements IRequest {
  public readonly method: string;
  public readonly url: string;
  public readonly path: string;
  public readonly headers: Record<string, string | string[]>;
  public readonly query: Record<string, any>;
  public readonly params: Record<string, any>;
  public readonly body: any;
  public readonly ip: string;
  public readonly userAgent?: string;
  public readonly correlationId?: string;
  public readonly sessionId?: string;
  public readonly user?: any;
  public readonly metadata: Record<string, any> = {};

  constructor(private expressRequest: Request) {
    this.method = expressRequest.method;
    this.url = expressRequest.url;
    this.path = expressRequest.path;
    this.headers = expressRequest.headers as Record<string, string | string[]>;
    this.query = expressRequest.query;
    this.params = expressRequest.params;
    this.body = expressRequest.body;
    this.ip = expressRequest.ip || expressRequest.connection?.remoteAddress || 'unknown';
    this.userAgent = expressRequest.get('User-Agent');
    this.correlationId = expressRequest.get('X-Correlation-ID');
    this.sessionId = (expressRequest as any).sessionID;
    this.user = expressRequest.user;
  }

  getHeader(name: string): string | string[] | undefined {
    return this.headers[name.toLowerCase()];
  }

  setMetadata(key: string, value: any): void {
    this.metadata[key] = value;
  }

  getMetadata<T = any>(key: string): T | undefined {
    return this.metadata[key];
  }

  getRawRequest(): Request {
    return this.expressRequest;
  }
}

/**
 * Express-specific response wrapper implementing IResponse interface
 */
export class ExpressResponseWrapper implements IResponse {
  public statusCode: number;
  public headers: Record<string, string | string[]> = {};
  private _headersSent: boolean = false;

  constructor(private expressResponse: Response) {
    this.statusCode = expressResponse.statusCode;
  }

  setStatus(code: number): this {
    this.statusCode = code;
    this.expressResponse.status(code);
    return this;
  }

  setHeader(name: string, value: string | string[]): this {
    this.headers[name] = value;
    this.expressResponse.setHeader(name, value);
    return this;
  }

  getHeader(name: string): string | string[] | undefined {
    return this.expressResponse.getHeader(name) as string | string[] | undefined;
  }

  removeHeader(name: string): this {
    delete this.headers[name];
    this.expressResponse.removeHeader(name);
    return this;
  }

  json(data: any): void {
    this._headersSent = true;
    this.expressResponse.json(data);
  }

  send(data: any): void {
    this._headersSent = true;
    this.expressResponse.send(data);
  }

  end(data?: any): void {
    this._headersSent = true;
    if (data !== undefined) {
      this.expressResponse.end(data);
    } else {
      this.expressResponse.end();
    }
  }

  redirect(statusCode: number, url: string): void;
  redirect(url: string): void;
  redirect(statusCodeOrUrl: number | string, url?: string): void {
    this._headersSent = true;
    if (typeof statusCodeOrUrl === 'number' && url) {
      this.expressResponse.redirect(statusCodeOrUrl, url);
    } else if (typeof statusCodeOrUrl === 'string') {
      this.expressResponse.redirect(statusCodeOrUrl);
    }
  }

  get headersSent(): boolean {
    return this._headersSent || this.expressResponse.headersSent;
  }

  getRawResponse(): Response {
    return this.expressResponse;
  }
}

/**
 * Express-specific next function wrapper
 */
export class ExpressNextWrapper implements INextFunction {
  constructor(private expressNext: NextFunction) {}

  call(error?: Error): void {
    this.expressNext(error);
  }

  getRawNext(): NextFunction {
    return this.expressNext;
  }
}

/**
 * Express Middleware Adapter - Converts framework-agnostic middleware to Express components
 *
 * @class ExpressMiddlewareAdapter
 * @description Injectable service that adapts framework-agnostic middleware to Express.js
 * middleware functions (RequestHandler), error handlers, and provides healthcare-specific
 * request/response enhancements.
 *
 * @example
 * // Inject the adapter in your NestJS service or controller
 * constructor(private expressAdapter: ExpressMiddlewareAdapter) {}
 *
 * // Convert middleware to Express RequestHandler
 * const expressMiddleware = this.expressAdapter.adapt(authenticationMiddleware);
 * app.use(expressMiddleware);
 *
 * @example
 * // Chain multiple middleware
 * const middlewares = this.expressAdapter.chain(
 *   corsMiddleware,
 *   authMiddleware,
 *   rbacMiddleware
 * );
 * app.use('/api', ...middlewares);
 *
 * @example
 * // Create error handler
 * const errorHandler = this.expressAdapter.createErrorHandler(
 *   (error, req, res, context) => {
 *     res.setStatus(500).json({ error: error.message });
 *   }
 * );
 * app.use(errorHandler);
 */
@Injectable()
export class ExpressMiddlewareAdapter {
  /**
   * Adapts framework-agnostic middleware to Express RequestHandler
   *
   * @param {IMiddleware} middleware - Framework-agnostic middleware to adapt
   * @returns {RequestHandler} Express middleware function
   *
   * @description Wraps middleware in Express-compatible handler. Converts Express
   * Request/Response/NextFunction to framework-agnostic IRequest/IResponse/INextFunction
   * interfaces, executes middleware with proper context.
   *
   * @example
   * // Use with authentication middleware
   * const authMiddleware = this.expressAdapter.adapt(jwtAuthMiddleware);
   * app.use('/api', authMiddleware);
   *
   * @example
   * // Use with logging middleware
   * const logger = this.expressAdapter.adapt(loggingMiddleware);
   * app.use(logger);
   *
   * @example
   * // Apply to specific routes
   * app.get('/protected',
   *   this.expressAdapter.adapt(authMiddleware),
   *   (req, res) => {
   *     res.json({ message: 'Protected resource' });
   *   }
   * );
   */
  adapt(middleware: IMiddleware): RequestHandler {
    return (req: Request, res: Response, next: NextFunction): void => {
      const wrappedRequest = new ExpressRequestWrapper(req);
      const wrappedResponse = new ExpressResponseWrapper(res);
      const wrappedNext = new ExpressNextWrapper(next);

      // Create middleware context
      const context: MiddlewareContext = {
        startTime: Date.now(),
        correlationId: wrappedRequest.correlationId || `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        framework: 'express',
        environment: process.env.NODE_ENV || 'development',
        metadata: {}
      };

      // Execute the framework-agnostic middleware
      middleware.execute(wrappedRequest, wrappedResponse, wrappedNext, context);
    };
  }

  /**
   * Creates Express middleware from healthcare-specific middleware configuration
   */
  createHealthcareMiddleware(
    middlewareFactory: (config: any) => IMiddleware,
    config: any = {}
  ): RequestHandler {
    const middleware = middlewareFactory(config);
    return this.adapt(middleware);
  }

  /**
   * Chains multiple middleware adapters together
   */
  chain(...middlewares: IMiddleware[]): RequestHandler[] {
    return middlewares.map(middleware => this.adapt(middleware));
  }

  /**
   * Creates error handling middleware for Express
   */
  createErrorHandler(
    errorHandler: (error: Error, request: IRequest, response: IResponse, context: MiddlewareContext) => void
  ): (err: Error, req: Request, res: Response, next: NextFunction) => void {
    return (err: Error, req: Request, res: Response, next: NextFunction): void => {
      const wrappedRequest = new ExpressRequestWrapper(req);
      const wrappedResponse = new ExpressResponseWrapper(res);

      const context: MiddlewareContext = {
        startTime: Date.now(),
        correlationId: wrappedRequest.correlationId || `err-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        framework: 'express',
        environment: process.env.NODE_ENV || 'development',
        metadata: { error: true }
      };

      try {
        errorHandler(err, wrappedRequest, wrappedResponse, context);
      } catch (handlerError) {
        // Fallback to Express default error handling
        next(handlerError);
      }
    };
  }

  /**
   * Creates healthcare-specific request enhancement middleware
   */
  createHealthcareEnhancer(): RequestHandler {
    return (req: Request, res: Response, next: NextFunction): void => {
      // Add healthcare-specific properties to request
      const healthcareReq = req as HealthcareRequest;

      // Initialize healthcare context
      healthcareReq.healthcareContext = {
        patientId: req.params.patientId || req.body?.patientId,
        facilityId: req.headers['x-facility-id'] as string,
        providerId: (req.user as any)?.userId || (req.user as any)?.id,
        accessType: req.headers['x-access-type'] as 'routine' | 'emergency' | 'break_glass',
        auditRequired: true,
        phiAccess: false,
        complianceFlags: []
      };

      // Add healthcare-specific response methods
      const healthcareRes = res as HealthcareResponse;

      healthcareRes.sendHipaaCompliant = function(data: any, options: {
        logAccess?: boolean;
        patientId?: string;
        dataType?: string
      } = {}) {
        if (options.logAccess && options.patientId) {
          // Log PHI access for HIPAA compliance
          healthcareReq.healthcareContext.phiAccess = true;
        }

        // Remove sensitive fields in non-development environments
        if (process.env.NODE_ENV !== 'development') {
          data = this.sanitizeResponse(data);
        }

        return this.json(data);
      };

      healthcareRes.sanitizeResponse = function(data: any): any {
        if (!data) return data;

        // Remove common sensitive fields
        const sensitiveFields = ['ssn', 'socialSecurityNumber', 'password', 'token'];

        if (typeof data === 'object') {
          const sanitized = { ...data };
          sensitiveFields.forEach(field => {
            if (sanitized[field]) {
              delete sanitized[field];
            }
          });
          return sanitized;
        }

        return data;
      };

      next();
    };
  }
}

/**
 * Express-specific middleware utilities
 * Injectable service for Express utility functions
 */
@Injectable()
export class ExpressMiddlewareUtils {
  /**
   * Extracts correlation ID from Express request
   */
  getCorrelationId(req: Request): string {
    return req.get('X-Correlation-ID') ||
           req.get('X-Request-ID') ||
           `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Sets HIPAA-compliant security headers for Express responses
   */
  setSecurityHeaders(res: Response): void {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  }

  /**
   * Extracts user context from Express request
   */
  getUserContext(req: Request): any {
    const user = req.user as any;
    return {
      id: user?.userId || user?.id,
      role: user?.role,
      permissions: user?.permissions || [],
      facilityId: user?.facilityId || req.get('X-Facility-ID'),
      sessionId: (req as any).sessionID
    };
  }
}
