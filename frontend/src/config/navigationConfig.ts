/**
 * WF-CONFIG-001 | navigationConfig.ts - Navigation Configuration (LEGACY)
 * Purpose: Legacy navigation configuration - DEPRECATED, use ./navigation/ modules
 * Dependencies: ./navigation/index
 * Exports: NAVIGATION_SECTIONS, QUICK_ACCESS_ITEMS (for backward compatibility)
 * Features: Role-based access, hierarchical structure, icon integration
 * Last Updated: 2025-11-11
 * Agent: Core Config/Constants Architect
 *
 * @deprecated This file is deprecated. Use the new modular navigation structure:
 * - Import from './navigation/index' for new code
 * - Individual modules: './navigation/sections', './navigation/quickAccess', './navigation/utils'
 * 
 * Migration Guide:
 * ```typescript
 * // OLD (deprecated)
 * import { NAVIGATION_SECTIONS } from './navigationConfig';
 * 
 * // NEW (preferred)
 * import { NAVIGATION_SECTIONS } from './navigation';
 * ```
 *
 * Navigation Structure:
 * - Core: Dashboard, User Management
 * - Clinical: Students, Health Records, Medications, Appointments, Immunizations
 * - Operations: Billing, Inventory, Purchasing, Vendors
 * - Communication: Messages, Documents, Notifications
 * - Incidents: Incident Reports, Witnesses, Follow-ups
 * - Analytics: Health Metrics, Reports, Dashboards
 * - Compliance: Audit Logs, Policies, Security
 * - System: Settings, Integrations, Configuration
 *
 * HIPAA Compliance:
 * - Role-based access control
 * - Audit trail integration
 * - PHI access restrictions
 * - Permission-based visibility
 */

// Import from new modular structure for backward compatibility
import {
  NAVIGATION_SECTIONS as NEW_NAVIGATION_SECTIONS,
  QUICK_ACCESS_ITEMS as NEW_QUICK_ACCESS_ITEMS,
  getNavigationItemById as getNavigationItemByIdNew,
  getAllNavigationPaths as getAllNavigationPathsNew,
  getBreadcrumbs as getBreadcrumbsNew,
} from './navigation';

import type { NavigationSection, QuickAccessItem } from './navigation';

/**
 * @deprecated Use NAVIGATION_SECTIONS from './navigation' instead
 * 
 * Main navigation sections organized by domain.
 * Re-exported from new modular structure for backward compatibility.
 */
export const NAVIGATION_SECTIONS = NEW_NAVIGATION_SECTIONS;

/**
 * @deprecated Use QUICK_ACCESS_ITEMS from './navigation' instead
 * 
 * Quick access items for common tasks.
 * Re-exported from new modular structure for backward compatibility.
 */
export const QUICK_ACCESS_ITEMS = NEW_QUICK_ACCESS_ITEMS;

/**
 * @deprecated Use getNavigationItemById from './navigation' instead
 * 
 * Navigation item lookup by ID.
 * Re-exported from new modular structure for backward compatibility.
 */
export const getNavigationItemById = getNavigationItemByIdNew;

/**
 * @deprecated Use getAllNavigationPaths from './navigation' instead
 * 
 * Get all navigation paths.
 * Re-exported from new modular structure for backward compatibility.
 */
export const getAllNavigationPaths = getAllNavigationPathsNew;

/**
 * @deprecated Use getBreadcrumbs from './navigation' instead
 * 
 * Get navigation breadcrumbs for a given path.
 * Re-exported from new modular structure for backward compatibility.
 */
export const getBreadcrumbs = getBreadcrumbsNew;

/**
 * @deprecated Use NavigationConfig from './navigation' instead
 * 
 * Legacy default export for backward compatibility.
 */
export default {
  NAVIGATION_SECTIONS,
  QUICK_ACCESS_ITEMS,
  getNavigationItemById,
  getAllNavigationPaths,
  getBreadcrumbs,
};
