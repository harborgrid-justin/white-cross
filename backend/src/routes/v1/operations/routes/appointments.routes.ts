/**
 * Appointments Routes
 * HTTP endpoints for appointment scheduling, management, and calendar operations
 * All routes prefixed with /api/v1/appointments
 */

import { ServerRoute } from '@hapi/hapi';
import { asyncHandler } from '../../../shared/utils';
import { AppointmentsController } from '../controllers/appointments.controller';
import {
  listAppointmentsQuerySchema,
  createAppointmentSchema,
  updateAppointmentSchema,
  cancelAppointmentSchema,
  completeAppointmentSchema,
  appointmentIdParamSchema,
  nurseIdParamSchema,
  availableSlotsQuerySchema,
  upcomingAppointmentsQuerySchema,
  statisticsQuerySchema,
  createRecurringAppointmentsSchema,
  addToWaitlistSchema,
  waitlistQuerySchema,
  removeFromWaitlistSchema,
  waitlistIdParamSchema,
  calendarExportQuerySchema
} from '../validators/appointments.validators';

/**
 * APPOINTMENT CRUD ROUTES
 */

const listAppointmentsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/appointments',
  handler: asyncHandler(AppointmentsController.list),
  options: {
    auth: 'jwt',
    tags: ['api', 'Appointments', 'Operations', 'v1'],
    description: 'Get all appointments with pagination and filters',
    notes: '**PHI Protected Endpoint** - Returns paginated list of appointments with comprehensive filtering options (nurse, student, status, type, date range). Includes appointment details, participant information, and status. Used for dashboards, reports, and scheduling views.',
    validate: {
      query: listAppointmentsQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Appointments retrieved successfully with pagination' },
          '401': { description: 'Unauthorized' },
          '500': { description: 'Internal server error' }
        }
      }
    }
  }
};

const getAppointmentRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/appointments/{id}',
  handler: asyncHandler(AppointmentsController.getById),
  options: {
    auth: 'jwt',
    tags: ['api', 'Appointments', 'Operations', 'v1'],
    description: 'Get appointment by ID',
    notes: '**PHI Protected Endpoint** - Returns detailed appointment information including student details, nurse assignment, scheduling information, status history, and any associated notes. Access is logged for compliance.',
    validate: {
      params: appointmentIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Appointment retrieved successfully' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Appointment not found' }
        }
      }
    }
  }
};

const createAppointmentRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/appointments',
  handler: asyncHandler(AppointmentsController.create),
  options: {
    auth: 'jwt',
    tags: ['api', 'Appointments', 'Operations', 'v1'],
    description: 'Create new appointment',
    notes: '**PHI Protected Endpoint** - Schedules a new appointment. Validates: (1) Time slot availability - checks for conflicts with existing appointments, (2) Business hours - ensures appointment is within nurse working hours, (3) Duration - validates 15-120 minute range, (4) Future date - start time must be in future. Automatically schedules reminders and creates audit trail.',
    validate: {
      payload: createAppointmentSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': { description: 'Appointment created successfully' },
          '400': { description: 'Validation error - Invalid appointment data or time slot conflict' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Student or nurse not found' },
          '409': { description: 'Conflict - Time slot not available' }
        }
      }
    }
  }
};

const updateAppointmentRoute: ServerRoute = {
  method: 'PUT',
  path: '/api/v1/appointments/{id}',
  handler: asyncHandler(AppointmentsController.update),
  options: {
    auth: 'jwt',
    tags: ['api', 'Appointments', 'Operations', 'v1'],
    description: 'Update appointment',
    notes: '**PHI Protected Endpoint** - Updates appointment details including time, duration, type, priority, or notes. Validates time slot availability if rescheduling. Status transitions (cancel, complete, no-show) use dedicated endpoints. Updates automatically reschedule reminders. All changes logged for audit trail.',
    validate: {
      params: appointmentIdParamSchema,
      payload: updateAppointmentSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Appointment updated successfully' },
          '400': { description: 'Validation error - Invalid update data or time conflict' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Appointment not found' },
          '409': { description: 'Conflict - New time slot not available' }
        }
      }
    }
  }
};

const cancelAppointmentRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/appointments/{id}/cancel',
  handler: asyncHandler(AppointmentsController.cancel),
  options: {
    auth: 'jwt',
    tags: ['api', 'Appointments', 'Operations', 'v1'],
    description: 'Cancel appointment',
    notes: '**PHI Protected Endpoint** - Cancels an appointment with required reason (5-500 characters). Updates status to CANCELLED, cancels scheduled reminders, and optionally triggers waitlist processing to fill the slot. Cancellation is permanent but logged for audit trail. Notification sent to student emergency contacts.',
    validate: {
      params: appointmentIdParamSchema,
      payload: cancelAppointmentSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Appointment cancelled successfully' },
          '400': { description: 'Validation error - Reason required or invalid' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Appointment not found' },
          '409': { description: 'Conflict - Appointment already completed or cannot be cancelled' }
        }
      }
    }
  }
};

const markNoShowRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/appointments/{id}/no-show',
  handler: asyncHandler(AppointmentsController.markNoShow),
  options: {
    auth: 'jwt',
    tags: ['api', 'Appointments', 'Operations', 'v1'],
    description: 'Mark appointment as no-show',
    notes: '**PHI Protected Endpoint** - Marks appointment as NO_SHOW when student fails to attend. Updates statistics for no-show tracking and reporting. Used for compliance reporting and identifying students who may need additional outreach. Triggers follow-up workflows if configured.',
    validate: {
      params: appointmentIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Appointment marked as no-show successfully' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Appointment not found' },
          '409': { description: 'Conflict - Appointment status does not allow no-show marking' }
        }
      }
    }
  }
};

const startAppointmentRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/appointments/{id}/start',
  handler: asyncHandler(AppointmentsController.start),
  options: {
    auth: 'jwt',
    tags: ['api', 'Appointments', 'Operations', 'v1'],
    description: 'Start appointment (transition to IN_PROGRESS)',
    notes: '**PHI Protected Endpoint** - Transitions appointment from SCHEDULED to IN_PROGRESS status when student arrives and appointment begins. Validates appointment is scheduled for current time (within 15 minutes). Used to track actual appointment flow and calculate time metrics.',
    validate: {
      params: appointmentIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Appointment started successfully' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Appointment not found' },
          '409': { description: 'Conflict - Appointment cannot be started (wrong status or time)' }
        }
      }
    }
  }
};

const completeAppointmentRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/appointments/{id}/complete',
  handler: asyncHandler(AppointmentsController.complete),
  options: {
    auth: 'jwt',
    tags: ['api', 'Appointments', 'Operations', 'v1'],
    description: 'Complete appointment',
    notes: '**HIGHLY SENSITIVE PHI ENDPOINT** - Marks appointment as COMPLETED with optional completion notes, outcomes, and follow-up requirements. Completion notes may contain detailed health information. If follow-up required, can specify suggested date. Updates appointment statistics and closes the appointment workflow. All completion data logged for medical records.',
    validate: {
      params: appointmentIdParamSchema,
      payload: completeAppointmentSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Appointment completed successfully' },
          '400': { description: 'Validation error - Invalid completion data' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Appointment not found' },
          '409': { description: 'Conflict - Appointment cannot be completed (wrong status)' }
        }
      }
    }
  }
};

/**
 * AVAILABILITY & SCHEDULING ROUTES
 */

const getAvailableSlotsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/appointments/nurse/{nurseId}/available-slots',
  handler: asyncHandler(AppointmentsController.getAvailableSlots),
  options: {
    auth: 'jwt',
    tags: ['api', 'Appointments', 'Operations', 'Scheduling', 'v1'],
    description: 'Get available time slots for a nurse',
    notes: 'Returns available appointment slots for a nurse on a specified date. Calculates slots based on: (1) Nurse working hours/availability, (2) Existing appointments, (3) Buffer time between appointments (configurable), (4) Minimum/maximum slot duration. Used for appointment scheduling interfaces to show available times.',
    validate: {
      params: nurseIdParamSchema,
      query: availableSlotsQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Available slots retrieved successfully' },
          '400': { description: 'Validation error - Invalid date or parameters' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Nurse not found' }
        }
      }
    }
  }
};

const getUpcomingAppointmentsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/appointments/nurse/{nurseId}/upcoming',
  handler: asyncHandler(AppointmentsController.getUpcoming),
  options: {
    auth: 'jwt',
    tags: ['api', 'Appointments', 'Operations', 'v1'],
    description: 'Get upcoming appointments for a nurse',
    notes: '**PHI Protected Endpoint** - Returns upcoming appointments for a specific nurse, ordered by start time. Limited to future appointments only. Used for nurse dashboard "Today\'s Schedule" and "Upcoming Appointments" widgets. Includes student information for quick reference.',
    validate: {
      params: nurseIdParamSchema,
      query: upcomingAppointmentsQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Upcoming appointments retrieved successfully' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Nurse not found' }
        }
      }
    }
  }
};

/**
 * ANALYTICS & REPORTING ROUTES
 */

const getStatisticsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/appointments/statistics',
  handler: asyncHandler(AppointmentsController.getStatistics),
  options: {
    auth: 'jwt',
    tags: ['api', 'Appointments', 'Operations', 'Analytics', 'v1'],
    description: 'Get appointment statistics',
    notes: 'Returns aggregate appointment statistics including: Total appointments, breakdown by status (scheduled, completed, cancelled, no-show), average duration, utilization rate, no-show rate, and peak times. Optionally filtered by nurse and date range. Used for dashboards, reports, and performance analysis. No PHI in aggregated data.',
    validate: {
      query: statisticsQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Statistics retrieved successfully' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Admin or nurse role required' }
        }
      }
    }
  }
};

/**
 * RECURRING APPOINTMENTS ROUTES
 */

const createRecurringRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/appointments/recurring',
  handler: asyncHandler(AppointmentsController.createRecurring),
  options: {
    auth: 'jwt',
    tags: ['api', 'Appointments', 'Operations', 'Recurring', 'v1'],
    description: 'Create recurring appointments',
    notes: '**PHI Protected Endpoint** - Creates multiple appointments based on a recurrence pattern (DAILY, WEEKLY, MONTHLY). Supports configurable intervals, specific days of week, and maximum occurrences or end date. Each occurrence is validated for availability. Used for regular medication administration, ongoing therapy, or scheduled check-ups. Returns array of created appointments.',
    validate: {
      payload: createRecurringAppointmentsSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': { description: 'Recurring appointments created successfully' },
          '400': { description: 'Validation error - Invalid pattern or conflicts detected' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Student or nurse not found' },
          '409': { description: 'Conflict - Some time slots unavailable' }
        }
      }
    }
  }
};

/**
 * WAITLIST ROUTES
 */

const addToWaitlistRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/appointments/waitlist',
  handler: asyncHandler(AppointmentsController.addToWaitlist),
  options: {
    auth: 'jwt',
    tags: ['api', 'Appointments', 'Operations', 'Waitlist', 'v1'],
    description: 'Add student to appointment waitlist',
    notes: '**PHI Protected Endpoint** - Adds student to waitlist when desired appointment slots are unavailable. Supports priority levels (LOW, MEDIUM, HIGH, URGENT), preferred nurse, and preferred dates. When appointments are cancelled, waitlist is automatically processed to fill slots. Used for managing appointment demand and reducing wait times.',
    validate: {
      payload: addToWaitlistSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': { description: 'Student added to waitlist successfully' },
          '400': { description: 'Validation error - Invalid waitlist data' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Student not found' },
          '409': { description: 'Conflict - Student already on waitlist for this type' }
        }
      }
    }
  }
};

const getWaitlistRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/appointments/waitlist',
  handler: asyncHandler(AppointmentsController.getWaitlist),
  options: {
    auth: 'jwt',
    tags: ['api', 'Appointments', 'Operations', 'Waitlist', 'v1'],
    description: 'Get appointment waitlist entries',
    notes: '**PHI Protected Endpoint** - Returns waitlist entries with optional filtering by nurse, status (PENDING, CONTACTED, SCHEDULED, CANCELLED), and priority. Ordered by priority and creation date. Used for waitlist management dashboard and appointment slot optimization.',
    validate: {
      query: waitlistQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Waitlist entries retrieved successfully' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Nurse or admin role required' }
        }
      }
    }
  }
};

const removeFromWaitlistRoute: ServerRoute = {
  method: 'DELETE',
  path: '/api/v1/appointments/waitlist/{id}',
  handler: asyncHandler(AppointmentsController.removeFromWaitlist),
  options: {
    auth: 'jwt',
    tags: ['api', 'Appointments', 'Operations', 'Waitlist', 'v1'],
    description: 'Remove student from waitlist',
    notes: '**PHI Protected Endpoint** - Removes student from waitlist with optional reason (e.g., "Appointment scheduled", "No longer needed", "Student transferred"). Updates waitlist status to CANCELLED. All removals are logged for compliance and quality tracking.',
    validate: {
      params: waitlistIdParamSchema,
      payload: removeFromWaitlistSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '204': { description: 'Student removed from waitlist successfully (no content)' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Waitlist entry not found' }
        }
      }
    }
  }
};

/**
 * CALENDAR & INTEGRATION ROUTES
 */

const generateCalendarRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/appointments/nurse/{nurseId}/calendar',
  handler: asyncHandler(AppointmentsController.generateCalendar),
  options: {
    auth: 'jwt',
    tags: ['api', 'Appointments', 'Operations', 'Calendar', 'v1'],
    description: 'Generate calendar export (iCal format)',
    notes: 'Generates iCalendar (.ics) file for nurse appointments compatible with Google Calendar, Outlook, Apple Calendar, and other iCal-compatible applications. Optionally filtered by date range. Includes appointment details (student name, type, location). Used for calendar integration and offline access to schedules.',
    validate: {
      params: nurseIdParamSchema,
      query: calendarExportQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Calendar file generated successfully', schema: { type: 'string', format: 'binary' } },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Nurse not found' }
        }
      }
    }
  }
};

const sendRemindersRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/appointments/reminders/send',
  handler: asyncHandler(AppointmentsController.sendReminders),
  options: {
    auth: 'jwt',
    tags: ['api', 'Appointments', 'Operations', 'Reminders', 'v1'],
    description: 'Process and send appointment reminders',
    notes: 'Processes pending appointment reminders and sends them via configured channels (SMS, email). Typically called by scheduled job/cron. Sends reminders at configured intervals (24 hours, 1 hour, 15 minutes before appointment). Returns summary of sent reminders and any failures. Admin only.',
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Reminders processed successfully' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Admin role required' }
        }
      }
    }
  }
};

/**
 * EXPORT ROUTES
 */

export const appointmentsRoutes: ServerRoute[] = [
  // CRUD operations
  listAppointmentsRoute,
  getAppointmentRoute,
  createAppointmentRoute,
  updateAppointmentRoute,

  // Status transitions
  cancelAppointmentRoute,
  markNoShowRoute,
  startAppointmentRoute,
  completeAppointmentRoute,

  // Availability & scheduling
  getAvailableSlotsRoute,
  getUpcomingAppointmentsRoute,

  // Analytics
  getStatisticsRoute,

  // Recurring appointments
  createRecurringRoute,

  // Waitlist management
  addToWaitlistRoute,
  getWaitlistRoute,
  removeFromWaitlistRoute,

  // Calendar & integrations
  generateCalendarRoute,
  sendRemindersRoute
];
