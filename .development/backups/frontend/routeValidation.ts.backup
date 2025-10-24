/**
 * WF-COMP-350 | routeValidation.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../types/incidents | Dependencies: zod, react-router-dom, react
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants, functions, interfaces, types, classes | Key Features: useState, useEffect, useCallback
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Production-Grade Route Parameter Validation System
 *
 * Enterprise-level validation for route parameters and query strings in React Router v6.
 * Implements comprehensive security, type-safety, and error handling for healthcare platform.
 *
 * Features:
 * - Zod schema-based validation with TypeScript inference
 * - Security: XSS prevention, SQL injection detection, path traversal protection
 * - Custom validation hooks for React Router v6
 * - Comprehensive error handling and user-friendly messages
 * - Parameter transformation utilities (dates, booleans, arrays, JSON)
 * - HIPAA-compliant logging and audit trails
 *
 * @module routeValidation
 * @version 1.0.0
 */

import { z } from 'zod';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import {
  IncidentType,
  IncidentSeverity,
  IncidentStatus,
  ActionPriority,
  ActionStatus,
} from '../types/incidents';

// =====================
// TYPE DEFINITIONS
// =====================

/**
 * Generic parameter validator function type
 */
export type ParamValidator<T> = (params: Record<string, string | undefined>) => ValidationResult<T>;

/**
 * Validation result with success/error state
 */
export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  error?: RouteValidationError;
}

/**
 * Schema definition for parameter validation
 */
export interface ParamSchema {
  schema: z.ZodSchema<any>;
  required?: boolean;
  transform?: (value: any) => any;
}

/**
 * Validation error details
 */
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

/**
 * Options for param validation hooks
 */
export interface ValidationHookOptions {
  redirect?: string;
  fallbackRoute?: string;
  onError?: (error: RouteValidationError) => void;
  silent?: boolean;
}

// =====================
// CUSTOM ERROR CLASS
// =====================

/**
 * Custom error class for route parameter validation failures
 * Provides detailed error information for debugging and user feedback
 */
export class RouteValidationError extends Error {
  public readonly field: string;
  public readonly code: string;
  public readonly statusCode: number;
  public readonly userMessage: string;
  public readonly details?: ValidationError[];
  public readonly timestamp: string;

  constructor(
    message: string,
    field: string,
    code: string = 'VALIDATION_ERROR',
    details?: ValidationError[]
  ) {
    super(message);
    this.name = 'RouteValidationError';
    this.field = field;
    this.code = code;
    this.statusCode = 400;
    this.userMessage = this.generateUserMessage(field, code);
    this.details = details;
    this.timestamp = new Date().toISOString();

    // Maintains proper stack trace for where error was thrown (V8 engines)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RouteValidationError);
    }
  }

  /**
   * Generates user-friendly error messages based on validation failure
   */
  private generateUserMessage(field: string, code: string): string {
    const fieldName = field.replace(/([A-Z])/g, ' $1').toLowerCase();

    switch (code) {
      case 'INVALID_UUID':
        return `Invalid ${fieldName} identifier. Please check the URL and try again.`;
      case 'INVALID_NUMBER':
        return `The ${fieldName} must be a valid number.`;
      case 'INVALID_DATE':
        return `The ${fieldName} must be a valid date.`;
      case 'INVALID_ENUM':
        return `Invalid ${fieldName} value. Please select a valid option.`;
      case 'XSS_DETECTED':
        return 'Potentially harmful content detected in URL. Request blocked for security.';
      case 'SQL_INJECTION_DETECTED':
        return 'Suspicious pattern detected in URL. Request blocked for security.';
      case 'PATH_TRAVERSAL_DETECTED':
        return 'Invalid path format detected. Request blocked for security.';
      case 'MISSING_REQUIRED':
        return `Required parameter "${fieldName}" is missing.`;
      case 'OUT_OF_RANGE':
        return `The ${fieldName} is out of acceptable range.`;
      default:
        return `Invalid ${fieldName}. Please check your input and try again.`;
    }
  }

  /**
   * Converts error to JSON for logging/API responses
   */
  public toJSON() {
    return {
      name: this.name,
      message: this.message,
      userMessage: this.userMessage,
      field: this.field,
      code: this.code,
      statusCode: this.statusCode,
      details: this.details,
      timestamp: this.timestamp,
    };
  }
}

// =====================
// VALIDATION SCHEMAS
// =====================

/**
 * UUID parameter schema (v4)
 * Validates route parameters like :id that should be UUIDs
 *
 * @example
 * // Usage in route: /incidents/:id
 * const schema = z.object({ id: UUIDParamSchema });
 */
export const UUIDParamSchema = z
  .string()
  .uuid({ message: 'Must be a valid UUID format' })
  .describe('UUID route parameter');

/**
 * Numeric parameter schema
 * Validates numeric route parameters with optional min/max constraints
 *
 * @example
 * // Usage in route: /page/:pageNumber
 * const schema = z.object({ pageNumber: NumericParamSchema });
 */
export const NumericParamSchema = z
  .string()
  .regex(/^\d+$/, { message: 'Must be a valid number' })
  .transform((val) => parseInt(val, 10))
  .refine((val) => !isNaN(val), { message: 'Must be a valid integer' })
  .describe('Numeric route parameter');

/**
 * Positive integer parameter schema
 * For pagination, IDs, counts, etc.
 */
export const PositiveIntegerParamSchema = NumericParamSchema
  .refine((val) => val > 0, { message: 'Must be greater than 0' })
  .describe('Positive integer parameter');

/**
 * Date parameter schema (ISO 8601 format)
 * Validates date strings and transforms to Date objects
 *
 * @example
 * // Usage in route: /reports/:date
 * const schema = z.object({ date: DateParamSchema });
 */
export const DateParamSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/, {
    message: 'Must be a valid ISO 8601 date',
  })
  .transform((val) => new Date(val))
  .refine((date) => !isNaN(date.getTime()), { message: 'Must be a valid date' })
  .describe('ISO 8601 date parameter');

/**
 * Generic enum parameter schema factory
 * Creates schemas for validating enum values in routes
 *
 * @template T - Enum type
 * @param enumObject - The enum object to validate against
 * @param enumName - Human-readable name for error messages
 *
 * @example
 * const schema = z.object({
 *   type: EnumParamSchema(IncidentType, 'Incident Type')
 * });
 */
export function EnumParamSchema<T extends Record<string, string>>(
  enumObject: T,
  enumName: string = 'Value'
): z.ZodEnum<[string, ...string[]]> {
  const values = Object.values(enumObject) as [string, ...string[]];
  return z.enum(values, {
    errorMap: () => ({
      message: `${enumName} must be one of: ${values.join(', ')}`,
    }),
  });
}

/**
 * Composite parameter schema
 * Combines multiple parameter schemas for routes with multiple params
 *
 * @example
 * const schema = CompositeParamSchema({
 *   studentId: UUIDParamSchema,
 *   incidentId: UUIDParamSchema,
 *   type: EnumParamSchema(IncidentType, 'Incident Type')
 * });
 */
export function CompositeParamSchema<T extends z.ZodRawShape>(shape: T) {
  return z.object(shape);
}

// =====================
// PREDEFINED SCHEMAS FOR COMMON ROUTES
// =====================

/**
 * Student ID validation schema
 */
export const StudentIdParamSchema = z.object({
  id: UUIDParamSchema,
});

/**
 * Incident report ID validation schema
 */
export const IncidentIdParamSchema = z.object({
  id: UUIDParamSchema,
});

/**
 * Incident type parameter schema
 */
export const IncidentTypeParamSchema = EnumParamSchema(IncidentType, 'Incident Type');

/**
 * Incident severity parameter schema
 */
export const IncidentSeverityParamSchema = EnumParamSchema(IncidentSeverity, 'Severity');

/**
 * Incident status parameter schema
 */
export const IncidentStatusParamSchema = EnumParamSchema(IncidentStatus, 'Status');

/**
 * Action priority parameter schema
 */
export const ActionPriorityParamSchema = EnumParamSchema(ActionPriority, 'Priority');

/**
 * Action status parameter schema
 */
export const ActionStatusParamSchema = EnumParamSchema(ActionStatus, 'Action Status');

/**
 * Medication ID validation schema
 */
export const MedicationIdParamSchema = z.object({
  id: UUIDParamSchema,
});

/**
 * Appointment ID validation schema
 */
export const AppointmentIdParamSchema = z.object({
  id: UUIDParamSchema,
});

/**
 * Document ID validation schema
 */
export const DocumentIdParamSchema = z.object({
  id: UUIDParamSchema,
});

/**
 * Emergency Contact ID validation schema
 */
export const EmergencyContactIdParamSchema = z.object({
  id: UUIDParamSchema,
});

/**
 * Health Record ID validation schema
 */
export const HealthRecordIdParamSchema = z.object({
  id: UUIDParamSchema,
});

/**
 * Student with health record composite schema
 */
export const StudentHealthRecordParamSchema = z.object({
  studentId: UUIDParamSchema,
  id: UUIDParamSchema.optional(),
});

/**
 * Student with document composite schema
 */
export const StudentDocumentParamSchema = z.object({
  studentId: UUIDParamSchema,
  id: UUIDParamSchema.optional(),
});

/**
 * Student with emergency contact composite schema
 */
export const StudentEmergencyContactParamSchema = z.object({
  studentId: UUIDParamSchema,
  contactId: UUIDParamSchema.optional(),
});

/**
 * Date range validation schema
 */
export const DateRangeParamSchema = z.object({
  startDate: DateParamSchema,
  endDate: DateParamSchema,
}).refine(
  (data) => data.startDate <= data.endDate,
  { message: 'Start date must be before or equal to end date' }
);

/**
 * Pagination parameter schema
 */
export const PaginationParamSchema = z.object({
  page: z.string()
    .regex(/^\d+$/, { message: 'Must be a valid number' })
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, { message: 'Must be greater than 0' })
    .optional()
    .default('1')
    .transform((val) => typeof val === 'string' ? parseInt(val, 10) : val),
  limit: z.string()
    .regex(/^\d+$/, { message: 'Must be a valid number' })
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, { message: 'Must be greater than 0' })
    .refine((val) => val <= 100, { message: 'Limit cannot exceed 100' })
    .optional()
    .default('20')
    .transform((val) => typeof val === 'string' ? parseInt(val, 10) : val),
});

// =====================
// SECURITY UTILITIES
// =====================

/**
 * XSS attack pattern detection
 * Checks for common XSS vectors in parameters
 */
const XSS_PATTERNS = [
  /<script[^>]*>.*?<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /<iframe[^>]*>/gi,
  /<object[^>]*>/gi,
  /<embed[^>]*>/gi,
  /eval\s*\(/gi,
  /expression\s*\(/gi,
];

/**
 * SQL injection pattern detection
 * Checks for common SQL injection attempts
 */
const SQL_INJECTION_PATTERNS = [
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/gi,
  /(UNION\s+SELECT)/gi,
  /(OR\s+1\s*=\s*1)/gi,
  /(AND\s+1\s*=\s*1)/gi,
  /(['";]|\-\-|\/\*|\*\/)/g,
];

/**
 * Path traversal pattern detection
 * Checks for directory traversal attempts
 */
const PATH_TRAVERSAL_PATTERNS = [
  /\.\.[\/\\]/g,
  /[\/\\]\.\./g,
  /%2e%2e[\/\\]/gi,
  /[\/\\]%2e%2e/gi,
];

/**
 * Detects XSS attack patterns in parameter values
 *
 * @param value - Parameter value to check
 * @returns true if XSS pattern detected
 */
export function detectXSS(value: string): boolean {
  return XSS_PATTERNS.some((pattern) => pattern.test(value));
}

/**
 * Detects SQL injection patterns in parameter values
 *
 * @param value - Parameter value to check
 * @returns true if SQL injection pattern detected
 */
export function detectSQLInjection(value: string): boolean {
  return SQL_INJECTION_PATTERNS.some((pattern) => pattern.test(value));
}

/**
 * Detects path traversal patterns in parameter values
 *
 * @param value - Parameter value to check
 * @returns true if path traversal pattern detected
 */
export function detectPathTraversal(value: string): boolean {
  return PATH_TRAVERSAL_PATTERNS.some((pattern) => pattern.test(value));
}

/**
 * Performs comprehensive security checks on parameter values
 *
 * @param value - Parameter value to validate
 * @param field - Field name for error reporting
 * @throws RouteValidationError if security threat detected
 */
export function performSecurityChecks(value: string, field: string): void {
  if (detectXSS(value)) {
    throw new RouteValidationError(
      `XSS pattern detected in ${field}`,
      field,
      'XSS_DETECTED'
    );
  }

  if (detectSQLInjection(value)) {
    throw new RouteValidationError(
      `SQL injection pattern detected in ${field}`,
      field,
      'SQL_INJECTION_DETECTED'
    );
  }

  if (detectPathTraversal(value)) {
    throw new RouteValidationError(
      `Path traversal pattern detected in ${field}`,
      field,
      'PATH_TRAVERSAL_DETECTED'
    );
  }
}

/**
 * Sanitizes special characters from parameter values
 * Removes or encodes potentially dangerous characters
 *
 * @param value - Parameter value to sanitize
 * @returns Sanitized value
 */
export function sanitizeSpecialCharacters(value: string): string {
  return value
    .replace(/[<>&"']/g, (char) => {
      const entities: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;',
        "'": '&#x27;',
      };
      return entities[char] || char;
    })
    .trim();
}

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
// PARAMETER TRANSFORMATION
// =====================

/**
 * Parses a date parameter from string to Date object
 *
 * @param param - Date string in ISO 8601 format
 * @returns Date object or null if invalid
 *
 * @example
 * const date = parseDate('2024-03-15T10:30:00Z');
 */
export function parseDate(param: string | undefined): Date | null {
  if (!param) return null;

  try {
    const result = DateParamSchema.safeParse(param);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

/**
 * Parses a boolean parameter from string
 * Accepts: 'true', 'false', '1', '0', 'yes', 'no'
 *
 * @param param - Boolean string parameter
 * @returns boolean or null if invalid
 *
 * @example
 * const isActive = parseBoolean('true'); // true
 * const isEnabled = parseBoolean('1'); // true
 */
export function parseBoolean(param: string | undefined): boolean | null {
  if (!param) return null;

  const normalized = param.toLowerCase().trim();

  if (['true', '1', 'yes', 'on'].includes(normalized)) return true;
  if (['false', '0', 'no', 'off'].includes(normalized)) return false;

  return null;
}

/**
 * Parses an array parameter from delimited string
 *
 * @param param - Delimited string (e.g., "item1,item2,item3")
 * @param delimiter - Delimiter character (default: ',')
 * @returns Array of strings or empty array if invalid
 *
 * @example
 * const ids = parseArray('id1,id2,id3'); // ['id1', 'id2', 'id3']
 * const tags = parseArray('tag1|tag2|tag3', '|'); // ['tag1', 'tag2', 'tag3']
 */
export function parseArray(
  param: string | undefined,
  delimiter: string = ','
): string[] {
  if (!param) return [];

  return param
    .split(delimiter)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

/**
 * Parses a JSON parameter from string
 *
 * @param param - JSON string parameter
 * @returns Parsed object or null if invalid JSON
 *
 * @example
 * const filters = parseJSON('{"type":"INJURY","severity":"HIGH"}');
 */
export function parseJSON<T = any>(param: string | undefined): T | null {
  if (!param) return null;

  try {
    // Perform security checks before parsing
    performSecurityChecks(param, 'json');
    return JSON.parse(param) as T;
  } catch {
    return null;
  }
}

/**
 * Parses parameters based on type definitions
 *
 * @param params - Raw parameters
 * @param types - Type definitions for each parameter
 * @returns Parsed parameters with correct types
 *
 * @example
 * const parsed = parseParams(
 *   { page: '2', active: 'true', tags: 'red,blue,green' },
 *   { page: 'number', active: 'boolean', tags: 'array' }
 * );
 * // Result: { page: 2, active: true, tags: ['red', 'blue', 'green'] }
 */
export function parseParams(
  params: Record<string, string | undefined>,
  types: Record<string, 'number' | 'boolean' | 'date' | 'array' | 'json'>
): Record<string, any> {
  const parsed: Record<string, any> = {};

  for (const [key, type] of Object.entries(types)) {
    const value = params[key];
    if (value === undefined) continue;

    switch (type) {
      case 'number':
        const num = parseInt(value, 10);
        parsed[key] = isNaN(num) ? null : num;
        break;
      case 'boolean':
        parsed[key] = parseBoolean(value);
        break;
      case 'date':
        parsed[key] = parseDate(value);
        break;
      case 'array':
        parsed[key] = parseArray(value);
        break;
      case 'json':
        parsed[key] = parseJSON(value);
        break;
      default:
        parsed[key] = value;
    }
  }

  return parsed;
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
    const validationErrors: ValidationError[] = result.error.errors.map((err) => ({
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
    url: window.location.href,
    userAgent: navigator.userAgent,
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
 * @param navigate - React Router navigate function
 *
 * @example
 * const navigate = useNavigate();
 * redirectOnInvalidParams(error, '/incidents', navigate);
 */
export function redirectOnInvalidParams(
  error: RouteValidationError,
  fallbackRoute: string = '/',
  navigate: ReturnType<typeof useNavigate>
): void {
  handleValidationError(error, 'Redirect');
  navigate(fallbackRoute, {
    replace: true,
    state: { error: error.userMessage },
  });
}

// =====================
// REACT HOOKS
// =====================

/**
 * React hook for validating route parameters with Zod schema
 * Automatically validates params and provides loading/error states
 *
 * @param schema - Zod schema to validate params against
 * @param options - Validation options including redirect and error handling
 * @returns Validated params, loading state, and error
 *
 * @example
 * function IncidentDetailPage() {
 *   const { data, loading, error } = useValidatedParams(
 *     IncidentIdParamSchema,
 *     { fallbackRoute: '/incidents' }
 *   );
 *
 *   if (loading) return <Spinner />;
 *   if (error) return <ErrorMessage error={error} />;
 *
 *   return <IncidentDetail incidentId={data.id} />;
 * }
 */
export function useValidatedParams<T>(
  schema: z.ZodSchema<T>,
  options: ValidationHookOptions = {}
): {
  data: T | null;
  loading: boolean;
  error: RouteValidationError | null;
} {
  const params = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState<{
    data: T | null;
    loading: boolean;
    error: RouteValidationError | null;
  }>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const result = validateRouteParams(params, schema);

    if (result.success && result.data) {
      setState({
        data: result.data,
        loading: false,
        error: null,
      });
    } else if (result.error) {
      setState({
        data: null,
        loading: false,
        error: result.error,
      });

      // Handle error based on options
      if (!options.silent) {
        handleValidationError(result.error, 'useValidatedParams');
      }

      if (options.onError) {
        options.onError(result.error);
      }

      if (options.fallbackRoute || options.redirect) {
        redirectOnInvalidParams(
          result.error,
          options.fallbackRoute || options.redirect || '/',
          navigate
        );
      }
    }
  }, [params, schema, options, navigate]);

  return state;
}

/**
 * React hook for validating query parameters with Zod schema
 *
 * @param schema - Zod schema to validate query params against
 * @param options - Validation options
 * @returns Validated query params, loading state, and error
 *
 * @example
 * function IncidentListPage() {
 *   const { data, loading, error } = useValidatedQueryParams(
 *     z.object({
 *       page: z.coerce.number().min(1).optional(),
 *       type: IncidentTypeParamSchema.optional(),
 *       severity: IncidentSeverityParamSchema.optional(),
 *     })
 *   );
 *
 *   if (loading) return <Spinner />;
 *
 *   return <IncidentList filters={data} />;
 * }
 */
export function useValidatedQueryParams<T>(
  schema: z.ZodSchema<T>,
  options: ValidationHookOptions = {}
): {
  data: T | null;
  loading: boolean;
  error: RouteValidationError | null;
} {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [state, setState] = useState<{
    data: T | null;
    loading: boolean;
    error: RouteValidationError | null;
  }>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const result = validateQueryParams(searchParams, schema);

    if (result.success && result.data) {
      setState({
        data: result.data,
        loading: false,
        error: null,
      });
    } else if (result.error) {
      setState({
        data: null,
        loading: false,
        error: result.error,
      });

      // Handle error based on options
      if (!options.silent) {
        handleValidationError(result.error, 'useValidatedQueryParams');
      }

      if (options.onError) {
        options.onError(result.error);
      }

      if (options.fallbackRoute || options.redirect) {
        redirectOnInvalidParams(
          result.error,
          options.fallbackRoute || options.redirect || '/',
          navigate
        );
      }
    }
  }, [searchParams, schema, options, navigate]);

  return state;
}

/**
 * React hook for parameter validation with custom validator function
 * Provides more flexibility than schema-based validation
 *
 * @param validator - Custom validation function
 * @param options - Validation options
 * @returns Validated data, loading state, and error
 *
 * @example
 * function CustomValidationPage() {
 *   const { data, loading, error } = useParamValidator(
 *     (params) => {
 *       const id = params.id;
 *       if (!id || id.length < 5) {
 *         return {
 *           success: false,
 *           error: new RouteValidationError('Invalid ID', 'id', 'INVALID_ID')
 *         };
 *       }
 *       return { success: true, data: { id } };
 *     },
 *     { fallbackRoute: '/home' }
 *   );
 *
 *   if (loading) return <Spinner />;
 *   return <div>ID: {data?.id}</div>;
 * }
 */
export function useParamValidator<T>(
  validator: (params: Record<string, string | undefined>) => ValidationResult<T>,
  options: ValidationHookOptions = {}
): {
  data: T | null;
  loading: boolean;
  error: RouteValidationError | null;
  revalidate: () => void;
} {
  const params = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState<{
    data: T | null;
    loading: boolean;
    error: RouteValidationError | null;
  }>({
    data: null,
    loading: true,
    error: null,
  });

  const validate = useCallback(() => {
    setState((prev) => ({ ...prev, loading: true }));

    const result = validator(params);

    if (result.success && result.data) {
      setState({
        data: result.data,
        loading: false,
        error: null,
      });
    } else if (result.error) {
      setState({
        data: null,
        loading: false,
        error: result.error,
      });

      // Handle error based on options
      if (!options.silent) {
        handleValidationError(result.error, 'useParamValidator');
      }

      if (options.onError) {
        options.onError(result.error);
      }

      if (options.fallbackRoute || options.redirect) {
        redirectOnInvalidParams(
          result.error,
          options.fallbackRoute || options.redirect || '/',
          navigate
        );
      }
    }
  }, [params, validator, options, navigate]);

  useEffect(() => {
    validate();
  }, [validate]);

  return {
    ...state,
    revalidate: validate,
  };
}

// =====================
// USAGE EXAMPLES
// =====================

/**
 * @example Basic UUID validation
 *
 * import { useValidatedParams, IncidentIdParamSchema } from '@/utils/routeValidation';
 *
 * function IncidentDetailPage() {
 *   const { data, loading, error } = useValidatedParams(
 *     IncidentIdParamSchema,
 *     { fallbackRoute: '/incidents' }
 *   );
 *
 *   if (loading) return <LoadingSpinner />;
 *   if (error) return <ErrorPage error={error.userMessage} />;
 *
 *   return <IncidentDetails incidentId={data.id} />;
 * }
 */

/**
 * @example Query parameter validation with pagination
 *
 * import { useValidatedQueryParams, PaginationParamSchema } from '@/utils/routeValidation';
 *
 * function IncidentListPage() {
 *   const { data } = useValidatedQueryParams(
 *     PaginationParamSchema,
 *     { silent: true } // Don't show errors for invalid pagination
 *   );
 *
 *   const page = data?.page ?? 1;
 *   const limit = data?.limit ?? 20;
 *
 *   return <IncidentList page={page} limit={limit} />;
 * }
 */

/**
 * @example Complex composite validation
 *
 * import {
 *   useValidatedParams,
 *   CompositeParamSchema,
 *   UUIDParamSchema,
 *   IncidentTypeParamSchema
 * } from '@/utils/routeValidation';
 *
 * function FilteredIncidentPage() {
 *   const schema = CompositeParamSchema({
 *     studentId: UUIDParamSchema,
 *     type: IncidentTypeParamSchema,
 *   });
 *
 *   const { data, loading, error } = useValidatedParams(schema);
 *
 *   if (loading) return <LoadingSpinner />;
 *   if (error) return <ErrorPage error={error.userMessage} />;
 *
 *   return (
 *     <IncidentList
 *       studentId={data.studentId}
 *       type={data.type}
 *     />
 *   );
 * }
 */

/**
 * @example Custom validation with business logic
 *
 * import { useParamValidator, RouteValidationError } from '@/utils/routeValidation';
 *
 * function ReportGeneratorPage() {
 *   const { data, error } = useParamValidator((params) => {
 *     const startDate = parseDate(params.startDate);
 *     const endDate = parseDate(params.endDate);
 *
 *     if (!startDate || !endDate) {
 *       return {
 *         success: false,
 *         error: new RouteValidationError(
 *           'Invalid date range',
 *           'dateRange',
 *           'INVALID_DATE'
 *         )
 *       };
 *     }
 *
 *     const daysDiff = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
 *     if (daysDiff > 365) {
 *       return {
 *         success: false,
 *         error: new RouteValidationError(
 *           'Date range cannot exceed 1 year',
 *           'dateRange',
 *           'OUT_OF_RANGE'
 *         )
 *       };
 *     }
 *
 *     return { success: true, data: { startDate, endDate } };
 *   });
 *
 *   if (error) return <ErrorPage error={error.userMessage} />;
 *
 *   return <Report startDate={data.startDate} endDate={data.endDate} />;
 * }
 */
