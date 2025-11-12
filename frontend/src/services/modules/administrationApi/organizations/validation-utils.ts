/**
 * Validation utility functions for organizations module
 *
 * Provides shared validation error handling to reduce code duplication
 * across district and school services.
 *
 * @module services/modules/administrationApi/organizations/validation-utils
 */

import { z, type ZodIssue } from 'zod';
import { createValidationError } from '../../../core/errors';

/**
 * Convert Zod errors to validation error format
 * Reduces code duplication across service methods
 */
export function handleZodValidationError(error: z.ZodError): never {
  throw createValidationError(
    error.issues[0]?.message || 'Validation error',
    error.issues[0]?.path.join('.'),
    error.issues.reduce((acc: Record<string, string[]>, err: ZodIssue) => {
      const path = err.path.join('.');
      if (!acc[path]) acc[path] = [];
      acc[path].push(err.message);
      return acc;
    }, {} as Record<string, string[]>),
    error
  );
}
