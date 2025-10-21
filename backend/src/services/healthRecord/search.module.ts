/**
 * LOC: 4A7C2D8E96
 * WC-SVC-HLT-SRC | search.module.ts - Health Record Search and Filtering Module
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - models (database/models)
 *   - types.ts (./types.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (./index.ts)
 *
 * Purpose: Advanced search and filtering for health records across students
 * Exports: SearchModule class with full-text search and filtering capabilities
 * HIPAA: Contains PHI search - requires audit logging for compliance
 * Last Updated: 2025-10-18 | File Type: .ts
 * Critical Path: Query parsing → Database search → Result filtering → Pagination
 */

import { Op } from 'sequelize';
import { logger } from '../../utils/logger';
import { HealthRecord, Student } from '../../database/models';
import { PaginatedHealthRecords } from './types';

/**
 * Search Module
 * Provides comprehensive search and filtering capabilities for health records
 */
export class SearchModule {
  /**
   * Search health records across all students
   * Supports searching by description, notes, provider, and student information
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
   * Advanced filter for health records with multiple criteria
   * Supports date ranges, types, providers, and student demographics
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
   * Find records requiring attention (e.g., upcoming reviews, expired documents)
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
