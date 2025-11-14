/**
 * @fileoverview Token Manager Type Definitions
 * @module services/security/tokenManager/types
 * @category Security - Token Management
 */

/**
 * Token metadata stored alongside the authentication token.
 *
 * This interface tracks token lifecycle, expiration, and user activity
 * for HIPAA-compliant session management and automatic timeout enforcement.
 *
 * @property {string} token - JWT access token for API authentication
 * @property {string} [refreshToken] - Optional refresh token for token renewal
 * @property {number} issuedAt - Timestamp when token was stored (milliseconds since epoch)
 * @property {number} expiresAt - Timestamp when token expires (milliseconds since epoch)
 * @property {number} lastActivity - Timestamp of last user activity for inactivity timeout
 */
export interface TokenMetadata {
  token: string;
  refreshToken?: string;
  issuedAt: number;
  expiresAt: number;
  lastActivity: number;
}

/**
 * Zustand auth storage structure for backward compatibility.
 *
 * Maintains compatibility with legacy Zustand-based authentication state
 * management while transitioning to secure token manager.
 *
 * @property {object} state - Authentication state object
 * @property {string | null} state.token - JWT access token or null
 * @property {unknown | null} state.user - User object or null
 * @property {number} version - State version for migration tracking
 */
export interface ZustandAuthStorage {
  state: {
    token: string | null;
    user: unknown | null;
    [key: string]: unknown;
  };
  version: number;
}

/**
 * Storage keys used by the token manager
 */
export interface StorageKeys {
  readonly TOKEN_KEY: string;
  readonly REFRESH_TOKEN_KEY: string;
  readonly METADATA_KEY: string;
  readonly ZUSTAND_KEY: string;
  readonly LEGACY_TOKEN_KEY: string;
  readonly LEGACY_REFRESH_KEY: string;
}

/**
 * Token validation result with detailed information
 */
export interface TokenValidationResult {
  isValid: boolean;
  reason?: 'expired' | 'inactive' | 'missing' | 'invalid';
  timeUntilExpiration?: number;
  timeSinceActivity?: number;
}
