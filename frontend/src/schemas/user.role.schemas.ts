/**
 * @fileoverview Role and permission management validation schemas
 * @module schemas/user.role
 *
 * Zod validation schemas for managing user roles and permissions.
 * Includes schemas for role assignment, removal, and permission updates.
 */

import { z } from 'zod';

// ==========================================
// ROLE ASSIGNMENT SCHEMAS
// ==========================================

/**
 * Schema for assigning a role to a user
 *
 * Supports role assignment with:
 * - Effective date range (start and end dates)
 * - Temporal validation (start before end)
 * - Optional user notification
 *
 * @example
 * const roleAssignment = {
 *   userId: '123e4567-e89b-12d3-a456-426614174000',
 *   roleId: '987e6543-e21b-12d3-a456-426614174999',
 *   effectiveFrom: '2024-01-01T00:00:00Z',
 *   effectiveTo: '2024-12-31T23:59:59Z',
 *   notifyUser: true
 * };
 * assignRoleSchema.parse(roleAssignment);
 */
export const assignRoleSchema = z.object({
  /**
   * UUID of the user to assign role to
   */
  userId: z.string().uuid('Invalid user ID'),

  /**
   * UUID of the role to assign
   */
  roleId: z.string().uuid('Invalid role ID'),

  /**
   * Date/time when role assignment becomes effective (optional)
   * If not provided, effective immediately
   */
  effectiveFrom: z.string().datetime().optional(),

  /**
   * Date/time when role assignment expires (optional)
   * If not provided, role is permanent until manually removed
   */
  effectiveTo: z.string().datetime().optional(),

  /**
   * Whether to notify user of role assignment
   * Default: true
   */
  notifyUser: z.boolean().default(true),
}).refine((data) => {
  // Validate that effectiveFrom is before effectiveTo
  if (data.effectiveFrom && data.effectiveTo) {
    return new Date(data.effectiveFrom) < new Date(data.effectiveTo);
  }
  return true;
}, {
  message: 'Effective from date must be before effective to date',
  path: ['effectiveTo'],
});

/**
 * TypeScript type for role assignment input
 */
export type AssignRoleInput = z.infer<typeof assignRoleSchema>;

/**
 * Schema for removing a role from a user
 *
 * Requires:
 * - Reason for removal (audit trail)
 * - Optional user notification
 *
 * @example
 * const roleRemoval = {
 *   userId: '123e4567-e89b-12d3-a456-426614174000',
 *   roleId: '987e6543-e21b-12d3-a456-426614174999',
 *   reason: 'User changed departments',
 *   notifyUser: true
 * };
 * removeRoleSchema.parse(roleRemoval);
 */
export const removeRoleSchema = z.object({
  /**
   * UUID of the user to remove role from
   */
  userId: z.string().uuid('Invalid user ID'),

  /**
   * UUID of the role to remove
   */
  roleId: z.string().uuid('Invalid role ID'),

  /**
   * Required reason for role removal (audit trail)
   * Minimum 5 characters for meaningful explanation
   */
  reason: z.string().min(5, 'Reason must be at least 5 characters'),

  /**
   * Whether to notify user of role removal
   * Default: true
   */
  notifyUser: z.boolean().default(true),
});

/**
 * TypeScript type for role removal input
 */
export type RemoveRoleInput = z.infer<typeof removeRoleSchema>;

// ==========================================
// PERMISSION MANAGEMENT SCHEMAS
// ==========================================

/**
 * Permission action enum
 *
 * Defines the types of actions that can be performed on resources.
 */
export const permissionActionEnum = z.enum(['create', 'read', 'update', 'delete', 'manage']);

/**
 * Permission scope enum
 *
 * Defines the scope of permission application:
 * - global: Permission applies across entire system
 * - school: Permission applies within user's school
 * - self: Permission applies only to user's own data
 */
export const permissionScopeEnum = z.enum(['global', 'school', 'self']);

/**
 * Schema for a single permission entry
 *
 * Represents a granular permission with resource, action, scope, and conditions.
 *
 * @example
 * const permission = {
 *   resource: 'students',
 *   action: 'read',
 *   scope: 'school',
 *   allow: true
 * };
 */
export const permissionSchema = z.object({
  /**
   * Resource this permission applies to (e.g., 'students', 'health_records')
   */
  resource: z.string().min(1, 'Resource is required'),

  /**
   * Action that can be performed on the resource
   */
  action: permissionActionEnum,

  /**
   * Scope of the permission (global, school, or self)
   * Default: 'school'
   */
  scope: permissionScopeEnum.default('school'),

  /**
   * Additional conditions for the permission (optional)
   * Flexible key-value pairs for complex permission logic
   */
  conditions: z.record(z.string(), z.unknown()).optional(),

  /**
   * Whether to allow (true) or explicitly deny (false)
   * Default: true (allow)
   * Explicit deny takes precedence over allow in permission resolution
   */
  allow: z.boolean().default(true),
});

/**
 * TypeScript type for permission entry
 */
export type Permission = z.infer<typeof permissionSchema>;

/**
 * Schema for updating user permissions
 *
 * Allows fine-grained permission management:
 * - Set permissions for specific resources and actions
 * - Define scope (global, school, self)
 * - Replace all or merge with existing permissions
 * - Optional user notification
 *
 * @example
 * const permissionUpdate = {
 *   userId: '123e4567-e89b-12d3-a456-426614174000',
 *   permissions: [
 *     {
 *       resource: 'students',
 *       action: 'read',
 *       scope: 'school',
 *       allow: true
 *     },
 *     {
 *       resource: 'health_records',
 *       action: 'update',
 *       scope: 'school',
 *       allow: true
 *     }
 *   ],
 *   replaceExisting: false,
 *   notifyUser: false
 * };
 * updateUserPermissionsSchema.parse(permissionUpdate);
 */
export const updateUserPermissionsSchema = z.object({
  /**
   * UUID of the user to update permissions for
   */
  userId: z.string().uuid('Invalid user ID'),

  /**
   * Array of permissions to set
   */
  permissions: z.array(permissionSchema),

  /**
   * Whether to replace all existing permissions (true) or merge (false)
   * Default: false (merge - add to existing permissions)
   * When true: removes all existing permissions and sets only the provided ones
   */
  replaceExisting: z.boolean().default(false),

  /**
   * Whether to notify user of permission changes
   * Default: false (permission changes typically not notified)
   */
  notifyUser: z.boolean().default(false),
});

/**
 * TypeScript type for updating user permissions input
 */
export type UpdateUserPermissionsInput = z.infer<typeof updateUserPermissionsSchema>;

// ==========================================
// TYPE EXPORTS
// ==========================================

/**
 * TypeScript type inference exports for type-safe usage
 */
export type PermissionAction = z.infer<typeof permissionActionEnum>;
export type PermissionScope = z.infer<typeof permissionScopeEnum>;
