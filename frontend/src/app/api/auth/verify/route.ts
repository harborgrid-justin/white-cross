/**
 * @fileoverview Authentication Token Verification API Route
 *
 * Validates JWT access tokens and returns authenticated user information.
 * Used for token validation on page loads, session restoration, and
 * authentication state verification.
 *
 * @module api/auth/verify
 *
 * @security
 * - Validates JWT signature and expiration
 * - Returns user information if token is valid
 * - Does not create audit logs (high frequency endpoint)
 * - Safe to call frequently for auth state checks
 *
 * @compliance
 * - HIPAA: No PHI is returned, only user authentication status
 * - Security: Implements JWT validation best practices
 */

import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/apiProxy';

/**
 * GET/POST /api/auth/verify
 *
 * Verifies the validity of a JWT access token and returns user information
 * if valid. This endpoint is used for session restoration and auth checks.
 *
 * @async
 * @param {NextRequest} request - Next.js request object
 * @param {string} request.headers.authorization - Bearer token (Authorization: Bearer <token>)
 *
 * @returns {Promise<NextResponse>} JSON response with verification result
 * @returns {Object} response.data - Success response data
 * @returns {Object} response.data.user - Verified user object
 * @returns {string} response.data.user.id - User ID
 * @returns {string} response.data.user.email - User email
 * @returns {string} response.data.user.role - User role (admin, nurse, staff)
 * @returns {string} response.data.user.firstName - User first name
 * @returns {string} response.data.user.lastName - User last name
 * @returns {boolean} response.data.valid - Token validity indicator
 * @returns {number} response.data.expiresAt - Token expiration timestamp
 *
 * @throws {401} Unauthorized - Invalid, expired, or missing token
 * @throws {500} Internal Server Error - Server error during verification
 *
 * @example
 * // Successful token verification
 * GET /api/auth/verify
 * Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *
 * // Response (200 OK)
 * {
 *   "data": {
 *     "user": {
 *       "id": "uuid-123",
 *       "email": "nurse@school.edu",
 *       "role": "nurse",
 *       "firstName": "Jane",
 *       "lastName": "Doe"
 *     },
 *     "valid": true,
 *     "expiresAt": 1698765432000
 *   }
 * }
 *
 * @example
 * // Invalid or expired token
 * GET /api/auth/verify
 * Authorization: Bearer invalid-or-expired-token
 *
 * // Response (401 Unauthorized)
 * {
 *   "error": "Verification failed",
 *   "message": "Invalid or expired token"
 * }
 *
 * @method GET
 * @method POST
 * @access Public - Requires valid JWT token in Authorization header
 * @rateLimit None - High frequency endpoint for auth state checks
 */
export async function GET(request: NextRequest) {
  try {
    // Proxy verification request to backend
    const response = await proxyToBackend(request, '/api/auth/verify');

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Token verification error:', error);

    return NextResponse.json(
      { error: 'Verification failed', message: 'Invalid or expired token' },
      { status: 401 }
    );
  }
}

/**
 * POST method alias for GET /api/auth/verify
 * Supports both GET and POST for token verification flexibility
 */
export const POST = GET;
