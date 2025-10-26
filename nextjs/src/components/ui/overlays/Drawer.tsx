'use client';

/**
 * WF-DRAWER-001 | Drawer.tsx - Drawer Component
 * Purpose: Side panel with slide animation for navigation and content
 * Upstream: Design system | Dependencies: React, Tailwind CSS
 * Downstream: Mobile navigation, filters, detail panels, forms
 * Related: Modal, Sheet, Dialog
 * Exports: Drawer, DrawerHeader, DrawerBody, DrawerFooter, DrawerTitle | Key Features: 4 directions, focus trap, sizes, animations
 * Last Updated: 2025-10-26 | File Type: .tsx
 * Critical Path: Open drawer → Focus trap → User interaction → Close drawer
 * LLM Context: Drawer component for White Cross healthcare platform
 */

import React, { useEffect, useRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs: (string | undefined)[]) => twMerge(clsx(inputs));

/**
 * Drawer position type
 */
export type DrawerPosition = 'left' | 'right' | 'top' | 'bottom';

/**
 * Drawer size type
 */
export type DrawerSize = 'sm' | 'md' | 'lg' | 'full';

/**
 * Props for the Drawer component.
 */
export interface DrawerProps {
  /** Whether drawer is currently open/visible */
  open: boolean;
  /** Callback function when drawer should close */
  onClose?: () => void;
  /** Position to slide from */
  position?: DrawerPosition;
  /** Drawer size */
  size?: DrawerSize;
  /** Close drawer when clicking backdrop */
  closeOnBackdropClick?: boolean;
  /** Close drawer when pressing Escape key */
  closeOnEscapeKey?: boolean;
  /** Show close button */
  showCloseButton?: boolean;
  /** Drawer content */
  children: React.ReactNode;
  /** Additional class name */
  className?: string;
}

/**
 * Props for DrawerHeader component
 */
export interface DrawerHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Show bottom border divider */
  divider?: boolean;
}

/**
 * Props for DrawerBody component
 */
export interface DrawerBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Props for DrawerFooter component
 */
export interface DrawerFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Show top border divider */
  divider?: boolean;
}

/**
 * Props for DrawerTitle component
 */
export interface DrawerTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

/**
 * Size classes for horizontal drawers (left, right)
 */
const horizontalSizeClasses: Record<DrawerSize, string> = {
  sm: 'max-w-xs',
  md: 'max-w-md',
  lg: 'max-w-xl',
  full: 'max-w-full',
};

/**
 * Size classes for vertical drawers (top, bottom)
 */
const verticalSizeClasses: Record<DrawerSize, string> = {
  sm: 'max-h-[25vh]',
  md: 'max-h-[50vh]',
  lg: 'max-h-[75vh]',
  full: 'max-h-full',
};

/**
 * Position and animation classes
 */
const positionClasses: Record<DrawerPosition, { base: string; enter: string; leave: string }> = {
  left: {
    base: 'top-0 left-0 h-full',
    enter: 'animate-in slide-in-from-left duration-300',
    leave: 'animate-out slide-out-to-left duration-200',
  },
  right: {
    base: 'top-0 right-0 h-full',
    enter: 'animate-in slide-in-from-right duration-300',
    leave: 'animate-out slide-out-to-right duration-200',
  },
  top: {
    base: 'top-0 left-0 right-0 w-full',
    enter: 'animate-in slide-in-from-top duration-300',
    leave: 'animate-out slide-out-to-top duration-200',
  },
  bottom: {
    base: 'bottom-0 left-0 right-0 w-full',
    enter: 'animate-in slide-in-from-bottom duration-300',
    leave: 'animate-out slide-out-to-bottom duration-200',
  },
};

/**
 * Drawer component with slide animation and focus management.
 *
 * A side panel that slides in from any edge of the screen. Perfect for mobile navigation,
 * filters, detail panels, and secondary forms. Includes focus trap, body scroll lock,
 * and comprehensive accessibility.
 *
 * **Features:**
 * - 4 slide directions (left, right, top, bottom)
 * - 4 size options (sm, md, lg, full)
 * - Focus trap (Tab cycles through drawer elements)
 * - Escape key to close
 * - Click backdrop to close (optional)
 * - Body scroll lock when open
 * - Focus restoration on close
 * - Close button (optional)
 * - Smooth slide animations
 * - Dark mode support
 *
 * **Accessibility:**
 * - role="dialog" and aria-modal="true"
 * - aria-labelledby connecting to DrawerTitle
 * - Focus trap implementation (Tab/Shift+Tab)
 * - Focus first focusable element on open
 * - Restore focus to trigger on close
 * - Escape key to close
 * - Screen reader announcements
 *
 * @component
 * @param {DrawerProps} props - Drawer component props
 * @returns {JSX.Element | null} Rendered drawer or null when closed
 *
 * @example
 * ```tsx
 * // Basic drawer from right
 * <Drawer open={isOpen} onClose={() => setIsOpen(false)}>
 *   <DrawerHeader>
 *     <DrawerTitle>Filter Options</DrawerTitle>
 *   </DrawerHeader>
 *   <DrawerBody>
 *     <FilterForm />
 *   </DrawerBody>
 *   <DrawerFooter>
 *     <Button onClick={handleApplyFilters}>Apply Filters</Button>
 *   </DrawerFooter>
 * </Drawer>
 *
 * // Mobile navigation from left
 * <Drawer open={menuOpen} onClose={closeMenu} position="left" size="md">
 *   <DrawerHeader>
 *     <DrawerTitle>Menu</DrawerTitle>
 *   </DrawerHeader>
 *   <DrawerBody>
 *     <NavigationMenu />
 *   </DrawerBody>
 * </Drawer>
 *
 * // Patient details from right
 * <Drawer
 *   open={showPatient}
 *   onClose={hidePatient}
 *   position="right"
 *   size="lg"
 * >
 *   <DrawerHeader>
 *     <DrawerTitle>Patient Details</DrawerTitle>
 *   </DrawerHeader>
 *   <DrawerBody>
 *     <PatientDetailsView patientId={selectedPatientId} />
 *   </DrawerBody>
 * </Drawer>
 *
 * // Notification panel from top
 * <Drawer open={showNotifications} onClose={closeNotifications} position="top">
 *   <DrawerBody>
 *     <NotificationList />
 *   </DrawerBody>
 * </Drawer>
 * ```
 *
 * @remarks
 * **Healthcare Context**:
 * - Mobile navigation menu
 * - Patient detail view
 * - Filter panels for lists
 * - Medication administration form
 * - Quick health record entry
 * - Notification panel
 * - Settings and preferences
 *
 * **Focus Trap**: Tab and Shift+Tab cycle through focusable elements within
 * the drawer. Focus cannot escape to background content while drawer is open.
 *
 * **Body Scroll Lock**: When drawer opens, background scrolling is prevented.
 * Restored on close.
 *
 * @see {@link DrawerHeader} for drawer header component
 * @see {@link DrawerBody} for drawer body component
 * @see {@link DrawerFooter} for drawer footer component
 * @see {@link DrawerTitle} for drawer title component
 */
export const Drawer: React.FC<DrawerProps> = ({
  open,
  onClose,
  position = 'right',
  size = 'md',
  closeOnBackdropClick = true,
  closeOnEscapeKey = true,
  showCloseButton = true,
  children,
  className,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    if (!closeOnEscapeKey || !open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [closeOnEscapeKey, open, onClose]);

  // Focus trap and management
  useEffect(() => {
    if (!open) return;

    const previousActiveElement = document.activeElement as HTMLElement;
    const drawer = drawerRef.current;

    if (drawer) {
      // Focus the drawer or first focusable element
      const focusable = drawer.querySelector('button, input, select, textarea, [tabindex]:not([tabindex="-1"])') as HTMLElement;
      if (focusable) {
        focusable.focus();
      } else {
        drawer.focus();
      }

      // Focus trap implementation
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;

        const focusableElements = drawer.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        } else if (!e.shiftKey && document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      };

      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        // Restore focus when drawer closes
        if (previousActiveElement) {
          previousActiveElement.focus();
        }
      };
    }

    return () => {
      // Restore focus when drawer closes
      if (previousActiveElement) {
        previousActiveElement.focus();
      }
    };
  }, [open]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  const isHorizontal = position === 'left' || position === 'right';
  const sizeClass = isHorizontal ? horizontalSizeClasses[size] : verticalSizeClasses[size];
  const { base, enter } = positionClasses[position];

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (closeOnBackdropClick && event.target === event.currentTarget) {
      onClose?.();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      aria-labelledby="drawer-title"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 transition-opacity animate-in fade-in duration-300"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={cn(
          'fixed bg-white dark:bg-gray-800 shadow-xl',
          'overflow-y-auto',
          base,
          sizeClass,
          enter,
          className
        )}
        tabIndex={-1}
      >
        {showCloseButton && (
          <button
            type="button"
            className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 rounded-md p-1"
            onClick={onClose}
            aria-label="Close drawer"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        {children}
      </div>
    </div>
  );
};

/**
 * Drawer header component for title and close button area.
 */
export const DrawerHeader = React.forwardRef<HTMLDivElement, DrawerHeaderProps>(
  ({ className, divider = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'px-6 py-4',
          divider && 'border-b border-gray-200 dark:border-gray-700',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

/**
 * Drawer body component for main content area.
 */
export const DrawerBody = React.forwardRef<HTMLDivElement, DrawerBodyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('px-6 py-4 flex-1', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

/**
 * Drawer footer component for action buttons.
 */
export const DrawerFooter = React.forwardRef<HTMLDivElement, DrawerFooterProps>(
  ({ className, divider = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'px-6 py-4 flex items-center justify-end space-x-3',
          divider && 'border-t border-gray-200 dark:border-gray-700',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

/**
 * Drawer title component (h2 heading).
 */
export const DrawerTitle = React.forwardRef<HTMLHeadingElement, DrawerTitleProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h2
        ref={ref}
        id="drawer-title"
        className={cn('text-lg font-semibold text-gray-900 dark:text-gray-100', className)}
        {...props}
      >
        {children}
      </h2>
    );
  }
);

Drawer.displayName = 'Drawer';
DrawerHeader.displayName = 'DrawerHeader';
DrawerBody.displayName = 'DrawerBody';
DrawerFooter.displayName = 'DrawerFooter';
DrawerTitle.displayName = 'DrawerTitle';

export default Drawer;
