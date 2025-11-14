import { Injectable } from '@nestjs/common';
import {
  IMiddleware,
  IRequest,
  IResponse,
  INextFunction,
  MiddlewareContext,
} from '../utils/types/middleware.types';

/**
 * Base HTTP Adapter - Shared functionality for framework-specific adapters
 *
 * Provides common functionality for HTTP request/response wrapping and middleware
 * adaptation that can be reused across different HTTP frameworks (Express, Hapi, etc.)
 */
@Injectable()
export abstract class BaseHttpAdapter {
  /**
   * Creates middleware context with common properties
   */
  protected createMiddlewareContext(
    correlationId?: string,
    framework: string = 'unknown',
  ): MiddlewareContext {
    return {
      startTime: Date.now(),
      correlationId:
        correlationId ||
        `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      framework,
      environment: process.env.NODE_ENV || 'development',
      metadata: {},
    };
  }

  /**
   * Common healthcare context initialization
   */
  protected initializeHealthcareContext(
    params: Record<string, any>,
    headers: Record<string, string | string[]>,
    body: any,
    user: any,
  ): HealthcareContext {
    return {
      patientId: params.patientId || body?.patientId,
      facilityId: headers['x-facility-id'] as string,
      providerId: user?.userId || user?.id,
      accessType: headers['x-access-type'] as 'routine' | 'emergency' | 'break_glass',
      auditRequired: true,
      phiAccess: false,
      complianceFlags: [],
    };
  }

  /**
   * Common response sanitization logic
   */
  protected static sanitizeResponse(data: any): any {
    if (!data) return data;

    // Remove common sensitive fields
    const sensitiveFields = [
      'ssn',
      'socialSecurityNumber',
      'password',
      'token',
    ];

    if (typeof data === 'object') {
      const sanitized = { ...data };
      sensitiveFields.forEach((field) => {
        if (sanitized[field]) {
          delete sanitized[field];
        }
      });
      return sanitized;
    }

    return data;
  }

  /**
   * Common security headers setup
   */
  protected getSecurityHeaders(): Record<string, string> {
    return {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    };
  }

  /**
   * Common user context extraction
   */
  protected extractUserContext(
    user: any,
    headers: Record<string, string | string[]>,
    sessionId?: string,
  ): any {
    return {
      id: user?.userId || user?.id,
      role: user?.role,
      permissions: user?.permissions || [],
      facilityId: user?.facilityId || headers['x-facility-id'],
      sessionId,
    };
  }

  /**
   * Common correlation ID extraction
   */
  protected extractCorrelationId(headers: Record<string, string | string[]>): string {
    return (
      (headers['x-correlation-id'] as string) ||
      (headers['x-request-id'] as string) ||
      `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    );
  }

  /**
   * Abstract method to be implemented by concrete adapters
   */
  abstract adapt(middleware: IMiddleware): any;

  /**
   * Abstract method for healthcare enhancement
   */
  abstract createHealthcareEnhancer(): any;
}

/**
 * Base Request Wrapper - Shared functionality for request implementations
 */
export abstract class BaseRequestWrapper implements IRequest {
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

  constructor(
    method: string,
    url: string,
    path: string,
    headers: Record<string, string | string[]>,
    query: Record<string, any>,
    params: Record<string, any>,
    body: any,
    ip: string,
    userAgent?: string,
    correlationId?: string,
    sessionId?: string,
    user?: any,
  ) {
    this.method = method;
    this.url = url;
    this.path = path;
    this.headers = headers;
    this.query = query;
    this.params = params;
    this.body = body;
    this.ip = ip;
    this.userAgent = userAgent;
    this.correlationId = correlationId;
    this.sessionId = sessionId;
    this.user = user;
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

  abstract getRawRequest(): any;
}

/**
 * Base Response Wrapper - Shared functionality for response implementations
 */
export abstract class BaseResponseWrapper implements IResponse {
  public statusCode: number;
  public headers: Record<string, string | string[]> = {};
  protected _headersSent: boolean = false;

  constructor(statusCode: number = 200) {
    this.statusCode = statusCode;
  }

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

  abstract json(data: any): void;
  abstract send(data: any): void;
  abstract end(data?: any): void;

  redirect(statusCode: number, url: string): void;
  redirect(url: string): void;
  redirect(statusCodeOrUrl: number | string, url?: string): void {
    this._headersSent = true;
    this.setStatus(typeof statusCodeOrUrl === 'number' ? statusCodeOrUrl : 302);
    this.setHeader('Location', typeof statusCodeOrUrl === 'string' ? statusCodeOrUrl : url!);
  }

  get headersSent(): boolean {
    return this._headersSent;
  }

  abstract getRawResponse(): any;
}

/**
 * Base Next Function Wrapper - Shared functionality for next function implementations
 */
export abstract class BaseNextWrapper implements INextFunction {
  abstract call(error?: Error): void;
  abstract getRawNext(): any;
}

/**
 * Healthcare-specific interfaces
 */
export interface HealthcareContext {
  patientId?: string;
  facilityId?: string;
  providerId?: string;
  accessType?: 'routine' | 'emergency' | 'break_glass';
  auditRequired: boolean;
  phiAccess: boolean;
  complianceFlags: string[];
}

export interface HealthcareRequest {
  healthcareContext: HealthcareContext;
}

export interface HealthcareResponse {
  sendHipaaCompliant(
    data: any,
    options?: {
      logAccess?: boolean;
      patientId?: string;
      dataType?: string;
    },
  ): this;
  sanitizeResponse(data: any): any;
}