/**
 * Medications Domain - Central Export Hub
 * 
 * Enterprise hook architecture for medication management with HIPAA compliance
 * and pharmaceutical safety validations.
 */

// Configuration exports
export * from './config';

// Query Hooks
export { useMedicationsData } from './queries/useMedicationsData';
export * from './queries/useMedicationFormulary';

// Mutation Hooks
export { useMedicationAdministration } from './mutations/useMedicationAdministration';
export { useMedicationFormValidation } from './mutations/useMedicationFormValidation';
export { useOptimisticMedications } from './mutations/useOptimisticMedications';
export * from './mutations/useMedicationAdministrationService';