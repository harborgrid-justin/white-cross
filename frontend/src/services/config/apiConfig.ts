/**
 * @fileoverview API Configuration and Axios Instance Factory
 * @module services/config/apiConfig
 * @category Services
 *
 * Provides centralized API configuration, Axios instance creation, and token management
 * utilities for the White Cross healthcare platform. Implements dependency injection
 * pattern to avoid circular dependencies while maintaining clean architecture.
 *
 * Key Features:
 * - Factory functions for creating configured Axios instances
 * - CSRF protection integration
 * - Token management utilities with ITokenManager interface
 * - Dependency injection to prevent circular dependencies
 * - Singleton instances for application-wide use
 *
 * Architecture Pattern:
 * This module uses factory functions (createApiInstance, createTokenUtils) that accept
 * dependencies as parameters, avoiding circular dependency issues while maintaining
 * testability and flexibility. Singleton instances are created at the bottom after
 * all imports are resolved.
 *
 * Security Features:
 * - CSRF protection automatically configured
 * - Secure token management integration
 * - withCredentials enabled for cookie-based auth
 * - Configurable timeout for request security
 *
 * Healthcare Compliance:
 * - HIPAA-compliant configuration
 * - Secure credential handling
 * - Audit-friendly request/response patterns
 * - PHI protection through secure transport
 *
 * @example
 * ```typescript
 * // Use singleton instance (most common)
 * import { apiInstance } from '@/services/config/apiConfig';
 *
 * const response = await apiInstance.get('/api/patients');
 * const patients = response.data;
 *
 * // Use token utilities
 * import { tokenUtils } from '@/services/config/apiConfig';
 *
 * const token = tokenUtils.getToken();
 * if (token) {
 *   // Token is valid
 * }
 *
 * // Create custom instance (advanced)
 * import { createApiInstance } from '@/services/config/apiConfig';
 * import { myCustomTokenManager } from './myTokenManager';
 *
 * const customInstance = createApiInstance(myCustomTokenManager);
 * ```
 *
 * @see {@link createApiInstance} for Axios instance creation
 * @see {@link createTokenUtils} for token utility creation
 * @see {@link ITokenManager} for token manager interface
 */

import axios, { AxiosInstance } from 'axios';
import { API_CONFIG } from '../../constants/config';
import {
  API_ENDPOINTS,
  HTTP_STATUS,
} from '../../constants/api';
import type { ITokenManager } from '../core/interfaces/ITokenManager';
import { setupCsrfProtection } from '../security/CsrfProtection';

/**
 * Factory function to create configured Axios instance with CSRF protection
 *
 * @param {ITokenManager} [tokenManager] - Optional token manager for authentication integration
 * @returns {AxiosInstance} Configured Axios instance ready for API requests
 *
 * @description
 * Creates an Axios instance with standard configuration for the healthcare platform API.
 * Uses dependency injection pattern to accept an optional token manager, avoiding
 * circular dependency issues while maintaining clean architecture.
 *
 * **Instance Configuration**:
 * - Base URL: Configured from API_CONFIG.BASE_URL
 * - Timeout: Configured from API_CONFIG.TIMEOUT
 * - Content-Type: application/json
 * - withCredentials: true (enables cookies for CSRF)
 * - CSRF Protection: Automatically configured via setupCsrfProtection
 *
 * **Dependency Injection Benefits**:
 * - Avoids circular dependencies with token manager
 * - Enables testing with mock token managers
 * - Supports multiple instances with different configurations
 * - Maintains separation of concerns
 *
 * **CSRF Protection**:
 * Automatically injects CSRF tokens into state-changing requests (POST, PUT, PATCH, DELETE)
 * via the setupCsrfProtection interceptor. Tokens are extracted from meta tags or cookies.
 *
 * **Security Features**:
 * - HTTPS-only in production (via BASE_URL)
 * - Request timeout prevents hanging requests
 * - withCredentials enables secure cookie handling
 * - CSRF protection against cross-site attacks
 *
 * @example
 * ```typescript
 * // Create instance with default token manager
 * import { createApiInstance } from '@/services/config/apiConfig';
 * import { secureTokenManager } from '@/services/security';
 *
 * const apiClient = createApiInstance(secureTokenManager);
 *
 * // Make authenticated request
 * const response = await apiClient.get('/api/patients');
 *
 * // Create instance without token manager (public API)
 * const publicApiClient = createApiInstance();
 * const publicData = await publicApiClient.get('/api/public/info');
 *
 * // Create instance with custom token manager (testing)
 * const mockTokenManager = {
 *   getToken: () => 'mock-token',
 *   setToken: jest.fn(),
 *   clearTokens: jest.fn(),
 *   // ... other ITokenManager methods
 * };
 * const testClient = createApiInstance(mockTokenManager);
 * ```
 *
 * @see {@link setupCsrfProtection} for CSRF configuration
 * @see {@link ITokenManager} for token manager interface
 * @see {@link API_CONFIG} for base configuration
 */
export function createApiInstance(_tokenManager?: ITokenManager): AxiosInstance {
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
 * Factory function to create token utility functions wrapping a token manager
 *
 * @param {ITokenManager} tokenManager - Token manager instance to wrap with utility methods
 * @returns {TokenUtilityObject} Object with convenient token management methods
 *
 * @description
 * Creates a utility object that wraps an ITokenManager instance with convenient methods
 * for token operations. Provides a simplified API for common token management tasks
 * while maintaining compatibility with the underlying token manager interface.
 *
 * **Provided Utility Methods**:
 * - `getToken()`: Retrieve current access token
 * - `setToken(token, refreshToken?, expiresIn?)`: Store access and refresh tokens
 * - `removeToken()`: Clear all tokens
 * - `getRefreshToken()`: Retrieve current refresh token
 * - `setRefreshToken(token)`: Update only the refresh token
 * - `removeRefreshToken()`: Clear all tokens (same as removeToken)
 * - `clearAll()`: Clear all tokens (same as removeToken)
 * - `isTokenValid()`: Check if current token is valid
 * - `updateActivity()`: Update last activity timestamp
 *
 * **Dependency Injection Benefits**:
 * - Avoids circular dependencies
 * - Enables testing with mock token managers
 * - Supports multiple token utility instances
 * - Maintains clean separation of concerns
 *
 * **Use Cases**:
 * - Simplify token access in API interceptors
 * - Provide convenient token management in components
 * - Abstract token manager implementation details
 * - Enable easy token manager switching
 *
 * @example
 * ```typescript
 * // Create token utilities with secure token manager
 * import { createTokenUtils } from '@/services/config/apiConfig';
 * import { secureTokenManager } from '@/services/security';
 *
 * const tokenUtils = createTokenUtils(secureTokenManager);
 *
 * // Store token after login
 * await login(credentials);
 * tokenUtils.setToken(accessToken, refreshToken);
 *
 * // Check token validity before operation
 * if (tokenUtils.isTokenValid()) {
 *   await performAuthenticatedOperation();
 * } else {
 *   redirectToLogin();
 * }
 *
 * // Get token for manual request
 * const token = tokenUtils.getToken();
 * if (token) {
 *   fetch('/api/endpoint', {
 *     headers: { Authorization: `Bearer ${token}` }
 *   });
 * }
 *
 * // Update only refresh token (after token refresh)
 * const newRefreshToken = await refreshAuthToken();
 * tokenUtils.setRefreshToken(newRefreshToken);
 *
 * // Clear tokens on logout
 * await logout();
 * tokenUtils.clearAll();
 *
 * // Create utilities with mock token manager (testing)
 * const mockTokenManager = {
 *   getToken: jest.fn().mockReturnValue('test-token'),
 *   setToken: jest.fn(),
 *   clearTokens: jest.fn(),
 *   isTokenValid: jest.fn().mockReturnValue(true),
 *   // ... other ITokenManager methods
 * };
 * const testTokenUtils = createTokenUtils(mockTokenManager);
 * ```
 *
 * @see {@link ITokenManager} for underlying token manager interface
 * @see {@link secureTokenManager} for default token manager implementation
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
 * Default Axios instance for application-wide API requests
 *
 * @type {AxiosInstance}
 *
 * @description
 * Singleton Axios instance configured with CSRF protection and secure token management.
 * This is the primary API client used throughout the application for making authenticated
 * requests to the backend API.
 *
 * **Configuration**:
 * - Base URL: From API_CONFIG.BASE_URL environment variable
 * - Timeout: From API_CONFIG.TIMEOUT configuration
 * - CSRF Protection: Automatically enabled
 * - Token Management: Integrated with secureTokenManager
 * - Credentials: Enabled for cookie-based authentication
 *
 * **Interceptors**:
 * - Request: CSRF token injection for state-changing methods
 * - Token management handled by secureTokenManager integration
 *
 * **Security Features**:
 * - HIPAA-compliant token handling via secureTokenManager
 * - CSRF protection against cross-site attacks
 * - Secure credential management
 * - Automatic session timeout enforcement
 *
 * @example
 * ```typescript
 * import { apiInstance } from '@/services/config/apiConfig';
 *
 * // GET request
 * const patients = await apiInstance.get('/api/patients');
 *
 * // POST request (CSRF token auto-injected)
 * const newPatient = await apiInstance.post('/api/patients', patientData);
 *
 * // PUT request with params
 * const updated = await apiInstance.put(`/api/patients/${id}`, updates);
 *
 * // DELETE request
 * await apiInstance.delete(`/api/patients/${id}`);
 *
 * // Request with custom headers
 * const data = await apiInstance.get('/api/data', {
 *   headers: { 'X-Custom-Header': 'value' }
 * });
 * ```
 *
 * @see {@link createApiInstance} for instance creation logic
 * @see {@link secureTokenManager} for token management
 */
export const apiInstance: AxiosInstance = createApiInstance(secureTokenManager);

/**
 * Default token utility functions for application-wide token management
 *
 * @type {TokenUtilityObject}
 *
 * @description
 * Singleton token utility object that wraps the secureTokenManager with convenient
 * methods for token operations. This is the primary interface for token management
 * throughout the application.
 *
 * **Available Methods**:
 * - `getToken()`: Get current access token
 * - `setToken(token, refreshToken?, expiresIn?)`: Store tokens
 * - `removeToken()`: Clear all tokens
 * - `getRefreshToken()`: Get current refresh token
 * - `setRefreshToken(token)`: Update refresh token
 * - `clearAll()`: Clear all tokens
 * - `isTokenValid()`: Check token validity
 * - `updateActivity()`: Update activity timestamp
 *
 * **Security Features**:
 * - HIPAA-compliant token storage via secureTokenManager
 * - Automatic token expiration checking
 * - Session timeout enforcement (8 hours inactivity)
 * - Secure token lifecycle management
 *
 * @example
 * ```typescript
 * import { tokenUtils } from '@/services/config/apiConfig';
 *
 * // After login
 * const { accessToken, refreshToken } = await authApi.login(credentials);
 * tokenUtils.setToken(accessToken, refreshToken);
 *
 * // Before authenticated operation
 * if (!tokenUtils.isTokenValid()) {
 *   redirectToLogin();
 *   return;
 * }
 *
 * // Get token for manual request
 * const token = tokenUtils.getToken();
 * if (token) {
 *   // Use token
 * }
 *
 * // Update activity on user interaction
 * tokenUtils.updateActivity();
 *
 * // On logout
 * await authApi.logout();
 * tokenUtils.clearAll();
 * ```
 *
 * @see {@link createTokenUtils} for utility creation logic
 * @see {@link secureTokenManager} for underlying token manager
 */
export const tokenUtils = createTokenUtils(secureTokenManager);

/**
 * Default export of apiInstance for backward compatibility
 *
 * @type {AxiosInstance}
 *
 * @description
 * Default export of the singleton apiInstance for modules that use default import syntax.
 * Prefer named imports (import { apiInstance }) for better IDE support and explicit naming.
 *
 * @example
 * ```typescript
 * // Default import (backward compatibility)
 * import apiClient from '@/services/config/apiConfig';
 * const data = await apiClient.get('/api/endpoint');
 *
 * // Named import (preferred)
 * import { apiInstance } from '@/services/config/apiConfig';
 * const data = await apiInstance.get('/api/endpoint');
 * ```
 *
 * @see {@link apiInstance} for full documentation
 */
export default apiInstance;
