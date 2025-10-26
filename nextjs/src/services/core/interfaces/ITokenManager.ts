/**
 * @fileoverview Token Manager Interface for Dependency Injection
 * @module services/core/interfaces/ITokenManager
 * @category Interfaces
 *
 * Interface abstraction for token management to enable dependency injection
 * and break circular dependencies between ApiClient and SecureTokenManager.
 *
 * Benefits:
 * - Breaks circular import dependencies
 * - Enables easy mocking for tests
 * - Provides clear contract for token management
 * - Supports multiple implementations (session, local, memory)
 *
 * @example
 * ```typescript
 * // In tests
 * class MockTokenManager implements ITokenManager {
 *   getToken() { return 'mock-token'; }
 *   // ... other methods
 * }
 *
 * // In production
 * const tokenManager: ITokenManager = SecureTokenManager.getInstance();
 * const apiClient = new ApiClient(tokenManager);
 * ```
 */

/**
 * Token Manager Interface
 *
 * Defines the contract for token storage and retrieval implementations.
 * All token managers must implement these methods to be compatible with
 * the dependency injection system.
 *
 * @interface
 */
export interface ITokenManager {
  /**
   * Retrieve authentication token if valid
   * Returns null if token is expired or doesn't exist
   *
   * @returns Token string or null
   */
  getToken(): string | null;

  /**
   * Retrieve refresh token if valid
   *
   * @returns Refresh token string or null
   */
  getRefreshToken(): string | null;

  /**
   * Store authentication token securely
   *
   * @param token - JWT access token
   * @param refreshToken - Optional refresh token
   * @param expiresIn - Optional custom expiration in seconds
   */
  setToken(token: string, refreshToken?: string, expiresIn?: number): void;

  /**
   * Check if current token is valid
   * Validates both expiration and inactivity timeout
   *
   * @returns true if token is valid, false otherwise
   */
  isTokenValid(): boolean;

  /**
   * Clear all stored tokens and metadata
   * Call this on logout or session expiration
   */
  clearTokens(): void;

  /**
   * Update last activity timestamp
   * Called automatically on token usage
   */
  updateActivity(): void;

  /**
   * Get time remaining until token expiration
   *
   * @returns Milliseconds until expiration, or 0 if expired/invalid
   */
  getTimeUntilExpiration(): number;

  /**
   * Get time since last activity
   *
   * @returns Milliseconds since last activity, or 0 if no token
   */
  getTimeSinceActivity(): number;

  /**
   * Cleanup resources (timers, listeners, etc.)
   * Call before destroying the instance
   */
  cleanup(): void;
}

/**
 * Type guard to check if an object implements ITokenManager
 *
 * @param obj - Object to check
 * @returns true if object implements ITokenManager interface
 */
export function isTokenManager(obj: unknown): obj is ITokenManager {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  const manager = obj as ITokenManager;

  return (
    typeof manager.getToken === 'function' &&
    typeof manager.getRefreshToken === 'function' &&
    typeof manager.setToken === 'function' &&
    typeof manager.isTokenValid === 'function' &&
    typeof manager.clearTokens === 'function' &&
    typeof manager.updateActivity === 'function' &&
    typeof manager.getTimeUntilExpiration === 'function' &&
    typeof manager.getTimeSinceActivity === 'function' &&
    typeof manager.cleanup === 'function'
  );
}
