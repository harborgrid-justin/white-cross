/**
 * @fileoverview Shared Validation Schemas
 *
 * Common Joi validation schemas used across all v1 API routes to ensure
 * consistent validation behavior, error messages, and data constraints.
 * These schemas promote DRY principles and standardize API input validation.
 *
 * @module routes/shared/validators
 * @requires joi
 * @since 1.0.0
 */

import Joi from 'joi';

/**
 * Pagination query parameters validation schema.
 *
 * Validates standard pagination parameters for list endpoints.
 *
 * @const {Joi.ObjectSchema}
 * @property {number} [page=1] - Page number (min: 1)
 * @property {number} [limit=20] - Items per page (min: 1, max: 100)
 *
 * @example
 * ```typescript
 * // In a route definition
 * {
 *   method: 'GET',
 *   path: '/api/v1/students',
 *   options: {
 *     validate: {
 *       query: paginationSchema
 *     }
 *   }
 * }
 * ```
 */
export const paginationSchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .description('Page number for pagination'),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(20)
    .description('Number of items per page')
});

/**
 * Email address validation schema.
 *
 * Validates email format, normalizes to lowercase, and trims whitespace.
 * Required field with custom error messages.
 *
 * @const {Joi.StringSchema}
 *
 * @example
 * ```typescript
 * const userSchema = Joi.object({
 *   email: emailSchema
 * });
 * ```
 */
export const emailSchema = Joi.string()
  .email()
  .lowercase()
  .trim()
  .required()
  .description('Email address')
  .messages({
    'string.email': 'Must be a valid email address',
    'any.required': 'Email is required'
  });

/**
 * First name validation schema.
 *
 * Validates first name with length constraints (1-100 characters).
 * Trims whitespace automatically. Required field.
 *
 * @const {Joi.StringSchema}
 *
 * @example
 * ```typescript
 * const userSchema = Joi.object({
 *   firstName: firstNameSchema
 * });
 * ```
 */
export const firstNameSchema = Joi.string()
  .trim()
  .min(1)
  .max(100)
  .required()
  .description('First name')
  .messages({
    'string.min': 'First name must be at least 1 character',
    'string.max': 'First name cannot exceed 100 characters',
    'any.required': 'First name is required'
  });

/**
 * Last name validation schema.
 *
 * Validates last name with length constraints (1-100 characters).
 * Trims whitespace automatically. Required field.
 *
 * @const {Joi.StringSchema}
 *
 * @example
 * ```typescript
 * const userSchema = Joi.object({
 *   lastName: lastNameSchema
 * });
 * ```
 */
export const lastNameSchema = Joi.string()
  .trim()
  .min(1)
  .max(100)
  .required()
  .description('Last name')
  .messages({
    'string.min': 'Last name must be at least 1 character',
    'string.max': 'Last name cannot exceed 100 characters',
    'any.required': 'Last name is required'
  });

/**
 * UUID parameter validation schema.
 *
 * Validates route parameters containing a UUID identifier.
 * Commonly used in RESTful resource endpoints (e.g., /api/v1/users/:id).
 *
 * @const {Joi.ObjectSchema}
 * @property {string} id - UUID v4 identifier (required)
 *
 * @example
 * ```typescript
 * {
 *   method: 'GET',
 *   path: '/api/v1/users/{id}',
 *   options: {
 *     validate: {
 *       params: uuidParamSchema
 *     }
 *   }
 * }
 * ```
 */
export const uuidParamSchema = Joi.object({
  id: Joi.string()
    .uuid()
    .required()
    .description('UUID identifier')
    .messages({
      'string.guid': 'Must be a valid UUID',
      'any.required': 'ID is required'
    })
});

/**
 * Boolean query parameter validation schema.
 *
 * Validates optional boolean query parameters.
 * Accepts: true, false, 'true', 'false', '1', '0'.
 *
 * @const {Joi.BooleanSchema}
 *
 * @example
 * ```typescript
 * const querySchema = Joi.object({
 *   includeInactive: booleanQuerySchema
 * });
 * ```
 */
export const booleanQuerySchema = Joi.boolean()
  .optional()
  .description('Boolean query parameter');
