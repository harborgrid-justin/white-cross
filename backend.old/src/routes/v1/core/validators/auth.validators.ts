/**
 * Authentication Validation Schemas
 * Joi validation schemas for auth endpoints
 */

import Joi from 'joi';
import { emailSchema, firstNameSchema, lastNameSchema } from '../../../shared/validators';

/**
 * User role enum
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
 * Register payload schema
 */
export const registerSchema = Joi.object({
  email: emailSchema,
  password: Joi.string()
    .min(8)
    .required()
    .description('Password (minimum 8 characters)')
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'any.required': 'Password is required'
    }),
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  role: Joi.string()
    .valid(...userRoles)
    .required()
    .description('User role')
    .messages({
      'any.only': `Role must be one of: ${userRoles.join(', ')}`,
      'any.required': 'Role is required'
    })
});

/**
 * Login payload schema
 */
export const loginSchema = Joi.object({
  email: emailSchema,
  password: Joi.string()
    .required()
    .description('Password')
    .messages({
      'any.required': 'Password is required'
    })
});
