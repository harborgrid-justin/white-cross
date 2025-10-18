/**
 * LOC: 5DDEB865CC
 * WC-GEN-336 | schemas.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - None (leaf node)
 *
 * DOWNSTREAM (imported by):
 *   - None (not imported)
 */

/**
 * WC-GEN-336 | schemas.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: Independent module | Dependencies: joi
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: constants, default export | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import Joi from 'joi';

/**
 * Shared validation schemas
 * Common validation patterns used across the application
 */

/**
 * Custom password validation rules
 * - Minimum 12 characters for healthcare application
 * - Must contain uppercase, lowercase, number, and special character
 */
const passwordComplexityPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

/**
 * Custom Joi password validator
 */
export const passwordValidator = Joi.string()
  .min(12)
  .max(128)
  .pattern(passwordComplexityPattern)
  .messages({
    'string.min': 'Password must be at least 12 characters long',
    'string.max': 'Password cannot exceed 128 characters',
    'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)'
  });

/**
 * Email validation with additional security checks
 */
export const emailValidator = Joi.string()
  .email({ tlds: { allow: true } })
  .max(255)
  .lowercase()
  .trim()
  .messages({
    'string.email': 'Must be a valid email address',
    'string.max': 'Email cannot exceed 255 characters'
  });

/**
 * Phone number validation (US format)
 */
export const phoneValidator = Joi.string()
  .pattern(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/)
  .messages({
    'string.pattern.base': 'Phone number must be in valid format (e.g., +1-555-123-4567, (555) 123-4567, 555.123.4567)'
  });

/**
 * UUID validation
 */
export const uuidValidator = Joi.string()
  .uuid()
  .messages({
    'string.guid': 'Must be a valid UUID'
  });

/**
 * Name validation (first/last names)
 */
export const nameValidator = Joi.string()
  .min(1)
  .max(100)
  .pattern(/^[a-zA-Z\s'-]+$/)
  .messages({
    'string.min': 'Name is required',
    'string.max': 'Name cannot exceed 100 characters',
    'string.pattern.base': 'Name can only contain letters, spaces, hyphens, and apostrophes'
  });

/**
 * Pagination schema
 */
export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  sortBy: Joi.string().valid('createdAt', 'updatedAt', 'name', 'email').default('createdAt'),
  sortOrder: Joi.string().valid('ASC', 'DESC').default('DESC')
});

export default {
  passwordValidator,
  emailValidator,
  phoneValidator,
  uuidValidator,
  nameValidator,
  paginationSchema
};