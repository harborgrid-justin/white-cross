/**
 * PHI (Protected Health Information) Detection Utilities
 *
 * Provides comprehensive PHI detection for HIPAA compliance.
 * Identifies PHI in form data, documents, and user input.
 *
 * **HIPAA Note**: All PHI access must be logged via audit system.
 *
 * @module lib/phi
 * @example
 * ```typescript
 * import { detectPHI, isPHIField, containsPHI } from '@/lib/phi';
 *
 * // Detect PHI in form data
 * const result = detectPHI({ firstName: 'John', ssn: '123-45-6789' });
 * console.log(result.hasPHI); // true
 * console.log(result.phiFields); // ['ssn']
 *
 * // Check if field name indicates PHI
 * isPHIField('socialSecurityNumber'); // true
 * isPHIField('email'); // true
 *
 * // Check if value contains PHI patterns
 * containsPHI('My SSN is 123-45-6789'); // true
 * ```
 */

// Type definitions
export type {
  PHIDetectionResult,
  PHIPatternType,
  PHIPattern,
  SensitivityLevel,
  PHIFieldDetail,
  PHIComplianceCheck,
} from './phi-types';

// Constants
export { PHI_FIELD_NAMES, PHI_PATTERNS, MEDICAL_KEYWORDS } from './phi-constants';

// Detection functions
export { isPHIField, containsPHI, detectPHI } from './phi-detection';

// Utility functions
export { getPHIFields, classifyDataSensitivity, filterPHI, validatePHICompliance } from './phi-utils';
