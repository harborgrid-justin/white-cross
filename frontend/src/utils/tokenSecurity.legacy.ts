/**
 * WF-COMP-354 | tokenSecurity.legacy.ts - Legacy token utilities
 * Purpose: Backward compatibility utilities for legacy token storage
 * Upstream: ../types | Dependencies: ../types
 * Downstream: Legacy components | Called by: Components not yet migrated
 * Related: tokenSecurity.storage
 * Exports: legacyTokenUtils object | Key Features: Legacy storage access
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Legacy token access for backward compatibility
 * LLM Context: Legacy utilities for components not yet migrated to secure storage
 * @deprecated These functions should be migrated to use tokenSecurityManager
 */

import { User } from '@/types';
import { TOKEN_SECURITY_CONFIG } from './tokenSecurity.types';

/**
 * Legacy storage functions for backward compatibility
 * @deprecated These should be migrated to use the secure token manager
 */
export const legacyTokenUtils = {
  /**
   * Gets token from legacy storage locations
   * @deprecated Use tokenSecurityManager.getToken() instead
   * @returns Token string or null
   */
  getToken(): string | null {
    for (const key of TOKEN_SECURITY_CONFIG.LEGACY_TOKEN_KEYS) {
      const token = localStorage.getItem(key);
      if (token) return token;
    }
    return null;
  },

  /**
   * Sets token in primary legacy storage location
   * @deprecated Use tokenSecurityManager.storeToken() instead
   * @param token - Token string to store
   */
  setToken(token: string): void {
    localStorage.setItem(TOKEN_SECURITY_CONFIG.LEGACY_TOKEN_KEYS[0], token);
  },

  /**
   * Removes token from all legacy storage locations
   * @deprecated Use tokenSecurityManager.clearToken() instead
   */
  removeToken(): void {
    TOKEN_SECURITY_CONFIG.LEGACY_TOKEN_KEYS.forEach(key => {
      localStorage.removeItem(key);
    });
  },

  /**
   * Gets user from legacy storage
   * @deprecated Use tokenSecurityManager.getCurrentUser() instead
   * @returns User object or null
   */
  getUser(): User | null {
    const userJson = localStorage.getItem(TOKEN_SECURITY_CONFIG.LEGACY_USER_KEY);
    if (!userJson) return null;

    try {
      return JSON.parse(userJson);
    } catch {
      return null;
    }
  },

  /**
   * Sets user in legacy storage
   * @deprecated Use tokenSecurityManager.updateUser() instead
   * @param user - User object to store
   */
  setUser(user: User): void {
    localStorage.setItem(TOKEN_SECURITY_CONFIG.LEGACY_USER_KEY, JSON.stringify(user));
  },

  /**
   * Removes user from legacy storage
   * @deprecated Use tokenSecurityManager.clearToken() instead
   */
  removeUser(): void {
    localStorage.removeItem(TOKEN_SECURITY_CONFIG.LEGACY_USER_KEY);
  },

  /**
   * Clears all legacy storage data
   * @deprecated Use tokenSecurityManager.clearToken() instead
   */
  clearAll(): void {
    this.removeToken();
    this.removeUser();
  }
};
