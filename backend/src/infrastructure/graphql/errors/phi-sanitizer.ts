/**
 * PHI Error Sanitizer
 *
 * Removes Protected Health Information (PHI) from error messages to ensure
 * HIPAA compliance. Prevents accidental exposure of sensitive patient data
 * in GraphQL error responses.
 *
 * HIPAA Compliance:
 * - Removes patient names, IDs, dates of birth, addresses
 * - Removes medical record numbers and diagnosis codes
 * - Removes medication names and dosages
 * - Removes phone numbers and email addresses
 * - Sanitizes SQL error messages that may contain PHI
 */

/**
 * PHI patterns to detect and redact from error messages
 */
const PHI_PATTERNS = [
  // Email addresses
  {
    pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    replacement: '[EMAIL]',
  },

  // Phone numbers (various formats)
  { pattern: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, replacement: '[PHONE]' },
  {
    pattern: /\b\+?1?\s*\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})\b/g,
    replacement: '[PHONE]',
  },

  // Social Security Numbers
  { pattern: /\b\d{3}-\d{2}-\d{4}\b/g, replacement: '[SSN]' },

  // Dates (MM/DD/YYYY, MM-DD-YYYY, YYYY-MM-DD)
  {
    pattern: /\b(0?[1-9]|1[0-2])[\/\-](0?[1-9]|[12][0-9]|3[01])[\/\-]\d{4}\b/g,
    replacement: '[DATE]',
  },
  {
    pattern: /\b\d{4}[\/\-](0?[1-9]|1[0-2])[\/\-](0?[1-9]|[12][0-9]|3[01])\b/g,
    replacement: '[DATE]',
  },

  // Medical Record Numbers (MRN prefix)
  { pattern: /\bMRN[:\s]*[A-Z0-9-]+/gi, replacement: '[MRN]' },
  {
    pattern: /\bmedical[\s_-]?record[\s_-]?number[:\s]*[A-Z0-9-]+/gi,
    replacement: '[MRN]',
  },

  // Patient IDs and Student IDs
  {
    pattern: /\bpatient[\s_-]?id[:\s]*[A-Z0-9-]+/gi,
    replacement: '[PATIENT_ID]',
  },
  {
    pattern: /\bstudent[\s_-]?id[:\s]*[A-Z0-9-]+/gi,
    replacement: '[STUDENT_ID]',
  },
  {
    pattern: /\bstudent[\s_-]?number[:\s]*[A-Z0-9-]+/gi,
    replacement: '[STUDENT_ID]',
  },

  // Street addresses
  {
    pattern:
      /\b\d+\s+[A-Za-z0-9\s,]+\s+(Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr|Court|Ct|Circle|Cir)\b/gi,
    replacement: '[ADDRESS]',
  },

  // ZIP codes
  { pattern: /\b\d{5}(-\d{4})?\b/g, replacement: '[ZIP]' },

  // Names (common patterns - First Last or Last, First)
  { pattern: /\b[A-Z][a-z]+\s+[A-Z][a-z]+\b/g, replacement: '[NAME]' },
  { pattern: /\b[A-Z][a-z]+,\s*[A-Z][a-z]+\b/g, replacement: '[NAME]' },

  // ICD-10 and CPT codes
  { pattern: /\b[A-Z]\d{2}(\.\d{1,2})?\b/g, replacement: '[DIAGNOSIS_CODE]' },
  { pattern: /\bCPT[:\s]*\d{5}\b/gi, replacement: '[CPT_CODE]' },

  // Common medication names (generic pattern - capitalized words followed by dosage)
  {
    pattern: /\b[A-Z][a-z]+\s+\d+\s*(mg|mcg|ml|g|units?)\b/gi,
    replacement: '[MEDICATION]',
  },
];

/**
 * Sensitive field names that should be redacted if they appear in error messages
 */
const SENSITIVE_FIELD_NAMES = [
  'firstName',
  'lastName',
  'fullName',
  'email',
  'phone',
  'dateOfBirth',
  'ssn',
  'socialSecurityNumber',
  'address',
  'city',
  'state',
  'zip',
  'medicalRecordNum',
  'studentNumber',
  'diagnosis',
  'medication',
  'allergen',
  'chronicCondition',
];

/**
 * Sanitize a string by removing PHI patterns
 *
 * @param text - Text that may contain PHI
 * @returns Sanitized text with PHI removed
 */
export function sanitizePHI(text: string): string {
  if (!text) return text;

  let sanitized = text;

  // Apply all PHI patterns
  for (const { pattern, replacement } of PHI_PATTERNS) {
    sanitized = sanitized.replace(pattern, replacement);
  }

  // Redact sensitive field values in error messages
  // Pattern: field: "value" or field='value' or field=value
  for (const fieldName of SENSITIVE_FIELD_NAMES) {
    const fieldPattern = new RegExp(
      `${fieldName}[\\s]*[:=][\\s]*(['"]?)([^'"\\s,}]+)\\1`,
      'gi',
    );
    sanitized = sanitized.replace(fieldPattern, `${fieldName}: [REDACTED]`);
  }

  // Sanitize SQL error messages that may contain PHI
  sanitized = sanitizeSQL(sanitized);

  return sanitized;
}

/**
 * Sanitize SQL error messages to remove potential PHI in WHERE clauses
 *
 * @param text - Error message that may contain SQL
 * @returns Sanitized message with SQL values redacted
 */
function sanitizeSQL(text: string): string {
  // Redact values in WHERE clauses
  let sanitized = text.replace(
    /WHERE\s+[^=]+\s*=\s*['"]?([^'";\s]+)['"]?/gi,
    'WHERE [FIELD] = [REDACTED]',
  );

  // Redact INSERT VALUES
  sanitized = sanitized.replace(/VALUES\s*\([^)]+\)/gi, 'VALUES ([REDACTED])');

  // Redact UPDATE SET values
  sanitized = sanitized.replace(
    /SET\s+([^=]+)\s*=\s*['"]?([^'";\s,]+)['"]?/gi,
    'SET $1 = [REDACTED]',
  );

  return sanitized;
}

/**
 * Sanitize a GraphQL error object
 *
 * Removes PHI from error messages, paths, and extensions while preserving
 * the error structure for debugging.
 *
 * @param error - GraphQL error object
 * @returns Sanitized error object
 */
export function sanitizeGraphQLError(error: any): any {
  const sanitizedError = { ...error };

  // Sanitize main error message
  if (sanitizedError.message) {
    sanitizedError.message = sanitizePHI(sanitizedError.message);
  }

  // Sanitize extensions if present
  if (sanitizedError.extensions) {
    // Sanitize exception message
    if (sanitizedError.extensions.exception?.message) {
      sanitizedError.extensions.exception.message = sanitizePHI(
        sanitizedError.extensions.exception.message,
      );
    }

    // Sanitize stack trace
    if (sanitizedError.extensions.exception?.stacktrace) {
      sanitizedError.extensions.exception.stacktrace =
        sanitizedError.extensions.exception.stacktrace.map((line: string) =>
          sanitizePHI(line),
        );
    }

    // Sanitize original error if present
    if (sanitizedError.extensions.originalError?.message) {
      sanitizedError.extensions.originalError.message = sanitizePHI(
        sanitizedError.extensions.originalError.message,
      );
    }

    // Remove validation errors that may contain PHI
    if (sanitizedError.extensions.validationErrors) {
      sanitizedError.extensions.validationErrors =
        sanitizedError.extensions.validationErrors.map(
          (validationError: any) => ({
            ...validationError,
            message: sanitizePHI(validationError.message || ''),
            value: '[REDACTED]',
          }),
        );
    }
  }

  return sanitizedError;
}

/**
 * Check if an error message contains potential PHI
 *
 * Used for audit logging to flag errors that required sanitization.
 *
 * @param text - Text to check for PHI
 * @returns true if PHI patterns detected
 */
export function containsPHI(text: string): boolean {
  if (!text) return false;

  // Check against all PHI patterns
  for (const { pattern } of PHI_PATTERNS) {
    if (pattern.test(text)) {
      return true;
    }
  }

  // Check for sensitive field names
  for (const fieldName of SENSITIVE_FIELD_NAMES) {
    const fieldPattern = new RegExp(
      `${fieldName}[\\s]*[:=][\\s]*(['"]?)([^'"\\s,}]+)\\1`,
      'i',
    );
    if (fieldPattern.test(text)) {
      return true;
    }
  }

  return false;
}
