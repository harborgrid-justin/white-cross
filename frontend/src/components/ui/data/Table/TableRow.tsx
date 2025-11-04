/**
 * @fileoverview TableRow component (tr) for table rows with selection and interaction states.
 *
 * @module components/ui/data/Table/TableRow
 * @since 1.0.0
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type { TableRowProps } from './types';

/**
 * TableRow component (tr) for table rows with selection and interaction states.
 *
 * Supports visual selection highlighting and clickable interaction patterns with
 * hover and focus states. When `clickable` is enabled, provides accessible keyboard
 * navigation and announces selection state to screen readers.
 *
 * @component
 * @param {TableRowProps} props - Component props
 * @param {React.Ref<HTMLTableRowElement>} ref - Forward ref to tr element
 * @returns {JSX.Element} Rendered table row
 *
 * @accessibility
 * - Uses semantic <tr> element
 * - When clickable, adds aria-selected for selection state
 * - Includes focus-within state for keyboard navigation
 * - Hover and focus states clearly visible
 *
 * @example Interactive Row
 * ```tsx
 * const [selected, setSelected] = useState(false);
 *
 * <TableRow
 *   clickable
 *   selected={selected}
 *   onClick={() => setSelected(!selected)}
 * >
 *   <TableCell>Interactive cell</TableCell>
 * </TableRow>
 * ```
 */
export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, selected = false, clickable = false, ...props }, ref) => {
    return (
      <tr
        ref={ref}
        className={cn(
          'transition-colors',
          selected && 'bg-blue-50',
          clickable && 'hover:bg-gray-50 cursor-pointer focus-within:bg-gray-50',
          className
        )}
        aria-selected={clickable ? (selected ? 'true' : 'false') : undefined}
        {...props}
      />
    );
  }
);

TableRow.displayName = 'TableRow';
