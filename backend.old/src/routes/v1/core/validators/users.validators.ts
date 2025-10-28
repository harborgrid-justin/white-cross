/**
 * Users Validation Schemas
 * Joi validation schemas for user management endpoints
 */

import Joi from 'joi';
import {
  paginationSchema,
  emailSchema,
  firstNameSchema,
  lastNameSchema,
  uuidParamSchema,
  booleanQuerySchema
} from '../../../shared/validators';

/**
 * User roles enum
 */
const userRoles = [
  'ADMIN',
  'NURSE',
  'SCHOOL_ADMIN',
  'DISTRICT_ADMIN',
  'COUNSELOR',
  'VIEWER'
];

/**
 * Role field schema
 */
export const roleSchema = Joi.string()
  .valid(...userRoles)
  .required()
  .description('User role')
  .messages({
    'any.only': `Role must be one of: ${userRoles.join(', ')}`,
    'any.required': 'Role is required'
  });

/**
 * Password schema
 */
export const passwordSchema = Joi.string()
  .min(8)
  .required()
  .description('Password (minimum 8 characters)')
  .messages({
    'string.min': 'Password must be at least 8 characters long',
    'any.required': 'Password is required'
  });

/**
 * List users query schema
 */
export const listUsersQuerySchema = paginationSchema.keys({
  search: Joi.string().optional().description('Search by name or email'),
  role: Joi.string()
    .valid(...userRoles)
    .optional()
    .description('Filter by role'),
  isActive: booleanQuerySchema.description('Filter by active status')
});

/**
 * Create user payload schema
 */
export const createUserSchema = Joi.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  role: roleSchema
});

/**
 * Update user payload schema
 */
export const updateUserSchema = Joi.object({
  email: emailSchema.optional(),
  firstName: firstNameSchema.optional(),
  lastName: lastNameSchema.optional(),
  role: Joi.string()
    .valid(...userRoles)
    .optional()
    .description('User role (admin only)'),
  isActive: Joi.boolean()
    .optional()
    .description('Active status (admin only)')
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

/**
 * Change password payload schema
 */
export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string()
    .required()
    .description('Current password')
    .messages({
      'any.required': 'Current password is required'
    }),
  newPassword: passwordSchema.description('New password')
});

/**
 * Reset password payload schema (admin only)
 */
export const resetPasswordSchema = Joi.object({
  newPassword: passwordSchema.description('New password to set')
});

/**
 * User ID parameter schema
 */
export const userIdParamSchema = uuidParamSchema;

/**
 * Role parameter schema
 */
export const roleParamSchema = Joi.object({
  role: Joi.string()
    .valid(...userRoles)
    .required()
    .description('User role to filter by')
    .messages({
      'any.only': `Role must be one of: ${userRoles.join(', ')}`,
      'any.required': 'Role is required'
    })
});
