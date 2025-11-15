/**
 * Property Editor Component Tests
 *
 * Tests for the Property Editor component that allows editing component properties.
 * Tests property display, updates, validation, and debouncing.
 *
 * NOTE: These tests use a mock PropertyEditor implementation. Update tests when
 * actual PropertyEditor component is implemented.
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { usePageBuilderStore } from '../../store';
import type { ComponentInstance } from '../../types';

// =============================================================================
// MOCK PROPERTY EDITOR COMPONENT
// =============================================================================
// This is a minimal mock PropertyEditor component for testing purposes.
// Replace with actual PropertyEditor component when implemented.

const MockPropertyEditor = () => {
  const selectedIds = usePageBuilderStore((state) => state.selection.selectedIds);
  const components = usePageBuilderStore((state) => state.canvas.components);
  const updateComponent = usePageBuilderStore((state) => state.updateComponent);

  const selectedComponent = selectedIds.length === 1 ? components.byId[selectedIds[0]] : null;

  if (!selectedComponent) {
    return (
      <div data-testid="property-editor" role="complementary" aria-label="Property editor">
        <div data-testid="no-selection">No component selected</div>
      </div>
    );
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateComponent(selectedComponent.id, { name: e.target.value });
  };

  const handlePositionXChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const x = parseInt(e.target.value) || 0;
    updateComponent(selectedComponent.id, {
      position: { ...selectedComponent.position, x },
    });
  };

  const handlePositionYChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const y = parseInt(e.target.value) || 0;
    updateComponent(selectedComponent.id, {
      position: { ...selectedComponent.position, y },
    });
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const width = parseInt(e.target.value) || 0;
    if (width >= 0) {
      updateComponent(selectedComponent.id, {
        size: { ...selectedComponent.size, width },
      });
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const height = parseInt(e.target.value) || 0;
    if (height >= 0) {
      updateComponent(selectedComponent.id, {
        size: { ...selectedComponent.size, height },
      });
    }
  };

  const handlePropertyChange = (key: string, value: any) => {
    updateComponent(selectedComponent.id, {
      properties: { ...selectedComponent.properties, [key]: value },
    });
  };

  return (
    <div data-testid="property-editor" role="complementary" aria-label="Property editor">
      <h2>Properties</h2>

      <div data-testid="component-info">
        <div>Type: {selectedComponent.type}</div>
        <div>ID: {selectedComponent.id}</div>
      </div>

      <div data-testid="basic-properties">
        <label htmlFor="component-name">
          Name
          <input
            id="component-name"
            type="text"
            value={selectedComponent.name}
            onChange={handleNameChange}
            aria-label="Component name"
          />
        </label>
      </div>

      <div data-testid="position-properties">
        <h3>Position</h3>
        <label htmlFor="position-x">
          X
          <input
            id="position-x"
            type="number"
            value={selectedComponent.position.x}
            onChange={handlePositionXChange}
            aria-label="X position"
          />
        </label>
        <label htmlFor="position-y">
          Y
          <input
            id="position-y"
            type="number"
            value={selectedComponent.position.y}
            onChange={handlePositionYChange}
            aria-label="Y position"
          />
        </label>
      </div>

      <div data-testid="size-properties">
        <h3>Size</h3>
        <label htmlFor="width">
          Width
          <input
            id="width"
            type="number"
            value={selectedComponent.size.width}
            onChange={handleWidthChange}
            min="0"
            aria-label="Width"
          />
        </label>
        <label htmlFor="height">
          Height
          <input
            id="height"
            type="number"
            value={selectedComponent.size.height}
            onChange={handleHeightChange}
            min="0"
            aria-label="Height"
          />
        </label>
      </div>

      {selectedComponent.type === 'button' && (
        <div data-testid="button-properties">
          <h3>Button Properties</h3>
          <label htmlFor="button-text">
            Text
            <input
              id="button-text"
              type="text"
              value={selectedComponent.properties.text || ''}
              onChange={(e) => handlePropertyChange('text', e.target.value)}
              aria-label="Button text"
            />
          </label>
        </div>
      )}

      {selectedComponent.type === 'text' && (
        <div data-testid="text-properties">
          <h3>Text Properties</h3>
          <label htmlFor="text-content">
            Content
            <textarea
              id="text-content"
              value={selectedComponent.properties.content || ''}
              onChange={(e) => handlePropertyChange('content', e.target.value)}
              aria-label="Text content"
            />
          </label>
        </div>
      )}
    </div>
  );
};

// =============================================================================
// TESTS
// =============================================================================

describe('PropertyEditor Component', () => {
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
      render(<MockPropertyEditor />);

      const editor = screen.getByTestId('property-editor');
      expect(editor).toBeInTheDocument();
    });

    it('should have correct ARIA attributes', () => {
      render(<MockPropertyEditor />);

      const editor = screen.getByRole('complementary');
      expect(editor).toHaveAttribute('aria-label', 'Property editor');
    });

    it('should show "No component selected" when nothing is selected', () => {
      render(<MockPropertyEditor />);

      const message = screen.getByTestId('no-selection');
      expect(message).toHaveTextContent('No component selected');
    });

    it('should show properties when a component is selected', () => {
      const { addComponent, selectComponent } = usePageBuilderStore.getState();

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
      selectComponent(id);

      render(<MockPropertyEditor />);

      expect(screen.getByText('Properties')).toBeInTheDocument();
      expect(screen.getByTestId('basic-properties')).toBeInTheDocument();
      expect(screen.getByTestId('position-properties')).toBeInTheDocument();
      expect(screen.getByTestId('size-properties')).toBeInTheDocument();
    });

    it('should display component information', () => {
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

      render(<MockPropertyEditor />);

      const info = screen.getByTestId('component-info');
      expect(info).toHaveTextContent('Type: button');
      expect(info).toHaveTextContent(`ID: ${id}`);
    });

    it('should show type-specific properties for buttons', () => {
      const { addComponent, selectComponent } = usePageBuilderStore.getState();

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

      render(<MockPropertyEditor />);

      expect(screen.getByTestId('button-properties')).toBeInTheDocument();
      expect(screen.getByLabelText('Button text')).toHaveValue('Click me');
    });

    it('should show type-specific properties for text components', () => {
      const { addComponent, selectComponent } = usePageBuilderStore.getState();

      const componentData: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
        type: 'text',
        name: 'Text',
        parentId: null,
        childIds: [],
        position: { x: 0, y: 0 },
        size: { width: 200, height: 30 },
        properties: { content: 'Hello World' },
        styles: {},
        locked: false,
        hidden: false,
      };

      const id = addComponent(componentData);
      selectComponent(id);

      render(<MockPropertyEditor />);

      expect(screen.getByTestId('text-properties')).toBeInTheDocument();
      expect(screen.getByLabelText('Text content')).toHaveValue('Hello World');
    });
  });

  // ===========================================================================
  // PROPERTY UPDATE TESTS
  // ===========================================================================

  describe('Property Updates', () => {
    it('should update component name', async () => {
      const user = userEvent.setup();
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

      render(<MockPropertyEditor />);

      const nameInput = screen.getByLabelText('Component name');
      await user.clear(nameInput);
      await user.type(nameInput, 'Submit Button');

      const state = usePageBuilderStore.getState();
      expect(state.canvas.components.byId[id].name).toBe('Submit Button');
    });

    it('should update position X', async () => {
      const user = userEvent.setup();
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

      render(<MockPropertyEditor />);

      const xInput = screen.getByLabelText('X position');
      await user.clear(xInput);
      await user.type(xInput, '150');

      const state = usePageBuilderStore.getState();
      expect(state.canvas.components.byId[id].position.x).toBe(150);
    });

    it('should update position Y', async () => {
      const user = userEvent.setup();
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

      render(<MockPropertyEditor />);

      const yInput = screen.getByLabelText('Y position');
      await user.clear(yInput);
      await user.type(yInput, '250');

      const state = usePageBuilderStore.getState();
      expect(state.canvas.components.byId[id].position.y).toBe(250);
    });

    it('should update width', async () => {
      const user = userEvent.setup();
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

      render(<MockPropertyEditor />);

      const widthInput = screen.getByLabelText('Width');
      await user.clear(widthInput);
      await user.type(widthInput, '200');

      const state = usePageBuilderStore.getState();
      expect(state.canvas.components.byId[id].size.width).toBe(200);
    });

    it('should update height', async () => {
      const user = userEvent.setup();
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

      render(<MockPropertyEditor />);

      const heightInput = screen.getByLabelText('Height');
      await user.clear(heightInput);
      await user.type(heightInput, '60');

      const state = usePageBuilderStore.getState();
      expect(state.canvas.components.byId[id].size.height).toBe(60);
    });

    it('should update button text property', async () => {
      const user = userEvent.setup();
      const { addComponent, selectComponent } = usePageBuilderStore.getState();

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
      selectComponent(id);

      render(<MockPropertyEditor />);

      const textInput = screen.getByLabelText('Button text');
      await user.clear(textInput);
      await user.type(textInput, 'Submit');

      const state = usePageBuilderStore.getState();
      expect(state.canvas.components.byId[id].properties.text).toBe('Submit');
    });

    it('should update text content property', async () => {
      const user = userEvent.setup();
      const { addComponent, selectComponent } = usePageBuilderStore.getState();

      const componentData: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
        type: 'text',
        name: 'Text',
        parentId: null,
        childIds: [],
        position: { x: 0, y: 0 },
        size: { width: 200, height: 30 },
        properties: { content: 'Hello' },
        styles: {},
        locked: false,
        hidden: false,
      };

      const id = addComponent(componentData);
      selectComponent(id);

      render(<MockPropertyEditor />);

      const contentInput = screen.getByLabelText('Text content');
      await user.clear(contentInput);
      await user.type(contentInput, 'Hello World');

      const state = usePageBuilderStore.getState();
      expect(state.canvas.components.byId[id].properties.content).toBe('Hello World');
    });
  });

  // ===========================================================================
  // VALIDATION TESTS
  // ===========================================================================

  describe('Validation', () => {
    it('should enforce minimum width of 0', async () => {
      const user = userEvent.setup();
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

      render(<MockPropertyEditor />);

      const widthInput = screen.getByLabelText('Width') as HTMLInputElement;
      expect(widthInput).toHaveAttribute('min', '0');
    });

    it('should enforce minimum height of 0', async () => {
      const user = userEvent.setup();
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

      render(<MockPropertyEditor />);

      const heightInput = screen.getByLabelText('Height') as HTMLInputElement;
      expect(heightInput).toHaveAttribute('min', '0');
    });

    it('should handle invalid numeric input gracefully', async () => {
      const user = userEvent.setup();
      const { addComponent, selectComponent } = usePageBuilderStore.getState();

      const componentData: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
        type: 'button',
        name: 'Button',
        parentId: null,
        childIds: [],
        position: { x: 100, y: 200 },
        size: { width: 100, height: 40 },
        properties: {},
        styles: {},
        locked: false,
        hidden: false,
      };

      const id = addComponent(componentData);
      selectComponent(id);

      render(<MockPropertyEditor />);

      const xInput = screen.getByLabelText('X position');
      await user.clear(xInput);
      await user.type(xInput, 'abc');

      const state = usePageBuilderStore.getState();
      // Should default to 0 for invalid input
      expect(state.canvas.components.byId[id].position.x).toBe(0);
    });
  });

  // ===========================================================================
  // MULTI-SELECT TESTS
  // ===========================================================================

  describe('Multi-Select', () => {
    it('should show "No component selected" when multiple components are selected', () => {
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

      render(<MockPropertyEditor />);

      // Current mock implementation shows "No component selected" for multi-select
      // Real implementation might show batch edit UI
      expect(screen.getByTestId('no-selection')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // ACCESSIBILITY TESTS
  // ===========================================================================

  describe('Accessibility', () => {
    it('should have complementary landmark role', () => {
      render(<MockPropertyEditor />);

      const editor = screen.getByRole('complementary');
      expect(editor).toBeInTheDocument();
    });

    it('should have descriptive labels for all inputs', () => {
      const { addComponent, selectComponent } = usePageBuilderStore.getState();

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
      selectComponent(id);

      render(<MockPropertyEditor />);

      expect(screen.getByLabelText('Component name')).toBeInTheDocument();
      expect(screen.getByLabelText('X position')).toBeInTheDocument();
      expect(screen.getByLabelText('Y position')).toBeInTheDocument();
      expect(screen.getByLabelText('Width')).toBeInTheDocument();
      expect(screen.getByLabelText('Height')).toBeInTheDocument();
      expect(screen.getByLabelText('Button text')).toBeInTheDocument();
    });

    it('should associate labels with inputs correctly', () => {
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

      render(<MockPropertyEditor />);

      const nameInput = screen.getByLabelText('Component name');
      expect(nameInput).toHaveAttribute('id', 'component-name');
    });
  });
});
