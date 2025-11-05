/**
 * @fileoverview Role CRUD operation schemas
 * @module schemas/role.crud
 *
 * Validation schemas for creating, updating, and deleting roles.
 */

import { z } from 'zod';
import {
  roleTypeEnum,
  roleStatusEnum,
  permissionSchema
} from './role.base.schemas';

// ==========================================
// ROLE CREATE SCHEMA
// ==========================================

export const createRoleSchema = z.object({
  name: z.string()
    .min(3, 'Role name must be at least 3 characters')
    .max(50, 'Role name must be less than 50 characters')
    .regex(/^[a-zA-Z0-9_ ]+$/, 'Role name can only contain letters, numbers, spaces, and underscores')
    .trim(),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters')
    .trim(),
  type: roleTypeEnum.default('custom'),
  status: roleStatusEnum.default('active'),
  permissions: z.array(permissionSchema).min(1, 'At least one permission is required'),
  inheritsFrom: z.array(z.string().uuid()).optional(), // Parent role IDs
  priority: z.number().int().min(0).max(100).default(50), // For role hierarchy (higher = more important)
  isDefault: z.boolean().default(false), // Is this the default role for new users?
  metadata: z.record(z.any()).optional(),
});

export type CreateRoleInput = z.infer<typeof createRoleSchema>;

// ==========================================
// ROLE UPDATE SCHEMA
// ==========================================

export const updateRoleSchema = z.object({
  roleId: z.string().uuid('Invalid role ID'),
  name: z.string()
    .min(3, 'Role name must be at least 3 characters')
    .max(50, 'Role name must be less than 50 characters')
    .regex(/^[a-zA-Z0-9_ ]+$/, 'Role name can only contain letters, numbers, spaces, and underscores')
    .trim()
    .optional(),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters')
    .trim()
    .optional(),
  status: roleStatusEnum.optional(),
  permissions: z.array(permissionSchema).optional(),
  inheritsFrom: z.array(z.string().uuid()).optional(),
  priority: z.number().int().min(0).max(100).optional(),
  isDefault: z.boolean().optional(),
  metadata: z.record(z.any()).optional(),
});

export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;

// ==========================================
// ROLE DELETE SCHEMA
// ==========================================

export const deleteRoleSchema = z.object({
  roleId: z.string().uuid('Invalid role ID'),
  transferUsersTo: z.string().uuid('Invalid transfer role ID').optional(),
  reason: z.string().min(10, 'Deletion reason must be at least 10 characters'),
  forceDelete: z.boolean().default(false), // Delete even if users are assigned
});

export type DeleteRoleInput = z.infer<typeof deleteRoleSchema>;

// ==========================================
// ROLE CLONING SCHEMA
// ==========================================

export const cloneRoleSchema = z.object({
  sourceRoleId: z.string().uuid('Invalid source role ID'),
  newName: z.string()
    .min(3, 'Role name must be at least 3 characters')
    .max(50, 'Role name must be less than 50 characters')
    .trim(),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters')
    .trim()
    .optional(),
  includePermissions: z.boolean().default(true),
  includeInheritance: z.boolean().default(true),
});

export type CloneRoleInput = z.infer<typeof cloneRoleSchema>;
