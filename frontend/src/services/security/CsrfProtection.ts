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
 * CSRF token storage interface
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
   * Get singleton instance of CsrfProtection
   */
  public static getInstance(): CsrfProtection {
    if (!CsrfProtection.instance) {
      CsrfProtection.instance = new CsrfProtection();
    }
    return CsrfProtection.instance;
  }

  /**
   * Setup CSRF protection on an Axios instance
   * Adds request interceptor to inject CSRF token
   *
   * @param axiosInstance - Axios instance to protect
   * @returns Interceptor ID for potential removal
   */
  public setupInterceptor(axiosInstance: AxiosInstance): number {
    return axiosInstance.interceptors.request.use(
      (config) => this.injectCsrfToken(config),
      (error) => Promise.reject(error)
    );
  }

  /**
   * Inject CSRF token into request headers
   * Only for state-changing methods (POST, PUT, PATCH, DELETE)
   *
   * @param config - Axios request configuration
   * @returns Modified request configuration
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
   * Get current CSRF token
   * Refreshes token if expired
   *
   * @returns CSRF token string or null if not available
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
   * Refresh CSRF token from meta tag or cookie
   * Updates internal cache
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
   * Clear cached CSRF token
   * Call this on logout or authentication changes
   */
  public clearToken(): void {
    this.tokenCache = null;
    console.info('[CsrfProtection] CSRF token cleared');
  }

  /**
   * Extract CSRF token from document
   * Checks meta tag first, then cookies
   * @private
   *
   * @returns CSRF token string or null
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
   * Get CSRF token from meta tag
   * @private
   *
   * @returns Token string or null
   */
  private getTokenFromMetaTag(): string | null {
    try {
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
   * Get CSRF token from cookies
   * Tries multiple cookie names for compatibility
   * @private
   *
   * @returns Token string or null
   */
  private getTokenFromCookie(): string | null {
    try {
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
   * Check if HTTP method requires CSRF protection
   * @private
   *
   * @param method - HTTP method (uppercase)
   * @returns true if method requires CSRF protection
   */
  private isStateChangingMethod(method: string): boolean {
    return STATE_CHANGING_METHODS.includes(method as typeof STATE_CHANGING_METHODS[number]);
  }

  /**
   * Get token cache information
   * Useful for debugging and monitoring
   *
   * @returns Token cache info or null
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
