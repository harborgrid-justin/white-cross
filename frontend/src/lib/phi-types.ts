/**
 * PHI (Protected Health Information) Type Definitions
 *
 * Type definitions and interfaces for PHI detection and compliance.
 *
 * @module lib/phi-types
 */

/**
 * PHI detection result
 */
export interface PHIDetectionResult {
  hasPHI: boolean;
  phiFields: string[];
  patterns: PHIPattern[];
  sensitivityLevel: SensitivityLevel;
  details: PHIFieldDetail[];
}

/**
 * PHI pattern types
 */
export type PHIPatternType =
  | 'ssn'
  | 'dob'
  | 'phone'
  | 'email'
  | 'address'
  | 'mrn'
  | 'credit-card'
  | 'bank-account'
  | 'license'
  | 'medical-term'
  | 'custom';

/**
 * Detected PHI pattern
 */
export interface PHIPattern {
  type: PHIPatternType;
  value: string;
  fieldPath: string;
  confidence: number; // 0-1
}

/**
 * Data sensitivity levels
 */
export type SensitivityLevel = 'public' | 'internal' | 'confidential' | 'restricted' | 'phi';

/**
 * PHI field detail
 */
export interface PHIFieldDetail {
  fieldPath: string;
  fieldName: string;
  reason: string;
  patternType?: PHIPatternType;
  sensitivityLevel: SensitivityLevel;
}

/**
 * PHI compliance check result
 */
export interface PHIComplianceCheck {
  compliant: boolean;
  issues: string[];
  recommendations: string[];
}
