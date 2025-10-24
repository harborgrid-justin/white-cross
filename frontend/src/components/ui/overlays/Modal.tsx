import React from 'react';
import { cn } from '../../../utils/cn';

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose?: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  centered?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscapeKey?: boolean;
  showCloseButton?: boolean;
}

interface ModalContentProps extends React.HTMLAttributes<HTMLDivElement> {}

interface ModalHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  divider?: boolean;
}

interface ModalBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  divider?: boolean;
}

interface ModalTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

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
