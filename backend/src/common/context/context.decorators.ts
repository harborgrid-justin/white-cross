/**
 * Context Decorators
 *
 * Decorators for accessing and manipulating request context in the White Cross healthcare platform.
 */

import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import { RequestContextService } from './request-context.service';

/**
 * Get current request context
 */
export const Context = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  return RequestContextService.current;
});

/**
 * Get correlation ID from current request context
 */
export const CorrelationId = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  return RequestContextService.getCorrelationId();
});

/**
 * Get current user from request context
 */
export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  return RequestContextService.getCurrentUser();
});

/**
 * Get custom property from request context
 */
export const ContextProperty = createParamDecorator(
  (propertyKey: string, ctx: ExecutionContext) => {
    return RequestContextService.getCustomProperty(propertyKey);
  },
);

/**
 * Permission-based decorator for methods
 */
export function RequirePermissions(...permissions: string[]) {
  return SetMetadata('permissions', permissions);
}

/**
 * Role-based decorator for methods
 */
export function RequireRoles(...roles: string[]) {
  return SetMetadata('roles', roles);
}

/**
 * Facility-based decorator for methods
 */
export function RequireFacility(facilityId?: string) {
  return SetMetadata('facility', facilityId);
}

/**
 * Audit logging decorator for methods
 */
export function AuditAction(action: string, resource: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      // Add audit entry before executing
      RequestContextService.addAuditEntry(action, resource, {
        method: propertyKey,
        args: args.length,
      });

      try {
        const result = await originalMethod.apply(this, args);

        // Add success audit entry
        RequestContextService.addAuditEntry(`${action}_success`, resource, {
          method: propertyKey,
          success: true,
        });

        return result;
      } catch (error) {
        // Add failure audit entry
        RequestContextService.addAuditEntry(`${action}_failed`, resource, {
          method: propertyKey,
          error: error.message,
          success: false,
        });

        throw error;
      }
    };
  };
}

/**
 * Context-aware logging decorator
 */
export function ContextLog(level: 'debug' | 'info' | 'warn' | 'error' = 'info') {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const methodName = `${target.constructor.name}.${propertyKey}`;

    descriptor.value = async function (...args: any[]) {
      const correlationId = RequestContextService.getCorrelationId();
      const user = RequestContextService.getCurrentUser();

      const logContext = {
        method: methodName,
        correlationId,
        userId: user?.id,
        timestamp: new Date().toISOString(),
      };

      console[level](`[${level.toUpperCase()}] ${methodName}`, logContext);

      try {
        const result = await originalMethod.apply(this, args);

        if (level === 'debug') {
          console.debug(`[DEBUG] ${methodName} completed`, {
            ...logContext,
            duration: RequestContextService.getRequestDuration(),
          });
        }

        return result;
      } catch (error) {
        console.error(`[ERROR] ${methodName} failed`, {
          ...logContext,
          error: error.message,
          stack: error.stack,
        });

        throw error;
      }
    };
  };
}

/**
 * Request tracing decorator
 */
export function TraceRequest(operation: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const correlationId = RequestContextService.getCorrelationId();
      const startTime = Date.now();

      // Set custom property for tracing
      RequestContextService.setCustomProperty('currentOperation', operation);

      console.log(`[TRACE] Starting ${operation}`, {
        correlationId,
        operation,
        timestamp: new Date().toISOString(),
      });

      try {
        const result = await originalMethod.apply(this, args);

        const duration = Date.now() - startTime;
        console.log(`[TRACE] Completed ${operation}`, {
          correlationId,
          operation,
          duration,
          timestamp: new Date().toISOString(),
        });

        return result;
      } catch (error) {
        const duration = Date.now() - startTime;
        console.error(`[TRACE] Failed ${operation}`, {
          correlationId,
          operation,
          duration,
          error: error.message,
          timestamp: new Date().toISOString(),
        });

        throw error;
      } finally {
        // Clear custom property
        RequestContextService.setCustomProperty('currentOperation', undefined);
      }
    };
  };
}
