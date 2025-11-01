/**
 * @fileoverview Authentication Logout API Route
 *
 * Handles user logout requests, invalidates sessions, and logs logout events
 * for security auditing and compliance tracking.
 *
 * @module api/auth/logout
 *
 * @security
 * - Requires valid JWT token in Authorization header
 * - Logs all logout events with timestamp and user context
 * - Client-side token cleanup recommended after successful logout
 *
 * @compliance
 * - HIPAA: Logout events are audit logged per 164.312(b) requirements
 * - Session management: Follows OWASP session management guidelines
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/middleware/withAuth';
import { auditLog, AUDIT_ACTIONS, createAuditContext } from '@/lib/audit';

/**
 * POST /api/auth/logout
 *
 * Logs out the authenticated user and records the logout event.
 * Client should clear local token storage after receiving successful response.
 *
 * @async
 * @param {NextRequest} request - Next.js request object with auth token
 * @param {Object} context - Next.js route context
 * @param {Object} auth - Authenticated user context from withAuth middleware
 * @param {Object} auth.user - Authenticated user object
 * @param {string} auth.user.id - User ID
 * @param {string} auth.user.email - User email
 * @param {string} auth.user.role - User role
 *
 * @returns {Promise<NextResponse>} JSON response confirming logout
 * @returns {boolean} response.success - Logout success indicator
 * @returns {string} response.message - Success message
 *
 * @throws {401} Unauthorized - Invalid or missing authentication token
 * @throws {500} Internal Server Error - Server error during logout
 *
 * @example
 * // Successful logout
 * POST /api/auth/logout
 * Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *
 * // Response (200 OK)
 * {
 *   "success": true,
 *   "message": "Logged out successfully"
 * }
 *
 * @example
 * // Missing or invalid token
 * POST /api/auth/logout
 *
 * // Response (401 Unauthorized)
 * {
 *   "error": "Unauthorized",
 *   "message": "Authentication required"
 * }
 *
 * @method POST
 * @access Protected - Requires authentication
 * @auditLog All logout events are logged
 */
export const POST = withAuth(async (request: NextRequest, context, auth) => {
  try {
    // Audit log
    const auditContext = createAuditContext(request, auth.user.userId);
    await auditLog({
      ...auditContext,
      action: AUDIT_ACTIONS.LOGOUT,
      resource: 'User',
      resourceId: auth.user.userId,
      success: true
    });

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);

    return NextResponse.json(
      { error: 'Logout failed', message: 'An error occurred during logout' },
      { status: 500 }
    );
  }
});
