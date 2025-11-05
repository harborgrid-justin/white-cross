import { useEffect, useRef, RefObject } from 'react';

/**
 * Focus Trap Hook - WCAG 2.1 AA Compliant
 *
 * Traps keyboard focus within a container element (e.g., modal dialog).
 * Implements WCAG 2.4.3 Focus Order and 2.1.2 No Keyboard Trap.
 *
 * Features:
 * - Traps Tab and Shift+Tab within container
 * - Returns focus to trigger element on unmount
 * - Focuses initial element on mount
 * - Handles dynamic content changes
 * - Supports Escape key to close
 *
 * @module hooks/accessibility/useFocusTrap
 *
 * @example
 * ```tsx
 * function Modal({ isOpen, onClose }) {
 *   const containerRef = useRef<HTMLDivElement>(null);
 *   const returnFocusRef = useFocusTrap({
 *     isActive: isOpen,
 *     containerRef,
 *     initialFocusRef: primaryButtonRef,
 *     onEscape: onClose,
 *   });
 *
 *   return (
 *     <div ref={containerRef} role="dialog" aria-modal="true">
 *       <button ref={primaryButtonRef}>Primary Action</button>
 *     </div>
 *   );
 * }
 * ```
 */

export interface UseFocusTrapOptions {
  /** Whether the focus trap is active */
  isActive: boolean;
  /** Ref to the container element that should trap focus */
  containerRef: RefObject<HTMLElement>;
  /** Optional ref to element that should receive initial focus */
  initialFocusRef?: RefObject<HTMLElement>;
  /** Callback when Escape key is pressed */
  onEscape?: () => void;
  /** Whether to return focus to previous element on deactivation (default: true) */
  returnFocus?: boolean;
}

/**
 * Custom hook to trap focus within a container element
 */
export function useFocusTrap({
  isActive,
  containerRef,
  initialFocusRef,
  onEscape,
  returnFocus = true,
}: UseFocusTrapOptions): RefObject<HTMLElement | null> {
  // Store the element that had focus before trap activated
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;

    // Store currently focused element to return focus later
    if (returnFocus && document.activeElement instanceof HTMLElement) {
      previouslyFocusedElement.current = document.activeElement;
    }

    // Get all focusable elements within container
    const getFocusableElements = (): HTMLElement[] => {
      const focusableSelectors = [
        'a[href]',
        'button:not([disabled])',
        'textarea:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
      ].join(', ');

      const elements = container.querySelectorAll<HTMLElement>(focusableSelectors);
      return Array.from(elements).filter((el) => {
        // Filter out hidden elements
        return (
          el.offsetParent !== null &&
          !el.hasAttribute('aria-hidden') &&
          window.getComputedStyle(el).visibility !== 'hidden'
        );
      });
    };

    // Focus initial element or first focusable element
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      const initialElement = initialFocusRef?.current || focusableElements[0];
      if (initialElement) {
        // Use setTimeout to ensure element is rendered and focusable
        setTimeout(() => initialElement.focus(), 0);
      }
    }

    // Handle keyboard events for focus trap
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle Escape key
      if (e.key === 'Escape' && onEscape) {
        e.preventDefault();
        onEscape();
        return;
      }

      // Handle Tab key for focus trap
      if (e.key === 'Tab') {
        const focusableElements = getFocusableElements();

        if (focusableElements.length === 0) {
          e.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        const activeElement = document.activeElement;

        // Shift+Tab on first element -> focus last element
        if (e.shiftKey && activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
          return;
        }

        // Tab on last element -> focus first element
        if (!e.shiftKey && activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
          return;
        }
      }
    };

    // Add event listener to container
    container.addEventListener('keydown', handleKeyDown);

    // Cleanup function
    return () => {
      container.removeEventListener('keydown', handleKeyDown);

      // Return focus to previously focused element
      if (returnFocus && previouslyFocusedElement.current) {
        // Use setTimeout to ensure modal is unmounted first
        setTimeout(() => {
          previouslyFocusedElement.current?.focus();
        }, 0);
      }
    };
  }, [isActive, containerRef, initialFocusRef, onEscape, returnFocus]);

  return previouslyFocusedElement;
}
