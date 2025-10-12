/**
 * Chronic Condition Service - Main Module
 *
 * Enterprise-grade service for managing student chronic health conditions.
 * Implements comprehensive care plan tracking, medication management, and PHI compliance.
 *
 * @module services/chronicCondition
 */

import { Transaction } from 'sequelize';
import {
  ChronicCondition,
  Student,
  HealthRecord
} from '../../database/models';

// Export all types
export * from './types';

// Import all operations
import * as crudOps from './crudOperations';
import * as queryOps from './queryOperations';
import * as businessOps from './businessLogic';

/**
 * ChronicConditionService
 *
 * Provides enterprise-grade chronic condition management with:
 * - HIPAA-compliant PHI handling
 * - Care plan tracking
 * - Review date management
 * - Educational accommodation tracking (IEP/504)
 */
export class ChronicConditionService {
  // ==================== CRUD Operations ====================

  /**
   * Creates a new chronic condition record with validation
   */
  static async createChronicCondition(
    data: import('./types').CreateChronicConditionData,
    transaction?: Transaction
  ): Promise<ChronicCondition> {
    return crudOps.createChronicCondition(data, transaction);
  }

  /**
   * Retrieves a chronic condition by ID
   */
  static async getChronicConditionById(
    id: string,
    transaction?: Transaction
  ): Promise<ChronicCondition | null> {
    return crudOps.getChronicConditionById(id, transaction);
  }

  /**
   * Retrieves all chronic conditions for a specific student
   */
  static async getStudentChronicConditions(
    studentId: string,
    includeInactive: boolean = false,
    transaction?: Transaction
  ): Promise<ChronicCondition[]> {
    return crudOps.getStudentChronicConditions(studentId, includeInactive, transaction);
  }

  /**
   * Updates a chronic condition record
   */
  static async updateChronicCondition(
    id: string,
    data: import('./types').UpdateChronicConditionData,
    transaction?: Transaction
  ): Promise<ChronicCondition> {
    return crudOps.updateChronicCondition(id, data, transaction);
  }

  /**
   * Soft deletes (deactivates) a chronic condition
   */
  static async deactivateChronicCondition(
    id: string,
    transaction?: Transaction
  ): Promise<{ success: boolean }> {
    return crudOps.deactivateChronicCondition(id, transaction);
  }

  /**
   * Hard deletes a chronic condition (use with caution)
   */
  static async deleteChronicCondition(
    id: string,
    transaction?: Transaction
  ): Promise<{ success: boolean }> {
    return crudOps.deleteChronicCondition(id, transaction);
  }

  // ==================== Query Operations ====================

  /**
   * Searches chronic conditions with filtering and pagination
   */
  static async searchChronicConditions(
    filters: import('./types').ChronicConditionFilters = {},
    pagination: import('./types').PaginationOptions = {},
    transaction?: Transaction
  ): Promise<import('./types').ChronicConditionSearchResult> {
    return queryOps.searchChronicConditions(filters, pagination, transaction);
  }

  /**
   * Gets conditions requiring review soon (within 30 days)
   */
  static async getConditionsRequiringReview(
    daysAhead: number = 30,
    transaction?: Transaction
  ): Promise<ChronicCondition[]> {
    return queryOps.getConditionsRequiringReview(daysAhead, transaction);
  }

  /**
   * Gets conditions requiring IEP or 504 accommodations
   */
  static async getConditionsRequiringAccommodations(
    type: import('./types').AccommodationType = 'BOTH',
    transaction?: Transaction
  ): Promise<ChronicCondition[]> {
    return queryOps.getConditionsRequiringAccommodations(type, transaction);
  }

  /**
   * Gets chronic condition statistics
   */
  static async getChronicConditionStatistics(
    filters: import('./types').ChronicConditionFilters = {}
  ): Promise<import('./types').ChronicConditionStatistics> {
    return queryOps.getChronicConditionStatistics(filters);
  }

  // ==================== Business Logic ====================

  /**
   * Updates care plan for a chronic condition
   */
  static async updateCarePlan(
    id: string,
    carePlan: string,
    transaction?: Transaction
  ): Promise<ChronicCondition> {
    return businessOps.updateCarePlan(id, carePlan, transaction);
  }

  /**
   * Bulk creates chronic conditions
   */
  static async bulkCreateChronicConditions(
    conditionsData: import('./types').CreateChronicConditionData[],
    transaction?: Transaction
  ): Promise<ChronicCondition[]> {
    return businessOps.bulkCreateChronicConditions(conditionsData, transaction);
  }

  /**
   * Executes a callback within a transaction
   */
  static async withTransaction<T>(
    callback: (transaction: Transaction) => Promise<T>
  ): Promise<T> {
    return businessOps.withTransaction(callback);
  }
}

export default ChronicConditionService;
