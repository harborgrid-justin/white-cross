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
 * Allergy Service - Modular Implementation
 *
 * Enterprise-grade service for managing student allergies with full PHI compliance.
 * Provides comprehensive allergy tracking, severity management, and verification workflows.
 *
 * @module services/allergy
 */

// Export types
export * from './types';

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
 * AllergyService class for backwards compatibility
 * This maintains the same API as the original monolithic service
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
