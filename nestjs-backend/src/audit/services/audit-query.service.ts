import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, ILike } from 'typeorm';
import { AuditLog } from '../entities';
import { IPaginatedResult } from '../interfaces';
import { AuditAction } from '../enums';

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
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  /**
   * Get audit logs with filtering and pagination
   *
   * @param filters - Filter criteria for audit logs
   * @returns Promise with paginated audit logs
   */
  async getAuditLogs(filters: {
    userId?: string;
    entityType?: string;
    action?: AuditAction | string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  } = {}): Promise<IPaginatedResult<AuditLog>> {
    try {
      const { userId, entityType, action, startDate, endDate, page = 1, limit = 50 } = filters;
      const skip = (page - 1) * limit;

      const where: any = {};

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
        where.createdAt = Between(
          startDate || new Date(0),
          endDate || new Date(),
        );
      }

      const [data, total] = await this.auditLogRepository.findAndCount({
        where,
        order: { createdAt: 'DESC' },
        skip,
        take: limit,
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

      const [data, total] = await this.auditLogRepository.findAndCount({
        where: {
          entityType,
          entityId,
        },
        order: { createdAt: 'DESC' },
        skip,
        take: limit,
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

      const [data, total] = await this.auditLogRepository.findAndCount({
        where: { userId },
        order: { createdAt: 'DESC' },
        skip,
        take: limit,
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
  async searchAuditLogs(criteria: {
    keyword: string;
    page?: number;
    limit?: number;
  }): Promise<IPaginatedResult<AuditLog>> {
    try {
      const { keyword, page = 1, limit = 20 } = criteria;
      const skip = (page - 1) * limit;

      // Search in entityType and entityId using ILIKE
      const queryBuilder = this.auditLogRepository
        .createQueryBuilder('audit_log')
        .where('audit_log.entityType ILIKE :keyword', { keyword: `%${keyword}%` })
        .orWhere('audit_log.entityId ILIKE :keyword', { keyword: `%${keyword}%` })
        .orWhere("CAST(audit_log.changes AS TEXT) ILIKE :keyword", { keyword: `%${keyword}%` });

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
