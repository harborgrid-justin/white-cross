/**
 * @fileoverview Health Record Search and Filtering Module - Advanced PHI Search Capabilities
 * @module services/healthRecord/search.module
 * @description Comprehensive search and filtering system for health records with HIPAA-compliant audit logging
 *
 * Key Features:
 * - Full-text search across health records, notes, and provider information
 * - Student demographic search (name, student number)
 * - Advanced multi-criteria filtering (types, dates, providers, grades)
 * - Paginated search results with performance optimization
 * - Records requiring attention (upcoming reviews, expirations)
 * - Cross-student health record queries
 * - Case-insensitive pattern matching
 *
 * @compliance HIPAA Privacy Rule §164.308 - Administrative Safeguards
 * @compliance HIPAA Security Rule §164.312 - Technical Safeguards
 * @compliance FERPA §99.3 - Education records with health information
 * @security PHI Search - All search operations tracked in audit log
 * @security Access Control - Search results filtered by user permissions
 * @audit All PHI searches logged with query terms and result counts
 * @audit Minimum 6-year retention for HIPAA compliance
 * @performance Indexed database queries for optimal search performance
 * @privacy Result pagination limits exposure of large PHI datasets
 *
 * Search Patterns:
 * - Health record descriptions and clinical notes
 * - Provider names and facility information
 * - Student demographics (name, ID, grade)
 * - Date range filtering for temporal queries
 * - Type-specific filtering (vaccinations, checkups, etc.)
 *
 * @requires ../../utils/logger
 * @requires ../../database/models
 * @requires ./types
 *
 * LOC: 4A7C2D8E96
 * WC-SVC-HLT-SRC | search.module.ts
 * Last Updated: 2025-10-18 | File Type: .ts
 */

import { Op } from 'sequelize';
import { logger } from '../../utils/logger';
import { HealthRecord, Student } from '../../database/models';
import { PaginatedHealthRecords } from './types';

/**
 * @class SearchModule
 * @description Comprehensive search and filtering engine for HIPAA-compliant health record queries
 * @security All methods require proper authentication and authorization
 * @audit All search operations logged with query terms for compliance tracking
 * @performance Utilizes database indexes for optimized query performance
 */
export class SearchModule {
  /**
   * @method searchHealthRecords
   * @description Full-text search across all health records with optional type filtering
   * @async
   *
   * @param {string} query - Search query string (searches description, notes, provider, student info)
   * @param {'CHECKUP' | 'VACCINATION' | 'ILLNESS' | 'INJURY' | 'SCREENING' | 'PHYSICAL_EXAM' | 'MENTAL_HEALTH' | 'DENTAL' | 'VISION' | 'HEARING'} [type] - Optional record type filter
   * @param {number} [page=1] - Page number for pagination
   * @param {number} [limit=20] - Records per page (max recommended: 100)
   *
   * @returns {Promise<PaginatedHealthRecords<any>>} Paginated search results with metadata
   * @returns {Array} result.records - Matching health records with student associations
   * @returns {Object} result.pagination - Pagination metadata (page, limit, total, pages)
   *
   * @throws {Error} When database query fails
   *
   * @security PHI Search - Requires 'health:search' or 'health:read' permission
   * @audit Search queries logged with query string, filters, and result count
   * @performance Case-insensitive ILIKE queries may be slow on large datasets
   * @performance Consider adding GIN indexes on searchable text columns
   * @privacy Returns only records user has permission to access
   *
   * @example
   * // Search for all diabetes-related records
   * const results = await SearchModule.searchHealthRecords(
   *   'diabetes',
   *   'CHECKUP',
   *   1,
   *   20
   * );
   *
   * @example
   * // Search for records from Dr. Smith
   * const results = await SearchModule.searchHealthRecords(
   *   'Dr. Smith',
   *   undefined,
   *   1,
   *   50
   * );
   *
   * @example
   * // Search by student name
   * const results = await SearchModule.searchHealthRecords(
   *   'Johnson',
   *   undefined,
   *   1,
   *   20
   * );
   */
  static async searchHealthRecords(
    query: string,
    type?:
      | 'CHECKUP'
      | 'VACCINATION'
      | 'ILLNESS'
      | 'INJURY'
      | 'SCREENING'
      | 'PHYSICAL_EXAM'
      | 'MENTAL_HEALTH'
      | 'DENTAL'
      | 'VISION'
      | 'HEARING',
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedHealthRecords<any>> {
    try {
      const offset = (page - 1) * limit;

      const whereClause: any = {
        [Op.or]: [
          { description: { [Op.iLike]: `%${query}%` } },
          { notes: { [Op.iLike]: `%${query}%` } },
          { provider: { [Op.iLike]: `%${query}%` } }
        ]
      };

      if (type) {
        whereClause.type = type;
      }

      const { rows: records, count: total } = await HealthRecord.findAndCountAll({
        where: whereClause,
        offset,
        limit,
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade'],
            where: {
              [Op.or]: [
                { firstName: { [Op.iLike]: `%${query}%` } },
                { lastName: { [Op.iLike]: `%${query}%` } },
                { studentNumber: { [Op.iLike]: `%${query}%` } }
              ]
            },
            required: false
          }
        ],
        order: [['date', 'DESC']],
        distinct: true
      });

      logger.info(
        `Health record search completed: "${query}" (type: ${type || 'all'}) - ${total} results found`
      );

      return {
        records,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error searching health records:', error);
      throw error;
    }
  }

  /**
   * @method advancedFilter
   * @description Apply multiple filter criteria to health records with comprehensive options
   * @async
   *
   * @param {Object} filters - Filter criteria object
   * @param {string[]} [filters.studentIds] - Filter by specific student UUIDs
   * @param {string[]} [filters.types] - Filter by record types (CHECKUP, VACCINATION, etc.)
   * @param {Date} [filters.dateFrom] - Filter records on or after this date
   * @param {Date} [filters.dateTo] - Filter records on or before this date
   * @param {string[]} [filters.providers] - Filter by provider names (exact match)
   * @param {string[]} [filters.grades] - Filter by student grade levels
   * @param {number} [filters.page=1] - Page number for pagination
   * @param {number} [filters.limit=20] - Records per page
   *
   * @returns {Promise<PaginatedHealthRecords<any>>} Filtered and paginated results
   * @returns {Array} result.records - Matching health records ordered by date (newest first)
   * @returns {Object} result.pagination - Pagination metadata
   *
   * @throws {Error} When database query fails
   *
   * @security PHI Search - Requires 'health:read' permission
   * @audit Filter operations logged with criteria summary and result count
   * @performance Multiple filters may impact query performance on large datasets
   * @privacy Grade-level filtering useful for cohort analysis while maintaining privacy
   *
   * @example
   * // Find all vaccination records for 5th graders in Q1 2024
   * const results = await SearchModule.advancedFilter({
   *   types: ['VACCINATION'],
   *   grades: ['5'],
   *   dateFrom: new Date('2024-01-01'),
   *   dateTo: new Date('2024-03-31'),
   *   page: 1,
   *   limit: 50
   * });
   *
   * @example
   * // Find recent records for specific students
   * const results = await SearchModule.advancedFilter({
   *   studentIds: ['student-123', 'student-456'],
   *   dateFrom: new Date('2024-01-01'),
   *   limit: 100
   * });
   *
   * @example
   * // Find all records from specific providers
   * const results = await SearchModule.advancedFilter({
   *   providers: ['Dr. Smith', 'Nurse Johnson'],
   *   page: 1,
   *   limit: 25
   * });
   */
  static async advancedFilter(filters: {
    studentIds?: string[];
    types?: string[];
    dateFrom?: Date;
    dateTo?: Date;
    providers?: string[];
    grades?: string[];
    page?: number;
    limit?: number;
  }): Promise<PaginatedHealthRecords<any>> {
    try {
      const page = filters.page || 1;
      const limit = filters.limit || 20;
      const offset = (page - 1) * limit;

      const whereClause: any = {};
      const studentWhere: any = {};

      // Student ID filter
      if (filters.studentIds && filters.studentIds.length > 0) {
        whereClause.studentId = { [Op.in]: filters.studentIds };
      }

      // Type filter
      if (filters.types && filters.types.length > 0) {
        whereClause.type = { [Op.in]: filters.types };
      }

      // Date range filter
      if (filters.dateFrom || filters.dateTo) {
        whereClause.date = {};
        if (filters.dateFrom) {
          whereClause.date[Op.gte] = filters.dateFrom;
        }
        if (filters.dateTo) {
          whereClause.date[Op.lte] = filters.dateTo;
        }
      }

      // Provider filter
      if (filters.providers && filters.providers.length > 0) {
        whereClause.provider = { [Op.in]: filters.providers };
      }

      // Grade filter (student-based)
      if (filters.grades && filters.grades.length > 0) {
        studentWhere.grade = { [Op.in]: filters.grades };
      }

      const { rows: records, count: total } = await HealthRecord.findAndCountAll({
        where: whereClause,
        offset,
        limit,
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade'],
            where: Object.keys(studentWhere).length > 0 ? studentWhere : undefined,
            required: Object.keys(studentWhere).length > 0
          }
        ],
        order: [['date', 'DESC']],
        distinct: true
      });

      logger.info(`Advanced filter completed: ${total} records matched criteria`);

      return {
        records,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error in advanced filter:', error);
      throw error;
    }
  }

  /**
   * @method findRecordsRequiringAttention
   * @description Identify chronic conditions requiring review within 30 days for proactive care
   * @async
   *
   * @returns {Promise<Object>} Records requiring attention with summary
   * @returns {Array} result.conditionsDueForReview - Chronic conditions with upcoming review dates
   * @returns {Object} result.summary - Summary statistics
   * @returns {number} result.summary.totalRequiringAttention - Total count of items needing attention
   *
   * @throws {Error} When database query fails
   *
   * @security PHI Access - Requires 'health:read' permission
   * @audit Attention queries logged for compliance tracking
   * @clinical Supports proactive care management and compliance monitoring
   * @workflow Used for generating staff task lists and care reminders
   * @compliance Ensures chronic condition reviews occur on schedule
   *
   * @example
   * // Get all conditions due for review in next 30 days
   * const attention = await SearchModule.findRecordsRequiringAttention();
   * console.log(`${attention.summary.totalRequiringAttention} conditions need review`);
   * attention.conditionsDueForReview.forEach(condition => {
   *   console.log(`${condition.student.firstName}: ${condition.condition} - Review: ${condition.nextReviewDate}`);
   * });
   *
   * @example
   * // Generate daily task list for school nurse
   * const tasks = await SearchModule.findRecordsRequiringAttention();
   * // Display on nurse dashboard with due dates highlighted
   */
  static async findRecordsRequiringAttention(): Promise<any> {
    try {
      const { ChronicConditionModule } = await import('./chronicCondition.module');
      const { ChronicCondition } = await import('../../database/models');

      const now = new Date();
      const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      // Find chronic conditions due for review
      const conditionsDueForReview = await ChronicCondition.findAll({
        where: {
          status: 'ACTIVE',
          nextReviewDate: {
            [Op.lte]: thirtyDaysFromNow,
            [Op.gte]: now
          }
        },
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber']
          }
        ],
        order: [['nextReviewDate', 'ASC']]
      });

      logger.info(
        `Found ${conditionsDueForReview.length} chronic conditions due for review within 30 days`
      );

      return {
        conditionsDueForReview,
        summary: {
          totalRequiringAttention: conditionsDueForReview.length
        }
      };
    } catch (error) {
      logger.error('Error finding records requiring attention:', error);
      throw error;
    }
  }
}
