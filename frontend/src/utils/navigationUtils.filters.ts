/**
 * WF-COMP-345 | navigationUtils.filters.ts - Navigation filtering utilities
 * Purpose: Filter navigation items based on permissions and access control
 * Upstream: ./navigationUtils.types, ./navigationUtils.permissions | Dependencies: Permission utilities
 * Downstream: Navigation components, sidebar | Called by: UI components
 * Related: navigationUtils.permissions, navigationUtils.active
 * Exports: Filtering functions | Key Features: Recursive filtering, access control
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Filter items → Check access → Build navigation tree
 * LLM Context: Navigation filtering module, extracted from navigationUtils.ts
 */

/**
 * Navigation Utilities - Filtering
 *
 * Functions for filtering navigation items based on user access,
 * including recursive child filtering and access state management.
 *
 * @module utils/navigationUtils.filters
 */

import type {
  User,
  NavigationItem,
  FilteredNavigationItem
} from './navigationUtils.types';
import { canAccessNavigationItem } from './navigationUtils.permissions';

// ============================================================================
// NAVIGATION FILTERING
// ============================================================================

/**
 * Filter navigation items based on user permissions
 *
 * Recursively filters navigation tree, preserving items that:
 * - User has access to
 * - Have accessible children (even if parent is not accessible)
 * - Are not marked as hidden
 *
 * @param items - Array of navigation items to filter
 * @param user - Current user object (null if not authenticated)
 * @returns Filtered array with access information attached
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
      const filteredItem = item as FilteredNavigationItem;
      if (filteredItem.hasAccess) {
        return true;
      }

      if (filteredItem.children && filteredItem.children.length > 0) {
        return (filteredItem.children as FilteredNavigationItem[]).some((child) => child.hasAccess);
      }

      return false;
    });
}

/**
 * Get only accessible navigation items (removes items without access)
 *
 * Returns clean NavigationItem objects without access metadata.
 * Use this when you only want items the user can actually access.
 *
 * @param items - Array of navigation items to filter
 * @param user - Current user object (null if not authenticated)
 * @returns Array of accessible navigation items only
 */
export function getAccessibleNavigationItems(
  items: NavigationItem[],
  user: User | null
): NavigationItem[] {
  const filtered = filterNavigationItems(items, user);
  return filtered
    .filter(item => item.hasAccess)
    .map(item => {
      // Extract only NavigationItem properties
      const { hasAccess, noAccessReason, isActive, isActiveTree, ...navItem } = item;
      return navItem as NavigationItem;
    });
}
