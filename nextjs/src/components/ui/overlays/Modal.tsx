'use client';

/**
 * WF-MODAL-001 | Modal.tsx - Modal Dialog Component
 * Purpose: Accessible modal dialog with focus trap and keyboard navigation
 * Upstream: Design system | Dependencies: React, Tailwind CSS, cn utility
 * Downstream: Forms, confirmations, detailed views | Called by: Application components
 * Related: ConfirmationDialog, overlays
 * Exports: Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalTitle
 * Key Features: Focus trap, keyboard navigation, backdrop click, sizes, accessibility
 * Last Updated: 2025-10-26 | File Type: .tsx
 * Critical Path: Open modal → Focus trap → User interaction → Close modal
 * LLM Context: Modal component for White Cross healthcare platform
 */

import React from 'react';
import { cn } from '../../../utils/cn';

/**
 * Props for the Modal component.
 *
 * @interface ModalProps
 * @extends {React.HTMLAttributes<HTMLDivElement>}
 *
 * @property {boolean} open - Whether modal is currently open/visible
 * @property {() => void} [onClose] - Callback function when modal should close
 * @property {('sm' | 'md' | 'lg' | 'xl' | 'full')} [size='md'] - Modal width size
 * @property {boolean} [centered=true] - Whether to center modal vertically
 * @property {boolean} [closeOnBackdropClick=true] - Close modal when clicking backdrop
 * @property {boolean} [closeOnEscapeKey=true] - Close modal when pressing Escape key
 * @property {boolean} [showCloseButton=true] - Show X close button in top-right
 */
interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose?: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  centered?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscapeKey?: boolean;
  showCloseButton?: boolean;
}

/**
 * Props for the ModalContent component.
 *
 * @interface ModalContentProps
 * @extends {React.HTMLAttributes<HTMLDivElement>}
 */
interface ModalContentProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Props for the ModalHeader component.
 *
 * @interface ModalHeaderProps
 * @extends {React.HTMLAttributes<HTMLDivElement>}
 *
 * @property {boolean} [divider=true] - Show bottom border divider
 */
interface ModalHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  divider?: boolean;
}

/**
 * Props for the ModalBody component.
 *
 * @interface ModalBodyProps
 * @extends {React.HTMLAttributes<HTMLDivElement>}
 */
interface ModalBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Props for the ModalFooter component.
 *
 * @interface ModalFooterProps
 * @extends {React.HTMLAttributes<HTMLDivElement>}
 *
 * @property {boolean} [divider=true] - Show top border divider
 */
interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  divider?: boolean;
}

/**
 * Props for the ModalTitle component.
 *
 * @interface ModalTitleProps
 * @extends {React.HTMLAttributes<HTMLHeadingElement>}
 */
interface ModalTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

/**
 * Modal dialog component with focus trap and comprehensive accessibility.
 *
 * A fully accessible modal dialog component following WAI-ARIA dialog pattern.
 * Includes automatic focus management, keyboard navigation, focus trap, body
 * scroll locking, and Escape key handling. Supports multiple sizes and
 * customizable close behavior.
 *
 * **Features:**
 * - 5 size options (sm, md, lg, xl, full)
 * - Focus trap (Tab cycles through modal elements)
 * - Escape key to close
 * - Click backdrop to close (optional)
 * - Body scroll lock when open
 * - Focus restoration on close
 * - Close button (optional)
 * - Centered or top positioning
 * - Dark backdrop with opacity
 * - Smooth transitions
 *
 * **Accessibility:**
 * - role="dialog" and aria-modal="true"
 * - aria-labelledby connecting to ModalTitle
 * - Focus trap implementation (Tab/Shift+Tab)
 * - Focus first focusable element on open
 * - Restore focus to trigger on close
 * - Escape key to close
 * - Screen reader announcements
 *
 * @component
 * @param {ModalProps} props - Modal component props
 * @param {React.Ref<HTMLDivElement>} ref - Forwarded ref to modal dialog element
 * @returns {JSX.Element | null} Rendered modal dialog or null when closed
 *
 * @example
 * ```tsx
 * // Basic modal
 * <Modal open={isOpen} onClose={() => setIsOpen(false)}>
 *   <ModalHeader>
 *     <ModalTitle>Confirm Action</ModalTitle>
 *   </ModalHeader>
 *   <ModalBody>
 *     Are you sure you want to proceed?
 *   </ModalBody>
 *   <ModalFooter>
 *     <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
 *     <Button onClick={handleConfirm}>Confirm</Button>
 *   </ModalFooter>
 * </Modal>
 *
 * // Large modal without close button
 * <Modal
 *   open={showDetails}
 *   onClose={handleClose}
 *   size="lg"
 *   showCloseButton={false}
 * >
 *   <ModalHeader>
 *     <ModalTitle>Patient Details</ModalTitle>
 *   </ModalHeader>
 *   <ModalBody>
 *     <PatientDetailsForm />
 *   </ModalBody>
 * </Modal>
 *
 * // Modal that only closes with button (not backdrop)
 * <Modal
 *   open={isEditing}
 *   onClose={handleSave}
 *   closeOnBackdropClick={false}
 *   closeOnEscapeKey={false}
 * >
 *   <ModalHeader>
 *     <ModalTitle>Edit Health Record</ModalTitle>
 *   </ModalHeader>
 *   <ModalBody>
 *     <HealthRecordForm />
 *   </ModalBody>
 *   <ModalFooter>
 *     <Button onClick={handleSave}>Save Changes</Button>
 *   </ModalFooter>
 * </Modal>
 * ```
 *
 * @remarks
 * **Healthcare Context**:
 * - Medication administration confirmation
 * - Health record details view
 * - Patient consent forms
 * - Critical alert confirmations
 * - Medical code selection dialogs
 *
 * **Focus Trap**: Tab and Shift+Tab cycle through focusable elements within
 * the modal. Focus cannot escape to background content while modal is open.
 *
 * **Body Scroll Lock**: When modal opens, background scrolling is prevented
 * by setting document.body.style.overflow = 'hidden'. Restored on close.
 *
 * @see {@link ModalHeader} for modal header component
 * @see {@link ModalBody} for modal body component
 * @see {@link ModalFooter} for modal footer component
 * @see {@link ModalTitle} for modal title component
 */
const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({
    className,
    open,
    onClose,
    size = 'md',
    centered = true,
    closeOnBackdropClick = true,
    closeOnEscapeKey = true,
    showCloseButton = true,
    children,
    ...props
  }, ref) => {
    const modalRef = React.useRef<HTMLDivElement>(null);

    // Handle escape key
    React.useEffect(() => {
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
    React.useEffect(() => {
      if (!open) return;

      const previousActiveElement = document.activeElement as HTMLElement;
      const modal = modalRef.current;

      if (modal) {
        // Focus the modal or first focusable element
        const focusable = modal.querySelector('button, input, select, textarea, [tabindex]:not([tabindex="-1"])') as HTMLElement;
        if (focusable) {
          focusable.focus();
        } else {
          modal.focus();
        }

        // Focus trap implementation
        const handleKeyDown = (e: KeyboardEvent) => {
          if (e.key !== 'Tab') return;

          const focusableElements = modal.querySelectorAll<HTMLElement>(
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
          // Restore focus when modal closes
          if (previousActiveElement) {
            previousActiveElement.focus();
          }
        };
      }

      return () => {
        // Restore focus when modal closes
        if (previousActiveElement) {
          previousActiveElement.focus();
        }
      };
    }, [open]);

    // Prevent body scroll when modal is open
    React.useEffect(() => {
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

    const sizeClasses = {
      sm: 'max-w-md',
      md: 'max-w-lg',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl',
      full: 'max-w-full mx-4'
    };

    const handleBackdropClick = (event: React.MouseEvent) => {
      if (closeOnBackdropClick && event.target === event.currentTarget) {
        onClose?.();
      }
    };

    return (
      <div
        className="fixed inset-0 z-50 overflow-y-auto"
        aria-labelledby="modal-title"
        aria-modal="true"
        role="dialog"
      >
        {/* Backdrop */}
        <div
          className={cn(
            'fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 transition-opacity',
            centered ? 'flex items-center justify-center p-4' : 'pt-16 pb-4'
          )}
          onClick={handleBackdropClick}
        >
          {/* Modal */}
          <div
            ref={ref || modalRef}
            className={cn(
              'relative bg-white dark:bg-gray-800 rounded-lg shadow-xl transform transition-all w-full',
              sizeClasses[size],
              !centered && 'mx-auto',
              className
            )}
            onClick={(e) => e.stopPropagation()}
            tabIndex={-1}
            {...props}
          >
            {showCloseButton && (
              <button
                type="button"
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 rounded-md p-1"
                onClick={onClose}
                aria-label="Close modal"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            {children}
          </div>
        </div>
      </div>
    );
  }
);

/**
 * Modal content wrapper component (optional).
 *
 * Provides a wrapper for modal content with relative positioning.
 * Generally optional as children can be placed directly in Modal.
 *
 * @component
 * @param {ModalContentProps} props - Modal content props
 * @param {React.Ref<HTMLDivElement>} ref - Forwarded ref to content element
 * @returns {JSX.Element} Rendered modal content wrapper
 */
const ModalContent = React.forwardRef<HTMLDivElement, ModalContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('relative', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

/**
 * Modal header component for title and close button area.
 *
 * Standard header section with optional bottom divider. Typically contains
 * ModalTitle component and close button is positioned absolutely over it.
 *
 * **Features:**
 * - Padding (px-6 py-4)
 * - Optional bottom border divider
 * - Dark mode support
 *
 * @component
 * @param {ModalHeaderProps} props - Modal header props
 * @param {React.Ref<HTMLDivElement>} ref - Forwarded ref to header element
 * @returns {JSX.Element} Rendered modal header
 *
 * @example
 * ```tsx
 * <ModalHeader>
 *   <ModalTitle>Edit Patient Information</ModalTitle>
 * </ModalHeader>
 * ```
 *
 * @see {@link ModalTitle} for modal title component
 */
const ModalHeader = React.forwardRef<HTMLDivElement, ModalHeaderProps>(
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
 * Modal body component for main content area.
 *
 * Main content section of the modal with consistent padding.
 * Contains forms, text, tables, or any modal content.
 *
 * **Features:**
 * - Padding (px-6 py-4)
 * - Scrollable if content overflows
 * - Dark mode support
 *
 * @component
 * @param {ModalBodyProps} props - Modal body props
 * @param {React.Ref<HTMLDivElement>} ref - Forwarded ref to body element
 * @returns {JSX.Element} Rendered modal body
 *
 * @example
 * ```tsx
 * <ModalBody>
 *   <p>Are you sure you want to delete this health record?</p>
 *   <p className="text-sm text-gray-500">This action cannot be undone.</p>
 * </ModalBody>
 * ```
 */
const ModalBody = React.forwardRef<HTMLDivElement, ModalBodyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('px-6 py-4', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

/**
 * Modal footer component for action buttons.
 *
 * Footer section with optional top divider. Typically contains action buttons
 * aligned to the right (Cancel, Submit, Save, etc.).
 *
 * **Features:**
 * - Padding (px-6 py-4)
 * - Flex layout with right alignment
 * - Horizontal spacing between buttons (space-x-3)
 * - Optional top border divider
 * - Dark mode support
 *
 * @component
 * @param {ModalFooterProps} props - Modal footer props
 * @param {React.Ref<HTMLDivElement>} ref - Forwarded ref to footer element
 * @returns {JSX.Element} Rendered modal footer
 *
 * @example
 * ```tsx
 * <ModalFooter>
 *   <Button variant="outline" onClick={onCancel}>Cancel</Button>
 *   <Button variant="danger" onClick={onDelete}>Delete</Button>
 * </ModalFooter>
 * ```
 */
const ModalFooter = React.forwardRef<HTMLDivElement, ModalFooterProps>(
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
 * Modal title component (h2 heading).
 *
 * Semantic heading for the modal title. Automatically uses id="modal-title"
 * which is referenced by Modal's aria-labelledby for accessibility.
 *
 * **Features:**
 * - Semantic h2 heading
 * - Large semibold text (text-lg font-semibold)
 * - Dark mode support
 * - Accessible via aria-labelledby
 *
 * @component
 * @param {ModalTitleProps} props - Modal title props
 * @param {React.Ref<HTMLHeadingElement>} ref - Forwarded ref to heading element
 * @returns {JSX.Element} Rendered modal title heading
 *
 * @example
 * ```tsx
 * <ModalTitle>Confirm Medication Administration</ModalTitle>
 * ```
 *
 * @see {@link ModalHeader} for containing header component
 */
const ModalTitle = React.forwardRef<HTMLHeadingElement, ModalTitleProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h2
        ref={ref}
        id="modal-title"
        className={cn('text-lg font-semibold text-gray-900 dark:text-gray-100', className)}
        {...props}
      >
        {children}
      </h2>
    );
  }
);

Modal.displayName = 'Modal';
ModalContent.displayName = 'ModalContent';
ModalHeader.displayName = 'ModalHeader';
ModalBody.displayName = 'ModalBody';
ModalFooter.displayName = 'ModalFooter';
ModalTitle.displayName = 'ModalTitle';

export { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter, 
  ModalTitle,
  type ModalProps,
  type ModalContentProps,
  type ModalHeaderProps,
  type ModalBodyProps,
  type ModalFooterProps,
  type ModalTitleProps
};
