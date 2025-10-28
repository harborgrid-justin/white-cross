/**
 * LOC: BEFED7007B
 * WC-TYP-APT-063 | appointment.ts - Appointment System Type Definitions
 *
 * UPSTREAM (imports from):
 *   - None (leaf node)
 *
 * DOWNSTREAM (imported by):
 *   - AppointmentAvailabilityService.ts (services/appointment/AppointmentAvailabilityService.ts)
 *   - AppointmentRecurringService.ts (services/appointment/AppointmentRecurringService.ts)
 *   - AppointmentWaitlistService.ts (services/appointment/AppointmentWaitlistService.ts)
 *   - NurseAvailabilityService.ts (services/appointment/NurseAvailabilityService.ts)
 */

/**
 * WC-TYP-APT-063 | appointment.ts - Appointment System Type Definitions
 * Purpose: TypeScript interfaces and types for healthcare appointment scheduling, nurse availability, waitlist management
 * Upstream: None | Dependencies: TypeScript core types, Date objects
 * Downstream: ../routes/appointments.ts, ../services/appointmentService.ts, ../database/models/Appointment.ts | Called by: appointment system
 * Related: ../services/availabilityService.ts, ../services/reminderService.ts, ../types/index.ts
 * Exports: AppointmentType, AppointmentStatus, CreateAppointmentData, AvailabilitySlot, WaitlistEntry | Key Services: Appointment type safety
 * Last Updated: 2025-10-18 | File Type: .ts | Pattern: Type Definitions
 * Critical Path: Type import → Interface validation → Service layer → Database operations
 * LLM Context: Healthcare appointment scheduling types with nurse availability, student scheduling, waitlist prioritization, reminder systems, recurrence patterns
 */

/**
 * Healthcare appointment type classification.
 * Defines the nature and purpose of student health appointments.
 *
 * @typedef {string} AppointmentType
 *
 * @example
 * ```typescript
 * const appointment: CreateAppointmentData = {
 *   appointmentType: 'ROUTINE_CHECKUP',
 *   studentId: '123',
 *   nurseId: '456',
 *   scheduledDate: new Date()
 * };
 * ```
 */
export type AppointmentType =
  | 'ROUTINE_CHECKUP'
  | 'MEDICATION_ADMINISTRATION'
  | 'INJURY_ASSESSMENT'
  | 'ILLNESS_EVALUATION'
  | 'FOLLOW_UP'
  | 'SCREENING'
  | 'EMERGENCY';

/**
 * Current status of an appointment in its lifecycle.
 * Used for appointment tracking and workflow management.
 *
 * @typedef {string} AppointmentStatus
 */
export type AppointmentStatus =
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW';

/**
 * Communication channel for appointment reminders.
 *
 * @typedef {string} ReminderType
 */
export type ReminderType = 'sms' | 'email' | 'voice';

/**
 * Priority level for waitlist entries.
 * Determines scheduling priority when appointments become available.
 *
 * @typedef {string} WaitlistPriority
 */
export type WaitlistPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

/**
 * Frequency pattern for recurring appointments.
 *
 * @typedef {string} RecurrenceFrequency
 */
export type RecurrenceFrequency = 'daily' | 'weekly' | 'monthly';

/**
 * Data required to create a new healthcare appointment.
 * Used by appointment creation service and route handlers.
 *
 * @interface CreateAppointmentData
 * @property {string} studentId - Unique identifier of the student
 * @property {string} nurseId - Unique identifier of the assigned school nurse
 * @property {AppointmentType} appointmentType - Classification of appointment purpose
 * @property {Date} scheduledDate - Date and time when appointment is scheduled
 * @property {number} [duration] - Appointment duration in minutes (defaults to 30)
 * @property {string} [reason] - Brief description of appointment reason
 * @property {string} [notes] - Additional notes or special instructions
 *
 * @example
 * ```typescript
 * const newAppointment: CreateAppointmentData = {
 *   studentId: 'student-123',
 *   nurseId: 'nurse-456',
 *   appointmentType: 'ROUTINE_CHECKUP',
 *   scheduledDate: new Date('2025-11-01T10:00:00'),
 *   duration: 30,
 *   reason: 'Annual health screening'
 * };
 * ```
 */
export interface CreateAppointmentData {
  studentId: string;
  nurseId: string;
  appointmentType: AppointmentType;
  scheduledDate: Date;
  duration?: number; // minutes, defaults to 30
  reason?: string; // Optional in database
  notes?: string;
}

/**
 * Data for updating an existing appointment.
 * All fields are optional to support partial updates.
 *
 * @interface UpdateAppointmentData
 * @property {AppointmentType} [appointmentType] - Updated appointment type
 * @property {Date} [scheduledDate] - Rescheduled date and time
 * @property {number} [duration] - Updated duration in minutes
 * @property {string} [reason] - Updated reason description
 * @property {string} [notes] - Updated notes
 * @property {AppointmentStatus} [status] - Updated appointment status
 */
export interface UpdateAppointmentData {
  appointmentType?: AppointmentType;
  scheduledDate?: Date;
  duration?: number;
  reason?: string;
  notes?: string;
  status?: AppointmentStatus;
}

/**
 * Filter criteria for querying appointments.
 * Used in appointment search and reporting features.
 *
 * @interface AppointmentFilters
 * @property {string} [nurseId] - Filter by assigned nurse
 * @property {string} [studentId] - Filter by student
 * @property {AppointmentStatus} [status] - Filter by appointment status
 * @property {AppointmentType} [appointmentType] - Filter by appointment type
 * @property {Date} [dateFrom] - Filter appointments on or after this date
 * @property {Date} [dateTo] - Filter appointments on or before this date
 */
export interface AppointmentFilters {
  nurseId?: string;
  studentId?: string;
  status?: AppointmentStatus;
  appointmentType?: AppointmentType;
  dateFrom?: Date;
  dateTo?: Date;
}

/**
 * Represents a time slot in nurse availability schedule.
 * Used for appointment scheduling and availability checking.
 *
 * @interface AvailabilitySlot
 * @property {Date} start - Slot start time
 * @property {Date} end - Slot end time
 * @property {boolean} available - Whether slot is available for booking
 * @property {object} [conflictingAppointment] - Details if slot is unavailable
 * @property {string} conflictingAppointment.id - ID of conflicting appointment
 * @property {string} conflictingAppointment.student - Student name for conflict
 * @property {string} conflictingAppointment.reason - Reason for existing appointment
 *
 * @example
 * ```typescript
 * const slot: AvailabilitySlot = {
 *   start: new Date('2025-11-01T09:00:00'),
 *   end: new Date('2025-11-01T09:30:00'),
 *   available: false,
 *   conflictingAppointment: {
 *     id: 'appt-789',
 *     student: 'John Doe',
 *     reason: 'Medication administration'
 *   }
 * };
 * ```
 */
export interface AvailabilitySlot {
  start: Date;
  end: Date;
  available: boolean;
  conflictingAppointment?: {
    id: string;
    student: string;
    reason: string;
  };
}

/**
 * Configuration for appointment reminder notifications.
 *
 * @interface ReminderData
 * @property {string} appointmentId - ID of the appointment to remind about
 * @property {ReminderType} type - Communication channel for reminder
 * @property {Date} scheduleTime - When to send the reminder
 * @property {string} [message] - Custom reminder message (uses default if not provided)
 */
export interface ReminderData {
  appointmentId: string;
  type: ReminderType;
  scheduleTime: Date; // When to send the reminder
  message?: string;
}

/**
 * Nurse availability schedule configuration.
 * Supports both recurring weekly schedules and specific date availability.
 *
 * @interface NurseAvailabilityData
 * @property {string} nurseId - Unique identifier of the nurse
 * @property {number} [dayOfWeek] - Day of week (0=Sunday, 1=Monday, ..., 6=Saturday)
 * @property {string} startTime - Availability start time (HH:mm format)
 * @property {string} endTime - Availability end time (HH:mm format)
 * @property {boolean} [isRecurring] - Whether this is a recurring weekly schedule
 * @property {Date} [specificDate] - Specific date for one-time availability change
 * @property {boolean} [isAvailable] - Availability status (default: true)
 * @property {string} [reason] - Reason for unavailability or special notes
 *
 * @example
 * ```typescript
 * // Recurring weekly availability
 * const regularHours: NurseAvailabilityData = {
 *   nurseId: 'nurse-123',
 *   dayOfWeek: 1, // Monday
 *   startTime: '08:00',
 *   endTime: '16:00',
 *   isRecurring: true
 * };
 *
 * // Specific date unavailability
 * const dayOff: NurseAvailabilityData = {
 *   nurseId: 'nurse-123',
 *   specificDate: new Date('2025-11-15'),
 *   startTime: '00:00',
 *   endTime: '23:59',
 *   isAvailable: false,
 *   reason: 'Professional development day'
 * };
 * ```
 */
export interface NurseAvailabilityData {
  nurseId: string;
  dayOfWeek?: number;
  startTime: string;
  endTime: string;
  isRecurring?: boolean;
  specificDate?: Date;
  isAvailable?: boolean;
  reason?: string;
}

/**
 * Entry in appointment waitlist queue.
 * Used when no immediate appointment slots are available.
 *
 * @interface WaitlistEntry
 * @property {string} studentId - Student waiting for appointment
 * @property {string} [nurseId] - Preferred nurse (if any)
 * @property {AppointmentType} appointmentType - Type of appointment needed
 * @property {Date} [preferredDate] - Student's preferred appointment date
 * @property {number} [duration] - Expected appointment duration in minutes
 * @property {WaitlistPriority} [priority] - Priority level for scheduling
 * @property {string} [reason] - Reason for appointment request
 * @property {string} [notes] - Additional notes or requirements
 */
export interface WaitlistEntry {
  studentId: string;
  nurseId?: string;
  appointmentType: AppointmentType;
  preferredDate?: Date;
  duration?: number;
  priority?: WaitlistPriority;
  reason?: string; // Optional
  notes?: string;
}

/**
 * Pattern for recurring appointment schedules.
 * Used for students requiring regular medication or health monitoring.
 *
 * @interface RecurrencePattern
 * @property {RecurrenceFrequency} frequency - How often appointment recurs
 * @property {number} interval - Every N days/weeks/months
 * @property {Date} endDate - When recurring appointments should stop
 * @property {number[]} [daysOfWeek] - For weekly recurrence: days of week (0=Sunday, 6=Saturday)
 *
 * @example
 * ```typescript
 * // Daily medication administration for 30 days
 * const dailyMeds: RecurrencePattern = {
 *   frequency: 'daily',
 *   interval: 1,
 *   endDate: new Date('2025-12-01')
 * };
 *
 * // Weekly checkup every Monday and Wednesday
 * const weeklyCheckup: RecurrencePattern = {
 *   frequency: 'weekly',
 *   interval: 1,
 *   endDate: new Date('2026-06-01'),
 *   daysOfWeek: [1, 3] // Monday and Wednesday
 * };
 * ```
 */
export interface RecurrencePattern {
  frequency: RecurrenceFrequency;
  interval: number; // every N days/weeks/months
  endDate: Date;
  daysOfWeek?: number[]; // for weekly: 0=Sunday, 1=Monday, etc.
}
