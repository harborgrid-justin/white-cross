/**
 * PHI (Protected Health Information) Detection Logic
 *
 * Core detection functions for identifying PHI in data.
 *
 * @module lib/phi-detection
 */

import type {
  PHIDetectionResult,
  PHIPattern,
  PHIPatternType,
  SensitivityLevel,
  PHIFieldDetail,
} from './phi-types';
import { PHI_FIELD_NAMES, PHI_PATTERNS, MEDICAL_KEYWORDS } from './phi-constants';

/**
 * Check if field name indicates PHI
 *
 * Uses semantic analysis to detect PHI fields based on naming patterns.
 *
 * @param fieldName - Field name to check
 * @returns true if field name indicates PHI
 *
 * @example
 * ```typescript
 * isPHIField('socialSecurityNumber'); // true
 * isPHIField('email'); // true
 * isPHIField('name'); // false
 * isPHIField('userName'); // false
 * ```
 */
export function isPHIField(fieldName: string): boolean {
  const normalized = fieldName.toLowerCase().replace(/[-_\s]/g, '');

  // Check against known PHI field names
  const phiFieldsArray = Array.from(PHI_FIELD_NAMES);
  for (const phiField of phiFieldsArray) {
    const normalizedPHI = phiField.toLowerCase().replace(/[-_\s]/g, '');
    if (normalized === normalizedPHI || normalized.includes(normalizedPHI)) {
      return true;
    }
  }

  // Check for medical terminology in field name
  const keywordsArray = Array.from(MEDICAL_KEYWORDS);
  for (const keyword of keywordsArray) {
    if (normalized.includes(keyword.toLowerCase())) {
      return true;
    }
  }

  return false;
}

/**
 * Check if value contains PHI patterns
 *
 * Performs pattern-based detection for common PHI types.
 *
 * @param value - Value to check (string or number)
 * @returns true if value contains PHI patterns
 *
 * @example
 * ```typescript
 * containsPHI('My SSN is 123-45-6789'); // true
 * containsPHI('Call me at (555) 123-4567'); // true
 * containsPHI('Hello world'); // false
 * ```
 */
export function containsPHI(value: unknown): boolean {
  if (typeof value !== 'string' && typeof value !== 'number') {
    return false;
  }

  const str = String(value);

  // Check each PHI pattern
  for (const [type, pattern] of Object.entries(PHI_PATTERNS)) {
    if (type === 'custom') continue; // Skip custom pattern

    if (pattern.test(str)) {
      return true;
    }
  }

  return false;
}

/**
 * Detect PHI patterns in string value
 *
 * Returns all detected PHI patterns with confidence scores.
 *
 * @param value - Value to analyze
 * @param fieldPath - Field path for tracking
 * @returns Array of detected PHI patterns
 */
function detectPatterns(value: unknown, fieldPath: string): PHIPattern[] {
  if (typeof value !== 'string' && typeof value !== 'number') {
    return [];
  }

  const str = String(value);
  const patterns: PHIPattern[] = [];

  for (const [type, regex] of Object.entries(PHI_PATTERNS)) {
    if (type === 'custom') continue;

    const matchesArray = Array.from(str.matchAll(regex));

    for (const match of matchesArray) {
      patterns.push({
        type: type as PHIPatternType,
        value: match[0],
        fieldPath,
        confidence: calculateConfidence(type as PHIPatternType, match[0]),
      });
    }
  }

  return patterns;
}

/**
 * Calculate confidence score for pattern match
 *
 * @param type - Pattern type
 * @param value - Matched value
 * @returns Confidence score (0-1)
 */
function calculateConfidence(type: PHIPatternType, value: string): number {
  switch (type) {
    case 'ssn':
      // High confidence if exactly 9 digits with proper formatting
      const cleanSSN = value.replace(/[-\s]/g, '');
      return cleanSSN.length === 9 ? 0.95 : 0.7;

    case 'phone':
      // High confidence if 10 digits
      const cleanPhone = value.replace(/\D/g, '');
      return cleanPhone.length === 10 ? 0.9 : 0.7;

    case 'email':
      // High confidence if valid email format
      return value.includes('@') && value.includes('.') ? 0.95 : 0.6;

    case 'mrn':
      // High confidence if explicitly labeled as MRN
      return value.toLowerCase().includes('mrn') ? 0.9 : 0.6;

    case 'dob':
      // Medium confidence (could be any date)
      return 0.6;

    case 'medical-term':
      // Lower confidence (common words)
      return 0.5;

    default:
      return 0.5;
  }
}

/**
 * Classify data sensitivity level
 *
 * @param hasPHI - Whether data contains PHI
 * @param patterns - Detected PHI patterns
 * @returns Sensitivity level
 */
function classifySensitivity(hasPHI: boolean, patterns: PHIPattern[]): SensitivityLevel {
  if (!hasPHI) {
    return 'internal';
  }

  // Check for high-sensitivity PHI types
  const highSensitiveTypes: PHIPatternType[] = ['ssn', 'mrn', 'credit-card', 'bank-account'];
  const hasHighSensitive = patterns.some(p => highSensitiveTypes.includes(p.type));

  if (hasHighSensitive) {
    return 'restricted';
  }

  return 'phi';
}

/**
 * Detect PHI in data object
 *
 * Recursively scans object for PHI using both semantic and pattern-based detection.
 *
 * **HIPAA Note**: Call this before logging, storing, or transmitting data.
 *
 * @param data - Data object to analyze
 * @param fieldNames - Optional array of field names to specifically check
 * @returns PHI detection result
 *
 * @example
 * ```typescript
 * const formData = {
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   ssn: '123-45-6789',
 *   email: 'john@example.com',
 *   notes: 'Patient has diabetes'
 * };
 *
 * const result = detectPHI(formData);
 * console.log(result.hasPHI); // true
 * console.log(result.phiFields); // ['ssn', 'email', 'notes']
 * console.log(result.sensitivityLevel); // 'restricted'
 *
 * // Check specific fields only
 * const result2 = detectPHI(formData, ['ssn', 'email']);
 * ```
 */
export function detectPHI(
  data: Record<string, unknown>,
  fieldNames?: string[]
): PHIDetectionResult {
  const phiFields = new Set<string>();
  const allPatterns: PHIPattern[] = [];
  const details: PHIFieldDetail[] = [];

  /**
   * Recursively scan object
   */
  function scan(obj: unknown, path: string = ''): void {
    if (obj === null || obj === undefined) {
      return;
    }

    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        scan(item, `${path}[${index}]`);
      });
      return;
    }

    if (typeof obj === 'object') {
      for (const [key, value] of Object.entries(obj)) {
        const fieldPath = path ? `${path}.${key}` : key;

        // Skip if fieldNames specified and this field is not included
        if (fieldNames && !fieldNames.includes(key)) {
          continue;
        }

        // Check field name
        if (isPHIField(key)) {
          phiFields.add(fieldPath);
          details.push({
            fieldPath,
            fieldName: key,
            reason: 'Field name indicates PHI',
            sensitivityLevel: 'phi',
          });
        }

        // Check field value for patterns
        const patterns = detectPatterns(value, fieldPath);

        if (patterns.length > 0) {
          phiFields.add(fieldPath);
          allPatterns.push(...patterns);

          for (const pattern of patterns) {
            details.push({
              fieldPath,
              fieldName: key,
              reason: `Contains ${pattern.type} pattern`,
              patternType: pattern.type,
              sensitivityLevel: pattern.type === 'ssn' || pattern.type === 'mrn' ? 'restricted' : 'phi',
            });
          }
        }

        // Recurse into nested objects
        if (typeof value === 'object') {
          scan(value, fieldPath);
        }
      }
    }
  }

  scan(data);

  const hasPHI = phiFields.size > 0;
  const sensitivityLevel = classifySensitivity(hasPHI, allPatterns);

  return {
    hasPHI,
    phiFields: Array.from(phiFields),
    patterns: allPatterns,
    sensitivityLevel,
    details,
  };
}
