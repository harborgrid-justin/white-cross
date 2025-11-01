/**
 * @fileoverview Appointments Availability API Route
 *
 * Provides appointment scheduling availability checking and time slot suggestions
 * for healthcare staff. This endpoint helps optimize appointment scheduling by
 * identifying available time slots and preventing scheduling conflicts.
 *
 * @module api/appointments/availability
 * @category Appointments
 * @subcategory Availability
 *
 * **Key Features:**
 * - Real-time availability checking for healthcare staff
 * - Intelligent time slot suggestions based on duration
 * - Conflict detection and avoidance
 * - Working hours and break time consideration
 * - Student-specific availability when needed
 *
 * **Security:**
 * - Authentication required for all operations
 * - Role-based access to different staff schedules
 * - Input validation and sanitization
 * - Rate limiting to prevent abuse
 *
 * @since 1.0.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * GET /api/appointments/availability
 *
 * Checks staff availability and returns suggested appointment time slots
 * for a specified date and duration.
 *
 * @async
 * @param {NextRequest} request - Next.js request object with query parameters
 * @param {Object} context - Route context
 * @param {Object} auth - Authenticated user context
 *
 * @returns {Promise<NextResponse>} JSON response with availability data
 *
 * @throws {401} Unauthorized - Authentication required
 * @throws {400} Bad Request - Invalid query parameters
 * @throws {500} Internal Server Error - Server error during availability check
 *
 * @method GET
 * @access Authenticated
 * @auditLog Availability checks are logged for scheduling transparency
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend with caching
    const response = await proxyToBackend(request, '/appointments/availability', {
      cache: {
        revalidate: 60, // Cache for 1 minute (availability changes frequently)
        tags: ['appointment-availability', `staff-${auth.user.userId}`]
      }
    });

    const data = await response.json();

    // Audit log availability check
    const auditContext = createAuditContext(request, auth.user.userId);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'AppointmentAvailability',
      details: 'Staff availability checked for appointment scheduling'
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error checking appointment availability:', error);

    return NextResponse.json(
      { 
        error: 'Failed to check availability',
        message: 'Unable to retrieve appointment availability information'
      },
      { status: 500 }
    );
  }
});


