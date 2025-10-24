import React from 'react';
import { cn } from '../../../utils/cn';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  shape?: 'rounded' | 'pill' | 'square';
  dot?: boolean;
}

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

export { Badge, type BadgeProps };
