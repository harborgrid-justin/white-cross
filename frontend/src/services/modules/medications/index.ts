/**
 * @fileoverview Medications API Module
 *
 * Unified medication management API providing comprehensive access to medication
 * operations, student assignments, administration logging, inventory management,
 * and adverse reaction reporting with full HIPAA compliance and DEA regulations.
 *
 * This module serves as the main entry point for all medication-related operations
 * and maintains backward compatibility with the original medicationsApi interface.
 *
 * @module services/modules/medications
 */

import type { ApiClient } from '../../core/ApiClient';
import { MedicationMainApi } from './mainApi';
import type {
  Medication,
  StudentMedication,
  InventoryItem,
  MedicationReminder,
  AdverseReaction,
  MedicationLog,
  MedicationAdministrationData,
  AdverseReactionData,
  MedicationsResponse,
  StudentMedicationsResponse,
  InventoryResponse,
  MedicationStats,
  MedicationAlertsResponse,
  MedicationFormOptions,
  MedicationScheduleResponse,
  MedicationFilters,
  CreateMedicationRequest,
  CreateInventoryRequest,
  UpdateInventoryRequest,
  StudentMedicationFormData,
  AdverseReactionFormData
} from './types';

// Re-export types for convenience
export type {
  Medication,
  StudentMedication,
  InventoryItem,
  MedicationReminder,
  AdverseReaction,
  MedicationLog,
  MedicationAdministrationData,
  AdverseReactionData,
  MedicationsResponse,
  StudentMedicationsResponse,
  InventoryResponse,
  MedicationStats,
  MedicationAlertsResponse,
  MedicationFormOptions,
  MedicationScheduleResponse,
  MedicationFilters,
  CreateMedicationRequest,
  CreateInventoryRequest,
  UpdateInventoryRequest,
  StudentMedicationFormData,
  AdverseReactionFormData
};

/**
 * Comprehensive Medications API Service
 *
 * Provides unified access to all medication-related operations including:
 * - Medication CRUD operations with validation
 * - Student medication assignments and tracking
 * - Administration logging with Five Rights verification
 * - Inventory management and tracking
 * - Adverse reaction reporting
 * - Scheduling and reminder management
 *
 * **Key Features:**
 * - DEA-compliant controlled substance handling
 * - HIPAA-compliant PHI protection and audit logging
 * - Comprehensive validation with Zod schemas
 * - Five Rights verification for patient safety
 * - Real-time administration logging
 * - Inventory tracking with expiration alerts
 *
 * @class MedicationsApi
 */
export class MedicationsApi {
  private mainApi: MedicationMainApi;

  constructor(client: ApiClient) {
    this.mainApi = new MedicationMainApi(client);
  }

  // ============================================================================
  // CORE MEDICATION OPERATIONS
  // ============================================================================

  /**
   * Get all medications with optional filtering and pagination
   */
  async getAll(filters?: MedicationFilters): Promise<MedicationsResponse> {
    return this.mainApi.getAll(filters);
  }

  /**
   * Get medication by ID
   */
  async getById(id: string): Promise<Medication> {
    return this.mainApi.getById(id);
  }

  /**
   * Create new medication in the formulary
   */
  async create(medicationData: CreateMedicationRequest): Promise<{ medication: Medication }> {
    return this.mainApi.create(medicationData);
  }

  /**
   * Update medication information
   */
  async update(id: string, medicationData: Partial<CreateMedicationRequest>): Promise<Medication> {
    return this.mainApi.update(id, medicationData);
  }

  /**
   * Delete medication from formulary
   */
  async delete(id: string): Promise<{ id: string }> {
    return this.mainApi.delete(id);
  }

  /**
   * Search medications by text query
   */
  async search(query: string, limit?: number): Promise<Medication[]> {
    return this.mainApi.search(query, limit);
  }

  /**
   * Get medications by category
   */
  async getByCategory(category: string, limit?: number): Promise<Medication[]> {
    return this.mainApi.getByCategory(category, limit);
  }

  /**
   * Get controlled substances
   */
  async getControlledSubstances(schedule?: string): Promise<Medication[]> {
    return this.mainApi.getControlledSubstances(schedule);
  }

  /**
   * Check medication availability
   */
  async checkAvailability(id: string): Promise<{ available: boolean; medication?: Medication }> {
    return this.mainApi.checkAvailability(id);
  }

  // ============================================================================
  // STUDENT MEDICATION OPERATIONS (PLACEHOLDER)
  // ============================================================================

  /**
   * Assign medication to student (create prescription)
   * 
   * @deprecated Implementation moved to separate module (not yet created)
   * @throws {Error} Always throws - not implemented in this refactor
   */
  async assignToStudent(assignmentData: StudentMedicationFormData): Promise<StudentMedication> {
    throw new Error('Student medication assignment not yet implemented in refactored API');
  }

  /**
   * Get administration logs for a student
   * 
   * @deprecated Implementation moved to separate module (not yet created)
   * @throws {Error} Always throws - not implemented in this refactor
   */
  async getStudentLogs(studentId: string, page?: number, limit?: number): Promise<StudentMedicationsResponse> {
    throw new Error('Student medication logs not yet implemented in refactored API');
  }

  /**
   * Deactivate student medication
   * 
   * @deprecated Implementation moved to separate module (not yet created)
   * @throws {Error} Always throws - not implemented in this refactor
   */
  async deactivateStudentMedication(studentMedicationId: string, reason?: string): Promise<StudentMedication> {
    throw new Error('Student medication deactivation not yet implemented in refactored API');
  }

  // ============================================================================
  // ADMINISTRATION OPERATIONS (PLACEHOLDER)
  // ============================================================================

  /**
   * Log medication administration
   * 
   * @deprecated Implementation moved to separate module (not yet created)
   * @throws {Error} Always throws - not implemented in this refactor
   */
  async logAdministration(logData: MedicationAdministrationData): Promise<MedicationLog> {
    throw new Error('Medication administration logging not yet implemented in refactored API');
  }

  /**
   * Alias for logAdministration (backward compatibility)
   * 
   * @deprecated Use logAdministration() - will be removed
   * @throws {Error} Always throws - not implemented in this refactor
   */
  async administer(logData: MedicationAdministrationData): Promise<MedicationLog> {
    return this.logAdministration(logData);
  }

  // ============================================================================
  // INVENTORY OPERATIONS (PLACEHOLDER)
  // ============================================================================

  /**
   * Get medication inventory with alerts
   * 
   * @deprecated Implementation moved to separate module (not yet created)
   * @throws {Error} Always throws - not implemented in this refactor
   */
  async getInventory(): Promise<InventoryResponse> {
    throw new Error('Inventory operations not yet implemented in refactored API');
  }

  /**
   * Add medication to inventory
   * 
   * @deprecated Implementation moved to separate module (not yet created)
   * @throws {Error} Always throws - not implemented in this refactor
   */
  async addToInventory(inventoryData: CreateInventoryRequest): Promise<InventoryItem> {
    throw new Error('Inventory operations not yet implemented in refactored API');
  }

  /**
   * Update inventory quantity
   * 
   * @deprecated Implementation moved to separate module (not yet created)
   * @throws {Error} Always throws - not implemented in this refactor
   */
  async updateInventoryQuantity(id: string, updateData: UpdateInventoryRequest): Promise<InventoryItem> {
    throw new Error('Inventory operations not yet implemented in refactored API');
  }

  /**
   * Alias for updateInventoryQuantity (backward compatibility)
   * 
   * @deprecated Use updateInventoryQuantity() - will be removed
   * @throws {Error} Always throws - not implemented in this refactor
   */
  async updateInventory(id: string, updateData: UpdateInventoryRequest): Promise<InventoryItem> {
    return this.updateInventoryQuantity(id, updateData);
  }

  // ============================================================================
  // SCHEDULING OPERATIONS (PLACEHOLDER)
  // ============================================================================

  /**
   * Get medication schedule for date range
   * 
   * @deprecated Implementation moved to separate module (not yet created)
   * @throws {Error} Always throws - not implemented in this refactor
   */
  async getSchedule(startDate?: string, endDate?: string, nurseId?: string): Promise<StudentMedication[]> {
    throw new Error('Scheduling operations not yet implemented in refactored API');
  }

  /**
   * Get medication reminders for specific date
   * 
   * @deprecated Implementation moved to separate module (not yet created)
   * @throws {Error} Always throws - not implemented in this refactor
   */
  async getReminders(date?: string): Promise<MedicationReminder[]> {
    throw new Error('Reminder operations not yet implemented in refactored API');
  }

  /**
   * Get medication statistics
   * 
   * @deprecated Implementation moved to separate module (not yet created)
   * @throws {Error} Always throws - not implemented in this refactor
   */
  async getStats(): Promise<MedicationStats> {
    throw new Error('Statistics operations not yet implemented in refactored API');
  }

  /**
   * Get medication alerts
   * 
   * @deprecated Implementation moved to separate module (not yet created)
   * @throws {Error} Always throws - not implemented in this refactor
   */
  async getAlerts(): Promise<MedicationAlertsResponse> {
    throw new Error('Alert operations not yet implemented in refactored API');
  }

  /**
   * Get medication form options
   * 
   * @deprecated Implementation moved to separate module (not yet created)
   * @throws {Error} Always throws - not implemented in this refactor
   */
  async getFormOptions(): Promise<MedicationFormOptions> {
    throw new Error('Form options not yet implemented in refactored API');
  }

  // ============================================================================
  // ADVERSE REACTION OPERATIONS (PLACEHOLDER)
  // ============================================================================

  /**
   * Report adverse reaction
   * 
   * @deprecated Implementation moved to separate module (not yet created)
   * @throws {Error} Always throws - not implemented in this refactor
   */
  async reportAdverseReaction(reactionData: AdverseReactionData | AdverseReactionFormData): Promise<AdverseReaction> {
    throw new Error('Adverse reaction reporting not yet implemented in refactored API');
  }

  /**
   * Get adverse reactions
   * 
   * @deprecated Implementation moved to separate module (not yet created)
   * @throws {Error} Always throws - not implemented in this refactor
   */
  async getAdverseReactions(medicationId?: string, studentId?: string): Promise<AdverseReaction[]> {
    throw new Error('Adverse reaction retrieval not yet implemented in refactored API');
  }
}

/**
 * Factory function for creating MedicationsApi instances
 *
 * @param {ApiClient} client - Configured ApiClient instance
 * @returns {MedicationsApi} New MedicationsApi instance
 */
export function createMedicationsApi(client: ApiClient): MedicationsApi {
  return new MedicationsApi(client);
}

// Export singleton instance
import { apiClient } from '../../core/ApiClient';

/**
 * Singleton MedicationsApi instance
 *
 * Pre-configured with the default apiClient. Use this for all production code.
 * 
 * @constant {MedicationsApi}
 *
 * @example
 * ```typescript
 * import { medicationsApi } from '@/services/modules/medications';
 *
 * // Core medication operations are fully functional
 * const medications = await medicationsApi.getAll();
 * const medication = await medicationsApi.getById('med-id');
 * 
 * // Other operations will throw errors indicating they need implementation
 * try {
 *   await medicationsApi.logAdministration(data); // Throws error
 * } catch (error) {
 *   console.log(error.message); // "Medication administration logging not yet implemented"
 * }
 * ```
 */
export const medicationsApi = createMedicationsApi(apiClient);

/**
 * Re-export validation schemas for external use
 */
export {
  createMedicationSchema,
  updateMedicationSchema,
  assignMedicationSchema,
  logAdministrationSchema,
  addToInventorySchema,
  updateInventorySchema,
  reportAdverseReactionSchema,
  medicationFiltersSchema,
  validateFiveRights,
  validateDEACompliance,
  validateDosageFormat,
  validateNDCFormat,
  validateFrequencyFormat
} from './schemas';

/**
 * Re-export validation utilities and constants
 */
export {
  DOSAGE_FORMS,
  ADMINISTRATION_ROUTES,
  DEA_SCHEDULES,
  ADVERSE_REACTION_SEVERITY_LEVELS,
  FREQUENCY_PATTERNS,
  NDC_REGEX,
  DOSAGE_REGEX,
  STRENGTH_REGEX,
  validateFrequency,
  validateNDC,
  validateDosage,
  validateStrength,
  isDosageForm,
  isAdministrationRoute,
  isDEASchedule,
  isAdverseReactionSeverity
} from './types';
