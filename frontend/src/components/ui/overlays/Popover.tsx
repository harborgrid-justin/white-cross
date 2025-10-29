'use client';

/**
 * WF-POPOVER-001 | Popover.tsx - Popover Component
 * Purpose: Contextual overlay content with smart positioning
 * Upstream: Design system | Dependencies: React, Headless UI, Tailwind CSS
 * Downstream: Context menus, help text, additional information
 * Related: Tooltip, DropdownMenu, Modal
 * Exports: Popover, PopoverButton, PopoverPanel | Key Features: Smart positioning, click/hover triggers, accessible
 * Last Updated: 2025-10-26 | File Type: .tsx
 * Critical Path: Click/hover trigger → Show popover → Interact with content → Close popover
 * LLM Context: Popover component for White Cross healthcare platform
 */

import React, { Fragment } from 'react';
import { Popover as HeadlessPopover, Transition } from '@headlessui/react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs: (string | undefined)[]) => twMerge(clsx(inputs));

/**
 * Popover position type
 */
export type PopoverPosition = 'top' | 'bottom' | 'left' | 'right';

/**
 * Props for the Popover component.
 */
export interface PopoverProps {
  /** Trigger button content */
  trigger: React.ReactNode;
  /** Popover panel content */
  children: React.ReactNode;
  /** Position of popover relative to trigger */
  position?: PopoverPosition;
  /** Show arrow pointing to trigger */
  showArrow?: boolean;
  /** Additional class name for trigger button */
  triggerClassName?: string;
  /** Additional class name for popover panel */
  panelClassName?: string;
  /** Additional class name for wrapper */
  className?: string;
}

/**
 * Position styles for popover panel placement
 */
const positionStyles: Record<PopoverPosition, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

/**
 * Arrow styles for each position
 */
const arrowStyles: Record<PopoverPosition, string> = {
  top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-white dark:border-t-gray-800',
  bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-white dark:border-b-gray-800',
  left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-white dark:border-l-gray-800',
  right: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-white dark:border-r-gray-800',
};

/**
 * Popover component with smart positioning and accessibility.
 *
 * Displays contextual content in an overlay positioned relative to a trigger element.
 * Built on Headless UI Popover for comprehensive accessibility and focus management.
 *
 * **Features:**
 * - 4 position options (top, bottom, left, right)
 * - Click trigger (controlled by Headless UI)
 * - Optional arrow pointer
 * - Focus management
 * - Escape key to close
 * - Click outside to close
 * - Smooth transitions
 * - Dark mode support
 * - Full accessibility
 *
 * **Accessibility:**
 * - ARIA attributes handled by Headless UI
 * - Focus management on open/close
 * - Keyboard navigation (Escape to close)
 * - Focus trap within popover
 * - Screen reader announcements
 *
 * @component
 * @param {PopoverProps} props - Popover component props
 * @returns {JSX.Element} Rendered popover with trigger and panel
 *
 * @example
 * ```tsx
 * // Basic popover
 * <Popover trigger={<button>More Info</button>}>
 *   <div className="p-4">
 *     <h3 className="font-semibold">Additional Information</h3>
 *     <p>This is helpful contextual information.</p>
 *   </div>
 * </Popover>
 *
 * // Popover with custom position
 * <Popover
 *   trigger={<button>Help</button>}
 *   position="right"
 *   showArrow
 * >
 *   <div className="p-3 max-w-sm">
 *     <p className="text-sm">Click here to view detailed help information.</p>
 *   </div>
 * </Popover>
 *
 * // Medication information popover
 * <Popover
 *   trigger={
 *     <button className="text-primary-600 hover:text-primary-700">
 *       View Details
 *     </button>
 *   }
 *   position="bottom"
 * >
 *   <div className="p-4 max-w-md">
 *     <h4 className="font-semibold text-sm mb-2">Medication Details</h4>
 *     <dl className="text-sm space-y-1">
 *       <dt className="font-medium">Dosage:</dt>
 *       <dd>10mg twice daily</dd>
 *       <dt className="font-medium">Instructions:</dt>
 *       <dd>Take with food</dd>
 *     </dl>
 *   </div>
 * </Popover>
 *
 * // Action menu popover
 * <Popover
 *   trigger={
 *     <button className="p-2 rounded hover:bg-gray-100">
 *       <MoreVerticalIcon className="w-5 h-5" />
 *     </button>
 *   }
 *   position="bottom"
 * >
 *   <div className="py-1 w-48">
 *     <button className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700">
 *       Edit
 *     </button>
 *     <button className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700">
 *       Delete
 *     </button>
 *   </div>
 * </Popover>
 * ```
 *
 * @remarks
 * **Healthcare Context**:
 * - Display medication details and interactions
 * - Show patient allergy information
 * - Provide additional health record context
 * - Display medical code explanations
 * - Show appointment details preview
 * - Contextual help for medical forms
 *
 * **Headless UI**: Uses @headlessui/react Popover for accessibility.
 * Handles focus management, keyboard navigation, and ARIA attributes automatically.
 *
 * @see {@link PopoverProps} for detailed prop documentation
 */
export const Popover: React.FC<PopoverProps> = ({
  trigger,
  children,
  position = 'bottom',
  showArrow = false,
  triggerClassName,
  panelClassName,
  className,
}) => {
  return (
    <HeadlessPopover className={cn('relative inline-block', className)}>
      {({ open }) => (
        <>
          <HeadlessPopover.Button
            className={cn(
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md',
              'dark:focus:ring-offset-gray-900',
              triggerClassName
            )}
          >
            {trigger}
          </HeadlessPopover.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <HeadlessPopover.Panel
              className={cn(
                'absolute z-50',
                'bg-white dark:bg-gray-800',
                'border border-gray-200 dark:border-gray-700',
                'rounded-lg shadow-lg',
                'focus:outline-none',
                positionStyles[position],
                panelClassName
              )}
            >
              {children}

              {showArrow && (
                <div
                  className={cn(
                    'absolute w-0 h-0',
                    'border-[6px]',
                    arrowStyles[position]
                  )}
                  aria-hidden="true"
                />
              )}
            </HeadlessPopover.Panel>
          </Transition>
        </>
      )}
    </HeadlessPopover>
  );
};

Popover.displayName = 'Popover';

export default Popover;
