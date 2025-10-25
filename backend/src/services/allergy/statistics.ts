/**
 * LOC: D2A55DD383
 * WC-GEN-201 | statistics.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - sequelizeErrorHandler.ts (utils/sequelizeErrorHandler.ts)
 *   - index.ts (database/models/index.ts)
 *   - types.ts (services/allergy/types.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (services/allergy/index.ts)
 */

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
 * @fileoverview Allergy Statistics - Analytics and Reporting
 *
 * Provides comprehensive statistical analysis of allergy data for clinical dashboards,
 * safety monitoring, and compliance reporting. Generates aggregate counts by severity,
 * type, and verification status to support data-driven safety decisions.
 *
 * @module services/allergy/statistics
 * @since 1.0.0
 */

import { Op } from 'sequelize';
import { logger } from '../../utils/logger';
import { handleSequelizeError } from '../../utils/sequelizeErrorHandler';
import { Allergy as AllergyModel, sequelize } from '../../database/models';
import { AllergyFilters, AllergyStatistics } from './allergy.types';

/**
 * Generates comprehensive allergy statistics for analytics and reporting.
 *
 * Aggregates allergy data by severity, type, and verification status. Identifies
 * critical allergies requiring immediate attention. Supports filtering to scope
 * statistics to specific students or populations.
 *
 * Uses parallel queries for performance - all aggregations execute simultaneously.
 *
 * @param {AllergyFilters} [filters={}] - Optional filters to scope statistics
 * @param {string} [filters.studentId] - Limit statistics to specific student
 *
 * @returns {Promise<AllergyStatistics>} Statistical summary of allergy data
 * @returns {number} total - Total active allergies matching filters
 * @returns {Record<string, number>} bySeverity - Count by severity (MILD, MODERATE, SEVERE, LIFE_THREATENING)
 * @returns {Record<string, number>} byType - Count by allergen type (MEDICATION, FOOD, ENVIRONMENTAL)
 * @returns {number} verified - Count of healthcare-verified allergies
 * @returns {number} unverified - Count of unverified (parent-reported) allergies
 * @returns {number} critical - Count of SEVERE and LIFE_THREATENING allergies
 *
 * @throws {Error} Database error - if aggregation queries fail
 *
 * @example
 * ```typescript
 * // School-wide allergy statistics for safety dashboard
 * const stats = await getAllergyStatistics();
 * console.log(`Total allergies: ${stats.total}`);
 * console.log(`Critical allergies: ${stats.critical} (${(stats.critical/stats.total*100).toFixed(1)}%)`);
 * console.log(`Verification rate: ${(stats.verified/stats.total*100).toFixed(1)}%`);
 *
 * // Severity breakdown
 * Object.entries(stats.bySeverity).forEach(([severity, count]) => {
 *   console.log(`${severity}: ${count}`);
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Individual student allergy profile statistics
 * const studentStats = await getAllergyStatistics({
 *   studentId: 'student-uuid-123'
 * });
 * if (studentStats.critical > 0) {
 *   console.warn(`Student has ${studentStats.critical} critical allergies`);
 * }
 * ```
 *
 * @remarks
 * Only includes ACTIVE allergies in all statistics. Inactive/resolved allergies are excluded.
 * All queries run in parallel for optimal performance. Statistics are calculated in real-time
 * from current database state.
 *
 * Critical allergy count includes both SEVERE and LIFE_THREATENING severity levels, representing
 * allergies that require immediate clinical attention and medication cross-checking.
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
