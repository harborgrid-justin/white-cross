/**
 * @fileoverview TableHead component (th) for column header cells with optional sorting.
 *
 * @module components/ui/data/Table/TableHead
 * @since 1.0.0
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { SortIcon } from './utils.tsx';
import type { TableHeadProps } from './types';

/**
 * TableHead component (th) for column header cells with optional sorting.
 *
 * Renders column header cells with support for sortable columns. When sortable,
 * displays up/down arrow indicators and handles keyboard interaction (Enter/Space).
 * Communicates sort direction to assistive technologies via aria-sort.
 *
 * **Features:**
 * - Sortable columns with visual indicators
 * - Keyboard accessible (Enter or Space to sort)
 * - ARIA sort direction announcement
 * - Focus management with visible focus ring
 * - Uppercase, bold styling for headers
 *
 * @component
 * @param {TableHeadProps} props - Component props
 * @param {React.Ref<HTMLTableHeaderCellElement>} ref - Forward ref to th element
 * @returns {JSX.Element} Rendered table header cell
 *
 * @accessibility
 * - Uses semantic <th> with scope="col"
 * - Sortable headers are keyboard accessible (tab, enter, space)
 * - aria-sort indicates current sort direction
 * - Focus ring clearly visible for keyboard users
 * - Sort icons marked aria-hidden (decorative)
 *
 * @keyboard
 * - `Tab`: Move focus to sortable header
 * - `Enter`: Activate sort
 * - `Space`: Activate sort
 *
 * @example Sortable Column
 * ```tsx
 * const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
 *
 * <TableHead
 *   sortable
 *   sortDirection={sortDir}
 *   onSort={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}
 * >
 *   Student Name
 * </TableHead>
 * ```
 */
export const TableHead = React.forwardRef<HTMLTableHeaderCellElement, TableHeadProps>(
  ({ className, sortable = false, sortDirection = null, onSort, children, ...props }, ref) => {
    /**
     * Handles keyboard events for sortable headers.
     *
     * @param {React.KeyboardEvent<HTMLTableCellElement>} e - Keyboard event
     * @internal
     */
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTableCellElement>) => {
      if (sortable && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        onSort?.();
      }
    };

    return (
      <th
        ref={ref}
        scope="col"
        className={cn(
          'text-left text-xs font-semibold text-gray-900 uppercase tracking-wider',
          sortable && 'cursor-pointer select-none hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500',
          className
        )}
        onClick={sortable ? onSort : undefined}
        onKeyDown={sortable ? handleKeyDown : undefined}
        tabIndex={sortable ? 0 : undefined}
        aria-sort={sortable && sortDirection ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined}
        {...props}
      >
        <div className="flex items-center">
          {children}
          <SortIcon direction={sortDirection} sortable={sortable} />
        </div>
      </th>
    );
  }
);

TableHead.displayName = 'TableHead';
