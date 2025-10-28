/**
 * LOC: EB979020E7
 * WC-IDX-230 | index.ts - Module exports and entry point
 *
 * UPSTREAM (imports from):
 *   - crudOperations.ts (services/chronicCondition/crudOperations.ts)
 *   - queryOperations.ts (services/chronicCondition/queryOperations.ts)
 *   - businessLogic.ts (services/chronicCondition/businessLogic.ts)
 *
 * DOWNSTREAM (imported by):
 *   - None (not imported)
 */

/**
 * WC-IDX-230 | index.ts - Module exports and entry point
 * Purpose: module exports and entry point
 * Upstream: ../../database/models, ./crudOperations, ./queryOperations | Dependencies: sequelize, ../../database/models, ./crudOperations
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes, default export | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: module exports and entry point, part of backend architecture
 */

/**
 * @fileoverview Chronic Condition Service - Main Module
 *
 * Enterprise-grade service for comprehensive management of student chronic health conditions.
 * Provides a unified service class aggregating all chronic condition operations with
 * HIPAA-compliant PHI handling, ICD-10 coding support, and educational accommodation tracking.
 *
 * Core Capabilities:
 * - CRUD operations for chronic condition records
 * - Advanced search with multi-criteria filtering
 * - Care plan tracking and review scheduling
 * - Educational accommodation management (IEP/504)
 * - Population health statistics and analytics
 * - Bulk operations for data imports
 * - Transaction support for atomic operations
 *
 * @module services/chronicCondition
 *
 * @remarks
 * PHI SENSITIVITY: All operations handle protected health information with comprehensive
 * audit logging for HIPAA compliance. Every database operation is logged with action type,
 * entity IDs, timestamps, and change tracking.
 *
 * Healthcare Context:
 * - ICD-10 diagnosis code support (e.g., E10.9 for Type 1 Diabetes)
 * - Care plan documentation and review tracking
 * - Medication, restriction, and trigger management
 * - Emergency protocol documentation
 * - IEP/504 educational accommodation coordination
 * - Clinical severity tracking (Low, Moderate, High, Critical)
 *
 * Service Architecture:
 * - Static methods for stateless operation
 * - Modular organization (CRUD, Query, Business Logic)
 * - Sequelize ORM with transaction support
 * - Eager loading of student and health record associations
 * - Comprehensive error handling and logging
 *
 * @example
 * ```typescript
 * import { ChronicConditionService } from './services/chronicCondition';
 *
 * // Create new chronic condition
 * const condition = await ChronicConditionService.createChronicCondition({
 *   studentId: 'student-uuid',
 *   condition: 'Type 1 Diabetes',
 *   icdCode: 'E10.9',
 *   diagnosedDate: new Date(),
 *   status: 'ACTIVE',
 *   severity: 'High',
 *   requiresIEP: true
 * });
 *
 * // Search active conditions requiring IEP
 * const results = await ChronicConditionService.searchChronicConditions({
 *   status: 'ACTIVE',
 *   requiresIEP: true
 * }, { page: 1, limit: 20 });
 *
 * // Get conditions due for review
 * const reviewList = await ChronicConditionService.getConditionsRequiringReview(30);
 *
 * // Update care plan
 * const updated = await ChronicConditionService.updateCarePlan(
 *   condition.id,
 *   'Updated care plan documentation...'
 * );
 * ```
 *
 * @see {@link module:services/chronicCondition/crudOperations} for CRUD implementation
 * @see {@link module:services/chronicCondition/queryOperations} for search implementation
 * @see {@link module:services/chronicCondition/businessLogic} for business logic
 * @see {@link module:services/chronicCondition/types} for type definitions
 *
 * @since 1.0.0
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
 * Chronic Condition Service Class
 *
 * Unified service providing comprehensive chronic condition management for school health systems.
 * All methods are static, providing stateless operation with transaction support for atomic
 * multi-step operations.
 *
 * Service Organization:
 * - **CRUD Operations**: Create, read, update, delete chronic condition records
 * - **Query Operations**: Search, filter, and retrieve conditions with complex criteria
 * - **Business Logic**: Care plan updates, bulk operations, transaction management
 *
 * Key Features:
 * - HIPAA-compliant PHI handling with audit logging
 * - ICD-10 diagnosis code support
 * - Care plan tracking with review scheduling
 * - Educational accommodation integration (IEP/504)
 * - Medication and restriction management
 * - Emergency protocol documentation
 * - Population health statistics
 * - Bulk import/export capabilities
 *
 * @class ChronicConditionService
 *
 * @example
 * ```typescript
 * // Comprehensive chronic condition workflow
 * const condition = await ChronicConditionService.createChronicCondition({
 *   studentId: 'uuid',
 *   condition: 'Asthma',
 *   icdCode: 'J45.909',
 *   diagnosedDate: new Date(),
 *   status: 'MANAGED',
 *   medications: ['Albuterol Inhaler'],
 *   triggers: ['Exercise', 'Cold air'],
 *   requiresIEP: false,
 *   requires504: true
 * });
 *
 * // Later: Update care plan
 * await ChronicConditionService.updateCarePlan(
 *   condition.id,
 *   'Revised asthma action plan with new trigger management...'
 * );
 *
 * // Get dashboard statistics
 * const stats = await ChronicConditionService.getChronicConditionStatistics();
 * console.log(`Managing ${stats.total} chronic conditions`);
 * console.log(`${stats.reviewDueSoon} need review soon`);
 * ```
 *
 * @remarks
 * All operations include comprehensive audit logging for HIPAA compliance.
 * Transaction support available through withTransaction() method or by passing
 * transaction parameter to individual operations.
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
