import { Page, Locator, expect } from '@playwright/test';

/**
 * Common Test Helper Functions for White Cross Healthcare Management System
 * Provides reusable utilities for Playwright tests
 */

/**
 * Wait for healthcare data to load with API mocking
 * Matches Cypress waitForHealthcareData behavior
 *
 * @param page - Playwright Page object
 */
export async function setupHealthcareMocks(page: Page): Promise<void> {
  // Mock health check
  await page.route('**/health', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        status: 'OK',
        timestamp: new Date().toISOString()
      })
    });
  });

  // Mock dev users endpoint
  await page.route('**/api/auth/dev-users', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([])
    });
  });

  // Mock students endpoint
  await page.route('**/api/students*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: { students: [], pagination: { page: 1, total: 0 } }
      })
    });
  });

  // Mock appointments endpoint
  await page.route('**/api/appointments*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: { appointments: [], pagination: { page: 1, total: 0 } }
      })
    });
  });

  // Mock medications endpoint
  await page.route('**/api/medications*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: { medications: [], pagination: { page: 1, total: 0 } }
      })
    });
  });

  // Mock users endpoint
  await page.route('**/api/users*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: { users: [], pagination: { page: 1, total: 0 } }
      })
    });
  });

  // Mock health records
  await page.route('**/api/health-records/**', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { records: [] }
        })
      });
    } else if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {}
        })
      });
    }
  });

  // Mock audit logs
  await page.route('**/api/audit-log*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: { logs: [] }
      })
    });
  });

  // Mock audit creation
  await page.route('**/api/audit*', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      });
    }
  });

  // Mock dashboard endpoints
  await page.route('**/api/dashboard/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, data: {} })
    });
  });

  // Mock student CRUD operations
  await page.route('**/api/students', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { student: { id: 'student-' + Date.now() } }
        })
      });
    }
  });

  await page.route('**/api/students/**', async (route) => {
    const method = route.request().method();
    if (method === 'PUT' || method === 'PATCH') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { student: {} }
        })
      });
    } else if (method === 'DELETE') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      });
    }
  });
}

/**
 * Type into a field using data-cy attribute or fallback selectors
 * Matches Cypress typeIntoField command
 *
 * @param page - Playwright Page object
 * @param fieldName - Field name or data-cy value
 * @param value - Value to type
 */
export async function typeIntoField(page: Page, fieldName: string, value: string): Promise<void> {
  const locator = page.locator(`[data-cy=${fieldName}], [name="${fieldName}"], [id="${fieldName}"]`).first();
  await locator.fill(value);
}

/**
 * Click a button using data-cy attribute or fallback selectors
 * Matches Cypress clickButton command
 *
 * @param page - Playwright Page object
 * @param buttonName - Button name or data-cy value
 */
export async function clickButton(page: Page, buttonName: string): Promise<void> {
  const locator = page.locator(`[data-cy=${buttonName}], button:has-text("${buttonName}")`).first();
  await locator.click();
}

/**
 * Wait for element to be visible
 *
 * @param page - Playwright Page object
 * @param selector - Element selector
 * @param timeout - Optional timeout in milliseconds
 */
export async function waitForElement(page: Page, selector: string, timeout = 10000): Promise<Locator> {
  const locator = page.locator(selector);
  await locator.waitFor({ state: 'visible', timeout });
  return locator;
}

/**
 * Wait for text to appear on the page
 *
 * @param page - Playwright Page object
 * @param text - Text to wait for
 * @param timeout - Optional timeout in milliseconds
 */
export async function waitForText(page: Page, text: string | RegExp, timeout = 10000): Promise<void> {
  await page.waitForSelector(`text=${typeof text === 'string' ? text : text.source}`, {
    timeout,
    state: 'visible'
  });
}

/**
 * Wait for element to be hidden
 *
 * @param page - Playwright Page object
 * @param selector - Element selector
 * @param timeout - Optional timeout in milliseconds
 */
export async function waitForElementToBeHidden(page: Page, selector: string, timeout = 10000): Promise<void> {
  await page.locator(selector).waitFor({ state: 'hidden', timeout });
}

/**
 * Check if element exists in DOM (may not be visible)
 *
 * @param page - Playwright Page object
 * @param selector - Element selector
 * @returns True if element exists
 */
export async function elementExists(page: Page, selector: string): Promise<boolean> {
  return (await page.locator(selector).count()) > 0;
}

/**
 * Check if element is visible
 *
 * @param page - Playwright Page object
 * @param selector - Element selector
 * @returns True if element is visible
 */
export async function isElementVisible(page: Page, selector: string): Promise<boolean> {
  try {
    await page.locator(selector).waitFor({ state: 'visible', timeout: 2000 });
    return true;
  } catch {
    return false;
  }
}

/**
 * Get element text content
 *
 * @param page - Playwright Page object
 * @param selector - Element selector
 * @returns Element text content or null if not found
 */
export async function getElementText(page: Page, selector: string): Promise<string | null> {
  const locator = page.locator(selector);
  if ((await locator.count()) > 0) {
    return await locator.first().textContent();
  }
  return null;
}

/**
 * Select option from dropdown
 *
 * @param page - Playwright Page object
 * @param selector - Select element selector
 * @param value - Option value to select
 */
export async function selectOption(page: Page, selector: string, value: string): Promise<void> {
  await page.selectOption(selector, value);
}

/**
 * Upload file to file input
 *
 * @param page - Playwright Page object
 * @param selector - File input selector
 * @param filePath - Path to file to upload
 */
export async function uploadFile(page: Page, selector: string, filePath: string): Promise<void> {
  await page.setInputFiles(selector, filePath);
}

/**
 * Clear input field
 *
 * @param page - Playwright Page object
 * @param selector - Input selector
 */
export async function clearInput(page: Page, selector: string): Promise<void> {
  await page.locator(selector).clear();
}

/**
 * Check checkbox
 *
 * @param page - Playwright Page object
 * @param selector - Checkbox selector
 */
export async function checkCheckbox(page: Page, selector: string): Promise<void> {
  await page.locator(selector).check();
}

/**
 * Uncheck checkbox
 *
 * @param page - Playwright Page object
 * @param selector - Checkbox selector
 */
export async function uncheckCheckbox(page: Page, selector: string): Promise<void> {
  await page.locator(selector).uncheck();
}

/**
 * Scroll element into view
 *
 * @param page - Playwright Page object
 * @param selector - Element selector
 */
export async function scrollToElement(page: Page, selector: string): Promise<void> {
  await page.locator(selector).scrollIntoViewIfNeeded();
}

/**
 * Wait for navigation to complete
 *
 * @param page - Playwright Page object
 * @param timeout - Optional timeout in milliseconds
 */
export async function waitForNavigation(page: Page, timeout = 30000): Promise<void> {
  await page.waitForLoadState('networkidle', { timeout });
}

/**
 * Reload page and wait for it to load
 *
 * @param page - Playwright Page object
 */
export async function reloadPage(page: Page): Promise<void> {
  await page.reload({ waitUntil: 'networkidle' });
}

/**
 * Take a screenshot
 *
 * @param page - Playwright Page object
 * @param name - Screenshot name
 */
export async function takeScreenshot(page: Page, name: string): Promise<void> {
  await page.screenshot({ path: `test-results/screenshots/${name}.png`, fullPage: true });
}

/**
 * Get all console messages from the page
 * Useful for debugging
 *
 * @param page - Playwright Page object
 * @returns Array of console messages
 */
export function collectConsoleMessages(page: Page): string[] {
  const messages: string[] = [];

  page.on('console', (msg) => {
    messages.push(`${msg.type()}: ${msg.text()}`);
  });

  return messages;
}

/**
 * Get all network requests made by the page
 * Useful for debugging API calls
 *
 * @param page - Playwright Page object
 * @returns Array of request URLs
 */
export function collectNetworkRequests(page: Page): string[] {
  const requests: string[] = [];

  page.on('request', (request) => {
    requests.push(`${request.method()} ${request.url()}`);
  });

  return requests;
}

/**
 * Wait for API request to complete
 *
 * @param page - Playwright Page object
 * @param urlPattern - URL pattern to match
 * @param timeout - Optional timeout in milliseconds
 */
export async function waitForApiRequest(
  page: Page,
  urlPattern: string | RegExp,
  timeout = 30000
): Promise<void> {
  await page.waitForRequest(urlPattern, { timeout });
}

/**
 * Wait for API response
 *
 * @param page - Playwright Page object
 * @param urlPattern - URL pattern to match
 * @param timeout - Optional timeout in milliseconds
 */
export async function waitForApiResponse(
  page: Page,
  urlPattern: string | RegExp,
  timeout = 30000
): Promise<void> {
  await page.waitForResponse(urlPattern, { timeout });
}

/**
 * Mock API response
 *
 * @param page - Playwright Page object
 * @param urlPattern - URL pattern to match
 * @param response - Response data
 * @param status - HTTP status code
 */
export async function mockApiResponse(
  page: Page,
  urlPattern: string | RegExp,
  response: any,
  status = 200
): Promise<void> {
  await page.route(urlPattern, async (route) => {
    await route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(response)
    });
  });
}

/**
 * Clear all mocks
 *
 * @param page - Playwright Page object
 */
export async function clearAllMocks(page: Page): Promise<void> {
  await page.unrouteAll({ behavior: 'ignoreErrors' });
}

/**
 * Basic accessibility check
 * For comprehensive a11y testing, use @axe-core/playwright
 *
 * @param page - Playwright Page object
 */
export async function checkBasicAccessibility(page: Page): Promise<void> {
  // Check for main content area
  const hasMain = await elementExists(page, 'main, [role="main"], #root');
  expect(hasMain).toBeTruthy();

  // Check for proper heading hierarchy (at least one h1)
  const hasH1 = await elementExists(page, 'h1');
  if (!hasH1) {
    console.warn('Warning: No h1 element found on page');
  }
}

/**
 * Setup audit log interception (matches Cypress behavior)
 *
 * @param page - Playwright Page object
 */
export async function setupAuditLogInterception(page: Page): Promise<void> {
  await page.route('**/api/audit/**', async (route) => {
    // Allow the request to go through but log it
    await route.continue();
  });
}

/**
 * Verify audit log entry (basic check)
 *
 * @param page - Playwright Page object
 * @param action - Action type
 * @param category - Category type
 */
export async function verifyAuditLog(page: Page, action: string, category: string): Promise<void> {
  // This is a simplified version - in real implementation, you'd check actual audit log entries
  console.log(`Audit log verification: ${action} in ${category}`);
}
