/**
 * WF-COMP-354 | tokenSecurity.ts - Main barrel export for token security
 * Purpose: Central export point for all token security modules
 * Upstream: All tokenSecurity.* modules | Dependencies: All modules
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: All tokenSecurity modules
 * Exports: All types, functions, classes from submodules | Key Features: Unified API
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Component mount → Token operations → Security modules
 * LLM Context: Main barrel export maintaining backward compatibility
 */

/**
 * Secure token management utilities for healthcare platform
 * Implements encryption, expiration checking, and secure storage patterns
 *
 * This module has been refactored into focused submodules:
 * - tokenSecurity.types.ts: Type definitions and interfaces
 * - tokenSecurity.encryption.ts: Encryption/decryption utilities
 * - tokenSecurity.storage.ts: Token storage management
 * - tokenSecurity.validation.ts: Token validation functions
 * - tokenSecurity.legacy.ts: Legacy compatibility utilities
 *
 * All exports are re-exported from this file for backward compatibility.
 */

// Type definitions
export type {
  TokenData,
  EncryptedTokenData
} from './tokenSecurity.types';

export {
  TOKEN_SECURITY_CONFIG
} from './tokenSecurity.types';

// Encryption utilities
export {
  EncryptionManager,
  encryptionManager
} from './tokenSecurity.encryption';

// Storage management
export {
  TokenSecurityManager,
  tokenSecurityManager
} from './tokenSecurity.storage';

// Validation functions
export {
  validateTokenFormat,
  getTokenExpiration,
  isTokenExpired,
  getTokenTimeRemaining,
  isTokenExpiringSoon,
  decodeTokenPayload
} from './tokenSecurity.validation';

// Legacy utilities (backward compatibility)
export {
  legacyTokenUtils
} from './tokenSecurity.legacy';

/**
 * Default export for convenience
 * Provides the main token security manager instance
 */
export { tokenSecurityManager as default } from './tokenSecurity.storage';
