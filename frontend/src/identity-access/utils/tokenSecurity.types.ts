/**
 * @fileoverview Token Security Type Definitions
 * @module identity-access/utils/tokenSecurity.types
 *
 * Provides TypeScript type definitions and configuration constants for the token security system.
 * This module defines data structures for encrypted and unencrypted token storage, along with
 * security configuration constants used throughout the authentication system.
 *
 * Security Considerations:
 * - Token data contains sensitive user information and authentication tokens
 * - Encryption uses AES-GCM with 256-bit keys
 * - Expiration timestamps prevent use of stale tokens
 * - Legacy keys support backward compatibility during migration
 *
 * Related Modules:
 * - tokenSecurity.storage: Uses these types for token storage operations
 * - tokenSecurity.encryption: Uses EncryptedTokenData for encryption operations
 * - tokenSecurity.validation: Uses TokenData for validation logic
 *
 * @since 2025-11-04
 */

import { User } from '@/types';

/**
 * Token data structure containing authentication token and metadata.
 *
 * This interface represents the complete token data stored in the application,
 * including the JWT token, associated user information, and temporal metadata
 * for expiration tracking.
 *
 * @interface TokenData
 *
 * @property {string} token - JWT authentication token string
 * @property {User} user - Complete user object associated with this token
 * @property {number} expiresAt - Unix timestamp (milliseconds) when token expires
 * @property {number} issuedAt - Unix timestamp (milliseconds) when token was issued
 *
 * @example
 * ```typescript
 * const tokenData: TokenData = {
 *   token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
 *   user: { id: '123', email: 'nurse@example.com', role: 'NURSE' },
 *   expiresAt: Date.now() + 86400000, // 24 hours from now
 *   issuedAt: Date.now()
 * };
 * ```
 *
 * @see {@link TokenSecurityManager.storeToken} for token storage
 * @see {@link TokenSecurityManager.getValidToken} for token retrieval
 */
export interface TokenData {
  token: string
  user: User
  expiresAt: number
  issuedAt: number
}

/**
 * Encrypted token data structure for secure localStorage storage.
 *
 * Contains the encrypted token data along with the initialization vector (IV)
 * required for AES-GCM decryption. The timestamp helps track when data was
 * encrypted and can be used for additional security checks.
 *
 * @interface EncryptedTokenData
 *
 * @property {string} data - Base64-encoded encrypted token data
 * @property {string} iv - Base64-encoded initialization vector for AES-GCM decryption
 * @property {number} timestamp - Unix timestamp (milliseconds) when data was encrypted
 *
 * @example
 * ```typescript
 * const encrypted: EncryptedTokenData = {
 *   data: 'k7JHg92nVbX...',  // Base64 encrypted data
 *   iv: 'pLm9Qw8r...',        // Base64 IV
 *   timestamp: Date.now()
 * };
 * ```
 *
 * @remarks
 * - Uses AES-GCM encryption with 256-bit keys
 * - IV must be unique for each encryption operation
 * - Never reuse IVs with the same encryption key
 *
 * @see {@link EncryptionManager.encryptData} for encryption
 * @see {@link EncryptionManager.decryptData} for decryption
 */
export interface EncryptedTokenData {
  data: string
  iv: string
  timestamp: number
}

/**
 * Configuration constants for token security operations.
 *
 * Defines all configuration values used throughout the token security system,
 * including storage keys, expiration buffers, and legacy key mappings for
 * backward compatibility.
 *
 * @constant
 * @type {Object}
 * @readonly
 *
 * @property {string} STORAGE_KEY - Primary localStorage key for encrypted token data
 * @property {string} ENCRYPTION_KEY_NAME - localStorage key for AES-GCM encryption key
 * @property {number} TOKEN_EXPIRY_BUFFER - Time buffer (5 minutes) before token expiration to trigger refresh
 * @property {number} DEFAULT_TOKEN_LIFETIME - Default token lifetime (24 hours) in milliseconds
 * @property {string[]} LEGACY_TOKEN_KEYS - Legacy localStorage keys for token migration
 * @property {string} LEGACY_USER_KEY - Legacy localStorage key for user data migration
 *
 * @example
 * ```typescript
 * // Check if token is expiring soon
 * const timeRemaining = tokenData.expiresAt - Date.now();
 * if (timeRemaining < TOKEN_SECURITY_CONFIG.TOKEN_EXPIRY_BUFFER) {
 *   // Trigger token refresh
 *   await refreshAuthToken();
 * }
 * ```
 *
 * @remarks
 * Security Considerations:
 * - STORAGE_KEY should be unique to prevent collisions with other app data
 * - TOKEN_EXPIRY_BUFFER provides time for refresh before hard expiration
 * - LEGACY_TOKEN_KEYS support migration from previous auth implementations
 * - All legacy keys are cleared on new token storage for security
 *
 * @since 2025-11-04
 */
export const TOKEN_SECURITY_CONFIG = {
  STORAGE_KEY: 'auth_data',
  ENCRYPTION_KEY_NAME: 'auth_encryption_key',
  TOKEN_EXPIRY_BUFFER: 5 * 60 * 1000, // 5 minutes buffer
  DEFAULT_TOKEN_LIFETIME: 24 * 60 * 60 * 1000, // 24 hours
  LEGACY_TOKEN_KEYS: ['auth_token', 'token', 'authToken'],
  LEGACY_USER_KEY: 'user'
} as const;
