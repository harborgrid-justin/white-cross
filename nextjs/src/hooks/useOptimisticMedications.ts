/**
 * Optimistic Medications Hook Exports
 *
 * Re-exports comprehensive optimistic medication hooks from domain mutations
 */

// Re-export all hooks from domain medications mutations
export {
  useOptimisticMedicationCreate,
  useOptimisticMedicationUpdate,
  useOptimisticMedicationDelete,
  useOptimisticPrescriptionCreate,
  useOptimisticPrescriptionDeactivate,
  useOptimisticMedicationAdministration,
  useOptimisticInventoryAdd,
  useOptimisticInventoryUpdate,
  useOptimisticAdverseReactionReport,
  useOptimisticMedications,
  medicationKeys,
} from './domains/medications/mutations/useOptimisticMedications';
