/**
 * @fileoverview Appointment Validation Schemas
 * @module schemas/appointment
 *
 * Zod validation schemas for all appointment operations.
 * Provides type-safe validation with comprehensive error messages.
 *
 * This is a barrel export file that re-exports all appointment-related schemas
 * from focused, modular sub-files. Each module handles a specific domain area.
 */

// ==========================================
// BASE SCHEMAS - Core types and constants
// ==========================================
export {
  // Constants
  APPOINTMENT_STATUSES,
  APPOINTMENT_PRIORITIES,
  REMINDER_TYPES,
  NOTIFICATION_METHODS,
  REPORT_TYPES,
  REPORT_FORMATS,
  WORKING_DAYS,
  DATE_REGEX,
  TIME_REGEX,
  // Reusable field schemas
  studentIdSchema,
  nurseIdSchema,
  appointmentIdSchema,
  dateFieldSchema,
  timeFieldSchema,
  durationSchema,
  appointmentTypeSchema,
  prioritySchema,
  statusSchema,
  notesSchema,
  reasonSchema,
  timeRangeSchema,
  workingHoursSchema,
  // Types
  type AppointmentStatus,
  type AppointmentPriority,
  type ReminderType,
  type NotificationMethod,
  type ReportType,
  type ReportFormat,
  type WorkingDay,
  type TimeRange,
  type WorkingHours,
} from './appointment.base.schemas';

// ==========================================
// CRUD SCHEMAS - Create, update, lifecycle operations
// ==========================================
export {
  appointmentCreateSchema,
  appointmentUpdateSchema,
  appointmentRescheduleSchema,
  appointmentCancelSchema,
  appointmentCompleteSchema,
  appointmentNoShowSchema,
  appointmentCompleteSchemaWithValidation,
  type AppointmentCreateInput,
  type AppointmentUpdateInput,
  type AppointmentRescheduleInput,
  type AppointmentCancelInput,
  type AppointmentCompleteInput,
  type AppointmentNoShowInput,
  type AppointmentCompleteInputValidated,
} from './appointment.crud.schemas';

// ==========================================
// REMINDER SCHEMAS - Reminder configuration and sending
// ==========================================
export {
  reminderSettingsSchema,
  scheduleRemindersSchema,
  sendReminderSchema,
  reminderSettingsSchemaWithValidation,
  validateReminderTime,
  type ReminderSettings,
  type ScheduleRemindersInput,
  type SendReminderInput,
  type ReminderSettingsValidated,
} from './appointment.reminder.schemas';

// ==========================================
// WAITLIST SCHEMAS - Waitlist management
// ==========================================
export {
  waitlistEntrySchema,
  removeFromWaitlistSchema,
  fillFromWaitlistSchema,
  waitlistEntrySchemaWithValidation,
  fillFromWaitlistSchemaWithValidation,
  type WaitlistEntryInput,
  type RemoveFromWaitlistInput,
  type FillFromWaitlistInput,
  type WaitlistEntryInputValidated,
  type FillFromWaitlistInputValidated,
} from './appointment.waitlist.schemas';

// ==========================================
// SCHEDULING SCHEMAS - Conflict detection and slot finding
// ==========================================
export {
  conflictCheckSchema,
  findAvailableSlotsSchema,
  findAvailableSlotsSchemaWithValidation,
  findAvailableSlotsSchemaWithDurationCheck,
  type ConflictCheckInput,
  type FindAvailableSlotsInput,
  type FindAvailableSlotsInputValidated,
  type FindAvailableSlotsInputWithDurationCheck,
} from './appointment.scheduling.schemas';

// ==========================================
// QUERY SCHEMAS - List queries, filters, calendar
// ==========================================
export {
  appointmentListQuerySchema,
  calendarEventsQuerySchema,
  appointmentListQuerySchemaWithValidation,
  calendarEventsQuerySchemaWithValidation,
  calendarEventsQuerySchemaWithRangeLimit,
  type AppointmentListQuery,
  type CalendarEventsQuery,
  type AppointmentListQueryValidated,
  type CalendarEventsQueryValidated,
  type CalendarEventsQueryWithRangeLimit,
} from './appointment.query.schemas';

// ==========================================
// BULK SCHEMAS - Bulk operations
// ==========================================
export {
  bulkCreateAppointmentsSchema,
  bulkCancelAppointmentsSchema,
  bulkCancelAppointmentsSchemaWithValidation,
  bulkCreateAppointmentsSchemaWithValidation,
  type BulkCreateAppointmentsInput,
  type BulkCancelAppointmentsInput,
  type BulkCancelAppointmentsInputValidated,
  type BulkCreateAppointmentsInputValidated,
} from './appointment.bulk.schemas';

// ==========================================
// SETTINGS SCHEMAS - Configuration and reports
// ==========================================
export {
  appointmentReportSchema,
  appointmentSettingsSchema,
  appointmentReportSchemaWithValidation,
  appointmentSettingsSchemaWithValidation,
  validateFutureDate,
  validateWorkingHours,
  validateWorkingDay,
  calculateEndTime,
  type AppointmentReportInput,
  type AppointmentSettings,
  type AppointmentReportInputValidated,
  type AppointmentSettingsValidated,
} from './appointment.settings.schemas';
