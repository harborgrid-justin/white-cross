/**
 * Sidebar Components - Index
 * Centralized exports for document sidebar components
 */

// Main sidebar component
export { DocumentsSidebar } from './DocumentsSidebar';

// Individual section components
export { QuickStatsCard } from './QuickStatsCard';
export { DocumentAlertsCard } from './DocumentAlertsCard';
export { RecentDocumentsCard } from './RecentDocumentsCard';
export { RecentActivityCard } from './RecentActivityCard';
export { QuickActionsCard } from './QuickActionsCard';

// Custom hooks
export { useSidebarData } from './useSidebarData';
export { useSidebarFormatters } from './useSidebarFormatters';

// Types
export type {
  RecentDocument,
  DocumentActivity,
  DocumentAlert,
  QuickStats,
  SidebarData
} from './sidebar.types';
