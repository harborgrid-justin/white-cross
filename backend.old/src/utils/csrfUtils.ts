/**
 * @fileoverview CSRF Protection Utilities
 * @module utils/csrfUtils
 * @description Provides CSRF (Cross-Site Request Forgery) token generation
 * and validation utilities. Protects state-changing operations from CSRF attacks.
 *
 * SECURITY: CSRF attack prevention
 * SECURITY: Token-based request validation
 * SECURITY: Session-based token management
 *
 * @security CSRF protection
 * @security Token validation
 */

import { randomBytes } from 'crypto';
import { ValidationError } from '../errors/ServiceError';

/**
 * CSRF token configuration
 */
const CSRF_CONFIG = {
  TOKEN_LENGTH: 32, // bytes
  TOKEN_LIFETIME_MS: 60 * 60 * 1000, // 1 hour
  HEADER_NAME: 'X-CSRF-Token',
  COOKIE_NAME: 'csrf-token',
  FORM_FIELD_NAME: '_csrf'
};

/**
 * CSRF token store (in-memory)
 * TODO: In production, store in Redis for distributed systems
 * Key: token, Value: { userId, createdAt, sessionId }
 */
interface CSRFTokenData {
  userId: string;
  sessionId: string;
  createdAt: Date;
}

const csrfTokenStore = new Map<string, CSRFTokenData>();

/**
 * Generate a cryptographically secure CSRF token
 *
 * @param userId - User ID
 * @param sessionId - Session ID
 * @returns CSRF token string
 *
 * @example
 * const token = generateCSRFToken('user123', 'session456');
 */
export function generateCSRFToken(userId: string, sessionId: string): string {
  // Generate cryptographically secure random token
  const token = randomBytes(CSRF_CONFIG.TOKEN_LENGTH).toString('hex');

  // Store token with metadata
  csrfTokenStore.set(token, {
    userId,
    sessionId,
    createdAt: new Date()
  });

  return token;
}

/**
 * Validate CSRF token
 *
 * @param token - CSRF token to validate
 * @param userId - Expected user ID
 * @param sessionId - Expected session ID
 * @returns True if token is valid
 *
 * @throws {ValidationError} If token is invalid, expired, or doesn't match user/session
 *
 * @example
 * validateCSRFToken(token, 'user123', 'session456');
 */
export function validateCSRFToken(
  token: string,
  userId: string,
  sessionId: string
): boolean {
  // Check if token exists
  const tokenData = csrfTokenStore.get(token);
  if (!tokenData) {
    throw new ValidationError('Invalid CSRF token');
  }

  // Check if token expired
  const now = new Date();
  const tokenAge = now.getTime() - tokenData.createdAt.getTime();
  if (tokenAge > CSRF_CONFIG.TOKEN_LIFETIME_MS) {
    csrfTokenStore.delete(token);
    throw new ValidationError('CSRF token expired');
  }

  // Check if token matches user
  if (tokenData.userId !== userId) {
    throw new ValidationError('CSRF token does not match user');
  }

  // Check if token matches session
  if (tokenData.sessionId !== sessionId) {
    throw new ValidationError('CSRF token does not match session');
  }

  return true;
}

/**
 * Revoke CSRF token (e.g., on logout)
 *
 * @param token - CSRF token to revoke
 *
 * @example
 * revokeCSRFToken(token);
 */
export function revokeCSRFToken(token: string): void {
  csrfTokenStore.delete(token);
}

/**
 * Revoke all CSRF tokens for a user (e.g., on logout or password change)
 *
 * @param userId - User ID
 *
 * @example
 * revokeUserCSRFTokens('user123');
 */
export function revokeUserCSRFTokens(userId: string): void {
  for (const [token, data] of csrfTokenStore.entries()) {
    if (data.userId === userId) {
      csrfTokenStore.delete(token);
    }
  }
}

/**
 * Revoke all CSRF tokens for a session (e.g., on session timeout)
 *
 * @param sessionId - Session ID
 *
 * @example
 * revokeSessionCSRFTokens('session456');
 */
export function revokeSessionCSRFTokens(sessionId: string): void {
  for (const [token, data] of csrfTokenStore.entries()) {
    if (data.sessionId === sessionId) {
      csrfTokenStore.delete(token);
    }
  }
}

/**
 * Clean up expired CSRF tokens
 * Should be called periodically to prevent memory leaks
 *
 * @example
 * setInterval(cleanupExpiredCSRFTokens, 60 * 60 * 1000); // Every hour
 */
export function cleanupExpiredCSRFTokens(): void {
  const now = new Date();
  let expiredCount = 0;

  for (const [token, data] of csrfTokenStore.entries()) {
    const tokenAge = now.getTime() - data.createdAt.getTime();
    if (tokenAge > CSRF_CONFIG.TOKEN_LIFETIME_MS) {
      csrfTokenStore.delete(token);
      expiredCount++;
    }
  }

  if (expiredCount > 0) {
    console.log(`[CSRF] Cleaned up ${expiredCount} expired tokens`);
  }
}

/**
 * Get CSRF token from request
 * Checks header, body, and query parameters
 *
 * @param req - Express request object
 * @returns CSRF token or null if not found
 *
 * @example
 * const token = getCSRFTokenFromRequest(req);
 */
export function getCSRFTokenFromRequest(req: any): string | null {
  // Check header
  const headerToken = req.headers[CSRF_CONFIG.HEADER_NAME.toLowerCase()];
  if (headerToken) {
    return headerToken as string;
  }

  // Check body
  const bodyToken = req.body?.[CSRF_CONFIG.FORM_FIELD_NAME];
  if (bodyToken) {
    return bodyToken as string;
  }

  // Check query
  const queryToken = req.query?.[CSRF_CONFIG.FORM_FIELD_NAME];
  if (queryToken) {
    return queryToken as string;
  }

  return null;
}

/**
 * Get CSRF configuration (for documentation and frontend usage)
 *
 * @returns CSRF configuration object
 *
 * @example
 * const config = getCSRFConfig();
 * // Frontend: Add X-CSRF-Token header to requests
 */
export function getCSRFConfig(): {
  headerName: string;
  cookieName: string;
  formFieldName: string;
  tokenLifetimeMs: number;
} {
  return {
    headerName: CSRF_CONFIG.HEADER_NAME,
    cookieName: CSRF_CONFIG.COOKIE_NAME,
    formFieldName: CSRF_CONFIG.FORM_FIELD_NAME,
    tokenLifetimeMs: CSRF_CONFIG.TOKEN_LIFETIME_MS
  };
}

/**
 * Get CSRF token statistics (for monitoring)
 *
 * @returns Statistics about CSRF tokens
 *
 * @example
 * const stats = getCSRFTokenStats();
 */
export function getCSRFTokenStats(): {
  totalTokens: number;
  expiredTokens: number;
} {
  const now = new Date();
  let expiredCount = 0;

  for (const [, data] of csrfTokenStore.entries()) {
    const tokenAge = now.getTime() - data.createdAt.getTime();
    if (tokenAge > CSRF_CONFIG.TOKEN_LIFETIME_MS) {
      expiredCount++;
    }
  }

  return {
    totalTokens: csrfTokenStore.size,
    expiredTokens: expiredCount
  };
}

/**
 * Clear all CSRF tokens (for testing only)
 * @private
 */
export function clearCSRFTokens(): void {
  csrfTokenStore.clear();
  console.warn('[CSRF] All tokens cleared - should only happen in testing');
}

/**
 * Export CSRF utilities and configuration
 */
export default {
  generateCSRFToken,
  validateCSRFToken,
  revokeCSRFToken,
  revokeUserCSRFTokens,
  revokeSessionCSRFTokens,
  cleanupExpiredCSRFTokens,
  getCSRFTokenFromRequest,
  getCSRFConfig,
  getCSRFTokenStats,
  clearCSRFTokens,
  CSRF_CONFIG
};
