/**
 * WF-COMP-317 | appointments.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: React ecosystem
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants, interfaces | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Appointment Module Types
 * Comprehensive type definitions for the White Cross appointment scheduling system
 * Aligned with backend services and database schema
 */

import type { BaseEntity } from './common';
import type { Student, User } from '../services/types';

// =====================
// VALIDATION CONSTANTS
// =====================

/**
 * Appointment Validation Rules
 * These constants match backend validation rules in appointmentService.ts
 */
export const APPOINTMENT_VALIDATION = {
  DURATION: {
    MIN: 15,
    MAX: 120,
    DEFAULT: 30,
    INCREMENT: 15,
  },
  BUSINESS_HOURS: {
    START: 8, // 8 AM
    END: 17,  // 5 PM
  },
  CANCELLATION: {
    MIN_HOURS_NOTICE: 2,
  },
  APPOINTMENTS: {
    MAX_PER_DAY: 16,
    BUFFER_TIME_MINUTES: 15,
  },
  REMINDERS: {
    MIN_HOURS_BEFORE: 0.5,  // 30 minutes
    MAX_HOURS_BEFORE: 168,  // 7 days
  },
  WEEKEND_DAYS: [0, 6] as const, // Sunday and Saturday
} as const;

/**
 * Appointment Status Transitions
 * Defines valid status transitions for appointment workflow
 */
export const APPOINTMENT_STATUS_TRANSITIONS: Record<AppointmentStatus, AppointmentStatus[]> = {
  SCHEDULED: ['IN_PROGRESS', 'CANCELLED', 'NO_SHOW'],
  IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
  NO_SHOW: [],
} as const;

// =====================
// ENUMS
// =====================

/**
 * Appointment Type Enum
 * Defines the various types of appointments that can be scheduled
 */
export enum AppointmentType {
  ROUTINE_CHECKUP = 'ROUTINE_CHECKUP',
  MEDICATION_ADMINISTRATION = 'MEDICATION_ADMINISTRATION',
  INJURY_ASSESSMENT = 'INJURY_ASSESSMENT',
  ILLNESS_EVALUATION = 'ILLNESS_EVALUATION',
  FOLLOW_UP = 'FOLLOW_UP',
  SCREENING = 'SCREENING',
  EMERGENCY = 'EMERGENCY',
}

/**
 * Appointment Status Enum
 * Tracks the lifecycle status of an appointment
 */
export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

/**
 * Waitlist Priority Enum
 * Determines the priority level for students on the appointment waitlist
 */
export enum WaitlistPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

/**
 * Waitlist Status Enum
 * Tracks the status of a waitlist entry
 */
export enum WaitlistStatus {
  WAITING = 'WAITING',
  NOTIFIED = 'NOTIFIED',
  SCHEDULED = 'SCHEDULED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

/**
 * Reminder Status Enum
 * Tracks the delivery status of appointment reminders
 */
export enum ReminderStatus {
  SCHEDULED = 'SCHEDULED',
  SENT = 'SENT',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

/**
 * Message Type Enum
 * Defines the communication channels for appointment reminders
 */
export enum MessageType {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH_NOTIFICATION = 'PUSH_NOTIFICATION',
  VOICE = 'VOICE',
}

/**
 * Recurrence Frequency Enum
 * Defines the frequency of recurring appointments
 */
export enum RecurrenceFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

// =====================
// CORE ENTITIES
// =====================

/**
 * Appointment Entity
 * Represents a scheduled appointment between a student and nurse
 */
export interface Appointment extends BaseEntity {
  studentId: string;
  nurseId: string;
  type: AppointmentType;
  scheduledAt: string; // ISO 8601 datetime
  duration: number; // Duration in minutes
  status: AppointmentStatus;
  reason: string;
  notes?: string;
  privateNotes?: string;
  followUpRequired?: boolean;
  followUpDate?: string; // ISO 8601 date

  // Populated associations
  student?: Student;
  nurse?: User;
  reminders?: AppointmentReminder[];
}

/**
 * Appointment Reminder Entity
 * Represents scheduled reminders for appointments
 */
export interface AppointmentReminder extends BaseEntity {
  appointmentId: string;
  type: MessageType;
  scheduledFor: string; // ISO 8601 datetime - when to send the reminder
  message?: string;
  status: ReminderStatus;
  sentAt?: string; // ISO 8601 datetime
  failureReason?: string;

  // Populated associations
  appointment?: Appointment;
}

/**
 * Appointment Waitlist Entity
 * @aligned_with backend/src/database/models/healthcare/AppointmentWaitlist.ts
 *
 * Represents students waiting for an available appointment slot
 */
export interface AppointmentWaitlist extends BaseEntity {
  studentId: string;
  nurseId?: string; // Optional - can request any available nurse
  type: AppointmentType;
  preferredDate?: string; // ISO 8601 date
  duration: number; // Preferred duration in minutes
  priority: WaitlistPriority;
  reason: string;
  notes?: string;
  status: WaitlistStatus;
  expiresAt: string; // ISO 8601 datetime - when this waitlist entry expires
  notifiedAt?: string; // ISO 8601 datetime - when contact was notified

  // Populated associations
  student?: Student;
  nurse?: User;
}

/**
 * Nurse Availability Entity
 * @aligned_with backend/src/database/models/healthcare/NurseAvailability.ts
 *
 * Defines when nurses are available for appointments
 */
export interface NurseAvailability extends BaseEntity {
  nurseId: string;
  dayOfWeek?: number; // 0-6, where 0 is Sunday (for recurring schedules)
  startTime: string; // Time in HH:mm format
  endTime: string; // Time in HH:mm format
  isRecurring: boolean; // True for weekly recurring, false for specific dates
  specificDate?: string; // ISO 8601 date - for non-recurring availability
  isAvailable: boolean; // False indicates unavailability (e.g., time off)
  reason?: string; // Reason for unavailability or special notes

  // Populated associations
  nurse?: User;
}

/**
 * Availability Slot
 * Represents a time slot with availability information
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

// =====================
// API REQUEST TYPES
// =====================

/**
 * Create Appointment Request Data
 * Data required to create a new appointment
 */
export interface CreateAppointmentData {
  studentId: string;
  nurseId: string;
  type: AppointmentType;
  scheduledAt: string; // ISO 8601 datetime
  duration?: number; // Minutes, defaults to 30
  reason: string;
  notes?: string;
}

/**
 * Update Appointment Request Data
 * Data that can be updated for an existing appointment
 */
export interface UpdateAppointmentData {
  type?: AppointmentType;
  scheduledAt?: string; // ISO 8601 datetime
  duration?: number; // Minutes
  reason?: string;
  notes?: string;
  status?: AppointmentStatus;
}

/**
 * Appointment Filter Criteria
 * Used for filtering and searching appointments
 */
export interface AppointmentFilters {
  nurseId?: string;
  studentId?: string;
  status?: AppointmentStatus;
  type?: AppointmentType;
  dateFrom?: string; // ISO 8601 date
  dateTo?: string; // ISO 8601 date
  page?: number;
  limit?: number;
}

/**
 * Nurse Availability Request Data
 * Data for creating or updating nurse availability
 */
export interface NurseAvailabilityData {
  nurseId: string;
  dayOfWeek?: number; // 0-6, where 0 is Sunday
  startTime: string; // Time in HH:mm format
  endTime: string; // Time in HH:mm format
  isRecurring?: boolean;
  specificDate?: string; // ISO 8601 date
  isAvailable?: boolean;
  reason?: string;
}

/**
 * Waitlist Entry Request Data
 * Data for adding a student to the appointment waitlist
 */
export interface WaitlistEntryData {
  studentId: string;
  nurseId?: string;
  type: AppointmentType;
  preferredDate?: string; // ISO 8601 date
  duration?: number; // Minutes
  priority?: WaitlistPriority;
  reason: string;
  notes?: string;
}

/**
 * Waitlist Filter Criteria
 * Used for filtering waitlist entries
 */
export interface WaitlistFilters {
  nurseId?: string;
  status?: WaitlistStatus;
  priority?: WaitlistPriority;
}

/**
 * Reminder Request Data
 * Data for scheduling appointment reminders
 */
export interface ReminderData {
  appointmentId: string;
  type: MessageType;
  scheduleTime: string; // ISO 8601 datetime - when to send the reminder
  message?: string;
}

/**
 * Recurring Appointment Configuration
 * Defines the recurrence pattern for recurring appointments
 */
export interface RecurrencePattern {
  frequency: RecurrenceFrequency;
  interval: number; // Every N days/weeks/months
  endDate: string; // ISO 8601 date
  daysOfWeek?: number[]; // For weekly: 0=Sunday, 1=Monday, etc.
}

/**
 * Recurring Appointment Request Data
 * Data for creating recurring appointments
 */
export interface RecurringAppointmentData {
  studentId: string;
  nurseId: string;
  type: AppointmentType;
  scheduledAt: string; // ISO 8601 datetime - first occurrence
  duration?: number; // Minutes
  reason: string;
  notes?: string;
  recurrence: RecurrencePattern;
}

// =====================
// API RESPONSE TYPES
// =====================

/**
 * Appointment Statistics Response
 * Aggregated statistics about appointments
 */
export interface AppointmentStatistics {
  total: number;
  byStatus: Record<AppointmentStatus, number>;
  byType: Record<AppointmentType, number>;
  noShowRate: number; // Percentage
  completionRate: number; // Percentage
}

/**
 * Reminder Processing Result
 * Results from processing pending reminders
 */
export interface ReminderProcessingResult {
  total: number;
  sent: number;
  failed: number;
}

/**
 * Conflict Detection Result
 * Results from checking appointment conflicts
 */
export interface ConflictCheckResult {
  hasConflict: boolean;
  conflicts: Appointment[];
  availableSlots: AvailabilitySlot[];
}

/**
 * Calendar Export Configuration
 * Configuration for calendar export (iCal format)
 */
export interface CalendarExportOptions {
  nurseId: string;
  dateFrom?: string; // ISO 8601 date
  dateTo?: string; // ISO 8601 date
  format?: 'ical' | 'google' | 'outlook';
}

// =====================
// FORM DATA TYPES
// =====================

/**
 * Appointment Form Data
 * Type-safe form data for appointment creation/editing
 */
export interface AppointmentFormData {
  studentId: string;
  nurseId: string;
  type: AppointmentType;
  scheduledAt: Date;
  duration: number;
  reason: string;
  notes?: string;
}

/**
 * Waitlist Form Data
 * Type-safe form data for waitlist entry
 */
export interface WaitlistFormData {
  studentId: string;
  nurseId?: string;
  type: AppointmentType;
  preferredDate?: Date;
  duration: number;
  priority: WaitlistPriority;
  reason: string;
  notes?: string;
}

/**
 * Availability Form Data
 * Type-safe form data for nurse availability
 */
export interface AvailabilityFormData {
  nurseId: string;
  dayOfWeek?: number;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
  specificDate?: Date;
  isAvailable: boolean;
  reason?: string;
}

// =====================
// UTILITY TYPES
// =====================

/**
 * Appointment with Populated Relations
 * Fully populated appointment with all associations
 */
export interface PopulatedAppointment extends Appointment {
  student: Student;
  nurse: User;
  reminders: AppointmentReminder[];
}

/**
 * Waitlist Entry with Populated Relations
 * Fully populated waitlist entry with all associations
 */
export interface PopulatedWaitlistEntry extends AppointmentWaitlist {
  student: Student;
  nurse?: User;
}

/**
 * Appointment Calendar Event
 * Formatted appointment data for calendar display
 */
export interface AppointmentCalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  extendedProps: {
    appointment: Appointment;
    studentName: string;
    nurseName: string;
  };
}

/**
 * Appointment Time Slot
 * Represents a bookable time slot
 */
export interface AppointmentTimeSlot {
  startTime: string; // ISO 8601 datetime
  endTime: string; // ISO 8601 datetime
  isAvailable: boolean;
  nurseId: string;
  nurseName: string;
  conflictReason?: string;
}

/**
 * Appointment Notification Data
 * Data for sending appointment notifications
 */
export interface AppointmentNotification {
  appointmentId: string;
  recipientType: 'student' | 'parent' | 'nurse';
  channel: MessageType;
  message: string;
  urgent?: boolean;
}

// =====================
// TYPE GUARDS
// =====================

/**
 * Type guard to check if an appointment is upcoming
 */
export const isUpcomingAppointment = (appointment: Appointment): boolean => {
  return (
    appointment.status === AppointmentStatus.SCHEDULED &&
    new Date(appointment.scheduledAt) > new Date()
  );
};

/**
 * Type guard to check if an appointment can be cancelled
 */
export const isCancellable = (appointment: Appointment): boolean => {
  return (
    appointment.status === AppointmentStatus.SCHEDULED ||
    appointment.status === AppointmentStatus.IN_PROGRESS
  );
};

/**
 * Type guard to check if a waitlist entry is active
 */
export const isActiveWaitlistEntry = (entry: AppointmentWaitlist): boolean => {
  return (
    entry.status === WaitlistStatus.WAITING &&
    new Date(entry.expiresAt) > new Date()
  );
};

// =====================
// HELPER FUNCTIONS
// =====================

/**
 * Get appointment duration end time
 */
export const getAppointmentEndTime = (appointment: Appointment): Date => {
  const startTime = new Date(appointment.scheduledAt);
  return new Date(startTime.getTime() + appointment.duration * 60000);
};

/**
 * Format appointment type for display
 */
export const formatAppointmentType = (type: AppointmentType): string => {
  return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};

/**
 * Get status color for display
 */
export const getAppointmentStatusColor = (status: AppointmentStatus): string => {
  const colorMap: Record<AppointmentStatus, string> = {
    [AppointmentStatus.SCHEDULED]: '#3b82f6', // blue
    [AppointmentStatus.IN_PROGRESS]: '#f59e0b', // amber
    [AppointmentStatus.COMPLETED]: '#10b981', // green
    [AppointmentStatus.CANCELLED]: '#6b7280', // gray
    [AppointmentStatus.NO_SHOW]: '#ef4444', // red
  };
  return colorMap[status] || '#6b7280';
};

/**
 * Get priority color for display
 */
export const getWaitlistPriorityColor = (priority: WaitlistPriority): string => {
  const colorMap: Record<WaitlistPriority, string> = {
    [WaitlistPriority.LOW]: '#10b981', // green
    [WaitlistPriority.NORMAL]: '#3b82f6', // blue
    [WaitlistPriority.HIGH]: '#f59e0b', // amber
    [WaitlistPriority.URGENT]: '#ef4444', // red
  };
  return colorMap[priority] || '#6b7280';
};

// =====================
// VALIDATION HELPERS
// =====================

/**
 * Validate appointment duration
 */
export const validateDuration = (duration: number): { valid: boolean; error?: string } => {
  if (duration < APPOINTMENT_VALIDATION.DURATION.MIN) {
    return {
      valid: false,
      error: `Duration must be at least ${APPOINTMENT_VALIDATION.DURATION.MIN} minutes`
    };
  }
  if (duration > APPOINTMENT_VALIDATION.DURATION.MAX) {
    return {
      valid: false,
      error: `Duration cannot exceed ${APPOINTMENT_VALIDATION.DURATION.MAX} minutes`
    };
  }
  if (duration % APPOINTMENT_VALIDATION.DURATION.INCREMENT !== 0) {
    return {
      valid: false,
      error: `Duration must be in ${APPOINTMENT_VALIDATION.DURATION.INCREMENT}-minute increments`
    };
  }
  return { valid: true };
};

/**
 * Validate appointment is in the future
 */
export const validateFutureDateTime = (scheduledAt: Date): { valid: boolean; error?: string } => {
  const now = new Date();
  if (scheduledAt <= now) {
    return {
      valid: false,
      error: 'Appointment must be scheduled for a future date and time'
    };
  }
  return { valid: true };
};

/**
 * Validate appointment is within business hours
 */
export const validateBusinessHours = (
  scheduledAt: Date,
  duration: number
): { valid: boolean; error?: string } => {
  const hour = scheduledAt.getHours();
  const minutes = scheduledAt.getMinutes();
  const totalMinutes = hour * 60 + minutes;

  const startMinutes = APPOINTMENT_VALIDATION.BUSINESS_HOURS.START * 60;
  const endMinutes = APPOINTMENT_VALIDATION.BUSINESS_HOURS.END * 60;

  if (totalMinutes < startMinutes) {
    return {
      valid: false,
      error: `Appointments must be scheduled after ${APPOINTMENT_VALIDATION.BUSINESS_HOURS.START}:00 AM`
    };
  }

  const appointmentEndMinutes = totalMinutes + duration;
  if (appointmentEndMinutes > endMinutes) {
    return {
      valid: false,
      error: `Appointments must end by ${APPOINTMENT_VALIDATION.BUSINESS_HOURS.END}:00 PM`
    };
  }

  return { valid: true };
};

/**
 * Validate appointment is not on weekend
 */
export const validateNotWeekend = (scheduledAt: Date): { valid: boolean; error?: string } => {
  const dayOfWeek = scheduledAt.getDay();
  if (APPOINTMENT_VALIDATION.WEEKEND_DAYS.includes(dayOfWeek as 0 | 6)) {
    return {
      valid: false,
      error: 'Appointments cannot be scheduled on weekends'
    };
  }
  return { valid: true };
};

/**
 * Validate status transition is allowed
 */
export const validateStatusTransition = (
  currentStatus: AppointmentStatus,
  newStatus: AppointmentStatus
): { valid: boolean; error?: string } => {
  const allowedTransitions = APPOINTMENT_STATUS_TRANSITIONS[currentStatus] || [];
  if (!allowedTransitions.includes(newStatus)) {
    return {
      valid: false,
      error: `Cannot transition from ${currentStatus} to ${newStatus}. Allowed: ${allowedTransitions.join(', ') || 'none'}`
    };
  }
  return { valid: true };
};

/**
 * Validate cancellation notice period
 */
export const validateCancellationNotice = (scheduledAt: Date): { valid: boolean; error?: string } => {
  const now = new Date();
  const hoursUntilAppointment = (scheduledAt.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursUntilAppointment < APPOINTMENT_VALIDATION.CANCELLATION.MIN_HOURS_NOTICE) {
    return {
      valid: false,
      error: `Appointments must be cancelled at least ${APPOINTMENT_VALIDATION.CANCELLATION.MIN_HOURS_NOTICE} hours in advance`
    };
  }
  return { valid: true };
};

/**
 * Comprehensive appointment validation
 */
export const validateAppointmentData = (data: {
  scheduledAt: Date;
  duration: number;
  type: AppointmentType;
  reason: string;
}): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Validate duration
  const durationResult = validateDuration(data.duration);
  if (!durationResult.valid && durationResult.error) {
    errors.push(durationResult.error);
  }

  // Validate future date
  const futureResult = validateFutureDateTime(data.scheduledAt);
  if (!futureResult.valid && futureResult.error) {
    errors.push(futureResult.error);
  }

  // Validate not weekend
  const weekendResult = validateNotWeekend(data.scheduledAt);
  if (!weekendResult.valid && weekendResult.error) {
    errors.push(weekendResult.error);
  }

  // Validate business hours
  const businessHoursResult = validateBusinessHours(data.scheduledAt, data.duration);
  if (!businessHoursResult.valid && businessHoursResult.error) {
    errors.push(businessHoursResult.error);
  }

  // Validate reason
  if (!data.reason || data.reason.trim().length < 3) {
    errors.push('Appointment reason must be at least 3 characters');
  }
  if (data.reason && data.reason.length > 500) {
    errors.push('Appointment reason cannot exceed 500 characters');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Get available duration options for dropdown
 */
export const getAvailableDurations = (): number[] => {
  const durations: number[] = [];
  for (
    let duration = APPOINTMENT_VALIDATION.DURATION.MIN;
    duration <= APPOINTMENT_VALIDATION.DURATION.MAX;
    duration += APPOINTMENT_VALIDATION.DURATION.INCREMENT
  ) {
    durations.push(duration);
  }
  return durations;
};

/**
 * Check if appointment can be cancelled
 */
export const canCancelAppointment = (appointment: Appointment): { canCancel: boolean; reason?: string } => {
  // Check status
  if (appointment.status !== AppointmentStatus.SCHEDULED &&
      appointment.status !== AppointmentStatus.IN_PROGRESS) {
    return {
      canCancel: false,
      reason: `Cannot cancel appointment with status ${appointment.status}`
    };
  }

  // Check cancellation notice
  const noticeResult = validateCancellationNotice(new Date(appointment.scheduledAt));
  if (!noticeResult.valid) {
    return {
      canCancel: false,
      reason: noticeResult.error
    };
  }

  return { canCancel: true };
};

/**
 * Check if appointment can be started
 */
export const canStartAppointment = (appointment: Appointment): { canStart: boolean; reason?: string } => {
  if (appointment.status !== AppointmentStatus.SCHEDULED) {
    return {
      canStart: false,
      reason: `Cannot start appointment with status ${appointment.status}`
    };
  }

  // Check if not more than 1 hour early
  const now = new Date();
  const scheduledTime = new Date(appointment.scheduledAt);
  const oneHourEarly = new Date(scheduledTime.getTime() - 60 * 60 * 1000);

  if (now < oneHourEarly) {
    return {
      canStart: false,
      reason: 'Cannot start appointment more than 1 hour before scheduled time'
    };
  }

  return { canStart: true };
};

/**
 * Check if appointment can be completed
 */
export const canCompleteAppointment = (appointment: Appointment): { canComplete: boolean; reason?: string } => {
  if (appointment.status !== AppointmentStatus.IN_PROGRESS) {
    return {
      canComplete: false,
      reason: `Cannot complete appointment with status ${appointment.status}. Must be IN_PROGRESS`
    };
  }

  return { canComplete: true };
};
