/**
 * Enterprise Audit Decorators
 *
 * Provides HIPAA-compliant audit logging capabilities for healthcare data access,
 * with support for PHI tracking, access logging, and compliance reporting.
 */

import { Injectable, SetMetadata } from '@nestjs/common';
import { AuditOptions, EnterpriseRequest } from './types';

/**
 * Metadata key for audit configuration
 */
export const AUDIT_METADATA = 'enterprise:audit';

/**
 * Audit log entry interface
 */
export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  userId: string;
  userRole: string;
  action: string;
  resource: string;
  resourceId?: string;
  ipAddress: string;
  userAgent: string;
  correlationId?: string;
  containsPHI: boolean;
  success: boolean;
  details?: Record<string, any>;
  errorMessage?: string;
}

/**
 * Enterprise audit service for HIPAA compliance
 */
@Injectable()
export class EnterpriseAuditService {
  private auditLogs: AuditLogEntry[] = [];
  private readonly maxLogsInMemory = 10000;

  /**
   * Log an audit event
   */
  async logAuditEvent(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<void> {
    const auditEntry: AuditLogEntry = {
      id: this.generateAuditId(),
      timestamp: new Date(),
      ...entry
    };

    // Store in memory (in production, this would go to a secure audit database)
    this.auditLogs.push(auditEntry);

    // Keep only recent logs in memory
    if (this.auditLogs.length > this.maxLogsInMemory) {
      this.auditLogs = this.auditLogs.slice(-this.maxLogsInMemory);
    }

    // Log to console for development (in production, use secure logging)
    const logLevel = auditEntry.containsPHI ? 'warn' : 'info';
    const message = `AUDIT: ${auditEntry.action} on ${auditEntry.resource} by ${auditEntry.userId}`;

    if (logLevel === 'warn') {
      console.warn(message, {
        resourceId: auditEntry.resourceId,
        correlationId: auditEntry.correlationId,
        success: auditEntry.success
      });
    } else {
      console.log(message, {
        resourceId: auditEntry.resourceId,
        correlationId: auditEntry.correlationId,
        success: auditEntry.success
      });
    }

    // In production, this would also send to external audit systems
    // await this.sendToAuditSystem(auditEntry);
  }

  /**
   * Get audit logs with filtering
   */
  getAuditLogs(filters?: {
    userId?: string;
    resource?: string;
    action?: string;
    containsPHI?: boolean;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): AuditLogEntry[] {
    let filteredLogs = this.auditLogs;

    if (filters) {
      filteredLogs = filteredLogs.filter(log => {
        if (filters.userId && log.userId !== filters.userId) return false;
        if (filters.resource && log.resource !== filters.resource) return false;
        if (filters.action && log.action !== filters.action) return false;
        if (filters.containsPHI !== undefined && log.containsPHI !== filters.containsPHI) return false;
        if (filters.startDate && log.timestamp < filters.startDate) return false;
        if (filters.endDate && log.timestamp > filters.endDate) return false;
        return true;
      });
    }

    // Sort by timestamp descending and apply limit
    return filteredLogs
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, filters?.limit || 100);
  }

  /**
   * Generate a unique audit ID
   */
  private generateAuditId(): string {
    return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Check if data contains PHI
   */
  containsPHI(data: any): boolean {
    if (!data) return false;

    const phiIndicators = [
      'ssn', 'socialSecurity', 'medicalRecord', 'diagnosis', 'medication',
      'health', 'patient', 'doctor', 'insurance', 'policy'
    ];

    const checkObject = (obj: any): boolean => {
      if (typeof obj === 'string') {
        const lower = obj.toLowerCase();
        return phiIndicators.some(indicator => lower.includes(indicator));
      } else if (typeof obj === 'object' && obj !== null) {
        return Object.values(obj).some(value => checkObject(value));
      }
      return false;
    };

    return checkObject(data);
  }
}

/**
 * Audit logging decorator
 */
export function AuditLog(options: AuditOptions) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const methodName = `${target.constructor.name}.${propertyKey}`;

    descriptor.value = async function (...args: any[]) {
      const auditService = (this as any).auditService as EnterpriseAuditService;
      const request = (this as any).request as EnterpriseRequest;

      if (!auditService || !request) {
        console.warn(`Audit service or request context not available for ${methodName}`);
        return await originalMethod.apply(this, args);
      }

      // Extract audit data
      const auditData = options.dataExtractor
        ? options.dataExtractor({} as any) // Would need proper ExecutionContext
        : {};

      const containsPHI = options.containsPHI || auditService.containsPHI(args);

      let success = false;
      let errorMessage: string | undefined;
      let result: any;

      try {
        result = await originalMethod.apply(this, args);
        success = true;
        return result;
      } catch (error) {
        errorMessage = error.message;
        throw error;
      } finally {
        // Log the audit event
        await auditService.logAuditEvent({
          userId: request.userContext?.id || 'anonymous',
          userRole: request.userContext?.roles?.[0] || 'unknown',
          action: options.eventType,
          resource: target.constructor.name,
          resourceId: auditData.resourceId,
          ipAddress: request.ip,
          userAgent: request.get('User-Agent') || '',
          correlationId: request.correlationId,
          containsPHI,
          success,
          details: auditData,
          errorMessage
        });
      }
    };

    SetMetadata(AUDIT_METADATA, options)(target, propertyKey, descriptor);
  };
}

/**
 * PHI access audit decorator
 */
export function AuditPHI(action: string) {
  return AuditLog({
    eventType: action,
    containsPHI: true,
    level: 'warn'
  });
}

/**
 * Data export audit decorator
 */
export function AuditDataExport(resourceType: string) {
  return AuditLog({
    eventType: 'DATA_EXPORT',
    containsPHI: true,
    dataExtractor: (context) => ({
      resourceType,
      exportTimestamp: new Date(),
      // Additional export metadata would be extracted here
    })
  });
}

/**
 * Authentication audit decorator
 */
export function AuditAuth(action: 'LOGIN' | 'LOGOUT' | 'FAILED_LOGIN') {
  return AuditLog({
    eventType: `AUTH_${action}`,
    containsPHI: false,
    dataExtractor: (context) => ({
      authAction: action,
      timestamp: new Date()
    })
  });
}

/**
 * Configuration change audit decorator
 */
export function AuditConfigChange() {
  return AuditLog({
    eventType: 'CONFIG_CHANGE',
    containsPHI: false,
    dataExtractor: (context) => ({
      changeType: 'configuration',
      timestamp: new Date()
      // Additional change details would be extracted here
    })
  });
}

/**
 * Emergency access audit decorator
 */
export function AuditEmergencyAccess(reason: string) {
  return AuditLog({
    eventType: 'EMERGENCY_ACCESS',
    containsPHI: true,
    level: 'critical',
    dataExtractor: (context) => ({
      emergencyReason: reason,
      timestamp: new Date(),
      requiresApproval: true
    })
  });
}