/**
 * Route Shared Utilities
 * Response helper functions for Hapi route handlers
 */

import { ResponseToolkit, Request } from '@hapi/hapi';

/**
 * Async handler wrapper for Hapi route handlers
 * Automatically catches errors and passes them to the error handler
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
 * Success response (200)
 */
export function successResponse(h: ResponseToolkit, data: any, message?: string) {
  return h.response({
    success: true,
    message,
    data
  }).code(200);
}

/**
 * Created response (201)
 */
export function createdResponse(h: ResponseToolkit, data: any, message?: string) {
  return h.response({
    success: true,
    message: message || 'Resource created successfully',
    data
  }).code(201);
}

/**
 * No content response (204)
 */
export function noContentResponse(h: ResponseToolkit) {
  return h.response().code(204);
}

/**
 * Bad request response (400)
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
 * Unauthorized response (401)
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
 * Forbidden response (403)
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
 * Not found response (404)
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
 * Conflict response (409)
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
 * Error response (500)
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
 * Validation error response (422)
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
 * Validation fail action handler
 * Custom error handler for Joi validation failures
 * Provides detailed, user-friendly validation error messages
 *
 * @param request - Hapi request object
 * @param h - Hapi response toolkit
 * @param error - Joi validation error
 * @returns Formatted validation error response (400)
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
