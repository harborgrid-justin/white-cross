/**
 * Toolbar Component Tests
 *
 * Comprehensive tests for the main Toolbar component including:
 * - Rendering and visual state
 * - User interactions (clicks, keyboard)
 * - Accessibility (WCAG 2.1 AA compliance)
 * - State management integration
 * - Keyboard navigation
 * - ARIA attributes and roles
 *
 * @group components
 * @group accessibility
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Toolbar } from '../../components/toolbar/Toolbar';
import { usePageBuilderStore } from '../../store';

// Extend expect with jest-axe matchers
expect.extend(toHaveNoViolations);

describe('Toolbar Component', () => {
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
      render(<Toolbar />);

      const toolbar = screen.getByRole('banner');
      expect(toolbar).toBeInTheDocument();
    });

    it('should display project name', () => {
      render(<Toolbar projectName="Test Project" />);

      expect(screen.getByText('Test Project')).toBeInTheDocument();
    });

    it('should display default project name when not provided', () => {
      render(<Toolbar />);

      expect(screen.getByText('Untitled Project')).toBeInTheDocument();
    });

    it('should render all main control buttons', () => {
      render(<Toolbar />);

      expect(screen.getByLabelText('Undo')).toBeInTheDocument();
      expect(screen.getByLabelText('Redo')).toBeInTheDocument();
      expect(screen.getByLabelText('Save project')).toBeInTheDocument();
      expect(screen.getByLabelText(/preview mode/i)).toBeInTheDocument();
      expect(screen.getByLabelText('Export options')).toBeInTheDocument();
    });

    it('should render logo icon', () => {
      render(<Toolbar />);

      const logo = screen.getByRole('banner').querySelector('svg');
      expect(logo).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // UNDO/REDO FUNCTIONALITY
  // ===========================================================================

  describe('Undo/Redo', () => {
    it('should have undo button disabled initially', () => {
      render(<Toolbar />);

      const undoButton = screen.getByLabelText('Undo');
      expect(undoButton).toBeDisabled();
    });

    it('should have redo button disabled initially', () => {
      render(<Toolbar />);

      const redoButton = screen.getByLabelText('Redo');
      expect(redoButton).toBeDisabled();
    });

    it('should enable undo button after adding a component', () => {
      const { addComponent } = usePageBuilderStore.getState();

      addComponent({
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

      render(<Toolbar />);

      const undoButton = screen.getByLabelText('Undo');
      expect(undoButton).not.toBeDisabled();
    });

    it('should enable redo button after undoing', () => {
      const { addComponent, undo } = usePageBuilderStore.getState();

      addComponent({
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

      undo();

      render(<Toolbar />);

      const redoButton = screen.getByLabelText('Redo');
      expect(redoButton).not.toBeDisabled();
    });

    it('should call undo when undo button is clicked', async () => {
      const user = userEvent.setup();
      const { addComponent } = usePageBuilderStore.getState();

      const componentId = addComponent({
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

      render(<Toolbar />);

      const undoButton = screen.getByLabelText('Undo');
      await user.click(undoButton);

      const state = usePageBuilderStore.getState();
      expect(state.canvas.components.byId[componentId]).toBeUndefined();
    });

    it('should call redo when redo button is clicked', async () => {
      const user = userEvent.setup();
      const { addComponent, undo } = usePageBuilderStore.getState();

      const componentId = addComponent({
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

      undo();

      render(<Toolbar />);

      const redoButton = screen.getByLabelText('Redo');
      await user.click(redoButton);

      const state = usePageBuilderStore.getState();
      expect(state.canvas.components.byId[componentId]).toBeDefined();
    });

    it('should show tooltip on undo button hover', () => {
      render(<Toolbar />);

      const undoButton = screen.getByLabelText('Undo');
      expect(undoButton).toHaveAttribute('title', 'Undo (Ctrl+Z)');
    });

    it('should show tooltip on redo button hover', () => {
      render(<Toolbar />);

      const redoButton = screen.getByLabelText('Redo');
      expect(redoButton).toHaveAttribute('title', 'Redo (Ctrl+Shift+Z)');
    });
  });

  // ===========================================================================
  // SAVE FUNCTIONALITY
  // ===========================================================================

  describe('Save', () => {
    it('should call onSave callback when save button is clicked', async () => {
      const user = userEvent.setup();
      const onSave = vi.fn();

      render(<Toolbar onSave={onSave} />);

      const saveButton = screen.getByLabelText('Save project');
      await user.click(saveButton);

      expect(onSave).toHaveBeenCalledOnce();
    });

    it('should not error if onSave is not provided', async () => {
      const user = userEvent.setup();

      render(<Toolbar />);

      const saveButton = screen.getByLabelText('Save project');
      await user.click(saveButton);

      // Should not throw
      expect(saveButton).toBeInTheDocument();
    });

    it('should show tooltip on save button hover', () => {
      render(<Toolbar />);

      const saveButton = screen.getByLabelText('Save project');
      expect(saveButton).toHaveAttribute('title', 'Save (Ctrl+S)');
    });
  });

  // ===========================================================================
  // PREVIEW FUNCTIONALITY
  // ===========================================================================

  describe('Preview', () => {
    it('should toggle preview mode when preview button is clicked', async () => {
      const user = userEvent.setup();

      render(<Toolbar />);

      const previewButton = screen.getByLabelText('Enter preview mode');
      await user.click(previewButton);

      const state = usePageBuilderStore.getState();
      expect(state.preview.isPreviewMode).toBe(true);
    });

    it('should show correct aria-pressed state when preview is active', () => {
      const { togglePreview } = usePageBuilderStore.getState();
      togglePreview();

      render(<Toolbar />);

      const previewButton = screen.getByLabelText('Exit preview mode');
      expect(previewButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('should change button text when preview is active', () => {
      const { togglePreview } = usePageBuilderStore.getState();
      togglePreview();

      render(<Toolbar />);

      expect(screen.getByLabelText('Exit preview mode')).toBeInTheDocument();
    });

    it('should show tooltip on preview button hover', () => {
      render(<Toolbar />);

      const previewButton = screen.getByLabelText(/preview mode/i);
      expect(previewButton).toHaveAttribute('title', 'Preview mode (Ctrl+P)');
    });
  });

  // ===========================================================================
  // EXPORT FUNCTIONALITY
  // ===========================================================================

  describe('Export Dropdown', () => {
    it('should open export menu when export button is clicked', async () => {
      const user = userEvent.setup();

      render(<Toolbar />);

      const exportButton = screen.getByLabelText('Export options');
      await user.click(exportButton);

      expect(screen.getByText('Export as JSON')).toBeInTheDocument();
      expect(screen.getByText('Export as Code')).toBeInTheDocument();
      expect(screen.getByText('Download as ZIP')).toBeInTheDocument();
    });

    it('should have proper ARIA attributes when menu is closed', () => {
      render(<Toolbar />);

      const exportButton = screen.getByLabelText('Export options');
      expect(exportButton).toHaveAttribute('aria-expanded', 'false');
      expect(exportButton).toHaveAttribute('aria-haspopup', 'menu');
    });

    it('should have proper ARIA attributes when menu is open', async () => {
      const user = userEvent.setup();

      render(<Toolbar />);

      const exportButton = screen.getByLabelText('Export options');
      await user.click(exportButton);

      expect(exportButton).toHaveAttribute('aria-expanded', 'true');
    });

    it('should call onExport with json when Export as JSON is clicked', async () => {
      const user = userEvent.setup();
      const onExport = vi.fn();

      render(<Toolbar onExport={onExport} />);

      const exportButton = screen.getByLabelText('Export options');
      await user.click(exportButton);

      const jsonOption = screen.getByText('Export as JSON');
      await user.click(jsonOption);

      expect(onExport).toHaveBeenCalledWith('json');
    });

    it('should call onExport with code when Export as Code is clicked', async () => {
      const user = userEvent.setup();
      const onExport = vi.fn();

      render(<Toolbar onExport={onExport} />);

      const exportButton = screen.getByLabelText('Export options');
      await user.click(exportButton);

      const codeOption = screen.getByText('Export as Code');
      await user.click(codeOption);

      expect(onExport).toHaveBeenCalledWith('code');
    });

    it('should call onExport with zip when Download as ZIP is clicked', async () => {
      const user = userEvent.setup();
      const onExport = vi.fn();

      render(<Toolbar onExport={onExport} />);

      const exportButton = screen.getByLabelText('Export options');
      await user.click(exportButton);

      const zipOption = screen.getByText('Download as ZIP');
      await user.click(zipOption);

      expect(onExport).toHaveBeenCalledWith('zip');
    });

    it('should close menu after selecting an option', async () => {
      const user = userEvent.setup();

      render(<Toolbar />);

      const exportButton = screen.getByLabelText('Export options');
      await user.click(exportButton);

      const jsonOption = screen.getByText('Export as JSON');
      await user.click(jsonOption);

      expect(screen.queryByText('Export as JSON')).not.toBeInTheDocument();
    });

    it('should close menu when clicking backdrop', async () => {
      const user = userEvent.setup();

      render(<Toolbar />);

      const exportButton = screen.getByLabelText('Export options');
      await user.click(exportButton);

      const backdrop = screen.getByRole('banner').parentElement?.querySelector('.fixed.inset-0');
      if (backdrop) {
        await user.click(backdrop as Element);
      }

      expect(screen.queryByText('Export as JSON')).not.toBeInTheDocument();
    });
  });

  // ===========================================================================
  // KEYBOARD NAVIGATION
  // ===========================================================================

  describe('Keyboard Navigation', () => {
    it('should open menu on ArrowDown from export button', async () => {
      const user = userEvent.setup();

      render(<Toolbar />);

      const exportButton = screen.getByLabelText('Export options');
      exportButton.focus();
      await user.keyboard('{ArrowDown}');

      expect(screen.getByText('Export as JSON')).toBeInTheDocument();
    });

    it('should close menu on Escape key', async () => {
      const user = userEvent.setup();

      render(<Toolbar />);

      const exportButton = screen.getByLabelText('Export options');
      await user.click(exportButton);
      await user.keyboard('{Escape}');

      expect(screen.queryByText('Export as JSON')).not.toBeInTheDocument();
    });

    it('should navigate menu items with ArrowDown', async () => {
      const user = userEvent.setup();

      render(<Toolbar />);

      const exportButton = screen.getByLabelText('Export options');
      await user.click(exportButton);

      const jsonOption = screen.getByText('Export as JSON');
      await user.keyboard('{ArrowDown}');

      const codeOption = screen.getByText('Export as Code');
      expect(document.activeElement).toBe(codeOption.closest('button'));
    });

    it('should navigate menu items with ArrowUp', async () => {
      const user = userEvent.setup();

      render(<Toolbar />);

      const exportButton = screen.getByLabelText('Export options');
      await user.click(exportButton);

      await user.keyboard('{ArrowDown}'); // Move to Code
      await user.keyboard('{ArrowUp}'); // Move back to JSON

      const jsonOption = screen.getByText('Export as JSON');
      expect(document.activeElement).toBe(jsonOption.closest('button'));
    });

    it('should activate menu item with Enter key', async () => {
      const user = userEvent.setup();
      const onExport = vi.fn();

      render(<Toolbar onExport={onExport} />);

      const exportButton = screen.getByLabelText('Export options');
      await user.click(exportButton);
      await user.keyboard('{Enter}');

      expect(onExport).toHaveBeenCalledWith('json');
    });

    it('should activate menu item with Space key', async () => {
      const user = userEvent.setup();
      const onExport = vi.fn();

      render(<Toolbar onExport={onExport} />);

      const exportButton = screen.getByLabelText('Export options');
      await user.click(exportButton);
      await user.keyboard(' ');

      expect(onExport).toHaveBeenCalledWith('json');
    });

    it('should jump to first item with Home key', async () => {
      const user = userEvent.setup();

      render(<Toolbar />);

      const exportButton = screen.getByLabelText('Export options');
      await user.click(exportButton);
      await user.keyboard('{ArrowDown}'); // Move to second item
      await user.keyboard('{Home}'); // Jump to first

      const jsonOption = screen.getByText('Export as JSON');
      expect(document.activeElement).toBe(jsonOption.closest('button'));
    });

    it('should jump to last item with End key', async () => {
      const user = userEvent.setup();

      render(<Toolbar />);

      const exportButton = screen.getByLabelText('Export options');
      await user.click(exportButton);
      await user.keyboard('{End}');

      const zipOption = screen.getByText('Download as ZIP');
      expect(document.activeElement).toBe(zipOption.closest('button'));
    });
  });

  // ===========================================================================
  // ACCESSIBILITY TESTS
  // ===========================================================================

  describe('Accessibility', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<Toolbar />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations with menu open', async () => {
      const user = userEvent.setup();
      const { container } = render(<Toolbar />);

      const exportButton = screen.getByLabelText('Export options');
      await user.click(exportButton);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have banner role for toolbar', () => {
      render(<Toolbar />);

      const toolbar = screen.getByRole('banner');
      expect(toolbar).toBeInTheDocument();
    });

    it('should have proper button roles', () => {
      render(<Toolbar />);

      expect(screen.getByRole('button', { name: 'Undo' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Redo' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Save project' })).toBeInTheDocument();
    });

    it('should have menu role for export dropdown', async () => {
      const user = userEvent.setup();

      render(<Toolbar />);

      const exportButton = screen.getByLabelText('Export options');
      await user.click(exportButton);

      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('should have menuitem roles for export options', async () => {
      const user = userEvent.setup();

      render(<Toolbar />);

      const exportButton = screen.getByLabelText('Export options');
      await user.click(exportButton);

      const menuItems = screen.getAllByRole('menuitem');
      expect(menuItems).toHaveLength(3);
    });

    it('should manage focus correctly when opening menu', async () => {
      const user = userEvent.setup();

      render(<Toolbar />);

      const exportButton = screen.getByLabelText('Export options');
      await user.click(exportButton);

      const firstMenuItem = screen.getByText('Export as JSON').closest('button');
      expect(document.activeElement).toBe(firstMenuItem);
    });

    it('should return focus to trigger button when closing menu', async () => {
      const user = userEvent.setup();

      render(<Toolbar />);

      const exportButton = screen.getByLabelText('Export options');
      await user.click(exportButton);
      await user.keyboard('{Escape}');

      expect(document.activeElement).toBe(exportButton);
    });

    it('should have proper tabIndex for disabled buttons', () => {
      render(<Toolbar />);

      const undoButton = screen.getByLabelText('Undo');
      expect(undoButton).toBeDisabled();
      // Disabled buttons should not have tabIndex=-1, rely on disabled attribute
    });

    it('should have aria-hidden on decorative icons', () => {
      const { container } = render(<Toolbar />);

      const icons = container.querySelectorAll('svg[aria-hidden="true"]');
      expect(icons.length).toBeGreaterThan(0);
    });
  });

  // ===========================================================================
  // INTEGRATION TESTS
  // ===========================================================================

  describe('Integration with Store', () => {
    it('should reflect store state changes', () => {
      const { addComponent } = usePageBuilderStore.getState();

      const { rerender } = render(<Toolbar />);

      addComponent({
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

      rerender(<Toolbar />);

      const undoButton = screen.getByLabelText('Undo');
      expect(undoButton).not.toBeDisabled();
    });

    it('should update preview button when preview state changes', () => {
      const { togglePreview } = usePageBuilderStore.getState();

      const { rerender } = render(<Toolbar />);

      togglePreview();
      rerender(<Toolbar />);

      const previewButton = screen.getByLabelText('Exit preview mode');
      expect(previewButton).toHaveAttribute('aria-pressed', 'true');
    });
  });

  // ===========================================================================
  // VISUAL REGRESSION SNAPSHOTS
  // ===========================================================================

  describe('Visual Snapshots', () => {
    it('should match snapshot for default state', () => {
      const { container } = render(<Toolbar />);
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot with custom project name', () => {
      const { container } = render(<Toolbar projectName="My Project" />);
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot with undo enabled', () => {
      const { addComponent } = usePageBuilderStore.getState();

      addComponent({
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

      const { container } = render(<Toolbar />);
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot with menu open', async () => {
      const user = userEvent.setup();
      const { container } = render(<Toolbar />);

      const exportButton = screen.getByLabelText('Export options');
      await user.click(exportButton);

      expect(container).toMatchSnapshot();
    });
  });
});
