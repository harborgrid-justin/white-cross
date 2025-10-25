/**
 * Medication Type Definitions
 *
 * Re-exports medication-related types from the main API types file.
 * This file provides a convenient import path for medication-specific types.
 */

export type {
  Medication,
  MedicationAdministration,
  MedicationSchedule,
  AdverseReaction,
  MedicationInventory,
  MedicationReminder,
  CreateMedicationData,
  UpdateMedicationData,
  MedicationFilters,
  MedicationAdministrationFilters,
  MedicationStatistics,
} from './api';

export type {
  MedicationType,
  MedicationRoute,
  MedicationFrequency,
  MedicationStatus,
  AdministrationStatus,
  ReactionSeverity,
  InventoryStatus,
} from './api';
