/**
 * WC-GEN-235 | auditService.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../utils/logger, ../../database/models, ./types | Dependencies: sequelize, ../../utils/logger, ../../database/models
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { Op } from 'sequelize';
import { logger } from '../../utils/logger';
import { AuditLog } from '../../database/models';
import {
  AuditLogFilters,
  PaginationResult,
  CreateAuditLogData
} from './types';

export class AuditService {
  /**
   * Get audit logs for compliance with HIPAA tracking
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
   * Get audit log by ID
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
   * Create audit log entry for HIPAA compliance
   * This is a critical function for maintaining HIPAA compliance audit trails
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
   * Get audit logs for specific entity
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
   * Get audit logs for specific user
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
   * Search audit logs by date range
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
   * Get audit statistics
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
