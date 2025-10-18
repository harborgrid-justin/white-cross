/**
 * WC-GEN-231 | queryOperations.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../utils/logger, ../../utils/sequelizeErrorHandler, ../../database/models | Dependencies: sequelize, ../../utils/logger, ../../utils/sequelizeErrorHandler
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: Various exports | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

/**
 * Chronic Condition Query Operations Module
 *
 * Search, filter, and statistics operations for chronic conditions.
 *
 * @module services/chronicCondition/queryOperations
 */

import { Op, Transaction } from 'sequelize';
import { logger } from '../../utils/logger';
import { handleSequelizeError } from '../../utils/sequelizeErrorHandler';
import {
  ChronicCondition,
  Student,
  sequelize
} from '../../database/models';
import {
  ChronicConditionFilters,
  PaginationOptions,
  ChronicConditionSearchResult,
  ChronicConditionStatistics,
  AccommodationType
} from './types';

// Type augmentation for ChronicCondition model associations
declare module '../../database/models' {
  interface ChronicCondition {
    student?: Student;
  }
}

/**
 * Searches chronic conditions with filtering and pagination
 *
 * @param filters - Search filters
 * @param pagination - Pagination options
 * @param transaction - Optional transaction
 * @returns Paginated chronic condition results
 */
export async function searchChronicConditions(
  filters: ChronicConditionFilters = {},
  pagination: PaginationOptions = {},
  transaction?: Transaction
): Promise<ChronicConditionSearchResult> {
  try {
    const { page = 1, limit = 20 } = pagination;
    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause: any = {};

    if (filters.studentId) {
      whereClause.studentId = filters.studentId;
    }

    if (filters.status) {
      whereClause.status = filters.status;
    }

    if (filters.requiresIEP !== undefined) {
      whereClause.requiresIEP = filters.requiresIEP;
    }

    if (filters.requires504 !== undefined) {
      whereClause.requires504 = filters.requires504;
    }

    if (filters.isActive !== undefined) {
      whereClause.isActive = filters.isActive;
    }

    if (filters.reviewDueSoon) {
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      whereClause.nextReviewDate = {
        [Op.lte]: thirtyDaysFromNow,
        [Op.gte]: new Date()
      };
    }

    if (filters.searchTerm) {
      whereClause[Op.or] = [
        { condition: { [Op.iLike]: `%${filters.searchTerm}%` } },
        { icdCode: { [Op.iLike]: `%${filters.searchTerm}%` } },
        { notes: { [Op.iLike]: `%${filters.searchTerm}%` } },
        { carePlan: { [Op.iLike]: `%${filters.searchTerm}%` } }
      ];
    }

    const { rows: conditions, count: total } = await ChronicCondition.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade']
        }
      ],
      offset,
      limit,
      order: [
        ['status', 'ASC'],
        ['nextReviewDate', 'ASC'],
        ['diagnosedDate', 'DESC']
      ],
      distinct: true,
      transaction
    });

    // PHI Audit Log
    logger.info('PHI Access - Chronic Conditions Searched', {
      action: 'READ',
      entity: 'ChronicCondition',
      filters,
      resultCount: conditions.length,
      timestamp: new Date().toISOString()
    });

    return {
      conditions,
      total,
      page,
      pages: Math.ceil(total / limit)
    };
  } catch (error) {
    logger.error('Error searching chronic conditions:', error);
    throw handleSequelizeError(error as Error);
  }
}

/**
 * Gets conditions requiring review soon (within specified days)
 *
 * @param daysAhead - Number of days to look ahead (default 30)
 * @param transaction - Optional transaction
 * @returns Array of conditions needing review
 */
export async function getConditionsRequiringReview(
  daysAhead: number = 30,
  transaction?: Transaction
): Promise<ChronicCondition[]> {
  try {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);

    const conditions = await ChronicCondition.findAll({
      where: {
        isActive: true,
        nextReviewDate: {
          [Op.lte]: futureDate,
          [Op.gte]: new Date()
        }
      } as any,
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade']
        }
      ],
      order: [['nextReviewDate', 'ASC']],
      transaction
    });

    logger.info(`Found ${conditions.length} conditions requiring review within ${daysAhead} days`);
    return conditions;
  } catch (error) {
    logger.error('Error retrieving conditions requiring review:', error);
    throw handleSequelizeError(error as Error);
  }
}

/**
 * Gets conditions requiring IEP or 504 accommodations
 *
 * @param type - 'IEP' or '504' or 'BOTH'
 * @param transaction - Optional transaction
 * @returns Array of conditions
 */
export async function getConditionsRequiringAccommodations(
  type: AccommodationType = 'BOTH',
  transaction?: Transaction
): Promise<ChronicCondition[]> {
  try {
    const whereClause: any = { isActive: true };

    if (type === 'IEP') {
      whereClause.requiresIEP = true;
    } else if (type === '504') {
      whereClause.requires504 = true;
    } else {
      whereClause[Op.or] = [
        { requiresIEP: true },
        { requires504: true }
      ];
    }

    const conditions = await ChronicCondition.findAll({
      where: whereClause,
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade']
        }
      ],
      order: [
        [{ model: Student, as: 'student' }, 'lastName', 'ASC'],
        ['condition', 'ASC']
      ],
      transaction
    });

    logger.info(`Found ${conditions.length} conditions requiring ${type} accommodations`);
    return conditions;
  } catch (error) {
    logger.error('Error retrieving conditions requiring accommodations:', error);
    throw handleSequelizeError(error as Error);
  }
}

/**
 * Gets chronic condition statistics
 *
 * @param filters - Optional filters
 * @returns Statistics object
 */
export async function getChronicConditionStatistics(
  filters: ChronicConditionFilters = {}
): Promise<ChronicConditionStatistics> {
  try {
    const baseWhere: any = { isActive: true };
    if (filters.studentId) {
      baseWhere.studentId = filters.studentId;
    }

    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const [total, byStatus, requiresIEP, requires504, reviewDueSoon, activeConditions] = await Promise.all([
      ChronicCondition.count({ where: baseWhere }),
      ChronicCondition.findAll({
        where: baseWhere,
        attributes: [
          'status',
          [sequelize.fn('COUNT', sequelize.col('status')), 'count']
        ],
        group: ['status'],
        raw: true
      }),
      ChronicCondition.count({ where: { ...baseWhere, requiresIEP: true } }),
      ChronicCondition.count({ where: { ...baseWhere, requires504: true } }),
      ChronicCondition.count({
        where: {
          ...baseWhere,
          nextReviewDate: {
            [Op.lte]: thirtyDaysFromNow,
            [Op.gte]: new Date()
          }
        }
      }),
      ChronicCondition.count({ where: { ...baseWhere, status: 'ACTIVE' } })
    ]);

    const statistics: ChronicConditionStatistics = {
      total,
      byStatus: (byStatus as any[]).reduce((acc, item) => {
        acc[item.status] = parseInt(item.count, 10);
        return acc;
      }, {} as Record<string, number>),
      requiresIEP,
      requires504,
      reviewDueSoon,
      activeConditions
    };

    logger.info('Chronic condition statistics retrieved', { statistics });
    return statistics;
  } catch (error) {
    logger.error('Error retrieving chronic condition statistics:', error);
    throw handleSequelizeError(error as Error);
  }
}
