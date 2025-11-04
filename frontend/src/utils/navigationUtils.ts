/**
 * WF-COMP-345 | navigationUtils.ts - Navigation utilities barrel export
 * Purpose: Main entry point re-exporting all navigation utilities
 * Upstream: All navigationUtils.* modules | Dependencies: All navigation utility modules
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: All navigation utilities via re-export | Key Features: Barrel export pattern
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Import resolution → Module loading
 * LLM Context: Barrel export maintaining backward compatibility with original navigationUtils.ts
 */

/**
 * Navigation Utilities
 *
 * Comprehensive navigation utilities for permission checking, filtering,
 * active route detection, and navigation item manipulation.
 *
 * This is a barrel export that re-exports all navigation utility modules
 * while maintaining backward compatibility with the original monolithic file.
 *
 * @module utils/navigationUtils
 */

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type {
  User,
  UserRole,
  NavigationItem,
  FilteredNavigationItem,
  NavigationPermission,
  AccessCheckResult,
  AccessDenialReason,
  RolePermissionMap,
} from './navigationUtils.types';

// ============================================================================
// PERMISSION CHECKING EXPORTS
// ============================================================================

export {
  hasRequiredRole,
  hasRequiredPermissions,
  canAccessNavigationItem,
} from './navigationUtils.permissions';

// ============================================================================
// NAVIGATION FILTERING EXPORTS
// ============================================================================

export {
  filterNavigationItems,
  getAccessibleNavigationItems,
} from './navigationUtils.filters';

// ============================================================================
// ACTIVE ROUTE DETECTION EXPORTS
// ============================================================================

export {
  isNavigationItemActive,
  markActiveNavigationItems,
} from './navigationUtils.active';

// ============================================================================
// HELPER FUNCTION EXPORTS
// ============================================================================

export {
  getDisabledReasonMessage,
  sortNavigationItems,
  groupNavigationItemsBySection,
  formatBadgeValue,
} from './navigationUtils.helpers';

// ============================================================================
// DEFAULT EXPORT (BACKWARD COMPATIBILITY)
// ============================================================================

import {
  hasRequiredRole,
  hasRequiredPermissions,
  canAccessNavigationItem,
} from './navigationUtils.permissions';

import {
  filterNavigationItems,
  getAccessibleNavigationItems,
} from './navigationUtils.filters';

import {
  isNavigationItemActive,
  markActiveNavigationItems,
} from './navigationUtils.active';

import {
  getDisabledReasonMessage,
  sortNavigationItems,
  groupNavigationItemsBySection,
  formatBadgeValue,
} from './navigationUtils.helpers';

/**
 * Default export object containing all navigation utilities
 *
 * Provides backward compatibility with original default export.
 * Prefer named imports for better tree-shaking.
 */
const navigationUtils = {
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

export default navigationUtils;
