/**
 * EmptyState Component
 *
 * Reusable component for displaying empty states with icons, messages,
 * and optional call-to-action buttons.
 *
 * @module components/ui/EmptyState
 * @category UI Components
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface EmptyStateProps {
  /** Icon component to display */
  icon?: LucideIcon;
  /** Custom icon element (alternative to icon prop) */
  iconElement?: React.ReactNode;
  /** Main heading text */
  title: string;
  /** Descriptive message */
  description?: string;
  /** Call-to-action button label */
  actionLabel?: string;
  /** Call-to-action button href */
  actionHref?: string;
  /** Call-to-action button click handler (alternative to href) */
  onAction?: () => void;
  /** Secondary action button label */
  secondaryActionLabel?: string;
  /** Secondary action button href */
  secondaryActionHref?: string;
  /** Secondary action button click handler */
  onSecondaryAction?: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Empty State Component
 *
 * Displays a centered empty state with icon, text, and optional actions.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   icon={Calendar}
 *   title="No appointments found"
 *   description="Get started by scheduling your first appointment"
 *   actionLabel="Schedule Appointment"
 *   actionHref="/appointments/new"
 * />
 * ```
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  iconElement,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  secondaryActionLabel,
  secondaryActionHref,
  onSecondaryAction,
  className = '',
}) => {
  return (
    <div
      className={`flex items-center justify-center min-h-[400px] py-12 px-4 ${className}`}
      role="region"
      aria-label="Empty state"
    >
      <div className="text-center max-w-md">
        {/* Icon */}
        {Icon && (
          <Icon
            className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4"
            aria-hidden="true"
          />
        )}
        {iconElement && (
          <div className="flex justify-center mb-4" aria-hidden="true">
            {iconElement}
          </div>
        )}

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {description}
          </p>
        )}

        {/* Actions */}
        {(actionLabel || secondaryActionLabel) && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {actionLabel && (
              <Button
                variant="primary"
                href={actionHref}
                onClick={onAction}
                className="w-full sm:w-auto"
              >
                {actionLabel}
              </Button>
            )}

            {secondaryActionLabel && (
              <Button
                variant="outline"
                href={secondaryActionHref}
                onClick={onSecondaryAction}
                className="w-full sm:w-auto"
              >
                {secondaryActionLabel}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

EmptyState.displayName = 'EmptyState';

export default EmptyState;
