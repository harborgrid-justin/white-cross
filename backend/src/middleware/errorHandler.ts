/**
 * LOC: 3835B8CB7D
 * WC-MID-ERR-045 | HIPAA-Compliant Error Handler & Sequelize Error Management
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index-sequelize.ts (index-sequelize.ts)
 *   - index.ts (index.ts)
 */

/**
 * WC-MID-ERR-045 | HIPAA-Compliant Error Handler & Sequelize Error Management
 * Purpose: Centralized error handling, PHI protection, Sequelize error mapping
 * Upstream: utils/logger, @hapi/boom, sequelize validation errors
 * Downstream: All routes and services | Called by: Hapi server error extension
 * Related: utils/logger.ts, middleware/auditLogging.ts, database/models/*
 * Exports: errorHandler (default) | Key Services: Error sanitization, logging
 * Last Updated: 2025-10-18 | Dependencies: @hapi/hapi, @hapi/boom, sequelize
 * Critical Path: Error detection → Classification → Sanitization → Response
 * LLM Context: HIPAA compliance, prevents PHI leakage, detailed audit logging
 */

import { Request, ResponseToolkit } from '@hapi/hapi';
import * as Boom from '@hapi/boom';
import {
  ValidationError,
  UniqueConstraintError,
  ForeignKeyConstraintError,
  DatabaseError,
  ConnectionError,
  TimeoutError,
} from 'sequelize';
import { logger } from '../utils/logger';

interface ErrorWithStatus extends Error {
  status?: number;
  statusCode?: number;
}

/**
 * Enhanced Error Handler with Sequelize Error Support
 *
 * HIPAA Compliance: Ensures error messages don't leak PHI while maintaining
 * detailed logging for security audits and debugging.
 *
 * Security: Sanitizes error messages in production to prevent information disclosure.
 */
export const errorHandler = (request: Request, h: ResponseToolkit) => {
  const response = request.response;

  // Handle Boom errors (Hapi's error objects)
  if (Boom.isBoom(response)) {
    const boomError = response as Boom.Boom;

    logger.error(
      `API Error: ${boomError.message} [${boomError.output.statusCode}] ${request.method} ${request.url.pathname}`,
      {
        error: boomError,
        userId: (request.auth.credentials as any)?.userId,
        requestId: (request as any).requestId,
      }
    );

    return h.continue;
  }

  // Handle Sequelize errors
  if (response instanceof Error) {
    const error = response as Error;

    // Sequelize Validation Error
    if (error instanceof ValidationError) {
      logger.warn(`Validation Error: ${error.message}`, {
        errors: error.errors.map((e) => ({
          field: e.path,
          message: e.message,
          type: e.type,
          value: e.value,
        })),
        userId: (request.auth.credentials as any)?.userId,
        requestId: (request as any).requestId,
      });

      return h
        .response({
          success: false,
          error: {
            message: 'Validation failed',
            details: error.errors.map((e) => ({
              field: e.path,
              message: e.message,
              type: e.type,
            })),
          },
        })
        .code(400);
    }

    // Sequelize Unique Constraint Error
    if (error instanceof UniqueConstraintError) {
      const fields = error.errors.map((e) => e.path).join(', ');

      logger.warn(`Unique Constraint Violation: ${fields}`, {
        error,
        userId: (request.auth.credentials as any)?.userId,
        requestId: (request as any).requestId,
      });

      return h
        .response({
          success: false,
          error: {
            message: `A record with the provided ${fields} already exists`,
            code: 'UNIQUE_CONSTRAINT_ERROR',
          },
        })
        .code(409);
    }

    // Sequelize Foreign Key Constraint Error
    if (error instanceof ForeignKeyConstraintError) {
      logger.error(`Foreign Key Constraint Violation: ${error.message}`, {
        error,
        userId: (request.auth.credentials as any)?.userId,
        requestId: (request as any).requestId,
      });

      return h
        .response({
          success: false,
          error: {
            message: 'Invalid reference to related data',
            code: 'FOREIGN_KEY_CONSTRAINT_ERROR',
          },
        })
        .code(400);
    }

    // Sequelize Connection Error
    if (error instanceof ConnectionError) {
      logger.error(`Database Connection Error: ${error.message}`, {
        error,
        requestId: (request as any).requestId,
      });

      return h
        .response({
          success: false,
          error: {
            message: 'Database connection error. Please try again later.',
            code: 'DATABASE_CONNECTION_ERROR',
          },
        })
        .code(503);
    }

    // Sequelize Timeout Error
    if (error instanceof TimeoutError) {
      logger.error(`Database Timeout Error: ${error.message}`, {
        error,
        requestId: (request as any).requestId,
      });

      return h
        .response({
          success: false,
          error: {
            message: 'Request timed out. Please try again.',
            code: 'DATABASE_TIMEOUT_ERROR',
          },
        })
        .code(504);
    }

    // Generic Sequelize Database Error
    if (error instanceof DatabaseError) {
      logger.error(`Database Error: ${error.message}`, {
        error,
        sql: (error as any).sql,
        userId: (request.auth.credentials as any)?.userId,
        requestId: (request as any).requestId,
      });

      return h
        .response({
          success: false,
          error: {
            message:
              process.env.NODE_ENV === 'development'
                ? `Database error: ${error.message}`
                : 'A database error occurred',
            code: 'DATABASE_ERROR',
            ...(process.env.NODE_ENV === 'development' && {
              details: error.message,
            }),
          },
        })
        .code(500);
    }

    // Handle regular errors with status codes
    const errorWithStatus = error as ErrorWithStatus;
    const status = errorWithStatus.status || errorWithStatus.statusCode || 500;
    const message = errorWithStatus.message || 'Internal Server Error';

    logger.error(`API Error: ${message} [${status}] ${request.method} ${request.url.pathname}`, {
      error,
      userId: (request.auth.credentials as any)?.userId,
      requestId: (request as any).requestId,
    });

    return h
      .response({
        success: false,
        error: {
          message: process.env.NODE_ENV === 'development' ? message : 'Internal Server Error',
          ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
        },
      })
      .code(status);
  }

  return h.continue;
};
