/**
 * @fileoverview Role operation schemas
 * @module schemas/role.operations
 *
 * Validation schemas for role hierarchy, search, bulk operations, and exports.
 */

import { z } from 'zod';
import { roleTypeEnum, roleStatusEnum, permissionResourceEnum } from './role.base.schemas';

// ==========================================
// ROLE HIERARCHY SCHEMA
// ==========================================

export const updateRoleHierarchySchema = z.object({
  roleId: z.string().uuid('Invalid role ID'),
  parentRoleIds: z.array(z.string().uuid()),
  validateCircular: z.boolean().default(true), // Prevent circular inheritance
});

export type UpdateRoleHierarchyInput = z.infer<typeof updateRoleHierarchySchema>;

export const getRoleHierarchySchema = z.object({
  roleId: z.string().uuid('Invalid role ID'),
  includePermissions: z.boolean().default(true),
  maxDepth: z.number().int().min(1).max(10).default(5),
});

export type GetRoleHierarchyInput = z.infer<typeof getRoleHierarchySchema>;

// ==========================================
// ROLE SEARCH/FILTER SCHEMA
// ==========================================

export const searchRolesSchema = z.object({
  query: z.string().optional(),
  type: roleTypeEnum.optional(),
  status: roleStatusEnum.optional(),
  hasUsers: z.boolean().optional(), // Filter roles with/without assigned users
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(50),
  sortBy: z.enum(['name', 'priority', 'createdAt', 'userCount']).default('priority'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type SearchRolesInput = z.infer<typeof searchRolesSchema>;

// ==========================================
// ROLE USERS SCHEMA
// ==========================================

export const getRoleUsersSchema = z.object({
  roleId: z.string().uuid('Invalid role ID'),
  includeInactive: z.boolean().default(false),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(50),
});

export type GetRoleUsersInput = z.infer<typeof getRoleUsersSchema>;

// ==========================================
// BULK ROLE OPERATIONS SCHEMA
// ==========================================

export const bulkAssignRoleSchema = z.object({
  userIds: z.array(z.string().uuid()).min(1, 'At least one user ID is required').max(100, 'Maximum 100 users at once'),
  roleId: z.string().uuid('Invalid role ID'),
  notifyUsers: z.boolean().default(false),
  effectiveFrom: z.string().datetime().optional(),
  effectiveTo: z.string().datetime().optional(),
});

export type BulkAssignRoleInput = z.infer<typeof bulkAssignRoleSchema>;

export const bulkRemoveRoleSchema = z.object({
  userIds: z.array(z.string().uuid()).min(1, 'At least one user ID is required').max(100, 'Maximum 100 users at once'),
  roleId: z.string().uuid('Invalid role ID'),
  reason: z.string().min(5, 'Reason must be at least 5 characters'),
  notifyUsers: z.boolean().default(false),
});

export type BulkRemoveRoleInput = z.infer<typeof bulkRemoveRoleSchema>;

// ==========================================
// EXPORT SCHEMAS
// ==========================================

export const exportRolesSchema = z.object({
  format: z.enum(['csv', 'json', 'xlsx']).default('json'),
  includePermissions: z.boolean().default(true),
  includeUsers: z.boolean().default(false),
  roleIds: z.array(z.string().uuid()).optional(), // Specific roles, or all if not provided
});

export type ExportRolesInput = z.infer<typeof exportRolesSchema>;

export const exportPermissionsSchema = z.object({
  format: z.enum(['csv', 'json', 'xlsx']).default('json'),
  roleId: z.string().uuid().optional(),
  resource: permissionResourceEnum.optional(),
});

export type ExportPermissionsInput = z.infer<typeof exportPermissionsSchema>;
