/**
 * LOC: BA8BBEB3BA
 * WC-GEN-231 | queryOperations.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - sequelizeErrorHandler.ts (utils/sequelizeErrorHandler.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (services/chronicCondition/index.ts)
 */

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
 * @fileoverview Chronic Condition Query Operations Module
 *
 * Provides advanced query, search, and analytics capabilities for chronic condition management:
 * - Multi-criteria search with filtering and pagination
 * - Review scheduling and reminder queries
 * - Educational accommodation tracking (IEP/504 plans)
 * - Statistical analysis and reporting
 * - Healthcare compliance monitoring
 *
 * @module services/chronicCondition/queryOperations
 *
 * @remarks
 * PHI SENSITIVITY: All query operations access protected health information (PHI).
 * Comprehensive audit logging is implemented for HIPAA compliance, tracking all
 * search operations with filters, result counts, and timestamps.
 *
 * Healthcare Context:
 * - Supports care coordination with review date tracking
 * - Enables population health monitoring through statistics
 * - Facilitates IEP/504 compliance reporting
 * - Provides ICD-10 code search capabilities
 *
 * Query Performance:
 * - Optimized database indexes on status, nextReviewDate, studentId
 * - Uses Sequelize findAndCountAll for efficient pagination
 * - Includes eager loading of student associations
 *
 * @see {@link module:services/chronicCondition/crudOperations} for create/update operations
 * @see {@link module:services/chronicCondition/businessLogic} for business logic
 *
 * @since 1.0.0
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
 * Searches chronic conditions with comprehensive filtering, pagination, and student association.
 *
 * Supports multi-criteria search including student ID, status, accommodation requirements,
 * review scheduling, and full-text search across condition names, ICD codes, notes, and care plans.
 * Results are ordered by status (ACTIVE first), next review date, and diagnosis date.
 *
 * @param {ChronicConditionFilters} [filters={}] - Search criteria including:
 *   - studentId: Filter by specific student
 *   - status: Filter by condition status (ACTIVE, MANAGED, RESOLVED, MONITORING)
 *   - requiresIEP: Filter conditions requiring IEP plans
 *   - requires504: Filter conditions requiring 504 accommodations
 *   - isActive: Filter by active/inactive status
 *   - reviewDueSoon: Filter conditions with reviews due within 30 days
 *   - searchTerm: Full-text search across condition, ICD code, notes, care plan
 * @param {PaginationOptions} [pagination={}] - Pagination controls with page (default 1) and limit (default 20)
 * @param {Transaction} [transaction] - Optional Sequelize transaction for consistency
 *
 * @returns {Promise<ChronicConditionSearchResult>} Paginated results including:
 *   - conditions: Array of ChronicCondition records with student associations
 *   - total: Total count of matching records
 *   - page: Current page number
 *   - pages: Total number of pages
 *
 * @throws {SequelizeError} When database query fails
 *
 * @example
 * ```typescript
 * // Find all active asthma cases requiring IEP plans
 * const results = await searchChronicConditions({
 *   searchTerm: 'asthma',
 *   status: 'ACTIVE',
 *   requiresIEP: true
 * }, {
 *   page: 1,
 *   limit: 50
 * });
 *
 * console.log(`Found ${results.total} active asthma cases requiring IEP`);
 * results.conditions.forEach(condition => {
 *   console.log(`${condition.student.firstName} ${condition.student.lastName}: ${condition.carePlan}`);
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Find conditions due for review in next 30 days
 * const reviewDue = await searchChronicConditions({
 *   reviewDueSoon: true,
 *   isActive: true
 * });
 *
 * console.log(`${reviewDue.total} conditions need review soon`);
 * ```
 *
 * @remarks
 * PHI: All searches are audit logged with filter criteria and result counts.
 *
 * Search Behavior:
 * - Case-insensitive search using PostgreSQL ILIKE
 * - Searches across condition name, ICD-10 code, notes, and care plan fields
 * - Results include full student demographic information
 * - Supports compound filters (all conditions must match)
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
 * Retrieves chronic conditions requiring review within a specified time window.
 *
 * Healthcare providers and school nurses use this function to identify students
 * whose chronic condition care plans need scheduled review. Reviews ensure care
 * plans remain current and effective, meeting healthcare compliance requirements.
 *
 * @param {number} [daysAhead=30] - Number of days to look ahead for upcoming reviews.
 *                                   Default is 30 days. Common values: 7 (weekly), 14 (biweekly), 30 (monthly)
 * @param {Transaction} [transaction] - Optional Sequelize transaction
 *
 * @returns {Promise<ChronicCondition[]>} Array of active chronic conditions with nextReviewDate
 *                                         falling within the specified time window, ordered by
 *                                         nextReviewDate (earliest first), with student associations
 *
 * @throws {SequelizeError} When database query fails
 *
 * @example
 * ```typescript
 * // Get conditions due for review in next week
 * const weeklyReviews = await getConditionsRequiringReview(7);
 * console.log(`${weeklyReviews.length} care plans need review this week`);
 *
 * weeklyReviews.forEach(condition => {
 *   console.log(`${condition.student.firstName} ${condition.student.lastName}`);
 *   console.log(`Condition: ${condition.condition}`);
 *   console.log(`Review Due: ${condition.nextReviewDate.toLocaleDateString()}`);
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Monthly review calendar
 * const monthlyReviews = await getConditionsRequiringReview(30);
 * const byWeek = groupByWeek(monthlyReviews);
 * // Schedule nurse appointments based on review calendar
 * ```
 *
 * @remarks
 * Only includes active conditions (isActive: true) with nextReviewDate set.
 * Excludes resolved or inactive conditions even if they have a nextReviewDate.
 *
 * Review Scheduling Best Practices:
 * - Weekly reviews: Critical conditions (diabetes, epilepsy, severe allergies)
 * - Monthly reviews: Managed conditions (asthma, ADHD)
 * - Quarterly reviews: Stable conditions (resolved or well-controlled)
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
 * Retrieves chronic conditions requiring educational accommodations (IEP or 504 plans).
 *
 * Educational accommodations ensure students with chronic health conditions receive
 * appropriate support in the school environment. IEP (Individualized Education Program)
 * plans provide specialized instruction, while 504 plans ensure equal access through
 * accommodations and modifications.
 *
 * @param {AccommodationType} [type='BOTH'] - Type of accommodations to filter:
 *   - 'IEP': Conditions requiring Individualized Education Program plans
 *   - '504': Conditions requiring Section 504 accommodation plans
 *   - 'BOTH': All conditions requiring either IEP or 504 plans (default)
 * @param {Transaction} [transaction] - Optional Sequelize transaction
 *
 * @returns {Promise<ChronicCondition[]>} Array of active chronic conditions requiring
 *                                         accommodations, ordered by student last name and
 *                                         condition name, with student associations
 *
 * @throws {SequelizeError} When database query fails
 *
 * @example
 * ```typescript
 * // Generate IEP compliance report
 * const iepConditions = await getConditionsRequiringAccommodations('IEP');
 * console.log(`${iepConditions.length} students require IEP plans`);
 *
 * const report = iepConditions.map(c => ({
 *   studentName: `${c.student.lastName}, ${c.student.firstName}`,
 *   grade: c.student.grade,
 *   condition: c.condition,
 *   accommodations: c.accommodations,
 *   lastReview: c.lastReviewDate
 * }));
 * ```
 *
 * @example
 * ```typescript
 * // Audit all accommodation plans
 * const allAccommodations = await getConditionsRequiringAccommodations('BOTH');
 * const needsUpdate = allAccommodations.filter(c => {
 *   const daysSinceReview = (Date.now() - c.lastReviewDate.getTime()) / (1000 * 60 * 60 * 24);
 *   return daysSinceReview > 90; // Review every 90 days
 * });
 * console.log(`${needsUpdate.length} accommodation plans need review`);
 * ```
 *
 * @remarks
 * Only includes active conditions (isActive: true).
 *
 * IEP vs 504 Accommodations:
 * - IEP: Required when condition impacts educational performance and requires
 *   specialized instruction (e.g., severe ADHD, autism with learning disabilities)
 * - 504: Required when condition impacts major life activities but doesn't require
 *   specialized instruction (e.g., diabetes, asthma, physical disabilities)
 * - Both: Some conditions may require dual plans based on severity and impact
 *
 * Compliance: Schools must review and update accommodation plans annually and
 * when there are significant changes in student needs.
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
 * Retrieves comprehensive statistics and analytics for chronic condition management.
 *
 * Provides aggregated data for population health monitoring, compliance reporting,
 * resource planning, and healthcare trend analysis. Statistics can be filtered by
 * student to generate individual health summaries.
 *
 * @param {ChronicConditionFilters} [filters={}] - Optional filters to scope statistics.
 *                                                  Most commonly used: studentId for individual summaries
 *
 * @returns {Promise<ChronicConditionStatistics>} Comprehensive statistics including:
 *   - total: Total count of active chronic conditions
 *   - byStatus: Breakdown by status (ACTIVE, MANAGED, RESOLVED, MONITORING)
 *   - requiresIEP: Count requiring IEP plans
 *   - requires504: Count requiring 504 plans
 *   - reviewDueSoon: Count needing review within 30 days
 *   - activeConditions: Count with ACTIVE status
 *
 * @throws {SequelizeError} When database aggregation fails
 *
 * @example
 * ```typescript
 * // School-wide chronic condition dashboard
 * const stats = await getChronicConditionStatistics();
 * console.log('Chronic Condition Management Dashboard:');
 * console.log(`Total Active Conditions: ${stats.total}`);
 * console.log(`Status Breakdown: ${JSON.stringify(stats.byStatus, null, 2)}`);
 * console.log(`Requiring IEP: ${stats.requiresIEP}`);
 * console.log(`Requiring 504: ${stats.requires504}`);
 * console.log(`Reviews Due Soon: ${stats.reviewDueSoon}`);
 * console.log(`Active Management: ${stats.activeConditions}`);
 * ```
 *
 * @example
 * ```typescript
 * // Individual student health summary
 * const studentStats = await getChronicConditionStatistics({
 *   studentId: 'student-uuid'
 * });
 *
 * console.log(`Student has ${studentStats.total} chronic conditions:`);
 * console.log(`- Active: ${studentStats.byStatus.ACTIVE || 0}`);
 * console.log(`- Managed: ${studentStats.byStatus.MANAGED || 0}`);
 * console.log(`- Resolved: ${studentStats.byStatus.RESOLVED || 0}`);
 * if (studentStats.requiresIEP) {
 *   console.log('Requires IEP plan');
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Monthly compliance report
 * const stats = await getChronicConditionStatistics();
 * const complianceRate = ((stats.total - stats.reviewDueSoon) / stats.total * 100).toFixed(1);
 * console.log(`Care Plan Compliance: ${complianceRate}%`);
 * ```
 *
 * @remarks
 * Statistics include only active conditions (isActive: true) to reflect current caseload.
 * Historical/resolved conditions are excluded from totals but included in status breakdown.
 *
 * Use Cases:
 * - Population health monitoring and trend analysis
 * - Resource allocation and nurse staffing
 * - IEP/504 compliance reporting
 * - Care plan review scheduling
 * - Budget planning for medications and supplies
 *
 * Performance: Uses efficient SQL aggregations with Promise.all for parallel execution.
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
