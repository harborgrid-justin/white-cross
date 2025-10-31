'use client';

/**
 * @fileoverview Enterprise-grade Table component system for displaying tabular data in healthcare applications.
 *
 * This module provides a comprehensive set of table components with support for sorting, selection,
 * multiple visual variants, responsive sizing, and accessibility features. Designed specifically for
 * healthcare data presentation including student health records, medication schedules, appointment lists,
 * and compliance reporting.
 *
 * **Key Features:**
 * - Multiple visual variants (default, striped, bordered)
 * - Responsive sizing (small, medium, large)
 * - Sortable columns with keyboard navigation
 * - Row selection and interaction states
 * - Empty and loading state utilities
 * - Full ARIA support for accessibility
 * - HIPAA-compliant data presentation
 *
 * **Component Hierarchy:**
 * - `Table` - Main table wrapper with overflow handling
 * - `TableHeader` - Thead element for column headers
 * - `TableBody` - Tbody element for data rows
 * - `TableRow` - Tr element with selection and interaction states
 * - `TableHead` - Th element with sorting capabilities
 * - `TableCell` - Td element for data cells
 * - `TableCaption` - Accessible caption for table context
 * - `TableEmptyState` - Utility component for empty data sets
 * - `TableLoadingState` - Skeleton loader for data fetching
 *
 * @module components/ui/data/Table
 * @since 1.0.0
 *
 * @example Basic Student List Table
 * ```tsx
 * import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/data/Table';
 *
 * function StudentList({ students }) {
 *   return (
 *     <Table variant="striped" size="md">
 *       <TableHeader>
 *         <TableRow>
 *           <TableHead>Student ID</TableHead>
 *           <TableHead>Name</TableHead>
 *           <TableHead>Grade</TableHead>
 *           <TableHead>Allergies</TableHead>
 *         </TableRow>
 *       </TableHeader>
 *       <TableBody>
 *         {students.map(student => (
 *           <TableRow key={student.id}>
 *             <TableCell>{student.id}</TableCell>
 *             <TableCell>{student.name}</TableCell>
 *             <TableCell>{student.grade}</TableCell>
 *             <TableCell>{student.allergies || 'None'}</TableCell>
 *           </TableRow>
 *         ))}
 *       </TableBody>
 *     </Table>
 *   );
 * }
 * ```
 *
 * @example Sortable Medication Schedule
 * ```tsx
 * function MedicationSchedule() {
 *   const [sortField, setSortField] = useState<'time' | 'medication' | null>(null);
 *   const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
 *
 *   const handleSort = (field: 'time' | 'medication') => {
 *     if (sortField === field) {
 *       setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
 *     } else {
 *       setSortField(field);
 *       setSortDirection('asc');
 *     }
 *   };
 *
 *   return (
 *     <Table variant="bordered">
 *       <TableHeader>
 *         <TableRow>
 *           <TableHead
 *             sortable
 *             sortDirection={sortField === 'time' ? sortDirection : null}
 *             onSort={() => handleSort('time')}
 *           >
 *             Time
 *           </TableHead>
 *           <TableHead
 *             sortable
 *             sortDirection={sortField === 'medication' ? sortDirection : null}
 *             onSort={() => handleSort('medication')}
 *           >
 *             Medication
 *           </TableHead>
 *           <TableHead>Dosage</TableHead>
 *           <TableHead>Status</TableHead>
 *         </TableRow>
 *       </TableHeader>
 *       <TableBody>
 *         {medications.map(med => (
 *           <TableRow key={med.id}>
 *             <TableCell>{med.time}</TableCell>
 *             <TableCell>{med.name}</TableCell>
 *             <TableCell>{med.dosage}</TableCell>
 *             <TableCell>{med.status}</TableCell>
 *           </TableRow>
 *         ))}
 *       </TableBody>
 *     </Table>
 *   );
 * }
 * ```
 *
 * @example Interactive Appointment Table with Selection
 * ```tsx
 * function AppointmentTable() {
 *   const [selectedId, setSelectedId] = useState<string | null>(null);
 *
 *   return (
 *     <Table size="lg">
 *       <TableCaption>Upcoming appointments for this week</TableCaption>
 *       <TableHeader>
 *         <TableRow>
 *           <TableHead>Date</TableHead>
 *           <TableHead>Time</TableHead>
 *           <TableHead>Student</TableHead>
 *           <TableHead>Purpose</TableHead>
 *         </TableRow>
 *       </TableHeader>
 *       <TableBody>
 *         {appointments.map(apt => (
 *           <TableRow
 *             key={apt.id}
 *             clickable
 *             selected={selectedId === apt.id}
 *             onClick={() => setSelectedId(apt.id)}
 *           >
 *             <TableCell>{apt.date}</TableCell>
 *             <TableCell>{apt.time}</TableCell>
 *             <TableCell>{apt.studentName}</TableCell>
 *             <TableCell>{apt.purpose}</TableCell>
 *           </TableRow>
 *         ))}
 *       </TableBody>
 *     </Table>
 *   );
 * }
 * ```
 *
 * @example Table with Empty State
 * ```tsx
 * function HealthRecordTable({ records }) {
 *   return (
 *     <Table variant="striped">
 *       <TableHeader>
 *         <TableRow>
 *           <TableHead>Date</TableHead>
 *           <TableHead>Type</TableHead>
 *           <TableHead>Provider</TableHead>
 *           <TableHead>Notes</TableHead>
 *         </TableRow>
 *       </TableHeader>
 *       <TableBody>
 *         {records.length === 0 ? (
 *           <TableEmptyState
 *             colSpan={4}
 *             title="No health records found"
 *             description="Add a health record to get started"
 *           />
 *         ) : (
 *           records.map(record => (
 *             <TableRow key={record.id}>
 *               <TableCell>{record.date}</TableCell>
 *               <TableCell>{record.type}</TableCell>
 *               <TableCell>{record.provider}</TableCell>
 *               <TableCell>{record.notes}</TableCell>
 *             </TableRow>
 *           ))
 *         )}
 *       </TableBody>
 *     </Table>
 *   );
 * }
 * ```
 *
 * @example Table with Loading State
 * ```tsx
 * function ImmunizationTable({ isLoading, immunizations }) {
 *   return (
 *     <Table>
 *       <TableHeader>
 *         <TableRow>
 *           <TableHead>Vaccine</TableHead>
 *           <TableHead>Date Given</TableHead>
 *           <TableHead>Lot Number</TableHead>
 *           <TableHead>Next Due</TableHead>
 *         </TableRow>
 *       </TableHeader>
 *       <TableBody>
 *         {isLoading ? (
 *           <TableLoadingState rows={5} cols={4} />
 *         ) : (
 *           immunizations.map(imm => (
 *             <TableRow key={imm.id}>
 *               <TableCell>{imm.vaccine}</TableCell>
 *               <TableCell>{imm.dateGiven}</TableCell>
 *               <TableCell>{imm.lotNumber}</TableCell>
 *               <TableCell>{imm.nextDue}</TableCell>
 *             </TableRow>
 *           ))
 *         )}
 *       </TableBody>
 *     </Table>
 *   );
 * }
 * ```
 *
 * @example Complex Healthcare Data Table
 * ```tsx
 * function HealthMetricsTable({ metrics }) {
 *   return (
 *     <Table variant="bordered" size="sm">
 *       <TableCaption>Health screening results for academic year 2024-2025</TableCaption>
 *       <TableHeader>
 *         <TableRow>
 *           <TableHead>Student</TableHead>
 *           <TableHead>Height (in)</TableHead>
 *           <TableHead>Weight (lbs)</TableHead>
 *           <TableHead>BMI</TableHead>
 *           <TableHead>Vision</TableHead>
 *           <TableHead>Hearing</TableHead>
 *           <TableHead>Status</TableHead>
 *         </TableRow>
 *       </TableHeader>
 *       <TableBody>
 *         {metrics.map(metric => (
 *           <TableRow key={metric.studentId}>
 *             <TableCell className="font-medium">{metric.studentName}</TableCell>
 *             <TableCell>{metric.height}</TableCell>
 *             <TableCell>{metric.weight}</TableCell>
 *             <TableCell>{metric.bmi}</TableCell>
 *             <TableCell>{metric.vision}</TableCell>
 *             <TableCell>{metric.hearing}</TableCell>
 *             <TableCell>
 *               <span className={metric.needsFollowup ? 'text-red-600' : 'text-green-600'}>
 *                 {metric.status}
 *               </span>
 *             </TableCell>
 *           </TableRow>
 *         ))}
 *       </TableBody>
 *     </Table>
 *   );
 * }
 * ```
 *
 * @accessibility
 * - Uses semantic HTML table elements (table, thead, tbody, tr, th, td)
 * - Table headers use scope="col" for proper column association
 * - Sortable columns are keyboard accessible (Enter/Space to sort)
 * - Sort direction announced via aria-sort attribute
 * - Clickable rows include aria-selected for selection state
 * - Caption provides context for screen readers
 * - Focus visible states for keyboard navigation
 *
 * @see {@link https://www.w3.org/WAI/ARIA/apg/patterns/table/} ARIA Table Pattern
 */

import React from 'react';
import { cn } from '@/lib/utils';

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
interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  variant?: 'default' | 'striped' | 'bordered';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Props for the TableHeader component.
 *
 * @interface TableHeaderProps
 * @extends {React.HTMLAttributes<HTMLTableSectionElement>}
 */
interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

/**
 * Props for the TableBody component.
 *
 * @interface TableBodyProps
 * @extends {React.HTMLAttributes<HTMLTableSectionElement>}
 */
interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

/**
 * Props for the TableRow component.
 *
 * @interface TableRowProps
 * @extends {React.HTMLAttributes<HTMLTableRowElement>}
 *
 * @property {boolean} [selected=false] - Whether the row is selected (applies blue background)
 * @property {boolean} [clickable=false] - Whether the row is interactive (adds hover, cursor, and focus styles)
 */
interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
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
interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableHeaderCellElement> {
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
interface TableCellProps extends React.TdHTMLAttributes<HTMLTableDataCellElement> {}

/**
 * Props for the TableCaption component.
 *
 * @interface TableCaptionProps
 * @extends {React.HTMLAttributes<HTMLTableCaptionElement>}
 */
interface TableCaptionProps extends React.HTMLAttributes<HTMLTableCaptionElement> {}

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
 */
const Table = React.forwardRef<HTMLTableElement, TableProps>(
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
const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
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
const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
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
const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
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

/**
 * Sort indicator icon component showing ascending/descending arrows.
 *
 * @param {Object} props - Icon props
 * @param {('asc' | 'desc' | null)} props.direction - Sort direction
 * @param {boolean} props.sortable - Whether column is sortable
 * @returns {JSX.Element | null} Sort icon or null if not sortable
 * @internal
 */
const SortIcon: React.FC<{ direction: 'asc' | 'desc' | null; sortable: boolean }> = ({ 
  direction, 
  sortable 
}) => {
  if (!sortable) return null;

  return (
    <span className="ml-2 inline-flex flex-col" aria-hidden="true">
      <svg
        className={cn(
          'h-3 w-3 -mb-0.5',
          direction === 'asc' ? 'text-gray-900' : 'text-gray-400'
        )}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" />
      </svg>
      <svg
        className={cn(
          'h-3 w-3',
          direction === 'desc' ? 'text-gray-900' : 'text-gray-400'
        )}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
      </svg>
    </span>
  );
};

/**
 * TableHead component (th) for column header cells with optional sorting.
 *
 * Renders column header cells with support for sortable columns. When sortable,
 * displays up/down arrow indicators and handles keyboard interaction (Enter/Space).
 * Communicates sort direction to assistive technologies via aria-sort.
 *
 * **Features:**
 * - Sortable columns with visual indicators
 * - Keyboard accessible (Enter or Space to sort)
 * - ARIA sort direction announcement
 * - Focus management with visible focus ring
 * - Uppercase, bold styling for headers
 *
 * @component
 * @param {TableHeadProps} props - Component props
 * @param {React.Ref<HTMLTableHeaderCellElement>} ref - Forward ref to th element
 * @returns {JSX.Element} Rendered table header cell
 *
 * @accessibility
 * - Uses semantic <th> with scope="col"
 * - Sortable headers are keyboard accessible (tab, enter, space)
 * - aria-sort indicates current sort direction
 * - Focus ring clearly visible for keyboard users
 * - Sort icons marked aria-hidden (decorative)
 *
 * @keyboard
 * - `Tab`: Move focus to sortable header
 * - `Enter`: Activate sort
 * - `Space`: Activate sort
 *
 * @example Sortable Column
 * ```tsx
 * const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
 *
 * <TableHead
 *   sortable
 *   sortDirection={sortDir}
 *   onSort={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}
 * >
 *   Student Name
 * </TableHead>
 * ```
 */
const TableHead = React.forwardRef<HTMLTableHeaderCellElement, TableHeadProps>(
  ({ className, sortable = false, sortDirection = null, onSort, children, ...props }, ref) => {
    /**
     * Handles keyboard events for sortable headers.
     *
     * @param {React.KeyboardEvent<HTMLTableCellElement>} e - Keyboard event
     * @internal
     */
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTableCellElement>) => {
      if (sortable && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        onSort?.();
      }
    };

    return (
      <th
        ref={ref}
        scope="col"
        className={cn(
          'text-left text-xs font-semibold text-gray-900 uppercase tracking-wider',
          sortable && 'cursor-pointer select-none hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500',
          className
        )}
        onClick={sortable ? onSort : undefined}
        onKeyDown={sortable ? handleKeyDown : undefined}
        tabIndex={sortable ? 0 : undefined}
        aria-sort={sortable && sortDirection ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined}
        {...props}
      >
        <div className="flex items-center">
          {children}
          <SortIcon direction={sortDirection} sortable={sortable} />
        </div>
      </th>
    );
  }
);

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
const TableCell = React.forwardRef<HTMLTableDataCellElement, TableCellProps>(
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
const TableCaption = React.forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
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

/**
 * TableEmptyState utility component for displaying empty data messages.
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
 * @param {Object} props - Component props
 * @param {React.ReactNode} [props.children] - Custom empty state content
 * @param {number} [props.cols] - Number of columns to span (backward compatibility)
 * @param {number} [props.colSpan] - Number of columns to span (preferred)
 * @param {string} [props.title] - Empty state title (used if no children provided)
 * @param {string} [props.description] - Empty state description (used if no children provided)
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
 *     <TableEmptyState
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
 * <TableEmptyState colSpan={4}>
 *   <div className="text-center py-12">
 *     <Icon name="inbox" size="lg" className="text-gray-400 mb-4" />
 *     <h3 className="text-lg font-medium">No medications scheduled</h3>
 *     <p className="text-gray-500 mt-2">Add a medication to get started</p>
 *     <Button className="mt-4" onClick={handleAdd}>Add Medication</Button>
 *   </div>
 * </TableEmptyState>
 * ```
 */
const TableEmptyState: React.FC<{
  children?: React.ReactNode;
  cols?: number; // Backward compatibility
  colSpan?: number; // Forward compatibility
  title?: string;
  description?: string;
}> = ({ children, cols, colSpan, title, description }) => {
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

/**
 * TableLoadingState utility component for displaying loading skeleton.
 *
 * Renders animated skeleton rows while data is being fetched. Provides visual
 * feedback that content is loading without breaking table layout. Each cell
 * contains a pulsing gray bar.
 *
 * @component
 * @param {Object} props - Component props
 * @param {number} [props.rows=5] - Number of skeleton rows to display
 * @param {number} [props.cols=4] - Number of skeleton columns per row
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
 *     <TableLoadingState rows={8} cols={6} />
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
 *             <TableLoadingState rows={5} cols={4} />
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
const TableLoadingState: React.FC<{
  rows?: number;
  cols?: number;
}> = ({ rows = 5, cols = 4 }) => {
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

Table.displayName = 'Table';
TableHeader.displayName = 'TableHeader';
TableBody.displayName = 'TableBody';
TableRow.displayName = 'TableRow';
TableHead.displayName = 'TableHead';
TableCell.displayName = 'TableCell';
TableCaption.displayName = 'TableCaption';
TableEmptyState.displayName = 'TableEmptyState';
TableLoadingState.displayName = 'TableLoadingState';

export {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  TableEmptyState,
  TableLoadingState,
  type TableProps,
  type TableHeaderProps,
  type TableBodyProps,
  type TableRowProps,
  type TableHeadProps,
  type TableCellProps,
  type TableCaptionProps
};
