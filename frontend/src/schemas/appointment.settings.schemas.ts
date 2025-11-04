/**
 * @fileoverview Appointment Settings and Report Schemas
 * @module schemas/appointment/settings
 *
 * Schemas for system-wide appointment settings, report generation,
 * and validation helper functions. Configures default behaviors and constraints.
 */

import { z } from 'zod';
import {
  studentIdSchema,
  nurseIdSchema,
  dateFieldSchema,
  durationSchema,
  workingHoursSchema,
  WORKING_DAYS,
  REPORT_TYPES,
  REPORT_FORMATS,
} from './appointment.base.schemas';
import { reminderSettingsSchema } from './appointment.reminder.schemas';

// ==========================================
// REPORT SCHEMAS
// ==========================================

/**
 * Appointment Report Schema
 * Generates analytical reports for various appointment metrics
 */
export const appointmentReportSchema = z.object({
  reportType: z.enum(REPORT_TYPES),
  startDate: dateFieldSchema,
  endDate: dateFieldSchema,
  nurseId: nurseIdSchema.optional(),
  studentId: studentIdSchema.optional(),
  appointmentType: z.string().optional(),
  format: z.enum(REPORT_FORMATS).default('pdf'),
  includeCharts: z.boolean().default(true),
});

export type AppointmentReportInput = z.infer<typeof appointmentReportSchema>;

// ==========================================
// SETTINGS SCHEMAS
// ==========================================

/**
 * Appointment Settings Schema
 * System-wide configuration for appointment management
 */
export const appointmentSettingsSchema = z.object({
  defaultDuration: durationSchema.default(30),
  defaultReminderSettings: reminderSettingsSchema,
  allowOnlineScheduling: z.boolean().default(false),
  requireParentConsent: z.boolean().default(true),
  autoConfirmAppointments: z.boolean().default(false),
  enableWaitlist: z.boolean().default(true),
  workingHours: workingHoursSchema,
  workingDays: z
    .array(z.enum(WORKING_DAYS))
    .min(1, 'At least one working day must be selected'),
  bufferTime: z.number().int().min(0).max(60).default(5), // Minutes between appointments
});

export type AppointmentSettings = z.infer<typeof appointmentSettingsSchema>;

// ==========================================
// VALIDATION REFINEMENTS
// ==========================================

/**
 * Refinement: Ensure report date range is logical
 */
export const appointmentReportSchemaWithValidation = appointmentReportSchema.refine(
  (data) => {
    return data.startDate <= data.endDate;
  },
  {
    message: 'Report end date must be on or after start date',
    path: ['endDate'],
  }
);

export type AppointmentReportInputValidated = z.infer<
  typeof appointmentReportSchemaWithValidation
>;

/**
 * Refinement: Ensure working hours are logical
 */
export const appointmentSettingsSchemaWithValidation = appointmentSettingsSchema.refine(
  (data) => {
    return data.workingHours.start < data.workingHours.end;
  },
  {
    message: 'Working hours end time must be after start time',
    path: ['workingHours', 'end'],
  }
);

export type AppointmentSettingsValidated = z.infer<typeof appointmentSettingsSchemaWithValidation>;

// ==========================================
// VALIDATION HELPERS
// ==========================================

/**
 * Validate appointment date is not in the past
 * @param dateString - Date in YYYY-MM-DD format
 * @returns True if date is today or in the future
 */
export const validateFutureDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
};

/**
 * Validate appointment time is within working hours
 * @param time - Time in HH:MM format
 * @param workingHours - Start and end times for working hours
 * @returns True if time falls within working hours
 */
export const validateWorkingHours = (
  time: string,
  workingHours: { start: string; end: string }
): boolean => {
  return time >= workingHours.start && time <= workingHours.end;
};

/**
 * Validate appointment is scheduled on a working day
 * @param dateString - Date in YYYY-MM-DD format
 * @param workingDays - Array of working day names
 * @returns True if the date falls on a working day
 */
export const validateWorkingDay = (
  dateString: string,
  workingDays: readonly string[]
): boolean => {
  const date = new Date(dateString);
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayName = dayNames[date.getDay()];
  return workingDays.includes(dayName);
};

/**
 * Calculate end time given start time and duration
 * @param startTime - Start time in HH:MM format
 * @param durationMinutes - Duration in minutes
 * @returns End time in HH:MM format
 */
export const calculateEndTime = (startTime: string, durationMinutes: number): string => {
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + durationMinutes;
  const endHours = Math.floor(totalMinutes / 60) % 24;
  const endMinutes = totalMinutes % 60;
  return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
};
