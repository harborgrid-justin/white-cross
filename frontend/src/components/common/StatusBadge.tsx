/**
 * StatusBadge Component
 *
 * Unified status badge component that replaces duplicate badge patterns across the app.
 * Uses semantic design tokens for consistent styling and dark mode support.
 *
 * @example
 * ```tsx
 * <StatusBadge variant="success">Active</StatusBadge>
 * <StatusBadge variant="warning">Pending</StatusBadge>
 * <StatusBadge variant="error">Failed</StatusBadge>
 * <StatusBadge variant="info">Scheduled</StatusBadge>
 * <StatusBadge variant="inactive">Inactive</StatusBadge>
 * ```
 */

"use client"

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Badge variant styles using CVA (class-variance-authority)
 * Automatically supports dark mode through semantic tokens
 */
const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        // Semantic status variants
        success: 'bg-success-subtle text-status-active dark:bg-success/10 dark:text-success',
        warning: 'bg-warning-subtle text-status-pending dark:bg-warning/10 dark:text-warning',
        error: 'bg-error-subtle text-status-cancelled dark:bg-error/10 dark:text-error',
        info: 'bg-info-subtle text-status-scheduled dark:bg-info/10 dark:text-info',
        inactive: 'bg-status-inactive/10 text-status-inactive dark:bg-muted dark:text-muted-foreground',

        // Specific status variants (for backwards compatibility)
        active: 'bg-success-subtle text-status-active dark:bg-success/10 dark:text-success',
        pending: 'bg-warning-subtle text-status-pending dark:bg-warning/10 dark:text-warning',
        completed: 'bg-success-subtle text-status-completed dark:bg-success/10 dark:text-success',
        cancelled: 'bg-error-subtle text-status-cancelled dark:bg-error/10 dark:text-error',
        scheduled: 'bg-info-subtle text-status-scheduled dark:bg-info/10 dark:text-info',

        // UI variants
        default: 'bg-muted text-muted-foreground dark:bg-muted/50',
        secondary: 'bg-secondary/10 text-secondary dark:bg-secondary/10 dark:text-secondary-foreground',
        destructive: 'bg-destructive/10 text-destructive dark:bg-destructive/10 dark:text-destructive-foreground',
        outline: 'text-foreground border border-input dark:border-border',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        default: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  /**
   * The status text to display
   */
  children: React.ReactNode;

  /**
   * Visual variant of the badge
   */
  variant?:
    | 'success'
    | 'warning'
    | 'error'
    | 'info'
    | 'inactive'
    | 'active'
    | 'pending'
    | 'completed'
    | 'cancelled'
    | 'scheduled'
    | 'default'
    | 'secondary'
    | 'destructive'
    | 'outline';

  /**
   * Size variant of the badge
   */
  size?: 'sm' | 'default' | 'lg';

  /**
   * Optional icon to display before the text
   */
  icon?: React.ReactNode;

  /**
   * Whether to show a pulse animation (for active/live statuses)
   */
  pulse?: boolean;
}

/**
 * StatusBadge component with semantic variants and dark mode support
 */
export const StatusBadge = React.forwardRef<HTMLDivElement, StatusBadgeProps>(
  ({ className, variant, size, children, icon, pulse, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant, size }), className)}
        {...props}
      >
        {pulse && (
          <span className="relative flex h-2 w-2 mr-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
          </span>
        )}
        {icon && <span className="mr-1.5">{icon}</span>}
        {children}
      </div>
    );
  }
);

StatusBadge.displayName = 'StatusBadge';

/**
 * Utility function to get badge variant based on status string
 * Useful for dynamic status rendering
 *
 * @example
 * ```tsx
 * const variant = getStatusVariant(appointment.status);
 * <StatusBadge variant={variant}>{appointment.status}</StatusBadge>
 * ```
 */
export function getStatusVariant(
  status: string
): StatusBadgeProps['variant'] {
  const normalizedStatus = status.toLowerCase().trim();

  // Map common status strings to variants
  const statusMap: Record<string, StatusBadgeProps['variant']> = {
    // Success states
    'active': 'active',
    'completed': 'completed',
    'approved': 'success',
    'confirmed': 'success',
    'delivered': 'success',
    'paid': 'success',
    'published': 'success',
    'resolved': 'success',
    'success': 'success',
    'verified': 'success',

    // Warning states
    'pending': 'pending',
    'in progress': 'warning',
    'processing': 'warning',
    'review': 'warning',
    'scheduled': 'scheduled',
    'warning': 'warning',

    // Error states
    'cancelled': 'cancelled',
    'declined': 'error',
    'error': 'error',
    'failed': 'error',
    'overdue': 'error',
    'rejected': 'error',

    // Info states
    'draft': 'info',
    'info': 'info',
    'new': 'info',

    // Inactive states
    'archived': 'inactive',
    'disabled': 'inactive',
    'inactive': 'inactive',
    'paused': 'inactive',
  };

  return statusMap[normalizedStatus] || 'default';
}

/**
 * Utility function to format status text for display
 * Converts snake_case, camelCase, or UPPER_CASE to Title Case
 *
 * @example
 * ```tsx
 * formatStatusText('in_progress') // Returns: "In Progress"
 * formatStatusText('PENDING_APPROVAL') // Returns: "Pending Approval"
 * ```
 */
export function formatStatusText(status: string): string {
  return status
    .replace(/[_-]/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .trim();
}

export default StatusBadge;
