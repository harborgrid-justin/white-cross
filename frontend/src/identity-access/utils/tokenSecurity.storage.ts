/**
 * WF-COMP-354 | tokenSecurity.storage.ts - Token storage management
 * Purpose: Secure token storage with encryption and expiration handling
 * Upstream: tokenSecurity.types, tokenSecurity.encryption | Dependencies: types, encryption
 * Downstream: Components, authentication | Called by: Auth flows
 * Related: tokenSecurity.encryption, tokenSecurity.validation, tokenSecurity.types
 * Exports: TokenSecurityManager class | Key Features: Encrypted storage, expiration checking
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Store token → Encrypt → LocalStorage → Retrieve → Decrypt → Validate
 * LLM Context: Token storage management with encryption and validation
 */

import { User } from '@/types';
import { TokenData, EncryptedTokenData, TOKEN_SECURITY_CONFIG } from './tokenSecurity.types';
import { encryptionManager } from './tokenSecurity.encryption';

/**
 * Manages secure token storage operations
 * Handles encryption, expiration checking, and user data management
 */
export class TokenSecurityManager {
  /**
   * Initializes the token security manager
   * Must be called before using other methods
   */
  async init(): Promise<void> {
    await encryptionManager.init();
  }

  /**
   * Stores token with encryption and expiration metadata
   * @param token - Authentication token to store
   * @param user - User data associated with the token
   * @param expiresIn - Token lifetime in milliseconds (default: 24 hours)
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
   * Retrieves and validates stored token
   * @returns TokenData if valid, null if expired or invalid
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
   * Checks if current token is valid without retrieving it
   * @returns True if token exists and is valid
   */
  async isTokenValid(): Promise<boolean> {
    const tokenData = await this.getValidToken();
    return tokenData !== null;
  }

  /**
   * Gets the current user from stored token
   * @returns User object if token is valid, null otherwise
   */
  async getCurrentUser(): Promise<User | null> {
    const tokenData = await this.getValidToken();
    return tokenData?.user || null;
  }

  /**
   * Clears all stored authentication data including legacy storage keys
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
   * Updates user data in stored token while preserving expiration
   * @param user - Updated user data
   */
  async updateUser(user: User): Promise<void> {
    const tokenData = await this.getValidToken();
    if (tokenData) {
      tokenData.user = user;
      await this.storeToken(tokenData.token, user, tokenData.expiresAt - Date.now());
    }
  }

  /**
   * Gets the raw token string if available and valid
   * @returns Token string or null
   */
  async getToken(): Promise<string | null> {
    const tokenData = await this.getValidToken();
    return tokenData?.token || null;
  }

  /**
   * Gets token expiration time
   * @returns Expiration timestamp in milliseconds or null
   */
  async getTokenExpiration(): Promise<number | null> {
    const tokenData = await this.getValidToken();
    return tokenData?.expiresAt || null;
  }
}

// Export singleton instance
export const tokenSecurityManager = new TokenSecurityManager();
