/**
 * LOC: 1BD5C63D7E
 * WC-GEN-335 | middleware.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - logger.ts (shared/logging/logger.ts)
 *
 * DOWNSTREAM (imported by):
 *   - None (not imported)
 */

/**
 * WC-GEN-335 | middleware.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../logging/logger | Dependencies: express, express-validator, joi
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: constants, default export | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import Joi from 'joi';
import { logger } from '../logging/logger';

/**
 * Shared validation middleware
 * Provides validation utilities for request validation
 */

/**
 * Joi validation middleware generator
 */
export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: any, res: any, next: any) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        type: detail.type
      }));

      logger.warn('Validation failed', { errors, path: req.path });

      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: errors
        }
      });
    }

    // Replace req.body with validated and sanitized values
    req.body = value;
    next();
  };
};

/**
 * Validate query parameters
 */
export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: any, res: any, next: any) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        type: detail.type
      }));

      logger.warn('Query validation failed', { errors, path: req.path });

      return res.status(400).json({
        success: false,
        error: {
          message: 'Query validation failed',
          code: 'VALIDATION_ERROR',
          details: errors
        }
      });
    }

    // Replace req.query with validated and sanitized values
    req.query = value;
    next();
  };
};

/**
 * Validate URL parameters
 */
export const validateParams = (schema: Joi.ObjectSchema) => {
  return (req: any, res: any, next: any) => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        type: detail.type
      }));

      logger.warn('Params validation failed', { errors, path: req.path });

      return res.status(400).json({
        success: false,
        error: {
          message: 'Parameter validation failed',
          code: 'VALIDATION_ERROR',
          details: errors
        }
      });
    }

    // Replace req.params with validated and sanitized values
    req.params = value;
    next();
  };
};

/**
 * Express-validator error handling middleware
 * Standardizes validation error responses across all routes
 */
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: 'path' in error ? error.path : ('param' in error ? error.param : 'unknown'),
      message: error.msg,
      value: 'value' in error ? error.value : undefined,
      location: 'location' in error ? error.location : undefined
    }));

    logger.warn('Validation errors:', {
      path: req.path,
      method: req.method,
      errors: formattedErrors,
      ip: req.ip
    });

    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation failed',
        details: formattedErrors
      }
    });
  }

  next();
};

/**
 * Create validation middleware chain with error handling
 * @param validations - Array of express-validator validation chains
 * @returns Array of middleware functions
 */
export const createValidationChain = (validations: ValidationChain[]) => {
  return [...validations, handleValidationErrors];
};

export default {
  validateRequest,
  validateQuery,
  validateParams,
  handleValidationErrors,
  createValidationChain
};