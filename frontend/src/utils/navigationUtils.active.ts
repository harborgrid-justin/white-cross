/**
 * WF-COMP-345 | navigationUtils.active.ts - Active route detection utilities
 * Purpose: Detect and mark active navigation items based on current route
 * Upstream: ./navigationUtils.types | Dependencies: Type definitions
 * Downstream: Navigation components, sidebar | Called by: UI components
 * Related: navigationUtils.filters
 * Exports: Active state functions | Key Features: Route matching, tree traversal
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Route change → Detect active → Update UI state
 * LLM Context: Active route detection module, extracted from navigationUtils.ts
 */

/**
 * Navigation Utilities - Active Route Detection
 *
 * Functions for detecting active routes and marking navigation items
 * based on the current path. Supports exact and prefix matching.
 *
 * @module utils/navigationUtils.active
 */

import type {
  NavigationItem,
  FilteredNavigationItem
} from './navigationUtils.types';

// ============================================================================
// ACTIVE ROUTE DETECTION
// ============================================================================

/**
 * Check if navigation item is active based on current path
 *
 * @param item - Navigation item to check
 * @param currentPath - Current router path
 * @param exact - If true, requires exact match; if false, allows prefix match
 * @returns true if item matches the current path
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
 *
 * Recursively traverses navigation tree and marks items as:
 * - isActive: true if item's path matches current path
 * - isActiveTree: true if item or any descendant is active
 *
 * Useful for highlighting active routes and expanding parent items.
 *
 * @param items - Array of navigation items to process
 * @param currentPath - Current router path
 * @returns Array with isActive and isActiveTree properties added
 */
export function markActiveNavigationItems(
  items: NavigationItem[],
  currentPath: string
): FilteredNavigationItem[] {
  return items.map(item => {
    const isActive = isNavigationItemActive(item, currentPath, false);
    const hasActiveChild = item.children?.some((child: NavigationItem) =>
      isNavigationItemActive(child, currentPath, false)
    ) || false;

    const filteredItem: FilteredNavigationItem = {
      ...item,
      hasAccess: true, // Assuming items passed here are already filtered
      isActive,
      isActiveTree: isActive || hasActiveChild,
      children: item.children
        ? markActiveNavigationItems(item.children, currentPath)
        : undefined,
    };

    return filteredItem;
  });
}
