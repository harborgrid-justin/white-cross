/**
 * Medication Domain Types
 *
 * Core type definitions for medication management including prescriptions,
 * administration records, and form validation. These types support the Five Rights
 * of Medication Administration and HIPAA-compliant medication tracking.
 *
 * @module hooks/domains/medications/types/medications
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

// Re-export all types from modular files
export type {
  Medication,
  MedicationAdministration,
} from './medication-core';

export type {
  MedicationFormState,
  MedicationValidationErrors,
  FormErrors,
  UseFormValidationReturn,
  UseToastReturn,
} from './medication-forms';

export type {
  InventoryFormData,
  AdverseReactionFormData,
} from './medication-inventory';
