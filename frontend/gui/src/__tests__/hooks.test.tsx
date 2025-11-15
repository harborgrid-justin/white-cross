/**
 * Custom Hooks Tests
 *
 * Comprehensive tests for all custom hooks in the page builder.
 * Uses renderHook from @testing-library/react for hook testing.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import {
  useAddComponent,
  useUpdateComponent,
  useDeleteComponent,
  useMoveComponent,
  useDuplicateComponent,
  useSelection,
  useSelectComponent,
  useSelectedComponents,
  useCopyPaste,
  useHistory,
  useUndo,
  useRedo,
  usePreview,
  useViewport,
  useGrid,
  useKeyboardShortcuts,
} from '../hooks/usePageBuilder';
import { usePageBuilderStore } from '../store';
import type { ComponentInstance } from '../types';

describe('Custom Hooks', () => {
  beforeEach(() => {
    // Reset store before each test
    const { reset } = usePageBuilderStore.getState();
    reset();
  });

  // ==========================================================================
  // COMPONENT HOOKS
  // ==========================================================================

  describe('useAddComponent', () => {
    it('should return addComponent function', () => {
      const { result } = renderHook(() => useAddComponent());

      expect(result.current).toBeTypeOf('function');
    });

    it('should add a component when called', () => {
      const { result } = renderHook(() => useAddComponent());

      const componentData: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
        type: 'button',
        name: 'Button',
        parentId: null,
        childIds: [],
        position: { x: 0, y: 0 },
        size: { width: 100, height: 40 },
        properties: {},
        styles: {},
        locked: false,
        hidden: false,
      };

      let componentId: string;
      act(() => {
        componentId = result.current(componentData);
      });

      const state = usePageBuilderStore.getState();
      expect(state.canvas.components.byId[componentId!]).toBeDefined();
    });
  });

  describe('useUpdateComponent', () => {
    it('should return updateComponent function', () => {
      const { result } = renderHook(() => useUpdateComponent());

      expect(result.current).toBeTypeOf('function');
    });

    it('should update component when called', () => {
      const { addComponent } = usePageBuilderStore.getState();

      const componentData: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
        type: 'button',
        name: 'Button',
        parentId: null,
        childIds: [],
        position: { x: 0, y: 0 },
        size: { width: 100, height: 40 },
        properties: { text: 'Click' },
        styles: {},
        locked: false,
        hidden: false,
      };

      const id = addComponent(componentData);

      const { result } = renderHook(() => useUpdateComponent());

      act(() => {
        result.current(id, { properties: { text: 'Submit' } });
      });

      const state = usePageBuilderStore.getState();
      expect(state.canvas.components.byId[id].properties.text).toBe('Submit');
    });
  });

  describe('useDeleteComponent', () => {
    it('should return deleteComponent function', () => {
      const { result } = renderHook(() => useDeleteComponent());

      expect(result.current).toBeTypeOf('function');
    });

    it('should delete component when called', () => {
      const { addComponent } = usePageBuilderStore.getState();

      const componentData: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
        type: 'button',
        name: 'Button',
        parentId: null,
        childIds: [],
        position: { x: 0, y: 0 },
        size: { width: 100, height: 40 },
        properties: {},
        styles: {},
        locked: false,
        hidden: false,
      };

      const id = addComponent(componentData);

      const { result } = renderHook(() => useDeleteComponent());

      act(() => {
        result.current(id);
      });

      const state = usePageBuilderStore.getState();
      expect(state.canvas.components.byId[id]).toBeUndefined();
    });
  });

  describe('useMoveComponent', () => {
    it('should return moveComponent function', () => {
      const { result } = renderHook(() => useMoveComponent());

      expect(result.current).toBeTypeOf('function');
    });
  });

  describe('useDuplicateComponent', () => {
    it('should return duplicateComponent function', () => {
      const { result } = renderHook(() => useDuplicateComponent());

      expect(result.current).toBeTypeOf('function');
    });

    it('should duplicate a component when called', () => {
      const { addComponent } = usePageBuilderStore.getState();

      const componentData: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
        type: 'button',
        name: 'Button',
        parentId: null,
        childIds: [],
        position: { x: 0, y: 0 },
        size: { width: 100, height: 40 },
        properties: {},
        styles: {},
        locked: false,
        hidden: false,
      };

      const originalId = addComponent(componentData);

      const { result } = renderHook(() => useDuplicateComponent());

      let duplicateId: string | null;
      act(() => {
        duplicateId = result.current(originalId);
      });

      const state = usePageBuilderStore.getState();
      expect(duplicateId).not.toBe(originalId);
      expect(state.canvas.components.byId[duplicateId!]).toBeDefined();
    });
  });

  // ==========================================================================
  // SELECTION HOOKS
  // ==========================================================================

  describe('useSelection', () => {
    it('should return selection state', () => {
      const { result } = renderHook(() => useSelection());

      expect(result.current).toHaveProperty('selectedIds');
      expect(result.current).toHaveProperty('hoveredId');
      expect(result.current).toHaveProperty('focusedId');
    });

    it('should update when selection changes', () => {
      const { addComponent, selectComponent } = usePageBuilderStore.getState();

      const componentData: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
        type: 'button',
        name: 'Button',
        parentId: null,
        childIds: [],
        position: { x: 0, y: 0 },
        size: { width: 100, height: 40 },
        properties: {},
        styles: {},
        locked: false,
        hidden: false,
      };

      const id = addComponent(componentData);

      const { result } = renderHook(() => useSelection());

      act(() => {
        selectComponent(id);
      });

      expect(result.current.selectedIds).toContain(id);
    });
  });

  describe('useSelectComponent', () => {
    it('should return selectComponent function', () => {
      const { result } = renderHook(() => useSelectComponent());

      expect(result.current).toBeTypeOf('function');
    });
  });

  describe('useSelectedComponents', () => {
    it('should return selected components', () => {
      const { addComponent, selectComponent } = usePageBuilderStore.getState();

      const componentData: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
        type: 'button',
        name: 'Button',
        parentId: null,
        childIds: [],
        position: { x: 0, y: 0 },
        size: { width: 100, height: 40 },
        properties: {},
        styles: {},
        locked: false,
        hidden: false,
      };

      const id = addComponent(componentData);
      selectComponent(id);

      const { result } = renderHook(() => useSelectedComponents());

      expect(result.current.length).toBe(1);
      expect(result.current[0].id).toBe(id);
    });

    it('should filter out undefined components', () => {
      const { selectComponent } = usePageBuilderStore.getState();
      selectComponent('non-existent-id');

      const { result } = renderHook(() => useSelectedComponents());

      expect(result.current.length).toBe(0);
    });
  });

  // ==========================================================================
  // CLIPBOARD HOOKS
  // ==========================================================================

  describe('useCopyPaste', () => {
    it('should return copy, cut, and paste functions', () => {
      const { result } = renderHook(() => useCopyPaste());

      expect(result.current).toHaveProperty('copy');
      expect(result.current).toHaveProperty('cut');
      expect(result.current).toHaveProperty('paste');
      expect(result.current.copy).toBeTypeOf('function');
      expect(result.current.cut).toBeTypeOf('function');
      expect(result.current.paste).toBeTypeOf('function');
    });

    it('should copy selected component', () => {
      const { addComponent, selectComponent } = usePageBuilderStore.getState();

      const componentData: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
        type: 'button',
        name: 'Button',
        parentId: null,
        childIds: [],
        position: { x: 0, y: 0 },
        size: { width: 100, height: 40 },
        properties: {},
        styles: {},
        locked: false,
        hidden: false,
      };

      const id = addComponent(componentData);
      selectComponent(id);

      const { result } = renderHook(() => useCopyPaste());

      act(() => {
        result.current.copy();
      });

      const state = usePageBuilderStore.getState();
      expect(state.clipboard.operation).toBe('copy');
      expect(state.clipboard.components.length).toBe(1);
    });

    it('should paste copied component', () => {
      const { addComponent, selectComponent, clearSelection } = usePageBuilderStore.getState();

      const componentData: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
        type: 'button',
        name: 'Button',
        parentId: null,
        childIds: [],
        position: { x: 0, y: 0 },
        size: { width: 100, height: 40 },
        properties: {},
        styles: {},
        locked: false,
        hidden: false,
      };

      const id = addComponent(componentData);
      selectComponent(id);

      const { result } = renderHook(() => useCopyPaste());

      act(() => {
        result.current.copy();
        clearSelection();
        result.current.paste();
      });

      const state = usePageBuilderStore.getState();
      expect(state.canvas.components.allIds.length).toBe(2);
    });
  });

  // ==========================================================================
  // HISTORY HOOKS
  // ==========================================================================

  describe('useHistory', () => {
    it('should return undo, redo, and can flags', () => {
      const { result } = renderHook(() => useHistory());

      expect(result.current).toHaveProperty('undo');
      expect(result.current).toHaveProperty('redo');
      expect(result.current).toHaveProperty('canUndo');
      expect(result.current).toHaveProperty('canRedo');
    });

    it('should track canUndo correctly', () => {
      const { addComponent } = usePageBuilderStore.getState();

      const { result } = renderHook(() => useHistory());

      expect(result.current.canUndo).toBe(false);

      const componentData: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
        type: 'button',
        name: 'Button',
        parentId: null,
        childIds: [],
        position: { x: 0, y: 0 },
        size: { width: 100, height: 40 },
        properties: {},
        styles: {},
        locked: false,
        hidden: false,
      };

      act(() => {
        addComponent(componentData);
      });

      expect(result.current.canUndo).toBe(true);
    });

    it('should track canRedo correctly', () => {
      const { addComponent } = usePageBuilderStore.getState();

      const componentData: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
        type: 'button',
        name: 'Button',
        parentId: null,
        childIds: [],
        position: { x: 0, y: 0 },
        size: { width: 100, height: 40 },
        properties: {},
        styles: {},
        locked: false,
        hidden: false,
      };

      addComponent(componentData);

      const { result } = renderHook(() => useHistory());

      expect(result.current.canRedo).toBe(false);

      act(() => {
        result.current.undo();
      });

      expect(result.current.canRedo).toBe(true);
    });

    it('should perform undo and redo', () => {
      const { addComponent } = usePageBuilderStore.getState();

      const componentData: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
        type: 'button',
        name: 'Button',
        parentId: null,
        childIds: [],
        position: { x: 0, y: 0 },
        size: { width: 100, height: 40 },
        properties: {},
        styles: {},
        locked: false,
        hidden: false,
      };

      const id = addComponent(componentData);

      const { result } = renderHook(() => useHistory());

      act(() => {
        result.current.undo();
      });

      let state = usePageBuilderStore.getState();
      expect(state.canvas.components.byId[id]).toBeUndefined();

      act(() => {
        result.current.redo();
      });

      state = usePageBuilderStore.getState();
      expect(state.canvas.components.byId[id]).toBeDefined();
    });
  });

  describe('useUndo', () => {
    it('should return undo function', () => {
      const { result } = renderHook(() => useUndo());

      expect(result.current).toBeTypeOf('function');
    });
  });

  describe('useRedo', () => {
    it('should return redo function', () => {
      const { result } = renderHook(() => useRedo());

      expect(result.current).toBeTypeOf('function');
    });
  });

  // ==========================================================================
  // PREVIEW HOOKS
  // ==========================================================================

  describe('usePreview', () => {
    it('should return preview state and actions', () => {
      const { result } = renderHook(() => usePreview());

      expect(result.current).toHaveProperty('isPreviewMode');
      expect(result.current).toHaveProperty('device');
      expect(result.current).toHaveProperty('orientation');
      expect(result.current).toHaveProperty('togglePreview');
      expect(result.current).toHaveProperty('setDevice');
      expect(result.current).toHaveProperty('setOrientation');
    });

    it('should toggle preview mode', () => {
      const { result } = renderHook(() => usePreview());

      expect(result.current.isPreviewMode).toBe(false);

      act(() => {
        result.current.togglePreview();
      });

      expect(result.current.isPreviewMode).toBe(true);
    });

    it('should set device', () => {
      const { result } = renderHook(() => usePreview());

      act(() => {
        result.current.setDevice('mobile');
      });

      expect(result.current.device).toBe('mobile');
    });

    it('should set orientation', () => {
      const { result } = renderHook(() => usePreview());

      act(() => {
        result.current.setOrientation('landscape');
      });

      expect(result.current.orientation).toBe('landscape');
    });
  });

  // ==========================================================================
  // VIEWPORT HOOKS
  // ==========================================================================

  describe('useViewport', () => {
    it('should return viewport state and actions', () => {
      const { result } = renderHook(() => useViewport());

      expect(result.current).toHaveProperty('zoom');
      expect(result.current).toHaveProperty('panX');
      expect(result.current).toHaveProperty('panY');
      expect(result.current).toHaveProperty('setZoom');
      expect(result.current).toHaveProperty('setPan');
      expect(result.current).toHaveProperty('resetViewport');
    });

    it('should set zoom', () => {
      const { result } = renderHook(() => useViewport());

      act(() => {
        result.current.setZoom(2);
      });

      expect(result.current.zoom).toBe(2);
    });

    it('should set pan', () => {
      const { result } = renderHook(() => useViewport());

      act(() => {
        result.current.setPan(100, 200);
      });

      expect(result.current.panX).toBe(100);
      expect(result.current.panY).toBe(200);
    });

    it('should reset viewport', () => {
      const { result } = renderHook(() => useViewport());

      act(() => {
        result.current.setZoom(2);
        result.current.setPan(100, 200);
        result.current.resetViewport();
      });

      expect(result.current.zoom).toBe(1);
      expect(result.current.panX).toBe(0);
      expect(result.current.panY).toBe(0);
    });
  });

  // ==========================================================================
  // GRID HOOKS
  // ==========================================================================

  describe('useGrid', () => {
    it('should return grid state and actions', () => {
      const { result } = renderHook(() => useGrid());

      expect(result.current).toHaveProperty('enabled');
      expect(result.current).toHaveProperty('size');
      expect(result.current).toHaveProperty('snapToGrid');
      expect(result.current).toHaveProperty('toggleGrid');
      expect(result.current).toHaveProperty('setGridSize');
      expect(result.current).toHaveProperty('toggleSnapToGrid');
    });

    it('should toggle grid', () => {
      const { result } = renderHook(() => useGrid());

      const initialEnabled = result.current.enabled;

      act(() => {
        result.current.toggleGrid();
      });

      expect(result.current.enabled).toBe(!initialEnabled);
    });

    it('should set grid size', () => {
      const { result } = renderHook(() => useGrid());

      act(() => {
        result.current.setGridSize(16);
      });

      expect(result.current.size).toBe(16);
    });

    it('should toggle snap to grid', () => {
      const { result } = renderHook(() => useGrid());

      const initialSnap = result.current.snapToGrid;

      act(() => {
        result.current.toggleSnapToGrid();
      });

      expect(result.current.snapToGrid).toBe(!initialSnap);
    });
  });

  // ==========================================================================
  // KEYBOARD SHORTCUTS HOOK
  // ==========================================================================

  describe('useKeyboardShortcuts', () => {
    it('should return keyboard handler function', () => {
      const { result } = renderHook(() => useKeyboardShortcuts());

      expect(result.current).toBeTypeOf('function');
    });

    it('should handle undo shortcut (Cmd+Z)', () => {
      const { addComponent } = usePageBuilderStore.getState();

      const componentData: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
        type: 'button',
        name: 'Button',
        parentId: null,
        childIds: [],
        position: { x: 0, y: 0 },
        size: { width: 100, height: 40 },
        properties: {},
        styles: {},
        locked: false,
        hidden: false,
      };

      const id = addComponent(componentData);

      const { result } = renderHook(() => useKeyboardShortcuts());

      const event = new KeyboardEvent('keydown', {
        key: 'z',
        metaKey: true,
        bubbles: true,
      });

      Object.defineProperty(event, 'preventDefault', {
        writable: true,
        value: vi.fn(),
      });

      act(() => {
        result.current(event);
      });

      const state = usePageBuilderStore.getState();
      expect(state.canvas.components.byId[id]).toBeUndefined();
    });

    it('should handle redo shortcut (Cmd+Shift+Z)', () => {
      const { addComponent } = usePageBuilderStore.getState();

      const componentData: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
        type: 'button',
        name: 'Button',
        parentId: null,
        childIds: [],
        position: { x: 0, y: 0 },
        size: { width: 100, height: 40 },
        properties: {},
        styles: {},
        locked: false,
        hidden: false,
      };

      const id = addComponent(componentData);
      const { undo } = usePageBuilderStore.getState();
      undo();

      const { result } = renderHook(() => useKeyboardShortcuts());

      const event = new KeyboardEvent('keydown', {
        key: 'z',
        metaKey: true,
        shiftKey: true,
        bubbles: true,
      });

      Object.defineProperty(event, 'preventDefault', {
        writable: true,
        value: vi.fn(),
      });

      act(() => {
        result.current(event);
      });

      const state = usePageBuilderStore.getState();
      expect(state.canvas.components.byId[id]).toBeDefined();
    });

    it('should handle copy shortcut (Cmd+C)', () => {
      const { addComponent, selectComponent } = usePageBuilderStore.getState();

      const componentData: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
        type: 'button',
        name: 'Button',
        parentId: null,
        childIds: [],
        position: { x: 0, y: 0 },
        size: { width: 100, height: 40 },
        properties: {},
        styles: {},
        locked: false,
        hidden: false,
      };

      const id = addComponent(componentData);
      selectComponent(id);

      const { result } = renderHook(() => useKeyboardShortcuts());

      const event = new KeyboardEvent('keydown', {
        key: 'c',
        metaKey: true,
        bubbles: true,
      });

      Object.defineProperty(event, 'preventDefault', {
        writable: true,
        value: vi.fn(),
      });

      act(() => {
        result.current(event);
      });

      const state = usePageBuilderStore.getState();
      expect(state.clipboard.operation).toBe('copy');
    });

    it('should handle paste shortcut (Cmd+V)', () => {
      const { addComponent, selectComponent, copy, clearSelection } = usePageBuilderStore.getState();

      const componentData: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
        type: 'button',
        name: 'Button',
        parentId: null,
        childIds: [],
        position: { x: 0, y: 0 },
        size: { width: 100, height: 40 },
        properties: {},
        styles: {},
        locked: false,
        hidden: false,
      };

      const id = addComponent(componentData);
      selectComponent(id);
      copy();
      clearSelection();

      const { result } = renderHook(() => useKeyboardShortcuts());

      const event = new KeyboardEvent('keydown', {
        key: 'v',
        metaKey: true,
        bubbles: true,
      });

      Object.defineProperty(event, 'preventDefault', {
        writable: true,
        value: vi.fn(),
      });

      act(() => {
        result.current(event);
      });

      const state = usePageBuilderStore.getState();
      expect(state.canvas.components.allIds.length).toBe(2);
    });

    it('should handle delete shortcut (Delete)', () => {
      const { addComponent, selectComponent } = usePageBuilderStore.getState();

      const componentData: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
        type: 'button',
        name: 'Button',
        parentId: null,
        childIds: [],
        position: { x: 0, y: 0 },
        size: { width: 100, height: 40 },
        properties: {},
        styles: {},
        locked: false,
        hidden: false,
      };

      const id = addComponent(componentData);
      selectComponent(id);

      const { result } = renderHook(() => useKeyboardShortcuts());

      const event = new KeyboardEvent('keydown', {
        key: 'Delete',
        bubbles: true,
      });

      Object.defineProperty(event, 'preventDefault', {
        writable: true,
        value: vi.fn(),
      });

      act(() => {
        result.current(event);
      });

      const state = usePageBuilderStore.getState();
      expect(state.canvas.components.byId[id]).toBeUndefined();
    });

    it('should handle Ctrl key on non-Mac platforms', () => {
      // Mock non-Mac platform
      Object.defineProperty(navigator, 'platform', {
        writable: true,
        value: 'Win32',
      });

      const { addComponent } = usePageBuilderStore.getState();

      const componentData: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
        type: 'button',
        name: 'Button',
        parentId: null,
        childIds: [],
        position: { x: 0, y: 0 },
        size: { width: 100, height: 40 },
        properties: {},
        styles: {},
        locked: false,
        hidden: false,
      };

      const id = addComponent(componentData);

      const { result } = renderHook(() => useKeyboardShortcuts());

      const event = new KeyboardEvent('keydown', {
        key: 'z',
        ctrlKey: true,
        bubbles: true,
      });

      Object.defineProperty(event, 'preventDefault', {
        writable: true,
        value: vi.fn(),
      });

      act(() => {
        result.current(event);
      });

      const state = usePageBuilderStore.getState();
      expect(state.canvas.components.byId[id]).toBeUndefined();
    });
  });
});
