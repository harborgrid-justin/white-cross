/**
 * @fileoverview Medication Safety Type Definitions
 *
 * Type definitions and interfaces for medication safety validation.
 * These types support the Five Rights of Medication Administration protocol
 * and comprehensive safety checking.
 *
 * @module medicationSafetyTypes
 *
 * @compliance DEA - Drug Enforcement Administration: Safety checks for controlled substances
 * @compliance FDA - Food and Drug Administration: Follows FDA medication safety guidelines
 * @compliance HIPAA - Health Insurance Portability and Accountability Act: All safety checks create audit logs
 * @compliance Joint Commission - Meets medication management safety standards (MM.01.01.03)
 */

/**
 * Result of a comprehensive medication safety check.
 *
 * Contains all safety validation results including allergy status, drug interactions,
 * duplicate medications, and detailed warnings for healthcare staff review.
 *
 * ## Safety Check Priority
 *
 * Safety flags should be evaluated in order of criticality:
 * 1. **isAllergic** (CRITICAL) - Must halt administration immediately
 * 2. **hasInteractions** (HIGH) - Requires physician review or acknowledgment
 * 3. **isDuplicate** (MODERATE) - Requires verification before proceeding
 *
 * @interface MedicationSafetyCheck
 *
 * @property {boolean} isAllergic - True if patient has documented allergy to this medication
 *                                   or related compounds (cross-sensitivity).
 *                                   **CRITICAL**: MUST halt administration immediately.
 *                                   Requires physician review and allergy override documentation.
 *
 * @property {boolean} hasInteractions - True if medication has known interactions with patient's
 *                                       current medications. Severity varies from minor to severe.
 *                                       Requires review of warnings array for interaction details
 *                                       and clinical significance assessment.
 *
 * @property {boolean} isDuplicate - True if patient is already taking this medication or a
 *                                   therapeutic equivalent. May indicate duplicate prescription,
 *                                   order entry error, or intentional duplicate therapy.
 *                                   Requires verification before proceeding.
 *
 * @property {string[]} warnings - Array of human-readable safety warnings and contraindications.
 *                                 Each warning should include:
 *                                 - Severity level (CRITICAL, HIGH, MODERATE, LOW)
 *                                 - Specific safety concern
 *                                 - Recommended action
 *                                 - Clinical significance
 *
 * @example
 * ```typescript
 * const safetyCheck: MedicationSafetyCheck = {
 *   isAllergic: true,
 *   hasInteractions: false,
 *   isDuplicate: false,
 *   warnings: [
 *     'CRITICAL: Patient has documented severe allergy to Penicillin. Do not administer.',
 *     'CROSS-SENSITIVITY: Patient may be allergic to other beta-lactam antibiotics.'
 *   ]
 * };
 *
 * if (safetyCheck.isAllergic) {
 *   // HALT administration immediately
 *   notifyPhysician();
 *   documentAllergyAttempt();
 *   return;
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Drug interaction example
 * const safetyCheck: MedicationSafetyCheck = {
 *   isAllergic: false,
 *   hasInteractions: true,
 *   isDuplicate: false,
 *   warnings: [
 *     'HIGH: Warfarin + Aspirin interaction. Increased bleeding risk.',
 *     'MODERATE: Monitor INR levels closely. May require warfarin dose adjustment.'
 *   ]
 * };
 *
 * if (safetyCheck.hasInteractions) {
 *   // Require physician acknowledgment
 *   const confirmed = await requestPhysicianReview(safetyCheck.warnings);
 *   if (!confirmed) return;
 * }
 * ```
 *
 * @audit All safety check results should be logged to audit trail with timestamp and staff ID
 */
export interface MedicationSafetyCheck {
  isAllergic: boolean;
  hasInteractions: boolean;
  isDuplicate: boolean;
  warnings: string[];
}

/**
 * Severity levels for medication safety warnings.
 *
 * Used to classify the clinical significance and urgency of safety concerns.
 *
 * @enum {string}
 */
export enum SafetySeverity {
  /** Absolute contraindication - must halt administration */
  CRITICAL = 'CRITICAL',

  /** Significant risk - requires physician review */
  HIGH = 'HIGH',

  /** Moderate risk - requires nurse acknowledgment */
  MODERATE = 'MODERATE',

  /** Low risk - informational only */
  LOW = 'LOW',

  /** Severity unknown or not documented */
  UNKNOWN = 'UNKNOWN'
}

/**
 * Allergy severity classification.
 *
 * @enum {string}
 */
export enum AllergySeverity {
  /** Life-threatening reactions (anaphylaxis, Stevens-Johnson syndrome) */
  SEVERE = 'SEVERE',

  /** Significant reactions requiring medical intervention */
  MODERATE = 'MODERATE',

  /** Minor reactions (rash, nausea) requiring monitoring */
  MILD = 'MILD',

  /** Allergy documented but severity not recorded */
  UNKNOWN = 'UNKNOWN'
}

/**
 * Drug interaction severity classification.
 *
 * @enum {string}
 */
export enum InteractionSeverity {
  /** Life-threatening or requires immediate intervention */
  SEVERE = 'SEVERE',

  /** May cause serious clinical consequences */
  MAJOR = 'MAJOR',

  /** May require monitoring or dose adjustment */
  MODERATE = 'MODERATE',

  /** Minimal clinical significance */
  MINOR = 'MINOR'
}
