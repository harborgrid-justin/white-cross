/**
 * @fileoverview Appointments Reminders API Route
 * @module api/v1/appointments/reminders
 *
 * Endpoint for managing appointment reminders.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { sendImmediateReminder, getReminderHistory } from '@/lib/appointments/reminders';

// Validation schemas
const sendReminderSchema = z.object({
  appointmentId: z.string().uuid(),
  method: z.enum(['email', 'sms', 'both']).optional().default('email'),
  customMessage: z.string().optional(),
});

const reminderHistorySchema = z.object({
  appointmentId: z.string().uuid(),
});

/**
 * POST /api/v1/appointments/reminders
 *
 * Send an immediate reminder for an appointment.
 *
 * Request Body:
 * {
 *   appointmentId: string,
 *   method?: 'email' | 'sms' | 'both',
 *   customMessage?: string
 * }
 *
 * Response:
 * {
 *   success: true,
 *   data: {
 *     sent: boolean,
 *     method: string,
 *     timestamp: string
 *   }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = sendReminderSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request body',
          details: validation.error.errors,
        },
        { status: 400 }
      );
    }

    const { appointmentId, method, customMessage } = validation.data;

    // Send immediate reminder
    const result = await sendImmediateReminder({
      appointmentId,
      method,
      customMessage,
      userId: session.user.id,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to send reminder',
          message: result.error,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        sent: true,
        method,
        timestamp: new Date().toISOString(),
        reminderId: result.reminderId,
      },
    });
  } catch (error) {
    console.error('Send reminder API error:', error);
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
 * GET /api/v1/appointments/reminders
 *
 * Get reminder history for an appointment.
 *
 * Query Parameters:
 * - appointmentId: UUID of appointment
 *
 * Response:
 * {
 *   success: true,
 *   data: {
 *     reminders: Array<{
 *       id: string,
 *       type: string,
 *       scheduledFor: string,
 *       sentAt?: string,
 *       status: string,
 *       method: string
 *     }>
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
      appointmentId: searchParams.get('appointmentId'),
    };

    const validation = reminderHistorySchema.safeParse(queryData);
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

    const { appointmentId } = validation.data;

    // Get reminder history
    const history = await getReminderHistory({ appointmentId });

    return NextResponse.json({
      success: true,
      data: {
        appointmentId,
        reminders: history,
      },
    });
  } catch (error) {
    console.error('Get reminder history API error:', error);
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
 * OPTIONS /api/v1/appointments/reminders
 *
 * CORS preflight handler
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
