/**
 * WF-COMP-345 | navigationUtils.permissions.ts - Permission checking for navigation items
 * Purpose: Validate user access to navigation items based on roles and permissions
 * Upstream: ./navigationUtils.types, @/identity-access/hooks | Dependencies: Permission system
 * Downstream: navigationUtils.filters | Called by: Navigation filtering
 * Related: navigationUtils.filters, navigationUtils.types
 * Exports: Permission checking functions | Key Features: Role/permission validation
 * Last Updated: 2025-11-07 | File Type: .ts
 * Critical Path: Check permissions → Determine access → Filter navigation
 * LLM Context: Navigation permission module, extracted from navigationUtils.ts
 */

/**
 * Navigation Utilities - Permission Checking
 *
 * Functions for checking user access to navigation items based on
 * role hierarchy, permissions, and feature flags.
 *
 * @module utils/navigationUtils.permissions
 */

import type {
  User,
  NavigationItem,
  AccessCheckResult,
} from './navigationUtils.types';
import { ROLE_HIERARCHY } from '@/identity-access/hooks/auth-permissions';

// ============================================================================
// PERMISSION CHECKING
// ============================================================================

/**
 * Check if user has required minimum role level
 *
 * @param userRole - User's current role
 * @param requiredRole - Required role for access
 * @returns True if user has required role level or higher
 */
function hasMinimumRole(userRole: string, requiredRole: string): boolean {
  const userLevel = ROLE_HIERARCHY[userRole] || 0;
  const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0;
  return userLevel >= requiredLevel;
}

/**
 * Check if user has any of the required roles
 *
 * @param userRole - User's current role
 * @param requiredRoles - Array of acceptable roles
 * @returns True if user has any of the required roles
 */
function hasAnyRole(userRole: string, requiredRoles: string[]): boolean {
  if (!requiredRoles || requiredRoles.length === 0) {
    return true; // No role restriction
  }

  return requiredRoles.some(role => hasMinimumRole(userRole, role));
}

/**
 * Check if user has required permission
 *
 * @param user - Current user object
 * @param permission - Required permission string
 * @returns True if user has the permission
 */
function hasPermission(user: User | null, permission: string): boolean {
  if (!user) return false;

  // Check if user has the permission in their permissions array
  if (user.permissions && Array.isArray(user.permissions)) {
    return user.permissions.includes(permission);
  }

  // Fallback: some roles automatically have certain permissions
  // This would be defined in your permission mapping system
  return false;
}

/**
 * Check if navigation item is enabled based on feature flags
 *
 * @param item - Navigation item to check
 * @returns True if item is enabled
 */
function isFeatureEnabled(item: NavigationItem): boolean {
  // If no feature flag specified, item is enabled
  if (!item.featureFlag) {
    return true;
  }

  // Check feature flags (you may need to integrate with your feature flag system)
  // For now, we'll assume all features are enabled
  // TODO: Integrate with actual feature flag system
  return true;
}

/**
 * Check if navigation item is disabled
 *
 * @param item - Navigation item to check
 * @returns True if item is explicitly disabled
 */
function isItemDisabled(item: NavigationItem): boolean {
  return item.disabled === true;
}

/**
 * Check if user can access a navigation item
 *
 * Evaluates multiple access criteria:
 * - Authentication requirement (requiresAuth)
 * - Role-based access (roles array)
 * - Permission-based access (permission string)
 * - Feature flag status (featureFlag)
 * - Disabled status (disabled)
 *
 * @param item - Navigation item to check
 * @param user - Current user object (null if not authenticated)
 * @returns Access check result with hasAccess boolean and optional reason
 *
 * @example
 * ```typescript
 * const result = canAccessNavigationItem(navItem, currentUser);
 * if (result.hasAccess) {
 *   // User can access this item
 * } else {
 *   console.log(`Access denied: ${result.reason}`);
 * }
 * ```
 */
export function canAccessNavigationItem(
  item: NavigationItem,
  user: User | null
): AccessCheckResult {
  // Check if item is explicitly disabled
  if (isItemDisabled(item)) {
    return {
      hasAccess: false,
      reason: 'disabled',
    };
  }

  // Check if feature is enabled
  if (!isFeatureEnabled(item)) {
    return {
      hasAccess: false,
      reason: 'feature',
    };
  }

  // Check authentication requirement
  if (item.requiresAuth && !user) {
    return {
      hasAccess: false,
      reason: 'role',
    };
  }

  // Public items (no auth required and no role/permission specified)
  if (!item.requiresAuth && !item.roles && !item.permission) {
    return {
      hasAccess: true,
    };
  }

  // If user is not authenticated but item requires role/permission, deny access
  if (!user) {
    return {
      hasAccess: false,
      reason: 'role',
    };
  }

  // Check role-based access
  if (item.roles && item.roles.length > 0) {
    if (!hasAnyRole(user.role || '', item.roles)) {
      return {
        hasAccess: false,
        reason: 'role',
      };
    }
  }

  // Check permission-based access
  if (item.permission) {
    if (!hasPermission(user, item.permission)) {
      return {
        hasAccess: false,
        reason: 'permission',
      };
    }
  }

  // All checks passed
  return {
    hasAccess: true,
  };
}

/**
 * Check if user has access to any children of a navigation item
 *
 * Useful for determining if a parent item should be shown even if
 * the user doesn't have access to the parent itself.
 *
 * @param item - Navigation item to check
 * @param user - Current user object
 * @returns True if user has access to at least one child
 */
export function hasAccessToAnyChild(
  item: NavigationItem,
  user: User | null
): boolean {
  if (!item.children || item.children.length === 0) {
    return false;
  }

  return item.children.some(child => {
    const childAccess = canAccessNavigationItem(child, user);
    return childAccess.hasAccess || hasAccessToAnyChild(child, user);
  });
}

/**
 * Get all accessible child items
 *
 * Returns filtered array of children that user has access to
 *
 * @param item - Navigation item to check
 * @param user - Current user object
 * @returns Array of accessible children
 */
export function getAccessibleChildren(
  item: NavigationItem,
  user: User | null
): NavigationItem[] {
  if (!item.children || item.children.length === 0) {
    return [];
  }

  return item.children.filter(child => {
    const accessCheck = canAccessNavigationItem(child, user);
    return accessCheck.hasAccess;
  });
}
