/**
 * WF-BTN-001 | Button.tsx - Primary Button Component
 * Purpose: Core button component with variants and states
 * Upstream: Design system | Dependencies: React, Tailwind CSS
 * Downstream: All UI components | Called by: Forms, actions, navigation
 * Related: Other UI components, form elements
 * Exports: Button component | Key Features: Variants, sizes, states, accessibility
 * Last Updated: 2025-10-21 | File Type: .tsx
 * Critical Path: User interaction → Button click → Action execution
 * LLM Context: Primary button component for White Cross healthcare platform
 */

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility function for merging class names
const cn = (...inputs: (string | undefined)[]) => twMerge(clsx(inputs));

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  leftIcon?: React.ReactNode; // Backward compatibility
  rightIcon?: React.ReactNode; // Backward compatibility  
  fullWidth?: boolean;
  asChild?: boolean;
}

const buttonVariants = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
  secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
  outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
  ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-500',
  destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
};

const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
  xl: 'px-8 py-4 text-lg'
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    loading = false,
    icon,
    iconPosition = 'left',
    leftIcon, // Backward compatibility
    rightIcon, // Backward compatibility
    fullWidth = false,
    disabled,
    children,
    ...props
  }, ref) => {
    const isDisabled = disabled || loading;

    // Determine which icon to use and position (backward compatibility)
    const finalIcon = icon || leftIcon || rightIcon;
    const finalIconPosition = icon ? iconPosition : leftIcon ? 'left' : rightIcon ? 'right' : iconPosition;

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          buttonVariants[variant],
          buttonSizes[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <svg
            className={cn(
              'animate-spin h-4 w-4',
              children && 'mr-2'
            )}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        
        {!loading && finalIcon && finalIconPosition === 'left' && (
          <span className={cn(children && 'mr-2')}>
            {finalIcon}
          </span>
        )}
        
        {children}
        
        {!loading && finalIcon && finalIconPosition === 'right' && (
          <span className={cn(children && 'ml-2')}>
            {finalIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
