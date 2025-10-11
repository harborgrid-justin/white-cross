import { Op, literal } from 'sequelize';
import { logger } from '../utils/logger';
import { AuditLog, User, Student, sequelize } from '../database/models';
import { AuditAction } from '../database/types/enums';

/**
 * Interface for creating audit log entries
 */
export interface AuditLogEntry {
  userId?: string;
  action: AuditAction | string;
  entityType: string;
  entityId?: string;
  changes?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  success?: boolean;
  errorMessage?: string;
}

/**
 * Interface for PHI (Protected Health Information) access logs
 * HIPAA Compliance: Tracks all access to protected health information
 */
export interface PHIAccessLog extends AuditLogEntry {
  studentId: string;
  accessType: 'READ' | 'WRITE' | 'DELETE' | 'EXPORT';
  dataCategory: 'HEALTH_RECORD' | 'MEDICATION' | 'ALLERGY' | 'VACCINATION' | 'DIAGNOSIS' | 'TREATMENT' | 'CHRONIC_CONDITION' | 'SCREENING' | 'VITAL_SIGNS' | 'GROWTH_MEASUREMENT';
}

/**
 * Interface for audit log filters
 */
export interface AuditLogFilters {
  userId?: string;
  entityType?: string;
  action?: AuditAction | string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

/**
 * Interface for PHI access log filters
 */
export interface PHIAccessLogFilters {
  userId?: string;
  studentId?: string;
  accessType?: string;
  dataCategory?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

/**
 * Interface for pagination results
 */
export interface PaginatedResult<T> {
  logs: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Interface for compliance report
 */
export interface ComplianceReport {
  period: {
    start: Date;
    end: Date;
  };
  summary: {
    totalAccess: number;
    failedAccess: number;
    successRate: number;
  };
  accessByType: Array<{ type: string; count: number }>;
  accessByCategory: Array<{ category: string; count: number }>;
  topUsers: Array<{ userId: string; userName: string; accessCount: number }>;
  topStudents: Array<{ studentId: string; studentName: string; accessCount: number }>;
}

/**
 * AuditService - Handles all audit logging operations
 *
 * HIPAA Compliance: This service is critical for HIPAA compliance, recording all access
 * and modifications to Protected Health Information (PHI). It provides a complete audit
 * trail for regulatory compliance, security monitoring, and forensic analysis.
 *
 * Key Features:
 * - Immutable audit trail of all system actions
 * - PHI access tracking for HIPAA compliance
 * - Comprehensive filtering and reporting capabilities
 * - Performance optimized with database indexing
 * - Fail-safe logging that doesn't break main application flow
 */
export class AuditService {
  /**
   * Log general system action
   *
   * @param entry - Audit log entry details
   * @returns Promise<void>
   */
  async logAction(entry: AuditLogEntry): Promise<void> {
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
   * Log PHI access (HIPAA requirement)
   *
   * HIPAA Compliance: This method creates an audit trail for all PHI access,
   * which is required by the HIPAA Security Rule (45 CFR § 164.308(a)(1)(ii)(D))
   *
   * @param entry - PHI access log entry details
   * @returns Promise<void>
   */
  async logPHIAccess(entry: PHIAccessLog): Promise<void> {
    try {
      await AuditLog.create({
        userId: entry.userId,
        action: entry.action as AuditAction,
        entityType: entry.entityType,
        entityId: entry.entityId,
        changes: {
          isPHIAccess: true,
          studentId: entry.studentId,
          accessType: entry.accessType,
          dataCategory: entry.dataCategory,
          success: entry.success !== undefined ? entry.success : true,
          errorMessage: entry.errorMessage,
          details: entry.changes || {}
        },
        ipAddress: entry.ipAddress,
        userAgent: entry.userAgent
      });

      logger.info(
        `PHI Access: ${entry.accessType} ${entry.dataCategory} for student ${entry.studentId} by user ${entry.userId || 'SYSTEM'}`
      );
    } catch (error) {
      logger.error('Failed to create PHI access log:', error);
      // Don't throw - audit logging should not break the main flow
    }
  }

  /**
   * Get audit logs with filtering and pagination
   *
   * @param filters - Filter criteria for audit logs
   * @returns Promise with paginated audit logs
   */
  async getAuditLogs(filters: AuditLogFilters = {}): Promise<PaginatedResult<AuditLog>> {
    try {
      const { userId, entityType, action, startDate, endDate, page = 1, limit = 50 } = filters;
      const offset = (page - 1) * limit;

      const whereClause: any = {};

      if (userId) {
        whereClause.userId = userId;
      }

      if (entityType) {
        whereClause.entityType = entityType;
      }

      if (action) {
        whereClause.action = action;
      }

      if (startDate || endDate) {
        whereClause.createdAt = {};
        if (startDate) {
          whereClause.createdAt[Op.gte] = startDate;
        }
        if (endDate) {
          whereClause.createdAt[Op.lte] = endDate;
        }
      }

      const { rows: logs, count: total } = await AuditLog.findAndCountAll({
        where: whereClause,
        offset,
        limit,
        order: [['createdAt', 'DESC']],
        distinct: true
      });

      return {
        logs,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error fetching audit logs:', error);
      throw new Error('Failed to fetch audit logs');
    }
  }

  /**
   * Get PHI access logs with filtering and pagination
   *
   * HIPAA Compliance: Provides detailed audit trail of PHI access for compliance reporting
   *
   * @param filters - Filter criteria for PHI access logs
   * @returns Promise with paginated PHI access logs including user and student details
   */
  async getPHIAccessLogs(filters: PHIAccessLogFilters = {}): Promise<PaginatedResult<any>> {
    try {
      const { userId, studentId, accessType, dataCategory, startDate, endDate, page = 1, limit = 50 } = filters;
      const offset = (page - 1) * limit;

      const whereClause: any = {
        'changes.isPHIAccess': true
      };

      if (userId) {
        whereClause.userId = userId;
      }

      if (studentId) {
        whereClause['changes.studentId'] = studentId;
      }

      if (accessType) {
        whereClause['changes.accessType'] = accessType;
      }

      if (dataCategory) {
        whereClause['changes.dataCategory'] = dataCategory;
      }

      if (startDate || endDate) {
        whereClause.createdAt = {};
        if (startDate) {
          whereClause.createdAt[Op.gte] = startDate;
        }
        if (endDate) {
          whereClause.createdAt[Op.lte] = endDate;
        }
      }

      // Build where clause for JSONB fields
      const jsonbConditions = [];
      if (whereClause['changes.isPHIAccess']) {
        jsonbConditions.push(literal("(changes->>'isPHIAccess')::boolean = true"));
        delete whereClause['changes.isPHIAccess'];
      }
      if (whereClause['changes.studentId']) {
        jsonbConditions.push(literal(`changes->>'studentId' = '${whereClause['changes.studentId']}'`));
        delete whereClause['changes.studentId'];
      }
      if (whereClause['changes.accessType']) {
        jsonbConditions.push(literal(`changes->>'accessType' = '${whereClause['changes.accessType']}'`));
        delete whereClause['changes.accessType'];
      }
      if (whereClause['changes.dataCategory']) {
        jsonbConditions.push(literal(`changes->>'dataCategory' = '${whereClause['changes.dataCategory']}'`));
        delete whereClause['changes.dataCategory'];
      }

      if (jsonbConditions.length > 0) {
        whereClause[Op.and] = jsonbConditions;
      }

      const { rows: logs, count: total } = await AuditLog.findAndCountAll({
        where: whereClause,
        offset,
        limit,
        order: [['createdAt', 'DESC']],
        distinct: true
      });

      // Enrich logs with user and student information
      const enrichedLogs = await Promise.all(
        logs.map(async (log) => {
          const logData = log.get({ plain: true });
          const changes = logData.changes as any;

          // Fetch user details if userId exists
          let userDetails = null;
          if (logData.userId) {
            const user = await User.findByPk(logData.userId, {
              attributes: ['id', 'firstName', 'lastName', 'email', 'role']
            });
            userDetails = user ? user.get({ plain: true }) : null;
          }

          // Fetch student details if studentId exists in changes
          let studentDetails = null;
          if (changes?.studentId) {
            const student = await Student.findByPk(changes.studentId, {
              attributes: ['id', 'firstName', 'lastName', 'studentNumber']
            });
            studentDetails = student ? student.get({ plain: true }) : null;
          }

          return {
            ...logData,
            user: userDetails,
            student: studentDetails
          };
        })
      );

      return {
        logs: enrichedLogs,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error fetching PHI access logs:', error);
      throw new Error('Failed to fetch PHI access logs');
    }
  }

  /**
   * Get compliance report for HIPAA
   *
   * HIPAA Compliance: Generates comprehensive compliance report for audit purposes
   *
   * @param startDate - Start date for the report period
   * @param endDate - End date for the report period
   * @returns Promise with compliance report data
   */
  async getComplianceReport(startDate: Date, endDate: Date): Promise<ComplianceReport> {
    try {
      // Get all PHI access logs for the period
      const phiLogs = await AuditLog.findAll({
        where: {
          createdAt: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          },
          [Op.and]: [
            literal("(changes->>'isPHIAccess')::boolean = true")
          ]
        },
        attributes: ['id', 'userId', 'changes', 'createdAt']
      });

      const totalAccess = phiLogs.length;

      // Calculate failed access
      const failedAccess = phiLogs.filter(log => {
        const changes = log.changes as any;
        return changes?.success === false;
      }).length;

      // Group by access type
      const accessByTypeMap = new Map<string, number>();
      phiLogs.forEach(log => {
        const changes = log.changes as any;
        const accessType = changes?.accessType || 'UNKNOWN';
        accessByTypeMap.set(accessType, (accessByTypeMap.get(accessType) || 0) + 1);
      });

      // Group by data category
      const accessByCategoryMap = new Map<string, number>();
      phiLogs.forEach(log => {
        const changes = log.changes as any;
        const dataCategory = changes?.dataCategory || 'UNKNOWN';
        accessByCategoryMap.set(dataCategory, (accessByCategoryMap.get(dataCategory) || 0) + 1);
      });

      // Get top users by access count
      const userAccessMap = new Map<string, number>();
      phiLogs.forEach(log => {
        if (log.userId) {
          userAccessMap.set(log.userId, (userAccessMap.get(log.userId) || 0) + 1);
        }
      });

      const topUserIds = Array.from(userAccessMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([userId]) => userId);

      const topUsersData = await Promise.all(
        topUserIds.map(async (userId) => {
          const user = await User.findByPk(userId, {
            attributes: ['id', 'firstName', 'lastName']
          });
          return {
            userId,
            userName: user ? `${user.firstName} ${user.lastName}` : 'Unknown User',
            accessCount: userAccessMap.get(userId) || 0
          };
        })
      );

      // Get top students by access count
      const studentAccessMap = new Map<string, number>();
      phiLogs.forEach(log => {
        const changes = log.changes as any;
        if (changes?.studentId) {
          studentAccessMap.set(changes.studentId, (studentAccessMap.get(changes.studentId) || 0) + 1);
        }
      });

      const topStudentIds = Array.from(studentAccessMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([studentId]) => studentId);

      const topStudentsData = await Promise.all(
        topStudentIds.map(async (studentId) => {
          const student = await Student.findByPk(studentId, {
            attributes: ['id', 'firstName', 'lastName']
          });
          return {
            studentId,
            studentName: student ? `${student.firstName} ${student.lastName}` : 'Unknown Student',
            accessCount: studentAccessMap.get(studentId) || 0
          };
        })
      );

      return {
        period: {
          start: startDate,
          end: endDate
        },
        summary: {
          totalAccess,
          failedAccess,
          successRate: totalAccess > 0 ? ((totalAccess - failedAccess) / totalAccess) * 100 : 0
        },
        accessByType: Array.from(accessByTypeMap.entries()).map(([type, count]) => ({
          type,
          count
        })),
        accessByCategory: Array.from(accessByCategoryMap.entries()).map(([category, count]) => ({
          category,
          count
        })),
        topUsers: topUsersData,
        topStudents: topStudentsData
      };
    } catch (error) {
      logger.error('Error generating compliance report:', error);
      throw new Error('Failed to generate compliance report');
    }
  }

  /**
   * Get audit log by ID
   *
   * @param id - Audit log ID
   * @returns Promise with audit log details
   */
  async getAuditLogById(id: string): Promise<AuditLog | null> {
    try {
      const log = await AuditLog.findByPk(id);
      return log;
    } catch (error) {
      logger.error('Error fetching audit log by ID:', error);
      throw new Error('Failed to fetch audit log');
    }
  }

  /**
   * Get audit logs for a specific entity
   *
   * @param entityType - Type of entity (e.g., 'Student', 'HealthRecord')
   * @param entityId - ID of the entity
   * @param page - Page number for pagination
   * @param limit - Number of records per page
   * @returns Promise with paginated audit logs
   */
  async getEntityAuditHistory(
    entityType: string,
    entityId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResult<AuditLog>> {
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

      return {
        logs,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error fetching entity audit history:', error);
      throw new Error('Failed to fetch entity audit history');
    }
  }

  /**
   * Get audit logs for a specific user
   *
   * @param userId - User ID
   * @param page - Page number for pagination
   * @param limit - Number of records per page
   * @returns Promise with paginated audit logs
   */
  async getUserAuditHistory(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResult<AuditLog>> {
    try {
      const offset = (page - 1) * limit;

      const { rows: logs, count: total } = await AuditLog.findAndCountAll({
        where: { userId },
        offset,
        limit,
        order: [['createdAt', 'DESC']],
        distinct: true
      });

      return {
        logs,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error fetching user audit history:', error);
      throw new Error('Failed to fetch user audit history');
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

  /**
   * Search audit logs by keyword
   *
   * @param keyword - Search keyword
   * @param page - Page number for pagination
   * @param limit - Number of records per page
   * @returns Promise with paginated search results
   */
  async searchAuditLogs(
    keyword: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResult<AuditLog>> {
    try {
      const offset = (page - 1) * limit;

      const { rows: logs, count: total } = await AuditLog.findAndCountAll({
        where: {
          [Op.or]: [
            { entityType: { [Op.iLike]: `%${keyword}%` } },
            { entityId: { [Op.iLike]: `%${keyword}%` } },
            literal(`changes::text ILIKE '%${keyword}%'`)
          ]
        },
        offset,
        limit,
        order: [['createdAt', 'DESC']],
        distinct: true
      });

      return {
        logs,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error searching audit logs:', error);
      throw new Error('Failed to search audit logs');
    }
  }

  /**
   * Get audit statistics for a time period
   *
   * @param startDate - Start date for statistics
   * @param endDate - End date for statistics
   * @returns Promise with audit statistics
   */
  async getAuditStatistics(startDate: Date, endDate: Date) {
    try {
      const totalLogs = await AuditLog.count({
        where: {
          createdAt: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          }
        }
      });

      // Get action distribution
      const actionCounts = await AuditLog.findAll({
        where: {
          createdAt: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          }
        },
        attributes: [
          'action',
          [sequelize.fn('COUNT', sequelize.col('action')), 'count']
        ],
        group: ['action'],
        raw: true
      });

      // Get entity type distribution
      const entityTypeCounts = await AuditLog.findAll({
        where: {
          createdAt: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          }
        },
        attributes: [
          'entityType',
          [sequelize.fn('COUNT', sequelize.col('entityType')), 'count']
        ],
        group: ['entityType'],
        raw: true
      });

      // Get unique users count
      const uniqueUsers = await AuditLog.count({
        where: {
          createdAt: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          },
          userId: { [Op.ne]: null }
        },
        distinct: true,
        col: 'userId'
      });

      return {
        period: {
          start: startDate,
          end: endDate
        },
        totalLogs,
        uniqueUsers,
        actionDistribution: actionCounts.map((item: any) => ({
          action: item.action,
          count: parseInt(item.count, 10)
        })),
        entityTypeDistribution: entityTypeCounts.map((item: any) => ({
          entityType: item.entityType,
          count: parseInt(item.count, 10)
        }))
      };
    } catch (error) {
      logger.error('Error getting audit statistics:', error);
      throw new Error('Failed to get audit statistics');
    }
  }
}

export const auditService = new AuditService();
