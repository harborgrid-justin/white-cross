/**
 * Custom hooks for the Page Builder
 *
 * These hooks provide convenient access to the Zustand store and derived state.
 */

import { useCallback } from 'react';
import { usePageBuilderStore } from '../store';
import type { ComponentId, ComponentInstance } from '../types';

// ============================================================================
// COMPONENT HOOKS
// ============================================================================

export const useAddComponent = () => {
  return usePageBuilderStore((state) => state.addComponent);
};

export const useUpdateComponent = () => {
  return usePageBuilderStore((state) => state.updateComponent);
};

export const useDeleteComponent = () => {
  return usePageBuilderStore((state) => state.deleteComponent);
};

export const useMoveComponent = () => {
  return usePageBuilderStore((state) => state.moveComponent);
};

export const useDuplicateComponent = () => {
  return usePageBuilderStore((state) => state.duplicateComponent);
};

// ============================================================================
// SELECTION HOOKS
// ============================================================================

export const useSelection = () => {
  return usePageBuilderStore((state) => ({
    selectedIds: state.selection.selectedIds,
    hoveredId: state.selection.hoveredId,
    focusedId: state.selection.focusedId,
  }));
};

export const useSelectComponent = () => {
  return usePageBuilderStore((state) => state.selectComponent);
};

export const useSelectedComponents = () => {
  return usePageBuilderStore((state) =>
    state.selection.selectedIds.map((id) => state.canvas.components.byId[id]).filter(Boolean)
  );
};

// ============================================================================
// CLIPBOARD HOOKS
// ============================================================================

export const useCopyPaste = () => {
  const copy = usePageBuilderStore((state) => state.copy);
  const cut = usePageBuilderStore((state) => state.cut);
  const paste = usePageBuilderStore((state) => state.paste);

  return { copy, cut, paste };
};

// ============================================================================
// HISTORY HOOKS
// ============================================================================

export const useHistory = () => {
  const undo = usePageBuilderStore((state) => state.undo);
  const redo = usePageBuilderStore((state) => state.redo);
  const canUndo = usePageBuilderStore((state) => state.history.past.length > 0);
  const canRedo = usePageBuilderStore((state) => state.history.future.length > 0);

  return { undo, redo, canUndo, canRedo };
};

export const useUndo = () => {
  return usePageBuilderStore((state) => state.undo);
};

export const useRedo = () => {
  return usePageBuilderStore((state) => state.redo);
};

// ============================================================================
// PREVIEW HOOKS
// ============================================================================

export const usePreview = () => {
  return usePageBuilderStore((state) => ({
    isPreviewMode: state.preview.isPreviewMode,
    device: state.preview.device,
    orientation: state.preview.orientation,
    togglePreview: state.togglePreview,
    setDevice: state.setDevice,
    setOrientation: state.setOrientation,
  }));
};

// ============================================================================
// VIEWPORT HOOKS
// ============================================================================

export const useViewport = () => {
  return usePageBuilderStore((state) => ({
    zoom: state.canvas.viewport.zoom,
    panX: state.canvas.viewport.panX,
    panY: state.canvas.viewport.panY,
    setZoom: state.setZoom,
    setPan: state.setPan,
    resetViewport: state.resetViewport,
  }));
};

// ============================================================================
// GRID HOOKS
// ============================================================================

export const useGrid = () => {
  return usePageBuilderStore((state) => ({
    enabled: state.canvas.grid.enabled,
    size: state.canvas.grid.size,
    snapToGrid: state.canvas.grid.snapToGrid,
    toggleGrid: state.toggleGrid,
    setGridSize: state.setGridSize,
    toggleSnapToGrid: state.toggleSnapToGrid,
  }));
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
