/**
 * LoadingSpinner Component
 *
 * Loading state component with animated spinner and optional message.
 * Supports multiple sizes and overlay mode.
 *
 * @module components/incidents/LoadingSpinner
 */

import React, { memo } from 'react';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs: (string | undefined)[]) => twMerge(clsx(inputs));

/**
 * Props for the LoadingSpinner component.
 *
 * @property {('sm' | 'md' | 'lg' | 'xl')} [size='md'] - Size variant
 * @property {string} [message] - Optional loading message to display
 * @property {boolean} [overlay=false] - Whether to show as full-screen overlay
 * @property {string} [className] - Additional CSS classes
 */
export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  overlay?: boolean;
  className?: string;
}

/**
 * Size configuration for spinner
 */
const sizeClasses = {
  sm: {
    spinner: 'h-4 w-4',
    text: 'text-xs',
    gap: 'gap-2'
  },
  md: {
    spinner: 'h-8 w-8',
    text: 'text-sm',
    gap: 'gap-3'
  },
  lg: {
    spinner: 'h-12 w-12',
    text: 'text-base',
    gap: 'gap-4'
  },
  xl: {
    spinner: 'h-16 w-16',
    text: 'text-lg',
    gap: 'gap-4'
  }
};

/**
 * LoadingSpinner - Loading state component
 *
 * Displays an animated loading spinner with optional message.
 * Can be used inline or as a full-screen overlay.
 *
 * Features:
 * - Multiple size variants (sm, md, lg, xl)
 * - Optional loading message
 * - Overlay mode for full-screen loading
 * - Smooth animations
 * - Dark mode support
 * - Accessible with ARIA labels
 * - Responsive design
 *
 * Size Variants:
 * - sm: Small (4x4) - For inline usage
 * - md: Medium (8x8) - Default size
 * - lg: Large (12x12) - For prominent loading states
 * - xl: Extra Large (16x16) - For full-screen overlays
 *
 * @param props - Component props
 * @param props.size - Size variant (default: 'md')
 * @param props.message - Optional loading message
 * @param props.overlay - Enable full-screen overlay mode (default: false)
 * @param props.className - Additional CSS classes
 * @returns JSX element representing the loading spinner
 *
 * @example
 * ```tsx
 * // Basic inline spinner
 * <LoadingSpinner size="md" message="Loading incidents..." />
 * ```
 *
 * @example
 * ```tsx
 * // Full-screen overlay
 * <LoadingSpinner
 *   size="xl"
 *   message="Loading incident details..."
 *   overlay={true}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Small spinner without message
 * <LoadingSpinner size="sm" />
 * ```
 */
export const LoadingSpinner = memo(({
  size = 'md',
  message,
  overlay = false,
  className
}: LoadingSpinnerProps) => {
  const sizes = sizeClasses[size];

  const spinnerContent = (
    <div
      className={cn(
        'flex flex-col items-center justify-center',
        sizes.gap,
        !overlay && className
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      {/* Animated Spinner */}
      <Loader2
        className={cn(
          sizes.spinner,
          'animate-spin text-primary-600 dark:text-primary-400'
        )}
        aria-hidden="true"
      />

      {/* Loading Message */}
      {message && (
        <p
          className={cn(
            'font-medium text-gray-700 dark:text-gray-300',
            sizes.text
          )}
        >
          {message}
        </p>
      )}

      {/* Screen Reader Text */}
      <span className="sr-only">
        {message || 'Loading...'}
      </span>
    </div>
  );

  // Overlay Mode
  if (overlay) {
    return (
      <div
        className={cn(
          'fixed inset-0 z-50 flex items-center justify-center',
          'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm',
          className
        )}
        aria-label="Loading overlay"
      >
        {spinnerContent}
      </div>
    );
  }

  // Inline Mode
  return spinnerContent;
});

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;
