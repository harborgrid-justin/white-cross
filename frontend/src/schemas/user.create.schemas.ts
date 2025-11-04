/**
 * @fileoverview User creation and deletion validation schemas
 * @module schemas/user.create
 *
 * Zod validation schemas for user creation and deletion operations.
 * Includes schemas for creating new users and safely deleting existing users.
 */

import { z } from 'zod';
import {
  emailSchema,
  passwordSchema,
  phoneSchema,
  ipAddressSchema,
  userRoleEnum,
  userStatusEnum,
  mfaMethodEnum,
} from './user.base.schemas';

// ==========================================
// USER CREATE SCHEMA
// ==========================================

/**
 * Schema for creating a new user account
 *
 * Validates all required fields for user creation and ensures:
 * - Password confirmation matches password
 * - MFA method is provided if MFA is required
 * - Role and status are valid enum values
 *
 * @example
 * const userData = {
 *   email: 'user@example.com',
 *   password: 'SecureP@ssw0rd123',
 *   confirmPassword: 'SecureP@ssw0rd123',
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   role: 'staff',
 *   status: 'active',
 *   mfaRequired: true,
 *   mfaMethod: 'totp',
 *   sendWelcomeEmail: true,
 *   forcePasswordChange: true
 * };
 * createUserSchema.parse(userData);
 */
export const createUserSchema = z.object({
  /**
   * User's email address (unique identifier)
   */
  email: emailSchema,

  /**
   * Initial password for the account
   */
  password: passwordSchema,

  /**
   * Password confirmation for validation
   */
  confirmPassword: z.string(),

  /**
   * User's first name
   */
  firstName: z.string()
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters')
    .trim(),

  /**
   * User's last name
   */
  lastName: z.string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be less than 50 characters')
    .trim(),

  /**
   * User's phone number (optional, E.164 format)
   */
  phone: phoneSchema,

  /**
   * User's role in the system
   */
  role: userRoleEnum,

  /**
   * Initial account status (defaults to 'active')
   */
  status: userStatusEnum.default('active'),

  /**
   * Whether MFA is required for this user
   */
  mfaRequired: z.boolean().default(false),

  /**
   * MFA method if MFA is required
   */
  mfaMethod: mfaMethodEnum.optional(),

  /**
   * IP address restrictions (optional, array of IP/CIDR)
   */
  ipRestrictions: z.array(ipAddressSchema).optional(),

  /**
   * Whether to send welcome email to the user
   */
  sendWelcomeEmail: z.boolean().default(true),

  /**
   * Whether to force password change on first login
   */
  forcePasswordChange: z.boolean().default(true),

  /**
   * Additional metadata for the user (flexible key-value pairs)
   */
  metadata: z.record(z.string(), z.unknown()).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
}).refine((data) => {
  // If MFA is required, a method must be selected
  if (data.mfaRequired && !data.mfaMethod) {
    return false;
  }
  return true;
}, {
  message: 'MFA method is required when MFA is enabled',
  path: ['mfaMethod'],
});

/**
 * TypeScript type for user creation input
 */
export type CreateUserInput = z.infer<typeof createUserSchema>;

// ==========================================
// USER DELETE SCHEMA
// ==========================================

/**
 * Schema for deleting a user account
 *
 * Provides safe deletion with options for:
 * - Data transfer to another user
 * - Soft delete vs permanent delete
 * - Required deletion reason for audit trail
 *
 * @example
 * const deleteData = {
 *   userId: '123e4567-e89b-12d3-a456-426614174000',
 *   reason: 'User requested account deletion per GDPR',
 *   permanentDelete: false, // Soft delete by default
 *   transferDataTo: '987e6543-e21b-12d3-a456-426614174999' // Optional
 * };
 * deleteUserSchema.parse(deleteData);
 */
export const deleteUserSchema = z.object({
  /**
   * UUID of the user to delete
   */
  userId: z.string().uuid('Invalid user ID'),

  /**
   * UUID of user to transfer data to (optional)
   * Used when reassigning records before deletion
   */
  transferDataTo: z.string().uuid('Invalid transfer user ID').optional(),

  /**
   * Required reason for deletion (audit trail)
   * Minimum 10 characters for meaningful explanation
   */
  reason: z.string().min(10, 'Deletion reason must be at least 10 characters'),

  /**
   * Whether to permanently delete (true) or soft delete (false)
   * Default: false (soft delete for data retention)
   */
  permanentDelete: z.boolean().default(false),
});

/**
 * TypeScript type for user deletion input
 */
export type DeleteUserInput = z.infer<typeof deleteUserSchema>;

// ==========================================
// BULK USER OPERATIONS SCHEMA
// ==========================================

/**
 * Schema for bulk user deletion
 *
 * Allows deletion of multiple users at once with safety limits:
 * - Maximum 50 users per operation
 * - Required deletion reason
 * - Soft delete vs permanent delete option
 *
 * @example
 * const bulkDeleteData = {
 *   userIds: [
 *     '123e4567-e89b-12d3-a456-426614174000',
 *     '987e6543-e21b-12d3-a456-426614174999'
 *   ],
 *   reason: 'Bulk cleanup of inactive test accounts',
 *   permanentDelete: false
 * };
 * bulkDeleteUsersSchema.parse(bulkDeleteData);
 */
export const bulkDeleteUsersSchema = z.object({
  /**
   * Array of user UUIDs to delete
   * Minimum: 1, Maximum: 50 users per operation
   */
  userIds: z.array(z.string().uuid()).min(1, 'At least one user ID is required').max(50, 'Maximum 50 users at once'),

  /**
   * Required reason for bulk deletion (audit trail)
   * Minimum 10 characters for meaningful explanation
   */
  reason: z.string().min(10, 'Deletion reason must be at least 10 characters'),

  /**
   * Whether to permanently delete (true) or soft delete (false)
   * Default: false (soft delete for data retention)
   */
  permanentDelete: z.boolean().default(false),
});

/**
 * TypeScript type for bulk user deletion input
 */
export type BulkDeleteUsersInput = z.infer<typeof bulkDeleteUsersSchema>;
