/**
 * Validation Utilities
 * Centralized validation error handling and helpers
 */

import { ZodError, ZodSchema } from 'zod';
import { createValidationError, ValidationError } from '../core/errors';

/**
 * Handle Zod validation errors consistently
 * Converts ZodError to our standardized ValidationError
 *
 * @param zodError - Zod validation error
 * @returns Never (always throws ValidationError)
 * @throws ValidationError with structured error information
 */
export function handleZodError(zodError: ZodError): never {
  const firstError = zodError.errors[0];

  if (!firstError) {
    throw createValidationError('Validation failed with no specific errors');
  }

  // Aggregate all errors by field path
  const validationErrors = zodError.errors.reduce((acc, err) => {
    const path = err.path.join('.') || 'root';
    if (!acc[path]) {
      acc[path] = [];
    }
    acc[path].push(err.message);
    return acc;
  }, {} as Record<string, string[]>);

  throw createValidationError(
    firstError.message,
    firstError.path.join('.') || 'root',
    validationErrors,
    zodError
  );
}

/**
 * Safe schema validation with proper error handling
 * Validates data against Zod schema and throws consistent errors
 *
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @param context - Optional context for better error messages
 * @returns Validated data with proper typing
 * @throws ValidationError if validation fails
 */
export function validateWithSchema<T>(
  schema: ZodSchema<T>,
  data: unknown,
  context?: string
): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      handleZodError(error);
    }

    // Re-throw non-Zod errors
    throw error;
  }
}

/**
 * Safe schema validation that returns result instead of throwing
 * Useful for optional validation scenarios
 *
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns Object with success flag and either data or error
 */
export function safeValidate<T>(
  schema: ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: ValidationError } {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof ZodError) {
      const firstError = error.errors[0];
      const validationErrors = error.errors.reduce((acc, err) => {
        const path = err.path.join('.') || 'root';
        if (!acc[path]) {
          acc[path] = [];
        }
        acc[path].push(err.message);
        return acc;
      }, {} as Record<string, string[]>);

      return {
        success: false,
        error: createValidationError(
          firstError?.message || 'Validation failed',
          firstError?.path.join('.') || 'root',
          validationErrors,
          error
        ),
      };
    }

    // For non-Zod errors, create a generic validation error
    return {
      success: false,
      error: createValidationError(
        error instanceof Error ? error.message : 'Unknown validation error'
      ),
    };
  }
}

/**
 * Validate required string parameter
 * Common validation for API method parameters
 *
 * @param value - Value to validate
 * @param paramName - Name of parameter for error message
 * @throws ValidationError if value is invalid
 */
export function validateRequiredString(
  value: unknown,
  paramName: string
): asserts value is string {
  if (!value || typeof value !== 'string' || value.trim().length === 0) {
    throw createValidationError(
      `${paramName} is required and must be a non-empty string`,
      paramName
    );
  }
}

/**
 * Validate required ID parameter
 * Common validation for UUID/ID parameters
 *
 * @param id - ID to validate
 * @param paramName - Name of parameter for error message
 * @throws ValidationError if ID is invalid
 */
export function validateRequiredId(
  id: unknown,
  paramName: string = 'id'
): asserts id is string {
  validateRequiredString(id, paramName);

  // Optional: Add UUID validation if all IDs are UUIDs
  // const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  // if (!uuidRegex.test(id)) {
  //   throw createValidationError(`${paramName} must be a valid UUID`, paramName);
  // }
}

/**
 * Validate required number parameter
 *
 * @param value - Value to validate
 * @param paramName - Name of parameter for error message
 * @param min - Optional minimum value
 * @param max - Optional maximum value
 * @throws ValidationError if value is invalid
 */
export function validateRequiredNumber(
  value: unknown,
  paramName: string,
  min?: number,
  max?: number
): asserts value is number {
  if (typeof value !== 'number' || isNaN(value)) {
    throw createValidationError(
      `${paramName} is required and must be a valid number`,
      paramName
    );
  }

  if (min !== undefined && value < min) {
    throw createValidationError(
      `${paramName} must be at least ${min}`,
      paramName
    );
  }

  if (max !== undefined && value > max) {
    throw createValidationError(
      `${paramName} must be at most ${max}`,
      paramName
    );
  }
}

/**
 * Validate optional string parameter
 * Validates if present, otherwise allows undefined/null
 *
 * @param value - Value to validate
 * @param paramName - Name of parameter for error message
 * @returns Validated string or undefined
 * @throws ValidationError if value is invalid (not undefined/null and not valid string)
 */
export function validateOptionalString(
  value: unknown,
  paramName: string
): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value === 'string') {
    return value;
  }

  throw createValidationError(
    `${paramName} must be a string if provided`,
    paramName
  );
}

/**
 * Validate array parameter
 *
 * @param value - Value to validate
 * @param paramName - Name of parameter for error message
 * @param minLength - Optional minimum array length
 * @throws ValidationError if value is invalid
 */
export function validateRequiredArray<T>(
  value: unknown,
  paramName: string,
  minLength?: number
): asserts value is T[] {
  if (!Array.isArray(value)) {
    throw createValidationError(
      `${paramName} must be an array`,
      paramName
    );
  }

  if (minLength !== undefined && value.length < minLength) {
    throw createValidationError(
      `${paramName} must contain at least ${minLength} item(s)`,
      paramName
    );
  }
}

/**
 * Validate enum value
 *
 * @param value - Value to validate
 * @param enumObject - Enum object to validate against
 * @param paramName - Name of parameter for error message
 * @throws ValidationError if value is not in enum
 */
export function validateEnum<T extends Record<string, any>>(
  value: unknown,
  enumObject: T,
  paramName: string
): asserts value is T[keyof T] {
  const validValues = Object.values(enumObject);

  if (!validValues.includes(value)) {
    throw createValidationError(
      `${paramName} must be one of: ${validValues.join(', ')}`,
      paramName
    );
  }
}

/**
 * Validate date parameter
 *
 * @param value - Value to validate
 * @param paramName - Name of parameter for error message
 * @param allowPast - Whether to allow past dates
 * @param allowFuture - Whether to allow future dates
 * @throws ValidationError if value is invalid
 */
export function validateDate(
  value: unknown,
  paramName: string,
  allowPast: boolean = true,
  allowFuture: boolean = true
): asserts value is string | Date {
  if (!value) {
    throw createValidationError(`${paramName} is required`, paramName);
  }

  let date: Date;

  if (value instanceof Date) {
    date = value;
  } else if (typeof value === 'string') {
    date = new Date(value);
  } else {
    throw createValidationError(
      `${paramName} must be a valid date string or Date object`,
      paramName
    );
  }

  if (isNaN(date.getTime())) {
    throw createValidationError(`${paramName} is not a valid date`, paramName);
  }

  const now = new Date();

  if (!allowPast && date < now) {
    throw createValidationError(
      `${paramName} cannot be in the past`,
      paramName
    );
  }

  if (!allowFuture && date > now) {
    throw createValidationError(
      `${paramName} cannot be in the future`,
      paramName
    );
  }
}
