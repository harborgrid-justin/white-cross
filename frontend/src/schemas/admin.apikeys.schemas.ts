/**
 * @fileoverview Validation schemas for API key management
 * @module schemas/admin/apikeys
 *
 * Zod validation schemas for API key operations including creation,
 * updating, revocation, rotation, and usage tracking.
 */

import { z } from 'zod';

// ==========================================
// API KEY ENUMS
// ==========================================

/**
 * API key permission enum
 */
export const apiKeyPermissionEnum = z.enum([
  'read:students',
  'write:students',
  'read:health_records',
  'write:health_records',
  'read:medications',
  'write:medications',
  'read:appointments',
  'write:appointments',
  'read:incidents',
  'write:incidents',
  'read:inventory',
  'write:inventory',
  'admin:all',
  'custom'
]);

/**
 * API key status enum
 */
export const apiKeyStatusEnum = z.enum([
  'active',
  'inactive',
  'expired',
  'revoked'
]);

// ==========================================
// API KEY SCHEMAS
// ==========================================

/**
 * Create API key schema
 */
export const createAPIKeySchema = z.object({
  name: z.string()
    .min(3, 'API key name must be at least 3 characters')
    .max(100, 'API key name must be less than 100 characters')
    .trim(),
  description: z.string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  permissions: z.array(apiKeyPermissionEnum)
    .min(1, 'At least one permission is required'),
  ipRestrictions: z.array(z.string().regex(
    /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/,
    'Invalid IP address or CIDR notation'
  )).optional(),
  rateLimit: z.number()
    .int()
    .min(1)
    .max(10000)
    .default(100), // requests per minute
  expiresAt: z.string().datetime().optional(),
  metadata: z.record(z.any()).optional(),
});

export type CreateAPIKeyInput = z.infer<typeof createAPIKeySchema>;

/**
 * Update API key schema
 */
export const updateAPIKeySchema = z.object({
  keyId: z.string().uuid('Invalid API key ID'),
  name: z.string()
    .min(3, 'API key name must be at least 3 characters')
    .max(100, 'API key name must be less than 100 characters')
    .trim()
    .optional(),
  description: z.string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  permissions: z.array(apiKeyPermissionEnum).optional(),
  ipRestrictions: z.array(z.string()).optional(),
  rateLimit: z.number().int().min(1).max(10000).optional(),
  status: apiKeyStatusEnum.optional(),
  expiresAt: z.string().datetime().optional(),
  metadata: z.record(z.any()).optional(),
});

export type UpdateAPIKeyInput = z.infer<typeof updateAPIKeySchema>;

/**
 * Revoke API key schema
 */
export const revokeAPIKeySchema = z.object({
  keyId: z.string().uuid('Invalid API key ID'),
  reason: z.string()
    .min(10, 'Revocation reason must be at least 10 characters')
    .max(500, 'Revocation reason must be less than 500 characters'),
  notifyOwner: z.boolean().default(true),
});

export type RevokeAPIKeyInput = z.infer<typeof revokeAPIKeySchema>;

/**
 * Rotate API key schema
 */
export const rotateAPIKeySchema = z.object({
  keyId: z.string().uuid('Invalid API key ID'),
  overlapPeriod: z.number()
    .int()
    .min(0)
    .max(30)
    .default(7), // days both keys are valid
  notifyOwner: z.boolean().default(true),
});

export type RotateAPIKeyInput = z.infer<typeof rotateAPIKeySchema>;

/**
 * List API keys schema
 */
export const listAPIKeysSchema = z.object({
  userId: z.string().uuid().optional(), // Filter by user
  status: apiKeyStatusEnum.optional(),
  includeExpired: z.boolean().default(false),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(50),
});

export type ListAPIKeysInput = z.infer<typeof listAPIKeysSchema>;

/**
 * API key usage schema
 */
export const getAPIKeyUsageSchema = z.object({
  keyId: z.string().uuid('Invalid API key ID'),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  groupBy: z.enum(['hour', 'day', 'week', 'month']).default('day'),
});

export type GetAPIKeyUsageInput = z.infer<typeof getAPIKeyUsageSchema>;
