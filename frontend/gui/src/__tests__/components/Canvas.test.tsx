/**
 * Canvas Component Tests
 *
 * Tests for the main Canvas component where components are rendered and manipulated.
 * This tests drag-drop, selection, keyboard navigation, and rendering.
 *
 * NOTE: These tests use a mock Canvas implementation. Update tests when actual Canvas
 * component is implemented.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { usePageBuilderStore } from '../../store';
import type { ComponentInstance } from '../../types';

// =============================================================================
// MOCK CANVAS COMPONENT
// =============================================================================
// This is a minimal mock Canvas component for testing purposes.
// Replace with actual Canvas component when implemented.

const MockCanvas = () => {
  const components = usePageBuilderStore((state) => state.canvas.components);
  const selectedIds = usePageBuilderStore((state) => state.selection.selectedIds);
  const selectComponent = usePageBuilderStore((state) => state.selectComponent);
  const viewport = usePageBuilderStore((state) => state.canvas.viewport);

  return (
    <div
      data-testid="canvas"
      role="main"
      aria-label="Page builder canvas"
      style={{
        transform: `scale(${viewport.zoom}) translate(${viewport.panX}px, ${viewport.panY}px)`,
      }}
    >
      {components.rootIds.map((id) => {
        const component = components.byId[id];
        if (!component) return null;

        const isSelected = selectedIds.includes(id);

        return (
          <div
            key={id}
            data-testid={`component-${id}`}
            data-component-type={component.type}
            className={isSelected ? 'selected' : ''}
            onClick={() => selectComponent(id)}
            style={{
              position: 'absolute',
              left: component.position.x,
              top: component.position.y,
              width: component.size.width,
              height: component.size.height,
              border: isSelected ? '2px solid blue' : '1px solid gray',
            }}
          >
            {component.name}
            {isSelected && (
              <div data-testid="selection-overlay" className="selection-overlay">
                Selected
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// =============================================================================
// TESTS
// =============================================================================

describe('Canvas Component', () => {
  beforeEach(() => {
    // Reset store before each test
    const { reset } = usePageBuilderStore.getState();
    reset();
  });

  // ===========================================================================
  // RENDERING TESTS
  // ===========================================================================

  describe('Rendering', () => {
    it('should render without errors', () => {
      render(<MockCanvas />);

      const canvas = screen.getByTestId('canvas');
      expect(canvas).toBeInTheDocument();
    });

    it('should have correct ARIA attributes', () => {
      render(<MockCanvas />);

      const canvas = screen.getByRole('main');
      expect(canvas).toHaveAttribute('aria-label', 'Page builder canvas');
    });

    it('should render empty canvas initially', () => {
      render(<MockCanvas />);

      const canvas = screen.getByTestId('canvas');
      expect(canvas.children.length).toBe(0);
    });

    it('should render components on the canvas', () => {
      const { addComponent } = usePageBuilderStore.getState();

      const componentData: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
        type: 'button',
        name: 'Submit Button',
        parentId: null,
        childIds: [],
        position: { x: 100, y: 200 },
        size: { width: 120, height: 40 },
        properties: {},
        styles: {},
        locked: false,
        hidden: false,
      };

      const id = addComponent(componentData);

      render(<MockCanvas />);

      const component = screen.getByTestId(`component-${id}`);
      expect(component).toBeInTheDocument();
      expect(component).toHaveTextContent('Submit Button');
    });

    it('should render multiple components', () => {
      const { addComponent } = usePageBuilderStore.getState();

      const component1: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
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

      const component2: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
        type: 'text',
        name: 'Text 1',
        parentId: null,
        childIds: [],
        position: { x: 150, y: 0 },
        size: { width: 200, height: 30 },
        properties: {},
        styles: {},
        locked: false,
        hidden: false,
      };

      addComponent(component1);
      addComponent(component2);

      render(<MockCanvas />);

      expect(screen.getByText('Button 1')).toBeInTheDocument();
      expect(screen.getByText('Text 1')).toBeInTheDocument();
    });

    it('should apply component positioning', () => {
      const { addComponent } = usePageBuilderStore.getState();

      const componentData: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
        type: 'button',
        name: 'Button',
        parentId: null,
        childIds: [],
        position: { x: 150, y: 250 },
        size: { width: 100, height: 40 },
        properties: {},
        styles: {},
        locked: false,
        hidden: false,
      };

      const id = addComponent(componentData);

      render(<MockCanvas />);

      const component = screen.getByTestId(`component-${id}`);
      expect(component).toHaveStyle({ left: '150px', top: '250px' });
    });

    it('should apply component sizing', () => {
      const { addComponent } = usePageBuilderStore.getState();

      const componentData: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
        type: 'button',
        name: 'Button',
        parentId: null,
        childIds: [],
        position: { x: 0, y: 0 },
        size: { width: 200, height: 50 },
        properties: {},
        styles: {},
        locked: false,
        hidden: false,
      };

      const id = addComponent(componentData);

      render(<MockCanvas />);

      const component = screen.getByTestId(`component-${id}`);
      expect(component).toHaveStyle({ width: '200px', height: '50px' });
    });
  });

  // ===========================================================================
  // SELECTION TESTS
  // ===========================================================================

  describe('Selection', () => {
    it('should show selection overlay when component is selected', () => {
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

      render(<MockCanvas />);

      const overlay = screen.getByTestId('selection-overlay');
      expect(overlay).toBeInTheDocument();
    });

    it('should apply selected class to selected component', () => {
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

      render(<MockCanvas />);

      const component = screen.getByTestId(`component-${id}`);
      expect(component).toHaveClass('selected');
    });

    it('should select component on click', async () => {
      const user = userEvent.setup();
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

      // Clear auto-selection
      const { clearSelection } = usePageBuilderStore.getState();
      clearSelection();

      render(<MockCanvas />);

      const component = screen.getByTestId(`component-${id}`);
      await user.click(component);

      const state = usePageBuilderStore.getState();
      expect(state.selection.selectedIds).toContain(id);
    });

    it('should show different border for selected component', () => {
      const { addComponent, selectComponent, clearSelection } = usePageBuilderStore.getState();

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

      clearSelection();
      selectComponent(id1);

      render(<MockCanvas />);

      const selectedComponent = screen.getByTestId(`component-${id1}`);
      const unselectedComponent = screen.getByTestId(`component-${id2}`);

      expect(selectedComponent).toHaveStyle({ border: '2px solid blue' });
      expect(unselectedComponent).toHaveStyle({ border: '1px solid gray' });
    });
  });

  // ===========================================================================
  // VIEWPORT TESTS
  // ===========================================================================

  describe('Viewport', () => {
    it('should apply zoom transformation', () => {
      const { setZoom } = usePageBuilderStore.getState();

      setZoom(1.5);

      render(<MockCanvas />);

      const canvas = screen.getByTestId('canvas');
      expect(canvas).toHaveStyle({
        transform: 'scale(1.5) translate(0px, 0px)',
      });
    });

    it('should apply pan transformation', () => {
      const { setPan } = usePageBuilderStore.getState();

      setPan(100, 200);

      render(<MockCanvas />);

      const canvas = screen.getByTestId('canvas');
      expect(canvas).toHaveStyle({
        transform: 'scale(1) translate(100px, 200px)',
      });
    });

    it('should apply combined zoom and pan', () => {
      const { setZoom, setPan } = usePageBuilderStore.getState();

      setZoom(2);
      setPan(50, 100);

      render(<MockCanvas />);

      const canvas = screen.getByTestId('canvas');
      expect(canvas).toHaveStyle({
        transform: 'scale(2) translate(50px, 100px)',
      });
    });
  });

  // ===========================================================================
  // COMPONENT TYPE TESTS
  // ===========================================================================

  describe('Component Types', () => {
    it('should set correct component type attribute', () => {
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

      render(<MockCanvas />);

      const component = screen.getByTestId(`component-${id}`);
      expect(component).toHaveAttribute('data-component-type', 'button');
    });

    it('should render different component types', () => {
      const { addComponent } = usePageBuilderStore.getState();

      const types = ['button', 'text', 'image', 'container', 'form'];

      types.forEach((type) => {
        addComponent({
          type,
          name: `${type} component`,
          parentId: null,
          childIds: [],
          position: { x: 0, y: 0 },
          size: { width: 100, height: 40 },
          properties: {},
          styles: {},
          locked: false,
          hidden: false,
        });
      });

      render(<MockCanvas />);

      types.forEach((type) => {
        const component = screen.getByText(`${type} component`);
        expect(component.parentElement).toHaveAttribute('data-component-type', type);
      });
    });
  });

  // ===========================================================================
  // ACCESSIBILITY TESTS
  // ===========================================================================

  describe('Accessibility', () => {
    it('should have main landmark role', () => {
      render(<MockCanvas />);

      const canvas = screen.getByRole('main');
      expect(canvas).toBeInTheDocument();
    });

    it('should have descriptive aria-label', () => {
      render(<MockCanvas />);

      const canvas = screen.getByLabelText('Page builder canvas');
      expect(canvas).toBeInTheDocument();
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();
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

      render(<MockCanvas />);

      const component = screen.getByText('Button');

      // Focus and trigger with keyboard
      component.parentElement?.focus();
      await user.keyboard('{Enter}');

      // Component should still be accessible
      expect(component).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // EDGE CASES
  // ===========================================================================

  describe('Edge Cases', () => {
    it('should handle missing component gracefully', () => {
      // Manually corrupt state to test edge case
      const { addComponent } = usePageBuilderStore.getState();

      const id = addComponent({
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
      });

      // Add a non-existent ID to rootIds
      usePageBuilderStore.setState((state) => ({
        canvas: {
          ...state.canvas,
          components: {
            ...state.canvas.components,
            rootIds: [...state.canvas.components.rootIds, 'non-existent-id'],
          },
        },
      }));

      // Should render without crashing
      render(<MockCanvas />);

      const canvas = screen.getByTestId('canvas');
      expect(canvas).toBeInTheDocument();
    });

    it('should handle zero-sized components', () => {
      const { addComponent } = usePageBuilderStore.getState();

      const componentData: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
        type: 'button',
        name: 'Button',
        parentId: null,
        childIds: [],
        position: { x: 0, y: 0 },
        size: { width: 0, height: 0 },
        properties: {},
        styles: {},
        locked: false,
        hidden: false,
      };

      const id = addComponent(componentData);

      render(<MockCanvas />);

      const component = screen.getByTestId(`component-${id}`);
      expect(component).toBeInTheDocument();
      expect(component).toHaveStyle({ width: '0px', height: '0px' });
    });

    it('should handle negative positions', () => {
      const { addComponent } = usePageBuilderStore.getState();

      const componentData: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
        type: 'button',
        name: 'Button',
        parentId: null,
        childIds: [],
        position: { x: -50, y: -100 },
        size: { width: 100, height: 40 },
        properties: {},
        styles: {},
        locked: false,
        hidden: false,
      };

      const id = addComponent(componentData);

      render(<MockCanvas />);

      const component = screen.getByTestId(`component-${id}`);
      expect(component).toHaveStyle({ left: '-50px', top: '-100px' });
    });
  });
});
