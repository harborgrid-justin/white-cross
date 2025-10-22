/**
 * Shared Validation Schemas
 * Common Joi validation schemas used across v1 routes
 */

import Joi from 'joi';

/**
 * Pagination schema
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
 * Email schema
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
 * First name schema
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
 * Last name schema
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
 * UUID parameter schema
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
 * Boolean query parameter schema
 */
export const booleanQuerySchema = Joi.boolean()
  .optional()
  .description('Boolean query parameter');
