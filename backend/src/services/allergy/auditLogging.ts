/**
 * Allergy Audit Logging Module
 *
 * Handles PHI-compliant audit logging for allergy operations
 *
 * @module services/allergy/auditLogging
 */

import { logger } from '../../utils/logger';
import { Allergy as AllergyModel } from '../../database/models';
import { CreateAllergyData, AllergyFilters } from './types';

/**
 * Logs allergy creation event
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
 * Logs allergy read event
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
 * Logs student allergies retrieval event
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
 * Logs allergy search event
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
 * Logs allergy update event
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
 * Logs allergy deactivation event
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
 * Logs allergy deletion event
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
 * Logs critical allergies retrieval event
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
 * Logs bulk allergies creation event
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
