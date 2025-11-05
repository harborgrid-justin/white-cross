/**
 * Permission checking and access control utilities
 * Implements granular RBAC (Role-Based Access Control) for HIPAA compliance
 *
 * Provides both role-based and resource-level permissions with caching support.
 *
 * @module lib/permissions
 * @example
 * ```typescript
 * import { checkPermission, checkFormAccess } from '@/lib/permissions';
 *
 * // Check if user can perform action
 * const canCreate = await checkPermission(userId, userRole, 'medications:create');
 *
 * // Check form-specific access
 * const formAccess = await checkFormAccess(userId, userRole, formId, 'edit');
 * ```
 */

import { hasMinimumRole } from './auth';
import { getServerSession, type SessionUser } from './session';
import apiClient from './api-client';

/**
 * Permission action types
 */
export type PermissionAction = 'create' | 'read' | 'update' | 'delete' | 'manage';

/**
 * Resource types in the system
 */
export type ResourceType =
  | 'students'
  | 'health-records'
  | 'medications'
  | 'incidents'
  | 'appointments'
  | 'documents'
  | 'forms'
  | 'reports'
  | 'users'
  | 'settings'
  | 'audit-logs';

/**
 * Permission string format: "resource:action"
 * Examples: "students:create", "medications:read", "forms:manage"
 */
export type Permission = `${ResourceType}:${PermissionAction}`;

/**
 * Form permission actions
 */
export const FORM_PERMISSIONS = {
  CREATE: 'forms:create',
  EDIT: 'forms:update', // Updated to match convention
  DELETE: 'forms:delete',
  VIEW: 'forms:read', // Updated to match convention
  VIEW_RESPONSES: 'forms:view_responses',
  SUBMIT: 'forms:submit',
  MANAGE: 'forms:manage'
} as const;

/**
 * Permission definitions with minimum required roles
 * Extended to include all resource types
 */
const PERMISSION_ROLES: Record<string, string> = {
  // Forms
  'forms:create': 'NURSE',
  'forms:edit': 'NURSE',
  'forms:update': 'NURSE',
  'forms:delete': 'SCHOOL_ADMIN',
  'forms:view': 'VIEWER',
  'forms:read': 'VIEWER',
  'forms:view_responses': 'NURSE',
  'forms:submit': 'VIEWER',
  'forms:manage': 'ADMIN',

  // Students
  'students:create': 'NURSE',
  'students:read': 'VIEWER',
  'students:update': 'NURSE',
  'students:delete': 'ADMIN',
  'students:manage': 'SCHOOL_ADMIN',

  // Health Records (PHI)
  'health-records:create': 'NURSE',
  'health-records:read': 'NURSE',
  'health-records:update': 'NURSE',
  'health-records:delete': 'ADMIN',
  'health-records:manage': 'ADMIN',

  // Medications
  'medications:create': 'NURSE',
  'medications:read': 'NURSE',
  'medications:update': 'NURSE',
  'medications:delete': 'SCHOOL_ADMIN',
  'medications:manage': 'ADMIN',

  // Incidents
  'incidents:create': 'NURSE',
  'incidents:read': 'COUNSELOR',
  'incidents:update': 'NURSE',
  'incidents:delete': 'SCHOOL_ADMIN',
  'incidents:manage': 'ADMIN',

  // Appointments
  'appointments:create': 'VIEWER',
  'appointments:read': 'VIEWER',
  'appointments:update': 'NURSE',
  'appointments:delete': 'NURSE',
  'appointments:manage': 'SCHOOL_ADMIN',

  // Documents
  'documents:create': 'NURSE',
  'documents:read': 'VIEWER',
  'documents:update': 'NURSE',
  'documents:delete': 'SCHOOL_ADMIN',
  'documents:manage': 'ADMIN',

  // Reports
  'reports:create': 'NURSE',
  'reports:read': 'VIEWER',
  'reports:update': 'NURSE',
  'reports:delete': 'ADMIN',
  'reports:manage': 'ADMIN',

  // Users
  'users:create': 'SCHOOL_ADMIN',
  'users:read': 'VIEWER',
  'users:update': 'SCHOOL_ADMIN',
  'users:delete': 'ADMIN',
  'users:manage': 'ADMIN',

  // Settings
  'settings:create': 'ADMIN',
  'settings:read': 'SCHOOL_ADMIN',
  'settings:update': 'ADMIN',
  'settings:delete': 'SUPER_ADMIN',
  'settings:manage': 'SUPER_ADMIN',

  // Audit Logs
  'audit-logs:read': 'SCHOOL_ADMIN',
  'audit-logs:manage': 'SUPER_ADMIN',
};

/**
 * Permission cache entry
 */
interface CachedPermissions {
  permissions: Set<string>;
  timestamp: number;
  ttl: number;
}

/**
 * In-memory permission cache
 * In production, use Redis or similar distributed cache
 */
const permissionCache = new Map<string, CachedPermissions>();

/**
 * Default cache TTL (5 minutes)
 */
const DEFAULT_CACHE_TTL = 5 * 60 * 1000;

/**
 * Check if user has required permission
 *
 * @param userId - User ID to check
 * @param userRole - User's role
 * @param permission - Permission string (e.g., 'forms:create')
 * @returns True if user has permission
 *
 * @example
 * ```typescript
 * const canCreate = await checkPermission(session.user.id, session.user.role, 'forms:create');
 * if (!canCreate) {
 *   throw new Error('Permission denied');
 * }
 * ```
 */
export async function checkPermission(
  userId: string,
  userRole: string,
  permission: string
): Promise<boolean> {
  try {
    // Get minimum required role for this permission
    const minimumRole = PERMISSION_ROLES[permission];

    if (!minimumRole) {
      // Permission not defined, deny by default
      return false;
    }

    // Check if user's role meets minimum requirement
    const hasRole = hasMinimumRole({ id: userId, email: '', role: userRole }, minimumRole);

    if (!hasRole) {
      return false;
    }

    // For production, you might also check backend for dynamic permissions
    // const response = await apiClient.get<{ hasPermission: boolean }>(
    //   `/users/${userId}/permissions/${permission}`
    // );
    // return response.hasPermission;

    return true;
  } catch (error) {
    console.error('Permission check failed:', error);
    return false;
  }
}

/**
 * Form access actions
 */
type FormAccessAction = 'view' | 'edit' | 'delete' | 'view_responses' | 'submit';

/**
 * Check if user has access to specific form
 * Verifies both permission and ownership/access rights
 *
 * @param userId - User ID to check
 * @param userRole - User's role
 * @param formId - Form ID to check access for
 * @param action - Action user wants to perform
 * @returns True if user has access
 *
 * @example
 * ```typescript
 * const canEdit = await checkFormAccess(session.user.id, session.user.role, formId, 'edit');
 * if (!canEdit) {
 *   throw new Error('Access denied');
 * }
 * ```
 */
export async function checkFormAccess(
  userId: string,
  userRole: string,
  formId: string,
  action: FormAccessAction
): Promise<boolean> {
  try {
    // Map action to permission
    const permissionMap: Record<FormAccessAction, string> = {
      view: FORM_PERMISSIONS.VIEW,
      edit: FORM_PERMISSIONS.EDIT,
      delete: FORM_PERMISSIONS.DELETE,
      view_responses: FORM_PERMISSIONS.VIEW_RESPONSES,
      submit: FORM_PERMISSIONS.SUBMIT
    };

    const permission = permissionMap[action];

    // First check if user has general permission
    const hasPermission = await checkPermission(userId, userRole, permission);

    if (!hasPermission) {
      return false;
    }

    // For certain actions, check ownership or specific access
    if (action === 'edit' || action === 'delete') {
      try {
        // Check if user created the form or has admin access
        const form = await apiClient.get<{ createdBy: string; metadata?: { isPublic?: boolean } }>(
          `/forms/${formId}`
        );

        // Admins and creators can always edit/delete
        if (form.createdBy === userId || userRole === 'ADMIN' || userRole === 'SUPER_ADMIN' || userRole === 'SCHOOL_ADMIN') {
          return true;
        }

        return false;
      } catch (error) {
        // If form not found or error, deny access
        console.error('Form access check failed:', error);
        return false;
      }
    }

    // For view and submit, permission check is sufficient
    return true;
  } catch (error) {
    console.error('Form access check failed:', error);
    return false;
  }
}

/**
 * Require permission or throw error
 * Convenience wrapper for actions that require specific permission
 *
 * @param userId - User ID
 * @param userRole - User's role
 * @param permission - Required permission
 * @throws Error if permission denied
 *
 * @example
 * ```typescript
 * await requirePermission(session.user.id, session.user.role, 'forms:create');
 * // Continues execution if permission granted
 * ```
 */
export async function requirePermission(
  userId: string,
  userRole: string,
  permission: string
): Promise<void> {
  const hasPermission = await checkPermission(userId, userRole, permission);

  if (!hasPermission) {
    throw new Error(`Permission denied: ${permission}`);
  }
}

/**
 * Require form access or throw error
 * Convenience wrapper for actions that require form access
 *
 * @param userId - User ID
 * @param userRole - User's role
 * @param formId - Form ID
 * @param action - Required action
 * @throws Error if access denied
 */
export async function requireFormAccess(
  userId: string,
  userRole: string,
  formId: string,
  action: FormAccessAction
): Promise<void> {
  const hasAccess = await checkFormAccess(userId, userRole, formId, action);

  if (!hasAccess) {
    throw new Error(`Access denied: Cannot ${action} form ${formId}`);
  }
}

/**
 * Get all permissions for a user
 *
 * Returns all permissions based on user role.
 * Results are cached for performance.
 *
 * @param userId - User ID
 * @param userRole - User role
 * @returns Set of permissions
 *
 * @example
 * ```typescript
 * const permissions = await getPermissions(userId, userRole);
 * if (permissions.has('medications:create')) {
 *   // User can create medications
 * }
 * ```
 */
export async function getPermissions(userId: string, userRole: string): Promise<Set<string>> {
  const cacheKey = `${userId}:${userRole}`;

  // Check cache first
  const cached = permissionCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    return cached.permissions;
  }

  // Get role-based permissions
  const permissions = new Set<string>();

  for (const [permission, minRole] of Object.entries(PERMISSION_ROLES)) {
    if (hasMinimumRole({ id: userId, email: '', role: userRole }, minRole)) {
      permissions.add(permission);
    }
  }

  // Cache the result
  permissionCache.set(cacheKey, {
    permissions,
    timestamp: Date.now(),
    ttl: DEFAULT_CACHE_TTL,
  });

  return permissions;
}

/**
 * Clear permission cache for a user
 *
 * Call this when user permissions or role changes.
 *
 * @param userId - User ID
 * @param userRole - User role (optional)
 */
export function clearPermissionCache(userId: string, userRole?: string): void {
  if (userRole) {
    permissionCache.delete(`${userId}:${userRole}`);
  } else {
    // Clear all cache entries for this user
    const keysToDelete: string[] = [];
    permissionCache.forEach((_, key) => {
      if (key.startsWith(`${userId}:`)) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(key => permissionCache.delete(key));
  }
}

/**
 * Clear all permission caches
 *
 * Useful when role permissions are updated globally.
 */
export function clearAllPermissionCaches(): void {
  permissionCache.clear();
}

/**
 * Check multiple permissions (requires ALL)
 *
 * Returns true only if user has ALL specified permissions.
 *
 * @param userId - User ID
 * @param userRole - User role
 * @param permissions - Array of required permissions
 * @returns true if user has all permissions
 *
 * @example
 * ```typescript
 * const canManageMedications = await checkMultiplePermissions(userId, userRole, [
 *   'medications:create',
 *   'medications:update',
 *   'medications:delete'
 * ]);
 * ```
 */
export async function checkMultiplePermissions(
  userId: string,
  userRole: string,
  permissions: string[]
): Promise<boolean> {
  for (const permission of permissions) {
    const hasPermission = await checkPermission(userId, userRole, permission);
    if (!hasPermission) {
      return false;
    }
  }
  return true;
}

/**
 * Check if user has any of the specified permissions (requires ANY)
 *
 * Returns true if user has AT LEAST ONE of the specified permissions.
 *
 * @param userId - User ID
 * @param userRole - User role
 * @param permissions - Array of permissions
 * @returns true if user has any permission
 */
export async function checkAnyPermission(
  userId: string,
  userRole: string,
  permissions: string[]
): Promise<boolean> {
  for (const permission of permissions) {
    const hasPermission = await checkPermission(userId, userRole, permission);
    if (hasPermission) {
      return true;
    }
  }
  return false;
}

/**
 * Access control result with detailed information
 */
export interface AccessResult {
  allowed: boolean;
  reason?: string;
  requiredRole?: string;
  requiredPermission?: string;
}

/**
 * Check permission with detailed result
 *
 * Returns detailed access control result with reason for denial.
 *
 * @param userId - User ID
 * @param userRole - User role
 * @param permission - Required permission
 * @returns Detailed access result
 */
export async function checkPermissionDetailed(
  userId: string,
  userRole: string,
  permission: string
): Promise<AccessResult> {
  const hasPermission = await checkPermission(userId, userRole, permission);

  if (hasPermission) {
    return {
      allowed: true,
    };
  }

  const requiredRole = PERMISSION_ROLES[permission];

  return {
    allowed: false,
    reason: `User lacks required permission: ${permission}`,
    requiredPermission: permission,
    requiredRole: requiredRole || 'UNKNOWN',
  };
}

/**
 * Check if current session user has permission
 *
 * Convenience function that automatically gets current user from session.
 *
 * @param permission - Required permission
 * @returns true if current user has permission
 *
 * @example
 * ```typescript
 * 'use server'
 *
 * export async function getData() {
 *   if (!await hasPermission('reports:read')) {
 *     return { error: 'Access denied' };
 *   }
 *
 *   return fetchReports();
 * }
 * ```
 */
export async function hasPermission(permission: string): Promise<boolean> {
  const session = await getServerSession();

  if (!session) {
    return false;
  }

  return checkPermission(session.user.id, session.user.role, permission);
}

/**
 * Check resource ownership
 *
 * Verifies if user owns a specific resource.
 * Used for scoping permissions to owned resources.
 *
 * @param userId - User ID
 * @param resourceType - Type of resource
 * @param resourceId - Resource ID
 * @returns true if user owns the resource
 *
 * @example
 * ```typescript
 * const canEdit = await checkResourceOwnership(userId, 'forms', formId);
 * if (canEdit) {
 *   // Allow editing own form
 * }
 * ```
 */
export async function checkResourceOwnership(
  userId: string,
  resourceType: ResourceType,
  resourceId: string
): Promise<boolean> {
  try {
    // Fetch resource from backend and check ownership
    const response = await apiClient.get<{ createdBy?: string; ownerId?: string }>(
      `/${resourceType}/${resourceId}`
    );

    return response.createdBy === userId || response.ownerId === userId;
  } catch (error) {
    console.error(`Ownership check failed for ${resourceType}/${resourceId}:`, error);
    return false;
  }
}

/**
 * Get accessible resources for user
 *
 * Returns IDs of resources the user can access based on permissions.
 *
 * @param userId - User ID
 * @param userRole - User role
 * @param resourceType - Type of resource
 * @returns Array of accessible resource IDs
 */
export async function getAccessibleResources(
  userId: string,
  userRole: string,
  resourceType: ResourceType
): Promise<string[]> {
  // Super admins can access everything
  if (['SUPER_ADMIN', 'ADMIN'].includes(userRole)) {
    return ['*']; // Wildcard indicates all resources
  }

  // Check read permission for resource type
  const permission = `${resourceType}:read`;
  const hasPermission = await checkPermission(userId, userRole, permission);

  if (!hasPermission) {
    return []; // No access
  }

  try {
    // Fetch accessible resources from backend
    const response = await apiClient.get<{ resources: { id: string }[] }>(
      `/${resourceType}?userId=${userId}`
    );

    return response.resources.map(r => r.id);
  } catch (error) {
    console.error(`Failed to get accessible resources for ${resourceType}:`, error);
    return [];
  }
}

/**
 * Require permission for current session user
 *
 * Convenience function that automatically gets current user from session and requires permission.
 *
 * @param permission - Required permission
 * @throws Error if user lacks permission
 *
 * @example
 * ```typescript
 * 'use server'
 *
 * export async function deleteData(id: string) {
 *   await requirePermissionForSession('forms:delete');
 *
 *   // Proceed with deletion
 * }
 * ```
 */
export async function requirePermissionForSession(permission: string): Promise<void> {
  const session = await getServerSession();

  if (!session) {
    throw new Error('Authentication required');
  }

  await requirePermission(session.user.id, session.user.role, permission);
}
