/**
 * @fileoverview Request Context Middleware
 * @module common/middleware/request-context
 * @description Middleware for request ID generation and propagation using AsyncLocalStorage
 *
 * This middleware:
 * - Generates or extracts request IDs
 * - Stores request context in AsyncLocalStorage
 * - Makes request IDs available throughout the request lifecycle
 * - Adds request IDs to response headers
 */

import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AsyncLocalStorage } from 'async_hooks';
import { v4 as uuidv4 } from 'uuid';

/**
 * Request context interface
 */
export interface RequestContext {
  requestId: string;
  userId?: string;
  organizationId?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

/**
 * AsyncLocalStorage instance for request context
 */
export const requestContextStorage = new AsyncLocalStorage<RequestContext>();

/**
 * Request Context Middleware
 *
 * @class RequestContextMiddleware
 * @implements {NestMiddleware}
 *
 * @description Manages request context and ID propagation
 *
 * @example
 * // In AppModule
 * export class AppModule implements NestModule {
 *   configure(consumer: MiddlewareConsumer) {
 *     consumer.apply(RequestContextMiddleware).forRoutes('*');
 *   }
 * }
 *
 * // Access request ID anywhere in the request lifecycle
 * const context = getRequestContext();
 * logger.log('Processing request', { requestId: context.requestId });
 */
@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Extract or generate request ID
    const requestId = this.extractRequestId(req);

    // Extract additional context
    const userId = (req as any).user?.id;
    const organizationId = (req as any).user?.organizationId;
    const ipAddress = this.getClientIp(req);
    const userAgent = req.headers['user-agent'];

    // Create request context
    const context: RequestContext = {
      requestId,
      userId,
      organizationId,
      ipAddress,
      userAgent,
      timestamp: new Date(),
    };

    // Store context and add to response headers
    res.setHeader('X-Request-ID', requestId);

    // Run the rest of the request in the context
    requestContextStorage.run(context, () => {
      next();
    });
  }

  /**
   * Extract or generate request ID
   */
  private extractRequestId(req: Request): string {
    // Check various headers for request ID
    const headerRequestId =
      req.headers['x-request-id'] ||
      req.headers['x-correlation-id'] ||
      req.headers['x-trace-id'];

    if (headerRequestId) {
      return Array.isArray(headerRequestId)
        ? headerRequestId[0]
        : headerRequestId;
    }

    // Generate new UUID v4
    return uuidv4();
  }

  /**
   * Get client IP address
   */
  private getClientIp(req: Request): string {
    return (
      (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
      (req.headers['x-real-ip'] as string) ||
      req.socket.remoteAddress ||
      'unknown'
    );
  }
}

/**
 * Get current request context
 *
 * @returns Current request context or undefined if not in request context
 */
export function getRequestContext(): RequestContext | undefined {
  return requestContextStorage.getStore();
}

/**
 * Get current request ID
 *
 * @returns Current request ID or undefined if not in request context
 */
export function getRequestId(): string | undefined {
  return getRequestContext()?.requestId;
}

/**
 * Get current user ID
 *
 * @returns Current user ID or undefined if not authenticated
 */
export function getCurrentUserId(): string | undefined {
  return getRequestContext()?.userId;
}

/**
 * Get current organization ID
 *
 * @returns Current organization ID or undefined if not available
 */
export function getCurrentOrganizationId(): string | undefined {
  return getRequestContext()?.organizationId;
}
