/**
 * @fileoverview TableHeader component (thead) for grouping column header rows.
 *
 * @module components/ui/data/Table/TableHeader
 * @since 1.0.0
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type { TableHeaderProps } from './types';

/**
 * TableHeader component (thead) for grouping column header rows.
 *
 * Provides consistent styling for the table header section with a light gray
 * background and bottom border to visually separate headers from data.
 *
 * @component
 * @param {TableHeaderProps} props - Component props
 * @param {React.Ref<HTMLTableSectionElement>} ref - Forward ref to thead element
 * @returns {JSX.Element} Rendered table header section
 *
 * @accessibility
 * - Uses semantic <thead> element
 * - Works with screen reader table navigation
 *
 * @example
 * ```tsx
 * <TableHeader>
 *   <TableRow>
 *     <TableHead>Column 1</TableHead>
 *     <TableHead>Column 2</TableHead>
 *   </TableRow>
 * </TableHeader>
 * ```
 */
export const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <thead
        ref={ref}
        className={cn('bg-gray-50 border-b border-gray-200', className)}
        {...props}
      />
    );
  }
);

TableHeader.displayName = 'TableHeader';
