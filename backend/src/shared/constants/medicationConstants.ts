/**
 * Medication Constants - Centralized medication form options and categories
 *
 * This file consolidates medication-related constants that were previously duplicated
 * across medicationService.ts and medication/medicationCrudService.ts
 *
 * LOC: MED-CONST-001
 * Last Updated: 2025-10-23
 */

/**
 * Standard medication dosage forms
 */
export const MEDICATION_DOSAGE_FORMS = [
  'Tablet',
  'Capsule',
  'Liquid',
  'Injection',
  'Topical',
  'Inhaler',
  'Drops',
  'Patch',
  'Suppository',
  'Powder',
  'Cream',
  'Ointment',
  'Gel',
  'Spray',
  'Lozenge',
] as const;

/**
 * Standard medication categories
 */
export const MEDICATION_CATEGORIES = [
  'Analgesic',
  'Antibiotic',
  'Antihistamine',
  'Anti-inflammatory',
  'Asthma Medication',
  'Diabetic Medication',
  'Cardiovascular',
  'Gastrointestinal',
  'Neurological',
  'Dermatological',
  'Ophthalmic',
  'Otic',
  'Emergency Medication',
  'Vitamin/Supplement',
  'Other',
] as const;

/**
 * Common medication strength units
 */
export const MEDICATION_STRENGTH_UNITS = [
  'mg',
  'g',
  'mcg',
  'ml',
  'units',
  'mEq',
  '%',
] as const;

/**
 * Medication administration routes
 */
export const MEDICATION_ROUTES = [
  'Oral',
  'Sublingual',
  'Topical',
  'Intravenous',
  'Intramuscular',
  'Subcutaneous',
  'Inhalation',
  'Ophthalmic',
  'Otic',
  'Nasal',
  'Rectal',
  'Transdermal',
] as const;

/**
 * Standard medication frequencies
 */
export const MEDICATION_FREQUENCIES = [
  'Once daily',
  'Twice daily',
  'Three times daily',
  'Four times daily',
  'Every 4 hours',
  'Every 6 hours',
  'Every 8 hours',
  'Every 12 hours',
  'As needed',
  'Before meals',
  'After meals',
  'At bedtime',
  'Weekly',
  'Monthly',
] as const;

/**
 * TypeScript types derived from constants
 */
export type MedicationDosageForm = (typeof MEDICATION_DOSAGE_FORMS)[number];
export type MedicationCategory = (typeof MEDICATION_CATEGORIES)[number];
export type MedicationStrengthUnit = (typeof MEDICATION_STRENGTH_UNITS)[number];
export type MedicationRoute = (typeof MEDICATION_ROUTES)[number];
export type MedicationFrequency = (typeof MEDICATION_FREQUENCIES)[number];

/**
 * Combined medication form options interface
 */
export interface MedicationFormOptions {
  dosageForms: readonly string[];
  categories: readonly string[];
  strengthUnits: readonly string[];
  routes: readonly string[];
  frequencies: readonly string[];
}

/**
 * Get all medication form options in a single object
 * This replaces the getMedicationFormOptions() method that was duplicated in services
 */
export const getMedicationFormOptions = (): MedicationFormOptions => ({
  dosageForms: MEDICATION_DOSAGE_FORMS,
  categories: MEDICATION_CATEGORIES,
  strengthUnits: MEDICATION_STRENGTH_UNITS,
  routes: MEDICATION_ROUTES,
  frequencies: MEDICATION_FREQUENCIES,
});
