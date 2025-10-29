'use client';

/**
 * WF-TOOLTIP-001 | Tooltip.tsx - Tooltip Component
 * Purpose: Hover tooltip for providing contextual help
 * Upstream: Design system | Dependencies: React, Tailwind CSS
 * Downstream: All components needing help text
 * Related: Popover, Modal
 * Exports: Tooltip component | Key Features: Positions, delays, arrows, accessibility
 * Last Updated: 2025-10-26 | File Type: .tsx
 * Critical Path: Hover/focus → Show tooltip → Leave → Hide tooltip
 * LLM Context: Tooltip component for White Cross healthcare platform
 */

import React, { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs: (string | undefined)[]) => twMerge(clsx(inputs));

/**
 * Tooltip position type
 */
export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

/**
 * Props for the Tooltip component.
 */
export interface TooltipProps {
  /** Tooltip content (text or JSX) */
  content: React.ReactNode;
  /** Element that triggers the tooltip */
  children: React.ReactElement;
  /** Position of tooltip relative to trigger */
  position?: TooltipPosition;
  /** Delay before showing tooltip (ms) */
  delayShow?: number;
  /** Delay before hiding tooltip (ms) */
  delayHide?: number;
  /** Disable the tooltip */
  disabled?: boolean;
  /** Show arrow pointing to trigger */
  showArrow?: boolean;
  /** Additional class name for tooltip container */
  className?: string;
}

/**
 * Position styles for tooltip placement
 */
const positionStyles: Record<TooltipPosition, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

/**
 * Arrow styles for each position
 */
const arrowStyles: Record<TooltipPosition, string> = {
  top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent',
  bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent',
  left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent',
  right: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent',
};

/**
 * Tooltip component with hover/focus interactions.
 *
 * Displays contextual help text on hover or keyboard focus. Fully accessible
 * with proper ARIA attributes and keyboard support.
 *
 * **Features:**
 * - 4 position options (top, bottom, left, right)
 * - Configurable show/hide delays
 * - Optional arrow pointer
 * - Keyboard accessible (shows on focus)
 * - Dark mode support
 * - Auto-positioning to stay in viewport (future enhancement)
 *
 * **Accessibility:**
 * - role="tooltip" for screen readers
 * - aria-describedby linking tooltip to trigger
 * - Shows on both hover and keyboard focus
 * - Dismisses on Escape key
 * - Hidden from screen readers when not visible
 *
 * @component
 * @param {TooltipProps} props - Tooltip component props
 * @returns {JSX.Element} Trigger element with tooltip
 *
 * @example
 * ```tsx
 * // Basic tooltip
 * <Tooltip content="This is helpful information">
 *   <button>Hover me</button>
 * </Tooltip>
 *
 * // Tooltip with custom position
 * <Tooltip content="Appears on the left" position="left">
 *   <span>Info icon</span>
 * </Tooltip>
 *
 * // Tooltip with delay
 * <Tooltip content="Shows after 500ms" delayShow={500}>
 *   <button>Delayed tooltip</button>
 * </Tooltip>
 *
 * // Tooltip with arrow
 * <Tooltip content="Has an arrow pointer" showArrow>
 *   <button>Arrow tooltip</button>
 * </Tooltip>
 *
 * // Rich content tooltip
 * <Tooltip
 *   content={
 *     <div>
 *       <strong>Patient Alert</strong>
 *       <p>This patient has a severe allergy to penicillin</p>
 *     </div>
 *   }
 * >
 *   <span className="text-red-600">⚠️</span>
 * </Tooltip>
 *
 * // Disabled tooltip
 * <Tooltip content="Won't show" disabled>
 *   <button>No tooltip</button>
 * </Tooltip>
 * ```
 *
 * @remarks
 * **Healthcare Context**:
 * - Use for explaining medical abbreviations and codes
 * - Provide help text for complex medical forms
 * - Show detailed medication information on hover
 * - Display allergy warnings and contraindications
 * - Keep content concise - tooltips are for brief help
 *
 * @see {@link TooltipProps} for detailed prop documentation
 */
export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delayShow = 200,
  delayHide = 0,
  disabled = false,
  showArrow = true,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipId] = useState(`tooltip-${Math.random().toString(36).substr(2, 9)}`);
  const showTimerRef = useRef<NodeJS.Timeout>();
  const hideTimerRef = useRef<NodeJS.Timeout>();

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (showTimerRef.current) clearTimeout(showTimerRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (disabled) return;

    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }

    showTimerRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delayShow);
  };

  const handleMouseLeave = () => {
    if (disabled) return;

    if (showTimerRef.current) {
      clearTimeout(showTimerRef.current);
    }

    hideTimerRef.current = setTimeout(() => {
      setIsVisible(false);
    }, delayHide);
  };

  const handleFocus = () => {
    if (disabled) return;
    setIsVisible(true);
  };

  const handleBlur = () => {
    if (disabled) return;
    setIsVisible(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsVisible(false);
    }
  };

  // Clone child element to add event handlers and ARIA attributes
  const trigger = React.cloneElement(children, {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onFocus: handleFocus,
    onBlur: handleBlur,
    onKeyDown: handleKeyDown,
    'aria-describedby': isVisible ? tooltipId : undefined,
    // Preserve existing props
    ...children.props,
  } as React.HTMLAttributes<HTMLElement>);

  return (
    <div className="relative inline-block">
      {trigger}

      {isVisible && !disabled && (
        <div
          id={tooltipId}
          role="tooltip"
          className={cn(
            'absolute z-50 px-3 py-2',
            'text-sm text-white bg-gray-900 dark:bg-gray-800',
            'rounded-md shadow-lg',
            'animate-in fade-in zoom-in-95 duration-200',
            'max-w-xs whitespace-normal break-words',
            positionStyles[position],
            className
          )}
        >
          {content}

          {showArrow && (
            <div
              className={cn(
                'absolute w-0 h-0',
                'border-4 border-gray-900 dark:border-gray-800',
                arrowStyles[position]
              )}
            />
          )}
        </div>
      )}
    </div>
  );
};

Tooltip.displayName = 'Tooltip';

export default Tooltip;
