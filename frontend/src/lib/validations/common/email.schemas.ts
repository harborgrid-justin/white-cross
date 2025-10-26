/**
 * Email Validation Schemas
 *
 * Reusable Zod schemas for email validation.
 */

import { z } from 'zod';

/**
 * Standard email schema
 */
export const emailSchema = z
  .string({ required_error: 'Email address is required' })
  .min(1, 'Email address is required')
  .email('Please enter a valid email address')
  .max(255, 'Email address must be less than 255 characters')
  .toLowerCase()
  .trim();

/**
 * Optional email schema
 */
export const optionalEmailSchema = z
  .string()
  .email('Please enter a valid email address')
  .max(255, 'Email address must be less than 255 characters')
  .toLowerCase()
  .trim()
  .optional()
  .nullable()
  .or(z.literal(''));

/**
 * Multiple emails schema (comma-separated)
 * Example: "user1@example.com, user2@example.com"
 */
export const multipleEmailsSchema = z
  .string()
  .trim()
  .refine(
    (val) => {
      if (!val) return true;
      const emails = val.split(',').map(e => e.trim());
      return emails.every(email => z.string().email().safeParse(email).success);
    },
    { message: 'All email addresses must be valid (separate with commas)' }
  )
  .transform((val) => {
    if (!val) return [];
    return val.split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
  });

/**
 * Work email schema (optional domain restrictions)
 */
export const workEmailSchema = z
  .string({ required_error: 'Work email is required' })
  .email('Please enter a valid work email address')
  .max(255, 'Email address must be less than 255 characters')
  .toLowerCase()
  .trim()
  .refine(
    (email) => {
      // Reject common free email providers for work emails
      const freeProviders = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
      const domain = email.split('@')[1];
      return !freeProviders.includes(domain);
    },
    { message: 'Please use your work email address (not a personal email)' }
  );

/**
 * Type exports
 */
export type Email = z.infer<typeof emailSchema>;
export type MultipleEmails = z.infer<typeof multipleEmailsSchema>;
