/**
 * @fileoverview Medications API Service
 *
 * **DEPRECATED**: This file is maintained for backward compatibility only.
 * All functionality has been refactored into modular services in the medications/ subdirectory.
 *
 * **New Import Path:**
 * ```typescript
 * import { medicationsApi } from '@/services/modules/medications';
 * ```
 *
 * This file re-exports all functionality from the refactored modules to maintain
 * backward compatibility with existing code.
 *
 * @deprecated Import from '@/services/modules/medications' instead
 * @module services/modules/medicationsApi
 */

// Re-export everything from the refactored medications module
export {
  MedicationsApi,
  createMedicationsApi,
  medicationsApi,
  // Types
  type Medication,
  type StudentMedication,
  type InventoryItem,
  type MedicationReminder,
  type AdverseReaction,
  type MedicationLog,
  type MedicationAdministrationData,
  type AdverseReactionData,
  type MedicationsResponse,
  type StudentMedicationsResponse,
  type InventoryResponse,
  type MedicationStats,
  type MedicationAlertsResponse,
  type MedicationFormOptions,
  type MedicationScheduleResponse,
  type MedicationFilters,
  type CreateMedicationRequest,
  type CreateInventoryRequest,
  type UpdateInventoryRequest,
  type StudentMedicationFormData,
  type AdverseReactionFormData,
  // Validation schemas
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
  validateFrequencyFormat,
  // Constants and validators
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
} from './medications';
