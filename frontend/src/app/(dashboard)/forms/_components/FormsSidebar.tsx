'use client';

/**
 * Forms Sidebar - Legacy Entry Point
 *
 * This file maintains backward compatibility by re-exporting the refactored
 * FormsSidebar component from the sidebar/ subdirectory.
 *
 * The original 704-line monolithic component has been broken down into:
 * - sidebar/FormsSidebar.tsx (main layout wrapper)
 * - sidebar/SidebarQuickActions.tsx (quick action buttons)
 * - sidebar/SidebarStatistics.tsx (form statistics)
 * - sidebar/SidebarFilters.tsx (status and type filters)
 * - sidebar/SidebarTemplates.tsx (healthcare form templates)
 * - sidebar/SidebarActivity.tsx (recent activity feed)
 * - sidebar/SidebarInfoCards.tsx (HIPAA compliance and weekly summary)
 * - sidebar/useSidebarState.ts (state management hook)
 * - sidebar/useSidebarData.ts (data fetching hook)
 * - sidebar/sidebar.types.ts (TypeScript type definitions)
 * - sidebar/sidebar.utils.ts (utility functions)
 */

export { FormsSidebar as default } from './sidebar';
export type { FormFilter } from './sidebar/sidebar.types';


