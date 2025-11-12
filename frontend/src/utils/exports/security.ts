/**
 * @fileoverview Security Utilities Barrel Export
 * @module utils/exports/security
 * @category Utils
 *
 * Security utilities for sanitization, validation, and token management.
 * Provides protection against XSS attacks and ensures data integrity.
 *
 * @example
 * ```typescript
 * import { sanitizeText, sanitizeHtml, sanitizeUrl } from '@/utils';
 * import { TokenSecurityManager } from '@/utils';
 * ```
 */

// ============================================================================
// SANITIZATION UTILITIES
// ============================================================================

/**
 * Sanitization Utilities
 * Security utilities for sanitizing and validating user input to prevent
 * XSS attacks and ensure data integrity.
 */
export {
  sanitizeText,
  sanitizeHtml,
  sanitizeUrl,
  sanitizeFileName,
  sanitizeEmail,
  sanitizePhoneNumber,
  sanitizeId,
  sanitizeNumber,
  sanitizeDate,
  sanitizeSearchQuery,
  deepSanitizeObject,
  validateSafeHealthcareText,
  generateCSPNonce,
} from '../sanitization';

// ============================================================================
// TOKEN SECURITY MANAGEMENT
// ============================================================================

/**
 * Token Security Management
 * Secure token management utilities with encryption, expiration checking,
 * and secure storage patterns.
 */
export type {
  TokenData,
  EncryptedTokenData,
} from '../tokenSecurity';

export { TokenSecurityManager } from '../tokenSecurity';
