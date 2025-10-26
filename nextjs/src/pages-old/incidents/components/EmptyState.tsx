/**
 * EmptyState Component
 *
 * Empty state placeholder component for displaying various empty states.
 * Supports multiple variants and customizable actions.
 *
 * @module components/incidents/EmptyState
 */

import React, { memo, ReactNode } from 'react';
import {
  FileQuestion,
  Plus,
  Search,
  Inbox,
  Database,
  AlertCircle,
  ShieldOff,
  Filter
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs: (string | undefined)[]) => twMerge(clsx(inputs));

/**
 * Action button configuration
 */
export interface EmptyStateAction {
  label: string;
  onClick: () => void;
  icon?: React.ElementType;
  variant?: 'primary' | 'secondary' | 'outline';
}

/**
 * Props for the EmptyState component.
 *
 * @property {string} title - Main title text
 * @property {string} [description] - Optional description text
 * @property {React.ElementType} [icon] - Custom icon component
 * @property {ReactNode} [action] - Primary action button or custom actions
 * @property {EmptyStateAction} [primaryAction] - Primary action button configuration
 * @property {EmptyStateAction} [secondaryAction] - Secondary action button configuration
 * @property {('default' | 'no-data' | 'no-results' | 'no-search' | 'no-permissions' | 'error' | 'filtered')} [variant] - Preset variant for common empty states
 * @property {ReactNode} [illustration] - Custom illustration component
 * @property {('sm' | 'md' | 'lg')} [size] - Size variant
 * @property {string} [className] - Additional CSS classes
 */
export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ElementType;
  action?: ReactNode;
  primaryAction?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  variant?: 'default' | 'no-data' | 'no-results' | 'no-search' | 'no-permissions' | 'error' | 'filtered';
  illustration?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Variant configuration for common empty states
 */
const variantConfig = {
  default: {
    icon: Inbox,
    iconColor: 'text-gray-400 dark:text-gray-500',
    iconBg: 'bg-gray-100 dark:bg-gray-800'
  },
  'no-data': {
    icon: Database,
    iconColor: 'text-gray-400 dark:text-gray-500',
    iconBg: 'bg-gray-100 dark:bg-gray-800'
  },
  'no-results': {
    icon: FileQuestion,
    iconColor: 'text-gray-400 dark:text-gray-500',
    iconBg: 'bg-gray-100 dark:bg-gray-800'
  },
  'no-search': {
    icon: Search,
    iconColor: 'text-gray-400 dark:text-gray-500',
    iconBg: 'bg-gray-100 dark:bg-gray-800'
  },
  'no-permissions': {
    icon: ShieldOff,
    iconColor: 'text-orange-400 dark:text-orange-500',
    iconBg: 'bg-orange-100 dark:bg-orange-900/20'
  },
  error: {
    icon: AlertCircle,
    iconColor: 'text-red-400 dark:text-red-500',
    iconBg: 'bg-red-100 dark:bg-red-900/20'
  },
  filtered: {
    icon: Filter,
    iconColor: 'text-blue-400 dark:text-blue-500',
    iconBg: 'bg-blue-100 dark:bg-blue-900/20'
  }
};

/**
 * Size configuration
 */
const sizeClasses = {
  sm: {
    container: 'py-8',
    icon: 'h-12 w-12',
    title: 'text-base',
    description: 'text-sm'
  },
  md: {
    container: 'py-12',
    icon: 'h-16 w-16',
    title: 'text-lg',
    description: 'text-base'
  },
  lg: {
    container: 'py-16',
    icon: 'h-24 w-24',
    title: 'text-xl',
    description: 'text-lg'
  }
};

/**
 * Button component for actions
 */
const ActionButton = memo(({ action, isPrimary = true }: { action: EmptyStateAction; isPrimary?: boolean }) => {
  const Icon = action.icon;
  const variant = action.variant || (isPrimary ? 'primary' : 'secondary');

  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600',
    outline: 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
  };

  return (
    <button
      onClick={action.onClick}
      className={cn(
        'inline-flex items-center px-4 py-2 rounded-lg font-medium text-sm',
        'transition-all duration-200 hover:scale-105 active:scale-95',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
        variantClasses[variant]
      )}
    >
      {Icon && <Icon className="h-4 w-4 mr-2" aria-hidden="true" />}
      {action.label}
    </button>
  );
});

ActionButton.displayName = 'ActionButton';

/**
 * EmptyState - Display empty state with optional actions
 *
 * Displays an empty state placeholder with icon, title, description, and optional actions.
 * Supports multiple variants for common scenarios and customizable appearance.
 *
 * Features:
 * - Multiple preset variants (no data, no results, no permissions, etc.)
 * - Custom icon or illustration support
 * - Primary and secondary action buttons
 * - Size variants (small, medium, large)
 * - Responsive design
 * - Dark mode support
 * - Accessible with ARIA labels
 * - Smooth animations
 *
 * Variants:
 * - default: Generic empty state
 * - no-data: No data available
 * - no-results: Search returned no results
 * - no-search: No search query entered
 * - no-permissions: User lacks permissions
 * - error: Error state
 * - filtered: No results with current filters
 *
 * @param props - Component props
 * @param props.title - Main title text
 * @param props.description - Optional description text
 * @param props.icon - Custom icon component
 * @param props.action - Custom action component
 * @param props.primaryAction - Primary action button config
 * @param props.secondaryAction - Secondary action button config
 * @param props.variant - Preset variant (default: 'default')
 * @param props.illustration - Custom illustration
 * @param props.size - Size variant (default: 'md')
 * @param props.className - Additional CSS classes
 * @returns JSX element representing the empty state
 *
 * @example
 * ```tsx
 * // Basic empty state
 * <EmptyState
 *   variant="no-data"
 *   title="No incidents found"
 *   description="Get started by creating your first incident report"
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With action buttons
 * <EmptyState
 *   variant="no-results"
 *   title="No incidents found"
 *   description="Try adjusting your search or filter criteria"
 *   primaryAction={{
 *     label: 'Clear Filters',
 *     onClick: () => clearFilters(),
 *     icon: Filter
 *   }}
 *   secondaryAction={{
 *     label: 'Create New',
 *     onClick: () => openCreateModal(),
 *     icon: Plus,
 *     variant: 'outline'
 *   }}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // No permissions variant
 * <EmptyState
 *   variant="no-permissions"
 *   title="Access Denied"
 *   description="You don't have permission to view incident reports"
 *   size="lg"
 * />
 * ```
 */
export const EmptyState = memo(({
  title,
  description,
  icon: CustomIcon,
  action,
  primaryAction,
  secondaryAction,
  variant = 'default',
  illustration,
  size = 'md',
  className
}: EmptyStateProps) => {
  const config = variantConfig[variant];
  const Icon = CustomIcon || config.icon;
  const sizes = sizeClasses[size];

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        sizes.container,
        className
      )}
      role="status"
      aria-live="polite"
    >
      {/* Illustration or Icon */}
      {illustration ? (
        <div className="mb-6 animate-fadeIn">{illustration}</div>
      ) : (
        <div
          className={cn(
            'mb-6 rounded-full p-4 animate-fadeIn',
            config.iconBg
          )}
        >
          <Icon
            className={cn(sizes.icon, config.iconColor)}
            aria-hidden="true"
          />
        </div>
      )}

      {/* Title */}
      <h3
        className={cn(
          'font-semibold text-gray-900 dark:text-gray-100 mb-2',
          sizes.title
        )}
      >
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p
          className={cn(
            'text-gray-500 dark:text-gray-400 mb-6 max-w-md',
            sizes.description
          )}
        >
          {description}
        </p>
      )}

      {/* Actions */}
      {(action || primaryAction || secondaryAction) && (
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {action ? (
            action
          ) : (
            <>
              {primaryAction && <ActionButton action={primaryAction} isPrimary={true} />}
              {secondaryAction && <ActionButton action={secondaryAction} isPrimary={false} />}
            </>
          )}
        </div>
      )}
    </div>
  );
});

EmptyState.displayName = 'EmptyState';

export default EmptyState;
