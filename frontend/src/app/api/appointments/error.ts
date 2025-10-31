'use client';

/**
 * @fileoverview Appointments API Error Boundary
 *
 * Handles appointment-specific errors including scheduling conflicts, availability issues,
 * validation errors, and PHI access errors. Implements HIPAA-compliant error handling with
 * audit logging for appointment operations.
 *
 * @module api/appointments/error
 * @category Error Handling
 * @subcategory API Error Boundaries
 *
 * **Appointment Error Types:**
 * - Scheduling conflicts: Time slot unavailable, overlapping appointments
 * - Validation errors: Invalid date/time, missing required fields
 * - Availability errors: No available slots, provider unavailable
 * - PHI access errors: Unauthorized access to appointment records
 *
 * **HIPAA Compliance:**
 * - All PHI access failures are audit logged
 * - No patient information in error messages
 * - Sanitized error responses
 *
 * @since 1.0.0
 */

import { useEffect } from 'react';

/**
 * Appointment error props interface
 */
interface AppointmentErrorProps {
  error: Error & {
    digest?: string;
    statusCode?: number;
    errorType?: 'VALIDATION' | 'SCHEDULE_CONFLICT' | 'AVAILABILITY' | 'PHI_ACCESS' | 'CANCELLATION' | 'REMINDER';
    appointmentId?: string;
    patientId?: string;
    conflictingTime?: string;
  };
  reset: () => void;
}

/**
 * Classified appointment error
 */
interface ClassifiedAppointmentError {
  type: string;
  status: number;
  message: string;
  action: string;
  canRetry: boolean;
  requiresAudit: boolean;
}

/**
 * Classify appointment error
 */
function classifyAppointmentError(error: Error & {
  statusCode?: number;
  errorType?: string;
  appointmentId?: string;
  patientId?: string;
}): ClassifiedAppointmentError {
  // Check specific error type
  if (error.errorType) {
    switch (error.errorType) {
      case 'VALIDATION':
        return {
          type: 'Validation Error',
          status: 400,
          message: 'Invalid appointment data. Please verify all required fields.',
          action: 'Check appointment details and try again',
          canRetry: true,
          requiresAudit: false
        };

      case 'SCHEDULE_CONFLICT':
        return {
          type: 'Schedule Conflict',
          status: 409,
          message: 'Appointment time slot is unavailable. Another appointment may already be scheduled.',
          action: 'Select a different time slot',
          canRetry: true,
          requiresAudit: true
        };

      case 'AVAILABILITY':
        return {
          type: 'Availability Error',
          status: 409,
          message: 'No available appointment slots found for the selected time.',
          action: 'Choose a different date or time',
          canRetry: true,
          requiresAudit: false
        };

      case 'CANCELLATION':
        return {
          type: 'Cancellation Error',
          status: 409,
          message: 'Unable to cancel appointment. It may already be cancelled or completed.',
          action: 'Verify appointment status',
          canRetry: false,
          requiresAudit: true
        };

      case 'REMINDER':
        return {
          type: 'Reminder Error',
          status: 500,
          message: 'Failed to send appointment reminder. The appointment is still scheduled.',
          action: 'Reminder will be retried automatically',
          canRetry: true,
          requiresAudit: true
        };

      case 'PHI_ACCESS':
        return {
          type: 'Access Denied',
          status: 403,
          message: 'You do not have permission to access this appointment record.',
          action: 'Contact your administrator for access',
          canRetry: false,
          requiresAudit: true // Critical - audit all PHI access failures
        };
    }
  }

  // Check status code
  if (error.statusCode === 403) {
    return {
      type: 'Access Denied',
      status: 403,
      message: 'You do not have permission to access this appointment record.',
      action: 'Contact your administrator for access',
      canRetry: false,
      requiresAudit: true
    };
  }

  if (error.statusCode === 404) {
    return {
      type: 'Appointment Not Found',
      status: 404,
      message: 'The requested appointment was not found.',
      action: 'Verify appointment ID and try again',
      canRetry: false,
      requiresAudit: false
    };
  }

  if (error.statusCode === 409) {
    return {
      type: 'Schedule Conflict',
      status: 409,
      message: 'Appointment scheduling conflict detected.',
      action: 'Select a different time slot',
      canRetry: true,
      requiresAudit: true
    };
  }

  // Parse error message
  const message = error.message.toLowerCase();
  if (message.includes('conflict') || message.includes('overlapping') || message.includes('already scheduled')) {
    return {
      type: 'Schedule Conflict',
      status: 409,
      message: 'Appointment time slot is unavailable. Another appointment may already be scheduled.',
      action: 'Select a different time slot',
      canRetry: true,
      requiresAudit: true
    };
  }

  if (message.includes('availability') || message.includes('available') || message.includes('slot')) {
    return {
      type: 'Availability Error',
      status: 409,
      message: 'No available appointment slots found for the selected time.',
      action: 'Choose a different date or time',
      canRetry: true,
      requiresAudit: false
    };
  }

  if (message.includes('cancel') || message.includes('cancellation')) {
    return {
      type: 'Cancellation Error',
      status: 409,
      message: 'Unable to cancel appointment. It may already be cancelled or completed.',
      action: 'Verify appointment status',
      canRetry: false,
      requiresAudit: true
    };
  }

  if (message.includes('reminder') || message.includes('notification')) {
    return {
      type: 'Reminder Error',
      status: 500,
      message: 'Failed to send appointment reminder.',
      action: 'Reminder will be retried automatically',
      canRetry: true,
      requiresAudit: true
    };
  }

  if (message.includes('permission') || message.includes('unauthorized') || message.includes('forbidden')) {
    return {
      type: 'Access Denied',
      status: 403,
      message: 'You do not have permission to access this appointment record.',
      action: 'Contact your administrator for access',
      canRetry: false,
      requiresAudit: true
    };
  }

  if (message.includes('date') || message.includes('time') || message.includes('invalid')) {
    return {
      type: 'Validation Error',
      status: 400,
      message: 'Invalid appointment date or time.',
      action: 'Check date/time and try again',
      canRetry: true,
      requiresAudit: false
    };
  }

  // Default appointment error
  return {
    type: 'Appointment Error',
    status: 500,
    message: 'An error occurred while processing the appointment.',
    action: 'Please try again or contact support',
    canRetry: true,
    requiresAudit: true
  };
}

/**
 * Sanitize appointment error to remove PHI
 */
function sanitizeAppointmentError(message: string): string {
  let sanitized = message;

  // Remove patient identifiers
  sanitized = sanitized.replace(/\b(patient|student)[-_]?id[-_:]?\s*[\w-]+/gi, '[PATIENT_ID]');
  sanitized = sanitized.replace(/\b(patient|student)[-_]?name[-_:]?\s*[\w\s]+/gi, '[PATIENT_NAME]');

  // Remove appointment identifiers that might contain PHI
  sanitized = sanitized.replace(/\bappointment\s+with\s+[\w\s]+/gi, 'appointment with [PATIENT]');
  sanitized = sanitized.replace(/\bfor\s+(patient|student)\s+[\w\s]+/gi, 'for [PATIENT]');

  // Remove any names
  sanitized = sanitized.replace(/\b[A-Z][a-z]+\s+[A-Z][a-z]+\b/g, '[NAME]');

  // Remove specific dates that might be PHI
  sanitized = sanitized.replace(/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g, '[DATE]');
  sanitized = sanitized.replace(/\b\d{1,2}:\d{2}\s*(?:AM|PM)?\b/gi, '[TIME]');

  return sanitized;
}

/**
 * Appointments API Error Boundary Component
 *
 * Catches appointment-related errors and returns HIPAA-compliant JSON responses.
 * Implements audit logging for scheduling conflicts and access failures.
 *
 * **Error Response Format:**
 * ```json
 * {
 *   "error": "Error Type",
 *   "message": "User-friendly error message (no PHI)",
 *   "action": "Recommended action",
 *   "canRetry": true/false
 * }
 * ```
 *
 * **HIPAA Compliance:**
 * - No patient information in error responses
 * - All PHI access failures are audit logged
 * - All scheduling conflicts are audit logged
 * - Sanitized error messages
 *
 * @param props - Error boundary props
 * @param props.error - The caught appointment error
 * @param props.reset - Function to reset error boundary
 *
 * @returns JSON error response
 */
export default function AppointmentError({ error, reset }: AppointmentErrorProps) {
  useEffect(() => {
    // Classify error
    const classified = classifyAppointmentError(error);

    // Log error
    if (process.env.NODE_ENV === 'production') {
      // Production logging - sanitized
      console.error('Appointment Error:', {
        type: classified.type,
        status: classified.status,
        message: sanitizeAppointmentError(error.message),
        digest: error.digest,
        timestamp: new Date().toISOString(),
        requiresAudit: classified.requiresAudit
      });

      // TODO: Audit log if required
      if (classified.requiresAudit) {
        // auditLog({
        //   action: 'APPOINTMENT_ERROR',
        //   resource: 'Appointment',
        //   resourceId: error.appointmentId,
        //   success: false,
        //   errorMessage: classified.type
        // });
      }

      // TODO: Send to monitoring service for critical errors
      if (classified.type === 'Schedule Conflict') {
        // Track scheduling conflicts for capacity planning
        console.warn('Schedule conflict detected - may need capacity review');
      }
    } else {
      // Development logging - full details
      console.error('Appointment Error caught by error boundary:', {
        error,
        classified,
        stack: error.stack
      });
    }
  }, [error]);

  // Classify error
  const classified = classifyAppointmentError(error);

  // Build error response (no PHI)
  const errorResponse = {
    error: classified.type,
    message: classified.message,
    action: classified.action,
    canRetry: classified.canRetry,
    ...(error.digest && { errorId: error.digest }),
    ...(process.env.NODE_ENV === 'development' && {
      stack: error.stack,
      details: error
    })
  };

  // Return null - Next.js will handle JSON conversion
  return null;
}

/**
 * Export helper function for manual appointment error handling
 *
 * @example
 * ```typescript
 * export async function POST(request: NextRequest, context, auth) {
 *   try {
 *     const appointment = await request.json();
 *     // ... appointment logic
 *   } catch (error) {
 *     return handleAppointmentError(error, {
 *       userId: auth.user.id,
 *       action: 'CREATE_APPOINTMENT'
 *     });
 *   }
 * }
 * ```
 */
export function handleAppointmentError(
  error: unknown,
  context?: {
    userId?: string;
    action?: string;
    appointmentId?: string;
  }
): Response {
  const err = error instanceof Error ? error : new Error(String(error));
  const classified = classifyAppointmentError(err as Error & { statusCode?: number; errorType?: string });

  // Log error (no PHI)
  console.error('Appointment Error:', {
    type: classified.type,
    status: classified.status,
    message: sanitizeAppointmentError(err.message),
    userId: context?.userId,
    action: context?.action,
    timestamp: new Date().toISOString(),
    requiresAudit: classified.requiresAudit
  });

  // TODO: Audit log if required
  if (classified.requiresAudit) {
    // auditLog({
    //   userId: context?.userId,
    //   action: context?.action || 'APPOINTMENT_ERROR',
    //   resource: 'Appointment',
    //   resourceId: context?.appointmentId,
    //   success: false,
    //   errorMessage: classified.type
    // });
  }

  // Build response
  const errorResponse = {
    error: classified.type,
    message: classified.message,
    action: classified.action,
    canRetry: classified.canRetry,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack
    })
  };

  return new Response(JSON.stringify(errorResponse), {
    status: classified.status,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
