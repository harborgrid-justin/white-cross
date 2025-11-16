/**
 * Custom hooks for the Page Builder
 *
 * These hooks provide convenient access to the Zustand store and derived state.
 * All hooks are optimized for performance with proper memoization and shallow comparison.
 */

import { useCallback, useMemo } from 'react';
import { shallow } from 'zustand/shallow';
import { usePageBuilderStore } from '../store';
import {
  selectSelectedComponents,
  selectCanvasSelectionState,
  selectCanUndo,
  selectCanRedo,
  selectPreview,
  selectViewport,
  selectGrid,
} from '../store/selectors';
import type { ComponentId, ComponentInstance } from '../types';

// ============================================================================
// COMPONENT HOOKS
// ============================================================================

/**
 * Hook to add a component to the canvas
 * Returns stable reference (doesn't change between renders)
 */
export const useAddComponent = () => {
  return usePageBuilderStore((state) => state.addComponent);
};

/**
 * Hook to update a component
 * Returns stable reference (doesn't change between renders)
 */
export const useUpdateComponent = () => {
  return usePageBuilderStore((state) => state.updateComponent);
};

/**
 * Hook to delete a component
 * Returns stable reference (doesn't change between renders)
 */
export const useDeleteComponent = () => {
  return usePageBuilderStore((state) => state.deleteComponent);
};

/**
 * Hook to move a component
 * Returns stable reference (doesn't change between renders)
 */
export const useMoveComponent = () => {
  return usePageBuilderStore((state) => state.moveComponent);
};

/**
 * Hook to duplicate a component
 * Returns stable reference (doesn't change between renders)
 */
export const useDuplicateComponent = () => {
  return usePageBuilderStore((state) => state.duplicateComponent);
};

// ============================================================================
// SELECTION HOOKS
// ============================================================================

/**
 * Hook to get current selection state
 * Uses shallow comparison to prevent unnecessary re-renders
 */
export const useSelection = () => {
  return usePageBuilderStore(selectCanvasSelectionState, shallow);
};

/**
 * Hook to select a component
 * Returns stable reference (doesn't change between renders)
 */
export const useSelectComponent = () => {
  return usePageBuilderStore((state) => state.selectComponent);
};

/**
 * Hook to get selected component instances
 * Uses optimized selector with shallow comparison
 */
export const useSelectedComponents = () => {
  return usePageBuilderStore(selectSelectedComponents, shallow);
};

// ============================================================================
// CLIPBOARD HOOKS
// ============================================================================

/**
 * Hook to get copy/paste actions
 * Returns stable references for all actions
 */
export const useCopyPaste = () => {
  const copy = usePageBuilderStore((state) => state.copy);
  const cut = usePageBuilderStore((state) => state.cut);
  const paste = usePageBuilderStore((state) => state.paste);

  return useMemo(() => ({ copy, cut, paste }), [copy, cut, paste]);
};

// ============================================================================
// HISTORY HOOKS
// ============================================================================

/**
 * Hook to get undo/redo actions and availability
 * Uses optimized selectors for can undo/redo checks
 */
export const useHistory = () => {
  const undo = usePageBuilderStore((state) => state.undo);
  const redo = usePageBuilderStore((state) => state.redo);
  const canUndo = usePageBuilderStore(selectCanUndo);
  const canRedo = usePageBuilderStore(selectCanRedo);

  return useMemo(
    () => ({ undo, redo, canUndo, canRedo }),
    [undo, redo, canUndo, canRedo]
  );
};

/**
 * Hook to get undo action
 * Returns stable reference
 */
export const useUndo = () => {
  return usePageBuilderStore((state) => state.undo);
};

/**
 * Hook to get redo action
 * Returns stable reference
 */
export const useRedo = () => {
  return usePageBuilderStore((state) => state.redo);
};

// ============================================================================
// PREVIEW HOOKS
// ============================================================================

/**
 * Hook to get preview state and actions
 * Uses optimized selector with shallow comparison
 */
export const usePreview = () => {
  const previewState = usePageBuilderStore(selectPreview, shallow);
  const togglePreview = usePageBuilderStore((state) => state.togglePreview);
  const setDevice = usePageBuilderStore((state) => state.setDevice);
  const setOrientation = usePageBuilderStore((state) => state.setOrientation);

  return useMemo(
    () => ({
      ...previewState,
      togglePreview,
      setDevice,
      setOrientation,
    }),
    [previewState, togglePreview, setDevice, setOrientation]
  );
};

// ============================================================================
// VIEWPORT HOOKS
// ============================================================================

/**
 * Hook to get viewport state and actions
 * Uses optimized selector with shallow comparison
 */
export const useViewport = () => {
  const viewportState = usePageBuilderStore(selectViewport, shallow);
  const setZoom = usePageBuilderStore((state) => state.setZoom);
  const setPan = usePageBuilderStore((state) => state.setPan);
  const resetViewport = usePageBuilderStore((state) => state.resetViewport);

  return useMemo(
    () => ({
      ...viewportState,
      setZoom,
      setPan,
      resetViewport,
    }),
    [viewportState, setZoom, setPan, resetViewport]
  );
};

// ============================================================================
// GRID HOOKS
// ============================================================================

/**
 * Hook to get grid state and actions
 * Uses optimized selector with shallow comparison
 */
export const useGrid = () => {
  const gridState = usePageBuilderStore(selectGrid, shallow);
  const toggleGrid = usePageBuilderStore((state) => state.toggleGrid);
  const setGridSize = usePageBuilderStore((state) => state.setGridSize);
  const toggleSnapToGrid = usePageBuilderStore((state) => state.toggleSnapToGrid);

  return useMemo(
    () => ({
      ...gridState,
      toggleGrid,
      setGridSize,
      toggleSnapToGrid,
    }),
    [gridState, toggleGrid, setGridSize, toggleSnapToGrid]
  );
};

// ============================================================================
// KEYBOARD SHORTCUTS HOOK
// ============================================================================

export const useKeyboardShortcuts = () => {
  const { undo, redo } = useHistory();
  const { copy, cut, paste } = useCopyPaste();
  const deleteComponent = useDeleteComponent();
  const { selectedIds } = useSelection();

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? event.metaKey : event.ctrlKey;

      // Undo: Cmd+Z / Ctrl+Z
      if (cmdOrCtrl && event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        undo();
        return;
      }

      // Redo: Cmd+Shift+Z / Ctrl+Shift+Z
      if (cmdOrCtrl && event.key === 'z' && event.shiftKey) {
        event.preventDefault();
        redo();
        return;
      }

      // Copy: Cmd+C / Ctrl+C
      if (cmdOrCtrl && event.key === 'c') {
        event.preventDefault();
        copy();
        return;
      }

      // Cut: Cmd+X / Ctrl+X
      if (cmdOrCtrl && event.key === 'x') {
        event.preventDefault();
        cut();
        return;
      }

      // Paste: Cmd+V / Ctrl+V
      if (cmdOrCtrl && event.key === 'v') {
        event.preventDefault();
        paste();
        return;
      }

      // Delete: Delete / Backspace
      if (event.key === 'Delete' || event.key === 'Backspace') {
        event.preventDefault();
        selectedIds.forEach((id) => deleteComponent(id));
        return;
      }
    },
    [undo, redo, copy, cut, paste, deleteComponent, selectedIds]
  );

  return handleKeyDown;
};
