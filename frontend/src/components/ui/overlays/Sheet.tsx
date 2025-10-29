'use client';

/**
 * WF-SHEET-001 | Sheet.tsx - Sheet Component
 * Purpose: Side panel overlay for forms, settings, and notifications
 * Upstream: Design system | Dependencies: React, Tailwind CSS
 * Downstream: Forms, settings panels, notification panels
 * Related: Drawer, Modal, Dialog
 * Exports: Sheet, SheetHeader, SheetBody, SheetFooter, SheetTitle, SheetDescription | Key Features: Side overlay, focus trap, animations, accessible
 * Last Updated: 2025-10-26 | File Type: .tsx
 * Critical Path: Open sheet → Focus trap → User interaction → Close sheet
 * LLM Context: Sheet component for White Cross healthcare platform
 */

import React, { useEffect, useRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs: (string | undefined)[]) => twMerge(clsx(inputs));

/**
 * Sheet position type
 */
export type SheetPosition = 'left' | 'right';

/**
 * Sheet size type
 */
export type SheetSize = 'sm' | 'md' | 'lg' | 'xl';

/**
 * Props for the Sheet component.
 */
export interface SheetProps {
  /** Whether sheet is currently open/visible */
  open: boolean;
  /** Callback function when sheet should close */
  onClose?: () => void;
  /** Position to slide from (left or right) */
  position?: SheetPosition;
  /** Sheet size */
  size?: SheetSize;
  /** Close sheet when clicking backdrop */
  closeOnBackdropClick?: boolean;
  /** Close sheet when pressing Escape key */
  closeOnEscapeKey?: boolean;
  /** Show close button */
  showCloseButton?: boolean;
  /** Sheet content */
  children: React.ReactNode;
  /** Additional class name */
  className?: string;
}

/**
 * Props for SheetHeader component
 */
export interface SheetHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Props for SheetBody component
 */
export interface SheetBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Props for SheetFooter component
 */
export interface SheetFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Props for SheetTitle component
 */
export interface SheetTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

/**
 * Props for SheetDescription component
 */
export interface SheetDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

/**
 * Size classes for sheets
 */
const sizeClasses: Record<SheetSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

/**
 * Position and animation classes
 */
const positionClasses: Record<SheetPosition, { base: string; enter: string }> = {
  left: {
    base: 'top-0 left-0 h-full',
    enter: 'animate-in slide-in-from-left duration-300',
  },
  right: {
    base: 'top-0 right-0 h-full',
    enter: 'animate-in slide-in-from-right duration-300',
  },
};

/**
 * Sheet component for side panel overlays.
 *
 * A specialized side panel component optimized for forms, settings, and
 * notification displays. Similar to Drawer but with additional semantic
 * structure for common use cases.
 *
 * **Features:**
 * - Slide from left or right
 * - 4 size options (sm, md, lg, xl)
 * - Focus trap
 * - Escape key to close
 * - Click backdrop to close (optional)
 * - Body scroll lock when open
 * - Focus restoration on close
 * - Close button (optional)
 * - Header with title and description
 * - Smooth slide animations
 * - Dark mode support
 *
 * **Accessibility:**
 * - role="dialog" and aria-modal="true"
 * - aria-labelledby connecting to SheetTitle
 * - aria-describedby connecting to SheetDescription
 * - Focus trap implementation
 * - Focus first focusable element on open
 * - Restore focus to trigger on close
 * - Escape key to close
 *
 * @component
 * @param {SheetProps} props - Sheet component props
 * @returns {JSX.Element | null} Rendered sheet or null when closed
 *
 * @example
 * ```tsx
 * // Settings sheet
 * <Sheet open={showSettings} onClose={closeSettings}>
 *   <SheetHeader>
 *     <SheetTitle>Settings</SheetTitle>
 *     <SheetDescription>
 *       Customize your White Cross experience
 *     </SheetDescription>
 *   </SheetHeader>
 *   <SheetBody>
 *     <SettingsForm />
 *   </SheetBody>
 *   <SheetFooter>
 *     <Button variant="outline" onClick={closeSettings}>Cancel</Button>
 *     <Button onClick={handleSaveSettings}>Save Changes</Button>
 *   </SheetFooter>
 * </Sheet>
 *
 * // Notifications sheet from left
 * <Sheet open={showNotifications} onClose={closeNotifications} position="left" size="sm">
 *   <SheetHeader>
 *     <SheetTitle>Notifications</SheetTitle>
 *   </SheetHeader>
 *   <SheetBody>
 *     <NotificationList />
 *   </SheetBody>
 * </Sheet>
 *
 * // Patient form sheet
 * <Sheet open={editingPatient} onClose={cancelEdit} size="lg">
 *   <SheetHeader>
 *     <SheetTitle>Edit Patient Information</SheetTitle>
 *     <SheetDescription>
 *       Update patient demographics and contact information
 *     </SheetDescription>
 *   </SheetHeader>
 *   <SheetBody>
 *     <PatientForm patient={selectedPatient} />
 *   </SheetBody>
 *   <SheetFooter>
 *     <Button variant="outline" onClick={cancelEdit}>Cancel</Button>
 *     <Button onClick={handleSavePatient}>Save Patient</Button>
 *   </SheetFooter>
 * </Sheet>
 * ```
 *
 * @remarks
 * **Healthcare Context**:
 * - Patient information forms
 * - Settings and preferences
 * - Notification center
 * - Quick medication entry
 * - Health record forms
 * - Filter and search panels
 * - User profile editing
 *
 * @see {@link SheetHeader} for sheet header component
 * @see {@link SheetBody} for sheet body component
 * @see {@link SheetFooter} for sheet footer component
 * @see {@link SheetTitle} for sheet title component
 * @see {@link SheetDescription} for sheet description component
 */
export const Sheet: React.FC<SheetProps> = ({
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
  const sheetRef = useRef<HTMLDivElement>(null);

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
    const sheet = sheetRef.current;

    if (sheet) {
      const focusable = sheet.querySelector('button, input, select, textarea, [tabindex]:not([tabindex="-1"])') as HTMLElement;
      if (focusable) {
        focusable.focus();
      } else {
        sheet.focus();
      }

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;

        const focusableElements = sheet.querySelectorAll<HTMLElement>(
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
        if (previousActiveElement) {
          previousActiveElement.focus();
        }
      };
    }

    return () => {
      if (previousActiveElement) {
        previousActiveElement.focus();
      }
    };
  }, [open]);

  // Prevent body scroll when sheet is open
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

  const { base, enter } = positionClasses[position];

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (closeOnBackdropClick && event.target === event.currentTarget) {
      onClose?.();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      aria-labelledby="sheet-title"
      aria-describedby="sheet-description"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 transition-opacity animate-in fade-in duration-300"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className={cn(
          'fixed bg-white dark:bg-gray-800 shadow-xl',
          'overflow-y-auto flex flex-col',
          base,
          sizeClasses[size],
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
            aria-label="Close sheet"
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
 * Sheet header component.
 */
export const SheetHeader = React.forwardRef<HTMLDivElement, SheetHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('px-6 py-4 border-b border-gray-200 dark:border-gray-700', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

/**
 * Sheet body component.
 */
export const SheetBody = React.forwardRef<HTMLDivElement, SheetBodyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('px-6 py-4 flex-1 overflow-y-auto', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

/**
 * Sheet footer component.
 */
export const SheetFooter = React.forwardRef<HTMLDivElement, SheetFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end space-x-3', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

/**
 * Sheet title component.
 */
export const SheetTitle = React.forwardRef<HTMLHeadingElement, SheetTitleProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h2
        ref={ref}
        id="sheet-title"
        className={cn('text-lg font-semibold text-gray-900 dark:text-gray-100', className)}
        {...props}
      >
        {children}
      </h2>
    );
  }
);

/**
 * Sheet description component.
 */
export const SheetDescription = React.forwardRef<HTMLParagraphElement, SheetDescriptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        id="sheet-description"
        className={cn('mt-1 text-sm text-gray-500 dark:text-gray-400', className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);

Sheet.displayName = 'Sheet';
SheetHeader.displayName = 'SheetHeader';
SheetBody.displayName = 'SheetBody';
SheetFooter.displayName = 'SheetFooter';
SheetTitle.displayName = 'SheetTitle';
SheetDescription.displayName = 'SheetDescription';

export default Sheet;
