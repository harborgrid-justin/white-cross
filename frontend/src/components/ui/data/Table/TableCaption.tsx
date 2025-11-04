/**
 * @fileoverview TableCaption component for providing accessible table context.
 *
 * @module components/ui/data/Table/TableCaption
 * @since 1.0.0
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type { TableCaptionProps } from './types';

/**
 * TableCaption component for providing accessible table context.
 *
 * Renders a table caption that describes the table's purpose or content. Important
 * for accessibility as screen readers announce the caption when users enter the table.
 * Positioned after the table by default (can be changed with CSS).
 *
 * @component
 * @param {TableCaptionProps} props - Component props
 * @param {React.Ref<HTMLTableCaptionElement>} ref - Forward ref to caption element
 * @returns {JSX.Element} Rendered table caption
 *
 * @accessibility
 * - Uses semantic <caption> element
 * - Screen readers announce caption when table receives focus
 * - Provides important context for table data
 *
 * @example
 * ```tsx
 * <Table>
 *   <TableCaption>Student health records for Spring 2024</TableCaption>
 *   <TableHeader>...</TableHeader>
 *   <TableBody>...</TableBody>
 * </Table>
 * ```
 */
export const TableCaption = React.forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  ({ className, ...props }, ref) => {
    return (
      <caption
        ref={ref}
        className={cn('mt-4 text-sm text-gray-500 text-left', className)}
        {...props}
      />
    );
  }
);

TableCaption.displayName = 'TableCaption';
