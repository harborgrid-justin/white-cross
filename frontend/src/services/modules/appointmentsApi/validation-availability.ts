/**
 * Appointments API - Availability Validation Schemas
 *
 * Zod validation schemas for nurse availability management.
 * Provides validation for recurring and one-time availability slots.
 *
 * @module services/modules/appointmentsApi/validation-availability
 */

import { z } from 'zod';
import { APPOINTMENT_VALIDATION } from './types';

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
