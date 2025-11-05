/**
 * @fileoverview Server Action Result Builder Helpers
 * @module lib/helpers/action-result
 *
 * Provides builder functions for creating standardized server action results.
 * Ensures consistent response format across all server actions.
 */

import type { ServerActionResult, FieldErrors, FormErrors } from '../types/action-result';

/**
 * Create a successful action result
 *
 * @template T - Type of data being returned
 * @param data - Data to return
 * @param message - Optional success message
 * @returns Standardized success result
 *
 * @example
 * return actionSuccess({ userId: '123' }, 'User created successfully');
 */
export function actionSuccess<T>(
  data?: T,
  message?: string
): ServerActionResult<T> {
  return {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Create an error action result with form-level errors
 *
 * @param formErrors - Array of form-level error messages
 * @param fieldErrors - Optional field-level errors
 * @returns Standardized error result
 *
 * @example
 * return actionError(['Invalid credentials']);
 */
export function actionError(
  formErrors: FormErrors,
  fieldErrors?: FieldErrors
): ServerActionResult {
  return {
    success: false,
    formErrors,
    fieldErrors,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Create an error action result with field-level validation errors
 *
 * @param fieldErrors - Field-level validation errors
 * @param formErrors - Optional form-level errors
 * @returns Standardized validation error result
 *
 * @example
 * return actionValidationError({
 *   email: ['Invalid email format'],
 *   password: ['Password too short']
 * });
 */
export function actionValidationError(
  fieldErrors: FieldErrors,
  formErrors?: FormErrors
): ServerActionResult {
  return {
    success: false,
    fieldErrors,
    formErrors,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Create a rate limit error result
 *
 * @param resetIn - Seconds until rate limit resets
 * @returns Standardized rate limit error result
 *
 * @example
 * return actionRateLimitError(900); // 15 minutes
 */
export function actionRateLimitError(resetIn: number): ServerActionResult {
  const minutes = Math.ceil(resetIn / 60);
  return {
    success: false,
    formErrors: [`Too many attempts. Please try again in ${minutes} minute${minutes !== 1 ? 's' : ''}.`],
    timestamp: new Date().toISOString(),
  };
}

/**
 * Create an unauthorized error result
 *
 * @param message - Optional custom message
 * @returns Standardized unauthorized error result
 */
export function actionUnauthorized(message?: string): ServerActionResult {
  return {
    success: false,
    formErrors: [message || 'You must be logged in to perform this action'],
    timestamp: new Date().toISOString(),
  };
}

/**
 * Create a CSRF error result
 *
 * @returns Standardized CSRF error result
 */
export function actionCsrfError(): ServerActionResult {
  return {
    success: false,
    formErrors: ['Invalid or missing security token. Please refresh the page and try again.'],
    timestamp: new Date().toISOString(),
  };
}

/**
 * Convert ServerActionResult to legacy LoginFormState format
 *
 * @param result - Server action result
 * @returns Legacy login form state
 */
export function toLoginFormState(result: ServerActionResult): {
  success?: boolean;
  errors?: {
    email?: string[];
    password?: string[];
    _form?: string[];
  };
} {
  if (result.success) {
    return { success: true };
  }

  const errors: any = {};

  if (result.fieldErrors) {
    Object.assign(errors, result.fieldErrors);
  }

  if (result.formErrors) {
    errors._form = result.formErrors;
  }

  return { errors };
}

/**
 * Convert ServerActionResult to legacy ChangePasswordFormState format
 *
 * @param result - Server action result
 * @returns Legacy change password form state
 */
export function toChangePasswordFormState(result: ServerActionResult): {
  success?: boolean;
  message?: string;
  errors?: {
    currentPassword?: string[];
    newPassword?: string[];
    confirmPassword?: string[];
    _form?: string[];
  };
} {
  if (result.success) {
    return {
      success: true,
      message: result.message,
    };
  }

  const errors: any = {};

  if (result.fieldErrors) {
    Object.assign(errors, result.fieldErrors);
  }

  if (result.formErrors) {
    errors._form = result.formErrors;
  }

  return { errors };
}
