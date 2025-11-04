/**
 * Security Library - Barrel Export
 *
 * Centralized export point for all security utilities.
 * This module provides comprehensive security features for the White Cross
 * healthcare platform, including CSRF protection, input sanitization,
 * encryption, and security configuration.
 *
 * @module lib/security
 * @since 2025-10-26
 *
 * @example
 * ```typescript
 * // Import specific utilities
 * import { generateCSRFToken, sanitizeHTML, encryptData } from '@/lib/security';
 *
 * // Import configuration
 * import { SECURITY_HEADERS, SESSION_CONFIG } from '@/lib/security';
 *
 * // Import encryption utilities
 * import { encryptFormData, decryptFormData } from '@/lib/security';
 * ```
 */

// ============================================================================
// CSRF Protection Utilities
// ============================================================================

export {
  generateCSRFToken,
  getCSRFToken,
  validateCSRFToken,
  clearCSRFToken,
  addCSRFHeader,
  getCSRFHeaderName,
} from './csrf';

// ============================================================================
// Input Sanitization Utilities
// ============================================================================

export {
  sanitizeHTML,
  sanitizeSQL,
  sanitizeFileName,
  sanitizeURL,
  sanitizeEmail,
  sanitizePhone,
  stripHTMLTags,
  sanitizeObject,
} from './sanitization';

// ============================================================================
// Basic Encryption Utilities
// ============================================================================

export {
  encryptData,
  decryptData,
  hashData,
  generateEncryptionKey,
} from './encryption';

// ============================================================================
// Security Configuration
// ============================================================================

export {
  // CSP Configuration
  CSP_DIRECTIVES,
  generateCSPHeader,

  // Security Headers
  SECURITY_HEADERS,

  // CORS Configuration
  CORS_CONFIG,

  // Rate Limiting Configuration
  RATE_LIMIT_CONFIG,

  // Session Configuration (HIPAA Compliant)
  SESSION_CONFIG,

  // Password Policy
  PASSWORD_POLICY,

  // Audit Configuration
  AUDIT_CONFIG,

  // File Upload Configuration
  UPLOAD_CONFIG,

  // PHI Detection & Redaction
  PHI_PATTERNS,
  containsPHI,
  redactPHI,
} from './config';

// ============================================================================
// Advanced Encryption for Forms and Documents
// ============================================================================

export {
  // Type definitions
  type EncryptedData,
  type EncryptionOptions,

  // Key generation
  generateFormKey,
  generateUserKey,

  // Form data encryption
  encryptFormData,
  decryptFormData,

  // Document encryption
  encryptDocument,
  decryptDocument,

  // Field-level encryption
  encryptFieldValue,
  decryptFieldValue,

  // Utilities
  verifyEncryptedData,
} from './encryption-forms';

/**
 * Security Module Overview
 *
 * This module provides a comprehensive security toolkit for the White Cross
 * healthcare platform, designed with HIPAA compliance and PHI protection
 * as core requirements.
 *
 * Key Features:
 *
 * 1. CSRF Protection
 *    - Token generation and validation
 *    - Automatic header injection
 *    - Session-based token management
 *
 * 2. Input Sanitization
 *    - XSS prevention through HTML sanitization
 *    - SQL injection prevention
 *    - Path traversal protection
 *    - URL validation and protocol filtering
 *    - Recursive object sanitization
 *
 * 3. Encryption
 *    - AES-GCM encryption for sensitive data
 *    - SHA-256 hashing for one-way operations
 *    - Form data encryption (with IV and auth tags)
 *    - Document encryption for file uploads
 *    - User-specific key derivation
 *    - Field-level encryption utilities
 *
 * 4. Security Configuration
 *    - Content Security Policy (CSP) directives
 *    - Security headers (HSTS, X-Frame-Options, etc.)
 *    - CORS configuration
 *    - Rate limiting settings
 *    - HIPAA-compliant session management
 *    - Password policy enforcement
 *    - Audit logging configuration
 *    - File upload restrictions
 *    - PHI pattern detection and redaction
 *
 * HIPAA Compliance Features:
 * - 15-minute idle timeout for sessions
 * - Encryption at rest and in transit
 * - Comprehensive audit logging (7-year retention)
 * - PHI detection and automatic redaction
 * - Secure token management
 * - Access control and authentication
 *
 * Security Best Practices:
 * - Always sanitize user input before processing or display
 * - Use CSRF tokens for all state-changing operations
 * - Encrypt PHI data before storage
 * - Implement rate limiting on sensitive endpoints
 * - Apply security headers to all responses
 * - Validate and log all PHI access
 * - Use strong password policies
 * - Implement proper session timeout mechanisms
 *
 * Module Dependencies:
 * - No external dependencies (uses Web Crypto API)
 * - Compatible with both browser and Node.js environments
 * - TypeScript strict mode compliant
 *
 * Related Modules:
 * - @/services/security - Security services (token management, etc.)
 * - @/middleware/security - Security middleware for Next.js
 * - @/middleware/rateLimit - Rate limiting middleware
 * - @/middleware/audit - Audit logging middleware
 *
 * @see {@link https://www.hhs.gov/hipaa/for-professionals/security/index.html | HIPAA Security Rule}
 * @see {@link https://owasp.org/www-project-top-ten/ | OWASP Top 10}
 */
