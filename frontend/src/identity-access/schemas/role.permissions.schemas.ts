/**
 * @fileoverview Permission management schemas
 * @module schemas/role.permissions
 *
 * Validation schemas for permission assignment, validation, and custom permissions.
 */

import { z } from 'zod';
import {
  permissionSchema,
  permissionResourceEnum,
  permissionActionEnum,
  permissionScopeEnum
} from './role.base.schemas';

// ==========================================
// PERMISSION ASSIGNMENT SCHEMA
// ==========================================

export const assignPermissionsSchema = z.object({
  roleId: z.string().uuid('Invalid role ID'),
  permissions: z.array(permissionSchema).min(1, 'At least one permission is required'),
  replaceExisting: z.boolean().default(false), // true = replace all, false = add to existing
  validateHierarchy: z.boolean().default(true), // Ensure child roles don't exceed parent permissions
});

export type AssignPermissionsInput = z.infer<typeof assignPermissionsSchema>;

export const removePermissionsSchema = z.object({
  roleId: z.string().uuid('Invalid role ID'),
  permissionIds: z.array(z.string().uuid()).min(1, 'At least one permission ID is required'),
  reason: z.string().min(5, 'Reason must be at least 5 characters'),
  notifyUsers: z.boolean().default(false),
});

export type RemovePermissionsInput = z.infer<typeof removePermissionsSchema>;

// ==========================================
// EFFECTIVE PERMISSIONS SCHEMA
// ==========================================

export const getEffectivePermissionsSchema = z.object({
  roleId: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  includeInherited: z.boolean().default(true),
  includeCustom: z.boolean().default(true), // Include user-specific permissions
}).refine((data) => {
  // Either roleId or userId must be provided
  return data.roleId || data.userId;
}, {
  message: 'Either roleId or userId must be provided',
  path: ['roleId'],
});

export type GetEffectivePermissionsInput = z.infer<typeof getEffectivePermissionsSchema>;

// ==========================================
// PERMISSION VALIDATION SCHEMA
// ==========================================

export const validatePermissionSchema = z.object({
  userId: z.string().uuid().optional(),
  roleId: z.string().uuid().optional(),
  resource: permissionResourceEnum,
  action: permissionActionEnum,
  scope: permissionScopeEnum.optional(),
  context: z.record(z.any()).optional(), // Additional context for condition evaluation
}).refine((data) => {
  // Either roleId or userId must be provided
  return data.roleId || data.userId;
}, {
  message: 'Either roleId or userId must be provided',
  path: ['roleId'],
});

export type ValidatePermissionInput = z.infer<typeof validatePermissionSchema>;

// ==========================================
// CUSTOM PERMISSION CREATION SCHEMA
// ==========================================

export const createCustomPermissionSchema = z.object({
  resource: z.string()
    .min(3, 'Resource name must be at least 3 characters')
    .max(50, 'Resource name must be less than 50 characters')
    .regex(/^[a-z_]+$/, 'Resource name can only contain lowercase letters and underscores'),
  action: z.string()
    .min(3, 'Action name must be at least 3 characters')
    .max(50, 'Action name must be less than 50 characters')
    .regex(/^[a-z_]+$/, 'Action name can only contain lowercase letters and underscores'),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(200, 'Description must be less than 200 characters'),
  scope: permissionScopeEnum.default('school'),
  conditions: z.record(z.any()).optional(),
  requiresApproval: z.boolean().default(true), // Custom permissions require admin approval
});

export type CreateCustomPermissionInput = z.infer<typeof createCustomPermissionSchema>;

// ==========================================
// PERMISSION CONFLICT DETECTION SCHEMA
// ==========================================

export const detectPermissionConflictsSchema = z.object({
  roleId: z.string().uuid('Invalid role ID').optional(),
  userId: z.string().uuid('Invalid user ID').optional(),
  newPermissions: z.array(permissionSchema).optional(),
}).refine((data) => {
  // Either roleId or userId must be provided
  return data.roleId || data.userId;
}, {
  message: 'Either roleId or userId must be provided',
  path: ['roleId'],
});

export type DetectPermissionConflictsInput = z.infer<typeof detectPermissionConflictsSchema>;

// ==========================================
// PERMISSION MATRIX SCHEMA
// ==========================================

export const getPermissionMatrixSchema = z.object({
  roleIds: z.array(z.string().uuid()).optional(), // Specific roles, or all if not provided
  resources: z.array(permissionResourceEnum).optional(), // Specific resources, or all if not provided
  includeInherited: z.boolean().default(true),
  format: z.enum(['grid', 'tree', 'list']).default('grid'),
});

export type GetPermissionMatrixInput = z.infer<typeof getPermissionMatrixSchema>;
