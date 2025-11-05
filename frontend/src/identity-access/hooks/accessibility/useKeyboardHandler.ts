import { useEffect, RefObject } from 'react';

/**
 * Keyboard Handler Hook - WCAG 2.1 AA Compliant
 *
 * Provides reusable keyboard event handling for interactive components.
 * Implements WCAG 2.1.1 Keyboard accessibility.
 *
 * Features:
 * - Support for common keyboard patterns (Enter, Space, Escape, Arrows)
 * - Configurable key mappings
 * - Prevent default behavior handling
 * - Event delegation support
 *
 * @module hooks/accessibility/useKeyboardHandler
 *
 * @example
 * ```tsx
 * function Dropdown({ isOpen, onToggle, onClose }) {
 *   const triggerRef = useRef<HTMLButtonElement>(null);
 *
 *   useKeyboardHandler({
 *     ref: triggerRef,
 *     keys: {
 *       Enter: onToggle,
 *       Space: onToggle,
 *       Escape: onClose,
 *       ArrowDown: () => focusFirstItem(),
 *     },
 *   });
 *
 *   return <button ref={triggerRef}>Toggle Dropdown</button>;
 * }
 * ```
 */

export type KeyboardKey =
  | 'Enter'
  | 'Space'
  | 'Escape'
  | 'ArrowUp'
  | 'ArrowDown'
  | 'ArrowLeft'
  | 'ArrowRight'
  | 'Home'
  | 'End'
  | 'Tab';

export interface UseKeyboardHandlerOptions {
  /** Ref to the element to attach keyboard handler */
  ref: RefObject<HTMLElement>;
  /** Map of keys to handler functions */
  keys: Partial<Record<KeyboardKey, (event: KeyboardEvent) => void>>;
  /** Whether the keyboard handler is active (default: true) */
  isActive?: boolean;
  /** Whether to prevent default behavior for handled keys (default: true) */
  preventDefault?: boolean;
  /** Whether to stop propagation for handled keys (default: false) */
  stopPropagation?: boolean;
}

/**
 * Custom hook for keyboard event handling
 */
export function useKeyboardHandler({
  ref,
  keys,
  isActive = true,
  preventDefault = true,
  stopPropagation = false,
}: UseKeyboardHandlerOptions): void {
  useEffect(() => {
    if (!isActive || !ref.current) return;

    const element = ref.current;

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key as KeyboardKey;
      const handler = keys[key];

      if (handler) {
        if (preventDefault) {
          event.preventDefault();
        }
        if (stopPropagation) {
          event.stopPropagation();
        }
        handler(event);
      }
    };

    element.addEventListener('keydown', handleKeyDown);

    return () => {
      element.removeEventListener('keydown', handleKeyDown);
    };
  }, [ref, keys, isActive, preventDefault, stopPropagation]);
}

/**
 * Hook for handling button-like keyboard interactions (Enter and Space)
 *
 * @example
 * ```tsx
 * function CustomButton({ onClick }) {
 *   const buttonRef = useRef<HTMLDivElement>(null);
 *   useButtonKeyboard(buttonRef, onClick);
 *
 *   return (
 *     <div ref={buttonRef} role="button" tabIndex={0}>
 *       Click me
 *     </div>
 *   );
 * }
 * ```
 */
export function useButtonKeyboard(
  ref: RefObject<HTMLElement>,
  onClick: () => void,
  isActive = true
): void {
  useKeyboardHandler({
    ref,
    keys: {
      Enter: onClick,
      Space: onClick,
    },
    isActive,
  });
}

/**
 * Hook for handling Escape key to close/dismiss components
 *
 * @example
 * ```tsx
 * function Modal({ isOpen, onClose }) {
 *   const modalRef = useRef<HTMLDivElement>(null);
 *   useEscapeKey(modalRef, onClose, isOpen);
 *
 *   return (
 *     <div ref={modalRef} role="dialog">
 *       Modal content
 *     </div>
 *   );
 * }
 * ```
 */
export function useEscapeKey(
  ref: RefObject<HTMLElement>,
  onEscape: () => void,
  isActive = true
): void {
  useKeyboardHandler({
    ref,
    keys: {
      Escape: onEscape,
    },
    isActive,
  });
}

/**
 * Hook for handling arrow key navigation
 *
 * @example
 * ```tsx
 * function Menu({ items }) {
 *   const menuRef = useRef<HTMLDivElement>(null);
 *   useArrowNavigation(menuRef, {
 *     onUp: () => focusPrevious(),
 *     onDown: () => focusNext(),
 *   });
 *
 *   return (
 *     <div ref={menuRef} role="menu">
 *       {items.map(item => <div role="menuitem">{item}</div>)}
 *     </div>
 *   );
 * }
 * ```
 */
export function useArrowNavigation(
  ref: RefObject<HTMLElement>,
  callbacks: {
    onUp?: () => void;
    onDown?: () => void;
    onLeft?: () => void;
    onRight?: () => void;
  },
  isActive = true
): void {
  useKeyboardHandler({
    ref,
    keys: {
      ArrowUp: callbacks.onUp || (() => {}),
      ArrowDown: callbacks.onDown || (() => {}),
      ArrowLeft: callbacks.onLeft || (() => {}),
      ArrowRight: callbacks.onRight || (() => {}),
    },
    isActive,
  });
}
