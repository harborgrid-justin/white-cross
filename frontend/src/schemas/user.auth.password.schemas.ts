/**
 * @fileoverview Password management validation schemas
 * @module schemas/user.auth.password
 *
 * Zod validation schemas for password reset and management operations.
 */

import { z } from 'zod';
import { passwordSchema } from './user.base.schemas';

// ==========================================
// PASSWORD MANAGEMENT SCHEMAS
// ==========================================

/**
 * Schema for resetting a user's password (admin action)
 *
 * Allows administrators to:
 * - Generate and send reset email
 * - Set a new password directly
 * - Force password change on next login
 * - Notify user of password change
 *
 * @example
 * const resetData = {
 *   userId: '123e4567-e89b-12d3-a456-426614174000',
 *   sendResetEmail: true,
 *   forcePasswordChange: true,
 *   notifyUser: true
 * };
 * resetUserPasswordSchema.parse(resetData);
 */
export const resetUserPasswordSchema = z.object({
  /**
   * UUID of the user whose password to reset
   */
  userId: z.string().uuid('Invalid user ID'),

  /**
   * New password to set (optional - if not provided, sends reset email)
   */
  newPassword: passwordSchema.optional(),

  /**
   * Whether to send password reset email to user
   * Default: true
   */
  sendResetEmail: z.boolean().default(true),

  /**
   * Whether to force password change on next login
   * Default: true (recommended for security)
   */
  forcePasswordChange: z.boolean().default(true),

  /**
   * Whether to notify user of password change
   * Default: true
   */
  notifyUser: z.boolean().default(true),
});

/**
 * TypeScript type for password reset input
 */
export type ResetUserPasswordInput = z.infer<typeof resetUserPasswordSchema>;

/**
 * Alias for backward compatibility
 */
export const resetPasswordSchema = resetUserPasswordSchema;
export type ResetPasswordInput = ResetUserPasswordInput;
