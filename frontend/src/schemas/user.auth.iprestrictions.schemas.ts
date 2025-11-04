/**
 * @fileoverview IP restriction validation schemas
 * @module schemas/user.auth.iprestrictions
 *
 * Zod validation schemas for IP access control and restriction management.
 */

import { z } from 'zod';
import { ipAddressSchema } from './user.base.schemas';

// ==========================================
// IP RESTRICTION SCHEMAS
// ==========================================

/**
 * Schema for updating user IP access restrictions
 *
 * Manages IP whitelisting/restriction for user accounts:
 * - Supports IPv4 and CIDR notation
 * - Can replace or merge with existing restrictions
 * - Optional user notification
 *
 * @example
 * const ipRestriction = {
 *   userId: '123e4567-e89b-12d3-a456-426614174000',
 *   ipAddresses: ['192.168.1.0/24', '10.0.0.1'],
 *   replaceExisting: true,
 *   notifyUser: true
 * };
 * updateIPRestrictionsSchema.parse(ipRestriction);
 */
export const updateIPRestrictionsSchema = z.object({
  /**
   * UUID of the user to update IP restrictions for
   */
  userId: z.string().uuid('Invalid user ID'),

  /**
   * Array of IP addresses or CIDR ranges to allow
   * Minimum: 1 IP address required
   */
  ipAddresses: z.array(ipAddressSchema).min(1, 'At least one IP address is required'),

  /**
   * Whether to replace existing restrictions (true) or merge (false)
   * Default: true (replace)
   */
  replaceExisting: z.boolean().default(true),

  /**
   * Whether to notify user of IP restriction changes
   * Default: true
   */
  notifyUser: z.boolean().default(true),
});

/**
 * TypeScript type for updating IP restrictions input
 */
export type UpdateIPRestrictionsInput = z.infer<typeof updateIPRestrictionsSchema>;

/**
 * Schema for removing all IP restrictions from a user account
 *
 * Requires reason for audit trail and optional user notification.
 *
 * @example
 * const removeRestrictions = {
 *   userId: '123e4567-e89b-12d3-a456-426614174000',
 *   reason: 'User now working remotely',
 *   notifyUser: true
 * };
 * removeIPRestrictionsSchema.parse(removeRestrictions);
 */
export const removeIPRestrictionsSchema = z.object({
  /**
   * UUID of the user to remove IP restrictions from
   */
  userId: z.string().uuid('Invalid user ID'),

  /**
   * Required reason for removing restrictions (audit trail)
   * Minimum 5 characters for meaningful explanation
   */
  reason: z.string().min(5, 'Reason must be at least 5 characters'),

  /**
   * Whether to notify user of IP restriction removal
   * Default: true
   */
  notifyUser: z.boolean().default(true),
});

/**
 * TypeScript type for removing IP restrictions input
 */
export type RemoveIPRestrictionsInput = z.infer<typeof removeIPRestrictionsSchema>;
