/**
 * Zustand Store Tests
 *
 * Comprehensive tests for the PageBuilder Zustand store.
 * Tests all actions, state management, and edge cases.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { usePageBuilderStore } from '../store';
import type { ComponentInstance, ComponentId } from '../types';

describe('PageBuilder Store', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    const { reset } = usePageBuilderStore.getState();
    reset();
  });

  // ==========================================================================
  // COMPONENT ACTIONS
  // ==========================================================================

  describe('Component Actions', () => {
    describe('addComponent', () => {
      it('should add a component to the canvas', () => {
        const { addComponent, canvas } = usePageBuilderStore.getState();

        const componentData: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
          type: 'button',
          name: 'Submit Button',
          parentId: null,
          childIds: [],
          position: { x: 100, y: 200 },
          size: { width: 120, height: 40 },
          properties: { text: 'Submit' },
          styles: {},
          locked: false,
          hidden: false,
        };

        const id = addComponent(componentData);

        const state = usePageBuilderStore.getState();
        expect(id).toBeDefined();
        expect(state.canvas.components.byId[id]).toBeDefined();
        expect(state.canvas.components.byId[id].name).toBe('Submit Button');
        expect(state.canvas.components.allIds).toContain(id);
        expect(state.canvas.components.rootIds).toContain(id);
      });

      it('should auto-select newly added component', () => {
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
        const state = usePageBuilderStore.getState();

        expect(state.selection.selectedIds).toEqual([id]);
      });

      it('should add component with parent reference', () => {
        const { addComponent } = usePageBuilderStore.getState();

        // Add parent component
        const parentData: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
          type: 'container',
          name: 'Container',
          parentId: null,
          childIds: [],
          position: { x: 0, y: 0 },
          size: { width: 500, height: 500 },
          properties: {},
          styles: {},
          locked: false,
          hidden: false,
        };

        const parentId = addComponent(parentData);

        // Add child component
        const childData: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
          type: 'text',
          name: 'Text',
          parentId,
          childIds: [],
          position: { x: 10, y: 10 },
          size: { width: 100, height: 20 },
          properties: {},
          styles: {},
          locked: false,
          hidden: false,
        };

        const childId = addComponent(childData);
        const state = usePageBuilderStore.getState();

        expect(state.canvas.components.byId[childId].parentId).toBe(parentId);
        expect(state.canvas.components.byId[parentId].childIds).toContain(childId);
        expect(state.canvas.components.rootIds).not.toContain(childId);
      });

      it('should save to history when adding component', () => {
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
        const state = usePageBuilderStore.getState();

        expect(state.history.past.length).toBeGreaterThan(0);
      });
    });

    describe('updateComponent', () => {
      it('should update component properties', () => {
        const { addComponent, updateComponent } = usePageBuilderStore.getState();

        const componentData: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
          type: 'button',
          name: 'Button',
          parentId: null,
          childIds: [],
          position: { x: 0, y: 0 },
          size: { width: 100, height: 40 },
          properties: { text: 'Click me' },
          styles: {},
          locked: false,
          hidden: false,
        };

        const id = addComponent(componentData);
        updateComponent(id, { properties: { text: 'Submit' } });

        const state = usePageBuilderStore.getState();
        expect(state.canvas.components.byId[id].properties.text).toBe('Submit');
      });

      it('should update component position and size', () => {
        const { addComponent, updateComponent } = usePageBuilderStore.getState();

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
        updateComponent(id, {
          position: { x: 150, y: 250 },
          size: { width: 200, height: 50 },
        });

        const state = usePageBuilderStore.getState();
        expect(state.canvas.components.byId[id].position).toEqual({ x: 150, y: 250 });
        expect(state.canvas.components.byId[id].size).toEqual({ width: 200, height: 50 });
      });

      it('should update component updatedAt timestamp', async () => {
        const { addComponent, updateComponent } = usePageBuilderStore.getState();

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
        const originalUpdatedAt = usePageBuilderStore.getState().canvas.components.byId[id].updatedAt;

        // Wait a bit to ensure timestamp changes
        await new Promise(resolve => setTimeout(resolve, 10));
        updateComponent(id, { name: 'Updated Button' });
        const state = usePageBuilderStore.getState();
        expect(state.canvas.components.byId[id].updatedAt).not.toBe(originalUpdatedAt);
      });
    });

    describe('deleteComponent', () => {
      it('should delete a component from canvas', () => {
        const { addComponent, deleteComponent } = usePageBuilderStore.getState();

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
        deleteComponent(id);

        const state = usePageBuilderStore.getState();
        expect(state.canvas.components.byId[id]).toBeUndefined();
        expect(state.canvas.components.allIds).not.toContain(id);
        expect(state.canvas.components.rootIds).not.toContain(id);
      });

      it('should recursively delete child components', () => {
        const { addComponent, deleteComponent } = usePageBuilderStore.getState();

        // Add parent
        const parentData: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
          type: 'container',
          name: 'Container',
          parentId: null,
          childIds: [],
          position: { x: 0, y: 0 },
          size: { width: 500, height: 500 },
          properties: {},
          styles: {},
          locked: false,
          hidden: false,
        };

        const parentId = addComponent(parentData);

        // Add child
        const childData: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
          type: 'text',
          name: 'Text',
          parentId,
          childIds: [],
          position: { x: 10, y: 10 },
          size: { width: 100, height: 20 },
          properties: {},
          styles: {},
          locked: false,
          hidden: false,
        };

        const childId = addComponent(childData);

        // Delete parent
        deleteComponent(parentId);

        const state = usePageBuilderStore.getState();
        expect(state.canvas.components.byId[parentId]).toBeUndefined();
        expect(state.canvas.components.byId[childId]).toBeUndefined();
      });

      it('should remove from parent childIds array', () => {
        const { addComponent, deleteComponent } = usePageBuilderStore.getState();

        // Add parent
        const parentData: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
          type: 'container',
          name: 'Container',
          parentId: null,
          childIds: [],
          position: { x: 0, y: 0 },
          size: { width: 500, height: 500 },
          properties: {},
          styles: {},
          locked: false,
          hidden: false,
        };

        const parentId = addComponent(parentData);

        // Add child
        const childData: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
          type: 'text',
          name: 'Text',
          parentId,
          childIds: [],
          position: { x: 10, y: 10 },
          size: { width: 100, height: 20 },
          properties: {},
          styles: {},
          locked: false,
          hidden: false,
        };

        const childId = addComponent(childData);

        // Delete child
        deleteComponent(childId);

        const state = usePageBuilderStore.getState();
        expect(state.canvas.components.byId[parentId].childIds).not.toContain(childId);
      });

      it('should clear selection if deleted component was selected', () => {
        const { addComponent, deleteComponent, selectComponent } = usePageBuilderStore.getState();

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
        deleteComponent(id);

        const state = usePageBuilderStore.getState();
        expect(state.selection.selectedIds).not.toContain(id);
      });
    });

    describe('moveComponent', () => {
      it('should move component to new position', () => {
        const { addComponent, moveComponent } = usePageBuilderStore.getState();

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
        moveComponent(id, null, { x: 150, y: 250 });

        const state = usePageBuilderStore.getState();
        expect(state.canvas.components.byId[id].position).toEqual({ x: 150, y: 250 });
      });

      it('should move component to new parent', () => {
        const { addComponent, moveComponent } = usePageBuilderStore.getState();

        // Add first parent
        const parent1Data: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
          type: 'container',
          name: 'Container 1',
          parentId: null,
          childIds: [],
          position: { x: 0, y: 0 },
          size: { width: 500, height: 500 },
          properties: {},
          styles: {},
          locked: false,
          hidden: false,
        };

        const parent1Id = addComponent(parent1Data);

        // Add child to parent 1
        const childData: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
          type: 'text',
          name: 'Text',
          parentId: parent1Id,
          childIds: [],
          position: { x: 10, y: 10 },
          size: { width: 100, height: 20 },
          properties: {},
          styles: {},
          locked: false,
          hidden: false,
        };

        const childId = addComponent(childData);

        // Add second parent
        const parent2Data: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
          type: 'container',
          name: 'Container 2',
          parentId: null,
          childIds: [],
          position: { x: 600, y: 0 },
          size: { width: 500, height: 500 },
          properties: {},
          styles: {},
          locked: false,
          hidden: false,
        };

        const parent2Id = addComponent(parent2Data);

        // Move child to parent 2
        moveComponent(childId, parent2Id, { x: 20, y: 20 });

        const state = usePageBuilderStore.getState();
        expect(state.canvas.components.byId[childId].parentId).toBe(parent2Id);
        expect(state.canvas.components.byId[parent2Id].childIds).toContain(childId);
        expect(state.canvas.components.byId[parent1Id].childIds).not.toContain(childId);
      });
    });

    describe('duplicateComponent', () => {
      it('should duplicate a component', () => {
        const { addComponent, duplicateComponent } = usePageBuilderStore.getState();

        const componentData: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
          type: 'button',
          name: 'Button',
          parentId: null,
          childIds: [],
          position: { x: 100, y: 100 },
          size: { width: 100, height: 40 },
          properties: { text: 'Click me' },
          styles: {},
          locked: false,
          hidden: false,
        };

        const originalId = addComponent(componentData);
        const duplicateId = duplicateComponent(originalId);

        const state = usePageBuilderStore.getState();
        expect(duplicateId).toBeDefined();
        expect(duplicateId).not.toBe(originalId);
        expect(state.canvas.components.byId[duplicateId!].name).toBe('Button (Copy)');
        expect(state.canvas.components.byId[duplicateId!].properties.text).toBe('Click me');
        expect(state.canvas.components.byId[duplicateId!].position).toEqual({ x: 120, y: 120 });
      });

      it('should recursively duplicate child components', () => {
        const { addComponent, duplicateComponent } = usePageBuilderStore.getState();

        // Add parent
        const parentData: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
          type: 'container',
          name: 'Container',
          parentId: null,
          childIds: [],
          position: { x: 0, y: 0 },
          size: { width: 500, height: 500 },
          properties: {},
          styles: {},
          locked: false,
          hidden: false,
        };

        const parentId = addComponent(parentData);

        // Add child
        const childData: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
          type: 'text',
          name: 'Text',
          parentId,
          childIds: [],
          position: { x: 10, y: 10 },
          size: { width: 100, height: 20 },
          properties: {},
          styles: {},
          locked: false,
          hidden: false,
        };

        const childId = addComponent(childData);

        // Duplicate parent
        const duplicateParentId = duplicateComponent(parentId);

        const state = usePageBuilderStore.getState();
        expect(duplicateParentId).toBeDefined();
        expect(state.canvas.components.byId[duplicateParentId!].childIds.length).toBe(1);
      });
    });
  });

  // ==========================================================================
  // SELECTION ACTIONS
  // ==========================================================================

  describe('Selection Actions', () => {
    describe('selectComponent', () => {
      it('should select a component', () => {
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

        // Clear auto-selection from addComponent
        const { clearSelection } = usePageBuilderStore.getState();
        clearSelection();

        selectComponent(id);

        const state = usePageBuilderStore.getState();
        expect(state.selection.selectedIds).toEqual([id]);
      });

      it('should clear selection when passed null', () => {
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
        selectComponent(null);

        const state = usePageBuilderStore.getState();
        expect(state.selection.selectedIds).toEqual([]);
      });

      it('should support multi-select', () => {
        const { addComponent, selectComponent } = usePageBuilderStore.getState();

        const component1Data: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
          type: 'button',
          name: 'Button 1',
          parentId: null,
          childIds: [],
          position: { x: 0, y: 0 },
          size: { width: 100, height: 40 },
          properties: {},
          styles: {},
          locked: false,
          hidden: false,
        };

        const component2Data: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
          type: 'button',
          name: 'Button 2',
          parentId: null,
          childIds: [],
          position: { x: 150, y: 0 },
          size: { width: 100, height: 40 },
          properties: {},
          styles: {},
          locked: false,
          hidden: false,
        };

        const id1 = addComponent(component1Data);
        const id2 = addComponent(component2Data);

        selectComponent(id1);
        selectComponent(id2, true); // Multi-select

        const state = usePageBuilderStore.getState();
        expect(state.selection.selectedIds).toContain(id1);
        expect(state.selection.selectedIds).toContain(id2);
        expect(state.selection.selectedIds.length).toBe(2);
      });

      it('should toggle selection in multi-select mode', () => {
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
        selectComponent(id, true); // Toggle off

        const state = usePageBuilderStore.getState();
        expect(state.selection.selectedIds).not.toContain(id);
      });
    });

    describe('selectMultiple', () => {
      it('should select multiple components at once', () => {
        const { addComponent, selectMultiple } = usePageBuilderStore.getState();

        const component1Data: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
          type: 'button',
          name: 'Button 1',
          parentId: null,
          childIds: [],
          position: { x: 0, y: 0 },
          size: { width: 100, height: 40 },
          properties: {},
          styles: {},
          locked: false,
          hidden: false,
        };

        const component2Data: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
          type: 'button',
          name: 'Button 2',
          parentId: null,
          childIds: [],
          position: { x: 150, y: 0 },
          size: { width: 100, height: 40 },
          properties: {},
          styles: {},
          locked: false,
          hidden: false,
        };

        const id1 = addComponent(component1Data);
        const id2 = addComponent(component2Data);

        selectMultiple([id1, id2]);

        const state = usePageBuilderStore.getState();
        expect(state.selection.selectedIds).toEqual([id1, id2]);
      });
    });

    describe('clearSelection', () => {
      it('should clear all selections', () => {
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
        clearSelection();

        const state = usePageBuilderStore.getState();
        expect(state.selection.selectedIds).toEqual([]);
      });
    });

    describe('setHoveredComponent', () => {
      it('should set hovered component', () => {
        const { addComponent, setHoveredComponent } = usePageBuilderStore.getState();

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
        setHoveredComponent(id);

        const state = usePageBuilderStore.getState();
        expect(state.selection.hoveredId).toBe(id);
      });
    });

    describe('setFocusedComponent', () => {
      it('should set focused component', () => {
        const { addComponent, setFocusedComponent } = usePageBuilderStore.getState();

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
        setFocusedComponent(id);

        const state = usePageBuilderStore.getState();
        expect(state.selection.focusedId).toBe(id);
      });
    });
  });

  // ==========================================================================
  // CLIPBOARD ACTIONS
  // ==========================================================================

  describe('Clipboard Actions', () => {
    describe('copy', () => {
      it('should copy selected components to clipboard', () => {
        const { addComponent, selectComponent, copy } = usePageBuilderStore.getState();

        const componentData: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
          type: 'button',
          name: 'Button',
          parentId: null,
          childIds: [],
          position: { x: 0, y: 0 },
          size: { width: 100, height: 40 },
          properties: { text: 'Click me' },
          styles: {},
          locked: false,
          hidden: false,
        };

        const id = addComponent(componentData);
        selectComponent(id);
        copy();

        const state = usePageBuilderStore.getState();
        expect(state.clipboard.operation).toBe('copy');
        expect(state.clipboard.components.length).toBe(1);
        expect(state.clipboard.components[0].properties.text).toBe('Click me');
      });
    });

    describe('cut', () => {
      it('should cut selected components', () => {
        const { addComponent, selectComponent, cut } = usePageBuilderStore.getState();

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
        cut();

        const state = usePageBuilderStore.getState();
        expect(state.clipboard.operation).toBe('cut');
        expect(state.clipboard.components.length).toBe(1);
        expect(state.canvas.components.byId[id]).toBeUndefined();
      });
    });

    describe('paste', () => {
      it('should paste copied components', () => {
        const { addComponent, selectComponent, copy, paste, clearSelection } = usePageBuilderStore.getState();

        const componentData: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
          type: 'button',
          name: 'Button',
          parentId: null,
          childIds: [],
          position: { x: 100, y: 100 },
          size: { width: 100, height: 40 },
          properties: { text: 'Original' },
          styles: {},
          locked: false,
          hidden: false,
        };

        const originalId = addComponent(componentData);
        selectComponent(originalId);
        copy();
        clearSelection();
        paste();

        const state = usePageBuilderStore.getState();
        expect(state.canvas.components.allIds.length).toBe(2);
        expect(state.selection.selectedIds.length).toBe(1);
        expect(state.selection.selectedIds[0]).not.toBe(originalId);
      });

      it('should clear clipboard after paste if operation was cut', () => {
        const { addComponent, selectComponent, cut, paste } = usePageBuilderStore.getState();

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
        cut();
        paste();

        const state = usePageBuilderStore.getState();
        expect(state.clipboard.operation).toBe(null);
        expect(state.clipboard.components).toEqual([]);
      });

      it('should keep clipboard after paste if operation was copy', () => {
        const { addComponent, selectComponent, copy, paste, clearSelection } = usePageBuilderStore.getState();

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
        paste();

        const state = usePageBuilderStore.getState();
        expect(state.clipboard.operation).toBe('copy');
        expect(state.clipboard.components.length).toBe(1);
      });
    });
  });

  // ==========================================================================
  // HISTORY ACTIONS
  // ==========================================================================

  describe('History Actions', () => {
    describe('undo/redo', () => {
      it('should undo component deletion', () => {
        const { addComponent, deleteComponent, undo } = usePageBuilderStore.getState();

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
        deleteComponent(id);

        let state = usePageBuilderStore.getState();
        expect(state.canvas.components.byId[id]).toBeUndefined();

        // Undo the deletion
        undo();

        state = usePageBuilderStore.getState();
        // Component should be restored
        expect(state.canvas.components.byId[id]).toBeDefined();
        expect(state.canvas.components.byId[id].name).toBe('Button');
      });

      it('should redo after undo', () => {
        const { addComponent, undo, redo } = usePageBuilderStore.getState();

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
        undo();
        redo();

        const state = usePageBuilderStore.getState();
        expect(state.canvas.components.byId[id]).toBeDefined();
      });

      it('should clear future history on new action', () => {
        const { addComponent, undo } = usePageBuilderStore.getState();

        const component1Data: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
          type: 'button',
          name: 'Button 1',
          parentId: null,
          childIds: [],
          position: { x: 0, y: 0 },
          size: { width: 100, height: 40 },
          properties: {},
          styles: {},
          locked: false,
          hidden: false,
        };

        const component2Data: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
          type: 'button',
          name: 'Button 2',
          parentId: null,
          childIds: [],
          position: { x: 150, y: 0 },
          size: { width: 100, height: 40 },
          properties: {},
          styles: {},
          locked: false,
          hidden: false,
        };

        addComponent(component1Data);
        undo();

        const beforeState = usePageBuilderStore.getState();
        expect(beforeState.history.future.length).toBeGreaterThan(0);

        addComponent(component2Data);

        const afterState = usePageBuilderStore.getState();
        expect(afterState.history.future.length).toBe(0);
      });
    });

    describe('clearHistory', () => {
      it('should clear all history', () => {
        const { addComponent, clearHistory } = usePageBuilderStore.getState();

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
        clearHistory();

        const state = usePageBuilderStore.getState();
        expect(state.history.past).toEqual([]);
        expect(state.history.future).toEqual([]);
      });
    });
  });

  // ==========================================================================
  // VIEWPORT ACTIONS
  // ==========================================================================

  describe('Viewport Actions', () => {
    describe('setZoom', () => {
      it('should set zoom level', () => {
        const { setZoom } = usePageBuilderStore.getState();

        setZoom(1.5);

        const state = usePageBuilderStore.getState();
        expect(state.canvas.viewport.zoom).toBe(1.5);
      });

      it('should clamp zoom to min/max values', () => {
        const { setZoom } = usePageBuilderStore.getState();

        setZoom(10); // Too high
        let state = usePageBuilderStore.getState();
        expect(state.canvas.viewport.zoom).toBe(5);

        setZoom(0.01); // Too low
        state = usePageBuilderStore.getState();
        expect(state.canvas.viewport.zoom).toBe(0.1);
      });
    });

    describe('setPan', () => {
      it('should set pan position', () => {
        const { setPan } = usePageBuilderStore.getState();

        setPan(100, 200);

        const state = usePageBuilderStore.getState();
        expect(state.canvas.viewport.panX).toBe(100);
        expect(state.canvas.viewport.panY).toBe(200);
      });
    });

    describe('resetViewport', () => {
      it('should reset viewport to defaults', () => {
        const { setZoom, setPan, resetViewport } = usePageBuilderStore.getState();

        setZoom(2);
        setPan(100, 200);
        resetViewport();

        const state = usePageBuilderStore.getState();
        expect(state.canvas.viewport.zoom).toBe(1);
        expect(state.canvas.viewport.panX).toBe(0);
        expect(state.canvas.viewport.panY).toBe(0);
      });
    });
  });

  // ==========================================================================
  // GRID ACTIONS
  // ==========================================================================

  describe('Grid Actions', () => {
    describe('toggleGrid', () => {
      it('should toggle grid visibility', () => {
        const { toggleGrid } = usePageBuilderStore.getState();

        const initialState = usePageBuilderStore.getState();
        const initialEnabled = initialState.canvas.grid.enabled;

        toggleGrid();

        const state = usePageBuilderStore.getState();
        expect(state.canvas.grid.enabled).toBe(!initialEnabled);
      });
    });

    describe('setGridSize', () => {
      it('should set grid size', () => {
        const { setGridSize } = usePageBuilderStore.getState();

        setGridSize(16);

        const state = usePageBuilderStore.getState();
        expect(state.canvas.grid.size).toBe(16);
      });
    });

    describe('toggleSnapToGrid', () => {
      it('should toggle snap to grid', () => {
        const { toggleSnapToGrid } = usePageBuilderStore.getState();

        const initialState = usePageBuilderStore.getState();
        const initialSnap = initialState.canvas.grid.snapToGrid;

        toggleSnapToGrid();

        const state = usePageBuilderStore.getState();
        expect(state.canvas.grid.snapToGrid).toBe(!initialSnap);
      });
    });
  });

  // ==========================================================================
  // PREVIEW ACTIONS
  // ==========================================================================

  describe('Preview Actions', () => {
    describe('togglePreview', () => {
      it('should toggle preview mode', () => {
        const { togglePreview } = usePageBuilderStore.getState();

        togglePreview();

        const state = usePageBuilderStore.getState();
        expect(state.preview.isPreviewMode).toBe(true);

        togglePreview();

        const state2 = usePageBuilderStore.getState();
        expect(state2.preview.isPreviewMode).toBe(false);
      });
    });

    describe('setDevice', () => {
      it('should set preview device', () => {
        const { setDevice } = usePageBuilderStore.getState();

        setDevice('mobile');

        const state = usePageBuilderStore.getState();
        expect(state.preview.device).toBe('mobile');
      });
    });

    describe('setOrientation', () => {
      it('should set device orientation', () => {
        const { setOrientation } = usePageBuilderStore.getState();

        setOrientation('landscape');

        const state = usePageBuilderStore.getState();
        expect(state.preview.orientation).toBe('landscape');
      });
    });
  });

  // ==========================================================================
  // WORKFLOW ACTIONS
  // ==========================================================================

  describe('Workflow Actions', () => {
    describe('addPage', () => {
      it('should add a new page', () => {
        const { addPage } = usePageBuilderStore.getState();

        const pageId = addPage('About', '/about');

        const state = usePageBuilderStore.getState();
        expect(state.workflow.pages.length).toBe(2);
        expect(state.workflow.pages[1].name).toBe('About');
        expect(state.workflow.pages[1].path).toBe('/about');
      });
    });

    describe('deletePage', () => {
      it('should delete a page', () => {
        const { addPage, deletePage } = usePageBuilderStore.getState();

        const pageId = addPage('About', '/about');
        deletePage(pageId);

        const state = usePageBuilderStore.getState();
        expect(state.workflow.pages.length).toBe(1);
      });

      it('should switch to first page if current page is deleted', () => {
        const { addPage, deletePage, setCurrentPage } = usePageBuilderStore.getState();

        const page1Id = usePageBuilderStore.getState().workflow.pages[0].id;
        const page2Id = addPage('About', '/about');

        setCurrentPage(page2Id);
        deletePage(page2Id);

        const state = usePageBuilderStore.getState();
        expect(state.workflow.currentPageId).toBe(page1Id);
      });
    });

    describe('setCurrentPage', () => {
      it('should set current page', () => {
        const { addPage, setCurrentPage } = usePageBuilderStore.getState();

        const pageId = addPage('About', '/about');
        setCurrentPage(pageId);

        const state = usePageBuilderStore.getState();
        expect(state.workflow.currentPageId).toBe(pageId);
      });
    });

    describe('renamePage', () => {
      it('should rename a page', () => {
        const { renamePage } = usePageBuilderStore.getState();

        const pageId = usePageBuilderStore.getState().workflow.pages[0].id;
        renamePage(pageId, 'Homepage');

        const state = usePageBuilderStore.getState();
        expect(state.workflow.pages[0].name).toBe('Homepage');
      });
    });
  });

  // ==========================================================================
  // PROPERTIES PANEL ACTIONS
  // ==========================================================================

  describe('Properties Panel Actions', () => {
    describe('togglePropertiesPanel', () => {
      it('should toggle properties panel', () => {
        const { togglePropertiesPanel } = usePageBuilderStore.getState();

        const initialState = usePageBuilderStore.getState();
        const initialOpen = initialState.properties.isPanelOpen;

        togglePropertiesPanel();

        const state = usePageBuilderStore.getState();
        expect(state.properties.isPanelOpen).toBe(!initialOpen);
      });
    });

    describe('setActiveTab', () => {
      it('should set active properties tab', () => {
        const { setActiveTab } = usePageBuilderStore.getState();

        setActiveTab('styles');

        const state = usePageBuilderStore.getState();
        expect(state.properties.activeTab).toBe('styles');
      });
    });
  });

  // ==========================================================================
  // PREFERENCES ACTIONS
  // ==========================================================================

  describe('Preferences Actions', () => {
    describe('setTheme', () => {
      it('should set theme preference', () => {
        const { setTheme } = usePageBuilderStore.getState();

        setTheme('dark');

        const state = usePageBuilderStore.getState();
        expect(state.preferences.theme).toBe('dark');
      });
    });

    describe('setAutoSave', () => {
      it('should toggle auto-save', () => {
        const { setAutoSave } = usePageBuilderStore.getState();

        setAutoSave(false);

        const state = usePageBuilderStore.getState();
        expect(state.preferences.autoSave).toBe(false);
      });
    });

    describe('setAutoSaveInterval', () => {
      it('should set auto-save interval', () => {
        const { setAutoSaveInterval } = usePageBuilderStore.getState();

        setAutoSaveInterval(60);

        const state = usePageBuilderStore.getState();
        expect(state.preferences.autoSaveInterval).toBe(60);
      });
    });
  });

  // ==========================================================================
  // UTILITY ACTIONS
  // ==========================================================================

  describe('Utility Actions', () => {
    describe('reset', () => {
      it('should reset store to initial state', () => {
        const { addComponent, reset } = usePageBuilderStore.getState();

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
        reset();

        const state = usePageBuilderStore.getState();
        expect(state.canvas.components.allIds).toEqual([]);
        expect(state.selection.selectedIds).toEqual([]);
        expect(state.history.past).toEqual([]);
      });
    });

    describe('loadProject', () => {
      it('should load project state', () => {
        const { loadProject } = usePageBuilderStore.getState();

        const mockCanvas = {
          components: {
            byId: {},
            allIds: [],
            rootIds: [],
          },
          viewport: {
            zoom: 2,
            panX: 100,
            panY: 200,
          },
          grid: {
            enabled: false,
            size: 16,
            snapToGrid: false,
          },
        };

        loadProject({ canvas: mockCanvas });

        const state = usePageBuilderStore.getState();
        expect(state.canvas.viewport.zoom).toBe(2);
        expect(state.canvas.viewport.panX).toBe(100);
        expect(state.canvas.grid.size).toBe(16);
      });
    });
  });
});
