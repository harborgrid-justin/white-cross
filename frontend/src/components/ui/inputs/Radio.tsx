import React from 'react';
import { cn } from '../../../utils/cn';

interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  description?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error';
}

interface RadioGroupProps {
  children: React.ReactNode;
  error?: string;
  label?: string;
  description?: string;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ 
    className, 
    label, 
    description, 
    error, 
    size = 'md', 
    variant = 'default',
    disabled,
    ...props 
  }, ref) => {
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
            type="radio"
            ref={ref}
            className={cn(
              'border-2 focus:ring-2 focus:ring-offset-2 transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              sizeClasses[size],
              variantClasses[actualVariant],
              className
            )}
            disabled={disabled}
            aria-describedby={
              description ? `${props.id}-description` : error ? `${props.id}-error` : undefined
            }
            aria-invalid={error ? true : false}
            {...props}
          />
        </div>
        {(label || description || error) && (
          <div className="flex-1">
            {label && (
              <label 
                htmlFor={props.id} 
                className={cn(
                  'block text-sm font-medium leading-5 cursor-pointer',
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

const RadioGroup: React.FC<RadioGroupProps> = ({ 
  children, 
  error, 
  label, 
  description, 
  className,
  orientation = 'vertical'
}) => {
  return (
    <fieldset className={cn('space-y-2', className)}>
      {label && (
        <legend className="text-sm font-medium text-gray-900 mb-2">
          {label}
        </legend>
      )}
      {description && (
        <p className="text-sm text-gray-600 mb-3">
          {description}
        </p>
      )}
      <div 
        className={cn(
          orientation === 'horizontal' 
            ? 'flex flex-wrap gap-6' 
            : 'space-y-3'
        )}
        role="radiogroup"
      >
        {children}
      </div>
      {error && (
        <p className="text-sm text-red-600 mt-2" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
};

Radio.displayName = 'Radio';
RadioGroup.displayName = 'RadioGroup';

export { Radio, RadioGroup, type RadioProps, type RadioGroupProps };
