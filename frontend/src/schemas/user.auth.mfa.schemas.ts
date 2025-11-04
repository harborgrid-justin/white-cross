/**
 * @fileoverview Multi-factor authentication validation schemas
 * @module schemas/user.auth.mfa
 *
 * Zod validation schemas for MFA setup, verification, and management.
 */

import { z } from 'zod';
import { phoneSchema, mfaMethodEnum } from './user.base.schemas';

// ==========================================
// MULTI-FACTOR AUTHENTICATION (MFA) SCHEMAS
// ==========================================

/**
 * Schema for setting up MFA for a user account
 *
 * Validates MFA setup with method-specific requirements:
 * - TOTP: No additional info needed
 * - SMS: Requires phone number
 * - Email: Uses account email
 * - Backup codes: Can provide 10 pre-generated codes
 *
 * @example
 * const mfaSetup = {
 *   userId: '123e4567-e89b-12d3-a456-426614174000',
 *   method: 'totp'
 * };
 * setupMFASchema.parse(mfaSetup);
 *
 * @example
 * const smsMfaSetup = {
 *   userId: '123e4567-e89b-12d3-a456-426614174000',
 *   method: 'sms',
 *   phoneNumber: '+12345678901'
 * };
 * setupMFASchema.parse(smsMfaSetup);
 */
export const setupMFASchema = z.object({
  /**
   * UUID of the user to set up MFA for
   */
  userId: z.string().uuid('Invalid user ID'),

  /**
   * MFA method to enable
   */
  method: mfaMethodEnum,

  /**
   * Phone number for SMS MFA (required if method is 'sms')
   */
  phoneNumber: phoneSchema.optional(),

  /**
   * Pre-generated backup codes (optional, must be exactly 10)
   */
  backupCodes: z.array(z.string()).length(10).optional(),
}).refine((data) => {
  // If SMS method, phone number is required
  if (data.method === 'sms' && !data.phoneNumber) {
    return false;
  }
  return true;
}, {
  message: 'Phone number is required for SMS MFA',
  path: ['phoneNumber'],
});

/**
 * TypeScript type for MFA setup input
 */
export type SetupMFAInput = z.infer<typeof setupMFASchema>;

/**
 * Schema for enabling MFA (simplified version)
 *
 * Simpler interface for enabling MFA without advanced options.
 * Used for basic MFA activation flows.
 *
 * @example
 * const enableMfa = {
 *   userId: '123e4567-e89b-12d3-a456-426614174000',
 *   method: 'totp'
 * };
 * enableMFASchema.parse(enableMfa);
 */
export const enableMFASchema = z.object({
  /**
   * UUID of the user to enable MFA for
   */
  userId: z.string().uuid('Invalid user ID'),

  /**
   * MFA method to enable
   */
  method: mfaMethodEnum,

  /**
   * Phone number for SMS MFA (required if method is 'sms')
   */
  phoneNumber: phoneSchema.optional(),
}).refine((data) => {
  // If SMS method, phone number is required
  if (data.method === 'sms' && !data.phoneNumber) {
    return false;
  }
  return true;
}, {
  message: 'Phone number is required for SMS MFA',
  path: ['phoneNumber'],
});

/**
 * TypeScript type for enabling MFA input
 */
export type EnableMFAInput = z.infer<typeof enableMFASchema>;

/**
 * Schema for verifying MFA code during setup or login
 *
 * Validates the 6-digit MFA code provided by the user.
 *
 * @example
 * const verification = {
 *   userId: '123e4567-e89b-12d3-a456-426614174000',
 *   code: '123456',
 *   method: 'totp'
 * };
 * verifyMFASchema.parse(verification);
 */
export const verifyMFASchema = z.object({
  /**
   * UUID of the user verifying MFA
   */
  userId: z.string().uuid('Invalid user ID'),

  /**
   * 6-digit MFA code
   */
  code: z.string().length(6, 'MFA code must be 6 digits'),

  /**
   * MFA method being verified
   */
  method: mfaMethodEnum,
});

/**
 * TypeScript type for MFA verification input
 */
export type VerifyMFAInput = z.infer<typeof verifyMFASchema>;

/**
 * Schema for disabling MFA for a user account
 *
 * Requires:
 * - Reason for disabling (audit trail)
 * - Admin override flag for emergency situations
 *
 * @example
 * const disableMfa = {
 *   userId: '123e4567-e89b-12d3-a456-426614174000',
 *   reason: 'User lost access to MFA device',
 *   adminOverride: false
 * };
 * disableMFASchema.parse(disableMfa);
 */
export const disableMFASchema = z.object({
  /**
   * UUID of the user to disable MFA for
   */
  userId: z.string().uuid('Invalid user ID'),

  /**
   * Required reason for disabling MFA (audit trail)
   * Minimum 10 characters for detailed explanation
   */
  reason: z.string().min(10, 'Reason must be at least 10 characters'),

  /**
   * Whether admin is overriding normal security policy
   * Default: false (requires elevated privileges)
   */
  adminOverride: z.boolean().default(false),
});

/**
 * TypeScript type for disabling MFA input
 */
export type DisableMFAInput = z.infer<typeof disableMFASchema>;
