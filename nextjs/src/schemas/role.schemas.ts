/**
 * @fileoverview Validation schemas for role and permission management
 * @module schemas/role
 *
 * Zod validation schemas for role CRUD, permission assignment, and role hierarchy management.
 */

import { z } from 'zod';

// ==========================================
// PERMISSION VALIDATION SCHEMAS
// ==========================================

/**
 * Permission resource types
 */
export const permissionResourceEnum = z.enum([
  'users',
  'roles',
  'permissions',
  'students',
  'health_records',
  'medications',
  'immunizations',
  'allergies',
  'vital_signs',
  'appointments',
  'incidents',
  'documents',
  'emergency_contacts',
  'inventory',
  'stock',
  'transactions',
  'settings',
  'integrations',
  'api_keys',
  'webhooks',
  'audit_logs',
  'reports',
  'notifications',
  'system'
]);

/**
 * Permission actions
 */
export const permissionActionEnum = z.enum([
  'create',
  'read',
  'update',
  'delete',
  'manage', // Full CRUD access
  'export',
  'import',
  'approve',
  'reject'
]);

/**
 * Permission scope
 */
export const permissionScopeEnum = z.enum([
  'global', // Access to all resources
  'school', // Access to school-specific resources
  'self',   // Access only to own resources
  'custom'  // Custom conditions apply
]);

/**
 * Individual permission schema
 */
export const permissionSchema = z.object({
  id: z.string().uuid().optional(), // Optional for creation
  resource: permissionResourceEnum,
  action: permissionActionEnum,
  scope: permissionScopeEnum.default('school'),
  conditions: z.record(z.any()).optional(), // Custom conditions (e.g., {department: 'nursing'})
  description: z.string().max(200).optional(),
});

export type Permission = z.infer<typeof permissionSchema>;

// ==========================================
// ROLE VALIDATION SCHEMAS
// ==========================================

/**
 * Role type enum
 */
export const roleTypeEnum = z.enum([
  'system',  // System-defined, cannot be deleted
  'custom',  // User-defined, can be modified
  'default'  // Default role for new users
]);

/**
 * Role status enum
 */
export const roleStatusEnum = z.enum([
  'active',
  'inactive',
  'deprecated'
]);

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
// PERMISSION MATRIX SCHEMA
// ==========================================

export const getPermissionMatrixSchema = z.object({
  roleIds: z.array(z.string().uuid()).optional(), // Specific roles, or all if not provided
  resources: z.array(permissionResourceEnum).optional(), // Specific resources, or all if not provided
  includeInherited: z.boolean().default(true),
  format: z.enum(['grid', 'tree', 'list']).default('grid'),
});

export type GetPermissionMatrixInput = z.infer<typeof getPermissionMatrixSchema>;

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
