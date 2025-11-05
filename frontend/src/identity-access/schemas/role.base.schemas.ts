/**
 * @fileoverview Base role and permission schemas
 * @module schemas/role.base
 *
 * Base validation schemas for permissions, roles, and enums.
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
