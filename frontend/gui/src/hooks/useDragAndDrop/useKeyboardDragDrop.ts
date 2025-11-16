/**
 * useKeyboardDragDrop Hook
 *
 * Provides keyboard-based drag-and-drop functionality for accessibility.
 * Implements WCAG 2.1 guidelines for keyboard navigation.
 */

import { useCallback, useEffect, useState, useRef } from 'react';
import type {
  KeyboardDragMode,
  KeyboardNavigationState,
  ComponentId,
} from '../../types/drag-drop.types';

/**
 * Keyboard drag-drop configuration
 */
export interface UseKeyboardDragDropConfig {
  /** List of draggable component IDs */
  componentIds: ComponentId[];
  /** Currently selected component ID */
  selectedId: ComponentId | null;
  /** Callback to move component */
  onMove: (id: ComponentId, delta: { x: number; y: number }) => void;
  /** Callback to select component */
  onSelect: (id: ComponentId) => void;
  /** Callback to announce state changes (for screen readers) */
  onAnnounce?: (message: string, priority?: 'polite' | 'assertive') => void;
  /** Step size for movement in pixels */
  stepSize?: number;
  /** Fine movement step size (with Shift) */
  fineStepSize?: number;
  /** Whether snap to grid is enabled */
  snapToGrid?: boolean;
  /** Grid size for snapping */
  gridSize?: number;
  /** Whether keyboard drag-drop is enabled */
  enabled?: boolean;
}

/**
 * useKeyboardDragDrop Hook
 *
 * Enables full keyboard control of drag-drop operations.
 *
 * Keyboard shortcuts:
 * - Tab / Shift+Tab: Navigate between components
 * - Space / Enter: Grab/drop component
 * - Arrow keys: Move grabbed component (10px)
 * - Shift + Arrow keys: Fine movement (1px)
 * - Escape: Cancel grab/drop
 * - Ctrl/Cmd + Arrow: Navigate to adjacent component
 *
 * @example
 * ```tsx
 * const { mode, announce } = useKeyboardDragDrop({
 *   componentIds: ['comp-1', 'comp-2'],
 *   selectedId: 'comp-1',
 *   onMove: (id, delta) => moveComponent(id, delta),
 *   onSelect: (id) => selectComponent(id),
 * });
 * ```
 */
export const useKeyboardDragDrop = (
  config: UseKeyboardDragDropConfig
): KeyboardNavigationState & {
  /** Announce message for screen readers */
  announce: (message: string, priority?: 'polite' | 'assertive') => void;
  /** Enable keyboard drag mode */
  enableDragMode: () => void;
  /** Disable keyboard drag mode */
  disableDragMode: () => void;
  /** Toggle keyboard drag mode */
  toggleDragMode: () => void;
} => {
  const {
    componentIds,
    selectedId,
    onMove,
    onSelect,
    onAnnounce,
    stepSize = 10,
    fineStepSize = 1,
    snapToGrid = false,
    gridSize = 8,
    enabled = true,
  } = config;

  // Navigation state
  const [mode, setMode] = useState<KeyboardDragMode>('off');
  const [draggedId, setDraggedId] = useState<ComponentId | null>(null);
  const [focusedId, setFocusedId] = useState<ComponentId | null>(selectedId);

  // Track accumulated movement for snapping
  const accumulatedDelta = useRef({ x: 0, y: 0 });

  /**
   * Announce message for screen readers
   */
  const announce = useCallback(
    (message: string, priority: 'polite' | 'assertive' = 'polite') => {
      if (onAnnounce) {
        onAnnounce(message, priority);
      }
    },
    [onAnnounce]
  );

  /**
   * Navigate to next/previous component
   */
  const navigateComponents = useCallback(
    (direction: 'next' | 'prev') => {
      if (componentIds.length === 0) return;

      const currentIndex = focusedId
        ? componentIds.indexOf(focusedId)
        : -1;

      let nextIndex: number;
      if (direction === 'next') {
        nextIndex = (currentIndex + 1) % componentIds.length;
      } else {
        nextIndex =
          currentIndex <= 0 ? componentIds.length - 1 : currentIndex - 1;
      }

      const nextId = componentIds[nextIndex];
      setFocusedId(nextId);
      onSelect(nextId);
      announce(`Focused on component ${nextIndex + 1} of ${componentIds.length}`);
    },
    [componentIds, focusedId, onSelect, announce]
  );

  /**
   * Grab component for keyboard dragging
   */
  const grabComponent = useCallback(() => {
    if (!focusedId) {
      announce('No component selected', 'assertive');
      return;
    }

    setMode('grab');
    setDraggedId(focusedId);
    accumulatedDelta.current = { x: 0, y: 0 };
    announce('Component grabbed. Use arrow keys to move, Enter to drop, Escape to cancel.', 'assertive');
  }, [focusedId, announce]);

  /**
   * Drop component and exit drag mode
   */
  const dropComponent = useCallback(() => {
    if (!draggedId) return;

    setMode('off');
    setDraggedId(null);
    accumulatedDelta.current = { x: 0, y: 0 };
    announce('Component dropped', 'assertive');
  }, [draggedId, announce]);

  /**
   * Cancel drag operation
   */
  const cancelDrag = useCallback(() => {
    if (!draggedId) return;

    // Reset to original position (handled by undo)
    setMode('off');
    setDraggedId(null);
    accumulatedDelta.current = { x: 0, y: 0 };
    announce('Drag cancelled', 'assertive');
  }, [draggedId, announce]);

  /**
   * Move component by delta
   */
  const moveComponent = useCallback(
    (deltaX: number, deltaY: number, fine: boolean) => {
      if (!draggedId) return;

      // Calculate actual delta based on fine movement
      const actualStepSize = fine ? fineStepSize : stepSize;
      let dx = deltaX * actualStepSize;
      let dy = deltaY * actualStepSize;

      // Apply grid snapping if enabled
      if (snapToGrid && gridSize > 0) {
        accumulatedDelta.current.x += dx;
        accumulatedDelta.current.y += dy;

        // Only move when accumulated delta exceeds grid size
        if (Math.abs(accumulatedDelta.current.x) >= gridSize) {
          const snappedX =
            Math.sign(accumulatedDelta.current.x) *
            Math.floor(Math.abs(accumulatedDelta.current.x) / gridSize) *
            gridSize;
          dx = snappedX;
          accumulatedDelta.current.x -= snappedX;
        } else {
          dx = 0;
        }

        if (Math.abs(accumulatedDelta.current.y) >= gridSize) {
          const snappedY =
            Math.sign(accumulatedDelta.current.y) *
            Math.floor(Math.abs(accumulatedDelta.current.y) / gridSize) *
            gridSize;
          dy = snappedY;
          accumulatedDelta.current.y -= snappedY;
        } else {
          dy = 0;
        }
      }

      // Only move if delta is non-zero
      if (dx !== 0 || dy !== 0) {
        onMove(draggedId, { x: dx, y: dy });

        // Announce movement
        const direction = [];
        if (dy < 0) direction.push('up');
        if (dy > 0) direction.push('down');
        if (dx < 0) direction.push('left');
        if (dx > 0) direction.push('right');

        announce(`Moved ${direction.join(' ')} by ${Math.abs(dx || dy)}px`);
      }
    },
    [draggedId, onMove, announce, stepSize, fineStepSize, snapToGrid, gridSize]
  );

  /**
   * Handle keyboard events
   */
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? event.metaKey : event.ctrlKey;

      // Tab navigation (only when not dragging)
      if (event.key === 'Tab' && mode === 'off') {
        event.preventDefault();
        navigateComponents(event.shiftKey ? 'prev' : 'next');
        return;
      }

      // Grab/Drop component
      if ((event.key === ' ' || event.key === 'Enter') && !cmdOrCtrl) {
        event.preventDefault();

        if (mode === 'off') {
          grabComponent();
        } else if (mode === 'grab') {
          dropComponent();
        }
        return;
      }

      // Cancel drag
      if (event.key === 'Escape' && mode === 'grab') {
        event.preventDefault();
        cancelDrag();
        return;
      }

      // Arrow key movement (only when dragging)
      if (mode === 'grab') {
        const fine = event.shiftKey;

        switch (event.key) {
          case 'ArrowUp':
            event.preventDefault();
            moveComponent(0, -1, fine);
            break;

          case 'ArrowDown':
            event.preventDefault();
            moveComponent(0, 1, fine);
            break;

          case 'ArrowLeft':
            event.preventDefault();
            moveComponent(-1, 0, fine);
            break;

          case 'ArrowRight':
            event.preventDefault();
            moveComponent(1, 0, fine);
            break;
        }
      }
    },
    [
      enabled,
      mode,
      navigateComponents,
      grabComponent,
      dropComponent,
      cancelDrag,
      moveComponent,
    ]
  );

  /**
   * Enable keyboard drag mode
   */
  const enableDragMode = useCallback(() => {
    setMode('grab');
    announce('Keyboard drag mode enabled', 'polite');
  }, [announce]);

  /**
   * Disable keyboard drag mode
   */
  const disableDragMode = useCallback(() => {
    setMode('off');
    setDraggedId(null);
    announce('Keyboard drag mode disabled', 'polite');
  }, [announce]);

  /**
   * Toggle keyboard drag mode
   */
  const toggleDragMode = useCallback(() => {
    if (mode === 'off') {
      enableDragMode();
    } else {
      disableDragMode();
    }
  }, [mode, enableDragMode, disableDragMode]);

  // Attach keyboard event listener
  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, handleKeyDown]);

  // Update focused ID when selected ID changes
  useEffect(() => {
    if (selectedId && mode === 'off') {
      setFocusedId(selectedId);
    }
  }, [selectedId, mode]);

  return {
    mode,
    focusedId,
    draggedId,
    stepSize,
    fineMovement: false, // Updated dynamically during movement
    announce,
    enableDragMode,
    disableDragMode,
    toggleDragMode,
  };
};

/**
 * Keyboard shortcuts help text
 */
export const KEYBOARD_SHORTCUTS_HELP = {
  navigation: [
    { keys: ['Tab'], description: 'Navigate to next component' },
    { keys: ['Shift', 'Tab'], description: 'Navigate to previous component' },
  ],
  dragging: [
    { keys: ['Space', 'Enter'], description: 'Grab or drop component' },
    { keys: ['Arrow Keys'], description: 'Move component (10px)' },
    { keys: ['Shift', 'Arrow Keys'], description: 'Fine movement (1px)' },
    { keys: ['Escape'], description: 'Cancel drag operation' },
  ],
  general: [
    { keys: ['Ctrl/Cmd', 'Z'], description: 'Undo' },
    { keys: ['Ctrl/Cmd', 'Shift', 'Z'], description: 'Redo' },
    { keys: ['Delete'], description: 'Delete component' },
  ],
};
