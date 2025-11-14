/**
 * @fileoverview Navigation utility functions
 * 
 * This module provides utility functions for navigation operations:
 * - Navigation item lookup and search
 * - Breadcrumb generation
 * - Path validation and matching
 * - Role-based filtering
 * - Navigation state management
 * 
 * @module config/navigation/utils
 */

import type { NavigationSection, NavigationItem, BreadcrumbItem } from '../../types/core/navigation';
import type { UserRole } from '../../types/core/common';
import { 
  CORE_SECTION, 
  CLINICAL_SECTION, 
  OPERATIONS_SECTION, 
  COMMUNICATION_SECTION, 
  INCIDENTS_SECTION, 
  ANALYTICS_SECTION, 
  COMPLIANCE_SECTION, 
  SYSTEM_SECTION 
} from './sections';

/**
 * All navigation sections for lookup operations
 */
const ALL_SECTIONS: NavigationSection[] = [
  CORE_SECTION,
  CLINICAL_SECTION,
  OPERATIONS_SECTION,
  COMMUNICATION_SECTION,
  INCIDENTS_SECTION,
  ANALYTICS_SECTION,
  COMPLIANCE_SECTION,
  SYSTEM_SECTION,
];

/**
 * Find a navigation item by its unique ID across all sections
 * 
 * @param id - Navigation item ID to search for
 * @returns NavigationItem if found, undefined otherwise
 * 
 * @example
 * ```typescript
 * const studentNav = getNavigationItemById('students');
 * if (studentNav) {
 *   console.log(`Found: ${studentNav.name} at ${studentNav.path}`);
 * }
 * ```
 */
export function getNavigationItemById(id: string): NavigationItem | undefined {
  for (const section of ALL_SECTIONS) {
    for (const item of section.items) {
      if (item.id === id) return item;
      if (item.children) {
        const child = item.children.find(c => c.id === id);
        if (child) return child;
      }
    }
  }
  return undefined;
}

/**
 * Find a navigation item by its path across all sections
 * 
 * @param path - Path to search for (e.g., '/students', '/students/new')
 * @returns NavigationItem if found, undefined otherwise
 * 
 * @example
 * ```typescript
 * const item = getNavigationItemByPath('/students/new');
 * if (item) {
 *   console.log(`Add Student: ${item.name}`);
 * }
 * ```
 */
export function getNavigationItemByPath(path: string): NavigationItem | undefined {
  for (const section of ALL_SECTIONS) {
    for (const item of section.items) {
      if (item.path === path) return item;
      if (item.children) {
        const child = item.children.find(c => c.path === path);
        if (child) return child;
      }
    }
  }
  return undefined;
}

/**
 * Get all navigation paths from all sections
 * 
 * @returns Array of all navigation paths for route validation
 * 
 * @example
 * ```typescript
 * const allPaths = getAllNavigationPaths();
 * const isValidPath = allPaths.includes('/students');
 * ```
 */
export function getAllNavigationPaths(): string[] {
  const paths: string[] = [];

  for (const section of ALL_SECTIONS) {
    for (const item of section.items) {
      paths.push(item.path);
      if (item.children) {
        paths.push(...item.children.map(c => c.path));
      }
    }
  }

  return [...new Set(paths)]; // Remove duplicates
}

/**
 * Generate navigation breadcrumbs for a given path
 * 
 * Creates a breadcrumb trail showing the navigation hierarchy
 * leading to the current page.
 * 
 * @param path - Current path to generate breadcrumbs for
 * @returns Array of breadcrumb items
 * 
 * @example
 * ```typescript
 * const breadcrumbs = getBreadcrumbs('/students/new');
 * // Returns: [
 * //   { label: 'Home', path: '/dashboard', isActive: false, isClickable: true },
 * //   { label: 'Students', path: '/students', isActive: false, isClickable: true },
 * //   { label: 'Add Student', path: '/students/new', isActive: true, isClickable: false }
 * // ]
 * ```
 */
export function getBreadcrumbs(path: string): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [
    { 
      label: 'Home', 
      path: '/dashboard', 
      isActive: path === '/dashboard',
      isClickable: path !== '/dashboard',
      ariaLabel: 'Navigate to dashboard'
    }
  ];

  // Skip home breadcrumb if already on dashboard
  if (path === '/dashboard') {
    return breadcrumbs;
  }

  for (const section of ALL_SECTIONS) {
    for (const item of section.items) {
      if (item.path === path) {
        breadcrumbs.push({
          label: item.name,
          path: item.path,
          isActive: true,
          isClickable: false,
          ariaLabel: item.ariaLabel || `Current page: ${item.name}`
        });
        return breadcrumbs;
      }
      
      if (item.children) {
        const child = item.children.find(c => c.path === path);
        if (child) {
          breadcrumbs.push({
            label: item.name,
            path: item.path,
            isActive: false,
            isClickable: true,
            ariaLabel: item.ariaLabel || `Navigate to ${item.name}`
          });
          breadcrumbs.push({
            label: child.name,
            path: child.path,
            isActive: true,
            isClickable: false,
            ariaLabel: child.ariaLabel || `Current page: ${child.name}`
          });
          return breadcrumbs;
        }
      }
    }
  }

  return breadcrumbs;
}

/**
 * Check if a user has access to a navigation item based on their role
 * 
 * @param item - Navigation item to check
 * @param userRole - User's role
 * @returns true if user has access, false otherwise
 * 
 * @example
 * ```typescript
 * const studentNav = getNavigationItemById('students');
 * const hasAccess = checkItemAccess(studentNav, 'NURSE');
 * ```
 */
export function checkItemAccess(item: NavigationItem | undefined, userRole: UserRole | null): boolean {
  if (!item || !userRole) return false;
  if (!item.roles || item.roles.length === 0) return true;
  return item.roles.includes(userRole);
}

/**
 * Filter navigation sections by user role
 * 
 * Removes sections and items that the user doesn't have access to
 * based on their role permissions.
 * 
 * @param sections - Navigation sections to filter
 * @param userRole - User's role
 * @returns Filtered navigation sections
 * 
 * @example
 * ```typescript
 * const userSections = filterSectionsByRole(ALL_SECTIONS, 'NURSE');
 * ```
 */
export function filterSectionsByRole(
  sections: NavigationSection[], 
  userRole: UserRole | null
): NavigationSection[] {
  if (!userRole) return [];

  return sections
    .map(section => ({
      ...section,
      items: section.items
        .filter(item => checkItemAccess(item, userRole))
        .map(item => ({
          ...item,
          children: item.children?.filter(child => checkItemAccess(child, userRole))
        }))
    }))
    .filter(section => {
      // Include section if it has accessible items OR if section-level roles allow it
      const hasAccessibleItems = section.items.length > 0;
      const hasDirectAccess = !section.roles || section.roles.includes(userRole);
      return hasAccessibleItems && hasDirectAccess;
    });
}

/**
 * Get the parent navigation item for a given child item
 * 
 * @param childId - ID of the child navigation item
 * @returns Parent NavigationItem if found, undefined otherwise
 * 
 * @example
 * ```typescript
 * const parent = getParentNavigationItem('students-add');
 * // Returns the 'students' navigation item
 * ```
 */
export function getParentNavigationItem(childId: string): NavigationItem | undefined {
  for (const section of ALL_SECTIONS) {
    for (const item of section.items) {
      if (item.children?.some(child => child.id === childId)) {
        return item;
      }
    }
  }
  return undefined;
}

/**
 * Check if a path is currently active or within an active tree
 * 
 * Useful for highlighting navigation items when on child pages.
 * 
 * @param itemPath - Navigation item path to check
 * @param currentPath - Current page path
 * @param exact - Whether to match exactly or allow sub-paths
 * @returns true if path is active or within active tree
 * 
 * @example
 * ```typescript
 * const isActive = isPathActive('/students', '/students/123', false);
 * // Returns true because current path is under /students
 * 
 * const isExactActive = isPathActive('/students', '/students/123', true);
 * // Returns false because paths don't match exactly
 * ```
 */
export function isPathActive(itemPath: string, currentPath: string, exact = false): boolean {
  if (exact) {
    return itemPath === currentPath;
  }
  
  // For non-exact matching, check if current path starts with item path
  return currentPath === itemPath || currentPath.startsWith(itemPath + '/');
}

/**
 * Search navigation items by name or path
 * 
 * @param query - Search query string
 * @param userRole - User's role for filtering results
 * @returns Array of matching NavigationItems
 * 
 * @example
 * ```typescript
 * const results = searchNavigationItems('student', 'NURSE');
 * // Returns navigation items containing 'student' in name or path
 * ```
 */
export function searchNavigationItems(query: string, userRole: UserRole | null): NavigationItem[] {
  if (!query.trim()) return [];
  
  const lowerQuery = query.toLowerCase();
  const results: NavigationItem[] = [];

  for (const section of ALL_SECTIONS) {
    for (const item of section.items) {
      if (!checkItemAccess(item, userRole)) continue;
      
      if (item.name.toLowerCase().includes(lowerQuery) || 
          item.path.toLowerCase().includes(lowerQuery)) {
        results.push(item);
      }
      
      if (item.children) {
        for (const child of item.children) {
          if (!checkItemAccess(child, userRole)) continue;
          
          if (child.name.toLowerCase().includes(lowerQuery) || 
              child.path.toLowerCase().includes(lowerQuery)) {
            results.push(child);
          }
        }
      }
    }
  }

  return results;
}

/**
 * Get navigation statistics
 * 
 * @param userRole - User's role for filtering
 * @returns Object containing navigation statistics
 * 
 * @example
 * ```typescript
 * const stats = getNavigationStats('NURSE');
 * console.log(`Accessible items: ${stats.accessibleItems}`);
 * ```
 */
export function getNavigationStats(userRole: UserRole | null): {
  totalSections: number;
  accessibleSections: number;
  totalItems: number;
  accessibleItems: number;
  totalChildItems: number;
  accessibleChildItems: number;
} {
  const filteredSections = filterSectionsByRole(ALL_SECTIONS, userRole);
  
  let totalItems = 0;
  let accessibleItems = 0;
  let totalChildItems = 0;
  let accessibleChildItems = 0;

  // Count total items
  for (const section of ALL_SECTIONS) {
    totalItems += section.items.length;
    for (const item of section.items) {
      if (item.children) {
        totalChildItems += item.children.length;
      }
    }
  }

  // Count accessible items
  for (const section of filteredSections) {
    accessibleItems += section.items.length;
    for (const item of section.items) {
      if (item.children) {
        accessibleChildItems += item.children.length;
      }
    }
  }

  return {
    totalSections: ALL_SECTIONS.length,
    accessibleSections: filteredSections.length,
    totalItems,
    accessibleItems,
    totalChildItems,
    accessibleChildItems,
  };
}
