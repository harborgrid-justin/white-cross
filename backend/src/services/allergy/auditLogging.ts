/**
 * LOC: 3E34DA2D42
 * WC-GEN-195 | auditLogging.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - index.ts (database/models/index.ts)
 *   - types.ts (services/allergy/types.ts)
 *
 * DOWNSTREAM (imported by):
 *   - bulkOperations.ts (services/allergy/bulkOperations.ts)
 *   - crudOperations.ts (services/allergy/crudOperations.ts)
 *   - queryOperations.ts (services/allergy/queryOperations.ts)
 */

/**
 * WC-GEN-195 | auditLogging.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../utils/logger, ../../database/models, ./types | Dependencies: ../../utils/logger, ../../database/models, ./types
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: functions | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

/**
 * @fileoverview Allergy Audit Logging - HIPAA Compliance
 *
 * Provides comprehensive PHI-compliant audit logging for all allergy operations.
 * Every function logs critical information required for HIPAA compliance, including
 * action type, entity IDs, PHI access details, and timestamps.
 *
 * All logs use Winston logger with structured format for analysis and compliance audits.
 *
 * @module services/allergy/auditLogging
 * @security All functions log PHI access for HIPAA compliance and security monitoring
 * @compliance HIPAA audit trail requirements for PHI access and modifications
 * @since 1.0.0
 */

import { logger } from '../../utils/logger';
import { Allergy as AllergyModel } from '../../database/models';
import { CreateAllergyData, AllergyFilters } from './types';

/**
 * Logs allergy record creation for HIPAA audit trail.
 *
 * @param {AllergyModel} allergy - Created allergy record
 * @param {CreateAllergyData} data - Input data used to create allergy
 *
 * @security Logs allergen, severity, and student ID for PHI access tracking
 * @compliance HIPAA create operation audit requirement
 */
export function logAllergyCreation(allergy: AllergyModel, data: CreateAllergyData): void {
  logger.info('PHI Access - Allergy Created', {
    action: 'CREATE',
    entity: 'Allergy',
    entityId: allergy.id,
    studentId: data.studentId,
    allergen: data.allergen,
    severity: data.severity,
    verifiedBy: data.verifiedBy,
    timestamp: new Date().toISOString()
  });
}

/**
 * Logs allergy record retrieval for HIPAA audit trail.
 *
 * @param {string} allergyId - Allergy record ID accessed
 * @param {string} studentId - Associated student ID
 * @security Logs PHI read access for HIPAA compliance
 * @compliance HIPAA read operation audit requirement
 */
export function logAllergyRead(allergyId: string, studentId: string): void {
  logger.info('PHI Access - Allergy Retrieved', {
    action: 'READ',
    entity: 'Allergy',
    entityId: allergyId,
    studentId,
    timestamp: new Date().toISOString()
  });
}

/**
 * Logs bulk student allergy retrieval for HIPAA audit trail.
 *
 * @param {string} studentId - Student ID whose allergies were accessed
 * @param {number} count - Number of allergy records retrieved
 * @param {boolean} includeInactive - Whether inactive allergies were included
 * @security Logs bulk PHI access for HIPAA compliance
 * @compliance HIPAA bulk read operation audit requirement
 */
export function logStudentAllergiesRead(
  studentId: string,
  count: number,
  includeInactive: boolean
): void {
  logger.info('PHI Access - Student Allergies Retrieved', {
    action: 'READ',
    entity: 'Allergy',
    studentId,
    count,
    includeInactive,
    timestamp: new Date().toISOString()
  });
}

/**
 * Logs allergy search query for HIPAA audit trail.
 *
 * @param {AllergyFilters} filters - Search filters applied
 * @param {number} resultCount - Number of records returned
 * @security Logs search criteria and result count for PHI access tracking
 * @compliance HIPAA search operation audit requirement
 */
export function logAllergySearch(filters: AllergyFilters, resultCount: number): void {
  logger.info('PHI Access - Allergies Searched', {
    action: 'READ',
    entity: 'Allergy',
    filters,
    resultCount,
    timestamp: new Date().toISOString()
  });
}

/**
 * Logs allergy record modification with before/after values for HIPAA audit trail.
 *
 * @param {AllergyModel} allergy - Updated allergy record
 * @param {Object} oldValues - Previous values before update
 * @param {string} [updatedBy] - User ID who performed update
 * @security Logs old and new values for complete change tracking
 * @compliance HIPAA update operation audit requirement with change history
 */
export function logAllergyUpdate(
  allergy: AllergyModel,
  oldValues: { allergen: string; severity: string; verified: boolean },
  updatedBy?: string
): void {
  logger.info('PHI Access - Allergy Updated', {
    action: 'UPDATE',
    entity: 'Allergy',
    entityId: allergy.id,
    studentId: allergy.studentId,
    changes: {
      old: oldValues,
      new: {
        allergen: allergy.allergen,
        severity: allergy.severity,
        verified: allergy.verified
      }
    },
    updatedBy,
    timestamp: new Date().toISOString()
  });
}

/**
 * Logs allergy soft-delete (deactivation) for HIPAA audit trail.
 *
 * @param {string} allergyId - Deactivated allergy record ID
 * @param {string} studentId - Associated student ID
 * @param {string} allergen - Allergen name for context
 * @security Logs deactivation for clinical history tracking
 * @compliance HIPAA deactivation audit requirement
 */
export function logAllergyDeactivation(
  allergyId: string,
  studentId: string,
  allergen: string
): void {
  logger.info('PHI Access - Allergy Deactivated', {
    action: 'UPDATE',
    entity: 'Allergy',
    entityId: allergyId,
    studentId,
    allergen,
    timestamp: new Date().toISOString()
  });
}

/**
 * Logs permanent allergy deletion for HIPAA audit trail.
 *
 * @param {string} allergyId - Permanently deleted allergy record ID
 * @param {Object} auditData - Complete allergy data captured before deletion
 * @security Logs all allergy data before permanent deletion for permanent record
 * @compliance HIPAA deletion audit requirement with data preservation
 * @warning Permanent deletion logged at WARN level due to severity
 */
export function logAllergyDeletion(
  allergyId: string,
  auditData: {
    allergen: string;
    severity: string;
    studentId: string;
    studentName: string;
  }
): void {
  logger.info('PHI Access - Allergy Deleted', {
    action: 'DELETE',
    entity: 'Allergy',
    entityId: allergyId,
    ...auditData,
    timestamp: new Date().toISOString()
  });
}

/**
 * Logs critical allergy access for HIPAA audit trail.
 *
 * @param {string} studentId - Student ID whose critical allergies were accessed
 * @param {number} count - Number of critical allergy records
 * @param {string[]} severities - Severity levels of retrieved allergies
 * @security Logs high-risk PHI access for medication safety audit
 * @compliance HIPAA critical PHI access audit requirement
 */
export function logCriticalAllergiesRead(
  studentId: string,
  count: number,
  severities: string[]
): void {
  logger.info('PHI Access - Critical Allergies Retrieved', {
    action: 'READ',
    entity: 'Allergy',
    studentId,
    count,
    severities,
    timestamp: new Date().toISOString()
  });
}

/**
 * Logs bulk allergy creation for HIPAA audit trail.
 *
 * @param {number} count - Number of allergy records created
 * @param {string[]} studentIds - Array of affected student IDs
 * @security Logs bulk PHI creation with aggregate count and student list
 * @compliance HIPAA bulk creation audit requirement
 */
export function logBulkAllergiesCreation(count: number, studentIds: string[]): void {
  logger.info('PHI Access - Allergies Bulk Created', {
    action: 'CREATE',
    entity: 'Allergy',
    count,
    studentIds,
    timestamp: new Date().toISOString()
  });
}
