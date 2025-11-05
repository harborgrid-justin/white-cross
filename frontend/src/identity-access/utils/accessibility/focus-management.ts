/**
 * Focus Management Utilities - WCAG 2.1 AA Compliant
 *
 * Provides utilities for managing keyboard focus programmatically.
 * Implements WCAG 2.4.3 Focus Order and 2.4.7 Focus Visible.
 *
 * Features:
 * - Get all focusable elements in a container
 * - Move focus to specific elements
 * - Focus first/last element
 * - Check focus visibility
 * - Save and restore focus
 *
 * @module utils/accessibility/focus-management
 *
 * @example
 * ```tsx
 * // Get all focusable elements
 * const elements = getFocusableElements(containerRef.current);
 *
 * // Focus first element
 * focusFirstElement(containerRef.current);
 *
 * // Save and restore focus
 * const restoreFocus = saveFocus();
 * // ... do something that moves focus
 * restoreFocus();
 * ```
 */

/**
 * Selector for all focusable elements
 */
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]:not([contenteditable="false"])',
  'details > summary',
].join(', ');

/**
 * Check if an element is visible and not hidden
 */
function isElementVisible(element: HTMLElement): boolean {
  // Check if element is hidden via CSS
  const style = window.getComputedStyle(element);
  if (style.display === 'none' || style.visibility === 'hidden') {
    return false;
  }

  // Check if element has dimensions
  if (element.offsetWidth === 0 && element.offsetHeight === 0) {
    return false;
  }

  // Check if element is aria-hidden
  if (element.hasAttribute('aria-hidden') && element.getAttribute('aria-hidden') === 'true') {
    return false;
  }

  // Check if element has hidden attribute
  if (element.hasAttribute('hidden')) {
    return false;
  }

  return true;
}

/**
 * Get all focusable elements within a container
 *
 * @param container - The container element to search within
 * @param includeContainer - Whether to include the container itself if focusable
 * @returns Array of focusable HTML elements
 */
export function getFocusableElements(
  container: HTMLElement | null,
  includeContainer = false
): HTMLElement[] {
  if (!container) return [];

  const elements = Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
  );

  // Filter out non-visible elements
  const visibleElements = elements.filter(isElementVisible);

  // Include container if requested and focusable
  if (
    includeContainer &&
    container.matches(FOCUSABLE_SELECTOR) &&
    isElementVisible(container)
  ) {
    visibleElements.unshift(container);
  }

  return visibleElements;
}

/**
 * Focus the first focusable element in a container
 *
 * @param container - The container element to search within
 * @returns Whether an element was successfully focused
 */
export function focusFirstElement(container: HTMLElement | null): boolean {
  const elements = getFocusableElements(container);
  if (elements.length > 0) {
    elements[0].focus();
    return true;
  }
  return false;
}

/**
 * Focus the last focusable element in a container
 *
 * @param container - The container element to search within
 * @returns Whether an element was successfully focused
 */
export function focusLastElement(container: HTMLElement | null): boolean {
  const elements = getFocusableElements(container);
  if (elements.length > 0) {
    elements[elements.length - 1].focus();
    return true;
  }
  return false;
}

/**
 * Focus a specific element with error handling
 *
 * @param element - The element to focus
 * @param options - Focus options (preventScroll, etc.)
 * @returns Whether the element was successfully focused
 */
export function focusElement(
  element: HTMLElement | null,
  options?: FocusOptions
): boolean {
  if (!element) return false;

  try {
    element.focus(options);
    return document.activeElement === element;
  } catch (error) {
    console.warn('Failed to focus element:', error);
    return false;
  }
}

/**
 * Get the currently focused element
 *
 * @returns The currently focused element or null
 */
export function getCurrentFocus(): HTMLElement | null {
  const activeElement = document.activeElement;
  return activeElement instanceof HTMLElement ? activeElement : null;
}

/**
 * Check if an element currently has focus
 *
 * @param element - The element to check
 * @returns Whether the element has focus
 */
export function hasFocus(element: HTMLElement | null): boolean {
  return element === document.activeElement;
}

/**
 * Save the currently focused element and return a function to restore it
 *
 * @returns Function to restore focus to the saved element
 *
 * @example
 * ```tsx
 * const restoreFocus = saveFocus();
 * // ... do something that changes focus
 * restoreFocus();
 * ```
 */
export function saveFocus(): () => void {
  const currentFocus = getCurrentFocus();

  return () => {
    if (currentFocus) {
      focusElement(currentFocus);
    }
  };
}

/**
 * Move focus to next focusable element
 *
 * @param currentElement - The currently focused element
 * @param container - Optional container to search within
 * @param loop - Whether to loop back to first element (default: true)
 * @returns Whether focus was successfully moved
 */
export function focusNextElement(
  currentElement: HTMLElement | null,
  container: HTMLElement | null = document.body,
  loop = true
): boolean {
  if (!currentElement) return false;

  const elements = getFocusableElements(container);
  const currentIndex = elements.indexOf(currentElement);

  if (currentIndex === -1) return false;

  const nextIndex = currentIndex + 1;

  if (nextIndex < elements.length) {
    elements[nextIndex].focus();
    return true;
  } else if (loop && elements.length > 0) {
    elements[0].focus();
    return true;
  }

  return false;
}

/**
 * Move focus to previous focusable element
 *
 * @param currentElement - The currently focused element
 * @param container - Optional container to search within
 * @param loop - Whether to loop back to last element (default: true)
 * @returns Whether focus was successfully moved
 */
export function focusPreviousElement(
  currentElement: HTMLElement | null,
  container: HTMLElement | null = document.body,
  loop = true
): boolean {
  if (!currentElement) return false;

  const elements = getFocusableElements(container);
  const currentIndex = elements.indexOf(currentElement);

  if (currentIndex === -1) return false;

  const previousIndex = currentIndex - 1;

  if (previousIndex >= 0) {
    elements[previousIndex].focus();
    return true;
  } else if (loop && elements.length > 0) {
    elements[elements.length - 1].focus();
    return true;
  }

  return false;
}

/**
 * Check if focus is currently visible (not hidden by :focus-visible)
 *
 * @returns Whether focus outline should be visible
 */
export function isFocusVisible(): boolean {
  // Check if :focus-visible is supported
  try {
    document.querySelector(':focus-visible');
    const activeElement = document.activeElement;
    if (activeElement) {
      return activeElement.matches(':focus-visible');
    }
  } catch {
    // :focus-visible not supported, assume focus should be visible
    return true;
  }
  return false;
}

/**
 * Create a focus trap scope for a container
 *
 * @param container - The container to trap focus within
 * @returns Object with methods to control the focus trap
 *
 * @example
 * ```tsx
 * const trap = createFocusTrap(modalRef.current);
 * trap.activate();
 * // ... later
 * trap.deactivate();
 * ```
 */
export function createFocusTrap(container: HTMLElement | null) {
  let isActive = false;
  let previousFocus: HTMLElement | null = null;

  const handleKeyDown = (event: KeyboardEvent) => {
    if (!isActive || event.key !== 'Tab') return;

    const elements = getFocusableElements(container);
    if (elements.length === 0) {
      event.preventDefault();
      return;
    }

    const firstElement = elements[0];
    const lastElement = elements[elements.length - 1];
    const activeElement = document.activeElement;

    if (event.shiftKey && activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  return {
    activate() {
      if (isActive) return;
      isActive = true;
      previousFocus = getCurrentFocus();
      document.addEventListener('keydown', handleKeyDown);
      focusFirstElement(container);
    },
    deactivate() {
      if (!isActive) return;
      isActive = false;
      document.removeEventListener('keydown', handleKeyDown);
      if (previousFocus) {
        focusElement(previousFocus);
      }
    },
    isActive() {
      return isActive;
    },
  };
}
