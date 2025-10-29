/**
 * Audit Logger Middleware
 *
 * Logs security-relevant events for HIPAA compliance and security monitoring.
 * PHI access is tracked but PHI data is never logged.
 *
 * @module middleware/auditLogger
 * @since 2025-10-26
 */

export enum AuditEventType {
  // Authentication events
  LOGIN_SUCCESS = 'AUTH_LOGIN_SUCCESS',
  LOGIN_FAILURE = 'AUTH_LOGIN_FAILURE',
  LOGOUT = 'AUTH_LOGOUT',
  TOKEN_REFRESH = 'AUTH_TOKEN_REFRESH',

  // Authorization events
  ACCESS_GRANTED = 'AUTHZ_ACCESS_GRANTED',
  ACCESS_DENIED = 'AUTHZ_ACCESS_DENIED',
  PERMISSION_CHECK = 'AUTHZ_PERMISSION_CHECK',

  // PHI access events (HIPAA requirement)
  PHI_ACCESS = 'PHI_ACCESS',
  PHI_VIEW = 'PHI_VIEW',
  PHI_MODIFY = 'PHI_MODIFY',
  PHI_DELETE = 'PHI_DELETE',
  PHI_EXPORT = 'PHI_EXPORT',

  // Admin events
  ADMIN_ACTION = 'ADMIN_ACTION',
  SETTINGS_CHANGE = 'SETTINGS_CHANGE',
  USER_MANAGEMENT = 'USER_MANAGEMENT',

  // Security events
  RATE_LIMIT_EXCEEDED = 'SECURITY_RATE_LIMIT_EXCEEDED',
  SUSPICIOUS_ACTIVITY = 'SECURITY_SUSPICIOUS_ACTIVITY',
  INVALID_TOKEN = 'SECURITY_INVALID_TOKEN',
}

export interface AuditEvent {
  // Event metadata
  eventType: AuditEventType;
  timestamp: string;
  requestId: string;

  // User information
  userId?: string;
  userRole?: string;
  userEmail?: string;

  // Request information
  ipAddress: string;
  userAgent: string;
  method: string;
  path: string;

  // Additional context
  resourceType?: string;
  resourceId?: string;
  action?: string;
  result: 'SUCCESS' | 'FAILURE' | 'DENIED';
  errorMessage?: string;

  // Metadata
  metadata?: Record<string, unknown>;
}

/**
 * Audit logger class
 */
class AuditLogger {
  private environment: string;

  constructor() {
    this.environment = process.env.NODE_ENV || 'development';
  }

  /**
   * Log audit event
   */
  async log(event: AuditEvent): Promise<void> {
    // In development, log to console
    if (this.environment === 'development') {
      console.log('[AUDIT]', {
        ...event,
        timestamp: new Date(event.timestamp).toISOString(),
      });
      return;
    }

    // In production, send to audit service
    // TODO: Integrate with backend audit service
    // await fetch('/api/v1/audit/events', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(event),
    // });

    // For now, log to console in production too
    console.log('[AUDIT]', {
      ...event,
      timestamp: new Date(event.timestamp).toISOString(),
    });
  }

  /**
   * Log authentication event
   */
  async logAuth(
    eventType: AuditEventType,
    request: {
      method: string;
      path: string;
      headers: Headers;
      ip?: string;
    },
    userId?: string,
    result: 'SUCCESS' | 'FAILURE' = 'SUCCESS',
    errorMessage?: string
  ): Promise<void> {
    await this.log({
      eventType,
      timestamp: new Date().toISOString(),
      requestId: this.generateRequestId(),
      userId,
      ipAddress: this.getIpAddress(request),
      userAgent: request.headers.get('user-agent') || 'unknown',
      method: request.method,
      path: request.path,
      result,
      errorMessage,
    });
  }

  /**
   * Log PHI access event (HIPAA requirement)
   */
  async logPHIAccess(
    action: 'VIEW' | 'MODIFY' | 'DELETE' | 'EXPORT',
    request: {
      method: string;
      path: string;
      headers: Headers;
      ip?: string;
    },
    userId: string,
    userRole: string,
    resourceType: string,
    resourceId: string,
    result: 'SUCCESS' | 'FAILURE' | 'DENIED' = 'SUCCESS'
  ): Promise<void> {
    const eventTypeMap = {
      VIEW: AuditEventType.PHI_VIEW,
      MODIFY: AuditEventType.PHI_MODIFY,
      DELETE: AuditEventType.PHI_DELETE,
      EXPORT: AuditEventType.PHI_EXPORT,
    };

    await this.log({
      eventType: eventTypeMap[action],
      timestamp: new Date().toISOString(),
      requestId: this.generateRequestId(),
      userId,
      userRole,
      ipAddress: this.getIpAddress(request),
      userAgent: request.headers.get('user-agent') || 'unknown',
      method: request.method,
      path: request.path,
      resourceType,
      resourceId,
      action,
      result,
    });
  }

  /**
   * Log admin action
   */
  async logAdminAction(
    request: {
      method: string;
      path: string;
      headers: Headers;
      ip?: string;
    },
    userId: string,
    userRole: string,
    action: string,
    result: 'SUCCESS' | 'FAILURE' = 'SUCCESS',
    errorMessage?: string
  ): Promise<void> {
    await this.log({
      eventType: AuditEventType.ADMIN_ACTION,
      timestamp: new Date().toISOString(),
      requestId: this.generateRequestId(),
      userId,
      userRole,
      ipAddress: this.getIpAddress(request),
      userAgent: request.headers.get('user-agent') || 'unknown',
      method: request.method,
      path: request.path,
      action,
      result,
      errorMessage,
    });
  }

  /**
   * Log security event
   */
  async logSecurityEvent(
    eventType: AuditEventType,
    request: {
      method: string;
      path: string;
      headers: Headers;
      ip?: string;
    },
    userId?: string,
    errorMessage?: string,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    await this.log({
      eventType,
      timestamp: new Date().toISOString(),
      requestId: this.generateRequestId(),
      userId,
      ipAddress: this.getIpAddress(request),
      userAgent: request.headers.get('user-agent') || 'unknown',
      method: request.method,
      path: request.path,
      result: 'FAILURE',
      errorMessage,
      metadata,
    });
  }

  /**
   * Generate unique request ID
   */
  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }

  /**
   * Get IP address from request
   */
  private getIpAddress(request: {
    headers: Headers;
    ip?: string;
  }): string {
    const forwardedFor = request.headers.get('x-forwarded-for');
    if (forwardedFor) {
      return forwardedFor.split(',')[0].trim();
    }

    const realIp = request.headers.get('x-real-ip');
    if (realIp) {
      return realIp;
    }

    return request.ip || 'unknown';
  }
}

// Export singleton instance
export const auditLogger = new AuditLogger();

/**
 * Determine if path contains PHI
 */
export function isPHIRoute(path: string): boolean {
  const phiPaths = [
    '/students',
    '/health-records',
    '/medications',
    '/appointments',
    '/incidents',
    '/emergency-contacts',
  ];

  return phiPaths.some((phiPath) => path.startsWith(phiPath));
}

/**
 * Extract resource info from path
 */
export function extractResourceInfo(path: string): {
  resourceType: string;
  resourceId?: string;
} {
  const pathParts = path.split('/').filter(Boolean);

  if (pathParts.length >= 2) {
    return {
      resourceType: pathParts[0],
      resourceId: pathParts[1],
    };
  }

  return {
    resourceType: pathParts[0] || 'unknown',
  };
}
