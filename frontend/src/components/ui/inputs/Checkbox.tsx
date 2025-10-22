import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility function for merging class names
const cn = (...inputs: (string | undefined)[]) => twMerge(clsx(inputs));

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  description?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error';
  indeterminate?: boolean;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ 
    className, 
    label, 
    description, 
    error, 
    size = 'md', 
    variant = 'default',
    indeterminate = false,
    disabled,
    ...props 
  }, ref) => {
    const checkboxRef = React.useRef<HTMLInputElement>(null);
    
    React.useEffect(() => {
      const checkbox = checkboxRef.current || (ref as React.RefObject<HTMLInputElement>)?.current;
      if (checkbox) {
        checkbox.indeterminate = indeterminate;
      }
    }, [indeterminate, ref]);

    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6'
    };

    const variantClasses = {
      default: 'border-gray-300 text-blue-600 focus:ring-blue-500',
      success: 'border-green-300 text-green-600 focus:ring-green-500',
      warning: 'border-yellow-300 text-yellow-600 focus:ring-yellow-500',
      error: 'border-red-300 text-red-600 focus:ring-red-500'
    };

    const actualVariant = error ? 'error' : variant;

    return (
      <div className="flex items-start space-x-3">
        <div className="flex items-center h-5">
          <input
            type="checkbox"
            ref={ref || checkboxRef}
            className={cn(
              'rounded border-2 focus:ring-2 focus:ring-offset-2 transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              sizeClasses[size],
              variantClasses[actualVariant],
              className
            )}
            disabled={disabled}
            aria-describedby={
              description ? `${props.id}-description` : error ? `${props.id}-error` : undefined
            }
            aria-invalid={error ? 'true' : 'false'}
            {...props}
          />
        </div>
        {(label || description || error) && (
          <div className="flex-1">
            {label && (
              <label 
                htmlFor={props.id} 
                className={cn(
                  'block text-sm font-medium leading-5',
                  disabled ? 'text-gray-400' : 'text-gray-900',
                  error && 'text-red-900'
                )}
              >
                {label}
              </label>
            )}
            {description && (
              <p 
                id={`${props.id}-description`}
                className={cn(
                  'text-sm leading-5',
                  disabled ? 'text-gray-400' : 'text-gray-600'
                )}
              >
                {description}
              </p>
            )}
            {error && (
              <p 
                id={`${props.id}-error`}
                className="text-sm text-red-600 mt-1"
                role="alert"
              >
                {error}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox, type CheckboxProps };
