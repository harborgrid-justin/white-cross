/**
 * @fileoverview Validation Logic for Medication Administration
 *
 * Implements Zod schema validation for the Five Rights of Medication Administration.
 * Ensures all medication administrations meet safety and format requirements.
 *
 * @module validation
 */

import { z } from 'zod';
import type { AdministrationData, ValidationResult } from './types';

/**
 * Zod validation schema for medication administration data.
 *
 * Enforces the Five Rights protocol through strict validation rules:
 * - Right Patient: studentId required and non-empty
 * - Right Medication: medicationId required and non-empty
 * - Right Dose: dosage format validated with regex pattern
 * - Right Route: implied in dosage unit (mg, tablets, puffs, etc.)
 * - Right Time: administrationTime required and non-empty
 *
 * @constant
 * @type {z.ZodObject}
 *
 * @property {z.ZodString} studentId - Must be non-empty string identifying the patient
 * @property {z.ZodString} medicationId - Must be non-empty string identifying the medication
 * @property {z.ZodString} dosage - Must match format: number + space + unit (e.g., "5mg", "2 tablets")
 * @property {z.ZodString} administrationTime - Must be non-empty ISO timestamp or time string
 * @property {z.ZodString} notes - Optional additional notes for administration record
 *
 * @remarks Dosage regex pattern accepts common units: mg, ml, units, tablets, capsules, puffs, drops, tsp, tbsp
 */
export const administrationSchema = z.object({
  studentId: z.string().min(1, 'Student selection is required'),
  medicationId: z.string().min(1, 'Medication ID is required'),
  dosage: z.string().min(1, 'Dosage is required').regex(
    /^[0-9]+(\.[0-9]+)?\s*(mg|ml|units?|tablets?|capsules?|puffs?|drops?|tsp|tbsp)$/i,
    'Invalid dosage format. Examples: 5mg, 2 tablets, 1 puff'
  ),
  administrationTime: z.string().min(1, 'Administration time is required'),
  notes: z.string().optional(),
});

/**
 * Validates administration data against Zod schema.
 *
 * Performs comprehensive validation of all fields required for safe medication
 * administration according to the Five Rights protocol.
 *
 * ## Validation Rules
 *
 * - **studentId**: Must be non-empty string (Right Patient)
 * - **medicationId**: Must be non-empty string (Right Medication)
 * - **dosage**: Must match format "number unit" (e.g., "5mg", "2 tablets") (Right Dose)
 * - **administrationTime**: Must be non-empty string (Right Time)
 * - **notes**: Optional, no validation (additional documentation)
 *
 * ## Dosage Format Validation
 *
 * Dosage must match regex: `/^[0-9]+(\.[0-9]+)?\s*(mg|ml|units?|tablets?|capsules?|puffs?|drops?|tsp|tbsp)$/i`
 *
 * Valid examples:
 * - "5mg", "10.5mg", "100 mg"
 * - "2 tablets", "1 tablet"
 * - "3ml", "1.5 ml"
 * - "1 puff", "2 puffs"
 *
 * Invalid examples:
 * - "5" (missing unit)
 * - "mg 5" (wrong order)
 * - "five mg" (not numeric)
 *
 * @param {AdministrationData} data - Administration data to validate
 *
 * @returns {ValidationResult} Validation result with isValid flag and errors map
 *
 * @example
 * ```typescript
 * const validation = validateAdministration({
 *   studentId: 'student-123',
 *   medicationId: 'med-456',
 *   dosage: '10mg',
 *   administrationTime: '2025-10-26T14:30:00Z'
 * });
 *
 * if (validation.isValid) {
 *   console.log('Validation passed');
 * } else {
 *   console.error('Validation errors:', validation.errors);
 *   // { dosage: 'Invalid dosage format. Examples: 5mg, 2 tablets, 1 puff' }
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Handle validation errors in form
 * const handleFormValidation = (formData) => {
 *   const validation = validateAdministration(formData);
 *
 *   if (!validation.isValid) {
 *     // Set field-specific errors
 *     Object.entries(validation.errors).forEach(([field, message]) => {
 *       setFieldError(field, message);
 *     });
 *     return false;
 *   }
 *
 *   return true;
 * };
 * ```
 */
export const validateAdministration = (data: AdministrationData): ValidationResult => {
  try {
    administrationSchema.parse(data);
    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const field = err.path[0] as string;
        errors[field] = err.message;
      });
      return { isValid: false, errors };
    }
    return { isValid: false, errors: { general: 'Validation error' } };
  }
};
