import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../entities';
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
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
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
      await this.auditLogRepository.save({
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
      });

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
  async getPHIAccessLogs(filters: {
    userId?: string;
    studentId?: string;
    accessType?: string;
    dataCategory?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  } = {}): Promise<IPaginatedResult<AuditLog>> {
    try {
      const { userId, studentId, accessType, dataCategory, startDate, endDate, page = 1, limit = 50 } = filters;
      const skip = (page - 1) * limit;

      const queryBuilder = this.auditLogRepository
        .createQueryBuilder('audit_log')
        .where("audit_log.changes->>'isPHIAccess' = :isPHIAccess", { isPHIAccess: 'true' });

      if (userId) {
        queryBuilder.andWhere('audit_log.userId = :userId', { userId });
      }

      if (studentId) {
        queryBuilder.andWhere("audit_log.changes->>'studentId' = :studentId", { studentId });
      }

      if (accessType) {
        queryBuilder.andWhere("audit_log.changes->>'accessType' = :accessType", { accessType });
      }

      if (dataCategory) {
        queryBuilder.andWhere("audit_log.changes->>'dataCategory' = :dataCategory", { dataCategory });
      }

      if (startDate) {
        queryBuilder.andWhere('audit_log.createdAt >= :startDate', { startDate });
      }

      if (endDate) {
        queryBuilder.andWhere('audit_log.createdAt <= :endDate', { endDate });
      }

      const [data, total] = await queryBuilder
        .orderBy('audit_log.createdAt', 'DESC')
        .skip(skip)
        .take(limit)
        .getManyAndCount();

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
