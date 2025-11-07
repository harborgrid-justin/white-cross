/**
 * LOC: 9F875EFA0A
 * WC-GEN-304 | validators.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - None (leaf node)
 *
 * DOWNSTREAM (imported by):
 *   - None (not imported)
 */

/**
 * WC-GEN-304 | validators.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: Independent module | Dependencies: None
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: functions | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

/**
 * Communication validation utilities
 *
 * Provides enhanced validation for email addresses, phone numbers,
 * and other communication-related data.
 */

/**
 * Enhanced email address validation
 *
 * @param email - Email address to validate
 * @returns boolean indicating if email is valid
 */
export function validateEmailAddress(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }

  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  // Basic format validation
  if (!emailRegex.test(email)) {
    return false;
  }

  // Additional checks
  const parts = email.split('@');
  if (parts.length !== 2) {
    return false;
  }

  const [localPart, domain] = parts;

  // Local part checks
  if (localPart!.length > 64 || localPart!.length === 0) {
    return false;
  }

  // Domain checks
  if (domain!.length > 253 || domain!.length === 0) {
    return false;
  }

  // Check for consecutive periods
  if (email.includes('..')) {
    return false;
  }

  // Check for leading/trailing periods in local part
  if (localPart!.startsWith('.') || localPart!.endsWith('.')) {
    return false;
  }

  return true;
}

/**
 * International phone number validation
 *
 * @param phone - Phone number to validate
 * @param country - Country code (optional, defaults to US)
 * @returns boolean indicating if phone number is valid
 */
export function validatePhoneNumber(
  phone: string,
  country: string = 'US',
): boolean {
  if (!phone || typeof phone !== 'string') {
    return false;
  }

  // Remove all non-digit characters for validation
  const digitsOnly = phone.replace(/\D/g, '');

  switch (country.toUpperCase()) {
    case 'US':
    case 'CA':
      // North American numbering plan: 10 digits (with optional +1 prefix)
      return (
        digitsOnly.length === 10 ||
        (digitsOnly.length === 11 && digitsOnly.startsWith('1'))
      );

    case 'UK':
      // UK phone numbers: 10-11 digits
      return digitsOnly.length >= 10 && digitsOnly.length <= 11;

    case 'AU':
      // Australian phone numbers: 9-10 digits
      return digitsOnly.length >= 9 && digitsOnly.length <= 10;

    case 'DE':
      // German phone numbers: 11-12 digits
      return digitsOnly.length >= 11 && digitsOnly.length <= 12;

    case 'FR':
      // French phone numbers: 10 digits
      return digitsOnly.length === 10;

    default:
      // International format: 7-15 digits
      return digitsOnly.length >= 7 && digitsOnly.length <= 15;
  }
}

/**
 * Format phone number for display
 *
 * @param phone - Phone number to format
 * @param country - Country code (optional, defaults to US)
 * @returns Formatted phone number string
 */
export function formatPhoneNumber(
  phone: string,
  country: string = 'US',
): string {
  if (!phone || typeof phone !== 'string') {
    return '';
  }

  const digitsOnly = phone.replace(/\D/g, '');

  switch (country.toUpperCase()) {
    case 'US':
    case 'CA':
      if (digitsOnly.length === 10) {
        return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
      } else if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
        return `+1 (${digitsOnly.slice(1, 4)}) ${digitsOnly.slice(4, 7)}-${digitsOnly.slice(7)}`;
      }
      break;

    case 'UK':
      if (digitsOnly.length === 10) {
        return `${digitsOnly.slice(0, 4)} ${digitsOnly.slice(4, 7)} ${digitsOnly.slice(7)}`;
      }
      break;

    default:
      // Basic international formatting
      if (digitsOnly.length >= 7) {
        return `+${digitsOnly.slice(0, -7)} ${digitsOnly.slice(-7, -4)} ${digitsOnly.slice(-4)}`;
      }
  }

  // Return original if formatting fails
  return phone;
}

/**
 * Validate SMS message length
 *
 * @param message - SMS message content
 * @returns object with validation result and character count
 */
export function validateSMSLength(message: string): {
  isValid: boolean;
  length: number;
  segments: number;
  maxLength: number;
} {
  if (!message || typeof message !== 'string') {
    return { isValid: false, length: 0, segments: 0, maxLength: 160 };
  }

  const length = message.length;

  // Check for special characters that use more bytes in SMS
  const hasSpecialChars = /[^\x00-\x7F]/.test(message);
  const maxSingleSegment = hasSpecialChars ? 70 : 160;
  const maxMultiSegment = hasSpecialChars ? 67 : 153;

  let segments = 1;
  let maxLength = maxSingleSegment;

  if (length > maxSingleSegment) {
    segments = Math.ceil(length / maxMultiSegment);
    maxLength = segments * maxMultiSegment;
  }

  return {
    isValid: length <= 1600, // SMS limit is typically 10 segments
    length,
    segments,
    maxLength,
  };
}
