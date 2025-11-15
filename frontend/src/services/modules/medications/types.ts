/**
 * @fileoverview Medication Management Types and Interfaces
 *
 * Comprehensive type definitions for medication management including medication
 * formulations, student assignments, administration logging, inventory tracking,
 * and adverse reaction reporting. All types support HIPAA-compliant PHI protection
 * and DEA-compliant controlled substance handling.
 *
 * **Key Type Categories:**
 * - Core medication and formulation types
 * - Student medication assignment types
 * - Administration logging and Five Rights types
 * - Inventory management and tracking types
 * - Adverse reaction and safety types
 * - Scheduling and reminder types
 * - Form options and validation types
 *
 * @module services/modules/medications/types
 */

import {
  Medication,
  StudentMedication,
  InventoryItem,
  MedicationReminder,
  AdverseReaction,
  MedicationFormData,
  StudentMedicationFormData,
  AdverseReactionFormData
} from '../../../types/api';
import {
  MedicationLog,
  MedicationAdministrationData,
  AdverseReactionData,
  MedicationsResponse,
  StudentMedicationsResponse,
  InventoryResponse,
  MedicationStats,
  MedicationAlertsResponse,
  MedicationFormOptions,
  MedicationScheduleResponse
} from '../../../types/domain/medications';

// Re-export core types for convenience
export type {
  Medication,
  StudentMedication,
  InventoryItem,
  MedicationReminder,
  AdverseReaction,
  MedicationFormData,
  StudentMedicationFormData,
  AdverseReactionFormData,
  MedicationLog,
  MedicationAdministrationData,
  AdverseReactionData,
  MedicationsResponse,
  StudentMedicationsResponse,
  InventoryResponse,
  MedicationStats,
  MedicationAlertsResponse,
  MedicationFormOptions,
  MedicationScheduleResponse
};

/**
 * Medication filtering and pagination options
 *
 * @interface MedicationFilters
 *
 * @property {string} [search] - Text search across medication name, generic name, and NDC
 * @property {string} [category] - Medication category (e.g., "Analgesic", "Antibiotic")
 * @property {boolean} [isActive] - Filter by active/inactive status
 * @property {boolean} [controlledSubstance] - Filter DEA-scheduled controlled substances
 * @property {number} [page] - Page number for pagination (1-indexed)
 * @property {number} [limit] - Results per page (default: 20, max: 100)
 * @property {string} [sort] - Sort field (name, createdAt, updatedAt)
 * @property {'asc' | 'desc'} [order] - Sort direction
 */
export interface MedicationFilters {
  search?: string;
  category?: string;
  type?: string; // Add type filter for OTC, prescription, etc.
  isActive?: boolean;
  controlledSubstance?: boolean;
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

/**
 * Request data for creating a new medication in the formulary
 *
 * @interface CreateMedicationRequest
 *
 * @property {string} name - Medication brand/trade name
 * @property {string} [genericName] - Generic/chemical name
 * @property {string} dosageForm - Dosage form (tablet, capsule, liquid, etc.)
 * @property {string} strength - Strength with units (e.g., "500mg", "10mg/ml")
 * @property {string} [manufacturer] - Manufacturer name
 * @property {string} [ndc] - National Drug Code (format: XXXXX-XXXX-XX)
 * @property {boolean} [isControlled] - True if DEA-scheduled controlled substance
 * @property {DEASchedule} [deaSchedule] - DEA schedule for controlled substances
 */
export interface CreateMedicationRequest {
  name: string;
  genericName?: string;
  dosageForm: string;
  strength: string;
  manufacturer?: string;
  ndc?: string;
  isControlled?: boolean;
  deaSchedule?: DEASchedule;
}

/**
 * Request data for adding medication to inventory
 *
 * @interface CreateInventoryRequest
 *
 * @property {string} medicationId - UUID of medication in formulary
 * @property {string} batchNumber - Manufacturer batch/lot number
 * @property {string} expirationDate - Expiration date (ISO 8601)
 * @property {number} quantity - Initial quantity in stock
 * @property {number} [reorderLevel] - Quantity threshold for reorder alerts
 * @property {number} [costPerUnit] - Cost per unit for budget tracking
 * @property {string} [supplier] - Supplier/distributor name
 */
export interface CreateInventoryRequest {
  medicationId: string;
  batchNumber: string;
  expirationDate: string;
  quantity: number;
  reorderLevel?: number;
  costPerUnit?: number;
  supplier?: string;
}

/**
 * Request data for updating inventory quantity
 *
 * @interface UpdateInventoryRequest
 *
 * @property {number} quantity - New quantity (replaces current quantity)
 * @property {string} [reason] - Reason for adjustment (for audit trail)
 */
export interface UpdateInventoryRequest {
  quantity: number;
  reason?: string;
}

/**
 * Valid dosage forms recognized by the system
 *
 * @typedef {ReadonlyArray<string>} DosageForms
 */
export const DOSAGE_FORMS = [
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
  'Lozenge'
] as const;

export type DosageForm = typeof DOSAGE_FORMS[number];

/**
 * Valid administration routes
 *
 * @typedef {ReadonlyArray<string>} AdministrationRoutes
 */
export const ADMINISTRATION_ROUTES = [
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
  'Transdermal'
] as const;

export type AdministrationRoute = typeof ADMINISTRATION_ROUTES[number];

/**
 * DEA Schedules for controlled substances
 *
 * - Schedule I: High abuse potential, no accepted medical use
 * - Schedule II: High abuse potential, accepted medical use (morphine, oxycodone)
 * - Schedule III: Moderate abuse potential (codeine, ketamine)
 * - Schedule IV: Low abuse potential (alprazolam, diazepam)
 * - Schedule V: Lowest abuse potential (cough preparations with codeine)
 *
 * @typedef {ReadonlyArray<string>} DEASchedules
 */
export const DEA_SCHEDULES = ['I', 'II', 'III', 'IV', 'V'] as const;

export type DEASchedule = typeof DEA_SCHEDULES[number];

/**
 * Adverse reaction severity levels
 *
 * @typedef {ReadonlyArray<string>} AdverseReactionSeverityLevels
 */
export const ADVERSE_REACTION_SEVERITY_LEVELS = [
  'MILD',
  'MODERATE', 
  'SEVERE',
  'LIFE_THREATENING'
] as const;

export type AdverseReactionSeverity = typeof ADVERSE_REACTION_SEVERITY_LEVELS[number];

/**
 * Medication frequency patterns for validation
 *
 * Supports common medical frequency notations including:
 * - Daily frequencies: "once daily", "twice daily", "1x daily", "2x daily"
 * - Numeric frequencies: "three times daily", "four times a day"
 * - Hourly intervals: "every 4 hours", "every 6 hrs"
 * - Medical abbreviations: "QID", "TID", "BID", "QD", "QHS", "PRN", "AC", "PC", "HS"
 * - As needed: "as needed"
 * - Meal-related: "before meals", "after breakfast", "at bedtime"
 * - Long-term: "weekly", "monthly"
 */
export const FREQUENCY_PATTERNS = [
  /^(once|twice|1x|2x|3x|4x)\s*(daily|per day)$/i,
  /^(three|four|five|six)\s*times\s*(daily|per day|a day)$/i,
  /^every\s+[0-9]+\s+(hour|hours|hr|hrs)$/i,
  /^(q[0-9]+h|qid|tid|bid|qd|qhs|prn|ac|pc|hs)$/i,
  /^as\s+needed$/i,
  /^before\s+(meals|breakfast|lunch|dinner|bedtime)$/i,
  /^after\s+(meals|breakfast|lunch|dinner)$/i,
  /^at\s+bedtime$/i,
  /^weekly$/i,
  /^monthly$/i,
];

/**
 * NDC (National Drug Code) Format Validation
 *
 * Validates 10-digit NDC in 5-4-2 or 5-3-2 format.
 * Examples: "12345-1234-12" or "12345-123-12"
 */
export const NDC_REGEX = /^[0-9]{5}-([0-9]{3,4})-[0-9]{2}$/;

/**
 * Dosage format validation
 *
 * Validates dosage strings with numeric value and unit.
 * Supports: mg, g, mcg, ml, L, units, tablets, capsules, drops, puff, patch, spray, application, mEq, %
 *
 * Examples: "500mg", "10ml", "2 tablets", "1 unit"
 */
export const DOSAGE_REGEX = /^[0-9]+(\.[0-9]+)?\s*(mg|g|mcg|ml|L|units?|tablets?|capsules?|drops?|puff|patch|spray|application|mEq|%)$/i;

/**
 * Strength format validation
 *
 * Validates medication strength with numeric value and unit.
 * Examples: "500mg", "10ml", "50mcg", "100units", "5mEq"
 */
export const STRENGTH_REGEX = /^[0-9]+(\.[0-9]+)?\s*(mg|g|mcg|ml|L|units?|mEq|%)$/i;

/**
 * Frequency validator function
 *
 * Validates medication frequency against supported patterns.
 *
 * @param {string} value - Frequency string to validate
 * @returns {boolean} True if frequency matches a valid pattern
 */
export function validateFrequency(value: string): boolean {
  const normalizedValue = value.trim().toLowerCase();
  return FREQUENCY_PATTERNS.some(pattern => pattern.test(normalizedValue));
}

/**
 * Validates NDC format
 *
 * @param {string} ndc - NDC string to validate
 * @returns {boolean} True if NDC is in valid format
 */
export function validateNDC(ndc: string): boolean {
  return NDC_REGEX.test(ndc);
}

/**
 * Validates dosage format
 *
 * @param {string} dosage - Dosage string to validate
 * @returns {boolean} True if dosage is in valid format
 */
export function validateDosage(dosage: string): boolean {
  return DOSAGE_REGEX.test(dosage);
}

/**
 * Validates strength format
 *
 * @param {string} strength - Strength string to validate
 * @returns {boolean} True if strength is in valid format
 */
export function validateStrength(strength: string): boolean {
  return STRENGTH_REGEX.test(strength);
}

/**
 * Type guard for dosage forms
 *
 * @param {string} value - Value to check
 * @returns {boolean} True if value is a valid dosage form
 */
export function isDosageForm(value: string): value is DosageForm {
  return DOSAGE_FORMS.includes(value as DosageForm);
}

/**
 * Type guard for administration routes
 *
 * @param {string} value - Value to check
 * @returns {boolean} True if value is a valid administration route
 */
export function isAdministrationRoute(value: string): value is AdministrationRoute {
  return ADMINISTRATION_ROUTES.includes(value as AdministrationRoute);
}

/**
 * Type guard for DEA schedules
 *
 * @param {string} value - Value to check
 * @returns {boolean} True if value is a valid DEA schedule
 */
export function isDEASchedule(value: string): value is DEASchedule {
  return DEA_SCHEDULES.includes(value as DEASchedule);
}

/**
 * Type guard for adverse reaction severity
 *
 * @param {string} value - Value to check
 * @returns {boolean} True if value is a valid adverse reaction severity
 */
export function isAdverseReactionSeverity(value: string): value is AdverseReactionSeverity {
  return ADVERSE_REACTION_SEVERITY_LEVELS.includes(value as AdverseReactionSeverity);
}
