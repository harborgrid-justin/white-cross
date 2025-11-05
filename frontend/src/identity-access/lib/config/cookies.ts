/**
 * @fileoverview Centralized Cookie Configuration
 * @module lib/config/cookies
 *
 * Single source of truth for all authentication cookie settings.
 * Implements security best practices including:
 * - __Host- prefix for maximum security
 * - Consistent naming across the application
 * - Secure defaults for production environments
 * - HIPAA-compliant session management
 *
 * Security Features:
 * - __Host- prefix prevents subdomain and path manipulation
 * - httpOnly prevents XSS attacks
 * - secure ensures HTTPS-only transmission
 * - sameSite prevents CSRF attacks
 * - Appropriate maxAge for healthcare security requirements
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie
 * @see https://web.dev/first-party-cookie-recipes/
 */

import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';

/**
 * Cookie names with __Host- prefix for maximum security
 *
 * The __Host- prefix ensures:
 * - Cookie must be set with Secure flag
 * - Cookie must be set from a secure origin (HTTPS)
 * - Cookie must NOT have a Domain attribute (preventing subdomain access)
 * - Cookie path must be /
 *
 * NOTE: __Host- prefix requires HTTPS. In development (localhost), we use
 * regular cookie names without the prefix.
 */
export const COOKIE_NAMES = {
  /** Access token for API authentication */
  ACCESS_TOKEN: process.env.NODE_ENV === 'production' ? '__Host-auth.token' : 'auth.token',

  /** Refresh token for obtaining new access tokens */
  REFRESH_TOKEN: process.env.NODE_ENV === 'production' ? '__Host-auth.refresh' : 'auth.refresh',

  /** Session identifier (if using session-based auth alongside JWT) */
  SESSION_ID: process.env.NODE_ENV === 'production' ? '__Host-auth.session' : 'auth.session',
} as const;

/**
 * Cookie expiration times in seconds
 */
export const COOKIE_MAX_AGE = {
  /** Access token: 1 hour (short-lived for security) */
  ACCESS_TOKEN: 60 * 60,

  /** Refresh token: 7 days (allows persistent login) */
  REFRESH_TOKEN: 7 * 24 * 60 * 60,

  /** Session: 24 hours (daily re-authentication for HIPAA compliance) */
  SESSION: 24 * 60 * 60,
} as const;

/**
 * Base cookie options for all authentication cookies
 * These settings ensure maximum security
 */
const BASE_COOKIE_OPTIONS: Partial<ResponseCookie> = {
  /** Path where cookie is valid */
  path: '/',

  /** Prevent JavaScript access (XSS protection) */
  httpOnly: true,

  /** Strict CSRF protection - cookie only sent to same-site requests */
  sameSite: 'strict',

  /** Only send over HTTPS in production */
  secure: process.env.NODE_ENV === 'production',
} as const;

/**
 * Get cookie options for access token
 *
 * @param overrides - Optional overrides for specific use cases
 * @returns Complete cookie configuration for access token
 *
 * @example
 * ```typescript
 * import { cookies } from 'next/headers';
 * import { getAccessTokenCookieOptions, COOKIE_NAMES } from './config/cookies';
 *
 * const cookieStore = await cookies();
 * cookieStore.set(COOKIE_NAMES.ACCESS_TOKEN, token, getAccessTokenCookieOptions());
 * ```
 */
export function getAccessTokenCookieOptions(
  overrides?: Partial<ResponseCookie>
): ResponseCookie {
  return {
    ...BASE_COOKIE_OPTIONS,
    maxAge: COOKIE_MAX_AGE.ACCESS_TOKEN,
    ...overrides,
  } as ResponseCookie;
}

/**
 * Get cookie options for refresh token
 *
 * @param overrides - Optional overrides for specific use cases
 * @returns Complete cookie configuration for refresh token
 *
 * @example
 * ```typescript
 * cookieStore.set(COOKIE_NAMES.REFRESH_TOKEN, refreshToken, getRefreshTokenCookieOptions());
 * ```
 */
export function getRefreshTokenCookieOptions(
  overrides?: Partial<ResponseCookie>
): ResponseCookie {
  return {
    ...BASE_COOKIE_OPTIONS,
    maxAge: COOKIE_MAX_AGE.REFRESH_TOKEN,
    ...overrides,
  } as ResponseCookie;
}

/**
 * Get cookie options for session identifier
 *
 * @param overrides - Optional overrides for specific use cases
 * @returns Complete cookie configuration for session
 *
 * @example
 * ```typescript
 * cookieStore.set(COOKIE_NAMES.SESSION_ID, sessionId, getSessionCookieOptions());
 * ```
 */
export function getSessionCookieOptions(
  overrides?: Partial<ResponseCookie>
): ResponseCookie {
  return {
    ...BASE_COOKIE_OPTIONS,
    maxAge: COOKIE_MAX_AGE.SESSION,
    ...overrides,
  } as ResponseCookie;
}

/**
 * Legacy cookie names for migration support
 * These should be removed in a future version
 *
 * @deprecated Use COOKIE_NAMES instead
 */
export const LEGACY_COOKIE_NAMES = {
  auth_token: 'auth_token',
  refresh_token: 'refresh_token',
  authToken: 'authToken',
  refreshToken: 'refreshToken',
} as const;

/**
 * Clear all authentication cookies
 * Useful for logout operations
 *
 * @param cookieStore - Next.js cookies() instance
 *
 * @example
 * ```typescript
 * import { cookies } from 'next/headers';
 * import { clearAuthCookies } from './config/cookies';
 *
 * export async function logout() {
 *   const cookieStore = await cookies();
 *   clearAuthCookies(cookieStore);
 * }
 * ```
 */
export async function clearAuthCookies(
  cookieStore: Awaited<ReturnType<typeof import('next/headers').cookies>>
): Promise<void> {
  // Clear current cookies
  cookieStore.delete(COOKIE_NAMES.ACCESS_TOKEN);
  cookieStore.delete(COOKIE_NAMES.REFRESH_TOKEN);
  cookieStore.delete(COOKIE_NAMES.SESSION_ID);

  // Clear legacy cookies for migration
  Object.values(LEGACY_COOKIE_NAMES).forEach((name) => {
    cookieStore.delete(name);
  });
}

/**
 * Get token from cookies with fallback to legacy names
 * This supports migration from old cookie names to new secure names
 *
 * @param cookieStore - Next.js cookies() instance
 * @returns Access token if found, null otherwise
 *
 * @example
 * ```typescript
 * const token = getAccessTokenFromCookies(await cookies());
 * if (token) {
 *   // Verify and use token
 * }
 * ```
 */
export function getAccessTokenFromCookies(
  cookieStore: Awaited<ReturnType<typeof import('next/headers').cookies>>
): string | null {
  // Try new secure cookie name first
  let token = cookieStore.get(COOKIE_NAMES.ACCESS_TOKEN)?.value;

  if (token) {
    return token;
  }

  // Fall back to legacy names for migration
  for (const legacyName of Object.values(LEGACY_COOKIE_NAMES)) {
    token = cookieStore.get(legacyName)?.value;
    if (token) {
      console.warn(
        `[Cookie Migration] Found token in legacy cookie '${legacyName}'. ` +
        `Please migrate to '${COOKIE_NAMES.ACCESS_TOKEN}' for improved security.`
      );
      return token;
    }
  }

  return null;
}

/**
 * Get refresh token from cookies with fallback to legacy names
 *
 * @param cookieStore - Next.js cookies() instance
 * @returns Refresh token if found, null otherwise
 */
export function getRefreshTokenFromCookies(
  cookieStore: Awaited<ReturnType<typeof import('next/headers').cookies>>
): string | null {
  // Try new secure cookie name first
  const token = cookieStore.get(COOKIE_NAMES.REFRESH_TOKEN)?.value;

  if (token) {
    return token;
  }

  // Fall back to legacy refresh_token
  const legacyToken = cookieStore.get(LEGACY_COOKIE_NAMES.refresh_token)?.value ||
                      cookieStore.get(LEGACY_COOKIE_NAMES.refreshToken)?.value;

  if (legacyToken) {
    console.warn(
      '[Cookie Migration] Found refresh token in legacy cookie. ' +
      `Please migrate to '${COOKIE_NAMES.REFRESH_TOKEN}' for improved security.`
    );
  }

  return legacyToken || null;
}
