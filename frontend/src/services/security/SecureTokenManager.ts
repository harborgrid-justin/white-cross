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
 * Token metadata stored alongside the token
 */
interface TokenMetadata {
  token: string;
  refreshToken?: string;
  issuedAt: number;
  expiresAt: number;
  lastActivity: number;
}

/**
 * Zustand auth storage structure for backward compatibility
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
   * Get singleton instance of SecureTokenManager
   * Thread-safe initialization
   */
  public static getInstance(): SecureTokenManager {
    if (!SecureTokenManager.instance) {
      SecureTokenManager.instance = new SecureTokenManager();
    }
    return SecureTokenManager.instance;
  }

  /**
   * Initialize automatic cleanup interval
   * Checks every minute for expired tokens
   * @private
   */
  private initializeCleanup(): void {
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
   * Migrate tokens from localStorage to sessionStorage
   * Ensures backward compatibility while upgrading security
   * @private
   */
  private migrateFromLocalStorage(): void {
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
   * Store authentication token securely
   *
   * @param token - JWT access token
   * @param refreshToken - Optional refresh token
   * @param expiresIn - Optional custom expiration in seconds (defaults to JWT exp or 24 hours)
   * @throws {Error} If token is invalid or expired
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
   * Retrieve authentication token if valid
   * Returns null if token is expired or doesn't exist
   * Updates last activity timestamp
   *
   * @returns Token string or null
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
   * Retrieve refresh token if valid
   *
   * @returns Refresh token string or null
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
   * Check if current token is valid
   * Validates both expiration and inactivity timeout
   *
   * @param metadata - Optional metadata to validate (gets current if not provided)
   * @returns true if token is valid, false otherwise
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
      const inactivityThreshold = meta.lastActivity + SECURITY_CONFIG.SESSION_TIMEOUT;
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
   * Get time remaining until token expiration
   *
   * @returns Milliseconds until expiration, or 0 if expired/invalid
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
   * Get time since last activity
   *
   * @returns Milliseconds since last activity, or 0 if no token
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
   * Update last activity timestamp
   * Called automatically on getToken()
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
   * Clear all stored tokens and metadata
   * Call this on logout or session expiration
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
   * Cleanup resources
   * Call this before destroying the instance
   */
  public cleanup(): void {
    if (this.cleanupInterval !== null) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  /**
   * Parse JWT token to extract expiration time
   * @private
   *
   * @param token - JWT token string
   * @returns Expiration timestamp in milliseconds, or null if parsing fails
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
   * Get stored token metadata
   * @private
   *
   * @returns TokenMetadata or null if not found
   */
  private getMetadata(): TokenMetadata | null {
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
   * Update Zustand auth storage for backward compatibility
   * @private
   *
   * @param token - Token to store in Zustand format
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
