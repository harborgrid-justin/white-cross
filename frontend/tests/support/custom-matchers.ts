import { expect, Page } from '@playwright/test';

/**
 * Custom Matchers for Playwright Tests
 * Extends Playwright's expect with healthcare-specific assertions
 */

/**
 * Extend Playwright's expect with custom matchers
 */
export function setupCustomMatchers() {
  // Custom matchers can be added here when needed
  // For now, we'll use standard Playwright assertions with helper functions
}

/**
 * Assert that a form has validation errors
 *
 * @param page - Playwright Page object
 * @param expectedErrors - Array of expected error messages
 */
export async function assertFormErrors(page: Page, expectedErrors: string[]): Promise<void> {
  for (const error of expectedErrors) {
    await expect(page.locator(`text=${error}`).first()).toBeVisible();
  }
}

/**
 * Assert that a toast/notification message is displayed
 *
 * @param page - Playwright Page object
 * @param message - Expected message text
 * @param type - Toast type (success, error, warning, info)
 */
export async function assertToastMessage(
  page: Page,
  message: string | RegExp,
  type: 'success' | 'error' | 'warning' | 'info' = 'success'
): Promise<void> {
  const toastSelector = `[role="alert"], [data-toast], .toast, .notification`;
  const toast = page.locator(toastSelector);

  await expect(toast).toBeVisible({ timeout: 5000 });

  if (typeof message === 'string') {
    await expect(toast).toContainText(message);
  } else {
    await expect(toast).toContainText(message);
  }
}

/**
 * Assert that user is on the expected page
 *
 * @param page - Playwright Page object
 * @param expectedPath - Expected URL path
 */
export async function assertOnPage(page: Page, expectedPath: string): Promise<void> {
  await expect(page).toHaveURL(new RegExp(expectedPath));
}

/**
 * Assert that a table contains expected data
 *
 * @param page - Playwright Page object
 * @param tableSelector - Table selector
 * @param expectedRows - Number of expected rows (excluding header)
 */
export async function assertTableRowCount(
  page: Page,
  tableSelector: string,
  expectedRows: number
): Promise<void> {
  const rows = page.locator(`${tableSelector} tbody tr`);
  await expect(rows).toHaveCount(expectedRows);
}

/**
 * Assert that a table contains specific text in a cell
 *
 * @param page - Playwright Page object
 * @param tableSelector - Table selector
 * @param cellText - Text to find in table
 */
export async function assertTableContainsText(
  page: Page,
  tableSelector: string,
  cellText: string
): Promise<void> {
  const cell = page.locator(`${tableSelector} td:has-text("${cellText}")`);
  await expect(cell).toBeVisible();
}

/**
 * Assert that a modal/dialog is open
 *
 * @param page - Playwright Page object
 * @param modalTitle - Expected modal title (optional)
 */
export async function assertModalOpen(page: Page, modalTitle?: string): Promise<void> {
  const modal = page.locator('[role="dialog"], [role="alertdialog"], .modal');
  await expect(modal).toBeVisible();

  if (modalTitle) {
    const title = modal.locator('h1, h2, h3, [role="heading"]');
    await expect(title).toContainText(modalTitle);
  }
}

/**
 * Assert that a modal/dialog is closed
 *
 * @param page - Playwright Page object
 */
export async function assertModalClosed(page: Page): Promise<void> {
  const modal = page.locator('[role="dialog"], [role="alertdialog"], .modal');
  await expect(modal).toBeHidden();
}

/**
 * Assert that a loading indicator is visible
 *
 * @param page - Playwright Page object
 */
export async function assertLoading(page: Page): Promise<void> {
  const loader = page.locator(
    '[data-loading], [role="progressbar"], .loading, .spinner, [aria-busy="true"]'
  );
  await expect(loader.first()).toBeVisible();
}

/**
 * Assert that loading is complete
 *
 * @param page - Playwright Page object
 */
export async function assertLoadingComplete(page: Page): Promise<void> {
  const loader = page.locator(
    '[data-loading], [role="progressbar"], .loading, .spinner, [aria-busy="true"]'
  );
  await expect(loader.first()).toBeHidden({ timeout: 10000 });
}

/**
 * Assert that an element has specific ARIA attributes
 *
 * @param page - Playwright Page object
 * @param selector - Element selector
 * @param attributes - Expected ARIA attributes
 */
export async function assertAriaAttributes(
  page: Page,
  selector: string,
  attributes: Record<string, string>
): Promise<void> {
  const element = page.locator(selector);

  for (const [attr, value] of Object.entries(attributes)) {
    await expect(element).toHaveAttribute(attr, value);
  }
}

/**
 * Assert that a list has expected number of items
 *
 * @param page - Playwright Page object
 * @param listSelector - List selector
 * @param expectedCount - Expected number of items
 */
export async function assertListItemCount(
  page: Page,
  listSelector: string,
  expectedCount: number
): Promise<void> {
  const items = page.locator(`${listSelector} > *`);
  await expect(items).toHaveCount(expectedCount);
}

/**
 * Assert that a form field has a specific value
 *
 * @param page - Playwright Page object
 * @param fieldSelector - Field selector
 * @param expectedValue - Expected field value
 */
export async function assertFieldValue(
  page: Page,
  fieldSelector: string,
  expectedValue: string
): Promise<void> {
  const field = page.locator(fieldSelector);
  await expect(field).toHaveValue(expectedValue);
}

/**
 * Assert that a checkbox is checked
 *
 * @param page - Playwright Page object
 * @param checkboxSelector - Checkbox selector
 */
export async function assertCheckboxChecked(page: Page, checkboxSelector: string): Promise<void> {
  const checkbox = page.locator(checkboxSelector);
  await expect(checkbox).toBeChecked();
}

/**
 * Assert that a checkbox is not checked
 *
 * @param page - Playwright Page object
 * @param checkboxSelector - Checkbox selector
 */
export async function assertCheckboxUnchecked(page: Page, checkboxSelector: string): Promise<void> {
  const checkbox = page.locator(checkboxSelector);
  await expect(checkbox).not.toBeChecked();
}

/**
 * Assert that an element is disabled
 *
 * @param page - Playwright Page object
 * @param selector - Element selector
 */
export async function assertDisabled(page: Page, selector: string): Promise<void> {
  const element = page.locator(selector);
  await expect(element).toBeDisabled();
}

/**
 * Assert that an element is enabled
 *
 * @param page - Playwright Page object
 * @param selector - Element selector
 */
export async function assertEnabled(page: Page, selector: string): Promise<void> {
  const element = page.locator(selector);
  await expect(element).toBeEnabled();
}

/**
 * Assert that a dropdown has specific options
 *
 * @param page - Playwright Page object
 * @param selectSelector - Select element selector
 * @param expectedOptions - Array of expected option texts
 */
export async function assertSelectOptions(
  page: Page,
  selectSelector: string,
  expectedOptions: string[]
): Promise<void> {
  const select = page.locator(selectSelector);

  for (const option of expectedOptions) {
    const optionElement = select.locator(`option:has-text("${option}")`);
    await expect(optionElement).toBeVisible();
  }
}

/**
 * Assert that breadcrumbs show correct navigation path
 *
 * @param page - Playwright Page object
 * @param expectedPath - Array of expected breadcrumb items
 */
export async function assertBreadcrumbs(page: Page, expectedPath: string[]): Promise<void> {
  const breadcrumbs = page.locator('[aria-label="breadcrumb"], .breadcrumb, nav[role="navigation"]');

  for (const item of expectedPath) {
    await expect(breadcrumbs.locator(`text=${item}`)).toBeVisible();
  }
}

/**
 * Healthcare-specific: Assert medication five rights are displayed
 *
 * @param page - Playwright Page object
 */
export async function assertMedicationFiveRights(page: Page): Promise<void> {
  const fiveRights = [
    'Right Patient',
    'Right Medication',
    'Right Dose',
    'Right Route',
    'Right Time'
  ];

  for (const right of fiveRights) {
    const element = page.locator(`text=${right}`);
    await expect(element).toBeVisible();
  }
}

/**
 * Healthcare-specific: Assert PHI warning is displayed
 *
 * @param page - Playwright Page object
 */
export async function assertPHIWarning(page: Page): Promise<void> {
  const warning = page.locator('text=/PHI|Protected Health Information|Confidential/i');
  await expect(warning.first()).toBeVisible();
}

/**
 * Healthcare-specific: Assert audit log entry was created
 * Note: This is a placeholder - actual implementation would check audit log API
 *
 * @param page - Playwright Page object
 * @param action - Expected action type
 */
export async function assertAuditLogEntry(page: Page, action: string): Promise<void> {
  // In real implementation, this would check the audit log API
  // For now, just log the assertion
  console.log(`Audit log assertion: ${action}`);
}
