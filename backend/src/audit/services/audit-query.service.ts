import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { literal, Op, WhereOptions } from 'sequelize';
import { AuditLog } from '@/database';
import { IPaginatedResult } from '../interfaces/paginated-result.interface';
import { AuditLogFilters, AuditLogSearchCriteria } from '../types/audit.types';

/**
 * AuditQueryService - Advanced querying and filtering for audit logs
 *
 * Provides sophisticated search, filter, and query capabilities for audit logs.
 * Optimized for performance with proper indexing and pagination support.
 */
@Injectable()
export class AuditQueryService {
  private readonly logger = new Logger(AuditQueryService.name);

  constructor(
    @InjectModel(AuditLog)
    private readonly auditLogModel: typeof AuditLog,
  ) {}

  /**
   * Get audit logs with filtering and pagination
   *
   * @param filters - Filter criteria for audit logs
   * @returns Promise with paginated audit logs
   */
  async getAuditLogs(filters: AuditLogFilters = {}): Promise<IPaginatedResult<AuditLog>> {
    try {
      const { userId, entityType, action, startDate, endDate, page = 1, limit = 50 } = filters;
      const skip = (page - 1) * limit;

      const where: WhereOptions<AuditLog> = {};

      if (userId) {
        where.userId = userId;
      }

      if (entityType) {
        where.entityType = entityType;
      }

      if (action) {
        where.action = action;
      }

      if (startDate || endDate) {
        where.createdAt = {
          [Op.between]: [startDate || new Date(0), endDate || new Date()],
        };
      }

      const { rows: data, count: total } = await this.auditLogModel.findAndCountAll({
        where,
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
      this.logger.error('Error fetching audit logs:', error);
      throw new Error('Failed to fetch audit logs');
    }
  }

  /**
   * Get audit logs for a specific entity
   *
   * @param entityType - Type of entity
   * @param entityId - ID of the entity
   * @param page - Page number for pagination
   * @param limit - Number of records per page
   * @returns Promise with paginated audit logs
   */
  async getEntityAuditHistory(
    entityType: string,
    entityId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<IPaginatedResult<AuditLog>> {
    try {
      const skip = (page - 1) * limit;

      const { rows: data, count: total } = await this.auditLogModel.findAndCountAll({
        where: {
          entityType,
          entityId,
        },
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
      this.logger.error('Error fetching entity audit history:', error);
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
    limit: number = 20,
  ): Promise<IPaginatedResult<AuditLog>> {
    try {
      const skip = (page - 1) * limit;

      const { rows: data, count: total } = await this.auditLogModel.findAndCountAll({
        where: { userId },
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
      this.logger.error('Error fetching user audit history:', error);
      throw new Error('Failed to fetch user audit history');
    }
  }

  /**
   * Search audit logs by keyword
   *
   * @param criteria - Search criteria including keyword and pagination
   * @returns Promise with paginated search results
   */
  async searchAuditLogs(criteria: AuditLogSearchCriteria): Promise<IPaginatedResult<AuditLog>> {
    try {
      const { keyword, page = 1, limit = 20 } = criteria;
      const skip = (page - 1) * limit;

      // Search in entityType and entityId using ILIKE
      const whereClause = {
        [Op.or]: [
          { entityType: { [Op.iLike]: `%${keyword}%` } },
          { entityId: { [Op.iLike]: `%${keyword}%` } },
          literal(`CAST(changes AS TEXT) ILIKE '${keyword.replace(/'/g, "''")}'`),
        ],
      };

      const { rows: data, count: total } = await this.auditLogModel.findAndCountAll({
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
      this.logger.error('Error searching audit logs:', error);
      throw new Error('Failed to search audit logs');
    }
  }

  /**
   * Get audit logs by date range
   *
   * @param startDate - Start date for the range
   * @param endDate - End date for the range
   * @param page - Page number for pagination
   * @param limit - Number of records per page
   * @returns Promise with paginated audit logs in date range
   */
  async getAuditLogsByDateRange(
    startDate: Date,
    endDate: Date,
    page: number = 1,
    limit: number = 50,
  ): Promise<IPaginatedResult<AuditLog>> {
    return this.getAuditLogs({
      startDate,
      endDate,
      page,
      limit,
    });
  }
}
