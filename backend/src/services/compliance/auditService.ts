/**
 * @fileoverview Compliance Audit Service - HIPAA-compliant audit logging and tracking
 *
 * This service provides comprehensive audit trail management required for healthcare compliance,
 * including HIPAA audit logging (45 CFR 164.312(b)), user action tracking, and PHI access
 * monitoring. All interactions with Protected Health Information (PHI) must be logged through
 * this service to maintain regulatory compliance and enable security investigations.
 *
 * Key responsibilities:
 * - Record all PHI access and modifications with complete context (user, timestamp, IP, changes)
 * - Provide comprehensive audit log retrieval with filtering by user, entity, action, and date range
 * - Generate audit statistics and analytics for compliance reporting and anomaly detection
 * - Maintain immutable audit trails for legal and regulatory requirements
 * - Support security investigations and compliance audits with detailed access history
 *
 * HIPAA Compliance:
 * - Implements audit control requirements under 45 CFR 164.312(b)
 * - Maintains complete audit trails of electronic PHI access and modifications
 * - Provides tamper-evident logging for security rule compliance
 * - Enables periodic audit reviews and access reports
 *
 * Integration Points:
 * - Called by all services handling PHI (health records, medications, appointments)
 * - Used by compliance reporting services for regulatory reports
 * - Integrated with security monitoring and alerting systems
 * - Provides data for compliance dashboards and analytics
 *
 * @module services/compliance/auditService
 * @since 1.0.0
 */

import { Op } from 'sequelize';
import { logger } from '../../utils/logger';
import { AuditLog } from '../../database/models';
import {
  AuditLogFilters,
  PaginationResult,
  CreateAuditLogData
} from './types';

/**
 * Service for managing HIPAA-compliant audit logs and compliance tracking.
 *
 * This service provides comprehensive audit logging capabilities required for
 * healthcare compliance, including HIPAA audit trails, user action tracking,
 * and compliance reporting. All PHI access and modifications are logged with
 * full context including user, timestamp, IP address, and change details.
 *
 * HIPAA Compliance: Maintains complete audit trails as required by 45 CFR 164.312(b)
 * for tracking all access to and modifications of Protected Health Information (PHI).
 *
 * @example
 * ```typescript
 * // Retrieve audit logs with filters
 * const result = await AuditService.getAuditLogs(1, 50, {
 *   userId: 'user-123',
 *   entityType: 'HealthRecord',
 *   startDate: new Date('2025-01-01'),
 *   endDate: new Date('2025-01-31')
 * });
 * console.log(`Found ${result.pagination.total} audit entries`);
 *
 * // Create audit log for PHI access
 * await AuditService.createAuditLog({
 *   userId: 'user-123',
 *   action: 'VIEW',
 *   entityType: 'HealthRecord',
 *   entityId: 'record-456',
 *   ipAddress: '192.168.1.100'
 * });
 * ```
 */
export class AuditService {
  /**
   * Retrieves paginated audit logs with optional filtering for compliance tracking.
   *
   * This method supports comprehensive filtering by user, entity type, action,
   * and date range to facilitate compliance audits and security investigations.
   * Results are ordered by creation date (most recent first) for efficient
   * review of recent activity.
   *
   * HIPAA Compliance: Essential for demonstrating compliance with audit logging
   * requirements under 45 CFR 164.312(b).
   *
   * @param {number} [page=1] - Page number for pagination (1-based indexing)
   * @param {number} [limit=50] - Number of records per page (max 100 recommended for performance)
   * @param {AuditLogFilters} [filters={}] - Optional filters to narrow results
   * @param {string} [filters.userId] - Filter by specific user ID
   * @param {string} [filters.entityType] - Filter by entity type (e.g., 'HealthRecord', 'Medication')
   * @param {AuditAction} [filters.action] - Filter by action type (e.g., 'CREATE', 'VIEW', 'UPDATE', 'DELETE')
   * @param {Date} [filters.startDate] - Filter logs created on or after this date
   * @param {Date} [filters.endDate] - Filter logs created on or before this date
   * @returns {Promise<{logs: AuditLog[], pagination: PaginationResult}>} Paginated audit logs with metadata
   * @throws {Error} When database query fails or connection issues occur
   *
   * @example
   * ```typescript
   * // Get all audit logs for a specific user
   * const userLogs = await AuditService.getAuditLogs(1, 20, {
   *   userId: 'nurse-123'
   * });
   *
   * // Get audit logs for health record access in date range
   * const phiAccess = await AuditService.getAuditLogs(1, 100, {
   *   entityType: 'HealthRecord',
   *   action: 'VIEW',
   *   startDate: new Date('2025-01-01'),
   *   endDate: new Date('2025-01-31')
   * });
   * ```
   */
  static async getAuditLogs(
    page: number = 1,
    limit: number = 50,
    filters: AuditLogFilters = {}
  ): Promise<{
    logs: AuditLog[];
    pagination: PaginationResult;
  }> {
    try {
      const offset = (page - 1) * limit;
      const whereClause: any = {};

      if (filters.userId) {
        whereClause.userId = filters.userId;
      }
      if (filters.entityType) {
        whereClause.entityType = filters.entityType;
      }
      if (filters.action) {
        whereClause.action = filters.action;
      }
      if (filters.startDate || filters.endDate) {
        whereClause.createdAt = {};
        if (filters.startDate) {
          whereClause.createdAt[Op.gte] = filters.startDate;
        }
        if (filters.endDate) {
          whereClause.createdAt[Op.lte] = filters.endDate;
        }
      }

      const { rows: logs, count: total } = await AuditLog.findAndCountAll({
        where: whereClause,
        offset,
        limit,
        order: [['createdAt', 'DESC']],
        distinct: true
      });

      logger.info(`Retrieved ${logs.length} audit logs`);

      return {
        logs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error getting audit logs:', error);
      throw new Error('Failed to fetch audit logs');
    }
  }

  /**
   * Retrieves a specific audit log entry by its unique identifier.
   *
   * Used for detailed inspection of individual audit events during
   * compliance reviews, security investigations, or PHI access audits.
   *
   * @param {string} id - The unique identifier of the audit log entry
   * @returns {Promise<AuditLog>} The requested audit log entry
   * @throws {Error} When audit log is not found or database query fails
   *
   * @example
   * ```typescript
   * try {
   *   const auditEntry = await AuditService.getAuditLogById('audit-log-123');
   *   console.log(`Action: ${auditEntry.action} by user ${auditEntry.userId}`);
   * } catch (error) {
   *   console.error('Audit log not found');
   * }
   * ```
   */
  static async getAuditLogById(id: string): Promise<AuditLog> {
    try {
      const log = await AuditLog.findByPk(id);

      if (!log) {
        throw new Error('Audit log not found');
      }

      logger.info(`Retrieved audit log: ${id}`);
      return log;
    } catch (error) {
      logger.error(`Error getting audit log ${id}:`, error);
      throw error;
    }
  }

  /**
   * Creates a new audit log entry for HIPAA compliance tracking.
   *
   * This is a critical function for maintaining legally required audit trails
   * of all PHI access and modifications. Every interaction with protected health
   * information must generate an audit log entry to demonstrate compliance with
   * HIPAA security rules.
   *
   * The audit log captures comprehensive context including:
   * - User identity and authentication status
   * - Specific action performed (CREATE, VIEW, UPDATE, DELETE)
   * - Entity type and ID being accessed or modified
   * - Detailed change tracking (before/after values)
   * - IP address and user agent for security analysis
   * - Precise timestamp for chronological audit trails
   *
   * HIPAA Compliance: Required by 45 CFR 164.312(b) - Audit controls must record
   * and examine activity in systems that contain or use electronic protected
   * health information.
   *
   * @param {CreateAuditLogData} data - Audit log data to record
   * @param {string} [data.userId] - ID of user performing the action (optional for system actions)
   * @param {AuditAction} data.action - Action type (CREATE, VIEW, UPDATE, DELETE, etc.)
   * @param {string} data.entityType - Type of entity being accessed (e.g., 'HealthRecord', 'Medication')
   * @param {string} [data.entityId] - Unique identifier of the specific entity instance
   * @param {any} [data.changes] - Object containing change details (before/after values)
   * @param {string} [data.ipAddress] - IP address of the request origin for security tracking
   * @param {string} [data.userAgent] - Browser/client user agent string
   * @returns {Promise<AuditLog>} The created audit log entry with generated ID and timestamp
   * @throws {Error} When audit log creation fails (critical error requiring investigation)
   *
   * @example
   * ```typescript
   * // Log PHI access
   * await AuditService.createAuditLog({
   *   userId: 'nurse-123',
   *   action: 'VIEW',
   *   entityType: 'HealthRecord',
   *   entityId: 'record-456',
   *   ipAddress: '192.168.1.100',
   *   userAgent: 'Mozilla/5.0...'
   * });
   *
   * // Log medication administration with change tracking
   * await AuditService.createAuditLog({
   *   userId: 'nurse-123',
   *   action: 'UPDATE',
   *   entityType: 'MedicationAdministration',
   *   entityId: 'admin-789',
   *   changes: {
   *     status: { before: 'scheduled', after: 'administered' },
   *     administeredAt: { before: null, after: '2025-01-15T10:30:00Z' }
   *   },
   *   ipAddress: '192.168.1.100'
   * });
   *
   * // Log system-initiated action
   * await AuditService.createAuditLog({
   *   action: 'DELETE',
   *   entityType: 'ExpiredDocument',
   *   entityId: 'doc-999',
   *   changes: { reason: 'Automated retention policy cleanup' }
   * });
   * ```
   */
  static async createAuditLog(data: CreateAuditLogData): Promise<AuditLog> {
    try {
      const auditLog = await AuditLog.create({
        userId: data.userId,
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        changes: data.changes,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent
      });

      logger.info(
        `Audit log created: ${data.action} on ${data.entityType}${data.entityId ? ` (${data.entityId})` : ''} by user ${data.userId || 'system'}`
      );

      return auditLog;
    } catch (error) {
      logger.error('Error creating audit log:', error);
      throw error;
    }
  }

  /**
   * Retrieves complete audit history for a specific entity instance.
   *
   * This method provides a chronological view of all actions performed on a
   * particular entity (e.g., a specific health record or medication record).
   * Useful for reviewing the complete lifecycle and modification history of
   * sensitive healthcare data.
   *
   * @param {string} entityType - Type of entity (e.g., 'HealthRecord', 'Medication', 'Student')
   * @param {string} entityId - Unique identifier of the specific entity instance
   * @param {number} [page=1] - Page number for pagination (1-based indexing)
   * @param {number} [limit=20] - Number of records per page
   * @returns {Promise<{logs: AuditLog[], pagination: PaginationResult}>} Paginated entity audit history
   * @throws {Error} When database query fails
   *
   * @example
   * ```typescript
   * // Review all access to a specific health record
   * const recordHistory = await AuditService.getEntityAuditLogs(
   *   'HealthRecord',
   *   'record-123',
   *   1,
   *   50
   * );
   * recordHistory.logs.forEach(log => {
   *   console.log(`${log.action} by ${log.userId} at ${log.createdAt}`);
   * });
   * ```
   */
  static async getEntityAuditLogs(
    entityType: string,
    entityId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{
    logs: AuditLog[];
    pagination: PaginationResult;
  }> {
    try {
      const offset = (page - 1) * limit;

      const { rows: logs, count: total } = await AuditLog.findAndCountAll({
        where: {
          entityType,
          entityId
        },
        offset,
        limit,
        order: [['createdAt', 'DESC']],
        distinct: true
      });

      logger.info(`Retrieved ${logs.length} audit logs for ${entityType} ${entityId}`);

      return {
        logs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error(`Error getting audit logs for ${entityType} ${entityId}:`, error);
      throw error;
    }
  }

  /**
   * Retrieves complete audit history for a specific user's actions.
   *
   * This method provides visibility into all actions performed by a particular
   * user, essential for user activity reviews, security investigations, and
   * compliance audits. Helps identify unusual access patterns or policy violations.
   *
   * @param {string} userId - Unique identifier of the user
   * @param {number} [page=1] - Page number for pagination (1-based indexing)
   * @param {number} [limit=20] - Number of records per page
   * @returns {Promise<{logs: AuditLog[], pagination: PaginationResult}>} Paginated user activity history
   * @throws {Error} When database query fails
   *
   * @example
   * ```typescript
   * // Review all actions by a specific nurse
   * const userActivity = await AuditService.getUserAuditLogs(
   *   'nurse-123',
   *   1,
   *   100
   * );
   *
   * // Identify PHI access for compliance audit
   * const phiAccess = userActivity.logs.filter(log =>
   *   log.entityType === 'HealthRecord' && log.action === 'VIEW'
   * );
   * console.log(`User accessed ${phiAccess.length} health records`);
   * ```
   */
  static async getUserAuditLogs(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{
    logs: AuditLog[];
    pagination: PaginationResult;
  }> {
    try {
      const offset = (page - 1) * limit;

      const { rows: logs, count: total } = await AuditLog.findAndCountAll({
        where: { userId },
        offset,
        limit,
        order: [['createdAt', 'DESC']],
        distinct: true
      });

      logger.info(`Retrieved ${logs.length} audit logs for user ${userId}`);

      return {
        logs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error(`Error getting audit logs for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Retrieves audit logs within a specific date range for compliance reporting.
   *
   * This method is essential for generating compliance reports, investigating
   * security incidents during specific timeframes, and meeting regulatory
   * requirements for periodic audit reviews. Supports both short-term incident
   * investigation and long-term compliance reporting.
   *
   * @param {Date} startDate - Start of date range (inclusive)
   * @param {Date} endDate - End of date range (inclusive)
   * @param {number} [page=1] - Page number for pagination (1-based indexing)
   * @param {number} [limit=50] - Number of records per page
   * @returns {Promise<{logs: AuditLog[], pagination: PaginationResult}>} Paginated audit logs within date range
   * @throws {Error} When database query fails or date parameters are invalid
   *
   * @example
   * ```typescript
   * // Generate monthly compliance report
   * const monthlyAudit = await AuditService.getAuditLogsByDateRange(
   *   new Date('2025-01-01'),
   *   new Date('2025-01-31'),
   *   1,
   *   1000
   * );
   *
   * // Investigate security incident during specific timeframe
   * const incidentLogs = await AuditService.getAuditLogsByDateRange(
   *   new Date('2025-01-15T14:00:00Z'),
   *   new Date('2025-01-15T16:00:00Z')
   * );
   * ```
   */
  static async getAuditLogsByDateRange(
    startDate: Date,
    endDate: Date,
    page: number = 1,
    limit: number = 50
  ): Promise<{
    logs: AuditLog[];
    pagination: PaginationResult;
  }> {
    try {
      const offset = (page - 1) * limit;

      const { rows: logs, count: total } = await AuditLog.findAndCountAll({
        where: {
          createdAt: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          }
        },
        offset,
        limit,
        order: [['createdAt', 'DESC']],
        distinct: true
      });

      logger.info(
        `Retrieved ${logs.length} audit logs between ${startDate.toISOString()} and ${endDate.toISOString()}`
      );

      return {
        logs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error getting audit logs by date range:', error);
      throw error;
    }
  }

  /**
   * Generates comprehensive audit statistics and analytics for compliance reporting.
   *
   * This method provides aggregated insights into system activity patterns,
   * including action type distribution, entity access patterns, and temporal
   * activity trends. Essential for compliance officers to identify anomalies,
   * demonstrate security controls, and meet reporting requirements.
   *
   * The statistics include:
   * - Total audit log count for the specified period
   * - Breakdown by action type (CREATE, VIEW, UPDATE, DELETE)
   * - Breakdown by entity type (which data types are most accessed)
   * - Daily activity timeline for trend analysis
   *
   * @param {Date} [startDate] - Optional start date for statistics (defaults to all time)
   * @param {Date} [endDate] - Optional end date for statistics (defaults to current date)
   * @returns {Promise<{totalLogs: number, actionBreakdown: {[key: string]: number}, entityTypeBreakdown: {[key: string]: number}, dailyActivity: {date: string, count: number}[]}>} Comprehensive audit statistics
   * @throws {Error} When database query fails or aggregation errors occur
   *
   * @example
   * ```typescript
   * // Generate annual compliance statistics
   * const annualStats = await AuditService.getAuditStatistics(
   *   new Date('2024-01-01'),
   *   new Date('2024-12-31')
   * );
   *
   * console.log(`Total audit events: ${annualStats.totalLogs}`);
   * console.log('Action distribution:', annualStats.actionBreakdown);
   * console.log('Most accessed entity:', Object.keys(annualStats.entityTypeBreakdown)[0]);
   *
   * // Identify activity spikes
   * const peaks = annualStats.dailyActivity.filter(day => day.count > 1000);
   * peaks.forEach(peak => console.log(`High activity on ${peak.date}: ${peak.count} events`));
   *
   * // Get all-time statistics
   * const allTimeStats = await AuditService.getAuditStatistics();
   * ```
   */
  static async getAuditStatistics(
    startDate?: Date,
    endDate?: Date
  ): Promise<{
    totalLogs: number;
    actionBreakdown: { [key: string]: number };
    entityTypeBreakdown: { [key: string]: number };
    dailyActivity: { date: string; count: number }[];
  }> {
    try {
      const whereClause: any = {};
      
      if (startDate || endDate) {
        whereClause.createdAt = {};
        if (startDate) {
          whereClause.createdAt[Op.gte] = startDate;
        }
        if (endDate) {
          whereClause.createdAt[Op.lte] = endDate;
        }
      }

      // Get total count
      const totalLogs = await AuditLog.count({ where: whereClause });

      // Get all logs for analysis
      const logs = await AuditLog.findAll({
        where: whereClause,
        attributes: ['action', 'entityType', 'createdAt'],
        order: [['createdAt', 'DESC']]
      });

      // Calculate breakdowns
      const actionBreakdown: { [key: string]: number } = {};
      const entityTypeBreakdown: { [key: string]: number } = {};
      const dailyActivity: { [key: string]: number } = {};

      logs.forEach(log => {
        // Action breakdown
        actionBreakdown[log.action] = (actionBreakdown[log.action] || 0) + 1;

        // Entity type breakdown
        entityTypeBreakdown[log.entityType] = (entityTypeBreakdown[log.entityType] || 0) + 1;

        // Daily activity
        const date = log.createdAt.toISOString().split('T')[0];
        dailyActivity[date] = (dailyActivity[date] || 0) + 1;
      });

      // Convert daily activity to array format
      const dailyActivityArray = Object.entries(dailyActivity)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));

      logger.info(`Retrieved audit statistics: ${totalLogs} total logs`);

      return {
        totalLogs,
        actionBreakdown,
        entityTypeBreakdown,
        dailyActivity: dailyActivityArray
      };
    } catch (error) {
      logger.error('Error getting audit statistics:', error);
      throw error;
    }
  }
}
