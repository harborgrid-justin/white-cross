import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility function for merging class names
const cn = (...inputs: (string | undefined)[]) => twMerge(clsx(inputs));

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  variant?: 'default' | 'striped' | 'bordered';
  size?: 'sm' | 'md' | 'lg';
}

interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  selected?: boolean;
  clickable?: boolean;
}

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableHeaderCellElement> {
  sortable?: boolean;
  sortDirection?: 'asc' | 'desc' | null;
  onSort?: () => void;
}

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableDataCellElement> {}

interface TableCaptionProps extends React.HTMLAttributes<HTMLTableCaptionElement> {}

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

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, selected = false, clickable = false, ...props }, ref) => {
    return (
      <tr
        ref={ref}
        className={cn(
          'transition-colors',
          selected && 'bg-blue-50',
          clickable && 'hover:bg-gray-50 cursor-pointer',
          className
        )}
        {...props}
      />
    );
  }
);

const TableHead = React.forwardRef<HTMLTableHeaderCellElement, TableHeadProps>(
  ({ className, sortable = false, sortDirection = null, onSort, children, ...props }, ref) => {
    const SortIcon = ({ direction }: { direction: 'asc' | 'desc' | null }) => {
      if (!sortable) return null;
      
      return (
        <span className="ml-2 inline-flex flex-col">
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

    return (
      <th
        ref={ref}
        className={cn(
          'text-left text-xs font-semibold text-gray-900 uppercase tracking-wider',
          sortable && 'cursor-pointer select-none hover:bg-gray-100',
          className
        )}
        onClick={sortable ? onSort : undefined}
        {...props}
      >
        <div className="flex items-center">
          {children}
          <SortIcon direction={sortDirection} />
        </div>
      </th>
    );
  }
);

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

// Utility component for empty state
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

// Utility component for loading state
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
