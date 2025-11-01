/**
 * WF-SKELETON-001 | Skeleton.tsx - Loading Skeleton Component
 * Purpose: Animated loading placeholder for content
 * Upstream: Design system | Dependencies: React, Tailwind CSS
 * Downstream: All pages and components with loading states
 * Related: LoadingSpinner, Progress
 * Exports: Skeleton component | Key Features: Variants, animations, sizes
 * Last Updated: 2025-10-26 | File Type: .tsx
 * Critical Path: Component loading → Show skeleton → Replace with content
 * LLM Context: Loading placeholder component for White Cross healthcare platform
 */

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function for merging Tailwind CSS class names.
 */
const cn = (...inputs: (string | undefined)[]) => twMerge(clsx(inputs));

/**
 * Props for the Skeleton component.
 *
 * @interface SkeletonProps
 * @extends {React.HTMLAttributes<HTMLDivElement>}
 *
 * @property {('text' | 'circular' | 'rectangular' | 'rounded')} [variant='rectangular'] - Shape variant
 * @property {number | string} [width] - Width of skeleton (px or %)
 * @property {number | string} [height] - Height of skeleton (px)
 * @property {('slow' | 'normal' | 'fast')} [animation='normal'] - Animation speed
 * @property {boolean} [noAnimation=false] - Disable pulse animation
 */
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: number | string;
  height?: number | string;
  animation?: 'slow' | 'normal' | 'fast';
  noAnimation?: boolean;
}

/**
 * Animation speed configurations.
 */
const animationSpeeds = {
  slow: 'animate-pulse-slow',
  normal: 'animate-pulse',
  fast: 'animate-pulse-fast'
};

/**
 * Skeleton loading placeholder component.
 *
 * Displays an animated placeholder while content is loading, improving
 * perceived performance and user experience.
 *
 * **Features:**
 * - Multiple shape variants (text, circular, rectangular, rounded)
 * - Customizable dimensions
 * - Configurable animation speed
 * - Dark mode support
 * - Accessible with proper ARIA attributes
 *
 * **Accessibility:**
 * - role="status" for loading state
 * - aria-live="polite" for screen reader announcements
 * - aria-busy="true" during loading
 * - Hidden text for screen readers
 *
 * @component
 * @param {SkeletonProps} props - Skeleton component props
 * @returns {JSX.Element} Rendered skeleton placeholder
 *
 * @example
 * ```tsx
 * // Text skeleton (single line)
 * <Skeleton variant="text" width="200px" />
 *
 * // Text skeleton (paragraph)
 * <div className="space-y-2">
 *   <Skeleton variant="text" width="100%" />
 *   <Skeleton variant="text" width="90%" />
 *   <Skeleton variant="text" width="80%" />
 * </div>
 *
 * // Circular skeleton (avatar)
 * <Skeleton variant="circular" width={40} height={40} />
 *
 * // Rectangular skeleton (image)
 * <Skeleton variant="rectangular" width="100%" height={200} />
 *
 * // Rounded skeleton (card)
 * <Skeleton variant="rounded" width="100%" height={120} />
 *
 * // Custom animation speed
 * <Skeleton variant="text" animation="fast" />
 *
 * // No animation
 * <Skeleton variant="rectangular" width="100%" height={100} noAnimation />
 *
 * // Loading card skeleton
 * <div className="p-4 border rounded-lg space-y-3">
 *   <div className="flex items-center space-x-3">
 *     <Skeleton variant="circular" width={40} height={40} />
 *     <div className="flex-1 space-y-2">
 *       <Skeleton variant="text" width="60%" />
 *       <Skeleton variant="text" width="40%" />
 *     </div>
 *   </div>
 *   <Skeleton variant="rectangular" width="100%" height={200} />
 *   <div className="space-y-2">
 *     <Skeleton variant="text" width="100%" />
 *     <Skeleton variant="text" width="90%" />
 *     <Skeleton variant="text" width="80%" />
 *   </div>
 * </div>
 * ```
 *
 * @remarks
 * **Healthcare Context**:
 * - Use for loading patient data, health records, medication lists
 * - Match skeleton shape to actual content for better UX
 * - Keep skeleton height consistent with final content
 * - Show skeleton immediately, don't wait for loading state
 *
 * @see {@link SkeletonProps} for detailed prop documentation
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rectangular',
  width,
  height,
  animation = 'normal',
  noAnimation = false,
  className,
  style,
  ...props
}) => {
  // Build inline styles for dimensions
  const inlineStyles: React.CSSProperties = {
    ...style,
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  // Determine base classes based on variant
  const baseClasses = cn(
    'bg-gray-200 dark:bg-gray-700',
    !noAnimation ? animationSpeeds[animation] : undefined,
    {
      'rounded-full': variant === 'circular',
      'rounded-md': variant === 'rounded',
      'rounded': variant === 'rectangular',
      'h-4 rounded': variant === 'text', // Default text height
    },
    className
  );

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={baseClasses}
      style={inlineStyles}
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

Skeleton.displayName = 'Skeleton';

export default Skeleton;
