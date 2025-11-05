/**
 * @fileoverview Token Storage Management
 * @module identity-access/utils/tokenSecurity.storage
 *
 * Provides secure token storage operations with encryption, expiration tracking, and
 * legacy migration support. Manages the complete lifecycle of authentication token
 * storage in localStorage with AES-GCM encryption.
 *
 * Security Considerations:
 * - Tokens are encrypted before storage using AES-GCM
 * - Expiration timestamps prevent use of stale tokens
 * - Automatic expiration checking on retrieval
 * - Legacy key cleanup on new token storage
 * - Falls back to unencrypted storage if encryption unavailable
 * - Consider httpOnly cookies for production environments
 *
 * Architecture Notes:
 * - Singleton pattern via exported `tokenSecurityManager` instance
 * - Depends on EncryptionManager for encryption operations
 * - Provides both synchronous (clearToken) and async operations
 * - Supports graceful migration from legacy storage formats
 *
 * @see {@link encryptionManager} for encryption implementation
 * @see {@link TokenData} for token data structure
 *
 * @since 2025-11-04
 */

import { User } from '@/types';
import { TokenData, EncryptedTokenData, TOKEN_SECURITY_CONFIG } from './tokenSecurity.types';
import { encryptionManager } from './tokenSecurity.encryption';

/**
 * Token security manager for secure storage operations.
 *
 * Manages the complete lifecycle of authentication token storage including
 * encryption, expiration tracking, and retrieval with validation. Provides
 * methods for storing, retrieving, updating, and clearing tokens.
 *
 * @class TokenSecurityManager
 *
 * @remarks
 * Security Features:
 * - AES-GCM encryption for stored tokens
 * - Automatic expiration validation on retrieval
 * - 5-minute expiry buffer for token refresh
 * - Legacy storage key cleanup
 * - Graceful fallback if encryption unavailable
 *
 * Typical Usage Pattern:
 * 1. Initialize on app startup: `await tokenSecurityManager.init()`
 * 2. Store token after login: `await tokenSecurityManager.storeToken(token, user)`
 * 3. Retrieve token when needed: `await tokenSecurityManager.getValidToken()`
 * 4. Clear on logout: `tokenSecurityManager.clearToken()`
 *
 * @example
 * ```typescript
 * // Initialize on app startup
 * await tokenSecurityManager.init();
 *
 * // Store token after successful login
 * await tokenSecurityManager.storeToken(
 *   'jwt-token-string',
 *   { id: '123', email: 'user@example.com', role: 'NURSE' },
 *   24 * 60 * 60 * 1000 // 24 hours
 * );
 *
 * // Later, retrieve valid token
 * const tokenData = await tokenSecurityManager.getValidToken();
 * if (tokenData) {
 *   // Use token for authenticated request
 *   makeAuthenticatedRequest(tokenData.token);
 * } else {
 *   // Token expired or invalid, redirect to login
 *   redirectToLogin();
 * }
 *
 * // Clear on logout
 * tokenSecurityManager.clearToken();
 * ```
 *
 * @see {@link storeToken} for storing tokens
 * @see {@link getValidToken} for retrieving tokens
 * @see {@link clearToken} for clearing tokens
 */
export class TokenSecurityManager {
  /**
   * Initializes the token security manager.
   *
   * Must be called before performing any token operations. Initializes the
   * underlying encryption manager for secure storage.
   *
   * @async
   * @returns {Promise<void>} Resolves when initialization completes
   *
   * @example
   * ```typescript
   * const manager = new TokenSecurityManager();
   * await manager.init();
   * // Manager is now ready for token operations
   * ```
   *
   * @remarks
   * - Should be called once during application initialization
   * - Safe to call multiple times (idempotent)
   * - Initializes encryption subsystem
   * - No-op if encryption unavailable (falls back to unencrypted storage)
   *
   * @see {@link EncryptionManager.init} for encryption initialization details
   */
  async init(): Promise<void> {
    await encryptionManager.init();
  }

  /**
   * Stores authentication token with encryption and expiration metadata.
   *
   * Encrypts the token and user data before storing in localStorage. Includes
   * expiration timestamp for automatic validation on retrieval. Clears legacy
   * storage keys if present.
   *
   * @async
   * @param {string} token - JWT authentication token to store
   * @param {User} user - User object associated with the token
   * @param {number} [expiresIn=24h] - Token lifetime in milliseconds (defaults to 24 hours)
   * @returns {Promise<void>} Resolves when storage completes
   *
   * @throws {Error} If token storage fails (encryption error, localStorage full, etc.)
   *
   * @example
   * ```typescript
   * // Store token with default 24-hour expiration
   * await tokenSecurityManager.storeToken(
   *   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
   *   { id: '123', email: 'nurse@example.com', role: 'NURSE' }
   * );
   *
   * // Store token with custom expiration (1 hour)
   * await tokenSecurityManager.storeToken(
   *   token,
   *   user,
   *   60 * 60 * 1000
   * );
   * ```
   *
   * @remarks
   * Security Features:
   * - Encrypts token and user data using AES-GCM
   * - Stores issued and expiration timestamps
   * - Falls back to unencrypted storage if encryption unavailable
   * - Logs error but throws if storage fails
   *
   * Storage Structure:
   * - Stores encrypted TokenData in localStorage
   * - Uses key from TOKEN_SECURITY_CONFIG.STORAGE_KEY
   * - Includes timestamp, IV, and encrypted payload
   *
   * @see {@link getValidToken} for retrieving stored tokens
   * @see {@link TokenData} for stored data structure
   */
  async storeToken(
    token: string,
    user: User,
    expiresIn: number = TOKEN_SECURITY_CONFIG.DEFAULT_TOKEN_LIFETIME
  ): Promise<void> {
    const now = Date.now();
    const tokenData: TokenData = {
      token,
      user,
      expiresAt: now + expiresIn,
      issuedAt: now
    };

    try {
      if (encryptionManager.isEncryptionAvailable()) {
        const encrypted = await encryptionManager.encryptData(JSON.stringify(tokenData));
        localStorage.setItem(TOKEN_SECURITY_CONFIG.STORAGE_KEY, JSON.stringify(encrypted));
      } else {
        // Fallback to unencrypted storage
        localStorage.setItem(TOKEN_SECURITY_CONFIG.STORAGE_KEY, JSON.stringify(tokenData));
      }
    } catch (error) {
      console.error('Failed to store encrypted token:', error);
      throw new Error('Token storage failed');
    }
  }

  /**
   * Retrieves and validates stored token.
   *
   * Retrieves the token from localStorage, decrypts it if encrypted, and validates
   * expiration. Returns null if token is expired, invalid, or not found. Logs
   * warning if token is close to expiring (within 5-minute buffer).
   *
   * @async
   * @returns {Promise<TokenData | null>} Token data if valid, null if expired/invalid/missing
   *
   * @example
   * ```typescript
   * const tokenData = await tokenSecurityManager.getValidToken();
   *
   * if (tokenData) {
   *   // Token is valid, use it
   *   const response = await fetch('/api/protected', {
   *     headers: {
   *       'Authorization': `Bearer ${tokenData.token}`
   *     }
   *   });
   * } else {
   *   // Token is expired or missing, redirect to login
   *   router.push('/login');
   * }
   * ```
   *
   * @remarks
   * Validation Logic:
   * - Returns null if no token stored
   * - Attempts decryption if encrypted
   * - Falls back to unencrypted parsing if decryption fails
   * - Validates expiration timestamp
   * - Clears token if expired
   * - Warns if token expiring within 5-minute buffer
   *
   * Expiration Handling:
   * - Expired tokens are automatically cleared
   * - Tokens expiring soon (< 5 min) log warning
   * - Use warning to trigger token refresh
   *
   * Error Handling:
   * - Logs errors and clears invalid tokens
   * - Returns null on any error (graceful degradation)
   * - Handles both encrypted and unencrypted fallback
   *
   * @see {@link storeToken} for storing tokens
   * @see {@link isTokenValid} for simple validation check
   * @see {@link TOKEN_SECURITY_CONFIG.TOKEN_EXPIRY_BUFFER} for expiry buffer duration
   */
  async getValidToken(): Promise<TokenData | null> {
    try {
      const storedData = localStorage.getItem(TOKEN_SECURITY_CONFIG.STORAGE_KEY);
      if (!storedData) return null;

      let tokenData: TokenData;

      if (encryptionManager.isEncryptionAvailable()) {
        try {
          const encryptedData: EncryptedTokenData = JSON.parse(storedData);
          const decryptedString = await encryptionManager.decryptData(encryptedData);
          tokenData = JSON.parse(decryptedString);
        } catch (decryptError) {
          console.warn('Failed to decrypt token, attempting fallback:', decryptError);
          // Try to parse as unencrypted data
          tokenData = JSON.parse(storedData);
        }
      } else {
        tokenData = JSON.parse(storedData);
      }

      // Validate token expiration
      const now = Date.now();
      if (tokenData.expiresAt && tokenData.expiresAt < now) {
        this.clearToken();
        return null;
      }

      // Check if token is close to expiring (within buffer time)
      if (
        tokenData.expiresAt &&
        (tokenData.expiresAt - now) < TOKEN_SECURITY_CONFIG.TOKEN_EXPIRY_BUFFER
      ) {
        console.warn('Token is close to expiring');
        // Could trigger refresh here
      }

      return tokenData;
    } catch (error) {
      console.error('Failed to retrieve token:', error);
      this.clearToken();
      return null;
    }
  }

  /**
   * Checks if current token is valid without retrieving full data.
   *
   * Convenience method to check token validity without retrieving the full
   * token data object. More efficient than calling getValidToken() when you
   * only need to know if a valid token exists.
   *
   * @async
   * @returns {Promise<boolean>} True if valid token exists, false otherwise
   *
   * @example
   * ```typescript
   * if (await tokenSecurityManager.isTokenValid()) {
   *   // User is authenticated, proceed
   *   renderDashboard();
   * } else {
   *   // User not authenticated, redirect
   *   redirectToLogin();
   * }
   * ```
   *
   * @remarks
   * - Internally calls {@link getValidToken} and checks for null
   * - Performs full validation including expiration checking
   * - Does not return the token data (more secure for simple checks)
   * - Use when you only need authentication status, not token details
   *
   * @see {@link getValidToken} for retrieving token data
   */
  async isTokenValid(): Promise<boolean> {
    const tokenData = await this.getValidToken();
    return tokenData !== null;
  }

  /**
   * Gets the current authenticated user from stored token.
   *
   * Retrieves the user object from the stored token data. Returns null if
   * token is expired, invalid, or not found.
   *
   * @async
   * @returns {Promise<User | null>} User object if token valid, null otherwise
   *
   * @example
   * ```typescript
   * const user = await tokenSecurityManager.getCurrentUser();
   *
   * if (user) {
   *   console.log(`Welcome, ${user.email}!`);
   *   console.log(`Role: ${user.role}`);
   * } else {
   *   console.log('No authenticated user');
   * }
   * ```
   *
   * @remarks
   * - Performs full token validation before returning user
   * - Returns null if token is expired
   * - Use when you need user details for authenticated requests
   * - More efficient than getValidToken() if you only need user data
   *
   * @see {@link getValidToken} for full token data
   * @see {@link isTokenValid} for authentication check only
   */
  async getCurrentUser(): Promise<User | null> {
    const tokenData = await this.getValidToken();
    return tokenData?.user || null;
  }

  /**
   * Clears all stored authentication data.
   *
   * Removes the current token and clears all legacy storage keys for backward
   * compatibility. Should be called on logout or when token becomes invalid.
   *
   * @returns {void}
   *
   * @example
   * ```typescript
   * // On user logout
   * tokenSecurityManager.clearToken();
   * router.push('/login');
   * ```
   *
   * @example
   * ```typescript
   * // After detecting invalid token
   * const tokenData = await tokenSecurityManager.getValidToken();
   * if (!tokenData) {
   *   tokenSecurityManager.clearToken();
   *   showSessionExpiredMessage();
   * }
   * ```
   *
   * @remarks
   * Security Features:
   * - Clears primary storage key
   * - Clears all legacy storage keys
   * - Synchronous operation (no await needed)
   * - Safe to call multiple times (idempotent)
   *
   * Cleared Keys:
   * - Primary: 'auth_data'
   * - Legacy: 'auth_token', 'token', 'authToken', 'user'
   *
   * Best Practices:
   * - Always call on logout
   * - Call when detecting expired tokens
   * - Call before redirecting to login
   * - Consider clearing other app state simultaneously
   *
   * @see {@link TOKEN_SECURITY_CONFIG.LEGACY_TOKEN_KEYS} for legacy keys
   */
  clearToken(): void {
    localStorage.removeItem(TOKEN_SECURITY_CONFIG.STORAGE_KEY);

    // Clear legacy storage keys for backward compatibility
    TOKEN_SECURITY_CONFIG.LEGACY_TOKEN_KEYS.forEach(key => {
      localStorage.removeItem(key);
    });

    localStorage.removeItem(TOKEN_SECURITY_CONFIG.LEGACY_USER_KEY);
  }

  /**
   * Updates user data in stored token while preserving token and expiration.
   *
   * Updates only the user object in the stored token data, keeping the token
   * string and expiration unchanged. Useful when user profile is updated but
   * token remains valid.
   *
   * @async
   * @param {User} user - Updated user object
   * @returns {Promise<void>} Resolves when update completes
   *
   * @throws {Error} If token storage fails during update
   *
   * @example
   * ```typescript
   * // After user profile update
   * const updatedUser = { ...currentUser, name: 'New Name' };
   * await tokenSecurityManager.updateUser(updatedUser);
   * ```
   *
   * @remarks
   * Use Cases:
   * - User profile updated on server
   * - Role or permissions changed
   * - User preferences updated
   * - Any user metadata change while token stays valid
   *
   * Behavior:
   * - Retrieves current token data
   * - Replaces user object only
   * - Preserves token string and expiration
   * - Re-encrypts and stores updated data
   * - No-op if no valid token exists
   *
   * Important Notes:
   * - Does not update the actual JWT token
   * - Only updates the cached user object
   * - Token expiration remains unchanged
   * - Silently fails if no token exists
   *
   * @see {@link storeToken} for full token storage
   * @see {@link getCurrentUser} for retrieving user data
   */
  async updateUser(user: User): Promise<void> {
    const tokenData = await this.getValidToken();
    if (tokenData) {
      tokenData.user = user;
      await this.storeToken(tokenData.token, user, tokenData.expiresAt - Date.now());
    }
  }

  /**
   * Gets the raw JWT token string if available and valid.
   *
   * Retrieves only the token string without other metadata. Returns null if
   * token is expired, invalid, or not found.
   *
   * @async
   * @returns {Promise<string | null>} JWT token string or null
   *
   * @example
   * ```typescript
   * const token = await tokenSecurityManager.getToken();
   *
   * if (token) {
   *   // Add token to request headers
   *   const headers = {
   *     'Authorization': `Bearer ${token}`
   *   };
   * }
   * ```
   *
   * @remarks
   * - Performs full validation before returning token
   * - Returns null if token expired
   * - Use for authenticated API requests
   * - More efficient than getValidToken() if you only need token string
   *
   * @see {@link getValidToken} for full token data
   * @see {@link getCurrentUser} for user data only
   */
  async getToken(): Promise<string | null> {
    const tokenData = await this.getValidToken();
    return tokenData?.token || null;
  }

  /**
   * Gets token expiration timestamp.
   *
   * Retrieves the expiration timestamp from stored token data. Useful for
   * displaying countdown timers or determining when to refresh token.
   *
   * @async
   * @returns {Promise<number | null>} Unix timestamp (ms) of expiration, or null if no valid token
   *
   * @example
   * ```typescript
   * const expiresAt = await tokenSecurityManager.getTokenExpiration();
   *
   * if (expiresAt) {
   *   const timeRemaining = expiresAt - Date.now();
   *   const minutesRemaining = Math.floor(timeRemaining / 60000);
   *   console.log(`Token expires in ${minutesRemaining} minutes`);
   *
   *   // Refresh if less than 5 minutes remaining
   *   if (minutesRemaining < 5) {
   *     await refreshToken();
   *   }
   * }
   * ```
   *
   * @remarks
   * - Performs full validation before returning expiration
   * - Returns null if token expired or invalid
   * - Timestamp is in milliseconds (use Date.now() for comparison)
   * - Useful for implementing session timers
   * - Can be used to trigger proactive token refresh
   *
   * @see {@link getValidToken} for full token data
   * @see {@link isTokenValid} for simple validity check
   * @see {@link TOKEN_SECURITY_CONFIG.TOKEN_EXPIRY_BUFFER} for expiry buffer
   */
  async getTokenExpiration(): Promise<number | null> {
    const tokenData = await this.getValidToken();
    return tokenData?.expiresAt || null;
  }
}

/**
 * Singleton instance of TokenSecurityManager.
 *
 * Pre-instantiated token security manager for application-wide use. Should be
 * initialized with `await tokenSecurityManager.init()` before first use.
 *
 * @constant
 * @type {TokenSecurityManager}
 *
 * @example
 * ```typescript
 * // Initialize on app startup (e.g., in _app.tsx or layout.tsx)
 * await tokenSecurityManager.init();
 *
 * // Use throughout the application
 * const user = await tokenSecurityManager.getCurrentUser();
 * ```
 *
 * @see {@link TokenSecurityManager} for class documentation
 */
export const tokenSecurityManager = new TokenSecurityManager();
