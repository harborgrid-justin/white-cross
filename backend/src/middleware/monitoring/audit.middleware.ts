/**
 * LOC: WC-MID-AUDIT-001
 * WC-MID-AUDIT-001 | NestJS Audit Logging Middleware
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/core
 *
 * DOWNSTREAM (used by):
 *   - MonitoringModule
 *   - Application routes
 */

/**
 * WC-MID-AUDIT-001 | NestJS HIPAA-Compliant Audit Logging Middleware
 * Purpose: HIPAA-compliant audit logging, PHI access tracking, and compliance monitoring
 * Upstream: NestJS logger, authentication guards | Dependencies: NestJS framework
 * Downstream: Compliance reporting, security monitoring | Called by: NestJS middleware pipeline
 * Related: authentication/*, authorization/*, security/*, monitoring/*
 * Exports: AuditMiddleware class, audit configurations | Key Services: Audit logging, compliance tracking
 * Last Updated: 2025-10-28 | Dependencies: NestJS
 * Critical Path: Request → User identification → Audit log creation → Compliance storage
 * LLM Context: HIPAA compliance, PHI access logging, healthcare audit requirements
 */

import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';

/**
 * Audit event types
 */
export enum AuditEventType {
  // Authentication events
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  LOGIN_FAILED = 'LOGIN_FAILED',
  SESSION_CREATED = 'SESSION_CREATED',
  SESSION_EXPIRED = 'SESSION_EXPIRED',

  // Authorization events
  ACCESS_GRANTED = 'ACCESS_GRANTED',
  ACCESS_DENIED = 'ACCESS_DENIED',
  PERMISSION_ESCALATION = 'PERMISSION_ESCALATION',

  // Data access events
  PHI_ACCESSED = 'PHI_ACCESSED',
  PHI_MODIFIED = 'PHI_MODIFIED',
  PHI_CREATED = 'PHI_CREATED',
  PHI_DELETED = 'PHI_DELETED',
  PHI_EXPORTED = 'PHI_EXPORTED',

  // System events
  SYSTEM_ACCESS = 'SYSTEM_ACCESS',
  CONFIGURATION_CHANGED = 'CONFIGURATION_CHANGED',
  EMERGENCY_ACCESS = 'EMERGENCY_ACCESS',

  // Healthcare specific events
  MEDICATION_ADMINISTERED = 'MEDICATION_ADMINISTERED',
  ALLERGY_UPDATED = 'ALLERGY_UPDATED',
  EMERGENCY_CONTACT_ACCESSED = 'EMERGENCY_CONTACT_ACCESSED',
  HEALTH_RECORD_VIEWED = 'HEALTH_RECORD_VIEWED',
  VACCINATION_RECORDED = 'VACCINATION_RECORDED',
}

/**
 * Audit event severity levels
 */
export enum AuditSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
}

/**
 * Audit event interface
 */
export interface AuditEvent {
  eventId: string;
  timestamp: number;
  eventType: AuditEventType;
  severity: AuditSeverity;
  userId?: string;
  userEmail?: string;
  userRole?: string;
  sessionId?: string;
  ipAddress: string;
  userAgent?: string;
  resource?: string;
  action: string;
  result: 'SUCCESS' | 'FAILURE';
  details?: Record<string, any>;
  phiAccessed?: boolean;
  studentId?: string;
  reasoning?: string;
  error?: string;
}

/**
 * Audit configuration interface
 */
export interface AuditConfig {
  enablePHITracking: boolean;
  enableDetailedLogging: boolean;
  retentionPeriodDays: number;
  enableRealTimeAlerts: boolean;
  sensitiveActions: AuditEventType[];
  excludedPaths: string[];
  maxAuditHistory: number;
}

/**
 * Audit summary interface
 */
export interface AuditSummary {
  totalEvents: number;
  phiAccess: number;
  failedAttempts: number;
  emergencyAccess: number;
  criticalEvents: number;
  uniqueUsers: number;
  timeRange: { start: number; end: number };
}

/**
 * Default audit configurations
 */
export const AUDIT_CONFIGS = {
  // HIPAA-compliant healthcare settings
  healthcare: {
    enablePHITracking: true,
    enableDetailedLogging: true,
    retentionPeriodDays: 2190, // 6 years as required by HIPAA
    enableRealTimeAlerts: true,
    sensitiveActions: [
      AuditEventType.PHI_ACCESSED,
      AuditEventType.PHI_MODIFIED,
      AuditEventType.PHI_EXPORTED,
      AuditEventType.EMERGENCY_ACCESS,
      AuditEventType.LOGIN_FAILED,
    ],
    excludedPaths: ['/health', '/metrics', '/favicon.ico'],
    maxAuditHistory: 100000,
  } as AuditConfig,

  // Development settings
  development: {
    enablePHITracking: false,
    enableDetailedLogging: false,
    retentionPeriodDays: 30,
    enableRealTimeAlerts: false,
    sensitiveActions: [AuditEventType.LOGIN_FAILED],
    excludedPaths: ['/health', '/metrics', '/favicon.ico', '/api/docs'],
    maxAuditHistory: 1000,
  } as AuditConfig,

  // Production settings
  production: {
    enablePHITracking: true,
    enableDetailedLogging: false,
    retentionPeriodDays: 2190, // 6 years
    enableRealTimeAlerts: true,
    sensitiveActions: [
      AuditEventType.PHI_ACCESSED,
      AuditEventType.PHI_MODIFIED,
      AuditEventType.PHI_EXPORTED,
      AuditEventType.EMERGENCY_ACCESS,
      AuditEventType.ACCESS_DENIED,
      AuditEventType.LOGIN_FAILED,
    ],
    excludedPaths: ['/health', '/metrics'],
    maxAuditHistory: 500000,
  } as AuditConfig,
};

/**
 * HIPAA-Compliant Audit Logging Middleware for NestJS
 *
 * @class AuditMiddleware
 * @description NestJS audit logging middleware implementing HIPAA-compliant
 * audit trail requirements for healthcare applications. Tracks all PHI access, authentication
 * events, and system actions with comprehensive forensic details.
 */
@Injectable()
export class AuditMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuditMiddleware.name);
  private config: AuditConfig;
  private auditEvents: AuditEvent[] = [];
  private alertCallbacks: ((event: AuditEvent) => void)[] = [];
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    this.config = AUDIT_CONFIGS.healthcare;

    // Start periodic cleanup
    this.cleanupInterval = setInterval(
      () => {
        this.cleanupOldEvents();
      },
      24 * 60 * 60 * 1000,
    ); // Daily cleanup
  }

  /**
   * NestJS middleware entry point
   */
  use(req: Request, res: Response, next: NextFunction): void {
    // Skip excluded paths
    if (this.config.excludedPaths.some((path) => req.path.includes(path))) {
      return next();
    }

    // Extract user information from request
    const user = (req as any).user;
    const ipAddress = this.getClientIP(req);
    const userAgent = req.get('user-agent');

    // Determine if this is PHI access
    const phiAccessed = this.isPHIAccess(req.path);

    // Log the request
    this.logEvent(
      phiAccessed ? AuditEventType.PHI_ACCESSED : AuditEventType.SYSTEM_ACCESS,
      `${req.method} ${req.path}`,
      'SUCCESS',
      {
        userId: user?.userId,
        userEmail: user?.email,
        userRole: user?.role,
        sessionId: (req as any).sessionID,
        ipAddress,
        userAgent,
        resource: req.path,
        phiAccessed,
        details: {
          method: req.method,
          query: req.query,
          timestamp: new Date().toISOString(),
        },
      },
    ).catch((err) => {
      this.logger.error('Failed to log audit event', err);
    });

    next();
  }

  /**
   * Log an audit event
   */
  async logEvent(
    eventType: AuditEventType,
    action: string,
    result: 'SUCCESS' | 'FAILURE',
    context: {
      userId?: string;
      userEmail?: string;
      userRole?: string;
      sessionId?: string;
      ipAddress: string;
      userAgent?: string;
      resource?: string;
      details?: Record<string, any>;
      phiAccessed?: boolean;
      studentId?: string;
      reasoning?: string;
      error?: string;
    },
  ): Promise<void> {
    const eventId = this.generateEventId();
    const severity = this.determineSeverity(eventType, result);

    const auditEvent: AuditEvent = {
      eventId,
      timestamp: Date.now(),
      eventType,
      severity,
      action,
      result,
      ...context,
    };

    // Store the event
    this.auditEvents.push(auditEvent);

    // Log to NestJS logger
    const logLevel =
      severity === AuditSeverity.CRITICAL || severity === AuditSeverity.ERROR
        ? 'error'
        : severity === AuditSeverity.WARNING
          ? 'warn'
          : 'log';

    this.logger[logLevel]('Audit Event', {
      eventId,
      eventType,
      severity,
      action,
      result,
      userId: context.userId,
      userEmail: context.userEmail,
      ipAddress: context.ipAddress,
      resource: context.resource,
      phiAccessed: context.phiAccessed,
      studentId: context.studentId,
      error: context.error,
    });

    // Handle PHI tracking
    if (this.config.enablePHITracking && context.phiAccessed) {
      await this.handlePHIAccess(auditEvent);
    }

    // Real-time alerts for sensitive actions
    if (this.config.enableRealTimeAlerts && this.isSensitiveAction(eventType)) {
      await this.triggerAlert(auditEvent);
    }

    // Cleanup if needed
    if (this.auditEvents.length > this.config.maxAuditHistory) {
      this.cleanupOldEvents();
    }
  }

  /**
   * Log authentication events
   */
  async logAuthentication(
    success: boolean,
    ipAddress: string,
    userId?: string,
    email?: string,
    userAgent?: string,
    error?: string,
  ): Promise<void> {
    const eventType = success
      ? AuditEventType.LOGIN
      : AuditEventType.LOGIN_FAILED;

    await this.logEvent(
      eventType,
      'User Authentication',
      success ? 'SUCCESS' : 'FAILURE',
      {
        userId,
        userEmail: email,
        ipAddress,
        userAgent,
        error,
        details: { timestamp: new Date().toISOString() },
      },
    );
  }

  /**
   * Log PHI access
   */
  async logPHIAccess(
    action: 'VIEW' | 'EDIT' | 'CREATE' | 'DELETE' | 'EXPORT',
    studentId: string,
    userId: string,
    userEmail: string,
    userRole: string,
    ipAddress: string,
    resource: string,
    reasoning?: string,
  ): Promise<void> {
    let eventType: AuditEventType;

    switch (action) {
      case 'VIEW':
        eventType = AuditEventType.PHI_ACCESSED;
        break;
      case 'EDIT':
        eventType = AuditEventType.PHI_MODIFIED;
        break;
      case 'CREATE':
        eventType = AuditEventType.PHI_CREATED;
        break;
      case 'DELETE':
        eventType = AuditEventType.PHI_DELETED;
        break;
      case 'EXPORT':
        eventType = AuditEventType.PHI_EXPORTED;
        break;
    }

    await this.logEvent(eventType, `PHI ${action}`, 'SUCCESS', {
      userId,
      userEmail,
      userRole,
      ipAddress,
      resource,
      phiAccessed: true,
      studentId,
      reasoning,
      details: {
        action,
        timestamp: new Date().toISOString(),
        resource,
      },
    });
  }

  /**
   * Log emergency access
   */
  async logEmergencyAccess(
    userId: string,
    userEmail: string,
    userRole: string,
    studentId: string,
    ipAddress: string,
    reasoning: string,
  ): Promise<void> {
    await this.logEvent(
      AuditEventType.EMERGENCY_ACCESS,
      'Emergency PHI Access',
      'SUCCESS',
      {
        userId,
        userEmail,
        userRole,
        ipAddress,
        resource: `student/${studentId}`,
        phiAccessed: true,
        studentId,
        reasoning,
        details: {
          emergencyAccess: true,
          timestamp: new Date().toISOString(),
        },
      },
    );
  }

  /**
   * Log access denial
   */
  async logAccessDenied(
    userId: string,
    userEmail: string,
    userRole: string,
    resource: string,
    ipAddress: string,
    reason: string,
  ): Promise<void> {
    await this.logEvent(
      AuditEventType.ACCESS_DENIED,
      'Access Denied',
      'FAILURE',
      {
        userId,
        userEmail,
        userRole,
        ipAddress,
        resource,
        error: reason,
        details: {
          deniedReason: reason,
          timestamp: new Date().toISOString(),
        },
      },
    );
  }

  /**
   * Get audit summary
   */
  getAuditSummary(timeWindow?: number): AuditSummary {
    const now = Date.now();
    const windowStart = timeWindow ? now - timeWindow : 0;

    const relevantEvents = this.auditEvents.filter(
      (e) => e.timestamp >= windowStart,
    );

    const phiAccess = relevantEvents.filter((e) => e.phiAccessed).length;
    const failedAttempts = relevantEvents.filter(
      (e) => e.result === 'FAILURE',
    ).length;
    const emergencyAccess = relevantEvents.filter(
      (e) => e.eventType === AuditEventType.EMERGENCY_ACCESS,
    ).length;
    const criticalEvents = relevantEvents.filter(
      (e) => e.severity === AuditSeverity.CRITICAL,
    ).length;

    const uniqueUsers = new Set(
      relevantEvents.map((e) => e.userId).filter(Boolean),
    ).size;

    const timestamps = relevantEvents.map((e) => e.timestamp);
    const timeRange = {
      start: timestamps.length > 0 ? Math.min(...timestamps) : now,
      end: timestamps.length > 0 ? Math.max(...timestamps) : now,
    };

    return {
      totalEvents: relevantEvents.length,
      phiAccess,
      failedAttempts,
      emergencyAccess,
      criticalEvents,
      uniqueUsers,
      timeRange,
    };
  }

  /**
   * Get events by type
   */
  getEventsByType(eventType: AuditEventType, limit = 100): AuditEvent[] {
    return this.auditEvents
      .filter((e) => e.eventType === eventType)
      .slice(-limit);
  }

  /**
   * Get events by user
   */
  getEventsByUser(userId: string, limit = 100): AuditEvent[] {
    return this.auditEvents.filter((e) => e.userId === userId).slice(-limit);
  }

  /**
   * Get PHI access events
   */
  getPHIAccessEvents(studentId?: string, limit = 100): AuditEvent[] {
    let events = this.auditEvents.filter((e) => e.phiAccessed);

    if (studentId) {
      events = events.filter((e) => e.studentId === studentId);
    }

    return events.slice(-limit);
  }

  /**
   * Get failed access attempts
   */
  getFailedAttempts(limit = 100): AuditEvent[] {
    return this.auditEvents.filter((e) => e.result === 'FAILURE').slice(-limit);
  }

  /**
   * Search audit events
   */
  searchEvents(
    criteria: {
      eventType?: AuditEventType;
      userId?: string;
      studentId?: string;
      ipAddress?: string;
      severity?: AuditSeverity;
      startTime?: number;
      endTime?: number;
      phiAccessed?: boolean;
    },
    limit = 100,
  ): AuditEvent[] {
    return this.auditEvents
      .filter((event) => {
        if (criteria.eventType && event.eventType !== criteria.eventType)
          return false;
        if (criteria.userId && event.userId !== criteria.userId) return false;
        if (criteria.studentId && event.studentId !== criteria.studentId)
          return false;
        if (criteria.ipAddress && event.ipAddress !== criteria.ipAddress)
          return false;
        if (criteria.severity && event.severity !== criteria.severity)
          return false;
        if (criteria.startTime && event.timestamp < criteria.startTime)
          return false;
        if (criteria.endTime && event.timestamp > criteria.endTime)
          return false;
        if (
          criteria.phiAccessed !== undefined &&
          event.phiAccessed !== criteria.phiAccessed
        )
          return false;

        return true;
      })
      .slice(-limit);
  }

  /**
   * Export audit log
   */
  exportAuditLog(): {
    events: AuditEvent[];
    summary: AuditSummary;
    exportedAt: number;
    config: AuditConfig;
  } {
    return {
      events: [...this.auditEvents],
      summary: this.getAuditSummary(),
      exportedAt: Date.now(),
      config: { ...this.config },
    };
  }

  /**
   * Register alert callback
   */
  onAlert(callback: (event: AuditEvent) => void): void {
    this.alertCallbacks.push(callback);
  }

  /**
   * Private helper methods
   */
  private generateEventId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `audit_${timestamp}_${random}`;
  }

  private determineSeverity(
    eventType: AuditEventType,
    result: string,
  ): AuditSeverity {
    // Critical events
    if (
      eventType === AuditEventType.EMERGENCY_ACCESS ||
      eventType === AuditEventType.PHI_DELETED ||
      eventType === AuditEventType.CONFIGURATION_CHANGED
    ) {
      return AuditSeverity.CRITICAL;
    }

    // Error events
    if (
      result === 'FAILURE' ||
      eventType === AuditEventType.ACCESS_DENIED ||
      eventType === AuditEventType.LOGIN_FAILED
    ) {
      return AuditSeverity.ERROR;
    }

    // Warning events
    if (
      eventType === AuditEventType.PHI_ACCESSED ||
      eventType === AuditEventType.PHI_MODIFIED ||
      eventType === AuditEventType.PHI_EXPORTED
    ) {
      return AuditSeverity.WARNING;
    }

    return AuditSeverity.INFO;
  }

  private isSensitiveAction(eventType: AuditEventType): boolean {
    return this.config.sensitiveActions.includes(eventType);
  }

  private async handlePHIAccess(event: AuditEvent): Promise<void> {
    // Additional PHI access logging
    this.logger.log('PHI Access Detected', {
      eventId: event.eventId,
      userId: event.userId,
      studentId: event.studentId,
      resource: event.resource,
      timestamp: new Date(event.timestamp).toISOString(),
    });
  }

  private async triggerAlert(event: AuditEvent): Promise<void> {
    // Trigger all registered alert callbacks
    for (const callback of this.alertCallbacks) {
      try {
        callback(event);
      } catch (error) {
        this.logger.error('Alert callback failed', {
          error: error instanceof Error ? error.message : 'Unknown error',
          eventId: event.eventId,
        });
      }
    }
  }

  private cleanupOldEvents(): void {
    const cutoffTime =
      Date.now() - this.config.retentionPeriodDays * 24 * 60 * 60 * 1000;
    const initialCount = this.auditEvents.length;

    this.auditEvents = this.auditEvents.filter((e) => e.timestamp > cutoffTime);

    const cleaned = initialCount - this.auditEvents.length;
    if (cleaned > 0) {
      this.logger.log('Cleaned up old audit events', {
        removed: cleaned,
        remaining: this.auditEvents.length,
      });
    }
  }

  private isPHIAccess(path: string): boolean {
    const phiPaths = [
      '/api/patients',
      '/api/health-records',
      '/api/medical-history',
      '/api/medications',
      '/api/immunizations',
      '/api/allergies',
      '/api/diagnoses',
    ];

    return phiPaths.some((phiPath) => path.startsWith(phiPath));
  }

  private getClientIP(req: Request): string {
    return (
      (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
      (req.headers['x-real-ip'] as string) ||
      req.ip ||
      'unknown'
    );
  }

  /**
   * Cleanup on module destroy
   */
  onModuleDestroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}

/**
 * Factory functions
 */
export function createAuditMiddleware(config?: AuditConfig): AuditMiddleware {
  const middleware = new AuditMiddleware();
  if (config) {
    (middleware as any).config = config;
  }
  return middleware;
}

export function createHealthcareAudit(): AuditMiddleware {
  const middleware = new AuditMiddleware();
  (middleware as any).config = AUDIT_CONFIGS.healthcare;
  return middleware;
}

export function createProductionAudit(): AuditMiddleware {
  const middleware = new AuditMiddleware();
  (middleware as any).config = AUDIT_CONFIGS.production;
  return middleware;
}

/**
 * Default export
 */
export default AuditMiddleware;
