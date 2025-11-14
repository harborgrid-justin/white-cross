/**
 * Audit Query Service
 * Handles querying and filtering of audit logs with pagination support
 */

import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { AuditAction } from '../types/database.enums';
import { AuditLog, AuditSeverity, ComplianceType } from '../models/audit-log.model';

import { BaseService } from '@/common/base';
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
 * Audit Query Service
 *
 * Provides querying and filtering functionality:
 * - Advanced filtering with multiple criteria
 * - Pagination support
 * - Entity-specific audit history
 * - User-specific audit history
 * - PHI access log retrieval
 */
@Injectable()
export class AuditQueryService extends BaseService {
  constructor(
    @InjectModel(AuditLog)
    private readonly auditLogModel: typeof AuditLog,
  ) {
    super("AuditQueryService");
  }

  /**
   * Query audit logs with filters and pagination
   *
   * @param filters - Filter criteria for audit logs
   * @param options - Pagination and sorting options
   * @returns Paginated audit log results
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
      const { rows: logs, count: total } =
        await this.auditLogModel.findAndCountAll({
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
      this.logError(
        `Failed to query audit logs: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Get audit logs for a specific entity
   *
   * @param entityType - Type of entity
   * @param entityId - ID of entity
   * @param options - Query options
   * @returns Array of audit logs for the entity
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
   *
   * @param userId - ID of user
   * @param options - Query options
   * @returns Array of audit logs for the user
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
   *
   * @param startDate - Start date of range
   * @param endDate - End date of range
   * @param options - Query options
   * @returns Array of PHI access audit logs
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
}
