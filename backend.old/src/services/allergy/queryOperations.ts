/**
 * LOC: 4FDC1925FD
 * WC-GEN-199 | queryOperations.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - sequelizeErrorHandler.ts (utils/sequelizeErrorHandler.ts)
 *   - types.ts (services/allergy/types.ts)
 *   - auditLogging.ts (services/allergy/auditLogging.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (services/allergy/index.ts)
 */

/**
 * WC-GEN-199 | queryOperations.ts - General utility functions and operations
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
 * @fileoverview Allergy Query Operations - Patient Safety Critical Retrieval
 *
 * Provides comprehensive query, search, and filtering operations for allergy records with
 * automatic PHI audit logging. All query operations prioritize patient safety by ordering
 * results by severity (critical allergies first) and verification status.
 *
 * This module is CRITICAL for medication-allergy cross-checking systems, emergency response
 * protocols, and clinical decision support. Query results directly inform medication
 * administration decisions that can prevent life-threatening allergic reactions.
 *
 * @module services/allergy/queryOperations
 * @security All query operations log PHI access for HIPAA compliance
 * @compliance HIPAA audit logging, patient safety information retrieval standards
 * @since 1.0.0
 */

import { Op, Transaction } from 'sequelize';
import { logger } from '../../utils/logger';
import { handleSequelizeError } from '../../utils/sequelizeErrorHandler';
import {
  Allergy as AllergyModel,
  Student,
  HealthRecord
} from '../../database/models';
import { AllergyFilters, PaginationOptions, PaginatedAllergyResults } from './allergy.types';
import { logStudentAllergiesRead, logAllergySearch } from './auditLogging';

/**
 * Retrieves all allergy records for a specific student with severity-based ordering.
 *
 * Returns student's complete allergy profile ordered by clinical priority: SEVERE/LIFE_THREATENING
 * allergies first, then verified allergies, then most recent. This ordering ensures critical
 * allergy information is immediately visible for medication cross-checking and emergency response.
 *
 * By default, returns only ACTIVE allergies to support medication cross-checking. Set includeInactive=true
 * to retrieve complete allergy history including resolved allergies.
 *
 * @param {string} studentId - Student's unique identifier
 * @param {boolean} [includeInactive=false] - Include inactive/resolved allergies in results
 * @param {Transaction} [transaction] - Optional transaction for read consistency
 *
 * @returns {Promise<AllergyModel[]>} Array of allergy records with student and health record associations
 *
 * @throws {Error} Database error - if Sequelize query fails
 *
 * @security Logs PHI access with student ID, allergy count, and inactive flag for audit trail
 * @compliance HIPAA audit logging for patient allergy information access
 *
 * @example
 * ```typescript
 * // Get active allergies before medication administration
 * const activeAllergies = await getStudentAllergies('student-uuid-123');
 * const hasPenicillinAllergy = activeAllergies.some(a =>
 *   a.allergen.toLowerCase().includes('penicillin') &&
 *   ['SEVERE', 'LIFE_THREATENING'].includes(a.severity)
 * );
 * if (hasPenicillinAllergy) {
 *   console.error('STOP: Cannot administer penicillin - patient has severe allergy');
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Get complete allergy history including resolved allergies
 * const allAllergies = await getStudentAllergies('student-uuid-456', true);
 * console.log(`Patient has ${allAllergies.length} total allergy records`);
 * const activeCount = allAllergies.filter(a => a.isActive).length;
 * console.log(`${activeCount} currently active, ${allAllergies.length - activeCount} resolved`);
 * ```
 *
 * @remarks
 * Results are ordered by:
 * 1. Severity DESC (LIFE_THREATENING, SEVERE, MODERATE, MILD)
 * 2. Verified DESC (verified allergies before unverified)
 * 3. Created date DESC (most recent first)
 *
 * This ordering ensures the most critical, clinically verified allergies appear first
 * in medication cross-checking interfaces and emergency response systems.
 *
 * @warning Only returns active allergies by default - set includeInactive=true for complete history
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
 * Searches allergies across all students with advanced filtering and pagination.
 *
 * Provides comprehensive allergy search capabilities with multiple filter options and
 * full-text search across allergen names, reactions, treatments, and notes. Results are
 * automatically ordered by severity to prioritize critical allergies in search results.
 *
 * Supports filtering by student, severity, allergen type, verification status, and active
 * status for flexible allergy reporting and clinical decision support queries.
 *
 * @param {AllergyFilters} [filters={}] - Search and filter criteria
 * @param {string} [filters.studentId] - Filter to specific student
 * @param {AllergySeverity} [filters.severity] - Filter by severity level
 * @param {string} [filters.allergenType] - Filter by allergen type (MEDICATION, FOOD, ENVIRONMENTAL)
 * @param {boolean} [filters.verified] - Filter by verification status
 * @param {boolean} [filters.isActive] - Filter by active status
 * @param {string} [filters.searchTerm] - Full-text search across allergen, reaction, treatment, notes
 * @param {PaginationOptions} [pagination={}] - Pagination controls
 * @param {number} [pagination.page=1] - Page number (1-indexed)
 * @param {number} [pagination.limit=20] - Results per page
 * @param {Transaction} [transaction] - Optional transaction for read consistency
 *
 * @returns {Promise<PaginatedAllergyResults>} Paginated results with allergies array and metadata
 * @returns {AllergyModel[]} allergies - Array of matching allergy records with student associations
 * @returns {number} total - Total count of matching records across all pages
 * @returns {number} page - Current page number
 * @returns {number} pages - Total number of pages
 *
 * @throws {Error} Database error - if Sequelize query fails
 *
 * @security Logs search criteria and result count for PHI access audit trail
 * @compliance HIPAA audit logging for bulk allergy information queries
 *
 * @example
 * ```typescript
 * // Search for all severe medication allergies
 * const severeResults = await searchAllergies({
 *   severity: 'SEVERE',
 *   allergenType: 'MEDICATION',
 *   isActive: true
 * }, { page: 1, limit: 50 });
 *
 * console.log(`Found ${severeResults.total} severe medication allergies`);
 * severeResults.allergies.forEach(allergy => {
 *   console.log(`${allergy.student.firstName} ${allergy.student.lastName}: ${allergy.allergen}`);
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Full-text search for peanut allergies
 * const peanutAllergies = await searchAllergies({
 *   searchTerm: 'peanut',
 *   verified: true
 * });
 * console.log(`Found ${peanutAllergies.total} verified peanut allergy records`);
 * ```
 *
 * @example
 * ```typescript
 * // Get all unverified allergies for clinical review
 * const unverified = await searchAllergies({
 *   verified: false,
 *   isActive: true
 * }, { page: 1, limit: 100 });
 * console.log(`${unverified.total} allergies need healthcare professional verification`);
 * ```
 *
 * @remarks
 * Search term performs case-insensitive LIKE query across:
 * - allergen (name of allergen)
 * - reaction (allergic reaction description)
 * - treatment (emergency treatment protocol)
 * - notes (clinical notes)
 *
 * Results are ordered by severity DESC, created date DESC to prioritize critical and recent allergies.
 * Pagination uses offset/limit pattern. Page numbers are 1-indexed for user-friendly APIs.
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
 * Retrieves CRITICAL allergies (SEVERE or LIFE_THREATENING) for emergency response.
 *
 * **PATIENT SAFETY CRITICAL FUNCTION** - Returns only the most serious allergies that require
 * immediate attention in emergency situations and medication administration. These allergies
 * represent life-threatening risks and MUST be checked before administering any medications.
 *
 * Only returns ACTIVE allergies with SEVERE or LIFE_THREATENING severity levels, ordered by
 * severity (LIFE_THREATENING first) to prioritize the most dangerous allergies.
 *
 * @param {string} studentId - Student's unique identifier
 * @param {Transaction} [transaction] - Optional transaction for read consistency
 *
 * @returns {Promise<AllergyModel[]>} Array of critical allergy records with student associations
 *
 * @throws {Error} Database error - if Sequelize query fails
 *
 * @security Logs critical allergy access with severity levels for high-risk PHI audit trail
 * @compliance HIPAA audit logging, patient safety information access tracking
 *
 * @example
 * ```typescript
 * // Emergency response - check critical allergies before treatment
 * const criticalAllergies = await getCriticalAllergies('student-uuid-123');
 * if (criticalAllergies.length > 0) {
 *   console.error('ALERT: Patient has critical allergies');
 *   criticalAllergies.forEach(allergy => {
 *     console.error(`- ${allergy.allergen} (${allergy.severity}): ${allergy.reaction}`);
 *     console.error(`  Treatment: ${allergy.treatment || 'See health records'}`);
 *   });
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Pre-medication administration critical allergy check
 * async function checkCriticalAllergiesBeforeMedication(studentId, medicationName) {
 *   const critical = await getCriticalAllergies(studentId);
 *   const contraindicated = critical.find(allergy =>
 *     medicationName.toLowerCase().includes(allergy.allergen.toLowerCase()) ||
 *     allergy.allergen.toLowerCase().includes(medicationName.toLowerCase())
 *   );
 *
 *   if (contraindicated) {
 *     throw new Error(
 *       `CRITICAL ALLERGY: Cannot administer ${medicationName} - ` +
 *       `patient has ${contraindicated.severity} allergy. ${contraindicated.treatment}`
 *     );
 *   }
 * }
 * ```
 *
 * @warning ONLY returns SEVERE and LIFE_THREATENING allergies - use getStudentAllergies for complete list
 * @warning ONLY returns ACTIVE allergies - inactive allergies are excluded
 * @warning Results MUST be checked before ANY medication administration
 *
 * @remarks
 * Severity filtering includes both:
 * - SEVERE: Serious allergic reactions requiring medical intervention
 * - LIFE_THREATENING: Anaphylaxis or reactions requiring emergency services
 *
 * Results are ordered by severity DESC (LIFE_THREATENING before SEVERE) to ensure the
 * most dangerous allergies are processed first in emergency decision support systems.
 *
 * This function is specifically designed for:
 * - Emergency response protocols
 * - Medication administration pre-checks
 * - Clinical decision support alerts
 * - Emergency medical information displays
 *
 * @see {@link getStudentAllergies} for complete allergy list including MILD and MODERATE
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
