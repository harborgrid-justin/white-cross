/**
 * @fileoverview Zod Error Formatting Utilities
 * @module lib/helpers/zod-errors
 *
 * Provides utilities for formatting Zod validation errors into
 * consistent error structures for server actions.
 */

import type { ZodError } from 'zod';
import type { FieldErrors } from '../types/action-result';

/**
 * Format Zod validation errors into field errors object
 *
 * Converts Zod's error format into a simple field -> messages mapping
 * that can be used in server action responses.
 *
 * @param error - Zod validation error
 * @returns Field errors object mapping field names to error message arrays
 *
 * @example
 * const schema = z.object({
 *   email: z.string().email(),
 *   password: z.string().min(8)
 * });
 *
 * const result = schema.safeParse({ email: 'invalid', password: '123' });
 * if (!result.success) {
 *   const errors = formatZodErrors(result.error);
 *   // Returns: {
 *   //   email: ["Invalid email"],
 *   //   password: ["String must contain at least 8 character(s)"]
 *   // }
 * }
 */
export function formatZodErrors(error: ZodError): FieldErrors {
  const flattened = error.flatten();
  return flattened.fieldErrors as FieldErrors;
}

/**
 * Extract form-level errors from Zod error
 *
 * Gets errors that don't apply to specific fields (formErrors)
 *
 * @param error - Zod validation error
 * @returns Array of form-level error messages
 */
export function extractFormErrors(error: ZodError): string[] {
  const flattened = error.flatten();
  return flattened.formErrors || [];
}

/**
 * Check if Zod error has any field errors
 *
 * @param error - Zod validation error
 * @returns True if there are field-specific errors
 */
export function hasFieldErrors(error: ZodError): boolean {
  const formatted = formatZodErrors(error);
  return Object.keys(formatted).length > 0;
}
