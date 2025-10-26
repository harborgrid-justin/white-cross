/**
 * Authentication Validation Schemas
 *
 * Validation schemas for authentication and user account management.
 */

import { z } from 'zod';
import { emailSchema } from '../common/email.schemas';
import { phoneSchema, optionalPhoneSchema } from '../common/phone.schemas';

/**
 * Password requirements
 */
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

/**
 * Login schema
 */
export const loginSchema = z.object({
  email: emailSchema,

  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required'),

  rememberMe: z.boolean().default(false).optional()
});

/**
 * Register schema
 */
export const registerSchema = z.object({
  firstName: z
    .string({ required_error: 'First name is required' })
    .min(1, 'First name is required')
    .max(100, 'First name must be less than 100 characters')
    .trim(),

  lastName: z
    .string({ required_error: 'Last name is required' })
    .min(1, 'Last name is required')
    .max(100, 'Last name must be less than 100 characters')
    .trim(),

  email: emailSchema,

  phone: optionalPhoneSchema,

  password: z
    .string({ required_error: 'Password is required' })
    .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters`)
    .regex(
      PASSWORD_REGEX,
      'Password must contain uppercase, lowercase, number, and special character'
    ),

  confirmPassword: z
    .string({ required_error: 'Please confirm your password' })
    .min(1, 'Please confirm your password'),

  agreeToTerms: z
    .boolean({ required_error: 'You must agree to the terms and conditions' })
    .refine((val) => val === true, {
      message: 'You must agree to the terms and conditions'
    })
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

/**
 * Forgot password schema
 */
export const forgotPasswordSchema = z.object({
  email: emailSchema
});

/**
 * Reset password schema
 */
export const resetPasswordSchema = z.object({
  token: z
    .string({ required_error: 'Reset token is required' })
    .min(1, 'Reset token is required'),

  password: z
    .string({ required_error: 'Password is required' })
    .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters`)
    .regex(
      PASSWORD_REGEX,
      'Password must contain uppercase, lowercase, number, and special character'
    ),

  confirmPassword: z
    .string({ required_error: 'Please confirm your password' })
    .min(1, 'Please confirm your password')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

/**
 * Change password schema
 */
export const changePasswordSchema = z.object({
  currentPassword: z
    .string({ required_error: 'Current password is required' })
    .min(1, 'Current password is required'),

  newPassword: z
    .string({ required_error: 'New password is required' })
    .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters`)
    .regex(
      PASSWORD_REGEX,
      'Password must contain uppercase, lowercase, number, and special character'
    ),

  confirmPassword: z
    .string({ required_error: 'Please confirm your new password' })
    .min(1, 'Please confirm your new password')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: 'New password must be different from current password',
  path: ['newPassword']
});

/**
 * Update profile schema
 */
export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(100, 'First name must be less than 100 characters')
    .trim()
    .optional(),

  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(100, 'Last name must be less than 100 characters')
    .trim()
    .optional(),

  phone: optionalPhoneSchema,

  bio: z
    .string()
    .max(500, 'Bio must be less than 500 characters')
    .optional()
    .nullable(),

  notificationPreferences: z.object({
    email: z.boolean().default(true),
    sms: z.boolean().default(false),
    push: z.boolean().default(true)
  }).optional()
});

/**
 * Email verification schema
 */
export const verifyEmailSchema = z.object({
  token: z
    .string({ required_error: 'Verification token is required' })
    .min(1, 'Verification token is required')
});

/**
 * Two-factor authentication setup schema
 */
export const setup2FASchema = z.object({
  method: z.enum(['sms', 'email', 'authenticator'], {
    required_error: '2FA method is required'
  }),

  phone: z.string().optional()
}).refine(
  (data) => {
    if (data.method === 'sms') {
      return !!data.phone;
    }
    return true;
  },
  {
    message: 'Phone number is required for SMS 2FA',
    path: ['phone']
  }
);

/**
 * Two-factor authentication verification schema
 */
export const verify2FASchema = z.object({
  code: z
    .string({ required_error: 'Verification code is required' })
    .length(6, 'Verification code must be 6 digits')
    .regex(/^\d{6}$/, 'Verification code must be 6 digits')
});

/**
 * Type exports
 */
export type Login = z.infer<typeof loginSchema>;
export type Register = z.infer<typeof registerSchema>;
export type ForgotPassword = z.infer<typeof forgotPasswordSchema>;
export type ResetPassword = z.infer<typeof resetPasswordSchema>;
export type ChangePassword = z.infer<typeof changePasswordSchema>;
export type UpdateProfile = z.infer<typeof updateProfileSchema>;
export type VerifyEmail = z.infer<typeof verifyEmailSchema>;
export type Setup2FA = z.infer<typeof setup2FASchema>;
export type Verify2FA = z.infer<typeof verify2FASchema>;
