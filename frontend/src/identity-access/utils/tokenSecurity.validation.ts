/**
 * WF-COMP-354 | tokenSecurity.validation.ts - Token validation utilities
 * Purpose: Token format validation and expiration checking
 * Upstream: None | Dependencies: None
 * Downstream: Authentication flows | Called by: Auth guards, token checks
 * Related: tokenSecurity.storage
 * Exports: Validation functions | Key Features: JWT format validation
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Token validation → Format check → Expiration check
 * LLM Context: Token validation utilities for JWT format and expiration
 */

/**
 * Validates token format and basic structure
 * Checks for valid JWT format (3 parts separated by dots)
 * @param token - Token string to validate
 * @returns True if token format is valid
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
 * Extracts expiration time from JWT token
 * @param token - JWT token string
 * @returns Expiration timestamp in milliseconds or null if not found
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
 * Checks if token is expired
 * @param token - JWT token string
 * @returns True if token is expired or invalid
 */
export function isTokenExpired(token: string): boolean {
  const expiration = getTokenExpiration(token);
  if (!expiration) return true;

  return Date.now() >= expiration;
}

/**
 * Gets remaining time until token expiration
 * @param token - JWT token string
 * @returns Remaining time in milliseconds or null if invalid
 */
export function getTokenTimeRemaining(token: string): number | null {
  const expiration = getTokenExpiration(token);
  if (!expiration) return null;

  const remaining = expiration - Date.now();
  return remaining > 0 ? remaining : 0;
}

/**
 * Checks if token will expire soon within the given threshold
 * @param token - JWT token string
 * @param thresholdMs - Threshold in milliseconds (default: 5 minutes)
 * @returns True if token expires soon
 */
export function isTokenExpiringSoon(token: string, thresholdMs: number = 5 * 60 * 1000): boolean {
  const remaining = getTokenTimeRemaining(token);
  if (remaining === null) return true;

  return remaining < thresholdMs;
}

/**
 * Extracts payload from JWT token without validation
 * Warning: This does not verify the token signature
 * @param token - JWT token string
 * @returns Decoded payload object or null if invalid
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
