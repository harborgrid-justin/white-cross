import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, literal } from 'sequelize';
import { AuditLog } from '../../database/models/audit-log.model';
import { IPHIAccessLog, IPaginatedResult } from '../interfaces';

/**
 * PHIAccessService - HIPAA compliant PHI access logging
 *
 * HIPAA Compliance: This service is critical for HIPAA compliance, recording all access
 * to Protected Health Information (PHI). It provides a complete audit trail for regulatory
 * compliance as required by the HIPAA Security Rule (45 CFR § 164.308(a)(1)(ii)(D)).
 */
@Injectable()
export class PHIAccessService {
  private readonly logger = new Logger(PHIAccessService.name);

  constructor(
    @InjectModel(AuditLog)
    private readonly auditLogModel: typeof AuditLog,
  ) {}

  /**
   * Log PHI access (HIPAA requirement)
   * FAIL-SAFE: This method will never throw an error to the caller
   *
   * @param entry - PHI access log entry details
   * @returns Promise<void>
   */
  async logPHIAccess(entry: IPHIAccessLog): Promise<void> {
    try {
      await this.auditLogModel.create({
        userId: entry.userId || null,
        action: entry.action as any,
        entityType: entry.entityType,
        entityId: entry.entityId || null,
        changes: {
          isPHIAccess: true,
          studentId: entry.studentId,
          accessType: entry.accessType,
          dataCategory: entry.dataCategory,
          success: entry.success !== undefined ? entry.success : true,
          errorMessage: entry.errorMessage,
          details: entry.changes || {},
        },
        ipAddress: entry.ipAddress || null,
        userAgent: entry.userAgent || null,
      } as any);

      this.logger.log(
        `PHI Access: ${entry.accessType} ${entry.dataCategory} for student ${entry.studentId} by user ${entry.userId || 'SYSTEM'}`,
      );
    } catch (error) {
      // FAIL-SAFE: Never throw - audit logging should not break the main flow
      this.logger.error('Failed to create PHI access log:', error);
    }
  }

  /**
   * Get PHI access logs with filtering and pagination
   *
   * @param filters - Filter criteria for PHI access logs
   * @returns Promise with paginated PHI access logs
   */
  async getPHIAccessLogs(
    filters: {
      userId?: string;
      studentId?: string;
      accessType?: string;
      dataCategory?: string;
      startDate?: Date;
      endDate?: Date;
      page?: number;
      limit?: number;
    } = {},
  ): Promise<IPaginatedResult<AuditLog>> {
    try {
      const {
        userId,
        studentId,
        accessType,
        dataCategory,
        startDate,
        endDate,
        page = 1,
        limit = 50,
      } = filters;
      const skip = (page - 1) * limit;

      const whereClause: any = {
        [Op.and]: [literal(`changes->>'isPHIAccess' = 'true'`)],
      };

      if (userId) {
        whereClause.userId = userId;
      }

      if (studentId) {
        whereClause[Op.and].push(
          literal(`changes->>'studentId' = '${studentId}'`),
        );
      }

      if (accessType) {
        whereClause[Op.and].push(
          literal(`changes->>'accessType' = '${accessType}'`),
        );
      }

      if (dataCategory) {
        whereClause[Op.and].push(
          literal(`changes->>'dataCategory' = '${dataCategory}'`),
        );
      }

      if (startDate) {
        whereClause.createdAt = { [Op.gte]: startDate };
      }

      if (endDate) {
        whereClause.createdAt = { ...whereClause.createdAt, [Op.lte]: endDate };
      }

      const { rows: data, count: total } =
        await this.auditLogModel.findAndCountAll({
          where: whereClause,
          order: [['createdAt', 'DESC']],
          offset: skip,
          limit,
        });

      return {
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.logger.error('Error fetching PHI access logs:', error);
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
  async getStudentPHIAccessLogs(
    studentId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<IPaginatedResult<AuditLog>> {
    return this.getPHIAccessLogs({
      studentId,
      page,
      limit,
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
  async getUserPHIAccessLogs(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<IPaginatedResult<AuditLog>> {
    return this.getPHIAccessLogs({
      userId,
      page,
      limit,
    });
  }
}
