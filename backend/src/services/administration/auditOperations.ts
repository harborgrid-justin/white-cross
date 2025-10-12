/**
 * Audit Operations Module
 *
 * Handles audit logging for administration operations
 *
 * @module services/administration/auditOperations
 */

import { Op } from 'sequelize';
import { logger } from '../../utils/logger';
import { AuditLog } from '../../database/models';
import { AuditAction } from '../../database/types/enums';
import { AuditLogFilters } from './types';

/**
 * Create an audit log entry
 */
export async function createAuditLog(
  action: AuditAction,
  entityType: string,
  entityId?: string,
  userId?: string,
  changes?: any,
  ipAddress?: string,
  userAgent?: string
) {
  try {
    const audit = await AuditLog.create({
      action,
      entityType,
      entityId,
      userId,
      changes,
      ipAddress,
      userAgent
    });

    return audit;
  } catch (error) {
    logger.error('Error creating audit log:', error);
    throw error;
  }
}

/**
 * Get audit logs with filtering and pagination
 */
export async function getAuditLogs(
  page: number = 1,
  limit: number = 50,
  filters?: AuditLogFilters
) {
  try {
    const offset = (page - 1) * limit;
    const whereClause: any = {};

    if (filters) {
      if (filters.userId) {
        whereClause.userId = filters.userId;
      }
      if (filters.entityType) {
        whereClause.entityType = filters.entityType;
      }
      if (filters.entityId) {
        whereClause.entityId = filters.entityId;
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
    }

    const { rows: logs, count: total } = await AuditLog.findAndCountAll({
      where: whereClause,
      offset,
      limit,
      order: [['createdAt', 'DESC']]
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
