/**
 * Medication Administration Errors
 *
 * Error classes for medication administration safety violations
 */

/**
 * Error thrown when medication safety verification fails.
 *
 * Indicates that one or more of the Five Rights verifications failed,
 * or other critical safety checks did not pass. This error should
 * HALT the administration process.
 *
 * @class MedicationSafetyError
 * @extends Error
 *
 * @property {string} name - Always 'MedicationSafetyError'
 * @property {string} message - Human-readable error summary
 * @property {string[]} errors - Array of specific safety violations
 *
 * @example
 * ```ts
 * throw new MedicationSafetyError(
 *   'Five Rights verification failed',
 *   ['Wrong patient barcode', 'Dose mismatch']
 * );
 * ```
 */
export class MedicationSafetyError extends Error {
  constructor(message: string, public errors: string[]) {
    super(message);
    this.name = 'MedicationSafetyError';
  }
}

/**
 * Error thrown when patient has allergy to medication but warning not acknowledged.
 *
 * Indicates patient has documented allergies to the medication or its components,
 * and the healthcare provider has not properly acknowledged the allergy warning.
 * This error should HALT the administration process.
 *
 * @class AllergyWarningError
 * @extends Error
 *
 * @property {string} name - Always 'AllergyWarningError'
 * @property {string} message - Human-readable error summary
 * @property {any[]} allergies - Array of patient's relevant allergies
 *
 * @safety This error indicates a CRITICAL safety issue. Administration must not
 * proceed without explicit physician override and documented clinical rationale.
 *
 * @example
 * ```ts
 * throw new AllergyWarningError(
 *   'Patient is allergic to Penicillin',
 *   [{ allergen: 'Penicillin', severity: 'severe', reaction: 'anaphylaxis' }]
 * );
 * ```
 */
export class AllergyWarningError extends Error {
  constructor(message: string, public allergies: any[]) {
    super(message);
    this.name = 'AllergyWarningError';
  }
}
