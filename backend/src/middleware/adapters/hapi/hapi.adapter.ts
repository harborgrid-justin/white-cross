/**
 * @fileoverview Hapi Framework Adapter for Healthcare Middleware System
 * @module middleware/adapters/hapi
 * @description Provides Hapi.js-specific implementations and adapters for framework-agnostic
 * middleware components. Converts framework-agnostic middleware to Hapi lifecycle extensions,
 * plugins, and route handlers with HIPAA-compliant healthcare context enhancement.
 *
 * Key Features:
 * - Framework-agnostic middleware → Hapi extension conversion
 * - Healthcare context enhancement for HIPAA compliance
 * - Request/Response wrapper implementations for IRequest/IResponse
 * - Plugin creation utilities for middleware integration
 * - Security headers and sanitization utilities
 * - PHI access tracking and audit logging support
 *
 * Architecture:
 * - HapiRequestWrapper: Adapts Hapi Request to IRequest interface
 * - HapiResponseWrapper: Adapts Hapi ResponseToolkit to IResponse interface
 * - HapiMiddlewareAdapter: Converts middleware to Hapi extensions/plugins
 * - HapiMiddlewareUtils: Utility functions for Hapi-specific operations
 *
 * @security Handles HIPAA-compliant request/response processing
 * @compliance HIPAA - PHI access tracking, audit logging, security headers
 *
 * @requires @hapi/hapi - Hapi.js framework types
 * @requires ../../utils/types/middleware.types - Framework-agnostic middleware types
 *
 * @version 1.0.0
 * @author Healthcare Platform Team
 * @since 2025-10-21
 */

import { Request, ResponseToolkit, ServerRoute, Plugin } from '@hapi/hapi';
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
 * Hapi-specific request wrapper implementing IRequest interface
 */
export class HapiRequestWrapper implements IRequest {
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

  constructor(private hapiRequest: Request) {
    this.method = hapiRequest.method.toUpperCase();
    this.url = hapiRequest.url.href;
    this.path = hapiRequest.url.pathname;
    this.headers = hapiRequest.headers as Record<string, string | string[]>;
    this.query = hapiRequest.query;
    this.params = hapiRequest.params;
    this.body = hapiRequest.payload;
    this.ip = hapiRequest.info.remoteAddress;
    this.userAgent = hapiRequest.headers['user-agent'] as string;
    this.correlationId = hapiRequest.headers['x-correlation-id'] as string;
    this.sessionId = (hapiRequest as any).yar?.id; // Assuming yar session plugin
    this.user = (hapiRequest as any).auth?.credentials;
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
    return this.hapiRequest;
  }
}

/**
 * Hapi-specific response wrapper implementing IResponse interface
 */
export class HapiResponseWrapper implements IResponse {
  public statusCode: number = 200;
  public headers: Record<string, string | string[]> = {};
  private _headersSent: boolean = false;
  private _responseData: any = null;

  constructor(private hapiToolkit: ResponseToolkit) {}

  setStatus(code: number): this {
    this.statusCode = code;
    return this;
  }

  setHeader(name: string, value: string | string[]): this {
    this.headers[name] = value;
    return this;
  }

  getHeader(name: string): string | string[] | undefined {
    return this.headers[name];
  }

  removeHeader(name: string): this {
    delete this.headers[name];
    return this;
  }

  json(data: any): void {
    this._headersSent = true;
    this._responseData = this.hapiToolkit
      .response(data)
      .code(this.statusCode)
      .type('application/json');
    
    // Apply headers
    Object.entries(this.headers).forEach(([name, value]) => {
      this._responseData.header(name, value);
    });
  }

  send(data: any): void {
    this._headersSent = true;
    this._responseData = this.hapiToolkit
      .response(data)
      .code(this.statusCode);
    
    // Apply headers
    Object.entries(this.headers).forEach(([name, value]) => {
      this._responseData.header(name, value);
    });
  }

  end(data?: any): void {
    if (data !== undefined) {
      this.send(data);
    } else {
      this._headersSent = true;
      this._responseData = this.hapiToolkit
        .response()
        .code(this.statusCode);
      
      // Apply headers
      Object.entries(this.headers).forEach(([name, value]) => {
        this._responseData.header(name, value);
      });
    }
  }

  redirect(statusCode: number, url: string): void;
  redirect(url: string): void;
  redirect(statusCodeOrUrl: number | string, url?: string): void {
    this._headersSent = true;
    if (typeof statusCodeOrUrl === 'number' && url) {
      this._responseData = this.hapiToolkit.redirect(url).code(statusCodeOrUrl);
    } else if (typeof statusCodeOrUrl === 'string') {
      this._responseData = this.hapiToolkit.redirect(statusCodeOrUrl);
    }
  }

  get headersSent(): boolean {
    return this._headersSent;
  }

  getRawResponse(): ResponseToolkit {
    return this.hapiToolkit;
  }

  getHapiResponse(): any {
    return this._responseData;
  }
}

/**
 * Hapi-specific next function wrapper
 */
export class HapiNextWrapper implements INextFunction {
  constructor(private continueFunc: () => any) {}

  call(error?: Error): void {
    if (error) {
      throw error; // Hapi handles errors differently
    }
    this.continueFunc();
  }

  getRawNext(): () => any {
    return this.continueFunc;
  }
}

/**
 * Hapi Middleware Adapter - Converts framework-agnostic middleware to Hapi components
 *
 * @class HapiMiddlewareAdapter
 * @description Static utility class that adapts framework-agnostic middleware to Hapi.js
 * lifecycle extensions, plugins, and route configurations. Handles request/response wrapping
 * and provides healthcare-specific enhancements.
 *
 * @example
 * // Convert middleware to Hapi extension
 * const extension = HapiMiddlewareAdapter.adaptAsExtension(
 *   authenticationMiddleware,
 *   'onPreHandler'
 * );
 * server.ext(extension);
 *
 * @example
 * // Convert middleware to Hapi plugin
 * const plugin = HapiMiddlewareAdapter.adaptAsPlugin(
 *   loggingMiddleware,
 *   { name: 'logging', extensionPoint: 'onRequest' }
 * );
 * await server.register(plugin);
 */
export class HapiMiddlewareAdapter {
  /**
   * Adapts framework-agnostic middleware to Hapi lifecycle extension
   *
   * @static
   * @function adaptAsExtension
   * @param {IMiddleware} middleware - Framework-agnostic middleware to adapt
   * @param {'onRequest'|'onPreAuth'|'onCredentials'|'onPostAuth'|'onPreHandler'|'onPostHandler'|'onPreResponse'} [point='onPreHandler'] - Hapi lifecycle extension point
   * @returns {Object} Hapi extension configuration object
   * @returns {string} returns.type - Extension point type
   * @returns {Function} returns.method - Extension handler function
   *
   * @description Wraps middleware in Hapi-compatible extension handler. Converts Hapi
   * Request/ResponseToolkit to framework-agnostic IRequest/IResponse interfaces, executes
   * middleware, and handles response appropriately.
   *
   * @example
   * // Add authentication middleware at onPreHandler
   * const authExtension = HapiMiddlewareAdapter.adaptAsExtension(
   *   authMiddleware,
   *   'onPreHandler'
   * );
   * server.ext(authExtension);
   *
   * @example
   * // Add logging middleware at onRequest
   * const logExtension = HapiMiddlewareAdapter.adaptAsExtension(
   *   loggingMiddleware,
   *   'onRequest'
   * );
   * server.ext(logExtension);
   *
   * @example
   * // Response transformation at onPreResponse
   * const transformExtension = HapiMiddlewareAdapter.adaptAsExtension(
   *   responseTransformer,
   *   'onPreResponse'
   * );
   * server.ext(transformExtension);
   */
  static adaptAsExtension(middleware: IMiddleware, point: 'onRequest' | 'onPreAuth' | 'onCredentials' | 'onPostAuth' | 'onPreHandler' | 'onPostHandler' | 'onPreResponse' = 'onPreHandler') {
    return {
      type: point,
      method: async (request: Request, h: ResponseToolkit) => {
        const wrappedRequest = new HapiRequestWrapper(request);
        const wrappedResponse = new HapiResponseWrapper(h);
        
        let nextCalled = false;
        const wrappedNext = new HapiNextWrapper(() => {
          nextCalled = true;
        });

        // Create middleware context
        const context: MiddlewareContext = {
          startTime: Date.now(),
          correlationId: wrappedRequest.correlationId || `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          framework: 'hapi',
          environment: process.env.NODE_ENV || 'development',
          metadata: {}
        };

        try {
          // Execute the framework-agnostic middleware
          await middleware.execute(wrappedRequest, wrappedResponse, wrappedNext, context);

          // If response was set, return it
          if (wrappedResponse.headersSent) {
            return wrappedResponse.getHapiResponse();
          }

          // Continue with normal flow
          return h.continue;
        } catch (error) {
          throw error;
        }
      }
    };
  }

  /**
   * Adapts middleware as a Hapi plugin
   */
  static adaptAsPlugin(middleware: IMiddleware, options: { 
    name: string; 
    version?: string; 
    extensionPoint?: 'onRequest' | 'onPreAuth' | 'onCredentials' | 'onPostAuth' | 'onPreHandler' | 'onPostHandler' | 'onPreResponse';
  }): Plugin<any> {
    const { name, version = '1.0.0', extensionPoint = 'onPreHandler' } = options;

    return {
      name,
      version,
      register: async (server) => {
        const extension = HapiMiddlewareAdapter.adaptAsExtension(middleware, extensionPoint);
        server.ext(extension);
      }
    };
  }

  /**
   * Creates healthcare-specific request enhancement plugin
   */
  static createHealthcareEnhancerPlugin(): Plugin<any> {
    return {
      name: 'healthcare-enhancer',
      version: '1.0.0',
      register: async (server) => {
        server.ext({
          type: 'onPreHandler',
          method: (request: Request, h: ResponseToolkit) => {
            // Add healthcare-specific properties to request
            const healthcareReq = request as any as HealthcareRequest;
            
            // Initialize healthcare context
            healthcareReq.healthcareContext = {
              patientId: request.params.patientId || (request.payload as any)?.patientId,
              facilityId: request.headers['x-facility-id'] as string,
              providerId: (request.auth?.credentials as any)?.userId || (request.auth?.credentials as any)?.id,
              accessType: request.headers['x-access-type'] as 'routine' | 'emergency' | 'break_glass',
              auditRequired: true,
              phiAccess: false,
              complianceFlags: []
            };

            return h.continue;
          }
        });

        // Add healthcare response methods via server decoration
        server.decorate('toolkit', 'sendHipaaCompliant', function(data: any, options: { 
          logAccess?: boolean; 
          patientId?: string; 
          dataType?: string 
        } = {}) {
          const h = this as ResponseToolkit;
          
          if (options.logAccess && options.patientId) {
            // Log PHI access for HIPAA compliance
            // This would be handled by audit middleware
          }
          
          // Remove sensitive fields in non-development environments
          if (process.env.NODE_ENV !== 'development') {
            data = HapiMiddlewareAdapter.sanitizeResponse(data);
          }
          
          return h.response(data).type('application/json');
        });
      }
    };
  }

  /**
   * Sanitizes response data by removing sensitive fields
   */
  static sanitizeResponse(data: any): any {
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
  }

  /**
   * Creates Hapi route with middleware integration
   */
  static createRouteWithMiddleware(
    routeConfig: Omit<ServerRoute, 'handler'>,
    middlewares: IMiddleware[],
    handler: (request: Request, h: ResponseToolkit) => any
  ): ServerRoute {
    return {
      ...routeConfig,
      handler: async (request: Request, h: ResponseToolkit) => {
        // Execute middlewares in sequence
        for (const middleware of middlewares) {
          const wrappedRequest = new HapiRequestWrapper(request);
          const wrappedResponse = new HapiResponseWrapper(h);
          
          let nextCalled = false;
          const wrappedNext = new HapiNextWrapper(() => {
            nextCalled = true;
          });

          const context: MiddlewareContext = {
            startTime: Date.now(),
            correlationId: wrappedRequest.correlationId || `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            framework: 'hapi',
            environment: process.env.NODE_ENV || 'development',
            metadata: {}
          };

          try {
            await middleware.execute(wrappedRequest, wrappedResponse, wrappedNext, context);

            // If middleware sent a response, return it
            if (wrappedResponse.headersSent) {
              return wrappedResponse.getHapiResponse();
            }
          } catch (error) {
            throw error;
          }
        }

        // Execute the actual handler
        return handler(request, h);
      }
    };
  }
}

/**
 * Hapi-specific middleware utilities
 */
export const HapiMiddlewareUtils = {
  /**
   * Extracts correlation ID from Hapi request
   */
  getCorrelationId(request: Request): string {
    return (request.headers['x-correlation-id'] as string) || 
           (request.headers['x-request-id'] as string) || 
           `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  },

  /**
   * Sets HIPAA-compliant security headers for Hapi responses
   */
  setSecurityHeaders(h: ResponseToolkit, response: any): any {
    return response
      .header('X-Content-Type-Options', 'nosniff')
      .header('X-Frame-Options', 'DENY')
      .header('X-XSS-Protection', '1; mode=block')
      .header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
      .header('Referrer-Policy', 'strict-origin-when-cross-origin')
      .header('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  },

  /**
   * Extracts user context from Hapi request
   */
  getUserContext(request: Request): any {
    const credentials = request.auth?.credentials as any;
    return {
      id: credentials?.userId || credentials?.id,
      role: credentials?.role,
      permissions: credentials?.permissions || [],
      facilityId: credentials?.facilityId || request.headers['x-facility-id'],
      sessionId: (request as any).yar?.id
    };
  },

  /**
   * Creates error response with HIPAA compliance
   */
  createErrorResponse(h: ResponseToolkit, error: Error, statusCode: number = 500): any {
    const sanitizedError = process.env.NODE_ENV === 'development' 
      ? { message: error.message, stack: error.stack }
      : { message: 'Internal Server Error' };

    return h
      .response(sanitizedError)
      .code(statusCode)
      .type('application/json');
  },

  /**
   * Validates healthcare context in request
   */
  validateHealthcareContext(request: Request): boolean {
    const healthcareReq = request as any as HealthcareRequest;
    return !!(
      healthcareReq.healthcareContext &&
      healthcareReq.healthcareContext.accessType &&
      healthcareReq.healthcareContext.auditRequired !== undefined
    );
  }
};

export default HapiMiddlewareAdapter;
