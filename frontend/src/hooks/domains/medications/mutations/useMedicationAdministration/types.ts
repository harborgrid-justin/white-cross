/**
 * @fileoverview Type Definitions for Medication Administration
 *
 * Contains all TypeScript interfaces and types for safe medication administration.
 * Part of the Five Rights of Medication Administration protocol implementation.
 *
 * @module types
 */

/**
 * Data structure for medication administration request.
 *
 * Contains all required information to safely administer medication following
 * the Five Rights protocol. All fields are validated before submission.
 *
 * @interface AdministrationData
 *
 * @property {string} studentId - Unique identifier for the patient/student receiving medication.
 *                                 Must correspond to a valid student record in the system.
 *                                 **Five Rights: Right Patient**
 *
 * @property {string} medicationId - Unique identifier for the medication being administered.
 *                                   Must correspond to a valid medication record.
 *                                   **Five Rights: Right Medication**
 *
 * @property {string} dosage - Dosage amount with units in format "number unit" (e.g., "5mg", "2 tablets").
 *                             Must match the prescribed dosage and include proper units.
 *                             Supported units: mg, ml, units, tablets, capsules, puffs, drops, tsp, tbsp
 *                             **Five Rights: Right Dose**
 *
 * @property {string} administrationTime - ISO timestamp or time string when medication is administered.
 *                                         Should be close to scheduled administration time.
 *                                         **Five Rights: Right Time**
 *
 * @property {string} [notes] - Optional notes about the administration (e.g., "Patient complained of nausea").
 *                              Notes are included in audit trail for compliance and safety monitoring.
 *
 * @example
 * ```typescript
 * const administrationData: AdministrationData = {
 *   studentId: 'student-12345',
 *   medicationId: 'med-67890',
 *   dosage: '10mg',
 *   administrationTime: '2025-10-26T14:30:00Z',
 *   notes: 'Administered with food as prescribed'
 * };
 * ```
 *
 * @audit All AdministrationData submissions create audit log entries via medicationsApi.logAdministration()
 */
export interface AdministrationData {
  studentId: string;
  medicationId: string;
  dosage: string;
  administrationTime: string;
  notes?: string;
}

/**
 * Validation result returned by validateAdministration function.
 *
 * @interface ValidationResult
 *
 * @property {boolean} isValid - True if all fields pass validation
 * @property {Record<string, string>} errors - Map of field names to error messages.
 *                                              Empty object if validation passes.
 */
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Return type for the useMedicationAdministration hook.
 *
 * Provides methods and state for medication administration workflow with
 * comprehensive validation and safety checks.
 *
 * @interface UseMedicationAdministrationReturn
 *
 * @property {function(AdministrationData): Promise<void>} administerMedication
 *           Primary method to administer medication. Validates data, calls backend API,
 *           invalidates queries, and shows toast notifications.
 *
 *           **Workflow:**
 *           1. Validates AdministrationData using validateAdministration()
 *           2. Calls medicationsApi.logAdministration() with formatted data
 *           3. On success: invalidates queries and shows success toast
 *           4. On error: shows error toast and re-throws error
 *
 *           @param {AdministrationData} data - Validated administration data
 *           @returns {Promise<void>} Resolves on successful administration
 *           @throws {Error} If validation fails or API call fails
 *
 * @property {boolean} isAdministering
 *           Loading state indicator. True while API call is in progress.
 *           Use this to disable UI elements during administration.
 *
 * @property {function(AdministrationData): ValidationResult} validateAdministration
 *           Validates administration data against Zod schema.
 *
 *           @param {AdministrationData} data - Data to validate
 *           @returns {ValidationResult} Validation result with isValid flag and errors map
 *
 * @example
 * ```tsx
 * const { administerMedication, isAdministering, validateAdministration } = useMedicationAdministration();
 *
 * // Validate before submission
 * const validation = validateAdministration(formData);
 * if (!validation.isValid) {
 *   setFieldErrors(validation.errors);
 *   return;
 * }
 *
 * // Administer with loading state
 * try {
 *   await administerMedication(formData);
 * } catch (error) {
 *   // Error already shown via toast
 * }
 * ```
 */
export interface UseMedicationAdministrationReturn {
  administerMedication: (data: AdministrationData) => Promise<void>;
  isAdministering: boolean;
  validateAdministration: (data: AdministrationData) => ValidationResult;
}
