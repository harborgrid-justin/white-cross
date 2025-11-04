/**
 * WF-COMP-345 | navigationUtils.helpers.ts - Navigation helper utilities
 * Purpose: Helper functions for navigation sorting, grouping, formatting
 * Upstream: ./navigationUtils.types | Dependencies: Type definitions
 * Downstream: Navigation components | Called by: UI components
 * Related: navigationUtils.filters, navigationUtils.permissions
 * Exports: Helper functions | Key Features: Sorting, grouping, formatting
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Data processing → UI rendering
 * LLM Context: Helper utilities module, extracted from navigationUtils.ts
 */

/**
 * Navigation Utilities - Helper Functions
 *
 * Utility functions for navigation item manipulation including:
 * - Sorting by order
 * - Grouping by section
 * - Badge formatting
 * - Disabled reason messages
 *
 * @module utils/navigationUtils.helpers
 */

import type {
  NavigationItem,
  AccessDenialReason
} from './navigationUtils.types';

// ============================================================================
// DISABLED REASON MESSAGES
// ============================================================================

/**
 * Get user-friendly message for why navigation item is disabled
 *
 * @param reason - The reason for denial (role, permission, feature, disabled)
 * @param item - Optional navigation item that may have custom message
 * @returns Human-readable message explaining why access is denied
 */
export function getDisabledReasonMessage(
  reason?: AccessDenialReason,
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
 *
 * Items without an order property are sorted to the end (order: 999).
 * Returns a new array without mutating the original.
 *
 * @param items - Array of navigation items to sort
 * @returns New sorted array
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
 *
 * Creates a Map where keys are section titles (or null for unsectioned items)
 * and values are arrays of items in that section.
 *
 * @param items - Array of navigation items to group
 * @returns Map of section titles to navigation items
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
 *
 * Rules:
 * - Returns null for undefined, null, or 0 (no badge shown)
 * - Numbers > 99 are displayed as "99+"
 * - Other numbers are stringified
 * - Strings are passed through as-is
 *
 * @param value - Badge value (number or string)
 * @returns Formatted string for display or null to hide badge
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
