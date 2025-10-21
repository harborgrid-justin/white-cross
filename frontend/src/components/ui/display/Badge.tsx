import React from 'react';
import { cn } from '../../../utils/cn';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'secondary';
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
      default: 'bg-gray-100 text-gray-800 border-gray-200',
      success: 'bg-green-100 text-green-800 border-green-200',
      warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      error: 'bg-red-100 text-red-800 border-red-200',
      info: 'bg-blue-100 text-blue-800 border-blue-200',
      secondary: 'bg-purple-100 text-purple-800 border-purple-200'
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
          'inline-flex items-center font-medium border',
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
