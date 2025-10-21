/**
 * WF-COMP-345 | navigationUtils.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../types, ../types/navigation, ../guards/navigationGuards | Dependencies: ../types, ../types/navigation, ../guards/navigationGuards
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export, functions | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Navigation Utilities
 *
 * Helper functions for filtering navigation items based on permissions,
 * checking route access, and managing navigation state.
 *
 * @module utils/navigationUtils
 */

import { User, UserRole } from '../types';
import { NavigationItem, FilteredNavigationItem, NavigationPermission } from '../types/navigation';
import { hasAccessToRoute } from '../guards/navigationGuards';
import { ROUTE_METADATA } from '../routes/routeUtils';

// ============================================================================
// PERMISSION CHECKING
// ============================================================================

/**
 * Check if user has required role for navigation item
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
  const rolePermissions: Record<UserRole, string[]> = {
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
    READ_ONLY: [
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
 */
export function canAccessNavigationItem(
  item: NavigationItem,
  user: User | null
): { hasAccess: boolean; reason?: 'role' | 'permission' | 'feature' | 'disabled' } {
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
// NAVIGATION FILTERING
// ============================================================================

/**
 * Filter navigation items based on user permissions
 */
export function filterNavigationItems(
  items: NavigationItem[],
  user: User | null
): FilteredNavigationItem[] {
  return items
    .filter(item => !item.hidden)
    .map(item => {
      const accessCheck = canAccessNavigationItem(item, user);

      const filteredItem: FilteredNavigationItem = {
        ...item,
        hasAccess: accessCheck.hasAccess,
        noAccessReason: accessCheck.reason,
      };

      // Recursively filter children if any
      if (item.children && item.children.length > 0) {
        const filteredChildren = filterNavigationItems(item.children, user);
        filteredItem.children = filteredChildren;
      }

      return filteredItem;
    })
    .filter(item => {
      // Keep items that user has access to, or items with accessible children
      if (item.hasAccess) {
        return true;
      }

      if (item.children && item.children.length > 0) {
        return item.children.some(child => child.hasAccess);
      }

      return false;
    });
}

/**
 * Get only accessible navigation items (removes items without access)
 */
export function getAccessibleNavigationItems(
  items: NavigationItem[],
  user: User | null
): NavigationItem[] {
  return filterNavigationItems(items, user)
    .filter(item => item.hasAccess)
    .map(({ hasAccess, noAccessReason, ...item }) => item as NavigationItem);
}

// ============================================================================
// ACTIVE ROUTE DETECTION
// ============================================================================

/**
 * Check if navigation item is active based on current path
 */
export function isNavigationItemActive(
  item: NavigationItem,
  currentPath: string,
  exact: boolean = false
): boolean {
  if (exact) {
    return currentPath === item.path;
  }

  return currentPath.startsWith(item.path);
}

/**
 * Mark active navigation items in tree
 */
export function markActiveNavigationItems(
  items: FilteredNavigationItem[],
  currentPath: string
): FilteredNavigationItem[] {
  return items.map(item => {
    const isActive = isNavigationItemActive(item, currentPath, false);
    const hasActiveChild = item.children?.some(child =>
      isNavigationItemActive(child, currentPath, false)
    ) || false;

    return {
      ...item,
      isActive,
      isActiveTree: isActive || hasActiveChild,
      children: item.children
        ? markActiveNavigationItems(item.children, currentPath)
        : undefined,
    };
  });
}

// ============================================================================
// FEATURE FLAGS
// ============================================================================

/**
 * Check if feature flag is enabled
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

// ============================================================================
// DISABLED REASON MESSAGES
// ============================================================================

/**
 * Get user-friendly message for why navigation item is disabled
 */
export function getDisabledReasonMessage(
  reason?: 'role' | 'permission' | 'feature' | 'disabled',
  item?: NavigationItem
): string {
  if (item?.disabledMessage) {
    return item.disabledMessage;
  }

  switch (reason) {
    case 'role':
      return 'Your role does not have access to this section';
    case 'permission':
      return 'You do not have the required permissions';
    case 'feature':
      return 'This feature is not available in your plan';
    case 'disabled':
      return 'This section is temporarily unavailable';
    default:
      return 'Access not available';
  }
}

// ============================================================================
// NAVIGATION SORTING
// ============================================================================

/**
 * Sort navigation items by order property
 */
export function sortNavigationItems(
  items: NavigationItem[]
): NavigationItem[] {
  return [...items].sort((a, b) => {
    const orderA = a.order ?? 999;
    const orderB = b.order ?? 999;
    return orderA - orderB;
  });
}

// ============================================================================
// NAVIGATION GROUPING
// ============================================================================

/**
 * Group navigation items by section
 */
export function groupNavigationItemsBySection(
  items: NavigationItem[]
): Map<string | null, NavigationItem[]> {
  const groups = new Map<string | null, NavigationItem[]>();

  items.forEach(item => {
    const section = item.sectionTitle || null;
    if (!groups.has(section)) {
      groups.set(section, []);
    }
    groups.get(section)!.push(item);
  });

  return groups;
}

// ============================================================================
// BADGE FORMATTING
// ============================================================================

/**
 * Format badge value for display
 */
export function formatBadgeValue(
  value: string | number | undefined
): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value === 'number') {
    if (value === 0) {
      return null; // Don't show badge for zero
    }
    if (value > 99) {
      return '99+';
    }
    return value.toString();
  }

  return value;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  hasRequiredRole,
  hasRequiredPermissions,
  canAccessNavigationItem,
  filterNavigationItems,
  getAccessibleNavigationItems,
  isNavigationItemActive,
  markActiveNavigationItems,
  getDisabledReasonMessage,
  sortNavigationItems,
  groupNavigationItemsBySection,
  formatBadgeValue,
};
