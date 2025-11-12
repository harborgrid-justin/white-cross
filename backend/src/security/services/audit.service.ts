/**
 * @fileoverview Enhanced Audit Service
 * @module security/services/audit
 * @description Comprehensive audit logging with filtering and retention
 *
 * @version 2.0.0
 * @requires @nestjs/common ^10.x
 */

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuditLogEntry, AuditCategory } from '../interfaces/security.interfaces';

@Injectable()
export class EnhancedAuditService {
  private readonly logger = new Logger(EnhancedAuditService.name);
  private auditLog: AuditLogEntry[] = [];
  private readonly maxLogSize = 10000;

  constructor(private readonly configService: ConfigService) {}

  /**
   * Logs an audit event
   */
  async logEvent(
    action: string,
    resource: string,
    result: 'SUCCESS' | 'FAILURE',
    context: {
      userId?: string;
      sessionId?: string;
      ipAddress: string;
      userAgent: string;
      metadata?: Record<string, unknown>;
    },
    category: AuditCategory = AuditCategory.DATA_ACCESS,
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'MEDIUM',
  ): Promise<void> {
    try {
      const auditEntry: AuditLogEntry = {
        id: this.generateAuditId(),
        timestamp: new Date(),
        action,
        resource,
        result,
        category,
        severity,
        ...context,
      };

      // Store audit entry
      this.auditLog.push(auditEntry);

      // Maintain log size
      if (this.auditLog.length > this.maxLogSize) {
        this.auditLog.shift();
      }

      // Log to console for immediate visibility
      const logLevel = this.getLogLevel(severity);
      this.logger[logLevel](`Audit Event: ${action} on ${resource} - ${result}`, {
        auditId: auditEntry.id,
        userId: context.userId,
        ipAddress: context.ipAddress,
        metadata: context.metadata,
      });

      // In production, persist to database or external audit system
    } catch (error) {
      this.logger.error('Failed to log audit event:', error);
    }
  }

  /**
   * Gets audit logs with filtering
   */
  getAuditLogs(filter?: {
    userId?: string;
    action?: string;
    category?: AuditCategory;
    startDate?: Date;
    endDate?: Date;
    severity?: string;
  }): AuditLogEntry[] {
    let filteredLogs = [...this.auditLog];

    if (filter) {
      if (filter.userId) {
        filteredLogs = filteredLogs.filter((log) => log.userId === filter.userId);
      }
      if (filter.action) {
        filteredLogs = filteredLogs.filter((log) => log.action.includes(filter.action));
      }
      if (filter.category) {
        filteredLogs = filteredLogs.filter((log) => log.category === filter.category);
      }
      if (filter.startDate) {
        filteredLogs = filteredLogs.filter((log) => log.timestamp >= filter.startDate);
      }
      if (filter.endDate) {
        filteredLogs = filteredLogs.filter((log) => log.timestamp <= filter.endDate);
      }
      if (filter.severity) {
        filteredLogs = filteredLogs.filter((log) => log.severity === filter.severity);
      }
    }

    return filteredLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  private generateAuditId(): string {
    return `audit_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  private getLogLevel(severity: string): 'log' | 'warn' | 'error' {
    switch (severity) {
      case 'CRITICAL':
      case 'HIGH':
        return 'error';
      case 'MEDIUM':
        return 'warn';
      default:
        return 'log';
    }
  }
}
