/**
 * WF-COMP-345 | navigationUtils.permissions.ts - Permission checking utilities
 * Purpose: Permission and role-based access control for navigation
 * Upstream: ../types, ./navigationUtils.types | Dependencies: Type definitions
 * Downstream: Navigation filtering, guards | Called by: Navigation components
 * Related: navigationUtils.filters, navigationUtils.guards
 * Exports: Permission checking functions | Key Features: Role-based access control
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Permission check → Access control → UI rendering
 * LLM Context: Permission utilities module, extracted from navigationUtils.ts
 */

/**
 * Navigation Utilities - Permission Checking
 *
 * Functions for checking user roles and permissions against navigation requirements.
 * Handles role-based access control (RBAC) and permission validation.
 *
 * @module utils/navigationUtils.permissions
 */

import type {
  User,
  UserRole,
  NavigationItem,
  NavigationPermission,
  AccessCheckResult,
  RolePermissionMap
} from './navigationUtils.types';

// ============================================================================
// PERMISSION CHECKING
// ============================================================================

/**
 * Check if user has required role for navigation item
 *
 * @param user - Current user object (null if not authenticated)
 * @param requiredRoles - Array of roles that can access the item
 * @returns true if user has one of the required roles or no roles are required
 */
export function hasRequiredRole(
  user: User | null,
  requiredRoles?: UserRole[]
): boolean {
  if (!requiredRoles || requiredRoles.length === 0) {
    return true; // No role requirements
  }

  if (!user) {
    return false;
  }

  return requiredRoles.includes(user.role as UserRole);
}

/**
 * Check if user has required permissions for navigation item
 *
 * @param user - Current user object (null if not authenticated)
 * @param requiredPermissions - Array of permissions required for access
 * @returns true if user has all required permissions
 */
export function hasRequiredPermissions(
  user: User | null,
  requiredPermissions?: NavigationPermission[]
): boolean {
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true; // No permission requirements
  }

  if (!user) {
    return false;
  }

  // Admin has all permissions
  if (user.role === 'ADMIN' || user.role === 'DISTRICT_ADMIN') {
    return true;
  }

  // Role-based permission mapping
  const rolePermissions: RolePermissionMap = {
    ADMIN: ['*.*'],
    DISTRICT_ADMIN: ['*.*'],
    SCHOOL_ADMIN: [
      'students.*', 'medications.read', 'medications.create', 'medications.update',
      'health_records.*', 'appointments.*', 'incident_reports.*',
      'reports.*', 'communication.*', 'inventory.read', 'inventory.update'
    ],
    NURSE: [
      'students.*', 'medications.*', 'health_records.*', 'appointments.*',
      'incident_reports.*', 'reports.read', 'reports.create',
      'emergency_contacts.*', 'communication.*', 'documents.*', 'inventory.*'
    ],
    COUNSELOR: [
      'students.read', 'students.update', 'health_records.read',
      'incident_reports.read', 'incident_reports.create',
      'reports.read', 'communication.read'
    ],
    VIEWER: [
      'students.read', 'medications.read', 'health_records.read',
      'appointments.read', 'incident_reports.read', 'reports.read'
    ]
  };

  const userPermissions = rolePermissions[user.role as UserRole] || [];

  // Check if user has all required permissions
  return requiredPermissions.every(permission => {
    const permissionKey = `${permission.resource}.${permission.action}`;

    // Check for wildcard permissions
    if (userPermissions.includes('*.*')) {
      return true;
    }

    // Check for resource wildcard
    if (userPermissions.includes(`${permission.resource}.*`)) {
      return true;
    }

    // Check for exact permission
    return userPermissions.includes(permissionKey);
  });
}

/**
 * Check if navigation item should be accessible to user
 *
 * Performs comprehensive access check including:
 * - Disabled state
 * - Feature flags
 * - Role requirements
 * - Permission requirements
 *
 * @param item - Navigation item to check
 * @param user - Current user object (null if not authenticated)
 * @returns Object with hasAccess boolean and optional reason for denial
 */
export function canAccessNavigationItem(
  item: NavigationItem,
  user: User | null
): AccessCheckResult {
  // Check if item is explicitly disabled
  if (item.disabled) {
    return { hasAccess: false, reason: 'disabled' };
  }

  // Check feature flags if specified
  if (item.featureFlag) {
    const isFeatureEnabled = checkFeatureFlag(item.featureFlag);
    if (!isFeatureEnabled) {
      return { hasAccess: false, reason: 'feature' };
    }
  }

  // Check role requirements
  if (!hasRequiredRole(user, item.roles)) {
    return { hasAccess: false, reason: 'role' };
  }

  // Check permission requirements
  if (!hasRequiredPermissions(user, item.permissions)) {
    return { hasAccess: false, reason: 'permission' };
  }

  return { hasAccess: true };
}

// ============================================================================
// FEATURE FLAGS
// ============================================================================

/**
 * Check if feature flag is enabled
 *
 * @param flag - Feature flag identifier
 * @returns true if feature is enabled in localStorage
 * @internal
 */
function checkFeatureFlag(flag: string): boolean {
  try {
    const featureFlags = JSON.parse(
      localStorage.getItem('featureFlags') || '{}'
    );
    return featureFlags[flag] === true;
  } catch {
    return false;
  }
}
