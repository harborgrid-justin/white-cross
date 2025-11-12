/**
 * Security Service Module
 *
 * Modular security functionality for the White Cross platform
 */

// Core service
export { SecurityService, securityService } from './SecurityService';

// Component managers
export { SanitizationManager } from './SanitizationManager';
export { EncryptionManager } from './EncryptionManager';
export { PHIManager } from './PHIManager';
export { SecurityConfigManager } from './SecurityConfigManager';

// Individual services for advanced usage
export { SecureTokenManager, secureTokenManager } from './SecureTokenManager';
export { CsrfProtection, csrfProtection, setupCsrfProtection } from './CsrfProtection';

// Types
export type {
  CSPDirectives,
  SecurityHeaders,
  CORSConfig,
  RateLimitConfig,
  SessionConfig,
  PasswordPolicy,
  AuditConfig,
  UploadConfig,
  PHIPatterns,
  SanitizationOptions,
  EncryptionOptions,
  SecurityConfig,
} from './types';

// Legacy utility exports for backward compatibility
export {
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
  sanitizeHTML,
  sanitizeSQL,
  sanitizeFileName,
  sanitizeURL,
  sanitizeEmail,
  sanitizePhone,
  stripHTMLTags,
  sanitizeObject,
  encryptData,
  decryptData,
  hashData,
  generateEncryptionKey,
} from './SecurityService';
