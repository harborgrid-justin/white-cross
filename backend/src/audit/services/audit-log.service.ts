import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AuditAction, AuditLog, AuditSeverity, ComplianceType } from '@/database';
import { IAuditLogEntry } from '../interfaces/audit-log-entry.interface';

import { BaseService } from '../../../common/base';
/**
 * AuditLogService - Core audit logging functionality
 *
 * Handles the creation and basic retrieval of audit log entries.
 * This service is the foundation for all audit operations and ensures
 * fail-safe logging that doesn't break the main application flow.
 *
 * HIPAA Compliance: All operations are designed to never throw errors
 * that would break the main application flow.
 */
@Injectable()
export class AuditLogService extends BaseService {
  constructor(
    @InjectModel(AuditLog)
    private readonly auditLogModel: typeof AuditLog,
  ) {}

  /**
   * Log general system action
   * FAIL-SAFE: This method will never throw an error to the caller
   *
   * @param entry - Audit log entry details
   * @returns Promise<void>
   */
  async logAction(entry: IAuditLogEntry): Promise<void> {
    try {
      await this.auditLogModel.create({
        userId: entry.userId || null,
        action: entry.action as AuditAction,
        entityType: entry.entityType,
        entityId: entry.entityId || null,
        changes: {
          ...entry.changes,
          success: entry.success !== undefined ? entry.success : true,
          errorMessage: entry.errorMessage,
          details: entry.changes || {},
        },
        ipAddress: entry.ipAddress || null,
        userAgent: entry.userAgent || null,
        isPHI: false, // Default to false for general audit logs
        complianceType: ComplianceType.GENERAL,
        severity: AuditSeverity.LOW,
        success: entry.success !== undefined ? entry.success : true,
        tags: [],
      });

      this.logInfo(
        `Audit: ${entry.action} on ${entry.entityType}${entry.entityId ? ` (ID: ${entry.entityId})` : ''} by user ${entry.userId || 'SYSTEM'}`,
      );
    } catch (error) {
      // FAIL-SAFE: Never throw - audit logging should not break the main flow
      this.logError('Failed to create audit log:', error);
    }
  }

  /**
   * Get audit log by ID
   *
   * @param id - Audit log ID
   * @returns Promise with audit log details or null
   */
  async getAuditLogById(id: string): Promise<AuditLog | null> {
    try {
      return await this.auditLogModel.findByPk(id);
    } catch (error) {
      this.logError('Error fetching audit log by ID:', error);
      throw new Error('Failed to fetch audit log');
    }
  }

  /**
   * Get recent audit logs
   *
   * @param limit - Number of recent logs to fetch
   * @returns Promise with recent audit logs
   */
  async getRecentAuditLogs(limit: number = 50): Promise<AuditLog[]> {
    try {
      return await this.auditLogModel.findAll({
        order: [['createdAt', 'DESC']],
        limit: limit,
      });
    } catch (error) {
      this.logError('Error fetching recent audit logs:', error);
      throw new Error('Failed to fetch recent audit logs');
    }
  }
}
