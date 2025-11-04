/**
 * Medication Administration Module
 *
 * Barrel exports for medication administration hooks and utilities
 */

// Constants
export { administrationKeys } from './constants';

// Errors
export { MedicationSafetyError, AllergyWarningError } from './errors';

// Types
export type { UseMedicationAdministrationReturn } from './types';

// Validation
export { isValidDose, isWithinAdministrationWindow } from './validation';

// Hooks
export { useAdministrationHistory, useStudentSchedule } from './hooks';

// Main hook
export { useMedicationAdministration } from './useMedicationAdministrationService';
