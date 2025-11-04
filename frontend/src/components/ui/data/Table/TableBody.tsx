/**
 * @fileoverview TableBody component (tbody) for grouping data rows.
 *
 * @module components/ui/data/Table/TableBody
 * @since 1.0.0
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type { TableBodyProps } from './types';

/**
 * TableBody component (tbody) for grouping data rows.
 *
 * Provides row dividers and consistent spacing for table data rows.
 *
 * @component
 * @param {TableBodyProps} props - Component props
 * @param {React.Ref<HTMLTableSectionElement>} ref - Forward ref to tbody element
 * @returns {JSX.Element} Rendered table body section
 *
 * @accessibility
 * - Uses semantic <tbody> element
 * - Maintains proper table structure for screen readers
 *
 * @example
 * ```tsx
 * <TableBody>
 *   <TableRow>
 *     <TableCell>Data 1</TableCell>
 *     <TableCell>Data 2</TableCell>
 *   </TableRow>
 * </TableBody>
 * ```
 */
export const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, ...props }, ref) => {
    return (
      <tbody
        ref={ref}
        className={cn('divide-y divide-gray-200', className)}
        {...props}
      />
    );
  }
);

TableBody.displayName = 'TableBody';
