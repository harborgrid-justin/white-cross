/**
 * Integration Tests
 *
 * End-to-end integration tests for the page builder.
 * Tests complete workflows combining multiple features.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePageBuilderStore } from '../store';
import {
  useAddComponent,
  useUpdateComponent,
  useDeleteComponent,
  useDuplicateComponent,
  useSelection,
  useCopyPaste,
  useHistory,
} from '../hooks/usePageBuilder';
import type { ComponentInstance } from '../types';

describe('Integration Tests', () => {
  beforeEach(() => {
    // Reset store before each test
    const { reset } = usePageBuilderStore.getState();
    reset();
  });

  // ===========================================================================
  // COMPONENT LIFECYCLE WORKFLOW
  // ===========================================================================

  describe('Complete Component Lifecycle', () => {
    it('should handle full workflow: add, edit, delete', () => {
      const { addComponent, updateComponent, deleteComponent } = usePageBuilderStore.getState();

      // Step 1: Add component
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
      let state = usePageBuilderStore.getState();

      expect(state.canvas.components.byId[id]).toBeDefined();
      expect(state.selection.selectedIds).toContain(id);

      // Step 2: Edit properties
      updateComponent(id, {
        name: 'Submit Button',
        properties: { text: 'Submit' },
        size: { width: 120, height: 40 },
      });

      state = usePageBuilderStore.getState();
      expect(state.canvas.components.byId[id].name).toBe('Submit Button');
      expect(state.canvas.components.byId[id].properties.text).toBe('Submit');
      expect(state.canvas.components.byId[id].size.width).toBe(120);

      // Step 3: Delete component
      deleteComponent(id);

      state = usePageBuilderStore.getState();
      expect(state.canvas.components.byId[id]).toBeUndefined();
      expect(state.selection.selectedIds).not.toContain(id);
    });

    it('should track component in history throughout lifecycle', () => {
      const { addComponent, updateComponent, deleteComponent, undo, redo } =
        usePageBuilderStore.getState();

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
      updateComponent(id, { name: 'Updated Button' });
      deleteComponent(id);

      let state = usePageBuilderStore.getState();
      expect(state.history.past.length).toBeGreaterThan(0);

      // Undo delete
      undo();
      state = usePageBuilderStore.getState();
      expect(state.canvas.components.byId[id]).toBeDefined();

      // Redo delete
      redo();
      state = usePageBuilderStore.getState();
      expect(state.canvas.components.byId[id]).toBeUndefined();
    });
  });

  // ===========================================================================
  // UNDO/REDO WORKFLOW
  // ===========================================================================

  describe('Undo/Redo Workflow', () => {
    it('should handle multiple undo/redo operations', () => {
      const { addComponent, undo, redo } = usePageBuilderStore.getState();

      const componentData1: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
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

      const componentData2: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
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

      const componentData3: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
        type: 'button',
        name: 'Button 3',
        parentId: null,
        childIds: [],
        position: { x: 300, y: 0 },
        size: { width: 100, height: 40 },
        properties: {},
        styles: {},
        locked: false,
        hidden: false,
      };

      const id1 = addComponent(componentData1);
      const id2 = addComponent(componentData2);
      const id3 = addComponent(componentData3);

      let state = usePageBuilderStore.getState();
      expect(state.canvas.components.allIds.length).toBe(3);

      // Undo twice
      undo();
      undo();

      state = usePageBuilderStore.getState();
      expect(state.canvas.components.allIds.length).toBe(1);
      expect(state.canvas.components.byId[id1]).toBeDefined();
      expect(state.canvas.components.byId[id2]).toBeUndefined();
      expect(state.canvas.components.byId[id3]).toBeUndefined();

      // Redo once
      redo();

      state = usePageBuilderStore.getState();
      expect(state.canvas.components.allIds.length).toBe(2);
      expect(state.canvas.components.byId[id2]).toBeDefined();

      // Redo again
      redo();

      state = usePageBuilderStore.getState();
      expect(state.canvas.components.allIds.length).toBe(3);
      expect(state.canvas.components.byId[id3]).toBeDefined();
    });

    it('should clear redo stack on new action', () => {
      const { addComponent, deleteComponent, undo } = usePageBuilderStore.getState();

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
      deleteComponent(id1);
      undo(); // Button 1 back

      let state = usePageBuilderStore.getState();
      expect(state.history.future.length).toBeGreaterThan(0);

      // Add new component (should clear redo stack)
      addComponent(component2Data);

      state = usePageBuilderStore.getState();
      expect(state.history.future.length).toBe(0);
    });
  });

  // ===========================================================================
  // COPY/PASTE WORKFLOW
  // ===========================================================================

  describe('Copy/Paste Workflow', () => {
    it('should copy and paste a component', () => {
      const { addComponent, selectComponent, copy, paste, clearSelection } =
        usePageBuilderStore.getState();

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

      let state = usePageBuilderStore.getState();
      expect(state.clipboard.operation).toBe('copy');
      expect(state.clipboard.components.length).toBe(1);

      clearSelection();
      paste();

      state = usePageBuilderStore.getState();
      expect(state.canvas.components.allIds.length).toBe(2);

      const pastedComponent = state.canvas.components.allIds.find((id) => id !== originalId);
      expect(pastedComponent).toBeDefined();
      expect(state.canvas.components.byId[pastedComponent!].properties.text).toBe('Original');
    });

    it('should cut and paste a component', () => {
      const { addComponent, selectComponent, cut, paste } = usePageBuilderStore.getState();

      const componentData: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
        type: 'button',
        name: 'Button',
        parentId: null,
        childIds: [],
        position: { x: 0, y: 0 },
        size: { width: 100, height: 40 },
        properties: { text: 'Cut me' },
        styles: {},
        locked: false,
        hidden: false,
      };

      const originalId = addComponent(componentData);
      selectComponent(originalId);
      cut();

      let state = usePageBuilderStore.getState();
      expect(state.clipboard.operation).toBe('cut');
      expect(state.canvas.components.byId[originalId]).toBeUndefined();

      paste();

      state = usePageBuilderStore.getState();
      expect(state.canvas.components.allIds.length).toBe(1);
      expect(state.clipboard.operation).toBe(null);
      expect(state.clipboard.components.length).toBe(0);
    });

    it('should paste multiple times with copy', () => {
      const { addComponent, selectComponent, copy, paste, clearSelection } =
        usePageBuilderStore.getState();

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
      copy();

      clearSelection();
      paste();
      clearSelection();
      paste();
      clearSelection();
      paste();

      const state = usePageBuilderStore.getState();
      expect(state.canvas.components.allIds.length).toBe(4);
    });

    it('should paste only once with cut', () => {
      const { addComponent, selectComponent, cut, paste, clearSelection } =
        usePageBuilderStore.getState();

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
      cut();
      paste();

      clearSelection();
      paste(); // Should not paste again

      const state = usePageBuilderStore.getState();
      expect(state.canvas.components.allIds.length).toBe(1);
    });
  });

  // ===========================================================================
  // MULTI-SELECT AND BATCH OPERATIONS
  // ===========================================================================

  describe('Multi-Select and Batch Operations', () => {
    it('should select multiple components', () => {
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

    it('should copy and paste multiple components', () => {
      const { addComponent, selectMultiple, copy, paste, clearSelection } =
        usePageBuilderStore.getState();

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
      copy();
      clearSelection();
      paste();

      const state = usePageBuilderStore.getState();
      expect(state.canvas.components.allIds.length).toBe(4);
    });

    it('should delete multiple components at once', () => {
      const { addComponent, selectMultiple, deleteComponent } = usePageBuilderStore.getState();

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

      const component3Data: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
        type: 'button',
        name: 'Button 3',
        parentId: null,
        childIds: [],
        position: { x: 300, y: 0 },
        size: { width: 100, height: 40 },
        properties: {},
        styles: {},
        locked: false,
        hidden: false,
      };

      const id1 = addComponent(component1Data);
      const id2 = addComponent(component2Data);
      const id3 = addComponent(component3Data);

      selectMultiple([id1, id2]);

      // Delete selected components
      const { selectedIds } = usePageBuilderStore.getState().selection;
      selectedIds.forEach((id) => deleteComponent(id));

      const state = usePageBuilderStore.getState();
      expect(state.canvas.components.allIds.length).toBe(1);
      expect(state.canvas.components.byId[id3]).toBeDefined();
    });
  });

  // ===========================================================================
  // PARENT-CHILD HIERARCHY WORKFLOW
  // ===========================================================================

  describe('Parent-Child Hierarchy', () => {
    it('should create nested component hierarchy', () => {
      const { addComponent } = usePageBuilderStore.getState();

      // Create container
      const containerData: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
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

      const containerId = addComponent(containerData);

      // Create child button
      const buttonData: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
        type: 'button',
        name: 'Button',
        parentId: containerId,
        childIds: [],
        position: { x: 10, y: 10 },
        size: { width: 100, height: 40 },
        properties: {},
        styles: {},
        locked: false,
        hidden: false,
      };

      const buttonId = addComponent(buttonData);

      const state = usePageBuilderStore.getState();
      expect(state.canvas.components.byId[buttonId].parentId).toBe(containerId);
      expect(state.canvas.components.byId[containerId].childIds).toContain(buttonId);
      expect(state.canvas.components.rootIds).toContain(containerId);
      expect(state.canvas.components.rootIds).not.toContain(buttonId);
    });

    it('should delete parent and all children', () => {
      const { addComponent, deleteComponent } = usePageBuilderStore.getState();

      // Create container
      const containerData: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
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

      const containerId = addComponent(containerData);

      // Create children
      const child1Data: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
        type: 'button',
        name: 'Button 1',
        parentId: containerId,
        childIds: [],
        position: { x: 10, y: 10 },
        size: { width: 100, height: 40 },
        properties: {},
        styles: {},
        locked: false,
        hidden: false,
      };

      const child2Data: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
        type: 'button',
        name: 'Button 2',
        parentId: containerId,
        childIds: [],
        position: { x: 120, y: 10 },
        size: { width: 100, height: 40 },
        properties: {},
        styles: {},
        locked: false,
        hidden: false,
      };

      const child1Id = addComponent(child1Data);
      const child2Id = addComponent(child2Data);

      // Delete parent
      deleteComponent(containerId);

      const state = usePageBuilderStore.getState();
      expect(state.canvas.components.byId[containerId]).toBeUndefined();
      expect(state.canvas.components.byId[child1Id]).toBeUndefined();
      expect(state.canvas.components.byId[child2Id]).toBeUndefined();
      expect(state.canvas.components.allIds.length).toBe(0);
    });

    it('should move component to different parent', () => {
      const { addComponent, moveComponent } = usePageBuilderStore.getState();

      // Create two containers
      const container1Data: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
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

      const container2Data: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
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

      const container1Id = addComponent(container1Data);
      const container2Id = addComponent(container2Data);

      // Create child in container 1
      const childData: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
        type: 'button',
        name: 'Button',
        parentId: container1Id,
        childIds: [],
        position: { x: 10, y: 10 },
        size: { width: 100, height: 40 },
        properties: {},
        styles: {},
        locked: false,
        hidden: false,
      };

      const childId = addComponent(childData);

      // Move to container 2
      moveComponent(childId, container2Id, { x: 20, y: 20 });

      const state = usePageBuilderStore.getState();
      expect(state.canvas.components.byId[childId].parentId).toBe(container2Id);
      expect(state.canvas.components.byId[container2Id].childIds).toContain(childId);
      expect(state.canvas.components.byId[container1Id].childIds).not.toContain(childId);
    });

    it('should duplicate component with children', () => {
      const { addComponent, duplicateComponent } = usePageBuilderStore.getState();

      // Create container
      const containerData: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
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

      const containerId = addComponent(containerData);

      // Create child
      const childData: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
        type: 'button',
        name: 'Button',
        parentId: containerId,
        childIds: [],
        position: { x: 10, y: 10 },
        size: { width: 100, height: 40 },
        properties: {},
        styles: {},
        locked: false,
        hidden: false,
      };

      const childId = addComponent(childData);

      // Duplicate container
      const duplicateId = duplicateComponent(containerId);

      const state = usePageBuilderStore.getState();
      expect(duplicateId).toBeDefined();
      expect(state.canvas.components.byId[duplicateId!].childIds.length).toBe(1);
      expect(state.canvas.components.allIds.length).toBe(4); // Container + Child + Duplicate Container + Duplicate Child
    });
  });

  // ===========================================================================
  // VIEWPORT AND ZOOM WORKFLOW
  // ===========================================================================

  describe('Viewport and Zoom', () => {
    it('should handle zoom and pan together', () => {
      const { setZoom, setPan, resetViewport } = usePageBuilderStore.getState();

      setZoom(2);
      setPan(100, 200);

      let state = usePageBuilderStore.getState();
      expect(state.canvas.viewport.zoom).toBe(2);
      expect(state.canvas.viewport.panX).toBe(100);
      expect(state.canvas.viewport.panY).toBe(200);

      resetViewport();

      state = usePageBuilderStore.getState();
      expect(state.canvas.viewport.zoom).toBe(1);
      expect(state.canvas.viewport.panX).toBe(0);
      expect(state.canvas.viewport.panY).toBe(0);
    });
  });

  // ===========================================================================
  // COMPLEX WORKFLOW SCENARIOS
  // ===========================================================================

  describe('Complex Workflow Scenarios', () => {
    it('should handle building a complete page layout', () => {
      const { addComponent, updateComponent } = usePageBuilderStore.getState();

      // Create page container
      const pageData: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
        type: 'container',
        name: 'Page',
        parentId: null,
        childIds: [],
        position: { x: 0, y: 0 },
        size: { width: 1200, height: 800 },
        properties: {},
        styles: {},
        locked: false,
        hidden: false,
      };

      const pageId = addComponent(pageData);

      // Create header
      const headerData: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
        type: 'container',
        name: 'Header',
        parentId: pageId,
        childIds: [],
        position: { x: 0, y: 0 },
        size: { width: 1200, height: 100 },
        properties: {},
        styles: {},
        locked: false,
        hidden: false,
      };

      const headerId = addComponent(headerData);

      // Create navigation in header
      const navData: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
        type: 'navigation',
        name: 'Nav',
        parentId: headerId,
        childIds: [],
        position: { x: 0, y: 0 },
        size: { width: 1200, height: 100 },
        properties: {},
        styles: {},
        locked: false,
        hidden: false,
      };

      const navId = addComponent(navData);

      // Create main content
      const mainData: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
        type: 'container',
        name: 'Main',
        parentId: pageId,
        childIds: [],
        position: { x: 0, y: 100 },
        size: { width: 1200, height: 600 },
        properties: {},
        styles: {},
        locked: false,
        hidden: false,
      };

      const mainId = addComponent(mainData);

      // Create footer
      const footerData: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
        type: 'container',
        name: 'Footer',
        parentId: pageId,
        childIds: [],
        position: { x: 0, y: 700 },
        size: { width: 1200, height: 100 },
        properties: {},
        styles: {},
        locked: false,
        hidden: false,
      };

      const footerId = addComponent(footerData);

      const state = usePageBuilderStore.getState();

      // Verify page structure
      expect(state.canvas.components.byId[pageId].childIds).toContain(headerId);
      expect(state.canvas.components.byId[pageId].childIds).toContain(mainId);
      expect(state.canvas.components.byId[pageId].childIds).toContain(footerId);
      expect(state.canvas.components.byId[headerId].childIds).toContain(navId);
      expect(state.canvas.components.allIds.length).toBe(5);
      expect(state.canvas.components.rootIds.length).toBe(1);
      expect(state.canvas.components.rootIds[0]).toBe(pageId);
    });

    it('should handle workflow with history and undo/redo', () => {
      const {
        addComponent,
        updateComponent,
        deleteComponent,
        copy,
        paste,
        selectComponent,
        clearSelection,
        undo,
        redo,
      } = usePageBuilderStore.getState();

      // Add first component
      const component1Data: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
        type: 'button',
        name: 'Button 1',
        parentId: null,
        childIds: [],
        position: { x: 0, y: 0 },
        size: { width: 100, height: 40 },
        properties: { text: 'Click' },
        styles: {},
        locked: false,
        hidden: false,
      };

      const id1 = addComponent(component1Data);

      // Update it
      updateComponent(id1, { properties: { text: 'Submit' } });

      // Copy and paste
      selectComponent(id1);
      copy();
      clearSelection();
      paste();

      let state = usePageBuilderStore.getState();
      expect(state.canvas.components.allIds.length).toBe(2);

      // Undo paste
      undo();
      state = usePageBuilderStore.getState();
      expect(state.canvas.components.allIds.length).toBe(1);

      // Undo update
      undo();
      state = usePageBuilderStore.getState();
      expect(state.canvas.components.byId[id1].properties.text).toBe('Click');

      // Redo update
      redo();
      state = usePageBuilderStore.getState();
      expect(state.canvas.components.byId[id1].properties.text).toBe('Submit');

      // Redo paste
      redo();
      state = usePageBuilderStore.getState();
      expect(state.canvas.components.allIds.length).toBe(2);
    });
  });

  // ===========================================================================
  // EDGE CASE WORKFLOWS
  // ===========================================================================

  describe('Edge Case Workflows', () => {
    it('should handle rapid successive operations', () => {
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

      // Add and delete 10 components rapidly
      for (let i = 0; i < 10; i++) {
        const id = addComponent({ ...componentData, name: `Button ${i}` });
        deleteComponent(id);
      }

      const state = usePageBuilderStore.getState();
      expect(state.canvas.components.allIds.length).toBe(0);
    });

    it('should handle empty operations gracefully', () => {
      const { copy, paste, undo, redo } = usePageBuilderStore.getState();

      // Try to copy with nothing selected
      copy();
      paste();

      const state1 = usePageBuilderStore.getState();
      expect(state1.canvas.components.allIds.length).toBe(0);

      // Try to undo with no history
      undo();
      redo();

      const state2 = usePageBuilderStore.getState();
      expect(state2.canvas.components.allIds.length).toBe(0);
    });
  });
});
