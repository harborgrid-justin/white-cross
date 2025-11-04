/**
 * @fileoverview Validation schemas for security and access control
 * @module schemas/admin/security
 *
 * Zod validation schemas for MFA verification, IP access validation,
 * and other security-related admin operations.
 */

import { z } from 'zod';

// ==========================================
// MFA VERIFICATION SCHEMA (for admin actions)
// ==========================================

/**
 * MFA verification schema for admin actions
 */
export const adminMFAVerificationSchema = z.object({
  code: z.string().length(6, 'MFA code must be 6 digits'),
  action: z.string().min(1, 'Action is required'), // e.g., 'delete_user', 'revoke_api_key'
  resourceId: z.string().optional(), // ID of resource being acted upon
  metadata: z.record(z.any()).optional(),
});

export type AdminMFAVerificationInput = z.infer<typeof adminMFAVerificationSchema>;

// ==========================================
// IP VALIDATION HELPER
// ==========================================

/**
 * Validate IP address against whitelist
 */
export const validateIPAccessSchema = z.object({
  ipAddress: z.string().regex(/^(\d{1,3}\.){3}\d{1,3}$/, 'Invalid IP address'),
  userId: z.string().uuid().optional(),
  action: z.string().optional(),
});

export type ValidateIPAccessInput = z.infer<typeof validateIPAccessSchema>;
