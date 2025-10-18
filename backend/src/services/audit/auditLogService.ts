/**
 * WC-GEN-217 | auditLogService.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../shared/logging/logger, ../../database/models, ../../database/types/enums | Dependencies: ../../shared/logging/logger, ../../database/models, ../../database/types/enums
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { logger } from '../../shared/logging/logger';
import { AuditLog } from '../../database/models';
import { AuditAction } from '../../database/types/enums';
import { AuditLogEntry } from './types';

/**
 * AuditLogService - Core audit logging functionality
 * 
 * Handles the creation and basic retrieval of audit log entries.
 * This service is the foundation for all audit operations and ensures
 * fail-safe logging that doesn't break the main application flow.
 */
export class AuditLogService {
  /**
   * Log general system action
   *
   * @param entry - Audit log entry details
   * @returns Promise<void>
   */
  static async logAction(entry: AuditLogEntry): Promise<void> {
    try {
      await AuditLog.create({
        userId: entry.userId,
        action: entry.action as AuditAction,
        entityType: entry.entityType,
        entityId: entry.entityId,
        changes: {
          ...entry.changes,
          success: entry.success !== undefined ? entry.success : true,
          errorMessage: entry.errorMessage,
          details: entry.changes || {}
        },
        ipAddress: entry.ipAddress,
        userAgent: entry.userAgent
      });

      logger.info(`Audit: ${entry.action} on ${entry.entityType}${entry.entityId ? ` (ID: ${entry.entityId})` : ''} by user ${entry.userId || 'SYSTEM'}`);
    } catch (error) {
      logger.error('Failed to create audit log:', error);
      // Don't throw - audit logging should not break the main flow
    }
  }

  /**
   * Get audit log by ID
   *
   * @param id - Audit log ID
   * @returns Promise with audit log details
   */
  static async getAuditLogById(id: string): Promise<AuditLog | null> {
    try {
      const log = await AuditLog.findByPk(id);
      return log;
    } catch (error) {
      logger.error('Error fetching audit log by ID:', error);
      throw new Error('Failed to fetch audit log');
    }
  }

  /**
   * Get recent audit logs
   *
   * @param limit - Number of recent logs to fetch
   * @returns Promise with recent audit logs
   */
  static async getRecentAuditLogs(limit: number = 50): Promise<AuditLog[]> {
    try {
      const logs = await AuditLog.findAll({
        limit,
        order: [['createdAt', 'DESC']]
      });

      return logs;
    } catch (error) {
      logger.error('Error fetching recent audit logs:', error);
      throw new Error('Failed to fetch recent audit logs');
    }
  }
}
