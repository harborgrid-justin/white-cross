/**
 * @fileoverview Token Validation Utilities
 * @module identity-access/utils/tokenSecurity.validation
 *
 * Provides utilities for validating JWT token format, expiration, and payload extraction.
 * These are pure functions with no dependencies, suitable for use throughout the application.
 *
 * Security Considerations:
 * - Validates JWT format (3-part structure with base64url encoding)
 * - Checks token expiration before use
 * - Does NOT verify token signatures (done server-side)
 * - Payload extraction is for display purposes only, not for authorization
 * - Always validate tokens server-side for security-critical operations
 *
 * Important Notes:
 * - These validations are client-side only
 * - Server must always verify token signatures
 * - Never trust client-side token validation for security decisions
 * - Use these for UX improvements (showing expiration, preemptive refreshing)
 *
 * @since 2025-11-04
 */

/**
 * Validates JWT token format and basic structure.
 *
 * Performs client-side validation of JWT format without verifying the signature.
 * Checks that the token has the correct 3-part structure (header.payload.signature)
 * and that each part is valid base64url encoding.
 *
 * @param {string} token - JWT token string to validate
 * @returns {boolean} True if token format is valid, false otherwise
 *
 * @example
 * ```typescript
 * const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U';
 *
 * if (validateTokenFormat(token)) {
 *   console.log('Token format is valid');
 * } else {
 *   console.log('Invalid token format');
 * }
 * ```
 *
 * @remarks
 * Validation Checks:
 * - Token is a non-empty string
 * - Token has exactly 3 parts separated by dots
 * - Each part is valid base64url encoding
 *
 * Security Notes:
 * - Does NOT verify the signature
 * - Does NOT check token expiration
 * - Does NOT validate claims
 * - Server-side verification is still required
 * - Use for client-side UX validation only
 *
 * @see {@link isTokenExpired} for expiration checking
 * @see {@link decodeTokenPayload} for payload extraction
 */
export function validateTokenFormat(token: string): boolean {
  if (!token || typeof token !== 'string') return false;

  // Basic JWT format validation (3 parts separated by dots)
  const parts = token.split('.');
  if (parts.length !== 3) return false;

  try {
    // Validate that each part is valid base64
    for (const part of parts) {
      atob(part.replace(/-/g, '+').replace(/_/g, '/'));
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Extracts expiration time from JWT token.
 *
 * Decodes the JWT payload and extracts the `exp` (expiration) claim. Converts
 * Unix timestamp (seconds) to JavaScript timestamp (milliseconds).
 *
 * @param {string} token - JWT token string
 * @returns {number | null} Expiration timestamp in milliseconds, or null if not found/invalid
 *
 * @example
 * ```typescript
 * const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
 * const expiresAt = getTokenExpiration(token);
 *
 * if (expiresAt) {
 *   const expirationDate = new Date(expiresAt);
 *   console.log(`Token expires at: ${expirationDate.toLocaleString()}`);
 * }
 * ```
 *
 * @remarks
 * - Decodes payload without signature verification
 * - Returns null if token is malformed
 * - Returns null if `exp` claim is missing
 * - Converts seconds to milliseconds (JWT standard is seconds)
 * - Does not validate if expiration is in the past
 *
 * JWT Standard:
 * - `exp` claim is optional in JWT spec
 * - `exp` is NumericDate (seconds since epoch)
 * - Converted to milliseconds for JavaScript Date compatibility
 *
 * @see {@link isTokenExpired} for expiration checking
 * @see {@link getTokenTimeRemaining} for time remaining calculation
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7519#section-4.1.4} JWT exp claim spec
 */
export function getTokenExpiration(token: string): number | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload.exp ? payload.exp * 1000 : null; // Convert to milliseconds
  } catch {
    return null;
  }
}

/**
 * Checks if JWT token is expired.
 *
 * Extracts the expiration claim from the token and compares it to the current time.
 * Returns true if the token is expired, invalid, or has no expiration claim.
 *
 * @param {string} token - JWT token string
 * @returns {boolean} True if token is expired, invalid, or has no expiration; false if valid
 *
 * @example
 * ```typescript
 * const token = getStoredToken();
 *
 * if (isTokenExpired(token)) {
 *   console.log('Token is expired, need to refresh');
 *   await refreshToken();
 * } else {
 *   console.log('Token is still valid');
 *   makeAuthenticatedRequest(token);
 * }
 * ```
 *
 * @remarks
 * Returns True When:
 * - Token is expired (exp < current time)
 * - Token is malformed
 * - Token has no exp claim
 * - Token format is invalid
 *
 * Security Notes:
 * - Client-side check for UX purposes only
 * - Server must always verify expiration
 * - Considers tokens without exp claim as expired (safe default)
 * - Use for preemptive token refresh
 *
 * @see {@link getTokenExpiration} for getting expiration time
 * @see {@link isTokenExpiringSoon} for refresh timing
 * @see {@link getTokenTimeRemaining} for remaining time
 */
export function isTokenExpired(token: string): boolean {
  const expiration = getTokenExpiration(token);
  if (!expiration) return true;

  return Date.now() >= expiration;
}

/**
 * Gets remaining time until token expiration.
 *
 * Calculates how much time remains before the token expires. Useful for
 * implementing countdown timers or deciding when to refresh tokens.
 *
 * @param {string} token - JWT token string
 * @returns {number | null} Remaining time in milliseconds (0 if expired), or null if invalid
 *
 * @example
 * ```typescript
 * const token = getStoredToken();
 * const remaining = getTokenTimeRemaining(token);
 *
 * if (remaining === null) {
 *   console.log('Invalid token');
 * } else if (remaining === 0) {
 *   console.log('Token is expired');
 * } else {
 *   const minutes = Math.floor(remaining / 60000);
 *   console.log(`Token valid for ${minutes} more minutes`);
 *
 *   // Refresh if less than 5 minutes remaining
 *   if (minutes < 5) {
 *     await refreshToken();
 *   }
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Display countdown timer
 * function showTokenTimer() {
 *   const remaining = getTokenTimeRemaining(token);
 *   if (remaining !== null && remaining > 0) {
 *     const seconds = Math.floor(remaining / 1000);
 *     const minutes = Math.floor(seconds / 60);
 *     console.log(`Session expires in ${minutes}:${seconds % 60}`);
 *   }
 * }
 * ```
 *
 * @remarks
 * Return Values:
 * - Positive number: Time remaining in milliseconds
 * - 0: Token is expired
 * - null: Token is invalid or malformed
 *
 * Use Cases:
 * - Session timeout warnings
 * - Countdown timers
 * - Automatic token refresh
 * - UX improvements
 *
 * @see {@link isTokenExpired} for simple expiration check
 * @see {@link isTokenExpiringSoon} for refresh timing
 * @see {@link getTokenExpiration} for absolute expiration time
 */
export function getTokenTimeRemaining(token: string): number | null {
  const expiration = getTokenExpiration(token);
  if (!expiration) return null;

  const remaining = expiration - Date.now();
  return remaining > 0 ? remaining : 0;
}

/**
 * Checks if token will expire soon within a threshold.
 *
 * Determines if the token is approaching expiration, useful for implementing
 * proactive token refresh strategies. Default threshold is 5 minutes.
 *
 * @param {string} token - JWT token string
 * @param {number} [thresholdMs=300000] - Threshold in milliseconds (default: 5 minutes)
 * @returns {boolean} True if token expires within threshold or is already expired
 *
 * @example
 * ```typescript
 * // Check if token expiring in next 5 minutes (default)
 * if (isTokenExpiringSoon(token)) {
 *   console.log('Token expiring soon, refreshing...');
 *   await refreshToken();
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Check with custom threshold (10 minutes)
 * const tenMinutes = 10 * 60 * 1000;
 * if (isTokenExpiringSoon(token, tenMinutes)) {
 *   console.log('Token expiring in next 10 minutes');
 *   showRefreshWarning();
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Automatic refresh strategy
 * setInterval(() => {
 *   const token = getStoredToken();
 *   if (token && isTokenExpiringSoon(token)) {
 *     refreshToken();
 *   }
 * }, 60000); // Check every minute
 * ```
 *
 * @remarks
 * Returns True When:
 * - Token expires within threshold
 * - Token is already expired
 * - Token is invalid or malformed
 *
 * Best Practices:
 * - Use for proactive token refresh
 * - Set threshold based on refresh latency
 * - Consider network delays in threshold
 * - Default 5 minutes is recommended for most cases
 *
 * Threshold Guidelines:
 * - 5 minutes (default): Good for most applications
 * - 10 minutes: Conservative, better for slow networks
 * - 1 minute: Aggressive, requires fast refresh endpoint
 *
 * @see {@link getTokenTimeRemaining} for exact remaining time
 * @see {@link isTokenExpired} for expiration check
 * @see {@link TOKEN_SECURITY_CONFIG.TOKEN_EXPIRY_BUFFER} for configured buffer
 */
export function isTokenExpiringSoon(token: string, thresholdMs: number = 5 * 60 * 1000): boolean {
  const remaining = getTokenTimeRemaining(token);
  if (remaining === null) return true;

  return remaining < thresholdMs;
}

/**
 * Extracts and decodes JWT payload without signature verification.
 *
 * Decodes the payload section of a JWT token for inspection. Does NOT verify
 * the token signature, so the payload should not be trusted for security decisions.
 * Use only for display purposes or client-side UX improvements.
 *
 * @param {string} token - JWT token string
 * @returns {Record<string, unknown> | null} Decoded payload object, or null if invalid
 *
 * @example
 * ```typescript
 * const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
 * const payload = decodeTokenPayload(token);
 *
 * if (payload) {
 *   console.log('User ID:', payload.sub);
 *   console.log('Email:', payload.email);
 *   console.log('Role:', payload.role);
 *   console.log('Expires:', new Date(payload.exp * 1000));
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Extract user info for display
 * function getUserDisplayInfo(token: string) {
 *   const payload = decodeTokenPayload(token);
 *   if (!payload) return null;
 *
 *   return {
 *     userId: payload.sub as string,
 *     email: payload.email as string,
 *     role: payload.role as string,
 *     expiresAt: payload.exp ? new Date(payload.exp as number * 1000) : null
 *   };
 * }
 * ```
 *
 * @remarks
 * Security Warnings:
 * - **DOES NOT VERIFY TOKEN SIGNATURE**
 * - Never trust payload for authorization decisions
 * - Payload can be read by anyone (base64 encoded only)
 * - Server must always verify tokens
 * - Use only for client-side display purposes
 *
 * Common JWT Claims:
 * - `sub`: Subject (user ID)
 * - `exp`: Expiration time (seconds since epoch)
 * - `iat`: Issued at (seconds since epoch)
 * - `iss`: Issuer
 * - `aud`: Audience
 * - Custom claims: email, role, permissions, etc.
 *
 * Use Cases (Safe):
 * - Display user info in UI
 * - Show token expiration time
 * - Client-side route protection (with server verification)
 * - UX improvements
 *
 * Use Cases (Unsafe):
 * - Authorization decisions (use server-side verification)
 * - Trusting user roles without verification
 * - Security-critical operations
 *
 * @see {@link validateTokenFormat} for format validation
 * @see {@link getTokenExpiration} for expiration extraction
 * @see {@link https://jwt.io} JWT token decoder and debugger
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7519} JWT specification
 */
export function decodeTokenPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload;
  } catch {
    return null;
  }
}
