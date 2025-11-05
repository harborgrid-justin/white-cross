/**
 * @fileoverview Authentication Constants and Validation Schemas
 * @module lib/actions/auth.constants
 *
 * Shared constants and validation schemas for authentication operations.
 * This file does NOT use "use server" so constants and schemas can be safely
 * imported in both client and server components.
 */

import { z } from 'zod';

// ==========================================
// CACHE TAGS
// ==========================================

/**
 * Cache tags for authentication operations
 */
export const AUTH_CACHE_TAGS = {
  AUTH: 'auth-data',
} as const;

// ==========================================
// VALIDATION SCHEMAS
// ==========================================

/**
 * Password validation requirements for security compliance
 *
 * Requirements:
 * - Minimum 12 characters (industry best practice, stronger than 8)
 * - At least one uppercase letter (A-Z)
 * - At least one lowercase letter (a-z)
 * - At least one number (0-9)
 * - At least one special character (!@#$%^&*()_+-=[]{}|;:,.<>?)
 *
 * These requirements meet NIST SP 800-63B guidelines and healthcare
 * security standards for protecting sensitive patient information.
 */
const PASSWORD_MIN_LENGTH = 12;
const PASSWORD_REGEX = {
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  number: /[0-9]/,
  special: /[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/,
};

/**
 * Password validation schema with comprehensive complexity requirements
 */
export const passwordValidation = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters`)
  .regex(
    PASSWORD_REGEX.uppercase,
    'Password must contain at least one uppercase letter'
  )
  .regex(
    PASSWORD_REGEX.lowercase,
    'Password must contain at least one lowercase letter'
  )
  .regex(
    PASSWORD_REGEX.number,
    'Password must contain at least one number'
  )
  .regex(
    PASSWORD_REGEX.special,
    'Password must contain at least one special character (!@#$%^&*()_+-=[]{}|;:,.<>?)'
  );

/**
 * Login form validation schema
 */
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  // Note: We don't enforce complexity on login to allow users with older passwords to sign in
  // Password complexity is enforced on registration and password changes
});

/**
 * Registration/signup form validation schema
 */
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: passwordValidation,
  confirmPassword: z.string().min(1, 'Password confirmation is required'),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  }
);

/**
 * Change password form validation schema
 * Enforces strong password requirements for enhanced security
 */
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordValidation,
  confirmPassword: z.string().min(1, 'Password confirmation is required'),
}).refine(
  (data: { currentPassword: string; newPassword: string; confirmPassword: string }) =>
    data.newPassword === data.confirmPassword,
  {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  }
).refine(
  (data: { currentPassword: string; newPassword: string; confirmPassword: string }) =>
    data.newPassword !== data.currentPassword,
  {
    message: "New password must be different from current password",
    path: ['newPassword'],
  }
);

/**
 * Reset password form validation schema
 * Used for password reset flow (forgot password)
 */
export const resetPasswordSchema = z.object({
  password: passwordValidation,
  confirmPassword: z.string().min(1, 'Password confirmation is required'),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  }
);
