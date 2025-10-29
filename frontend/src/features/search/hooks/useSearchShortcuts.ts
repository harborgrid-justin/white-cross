/**
 * useSearchShortcuts Hook
 *
 * Keyboard shortcuts for search functionality
 */

'use client';

import { useEffect, useCallback, useRef } from 'react';

export interface SearchShortcuts {
  openSearch: string; // Default: 'Cmd/Ctrl+K'
  closeSearch: string; // Default: 'Escape'
  nextResult: string; // Default: 'ArrowDown'
  previousResult: string; // Default: 'ArrowUp'
  selectResult: string; // Default: 'Enter'
  clearSearch: string; // Default: 'Cmd/Ctrl+Backspace'
}

export interface UseSearchShortcutsOptions {
  onOpenSearch?: () => void;
  onCloseSearch?: () => void;
  onNextResult?: () => void;
  onPreviousResult?: () => void;
  onSelectResult?: () => void;
  onClearSearch?: () => void;
  enabled?: boolean;
  shortcuts?: Partial<SearchShortcuts>;
}

const DEFAULT_SHORTCUTS: SearchShortcuts = {
  openSearch: 'k',
  closeSearch: 'Escape',
  nextResult: 'ArrowDown',
  previousResult: 'ArrowUp',
  selectResult: 'Enter',
  clearSearch: 'Backspace',
};

/**
 * Hook for search keyboard shortcuts
 */
export function useSearchShortcuts(options: UseSearchShortcutsOptions = {}) {
  const {
    onOpenSearch,
    onCloseSearch,
    onNextResult,
    onPreviousResult,
    onSelectResult,
    onClearSearch,
    enabled = true,
    shortcuts = {},
  } = options;

  const activeShortcuts = { ...DEFAULT_SHORTCUTS, ...shortcuts };
  const handlersRef = useRef({ onOpenSearch, onCloseSearch, onNextResult, onPreviousResult, onSelectResult, onClearSearch });

  // Update handlers ref
  useEffect(() => {
    handlersRef.current = { onOpenSearch, onCloseSearch, onNextResult, onPreviousResult, onSelectResult, onClearSearch };
  }, [onOpenSearch, onCloseSearch, onNextResult, onPreviousResult, onSelectResult, onClearSearch]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modKey = isMac ? event.metaKey : event.ctrlKey;

      // Open search (Cmd/Ctrl+K)
      if (modKey && event.key === activeShortcuts.openSearch) {
        event.preventDefault();
        handlersRef.current.onOpenSearch?.();
        return;
      }

      // Close search (Escape)
      if (event.key === activeShortcuts.closeSearch) {
        handlersRef.current.onCloseSearch?.();
        return;
      }

      // Next result (ArrowDown)
      if (event.key === activeShortcuts.nextResult) {
        event.preventDefault();
        handlersRef.current.onNextResult?.();
        return;
      }

      // Previous result (ArrowUp)
      if (event.key === activeShortcuts.previousResult) {
        event.preventDefault();
        handlersRef.current.onPreviousResult?.();
        return;
      }

      // Select result (Enter)
      if (event.key === activeShortcuts.selectResult) {
        handlersRef.current.onSelectResult?.();
        return;
      }

      // Clear search (Cmd/Ctrl+Backspace)
      if (modKey && event.key === activeShortcuts.clearSearch) {
        event.preventDefault();
        handlersRef.current.onClearSearch?.();
        return;
      }
    },
    [activeShortcuts]
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, handleKeyDown]);

  return {
    shortcuts: activeShortcuts,
    enabled,
  };
}

/**
 * Hook for focus trap (for modal search)
 */
export function useFocusTrap(enabled: boolean = true) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        // Shift+Tab: Focus last element when on first
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab: Focus first element when on last
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);

    // Focus first element on mount
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, [enabled]);

  return containerRef;
}
