/**
 * @fileoverview Authentication Login API Route
 *
 * Handles user authentication via email/password credentials, generates JWT tokens,
 * and logs authentication attempts for security auditing.
 *
 * @module api/auth/login
 *
 * @security
 * - Rate limiting: 5 requests per 15 minutes per IP (prevents brute force attacks)
 * - Audit logging: All login attempts are logged with IP, user agent, and outcome
 * - Password security: Handled by backend API with bcrypt hashing
 * - Token generation: JWT with configurable expiration
 *
 * @compliance
 * - HIPAA: All authentication attempts are audit logged per 164.312(b) requirements
 * - Security: Implements rate limiting per OWASP guidelines
 */

import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/apiProxy';
import { withRateLimit } from '../../middleware/withRateLimit';
import { RATE_LIMITS } from '@/lib/rateLimit';
import { auditLog, AUDIT_ACTIONS, createAuditContext } from '@/lib/audit';

/**
 * Handles user login authentication requests.
 *
 * @async
 * @param {NextRequest} request - Next.js request object containing credentials
 * @param {Object} request.body - Request body with login credentials
 * @param {string} request.body.email - User email address
 * @param {string} request.body.password - User password (plain text, encrypted in transit via HTTPS)
 *
 * @returns {Promise<NextResponse>} JSON response with authentication result
 * @returns {Object} response.data - Success response data
 * @returns {Object} response.data.user - Authenticated user object
 * @returns {string} response.data.user.id - User ID
 * @returns {string} response.data.user.email - User email
 * @returns {string} response.data.user.role - User role (admin, nurse, staff)
 * @returns {string} response.data.token - JWT authentication token
 * @returns {string} response.data.refreshToken - JWT refresh token
 * @returns {number} response.data.expiresIn - Token expiration time in seconds
 *
 * @throws {401} Unauthorized - Invalid credentials or user not found
 * @throws {429} Too Many Requests - Rate limit exceeded (5 attempts per 15 minutes)
 * @throws {500} Internal Server Error - Server error during authentication
 *
 * @example
 * // Successful login
 * POST /api/auth/login
 * Content-Type: application/json
 *
 * {
 *   "email": "nurse@school.edu",
 *   "password": "SecurePassword123!"
 * }
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
 *     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *     "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *     "expiresIn": 3600
 *   }
 * }
 *
 * @example
 * // Failed login
 * POST /api/auth/login
 *
 * {
 *   "email": "nurse@school.edu",
 *   "password": "WrongPassword"
 * }
 *
 * // Response (401 Unauthorized)
 * {
 *   "error": "Authentication failed",
 *   "message": "Invalid email or password"
 * }
 */
async function loginHandler(request: NextRequest) {
  try {
    // Proxy login request to backend API
    // Note: forwardAuth is false because this is the authentication endpoint
    const response = await proxyToBackend(request, '/api/v1/auth/login', {
      forwardAuth: false
    });

    // Parse response to extract user info for audit
    const data = await response.json();

    // Audit log
    const auditContext = createAuditContext(request);
    if (response.status === 200 && data.data?.user) {
      await auditLog({
        ...auditContext,
        userId: data.data.user.id,
        action: AUDIT_ACTIONS.LOGIN,
        resource: 'User',
        resourceId: data.data.user.id,
        success: true
      });
    } else {
      await auditLog({
        ...auditContext,
        action: AUDIT_ACTIONS.LOGIN_FAILED,
        resource: 'User',
        success: false,
        errorMessage: data.error || 'Login failed'
      });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Login error:', error);

    // Audit failed login
    const auditContext = createAuditContext(request);
    await auditLog({
      ...auditContext,
      action: AUDIT_ACTIONS.LOGIN_FAILED,
      resource: 'User',
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    });

    return NextResponse.json(
      { error: 'Login failed', message: 'An error occurred during login' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/auth/login
 *
 * Authenticates user credentials and returns JWT tokens.
 * Protected by rate limiting to prevent brute force attacks.
 *
 * @method POST
 * @access Public
 * @rateLimit 5 requests per 15 minutes per IP address
 * @auditLog All login attempts are logged with outcome
 */
export const POST = withRateLimit(RATE_LIMITS.AUTH, loginHandler);
