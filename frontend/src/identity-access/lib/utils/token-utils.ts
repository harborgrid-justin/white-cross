/**
 * Centralized Token Utilities
 *
 * Single source of truth for token extraction, validation, and cookie management.
 * Consolidates all token-related operations across the application.
 *
 * @module lib/utils/token-utils
 * @since 2025-11-04
 */

import { cookies, headers } from 'next/headers';
import type { NextRequest } from 'next/server';

/**
 * Token cookie configuration
 * Centralized cookie names and settings
 */
export const TOKEN_CONFIG = {
  // Cookie names
  ACCESS_TOKEN: 'authToken',
  REFRESH_TOKEN: 'refreshToken',

  // Alternative cookie names to check (for backwards compatibility)
  ALT_ACCESS_NAMES: ['auth_token', 'access_token', 'token', 'jwt'],
  ALT_REFRESH_NAMES: ['refresh_token'],

  // Cookie options
  OPTIONS: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: {
      access: 24 * 60 * 60, // 24 hours
      refresh: 7 * 24 * 60 * 60, // 7 days
    },
  },
} as const;

/**
 * Token payload interface
 */
export interface TokenPayload {
  id?: string;
  userId?: string;
  email: string;
  role: string;
  exp: number;
  iat: number;
  firstName?: string;
  lastName?: string;
}

/**
 * Extract token from Next.js request
 * Works in middleware, API routes, and server components
 *
 * @param request - Next.js request object
 * @returns Token string or null
 *
 * @example
 * ```typescript
 * // In middleware
 * export function middleware(request: NextRequest) {
 *   const token = extractTokenFromRequest(request);
 *   if (!token) return redirectToLogin();
 * }
 * ```
 */
export function extractTokenFromRequest(request: NextRequest): string | null {
  // Try primary cookie name first
  let token = request.cookies.get(TOKEN_CONFIG.ACCESS_TOKEN)?.value;

  if (token) {
    return token;
  }

  // Try alternative cookie names for backwards compatibility
  for (const altName of TOKEN_CONFIG.ALT_ACCESS_NAMES) {
    token = request.cookies.get(altName)?.value;
    if (token) {
      return token;
    }
  }

  // Try Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader) {
    // Support both "Bearer <token>" and "<token>" formats
    return authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : authHeader;
  }

  return null;
}

/**
 * Extract token from server context (Server Components, Server Actions)
 * Uses Next.js cookies() and headers() helpers
 *
 * @returns Token string or null
 *
 * @example
 * ```typescript
 * // In server component
 * export default async function Page() {
 *   const token = await extractTokenFromServer();
 *   if (!token) redirect('/login');
 * }
 * ```
 */
export async function extractTokenFromServer(): Promise<string | null> {
  try {
    const cookieStore = await cookies();

    // Try primary cookie name first
    let token = cookieStore.get(TOKEN_CONFIG.ACCESS_TOKEN)?.value;

    if (token) {
      return token;
    }

    // Try alternative cookie names
    for (const altName of TOKEN_CONFIG.ALT_ACCESS_NAMES) {
      token = cookieStore.get(altName)?.value;
      if (token) {
        return token;
      }
    }

    // Try Authorization header (for API clients)
    try {
      const headersList = await headers();
      const authHeader = headersList.get('authorization');

      if (authHeader) {
        return authHeader.startsWith('Bearer ')
          ? authHeader.substring(7)
          : authHeader;
      }
    } catch {
      // headers() might throw in some contexts (e.g., static pages)
      // This is expected, continue with null token
    }

    return null;
  } catch (error) {
    console.error('[TokenUtils] Token extraction failed:', error);
    return null;
  }
}

/**
 * Get refresh token from server context
 *
 * @returns Refresh token string or null
 */
export async function getRefreshTokenFromServer(): Promise<string | null> {
  try {
    const cookieStore = await cookies();

    // Try primary refresh token name
    let token = cookieStore.get(TOKEN_CONFIG.REFRESH_TOKEN)?.value;

    if (token) {
      return token;
    }

    // Try alternative names
    for (const altName of TOKEN_CONFIG.ALT_REFRESH_NAMES) {
      token = cookieStore.get(altName)?.value;
      if (token) {
        return token;
      }
    }

    return null;
  } catch (error) {
    console.error('[TokenUtils] Refresh token extraction failed:', error);
    return null;
  }
}

/**
 * Decode JWT token (without verification)
 * NOTE: This only decodes the payload, does NOT verify signature
 * Signature verification must be done server-side with proper secret
 *
 * @param token - JWT token string
 * @returns Decoded payload or null
 */
export function decodeToken(token: string): TokenPayload | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload) as TokenPayload;
  } catch (error) {
    console.error('[TokenUtils] Token decode error:', error);
    return null;
  }
}

/**
 * Check if token is expired
 *
 * @param payload - Decoded token payload
 * @param clockSkewSeconds - Allow for clock skew (default: 30 seconds)
 * @returns true if token is expired
 */
export function isTokenExpired(payload: TokenPayload, clockSkewSeconds: number = 30): boolean {
  if (!payload.exp) {
    return true;
  }

  const now = Math.floor(Date.now() / 1000);
  return payload.exp < (now - clockSkewSeconds);
}

/**
 * Check if token is expiring soon
 *
 * @param payload - Decoded token payload
 * @param warningThresholdSeconds - Threshold in seconds (default: 5 minutes)
 * @returns true if token expires within threshold
 */
export function isTokenExpiringSoon(payload: TokenPayload, warningThresholdSeconds: number = 300): boolean {
  if (!payload.exp) {
    return true;
  }

  const now = Math.floor(Date.now() / 1000);
  return payload.exp < (now + warningThresholdSeconds);
}

/**
 * Get time remaining until token expiration
 *
 * @param payload - Decoded token payload
 * @returns Seconds until expiration, or 0 if already expired
 */
export function getTimeRemaining(payload: TokenPayload): number {
  if (!payload.exp) {
    return 0;
  }

  const now = Math.floor(Date.now() / 1000);
  return Math.max(0, payload.exp - now);
}

/**
 * Set access token cookie
 * Server-side only
 *
 * @param token - Access token to set
 * @param maxAge - Optional max age in seconds
 */
export async function setAccessToken(token: string, maxAge?: number): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(TOKEN_CONFIG.ACCESS_TOKEN, token, {
    ...TOKEN_CONFIG.OPTIONS,
    maxAge: maxAge || TOKEN_CONFIG.OPTIONS.maxAge.access,
  });
}

/**
 * Set refresh token cookie
 * Server-side only
 *
 * @param token - Refresh token to set
 * @param maxAge - Optional max age in seconds
 */
export async function setRefreshToken(token: string, maxAge?: number): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(TOKEN_CONFIG.REFRESH_TOKEN, token, {
    ...TOKEN_CONFIG.OPTIONS,
    maxAge: maxAge || TOKEN_CONFIG.OPTIONS.maxAge.refresh,
  });
}

/**
 * Set both access and refresh tokens
 * Server-side only
 *
 * @param accessToken - Access token
 * @param refreshToken - Refresh token
 */
export async function setTokens(accessToken: string, refreshToken: string): Promise<void> {
  await Promise.all([
    setAccessToken(accessToken),
    setRefreshToken(refreshToken),
  ]);
}

/**
 * Clear access token cookie
 * Server-side only
 */
export async function clearAccessToken(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_CONFIG.ACCESS_TOKEN);
}

/**
 * Clear refresh token cookie
 * Server-side only
 */
export async function clearRefreshToken(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_CONFIG.REFRESH_TOKEN);
}

/**
 * Clear all token cookies
 * Server-side only
 */
export async function clearAllTokens(): Promise<void> {
  const cookieStore = await cookies();

  // Clear primary tokens
  cookieStore.delete(TOKEN_CONFIG.ACCESS_TOKEN);
  cookieStore.delete(TOKEN_CONFIG.REFRESH_TOKEN);

  // Clear alternative token names for thorough cleanup
  for (const altName of TOKEN_CONFIG.ALT_ACCESS_NAMES) {
    try {
      cookieStore.delete(altName);
    } catch {
      // Ignore errors for non-existent cookies
    }
  }

  for (const altName of TOKEN_CONFIG.ALT_REFRESH_NAMES) {
    try {
      cookieStore.delete(altName);
    } catch {
      // Ignore errors for non-existent cookies
    }
  }
}

/**
 * Check if token exists (without validation)
 * Quick check for token presence
 *
 * @returns true if access token cookie exists
 */
export async function hasToken(): Promise<boolean> {
  try {
    const token = await extractTokenFromServer();
    return token !== null;
  } catch {
    return false;
  }
}

/**
 * Validate token structure (basic check)
 * Does NOT verify signature - only checks format
 *
 * @param token - Token string to validate
 * @returns true if token has valid JWT structure
 */
export function isValidTokenStructure(token: string): boolean {
  if (!token || typeof token !== 'string') {
    return false;
  }

  const parts = token.split('.');

  // JWT should have 3 parts: header.payload.signature
  if (parts.length !== 3) {
    return false;
  }

  // Check if parts are base64 encoded
  try {
    atob(parts[0].replace(/-/g, '+').replace(/_/g, '/'));
    atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
    return true;
  } catch {
    return false;
  }
}
