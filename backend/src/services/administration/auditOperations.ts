/**
 * LOC: 0D9E65C35E
 * WC-GEN-182 | auditOperations.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - index.ts (database/models/index.ts)
 *   - enums.ts (database/types/enums.ts)
 *   - types.ts (services/administration/types.ts)
 *
 * DOWNSTREAM (imported by):
 *   - districtOperations.ts (services/administration/districtOperations.ts)
 *   - index.ts (services/administration/index.ts)
 *   - licenseOperations.ts (services/administration/licenseOperations.ts)
 *   - schoolOperations.ts (services/administration/schoolOperations.ts)
 *   - userManagementOperations.ts (services/administration/userManagementOperations.ts)
 */

/**
 * WC-GEN-182 | auditOperations.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../utils/logger, ../../database/models, ../../database/types/enums | Dependencies: sequelize, ../../utils/logger, ../../database/models
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: Various exports | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

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
import { AuditLogFilters } from './administration.types';

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
