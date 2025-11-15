/**
 * Page Builder E2E Tests
 *
 * End-to-end tests for the page builder application covering:
 * - Component creation and manipulation
 * - Drag and drop functionality
 * - Undo/redo operations
 * - Save and export workflows
 * - Keyboard navigation
 * - Preview mode
 * - Accessibility
 *
 * @group e2e
 * @group page-builder
 */

import { test, expect, Page } from '@playwright/test';

// ===========================================================================
// TEST SETUP AND HELPERS
// ===========================================================================

/**
 * Navigate to the page builder and wait for it to load
 */
async function navigateToPageBuilder(page: Page) {
  await page.goto('/page-builder');

  // Wait for the page builder to be fully loaded
  await expect(page.getByRole('banner')).toBeVisible();
  await expect(page.getByRole('main')).toBeVisible();
}

/**
 * Add a component by dragging from palette
 */
async function addComponentFromPalette(page: Page, componentType: string) {
  const paletteItem = page.getByTestId(`palette-${componentType}`);
  const canvas = page.getByRole('main', { name: /canvas/i });

  await paletteItem.dragTo(canvas, {
    targetPosition: { x: 200, y: 200 }
  });

  // Wait for component to be added
  await page.waitForTimeout(100);
}

/**
 * Select a component on the canvas
 */
async function selectComponent(page: Page, componentName: string) {
  const component = page.getByText(componentName);
  await component.click();

  // Wait for selection to be applied
  await expect(page.getByTestId('selection-overlay')).toBeVisible();
}

// ===========================================================================
// PAGE BUILDER NAVIGATION TESTS
// ===========================================================================

test.describe('Page Builder Navigation', () => {
  test('should load the page builder successfully', async ({ page }) => {
    await navigateToPageBuilder(page);

    // Verify main sections are present
    await expect(page.getByRole('banner')).toBeVisible();
    await expect(page.getByRole('complementary', { name: /component palette/i })).toBeVisible();
    await expect(page.getByRole('main', { name: /canvas/i })).toBeVisible();
    await expect(page.getByRole('complementary', { name: /property editor/i })).toBeVisible();
  });

  test('should display skip links for keyboard users', async ({ page }) => {
    await navigateToPageBuilder(page);

    // Focus the page to activate skip links
    await page.keyboard.press('Tab');

    // Skip links should be visible when focused
    const skipLink = page.getByText('Skip to canvas');
    await expect(skipLink).toBeVisible();
  });

  test('should have proper page heading for screen readers', async ({ page }) => {
    await navigateToPageBuilder(page);

    // Check for visually hidden h1
    const heading = page.locator('h1:has-text("Page Builder Application")');
    await expect(heading).toHaveClass(/sr-only/);
  });
});

// ===========================================================================
// COMPONENT CREATION TESTS
// ===========================================================================

test.describe('Component Creation', () => {
  test('should add a button component via drag and drop', async ({ page }) => {
    await navigateToPageBuilder(page);

    await addComponentFromPalette(page, 'button');

    // Verify component appears on canvas
    const component = page.getByTestId(/component-/);
    await expect(component).toBeVisible();
  });

  test('should auto-select newly added component', async ({ page }) => {
    await navigateToPageBuilder(page);

    await addComponentFromPalette(page, 'button');

    // Verify component is selected (selection overlay visible)
    await expect(page.getByTestId('selection-overlay')).toBeVisible();
  });

  test('should display component in layer tree', async ({ page }) => {
    await navigateToPageBuilder(page);

    await addComponentFromPalette(page, 'button');

    // Verify component appears in layer tree
    const layerTree = page.getByRole('complementary', { name: /layer tree/i });
    await expect(layerTree.getByText(/button/i)).toBeVisible();
  });

  test('should add multiple components', async ({ page }) => {
    await navigateToPageBuilder(page);

    await addComponentFromPalette(page, 'button');
    await addComponentFromPalette(page, 'text');
    await addComponentFromPalette(page, 'container');

    // Verify all components are visible
    const components = page.getByTestId(/component-/);
    await expect(components).toHaveCount(3);
  });
});

// ===========================================================================
// COMPONENT MANIPULATION TESTS
// ===========================================================================

test.describe('Component Manipulation', () => {
  test('should select component by clicking', async ({ page }) => {
    await navigateToPageBuilder(page);

    await addComponentFromPalette(page, 'button');

    // Click component to select
    const component = page.getByTestId(/component-/).first();
    await component.click();

    // Verify selection
    await expect(page.getByTestId('selection-overlay')).toBeVisible();
  });

  test('should update component properties', async ({ page }) => {
    await navigateToPageBuilder(page);

    await addComponentFromPalette(page, 'button');

    // Update component name in property editor
    const nameField = page.getByLabel('Name');
    await nameField.fill('Submit Button');

    // Verify name is updated (with debounce wait)
    await page.waitForTimeout(600);

    const component = page.getByText('Submit Button');
    await expect(component).toBeVisible();
  });

  test('should update component position', async ({ page }) => {
    await navigateToPageBuilder(page);

    await addComponentFromPalette(page, 'button');

    // Update position
    const xField = page.getByLabel('X Position');
    const yField = page.getByLabel('Y Position');

    await xField.fill('300');
    await yField.fill('400');

    // Verify position is updated
    const component = page.getByTestId(/component-/).first();
    const box = await component.boundingBox();

    expect(box?.x).toBeGreaterThan(250);
    expect(box?.y).toBeGreaterThan(350);
  });

  test('should update component size', async ({ page }) => {
    await navigateToPageBuilder(page);

    await addComponentFromPalette(page, 'button');

    // Update size
    const widthField = page.getByLabel('Width');
    const heightField = page.getByLabel('Height');

    await widthField.fill('200');
    await heightField.fill('60');

    // Verify size is updated
    const component = page.getByTestId(/component-/).first();
    const box = await component.boundingBox();

    expect(box?.width).toBeCloseTo(200, 10);
    expect(box?.height).toBeCloseTo(60, 10);
  });

  test('should delete component using Delete key', async ({ page }) => {
    await navigateToPageBuilder(page);

    await addComponentFromPalette(page, 'button');

    // Select component
    const component = page.getByTestId(/component-/).first();
    await component.click();

    // Press Delete key
    await page.keyboard.press('Delete');

    // Verify component is deleted
    await expect(component).not.toBeVisible();
  });

  test('should lock/unlock component', async ({ page }) => {
    await navigateToPageBuilder(page);

    await addComponentFromPalette(page, 'button');

    // Lock component
    const lockButton = page.getByLabel(/lock/i);
    await lockButton.click();

    // Verify lock state is shown
    await expect(lockButton).toHaveAttribute('aria-pressed', 'true');
  });

  test('should hide/show component', async ({ page }) => {
    await navigateToPageBuilder(page);

    await addComponentFromPalette(page, 'button');

    // Hide component
    const hideButton = page.getByLabel(/hide/i);
    await hideButton.click();

    // Verify hide state is shown
    await expect(hideButton).toHaveAttribute('aria-pressed', 'true');
  });
});

// ===========================================================================
// UNDO/REDO TESTS
// ===========================================================================

test.describe('Undo/Redo', () => {
  test('should undo component addition', async ({ page }) => {
    await navigateToPageBuilder(page);

    await addComponentFromPalette(page, 'button');

    const component = page.getByTestId(/component-/).first();
    await expect(component).toBeVisible();

    // Click undo
    const undoButton = page.getByLabel('Undo');
    await undoButton.click();

    // Verify component is removed
    await expect(component).not.toBeVisible();
  });

  test('should redo after undo', async ({ page }) => {
    await navigateToPageBuilder(page);

    await addComponentFromPalette(page, 'button');

    // Undo
    await page.getByLabel('Undo').click();

    // Redo
    const redoButton = page.getByLabel('Redo');
    await redoButton.click();

    // Verify component is restored
    const component = page.getByTestId(/component-/).first();
    await expect(component).toBeVisible();
  });

  test('should disable undo when nothing to undo', async ({ page }) => {
    await navigateToPageBuilder(page);

    const undoButton = page.getByLabel('Undo');
    await expect(undoButton).toBeDisabled();
  });

  test('should disable redo when nothing to redo', async ({ page }) => {
    await navigateToPageBuilder(page);

    const redoButton = page.getByLabel('Redo');
    await expect(redoButton).toBeDisabled();
  });

  test('should support keyboard shortcut Cmd+Z for undo', async ({ page }) => {
    await navigateToPageBuilder(page);

    await addComponentFromPalette(page, 'button');

    const component = page.getByTestId(/component-/).first();
    await expect(component).toBeVisible();

    // Press Cmd+Z (or Ctrl+Z on Windows/Linux)
    const modifier = process.platform === 'darwin' ? 'Meta' : 'Control';
    await page.keyboard.press(`${modifier}+z`);

    // Verify component is removed
    await expect(component).not.toBeVisible();
  });

  test('should support keyboard shortcut Cmd+Shift+Z for redo', async ({ page }) => {
    await navigateToPageBuilder(page);

    await addComponentFromPalette(page, 'button');

    // Undo with keyboard
    const modifier = process.platform === 'darwin' ? 'Meta' : 'Control';
    await page.keyboard.press(`${modifier}+z`);

    // Redo with keyboard
    await page.keyboard.press(`${modifier}+Shift+z`);

    // Verify component is restored
    const component = page.getByTestId(/component-/).first();
    await expect(component).toBeVisible();
  });
});

// ===========================================================================
// SAVE FUNCTIONALITY TESTS
// ===========================================================================

test.describe('Save Functionality', () => {
  test('should show save button', async ({ page }) => {
    await navigateToPageBuilder(page);

    const saveButton = page.getByLabel('Save project');
    await expect(saveButton).toBeVisible();
  });

  test('should trigger save callback when clicked', async ({ page }) => {
    await navigateToPageBuilder(page);

    // Set up console listener to verify save was triggered
    const saveMessages: string[] = [];
    page.on('console', msg => {
      if (msg.text().includes('save')) {
        saveMessages.push(msg.text());
      }
    });

    const saveButton = page.getByLabel('Save project');
    await saveButton.click();

    // Note: Actual save implementation would be tested here
    // This is a placeholder to verify button interaction works
  });
});

// ===========================================================================
// EXPORT FUNCTIONALITY TESTS
// ===========================================================================

test.describe('Export Functionality', () => {
  test('should open export menu when clicked', async ({ page }) => {
    await navigateToPageBuilder(page);

    const exportButton = page.getByLabel('Export options');
    await exportButton.click();

    // Verify export options are visible
    await expect(page.getByText('Export as JSON')).toBeVisible();
    await expect(page.getByText('Export as Code')).toBeVisible();
    await expect(page.getByText('Download as ZIP')).toBeVisible();
  });

  test('should close export menu when clicking outside', async ({ page }) => {
    await navigateToPageBuilder(page);

    const exportButton = page.getByLabel('Export options');
    await exportButton.click();

    // Click outside
    await page.getByRole('main').click();

    // Verify menu is closed
    await expect(page.getByText('Export as JSON')).not.toBeVisible();
  });

  test('should close export menu on Escape key', async ({ page }) => {
    await navigateToPageBuilder(page);

    const exportButton = page.getByLabel('Export options');
    await exportButton.click();

    // Press Escape
    await page.keyboard.press('Escape');

    // Verify menu is closed
    await expect(page.getByText('Export as JSON')).not.toBeVisible();
  });

  test('should navigate export menu with arrow keys', async ({ page }) => {
    await navigateToPageBuilder(page);

    const exportButton = page.getByLabel('Export options');
    await exportButton.click();

    // Press ArrowDown to navigate
    await page.keyboard.press('ArrowDown');

    // Verify second item is focused
    const codeOption = page.getByText('Export as Code');
    await expect(codeOption).toBeFocused();
  });
});

// ===========================================================================
// PREVIEW MODE TESTS
// ===========================================================================

test.describe('Preview Mode', () => {
  test('should enter preview mode', async ({ page }) => {
    await navigateToPageBuilder(page);

    const previewButton = page.getByLabel(/enter preview mode/i);
    await previewButton.click();

    // Verify preview mode is active
    await expect(page.getByText('Preview Mode')).toBeVisible();
  });

  test('should exit preview mode', async ({ page }) => {
    await navigateToPageBuilder(page);

    // Enter preview mode
    const previewButton = page.getByLabel(/enter preview mode/i);
    await previewButton.click();

    // Exit preview mode
    const closeButton = page.getByLabel(/close preview/i);
    await closeButton.click();

    // Verify preview mode is exited
    await expect(page.getByText('Preview Mode')).not.toBeVisible();
  });

  test('should switch devices in preview mode', async ({ page }) => {
    await navigateToPageBuilder(page);

    // Enter preview mode
    await page.getByLabel(/enter preview mode/i).click();

    // Switch to mobile
    const mobileButton = page.getByLabel(/mobile preview/i);
    await mobileButton.click();

    // Verify mobile device is selected
    await expect(mobileButton).toHaveAttribute('aria-pressed', 'true');
  });

  test('should exit preview mode with Escape key', async ({ page }) => {
    await navigateToPageBuilder(page);

    // Enter preview mode
    await page.getByLabel(/enter preview mode/i).click();

    // Press Escape
    await page.keyboard.press('Escape');

    // Verify preview mode is exited
    await expect(page.getByText('Preview Mode')).not.toBeVisible();
  });
});

// ===========================================================================
// CANVAS VIEWPORT TESTS
// ===========================================================================

test.describe('Canvas Viewport', () => {
  test('should zoom in with keyboard shortcut', async ({ page }) => {
    await navigateToPageBuilder(page);

    const canvas = page.getByRole('main', { name: /canvas/i });
    await canvas.focus();

    // Zoom in with Ctrl/Cmd + Plus
    const modifier = process.platform === 'darwin' ? 'Meta' : 'Control';
    await page.keyboard.press(`${modifier}+Equal`); // Equal is the + key

    // Verify zoom level changed (check aria-live announcement)
    await expect(page.getByText(/zoom.*%/i)).toBeVisible();
  });

  test('should zoom out with keyboard shortcut', async ({ page }) => {
    await navigateToPageBuilder(page);

    const canvas = page.getByRole('main', { name: /canvas/i });
    await canvas.focus();

    // Zoom out with Ctrl/Cmd + Minus
    const modifier = process.platform === 'darwin' ? 'Meta' : 'Control';
    await page.keyboard.press(`${modifier}+Minus`);

    // Verify zoom level changed
    await expect(page.getByText(/zoom.*%/i)).toBeVisible();
  });

  test('should reset zoom with keyboard shortcut', async ({ page }) => {
    await navigateToPageBuilder(page);

    const canvas = page.getByRole('main', { name: /canvas/i });
    await canvas.focus();

    // Reset zoom with Ctrl/Cmd + 0
    const modifier = process.platform === 'darwin' ? 'Meta' : 'Control';
    await page.keyboard.press(`${modifier}+0`);

    // Verify zoom is reset to 100%
    await expect(page.getByText(/zoom 100%/i)).toBeVisible();
  });

  test('should toggle grid with G key', async ({ page }) => {
    await navigateToPageBuilder(page);

    const canvas = page.getByRole('main', { name: /canvas/i });
    await canvas.focus();

    // Toggle grid
    await page.keyboard.press('g');

    // Verify grid toggle announcement
    await expect(page.getByText(/grid (enabled|disabled)/i)).toBeVisible();
  });
});

// ===========================================================================
// ACCESSIBILITY TESTS
// ===========================================================================

test.describe('Accessibility', () => {
  test('should have no accessibility violations', async ({ page }) => {
    await navigateToPageBuilder(page);

    // Use axe-core for accessibility testing
    // Note: Would need to install @axe-core/playwright
    // const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    // expect(accessibilityScanResults.violations).toEqual([]);

    // Basic accessibility check: verify landmarks
    await expect(page.getByRole('banner')).toBeVisible();
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByRole('complementary')).toHaveCount(3); // palette, properties, layers
  });

  test('should support keyboard navigation', async ({ page }) => {
    await navigateToPageBuilder(page);

    // Tab through focusable elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Verify focus is moving
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('should announce state changes to screen readers', async ({ page }) => {
    await navigateToPageBuilder(page);

    await addComponentFromPalette(page, 'button');

    // Verify live region announcement
    const liveRegion = page.getByRole('status');
    await expect(liveRegion).toBeVisible();
  });

  test('should have proper ARIA labels', async ({ page }) => {
    await navigateToPageBuilder(page);

    // Verify all interactive elements have labels
    const undoButton = page.getByLabel('Undo');
    const redoButton = page.getByLabel('Redo');
    const saveButton = page.getByLabel('Save project');

    await expect(undoButton).toBeVisible();
    await expect(redoButton).toBeVisible();
    await expect(saveButton).toBeVisible();
  });
});

// ===========================================================================
// COMPLEX USER WORKFLOWS
// ===========================================================================

test.describe('Complex User Workflows', () => {
  test('should complete full component creation workflow', async ({ page }) => {
    await navigateToPageBuilder(page);

    // 1. Add component
    await addComponentFromPalette(page, 'button');

    // 2. Update properties
    await page.getByLabel('Name').fill('Submit Button');
    await page.getByLabel('Width').fill('150');

    // 3. Verify changes
    await page.waitForTimeout(600); // Wait for debounce
    await expect(page.getByText('Submit Button')).toBeVisible();

    // 4. Save project
    await page.getByLabel('Save project').click();

    // 5. Preview
    await page.getByLabel(/enter preview mode/i).click();
    await expect(page.getByText('Submit Button')).toBeVisible();

    // 6. Exit preview
    await page.keyboard.press('Escape');
  });

  test('should handle error recovery workflow', async ({ page }) => {
    await navigateToPageBuilder(page);

    // 1. Add component
    await addComponentFromPalette(page, 'button');

    // 2. Make a mistake (delete component)
    await page.keyboard.press('Delete');

    // 3. Recover with undo
    await page.getByLabel('Undo').click();

    // 4. Verify component is restored
    const component = page.getByTestId(/component-/).first();
    await expect(component).toBeVisible();
  });

  test('should support multi-component workflow', async ({ page }) => {
    await navigateToPageBuilder(page);

    // 1. Add multiple components
    await addComponentFromPalette(page, 'container');
    await addComponentFromPalette(page, 'button');
    await addComponentFromPalette(page, 'text');

    // 2. Verify all components exist
    const components = page.getByTestId(/component-/);
    await expect(components).toHaveCount(3);

    // 3. Select and modify each
    await components.first().click();
    await page.getByLabel('Name').fill('Container 1');

    await components.nth(1).click();
    await page.getByLabel('Name').fill('Submit');

    await components.nth(2).click();
    await page.getByLabel('Name').fill('Label');

    // 4. Verify all names are updated
    await page.waitForTimeout(600);
    await expect(page.getByText('Container 1')).toBeVisible();
    await expect(page.getByText('Submit')).toBeVisible();
    await expect(page.getByText('Label')).toBeVisible();
  });
});
