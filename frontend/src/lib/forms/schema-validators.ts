/**
 * Schema Validators
 *
 * Validation utilities for form data and healthcare-specific field types.
 * Provides high-level validation functions and healthcare data validators.
 *
 * @module lib/forms/schema-validators
 * @example
 * ```typescript
 * import { validateFormData, addHealthcareValidation } from '@/lib/forms/schema-validators';
 *
 * const result = validateFormData(
 *   { firstName: 'John', email: 'invalid' },
 *   fields
 * );
 *
 * if (!result.success) {
 *   console.log('Errors:', result.errors);
 * }
 * ```
 */

import { type ZodTypeAny } from 'zod';
import type { FormField } from './types';
import { PATTERNS, ERROR_MESSAGES } from './schema-constants';
import { generateZodSchema } from './schema-generators';

/**
 * Form validation result
 */
export interface ValidationResult {
  /** Whether validation succeeded */
  success: boolean;
  /** Validated data (only present if success is true) */
  data?: Record<string, unknown>;
  /** Validation errors by field path (only present if success is false) */
  errors?: Record<string, string[]>;
}

/**
 * Add healthcare-specific validation
 *
 * Adds custom validators for healthcare data types (ICD-10, NDC, NPI).
 *
 * @param field - Field definition
 * @param schema - Base Zod schema
 * @returns Schema with healthcare validation
 *
 * @example
 * ```typescript
 * let schema = z.string();
 * schema = addHealthcareValidation(
 *   {
 *     id: 'icd10',
 *     name: 'icd10',
 *     type: 'text',
 *     label: 'ICD-10 Code',
 *     metadata: { healthcareType: 'icd10' }
 *   },
 *   schema
 * );
 * ```
 */
export function addHealthcareValidation(
  field: FormField,
  schema: ZodTypeAny
): ZodTypeAny {
  const healthcareType = field.metadata?.healthcareType;

  if (!healthcareType) {
    return schema;
  }

  switch (healthcareType) {
    case 'icd10':
      return schema.refine(val => PATTERNS.icd10.test(String(val)), {
        message: ERROR_MESSAGES.icd10,
      });

    case 'ndc':
      return schema.refine(val => PATTERNS.ndc.test(String(val)), {
        message: ERROR_MESSAGES.ndc,
      });

    case 'npi':
      return schema.refine(val => PATTERNS.npi.test(String(val)), {
        message: ERROR_MESSAGES.npi,
      });

    default:
      return schema;
  }
}

/**
 * Validate form data against schema
 *
 * Helper function for validating form submissions.
 * Generates a Zod schema from field definitions and validates the data.
 *
 * @param data - Form data to validate
 * @param fields - Form field definitions
 * @returns Validation result with data or errors
 *
 * @example
 * ```typescript
 * const result = validateFormData(
 *   { firstName: 'John', email: 'invalid' },
 *   fields
 * );
 *
 * if (!result.success) {
 *   console.log('Errors:', result.errors);
 *   // Errors: { email: ['Please enter a valid email address'] }
 * }
 * ```
 */
export function validateFormData(
  data: Record<string, unknown>,
  fields: FormField[]
): ValidationResult {
  const schema = generateZodSchema(fields);
  const result = schema.safeParse(data);

  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  }

  const errors: Record<string, string[]> = {};

  for (const issue of result.error.issues) {
    const path = issue.path.join('.');
    if (!errors[path]) {
      errors[path] = [];
    }
    errors[path].push(issue.message);
  }

  return {
    success: false,
    errors,
  };
}
