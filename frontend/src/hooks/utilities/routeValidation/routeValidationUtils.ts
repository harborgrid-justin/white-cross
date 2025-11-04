/**
 * WF-COMP-350 | routeValidationUtils.ts - Validation utility functions
 * Purpose: Core validation and error handling utilities
 * Upstream: routeValidationTypes, routeValidationSchemas, routeValidationSecurity | Dependencies: zod
 * Downstream: Validation hooks | Called by: React components
 * Related: routeValidationHooks, routeValidationSchemas
 * Exports: Validation functions, sanitizers, error handlers | Key Features: Parameter validation
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Parameter input → Sanitization → Validation → Error handling
 * LLM Context: Core validation utilities for route parameters
 */

'use client';

import { z } from 'zod';
import { useRouter } from 'next/navigation';
import {
  ValidationResult,
  ValidationError,
  RouteValidationError,
} from './routeValidationTypes';
import {
  performSecurityChecks,
  sanitizeSpecialCharacters,
} from './routeValidationSecurity';

// =====================
// PARAMETER SANITIZATION
// =====================

/**
 * Sanitizes route parameters by performing security checks and cleaning values
 *
 * @param params - Raw route parameters
 * @returns Sanitized parameters object
 * @throws RouteValidationError if security threat detected
 *
 * @example
 * const params = { id: '123e4567-e89b-12d3-a456-426614174000', type: 'INJURY' };
 * const sanitized = sanitizeParams(params);
 */
export function sanitizeParams(
  params: Record<string, string | undefined>
): Record<string, string> {
  const sanitized: Record<string, string> = {};

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) {
      continue;
    }

    const stringValue = String(value);

    // Perform security checks
    performSecurityChecks(stringValue, key);

    // Sanitize the value
    sanitized[key] = sanitizeSpecialCharacters(stringValue);
  }

  return sanitized;
}

// =====================
// VALIDATION FUNCTIONS
// =====================

/**
 * Validates route parameters against a Zod schema
 *
 * @param params - Route parameters from useParams()
 * @param schema - Zod schema to validate against
 * @returns Validation result with typed data or error
 *
 * @example
 * const params = useParams();
 * const result = validateRouteParams(params, IncidentIdParamSchema);
 *
 * if (result.success) {
 *   console.log('Valid incident ID:', result.data.id);
 * } else {
 *   console.error('Validation error:', result.error);
 * }
 */
export function validateRouteParams<T>(
  params: Record<string, string | undefined>,
  schema: z.ZodSchema<T>
): ValidationResult<T> {
  try {
    // First sanitize params for security
    const sanitized = sanitizeParams(params);

    // Then validate against schema
    const result = schema.safeParse(sanitized);

    if (result.success) {
      return {
        success: true,
        data: result.data,
      };
    }

    // Convert Zod errors to ValidationErrors
    const validationErrors: ValidationError[] = result.error.issues.map((err: z.ZodIssue) => ({
      field: err.path.join('.') || 'unknown',
      message: err.message,
      code: err.code,
    }));

    const firstError = validationErrors[0];
    return {
      success: false,
      error: new RouteValidationError(
        firstError.message,
        firstError.field,
        'VALIDATION_ERROR',
        validationErrors
      ),
    };
  } catch (error) {
    if (error instanceof RouteValidationError) {
      return {
        success: false,
        error,
      };
    }

    return {
      success: false,
      error: new RouteValidationError(
        error instanceof Error ? error.message : 'Unknown validation error',
        'unknown',
        'VALIDATION_ERROR'
      ),
    };
  }
}

/**
 * Validates query parameters from URLSearchParams
 *
 * @param searchParams - URLSearchParams from useSearchParams()
 * @param schema - Zod schema to validate against
 * @returns Validation result with typed data or error
 *
 * @example
 * const [searchParams] = useSearchParams();
 * const result = validateQueryParams(searchParams, PaginationParamSchema);
 *
 * if (result.success) {
 *   console.log('Page:', result.data.page);
 *   console.log('Limit:', result.data.limit);
 * }
 */
export function validateQueryParams<T>(
  searchParams: URLSearchParams,
  schema: z.ZodSchema<T>
): ValidationResult<T> {
  const params: Record<string, string> = {};

  // Convert URLSearchParams to plain object
  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  return validateRouteParams(params, schema);
}

// =====================
// ERROR HANDLERS
// =====================

/**
 * Handles route validation errors with appropriate logging and user feedback
 *
 * @param error - RouteValidationError to handle
 * @param context - Additional context for logging (e.g., component name)
 *
 * @example
 * try {
 *   validateRouteParams(params, schema);
 * } catch (error) {
 *   if (error instanceof RouteValidationError) {
 *     handleValidationError(error, 'IncidentDetailPage');
 *   }
 * }
 */
export function handleValidationError(
  error: RouteValidationError,
  context?: string
): void {
  // Log error for debugging and audit trail
  const logData = {
    ...error.toJSON(),
    context,
    url: typeof window !== 'undefined' ? window.location.href : 'N/A',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A',
  };

  if (process.env.NODE_ENV === 'development') {
    console.error('[Route Validation Error]', logData);
  } else {
    // In production, send to logging service (e.g., Sentry)
    console.error('[Route Validation Error]', {
      message: error.message,
      code: error.code,
      field: error.field,
      context,
    });
  }

  // Could integrate with notification system here
  // Example: toast.error(error.userMessage);
}

/**
 * Redirects user to fallback route when validation fails
 *
 * @param error - RouteValidationError that occurred
 * @param fallbackRoute - Route to redirect to (default: '/')
 * @param router - Next.js router instance
 *
 * @example
 * const router = useRouter();
 * redirectOnInvalidParams(error, '/incidents', router);
 */
export function redirectOnInvalidParams(
  error: RouteValidationError,
  fallbackRoute: string = '/',
  router: ReturnType<typeof useRouter>
): void {
  handleValidationError(error, 'Redirect');
  // In Next.js, we can't pass state directly, so we encode error in URL
  const errorParam = encodeURIComponent(error.userMessage);
  router.replace(`${fallbackRoute}?error=${errorParam}`);
}
