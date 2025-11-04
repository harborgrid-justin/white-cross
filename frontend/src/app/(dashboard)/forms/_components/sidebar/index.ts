/**
 * Forms Sidebar - Public API
 *
 * This module exports all public components, hooks, types, and utilities
 * for the Forms Sidebar feature.
 */

// Main component
export { FormsSidebar, default } from './FormsSidebar';

// Sub-components (exported for potential standalone use)
export { SidebarQuickActions } from './SidebarQuickActions';
export { SidebarStatistics } from './SidebarStatistics';
export { SidebarFilters } from './SidebarFilters';
export { SidebarTemplates } from './SidebarTemplates';
export { SidebarActivity } from './SidebarActivity';
export {
  SidebarInfoCards,
  HIPAAComplianceCard,
  WeeklySummaryCard,
} from './SidebarInfoCards';

// Custom hooks
export { useSidebarState } from './useSidebarState';
export { useSidebarData } from './useSidebarData';
export type { UseSidebarStateReturn } from './useSidebarState';
export type { UseSidebarDataReturn } from './useSidebarData';

// Types
export type {
  FormType,
  FormStatus,
  ActivityType,
  QuickAction,
  FormTemplate,
  RecentActivity,
  FormFilter,
  SidebarStat,
  SidebarSection,
} from './sidebar.types';

// Utilities
export {
  getCategoryBadgeColor,
  getActivityTypeLabel,
  formatTimeAgo,
} from './sidebar.utils';
