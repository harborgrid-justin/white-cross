/**
 * Validation Utility Functions
 *
 * Healthcare-specific validation utilities including NPI, ICD-10,
 * PHI detection, and general form validation.
 *
 * @module lib/utils/validation
 */

/**
 * Validates an email address.
 *
 * @param email - Email address to validate
 * @returns True if valid email format
 *
 * @example
 * ```typescript
 * isValidEmail('user@example.com') // true
 * isValidEmail('invalid') // false
 * ```
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates a US phone number.
 *
 * Accepts various formats: (XXX) XXX-XXXX, XXX-XXX-XXXX, XXXXXXXXXX
 *
 * @param phone - Phone number to validate
 * @returns True if valid US phone format
 *
 * @example
 * ```typescript
 * isValidPhoneNumber('(123) 456-7890') // true
 * isValidPhoneNumber('1234567890') // true
 * isValidPhoneNumber('123-456-7890') // true
 * ```
 */
export function isValidPhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 10 || (cleaned.length === 11 && cleaned[0] === '1');
}

/**
 * Validates a US ZIP code (5 or 9 digits).
 *
 * @param zipCode - ZIP code to validate
 * @returns True if valid ZIP format
 *
 * @example
 * ```typescript
 * isValidZipCode('12345') // true
 * isValidZipCode('12345-6789') // true
 * isValidZipCode('invalid') // false
 * ```
 */
export function isValidZipCode(zipCode: string): boolean {
  const zipRegex = /^\d{5}(-\d{4})?$/;
  return zipRegex.test(zipCode);
}

/**
 * Validates a Social Security Number (SSN).
 *
 * @param ssn - SSN to validate
 * @returns True if valid SSN format
 *
 * @example
 * ```typescript
 * isValidSSN('123-45-6789') // true
 * isValidSSN('123456789') // true
 * isValidSSN('000-00-0000') // false (invalid number)
 * ```
 */
export function isValidSSN(ssn: string): boolean {
  const cleaned = ssn.replace(/\D/g, '');

  if (cleaned.length !== 9) return false;

  // Invalid SSN patterns
  if (cleaned === '000000000') return false;
  if (cleaned === '123456789') return false;
  if (cleaned.startsWith('000')) return false;
  if (cleaned.startsWith('666')) return false;
  if (cleaned.startsWith('9')) return false;

  return true;
}

/**
 * Validates a National Provider Identifier (NPI).
 *
 * NPI is a 10-digit number used to identify healthcare providers.
 * Implements Luhn algorithm check for validity.
 *
 * @param npi - NPI to validate
 * @returns True if valid NPI
 *
 * @example
 * ```typescript
 * isValidNPI('1234567893') // true (if passes Luhn check)
 * isValidNPI('123') // false (wrong length)
 * ```
 */
export function isValidNPI(npi: string): boolean {
  const cleaned = npi.replace(/\D/g, '');

  if (cleaned.length !== 10) return false;

  // Luhn algorithm check
  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i]);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

/**
 * Validates an ICD-10 code format.
 *
 * ICD-10 codes are 3-7 characters: Letter followed by 2+ digits and optional decimals.
 *
 * @param icd10 - ICD-10 code to validate
 * @returns True if valid ICD-10 format
 *
 * @example
 * ```typescript
 * isValidICD10('A00.0') // true
 * isValidICD10('Z99.89') // true
 * isValidICD10('123') // false (must start with letter)
 * ```
 */
export function isValidICD10(icd10: string): boolean {
  // ICD-10 format: Letter + 2 digits + optional decimal + up to 4 more characters
  const icd10Regex = /^[A-Z]\d{2}(\.\d{1,4})?$/;
  return icd10Regex.test(icd10.toUpperCase());
}

/**
 * Validates a National Drug Code (NDC).
 *
 * NDC format: 5-4-2 or 4-4-2 (labeler-product-package)
 *
 * @param ndc - NDC to validate
 * @returns True if valid NDC format
 *
 * @example
 * ```typescript
 * isValidNDC('12345-6789-01') // true (5-4-2)
 * isValidNDC('1234-5678-90') // true (4-4-2)
 * ```
 */
export function isValidNDC(ndc: string): boolean {
  const cleaned = ndc.replace(/[-\s]/g, '');

  if (cleaned.length !== 11) return false;

  // Valid formats: 5-4-2 or 4-4-2
  const format1 = /^\d{5}\d{4}\d{2}$/;
  const format2 = /^\d{4}\d{4}\d{2}$/;

  return format1.test(cleaned) || format2.test(cleaned);
}

/**
 * Validates a medical record number format.
 *
 * Flexible validation for various MRN formats.
 *
 * @param mrn - Medical record number to validate
 * @param minLength - Minimum length (default: 6)
 * @param maxLength - Maximum length (default: 20)
 * @returns True if valid MRN format
 *
 * @example
 * ```typescript
 * isValidMRN('MRN123456') // true
 * isValidMRN('123456') // true
 * ```
 */
export function isValidMRN(mrn: string, minLength: number = 6, maxLength: number = 20): boolean {
  const cleaned = mrn.replace(/[-\s]/g, '');

  if (cleaned.length < minLength || cleaned.length > maxLength) {
    return false;
  }

  // Must contain at least one digit
  return /\d/.test(cleaned);
}

/**
 * Detects if text potentially contains Protected Health Information (PHI).
 *
 * Scans for patterns that might indicate PHI:
 * - SSN patterns
 * - Medical record numbers
 * - Email addresses
 * - Phone numbers
 * - Dates of birth
 *
 * **HIPAA Compliance**: Use this to prevent accidental PHI exposure in logs,
 * error messages, or non-secure storage.
 *
 * @param text - Text to scan for PHI
 * @returns True if potential PHI detected
 *
 * @example
 * ```typescript
 * containsPHI('Patient SSN: 123-45-6789') // true
 * containsPHI('Call me at (555) 123-4567') // true
 * containsPHI('General information') // false
 * ```
 */
export function containsPHI(text: string): boolean {
  // SSN pattern
  if (/\d{3}[-\s]?\d{2}[-\s]?\d{4}/.test(text)) return true;

  // Phone number pattern
  if (/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(text)) return true;

  // Email pattern
  if (/[^\s@]+@[^\s@]+\.[^\s@]+/.test(text)) return true;

  // Date pattern (potential DOB)
  if (/\d{1,2}\/\d{1,2}\/\d{2,4}/.test(text)) return true;
  if (/\d{4}-\d{2}-\d{2}/.test(text)) return true;

  // MRN pattern (common formats)
  if (/MRN[-:\s]?\d{6,}/.test(text)) return true;

  // Account/ID numbers
  if (/\b\d{6,}\b/.test(text)) return true;

  return false;
}

/**
 * Validates a password meets security requirements.
 *
 * Requirements:
 * - Minimum length (default: 8)
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one digit
 * - At least one special character
 *
 * @param password - Password to validate
 * @param minLength - Minimum length (default: 8)
 * @returns Object with validation result and failed requirements
 *
 * @example
 * ```typescript
 * validatePassword('Test123!') // { isValid: true, errors: [] }
 * validatePassword('weak') // { isValid: false, errors: ['Too short', ...] }
 * ```
 */
export function validatePassword(
  password: string,
  minLength: number = 8
): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters`);
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one digit');
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates a date of birth is within reasonable range.
 *
 * @param dob - Date of birth string or Date object
 * @param minAge - Minimum age in years (default: 0)
 * @param maxAge - Maximum age in years (default: 120)
 * @returns True if valid date of birth
 *
 * @example
 * ```typescript
 * isValidDateOfBirth('2010-01-01', 5, 18) // true if age is 5-18
 * isValidDateOfBirth('1900-01-01') // false (too old)
 * ```
 */
export function isValidDateOfBirth(dob: string | Date, minAge: number = 0, maxAge: number = 120): boolean {
  const date = typeof dob === 'string' ? new Date(dob) : dob;

  if (isNaN(date.getTime())) return false;

  const now = new Date();
  const age = now.getFullYear() - date.getFullYear();
  const monthDiff = now.getMonth() - date.getMonth();

  let actualAge = age;
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < date.getDate())) {
    actualAge--;
  }

  return actualAge >= minAge && actualAge <= maxAge;
}

/**
 * Validates a URL format.
 *
 * @param url - URL to validate
 * @returns True if valid URL format
 *
 * @example
 * ```typescript
 * isValidURL('https://example.com') // true
 * isValidURL('not a url') // false
 * ```
 */
export function isValidURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates a dosage string format.
 *
 * Checks for valid dosage patterns like "10mg", "5ml", "2 tablets"
 *
 * @param dosage - Dosage string to validate
 * @returns True if valid dosage format
 *
 * @example
 * ```typescript
 * isValidDosage('10mg') // true
 * isValidDosage('2 tablets') // true
 * isValidDosage('invalid') // false
 * ```
 */
export function isValidDosage(dosage: string): boolean {
  // Pattern: number followed by optional space and unit
  const dosageRegex = /^\d+(\.\d+)?\s*(mg|ml|mcg|g|L|tablets?|capsules?|drops?|units?|iu)?$/i;
  return dosageRegex.test(dosage.trim());
}

/**
 * Validates a required field is not empty.
 *
 * @param value - Value to check
 * @returns True if value is not empty, null, or undefined
 *
 * @example
 * ```typescript
 * isRequired('value') // true
 * isRequired('') // false
 * isRequired(null) // false
 * ```
 */
export function isRequired(value: any): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string' && value.trim() === '') return false;
  if (Array.isArray(value) && value.length === 0) return false;
  return true;
}

/**
 * Validates a value is within a numeric range.
 *
 * @param value - Numeric value to check
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (inclusive)
 * @returns True if value is within range
 *
 * @example
 * ```typescript
 * isInRange(5, 1, 10) // true
 * isInRange(15, 1, 10) // false
 * ```
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * Validates a value matches one of allowed values.
 *
 * @param value - Value to check
 * @param allowedValues - Array of allowed values
 * @returns True if value is in allowed values
 *
 * @example
 * ```typescript
 * isOneOf('active', ['active', 'inactive']) // true
 * isOneOf('pending', ['active', 'inactive']) // false
 * ```
 */
export function isOneOf<T>(value: T, allowedValues: T[]): boolean {
  return allowedValues.includes(value);
}
