/**
 * LOC: A6E43C3C24
 * WC-IDX-198 | index.ts - Module exports and entry point
 *
 * UPSTREAM (imports from):
 *   - crudOperations.ts (services/allergy/crudOperations.ts)
 *   - queryOperations.ts (services/allergy/queryOperations.ts)
 *   - specialOperations.ts (services/allergy/specialOperations.ts)
 *   - statistics.ts (services/allergy/statistics.ts)
 *   - bulkOperations.ts (services/allergy/bulkOperations.ts)
 *
 * DOWNSTREAM (imported by):
 *   - None (not imported)
 */

/**
 * WC-IDX-198 | index.ts - Module exports and entry point
 * Purpose: module exports and entry point
 * Upstream: Independent module | Dependencies: None
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes, default export | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: module exports and entry point, part of backend architecture
 */

/**
 * @fileoverview Allergy Service - Module Entry Point
 *
 * Exports comprehensive allergy management functionality for student health records.
 * Provides both functional exports and backwards-compatible AllergyService class.
 *
 * Enterprise-grade service with full HIPAA compliance, patient safety focus, and
 * medication-allergy cross-checking capabilities. All operations include automatic
 * PHI audit logging and support transactional workflows.
 *
 * @module services/allergy
 * @security All operations log PHI access for HIPAA compliance
 * @compliance HIPAA, healthcare allergy documentation standards
 * @since 1.0.0
 */

// Export types
export * from './allergy.types';

// Export all operations
export {
  createAllergy,
  getAllergyById,
  updateAllergy,
  deactivateAllergy,
  deleteAllergy
} from './crudOperations';

export {
  getStudentAllergies,
  searchAllergies,
  getCriticalAllergies
} from './queryOperations';

export {
  getAllergyStatistics
} from './statistics';

export {
  bulkCreateAllergies
} from './bulkOperations';

export {
  verifyAllergy,
  withTransaction
} from './specialOperations';

// Export validation functions (may be useful for controllers)
export {
  validateStudentExists,
  checkDuplicateAllergy,
  validateBulkStudentIds,
  validateAllergyData
} from './validation';

/**
 * AllergyService class providing unified interface for allergy management.
 *
 * Maintains backwards compatibility with original monolithic service while delegating
 * to modular implementation. All static methods provide the same API surface with
 * improved modularity, testability, and maintainability.
 *
 * **PATIENT SAFETY CRITICAL** - This service manages life-threatening allergy information
 * that directly impacts medication administration and emergency response.
 *
 * @class AllergyService
 *
 * @example
 * ```typescript
 * // Create new allergy record
 * const allergy = await AllergyService.createAllergy({
 *   studentId: 'student-uuid-123',
 *   allergen: 'Penicillin',
 *   severity: 'SEVERE',
 *   verified: false
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Check for critical allergies before medication
 * const critical = await AllergyService.getCriticalAllergies('student-uuid-456');
 * if (critical.length > 0) {
 *   console.warn('ALERT: Patient has critical allergies');
 * }
 * ```
 *
 * @remarks
 * Prefer using functional exports for new code:
 * - import { createAllergy, getStudentAllergies } from '@/services/allergy'
 *
 * Use AllergyService class for backwards compatibility:
 * - import AllergyService from '@/services/allergy'
 *
 * @security All methods log PHI access automatically
 * @compliance HIPAA audit logging, healthcare data standards
 */
export class AllergyService {
  static async createAllergy(data: any, transaction?: any) {
    const { createAllergy } = require('./crudOperations');
    return createAllergy(data, transaction);
  }

  static async getAllergyById(id: string, transaction?: any) {
    const { getAllergyById } = require('./crudOperations');
    return getAllergyById(id, transaction);
  }

  static async getStudentAllergies(studentId: string, includeInactive: boolean = false, transaction?: any) {
    const { getStudentAllergies } = require('./queryOperations');
    return getStudentAllergies(studentId, includeInactive, transaction);
  }

  static async searchAllergies(filters: any = {}, pagination: any = {}, transaction?: any) {
    const { searchAllergies } = require('./queryOperations');
    return searchAllergies(filters, pagination, transaction);
  }

  static async updateAllergy(id: string, data: any, transaction?: any) {
    const { updateAllergy } = require('./crudOperations');
    return updateAllergy(id, data, transaction);
  }

  static async deactivateAllergy(id: string, transaction?: any) {
    const { deactivateAllergy } = require('./crudOperations');
    return deactivateAllergy(id, transaction);
  }

  static async deleteAllergy(id: string, transaction?: any) {
    const { deleteAllergy } = require('./crudOperations');
    return deleteAllergy(id, transaction);
  }

  static async verifyAllergy(id: string, verifiedBy: string, transaction?: any) {
    const { verifyAllergy } = require('./specialOperations');
    return verifyAllergy(id, verifiedBy, transaction);
  }

  static async getCriticalAllergies(studentId: string, transaction?: any) {
    const { getCriticalAllergies } = require('./queryOperations');
    return getCriticalAllergies(studentId, transaction);
  }

  static async getAllergyStatistics(filters: any = {}) {
    const { getAllergyStatistics } = require('./statistics');
    return getAllergyStatistics(filters);
  }

  static async bulkCreateAllergies(allergiesData: any[], transaction?: any) {
    const { bulkCreateAllergies } = require('./bulkOperations');
    return bulkCreateAllergies(allergiesData, transaction);
  }

  static async withTransaction<T>(callback: (transaction: any) => Promise<T>): Promise<T> {
    const { withTransaction } = require('./specialOperations');
    return withTransaction(callback);
  }
}

export default AllergyService;
