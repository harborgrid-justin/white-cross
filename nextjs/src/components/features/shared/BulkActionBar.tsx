import React, { useMemo } from 'react';
import { Button } from '@/components/ui/buttons/Button';
import { Badge } from '@/components/ui/display/Badge';
import { X, Trash2, Archive, Edit, Mail, Download, MoreHorizontal } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs: (string | undefined)[]) => twMerge(clsx(inputs));

/**
 * Bulk action configuration
 */
export interface BulkAction {
  /** Unique action ID */
  id: string;
  /** Action label */
  label: string;
  /** Icon component */
  icon?: React.ElementType;
  /** Action handler */
  onClick: () => void;
  /** Variant for styling */
  variant?: 'default' | 'destructive' | 'primary' | 'success' | 'warning';
  /** Whether action is disabled */
  disabled?: boolean;
  /** Confirmation message before executing */
  confirmMessage?: string;
  /** Loading state */
  loading?: boolean;
}

/**
 * BulkActionBar props
 */
export interface BulkActionBarProps {
  /** Number of selected items */
  selectedCount: number;
  /** Total number of items */
  totalCount?: number;
  /** Bulk actions available */
  actions: BulkAction[];
  /** Clear selection handler */
  onClearSelection: () => void;
  /** Position of the bar */
  position?: 'top' | 'bottom' | 'fixed';
  /** Custom className */
  className?: string;
  /** Show select all button */
  showSelectAll?: boolean;
  /** Select all handler */
  onSelectAll?: () => void;
  /** Whether all items are selected */
  allSelected?: boolean;
  /** Custom message */
  message?: string;
}

const iconMap = {
  delete: Trash2,
  archive: Archive,
  edit: Edit,
  email: Mail,
  download: Download,
  more: MoreHorizontal
};

/**
 * BulkActionBar - Action bar for bulk operations on selected items
 *
 * @example
 * ```tsx
 * const actions: BulkAction[] = [
 *   {
 *     id: 'delete',
 *     label: 'Delete',
 *     icon: Trash2,
 *     onClick: () => handleBulkDelete(selectedIds),
 *     variant: 'destructive',
 *     confirmMessage: 'Are you sure you want to delete selected items?'
 *   },
 *   {
 *     id: 'archive',
 *     label: 'Archive',
 *     icon: Archive,
 *     onClick: () => handleBulkArchive(selectedIds)
 *   }
 * ];
 *
 * <BulkActionBar
 *   selectedCount={selectedIds.size}
 *   totalCount={items.length}
 *   actions={actions}
 *   onClearSelection={() => setSelectedIds(new Set())}
 * />
 * ```
 */
export const BulkActionBar: React.FC<BulkActionBarProps> = ({
  selectedCount,
  totalCount,
  actions,
  onClearSelection,
  position = 'top',
  className,
  showSelectAll = true,
  onSelectAll,
  allSelected = false,
  message
}) => {
  // Don't render if no items selected
  if (selectedCount === 0) {
    return null;
  }

  const positionClasses = useMemo(() => {
    switch (position) {
      case 'top':
        return 'mb-4';
      case 'bottom':
        return 'mt-4';
      case 'fixed':
        return 'fixed bottom-6 left-1/2 -translate-x-1/2 z-50 shadow-2xl';
      default:
        return '';
    }
  }, [position]);

  const handleActionClick = (action: BulkAction) => {
    if (action.confirmMessage) {
      if (window.confirm(action.confirmMessage)) {
        action.onClick();
      }
    } else {
      action.onClick();
    }
  };

  const getActionVariant = (variant?: string) => {
    switch (variant) {
      case 'destructive':
        return 'destructive';
      case 'primary':
        return 'primary';
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 p-4 rounded-lg border-2 border-primary-500 bg-primary-50 dark:bg-primary-900/10 dark:border-primary-600',
        'transition-all duration-200 animate-slideIn',
        positionClasses,
        className
      )}
      role="toolbar"
      aria-label="Bulk actions toolbar"
    >
      {/* Selection Info */}
      <div className="flex items-center gap-3">
        <Badge variant="primary" size="lg" className="font-semibold">
          {selectedCount} {selectedCount === 1 ? 'item' : 'items'} selected
        </Badge>

        {totalCount && !allSelected && showSelectAll && onSelectAll && (
          <button
            onClick={onSelectAll}
            className="text-sm font-medium text-primary-700 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 hover:underline focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded px-2 py-1 transition-all duration-150"
          >
            Select all {totalCount} items
          </button>
        )}

        {message && (
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {message}
          </span>
        )}

        <button
          onClick={onClearSelection}
          className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded px-2 py-1 transition-all duration-150"
          aria-label="Clear selection"
        >
          <X className="h-4 w-4" aria-hidden="true" />
          Clear
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {actions.map((action) => {
          const Icon = action.icon;
          const variant = getActionVariant(action.variant);

          return (
            <Button
              key={action.id}
              variant={variant}
              size="sm"
              onClick={() => handleActionClick(action)}
              disabled={action.disabled}
              isLoading={action.loading}
              className="transition-all duration-200 hover:scale-105 active:scale-95"
            >
              {Icon && <Icon className="h-4 w-4 mr-2" aria-hidden="true" />}
              {action.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

BulkActionBar.displayName = 'BulkActionBar';

export default React.memo(BulkActionBar);
