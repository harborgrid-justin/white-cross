/**
 * @fileoverview Medication Administration Module - Barrel Exports
 *
 * Provides centralized exports for all medication administration functionality.
 *
 * @module useMedicationAdministration
 */

export { useMedicationAdministration } from './core';
export { validateAdministration, administrationSchema } from './validation';
export type {
  AdministrationData,
  ValidationResult,
  UseMedicationAdministrationReturn
} from './types';
