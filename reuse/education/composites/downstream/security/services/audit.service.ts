/**
 * Audit Service
 * Tracks security events and user actions for compliance and monitoring
 *
 * FEATURES:
 * - Security event logging
 * - User action tracking
 * - Compliance audit trails
 * - Suspicious activity detection
 */

import { Injectable, Logger } from '@nestjs/common';

export interface AuditLogEntry {
  userId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: any;
  ip?: string;
  userAgent?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  timestamp?: Date;
}

export interface SecurityEvent {
  type: 'auth_failure' | 'unauthorized_access' | 'suspicious_activity' | 'token_refresh' | 'password_change';
  userId?: string;
  details: any;
  ip: string;
  userAgent?: string;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  /**
   * Logs an audit entry
   * @param entry Audit log entry
   */
  async log(entry: AuditLogEntry): Promise<void> {
    const auditLog = {
      ...entry,
      timestamp: entry.timestamp || new Date(),
      severity: entry.severity || 'low',
    };

    // In production, save to database
    this.logger.log(`AUDIT: ${JSON.stringify(auditLog)}`);

    // Send critical events to monitoring
    if (entry.severity === 'critical') {
      await this.sendAlertToMonitoring(auditLog);
    }
  }

  /**
   * Logs a security event
   * @param event Security event
   */
  async logSecurityEvent(event: SecurityEvent): Promise<void> {
    await this.log({
      userId: event.userId,
      action: event.type,
      resource: 'security',
      details: event.details,
      ip: event.ip,
      userAgent: event.userAgent,
      severity: this.determineEventSeverity(event.type),
    });
  }

  /**
   * Logs authentication failure
   * @param email User email
   * @param ip IP address
   * @param reason Failure reason
   */
  async logAuthFailure(email: string, ip: string, reason: string): Promise<void> {
    await this.logSecurityEvent({
      type: 'auth_failure',
      details: { email, reason },
      ip,
    });
  }

  /**
   * Logs unauthorized access attempt
   * @param userId User ID
   * @param resource Resource attempted
   * @param ip IP address
   */
  async logUnauthorizedAccess(userId: string, resource: string, ip: string): Promise<void> {
    await this.logSecurityEvent({
      type: 'unauthorized_access',
      userId,
      details: { resource },
      ip,
    });
  }

  /**
   * Logs suspicious activity
   * @param userId User ID
   * @param activity Activity description
   * @param ip IP address
   */
  async logSuspiciousActivity(userId: string, activity: string, ip: string): Promise<void> {
    await this.logSecurityEvent({
      type: 'suspicious_activity',
      userId,
      details: { activity },
      ip,
    });
  }

  /**
   * Logs API request
   * @param userId User ID
   * @param method HTTP method
   * @param path Request path
   * @param ip IP address
   */
  async logApiRequest(userId: string, method: string, path: string, ip: string): Promise<void> {
    await this.log({
      userId,
      action: `${method} ${path}`,
      resource: this.extractResource(path),
      ip,
      severity: 'low',
    });
  }

  /**
   * Generates audit report
   * @param startDate Start date
   * @param endDate End date
   * @returns Audit report
   */
  async generateAuditReport(startDate: Date, endDate: Date): Promise<any> {
    // In production, query database for audit logs
    return {
      startDate,
      endDate,
      totalEvents: 0,
      securityEvents: 0,
      criticalEvents: 0,
      events: [],
    };
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  private extractResource(path: string): string {
    const parts = path.split('/').filter(Boolean);
    return parts[0] || 'unknown';
  }

  private determineEventSeverity(eventType: string): 'low' | 'medium' | 'high' | 'critical' {
    switch (eventType) {
      case 'suspicious_activity':
        return 'critical';
      case 'unauthorized_access':
        return 'high';
      case 'auth_failure':
        return 'medium';
      default:
        return 'low';
    }
  }

  private async sendAlertToMonitoring(auditLog: AuditLogEntry): Promise<void> {
    // In production, send to Slack, PagerDuty, etc.
    this.logger.error(`CRITICAL SECURITY EVENT: ${JSON.stringify(auditLog)}`);
  }
}

export default AuditService;
