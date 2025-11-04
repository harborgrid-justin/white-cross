'use client';

/**
 * Forms Sidebar - Main Layout Component
 *
 * This is the main sidebar wrapper that composes all sub-components:
 * - Quick Actions
 * - Statistics
 * - Filters
 * - Templates
 * - Recent Activity
 * - Info Cards (HIPAA compliance, weekly summary)
 *
 * The sidebar uses custom hooks for state management and data fetching.
 */

import React from 'react';
import { SidebarQuickActions } from './SidebarQuickActions';
import { SidebarStatistics } from './SidebarStatistics';
import { SidebarFilters } from './SidebarFilters';
import { SidebarTemplates } from './SidebarTemplates';
import { SidebarActivity } from './SidebarActivity';
import { SidebarInfoCards } from './SidebarInfoCards';
import { useSidebarState } from './useSidebarState';
import { useSidebarData } from './useSidebarData';
import type { FormFilter } from './sidebar.types';

interface FormsSidebarProps {
  /**
   * Callback fired when filter changes
   */
  onFilterChange?: (filter: FormFilter) => void;
  /**
   * Current active filter
   */
  currentFilter?: FormFilter;
  /**
   * Custom className for the sidebar container
   */
  className?: string;
}

/**
 * Main Forms Sidebar Component
 *
 * Provides a comprehensive sidebar for form management with filtering,
 * quick actions, templates, and activity tracking.
 */
export function FormsSidebar({
  onFilterChange,
  currentFilter,
  className = '',
}: FormsSidebarProps) {
  // State management for collapsible sections
  const { expandedSection, toggleSection } = useSidebarState('templates');

  // Fetch all sidebar data
  const { quickActions, templates, recentActivity, sidebarStats, weeklySummary } =
    useSidebarData();

  return (
    <aside
      className={`w-80 bg-white border-l border-gray-200 overflow-y-auto ${className}`}
      role="complementary"
      aria-label="Forms sidebar"
    >
      <div className="p-4 space-y-6">
        {/* Quick Actions Section */}
        <SidebarQuickActions actions={quickActions} />

        {/* Form Statistics Section */}
        <SidebarStatistics
          stats={sidebarStats}
          isExpanded={expandedSection === 'stats'}
          onToggle={() => toggleSection('stats')}
        />

        {/* Filter Options Section */}
        <SidebarFilters
          currentFilter={currentFilter}
          onFilterChange={onFilterChange}
        />

        {/* Healthcare Form Templates Section */}
        <SidebarTemplates
          templates={templates}
          isExpanded={expandedSection === 'templates'}
          onToggle={() => toggleSection('templates')}
          maxVisible={4}
        />

        {/* Recent Activity Section */}
        <SidebarActivity
          activities={recentActivity}
          isExpanded={expandedSection === 'activity'}
          onToggle={() => toggleSection('activity')}
          maxVisible={5}
        />

        {/* Info Cards Section */}
        <SidebarInfoCards weeklySummary={weeklySummary} />
      </div>
    </aside>
  );
}

export default FormsSidebar;
