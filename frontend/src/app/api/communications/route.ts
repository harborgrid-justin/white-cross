/**
 * @fileoverview Communications API Root Endpoint
 *
 * Provides overview and management of communication systems including messages
 * and broadcast notifications. This endpoint serves as the main entry point
 * for communication-related operations in the healthcare platform.
 *
 * @module api/communications
 * @category Communications
 * @subcategory Main Routes
 *
 * **Key Features:**
 * - Communication system status and health checks
 * - Message and broadcast statistics
 * - Communication preferences management
 * - Emergency communication protocols
 *
 * **Security:**
 * - Authentication required for all operations
 * - Role-based access control for different communication types
 * - Audit logging for all communication operations
 * - Rate limiting to prevent spam and abuse
 *
 * **HIPAA Compliance:**
 * - All communications are audit logged
 * - PHI protection in message content
 * - Secure transmission protocols
 *
 * @since 1.0.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * GET /api/communications
 *
 * Retrieves communication system overview including message counts,
 * broadcast statistics, and system health information.
 *
 * @async
 * @param {NextRequest} request - Next.js request object
 * @param {Object} context - Route context
 * @param {Object} auth - Authenticated user context
 * @param {Object} auth.user - User information from JWT
 * @param {string} auth.user.userId - User ID
 * @param {string} auth.user.role - User role (nurse, admin, etc.)
 *
 * @returns {Promise<NextResponse>} JSON response with communication overview
 * @returns {Object} response.data - Communication system data
 * @returns {Object} response.data.messages - Message statistics
 * @returns {number} response.data.messages.total - Total message count
 * @returns {number} response.data.messages.unread - Unread message count
 * @returns {number} response.data.messages.sent - Sent message count
 * @returns {Object} response.data.broadcasts - Broadcast statistics
 * @returns {number} response.data.broadcasts.active - Active broadcast count
 * @returns {number} response.data.broadcasts.scheduled - Scheduled broadcast count
 * @returns {Object} response.data.system - System status information
 * @returns {boolean} response.data.system.healthy - System health status
 * @returns {string} response.data.system.lastUpdate - Last system update timestamp
 *
 * @throws {401} Unauthorized - Authentication required
 * @throws {403} Forbidden - Insufficient permissions
 * @throws {500} Internal Server Error - Server error during retrieval
 *
 * @example
 * // Successful request
 * GET /api/communications
 * Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *
 * // Response (200 OK)
 * {
 *   "data": {
 *     "messages": {
 *       "total": 150,
 *       "unread": 5,
 *       "sent": 45
 *     },
 *     "broadcasts": {
 *       "active": 2,
 *       "scheduled": 1
 *     },
 *     "system": {
 *       "healthy": true,
 *       "lastUpdate": "2025-10-31T10:30:00Z"
 *     }
 *   }
 * }
 *
 * @method GET
 * @access Authenticated
 * @auditLog System access logged for monitoring
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend with caching
    const response = await proxyToBackend(request, '/communications', {
      cache: {
        revalidate: 30, // Cache for 30 seconds (communication data changes frequently)
        tags: ['communications', 'system-status']
      }
    });

    const data = await response.json();

    // Audit log system access
    const auditContext = createAuditContext(request, auth.user.userId);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'CommunicationsOverview',
      details: 'Communications system overview accessed'
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching communications overview:', error);

    return NextResponse.json(
      { 
        error: 'Failed to fetch communications overview',
        message: 'Unable to retrieve communication system information'
      },
      { status: 500 }
    );
  }
});

/**
 * POST /api/communications
 *
 * Creates or updates communication system configuration.
 * Requires administrative privileges.
 *
 * @async
 * @param {NextRequest} request - Next.js request object
 * @param {Object} context - Route context
 * @param {Object} auth - Authenticated user context
 *
 * @returns {Promise<NextResponse>} JSON response with operation result
 *
 * @throws {401} Unauthorized - Authentication required
 * @throws {403} Forbidden - Administrative privileges required
 * @throws {400} Bad Request - Invalid configuration data
 * @throws {500} Internal Server Error - Server error during update
 *
 * @method POST
 * @access Admin Only
 * @auditLog Configuration changes are logged
 */
export const POST = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Check if user has admin privileges
    if (!['ADMIN', 'SCHOOL_ADMIN'].includes(auth.user.role)) {
      return NextResponse.json(
        { 
          error: 'Forbidden', 
          message: 'Administrative privileges required for communication configuration' 
        },
        { status: 403 }
      );
    }

    // Proxy request to backend
    const response = await proxyToBackend(request, '/communications');

    const data = await response.json();

    if (response.status === 200 || response.status === 201) {
      // Audit log configuration change
      const auditContext = createAuditContext(request, auth.user.userId);
      await logPHIAccess({
        ...auditContext,
        action: 'UPDATE',
        resource: 'CommunicationsConfig',
        details: 'Communication system configuration updated'
      });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error updating communications configuration:', error);

    return NextResponse.json(
      { 
        error: 'Failed to update communications configuration',
        message: 'Unable to update communication system settings'
      },
      { status: 500 }
    );
  }
});