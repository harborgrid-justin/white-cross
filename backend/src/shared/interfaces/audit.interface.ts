/**
 * @fileoverview Audit Service Interface
 * @module shared/interfaces/audit.interface
 * @description Interface for audit logging services
 */

import { AuditContext } from '../context/request-context.service';

/**
 * Audit Log Entry
 */
export interface AuditLogEntry {
  action: string;
  resource: string;
  resourceId?: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
  success: boolean;
  details?: any;
  errorMessage?: string;
}

/**
 * Audit Service Interface
 *
 * Defines the contract for HIPAA-compliant audit logging.
 * All PHI access must be logged for compliance.
 */
export interface IAuditService {
  /**
   * Log an audit event
   */
  log(entry: AuditLogEntry): Promise<void>;

  /**
   * Log PHI access
   */
  logAccess(
    resource: string,
    resourceId: string,
    action: string,
    context: AuditContext,
  ): Promise<void>;

  /**
   * Log PHI modification
   */
  logModification(
    resource: string,
    resourceId: string,
    action: string,
    changes: any,
    context: AuditContext,
  ): Promise<void>;

  /**
   * Query audit logs
   */
  query?(filters: {
    userId?: string;
    resource?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): Promise<AuditLogEntry[]>;

  /**
   * Generate compliance report
   */
  generateReport?(
    startDate: Date,
    endDate: Date,
  ): Promise<{
    totalAccesses: number;
    byUser: Record<string, number>;
    byResource: Record<string, number>;
    anomalies: any[];
  }>;
}
