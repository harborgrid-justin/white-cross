/**
 * DashboardGrid Component - Responsive Grid Layout for Widgets
 *
 * Provides a responsive grid layout system for dashboard widgets.
 * Supports customizable columns and gap spacing.
 *
 * @module components/features/dashboard/DashboardGrid
 */

import React, { useMemo } from 'react';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Props for the DashboardGrid component
 *
 * @interface DashboardGridProps
 * @property {React.ReactNode} children - Grid items (typically DashboardCard components)
 * @property {1 | 2 | 3 | 4 | 6 | 12} [columns=3] - Number of columns in desktop view
 * @property {'sm' | 'md' | 'lg'} [gap='md'] - Spacing between grid items
 * @property {string} [className=''] - Additional CSS classes for customization
 */
export interface DashboardGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * DashboardGrid Component - Responsive grid layout for dashboard widgets
 *
 * Provides a flexible, mobile-first responsive grid system for organizing
 * dashboard widgets. Automatically adjusts column layout based on screen size
 * while maintaining consistent spacing.
 *
 * Features:
 * - Responsive grid layout with breakpoint-based columns
 * - Customizable columns (1, 2, 3, 4, 6, or 12-column grid)
 * - Configurable gap spacing (sm, md, lg)
 * - Mobile-first responsive design (1 col mobile → 2 col tablet → N col desktop)
 * - CSS Grid-based for optimal performance
 * - Works seamlessly with DashboardCard components
 *
 * @component
 * @param {DashboardGridProps} props - Component props
 * @returns {React.ReactElement} Rendered dashboard grid layout
 *
 * @example
 * ```tsx
 * // Basic 3-column grid with default spacing
 * <DashboardGrid>
 *   <DashboardCard title="Widget 1">Content 1</DashboardCard>
 *   <DashboardCard title="Widget 2">Content 2</DashboardCard>
 *   <DashboardCard title="Widget 3">Content 3</DashboardCard>
 * </DashboardGrid>
 * ```
 *
 * @example
 * ```tsx
 * // 4-column grid with large gaps
 * <DashboardGrid columns={4} gap="lg">
 *   <AlertsWidget alerts={alerts} />
 *   <ActivityFeedWidget activities={activities} />
 *   <ProgressWidget items={progressItems} />
 *   <QuickActionsWidget actions={quickActions} />
 * </DashboardGrid>
 * ```
 *
 * @example
 * ```tsx
 * // 2-column grid with small gaps for compact layout
 * <DashboardGrid columns={2} gap="sm" className="max-w-4xl mx-auto">
 *   <ChartWidget title="Metrics">Chart content</ChartWidget>
 *   <StatsWidget stats={stats} />
 * </DashboardGrid>
 * ```
 *
 * @remarks
 * Responsive breakpoints:
 * - Mobile (< 768px): Always 1 column (except 6 and 12 col configs)
 * - Tablet (768px - 1024px): 2-3 columns depending on config
 * - Desktop (> 1024px): Full column count as specified
 */
export const DashboardGrid = React.memo<DashboardGridProps>(({
  children,
  columns = 3,
  gap = 'md',
  className = ''
}) => {
  // Gap classes
  const gapClasses = useMemo(() => {
    const gaps = {
      sm: 'gap-4',
      md: 'gap-6',
      lg: 'gap-8'
    };
    return gaps[gap];
  }, [gap]);

  // Column classes with responsive breakpoints
  const columnClasses = useMemo(() => {
    const cols = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
      6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
      12: 'grid-cols-4 md:grid-cols-6 lg:grid-cols-12'
    };
    return cols[columns];
  }, [columns]);

  return (
    <div className={`grid ${columnClasses} ${gapClasses} ${className}`}>
      {children}
    </div>
  );
});

DashboardGrid.displayName = 'DashboardGrid';

export default DashboardGrid;
