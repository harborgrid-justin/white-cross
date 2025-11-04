/**
 * @fileoverview TableCell component (td) for data cells.
 *
 * @module components/ui/data/Table/TableCell
 * @since 1.0.0
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type { TableCellProps } from './types';

/**
 * TableCell component (td) for data cells.
 *
 * Renders standard table data cells with consistent text styling and nowrap behavior
 * to prevent cell content from wrapping (can be overridden with className).
 *
 * @component
 * @param {TableCellProps} props - Component props
 * @param {React.Ref<HTMLTableDataCellElement>} ref - Forward ref to td element
 * @returns {JSX.Element} Rendered table data cell
 *
 * @accessibility
 * - Uses semantic <td> element
 * - Maintains table cell semantics for screen readers
 *
 * @example
 * ```tsx
 * <TableCell>John Doe</TableCell>
 * <TableCell className="text-red-600">Peanut allergy</TableCell>
 * <TableCell>
 *   <button>Edit</button>
 * </TableCell>
 * ```
 */
export const TableCell = React.forwardRef<HTMLTableDataCellElement, TableCellProps>(
  ({ className, ...props }, ref) => {
    return (
      <td
        ref={ref}
        className={cn('text-gray-900 whitespace-nowrap', className)}
        {...props}
      />
    );
  }
);

TableCell.displayName = 'TableCell';
