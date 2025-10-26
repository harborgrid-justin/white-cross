/**
 * Date and Time Validation Schemas
 *
 * Reusable Zod schemas for date/time validation.
 */

import { z } from 'zod';

/**
 * ISO date string schema (YYYY-MM-DD)
 */
export const dateSchema = z
  .string({ required_error: 'Date is required' })
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in format YYYY-MM-DD')
  .refine((date) => !isNaN(Date.parse(date)), {
    message: 'Please enter a valid date'
  });

/**
 * Optional date schema
 */
export const optionalDateSchema = dateSchema.optional().nullable();

/**
 * ISO datetime string schema (YYYY-MM-DDTHH:MM)
 */
export const dateTimeSchema = z
  .string({ required_error: 'Date and time are required' })
  .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, 'Invalid datetime format')
  .refine((datetime) => !isNaN(Date.parse(datetime)), {
    message: 'Please enter a valid date and time'
  });

/**
 * Optional datetime schema
 */
export const optionalDateTimeSchema = dateTimeSchema.optional().nullable();

/**
 * Time string schema (HH:MM in 24-hour format)
 */
export const timeSchema = z
  .string({ required_error: 'Time is required' })
  .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Time must be in format HH:MM (24-hour)');

/**
 * Optional time schema
 */
export const optionalTimeSchema = timeSchema.optional().nullable();

/**
 * Date of birth schema with age validation
 * - Must be in the past
 * - Cannot be more than 120 years ago
 */
export const dateOfBirthSchema = z
  .string({ required_error: 'Date of birth is required' })
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in format YYYY-MM-DD')
  .refine((date) => !isNaN(Date.parse(date)), {
    message: 'Please enter a valid date of birth'
  })
  .refine((date) => new Date(date) < new Date(), {
    message: 'Date of birth must be in the past'
  })
  .refine((date) => {
    const birthDate = new Date(date);
    const maxAge = 120;
    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - maxAge);
    return birthDate > minDate;
  }, {
    message: 'Please enter a valid date of birth'
  });

/**
 * Student date of birth (0-25 years old)
 */
export const studentDateOfBirthSchema = dateOfBirthSchema
  .refine((date) => {
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 0 && age <= 25;
  }, {
    message: 'Student age must be between 0 and 25 years'
  });

/**
 * Future date schema (must be in the future)
 */
export const futureDateSchema = z
  .string({ required_error: 'Date is required' })
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in format YYYY-MM-DD')
  .refine((date) => !isNaN(Date.parse(date)), {
    message: 'Please enter a valid date'
  })
  .refine((date) => new Date(date) > new Date(), {
    message: 'Date must be in the future'
  });

/**
 * Past date schema (must be in the past)
 */
export const pastDateSchema = z
  .string({ required_error: 'Date is required' })
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in format YYYY-MM-DD')
  .refine((date) => !isNaN(Date.parse(date)), {
    message: 'Please enter a valid date'
  })
  .refine((date) => new Date(date) < new Date(), {
    message: 'Date must be in the past'
  });

/**
 * Date range schema
 */
export const dateRangeSchema = z
  .object({
    startDate: dateSchema,
    endDate: dateSchema
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: 'End date must be after start date',
    path: ['endDate']
  });

/**
 * DateTime range schema
 */
export const dateTimeRangeSchema = z
  .object({
    startDateTime: dateTimeSchema,
    endDateTime: dateTimeSchema
  })
  .refine((data) => new Date(data.endDateTime) > new Date(data.startDateTime), {
    message: 'End time must be after start time',
    path: ['endDateTime']
  });

/**
 * Helper function to calculate age from date of birth
 */
export function calculateAge(dateOfBirth: string): number {
  const birth = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

/**
 * Type exports
 */
export type DateRange = z.infer<typeof dateRangeSchema>;
export type DateTimeRange = z.infer<typeof dateTimeRangeSchema>;
