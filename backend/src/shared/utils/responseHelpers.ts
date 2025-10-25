/**
 * LOC: 24D0284614
 * File: /backend/src/shared/utils/responseHelpers.ts
 *
 * UPSTREAM (imports from):
 *   - logger.ts (shared/logging/logger.ts)
 *
 * DOWNSTREAM (imported by):
 *   - None (not imported)
 */

/**
 * File: /backend/src/shared/utils/responseHelpers.ts
 * Locator: WC-UTL-RSP-077
 * Purpose: Healthcare API Response Standardization - HIPAA-compliant response formatting
 * 
 * Upstream: ../logging/logger, Express.js framework
 * Downstream: ../routes/*, API endpoints, error handling middleware, audit logging
 * Dependencies: express, logger, standardized error codes, healthcare response patterns
 * Exports: successResponse, errorResponse, asyncHandler, paginatedResponse, health checks
 * 
 * LLM Context: Standardized API response utilities for White Cross healthcare system.
 * Ensures consistent response format, HIPAA-compliant error handling, audit trail
 * integration. Critical for API security and medical data response standardization.
 */

/**
 * Response Utilities
 * Standardized response functions to ensure consistent API responses
 */

import { Response } from 'express';
import { logger } from '../logging/logger';
import {
  ServiceError,
  NotFoundError,
  ConflictError,
  ValidationError,
  AuthenticationError,
  AuthorizationError
} from '../../errors/ServiceError';

/**
 * Standard API response interface
 *
 * @template T - The type of data being returned in the response
 * @property {boolean} success - Indicates if the request was successful
 * @property {T} [data] - The response data (present on success)
 * @property {object} [error] - Error details (present on failure)
 * @property {string} error.message - Human-readable error message
 * @property {string} [error.code] - Machine-readable error code for categorization
 * @property {any} [error.details] - Additional error context or validation details
 * @property {object} [meta] - Response metadata
 * @property {object} [meta.pagination] - Pagination information for list endpoints
 * @property {number} meta.pagination.page - Current page number
 * @property {number} meta.pagination.limit - Items per page
 * @property {number} meta.pagination.total - Total number of items
 * @property {number} meta.pagination.pages - Total number of pages
 * @property {string} [meta.timestamp] - Response timestamp (ISO 8601)
 * @property {string} [meta.requestId] - Unique request identifier for tracing
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
    timestamp?: string;
    requestId?: string;
  };
}

/**
 * Success response with data
 *
 * @template T - Type of the response data
 * @param {Response} res - Express response object
 * @param {T} data - Data to include in the response body
 * @param {number} [statusCode=200] - HTTP status code (default: 200 OK)
 * @param {ApiResponse<T>['meta']} [meta] - Optional metadata (pagination, timestamps, etc.)
 * @returns {Response} Express response with standardized success format
 *
 * @example
 * ```typescript
 * // Simple success response
 * return successResponse(res, { user: userData }, 200);
 *
 * // Success with pagination metadata
 * return successResponse(res, users, 200, {
 *   pagination: { page: 1, limit: 20, total: 100, pages: 5 }
 * });
 * ```
 */
export const successResponse = <T>(
  res: Response,
  data: T,
  statusCode: number = 200,
  meta?: ApiResponse<T>['meta']
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    ...(meta && { meta })
  };

  return res.status(statusCode).json(response);
};

/**
 * Error response
 *
 * @param {Response} res - Express response object
 * @param {string} message - Human-readable error message
 * @param {number} [statusCode=400] - HTTP status code (default: 400 Bad Request)
 * @param {string} [code] - Machine-readable error code for categorization
 * @param {any} [details] - Additional error context (e.g., validation errors)
 * @returns {Response} Express response with standardized error format
 *
 * @example
 * ```typescript
 * // Simple error response
 * return errorResponse(res, 'Invalid email format', 400, 'VALIDATION_ERROR');
 *
 * // Error with validation details
 * return errorResponse(res, 'Validation failed', 400, 'VALIDATION_ERROR', {
 *   fields: { email: 'Invalid format', password: 'Too short' }
 * });
 * ```
 *
 * @security Never expose stack traces or internal implementation details in error responses
 * @security Ensure error messages don't contain PHI (Protected Health Information)
 */
export const errorResponse = (
  res: Response,
  message: string,
  statusCode: number = 400,
  code?: string,
  details?: any
): Response => {
  const response: ApiResponse = {
    success: false,
    error: {
      message,
      ...(code && { code }),
      ...(details && { details })
    }
  };

  // Log error for monitoring (don't log sensitive details)
  logger.error('API Error Response:', {
    statusCode,
    message,
    code,
    hasDetails: !!details
  });

  return res.status(statusCode).json(response);
};

/**
 * Created response (201)
 */
export const createdResponse = <T>(
  res: Response,
  data: T,
  meta?: ApiResponse<T>['meta']
): Response => {
  return successResponse(res, data, 201, meta);
};

/**
 * No content response (204)
 */
export const noContentResponse = (res: Response): Response => {
  return res.status(204).send();
};

/**
 * Bad request response (400)
 */
export const badRequestResponse = (
  res: Response,
  message: string = 'Bad request',
  details?: any
): Response => {
  return errorResponse(res, message, 400, 'BAD_REQUEST', details);
};

/**
 * Unauthorized response (401)
 */
export const unauthorizedResponse = (
  res: Response,
  message: string = 'Unauthorized'
): Response => {
  return errorResponse(res, message, 401, 'UNAUTHORIZED');
};

/**
 * Forbidden response (403)
 */
export const forbiddenResponse = (
  res: Response,
  message: string = 'Forbidden'
): Response => {
  return errorResponse(res, message, 403, 'FORBIDDEN');
};

/**
 * Not found response (404)
 */
export const notFoundResponse = (
  res: Response,
  message: string = 'Resource not found'
): Response => {
  return errorResponse(res, message, 404, 'NOT_FOUND');
};

/**
 * Conflict response (409)
 */
export const conflictResponse = (
  res: Response,
  message: string = 'Conflict',
  details?: any
): Response => {
  return errorResponse(res, message, 409, 'CONFLICT', details);
};

/**
 * Unprocessable entity response (422)
 */
export const unprocessableEntityResponse = (
  res: Response,
  message: string = 'Unprocessable entity',
  details?: any
): Response => {
  return errorResponse(res, message, 422, 'UNPROCESSABLE_ENTITY', details);
};

/**
 * Internal server error response (500)
 */
export const internalServerErrorResponse = (
  res: Response,
  message: string = 'Internal server error',
  error?: Error
): Response => {
  // Log the full error for debugging (but don't expose it to client)
  if (error) {
    logger.error('Internal Server Error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
  }

  return errorResponse(res, message, 500, 'INTERNAL_SERVER_ERROR');
};

/**
 * Service unavailable response (503)
 */
export const serviceUnavailableResponse = (
  res: Response,
  message: string = 'Service unavailable'
): Response => {
  return errorResponse(res, message, 503, 'SERVICE_UNAVAILABLE');
};

/**
 * Paginated response helper
 *
 * @template T - Type of items in the data array
 * @param {Response} res - Express response object
 * @param {T[]} data - Array of items for the current page
 * @param {object} pagination - Pagination metadata
 * @param {number} pagination.page - Current page number (1-indexed)
 * @param {number} pagination.limit - Number of items per page
 * @param {number} pagination.total - Total number of items across all pages
 * @param {number} [pagination.pages] - Total number of pages (calculated if not provided)
 * @returns {Response} Express response with standardized paginated format
 *
 * @example
 * ```typescript
 * // Paginated list of students
 * const students = await getStudents(page, limit);
 * const total = await getStudentCount();
 *
 * return paginatedResponse(res, students, {
 *   page: 1,
 *   limit: 20,
 *   total: 150  // Will calculate pages: Math.ceil(150/20) = 8
 * });
 * ```
 */
export const paginatedResponse = <T>(
  res: Response,
  data: T[],
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages?: number;
  }
): Response => {
  const paginationMeta = {
    ...pagination,
    pages: pagination.pages ?? Math.ceil(pagination.total / pagination.limit)
  };

  return successResponse(res, data, 200, {
    pagination: paginationMeta
  });
};

/**
 * Handle async route errors
 * Wrapper function to catch async errors and send appropriate response
 *
 * @description Enhanced error handler using proper error type checking
 * instead of fragile string matching. Supports ServiceError hierarchy.
 *
 * @param fn - Async route handler function
 * @returns Express middleware that handles async errors
 */
export const asyncHandler = (
  fn: (req: any, res: Response, next?: any) => Promise<any>
) => {
  return (req: any, res: Response, next: any) => {
    Promise.resolve(fn(req, res, next)).catch((error: Error) => {
      // Log error with full context
      if (error instanceof ServiceError) {
        logger.error('Async route error (ServiceError):', error.toLogObject());
      } else {
        logger.error('Async route error:', {
          path: req.path,
          method: req.method,
          error: error.message,
          stack: error.stack,
          name: error.name
        });
      }

      // Handle specific error types using instanceof (proper type checking)
      if (error instanceof NotFoundError) {
        return notFoundResponse(res, error.message);
      }

      if (error instanceof ConflictError) {
        return conflictResponse(res, error.message);
      }

      if (error instanceof AuthenticationError) {
        return unauthorizedResponse(res, error.message);
      }

      if (error instanceof AuthorizationError) {
        return forbiddenResponse(res, error.message);
      }

      if (error instanceof ValidationError) {
        return badRequestResponse(res, error.message);
      }

      // Handle generic ServiceError
      if (error instanceof ServiceError) {
        return errorResponse(res, error.message, error.statusCode, error.code);
      }

      // Default to internal server error
      return internalServerErrorResponse(res, 'An unexpected error occurred', error);
    });
  };
};

/**
 * Health check response
 */
export const healthCheckResponse = (res: Response, data?: any): Response => {
  return successResponse(res, {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    ...data
  });
};

export default {
  successResponse,
  errorResponse,
  createdResponse,
  noContentResponse,
  badRequestResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  conflictResponse,
  unprocessableEntityResponse,
  internalServerErrorResponse,
  serviceUnavailableResponse,
  paginatedResponse,
  asyncHandler,
  healthCheckResponse
};
