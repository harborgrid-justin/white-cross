/**
 * @fileoverview Legacy re-export file for backward compatibility.
 *
 * This file maintains backward compatibility for existing imports while the actual
 * implementation has been refactored into a subdirectory structure for better maintainability.
 *
 * @deprecated Import from '@/components/ui/data/Table' (directory) instead of this file directly
 * @module components/ui/data/Table (legacy)
 * @since 1.0.0
 */

export {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  TableEmpty,
  TableEmptyState,
  TableLoading,
  TableLoadingState,
  type TableProps,
  type TableHeaderProps,
  type TableBodyProps,
  type TableRowProps,
  type TableHeadProps,
  type TableCellProps,
  type TableCaptionProps,
  type TableEmptyProps,
  type TableLoadingProps
} from './Table/index';
