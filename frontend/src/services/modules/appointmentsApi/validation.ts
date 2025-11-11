/**
 * Appointments API - Validation Schemas
 * 
 * Zod validation schemas for appointment scheduling and management operations.
 * Provides comprehensive input validation with healthcare-specific rules and
 * business logic validation.
 * 
 * @module services/modules/appointmentsApi/validation
 */

import { z } from 'zod';
import {
  AppointmentType,
  AppointmentStatus,
  AppointmentPriority,
  WaitlistPriority,
  MessageType,
  RecurrenceFrequency,
  ReminderStatus,
  APPOINTMENT_VALIDATION
} from './types';

// ==========================================
// APPOINTMENT VALIDATION SCHEMAS
// ==========================================

/**
 * Create Appointment Schema
 * Validates data for creating new appointments with comprehensive business rules
 */
export const createAppointmentSchema = z.object({
  studentId: z.string()
    .uuid('Invalid student ID format')
    .min(1, 'Student ID is required'),
  
  nurseId: z.string()
    .uuid('Invalid nurse ID format')
    .min(1, 'Nurse ID is required'),
  
  type: z.nativeEnum(AppointmentType),
  
  scheduledAt: z.string()
    .datetime('Invalid datetime format. Use ISO 8601 format')
    .refine(date => {
      const appointmentDate = new Date(date);
      const now = new Date();
      const minAdvance = new Date(now.getTime() + APPOINTMENT_VALIDATION.MIN_ADVANCE_BOOKING * 60000);
      return appointmentDate >= minAdvance;
    }, {
      message: `Appointment must be scheduled at least ${APPOINTMENT_VALIDATION.MIN_ADVANCE_BOOKING} minutes in advance`
    })
    .refine(date => {
      const appointmentDate = new Date(date);
      const now = new Date();
      const maxAdvance = new Date(now.getTime() + APPOINTMENT_VALIDATION.MAX_ADVANCE_BOOKING * 24 * 60 * 60 * 1000);
      return appointmentDate <= maxAdvance;
    }, {
      message: `Appointment cannot be scheduled more than ${APPOINTMENT_VALIDATION.MAX_ADVANCE_BOOKING} days in advance`
    })
    .refine(date => {
      const appointmentDate = new Date(date);
      const dayOfWeek = appointmentDate.getDay();
      return dayOfWeek >= 1 && dayOfWeek <= 5; // Monday to Friday only
    }, {
      message: 'Appointments can only be scheduled on weekdays (Monday-Friday)'
    })
    .refine(date => {
      const appointmentDate = new Date(date);
      const hours = appointmentDate.getHours();
      const minutes = appointmentDate.getMinutes();
      const totalMinutes = hours * 60 + minutes;
      
      // Business hours: 8:00 AM to 4:00 PM
      const startMinutes = 8 * 60; // 8:00 AM
      const endMinutes = 16 * 60; // 4:00 PM
      
      return totalMinutes >= startMinutes && totalMinutes <= endMinutes;
    }, {
      message: 'Appointments must be scheduled during business hours (8:00 AM - 4:00 PM)'
    }),
  
  duration: z.number()
    .int('Duration must be a whole number')
    .min(APPOINTMENT_VALIDATION.MIN_DURATION, `Duration must be at least ${APPOINTMENT_VALIDATION.MIN_DURATION} minutes`)
    .max(APPOINTMENT_VALIDATION.MAX_DURATION, `Duration cannot exceed ${APPOINTMENT_VALIDATION.MAX_DURATION} minutes`)
    .refine(duration => duration % APPOINTMENT_VALIDATION.SLOT_INTERVAL === 0, {
      message: `Duration must be in ${APPOINTMENT_VALIDATION.SLOT_INTERVAL}-minute intervals`
    })
    .optional()
    .default(APPOINTMENT_VALIDATION.DEFAULT_DURATION),
  
  reason: z.string()
    .max(500, 'Reason cannot exceed 500 characters')
    .optional(),
  
  priority: z.nativeEnum(AppointmentPriority)
    .optional()
    .default(AppointmentPriority.NORMAL),
  
  notes: z.string()
    .max(1000, 'Notes cannot exceed 1000 characters')
    .optional(),
  
  parentNotificationRequired: z.boolean()
    .optional()
    .default(false),
  
  reminderEnabled: z.boolean()
    .optional()
    .default(true),
}).refine(data => {
  // Emergency appointments require a reason
  if (data.priority === AppointmentPriority.EMERGENCY && !data.reason?.trim()) {
    return false;
  }
  return true;
}, {
  message: 'Emergency appointments must include a reason',
  path: ['reason']
}).refine(data => {
  // Medication appointments should have longer duration
  if (data.type === AppointmentType.MEDICATION && data.duration && data.duration < 20) {
    return false;
  }
  return true;
}, {
  message: 'Medication appointments should be at least 20 minutes',
  path: ['duration']
});

/**
 * Update Appointment Schema
 * Validates data for updating existing appointments
 */
export const updateAppointmentSchema = z.object({
  type: z.nativeEnum(AppointmentType).optional(),
  
  scheduledAt: z.string()
    .datetime('Invalid datetime format')
    .refine(date => {
      const appointmentDate = new Date(date);
      const now = new Date();
      return appointmentDate > now;
    }, {
      message: 'Cannot reschedule appointment to a past time'
    })
    .optional(),
  
  duration: z.number()
    .int('Duration must be a whole number')
    .min(APPOINTMENT_VALIDATION.MIN_DURATION, `Duration must be at least ${APPOINTMENT_VALIDATION.MIN_DURATION} minutes`)
    .max(APPOINTMENT_VALIDATION.MAX_DURATION, `Duration cannot exceed ${APPOINTMENT_VALIDATION.MAX_DURATION} minutes`)
    .optional(),
  
  reason: z.string()
    .max(500, 'Reason cannot exceed 500 characters')
    .optional(),
  
  priority: z.nativeEnum(AppointmentPriority).optional(),
  
  notes: z.string()
    .max(1000, 'Notes cannot exceed 1000 characters')
    .optional(),
  
  outcomes: z.string()
    .max(2000, 'Outcomes cannot exceed 2000 characters')
    .optional(),
  
  followUpRequired: z.boolean().optional(),
  
  followUpDate: z.string()
    .date('Invalid date format')
    .refine(date => {
      const followUpDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return followUpDate >= today;
    }, {
      message: 'Follow-up date cannot be in the past'
    })
    .optional(),
}).refine(data => {
  // If follow-up is required, follow-up date must be provided
  if (data.followUpRequired && !data.followUpDate) {
    return false;
  }
  return true;
}, {
  message: 'Follow-up date is required when follow-up is marked as required',
  path: ['followUpDate']
});

/**
 * Appointment Filters Schema
 * Validates filter parameters for appointment queries
 */
export const appointmentFiltersSchema = z.object({
  startDate: z.string()
    .date('Invalid start date format')
    .optional(),
  
  endDate: z.string()
    .date('Invalid end date format')
    .optional(),
  
  nurseId: z.string()
    .uuid('Invalid nurse ID format')
    .optional(),
  
  studentId: z.string()
    .uuid('Invalid student ID format')
    .optional(),
  
  status: z.nativeEnum(AppointmentStatus).optional(),
  
  type: z.nativeEnum(AppointmentType).optional(),
  
  priority: z.nativeEnum(AppointmentPriority).optional(),
  
  search: z.string()
    .max(255, 'Search term cannot exceed 255 characters')
    .optional(),
  
  page: z.number()
    .int('Page must be a whole number')
    .min(1, 'Page must be at least 1')
    .optional()
    .default(1),
  
  limit: z.number()
    .int('Limit must be a whole number')
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .optional()
    .default(20),
  
  sortBy: z.enum(['scheduledAt', 'createdAt', 'priority', 'status'])
    .optional()
    .default('scheduledAt'),
  
  sortOrder: z.enum(['asc', 'desc'])
    .optional()
    .default('asc'),
}).refine(data => {
  // Start date must be before or equal to end date
  if (data.startDate && data.endDate) {
    return new Date(data.startDate) <= new Date(data.endDate);
  }
  return true;
}, {
  message: 'Start date must be before or equal to end date',
  path: ['startDate']
});

// ==========================================
// NURSE AVAILABILITY VALIDATION
// ==========================================

/**
 * Nurse Availability Schema
 * Validates nurse availability data
 */
export const nurseAvailabilitySchema = z.object({
  nurseId: z.string()
    .uuid('Invalid nurse ID format')
    .min(1, 'Nurse ID is required'),
  
  dayOfWeek: z.number()
    .int('Day of week must be a whole number')
    .min(0, 'Day of week must be between 0 (Sunday) and 6 (Saturday)')
    .max(6, 'Day of week must be between 0 (Sunday) and 6 (Saturday)')
    .optional(),
  
  startTime: z.string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Start time must be in HH:MM format')
    .refine(time => {
      const timeParts = time.split(':').map(Number);
      if (timeParts.length !== 2 || timeParts.some(isNaN)) return false;
      const [hours, minutes] = timeParts;
      const totalMinutes = hours * 60 + minutes;
      return totalMinutes >= 6 * 60 && totalMinutes <= 18 * 60; // 6:00 AM to 6:00 PM
    }, {
      message: 'Start time must be between 6:00 AM and 6:00 PM'
    }),
  
  endTime: z.string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'End time must be in HH:MM format')
    .refine(time => {
      const timeParts = time.split(':').map(Number);
      if (timeParts.length !== 2 || timeParts.some(isNaN)) return false;
      const [hours, minutes] = timeParts;
      const totalMinutes = hours * 60 + minutes;
      return totalMinutes >= 6 * 60 && totalMinutes <= 18 * 60; // 6:00 AM to 6:00 PM
    }, {
      message: 'End time must be between 6:00 AM and 6:00 PM'
    }),
  
  date: z.string()
    .date('Invalid date format')
    .refine(date => {
      const availabilityDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return availabilityDate >= today;
    }, {
      message: 'Availability date cannot be in the past'
    })
    .optional(),
  
  isRecurring: z.boolean()
    .optional()
    .default(true),
  
  maxAppointments: z.number()
    .int('Max appointments must be a whole number')
    .min(1, 'Max appointments must be at least 1')
    .max(APPOINTMENT_VALIDATION.MAX_DAILY_APPOINTMENTS, `Max appointments cannot exceed ${APPOINTMENT_VALIDATION.MAX_DAILY_APPOINTMENTS} per day`)
    .optional(),
  
  slotDuration: z.number()
    .int('Slot duration must be a whole number')
    .min(APPOINTMENT_VALIDATION.MIN_DURATION, `Slot duration must be at least ${APPOINTMENT_VALIDATION.MIN_DURATION} minutes`)
    .max(APPOINTMENT_VALIDATION.MAX_DURATION, `Slot duration cannot exceed ${APPOINTMENT_VALIDATION.MAX_DURATION} minutes`)
    .refine(duration => duration % APPOINTMENT_VALIDATION.SLOT_INTERVAL === 0, {
      message: `Slot duration must be in ${APPOINTMENT_VALIDATION.SLOT_INTERVAL}-minute intervals`
    })
    .optional()
    .default(APPOINTMENT_VALIDATION.DEFAULT_DURATION),
  
  breakTime: z.number()
    .int('Break time must be a whole number')
    .min(0, 'Break time cannot be negative')
    .max(30, 'Break time cannot exceed 30 minutes')
    .optional()
    .default(APPOINTMENT_VALIDATION.BREAK_TIME),
}).refine(data => {
  // End time must be after start time
  const startTimeParts = data.startTime.split(':').map(Number);
  const endTimeParts = data.endTime.split(':').map(Number);
  
  if (startTimeParts.length !== 2 || endTimeParts.length !== 2) return false;
  if (startTimeParts.some(isNaN) || endTimeParts.some(isNaN)) return false;
  
  const [startHours, startMinutes] = startTimeParts;
  const [endHours, endMinutes] = endTimeParts;
  
  const startTotalMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = endHours * 60 + endMinutes;
  
  return endTotalMinutes > startTotalMinutes;
}, {
  message: 'End time must be after start time',
  path: ['endTime']
}).refine(data => {
  // Must specify either dayOfWeek (for recurring) or date (for specific date)
  if (data.isRecurring && data.dayOfWeek === undefined) {
    return false;
  }
  if (!data.isRecurring && !data.date) {
    return false;
  }
  return true;
}, {
  message: 'Must specify either day of week (for recurring) or specific date',
  path: ['dayOfWeek']
});

// ==========================================
// WAITLIST VALIDATION SCHEMAS
// ==========================================

/**
 * Waitlist Entry Schema
 * Validates data for adding students to waitlist
 */
export const waitlistEntrySchema = z.object({
  studentId: z.string()
    .uuid('Invalid student ID format')
    .min(1, 'Student ID is required'),
  
  nurseId: z.string()
    .uuid('Invalid nurse ID format')
    .optional(),
  
  type: z.nativeEnum(AppointmentType),
  
  reason: z.string()
    .min(1, 'Reason is required')
    .max(500, 'Reason cannot exceed 500 characters'),
  
  priority: z.nativeEnum(WaitlistPriority)
    .optional()
    .default(WaitlistPriority.NORMAL),
  
  preferredDate: z.string()
    .date('Invalid preferred date format')
    .refine(date => {
      const preferredDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return preferredDate >= today;
    }, {
      message: 'Preferred date cannot be in the past'
    })
    .optional(),
  
  duration: z.number()
    .int('Duration must be a whole number')
    .min(APPOINTMENT_VALIDATION.MIN_DURATION, `Duration must be at least ${APPOINTMENT_VALIDATION.MIN_DURATION} minutes`)
    .max(APPOINTMENT_VALIDATION.MAX_DURATION, `Duration cannot exceed ${APPOINTMENT_VALIDATION.MAX_DURATION} minutes`)
    .optional()
    .default(APPOINTMENT_VALIDATION.DEFAULT_DURATION),
  
  notes: z.string()
    .max(1000, 'Notes cannot exceed 1000 characters')
    .optional(),
});

/**
 * Waitlist Filters Schema
 * Validates filter parameters for waitlist queries
 */
export const waitlistFiltersSchema = z.object({
  nurseId: z.string()
    .uuid('Invalid nurse ID format')
    .optional(),
  
  type: z.nativeEnum(AppointmentType).optional(),
  
  priority: z.nativeEnum(WaitlistPriority).optional(),
  
  dateFrom: z.string()
    .date('Invalid start date format')
    .optional(),
  
  dateTo: z.string()
    .date('Invalid end date format')
    .optional(),
  
  page: z.number()
    .int('Page must be a whole number')
    .min(1, 'Page must be at least 1')
    .optional()
    .default(1),
  
  limit: z.number()
    .int('Limit must be a whole number')
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .optional()
    .default(20),
  
  sortBy: z.enum(['position', 'createdAt', 'priority', 'preferredDate'])
    .optional()
    .default('position'),
  
  sortOrder: z.enum(['asc', 'desc'])
    .optional()
    .default('asc'),
}).refine(data => {
  // Start date must be before or equal to end date
  if (data.dateFrom && data.dateTo) {
    return new Date(data.dateFrom) <= new Date(data.dateTo);
  }
  return true;
}, {
  message: 'Start date must be before or equal to end date',
  path: ['dateFrom']
});

// ==========================================
// REMINDER VALIDATION SCHEMAS
// ==========================================

/**
 * Schedule Reminder Schema
 * Validates data for scheduling appointment reminders
 */
export const scheduleReminderSchema = z.object({
  appointmentId: z.string()
    .uuid('Invalid appointment ID format')
    .min(1, 'Appointment ID is required'),
  
  type: z.nativeEnum(MessageType),
  
  scheduleTime: z.string()
    .datetime('Invalid schedule time format')
    .refine(time => {
      const scheduleDate = new Date(time);
      const now = new Date();
      return scheduleDate > now;
    }, {
      message: 'Schedule time must be in the future'
    }),
  
  message: z.string()
    .max(1000, 'Message cannot exceed 1000 characters')
    .optional(),
});

/**
 * Cancel Reminder Schema
 * Validates reminder cancellation
 */
export const cancelReminderSchema = z.object({
  reminderId: z.string()
    .uuid('Invalid reminder ID format')
    .min(1, 'Reminder ID is required'),
  
  reason: z.string()
    .max(255, 'Cancellation reason cannot exceed 255 characters')
    .optional(),
});

// ==========================================
// RECURRING APPOINTMENT VALIDATION
// ==========================================

/**
 * Recurrence Configuration Schema
 * Validates recurring appointment patterns
 */
export const recurrenceConfigurationSchema = z.object({
  frequency: z.nativeEnum(RecurrenceFrequency),
  
  interval: z.number()
    .int('Interval must be a whole number')
    .min(1, 'Interval must be at least 1')
    .max(52, 'Interval cannot exceed 52 (for weekly recurrence)'),
  
  endDate: z.string()
    .date('Invalid end date format')
    .refine(date => {
      const endDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const maxEndDate = new Date(today.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 year from today
      return endDate >= today && endDate <= maxEndDate;
    }, {
      message: 'End date must be between today and 1 year from now'
    })
    .optional(),
  
  maxOccurrences: z.number()
    .int('Max occurrences must be a whole number')
    .min(1, 'Max occurrences must be at least 1')
    .max(100, 'Max occurrences cannot exceed 100')
    .optional(),
  
  daysOfWeek: z.array(z.number().int().min(0).max(6))
    .min(1, 'At least one day of week must be specified')
    .max(7, 'Cannot specify more than 7 days')
    .refine(days => {
      // Check for duplicates
      const uniqueDays = new Set(days);
      return uniqueDays.size === days.length;
    }, {
      message: 'Duplicate days of week are not allowed'
    })
    .optional(),
  
  dayOfMonth: z.number()
    .int('Day of month must be a whole number')
    .min(1, 'Day of month must be between 1 and 31')
    .max(31, 'Day of month must be between 1 and 31')
    .optional(),
  
  exceptions: z.array(z.string().date('Invalid exception date format'))
    .max(50, 'Cannot have more than 50 exception dates')
    .optional(),
}).refine(data => {
  // Must provide either endDate or maxOccurrences
  if (!data.endDate && !data.maxOccurrences) {
    return false;
  }
  return true;
}, {
  message: 'Must specify either end date or maximum occurrences',
  path: ['endDate']
}).refine(data => {
  // Weekly recurrence should specify days of week
  if (data.frequency === RecurrenceFrequency.WEEKLY && !data.daysOfWeek?.length) {
    return false;
  }
  return true;
}, {
  message: 'Weekly recurrence must specify days of week',
  path: ['daysOfWeek']
}).refine(data => {
  // Monthly recurrence should specify day of month
  if (data.frequency === RecurrenceFrequency.MONTHLY && !data.dayOfMonth) {
    return false;
  }
  return true;
}, {
  message: 'Monthly recurrence must specify day of month',
  path: ['dayOfMonth']
}).refine(data => {
  // Frequency-specific interval validation
  if (data.frequency === RecurrenceFrequency.DAILY && data.interval > 30) {
    return false;
  }
  if (data.frequency === RecurrenceFrequency.MONTHLY && data.interval > 12) {
    return false;
  }
  return true;
}, {
  message: 'Interval exceeds maximum for frequency type'
});

/**
 * Recurring Appointment Schema
 * Validates data for creating recurring appointments
 */
export const recurringAppointmentSchema = createAppointmentSchema.extend({
  recurrence: recurrenceConfigurationSchema,
});

// ==========================================
// CONFLICT CHECK VALIDATION
// ==========================================

/**
 * Conflict Check Schema
 * Validates parameters for checking appointment conflicts
 */
export const conflictCheckSchema = z.object({
  nurseId: z.string()
    .uuid('Invalid nurse ID format')
    .min(1, 'Nurse ID is required'),
  
  startTime: z.string()
    .datetime('Invalid start time format'),
  
  duration: z.number()
    .int('Duration must be a whole number')
    .min(APPOINTMENT_VALIDATION.MIN_DURATION, `Duration must be at least ${APPOINTMENT_VALIDATION.MIN_DURATION} minutes`)
    .max(APPOINTMENT_VALIDATION.MAX_DURATION, `Duration cannot exceed ${APPOINTMENT_VALIDATION.MAX_DURATION} minutes`),
  
  excludeAppointmentId: z.string()
    .uuid('Invalid appointment ID format')
    .optional(),
});

// ==========================================
// BULK OPERATIONS VALIDATION
// ==========================================

/**
 * Bulk Cancel Schema
 * Validates bulk appointment cancellation
 */
export const bulkCancelSchema = z.object({
  appointmentIds: z.array(z.string().uuid('Invalid appointment ID format'))
    .min(1, 'At least one appointment ID is required')
    .max(50, 'Cannot cancel more than 50 appointments at once'),
  
  reason: z.string()
    .max(500, 'Cancellation reason cannot exceed 500 characters')
    .optional(),
});

// ==========================================
// STATISTICS AND ANALYTICS VALIDATION
// ==========================================

/**
 * Statistics Filters Schema
 * Validates parameters for appointment statistics
 */
export const statisticsFiltersSchema = z.object({
  nurseId: z.string()
    .uuid('Invalid nurse ID format')
    .optional(),
  
  dateFrom: z.string()
    .date('Invalid start date format')
    .optional(),
  
  dateTo: z.string()
    .date('Invalid end date format')
    .optional(),
}).refine(data => {
  if (data.dateFrom && data.dateTo) {
    return new Date(data.dateFrom) <= new Date(data.dateTo);
  }
  return true;
}, {
  message: 'Start date must be before or equal to end date',
  path: ['dateFrom']
});

/**
 * Trends Query Schema
 * Validates parameters for appointment trends
 */
export const trendsQuerySchema = z.object({
  dateFrom: z.string()
    .date('Invalid start date format'),
  
  dateTo: z.string()
    .date('Invalid end date format'),
  
  groupBy: z.enum(['day', 'week', 'month'])
    .optional()
    .default('day'),
}).refine(data => {
  return new Date(data.dateFrom) <= new Date(data.dateTo);
}, {
  message: 'Start date must be before or equal to end date',
  path: ['dateFrom']
}).refine(data => {
  // Date range should not exceed 2 years
  const startDate = new Date(data.dateFrom);
  const endDate = new Date(data.dateTo);
  const diffTime = endDate.getTime() - startDate.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  return diffDays <= 730; // 2 years
}, {
  message: 'Date range cannot exceed 2 years',
  path: ['dateTo']
});

// ==========================================
// FORM VALIDATION SCHEMAS
// ==========================================

/**
 * Appointment Form Schema
 * Validates appointment form data with UI-specific fields
 */
export const appointmentFormSchema = z.object({
  studentId: z.string()
    .uuid('Invalid student ID format')
    .min(1, 'Student selection is required'),
  
  nurseId: z.string()
    .uuid('Invalid nurse ID format')
    .min(1, 'Nurse selection is required'),
  
  type: z.nativeEnum(AppointmentType),
  
  scheduledDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .refine(date => {
      const appointmentDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return appointmentDate >= today;
    }, {
      message: 'Appointment date cannot be in the past'
    }),
  
  scheduledTime: z.string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be in HH:MM format'),
  
  duration: z.number()
    .int('Duration must be a whole number')
    .min(APPOINTMENT_VALIDATION.MIN_DURATION, `Duration must be at least ${APPOINTMENT_VALIDATION.MIN_DURATION} minutes`)
    .max(APPOINTMENT_VALIDATION.MAX_DURATION, `Duration cannot exceed ${APPOINTMENT_VALIDATION.MAX_DURATION} minutes`),
  
  reason: z.string()
    .min(1, 'Reason is required')
    .max(500, 'Reason cannot exceed 500 characters'),
  
  priority: z.nativeEnum(AppointmentPriority),
  
  notes: z.string()
    .max(1000, 'Notes cannot exceed 1000 characters')
    .optional(),
  
  parentNotificationRequired: z.boolean(),
  
  reminderEnabled: z.boolean(),
  
  reminderTime: z.number()
    .int('Reminder time must be a whole number')
    .min(1, 'Reminder time must be at least 1 hour')
    .max(168, 'Reminder time cannot exceed 168 hours (1 week)')
    .optional(),
}).refine(data => {
  // Combine date and time to validate business hours
  const dateTime = new Date(`${data.scheduledDate}T${data.scheduledTime}`);
  const hours = dateTime.getHours();
  const minutes = dateTime.getMinutes();
  const totalMinutes = hours * 60 + minutes;
  
  // Business hours: 8:00 AM to 4:00 PM
  const startMinutes = 8 * 60;
  const endMinutes = 16 * 60;
  
  return totalMinutes >= startMinutes && totalMinutes <= endMinutes;
}, {
  message: 'Appointment must be scheduled during business hours (8:00 AM - 4:00 PM)',
  path: ['scheduledTime']
});

// ==========================================
// COMMON VALIDATION HELPERS
// ==========================================

/**
 * UUID validation schema
 */
export const uuidSchema = z.string().uuid('Invalid ID format');

/**
 * Date range validation schema
 */
export const dateRangeSchema = z.object({
  startDate: z.string().date('Invalid start date format'),
  endDate: z.string().date('Invalid end date format'),
}).refine(data => {
  return new Date(data.startDate) <= new Date(data.endDate);
}, {
  message: 'Start date must be before or equal to end date',
  path: ['startDate']
});

/**
 * Pagination validation schema
 */
export const paginationSchema = z.object({
  page: z.number().int().min(1).optional().default(1),
  limit: z.number().int().min(1).max(100).optional().default(20),
});

// ==========================================
// VALIDATION ERROR HELPERS
// ==========================================

/**
 * Extract validation error messages from Zod error
 */
export function getValidationErrors(error: z.ZodError): Record<string, string[]> {
  const errors: Record<string, string[]> = {};
  
  error.issues.forEach(issue => {
    const path = issue.path.join('.');
    if (!errors[path]) {
      errors[path] = [];
    }
    errors[path].push(issue.message);
  });
  
  return errors;
}

/**
 * Validate appointment business rules
 */
export function validateAppointmentBusinessRules(data: {
  scheduledAt: string;
  duration: number;
  type: AppointmentType;
  priority: AppointmentPriority;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check if appointment is during lunch hours (12:00 PM - 1:00 PM)
  const appointmentDate = new Date(data.scheduledAt);
  const hour = appointmentDate.getHours();
  if (hour >= 12 && hour < 13) {
    errors.push('Appointments cannot be scheduled during lunch hours (12:00 PM - 1:00 PM)');
  }
  
  // Check if appointment end time would extend beyond business hours
  const endTime = new Date(appointmentDate.getTime() + data.duration * 60000);
  const endHour = endTime.getHours();
  const endMinute = endTime.getMinutes();
  const endTotalMinutes = endHour * 60 + endMinute;
  
  if (endTotalMinutes > 16 * 60) { // 4:00 PM
    errors.push('Appointment would extend beyond business hours (4:00 PM)');
  }
  
  // Emergency appointments should be scheduled immediately
  if (data.priority === AppointmentPriority.EMERGENCY) {
    const now = new Date();
    const diffMinutes = (appointmentDate.getTime() - now.getTime()) / 60000;
    if (diffMinutes > 60) { // More than 1 hour in future
      errors.push('Emergency appointments should be scheduled within 1 hour');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}
