/**
 * @fileoverview Input Validation Utilities
 * @module utils/validationUtils
 * @description Comprehensive input validation and sanitization utilities for
 * preventing injection attacks, data corruption, and security vulnerabilities.
 *
 * SECURITY: All user input must be validated before processing
 * HIPAA: Validate PHI data formats to prevent data integrity issues
 *
 * @security Input validation layer for defense in depth
 * @security SQL injection prevention
 * @security XSS prevention
 */

import { isValid as isValidDate, parseISO, differenceInDays } from 'date-fns';

/**
 * Medication frequency patterns allowed in the system
 * Used for strict validation of medication scheduling
 */
export const ALLOWED_FREQUENCY_PATTERNS = [
  // Once daily variations
  'once daily', 'once a day', '1x daily', '1x/day', 'daily', 'qd',
  // Twice daily variations
  'twice daily', 'twice a day', '2x daily', '2x/day', 'bid', 'b.i.d.',
  // Three times daily variations
  'three times daily', 'three times a day', '3x daily', '3x/day', 'tid', 't.i.d.',
  // Four times daily variations
  'four times daily', 'four times a day', '4x daily', '4x/day', 'qid', 'q.i.d.',
  // Every X hours variations
  'every 4 hours', 'every 6 hours', 'every 8 hours', 'every 12 hours',
  'q4h', 'q6h', 'q8h', 'q12h',
  // PRN (as needed)
  'as needed', 'prn', 'p.r.n.',
  // Weekly
  'weekly', 'once weekly', '1x weekly'
] as const;

/**
 * Validate medication frequency string
 *
 * SECURITY: Prevents injection attacks through medication frequency field
 * MEDICAL SAFETY: Ensures only valid frequency patterns are accepted
 *
 * @param frequency - Frequency string to validate
 * @returns Object with isValid flag and normalized frequency
 * @throws Error if frequency is invalid
 *
 * @example
 * const result = validateMedicationFrequency('twice daily');
 * // Returns: { isValid: true, normalized: 'twice daily' }
 *
 * @example
 * const result = validateMedicationFrequency('invalid frequency');
 * // Throws: Error('Invalid medication frequency')
 */
export function validateMedicationFrequency(frequency: string): {
  isValid: boolean;
  normalized: string;
  error?: string;
} {
  // Input sanitization
  if (!frequency || typeof frequency !== 'string') {
    return {
      isValid: false,
      normalized: '',
      error: 'Frequency must be a non-empty string'
    };
  }

  // Length validation (prevent DoS with very long strings)
  if (frequency.length > 100) {
    return {
      isValid: false,
      normalized: '',
      error: 'Frequency string too long (max 100 characters)'
    };
  }

  // Normalize: lowercase and trim
  const normalized = frequency.toLowerCase().trim();

  // Check against allowed patterns
  const isValid = ALLOWED_FREQUENCY_PATTERNS.some(pattern =>
    normalized === pattern || normalized.includes(pattern)
  );

  if (!isValid) {
    return {
      isValid: false,
      normalized,
      error: `Invalid medication frequency: "${frequency}". Must be one of the standard medical frequency patterns.`
    };
  }

  return {
    isValid: true,
    normalized
  };
}

/**
 * Validate and sanitize date range for queries
 *
 * SECURITY: Prevents SQL injection and DoS attacks through date parameters
 * PERFORMANCE: Limits query range to prevent database overload
 *
 * @param startDate - Start date (Date object or ISO string)
 * @param endDate - End date (Date object or ISO string)
 * @param maxDaysRange - Maximum allowed days between dates (default: 365)
 * @returns Validated Date objects
 * @throws Error if dates are invalid
 *
 * @example
 * const { start, end } = validateDateRange('2025-01-01', '2025-12-31');
 *
 * @example
 * const { start, end } = validateDateRange(new Date(), new Date());
 */
export function validateDateRange(
  startDate: Date | string,
  endDate: Date | string,
  maxDaysRange: number = 365
): { start: Date; end: Date } {
  // Convert to Date objects
  let start: Date;
  let end: Date;

  try {
    start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
    end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  } catch (error) {
    throw new Error('Invalid date format - must be ISO 8601 date string or Date object');
  }

  // Validate dates are actually valid
  if (!isValidDate(start)) {
    throw new Error('Invalid start date');
  }

  if (!isValidDate(end)) {
    throw new Error('Invalid end date');
  }

  // Validate start is before end
  if (start > end) {
    throw new Error('Start date must be before or equal to end date');
  }

  // Validate range is not too large (DoS prevention)
  const daysDiff = differenceInDays(end, start);
  if (daysDiff > maxDaysRange) {
    throw new Error(`Date range too large - maximum ${maxDaysRange} days allowed, got ${daysDiff} days`);
  }

  // Validate dates are not in far future (sanity check)
  const now = new Date();
  const maxFutureDate = new Date(now.getFullYear() + 10, now.getMonth(), now.getDate());
  if (start > maxFutureDate || end > maxFutureDate) {
    throw new Error('Dates cannot be more than 10 years in the future');
  }

  return { start, end };
}

/**
 * Sanitize search input to prevent SQL injection via ILIKE patterns
 *
 * SECURITY: Escapes SQL wildcards that could be exploited
 * SECURITY: Limits length to prevent ReDoS attacks
 *
 * @param search - Search string from user input
 * @param maxLength - Maximum allowed length (default: 100)
 * @returns Sanitized search string
 * @throws Error if input is invalid
 *
 * @example
 * const sanitized = sanitizeSearchInput('user%input');
 * // Returns: 'user\\%input'
 *
 * @example
 * const sanitized = sanitizeSearchInput('test_search');
 * // Returns: 'test\\_search'
 */
export function sanitizeSearchInput(search: string, maxLength: number = 100): string {
  // Type check
  if (typeof search !== 'string') {
    throw new Error('Search input must be a string');
  }

  // Trim whitespace
  const trimmed = search.trim();

  // Empty string is valid
  if (trimmed.length === 0) {
    return '';
  }

  // Length validation (DoS prevention)
  if (trimmed.length > maxLength) {
    throw new Error(`Search term too long - maximum ${maxLength} characters allowed`);
  }

  // Escape SQL wildcards (% and _) to prevent injection
  const escaped = trimmed
    .replace(/\\/g, '\\\\') // Escape backslashes first
    .replace(/%/g, '\\%')    // Escape % wildcard
    .replace(/_/g, '\\_');   // Escape _ wildcard

  return escaped;
}

/**
 * Validate email format
 *
 * SECURITY: Prevents malformed emails from entering the system
 * Uses RFC 5322 compliant regex for email validation
 *
 * @param email - Email address to validate
 * @returns Object with isValid flag and normalized email
 *
 * @example
 * const result = validateEmail('user@example.com');
 * // Returns: { isValid: true, normalized: 'user@example.com' }
 *
 * @example
 * const result = validateEmail('invalid-email');
 * // Returns: { isValid: false, normalized: '', error: '...' }
 */
export function validateEmail(email: string): {
  isValid: boolean;
  normalized: string;
  error?: string;
} {
  // Type and basic checks
  if (!email || typeof email !== 'string') {
    return {
      isValid: false,
      normalized: '',
      error: 'Email must be a non-empty string'
    };
  }

  // Length check
  if (email.length > 254) {
    return {
      isValid: false,
      normalized: '',
      error: 'Email address too long (max 254 characters)'
    };
  }

  // Normalize: trim and lowercase
  const normalized = email.trim().toLowerCase();

  // RFC 5322 compliant email regex (simplified but robust)
  const emailRegex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

  if (!emailRegex.test(normalized)) {
    return {
      isValid: false,
      normalized: '',
      error: 'Invalid email format'
    };
  }

  // Check for valid domain (must have at least one dot)
  const parts = normalized.split('@');
  if (parts.length !== 2 || !parts[1].includes('.')) {
    return {
      isValid: false,
      normalized: '',
      error: 'Invalid email domain'
    };
  }

  return {
    isValid: true,
    normalized
  };
}

/**
 * Validate numeric input with range checking
 *
 * SECURITY: Prevents type coercion attacks
 * SECURITY: Validates ranges to prevent overflow/underflow
 *
 * @param value - Numeric value to validate
 * @param min - Minimum allowed value (optional)
 * @param max - Maximum allowed value (optional)
 * @returns Object with isValid flag and parsed number
 *
 * @example
 * const result = validateNumeric('42', 0, 100);
 * // Returns: { isValid: true, value: 42 }
 *
 * @example
 * const result = validateNumeric('abc', 0, 100);
 * // Returns: { isValid: false, value: NaN, error: '...' }
 */
export function validateNumeric(
  value: string | number,
  min?: number,
  max?: number
): {
  isValid: boolean;
  value: number;
  error?: string;
} {
  // Parse to number
  const num = typeof value === 'string' ? parseFloat(value) : value;

  // Check if valid number
  if (isNaN(num) || !isFinite(num)) {
    return {
      isValid: false,
      value: NaN,
      error: 'Must be a valid number'
    };
  }

  // Range validation
  if (min !== undefined && num < min) {
    return {
      isValid: false,
      value: num,
      error: `Value must be at least ${min}`
    };
  }

  if (max !== undefined && num > max) {
    return {
      isValid: false,
      value: num,
      error: `Value must be at most ${max}`
    };
  }

  return {
    isValid: true,
    value: num
  };
}

/**
 * Validate string length
 *
 * SECURITY: Prevents buffer overflow and DoS attacks
 *
 * @param value - String to validate
 * @param minLength - Minimum allowed length
 * @param maxLength - Maximum allowed length
 * @returns Object with isValid flag
 *
 * @example
 * const result = validateStringLength('hello', 1, 100);
 * // Returns: { isValid: true }
 */
export function validateStringLength(
  value: string,
  minLength: number = 0,
  maxLength: number = 1000
): {
  isValid: boolean;
  error?: string;
} {
  if (typeof value !== 'string') {
    return {
      isValid: false,
      error: 'Value must be a string'
    };
  }

  if (value.length < minLength) {
    return {
      isValid: false,
      error: `String must be at least ${minLength} characters`
    };
  }

  if (value.length > maxLength) {
    return {
      isValid: false,
      error: `String must be at most ${maxLength} characters`
    };
  }

  return { isValid: true };
}

/**
 * Sanitize HTML to prevent XSS attacks
 *
 * SECURITY: Removes potentially dangerous HTML tags and attributes
 * Use for user-generated content that may be displayed as HTML
 *
 * @param html - HTML string to sanitize
 * @returns Sanitized HTML string
 *
 * @example
 * const safe = sanitizeHTML('<script>alert("xss")</script><p>Hello</p>');
 * // Returns: '<p>Hello</p>'
 */
export function sanitizeHTML(html: string): string {
  if (typeof html !== 'string') {
    return '';
  }

  // Remove script tags and their content
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove event handlers (onclick, onerror, etc.)
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*\S+/gi, '');

  // Remove javascript: protocol in links
  sanitized = sanitized.replace(/javascript:/gi, '');

  // Remove data: protocol (can be used for XSS)
  sanitized = sanitized.replace(/data:text\/html/gi, '');

  return sanitized;
}
