/**
 * Phone Number Validation Schemas
 *
 * Reusable Zod schemas for phone number validation.
 * Supports US phone numbers in various formats.
 */

import { z } from 'zod';

/**
 * US phone number regex patterns
 * Accepts formats: (123) 456-7890, 123-456-7890, 1234567890, +1 123-456-7890
 */
const PHONE_REGEX = /^(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}$/;

/**
 * Standard phone number schema
 * Validates US phone numbers in common formats
 */
export const phoneSchema = z
  .string({ required_error: 'Phone number is required' })
  .regex(PHONE_REGEX, 'Please enter a valid US phone number')
  .trim()
  .transform((val) => {
    // Normalize to digits only
    return val.replace(/\D/g, '');
  })
  .refine((val) => val.length === 10 || val.length === 11, {
    message: 'Phone number must be 10 or 11 digits'
  });

/**
 * Optional phone number schema
 */
export const optionalPhoneSchema = z
  .string()
  .trim()
  .regex(PHONE_REGEX, 'Please enter a valid US phone number')
  .transform((val) => val.replace(/\D/g, ''))
  .optional()
  .nullable();

/**
 * Emergency contact phone - stricter validation, required
 */
export const emergencyPhoneSchema = z
  .string({ required_error: 'Emergency phone number is required' })
  .min(10, 'Emergency phone number is required')
  .regex(PHONE_REGEX, 'Please enter a valid emergency contact phone number')
  .trim()
  .transform((val) => val.replace(/\D/g, ''))
  .refine((val) => val.length === 10 || val.length === 11, {
    message: 'Emergency phone must be 10 or 11 digits'
  });

/**
 * Phone extension schema (optional)
 */
export const phoneExtensionSchema = z
  .string()
  .regex(/^\d{1,6}$/, 'Extension must be 1-6 digits')
  .optional()
  .nullable();

/**
 * Full phone with extension schema
 */
export const phoneWithExtensionSchema = z.object({
  phone: phoneSchema,
  extension: phoneExtensionSchema
});

/**
 * Helper function to format phone number for display
 * Converts 1234567890 to (123) 456-7890
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }

  return phone;
}

/**
 * Type exports
 */
export type Phone = z.infer<typeof phoneSchema>;
export type PhoneWithExtension = z.infer<typeof phoneWithExtensionSchema>;
