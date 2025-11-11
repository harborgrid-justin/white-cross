/**
 * WF-COMP-317 | appointments/core.ts - Core appointment types and enums
 * Purpose: Core appointment system types, enums, and entities
 * Upstream: React, external libs | Dependencies: React ecosystem
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: enums, interfaces, constants | Key Features: Core appointment types
 * Last Updated: 2025-11-11 | File Type: .ts
 * Critical Path: Type definitions → Component props → State management → API calls
 * LLM Context: Core appointment types module, part of modular architecture
 */

/**
 * Core Appointment Types Module
 * Essential type definitions for the White Cross appointment scheduling system
 * Aligned with backend services and database schema
 */

import type { BaseEntity, User } from '../../core/common';

// To avoid circular dependencies, we define minimal type references here
// rather than importing full Student type
export type StudentReference = {
  id: string;
  firstName: string;
  lastName: string;
  studentNumber: string;
};

export type UserReference = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

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
  [AppointmentStatus.SCHEDULED]: [AppointmentStatus.IN_PROGRESS, AppointmentStatus.CANCELLED, AppointmentStatus.NO_SHOW],
  [AppointmentStatus.IN_PROGRESS]: [AppointmentStatus.COMPLETED, AppointmentStatus.CANCELLED],
  [AppointmentStatus.COMPLETED]: [],
  [AppointmentStatus.CANCELLED]: [],
  [AppointmentStatus.NO_SHOW]: [],
} as const;

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
  student?: StudentReference;
  nurse?: UserReference;
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
  student?: StudentReference;
  nurse?: UserReference;
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
  nurse?: UserReference;
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

// =====================
// UTILITY TYPES
// =====================

/**
 * Appointment with Populated Relations
 * Fully populated appointment with all associations
 */
export interface PopulatedAppointment extends Appointment {
  student: StudentReference;
  nurse: User;
  reminders: AppointmentReminder[];
}

/**
 * Waitlist Entry with Populated Relations
 * Fully populated waitlist entry with all associations
 */
export interface PopulatedWaitlistEntry extends AppointmentWaitlist {
  student: StudentReference;
  nurse?: UserReference;
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
