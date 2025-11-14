/**
 * @fileoverview Medications API Module
 *
 * Unified medication management API providing comprehensive access to medication
 * operations, student assignments, administration logging, inventory management,
 * and adverse reaction reporting with full HIPAA compliance and DEA regulations.
 *
 * @module services/modules/medications
 */

import type { ApiClient } from '../../core/ApiClient';
import { MedicationMainApi } from './mainApi';
import { MedicationAdministrationApi } from './administrationApi';
import { MedicationInventoryApi } from './inventoryApi';
import { StudentMedicationApi } from './studentMedicationApi';
import { AdverseReactionsApi } from './adverseReactionsApi';
import { MedicationScheduleApi } from './scheduleApi';
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

// Re-export types
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
 * Provides unified access to all medication-related operations with
 * DEA-compliant controlled substance handling and HIPAA-compliant PHI protection.
 */
export class MedicationsApi {
  private mainApi: MedicationMainApi;
  private administrationApi: MedicationAdministrationApi;
  private inventoryApi: MedicationInventoryApi;
  private studentMedicationApi: StudentMedicationApi;
  private adverseReactionsApi: AdverseReactionsApi;
  private scheduleApi: MedicationScheduleApi;

  constructor(client: ApiClient) {
    this.mainApi = new MedicationMainApi(client);
    this.administrationApi = new MedicationAdministrationApi(client);
    this.inventoryApi = new MedicationInventoryApi(client);
    this.studentMedicationApi = new StudentMedicationApi(client);
    this.adverseReactionsApi = new AdverseReactionsApi(client);
    this.scheduleApi = new MedicationScheduleApi(client);
  }

  // Core Medication Operations
  async getAll(filters?: MedicationFilters): Promise<MedicationsResponse> {
    return this.mainApi.getAll(filters);
  }

  async getById(id: string): Promise<Medication> {
    return this.mainApi.getById(id);
  }

  async create(medicationData: CreateMedicationRequest): Promise<{ medication: Medication }> {
    return this.mainApi.create(medicationData);
  }

  async update(id: string, medicationData: Partial<CreateMedicationRequest>): Promise<Medication> {
    return this.mainApi.update(id, medicationData);
  }

  async delete(id: string): Promise<{ id: string }> {
    return this.mainApi.delete(id);
  }

  async search(query: string, limit?: number): Promise<Medication[]> {
    return this.mainApi.search(query, limit);
  }

  async getByCategory(category: string, limit?: number): Promise<Medication[]> {
    return this.mainApi.getByCategory(category, limit);
  }

  async getControlledSubstances(schedule?: string): Promise<Medication[]> {
    return this.mainApi.getControlledSubstances(schedule);
  }

  async checkAvailability(id: string): Promise<{ available: boolean; medication?: Medication }> {
    return this.mainApi.checkAvailability(id);
  }

  // Student Medication Operations
  async assignToStudent(assignmentData: StudentMedicationFormData): Promise<StudentMedication> {
    return this.studentMedicationApi.assignToStudent(assignmentData);
  }

  async deactivateStudentMedication(studentMedicationId: string, reason?: string): Promise<StudentMedication> {
    return this.studentMedicationApi.deactivateStudentMedication(studentMedicationId, reason);
  }

  // Administration Operations
  async logAdministration(logData: MedicationAdministrationData): Promise<MedicationLog> {
    return this.administrationApi.logAdministration(logData);
  }

  async getStudentLogs(studentId: string, page?: number, limit?: number): Promise<StudentMedicationsResponse> {
    return this.administrationApi.getStudentLogs(studentId, page, limit);
  }

  async administer(logData: MedicationAdministrationData): Promise<MedicationLog> {
    return this.administrationApi.administer(logData);
  }

  // Inventory Operations
  async getInventory(): Promise<InventoryResponse> {
    return this.inventoryApi.getInventory();
  }

  async addToInventory(inventoryData: CreateInventoryRequest): Promise<InventoryItem> {
    return this.inventoryApi.addToInventory(inventoryData);
  }

  async updateInventoryQuantity(id: string, updateData: UpdateInventoryRequest): Promise<InventoryItem> {
    return this.inventoryApi.updateInventoryQuantity(id, updateData);
  }

  async updateInventory(id: string, updateData: UpdateInventoryRequest): Promise<InventoryItem> {
    return this.inventoryApi.updateInventory(id, updateData);
  }

  // Schedule and Monitoring Operations
  async getSchedule(startDate?: string, endDate?: string, nurseId?: string): Promise<StudentMedication[]> {
    return this.scheduleApi.getSchedule(startDate, endDate, nurseId);
  }

  async getReminders(date?: string): Promise<MedicationReminder[]> {
    return this.scheduleApi.getReminders(date);
  }

  async getStats(): Promise<MedicationStats> {
    return this.scheduleApi.getStats();
  }

  async getAlerts(): Promise<MedicationAlertsResponse> {
    return this.scheduleApi.getAlerts();
  }

  async getFormOptions(): Promise<MedicationFormOptions> {
    return this.scheduleApi.getFormOptions();
  }

  // Adverse Reaction Operations
  async reportAdverseReaction(reactionData: AdverseReactionData | AdverseReactionFormData): Promise<AdverseReaction> {
    return this.adverseReactionsApi.reportAdverseReaction(reactionData);
  }

  async getAdverseReactions(medicationId?: string, studentId?: string): Promise<AdverseReaction[]> {
    return this.adverseReactionsApi.getAdverseReactions(medicationId, studentId);
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
 * // All medication operations are fully functional
 * const medications = await medicationsApi.getAll();
 * const medication = await medicationsApi.getById('med-id');
 * await medicationsApi.logAdministration(data);
 * const inventory = await medicationsApi.getInventory();
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
