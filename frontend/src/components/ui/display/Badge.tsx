/**
 * Badge Component Module
 *
 * Status badges and labels for displaying categories, statuses, and metadata.
 * Supports multiple variants, sizes, shapes, and optional dot indicators.
 *
 * @module components/ui/display/Badge
 *
 * NOTE: Converted to Server Component (Phase 1 Quick Wins)
 * - No client-side interactivity required
 * - Pure presentational component
 * - Reduces bundle size
 */

import React from 'react';
import { cn } from '../../../utils/cn';

/**
 * Props for the Badge component.
 *
 * @interface BadgeProps
 * @extends {React.HTMLAttributes<HTMLSpanElement>}
 *
 * @property {React.ReactNode} [children] - Badge content (text or elements)
 * @property {('default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'danger' | 'info')} [variant='default'] - Color variant
 * @property {('sm' | 'md' | 'lg')} [size='md'] - Badge size
 * @property {('rounded' | 'pill' | 'square')} [shape='rounded'] - Border radius shape
 * @property {boolean} [dot=false] - Show as status dot instead of filled badge
 */
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  shape?: 'rounded' | 'pill' | 'square';
  dot?: boolean;
}

/**
 * Badge component for status indicators, labels, and categorical information.
 *
 * Flexible badge component with multiple visual variants, sizes, and shapes.
 * Can display as filled badge or minimal dot indicator.
 *
 * **Features:**
 * - 8 semantic color variants
 * - 3 size options (sm, md, lg)
 * - 3 shape options (rounded, pill, square)
 * - Dot mode for minimal status indicators
 * - Dark mode support
 * - Smooth transitions
 *
 * **Use Cases:**
 * - Status indicators (active, pending, error)
 * - Category tags
 * - Count badges
 * - User roles
 * - Priority levels
 *
 * @component
 * @param {BadgeProps} props - Badge component props
 * @param {React.Ref<HTMLSpanElement>} ref - Forwarded ref
 * @returns {JSX.Element} Rendered badge or dot indicator
 *
 * @example
 * ```tsx
 * // Success status badge
 * <Badge variant="success">Active</Badge>
 *
 * // Warning badge with pill shape
 * <Badge variant="warning" shape="pill">Pending</Badge>
 *
 * // Error badge, large size
 * <Badge variant="error" size="lg">Failed</Badge>
 *
 * // Dot indicator for online status
 * <Badge variant="success" dot>Online</Badge>
 *
 * // Info badge with square corners
 * <Badge variant="info" shape="square">Beta</Badge>
 *
 * // Count badge
 * <Badge variant="primary" shape="pill" size="sm">5</Badge>
 * ```
 */
const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({
    className,
    variant = 'default',
    size = 'md',
    shape = 'rounded',
    dot = false,
    children,
    ...props
  }, ref) => {
    const variantClasses = {
      default: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700',
      primary: 'bg-primary-100 text-primary-800 border-primary-200 dark:bg-primary-900 dark:text-primary-200 dark:border-primary-800',
      secondary: 'bg-secondary-100 text-secondary-800 border-secondary-200 dark:bg-secondary-900 dark:text-secondary-200 dark:border-secondary-800',
      success: 'bg-success-100 text-success-800 border-success-200 dark:bg-success-900 dark:text-success-200 dark:border-success-800',
      warning: 'bg-warning-100 text-warning-800 border-warning-200 dark:bg-warning-900 dark:text-warning-200 dark:border-warning-800',
      error: 'bg-danger-100 text-danger-800 border-danger-200 dark:bg-danger-900 dark:text-danger-200 dark:border-danger-800',
      danger: 'bg-danger-100 text-danger-800 border-danger-200 dark:bg-danger-900 dark:text-danger-200 dark:border-danger-800',
      info: 'bg-info-100 text-info-800 border-info-200 dark:bg-info-900 dark:text-info-200 dark:border-info-800'
    };

    const sizeClasses = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-0.5 text-sm',
      lg: 'px-3 py-1 text-base'
    };

    const shapeClasses = {
      rounded: 'rounded-md',
      pill: 'rounded-full',
      square: 'rounded-none'
    };

    const dotClasses = {
      sm: 'w-2 h-2',
      md: 'w-2.5 h-2.5',
      lg: 'w-3 h-3'
    };

    if (dot) {
      return (
        <span
          ref={ref}
          className={cn(
            'inline-flex items-center gap-1.5',
            sizeClasses[size],
            className
          )}
          {...props}
        >
          <span
            className={cn(
              'rounded-full',
              dotClasses[size],
              variantClasses[variant].split(' ')[0] // Get background color only
            )}
          />
          {children && (
            <span className={variantClasses[variant].split(' ')[1]}>
              {children}
            </span>
          )}
        </span>
      );
    }

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center font-medium border transition-colors duration-200',
          variantClasses[variant],
          sizeClasses[size],
          shapeClasses[shape],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

// Export both named and default
export { Badge, type BadgeProps };
export default Badge;
