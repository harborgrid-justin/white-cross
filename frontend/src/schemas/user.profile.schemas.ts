/**
 * @fileoverview User profile and status management validation schemas
 * @module schemas/user.profile
 *
 * Zod validation schemas for updating user profiles and managing user status.
 * Includes schemas for profile updates, status changes, and suspensions.
 */

import { z } from 'zod';
import {
  emailSchema,
  phoneSchema,
  ipAddressSchema,
  userRoleEnum,
  userStatusEnum,
  mfaMethodEnum,
} from './user.base.schemas';

// ==========================================
// USER UPDATE SCHEMA
// ==========================================

/**
 * Schema for updating user profile information
 *
 * All fields except userId are optional, allowing partial updates.
 * Validates that MFA method is provided if MFA is being enabled.
 *
 * @example
 * const updateData = {
 *   userId: '123e4567-e89b-12d3-a456-426614174000',
 *   firstName: 'Jane',
 *   lastName: 'Smith',
 *   role: 'nurse_manager',
 *   mfaRequired: true,
 *   mfaMethod: 'totp'
 * };
 * updateUserSchema.parse(updateData);
 */
export const updateUserSchema = z.object({
  /**
   * UUID of the user to update
   */
  userId: z.string().uuid('Invalid user ID'),

  /**
   * Updated email address (optional)
   */
  email: emailSchema.optional(),

  /**
   * Updated first name (optional)
   */
  firstName: z.string()
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters')
    .trim()
    .optional(),

  /**
   * Updated last name (optional)
   */
  lastName: z.string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be less than 50 characters')
    .trim()
    .optional(),

  /**
   * Updated phone number (optional)
   */
  phone: phoneSchema,

  /**
   * Updated role (optional)
   */
  role: userRoleEnum.optional(),

  /**
   * Updated status (optional)
   */
  status: userStatusEnum.optional(),

  /**
   * Whether to require MFA (optional)
   */
  mfaRequired: z.boolean().optional(),

  /**
   * MFA method if enabling MFA (optional)
   */
  mfaMethod: mfaMethodEnum.optional(),

  /**
   * Updated IP restrictions (optional)
   */
  ipRestrictions: z.array(ipAddressSchema).optional(),

  /**
   * Additional metadata updates (optional)
   */
  metadata: z.record(z.string(), z.unknown()).optional(),
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
 * TypeScript type for user update input
 */
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

// ==========================================
// USER STATUS TOGGLE SCHEMA
// ==========================================

/**
 * Schema for changing user account status
 *
 * Allows status changes (active, inactive, suspended, etc.) with:
 * - Required reason for audit trail
 * - Optional user notification
 *
 * @example
 * const statusChange = {
 *   userId: '123e4567-e89b-12d3-a456-426614174000',
 *   status: 'inactive',
 *   reason: 'User left organization',
 *   notifyUser: true
 * };
 * toggleUserStatusSchema.parse(statusChange);
 */
export const toggleUserStatusSchema = z.object({
  /**
   * UUID of the user to update
   */
  userId: z.string().uuid('Invalid user ID'),

  /**
   * New status to set
   */
  status: userStatusEnum,

  /**
   * Required reason for status change (audit trail)
   * Minimum 5 characters for meaningful explanation
   */
  reason: z.string().min(5, 'Reason must be at least 5 characters'),

  /**
   * Whether to send notification to the user
   * Default: true
   */
  notifyUser: z.boolean().default(true),
});

/**
 * TypeScript type for status toggle input
 */
export type ToggleUserStatusInput = z.infer<typeof toggleUserStatusSchema>;

// ==========================================
// USER SUSPENSION SCHEMA
// ==========================================

/**
 * Schema for suspending a user account
 *
 * Provides temporary suspension with:
 * - Required suspension reason
 * - Optional suspension duration (until date)
 * - User notification option
 *
 * @example
 * const suspensionData = {
 *   userId: '123e4567-e89b-12d3-a456-426614174000',
 *   reason: 'Policy violation - investigation pending',
 *   suspendUntil: '2024-12-31T23:59:59Z',
 *   notifyUser: true
 * };
 * suspendUserSchema.parse(suspensionData);
 */
export const suspendUserSchema = z.object({
  /**
   * UUID of the user to suspend
   */
  userId: z.string().uuid('Invalid user ID'),

  /**
   * Required reason for suspension (audit trail)
   * Minimum 10 characters for detailed explanation
   */
  reason: z.string().min(10, 'Suspension reason must be at least 10 characters'),

  /**
   * Optional date/time when suspension expires
   * If not provided, suspension is indefinite until manually lifted
   */
  suspendUntil: z.string().datetime().optional(),

  /**
   * Whether to send notification to the user
   * Default: true
   */
  notifyUser: z.boolean().default(true),
});

/**
 * TypeScript type for user suspension input
 */
export type SuspendUserInput = z.infer<typeof suspendUserSchema>;

// ==========================================
// BULK USER OPERATIONS SCHEMA
// ==========================================

/**
 * Schema for bulk updating multiple users
 *
 * Allows updating status, role, or MFA requirements for multiple users at once.
 * Safety limits:
 * - Maximum 100 users per operation
 * - Optional notification to affected users
 *
 * @example
 * const bulkUpdateData = {
 *   userIds: [
 *     '123e4567-e89b-12d3-a456-426614174000',
 *     '987e6543-e21b-12d3-a456-426614174999'
 *   ],
 *   updates: {
 *     status: 'active',
 *     mfaRequired: true
 *   },
 *   notifyUsers: false
 * };
 * bulkUpdateUsersSchema.parse(bulkUpdateData);
 */
export const bulkUpdateUsersSchema = z.object({
  /**
   * Array of user UUIDs to update
   * Minimum: 1, Maximum: 100 users per operation
   */
  userIds: z.array(z.string().uuid()).min(1, 'At least one user ID is required').max(100, 'Maximum 100 users at once'),

  /**
   * Updates to apply to all selected users
   * All fields are optional, allowing selective updates
   */
  updates: z.object({
    /**
     * New status to set (optional)
     */
    status: userStatusEnum.optional(),

    /**
     * New role to assign (optional)
     */
    role: userRoleEnum.optional(),

    /**
     * Whether to require MFA (optional)
     */
    mfaRequired: z.boolean().optional(),
  }),

  /**
   * Whether to send notifications to all affected users
   * Default: false (no notifications for bulk operations)
   */
  notifyUsers: z.boolean().default(false),
});

/**
 * TypeScript type for bulk user updates input
 */
export type BulkUpdateUsersInput = z.infer<typeof bulkUpdateUsersSchema>;
