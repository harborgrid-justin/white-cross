/**
 * @fileoverview TypeScript type definitions for the Table component system.
 *
 * This module contains all interface definitions and prop types used across
 * the Table component hierarchy. Centralizing types improves maintainability
 * and ensures consistency across all table sub-components.
 *
 * @module components/ui/data/Table/types
 * @since 1.0.0
 */

import React from 'react';

/**
 * Props for the main Table component.
 *
 * @interface TableProps
 * @extends {React.TableHTMLAttributes<HTMLTableElement>}
 *
 * @property {('default' | 'striped' | 'bordered')} [variant='default'] - Visual style variant
 *   - `default`: Clean table with minimal styling
 *   - `striped`: Alternating row background colors for easier scanning
 *   - `bordered`: Table with visible borders around cells
 *
 * @property {('sm' | 'md' | 'lg')} [size='md'] - Size variant affecting padding and text size
 *   - `sm`: Compact spacing, smaller text (ideal for dense data)
 *   - `md`: Standard spacing (default)
 *   - `lg`: Generous spacing, larger text (improved readability)
 */
export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  variant?: 'default' | 'striped' | 'bordered';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Props for the TableHeader component.
 *
 * @interface TableHeaderProps
 * @extends {React.HTMLAttributes<HTMLTableSectionElement>}
 */
export interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

/**
 * Props for the TableBody component.
 *
 * @interface TableBodyProps
 * @extends {React.HTMLAttributes<HTMLTableSectionElement>}
 */
export interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

/**
 * Props for the TableRow component.
 *
 * @interface TableRowProps
 * @extends {React.HTMLAttributes<HTMLTableRowElement>}
 *
 * @property {boolean} [selected=false] - Whether the row is selected (applies blue background)
 * @property {boolean} [clickable=false] - Whether the row is interactive (adds hover, cursor, and focus styles)
 */
export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  selected?: boolean;
  clickable?: boolean;
}

/**
 * Props for the TableHead component (column header cell).
 *
 * @interface TableHeadProps
 * @extends {React.ThHTMLAttributes<HTMLTableHeaderCellElement>}
 *
 * @property {boolean} [sortable=false] - Whether this column is sortable
 * @property {('asc' | 'desc' | null)} [sortDirection=null] - Current sort direction for this column
 * @property {() => void} [onSort] - Callback fired when column header is clicked for sorting
 */
export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableHeaderCellElement> {
  sortable?: boolean;
  sortDirection?: 'asc' | 'desc' | null;
  onSort?: () => void;
}

/**
 * Props for the TableCell component (data cell).
 *
 * @interface TableCellProps
 * @extends {React.TdHTMLAttributes<HTMLTableDataCellElement>}
 */
export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableDataCellElement> {}

/**
 * Props for the TableCaption component.
 *
 * @interface TableCaptionProps
 * @extends {React.HTMLAttributes<HTMLTableCaptionElement>}
 */
export interface TableCaptionProps extends React.HTMLAttributes<HTMLTableCaptionElement> {}

/**
 * Props for the TableEmpty component (empty state).
 *
 * @interface TableEmptyProps
 *
 * @property {React.ReactNode} [children] - Custom empty state content
 * @property {number} [cols] - Number of columns to span (backward compatibility)
 * @property {number} [colSpan] - Number of columns to span (preferred)
 * @property {string} [title] - Empty state title (used if no children provided)
 * @property {string} [description] - Empty state description (used if no children provided)
 */
export interface TableEmptyProps {
  children?: React.ReactNode;
  cols?: number; // Backward compatibility
  colSpan?: number; // Forward compatibility
  title?: string;
  description?: string;
}

/**
 * Props for the TableLoading component (loading skeleton).
 *
 * @interface TableLoadingProps
 *
 * @property {number} [rows=5] - Number of skeleton rows to display
 * @property {number} [cols=4] - Number of skeleton columns per row
 */
export interface TableLoadingProps {
  rows?: number;
  cols?: number;
}

/**
 * Props for the SortIcon component.
 *
 * @interface SortIconProps
 * @internal
 *
 * @property {('asc' | 'desc' | null)} direction - Sort direction
 * @property {boolean} sortable - Whether column is sortable
 */
export interface SortIconProps {
  direction: 'asc' | 'desc' | null;
  sortable: boolean;
}
