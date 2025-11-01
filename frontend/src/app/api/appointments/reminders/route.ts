/**
 * @fileoverview Appointments Reminders API Route
 *
 * Manages appointment reminder functionality including automated and manual
 * reminder sending, reminder history tracking, and notification preferences.
 * This endpoint supports multiple communication channels for healthcare
 * appointment notifications.
 *
 * @module api/appointments/reminders
 * @category Appointments
 * @subcategory Reminders
 *
 * **Key Features:**
 * - Manual and automated reminder sending
 * - Multi-channel communication (email, SMS, push notifications)
 * - Reminder history and tracking
 * - Customizable reminder messages
 * - Reminder scheduling and timing preferences
 *
 * **Security:**
 * - Authentication required for all operations
 * - Role-based access to reminder management
 * - PHI protection in reminder content
 * - Audit logging for all reminder operations
 *
 * @since 1.0.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * GET /api/appointments/reminders
 *
 * Retrieves reminder history and settings for appointments.
 * Shows sent reminders, scheduled reminders, and reminder preferences.
 *
 * @async
 * @param {NextRequest} request - Next.js request object with query parameters
 * @param {Object} context - Route context
 * @param {Object} auth - Authenticated user context
 *
 * @returns {Promise<NextResponse>} JSON response with reminder data
 *
 * @throws {401} Unauthorized - Authentication required
 * @throws {400} Bad Request - Invalid query parameters
 * @throws {500} Internal Server Error - Server error during retrieval
 *
 * @method GET
 * @access Authenticated
 * @auditLog Reminder history access is logged
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend with caching
    const response = await proxyToBackend(request, '/appointments/reminders', {
      cache: {
        revalidate: 120, // Cache for 2 minutes (reminder data changes less frequently)
        tags: ['appointment-reminders', `staff-${auth.user.userId}`]
      }
    });

    const data = await response.json();

    // Audit log reminder history access
    const auditContext = createAuditContext(request, auth.user.userId);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'AppointmentReminders',
      details: 'Appointment reminder history accessed'
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching appointment reminders:', error);

    return NextResponse.json(
      { 
        error: 'Failed to fetch appointment reminders',
        message: 'Unable to retrieve reminder information'
      },
      { status: 500 }
    );
  }
});

/**
 * POST /api/appointments/reminders
 *
 * Sends immediate appointment reminders or schedules future reminders.
 * Supports multiple communication channels and custom messaging.
 *
 * @async
 * @param {NextRequest} request - Next.js request object with reminder data
 * @param {Object} context - Route context
 * @param {Object} auth - Authenticated user context
 *
 * @returns {Promise<NextResponse>} JSON response with reminder sending results
 *
 * @throws {401} Unauthorized - Authentication required
 * @throws {403} Forbidden - Insufficient permissions for reminder sending
 * @throws {400} Bad Request - Invalid reminder data
 * @throws {500} Internal Server Error - Server error during reminder sending
 *
 * @method POST
 * @access Authenticated (NURSE or higher for manual reminders)
 * @auditLog All reminder sending is logged
 */
export const POST = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Check permissions for manual reminder sending
    const allowedRoles = ['ADMIN', 'SCHOOL_ADMIN', 'NURSE'];
    if (!allowedRoles.includes(auth.user.role)) {
      return NextResponse.json(
        { 
          error: 'Forbidden', 
          message: 'Insufficient permissions for manual reminder sending' 
        },
        { status: 403 }
      );
    }

    // Proxy request to backend
    const response = await proxyToBackend(request, '/appointments/reminders');

    const data = await response.json();

    if (response.status === 200 || response.status === 201) {
      // Audit log reminder sending
      const auditContext = createAuditContext(request, auth.user.userId);
      await logPHIAccess({
        ...auditContext,
        action: 'CREATE',
        resource: 'AppointmentReminder',
        resourceId: data.data?.reminderId,
        details: `Appointment reminder sent via ${data.data?.method || 'unknown'} method`
      });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error sending appointment reminder:', error);

    return NextResponse.json(
      { 
        error: 'Failed to send appointment reminder',
        message: 'Unable to send reminder notification'
      },
      { status: 500 }
    );
  }
});
