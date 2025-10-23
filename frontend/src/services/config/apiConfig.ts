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
  CONTENT_TYPES,
  REQUEST_CONFIG,
  API_CONSTANTS
} from '../../constants/api';
import { secureTokenManager } from '../security/SecureTokenManager';
import { setupCsrfProtection } from '../security/CsrfProtection';

// Create axios instance
export const apiInstance: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Note: Authentication interceptors are handled by ApiClient.ts
// This basic instance is for simple configurations and backward compatibility
// For authenticated requests, use ApiClient instance instead

// Setup CSRF protection for apiInstance
setupCsrfProtection(apiInstance);

// Utility functions - migrated to use SecureTokenManager
export const tokenUtils = {
  getToken: () => secureTokenManager.getToken(),
  setToken: (token: string, refreshToken?: string, expiresIn?: number) =>
    secureTokenManager.setToken(token, refreshToken, expiresIn),
  removeToken: () => secureTokenManager.clearTokens(),
  getRefreshToken: () => secureTokenManager.getRefreshToken(),
  setRefreshToken: (token: string) => {
    // Get current token and re-set with new refresh token
    const currentToken = secureTokenManager.getToken();
    if (currentToken) {
      secureTokenManager.setToken(currentToken, token);
    }
  },
  removeRefreshToken: () => secureTokenManager.clearTokens(),
  clearAll: () => secureTokenManager.clearTokens(),
  isTokenValid: () => secureTokenManager.isTokenValid(),
  updateActivity: () => secureTokenManager.updateActivity(),
};

// Export API constants for use in other modules
export { API_ENDPOINTS, HTTP_STATUS, CONTENT_TYPES, REQUEST_CONFIG, API_CONSTANTS };

// Export API_CONFIG from constants
export { API_CONFIG } from '../../constants/config';

export default apiInstance;
