/**
 * Audit Service Implementation
 * Injectable NestJS service implementing IAuditLogger interface
 * HIPAA and FERPA compliant audit logging for all PHI access and modifications
 */

import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, QueryTypes } from 'sequelize';
import { IAuditLogger } from '../interfaces/audit/audit-logger.interface';
import { ExecutionContext } from '../types';
import { AuditAction, isPHIEntity, SENSITIVE_FIELDS } from '../types/database.enums';
import { AuditLog, ComplianceType, AuditSeverity } from '../models/audit-log.model';

/**
 * Interface for audit log query filters
 */
export interface AuditLogFilters {
  userId?: string;
  entityType?: string;
  entityId?: string;
  action?: AuditAction;
  isPHI?: boolean;
  complianceType?: ComplianceType;
  severity?: AuditSeverity;
  success?: boolean;
  startDate?: Date;
  endDate?: Date;
  tags?: string[];
  searchTerm?: string;
}

/**
 * Interface for audit log query options
 */
export interface AuditLogQueryOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

/**
 * Interface for audit statistics
 */
export interface AuditStatistics {
  totalLogs: number;
  phiAccessCount: number;
  failedOperations: number;
  byAction: Record<string, number>;
  byEntityType: Record<string, number>;
  byUser: Record<string, number>;
  bySeverity: Record<string, number>;
  byComplianceType: Record<string, number>;
}

/**
 * Interface for compliance report
 */
export interface ComplianceReport {
  period: { start: Date; end: Date };
  complianceType: ComplianceType;
  totalAccess: number;
  uniqueUsers: number;
  phiAccess: number;
  failedAccess: number;
  criticalEvents: number;
  topAccessedEntities: Array<{ entityType: string; count: number }>;
  userActivity: Array<{ userId: string; userName: string; accessCount: number }>;
}

/**
 * Audit Service
 *
 * Provides comprehensive audit logging with:
 * - HIPAA/FERPA compliant logging
 * - PHI access tracking
 * - Advanced querying and filtering
 * - Retention policy management
 * - Compliance reporting
 * - Export functionality
 */
@Injectable()
export class AuditService implements IAuditLogger {
  private readonly logger = new Logger(AuditService.name);

  constructor(
    @InjectModel(AuditLog)
    private readonly auditLogModel: typeof AuditLog,
  ) {
    this.logger.log('Audit service initialized with database support');
  }

  // ============================================================================
  // CORE AUDIT LOGGING METHODS (IAuditLogger Interface)
  // ============================================================================

  /**
   * Log entity creation
   */
  async logCreate(
    entityType: string,
    entityId: string,
    context: ExecutionContext,
    data: Record<string, unknown>,
  ): Promise<void> {
    await this.createAuditEntry({
      action: AuditAction.CREATE,
      entityType,
      entityId,
      context,
      newValues: data,
      previousValues: null,
      changes: data,
      success: true,
    });
  }

  /**
   * Log entity read/access
   * Only logs PHI entity access for performance
   */
  async logRead(
    entityType: string,
    entityId: string,
    context: ExecutionContext,
  ): Promise<void> {
    // Only log PHI entity access for performance
    if (isPHIEntity(entityType)) {
      await this.createAuditEntry({
        action: AuditAction.READ,
        entityType,
        entityId,
        context,
        changes: null,
        previousValues: null,
        newValues: null,
        success: true,
      });
    }
  }

  /**
   * Log entity update with before/after values
   */
  async logUpdate(
    entityType: string,
    entityId: string,
    context: ExecutionContext,
    changes: Record<string, { before: unknown; after: unknown }>,
  ): Promise<void> {
    const previousValues: Record<string, unknown> = {};
    const newValues: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(changes)) {
      previousValues[key] = value.before;
      newValues[key] = value.after;
    }

    await this.createAuditEntry({
      action: AuditAction.UPDATE,
      entityType,
      entityId,
      context,
      changes,
      previousValues: this.sanitizeSensitiveData(previousValues),
      newValues: this.sanitizeSensitiveData(newValues),
      success: true,
    });
  }

  /**
   * Log entity deletion
   */
  async logDelete(
    entityType: string,
    entityId: string,
    context: ExecutionContext,
    data: Record<string, unknown>,
  ): Promise<void> {
    await this.createAuditEntry({
      action: AuditAction.DELETE,
      entityType,
      entityId,
      context,
      previousValues: data,
      newValues: null,
      changes: data,
      success: true,
    });
  }

  /**
   * Log bulk operations
   */
  async logBulkOperation(
    operation: string,
    entityType: string,
    context: ExecutionContext,
    metadata: Record<string, unknown>,
  ): Promise<void> {
    const action = operation.includes('DELETE')
      ? AuditAction.BULK_DELETE
      : AuditAction.BULK_UPDATE;

    await this.createAuditEntry({
      action,
      entityType,
      entityId: null,
      context,
      changes: null,
      previousValues: null,
      newValues: null,
      metadata,
      success: true,
      severity: AuditSeverity.HIGH,
    });
  }

  /**
   * Log export operations
   */
  async logExport(
    entityType: string,
    context: ExecutionContext,
    metadata: Record<string, unknown>,
  ): Promise<void> {
    await this.createAuditEntry({
      action: AuditAction.EXPORT,
      entityType,
      entityId: null,
      context,
      changes: null,
      previousValues: null,
      newValues: null,
      metadata,
      success: true,
      severity: isPHIEntity(entityType) ? AuditSeverity.HIGH : AuditSeverity.MEDIUM,
    });
  }

  /**
   * Log transaction operations
   */
  async logTransaction(
    operation: string,
    context: ExecutionContext,
    metadata: Record<string, unknown>,
  ): Promise<void> {
    const action = operation.includes('COMMIT')
      ? AuditAction.TRANSACTION_COMMIT
      : AuditAction.TRANSACTION_ROLLBACK;

    await this.createAuditEntry({
      action,
      entityType: 'Transaction',
      entityId: metadata.transactionId as string,
      context,
      changes: null,
      previousValues: null,
      newValues: null,
      metadata,
      success: operation.includes('COMMIT'),
    });
  }

  /**
   * Log cache access operations
   */
  async logCacheAccess(
    operation: string,
    cacheKey: string,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    const action =
      operation === 'READ'
        ? AuditAction.CACHE_READ
        : operation === 'WRITE'
        ? AuditAction.CACHE_WRITE
        : AuditAction.CACHE_DELETE;

    // Only log cache operations for PHI data
    const isPHICache = cacheKey.toLowerCase().includes('health') ||
                       cacheKey.toLowerCase().includes('student') ||
                       cacheKey.toLowerCase().includes('medication');

    if (isPHICache) {
      try {
        await (this.auditLogModel as any).create({
          action,
          entityType: 'Cache',
          entityId: null,
          userId: null,
          userName: 'SYSTEM',
          changes: null,
          previousValues: null,
          newValues: null,
          ipAddress: null,
          userAgent: null,
          requestId: null,
          sessionId: null,
          isPHI: true,
          complianceType: ComplianceType.HIPAA,
          severity: AuditSeverity.LOW,
          success: true,
          errorMessage: null,
          metadata: { cacheKey, ...metadata },
          tags: ['cache', 'system'],
        });
      } catch (error) {
        this.logger.warn(`Failed to log cache access: ${error.message}`);
      }
    } else {
      this.logger.debug(`Cache ${action}: ${cacheKey}`);
    }
  }

  // ============================================================================
  // ADDITIONAL AUDIT LOGGING METHODS
  // ============================================================================

  /**
   * Log authentication events (login, logout, password change)
   */
  async logAuthEvent(
    action: 'LOGIN' | 'LOGOUT' | 'PASSWORD_CHANGE' | 'MFA_ENABLED' | 'MFA_DISABLED',
    userId: string,
    context: ExecutionContext,
    success: boolean = true,
    errorMessage?: string,
  ): Promise<void> {
    await this.createAuditEntry({
      action: AuditAction.UPDATE,
      entityType: 'User',
      entityId: userId,
      context,
      changes: { action },
      previousValues: null,
      newValues: null,
      success,
      errorMessage: errorMessage || null,
      severity: success ? AuditSeverity.LOW : AuditSeverity.HIGH,
      tags: ['authentication', action.toLowerCase()],
    });
  }

  /**
   * Log authorization events (permission checks, role changes)
   */
  async logAuthzEvent(
    action: string,
    userId: string,
    resource: string,
    context: ExecutionContext,
    granted: boolean,
    reason?: string,
  ): Promise<void> {
    await this.createAuditEntry({
      action: AuditAction.UPDATE,
      entityType: 'Authorization',
      entityId: userId,
      context,
      changes: { action, resource, granted, reason },
      previousValues: null,
      newValues: null,
      success: granted,
      errorMessage: granted ? null : reason || 'Access denied',
      severity: granted ? AuditSeverity.LOW : AuditSeverity.MEDIUM,
      tags: ['authorization', granted ? 'granted' : 'denied'],
    });
  }

  /**
   * Log security events
   */
  async logSecurityEvent(
    eventType: string,
    description: string,
    context: ExecutionContext,
    severity: AuditSeverity = AuditSeverity.HIGH,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    await this.createAuditEntry({
      action: AuditAction.UPDATE,
      entityType: 'SecurityEvent',
      entityId: null,
      context,
      changes: { eventType, description },
      previousValues: null,
      newValues: null,
      metadata,
      success: true,
      severity,
      tags: ['security', eventType],
    });
  }

  /**
   * Log failed operation
   */
  async logFailure(
    action: AuditAction,
    entityType: string,
    entityId: string | null,
    context: ExecutionContext,
    errorMessage: string,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    await this.createAuditEntry({
      action,
      entityType,
      entityId,
      context,
      changes: null,
      previousValues: null,
      newValues: null,
      success: false,
      errorMessage,
      metadata,
      severity: AuditSeverity.HIGH,
      tags: ['failure', 'error'],
    });
  }

  // ============================================================================
  // QUERYING AND FILTERING
  // ============================================================================

  /**
   * Query audit logs with filters and pagination
   */
  async queryAuditLogs(
    filters: AuditLogFilters = {},
    options: AuditLogQueryOptions = {},
  ): Promise<{ logs: AuditLog[]; total: number; page: number; pages: number }> {
    const page = options.page || 1;
    const limit = options.limit || 50;
    const offset = (page - 1) * limit;
    const sortBy = options.sortBy || 'createdAt';
    const sortOrder = options.sortOrder || 'DESC';

    // Build where clause
    const where: any = {};

    if (filters.userId) where.userId = filters.userId;
    if (filters.entityType) where.entityType = filters.entityType;
    if (filters.entityId) where.entityId = filters.entityId;
    if (filters.action) where.action = filters.action;
    if (filters.isPHI !== undefined) where.isPHI = filters.isPHI;
    if (filters.complianceType) where.complianceType = filters.complianceType;
    if (filters.severity) where.severity = filters.severity;
    if (filters.success !== undefined) where.success = filters.success;

    // Date range filter
    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt[Op.gte] = filters.startDate;
      if (filters.endDate) where.createdAt[Op.lte] = filters.endDate;
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      where.tags = {
        [Op.overlap]: filters.tags,
      };
    }

    // Search term filter (searches in multiple fields)
    if (filters.searchTerm) {
      where[Op.or] = [
        { userName: { [Op.iLike]: `%${filters.searchTerm}%` } },
        { entityType: { [Op.iLike]: `%${filters.searchTerm}%` } },
        { entityId: { [Op.iLike]: `%${filters.searchTerm}%` } },
      ];
    }

    try {
      const { rows: logs, count: total } = await this.auditLogModel.findAndCountAll({
        where,
        offset,
        limit,
        order: [[sortBy, sortOrder]],
      });

      return {
        logs,
        total,
        page,
        pages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error(`Failed to query audit logs: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Get audit logs for a specific entity
   */
  async getEntityAuditHistory(
    entityType: string,
    entityId: string,
    options: AuditLogQueryOptions = {},
  ): Promise<AuditLog[]> {
    const result = await this.queryAuditLogs(
      { entityType, entityId },
      { ...options, sortOrder: 'ASC' },
    );
    return result.logs;
  }

  /**
   * Get audit logs for a specific user
   */
  async getUserAuditHistory(
    userId: string,
    options: AuditLogQueryOptions = {},
  ): Promise<AuditLog[]> {
    const result = await this.queryAuditLogs(
      { userId },
      { ...options, sortOrder: 'DESC' },
    );
    return result.logs;
  }

  /**
   * Get PHI access logs (for HIPAA compliance)
   */
  async getPHIAccessLogs(
    startDate: Date,
    endDate: Date,
    options: AuditLogQueryOptions = {},
  ): Promise<AuditLog[]> {
    const result = await this.queryAuditLogs(
      { isPHI: true, startDate, endDate },
      { ...options, sortOrder: 'DESC' },
    );
    return result.logs;
  }

  // ============================================================================
  // STATISTICS AND ANALYTICS
  // ============================================================================

  /**
   * Get audit statistics for a date range
   */
  async getAuditStatistics(
    startDate: Date,
    endDate: Date,
  ): Promise<AuditStatistics> {
    try {
      const where = {
        createdAt: {
          [Op.gte]: startDate,
          [Op.lte]: endDate,
        },
      };

      const [totalLogs, phiAccessCount, failedOperations] = await Promise.all([
        this.auditLogModel.count({ where }),
        this.auditLogModel.count({ where: { ...where, isPHI: true } }),
        this.auditLogModel.count({ where: { ...where, success: false } }),
      ]);

      // Get counts by action
      const actionCounts = await this.auditLogModel.findAll({
        where,
        attributes: [
          'action',
          [this.auditLogModel.sequelize!.fn('COUNT', '*'), 'count'],
        ],
        group: ['action'],
        raw: true,
      });

      const byAction: Record<string, number> = {};
      for (const row of actionCounts as any[]) {
        byAction[row.action] = parseInt(row.count, 10);
      }

      // Get counts by entity type
      const entityCounts = await this.auditLogModel.findAll({
        where,
        attributes: [
          'entityType',
          [this.auditLogModel.sequelize!.fn('COUNT', '*'), 'count'],
        ],
        group: ['entityType'],
        raw: true,
        limit: 10,
      });

      const byEntityType: Record<string, number> = {};
      for (const row of entityCounts as any[]) {
        byEntityType[row.entityType] = parseInt(row.count, 10);
      }

      // Get counts by user
      const userCounts = await this.auditLogModel.findAll({
        where: { ...where, userId: { [Op.ne]: null } },
        attributes: [
          'userId',
          [this.auditLogModel.sequelize!.fn('COUNT', '*'), 'count'],
        ],
        group: ['userId'],
        raw: true,
        limit: 10,
      });

      const byUser: Record<string, number> = {};
      for (const row of userCounts as any[]) {
        byUser[row.userId] = parseInt(row.count, 10);
      }

      // Get counts by severity
      const severityCounts = await this.auditLogModel.findAll({
        where,
        attributes: [
          'severity',
          [this.auditLogModel.sequelize!.fn('COUNT', '*'), 'count'],
        ],
        group: ['severity'],
        raw: true,
      });

      const bySeverity: Record<string, number> = {};
      for (const row of severityCounts as any[]) {
        bySeverity[row.severity] = parseInt(row.count, 10);
      }

      // Get counts by compliance type
      const complianceCounts = await this.auditLogModel.findAll({
        where,
        attributes: [
          'complianceType',
          [this.auditLogModel.sequelize!.fn('COUNT', '*'), 'count'],
        ],
        group: ['complianceType'],
        raw: true,
      });

      const byComplianceType: Record<string, number> = {};
      for (const row of complianceCounts as any[]) {
        byComplianceType[row.complianceType] = parseInt(row.count, 10);
      }

      return {
        totalLogs,
        phiAccessCount,
        failedOperations,
        byAction,
        byEntityType,
        byUser,
        bySeverity,
        byComplianceType,
      };
    } catch (error) {
      this.logger.error(`Failed to get audit statistics: ${error.message}`, error.stack);
      throw error;
    }
  }

  // ============================================================================
  // COMPLIANCE REPORTING
  // ============================================================================

  /**
   * Generate compliance report (HIPAA, FERPA, etc.)
   */
  async generateComplianceReport(
    complianceType: ComplianceType,
    startDate: Date,
    endDate: Date,
  ): Promise<ComplianceReport> {
    try {
      const where = {
        complianceType,
        createdAt: {
          [Op.gte]: startDate,
          [Op.lte]: endDate,
        },
      };

      const [totalAccess, phiAccess, failedAccess, criticalEvents] = await Promise.all([
        this.auditLogModel.count({ where }),
        this.auditLogModel.count({ where: { ...where, isPHI: true } }),
        this.auditLogModel.count({ where: { ...where, success: false } }),
        this.auditLogModel.count({
          where: { ...where, severity: AuditSeverity.CRITICAL },
        }),
      ]);

      // Get unique users
      const uniqueUsersResult = await this.auditLogModel.findAll({
        where: { ...where, userId: { [Op.ne]: null } },
        attributes: [[this.auditLogModel.sequelize!.fn('COUNT', this.auditLogModel.sequelize!.fn('DISTINCT', this.auditLogModel.sequelize!.col('userId'))), 'count']],
        raw: true,
      });
      const uniqueUsers = parseInt((uniqueUsersResult[0] as any).count, 10);

      // Top accessed entities
      const entityCounts = await this.auditLogModel.findAll({
        where,
        attributes: [
          'entityType',
          [this.auditLogModel.sequelize!.fn('COUNT', '*'), 'count'],
        ],
        group: ['entityType'],
        order: [[this.auditLogModel.sequelize!.literal('count'), 'DESC']],
        limit: 10,
        raw: true,
      });

      const topAccessedEntities = (entityCounts as any[]).map((row) => ({
        entityType: row.entityType,
        count: parseInt(row.count, 10),
      }));

      // User activity
      const userActivity = await this.auditLogModel.findAll({
        where: { ...where, userId: { [Op.ne]: null } },
        attributes: [
          'userId',
          'userName',
          [this.auditLogModel.sequelize!.fn('COUNT', '*'), 'count'],
        ],
        group: ['userId', 'userName'],
        order: [[this.auditLogModel.sequelize!.literal('count'), 'DESC']],
        limit: 20,
        raw: true,
      });

      return {
        period: { start: startDate, end: endDate },
        complianceType,
        totalAccess,
        uniqueUsers,
        phiAccess,
        failedAccess,
        criticalEvents,
        topAccessedEntities,
        userActivity: (userActivity as any[]).map((row) => ({
          userId: row.userId,
          userName: row.userName || 'Unknown',
          accessCount: parseInt(row.count, 10),
        })),
      };
    } catch (error) {
      this.logger.error(`Failed to generate compliance report: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Get HIPAA compliance report
   */
  async getHIPAAReport(startDate: Date, endDate: Date): Promise<ComplianceReport> {
    return this.generateComplianceReport(ComplianceType.HIPAA, startDate, endDate);
  }

  /**
   * Get FERPA compliance report
   */
  async getFERPAReport(startDate: Date, endDate: Date): Promise<ComplianceReport> {
    return this.generateComplianceReport(ComplianceType.FERPA, startDate, endDate);
  }

  // ============================================================================
  // EXPORT FUNCTIONALITY
  // ============================================================================

  /**
   * Export audit logs to CSV format
   */
  async exportToCSV(
    filters: AuditLogFilters = {},
    includeFullDetails: boolean = false,
  ): Promise<string> {
    try {
      const result = await this.queryAuditLogs(filters, { limit: 10000 });
      const logs = result.logs;

      if (logs.length === 0) {
        return 'No audit logs found matching the filters';
      }

      // CSV headers
      const headers = includeFullDetails
        ? [
            'ID',
            'Timestamp',
            'Action',
            'Entity Type',
            'Entity ID',
            'User ID',
            'User Name',
            'IP Address',
            'Is PHI',
            'Compliance Type',
            'Severity',
            'Success',
            'Error Message',
            'Changes',
          ]
        : [
            'ID',
            'Timestamp',
            'Action',
            'Entity Type',
            'Entity ID',
            'User Name',
            'Is PHI',
            'Compliance Type',
            'Success',
          ];

      let csv = headers.join(',') + '\n';

      // CSV rows
      for (const log of logs) {
        const row = includeFullDetails
          ? [
              log.id,
              log.createdAt.toISOString(),
              log.action,
              log.entityType,
              log.entityId || '',
              log.userId || '',
              log.userName || '',
              log.ipAddress || '',
              log.isPHI,
              log.complianceType,
              log.severity,
              log.success,
              log.errorMessage ? `"${log.errorMessage.replace(/"/g, '""')}"` : '',
              log.changes ? `"${JSON.stringify(log.changes).replace(/"/g, '""')}"` : '',
            ]
          : [
              log.id,
              log.createdAt.toISOString(),
              log.action,
              log.entityType,
              log.entityId || '',
              log.userName || '',
              log.isPHI,
              log.complianceType,
              log.success,
            ];

        csv += row.join(',') + '\n';
      }

      return csv;
    } catch (error) {
      this.logger.error(`Failed to export audit logs to CSV: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Export audit logs to JSON format
   */
  async exportToJSON(
    filters: AuditLogFilters = {},
    includeFullDetails: boolean = false,
  ): Promise<string> {
    try {
      const result = await this.queryAuditLogs(filters, { limit: 10000 });
      const logs = result.logs.map((log) => log.toExportObject(includeFullDetails));

      return JSON.stringify(
        {
          exportedAt: new Date().toISOString(),
          total: logs.length,
          filters,
          logs,
        },
        null,
        2,
      );
    } catch (error) {
      this.logger.error(`Failed to export audit logs to JSON: ${error.message}`, error.stack);
      throw error;
    }
  }

  // ============================================================================
  // RETENTION POLICY MANAGEMENT
  // ============================================================================

  /**
   * Execute retention policy (delete old audit logs based on compliance requirements)
   */
  async executeRetentionPolicy(dryRun: boolean = true): Promise<{
    deleted: number;
    retained: number;
    details: Record<string, number>;
  }> {
    try {
      const now = new Date();
      const details: Record<string, number> = {};

      // HIPAA: 7 years
      const hipaaRetentionDate = new Date(now);
      hipaaRetentionDate.setFullYear(hipaaRetentionDate.getFullYear() - 7);

      const hipaaExpired = await this.auditLogModel.findAll({
        where: {
          complianceType: ComplianceType.HIPAA,
          createdAt: { [Op.lt]: hipaaRetentionDate },
        },
      });
      details['HIPAA_expired'] = hipaaExpired.length;

      // FERPA: 5 years
      const ferpaRetentionDate = new Date(now);
      ferpaRetentionDate.setFullYear(ferpaRetentionDate.getFullYear() - 5);

      const ferpaExpired = await this.auditLogModel.findAll({
        where: {
          complianceType: ComplianceType.FERPA,
          createdAt: { [Op.lt]: ferpaRetentionDate },
        },
      });
      details['FERPA_expired'] = ferpaExpired.length;

      // General: 3 years
      const generalRetentionDate = new Date(now);
      generalRetentionDate.setFullYear(generalRetentionDate.getFullYear() - 3);

      const generalExpired = await this.auditLogModel.findAll({
        where: {
          complianceType: ComplianceType.GENERAL,
          createdAt: { [Op.lt]: generalRetentionDate },
        },
      });
      details['GENERAL_expired'] = generalExpired.length;

      const totalToDelete = hipaaExpired.length + ferpaExpired.length + generalExpired.length;
      const totalLogs = await this.auditLogModel.count();
      const retained = totalLogs - totalToDelete;

      if (!dryRun && totalToDelete > 0) {
        // Actually delete the logs
        await this.auditLogModel.destroy({
          where: {
            [Op.or]: [
              {
                complianceType: ComplianceType.HIPAA,
                createdAt: { [Op.lt]: hipaaRetentionDate },
              },
              {
                complianceType: ComplianceType.FERPA,
                createdAt: { [Op.lt]: ferpaRetentionDate },
              },
              {
                complianceType: ComplianceType.GENERAL,
                createdAt: { [Op.lt]: generalRetentionDate },
              },
            ],
          },
        });

        this.logger.log(
          `Retention policy executed: deleted ${totalToDelete} logs, retained ${retained} logs`,
        );
      } else {
        this.logger.log(
          `Retention policy dry run: would delete ${totalToDelete} logs, retain ${retained} logs`,
        );
      }

      return {
        deleted: totalToDelete,
        retained,
        details,
      };
    } catch (error) {
      this.logger.error(`Failed to execute retention policy: ${error.message}`, error.stack);
      throw error;
    }
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  /**
   * Create audit entry in database
   */
  private async createAuditEntry(params: {
    action: AuditAction;
    entityType: string;
    entityId: string | null;
    context: ExecutionContext;
    changes: any;
    previousValues?: any;
    newValues?: any;
    metadata?: any;
    success?: boolean;
    errorMessage?: string | null;
    severity?: AuditSeverity;
    tags?: string[];
  }): Promise<void> {
    const {
      action,
      entityType,
      entityId,
      context,
      changes,
      previousValues = null,
      newValues = null,
      metadata = null,
      success = true,
      errorMessage = null,
      severity,
      tags = [],
    } = params;

    try {
      // Determine if this is PHI data
      const isPHI = isPHIEntity(entityType);

      // Determine compliance type
      const complianceType = this.determineComplianceType(entityType, isPHI);

      // Determine severity if not provided
      const auditSeverity = severity || this.determineSeverity(action, entityType, success);

      // Sanitize sensitive data
      const sanitizedChanges = changes ? this.sanitizeSensitiveData(changes) : null;
      const sanitizedPreviousValues = previousValues
        ? this.sanitizeSensitiveData(previousValues)
        : null;
      const sanitizedNewValues = newValues ? this.sanitizeSensitiveData(newValues) : null;

      // Create audit log entry
      await (this.auditLogModel as any).create({
        action,
        entityType,
        entityId,
        userId: context.userId || null,
        userName: context.userId || null,
        changes: sanitizedChanges,
        previousValues: sanitizedPreviousValues,
        newValues: sanitizedNewValues,
        ipAddress: context.ipAddress || null,
        userAgent: context.userAgent || null,
        requestId: context.transactionId || context.correlationId || null,
        sessionId: context.correlationId || null,
        isPHI,
        complianceType,
        severity: auditSeverity,
        success,
        errorMessage,
        metadata,
        tags: [...tags, entityType.toLowerCase(), action.toLowerCase()],
      });

      this.logger.debug(
        `AUDIT [${action}] ${entityType}:${entityId || 'bulk'} by ${context.userId || 'SYSTEM'} - ${success ? 'SUCCESS' : 'FAILED'}`,
      );
    } catch (error) {
      this.logger.error(`Failed to create audit entry: ${error.message}`, error.stack);
      // Don't throw - audit failures shouldn't break operations
    }
  }

  /**
   * Determine compliance type based on entity type
   */
  private determineComplianceType(entityType: string, isPHI: boolean): ComplianceType {
    if (isPHI) {
      return ComplianceType.HIPAA;
    }

    const ferpaEntities = ['Student', 'AcademicRecord', 'GradeTransition', 'Attendance'];
    if (ferpaEntities.includes(entityType)) {
      return ComplianceType.FERPA;
    }

    return ComplianceType.GENERAL;
  }

  /**
   * Determine severity based on action, entity type, and success
   */
  private determineSeverity(
    action: AuditAction,
    entityType: string,
    success: boolean,
  ): AuditSeverity {
    if (!success) {
      return AuditSeverity.HIGH;
    }

    const criticalActions = [
      AuditAction.DELETE,
      AuditAction.BULK_DELETE,
      AuditAction.EXPORT,
    ];
    if (criticalActions.includes(action)) {
      return AuditSeverity.HIGH;
    }

    if (isPHIEntity(entityType)) {
      return AuditSeverity.MEDIUM;
    }

    return AuditSeverity.LOW;
  }

  /**
   * Sanitize sensitive data before storing in audit logs
   */
  private sanitizeSensitiveData(data: any): any {
    if (!data || typeof data !== 'object') {
      return data;
    }

    const sanitized = { ...data };

    for (const field of SENSITIVE_FIELDS) {
      if (field in sanitized) {
        sanitized[field] = '[REDACTED]';
      }
    }

    // Recursively sanitize nested objects
    for (const [key, value] of Object.entries(sanitized)) {
      if (value && typeof value === 'object') {
        sanitized[key] = this.sanitizeSensitiveData(value);
      }
    }

    return sanitized;
  }
}
