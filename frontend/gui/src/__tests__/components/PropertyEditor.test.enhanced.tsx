/**
 * PropertyEditor Component Tests - Enhanced
 *
 * Comprehensive tests for the PropertyEditor component including:
 * - Form rendering and field associations
 * - User input handling and validation
 * - Accessibility (form labels, ARIA attributes)
 * - Debounced updates for text inputs
 * - Multi-component selection
 * - Different component types
 *
 * @group components
 * @group forms
 * @group accessibility
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { PropertyEditor } from '../../components/properties/PropertyEditor';
import { usePageBuilderStore } from '../../store';

// Extend expect with jest-axe matchers
expect.extend(toHaveNoViolations);

describe('PropertyEditor Component', () => {
  beforeEach(() => {
    // Reset store before each test
    const { reset } = usePageBuilderStore.getState();
    reset();
    vi.clearAllTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ===========================================================================
  // RENDERING TESTS
  // ===========================================================================

  describe('Rendering', () => {
    it('should render empty state when no component is selected', () => {
      render(<PropertyEditor />);

      expect(screen.getByText(/no component selected/i)).toBeInTheDocument();
    });

    it('should render component properties when component is selected', () => {
      const { addComponent, selectComponent } = usePageBuilderStore.getState();

      const id = addComponent({
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
      });

      selectComponent(id);

      render(<PropertyEditor />);

      expect(screen.getByLabelText('Name')).toBeInTheDocument();
      expect(screen.getByLabelText('X Position')).toBeInTheDocument();
      expect(screen.getByLabelText('Y Position')).toBeInTheDocument();
      expect(screen.getByLabelText('Width')).toBeInTheDocument();
      expect(screen.getByLabelText('Height')).toBeInTheDocument();
    });

    it('should display multi-select state when multiple components are selected', () => {
      const { addComponent, selectComponent } = usePageBuilderStore.getState();

      const id1 = addComponent({
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
      });

      const id2 = addComponent({
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
      });

      selectComponent(id1);
      selectComponent(id2, true);

      render(<PropertyEditor />);

      expect(screen.getByText(/2 components selected/i)).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // FORM FIELD TESTS
  // ===========================================================================

  describe('Form Fields', () => {
    let componentId: string;

    beforeEach(() => {
      const { addComponent, selectComponent } = usePageBuilderStore.getState();

      componentId = addComponent({
        type: 'button',
        name: 'Test Button',
        parentId: null,
        childIds: [],
        position: { x: 100, y: 200 },
        size: { width: 120, height: 40 },
        properties: { text: 'Click me' },
        styles: {},
        locked: false,
        hidden: false,
      });

      selectComponent(componentId);
    });

    it('should display component name in name field', () => {
      render(<PropertyEditor />);

      const nameField = screen.getByLabelText('Name') as HTMLInputElement;
      expect(nameField.value).toBe('Test Button');
    });

    it('should display position values', () => {
      render(<PropertyEditor />);

      const xField = screen.getByLabelText('X Position') as HTMLInputElement;
      const yField = screen.getByLabelText('Y Position') as HTMLInputElement;

      expect(xField.value).toBe('100');
      expect(yField.value).toBe('200');
    });

    it('should display size values', () => {
      render(<PropertyEditor />);

      const widthField = screen.getByLabelText('Width') as HTMLInputElement;
      const heightField = screen.getByLabelText('Height') as HTMLInputElement;

      expect(widthField.value).toBe('120');
      expect(heightField.value).toBe('40');
    });

    it('should have correct input types for numeric fields', () => {
      render(<PropertyEditor />);

      const xField = screen.getByLabelText('X Position');
      const widthField = screen.getByLabelText('Width');

      expect(xField).toHaveAttribute('type', 'number');
      expect(widthField).toHaveAttribute('type', 'number');
    });

    it('should have min attribute on size fields', () => {
      render(<PropertyEditor />);

      const widthField = screen.getByLabelText('Width');
      const heightField = screen.getByLabelText('Height');

      expect(widthField).toHaveAttribute('min');
      expect(heightField).toHaveAttribute('min');
    });
  });

  // ===========================================================================
  // USER INTERACTION TESTS
  // ===========================================================================

  describe('User Interactions', () => {
    let componentId: string;

    beforeEach(() => {
      const { addComponent, selectComponent } = usePageBuilderStore.getState();

      componentId = addComponent({
        type: 'button',
        name: 'Test Button',
        parentId: null,
        childIds: [],
        position: { x: 100, y: 200 },
        size: { width: 120, height: 40 },
        properties: { text: 'Click me' },
        styles: {},
        locked: false,
        hidden: false,
      });

      selectComponent(componentId);
    });

    it('should update component name when typing (debounced)', async () => {
      vi.useFakeTimers();
      const user = userEvent.setup({ delay: null });

      render(<PropertyEditor />);

      const nameField = screen.getByLabelText('Name');
      await user.clear(nameField);
      await user.type(nameField, 'New Name');

      // Fast-forward time to trigger debounce
      vi.advanceTimersByTime(600);

      await waitFor(() => {
        const state = usePageBuilderStore.getState();
        expect(state.canvas.components.byId[componentId].name).toBe('New Name');
      });

      vi.useRealTimers();
    });

    it('should update X position immediately', async () => {
      const user = userEvent.setup();

      render(<PropertyEditor />);

      const xField = screen.getByLabelText('X Position');
      await user.clear(xField);
      await user.type(xField, '250');

      const state = usePageBuilderStore.getState();
      expect(state.canvas.components.byId[componentId].position.x).toBe(250);
    });

    it('should update Y position immediately', async () => {
      const user = userEvent.setup();

      render(<PropertyEditor />);

      const yField = screen.getByLabelText('Y Position');
      await user.clear(yField);
      await user.type(yField, '350');

      const state = usePageBuilderStore.getState();
      expect(state.canvas.components.byId[componentId].position.y).toBe(350);
    });

    it('should update width immediately', async () => {
      const user = userEvent.setup();

      render(<PropertyEditor />);

      const widthField = screen.getByLabelText('Width');
      await user.clear(widthField);
      await user.type(widthField, '200');

      const state = usePageBuilderStore.getState();
      expect(state.canvas.components.byId[componentId].size.width).toBe(200);
    });

    it('should update height immediately', async () => {
      const user = userEvent.setup();

      render(<PropertyEditor />);

      const heightField = screen.getByLabelText('Height');
      await user.clear(heightField);
      await user.type(heightField, '60');

      const state = usePageBuilderStore.getState();
      expect(state.canvas.components.byId[componentId].size.height).toBe(60);
    });

    it('should toggle locked state', async () => {
      const user = userEvent.setup();

      render(<PropertyEditor />);

      const lockButton = screen.getByLabelText(/lock/i);
      await user.click(lockButton);

      const state = usePageBuilderStore.getState();
      expect(state.canvas.components.byId[componentId].locked).toBe(true);
    });

    it('should toggle hidden state', async () => {
      const user = userEvent.setup();

      render(<PropertyEditor />);

      const hideButton = screen.getByLabelText(/hide/i);
      await user.click(hideButton);

      const state = usePageBuilderStore.getState();
      expect(state.canvas.components.byId[componentId].hidden).toBe(true);
    });
  });

  // ===========================================================================
  // DEBOUNCING TESTS
  // ===========================================================================

  describe('Debounced Updates', () => {
    let componentId: string;

    beforeEach(() => {
      vi.useFakeTimers();
      const { addComponent, selectComponent } = usePageBuilderStore.getState();

      componentId = addComponent({
        type: 'text',
        name: 'Text Field',
        parentId: null,
        childIds: [],
        position: { x: 0, y: 0 },
        size: { width: 200, height: 30 },
        properties: { text: 'Hello' },
        styles: {},
        locked: false,
        hidden: false,
      });

      selectComponent(componentId);
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should debounce name updates', async () => {
      const user = userEvent.setup({ delay: null });

      render(<PropertyEditor />);

      const nameField = screen.getByLabelText('Name');
      await user.clear(nameField);
      await user.type(nameField, 'T');

      // Should not update immediately
      let state = usePageBuilderStore.getState();
      expect(state.canvas.components.byId[componentId].name).toBe('Text Field');

      // Fast-forward to trigger debounce
      vi.advanceTimersByTime(600);

      await waitFor(() => {
        state = usePageBuilderStore.getState();
        expect(state.canvas.components.byId[componentId].name).toBe('T');
      });
    });

    it('should batch multiple keystrokes into single update', async () => {
      const user = userEvent.setup({ delay: null });
      const updateSpy = vi.spyOn(usePageBuilderStore.getState(), 'updateComponent');

      render(<PropertyEditor />);

      const nameField = screen.getByLabelText('Name');
      await user.clear(nameField);
      await user.type(nameField, 'New Name');

      // Should not have updated yet
      expect(updateSpy).toHaveBeenCalledTimes(0);

      // Fast-forward to trigger debounce
      vi.advanceTimersByTime(600);

      await waitFor(() => {
        // Should have called updateComponent only once for all keystrokes
        expect(updateSpy).toHaveBeenCalledTimes(1);
      });
    });
  });

  // ===========================================================================
  // ACCESSIBILITY TESTS
  // ===========================================================================

  describe('Accessibility', () => {
    beforeEach(() => {
      const { addComponent, selectComponent } = usePageBuilderStore.getState();

      const id = addComponent({
        type: 'button',
        name: 'Test Button',
        parentId: null,
        childIds: [],
        position: { x: 100, y: 200 },
        size: { width: 120, height: 40 },
        properties: {},
        styles: {},
        locked: false,
        hidden: false,
      });

      selectComponent(id);
    });

    it('should have no accessibility violations', async () => {
      const { container } = render(<PropertyEditor />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper label associations via htmlFor and id', () => {
      render(<PropertyEditor />);

      const nameLabel = screen.getByText('Name');
      const nameField = screen.getByLabelText('Name');

      expect(nameLabel).toHaveAttribute('for', 'component-name');
      expect(nameField).toHaveAttribute('id', 'component-name');
    });

    it('should have aria-describedby for help text', () => {
      render(<PropertyEditor />);

      const nameField = screen.getByLabelText('Name');
      expect(nameField).toHaveAttribute('aria-describedby', 'component-name-description');
    });

    it('should have proper label associations for all fields', () => {
      render(<PropertyEditor />);

      // Check all fields have proper labels
      expect(screen.getByLabelText('Name')).toBeInTheDocument();
      expect(screen.getByLabelText('X Position')).toBeInTheDocument();
      expect(screen.getByLabelText('Y Position')).toBeInTheDocument();
      expect(screen.getByLabelText('Width')).toBeInTheDocument();
      expect(screen.getByLabelText('Height')).toBeInTheDocument();
    });

    it('should have complementary role for property editor', () => {
      render(<PropertyEditor />);

      const propertyEditor = screen.getByRole('complementary');
      expect(propertyEditor).toBeInTheDocument();
    });

    it('should have descriptive aria-label', () => {
      render(<PropertyEditor />);

      const propertyEditor = screen.getByRole('complementary');
      expect(propertyEditor).toHaveAttribute('aria-label', 'Property editor');
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();

      render(<PropertyEditor />);

      const nameField = screen.getByLabelText('Name');
      const xField = screen.getByLabelText('X Position');

      nameField.focus();
      await user.keyboard('{Tab}');

      expect(document.activeElement).toBe(xField);
    });
  });

  // ===========================================================================
  // INTEGRATION TESTS
  // ===========================================================================

  describe('Integration with Store', () => {
    it('should update displayed values when store changes', () => {
      const { addComponent, selectComponent, updateComponent } = usePageBuilderStore.getState();

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

      selectComponent(id);

      const { rerender } = render(<PropertyEditor />);

      updateComponent(id, { name: 'Updated Button' });
      rerender(<PropertyEditor />);

      const nameField = screen.getByLabelText('Name') as HTMLInputElement;
      expect(nameField.value).toBe('Updated Button');
    });

    it('should reflect selection changes', () => {
      const { addComponent, selectComponent } = usePageBuilderStore.getState();

      const id1 = addComponent({
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
      });

      const id2 = addComponent({
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
      });

      selectComponent(id1);

      const { rerender } = render(<PropertyEditor />);

      selectComponent(id2, false);
      rerender(<PropertyEditor />);

      const nameField = screen.getByLabelText('Name') as HTMLInputElement;
      expect(nameField.value).toBe('Button 2');
    });
  });

  // ===========================================================================
  // EDGE CASES
  // ===========================================================================

  describe('Edge Cases', () => {
    it('should handle missing component gracefully', () => {
      const { selectComponent } = usePageBuilderStore.getState();
      selectComponent('non-existent-id');

      render(<PropertyEditor />);

      expect(screen.getByText(/no component selected/i)).toBeInTheDocument();
    });

    it('should handle negative position values', async () => {
      const { addComponent, selectComponent } = usePageBuilderStore.getState();

      const id = addComponent({
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
      });

      selectComponent(id);

      render(<PropertyEditor />);

      const xField = screen.getByLabelText('X Position') as HTMLInputElement;
      const yField = screen.getByLabelText('Y Position') as HTMLInputElement;

      expect(xField.value).toBe('-50');
      expect(yField.value).toBe('-100');
    });

    it('should handle zero size values', async () => {
      const { addComponent, selectComponent } = usePageBuilderStore.getState();

      const id = addComponent({
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
      });

      selectComponent(id);

      render(<PropertyEditor />);

      const widthField = screen.getByLabelText('Width') as HTMLInputElement;
      const heightField = screen.getByLabelText('Height') as HTMLInputElement;

      expect(widthField.value).toBe('0');
      expect(heightField.value).toBe('0');
    });
  });

  // ===========================================================================
  // VISUAL REGRESSION SNAPSHOTS
  // ===========================================================================

  describe('Visual Snapshots', () => {
    it('should match snapshot for empty state', () => {
      const { container } = render(<PropertyEditor />);
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot with selected component', () => {
      const { addComponent, selectComponent } = usePageBuilderStore.getState();

      const id = addComponent({
        type: 'button',
        name: 'Test Button',
        parentId: null,
        childIds: [],
        position: { x: 100, y: 200 },
        size: { width: 120, height: 40 },
        properties: {},
        styles: {},
        locked: false,
        hidden: false,
      });

      selectComponent(id);

      const { container } = render(<PropertyEditor />);
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot with multi-select', () => {
      const { addComponent, selectComponent } = usePageBuilderStore.getState();

      const id1 = addComponent({
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
      });

      const id2 = addComponent({
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
      });

      selectComponent(id1);
      selectComponent(id2, true);

      const { container } = render(<PropertyEditor />);
      expect(container).toMatchSnapshot();
    });
  });
});
