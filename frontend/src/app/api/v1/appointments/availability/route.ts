/**
 * @fileoverview Appointments Availability API Route
 * @module api/v1/appointments/availability
 *
 * Endpoint for checking nurse availability and suggesting time slots.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { findAvailableSlots } from '@/lib/appointments/conflicts';

// Validation schema
const availabilityQuerySchema = z.object({
  nurseId: z.string().uuid().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  duration: z.coerce.number().int().min(15).max(480).default(30),
  studentId: z.string().uuid().optional(),
});

/**
 * GET /api/v1/appointments/availability
 *
 * Check availability and get suggested time slots.
 *
 * Query Parameters:
 * - nurseId: UUID of nurse (optional, defaults to current user)
 * - date: Date in YYYY-MM-DD format
 * - duration: Duration in minutes (default: 30)
 * - studentId: UUID of student (optional, for conflict checking)
 *
 * Response:
 * {
 *   success: true,
 *   data: {
 *     date: string,
 *     slots: Array<{
 *       start: string,
 *       end: string,
 *       available: boolean
 *     }>,
 *     suggested: Array<TimeSlot>,
 *     workingHours: { start: string, end: string }
 *   }
 * }
 */
export async function GET(request: NextRequest) {
  try {
    // Authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and validate query parameters
    const searchParams = request.nextUrl.searchParams;
    const queryData = {
      nurseId: searchParams.get('nurseId') || session.user.id,
      date: searchParams.get('date'),
      duration: searchParams.get('duration'),
      studentId: searchParams.get('studentId'),
    };

    const validation = availabilityQuerySchema.safeParse(queryData);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid query parameters',
          details: validation.error.errors,
        },
        { status: 400 }
      );
    }

    const { nurseId, date, duration, studentId } = validation.data;

    // Find available slots
    const result = await findAvailableSlots({
      nurseId,
      date,
      duration,
      studentId,
    });

    return NextResponse.json({
      success: true,
      data: {
        date,
        duration,
        slots: result.slots,
        suggested: result.suggested,
        workingHours: {
          start: '08:00',
          end: '16:00',
        },
      },
    });
  } catch (error) {
    console.error('Availability API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS /api/v1/appointments/availability
 *
 * CORS preflight handler
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
