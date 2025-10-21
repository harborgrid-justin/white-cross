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

/**
 * Standard API response interface
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
 */
export const asyncHandler = (
  fn: (req: any, res: Response, next?: any) => Promise<any>
) => {
  return (req: any, res: Response, next: any) => {
    Promise.resolve(fn(req, res, next)).catch((error: Error) => {
      logger.error('Async route error:', {
        path: req.path,
        method: req.method,
        error: error.message,
        stack: error.stack
      });

      // Handle specific error types
      if (error.message.includes('not found') || error.message.includes('Not found')) {
        return notFoundResponse(res, error.message);
      }

      if (error.message.includes('already exists') || error.message.includes('duplicate')) {
        return conflictResponse(res, error.message);
      }

      if (error.message.includes('unauthorized') || error.message.includes('Unauthorized')) {
        return unauthorizedResponse(res, error.message);
      }

      if (error.message.includes('forbidden') || error.message.includes('Forbidden')) {
        return forbiddenResponse(res, error.message);
      }

      if (error.message.includes('validation') || error.message.includes('invalid')) {
        return badRequestResponse(res, error.message);
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
