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

export default {
  validateRequest,
  validateQuery,
  validateParams
};