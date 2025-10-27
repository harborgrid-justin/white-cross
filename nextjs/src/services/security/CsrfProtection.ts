/**
 * WF-COMP-SEC-002 | CsrfProtection.ts - CSRF Token Protection Service
 * Purpose: Cross-Site Request Forgery protection for healthcare platform
 * Security: Implements CSRF token validation for all state-changing requests
 * Upstream: None | Dependencies: axios
 * Downstream: apiInstance, API interceptors | Called by: HTTP request interceptors
 * Related: apiConfig.ts, ApiClient.ts
 * Exports: CsrfProtection class, csrfProtection singleton, setupCsrfProtection function
 * Last Updated: 2025-10-21 | File Type: .ts
 * Critical Path: Request initiation → CSRF token injection → Server validation
 * LLM Context: Security-critical module for healthcare platform, prevents CSRF attacks on PHI
 */

import type { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

/**
 * CSRF token storage interface for cached token management.
 *
 * Tracks CSRF token value, creation time, and expiration for automatic
 * token refresh and validation.
 *
 * @property {string} token - CSRF token value from meta tag or cookie
 * @property {number} timestamp - When token was cached (milliseconds since epoch)
 * @property {number} expiresAt - When cached token expires (milliseconds since epoch)
 */
interface CsrfToken {
  token: string;
  timestamp: number;
  expiresAt: number;
}

/**
 * HTTP methods that require CSRF protection
 * GET, HEAD, OPTIONS are considered safe methods
 */
const STATE_CHANGING_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'] as const;

/**
 * Enterprise-grade CSRF protection for healthcare platform
 *
 * Features:
 * - Automatic CSRF token injection for state-changing requests
 * - Token retrieval from meta tags or cookies
 * - Token refresh and validation
 * - Thread-safe singleton pattern
 * - Configurable token header name
 *
 * Security Benefits:
 * - Prevents cross-site request forgery attacks
 * - Protects PHI from unauthorized modifications
 * - Complies with OWASP security guidelines
 * - Defense-in-depth for healthcare data
 *
 * Implementation:
 * - Checks meta tag: <meta name="csrf-token" content="token">
 * - Falls back to cookie: XSRF-TOKEN or CSRF-TOKEN
 * - Injects token in X-CSRF-Token header
 *
 * @example
 * ```typescript
 * // Setup with axios instance
 * import { setupCsrfProtection } from '@/services/security/CsrfProtection';
 * import { apiInstance } from '@/services/config/apiConfig';
 *
 * setupCsrfProtection(apiInstance);
 * ```
 *
 * Backend Requirements:
 * - Server must set CSRF token in:
 *   1. Meta tag: <meta name="csrf-token" content="token">
 *   2. Cookie: XSRF-TOKEN or CSRF-TOKEN
 * - Server must validate X-CSRF-Token header
 * - Token should rotate on authentication changes
 */
export class CsrfProtection {
  private static instance: CsrfProtection | null = null;
  private tokenCache: CsrfToken | null = null;
  private readonly TOKEN_HEADER = 'X-CSRF-Token';
  private readonly META_TAG_NAME = 'csrf-token';
  private readonly COOKIE_NAMES = ['XSRF-TOKEN', 'CSRF-TOKEN'];
  private readonly TOKEN_TTL = 60 * 60 * 1000; // 1 hour

  private constructor() {
    // Initialize token on construction
    this.refreshToken();
  }

  /**
   * Get singleton instance of CsrfProtection.
   *
   * Implements thread-safe singleton pattern to ensure consistent CSRF
   * protection across the application. First call initializes token cache.
   *
   * Security Benefits:
   * - Centralized CSRF token management
   * - Consistent token injection across all API calls
   * - Single token refresh lifecycle
   *
   * @returns {CsrfProtection} Singleton instance of CsrfProtection
   *
   * @example
   * ```typescript
   * const csrfProtection = CsrfProtection.getInstance();
   * const token = csrfProtection.getToken();
   * ```
   */
  public static getInstance(): CsrfProtection {
    if (!CsrfProtection.instance) {
      CsrfProtection.instance = new CsrfProtection();
    }
    return CsrfProtection.instance;
  }

  /**
   * Setup CSRF protection on an Axios instance.
   *
   * Registers a request interceptor that automatically injects CSRF token
   * into state-changing HTTP requests (POST, PUT, PATCH, DELETE). Safe
   * methods (GET, HEAD, OPTIONS) are not modified.
   *
   * Security Features:
   * - Automatic token injection for protected methods
   * - Transparent to application code
   * - Configurable via interceptor pattern
   * - Fails gracefully on token absence
   *
   * OWASP Compliance:
   * - Implements synchronizer token pattern
   * - Follows CSRF protection best practices
   * - Validates state-changing operations only
   *
   * @param {AxiosInstance} axiosInstance - Axios instance to protect with CSRF
   * @returns {number} Interceptor ID for later removal if needed
   *
   * @example
   * ```typescript
   * import axios from 'axios';
   * import { csrfProtection } from './CsrfProtection';
   *
   * const apiClient = axios.create({ baseURL: '/api' });
   * const interceptorId = csrfProtection.setupInterceptor(apiClient);
   *
   * // All POST/PUT/PATCH/DELETE requests now include CSRF token
   * await apiClient.post('/users', data); // Includes X-CSRF-Token header
   *
   * // Later, remove interceptor if needed
   * apiClient.interceptors.request.eject(interceptorId);
   * ```
   *
   * @see {@link injectCsrfToken} for token injection logic
   */
  public setupInterceptor(axiosInstance: AxiosInstance): number {
    return axiosInstance.interceptors.request.use(
      (config) => this.injectCsrfToken(config),
      (error) => Promise.reject(error)
    );
  }

  /**
   * Inject CSRF token into request headers.
   *
   * Automatically adds X-CSRF-Token header to state-changing HTTP requests.
   * Safe methods (GET, HEAD, OPTIONS) are not modified. Fails gracefully
   * if token is unavailable, logging warning but allowing request.
   *
   * Protected Methods:
   * - POST: Create operations
   * - PUT: Full resource updates
   * - PATCH: Partial resource updates
   * - DELETE: Resource deletion
   *
   * Security Features:
   * - Selective injection (state-changing methods only)
   * - Graceful degradation on token absence
   * - Debug logging for monitoring
   * - Non-invasive error handling
   *
   * Threat Protection:
   * - Prevents CSRF attacks on PHI modifications
   * - Validates request origin via token
   * - Complements same-origin policy
   * - Defense-in-depth security layer
   *
   * @param {InternalAxiosRequestConfig} config - Axios request configuration
   * @returns {InternalAxiosRequestConfig} Modified request configuration with CSRF token
   *
   * @example
   * ```typescript
   * // Manually inject token (usually done by interceptor)
   * const config = {
   *   method: 'POST',
   *   url: '/api/patients',
   *   data: patientData
   * };
   * const protectedConfig = csrfProtection.injectCsrfToken(config);
   * // protectedConfig now includes X-CSRF-Token header
   * ```
   *
   * @see {@link STATE_CHANGING_METHODS} for list of protected methods
   */
  public injectCsrfToken(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
    try {
      const method = config.method?.toUpperCase();

      // Only inject token for state-changing methods
      if (!method || !this.isStateChangingMethod(method)) {
        return config;
      }

      const token = this.getToken();
      if (token) {
        config.headers = config.headers || {};
        config.headers[this.TOKEN_HEADER] = token;

        console.debug('[CsrfProtection] CSRF token injected', {
          method,
          url: config.url,
        });
      } else {
        console.warn('[CsrfProtection] No CSRF token available for request', {
          method,
          url: config.url,
        });
      }

      return config;
    } catch (error) {
      console.error('[CsrfProtection] Failed to inject CSRF token:', error);
      return config;
    }
  }

  /**
   * Get current CSRF token.
   *
   * Returns cached CSRF token if valid, otherwise refreshes from document.
   * Token is cached for 1 hour (TOKEN_TTL) to minimize DOM access overhead.
   *
   * Token Sources (priority order):
   * 1. Meta tag: <meta name="csrf-token" content="token">
   * 2. Cookies: XSRF-TOKEN or CSRF-TOKEN
   *
   * Security Features:
   * - Automatic cache validation and refresh
   * - Multiple fallback sources for compatibility
   * - Fail-safe returns null on errors
   * - Performance optimization via caching
   *
   * @returns {string | null} CSRF token string, or null if unavailable
   *
   * @example
   * ```typescript
   * const token = csrfProtection.getToken();
   * if (token) {
   *   // Include token in custom request
   *   fetch('/api/endpoint', {
   *     method: 'POST',
   *     headers: { 'X-CSRF-Token': token }
   *   });
   * } else {
   *   console.warn('CSRF token not available');
   * }
   * ```
   *
   * @remarks
   * Most applications don't call this directly - use setupInterceptor()
   * for automatic token injection.
   */
  public getToken(): string | null {
    try {
      // Check if cached token is still valid
      if (this.tokenCache && Date.now() < this.tokenCache.expiresAt) {
        return this.tokenCache.token;
      }

      // Refresh token
      this.refreshToken();

      return this.tokenCache?.token || null;
    } catch (error) {
      console.error('[CsrfProtection] Failed to get CSRF token:', error);
      return null;
    }
  }

  /**
   * Refresh CSRF token from meta tag or cookie.
   *
   * Extracts fresh CSRF token from document and updates internal cache
   * with new expiration time (1 hour TTL). Call this method after
   * authentication changes or when token becomes stale.
   *
   * Token Extraction Order:
   * 1. Meta tag (preferred): <meta name="csrf-token" content="...">
   * 2. Cookie fallback: XSRF-TOKEN or CSRF-TOKEN
   *
   * Use Cases:
   * - After user login/logout
   * - On authentication state changes
   * - Manual token refresh for long-running sessions
   * - Recovery from token mismatch errors
   *
   * Security Features:
   * - Updates cache with fresh server-provided token
   * - Prevents token staleness issues
   * - Maintains token synchronization with backend
   *
   * @example
   * ```typescript
   * // Refresh token after login
   * async function login(credentials) {
   *   await authApi.login(credentials);
   *   csrfProtection.refreshToken(); // Get new token for session
   * }
   *
   * // Refresh on 403 CSRF error
   * apiClient.interceptors.response.use(
   *   response => response,
   *   error => {
   *     if (error.response?.status === 403) {
   *       csrfProtection.refreshToken();
   *       return retryRequest(error.config);
   *     }
   *     return Promise.reject(error);
   *   }
   * );
   * ```
   */
  public refreshToken(): void {
    try {
      const token = this.extractTokenFromDocument();

      if (token) {
        const now = Date.now();
        this.tokenCache = {
          token,
          timestamp: now,
          expiresAt: now + this.TOKEN_TTL,
        };

        console.info('[CsrfProtection] CSRF token refreshed');
      } else {
        this.tokenCache = null;
        console.warn('[CsrfProtection] No CSRF token found in document or cookies');
      }
    } catch (error) {
      console.error('[CsrfProtection] Failed to refresh CSRF token:', error);
      this.tokenCache = null;
    }
  }

  /**
   * Clear cached CSRF token.
   *
   * Removes cached token from memory. Call this method on logout or
   * authentication state changes to prevent token reuse across sessions.
   *
   * Security Benefits:
   * - Prevents token reuse after logout
   * - Clears stale tokens on auth changes
   * - Forces fresh token fetch on next request
   *
   * Use Cases:
   * - User logout
   * - Session expiration
   * - Authentication errors
   * - Token invalidation on server
   *
   * @example
   * ```typescript
   * // Clear token on logout
   * async function logout() {
   *   await authApi.logout();
   *   csrfProtection.clearToken();
   *   secureTokenManager.clearTokens();
   *   redirectToLogin();
   * }
   *
   * // Clear on authentication change
   * authStore.subscribe((state) => {
   *   if (!state.isAuthenticated) {
   *     csrfProtection.clearToken();
   *   }
   * });
   * ```
   */
  public clearToken(): void {
    this.tokenCache = null;
    console.info('[CsrfProtection] CSRF token cleared');
  }

  /**
   * Extract CSRF token from document sources.
   *
   * Attempts to retrieve CSRF token from multiple sources in priority order.
   * First checks meta tag (preferred), then falls back to cookies.
   *
   * Token Sources:
   * 1. Meta tag: More secure, not sent with every request
   * 2. Cookies: Fallback for compatibility, sent automatically
   *
   * @private
   *
   * @returns {string | null} CSRF token string or null if not found
   *
   * @see {@link getTokenFromMetaTag} for meta tag extraction
   * @see {@link getTokenFromCookie} for cookie extraction
   */
  private extractTokenFromDocument(): string | null {
    // Try meta tag first
    const metaToken = this.getTokenFromMetaTag();
    if (metaToken) {
      return metaToken;
    }

    // Fall back to cookies
    const cookieToken = this.getTokenFromCookie();
    if (cookieToken) {
      return cookieToken;
    }

    return null;
  }

  /**
   * Get CSRF token from meta tag.
   *
   * Searches DOM for meta tag with name="csrf-token" and extracts content
   * attribute. This is the preferred method as meta tags are not automatically
   * sent with requests (unlike cookies).
   *
   * Expected HTML:
   * ```html
   * <meta name="csrf-token" content="token-value-here">
   * ```
   *
   * Security Benefits:
   * - Token not sent automatically with requests
   * - Explicit inclusion prevents certain attack vectors
   * - More control over token exposure
   *
   * @private
   *
   * @returns {string | null} Token string from meta tag content, or null if not found
   */
  private getTokenFromMetaTag(): string | null {
    try {
      // Check if we're in a browser environment
      if (typeof document === 'undefined') {
        return null;
      }

      const metaTag = document.querySelector<HTMLMetaElement>(
        `meta[name="${this.META_TAG_NAME}"]`
      );

      if (metaTag && metaTag.content) {
        return metaTag.content.trim();
      }

      return null;
    } catch (error) {
      console.warn('[CsrfProtection] Failed to get token from meta tag:', error);
      return null;
    }
  }

  /**
   * Get CSRF token from cookies.
   *
   * Searches document.cookie for CSRF token using multiple standard cookie
   * names for framework compatibility. Tries XSRF-TOKEN (Angular/Laravel)
   * and CSRF-TOKEN (Django/Rails) in order.
   *
   * Standard Cookie Names:
   * - XSRF-TOKEN: Used by Angular, Laravel
   * - CSRF-TOKEN: Used by Django, Rails
   *
   * Security Note:
   * - Cookies are automatically sent with requests (less secure than meta tag)
   * - Use httpOnly=false so JavaScript can read token
   * - SameSite attribute should be Strict or Lax
   *
   * @private
   *
   * @returns {string | null} Decoded token string from cookie, or null if not found
   *
   * @remarks
   * Token is URI-decoded before return to handle encoded special characters.
   */
  private getTokenFromCookie(): string | null {
    try {
      // Check if we're in a browser environment
      if (typeof document === 'undefined') {
        return null;
      }

      const cookies = document.cookie.split(';');

      for (const cookieName of this.COOKIE_NAMES) {
        for (const cookie of cookies) {
          const [name, value] = cookie.trim().split('=');

          if (name === cookieName && value) {
            return decodeURIComponent(value);
          }
        }
      }

      return null;
    } catch (error) {
      console.warn('[CsrfProtection] Failed to get token from cookies:', error);
      return null;
    }
  }

  /**
   * Check if HTTP method requires CSRF protection.
   *
   * Determines if the given HTTP method is state-changing and requires
   * CSRF token. Safe methods (GET, HEAD, OPTIONS) are not protected
   * as they should not modify server state per HTTP specifications.
   *
   * Protected Methods:
   * - POST: Create new resources
   * - PUT: Replace existing resources
   * - PATCH: Partial resource updates
   * - DELETE: Remove resources
   *
   * Safe Methods (not protected):
   * - GET: Read resources
   * - HEAD: Get resource metadata
   * - OPTIONS: Discover allowed methods
   *
   * @private
   *
   * @param {string} method - HTTP method in uppercase (e.g., 'POST', 'GET')
   * @returns {boolean} True if method requires CSRF protection, false otherwise
   *
   * @see {@link STATE_CHANGING_METHODS} for complete list of protected methods
   */
  private isStateChangingMethod(method: string): boolean {
    return STATE_CHANGING_METHODS.includes(method as typeof STATE_CHANGING_METHODS[number]);
  }

  /**
   * Get token cache information.
   *
   * Returns diagnostic information about the cached CSRF token for debugging
   * and monitoring purposes. Useful for troubleshooting CSRF issues and
   * monitoring token lifecycle.
   *
   * Returned Information:
   * - hasToken: Whether a token is currently cached
   * - expiresAt: When cached token expires (milliseconds)
   * - age: How long token has been cached (milliseconds)
   *
   * Use Cases:
   * - Debug CSRF token issues
   * - Monitor token refresh frequency
   * - Health check implementations
   * - Token lifecycle analysis
   *
   * @returns {{ hasToken: boolean; expiresAt?: number; age?: number } | null} Token cache diagnostics
   *
   * @example
   * ```typescript
   * const info = csrfProtection.getTokenInfo();
   * if (info.hasToken) {
   *   console.log('Token age:', info.age, 'ms');
   *   console.log('Expires at:', new Date(info.expiresAt));
   *   console.log('Time until expiry:', info.expiresAt - Date.now(), 'ms');
   * } else {
   *   console.log('No token cached');
   * }
   * ```
   */
  public getTokenInfo(): { hasToken: boolean; expiresAt?: number; age?: number } | null {
    if (!this.tokenCache) {
      return { hasToken: false };
    }

    const now = Date.now();
    return {
      hasToken: true,
      expiresAt: this.tokenCache.expiresAt,
      age: now - this.tokenCache.timestamp,
    };
  }
}

/**
 * Singleton instance of CsrfProtection
 * Use this throughout the application
 *
 * @example
 * ```typescript
 * import { csrfProtection } from '@/services/security/CsrfProtection';
 *
 * // Get current token
 * const token = csrfProtection.getToken();
 *
 * // Refresh token
 * csrfProtection.refreshToken();
 * ```
 */
export const csrfProtection = CsrfProtection.getInstance();

/**
 * Helper function to setup CSRF protection on an Axios instance
 * Recommended approach for most use cases
 *
 * @param axiosInstance - Axios instance to protect
 * @returns Interceptor ID
 *
 * @example
 * ```typescript
 * import { setupCsrfProtection } from '@/services/security/CsrfProtection';
 * import { apiInstance } from '@/services/config/apiConfig';
 *
 * // Setup CSRF protection
 * const interceptorId = setupCsrfProtection(apiInstance);
 *
 * // Later, if needed to remove:
 * // apiInstance.interceptors.request.eject(interceptorId);
 * ```
 */
export function setupCsrfProtection(axiosInstance: AxiosInstance): number {
  return csrfProtection.setupInterceptor(axiosInstance);
}

export default csrfProtection;
