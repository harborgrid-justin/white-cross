/**
 * @fileoverview Main Table component with responsive overflow handling and visual variants.
 *
 * @module components/ui/data/Table/Table
 * @since 1.0.0
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type { TableProps } from './types';

/**
 * Main Table component with responsive overflow handling and visual variants.
 *
 * Wraps the native HTML table element with automatic horizontal scrolling for responsive
 * layouts and provides visual styling options for different data presentation needs.
 *
 * **Variants:**
 * - `default`: Clean, minimal styling with dividers between rows
 * - `striped`: Alternating gray background on odd rows (better for scanning large datasets)
 * - `bordered`: Visible borders around the entire table and cells
 *
 * **Sizes:**
 * - `sm`: Compact (py-2, px-3, text-sm) - Use for dashboard widgets or dense data
 * - `md`: Standard (py-3, px-4) - Default for most tables
 * - `lg`: Spacious (py-4, px-6, text-lg) - Use for emphasis or primary content
 *
 * @component
 * @param {TableProps} props - Component props
 * @param {React.Ref<HTMLTableElement>} ref - Forward ref to table element
 * @returns {JSX.Element} Rendered table with wrapper
 *
 * @accessibility
 * - Table automatically gets proper semantic HTML
 * - Overflow container allows keyboard scrolling
 * - Maintains all native table ARIA semantics
 *
 * @example Basic Usage
 * ```tsx
 * <Table variant="striped" size="md">
 *   <TableHeader>
 *     <TableRow>
 *       <TableHead>Name</TableHead>
 *       <TableHead>Email</TableHead>
 *     </TableRow>
 *   </TableHeader>
 *   <TableBody>
 *     <TableRow>
 *       <TableCell>John Doe</TableCell>
 *       <TableCell>john@example.com</TableCell>
 *     </TableRow>
 *   </TableBody>
 * </Table>
 * ```
 */
export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    const variantClasses = {
      default: '',
      striped: '[&_tbody_tr:nth-child(odd)]:bg-gray-50',
      bordered: 'border border-gray-200'
    };

    const sizeClasses = {
      sm: '[&_td]:py-2 [&_th]:py-2 [&_td]:px-3 [&_th]:px-3 text-sm',
      md: '[&_td]:py-3 [&_th]:py-3 [&_td]:px-4 [&_th]:px-4',
      lg: '[&_td]:py-4 [&_th]:py-4 [&_td]:px-6 [&_th]:px-6 text-lg'
    };

    return (
      <div className="overflow-x-auto">
        <table
          ref={ref}
          className={cn(
            'w-full text-left',
            variantClasses[variant],
            sizeClasses[size],
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

Table.displayName = 'Table';
