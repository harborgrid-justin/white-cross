'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { FileQuestion, Plus, Search, Inbox, Database, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs: (string | undefined)[]) => twMerge(clsx(inputs));

/**
 * EmptyState props
 */
export interface EmptyStateProps {
  /** Icon to display */
  icon?: React.ElementType;
  /** Title text */
  title: string;
  /** Description text */
  description?: string;
  /** Primary action button */
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ElementType;
  };
  /** Secondary action button */
  secondaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ElementType;
  };
  /** Preset variant for common empty states */
  variant?: 'default' | 'no-data' | 'no-results' | 'no-search' | 'error' | 'create';
  /** Custom illustration component */
  illustration?: React.ReactNode;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Custom className */
  className?: string;
}

const variantConfig = {
  default: {
    icon: Inbox,
    iconColor: 'text-gray-400 dark:text-gray-500'
  },
  'no-data': {
    icon: Database,
    iconColor: 'text-gray-400 dark:text-gray-500'
  },
  'no-results': {
    icon: FileQuestion,
    iconColor: 'text-gray-400 dark:text-gray-500'
  },
  'no-search': {
    icon: Search,
    iconColor: 'text-gray-400 dark:text-gray-500'
  },
  error: {
    icon: AlertCircle,
    iconColor: 'text-red-400 dark:text-red-500'
  },
  create: {
    icon: Plus,
    iconColor: 'text-primary-400 dark:text-primary-500'
  }
};

/**
 * EmptyState - Display empty state with optional actions
 *
 * @example
 * ```tsx
 * <EmptyState
 *   variant="no-data"
 *   title="No students found"
 *   description="Get started by adding your first student"
 *   action={{
 *     label: 'Add Student',
 *     onClick: () => setShowAddModal(true),
 *     icon: Plus
 *   }}
 * />
 * ```
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: CustomIcon,
  title,
  description,
  action,
  secondaryAction,
  variant = 'default',
  illustration,
  size = 'md',
  className
}) => {
  const config = variantConfig[variant];
  const Icon = CustomIcon || config.icon;

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
            'mb-6 rounded-full bg-gray-100 dark:bg-gray-800 p-4 animate-fadeIn',
            variant === 'create' ? 'bg-primary-100 dark:bg-primary-900/20' : undefined
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
      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {action && (
            <Button
              variant={variant === 'create' ? 'primary' : 'secondary'}
              onClick={action.onClick}
              className="transition-all duration-200 hover:scale-105 active:scale-95"
            >
              {action.icon && <action.icon className="h-4 w-4 mr-2" aria-hidden="true" />}
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant="outline"
              onClick={secondaryAction.onClick}
              className="transition-all duration-200 hover:scale-105 active:scale-95"
            >
              {secondaryAction.icon && <secondaryAction.icon className="h-4 w-4 mr-2" aria-hidden="true" />}
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

EmptyState.displayName = 'EmptyState';

export default React.memo(EmptyState);
