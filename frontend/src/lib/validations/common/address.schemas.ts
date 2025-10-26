/**
 * Address Validation Schemas
 *
 * Reusable Zod schemas for address validation across the application.
 * Supports US addresses with comprehensive validation rules.
 */

import { z } from 'zod';

/**
 * US State codes (2-letter abbreviations)
 */
export const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
] as const;

/**
 * Base address schema with all fields required
 */
export const addressSchema = z.object({
  street: z
    .string({ required_error: 'Street address is required' })
    .min(1, 'Street address is required')
    .max(200, 'Street address must be less than 200 characters')
    .trim(),

  street2: z
    .string()
    .max(200, 'Street address line 2 must be less than 200 characters')
    .trim()
    .optional()
    .nullable(),

  city: z
    .string({ required_error: 'City is required' })
    .min(1, 'City is required')
    .max(100, 'City must be less than 100 characters')
    .trim(),

  state: z
    .enum(US_STATES, {
      required_error: 'State is required',
      invalid_type_error: 'Invalid state code'
    }),

  zipCode: z
    .string({ required_error: 'ZIP code is required' })
    .regex(/^\d{5}(-\d{4})?$/, 'ZIP code must be in format 12345 or 12345-6789')
    .trim(),

  country: z
    .string()
    .default('US')
    .optional()
});

/**
 * Partial address schema where all fields are optional
 * Useful for filter/search forms
 */
export const partialAddressSchema = addressSchema.partial();

/**
 * Address schema with optional fields except street and city
 * Useful for less strict forms
 */
export const basicAddressSchema = z.object({
  street: z
    .string({ required_error: 'Street address is required' })
    .min(1, 'Street address is required')
    .max(200, 'Street address must be less than 200 characters')
    .trim(),

  street2: z.string().max(200).trim().optional().nullable(),

  city: z
    .string({ required_error: 'City is required' })
    .min(1, 'City is required')
    .max(100, 'City must be less than 100 characters')
    .trim(),

  state: z.string().max(50).optional().nullable(),
  zipCode: z.string().max(20).optional().nullable(),
  country: z.string().default('US').optional()
});

/**
 * Type exports for TypeScript
 */
export type Address = z.infer<typeof addressSchema>;
export type PartialAddress = z.infer<typeof partialAddressSchema>;
export type BasicAddress = z.infer<typeof basicAddressSchema>;
