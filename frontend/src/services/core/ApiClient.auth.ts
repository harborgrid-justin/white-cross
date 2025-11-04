/**
 * @fileoverview Authentication utilities for API Client
 * @module services/core/ApiClient.auth
 * @category Services
 *
 * Provides authentication-related functionality:
 * - Token retrieval from token manager
 * - Token refresh logic
 * - Authentication failure handling
 * - Automatic redirection on auth failure
 */

import axios from 'axios';
import type { ITokenManager } from './interfaces/ITokenManager';
import { API_CONFIG } from '../../constants/config';
import { API_ENDPOINTS } from '../../constants/api';

// ==========================================
// TOKEN OPERATIONS
// ==========================================

/**
 * Get authentication token from token manager
 *
 * @param tokenManager - Token manager instance
 * @returns Access token or null if not available
 */
export function getAuthToken(tokenManager: ITokenManager | undefined): string | null {
  return tokenManager?.getToken() ?? null;
}

/**
 * Refresh authentication token using refresh token
 *
 * Makes a direct API call to refresh endpoint, bypassing interceptors.
 * Updates token manager with new tokens on success.
 *
 * @param tokenManager - Token manager instance
 * @returns New access token or null if refresh failed
 * @throws Error if no refresh token available or refresh failed
 *
 * @example
 * ```typescript
 * try {
 *   const newToken = await refreshAuthToken(tokenManager);
 *   // Use new token for subsequent requests
 * } catch (error) {
 *   // Refresh failed, redirect to login
 *   handleAuthFailure(tokenManager);
 * }
 * ```
 */
export async function refreshAuthToken(tokenManager: ITokenManager | undefined): Promise<string | null> {
  const refreshToken = tokenManager?.getRefreshToken();
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await axios.post<{ token: string; refreshToken?: string; expiresIn?: number }>(
      `${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`,
      { refreshToken }
    );

    const { token, refreshToken: newRefreshToken, expiresIn } = response.data;

    // Update token in TokenManager
    tokenManager?.setToken(token, newRefreshToken || refreshToken, expiresIn);

    return token;
  } catch (error) {
    // Refresh failed, handle auth failure
    handleAuthFailure(tokenManager);
    throw error;
  }
}

/**
 * Handle authentication failure
 *
 * Clears all tokens and redirects to login page if not already there.
 * Called when token refresh fails or auth is permanently invalid.
 *
 * @param tokenManager - Token manager instance
 *
 * @example
 * ```typescript
 * if (error.status === 401 && !canRefresh) {
 *   handleAuthFailure(tokenManager);
 * }
 * ```
 */
export function handleAuthFailure(tokenManager: ITokenManager | undefined): void {
  // Clear all tokens using TokenManager
  tokenManager?.clearTokens();

  // Redirect to login if not already there
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
}
