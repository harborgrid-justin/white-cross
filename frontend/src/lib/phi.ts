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
 * Common PHI field names (semantic detection)
 *
 * These field names typically contain PHI regardless of content.
 */
export const PHI_FIELD_NAMES = new Set([
  // Personal identifiers
  'ssn',
  'socialSecurityNumber',
  'social_security_number',
  'dateOfBirth',
  'dob',
  'date_of_birth',
  'birthDate',
  'birth_date',
  'patientId',
  'patient_id',
  'medicalRecordNumber',
  'medical_record_number',
  'mrn',
  'healthRecordNumber',
  'health_record_number',

  // Contact information
  'email',
  'emailAddress',
  'email_address',
  'phoneNumber',
  'phone_number',
  'phone',
  'mobilePhone',
  'mobile_phone',
  'homePhone',
  'home_phone',
  'address',
  'streetAddress',
  'street_address',
  'homeAddress',
  'home_address',
  'mailingAddress',
  'mailing_address',
  'zip',
  'zipCode',
  'zip_code',
  'postalCode',
  'postal_code',

  // Medical information
  'diagnosis',
  'diagnoses',
  'condition',
  'conditions',
  'medication',
  'medications',
  'prescription',
  'prescriptions',
  'treatment',
  'treatments',
  'procedure',
  'procedures',
  'allergy',
  'allergies',
  'immunization',
  'immunizations',
  'vaccination',
  'vaccinations',
  'labResult',
  'lab_result',
  'testResult',
  'test_result',
  'vitalSigns',
  'vital_signs',
  'bloodPressure',
  'blood_pressure',
  'heartRate',
  'heart_rate',
  'temperature',
  'weight',
  'height',
  'bmi',

  // Insurance and financial
  'insuranceNumber',
  'insurance_number',
  'policyNumber',
  'policy_number',
  'subscriberId',
  'subscriber_id',
  'groupNumber',
  'group_number',
  'memberId',
  'member_id',

  // Healthcare provider information
  'providerId',
  'provider_id',
  'npi',
  'licenseNumber',
  'license_number',
  'deaNumber',
  'dea_number',

  // Sensitive notes and observations
  'clinicalNotes',
  'clinical_notes',
  'progressNotes',
  'progress_notes',
  'nurseNotes',
  'nurse_notes',
  'observations',
  'symptoms',
  'complaint',
  'chiefComplaint',
  'chief_complaint',
]);

/**
 * Regex patterns for PHI detection
 */
const PHI_PATTERNS: Record<PHIPatternType, RegExp> = {
  // SSN: 123-45-6789 or 123456789
  ssn: /\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b/g,

  // Date of birth: MM/DD/YYYY, MM-DD-YYYY, YYYY-MM-DD
  dob: /\b\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\b|\b\d{4}[-/]\d{1,2}[-/]\d{1,2}\b/g,

  // Phone: (123) 456-7890, 123-456-7890, 1234567890
  phone: /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,

  // Email: user@example.com
  email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi,

  // Medical Record Number: MRN followed by digits
  mrn: /\b(MRN|mrn|medical\s*record\s*number|medical\s*record\s*#)\s*:?\s*\d+\b/gi,

  // Credit card: 1234-5678-9012-3456 or 1234567890123456
  'credit-card': /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g,

  // Bank account: 8-17 digits
  'bank-account': /\b\d{8,17}\b/g,

  // Driver's license (generic pattern)
  license: /\b[A-Z]{1,2}\d{5,8}\b/g,

  // Medical terms (partial list)
  'medical-term': /\b(diabetes|hypertension|asthma|cancer|heart\s*disease|pneumonia|flu|covid|infection|fever|pain|injury|fracture|sprain|concussion)\b/gi,

  // Custom pattern (placeholder)
  custom: /CUSTOM_PATTERN/g,
};

/**
 * Medical terminology keywords
 */
const MEDICAL_KEYWORDS = new Set([
  'diagnosis',
  'diagnosed',
  'treatment',
  'treated',
  'medication',
  'prescribed',
  'surgery',
  'procedure',
  'condition',
  'disease',
  'illness',
  'injury',
  'symptom',
  'pain',
  'fever',
  'infection',
  'allergy',
  'allergic',
  'vaccine',
  'immunization',
  'hospital',
  'emergency',
  'admitted',
  'discharged',
  'patient',
  'doctor',
  'physician',
  'nurse',
  'healthcare',
  'medical',
  'clinical',
]);

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
  for (const phiField of PHI_FIELD_NAMES) {
    const normalizedPHI = phiField.toLowerCase().replace(/[-_\s]/g, '');
    if (normalized === normalizedPHI || normalized.includes(normalizedPHI)) {
      return true;
    }
  }

  // Check for medical terminology in field name
  for (const keyword of MEDICAL_KEYWORDS) {
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

    const matches = str.matchAll(regex);

    for (const match of matches) {
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
  data: Record<string, any>,
  fieldNames?: string[]
): PHIDetectionResult {
  const phiFields = new Set<string>();
  const allPatterns: PHIPattern[] = [];
  const details: PHIFieldDetail[] = [];

  /**
   * Recursively scan object
   */
  function scan(obj: any, path: string = ''): void {
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
export function getPHIFields(schema: any): string[] {
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
export function classifyDataSensitivity(data: Record<string, any>): SensitivityLevel {
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
  data: Record<string, any>,
  options: { remove?: boolean; mask?: boolean } = { mask: true }
): Record<string, any> {
  const result = detectPHI(data);

  if (!result.hasPHI) {
    return { ...data };
  }

  const filtered = { ...data };

  for (const fieldPath of result.phiFields) {
    const keys = fieldPath.split('.');
    let current: any = filtered;

    // Navigate to the field
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) break;
      current = current[keys[i]];
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
 * Validate PHI handling compliance
 *
 * Checks if PHI is being handled according to HIPAA requirements.
 *
 * @param data - Data to validate
 * @param context - Context information
 * @returns Validation result
 */
export interface PHIComplianceCheck {
  compliant: boolean;
  issues: string[];
  recommendations: string[];
}

export function validatePHICompliance(
  data: Record<string, any>,
  context: {
    isEncrypted?: boolean;
    isAuditLogged?: boolean;
    hasUserConsent?: boolean;
    purpose?: string;
  }
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
