/**
 * @fileoverview Standardized Server Action Result Types
 * @module lib/types/action-result
 *
 * Provides consistent type definitions for all server action results,
 * ensuring uniform error handling and success responses across the application.
 */

/**
 * Field-level validation errors
 * Maps field names to arrays of error messages
 *
 * @example
 * {
 *   email: ["Invalid email format"],
 *   password: ["Too short", "Must contain uppercase"]
 * }
 */
export interface FieldErrors {
  [field: string]: string[];
}

/**
 * Form-level validation errors
 * Errors that apply to the entire form rather than specific fields
 *
 * @example
 * ["Invalid credentials", "Account locked"]
 */
export type FormErrors = string[];

/**
 * Standardized server action result
 *
 * This is the canonical return type for all server actions.
 * It provides consistent error handling and success responses.
 *
 * @template T - The type of data returned on success
 *
 * @example Success Response
 * {
 *   success: true,
 *   data: { user: {...}, token: "..." },
 *   message: "Login successful"
 * }
 *
 * @example Validation Error Response
 * {
 *   success: false,
 *   fieldErrors: {
 *     email: ["Invalid email format"],
 *     password: ["Password too short"]
 *   },
 *   timestamp: "2025-11-04T18:42:00Z"
 * }
 *
 * @example Form Error Response
 * {
 *   success: false,
 *   formErrors: ["Invalid credentials"],
 *   timestamp: "2025-11-04T18:42:00Z"
 * }
 */
export interface ServerActionResult<T = void> {
  /** Whether the action succeeded */
  success: boolean;

  /** Data returned on success */
  data?: T;

  /** Optional success message */
  message?: string;

  /** Field-level validation errors */
  fieldErrors?: FieldErrors;

  /** Form-level errors */
  formErrors?: FormErrors;

  /** ISO timestamp of the response */
  timestamp?: string;
}

/**
 * Legacy form state types for backward compatibility
 * These match the existing LoginFormState and ChangePasswordFormState patterns
 */

/**
 * Login form state (legacy compatibility)
 */
export interface LoginFormState {
  errors?: {
    email?: string[];
    password?: string[];
    _form?: string[];
  };
  success?: boolean;
}

/**
 * Change password form state (legacy compatibility)
 */
export interface ChangePasswordFormState {
  errors?: {
    currentPassword?: string[];
    newPassword?: string[];
    confirmPassword?: string[];
    _form?: string[];
  };
  success?: boolean;
  message?: string;
}

/**
 * Rate limit information
 */
export interface RateLimitInfo {
  /** Whether the request is rate limited */
  limited: boolean;

  /** Number of requests remaining */
  remaining?: number;

  /** Time until reset (seconds) */
  resetIn?: number;

  /** Limit key that was checked */
  key?: string;
}
