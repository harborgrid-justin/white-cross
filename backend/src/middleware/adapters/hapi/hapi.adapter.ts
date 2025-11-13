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

import { Injectable } from '@nestjs/common';
import { Plugin, Request, ResponseToolkit, ServerRoute } from '@hapi/hapi';
import {
  HealthcareRequest,
  IMiddleware,
  INextFunction,
  IRequest,
  IResponse,
  MiddlewareContext,
} from '../../utils/types/middleware.types';
import {
  BaseHttpAdapter,
  BaseRequestWrapper,
  BaseResponseWrapper,
  BaseNextWrapper,
} from '../base/base-http.adapter';
import { AdapterUtilities } from '@/common/adapter-utilities';

/**
 * Hapi-specific request wrapper implementing IRequest interface
 */
export class HapiRequestWrapper extends BaseRequestWrapper {
  constructor(private hapiRequest: Request) {
    super(
      hapiRequest.method.toUpperCase(),
      hapiRequest.url.href,
      hapiRequest.url.pathname,
      hapiRequest.headers as Record<string, string | string[]>,
      hapiRequest.query,
      hapiRequest.params,
      hapiRequest.payload,
      hapiRequest.info.remoteAddress,
      hapiRequest.headers['user-agent'] as string,
      hapiRequest.headers['x-correlation-id'] as string,
      (hapiRequest as any).yar?.id,
      (hapiRequest as any).auth?.credentials,
    );
  }

  getRawRequest(): Request {
    return this.hapiRequest;
  }
}

/**
 * Hapi-specific response wrapper implementing IResponse interface
 */
export class HapiResponseWrapper extends BaseResponseWrapper {
  private _responseData: any = null;

  constructor(private hapiToolkit: ResponseToolkit) {
    super(200);
  }

  setStatus(code: number): this {
    super.setStatus(code);
    return this;
  }

  setHeader(name: string, value: string | string[]): this {
    super.setHeader(name, value);
    return this;
  }

  getHeader(name: string): string | string[] | undefined {
    return this.headers[name];
  }

  removeHeader(name: string): this {
    super.removeHeader(name);
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
    this._responseData = this.hapiToolkit.response(data).code(this.statusCode);

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
      this._responseData = this.hapiToolkit.response().code(this.statusCode);

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
export class HapiNextWrapper extends BaseNextWrapper {
  constructor(private continueFunc: () => any) {
    super();
  }

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
 * @description Injectable service that adapts framework-agnostic middleware to Hapi.js
 * lifecycle extensions, plugins, and route configurations. Handles request/response wrapping
 * and provides healthcare-specific enhancements.
 *
 * @example
 * // Inject the adapter in your NestJS service
 * constructor(private hapiAdapter: HapiMiddlewareAdapter) {}
 *
 * // Convert middleware to Hapi extension
 * const extension = this.hapiAdapter.adaptAsExtension(
 *   authenticationMiddleware,
 *   'onPreHandler'
 * );
 * server.ext(extension);
 *
 * @example
 * // Convert middleware to Hapi plugin
 * const plugin = this.hapiAdapter.adaptAsPlugin(
 *   loggingMiddleware,
 *   { name: 'logging', extensionPoint: 'onRequest' }
 * );
 * await server.register(plugin);
 */
@Injectable()
export class HapiMiddlewareAdapter extends BaseHttpAdapter {
  /**
   * Adapts framework-agnostic middleware to Hapi lifecycle extension
   *
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
   * const authExtension = this.hapiAdapter.adaptAsExtension(
   *   authMiddleware,
   *   'onPreHandler'
   * );
   * server.ext(authExtension);
   *
   * @example
   * // Add logging middleware at onRequest
   * const logExtension = this.hapiAdapter.adaptAsExtension(
   *   loggingMiddleware,
   *   'onRequest'
   * );
   * server.ext(logExtension);
   *
   * @example
   * // Response transformation at onPreResponse
   * const transformExtension = this.hapiAdapter.adaptAsExtension(
   *   responseTransformer,
   *   'onPreResponse'
   * );
   * server.ext(transformExtension);
   */
  adaptAsExtension(
    middleware: IMiddleware,
    point:
      | 'onRequest'
      | 'onPreAuth'
      | 'onCredentials'
      | 'onPostAuth'
      | 'onPreHandler'
      | 'onPostHandler'
      | 'onPreResponse' = 'onPreHandler',
  ) {
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
          correlationId:
            wrappedRequest.correlationId ||
            `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          framework: 'hapi',
          environment: process.env.NODE_ENV || 'development',
          metadata: {},
        };

        try {
          // Execute the framework-agnostic middleware
          await middleware.execute(
            wrappedRequest,
            wrappedResponse,
            wrappedNext,
            context,
          );

          // If response was set, return it
          if (wrappedResponse.headersSent) {
            return wrappedResponse.getHapiResponse();
          }

          // Continue with normal flow
          return h.continue;
        } catch (error) {
          throw error;
        }
      },
    };
  }

  /**
   * Adapts middleware as a Hapi plugin
   */
  adaptAsPlugin(
    middleware: IMiddleware,
    options: {
      name: string;
      version?: string;
      extensionPoint?:
        | 'onRequest'
        | 'onPreAuth'
        | 'onCredentials'
        | 'onPostAuth'
        | 'onPreHandler'
        | 'onPostHandler'
        | 'onPreResponse';
    },
  ): Plugin<any> {
    const {
      name,
      version = '1.0.0',
      extensionPoint = 'onPreHandler',
    } = options;

    return {
      name,
      version,
      register: async (server) => {
        const extension = this.adaptAsExtension(middleware, extensionPoint);
        server.ext(extension);
      },
    };
  }

  /**
   * Creates healthcare-specific request enhancement plugin
   */
  createHealthcareEnhancerPlugin(): Plugin<any> {
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
              patientId:
                request.params.patientId || (request.payload as any)?.patientId,
              facilityId: request.headers['x-facility-id'] as string,
              providerId:
                (request.auth?.credentials as any)?.userId ||
                (request.auth?.credentials as any)?.id,
              accessType: request.headers['x-access-type'] as
                | 'routine'
                | 'emergency'
                | 'break_glass',
              auditRequired: true,
              phiAccess: false,
              complianceFlags: [],
            };

            return h.continue;
          },
        });

        // Add healthcare response methods via server decoration
        server.decorate(
          'toolkit',
          'sendHipaaCompliant',
          function (
            data: any,
            options: {
              logAccess?: boolean;
              patientId?: string;
              dataType?: string;
            } = {},
          ) {
            const h = this;

            if (options.logAccess && options.patientId) {
              // Log PHI access for HIPAA compliance
              // This would be handled by audit middleware
            }

            // Remove sensitive fields in non-development environments
            if (process.env.NODE_ENV !== 'development') {
              data = HapiMiddlewareAdapter.sanitizeResponse(data);
            }

            return h.response(data).type('application/json');
          },
        );
      },
    };
  }

  /**
   * Sanitizes response data by removing sensitive fields
   */
  static sanitizeResponse(data: any): any {
    return BaseHttpAdapter.sanitizeResponse(data);
  }

  /**
   * Creates Hapi route with middleware integration
   */
  createRouteWithMiddleware(
    routeConfig: Omit<ServerRoute, 'handler'>,
    middlewares: IMiddleware[],
    handler: (request: Request, h: ResponseToolkit) => any,
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
            correlationId:
              wrappedRequest.correlationId ||
              `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            framework: 'hapi',
            environment: process.env.NODE_ENV || 'development',
            metadata: {},
          };

          try {
            await middleware.execute(
              wrappedRequest,
              wrappedResponse,
              wrappedNext,
              context,
            );

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
      },
    };
  }
}

/**
 * Hapi-specific middleware utilities
 * Injectable service for Hapi utility functions
 */
@Injectable()
export class HapiMiddlewareUtils extends BaseHttpAdapter {
  /**
   * Adapts framework-agnostic middleware to Hapi extension
   * (Required implementation for BaseHttpAdapter)
   */
  adapt(middleware: IMiddleware): any {
    const adapter = new HapiMiddlewareAdapter();
    return adapter.adaptAsExtension(middleware);
  }

  /**
   * Creates healthcare-specific request enhancement plugin
   * (Required implementation for BaseHttpAdapter)
   */
  createHealthcareEnhancer(): Plugin<any> {
    const adapter = new HapiMiddlewareAdapter();
    return adapter.createHealthcareEnhancerPlugin();
  }

  /**
   * Extracts correlation ID from Hapi request
   */
  getCorrelationId(request: Request): string {
    return this.extractCorrelationId(request.headers as Record<string, string | string[]>);
  }

  /**
   * Sets HIPAA-compliant security headers for Hapi responses
   */
  setSecurityHeaders(h: ResponseToolkit, response: any): any {
    const headers = this.getSecurityHeaders();
    let result = response;
    Object.entries(headers).forEach(([name, value]) => {
      result = result.header(name, value);
    });
    return result;
  }

  /**
   * Extracts user context from Hapi request
   */
  getUserContext(request: Request): any {
    const credentials = request.auth?.credentials as any;
    return this.extractUserContext(
      credentials,
      request.headers as Record<string, string | string[]>,
      (request as any).yar?.id,
    );
  }

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
}
