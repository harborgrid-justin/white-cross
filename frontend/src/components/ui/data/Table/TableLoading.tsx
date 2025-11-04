/**
 * @fileoverview TableLoading utility component for displaying loading skeleton.
 *
 * @module components/ui/data/Table/TableLoading
 * @since 1.0.0
 */

'use client';

import React from 'react';
import { TableRow } from './TableRow';
import { TableCell } from './TableCell';
import type { TableLoadingProps } from './types';

/**
 * TableLoading utility component for displaying loading skeleton.
 *
 * Renders animated skeleton rows while data is being fetched. Provides visual
 * feedback that content is loading without breaking table layout. Each cell
 * contains a pulsing gray bar.
 *
 * @component
 * @param {TableLoadingProps} props - Component props
 * @returns {JSX.Element} Rendered loading skeleton rows
 *
 * @accessibility
 * - Maintains proper table structure during loading
 * - Animation provides visual feedback
 * - Should be paired with loading announcement for screen readers
 *
 * @example
 * ```tsx
 * <TableBody>
 *   {isLoading ? (
 *     <TableLoading rows={8} cols={6} />
 *   ) : (
 *     data.map(row => <TableRow key={row.id}>...</TableRow>)
 *   )}
 * </TableBody>
 * ```
 *
 * @example With Loading Announcement
 * ```tsx
 * function DataTable() {
 *   const { data, isLoading } = useQuery('students', fetchStudents);
 *
 *   return (
 *     <div>
 *       {isLoading && (
 *         <div className="sr-only" role="status" aria-live="polite">
 *           Loading student data...
 *         </div>
 *       )}
 *       <Table>
 *         <TableHeader>...</TableHeader>
 *         <TableBody>
 *           {isLoading ? (
 *             <TableLoading rows={5} cols={4} />
 *           ) : (
 *             data.map(student => <TableRow key={student.id}>...</TableRow>)
 *           )}
 *         </TableBody>
 *       </Table>
 *     </div>
 *   );
 * }
 * ```
 */
export const TableLoading: React.FC<TableLoadingProps> = ({ rows = 5, cols = 4 }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {Array.from({ length: cols }).map((_, colIndex) => (
            <TableCell key={colIndex}>
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};

TableLoading.displayName = 'TableLoading';

/**
 * Legacy export for backward compatibility.
 * @deprecated Use TableLoading instead
 */
export const TableLoadingState = TableLoading;
