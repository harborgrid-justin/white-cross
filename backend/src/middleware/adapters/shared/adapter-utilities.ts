/**
 * @fileoverview Shared Adapter Utilities
 * @module middleware/adapters/shared
 * @description Common utilities and patterns shared between Express and Hapi adapters
 */

import { IRequest, IResponse, MiddlewareContext } from '../../utils/types/middleware.types';

/**
 * Common adapter utilities for framework adapters
 */
export class AdapterUtilities {
  /**
   * Creates a correlation ID for the request if one doesn't exist
   */
  static generateCorrelationId(existingId?: string): string {
    return (
      existingId ||
      `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    );
  }

  /**
   * Creates a standard middleware context object
   */
  static createMiddlewareContext(
    framework: 'express' | 'hapi',
    correlationId?: string,
  ): MiddlewareContext {
    return {
      startTime: Date.now(),
      correlationId: this.generateCorrelationId(correlationId),
      framework,
      environment: process.env.NODE_ENV || 'development',
      metadata: {},
    };
  }

  /**
   * Sets HIPAA-compliant security headers
   */
  static getSecurityHeaders(): Record<string, string> {
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
   * Extracts user context from request
   */
  static getUserContext(request: IRequest): {
    id?: string;
    role?: string;
    permissions?: string[];
    facilityId?: string;
    sessionId?: string;
  } {
    const user = request.user as any;
    return {
      id: user?.userId || user?.id,
      role: user?.role,
      permissions: user?.permissions || [],
      facilityId: user?.facilityId || request.getHeader('x-facility-id') as string,
      sessionId: request.sessionId,
    };
  }

  /**
   * Sanitizes response data by removing sensitive fields
   */
  static sanitizeResponse(data: any): any {
    if (!data) return data;

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
   * Creates healthcare context for requests
   */
  static createHealthcareContext(
    request: IRequest,
    user?: any,
  ): {
    patientId?: string;
    facilityId?: string;
    providerId?: string;
    accessType?: 'routine' | 'emergency' | 'break_glass';
    auditRequired: boolean;
    phiAccess: boolean;
    complianceFlags: string[];
  } {
    return {
      patientId: request.params?.patientId || request.body?.patientId,
      facilityId: request.getHeader('x-facility-id') as string,
      providerId: user?.userId || user?.id,
      accessType: request.getHeader('x-access-type') as 'routine' | 'emergency' | 'break_glass',
      auditRequired: true,
      phiAccess: false,
      complianceFlags: [],
    };
  }
}
