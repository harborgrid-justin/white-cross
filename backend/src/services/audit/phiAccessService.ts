/**
 * WC-GEN-223 | phiAccessService.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../shared/logging/logger, ../../database/models, ../../database/types/enums | Dependencies: sequelize, ../../shared/logging/logger, ../../database/models
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { Op, literal } from 'sequelize';
import { logger } from '../../shared/logging/logger';
import { AuditLog, User, Student } from '../../database/models';
import { AuditAction } from '../../database/types/enums';
import { PHIAccessLog, PHIAccessLogFilters, PaginatedResult, EnrichedAuditLog } from './types';

/**
 * PHIAccessService - HIPAA compliant PHI access logging
 * 
 * HIPAA Compliance: This service is critical for HIPAA compliance, recording all access
 * to Protected Health Information (PHI). It provides a complete audit trail for regulatory
 * compliance as required by the HIPAA Security Rule (45 CFR § 164.308(a)(1)(ii)(D)).
 */
export class PHIAccessService {
  /**
   * Log PHI access (HIPAA requirement)
   *
   * HIPAA Compliance: This method creates an audit trail for all PHI access,
   * which is required by the HIPAA Security Rule (45 CFR § 164.308(a)(1)(ii)(D))
   *
   * @param entry - PHI access log entry details
   * @returns Promise<void>
   */
  static async logPHIAccess(entry: PHIAccessLog): Promise<void> {
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
   * Get PHI access logs with filtering and pagination
   *
   * HIPAA Compliance: Provides detailed audit trail of PHI access for compliance reporting
   *
   * @param filters - Filter criteria for PHI access logs
   * @returns Promise with paginated PHI access logs including user and student details
   */
  static async getPHIAccessLogs(filters: PHIAccessLogFilters = {}): Promise<PaginatedResult<EnrichedAuditLog>> {
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
          } as EnrichedAuditLog;
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
   * Get PHI access logs for a specific student
   *
   * @param studentId - Student ID to get access logs for
   * @param page - Page number for pagination
   * @param limit - Number of records per page
   * @returns Promise with paginated PHI access logs for the student
   */
  static async getStudentPHIAccessLogs(
    studentId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResult<EnrichedAuditLog>> {
    return this.getPHIAccessLogs({
      studentId,
      page,
      limit
    });
  }

  /**
   * Get PHI access logs for a specific user
   *
   * @param userId - User ID to get access logs for
   * @param page - Page number for pagination
   * @param limit - Number of records per page
   * @returns Promise with paginated PHI access logs by the user
   */
  static async getUserPHIAccessLogs(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResult<EnrichedAuditLog>> {
    return this.getPHIAccessLogs({
      userId,
      page,
      limit
    });
  }
}
