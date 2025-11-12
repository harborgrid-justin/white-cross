/**
 * PHI (Protected Health Information) Utility Functions
 *
 * Utility functions for PHI handling, filtering, and compliance.
 *
 * @module lib/phi-utils
 */

import type { SensitivityLevel, PHIComplianceCheck } from './phi-types';
import { detectPHI } from './phi-detection';
import { isPHIField } from './phi-detection';

/**
 * Form schema field definition
 */
interface FormField {
  name: string;
  type?: string;
  isPHI?: boolean;
  [key: string]: unknown;
}

/**
 * Form schema with field definitions
 */
interface FormSchema {
  fields?: FormField[];
  [key: string]: unknown;
}

/**
 * Get PHI fields from form schema
 *
 * Extracts fields that are marked as PHI or have PHI-indicating names.
 *
 * @param schema - Form schema with field definitions
 * @returns Array of PHI field names
 *
 * @example
 * ```typescript
 * const schema = {
 *   fields: [
 *     { name: 'firstName', type: 'text' },
 *     { name: 'ssn', type: 'text', isPHI: true },
 *     { name: 'email', type: 'email' }
 *   ]
 * };
 *
 * const phiFields = getPHIFields(schema);
 * // ['ssn', 'email']
 * ```
 */
export function getPHIFields(schema: FormSchema): string[] {
  const phiFields: string[] = [];

  if (!schema || !schema.fields) {
    return phiFields;
  }

  for (const field of schema.fields) {
    if (field.isPHI || isPHIField(field.name)) {
      phiFields.push(field.name);
    }
  }

  return phiFields;
}

/**
 * Classify data sensitivity
 *
 * Determines the overall sensitivity level of data.
 *
 * @param data - Data to classify
 * @returns Sensitivity level
 *
 * @example
 * ```typescript
 * const level = classifyDataSensitivity({
 *   name: 'John Doe',
 *   ssn: '123-45-6789'
 * });
 * // 'restricted'
 * ```
 */
export function classifyDataSensitivity(data: Record<string, unknown>): SensitivityLevel {
  const result = detectPHI(data);
  return result.sensitivityLevel;
}

/**
 * Filter PHI from data object
 *
 * Creates a copy of data with PHI fields removed or masked.
 *
 * @param data - Data to filter
 * @param options - Filtering options
 * @returns Filtered data object
 *
 * @example
 * ```typescript
 * const filtered = filterPHI({
 *   name: 'John',
 *   ssn: '123-45-6789',
 *   email: 'john@example.com',
 *   notes: 'Patient notes'
 * }, { mask: true });
 * // { name: 'John', ssn: '[REDACTED]', email: '[REDACTED]', notes: '[REDACTED]' }
 * ```
 */
export function filterPHI(
  data: Record<string, unknown>,
  options: { remove?: boolean; mask?: boolean } = { mask: true }
): Record<string, unknown> {
  const result = detectPHI(data);

  if (!result.hasPHI) {
    return { ...data };
  }

  const filtered = { ...data };

  for (const fieldPath of result.phiFields) {
    const keys = fieldPath.split('.');
    let current: Record<string, unknown> = filtered;

    // Navigate to the field
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) break;
      current = current[keys[i]] as Record<string, unknown>;
    }

    const lastKey = keys[keys.length - 1];

    if (options.remove) {
      delete current[lastKey];
    } else if (options.mask) {
      current[lastKey] = '[REDACTED]';
    }
  }

  return filtered;
}

/**
 * PHI compliance validation context
 */
interface PHIComplianceContext {
  isEncrypted?: boolean;
  isAuditLogged?: boolean;
  hasUserConsent?: boolean;
  purpose?: string;
}

/**
 * Validate PHI handling compliance
 *
 * Checks if PHI is being handled according to HIPAA requirements.
 *
 * @param data - Data to validate
 * @param context - Context information
 * @returns Validation result
 *
 * @example
 * ```typescript
 * const result = validatePHICompliance(
 *   { ssn: '123-45-6789' },
 *   { isEncrypted: true, isAuditLogged: true, hasUserConsent: true, purpose: 'patient intake' }
 * );
 * console.log(result.compliant); // true
 * ```
 */
export function validatePHICompliance(
  data: Record<string, unknown>,
  context: PHIComplianceContext
): PHIComplianceCheck {
  const result = detectPHI(data);
  const issues: string[] = [];
  const recommendations: string[] = [];

  if (!result.hasPHI) {
    return {
      compliant: true,
      issues: [],
      recommendations: [],
    };
  }

  // Check encryption
  if (!context.isEncrypted) {
    issues.push('PHI data is not encrypted');
    recommendations.push('Encrypt PHI data before storage or transmission');
  }

  // Check audit logging
  if (!context.isAuditLogged) {
    issues.push('PHI access is not being logged');
    recommendations.push('Log all PHI access to audit system');
  }

  // Check user consent
  if (!context.hasUserConsent) {
    issues.push('User consent not verified');
    recommendations.push('Verify user consent before accessing PHI');
  }

  // Check purpose
  if (!context.purpose) {
    issues.push('Purpose of PHI access not specified');
    recommendations.push('Specify and document purpose of PHI access');
  }

  return {
    compliant: issues.length === 0,
    issues,
    recommendations,
  };
}
