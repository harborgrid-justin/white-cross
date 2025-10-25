/**
 * IncidentsLayout Component
 *
 * Main layout wrapper for incidents module with optional sidebar, header, and responsive design.
 * Provides consistent structure for all incidents-related pages.
 *
 * @module components/incidents/IncidentsLayout
 */

import React, { memo, ReactNode } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs: (string | undefined)[]) => twMerge(clsx(inputs));

/**
 * Props for the IncidentsLayout component.
 *
 * @property {ReactNode} children - Main content to render
 * @property {ReactNode} [header] - Optional header component
 * @property {ReactNode} [sidebar] - Optional sidebar component
 * @property {boolean} [showSidebar=false] - Whether to display the sidebar
 * @property {string} [className] - Additional CSS classes for the container
 * @property {string} [contentClassName] - Additional CSS classes for the content area
 */
export interface IncidentsLayoutProps {
  children: ReactNode;
  header?: ReactNode;
  sidebar?: ReactNode;
  showSidebar?: boolean;
  className?: string;
  contentClassName?: string;
}

/**
 * IncidentsLayout - Main layout wrapper for incidents module
 *
 * Provides a consistent layout structure with:
 * - Optional header section
 * - Optional collapsible sidebar
 * - Main content area
 * - Responsive design (sidebar collapses on mobile)
 * - Dark mode support
 *
 * Layout Structure:
 * - Desktop: Sidebar (if enabled) + Main content area
 * - Mobile: Stacked layout with collapsible sidebar
 * - Header always at top when provided
 *
 * Features:
 * - Flexible content composition
 * - Responsive grid layout
 * - Dark mode support
 * - Proper spacing and overflow handling
 * - Accessible structure with semantic HTML
 *
 * @param props - Component props
 * @param props.children - Main content to render
 * @param props.header - Optional header component
 * @param props.sidebar - Optional sidebar component
 * @param props.showSidebar - Toggle sidebar visibility (default: false)
 * @param props.className - Additional CSS classes for container
 * @param props.contentClassName - Additional CSS classes for content area
 * @returns JSX element representing the incidents layout
 *
 * @example
 * ```tsx
 * <IncidentsLayout
 *   header={<IncidentsHeader title="Incident Reports" />}
 *   sidebar={<IncidentsSidebar />}
 *   showSidebar={true}
 * >
 *   <IncidentReportsList />
 * </IncidentsLayout>
 * ```
 *
 * @example
 * ```tsx
 * // Without sidebar
 * <IncidentsLayout
 *   header={<IncidentsHeader title="Incident Details" />}
 * >
 *   <IncidentReportDetails />
 * </IncidentsLayout>
 * ```
 */
export const IncidentsLayout = memo(({
  children,
  header,
  sidebar,
  showSidebar = false,
  className,
  contentClassName
}: IncidentsLayoutProps) => {
  return (
    <div
      className={cn(
        'incidents-layout flex flex-col h-full min-h-screen bg-gray-50 dark:bg-gray-900',
        className
      )}
    >
      {/* Header */}
      {header && (
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          {header}
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        {showSidebar && sidebar && (
          <aside
            className={cn(
              'w-full lg:w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700',
              'overflow-y-auto flex-shrink-0',
              'hidden lg:block' // Hidden on mobile, visible on desktop
            )}
            role="complementary"
            aria-label="Incidents sidebar"
          >
            <div className="p-4">
              {sidebar}
            </div>
          </aside>
        )}

        {/* Mobile Sidebar - Collapsible */}
        {showSidebar && sidebar && (
          <div
            className="lg:hidden w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
            role="complementary"
            aria-label="Incidents sidebar (mobile)"
          >
            <div className="p-4">
              {sidebar}
            </div>
          </div>
        )}

        {/* Main Content */}
        <main
          className={cn(
            'flex-1 overflow-y-auto',
            'bg-gray-50 dark:bg-gray-900',
            contentClassName
          )}
          role="main"
        >
          <div className="container mx-auto p-4 lg:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
});

IncidentsLayout.displayName = 'IncidentsLayout';

export default IncidentsLayout;
