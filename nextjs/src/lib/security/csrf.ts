/**
 * CSRF Protection Utilities
 *
 * Implements Cross-Site Request Forgery (CSRF) protection
 * for state-changing operations in the application.
 *
 * @module lib/security/csrf
 */

const CSRF_TOKEN_KEY = 'csrf_token';
const CSRF_HEADER_NAME = 'X-CSRF-Token';

/**
 * Generate a cryptographically secure CSRF token
 */
export function generateCSRFToken(): string {
  if (typeof window === 'undefined') return '';

  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Get or create CSRF token for the session
 */
export function getCSRFToken(): string {
  if (typeof window === 'undefined') return '';

  let token = sessionStorage.getItem(CSRF_TOKEN_KEY);

  if (!token) {
    token = generateCSRFToken();
    sessionStorage.setItem(CSRF_TOKEN_KEY, token);
  }

  return token;
}

/**
 * Validate CSRF token
 */
export function validateCSRFToken(token: string): boolean {
  const storedToken = getCSRFToken();
  return token === storedToken && token.length > 0;
}

/**
 * Clear CSRF token (on logout)
 */
export function clearCSRFToken(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(CSRF_TOKEN_KEY);
  }
}

/**
 * Add CSRF token to request headers
 */
export function addCSRFHeader(headers: Record<string, string> = {}): Record<string, string> {
  const token = getCSRFToken();
  return {
    ...headers,
    [CSRF_HEADER_NAME]: token,
  };
}

/**
 * Get CSRF header name for server-side validation
 */
export function getCSRFHeaderName(): string {
  return CSRF_HEADER_NAME;
}
