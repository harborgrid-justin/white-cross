/**
 * @fileoverview Enhanced Email Validation Utilities
 * @module utils/emailValidation
 * @description Provides comprehensive email validation including format checking,
 * disposable email detection, and common typo detection.
 *
 * SECURITY: Prevents disposable email abuse
 * SECURITY: Validates email format strictly
 * SECURITY: Detects common typos to improve data quality
 *
 * @security Email validation
 * @security Disposable email detection
 */

import { ValidationError } from '../errors/ServiceError';

/**
 * RFC 5322 compliant email regex
 * More strict than simple patterns
 */
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

/**
 * Common disposable email domains
 * Updated list from https://github.com/disposable-email-domains/disposable-email-domains
 */
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  '10minutemail.com',
  '10minutemail.net',
  'guerrillamail.com',
  'guerrillamail.net',
  'guerrillamail.org',
  'mailinator.com',
  'maildrop.cc',
  'tempmail.com',
  'temp-mail.org',
  'throwaway.email',
  'yopmail.com',
  'fakeinbox.com',
  'trashmail.com',
  'discard.email',
  'getnada.com',
  'mohmal.com',
  'sharklasers.com',
  'guerrillamail.biz',
  'guerrillamail.de',
  'guerrillamail.info',
  'spam4.me',
  'mailnesia.com',
  'mailcatch.com',
  'mintemail.com',
  'mytemp.email',
  'temp-mail.io',
  'tempail.com',
  'tempmailaddress.com',
  'tempr.email',
  'throwawaymail.com',
  'getairmail.com',
  'harakirimail.com',
  'jetable.org',
  'anonymousemail.me',
  'burnermail.io',
  'emailondeck.com'
  // Add more as needed
]);

/**
 * Common email providers and their correct domains
 * Used for typo detection
 */
const COMMON_EMAIL_DOMAINS: Record<string, string[]> = {
  'gmail.com': ['gmail.com', 'googlemail.com'],
  'yahoo.com': ['yahoo.com', 'ymail.com', 'rocketmail.com'],
  'outlook.com': ['outlook.com', 'hotmail.com', 'live.com', 'msn.com'],
  'icloud.com': ['icloud.com', 'me.com', 'mac.com'],
  'aol.com': ['aol.com']
};

/**
 * Common typos for popular email domains
 */
const COMMON_TYPOS: Record<string, string> = {
  'gmial.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gmil.com': 'gmail.com',
  'gmaill.com': 'gmail.com',
  'gamil.com': 'gmail.com',
  'yahooo.com': 'yahoo.com',
  'yaho.com': 'yahoo.com',
  'outlok.com': 'outlook.com',
  'outloo.com': 'outlook.com',
  'hotmial.com': 'hotmail.com',
  'hotmai.com': 'hotmail.com',
  'icoud.com': 'icloud.com',
  'iclod.com': 'icloud.com'
};

/**
 * Email validation result
 */
export interface EmailValidationResult {
  isValid: boolean;
  error?: string;
  suggestedCorrection?: string;
  warnings?: string[];
}

/**
 * Validate email format using RFC 5322 standard
 *
 * @param email - Email address to validate
 * @returns True if format is valid
 *
 * @example
 * const isValid = isValidEmailFormat('user@example.com'); // true
 * const isValid = isValidEmailFormat('invalid'); // false
 */
export function isValidEmailFormat(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }

  // Check length limits
  if (email.length > 254) {
    return false; // RFC 5321
  }

  // Check format
  return EMAIL_REGEX.test(email);
}

/**
 * Check if email domain is disposable/temporary
 *
 * @param email - Email address to check
 * @returns True if domain is disposable
 *
 * @example
 * const isDisposable = isDisposableEmail('user@mailinator.com'); // true
 * const isDisposable = isDisposableEmail('user@gmail.com'); // false
 */
export function isDisposableEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }

  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) {
    return false;
  }

  return DISPOSABLE_EMAIL_DOMAINS.has(domain);
}

/**
 * Check for common typos in email domain
 *
 * @param email - Email address to check
 * @returns Suggested correction if typo detected, null otherwise
 *
 * @example
 * const suggestion = checkEmailTypo('user@gmial.com'); // 'user@gmail.com'
 * const suggestion = checkEmailTypo('user@gmail.com'); // null
 */
export function checkEmailTypo(email: string): string | null {
  if (!email || typeof email !== 'string') {
    return null;
  }

  const [localPart, domain] = email.split('@');
  if (!domain) {
    return null;
  }

  const lowerDomain = domain.toLowerCase();

  // Check direct typo matches
  if (COMMON_TYPOS[lowerDomain]) {
    return `${localPart}@${COMMON_TYPOS[lowerDomain]}`;
  }

  // Check for similar domains using Levenshtein distance
  for (const [correctDomain, variants] of Object.entries(COMMON_EMAIL_DOMAINS)) {
    // Check if current domain is close to any variant
    if (calculateLevenshteinDistance(lowerDomain, correctDomain) <= 2) {
      return `${localPart}@${correctDomain}`;
    }
  }

  return null;
}

/**
 * Calculate Levenshtein distance between two strings
 * Used for fuzzy matching of email domains
 *
 * @param str1 - First string
 * @param str2 - Second string
 * @returns Edit distance between strings
 * @private
 */
function calculateLevenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

/**
 * Normalize email address
 * - Lowercase domain
 * - Remove dots from Gmail addresses (gmail treats user@gmail.com same as u.s.e.r@gmail.com)
 * - Trim whitespace
 *
 * @param email - Email address to normalize
 * @returns Normalized email address
 *
 * @example
 * const normalized = normalizeEmail('User@Gmail.com'); // 'user@gmail.com'
 * const normalized = normalizeEmail('u.s.e.r@gmail.com'); // 'user@gmail.com'
 */
export function normalizeEmail(email: string): string {
  if (!email || typeof email !== 'string') {
    return '';
  }

  const trimmed = email.trim().toLowerCase();
  const [localPart, domain] = trimmed.split('@');

  if (!domain) {
    return trimmed;
  }

  // Gmail-specific normalization
  if (COMMON_EMAIL_DOMAINS['gmail.com'].includes(domain)) {
    // Remove dots from local part (Gmail ignores them)
    const normalizedLocal = localPart.replace(/\./g, '');
    // Remove everything after + (Gmail plus addressing)
    const withoutPlus = normalizedLocal.split('+')[0];
    return `${withoutPlus}@${domain}`;
  }

  return trimmed;
}

/**
 * Comprehensive email validation
 * Performs format validation, disposable check, and typo detection
 *
 * @param email - Email address to validate
 * @param options - Validation options
 * @returns Validation result
 *
 * @throws {ValidationError} If validation fails
 *
 * @example
 * const result = validateEmail('user@gmail.com');
 * const result = validateEmail('user@gmial.com'); // Suggests correction
 * const result = validateEmail('user@mailinator.com', { allowDisposable: false }); // Fails
 */
export function validateEmail(
  email: string,
  options: {
    allowDisposable?: boolean;
    throwOnError?: boolean;
  } = {}
): EmailValidationResult {
  const { allowDisposable = false, throwOnError = false } = options;

  const result: EmailValidationResult = {
    isValid: true,
    warnings: []
  };

  // Type check
  if (!email || typeof email !== 'string') {
    result.isValid = false;
    result.error = 'Email must be a non-empty string';
    if (throwOnError) {
      throw new ValidationError(result.error);
    }
    return result;
  }

  // Trim whitespace
  const trimmedEmail = email.trim();

  // Format validation
  if (!isValidEmailFormat(trimmedEmail)) {
    result.isValid = false;
    result.error = 'Invalid email format';
    if (throwOnError) {
      throw new ValidationError(result.error);
    }
    return result;
  }

  // Typo detection
  const suggestion = checkEmailTypo(trimmedEmail);
  if (suggestion) {
    result.warnings!.push(`Did you mean "${suggestion}"?`);
    result.suggestedCorrection = suggestion;
  }

  // Disposable email detection
  if (!allowDisposable && isDisposableEmail(trimmedEmail)) {
    result.isValid = false;
    result.error = 'Disposable email addresses are not allowed';
    if (throwOnError) {
      throw new ValidationError(result.error);
    }
    return result;
  }

  // Local part length check (RFC 5321)
  const localPart = trimmedEmail.split('@')[0];
  if (localPart.length > 64) {
    result.isValid = false;
    result.error = 'Email local part too long (max 64 characters)';
    if (throwOnError) {
      throw new ValidationError(result.error);
    }
    return result;
  }

  return result;
}

/**
 * Validate and normalize email
 * Performs validation and returns normalized email
 *
 * @param email - Email address
 * @param options - Validation options
 * @returns Normalized email address
 *
 * @throws {ValidationError} If validation fails
 *
 * @example
 * const email = validateAndNormalizeEmail('User@Gmail.com'); // 'user@gmail.com'
 */
export function validateAndNormalizeEmail(
  email: string,
  options?: {
    allowDisposable?: boolean;
  }
): string {
  const validation = validateEmail(email, { ...options, throwOnError: true });

  if (!validation.isValid) {
    throw new ValidationError(validation.error || 'Invalid email');
  }

  return normalizeEmail(email);
}

/**
 * Check if email belongs to common free email provider
 *
 * @param email - Email address
 * @returns True if free email provider
 *
 * @example
 * const isFree = isFreeEmailProvider('user@gmail.com'); // true
 * const isFree = isFreeEmailProvider('user@company.com'); // false
 */
export function isFreeEmailProvider(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }

  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) {
    return false;
  }

  const freeProviders = Object.keys(COMMON_EMAIL_DOMAINS);
  return freeProviders.includes(domain) ||
    Object.values(COMMON_EMAIL_DOMAINS).flat().includes(domain);
}

/**
 * Extract domain from email address
 *
 * @param email - Email address
 * @returns Domain part of email
 *
 * @example
 * const domain = extractEmailDomain('user@example.com'); // 'example.com'
 */
export function extractEmailDomain(email: string): string {
  if (!email || typeof email !== 'string') {
    return '';
  }

  const domain = email.split('@')[1];
  return domain ? domain.toLowerCase() : '';
}

/**
 * Add custom disposable email domain
 * Useful for adding organization-specific blocked domains
 *
 * @param domain - Domain to add to disposable list
 *
 * @example
 * addDisposableEmailDomain('badprovider.com');
 */
export function addDisposableEmailDomain(domain: string): void {
  if (domain && typeof domain === 'string') {
    DISPOSABLE_EMAIL_DOMAINS.add(domain.toLowerCase());
  }
}

/**
 * Batch validate multiple emails
 *
 * @param emails - Array of email addresses
 * @param options - Validation options
 * @returns Map of email to validation result
 *
 * @example
 * const results = batchValidateEmails(['user1@gmail.com', 'user2@mailinator.com']);
 */
export function batchValidateEmails(
  emails: string[],
  options?: { allowDisposable?: boolean }
): Map<string, EmailValidationResult> {
  const results = new Map<string, EmailValidationResult>();

  for (const email of emails) {
    const result = validateEmail(email, { ...options, throwOnError: false });
    results.set(email, result);
  }

  return results;
}

/**
 * Export email validation utilities
 */
export default {
  isValidEmailFormat,
  isDisposableEmail,
  checkEmailTypo,
  normalizeEmail,
  validateEmail,
  validateAndNormalizeEmail,
  isFreeEmailProvider,
  extractEmailDomain,
  addDisposableEmailDomain,
  batchValidateEmails
};
