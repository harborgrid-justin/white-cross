/**
 * Request Context Management
 *
 * Provides request-scoped context management using AsyncLocalStorage for the White Cross
 * healthcare platform, enabling correlation IDs, user context, and request tracing.
 */

import { Injectable, Scope } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

import { BaseService } from '../../common/base';
/**
 * Request context interface
 */
export interface IRequestContext {
  /** Unique correlation ID for request tracing */
  correlationId: string;

  /** Request start time */
  startTime: Date;

  /** User context if authenticated */
  user?: {
    id: string;
    roles: string[];
    permissions: string[];
    facilityId?: string;
  };

  /** Request metadata */
  request: {
    method: string;
    url: string;
    userAgent?: string;
    ip: string;
    headers: Record<string, string>;
  };

  /** Response metadata */
  response?: {
    statusCode?: number;
    duration?: number;
  };

  /** Custom properties for request-specific data */
  custom: Record<string, any>;

  /** Audit trail for HIPAA compliance */
  auditTrail: Array<{
    timestamp: Date;
    action: string;
    resource: string;
    details?: Record<string, any>;
  }>;
}

/**
 * Request context service
 */
@Injectable({ scope: Scope.REQUEST })
export class RequestContextService extends BaseService {
  private static readonly storage = new AsyncLocalStorage<IRequestContext>();

  /**
   * Get current request context
   */
  static get current(): IRequestContext | undefined {
    return this.storage.getStore();
  }

  /**
   * Run function within request context
   */
  static run(context: IRequestContext, fn: () => Promise<any> | any): Promise<any> {
    return this.storage.run(context, fn);
  }

  /**
   * Get correlation ID
   */
  static getCorrelationId(): string | undefined {
    return this.current?.correlationId;
  }

  /**
   * Get current user
   */
  static getCurrentUser() {
    return this.current?.user;
  }

  /**
   * Check if user has permission
   */
  static hasPermission(permission: string): boolean {
    const user = this.getCurrentUser();
    return user?.permissions?.includes(permission) ?? false;
  }

  /**
   * Check if user has role
   */
  static hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.roles?.includes(role) ?? false;
  }

  /**
   * Add audit entry
   */
  static addAuditEntry(action: string, resource: string, details?: Record<string, any>): void {
    const context = this.current;
    if (context) {
      context.auditTrail.push({
        timestamp: new Date(),
        action,
        resource,
        details
      });
    }
  }

  /**
   * Set custom property
   */
  static setCustomProperty(key: string, value: any): void {
    const context = this.current;
    if (context) {
      context.custom[key] = value;
    }
  }

  /**
   * Get custom property
   */
  static getCustomProperty<T = any>(key: string): T | undefined {
    return this.current?.custom[key];
  }

  /**
   * Get request duration
   */
  static getRequestDuration(): number | undefined {
    const context = this.current;
    if (context) {
      return Date.now() - context.startTime.getTime();
    }
  }

  /**
   * Update response metadata
   */
  static setResponseMetadata(statusCode: number): void {
    const context = this.current;
    if (context) {
      context.response = {
        ...context.response,
        statusCode,
        duration: this.getRequestDuration()
      };
    }
  }
}

/**
 * Context initializer service
 */
@Injectable()
export class ContextInitializerService {
  /**
   * Create request context from Express request
   */
  createContext(request: any): IRequestContext {
    const correlationId = this.extractCorrelationId(request);
    const startTime = new Date();

    return {
      correlationId,
      startTime,
      request: {
        method: request.method,
        url: request.url,
        userAgent: request.get('User-Agent'),
        ip: this.getClientIP(request),
        headers: this.sanitizeHeaders(request.headers)
      },
      custom: {},
      auditTrail: []
    };
  }

  /**
   * Set user context after authentication
   */
  setUserContext(user: {
    id: string;
    roles: string[];
    permissions: string[];
    facilityId?: string;
  }): void {
    const context = RequestContextService.current;
    if (context) {
      context.user = user;
    }
  }

  /**
   * Extract correlation ID from request headers or generate new one
   */
  private extractCorrelationId(request: any): string {
    const headerId = request.get('x-correlation-id') ||
                     request.get('x-request-id') ||
                     request.get('correlation-id');

    if (headerId) {
      return headerId;
    }

    // Generate new correlation ID
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get client IP address
   */
  private getClientIP(request: any): string {
    return request.ip ||
           request.connection?.remoteAddress ||
           request.socket?.remoteAddress ||
           request.connection?.socket?.remoteAddress ||
           'unknown';
  }

  /**
   * Sanitize headers for security (remove sensitive headers)
   */
  private sanitizeHeaders(headers: Record<string, any>): Record<string, string> {
    const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key', 'x-auth-token'];
    const sanitized: Record<string, string> = {};

    for (const [key, value] of Object.entries(headers)) {
      if (!sensitiveHeaders.includes(key.toLowerCase())) {
        sanitized[key] = Array.isArray(value) ? value.join(', ') : String(value);
      }
    }

    return sanitized;
  }
}