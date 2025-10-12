/**
 * Allergy Query Operations Module
 *
 * Handles complex query operations for allergies (search, filter, pagination)
 *
 * @module services/allergy/queryOperations
 */

import { Op, Transaction } from 'sequelize';
import { logger } from '../../utils/logger';
import { handleSequelizeError } from '../../utils/sequelizeErrorHandler';
import {
  Allergy as AllergyModel,
  Student,
  HealthRecord
} from '../../database/models';
import { AllergyFilters, PaginationOptions, PaginatedAllergyResults } from './types';
import { logStudentAllergiesRead, logAllergySearch } from './auditLogging';

/**
 * Retrieves all allergies for a specific student
 *
 * @param studentId - Student ID
 * @param includeInactive - Include inactive allergies
 * @param transaction - Optional transaction
 * @returns Array of allergy records
 */
export async function getStudentAllergies(
  studentId: string,
  includeInactive: boolean = false,
  transaction?: Transaction
): Promise<AllergyModel[]> {
  try {
    const whereClause: any = { studentId };
    if (!includeInactive) {
      whereClause.isActive = true;
    }

    const allergies = await AllergyModel.findAll({
      where: whereClause,
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'firstName', 'lastName', 'studentNumber']
        },
        {
          model: HealthRecord,
          as: 'healthRecord',
          required: false
        }
      ],
      order: [
        ['severity', 'DESC'], // Critical allergies first
        ['verified', 'DESC'],  // Verified allergies first
        ['createdAt', 'DESC']
      ],
      transaction
    });

    // PHI Audit Log
    if (allergies.length > 0) {
      logStudentAllergiesRead(studentId, allergies.length, includeInactive);
    }

    return allergies;
  } catch (error) {
    logger.error('Error retrieving student allergies:', error);
    throw handleSequelizeError(error as Error);
  }
}

/**
 * Searches allergies across all students with filtering and pagination
 *
 * @param filters - Search filters
 * @param pagination - Pagination options
 * @param transaction - Optional transaction
 * @returns Paginated allergy results
 */
export async function searchAllergies(
  filters: AllergyFilters = {},
  pagination: PaginationOptions = {},
  transaction?: Transaction
): Promise<PaginatedAllergyResults> {
  try {
    const { page = 1, limit = 20 } = pagination;
    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause: any = {};

    if (filters.studentId) {
      whereClause.studentId = filters.studentId;
    }

    if (filters.severity) {
      whereClause.severity = filters.severity;
    }

    if (filters.allergenType) {
      whereClause.allergenType = filters.allergenType;
    }

    if (filters.verified !== undefined) {
      whereClause.verified = filters.verified;
    }

    if (filters.isActive !== undefined) {
      whereClause.isActive = filters.isActive;
    }

    if (filters.searchTerm) {
      whereClause[Op.or] = [
        { allergen: { [Op.iLike]: `%${filters.searchTerm}%` } },
        { reaction: { [Op.iLike]: `%${filters.searchTerm}%` } },
        { treatment: { [Op.iLike]: `%${filters.searchTerm}%` } },
        { notes: { [Op.iLike]: `%${filters.searchTerm}%` } }
      ];
    }

    const { rows: allergies, count: total } = await AllergyModel.findAndCountAll({
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
        ['severity', 'DESC'],
        ['createdAt', 'DESC']
      ],
      distinct: true,
      transaction
    });

    // PHI Audit Log
    logAllergySearch(filters, allergies.length);

    return {
      allergies,
      total,
      page,
      pages: Math.ceil(total / limit)
    };
  } catch (error) {
    logger.error('Error searching allergies:', error);
    throw handleSequelizeError(error as Error);
  }
}

/**
 * Gets critical allergies (SEVERE or LIFE_THREATENING) for a student
 *
 * @param studentId - Student ID
 * @param transaction - Optional transaction
 * @returns Array of critical allergy records
 */
export async function getCriticalAllergies(
  studentId: string,
  transaction?: Transaction
): Promise<AllergyModel[]> {
  try {
    const allergies = await AllergyModel.findAll({
      where: {
        studentId,
        severity: {
          [Op.in]: ['SEVERE', 'LIFE_THREATENING']
        },
        active: true
      },
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'firstName', 'lastName', 'studentNumber']
        }
      ],
      order: [['severity', 'DESC']],
      transaction
    });

    // PHI Audit Log
    if (allergies.length > 0) {
      const { logCriticalAllergiesRead } = require('./auditLogging');
      logCriticalAllergiesRead(
        studentId,
        allergies.length,
        allergies.map(a => a.severity)
      );
    }

    return allergies;
  } catch (error) {
    logger.error('Error retrieving critical allergies:', error);
    throw handleSequelizeError(error as Error);
  }
}
