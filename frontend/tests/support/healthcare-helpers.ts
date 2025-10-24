import { Page, expect } from '@playwright/test';

/**
 * Healthcare-specific Test Helper Functions for White Cross
 * Migrated from Cypress custom commands to Playwright
 */

/**
 * Wait for healthcare data to load
 * Equivalent to cy.waitForHealthcareData()
 *
 * @param page - Playwright Page object
 * @param timeout - Maximum wait time in milliseconds
 */
export async function waitForHealthcareData(page: Page, timeout: number = 10000): Promise<void> {
  // Wait for API calls to complete
  await page.waitForLoadState('networkidle', { timeout });

  // Additional wait for data processing
  await page.waitForTimeout(500);
}

/**
 * Get element by test ID with fallback to name attribute
 * Equivalent to cy.getByTestId()
 *
 * @param page - Playwright Page object
 * @param testId - Test ID to locate
 * @returns Locator for the element
 */
export function getByTestId(page: Page, testId: string) {
  return page.locator(`[data-testid="${testId}"], [data-cy="${testId}"], [name="${testId}"]`).first();
}

/**
 * Verify success message or toast
 * Equivalent to cy.verifySuccess()
 *
 * @param page - Playwright Page object
 * @param timeout - Maximum wait time
 */
export async function verifySuccess(page: Page, timeout: number = 5000): Promise<void> {
  const successIndicators = page.locator(
    '[data-testid="success-message"], [data-testid="toast-success"], ' +
    '.success, .toast-success, [role="alert"].success, ' +
    'text=/success|saved|created|updated|deleted/i'
  ).first();

  await expect(successIndicators).toBeVisible({ timeout });
}

/**
 * Setup audit log interception
 * Equivalent to cy.setupAuditLogInterception()
 *
 * @param page - Playwright Page object
 */
export async function setupAuditLogInterception(page: Page): Promise<void> {
  await page.route('**/api/audit-logs', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: {
          id: 'audit-' + Date.now(),
          timestamp: new Date().toISOString(),
          action: 'CREATE',
          resource: 'emergency_contact',
          userId: 'user-123'
        }
      })
    });
  });
}

/**
 * Check accessibility of an input field
 * Equivalent to cy.checkAccessibility()
 *
 * @param page - Playwright Page object
 * @param testId - Test ID of the element to check
 */
export async function checkAccessibility(page: Page, testId: string): Promise<void> {
  const element = getByTestId(page, testId);

  // Check element is visible
  await expect(element).toBeVisible();

  // Check element has proper attributes
  await expect(element).toBeEnabled();

  // Check for label or aria-label
  const hasLabel = await element.evaluate((el: HTMLElement) => {
    const id = el.getAttribute('id');
    const ariaLabel = el.getAttribute('aria-label');
    const ariaLabelledBy = el.getAttribute('aria-labelledby');

    if (ariaLabel || ariaLabelledBy) return true;

    if (id) {
      const label = document.querySelector(`label[for="${id}"]`);
      if (label) return true;
    }

    // Check if wrapped in label
    const parent = el.parentElement;
    if (parent?.tagName === 'LABEL') return true;

    return false;
  });

  expect(hasLabel).toBeTruthy();
}

/**
 * Navigate to student details page
 * Common setup for emergency contacts and guardians tests
 *
 * @param page - Playwright Page object
 */
export async function navigateToStudentDetails(page: Page): Promise<void> {
  // Find and click first student row
  const studentTable = getByTestId(page, 'student-table');
  await expect(studentTable).toBeVisible();

  const firstRow = studentTable.locator('tbody tr').first();
  await firstRow.click();

  // Wait for navigation and data load
  await waitForHealthcareData(page);
}

/**
 * Open emergency contact modal
 * Common action for emergency contact tests
 *
 * @param page - Playwright Page object
 */
export async function openEmergencyContactModal(page: Page): Promise<void> {
  const addButton = page.locator('button').filter({ hasText: /add.*contact/i }).first();
  await addButton.click();
  await page.waitForTimeout(500);

  const modal = page.locator('[data-testid="emergency-contact-modal"], [role="dialog"]');
  await expect(modal).toBeVisible();
}

/**
 * Open guardian modal
 * Common action for guardian tests
 *
 * @param page - Playwright Page object
 */
export async function openGuardianModal(page: Page): Promise<void> {
  // Check if add guardian button exists
  const addButtonTestId = page.locator('[data-testid="add-guardian-button"]');
  const addButtonText = page.locator('button').filter({ hasText: /add.*guardian/i });

  const addButton = await addButtonTestId.count() > 0 ? addButtonTestId : addButtonText;

  if (await addButton.first().isVisible({ timeout: 2000 }).catch(() => false)) {
    await addButton.first().click();
    await page.waitForTimeout(500);

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();
  } else {
    throw new Error('Guardian add button not found');
  }
}

/**
 * Fill emergency contact form fields
 *
 * @param page - Playwright Page object
 * @param data - Contact data to fill
 */
export async function fillEmergencyContactForm(
  page: Page,
  data: {
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
    relationship?: string;
    isPrimary?: boolean;
    alternatePhone?: string;
  }
): Promise<void> {
  // First name
  const firstNameInput = page.locator('[data-testid="firstName-input"], input[name="firstName"]').first();
  await firstNameInput.fill(data.firstName);

  // Last name
  const lastNameInput = page.locator('[data-testid="lastName-input"], input[name="lastName"]').first();
  await lastNameInput.fill(data.lastName);

  // Phone
  const phoneInput = page.locator('[data-testid="phone-input"], input[name="phone"]').first();
  await phoneInput.fill(data.phone);

  // Optional fields
  if (data.email) {
    const emailInput = page.locator('[data-testid="email-input"], input[name="email"]').first();
    if (await emailInput.isVisible({ timeout: 1000 }).catch(() => false)) {
      await emailInput.fill(data.email);
    }
  }

  if (data.relationship) {
    const relationshipSelect = page.locator('[data-testid="relationship-select"], select[name="relationship"]').first();
    if (await relationshipSelect.isVisible({ timeout: 1000 }).catch(() => false)) {
      await relationshipSelect.selectOption(data.relationship);
    }
  }

  if (data.isPrimary) {
    const isPrimaryCheckbox = page.locator('[data-testid="isPrimary-checkbox"]').first();
    if (await isPrimaryCheckbox.isVisible({ timeout: 1000 }).catch(() => false)) {
      await isPrimaryCheckbox.check();
    }
  }

  if (data.alternatePhone) {
    const altPhoneInput = page.locator('[data-testid="alternatePhone-input"]').first();
    if (await altPhoneInput.isVisible({ timeout: 1000 }).catch(() => false)) {
      await altPhoneInput.fill(data.alternatePhone);
    }
  }
}

/**
 * Fill guardian form fields
 *
 * @param page - Playwright Page object
 * @param data - Guardian data to fill
 */
export async function fillGuardianForm(
  page: Page,
  data: {
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
    legalCustody?: boolean;
    physicalCustody?: boolean;
    courtOrderNumber?: string;
    pickupAuthorized?: boolean;
  }
): Promise<void> {
  // First name
  const firstNameInput = page.locator('[data-testid="firstName-input"], input[name="firstName"]').first();
  await firstNameInput.fill(data.firstName);

  // Last name
  const lastNameInput = page.locator('[data-testid="lastName-input"], input[name="lastName"]').first();
  await lastNameInput.fill(data.lastName);

  // Phone
  const phoneInput = page.locator('[data-testid="phone-input"], input[name="phone"]').first();
  await phoneInput.fill(data.phone);

  // Optional fields
  if (data.email) {
    const emailInput = page.locator('[data-testid="email-input"], input[name="email"]').first();
    if (await emailInput.isVisible({ timeout: 1000 }).catch(() => false)) {
      await emailInput.fill(data.email);
    }
  }

  if (data.legalCustody) {
    const legalCustodyCheckbox = page.locator('[data-testid="legalCustody-checkbox"]').first();
    if (await legalCustodyCheckbox.isVisible({ timeout: 1000 }).catch(() => false)) {
      await legalCustodyCheckbox.check();
    }
  }

  if (data.physicalCustody) {
    const physicalCustodyCheckbox = page.locator('[data-testid="physicalCustody-checkbox"]').first();
    if (await physicalCustodyCheckbox.isVisible({ timeout: 1000 }).catch(() => false)) {
      await physicalCustodyCheckbox.check();
    }
  }

  if (data.courtOrderNumber) {
    const courtOrderInput = page.locator('[data-testid="courtOrderNumber-input"]').first();
    if (await courtOrderInput.isVisible({ timeout: 1000 }).catch(() => false)) {
      await courtOrderInput.fill(data.courtOrderNumber);
    }
  }

  if (data.pickupAuthorized) {
    const pickupCheckbox = page.locator('[data-testid="pickupAuthorized-checkbox"]').first();
    if (await pickupCheckbox.isVisible({ timeout: 1000 }).catch(() => false)) {
      await pickupCheckbox.check();
    }
  }
}

/**
 * Submit form (save button)
 *
 * @param page - Playwright Page object
 * @param buttonTestId - Test ID of the submit button
 */
export async function submitForm(page: Page, buttonTestId: string = 'save-contact-button'): Promise<void> {
  const saveButton = page.locator(
    `[data-testid="${buttonTestId}"], button[type="submit"]`
  ).filter({ hasText: /save|submit/i }).first();

  await saveButton.click();
  await page.waitForTimeout(1000);
}

/**
 * Cancel form (cancel button)
 *
 * @param page - Playwright Page object
 */
export async function cancelForm(page: Page): Promise<void> {
  const cancelButton = page.locator(
    '[data-testid="cancel-button"], button'
  ).filter({ hasText: /cancel/i }).first();

  await cancelButton.click();
}
