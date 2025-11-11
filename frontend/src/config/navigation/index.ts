/**
 * @fileoverview Navigation configuration main index
 * 
 * This module serves as the main export point for all navigation configuration:
 * - Navigation sections (Core, Clinical, Operations, etc.)
 * - Quick access items for common tasks
 * - Utility functions for navigation operations
 * - Backward compatibility with legacy exports
 * 
 * @module config/navigation
 */

// Internal imports
import {
  CORE_SECTION,
  CLINICAL_SECTION,
  OPERATIONS_SECTION,
  COMMUNICATION_SECTION,
  INCIDENTS_SECTION,
  ANALYTICS_SECTION,
  COMPLIANCE_SECTION,
  SYSTEM_SECTION,
} from './sections';

import {
  QUICK_ACCESS_ITEMS,
  QUICK_ACCESS_CATEGORIES,
  getQuickAccessItemsByCategory,
  getQuickAccessItemById,
  filterQuickAccessByRole,
} from './quickAccess';

import {
  getNavigationItemById,
  getNavigationItemByPath,
  getAllNavigationPaths,
  getBreadcrumbs,
  checkItemAccess,
  filterSectionsByRole,
  getParentNavigationItem,
  isPathActive,
  searchNavigationItems,
  getNavigationStats,
} from './utils';

import type {
  NavigationSection,
  NavigationItem,
  QuickAccessItem,
  BreadcrumbItem,
} from '../../types/core/navigation';

import type { UserRole } from '../../types/core/common';

// Re-exports
export {
  CORE_SECTION,
  CLINICAL_SECTION,
  OPERATIONS_SECTION,
  COMMUNICATION_SECTION,
  INCIDENTS_SECTION,
  ANALYTICS_SECTION,
  COMPLIANCE_SECTION,
  SYSTEM_SECTION,
  QUICK_ACCESS_ITEMS,
  QUICK_ACCESS_CATEGORIES,
  getQuickAccessItemsByCategory,
  getQuickAccessItemById,
  filterQuickAccessByRole,
  getNavigationItemById,
  getNavigationItemByPath,
  getAllNavigationPaths,
  getBreadcrumbs,
  checkItemAccess,
  filterSectionsByRole,
  getParentNavigationItem,
  isPathActive,
  searchNavigationItems,
  getNavigationStats,
};

export type {
  NavigationSection,
  NavigationItem,
  QuickAccessItem,
  BreadcrumbItem,
  UserRole,
};

/**
 * Complete navigation sections array for easy consumption
 */
export const NAVIGATION_SECTIONS = [
  CORE_SECTION,
  CLINICAL_SECTION,
  OPERATIONS_SECTION,
  COMMUNICATION_SECTION,
  INCIDENTS_SECTION,
  ANALYTICS_SECTION,
  COMPLIANCE_SECTION,
  SYSTEM_SECTION,
] as const;

/**
 * Navigation configuration object providing all navigation data and utilities
 * 
 * This object provides a complete interface for navigation functionality
 * including sections, quick access items, and utility functions.
 * 
 * @example
 * ```typescript
 * import { NavigationConfig } from './config/navigation';
 * 
 * // Get filtered sections for a user
 * const userSections = NavigationConfig.getSectionsForRole('NURSE');
 * 
 * // Generate breadcrumbs
 * const breadcrumbs = NavigationConfig.getBreadcrumbs('/students/new');
 * 
 * // Get quick access items
 * const quickItems = NavigationConfig.getQuickAccessForRole('ADMIN');
 * ```
 */
export const NavigationConfig = {
  // Data
  sections: NAVIGATION_SECTIONS,
  quickAccess: QUICK_ACCESS_ITEMS,
  
  // Section utilities
  getSectionsForRole: (userRole: UserRole | null) => 
    filterSectionsByRole([...NAVIGATION_SECTIONS], userRole),
  
  getSectionByTitle: (title: string) =>
    NAVIGATION_SECTIONS.find(section => section.title === title),
  
  // Item utilities
  getItemById: getNavigationItemById,
  getItemByPath: getNavigationItemByPath,
  getParentItem: getParentNavigationItem,
  checkAccess: checkItemAccess,
  
  // Path utilities
  getAllPaths: getAllNavigationPaths,
  isActive: isPathActive,
  getBreadcrumbs: getBreadcrumbs,
  
  // Search utilities
  search: searchNavigationItems,
  getStats: getNavigationStats,
  
  // Quick access utilities
  getQuickAccessForRole: filterQuickAccessByRole,
  getQuickAccessById: getQuickAccessItemById,
  getQuickAccessByCategory: getQuickAccessItemsByCategory,
} as const;

/**
 * Default export for convenience
 */
export default NavigationConfig;
