/**
 * Security utilities for form handling
 * PHI detection and XSS sanitization for HIPAA compliance
 *
 * @module lib/forms/security
 */

import DOMPurify from 'isomorphic-dompurify';

/**
 * PHI (Protected Health Information) field patterns
 * Based on HIPAA regulations for identifying PHI
 */
const PHI_FIELD_PATTERNS = {
  // Direct identifiers
  SSN: /ssn|social.?security|social.?insurance/i,
  MEDICAL_RECORD: /medical.?record|mrn|patient.?id|health.?record/i,
  HEALTH_PLAN: /health.?plan|insurance.?id|policy.?number|member.?id/i,

  // Names and identifiers
  FULL_NAME: /full.?name|patient.?name|legal.?name/i,
  ADDRESS: /address|street|city|state|zip|postal/i,
  EMAIL: /email|e.?mail/i,
  PHONE: /phone|telephone|mobile|cell/i,

  // Health information
  DIAGNOSIS: /diagnosis|condition|disease|illness|icd/i,
  MEDICATION: /medication|prescription|drug|medicine|rx/i,
  TREATMENT: /treatment|procedure|therapy|surgery/i,
  LAB_RESULTS: /lab.?result|test.?result|blood|urine|specimen/i,
  VITAL_SIGNS: /vital.?sign|blood.?pressure|heart.?rate|temperature|weight|height/i,

  // Dates
  DOB: /birth.?date|date.?of.?birth|dob/i,
  ADMISSION_DATE: /admission|discharge|visit.?date|appointment.?date/i,

  // Biometric
  BIOMETRIC: /fingerprint|retina|iris|voice|facial|biometric/i,

  // Images
  PHOTO: /photo|image|picture|face/i,

  // Device identifiers
  DEVICE_ID: /device.?id|serial.?number|mac.?address|ip.?address/i,

  // Account numbers
  ACCOUNT: /account.?number|license|certificate|registration/i
};

/**
 * PHI field types that are always considered PHI
 */
const PHI_FIELD_TYPES = new Set([
  'ssn',
  'medical_record',
  'diagnosis',
  'medication',
  'health_record',
  'vital_signs',
  'lab_result',
  'biometric',
  'photo'
]);

/**
 * Detect if a field contains PHI based on name and type
 *
 * @param fieldName - Field name to check
 * @param fieldType - Field type
 * @param fieldLabel - Field label (optional)
 * @returns True if field likely contains PHI
 */
export function isPHIField(
  fieldName: string,
  fieldType: string,
  fieldLabel?: string
): boolean {
  // Check if field type is explicitly PHI
  if (PHI_FIELD_TYPES.has(fieldType)) {
    return true;
  }

  // Check field name and label against patterns
  const combinedText = `${fieldName} ${fieldLabel || ''}`;

  for (const pattern of Object.values(PHI_FIELD_PATTERNS)) {
    if (pattern.test(combinedText)) {
      return true;
    }
  }

  return false;
}

/**
 * Detect PHI fields in form data
 * Returns array of field names that contain PHI
 *
 * @param data - Form response data
 * @param fields - Form field definitions
 * @returns Array of PHI field names
 *
 * @example
 * ```typescript
 * const phiFields = detectPHI(formData, formDefinition.fields);
 * if (phiFields.length > 0) {
 *   await logPHIAccess({ userId, resource: 'form', resourceId: formId });
 * }
 * ```
 */
export function detectPHI(
  data: Record<string, any>,
  fields: Array<{ name: string; type: string; label: string }>
): string[] {
  const phiFields: string[] = [];

  for (const field of fields) {
    // Check if field definition indicates PHI
    if (isPHIField(field.name, field.type, field.label)) {
      // Check if field has data
      if (data[field.name] !== undefined && data[field.name] !== null && data[field.name] !== '') {
        phiFields.push(field.name);
      }
    }
  }

  return phiFields;
}

/**
 * Detect if form contains any PHI data based on field definitions
 *
 * @param fields - Form field definitions
 * @returns True if form contains PHI fields
 */
export function formContainsPHI(
  fields: Array<{ name: string; type: string; label: string }>
): boolean {
  return fields.some(field => isPHIField(field.name, field.type, field.label));
}

/**
 * Sanitize form data to prevent XSS attacks
 * Uses DOMPurify to clean HTML and dangerous content
 *
 * @param data - Raw form data
 * @returns Sanitized form data
 *
 * @example
 * ```typescript
 * const sanitized = sanitizeFormData(rawFormData);
 * // Safe to store and display
 * ```
 */
export function sanitizeFormData(data: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {};

  for (const [key, value] of Object.entries(data)) {
    sanitized[key] = sanitizeValue(value);
  }

  return sanitized;
}

/**
 * Sanitize individual value
 * Handles strings, arrays, and nested objects
 *
 * @param value - Value to sanitize
 * @returns Sanitized value
 */
function sanitizeValue(value: any): any {
  if (value === null || value === undefined) {
    return value;
  }

  if (typeof value === 'string') {
    // Sanitize HTML content
    return DOMPurify.sanitize(value, {
      ALLOWED_TAGS: [], // Strip all HTML tags
      ALLOWED_ATTR: [],
      KEEP_CONTENT: true // Keep text content
    });
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (typeof value === 'object') {
    const sanitized: Record<string, any> = {};
    for (const [k, v] of Object.entries(value)) {
      sanitized[k] = sanitizeValue(v);
    }
    return sanitized;
  }

  // Numbers, booleans, etc. don't need sanitization
  return value;
}

/**
 * Sanitize HTML content while preserving safe formatting
 * More permissive than sanitizeFormData for rich text fields
 *
 * @param html - HTML content to sanitize
 * @returns Sanitized HTML
 */
export function sanitizeHTML(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'a'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOW_DATA_ATTR: false
  });
}

/**
 * Mask sensitive data for logging
 * Partially obscures PHI while keeping format recognizable
 *
 * @param value - Value to mask
 * @param fieldType - Type of field
 * @returns Masked value
 *
 * @example
 * ```typescript
 * maskSensitiveData('123-45-6789', 'ssn') // Returns: '***-**-6789'
 * maskSensitiveData('john@example.com', 'email') // Returns: 'j***@example.com'
 * ```
 */
export function maskSensitiveData(value: string, fieldType: string): string {
  if (!value) return value;

  switch (fieldType) {
    case 'ssn':
      // Show last 4 digits only
      return value.length > 4
        ? `***-**-${value.slice(-4)}`
        : '***';

    case 'email':
      // Show first letter and domain
      const [username, domain] = value.split('@');
      if (!domain) return value;
      return `${username[0]}***@${domain}`;

    case 'phone':
      // Show last 4 digits
      const digits = value.replace(/\D/g, '');
      return digits.length > 4
        ? `***-***-${digits.slice(-4)}`
        : '***';

    case 'medical_record':
    case 'account':
      // Show last 4 characters
      return value.length > 4
        ? `****${value.slice(-4)}`
        : '****';

    default:
      // Generic masking
      return value.length > 4
        ? `${value.slice(0, 2)}***`
        : '***';
  }
}

/**
 * Redact PHI fields from data object for logging
 * Replaces PHI values with masked versions
 *
 * @param data - Data object
 * @param phiFields - Array of PHI field names
 * @returns Redacted data object safe for logging
 */
export function redactPHI(
  data: Record<string, any>,
  phiFields: string[]
): Record<string, any> {
  const redacted = { ...data };

  for (const field of phiFields) {
    if (redacted[field]) {
      redacted[field] = '[REDACTED_PHI]';
    }
  }

  return redacted;
}

/**
 * Extract client information from request headers
 * Used for audit logging
 *
 * @param headers - Request headers
 * @returns Client information object
 */
export function extractClientInfo(headers: Headers): {
  ipAddress?: string;
  userAgent?: string;
} {
  // Extract IP address from various headers
  const ipHeaders = [
    'x-forwarded-for',
    'x-real-ip',
    'cf-connecting-ip',
    'x-client-ip'
  ];

  let ipAddress: string | undefined;

  for (const header of ipHeaders) {
    const value = headers.get(header);
    if (value) {
      // x-forwarded-for can contain multiple IPs, take the first one
      ipAddress = value.split(',')[0].trim();
      break;
    }
  }

  // Extract user agent
  const userAgent = headers.get('user-agent') || undefined;

  return { ipAddress, userAgent };
}
