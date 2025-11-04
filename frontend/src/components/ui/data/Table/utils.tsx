/**
 * @fileoverview Utility components and helper functions for the Table component system.
 *
 * This module contains shared utilities, helper components, and functions used across
 * table sub-components, including the SortIcon for sortable columns.
 *
 * @module components/ui/data/Table/utils
 * @since 1.0.0
 */

import React from 'react';
import { cn } from '@/lib/utils';
import type { SortIconProps } from './types';

/**
 * Sort indicator icon component showing ascending/descending arrows.
 *
 * Displays dual arrow indicators for sortable table columns. Highlights the active
 * sort direction by changing the arrow color from gray to dark gray/black.
 *
 * @component
 * @param {SortIconProps} props - Icon props
 * @returns {JSX.Element | null} Sort icon or null if not sortable
 *
 * @accessibility
 * - Marked with aria-hidden="true" as decorative (sort state communicated via aria-sort on th)
 * - Visual indicator only, not interactive
 *
 * @internal
 *
 * @example
 * ```tsx
 * <SortIcon direction="asc" sortable={true} />
 * <SortIcon direction="desc" sortable={true} />
 * <SortIcon direction={null} sortable={true} />
 * ```
 */
export const SortIcon: React.FC<SortIconProps> = ({ direction, sortable }) => {
  if (!sortable) return null;

  return (
    <span className="ml-2 inline-flex flex-col" aria-hidden="true">
      {/* Ascending arrow */}
      <svg
        className={cn(
          'h-3 w-3 -mb-0.5',
          direction === 'asc' ? 'text-gray-900' : 'text-gray-400'
        )}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" />
      </svg>
      {/* Descending arrow */}
      <svg
        className={cn(
          'h-3 w-3',
          direction === 'desc' ? 'text-gray-900' : 'text-gray-400'
        )}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
      </svg>
    </span>
  );
};

SortIcon.displayName = 'SortIcon';
