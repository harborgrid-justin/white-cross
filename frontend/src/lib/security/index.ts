/**
 * Security Library - Consolidated Barrel Export
 *
 * Centralized export point for all security utilities.
 * This module now re-exports from the consolidated services/security/
 * for unified security management while maintaining backward compatibility.
 *
 * @module lib/security
 * @since 2025-10-26
 * @updated 2025-11-12 - Consolidated with services/security/
 *
 * @example
 * ```typescript
 * // Import consolidated security service (recommended)
 * import { securityService } from '@/services/security';
 *
 * // Legacy imports still work (backward compatibility)
 * import { generateCSRFToken, sanitizeHTML, encryptData } from '@/lib/security';
 * ```
 */

// ============================================================================
// CONSOLIDATED SECURITY SERVICE (RECOMMENDED)
// ============================================================================

/**
 * Consolidated Security Service - All-in-one security solution
 * Recommended for new code - provides unified security API
 */
export {
  SecurityService,
  securityService,
} from '@/services/security';

// ============================================================================
// BACKWARD COMPATIBILITY EXPORTS
// ============================================================================

/**
 * Legacy CSRF utilities - now powered by enterprise-grade CsrfProtection
 */
export {
  generateCSRFToken,
  getCSRFToken,
  validateCSRFToken,
  clearCSRFToken,
} from '@/services/security';

/**
 * Legacy input sanitization utilities
 */
export {
  sanitizeHTML,
  sanitizeSQL,
  sanitizeFileName,
  sanitizeURL,
  sanitizeEmail,
  sanitizePhone,
  stripHTMLTags,
  sanitizeObject,
} from '@/services/security';

/**
 * Legacy encryption utilities
 */
export {
  encryptData,
  decryptData,
  hashData,
  generateEncryptionKey,
} from '@/services/security';

/**
 * Security configuration (unchanged)
 */
export {
  CSP_DIRECTIVES,
  generateCSPHeader,
  SECURITY_HEADERS,
  CORS_CONFIG,
  RATE_LIMIT_CONFIG,
  SESSION_CONFIG,
  PASSWORD_POLICY,
  AUDIT_CONFIG,
  UPLOAD_CONFIG,
  PHI_PATTERNS,
  containsPHI,
  redactPHI,
} from '@/services/security';

/**
 * Individual service access (for advanced use cases)
 */
export {
  CsrfProtection,
  csrfProtection,
  setupCsrfProtection,
  SecureTokenManager,
  secureTokenManager,
} from '@/services/security';

/**
 * Security Module Overview
 *
 * This module provides a comprehensive security toolkit for the White Cross
 * healthcare platform, designed with HIPAA compliance and PHI protection
 * as core requirements.
 *
 * **NEW: Consolidated Architecture**
 * - All security functionality now unified in services/security/
 * - Enterprise-grade implementations with backward compatibility
 * - Single source of truth for security features
 *
 * Key Features:
 *
 * 1. **Consolidated Security Service**
 *    - Unified API for all security operations
 *    - Enterprise-grade CSRF protection
 *    - HIPAA-compliant token management
 *    - Comprehensive encryption and sanitization
 *
 * 2. **CSRF Protection**
 *    - Token generation and validation
 *    - Automatic header injection
 *    - Session-based token management
 *
 * 3. **Input Sanitization**
 *    - XSS prevention through HTML sanitization
 *    - SQL injection prevention
 *    - Path traversal protection
 *    - URL validation and protocol filtering
 *    - Recursive object sanitization
 *
 * 4. **Encryption**
 *    - AES-GCM encryption for sensitive data
 *    - SHA-256 hashing for one-way operations
 *    - Form data encryption (with IV and auth tags)
 *    - Document encryption for file uploads
 *    - User-specific key derivation
 *    - Field-level encryption utilities
 *
 * 5. **Security Configuration**
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
 * Migration Guide:
 * - **New Code**: Use `securityService` from `@/services/security`
 * - **Existing Code**: Continue using `@/lib/security` imports (backward compatible)
 * - **Advanced Use Cases**: Access individual services when needed
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
 * - @/services/security - Consolidated security services (primary)
 * - @/middleware/security - Security middleware for Next.js
 * - @/middleware/rateLimit - Rate limiting middleware
 * - @/middleware/audit - Audit logging middleware
 *
 * @see {@link https://www.hhs.gov/hipaa/for-professionals/security/index.html | HIPAA Security Rule}
 * @see {@link https://owasp.org/www-project-top-ten/ | OWASP Top 10}
 */
