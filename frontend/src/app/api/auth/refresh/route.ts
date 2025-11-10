/**
 * @fileoverview Authentication Token Refresh API Route
 *
 * Handles JWT token refresh requests using refresh tokens to generate new
 * access tokens without requiring re-authentication. Implements token rotation
 * for enhanced security.
 *
 * @module api/auth/refresh
 *
 * @security
 * - Requires valid refresh token in request body
 * - Generates new access token with limited lifespan
 * - Audit logs all token refresh attempts
 * - Invalid refresh tokens result in 401 Unauthorized
 *
 * @compliance
 * - HIPAA: Token refresh events are audit logged per 164.312(b) requirements
 * - Security: Implements JWT refresh token best practices
 */

import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/apiProxy';
import { auditLog, AUDIT_ACTIONS, createAuditContext } from '@/lib/audit';

/**
 * POST /api/auth/refresh
 *
 * Refreshes an expired or expiring access token using a valid refresh token.
 * Returns a new access token and optionally a new refresh token.
 *
 * @async
 * @param {NextRequest} request - Next.js request object
 * @param {Object} request.body - Request body with refresh token
 * @param {string} request.body.refreshToken - Valid JWT refresh token
 *
 * @returns {Promise<NextResponse>} JSON response with new tokens
 * @returns {Object} response.data - Success response data
 * @returns {Object} response.data.user - User object
 * @returns {string} response.data.user.id - User ID
 * @returns {string} response.data.user.email - User email
 * @returns {string} response.data.user.role - User role
 * @returns {string} response.data.token - New JWT access token
 * @returns {string} response.data.refreshToken - New JWT refresh token (optional)
 * @returns {number} response.data.expiresIn - Token expiration time in seconds
 *
 * @throws {401} Unauthorized - Invalid, expired, or missing refresh token
 * @throws {500} Internal Server Error - Server error during token refresh
 *
 * @example
 * // Successful token refresh
 * POST /api/auth/refresh
 * Content-Type: application/json
 *
 * {
 *   "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * }
 *
 * // Response (200 OK)
 * {
 *   "data": {
 *     "user": {
 *       "id": "uuid-123",
 *       "email": "nurse@school.edu",
 *       "role": "nurse"
 *     },
 *     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *     "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *     "expiresIn": 3600
 *   }
 * }
 *
 * @example
 * // Invalid or expired refresh token
 * POST /api/auth/refresh
 *
 * {
 *   "refreshToken": "invalid-or-expired-token"
 * }
 *
 * // Response (401 Unauthorized)
 * {
 *   "error": "Refresh failed",
 *   "message": "Invalid or expired refresh token"
 * }
 *
 * @method POST
 * @access Public - Requires valid refresh token
 * @auditLog Successful token refreshes are logged
 */
export async function POST(request: NextRequest) {
  try {
    // Proxy refresh request to backend
    const response = await proxyToBackend(request, '/api/auth/refresh');

    const data = await response.json();

    // Audit log
    const auditContext = createAuditContext(request);
    if (response.status === 200 && data.data?.user) {
      await auditLog({
        ...auditContext,
        userId: data.data.user.id,
        action: AUDIT_ACTIONS.TOKEN_REFRESH,
        resource: 'User',
        resourceId: data.data.user.id,
        success: true
      });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Token refresh error:', error);

    return NextResponse.json(
      { error: 'Refresh failed', message: 'Invalid or expired refresh token' },
      { status: 401 }
    );
  }
}
