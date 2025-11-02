/**
 * Medication Type Definitions
 *
 * Re-exports medication-related types from the main API and common types files.
 * This file provides a convenient import path for medication-specific types.
 */

// Re-export medication entity types from api.ts
export type {
  Medication,
  MedicationAdministration,
  AdverseReaction,
  MedicationInventory,
  StudentMedication,
} from './api';

// Re-export medication-related types from common.ts
export type {
  MedicationRoute,
} from './common';

// NOTE: The following types are referenced in medication.types.ts but don't exist yet:
// - MedicationSchedule
// - MedicationReminder
// - CreateMedicationData
// - UpdateMedicationData
// - MedicationFilters
// - MedicationAdministrationFilters
// - MedicationStatistics
// - MedicationType (enum)
// - MedicationFrequency (enum)
// - MedicationStatus (enum)
// - AdministrationStatus (enum)
// - ReactionSeverity (enum)
// - InventoryStatus (enum)
//
// These should be defined in api.ts or common.ts and then re-exported here.
