/**
 * @fileoverview Secure Token Manager - Main Orchestrator
 * @module services/security/tokenManager
 * @category Security - Token Management
 */

import type { ITokenManager } from '../../core/interfaces/ITokenManager';
import { TokenStorage } from './storage';
import { TokenValidator, JwtParser } from './validation';
import { TokenMigration } from './migration';
import { ActivityTracker } from './activityTracker';
import type { TokenMetadata } from './types';

/**
 * Enterprise-grade secure token manager for healthcare platform
 *
 * Features:
 * - Uses sessionStorage instead of localStorage for enhanced security
 * - Automatic token expiration validation
 * - Inactivity timeout (8 hours from SECURITY_CONFIG)
 * - Automatic cleanup on expiration
 * - JWT expiration parsing and validation
 * - Thread-safe singleton pattern
 * - Modular architecture with focused responsibilities
 *
 * Security Benefits:
 * - sessionStorage is cleared when browser/tab closes
 * - Prevents token persistence across sessions
 * - Implements defense-in-depth for PHI protection
 * - Complies with HIPAA security requirements
 *
 * @example
 * ```typescript
 * const tokenManager = secureTokenManager;
 *
 * // Store token
 * tokenManager.setToken('jwt-token', 'refresh-token');
 *
 * // Validate token
 * const isValid = tokenManager.isTokenValid();
 *
 * // Get token (returns null if expired)
 * const token = tokenManager.getToken();
 *
 * // Clear all tokens
 * tokenManager.clearTokens();
 * ```
 */
export class SecureTokenManager implements ITokenManager {
  private static instance: SecureTokenManager | null = null;
  private activityTracker: ActivityTracker;

  private constructor() {
    this.activityTracker = ActivityTracker.getInstance();
    this.initialize();
  }

  /**
   * Get singleton instance of SecureTokenManager.
   *
   * Implements thread-safe singleton pattern to ensure only one token manager
   * exists throughout the application lifecycle. First call initializes the
   * instance with automatic cleanup and token migration from legacy storage.
   *
   * Security Benefits:
   * - Centralized token management prevents inconsistent state
   * - Single cleanup lifecycle for proper resource management
   * - Consistent security policies across all API calls
   *
   * @returns {SecureTokenManager} Singleton instance of SecureTokenManager
   *
   * @example
   * ```typescript
   * const tokenManager = SecureTokenManager.getInstance();
   * tokenManager.setToken(accessToken, refreshToken);
   * ```
   */
  public static getInstance(): SecureTokenManager {
    if (!SecureTokenManager.instance) {
      SecureTokenManager.instance = new SecureTokenManager();
    }
    return SecureTokenManager.instance;
  }

  /**
   * Initialize the token manager
   * 
   * Performs migration from legacy storage and initializes the activity tracker.
   * Called automatically during instance creation.
   */
  private initialize(): void {
    try {
      // Initialize migration system and perform any needed migrations
      const initResult = TokenMigration.initialize();
      
      if (initResult.details.length > 0) {
        console.info('[SecureTokenManager] Initialization completed:', {
          migrationPerformed: initResult.migrationPerformed,
          repairPerformed: initResult.repairPerformed,
          finalStatus: initResult.finalStatus,
          details: initResult.details,
        });
      }
    } catch (error) {
      console.error('[SecureTokenManager] Failed to initialize:', error);
    }
  }

  /**
   * Store authentication token securely in sessionStorage.
   *
   * Validates and stores JWT access token with metadata tracking for expiration
   * and activity monitoring. Parses JWT to extract expiration time or uses
   * provided expiresIn parameter. Rejects already-expired tokens.
   *
   * Storage Mechanism:
   * - Token: sessionStorage (cleared on browser/tab close)
   * - Metadata: Includes issuedAt, expiresAt, lastActivity timestamps
   * - Backward compatibility: Updates Zustand storage for legacy code
   *
   * Security Features:
   * - Validates token format and expiration before storage
   * - Throws error on invalid or expired tokens
   * - Uses sessionStorage to prevent cross-session persistence
   * - Automatic activity tracking for inactivity timeout
   *
   * HIPAA Compliance:
   * - Implements secure token storage with automatic expiration
   * - Limits token lifetime to prevent unauthorized access
   * - Enforces session timeout requirements
   *
   * @param {string} token - JWT access token to store
   * @param {string} [refreshToken] - Optional refresh token for token renewal
   * @param {number} [expiresIn] - Optional custom expiration in seconds (defaults to JWT exp or 24 hours)
   *
   * @throws {Error} If token is invalid (not a string or empty)
   * @throws {Error} If token is already expired
   *
   * @example
   * ```typescript
   * // Store token with refresh token
   * secureTokenManager.setToken(accessToken, refreshToken);
   *
   * // Store token with custom expiration (1 hour)
   * secureTokenManager.setToken(accessToken, undefined, 3600);
   *
   * // Handle errors
   * try {
   *   secureTokenManager.setToken(token);
   * } catch (error) {
   *   console.error('Failed to store token:', error);
   * }
   * ```
   */
  public setToken(token: string, refreshToken?: string, expiresIn?: number): void {
    try {
      // Create and validate metadata
      const metadata = TokenValidator.createTokenMetadata(token, refreshToken, expiresIn);

      // Store using storage module
      TokenStorage.setTokenData(metadata);

      // Update Zustand storage for backward compatibility
      TokenStorage.updateZustandStorage(token);

      console.info('[SecureTokenManager] Token stored successfully', {
        expiresAt: new Date(metadata.expiresAt).toISOString(),
        hasRefreshToken: !!refreshToken,
      });
    } catch (error) {
      console.error('[SecureTokenManager] Failed to store token:', error);
      throw error;
    }
  }

  /**
   * Retrieve authentication token if valid.
   *
   * Returns the stored JWT access token after validating expiration and
   * inactivity timeout. Automatically updates last activity timestamp to
   * track user session. Returns null if token is expired, invalid, or
   * doesn't exist.
   *
   * Validation Checks:
   * 1. Token exists in sessionStorage
   * 2. Token hasn't reached expiration time (from JWT exp claim)
   * 3. Session hasn't exceeded inactivity timeout (8 hours)
   * 4. Metadata is valid and parseable
   *
   * Security Features:
   * - Automatic validation prevents use of expired tokens
   * - Activity tracking for inactivity timeout enforcement
   * - Automatic cleanup on validation failure
   * - Fail-safe returns null on any error
   *
   * HIPAA Compliance:
   * - Enforces session timeout after 8 hours of inactivity
   * - Prevents access with expired credentials
   * - Implements automatic session termination
   *
   * @returns {string | null} JWT access token if valid, null otherwise
   *
   * @example
   * ```typescript
   * const token = secureTokenManager.getToken();
   * if (token) {
   *   // Use token for API request
   *   apiClient.setAuthHeader(token);
   * } else {
   *   // Token expired or invalid, redirect to login
   *   redirectToLogin();
   * }
   * ```
   *
   * @remarks
   * This method is called automatically by API interceptors before each
   * authenticated request. It serves as the primary token validation
   * mechanism for the application.
   */
  public getToken(): string | null {
    try {
      const metadata = TokenStorage.getTokenMetadata();
      if (!metadata) {
        return null;
      }

      // Validate token
      if (!TokenValidator.isTokenValid(metadata)) {
        this.clearTokens();
        return null;
      }

      // Update last activity through activity tracker
      this.activityTracker.updateActivity();

      return metadata.token;
    } catch (error) {
      console.error('[SecureTokenManager] Failed to retrieve token:', error);
      return null;
    }
  }

  /**
   * Retrieve refresh token if valid.
   *
   * Returns the stored refresh token after validating the associated access
   * token's expiration and inactivity status. Used for obtaining new access
   * tokens without requiring user re-authentication.
   *
   * Security Features:
   * - Validates access token before returning refresh token
   * - Returns null if session is expired or inactive
   * - Automatic cleanup on validation failure
   * - Prevents use of orphaned refresh tokens
   *
   * Token Refresh Flow:
   * 1. Access token expires
   * 2. Get refresh token using this method
   * 3. Send refresh token to auth endpoint
   * 4. Receive new access token
   * 5. Store new token using setToken()
   *
   * @returns {string | null} Refresh token if valid, null otherwise
   *
   * @example
   * ```typescript
   * const refreshToken = secureTokenManager.getRefreshToken();
   * if (refreshToken) {
   *   // Use refresh token to get new access token
   *   const newAccessToken = await authApi.refreshToken(refreshToken);
   *   secureTokenManager.setToken(newAccessToken, refreshToken);
   * } else {
   *   // No valid refresh token, redirect to login
   *   redirectToLogin();
   * }
   * ```
   */
  public getRefreshToken(): string | null {
    try {
      const metadata = TokenStorage.getTokenMetadata();
      if (!metadata || !metadata.refreshToken) {
        return null;
      }

      // Validate token
      if (!TokenValidator.isTokenValid(metadata)) {
        this.clearTokens();
        return null;
      }

      return metadata.refreshToken;
    } catch (error) {
      console.error('[SecureTokenManager] Failed to retrieve refresh token:', error);
      return null;
    }
  }

  /**
   * Check if current token is valid.
   *
   * Performs comprehensive validation of token expiration and inactivity
   * timeout. Used internally by getToken() and externally for manual
   * session validation checks.
   *
   * Validation Criteria:
   * 1. Token metadata exists and is parseable
   * 2. Current time is before token expiration (JWT exp claim)
   * 3. Session hasn't exceeded 8-hour inactivity timeout
   *
   * Security Features:
   * - Dual validation: expiration + inactivity timeout
   * - Logs validation failures for audit trail
   * - Fail-safe returns false on any error
   * - Configurable inactivity timeout from SECURITY_CONFIG
   *
   * HIPAA Compliance:
   * - Enforces automatic session timeout requirements
   * - Implements defense-in-depth validation
   * - Provides audit logging for session expiration
   *
   * @param {TokenMetadata} [metadata] - Optional metadata to validate (fetches current if not provided)
   * @returns {boolean} True if token is valid, false otherwise
   *
   * @example
   * ```typescript
   * // Check token validity before sensitive operation
   * if (secureTokenManager.isTokenValid()) {
   *   await updatePatientRecord(data);
   * } else {
   *   showSessionExpiredModal();
   * }
   *
   * // Validate specific metadata
   * const metadata = getStoredMetadata();
   * const isValid = secureTokenManager.isTokenValid(metadata);
   * ```
   *
   * @see {@link SECURITY_CONFIG} for SESSION_TIMEOUT configuration
   */
  public isTokenValid(metadata?: TokenMetadata): boolean {
    try {
      const meta = metadata || TokenStorage.getTokenMetadata();
      return TokenValidator.isTokenValid(meta);
    } catch (error) {
      console.error('[SecureTokenManager] Failed to validate token:', error);
      return false;
    }
  }

  /**
   * Get time remaining until token expiration.
   *
   * Calculates remaining time based on token's expiresAt timestamp.
   * Useful for proactive token refresh and session expiration warnings.
   *
   * Use Cases:
   * - Display countdown timers for session expiration
   * - Trigger proactive token refresh before expiration
   * - Schedule session timeout warnings
   * - Monitor token lifetime for debugging
   *
   * @returns {number} Milliseconds until expiration, or 0 if expired/invalid
   *
   * @example
   * ```typescript
   * const remaining = secureTokenManager.getTimeUntilExpiration();
   *
   * // Display minutes remaining
   * const minutes = Math.floor(remaining / 60000);
   * console.log(`Session expires in ${minutes} minutes`);
   *
   * // Refresh token if expiring soon (< 5 minutes)
   * if (remaining < 5 * 60 * 1000 && remaining > 0) {
   *   await refreshAccessToken();
   * }
   *
   * // Show expiration warning
   * if (remaining < 2 * 60 * 1000 && remaining > 0) {
   *   showSessionExpirationWarning(remaining);
   * }
   * ```
   */
  public getTimeUntilExpiration(): number {
    try {
      const metadata = TokenStorage.getTokenMetadata();
      return TokenValidator.getTimeUntilExpiration(metadata);
    } catch (error) {
      console.error('[SecureTokenManager] Failed to get expiration time:', error);
      return 0;
    }
  }

  /**
   * Get time since last activity.
   *
   * Calculates elapsed time since last token access. Used for inactivity
   * timeout monitoring and session timeout warnings.
   *
   * Activity Tracking:
   * - Updated automatically on every getToken() call
   * - Tracks user interaction with authenticated endpoints
   * - Used to enforce 8-hour inactivity timeout
   *
   * Use Cases:
   * - Display inactivity warnings to users
   * - Monitor user session engagement
   * - Debug session timeout issues
   * - Implement custom inactivity logic
   *
   * @returns {number} Milliseconds since last activity, or 0 if no token
   *
   * @example
   * ```typescript
   * const inactive = secureTokenManager.getTimeSinceActivity();
   *
   * // Display minutes of inactivity
   * const minutes = Math.floor(inactive / 60000);
   * console.log(`Inactive for ${minutes} minutes`);
   *
   * // Warn if inactive for 7.5 hours (close to 8-hour timeout)
   * const WARNING_THRESHOLD = 7.5 * 60 * 60 * 1000;
   * if (inactive > WARNING_THRESHOLD) {
   *   showInactivityWarning();
   * }
   * ```
   */
  public getTimeSinceActivity(): number {
    try {
      const metadata = TokenStorage.getTokenMetadata();
      return TokenValidator.getTimeSinceActivity(metadata);
    } catch (error) {
      console.error('[SecureTokenManager] Failed to get activity time:', error);
      return 0;
    }
  }

  /**
   * Update last activity timestamp.
   *
   * Updates the lastActivity field in token metadata to current time.
   * Called automatically by getToken() on each token retrieval. Can be
   * called manually to extend session timeout after user interaction.
   *
   * Activity Tracking:
   * - Automatically called on every authenticated API request
   * - Resets the 8-hour inactivity timeout window
   * - Prevents premature session expiration
   *
   * Security Features:
   * - Implements sliding session timeout
   * - Tracks genuine user activity
   * - Prevents session hijacking by requiring active use
   *
   * @example
   * ```typescript
   * // Manually update activity after user interaction
   * document.addEventListener('click', () => {
   *   secureTokenManager.updateActivity();
   * });
   *
   * // Update after custom user actions
   * function onUserAction() {
   *   secureTokenManager.updateActivity();
   *   performAction();
   * }
   * ```
   *
   * @remarks
   * Most applications don't need to call this manually as getToken()
   * automatically updates activity on each authenticated request.
   */
  public updateActivity(): void {
    this.activityTracker.updateActivity();
  }

  /**
   * Clear all stored tokens and metadata.
   *
   * Removes all authentication tokens and metadata from sessionStorage,
   * localStorage, and Zustand storage. Call this method on user logout,
   * session expiration, or authentication errors.
   *
   * Cleared Storage:
   * - sessionStorage: secure_auth_token, secure_refresh_token, secure_token_metadata
   * - localStorage: auth-storage (Zustand), legacy tokens
   *
   * Security Features:
   * - Complete removal of all authentication state
   * - Prevents token reuse after logout
   * - Clears both current and legacy storage locations
   * - Implements secure logout best practices
   *
   * HIPAA Compliance:
   * - Ensures complete session termination
   * - Prevents unauthorized access after logout
   * - Implements secure credential disposal
   *
   * @example
   * ```typescript
   * // Clear tokens on logout
   * async function logout() {
   *   await authApi.logout();
   *   secureTokenManager.clearTokens();
   *   redirectToLogin();
   * }
   *
   * // Clear tokens on session expiration
   * if (!secureTokenManager.isTokenValid()) {
   *   secureTokenManager.clearTokens();
   *   showSessionExpiredMessage();
   * }
   *
   * // Clear tokens on authentication error
   * apiClient.interceptors.response.use(
   *   response => response,
   *   error => {
   *     if (error.response?.status === 401) {
   *       secureTokenManager.clearTokens();
   *       redirectToLogin();
   *     }
   *     return Promise.reject(error);
   *   }
   * );
   * ```
   */
  public clearTokens(): void {
    TokenStorage.clearAllTokens();
  }

  /**
   * Cleanup resources.
   *
   * Stops automatic cleanup interval and releases resources. Called
   * automatically on window unload. Should be called manually only when
   * destroying the token manager instance (rare in singleton pattern).
   *
   * Cleanup Actions:
   * - Clears the 60-second token validation interval
   * - Releases interval reference for garbage collection
   * - Prevents memory leaks from orphaned timers
   *
   * @example
   * ```typescript
   * // Cleanup on component unmount (rare with singleton)
   * useEffect(() => {
   *   return () => {
   *     secureTokenManager.cleanup();
   *   };
   * }, []);
   *
   * // Cleanup is automatic on window unload
   * // Manual cleanup rarely needed due to singleton pattern
   * ```
   *
   * @remarks
   * This method is automatically called on window 'beforeunload' event.
   * Manual calls are rarely necessary except in testing scenarios.
   */
  public cleanup(): void {
    this.activityTracker.cleanup();
  }

  /**
   * Get activity tracker instance for advanced session management
   * 
   * Provides access to the activity tracker for advanced session monitoring,
   * warnings, and custom activity handling.
   * 
   * @returns ActivityTracker instance
   */
  public getActivityTracker(): ActivityTracker {
    return this.activityTracker;
  }

  /**
   * Reset the token manager instance for testing
   * 
   * Useful for testing scenarios where a fresh instance is needed.
   * Should not be used in production code.
   */
  public static reset(): void {
    if (SecureTokenManager.instance) {
      SecureTokenManager.instance.cleanup();
      SecureTokenManager.instance = null;
    }
    ActivityTracker.getInstance().reset();
  }
}

/**
 * Singleton instance of SecureTokenManager
 * Use this throughout the application for token management
 *
 * @example
 * ```typescript
 * import { secureTokenManager } from '@/services/security/tokenManager';
 *
 * // Store token
 * secureTokenManager.setToken(token, refreshToken);
 *
 * // Get token
 * const token = secureTokenManager.getToken();
 * ```
 */
export const secureTokenManager = SecureTokenManager.getInstance();

// Export all modules for direct access if needed
export { TokenStorage, TokenValidator, JwtParser, TokenMigration, ActivityTracker };
export * from './types';

export default secureTokenManager;
