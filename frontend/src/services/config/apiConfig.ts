/**
 * WF-COMP-253 | apiConfig.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../../constants/config, ../../constants/api | Dependencies: ../../constants/config, ../../constants/api
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export, constants, named exports | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { API_CONFIG } from '../../constants/config';
import {
  API_ENDPOINTS,
  HTTP_STATUS,
} from '../../constants/api';
import type { ITokenManager } from '../core/interfaces/ITokenManager';
import { setupCsrfProtection } from '../security/CsrfProtection';

/**
 * Factory function to create axios instance with optional token manager
 * Uses dependency injection pattern to avoid circular dependencies
 *
 * @param tokenManager - Optional token manager for authentication
 * @returns Configured axios instance with CSRF protection
 */
export function createApiInstance(tokenManager?: ITokenManager): AxiosInstance {
  const instance = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });

  // Setup CSRF protection for the instance
  setupCsrfProtection(instance);

  return instance;
}

/**
 * Factory function to create token utility functions
 * Uses dependency injection pattern to avoid circular dependencies
 *
 * @param tokenManager - Token manager instance to wrap
 * @returns Object with token utility methods
 */
export function createTokenUtils(tokenManager: ITokenManager) {
  return {
    getToken: () => tokenManager.getToken(),
    setToken: (token: string, refreshToken?: string, expiresIn?: number) =>
      tokenManager.setToken(token, refreshToken, expiresIn),
    removeToken: () => tokenManager.clearTokens(),
    getRefreshToken: () => tokenManager.getRefreshToken(),
    setRefreshToken: (token: string) => {
      // Get current token and re-set with new refresh token
      const currentToken = tokenManager.getToken();
      if (currentToken) {
        tokenManager.setToken(currentToken, token);
      }
    },
    removeRefreshToken: () => tokenManager.clearTokens(),
    clearAll: () => tokenManager.clearTokens(),
    isTokenValid: () => tokenManager.isTokenValid(),
    updateActivity: () => tokenManager.updateActivity(),
  };
}

// Export API constants for use in other modules
export { API_ENDPOINTS, HTTP_STATUS };

// Export API_CONFIG from constants
export { API_CONFIG } from '../../constants/config';

// ==========================================
// SINGLETON INSTANCES
// ==========================================
// Import secureTokenManager at bottom to avoid circular dependency
// This follows the dependency injection pattern from ApiClient.ts
import { secureTokenManager } from '../security/SecureTokenManager';

/**
 * Default axios instance for API requests
 * Created using factory function with secureTokenManager injected
 */
export const apiInstance: AxiosInstance = createApiInstance(secureTokenManager);

/**
 * Token utility functions using secureTokenManager
 * Created using factory function with secureTokenManager injected
 */
export const tokenUtils = createTokenUtils(secureTokenManager);

/**
 * Default export for backward compatibility
 */
export default apiInstance;
