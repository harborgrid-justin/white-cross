/**
 * @fileoverview CSRF Protection Utilities
 * @module lib/helpers/csrf
 *
 * Provides CSRF token generation and validation for server actions.
 * Uses cryptographically secure random tokens stored in HTTP-only cookies.
 *
 * IMPORTANT: Next.js Server Actions have built-in CSRF protection via
 * the Next-Action header. This module provides additional explicit
 * token validation for sensitive operations.
 */

import { cookies } from 'next/headers';
import { randomBytes } from 'crypto';

/**
 * CSRF token cookie name
 */
export const CSRF_COOKIE_NAME = 'csrf_token';

/**
 * CSRF token header/form field name
 */
export const CSRF_TOKEN_NAME = 'csrf_token';

/**
 * Token validity duration (1 hour)
 */
const TOKEN_VALIDITY_MS = 60 * 60 * 1000;

/**
 * Generate a cryptographically secure CSRF token
 *
 * @returns Random token string (32 bytes, hex encoded)
 *
 * @example
 * const token = generateCsrfToken();
 * // Returns: "a1b2c3d4e5f6..." (64 character hex string)
 */
export function generateCsrfToken(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Set CSRF token in HTTP-only cookie
 *
 * Should be called when establishing a session or before
 * rendering forms that perform state-changing operations.
 *
 * @returns The generated token
 *
 * @example
 * const token = await setCsrfToken();
 * // Token is now stored in secure HTTP-only cookie
 */
export async function setCsrfToken(): Promise<string> {
  const token = generateCsrfToken();
  const cookieStore = await cookies();

  cookieStore.set(CSRF_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: TOKEN_VALIDITY_MS / 1000,
    path: '/',
  });

  return token;
}

/**
 * Get current CSRF token from cookie
 *
 * @returns Current token or null if not set
 *
 * @example
 * const token = await getCsrfToken();
 * if (!token) {
 *   // Token not set, need to generate one
 * }
 */
export async function getCsrfToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(CSRF_COOKIE_NAME)?.value || null;
}

/**
 * Validate CSRF token from FormData or headers
 *
 * Compares the submitted token against the token stored in the cookie.
 * Uses constant-time comparison to prevent timing attacks.
 *
 * @param formData - Form data containing the token
 * @param headerToken - Optional token from headers
 * @returns True if token is valid
 *
 * @example FormData validation
 * const isValid = await validateCsrfToken(formData);
 * if (!isValid) {
 *   return actionCsrfError();
 * }
 *
 * @example Header validation
 * const isValid = await validateCsrfToken(null, headers.get('X-CSRF-Token'));
 */
export async function validateCsrfToken(
  formData?: FormData | null,
  headerToken?: string | null
): Promise<boolean> {
  const cookieToken = await getCsrfToken();

  if (!cookieToken) {
    return false;
  }

  // Get submitted token from FormData or headers
  let submittedToken: string | null = null;

  if (formData) {
    const formValue = formData.get(CSRF_TOKEN_NAME);
    submittedToken = typeof formValue === 'string' ? formValue : null;
  } else if (headerToken) {
    submittedToken = headerToken;
  }

  if (!submittedToken) {
    return false;
  }

  // Constant-time comparison to prevent timing attacks
  return timingSafeEqual(cookieToken, submittedToken);
}

/**
 * Timing-safe string comparison
 *
 * Prevents timing attacks by ensuring comparison always takes
 * the same amount of time regardless of where strings differ.
 *
 * @param a - First string
 * @param b - Second string
 * @returns True if strings are equal
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

/**
 * Rotate CSRF token
 *
 * Generates a new token and invalidates the old one.
 * Should be called after sensitive operations like login or password change.
 *
 * @returns The new token
 *
 * @example
 * // After successful login
 * await rotateCsrfToken();
 */
export async function rotateCsrfToken(): Promise<string> {
  return await setCsrfToken();
}

/**
 * Clear CSRF token
 *
 * Removes the CSRF token cookie. Should be called on logout.
 *
 * @example
 * // During logout
 * await clearCsrfToken();
 */
export async function clearCsrfToken(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(CSRF_COOKIE_NAME);
}

/**
 * Middleware helper: Ensure CSRF token exists
 *
 * Generates a token if one doesn't exist. Useful for ensuring
 * tokens are available before rendering forms.
 *
 * @returns The current or newly generated token
 *
 * @example
 * // In a Server Component before rendering a form
 * const csrfToken = await ensureCsrfToken();
 * // Pass to form as hidden field
 */
export async function ensureCsrfToken(): Promise<string> {
  const existingToken = await getCsrfToken();
  return existingToken || await setCsrfToken();
}
