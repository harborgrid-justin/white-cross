/**
 * @fileoverview Token Storage Module
 * @module services/security/tokenManager/storage
 * @category Security - Token Management
 */

import type { TokenMetadata, ZustandAuthStorage, StorageKeys } from './types';

/**
 * Storage configuration and key definitions
 */
export const STORAGE_KEYS: StorageKeys = {
  TOKEN_KEY: 'secure_auth_token',
  REFRESH_TOKEN_KEY: 'secure_refresh_token',
  METADATA_KEY: 'secure_token_metadata',
  ZUSTAND_KEY: 'auth-storage',
  LEGACY_TOKEN_KEY: 'auth_token',
  LEGACY_REFRESH_KEY: 'refresh_token',
} as const;

/**
 * Token storage operations for sessionStorage and localStorage
 * 
 * Provides secure token storage using sessionStorage for enhanced security.
 * sessionStorage is cleared when browser/tab closes, preventing token
 * persistence across sessions for better HIPAA compliance.
 */
export class TokenStorage {
  /**
   * Store token and metadata securely in sessionStorage
   * 
   * @param metadata - Complete token metadata including token, expiration, activity
   */
  static setTokenData(metadata: TokenMetadata): void {
    if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') {
      throw new Error('[TokenStorage] Browser environment required');
    }

    try {
      // Store token
      sessionStorage.setItem(STORAGE_KEYS.TOKEN_KEY, metadata.token);
      
      // Store refresh token if provided
      if (metadata.refreshToken) {
        sessionStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN_KEY, metadata.refreshToken);
      }
      
      // Store metadata
      sessionStorage.setItem(STORAGE_KEYS.METADATA_KEY, JSON.stringify(metadata));

      console.info('[TokenStorage] Token data stored successfully');
    } catch (error) {
      console.error('[TokenStorage] Failed to store token data:', error);
      throw error;
    }
  }

  /**
   * Retrieve token metadata from sessionStorage
   * 
   * @returns Token metadata if exists and valid, null otherwise
   */
  static getTokenMetadata(): TokenMetadata | null {
    if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') {
      return null;
    }

    try {
      const metadataStr = sessionStorage.getItem(STORAGE_KEYS.METADATA_KEY);
      if (!metadataStr) {
        return null;
      }

      return JSON.parse(metadataStr) as TokenMetadata;
    } catch (error) {
      console.error('[TokenStorage] Failed to parse token metadata:', error);
      return null;
    }
  }

  /**
   * Update token metadata (typically for activity tracking)
   * 
   * @param metadata - Updated metadata to store
   */
  static updateTokenMetadata(metadata: TokenMetadata): void {
    if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') {
      return;
    }

    try {
      sessionStorage.setItem(STORAGE_KEYS.METADATA_KEY, JSON.stringify(metadata));
    } catch (error) {
      console.error('[TokenStorage] Failed to update token metadata:', error);
      throw error;
    }
  }

  /**
   * Clear all token data from storage
   */
  static clearAllTokens(): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      // Clear sessionStorage
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem(STORAGE_KEYS.TOKEN_KEY);
        sessionStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN_KEY);
        sessionStorage.removeItem(STORAGE_KEYS.METADATA_KEY);
      }

      // Clear Zustand storage from localStorage
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(STORAGE_KEYS.ZUSTAND_KEY);
        localStorage.removeItem(STORAGE_KEYS.LEGACY_TOKEN_KEY);
        localStorage.removeItem(STORAGE_KEYS.LEGACY_REFRESH_KEY);
      }

      console.info('[TokenStorage] All tokens cleared');
    } catch (error) {
      console.error('[TokenStorage] Failed to clear tokens:', error);
    }
  }

  /**
   * Update Zustand auth storage for backward compatibility
   * 
   * Maintains synchronization with legacy Zustand-based authentication state
   * in localStorage. Ensures existing code using Zustand store continues to
   * function during migration to SecureTokenManager.
   * 
   * @param token - JWT token to store in Zustand format
   */
  static updateZustandStorage(token: string): void {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }

    try {
      const existingStorage = localStorage.getItem(STORAGE_KEYS.ZUSTAND_KEY);
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

      localStorage.setItem(STORAGE_KEYS.ZUSTAND_KEY, JSON.stringify(storage));
    } catch (error) {
      console.warn('[TokenStorage] Failed to update Zustand storage:', error);
      // Non-critical error, continue
    }
  }

  /**
   * Check if tokens exist in storage
   * 
   * @returns True if any token data exists in sessionStorage
   */
  static hasTokenData(): boolean {
    if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') {
      return false;
    }

    return !!(
      sessionStorage.getItem(STORAGE_KEYS.TOKEN_KEY) ||
      sessionStorage.getItem(STORAGE_KEYS.METADATA_KEY)
    );
  }

  /**
   * Get legacy tokens from localStorage for migration
   * 
   * @returns Object with legacy tokens if they exist, null otherwise
   */
  static getLegacyTokens(): { token: string; refreshToken?: string } | null {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return null;
    }

    try {
      const legacyToken = localStorage.getItem(STORAGE_KEYS.LEGACY_TOKEN_KEY);
      const legacyRefresh = localStorage.getItem(STORAGE_KEYS.LEGACY_REFRESH_KEY);

      if (legacyToken) {
        return {
          token: legacyToken,
          refreshToken: legacyRefresh || undefined,
        };
      }

      return null;
    } catch (error) {
      console.error('[TokenStorage] Failed to get legacy tokens:', error);
      return null;
    }
  }

  /**
   * Remove legacy tokens from localStorage
   */
  static removeLegacyTokens(): void {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }

    try {
      localStorage.removeItem(STORAGE_KEYS.LEGACY_TOKEN_KEY);
      localStorage.removeItem(STORAGE_KEYS.LEGACY_REFRESH_KEY);
      console.info('[TokenStorage] Legacy tokens removed');
    } catch (error) {
      console.warn('[TokenStorage] Failed to remove legacy tokens:', error);
    }
  }
}
