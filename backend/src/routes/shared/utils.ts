/**
 * @fileoverview Route Shared Utilities
 *
 * Response helper functions for Hapi route handlers providing standardized
 * response formatting across all API endpoints. These utilities ensure consistent
 * response structure, HTTP status codes, and error handling patterns.
 *
 * @module routes/shared/utils
 * @requires @hapi/hapi
 * @since 1.0.0
 */

import { ResponseToolkit, Request } from '@hapi/hapi';

/**
 * Async handler wrapper for Hapi route handlers.
 *
 * Automatically catches errors thrown by async route handlers and propagates
 * them to the error handling middleware. This eliminates the need for try-catch
 * blocks in every route handler.
 *
 * @param {Function} fn - Async route handler function
 * @returns {Function} Wrapped route handler with error handling
 *
 * @example
 * ```typescript
 * export default asyncHandler(async (request, h) => {
 *   const data = await someAsyncOperation();
 *   return successResponse(h, data);
 * });
 * ```
 */
export function asyncHandler(fn: (request: any, h: ResponseToolkit) => Promise<any>) {
  return async (request: Request, h: ResponseToolkit) => {
    try {
      return await fn(request, h);
    } catch (error) {
      // Let the error handling middleware handle it
      throw error;
    }
  };
}

/**
 * Generates a successful response with HTTP 200 status.
 *
 * Standard success response format for GET, PUT, and PATCH operations.
 *
 * @param {ResponseToolkit} h - Hapi response toolkit
 * @param {any} data - Response payload data
 * @param {string} [message] - Optional success message
 * @returns {ResponseObject} Formatted success response with 200 status
 *
 * @example
 * ```typescript
 * // Returning user data
 * const user = await User.findByPk(userId);
 * return successResponse(h, user, 'User retrieved successfully');
 * ```
 */
export function successResponse(h: ResponseToolkit, data: any, message?: string) {
  return h.response({
    success: true,
    message,
    data
  }).code(200);
}

/**
 * Generates a resource created response with HTTP 201 status.
 *
 * Standard response format for successful POST operations that create new resources.
 *
 * @param {ResponseToolkit} h - Hapi response toolkit
 * @param {any} data - Newly created resource data
 * @param {string} [message='Resource created successfully'] - Optional success message
 * @returns {ResponseObject} Formatted creation response with 201 status
 *
 * @example
 * ```typescript
 * // Creating a new student
 * const student = await Student.create(payload);
 * return createdResponse(h, student, 'Student created successfully');
 * ```
 */
export function createdResponse(h: ResponseToolkit, data: any, message?: string) {
  return h.response({
    success: true,
    message: message || 'Resource created successfully',
    data
  }).code(201);
}

/**
 * Generates a no content response with HTTP 204 status.
 *
 * Standard response for successful DELETE operations or updates that don't
 * return data. No response body is included.
 *
 * @param {ResponseToolkit} h - Hapi response toolkit
 * @returns {ResponseObject} Empty response with 204 status
 *
 * @example
 * ```typescript
 * // Deleting a student
 * await student.destroy();
 * return noContentResponse(h);
 * ```
 */
export function noContentResponse(h: ResponseToolkit) {
  return h.response().code(204);
}

/**
 * Generates a bad request error response with HTTP 400 status.
 *
 * Used when client sends malformed or invalid request data.
 *
 * @param {ResponseToolkit} h - Hapi response toolkit
 * @param {string} message - Error description
 * @param {any} [errors] - Optional detailed error information
 * @returns {ResponseObject} Formatted error response with 400 status
 *
 * @example
 * ```typescript
 * if (!isValidDate(payload.birthDate)) {
 *   return badRequestResponse(h, 'Invalid birth date format');
 * }
 * ```
 */
export function badRequestResponse(h: ResponseToolkit, message: string, errors?: any) {
  return h.response({
    success: false,
    error: {
      message,
      code: 'BAD_REQUEST',
      errors
    }
  }).code(400);
}

/**
 * Generates an unauthorized error response with HTTP 401 status.
 *
 * Used when authentication is required but missing or invalid (invalid JWT token,
 * missing credentials, expired session).
 *
 * @param {ResponseToolkit} h - Hapi response toolkit
 * @param {string} [message='Unauthorized'] - Optional error message
 * @returns {ResponseObject} Formatted error response with 401 status
 *
 * @example
 * ```typescript
 * if (!request.auth.isAuthenticated) {
 *   return unauthorizedResponse(h, 'Valid authentication token required');
 * }
 * ```
 */
export function unauthorizedResponse(h: ResponseToolkit, message?: string) {
  return h.response({
    success: false,
    error: {
      message: message || 'Unauthorized',
      code: 'UNAUTHORIZED'
    }
  }).code(401);
}

/**
 * Generates a forbidden error response with HTTP 403 status.
 *
 * Used when authenticated user lacks required permissions or roles to access
 * the resource. Authentication succeeded but authorization failed.
 *
 * @param {ResponseToolkit} h - Hapi response toolkit
 * @param {string} [message='Forbidden'] - Optional error message
 * @returns {ResponseObject} Formatted error response with 403 status
 *
 * @example
 * ```typescript
 * if (user.role !== 'ADMIN') {
 *   return forbiddenResponse(h, 'Admin access required');
 * }
 * ```
 */
export function forbiddenResponse(h: ResponseToolkit, message?: string) {
  return h.response({
    success: false,
    error: {
      message: message || 'Forbidden',
      code: 'FORBIDDEN'
    }
  }).code(403);
}

/**
 * Generates a not found error response with HTTP 404 status.
 *
 * Used when requested resource does not exist in the system.
 *
 * @param {ResponseToolkit} h - Hapi response toolkit
 * @param {string} [message='Resource not found'] - Optional error message
 * @returns {ResponseObject} Formatted error response with 404 status
 *
 * @example
 * ```typescript
 * const student = await Student.findByPk(id);
 * if (!student) {
 *   return notFoundResponse(h, 'Student not found');
 * }
 * ```
 */
export function notFoundResponse(h: ResponseToolkit, message?: string) {
  return h.response({
    success: false,
    error: {
      message: message || 'Resource not found',
      code: 'NOT_FOUND'
    }
  }).code(404);
}

/**
 * Generates a conflict error response with HTTP 409 status.
 *
 * Used when request conflicts with current system state (duplicate resource,
 * concurrent modification, constraint violation).
 *
 * @param {ResponseToolkit} h - Hapi response toolkit
 * @param {string} message - Conflict description
 * @returns {ResponseObject} Formatted error response with 409 status
 *
 * @example
 * ```typescript
 * const existing = await User.findOne({ where: { email } });
 * if (existing) {
 *   return conflictResponse(h, 'User with this email already exists');
 * }
 * ```
 */
export function conflictResponse(h: ResponseToolkit, message: string) {
  return h.response({
    success: false,
    error: {
      message,
      code: 'CONFLICT'
    }
  }).code(409);
}

/**
 * Generates an internal server error response with HTTP 500 status.
 *
 * Used for unexpected server errors. In development mode, includes error details
 * for debugging. Production mode omits sensitive error information.
 *
 * @param {ResponseToolkit} h - Hapi response toolkit
 * @param {string} message - Error message
 * @param {any} [error] - Optional error object (included only in development)
 * @returns {ResponseObject} Formatted error response with 500 status
 *
 * @example
 * ```typescript
 * try {
 *   await processData(payload);
 * } catch (error) {
 *   logger.error('Data processing failed', error);
 *   return errorResponse(h, 'Failed to process data', error);
 * }
 * ```
 */
export function errorResponse(h: ResponseToolkit, message: string, error?: any) {
  return h.response({
    success: false,
    error: {
      message,
      code: 'INTERNAL_ERROR',
      ...(process.env.NODE_ENV === 'development' && error && { details: error })
    }
  }).code(500);
}

/**
 * Generates a validation error response with HTTP 422 status.
 *
 * Used when request data is syntactically correct but semantically invalid
 * (business rule violations, data integrity constraints).
 *
 * @param {ResponseToolkit} h - Hapi response toolkit
 * @param {any} errors - Validation error details (field-level errors)
 * @returns {ResponseObject} Formatted error response with 422 status
 *
 * @example
 * ```typescript
 * const errors = validateBusinessRules(payload);
 * if (errors.length > 0) {
 *   return validationErrorResponse(h, errors);
 * }
 * ```
 */
export function validationErrorResponse(h: ResponseToolkit, errors: any) {
  return h.response({
    success: false,
    error: {
      message: 'Validation failed',
      code: 'VALIDATION_ERROR',
      errors
    }
  }).code(422);
}

/**
 * Validation fail action handler for Joi validation failures.
 *
 * Custom error handler that transforms Joi validation errors into consistent,
 * user-friendly API responses. Automatically extracts field paths, error messages,
 * and validation types from Joi error objects.
 *
 * @param {Request} request - Hapi request object
 * @param {ResponseToolkit} h - Hapi response toolkit
 * @param {any} error - Joi validation error with details array
 * @returns {ResponseObject} Formatted validation error response with 400 status
 *
 * @example
 * ```typescript
 * // In route options
 * {
 *   method: 'POST',
 *   path: '/api/v1/users',
 *   options: {
 *     validate: {
 *       payload: userCreateSchema,
 *       failAction: validationFailAction
 *     }
 *   }
 * }
 * ```
 */
export function validationFailAction(request: Request, h: ResponseToolkit, error: any) {
  // Extract validation details from Joi error
  const details = error.details?.map((detail: any) => ({
    field: detail.path?.join('.') || detail.context?.key || 'unknown',
    message: detail.message,
    type: detail.type,
    value: detail.context?.value
  })) || [];

  return h.response({
    success: false,
    error: {
      message: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details
    }
  }).code(400).takeover();
}
