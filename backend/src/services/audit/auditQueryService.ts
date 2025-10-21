/**
 * LOC: 348CB3204C
 * WC-GEN-218 | auditQueryService.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - logger.ts (shared/logging/logger.ts)
 *   - index.ts (database/models/index.ts)
 *   - types.ts (services/audit/types.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (services/audit/index.ts)
 */

/**
 * WC-GEN-218 | auditQueryService.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../shared/logging/logger, ../../database/models, ./types | Dependencies: sequelize, ../../shared/logging/logger, ../../database/models
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { Op, literal } from 'sequelize';
import { logger } from '../../shared/logging/logger';
import { AuditLog } from '../../database/models';
import { AuditLogFilters, PaginatedResult, AuditLogSearchCriteria } from './types';

/**
 * AuditQueryService - Advanced querying and filtering for audit logs
 * 
 * Provides sophisticated search, filter, and query capabilities for audit logs.
 * Optimized for performance with proper indexing and pagination support.
 */
export class AuditQueryService {
  /**
   * Get audit logs with filtering and pagination
   *
   * @param filters - Filter criteria for audit logs
   * @returns Promise with paginated audit logs
   */
  static async getAuditLogs(filters: AuditLogFilters = {}): Promise<PaginatedResult<AuditLog>> {
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
   * Get audit logs for a specific entity
   *
   * @param entityType - Type of entity (e.g., 'Student', 'HealthRecord')
   * @param entityId - ID of the entity
   * @param page - Page number for pagination
   * @param limit - Number of records per page
   * @returns Promise with paginated audit logs
   */
  static async getEntityAuditHistory(
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
  static async getUserAuditHistory(
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
   * Search audit logs by keyword
   *
   * @param criteria - Search criteria including keyword and pagination
   * @returns Promise with paginated search results
   */
  static async searchAuditLogs(criteria: AuditLogSearchCriteria): Promise<PaginatedResult<AuditLog>> {
    try {
      const { keyword, page = 1, limit = 20 } = criteria;
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
   * Get audit logs by date range
   *
   * @param startDate - Start date for the range
   * @param endDate - End date for the range
   * @param page - Page number for pagination
   * @param limit - Number of records per page
   * @returns Promise with paginated audit logs in date range
   */
  static async getAuditLogsByDateRange(
    startDate: Date,
    endDate: Date,
    page: number = 1,
    limit: number = 50
  ): Promise<PaginatedResult<AuditLog>> {
    return this.getAuditLogs({
      startDate,
      endDate,
      page,
      limit
    });
  }

  /**
   * Get audit logs by action type
   *
   * @param action - Action type to filter by
   * @param page - Page number for pagination
   * @param limit - Number of records per page
   * @returns Promise with paginated audit logs filtered by action
   */
  static async getAuditLogsByAction(
    action: string,
    page: number = 1,
    limit: number = 50
  ): Promise<PaginatedResult<AuditLog>> {
    return this.getAuditLogs({
      action,
      page,
      limit
    });
  }

  /**
   * Get audit logs by entity type
   *
   * @param entityType - Entity type to filter by
   * @param page - Page number for pagination
   * @param limit - Number of records per page
   * @returns Promise with paginated audit logs filtered by entity type
   */
  static async getAuditLogsByEntityType(
    entityType: string,
    page: number = 1,
    limit: number = 50
  ): Promise<PaginatedResult<AuditLog>> {
    return this.getAuditLogs({
      entityType,
      page,
      limit
    });
  }
}
