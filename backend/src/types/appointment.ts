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

export type AppointmentType =
  | 'ROUTINE_CHECKUP'
  | 'MEDICATION_ADMINISTRATION'
  | 'INJURY_ASSESSMENT'
  | 'ILLNESS_EVALUATION'
  | 'FOLLOW_UP'
  | 'SCREENING'
  | 'EMERGENCY';

export type AppointmentStatus =
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW';

export type ReminderType = 'sms' | 'email' | 'voice';

export type WaitlistPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

export type RecurrenceFrequency = 'daily' | 'weekly' | 'monthly';

export interface CreateAppointmentData {
  studentId: string;
  nurseId: string;
  appointmentType: AppointmentType;
  scheduledDate: Date;
  duration?: number; // minutes, defaults to 30
  reason?: string; // Optional in database
  notes?: string;
}

export interface UpdateAppointmentData {
  appointmentType?: AppointmentType;
  scheduledDate?: Date;
  duration?: number;
  reason?: string;
  notes?: string;
  status?: AppointmentStatus;
}

export interface AppointmentFilters {
  nurseId?: string;
  studentId?: string;
  status?: AppointmentStatus;
  appointmentType?: AppointmentType;
  dateFrom?: Date;
  dateTo?: Date;
}

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

export interface ReminderData {
  appointmentId: string;
  type: ReminderType;
  scheduleTime: Date; // When to send the reminder
  message?: string;
}

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

export interface RecurrencePattern {
  frequency: RecurrenceFrequency;
  interval: number; // every N days/weeks/months
  endDate: Date;
  daysOfWeek?: number[]; // for weekly: 0=Sunday, 1=Monday, etc.
}
