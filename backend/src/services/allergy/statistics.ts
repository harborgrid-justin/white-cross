/**
 * WC-GEN-201 | statistics.ts - General utility functions and operations
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
 * Allergy Statistics Module
 *
 * Handles statistical analysis and reporting for allergies
 *
 * @module services/allergy/statistics
 */

import { Op } from 'sequelize';
import { logger } from '../../utils/logger';
import { handleSequelizeError } from '../../utils/sequelizeErrorHandler';
import { Allergy as AllergyModel, sequelize } from '../../database/models';
import { AllergyFilters, AllergyStatistics } from './types';

/**
 * Gets allergy statistics for reporting and analytics
 *
 * @param filters - Optional filters
 * @returns Allergy statistics
 */
export async function getAllergyStatistics(
  filters: AllergyFilters = {}
): Promise<AllergyStatistics> {
  try {
    const whereClause: any = { isActive: true };
    if (filters.studentId) {
      whereClause.studentId = filters.studentId;
    }

    const [total, bySeverity, byType, verified, critical] = await Promise.all([
      AllergyModel.count({ where: whereClause }),
      AllergyModel.findAll({
        where: whereClause,
        attributes: [
          'severity',
          [sequelize.fn('COUNT', sequelize.col('severity')), 'count']
        ],
        group: ['severity'],
        raw: true
      }),
      AllergyModel.findAll({
        where: whereClause,
        attributes: [
          'allergenType',
          [sequelize.fn('COUNT', sequelize.col('allergenType')), 'count']
        ],
        group: ['allergenType'],
        raw: true
      }),
      AllergyModel.count({ where: { ...whereClause, verified: true } }),
      AllergyModel.count({
        where: {
          ...whereClause,
          severity: { [Op.in]: ['SEVERE', 'LIFE_THREATENING'] }
        }
      })
    ]);

    const statistics: AllergyStatistics = {
      total,
      bySeverity: (bySeverity as any[]).reduce((acc, item) => {
        acc[item.severity] = parseInt(item.count, 10);
        return acc;
      }, {} as Record<string, number>),
      byType: (byType as any[]).reduce((acc, item) => {
        if (item.allergenType) {
          acc[item.allergenType] = parseInt(item.count, 10);
        }
        return acc;
      }, {} as Record<string, number>),
      verified,
      unverified: total - verified,
      critical
    };

    logger.info('Allergy statistics retrieved', { statistics });
    return statistics;
  } catch (error) {
    logger.error('Error retrieving allergy statistics:', error);
    throw handleSequelizeError(error as Error);
  }
}
