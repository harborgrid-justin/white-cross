/**
 * Sanitization Utility Functions
 *
 * HIPAA-compliant data sanitization for logging, error messages,
 * and data transmission. Removes or masks PHI to prevent exposure.
 *
 * @module lib/utils/sanitization
 */

/**
 * Sanitizes a string by removing potential PHI.
 *
 * Removes:
 * - SSN patterns
 * - Email addresses
 * - Phone numbers
 * - Credit card numbers
 * - Account numbers (6+ consecutive digits)
 *
 * **HIPAA Compliance**: Use this before logging any user input or error messages.
 *
 * @param text - Text to sanitize
 * @param replacement - Replacement text (default: '[REDACTED]')
 * @returns Sanitized text
 *
 * @example
 * ```typescript
 * sanitizeForLogging('My SSN is 123-45-6789') // 'My SSN is [REDACTED]'
 * sanitizeForLogging('Call 555-1234') // 'Call [REDACTED]'
 * ```
 */
export function sanitizeForLogging(text: string, replacement: string = '[REDACTED]'): string {
  let sanitized = text;

  // Remove SSN patterns
  sanitized = sanitized.replace(/\d{3}[-\s]?\d{2}[-\s]?\d{4}/g, replacement);

  // Remove email addresses
  sanitized = sanitized.replace(/[^\s@]+@[^\s@]+\.[^\s@]+/gi, replacement);

  // Remove phone numbers
  sanitized = sanitized.replace(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g, replacement);

  // Remove credit card numbers
  sanitized = sanitized.replace(/\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g, replacement);

  // Remove long numeric sequences (potential account/ID numbers)
  sanitized = sanitized.replace(/\b\d{6,}\b/g, replacement);

  // Remove dates that might be DOB
  sanitized = sanitized.replace(/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g, replacement);
  sanitized = sanitized.replace(/\b\d{4}-\d{2}-\d{2}\b/g, replacement);

  return sanitized;
}

/**
 * Sanitizes an error object for logging.
 *
 * Removes PHI from error messages, stack traces, and additional properties.
 *
 * @param error - Error object to sanitize
 * @returns Sanitized error object
 *
 * @example
 * ```typescript
 * const error = new Error('Invalid SSN: 123-45-6789');
 * sanitizeError(error) // Error with message: 'Invalid SSN: [REDACTED]'
 * ```
 */
export function sanitizeError(error: Error | any): any {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: sanitizeForLogging(error.message),
      stack: error.stack ? sanitizeForLogging(error.stack) : undefined,
    };
  }

  if (typeof error === 'object' && error !== null) {
    const sanitized: any = {};

    for (const key in error) {
      const value = error[key];

      if (typeof value === 'string') {
        sanitized[key] = sanitizeForLogging(value);
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = sanitizeError(value);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  return error;
}

/**
 * Masks sensitive parts of a string while preserving some readability.
 *
 * @param text - Text to mask
 * @param visibleStart - Number of characters to show at start (default: 2)
 * @param visibleEnd - Number of characters to show at end (default: 2)
 * @param maskChar - Character to use for masking (default: '*')
 * @returns Masked text
 *
 * @example
 * ```typescript
 * maskString('1234567890', 2, 2) // '12******90'
 * maskString('john@example.com', 2, 4) // 'jo*******.com'
 * ```
 */
export function maskString(
  text: string,
  visibleStart: number = 2,
  visibleEnd: number = 2,
  maskChar: string = '*'
): string {
  if (text.length <= visibleStart + visibleEnd) {
    return maskChar.repeat(text.length);
  }

  const start = text.slice(0, visibleStart);
  const end = text.slice(-visibleEnd);
  const middle = maskChar.repeat(text.length - visibleStart - visibleEnd);

  return start + middle + end;
}

/**
 * Masks an email address for display.
 *
 * @param email - Email address to mask
 * @returns Masked email (e.g., 'j***@example.com')
 *
 * @example
 * ```typescript
 * maskEmail('john.doe@example.com') // 'j***@example.com'
 * ```
 */
export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');

  if (!local || !domain) return email;

  const maskedLocal = local.length > 1 ? `${local[0]}***` : '***';

  return `${maskedLocal}@${domain}`;
}

/**
 * Masks a phone number for display.
 *
 * @param phone - Phone number to mask
 * @returns Masked phone (e.g., '(***) ***-1234')
 *
 * @example
 * ```typescript
 * maskPhoneNumber('(123) 456-7890') // '(***) ***-7890'
 * maskPhoneNumber('1234567890') // '******7890'
 * ```
 */
export function maskPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length === 10) {
    return `(***) ***-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned[0] === '1') {
    return `(***) ***-${cleaned.slice(7)}`;
  }

  // For non-standard formats, mask all but last 4 digits
  if (cleaned.length >= 4) {
    return '*'.repeat(cleaned.length - 4) + cleaned.slice(-4);
  }

  return '****';
}

/**
 * Masks a Social Security Number for display.
 *
 * @param ssn - SSN to mask
 * @returns Masked SSN (e.g., 'XXX-XX-6789')
 *
 * @example
 * ```typescript
 * maskSSN('123-45-6789') // 'XXX-XX-6789'
 * maskSSN('123456789') // 'XXX-XX-6789'
 * ```
 */
export function maskSSN(ssn: string): string {
  const cleaned = ssn.replace(/\D/g, '');

  if (cleaned.length !== 9) {
    return 'XXX-XX-XXXX';
  }

  return `XXX-XX-${cleaned.slice(5)}`;
}

/**
 * Masks a medical record number for display.
 *
 * @param mrn - Medical record number to mask
 * @returns Masked MRN showing only last 3-4 digits
 *
 * @example
 * ```typescript
 * maskMRN('MRN123456') // '***3456'
 * maskMRN('987654321') // '****4321'
 * ```
 */
export function maskMRN(mrn: string): string {
  const cleaned = mrn.replace(/[-\s]/g, '');

  if (cleaned.length <= 4) {
    return '*'.repeat(cleaned.length);
  }

  const lastFour = cleaned.slice(-4);
  const masked = '*'.repeat(cleaned.length - 4);

  return masked + lastFour;
}

/**
 * Removes PHI from an object for logging or transmission.
 *
 * Recursively sanitizes object properties.
 *
 * @param obj - Object to sanitize
 * @param phiFields - Array of field names that contain PHI
 * @returns Sanitized object
 *
 * @example
 * ```typescript
 * removePHIFromObject({
 *   name: 'John Doe',
 *   ssn: '123-45-6789',
 *   notes: 'Some notes'
 * }, ['ssn']) // { name: 'John Doe', ssn: '[REDACTED]', notes: 'Some notes' }
 * ```
 */
export function removePHIFromObject<T extends Record<string, any>>(obj: T, phiFields: string[]): T {
  const sanitized = { ...obj };

  for (const key in sanitized) {
    const value = sanitized[key];

    if (phiFields.includes(key)) {
      sanitized[key] = '[REDACTED]' as any;
    } else if (typeof value === 'string') {
      sanitized[key] = sanitizeForLogging(value) as any;
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key] = removePHIFromObject(value, phiFields) as any;
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((item) =>
        typeof item === 'object' && item !== null ? removePHIFromObject(item, phiFields) : item
      ) as any;
    }
  }

  return sanitized;
}

/**
 * Common PHI field names that should be redacted.
 *
 * Use this list when sanitizing objects for logging.
 */
export const COMMON_PHI_FIELDS = [
  'ssn',
  'socialSecurityNumber',
  'dateOfBirth',
  'dob',
  'email',
  'phoneNumber',
  'phone',
  'address',
  'street',
  'medicalRecordNumber',
  'mrn',
  'patientId',
  'diagnosis',
  'prescription',
  'medication',
  'treatment',
  'allergies',
  'conditions',
  'insuranceNumber',
  'policyNumber',
];

/**
 * Sanitizes an API request payload for logging.
 *
 * Removes PHI fields and sanitizes string values.
 *
 * @param payload - Request payload
 * @returns Sanitized payload safe for logging
 *
 * @example
 * ```typescript
 * sanitizeAPIPayload({
 *   name: 'John',
 *   ssn: '123-45-6789',
 *   notes: 'Patient notes'
 * }) // { name: 'John', ssn: '[REDACTED]', notes: 'Patient notes' }
 * ```
 */
export function sanitizeAPIPayload<T extends Record<string, any>>(payload: T): T {
  return removePHIFromObject(payload, COMMON_PHI_FIELDS);
}

/**
 * Sanitizes an API response for logging.
 *
 * Similar to sanitizeAPIPayload but handles common response structures.
 *
 * @param response - API response
 * @returns Sanitized response
 *
 * @example
 * ```typescript
 * sanitizeAPIResponse({
 *   success: true,
 *   data: { patient: { ssn: '123-45-6789' } }
 * }) // { success: true, data: { patient: { ssn: '[REDACTED]' } } }
 * ```
 */
export function sanitizeAPIResponse<T extends Record<string, any>>(response: T): T {
  return removePHIFromObject(response, COMMON_PHI_FIELDS);
}

/**
 * Sanitizes a stack trace for logging.
 *
 * Removes file paths, line numbers that might reveal system information,
 * and any PHI that leaked into the stack.
 *
 * @param stackTrace - Stack trace string
 * @returns Sanitized stack trace
 *
 * @example
 * ```typescript
 * sanitizeStackTrace(error.stack) // Sanitized stack without PHI
 * ```
 */
export function sanitizeStackTrace(stackTrace: string): string {
  let sanitized = sanitizeForLogging(stackTrace);

  // Remove absolute file paths (Windows and Unix)
  sanitized = sanitized.replace(/[A-Z]:\\.+?:\d+:\d+/g, '[PATH]');
  sanitized = sanitized.replace(/\/[^\s]+:\d+:\d+/g, '[PATH]');

  // Remove webpack internal paths
  sanitized = sanitized.replace(/webpack:\/\/\/.+?:\d+:\d+/g, '[WEBPACK]');

  return sanitized;
}

/**
 * Creates a safe error message for user display.
 *
 * Removes technical details and PHI, returns user-friendly message.
 *
 * @param error - Error object or message
 * @param fallbackMessage - Default message if error can't be sanitized
 * @returns Safe error message for user display
 *
 * @example
 * ```typescript
 * getSafeErrorMessage(error) // 'An error occurred. Please try again.'
 * getSafeErrorMessage(error, 'Custom fallback') // 'Custom fallback'
 * ```
 */
export function getSafeErrorMessage(error: Error | any, fallbackMessage: string = 'An error occurred'): string {
  if (error instanceof Error) {
    // Don't expose technical error messages to users
    if (error.message.includes('Network') || error.message.includes('Failed to fetch')) {
      return 'Unable to connect to the server. Please check your internet connection.';
    }

    if (error.message.includes('timeout')) {
      return 'The request timed out. Please try again.';
    }

    // Sanitize the message and return if it doesn't contain technical jargon
    const sanitized = sanitizeForLogging(error.message);
    if (!/Error|Exception|Stack|Trace/i.test(sanitized)) {
      return sanitized;
    }
  }

  return fallbackMessage;
}
