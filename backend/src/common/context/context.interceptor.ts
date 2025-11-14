/**
 * Context Interceptor
 *
 * NestJS interceptor that initializes and manages request context using AsyncLocalStorage.
 */

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { RequestContextService } from './request-context.service';
import { BaseInterceptor } from '../interceptors/base.interceptor';

@Injectable()
export class ContextInterceptor extends BaseInterceptor implements NestInterceptor {
  constructor(
    private readonly contextService: RequestContextService,
  ) {
    super();
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    // Create request context
    const requestContext = this.contextInitializer.createContext(request);

    // Log context initialization using base class
    this.logRequest('debug', `Request context initialized: ${requestContext.correlationId}`, {
      method: requestContext.request.method,
      url: requestContext.request.url,
      correlationId: requestContext.correlationId,
    });

    // Run the request handler within the context
    return RequestContextService.run(requestContext, async () => {
      return next.handle().pipe(
        tap(() => {
          // Set response metadata on success
          RequestContextService.setResponseMetadata(response.statusCode);

          const duration = RequestContextService.getRequestDuration();

          // Log successful completion using base class
          this.logResponse('debug', `Request completed: ${requestContext.correlationId}`, {
            statusCode: response.statusCode,
            duration,
            correlationId: requestContext.correlationId,
          });
        }),
        catchError((error) => {
          // Set response metadata on error
          RequestContextService.setResponseMetadata(error.status || 500);

          const duration = RequestContextService.getRequestDuration();

          // Log error using base class
          this.logError(`Request failed: ${requestContext.correlationId}`, error, {
            statusCode: error.status || 500,
            duration,
            correlationId: requestContext.correlationId,
          });

          throw error;
        })
      );
    });
  }
}

/**
 * Context Middleware
 *
 * Express middleware that ensures context is available for non-HTTP requests
 * (like WebSocket connections, scheduled jobs, etc.)
 */

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RequestContextService } from './request-context.service';

@Injectable()
export class ContextMiddleware implements NestMiddleware {
  constructor(
    private readonly contextService: RequestContextService,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    // Context is managed by request-scoped RequestContextService
    // Just pass through to next middleware
    next();
  }
}

/**
 * Context Guard
 *
 * Guard that ensures request context is available and validates user permissions
 */

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RequestContextService } from './request-context.service';

@Injectable()
export class ContextGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Ensure context exists
    const requestContext = RequestContextService.current;
    if (!requestContext) {
      return false;
    }

    // Check required permissions if specified
    const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler());
    if (requiredPermissions) {
      const user = RequestContextService.getCurrentUser();
      if (!user) {
        return false;
      }

      const hasAllPermissions = requiredPermissions.every(permission =>
        user.permissions.includes(permission)
      );

      if (!hasAllPermissions) {
        return false;
      }
    }

    // Check required roles if specified
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (requiredRoles) {
      const user = RequestContextService.getCurrentUser();
      if (!user) {
        return false;
      }

      const hasAllRoles = requiredRoles.every(role =>
        user.roles.includes(role)
      );

      if (!hasAllRoles) {
        return false;
      }
    }

    return true;
  }
}