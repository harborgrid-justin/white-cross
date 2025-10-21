import React from 'react';
import { cn } from '../../../utils/cn';

interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error';
  labelPosition?: 'left' | 'right';
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ 
    className, 
    label, 
    description, 
    size = 'md', 
    variant = 'default',
    labelPosition = 'right',
    disabled,
    checked,
    ...props 
  }, ref) => {
    const sizeClasses = {
      sm: {
        container: 'h-5 w-9',
        thumb: 'h-4 w-4',
        translate: 'translate-x-4'
      },
      md: {
        container: 'h-6 w-11',
        thumb: 'h-5 w-5',
        translate: 'translate-x-5'
      },
      lg: {
        container: 'h-7 w-14',
        thumb: 'h-6 w-6',
        translate: 'translate-x-7'
      }
    };

    const variantClasses = {
      default: {
        active: 'bg-blue-600',
        inactive: 'bg-gray-200'
      },
      success: {
        active: 'bg-green-600',
        inactive: 'bg-gray-200'
      },
      warning: {
        active: 'bg-yellow-600',
        inactive: 'bg-gray-200'
      },
      error: {
        active: 'bg-red-600',
        inactive: 'bg-gray-200'
      }
    };

    const sizes = sizeClasses[size];
    const colors = variantClasses[variant];

    const switchElement = (
      <label 
        className={cn(
          'relative inline-flex cursor-pointer',
          disabled && 'cursor-not-allowed opacity-50'
        )}
      >
        <input
          type="checkbox"
          ref={ref}
          className="sr-only"
          disabled={disabled}
          checked={checked}
          aria-describedby={description ? `${props.id}-description` : undefined}
          {...props}
        />
        <div
          className={cn(
            'relative inline-flex items-center rounded-full transition-colors duration-200 ease-in-out focus-within:ring-2 focus-within:ring-offset-2',
            sizes.container,
            checked ? colors.active : colors.inactive,
            disabled ? 'cursor-not-allowed' : 'cursor-pointer',
            className
          )}
        >
          <span
            className={cn(
              'inline-block rounded-full bg-white shadow-lg transform transition-transform duration-200 ease-in-out',
              sizes.thumb,
              checked ? sizes.translate : 'translate-x-0.5'
            )}
          />
        </div>
      </label>
    );

    if (!label && !description) {
      return switchElement;
    }

    return (
      <div className={cn(
        'flex items-start gap-3',
        labelPosition === 'left' && 'flex-row-reverse'
      )}>
        {switchElement}
        <div className="flex-1">
          {label && (
            <div 
              className={cn(
                'text-sm font-medium leading-5',
                disabled ? 'text-gray-400' : 'text-gray-900'
              )}
            >
              {label}
            </div>
          )}
          {description && (
            <p 
              id={`${props.id}-description`}
              className={cn(
                'text-sm leading-5 mt-1',
                disabled ? 'text-gray-400' : 'text-gray-600'
              )}
            >
              {description}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Switch.displayName = 'Switch';

export { Switch, type SwitchProps };
