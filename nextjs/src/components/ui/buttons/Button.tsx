'use client';

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

/**
 * Utility function for merging Tailwind CSS class names.
 * Combines clsx for conditional classes with tailwind-merge for deduplication.
 *
 * @param inputs - Array of class name strings or undefined values
 * @returns Merged and deduplicated class name string
 *
 * @example
 * ```typescript
 * cn('bg-blue-500', 'bg-red-500') // Returns 'bg-red-500' (last wins)
 * cn('px-4', undefined, 'py-2') // Returns 'px-4 py-2' (filters undefined)
 * ```
 */
const cn = (...inputs: (string | undefined)[]) => twMerge(clsx(inputs));

/**
 * Button component props extending native HTML button attributes.
 *
 * @interface ButtonProps
 * @extends {React.ButtonHTMLAttributes<HTMLButtonElement>}
 *
 * @property {('primary' | 'secondary' | 'outline' | 'outline-primary' | 'ghost' | 'link' | 'destructive' | 'danger' | 'success' | 'warning' | 'info')} [variant='primary'] - Visual style variant
 * @property {('xs' | 'sm' | 'md' | 'lg' | 'xl')} [size='md'] - Button size (affects padding and text size)
 * @property {boolean} [loading=false] - Loading state showing spinner animation
 * @property {React.ReactNode} [icon] - Icon element to display (use with iconPosition)
 * @property {('left' | 'right')} [iconPosition='left'] - Icon placement relative to text
 * @property {React.ReactNode} [leftIcon] - Left-aligned icon (backward compatibility)
 * @property {React.ReactNode} [rightIcon] - Right-aligned icon (backward compatibility)
 * @property {boolean} [fullWidth=false] - Expand button to full container width
 * @property {boolean} [asChild=false] - Render as child component (composition pattern)
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'outline-primary' | 'ghost' | 'link' | 'destructive' | 'danger' | 'success' | 'warning' | 'info';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  leftIcon?: React.ReactNode; // Backward compatibility
  rightIcon?: React.ReactNode; // Backward compatibility
  fullWidth?: boolean;
  asChild?: boolean;
}

/**
 * Button variant style configurations.
 * Each variant includes colors, hover states, active states, focus rings, and dark mode support.
 *
 * Variants:
 * - primary: Main action color (brand blue)
 * - secondary: Alternative action color
 * - outline: Bordered transparent background
 * - outline-primary: Primary colored border
 * - ghost: Minimal style with hover state
 * - link: Text-only link appearance
 * - destructive/danger: Warning for destructive actions (red)
 * - success: Positive confirmation actions (green)
 * - warning: Caution actions (yellow/orange)
 * - info: Informational actions (blue)
 *
 * @constant
 */
const buttonVariants = {
  primary: 'bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white focus:ring-primary-500 shadow-sm hover:shadow-md dark:bg-primary-500 dark:hover:bg-primary-600',
  secondary: 'bg-secondary-600 hover:bg-secondary-700 active:bg-secondary-800 text-white focus:ring-secondary-500 shadow-sm hover:shadow-md dark:bg-secondary-500 dark:hover:bg-secondary-600',
  outline: 'border-2 border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 active:bg-gray-100 focus:ring-gray-500 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800',
  'outline-primary': 'border-2 border-primary-600 bg-transparent text-primary-600 hover:bg-primary-50 active:bg-primary-100 focus:ring-primary-500 dark:border-primary-500 dark:text-primary-400 dark:hover:bg-primary-950',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200 focus:ring-gray-500 dark:text-gray-300 dark:hover:bg-gray-800',
  link: 'bg-transparent text-primary-600 hover:text-primary-700 hover:underline focus:ring-primary-500 dark:text-primary-400 dark:hover:text-primary-300',
  destructive: 'bg-danger-600 hover:bg-danger-700 active:bg-danger-800 text-white focus:ring-danger-500 shadow-sm hover:shadow-md dark:bg-danger-500 dark:hover:bg-danger-600',
  danger: 'bg-danger-600 hover:bg-danger-700 active:bg-danger-800 text-white focus:ring-danger-500 shadow-sm hover:shadow-md dark:bg-danger-500 dark:hover:bg-danger-600',
  success: 'bg-success-600 hover:bg-success-700 active:bg-success-800 text-white focus:ring-success-500 shadow-sm hover:shadow-md dark:bg-success-500 dark:hover:bg-success-600',
  warning: 'bg-warning-600 hover:bg-warning-700 active:bg-warning-800 text-white focus:ring-warning-500 shadow-sm hover:shadow-md dark:bg-warning-500 dark:hover:bg-warning-600',
  info: 'bg-info-600 hover:bg-info-700 active:bg-info-800 text-white focus:ring-info-500 shadow-sm hover:shadow-md dark:bg-info-500 dark:hover:bg-info-600'
};

/**
 * Button size configurations.
 * Defines padding, text size, and border radius for each size variant.
 *
 * Sizes:
 * - xs: Extra small (compact UI elements)
 * - sm: Small (dense layouts)
 * - md: Medium (default, most common)
 * - lg: Large (prominent actions)
 * - xl: Extra large (hero sections, call-to-action)
 *
 * @constant
 */
const buttonSizes = {
  xs: 'px-2 py-1 text-xs rounded',
  sm: 'px-3 py-1.5 text-sm rounded-md',
  md: 'px-4 py-2 text-sm rounded-lg',
  lg: 'px-6 py-3 text-base rounded-lg',
  xl: 'px-8 py-4 text-lg rounded-xl'
};

/**
 * Primary button component with extensive variant and state support.
 *
 * A highly flexible, accessible button component with multiple visual variants,
 * sizes, loading states, and icon support. Optimized with React.memo to prevent
 * unnecessary re-renders.
 *
 * **Features:**
 * - 11 visual variants (primary, secondary, outline, ghost, link, danger, success, warning, info)
 * - 5 size options (xs, sm, md, lg, xl)
 * - Loading state with animated spinner
 * - Icon support (left or right positioned)
 * - Full-width layout option
 * - Dark mode support
 * - Keyboard accessible (focus rings, disabled states)
 * - Respects reduced motion preferences
 * - Active state animations (scale effect)
 * - Forward ref support for DOM access
 *
 * **Accessibility:**
 * - aria-busy attribute during loading
 * - aria-disabled attribute when disabled
 * - Proper focus management with visible focus rings
 * - Disabled state prevents interaction
 * - Motion-reduce support for animations
 *
 * @component
 * @param {ButtonProps} props - Button component props
 * @param {React.Ref<HTMLButtonElement>} ref - Forwarded ref to button element
 * @returns {JSX.Element} Rendered button element
 *
 * @example
 * ```tsx
 * // Primary button (default)
 * <Button onClick={handleSave}>Save Changes</Button>
 *
 * // Danger variant with loading state
 * <Button variant="danger" loading={isDeleting} onClick={handleDelete}>
 *   Delete Account
 * </Button>
 *
 * // Outline variant with left icon
 * <Button variant="outline" icon={<PlusIcon />} iconPosition="left">
 *   Add Item
 * </Button>
 *
 * // Large size, full width, success variant
 * <Button variant="success" size="lg" fullWidth>
 *   Complete Registration
 * </Button>
 *
 * // Ghost variant with right icon
 * <Button variant="ghost" icon={<ChevronRightIcon />} iconPosition="right">
 *   Continue
 * </Button>
 *
 * // Disabled state
 * <Button disabled>Cannot Submit</Button>
 *
 * // With ref for DOM manipulation
 * const buttonRef = useRef<HTMLButtonElement>(null);
 * <Button ref={buttonRef}>Focus Me</Button>
 * ```
 *
 * @see {@link ButtonProps} for detailed prop documentation
 */
// Memoized button component to prevent unnecessary re-renders
export const Button = React.memo(React.forwardRef<HTMLButtonElement, ButtonProps>(
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
          'inline-flex items-center justify-center font-medium transition-all duration-200 ease-in-out',
          'transform active:scale-[0.98]',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          'motion-reduce:transition-none motion-reduce:transform-none',
          buttonVariants[variant],
          buttonSizes[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={isDisabled}
        aria-busy={loading}
        aria-disabled={isDisabled}
        {...props}
      >
        {loading && (
          <>
            <svg
              className={cn(
                'animate-spin h-4 w-4',
                children && 'mr-2'
              )}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
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
            <span className="sr-only">Loading...</span>
          </>
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
));

Button.displayName = 'Button';

export default Button;
