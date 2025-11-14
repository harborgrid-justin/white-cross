/**
 * @fileoverview Singleton instance of ApiClient
 * @module services/core/ApiClient.instance
 * @category Services
 *
 * Provides a pre-configured singleton instance of ApiClient for use throughout
 * the application. This ensures consistent configuration and avoids creating
 * multiple client instances.
 *
 * Configuration:
 * - Logging enabled in development, disabled in production (HIPAA compliance)
 * - Retry enabled with default settings (3 retries, exponential backoff)
 * - Secure token manager integrated for authentication
 * - Default base URL and timeout from API_CONFIG
 */

import { ApiClient } from './ApiClient';
import { secureTokenManager } from '../security/SecureTokenManager';

/**
 * Singleton instance of ApiClient with default configuration
 *
 * Pre-configured for:
 * - Development logging (disabled in production for HIPAA compliance)
 * - Automatic retry with exponential backoff
 * - Secure authentication via SecureTokenManager
 * - CSRF protection for state-changing operations
 *
 * @example
 * ```typescript
 * // Use the singleton instance for API calls
 * import { apiClient } from '@/services/core/ApiClient.instance';
 *
 * const response = await apiClient.get<Patient>('/patients/123');
 * console.log(response.data);
 * ```
 */
export const apiClient = new ApiClient({
  enableLogging: process.env.NODE_ENV === 'development',
  enableRetry: true,
  tokenManager: secureTokenManager,
});
