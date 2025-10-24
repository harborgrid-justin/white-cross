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
 * DashboardGrid Component
 *
 * Features:
 * - Responsive grid layout
 * - Customizable columns (1-12)
 * - Customizable gap spacing
 * - Mobile-first responsive design
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
