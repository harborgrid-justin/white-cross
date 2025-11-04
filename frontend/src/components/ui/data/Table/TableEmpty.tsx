/**
 * @fileoverview TableEmpty utility component for displaying empty data messages.
 *
 * @module components/ui/data/Table/TableEmpty
 * @since 1.0.0
 */

'use client';

import React from 'react';
import { TableRow } from './TableRow';
import { TableCell } from './TableCell';
import type { TableEmptyProps } from './types';

/**
 * TableEmpty utility component for displaying empty data messages.
 *
 * Provides a centered, accessible empty state message when a table has no data.
 * Supports custom content or default title/description pattern. Automatically
 * spans all columns in the table.
 *
 * **Use Cases:**
 * - No search results
 * - No data for selected filters
 * - Empty initial state with call-to-action
 *
 * @component
 * @param {TableEmptyProps} props - Component props
 * @returns {JSX.Element} Rendered empty state row
 *
 * @accessibility
 * - Uses TableRow and TableCell for proper table semantics
 * - Spans full table width for visibility
 *
 * @example With Title and Description
 * ```tsx
 * <TableBody>
 *   {students.length === 0 ? (
 *     <TableEmpty
 *       colSpan={5}
 *       title="No students found"
 *       description="Try adjusting your search criteria"
 *     />
 *   ) : (
 *     students.map(student => <TableRow key={student.id}>...</TableRow>)
 *   )}
 * </TableBody>
 * ```
 *
 * @example With Custom Content
 * ```tsx
 * <TableEmpty colSpan={4}>
 *   <div className="text-center py-12">
 *     <Icon name="inbox" size="lg" className="text-gray-400 mb-4" />
 *     <h3 className="text-lg font-medium">No medications scheduled</h3>
 *     <p className="text-gray-500 mt-2">Add a medication to get started</p>
 *     <Button className="mt-4" onClick={handleAdd}>Add Medication</Button>
 *   </div>
 * </TableEmpty>
 * ```
 */
export const TableEmpty: React.FC<TableEmptyProps> = ({
  children,
  cols,
  colSpan,
  title,
  description
}) => {
  // Use cols for backward compatibility, fallback to colSpan
  const finalColSpan = cols || colSpan || 1;

  // If no children provided, use title/description
  const content = children || (
    <div className="text-center py-12">
      {title && <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>}
      {description && <p className="text-gray-500">{description}</p>}
    </div>
  );

  return (
    <TableRow>
      <TableCell colSpan={finalColSpan} className="text-center">
        {content}
      </TableCell>
    </TableRow>
  );
};

TableEmpty.displayName = 'TableEmpty';

/**
 * Legacy export for backward compatibility.
 * @deprecated Use TableEmpty instead
 */
export const TableEmptyState = TableEmpty;
