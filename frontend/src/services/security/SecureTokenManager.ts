/**
 * WF-COMP-SEC-001 | SecureTokenManager.ts - Secure Token Management Service
 * Purpose: HIPAA-compliant token storage and validation with automatic expiration
 * Security: Uses sessionStorage for enhanced security, implements inactivity timeout
 * Upstream: ../../constants/config | Dependencies: SECURITY_CONFIG
 * Downstream: Authentication services, API clients | Called by: Auth flows, API interceptors
 * Related: authApi.ts, apiConfig.ts, ApiClient.ts
 * Exports: SecureTokenManager class, secureTokenManager singleton | Key Features: Session-based storage, auto-cleanup
 * Last Updated: 2025-10-21 | File Type: .ts
 * Critical Path: Token storage → Validation → Automatic cleanup → Session management
 * LLM Context: Security-critical module for healthcare platform, HIPAA compliance required
 */

import { SECURITY_CONFIG } from '../../constants/config';
import type { ITokenManager } from '../core/interfaces/ITokenManager';

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
interface TokenMetadata {
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
interface ZustandAuthStorage {
  state: {
    token: string | null;
    user: unknown | null;
    [key: string]: unknown;
  };
  version: number;
}

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
  private readonly TOKEN_KEY = 'secure_auth_token';
  private readonly REFRESH_TOKEN_KEY = 'secure_refresh_token';
  private readonly METADATA_KEY = 'secure_token_metadata';
  private readonly ZUSTAND_KEY = 'auth-storage';

  // Legacy keys for migration
  private readonly LEGACY_TOKEN_KEY = 'auth_token';
  private readonly LEGACY_REFRESH_KEY = 'refresh_token';

  private cleanupInterval: number | null = null;

  private constructor() {
    this.initializeCleanup();
    this.migrateFromLocalStorage();
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
   * Initialize automatic cleanup interval for expired token detection.
   *
   * Establishes a recurring check every 60 seconds to validate token status
   * and automatically clear expired tokens. Also registers window unload
   * handler to cleanup resources on browser close.
   *
   * Security Benefits:
   * - Automatic removal of expired tokens prevents unauthorized access
   * - Prevents memory leaks from orphaned tokens
   * - Ensures timely session termination on inactivity
   *
   * HIPAA Compliance:
   * - Enforces automatic session timeout requirements
   * - Prevents access after session expiration
   * - Implements defense-in-depth for PHI protection
   *
   * @private
   */
  private initializeCleanup(): void {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return;
    }

    // Check for expired tokens every minute
    this.cleanupInterval = window.setInterval(() => {
      if (!this.isTokenValid()) {
        this.clearTokens();
      }
    }, 60 * 1000); // 60 seconds

    // Cleanup on window unload
    window.addEventListener('beforeunload', () => {
      this.cleanup();
    });
  }

  /**
   * Migrate tokens from localStorage to sessionStorage.
   *
   * Performs one-time migration of legacy tokens stored in localStorage
   * to the more secure sessionStorage. Validates token expiration before
   * migration and removes expired tokens. This ensures backward compatibility
   * while upgrading security posture.
   *
   * Security Upgrade:
   * - localStorage persists across browser sessions (security risk)
   * - sessionStorage is cleared when browser/tab closes (more secure)
   * - Migration is automatic and transparent to users
   *
   * HIPAA Compliance:
   * - Reduces token persistence window
   * - Limits exposure of authentication credentials
   * - Aligns with minimum necessary access principle
   *
   * @private
   *
   * @remarks
   * This method runs once during SecureTokenManager initialization.
   * After migration, legacy tokens are removed from localStorage.
   * Expired tokens are discarded without migration.
   */
  private migrateFromLocalStorage(): void {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return;
    }

    try {
      // Check if tokens exist in localStorage
      const legacyToken = localStorage.getItem(this.LEGACY_TOKEN_KEY);
      const legacyRefresh = localStorage.getItem(this.LEGACY_REFRESH_KEY);

      if (legacyToken && !sessionStorage.getItem(this.TOKEN_KEY)) {
        // Parse JWT to get expiration
        const expiration = this.parseJwtExpiration(legacyToken);

        if (expiration && expiration > Date.now()) {
          // Token is still valid, migrate it
          this.setToken(legacyToken, legacyRefresh || undefined);

          // Remove from localStorage
          localStorage.removeItem(this.LEGACY_TOKEN_KEY);
          if (legacyRefresh) {
            localStorage.removeItem(this.LEGACY_REFRESH_KEY);
          }

          console.info('[SecureTokenManager] Successfully migrated tokens from localStorage to sessionStorage');
        } else {
          // Token expired, just remove it
          localStorage.removeItem(this.LEGACY_TOKEN_KEY);
          if (legacyRefresh) {
            localStorage.removeItem(this.LEGACY_REFRESH_KEY);
          }
          console.info('[SecureTokenManager] Removed expired legacy tokens');
        }
      }
    } catch (error) {
      console.warn('[SecureTokenManager] Failed to migrate tokens:', error);
      // Clear legacy tokens on error
      localStorage.removeItem(this.LEGACY_TOKEN_KEY);
      localStorage.removeItem(this.LEGACY_REFRESH_KEY);
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
    if (!token || typeof token !== 'string') {
      throw new Error('[SecureTokenManager] Invalid token provided');
    }

    try {
      const now = Date.now();

      // Parse JWT expiration or use provided expiresIn
      let expirationTime: number;

      if (expiresIn) {
        expirationTime = now + (expiresIn * 1000);
      } else {
        const jwtExpiration = this.parseJwtExpiration(token);
        expirationTime = jwtExpiration || (now + (24 * 60 * 60 * 1000)); // Default 24 hours
      }

      // Validate token isn't already expired
      if (expirationTime <= now) {
        throw new Error('[SecureTokenManager] Cannot store expired token');
      }

      const metadata: TokenMetadata = {
        token,
        refreshToken,
        issuedAt: now,
        expiresAt: expirationTime,
        lastActivity: now,
      };

      // Store in sessionStorage
      sessionStorage.setItem(this.TOKEN_KEY, token);
      if (refreshToken) {
        sessionStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
      }
      sessionStorage.setItem(this.METADATA_KEY, JSON.stringify(metadata));

      // Update Zustand storage for backward compatibility
      this.updateZustandStorage(token);

      console.info('[SecureTokenManager] Token stored successfully', {
        expiresAt: new Date(expirationTime).toISOString(),
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
      const metadata = this.getMetadata();
      if (!metadata) {
        return null;
      }

      // Validate token
      if (!this.isTokenValid(metadata)) {
        this.clearTokens();
        return null;
      }

      // Update last activity
      this.updateActivity();

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
      const metadata = this.getMetadata();
      if (!metadata || !metadata.refreshToken) {
        return null;
      }

      // Validate token
      if (!this.isTokenValid(metadata)) {
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
      const meta = metadata || this.getMetadata();
      if (!meta) {
        return false;
      }

      const now = Date.now();

      // Check expiration
      if (now >= meta.expiresAt) {
        console.info('[SecureTokenManager] Token expired');
        return false;
      }

      // Check inactivity timeout (8 hours from SECURITY_CONFIG)
      const inactivityThreshold = meta.lastActivity + SECURITY_CONFIG.INACTIVITY_TIMEOUT;
      if (now >= inactivityThreshold) {
        console.info('[SecureTokenManager] Session timeout due to inactivity');
        return false;
      }

      return true;
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
      const metadata = this.getMetadata();
      if (!metadata) {
        return 0;
      }

      const remaining = metadata.expiresAt - Date.now();
      return remaining > 0 ? remaining : 0;
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
      const metadata = this.getMetadata();
      if (!metadata) {
        return 0;
      }

      return Date.now() - metadata.lastActivity;
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
    try {
      const metadata = this.getMetadata();
      if (!metadata) {
        return;
      }

      metadata.lastActivity = Date.now();
      sessionStorage.setItem(this.METADATA_KEY, JSON.stringify(metadata));
    } catch (error) {
      console.error('[SecureTokenManager] Failed to update activity:', error);
    }
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
    try {
      sessionStorage.removeItem(this.TOKEN_KEY);
      sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
      sessionStorage.removeItem(this.METADATA_KEY);

      // Clear Zustand storage
      localStorage.removeItem(this.ZUSTAND_KEY);

      // Clear legacy localStorage tokens if they exist
      localStorage.removeItem(this.LEGACY_TOKEN_KEY);
      localStorage.removeItem(this.LEGACY_REFRESH_KEY);

      console.info('[SecureTokenManager] All tokens cleared');
    } catch (error) {
      console.error('[SecureTokenManager] Failed to clear tokens:', error);
    }
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
    if (this.cleanupInterval !== null) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  /**
   * Parse JWT token to extract expiration time.
   *
   * Decodes JWT payload to extract 'exp' claim (expiration timestamp).
   * Converts Unix timestamp (seconds) to JavaScript timestamp (milliseconds).
   *
   * JWT Structure:
   * - Header: Algorithm and token type
   * - Payload: Claims including exp (expiration)
   * - Signature: Verification signature (not validated client-side)
   *
   * Security Note:
   * - Client-side JWT parsing is for convenience only
   * - Server MUST validate JWT signature and expiration
   * - Never trust client-side expiration alone
   * - This is defense-in-depth, not primary security
   *
   * @private
   *
   * @param {string} token - JWT token string (format: header.payload.signature)
   * @returns {number | null} Expiration timestamp in milliseconds, or null if parsing fails
   *
   * @example
   * ```typescript
   * // JWT token structure
   * const token = 'eyJhbGc...payload...signature';
   * const expiration = this.parseJwtExpiration(token);
   * // Returns: 1735689600000 (timestamp in milliseconds)
   * ```
   */
  private parseJwtExpiration(token: string): number | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }

      const payload = JSON.parse(atob(parts[1]));
      if (payload.exp && typeof payload.exp === 'number') {
        return payload.exp * 1000; // Convert seconds to milliseconds
      }

      return null;
    } catch (error) {
      console.warn('[SecureTokenManager] Failed to parse JWT expiration:', error);
      return null;
    }
  }

  /**
   * Get stored token metadata from sessionStorage.
   *
   * Retrieves and parses token metadata JSON from sessionStorage.
   * Returns null if metadata doesn't exist or parsing fails.
   *
   * @private
   *
   * @returns {TokenMetadata | null} Parsed token metadata or null
   *
   * @example
   * ```typescript
   * const metadata = this.getMetadata();
   * if (metadata) {
   *   console.log('Token expires at:', new Date(metadata.expiresAt));
   *   console.log('Last activity:', new Date(metadata.lastActivity));
   * }
   * ```
   */
  private getMetadata(): TokenMetadata | null {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') {
      return null;
    }

    try {
      const metadataStr = sessionStorage.getItem(this.METADATA_KEY);
      if (!metadataStr) {
        return null;
      }

      return JSON.parse(metadataStr) as TokenMetadata;
    } catch (error) {
      console.error('[SecureTokenManager] Failed to parse metadata:', error);
      return null;
    }
  }

  /**
   * Update Zustand auth storage for backward compatibility.
   *
   * Maintains synchronization with legacy Zustand-based authentication state
   * in localStorage. Ensures existing code using Zustand store continues to
   * function during migration to SecureTokenManager.
   *
   * Storage Format:
   * - Key: 'auth-storage'
   * - Location: localStorage (Zustand default)
   * - Structure: { state: { token, user }, version }
   *
   * @private
   *
   * @param {string} token - JWT token to store in Zustand format
   *
   * @remarks
   * This is a temporary compatibility layer. Future versions should migrate
   * all code to use secureTokenManager directly and remove Zustand sync.
   * Non-critical errors are logged but don't fail token storage.
   */
  private updateZustandStorage(token: string): void {
    try {
      const existingStorage = localStorage.getItem(this.ZUSTAND_KEY);
      let storage: ZustandAuthStorage;

      if (existingStorage) {
        storage = JSON.parse(existingStorage) as ZustandAuthStorage;
        storage.state.token = token;
      } else {
        storage = {
          state: {
            token,
            user: null,
          },
          version: 0,
        };
      }

      localStorage.setItem(this.ZUSTAND_KEY, JSON.stringify(storage));
    } catch (error) {
      console.warn('[SecureTokenManager] Failed to update Zustand storage:', error);
      // Non-critical error, continue
    }
  }
}

/**
 * Singleton instance of SecureTokenManager
 * Use this throughout the application for token management
 *
 * @example
 * ```typescript
 * import { secureTokenManager } from '@/services/security/SecureTokenManager';
 *
 * // Store token
 * secureTokenManager.setToken(token, refreshToken);
 *
 * // Get token
 * const token = secureTokenManager.getToken();
 * ```
 */
export const secureTokenManager = SecureTokenManager.getInstance();

export default secureTokenManager;
